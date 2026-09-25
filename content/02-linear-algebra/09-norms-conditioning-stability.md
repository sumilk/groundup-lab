---
id: math.linear-algebra.norms-conditioning-stability
title: Norms, conditioning, and numerical stability
prerequisites: [math.linear-algebra.svd-pca, foundations.numerical-stability]
estimated_hours: 26
answers: 09-conditioning
---

# Norms, conditioning, and numerical stability

A solver returns a vector and reports a residual of one millionth. Is the answer accurate?

Take A=diag(1,10⁻⁶), b=(1,0), and the returned vector x̂=(1,1). The exact answer is x=(1,0). The residual b−Ax̂=(0,−10⁻⁶) is tiny, yet the relative error in the answer is 1: one hundred percent. The second coordinate barely affects the observations, so a large error there leaves little evidence in the residual.

Now replace A by 10⁶A and b by 10⁶b. The equation and its solution are unchanged, but the residual becomes (0,−1). The same wrong answer suddenly has a much larger diagnostic number. To interpret a residual, we need both a scale and a measure of how strongly the equation hides errors.

This chapter connects three questions: how do we measure size, how sensitive is the mathematical problem, and how accurately did an algorithm solve it?

## 0. Route and prerequisite diagnostic

Four results carry the chapter: induced norms bound matrix amplification; a condition number turns relative input error into a worst-case output-error ceiling; a perturbation bound needs a denominator condition; and backward error measures the data change that would make a computed answer exact.

We use real vectors x∈ℝⁿ and matrices A∈ℝᵐˣⁿ. Statements about Ax=b as a uniquely solvable system assume m=n and A nonsingular. Write x̂ for a computed candidate, E for a matrix perturbation, f for a right-hand-side perturbation, and r=b−Ax̂ for the residual. Norms without a subscript in a theorem are one fixed vector norm and its induced matrix norm. Coordinates are dimensionless or have already been put on declared comparable scales; rescaling physical units is a modeling choice, not just notation.

Before starting, check these four prerequisites. Each repair link leads to authored material.

- For diag(4,1/2), give the largest and smallest unit-vector output lengths: 4 and 1/2. Repair: [SVD and singular channels](08-svd-low-rank.md).
- For A=[[1,2],[0,1]] and x̂=(0,1), compute Ax̂=(2,1). Explain why a residual needs b too. Repair: [linear systems](02-systems-elimination-subspaces.md).
- Explain why an orthogonal change of coordinates preserves Euclidean length. Repair: [orthonormal bases](04-orthonormal-bases-qr.md).
- Explain how 1+2⁻⁵⁴ can round to 1 in binary64 although 2⁻⁵⁴ is representable. Repair: [floating-point reasoning](../00-foundations/01-numerical-stability.md).

Sections 1–8 develop the theory and two experiments. Section 9 supplies three stdlib Python labs. Local array experiments and cumulative assessment follow. The 26-hour estimate includes proofs, implementation, and a numerical audit. General least-squares sensitivity, regularization, and production solver design continue in later modules.

## 1. A norm declares what counts as large

A vector norm is a function satisfying three properties: ‖x‖≥0 with equality exactly at x=0; ‖αx‖=|α|‖x‖; and ‖x+y‖≤‖x‖+‖y‖. These are definiteness, absolute homogeneity, and the triangle inequality. The triangle inequality makes error budgets composable.

For x=(3,−4), three legitimate measurements give different answers:

$$
\|x\|_1=\sum_i|x_i|=7,\qquad
\|x\|_2=\sqrt{\sum_i x_i^2}=5,\qquad
\|x\|_\infty=\max_i|x_i|=4.
$$

The 1-norm counts total absolute error, the 2-norm measures Euclidean length, and the infinity norm limits the largest coordinate error. In two dimensions their unit balls are a diamond, a disk, and a square. Their numerical values differ because they answer different questions.

**Norm comparisons with dimensions exposed.** For x∈ℝⁿ,

$$
\|x\|_\infty\leq\|x\|_2\leq\|x\|_1,
\qquad
\|x\|_1\leq\sqrt n\,\|x\|_2,
\qquad
\|x\|_2\leq\sqrt n\,\|x\|_\infty.
$$

The first inequality follows because the sum of squares includes the largest square. Squaring the sum of absolute values adds nonnegative cross terms, proving the second. Cauchy–Schwarz applied to (|x₁|,…,|xₙ|) and (1,…,1) proves the √n bound for the 1-norm. Bounding every square by ‖x‖∞² proves the last. Equality can depend on the direction: one nonzero coordinate makes all three norms equal, whereas equal-magnitude coordinates attain the √n factors.

Equivalence of norms in finite dimensions does not mean the constants are harmless as dimension grows. A million coordinates each with error 10⁻³ have infinity norm 10⁻³ and Euclidean norm 1.

**Units matter.** If one coordinate measures meters and another seconds, an unweighted Euclidean norm silently compares unlike quantities. With positive reference scales sᵢ, define ‖x‖scaled=‖D⁻¹x‖₂ for D=diag(sᵢ). This is a norm, but its interpretation depends on the chosen scales. It does not prove that either coordinate is scientifically unimportant.

> **Practice — Foundation:** Compute the 1-, 2-, and infinity norms of (−3,4).
>
> **Hint:** Sum absolute values, take the square root of the sum of squares, then take the largest absolute coordinate.
>
> **Practice — Core:** For x=(1,…,1)∈ℝ⁹, compute all three norms and identify which dimension-dependent inequalities are equalities.
>
> **Hint:** There are nine unit absolute values and nine unit squares; compare 9, 3, and 1 with √9=3.
>
> **Practice — Stretch:** Prove that x↦‖D⁻¹x‖₂ is a norm when D is invertible. Which axiom fails if D⁻¹ is replaced by a singular matrix?
>
> **Hint:** Apply the Euclidean norm axioms after the linear map. A singular map kills a nonzero vector, violating definiteness.

## 2. Induced matrix norms measure the largest allowed amplification

A matrix norm induced by the p-norm is

$$
\|A\|_p=\max_{x\ne0}\frac{\|Ax\|_p}{\|x\|_p}
=\max_{\|x\|_p=1}\|Ax\|_p.
$$

