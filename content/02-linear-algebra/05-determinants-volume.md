---
id: math.linear-algebra.determinants-volume
title: Determinants as signed volume
prerequisites: [math.linear-algebra.orthonormal-bases-qr]
estimated_hours: 20
answers: 05-determinant
---

# Determinants as signed volume

Imagine printing a square of graph paper on rubber. Pull one corner sideways: the grid leans, but may occupy exactly the same area. Flip the sheet: its area stays positive, but its handedness reverses. Flatten it into a line: every little square loses its area at once. A determinant records these three possibilities with one signed number.

## 0. Where this is going

Four results organize this chapter: three properties uniquely determine the determinant; composition multiplies determinants; the absolute determinant measures volume scaling while its sign records orientation; local volume scaling explains the Jacobian factor in a change of variables.

We work with real square matrices, and vectors are **columns**. Python inputs are lists of **rows**. Fix an ordered orthonormal coordinate system, with the standard basis declared positively oriented and its unit cube assigned volume 1. Ordinary volume is nonnegative; **signed** volume can be negative. A determinant is not defined for a rectangular matrix by the definition used here.

Read sections 1–9, make the predictions before opening the reveals, and use the static practice hints after an attempt. Section 10 has three runnable stdlib Python tasks. NumPy and PyTorch exercises run locally. The twenty hours include proofs, coding, and a six-problem checkpoint. The calculus connection is a preview with its assumptions stated; no untaught differentiation algorithm is required.

## 1. A number for the whole sheet

For \(A=[u\ v]\), the image of the unit square is

$$
\{su+tv:0\le s,t\le1\}.
$$

Its edges are the columns of A. For \(u=(a,c)\), \(v=(b,d)\), its signed area is

$$
\det A=ad-bc.
$$

We will derive the formula rather than memorize it as a diagonal trick. For now, test its meaning on \(A=\begin{pmatrix}2&1\\0&1\end{pmatrix}\). The bottom edge has length 2 and the perpendicular height is 1, so area is 2. Sliding the top edge sideways changes neither. The signed area is positive because the ordered pair of columns has the same handedness as \((e_1,e_2)\).

Swapping the columns traverses the **same parallelogram** in the opposite order: signed area becomes −2, ordinary area stays 2. Replacing the second column by twice the first flattens the parallelogram: signed and unsigned area both vanish. A zero determinant means a loss of dimension, not necessarily the zero map.

<details><summary>Predict: does determinant 1 mean every arrow keeps its length?</summary>

No. The map \(\operatorname{diag}(2,1/2)\) doubles horizontal lengths and halves vertical lengths while preserving area. A shear also preserves area while changing some lengths and angles. A determinant is a budget for a whole cell, not a promise about individual arrows.

</details>

> **Practice — Foundation:** Find the signed and ordinary areas for columns \((2,0),(1,-3)\).
>
> **Hint:** Use base length 2 and signed vertical height −3. Take an absolute value only for the ordinary area.
>
> **Practice — Core:** Explain why adding any multiple of \((2,0)\) to \((1,1)\) leaves the parallelogram's area unchanged.
>
> **Hint:** The top edge slides parallel to the base. Its perpendicular distance from the base does not change.
>
> **Practice — Stretch:** Give a nonzero map with zero determinant, and identify exactly which input direction disappears.
>
> **Hint:** Try a diagonal matrix with one zero entry. Follow each coordinate arrow and connect the lost arrow to the null space.

## 2. Make a prediction, then move the columns

The left view is a sheet in two dimensions. The right view is a box in three. They are separate experiments with the same rules; the dimension selector chooses which set of columns the preset buttons change. Drag the colored tips. In 3D, dragging empty space rotates the camera; that changes the picture, not the determinant. Numeric column inputs provide a keyboard-accessible way to move each tip.

```lab
la-det
```

Try these experiments in order:

1. **Shear:** predict the determinant after adding the first column to the second. Repeat several times. The shape changes, but the signed volume does not.
2. **Swap columns:** predict which of volume, orientation, and occupied region changes. The readout distinguishes all three.
3. **Collapse:** replace the last column by the first. The box still has visible edges, yet its ambient volume is zero.
4. **Thin:** a nonzero height of \(10^{-6}\) may be smaller than a pixel. Read the number: an invisible thickness is not the same thing as exact collapse.
5. **Reveal signed pieces:** split the first column into its coordinate components. Select a contribution and compare it with the whole. Some contributions can be negative or overlap; their signed sum is the determinant. They are not necessarily a jigsaw of disjoint positive pieces.

