---
id: math.probability.latent-variables-elbo-gradient-estimators
title: Latent variables, the ELBO, and gradient estimators
prerequisites: [math.statistics.bayesian-modeling-computation, math.probability.transformations-convolution-jacobians]
estimated_hours: 36
---

# Latent variables, the ELBO, and gradient estimators

Two problems block every modern generative model, and both are probability problems rather than engineering problems.

The first: a latent-variable model defines \(p_\theta(x)=\int p_\theta(x\mid z)p(z)\,dz\), and that integral is intractable. You cannot evaluate the likelihood you want to maximize.

The second: even once you have an objective of the form \(E_{q_\phi(z)}[f(z)]\), you need its gradient with respect to \(\phi\) — and \(\phi\) is inside the *distribution*, not just inside the function. The ordinary "differentiate under the integral" move needs care, and the two standard answers have wildly different variance.

This unit solves both. The evidence lower bound handles the first; the score-function and pathwise estimators handle the second. Between them they account for variational autoencoders, variational inference for Bayesian posteriors, the policy gradient in reinforcement learning, and the discrete-relaxation tricks used whenever a model must sample a token or route to an expert.

## 0. Prerequisite check

You need the change-of-variables machinery from [transformations, convolution, and Jacobians](03-transformations-convolution-jacobians.md), importance sampling and KL divergence from [Bayesian modeling and computation](09-bayesian-modeling-computation.md), and the fact that \(E[\nabla\log q]=0\), which appeared as the justification for policy-gradient baselines in [limit theorems and Monte Carlo](05-limit-theorems-monte-carlo.md).

## 1. The intractable marginal

A latent-variable model says: draw \(z\sim p(z)\) from a simple prior, then draw \(x\sim p_\theta(x\mid z)\). The observed likelihood requires marginalizing:

$$
p_\theta(x)=\int p_\theta(x\mid z)\,p(z)\,dz .
$$

For a linear-Gaussian decoder this integral is closed-form. For any neural decoder it is not, and the dimension of \(z\) makes quadrature hopeless.

**Why naive Monte Carlo fails.** The integral is an expectation, so sample it:

$$
\hat p_\theta(x)=\frac1K\sum_{k=1}^Kp_\theta(x\mid z_k),
\qquad z_k\sim p(z).
$$

This is unbiased, and it is useless. For a typical \(x\), almost all prior samples \(z_k\) produce a decoder that assigns \(x\) essentially zero probability; the estimator is dominated by the rare \(z\) near the true posterior \(p(z\mid x)\). The effective sample size collapses — exactly the proposal-mismatch failure diagnosed for importance sampling in the Bayesian-computation lesson. In \(d\) latent dimensions the mismatch grows geometrically.

The fix is to propose from something close to the posterior. That is what the next section builds.

> **Practice — Foundation:** Write the marginal likelihood for a two-component mixture and confirm it is a sum rather than an integral.
>
> **Practice — Core:** For \(z\sim\mathcal N(0,1)\) and \(x\mid z\sim\mathcal N(z,0.01)\), compute the fraction of prior samples landing within two decoder standard deviations of \(x=3\), and say what that implies for \(K\).
>
> **Practice — Stretch:** Express \(\hat p_\theta(x)\) as self-normalized importance sampling with proposal \(p(z)\), and relate its effective sample size to \(\operatorname{KL}(p(z\mid x)\Vert p(z))\).

## 2. The ELBO, derived twice

Introduce any distribution \(q(z)\) with support covering the posterior. Two derivations, and the second is the one worth memorizing.

**Derivation one — Jensen's inequality.**

$$
\log p_\theta(x)
=\log\int q(z)\frac{p_\theta(x,z)}{q(z)}dz
=\log E_q\!\left[\frac{p_\theta(x,z)}{q(z)}\right]
\;\ge\;
E_q\!\left[\log\frac{p_\theta(x,z)}{q(z)}\right]
=:\mathcal L(\theta,q).
$$

The inequality is Jensen applied to the concave \(\log\). This proves \(\mathcal L\) is a lower bound but says nothing about how loose it is.

**Derivation two — the exact decomposition.** Write \(p_\theta(x,z)=p_\theta(z\mid x)p_\theta(x)\) inside the bound:

