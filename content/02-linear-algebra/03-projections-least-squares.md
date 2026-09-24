---
id: math.linear-algebra.projections-least-squares
title: Inner products, orthogonality, projection and least squares
prerequisites: [math.linear-algebra.linear-maps-rank]
estimated_hours: 30
answers: 03-projection
---

# Inner products, orthogonality, projection and least squares

Elimination tells you whether a target is reachable. When it is not, you need a new question: which reachable target is closest? “Closest” requires a choice of geometry. Make that choice explicitly, and least squares becomes a theorem about a vector and its shadow.

## 0. Where this is going

Module 1 previewed inner products for overlap experiments. Module 2 counted the four fundamental subspaces. This module connects them through four results:

| Result | What it buys you |
|---|---|
| Cauchy–Schwarz and the induced norm | Length, distance, and a well-defined cosine |
| Orthogonal-complement identities | The right angles in the four-subspace diagram |
| The projection theorem | A unique nearest point in every subspace |
| The normal equations | Least-squares fitted values, residuals, and coefficient ambiguity |

All spaces here are finite-dimensional and real. Vectors are columns. A design matrix \(A\in\mathbb R^{m\times n}\) has observations in rows and features in columns; its coefficient vector lives in \(\mathbb R^n\), while targets, fitted values, and residuals live in \(\mathbb R^m\). Keeping those two spaces separate is half the work.

Read sections 1–10, attempting each Foundation / Core / Stretch prompt. Explore the two new figures and the map from Module 2. Section 11 contains three standard-library Python tasks that run in this page; NumPy and PyTorch exercises run locally. Finish the exercise bank, derivations, cumulative set, and six-problem checkpoint. Thirty hours is a study estimate including proofs, experiments, and revision, not reading time.

## 1. An inner product is a choice

A real **inner product** on a vector space is a function \(\langle u,v\rangle\) that is symmetric, linear in each argument, and positive definite:

$$
\langle u,v\rangle=\langle v,u\rangle,\qquad
\langle au+bw,v\rangle=a\langle u,v\rangle+b\langle w,v\rangle,\qquad
\langle v,v\rangle>0\quad(v\ne0).
$$

Linearity and symmetry give linearity in the second argument. They also give \(\langle 0,v\rangle=0\). Positivity rules out a nonzero direction that costs nothing, and rules out a direction with negative squared length.

In coordinates, every such choice has the form

$$
\langle u,v\rangle_G=u^{\mathsf T}Gv,
\qquad G=G^{\mathsf T},\qquad z^{\mathsf T}Gz>0\ (z\ne0).
$$

To see why, take \(G_{ij}=\langle e_i,e_j\rangle\) and expand both vectors in the standard basis. Symmetry and positivity of the inner product become precisely the displayed matrix conditions. A symmetric matrix with this positivity property is **positive definite**. A matrix of overlaps among generators is also called a Gram matrix; here \(G\) specifies the ambient geometry, whereas \(B^{\mathsf T}GB\) will record overlaps among the columns of \(B\).

**Worked example.** Choose \(G=\operatorname{diag}(1,4)\). Then \(\|(x,y)\|_G^2=x^2+4y^2\): a unit change in the second coordinate costs twice as much in length as a unit change in the first. The vectors \(u=(1,1)\) and \(v=(1,-1)\) have ordinary dot product zero but \(u^{\mathsf T}Gv=-3\). Orthogonality is a statement about the vectors **and** the metric.

The forms from \(\operatorname{diag}(1,0)\) and \(\operatorname{diag}(1,-1)\) fail for different reasons. The first gives \(e_2\) zero length; the second gives it negative squared length. Neither is an inner product on all of \(\mathbb R^2\).

> **Practice — Foundation:** Evaluate \(\langle(1,2),(3,-1)\rangle_G\) for \(G=\operatorname{diag}(1,4)\).
>
> **Hint:** First multiply the second vector by G, then take the ordinary dot product with the first. The second coordinate receives weight 4.
>
> **Practice — Core:** Show directly that \(G=\begin{pmatrix}2&1\\1&2\end{pmatrix}\) is positive definite by writing its quadratic form as a sum of positive squares.
>
> **Hint:** Expand the quadratic form and compare it with x²+y²+(x+y)². Explain why the sum is strictly positive away from the origin.
>
> **Practice — Stretch:** For the nonsymmetric \(G=\begin{pmatrix}1&1\\-1&1\end{pmatrix}\), show that \(v^{\mathsf T}Gv>0\) for every nonzero \(v\), then compute \(e_1^{\mathsf T}Ge_2\) and \(e_2^{\mathsf T}Ge_1\). Which inner-product axiom fails, and why can a positive quadratic form not detect it?
>
> **Hint:** Expanding gives vᵀGv=x²+y² because the off-diagonal entries 1 and −1 cancel. The two mixed values are G₁₂=1 and G₂₁=−1, so the form is not symmetric.

## 2. Length, distance, and Cauchy–Schwarz

Define \(\|v\|_G=\sqrt{\langle v,v\rangle_G}\). Positivity makes this a nonnegative real number, zero only at the zero vector. Bilinearity gives \(\|cv\|_G=|c|\|v\|_G\). The remaining norm property is the triangle inequality; its engine is the following result.

**Theorem 8 — Cauchy–Schwarz.**

$$
|\langle u,v\rangle_G|\le\|u\|_G\|v\|_G.
$$

*Proof.* If \(v=0\), both sides vanish. Otherwise positivity gives

$$
0\le\left\|u-\frac{\langle u,v\rangle_G}{\langle v,v\rangle_G}v\right\|_G^2
=\|u\|_G^2-\frac{\langle u,v\rangle_G^2}{\|v\|_G^2}.
$$

Rearrange and take square roots. Equality holds exactly when the vector inside the norm is zero, that is, when \(u\) is a multiple of \(v\); include a zero vector as an equality case. This proof uses only positivity and bilinearity, not a picture of angles.

Now expand \(\|u+v\|_G^2\) and bound the cross term by Cauchy–Schwarz to get \(\|u+v\|_G\le\|u\|_G+\|v\|_G\). Distance is \(d_G(u,v)=\|u-v\|_G\). For **nonzero** vectors, the quotient

$$
\cos\theta_G=\frac{\langle u,v\rangle_G}{\|u\|_G\|v\|_G}
$$

lies in \([-1,1]\). That range is a theorem, not a numerical convention. A computed cosine slightly outside it can result from rounding; a zero vector has no defined cosine.

