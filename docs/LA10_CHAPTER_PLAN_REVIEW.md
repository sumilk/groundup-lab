# LA10 chapter-plan review

**Latest assessment (final plan check, 2026-11-04): approved to begin authoring sections 1–5 and their figures.** The five outstanding addendum fixes are present, and `python3 scripts/verify/la10/la10_assert.py` passes. No outstanding plan-review blocker remains. The original review and addendum are retained as the record of earlier drafts. This approval concerns the plan; finished prose and figures still require review.

Reviewed 2026-11-04 against `LA10_CHAPTER_PLAN.md`, the shared textbook-quality standard, and the LA track's prerequisite and coverage commitments.

**Verdict: revise before authoring.** The mathematical storyline is promising: choose among equally good fits, understand the pseudoinverse, see what small singular values amplify, and decide how much to suppress. The opening examples, paired observation/parameter-space picture, and off-pattern prediction experiment are worth keeping. The current plan needs a stronger connection between those ideas and several correctness repairs.

This is a review of the plan. No lesson prose exists yet, so naturalness of the finished lesson remains unassessed. A structured planning document is not itself evidence of machine authorship. The relevant risk is that its structure gets copied into the lesson as repetitive exposition.

## 1. Give the reader a reason to turn each page

**High priority — opening; §1–7.** The opening raises two useful questions, but the second waits through minimum-norm geometry, an SVD construction, Moore–Penrose uniqueness, and perturbation theory before ridge answers it. Without intermediate returns to the question, the chapter could feel like a catalogue of related results.

Keep the section order and the required proofs, but specify the transition each section earns:

| After | What the reader now understands | Question that motivates the next step |
|---|---|---|
| §1 | Invisible parameter components can change the answer without changing the fit. | What if an exact fit is impossible? |
| §2 | First project the observations; then choose the shortest parameter vector that produces that projection. | Can one linear map do both operations? |
| §3 | The pseudoinverse reverses the nonzero SVD channels and ignores the unreachable part of the observations. | How do we recognize the same operator without choosing singular vectors? |
| §4 | The four identities characterize that operator. | What happens when a nonzero channel is very small? |
| §5 | Dividing by a small singular value amplifies perturbations. | Must we invert every nonzero channel? |
| §6 | A cutoff trades discarded signal against amplified noise. | Can that tradeoff change smoothly? |
| §7 | Ridge damps channels continuously. | How much damping can the data justify? |

End §3 by forecasting that the division just introduced explains the coefficient jump in the opening. Resolve that jump in §5, then return to the ridge numbers in §7. These are explicit callbacks, not repeated worked examples.

## 2. Preserve the teaching standard without making the prose sound templated

**High priority — section-plan introduction, line 45.** The question → picture → example → theorem → proof → check sequence is required by rule A and is useful. It does not require the same visible labels, introductory phrases, or paragraph rhythm in every section.

Add an authoring instruction: follow that conceptual progression while letting the explanation respond to the particular problem. A figure should answer a question raised in the prose; an example should expose why a definition is needed; a proof should explain why the observed behavior persists. Keep required Foundation/Core/Stretch practice, but vary what learners do: calculate a missing coordinate, explain a diagram, compare two answers, or repair a plausible argument.

Avoid recurring announcements such as “Now we build intuition,” “The key insight is,” or “This bridges geometry and computation.” State the actual connection. Do not manufacture informality with fake hesitation, invented student reactions, or claims about what “everyone” gets wrong.

Keep “contracts,” “gates,” benchmark coverage, file-registration instructions, and rule references in authoring material and rubrics. The shared standard already requires this separation. In §11 the learner can answer “Would you trust these coefficients?” before encountering the reporting checklist.

## 3. Stage the first worked examples around a decision

**High priority — §1–3, lines 55–74.** In §1, the second example immediately uses `Aᵀ(AAᵀ)⁻¹b`, although its justification follows in the theorem. That makes a geometric idea look like an unexplained formula to memorize.

Work the same example first as

`x = (2−t, 3−t, t)`.

The null direction is `(-1,-1,1)`. The shortest representative is perpendicular to it, so `-(2−t)−(3−t)+t=0`, giving `t=5/3`. Derive the right-inverse formula afterward. This retains every promised computation and lets the formula summarize reasoning the learner has already done.

