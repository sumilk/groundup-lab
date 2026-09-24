---
id: math.probability.score-matching-diffusion-sampling
title: Score matching, diffusion, and sampling from generative models
prerequisites: [math.probability.latent-variables-elbo-gradient-estimators, math.probability.multivariate-gaussian-geometry]
answers: ps-15-score-matching-diffusion-sampling
estimated_hours: 36
---

# Score matching, diffusion, and sampling from generative models

The previous unit handled an intractable *integral* — the marginal likelihood — with a bound. This unit handles an intractable *constant*, and then asks a question that is usually skipped entirely: once you have a trained generative model, what distribution are you actually sampling from?

The answer to the second question is almost never "the model's distribution", and the gap between the two is where a great deal of confused evaluation lives.

Three threads run through the unit. **Scores** let you learn a density without ever computing its normalizer. **Diffusion** turns score estimation into a noise-prediction regression, and turns out to be the evidence lower bound of the previous unit applied to a fixed hierarchical encoder. **Decoding** — temperature, top-\(k\), top-\(p\) — is distribution surgery performed after training, and it silently invalidates the likelihood numbers you reported.

## 0. Prerequisite check

You need the ELBO and the reparameterization trick from [latent variables and the ELBO](14-latent-variables-elbo-gradient-estimators.md), the convolution-of-Gaussians result from [transformations and convolution](03-transformations-convolution-jacobians.md), and the fact that a density is not a probability from [random variables and distributions](01-random-variables-distributions.md).

### Learning route: field, corruption, reversal, sampler

The chapter has four conceptual moves.

1. A score is a vector field \(\nabla_x\log p(x)\) that forgets the unknown normalizing constant.
2. Denoising replaces the unavailable data score with a supervised target under a known corruption process.
3. Diffusion repeats that corruption over noise levels, yielding closed-form forward marginals and a learned reverse process.
4. A numerical sampler, guidance rule, or decoding rule creates the distribution observed by users.

Always distinguish the data distribution, learned score model, ideal reverse-time distribution, and finite-step guided or truncated sampler. They coincide only under assumptions that should be stated.

## 1. The normalizer is the enemy; the score does not care

An energy-based model writes

$$
p_\theta(x)=\frac{\exp\bigl(-E_\theta(x)\bigr)}{Z_\theta},
\qquad
Z_\theta=\int\exp\bigl(-E_\theta(x)\bigr)dx .
$$

\(Z_\theta\) is an integral over the whole data space. In \(d=3\times10^5\) pixels it is not merely expensive, it is unapproachable. Maximum likelihood needs \(\nabla_\theta\log Z_\theta\), so maximum likelihood is blocked.

Now take the gradient **with respect to \(x\)** instead:

$$
s(x):=\nabla_x\log p_\theta(x)=-\nabla_xE_\theta(x)-\underbrace{\nabla_x\log Z_\theta}_{=0} .
$$

\(Z_\theta\) does not depend on \(x\), so it vanishes. The **score** \(\nabla_x\log p(x)\) is a complete description of the density up to a constant, and it is computable from an unnormalized model. This single observation is why the entire modern generative-modelling stack is built on scores rather than likelihoods.

Geometrically the score is a vector field pointing uphill in density: follow it and you move toward regions where data lives.

> **Practice — Foundation:** For \(p=\mathcal N(2,4)\), compute the score \(\nabla_x\log p(x)\) at \(x=0\) and at \(x=5\), and confirm that each points toward the mean 2.
>
> **Hint:** Differentiating \(-(x-\mu)^2/(2\sigma^2)\) gives \(-(x-2)/4\), so the values are \(+0.5\) and \(-0.75\).
>
> **Practice — Core:** Take \(E_1(x)=x^2/2\) and \(E_2(x)=x^2/2+7\). Compute both scores, both normalizers \(Z_1,Z_2\), and both normalized densities, and explain what this means for identifiability of \(E_\theta\).
>
> **Hint:** Both scores are \(-x\); \(Z_1=\sqrt{2\pi}\) and \(Z_2=e^{-7}\sqrt{2\pi}\), so the factor \(e^{-7}\) cancels and both densities are \(\mathcal N(0,1)\).
>
> **Practice — Stretch:** (a) For \(s(x)=x-x^3\) on \(\mathbb R\), recover \(\log p\) up to a constant and check normalizability. (b) Show \(s(x,y)=(-x-y,\;x-y)\) is not the score of any density. (c) Show \(s(x)=x\) integrates to a potential but is still not a valid score.
>
> **Hint:** Integrate along a path: (a) gives \(x^2/2-x^4/4\), whose exponential is integrable; in (b) the mixed partials are \(-1\) and \(+1\), so no potential exists; in (c) \(e^{x^2/2}\) has infinite integral.