Orthogonality means \(\langle u,v\rangle_G=0\). It gives **Pythagoras**: \(\|u+v\|_G^2=\|u\|_G^2+\|v\|_G^2\). Conversely, expanding this equality shows that its cross term vanishes. Nonzero pairwise orthogonal vectors are independent: take the inner product of a zero combination with each vector in turn.

> **Practice — Foundation:** Find \(\|(3,2)\|_G\) for \(G=\operatorname{diag}(1,4)\).
>
> **Hint:** Use the weighted sum of coordinate squares before taking the square root. A weight on squared length acts through its square root on length.
>
> **Practice — Core:** Derive the triangle inequality, including the step that bounds the cross term.
>
> **Hint:** Expand the squared norm of u+v. Bound the cross term by Cauchy–Schwarz, then recognize the square of a sum of lengths.
>
> **Practice — Stretch:** Prove that a family of nonzero pairwise \(G\)-orthogonal vectors is independent; explain why the nonzero assumption matters.
>
> **Hint:** Take the inner product of a proposed zero combination with each family member. Orthogonality removes every term except its own positive squared length.

## 3. Orthogonal complements earn the four-subspace picture

For a subspace \(S\subseteq\mathbb R^m\), its **orthogonal complement** is

$$
S^{\perp_G}=\{r:\langle s,r\rangle_G=0\text{ for every }s\in S\}.
$$

It is a subspace: zero satisfies every condition, and bilinearity preserves the conditions under addition and scaling. It suffices to test a basis of \(S\), since every other vector in \(S\) is a combination of that basis. Also \(S\cap S^{\perp_G}=\{0\}\): a vector in both is orthogonal to itself, so positivity forces it to vanish.

**Theorem 9 — the four-subspace orthogonality identities.** In the standard Euclidean metrics,

$$
C(A)^{\perp}=N(A^{\mathsf T}),\qquad
C(A^{\mathsf T})^{\perp}=N(A).
$$

*Proof of the first, in both directions.* A vector \(r\) is orthogonal to every column \(a_j\) exactly when every entry \(a_j^{\mathsf T}r\) of \(A^{\mathsf T}r\) is zero. Orthogonality to the columns is equivalent to orthogonality to their span. Apply the same argument to \(A^{\mathsf T}\) for the second identity. Rank–nullity now gives complement dimensions \(m-r\) and \(n-r\); together with trivial intersection, the dimension counts prove the direct sums.

Under a metric \(G\) on the **output** space the first identity becomes

$$
C(A)^{\perp_G}=N(A^{\mathsf T}G).
$$

It is generally not \(N(A^{\mathsf T})\). For \(S=\operatorname{span}\{(1,1)\}\), the Euclidean complement is the line \(r_1+r_2=0\); under \(G=\operatorname{diag}(1,4)\), it is \(r_1+4r_2=0\). The subspace did not change, but its perpendicular companion did.

Revisit the map below. Its dashed kernel consists of inputs sent to zero; it is orthogonal to the **row** space under the standard input metric. The solid image lives in the output space. If both are drawn on one canvas, their apparent angle is not a theorem relating input and output.

```lab
la-map
```

> **Practice — Foundation:** Find the Euclidean complement of \(\operatorname{span}\{(1,2)\}\).
>
> **Hint:** Write r=(r₁,r₂) and impose (1,2)ᵀr=0. Parametrize the resulting homogeneous equation.
>
> **Practice — Core:** Prove the second identity directly, without citing the first.
>
> **Hint:** Ax=0 means x has zero dot product with every row of A. Connect those rows with the columns of Aᵀ and check both implications.
>
> **Practice — Stretch:** Derive \(C(A)^{\perp_G}=N(A^{\mathsf T}G)\) and explain why invertibility of \(G\) preserves the complement's dimension.
>
> **Hint:** Express orthogonality as one equation per column of A. Multiplication by invertible G does not change rank, so apply rank–nullity to AᵀG.

<details><summary>Predict before computing: does a new metric change the null space?</summary>

For a fixed matrix \(A\), changing the metric does not change the equation \(Ax=0\) or its null space. It can change which output residuals are called perpendicular to \(C(A)\). Keep the map, the metric, and the coordinate description separate.

</details>

## 4. Projecting onto a line

Let \(u\ne0\). Seek a point \(p=\alpha u\) on its span whose residual \(r=x-p\) is \(G\)-orthogonal to the line. The single orthogonality condition is

$$
0=u^{\mathsf T}G(x-\alpha u),\qquad
\alpha=\frac{u^{\mathsf T}Gx}{u^{\mathsf T}Gu},\qquad
p=\frac{uu^{\mathsf T}G}{u^{\mathsf T}Gu}x.
$$

The denominator is positive because \(G\) is positive definite and \(u\ne0\). This is why a zero generator must be handled separately: projection onto the zero subspace is zero, but the displayed formula would divide by zero.

**Worked example.** For \(x=(2,0)\), \(u=(1,1)\), Euclidean projection gives \(p=(1,1)\), \(r=(1,-1)\). With \(G=\operatorname{diag}(1,4)\), it gives \(p=(2/5,2/5)\), \(r=(8/5,-2/5)\). The ordinary dot product \(u^{\mathsf T}r=6/5\) is nonzero, but \(u^{\mathsf T}Gr=0\). Both are correct projections, for different distances.

For any other point \(q=\beta u\), the difference \(p-q\) lies along the line and is orthogonal to \(r\). Pythagoras therefore gives

$$
\|x-q\|_G^2=\|r\|_G^2+\|p-q\|_G^2.
$$

The smallest value occurs only at \(q=p\). Orthogonality produced a **unique nearest point**, not merely a plausible-looking foot of a perpendicular.

In the next figure first move the candidate-coefficient sliders to find a good approximation. Then reveal the nearest point and compare the excess error with the squared distance from your candidate to that point. This is the identity used in the proof, made measurable. Drag the target and the generators; drag empty canvas to rotate the 3D view. Toggle line/plane and the metric \(I\) or \(\operatorname{diag}(1,4,1)\). A camera rotation changes only the drawing. A metric change can move the projection. The readout checks generator–residual inner products in the chosen metric, since screen angles cannot certify 3D orthogonality. The collapsed and zero presets expose why “two handles” need not mean “a plane.”

```lab
la-project
```

