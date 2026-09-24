---
id: math.linear-algebra.orthonormal-bases-qr
title: Orthonormal bases, Gram–Schmidt and QR
prerequisites: [math.linear-algebra.projections-least-squares]
estimated_hours: 24
answers: 04-qr
---

# Orthonormal bases, Gram–Schmidt and QR

A skew basis makes coordinates a problem to solve. An orthonormal basis makes them measurements: ask each axis how much of a vector points along it. Gram–Schmidt builds those axes. QR remembers how to reconstruct the original columns from them. Floating point reveals why those two promises need separate checks.

## 0. Where this is going

This module establishes four results: orthonormal coordinates are inner products; Gram–Schmidt preserves every successive span; full-column-rank QR exists and is unique after fixing signs; least squares reduces to an upper-triangular solve. The computational thread asks which of those exact statements survive a particular implementation.

We work over the reals, with the standard Euclidean inner product unless a metric is explicitly named. Matrices store vectors in **columns** in the mathematics; the Python tasks accept ordinary lists of **rows**. Let \(A\in\mathbb R^{m\times n}\), usually with \(m\ge n\) and independent columns. A reduced QR factorization has \(Q\in\mathbb R^{m\times n}\) and \(R\in\mathbb R^{n\times n}\). Write these shapes beside every derivation.

Read sections 1–9, try the practice prompts, and use their static hints after an attempt. Step through the interactive experiment before trying its near-dependent preset. Section 10 has three Python tasks runnable in the reader; NumPy and PyTorch experiments run locally. Twenty-four hours includes the proofs, implementations, exercise bank, and checkpoint.

## 1. Coordinates you can read off

A family \(q_1,\ldots,q_n\) is **orthonormal** when \(q_i^{\mathsf T}q_j\) is 1 for \(i=j\) and 0 otherwise. For the matrix \(Q=[q_1\ \cdots\ q_n]\), that is exactly \(Q^{\mathsf T}Q=I_n\). Pairwise orthogonality alone does not impose unit length; the zero vector cannot belong to an orthonormal family.

**Theorem 12 — orthonormal coordinates and projection.** If \(v=Qc\), then \(c=Q^{\mathsf T}v\). For an arbitrary \(v\in\mathbb R^m\), \(QQ^{\mathsf T}v\) is the orthogonal projection onto \(C(Q)\), with coordinates \(Q^{\mathsf T}v\).

*Proof.* Multiply \(v=Qc\) by \(Q^{\mathsf T}\). For an arbitrary target set \(p=QQ^{\mathsf T}v\). Then \(p\in C(Q)\) and \(Q^{\mathsf T}(v-p)=0\); Module 3's projection theorem identifies the nearest point. This also gives

$$
\|Qc\|^2=\|c\|^2,\qquad
\|v\|^2=\|Q^{\mathsf T}v\|^2+\|v-QQ^{\mathsf T}v\|^2.
$$

The second equation is an energy budget. Coordinates capture all the energy only if the target belongs to the subspace.

**Worked example.** Take \(q_1=(1,1,0)/\sqrt2\), \(q_2=(0,0,1)\), and \(v=(3,1,2)\). The coordinates of its projection are \((2\sqrt2,2)\), the projection is \((2,2,2)\), and the residual is \((1,-1,0)\). Squared lengths split as \(14=12+2\).

<details><summary>Predict: is the transpose an inverse here?</summary>

It is a left inverse: \(Q^{\mathsf T}Q=I_2\). It cannot recover the discarded residual from \(Q^{\mathsf T}v\). The product \(QQ^{\mathsf T}\) is a rank-2 projector in three dimensions, not \(I_3\).

</details>

> **Practice — Foundation:** Compute \(Q^{\mathsf T}(1,-1,0)\) for this example.
>
> **Hint:** Take the dot product with each of the two columns separately. A vector perpendicular to their span has no coordinates in the projected component.
>
> **Practice — Core:** Derive the energy budget by an orthogonal decomposition.
>
> **Hint:** Write v=QQᵀv+(I−QQᵀ)v. Check the two terms are perpendicular and use that Q preserves lengths of coefficient vectors.
>
> **Practice — Stretch:** Prove that \(QQ^{\mathsf T}=I_m\) as well as \(Q^{\mathsf T}Q=I_n\) forces \(m=n\), without determinants.
>
> **Hint:** QᵀQ=I makes Q injective, while QQᵀ=I makes it surjective. Compare input and output dimensions using rank–nullity.

## 2. Gram–Schmidt: keep only what is new

Suppose \(a_1,\ldots,a_n\) are independent. Normalize the first column. For each later column, remove its projection onto the directions already built:

$$
r_{ij}=q_i^{\mathsf T}a_j\quad(i<j),\qquad
v_j=a_j-\sum_{i<j}r_{ij}q_i,\qquad
r_{jj}=\|v_j\|,\qquad q_j=v_j/r_{jj}.
$$

This is **classical Gram–Schmidt** (CGS). The diagonal \(r_{jj}\) measures how much genuinely new direction remains after the earlier columns. It is nonnegative by construction and strictly positive for an independent input.

**Theorem 13 — successive spans are preserved.** The algorithm produces orthonormal vectors, and for every \(j\),

$$
\operatorname{span}(q_1,\ldots,q_j)=\operatorname{span}(a_1,\ldots,a_j).
$$

*Proof by induction.* The first step is normalization of a nonzero vector. Assuming the earlier \(q_i\) are orthonormal, for \(k<j\),