The left grid contains 25 equal-mass markers. They label small source cells; their apparent dot density is illustrative, while the numeric density multiplier \(1/|\det A|\) is exact for an invertible linear map. At collapse the display refuses to divide by zero: mass is confined to a line, so an ordinary two-dimensional density is no longer the right description.

> **Practice — Foundation:** Use the swap preset twice. What returns to its original value?
>
> **Hint:** Two swaps restore the original ordered columns. Check both the signed number and the unchanged ordinary volume.
>
> **Practice — Core:** Explain why collapse and thin must have different verdicts even if their pictures look identical.
>
> **Hint:** Compare an exact zero height with a small positive height. Screen resolution cannot certify mathematical dependence.
>
> **Practice — Stretch:** Explain how two large signed contributions can produce a very small determinant, and what information a rounded display could hide.
>
> **Hint:** Compare the magnitudes of the separate products with their difference. Cancellation concerns arithmetic as well as the geometry of nearly dependent columns.

## 3. Three rules force the formula

Write \(D(v_1,\ldots,v_n)\) for the number assigned to an ordered list of n vectors in \(\mathbb R^n\). Require:

| Rule | Exact statement | Geometric motivation |
|---|---|---|
| Multilinear | Linear in **one column at a time**, with all others fixed | Scaling one edge scales signed volume; splitting one edge adds signed contributions |
| Alternating | Zero whenever two columns are equal | Repeated directions flatten the cell |
| Normalized | \(D(e_1,\ldots,e_n)=1\) | Fix the unit and positive orientation |

Linearity in one column means \(D(\ldots,\alpha u+\beta v,\ldots)=\alpha D(\ldots,u,\ldots)+\beta D(\ldots,v,\ldots)\). It does **not** mean \(D(A+B)=D(A)+D(B)\): adding two matrices changes every column at once.

First derive the sign change on a swap. Expanding \(D(\ldots,u+v,\ldots,u+v,\ldots)=0\) leaves the two cross terms, since the repeated-column terms vanish. Thus \(D(\ldots,u,\ldots,v,\ldots)=-D(\ldots,v,\ldots,u,\ldots)\).

**Theorem 16 — existence and uniqueness of the determinant.** There is exactly one alternating multilinear function normalized on the standard basis. For \(A=(a_{ij})\), it is

$$
\det A=\sum_{\sigma\in S_n}\operatorname{sgn}(\sigma)\prod_{j=1}^n a_{\sigma(j),j}.
$$

Here \(S_n\) consists of all permutations of \(1,\ldots,n\). The sign is \((-1)^k\), where k is the number of inversions (out-of-order pairs) in the permutation. Exchanging two positions flips that parity.

*Uniqueness.* Expand each column \(a_j=\sum_i a_{ij}e_i\) by multilinearity. Any term selecting the same basis vector twice vanishes. The surviving selections are permutations of the basis. Swapping them back into standard order gives their signs; normalization fixes their magnitude at 1. There is no remaining freedom. More generally, any alternating multilinear F equals \(F(e_1,\ldots,e_n)\det\), even if that constant is zero.

*Existence.* Define D by the displayed sum. Each product uses one entry from each column, so D is linear in each column. If two columns coincide, pair every permutation with the permutation exchanging the selected rows for those two columns: their products agree and their signs are opposite. They cancel. On the identity, only the identity permutation survives and contributes 1. Thus the formula has all three properties.

For two columns the expansion is especially revealing:

$$
D(ae_1+ce_2,be_1+de_2)
=adD(e_1,e_2)+cbD(e_2,e_1)=ad-bc.
$$

The familiar subtraction is the cost of reversing the basis order in the second term. It is not an arbitrary mnemonic.

> **Practice — Foundation:** Expand \(D(2e_1+e_2,e_1+3e_2)\) using only the three rules.
>
> **Hint:** There are four terms. The two with repeated coordinate directions vanish; the two remaining terms have opposite orientation.
>
> **Practice — Core:** Give a 2×2 counterexample to \(\det(A+B)=\det A+\det B\).
>
> **Hint:** Choose A=B=I. Scaling both columns by 2 applies the one-column rule twice.
>
> **Practice — Stretch:** Prove the scalar-multiple statement for F when \(F(e_1,\ldots,e_n)=0\), without dividing by that number.
>
> **Hint:** Expand every column in the standard basis. Every surviving permutation term is a signed copy of the same value, even when that value is zero.

## 4. Elimination becomes volume bookkeeping

Adding a multiple of column i to column j preserves the determinant: multilinearity produces the original term plus a repeated-column term, which is zero. Swapping two columns reverses the sign. Scaling one column by c scales the determinant by c.

The same rules apply to **rows**. To justify this rather than assume it, transpose the permutation formula and relabel each permutation by its inverse. The products and signs agree, so \(\det A^{\mathsf T}=\det A\).

