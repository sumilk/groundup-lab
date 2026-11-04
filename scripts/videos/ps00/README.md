# PS00: concept-first lesson video

One video for *Probability foundations from finite events*, about 70–80 min across 12 sections. The sections are named only by their titles; YouTube chapters show titles with no numbers.

| Doc | What it holds |
|---|---|
| [`docs/PS00_VIDEO_PLAN.md`](../../../docs/PS00_VIDEO_PLAN.md) | The standard (including the Stat 110-style teaching moves), the gates and the decisions |
| [`docs/PS00_VIDEO_PLAN_REVIEW.md`](../../../docs/PS00_VIDEO_PLAN_REVIEW.md) | The plan review the v2 plan responds to |
| [`docs/PS00_VIDEO_SPOKEN_OUTLINE.md`](../../../docs/PS00_VIDEO_SPOKEN_OUTLINE.md) | The read-aloud outline from the hook to Bayes |
| [`docs/PS00_VIDEO_SCRIPT.md`](../../../docs/PS00_VIDEO_SCRIPT.md) | The script and storyboard |
| [`BRIEF.md`](BRIEF.md) | Conventions for scene authors |

## Setup
The pipeline is copied from `scripts/videos/la02/`, and `.venv` is a symlink to that folder's venv (see its README for how to create it).

## Build
```sh
.venv/bin/python tts.py <module>          # voice a section (cached by paragraph)
.venv/bin/python qa.py <module> <Class>   # contact sheets, one frame per beat
.venv/bin/python build.py                 # 1440p render, stitch, chapters, captions, YouTube description
.venv/bin/python build.py --stitch-only   # re-stitch existing renders
```
Output goes to `outputs/ps00/` (git-ignored). The final video is in `outputs/ps00/final/`.

## Files
- `kit.py`: shared pictures (dice grid, loaded die, bag, tree, detector card).
- `04_shrinks_world.py`: the reference scene for style.
- `01_ninety_five.py` … `12_machine_learning.py`: the sections, in the order given in `scenes_order.py`.
