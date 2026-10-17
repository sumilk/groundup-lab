# LA01 v3: revised script and Opening + Act 1 pilot review

Reviewed 17 October 2026.

Materials: revised `LA01_VIDEO_V3_SCRIPT.md`, the delivered `LA01_v3_pilot_opening_act1_480p.mp4`, both source scenes, narration cues and shared timing helpers.

Scope: inspected rendered frames across both scenes, with targeted full-resolution frames at mathematical reveals; checked narration text and measured its timing against the cue files; decoded the complete combined MP4 without errors. This is not a continuous audiovisual viewing or a subjective listening assessment of voice quality. Times below refer to the combined 6:44 pilot unless explicitly marked scene-relative. No production files or script were edited.

## Verdict

The teaching approach is worth continuing. The introduction now gives the viewer a concrete question before the AI motivation. Act 1 develops the same moves and target through pictures, notation and a real calculation. The technical explanation is integral to the story.

Revise the pilot before using it as the template for the remaining acts. Two mathematical displays are visibly obstructed, and the actual speech rate does not match the script's runtime assumptions. These are production and pacing corrections, not reasons to remove the worked mathematics or rewrite the whole act.

## Required pilot fixes

### 1. Scalar rule overlaps the slider — approximately 4:46–5:04

Evidence: `outputs/la01v3/review/v3_act1-212.png` (Act 1 scene time 3:32, combined approximately 4:50).

The slider and its numeric readout occupy the same horizontal band as

`c(a1, a2) = (c a1, c a2)`.

The knob and track run through the mathematical definition. This is present in the rendered output, not just a possible layout issue. Move the slider to a separate row or remove it once the symbolic rule is introduced. Arrange heading, slider, rule, live vector and invariant as a single bounded vertical layout.

Source: `scripts/videos/la01v3/v3_act1.py`, scalar display around lines 375–387. The earlier dial remains in the scene when the rule is added.

A second detail: at the sampled frame the independently rounded readouts show `c = -0.2` and `cu = (-0.3, -0.2)` while the caption asserts that the first entry is exactly twice the second. The underlying values are proportional, but one-decimal rounding obscures that fact. Use exact held settings for the proof of the invariant, or distinguish approximate moving readouts from exact equations.

### 2. The reconstruction check is cut off — approximately 6:21–6:27

Evidence: `outputs/la01v3/review/v3_act1-305.png` (Act 1 scene time 5:05, combined approximately 6:23).

The line beginning `1·(2, 1) + 2·(1, 2)` runs beyond the right edge. Its result and check mark cannot be read. This is the moment that verifies the solution, so viewers need to see the entire equality.

Split the check into two or three lines, at the size of the preceding equations, and place it within the right-hand panel. For example:

`1·(2,1) + 2·(1,2)`

`= (2,1) + (2,4)`

`= (4,5) ✓`.

The current width adjustment scales around the line's centre after checking its right edge; that does not reliably restore the desired right margin. Fit the width, then reposition or align the finished object inside the panel.

### 3. Spoken direction and illustrated direction disagree — approximately 2:39–2:52

Evidence: `outputs/la01v3/review/v3_act1-85.png`.

Narration describes “three blocks east and two blocks north.” The display reads “3 blocks east + 2 blocks east = 5 blocks east.” Both examples can describe addition, but the viewer is being asked to read one example and hear another.

Use the narrated east/north example on screen, preferably as two short arrows and their combined displacement. This also prepares the viewer for the subsequent tip-to-tail construction. Keep the point-versus-displacement distinction; it is useful.

Source: `v3_act1.py`, display at line 254 versus narration beat 6.

### 4. Recalibrate speech, thinking time and the length forecast

The delivered pilot is **404.26 seconds (6:44)**. Opening is approximately **1:18**; Act 1 is approximately **5:26**.

Measured from the narration cue text and audio durations:

| Section | Spoken words | Audio duration | Speech rate |
|---|---:|---:|---:|
| Opening | 211 | 70.9 s | 179 words/min |
| Act 1 | 954 | 309.5 s | 185 words/min |

These rates include the pauses already inside synthesized clips; the elapsed Act 1 rate, including visual transitions and gaps, is still about 176 words/min. The script's claim of a measured 130–150 words/min is therefore unsupported by this pilot. Its runtime table is also stale after the revisions.

The revised script contains about 9,850 whitespace-separated narration words; mathematical speech expansion makes this only an estimate. At the pilot's 185 words/min, that is roughly 53 minutes of narration before extra holds. A 60–90 minute finished lesson is possible, but cannot be promised from the existing table.

Do not stretch the video to hit an hour. Give viewers enough time to connect each symbol to the animation. Try a slower technical passage around 150–165 words/min and compare the result; conversational motivation can be quicker. After equation assembly, allow a short reading hold before the next deduction. Use measured audio durations to update the full timeline.

### 5. Coordinate animation with the relevant sentence inside each beat

`say()` synchronizes the start and end of narration chunks, but the animations inside a chunk are scheduled independently. In the vector-definition passage (combined approximately 1:53–2:15), the arrow/list/label assembly finishes in only a few seconds, followed by a long static hold while narration continues.

A held picture can help viewers think, so movement is not needed continuously. However, make the spoken correspondence visible: highlight the first coordinate with the horizontal movement, the second with the vertical movement, then connect them to the complete arrow. Split long narration beats or add internal cue timings so important reveals happen with their explanation. The same principle applies to the four substitution lines near 6:06–6:20.

## Script follow-up

The major mathematical corrections from the previous review are present:

- The exchange-lemma argument now explains the ordered independent prefix.
- The rubber-sheet example is restricted to uniform linear stretches and shears.
- Polynomial-space and PCA claims are qualified.
- LoRA is described as learning both factors, with a rank restriction rather than a magnitude restriction.
- Cauchy–Schwarz includes completing the square; cosine similarity excludes zero inputs.
- Orthogonal independence explicitly requires nonzero vectors.
- Conditioning now includes a relative-error example, a norm-based definition and a worst-case bound.
- Residual tolerance and numerical rank are separated; pivot selection permits row swaps.

One small edge-case wording remains: in the Cauchy–Schwarz section, “equality exactly when u is a multiple of v” is correct in the displayed v != 0 branch. The general statement covering the earlier v = 0 case should be “equality exactly when u and v are linearly dependent.”

The introductory claim “every layer of a network is a grid of numbers” is too literal. Say “the learned linear maps inside a network are grids of numbers”; not every neural-network operation is a matrix multiplication. This is a small wording correction, not a reason to expand the opening.

## What works and should remain

- The concrete craft appears within the first few seconds, and the introduction returns to its question. This addresses the earlier abruptness.
- The target and the two moves remain consistent.
- Translating the arrow while keeping `tip - tail = (2,1)` is an effective bridge from a picture to a mathematical invariant.
- Tip-to-tail addition, the parallelogram and entrywise addition explain the same operation in complementary ways.
- Negative and zero scaling are included, rather than leaving the analogy restricted to forward motion.
- The prediction pause before the recipe lasts four full seconds after its narration, so viewers actually have time to respond.
- The target recipe is followed by equations, substitution and reconstruction. Keep this calculation: it gives the analogy mathematical substance.
- The general linear-combination expression closes the act by extending what the viewer just worked out.

## Suggested next production step

Correct the layout, direction mismatch and pacing in this short pilot, then inspect the new preview before producing the remaining acts. Re-rendering these two scenes should be sufficient to establish the visual and timing conventions. There is no need to restart the script.

Review frames and contact sheets are in `outputs/la01v3/review/`.