For an upper-triangular matrix U, the determinant is the product of the diagonal entries. In the permutation formula, a nonzero term must select a row index at most j in column j. Column 1 therefore forces row 1, column 2 forces row 2, and induction leaves only the diagonal product.

**Theorem 17 — elimination and invertibility.** If elimination turns A into U using s row swaps and row additions, without scaling pivot rows, then

$$
\det A=(-1)^s\prod_i u_{ii}.
$$

Consequently \(\det A\ne0\) exactly when A is invertible.

*Proof.* Each addition preserves D and each swap negates it. The triangular formula gives the result. In exact elimination, full rank means n nonzero pivots and hence a nonzero product. Rank deficiency leaves at least one zero diagonal entry. Module 2 identifies full rank with invertibility for a square matrix.

**Work a swap, not just a diagonal.** For

$$
A=\begin{pmatrix}0&2&1\\1&1&0\\2&0&1\end{pmatrix},
$$

swap rows 1 and 2, subtract twice the new row 1 from row 3, then add row 2 to row 3. The resulting U has rows \((1,1,0),(0,2,1),(0,0,2)\). Its determinant is 4. One swap means \(\det A=-4\). If you normalize pivot rows as in RREF, you must also record every scale factor; reading the diagonal of the final identity would lose the original determinant.

Partial pivoting chooses the largest available absolute entry in a pivot column to avoid unnecessarily large multipliers. It does not turn a computed tiny pivot into an exact rank theorem. The coding lab checks for a **computed zero** pivot and does not silently replace small nonzero determinants by zero. Floating-point cancellation can still make that computed decision disagree with exact real arithmetic.

> **Practice — Foundation:** An upper-triangular matrix has diagonal \((2,-3,4)\). What is its determinant?
>
> **Hint:** Multiply the three diagonal entries, retaining their signs. Entries above the diagonal do not enter the product.
>
> **Practice — Core:** Track the determinant through the worked elimination and explain why the final answer is negative.
>
> **Hint:** Keep a separate sign ledger. There is one swap and two row additions; only the swap changes the sign.
>
> **Practice — Stretch:** A nonsingular matrix reduces to I after swaps, row additions, and scaling row i by nonzero factors c. Derive the formula recovering its original determinant.
>
> **Hint:** The determinant of the final matrix equals the original determinant times every operation's factor. Solve that scalar equation backwards.

## 5. Composition multiplies the budget

Apply B to the unit cube, then apply A to the resulting cell. The combined map is AB: the rightmost map acts first. It is natural to expect volume factors to multiply, but the algebra proves this even when either map collapses a dimension.

**Theorem 18 — determinant of a product.** For square matrices A and B of the same size,

$$
\det(AB)=\det A\det B.
$$

*Proof.* Hold A fixed and define \(F(b_1,\ldots,b_n)=\det(Ab_1,\ldots,Ab_n)\). Since A is linear, F is multilinear and alternating. By the scalar-multiple form of Theorem 16, F equals \(F(e_1,\ldots,e_n)\det B=\det A\det B\). No inverse, division, or nonzero-determinant assumption was needed.

For invertible A this gives \(\det A^{-1}=1/\det A\). Also \(\det(cA)=c^n\det A\): c scales **every** column. Two reflections each have determinant −1, so their composition has determinant +1. This does not require them to be the same reflection.

A change of basis represents the same endomorphism by \(S^{-1}AS\), whose determinant equals \(\det A\). Changing an input basis alone gives AS, with determinant \(\det A\det S\); that is a different coordinate comparison. Basis invariance needs the matching change at both ends.

<details><summary>Predict: must AB and BA be the same if their determinants agree?</summary>

No. Take \(A=\operatorname{diag}(2,1)\), \(B=\begin{pmatrix}1&1\\0&1\end{pmatrix}\). Their products have different top-right entries, 2 and 1, while both determinants are 2. The scalar volume budget forgets almost everything about where individual vectors go.

</details>

> **Practice — Foundation:** If \(\det A=-3\) and \(\det B=2\), find \(\det(AB)\) and \(\det(A^{-1})\).
>
> **Hint:** Composition multiplies the two signed factors. An inverse must multiply the original factor back to 1.
>
> **Practice — Core:** Derive the determinant under a simultaneous change of input and output basis.
>
> **Hint:** Write the representation as S⁻¹AS and use multiplicativity three times. The two basis factors cancel.
>
> **Practice — Stretch:** Explain why normalizing F by \(\det A\) would leave a hole in the product proof.
>
> **Hint:** The theorem also covers singular A. The scalar-multiple version of uniqueness covers that case without division.

## 6. QR supplies the missing geometric proof

