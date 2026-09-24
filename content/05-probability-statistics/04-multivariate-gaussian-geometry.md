---
id: math.probability.multivariate-gaussian-geometry
title: Multivariate Gaussian geometry and conditioning
prerequisites: [math.probability.transformations-convolution-jacobians, math.linear-algebra.spectral-theorem-quadratic-forms]
answers: ps-04-multivariate-gaussian-geometry
estimated_hours: 22
---

# Multivariate Gaussian geometry and conditioning

The multivariate Gaussian is more than a familiar bell curve with extra coordinates. It is a complete connection between probability and linear algebra: means translate, covariance eigenvectors orient uncertainty, eigenvalues scale it, affine maps preserve the family, and conditioning performs an uncertainty-aware linear update.

This unit isolates that geometry so the formulas do not arrive as an appendix to joint distributions. By the end, you should be able to read covariance ellipsoids, sample using a matrix factor, transform and marginalize Gaussian vectors, derive the bivariate conditional formula, apply the block conditional formula, and recognize where Gaussian convenience becomes a modelling liability.

The route is geometry first and formulas second: validate a covariance matrix, read its eigendirections, use a factor to generate samples, propagate it through affine maps, and finally obtain conditioning as a blockwise uncertainty update. Numerical stability and model criticism come after the exact Gaussian calculations are visible.

## 0. Random vectors and notation

Let \(X=(X_1,\ldots,X_d)^T\) have mean vector

$$
\mu=E[X]
$$

and covariance matrix

$$
\Sigma=E[(X-\mu)(X-\mu)^T].
$$

Entry \(\Sigma_{ii}\) is a variance and \(\Sigma_{ij}\) is a covariance. For every vector \(a\),

$$
a^T\Sigma a=\operatorname{Var}(a^TX)\ge0,
$$

so \(\Sigma\) must be symmetric positive semidefinite.

> **Practice — Foundation:** For a three-dimensional random vector, identify the dimensions of \(X\), \(\mu\), \(\Sigma\), and \((X-\mu)(X-\mu)^T\).
>
> **Hint:** With \(d=3\), \(X\) and \(\mu\) are \(3\times1\) column vectors; a column times a row, \((X-\mu)(X-\mu)^T\), is \(3\times3\), the same shape as \(\Sigma\).
>
> **Practice — Core:** For the five observations \((1,2),(3,4),(2,2),(4,5),(0,2)\), compute the sample mean vector, write the five centered outer products, and evaluate the sample covariance with divisor \(n-1\).
>
> **Hint:** The mean is \((2,3)\), so the centered points are \((-1,-1),(1,1),(0,-1),(2,2),(-2,-1)\); summing their outer products gives \(\begin{pmatrix}10&8\\8&8\end{pmatrix}\) before dividing by 4.
>
> **Practice — Stretch:** Let \(X,Y\) each be \(N(0,1)\) and jointly Gaussian. Compare \(\rho=0.9\) with \(\rho=-0.9\): compute \(\operatorname{Var}(X+Y)\) and \(P(X>0,Y>0)\) for each, and explain why the identical marginal means and variances cannot distinguish the two joints.
>
> **Hint:** \(\operatorname{Var}(X+Y)=2+2\rho\), and for a standard bivariate normal \(P(X>0,Y>0)=\tfrac14+\arcsin(\rho)/(2\pi)\), which gives about \(0.428\) and \(0.072\).

## 1. The multivariate Gaussian density

For positive-definite \(\Sigma\),

$$
X\sim\mathcal N(\mu,\Sigma)
$$

has density

$$
f_X(x)=
\frac{1}{(2\pi)^{d/2}|\Sigma|^{1/2}}
\exp\!\left[-\frac12(x-\mu)^T\Sigma^{-1}(x-\mu)\right].
$$

Read the formula structurally:

- \(\mu\) locates the centre;
- the quadratic form measures standardized distance from the centre;
- \(|\Sigma|^{1/2}\) measures the overall volume scale;
- the exponential makes equal-density sets equal-quadratic-form sets.

The squared Mahalanobis distance is

$$
D^2(x)=(x-\mu)^T\Sigma^{-1}(x-\mu).
$$

It measures distance in units adapted to scale and correlation rather than raw Euclidean coordinates.

> **Practice — Foundation:** Verify that the multivariate Gaussian density reduces to the ordinary univariate Gaussian formula when \(d=1\).
>
> **Hint:** With \(d=1\), \(\Sigma=\sigma^2\), \(|\Sigma|^{1/2}=\sigma\) and \((x-\mu)^T\Sigma^{-1}(x-\mu)=(x-\mu)^2/\sigma^2\); substitute these into \((2\pi)^{-d/2}\).
>
> **Practice — Core:** For \(X\sim N(0,\operatorname{diag}(4,1))\), evaluate \(\log p(x)\) at \(x=(2,0)\) and at \(x=(0,2)\), and explain which terms differ between the two points.
>
> **Hint:** \(\log p=-\tfrac d2\log(2\pi)-\tfrac12\log|\Sigma|-\tfrac12x^T\Sigma^{-1}x\); the first two terms are shared, and the squared distances are \(2^2/4=1\) and \(2^2/1=4\).
>
> **Practice — Stretch:** Take \(M=\begin{pmatrix}1&2\\0&1\end{pmatrix}\) and \(N=\begin{pmatrix}1&2\\2&1\end{pmatrix}\). Show that \(x^TMx=x^T\tfrac{M+M^T}2x\), so the asymmetric part of \(M\) never enters a quadratic form. For \(N\), compute \(\det N\) and \(x^TN^{-1}x\) along \(x=t(1,-1)\), and explain why neither matrix can serve as \(\Sigma\) in the full-density formula.
>
> **Hint:** \(x^TMx\) is a scalar, so it equals its own transpose \(x^TM^Tx\). For \(N\), \(\det N=-3\) (eigenvalues \(3\) and \(-1\)) and \((1,-1)N^{-1}(1,-1)^T=-2\), so \(\exp(-\tfrac12\cdot(-2t^2))\) grows without bound.