For §2, complete the duplicate-column example before introducing the new 3×3 case. If the 3×3 case is solved before the SVD definition in §3, specify its projection/null-space route explicitly. “See §3's matrix” must not become a dependency on a later method.

In §3, retain the rational 3×3 computation, but first calculate `uᵢᵀb`, divide the two retained coordinates by their singular values, and reconstruct the answer along `vᵢ`. Then assemble the full matrix `A⁺`. Otherwise the learner may complete several matrix multiplications without understanding the operator. State that the factors were constructed for readable arithmetic; this example applies a supplied SVD rather than teaching how to discover one.

## 4. Make depth navigable without removing it

**High priority — §4–5, §7, §9–10.** The plan's completeness is valuable, but it gives nearly equal prominence to the central story and to Moore–Penrose algebra, sharp perturbation bounds, Picard conditions, effective degrees of freedom, parameter selection, and nonlinear implicit bias. A nominal word count comparable to LA01 does not establish an appropriate learning load.

Add a route with natural stopping points:

1. **Choosing a solution (§1–4):** explain and compute a minimum-norm least-squares solution.
2. **Controlling amplification (§5–8):** explain the unstable channel and compare cutoff with ridge.
3. **Defending the choice (§9–12):** select a parameter, state the optimizer's assumptions, and implement the methods.

Within §5, place the direct right-hand-side experiment and bound before the full matrix-perturbation derivation. Mark the latter as a second-reading subsection while retaining its proof and LA09 commitment. In §7, finish the ridge derivation and worked fit before the constrained, degrees-of-freedom, centering, and Bayesian connections. Clearly distinguish required work from research extensions in the exercise route.

## 5. Make the experiment's comparison precise

**Medium priority — §8.** “Which scatters more, fitted values or coefficients?” compares different spaces and possibly different units. Raw plot widths cannot answer it reliably.

Ask instead: “Does the large movement in the coefficients produce comparably large changes at the observed inputs?” Show spread across noise draws separately in parameter space and observation space, with fixed axes and explicit units. If reporting a ratio, define its normalization. Identify the true data-generating coefficient vector, the noise distribution, and what remains fixed across the 50 draws.

Keep the off-pattern point. It supplies the essential qualification: stable fitted values at the observed inputs do not establish stable predictions everywhere. Explain an “off-pattern” query as an input that separates the nearly duplicate features, then express its component along `v₂`.

The unscaled-feature preset should say that a change of units changes an isotropic ridge penalty's meaning. “Shrinks the wrong coefficient” implies a unique correct penalty without a stated modeling objective.

## 6. Repair the mathematical claims before they shape the lesson

These are authoring blockers, not wording preferences.

