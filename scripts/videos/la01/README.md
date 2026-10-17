# LA01: concept-led lesson video

One lesson, one video, normally 60–90 minutes. This edition is approximately
73 minutes. It is an authored edit: new opening, conceptual bridges and ending,
selected existing mathematical animations, and explicit narration replacements.
The exercise tour, syllabus roadmap, exhaustive axiom proofs and repeated formal
developments are omitted. Narration is never accelerated to meet a length.

## Sources

- `editorial.py`: chapter order, new passages, selected source beats, corrections.
- `new_scenes.py`: vector-native Manim animations and thumbnail.
- `produce.py`: local voice synthesis, rendering, assembly, captions, metadata.
- `docs/LA01_VIDEO_SCRIPT_AND_STORYBOARD.md`: complete compiled narration in the repo.

Media is generated in `outputs/la01-concept-led`. The delivery package goes to
`~/Downloads/GroundUp Lab YouTube/LA01 concept-led revision`. The original is preserved.

## Dependencies

Python 3.12; `manim==0.22.0`, `kokoro-onnx==0.6.1`, `espeakng-loader==0.2.4`,
`soundfile==0.14.0`, `numpy==2.5.4`; system FFmpeg, Cairo and Pango; Helvetica Neue
and STIX Two Text fonts on this Mac. No LaTeX, cloud TTS, or API key is needed.
Assembly uses libx264. Hardware encoding was rejected after decode checks found
a malformed frame; software encoding is the reliable delivery path for this build.

The reference directory contains original scene `.py` files, `cues/`,
`out/sections/`, `audio/`, `models/kokoro-v1.0.onnx`, `models/voices-v1.0.bin`,
and `esd/`. The production archive preserves inputs outside temporary storage.
`source-inputs.json` records source scripts and cue hashes, sizes, and durations.

## Build

Use a Python environment containing the dependencies above:

```sh
python scripts/videos/la01/produce.py compile --reference /path/to/reference --output /path/to/output
python scripts/videos/la01/produce.py voice --reference /path/to/reference --output /path/to/output
python scripts/videos/la01/produce.py fresh --reference /path/to/reference --output /path/to/output
python scripts/videos/la01/produce.py assemble --reference /path/to/reference --output /path/to/output
```

`all` runs all stages. `source-shots` can encode retained illustrations while
`fresh` renders new scenes. Rebuilding skips shots whose content signature is
unchanged. After animation code or encoder changes, remove affected signatures.

`compile` writes the full script first. `voice` measures audio and rejects a
timeline outside 60–90 minutes. Fresh scenes record exact cue boundaries. Assembly
keeps each retained beat's full action and retimes visuals to narration; speech
always plays at native speed.

Thumbnail:

```sh
LA01_OUTPUT=/path/to/output python -m manim -s --resolution 1280,720 \
  --media_dir /path/to/output/thumbnail scripts/videos/la01/new_scenes.py Thumbnail
```

## Outputs and validation

The final package contains `LA01_concept_led.mp4` (1080p30, audio, chapters),
`LA01_captions.en.srt`, `youtube_thumbnail.png`, title, description, upload metadata,
the script, timeline, source manifest and validation report. Captions are timed
proportionally within spoken beats; they are not word-level forced alignment.

Review the opening preview, sampled frames at chapter entries and changed
illustration boundaries, transitions, mathematical examples, audio levels,
caption coverage and decode integrity. A sampled review is not a continuous
viewing of the entire export.

## YouTube delivery

The user authorised public upload to `@grounduplab-ai`, channel
`UCmBIPSDEB4ZhvBBPJ2wDSwQ`, inside its existing **Linear Algebra** playlist,
with thumbnail, description, captions and chapters. Preserve existing uploads.

The correct channel's Studio tab is open in Chrome. Browser control requires
**View → Developer → Allow JavaScript from Apple Events**, enabled by the user.
Do not change that setting programmatically or extract browser cookies/tokens.
Record a video URL and playlist result only after YouTube confirms them.