## 2. Covariance eigenvectors draw the ellipsoid

Let

$$
\Sigma=Q\Lambda Q^T,
$$

where columns of \(Q\) are orthonormal eigenvectors and \(\Lambda\) contains positive eigenvalues. Then

$$
D^2(x)
=\|\Lambda^{-1/2}Q^T(x-\mu)\|^2.
$$

Equal-density contours are ellipsoids:

- eigenvectors give principal directions;
- square roots of eigenvalues give relative axis lengths;
- off-diagonal covariance rotates axes away from coordinate directions.

![Elliptical Gaussian contours, an observed coordinate, and the reduced conditional spread.](../assets/gaussian-conditioning.svg)

**Worked example — read a covariance matrix.** For

$$
\Sigma=\begin{bmatrix}4&3\\3&9\end{bmatrix},
$$

the determinant is \(36-9=27>0\), so the matrix is positive definite. The positive off-diagonal entry tilts the ellipse toward directions where both coordinates rise together. Marginal standard deviations are two and three, while correlation is

$$
\rho=\frac{3}{2\cdot3}=0.5.
$$

> **Practice — Foundation:** For diagonal covariance \(\operatorname{diag}(9,1)\), identify the principal directions and relative axis lengths.
>
> **Hint:** The eigenvectors of a diagonal matrix are the coordinate axes; the half-axis lengths are \(\sqrt9=3\) and \(\sqrt1=1\), not 9 and 1.
>
> **Practice — Core:** Eigendecompose \(\Sigma=\begin{pmatrix}5&4\\4&5\end{pmatrix}\) and sketch its one-standard-deviation ellipse from the eigenvectors and square-root eigenvalues.
>
> **Hint:** Try \((1,1)\) and \((1,-1)\): \(\Sigma(1,1)^T=9(1,1)^T\) and \(\Sigma(1,-1)^T=1\cdot(1,-1)^T\), so the half-axes have lengths 3 along \(45^\circ\) and 1 along \(-45^\circ\).
>
> **Practice — Stretch:** Keep the eigenvalues 9 and 1 fixed and rotate the eigenvectors by \(\theta=0^\circ,45^\circ,90^\circ\), so that \(\Sigma=R_\theta\operatorname{diag}(9,1)R_\theta^T\). For each angle compute \(\Sigma\), its trace, its determinant and the correlation.
>
> **Hint:** Trace \(=10\) and determinant \(=9\) depend only on eigenvalues; the off-diagonal is \(\Sigma_{12}=(9-1)\sin\theta\cos\theta=4\sin2\theta\), so the correlation is 0, 0.8, 0.

## 3. Sampling is an affine transformation of standard noise

Let \(Z\sim\mathcal N(0,I)\), and choose a matrix \(L\) satisfying

$$
LL^T=\Sigma.
$$

Then

$$
X=\mu+LZ
$$

has mean \(\mu\) and covariance

$$
\operatorname{Cov}(X)=LIL^T=\Sigma.
$$

A Cholesky factor gives one such \(L\) when \(\Sigma\) is positive definite. An eigendecomposition gives \(L=Q\Lambda^{1/2}\). These factors can differ while generating the same distribution because isotropic standard Gaussian noise is rotation invariant.

<details><summary>Checkpoint: why not multiply by the covariance itself?</summary>

If \(X=\mu+\Sigma Z\), then its covariance is \(\Sigma I\Sigma^T=\Sigma^2\), not \(\Sigma\). The transformation needs a matrix square root or factor \(L\) with \(LL^T=\Sigma\).

</details>