> **Practice — Foundation:** Project \((3,1)\) onto the span of \((1,0)\) under the standard metric.
>
> **Hint:** The target’s component along the first coordinate axis is retained; the perpendicular component becomes the residual. Verify the residual dot product.
>
> **Practice — Core:** Reconstruct both metric-dependent projections in the worked example, including each residual check.
>
> **Hint:** For each metric compute α=(uᵀGx)/(uᵀGu), then p=αu and r=x−p. Test uᵀGr using the same metric as in the coefficient.
>
> **Practice — Stretch:** Show that replacing \(u\) by any nonzero scalar multiple leaves the projection unchanged, even though its coefficient changes.
>
> **Hint:** Replace u by cu in the coefficient formula. Track one factor of c in the numerator and two in the denominator before multiplying by cu.

## 5. The projection theorem for every subspace

A line needed one orthogonality equation. A \(k\)-dimensional subspace needs \(k\) of them. Let \(B\in\mathbb R^{m\times k}\) have independent columns spanning \(S\). Write \(p=Bc\); the residual condition becomes

$$
B^{\mathsf T}G(x-Bc)=0,\qquad
Hc=B^{\mathsf T}Gx,\qquad H=B^{\mathsf T}GB.
$$

For \(c\ne0\), independence gives \(Bc\ne0\), hence \(c^{\mathsf T}Hc=(Bc)^{\mathsf T}G(Bc)>0\). So \(H\) is positive definite and invertible: a nonzero null vector would contradict that inequality. This proves existence and uniqueness of \(c\) using Module 2's solvability results.

**Theorem 10 — orthogonal decomposition and nearest point.** Every \(x\) has a unique decomposition

$$
x=p+r,\qquad p\in S,\quad r\in S^{\perp_G}.
$$

Moreover, \(p\) is the unique minimizer of \(\|x-q\|_G\) over \(q\in S\).

*Proof.* The Gram system above constructs \(p\) and \(r\). For any \(q\in S\), expand \(x-q=r+(p-q)\). Orthogonality gives

$$
\|x-q\|_G^2=\|r\|_G^2+\|p-q\|_G^2\ge\|r\|_G^2,
$$

with equality only at \(q=p\). If another orthogonal decomposition existed, the difference of its subspace components would belong to \(S\cap S^{\perp_G}=\{0\}\), proving uniqueness directly. For \(S=\{0\}\), set \(p=0,r=x\); for \(S=\mathbb R^m\), set \(p=x,r=0\). Thus \(\dim S^{\perp_G}=m-\dim S\) and \((S^{\perp_G})^{\perp_G}=S\).

**Worked example — a plane without a special basis.** Take \(b_1=(1,0,1)\), \(b_2=(0,1,1)\), and \(x=(1,1,0)\), with \(G=I\). Then

$$
B^{\mathsf T}B=\begin{pmatrix}2&1\\1&2\end{pmatrix},\quad
B^{\mathsf T}x=(1,1)^T,\quad c=(1/3,1/3)^T.
$$

So \(p=(1/3,1/3,2/3)\), \(r=(2/3,2/3,-2/3)\). Both generators have dot product zero with \(r\), and the squared distance is \(4/3\). The basis was neither normalized nor orthogonal. Nothing in the theorem required that convenience.

> **Practice — Foundation:** Check both generator–residual dot products in the plane example.
>
> **Hint:** Dot the displayed residual with each generator independently. A residual perpendicular to their basis is perpendicular to the whole plane.
>
> **Practice — Core:** Prove that \(B^{\mathsf T}GB\) is invertible exactly when \(B\)'s columns are independent.
>
> **Hint:** For a coefficient vector z, write zᵀBᵀGBz=(Bz)ᵀG(Bz). Use positivity and distinguish Bz=0 from z=0.
>
> **Practice — Stretch:** Prove the double-complement identity using inclusion and dimensions; state where finite dimension is used.
>
> **Hint:** Every vector in S is perpendicular to S⊥, giving inclusion. Compare dimensions of S and its double complement to turn inclusion into equality.

## 6. What makes a projection orthogonal?

The map taking \(x\) to its nearest point is linear. Its matrix is

$$
P_G=B(B^{\mathsf T}GB)^{-1}B^{\mathsf T}G.
$$

The inverse is a derivation device: compute its action by solving the Gram system, not by explicitly inverting it. Because the result is the unique nearest point, replacing \(B\) by another basis of the same \(S\) cannot change \(P_G\).

Two properties characterize this projector:

$$
P_G^2=P_G,\qquad P_G^{\mathsf T}G=GP_G.
$$

The first is **idempotence**: a point already in the subspace stays there. The second is **self-adjointness in the metric**: \(\langle P_Gx,y\rangle_G=\langle x,P_Gy\rangle_G\). Substituting the formula proves both; use the symmetry of \(G\) and of \((B^{\mathsf T}GB)^{-1}\). For \(G=I\), self-adjointness is ordinary symmetry \(P^{\mathsf T}=P\).

Conversely, suppose \(P^2=P\) and \(P^{\mathsf T}G=GP\). Then \(Px\) lies in \(C(P)\), while for every \(s=Py\),

$$
\langle s,(I-P)x\rangle_G=y^{\mathsf T}P^{\mathsf T}G(I-P)x
=y^{\mathsf T}G(P-P^2)x=0.
$$

By the projection theorem, \(P\) is the orthogonal projector onto \(C(P)\). This proves sufficiency, not just a list of properties true for one formula.

**Counterexample — idempotence alone.** The matrix \(Q=\begin{pmatrix}1&1\\0&0\end{pmatrix}\) satisfies \(Q^2=Q\), but sends \(e_2\) to \(e_1\), not to the nearest point zero on the x-axis. It is an **oblique** projector in Euclidean geometry: its kernel determines a slanted direction along which it projects. Meanwhile a \(G\)-orthogonal projector can look nonsymmetric in ordinary coordinates. For the line \((1,1)\) and \(G=\operatorname{diag}(1,4)\),

$$
P_G=\frac15\begin{pmatrix}1&4\\1&4\end{pmatrix}.
$$

It is not symmetric, but it satisfies the correct metric identity. Also \(I-P_G\) projects onto \(S^{\perp_G}\), and Pythagoras gives \(\|P_Gx\|_G\le\|x\|_G\). That contraction need not hold in a different norm.

