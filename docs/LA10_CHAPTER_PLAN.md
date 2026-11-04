# LA10 — Pseudoinverse and regularization: chapter plan

Status: **authored 2026-11-04 (all sections, figures F1–F10 plus two more, `la-ridge`, three Python tasks, answer bank); repairs from [LA10_CHAPTER_REVIEW.md](LA10_CHAPTER_REVIEW.md) and [LA10_FULL_CHAPTER_REVIEW.md](LA10_FULL_CHAPTER_REVIEW.md) applied; re-audit pending.** One authoring finding not in the plan: on the 32-channel problem GCV has two minima, and its global one (λ≈8·10⁻¹⁴, error 66) fails; §9.3 reports this. First drafted 2026-11-04. Revised the same day in response to [LA10_CHAPTER_PLAN_REVIEW.md](LA10_CHAPTER_PLAN_REVIEW.md); the revision log at the end maps each review item to its repair.

This expands the LA10 brief in [content/02-linear-algebra/_plan.md](../content/02-linear-algebra/_plan.md#4-detailed-module-briefs) into a section-by-section authoring plan written to the [textbook-quality standard](../content/_plans.md#textbook-quality-standard). Nothing listed here is registered yet. Every number marked *verified* was recomputed in exact rational arithmetic, or in double precision where noted. The scripts are reproduced in the appendix so the author can rerun them.

## Identity and contracts

| Field | Value |
|---|---|
| Handle | LA10 |
| File | `content/02-linear-algebra/10-pseudoinverse-regularization.md` |
| Content ID | `math.linear-algebra.pseudoinverse-regularization` |
| Prerequisites (front matter) | `[math.linear-algebra.norms-conditioning-stability]` (LA09; LA03 and LA08 reached transitively) |
| Hours | 26 |
| Answer bank | `public/theory/answers/10-pseudoinverse.js` (reserved LA key) |
| Figures | `scripts/figures/la10.mjs`, registered in `scripts/figures/build.mjs` |
| Interactive | `public/theory/labs/la-ridge.js` (new); reuses `chartkit.js`, `heatkit.js` |
| Python tasks | `pinv-via-svd` → `pinv_via_svd`, `ridge-solve` → `ridge_solve`, `min-norm-solution` → `min_norm_solution` in `labs/exercises.py`, `labs/reference.py`, `labs/checks.py`, `labs/browser_labs.json` |

Length follows the content: completeness over brevity. Length is not evidence of an appropriate learning load. The reading route below is what makes the depth navigable.

## Promises this chapter must keep

| Source | Promise | Where it lands |
|---|---|---|
| [LA03 §8](../content/02-linear-algebra/03-projections-least-squares.md) | Free-variable-zero vs minimum-norm representative for duplicate columns | §1 (convention vs objective) and §2 (A=[[1,1],[2,2]], y=(1,0)) |
| [LA04 close](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Rank-deficient minimum-norm solving | §2–3; QR with column pivoting deferred to LA11 |
| [LA08 §4](../content/02-linear-algebra/08-svd-low-rank.md) | Define the pseudoinverse operator; what small σᵢ do to the division | §3, §5 |
| [LA09 §3 notes](../content/02-linear-algebra/09-norms-conditioning-stability.md) | Rectangular A needs a stated least-squares problem before κ means anything | §5 |
| [LA09 close](../content/02-linear-algebra/09-norms-conditioning-stability.md) | Sharp least-squares perturbation theory | §5.3 (second-reading subsection, proof retained) |
| LA10 brief, RS gate | Overparameterization alone does not force a minimum-norm solution | §10 |

**Coordination with LA08's pending upgrade.** LA08's upgrade line asks for "the explicit pseudoinverse". Keep it there to the formula and one sentence pointing here.

## How the chapter should read

This section is for the author. None of its vocabulary belongs in lesson prose.

**Two questions drive the chapter.** Every section either advances one of them or prepares a step that will.

1. *Which answer did the library pick?* The equation x₁+2x₂=5 has a line of solutions; `lstsq` returns (1,2).
2. *Why did the coefficients jump?* Fit x₁=(1,2,3) and x₂=(1,2.01,2.99) to y=(2,4.05,5.95) and you get w=(−3,5). Change y to (2,4.06,5.94), moving two observations by 0.01, and the fit becomes w=(−4,6). Each coefficient moved by 1, and the fitted values moved by at most 0.01. With ridge penalty λ=0.01 the fits are about (0.960,1.036) and (0.950,1.045). *(Verified exactly; σ₁≈5.290, σ₂≈0.0098233, κ₂≈538.)*

**Callbacks are planned, not incidental.** §1 and §2 answer question 1. §3 ends by pointing out that A⁺ divides by σ₂≈0.0098. §5 resolves question 2 with that division: the perturbation's component along u₂ is divided by σ₂. §7 returns to the same ridge numbers and shows that f₂≈0.00956 is what held the coefficients still. These are returns to the question, not repeated worked examples.

**Section transitions.** Each section ends by earning the next question:

| After | The reader now understands | Question that motivates the next step |
|---|---|---|
| §1 | Moving along an invisible direction changes the answer without changing the fit. | What if an exact fit is impossible? |
| §2 | First project the observations, then take the shortest parameter vector that produces that projection. | Can one linear map do both operations? |
| §3 | A⁺ reverses each nonzero SVD channel and ignores the unreachable part of b. | How do we recognize the same operator without choosing singular vectors? |
| §4 | Four identities characterize the operator. | What happens when a nonzero channel is very small? |
| §5 | Dividing by a small σ amplifies perturbations; this is the coefficient jump. | Must we invert every nonzero channel? |
| §6 | A cutoff trades discarded signal against amplified noise. | Can that tradeoff change smoothly? |
| §7 | Ridge damps channels continuously. | What does that look like on data, and where is it safe to predict? |
| §8 | Stable fitted values do not mean stable predictions everywhere. | How much damping can the data justify? |
| §9 | A noise level, or validation, sets the knob; the L-curve is only a heuristic. | Does an optimizer choose a solution of its own? |
| §10 | Gradient descent from zero is another spectral filter, under explicit conditions. | Would you trust these coefficients? (§11) |

**The reading route has three natural stopping points.**
1. **Choosing a solution (§1–4):** explain and compute a minimum-norm least-squares solution.
2. **Controlling amplification (§5–8):** explain the unstable channel and compare cutoff with ridge.
3. **Defending the choice (§9–12):** select a parameter, state the optimizer's assumptions, and implement the methods.

Second-reading material is labelled as such in the lesson and keeps its proofs: §5.3 (matrix perturbation), §7.4 (ridge connections), and the Moore–Penrose consequences beyond the projectors in §4. The exercise list marks required items separately from extensions.

**Voice.** Rule A's progression (question, picture, worked example, theorem, proof, quick check) is followed conceptually. It does not need the same visible labels, openings or paragraph rhythm in each section.
- A figure answers a question the prose has just raised.
- An example exposes why the coming definition is needed.
- A proof explains why the observed behavior persists.
- Formulas arrive as summaries of reasoning the reader has already done, never before it.
- Avoid stock announcements ("Now we build intuition", "The key insight is", "This bridges…"); state the actual connection.
- Do not manufacture informality: no fake hesitation, invented student reactions, or claims about what everyone gets wrong.
- Lab and rubric vocabulary ("contract", "gate", "certificate", "supplied") stays out of teaching prose.

The review's sample for the first puzzle is the reference voice:

> The equation `x₁+2x₂=5` has many answers. `(5,0)` works. So does `(1,2)`. A least-squares routine returns `(1,2)`. What has it chosen between?
>
> Start at `(1,2)` and move in the direction `(2,−1)`. Increasing the first coordinate by 2 adds 2 to the left-hand side; decreasing the second by 1 subtracts the same 2. The equation cannot detect this movement.
>
> Every solution therefore has the form `(1,2)+t(2,−1)`. Those two vectors are perpendicular, so the squared length is `5+5t²`. It is smallest at `t=0`.

**Practice varies in kind.** Every section keeps its Foundation, Core and Stretch practice, but the activities differ: calculate a missing coordinate, explain a diagram, compare two answers, or repair a plausible but wrong argument.

## Section plan

### 0. Route and prerequisite diagnostic
- The three-stop route above, in plain words.
- Notation: A∈ℝᵐˣⁿ with rank r; compact SVD A=UᵣΣᵣVᵣᵀ for r≥1; A⁺; P_S is the orthogonal projector onto S; λ≥0; x† is the minimum-norm least-squares solution. The case A=0 (r=0, A⁺=0) is stated once here and excluded where a statement needs σᵣ.
- Diagnostic items with repair links: kernel and row space of a 2×3 matrix (LA02); project b onto a column space (LA03); read channels from a given SVD (LA08); κ₂ for a square matrix (LA09).

### 1. Many solutions: choose the one the matrix can see
- **Open with question 1**, in the voice sample above: the 1×2 example, solved by moving along the invisible direction (2,−1), then Pythagoras.
- **Picture (F1):** the solution line, the row-space line through (1,2), and their intersection. The free-variable-zero point (5,0) is marked for contrast.
- **Realistic size, worked by reasoning before any formula.** A=[[1,0,1],[0,1,1]], b=(2,3).
  - Every solution is x=(2−t, 3−t, t), and the null direction is (−1,−1,1).
  - The shortest representative is perpendicular to it: −(2−t)−(3−t)+t=0 gives t=5/3, so x†=(1/3,4/3,5/3) with ‖x†‖²=14/3.
  - The free-variable-zero choice (2,3,0) has norm² 13. *(Verified.)*
- **Theorem 1.** For consistent Ax=b, the solution set is x₀+ker A. Exactly one solution lies in row(A)=ker(A)^⊥, and it uniquely minimizes ‖x‖. The proof is orthogonal decomposition plus Pythagoras.
- **Only then the formula.** Corollary: when A has full row rank, the row-space solution is Aᵀz with AAᵀz=b, giving x†=Aᵀ(AAᵀ)⁻¹b. Recheck it on the 2×3 example: AAᵀ=[[2,1],[1,2]] gives back (1/3,4/3,5/3).
- **LA03 callback.** Free-variable-zero depends on column order, which makes it a convention. Minimum norm is an additional objective.
- **Transition:** what if no exact fit exists?

### 2. No exact fit: project first, then take the shortest
- **Picture (F3):** two panels. Observation space shows b, its projection onto range(A), and the residual. Parameter space shows the affine set of least-squares minimizers, the row-space line, and x†.
- **Worked first: LA03's duplicate columns,** completed in full. A=[[1,1],[2,2]], y=(1,0). The projection is (1/5,2/5), the minimizers satisfy w₁+w₂=1/5, and the shortest is (1/10,1/10).
- **Second worked case,** using only projection and null space (no SVD). A=[[1,2],[2,4],[0,0]], b=(1,1,1).
  - range(A) is spanned by (1,2,0), so the projection is (3/5)(1,2,0) and the residual is (2/5,−1/5,1).
  - The minimizers satisfy w₁+2w₂=3/5. The row space is spanned by (1,2), giving x†=(3/25,6/25).
  - Check: Ax†=(3/5,6/5,0). *(Verified.)*
- **Theorem 2.** x† is characterized by two conditions: Aᵀ(Ax−b)=0 and x∈row(A). It exists and is unique. The proof uses LA03 projection plus Theorem 1.
- **Transition:** both steps (project, then pick the row-space representative) are linear in b. Is there one matrix that does both?

### 3. The pseudoinverse: reverse the channels you can see
- **Picture (F2):** the four-subspace map. A carries row(A) to range(A) channel by channel. A⁺ carries range(A) back, dividing by each σᵢ, and sends ker(Aᵀ) to 0.
- **Worked, channel by channel before any matrix product.** Say once that the factors were constructed for readable arithmetic: the example applies a given SVD and does not teach how to find one.
  - The factors: U=(1/3)[[1,2,2],[2,1,−2],[2,−2,1]], σ=(6,3,0), V=(1/3)[[2,−1,2],[2,2,−1],[−1,2,2]]. These give A=(1/3)[[2,8,2],[7,10,−2],[10,4,−8]].
  - For b=(1,1,1), read the coordinates: u₁ᵀb=5/3, u₂ᵀb=1/3, u₃ᵀb=1/3.
  - Divide the two retained coordinates by their σ: 5/18 and 1/9.
  - Rebuild along the vᵢ: x†=(5/18)v₁+(1/9)v₂=(4/27,7/27,−1/54).
  - The discarded coordinate gives the residual (1/3)u₃=(2/9,−2/9,1/9), which lies in ker(Aᵀ).
- **Then assemble the operator.** A⁺=Σᵢ vᵢuᵢᵀ/σᵢ=VᵣΣᵣ⁻¹Uᵣᵀ=(1/54)[[−2,2,8],[10,8,−4],[7,2,−10]], and A⁺b reproduces x†. *(All verified exactly.)*
- **Independence of the chosen SVD.** When singular values repeat, A⁺ depends only on the projectors, not on the individual singular vectors. This motivates §4.
- **Forecast (callback to question 2):** for the near-collinear features, the same recipe divides by σ₂≈0.0098. Keep that division in mind.

### 4. Four identities pin the operator down
- **Picture:** each Moore–Penrose condition read off F2. (1) AA⁺A=A; (2) A⁺AA⁺=A⁺; (3) (AA⁺)ᵀ=AA⁺; (4) (A⁺A)ᵀ=A⁺A.
- **Theorem 3.** The SVD formula satisfies all four conditions, and any matrix satisfying all four equals it. Give the algebraic uniqueness proof (Penrose 1955; Golub & Van Loan §5.5).
- **Core consequences (required):** AA⁺=P_range(A) and A⁺A=P_row(A), verified on §3's matrix. The full-column-rank formula (AᵀA)⁻¹Aᵀ is LA03's left inverse; the full-row-rank formula Aᵀ(AAᵀ)⁻¹ is §1's corollary.
- **Second reading:** (Aᵀ)⁺=(A⁺)ᵀ and (A⁺)⁺=A.
- **Counterexamples:**
  - Condition (1) alone does not determine the matrix, and the free-variable-zero solver is one such "{1}-inverse".
  - (AB)⁺≠B⁺A⁺ for an explicit 2×2 pair, to be computed and verified when authoring.

### 5. Small singular values: where the coefficient jump came from
Definitions assume A≠0. Relative bounds assume x≠0 and b≠0, and θ is defined only for b≠0.

- **5.1 Resolve question 2 first, by direct experiment.**
  - In the near-collinear fit, the change in y is δy=(0,0.01,−0.01). It lies almost entirely along u₂, the weak observation direction.
  - A⁺ divides that component by σ₂≈0.0098 and places the result along v₂≈(1,−1)/√2. That is the (−1,+1) jump in w.
  - The general fact behind it: ‖A⁺‖₂=1/σᵣ.
- **5.2 Right-hand-side bound (core, exact, proved).** Assume full column rank. Then ‖δx‖/‖x‖ ≤ (κ₂/cosθ)·‖δb‖/‖b‖, where κ₂=σ₁/σₙ=‖A‖‖A⁺‖ and cosθ=‖AA⁺b‖/‖b‖.
  - Proof: ‖δx‖≤‖δb‖/σₙ and ‖x‖≥‖Ax‖/σ₁=‖b‖cosθ/σ₁.
  - This keeps LA09's rectangular-κ promise.
- **Picture (F4):** discontinuity at a rank change. Plot ‖A_ε⁺‖₂ against ε for A_ε=[[1,1],[1,1+ε]]; it grows like 1/ε and drops to 1/2 at ε=0.
  - Theorem: if rank(A+E)>rank(A), then ‖(A+E)⁺‖₂≥1/‖E‖₂.
  - The figure uses a non-diagonal family, following the LA09 audit's request for fewer diag(1,ε) examples.
- **5.3 Second reading: perturbing the matrix (proof retained; LA09 promise).** Full column rank, x≠0, ‖E‖≤ε‖A‖, ‖δb‖≤ε‖b‖, ε small enough that A+E keeps full column rank. With r=b−Ax:
  - Derive to first order δx = A⁺(δb−Ex) + (AᵀA)⁻¹Eᵀr.
  - The matrix term contributes at most ε(κ₂ + κ₂² tanθ), since ‖A⁺Ex‖/‖x‖≤κ₂ε and ‖(AᵀA)⁻¹Eᵀr‖/‖x‖≤εκ₂² tanθ.
  - The κ² term comes from the residual and vanishes for an exact fit. But a *small nonzero* residual still matters when κ is large; the plan's earlier phrase "κ² only when the fit is poor" is withdrawn.
  - Cite the full non-asymptotic statement and its hypotheses (Golub & Van Loan Thm 5.3.1; Higham §20.1; the least-squares error-analysis survey App. B.2).
- **Problem sensitivity is not algorithm stability.** This is a separate, short paragraph.
  - The bound above is the sensitivity of the least-squares problem itself, and no algorithm can remove it.
  - Forming AᵀA is a separate, algorithmic hazard: the computed Gram matrix carries rounding at scale κ²u no matter what the residual is. QR and SVD avoid that extra loss; they do not remove the problem's own κ² tanθ.
  - This closes the LA03 §10 thread.
- **Transition:** must we invert every nonzero channel?

### 6. Truncated SVD: decide which channels to trust
- **Worked first (verified exactly).** The problem is in SVD coordinates. U and V are rational orthogonal factors chosen when authoring; norms do not depend on them.
  - Singular values σ=(1, 1/10, 10⁻⁴). The true solution has coordinates c=(1, 1/2, 1/10) along vᵢ.
  - Noise: Uᵀe=10⁻³·(1,−1,−1), so ‖e‖=δ=√3·10⁻³≈1.732·10⁻³.
  - Observed coordinates β=Uᵀb=(1001/1000, 49/1000, −99/100000). Dividing by σ gives (1.001, 0.49, −9.9).

  | Cutoff k | Solution coordinates | Error ‖x_k−x‖ | Residual² |
  |---|---|---|---|
  | 1 | (1.001, 0, 0) | 0.5099 | 2.402·10⁻³ |
  | 2 | (1.001, 0.49, 0) | 0.1005 | 9.801·10⁻⁷ |
  | 3 | (1.001, 0.49, −9.9) | 10.000 | 0 |

  - The third channel's true contribution is 10⁻⁵; its noise is −10⁻³. Dividing by 10⁻⁴ turns the noise into −10, so the recovered third coordinate is 0.1−10=−9.9.
  - With this noise sign, no amount of damping can recover c₃=0.1 from channel 3 (see §7). The example therefore does not rely on a lucky cancellation; an earlier draft did and was replaced.
- **Picture (F5): Picard plot on a larger problem.** Three channels cannot show a noise plateau, so use a separate reproducible problem (*double precision, verified*):
  - n=32 channels with σᵢ=10^(−8(i−1)/31) and true coordinates cᵢ=σᵢ^(1/2), so the exact βᵢ=σᵢ^(3/2) decay faster than σᵢ.
  - Gaussian noise with standard deviation 10⁻⁴/√32 per channel, from Python `random.Random(10)`; realized ‖e‖≈9.57·10⁻⁵.
  - The exact |βᵢ| fall below the per-channel noise level at index 13 (0-based), and the best truncation is k=14 (error 0.0387; ‖c‖≈1.494). The plateau and the best cutoff agree, which is what the plot should teach.
  - Error against k: 0.455 (k=4), 0.139 (8), 0.052 (12), 0.155 (16), 1.48 (20), 22.6 (24), 962 (32).
- **Definitions.** Numerical rank at an absolute tolerance τ, the truncated operator A_τ⁺, and filter factors fᵢ∈{0,1}.
- **Theorem.** A_k⁺b is the minimum-norm minimizer of ‖A_kx−b‖. Its error splits into a truncation part and a noise-amplification part, the latter bounded by ‖e‖/σ_k.
- **Discrete Picard condition (Hansen):** stated, with its reading on F5.
- **Numerical notes: library tolerances differ.** Document each API separately, record the NumPy version used, and distinguish these *relative* arguments from the labs' *absolute* `tol`. Recheck each default against the official documentation when authoring:
  - `pinv`: with no tolerance argument it uses relative cutoff 10⁻¹⁵ (`rcond`); newer versions add `rtol`.
  - `matrix_rank`: σ₁·max(m,n)·ε.
  - `lstsq`: its own `rcond` convention, which changed across versions.

### 7. Ridge: replace the hard cutoff with a smooth filter
- **7.1 Derivation (core, all proved).** For λ>0:
  - min ‖Ax−b‖²+λ‖x‖² has the unique solution (AᵀA+λI)x=Aᵀb.
  - In SVD form, x_λ=Σ fᵢ(uᵢᵀb/σᵢ)vᵢ with fᵢ=σᵢ²/(σᵢ²+λ), and x_λ∈row(A).
  - x_λ→A⁺b as λ→0⁺, even when A is rank-deficient. On the duplicate-column case x_λ=(c,c) with c=1/(10+λ)→1/10 (verified at λ=1, 1/100, 10⁻⁶).
- **7.2 Return to question 2 (callback).** Near-collinear fit at λ=0.01, with σ₁²≈27.98 and σ₂²≈0.0000964971:
  - f₁≈0.99964 and f₂≈0.0000964971/(0.0000964971+0.01)≈0.00956.
  - The weak channel is passed at under 1%, which is why the coefficients barely moved: (0.960,1.036) became (0.950,1.045).
  - Predictions at the observed inputs barely change either. (An earlier draft wrote f₂ with σ₂ in place of σ₂².)
- **Picture (F6):** filter factors against σ on log axes. The TSVD step, the ridge curve, and (added in §10) the gradient-descent curve for 0<η≤1/σ₁².
- **Back to the small §6 problem.**
  - Ridge errors: 5.05 (λ=10⁻⁸), 0.198 (10⁻⁶), 0.110 (10⁻⁵), 0.102 (10⁻⁴), 0.114 (10⁻³), 0.274 (10⁻²).
  - The hindsight-best value is λ≈1.19·10⁻⁴ with error 0.1021, essentially the same as TSVD k=2.
  - Ridge is no magic: it trades off smoothly. *(Verified.)*
- **Monotonicity.** ‖x_λ‖ is nonincreasing and ‖Ax_λ−b‖ nondecreasing in λ, both strictly when Aᵀb≠0. Prove from the filter factors; §9 needs this.
- **Conditioning.** κ₂(AᵀA+λI)=(σ₁²+λ)/(μ_min+λ), where μ_min is the smallest eigenvalue of the n×n matrix AᵀA. μ_min=0 whenever rank(A)<n, including wide full-row-rank A; μ_min=σₙ² only under full column rank.
- **Algorithm.** Solve the stacked least-squares problem [A; √λI]x≈[b; 0] rather than forming AᵀA (LA09 thread). The QR implementation belongs to LA11.
- **7.4 Second reading: connections (ESL §3.4).**
  - The constrained form ‖x‖≤t, by a Lagrange argument (stated; the optimization track owns duality).
  - Effective degrees of freedom df(λ)=Σσᵢ²/(σᵢ²+λ).
  - An isotropic penalty's meaning depends on units, so standardize; leave the intercept unpenalized and prove it via centering.
  - The Bayesian MAP reading in one sentence, deferred to PS09.
  - Generalized Tikhonov ‖Lx‖² as a Stretch exercise only.

### 8. Experiment: what the noise moves (`la-ridge`)
- **Setup, stated on screen.**
  - Fixed design: the hook's three-row near-collinear X, plus a slider that moves x₂'s perturbation and so sets σ₂.
  - True coefficients w*=(1,1). Noise: independent N(0,s²) on each yᵢ, with s set by a slider.
  - 50 noise draws, fixed seed per resample button. X and w* stay fixed across draws.
- **Prediction/reveal, precise version:** "The coefficients move a lot across draws. Do the fitted values at the observed inputs move comparably?" The learner commits to an answer before the reveal.
- **Panels, each with fixed axes and units.**
  1. Parameter space (w₁,w₂): the cloud of estimates, with w* marked. At λ=0 the cloud stretches along v₂.
  2. Observation space: the spread of fitted values at each of the three observed inputs, in units of y.
  3. Live filter factors on the singular-value axis.
- **No combined ratio.** The two spreads are reported separately, each in its own units: the coefficient spread in units of y per unit of feature, and the fitted-value spread in units of y.
  - A ratio such as coefficient spread divided by s still carries units of 1/(feature), so it changes under the changed-units preset.
  - The separate panels and the off-pattern prediction already make the point without one.
  - When s=0, every draw coincides; show a single point and the note "no noise: zero spread".
- **Off-pattern query (the essential qualification).**
  - Define it in the prose: an input whose two features disagree, e.g. (x₁,x₂)=(1,0), unlike the training rows where x₁≈x₂.
  - Its component along v₂ is about 1/√2. The prediction there inherits the v₂ instability, so stable fitted values at observed inputs do not establish stable predictions everywhere.
- **Presets.**
  - Near collinear (the default).
  - **Exact collinearity:** at λ=0 there is a line of solutions; pinv returns the minimum-norm one, and ridge varies continuously as λ→0.
  - **Changed units:** measure x₂ in different units. An isotropic penalty now means something different, and the shrinkage falls differently on the two coefficients. Choosing a penalty requires a stated modeling objective; no units are "correct".
  - **Huge λ:** the coefficients and their noise-driven spread both tend to zero, while the shrinkage bias grows toward the error of the zero predictor. With w*=(1,1) the fitted values approach 0 and miss y by roughly ‖Xw*‖.
  - **Off-pattern test point:** as above.
- **Registration:** `GU.lab('la-ridge', mount)` with controls declared before `K.plot`. Keyboard-accessible matrix entry and both themes.

### 9. How much damping can the data justify?
- **Picture (F7):** ridge coefficient paths against log λ for the near-collinear fit.
- **Discrepancy principle (Morozov), with exact hypotheses.**
  - Assume Aᵀb≠0. Then ‖Ax_λ−b‖ is continuous and strictly increasing on λ>0, with limits ‖(I−AA⁺)b‖ as λ→0⁺ and ‖b‖ as λ→∞.
  - A unique finite positive λ with ‖Ax_λ−b‖=τδ exists **iff ‖(I−AA⁺)b‖ < τδ < ‖b‖**. If Aᵀb=0 the residual is constant at ‖b‖, so either no λ meets the target or every positive λ does. Either way, there is no unique choice.
  - **Bracket before bisecting.** Show two values of λ whose residuals straddle the target, then bisect in log λ.
- **Worked on the §6 problem (τ=1.1, verified).**
  - The target is τδ≈1.905·10⁻³, with ‖(I−AA⁺)b‖=0 and ‖b‖≈1.002, so a root exists.
  - Bracket: residual 4.95·10⁻⁴ at λ=10⁻⁸ and 0.101 at λ=10⁻¹.
  - The first log-bisection steps:

    | Step | λ | Residual | Target is… |
    |---|---|---|---|
    | 1 | 3.16·10⁻⁵ | 1.00·10⁻³ | above |
    | 2 | 1.78·10⁻³ | 7.67·10⁻³ | below |
    | 3 | 2.37·10⁻⁴ | 1.52·10⁻³ | above |
    | 4 | 6.49·10⁻⁴ | 3.21·10⁻³ | below |

  - Converges to λ*≈3.36·10⁻⁴, with error 0.1036. The hindsight-best error is 0.1021.
- **Unattainable targets, with an example.** A=[[1],[0]], b=(1,1): the floor is ‖(I−AA⁺)b‖=1 and ‖b‖=√2. A target of 0.5 lies below the floor and a target of 2 lies above ‖b‖, so neither has a root.
- **Picture (F8): the L-curve on the n=32 problem, presented with what was actually found.**
  - The maximum-curvature corner (computed on a λ grid of 10 points per decade) is at λ≈3·10⁻⁹. Its error is 0.209.
  - The discrepancy principle (τ=1.1, known δ) gives λ≈2.1·10⁻⁶ with error 0.039; the hindsight best is λ≈6.3·10⁻⁷ with error 0.033.
  - So on this problem the corner **under-regularizes**. Teach the L-curve as a heuristic with a documented failure mode (Hansen discusses it). The lesson must not promise a clean, reliable corner. Re-plot and inspect the curve when authoring; if the curvature estimate is fragile, say so.
- **GCV** is stated; **held-out validation** is the ML route, with its design owned by PS10.
- **Transition:** an optimizer that is never told about λ may still regularize. Does it choose a solution of its own?

### 10. Implicit bias: what gradient descent chooses, and when
Assume A≠0 throughout this section.
- **Theorem 4 (convergence).** Let xₜ₊₁=xₜ−ηAᵀ(Axₜ−b) with 0<η<2/σ₁². Then xₜ→A⁺b+P_ker(A)x₀, and starting from x₀=0 gives x†.
  - Proof: each update lies in range(Aᵀ)=row(A), so the kernel component of x₀ never moves.
  - Channel by channel, the row-space coordinate approaches uᵢᵀb/σᵢ geometrically with ratio (1−ησᵢ²), and |1−ησᵢ²|<1 for all retained channels.
- **Early stopping as a filter (separate claim, separate range).** From x₀=0, the channel coordinate after t steps is (1−(1−ησᵢ²)ᵗ)·uᵢᵀb/σᵢ.
  - For **0<η≤1/σ₁²** every ratio lies in [0,1), so the filter rises monotonically from 0 to 1. That is the curve drawn in F6.
  - For 1/σ₁²<η<2/σ₁² the strong channels oscillate, with negative ratios. The iteration still converges but is not a monotone damping filter. Demonstrate this separately.
  - The comparison t≈1/(ηλ) says when the small channels are passed at similar strength. It is a scale comparison, **not** an equality between GD and ridge solutions.
- **Worked (verified).** A=[[1,0,1],[0,1,1]], b=(2,3), η=0.3; here σ₁²=3, so 1/σ₁²=1/3 and η lies in the monotone range.
  - From 0, GD reaches (1/3,4/3,5/3)=x†.
  - From (1,1,1), it reaches (2/3,5/3,4/3). That is x† plus the projection of (1,1,1) onto ker A=span(1,1,−1), which is (1/3)(1,1,−1).
- **Picture (F9):** the two trajectories reaching different points on the same solution line.
- **The conditions, each with a proof or counterexample (RS gate).**
  - *Initialization:* zero or in row(A); otherwise the kernel component persists (the worked example).
  - *Geometry:* with a fixed **symmetric positive definite** P, the update xₜ₊₁=xₜ−ηPAᵀ(Axₜ−b) with stable steps from x₀=0 converges to the minimizer of xᵀP⁻¹x among least-squares solutions. From a general x₀, the limit minimizes ‖x−x₀‖ in the P⁻¹ metric. Prove this by the change of variables x=P^(1/2)z.
  - *Parameterization:* use a **signed** factorization so the target is reachable, e.g. w=u⊙u−v⊙v with initialization u₀=v₀=α·1, α>0. State the result precisely and do not prove it (Woodworth et al. 2020, §4, Theorems 1–2):
    - It concerns **gradient flow**, the continuous-time limit, and holds *conditional on* convergence to an interpolating solution.
    - At a fixed α>0, the limit minimizes an α-dependent function Q_α among interpolants.
    - The ℓ₁ behaviour is the **α→0 limit** of that characterization, taken after training to convergence; as α→∞ it approaches the ℓ₂ (kernel) solution.
    - The PyTorch extension exercise uses discrete steps. It illustrates the phenomenon, reports its step size and final residual, and is not described as certified by the gradient-flow theorem.
    - Do not use plain w=u⊙u: it forces w≥0, and from zero initialization its gradients vanish. A failure to reach a signed target there says nothing about which interpolant is chosen.
  - *Step size:* outside 0<η<2/σ₁², convergence from an arbitrary initialization is **not guaranteed**. The failures are specific, not universal divergence:
    - At η=0 the iterate never moves.
    - At η=2/σ₁², a nonzero error in the top channel alternates in sign without decaying.
    - Above 2/σ₁², a nonzero error in any channel with ησᵢ²>2 grows; but an initialization already at a least-squares solution stays there.
    - Demonstrate the endpoint oscillation and one above-boundary divergence on explicit initial errors.
  - *Loss and model:* the result is for squared loss on a linear model.
  - *SGD,* on a consistent system from 0, also stays in row(A) and converges to x† under stated step conditions. This is a Core exercise.
- **Not proved here:** the statistics of the minimum-norm interpolator (benign overfitting, double descent). These go to the research reading and PS06/PS12.

### 11. Would you trust these coefficients?
- **Open on the question, before any checklist.** Present three short fit reports and ask, for each: would you trust the coefficients, the fitted values, or neither? The three are an over-tight cutoff, an unscaled ridge, and coefficients interpreted under collinearity.
- **Only then name what a defensible report states:**
  - rank and tolerance, with the API convention;
  - discarded or damped channels with their |uᵢᵀb|;
  - residual against the noise level;
  - coefficient norm;
  - prediction change versus coefficient change under a stated perturbation, including at one off-pattern input;
  - whether features were standardized.

### 12. Three runnable coding labs (browser, stdlib-only, given small factors)
**Input convention (applies to all three):** a compact SVD given as `(m, n, U, s, Vt)`.
- U is m×r and Vt is r×n, with s sorted and strictly positive; the explicit (m, n) makes the r=0 case recoverable.
- Validation raises ValueError for shape mismatches, unsorted or nonpositive s, or tol<0. Inputs are never mutated.
- **Lab A `pinv_via_svd(m, n, U, s, Vt, tol)`.** Returns **A_τ⁺**, the pseudoinverse of the truncated matrix A_τ that keeps σᵢ>tol.
  - Checks: the four Moore–Penrose identities **against A_τ**, with the truncation error ‖A−A_τ‖ reported separately against A.
  - Exact-rank examples, where tol only removes nothing, are also checked against the original A.
  - Edge cases: rank 0 returns the n×m zero matrix; repeated singular values.
- **Lab B `ridge_solve(m, n, U, s, Vt, b, lam)`.** Applies the filter factors channel by channel, with lam≥0 (lam<0 raises ValueError). Because the factors are compact, lam=0 gives A⁺b.
  - Checks: an independent normal-equations oracle on a well-conditioned case; ‖x_λ‖ nonincreasing; the λ→0⁺ limit on the duplicate-column case; the f₂ value from §7.2.
- **Lab C `min_norm_solution(m, n, U, s, Vt, b, tol)`.** Returns `(x, rank_used, residual_norm)` without forming the matrix, at cost O((m+n)k) for one vector.
  - Checks: x∈span of the retained vᵢ; the residual is orthogonal to the **retained left singular subspace**; agreement with Lab A applied to b; a borderline σ=tol case with its inclusion convention documented.
  - The residual is orthogonal to the original range(A) **only** when every nonzero channel is kept. The counterexample to include: A=diag(1,0.001), b=(0,1), tol=0.01 returns x=0 with residual (0,1), which is not orthogonal to range(A)=ℝ².
- **References and checks:** all three in `labs/reference.py` and `labs/checks.py`, covering invalid inputs, degeneracies, input preservation, and tolerance behavior.

### 13–18. Exercises, derivations, checkpoint
Rule G minimums. Every item is distinct from section practice and from each other, and each is marked **required** or **extension**.
- **A · by hand (≥10).**
  - Required routine (≥6): A⁺ of a rank-1 outer product; x† for a 2×3 full-row-rank system by the perpendicularity route; x† for a new inconsistent rank-deficient system; ridge filter factors and x_λ on new numbers; one bracket plus two bisection steps; two GD steps from zero.
  - Required transfer (≥3): (AB)⁺≠B⁺A⁺; AA⁺ is the unique orthogonal projector onto range(A); monotonicity of ‖x_λ‖; the SPD-preconditioned version of Theorem 4.
  - Required diagnosis (≥1): an "unstable model" report that is really an off-pattern query.
  - Extension: generalized Tikhonov; the oscillatory GD step range.
- **B · NumPy (3–4).**
  - `pinv` versus `matrix_rank` versus `lstsq` tolerance conventions, with the version recorded.
  - A Picard plot on a Hilbert or blur matrix.
  - L-curve versus discrepancy principle under known δ, reporting whichever fails.
  - Normal equations versus stacked QR for ridge at κ≈10⁸.
- **C · PyTorch (2–3).**
  - Autograd GD from 0 versus a random initialization on an overparameterized linear model, checked against `torch.linalg.pinv`.
  - SGD weight decay versus closed-form ridge, and where they differ (decoupled AdamW versus L2 under Adam; OPT07).
  - Extension: the signed u⊙u−v⊙v parameterization at two values of α.
- **Derivations to own:** Theorems 1–4; Moore–Penrose uniqueness; ridge SVD form; the RHS bound; the discrepancy existence condition.
- **M · cumulative (2–3):** one regularized-fit problem that needs LA03 projection, LA08 Eckart–Young and LA09 conditioning together.
- **K · checkpoint (six parts):**
  - explain;
  - derive with assumptions;
  - calculate a small case;
  - debug a `ridge_solve` that applies λ to σ instead of σ² (the plan's own earlier slip, which is a realistic error);
  - critique "GD found a minimum-norm solution, so the model generalizes";
  - defend generalized Tikhonov with a difference operator.
- **Format:** every written item has a full model solution plus `Rubric:` criteria. Hints are field-specific. Typed fields avoid e-notation (write `10^-4`).

### Research connection and reading
- Hansen, *Rank-Deficient and Discrete Ill-Posed Problems*, ch.4–7, including the L-curve's limitations.
- Hastie, Montanari, Rosset & Tibshirani (2022) on ridgeless interpolation.
- Bartlett, Long, Lugosi & Tsigler (2020) on benign overfitting.
- Gunasekar et al. (2018) on implicit bias in other geometries.
- Woodworth et al. (2020) on kernel and rich regimes in diagonal networks.

## Benchmark coverage (rule F)

| Canonical result | Where |
|---|---|
| Moore–Penrose conditions and uniqueness | §4 |
| Minimum-norm (least-squares) solution | §1–2 |
| Truncated SVD and Picard condition | §6 |
| Tikhonov filter factors | §7 |
| Discrepancy principle, with existence condition; L-curve | §9 |
| Implicit bias of zero-initialized GD, with conditions | §10 |
| Least-squares sensitivity κ/cosθ and κ+κ² tanθ | §5.2, §5.3 (owed by LA09) |
| Rectangular κ=‖A‖‖A⁺‖ | §5.2 (owed by LA09) |
| df(λ), standardization, intercept, constrained form | §7.4 |

**Deferred, with a named home:** QR with column pivoting and the complete orthogonal decomposition → LA11. CG/LSQR as iterative regularization → LA12. Randomized solvers → LA13/LA20. Lasso and sparsity → OPT07/LA25. Ridge risk and bias–variance → PS06/PS11. Validation design → PS10. Bayesian ridge → PS09.
**Intentionally omitted:** Drazin and group inverses, GSVD, and infinite-dimensional ill-posed operators.

## Figure list (`scripts/figures/la10.mjs`)

Every figure is computed from the matrices in the text, rendered with `preview.mjs`, and checked label by label.

| ID | Section | Content |
|---|---|---|
| F1 | §1 | Solution line, row-space line, minimum-norm point, free-variable-zero point |
| F2 | §3–4 | Four-subspace map for A and A⁺ |
| F3 | §2 | Observation-space projection beside the parameter-space minimizer line |
| F4 | §5 | ‖A_ε⁺‖ against ε with the jump at 0 |
| F5 | §6 | Picard plot (n=32 problem) |
| F6 | §7/§10 | Filter factors: TSVD step, ridge, GD with η≤1/σ₁² at several t |
| F7 | §9 | Ridge coefficient paths |
| F8 | §9 | L-curve with the corner, discrepancy point and hindsight-best point all marked |
| F9 | §10 | GD trajectories from 0 and from x₀ |
| F10 | §11 | Coefficient change versus prediction change (observed and off-pattern inputs), λ=0 against λ>0 |

## Authoring order and gates

1. Choose the rational U and V for the §6 problem, and verify the (AB)⁺ counterexample pair, before writing.
2. Write §1–5 and build F1–F5. Recompute every number with the appendix scripts; there is no NumPy in the default environment, so use exact fractions or stdlib floats.
3. Write §6–11 and build F6–F10 and `la-ridge`. Inspect the L-curve plot before writing the §9 prose about it.
4. Implement and register the three Python tasks with references and checks.
5. Write the answer bank `10-pseudoinverse.js`, the exercises and the checkpoint.
6. Validate: `node scripts/figures/build.mjs`, `node scripts/build-theory.mjs`, `node scripts/check-theory.mjs`, `python3 -m labs.checks --reference`. Check both themes, every preset, and one typed and one written answer.
7. **Prose review, separate from correctness review.** Can a learner explain why each definition appears, follow each arithmetic step, and say what the experiment does and does not establish? Check also for templated rhythm and stock phrases.
8. Run the benchmark audit (Golub & Van Loan §5.5, Hansen, Strang LALFD, ESL §3.4). Repair anything below 4 and record the scores in the track plan.

## Open decisions

- **Second interactive** (`la-implicit`, draggable x₀ for §10): add it only if `la-ridge` lands cleanly.
- **Lab C's scope:** applying A_τ⁺ to one vector with diagnostics, so it does not duplicate Lab A.

## Revision log (response to the review)

| Review item | Repair |
|---|---|
| §1 Reason to turn the page | Transition table; the two driving questions; callbacks at §3 (forecast), §5.1 (resolution), §7.2 (ridge) |
| §2 Templated prose risk | "How the chapter should read": voice rules, varied practice, contract vocabulary kept out, §11 opens on the question |
| §3 Formula before reasoning | §1 by parameterization t and perpendicularity, formula after; §2 duplicate columns first plus a new projection-only case; §3 channel-by-channel before the matrix, factors flagged as constructed |
| §4 Navigable depth | Three-stop route; §5.2 core before §5.3 second reading; §7.1 before §7.4; required and extension exercises marked |
| §5 Experiment precision | w*, noise model and fixed quantities stated; separate fixed-axis panels; normalized ratio; off-pattern input defined with its v₂ component; units preset reworded |
| §6 κ² claim | Withdrawn; first-order δx formula with hypotheses; problem sensitivity separated from the algorithmic hazard of AᵀA |
| §6 NumPy tolerances | Per-API conventions, version recorded, relative vs absolute distinguished |
| §6 Filter f₂ | Corrected to σ₂²/(σ₂²+λ)≈0.00956 at λ=0.01 |
| §6 Ridge κ | (σ₁²+λ)/(μ_min+λ) with μ_min defined |
| §6 Huge-λ bias | Reversed: shrinkage bias grows toward the zero predictor's error |
| §6 Discrepancy existence | Endpoint condition, Aᵀb≠0, bracket before bisect, unattainable-target example |
| §6 GD filter range | Convergence range separated from the monotone-filter range η≤1/σ₁²; t≈1/(ηλ) recast as a scale comparison |
| §6 Preconditioner | SPD P, stable steps, zero init; general init gives the minimum P⁻¹ distance |
| §6 u⊙u | Replaced by the signed u⊙u−v⊙v with nonzero init; failure mode of u⊙u explained |
| §6 Lab A / Lab C | A_τ⁺ checked against A_τ; residual against the retained subspace; diag(1,0.001) counterexample |
| §6 Edge hypotheses | A=0, x≠0, b≠0 and θ stated; compact-SVD input with explicit (m,n) |
| Addendum 1: §8 ratio units | Combined ratio removed; spreads reported separately in labelled units; s=0 handled |
| Addendum 2: §10 parameterization | Gradient-flow, conditional-on-convergence statement; Q_α at fixed α; ℓ₁ as α→0; discrete experiment labelled illustrative |
| Addendum 3: §10 step size | "Convergence not guaranteed", with the η=0, η=2/σ₁² and above-boundary behaviours spelled out |
| Addendum wording | §6 amplified noise −10 vs recovered −9.9; §9 constant-residual case gives no unique λ |
| §7 Uncomputed TSVD example | Computed (§6 table); noise sign changed to avoid a coincidental ridge win; discrepancy worked; separate n=32 problem for Picard and L-curve; the L-curve's actual under-regularization is reported, not a promised corner |

## Appendix: verification scripts

Two scripts in [scripts/verify/la10/](../scripts/verify/la10/) reproduce every *verified* number. They use only the standard library, so run them with the system `python3`.

- [la10_exact.py](../scripts/verify/la10/la10_exact.py): the §1–4 examples, the near-collinear ridge fits, the GD limits, and the duplicate-column λ→0 limit.
- [la10_tsvd2.py](../scripts/verify/la10/la10_tsvd2.py): the §6 table, the §7 ridge errors, the §9 bisection, and the n=32 Picard and L-curve numbers.

Those two scripts print their results. [la10_assert.py](../scripts/verify/la10/la10_assert.py) asserts the values that §1–5, §7.2 and Lab C depend on, and exits non-zero on any mismatch. That includes the items previously checked only by hand: the §2 projection-only case, the §3 channel coordinates, σ₂ and the two filter factors, the §6 −10/−9.9 distinction, and the Lab C counterexample. It also checks that the §5.2 bound holds on the opening perturbation. Extend it as later sections are authored.