$$
q_k^{\mathsf T}v_j=q_k^{\mathsf T}a_j-
\sum_{i<j}(q_i^{\mathsf T}a_j)q_k^{\mathsf T}q_i=0.
$$

If \(v_j=0\), then \(a_j\) belongs to the previous span, contradicting independence. Normalization therefore succeeds. The construction expresses \(q_j\) in the span of the first \(j\) original columns, while rearranging it expresses \(a_j\) in the first \(j\) new vectors. Those two inclusions finish the induction.

**Work one column all the way through.** For \(a_1=(1,1,0)\), \(a_2=(1,0,1)\),

$$
q_1=\frac{(1,1,0)}{\sqrt2},\quad r_{12}=\frac1{\sqrt2},\quad
v_2=(1/2,-1/2,1),\quad r_{22}=\sqrt{3/2},\quad
q_2=\frac{(1,-1,2)}{\sqrt6}.
$$

The raw residual and its normalized direction are different objects. The former retains the amount of new information; the latter has deliberately thrown away that length. QR will store the length in \(R\).

> **Practice — Foundation:** Verify \(q_1^{\mathsf T}v_2=0\) in the worked example.
>
> **Hint:** Substitute the displayed coordinates and cancel the contributions from the first two positions. The third coordinate of q₁ is zero.
>
> **Practice — Core:** Derive both span inclusions at step \(j\) without writing a matrix inverse.
>
> **Hint:** The subtraction formula puts qⱼ in the old columns’ span. Rearrange it to put aⱼ in the new directions’ span.
>
> **Practice — Stretch:** Run Gram–Schmidt on the spanning list \((1,0,0),(2,0,0),(0,1,0)\), skipping the dependent middle column when its residual is zero and continuing with the third. Give the accepted orthonormal directions and the coefficient matrix that reconstructs all three original columns, and explain why a square invertible \(R\) is no longer the right output.
>
> **Hint:** The residual of (2,0,0) after removing its q₁ component is zero, so only e₁ and e₂ are accepted. Two directions must reconstruct three columns, so the coefficients form a 2×3 matrix, (1,2,0) over (0,0,1).

## 3. Watch the subtraction, then audit the result

In the figure, drag the original vector tips on the left. **Next step** first removes a projection, then normalizes the residual; read the stage label to distinguish them. Choose two columns to understand the mechanics, or three to expose the arithmetic difference between the algorithms. The right view compares their completed normalized directions, even while you step through the left view.

```lab
la-gramschmidt
```

Start with the worked example. Before revealing each step, predict the direction left after subtraction. Switch the step view between classical and modified; ordinary inputs should look almost identical. Now select **near dependent**: the three columns become

$$
a_1=(1,\varepsilon,\varepsilon),\quad
 a_2=(1,\varepsilon,0),\quad
 a_3=(1,0,\varepsilon),\qquad\varepsilon=10^{-4},
$$

with each basic arithmetic operation rounded to float32. These columns are independent for every nonzero \(\varepsilon\): subtract the first column from each of the others and inspect the two remaining coordinate directions. Yet the classical output can have a pair of allegedly perpendicular unit vectors with inner product about \(0.707\). The modified output is substantially better here, but its overlap is still around \(10^{-4}\), not zero.

The almost coincident input arrows are hard to distinguish because the input really is nearly dependent. The normalized output directions and numerical readouts make the failure visible without secretly enlarging a small residual. Camera angles can disguise orthogonality; inspect dot products rather than trusting a screen angle.

The table audits three separate promises:

| Diagnostic | Definition | What a small value establishes |
|---|---|---|
| Overlap | \(\max_{i\ne j}|q_i^{\mathsf T}q_j|\) | Distinct columns are nearly perpendicular |
| Unit-length error | \(\max_i|q_i^{\mathsf T}q_i-1|\) | Each column is nearly normalized |
| Reconstruction | \(\|A-QR\|_F/\|A\|_F\) | The factors nearly reproduce this input |

Here \(\|M\|_F=\sqrt{\sum_{ij}M_{ij}^2}\), just the square root of the sum of squared entries. A tiny reconstruction error does **not** imply a tiny overlap. Also, \(Q=2I\) has zero overlap but is not orthonormal. The zero-column preset makes normalization impossible; the exact-dependent preset stops at a missing new direction. A numerical tolerance rejection is not an exact rank proof.

> **Practice — Foundation:** Which diagnostic detects \(Q=2I\), and which does not?
>
> **Hint:** Compute QᵀQ explicitly. Keep its diagonal normalization test separate from the maximum over distinct-column entries.
>
> **Practice — Core:** Explain why two input columns cannot expose the difference between the two subtraction schedules used here.
>
> **Hint:** For column 2 there is only one previous direction. Its current residual before that one subtraction is still the original column.
>
> **Practice — Stretch:** Hold the section-3 fixture \(a_1=(1,\varepsilon,\varepsilon)\), \(a_2=(1,\varepsilon,0)\), \(a_3=(1,0,\varepsilon)\) with \(\varepsilon=10^{-4}\) fixed and switch from float32 to float64. Predict how the classical overlap (about 0.707 in float32), the unit-length error, and the reconstruction error should change, then explain why changing precision does not change the exact rank of the intended real matrix.
>
> **Hint:** Subtracting a₁ from a₂ and a₃ leaves (0,0,−ε) and (0,−ε,0), so the exact rank is 3 for any ε≠0. Smaller unit roundoff shrinks the overlap, which is driven by cancellation in the subtractions; it proves nothing about rank.