> **Practice — Foundation:** Compute \(Qe_2\) and \(Q^2\) for the oblique example.
>
> **Hint:** Multiplication by e₂ selects the second column. For Q² multiply explicitly, and compare the range direction with the direction removed.
>
> **Practice — Core:** Verify idempotence and metric self-adjointness for the displayed \(P_G\).
>
> **Hint:** Multiply P_G by itself. For the metric identity, compare G P_G with P_Gᵀ G; ordinary symmetry is a separate condition.
>
> **Practice — Stretch:** Prove that a projector has range \(S\) and kernel \(S^{\perp_G}\) exactly when it is the \(G\)-orthogonal projector onto \(S\).
>
> **Hint:** Use x=Px+(I−P)x for an idempotent map. Place the two terms in its range and kernel, then invoke uniqueness of orthogonal decomposition.

## 7. Least squares is projection in observation space

For \(A\in\mathbb R^{m\times n}\) and \(y\in\mathbb R^m\), consider

$$
\min_w\|y-Aw\|_2^2.
$$

Every candidate \(Aw\) lies in \(C(A)\), and every point of \(C(A)\) has such a recipe. Thus the projection theorem solves the geometric problem even when \(Aw=y\) has no solution.

**Theorem 11 — the normal equations.** A vector \(\hat w\) minimizes the squared residual exactly when

$$
A^{\mathsf T}(y-A\hat w)=0,
\qquad\text{equivalently}\qquad
A^{\mathsf T}A\hat w=A^{\mathsf T}y.
$$

*Proof.* By Theorem 10 a fitted point is nearest exactly when its residual is orthogonal to \(C(A)\); Theorem 9 translates that condition into the equations. For an algebraic check, expand any perturbation \(h\):

$$
\|y-A(\hat w+h)\|^2=\|r\|^2-2h^{\mathsf T}A^{\mathsf T}r+\|Ah\|^2.
$$

If \(A^{\mathsf T}r=0\), no perturbation improves the objective. If it is nonzero, set \(h=tA^{\mathsf T}r\); a sufficiently small positive \(t\) makes the negative linear term dominate the quadratic term. This proves necessity without assuming differentiation as a prerequisite.

**Worked example — three points, two features.** Fit \(a+bt\) to \((t,y)=(0,1),(1,2),(2,2)\). Then

$$
A=\begin{pmatrix}1&0\\1&1\\1&2\end{pmatrix},\qquad
A^{\mathsf T}A=\begin{pmatrix}3&3\\3&5\end{pmatrix},\qquad
A^{\mathsf T}y=(5,6)^T.
$$

Elimination gives \((a,b)=(7/6,1/2)\), fitted values \(\hat y=(7/6,5/3,13/6)\), and \(r=(-1/6,1/3,-1/6)\). Check \(\sum_i r_i=0\) and \(\sum_i t_ir_i=0\): these are the two normal equations. The squared error is \(1/6\).

The fitted **line** lives in the two-dimensional data plot. Its vector of three fitted heights lives in \(\mathbb R^3\), in the plane spanned by \((1,1,1)\) and \((0,1,2)\). The residual is perpendicular to that plane, not generally perpendicular to the fitted line in the data plot. Least squares here measures **vertical** errors; orthogonal distance to a line would be a different fitting problem.

Drag the three observations below. The left canvas shows vertical residuals; the right canvas shows \(y=\hat y+r\) in observation space. The equal-input preset makes both design columns dependent: the fitted vector remains well defined even though intercept and slope are ambiguous.

```lab
la-lsq
```

> **Practice — Foundation:** Verify the two residual sums and squared error in the worked example.
>
> **Hint:** Compute the dot products with the constant and input columns. Sum the three squared residual entries separately.
>
> **Practice — Core:** Use the perturbation expansion to prove sufficiency of the normal equations without calculus.
>
> **Hint:** At a normal-equations solution, the perturbation expansion’s cross term vanishes. The remaining change is a squared norm and hence nonnegative.
>
> **Practice — Stretch:** When the design has no constant column, must residuals sum to zero? Give a counterexample.
>
> **Hint:** Try a single-column design A=(1,0)ᵀ and a target with nonzero second coordinate. Orthogonality to that column does not impose orthogonality to the constant vector.

<details><summary>Predict before revealing: can the residual be nonzero when every normal equation is exactly satisfied?</summary>

Yes. In the worked example the residual is \((-1/6,1/3,-1/6)\), and both normal equations vanish. They certify that no attainable change in fitted values can reduce the error; they do not assert that the target is attainable. The residual is in the complement, not necessarily zero.

</details>

## 8. Unique fitted values, ambiguous coefficients

If \(A\) has full column rank, \(A^{\mathsf T}A\) is positive definite and the coefficient vector is unique. If columns are dependent, its Gram matrix is singular. That does **not** destroy the nearest point: the subspace still exists, and Theorem 10 still applies.

Let \(\hat w\) be any minimizer. Every minimizer gives the same fitted vector, so the full coefficient solution set is

$$
\hat w+N(A).
$$

Indeed, adding a null vector changes no fitted value; conversely, two minimizers share the unique projection and their difference is in \(N(A)\). This is Module 2's affine solution theorem applied to \(Aw=\hat y\). The normal equations are always consistent in exact arithmetic, including when singular, because this projection has at least one coefficient representation.

**Worked example.** Let \(A=\begin{pmatrix}1&1\\2&2\end{pmatrix}\), \(y=(1,0)\). Its column space is the line generated by \((1,2)\). Projection gives \(\hat y=(1/5,2/5)\), \(r=(4/5,-2/5)\), squared error \(4/5\). Every coefficient pair with \(w_1+w_2=1/5\) is optimal. Choosing free variables to be zero gives one representative; it does not in general select the smallest Euclidean coefficient norm. Module 10 studies that extra criterion and the pseudoinverse.

For a zero matrix, every coefficient vector is optimal, \(\hat y=0\), and \(r=y\). For full row rank with more columns than rows, every target can be fitted exactly, but coefficients remain nonunique. A zero training residual says nothing by itself about generalization.

> **Practice — Foundation:** Give two distinct minimizing coefficient pairs in the duplicate-column example.
>
> **Hint:** With duplicate columns, fitted values depend only on the sum of two coefficients. Keep that sum fixed while redistributing its value.
>
> **Practice — Core:** Prove that all minimizers form \(\hat w+N(A)\), including both inclusions.
>
> **Hint:** Two minimizing fits equal the same unique projection, so their coefficient difference lies in N(A). Conversely adding a null vector preserves the fit.
>
> **Practice — Stretch:** Compare the free-variable-zero representative and the minimum-norm representative for the duplicate columns. Which is a convention and which requires an additional objective?
>
> **Hint:** Among pairs with a fixed sum, expand the sum of their squares around the equal split. Setting a free variable to zero need not minimize this norm.

## 9. Weighted residuals and changed coordinates

