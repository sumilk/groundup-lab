"""Step 2 of docs/LA02_VIDEO_VOICE_PLAN.md: render the approved test passage in several deliveries.

usage: .venv/bin/python voice_test.py            -> outputs/la02/voice-test/*.wav + listening sheet

Each variant changes one thing from the one before it, so a difference you hear has one cause:
  V0  LA01 pipeline: one synthesis per beat, 0.3 s gap, technical beats at 0.82, edges trimmed to 30/120 ms
  V1  one synthesis per paragraph, natural edges, authored pauses only (af_heart, 0.95)
  V2  V1 with punctuation shaped for delivery (full stops where a pause is wanted, equation in spoken chunks)
  V3* V2 text with other voices / speed 1.0
"""
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from kokoro import KPipeline

REPO = Path(__file__).resolve().parents[3]
OUT = REPO / "outputs" / "la02" / "voice-test"
SR = 24000

# (paragraph, authored pause after it in seconds). Pauses marked ⏸ in the passage are thinking pauses;
# the others are time for the picture to change between paragraphs.
PASSAGE = [
    ("Here are two equations of the kind you've solved in school. Two x minus y equals one. "
     "And x plus y equals five.", 0.8),
    ("On its own, each equation is a line: every point on it makes that equation true. "
     "A point on both lines makes both true. So the solution is wherever they cross.", 2.0),   # ⏸ read the crossing
    ("Two across, three up. x is two, and y is three.", 1.0),
    ("Read the same equations down the columns instead of across the rows. The numbers beside x are two and one. "
     "The numbers beside y are minus one and one. Each column is an arrow: blue goes two right and one up, "
     "teal goes one left and one up. The numbers on the right, one and five, are a target.", 0.6),
    ("Put the columns side by side and you have the matrix A. And the equations are asking the question from "
     "chapter one: how much blue, and how much teal, reaches the target?", 0.8),
    ("We've already found an answer on the left: two and three. So take two blue arrows, then three teal ones. "
     "Where do you think you'll end up?", 3.0),                                                # ⏸ predict
    ("Two blues: four right, two up. Three teals: three left, three up. Across, four minus three is one. "
     "Up, two plus three is five. One, five: exactly the target.", 1.5),                       # ⏸ read the sum
    ("So the same pair, two and three, has two jobs. On the left it's a place: where the lines cross. "
     "On the right it's a recipe: the amounts that reach the target.", 0.8),
    ("With two unknowns, you can draw the lines. With seven hundred and sixty-eight unknowns, you can't draw "
     "anything. But you can still ask whether these columns can reach the target.", 0.0),
]

# V2: same words, punctuation shaped for Kokoro (it does not pause at colons; full stops and dashes it does).
PASSAGE_V2 = list(PASSAGE)
PASSAGE_V2[1] = ("On its own, each equation is a line. Every point on it makes that equation true. "
                 "A point on both lines makes both true. So the solution is... wherever they cross.", 2.0)
PASSAGE_V2[3] = ("Read the same equations down the columns, instead of across the rows. The numbers beside x are "
                 "two, and one. The numbers beside y are minus one, and one. Each column is an arrow. "
                 "Blue goes two right and one up. Teal goes one left and one up. "
                 "And the numbers on the right, one and five, are a target.", 0.6)
PASSAGE_V2[6] = ("Two blues. That's four right, two up. Three teals. Three left, three up. "
                 "Across, four minus three, is one. Up, two plus three, is five. One, five. Exactly the target.", 1.5)
PASSAGE_V2[7] = ("So the same pair, two and three, has two jobs. On the left, it's a place. Where the lines cross. "
                 "On the right, it's a recipe. The amounts that reach the target.", 0.8)

# V0 beats: the passage split the way LA01 split it (one beat per sentence/reveal), technical beats SLOW.
SLOW = {"Two x minus y equals one.", "And x plus y equals five.", "Two blues: four right, two up.",
        "Three teals: three left, three up.", "Across, four minus three is one.", "Up, two plus three is five."}


def sentences(par):
    out, cur = [], ""
    for ch in par:
        cur += ch
        if ch in ".?" and not cur.endswith(".."):
            out.append(cur.strip())
            cur = ""
    if cur.strip():
        out.append(cur.strip())
    return out


def synth(pipe, text, voice, speed):
    chunks = [r.audio.numpy() for r in pipe(text, voice=voice, speed=speed, split_pattern=None)]
    return np.concatenate(chunks)


def silence(s):
    return np.zeros(int(s * SR), dtype=np.float32)


def render_v0(pipe):
    parts = []
    for par, pause in PASSAGE:
        for i, s in enumerate(sentences(par)):
            a = synth(pipe, s, "af_heart", 0.82 if s in SLOW else 0.95)
            nz = np.where(np.abs(a) > 0.01)[0]
            a = a[max(0, nz[0] - int(0.03 * SR)): nz[-1] + int(0.12 * SR)]
            parts += [a, silence(0.3)]
        parts.append(silence(pause))
    return np.concatenate(parts)


def render_paragraphs(pipe, passage, voice, speed):
    parts = []
    for par, pause in passage:
        parts += [synth(pipe, par, voice, speed), silence(pause)]
    return np.concatenate(parts)


def loudnorm(src, dst):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src),
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", str(SR), str(dst)], check=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    bpipe = KPipeline(lang_code="b", repo_id="hexgrad/Kokoro-82M")   # British English voices
    blend = 0.7 * pipe.load_voice("af_heart") + 0.3 * pipe.load_voice("af_bella")

    variants = {
        "V0_la01_pipeline": lambda: render_v0(pipe),
        "V1_paragraph": lambda: render_paragraphs(pipe, PASSAGE, "af_heart", 0.95),
        "V2_paragraph_punct": lambda: render_paragraphs(pipe, PASSAGE_V2, "af_heart", 0.95),
        "V3a_heart_speed1.0": lambda: render_paragraphs(pipe, PASSAGE_V2, "af_heart", 1.0),
        "V3b_bella": lambda: render_paragraphs(pipe, PASSAGE_V2, "af_bella", 0.95),
        "V3c_heart70_bella30": lambda: render_paragraphs(pipe, PASSAGE_V2, blend, 0.95),
        "V3d_emma_british": lambda: render_paragraphs(bpipe, PASSAGE_V2, "bf_emma", 0.95),
        "V3e_michael_male": lambda: render_paragraphs(pipe, PASSAGE_V2, "am_michael", 0.95),
    }
    for name, fn in variants.items():
        with torch.no_grad():
            audio = fn()
        raw = OUT / f".{name}.raw.wav"
        sf.write(raw, audio, SR)
        loudnorm(raw, OUT / f"{name}.wav")
        raw.unlink()
        print(f"{name}: {len(audio) / SR:.1f} s", flush=True)


if __name__ == "__main__":
    main()
