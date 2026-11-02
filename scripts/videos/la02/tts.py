"""Voice each narration paragraph in one Kokoro call, then cut it into per-beat clips.

usage: .venv/bin/python tts.py <module> ...   (scene modules whose NarrationMixin classes define PARAS)

Cached by paragraph text, voice and speed: editing one paragraph re-voices only that paragraph. Beat
boundaries come from Kokoro's word timestamps; each cut falls at the quietest 10 ms between the last word
of one beat and the first word of the next. A cut that is not in a pause is reported, because it would
split a word (end beats at sentence ends, not mid-phrase).
"""
import importlib
import inspect
import os
import re
import sys
import time
from pathlib import Path

import numpy as np
import soundfile as sf

from common import AUDIO, SPEED, VOICE, NarrationMixin, beat_file

SR = 24000
FRAME = int(0.01 * SR)


def collect(modules):
    paras = []
    for modname in modules:
        mod = importlib.import_module(modname)
        for _, cls in inspect.getmembers(mod, inspect.isclass):
            if issubclass(cls, NarrationMixin) and cls.__module__ == modname and cls.PARAS:
                paras.extend(cls.PARAS)
    return paras


def alnum(s):
    return len(re.sub(r"[^A-Za-z0-9]", "", s))


def synth(pipe, text):
    """Audio plus word timings (start, end, text) for the whole paragraph, across Kokoro's internal chunks."""
    audio, words, offset = [], [], 0.0
    for r in pipe(text, voice=VOICE, speed=SPEED, split_pattern=None):
        a = r.audio.numpy()
        for t in r.tokens:
            if t.start_ts is not None and alnum(t.text):
                words.append((t.start_ts + offset, t.end_ts + offset, t.text))
        audio.append(a)
        offset += len(a) / SR
    return np.concatenate(audio), words


def cut_points(audio, words, par):
    """Sample index where each beat after the first starts."""
    rms = np.sqrt(np.convolve(audio ** 2, np.ones(FRAME) / FRAME, mode="same"))
    speech = float(np.sqrt(np.mean(audio ** 2)))
    cuts, wi, issues = [], 0, []
    for k, beat in enumerate(par[:-1]):
        need, got = alnum(beat), 0
        while got < need and wi < len(words):
            got += alnum(words[wi][2])
            wi += 1
        if got != need:
            issues.append(f"beat {k}: word timings do not line up with the text ({got} vs {need} letters)")
        t0, t1 = words[wi - 1][1], words[wi][0] if wi < len(words) else len(audio) / SR
        lo, hi = int((t0 - 0.03) * SR), int((t1 + 0.03) * SR)
        lo, hi = max(lo, 0), min(max(hi, lo + 1), len(audio))
        c = lo + int(np.argmin(rms[lo:hi]))
        if rms[c] > 0.05 * speech:
            issues.append(f"beat {k}->{k + 1}: cut is not in a pause (level {rms[c] / speech:.2f} of speech)")
        cuts.append(c)
    return cuts, issues


def main(modules):
    AUDIO.mkdir(parents=True, exist_ok=True)
    paras = list({"\n".join(p): p for p in collect(modules)}.values())
    todo = [p for p in paras if not all(beat_file(p, i).exists() for i in range(len(p)))]
    print(f"{len(paras)} paragraphs, {len(todo)} to voice", flush=True)
    if todo:
        from kokoro import KPipeline
        pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
        t_start = time.time()
        for n, par in enumerate(todo, 1):
            audio, words = synth(pipe, " ".join(par))
            cuts, issues = cut_points(audio, words, par)
            for msg in issues:
                print(f"  ! {par[0][:50]!r}: {msg}", flush=True)
            bounds = [0, *cuts, len(audio)]
            for i in range(len(par)):
                out = beat_file(par, i)
                tmp = out.with_suffix(f".{os.getpid()}.tmp.wav")
                sf.write(tmp, audio[bounds[i]:bounds[i + 1]], SR)
                os.replace(tmp, out)
            print(f"  {n}/{len(todo)}  ({time.time() - t_start:.0f}s)", flush=True)
    total = sum(sf.info(str(beat_file(p, i))).duration for p in paras for i in range(len(p)))
    words = sum(len(b.split()) for p in paras for b in p)
    print(f"narration {total / 60:.1f} min · {words} words · {words / (total / 60):.0f} words/min (excl. pauses)")


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    main(sys.argv[1:])
