# LA02: concept-first lesson video

One video for the lesson, about 80 min across 14 sections. The sections are named only by their titles; YouTube chapters show titles with no numbers.

| Doc | What it holds |
|---|---|
| [`docs/LA02_VIDEO_VOICE_PLAN.md`](../../../docs/LA02_VIDEO_VOICE_PLAN.md) | The standard, the gates and the naming rule |
| [`docs/LA02_VIDEO_SCRIPT.md`](../../../docs/LA02_VIDEO_SCRIPT.md) | The reviewed script and storyboard |
| [`docs/LA02_VIDEO_LISTENING_REVIEW.md`](../../../docs/LA02_VIDEO_LISTENING_REVIEW.md) | Voice choice and the status of each gate (the newcomer check is still pending) |
| [`BRIEF.md`](BRIEF.md) | Conventions for scene authors |

## Setup (once)
Create a Python 3.12 venv at `.venv` (git-ignored):
```sh
uv venv --python 3.12 .venv
uv pip install --python .venv/bin/python "kokoro>=0.9.4" soundfile numpy espeakng-loader faster-whisper "manim==0.22.0" pillow
```
You also need system `ffmpeg`, `cairo` and `pango`. Kokoro downloads its model from Hugging Face on first use.

## Narration
- A scene's `PARAS` is a list of paragraphs, each a list of beats.
- `tts.py` voices each paragraph in one Kokoro call (voice `af_heart`, speed 0.95) and cuts it into beats at word timestamps. It flags any cut that isn't in a pause.
- Silences are authored with `self.pause(n)`; there is no fixed gap between beats.

## Build
```sh
.venv/bin/python tts.py <module>          # voice a section (cached by paragraph)
.venv/bin/python qa.py <module> <Class>   # contact sheets, one frame per beat
.venv/bin/python build.py                 # 1440p render, stitch, chapters, captions, YouTube description
.venv/bin/python build.py --stitch-only   # re-stitch existing renders
```
Output goes to `outputs/la02/` (git-ignored). The final video is in `outputs/la02/final/`.

## Files
- `sample.py`: the approved two-minute style reference.
- `01_one_system.py` … `14_close.py`: the sections, in the order given in `scenes_order.py`.
- `voice_test.py`: the step-2 delivery comparison.
