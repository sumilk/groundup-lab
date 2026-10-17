"""Render every LA01 v3 scene, stitch one video, and write the YouTube package.

usage: <venv>/python build.py [--quality 1440|480] [--jobs N] [--only v3_act2 ...] [--stitch-only]
Outputs go to outputs/la01v3/final/: the MP4 (with chapters), English captions (.srt),
youtube_description.txt (chapter link + timestamps) and chapters.json.
"""
import argparse
import json
import re
import subprocess
import sys
import textwrap
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from common import CUES, OUT  # noqa: E402
from scenes_order import SCENES, TITLES  # noqa: E402

VENV = Path(sys.executable).parent
CHAPTER_URL = "https://lab.groundup.workers.dev/theory/#02-linear-algebra%2F01-vectors-spaces-bases.md"
SITE_URL = "https://lab.groundup.workers.dev"
CHANNEL_URL = "https://www.youtube.com/@grounduplab-ai"
QUALITY = {"1440": ("2560,1440", "1440p30", ["--frame_rate", "30"]), "480": (None, "480p15", ["-ql"])}


def video_path(mod, cls, q):
    return OUT / "media" / "videos" / mod / QUALITY[q][1] / f"{cls}.mp4"


def render(job):
    (mod, cls), q = job
    res, _, extra = QUALITY[q]
    cmd = [str(VENV / "manim"), *extra, "--disable_caching", "--progress_bar", "none", "-v", "WARNING",
           "--media_dir", str(OUT / "media")]
    if res:
        cmd += ["--resolution", res]
    cmd += [f"{mod}.py", cls]
    r = subprocess.run(cmd, cwd=HERE, capture_output=True, text=True)
    ok = r.returncode == 0 and video_path(mod, cls, q).exists()
    print(f"[{'ok' if ok else 'FAIL'}] {mod}.{cls}", flush=True)
    if not ok:
        print(r.stderr[-3000:], flush=True)
    return ok


def duration(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                          "-of", "csv=p=0", str(p)]).strip())


def ts(sec, srt=True):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}" if srt else (f"{h}:{m:02}:{s:02}" if h else f"{m}:{s:02}")


def caption_chunks(text, start, end, max_chars=84):
    sents = re.split(r"(?<=[.?!])\s+", text.strip())
    pieces = []
    for snt in sents:
        while len(snt) > max_chars:
            cut = max((snt.rfind(sep, 0, max_chars) for sep in (", ", "; ", ": ")), default=-1)
            if cut < 25:
                cut = snt.rfind(" ", 0, max_chars)
            pieces.append(snt[:cut + 1].strip())
            snt = snt[cut + 1:].strip()
        if snt:
            pieces.append(snt)
    total = sum(len(x) for x in pieces) or 1
    t, out = start, []
    for x in pieces:
        d = (end - start) * len(x) / total
        out.append((t, t + d, x))
        t += d
    return out


def stitch(q):
    final = OUT / "final"
    final.mkdir(parents=True, exist_ok=True)
    parts = [video_path(m, c, q) for m, c in SCENES]
    missing = [str(p) for p in parts if not p.exists()]
    if missing:
        sys.exit("missing renders:\n" + "\n".join(missing))
    (final / "concat.txt").write_text("".join(f"file '{p}'\n" for p in parts))
    meta = [";FFMETADATA1", "title=Linear Algebra 1 — Vectors, span, independence and bases", "artist=GroundUp Lab"]
    chapters, srt, n, t0 = [], [], 1, 0.0
    for (m, c), p in zip(SCENES, parts):
        d = duration(p)
        chapters.append((t0, TITLES[m]))
        meta += ["[CHAPTER]", "TIMEBASE=1/1000", f"START={int(t0 * 1000)}", f"END={int((t0 + d) * 1000)}",
                 f"title={TITLES[m]}"]
        cues = json.loads((CUES / f"{c}.json").read_text())
        for cue in cues:
            for a, b, txt in caption_chunks(cue["text"], t0 + cue["start"], t0 + cue["end"]):
                srt.append(f"{n}\n{ts(a)} --> {ts(b)}\n" + "\n".join(textwrap.wrap(txt, 46)) + "\n")
                n += 1
        t0 += d
    (final / "chapters.txt").write_text("\n".join(meta) + "\n")
    joined = final / "joined.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(final / "concat.txt"),
                    "-c", "copy", str(joined)], check=True)
    mp4 = final / "LA01_vectors_span_independence_bases.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(joined), "-i", str(final / "chapters.txt"),
                    "-map_metadata", "1", "-map_chapters", "1", "-c:v", "copy",
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
                    "-movflags", "+faststart", str(mp4)], check=True)
    joined.unlink()
    (final / "LA01_captions.en.srt").write_text("\n".join(srt))
    (final / "chapters.json").write_text(json.dumps([{"t": round(a), "title": b} for a, b in chapters], indent=1))
    desc = [
        "Linear Algebra 1 — Vectors, span, independence and bases",
        "",
        "Given some arrows, where can you get to? Starting from a craft with two controls, this lesson builds the "
        "core ideas of linear algebra — vectors, linear combinations, span, linear independence, bases and "
        "coordinates, dimension, subspaces and direct sums, affine sets, matrices as column combinations, inner "
        "products, and conditioning — introducing every idea through a picture or analogy and then making it precise.",
        "",
        "📖 Read this chapter (full proofs, worked examples, exercises and in-browser labs):",
        CHAPTER_URL,
        "",
        "🧪 GroundUp Lab — machine learning math, built from the ground up:",
        SITE_URL,
        "",
        f"Subscribe for the next chapter: {CHANNEL_URL}",
        "",
        "Chapters",
        *[f"{ts(a, srt=False)} {b}" for a, b in chapters],
        "",
        "#linearalgebra #machinelearning #math",
    ]
    (final / "youtube_description.txt").write_text("\n".join(desc) + "\n")
    print(f"wrote {mp4}  ({t0 / 60:.1f} min, {len(chapters)} chapters, {n - 1} caption cues)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--quality", choices=QUALITY, default="1440")
    ap.add_argument("--jobs", type=int, default=3)
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--stitch-only", action="store_true")
    a = ap.parse_args()
    if not a.stitch_only:
        todo = [s for s in SCENES if not a.only or s[0] in a.only]
        subprocess.run([sys.executable, "tts.py", *dict.fromkeys(m for m, _ in todo)], cwd=HERE, check=True)
        with ThreadPoolExecutor(a.jobs) as ex:
            ok = list(ex.map(render, [(s, a.quality) for s in todo]))
        if not all(ok):
            sys.exit("some renders failed")
    if not a.only:
        stitch(a.quality)


if __name__ == "__main__":
    main()