## 2. Score matching and Hyvärinen's identity

We want \(s_\theta\approx\nabla_x\log p_{\text{data}}\), but we cannot evaluate the target — that is the whole problem. The Fisher divergence

$$
J(\theta)=\tfrac12E_{p_{\text{data}}}\Bigl[\bigl\lVert s_\theta(x)-\nabla_x\log p_{\text{data}}(x)\bigr\rVert^2\Bigr]
$$

still mentions the unknown. Expand the square:

$$
J(\theta)=E_p\Bigl[\tfrac12\lVert s_\theta\rVert^2\Bigr]
-E_p\bigl[s_\theta(x)^T\nabla_x\log p(x)\bigr]
+\text{const} .
$$

The middle term is the one to attack. Using \(p\nabla\log p=\nabla p\) and integrating by parts (the boundary term vanishes when \(p\) decays at infinity),

$$
-\int p(x)\,s_\theta(x)^T\nabla_x\log p(x)\,dx
=-\int s_\theta(x)^T\nabla_xp(x)\,dx
=\int p(x)\,\nabla_x\!\cdot s_\theta(x)\,dx .
$$

Therefore

$$
\boxed{\;J(\theta)=E_{p_{\text{data}}}\Bigl[\operatorname{tr}\bigl(\nabla_xs_\theta(x)\bigr)+\tfrac12\lVert s_\theta(x)\rVert^2\Bigr]+\text{const}\;}
$$

The unknown density appears only as the distribution we average over — which we have samples from. This is **Hyvärinen's identity**, and it is a genuinely surprising result: an objective that references an unknown function has been rewritten using only quantities we can compute.

The catch is \(\operatorname{tr}(\nabla_xs_\theta)\), the trace of a \(d\times d\) Jacobian, costing \(d\) backward passes. At \(d=10^5\) that is fatal. Sliced score matching estimates the trace with random projections (the Hutchinson estimator, \(\operatorname{tr}(A)=E_v[v^TAv]\) for \(E[vv^T]=I\)), which works but adds variance. The next section removes the problem entirely.