> **Practice — Foundation:** Let \(\mu=(1,-2)\) and \(\Sigma=\operatorname{diag}(4,9)\). Write a square root \(L\) with \(LL^T=\Sigma\) and map the standard-noise vector \(z=(0.5,-1)\) to a sample \(x=\mu+Lz\).
>
> **Hint:** For a diagonal covariance take \(L=\operatorname{diag}(\sqrt4,\sqrt9)=\operatorname{diag}(2,3)\) and compute each coordinate as \(\mu_i+L_{ii}z_i\).
>
> **Practice — Core:** With \(\mu=(1,-1)\), \(\Sigma=\begin{pmatrix}4&1.5\\1.5&1\end{pmatrix}\), \(L\) the Cholesky factor, and NumPy `default_rng(0)`, draw \(n=10^2,10^3,10^4,10^5\) samples \(X=\mu+LZ\). Report the maximum absolute error of the sample mean and of the sample covariance at each \(n\), and check that it shrinks roughly like \(n^{-1/2}\).
>
> **Hint:** \(E[\mu+LZ]=\mu\) and \(\operatorname{Cov}(LZ)=LL^T=\Sigma\) because \(E[Z]=0\) and \(\operatorname{Cov}(Z)=I\). A tenfold increase in \(n\) should cut the errors by about \(\sqrt{10}\approx3.2\); expect a covariance error around \(0.02\) at \(n=10^5\).
>
> **Practice — Stretch:** For \(\Sigma=\begin{pmatrix}1&\rho\\\rho&1\end{pmatrix}\) with \(\rho=1-10^{-10}\) and \(\rho=1\) exactly, try `np.linalg.cholesky` and the eigen square root \(V\operatorname{diag}(\sqrt{\max(\lambda,0)})\). Report which calls fail, the size of \(L_{22}\) in the first case, and \(\max|LL^T-\Sigma|\) for each successful factor. Do the generated distributions differ?
>
> **Hint:** Cholesky needs strictly positive pivots: \(L_{22}=\sqrt{1-\rho^2}\approx1.4\times10^{-5}\) at \(\rho=1-10^{-10}\), and at \(\rho=1\) it raises `LinAlgError`. Clipping the tiny eigenvalue to zero keeps the eigen route working, and any two factors with \(LL^T=\Sigma\) generate the same law.

## 4. Affine transformations preserve Gaussianity

If \(X\sim\mathcal N(\mu,\Sigma)\), then

$$
Y=AX+b
$$

is Gaussian with

$$
Y\sim\mathcal N(A\mu+b,A\Sigma A^T).
$$

This remains valid when \(A\) is rectangular or singular. In those cases the resulting distribution may live in a lower-dimensional subspace and have no ordinary density in the ambient space.

Every linear projection is therefore univariate Gaussian:

$$
a^TX\sim\mathcal N(a^T\mu,a^T\Sigma a).
$$

One equivalent definition of a multivariate Gaussian is that every linear combination of its coordinates is univariate Gaussian.

> **Practice — Foundation:** Let \(X\in\mathbb R^4\) with covariance \(\Sigma\), let \(A\) be \(2\times4\), and let \(b\in\mathbb R^2\). Give the shapes of \(E[Y]\) and \(\operatorname{Cov}(Y)\) for \(Y=AX+b\), and of each factor in \(A\Sigma A^T\).
>
> **Hint:** The product \((2\times4)(4\times4)(4\times2)\) is \(2\times2\), and \(A\mu+b\) is \(2\times1\).
>
> **Practice — Core:** Let \(X\sim N\bigl((1,2),\begin{pmatrix}5&-1\\-1&6\end{pmatrix}\bigr)\) and \(a=(1,1)\). Find the distribution of \(a^TX\) and compute \(P(0\le a^TX\le6)\).
>
> **Hint:** \(a^T\mu=3\) and \(a^T\Sigma a=5+6+2(-1)=9\), so standardize by the standard deviation 3 and use \(P(-1\le Z\le1)\).
>
> **Practice — Stretch:** Let \(X\sim N(0,I_2)\) and \(A=\begin{pmatrix}1&2\\2&4\end{pmatrix}\). Compute \(\operatorname{Cov}(AX)\) and its determinant, describe the support of \(Y=AX\), give the law of \(Y_1\), and explain why \(Y\) has no ordinary density on \(\mathbb R^2\).
>
> **Hint:** The rows of \(A\) are multiples of \((1,2)\), so \(Y_2=2Y_1\) always. \(AA^T=\begin{pmatrix}5&10\\10&20\end{pmatrix}\) has determinant 0, and \(Y_1\sim N(0,5)\) lives on the line \(y_2=2y_1\).

## 5. Marginals select blocks

Partition

$$
X=\begin{bmatrix}X_a\\X_b\end{bmatrix},
\quad
\mu=\begin{bmatrix}\mu_a\\\mu_b\end{bmatrix},
\quad
\Sigma=
\begin{bmatrix}
\Sigma_{aa}&\Sigma_{ab}\\
\Sigma_{ba}&\Sigma_{bb}
\end{bmatrix}.
$$

The marginal distributions are simply

$$
X_a\sim\mathcal N(\mu_a,\Sigma_{aa}),
\qquad
X_b\sim\mathcal N(\mu_b,\Sigma_{bb}).
$$

Cross-covariance affects their joint relationship but does not enter either marginal covariance block.

> **Practice — Foundation:** Let \(X\sim N(\mu,\Sigma)\) with \(\mu=(1,2,3)\) and \(\Sigma=\begin{pmatrix}4&1&2\\1&3&1\\2&1&5\end{pmatrix}\). Write the marginal mean and covariance of \((X_1,X_2)\).
>
> **Hint:** Keep entries 1 and 2 of \(\mu\) and the top-left \(2\times2\) block of \(\Sigma\); nothing is recomputed.
>
> **Practice — Core:** For the same \(\mu=(1,2,3)\) and \(\Sigma=\begin{pmatrix}4&1&2\\1&3&1\\2&1&5\end{pmatrix}\), derive the bivariate marginal of \((X_1,X_3)\) and its correlation, checking the block indexing carefully.
>
> **Hint:** Select rows and columns 1 and 3, so you need \(\Sigma_{11}=4\), \(\Sigma_{13}=\Sigma_{31}=2\) and \(\Sigma_{33}=5\); the correlation is \(2/\sqrt{20}\).
>
> **Practice — Stretch:** For the same model, compare the marginal law of \(X_1\) with the conditional law of \(X_1\) given \(X_3=8\). Explain geometrically why the first is block selection while the second changes both the mean and the variance.
>
> **Hint:** The marginal is \(N(1,4)\), read off directly. Conditioning slices the \((X_1,X_3)\) ellipse at \(x_3=8\): the mean becomes \(1+\tfrac25(8-3)\) and the variance \(4-\tfrac{2^2}{5}\).