So far the three rules gave an algebraic object. Why does its magnitude equal ordinary volume?

For an invertible square A, Module 4 gives \(A=QR\) with positive diagonal in R. Since \(Q^{\mathsf T}Q=I\), multiplicativity and transpose invariance give \((\det Q)^2=1\). An orthogonal Q preserves lengths and angles, hence Euclidean volume; its determinant records one of two orientations.

In the orthonormal Q coordinates, column j of R has perpendicular height \(r_{jj}\) above the span of the earlier columns. The base-times-height rule, applied successively, gives volume \(\prod_j r_{jj}\). Meanwhile \(|\det A|=|\det Q|\prod_j r_{jj}=\prod_j r_{jj}\). If A is singular, its cell lies in a lower-dimensional subspace and has zero ambient volume, agreeing with Theorem 17.

This establishes the cell-volume interpretation. For any parallelepiped with edge matrix B, the image has volume \(|\det(AB)|=|\det A||\det B|\). Extending from small cells to ordinary measurable regions gives

$$
\operatorname{vol}_n(AE)=|\det A|\operatorname{vol}_n(E)
$$

for invertible A and measurable E. The extension is the standard volume/measure argument behind integration; the linear-algebra proof above establishes the factor, not a complete construction of measure theory.

**Orientation has a boundary.** The determinant is a polynomial in the entries, hence continuous. Along a continuous path of matrices, changing its sign requires passing through zero. You cannot continuously turn a positively oriented frame into a negatively oriented one while keeping it a basis at every instant. For example, \(A(t)=\operatorname{diag}(1,t)\) flips orientation by collapsing at \(t=0\).

For rectangular full-column-rank \(A\in\mathbb R^{m\times n}\), \(m>n\), the embedded cell has n-dimensional volume \(\prod_j r_{jj}=\sqrt{\det(A^{\mathsf T}A)}\), since \(A^{\mathsf T}A=R^{\mathsf T}R\). This is an unsigned volume derived from QR; it is not a determinant of rectangular A, nor does it supply a scalar ambient orientation.

> **Practice — Foundation:** Positive QR diagonals are \((2,3,1/2)\). Find the cell volume, and state what information is still needed for its signed determinant.
>
> **Hint:** Multiply the diagonal heights for the magnitude. The orientation of Q determines the remaining sign.
>
> **Practice — Core:** Prove that an orthogonal square matrix has determinant +1 or −1.
>
> **Hint:** Take determinants in QᵀQ=I and use transpose invariance. Over the reals the resulting square equals 1.
>
> **Practice — Stretch:** Use continuity to show that a path from I to a reflection must contain a singular matrix.
>
> **Hint:** Compose the continuous path with the determinant polynomial. Apply the intermediate value theorem to its endpoint values 1 and −1.

## 7. Cofactors are signed coordinate pieces

Return to splitting an edge. In three dimensions write the first column as \(a_{11}e_1+a_{21}e_2+a_{31}e_3\). Multilinearity gives three boxes with the other two edges held fixed:

$$
\det A=
 a_{11}\det\begin{pmatrix}a_{22}&a_{23}\\a_{32}&a_{33}\end{pmatrix}
-a_{21}\det\begin{pmatrix}a_{12}&a_{13}\\a_{32}&a_{33}\end{pmatrix}
+a_{31}\det\begin{pmatrix}a_{12}&a_{13}\\a_{22}&a_{23}\end{pmatrix}.
$$

Each 2×2 determinant is a signed **projected** base area; its multiplier is an axis-aligned height. The middle sign accounts for moving \(e_2\) past one coordinate direction. The lab draws these three signed contributions. They can overlap or cancel because splitting a slanted edge is an algebraic decomposition of oriented cells, not necessarily a physical cutting into positive pieces.

In general delete row i and column j to form the **minor matrix** \(A_{\widehat i,\widehat j}\). Its signed cofactor is

$$
C_{ij}=(-1)^{i+j}\det A_{\widehat i,\widehat j},\qquad
\det A=\sum_i a_{ij}C_{ij}
$$

for any fixed column j. Group the permutation formula by the row chosen in that column to derive this identity: moving that row and column to the front contributes \((-1)^{i+j}\), and the remaining permutations give the minor's determinant. Transposing gives expansion along any row. The determinant of the 0×0 minor is assigned 1 so the formula also covers a 1×1 matrix.

For the lab's 3D example,

$$
A=\begin{pmatrix}2&1&0\\1&2&1\\1&0&2\end{pmatrix},
$$

the first-column pieces contribute \(8,-2,1\), totaling 7. “Subtract the middle term” means subtract its **signed product**; if that product is already negative, subtraction adds it.