Choose a positive definite metric \(G\) in observation space. The weighted problem is

$$
\min_w (y-Aw)^{\mathsf T}G(y-Aw),\qquad
A^{\mathsf T}GA\hat w=A^{\mathsf T}Gy.
$$

The same projection proof works with every inner product replaced by its \(G\)-version. For diagonal \(G=\operatorname{diag}(g_i)\), the loss is \(\sum_i g_i r_i^2\); positive weights change how costly each observation's error is. General positive definite \(G\) can include cross terms. Its statistical interpretation requires a noise model, developed in the probability track; geometry alone does not establish that one weighting is statistically justified.

**Worked example.** Approximate \(y=(0,2)\) by a constant \(c\). Ordinary least squares gives \(c=1\). With weights \((1,3)\), the normal equation is \(4c=6\), giving \(c=3/2\). The weighted residual sums to zero, \(1(-3/2)+3(1/2)=0\), while its ordinary sum is \(-1\). The orthogonality condition changed with the metric.

A **coordinate change** is different from changing that metric. If \(x=Bc\) and \(z=Bd\) for invertible \(B\), the same inner product is

$$
x^{\mathsf T}Gz=c^{\mathsf T}(B^{\mathsf T}GB)d.
$$

If an operator's original projector is \(P_G\), its coordinate matrix is \(B^{-1}P_GB\). Transforming the metric and the projector together preserves the physical projection. Using a raw coordinate dot product instead chooses a new geometry.

**ML anchor — similarity has assumptions.** The cosine between two activation vectors depends on the metric and on the coordinate convention. A reparameterization can preserve downstream logits while changing raw Euclidean cosines. Before comparing representation similarities, specify how coordinates and metrics are aligned. A large cosine alone proves neither semantic equivalence nor causal importance.

> **Practice — Foundation:** Compute the ordinary and weighted residual sums for the constant-fit example.
>
> **Hint:** Use the same residual vector for both sums: one uses weights 1, the other the supplied observation weights. The weighted constant fit makes only the weighted sum vanish.
>
> **Practice — Core:** Derive the weighted normal equations geometrically and state when coefficients are unique.
>
> **Hint:** Require the residual to be G-perpendicular to each design column. For uniqueness examine whether two coefficient vectors can produce the same fitted point.
>
> **Practice — Stretch:** Prove that \(B^{-1}P_GB\) is self-adjoint under \(B^{\mathsf T}GB\), even when it is not an ordinary symmetric matrix.
>
> **Hint:** Put H=BᵀGB and T=B⁻¹P_GB. Expand TᵀH and HT, cancel adjacent inverses, then use P_GᵀG=GP_G.

## 10. A correct formula can be a poor algorithm

Normal equations are useful for reasoning and for small educational implementations. Their numerical weakness is that they form a Gram matrix. For a full-column-rank \(A\), the later SVD theory gives

$$
\kappa_2(A^{\mathsf T}A)=\kappa_2(A)^2.
$$

This is a preview, not a result you must derive from unintroduced singular values. In Module 8, writing \(A=U\Sigma V^{\mathsf T}\) will make the squared spectrum explicit. Module 9 develops conditioning and backward error. For a rank-deficient matrix the usual inverse-based condition number is infinite; the finite identity presumes full column rank.

You can already see the mechanism without SVD. Take

$$
A_\varepsilon=\begin{pmatrix}1&1\\0&\varepsilon\end{pmatrix},\qquad
A_\varepsilon^{\mathsf T}A_\varepsilon=
\begin{pmatrix}1&1\\1&1+\varepsilon^2\end{pmatrix}.
$$

In exact arithmetic both have full rank for \(\varepsilon\ne0\). At \(\varepsilon=10^{-8}\), float64 can round \(1+\varepsilon^2\) to 1. Forming the Gram matrix has erased the distinction before the solver even starts. A better elimination algorithm cannot recover information already discarded in its input. Replacing an explicit inverse by a solve is good practice, but does not undo the squaring of conditioning.

QR, developed in Module 4, solves full-rank least squares without forming this Gram matrix. SVD methods handle rank deficiency and explicit spectral cutoffs later. The browser tasks here deliberately use small matrices and standard-library elimination so the normal-equation construction is visible; they are not production solvers.

Always report the reconstruction and the residual orthogonality defect, such as \(\|A^{\mathsf T}r\|\), with a scale-aware tolerance. A small residual does not guarantee accurate coefficients, and a small normal-equation defect alone does not prove a small forward error in an ill-conditioned problem. If a Gram pivot falls below a stated threshold, report numerical rejection rather than declaring exact rank deficiency.

> **Practice — Foundation:** Form \(A_\varepsilon^{\mathsf T}A_\varepsilon\) by multiplying entries.
>
> **Hint:** Compute each entry as a column–column overlap. Identify which small squared term is added to 1.
>
> **Practice — Core:** Explain why solving the Gram system instead of explicitly inverting it does not remove the information loss in the example.
>
> **Hint:** Inspect the already stored Gram entries before choosing a solver. No method solving that rounded system can restore a term that was discarded while forming it.
>
> **Practice — Stretch:** In float64, fit \(A=\begin{pmatrix}1&1\\0&10^{-6}\\0&0\end{pmatrix}\) to \(y=(1,0,1)\) and to the perturbed \(y+(0,10^{-8},0)\), once with `np.linalg.lstsq` and once by solving the normal equations. Report both coefficient vectors and both fitted vectors in each case, and separate the change due to problem sensitivity from the extra error due to forming the Gram matrix.
>
> **Hint:** Exactly, the coefficients move from (1,0) to (0.99,0.01) while the fit moves only by 10⁻⁸. The Gram entry 1+10⁻¹² keeps only about four significant digits of its 10⁻¹² part, so the normal-equation coefficients are off by roughly 10⁻⁵ (about 0.00999 instead of 0.01).

## Local numerical and research audit

### Compare least-squares algorithms on the same problem

The normal equations establish the projection condition, but forming \(A^T A\) can be an unreliable computational route. For full column rank, \(\kappa_2(A^T A)=\kappa_2(A)^2\). Later [QR](04-orthonormal-bases-qr.md) and [SVD](08-svd-low-rank.md) solve the same geometric problem with different numerical behavior; return here after those lessons.

Use a fixed small nearly dependent design, a known coefficient vector, and a controlled perturbation in the observations. Compare residual norm, coefficient error and projection optimality \(A^Tr\), with scale-aware normalizations. State rank and tolerance policies. A good fit can coexist with unreliable coefficients; comparing residuals alone cannot rank coefficient accuracy.