## 6. Derive the bivariate conditional distribution

Suppose \(X\) and \(Y\) have means \(\mu_X,\mu_Y\), variances \(\sigma_X^2,\sigma_Y^2\), and covariance \(\sigma_{XY}\), with a positive-definite covariance matrix.

Write

$$
X=\mu_X+
\frac{\sigma_{XY}}{\sigma_Y^2}(Y-\mu_Y)+\varepsilon,
$$

where

$$
\varepsilon
=X-\mu_X-
\frac{\sigma_{XY}}{\sigma_Y^2}(Y-\mu_Y).
$$

Its covariance with \(Y\) is zero:

$$
\operatorname{Cov}(\varepsilon,Y)
=\sigma_{XY}-
\frac{\sigma_{XY}}{\sigma_Y^2}\sigma_Y^2=0.
$$

Because \((\varepsilon,Y)\) is jointly Gaussian, zero covariance implies independence. Conditioning on \(Y=y\) therefore changes the affine term but not the residual distribution:

$$
E[X\mid Y=y]
=\mu_X+
\frac{\sigma_{XY}}{\sigma_Y^2}(y-\mu_Y),
$$

and

$$
\operatorname{Var}(X\mid Y=y)
=\sigma_X^2-
\frac{\sigma_{XY}^2}{\sigma_Y^2}.
$$

Using correlation \(\rho=\sigma_{XY}/(\sigma_X\sigma_Y)\), conditional variance is

$$
\sigma_X^2(1-\rho^2).
$$

Observation reduces variance according to squared correlation. The sign of correlation changes the conditional mean direction but not the amount of variance reduction.

> **Practice — Foundation:** Let \((X,Y)\) be jointly Gaussian with \(\operatorname{Var}X=4\), \(\operatorname{Var}Y=9\) and \(\operatorname{Cov}(X,Y)=3\). In \(Y\mid X=x\), identify the regression-like slope and the remaining conditional variance.
>
> **Hint:** The slope is \(\operatorname{Cov}(X,Y)/\operatorname{Var}X=3/4\), and the conditional variance is \(9-3^2/4\).
>
> **Practice — Core:** For standardized jointly Gaussian \(X,Y\) with \(\rho=0.5\), the joint exponent is \(-(x^2-xy+y^2)/(2\cdot0.75)\). Complete the square in \(y\) to show that \(Y\mid X=x\sim N(0.5x,\,0.75)\) without quoting the conditional formula.
>
> **Hint:** Write \(x^2-xy+y^2=(y-x/2)^2+\tfrac34x^2\); the second term does not involve \(y\), so it is absorbed into the normalizer.
>
> **Practice — Stretch:** For standardized jointly Gaussian \(X,Y\) with the observation \(X=2\), tabulate \(E[Y\mid X=2]\) and \(\operatorname{sd}(Y\mid X=2)\) for \(\rho=0,0.5,0.9,0.99,-0.99\). Describe what happens to the conditional line and the residual uncertainty as \(\rho\to0\) and \(|\rho|\to1\).
>
> **Hint:** Use \(E[Y\mid X=2]=2\rho\) and \(\operatorname{sd}=\sqrt{1-\rho^2}\); for example \(\rho=0.9\) gives mean \(1.8\) and sd about \(0.436\).

## 7. A fully numerical conditioning example

Let model quality \(X\) and a proxy score \(Y\) be jointly Gaussian with

$$
\mu_X=70,
\quad
\mu_Y=50,
\quad
\sigma_X^2=16,
\quad
\sigma_Y^2=25,
\quad
\sigma_{XY}=12.
$$

After observing \(Y=60\), the conditional mean is

$$
70+\frac{12}{25}(60-50)=74.8.
$$

The conditional variance is

$$
16-\frac{12^2}{25}=10.24,
$$

so conditional standard deviation is \(3.2\), down from the marginal value four.

Interpretation: a proxy ten points above its mean shifts expected quality upward by 4.8, but does not determine quality exactly. The residual uncertainty remains substantial.