$$
\mathcal L(\theta,q)
=E_q\!\left[\log\frac{p_\theta(z\mid x)p_\theta(x)}{q(z)}\right]
=\log p_\theta(x)-\operatorname{KL}\bigl(q(z)\,\Vert\,p_\theta(z\mid x)\bigr).
$$

Rearranged:

$$
\boxed{\;\log p_\theta(x)=\mathcal L(\theta,q)+\operatorname{KL}\bigl(q(z)\Vert p_\theta(z\mid x)\bigr)\;}
$$

**The gap is exactly a KL divergence.** Three consequences follow immediately, and they are the entire logic of variational inference:

1. The bound is tight precisely when \(q\) equals the true posterior.
2. Maximizing \(\mathcal L\) over \(q\) *is* minimizing \(\operatorname{KL}(q\Vert p(z\mid x))\) — you get posterior approximation for free while doing likelihood maximization.
3. Because \(\operatorname{KL}\ge0\), improving \(\mathcal L\) never overstates \(\log p_\theta(x)\). But a *higher ELBO* does not guarantee a higher likelihood, since the gap can shrink while the likelihood falls. Comparing models by ELBO compares bounds, not likelihoods.

The direction matters. This is the **reverse** KL \(\operatorname{KL}(q\Vert p)\), which is mode-seeking: it punishes \(q\) placing mass where \(p\) has none, and tolerates \(q\) ignoring entire modes of \(p\). Variational posteriors are therefore characteristically too narrow.

**The practical form.** Split the joint:

$$
\mathcal L=\underbrace{E_q\bigl[\log p_\theta(x\mid z)\bigr]}_{\text{reconstruction}}
-\underbrace{\operatorname{KL}\bigl(q(z)\Vert p(z)\bigr)}_{\text{stay near the prior}} .
$$

Every VAE loss you have read is this line with a sign flip.

![The log evidence splits exactly into the ELBO plus the KL gap to the true posterior, so maximizing the bound tightens the posterior approximation.](../assets/elbo-decomposition.svg)

> **Practice — Foundation:** Show \(\mathcal L\le\log p_\theta(x)\) follows from the decomposition without invoking Jensen.
>
> **Practice — Core:** Derive the reconstruction-minus-KL form from \(E_q[\log p_\theta(x,z)-\log q(z)]\).
>
> **Practice — Stretch:** Construct a case where model A has a higher ELBO than model B but lower true log-likelihood. State what must be true of their posterior gaps.

## 3. Amortization

Optimizing a separate \(q\) per datapoint is expensive. Amortized inference trains one encoder \(q_\phi(z\mid x)\) to output variational parameters for any \(x\):

$$
\mathcal L(\theta,\phi)=E_{q_\phi(z\mid x)}\bigl[\log p_\theta(x\mid z)\bigr]-\operatorname{KL}\bigl(q_\phi(z\mid x)\Vert p(z)\bigr).
$$

This introduces a second gap. The total looseness is now

$$
\log p_\theta(x)-\mathcal L
=\underbrace{\operatorname{KL}(q^\star\Vert p(z\mid x))}_{\text{approximation gap}}
+\underbrace{\mathcal L(q^\star)-\mathcal L(q_\phi)}_{\text{amortization gap}},
$$

where \(q^\star\) is the best member of the variational family for this \(x\). The first is the price of the family (for example, diagonal Gaussians cannot represent correlated posteriors); the second is the price of using a shared network. They have different fixes — richer family versus more encoder capacity or per-datapoint refinement — so diagnose which one dominates before changing anything.

**The Gaussian KL, in closed form.** For \(q=\mathcal N(\mu,\sigma^2)\) and \(p=\mathcal N(0,1)\),

$$
E_q[\log q]=-\tfrac12\log(2\pi\sigma^2)-\tfrac12,
\qquad
E_q[\log p]=-\tfrac12\log(2\pi)-\tfrac12(\sigma^2+\mu^2),
$$

so

$$
\operatorname{KL}\bigl(\mathcal N(\mu,\sigma^2)\Vert\mathcal N(0,1)\bigr)
=\tfrac12\bigl(\sigma^2+\mu^2-1-\log\sigma^2\bigr).
$$

