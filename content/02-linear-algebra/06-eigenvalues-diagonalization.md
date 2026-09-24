---
id: math.linear-algebra.eigen-invariant-subspaces
title: Eigenvalues, invariant subspaces and diagonalization
prerequisites: [math.linear-algebra.determinants-volume]
estimated_hours: 30
answers: 06-eigen
---

# Eigenvalues, invariant subspaces and diagonalization

Put an arrow through the same machine again and again. Most arrows turn as well as stretch. A few stay on their original line. Sometimes no real line survives, yet a whole plane does. Sometimes every arrow eventually shrinks, after first becoming alarmingly large. This chapter teaches you to tell those stories apart.

## 0. Where this is going

Four results organize the work: invariant subspaces isolate pieces of a map; eigenvalues locate invariant lines through a singularity condition; an eigenvector basis turns iteration into scalar powers; and the spectral radius decides eventual decay, while leaving room for temporary growth.

We start over the real numbers and explicitly announce when complex coordinates are needed. Matrices are square, vectors are columns, and Python matrices are lists of rows. An eigenvector is **never zero**. A zero eigenvalue is allowed. The word **direction** here usually means an unoriented line: an arrow and its negative describe the same line.

Study sections 1–9 in order, predict before revealing, and use each static hint only after attempting its prompt. Section 10 supplies three runnable stdlib Python tasks; NumPy and PyTorch tasks run locally. Thirty hours includes proofs, experiments, coding, and the checkpoint. Symmetry, the spectral theorem, and quadratic-form optimization belong to Module 7; we will not assume them to justify claims about arbitrary matrices.

## 1. A room the machine cannot leave

A subspace S is **invariant under A** when every vector in S is sent back into S:

$$
x\in S\quad\Longrightarrow\quad Ax\in S.
$$

Think of S as a room with its own internal dynamics. Starting there means staying there, for one step and therefore for every step. This does not say that each vector stays fixed, that lengths stay fixed, or that A maps S *onto* all of S. The zero map leaves every subspace invariant by sending it into the origin.

For a basis matrix \(B=[b_1\ \cdots\ b_r]\) of S, invariance has a checkable form:

$$
AB=BC
$$

for some r×r matrix C. Each column of AB must be expressible in B's basis. If \(x=Bc\), then \(Ax=BCc\): C is the smaller machine acting on coordinates inside the room. By induction, \(A^kB=BC^k\).

Extend B to a full basis \(T=[B\ D]\). In these coordinates,

$$
T^{-1}AT=\begin{pmatrix}C&E\\0&F\end{pmatrix}.
$$

The lower-left zero is the statement that nothing starting in S escapes it. The upper-right E allows vectors from the chosen complement to enter S. A complementary subspace exists by extending a basis, but an **invariant** complement is an additional requirement.

**A plane before a line.** For

$$
A=\begin{pmatrix}0&-1&0\\1&0&0\\0&0&2\end{pmatrix},
$$

the xy-plane is invariant: it rotates by a quarter-turn. The z-axis is invariant: it stretches by 2. There is no real invariant line inside the xy-plane. An invariant subspace can be useful even when it contains no real eigenvector.

> **Practice — Foundation:** For \(A=\begin{pmatrix}0&-1&0\\1&0&0\\0&0&2\end{pmatrix}\), compute \(A(s,t,0)\) and show that the xy-plane stays invariant.
>
> **Hint:** Apply A to an arbitrary vector (s,t,0), not merely one selected point, and check the third output coordinate.
>
> **Practice — Core:** For \(A=\begin{pmatrix}2&1\\0&3\end{pmatrix}\), which coordinate axes are invariant?
>
> **Hint:** Read the images of the coordinate vectors from the columns. The first axis stays inside itself; the second receives a horizontal component.
>
> **Practice — Stretch:** For the 3×3 A above and \(B=[e_1\ e_2]\), find the 2×2 C with AB=BC. Then prove that AB=BC for some C is equivalent to invariance of range(B) when B has independent columns.
>
> **Hint:** Here Ae₁=e₂ and Ae₂=−e₁ give C's columns. In general express each Ab_j in the basis B; for the reverse implication, write an arbitrary vector in S as Bc.

## 2. An eigenvector is an invariant room of dimension one

For nonzero v, its line is invariant exactly when

$$
Av=\lambda v.
$$

The scalar λ is an **eigenvalue**. Positive λ preserves the arrow's sense, negative λ reverses it, and λ=0 collapses it. Thus “fixed ray” would miss negative eigenvalues; **invariant line** is the reliable phrase.

For a particular λ, all solutions form the **eigenspace**

$$
E_\lambda=\ker(A-\lambda I).
$$

This subspace includes zero; its nonzero elements are eigenvectors. Eigenspaces for different eigenvalues intersect only at zero: if Av=λv=μv and λ≠μ, then v=0. It does not follow that they are perpendicular.

Take \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\). The vectors \(v_1=(1,0)\), \(v_2=(-1,1)\) satisfy Av₁=2v₁ and Av₂=v₂. They are independent but not orthogonal. A generic vector mixes these two behaviors.

**Theorem 19 — distinct eigenvalues give independent eigenvectors.** Eigenvectors belonging to pairwise distinct eigenvalues are linearly independent.

