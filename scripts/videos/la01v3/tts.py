"""Synthesize narration beats with Kokoro (local neural TTS), cached by text hash.

usage: python tts.py s02_axioms s03_operations ...   (module names; default: scenes_order.MODULES)
Safe to run concurrently for different modules: each clip is its own file, written atomically.
"""
import importlib
import inspect
import os
import sys
import time
from pathlib import Path

import espeakng_loader
import numpy as np
import soundfile as sf
from kokoro_onnx import EspeakConfig, Kokoro

from common import AUDIO, TTS_MODELS, VOICE, NarrationMixin, audio_duration, audio_file, beat_parts


def collect(modules):
    beats = []
    for modname in modules:
        mod = importlib.import_module(modname)
        for _, cls in inspect.getmembers(mod, inspect.isclass):
            if issubclass(cls, NarrationMixin) and cls.__module__ == modname and cls.BEATS:
                beats.extend(cls.BEATS)
    return beats


def main(modules):
    AUDIO.mkdir(exist_ok=True)
    beats = collect(modules)
    todo = [b for b in dict.fromkeys(beats) if not audio_file(b).exists()]
    print(f"{len(beats)} beats, {len(todo)} to synthesize", flush=True)
    if todo:
        k = Kokoro(str(TTS_MODELS / "kokoro-v1.0.onnx"), str(TTS_MODELS / "voices-v1.0.bin"),
                   espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(),
                                              data_path=str(TTS_MODELS / "esd")))
        t0 = time.time()
        for i, text in enumerate(todo, 1):
            spoken, speed = beat_parts(text)
            samples, sr = k.create(spoken, voice=VOICE, speed=speed, lang="en-us")
            s = np.asarray(samples)
            nz = np.where(np.abs(s) > 0.01)[0]
            if len(nz):
                s = s[max(0, nz[0] - int(0.03 * sr)): min(len(s), nz[-1] + int(0.12 * sr))]
            out = audio_file(text)
            tmp = out.with_suffix(f".{os.getpid()}.tmp.wav")
            sf.write(tmp, s, sr)
            os.replace(tmp, out)
            if i % 10 == 0 or i == len(todo):
                print(f"  {i}/{len(todo)}  ({time.time() - t0:.0f}s)", flush=True)
    total = sum(audio_duration(b) for b in beats)
    words = sum(len(beat_parts(b)[0].split()) for b in beats)
    print(f"total narration {total / 60:.1f} min · {words} words · {words / (total / 60):.0f} words/min")


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    mods = sys.argv[1:]
    if not mods:
        from scenes_order import MODULES as mods
    main(mods)