For a diagonal Gaussian this sums over coordinates. The closed form matters: it removes one source of Monte Carlo noise entirely, which is why the KL term is almost never sampled in practice.

> **Practice — Foundation:** Evaluate the Gaussian KL at \(\mu=0,\sigma=1\) and confirm it is zero.
>
> **Practice — Core:** Derive the closed form above, stating where \(E_q[z^2]=\sigma^2+\mu^2\) is used.
>
> **Practice — Stretch:** Give a posterior whose true correlation structure a diagonal Gaussian cannot capture, and quantify the resulting approximation gap for a two-dimensional example.

## 4. The gradient problem

Now the second obstacle. We need

$$
\nabla_\phi\,E_{q_\phi(z)}\bigl[f(z)\bigr]
=\nabla_\phi\int q_\phi(z)f(z)\,dz .
$$

The parameter sits in the measure. Moving the gradient inside gives \(\int\nabla_\phi q_\phi(z)\,f(z)\,dz\), which is **not** an expectation under \(q_\phi\) and so cannot be sampled directly. Two constructions repair this, and they are genuinely different — not two implementations of one idea.

### Estimator one: the score function (REINFORCE)

Use the log-derivative identity \(\nabla_\phi q_\phi=q_\phi\nabla_\phi\log q_\phi\):

$$
\nabla_\phi E_{q_\phi}[f(z)]
=\int q_\phi(z)f(z)\nabla_\phi\log q_\phi(z)\,dz
=E_{q_\phi}\bigl[f(z)\,\nabla_\phi\log q_\phi(z)\bigr].
$$

Now it *is* an expectation, so sample it. Properties:

- **Requires almost nothing.** \(f\) need not be differentiable, or even continuous. \(z\) may be discrete.
- **Unbiased**, given that differentiation and integration may be exchanged.
- **Admits baselines.** Since \(E_{q_\phi}[\nabla_\phi\log q_\phi]=\nabla_\phi\!\int q_\phi=\nabla_\phi1=0\), subtracting any constant \(b\) keeps the estimator unbiased: \(E[(f(z)-b)\nabla\log q_\phi]\). This is the identical argument that licenses advantage baselines in [policy gradients](../12-reinforcement-learning/02-policy-gradients-actor-critic.md).
- **High variance**, because \(f\) multiplies a score that can be large, and no information about \(f\)'s *shape* is used — only its value.

### Estimator two: the pathwise (reparameterization) gradient

Suppose \(z\) can be written as a deterministic, differentiable transform of parameter-free noise:

$$
z=g_\phi(\varepsilon),
\qquad
\varepsilon\sim p(\varepsilon)\ \text{independent of }\phi .
$$

Then the expectation is over a fixed distribution and the gradient passes straight through:

$$
\nabla_\phi E_{q_\phi}[f(z)]
=\nabla_\phi E_{p(\varepsilon)}\bigl[f(g_\phi(\varepsilon))\bigr]
=E_{p(\varepsilon)}\bigl[\nabla_zf(g_\phi(\varepsilon))\,\nabla_\phi g_\phi(\varepsilon)\bigr].
$$

For a Gaussian, \(z=\mu+\sigma\odot\varepsilon\) with \(\varepsilon\sim\mathcal N(0,I)\) — a location–scale transformation, which is exactly the change-of-variables construction of the transformations lesson. Properties: it needs \(f\) differentiable and \(g\) differentiable in \(\phi\); it fails outright for discrete \(z\); and it typically has **far** lower variance because it uses the gradient of \(f\), not just its value.

### How much lower? An exact comparison

Take \(q_\mu=\mathcal N(\mu,1)\) and \(f(z)=z\), so the true gradient is \(\nabla_\mu E[z]=1\).

*Score function.* \(\nabla_\mu\log q_\mu(z)=z-\mu\), so the single-sample estimator is \(z(z-\mu)\). Writing \(z=\mu+\varepsilon\):

$$
E\bigl[z(z-\mu)\bigr]=E[(\mu+\varepsilon)\varepsilon]=1,
$$

$$
E\bigl[z^2(z-\mu)^2\bigr]=E\bigl[(\mu+\varepsilon)^2\varepsilon^2\bigr]
=\mu^2E[\varepsilon^2]+2\mu E[\varepsilon^3]+E[\varepsilon^4]
=\mu^2+3,
$$

