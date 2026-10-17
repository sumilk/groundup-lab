"""Frame QA for a rendered scene: one frame near the end of every narration beat.

usage: <venv>/python qa.py <module> <SceneClass> [quality_dir=480p15]   (needs Pillow: use the Manim venv)
Writes contact sheets (3x3, beat-numbered) to outputs/la01v3/qa/<SceneClass>_NN.png and prints their paths.
Look at every sheet: overlaps, text off-screen (x outside ±6.8), labels left over from earlier beats,
unreadable sizes, readouts that contradict the narration.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parents[2] / "outputs" / "la01v3"


def main(mod, cls, q="480p15"):
    video = OUT / "media" / "videos" / mod / q / f"{cls}.mp4"
    cues = json.loads((OUT / "cues" / f"{cls}.json").read_text())
    qa = OUT / "qa"
    qa.mkdir(parents=True, exist_ok=True)
    tmp = qa / f".{cls}"
    tmp.mkdir(exist_ok=True)
    frames = []
    for i, c in enumerate(cues):
        t = c["start"] + 0.9 * (c["end"] - c["start"])
        f = tmp / f"{i:03d}.png"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", str(video), "-frames:v", "1",
                        "-vf", "scale=640:-1", str(f)], check=True)
        from PIL import Image, ImageDraw
        im = Image.open(f).convert("RGB")
        d = ImageDraw.Draw(im)
        d.rectangle([0, im.height - 22, 70, im.height], fill=(0, 0, 0))
        d.text((6, im.height - 19), f"beat {i}", fill=(255, 220, 0))
        im.save(f)
        frames.append(f)
    sheets = []
    for k in range(0, len(frames), 9):
        group = frames[k:k + 9]
        while len(group) < 9:
            group.append(group[-1])
        out = qa / f"{cls}_{k // 9:02d}.png"
        inputs = sum((["-i", str(g)] for g in group), [])
        fc = "[0][1][2]hstack=3[a];[3][4][5]hstack=3[b];[6][7][8]hstack=3[c];[a][b][c]vstack=3"
        subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", fc, str(out)], check=True)
        sheets.append(out)
    for s in sheets:
        print(s)


if __name__ == "__main__":
    main(*sys.argv[1:])
