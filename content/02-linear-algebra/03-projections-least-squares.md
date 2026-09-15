---
id: math.linear-algebra.projections-least-squares
title: Orthogonal projections and least squares
prerequisites: [math.linear-algebra.linear-maps-rank]
estimated_hours: 26
depth_anchor: Aggarwal + PRML
---

# Orthogonal projections and least squares

Least squares is simultaneously geometry, optimization, probability and numerical linear algebra. Owning all four views is more valuable than memorizing the normal equations.

## 1. Projection onto one direction

To approximate \(x\) by a multiple \(\alpha u\), require the residual to be orthogonal to \(u\):

$$
u^T(x-\alpha u)=0.
$$

Solving gives

$$
\alpha=\frac{u^Tx}{u^Tu},
\qquad
\operatorname{proj}_u(x)=\frac{uu^T}{u^Tu}x.
$$

For unit \(u\), the projection matrix is \(P=uu^T\).

![Projection of a vector onto a subspace](../assets/vector-projection.svg)

## 2. Projection onto a column space

Let \(A\in\mathbb R^{n\times d}\) have independent columns. We seek \(\hat y=A\hat w\) closest to \(y\). The residual \(r=y-A\hat w\) must be orthogonal to every column of \(A\):

$$
A^T(y-A\hat w)=0.
$$

These are the normal equations:

$$
A^TA\hat w=A^Ty.
$$

If \(A\) has full column rank,

$$
\hat w=(A^TA)^{-1}A^Ty,
\qquad
P_A=A(A^TA)^{-1}A^T.
$$

### Own this derivation three ways

1. **Geometry:** the residual is orthogonal to \(\mathcal C(A)\).
2. **Calculus:** differentiate \(\|y-Aw\|_2^2\) and set the gradient to zero.
3. **Probability:** under \(y=Aw+\varepsilon\), \(\varepsilon\sim\mathcal N(0,\sigma^2I)\), maximize the likelihood.

The same estimator emerges, but each view contributes something different: geometry explains the residual, calculus generalizes to other objectives, and probability enables uncertainty reasoning.

## 3. Projection matrix properties

An orthogonal projector satisfies

$$
P^2=P,\qquad P^T=P.
$$

Idempotence says projecting twice changes nothing. Symmetry distinguishes orthogonal from oblique projections. Eigenvalues of an idempotent matrix are 0 or 1; therefore \(\operatorname{tr}(P)=\operatorname{rank}(P)\). In regression this trace measures fitted degrees of freedom.

## 4. Why not form the inverse?

The normal-equation formula is ideal for derivation and often poor for computation. Forming \(A^TA\) squares the 2-norm condition number:

$$
\kappa_2(A^TA)=\kappa_2(A)^2.
$$

Practical solvers prefer:

- QR for stable full-rank least squares;
- SVD for rank-deficient or ill-conditioned problems;
- iterative methods for large sparse systems.

Never implement `inv(A.T @ A) @ A.T @ y` as production numerical code merely because the symbolic expression is correct.

## 5. Rank deficiency and the pseudoinverse

When columns are dependent, minimizers are not unique. The Moore–Penrose pseudoinverse \(A^+\) selects the minimum-norm solution

$$
\hat w=A^+y.
$$

Using the SVD \(A=U\Sigma V^T\), invert only nonzero singular values:

$$
A^+=V\Sigma^+U^T.
$$

Small singular values make coefficients sensitive. Truncated SVD or ridge regression controls that sensitivity rather than pretending it is absent.

## 6. Weighted and regularized least squares

If errors have covariance \(\Sigma_\varepsilon\), generalized least squares minimizes

$$
(y-Aw)^T\Sigma_\varepsilon^{-1}(y-Aw).
$$

Ridge regression minimizes

$$
\|y-Aw\|_2^2+\lambda\|w\|_2^2
$$

and solves

$$
(A^TA+\lambda I)\hat w=A^Ty.
$$

The added curvature prevents division by extremely small singular values, trading variance for bias.

## Implementation lab

Generate a controlled ill-conditioned design matrix and solve least squares using:

1. explicit normal equations;
2. a linear solve of the normal equations;
3. QR;
4. SVD/pseudoinverse;
5. gradient descent;
6. ridge regression.

Compare residual error, coefficient error, sensitivity to perturbations and runtime. Use both float32 and float64.

## Problems

1. Derive \(P_A\) and prove it is symmetric and idempotent.
2. Prove that \(y=Py+(I-P)y\) is an orthogonal decomposition.
3. Show that least-squares fitted values are unique even when coefficients are not.
4. Derive the ridge estimator and explain why it is generally not an orthogonal projection.
5. **Transfer.** Explain how projecting a gradient onto an allowed constraint subspace changes an optimization step.

<details><summary>Solution sketches</summary>

1. Substitute \((A^TA)^{-1}\), transpose, and multiply \(P_AP_A\). Full column rank makes \(A^TA\) invertible.
2. Both terms sum to \(y\); their inner product is \(y^TP^T(I-P)y=y^TP(I-P)y=0\).
3. All minimizers differ by a null-space vector \(z\), and \(Az=0\), so their fitted values coincide.
4. Differentiation gives \((A^TA+\lambda I)w=A^Ty\). Its fitted-value operator has eigenvalues strictly between 0 and 1 along retained singular directions, so it is not idempotent.
5. Replace \(g\) by \(P_Sg\); the update becomes the steepest feasible first-order direction under Euclidean geometry.

</details>

## Mastery gate

Derive least squares geometrically, analytically and probabilistically; implement QR/SVD solutions; and diagnose why normal equations fail on a supplied ill-conditioned matrix.

