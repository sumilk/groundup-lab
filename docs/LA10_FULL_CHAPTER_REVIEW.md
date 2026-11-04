# LA10 full-draft review

**Latest assessment — re-audit, 2026-11-04:** the eight findings and the listed smaller repairs have been addressed. Prose, figures and the actual reader pass this re-audit; no new blocking finding was identified in the revised material. All seven experiment references were rerun successfully. The exact named-textbook comparison remains incomplete, so this is not final textbook-standard certification. See the re-audit record at the end. The findings below are retained as historical review evidence.

Reviewed 2026-11-04. Scope: the full 1,030-line lesson, all 12 generated figures, the 29-entry answer bank, the new interactive and Python references, and the local browser reader.

**Verdict: revisions required before sign-off.** The narrative is coherent and generally sounds like a teacher explaining a problem. Keep the worked examples and the two recurring opening questions. The remaining problems concern correctness, interpretation, reference-answer completeness, and actual rendering. Passing the mechanical textbook check does not resolve these.

## Findings, in priority order

### 1. Three figures are missing in the real reader

**High priority — lesson lines 304, 404 and 821.** The image descriptions contain nested square-bracket matrix notation. In the current Markdown renderer, these three image expressions remain literal `![…](…)` paragraphs:

- `la10-oblique-vs-orthogonal.svg`
- `la10-pinv-jump.svg`
- `la10-gd-paths.svg`

The browser has only nine image elements for twelve source figures. There are no failed image requests: the missing figures never become images. This removes the key pictures supporting the fourth Moore–Penrose condition, discontinuity, and initialization-dependent GD limits.

**Repair:** escape the bracket characters in those descriptions or describe the matrix rows in words. Retain meaningful alt text. Verify twelve rendered image elements and no raw image-Markdown paragraphs in the actual reader; file existence and SVG freshness cannot catch this.

### 2. C2's reference answer reverses coupled L2 regularization and decoupled decay

**High priority — answer bank lines 309–312; lesson line 983.** The reference says Adam with coupled weight decay does not minimize a fixed ridge objective because it rescales the penalty. Coupled Adam adds `λw` to the loss gradient **before** forming its moments and adaptive update. That is Adam applied to the fixed objective `loss(w)+λ‖w‖²/2`. Applying an adaptive method to this gradient does not make the objective cease to be ridge. As usual, this identifies the objective; it does not promise convergence for arbitrary Adam settings.

AdamW applies decay separately and generally has a different stationary equation. For a fixed diagonal scaling D, that equation is `D∇loss(w)+λw=0`, rather than `∇loss(w)+λw=0`. Even uniform scaling needs a matching adjustment to the ridge parameter to compare the same objective. The exercise asks learners to explain why one adaptive run corresponds to a fixed ridge objective, but the reference currently denies that correspondence for both.

**Repair:** correct both `plain` and `solution`, state objective normalization, explicitly keep Adam's `decoupled_weight_decay=False`, and give a concrete converged numerical comparison. The official [Adam algorithm](https://docs.pytorch.org/docs/2.15/generated/torch.optim.Adam.html) and [AdamW algorithm](https://docs.pytorch.org/docs/main/generated/torch.optim.AdamW.html) distinguish these operations directly.

### 3. The interactive calls sampling error “shrinkage bias”

**Medium priority — `public/theory/labs/la-ridge.js` lines 63–68 and 85–91.** The reported bias is `‖X·sample_mean(w_hat)−Xw*‖` over fifty draws. This includes Monte Carlo error. In the default preset at **λ=0**, the browser reports a shrinkage bias of **0.003895**, although the fitted-value estimator is unbiased and there is no penalty.

The no-noise verdict also says any distance from w* is caused by the penalty. Counterexample available in the controls: exact collinearity, x₂ multiplied by 10, λ=0, s=0. The estimate is approximately `(0.0198,0.198)` instead of w*=`(1,0.1)`, while fitted values are exact. The parameter difference is a minimum-norm choice in a non-identifiable system, not penalty bias.

**Repair:** compute fitted-value shrinkage bias from the noiseless expected estimate, `‖X·solve(Xw*,λ)−Xw*‖`. If keeping the sample-mean discrepancy, label it as such. Explain kernel ambiguity separately from shrinkage in the no-noise verdict. A resample should change a sample-mean discrepancy, not the theoretical bias.

### 4. The units fix is incomplete in both the readout and its verdict