**M9 · Stretch · mixed — Compare least-squares algorithms on the same problem.** A full-column-rank design has 2-norm condition number 10⁴. What is the condition number of its Gram matrix, and why can a small fitted residual coexist with a large coefficient error?

## 11. Three runnable coding labs

All three run in the reader's Python workspace using the standard library. Inputs must contain finite real numbers (not booleans), dimensions must agree, and `tol` must be positive and finite. Reject malformed inputs with `ValueError`, and preserve all input lists. The browser supplies `_validated_matrix`, `_validated_vector`, and `_solve_square`, documented in the starter support: the first two validate and copy inputs; the last solves a nonsingular small system with partial pivoting and an absolute pivot tolerance. You implement the geometry and Gram construction. Use your own elimination if you prefer.

### Lab A — projection from a basis

Implement **project_onto** in [labs/exercises.py](../../labs/exercises.py). The basis is a nonempty list of independent **columns**, each of length equal to the target. Return `(projection_matrix, projected_vector, residual)`. Use the Euclidean metric and solve the Gram system for each column of the projector. Reject dependent generators or a Gram pivot at or below `tol`; this numerical convention can reject a mathematically independent near-dependent basis. The task intentionally requires an actual nonempty basis; represent the zero-subspace projection separately in the paper exercises.

Predict: columns `[[1, 1]]` and target `[2, 0]` give matrix `[[0.5, 0.5], [0.5, 0.5]]`, projected vector `[1, 1]`, and residual `[1, -1]`.

~~~text
python -m labs.checks project-onto
~~~

Checks cover line and plane projections, a skew basis, basis changes, symmetry, idempotence, residual orthogonality, a zero target, dependent generators, input preservation, and malformed inputs.

### Lab B — normal equations, solved

Implement **normal_equations** in [labs/exercises.py](../../labs/exercises.py). The matrix is a nonempty list of **rows** with full column rank. Return `(coefficients, residual, squared_error)`. Form the Gram system, solve by elimination, then compute the residual against the original matrix. Reject a singular or numerically rejected Gram system with `ValueError`; the mathematical least-squares problem still has fitted values when coefficients are nonunique, but that extension is outside this lab's contract.

Predict: rows `[[1, 0], [1, 1], [1, 2]]` and target `[1, 2, 2]` return coefficients `[7/6, 1/2]`, residual `[-1/6, 1/3, -1/6]`, and squared error `1/6`.

~~~text
python -m labs.checks normal-equations
~~~

Checks cover exact and inconsistent targets, a fitted constant, tall and square systems, orthogonality of the returned residual, dependent features, near-dependent rejection, input preservation, and invalid shapes or values.

### Lab C — a metric must pass its own definition

Implement **gram_metric** in [labs/exercises.py](../../labs/exercises.py). Return `u^T G v` only after validating a symmetric positive definite metric of matching shape. Require exact symmetry of the supplied entries. To test positivity without eigenvalues, symmetrically eliminate the first row and column: each pivot must exceed `tol`, then replace the remaining block by its Schur complement. Do not permute rows alone. This is a small computational preview of Module 7.

The reason the test works is completion of a square:

$$
\begin{pmatrix}x\\z\end{pmatrix}^{\mathsf T}
\begin{pmatrix}a&b^{\mathsf T}\\b&C\end{pmatrix}
\begin{pmatrix}x\\z\end{pmatrix}
=a\left(x+\frac{b^{\mathsf T}z}{a}\right)^2
+z^{\mathsf T}\left(C-\frac{bb^{\mathsf T}}a\right)z.
$$

For \(a>0\), positivity is equivalent to positivity of the smaller block; recurse. Test the **whole** metric, not just the queried vectors. A positive determinant or positive diagonal alone is insufficient. Exact positive definiteness is invariant under coordinate changes; acceptance under an absolute pivot threshold need not be.

Predict: `G=[[1,0],[0,4]]`, `u=[1,1]`, `v=[1,-1]` returns `-3`. `G=[[1,2],[2,1]]` must be rejected even if the queried vector is `[1,0]`, whose squared length happens to be positive.

~~~text
python -m labs.checks gram-metric
~~~

Checks include non-diagonal positive definite metrics, symmetry and bilinearity, indefinite matrices with positive diagonals, negative definite and singular matrices, threshold-sensitive rejection, zero vectors, input preservation, and invalid data.

## 12. Exercises · by hand

Use exact fractions first. Identify the space and metric before calculating an angle or residual.
**A1 · Foundation · paper — the metric changes the angle.** For \(u=(1,1)\), \(v=(1,-1)\), and \(G=\operatorname{diag}(1,4)\), compute the inner product, both squared lengths, and the metric cosine. Compare with the Euclidean cosine.

**A2 · Foundation · paper — positive diagonals are not enough.** Which of \(I_2\), \(\operatorname{diag}(1,0)\), \(\begin{pmatrix}1&2\\2&1\end{pmatrix}\), and \(\begin{pmatrix}2&1\\1&2\end{pmatrix}\) define inner products? For each rejection exhibit a nonzero vector with nonpositive squared length.

**A3 · Core · paper — derive the cosine bound.** Prove Cauchy–Schwarz by choosing a scalar \(t\) in \(\|u-tv\|_G^2\ge0\). Handle a zero vector and characterize equality.

**A4 · Foundation · paper — two complements for one line.** Find a generator of the Euclidean complement of \(S=\operatorname{span}\{(1,2)\}\), and one of its complement under \(G=\operatorname{diag}(1,4)\).

**A5 · Foundation · paper — a weighted foot.** Project \(x=(2,0)\) onto \(u=(1,1)\) under \(G=\operatorname{diag}(1,4)\). Give the coefficient, projected point, residual, and squared metric distance.

**A6 · Core · paper — a plane from a skew basis.** For \(b_1=(1,0,1)\), \(b_2=(0,1,1)\), project \(x=(1,1,0)\) using the Gram system. Give coefficients, projected point, residual, and squared distance.

**A7 · Core · paper — why the nearest point is unique.** Prove the projection theorem for a finite-dimensional subspace under a positive definite metric. Establish existence as well as uniqueness; do not begin by assuming a minimizer exists.

**A8 · Core · paper — idempotent is not enough.** For \(Q=\begin{pmatrix}1&1\\0&0\end{pmatrix}\), compute \(Q^2\), its range and kernel, and its action on \(e_2\). Explain why it is not a Euclidean orthogonal projector.

