---
id: math.linear-algebra.spectral-theorem-quadratic-forms
title: Symmetric matrices, the spectral theorem and quadratic forms
prerequisites: [math.linear-algebra.eigen-invariant-subspaces]
estimated_hours: 28
answers: 07-spectral
---

# Symmetric matrices, the spectral theorem and quadratic forms

You are blindfolded on a landscape. You may choose a direction, take a step, and measure the height. Can you discover the landscape's principal axes without seeing it? Can two directions both point uphill while a direction between them points downhill? Can a perfectly flat reading conceal a saddle?

For a quadratic landscape, those questions have exact answers. A symmetric matrix is the instruction sheet; its eigenvectors are the axes; its eigenvalues tell you what happens along each axis. We will build that dictionary, prove why it works, and learn when a numerical test has said less than it appears to.

## 0. Where this is going

Four results carry this chapter: real symmetric matrices have orthonormal eigenbases; Rayleigh quotients reveal eigenvalues through constrained extrema; eigenvalue signs classify quadratic forms; and positive definiteness is equivalent to a Cholesky factorization with positive diagonal.

All matrices and vectors here are real, and orthogonality means the standard Euclidean dot product. Matrices are square unless stated otherwise. Write eigenvalues in **ascending** order, λ₁≤⋯≤λₙ, including repetitions. A symmetric matrix satisfies Aᵀ=A; an orthogonal matrix satisfies QᵀQ=I. These are different properties.

Study sections 1–8 with pencil and the linked experiment. Section 9 supplies three runnable stdlib Python tasks. The local NumPy and PyTorch exercises are experiments, not prerequisites for the proofs. The 28 hours include reconstructing arguments, implementing algorithms, and attempting the checkpoint. We use one explicitly named fact from analysis: a continuous function attains a maximum on the unit sphere. The spectral proof needs no differentiation. The final curvature application previews calculus without using it to prove the linear algebra.

## 1. Symmetry means reciprocal measurements

Aᵀ=A is more than a mirror pattern in a table. It says

$$
u^{\mathsf T}Av=(Au)^{\mathsf T}v\qquad\text{for all }u,v.
$$

The component of Av along u equals the component of Au along v. Choosing coordinate vectors recovers aᵢⱼ=aⱼᵢ, so the measurement rule and the entry rule are equivalent.

This reciprocity repairs a failure from Module 6. If S is invariant under a symmetric A, then its orthogonal complement is also invariant. Indeed, for x∈S⊥ and s∈S,

$$
s^{\mathsf T}Ax=(As)^{\mathsf T}x=0,
$$

because As∈S. There is no traffic between these perpendicular rooms in either direction. A nonsymmetric shear preserves the horizontal line but can send the vertical line into it.

If Au=λu and Av=μv, reciprocity gives (λ−μ)uᵀv=0. **Distinct eigenvalues of a symmetric matrix have orthogonal eigenspaces.** Repeated eigenvalues need care: for A=I, both (1,0) and (1,1) are eigenvectors, and they are not orthogonal. The claim is that an orthonormal eigenbasis can be *chosen*, not that arbitrary returned eigenvectors are already perpendicular.

We still owe existence: perpendicularity of eigenvectors does not itself produce even one eigenvector. That is the next section's work.

> **Practice — Foundation:** For A=[[2,1],[1,3]], compare e₁ᵀAe₂ with (Ae₁)ᵀe₂.
>
> **Hint:** Each expression reads one off-diagonal entry. Then identify which equality would fail if only a₁₂ changed.
>
> **Practice — Core:** Let A be symmetric and Aq=λq. Prove q⊥ is invariant without assuming an eigenbasis.
>
> **Hint:** For x perpendicular to q, move A across the dot product and use the single supplied eigenvector equation.
>
> **Practice — Stretch:** Give two nonorthogonal eigenvectors of a symmetric matrix, and explain why they do not contradict the distinct-eigenvalue claim.
>
> **Hint:** A scalar matrix makes every nonzero vector an eigenvector. The eigenvalues of your two vectors will coincide.

## 2. Find one axis, then reduce the room

Define the **quadratic form** \(q_A(x)=x^{\mathsf T}Ax\). Its restriction to unit vectors is a directional measurement, unaffected by how long the test arrow originally was.

**Theorem 23 — the real spectral theorem.** For every real symmetric n×n matrix A, there is a real orthogonal Q and a real diagonal Λ such that

$$
A=Q\Lambda Q^{\mathsf T}.
$$

Conversely, any matrix with such a factorization is symmetric.

*Proof, first find an axis.* The continuous function xᵀAx attains its maximum λ on the unit sphere; let q be a maximizing unit vector. For any unit v⊥q and any real t, the vector (q+tv)/√(1+t²) is unit. Maximality and symmetry give

$$
\frac{\lambda+2t\,v^{\mathsf T}Aq+t^2v^{\mathsf T}Av}{1+t^2}\le\lambda,
\qquad
2t\,v^{\mathsf T}Aq+t^2(v^{\mathsf T}Av-\lambda)\le0.
$$

