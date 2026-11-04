# LA10 chapter review — sections 0–5

**Historical review of the partial draft.** The full chapter has since been authored and reviewed; see [LA10_FULL_CHAPTER_REVIEW.md](LA10_FULL_CHAPTER_REVIEW.md) for the current findings, real-reader checks and provisional benchmark scores.

Reviewed 2026-11-04. Scope: the complete current lesson source, its six generated figures, the verification script, and catalog integration. Sections 6 onward are not yet authored and are not assessed as missing work in this partial-draft review.

**Verdict: keep the teaching approach; make the focused repairs below before treating this as a finished reader release.** The prose generally feels natural and pedagogical. It explains a concrete operation before naming the abstraction, and the opening questions return at useful points. It does not need a broad rewrite to sound more human.

## Findings

### 1. The partial draft is presented as a full published chapter

**Priority: medium.** Lesson lines 14–24 refer to Sections 6–12 as though they are available, and lines 332, 413 and 469 lead into Section 6. The source ends at Section 5. The generated catalog gives the lesson `status: full` and its LA10 roadmap entry `status: published`, with the full 26-hour estimate. There is no visible notice that the current page is only the first part.

This matters to a learner who follows the opening promise of regularization: the page answers the amplification question, then stops before teaching any remedy. This is a release-status problem, not a request to write the remaining sections as part of the present draft.

**Repair:** make the current scope explicit at the top of the preview and prevent the partial page from being represented as a completed full lesson. Keep future-section references clearly labelled as forthcoming until those sections exist. The builder currently assigns `full` to every lesson in the LA track, so a prose-only draft label will not fix the catalog claim by itself.

### 2. Most hints give away the reasoning or the answer before an attempt

**Priority: medium; directly affects pedagogy.** The prerequisite diagnostic (lines 30–33) puts answers beside questions. Section practice does much the same: the §1 Core hint gives both squared lengths (line 105), §1 Stretch gives the counterexample and its repair (109), §3 Foundation gives all coordinates, the final vector, and residual (254), and §5 Core gives both numerical bounds and their interpretation (463).

The worked examples already provide strong scaffolding. These practice prompts should now let the learner retrieve and use it. With the answers continuously visible, a learner can mistake following the hint for solving the problem. This makes the practice less effective even though the prose itself reads well.

**Repair:** retain the required offline hint, but make it one useful next step. For example, §3 Foundation can say: “Take the dot product with each column of U. Which of the resulting coordinates are nonzero?” Move the completed coordinates and solution to a reveal or the eventual answer material. Separate diagnostic questions from their self-check answers. Preserve the variety of activities; changing every prompt into a computation would lose a strength of the draft.

### 3. A worst-case upper bound becomes an unsupported claim about actual sensitivity

**Priority: medium.** At line 451, after comparing `κ=10^4` with `κ²tanθ=10^5`, the prose says: “Even this nearly exact fit is ten times more sensitive to errors in A than κ₂ alone suggests.” The calculation compares terms in an upper bound. It has not exhibited a matrix, right-hand side, and perturbation attaining that amplification. The combined matrix-perturbation bound has coefficient 110,000, rather than 10,000; it does not establish an actual tenfold error increase.