> **Practice — Foundation:** Recompute the numerical conditional mean when the observed coordinate is one standard deviation above its mean.
>
> **Hint:** One standard deviation above is \(Y=55\), a deviation of 5; multiply it by the slope \(12/25=0.48\) and add \(\mu_X=70\).
>
> **Practice — Core:** In the numerical example, compute \(E[X\mid Y=y]\) and \(\operatorname{Var}(X\mid Y=y)\) for \(y=40\), \(60\) and \(75\), compare them with the prior variance 16, and state why the realized observation changes the mean but not the conditional variance.
>
> **Hint:** The mean is \(70+0.48(y-50)\) for each \(y\); the variance \(16-12^2/25=10.24\) contains no \(y\) at all.
>
> **Practice — Stretch:** Simulate \(10^6\) draws from the numerical example's bivariate Gaussian (NumPy `default_rng(0)`, Cholesky factor). Keep the draws with \(|Y-60|<h\) for \(h=0.1,1,5\), and for each \(h\) report the number accepted and the empirical mean and variance of \(X\), compared with \(74.8\) and \(10.24\). Discuss the bandwidth tradeoff.
>
> **Hint:** Expect roughly 2,000 accepted draws at \(h=0.1\) and 160,000 at \(h=5\). The wide band mixes in \(Y\) values far from 60, which biases the mean (to about 73.6) and inflates the variance (to about 11.3); the narrow band is nearly unbiased but noisier.

## 8. Block Gaussian conditioning

When \(\Sigma_{bb}\) is invertible,

$$
X_a\mid X_b=b
\sim\mathcal N(\mu_{a\mid b},\Sigma_{a\mid b}),
$$

where

$$
\mu_{a\mid b}
=\mu_a+
\Sigma_{ab}\Sigma_{bb}^{-1}(b-\mu_b),
$$

and

$$
\Sigma_{a\mid b}
=\Sigma_{aa}
-\Sigma_{ab}\Sigma_{bb}^{-1}\Sigma_{ba}.
$$

Read the mean update from right to left:

1. compute the observation residual \(b-\mu_b\);
2. scale it by observed uncertainty through \(\Sigma_{bb}^{-1}\);
3. map it through cross-covariance \(\Sigma_{ab}\);
4. add the correction to the prior mean.

The covariance reduction is a positive-semidefinite matrix. It depends on which variable is observed, not the observed numerical value.

> **Practice — Foundation:** Let \(x\in\mathbb R^5\) be partitioned into an unobserved block \(x_a\in\mathbb R^2\) and an observed block \(x_b\in\mathbb R^3\). Label the dimensions of every block in \(\mu_a+\Sigma_{ab}\Sigma_{bb}^{-1}(x_b-\mu_b)\) and \(\Sigma_{aa}-\Sigma_{ab}\Sigma_{bb}^{-1}\Sigma_{ba}\).
>
> **Hint:** \(\Sigma_{ab}\) is \(2\times3\), \(\Sigma_{bb}\) is \(3\times3\), and \(x_b-\mu_b\) is \(3\times1\); check that the mean is \(2\times1\) and the covariance is \(2\times2\) before applying any solve.
>
> **Practice — Core:** For \(\mu=0\) and \(\Sigma=\begin{pmatrix}4&1&2\\1&3&1\\2&1&5\end{pmatrix}\), compute the distribution of \(X_1\) given \((X_2,X_3)=(1,2)\) by solving \(\Sigma_{bb}w=\Sigma_{ba}\) rather than forming \(\Sigma_{bb}^{-1}\).
>
> **Hint:** Solve \(3w_1+w_2=1\), \(w_1+5w_2=2\) to get \(w=(3/14,5/14)\); then the mean is \(w^T(1,2)\) and the variance is \(4-w^T(1,2)\).
>
> **Practice — Stretch:** For \(\Sigma=\begin{pmatrix}4&1&2\\1&3&1\\2&1&5\end{pmatrix}\), compute the Schur complement for conditioning \((X_1,X_2)\) on \(X_3\) and check that it is positive definite. Then prove in general that a conditional covariance is positive semidefinite.
>
> **Hint:** The Schur complement is \(\begin{pmatrix}4&1\\1&3\end{pmatrix}-\tfrac15\begin{pmatrix}2\\1\end{pmatrix}\begin{pmatrix}2&1\end{pmatrix}\). In general it equals \(\operatorname{Cov}(X_a-\Sigma_{ab}\Sigma_{bb}^{-1}X_b)\), and any covariance satisfies \(v^T\operatorname{Cov}\,v=\operatorname{Var}(v^T\cdot)\ge0\).

## 9. Gaussian independence is special

For jointly Gaussian blocks,

$$
\Sigma_{ab}=0
\quad\Longleftrightarrow\quad
X_a\text{ and }X_b\text{ are independent}.
$$

The forward implication from independence to zero covariance holds generally. The reverse implication depends on joint Gaussianity.

The construction \(Y=X^2\) with symmetric \(X\) remains a standing counterexample outside the Gaussian family: covariance can vanish under perfect nonlinear dependence.