**Medium priority — lab lines 64, 88 and 96–99; lesson lines 690–694.** The lab combines `sd(w₁)` and `sd(w₂)` with a Euclidean norm. After changing the units of x₂, those coordinates have different units, so the result has no single label “y per unit of feature.” It also selects a verdict by comparing `coefSpread > 10*fitSpread`. That still makes the units-dependent comparison the prose says was removed. “By λ=10^-2 both spreads are comparable” likewise needs a declared feature scale.

**Repair:** report the two coefficient standard deviations with separate feature units. A combined parameter-space norm can be shown only under an explicitly chosen coordinate metric. Base any cross-space comparison on a declared fixed physical prediction functional, or describe each spread separately without a numerical common-scale threshold. Keep the off-pattern query: it is already the cleanest same-units comparison.

### 5. Extreme predictions are silently changed to the plotting limits

**Medium priority — lab lines 106–122 and 127–131.** The prediction chart replaces values below −8 or above 10 with −8 or 10. It therefore plots false observations at its boundaries. The coefficient canvas also loses estimates outside its fixed span without saying how many are absent.

Browser reproduction: off-pattern query, h=0.001, s=0.05, λ=0. The readout gives coefficient spread **47.48** and query prediction spread **33.57**, while the chart piles predictions onto −8 and 10. This is exactly the failure regime the experiment should make clear. With changed units, σ₁≈37.58 also lies outside the filter chart's range ending at σ=10, so the promised strong-channel marker disappears.

**Repair:** do not clamp data values. Preserve a fixed-scale comparison if desired, but add overflow arrows/counts and the actual observed range, plus a zoom option. Ensure the filter range includes both singular values in every preset. A wider or separate query panel is another reasonable option.

### 6. Several experimental “solutions” are marking instructions, not complete references

**Medium priority — answer bank B2–B4 and C1–C3, especially lines 289–317.** These entries mostly say what “the answer reports” or what a good answer should construct. They provide no runnable reference, chosen seed, actual output or completed experiment. For example, B3 asks for two parameter choices and errors, but its solution supplies neither. C3 asserts the expected behavior for an unspecified random instance rather than presenting an actual run. The shared standard requires complete model solutions for written items, in addition to rubrics.

B4 also never supplies or asks the learner to choose b. Its reference then predicts that one method loses “about six more digits” from the condition numbers alone. Those numbers describe potential amplification, not a guaranteed observed digit loss; right-hand side, residual, rounding direction and construction matter. M2's explanation similarly assigns QR accuracy solely to the stacked matrix's condition number without acknowledging least-squares residual sensitivity, despite §5.3 teaching that distinction.

**Repair:** supply one reproducible worked experiment per computational item, with code, seed, right-hand side, normalization, stopping criteria, tolerances, and representative outputs. Accept legitimate variation in rubrics. Reword accuracy comparisons as bounds or measured outcomes, and distinguish intrinsic least-squares sensitivity from extra error caused by forming a Gram matrix.

### 7. Section 11 infers truth and noise from stability or residual size alone

**Medium priority — lesson lines 880–900.** “Report 1 has fitted the noise,” “the coefficients are not [trustworthy],” “the fitted values are trustworthy,” and “a large coefficient on a discarded channel is signal thrown away” draw stronger conclusions than the reports establish.

A residual below a stated noise norm is a warning, not a proof of coefficient error. For example, with A=I, x=0 and arbitrarily small noise e, the residual is zero and the coefficient error is simply ‖e‖. A tiny singular value and a default `pinv` tolerance do not by themselves establish that its observed coordinate is noise-dominated. A discarded observed coordinate contains both signal and noise. Stable fitted values establish insensitivity at those inputs; they do not establish closeness to an unknown true response.

**Repair:** ask what each report supports and what information is missing. If these reports intentionally refer to the chapter's synthetic examples with known truth and noise, say so. Otherwise use “stable under the stated perturbation” and “not justified as an importance claim,” instead of declaring statistical accuracy or identifying noise without the needed assumptions. This keeps the exercise aligned with the judgment the chapter aims to teach.

### 8. The GCV failure needs its target error stated explicitly

**Medium priority — lesson lines 765–775.** The two minima reproduce, but GCV is introduced as a criterion for **prediction** and then condemned using **reconstruction/parameter** error. The distinction matters particularly here, because §§5 and 8 have shown that parameter error can be huge while predictions at the measured inputs remain stable.

Independent evaluation using the stated Python noise seed, with the stable denominator `sum(λ/(σᵢ²+λ))`, gives:

| Choice | λ | reconstruction error `‖x_λ−x‖` | noiseless fitted-value error `‖Ax_λ−Ax‖` |
|---|---:|---:|---:|
| Fine-grid global GCV minimum | about 7.08×10^-14 | 67.21 | 9.02×10^-5 |
| Fine-grid local GCV minimum | about 2.24×10^-7 | 0.0371 | 5.82×10^-5 |
| Discrepancy choice | about 2.086×10^-6 | 0.0388 | 8.34×10^-5 |