so the variance is \(\mu^2+3-1=\mu^2+2\).

*Pathwise.* \(z=\mu+\varepsilon\), so \(\nabla_\mu f(z)=1\) identically. The estimator is the constant \(1\): **variance zero**, exactly.

The contrast is stark and it is not an artifact of the toy problem: the score-function variance even *grows* with \(\mu\), meaning it degrades as the distribution moves away from the origin, while the pathwise estimator is exact. This is why continuous latent variables are reparameterized whenever possible, and why discrete latents are the hard case.

> **Practice — Foundation:** Write the reparameterization for \(\mathcal N(\mu,\sigma^2)\) and for \(\mathrm{Uniform}(a,b)\).
>
> **Practice — Core:** Redo the variance comparison for \(f(z)=z^2\) and confirm the pathwise estimator is no longer zero-variance but remains smaller.
>
> **Practice — Stretch:** Show that the optimal constant baseline for the score-function estimator is \(b^\star=E[f\lVert\nabla\log q\rVert^2]/E[\lVert\nabla\log q\rVert^2]\), and evaluate it for the example above.

## 5. Discrete latents: Gumbel-max and its relaxation

When \(z\) is a category, no differentiable reparameterization exists — the map from parameters to a discrete sample is piecewise constant, so its derivative is zero almost everywhere and undefined on a measure-zero set. Two tools.

**The Gumbel-max trick.** Let \(G_1,\ldots,G_K\) be iid standard Gumbel, so \(G_i=-\log(-\log U_i)\) with \(U_i\sim\mathrm{Uniform}(0,1)\). Then

$$
\operatorname*{arg\,max}_i\bigl(\log\pi_i+G_i\bigr)\sim\mathrm{Categorical}(\pi).
$$

*Why.* \(P(\text{index }k\text{ wins})=\int f(g)\prod_{i\ne k}F\bigl(g+\log\pi_k-\log\pi_i\bigr)dg\) with \(F(g)=\exp(-e^{-g})\); the product of Gumbel CDFs is itself a Gumbel CDF with the log-weights accumulating inside the exponent, and the integral collapses to \(\pi_k/\sum_j\pi_j\).

Two properties worth noticing. The trick is **shift-invariant**: adding a constant to every \(\log\pi_i\) leaves the argmax unchanged, which is why unnormalized logits work directly. And taking the **top \(k\)** of \(\log\pi_i+G_i\) rather than the top 1 gives an exact sample of size \(k\) *without replacement* — the standard way to draw a diverse set of candidates in one pass.

**The Gumbel-softmax (Concrete) relaxation.** Replace the argmax with a temperature-controlled softmax:

$$
\tilde z=\operatorname{softmax}\!\left(\frac{\log\pi+G}{\tau}\right).
$$

Now \(\tilde z\) is differentiable in \(\log\pi\), and as \(\tau\to0\) it converges to the one-hot sample. This buys pathwise gradients at the cost of **bias**: for \(\tau>0\) you are differentiating a different objective than the one you wrote down. The bias–variance tradeoff is explicit — small \(\tau\) means low bias and high gradient variance, large \(\tau\) the reverse — and \(\tau\) is typically annealed.

**Straight-through** takes the hard sample forward and the relaxed gradient backward. It is more biased still and has no guarantee behind it; treat it as a heuristic that often works, in the same spirit as the straight-through estimator for quantization in [constrained and composite optimization](../03-optimization/07-constrained-composite-distributed-optimization.md).

> **Practice — Foundation:** Draw a categorical sample from \(\pi=(0.2,0.5,0.3)\) using Gumbel-max with supplied uniforms.
>
> **Practice — Core:** Verify the shift invariance claim algebraically, and explain why it means logits need no normalization.
>
> **Practice — Stretch:** Design an experiment measuring the bias of the Gumbel-softmax gradient as a function of \(\tau\) against a REINFORCE reference, and state which estimator you would ship for a routing layer with 64 experts.

## 6. Tightening and reporting the bound

The single-sample ELBO is not the only bound. The importance-weighted bound