> **Practice — Foundation:** Let \(X\sim N(0,1)\), let \(S=\pm1\) be a fair sign independent of \(X\), and let \(Y=SX\). Show that \(Y\sim N(0,1)\) and \(\operatorname{Cov}(X,Y)=0\), but \(X\) and \(Y\) are dependent. Which extra condition would make zero covariance imply independence?
>
> **Hint:** \(E[XY]=E[S]E[X^2]=0\) and \(|Y|=|X|\); the pair is not jointly Gaussian because \(X+Y=0\) with probability \(1/2\), so the zero-covariance-implies-independence result needs joint Gaussianity.
>
> **Practice — Core:** Let \(X\in\mathbb R^3\) be Gaussian with mean 0 and block-diagonal covariance \(\Sigma=\begin{pmatrix}2&1&0\\1&2&0\\0&0&3\end{pmatrix}\). Write the density and show that it factorizes into a density of \((X_1,X_2)\) times a density of \(X_3\).
>
> **Hint:** The inverse of a block-diagonal matrix is block diagonal, so the quadratic form splits into two sums, and \(\det\Sigma=\det\begin{pmatrix}2&1\\1&2\end{pmatrix}\cdot3=9\) splits the normalizer.
>
> **Practice — Stretch:** Let \(X\sim\text{Uniform}(-1,1)\) and \(Y=X^2\). Show that \(\operatorname{Cov}(X,Y)=0\), compare \(P(Y>1/4)\) with \(P(Y>1/4\mid X>1/2)\) to exhibit dependence, and explain exactly which Gaussian argument is unavailable.
>
> **Hint:** \(\operatorname{Cov}(X,Y)=E[X^3]-E[X]E[X^2]=0\) by symmetry; \(P(Y>1/4)=1/2\) but the conditional probability is 1. With no joint Gaussian density, there is no exponent to split into a product.

## 10. Standardization, whitening, and rotation

Coordinatewise standardization transforms

$$
X_i\mapsto\frac{X_i-\mu_i}{\sigma_i}.
$$

It produces unit marginal variances but generally preserves correlation.

Whitening uses \(W\Sigma W^T=I\):

$$
Z=W(X-\mu).
$$

For Gaussian \(X\), whitened coordinates are independent standard Gaussians. For a non-Gaussian vector they are merely uncorrelated with unit variance.

Whitening is not unique. A further orthogonal rotation preserves identity covariance. When an interpretation depends on a particular whitened axis, the choice of whitening convention matters.

> **Practice — Foundation:** Let \(X\) have covariance \(\begin{pmatrix}4&3\\3&9\end{pmatrix}\). Standardize each coordinate by its mean and standard deviation, write the covariance of the result, and state what happened to the correlation.
>
> **Hint:** Dividing by the standard deviations \(2\) and \(3\) gives \(\Sigma_{ij}/(\sigma_i\sigma_j)\): unit variances, but the off-diagonal is still \(3/6=0.5\).
>
> **Practice — Core:** For \(\Sigma=\begin{pmatrix}5&4\\4&5\end{pmatrix}\), build the whitening matrix \(W=\Lambda^{-1/2}V^T\) from its eigendecomposition and verify \(W\Sigma W^T=I\).
>
> **Hint:** With \(V=\tfrac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}\) and \(\Lambda=\operatorname{diag}(9,1)\), \(W=\operatorname{diag}(1/3,1)V^T\); then \(W\Sigma W^T=\Lambda^{-1/2}V^TV\Lambda V^TV\Lambda^{-1/2}\).
>
> **Practice — Stretch:** For the same \(\Sigma\), compare the PCA whitening \(W_{\text{PCA}}=\Lambda^{-1/2}V^T\) with the ZCA whitening \(W_{\text{ZCA}}=VW_{\text{PCA}}\). Show both give identity covariance, and compute each applied to \(x=(3,3)\).
>
> **Hint:** \(V\) is orthogonal, so \(W_{\text{ZCA}}\Sigma W_{\text{ZCA}}^T=VIV^T=I\). Expect \(W_{\text{PCA}}x=(\sqrt2,0)\) and \(W_{\text{ZCA}}x=(1,1)\): the same law, but different coordinates.

## 11. Singular and ill-conditioned covariance

If \(\Sigma\) has a zero eigenvalue, some linear combination has zero variance and is deterministic. The distribution lies in a lower-dimensional affine subspace.

If an eigenvalue is merely tiny, density calculations using \(\Sigma^{-1}\) and \(|\Sigma|\) become numerically sensitive. Practical safeguards include:

- solving linear systems rather than forming an explicit inverse;
- using Cholesky factors when positive definiteness is reliable;
- inspecting eigenvalues and condition numbers;
- adding regularization only with an explicit modelling interpretation;
- distinguishing exact structural degeneracy from finite-sample estimation noise.

> **Practice — Foundation:** Let \(X_1,X_2\) be independent \(N(0,1)\) and \(X_3=X_1+X_2\). Write the \(3\times3\) covariance and show that it is singular.
>
> **Hint:** The covariance is \(\begin{pmatrix}1&0&1\\0&1&1\\1&1&2\end{pmatrix}\); compute \(\operatorname{Var}(X_1+X_2-X_3)=v^T\Sigma v\) with \(v=(1,1,-1)\).
>
> **Practice — Core:** Let \(\Sigma=\begin{pmatrix}1&1\\1&1+10^{-10}\end{pmatrix}\). Compute its eigenvalues and condition number, then solve \(\Sigma x=b\) for \(b=(1,1)\) and for \(b=(1+10^{-6},\,1-10^{-6})\) and compare the solutions. Explain why a condition-number check and a factorized solve (not `inv`) are the right diagnostics.
>
> **Hint:** \(\Sigma(1,0)^T=(1,1)^T\) exactly. The perturbation \(10^{-6}(1,-1)\) lies along the eigenvector with eigenvalue about \(5\times10^{-11}\), so it is amplified to roughly \(2\times10^4(1,-1)\).
>
> **Practice — Stretch:** For the singular covariance of \(X_3=X_1+X_2\) above, apply three remedies: (a) drop \(X_3\); (b) use \(\Sigma+0.1I\); (c) use the pseudoinverse. For the on-support point \((1,1,2)\) and the off-support point \((1,1,2.5)\), compute each model's squared Mahalanobis distance and state what model each remedy implicitly assumes.
>
> **Hint:** (a) sees only \((1,1)\), so \(d^2=2\) for both points. (b) adds independent noise of variance 0.1 in every direction, giving about \(1.94\) and \(3.47\). (c) keeps \(d^2=2\) on the support, gives \(2.72\) off it, and silently ignores the off-support component, which the true model says has probability zero.