**Repair:** say “The residual-dependent term in the first-order bound is ten times the κ term, so dropping it can substantially understate the worst-case ceiling.” If actual amplification is the teaching goal, add a concrete perturbation that demonstrates it. The draft correctly distinguishes bounds from realized error in the worked RHS example at line 397; use that same care here. The first-order structure is consistent with [Bindel's least-squares sensitivity derivation](https://www.cs.cornell.edu/courses/cs4220/2026sp/lec/2026-02-20.html).

### 4. The promised finite-perturbation result is referenced but never stated

**Priority: medium.** Section 5.3 derives the linearization correctly, but lines 436–448 use `≈` and `≲` without a quantitative remainder. Line 451 then directs the reader to books for “the full statement.” The accepted plan specifically retained the first-order proof and required a statement of the full non-asymptotic result with its hypotheses, allowing its proof to be deferred.

**Repair:** distinguish the derivative statement from a finite-error guarantee. Write the first-order expansion with an `O(ε²)` remainder for fixed A and b as ε→0, explain that the constant can depend on the problem, and state the chosen finite-perturbation theorem with its actual assumptions before deferring the proof. Verify the book edition and theorem reference when doing so. Do not imply that merely satisfying `‖E‖<σₙ` makes the omitted higher-order terms negligible near that boundary.

The derivation is useful and should stay. This repair completes a coverage promise rather than replacing the argument with a citation.

### 5. Approximate channel alignment is described as exact

**Priority: low.** Lines 370–374 acknowledge a small strong-channel contribution, then say both coefficient moves “run along v₂.” They are nearly along it. With the displayed singular-vector convention, the change `(0,0.01,−0.01)` has strong-channel coordinate about −0.00264684; after division by σ₁ the coefficient contribution is about −0.00050038. It is small, but nonzero.

The figure description and its side labels also present positive channel magnitudes without saying they are magnitudes, while the prose uses negative coordinates. This is understandable visually but avoidable in a section teaching how to read coordinates.

**Repair:** use “almost along v₂,” say the fitted values “change only slightly” rather than “stay put,” and label the sidebar values as magnitudes or retain their signs. Keep the exact identity `δy=X(−1,1)` as the arithmetic check; do not make its approximate SVD explanation sound exact.

## What works and should stay

- **Section 1:** the cancellation along `(2,−1)`, Pythagoras, and the two-equation example explain minimum norm before introducing the formula. The comparison between a convention and an added objective is clear.
- **Section 2:** the two spaces have different jobs, and the duplicate-column example makes both necessary. The next example's unreachable third observation gives the residual a concrete meaning.
- **Section 3:** reading coordinates, setting aside an unreachable output, reversing retained channels, and adding no invisible input is a teachable algorithm. The SVD-independence explanation via uniqueness avoids unnecessary algebra.
- **Section 4:** the candidate passing three identities makes the fourth condition worth understanding. The uniqueness proof follows the same projection and row-space ideas already established.
- **Section 5:** the opening's coefficient jump is resolved with actual numbers, and sensitivity is separated from numerical algorithm stability. The rank-increase theorem has a concise dimension-count proof.

The connective sentences generally respond to a learner's likely question. There is no need to add casual filler, fake dialogue, or more rhetorical questions. A small wording polish would replace “A realistic size” (line 51) with “Two equations, three unknowns”: a 2×3 example is valuable because it exposes the geometry, not because it represents a realistic dataset size.

## Figure review

All six figures were rendered with `preview.mjs` and inspected as PNGs. Labels were readable at the generated size; the projection panels, right-angle markers, points, and displayed projector values support the surrounding explanation. The oblique-versus-orthogonal figure is particularly useful.

Two refinements would improve standalone reading:

- In the rank-change plot, the two branches stop near the top of the logarithmic axis. Add continuation arrows or an explicit “unbounded as ε→0” label so the narrow peak cannot be read as a finite maximum. The prose already explains the divergence correctly.
- Name the horizontal and vertical coordinates on the parameter-space plots and the two observation coordinates on the projection plot. Point labels currently make the meaning inferable, but axes should identify their own spaces.

These observations concern the exported figures. The assembled reader was not visually inspected in both themes or at mobile widths.

## Verification and limits

Passed:

- `node scripts/figures/build.mjs --check` — 76 generated figures verified.
- `python3 scripts/verify/la10/la10_assert.py` — plan and lesson §0–5 assertions passed.
- `node scripts/check-theory.mjs` — catalog, links, browser labs, marking prompts, and syntax checks passed.
- `python3 -m labs.checks --reference` — existing reference labs passed.

Independently recomputed the near-collinear singular vectors and weak/strong observation coordinates. Read the theorem proofs and section practice; their central algebra and numerical examples check out, subject to the interpretation and scope findings above. The successful checker run does not validate exposition, bound interpretation, draft status, or the missing finite-perturbation statement.

No chapter prose, figure source, generated catalog, or verification code was changed by this review. This document records the review; it does not certify the unimplemented regularization sections, answer bank, or interactive lab.