*Proof.* If not, choose a dependent list of minimal length m. Its relation \(\sum_{i=1}^m c_i v_i=0\) has every c_i nonzero. Apply A and subtract λ_m times the original relation. This gives \(\sum_{i=1}^{m-1}c_i(\lambda_i-\lambda_m)v_i=0\), a shorter nontrivial dependence. That contradicts minimality. A list of length one cannot be dependent because an eigenvector is nonzero.

> **Practice — Foundation:** For \(\operatorname{diag}(-2,0)\), describe what happens to each coordinate line.
>
> **Hint:** A zero output does not disqualify the nonzero input as an eigenvector. Only the eigenvector itself must be nonzero.
>
> **Practice — Core:** For \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\), find both eigenspaces and compute the dot product of their basis vectors.
>
> **Hint:** Solve one homogeneous system per eigenvalue. Independent directions need not be perpendicular.
>
> **Practice — Stretch:** Run the proof of Theorem 19 on \(A=I_2\) with eigenvectors \(v_1=(1,0)\), \(v_2=(2,0)\), both for eigenvalue 1, and the relation \(2v_1-v_2=0\). Identify exactly where the proof breaks and which step uses distinctness.
>
> **Hint:** Applying A and subtracting 1 times the relation leaves the coefficient \(c_1(\lambda_1-\lambda_2)=0\). The shortened relation must still contain a nonzero coefficient, which needs every factor λ_i−λ_m≠0.

## 3. Hunt for a line before asking for a number

Drag the two column tips of A. The gray circle is the set of unit inputs; its colored image is the set of outputs. Move the **probe angle** and compare the probe v with Av. The laboratory draws complete invariant lines only after you reveal them. Matrix-entry inputs provide keyboard access to the same experiment. The drawing fits large outputs by scaling all displayed vectors together; the readout always uses original coordinates.

```lab
la-eigen
```

The readout uses the scalar

$$
\widehat\lambda=v^{\mathsf T}Av,\qquad
r=Av-\widehat\lambda v,\qquad \|v\|=1.
$$

This λ̂ minimizes \(\|Av-tv\|\) over real t by the projection theorem. A zero residual certifies an eigenpair in exact arithmetic. A small computed residual is evidence of approximate alignment, not an exact theorem or a guarantee that λ̂ is close to an eigenvalue for every matrix. The variational interpretation of this quotient for symmetric matrices comes next chapter.

Try **two lines**, **flip**, **shear**, **scalar**, **rotation**, and **collapse**. Predict how many real invariant lines exist before revealing them. A scalar matrix has infinitely many; a nontrivial shear has just one. A rotation through 90° has none. Collapse still has a zero-eigenvalue line: its image is a point, so the picture must explain why there is no output arrow.

The complex-pair preset is a true rotation in ordinary Euclidean coordinates. A general real 2×2 matrix with a complex pair is similar to a rotation combined with scaling; if its change of basis is not orthogonal, its ordinary picture need not look like a rigid rotation.

<details><summary>Predict: are the longest axes of the output ellipse always eigenvectors?</summary>

No. An eigenvector compares an input with its own output: Av must lie on the input line. The long axis of the output ellipse answers a different question about output length. For a shear, the sole eigenline is horizontal, while the longest output direction is tilted. Module 8 will give those length questions their own directions, the singular vectors.

</details>

> **Practice — Foundation:** The flip preset is \(\operatorname{diag}(-2,1)\). Compute its image of the horizontal probe (1,0). Does the arrow stay fixed, or does its line stay invariant?
>
> **Hint:** Compare the sign of the horizontal output with the input. Negative scaling reverses the arrow but preserves its span.
>
> **Practice — Core:** The shear preset is \(\begin{pmatrix}1&1\\0&1\end{pmatrix}\) and the scalar preset is I; both have eigenvalues 1, 1. Compute the null space of A−I for each and explain their different numbers of eigenlines.
>
> **Hint:** Compare the null spaces of A−I. The roots alone do not tell you the dimension of the solution set.
>
> **Practice — Stretch:** For \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\) and unit \(v=(0,1)\), minimize \(\|Av-tv\|^2\) over t and give the minimizer and the residual. Then derive \(\widehat\lambda=v^{\mathsf T}Av\) in general without assuming A is symmetric.
>
> **Hint:** Av=(1,1), so \(\|Av-tv\|^2=1+(1-t)^2\). In general decompose Av into its projection onto span(v) and a perpendicular residual, as in Module 3.

## 4. The polynomial is a certificate, not a large-scale algorithm

A nonzero solution to \((\lambda I-A)v=0\) exists exactly when that matrix is singular. Module 5 therefore gives

$$
p_A(t)=\det(tI-A),\qquad p_A(\lambda)=0.
$$

We use the **monic** convention det(tI−A). For \(A=\begin{pmatrix}a&b\\c&d\end{pmatrix}\),

$$
p_A(t)=t^2-(a+d)t+(ad-bc).
$$

Thus trace \(\operatorname{tr}A=a+d\) is the sum of the two roots, and determinant is their product, counting multiplicity. The discriminant is \(\Delta=(a-d)^2+4bc\): positive gives two distinct real roots, zero a repeated real root, negative a conjugate complex pair.

**Work the geometry and algebra together.** For \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\), p(t)=t²−3t+2. Its roots are 2 and 1. Finding roots is only half the work: solve the two null-space problems to recover the lines from section 2.

Similarity preserves the polynomial:

$$
\det(tI-T^{-1}AT)=\det\bigl(T^{-1}(tI-A)T\bigr)=\det(tI-A).
$$

In general dimension the permutation expansion shows that the coefficient of tⁿ⁻¹ is −tr(A) and the constant term is (−1)ⁿdet(A). Factoring the polynomial over the complex numbers and comparing coefficients proves the corresponding sum/product identities. This uses the fundamental theorem of algebra; it does not require diagonalizability.

Do not form polynomial coefficients and find their roots as your general numerical eigensolver. Coefficient formation can introduce cancellation, and clustered roots can respond sharply to small coefficient changes. Even the 2×2 quadratic formula can lose accuracy by subtracting nearly equal numbers. We use it as a small teaching tool; production algorithms instead work directly with matrices, with QR-based and Krylov methods introduced in Module 13. A large determinant magnitude is not an eigenpair accuracy test.

> **Practice — Foundation:** Find p(t), trace, and determinant for \(\begin{pmatrix}3&2\\0&-1\end{pmatrix}\).
>
> **Hint:** Triangular matrices make the determinant of tI−A a product of its diagonal entries.
>
> **Practice — Core:** Compute the characteristic polynomials of I and \(J=\begin{pmatrix}1&1\\0&1\end{pmatrix}\), then their images of e₂. Must two matrices with the same characteristic polynomial act identically on all vectors?
>
> **Hint:** Both polynomials are (t−1)², but Ie₂=e₂ while Je₂=(1,1). The polynomial forgets the off-diagonal coupling.
>
> **Practice — Stretch:** For \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\) and \(T=\begin{pmatrix}0&1\\1&0\end{pmatrix}\), compute the characteristic polynomials of A, AT, and \(T^{-1}AT\). Then prove similarity invariance of p_A and explain why multiplying A on the right by T alone is not enough.
>
> **Hint:** AT=[[1,2],[1,0]] has trace 1 and determinant −2, unlike A. The cancellation of det(T) requires the inverse on the left as well.

## 5. Diagonalization means finding enough independent rooms

**Theorem 20 — eigenbasis criterion.** A matrix A over a chosen field is diagonalizable over that field exactly when it has a basis of eigenvectors over that field. If their columns form V and their eigenvalues form Λ, then

$$
AV=V\Lambda,\qquad A=V\Lambda V^{-1},\qquad A^k=V\Lambda^kV^{-1}\quad(k\ge0).
$$

*Proof.* The jth column of AV=VΛ is the eigenvector equation for v_j. Independence makes V invertible. Conversely, multiplying a diagonalization by V recovers those column equations. In products of A, adjacent V⁻¹V factors cancel; induction gives the power formula, with A⁰=I.

Interpret the three actions from right to left: V⁻¹ reads eigen-coordinates, Λ multiplies each independently, and V writes the result back. Coordinates are not generally dot products with the eigenvectors: V⁻¹ need not be Vᵀ.

For our running A, choose

$$
V=\begin{pmatrix}1&-1\\0&1\end{pmatrix},\quad
V^{-1}=\begin{pmatrix}1&1\\0&1\end{pmatrix},\quad
\Lambda=\begin{pmatrix}2&0\\0&1\end{pmatrix}.
$$

Starting from x₀=(0,1), the coordinates are (1,1), so

$$
A^kx_0=2^k(1,0)+(-1,1)=(2^k-1,1).
$$

After three steps the answer is (7,1). The horizontal growth comes from a component invisible if you mistake ordinary coordinates for eigen-coordinates.

Distinct eigenvalues are sufficient for diagonalization by Theorem 19; they are not necessary. The identity is already diagonal despite a repeated eigenvalue. For a general matrix, the **algebraic multiplicity** of λ is its multiplicity as a root; the **geometric multiplicity** is dim ker(A−λI). The latter is at least one and at most the former. To see the upper bound, extend a basis of E_λ to a full basis: the invariant block λI contributes that many factors (t−λ) to the characteristic polynomial. When the polynomial splits over the chosen field, diagonalizability is equivalent to equality of the two multiplicities for every eigenvalue. Eigenspaces for distinct eigenvalues form a direct sum by the same subtraction argument as Theorem 19.

> **Practice — Foundation:** For \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}=V\Lambda V^{-1}\) with the displayed V and Λ=diag(2,1), compute A²(0,1) from its eigen-coordinates (1,1).
>
> **Hint:** Raise 2 and 1 to the second power in eigen-coordinates, then recombine the two eigenvectors.
>
> **Practice — Core:** For \(V=\begin{pmatrix}1&-1\\0&1\end{pmatrix}\), compute VᵀV and compare \(V^{-1}(0,1)\) with \(V^{\mathsf T}(0,1)\). Why is replacing V⁻¹ by Vᵀ wrong here?
>
> **Hint:** Compute VᵀV. Its off-diagonal entries reveal that the chosen basis is not orthonormal.
>
> **Practice — Stretch:** Prove a real 2×2 matrix with repeated real eigenvalue λ is diagonalizable exactly when A=λI.
>
> **Hint:** If a diagonalization exists, its diagonal matrix must be λI. Conjugating a scalar matrix leaves it unchanged.

## 6. Two obstructions: a missing line and a rotating plane

For the shear

$$
J=\begin{pmatrix}1&1\\0&1\end{pmatrix},\qquad J-I=\begin{pmatrix}0&1\\0&0\end{pmatrix},
$$