The maximum exists because the finite-dimensional unit sphere is compact and the map is continuous. Input and output have different dimensions when A is rectangular, but each uses the same p convention. More general input/output norm pairs are possible; all bounds below must use compatible pairs.

**The three useful formulas.**

$$
\|A\|_1=\max_j\sum_i|a_{ij}|,\qquad
\|A\|_\infty=\max_i\sum_j|a_{ij}|,\qquad
\|A\|_2=\sigma_1(A).
$$

For the 1-norm, the triangle inequality gives ‖Ax‖₁≤∑ⱼ|xⱼ|∑ᵢ|aᵢⱼ|≤(maximum absolute column sum)‖x‖₁. A coordinate vector selecting a maximal column attains the bound. For the infinity norm, every row output is bounded by its absolute row sum times ‖x‖∞. Choose xⱼ to match the signs of a maximal row; zero entries may use either sign. That row attains the bound. For the 2-norm, expand x in the orthonormal right singular basis: ‖Ax‖₂²=∑ᵢσᵢ²(vᵢᵀx)²≤σ₁²‖x‖₂², with equality at v₁ when A≠0.

For A=[[1,−2],[3,0]], the absolute column sums are 4 and 2, and the row sums are 3 and 3. Thus ‖A‖₁=4 and ‖A‖∞=3. Meanwhile AᵀA=[[10,−2],[−2,4]], with eigenvalues 7±√13, so ‖A‖₂=√(7+√13)≈3.257. The largest entry, 3, does not give the 1-norm or the 2-norm.

**Composition control.** By definition ‖Ax‖≤‖A‖‖x‖. Apply this twice to get ‖ABx‖≤‖A‖‖B‖‖x‖, then maximize over unit inputs:

$$
\|AB\|\leq\|A\|\,\|B\|.
$$

This property is submultiplicativity. Equality need not hold: the direction B amplifies most may not be the one A amplifies most.

The Frobenius norm ‖A‖F=(∑ᵢⱼaᵢⱼ²)¹ᐟ²=(∑ᵢσᵢ²)¹ᐟ² remains useful for total matrix energy. It is submultiplicative, but for n>1 it is not an induced norm on square n×n matrices: ‖Iₙ‖F=√n, whereas every induced norm gives ‖Iₙ‖=1. For rank r>0, ‖A‖₂≤‖A‖F≤√r‖A‖₂. Do not substitute one measurement into a theorem without checking its assumptions.

**Predict, then reveal.** In the workbench, choose the 1-, 2-, or infinity unit ball and a matrix. Predict the largest output p-norm before revealing it. Rotate the probe around the input ball, then try the rank-one and zero presets. Both views use the same coordinate scale, so output contraction is visible. The probe gives one direction's gain; the revealed norm is the maximum over all directions. This is a two-dimensional geometry experiment, not a solver benchmark.

```lab
la-norms
```

> **Practice — Foundation:** Find the induced 1- and infinity norms of [[1,−2],[3,0]].
>
> **Hint:** Absolute column sums give the 1-norm; absolute row sums give the infinity norm. Do not sum signed entries.
>
> **Practice — Core:** Exhibit a unit 1-norm vector attaining the 1-norm and a unit infinity-norm vector attaining the infinity norm for the same matrix.
>
> **Hint:** Select the first column for the first task. For the second, align signs with the first row and inspect both output coordinates.
>
> **Practice — Stretch:** For A=diag(10,1) and B=diag(1,10), compare ‖AB‖₂ with ‖A‖₂‖B‖₂. Explain why the upper bound is loose.
>
> **Hint:** Multiply first: AB=10I. The two maps have different most-amplified input directions.

## 3. Conditioning belongs to a problem and its perturbation model

First hold a nonsingular A fixed. If Ax=b and A(x+δx)=b+f, then exactly

$$
\delta x=A^{-1}f.
$$

This is sensitivity of the mathematical answer, before any solver has been chosen. For nonzero b and x,

$$
\frac{\|\delta x\|}{\|x\|}
\leq\|A^{-1}\|\frac{\|b\|}{\|x\|}\frac{\|f\|}{\|b\|}
\leq\underbrace{\|A\|\,\|A^{-1}\|}_{\kappa(A)}
\frac{\|f\|}{\|b\|}.
$$

The relative condition number for this fixed b is ‖A⁻¹‖‖b‖/‖A⁻¹b‖. The matrix condition number κ(A) bounds it uniformly over right-hand sides. This distinction matters: κ is a worst-case ceiling, not a prediction that every perturbation will attain it.

Since 1=‖I‖≤‖A‖‖A⁻¹‖, κ(A)≥1. In the Euclidean norm,

$$
\kappa_2(A)=\frac{\sigma_1}{\sigma_n},
$$

because A⁻¹ has gains 1/σₙ≥⋯≥1/σ₁. A singular square matrix has no inverse; we conventionally report infinite conditioning for the uniquely solvable-system problem. That convention does not create a unique solution. A rectangular matrix requires a separately specified least-squares or minimum-norm problem; a ratio of its listed positive gains alone cannot settle all its sensitivity questions.

**A ceiling you can attain.** For A=diag(1,ε), 0<ε≤1, choose b=e₁, hence x=e₁. A perturbation f=δe₂ yields δx=(δ/ε)e₂. Its relative amplification is 1/ε=κ₂(A). The same-size f=δe₁ yields relative amplification 1. In SVD language, worst-case equality is obtained with b along u₁ and f along uₙ: one gives a small baseline solution per unit b, while the other produces the largest inverse response.

Multiplying A by a nonzero scalar c multiplies every singular value by |c|. Thus κ(cA)=κ(A), although the absolute sensitivity ‖(cA)⁻¹‖ changes. A tiny matrix can be perfectly well conditioned: κ₂(10⁻¹²I)=1. Conversely diag(10⁶,10⁻⁶) has determinant 1 and condition number 10¹². Neither absolute size nor determinant magnitude is a reliable condition diagnostic.