The coarse-grid value at 8×10^-14 has reconstruction error 65.85, consistent with the lesson's rounded 66. It is a severe failure **for inverse reconstruction**. It is not a prediction error of 66. A small GCV value does not certify any one noise realization either.

**Repair:** name the target before calling the choice disastrous, report both errors, and show the GCV curve if the reader is meant to learn to notice the two minima. Keep the honest failure case. Hansen's [Regularization Tools manual, §2.9 and `gcv`](https://www.imm.dtu.dk/~pch/Regutools/RTv4manual.pdf) grounds the criterion in predictive cross-validation and gives its trace form.

## Smaller mathematical and editorial repairs

- **§7.4, line 650:** the size-budget equivalence needs `0<t<‖A⁺b‖` for a finite positive λ. At t=0, the constrained solution is zero, generally reached only as λ→∞.
- **§6, line 549:** present a Picard plateau as a diagnostic under the stated decay/noise model. It does not by itself prove a coefficient is noise or identify an exact universal cutoff. Avoid “no filter could recover x stably” as an unconditional claim for every finite problem without the Picard condition.
- **§8:** “moves w along v₂ without moving Xw” should be “with only a small change in Xw.” In the changed-units preset, the noiseless response is unchanged but the ridge fitted values generally change; qualify the sentence claiming both are unchanged.
- **§5.3, line 468:** `κε<1` is a sufficient relative-size restriction ensuring `‖E‖<σₙ`, not equivalent for an arbitrarily loose upper bound ε.
- **K1 reference:** its final formula drops the small strong-channel term in the actual opening perturbation. Use `≈` or include the full sum, matching the precision correction already made in §5.1.
- **K6 reference:** blur suppresses high-frequency components; attempting to invert blur amplifies their noise. A difference penalty can be a useful smoothness assumption, but smaller bias at a fixed noise suppression is not automatic for every smooth target.

## Prose and figure assessment

The strongest passages remain the cancellation/Pythagoras argument, the two-space projection example, the five-step channel reconstruction, and the return to the opening fit at f₂≈0.00956. Sections 6 and 7 extend that story naturally. The bisection table gives the learner a procedure they can carry out. Section 10's kernel argument and the preconditioned change of variables provide reasons, not just theorem statements.

The revised section hints now generally suggest a next action rather than exposing the result. Keep their different activities: calculation, explanation, repair and transfer. The writing does not need fake dialogue, extra rhetorical questions, or wholesale shortening to sound natural.

The main prose adjustment is epistemic precision: distinguish what the reader can calculate, what a bound permits, what an experiment illustrates, and what remains unknown. Section 11 currently breaks that pattern by supplying categorical verdicts from incomplete reports. Section 9's GCV paragraph would teach more with one concrete reading of its formula and a labelled curve than with a second bare numerical failure story.

All twelve SVGs were regenerated to PNG previews and inspected. Their underlying examples and labels are generally useful. The revised axis names, signed channel values, and unbounded marker resolve the earlier static-figure comments. The two-panel Picard figure and GD kernel-coordinate diagram are especially helpful once they render in the reader. A fixed common axis in the trust bar chart should explicitly identify the units of each category and avoid implying a unit-invariant comparison.

## Real-reader checks

Tested the local static reader in headless Google Chrome 156 through Playwright, at 1440×1000 and 390×844, using the actual CDN renderer scripts.

- No page JavaScript errors, failed requests, or KaTeX parse errors were observed.
- Light and dark themes render prose, equations and lab controls. The phone document width is 390 pixels; long display equations use horizontal scrolling rather than widening the page.
- All five presets, reveal behavior, changed units, exact collinearity, zero noise, theme changes and the extreme near-collinear case were exercised.
- A1 accepts `1/75,2/75,2/75` and `1/15` and reports “All correct.” Its reference reveal works.
- A written A8 attempt can be entered after opening the working area; the offline reference and its rubric can be revealed. Automated/model proof grading was not invoked. Without that service, entering working alone does not unlock the reference; the “reveal without attempting” control does. This is existing checker behavior, not mathematical proof verification.
- Three figures are missing as described in finding 1. Small labels in multi-panel static SVGs still require zoom at phone width; this review does not claim they are comfortably readable at native phone scale.

Screenshots and local browser probes are in `/tmp/la10-full-review/`, including `reader-ridge-light.png`, `reader-ridge-dark.png`, `lab-mobile.png`, and `extreme-prediction-chart.png`. These are local review artifacts, not committed assets.