the polynomial is (t−1)², but its eigenspace is only span(e₁). It is **defective**: algebraic multiplicity 2, geometric multiplicity 1. There is an invariant horizontal line but no second invariant line to complete an eigenbasis.

Write J=I+N with N²=0. The binomial expansion stops after its linear term:

$$
J^k=I+kN=\begin{pmatrix}1&k\\0&1\end{pmatrix}.
$$

So Jᵏe₂=(k,1), despite every eigenvalue being 1. The missing eigenvector leaves a coupling that accumulates every step. The vector e₂ is a **generalized eigenvector**: (J−I)e₂=e₁, followed by (J−I)e₁=0.

**The Jordan story, stated without proving existence.** Over the complex numbers every square matrix is similar to blocks λI+N, where N has ones on a superdiagonal and is nilpotent. For a block of size m,

$$
(\lambda I+N)^k=\sum_{j=0}^{\min(k,m-1)}\binom{k}{j}\lambda^{k-j}N^j.
$$

For λ=0 use nilpotence directly: the block's powers vanish once k≥m. For nonzero λ, the entries contain polynomial factors multiplying λᵏ. Jordan form explains dynamics, but deciding its exact structure from rounded data is fragile. For \(J_\varepsilon=\begin{pmatrix}1&1\\\varepsilon&1\end{pmatrix}\), eigenvalues are \(1\pm\sqrt\varepsilon\) when ε>0, and their eigenvectors approach the same line as ε→0. At zero, the second eigenvector is lost. A fixed numerical tolerance cannot certify exact defectiveness.

A rotation fails to diagonalize over the reals for a different reason:

$$
R=\begin{pmatrix}0&-1\\1&0\end{pmatrix},\qquad p_R(t)=t^2+1.
$$

Allow \(i^2=-1\). Then λ=i has eigenvector (1,−i), and λ=−i has eigenvector (1,i). The eigenvalues are distinct, so R **is diagonalizable over the complex numbers**. It is not defective over that field. Over the reals its natural invariant object is the whole plane.

More generally a real matrix with eigenvalue a+ib, b≠0, and eigenvector u+iv satisfies Au=au−bv and Av=bu+av. The real vectors u,v are independent (otherwise a real vector would have a nonreal scalar as eigenvalue). Their plane is invariant, and in the basis (u,v) the restriction is \(\begin{pmatrix}a&b\\-b&a\end{pmatrix}\). This is scaling by \(\sqrt{a^2+b^2}\) and rotation in those coordinates. That basis need not be orthonormal in the original metric.

> **Practice — Foundation:** For \(J=\begin{pmatrix}1&1\\0&1\end{pmatrix}\) and \(R=\begin{pmatrix}0&-1\\1&0\end{pmatrix}\), compute J⁴e₂ and R⁴e₁ without four separate matrix products.
>
> **Hint:** The shear adds one horizontal unit each step; the quarter-turn returns after four turns.
>
> **Practice — Core:** Over the complex numbers, find the eigenvalues of J and of R above and count the independent eigenvectors of each. Use those counts to explain why “not diagonalizable over the reals” does not always mean a shortage of complex eigenvectors.
>
> **Hint:** J has the repeated root 1 with eigenspace span(e₁) even over C; R has distinct roots ±i with eigenvectors (1,∓i). One has too small an eigenspace; the other needs a larger scalar field.
>
> **Practice — Stretch:** For R above with λ=i and eigenvector \((1,-i)=u+iv\), read off u, v, a, b and check the block \(\begin{pmatrix}a&b\\-b&a\end{pmatrix}\) against Ru and Rv. Then derive the block for a general real A by equating real and imaginary parts.
>
> **Hint:** Here u=(1,0), v=(0,−1), a=0, b=1. In general expand (a+ib)(u+iv) with i²=−1; the two coefficient lists become the block's columns.

## 7. Eventual decay and immediate growth are different questions

For a fixed finite-dimensional A, define its **spectral radius** using all complex eigenvalues:

$$
\rho(A)=\max_i|\lambda_i|.
$$

**Theorem 21 — asymptotic decay.** Aᵏx→0 for every initial x exactly when ρ(A)<1.

*Proof.* In a diagonalization, each eigen-coordinate decays precisely when its eigenvalue has magnitude below 1. For a defective matrix, use the Jordan theorem stated above: for 0<|λ|<1, every fixed polynomial factor kʲ times |λ|ᵏ still tends to zero; a zero-eigenvalue block is nilpotent. Similarity transports convergence back to the original coordinates. Conversely, an eigenvalue of magnitude at least 1 supplies a complex eigenvector whose iterates do not decay. If all real initial vectors decayed, both the real and imaginary parts of that vector would decay, a contradiction. The general proof therefore depends on Jordan existence, which this chapter has stated, not proved.

The quantifier **every** matters. The map diag(2,1/2) sends e₂ to zero asymptotically even though its spectral radius is 2. At ρ=1 there is no single verdict: I stays constant, R rotates, and J grows linearly. Powers stay bounded at this boundary exactly when all eigenvalues have magnitude at most 1 and every Jordan block on the unit circle has size one.

Now examine

$$
H=\begin{pmatrix}1/2&4\\0&1/2\end{pmatrix},\qquad
H^ke_2=\begin{pmatrix}4k(1/2)^{k-1}\\(1/2)^k\end{pmatrix}\quad(k\ge1).
$$