If vᵀAq were nonzero, choose the sign of a sufficiently small t to make the linear term positive and larger than the quadratic term in magnitude. Contradiction. Thus Aq is perpendicular to every v⊥q, so Aq lies on q's line. Its component along q is qᵀAq=λ; hence Aq=λq.

*Then reduce.* Section 1 shows q⊥ is invariant. In any orthonormal basis of that (n−1)-dimensional space, the restricted matrix is again symmetric. Apply the same argument inductively, with dimension one as the base case. Joining those eigenvectors to q gives an orthonormal basis. Its column equations say AQ=QΛ, and Q⁻¹=Qᵀ gives the factorization. For the converse, transpose QΛQᵀ and use Λᵀ=Λ.

This proof produces real eigenvalues and enough eigenvectors together. It does not first assume distinct roots, compute a characteristic polynomial, or claim an arbitrary real matrix has a real eigenvector.

**A worked change of coordinates.** Let

$$
A=\begin{pmatrix}2&1\\1&2\end{pmatrix},\quad
q_1=\frac{(1,-1)}{\sqrt2},\quad q_2=\frac{(1,1)}{\sqrt2}.
$$

Direct multiplication gives eigenvalues 1 and 3. With Q=[q₁ q₂], the coordinates y=Qᵀx satisfy

$$
x^{\mathsf T}Ax=y_1^2+3y_2^2,\qquad \|x\|^2=y_1^2+y_2^2.
$$

Reading eigen-coordinates and taking dot products are now the same operation. Unlike a general eigenbasis, this change of coordinates preserves lengths and angles. It may include a reflection; “orthogonal” does not mean “rotation only.”

> **Practice — Foundation:** Verify Aq₁=q₁ and Aq₂=3q₂ for the displayed matrix.
>
> **Hint:** Multiply before dividing by √2. The normalization affects length, not the eigenvalue equation.
>
> **Practice — Core:** Explain why the small-t argument must permit both signs of t.
>
> **Hint:** A nonzero linear coefficient can have either sign. Choose t so their product is positive; a quadratic term cannot dominate it for every sufficiently small t.
>
> **Practice — Stretch:** Prove the converse of the spectral theorem and use it to rule out an orthogonal diagonalization of [[1,1],[0,1]].
>
> **Hint:** Transpose the proposed factorization. The triangular shear is not symmetric, even though its only eigenvalue is real.

## 3. The Rayleigh quotient is a weighted vote

For x≠0 define

$$
R_A(x)=\frac{x^{\mathsf T}Ax}{x^{\mathsf T}x}.
$$

It measures quadratic value per squared unit of length. R_A(cx)=R_A(x) for every nonzero real c. In eigen-coordinates y=Qᵀx,

$$
R_A(x)=\sum_{i=1}^n\lambda_i w_i,\qquad
w_i=\frac{y_i^2}{\sum_j y_j^2},\qquad w_i\ge0,\quad\sum_iw_i=1.
$$

The signs of y disappear; the squared fractions of length are the votes. This is why a Rayleigh reading can lie between eigenvalues without itself being an eigenvalue.

**Theorem 24 — variational characterization.** For symmetric A,

$$
\min_{x\ne0}R_A(x)=\lambda_1,\qquad
\max_{x\ne0}R_A(x)=\lambda_n.
$$

Equality at either extreme holds exactly when x lies in the corresponding extreme eigenspace. More generally,

$$
\lambda_k=\min_{\dim S=k}\ \max_{0\ne x\in S}R_A(x).
$$

*Proof.* The weighted-average formula proves the bounds and equality cases. For the second statement, any k-dimensional S intersects T=span(q_k,…,q_n) nontrivially: dim S+dim T=n+1, so a trivial intersection would exceed the ambient dimension. A nonzero x in this intersection has R_A(x)≥λ_k. Therefore the maximum over S is at least λ_k. Choosing S=span(q₁,…,q_k) attains that bound. Maxima on each subspace's unit sphere exist by the same compactness fact used earlier.

There is also a practical ladder: minimize R_A subject to being perpendicular to previously chosen q₁,…,qₖ₋₁. The next minimum is λₖ. For repeated eigenvalues, the particular orthonormal axes inside that eigenspace remain a choice.

**One measurement, two interpretations.** For unit x, R=xᵀAx is the projection coefficient of Ax onto x. Write r=Ax−Rx. Then

$$
x^{\mathsf T}r=0,\qquad
\|r\|^2=\sum_i w_i(\lambda_i-R)^2.
$$

The residual measures the spread of the eigenvalues receiving votes. Consequently at least one λᵢ satisfies |λᵢ−R|≤‖r‖. This eigenvalue proximity guarantee uses symmetry. A small residual still does not identify *which* eigenvalue or certify that a direction is close to one uniquely chosen eigenvector when eigenvalues cluster.

**Predict before calculating.** For diag(−1,1) and x=(1,1)/√2, R=0. Is x a zero eigenvector?

<details><summary>Reveal the measurement's missing information</summary>

No. Ax=(−1,1)/√2 is perpendicular to x, so the projection coefficient vanishes, but the residual has length 1. The weighted votes cancel. A zero quadratic value is not generally a zero image.

</details>

