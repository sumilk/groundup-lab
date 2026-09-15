---
id: math.probability.transformations-convolution-jacobians
title: Transformations, convolution, and Jacobians
prerequisites: [math.probability.joint-conditioning-covariance, math.calculus.gradients-optimization]
estimated_hours: 28
---

# Transformations, convolution, and Jacobians

Models constantly transform random quantities: logits become probabilities, base noise becomes generated samples, independent errors add, and coordinate systems change. Transforming values is easy to write as \(Y=g(X)\). Transforming the **distribution** requires accounting for which inputs reach each output and how the map stretches probability mass.

This unit develops that accounting from finite many-to-one maps through continuous Jacobian determinants. By the end, you should be able to derive transformed PMFs and densities, convolve independent variables, identify every inverse branch, and audit the log-determinant term in an invertible probabilistic model.

## 0. Three questions before calculating

For \(Y=g(X)\), ask:

1. What is the support of \(Y\)?
2. For a candidate \(y\), which inputs satisfy \(g(x)=y\)?
3. Does the map compress or expand nearby intervals or volumes?

The first prevents impossible outputs, the second prevents lost probability branches, and the third determines the derivative or determinant correction.

> **Practice — Foundation:** For each map—\(X^2\), \(e^X\), and \((X_1+X_2,X_1-X_2)\)—state whether it is one-to-one on all real inputs.
>
> **Practice — Core:** Before calculating, list support, inverse branches, and dimension for \(Y=|X|\) and for \(Y=X_1+X_2\).
>
> **Practice — Stretch:** Give a transformation problem for which a direct PMF sum, a CDF argument, and a Jacobian formula are each possible. Compare which route is least error-prone.

## 1. Discrete transformations add mass over preimages

For discrete \(X\),

$$
p_Y(y)=\sum_{x:g(x)=y}p_X(x).
$$

**Worked example — squaring a discrete variable.** Let \(X\) be uniform on \(\{-2,-1,0,1,2\}\) and \(Y=X^2\). Its support is \(\{0,1,4\}\). The preimages give

$$
P(Y=0)=\frac15,
\quad
P(Y=1)=P(X=-1)+P(X=1)=\frac25,
$$

and

$$
P(Y=4)=P(X=-2)+P(X=2)=\frac25.
$$

A tempting error is to assign \(1/3\) to each output merely because there are three possible values. Output values need not be equally likely.

<details><summary>Checkpoint: clipping collects mass</summary>

Let \(Y=\min(X,2)\). Every input value at least two maps to \(Y=2\), so \(P(Y=2)=P(X\ge2)\). Clipping creates a point mass at the boundary even if the original variable had several distinct values beyond it.

</details>

> **Practice — Foundation:** Map the support and PMF of \(X\in\{-2,-1,1,3\}\) through \(Y=X^2\).
>
> **Practice — Core:** For two independent fair dice, derive the PMF of \(Y=\max(X_1,X_2)\) by summing all preimages.
>
> **Practice — Stretch:** Implement a generic finite-support transformation that groups inputs by output. Test conservation of total mass and show why floating-point output keys need care.

## 2. The CDF method works before density calculus

For any transformation, begin with

$$
F_Y(y)=P(g(X)\le y).
$$

Solve the inequality as an event about \(X\), then use the known distribution of \(X\). If the resulting CDF is differentiable, differentiate it to obtain a density.

**Worked example — square a uniform variable.** If \(X\sim\operatorname{Uniform}(0,1)\) and \(Y=X^2\), then \(0\le Y\le1\). For \(0\le y\le1\),

$$
F_Y(y)=P(X^2\le y)=P(X\le\sqrt y)=\sqrt y.
$$

Therefore

$$
f_Y(y)=\frac{1}{2\sqrt y},\qquad0<y<1.
$$

The density grows near zero because squaring compresses many small positive inputs into an even shorter output interval. The infinite height is integrable: its total area remains one.