The starting vector has length 1. The first two outputs are (4,1/2) and (4,1/4), both longer than 4. Eventually the sequence tends to zero because ρ(H)=1/2. This temporary growth is compatible with asymptotic stability. Matrices whose eigendirections are far from orthogonal can also show it without being defective.

**ML anchor.** A fixed linear recurrence hₜ₊₁=Ahₜ propagates states through Aᵏ. A backward sensitivity through the same recurrence propagates through (Aᵀ)ᵏ; transposition preserves the characteristic polynomial. This explains eventual vanishing for ρ<1 and possible exploding directions for ρ>1, while leaving finite-time behavior and the chosen initial direction important. In a nonlinear recurrent model, the derivatives generally form a product of **different** matrices. The spectral radius of each factor alone does not settle the growth of that product. Matrix calculus later will derive that derivative rule; here it is an explicitly supplied bridge.

> **Practice — Foundation:** Which of diag(0.8,−0.9), I, and diag(1.1,0.2) sends every initial vector to zero?
>
> **Hint:** Check the largest eigenvalue magnitude, not its sign or the determinant magnitude.
>
> **Practice — Core:** For \(H=\begin{pmatrix}1/2&4\\0&1/2\end{pmatrix}\), compute \(\|He_2\|\) and ρ(H). Explain how H can increase length on its first step while all its eigenvalues lie inside the unit circle.
>
> **Hint:** Eigenvalues describe invariant directions. The vector e₂ is coupled into e₁ and is not an eigenvector of H.
>
> **Practice — Stretch:** For \(B=\begin{pmatrix}0&c\\0&0\end{pmatrix}\) and \(C=\begin{pmatrix}0&0\\c&0\end{pmatrix}\) with c>0, compute ρ(B), ρ(C), and ρ(BC) as functions of c. For which c does the product have spectral radius above one?
>
> **Hint:** Each factor squares to zero, so its only eigenvalue is 0. BC is diagonal; compare its largest entry c² with 1.

## 8. Power iteration is a race between coordinates

To seek an eigenline, normalize after each multiplication:

$$
x_{k+1}=\frac{Ax_k}{\|Ax_k\|},\qquad \|x_0\|=1.
$$

If Ax_k=0, this update is undefined. Report it; do not divide by zero. Normalization discards magnitude, so a unit-length path tells you nothing by itself about whether the original recurrence grows or decays.

**Theorem 22 — a sufficient condition for power iteration.** Suppose A has a real eigenbasis, \(|\lambda_1|>|\lambda_2|\ge\cdots\), and the coefficient c₁ of x₀ in that eigenbasis is nonzero. Then the normalized iterates approach span(v₁). If λ₁<0 their signs generally alternate.

*Proof.* Write \(x_0=\sum_i c_i v_i\). Factoring out the leading term gives

$$
A^kx_0=\lambda_1^kc_1\left(v_1+\sum_{i>1}\frac{c_i}{c_1}
\left(\frac{\lambda_i}{\lambda_1}\right)^kv_i\right).
$$

The terms in parentheses approach v₁. Normalization removes the size of the outer scalar, but not its sign. The asymptotic rate is controlled by the largest surviving ratio \(|\lambda_i/\lambda_1|\); constants also depend on coordinates and eigenvector geometry. These hypotheses are sufficient, not necessary: a shear can approach its unique eigenline at a slower, non-geometric rate.

The initial coefficient is **not generally a dot product with v₁**. For the running A, starting at (−1,1) has no dominant eigen-coordinate even though its dot product with (1,0) is −1. It stays on the λ=1 line forever in exact arithmetic.

Three honest diagnostics are:

- λ̂=xᵀAx and the eigen-residual \(\|Ax-\widehat\lambda x\|\);
- line change \(\min(\|x_{k+1}-x_k\|,\|x_{k+1}+x_k\|)\), which respects sign flips;
- a convergence report that says whether a residual tolerance was met, not whether the dominant eigenvalue was proved to have been found.

Even a zero residual can belong to a smaller eigenvalue. An iteration limit should produce “not converged,” not a fabricated answer. For the coding lab we use the scale-aware criterion \(\|r\|/\|A\|_F\le\text{tol}\), where \(\|A\|_F=\sqrt{\sum_{ij}a_{ij}^2}\). If A=0, every nonzero vector is an exact zero-eigenvalue eigenvector, with residual zero; no update is needed. If a nonzero A annihilates the initial vector, the same residual criterion recognizes a zero eigenpair, without claiming dominance.

> **Practice — Foundation:** With eigenvalues 2 and 1 and equal nonzero eigen-coordinates, what is their smaller-to-larger magnitude ratio after five steps?
>
> **Hint:** Each multiplication halves that ratio. Normalization divides both coordinates by the same number.
>
> **Practice — Core:** For \(A=\operatorname{diag}(-2,1)\) and \(x_0=(1,0)\), compute the normalized x₁, x₂ and \(\|x_{k+1}-x_k\|\). Why would a stopping test based on that distance wrongly reject the exactly found eigenvalue −2?
>
> **Hint:** The normalized iterates alternate between e₁ and −e₁, exactly distance 2 apart, although both lie on the same eigenline.
>
> **Practice — Stretch:** For \(A=\operatorname{diag}(2,1)\) and start \(x_0=e_2\), compute λ̂ and the eigen-residual at step 0 and after 10 exact power steps. Explain why a tiny residual does not establish that an eigenpair is dominant.
>
> **Hint:** Ae₂=e₂, so the iterate never moves: λ̂=1 with residual 0 at every step. Compare with the dominant eigenvalue 2, which this start never sees.