$$
\mathcal L_K=E\!\left[\log\frac1K\sum_{k=1}^K\frac{p_\theta(x,z_k)}{q_\phi(z_k\mid x)}\right],
\qquad z_k\stackrel{\text{iid}}\sim q_\phi ,
$$

satisfies \(\mathcal L_1\le\mathcal L_K\le\mathcal L_{K+1}\le\log p_\theta(x)\), with \(\mathcal L_K\to\log p_\theta(x)\) as \(K\to\infty\). It is the same self-normalized importance-sampling estimator from the Bayesian-computation lesson, inside a logarithm — and it inherits the same effective-sample-size diagnostics. Reporting \(\mathcal L_{1}\) and \(\mathcal L_{64}\) together is a cheap, honest way to show how loose your bound is.

## 7. Failure modes

- **Posterior collapse.** If the decoder is powerful enough to model \(x\) without \(z\), the optimizer drives \(q_\phi(z\mid x)\to p(z)\), the KL term to zero, and the latent becomes unused. Diagnose by reporting per-dimension KL, not the total.
- **Comparing ELBOs across models.** Different likelihood parameterizations (discretized versus continuous, different data scaling) change the number without changing the model's quality. Continuous densities are not probabilities and can be positive in log — the random-variables lesson's warning, resurfacing.
- **Reporting an ELBO as a likelihood.** It is a bound with an unmeasured gap. Report \(\mathcal L_K\) for growing \(K\) if you want to claim tightness.
- **KL annealing without disclosure.** Down-weighting the KL term optimizes a different objective; the resulting number is no longer a bound on \(\log p_\theta(x)\).
- **Using REINFORCE without a baseline** and concluding the method does not work.
- **Using a relaxation and reporting it as exact.** Gumbel-softmax gradients are biased at any \(\tau>0\).
- **Ignoring the amortization gap** and adding capacity to the wrong component.

## 8. Runnable labs

**Lab A — the Gaussian ELBO terms.** Implement `gaussian_elbo_terms` in the [learner exercises file](../../labs/exercises.py). Given a reconstruction log-likelihood and the diagonal Gaussian parameters \(\mu\) and \(\log\sigma^2\) produced by an encoder, return the KL to the standard normal prior and the resulting ELBO, using the closed form of section 3. Reject mismatched parameter lengths, empty parameters, and non-finite values.

Then investigate: hold the reconstruction fixed and sweep \(\mu\) and \(\log\sigma^2\) to see which configurations the KL term punishes. Confirm the KL is zero only at \(\mu=0,\log\sigma^2=0\), and show that a collapsed latent is exactly the minimizer of the KL term alone.

**Lab B — Gumbel-max sampling.** Implement `gumbel_max_sample` in the [learner exercises file](../../labs/exercises.py). Given unnormalized log-weights and a seed, draw one uniform per category in index order from a local `random.Random(seed)`, form \(g_i=-\log(-\log u_i)\), and return the index maximizing \(\log w_i+g_i\). Reject an empty weight list and non-finite weights.

Then investigate: draw many samples across seeds and compare the empirical frequencies with \(\operatorname{softmax}(\log w)\). Verify shift invariance numerically by adding a large constant to all log-weights. Then implement Gumbel top-\(k\) by taking the \(k\) largest perturbed values, and check its frequencies against sampling without replacement.

## 9. Derivations to own

1. The ELBO by Jensen, and again by the exact \(\log p=\mathcal L+\operatorname{KL}\) decomposition.
2. The reconstruction-minus-KL form.
3. The closed-form Gaussian KL \(\tfrac12(\sigma^2+\mu^2-1-\log\sigma^2)\).
4. The score-function identity via \(\nabla q=q\nabla\log q\), and the unbiasedness of baselines from \(E[\nabla\log q]=0\).
5. The pathwise gradient for a location–scale family.
6. The exact variance comparison \(\mu^2+2\) versus \(0\) for \(f(z)=z\).
7. The Gumbel-max claim, at least to the level of the CDF-product argument.

## 10. End-of-unit practice (graded)

**Foundation**

1. Compute \(\operatorname{KL}(\mathcal N(2,0.25)\Vert\mathcal N(0,1))\).
2. State the reparameterization for \(\mathcal N(\mu,\sigma^2)\) and say why \(\varepsilon\) must not depend on \(\phi\).
3. Given \(\log w=(0,1,2)\), compute \(\operatorname{softmax}(\log w)\).

