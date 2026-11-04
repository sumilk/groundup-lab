# PS00 video: brief for scene authors

You are building one or more sections of a narrated Manim lesson video on probability. The script is written. Your job is to turn your sections into scenes that look and sound like the reference scene. All paths are relative to `/Users/sumilkhosla/workspace/groundup-lab`.

## Read first, in this order
1. `docs/PS00_VIDEO_PLAN.md` §0, §0.1 and §1: the standard. Every choice is judged by *does this feel like someone guiding me through the mathematics?* and *is it intuitive for someone new to the material?*
2. `docs/PS00_VIDEO_SCRIPT.md`: the header ("Reading this script", "Cast") and **your sections only**. `>` blocks are spoken narration; VISUAL, SCREEN, TERM ▸ and HIDDEN UNTIL AFTER ⏸ lines define the screen.
3. `scripts/videos/ps00/04_shrinks_world.py`: **the reference scene.** Copy its structure: the `PARAS` list, the `beat()` helper, how `say()`/`pause()` drive timing, the layout (picture on the left, maths column on the right at `RX = 3.35`), the sizes, and the cross-out-then-rescale motion for conditioning.
4. `scripts/videos/ps00/kit.py`: shared pictures. `DiceGrid` (cells, `where`, `paint`, `darken`, `cross_marks`, `rescale`, `restore`), `LoadedDie`, `bag`, `Tree`, `detector_card`, `eq`, `frac`. Import with `from kit import *`.
5. `scripts/videos/ps00/common.py`: `T M P`, the palette (`C_A` blue = event asked about, `C_B` gold = the information, `C_BOTH` green = both, `C_MASS` purple = probability mass, `C_RED`, `C_CONT` orange = contaminated, `C_CLEAN` teal = clean, `C_OFF` crossed out, `C_DIM` muted text), and the narration engine.

## How narration works
- `PARAS` is a list of paragraphs; each paragraph is a list of beats (strings). In the script, a run of consecutive `>` lines is one paragraph; a blank line or a VISUAL/⏸ line between `>` blocks starts a new paragraph. **Each sentence is one beat.** Split at full stops and question marks only.
- NARRATION goes in **exactly as written in the script**: don't add, drop or rephrase a word. Keep the script's quote marks and apostrophes.
- One beat per reveal: anything a sentence introduces appears **during that sentence's beat**.
- `self.say()` starts the next beat and returns its duration `d`; size animations to `d` (the reference's `beat()` helper does this). Within a paragraph there is no added gap.
- Each **⏸ n** in the script is `self.pause(n)` at that point. No other silences, except a short `self.pause(0.4–0.8)` between paragraphs when the picture needs time to change.
- Before every prediction pause, nothing listed on its **HIDDEN UNTIL AFTER ⏸** line may be on screen. Check this on the QA sheets.
- `tts.py` prints `!` for any cut that isn't in a pause: fix every one by re-splitting beats (only at sentence ends).

## Visual rules (non-negotiable)
- **Area is probability.** On the fair-dice grid every square is equal because each holds 1/36. Unequal masses are drawn with unequal widths (see `LoadedDie`), never as equal squares.
- **Conditioning is shown, not stated:** cross out what the information rules out (`darken` + `cross_marks`), then the kept cells slide together and stretch to fill the same footprint (`rescale`).
- Two different spaces are never drawn as one. The random variable gets two panels (outcomes left, values right, joined by X); model versus simulation gets two panels.
- No title cards, no section headers on screen, no typed-out sentences, no decorative motion. `Indicate`/`Circumscribe` only to point at the thing the narration names. A change of picture is a teaching event: transform related pictures; clear only when the topic changes.
- On-screen text is only labels, the equation being worked, and a term at the moment it is named (`TERM ▸`). Colours keep their meaning from the Cast table.
- No LaTeX: never use MathTex/Tex/DecimalNumber/Integer/Matrix. Use `M()` for maths (fractions as `3/18`), `P()`/`T()` for prose labels.
- Frame is 14.2 × 8. Keep everything inside x ∈ [−6.9, 6.9], y ∈ [−3.9, 3.9]. Readable at 480p: `P`/`T` ≥ 22, `M` ≥ 26. Split wide equations rather than shrinking below that.
- Clean exits: every label leaves once its job is done. Readouts never contradict the narration.
- Each scene starts from an empty screen; ends with `self.done(1.5)` then `self.clear_all()`.
- Where the script's visual is impractical, make the smallest change that keeps the maths and narration identical, and **report it**.
- Manim gotcha: `Mobject` has attributes `dim`, `width`, `height`, `color`, `points` etc. Don't name your own methods/attributes on mobject subclasses after them.

## Files and names
One file per section, `scripts/videos/ps00/<module>.py`, with the class given in `scenes_order.py`. Don't edit `common.py`, `kit.py`, `tts.py`, `qa.py`, `04_shrinks_world.py`, `scenes_order.py`, the docs, or other authors' files. Put helpers in your own file (if another section of yours needs them, import from your own module with `importlib.import_module("07_counting")`).

## Commands (run from `scripts/videos/ps00`)
```bash
.venv/bin/python tts.py <module>                     # voice your paragraphs (cached); fix every "!" line
.venv/bin/manim -ql --disable_caching --progress_bar none -v WARNING \
   --media_dir ../../../outputs/ps00/media <module>.py <Class>
.venv/bin/python qa.py <module> <Class>              # contact sheets: one frame per beat -> outputs/ps00/qa/
```
**Read every QA sheet** with the Read tool. The black "beat N" tag covers the bottom-left corner of each frame. Iterate until there are no overlaps, nothing is off screen, nothing is left over from earlier beats, nothing is illegible, no answer shows before its pause, and nothing contradicts the narration. Ignore pydub SyntaxWarnings. Do **not** render at 1440p; the final build does that.

## Report back (under 250 words)
For each section: file and class, duration of the 480p render, every deviation from the script and why, any HIDDEN rule you couldn't honour, and which QA sheets you checked.

## Lessons from the sections 1–4 sample review (docs/PS00_VIDEO_SAMPLE_REVIEW.md)
- **Clear finished material as the argument moves on.** Completed identities, calculations and legend rows leave before the next concept arrives; don't let the right column accumulate.
- **One colour language at a time.** When a wash or highlight is the thing being compared, fade competing fills (to ~15%) and label the wash; restore afterwards.
- **Give each finished equivalence or equation an inspection hold** (about 2–3 s, or the script's ⏸) before the next argument starts.
- **Preserve outcome identities through a rescale:** re-label surviving columns/rows (e.g. 4, 5, 6) after cells stretch.
- **Never head a new picture with the previous case's calculation.** Clear or dim-and-label it.
- **Keep every equation inside x ≤ 6.6 including during animation;** reflow long ones onto two lines.
- **Numbers on a tree must stay consistent** when a scenario changes (sibling branches add to 1).
- Manim gotcha: `.animate` stores its target on the mobject; build restore/fade animations at the moment you play them, not in advance.