## 9. Two clocks: where the arrow points and how large it becomes

The left view shows normalized iterates; the right shows log₁₀ of the length of the **unnormalized** recurrence, starting from the same unit vector. The readout exposes both clocks. Use a step at a time to explain each change, then jump twenty steps to test your prediction. A history table supplies exact iteration labels and numeric values without requiring the chart.

```lab
la-power
```

| Experiment | Predict before stepping | What can fail |
|---|---|---|
| Separated: diag(2,1) | Smaller coordinate halves relative to the larger | Starting on the smaller eigenline never finds the dominant one |
| Close: diag(1,0.98) | Ratio decays as 0.98ᵏ | Twenty steps can look like very little progress |
| Negative: diag(−2,1) | Line converges, arrow flips | Arrow-change stopping criteria mislead |
| Equal magnitude: diag(1,−1) | A generic start alternates between two lines | No unique largest magnitude |
| Rotation | Directions keep turning; raw length stays 1 | No real eigenline to converge to |
| Stable shear: H from section 7 | Raw length first increases, then vanishes | Spectral radius does not bound each step's gain |
| Zero | The first raw output is zero | Normalizing the next vector is undefined |

For the close preset, the ratio after 100 steps is about 0.133: much larger than the separated preset's ratio after just ten steps, about 0.000977. “Run it a few times” is not a convergence argument. A small line change can also occur merely because the eigenvalues are close.

The raw magnitude is accumulated as a sum of logarithms of step gains. This lets the display follow growth and decay without storing enormous or tiny raw vectors. It does not fix inaccurate directions or prove a computed eigenvalue exact. At exact annihilation, log-length is −∞ and the plot stops rather than inventing a finite point.

> **Practice — Foundation:** The negative preset is \(\operatorname{diag}(-2,1)\). Starting from \((1,1)/\sqrt2\), predict the sign of the horizontal coordinate after one and two steps.
>
> **Hint:** Every multiplication contributes a factor −2 to the horizontal coordinate; normalization uses a positive norm.
>
> **Practice — Core:** In the separated preset \(\operatorname{diag}(2,1)\), start on the smaller eigenline e₂. Give λ̂ and the residual after one step, and explain why the iteration never finds 2.
>
> **Hint:** Distinguish convergence to an eigenpair from identification of the largest eigenvalue magnitude.
>
> **Practice — Stretch:** For the stable shear \(H=\begin{pmatrix}1/2&4\\0&1/2\end{pmatrix}\) started at e₂, compute the raw length at k=1, 2, and 10. The eigen-residual is about 0.062 at k=1 and 0.0006 at k=10. Why need the time of largest raw length and the time of a small residual not agree?
>
> **Hint:** Use \(H^ke_2=(4k(1/2)^{k-1},(1/2)^k)\) for the raw lengths. The residual depends only on the normalized direction, whose tilt from e₁ shrinks like 1/(8k), not on accumulated gains.

## Local numerical and research audit

### A residual measures a local eigenpair claim

For \(A=\begin{pmatrix}1&10^6\\0&1\end{pmatrix}\), the eigenvalues are both one, while \(Ae_2=(10^6,1)^T\) exhibits large one-step amplification. Now perturb the lower-left entry by \(\varepsilon>0\): the eigenvalues become \(1\pm\sqrt{10^6\varepsilon}\). A small entry perturbation can move this nonnormal spectrum substantially.

Keep three claims distinct in an experiment: a small eigenpair residual, convergence to an eigenvalue of largest magnitude, and stability of the spectrum under perturbations. A residual alone cannot establish all three. Symmetric matrices admit stronger residual-to-spectrum bounds in the next lesson; do not transfer those bounds to arbitrary nonnormal matrices.

**M7 · Stretch · mixed — A residual measures a local eigenpair claim.** For [[1,10⁶],[10⁻⁶,1]], compute its two eigenvalues and compare them with those before adding the lower-left entry.

## 10. Three runnable coding labs

All three tasks use only the Python standard library. Inputs remain unchanged; malformed, boolean, or non-finite data raises ValueError. The browser supplies the documented validation helpers, not the algorithm being practiced.

### Lab A — a convergence report with a limited claim

Open [power iteration](../../labs/exercises.py). Implement `power_iteration(matrix, initial, max_iter=200, tol=1e-10)`. Return a dictionary with `vector` (unit length), `eigenvalue`, `residual` (absolute norm), `iterations` (completed updates), `converged` (residual test met), and `reason` (`residual` or `max_iter`). Test the initial vector at iteration 0, and return diagnostics for the same vector you report. Permit a nonnegative integer iteration budget, including zero.

Use the relative residual criterion from section 8. Validate a nonzero initial vector and positive finite tolerance. To avoid gratuitous overflow, normalize the matrix by its largest absolute entry during iteration, and rescale the final eigenvalue and residual to original units. Reject non-finite reported arithmetic. The convergence report cannot certify dominance; document that limitation. Compare a negative dominant eigenvalue, a rotating matrix, a zero matrix, and an exact smaller-eigenline start.