## Benchmark assessment and scores

The full chapter was read, its central proofs inspected, its worked arithmetic checked against the persistent scripts, and 15 of the 16 typed-answer entries independently compared with computed expected values. The remaining typed item A6 was also read and its two GD steps checked algebraically. The reported three-channel, 32-channel, ridge and GD examples reproduce. GCV was evaluated independently on a finer grid using the full seeded noise values rather than the rounded figure constants.

Coverage is present for the promised canonical results: minimum-norm least squares, the four Moore–Penrose identities and uniqueness, singular-value sensitivity, truncated SVD and the noise/signal split, ridge filters and limits, discrepancy existence, L-curve/GCV examples, GD initialization and step-size conditions, and SPD preconditioning. The explicit deferrals are appropriate.

Primary-source comparison used Hansen's accessible manual for filters, Picard plots and parameter selection, the official NumPy API documentation for tolerances, the official optimizer algorithms for C2, and the previously reviewed Woodworth gradient-flow characterization. The SIAM Higham URL returned chapter metadata/abstract rather than the full theorem, and the named ESL/Golub–Van Loan textbook sections were not available for full text comparison in this run. Therefore the exact named-book benchmark audit remains incomplete; these are provisional review scores, not a textbook sign-off.

| Dimension | Score / 5 | Evidence |
|---|---:|---|
| Correctness | 3 | Central algebra checks out; C2 is wrong, and the lab mislabels sampling discrepancy as shrinkage bias. |
| Rigor | 3.5 | Explicit theorem hypotheses and proofs are strong; §11 and some numerical references overstate what their evidence proves. |
| Coverage | 4 | All central promised topics are represented and the deferred topics have homes. Exact textbook comparison is still pending. |
| Novice clarity | 4 | Concrete examples, recurring questions, useful hints and navigable depth; GCV's target and §11's verdicts need clarification. |
| Visual intuition | 3 | Twelve useful figure designs, but three are absent in the real reader and the interactive silently distorts extreme predictions. |
| Exercise quality | 3 | Good range of tasks and checked typed arithmetic; several experimental references are incomplete, and C2 teaches an error. |

These scores do not meet the standard's floor of 4 in every dimension. Repair the correctness/rendering findings and complete the experimental references before re-auditing; retain the current narrative structure.

## Automated verification

Passed `node scripts/figures/build.mjs --check` (82 generated figures), `python3 scripts/verify/la10/la10_assert.py`, `node scripts/check-theory.mjs` including LA10's textbook-standard gate, and `python3 -m labs.checks --reference`, including all three new tasks.

The review changed review records only. Chapter prose, answer-bank entries, runtime code, figures and generated catalogs were left unchanged. Nothing was committed.

## Re-audit after repairs — 2026-11-04

**Decision: prose, figure and reader review passed.** The recurring questions, worked arithmetic and transitions remain effective. The GCV explanation now distinguishes reconstruction from prediction, and the Section 11 reports distinguish stability from accuracy. The added evidence improves the teaching without turning the chapter into a checklist or making its voice feel mechanical.

| Earlier finding | Re-audit result |
|---|---|
| Missing reader figures | Resolved. The actual browser renders and loads 13 of 13 LA10 images and 9 of 9 LA09 images, with no raw image-Markdown paragraphs in LA10. |
| C2 coupled Adam explanation | Resolved. Objective normalization and coupled/decoupled updates are distinguished correctly. The three reference runs reproduce. |
| Sample-mean discrepancy labelled bias | Resolved. Bias is computed from the noiseless estimate and is unchanged by resampling. At λ=0 the browser shows only numerical roundoff, about 5×10^-13 in the default design. |
| Units mixed in coefficient spread | Resolved. The two coefficient standard deviations have individual unit labels; verdict comparisons use prediction quantities in units of y. |
| Extreme predictions clamped | Resolved. The readout counts values outside the fixed view, and the fit-axes control displays the true range. The changed-units filter chart shows both singular-value markers. |
| Incomplete experimental references | Resolved for review purposes. B1–B4 and C1–C3 have repository scripts, concrete data/seed choices, recorded outputs and explanatory references. All seven were executed in this re-audit. |
| Section 11 categorical verdicts | Resolved. Reports are assessed by what they support and what is missing; known synthetic truth is identified explicitly. |
| GCV prediction/reconstruction confusion | Resolved. The added figure shows the two minima and reports both kinds of error. It renders in the reader. |

The earlier smaller-repairs list was also checked: the positive size-budget interval, qualified Picard interpretation, small rather than zero change in Xw, changed-units fit qualification, sufficient Wedin size condition, full channel sum in K1, and the target-dependent smoothness argument in K6 are present.