> **Practice — Foundation:** Compute R for diag(1,3) at x=(1,2), and state its two bounds.
>
> **Hint:** The eigenvalue weights are 1/5 and 4/5, not 1/3 and 2/3. Divide by squared length.
>
> **Practice — Core:** Prove the residual identity by expressing both Ax and Rx in the same orthonormal eigenbasis.
>
> **Hint:** The coefficient of r along q_i is (λ_i−R)y_i. Pythagoras turns its norm squared into a sum.
>
> **Practice — Stretch:** For diag(1,4,9), explain why every two-dimensional subspace contains a vector with Rayleigh quotient at least 4.
>
> **Hint:** Intersect it with span(e₂,e₃). Count dimensions before trying to guess a direction.

## 4. A landscape with three linked views

The laboratory builds A=Q diag(λ₁,λ₂)Qᵀ from two eigenvalue controls and an axis angle. Here subscripts name the **controlled axes**, so the two values need not stay sorted. Move the probe around the unit circle to read R; move the eigenvalues through zero to change the landscape. Sliders are keyboard accessible, and you can drag the probe directly. The second plot traces every directional reading; the dot on that curve is the same probe as in the first plot.

```lab
la-quadform
```

The solid level curves show \(q_A(x)=+1\); dashed curves show \(q_A(x)=-1\). The gray circle shows unit inputs. The zero set is shown separately when it has nonzero directions. These are **level sets of a scalar function**, not the image of the circle under A. Keep that distinction from Module 6's ellipse.

Try these experiments in order:

1. **Bowl:** keep λ₁=1 and λ₂=3. Move the probe to the shortest radius of q=1. Predict whether that axis has the smallest or largest eigenvalue, then reveal the principal axes.
2. **Rotate:** change only the axis angle. The level curves rotate and the directional trace shifts sideways. Its minimum and maximum stay the same. Entries of A change while its spectrum stays fixed.
3. **Flat valley:** set λ₂=0. The q=1 contour becomes two parallel lines, and the zero set is the whole flat axis. A vanished eigenvalue does not create an ellipse with radius zero; its radius has escaped to infinity.
4. **Saddle:** set λ₂=−1. Find a probe where R=0. Compare the zero height reading with the residual. A cancellation direction need not be a null direction.
5. **Isotropic:** make both eigenvalues equal. The trace becomes horizontal. Every direction is an eigenvector; the displayed pair of axes is merely one possible choice.
6. **Zero:** set both eigenvalues to zero. The zero set is the entire plane and both ±1 contours are empty. A blank contour plot here has a mathematical meaning, which the readout names.

For a probe at angle φ and a first eigenaxis at angle θ, the linked trace is

$$
R(\varphi)=\lambda_1\cos^2(\varphi-\theta)+\lambda_2\sin^2(\varphi-\theta).
$$

It repeats every 180°, because an arrow and its negative give the same measurement. The laboratory also reports the first Cholesky pivot a₁₁ and, when it is positive, the second pivot a₂₂−a₁₂²/a₁₁. Watch where the factorization stops as the bowl flattens. The geometric classification uses the controlled eigenvalues; rounded matrix entries and computed pivots are numerical readouts.

> **Practice — Foundation:** In the bowl preset, find the minimum and maximum readings without changing either eigenvalue.
>
> **Hint:** Move the probe onto each principal axis. The value depends on angle relative to the axes, not on the plot's horizontal direction alone.
>
> **Practice — Core:** Explain why the long axis of the q=1 ellipse belongs to the smaller positive eigenvalue.
>
> **Hint:** Along a unit eigenvector, q(tq_i)=λ_i t². Solve for the distance t needed to reach height one.
>
> **Practice — Stretch:** In the saddle preset, find two perpendicular zero-value lines. Why are neither of them the null space?
>
> **Hint:** For eigenvalues 1 and −1, the squares cancel at equal eigen-coordinate magnitudes. Both eigenvalues are nonzero, so A is invertible.

## 5. Read a quadratic form from its signs

For any real square A, the scalar xᵀAx equals its own transpose. Therefore

$$
x^{\mathsf T}Ax=x^{\mathsf T}\left(\frac{A+A^{\mathsf T}}2\right)x.
$$

Only the symmetric part contributes. The skew-symmetric part (A−Aᵀ)/2 contributes zero for every x. You may symmetrize to study a quadratic form, but that changes the linear map and can change its spectrum. For [[1,4],[0,1]], both eigenvalues are 1, yet its symmetric part [[1,2],[2,1]] has eigenvalues −1 and 3: the quadratic form takes both signs.

From now on A is symmetric. Eigen-coordinates eliminate all cross terms:

$$
q_A(x)=\lambda_1y_1^2+\cdots+\lambda_ny_n^2.
$$

| Eigenvalue signs | Name | What q does on nonzero inputs |
|---|---|---|
| All positive | Positive definite (PD) | Strictly positive |
| All nonnegative | Positive semidefinite (PSD) | Nonnegative; zero directions possible |
| All negative | Negative definite | Strictly negative |
| All nonpositive | Negative semidefinite | Nonpositive; zero directions possible |
| At least one positive and one negative | Indefinite | Takes both signs |