Cofactor expansion is excellent for a small proof, a sparse row, or a visual explanation. Recursively expanding a dense matrix creates factorial growth in work. Elimination takes order \(n^3\) arithmetic. Do not turn the most memorable formula into the default numerical algorithm.

> **Practice — Foundation:** Compute the three first-column contributions for the displayed 3×3 example.
>
> **Hint:** Delete one row at a time and the first column. Apply the +, −, + cofactor signs before adding the products.
>
> **Practice — Core:** Expand the same matrix along its first row and reconcile the different contributions with the same total.
>
> **Hint:** You should obtain two nonzero products and one zero product. Different decompositions must agree by uniqueness.
>
> **Practice — Stretch:** Explain why replacing all cofactors by their absolute values is not a volume algorithm.
>
> **Hint:** Use a singular matrix with nonzero entries and nonzero individual contributions. Cancellation is how the signed pieces detect collapse.

## 8. Density pays the inverse of the volume factor

Suppose a uniform sheet carries one unit of probability mass per unit area. Apply \(A=\operatorname{diag}(2,3)\). Every tiny source cell grows by 6. Its probability mass stays the same, so its density becomes \(1/6\) of the old density. This inverse factor is the reason determinants reappear in probability.

For invertible \(y=Ax+b\), conservation of mass gives

$$
p_Y(y)=\frac{p_X(A^{-1}(y-b))}{|\det A|}.
$$

A translation moves cells without resizing them. A reflection changes orientation but cannot make probability negative, which explains the absolute value. For singular A, division by zero is not a special density value: an absolutely continuous input can be compressed onto a lower-dimensional set, and a full-dimensional output density need not exist.

For a smooth nonlinear map \(y=f(x)\), the **Jacobian** \(J_f(x)\) is the matrix of its local linear approximation: near x, an offset h is mapped to \(J_f(x)h\), up to an error small relative to \(\|h\|\). Infinitesimal cells therefore scale by \(|\det J_f(x)|\). The change-of-variables theorem, for a continuously differentiable bijection between open regions with continuously differentiable inverse, states

$$
\int_{f(U)}g(y)\,dy=\int_U g(f(x))|\det J_f(x)|\,dx.
$$

This theorem belongs to multivariable calculus; the small-cell argument explains its factor rather than replacing its proof. Its density counterpart divides by that factor at the preimage. Nonzero local determinants alone do not guarantee global one-to-one behavior. A many-to-one map requires accounting for all relevant preimages; do not apply the single-preimage formula blindly.

**A local-cell thought experiment.** For \(f(s,t)=(s,e^s t)\), the supplied Jacobian is

$$
J_f(s,t)=\begin{pmatrix}1&0\\e^s t&e^s\end{pmatrix},\qquad\det J_f(s,t)=e^s.
$$

A tiny cell near \(s=0\) keeps its area; near \(s=\log2\) its area doubles and its density halves. The off-diagonal term tilts the cell but does not change the determinant. The inverse \((y_1,y_2)\mapsto(y_1,e^{-y_1}y_2)\) verifies global invertibility here.

> **Practice — Foundation:** A cell of area 2 and probability mass 0.1 is stretched by determinant −4. Find its new area and density.
>
> **Hint:** Use the absolute factor for area. Divide the unchanged mass by the new area; the negative sign describes orientation only.
>
> **Practice — Core:** Derive the affine density formula by equating the mass in a small source cell with the mass in its image.
>
> **Hint:** Write mass as density times volume on each side. Substitute the image-volume factor, then solve for the output density.
>
> **Practice — Stretch:** For the supplied nonlinear map, find the density multiplier at \(s=-\log3\) and explain why translation alone could never produce it.
>
> **Hint:** Evaluate eˢ, then take its reciprocal. A translation has identity Jacobian and therefore unit volume factor everywhere.

## 9. Where determinants earn their computational cost

Determinants are pedagogically central and computationally marginal for ordinary linear solves and least squares. Use factorizations to solve systems; do not compute an inverse or implement Cramer's rule as a general numerical solver. Nor is the raw determinant a useful all-purpose measure of numerical difficulty.

Two counterexamples make this precise. The matrix \(10^{-6}I_3\) has determinant \(10^{-18}\), yet scales all directions equally. The matrix \(\operatorname{diag}(10^6,10^{-6})\) has determinant 1, yet treats its two axes very differently. The later conditioning module quantifies sensitivity. Here the lesson is already available: a product hides how its factors are distributed.