### Browser verification

Used the actual local reader in headless Google Chrome 156 via Playwright, at desktop size 1440×1000 and phone size 390×844. Both themes, all five presets, zero noise, exact collinearity with changed units, resampling, reveal, and the fit-axes control were exercised. There were no page JavaScript errors or failed requests, and no document-wide horizontal overflow at phone width.

Specific regressions checked:

- At λ=0 the fitted-value bias is at roundoff level, rather than a sampling-dependent positive value. At λ=0.01 it is about 0.002673 in the original units and does not change on resampling.
- With exact collinearity, x₂ multiplied by 10, no noise and λ=0, the noiseless estimate is approximately `(0.0198,0.198)`. The new explanation correctly attributes the parameter difference to choosing among equally good fits; fitted-value bias is at roundoff level.
- With h=0.001, s=0.05, λ=0 and an off-pattern query, one exercised seed puts 37 of 200 predictions and 41 of 50 coefficient estimates outside the fixed view. The true prediction range is approximately `[-94.07,74.8]`. The counts are visible and fitting the axes shows the data without clamping. Counts vary appropriately when the seed changes.
- The changed-units preset shows both singular values, including σ₁≈37.58, in the filter chart.
- Typed A1 accepts the correct fractional entries. The corrected C2 written reference can be revealed and contains the fixed-objective explanation.

The new GCV figure and revised trust figure were visually inspected from rendered PNG previews. Screenshots and browser probe code for this re-audit are in `/tmp/la10-reaudit/` and `/tmp/la10_reaudit_browser.py`. As before, small static-figure labels require zoom at phone width; no claim is made that dense multi-panel SVG labels are comfortably legible without zoom.

### Reproduced experiments

Executed with NumPy 2.0.2 and PyTorch 2.8.0 in an isolated uv environment. The reported values reproduce, including:

| Reference | Observed result |
|---|---|
| B1 | Default ranks 2, 3, 3; noise-based rank 1. |
| B2 | Plateau begins at channel 7; best k=6, error 0.002322; full inversion error about 5.921×10^6. |
| B3 | L-curve errors 0.2529 and 0.2389 at the two grid densities; discrepancy and hindsight-best errors both about 0.0207. |
| B4 | At λ=10^-12, relative differences 3.89×10^-5 for normal equations and 4.67×10^-12 for stacked least squares; at λ=10^-4, 6.88×10^-13 and 3.30×10^-15. |
| C1 | Zero-start distance from pseudoinverse 2.28×10^-14; random-start distance from predicted limit 2.66×10^-14. |
| C2 | Distances from ridge: SGD 3.72×10^-14, coupled Adam 2.03×10^-7, AdamW 0.967. |
| C3 | Small-init run: 400,000 steps, residual 5.0×10^-7, distance from sparse truth 0.013. Large-init run: 572 steps, residual 1.4×10^-8, distance from minimum-ℓ₂ solution 0.033. |

One nonblocking wording refinement remains advisable: C3's small-init result is a **budget-limited iterate**, not an established limit. It reaches the script's 400,000-step cap before its residual stopping condition. The numerical report already exposes that residual; use “final iterate” rather than “limit” when describing this finite run.

### Current assessment and outstanding work

Current review scores are correctness **4**, rigor **4**, coverage **4**, novice clarity **4**, visual intuition **4**, and exercise quality **4**. These supersede the previous provisional scores for the reviewed draft. They reflect the repaired content and observed reader behavior, not completion of the exact-source benchmark audit.

Two tasks remain outside this review's sign-off:

1. **Complete the exact named-textbook comparison.** No new source texts were supplied in this re-audit. The previously recorded access limitations for the full Higham theorem text and named ESL/Golub–Van Loan sections remain, so the formal benchmark audit is still incomplete. Do not mark the chapter upgraded on the strength of the automated gate or these review scores alone.
2. **Persist the answer-bank generator.** The bank and its experiment references are in the repo, but the user reports that its generator is only in scratch storage. Move the generator into a documented repository location, then regenerate to a temporary path and compare byte-for-byte with `public/theory/answers/10-pseudoinverse.js`. This is a reproducibility/maintenance follow-up, not a newly discovered mathematical or reader defect. The generator was not moved or executed by this review.

Automated verification again passed: 83 generated figures checked, the full LA10 assertion script including GCV, the theory checker and its textbook gate, and all reference labs including the three LA10 tasks. Only review records were changed by this re-audit; no lesson, answer-bank, lab, figure or generated catalog was edited, and nothing was committed.
