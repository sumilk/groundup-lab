# LA02 video: brief for scene authors

You are building one or more sections of a narrated Manim lesson video. The script is written and reviewed, and the visual style is approved. Your job is to turn your sections into scenes that look and sound like the approved reference. All paths are relative to `/Users/sumilkhosla/workspace/groundup-lab`.

## Read first, in this order
1. `docs/LA02_VIDEO_VOICE_PLAN.md` §0 and §2 C–D: the standard. Every choice is judged by *does this feel like someone guiding me through the mathematics?* and *is it intuitive for someone new to the material?*
2. `docs/LA02_VIDEO_SCRIPT.md`: the header ("Reading this script", "Cast") and **your sections only**. NARRATION blocks are spoken. VISUAL, PRECISE — VISUAL and HIDDEN UNTIL AFTER ⏸ lines define the screen.
3. `scripts/videos/la02/sample.py` and `scripts/videos/la02/01_one_system.py`: **the approved reference.** Copy their structure, pacing, layout constants and helpers: `panel`, `eq_cells`, `recipe_eq`, `walk`, the `b3` oblique 3-D box, label backgrounds, and how `say()`/`pause()` drive the timing. Import what you need (`from sample import ...`, or `importlib.import_module("01_one_system")` for its helpers).
4. `scripts/videos/la02/common.py`: helpers `T M P plane vec vec_between dot matrix_mob column_vec boxed`, the palette `C_U C_Q C_V C_W C_X C_P C_DIM C_GRID`, and the narration engine (`PARAS`, `say`, `pause`, `until_end`, `done`, `clear_all`).

## How narration works
- `PARAS` is a list of paragraphs, and each paragraph is a list of beats (strings). `tts.py` voices each paragraph in one go and cuts it into beats at word timestamps. **End every beat at a full stop or question mark, never mid-sentence or at a colon or comma**, or the cut can split a word. `tts.py` prints `!` for any cut that isn't in a pause: fix every one by re-splitting the beats.
- One beat per reveal: anything a sentence introduces appears **during that sentence's beat**. Split paragraphs into beats so reveals land with their sentence.
- NARRATION text goes in **exactly as written in the script**. Don't add, drop or rephrase. A new paragraph block in the script is a new `PARAS` entry.
- `self.say()` starts the next beat and returns its duration `d`; size animations to `d`. Within a paragraph there is no added gap.
- Each **⏸ n** in the script is `self.pause(n)` at that point. There are no other silences, except a short `self.pause(0.4–0.8)` between paragraphs when the picture needs time to change.
- Before every prediction pause, nothing listed on the script's **HIDDEN UNTIL AFTER ⏸** line may be on screen. Check this specifically on the QA sheets.

## Visual rules (non-negotiable)
- Two spaces are **never merged into one plane**. Use an input panel on the left and an output panel on the right, joined by the map, with the titles **input: the amounts (…)** / **output: where the amounts land** and A centred below and between the panels. Use the layout constants from `sample.py` (`UNIT`, `LEFT_C`, `RIGHT_C`, `TOP_Y`).
- One mathematical picture per idea, developed as the explanation goes. Movement shows a relationship or a calculation.
- **No title cards, no section headers on screen, no typed-out sentences, no decorative motion** (pulses or glows without meaning). Use `Indicate` only to point at the thing the narration names. A change of picture is a teaching event: transform related pictures, and clear only when the topic changes.
- On-screen text is only labels, the equation being worked, and a term at the moment it is named (`TERM ▸` in the script).
- Keep the cast and colours from the script's Cast table, and never change what a colour means. No LaTeX: never use MathTex/Tex/DecimalNumber/Integer/Matrix. Use `M()` for maths, `P()` for prose and `matrix_mob()` for matrices.
- Frame is 14.2 × 8 units. Keep everything inside x ∈ [−6.9, 6.9], y ∈ [−3.9, 3.9]. Text must be readable at 480p: `P` size ≥ 22, `M` size ≥ 24. Fit wide equations by splitting lines, not by shrinking below those sizes.
- Clean exits: every label and helper leaves once its job is done. Readouts never contradict the narration.
- Each scene starts from an empty screen and builds directly; there is no intro card. Each ends with `self.done()` then `self.clear_all()`.
- Where the script gives exact visuals that can't fit on screen (off-grid paths, etc.), make the smallest change that keeps the maths identical and **report it**. Don't silently change maths or narration.

## Files and names
One file per section, `scripts/videos/la02/<module>.py` with the class given in `scenes_order.py`. Don't edit `common.py`, `tts.py`, `qa.py`, `sample.py`, `01_one_system.py`, `scenes_order.py`, the docs, or other authors' files. Put helpers in your own file.

## Commands (run from `scripts/videos/la02`)
```bash
.venv/bin/python tts.py <module>                     # voice your paragraphs (cached); fix every "!" line
.venv/bin/manim -ql --disable_caching --progress_bar none -v WARNING \
   --media_dir ../../../outputs/la02/media <module>.py <Class>
.venv/bin/python qa.py <module> <Class>              # contact sheets: one frame per beat -> outputs/la02/qa/
```
**Read every QA sheet** with the Read tool. Note that the black "beat N" tag covers the bottom-left corner of each frame, so if something is hidden there, grab a raw frame with ffmpeg. Iterate until there are no overlaps, nothing is off screen, nothing is left over from earlier beats, nothing is illegible, no answer shows before its pause, and nothing contradicts the narration. Ignore pydub SyntaxWarnings.

When the 480p preview is clean, render the final:
```bash
.venv/bin/manim --resolution 2560,1440 --frame_rate 30 --disable_caching --progress_bar none -v WARNING \
   --media_dir ../../../outputs/la02/media <module>.py <Class>
```

## Report back (under 250 words)
For each section: the file and class, the final duration, every deviation from the script and why, any HIDDEN rule you couldn't honour, and the QA sheets you checked.