| Location | Finding | Required repair |
|---|---|---|
| §5, geometric reading | “κ² only when the fit is poor” confuses intrinsic least-squares sensitivity with algorithmic stability. A small nonzero residual can matter when κ is large. | Derive `δx = A⁺δb − A⁺Ex + (AᵀA)⁻¹Eᵀr` to first order, with `r=b−Ax`, full column rank, and small perturbations. The matrix-perturbation coefficient is bounded by `κ + κ² tan θ`; the residual-dependent term vanishes for an exact fit. Explain separately how forming the Gram matrix introduces numerical difficulty. QR/SVD cannot remove sensitivity of the original problem. |
| §6, library tolerance | NumPy `pinv` and `matrix_rank` do not share the stated default. | Document each API separately and record the version used. `pinv` with neither tolerance argument supplied uses relative cutoff `10^-15`; `matrix_rank` uses `σ₁ max(m,n) ε`. `lstsq` has its own documented convention. Distinguish these relative arguments from the labs' absolute `tol`. See the official documentation linked below. |
| §7, worked filter | The plan uses `0.0096/(0.0096+λ)`, but `σ₂≈0.0098233` and `σ₂²≈0.0000964971`. | Use `f₂≈0.0000964971/(0.0000964971+λ)`. At `λ=0.01`, `f₂≈0.00956`, not approximately 0.49. |
| §7, condition number | The denominator is ambiguous for wide full-row-rank matrices as well as rank-deficient ones. | Write `(σ₁²+λ)/(μ_min+λ)`, where `μ_min` is the smallest eigenvalue of the n×n matrix `AᵀA`. It is zero whenever `rank(A)<n`; only full column rank permits `μ_min=σₙ²`. |
| §8, huge-λ preset | “Everything collapses to 0, and so does the bias” reverses the intended lesson. | Coefficients and variation due to observation noise tend to zero. Shrinkage bias generally grows toward the error of the zero predictor. State the true signal for this comparison. |
| §9, discrepancy principle | Monotonicity alone guarantees neither existence nor uniqueness of a positive root. | With `Aᵀb≠0`, the residual norm is strictly increasing for positive λ, from `‖(I−AA⁺)b‖` to `‖b‖` as limits. A unique finite positive root requires the target `τδ` strictly between those endpoints. Include an unattainable-target example and bracket before bisection. If `Aᵀb=0`, the residual is constant. |
| §10, early stopping | The convergence range `0<η<2/σ₁²` allows oscillating channels; it does not always give a monotone damping filter between 0 and 1. | Keep that range for convergence. Use `0<η≤1/σ₁²` for the smooth regularization comparison in F6, and demonstrate the oscillatory range separately. Describe `t≈1/(ηλ)` as a small-channel scale comparison, not equality of GD and ridge solutions. |
| §10, preconditioning | A fixed arbitrary `P` does not establish the asserted minimum-norm bias. | Require symmetric positive definite `P`, stable steps, and zero initialization for the `P⁻¹` minimum-norm conclusion. For general initialization, the limit minimizes distance to that initialization in the stated metric. |
| §10 and PyTorch exercise | `w=u⊙u` constrains every weight to be nonnegative; zero initialization also gives zero parameter gradients. | State the feasible target and nonzero initialization if retaining this example. Otherwise use a signed factorization with its assumptions. A failure to reach a signed target is not evidence of selecting a different interpolant. |
| §12, Lab A | Truncating a nonzero singular value generally violates `AA⁺A=A` for the original A. | Define the result as `A_τ⁺`. Check the four Moore–Penrose identities against `A_τ`, and report truncation error separately against A. Exact-zero-only examples can still check the original A. |
| §12, Lab C | After truncation, the residual need not be orthogonal to the original `range(A)`. | Check orthogonality to the retained left singular subspace. Use the original range only when all nonzero channels are retained. Example: dropping the second channel of `diag(1,0.001)` with `b=(0,1)` returns zero, whose residual is not orthogonal to `range(A)`. |

For §5's relative bounds, explicitly exclude `x=0` and define θ only where its denominator exists. Handle `A=0` separately from `‖A⁺‖=1/σᵣ` and the GD step-size statement. Define whether the SVD lab inputs are full, reduced, or compact; compact zero-rank factors need enough shape information to recover the output dimensions.