> **Practice — Foundation:** For \(X\sim\text{Uniform}(0,1)\) and \(Y=\sqrt X\), express \(F_Y(y)\) as an event about \(X\).
>
> **Practice — Core:** Use the CDF method to derive the distribution of \(Y=-\log X\) for a uniform \(X\). Track the support before differentiating.
>
> **Practice — Stretch:** Apply the CDF method to a decreasing transformation and identify exactly where the inequality reverses.

## 3. Monotone one-dimensional transformations

Let \(g\) be differentiable and strictly monotone. With \(x=g^{-1}(y)\), probability in corresponding small intervals must match:

$$
f_Y(y)\,dy\approx f_X(x)\,dx.
$$

Thus

$$
f_Y(y)
=f_X(g^{-1}(y))
\left|\frac{d}{dy}g^{-1}(y)\right|.
$$

The absolute value handles decreasing transformations. A density cannot become negative merely because the map reverses orientation.

### Affine transformation

For \(Y=aX+b\), \(a\ne0\),

$$
f_Y(y)=
f_X\!\left(\frac{y-b}{a}\right)\frac1{|a|}.
$$

The factor \(1/|a|\) is necessary: stretching the horizontal axis by \(|a|\) must shrink density height by the same factor to preserve area.

### Log transformation

For positive \(X\) and \(Y=\log X\), the inverse is \(x=e^y\) with derivative \(e^y\), so

$$
f_Y(y)=f_X(e^y)e^y.
$$

Equivalently, if \(Y\) is Gaussian then \(X=e^Y\) has a positive skewed distribution. Exponentiation changes both support and tail shape.

> **Practice — Foundation:** If \(Y=3X-4\), write the inverse, derivative of the inverse, transformed support, and density formula.
>
> **Practice — Core:** Derive the density of \(Y=e^X\) for a variable with known density \(f_X\), including the positivity restriction.
>
> **Practice — Stretch:** Check the normalization of a transformed density by substitution, showing how the inverse-derivative factor cancels the coordinate change.

## 4. Non-injective maps require every inverse branch

If several regular input values map to \(y\),