### Lab B — a polynomial with an explicit convention

Open [the 2×2 characteristic polynomial](../../labs/exercises.py). Return the three coefficients `[1, -(a+d), ad-bc]` in descending powers of t. A repeated root is valid. Reject any shape other than 2×2 and non-finite coefficient arithmetic. Verify your signs by substituting a known eigenvalue into the polynomial.

### Lab C — an exact small-matrix classification

Open [2×2 diagonalizability](../../labs/exercises.py). Return a Boolean for diagonalizability **over the real numbers**. For this deliberately exact task, require Python integer entries (excluding booleans). Compute the integer discriminant (a−d)²+4bc without floating-point conversion. Positive means two real independent eigenvectors; negative means no real eigenbasis; zero means diagonalizable exactly when A is scalar. Preserve even very large integer distinctions.

This restricted domain makes an exact yes/no answer honest. Arbitrary rounded floating-point data needs a tolerance-dependent report, not an assertion that a tiny discriminant is exactly zero. General Jordan-form computation is not being assigned.

Run `python -m labs.checks power-iteration`, `python -m labs.checks char-poly-2x2`, and `python -m labs.checks diagonalizable-2x2`. Add `--reference` to check the supplied solutions after attempting your own.

## 11. Exercises · by hand

**A1 · Foundation · paper — three kinds of invariant line.** For \(A=\operatorname{diag}(2,-1,0)\), give the eigenvalues in coordinate order and describe all three axis images. Is zero an eigenvector?

**A2 · Core · paper — a room with incoming traffic.** For \(A=\begin{pmatrix}2&1\\0&3\end{pmatrix}\), decide which coordinate axes are invariant. Find a different invariant line complementary to the first axis.

**A3 · Foundation · paper — roots and null spaces.** For \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\), give the monic characteristic coefficients, then one eigenvector for each root.

**A4 · Core · paper — prove independence.** Prove eigenvectors belonging to pairwise distinct eigenvalues are linearly independent. Explain why this does not imply orthogonality.

**A5 · Core · paper — compute in the hidden basis.** For A from A3 and \(x_0=(0,1)\), compute eigen-coordinates in the ordered basis \((1,0),(-1,1)\), then \(A^3x_0\).

**A6 · Core · paper — same roots, different machines.** Compare I with \(J=\begin{pmatrix}1&1\\0&1\end{pmatrix}\). Give the geometric multiplicity of 1 for each and \(J^5e_2\).

**A7 · Core · paper — name the field.** For \(R=\begin{pmatrix}0&-1\\1&0\end{pmatrix}\), decide diagonalizability over the reals and over the complex numbers. Verify a complex eigenvector directly.

**A8 · Core · paper — stable yet initially larger.** For \(H=\begin{pmatrix}1/2&4\\0&1/2\end{pmatrix}\), compute \(He_2\), \(H^2e_2\), and ρ(H). Does every initial vector eventually decay?

**A9 · Core · paper — a failed stopping rule.** For \(A=\operatorname{diag}(-2,1)\) and \(x_0=(1,0)\), compare consecutive unit-arrow distance, consecutive line distance, and eigen-residual.

**A10 · Stretch · paper — a rotating room.** If A is real and \(A(u+iv)=(a+ib)(u+iv)\) with b≠0, derive the real invariant-plane block in the basis (u,v) and justify independence of u,v.

**A11 · Core · paper — a precise 2×2 criterion.** Prove the Lab C rule: a real 2×2 matrix \(A=\begin{pmatrix}a&b\\c&d\end{pmatrix}\) is diagonalizable over the reals exactly when \(\Delta=(a-d)^2+4bc>0\), or Δ=0 and A is scalar. Include the discriminant-zero case, then apply the rule to \(\begin{pmatrix}3&1\\2&2\end{pmatrix}\), \(\begin{pmatrix}1&-2\\1&3\end{pmatrix}\), and \(\begin{pmatrix}2&1\\0&2\end{pmatrix}\).

**A12 · Stretch · paper — stable factors, unstable product.** Let \(B=\begin{pmatrix}0&2\\0&0\end{pmatrix}\), \(C=\begin{pmatrix}0&0\\2&0\end{pmatrix}\). Compute ρ(B), ρ(C), ρ(BC), and explain what this prevents you from claiming about varying recurrent derivatives.


## 12. Exercises · NumPy

**B1 · Foundation · NumPy — verify equations, not vector signs.** Use float64 `np.linalg.eig` on A3. Check each returned pair with \(\|Av-\lambda v\|\). Why should you not compare eigenvectors entrywise against one answer?

**B2 · Core · NumPy — near a missing eigenvector.** For \(J_\varepsilon=\begin{pmatrix}1&1\\\varepsilon&1\end{pmatrix}\), sweep ε=1, 10⁻⁴, 10⁻⁸, 0 in float64. Measure the eigenvalue gap, eigenpair residuals, and absolute determinant of the unit eigenvector matrix. Predict the limits.

**B3 · Core · NumPy — two convergence speeds.** Run normalized iteration from (1,1) on diag(2,1) and diag(1,0.98). Compare the second-to-first coordinate magnitude ratio at k=20 and k=100. Predict before running.

**B4 · Core · NumPy — record the whole transient.** For H from A8 and start e₂, record raw lengths for k=0,…,30. Find the maximizing k and compare it with ρ(H). Verify the closed-form vector for k≥1.