**A9 · Core · paper — self-adjoint in the right metric.** For \(P=\tfrac15\begin{pmatrix}1&4\\1&4\end{pmatrix}\), verify \(P^2=P\) and \(P^{\mathsf T}G=GP\) with \(G=\operatorname{diag}(1,4)\). Identify the range and kernel.

**A10 · Foundation · paper — fit three heights.** Fit \(a+bt\) to \((0,1),(1,2),(2,2)\) by the normal equations. Give the coefficients and residual vector, then verify the residual sums against both design columns.

**A11 · Core · paper — a unique fit with many recipes.** For \(A=\begin{pmatrix}1&1\\2&2\end{pmatrix}\), \(y=(1,0)\), find the fitted vector and all least-squares coefficient vectors. Compare the free-variable-zero representative with the smallest Euclidean coefficient norm.

**A12 · Stretch · paper — weighted residual sums.** Fit a constant to \(y=(0,2)\) with weights \((1,3)\). Give the weighted normal equation, the coefficient, and both the ordinary and weighted residual sums. Explain when the familiar zero-sum residual rule applies.

## 13. Exercises · NumPy

Use local NumPy, `np.random.default_rng(0)`, and float64 first. State matrix shapes and tolerances. Supplied library solves are allowed; QR and SVD implementations are later work.

**B1 · Foundation · NumPy — compute a projector by solves.** Implement a Euclidean projector from a full-column-rank basis using `np.linalg.solve`, without explicitly forming an inverse. Test a line, a plane, and a square basis; verify symmetry, idempotence, range membership, and residual orthogonality.

**B2 · Core · NumPy — change the metric deliberately.** Extend B1 to \(P_G=B(B^{\mathsf T}GB)^{-1}B^{\mathsf T}G\). Generate positive definite metrics as \(G=H^{\mathsf T}H+I\). Verify metric self-adjointness and exhibit a projector that is not ordinarily symmetric.

**B3 · Core · NumPy — a basis change cannot change the shadow.** Choose a tall full-column-rank \(B\) and invertible \(R\). Compute projectors from \(B\) and \(BR\), check that they agree, and relate the coefficient vectors. Include a poorly scaled \(R\) and explain any numerical disagreement.

**B4 · Core · NumPy — check the four-subspace angles.** Construct a rank-2 \(3\times3\) matrix from independent columns and one dependent column. Use Module 2 elimination to find bases for the four subspaces. Check the two Euclidean orthogonality identities, then replace the output metric by \(G=\operatorname{diag}(1,2,4)\) and recompute the column-space complement.

**B5 · Stretch · NumPy — watch the Gram matrix lose rank.** Use \(A_\varepsilon=\begin{pmatrix}1&1\\0&\varepsilon\\0&0\end{pmatrix}\), \(y=(1,\varepsilon,\varepsilon)\). Compare a solve of the normal equations with `np.linalg.lstsq` for several small \(\varepsilon\), in float32 and float64. Report coefficients, residual norm, and the actual stored Gram entries; catch singular-solve failures explicitly.

**B6 · Core · NumPy — vertical is not perpendicular in the data plot.** For the fitted line \(a+bt\) from A10, compare each observation's vertical residual with its Euclidean perpendicular distance to that line in the \((t,y)\) plot. Explain why minimizing these two types of distance over lines is a different problem.

**B7 · Stretch · NumPy — preserve geometry while changing coordinates.** Choose invertible \(C\), a metric \(G\), and a basis \(B\). Transform target and basis by \(C^{-1}\), and use metric \(C^{\mathsf T}GC\). Verify that transforming the resulting projection back recovers the original projection. Repeat incorrectly using the identity metric and exhibit disagreement.

**B8 · Stretch · NumPy — discover the excess-error identity.** Using the plane in A6, sample 200 coefficient pairs for candidate points \(q=Bc\). Check \(\|x-q\|^2-\|x-p\|^2=\|p-q\|^2\). Repeat under a positive definite metric. Finally replace \(p\) by an oblique projection and find a candidate that beats it.

## 14. Exercises · PyTorch

Use CPU tensors, `torch.manual_seed(0)`, and `torch.float64`. No model download or training API is needed. Compare geometric identities as well as scalar losses.

**C1 · Foundation · PyTorch — measure the normal-equation defect.** With `torch.manual_seed(0)` and float64, generate a full-column-rank \(A\in\mathbb R^{20\times3}\) and \(y\in\mathbb R^{20}\). Use `torch.linalg.lstsq(A, y).solution`; report the residual and \(A^{\mathsf T}r\). Compare the objective at the solution and at ten perturbed coefficient vectors.

**C2 · Core · PyTorch — the best code for a fixed decoder.** With `torch.manual_seed(0)` and `float64`, draw a fixed decoder \(B\in\mathbb R^{8\times3}\) and a batch of row-vector targets \(X\in\mathbb R^{32\times8}\), both standard normal (so the columns of \(B\) are independent and nonorthogonal). Compare reconstruction using optimal Gram-system codes \(C=XB(B^{\mathsf T}B)^{-1}\) (computed with a solve) against the naive codes `X @ B`: report the mean squared reconstruction error of each and \(\max|B^{\mathsf T}(X-CB^{\mathsf T})^{\mathsf T}|\). Repeat with \(B\) replaced by its Q factor from `torch.linalg.qr`, and explain when the naive codes would be correct.

**C3 · Stretch · PyTorch — erase a probe with the smallest edit.** A fixed nonzero probe reads \(w^{\mathsf T}h\). Derive the edit \(\delta\) of smallest \(G\)-norm such that \(w^{\mathsf T}(h+\delta)=0\). Implement it with a solve, verify the constraint, and compare with Euclidean erasure for \(w=(1,1)\), \(h=(2,0)\), \(G=\operatorname{diag}(1,4)\).

**C4 · Core · PyTorch — weighting changes what gets fitted.** Fit a constant to float64 targets \((0,2,10)\), first with equal weights, then with \((1,1,0.01)\). Compare coefficients, ordinary squared error, and weighted squared error. Explain why a better weighted fit need not reduce ordinary error.

**C5 · Core · PyTorch — fit ambiguity survives a successful solver.** Build a float64 design with two identical nonzero columns. Obtain a least-squares solution, then add multiples of \((1,-1)\). Check fitted values and loss, and report what the solver's particular returned coefficients do and do not establish.

