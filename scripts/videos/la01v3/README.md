# LA01 v3 — concept-first lesson video

One video for the lesson (~66 min, 12 chapters). Narration comes from
[`docs/LA01_VIDEO_V3_SCRIPT.md`](../../../docs/LA01_VIDEO_V3_SCRIPT.md); reviews are in
`docs/LA01_VIDEO_V3_REVIEW.md` and `docs/LA01_VIDEO_V3_PILOT_REVIEW.md`. Scene-author conventions: [`BRIEF.md`](BRIEF.md).

## Setup (once)

- Python 3.12 venv with `manim==0.22.0 kokoro-onnx soundfile numpy espeakng-loader`; system `ffmpeg`, `cairo`, `pango`
  (Homebrew). No LaTeX needed. Fonts: Helvetica Neue and STIX Two Text/Math (macOS).
- Voice model (Kokoro, Apache-2.0) in `outputs/tts/` (git-ignored): `kokoro-v1.0.onnx`, `voices-v1.0.bin`, and a copy of
  `espeakng_loader`'s `espeak-ng-data` folder as `outputs/tts/esd` (espeak-ng needs a data path under ~160 characters).

## Build

```sh
PY=<venv>/bin/python
$PY tts.py                       # synthesise all narration (cached by text, voice and speed)
$PY build.py --quality 480       # quick preview of every scene
$PY qa.py v3_act3 V3Act3         # contact sheets: one frame at the end of every beat
$PY build.py                     # 1440p render, stitch, chapters, captions, YouTube description
```

Generated media goes to `outputs/la01v3/` (git-ignored); the deliverables land in `outputs/la01v3/final/`.

## Conventions

- `scenes_order.py` lists the scenes in playback order and their chapter titles.
- A beat prefixed `SLOW|` is narrated at the technical speed (≈160 words/min); other beats ≈186 words/min.
- `common.M()` routes ∉-style glyphs through STIX Two Math (STIX Two Text draws ∉ like ∈);
  `common.P()` replaces Pango `<sub>`, which Helvetica renders nearly invisibly.