**B5 · Stretch · NumPy — residual without dominance.** Run your Python power solver on A3 from (−1,1), then from (−1+10⁻⁴,1). Compare immediate residual convergence with a longer forced iteration and explain the role of initial eigen-coordinates.

**B6 · Stretch · NumPy — the polynomial loses a root.** For diag(10⁸,10⁻⁸), compare the direct quadratic formula from trace and determinant with `np.linalg.eigvals`. Inspect the smaller root and its relative error; explain the subtraction.


## 13. Exercises · PyTorch

**C1 · Foundation · PyTorch — a batch of different obstructions.** Use float64 `torch.linalg.eig` on a batch containing I, J from A6, and R from A7. Check residuals in the returned complex dtype. Explain why small residuals do not prove all three returned eigenvector matrices are invertible.

**C2 · Core · PyTorch — forward and backward recurrence.** For H from A8, propagate e₂ with H and e₁ with Hᵀ for five steps. Compare lengths at every step and explain what is special about these starts.

**C3 · Core · PyTorch — norm normalization can hide decay.** For diag(0.8,0.4), compare raw and normalized iteration from (1,1). Report raw length and normalized coordinate ratio after ten steps. Explain why a unit normalized output is not evidence against vanishing.

**C4 · Stretch · PyTorch — inspect an alternating product.** Use B and C from A12. Apply C and then B repeatedly to e₁. Compare twenty individual updates with twenty repetitions of only B. State why fixed-matrix spectral reasoning cannot be applied separately to the alternating factors.


## 14. Derivations to own

1. Derive AB=BC from invariance, and the zero block after extending a basis.
2. Prove distinct-eigenvalue independence and the eigenbasis criterion.
3. Derive the 2×2 characteristic polynomial, and prove its similarity invariance.
4. Derive Jᵏ and the general power formula for a supplied Jordan block; distinguish this from proving Jordan existence.
5. Prove decay iff ρ<1, explicitly naming the stated Jordan theorem where needed.
6. Derive the power-iteration ratio and explain the initial-component, sign, and residual caveats.


## 15. Exercises · cumulative

**M1 · Core · paper — projection is already spectral.** For the orthogonal projector onto span((1,1)), write P, find its two eigenspaces, and compute P¹⁰, rank(P), and det(P).

**M2 · Core · paper — volume does not predict stability.** For diag(2,1/4), give determinant and spectral radius. Does shrinking every cell volume imply every vector decays?

**M3 · Core · paper — an invariant plane in three dimensions.** For the 3×3 rotation-plus-stretch example in section 1, give the restriction to the xy-plane, the restriction to the z-axis, and A⁴. Is A diagonalizable over the reals?

**M4 · Core · paper — coordinates are not projections.** For V from section 5, compute V⁻¹(0,1) and Vᵀ(0,1). Which gives eigen-coordinates, and what condition would make the two procedures coincide for every input?

**M5 · Stretch · paper — invariant does not mean reducing.** For J from A6 let S=span(e₁). Show S is invariant but S⊥ is not. Prove there is no invariant complementary line at all.

**M6 · Stretch · mixed — a residual has a precise perturbation meaning.** For a unit real vector x, let λ̂=xᵀAx and r=Ax−λ̂x. Construct a matrix perturbation E such that (A+E)x=λ̂x and compute its Frobenius norm. Does this prove λ̂ is close to a true eigenvalue of A?


## 16. Exercises · checkpoint

**K1 · Foundation · gate — read the rooms.** For \(A=\begin{pmatrix}3&1\\0&2\end{pmatrix}\), find both eigenvalues and eigenspaces, and say whether the second coordinate axis is invariant.

**K2 · Core · gate — derive and use a diagonalization.** For A in K1, construct V and Λ, justify A=VΛV⁻¹, and compute A⁴(0,1).

**K3 · Core · gate — diagnose the obstruction.** Compare \(D=\begin{pmatrix}2&1\\0&2\end{pmatrix}\) with the quarter-turn R. State each diagonalizability verdict over R and C, and derive Dᵏ for k≥1.

**K4 · Core · gate — defend the stability statement.** State the exact condition for Aᵏx→0 for every x. Give a 2×2 counterexample to each claim: “ρ<1 means every step shrinks length” and “ρ=1 means powers stay bounded.”

**K5 · Stretch · gate — audit a convergence report.** A report says “the returned vector has norm 1, its eigen-residual is below 10⁻¹⁰, and iteration stopped before 200 steps; therefore it is the dominant eigenvector and the raw recurrence does not vanish.” Refute both conclusions with one matrix and start.

**K6 · Stretch · gate — transfer from a line to a subsystem.** Let B have independent columns and satisfy AB=BC. Prove AᵏB=BCᵏ. If ρ(C)<1, what happens to all starts in range(B)? Must ρ(A)<1? Give an example.


## Mastery check

On an unfamiliar small matrix, identify invariant subspaces, compute and audit an eigenbasis or explain its absence, and predict both long-run behavior and a possible transient. Defend every field choice and every numerical claim. A residual, a polynomial root, and an independent eigenbasis are three different pieces of evidence.

**What to bring to Module 7:** eigen-coordinates, multiplicities, and the difference between independent and orthonormal directions. Symmetry will supply the missing geometric guarantee; do not assume it before checking the hypothesis.