$$
f_Y(y)=
\sum_{x:g(x)=y}\frac{f_X(x)}{|g'(x)|}.
$$

**Worked example — absolute value.** If \(X\sim\operatorname{Uniform}(-1,1)\) and \(Y=|X|\), then for \(0<y<1\), both \(x=y\) and \(x=-y\) contribute. Each branch has density \(1/2\) and derivative magnitude one, so

$$
f_Y(y)=\frac12+\frac12=1.
$$

Using only the positive branch would integrate to one half and immediately reveal lost mass.

**Worked example — square a standard Gaussian.** For \(Y=X^2\) and \(y>0\), the roots are \(\pm\sqrt y\), with derivative magnitude \(2\sqrt y\). Symmetry gives

$$
f_Y(y)
=\frac{f_X(\sqrt y)+f_X(-\sqrt y)}{2\sqrt y}
=\frac{1}{\sqrt{2\pi y}}e^{-y/2}.
$$

> **Practice — Foundation:** List every preimage of a positive \(y\) under \(g(x)=x^2\).
>
> **Practice — Core:** Derive the density of \(Y=|X|\) for a general continuous \(X\), then simplify it when \(X\) is symmetric.
>
> **Practice — Stretch:** For \(Y=X^3-X\), determine how many inverse branches exist in different output regions and outline how the density formula changes at turning points.

## 5. A multivariate Jacobian measures local volume change

Let \(Y=g(X)\) be a differentiable one-to-one map on \(\mathbb R^d\). The Jacobian matrix is

$$
J_g(x)=\left[\frac{\partial g_i}{\partial x_j}\right]_{ij}.
$$

Near \(x\), the map behaves like its linear approximation \(J_g(x)\). The absolute determinant measures the local volume scale.

![A coordinate grid transformed into a sheared grid; the Jacobian determinant gives local area scaling.](../assets/jacobian-grid.svg)

The density rule is

$$
f_Y(y)
=f_X(g^{-1}(y))
\left|\det J_{g^{-1}}(y)\right|.
$$

Equivalently,

$$
\log f_Y(y)
=\log f_X(x)-\log|\det J_g(x)|,
\qquad y=g(x).
$$

The determinant is not generally the product of diagonal entries. That shortcut works for triangular or diagonal Jacobians, not arbitrary matrices.

> **Practice — Foundation:** Compute the Jacobian matrix and determinant of \(g(x_1,x_2)=(2x_1,3x_2)\).
>
> **Practice — Core:** For \(g(x_1,x_2)=(x_1+x_2,x_1-x_2)\), derive the inverse map and its absolute determinant.
>
> **Practice — Stretch:** Numerically transform a tiny square through a nonlinear map at several locations and compare measured area ratios with the local determinant prediction.

## 6. Affine maps make the determinant visible

For invertible \(Y=AX+b\),

$$
f_Y(y)
=f_X(A^{-1}(y-b))\frac1{|\det A|}.
$$

**Worked example — shear and stretch.** Let

$$
A=\begin{bmatrix}2&1\\0&1\end{bmatrix}.
$$

Its determinant is two, so every small area doubles. The transformed density is

$$
f_Y(y_1,y_2)
=\frac12f_X\!\left(\frac{y_1-y_2}{2},y_2\right).
$$

The shear changes shape and orientation but not the determinant beyond the factor contributed by the stretch.

If \(A\) is singular, outputs lie in a lower-dimensional subspace. There is then no ordinary full-dimensional density, and dividing by a zero determinant is not a valid operation.

> **Practice — Foundation:** For \(Y=AX+b\) with invertible \(A\), state how a unit volume changes and which determinant enters the density.
>
> **Practice — Core:** Transform a uniform density on the unit square through a diagonal scaling matrix and verify that the new constant density integrates to one.
>
> **Practice — Stretch:** Explain what fails when \(A\) is singular. Describe the lower-dimensional support of \(Y\) rather than forcing an ordinary full-dimensional density.

## 7. Polar coordinates explain the radial factor

For

$$
x=r\cos\theta,
\qquad
y=r\sin\theta,
$$

the forward Jacobian is

$$
\frac{\partial(x,y)}{\partial(r,\theta)}
=\begin{bmatrix}
\cos\theta&-r\sin\theta\\
\sin\theta&r\cos\theta
\end{bmatrix},
$$

whose determinant is \(r\). Therefore

$$
dx\,dy=r\,dr\,d\theta.
$$

The factor \(r\) reflects geometry: a thin ring at large radius has greater area than one of the same thickness near the origin.

<details><summary>Checkpoint: why uniform radius is not uniform area</summary>

Sampling \(R\sim\operatorname{Uniform}(0,1)\) and a uniform angle puts too much probability near the centre of a disk. Uniform area requires \(P(R\le r)=r^2\), hence \(R=\sqrt U\) for uniform \(U\).

</details>

> **Practice — Foundation:** Compute the polar-coordinate Jacobian and explain geometrically why a thin angular wedge has area proportional to radius.
>
> **Practice — Core:** Starting from a rotationally symmetric bivariate density, integrate over angle to derive the radial density and verify its normalization.
>
> **Practice — Stretch:** Derive the distribution of squared radius instead of radius and compare the two Jacobian corrections near zero.

## 8. Sums create convolution

Let \(S=X+Y\). For discrete variables,

$$
p_S(s)=\sum_xp_{X,Y}(x,s-x).
$$

If \(X\) and \(Y\) are independent,

$$
p_S(s)=\sum_xp_X(x)p_Y(s-x).
$$

For independent continuous variables,

$$
f_S(s)=\int_{-\infty}^{\infty}f_X(x)f_Y(s-x)\,dx.
$$

**Worked example — two fair dice.** Each die has PMF \(1/6\) on \(1,\ldots,6\). For a sum of seven, six products contribute, so

$$
P(S=7)=6\left(\frac16\frac16\right)=\frac16.
$$

For a sum of two, only \((1,1)\) contributes, giving \(1/36\). Convolution automatically captures the triangular shape of the sum distribution.

**Worked continuous example.** If \(X,Y\) are independent uniform variables on \([0,1]\), the integrand equals one where both \(0\le x\le1\) and \(0\le s-x\le1\). The overlap interval has length

$$
f_S(s)=
\begin{cases}
s,&0\le s\le1,\\
2-s,&1<s\le2,\\
0,&\text{otherwise}.
\end{cases}
$$

> **Practice — Foundation:** Convolve the PMFs of two independent Bernoulli variables and identify the resulting support.
>
> **Practice — Core:** Derive the triangular density for the sum of two independent uniform \((0,1)\) variables by finding the integration limits separately for each region.
>
> **Practice — Stretch:** Show with a dependent pair that marginal distributions alone do not determine the distribution of a sum. Compare perfect positive and negative dependence.

## 9. Means and variances of sums

Linearity always gives

$$
E[X+Y]=E[X]+E[Y].
$$

Variance gives

$$
\operatorname{Var}(X+Y)
=\operatorname{Var}(X)+\operatorname{Var}(Y)
+2\operatorname{Cov}(X,Y).
$$

Independence makes covariance zero, but convolution of marginals requires the stronger independence statement, not merely zero covariance.

> **Practice — Foundation:** Compute the mean and variance of a sum of \(n\) independent variables with common mean \(\mu\) and variance \(\sigma^2\).
>
> **Practice — Core:** Derive \(\operatorname{Var}(X+Y)\) without assuming independence and identify the covariance contribution.
>
> **Practice — Stretch:** Construct two identically distributed summands with covariance close to its largest and smallest possible values. Compare the resulting sum variances.

## 10. Why Jacobians appear in ML

- **Normalizing transformations:** an invertible map turns simple base noise into a richer distribution, with log density corrected by a log absolute determinant.
- **Reparameterization:** writing a sample as a deterministic transformation of parameter-free noise can expose differentiable parameter paths.
- **Constrained parameters:** exponentials and softmax-like maps move unconstrained values into positive or simplex-valued spaces, changing geometry and density.
- **Data preprocessing:** a nonlinear transform changes the implied model when predictions are converted back to original units.
- **Generated coordinates:** rotations, scaling, and projection can create singular output laws if dimensions collapse.

> **Practice — Foundation:** Identify the transformation and log-absolute-determinant term in a one-dimensional flow \(y=ax+b\).
>
> **Practice — Core:** Explain why reparameterizing a continuous latent variable requires a Jacobian but renaming categorical labels does not use the same density formula.
>
> **Practice — Stretch:** Audit a proposed normalizing-flow layer whose Jacobian determinant can be zero. Describe the mathematical and numerical consequences for likelihood evaluation.

## 11. Normalizing flows: the change of variables becomes a model

Every ingredient of a modern density model is already on this page. A normalizing flow is nothing more than the multivariate change-of-variables formula, applied deliberately and stacked.

**The construction.** Take a simple base density — a standard Gaussian \(p_Z\) — and an invertible, differentiable map \(f\) with \(x=f(z)\). The transformed density follows immediately from the Jacobian rule derived above:

$$
p_X(x)=p_Z\bigl(f^{-1}(x)\bigr)\,\left|\det\frac{\partial f^{-1}}{\partial x}\right| ,
$$

or, more usefully for fitting,

$$
\log p_X(x)=\log p_Z\bigl(f^{-1}(x)\bigr)+\log\left|\det\frac{\partial f^{-1}(x)}{\partial x}\right| .
$$

This is an **exact** log-likelihood, not a bound and not an approximation. You can train it by plain maximum likelihood, evaluate it on held-out data, and compare models by a real number — which is precisely what variational and energy-based approaches cannot do.

**Composition.** Invertible maps compose, and determinants multiply, so for \(f=f_K\circ\cdots\circ f_1\),

$$
\log p_X(x)=\log p_Z(z)+\sum_{k=1}^K\log\left|\det\frac{\partial f_k^{-1}}{\partial u_k}\right| .
$$

Depth costs a sum of log-determinants. That is the whole design problem.

**The determinant is the bottleneck.** A general \(d\times d\) determinant costs \(O(d^3)\), which is impossible at image or audio scale. Every flow architecture is an answer to "how do I get an expressive invertible map whose Jacobian determinant is cheap?" Two answers dominate:

- **Triangular Jacobians.** If output coordinate \(i\) depends only on input coordinates \(\le i\), the Jacobian is triangular and its determinant is the product of the diagonal — \(O(d)\). Autoregressive flows are built exactly this way.
- **Coupling layers.** Split \(z=(z_a,z_b)\). Leave \(z_a\) untouched and transform \(z_b\) by an affine map whose scale and shift are arbitrary functions of \(z_a\):

$$
x_a=z_a,
\qquad
x_b=z_b\odot\exp\bigl(s(z_a)\bigr)+t(z_a).
$$

The Jacobian is block-triangular with identity in one block, so

$$
\log\left|\det\frac{\partial x}{\partial z}\right|=\sum_i s_i(z_a),
$$

a plain sum of network outputs. The functions \(s\) and \(t\) may be arbitrarily complex neural networks — they are never inverted — while the layer as a whole stays exactly invertible. Alternating which half is transformed lets information mix.

**Worked example — one affine coupling step.** Let \(d=2\), \(z=(1.0,\,2.0)\), \(s(z_a)=0.5z_a\) and \(t(z_a)=z_a\). Then \(x_a=1.0\) and

$$
x_b=2.0\cdot e^{0.5}+1.0\approx2.0\times1.6487+1.0=4.297 ,
$$

with \(\log|\det|=s(z_a)=0.5\). Inverting requires only \(z_b=(x_b-t(x_a))e^{-s(x_a)}\), using \(x_a=z_a\) — no network inversion anywhere.

**What flows cost.** Invertibility forces the latent space to have the **same dimension** as the data, so a flow cannot compress; and the requirement that every layer be invertible constrains architecture far more than a free-form decoder. That is the trade: exact likelihoods and exact inversion in exchange for dimension preservation and architectural restriction.

**Where else the same formula appears.** The instantaneous version of this identity — \(d\log p/dt=-\nabla\cdot f\) along a continuous flow — is what gives deterministic diffusion samplers an exact likelihood, and the discrete version here is the reason a Jacobian term shows up whenever a model reparameterizes its outputs. It is worth noticing that a change of variables is not a trick specific to flows; it is the single rule that governs how a density behaves under any invertible transformation, including the ones you apply during data preprocessing. Standardizing, log-transforming, or rescaling targets all change the density by a Jacobian factor, which is why likelihoods computed in different units are not comparable.

> **Practice — Foundation:** Apply the coupling formula to \(z=(2.0,\,3.0)\) with \(s(z_a)=-0.5z_a\) and \(t(z_a)=1\), and report both \(x\) and the log-determinant.
>
> **Practice — Core:** Show that the Jacobian of an affine coupling layer is block-triangular, and derive the log-determinant expression. Then write the exact inverse.
>
> **Practice — Stretch:** A team compares a flow trained on raw pixel values in \([0,255]\) with one trained on values scaled to \([0,1]\) and reports that the second has far better log-likelihood. Explain the discrepancy quantitatively using the Jacobian of the rescaling, and state the correction that makes the numbers comparable.

## 12. Runnable lab: discrete convolution

Implement `discrete_convolution` in [labs/exercises.py](../../labs/exercises.py). Each input maps a finite numeric value to a nonnegative, possibly unnormalized weight. Return the normalized PMF of the sum of two independent draws.

Run:

```text
python -m labs.checks convolution
```

The checks require scale invariance, sparse and overlapping sums, input preservation, and rejection of invalid distributions.

### Mini-experiment

Convolve a fair-die PMF with itself repeatedly. After each addition, record the standardized sum distribution. Plot it and describe what changes in support, centre, spread, and shape. Do not invoke a limiting theorem yet; this experiment motivates the next unit.

## 13. Derivations to own

1. Derive a discrete transformed PMF from preimages.
2. Derive \(Y=X^2\) for positive uniform \(X\) using the CDF method.
3. Derive the monotone density rule from interval probability.
4. Derive the many-branch rule and check normalization.
5. Compute the affine Jacobian density correction.
6. Derive the polar-coordinate factor \(r\).
7. Derive discrete and continuous convolution from a joint law.
8. Explain why zero covariance is insufficient for convolution of marginals.

## 14. End-of-unit practice (graded)

**Foundation — problems 1–3.** Track support, preimages, and one-dimensional probability correctly.

1. Transform a categorical variable under a many-to-one relabelling and verify mass conservation.
2. If \(X\sim\operatorname{Uniform}(0,1)\), derive the density of \(Y=-\log X\).
3. If \(X\) has density \(2x\) on \([0,1]\), derive the density of \(Y=X^2\).

**Core — problems 4–8.** Combine inverse branches, determinants, coordinate systems, and convolution.

4. Derive the distribution of \(|X|\) for a symmetric density \(f_X\).
5. Transform a uniform point in the unit square by \(A=\begin{bmatrix}3&1\\0&2\end{bmatrix}\); find its support area and density.
6. Derive a uniform-area sampler for a disk using two independent uniform variables.
7. Convolve Bernoulli PMFs and recover the binomial PMF for two trials.
8. Convolve two uniform \([0,1]\) densities and verify the result integrates to one.

**Stretch — problems 9–12.** Diagnose dependence, density bookkeeping, and transformations used in models.

9. Construct dependent variables with the same marginals for which the independent convolution formula gives the wrong sum distribution.
10. Explain the sign and placement of the log-determinant term in a transformed log density.
11. Derive the density of the product \(Z=XY\) for independent uniform \((0,1)\) variables. Choose and justify either a CDF, conditioning, or multivariate-transformation route.
12. A learned transformation is invertible in theory but has singular values near zero on some inputs. Design numerical checks for inverse error, log-determinant stability, and conservation of simulated mass.

<details><summary>Worked solutions</summary>

1. Sum the input masses for every output label. The output total equals the input total because every input belongs to exactly one preimage.
2. For \(y\ge0\), \(P(-\log X\le y)=P(X\ge e^{-y})=1-e^{-y}\); the density is \(e^{-y}\).
3. Since \(F_X(x)=x^2\), \(F_Y(y)=P(X^2\le y)=F_X(\sqrt y)=y\). Thus \(Y\) is uniform on \([0,1]\).
4. For \(y>0\), the branches are \(y\) and \(-y\), so \(f_{|X|}(y)=f_X(y)+f_X(-y)=2f_X(y)\) under symmetry.
5. The determinant is six, so the image parallelogram has area six and constant density \(1/6\).
6. Draw \(U,V\) independently uniform, set \(R=\sqrt U\), \(\Theta=2\pi V\), and return \((R\cos\Theta,R\sin\Theta)\).
7. The sum masses are \((1-p)^2\), \(2p(1-p)\), and \(p^2\), which are the \(n=2\) binomial probabilities.
8. Integrate \(s\) from zero to one and \(2-s\) from one to two; each triangle has area one half.
9. Let \(Y=X\) for a fair Bernoulli \(X\). The true sum is only zero or two, while independent convolution assigns positive mass to one.
10. Forward stretching by \(|\det J_g|\) spreads the same mass over more volume, so density divides by this factor and log density subtracts its logarithm.
11. For \(0<z<1\), conditioning on \(X=x\) gives \(P(XY\le z)=\int_0^z1\,dx+\int_z^1(z/x)\,dx=z-z\log z\). Differentiating yields \(f_Z(z)=-\log z\).
12. Evaluate round-trip error on ordinary and adversarial points; compare analytic and numerical Jacobians; compute log determinants through stable factorizations; inspect minimum singular values; and compare transformed sample frequencies with predicted region probabilities.

</details>

## Mastery check

Given an unfamiliar transformation, determine its output support and inverse branches, derive its distribution using both a CDF and Jacobian where possible, verify normalization, and validate it by simulation. Given two finite PMFs, convolve them by hand and with code while stating exactly where independence is used.

Next: [multivariate Gaussian geometry and conditioning](04-multivariate-gaussian-geometry.md).