PD is a special case of PSD. The zero matrix is both positive and negative semidefinite. “Singular” is a rank statement; a singular form can still be indefinite in dimension three or more, for example diag(1,−1,0).

In two dimensions, positive eigenvalues give an ellipse at q=c>0 with semiaxis lengths √(c/λᵢ). Opposite signs give hyperbolas at nonzero levels; the zero level consists of two intersecting lines. For diag(λ,0), λ>0, q=c>0 is two parallel lines, q=0 is one line, and negative levels are empty. For a negative definite form the analogous ellipses occur at negative levels. In a positive definite form q=0 contains only the origin.

**A stronger zero statement needs a sign hypothesis.** For PSD A,

$$
x^{\mathsf T}Ax=0\iff Ax=0.
$$

Every λᵢyᵢ² is nonnegative, so a zero sum forces yᵢ=0 wherever λᵢ>0. That is exactly the condition Λy=0. For an indefinite form, cancellation breaks the inference.

A general coordinate substitution x=Ty changes the form to yᵀ(TᵀAT)y. This is **congruence**, not the similarity T⁻¹AT that describes the operator in new coordinates. They coincide for orthogonal T. General congruence need not preserve eigenvalues: I becomes diag(4,1) under T=diag(2,1). It does preserve the counts of positive, negative, and zero eigenvalues, called the **inertia**. To see why, the number of positive eigenvalues is the largest dimension of a subspace on which q is positive definite: the positive eigenspace attains it, and a larger subspace must meet the nonpositive eigenspace. Invertible T preserves such dimensions; apply the same reasoning to negative directions, then subtract from n for the zero count.

> **Practice — Foundation:** Classify diag(2,0,−1). Is singular the same as semidefinite?
>
> **Hint:** Test the first and third coordinate vectors separately. A zero eigenvalue does not erase the other two signs.
>
> **Practice — Core:** Prove that PSD plus xᵀAx=0 implies Ax=0, then give an indefinite counterexample.
>
> **Hint:** Use a sum of nonnegative eigen-coordinate terms for the proof. Use diag(1,−1) and equal coordinates for the counterexample.
>
> **Practice — Stretch:** Find the symmetric part of [[1,4],[0,1]] and a direction where its quadratic form is negative, despite the original matrix's positive eigenvalues.
>
> **Hint:** Try x=(1,−1). Symmetrizing preserves xᵀAx but does not preserve the original matrix's eigenvalues.

## 6. Positive definite means an invertible change of lengths

**Theorem 25 — equivalent certificates of positive definiteness.** For real symmetric A, these are equivalent:

- xᵀAx>0 for every x≠0;
- all eigenvalues are strictly positive;
- A=BᵀB for some invertible square B.

*Proof.* The eigen-coordinate sum proves the first equivalence, including necessity by testing eigenvectors. If λᵢ>0, let B=Λ¹ᐟ²Qᵀ; then BᵀB=A and B is invertible. Conversely, xᵀBᵀBx=‖Bx‖²>0 for x≠0 when B is invertible.

This also constructs the symmetric positive definite square root A¹ᐟ²=QΛ¹ᐟ²Qᵀ. The factor B above and the symmetric square root are different matrices, both providing squared-length representations. For PSD A the same construction works with zero eigenvalues, but the square root is singular and some lengths collapse.

Every Gram matrix XᵀX is PSD because vᵀXᵀXv=‖Xv‖². It is PD exactly when X has independent columns. Thus Module 3's metric xᵀGy is an inner product precisely when symmetric G is PD: xᵀGx supplies a strictly positive squared length. A semidefinite G is insufficient because distinct vectors can be distance zero apart.

The spectral bounds also say

$$
\lambda_1\|x\|^2\le x^{\mathsf T}Ax\le\lambda_n\|x\|^2.
$$

For PD A, λ₁ is the weakest stiffness. As it approaches zero, motion in that direction becomes cheaper; inverse eigenvalues 1/λᵢ grow. That is the geometric seed of conditioning, which Module 9 develops quantitatively.

**Two tempting shortcuts fail.** Positive diagonal entries are only coordinate-axis tests. The symmetric matrix [[1,2],[2,1]] has positive diagonal but is indefinite. Positive determinant says the product of eigenvalues is positive: −I in two dimensions passes that test and is negative definite. A finite collection of random positive directional readings is also not a proof of PD; it can miss a narrow set of negative directions.

> **Practice — Foundation:** Show that X=[[1,1],[2,2]] gives a PSD Gram matrix, and supply one nonzero vector with zero Gram length.
>
> **Hint:** A null vector of X is also a zero-length vector for XᵀX. The two columns are equal.
>
> **Practice — Core:** For diag(1,9), give its symmetric PD square root and the semiaxis lengths of xᵀAx=1.
>
> **Hint:** Square roots of eigenvalues build the factor; reciprocal square roots build the contour radii.
>
> **Practice — Stretch:** Explain why positive diagonal plus positive determinant is sufficient for symmetric 2×2 matrices but insufficient in dimension three.
>
> **Hint:** In 2D complete the square using a₁₁>0. In 3D try a symmetric matrix with diagonal 1 and every off-diagonal entry 2.

## 7. Cholesky: pay for one square at a time