## 12. Modelling checks in ML

- Are marginals plausibly symmetric and light-tailed?
- Does a single ellipse hide clusters or curved structure?
- Is covariance stable across subgroups and time?
- Are diagonal-output assumptions discarding important conditional relationships?
- Does the model assign mass to impossible values?
- Are rare-event decisions sensitive to tail misspecification?
- Was covariance estimated with enough independent experimental units relative to dimension?

Gaussian calculations can be exact under the model and still answer the wrong empirical question.

> **Practice — Foundation:** For three of the checks above (light-tailed marginals, a hidden cluster, and covariance stability across subgroups), name one plot or statistic that would reveal each problem and describe what a failure looks like.
>
> **Hint:** For example: a normal QQ plot of each marginal (failure: curved tails), a histogram of a one-dimensional projection (failure: two humps), and \(\hat\Sigma\) estimated separately per subgroup (failure: entries that differ by more than their sampling error).
>
> **Practice — Core:** You fit \(N(\mu,\Sigma)\) to \(d=10\) embedding vectors and compute squared Mahalanobis distances on 1,000 held-out vectors. Under the model these follow \(\chi^2_{10}\). State the expected mean and 95th percentile, and interpret an observed mean of 14 with 18% of distances above that percentile. What subgroup check would you run next?
>
> **Hint:** \(\chi^2_d\) has mean \(d=10\) and its 95th percentile for \(d=10\) is \(18.31\), so about 5% should exceed it. An observed 18% points to heavier tails or a mis-specified \(\Sigma\); repeat the check within each subgroup against simulated Gaussian reference data.
>
> **Practice — Stretch:** Separate a poor covariance estimate from a non-Gaussian shape. With NumPy `default_rng(0)`, draw train and test sets of 5,000 each from (i) \(N(0,\Sigma)\) with \(\Sigma=\begin{pmatrix}1&0.8\\0.8&1\end{pmatrix}\) and (ii) a multivariate \(t_3\) rescaled to the same covariance. For each, fit the sample covariance on train, then report its maximum error and the fraction of test squared Mahalanobis distances above the \(\chi^2_2\) quantiles 5.99 (95%) and 13.82 (99.9%).
>
> **Hint:** Both laws have covariance \(\Sigma\). The Gaussian should show about 5% and 0.1% exceedances; if the \(t_3\) case shows about 2% beyond the 99.9% quantile even with a decent covariance estimate, the shape is at fault, not the estimate.

## 13. Runnable lab: bivariate Gaussian conditioning

Implement `condition_bivariate_gaussian` in [labs/exercises.py](../../labs/exercises.py). Given both means, both variances, covariance, and an observed \(Y=y\), return the conditional mean and variance of \(X\mid Y=y\).

Run:

```text
python -m labs.checks gaussian
```

Reject nonfinite inputs, nonpositive variances, and covariance matrices that are not positive definite. The checks include independence, negative correlation, scale, and the numerical example above.

### Mini-experiment

For correlations from \(-0.95\) to \(0.95\), plot conditional mean as a function of \(y\) and conditional variance as a function of \(\rho\). Before plotting, predict which graph changes sign and which is symmetric.

## 14. Derivations to own