There are important workloads where the determinant itself is needed. An invertible density transformation needs its volume factor. A sequence of such transformations is a **normalizing flow**; the [review by Papamakarios and colleagues](https://www.jmlr.org/papers/v22/19-1028.html) develops this connection. If \(x_k=f_k(x_{k-1})\), then

$$
\log p_K(x_K)=\log p_0(x_0)-\sum_{k=1}^K\log|\det J_{f_k}(x_{k-1})|.
$$

Composition multiplies volume factors, and logarithms turn those products into sums. Triangular Jacobians are useful because their determinant is just a diagonal product. This chapter supplies the algebra behind the density correction; training a flow is later work.

Even when every matrix entry is representable, the determinant can overflow or underflow. For a 4×4 diagonal matrix with entries \(10^{100}\), the determinant is \(10^{400}\), while its log-magnitude is the manageable number \(400\log10\). Store **sign and log absolute determinant separately**. For an LU factorization this is a swap/pivot sign ledger plus \(\sum_i\log|u_{ii}|\). A computed zero pivot instead gives sign 0 and log-magnitude \(-\infty\).

[NumPy's `slogdet`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.slogdet.html) returns this pair and avoids forming the raw determinant product. [PyTorch's `torch.linalg.slogdet`](https://docs.pytorch.org/docs/stable/generated/torch.linalg.slogdet.html) provides the same real-valued convention. Log storage addresses range limits; it does not repair information lost through cancellation or make a nearly singular input insensitive to perturbations.

> **Practice — Foundation:** Find the determinant of \(\operatorname{diag}(10^6,10^{-6})\). Does it certify equal stretching in every direction?
>
> **Hint:** Multiply the two axis factors, then compare them individually. The product discards their imbalance.
>
> **Practice — Core:** Derive the sign and log-magnitude from an upper-triangular factor and the number of row swaps.
>
> **Hint:** Keep the swap sign and the signs of all diagonal entries. Add logarithms of their absolute values, handling a zero pivot separately.
>
> **Practice — Stretch:** Two invertible flow steps have determinant −2 and −3. State the combined orientation and the log-density correction.
>
> **Hint:** The signs multiply, while density uses absolute values. Convert the total expansion into a subtraction from log density.

## 10. Three runnable coding labs

Inputs are nonempty square matrices represented by lists of rows, with finite real entries excluding booleans. Preserve input lists and raise `ValueError` on malformed data. The supplied `_validated_matrix(matrix, 1e-12, square=True)` validates and copies inputs; its required tolerance argument is unused by these determinant algorithms. These small floating-point tasks do not certify exact rank. Non-finite arithmetic results must raise `ValueError`; raw products may still underflow to zero. Use moderate inputs here, and use sign/log storage for the range experiments in Track B.

### Lab A — elimination with a sign ledger

Implement **det_by_elimination** in [labs/exercises.py](../../labs/exercises.py). Return a scalar determinant using partial-pivoted elimination, recording row swaps and leaving pivot rows unnormalized. Return zero if a largest available pivot is exactly zero in the working arithmetic. Do not use an absolute cutoff that would erase a small nonzero diagonal matrix. A 1×1 matrix returns its sole entry; a singular matrix is valid input, not an exception.

Predict −4 for the worked 3×3 matrix in section 4, and −1 for the matrix that swaps two coordinate axes.

~~~text
python -m labs.checks det-by-elimination
~~~

### Lab B — test a volume factor on a different cell

Implement **volume_ratio** in [labs/exercises.py](../../labs/exercises.py). Given `(matrix, basis)`, return \(\operatorname{vol}(AB)/\operatorname{vol}(B)\), where B is the square basis matrix. Require matching sizes and a nonzero computed determinant of B. A singular A is allowed and returns zero. The browser supplies `det_by_elimination` so this task can run independently. Compute the image AB and compare its volume with the source volume; use \(|\det A|\) as an independent check of your result.

For \(A=\begin{pmatrix}2&1\\0&-3\end{pmatrix}\) and \(B=\begin{pmatrix}1&1\\0&2\end{pmatrix}\), the source volume is 2, image volume 12, and ratio 6. Reversing B's orientation cannot make the ratio negative. Reject a computed zero source volume rather than dividing by it.

~~~text
python -m labs.checks volume-ratio
~~~

### Lab C — retain the pieces, not only the answer

Implement **cofactor_2x2** in [labs/exercises.py](../../labs/exercises.py). Require exactly 2×2 input and return `([ad, -bc], ad-bc)` for row entries `[[a,b],[c,d]]`. These are the signed **contributions**, including the multiplying entries, rather than the cofactor matrix itself. For `[[2,1],[1,3]]`, return `([6,-1],5)`; for `[[1,1],[1,1]]`, return `([1,-1],0)`. The latter exposes collapse as cancellation.

~~~text
python -m labs.checks cofactor-2x2
~~~

Checks include sign changes, multiple swaps, zero pivots, singular and tiny nonzero matrices, nonstandard source cells, input preservation, malformed shapes, booleans, and non-finite data. Passing these checks supports the implementation; the written proofs explain why it computes the intended quantity.

## 11. Exercises · by hand

**A1 · Foundation · paper — one cell, two numbers.** For \(A=\begin{pmatrix}2&1\\1&3\end{pmatrix}\), find the signed determinant, ordinary area, and signed first-row cofactor contributions.

**A2 · Foundation · paper — slide, swap, scale.** Start with columns \(u=(2,1),v=(1,3)\). Find the determinants of \([u\ v+4u]\), \([v\ u]\), and \([-2u\ v]\).

**A3 · Core · paper — derive the subtraction.** Derive \(ad-bc\) from the three defining properties. Include the argument that a column swap negates D.

**A4 · Core · paper — uniqueness without division.** Prove every alternating multilinear F on n columns equals \(F(e_1,\ldots,e_n)\det\), including when the value on the standard basis is zero.

**A5 · Core · paper — a swap ledger.** Compute \(\det\begin{pmatrix}0&2&1\\1&1&0\\2&0&1\end{pmatrix}\) by elimination. Record each row operation.

**A6 · Core · paper — two cofactor views.** For \(A=\begin{pmatrix}2&1&0\\1&2&1\\1&0&2\end{pmatrix}\), give the first-column and first-row contributions and reconcile their sums.

**A7 · Core · paper — composition including collapse.** Prove \(\det(AB)=\det A\det B\) without assuming either factor is invertible.

**A8 · Foundation · paper — scale all columns.** For a 3×3 A with \(\det A=-2\), compute \(\det(-2A)\), \(\det(A^{\mathsf T})\), and \(\det(A^{-1})\).

**A9 · Core · paper — a QR volume certificate.** A square QR has positive R diagonal \((2,3,1/2)\) and \(\det Q=-1\). Find volume and signed determinant. Explain geometrically why multiplying the original column lengths generally fails.

**A10 · Stretch · paper — orientation cannot jump.** Prove a continuous matrix path from \(I_3\) to \(\operatorname{diag}(1,1,-1)\) contains a singular matrix. Must every path between two positive-determinant matrices stay invertible?

**A11 · Core · paper — mass is not signed.** A uniform source has density 1 on \([0,1]^2\). Apply \(y=\operatorname{diag}(-2,3)x+(4,1)\). Give the output rectangle, its area, and its density.

**A12 · Stretch · paper — local invertibility is insufficient.** For \(f(s,t)=(e^s\cos t,e^s\sin t)\), the supplied Jacobian has determinant \(e^{2s}>0\). Explain why f on all of \(\mathbb R^2\) is not globally one-to-one and why a single-preimage density formula is unjustified.

## 12. Exercises · NumPy

**B1 · Foundation · NumPy — verify the sign ledger.** Compare `np.linalg.det` with your elimination routine on A5, an identity, a row-swapped identity, and a singular matrix. State a numerical comparison tolerance.

**B2 · Core · NumPy — same map, different cells.** For \(A=\begin{pmatrix}2&1\\0&-3\end{pmatrix}\), compare absolute volume ratios on B=I, \(B=\begin{pmatrix}1&1\\0&2\end{pmatrix}\), and B with its columns swapped.

**B3 · Core · NumPy — a product can exceed storage.** In float64 use 4×4 diagonal matrices with every diagonal entry \(10^{100}\), then \(10^{-100}\). Compare `det` and `slogdet`; predict both log-magnitudes.

**B4 · Core · NumPy — small is not the same as fragile.** Compare \(10^{-6}I_3\) and \(\operatorname{diag}(10^6,10^{-6})\). Record determinants and the output lengths of all coordinate unit vectors. Explain why determinant alone cannot summarize directional distortion.

**B5 · Core · NumPy — when the input already collapsed.** For \(A_\varepsilon=\begin{pmatrix}1&1\\1&1+\varepsilon\end{pmatrix}\), sweep \(\varepsilon=10^{-4},10^{-8},10^{-12},10^{-16}\) in float64. Print the stored bottom-right entry minus 1 before computing either determinant formula.

**B6 · Stretch · NumPy — volume from QR.** Use library QR on the 3×3 example in A6 and on the 3×2 matrix with columns \((1,1,0),(1,0,1)\). Compare the product of absolute R diagonals with the appropriate cell volume.

## 13. Exercises · PyTorch

**C1 · Foundation · PyTorch — batch the orientations.** Create a float64 batch containing \(I_2\), \(\operatorname{diag}(-1,1)\), and \(\operatorname{diag}(1,0)\). Use `torch.linalg.slogdet`. Predict the sign and log-magnitude for each.

**C2 · Core · PyTorch — an affine density calculation.** For \(A=\operatorname{diag}(-2,3)\), take source log-density −2 at x. Use `slogdet` to compute the output log-density at Ax. Explain why `log(det(A))` is unsuitable over the reals.

**C3 · Core · PyTorch — compose without losing the sign.** Let \(A=\operatorname{diag}(-2,1)\), \(B=\begin{pmatrix}1&1\\0&-3\end{pmatrix}\). Verify that product signs multiply and log-magnitudes add. Compare AB and BA.

**C4 · Stretch · PyTorch — triangular flow bookkeeping.** A supplied local Jacobian is \(J=\begin{pmatrix}1&0\\5&2\end{pmatrix}\). Verify its volume factor, then replace 5 by several large and small finite values. State what remains fixed and what the experiment does not establish.

## 14. Derivations to own

1. A swap changes the sign, derived from multilinearity and alternation.
2. Existence and uniqueness via the permutation expansion, including the zero-normalization case.
3. Transpose invariance, row-operation factors, and the pivot-product formula.
4. Multiplicativity without invertibility assumptions.
5. QR heights give unsigned volume; the orthogonal factor supplies orientation.
6. Cofactors as signed coordinate contributions, not necessarily disjoint pieces.
7. The affine density correction from conservation of mass, and additive log corrections under composition.

State which claims are exact algebra, which use Euclidean geometry, and which invoke a calculus theorem. A numerical experiment cannot replace any of those assumptions.

## 15. Exercises · cumulative

**M1 · Core · paper — collapse through the four subspaces.** For \(A=\begin{pmatrix}1&2\\2&4\end{pmatrix}\), find its determinant, rank, and bases for all four fundamental subspaces. Connect zero area to the null space.

**M2 · Core · paper — the projection keeps lengths selectively.** For the orthogonal projector \(P=\operatorname{diag}(1,1,0)\), find the determinant and rank. Explain why P preserves every vector in its range despite its zero determinant.

**M3 · Core · paper — the same operator in another basis.** For invertible S, prove A and \(S^{-1}AS\) have the same determinant. Contrast this with the cell whose edge matrix is AS.

**M4 · Stretch · paper — rectangular volume from the Gram matrix.** For A with columns \((1,1,0),(1,0,1)\), compute \(A^{\mathsf T}A\), its determinant, and the embedded area. Explain why no scalar determinant of A was used.

**M5 · Core · mixed — RREF erased the scale.** Both \(I_2\) and \(\operatorname{diag}(2,3)\) reduce to I. Give their determinants and explain why RREF alone cannot recover them.

**M6 · Stretch · paper — a fixed metric changes the unit.** Let G be positive definite and define a square cell B\'s metric volume as \(\sqrt{\det(B^{\mathsf T}GB)}\). For invertible B and A, show that applying A changes this volume by \(|\det A|\) when the same G is used before and after.

## 16. Exercises · checkpoint

**K1 · Foundation · gate — read the signed cell.** For \(A=\begin{pmatrix}1&2\\3&4\end{pmatrix}\), find determinant, ordinary area, orientation sign, and the factor by which a density changes under A.

**K2 · Core · gate — define and force.** State the three defining properties and prove they force a unique function. Explain why separate linearity does not imply additivity in the whole matrix.

**K3 · Core · gate — compute and audit a sign.** Compute \(\det\begin{pmatrix}0&1&0\\0&0&2\\3&0&0\end{pmatrix}\) by elimination. State swap count, volume, and orientation.

**K4 · Core · gate — composition with a singular case.** Prove determinant multiplicativity and use it to explain why composing any square map with a singular map has zero determinant.

**K5 · Stretch · gate — reject a numerical conclusion.** A report says “determinant 1 means no distortion; determinant \(10^{-18}\) means unusable; log storage fixes near dependence.” Refute all three claims with examples or mechanisms.

**K6 · Stretch · gate — transfer to a nonlinear cell.** For \(f(s,t)=(s,e^s t)\), use the supplied Jacobian from section 8. At \(s=\log2\), find the volume and density factors. Derive the output density formula at arbitrary y and verify that a unique inverse exists.

## Mastery check

You should be able to derive a determinant from its defining properties, compute one without losing a swap sign, distinguish volume from orientation and directional distortion, and explain a density correction by conserving mass. Bring one proof, one tested implementation, and one counterexample to an overclaim about determinants.

The next module studies eigenvalues, invariant subspaces, and diagonalization. Determinants will define the characteristic polynomial; this chapter's computation warning still applies. A useful algebraic definition need not be the best numerical algorithm.
