# LA02 video — listening review

Section D of the [voice plan](LA02_VIDEO_VOICE_PLAN.md). One section per listening gate.

## Step 2 — choosing the delivery (90 s test passage)

**Files:** `outputs/la02/voice-test/` (git-ignored). Rendered by [`scripts/videos/la02/voice_test.py`](../scripts/videos/la02/voice_test.py) from the [approved passage](LA02_VIDEO_TEST_PASSAGE.md). All files are normalised to the same loudness (−16 LUFS), so differences in volume don't affect the judgement.

**Suggested order:** listen to V0 and V1 back to back first, then V1 vs V2, then the V3 voices against whichever of V1 or V2 wins. Each variant changes one thing from the one before it.

| File | What differs | Length |
|---|---|---|
| V0_la01_pipeline | **Baseline:** the LA01 method. One synthesis per sentence, a 0.3 s gap after every sentence, equation sentences slowed to 0.82, breath edges trimmed. af_heart. | 1:41 |
| V1_paragraph | Each paragraph synthesised in one go; natural edges; only the authored pauses. af_heart, 0.95. Same words as V0. | 1:45 |
| V2_paragraph_punct | V1 with punctuation shaped for delivery: full stops instead of colons (Kokoro doesn't pause at colons), commas inside the arithmetic ("four minus three, is one"), and one "…" before "wherever they cross". Same words, plus "That's" and "And" at two spots. | 1:46 |
| V3a_heart_speed1.0 | V2 at speed 1.0 instead of 0.95. | 1:43 |
| V3b_bella | V2 with voice af_bella. | 1:52 |
| V3c_heart70_bella30 | V2 with a 70 % af_heart / 30 % af_bella blend. | 1:48 |
| V3d_emma_british | V2 with British voice bf_emma. | 1:40 |
| V3e_michael_male | V2 with male voice am_michael. An automatic transcript heard "Three teals" as just "Teals": check whether "three" is swallowed. | 1:56 |

**Automatic check:** Whisper transcripts of all eight files match the script word for word, apart from the "Three teals" doubt above. That only rules out clearly garbled or skipped words; emphasis and naturalness still need a human ear.

**Score each file you listen to** (1–5 unless stated):

| File | Emphasis on the idea-carrying words | Phrasing, especially inside the arithmetic | Pronunciation (x, y, numbers, "teal") | Explaining (5) or reading (1)? | Notes / timestamps |
|---|---|---|---|---|---|
| V0 | | | | | |
| V1 | | | | | |
| V2 | | | | | |
| V3a | | | | | |
| V3b | | | | | |
| V3c | | | | | |
| V3d | | | | | |
| V3e | | | | | |

**Moments worth listening for:**
- "So the solution is… wherever they cross," then the 2 s pause. Does the pause feel like an invitation to look?
- "Where do you think you'll end up?", then the 3 s pause. Does it sound like a real question?
- "Two blues… exactly the target." Can you follow the arithmetic by ear?
- The last paragraph. Does it land, or trail off?

**Decision:** voice ____ · speed ____ · punctuation style V1 / V2 · or **none passes** → stop and discuss (plan §2 B).

Fatigue is not judged here; it's judged on the first full section, *One system, two pictures*, in one sitting (plan step 5).

**Decision (2026-11-01):** voice af_heart · speed 0.95 · V2 punctuation. Chosen as the recommended default; the variants were not formally scored.

## Step 3: the two-minute audiovisual sample

**File:** `outputs/la02/sample/LA02_sample_v1.mp4` (1:47, 1440p), rendered by [`scripts/videos/la02/sample.py`](../scripts/videos/la02/sample.py).

- **Style approved by the author on 2026-11-01.** `sample.py` is now the reference for all LA02 scene work: two labelled spaces joined by A, one developing picture, the answer hidden during prediction pauses, and no title cards, typed text or decorative motion.
- **Newcomer check: pending.** Someone with school algebra and no linear algebra watches once, then explains why (2, 3) is both the crossing point and the recipe that reaches (1, 5). This needs a real person; it is not passed by a model review.