**C6 · Stretch · PyTorch — restrict an update to allowed directions.** A parameter update in \(\mathbb R^3\) must lie in the subspace with basis \(B=[\,(1,0,0),\,(0,1,1)\,]\). Project the proposed update \(d=(1,2,0)\) onto it under the Euclidean metric and under \(G=\operatorname{diag}(1,1,4)\), using a solve of \(B^{\mathsf T}GB\,c=B^{\mathsf T}Gd\). Compare the squared distances from \(d\) to the allowed candidates \(q\in\{(1,1,1),(1,0.4,0.4),(0,0,0),(1,2,2)\}\) under both metrics, and check the excess-distance identity for one candidate. State precisely what this projection guarantees and what it does not say about loss improvement.

## 15. Derivations to own

1. Recover the coordinate matrix of an inner product from its values on basis vectors.
2. Prove Cauchy–Schwarz, its equality case, and the triangle inequality without invoking angles.
3. Prove that an orthogonal complement is a subspace and intersects the original subspace only at zero.
4. Prove both four-subspace orthogonality identities and their metric-aware version.
5. Derive the line projection formula and handle a zero generator separately.
6. Prove the projection theorem by solving a positive definite Gram system, then derive the excess-error identity.
7. Derive the projector formula, idempotence, and metric self-adjointness; prove the converse characterization.
8. Derive the normal equations from geometry and from the perturbation expansion.
9. Prove uniqueness of fitted values and the full affine set of coefficient minimizers.
10. Derive weighted normal equations and the change-of-coordinate metric law.
11. Complete the square for a symmetric block matrix and explain the recursive positivity test in Lab C.

Do not use “the dimensions add up” as a substitute for proving trivial intersection. Do not use “the derivative vanishes” as a substitute for proving a global minimum. The orthogonal decomposition supplies both missing arguments here.

## 16. Exercises · cumulative

Mix the pictures, proofs, and numerical contracts. The unfamiliar variants are where a memorized formula stops being enough.

**M1 · Foundation · mixed — three extreme subspaces.** Give the Euclidean projectors onto \(\{0\}\), all of \(\mathbb R^3\), and the xy-plane. For \(x=(1,2,3)\), give each projected vector and residual.

**M2 · Core · mixed — the same subspace in two bases.** For the plane basis from A6, replace \(B\) by \(BR\), where \(R=\begin{pmatrix}1&1\\0&2\end{pmatrix}\). Find the new coefficient vector for the projected point. Explain why the projector and distance do not change.

**M3 · Core · mixed — a residual with nonzero mean.** Fit \(y=(1,0)\) using the single design column \(a=(1,2)\). Give the fitted coefficient and residual. Explain why nonzero residual sum is consistent with the normal equations.

**M4 · Core · mixed — reverse the projector characterization.** Prove that \(P^2=P\) and \(P^{\mathsf T}G=GP\), for positive definite \(G\), imply that \(P\) is the nearest-point map onto its range.

**M5 · Stretch · mixed — an angle drawn in the wrong space.** A plot shows a regression line with residual segments at right angles to that line and calls this ordinary least squares with fixed input coordinates. Diagnose the error, and draw or describe the correct two-space picture for the three observations in A10.

**M6 · Stretch · mixed — singular Gram matrix, existing projection.** Explain why singular \(A^{\mathsf T}A\) does not make least-squares fitted values nonexistent or ambiguous. Give a complete argument for consistency of the normal equations and characterize all coefficient minimizers.

**M7 · Stretch · mixed — small normal residual, wrong coefficients.** Let \(A=\operatorname{diag}(1,\varepsilon)\), \(y=(1,0)\), and a reported coefficient vector be \(\tilde w=(1,1)\). Compute its coefficient error, residual, and normal-equation defect. What happens as \(\varepsilon\to0\) through nonzero values?

**M8 · Stretch · mixed — a degenerate metric breaks uniqueness.** Under the semidefinite form \(G=\operatorname{diag}(1,0)\), approximate \(x=(1,1)\) by points of the y-axis. Find all minimizers and identify the exact step of the projection theorem that fails.

## 17. Checkpoint

Bring six written attempts, one computed projector with its residual checks, and one experiment exposing the Gram matrix's numerical failure.

**K1 · Checkpoint · gate — state what the right angles assume.** State the metric behind the standard four-subspace diagram. Prove \(C(A)^\perp=N(A^{\mathsf T})\) in both directions, then give the corresponding identity for a positive definite output metric \(G\).

**K2 · Checkpoint · gate — project and certify.** Project \((1,1,0)\) onto the plane spanned by \((1,0,1),(0,1,1)\). Give the Gram system, projected point, residual, and a certificate that no other plane point is closer.

**K3 · Checkpoint · gate — derive least squares without calculus.** Derive the normal equations from orthogonal projection. Explain why they are sufficient, why fitted values are always unique, and the exact condition for coefficient uniqueness.

**K4 · Checkpoint · gate — change geometry honestly.** For \(x=(2,0)\) and \(S=\operatorname{span}\{(1,1)\}\), compute the projection under \(I\) and under \(\operatorname{diag}(1,4)\). Explain why neither contradicts the other and how a passive coordinate change differs.

**K5 · Checkpoint · gate — reject a false projector certificate.** A program reports \(P^2\approx P\) and concludes that \(Px\) is the nearest point in its range. Give a counterexample and state the additional identity needed for a specified positive definite metric.

**K6 · Checkpoint · gate — separate theory from numerical execution.** A full-column-rank design produces a singular stored Gram matrix. Explain how this can happen, why explicitly inverting that Gram matrix cannot help, and which quantities you would report before trusting a computed fit.

## Mastery check

Choose and state a metric; prove the cosine bound; identify the spaces in the four-subspace diagram and earn its right angles; construct a projection and certify optimality with the excess-error identity; distinguish idempotence from orthogonal projection; derive and solve the normal equations; separate unique fitted values from possibly ambiguous coefficients; and diagnose what forming a Gram matrix can lose numerically.

**Try an unfamiliar variant.** Regard polynomials of degree at most two as vectors with inner product (langle f,g
angle=int_0^1 f(t)g(t),dt). Project (t^2) onto the span of (1,t). Build the 2×2 Gram system from elementary integrals; the result is (t-1/6), with squared residual norm (1/180). Explain why the same theorem applies even though no physical arrow was supplied.

**What comes next.** Module 4 develops orthonormal bases, Gram–Schmidt, and QR: coordinates become easier to read, and least squares can be solved without forming a Gram matrix. Determinants, spectral decompositions, conditioning theory, and the pseudoinverse follow in their planned modules. The current chapter's proofs do not require their algorithms.