The sensitivity distinction is also discussed in the primary-source [least-squares error-analysis survey, Appendix B.2](https://www.netlib.org/utk/people/JackDongarra/PAPERS/rand-templates.pdf). API behavior was checked against the official [NumPy pinv documentation](https://numpy.org/doc/stable/reference/generated/numpy.linalg.pinv.html), [matrix_rank documentation](https://numpy.org/doc/stable/reference/generated/numpy.linalg.matrix_rank.html), and [lstsq documentation](https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html).

## 7. Resolve the uncomputed example before writing dependent sections

**High priority — §6 and §9.** The TSVD example is still “numbers to be computed,” while the Picard interpretation, discrepancy calculation, and L-curve depend on it.

Choose the true solution and noise vector now. Calculate the error for all three cutoffs, the discrepancy target and bracket, and the ridge path. Confirm that the intended comparison occurs. Three singular channels can illustrate truncation arithmetic; use a separate larger reproducible problem for a convincing noise plateau and L-curve if the three-channel problem does not show them. Do not promise a clear L-curve corner before inspecting the actual curve.

## 8. A sample of the intended teaching voice

This is illustrative prose for the first puzzle, not a rewrite of the chapter:

> The equation `x₁+2x₂=5` has many answers. `(5,0)` works. So does `(1,2)`. A least-squares routine returns `(1,2)`. What has it chosen between?
>
> Start at `(1,2)` and move in the direction `(2,−1)`. Increasing the first coordinate by 2 adds 2 to the left-hand side; decreasing the second by 1 subtracts the same 2. The equation cannot detect this movement.
>
> Every solution therefore has the form `(1,2)+t(2,−1)`. Those two vectors are perpendicular, so the squared length is `5+5t²`. It is smallest at `t=0`.
>
> The routine has chosen the shortest solution. Next we will see why the same idea works when several equations leave some directions undetermined.

The explanatory work comes from a change the reader can follow, a cancellation, and Pythagoras. The technical terms can then name what has been established. A conversational adjective or a rhetorical question cannot replace those steps.

## Review completion criteria

- Repair the correctness items and finish the shared TSVD/discrepancy example.
- Add the section transitions, reading stops, and experiment comparison defined above.
- Preserve the required proofs, visual explanations, worked arithmetic, and practice; use depth labels to make them navigable.
- Review the eventual prose separately: can a learner explain why each definition appears, follow each arithmetic step, and state what the experiment does and does not establish?

Verification for this review: recomputed the opening least-squares and ridge coefficients and singular values; recomputed the rational 3×3 SVD construction, pseudoinverse, projectors, solution, and residual using exact fractions. Those advertised values check out apart from the later small-channel filter expression identified above. Reviewed the minimum-norm examples and GD limits algebraically. No lesson, implementation, figure, or rendered-reader behavior is certified by this plan review.

## Addendum: review of the revised plan

The transition table, recurring opening questions, reasoning before formulas, three stopping points, and second-reading subsections now provide a coherent teaching route. The voice guidance is specific enough to guide an author without forcing a repeated sentence pattern. The revised §2 example also removes the forward dependency on §3. These concerns are resolved at the planning stage; the eventual prose still needs its own review.

Both verification scripts were run and their output compared with the plan. The 3-channel errors (0.50990, 0.10050, 10.00001), discrepancy solution (λ≈0.000335977, error≈0.103594), and 32-channel results reproduce. The script's discrete L-curve selector yields λ≈3.162×10^-9 and error≈0.2087; discrepancy gives error≈0.0388. This supports presenting that computed selector's failure on this dataset. It does not establish that every definition or estimator of an L-curve corner fails here; the planned visual inspection remains necessary.

Three corrections remain before authoring the affected sections:

1. **§8, ratio readout (plan line 223): normalization still mixes units.** If a feature has units F and observations have units Y, coefficient spread has units Y/F. Dividing it by noise scale s (units Y) leaves 1/F; it is not dimensionless. The changed-units preset makes this consequential. Keep the two spreads in their respective labelled units and omit the common ratio. Alternatively, multiply the weak-channel coefficient spread by a declared fixed reference feature magnitude before dividing by s. Define the reference and how it transforms under a units change. Handle s=0 explicitly. The separate plots and off-pattern prediction comparison already teach the intended lesson without a ratio.

2. **§10, parameterization claim (plan line 278): state the limiting process and dynamics.** Woodworth et al.'s squared-parameterization result characterizes gradient flow, conditional on convergence to an interpolating solution. At finite positive α the implicit objective is an α-dependent function Qα; the ℓ₁ behavior is an α→0 limit after training to convergence. Replace “for small α, the limit is known to favor small ℓ₁ norm” with that precise statement. The proposed discrete PyTorch experiment can illustrate the phenomenon, but should report its step size and final residual and must not be described as directly certified by the gradient-flow theorem. See [Woodworth et al., §4, Theorems 1–2](https://proceedings.mlr.press/v125/woodworth20a/woodworth20a.pdf).

3. **§10, step-size counterexample (plan line 280): failure is not universal divergence.** Outside `0<η<2/σ₁²`, convergence for arbitrary initializations is no longer guaranteed. At η=0 the iterate stays fixed; at η=2/σ₁² a nonzero error in the largest singular channel alternates without decaying. Above that boundary, a nonzero component in an unstable channel grows, but an initialization already at a least-squares solution remains there. Replace the blanket divergence statement with “outside this range convergence is not guaranteed,” then demonstrate the endpoint oscillation and an above-boundary divergence on explicit initial errors.

Two smaller wording fixes can be handled during authoring: §6's amplified noise is −10, while the total recovered third coordinate is −9.9; §9's constant-residual case gives either no λ or every positive λ, depending on the target, so it gives no unique choice rather than invariably no answer.

The persistent scripts are useful reproducible calculations. They mostly print results rather than assert expected values, so a successful exit alone is not a correctness check; the assessment above includes reading their output. The hand-checked items listed in the appendix remain explicitly outstanding for script coverage. No implementation or rendered figure was assessed in this re-review. No change was made to the chapter plan or verification scripts.
