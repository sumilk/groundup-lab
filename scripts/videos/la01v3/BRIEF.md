# LA01 v3 — scene author brief

You are producing part of a narrated Manim lesson video. The **script is already written and reviewed**: your
job is to turn your acts into scenes that match the approved pilot (Opening + Act 1) in quality and conventions.

## Read first (in this order)
1. `docs/LA01_VIDEO_V3_SCRIPT.md` — the script. Only your acts' **NARRATION** blocks are spoken; **VISUAL** and
   **PRECISE — VISUAL** blocks describe what must be on screen. The "cast" table at the top is mandatory.
2. `docs/LA01_VIDEO_V3_REVIEW.md` and `docs/LA01_VIDEO_V3_PILOT_REVIEW.md` — what reviewers checked and objected to.
   Every lesson there applies to your acts.
3. `scripts/videos/la01v3/v3_act1.py` — **the template**. Copy its structure, pacing and helpers
   (`Slider`, `craft`, `dimmed`, `fmt`; import them from `v3_act1`). Also skim `common.py` (helpers `T`, `M`, `P`,
   `plane`, `vec`, `boxed`, `section_card`, `to_header`, `column_vec`, `matrix_mob`, palette `C_U C_V C_W C_X C_P C_DIM`).

All paths are relative to the repo `/Users/sumilkhosla/workspace/groundup-lab`.

## Non-negotiables
- **Narration = the script.** Convert each NARRATION paragraph into BEATS in spoken form (numbers and symbols
  in words: "four, five", "c one v one", "R n", "epsilon", "minus one third"). You may split paragraphs into
  more beats and lightly smooth phrasing for speech, but do **not** add, drop or change mathematical content,
  and keep every TERM the act introduces.
- **One beat per reveal.** If a sentence introduces something on screen, that thing appears *during* that
  beat. Split long paragraphs so reveals land with their sentence (pilot review §5).
- **Technical beats are slow:** prefix beats that read equations, derivations or precise statements with
  `"SLOW|"` (see `common.SLOW`). Conversational beats stay normal speed.
- **Reading holds:** after an equation finishes assembling, hold ~1–1.5 s (`self.until_end(1.2)` or `self.wait`).
  Prediction pauses (⏸ in the script) are real silences: `self.until_end(); self.wait(n)`.
- **Every PRECISE block is shown on screen**, built step by step, with the line being discussed highlighted.
- **The cast never changes:** u = (2, 1) blue, v = (1, 2) gold, target (4, 5) green, lazy gold (4, 2), purple
  w = (3, 3), teal grid (2, 1), (−1, 1), drone a = (1, 0, 1), b = (0, 1, 1), near-parallel (1, 0) and (1, ε).
- **No LaTeX** (not installed): never use MathTex/Tex/DecimalNumber/Integer/Matrix. Live numbers via
  `always_redraw(lambda: M(...))`. Unicode math is fine.
- **Readouts must never contradict the narration.** Round once and derive every displayed number from that
  rounded value (see `cr()` in v3_act1 §15).
- **Clean exits:** every label, caption and helper object leaves the screen when its beat's job is done.
  (The pilot had a "list of numbers" label that lingered for five minutes — check for this specifically.)
- **Layout:** frame is 14.2 × 8 units. Plane on the left (pattern: `plane((-2, 6), (-1, 6), unit=0.66)
  .to_edge(LEFT, buff=0.5)`), explanation in the right panel x ∈ [0.2, 6.8], y ∈ [−3.6, 3.0] (header sits top-left).
  Text ≥ 20 pt at 480p. Fit wide equations by scaling **then** positioning (pilot review §2). Split long
  equations across lines rather than shrinking them.
- **3-D:** use `N3DScene` with `self.add_fixed_in_frame_mobjects(...)` for text, or an oblique projection inside
  `NScene`; slow camera moves only. Keep 3-D segments short in render cost.
- Start each act with `section_card(self, "Act N", "<title>", "<the act's question>")` during the first beat,
  then `to_header`. End with `self.done()` then `self.clear_all()`.
- **Do not edit** `common.py`, `tts.py`, `qa.py`, the script docs, or other authors' files. Put any helpers in your
  own scene file.

## Commands (run from `scripts/videos/la01v3`)
```bash
PY=/private/tmp/claude-501/-Users-sumilkhosla-workspace-groundup-lab/4526ee22-2d62-4a4d-9628-05bc10648cd0/scratchpad/la01video/.venv/bin
$PY/python tts.py <module>                       # synthesise your beats (cached)
$PY/manim -ql --disable_caching --progress_bar none -v WARNING \
   --media_dir /Users/sumilkhosla/workspace/groundup-lab/outputs/la01v3/media <file>.py <Class>
$PY/python qa.py <module> <Class>                # contact sheets, one frame per beat → outputs/la01v3/qa/
```
`tts.py` prints words/min: conversational ≈ 186, SLOW ≈ 161. **Read every QA sheet** (use the Read tool on each
PNG) and also grab a few mid-beat frames during long animations. Iterate until there are no overlaps, nothing
off-screen, no leftovers, nothing illegible, no narration/visual mismatch. Ignore pydub SyntaxWarnings.

## Report back (under 300 words)
File(s) and class(es), preview duration, words/min, how you split/slowed beats, anything in the script you could
not show as written or think is wrong (do not silently change it), and the QA sheets you checked.