**Products and orthogonal factors.** For nonsingular square A and B, (AB)⁻¹=B⁻¹A⁻¹, so submultiplicativity applied to the product and to its inverse gives κ(AB)≤κ(A)κ(B). An orthogonal Q preserves Euclidean length, so every singular value of Q equals 1 and κ₂(Q)=1. Since ‖QAx‖₂=‖Ax‖₂ for every x, QA has the same gains as A and κ₂(QA)=κ₂(A); applying the same argument to the input side gives κ₂(AQ)=κ₂(A). Orthogonal steps therefore cannot worsen 2-norm conditioning, while a general factor can. This is the structural reason the QR and SVD routes of [LA04](04-orthonormal-bases-qr.md) and [LA08](08-svd-low-rank.md) are preferred to forming AᵀA (Section 7). The product bound is a ceiling too: diag(10,1)·diag(1,10)=10I has κ₂=1 although each factor has κ₂=10.

> **Practice — Foundation:** Find κ₂(diag(4,1/2)) and κ₂(10⁻¹²I₂).
>
> **Hint:** Divide the largest singular value by the smallest. A common nonzero multiplier cancels.
>
> **Practice — Core:** For A=diag(1,10⁻⁴), b=e₁, and f=10⁻⁶e₂, calculate δx and both relative errors. Is the condition bound attained?
>
> **Hint:** The inverse multiplies the second coordinate by 10⁴. The original x and b both have norm 1.
>
> **Practice — Stretch:** Keep that A and b, but rotate f to the first axis. Explain why an excellent observed response does not establish that κ₂(A) is small.
>
> **Hint:** One experiment tests one direction. The inverse's large gain remains available on the other axis.

## 4. Perturbing the matrix introduces a denominator

The right-hand-side argument did not allow A to change. Suppose instead

$$
(A+E)(x+\delta x)=b+f,\qquad Ax=b.
$$

Subtract the original equation and rearrange:

$$
(I+A^{-1}E)\delta x=A^{-1}(f-Ex).
$$

Let q=‖A⁻¹‖‖E‖. If q<1, then ‖A⁻¹E‖≤q<1. The geometric matrix series ∑ₖ₌₀∞(−A⁻¹E)ᵏ converges in norm, and multiplying its partial sums by I+A⁻¹E leaves a remainder tending to zero. Therefore it is the inverse and

$$
\|(I+A^{-1}E)^{-1}\|\leq\sum_{k=0}^{\infty}q^k=\frac1{1-q}.
$$

This also proves A+E is nonsingular under the stated condition. Define εA=‖E‖/‖A‖ and εb=‖f‖/‖b‖ for b≠0. Then q=κ(A)εA and

$$
\boxed{\frac{\|\delta x\|}{\|x\|}
\leq\frac{\kappa(A)}{1-\kappa(A)\varepsilon_A}
(\varepsilon_A+\varepsilon_b),\qquad
\kappa(A)\varepsilon_A<1.}
$$

The numerator follows by bounding ‖f−Ex‖≤‖f‖+‖E‖‖x‖ and ‖b‖≤‖A‖‖x‖. Dropping the denominator is only a first-order approximation when κ εA is small; it is not the finite-perturbation theorem.

**Work the boundary.** Set A=diag(1,0.01), b=e₂, E=diag(0,−0.005), and f=0. Then x=(0,100) and x+δx=(0,200), so relative forward error is 1. Here κ=100, εA=0.005, q=0.5, and the bound is 100·0.005/(1−0.5)=1: equality. If E=diag(0,−0.01), q=1 and A+E is singular; for this b there is no solution. A finite bound cannot be obtained by ignoring the zero denominator.

The condition q<1 is sufficient, not necessary. For A=I and E=2I, q=2 but A+E=3I is nonsingular. Failure of the condition means this theorem makes no guarantee, not that a solve must fail.

**Distance to singularity.** In the 2-norm, the smallest perturbation making nonsingular A singular has norm σₙ. The construction E=−σₙuₙvₙᵀ kills vₙ and has norm σₙ. Conversely, if (A+E)z=0 for a unit z, then ‖E‖₂≥‖Ez‖₂=‖Az‖₂≥σₙ. Hence the relative distance to a singular matrix is σₙ/σ₁=1/κ₂(A). This is a geometric interpretation of the denominator boundary for unstructured perturbations; restrictions on E can change the nearest admissible failure.

> **Practice — Foundation:** If κ=100, εA=0.001, and εb=0.002, evaluate the finite-perturbation bound.
>
> **Hint:** Check 100·0.001<1 first, then divide 100·(0.001+0.002) by 1−0.1.
>
> **Practice — Core:** Reproduce the diagonal boundary example and explain the change when the second perturbed diagonal entry becomes zero.
>
> **Hint:** Solve each diagonal coordinate directly. At the boundary the second equation becomes 0·x₂=1.
>
> **Practice — Stretch:** Prove the distance-to-singularity result, including both the rank-one construction and the lower bound for every singularizing perturbation.
>
> **Hint:** Use the smallest paired singular directions for existence, then a unit vector in the perturbed matrix's null space for necessity.

## 5. Forward error, residual, and backward error answer different questions

**Forward error** measures the difference from the intended solution, ‖x̂−x‖/‖x‖. It usually needs an oracle x that a real application does not have. A **residual** r=b−Ax̂ is computable, subject to its own rounding error. A **backward error** asks how much the data must change so that x̂ is an exact solution.

Because A(x̂−x)=−r, the right-hand-side result immediately gives

$$
\frac{\|\hat x-x\|}{\|x\|}\leq\kappa(A)\frac{\|r\|}{\|b\|},\qquad b\ne0.
$$

For right-hand-side-only perturbations, x̂ solves Ax̂=b−r exactly. Thus ‖r‖/‖b‖ is precisely the minimum relative change to b under that perturbation model. There is only one possible right-hand-side change: −r.

**Allow both A and b to move.** In the 2-norm, define the normwise backward error as the smallest η≥0 for which

$$
(A+E)\hat x=b+f,\qquad
\|E\|_2\leq\eta\|A\|_2,\quad
\|f\|_2\leq\eta\|b\|_2.
$$

For d=‖A‖₂‖x̂‖₂+‖b‖₂>0, its exact value is