> **Practice — Foundation:** For \(s_\theta(x)=-\theta x\) in one dimension and data with \(E[x^2]=4\), write \(J(\theta)\) (up to its constant) using the identity and find the minimizing \(\theta\).
>
> **Hint:** The derivative of \(-\theta x\) is \(-\theta\), so \(J=-\theta+\tfrac12\theta^2E[x^2]=-\theta+2\theta^2\), minimized at \(\theta=0.25\), the score of \(\mathcal N(0,4)\).
>
> **Practice — Core:** Carry out the integration-by-parts step in one dimension, stating the decay condition used, then check it for \(p=\mathcal N(0,1)\) and \(s_\theta(x)=-\theta x\) by computing both \(-E_p[s_\theta(x)\,\partial_x\log p(x)]\) and \(E_p[s_\theta'(x)]\).
>
> **Hint:** The boundary term is \([s_\theta p]_{-\infty}^{\infty}=[-\theta x\varphi(x)]_{-\infty}^{\infty}=0\); both sides equal \(-\theta\) because \(E[x^2]=1\).
>
> **Practice — Stretch:** For \(A=\begin{pmatrix}2&1\\3&4\end{pmatrix}\), enumerate the four Rademacher vectors \(v\in\{\pm1\}^2\), confirm \(E_v[v^TAv]=\operatorname{tr}A=6\), compute the variance of the single-sample estimate, and prove that in general it equals \(\sum_{i<j}(A_{ij}+A_{ji})^2\).
>
> **Hint:** The values are \(10,2,2,10\), giving variance 16 \(=(1+3)^2\); in general \(v^TAv=\operatorname{tr}A+\sum_{i<j}(A_{ij}+A_{ji})v_iv_j\) and the products \(v_iv_j\) are uncorrelated with variance 1.

## 3. Denoising score matching: the trace disappears

Perturb the data with known noise. Let \(\tilde x=x+\sigma\varepsilon\) with \(\varepsilon\sim\mathcal N(0,I)\), giving the conditional

$$
q_\sigma(\tilde x\mid x)=\mathcal N(\tilde x;x,\sigma^2I),
\qquad
\nabla_{\tilde x}\log q_\sigma(\tilde x\mid x)=-\frac{\tilde x-x}{\sigma^2}=-\frac{\varepsilon}\sigma .
$$

The conditional score is available in closed form because we chose the noise. Vincent's identity states that matching this conditional score is equivalent, up to a constant, to matching the score of the *smoothed* marginal \(q_\sigma(\tilde x)=\int q_\sigma(\tilde x\mid x)p(x)dx\):

$$
E_{q_\sigma(\tilde x)}\Bigl[\bigl\lVert s_\theta(\tilde x)-\nabla\log q_\sigma(\tilde x)\bigr\rVert^2\Bigr]
=E_{p(x)q_\sigma(\tilde x\mid x)}\Bigl[\bigl\lVert s_\theta(\tilde x)-\nabla\log q_\sigma(\tilde x\mid x)\bigr\rVert^2\Bigr]+\text{const}.
$$

Substituting the conditional score and writing \(s_\theta(\tilde x)=-\hat\varepsilon_\theta(\tilde x)/\sigma\), the objective becomes

$$
E\Bigl[\bigl\lVert\hat\varepsilon_\theta(\tilde x)-\varepsilon\bigr\rVert^2\Bigr].
$$

**Predicting the noise is estimating the score.** That is the whole training objective of a diffusion model: add known noise, regress on it, and you have learned \(\nabla\log q_\sigma\) for free, with no trace, no normalizer, and no bound.

Two consequences worth stating plainly. The minimizer is \(\hat\varepsilon^\star(\tilde x)=E[\varepsilon\mid\tilde x]\), a conditional expectation — the same object that the law of total expectation in the joint-distributions lesson called the best mean-squared predictor. And you learn the score of the **smoothed** density \(q_\sigma\), not of \(p_{\text{data}}\); the two agree only as \(\sigma\to0\), which is precisely the regime where the score is hardest to estimate because data lies on a thin manifold. This tension is why a *range* of noise levels is used.

> **Practice — Foundation:** Verify \(\nabla_{\tilde x}\log\mathcal N(\tilde x;x,\sigma^2I)=-(\tilde x-x)/\sigma^2\), then evaluate it for \(x=1\), \(\sigma=0.5\), \(\tilde x=1.4\), and confirm it equals \(-\varepsilon/\sigma\) for the noise \(\varepsilon\) that produced \(\tilde x\).
>
> **Hint:** Differentiate \(-\lVert\tilde x-x\rVert^2/(2\sigma^2)\) in \(\tilde x\); here the score is \(-0.4/0.25=-1.6\) and \(\varepsilon=0.8\), so \(-\varepsilon/\sigma=-1.6\).
>
> **Practice — Core:** Show the minimizer of the denoising objective is \(E[\varepsilon\mid\tilde x]\) and rewrite it as a statement about \(E[x\mid\tilde x]\). Check both for \(x\sim\mathcal N(0,1)\), \(\sigma=1\): compute \(E[\varepsilon\mid\tilde x]\), \(E[x\mid\tilde x]\), and \(\nabla\log q_\sigma(\tilde x)\).
>
> **Hint:** Conditional expectation minimizes squared loss and \(\tilde x=E[x\mid\tilde x]+\sigma E[\varepsilon\mid\tilde x]\); here \(\tilde x\sim\mathcal N(0,2)\), both conditional means are \(\tilde x/2\), and the score \(-\tilde x/2\) equals \(-E[\varepsilon\mid\tilde x]/\sigma\).
>
> **Practice — Stretch:** Data are \(\pm1\) with probability \(\tfrac12\) each, so \(\nabla\log q_\sigma(\tilde x)=(\tanh(\tilde x/\sigma^2)-\tilde x)/\sigma^2\). For \(\sigma=0.1\) and \(\sigma=2\), compute the variance of the regression target \(-\varepsilon/\sigma\) and the smoothed score at \(\tilde x=0.5\). Use the numbers to explain why small \(\sigma\) gives an accurate but poorly conditioned problem and large \(\sigma\) the reverse, and justify the weighting \(\lambda(\sigma)=\sigma^2\) across levels.
>
> **Hint:** Target variances are \(1/\sigma^2=100\) and \(0.25\); the scores are about \(+50\) (toward the datum 1) and \(-0.094\) (toward the blurred centre 0); weighting by \(\sigma^2\) turns each level's loss into \(E\lVert\sigma s_\theta+\varepsilon\rVert^2\), of order 1.

## 4. The forward process is a Gaussian chain with a closed form

Diffusion uses a whole schedule of noise levels, arranged as a Markov chain. With \(\beta_1,\ldots,\beta_T\in(0,1)\),

$$
q(x_t\mid x_{t-1})=\mathcal N\bigl(\sqrt{1-\beta_t}\,x_{t-1},\;\beta_tI\bigr).
$$

Set \(\alpha_t=1-\beta_t\) and \(\bar\alpha_t=\prod_{s\le t}\alpha_s\). Composing Gaussians — the convolution result of the transformations lesson, since a scaled Gaussian plus an independent Gaussian is Gaussian with added variances — gives the **closed-form marginal**

$$
q(x_t\mid x_0)=\mathcal N\bigl(\sqrt{\bar\alpha_t}\,x_0,\;(1-\bar\alpha_t)I\bigr),
\qquad
x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\,\varepsilon .
$$

**Check the induction once.** If \(x_{t-1}=\sqrt{\bar\alpha_{t-1}}x_0+\sqrt{1-\bar\alpha_{t-1}}\,\varepsilon'\), then

$$
x_t=\sqrt{\alpha_t}x_{t-1}+\sqrt{\beta_t}\,\varepsilon''
=\sqrt{\bar\alpha_t}x_0+\sqrt{\alpha_t(1-\bar\alpha_{t-1})}\,\varepsilon'+\sqrt{1-\alpha_t}\,\varepsilon'' ,
$$

and the two independent Gaussian terms have total variance \(\alpha_t(1-\bar\alpha_{t-1})+(1-\alpha_t)=1-\bar\alpha_t\). The schedule is called **variance-preserving** exactly because signal coefficient squared plus noise variance is \(\bar\alpha_t+(1-\bar\alpha_t)=1\).

This closed form is what makes training cheap: to train at step \(t\) you never simulate the chain, you jump straight to \(x_t\) in one draw.

**The reverse posterior is also exactly Gaussian** when conditioned on \(x_0\):

$$
q(x_{t-1}\mid x_t,x_0)=\mathcal N(\tilde\mu_t,\tilde\beta_tI),
$$

$$
\tilde\mu_t=\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}x_0
+\frac{\sqrt{\alpha_t}\,(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}x_t,
\qquad
\tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t .
$$

The model does not know \(x_0\) at sampling time, so it predicts it (equivalently, predicts \(\varepsilon\)) and substitutes.

![Diffusion adds Gaussian noise forward with a closed-form marginal and learns to reverse it, while decoding truncates and renormalizes a trained distribution.](../assets/diffusion-and-decoding.svg)

> **Practice — Foundation:** For \(\beta=(0.5,0.5)\), compute \(\bar\alpha_1,\bar\alpha_2\) and the signal and noise coefficients at each step.
>
> **Hint:** Each alpha is one minus beta; cumulative alphas multiply.
>
> **Practice — Core:** Complete the induction above, stating where independence of \(\varepsilon'\) and \(\varepsilon''\) is used, and check the variance identity numerically for \(\beta=(0.5,0.5)\) at \(t=2\).
>
> **Hint:** Independent Gaussian noises add their scaled variances; here \(\alpha_2(1-\bar\alpha_1)+(1-\alpha_2)=0.25+0.5=0.75=1-\bar\alpha_2\).
>
> **Practice — Stretch:** Show \(\tilde\beta_t\le\beta_t\) in general and compute \(\tilde\beta_2\) for \(\beta=(0.1,0.2)\). Then, for data \(x_0\sim\mathcal N(0,s^2)\), compute \(\operatorname{Var}(x_1\mid x_2)\), which does not condition on \(x_0\), for \(s^2=1\) and \(s^2=100\), and use the results to explain why \(\tilde\beta_t\le\beta_t\) does not bound the variance of the reverse law conditioned only on \(x_t\).
>
> **Hint:** \(\tilde\beta_2=(0.1/0.28)(0.2)\approx0.071\); with \(\operatorname{Var}x_1=0.9s^2+0.1\), \(\operatorname{Var}x_2=0.72s^2+0.28\), \(\operatorname{Cov}=\sqrt{0.8}\operatorname{Var}x_1\), you get 0.2 and about 0.249, the latter above \(\beta_2\).

## 5. Diffusion is the ELBO of a fixed-encoder hierarchical VAE

Put the previous unit next to section 4. A diffusion model is a latent-variable model with latents \(z=(x_1,\ldots,x_T)\), an encoder \(q(x_{1:T}\mid x_0)\) that is **fixed, not learned**, and a decoder \(p_\theta(x_{t-1}\mid x_t)\). Its ELBO is

$$
\log p_\theta(x_0)\ \ge\
E_q\Bigl[\log p(x_T)+\sum_t\log\frac{p_\theta(x_{t-1}\mid x_t)}{q(x_t\mid x_{t-1})}\Bigr],
$$

which regroups into a sum of KL divergences between Gaussians — one per timestep — plus a reconstruction term. Because both distributions in each KL are Gaussian with known variances, each term reduces to a squared difference of means, and with the \(\varepsilon\)-parameterization and a particular weighting it collapses to

$$
E_{t,x_0,\varepsilon}\Bigl[\bigl\lVert\hat\varepsilon_\theta(x_t,t)-\varepsilon\bigr\rVert^2\Bigr] .
$$

The same objective arrived at from denoising score matching in section 3. **Two independent derivations, one loss.** That is the strongest evidence that the object is natural rather than engineered.

One honest caveat: the simple unweighted MSE used in practice is *not* the ELBO — it drops the per-timestep weights. It works better empirically, and it means the reported loss is not a likelihood bound. If you want a likelihood number, compute the weighted bound.

> **Practice — Foundation:** For \(T=2\) and \(\beta=(0.1,0.2)\), write the diffusion encoder \(q(x_1,x_2\mid x_0)\) as a product of two Gaussians with explicit means and variances, and state which of its parameters are learned.
>
> **Hint:** The forward chain is the encoder: \(q(x_1\mid x_0)=\mathcal N(\sqrt{0.9}\,x_0,0.1)\) and \(q(x_2\mid x_1)=\mathcal N(\sqrt{0.8}\,x_1,0.2)\), with nothing learned.
>

> **Practice — Core:** Two models have per-timestep noise-prediction MSEs \((0.10,0.50)\) (model A) and \((0.30,0.20)\) (model B) on a two-step schedule. Rank them under the unweighted sum and under weights \((5,1)\), and explain what this shows about changing the weighting.
>
> **Hint:** Unweighted totals are 0.6 and 0.5 (B wins); weighted totals are 1.0 and 1.7 (A wins), so the weights define which model the objective prefers.
>

> **Practice — Stretch:** Suppose the ELBO's timestep weights for the Core schedule are \((w,1)\) and all other bound terms are equal for A and B. For which \(w\) does B's lower unweighted loss coincide with a higher ELBO? Explain why an unweighted improvement therefore does not certify a likelihood improvement.
>
> **Hint:** B has the smaller weighted loss iff \(0.3w+0.2<0.1w+0.5\), that is \(w<1.5\); the unweighted loss certifies nothing about the bound unless the true weights are known to fall in that range.

## 6. Sampling: stochastic, deterministic, and guided

Training gives a score field. Getting samples is a separate algorithmic question.

- **Ancestral (stochastic) sampling** walks the reverse chain, adding fresh noise at each step. Many steps, high diversity.
- **Probability-flow ODE.** There is a deterministic ODE whose marginals match the stochastic process at every \(t\). Solving it gives sampling with far fewer steps, exactly invertible trajectories, and — because it is a deterministic change of variables — an exact likelihood via the change-of-variables formula of the transformations lesson. Determinism costs diversity at a fixed seed.
- **Classifier-free guidance** interpolates conditional and unconditional scores:

$$
\tilde s=s_\theta(x\mid\varnothing)+w\bigl(s_\theta(x\mid c)-s_\theta(x\mid\varnothing)\bigr).
$$

For \(w>1\) this is a score of \(p(x)\,p(c\mid x)^{w}\) up to normalization — a **sharpened**, temperature-like distribution, not \(p(x\mid c)\). Samples look better on human preference and are *less diverse and less faithful to the model's actual conditional*. Report \(w\); a guided FID is not comparable to an unguided one.

> **Practice — Foundation:** The forward SDE is \(dx=-\tfrac12x\,dt+dW\) on \(t\in[0,1]\). Write one Euler–Maruyama step of the reverse SDE \(dx=[-\tfrac12x-s(x,t)]dt+d\bar W\) run from \(t=1\) to \(t=0\) with \(N=10\) steps, stating the step size, the noise standard deviation per step, and the initialization.
>
> **Hint:** Stepping backward by \(\Delta=0.1\) gives \(x_{t-\Delta}=x_t+(\tfrac12x_t+s(x_t,t))\Delta+\sqrt{\Delta}\,z\) with noise sd \(\sqrt{0.1}\approx0.316\), started from the terminal law (approximately \(\mathcal N(0,1)\)).
>

> **Practice — Core:** For data \(\mathcal N(0,4)\) under the Foundation SDE, the exact marginal is \(\mathcal N(0,v_t)\) with \(v_t=4e^{-t}+1-e^{-t}\), so \(s(x,t)=-x/v_t\). Design a test that runs the reverse Euler–Maruyama sampler from \(\mathcal N(0,v_1)\) with \(N\in\{10,100,1000\}\) and checks the final variance against 4; predict how the error should scale with \(N\).
>
> **Hint:** The update is linear, so the variance obeys \(V\leftarrow(1+(\tfrac12-1/v_t)\Delta)^2V+\Delta\) exactly; it gives about 3.901, 3.990, 3.999, an error shrinking like \(1/N\).
>

> **Practice — Stretch:** Let \(p(x)=\mathcal N(0,1)\) and \(p(c\mid x)\propto\exp(-(x-2)^2/2)\). Compute \(p(x\mid c)\) and the distribution \(\propto p(x)p(c\mid x)^w\) targeted by guidance weight \(w=3\), and explain why guidance changes the sampling target even when every score is exact.
>
> **Hint:** Precisions add: \(p(x\mid c)=\mathcal N(1,\tfrac12)\), while \(w=3\) gives precision 4 and mean \(2w/(1+w)=1.5\), i.e. \(\mathcal N(1.5,0.25)\); the guided score is the exact score of a different, sharper law.

## 7. Decoding is distribution surgery

Autoregressive models raise the same issue in a form people rarely name. A trained language model defines \(p_\theta(x_t\mid x_{<t})\). Generation almost never samples from it.

**Temperature.** With logits \(z\),

$$
p_T(i)=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}\ \propto\ p(i)^{1/T} .
$$

\(T\to0\) concentrates on the argmax; \(T\to\infty\) tends to uniform; \(T=1\) is the model. Entropy increases monotonically in \(T\). This is the same exponential tilt that appeared as the maximum-entropy solution in [convexity and duality](../03-optimization/03-convexity-smoothness-duality.md) — temperature is the Lagrange multiplier.

**Top-\(k\) and top-\(p\) (nucleus).** Sort descending, keep either the top \(k\) tokens or the smallest prefix whose cumulative probability reaches \(p\), zero the rest, renormalize. This is conditioning on the event "the token is in the kept set" — a genuinely different distribution, with all tail mass redistributed onto the head.

**The consequence people skip.** Perplexity, cross-entropy, and every likelihood-based evaluation describe \(p_\theta\). Generation uses \(p_{T,k,p}\). These are different distributions, so:

- A perplexity improvement need not improve generations at your decoding settings.
- Two systems compared at different temperatures are not comparable.
- Likelihood-based detection, watermarking, and calibration arguments all assume the untruncated distribution.
- Truncation removes exactly the tail where rare-but-correct tokens live, which is why factual recall and greedy decoding interact badly.

Always report decoding parameters alongside any generation result. A generation claim without \(T\), \(k\), \(p\), and the seed policy is not reproducible.

**Sampling without replacement.** To draw \(k\) distinct candidates in one pass, take the \(k\) largest of \(\log p_i+G_i\) with Gumbel noise — the Gumbel top-\(k\) trick from the previous unit. This is exactly a without-replacement sample, unlike \(k\) independent draws.

> **Practice — Foundation:** For logits \((0,\log 3)\), compute the distribution at \(T=1\) and at \(T=2\).
>
> **Hint:** At T=1 normalize (1,3); at T=2 normalize (1,sqrt(3)).
>
> **Practice — Core:** Show \(p_T\propto p^{1/T}\) follows from the softmax definition, check it for logits \((2,1,0)\) at \(T=0.5\) by computing \(p_T\) both from the logits and by squaring and renormalizing \(p_1\), and explain why adding a constant to all logits changes nothing.
>
> **Hint:** \(e^{z_i/T}=(e^{z_i})^{1/T}\); both routes give about \((0.867,0.117,0.016)\), and a shift \(c\) multiplies every term by \(e^{c/T}\), which cancels.
>
> **Practice — Stretch:** A model's distribution over four candidate answers is \((0.55,0.25,0.12,0.08)\), and the correct answer is the fourth. Compute the nucleus set at \(p=0.9\), the probability of a correct generation before and after truncation, and propose an evaluation protocol that would have detected the problem.
>
> **Hint:** Cumulative mass is 0.55, 0.80, 0.92, so three answers survive and the correct one drops from 0.08 to 0; evaluate accuracy or coverage at the deployed decoding settings, not only likelihood.

## 8. Failure modes

- **Reporting the simple diffusion MSE as a likelihood bound.** It is the unweighted loss; the ELBO has weights.
- **Comparing guided and unguided samples** on the same metric without saying so.
- **Reporting generation quality without decoding parameters.**
- **Assuming perplexity predicts sample quality** across decoding settings.
- **Score matching at a single small \(\sigma\)**, which estimates the score accurately only where there is data — nowhere useful at initialization.
- **Forgetting that the learned score belongs to the smoothed density**, not the data density.
- **Treating the probability-flow likelihood as the stochastic sampler's likelihood.** They are different samplers.
- **Using a relaxation or a truncation and calling the result a sample from the model.** It is a sample from a modified model; name it.

### Worked example: follow one datum through noise and back

Take \(x_0=2\), \(\beta_1=0.1\), and \(\beta_2=0.2\). Then \(\alpha=(0.9,0.8)\) and \(\bar\alpha_2=0.72\), so

$$
x_2=\sqrt{0.72}\,x_0+\sqrt{0.28}\,\varepsilon.
$$

Conditional on \(x_0=2\), this is \(N(2\sqrt{0.72},0.28)\), with mean about 1.697 and standard deviation about 0.529. If \(x_2=1.5\), the noise that produced it was

$$
\varepsilon=\frac{1.5-2\sqrt{0.72}}{\sqrt{0.28}}\approx-0.372.
$$

If a network predicts \(\hat\varepsilon=-0.30\), its implied clean prediction is

$$
\hat x_0
=\frac{x_2-\sqrt{1-\bar\alpha_2}\,\hat\varepsilon}{\sqrt{\bar\alpha_2}}
\approx1.955.
$$

This connects the training label, noise-prediction loss, and clean-data parameterization. It is not yet a sample from the data distribution: generation must start from the terminal noise law and apply every reverse transition or a justified numerical approximation. Guidance changes those reverse scores again, so sample quality is a property of the model–sampler pair, not of the likelihood model alone.

> **Practice — Foundation:** Model A has denoising loss 0.051 and model B 0.049. With a 10-step solver A scores FID 12.0 and B 15.0; with 1000 steps A scores 4.1 and B 3.8. Which model is better under each solver, and does a lower training loss guarantee better samples under every solver?
>
> **Hint:** B wins at 1000 steps but loses at 10; sample quality mixes score-approximation error with solver and initialization error, so the loss alone guarantees nothing.
>

> **Practice — Core:** One noising step from \(x_0=0\) with \(\beta=0.04\) should give \(x_1\sim\mathcal N(0,0.04)\). A buggy implementation multiplies the noise by \(\beta\) instead of \(\sqrt\beta\). Describe a test (\(10^5\) draws, seed 0) that detects the bug, and state the empirical variance each version should produce.
>
> **Hint:** The correct step has variance \(\beta=0.04\) (sd 0.2); the bug gives \(\beta^2=0.0016\), a 25-fold gap far beyond the Monte Carlo error of about \(0.04\sqrt{2/10^5}\).
>

> **Practice — Stretch:** With a fixed trained score model, design an ablation over guidance \(w\in\{1,2,3\}\) and step counts \(N\in\{10,50,250,1000\}\) (5 seeds, \(10^4\) samples per cell) that separates guidance effects from discretization error, stating exactly which differences estimate each.
>
> **Hint:** At fixed \(w\), metric\((N)-\)metric\((1000)\) estimates discretization error; at \(N=1000\), differences across \(w\) estimate the guidance effect; the seed spread gives their standard errors.

## 9. Runnable labs

**Lab A — decoding as distribution surgery.** Implement `decode_distribution` in the [learner exercises file](../../labs/exercises.py). Given logits, a temperature, and a nucleus threshold, divide the logits by the temperature, convert to probabilities with a numerically stable softmax, keep the smallest prefix of the descending-sorted probabilities whose cumulative mass reaches the threshold, and renormalize over the kept tokens, returning probabilities in the original index order. Break ties toward the lower index. Reject empty logits, non-finite values, non-positive temperature, and a threshold outside \((0,1]\).

Then investigate: sweep \(T\) from \(0.1\) to \(5\) on a fixed logit vector and plot the entropy. Sweep the nucleus threshold and record how many tokens survive. Then construct a distribution where the correct token sits just outside the nucleus, and quantify how the probability of a correct generation changes.

**Lab B — the forward diffusion schedule.** Implement `forward_diffusion_coefficients` in the [learner exercises file](../../labs/exercises.py). Given a list of \(\beta_t\in(0,1)\), return for each timestep the triple \((\bar\alpha_t,\;\sqrt{\bar\alpha_t},\;\sqrt{1-\bar\alpha_t})\). Reject an empty schedule and any \(\beta\) outside \((0,1)\).

Then investigate: compare a linear and a cosine schedule at \(T=1000\) by plotting \(\bar\alpha_t\). Verify numerically that composing the per-step Gaussians matches the closed-form marginal by simulating the chain and comparing sample moments. Then compute \(\tilde\beta_t\) and confirm \(\tilde\beta_t\le\beta_t\).

## 10. Derivations to own

1. Why \(\nabla_x\log p_\theta(x)\) is free of \(Z_\theta\).
2. Hyvärinen's identity, including the integration-by-parts step and its decay condition.
3. The conditional score \(-(\tilde x-x)/\sigma^2\) and the reduction of denoising score matching to noise prediction.
4. That the minimizer of the denoising objective is \(E[\varepsilon\mid\tilde x]\).
5. The closed-form marginal \(q(x_t\mid x_0)\) by induction, and why the schedule is variance-preserving.
6. The reverse posterior mean \(\tilde\mu_t\) and variance \(\tilde\beta_t\).
7. \(p_T\propto p^{1/T}\), and top-\(p\) as conditioning on a set.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-score
```

## 11. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


**Foundation**

**A1 · Foundation · paper — Cumulative problem 1.** Compute the score of \(\mathcal N(3,4)\) at \(x=1\).

**A2 · Foundation · paper — Cumulative problem 2.** For \(\beta=(0.1,0.2)\), compute \(\bar\alpha_1,\bar\alpha_2\) and the noise coefficient at \(t=2\).

**A3 · Foundation · paper — Cumulative problem 3.** For logits \((2,1,0)\), give the distribution at \(T=1\) and the surviving set at \(p=0.7\).

**Core**

**A4 · Core · paper — Cumulative problem 4.** Derive Hyvärinen's identity in one dimension and state precisely which boundary condition you used.

**A5 · Core · paper — Cumulative problem 5.** Show that predicting \(\varepsilon\) and predicting \(x_0\) are equivalent parameterizations, and write the conversion formula.

**A6 · Core · paper — Cumulative problem 6.** Let \(p(x)=\mathcal N(0,1)\) and \(p(c\mid x)\propto\exp(-(x-1)^2/2)\). Compute \(p(x\mid c)\), show that classifier-free guidance with exact scores and \(w=3\) targets a density \(\propto p(x)p(c\mid x)^3\) rather than \(p(x\mid c)\), and give the mean and variance of that target.

**A7 · Core · paper — Cumulative problem 7.** A model's perplexity improves by 4% but human raters prefer the old model's generations at \(T=0.8,p=0.95\). Give three explanations consistent with both facts.

**Stretch**

**A8 · Stretch · paper — Cumulative problem 8.** Prove that the probability-flow ODE permits exact likelihood computation, naming the theorem from the transformations lesson that makes it possible, and state the cost.

**A9 · Stretch · paper — Cumulative problem 9.** A team reports, for guidance weights \(w=1,3,5,7\), FID \(18.0,11.5,9.2,8.4\), precision \(0.61,0.74,0.81,0.85\) and recall \(0.63,0.52,0.41,0.30\), and concludes the model has improved. Critique the claim, compute the relative drop in recall from \(w=1\) to \(w=7\), name the quantity that is silently degrading, and design the measurement that exposes it.

**A10 · Stretch · paper — Cumulative problem 10.** Data are \(x=\pm1\) with probability \(\tfrac12\) each, and denoising score matching is run at a single fixed \(\sigma=0.5\) with infinite data and capacity. Argue whether it recovers the data score, write the function it does recover, and compute the variance of the distribution an exact sampler with that score produces, compared with the data variance.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** What is a score function in score-based modeling?

**K2 · Core · gate — Derivation.** Derive the score of a one-dimensional Gaussian with mean mu and variance v.

**K3 · Core · gate — Calculation.** Find the score of N(0,4) at x=2.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-score experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does an exact continuous-time score make every discretized sampler exact?

**K6 · Stretch · gate — RE/RS transfer.** Validate a diffusion sampler before a large model run.

## Mastery check

Explain why the score sidesteps the normalizer; derive Hyvärinen's identity and say why its trace term is impractical; derive denoising score matching and show it is noise prediction; derive the closed-form diffusion marginal and the reverse posterior; explain in one paragraph why the diffusion loss is simultaneously an ELBO and a score-matching objective; and, given a generation result, state exactly which distribution it was sampled from and what that does to the reported likelihood numbers.