Eigenvalues explain positive definiteness; a Cholesky factorization usually tests it more directly for a dense symmetric matrix. We seek a lower-triangular L with **positive diagonal** such that A=LLᵀ.

Start with A=[[a,b],[b,c]]. Completing the square gives

$$
ax_1^2+2bx_1x_2+cx_2^2
=a\left(x_1+\frac ba x_2\right)^2
+\left(c-\frac{b^2}{a}\right)x_2^2\quad(a>0).
$$

The second pivot c−b²/a is what remains after paying for the first square. Hence

$$
L=\begin{pmatrix}\sqrt a&0\\b/\sqrt a&\sqrt{c-b^2/a}\end{pmatrix}.
$$

For A=[[4,2],[2,3]], L=[[2,0],[1,√2]]. For [[1,2],[2,1]], the first pivot is 1 but the second is −3. The two positive diagonal entries could not pay for the coupling between coordinates.

**Theorem 26 — Cholesky criterion.** A real symmetric matrix is PD exactly when it admits A=LLᵀ with lower-triangular L and positive diagonal. That L is unique.

*Proof.* For a PD block matrix

$$
A=\begin{pmatrix}a&r^{\mathsf T}\\r&C\end{pmatrix},
$$

a>0 by testing e₁. For any nonzero z, insert x=(−rᵀz/a,z) into xᵀAx. Positivity gives zᵀ(C−rrᵀ/a)z>0. The remaining symmetric matrix is therefore PD. Inductively factor it as MMᵀ, then set L=[[√a,0],[r/√a,M]]. Multiplication verifies LLᵀ=A. Conversely, positive triangular diagonal makes L invertible, and xᵀAx=‖Lᵀx‖²>0 for x≠0. The first column of L is forced by √a and r/√a, and induction forces the remaining block, proving uniqueness.

Matching entries gives the implementation, with j increasing and i>j:

$$
p_j=a_{jj}-\sum_{k<j}l_{jk}^2,\quad
l_{jj}=\sqrt{p_j},\quad
l_{ij}=\frac{a_{ij}-\sum_{k<j}l_{ik}l_{jk}}{l_{jj}}.
$$

In exact arithmetic, a nonpositive pivot stops this positive-diagonal factorization. A zero pivot may represent a valid PSD matrix; it still fails the **PD** test. Some PSD matrices admit triangular factors with zero diagonal, but those require separate handling and are outside this task. Do not take an absolute value inside the square root or silently add a diagonal shift to make the test pass: either changes the claim.

For a small 2×2, a>0 and det(A)>0 are equivalent to positive pivots because p₂=det(A)/a. In general, Cholesky gives the **leading principal minor criterion**: A is PD iff the determinants of its top-left k×k blocks are positive for every k. Necessity follows by restricting to coordinate subspaces; sufficiency follows inductively from the block determinant det(A)=a det(C−rrᵀ/a), applied to each leading block. Computing all those determinants is not the algorithm we recommend. Nonnegative *leading* minors alone do not characterize PSD: diag(0,−1) has leading determinants 0,0 but is not PSD.

**Our numerical contract.** The coding labs require entries to be exactly symmetric after conversion to floats; they do not silently average unequal triangles. They reject a computed pivot p_j≤tol·s, where s=max|aᵢⱼ| and tol>0. This scale-relative cutoff avoids calling a tiny multiple of I indefinite merely because its units are small. It can still reject an exactly PD matrix with a small pivot relative to s. A failed threshold test means **not accepted at this tolerance**, not a proof of a negative eigenvalue. A successful factorization is numerical evidence: audit LLᵀ−A as well. No arbitrary tolerance makes floating-point arithmetic an exact definiteness oracle.

> **Practice — Foundation:** Compute the two pivots and L for [[4,2],[2,3]].
>
> **Hint:** The off-diagonal factor is 2/√4=1; subtract its square from the second diagonal entry.
>
> **Practice — Core:** In the block proof, why choose the first coordinate −rᵀz/a?
>
> **Hint:** It makes the completed first square zero, isolating the remaining quadratic form on z.
>
> **Practice — Stretch:** At tol=10⁻¹², compare the lab's decisions on 10⁻¹⁴I and diag(1,10⁻¹⁴). Are either matrices mathematically non-PD?
>
> **Hint:** Compute s separately for each matrix. The test compares a pivot to a relative scale, not to a universal absolute number.

## 8. Covariance, curvature, and a bounded bowl

**Covariance is a Gram story.** Let X contain m centered observation rows. Define the empirical covariance C=XᵀX/m (the alternative sample convention uses m−1 when m>1). For a direction v,

$$
v^{\mathsf T}Cv=\frac1m\sum_{i=1}^m(X_i v)^2.
$$

This is the average squared projected observation, so C is PSD. The Rayleigh maximum selects the unit direction of greatest empirical variance. Centering makes the rows sum to zero, so rank(X)≤m−1; if the number of features exceeds m−1, C cannot be PD. “Covariance matrix” does not promise an inverse. Module 8 develops PCA and the SVD from this starting point; probability supplies the population interpretation.