$$
\eta_2=\frac{\|r\|_2}{\|A\|_2\|\hat x\|_2+\|b\|_2}.
$$

*Lower bound.* The perturbed equation requires r=Ex̂−f. Consequently ‖r‖₂≤η(‖A‖₂‖x̂‖₂+‖b‖₂)=ηd.

*Attainment.* When x̂≠0, set t=‖A‖₂‖x̂‖₂/d, E=t r x̂ᵀ/‖x̂‖₂², and f=−(1−t)r. Then Ex̂−f=r, ‖E‖₂=t‖r‖₂/‖x̂‖₂=η₂‖A‖₂, and ‖f‖₂=(1−t)‖r‖₂=η₂‖b‖₂. The rank-one norm identity follows from Cauchy–Schwarz, with equality along x̂. If x̂=0 and b≠0, take E=0 and f=−b: η₂=1. If both are zero, the candidate already solves the homogeneous equation and the backward error is 0 by convention, while relative forward error is undefined.

This η₂ permits unstructured matrix changes. It need not equal the smallest perturbation preserving symmetry, sparsity, or a physical parameterization. A componentwise audit instead asks that |Eᵢⱼ|≤η|Aᵢⱼ| and |fᵢ|≤η|bᵢ|. Its tolerance respects individual scales and zeros; a small normwise number can hide a large relative change in a small component. Do not label a normwise check as componentwise evidence.

**Return to the opening example.** For A=diag(1,10⁻⁶), b=e₁, and x̂=(1,1), relative residual is 10⁻⁶, relative forward error is 1, and η₂=10⁻⁶/(√2+1)≈4.14×10⁻⁷. Both backward diagnostics are small. The factor κ₂=10⁶ explains why that does not force a small forward error.

If η₂ is small and κ₂η₂<1, applying the previous theorem to an attaining pair E,f gives the sufficient bound 2κη₂/(1−κη₂). The familiar shorthand “forward error ≈ condition number × backward error” summarizes a scale relationship; the perturbation model, constants, and denominator still matter.

> **Practice — Foundation:** For A=I₂, b=(1,0), and x̂=(1,0.01), give r and relative forward error.
>
> **Hint:** With the identity, output error and solution error have the same length; r has the opposite sign.
>
> **Practice — Core:** Compute relative residual, κ₂, and η₂ for the opening diagonal example. Explain how an inaccurate answer can have a small backward error.
>
> **Hint:** The denominator for η₂ is √2+1. The inverse amplifies the residual's second coordinate by one million.
>
> **Practice — Stretch:** Construct the rank-one E and vector f attaining η₂. Check the sign in r=Ex̂−f rather than relying on memory.
>
> **Hint:** Split r between the matrix and right-hand-side contributions using t=‖A‖₂‖x̂‖₂/d; their subtraction must reconstruct r.

## 6. An error experiment with an exact oracle

The workbench uses A=c·diag(1,ε), b=c·e₁, and x=e₁. The positive multiplier c changes the raw units without changing κ₂=1/ε. Choose a relative right-hand-side perturbation δ≥0 and direction θ:

$$
f=c\delta(\cos\theta,\sin\theta),\qquad
\hat x=x+A^{-1}f
=\left(1+\delta\cos\theta,\frac{\delta\sin\theta}{\varepsilon}\right).
$$

This x̂ is the exact solution to the deliberately perturbed equation. Against the original equation, r=−f. Therefore, up to display rounding,

$$
\text{relative residual}=\delta,\qquad
\text{relative forward error}
=\delta\sqrt{\cos^2\theta+\frac{\sin^2\theta}{\varepsilon^2}},
\qquad
\eta_2=\frac{\delta}{\|\hat x\|_2+1}.
$$

**Before reveal:** set ε=10⁻⁶ and δ=10⁻⁶. Predict the answer error at θ=0° and at θ=90°. Then reveal. The dangerous direction gives error 1; the benign direction gives 10⁻⁶. The condition number has not changed.

Next multiply c by 10⁶. Predict which of the displayed residual, normalized residual, condition number, and forward error change. Only the absolute residual changes. Finally, choose the singular preset. At ε=0 the equation has no unique solution: for a nonzero second component of f it is inconsistent, while a zero second component leaves infinitely many solutions. The UI refuses to manufacture a single forward-error answer.

```lab
la-condition
```

The left plot shows solution coordinates. The right plot shows log₁₀ relative error against perturbation angle and the worst-case ceiling; every +1 on its vertical axis means a factor of ten. Numerical readouts remain available without interpreting the plots. Changing any input hides the outcome again so that the new prediction comes first.

This experiment isolates conditioning through an analytic diagonal solve. It does not measure the backward stability of LU, QR, or a hardware implementation, and it does not simulate rounding by the ε slider. A real solver comparison must separately measure its residual against the stored input data.

> **Practice — Foundation:** In the dangerous preset, name the direction of f and the resulting direction of x̂−x.
>
> **Hint:** The weak channel is the second coordinate on both sides of this diagonal map.
>
> **Practice — Core:** Keep ε and δ fixed while changing c from 1 to 10⁶. Derive why relative residual and η₂ remain unchanged.
>
> **Hint:** Both the residual and the data-scale denominator gain the same positive factor; x̂ stays fixed.
>
> **Practice — Stretch:** A colleague reports only the θ=0° outcome and calls the matrix well conditioned. Design a controlled counterexperiment and distinguish it from evidence of a bad solver.
>
> **Hint:** Change only the perturbation direction. The workbench solves each perturbed problem analytically, so the difference is mathematical sensitivity.

## 7. Stability belongs to an algorithm in finite precision

A backward-stable algorithm returns the exact answer for nearby input data, with relative perturbations bounded on the scale of unit roundoff u times problem-size and algorithm-dependent factors. This statement must identify the norm, problem class, and any assumptions. It is stronger than observing a small residual on one example and weaker than promising a small forward error for every input.

For correctly rounded basic operations on normal results, the usual model is fl(a op b)=(a op b)(1+δ), |δ|≤u. It requires qualifications near underflow and excludes overflow. Under round-to-nearest, binary64 has u=2⁻⁵³; the spacing from 1 to its next larger neighbor is 2⁻⁵². Those are related but different conventions for “machine epsilon.” Review the [foundations lesson](../00-foundations/01-numerical-stability.md) before using this model in a proof.