**Core**

4. Prove \(E_{q_\phi}[\nabla_\phi\log q_\phi(z)]=0\) and explain precisely why this makes baselines unbiased.
5. Derive the ELBO gap as a KL divergence, and use it to explain why maximizing the ELBO over \(q\) performs posterior inference.
6. Show the score-function estimator remains valid when \(f\) is an indicator function, and explain why the pathwise estimator does not.
7. A team reports ELBO improving while held-out reconstruction worsens. Explain how, using the two terms of the bound.

**Stretch**

8. A VAE on text shows total KL near zero after 2,000 steps and produces plausible samples. State what has happened, give two diagnostics that distinguish collapse from a genuinely uninformative latent, and propose one fix with its cost.
9. A routing layer must choose one of 64 experts per token. Compare REINFORCE-with-baseline against Gumbel-softmax on bias, variance, and the effect of load-balancing penalties, and recommend one with the evidence you would collect.
10. Prove \(\mathcal L_K\le\mathcal L_{K+1}\) for the importance-weighted bound, and explain why larger \(K\) reduces the bound gap but not necessarily the gradient variance.

<details><summary>Solution sketches</summary>

1. \(\tfrac12(0.25+4-1-\log0.25)=\tfrac12(3.25+1.386)\approx2.32\).
2. \(z=\mu+\sigma\varepsilon\), \(\varepsilon\sim\mathcal N(0,1)\). If \(\varepsilon\) depended on \(\phi\) the expectation would again be over a parameter-dependent measure and the gradient could not pass inside.
3. Denominators \(e^0+e^1+e^2=1+2.718+7.389=11.107\), giving \((0.090,0.245,0.665)\).
4. \(E[\nabla\log q]=\int q\nabla\log q=\int\nabla q=\nabla\int q=\nabla1=0\). Hence \(E[b\nabla\log q]=0\) for constant \(b\), so subtracting it changes no expectation while it can change variance.
5. Substitute \(p(x,z)=p(z\mid x)p(x)\) into \(E_q[\log p(x,z)-\log q]\); the \(\log p(x)\) term is constant in \(z\) and factors out, leaving \(-\operatorname{KL}(q\Vert p(z\mid x))\). Since \(\log p(x)\) does not depend on \(q\), maximizing \(\mathcal L\) over \(q\) minimizes that KL.
6. The score-function form requires only that \(f\) be integrable — its value is multiplied by a score, never differentiated. The pathwise form needs \(\nabla_zf\), which for an indicator is zero almost everywhere and therefore carries no signal.
7. The bound is reconstruction minus KL. A model can improve the total by collapsing the KL term toward zero faster than reconstruction degrades. Report both terms separately.
8. Posterior collapse: the decoder is autoregressive and can model text without \(z\). Distinguish by per-dimension KL (collapse shows *all* dimensions near zero) and by a latent-intervention test (resample \(z\), see if samples change). Fixes include KL annealing, a free-bits floor per dimension, or weakening the decoder — each changes the objective and must be reported.
9. REINFORCE is unbiased but high variance, and its variance worsens with 64 categories; a learned baseline is essential. Gumbel-softmax is biased at any \(\tau\), but its variance is far lower and it interacts cleanly with differentiable load-balancing penalties. Collect: gradient-variance traces at matched batch size, bias measured against a large-sample REINFORCE reference, and downstream loss at matched compute.
10. Apply Jensen to the average of \(K+1\) weights viewed as a mixture over which index is dropped; the concavity of \(\log\) gives monotonicity. The bound gap shrinks because the estimator concentrates, but the *gradient* variance can rise because each term is a ratio and the log of an average does not decompose across samples.

</details>

## Mastery check

Derive the ELBO both ways and state exactly what the gap is; produce the reconstruction-minus-KL form and the closed-form Gaussian KL from scratch; derive both gradient estimators, state the assumptions each requires, and reproduce the exact variance comparison; explain why discrete latents break reparameterization and what Gumbel-max and its relaxation do about it; and, shown a training run whose ELBO improves while samples worsen, name the term responsible and the diagnostic that proves it.