**An optimization problem without calculus.** Let f(x)=½xᵀAx−bᵀx with symmetric PD A, and solve Ax★=b. Expand around x★:

$$
f(x)=f(x_\star)+\frac12(x-x_\star)^{\mathsf T}A(x-x_\star).
$$

The linear terms cancel, so x★ is the unique global minimizer. With a Cholesky factor, solve Ly=b and then Lᵀx★=y; do not construct A⁻¹ just to apply it.

If A is PSD and singular, two different outcomes are possible. If b∈range(A), a solution exists and all minimizers form x★+ker(A). If b∉range(A), some z∈ker(A) has bᵀz≠0, since range(A)=ker(A)⊥ for symmetric A. Along tz the quadratic term vanishes and f(tz)=−t bᵀz is unbounded below in one direction. A flat direction is harmless only if the linear term does not tilt it. If A is indefinite, a negative eigenvector already gives an unbounded-below ray for this unconstrained quadratic, whatever b is.

**A calculus preview, with its assumptions.** For a twice continuously differentiable scalar loss, its Hessian H is symmetric and

$$
f(x+h)=f(x)+\nabla f(x)^{\mathsf T}h+\tfrac12h^{\mathsf T}H(x)h+o(\|h\|^2).
$$

Here the gradient contains first derivatives; the Hessian contains second derivatives; the final term divided by ‖h‖² tends to zero as h→0. At a stationary point (gradient zero), PD H gives a strict local minimum. Indefinite H gives a saddle. PSD H alone is inconclusive: x⁴+y⁴ has a strict minimum at the origin, while x⁴−y⁴ has a saddle, and both Hessians are zero there. Thus PD is a sufficient condition for a locally strict quadratic bowl, not a requirement for every optimizer or every minimum. See [calculus and optimization](../03-optimization/01-calculus-gradients-optimization.md) for the derivative arguments.

Finally, adding αI shifts every eigenvalue by α. A+αI is PD exactly when λ₁+α>0. A shift can repair a quadratic model, but it changes the model. In an implementation, record it rather than presenting the shifted matrix's factor as a factor of the original.

> **Practice — Foundation:** Why is XᵀX PSD even if X is rectangular or has dependent columns?
>
> **Hint:** Evaluate its quadratic form as a squared Euclidean norm. Strict positivity requires an extra condition on the null space.
>
> **Practice — Core:** For A=diag(2,0), compare the minimizers of ½xᵀAx−bᵀx for b=(2,0) and b=(2,1).
>
> **Hint:** Write the function as x₁²−2x₁−b₂x₂. The second coordinate is either free or a direction of unlimited descent.
>
> **Practice — Stretch:** A report says “the Hessian is PSD, so this stationary point is a strict local minimum.” Refute it with two smooth losses having the same Hessian there.
>
> **Hint:** Fourth-degree terms disappear from the Hessian at zero but can determine opposite behaviors near zero.

## 9. Three runnable coding labs

All tasks use Python lists of rows and only the standard library. Preserve inputs and raise ValueError for malformed shapes, non-finite or boolean data. Shared validation helpers are supplied in the browser. These are small teaching algorithms; they are not a replacement for library factorizations on large or difficult arrays.

### Lab A — a directional meter

Open [Rayleigh quotient](../../labs/exercises.py). Implement `rayleigh_quotient(matrix, vector)` for a nonempty square matrix and matching nonzero vector. Return xᵀAx/(xᵀx), a scalar. Symmetry is **not required to compute the expression**; only our spectral interpretation requires it. Normalize x by its largest absolute entry and then its Euclidean length; likewise scale A by its largest absolute entry during the computation and restore the final units. This avoids squaring enormous original coordinates. A zero matrix returns zero; reject a non-finite final result. Compare proportional vectors, a saddle's zero reading, and a nonsymmetric input.

### Lab B — a constructive certificate

Open [Cholesky factorization](../../labs/exercises.py). Implement `cholesky(matrix, tol=1e-12)`, returning a full list-of-rows lower-triangular L with positive diagonal. Require exact symmetry of the validated entries and positive finite tol, excluding booleans. Use the recurrence in section 7, rejecting every computed pivot ≤tol·max|aᵢⱼ| with ValueError. The zero matrix must fail. Reject non-finite arithmetic as well. Reconstruct LLᵀ, and compare PD, indefinite, singular PSD, and small-scale PD inputs. A rejection must never be repaired by taking the square root of an absolute value.

### Lab C — a verdict with a stated scope

Open [positive-definiteness test](../../labs/exercises.py). Implement `is_pd(matrix, tol=1e-12)`. Return True exactly when the same pivot test accepts, and False for symmetric finite matrices it rejects on a pivot. Invalid data, nonsymmetry, invalid tolerance, or non-finite arithmetic must raise ValueError, not return False. The supplied `_validated_symmetric` helper checks input and tolerance; implement the pivot loop so mathematical rejection is distinguished from invalid arithmetic. A bare `except ValueError: return False` erases that distinction.

The name is convenient; its contract is a **numerical acceptance test**, not an exact yes/no theorem on arbitrary real data. At the default tolerance, diag(1,10⁻¹⁴) returns False even though it is PD. Decreasing tolerance can change the report and cannot remove roundoff. Document that distinction in your function.