**A well-conditioned problem with a poor formula.** For t>0, consider

$$
g(t)=\sqrt{1+t}-1
=\frac{t}{\sqrt{1+t}+1}.
$$

At t=2⁻⁵⁴, binary64 rounds 1+t to 1, so the first formula returns zero. The second returns approximately t/2=2⁻⁵⁵. It uses the original t in a numerator instead of subtracting nearly equal rounded numbers.

This is not inherently an ill-conditioned function of t. With s=√(1+t), differentiation gives g′(t)=1/(2s), so its relative condition number is

$$
\left|\frac{t g'(t)}{g(t)}\right|
=\frac{s+1}{2s}\longrightarrow1\quad(t\downarrow0).
$$

The elementary derivative is only needed for this scalar diagnostic; the algebraic identity and numerical comparison stand on their own. The loss comes from the evaluation path. Exact subtraction of two nearby stored values can itself be harmless; the damaging cancellation reveals errors introduced earlier in those values. Also, if only the already-rounded number 1+t is supplied, the rationalized expression cannot recover an unavailable t.

**Where the error enters.** For a differentiable problem x↦F(x) with x≠0 and F(x)≠0, the relative condition number κ_F(x)=‖J_F(x)‖‖x‖/‖F(x)‖ is the first-order ratio of relative output change to relative input change. For the linear solve b↦A⁻¹b it recovers the fixed-b number of Section 3, and for scalar g it is the ratio above. Apply the same idea to one step of an algorithm, the subtraction (a,c)↦a−c. If each input has a relative error of at most ρ, which is the natural model for rounding errors, the output can change by (|a|+|c|)ρ, a relative change of (|a|+|c|)/|a−c| times ρ. The direct formula feeds the rounded ŝ≈√(1+t) into ŝ−1, where that factor is about 4/t for small t. A relative error of order u in ŝ therefore becomes a relative output error of order u/t, even though g itself has condition number near 1. An algorithm is unstable when one of its intermediate problems is much worse conditioned than the problem it is solving.

**Normal equations change the numerical challenge.** For full-column-rank A, the Gram matrix has positive eigenvalues σᵢ², hence κ₂(AᵀA)=κ₂(A)². For A=[[1,1],[0,10⁻⁸]], forming the Gram matrix can round 1+10⁻¹⁶ to 1 and lose the small direction. A stable solve of that rounded Gram system does not recover information discarded in forming it. QR and SVD work with A more directly; their algorithmic details belong to LA11. The squared condition number is a fact about the Gram matrix, not a complete sensitivity theorem for every least-squares problem.

**Condition estimates need the weak direction too.** A largest-singular-value estimate only measures ‖A‖₂. It cannot distinguish I from diag(1,10⁻¹²), since both have largest gain 1. Estimating κ requires inverse amplification or the smallest singular scale as well. For small matrices, SVD or solves against basis vectors provide reference measurements. Production condition estimators reuse factors and selected solves; they need not form an inverse explicitly.

**An unstable solver on a well-conditioned system.** Take A=[[ε,1],[1,1]] and b=(1,2) with ε=10⁻²⁰. The exact solution (1/(1−ε),(1−2ε)/(1−ε)) rounds to (1,1). The problem is benign: κ₂(A)≈2.618 and κ∞(A)=4/(1−ε). Elimination without row exchanges uses the pivot ε. The multiplier is 10²⁰, the updated pivot 1−10²⁰ rounds to −10²⁰, and the updated right-hand side 2−10²⁰ also rounds to −10²⁰. Back substitution gives x̂₂=1 and then x̂₁=(1−1)/ε=0. The returned x̂=(0,1) has relative forward error 1/√2, relative residual 1/√5≈0.45, and η₂≈0.26, so it is not the exact solution of any nearby problem. The computed factors show where the information went: their product is [[ε,1],[1,0]], so elimination discarded the entry a₂₂=1 entirely. Partial pivoting swaps the rows, uses the multiplier ε, and returns (1,1). The problem did not change; only the evaluation path did. [LA02](02-systems-elimination-subspaces.md) tracks the same failure through pivot growth.

**Four cases, two questions.** Conditioning and stability are independent, and an audit must place a failure in the right cell.

| | Backward-stable algorithm | Unstable algorithm |
|---|---|---|
| Well-conditioned problem | Accurate answer. | Can fail: the unpivoted solve above, the direct √(1+t)−1. |
| Ill-conditioned problem | Small backward error, possibly a large forward error: the opening example. | Neither guarantee holds. |

**Counting lost digits.** A backward-stable solver guarantees η of order u, up to modest problem-size factors. When κu≪1, the qualified bound of Section 5 then makes the relative forward error of order κu. As a rule of thumb, expect to lose about log₁₀κ of the roughly log₁₀(1/u) decimal digits a format carries: about 16 in binary64 (u=2⁻⁵³), 7 in binary32 (u=2⁻²⁴), and between 2 and 3 in bfloat16 (u=2⁻⁸). A system with κ=10⁸ keeps about eight binary64 digits and has no guaranteed binary32 digit, because κu>1. This is an order-of-magnitude reading of a worst-case ceiling, not a prediction. The size factors can be large, and a particular right-hand side may be far from the worst direction. The [foundations lesson](../00-foundations/01-numerical-stability.md) discusses where reduced precision appears in training.

> **Practice — Foundation:** Evaluate both formulas for g at t=2⁻⁵⁴ in binary64 and explain why they differ.
>
> **Hint:** Check the rounded value of 1+t first. The rationalized numerator retains t even when that sum rounds to 1.
>
> **Practice — Core:** If A has singular values 2 and 10⁻⁴, give κ₂(A), the Gram eigenvalues, and κ₂(AᵀA).
>
> **Hint:** Square the singular values to get the Gram spectrum, then compare the two ratios.
>
> **Practice — Stretch:** Explain why a largest-eigenvalue iteration on AᵀA cannot by itself estimate κ₂(A), even if the iteration is exact.
>
> **Hint:** Compare diag(1,1) with diag(1,10⁻¹²). The top Gram eigenvalue agrees while inverse sensitivity does not.

## 8. A defensible numerical audit

Suppose a model fit changes dramatically after a small data edit. Before blaming floating point, separate the stored problem, its data uncertainty, and the algorithm's error.

1. State the equation, shapes, dtype, coordinate units, and perturbation model. Is the uncertainty absolute, relative, normwise, or componentwise?
2. Report the data scales and a condition measurement with its norm. On a small control, compute both extreme singular values; for a larger problem, name the estimator and its limitations.
3. Compute the residual against the original stored A and b, preferably with more accurate accumulation when cancellation makes the residual uncertain. Report a normalized residual and the corresponding backward error.
4. Measure forward error against an exact synthetic solution or a higher-precision oracle. A different algorithm in the same dtype is useful corroboration but is not automatically an exact oracle.
5. Sweep perturbation directions and magnitudes. Separate mathematical input changes from dtype changes. Check the theorem's denominator before using its bound.

For a concrete local control, take A=diag(1,ε), choose x=(1,1), and construct b analytically as (1,ε). Compare a solve with the deliberately wrong candidate (1,0) as ε decreases. The latter has relative forward error 1/√2 but relative residual ε/√(1+ε²). If b is instead formed by a general rounded product A@x, the intended x may no longer exactly solve the stored system; disclose that oracle limitation.

**Scaling is part of the question.** A row-scaled equation DAx=Db has the same exact solutions for invertible D, but its normwise residual and condition number generally differ. A column scaling A D z=b changes coordinates to x=Dz; accuracy in z must be translated back to the requested coordinates. Equilibration can improve a numerical representation without erasing uncertainty in the original physical measurements. In the diagonal control, row scaling by diag(1,1/ε) makes the matrix I but also amplifies uncertainty in the second measurement by 1/ε.

**Match the remedy to the diagnosis.** Once the audit has located the failure, the responses differ. A large backward error implicates the algorithm: pivot, use an orthogonal factorization, or replace a cancelling formula. A small backward error with a large κ implicates the problem, and no solver can recover what the data do not determine. The options are then to reformulate the question (ask for a better-determined output, or collect data that excite the weak direction), to change the model with an explicitly stated bias such as the regularization of LA10, or to reduce the error in the stored data. Higher precision helps when rounding in the stored problem or the algorithm dominates the error budget. It cannot shrink measurement uncertainty that was already present. Report any equilibration together with the transformed perturbation model.

**RE evidence gate.** Deliver a reproducible table over ε, dtype, scale, and perturbation direction. Include κ, normalized residual, backward error, forward error where the oracle is known, and the bound's validity condition. Diagnose at least one small-residual/large-forward-error case, one cancellation failure, and one large-backward-error solve of a well-conditioned system.

**RS evidence gate.** Prove the finite-perturbation bound with its assumptions. Exhibit a direction attaining the right-hand-side bound and one where it is loose. Explain why neither a determinant nor one benign experiment certifies robustness.

> **Practice — Foundation:** Which diagnostic normally needs an oracle: residual, backward error, or forward error?
>
> **Hint:** Only one of these directly compares the returned answer with the unknown exact solution.
>
> **Practice — Core:** For A=diag(1,ε), x=(1,1), b=(1,ε), and x̂=(1,0), derive relative residual and relative forward error.
>
> **Hint:** The missing solution coordinate has magnitude 1, while the missing output coordinate has magnitude ε; normalize by the correct baseline norm.
>
> **Practice — Stretch:** Row scaling turns the diagonal control into I. Explain why this does not make uncertainty of size δ in the original second measurement disappear.
>
> **Hint:** Apply the same row scaling to the perturbation vector. Its second entry becomes δ/ε.

## 9. Three runnable coding labs

All three tasks use stdlib Python, preserve inputs, and reject booleans, malformed inputs, and non-finite values with ValueError. Checks use relative tolerances, including tiny nonzero outputs; no fixed absolute tolerance may silently accept zero instead of a meaningful small result. NumPy and PyTorch extensions below run locally.

### Lab A — compute induced row and column controls

Open [matrix norms](../../labs/exercises.py). Implement `matrix_norm_1_inf(matrix)`, returning `(one_norm, infinity_norm)` for a nonempty rectangular list or tuple of rows. `_validated_matrix` is supplied. Use absolute column sums and row sums with `math.fsum`; do not square entries. Zero matrices return (0,0). Reject a result outside finite floating-point range with ValueError, including overflow raised during summation. The fixtures include rectangular shapes, signed entries, and scales near 10⁻²⁰⁰ and 10²⁰⁰.

### Lab B — estimate inverse amplification by solves

Open [condition estimate](../../labs/exercises.py). Implement `condition_estimate(matrix)`, returning an estimate of κ∞ for a finite nonempty square matrix. This is a small dense oracle costing O(n³), not a production large-matrix estimator.

The supplied `_conditioning_factor(matrix)` validates input, divides A by its largest absolute entry to form B, and performs partial-pivot LU. It returns `(lu, permutation, norm_inf_B)` or None when the zero matrix or an exactly zero computed pivot prevents a solve. `_conditioning_solve(lu, permutation, rhs)` solves Bz=rhs without modifying the factors. These helpers have no absolute rank cutoff and reject non-finite arithmetic; a zero computed pivot is not a theorem about exact rank of the intended data.

Return `math.inf` when factorization returns None. Otherwise solve Bzⱼ=eⱼ for every coordinate vector. Accumulate |zⱼ[i]| across j for each row i; the largest sum estimates ‖B⁻¹‖∞. Multiply it by ‖B‖∞. This estimates both forward and inverse amplification without using a top-eigenvalue estimate as a substitute. The solves determine columns of an inverse, but the implementation need only keep their row sums. Reject overflowing solves, row sums, or final products with ValueError rather than returning a misleading finite estimate. Infinity is reserved for the computed-singular branch. Even a finite result is an estimate affected by the supplied floating-point factorization.

### Lab C — isolate cancellation from conditioning

Open [cancellation experiment](../../labs/exercises.py). Implement `cancellation_demo(t)`, returning `(direct, rationalized)` for the two evaluations of √(1+t)−1. Accept finite real t≥0, excluding bools; return (0,0) at t=0. Use `math.sqrt`. This task intentionally retains the poor formula for comparison. For tiny positive t the rationalized result may still underflow if the exact answer lies below the representable range; it cannot promise arbitrary precision. Invalid inputs raise ValueError.

Run `python3 -m labs.checks matrix-norms`, `python3 -m labs.checks condition-estimate`, and `python3 -m labs.checks cancellation-demo`. Add `--reference` after an attempt to exercise the supplied solutions.

## 10. Exercises · by hand

**A1 · Foundation · paper — choose the measurement.** Give the 1-, 2-, and infinity norms of x=(2,−1,2), in that order. State what each measures, and check both √n comparison inequalities for n=3. Is either an equality?

**A2 · Core · paper — two induced norms of a rectangular map.** For A=[[2,−1,0],[−1,3,1]], compute ‖A‖₁ and ‖A‖∞ and give a unit vector attaining each bound in its respective norm. Which induced norms of Aᵀ do these values give?

**A3 · Core · paper — composition can lose the maximizing direction.** For A=diag(10,1) and B=diag(1,10), compute ‖AB‖₂ and ‖A‖₂‖B‖₂. Prove the general submultiplicative inequality.

**A4 · Core · paper — attain the sensitivity ceiling.** For A=diag(2,10⁻³), b=2e₁, and f=10⁻⁶e₂, find x, δx, κ₂, relative data error, and relative solution error. Repeat the last error for f=10⁻⁶e₁, and give both amplification ratios.

**A5 · Core · paper — retain the denominator.** Evaluate the perturbation bound when κ=50, εA=0.004, and εb=0.001. State the hypothesis that permits it. Then give diagonal A and E, different from the lesson's A=I and E=2I, for which that hypothesis fails although A+E is nonsingular.

**A6 · Stretch · paper — distance to failure.** Prove that the relative 2-norm distance from a nonsingular A to a singular matrix is 1/κ₂(A), with arbitrary real matrix perturbations permitted.

**A7 · Core · paper — a backward certificate.** For A=diag(2,10⁻³), b=(2,0), and x̂=(1,1), compute relative residual, relative forward error, κ₂, and η₂. Construct E,f attaining η₂ and verify the perturbed equation. Does the residual-based forward-error ceiling hold with equality?

**A8 · Stretch · paper — a good problem and a poor formula.** For g(t)=√(1+t)−1 and t>0, derive its relative scalar condition number and its limit as t tends to zero. Explain the binary64 direct-formula failure at t=2⁻⁵⁴.

**A9 · Core · paper — an unstable path to a good problem.** For A=[[ε,1],[1,1]], b=(1,2), and ε=10⁻²⁰, eliminate without row exchanges in binary64, rounding each operation. Report x̂ and the product of the computed factors. Repeat with partial pivoting, and use κ∞(A) to explain why the failure belongs to the algorithm rather than the problem.

**A10 · Stretch · paper — orthogonal factors do not hurt.** Prove κ(AB)≤κ(A)κ(B) for nonsingular square A and B in any induced norm, and prove κ₂(QA)=κ₂(AQ)=κ₂(A) for orthogonal Q. For square nonsingular A=QR, show that κ₂(AᵀA)=κ₂(A)² while the triangular system Rx=Qᵀb has κ₂(R)=κ₂(A).

## 11. Exercises · NumPy

Use a local NumPy installation and float64 unless the experiment explicitly changes dtype. Record the installed version. `np.linalg.cond(A, p=2)` and `np.linalg.cond(A, p=np.inf)` measure different norms. Use `np.linalg.solve`, not an explicit inverse, for the system solutions. Define each reported residual against the stored inputs.

**B1 · Foundation · NumPy — norms with independent fixtures.** Compare the stdlib norm task with `np.linalg.norm` at orders 1 and infinity on [[1,−2,0],[3,0,4]] and on 10⁻²⁰⁰ and 10²⁰⁰ multiples. State the two unscaled expected norms and check that the inputs are unchanged.

**B2 · Core · NumPy — sweep the weak direction.** For ε in {10⁻²,10⁻⁶,10⁻¹⁰}, use A=diag(1,ε), b=e₁, and δ=10⁻⁶. Solve with f=δe₁ and f=δe₂. Report relative residual, relative forward error, and κ₂δ; compare with the analytic predictions and explain the direction effect.

**B3 · Core · NumPy — the Gram matrix forgets.** For A=[[1,1],[0,ε]], sweep ε in {10⁻⁴,10⁻⁸,10⁻¹⁰}. Compare direct singular values with `eigvalsh(A.T @ A)`. Report raw computed Gram eigenvalues, including zeros or negatives, before any clipping. Explain why clipping cannot recover lost data.

**B4 · Stretch · NumPy — audit the estimator.** Compare the stdlib κ∞ estimate with `np.linalg.cond(A, np.inf)` on a pivoting matrix [[0,2],[1,3]], diag(1,10⁻¹²), and nonzero scalar multiples. Then test a nearly dependent matrix and distinguish disagreement between estimates from proof of exact singularity. Record solve residuals for the inverse-column probes.

## 12. Exercises · PyTorch

These are local CPU experiments with a separate PyTorch installation. Record version and dtype. Backend and rounding details can affect exact observed thresholds; report those observations rather than promoting them to universal constants.

**C1 · Core · PyTorch — precision changes the evaluation path.** Evaluate both cancellation formulas with tensor t=2⁻³⁰ in float32 and float64. Predict the direct float32 result and compare relative error against a float64 rationalized reference. Explain the limits of treating that reference as exact.

**C2 · Stretch · PyTorch — a stable solve can face uncertain data.** In float64 solve A=diag(1,10⁻⁶) with b=e₁ and then b+10⁻⁶e₂ using `torch.linalg.solve`. Compute each solve's residual against its own supplied right-hand side, and compute the change between solutions. Explain why small solve residuals and a large change are compatible.

## 13. Derivations to own

1. Derive induced 1- and infinity norm formulas, including a vector attaining each bound; derive the spectral norm from the SVD.
2. Prove submultiplicativity and explain a case with strict inequality.
3. Derive fixed-b relative sensitivity, its uniform κ bound, and directions attaining the 2-norm ceiling.
4. Prove the finite A,b perturbation bound using the convergent inverse series; state what fails at the boundary.
5. Prove the distance-to-singularity identity for unstructured 2-norm perturbations.
6. Derive the 2-norm backward-error formula by a lower bound and an explicit attaining perturbation. Distinguish it from right-hand-side-only backward error.
7. Prove κ(AB)≤κ(A)κ(B) and the orthogonal invariance of κ₂; use them to explain why normal equations square the condition number while QR does not.
8. Work the unpivoted 2×2 elimination failure and explain, using backward error and κ, why it is an algorithmic failure on a well-conditioned problem.

## 14. Exercises · cumulative

**M1 · Core · mixed — volume is not robustness.** Compare det(A), κ₂(A), and κ₂(10⁻¹²I₂) for A=diag(10⁶,10⁻⁶). Explain why determinant magnitude cannot rank these problems by relative solve sensitivity.

**M2 · Core · mixed — normalize the residual.** For A=diag(1,10⁻⁶), b=e₁, and x̂=(1,1), multiply both A and b by 10⁶. Give the new absolute residual norm, relative residual, and η₂. Which diagnostics remain unchanged?

**M3 · Stretch · mixed — rescaling the uncertainty.** For A=diag(1,ε), 0<ε≤1, row scale with D=diag(1,1/ε). Show DA=I. If the original measurement perturbation is f=(0,δ), find Df and the resulting solution change. Explain why κ₂(DA)=1 does not erase the original uncertainty.

**M4 · Stretch · mixed — componentwise evidence differs.** Let A=diag(1,10⁻⁸), b=(1,10⁻⁸), and x̂=(1,0). Compute the relative infinity-norm residual. If only b may change and every component must satisfy |fᵢ|≤η|bᵢ|, find the smallest η. Explain the diagnostic disagreement.

**M5 · Core · mixed — a precision budget.** A backward-stable solver is applied to a system with κ₂=10⁵. Using a forward error of order κu, estimate the trustworthy decimal digits in binary64 (u=2⁻⁵³), binary32 (u=2⁻²⁴), and bfloat16 (u=2⁻⁸). Which format gives no guarantee at all? State two reasons the estimate can be pessimistic or optimistic for a particular solve.

## 15. Exercises · checkpoint

**K1 · Foundation · gate — name the three questions.** Define conditioning, forward error, and backward stability. For a solve, state which concerns the mathematical problem, which concerns an answer, and which concerns an algorithm under a specified arithmetic model.

**K2 · Stretch · gate — prove the qualified bound.** Starting from (A+E)(x+δx)=b+f, derive the finite relative perturbation bound. State nonzero/invertibility assumptions and explain the role of κ εA<1.

**K3 · Core · gate — diagnose a small residual.** For A=diag(1,10⁻⁸), b=e₁, and x̂=(1,1), give κ₂, relative residual, relative forward error, and η₂. Does the residual-bound ceiling match the actual forward error?

**K4 · Core · gate — debug a condition report.** A program returns the largest singular value as its “condition number,” and declares matrices with determinant magnitude below 10⁻¹² singular. Give a counterexample to each rule and describe a scale-aware replacement with explicit numerical limitations.

**K5 · Stretch · gate — critique an experiment.** An audit perturbs only the strongest output direction, observes a small solution change, and claims the solver is backward stable and the problem robust. Identify what was actually measured and design separate tests for sensitivity and algorithmic error.

**K6 · Stretch · gate — an unfamiliar error metric.** A diagonal solve uses positive coordinate scales D=diag(dᵢ) for inputs and C=diag(cᵢ) for outputs, with ‖x‖X=‖D⁻¹x‖₂ and ‖b‖Y=‖C⁻¹b‖₂. Derive the matrix whose Euclidean condition number describes these scaled norms. Explain how to report errors back in physical coordinates.

## Research connection and reading

The [LAPACK Users' Guide on error measurement](https://www.netlib.org/lapack/lug/node75.html) supplies standard norm conventions and explains reciprocal condition reporting. Read its discussion of RCOND as a bridge to actual solver diagnostics. The [NumPy condition-number documentation](https://numpy.org/doc/stable/reference/generated/numpy.linalg.cond.html) specifies the available norm choices; state the selected p instead of reporting an unlabeled library number.

For textbook depth, Trefethen and Bau, *Numerical Linear Algebra* (SIAM, 1997), Lectures 12–15, develop condition numbers, floating-point arithmetic, and stability in the vocabulary used here; Lectures 20–22 cover Gaussian elimination, pivoting, and its stability. Higham, *Accuracy and Stability of Numerical Algorithms* (2nd ed., SIAM, 2002), Chapter 7, treats perturbation theory for linear systems, including the normwise backward-error formula of Section 5 (Rigal and Gaches) and its componentwise counterpart.

This material unlocks a sharper reading of inverse problems and model fitting: a reproducible output need not be identifiable from uncertain data, and a stable implementation need not preserve all solution coordinates. A scientific claim must specify which output or prediction is sensitive, to what perturbations, under which measurement scale. Sensitivity of predictions can differ from sensitivity of parameters; quantify the requested output before extending a worst-case parameter bound to a task-level conclusion.

## Mastery check and remaining coverage

You should now be able to give a residual a scale, connect it to a qualified forward-error ceiling, exhibit nearby data for which a candidate is exact, separate an unstable evaluation path from a sensitive problem, and translate κ into an expected loss of digits for a chosen format. Reconstruct the proofs and repair critical mistakes before advancing, even if the typed answers pass.

LA10 develops pseudoinverses, rank cutoffs, and regularization. LA11 develops direct solver algorithms and their cost; LA12 develops iterative methods and preconditioning. Sharp least-squares perturbation theory, structured/componentwise condition estimators, production reciprocal-condition estimation, and mixed-precision refinement remain further work. The small dense browser estimator and two-dimensional experiments are diagnostic teaching tools, not certificates for arbitrary large model systems.