1. Prove covariance matrices are positive semidefinite.
2. Show that \(X=\mu+LZ\) has covariance \(LL^T\).
3. Derive the affine Gaussian mean and covariance.
4. Derive the distribution of \(a^TX\).
5. Derive the bivariate conditional formulas using the independent residual.
6. Reduce the block formula to the scalar bivariate formula.
7. Show conditional covariance is no larger than marginal covariance.
8. Explain why zero covariance yields Gaussian independence but not general independence.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-gaussian
```

## 15. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–3. Validate covariance and connect its algebra to geometry and sampling.

**A1 · Foundation · paper — Cumulative problem 1.** Determine whether each matrix is a valid covariance matrix and whether it is positive definite or singular:

   $$
   A=\begin{pmatrix}4&2\\2&3\end{pmatrix},\quad
   B=\begin{pmatrix}1&2\\2&1\end{pmatrix},\quad
   C=\begin{pmatrix}1&-1\\-1&1\end{pmatrix}.
   $$

**A2 · Foundation · paper — Cumulative problem 2.** For covariance matrices \(\begin{pmatrix}4&1.5\\1.5&1\end{pmatrix}\), \(\begin{pmatrix}4&-1.5\\-1.5&1\end{pmatrix}\), and \(\operatorname{diag}(4,1)\), identify the sign of correlation and sketch or describe the orientation and relative axis lengths of their ellipses.

**A3 · Foundation · paper — Cumulative problem 3.** For \(\Sigma=\begin{pmatrix}4&1.5\\1.5&1\end{pmatrix}\), generate one array of 100,000 standard-normal pairs with NumPy `default_rng(2026)` and transform it once with the Cholesky factor \(L\) and once with the eigen factor \(V\Lambda^{1/2}\). Report the maximum absolute covariance error for each and explain why the two realized samples need not be identical.

### Core — problems 4–8. Manipulate affine maps, marginals, and conditional Gaussian distributions.

**A4 · Core · paper — Cumulative problem 4.** Let \(X\sim N(\mu,\Sigma)\) with \(\mu=(1,0,2)\) and \(\Sigma=\begin{pmatrix}4&1&0\\1&2&1\\0&1&3\end{pmatrix}\). For the rectangular projection \(Y=AX+b\) with \(A=\begin{pmatrix}1&1&0\\0&1&-1\end{pmatrix}\) and \(b=(0,1)\), derive the general mean and covariance of \(Y\) and evaluate them.

**A5 · Core · paper — Cumulative problem 5.** For the same \(\mu=(1,0,2)\) and \(\Sigma\) as in problem 4, compute the marginal distribution of the block \((X_2,X_3)\) and its correlation.

**A6 · Core · paper — Cumulative problem 6.** Reproduce the numerical conditioning example and verify the implied correlation is valid.

**A7 · Core · paper — Cumulative problem 7.** Derive \(X\mid Y=y\) for zero-mean unit-variance variables with correlation \(\rho\).

**A8 · Core · paper — Cumulative problem 8.** For zero-mean unit-variance jointly Gaussian \(X,Y\) with correlation \(\rho\) and the observation \(Y=1.5\), compute \(E[X\mid Y=1.5]\) and \(\operatorname{sd}(X\mid Y=1.5)\) for \(\rho=0,\,0.9,\,0.99,\,-0.99\). Explain the limits \(\rho=0\) and \(|\rho|\to1\).

### Stretch — problems 9–12. Diagnose where Gaussian structure or numerical calculations fail.

**A9 · Stretch · paper — Cumulative problem 9.** Let \(Z\sim N(0,1)\), \(X=Z\), and \(Y=(Z^2-1)/\sqrt2\). Show that \((X,Y)\) has mean zero and identity covariance, that \(X\) and \(Y\) are dependent, and that \((X,Y)\) is not a Gaussian vector.

**A10 · Stretch · paper — Cumulative problem 10.** An empirical covariance for three features is \(\hat\Sigma=\operatorname{diag}(1,1,10^{-6})\) because the third feature barely varied in training. Compute the Gaussian log density (mean 0) at \(x=(0,0,0)\) and at \(x=(0,0,0.01)\), then repeat after regularizing the third variance to \(10^{-6}+10^{-3}=0.001001\). Use the numbers to diagnose why a nearly singular covariance destabilizes a Gaussian likelihood.

**A11 · Stretch · paper — Cumulative problem 11.** Let \(X\sim N(0,\Sigma)\) with \(\Sigma=\begin{pmatrix}4&2&1&0\\2&3&0&1\\1&0&2&1\\0&1&1&2\end{pmatrix}\). Partition it into \(a=(X_1,X_2)\) and \(b=(X_3,X_4)\) and compute the distribution of \(a\mid b=(1,-1)\) using linear solves against \(\Sigma_{bb}\). Verify it by drawing \(4\times10^6\) samples (NumPy `default_rng(0)`) and keeping those with \(|X_3-1|<0.05\) and \(|X_4+1|<0.05\).

**A12 · Stretch · paper — Cumulative problem 12.** With NumPy `default_rng(0)`, generate 2,000 training and 2,000 test points in \(\mathbb R^2\): with probability 0.95 a point comes from \(0.5N((-3,0),I)+0.5N((3,0),I)\), otherwise it is an outlier from \(N(0,25I)\). Fit (a) a single Gaussian by maximum likelihood, (b) a two-component Gaussian mixture by EM (initial means \((\pm1,0)\)), and (c) a multivariate \(t\) with 3 degrees of freedom by EM. Report the mean held-out log-likelihood of each, and compare each model's probability of the central strip \(|x_1|<1\) and of the far region \(\|x\|>8\) with the test frequencies.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** When does an ordinary multivariate Gaussian density exist?

**K2 · Core · gate — Derivation.** Derive the conditional variance for two standardized jointly Gaussian variables with correlation rho.

**K3 · Core · gate — Calculation.** For standardized jointly Gaussian X,Y with correlation 0.6, find Var(Y|X).

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-gaussian experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does a small empirical covariance eigenvalue prove a genuine low-variance population direction?

**K6 · Stretch · gate — RE/RS transfer.** Design a Gaussian conditioning implementation audit.

## Mastery check

Starting from a covariance matrix, explain its ellipse, build a sampling factor, transform it under a linear map, compute a marginal and conditional distribution, and verify the result empirically. Then identify one realistic way the Gaussian assumption could fail and how that failure would appear in data.

Next: [repeated samples, limit theorems, and Monte Carlo error](05-limit-theorems-monte-carlo.md).