Run `python -m labs.checks rayleigh-quotient`, `python -m labs.checks cholesky`, and `python -m labs.checks is-pd`. Add `--reference` after attempting your implementation to check the supplied solutions.

## 10. Exercises · by hand

**A1 · Foundation · paper — reciprocal entries.** For A=[[2,1],[1,3]], u=(1,0), and v=(0,1), compute uᵀAv and (Au)ᵀv. State the property these measurements illustrate.

**A2 · Core · paper — two rooms stay separate.** Prove that the orthogonal complement of an invariant subspace of a real symmetric matrix is invariant. Identify the step that fails for a nonsymmetric matrix.

**A3 · Core · paper — diagonalize a landscape.** For A=[[2,1],[1,2]], use q₁=(1,−1)/√2 and q₂=(1,1)/√2. Give the eigenvalues in that order, the eigen-coordinates of x=(2,0), and xᵀAx.

**A4 · Core · paper — weighted votes.** For A=diag(1,3) and x=(1,2), compute R_A(x) and the squared residual of the normalized vector. Is R_A(x) an eigenvalue?

**A5 · Core · paper — zero height is not zero image.** For A=diag(1,−1) and x=(1,1), compute xᵀAx and Ax. State an additional hypothesis under which zero quadratic value would imply zero image, and prove it.

**A6 · Foundation · paper — read the contour radii.** For A=diag(1,9), give the positive intercepts of xᵀAx=1 on the two coordinate axes. Which axis has greater stiffness?

**A7 · Core · paper — a determinant trap.** Give one symmetric 2×2 matrix with positive determinant that is not PD, and one with positive diagonal entries that is indefinite. Explain why each shortcut fails.

**A8 · Core · paper — complete the squares.** Compute the Cholesky pivots and lower-triangular factor for A=[[4,2],[2,3]]. Verify its product and express xᵀAx as a sum of two squares.

**A9 · Core · paper — invisible skew.** Find the symmetric part of A=[[1,4],[0,1]]. Give its ascending eigenvalues and evaluate xᵀAx at x=(1,−1). Why do A's own eigenvalues not classify this quadratic form?

**A10 · Stretch · paper — the middle eigenvalue without a polynomial.** For A=diag(1,4,9), prove min over all planes S of max over nonzero x in S of R_A(x)=4. Supply a plane attaining the minimum.

**A11 · Stretch · paper — existence before orthogonality.** Reconstruct the spectral theorem's maximum-on-the-sphere proof. Explain why proving distinct eigenvectors are orthogonal is not already a proof of the theorem.

**A12 · Stretch · paper — same inertia, different spectrum.** Let A=I₂ and T=diag(2,1). Compute TᵀAT and T⁻¹AT. Explain which describes a transformed quadratic form and why its eigenvalues can change without its inertia changing.

## 11. Exercises · NumPy

Use float64 arrays. `np.linalg.eigh` is the symmetric eigensolver. Check symmetry yourself before calling it: a routine that reads one triangle cannot validate agreement between both triangles for you. Compare equations, residuals, and subspaces rather than chosen eigenvector signs.

**B1 · Foundation · NumPy — audit the factorization.** Use `np.linalg.eigh` on [[2,1],[1,2]]. Report ascending eigenvalues, ‖AQ−QΛ‖, ‖QᵀQ−I‖, and ‖A−QΛQᵀ‖. Explain what each residual checks.

**B2 · Core · NumPy — a sweep is evidence.** Sample 721 equally spaced angles over one full turn for A=[[2,1],[1,2]]. Compare sampled Rayleigh extrema with eigenvalues; compute every eigen-coordinate weight. Repeat after rotating A by an arbitrary angle and explain why the sampled extrema need not be exact.

**B3 · Core · NumPy — test the threshold's meaning.** At tol=10⁻¹², compare your Cholesky acceptance on 10⁻¹⁴I₂, diag(1,10⁻¹⁴), [[1,1],[1,1]], and [[1,2],[2,1]]. Compare with library Cholesky and actual eigenvalues. Explain any different decisions without calling every rejection indefinite.

**B4 · Core · NumPy — covariance has a forced null direction.** Center the rows of X=[[1,0,2],[0,1,2],[1,1,4]]. Form C=XᵀX/3 after centering. Give its rank and one exact nonzero null direction. Verify that the Rayleigh maximum equals its largest eigenvalue.

**B5 · Stretch · NumPy — positive diagonal can hide a saddle.** For the 3×3 matrix with diagonal 1 and all off-diagonal entries 2, compute the ascending eigenvalues, determinant, and first two leading principal minors. Refute the rule “positive diagonal and determinant imply PD in every dimension.”

## 12. Exercises · PyTorch

**C1 · Foundation · PyTorch — a batch of landscapes.** In float64, use `torch.linalg.eigh` on a batch containing diag(1,3), diag(1,0), diag(1,−1), and the zero matrix. Classify each from all its eigenvalue signs; explain why a zero eigenvalue is not itself evidence of a saddle.