## 4. Modified Gram–Schmidt and a second pass

The modified form (MGS) starts with \(v=a_j\) and updates it after **each** projection:

~~~text
for i = 1, ..., j-1:
    r[i,j] = dot(q[i], v)
    v = v - r[i,j] * q[i]
r[j,j] = norm(v)
q[j] = v / r[j,j]
~~~

Classical Gram–Schmidt measures every coefficient against the **original** \(a_j\), then subtracts the sum. Modified Gram–Schmidt measures against the **current residual**. In exact arithmetic these agree, because subtracting a multiple of \(q_k\) cannot change its inner product with a different, perpendicular \(q_i\).

In floating point the previously computed directions need not be exactly perpendicular. An erroneous overlap measured against a large original column can dominate its tiny final residual; normalization then amplifies the error. MGS responds to the updated vector and usually retains orthogonality better. This is an algorithmic distinction, not a new exact factorization theorem. MGS can still lose orthogonality on sufficiently difficult inputs.

A practical improvement is **reorthogonalization**: before normalizing, pass the residual through the previous directions again. If the second pass removes \(\delta_i q_i\), update \(r_{ij}\leftarrow r_{ij}+\delta_i\). Otherwise you repair \(Q\) while breaking \(A=QR\). Two passes often recover much better orthogonality when the independent directions remain numerically resolvable; they cannot recover information already rounded out of the input. Detailed bounds and their assumptions belong to the later stability module; the [Gram–Schmidt analysis by Giraud, Langou, Rozložník and van den Eshof](https://www.stat.uchicago.edu/~lekheng/courses/31060w14/GLRV.pdf) is further reading.

A tolerance decides when to stop before dividing by a tiny norm. Here the teaching functions use an **absolute** threshold, \(\|v_j\|\le\texttt{tol}\). Scaling all columns can change acceptance without changing independence. Do not describe every rejection as “the matrix is rank deficient,” and do not treat a successful unpivoted run as a reliable numerical-rank certificate.

> **Practice — Foundation:** In MGS, which vector is used in the second overlap for column 3?
>
> **Hint:** Begin with a₃, remove its component along q₁, and only then take the inner product with q₂.
>
> **Practice — Core:** Prove CGS and MGS agree in exact arithmetic, assuming the previous directions are orthonormal.
>
> **Hint:** Expand qᵢᵀ(aⱼ−Σₖ<ᵢ rₖⱼqₖ). Every cross term disappears when previous q vectors are perpendicular.
>
> **Practice — Stretch:** Derive the update to \(R\) required by a second pass and explain why overwriting the first-pass coefficients fails.
>
> **Hint:** Write the original column as the old projected components plus the first residual. Substitute the second-pass expression for that residual and collect coefficients.

## 5. QR remembers everything normalization removed

Rearrange each Gram–Schmidt step:

$$
a_j=\sum_{i=1}^{j}q_i r_{ij}.
$$

Collect columns to obtain \(A=QR\). No \(q_i\) with \(i>j\) is needed to build \(a_j\), so \(R\) is upper triangular. Its \(j\)-th column is the coordinate vector of \(a_j\) in the new orthonormal basis. In particular \(R=Q^{\mathsf T}A\).

**Theorem 14 — existence and uniqueness of reduced QR.** Every real \(m\times n\) matrix with independent columns has a factorization \(A=QR\), with \(Q^{\mathsf T}Q=I_n\), upper-triangular \(R\), and positive diagonal entries. Under those conditions it is unique.

*Existence* is Theorem 13 with the coefficients collected into a matrix. For *uniqueness*, the first column forces \(a_1=q_1r_{11}\); unit length and a positive \(r_{11}\) force \(r_{11}=\|a_1\|\) and \(q_1=a_1/\|a_1\|\). Inductively assume the previous \(q_i\) are fixed. Taking their inner products with \(a_j\) forces all \(r_{ij}\) for \(i<j\). Subtract those components. The positive norm of what remains forces \(r_{jj}\) and \(q_j\). This determines every entry.

For the two-column example,

$$
Q=\begin{pmatrix}1/\sqrt2&1/\sqrt6\\1/\sqrt2&-1/\sqrt6\\0&2/\sqrt6\end{pmatrix},\qquad
R=\begin{pmatrix}\sqrt2&1/\sqrt2\\0&\sqrt{3/2}\end{pmatrix}.
$$

Without positive diagonal entries, choose any diagonal sign matrix \(D\) with entries \(\pm1\): \(A=(QD)(DR)\) is another valid QR. Library outputs may use different signs. Compare invariant quantities or align signs before comparing factors. Reordering the input columns also changes the ordered construction, though the final column space stays the same.

> **Practice — Foundation:** Multiply the displayed \(Q\) and \(R\) to reconstruct the second column.
>
> **Hint:** The second column of QR is r₁₂q₁+r₂₂q₂. Multiply the two scalars into the displayed normalized columns before adding.
>
> **Practice — Core:** Show that \((QD)(DR)=QR\) and that the modified columns remain orthonormal.
>
> **Hint:** Use D²=I to check the product. For orthonormality compute (QD)ᵀ(QD) and use QᵀQ=I.
>
> **Practice — Stretch:** For the dependent columns \(a_1=(1,0)\), \(a_2=(2,0)\), exhibit two different factorizations \(A=QR\) with orthonormal \(Q\) and upper-triangular \(R\) having \(r_{11}>0\). Explain precisely which step of the uniqueness proof fails.
>
> **Hint:** Here q₁=e₁, r₁₁=1, r₁₂=2, and the residual of a₂ is zero, so r₂₂=0. Then q₂=e₂ and q₂=−e₂ both work with the same R, because nothing forces the second direction.

## 6. Reduced, complete, and metric QR

Reduced QR stores only an orthonormal basis for \(C(A)\). A **complete** QR adds an orthonormal basis \(Q_\perp\) for its complement:

$$
\widehat Q=[Q\ Q_\perp]\in\mathbb R^{m\times m},\qquad
A=\widehat Q\begin{pmatrix}R\\0\end{pmatrix}.
$$

An extension exists: append standard coordinate vectors whenever they enlarge the span, then apply Gram–Schmidt. This combines Module 1's basis-extension argument with the procedure just proved. The extra columns are generally not unique. Even with a fixed reduced QR and positive diagonal of \(R\), changing a complementary direction's sign changes the completion.

For \(m>n\), reduced \(Q\) is an isometric **embedding** of coefficient space into observation space. Its transpose extracts coordinates and discards the perpendicular part. Complete \(\widehat Q\) is a change between orthonormal coordinate systems on the whole ambient space; no information is discarded.

Under a positive definite metric \(G\), the same exact procedure uses \(r_{ij}=q_i^{\mathsf T}Ga_j\) and \(r_{jj}=\sqrt{v_j^{\mathsf T}Gv_j}\). Then \(Q^{\mathsf T}GQ=I\), projected coordinates are \(Q^{\mathsf T}Gv\), and the projector is \(QQ^{\mathsf T}G\). Ordinary \(Q^{\mathsf T}v\) is generally wrong in that geometry. The runnable functions below use the Euclidean metric only.

> **Practice — Foundation:** State the shapes of reduced and complete QR for a \(7\times3\) full-column-rank matrix.
>
> **Hint:** Reduced Q has one column per independent design column. Complete Q has one column per ambient dimension, and complete R gains zero rows.
>
> **Practice — Core:** Prove that \(\|Q^{\mathsf T}v\|\le\|v\|\), with equality exactly for \(v\in C(Q)\).
>
> **Hint:** Use the projection energy budget. Equality of the two norms holds precisely when the remaining squared residual vanishes.
>
> **Practice — Stretch:** Orthogonalize \((1,1),(1,0)\) under \(G=\operatorname{diag}(1,4)\); predict which coefficient formula changes.
>
> **Hint:** Use qᵢᵀGaⱼ for coefficients and the G-norm for normalization. Start by finding the squared G-length of (1,1).

## 7. Least squares becomes a triangular solve

**Theorem 15 — QR least squares.** For full-column-rank \(A=QR\), the unique minimizer of \(\|b-Ax\|^2\) solves

$$
Rx=Q^{\mathsf T}b.
$$

*Proof.* Split the target into its projection and residual:

$$
b-QRx=(I-QQ^{\mathsf T})b+Q(Q^{\mathsf T}b-Rx).
$$

The two terms are perpendicular, and \(Q\) preserves lengths on coefficient space. Therefore

$$
\|b-Ax\|^2=\|(I-QQ^{\mathsf T})b\|^2+\|Q^{\mathsf T}b-Rx\|^2.
$$

The first term cannot be changed by choosing coefficients. The second can be made zero because upper-triangular \(R\) has nonzero diagonal. Back substitution gives the unique solution, from \(x_n\) upwards:

$$
x_i=\frac{(Q^{\mathsf T}b)_i-\sum_{j>i}r_{ij}x_j}{r_{ii}}.
$$

**A complete regression example.** Fit an intercept and slope to \((t,y)=(0,1),(1,2),(2,2)\). For the design columns \(\mathbf1=(1,1,1)\) and \(t=(0,1,2)\),

$$
q_1=\mathbf1/\sqrt3,\quad q_2=(-1,0,1)/\sqrt2,\quad
R=\begin{pmatrix}\sqrt3&\sqrt3\\0&\sqrt2\end{pmatrix},\quad
Q^{\mathsf T}y=(5/\sqrt3,1/\sqrt2).
$$

Back substitution gives slope \(1/2\), then intercept \(7/6\). The residual is \((-1/6,1/3,-1/6)\), with squared error \(1/6\), agreeing with Module 3. Here \(q_2\) is the centered input direction: removing the constant column subtracts the mean of the inputs. Centering in regression is one instance of projection subtraction.

For each new target, reuse \(Q,R\). Computing \(Q^{\mathsf T}b\) costs order \(mn\) arithmetic, and the triangular solve order \(n^2\); rebuilding the factorization costs order \(mn^2\). Compute the residual directly when its small magnitude matters: subtracting \(\|Q^{\mathsf T}b\|^2\) from \(\|b\|^2\) can lose digits through cancellation.

> **Practice — Foundation:** Solve the displayed two triangular equations in reverse order.
>
> **Hint:** The second equation involves only the slope. Substitute that value into the first equation to recover the intercept.
>
> **Practice — Core:** Prove the objective split and identify the term coefficients cannot change.
>
> **Hint:** Decompose b into its projection onto C(Q) and its orthogonal residual. Subtract QRx only from the component in the column space.
>
> **Practice — Stretch:** For a target nearly in \(C(A)\), explain why the energy-budget formula for the minimum error can be numerically worse than explicitly computing \(b-Ax\).
>
> **Hint:** If two large nearly equal squared norms are subtracted, their low-order digits can disappear. Compare with forming the small residual vector before squaring.

## 8. A stable route still needs a stable implementation

QR avoids forming \(A^{\mathsf T}A\). For the Module 3 family

$$
A_\varepsilon=\begin{pmatrix}1&1\\0&\varepsilon\end{pmatrix},\qquad
A_\varepsilon^{\mathsf T}A_\varepsilon=
\begin{pmatrix}1&1\\1&1+\varepsilon^2\end{pmatrix},
$$

the Gram matrix hides the separating direction in an addition of \(\varepsilon^2\) to 1. In float64 with \(\varepsilon=10^{-8}\), that sum can round to 1. Direct QR works with the original \(\varepsilon\) instead. This avoids an additional source of lost information; it does not make the original coefficients insensitive to perturbations in \(b\).

Do not substitute “any program that returns something named QR” for “a stable QR implementation.” The figure already showed a classical QR whose columns are far from perpendicular. Production dense QR commonly uses **Householder reflections**. The [NumPy QR documentation](https://numpy.org/doc/stable/reference/generated/numpy.linalg.qr.html) describes its LAPACK-backed implementation and reduced/complete shapes.

A small preview explains the name. For a unit vector \(u\), \(H=I-2uu^{\mathsf T}\) flips the component along \(u\) and leaves its perpendicular complement fixed. Direct multiplication gives \(H^{\mathsf T}H=I\). A sequence of such length-preserving transformations can zero entries below a diagonal without explicitly subtracting nearly equal projections onto an increasingly inaccurate basis. Implementation details and backward-error bounds are later material; use the supplied library routine in the comparison experiments, rather than implementing reflectors before studying their numerical construction.

The NumPy experiments compare four approaches on the **same stored input**: CGS, MGS, two-pass MGS, and library QR. Report orthogonality and reconstruction separately. When comparing least-squares solvers also report coefficients, residual, and \(A^{\mathsf T}r\). Near dependence can produce sensitive coefficients even when the solver has done its job well.

> **Practice — Foundation:** Explain where the tiny \(\varepsilon\) goes when the Gram matrix is formed.
>
> **Hint:** Inspect the bottom-right Gram entry. The separation ε becomes ε² added to a number of order 1.
>
> **Practice — Core:** Prove \((I-2uu^{\mathsf T})^{\mathsf T}(I-2uu^{\mathsf T})=I\) for a unit vector.
>
> **Hint:** Expand the product and use uᵀu=1 to simplify uuᵀuuᵀ. Also note that uuᵀ is symmetric.
>
> **Practice — Stretch:** In float64 take \(A_\varepsilon\) with \(\varepsilon=10^{-8}\) and \(b=(2,10^{-8})\). (i) Solve by QR, then perturb \(b_2\) by \(10^{-10}\) and solve by QR again. (ii) Holding \(A\) and \(b\) fixed, solve by the normal equations. Report the coefficients in each case and say which comparison measures input sensitivity and which measures the extra arithmetic error of forming \(A^{\mathsf T}A\).
>
> **Hint:** Exactly, x=(1,1) and the perturbed solution is (0.99,1.01), so (i) shows sensitivity of 10⁻² per 10⁻¹⁰. In (ii) the stored Gram entry 1+10⁻¹⁶ rounds to 1, so the stored Gram matrix is exactly singular.

## 9. Orthogonal initialization: what it promises

For a square orthogonal weight matrix \(W\), \(\|Wx\|=\|x\|\) and \((Wx)^{\mathsf T}(Wy)=x^{\mathsf T}y\). A product of square orthogonal matrices has the same property. This motivates initializing a deep **linear** network without immediately shrinking or enlarging directions.

The shapes matter. If \(W\) is tall with orthonormal columns, it preserves all input lengths. If it is wide with orthonormal rows, its kernel is nontrivial; it necessarily discards some input directions. Then \(W^{\mathsf T}W\) is a projector, not an identity. A gain \(g\) scales the preserved lengths by \(|g|\).

The [PyTorch initialization documentation](https://docs.pytorch.org/docs/stable/nn.init.html#torch.nn.init.orthogonal_) specifies an orthogonal or semi-orthogonal initialization and a multiplicative gain. This is a statement about the initialized matrix. Subsequent unrestricted updates need not preserve orthogonality. Nor does inserting a nonlinearity preserve every length: even \(W=I\) followed by ReLU sends a negative coordinate to zero. Do not convert a property of a matrix into a guarantee about optimization, gradient propagation through arbitrary nonlinear layers, or trained representations.

QR sign conventions also matter when comparing seeded implementations. To put a full-rank reduced factorization into positive-diagonal convention, use \(s_i=\operatorname{sign}(r_{ii})\), replace column \(i\) of \(Q\) by \(s_iq_i\), and row \(i\) of \(R\) by \(s_iR_{i,:}\). This changes neither the product nor the column-space projector.

> **Practice — Foundation:** Which identity, \(W^{\mathsf T}W=I\) or \(WW^{\mathsf T}=I\), guarantees preservation of every input length?
>
> **Hint:** Expand ||Wx||² as xᵀWᵀWx. The identity must act on the input space, so check its dimensions.
>
> **Practice — Core:** Prove that a product of square orthogonal matrices is orthogonal.
>
> **Hint:** Transpose the product in reverse order. Cancel adjacent WᵀW pairs one at a time.
>
> **Practice — Stretch:** Give one explicit nonlinear-layer counterexample and one explicit parameter update that break a length-preservation claim after orthogonal initialization.
>
> **Hint:** Try ReLU after the identity on a vector with a negative coordinate. Separately perturb one diagonal entry of the identity and inspect its Gram matrix.

## Local numerical and research audit

### Audit QR across scales

For reduced QR, inspect both reconstruction \(e_{\mathrm{rec}}=\|A-QR\|_F/\|A\|_F\) for nonzero \(A\), and orthogonality \(e_{\mathrm{orth}}=\|Q^TQ-I\|_F\). For a zero matrix use an absolute reconstruction error. The two checks answer different questions: accurate reconstruction does not imply that the basis columns are orthogonal.

Repeat a nearly dependent example at common scales \(10^{-8},1,10^8\), retaining dtype and a documented relative rank rule. Compare classical and modified Gram–Schmidt, with and without reorthogonalization. Report discarded columns explicitly rather than padding a supposedly orthonormal basis with zero columns.

**M9 · Stretch · mixed — Audit QR across scales.** If Q=2I₂ and R=A/2, does exact reconstruction certify QR with orthonormal columns? Find ‖QᵀQ−I₂‖F.

## 10. Three runnable coding labs

All inputs use nonempty lists of **rows**, finite real entries excluding booleans, and matching dimensions. Preserve the input lists and raise `ValueError` on malformed data. A supplied `tol` must be positive and finite. The browser supplies `_validated_matrix` and, for the solver, `_validated_vector` for validation and copying. Implement the algorithms yourself; these tasks use only the standard library.

### Lab A — two subtraction schedules

Implement **gram_schmidt** in [labs/exercises.py](../../labs/exercises.py). Return `((Qc, Rc), (Qm, Rm))`, with classical and modified factors, all stored by rows. Require \(m\ge n\); reject any column whose residual norm is at or below the absolute `tol` rather than silently dropping it. Positive diagonals fix the sign convention. A successful result is still subject to the orthogonality audit; do not round its entries for presentation.

Predict the two-column worked example's factors before coding. Then compare both schedules at \(\varepsilon=10^{-8}\) using the three-column fixture from the figure in ordinary Python floating point. Keep this comparison distinct from the figure's float32 experiment.

~~~text
python -m labs.checks gram-schmidt
~~~

### Lab B — solve without a Gram matrix

Implement **qr_solve** in [labs/exercises.py](../../labs/exercises.py). Return `(coefficients, residual, squared_error)`. Build QR using **two passes of modified Gram–Schmidt per column**, accumulating the second-pass corrections into \(R\). Then back-substitute in \(Rx=Q^{\mathsf T}b\), and form the residual against the original input. Use the same absolute norm-rejection rule as Lab A. This lab deliberately excludes rank-deficient and wide designs; their unique fits and ambiguous coefficients return in Module 10.

Predict the intercept/slope regression example: coefficients `[7/6, 1/2]`, residual `[-1/6, 1/3, -1/6]`, squared error `1/6`. A nearly dependent square example verifies the benefit of avoiding the Gram matrix, alongside the ordinary tall-system cases.

~~~text
python -m labs.checks qr-solve
~~~

### Lab C — audit what “orthogonal” actually says

Implement **orthogonality_defect** in [labs/exercises.py](../../labs/exercises.py). Return the maximum absolute **off-diagonal** entry of \(Q^{\mathsf T}Q\), and zero when there is only one column. Accept arbitrary nonempty rectangular matrices, including dependent, wide, or zero matrices: this is a diagnostic, not a validator of an orthonormal basis. Separately measuring column-length error is the caller's job.

Predict: `[[1,1],[0,1]]` returns `1`; `[[2,0],[0,2]]` and `[[0,0]]` both return `0`. Those last two are intentional traps against mistaking this measure for a complete orthonormality test.

~~~text
python -m labs.checks orthogonality-defect
~~~

The checks cover reconstruction, orthonormality where numerically expected, triangular structure, positive diagonals, both subtraction schedules, exact dependence, tolerance rejection, tall and square least squares, input preservation, and invalid data. Passing them is evidence about these small functions; the written arguments establish what the formulas mean.

## 11. Exercises · by hand

**A1 · Foundation · paper — coordinates and missing energy.** Let \(q_1=(1,1,0)/\sqrt2\), \(q_2=(0,0,1)\), and \(b=(3,1,2)\). Find \(Q^{\mathsf T}b\), the projection, the residual, and the squared residual norm.

**A2 · Foundation · paper — orthogonal does not mean normalized.** For \(Q=\operatorname{diag}(2,3)\), compute the maximum off-diagonal overlap and maximum diagonal error of \(Q^{\mathsf T}Q-I\). Is \(Q^{\mathsf T}\) an inverse?

**A3 · Core · paper — one complete Gram–Schmidt factorization.** Factor the matrix with columns \((1,1,0),(1,0,1)\) into positive-diagonal reduced QR. Show both projection and normalization steps.

**A4 · Core · paper — the first failed direction.** Run exact Gram–Schmidt on \((1,0,0),(2,0,0),(0,1,0)\). At which column does the full-column-rank algorithm stop? If a basis finder skips that column, what basis and dimension result?

**A5 · Core · paper — the successive-span invariant.** Prove that after step \(j\), the first \(j\) columns of \(Q\) and \(A\) span the same space. Explain why independence is required for normalization.

**A6 · Core · paper — the sign convention earns uniqueness.** Prove uniqueness of full-column-rank reduced QR with positive diagonal. Exhibit the sign ambiguity when positivity is removed.

**A7 · Foundation · paper — back substitution is ordered.** Solve \(Rx=c\) for \(R=\begin{pmatrix}2&-1&3\\0&4&2\\0&0&5\end{pmatrix}\), \(c=(9,2,10)\), starting with the last row.

**A8 · Core · paper — why least squares reduces to R.** Derive \(\|b-Ax\|^2=\|(I-QQ^{\mathsf T})b\|^2+\|Q^{\mathsf T}b-Rx\|^2\). Prove uniqueness of the minimizing coefficients under the stated rank assumption.

**A9 · Core · paper — complete QR has extra freedom.** Give the shapes in reduced and complete QR for a full-column-rank \(5\times2\) matrix. How many complementary columns are added? Explain why positive diagonal does not make the complete \(Q\) unique.

**A10 · Stretch · paper — Gram–Schmidt with a metric.** For \(a_1=(1,1),a_2=(1,0)\) under \(G=\operatorname{diag}(1,4)\), compute \(q_1,q_2,R\) with positive diagonal and verify \(Q^{\mathsf T}GQ=I\).

**A11 · Stretch · paper — repairing Q without losing A.** A first orthogonalization pass leaves \(v=a_j-\sum_i r_{ij}q_i\). A second pass removes \(\sum_i\delta_iq_i\). Derive the updated \(R\) entries and show what reconstruction error results if the first-pass coefficients are overwritten by \(\delta_i\).

**A12 · Stretch · paper — a reflection is an isometry.** Let \(u=(1,1)/\sqrt2\), \(H=I-2uu^{\mathsf T}\). Compute \(H(3,1)\). Prove \(H^2=I\), and identify which direction flips and which stays fixed.

## 12. Exercises · NumPy

**B1 · Foundation · NumPy — factor shapes and signs.** Use `np.linalg.qr(A, mode="reduced")` on the two-column example. Align the signs to positive diagonal, verify both factors against A3, and compare with `mode="complete"`. Record shapes and errors.

**B2 · Core · NumPy — same input different arithmetic.** Implement CGS, MGS, and two-pass MGS in a chosen dtype. For the three-column fixture in section 3, sweep \(\varepsilon\in\{10^{-2},10^{-4},10^{-6},10^{-8}\}\) in float32 and float64, and compare with library QR. Report all three diagnostics, dtype, norm threshold, and rejected cases.

**B3 · Core · NumPy — QR versus the Gram system.** For \(A=\begin{pmatrix}1&1\\0&10^{-8}\end{pmatrix}\), \(b=(2,10^{-8})\), compare `np.linalg.solve(A.T @ A, A.T @ b)` with QR plus `np.linalg.solve(R,Q.T@b)` in float64. Show the stored Gram matrix and compare with the exact coefficients.

**B4 · Core · NumPy — one factorization several targets.** Use the design \(A=[\mathbf1\ t]\) with \(t=(0,1,2)\) and target columns \((1,2,2)\), \((1,3,5)\). Factor A once, solve for both targets, and report each squared residual norm.

**B5 · Core · NumPy — order changes the axes.** Factor the worked example A and its reversed-column matrix with positive diagonals. Compare Q directly, then compare the projectors and their action on \((0,0,1)\). Explain the distinction.

**B6 · Stretch · NumPy — audit a misleading scalar.** Compute the off-diagonal defect for \(2I_3\), the zero \(3\times2\) matrix, and an orthonormal \(3\times2\) matrix. Add a second diagnostic that distinguishes their normalization. Explain why dividing by column norms is not a safe repair for all three.

**B7 · Stretch · NumPy — sensitivity survives stable QR.** Keep A from B3 fixed and perturb only the second component of b by \(10^{-10}\). Solve by QR before and after. Compare the coefficient change with the target change; explain what a tiny reconstruction residual can and cannot establish.

**B8 · Stretch · NumPy — orthonormal polynomials.** In the polynomial space of degree at most two, use \(\langle f,g\rangle=\int_0^1f(t)g(t)\,dt\). Apply metric Gram–Schmidt to \(1,t,t^2\) in coefficient coordinates. Derive the Gram matrix entries analytically, then verify the computed orthonormality numerically.

## 13. Exercises · PyTorch

**C1 · Foundation · PyTorch — tall orthogonal initialization.** Create a float64 \(5\times3\) tensor and apply `torch.nn.init.orthogonal_` with gain 1. Check which Gram matrix is an identity, then test length preservation for several input vectors. State the rank of the other Gram matrix.

**C2 · Core · PyTorch — wide maps discard directions.** Initialize a float64 \(3\times5\) W with gain 1. Check the row identity. Construct a nonzero vector in its null space using a complete QR of \(W^{\mathsf T}\), and compare \(\|Wx\|\) with \(\|x\|\).

**C3 · Core · PyTorch — a linear chain and its gain.** Multiply four square float64 orthogonal matrices, each initialized with gain 1. Repeat with gain 2 at every layer, using the same underlying orthogonal directions. Predict the ratio of output to input norm before computing it.

**C4 · Core · PyTorch — nonlinearity breaks the promise.** Use \(W=I_2\), \(x=(-3,4)\), and ReLU after the linear map. Compute the input and output squared norms. Explain why this does not contradict orthogonality of W.

**C5 · Stretch · PyTorch — an update leaves the constraint.** Start at \(W=I_2\) and apply the explicit update \(W\leftarrow W-0.1\operatorname{diag}(1,0)\). Compute \(W^{\mathsf T}W\) and measure length changes along each coordinate axis. Explain why an initialization is not an ongoing constraint.

**C6 · Stretch · PyTorch — audit a QR solve.** In float64, solve the three-point regression example using `torch.linalg.qr(A, mode="reduced")` and a triangular solve with a column-shaped right-hand side. Compare coefficients, residual orthogonality, and squared error with the derived result. Repeat in float32 and state a suitable comparison tolerance for each.

## 14. Derivations to own

Reconstruct these without looking at a finished formula:

1. Orthonormal coordinates and the projection energy budget.
2. Gram–Schmidt orthogonality and both successive-span inclusions.
3. Exact equivalence of classical and modified subtraction schedules.
4. Positive-diagonal QR existence and uniqueness, with sign ambiguity when positivity is removed.
5. The QR least-squares objective split and reverse-order triangular solve.
6. The correction to R when reorthogonalizing a residual.
7. Isometry for tall Q, loss of information under Qᵀ, and the metric versions of both.

Write where each argument uses independence, positive definiteness, normalization, or exact arithmetic. Those are different assumptions.

## 15. Exercises · cumulative

**M1 · Core · mixed — the four subspaces through QR.** For full-column-rank \(A\in\mathbb R^{5\times3}\), identify \(C(A)\), \(N(A)\), \(C(A^{\mathsf T})\), and \(N(A^{\mathsf T})\) in terms of a complete QR. Give their dimensions.

**M2 · Core · paper — a different feature basis.** Let \(A\) have independent columns and \(S\) be invertible. Compare the least-squares fitted values for designs \(A\) and \(AS\), and derive the relation between their minimizing coefficient vectors.

**M3 · Core · paper — the impossible shortcut.** For \(Q=\begin{pmatrix}1&0\\0&1\\0&0\end{pmatrix}\), compute \(Q^{\mathsf T}Q\), \(QQ^{\mathsf T}\), and the projection residual of \((1,2,3)\). Explain why \(Q^{-1}\) is invalid notation for a two-sided inverse.

**M4 · Stretch · mixed — a threshold is not a theorem.** Compare Gram–Schmidt acceptance of \(I_2\) and \(10^{-13}I_2\) using absolute `tol=1e-12`. State their exact ranks and explain how a scale-aware reporting policy would improve the interpretation.

**M5 · Core · paper — normal equations through QR.** Derive \(A^{\mathsf T}A=R^{\mathsf T}R\). Explain why solving this system is algebraically consistent with the QR solve but discards its main numerical advantage.

**M6 · Stretch · paper — weighted least squares in orthonormal coordinates.** If \(A=QR\), \(Q^{\mathsf T}GQ=I\), and \(G\) is positive definite, derive the triangular system minimizing \((b-Ax)^{\mathsf T}G(b-Ax)\). State the residual condition.

**M7 · Core · mixed — duplicates survive the change of solver.** The design has two identical nonzero columns. Does replacing a normal-equations solver with the full-column-rank QR routine make the coefficient vector unique? Explain the exact geometric result and the appropriate behavior of the coding lab.

**M8 · Stretch · mixed — order and measured novelty.** For columns \(a_1=(1,0)\), \(a_2=(1,\varepsilon)\), compare the positive QR diagonals before and after reversing their order, with \(\varepsilon>0\). Explain why a diagonal entry measures novelty relative to previous columns rather than a basis-independent importance score.

## 16. Exercises · checkpoint

**K1 · Foundation · gate — coordinates and shapes.** State reduced QR shapes for a \(6\times4\) full-column-rank matrix. Give the coordinates of a projected target and the formula for its fitted value. State whether \(QQ^{\mathsf T}=I_6\).

**K2 · Core · gate — construct and certify.** Find the positive QR of \(A=\begin{pmatrix}3&1\\0&2\\0&0\end{pmatrix}\). Project \(b=(1,2,3)\) and solve the least-squares problem. Check the residual against every original column.

**K3 · Core · gate — prove the triangular solve.** Prove the QR objective split and use it to justify the unique minimizer, without forming normal equations.

**K4 · Core · gate — an audit catches the wrong guarantee.** A factorization reports relative reconstruction error \(10^{-15}\), off-diagonal overlap \(0.4\), and diagonal error \(10^{-15}\). Is it safe to substitute \(Q^{\mathsf T}b\) as orthonormal coordinates? Explain which exact step fails.

**K5 · Stretch · gate — explain the arithmetic difference.** Explain why CGS and MGS agree exactly but can differ in floating point. Describe a reproducible comparison, including a failure case and the second-pass correction to R.

**K6 · Stretch · gate — transfer to polynomials.** Under \(\langle f,g\rangle=\int_0^1fg\), orthonormalize \(1,t\). Use the resulting coordinates to recover the best degree-1 approximation to \(t^2\), and compute its squared error.

## Mastery check

You should be able to derive the factors, interpret every R entry, solve a new tall least-squares problem, and diagnose a factorization whose reconstruction is accurate but whose axes overlap. Show one written proof, one tested implementation, and one numerical failure case with a stated dtype and tolerance.

The next module studies determinants as signed volume. Householder implementation details, quantitative condition-number bounds, pivoted rank decisions, and rank-deficient minimum-norm solving remain later work. The current functions deliberately stay within their stated contracts.