**C2 · Core · PyTorch — flat or tilted.** For A=diag(2,0), evaluate f(x)=½xᵀAx−bᵀx along x=(1,t), t=−10,0,10. Compare b=(2,0) and b=(2,1). Report both sequences and interpret the set of minimizers or absence of a lower bound.

**C3 · Core · PyTorch — shifts change the model.** For A=[[1,2],[2,1]], compare the eigenvalues after adding αI for α=0,1,1.1. Find the strict condition on α for PD, and explain why equality at the boundary is insufficient.

**C4 · Stretch · PyTorch — repeated axes are not identifiable.** For A=diag(1,1,4), rotate the first two columns of an orthonormal eigenbasis by angle 0.37. Verify both eigenbases, then compare their first columns and the projectors onto their first two columns. What should a regression test compare?

## 13. Derivations to own

1. Prove reciprocity, orthogonality of distinct eigenspaces, and invariance of orthogonal complements.
2. Find one eigenvector by a sphere maximum, then prove the spectral theorem inductively.
3. Derive the Rayleigh weighted-average and residual identities, the extreme bounds, and the k-dimensional min–max formula.
4. Classify quadratic forms from eigenvalue signs; explain the PSD-only implication from zero value to null vector.
5. Prove the Gram and Cholesky characterizations of PD; derive the pivot recurrence by matching entries.
6. Complete the square for an unconstrained quadratic, including the flat-direction compatibility condition.

## 14. Exercises · cumulative

**M1 · Core · paper — projection already knows the theorem.** Let P be the orthogonal projector onto span((1,1)). Give its matrix and ascending eigenvalues. Express xᵀPx as a squared length; classify I−P and identify its null space.

**M2 · Core · paper — QR predicts Cholesky.** If X has independent columns and thin QR factorization X=QR with positive diagonal R, prove XᵀX=RᵀR. Which matrix is the Cholesky factor? Explain why this identity is not an instruction to solve least squares through normal equations.

**M3 · Core · paper — solve a bowl.** For A=[[4,2],[2,3]] and b=(6,5), use two triangular solves to find the minimizer of ½xᵀAx−bᵀx. Give the minimum value and prove uniqueness without differentiation.

**M4 · Core · paper — recurrence with symmetry.** For symmetric A with all eigenvalues of magnitude at most 0.8, prove ‖Aᵏx‖≤0.8ᵏ‖x‖. Explain why the transient amplification from Module 6 cannot occur under this hypothesis.

**M5 · Stretch · paper — a metric changes symmetry's entry test.** Let G be symmetric PD and GA=AᵀG. Prove B=G¹ᐟ²AG⁻¹ᐟ² is symmetric, deduce real eigenvalues for A, and explain how to choose its eigenvectors G-orthonormally.

**M6 · Stretch · mixed — a covariance audit.** A centered dataset has five observations and eight features. A report claims its empirical covariance has eight strictly positive eigenvalues, “because every feature has nonzero variance.” Give the largest possible rank and smallest possible nullity, and explain what to inspect in the report.

## 15. Exercises · checkpoint

**K1 · Foundation · gate — read the axes.** For A=[[3,1],[1,3]], give ascending eigenvalues, one orthonormal eigenbasis, and the long and short semiaxis lengths of xᵀAx=1. Explain the inverse relation between radius and eigenvalue.

**K2 · Core · gate — defend the geometric guarantee.** Prove the real spectral theorem, naming the existence fact used and explaining how the induction preserves symmetry. State why repeated eigenvalues cause no defect.

**K3 · Core · gate — diagnose three zero readings.** Compare A=diag(1,−1) at x=(1,1), B=diag(1,0) at x=(0,1), and C=0 at any nonzero x. Each has zero quadratic value. Give the images and explain which zero sets are null spaces.

**K4 · Core · gate — construct and audit a certificate.** Factor A=[[9,3],[3,2]] by Cholesky, giving its pivots and L. Explain exactly what this certifies in exact arithmetic, and what extra qualifications accompany a floating-point, tolerance-based test.

**K5 · Stretch · gate — a bounded optimization claim.** For A=diag(2,0), decide whether f(x)=½xᵀAx−bᵀx has a minimizer for b=(4,0) and b=(4,1). Give every minimizer or a direction showing unboundedness. State the general PSD compatibility criterion.

**K6 · Stretch · gate — recover a missing axis variationally.** A symmetric 3×3 matrix has ascending eigenvalues 1,4,9. Without choosing its entries, prove that every plane contains a nonzero vector of Rayleigh quotient at least 4 and that some plane has no quotient greater than 4. If a unit probe has R=3.9 and residual norm 0.2, what eigenvalue-proximity statement is justified? Does that alone identify a unique signed eigenvector?

## Mastery check

Given an unfamiliar symmetric matrix, connect an orthonormal basis, directional readings, contour geometry, eigenvalue signs, and a constructive PD test. Show why each conclusion follows, and identify the exact point where it would fail without symmetry or definiteness. Keep exact theorems, sampled plots, and tolerance-based decisions separate.

**What to bring to Module 8:** a symmetric Gram matrix is PSD; its null directions are the original map's null directions; and its orthonormal eigenvectors separate squared lengths. The SVD will use those facts to describe rectangular maps, then make low-rank approximation and PCA precise.
