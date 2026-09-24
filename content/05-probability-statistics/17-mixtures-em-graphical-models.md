---
id: math.probability.mixtures-em-graphical-models
title: Mixtures, the EM algorithm, and graphical models
prerequisites: [math.probability.latent-variables-elbo-gradient-estimators, math.statistics.causal-inference-missing-data, math.probability.multivariate-gaussian-geometry]
answers: ps-17-mixtures-em-graphical-models
estimated_hours: 44
---

# Mixtures, the EM algorithm, and graphical models

A latent variable is a quantity the model needs and the data does not contain: which subpopulation a request came from, which topic a document is about, which hidden state a system occupied at time \(t\). Introducing one is cheap to write and expensive to fit, because the likelihood you can evaluate is a sum or integral over everything you did not see.

This unit develops the classical machinery for that situation, and it does so from a bound you already own. Lesson 14 proved the exact decomposition \(\log p_\theta(x)=\mathcal L(\theta,q)+\operatorname{KL}(q\Vert p_\theta(z\mid x))\) and used it to build variational inference for models where the posterior is intractable. The expectation–maximization algorithm is the *other* branch from the same identity: when the posterior over latents **is** tractable, you can set \(q\) equal to it exactly, the KL term vanishes, and coordinate ascent on the bound becomes an algorithm with a monotonicity guarantee. EM is not a different idea from the ELBO; it is the ELBO with the inner optimization solved in closed form.

The second half generalizes the structure. A mixture is the simplest possible latent-variable graph — one hidden node pointing at one observed node. Graphical models let you write down arbitrary conditional-independence structure and then ask what it costs to compute with it. You already know how to *read* a directed graph: lesson 16 built d-separation to decide which adjustment sets are valid. Here the same graphs carry probability rather than causation, they acquire an undirected counterpart, and the question shifts from "what is identified" to "what is computable, and at what price."

By the end, you should be able to write a mixture likelihood and explain why maximizing it directly is hard; derive EM as coordinate ascent on the ELBO and prove its monotonicity; write the E-step and M-step for a Gaussian mixture from scratch; explain why the likelihood is unbounded and what to do about it; distinguish label switching from genuine non-identifiability; choose a component count without misusing a likelihood-ratio test; recognize K-means as a degenerate limit; apply EM to missing data and censoring; convert between directed, undirected, and factor-graph representations and say what each conversion loses; run variable elimination and predict its cost from treewidth; and recognize forward–backward as sum-product and Baum–Welch as EM.

## Learning route: complete data, missing labels, computation

Study the chapter around one repeated question: what would be easy if the latent variables were observed?

1. Write the complete-data likelihood and solve that easy problem.
2. Replace missing labels or states by posterior responsibilities: the E-step.
3. Re-solve the weighted complete-data problem: the M-step.
4. Check likelihood monotonicity, degeneracy, restart stability, and label-invariant summaries before interpreting components.
5. For a general graph, replace “responsibility” with “message” and predict the largest intermediate factor before running inference. That factor, not node count alone, controls exact-computation cost.

This route connects mixtures, missing-data EM, sum-product, forward–backward, and Baum–Welch as instances of the same marginalization problem.

## 0. What a latent variable buys, and what it costs

Write the model with the latent variable included and the joint distribution is usually simple:

$$
p_\theta(x,z)=p_\theta(z)\,p_\theta(x\mid z).
$$

Both factors are typically standard families with closed-form maximum likelihood estimators. If \(z\) were observed, fitting would be a counting exercise or a weighted least-squares problem.

The **complete-data log likelihood** \(\log p_\theta(x,z)\) is therefore easy. The one you can actually evaluate is the **incomplete-data** or **marginal** log likelihood,

$$
\ell(\theta)=\log p_\theta(x)=\log\sum_z p_\theta(x,z),
$$

and the sum sits inside the logarithm. That single structural fact causes everything difficult in this unit: the log of a sum does not decompose into terms, the score function acquires a posterior weighting, the objective loses concavity, and symmetry of the latent labels makes the parameter space redundant.

The compensation is expressiveness. A latent variable lets a model represent heterogeneity, clustering, sequence structure, and missingness with a small number of parameters, and it lets a simple family generate a complicated marginal.

**Worked example — two lines of code, two very different fits.** Fitting a single Gaussian to request latencies gives a mean and a variance and a bad fit to a bimodal histogram. Adding one binary latent — cache hit or miss — turns the model into a two-component mixture with five parameters and a marginal that reproduces both modes. The likelihood you now have to maximize has no closed-form maximizer, several local optima, and an infinite supremum at the boundary. That is the trade, in full.

> **Practice — Foundation:** For the mixture \(0.5N(0,1)+0.5N(3,1)\) and one observation \(x=1\) whose label is known to be \(z=1\), evaluate the complete-data log likelihood \(\log p(x,z)\) and the incomplete-data log likelihood \(\log p(x)\) numerically, and say which one contains a log of a sum.
>
> **Hint:** \(\log p(x,z)=\log0.5+\log\mathcal N(1\mid0,1)\approx-2.112\); \(\log p(x)=\log\bigl(0.5\mathcal N(1\mid0,1)+0.5\mathcal N(1\mid3,1)\bigr)\approx-1.911\) sums both weighted densities before the log.
>
> **Practice — Core:** For labeled data \(x=(0,1,5,6)\), \(z=(1,1,2,2)\), unit variances, compute the complete-data MLEs of \(\pi,\mu_1,\mu_2\) in closed form, then explain why the same four points without \(z\) give no closed-form MLE.
>
> **Hint:** With labels, \(\log p(x,z)\) splits into one sum per component, so \(\hat\pi=(0.5,0.5)\) and each \(\hat\mu_k\) is the mean of its own points; without labels every term is \(\log\sum_k\), which couples \(\mu_1\) and \(\mu_2\).
>
> **Practice — Stretch:** Show that \(X\mid\lambda\sim\text{Poisson}(\lambda)\) with \(\lambda\sim\text{Gamma}(2,\text{rate }1)\) has the negative binomial marginal \(P(X=x)=(x+1)/2^{x+2}\), check \(P(X=0)=P(X=1)=1/4\), and contrast with \(0.5N(0,1)+0.5N(3,1)\), whose marginal belongs to no named family.
>
> **Hint:** Integrate \(e^{-\lambda}\lambda^x/x!\cdot\lambda e^{-\lambda}\) using \(\int_0^\infty\lambda^{m}e^{-2\lambda}\,d\lambda=m!/2^{m+1}\) with \(m=x+1\).

## 1. Finite mixtures

A **finite mixture** with \(K\) components has a categorical latent \(Z\in\{1,\dots,K\}\) with mixing weights \(\pi_k=P(Z=k)\), and a component distribution \(p(x\mid\theta_k)\) for each:

$$
p(x\mid\pi,\theta)=\sum_{k=1}^K\pi_k\,p(x\mid\theta_k),
\qquad \pi_k\ge0,\ \sum_{k=1}^K\pi_k=1 .
$$

Sampling is two-stage: draw the component, then draw from it. This is exactly the ancestral-sampling recipe from the sampling-design lesson, and it makes simulation trivial even when the density is awkward.

A Gaussian mixture in one dimension has parameters \(\{\pi_k,\mu_k,\sigma_k^2\}\) and density

$$
p(x)=\sum_{k=1}^K\pi_k\,\frac{1}{\sqrt{2\pi\sigma_k^2}}\exp\!\left(-\frac{(x-\mu_k)^2}{2\sigma_k^2}\right).
$$

Two properties are worth stating early, because they cause most misuse. First, mixture moments are averages, not mixtures of averages: \(E[X]=\sum_k\pi_k\mu_k\), while the variance picks up a between-component term,

$$
\operatorname{Var}(X)=\sum_k\pi_k\sigma_k^2+\sum_k\pi_k(\mu_k-E[X])^2,
$$

which is the law of total variance from lesson 02 with \(Z\) as the conditioning variable. Second, the number of modes of a mixture is not the number of components: two Gaussians whose means are closer than roughly one standard deviation produce a single-peaked density.

**Worked example — overdispersion from an unmodelled mixture.** A Poisson mixture with rates 2 and 20 in equal proportion has mean 11 and variance \(11+81=92\), against the variance of 11 a single Poisson would demand. Lesson 11 diagnosed this as overdispersion in a GLM; the mixture is a model of the mechanism causing it, rather than a dispersion parameter absorbing it.

> **Practice — Foundation:** Compute the mean and variance of \(0.3N(0,1)+0.7N(10,4)\).
>
> **Hint:** \(E[X]=0.3\cdot0+0.7\cdot10=7\); add the within term \(0.3\cdot1+0.7\cdot4\) to the between term \(0.3(0-7)^2+0.7(10-7)^2\) (total 24.1).
>
> **Practice — Core:** For \(f(x)=0.5\varphi(x+d)+0.5\varphi(x-d)\) with \(\varphi\) the standard normal density, show \(f''(0)=(d^2-1)\varphi(d)\), conclude that \(x=0\) is a local maximum iff \(d\le1\) (means at most \(2\sigma\) apart), and classify \(d=0.8\) and \(d=1.5\).
>
> **Hint:** Use \(\varphi''(u)=(u^2-1)\varphi(u)\) for each component at \(u=\pm d\); for \(d=0.8\) the curvature at 0 is negative (one mode), for \(d=1.5\) it is positive (0 is a dip between two modes).
>
> **Practice — Stretch:** For \(0.5\,\text{Exp}(1)+0.5\,\text{Exp}(3)\), compute the hazard \(h(t)=f(t)/S(t)\) at \(t=0,1,3\) and its limit as \(t\to\infty\), show it is decreasing although each component's hazard is constant, and interpret.
>
> **Hint:** \(h(t)\) is a weighted average of the rates 1 and 3 with the weight on rate 3 proportional to \(0.5e^{-3t}\), which shrinks as high-rate units fail first: \(h(0)=2\), \(h(1)\approx1.238\), \(h\to1\).

## 2. A component is not a cluster

Mixtures get used for two different purposes, and conflating them produces most of the bad conclusions in applied work.

As a **density estimator**, a mixture is a flexible family that approximates a complicated shape with a sum of simple ones. Enough Gaussians approximate any smooth density arbitrarily well, and no component is required to mean anything. The right diagnostics are held-out log-likelihood and calibration, and the number of components is a capacity choice.

As a **model of latent groups**, each component is a claim that the population genuinely contains subpopulations, and the responsibilities are estimates of membership. The right diagnostics are stability across resamples, external validation of the recovered groups, and substantive interpretation.

The same fitted object supports both readings and the data rarely distinguishes them. A three-component fit to skewed unimodal data will happily use two components to bend one tail — an excellent density estimate and a meaningless clustering.

**Worked example — the "three user segments" that were one.** A mixture fitted to session-length data returns three components, and a deck is written around three user segments. Refitting on a bootstrap resample returns components with different means; fitting a single skewed distribution achieves nearly the same held-out likelihood with four fewer parameters. The components were approximating skew, not finding groups. The test that would have caught it is stability, not fit.

> **Practice — Foundation:** On 1,000 held-out points a 3-component 1-D Gaussian mixture scores log-likelihood \(-1402.1\) and a 3-parameter skew-normal scores \(-1403.0\). Compute the per-point difference and the parameter counts, and say which diagnostic answers the density question and which the groups question.
>
> **Hint:** A \(K\)-component 1-D Gaussian mixture has \(3K-1=8\) parameters; \(0.9/1000\) nats per point is negligible, so held-out likelihood says both are equally good densities, and only stability or external validation can support groups.
>
> **Practice — Core:** Draw \(n=2000\) points from Gamma(shape 2, scale 1) (one mode at 1, right-skewed), fit a 2-component Gaussian mixture by EM with 10 random restarts, and report weights, means, and SDs. Do the components describe two groups or the mode and the tail?
>
> **Hint:** Expect roughly weight 0.65 at mean 1.4 (SD 0.7) and weight 0.35 at mean 3.4 (SD 1.6): a narrow component on the mode and a wide one covering the right tail of a single group.
>
> **Practice — Stretch:** Data A: \(n=500\) from \(0.5N(-3,1)+0.5N(3,1)\); data B: \(n=500\) from Gamma(2,1). For each, refit \(K=2\) on 50 bootstrap resamples and record the sorted component means. Predict what the spread looks like in each case, and give one way this stability check can fail.
>
> **Hint:** Genuine groups give tight bootstrap means near \(\pm3\); a skew artifact can also be stable when \(n\) is large, so stability is necessary for a group claim but not sufficient.

## 3. The likelihood is not concave

For \(n\) independent observations the objective is

$$
\ell(\pi,\theta)=\sum_{i=1}^n\log\left(\sum_{k=1}^K\pi_k\,p(x_i\mid\theta_k)\right).
$$

Setting a derivative to zero does not separate. Differentiating with respect to \(\mu_k\) in the Gaussian case gives

$$
\frac{\partial\ell}{\partial\mu_k}
=\sum_{i=1}^n\underbrace{\frac{\pi_k\,p(x_i\mid\theta_k)}{\sum_j\pi_j\,p(x_i\mid\theta_j)}}_{\gamma_{ik}}\cdot\frac{x_i-\mu_k}{\sigma_k^2},
$$

so the stationarity condition is \(\mu_k=\sum_i\gamma_{ik}x_i/\sum_i\gamma_{ik}\): a weighted mean whose weights depend on the parameters you are solving for. The equations are coupled through \(\gamma\), and the objective is not concave in \((\pi,\mu,\sigma^2)\) — it has multiple local maxima, saddle points, and, as section 9 shows, an unbounded supremum.

This is the shape of the problem EM solves. Notice that the fixed-point condition above is *already* the M-step, and the quantity \(\gamma_{ik}\) is *already* the E-step. EM can be read as the natural iterative scheme for these equations, and separately as an ELBO argument that explains why the iteration is guaranteed to improve.

**Worked example — why a good initialization matters more than a good optimizer.** Two runs of EM on the same 5,000 latency observations from different random starts reach log-likelihoods of \(-7{,}412\) and \(-7{,}389\), with visibly different component means. Neither run failed; the surface has several basins. Standard practice is multiple restarts with a sensible seeding scheme, keeping the best final objective — and reporting that this was done.

> **Practice — Foundation:** Evaluate the mixture log likelihood for \(x=(0,4)\) under \(\pi=(0.5,0.5)\), \(\mu=(0,4)\), unit variances, and identify the term that prevents it from separating into a \(\mu_1\) part and a \(\mu_2\) part.
>
> **Hint:** Each term is \(\log\bigl(0.5\varphi(x_i)+0.5\varphi(x_i-4)\bigr)\); the total is about \(-3.224\), and the log of that sum is what couples the means.
>
> **Practice — Core:** For \(x=(0,1,4)\), \(\pi=(0.5,0.5)\), unit variances and current \(\mu=(0,4)\), compute \(\gamma_{i1}\) for each point and the fixed-point value \(\sum_i\gamma_{i1}x_i/\sum_i\gamma_{i1}\) for \(\mu_1\); then recompute it with \(\mu_2=3\) to show the weights depend on all parameters.
>
> **Hint:** \(\log(\gamma_{i1}/\gamma_{i2})=\bigl((x_i-\mu_2)^2-(x_i-\mu_1)^2\bigr)/2\); the weighted mean is about 0.496 with \(\mu_2=4\) and 0.454 with \(\mu_2=3\).
>
> **Practice — Stretch:** For \(x=(-3,0,3)\) with \(\pi=(0.5,0.5)\) and unit variances fixed, run means-only EM from the grid \(\mu_1,\mu_2\in\{-3,-1.5,0,1.5,3\}\). Show there are two distinct local maxima that are not label swaps of each other, find their log-likelihoods, and describe the basin boundary.
>
> **Hint:** The maxima are \((-2.846,1.542)\) and its mirror \((-1.542,2.846)\), both \(\ell\approx-7.044\); starts with \(\mu_1+\mu_2=0\) stay on the symmetric line and stop at the saddle \((-2,2)\) or \((0,0)\), so that line is the boundary.

## 4. Responsibilities are a posterior

The quantity appearing above,

$$
\gamma_{ik}=P(Z_i=k\mid x_i,\theta)=\frac{\pi_k\,p(x_i\mid\theta_k)}{\sum_{j=1}^K\pi_j\,p(x_i\mid\theta_j)},
$$

is the **responsibility** of component \(k\) for observation \(i\). It is nothing more than Bayes' rule with \(\pi\) as prior and the component density as likelihood, and it satisfies \(\sum_k\gamma_{ik}=1\) for every \(i\).

Responsibilities are soft assignments, and the softness carries information a hard assignment destroys. An observation lying midway between two components has \(\gamma\approx(0.5,0.5)\) and contributes half of itself to each component's update; an observation deep inside one component contributes essentially all of itself to that one. The sum \(N_k=\sum_i\gamma_{ik}\) is the **effective count** of observations assigned to component \(k\), and it need not be an integer.

Computing responsibilities requires care with underflow. The numerator and denominator both involve densities that can be \(10^{-300}\) for a distant observation. Compute in logs and subtract the maximum before exponentiating — the same stable-softmax discipline as in the numerical-stability lesson, applied to \(\log\pi_k+\log p(x_i\mid\theta_k)\).

**Worked example — responsibilities under separation.** With components at \(-10\) and \(10\), both with unit variance, the observation \(x=-9\) has log numerators \(\log 0.5-0.5\) and \(\log 0.5-180.5\). The difference is 180 nats, so the responsibility is \(1\) to within \(10^{-79}\) and the soft assignment is effectively hard. Exponentiating the raw densities first would have produced \(0/0\).

> **Practice — Foundation:** Compute \(\gamma_1\) for \(x=1\) under \(\pi=(0.4,0.6)\), \(\mu=(0,3)\), unit variances.
>
> **Hint:** The log-odds of component 1 is \(\log(0.4/0.6)+\bigl((1-3)^2-(1-0)^2\bigr)/2=-0.405+1.5\), so \(\gamma_1=1/(1+e^{-1.095})\approx0.749\).
>
> **Practice — Core:** For \(x=(0,0,2)\), \(\pi=(0.5,0.5)\), \(\mu=(0,2)\), unit variances, compute the \(3\times2\) responsibility matrix, check each row sums to 1, and compute \(N_1,N_2\).
>
> **Hint:** At \(x=0\) the log-odds is \((4-0)/2=2\), so \(\gamma_1=1/(1+e^{-2})\approx0.881\); at \(x=2\) it is \(0.119\); \(N_1\) is the column sum \(\approx1.881\) and \(N_1+N_2=3\).
>
> **Practice — Stretch:** Two equal-weight unit-variance components sit at \(-d\) and \(d\), and \(x=-d\). Write the log-space responsibility computation, and find the \(d\) at which float64 (a) rounds \(\gamma_{\text{near}}\) to exactly 1 and (b) returns \(\gamma_{\text{far}}\) as exactly 0.
>
> **Hint:** The log-odds is \(2d^2\), so \(\gamma_{\text{far}}=e^{-2d^2}/(1+e^{-2d^2})\): compare with \(2^{-53}\) for (a), giving \(d\approx4.29\), and with the smallest subnormal \(\approx4.9\times10^{-324}\) for (b), giving \(d\approx19.3\).

## 5. EM is coordinate ascent on the ELBO

Take the decomposition proved in lesson 14, now written for the whole dataset with one \(q_i\) per observation:

$$
\log p_\theta(x)=\mathcal L(\theta,q)+\operatorname{KL}\bigl(q(z)\,\Vert\,p_\theta(z\mid x)\bigr),
\qquad
\mathcal L(\theta,q)=E_q[\log p_\theta(x,z)]+H(q).
$$

The bound holds for *any* \(q\), and the gap is exactly the KL divergence between \(q\) and the true posterior. Two facts follow, and together they are the entire algorithm.

**E-step.** Fix \(\theta=\theta^{(t)}\) and maximize \(\mathcal L\) over \(q\). Since \(\log p_\theta(x)\) does not depend on \(q\), maximizing the bound is the same as minimizing the KL term, which is minimized — at zero — by

$$
q^{(t)}(z)=p_{\theta^{(t)}}(z\mid x).
$$

For a mixture this posterior is the responsibility vector, available in closed form. **The bound now touches the objective:** \(\mathcal L(\theta^{(t)},q^{(t)})=\log p_{\theta^{(t)}}(x)\).

**M-step.** Fix \(q=q^{(t)}\) and maximize \(\mathcal L\) over \(\theta\). Since \(H(q)\) does not depend on \(\theta\), this maximizes the **expected complete-data log likelihood**

$$
Q(\theta\mid\theta^{(t)})=E_{q^{(t)}}\bigl[\log p_\theta(x,z)\bigr],
$$

and the expectation is now *outside* the logarithm. That single interchange is why the M-step is closed-form whenever the complete-data problem was.

![The E-step lifts the bound until it touches the log-likelihood at the current parameters; the M-step then climbs the bound, and the log-likelihood is dragged up at least as far.](../assets/em-coordinate-ascent.svg)

The two steps alternate, each maximizing the same function \(\mathcal L(\theta,q)\) over one argument. That is all EM is. Variational inference, from lesson 14, is the same coordinate ascent restricted to a family \(\mathcal Q\) that does not contain the true posterior — the E-step then leaves a nonzero KL gap, the bound never touches, and the monotonicity guarantee applies to the bound rather than to the likelihood.

**Worked example — reading the two steps off the picture.** At \(\theta^{(t)}\) the E-step raises the bound curve until it is tangent to \(\log p_\theta(x)\). The M-step moves to the bound's maximizer \(\theta^{(t+1)}\). Because the bound lies below the log-likelihood everywhere and touches at \(\theta^{(t)}\), the log-likelihood at \(\theta^{(t+1)}\) is at least the bound's value there, which is at least its value at \(\theta^{(t)}\), which equals the old log-likelihood. The proof in section 7 is this sentence in symbols.

> **Practice — Foundation:** For one observation \(x=0.5\) under \(0.5N(0,1)+0.5N(2,1)\), the E-step maximizes \(\mathcal L(\theta,q)\) over \(q\) with \(\theta\) fixed. Compute the maximizing \(q(z=1)\), then state what the M-step maximizes and over which argument.
>
> **Hint:** The maximizer is the posterior; its log-odds is \(\bigl((0.5-2)^2-0.5^2\bigr)/2=1\), so \(q(z=1)=1/(1+e^{-1})\approx0.731\).
>
> **Practice — Core:** For the same \(x=0.5\) and model, compute \(\log p(x)\) and \(\mathcal L(\theta,q)\) for \(q(z=1)=0.5\) and for \(q\) equal to the posterior, and check that each gap equals \(\operatorname{KL}(q\Vert p_\theta(z\mid x))\).
>
> **Hint:** \(\mathcal L=\sum_zq(z)[\log p(x,z)-\log q(z)]\); \(\log p(x)\approx-1.4238\), and \(q=0.5\) gives a gap of about 0.120, while the posterior gives 0.
>
> **Practice — Stretch:** Suppose the variational family only allows \(q(z=1)\in[0,0.6]\) for the observation above (posterior 0.731). Find the best bound and its KL gap, and state what the EM monotonicity guarantee becomes under this restriction.
>
> **Hint:** KL is convex in \(q\), so the best feasible point is the boundary \(q=0.6\), leaving a gap \(\operatorname{KL}(0.6\Vert0.731)\approx0.040\); only the bound \(\mathcal L\) is then guaranteed to rise.

## 6. EM for a Gaussian mixture, in full

Specialize. The complete-data log likelihood with one-hot indicators \(z_{ik}\) is

$$
\log p_\theta(x,z)=\sum_{i=1}^n\sum_{k=1}^K z_{ik}\bigl[\log\pi_k+\log\mathcal N(x_i\mid\mu_k,\sigma_k^2)\bigr].
$$

It is linear in \(z_{ik}\), so taking the expectation under \(q^{(t)}\) simply replaces \(z_{ik}\) by \(\gamma_{ik}\):

$$
Q(\theta\mid\theta^{(t)})=\sum_{i=1}^n\sum_{k=1}^K\gamma_{ik}\bigl[\log\pi_k+\log\mathcal N(x_i\mid\mu_k,\sigma_k^2)\bigr].
$$

Maximizing gives weighted versions of the ordinary Gaussian estimators. With \(N_k=\sum_i\gamma_{ik}\):

$$
\pi_k^{(t+1)}=\frac{N_k}{n},\qquad
\mu_k^{(t+1)}=\frac{1}{N_k}\sum_{i=1}^n\gamma_{ik}x_i,\qquad
\sigma_k^{2,(t+1)}=\frac{1}{N_k}\sum_{i=1}^n\gamma_{ik}\bigl(x_i-\mu_k^{(t+1)}\bigr)^2 .
$$

The \(\pi\) update requires the constraint \(\sum_k\pi_k=1\), enforced with a Lagrange multiplier; the multiplier turns out to be \(n\), which is why the update is a plain share of effective counts.

Three implementation notes that separate working code from almost-working code. Use the **updated** mean in the variance update, not the old one. Track the incomplete-data log-likelihood \(\sum_i\log\sum_k\pi_kp(x_i\mid\theta_k)\) every iteration and assert it never decreases — that assertion catches nearly every implementation bug. And compute everything in logs with a max-subtraction, since responsibilities for separated components underflow immediately.

In \(d\) dimensions the same derivation gives \(\Sigma_k^{(t+1)}=\frac1{N_k}\sum_i\gamma_{ik}(x_i-\mu_k)(x_i-\mu_k)^T\), with the covariance-structure choices — full, diagonal, spherical, tied — trading parameters against flexibility exactly as in the multivariate Gaussian lesson.

**Worked example — one step by hand.** Three observations \(0,2,4\) with two identical initial components at \(\mu=2,\sigma^2=1,\pi=0.5\). Every responsibility is \(0.5\) by symmetry, so \(N_1=N_2=1.5\), both weights stay at \(0.5\), both means become \(2\), and both variances become \(\frac{4+0+4}{3}=\frac83\). Identical components stay identical forever: symmetric initialization is a fixed point, and this is the first thing to check when EM appears not to move.

> **Practice — Foundation:** For \(x=(0,1,5)\) with first-component responsibilities \(\gamma_{\cdot1}=(0.9,0.8,0.1)\), compute \(N_1\), \(\pi_1\), \(\mu_1\), and \(\sigma_1^2\).
>
> **Hint:** \(N_1=1.8\), \(\pi_1=N_1/3\); each update divides a \(\gamma\)-weighted sum by \(N_1\), and the variance uses the new \(\mu_1\approx0.722\).
>
> **Practice — Core:** Maximize \(\sum_kN_k\log\pi_k\) subject to \(\sum_k\pi_k=1\) for effective counts \(N=(1.8,1.2)\) (\(n=3\)) with a Lagrange multiplier, and show \(\lambda=3\) and \(\pi=(0.6,0.4)\).
>
> **Hint:** Stationarity gives \(N_k/\pi_k=\lambda\); summing \(N_k=\lambda\pi_k\) over \(k\) gives \(\lambda=\sum_kN_k=n\).
>
> **Practice — Stretch:** Derive the \(\Sigma_k\) update by differentiating \(Q\) with respect to \(\Sigma_k^{-1}\), and count free parameters (weights included) for \(K=4\), \(d=3\) under full, diagonal, spherical, and tied covariance.
>
> **Hint:** Use \(\partial\log|\Sigma^{-1}|/\partial\Sigma^{-1}=\Sigma\) and \(\partial\operatorname{tr}(\Sigma^{-1}S)/\partial\Sigma^{-1}=S\); a full \(3\times3\) covariance has 6 free entries, giving totals 39, 27, 19, and 21.

## 7. Monotonicity, and what EM does not promise

**Theorem.** Each EM iteration satisfies \(\log p_{\theta^{(t+1)}}(x)\ge\log p_{\theta^{(t)}}(x)\).

**Proof.** By the bound and the E-step's tightness,

$$
\log p_{\theta^{(t)}}(x)=\mathcal L(\theta^{(t)},q^{(t)})
\le\mathcal L(\theta^{(t+1)},q^{(t)})
\le\log p_{\theta^{(t+1)}}(x).
$$

The equality is E-step tightness, the first inequality is the M-step's definition, and the second is the ELBO bound at the new parameters with the old \(q\). No assumptions beyond those two steps being performed exactly.

An equivalent statement in terms of \(Q\) is worth carrying, since it shows where the improvement comes from:

$$
\ell(\theta')-\ell(\theta)=\underbrace{Q(\theta'\mid\theta)-Q(\theta\mid\theta)}_{\ge0\text{ by the M-step}}+\underbrace{\operatorname{KL}\bigl(p_\theta(z\mid x)\Vert p_{\theta'}(z\mid x)\bigr)}_{\ge0\text{ always}} .
$$

Now the disclaimers, all of which matter.

- Monotone **does not mean convergent to a global maximum.** EM converges to a stationary point of \(\ell\) under mild conditions, and which one depends on the initialization.
- A stationary point **need not be a maximum.** Saddle points are fixed points of EM; symmetric initializations sit on them exactly, as section 6 showed.
- The likelihood sequence converges, but **the parameter sequence need not** if the likelihood has a ridge of equal-valued maxima.
- Monotonicity is in the **incomplete-data likelihood**, not in any held-out metric. EM will happily climb toward the degenerate solutions of section 9.

**Worked example — the assertion that saves a day.** Add `assert loglik[t+1] >= loglik[t] - 1e-9` to an EM loop. A decrease means one of: the variance update used the old mean, the responsibilities were not normalized, the log-likelihood was computed at the wrong parameters, or a component collapsed. All four are common, and none is visible from the fitted plot.

> **Practice — Foundation:** An EM run logs \(\ell=(-52.31,-48.02,-47.90,-47.95,-47.95)\). State the monotonicity theorem, name the two steps its proof uses, and identify the iteration that proves a bug.
>
> **Hint:** The theorem forbids any decrease beyond rounding error; compare consecutive entries and find the step that goes from \(-47.90\) to \(-47.95\).
>
> **Practice — Core:** Prove the theorem in three lines, then check each quantity for \(x=(-1,1,3)\), \(\pi=(0.5,0.5)\) and unit variances fixed, starting from \(\mu=(0,1)\) with one means-only EM step: report \(\ell(\theta^{(t)})\), \(\mathcal L(\theta^{(t+1)},q^{(t)})\), and \(\ell(\theta^{(t+1)})\).
>
> **Hint:** The responsibilities are \(\gamma_{\cdot1}\approx(0.818,0.378,0.076)\) and the new means are about \((-0.167,1.858)\); the three values should increase in order, roughly \(-6.582\le-5.928\le-5.618\).
>
> **Practice — Stretch:** Derive \(\ell(\theta')-\ell(\theta)=[Q(\theta'\mid\theta)-Q(\theta\mid\theta)]+\operatorname{KL}(p_\theta(z\mid x)\Vert p_{\theta'}(z\mid x))\), verify it on the step above, and use it to explain why EM slows near convergence.
>
> **Hint:** Write \(\ell(\theta')=Q(\theta'\mid\theta)-E_{p_\theta(z\mid x)}[\log p_{\theta'}(z\mid x)]\) and subtract the same identity at \(\theta'=\theta\); on the step above the two terms are about 0.654 and 0.310 and sum to \(\Delta\ell\approx0.964\).

## 8. Convergence speed is the fraction of missing information

EM converges **linearly**, not quadratically: near a stationary point the error contracts by a constant factor each iteration. The factor has a precise and memorable meaning.

Write \(I_{\text{comp}}\) for the expected complete-data information — the information you would have had if \(z\) were observed — and \(I_{\text{obs}}\) for the observed-data information. The missing information principle states

$$
I_{\text{obs}}=I_{\text{comp}}-I_{\text{miss}},
$$

where \(I_{\text{miss}}\) is the expected information about \(\theta\) contained in the posterior of \(z\) given \(x\). The EM map's Jacobian at the fixed point is \(I_{\text{miss}}I_{\text{comp}}^{-1}\), so the convergence rate is the largest eigenvalue of that matrix: **the fraction of information that is missing.**

This is the same quantity as the fraction of missing information reported after multiple imputation in lesson 16, and the interpretation transfers. When components are well separated, the latent labels are nearly determined by the data, little information is missing, and EM converges in a handful of iterations. When components overlap heavily, most of the information about which component generated each point is missing, and EM crawls — hundreds or thousands of iterations with visibly decreasing step sizes.

Two consequences for practice. Slow convergence is diagnostic, not merely annoying: it says the components are weakly identified by this data, which is information about your model, not your optimizer. And the standard errors are governed by \(I_{\text{obs}}\), so the same overlap that slows EM also widens the intervals — a fast fit and a precise fit are the same condition.

**Worked example — two datasets, same code.** Components separated by five standard deviations converge in 6 iterations. The same code on components separated by half a standard deviation takes 1,400 iterations to move the log-likelihood less than \(10^{-6}\), and the resulting means have overlapping confidence regions. Nothing is wrong; the second dataset contains little information about the partition.

> **Practice — Foundation:** Near convergence, EM's parameter error \(|\mu_t-\mu^\ast|\) is \(0.1,0.08,0.064\) on three successive iterations. Estimate the fraction of missing information, and predict how many more iterations bring the error below \(10^{-6}\).
>
> **Hint:** The ratio of successive errors estimates the largest eigenvalue of \(I_{\text{miss}}I_{\text{comp}}^{-1}\), here 0.8; solve \(0.064\cdot0.8^m<10^{-6}\) for \(m\) (about 50).
>
> **Practice — Core:** For \(0.5N(-d,1)+0.5N(d,1)\), compute the responsibility of the right component at \(x=0.5\) for \(d=0.5\) and for \(d=3\), and use the label posterior to explain which setting has more missing information and slower EM.
>
> **Hint:** The log-odds for the right component at \(x\) is \(2dx\): 0.5 gives \(\gamma\approx0.62\) (the label is nearly unknown) and 3 gives \(\gamma\approx0.95\) (the label is nearly determined).
>
> **Practice — Stretch:** In one dimension with missing-information fraction \(\lambda=0.9\) and complete-data SE 0.05 for \(\mu_1\), compute the observed-data SE and the iterations needed to shrink the error by \(10^{6}\). Then design a simulation (separations, \(n\), seed, outputs) that shows the rate and the interval width move together.
>
> **Hint:** \(I_{\text{obs}}=I_{\text{comp}}(1-\lambda)\) gives SE \(=0.05/\sqrt{0.1}\approx0.158\); iterations \(\approx\log10^{-6}/\log0.9\approx131\). Sweep separation over \(\{1,2,5\}\) SDs and record both quantities.

## 9. The likelihood is unbounded, and EM will find out

For a Gaussian mixture with free variances, the likelihood has no maximum. Put \(\mu_1=x_1\) for some observation and let \(\sigma_1^2\to0\). That component's density at \(x_1\) grows like \(1/\sigma_1\), so the term \(\log(\pi_1\mathcal N(x_1\mid x_1,\sigma_1^2)+\dots)\to\infty\) while every other observation is still explained by the remaining components. The supremum is \(+\infty\) and it is attained on a boundary, not at an interior stationary point.

These **degenerate spikes** are real features of the objective, not numerical artifacts, and EM reaches them: once a component's responsibility concentrates on a single point, its variance update returns nearly zero, which concentrates the responsibility further. The collapse is self-reinforcing and typically takes a handful of iterations.

Four standard remedies, in rough order of preference:

1. **Variance floor.** Refuse \(\sigma_k^2<\varepsilon\) for a small \(\varepsilon\) tied to the data scale. Crude, effective, and easy to report.
2. **MAP-EM with a prior.** Put an inverse-gamma prior on \(\sigma_k^2\) (or inverse-Wishart on \(\Sigma_k\)) and maximize the posterior instead. The M-step gains an additive term in numerator and denominator, the spike is penalized away, and the procedure remains EM with \(\log p(\theta)\) added to \(Q\).
3. **Tied or constrained covariances.** A shared \(\sigma^2\) across components removes the degeneracy entirely, at the price of flexibility.
4. **Restart and reject.** Detect collapse by monitoring the smallest effective count \(N_k\) and the smallest variance, and restart from a new seed.

The general lesson outlives mixtures: an unbounded likelihood means maximum likelihood is not well-posed for that family, and something — a prior, a constraint, or a penalty — must supply the missing regularity. Lesson 06's asymptotic theory assumed an interior maximum with positive-definite information; here that assumption fails visibly.

**Worked example — the component that ate one point.** After 40 iterations a component has \(N_k=1.0000\), \(\sigma_k^2=3\times10^{-12}\), and the log-likelihood is \(+\infty\) for practical purposes. The fit is a perfect explanation of one observation and a useless model. A variance floor at \(10^{-4}\) times the sample variance, plus a restart policy, converts this failure into a run that finishes.

> **Practice — Foundation:** For \(x=(0,1,2)\) and the mixture \(0.5N(0,\sigma^2)+0.5N(1,1)\), compute \(\ell\) at \(\sigma=1,0.1,0.01\) and show it grows like \(-\log\sigma\).
>
> **Hint:** As \(\sigma\to0\), the first term's density at \(x=0\) is about \(0.5/(\sigma\sqrt{2\pi})\) while \(x=1,2\) are still covered by the second component; \(\ell\) goes \(-4.19,-2.97,-0.73\), gaining about \(\log10\) per decade.
>
> **Practice — Core:** Derive the MAP-EM update for \(\sigma_k^2\) under an inverse-gamma\((a,b)\) prior, then evaluate it for a collapsed component with \(N_k=1\), \(\sum_i\gamma_{ik}(x_i-\mu_k)^2=0\), \(a=2\), \(b=0.5\).
>
> **Hint:** Add \(-(a+1)\log\sigma^2-b/\sigma^2\) to the component's \(Q\) terms and set the \(\sigma^2\)-derivative to zero, giving \(\sigma^2=(S+2b)/(N_k+2a+2)=1/7\).
>
> **Practice — Stretch:** For \(x=(-1,0,1,5)\), a \(K=2\) fit with \(\mu=(0,5)\) collapses component 2 onto \(x=5\) (\(N_2\approx1\)). Compute \(\sigma_2^2\) under (a) a floor \(\varepsilon=0.01\), (b) an IG\((2,0.5)\) prior, (c) a tied variance with hard assignments, and say what each remedy changes about the estimand.
>
> **Hint:** (a) gives 0.01; (b) gives \((0+1)/(1+6)=1/7\); (c) pools all squared deviations, \((1+0+1+0)/4=0.5\). A floor changes the feasible set, a prior changes the objective, tying changes the model.

## 10. Label switching is symmetry, not instability

The mixture likelihood is invariant to permuting the component labels: relabelling \((\pi_1,\theta_1)\leftrightarrow(\pi_2,\theta_2)\) leaves \(p(x)\) unchanged. With \(K\) components there are \(K!\) parameter settings giving identical densities, so the parameters are **not identifiable** in the strict sense of lesson 06, even with infinite data.

Two consequences, which differ sharply by inference method.

For **maximum likelihood**, this is harmless. Any optimizer lands in one of the \(K!\) equivalent basins, and the fitted density is the same. Report components in a canonical order — sorted by mean, or by weight — and the ambiguity disappears from the output.

For **Bayesian inference**, it is a genuine obstacle. The posterior is \(K!\)-symmetric, so the marginal posterior of \(\mu_1\) is identical to that of \(\mu_2\), and a sampler that mixes well across the symmetry produces posterior means that are all equal to the global average. The lesson 09 warning about multimodal posteriors and misleading local Gaussian approximations is exactly this situation. Remedies are ordering constraints, post-hoc relabelling algorithms, or reporting only label-invariant functionals such as the predictive density, the number of occupied components, or the partition of observations.

The deeper point is that **label switching is not the same as non-identifiability of the model**. The mixture *distribution* — the unordered set of weighted components — is identifiable for Gaussian mixtures (and most common families) up to permutation. What fails is the labelling, which was never the estimand. Section 11 covers failures that are not so benign.

**Worked example — the posterior mean that means nothing.** An MCMC run over a two-component mixture with true means \(-3\) and \(3\) mixes across the label symmetry and reports posterior means of \(0.02\) and \(-0.01\) for \(\mu_1\) and \(\mu_2\), with wide bimodal marginals. Nothing failed: the sampler is correct and the summary is meaningless. Reporting the posterior of \(\min(\mu_1,\mu_2)\) and \(\max(\mu_1,\mu_2)\), or of the predictive density, restores usable output.

> **Practice — Foundation:** How many parameter vectors give the same density as a 4-component mixture with distinct components? Check one swap by evaluating \(0.3N(0,1)+0.7N(3,1)\) and its relabelled version at \(x=1\).
>
> **Hint:** \(K\) distinct components can be labelled in \(K!\) ways; swapping \((\pi_1,\mu_1)\leftrightarrow(\pi_2,\mu_2)\) only reorders the two terms, and both evaluate to about 0.1104.
>
> **Practice — Core:** A sampler for \(0.5N(\mu_1,1)+0.5N(\mu_2,1)\) spends half its draws near \((\mu_1,\mu_2)=(-3,3)\) and half near \((3,-3)\). Compute the posterior means of \(\mu_1\) and of \(\min(\mu_1,\mu_2)\), and explain why the switching is harmless for a sorted ML report but damaging for the raw posterior mean.
>
> **Hint:** Averaging \(\mu_1\) over the two label states gives about 0; \(\min(\mu_1,\mu_2)\) is the same in both states, so it averages to \(-3\).
>
> **Practice — Stretch:** For the idealized draws above, compute three label-invariant summaries: the predictive density at \(x=0\), the probability that \(x_a=-3.1\) and \(x_b=2.8\) share a component, and the sorted means. Say which scientific question each one answers.
>
> **Hint:** Each summary must be the same at \((-3,3)\) and \((3,-3)\): the predictive density is \(\varphi(3)\approx0.0044\), and co-clustering \(\sum_k\gamma_{ak}\gamma_{bk}\approx6\times10^{-8}\).

## 11. Identifiability failures that are not about labels

Beyond permutation, mixtures have genuine identifiability problems, and they differ by family.

**Overfitted order.** If the true model has two components and you fit three, the extra component can go anywhere with zero weight, or duplicate an existing component and split its weight arbitrarily. The parameter set achieving the maximum is a continuum, the Fisher information is singular, and the usual asymptotic theory does not apply. This is precisely the nonregular case flagged in lesson 06.

**Families that are not identifiable at all.** A mixture of Bernoulli distributions on a single binary variable is hopeless: any mixture of Bernoulli\((p_1)\) and Bernoulli\((p_2)\) with weights \(\pi\) produces Bernoulli\((\pi p_1+(1-\pi)p_2)\), a one-parameter family. No amount of data recovers the components, because the marginal has one degree of freedom and the model has three.

**What restores identifiability.** For product distributions over several conditionally independent features, identifiability returns: three or more binary features with conditional independence given the latent class make the latent-class model generically identifiable, a result following from uniqueness of three-way tensor decompositions. This is why latent class analysis needs several indicators per construct rather than one, and it is the same principle as needing multiple noisy measurements to separate signal from noise.

**Continuous families are usually fine.** Finite mixtures of Gaussians, of Poissons, and of exponentials are identifiable up to permutation. The distinguishing property is that the component family is linearly independent as a set of functions, which the Bernoulli family on one variable fails.

**Worked example — one item is not a scale.** A latent-class model of "user intent" fitted to a single binary click indicator returns whatever class proportions the prior implies, and the fit is perfect regardless. Adding two more conditionally independent behavioral indicators makes the classes estimable. The diagnostic that reveals the problem is parameter instability across restarts with identical likelihood — the signature of a flat ridge rather than a peak.

> **Practice — Foundation:** Show that \((\pi,p_1,p_2)=(0.5,0.2,0.6)\) and \((0.25,1.0,0.2)\) give the same law for a single binary \(X\), so the two-component Bernoulli mixture is not identifiable.
>
> **Hint:** Each setting induces Bernoulli\((\pi p_1+(1-\pi)p_2)\); compute that number for both, and both give 0.4.
>
> **Practice — Core:** Fit \(p(x)=(1-\pi)\varphi(x)+\pi\varphi(x-\mu)\) to data from \(N(0,1)\). Show the set of true parameter values is \(\{\pi=0\}\cup\{\mu=0\}\), and that \(\partial\log p/\partial\mu\equiv0\) at \(\pi=0\), so the Fisher information is singular there.
>
> **Hint:** The \(\mu\)-derivative of \(\log p\) carries a factor \(\pi\,\varphi(x-\mu)(x-\mu)/p(x)\), which vanishes identically when \(\pi=0\).
>
> **Practice — Stretch:** For \(K=2\) latent classes and \(D\) binary indicators independent given the class, count the model parameters \(2D+1\) and the free cells \(2^D-1\) of the observed table for \(D=2\) and \(D=3\), and explain why \(D=3\) is the first case where identifiability can hold.
>
> **Hint:** \(D=2\) gives 5 parameters against 3 cells, so a continuum fits; \(D=3\) gives 7 and 7, and uniqueness of three-way (Kruskal) decompositions supplies generic identifiability.

## 12. Choosing the number of components

The natural test is a likelihood-ratio test of \(K\) against \(K+1\). It is invalid, and for two reinforcing reasons: under the null the extra component has weight zero, which is on the **boundary** of the parameter space, and its parameters are **unidentified** because they do not affect the likelihood. Both violate the regularity conditions of lesson 07's Wilks theorem, and the null distribution is not \(\chi^2\) with the naive degrees of freedom. Using the naive test overstates evidence for extra components, sometimes dramatically.

Workable alternatives:

- **Held-out log-likelihood.** Fit on training data, evaluate \(\sum_i\log p_{\hat\theta}(x_i)\) on a held-out split. Honest, assumption-light, and directly aligned with a density-estimation purpose.
- **Information criteria.** BIC \(=-2\ell+p\log n\) is the standard choice and works acceptably in practice despite the regularity failure; AIC tends to overselect components. Report which you used and do not treat small differences as decisive.
- **Parametric bootstrap for the likelihood-ratio statistic.** Simulate from the fitted \(K\)-component model, refit both models, and build the null distribution empirically. Expensive, and correct.
- **Stability across resamples.** If the recovered partition changes qualitatively across bootstrap samples, the component count is not supported whatever the criterion says.
- **Bayesian nonparametrics.** A Dirichlet process mixture puts a prior over the number of occupied components and estimates it jointly, at the cost of a more demanding computation.

For a clustering purpose, add the substantive test: do the components correspond to anything you can check externally? A component count chosen by BIC and unrecognizable to the people who own the system is a modelling artifact.

**Worked example — three criteria, three answers.** On the same 4,000 latency observations, AIC selects 7 components, BIC selects 4, and held-out likelihood is flat between 3 and 5. The honest report is that the data supports 3–5 components for density estimation and does not determine a cluster count, with the fitted density shown for \(K=4\).

> **Practice — Foundation:** On \(n=400\), a \(K=2\) fit (5 parameters) has \(\ell=-812.0\) and a \(K=3\) fit (8 parameters) has \(\ell=-808.5\). Compute the likelihood-ratio statistic, its naive \(\chi^2_3\) p-value, and BIC for both, and name the two regularity violations.
>
> **Hint:** LR \(=2(\ell_3-\ell_2)=7.0\) (naive \(p\approx0.072\)); BIC \(=-2\ell+p\log n\) with \(\log400\approx5.99\). Under the null, \(\pi_3=0\) is on the boundary and \((\mu_3,\sigma_3)\) are unidentified.
>
> **Practice — Core:** Data from 3 components (1,000 train, 1,000 test) give train \(\ell_K=(-2210,-2105,-2060,-2055,-2051)\) and held-out \((-2215,-2112,-2071,-2070,-2072)\) for \(K=1,\dots,5\), with \(p=3K-1\). Compute AIC and BIC for each \(K\) and report where BIC, AIC, and held-out likelihood disagree.
>
> **Hint:** With \(\log1000\approx6.908\), BIC is minimized at \(K=3\), AIC at \(K=5\), and held-out likelihood peaks at \(K=4\) by only 1 nat over \(K=3\), which is effectively flat.
>
> **Practice — Stretch:** For \(H_0\): one Gaussian vs \(H_1\): two components with a tied variance, draw \(n=200\) from \(N(0,1)\), fit both models (5 EM starts), and repeat \(B=200\) times to build the null distribution of the LR statistic. Compare its 95th percentile with the naive \(\chi^2_2\) value 5.99.
>
> **Hint:** Because the LR is invariant to location and scale, simulating from \(N(0,1)\) equals a parametric bootstrap from the fitted Gaussian; one run (Python random.seed(0)) gave a 95th percentile of about 5.7 and a mean of about 2.1, so the calibration had to be measured, not assumed.

## 13. K-means is EM in a degenerate limit

Fix all components to be spherical with common variance \(\sigma^2\) and equal weights, and let \(\sigma^2\to0\). The responsibility

$$
\gamma_{ik}=\frac{\exp\bigl(-\Vert x_i-\mu_k\Vert^2/2\sigma^2\bigr)}{\sum_j\exp\bigl(-\Vert x_i-\mu_j\Vert^2/2\sigma^2\bigr)}
$$

is a softmax over negative squared distances with temperature \(\sigma^2\). As \(\sigma^2\to0\) it becomes the indicator of the nearest centroid. The M-step then sets each \(\mu_k\) to the mean of its assigned points. That is Lloyd's algorithm, and the EM objective reduces to the within-cluster sum of squares.

So K-means is EM with the temperature set to zero. What the limit costs is worth stating explicitly:

- **No uncertainty.** Boundary points contribute entirely to one cluster; the model cannot express "this point is ambiguous."
- **Implicit geometry.** Equal spherical covariances mean the method finds clusters of equal size and round shape, and will split an elongated cluster rather than recognize it.
- **No density.** K-means gives no likelihood, so held-out comparison, calibration, and model selection all become ad hoc.
- **Same weaknesses.** Local optima, initialization sensitivity, and the need for restarts persist, because they come from the objective's non-convexity, not from the softness.

Read in the other direction, this makes a Gaussian mixture the principled generalization of K-means: soft assignments, per-cluster shape through \(\Sigma_k\), unequal cluster sizes through \(\pi_k\), and a likelihood you can hold out.

**Worked example — the elongated cluster.** Two clusters, one spherical and one stretched along a diagonal, are split incorrectly by K-means, which cuts the elongated cluster in half to satisfy its round-cluster prior. A full-covariance Gaussian mixture from the same initialization recovers both. The failure is in the geometry the objective assumes, not in the optimizer.

> **Practice — Foundation:** With centroids \(\mu_1=0\), \(\mu_2=4\), equal weights, and shared variance \(\sigma^2\), compute \(\gamma_1\) for \(x=1\) at \(\sigma^2=4,1,0.25\), and give its limit as \(\sigma^2\to0\).
>
> **Hint:** \(\log(\gamma_1/\gamma_2)=\bigl((1-4)^2-(1-0)^2\bigr)/(2\sigma^2)=4/\sigma^2\), which gives about 0.731, 0.982, and \(1-10^{-7}\), tending to 1.
>
> **Practice — Core:** Show that \(2\sigma^2\) times the expected complete-data log likelihood tends to \(-\sum_i\Vert x_i-\mu_{c(i)}\Vert^2\) plus a vanishing term as \(\sigma^2\to0\), and evaluate that within-cluster sum of squares for \(x=(0,1,5,6)\), \(\mu=(0.5,5.5)\).
>
> **Hint:** With hard responsibilities, \(Q=-\frac1{2\sigma^2}\sum_i\Vert x_i-\mu_{c(i)}\Vert^2-\frac{nd}2\log(2\pi\sigma^2)-n\log K\); the log term times \(\sigma^2\) vanishes. Here the WCSS is \(4\times0.25=1\).
>
> **Practice — Stretch:** Points \((-6,0),(-3,0),(0,0),(3,0),(6,0)\) form an elongated cluster and \((-0.2,2),(0,2),(0.2,2)\) a compact one. Compute the WCSS of the true partition and of the best 2-means partition (enumerate splits), and explain geometrically why a full-covariance mixture prefers the true one.
>
> **Hint:** The true partition has WCSS 90.08; the best split cuts the long cluster, at about 42.08. A full covariance can give the long cluster variance 18 along \(x\) and almost none along \(y\), which K-means cannot express.

## 14. EM is for missing data generally, not just mixtures

Lesson 16 established that a latent variable and a missing value are the same object seen from two directions. EM makes that concrete: anything you would have analyzed easily had you seen \(z\) is a candidate for EM, with \(z\) the missing part.

**Missing covariates or outcomes.** Treat the missing entries as \(z\). The E-step computes their conditional distribution given the observed entries and current parameters; the M-step refits on the completed sufficient statistics. Under MAR with distinct parameters, the mechanism is ignorable and need not be modelled — that is precisely the ignorability theorem from lesson 16 §20, and it is what licenses running EM on the observed-data likelihood alone.

**Censored and truncated data.** For a right-censored observation known only to exceed \(c\), the E-step replaces the unobserved value by its conditional expectation given \(X>c\), not by \(c\). Substituting the censoring point is the classic bias, and EM says exactly what to substitute instead.

**Mixed-effects models.** The random effects of lesson 11 are latents. EM alternates between the conditional distribution of the group effects given the data and current variance components, and closed-form variance-component updates. This is one of several routes to the same partial-pooling estimates.

**Factor and latent-trait models.** Factor analysis, probabilistic PCA, and item-response models are all EM targets with continuous latents, where the E-step returns a conditional mean and covariance rather than a discrete posterior.

One caution that ties the two lessons together: EM under MAR gives valid point estimates from the observed-data likelihood, but the **standard errors from the completed data are wrong**, because they treat imputed quantities as observed. Correct uncertainty comes from the observed information \(I_{\text{obs}}\) — via Louis's identity, the supplemented-EM computation, or a bootstrap of the whole fitting procedure. This is the same false-confidence failure that section 22 of lesson 16 diagnosed for single imputation, appearing again in a different costume.

**Worked example — censored latencies.** Requests timing out at 30 seconds are recorded as 30. Fitting a lognormal to the raw values underestimates the mean and badly underestimates the tail. EM replaces each censored value's contribution by \(E[\log X\mid \log X>\log 30]\) under the current parameters, and the fitted tail moves to where the data actually implies it is.

> **Practice — Foundation:** Five latencies with timeout \(c=30\) are recorded as \((12,18,25,30^+,30^+)\). Identify the latent variables, and compute what the E-step substitutes for each censored value under the current \(N(\mu=20,\sigma=10)\).
>
> **Hint:** The latents are the two true values above 30; \(E[X\mid X>c]=\mu+\sigma\varphi(\alpha)/(1-\Phi(\alpha))\) with \(\alpha=(30-20)/10=1\), which is about 35.25.
>
> **Practice — Core:** Write the EM updates for a Gaussian sample with right-censored observations, and perform one iteration on the data above starting from \(\mu=20\), \(\sigma^2=100\).
>
> **Hint:** Replace each censored \(x\) by \(E[X\mid X>c]\) and each \(x^2\) by \(\mu^2+\sigma^2+\sigma(c+\mu)\lambda(\alpha)\), then average and use the new \(\mu\): expect \(\mu\approx25.10\) and \(\sigma^2\approx93.6\).
>
> **Practice — Stretch:** In the censored-latency example (2 of 5 values censored), suppose the fraction of missing information for \(\mu\) is 0.3. Compute the factor by which the completed-data SE \(\hat\sigma/\sqrt5\) must be inflated, explain why the completed-data SE is too small, and describe Louis's identity and a bootstrap as two corrections.
>
> **Hint:** \(I_{\text{obs}}=I_{\text{comp}}(1-\lambda)\) gives \(\text{SE}_{\text{obs}}=\text{SE}_{\text{comp}}/\sqrt{0.7}\approx1.195\,\text{SE}_{\text{comp}}\); the bootstrap must refit EM on each resample, censoring included.

## 15. Discrete mixtures and latent class models

For binary or categorical data the same machinery specializes cleanly. A **latent class model** with \(K\) classes and \(D\) conditionally independent binary features has

$$
p(x)=\sum_{k=1}^K\pi_k\prod_{d=1}^D\theta_{kd}^{x_d}(1-\theta_{kd})^{1-x_d},
$$

the **conditional independence** assumption — features independent *given* the class — doing all the work. The E-step is Bayes' rule over \(K\) classes; the M-step sets \(\theta_{kd}\) to the responsibility-weighted fraction of ones on feature \(d\).

Two observations matter here. First, this is exactly naive Bayes with an unobserved label: supervised naive Bayes counts, unsupervised naive Bayes runs EM. The mixture and the classifier are the same model differing only in whether \(z\) is seen. Second, conditional independence is a strong and checkable claim: if two features remain correlated within a class, the model responds by adding spurious classes to absorb the correlation, which is a common cause of inflated component counts.

Multinomial mixtures of the same shape underlie topic models; adding a per-document distribution over topics rather than a single latent class is the step from a mixture to latent Dirichlet allocation, where the E-step is no longer closed-form and variational inference from lesson 14 takes over.

**Worked example — the correlated pair that invented a class.** A latent class model of four error indicators returns five classes on data generated from two, because two of the indicators are mechanically linked and violate conditional independence within class. Adding a direct dependence between that pair returns the count to two. The diagnostic is the within-class residual correlation matrix, which should be near zero and was not.

> **Practice — Foundation:** A latent class model has \(K=2\), \(D=3\), \(\pi=(0.6,0.4)\), \(\theta_1=(0.9,0.8,0.7)\), \(\theta_2=(0.2,0.1,0.3)\). Compute \(p(x)\) for \(x=(1,1,0)\), and state the conditional independence assumption you used.
>
> **Hint:** Given the class, multiply \(\theta_{kd}\) for \(x_d=1\) and \(1-\theta_{kd}\) for \(x_d=0\), then mix: \(0.6(0.9)(0.8)(0.3)+0.4(0.2)(0.1)(0.7)=0.1352\).
>
> **Practice — Core:** Derive the M-step for \(\theta_{1d}\), and compute it for four rows with \(x_{\cdot d}=(1,1,0,1)\) and \(\gamma_{\cdot1}=(0.9,0.6,0.2,0.5)\).
>
> **Hint:** Maximizing \(\sum_i\gamma_{i1}[x_{id}\log\theta+(1-x_{id})\log(1-\theta)]\) gives \(\sum_i\gamma_{i1}x_{id}/\sum_i\gamma_{i1}=2.0/2.2\approx0.909\).
>
> **Practice — Stretch:** Two binary features in one true class have \(P(1,1)=P(0,0)=0.4\) and \(P(1,0)=P(0,1)=0.1\). Show a 1-class model cannot fit, find a 2-class fit \(\pi=0.5\), \(\theta_1=(a,a)\), \(\theta_2=(1-a,1-a)\) that reproduces the table exactly, and propose the diagnostic that would expose the invented class.
>
> **Hint:** The one-class fit predicts 0.25 in every cell, and the within-class phi correlation is \((0.16-0.01)/0.25=0.6\); solve \(0.5a^2+0.5(1-a)^2=0.4\) to get \(a\approx0.887\).

## 16. Variants: MAP, generalized, stochastic, and variational EM

The two-step template survives many weakenings, and knowing which guarantee each one keeps is the practical point.

**MAP-EM.** Add \(\log p(\theta)\) to the M-step objective. The monotonicity proof goes through with the log posterior in place of the log likelihood, giving a monotone sequence in \(\log p(\theta\mid x)\). This is the principled fix for the degeneracies of section 9.

**Generalized EM.** The M-step need not maximize — it only needs to *increase* \(Q\). A single gradient or Newton step suffices, and the monotonicity proof, which used only \(Q(\theta^{(t+1)}\mid\theta^{(t)})\ge Q(\theta^{(t)}\mid\theta^{(t)})\), is unchanged. This rescues EM for models whose M-step has no closed form.

**ECM and its relatives.** Replace one hard maximization with several conditional ones, maximizing over parameter blocks in turn. Monotonicity survives for the same reason.

**Stochastic and online EM.** Compute the E-step on a minibatch and update sufficient statistics with a decaying step size. Monotonicity is lost; what replaces it is the stochastic-approximation convergence theory from the optimization track, with the same step-size conditions.

**Variational EM.** When the posterior \(p_\theta(z\mid x)\) is intractable, restrict \(q\) to a tractable family. The E-step becomes an optimization rather than a formula, the bound no longer touches, and monotonicity holds for \(\mathcal L\) rather than for \(\ell\). This is the bridge back to lesson 14: EM and variational inference are the exact and approximate versions of one coordinate ascent.

**Monte Carlo EM.** Approximate the E-step expectation by sampling. Monotonicity becomes probabilistic, and the sample size must grow as the iteration proceeds or the algorithm stalls in a noise ball.

**Worked example — choosing a variant.** A GLM mixture has no closed-form M-step for the regression coefficients. Rather than abandoning EM, take one IRLS step per iteration — generalized EM — and the monotone log-likelihood sequence is retained at a fraction of the cost per iteration.

> **Practice — Foundation:** An M-step for GLM coefficients has no closed form. One IRLS step raises \(Q\) from \(-310.4\) to \(-305.2\) without reaching its maximum \(-304.9\). Name the variant, and say by at least how much \(\ell\) rises.
>
> **Hint:** This is generalized EM. The identity \(\ell(\theta')-\ell(\theta)=\Delta Q+\text{KL}\) with \(\text{KL}\ge0\) gives a rise of at least \(\Delta Q=5.2\).
>
> **Practice — Core:** Using \(\ell(\theta')-\ell(\theta)=\Delta Q+\text{KL}\), show that any \(\theta'\) with \(Q(\theta'\mid\theta)\ge Q(\theta\mid\theta)\) raises \(\ell\). Check it for \(x=(-1,1,3)\), \(\pi=(0.5,0.5)\), unit variances, \(\mu=(0,1)\), taking \(\mu'\) halfway to the EM update.
>
> **Hint:** \(Q\) is a concave quadratic in \(\mu\) for fixed \(\gamma\), so the halfway point gains \(3/4\) of the full \(\Delta Q\) (about 0.491 of 0.654); \(\ell\) rises by about 0.581.
>
> **Practice — Stretch:** Online EM updates statistics by \(s_{t+1}=(1-\rho_t)s_t+\rho_t\hat s(x_t)\). For \(\rho_t=1/t\), \(t^{-0.6}\), \(t^{-0.4}\), and a constant 0.01, say which meet the Robbins–Monro conditions, and explain what replaces monotonicity.
>
> **Hint:** The conditions are \(\sum\rho_t=\infty\) and \(\sum\rho_t^2<\infty\), and \(\sum t^{-p}\) converges iff \(p>1\): \(1/t\) and \(t^{-0.6}\) pass, \(t^{-0.4}\) and the constant fail.

## 17. Directed graphical models: structure, plates, and learning

A **Bayesian network** over variables \(V_1,\dots,V_p\) is a DAG together with the factorization

$$
p(v_1,\dots,v_p)=\prod_{j=1}^p p\bigl(v_j\mid \mathrm{pa}(v_j)\bigr).
$$

Lesson 16 introduced exactly this object and read causal claims off it. Here the reading is purely probabilistic: the graph is a compact encoding of conditional independences and a specification of which conditional tables or densities the model contains. A graph with a causal interpretation is a Bayesian network with an extra commitment; a Bayesian network without that commitment is still a perfectly good factorization.

The saving is parametric. A joint distribution over 20 binary variables has \(2^{20}-1\) free parameters. If each variable has at most 3 parents, the factorization needs at most \(20\times2^3=160\). Structure buys statistical efficiency, and it buys it in proportion to how many arrows you can honestly omit.

**Plate notation** compresses repetition: a box around a subgraph annotated with \(i=1,\dots,n\) means "replicate this, with the enclosed variables indexed by \(i\)." A mixture model in plate notation is one plate over observations containing \(z_i\to x_i\), with \(\pi\) and \(\theta\) outside the plate as shared parameters. Every hierarchical model in lesson 11 has such a diagram, and drawing it makes the difference between shared and per-unit parameters unambiguous.

**Parameter learning** splits sharply by observability:

- **Fully observed.** The log-likelihood decomposes into a sum over families \(\sum_j\sum_i\log p(v_{ij}\mid\mathrm{pa}_{ij})\), so each conditional table is fitted independently — counting for discrete variables, weighted regression for continuous ones. The problem is convex per family and embarrassingly parallel.
- **Partially observed.** The decomposition breaks, and you are back to EM, with the E-step requiring an inference algorithm to compute the posterior over the unobserved nodes. Sections 20 to 22 supply those algorithms.

**Structure learning** — recovering the graph itself — is a harder problem with two families of methods, constraint-based (test conditional independences and orient what the tests determine) and score-based (search over graphs optimizing a penalized likelihood). Both recover only the **Markov equivalence class**: graphs with the same skeleton and the same v-structures are indistinguishable from observational data, which is the statistical statement behind lesson 16's insistence that causal direction requires assumptions or intervention.

**Worked example — the mixture as a two-node network.** The Gaussian mixture is the Bayesian network \(Z\to X\) inside a plate over \(i\), with parameters \(\pi\) and \(\{\mu_k,\sigma_k^2\}\) outside. Written this way, the E-step is "inference in this network" and the M-step is "fully observed learning given the inferred distribution." Every algorithm in the rest of the unit is that sentence applied to a bigger graph.

> **Practice — Foundation:** Write the factorization for the binary DAG \(A\to B\), \(A\to C\), \(B\to D\), \(C\to D\), \(D\to E\), and count its free parameters against an unrestricted joint.
>
> **Hint:** A binary node with \(m\) binary parents needs \(2^m\) free probabilities, so the count is \(1+2+2+4+2=11\), against \(2^5-1=31\).
>
> **Practice — Core:** Draw the plate diagram for a 1-D Gaussian mixture with \(K=3\) and \(n=100\), and count the shared parameters and the per-observation variables.
>
> **Hint:** Anything indexed by \(i\) goes inside the plate (\(z_i\to x_i\): 100 latents, 100 observations); \(\pi\) (2 free) and \(\mu_k,\sigma_k^2\) (6) sit outside, 8 shared in all.
>
> **Practice — Stretch:** List the four DAGs with skeleton \(A-B-C\), group them into Markov equivalence classes, and explain which one observational data can distinguish and why the others stay unresolved.
>
> **Hint:** Two DAGs are equivalent iff they have the same skeleton and the same v-structures, and only \(A\to B\leftarrow C\) has a v-structure: the chain, the reversed chain, and the fork form one class.

## 18. Undirected models and the price of a partition function

Some dependence structures have no natural direction: pixels in an image, labels in a grid, spins in a lattice. A **Markov random field** puts an undirected graph on the variables and factorizes over its cliques:

$$
p(v)=\frac1Z\prod_{c\in\mathcal C}\psi_c(v_c),
\qquad
Z=\sum_{v}\prod_{c\in\mathcal C}\psi_c(v_c).
$$

The **potentials** \(\psi_c\ge0\) are arbitrary nonnegative functions, not conditional probabilities; they express compatibility rather than a normalized belief. **Hammersley–Clifford** makes the correspondence exact: for strictly positive distributions, being Markov with respect to \(G\) — every variable conditionally independent of the rest given its neighbours — is equivalent to factorizing over the cliques of \(G\).

The normalizer \(Z\) is the whole difficulty. It couples every parameter to every other, so the log-likelihood

$$
\ell(\theta)=\sum_c\log\psi_c(v_c;\theta)-\log Z(\theta)
$$

has a gradient involving \(E_\theta[\cdot]\) under the model, which requires inference on every gradient step. This is the structural reason undirected models are harder to fit than directed ones: a Bayesian network's normalizer is 1 by construction, and its fully observed likelihood decomposes; an MRF's does not.

Practical responses include contrastive divergence and other MCMC-in-the-loop schemes, pseudolikelihood, which replaces the joint by a product of conditionals and is consistent but less efficient, and score matching from lesson 15 — which is best understood here as the principled way to avoid \(Z\) entirely by working with \(\nabla_x\log p\), where the normalizer differentiates away.

**Worked example — an Ising model on a small grid.** On a \(4\times4\) binary grid with nearest-neighbour potentials, \(Z\) sums \(2^{16}=65{,}536\) terms and is computable. On a \(100\times100\) grid it sums \(2^{10{,}000}\) terms and is not. Nothing about the model changed; only the feasibility of the normalizer did, and every fitting method for the large grid is an answer to that one problem.

> **Practice — Foundation:** For the binary 4-cycle \(A-B-C-D-A\) with every edge potential \(\psi(u,v)=2\) if \(u=v\) and 1 otherwise, write the clique factorization, name the maximal cliques, and compute \(Z\).
>
> **Hint:** The maximal cliques are the four edges (there are no triangles); enumerate the 16 states by their number of agreeing edges (4, 2, or 0) to get \(2\cdot16+12\cdot4+2\cdot1=82\).
>
> **Practice — Core:** State Hammersley–Clifford with its positivity condition. Let \(X=Y=Z\) be one fair coin copied three times: show that \(X\perp Y\mid Z\), \(X\perp Z\mid Y\), and \(Y\perp Z\mid X\) all hold, so the law is pairwise Markov for the empty graph, yet it does not factorize as \(\psi(x)\psi(y)\psi(z)\).
>
> **Hint:** Given any one variable, the other two are constants and hence independent; but \(P(0,0,0)=1/2\) while the product of the marginals is \(1/8\), and the zeros break positivity.
>
> **Practice — Stretch:** For one Ising edge \(p(a,b)\propto\exp(\theta ab)\) with \(a,b\in\{-1,1\}\), derive \(\partial\ell/\partial\theta=\overline{ab}-E_\theta[AB]\), show \(E_\theta[AB]=\tanh\theta\), and find the MLE when the data average of \(ab\) is 0.6. Explain why a large MRF needs inference at every gradient step.
>
> **Hint:** \(\log Z(\theta)=\log(2e^\theta+2e^{-\theta})\), whose derivative is the model expectation \(\tanh\theta\); solving \(\tanh\theta=0.6\) gives \(\theta=\tfrac12\log4=\log2\).

## 19. Directed, undirected, and what conversion loses

The two families are not interchangeable, and the precise statement is about which conditional independences each can represent.

**Separation.** In an undirected graph, \(A\perp C\mid S\) whenever every path from \(A\) to \(C\) passes through \(S\). This is simple graph separation, with none of d-separation's collider exception.

**Moralization** converts a DAG to an MRF: connect every pair of nodes sharing a child ("marry the parents"), then drop all arrow directions. The resulting undirected graph is a valid Markov blanket structure for the same distribution — but it has **lost** information. The v-structure \(A\to B\leftarrow C\) becomes a triangle, and the marginal independence \(A\perp C\) that the collider encoded is no longer readable from the undirected graph.

![The same three-node distribution as a DAG, after moralization, and as a factor graph: the directed form encodes a marginal independence that the moralized form cannot express.](../assets/directed-undirected-factor.svg)

This is one half of a symmetric limitation, stated in terms of **perfect maps** — graphs whose separations are exactly the distribution's independences:

- The v-structure \(A\to B\leftarrow C\) has a directed perfect map and **no** undirected one, since no undirected graph makes \(A\perp C\) while \(A\not\perp C\mid B\).
- The four-cycle with independences \(A\perp C\mid\{B,D\}\) and \(B\perp D\mid\{A,C\}\) has an undirected perfect map and **no** directed one, since any acyclic orientation creates a v-structure that asserts an independence the distribution lacks.

So neither family subsumes the other, and some distributions have no perfect map in either. **Factor graphs** are the neutral representation: a bipartite graph with one node per variable and one per factor, with edges to the variables that factor depends on. A factor graph records the factorization exactly, distinguishes \(\psi(a,b)\psi(b,c)\) from \(\psi(a,b,c)\) where an undirected graph cannot, and is the representation the message-passing algorithms of section 20 are actually defined on.

**Worked example — why inference code uses factor graphs.** The triangle \(A-B-C\) as an undirected graph is ambiguous between one three-way potential and three pairwise ones. The two have different parameter counts and different inference costs. A factor graph distinguishes them by construction, which is why libraries convert every model to one before running inference.

> **Practice — Foundation:** Moralize \(A\to B\leftarrow C\), where \(A,C\) are independent fair coins and \(B=A\lor C\). List the moral graph's edges, and verify numerically that \(A\perp C\) holds but fails given \(B=1\).
>
> **Hint:** Marrying the parents adds \(A-C\), which makes a triangle; compare \(P(A=1,C=1\mid B=1)=1/3\) with \(P(A=1\mid B=1)^2=(2/3)^2\).
>
> **Practice — Core:** Show that no undirected graph on \(\{A,B,C\}\) is a perfect map for the \(B=A\lor C\) example, and that every acyclic orientation of the 4-cycle \(A-B-C-D-A\) creates a v-structure, so the 4-cycle MRF has no directed perfect map.
>
> **Hint:** Encoding \(A\perp C\) forces the graph to omit \(A-C\) and to separate \(A\) from \(C\), which would also assert \(A\perp C\mid B\); an acyclic orientation of a 4-cycle has a sink whose two parents are not adjacent.
>
> **Practice — Stretch:** For three 10-state variables, compare one factor \(\psi(a,b,c)\) with three pairwise factors \(\psi_{AB}\psi_{BC}\psi_{AC}\): give both table sizes, draw both factor graphs, and say which one sum-product handles exactly.
>
> **Hint:** The table sizes are 1,000 and 300. The single factor gives a star-shaped (tree) factor graph, while the pairwise factors make the cycle \(A-f_{AB}-B-f_{BC}-C-f_{AC}-A\), although both undirected graphs are the same triangle.

## 20. Sum-product: inference as message passing

Inference means computing marginals \(p(v_j)\) or conditionals \(p(v_j\mid\text{evidence})\). Done naively this sums over all assignments of every other variable, at exponential cost. On a tree it can be done exactly in linear time by distributing the sum over the product.

The **sum-product algorithm** passes two kinds of messages on a factor graph. From a variable \(v\) to a factor \(f\):

$$
m_{v\to f}(v)=\prod_{g\in N(v)\setminus f}m_{g\to v}(v),
$$

and from a factor \(f\) to a variable \(v\):

$$
m_{f\to v}(v)=\sum_{\mathbf{u}\in N(f)\setminus v}f(v,\mathbf u)\prod_{u\in N(f)\setminus v}m_{u\to f}(u).
$$

A variable's marginal is the product of all incoming messages, normalized. On a tree, a leaves-to-root-to-leaves schedule computes every marginal exactly, and the whole computation is the distributive law applied systematically: \(\sum_b f(a,b)g(b,c)\) is computed once and reused rather than recomputed inside every outer sum.

Two variations worth knowing. Replacing the sum with a maximum gives **max-product**, which returns the most probable joint assignment rather than marginals — a different question with a different answer, since the vector of individually most probable values is generally not the most probable vector. Running the same updates on a graph **with cycles** gives loopy belief propagation: no guarantee of convergence or correctness, often useful in practice, and the entry point to the approximate-inference literature.

**Worked example — the marginals-versus-mode trap.** In a chain where each variable is individually most likely to be 0 but the joint most-probable configuration is all 1s, sum-product and max-product disagree completely. Reporting the marginal-wise argmax as "the model's prediction" is a common and silent error in structured prediction.

> **Practice — Foundation:** For the chain \(A-f_1-B-f_2-C\) with \(f_1(a,b)\) and \(f_2(b,c)\), write \(m_{f_2\to B}(b)\) and \(m_{B\to f_1}(b)\), and say which one contains the sum.
>
> **Hint:** The factor-to-variable message sums \(f_2(b,c)\,m_{C\to f_2}(c)\) over \(c\); the variable-to-factor message only multiplies the other incoming messages.
>
> **Practice — Core:** On the binary chain with \(\psi_{AB}=\begin{pmatrix}2&1\\1&2\end{pmatrix}\) and \(\psi_{BC}=\begin{pmatrix}3&1\\1&1\end{pmatrix}\) (rows index the first variable), compute \(p(B)\) and \(p(A)\) by sum-product and verify against brute-force enumeration.
>
> **Hint:** \(m_{A\to B}=(3,3)\) and \(m_{C\to B}=(4,2)\), so \(p(B)\propto(12,6)\); brute force over all 8 states gives \(Z=18\).
>
> **Practice — Stretch:** For three binary variables with \(P(111)=0.25\), \(P(100)=P(010)=P(001)=0.24\), \(P(000)=0.03\), and all other states 0, compute each \(P(X_j=1)\), the marginal-wise argmax and its joint probability, and the joint mode. Say which algorithm answers which question.
>
> **Hint:** \(P(X_1=1)=P(111)+P(100)=0.49\), so every marginal favours 0; compare \(P(000)=0.03\) with \(P(111)=0.25\).

## 21. Variable elimination and the cost of a graph

For general graphs, **variable elimination** is the basic exact algorithm. To compute \(p(q)\), pick an order for the non-query variables and eliminate them one at a time: multiply together all factors containing the variable, sum it out, and put the resulting factor back in the pool.

The correctness is just the distributive law. The cost is entirely in the **intermediate factors**: eliminating a variable creates a factor over all its neighbours in the current graph, and the running time is exponential in the largest such factor.

Formally, eliminating in a given order induces a chordal graph whose largest clique has size \(w+1\), where \(w\) is the **induced width** of that order. The minimum induced width over all orders is the **treewidth** of the graph, and exact inference costs \(O(p\cdot r^{w+1})\) for \(r\)-ary variables. Trees have treewidth 1; a \(\sqrt n\times\sqrt n\) grid has treewidth \(\Theta(\sqrt n)\), so exact inference on a \(100\times100\) grid is hopeless while a chain of any length is trivial.

Finding the optimal elimination order is NP-hard, and the standard heuristics are min-degree (eliminate the variable with fewest neighbours) and min-fill (eliminate the variable whose elimination adds the fewest new edges). Order choice matters enormously: on the same graph, a good order can be linear and a bad one exponential.

**Worked example — the order that changes everything.** In a star graph with one centre and \(m\) leaves, eliminating the leaves first produces only single-variable factors and costs \(O(m)\). Eliminating the centre first creates one factor over all \(m\) leaves, costing \(O(2^m)\). Same graph, same answer, and the difference between a millisecond and a millennium.

> **Practice — Foundation:** With binary factors \(\phi_1(A,B)=\begin{pmatrix}1&2\\3&4\end{pmatrix}\), \(\phi_2(B,C)=\begin{pmatrix}1&1\\2&0\end{pmatrix}\), and \(\phi_3(C,D)\), eliminate \(B\): compute \(\tau(A,C)\) and give its scope and table size.
>
> **Hint:** \(\tau(a,c)=\phi_1(a,0)\phi_2(0,c)+\phi_1(a,1)\phi_2(1,c)\), which is the matrix product \(\phi_1\phi_2\); \(\phi_3\) does not contain \(B\) and is left alone.
>
> **Practice — Core:** For the binary graph with edges \(A-B\), \(A-C\), \(A-D\), \(B-E\), \(C-E\), \(D-E\), compute the induced widths of the orders \((B,C,D,A,E)\) and \((A,B,C,D,E)\) and the largest intermediate table \(2^{w+1}\) for each.
>
> **Hint:** When you eliminate a node, connect all its current neighbours; the width is the largest neighbour count at elimination time (2 for the first order, 3 for the second).
>
> **Practice — Stretch:** Give a row-by-row elimination order for a \(k\times k\) grid with induced width \(k\), use it to state the treewidth of a \(3\times3\) grid, and compare the largest binary table for \(k=3\), \(k=100\), and a 10,000-node chain.
>
> **Hint:** Eliminating in row-major order keeps a frontier of about one row (\(k\) nodes) in every new factor; the largest tables are \(2^{4}\), \(2^{101}\), and \(2^2\).

## 22. Junction trees, and where exact inference dies

Variable elimination answers one query. Computing all marginals by rerunning it per variable repeats work; the **junction tree** algorithm organizes the computation once and answers every query.

The construction: moralize the graph if it was directed, **triangulate** it so every cycle longer than three has a chord, collect the maximal cliques as nodes, and connect them into a tree satisfying the **running intersection property** — every variable's cliques form a connected subtree. Message passing between cliques then proceeds exactly as sum-product, with each message a factor over the separator between two cliques. Two passes give calibrated marginals for every clique.

The cost is again exponential in the largest clique, which is the treewidth plus one. This is not an artifact of the algorithm: exact inference in general graphical models is #P-hard, so no method avoids the barrier in the worst case. The junction tree makes the cost explicit rather than fixing it.

When treewidth is too large, the options are the approximate methods the rest of the track covers: **variational inference** (lesson 14) restricts \(q\) to a tractable family and optimizes a bound; **MCMC** (lesson 09) samples instead of summing; **loopy belief propagation** runs the tree updates anyway and often works; and problem-specific structure — low rank, sparsity, symmetry, conditional Gaussianity — sometimes restores tractability exactly.

**Worked example — why a chain is the exception.** A hidden Markov model is a graphical model whose treewidth is 1, which is the entire reason forward–backward is linear in sequence length. Add a single long-range dependency between the first and last state and the treewidth jumps, the junction tree acquires a large clique, and exact inference becomes exponential in the added coupling.

> **Practice — Foundation:** Carry out the four junction-tree steps on the 4-cycle \(A-B-C-D-A\) (moralize, triangulate, collect maximal cliques, connect them), and name the cliques and the separator.
>
> **Hint:** The graph is already undirected; one chord \(A-C\) triangulates it, giving cliques \(\{A,B,C\}\) and \(\{A,C,D\}\) with separator \(\{A,C\}\).
>
> **Practice — Core:** Build a junction tree for the 5-cycle \(A-B-C-D-E-A\) by adding chords \(A-C\) and \(A-D\), list the cliques, connect them, and verify the running intersection property.
>
> **Hint:** The fan triangulation gives the chain \(\{A,B,C\}-\{A,C,D\}-\{A,D,E\}\); check that the cliques containing \(A\), \(C\), and \(D\) each form a connected subtree.
>
> **Practice — Stretch:** Take the potential \(\psi(u,v)=0\) if \(u=v=1\) and 1 otherwise on every edge of a binary MRF. Show that \(Z\) counts independent sets, compute \(Z\) for the 4-cycle, and use this to explain why exact inference is #P-hard in general. Name two structural assumptions that restore tractability.
>
> **Hint:** Each nonzero term of \(Z\) is an independent set; the 4-cycle has \(1+4+2=7\) of them. Counting independent sets is #P-complete, and bounded treewidth or Gaussian structure restores tractability.

## 23. Hidden Markov models: forward–backward is sum-product, Baum–Welch is EM

A **hidden Markov model** has latent states \(Z_{1:T}\) forming a Markov chain and observations \(X_t\) depending only on \(Z_t\):

$$
p(z_{1:T},x_{1:T})=p(z_1)\prod_{t=2}^{T}p(z_t\mid z_{t-1})\prod_{t=1}^{T}p(x_t\mid z_t).
$$

Its graph is a chain, so everything in this unit specializes to a clean algorithm.

**Forward recursion.** With \(\alpha_t(k)=p(x_{1:t},z_t=k)\),

$$
\alpha_1(k)=p(z_1=k)\,p(x_1\mid k),
\qquad
\alpha_t(k)=p(x_t\mid k)\sum_{j}\alpha_{t-1}(j)\,p(z_t=k\mid z_{t-1}=j),
$$

and \(p(x_{1:T})=\sum_k\alpha_T(k)\). The **backward** recursion \(\beta_t(k)=p(x_{t+1:T}\mid z_t=k)\) runs symmetrically, and the smoothed posterior is \(\gamma_t(k)\propto\alpha_t(k)\beta_t(k)\). These are precisely the sum-product messages on the chain, computed in a specific schedule.

**Scaling is mandatory.** \(\alpha_t\) is a joint probability over \(t\) observations, so it decays geometrically and underflows a float64 after a few hundred steps. Normalize \(\alpha_t\) to sum to one at each step, keep the scale factor \(c_t\), and recover \(\log p(x_{1:T})=\sum_t\log c_t\). The normalized \(\alpha\) is the filtered posterior \(p(z_t\mid x_{1:t})\), which is usually what you wanted anyway.

**Baum–Welch** is EM for this model. The E-step computes \(\gamma_t(k)\) and the pairwise posteriors \(\xi_t(j,k)=p(z_{t-1}=j,z_t=k\mid x_{1:T})\) by forward–backward; the M-step re-estimates the initial distribution, the transition matrix as normalized \(\sum_t\xi_t(j,k)\), and the emission parameters as \(\gamma\)-weighted fits. Every property from sections 7 to 12 applies unchanged: monotone likelihood, local optima, label switching across states, and an unbounded likelihood if the emissions are Gaussian with free variances.

Finally, **Viterbi** replaces the sum with a max in the forward recursion and returns the single most probable state path — the max-product specialization, answering the different question flagged in section 20.

**Worked example — filtering versus smoothing.** For a monitoring system, \(p(z_t\mid x_{1:t})\) is what you can compute online and act on. \(p(z_t\mid x_{1:T})\) uses future observations and is strictly better informed, and is the right quantity for a retrospective incident analysis. Reporting the smoothed state as if it had been available in real time overstates what the detector could have done.

> **Practice — Foundation:** For an HMM with \(p(z_1)=(0.5,0.5)\), \(A=\begin{pmatrix}0.9&0.1\\0.2&0.8\end{pmatrix}\), \(P(x=1\mid z)=(0.8,0.1)\), and observations \((1,1)\), compute \(\alpha_1\), \(\alpha_2\), and \(p(x_{1:2})\), identifying the emission and transition factors.
>
> **Hint:** \(\alpha_1=(0.4,0.05)\); \(\alpha_2(k)=P(x_2=1\mid k)\sum_j\alpha_1(j)A_{jk}\), so first form the predicted mass \((0.37,0.08)\).
>
> **Practice — Core:** For the same HMM, run the scaled recursion, and show the normalized \(\alpha_t\) is the filtered posterior \(p(z_t\mid x_{1:t})\) and that \(c_1c_2=p(x_{1:2})\).
>
> **Hint:** By induction, if \(\hat\alpha_{t-1}=p(z_{t-1}\mid x_{1:t-1})\), the unnormalized update is \(p(x_t,z_t\mid x_{1:t-1})\) and sums to \(c_t\); here \(c_1=0.45\) and \(c_2\approx0.6756\).
>
> **Practice — Stretch:** The summed pairwise posteriors are \(\sum_t\xi_t(j,k)=\begin{pmatrix}12.4&1.6\\2.0&8.0\end{pmatrix}\). Derive the Baum–Welch transition update from \(Q\) with row constraints, compute the new matrix, and state which EM guarantee it inherits.
>
> **Hint:** The transition part of \(Q\) is \(\sum_{j,k}(\sum_t\xi_t(j,k))\log A_{jk}\), and one Lagrange multiplier per row normalizes each row of expected counts: row 1 becomes \((12.4,1.6)/14\).

## 24. Diagnosing latent-structure models

Latent-variable fits fail quietly, because they always return something. A short checklist, ordered by how often it catches the problem:

1. **Monotone likelihood.** Assert it every iteration. A decrease is a bug, always.
2. **Multiple restarts.** Report the spread of final log-likelihoods, not just the best. A wide spread means the surface is rough and any single fit is arbitrary.
3. **Degeneracy watch.** Monitor the smallest \(N_k\) and the smallest variance. A component with \(N_k<2\) is not a component.
4. **Label-invariant reporting.** Sort components canonically; for posterior summaries, report only invariant functionals.
5. **Held-out likelihood.** The only honest comparison across component counts and model families.
6. **Stability of the partition.** Refit on bootstrap resamples and compare the induced clusterings. Unstable partitions do not support substantive claims about groups.
7. **Assumption residuals.** For latent class models, check within-class correlations; for mixtures, check within-component fit rather than only the overall density.
8. **Uncertainty from the observed information.** Never from the completed data.
9. **Identifiability sanity check.** Count parameters against what the marginal can determine, especially with few indicators per class.
10. **Inference cost before model choice.** If the graph's treewidth makes exact inference infeasible, decide which approximation you will use *before* fitting, since the approximation becomes part of the model.

**Worked example — a fit that passed every plot and failed every check.** A five-component mixture reproduced the marginal histogram beautifully. Restarts spanned 90 nats of log-likelihood, two components held fewer than three effective observations, and bootstrap refits produced unrecognizable partitions. The density estimate was fine; every sentence written about "the five user types" was unsupported.

> **Practice — Foundation:** A \(K=4\) fit reports \(N_k=(412.3,389.0,197.7,1.0)\), \(\sigma_k^2=(1.1,0.9,2.3,4\times10^{-11})\), and restart log-likelihoods \(\{-2101.4,-2101.5,+1.8\times10^4\}\). Name three checks that detect the collapsed component and what each one flags here.
>
> **Hint:** Check the smallest \(N_k\) (below 2), the smallest variance relative to the data scale, and whether the best 'log-likelihood' comes from a spike rather than a cluster of agreeing restarts.
>
> **Practice — Core:** Twenty restarts end at: 12 at \(\ell=-3050.2\pm0.1\), 5 at \(-3061.8\), and 3 collapsed (\(N_{\min}<2\)). Design the restart protocol that produced this, and write the report you would give.
>
> **Hint:** Report the seeding scheme, the share reaching the best basin (12/20), the gap to the next basin (11.6 nats), the discarded collapses, and whether the top fits agree on sorted parameters.
>
> **Practice — Stretch:** Fit \(K=3\) Gaussians to \(n=1000\) draws from Gamma(2,1). Explain how you would show that a KS test against the fitted density passes while bootstrap refits (\(B=20\)) give unstable sorted means, and say which claims each diagnostic licenses.
>
> **Hint:** Goodness of fit licenses only density claims; a stable partition across resamples is a necessary condition for any 'three groups' claim, and here it should fail because the data has one skewed group.

## 25. Runnable labs

This chapter has three coding exercises. Each opens as a separate tab in the lesson's right-hand Python workspace.

### Lab A — one EM step for a Gaussian mixture

Implement **em_step_gaussian_mixture** in [labs/exercises.py](../../labs/exercises.py). Given one-dimensional observations and current weights, means, and variances, return:

1. the incomplete-data log likelihood at the **input** parameters;
2. the updated weights;
3. the updated means;
4. the updated variances, computed around the updated means.

Run:

~~~text
python -m labs.checks em-step
~~~

The checks cover identical components as a fixed point, well-separated components where responsibilities are effectively hard, monotone log-likelihood across repeated steps, a separation large enough that naive exponentiation would underflow, generators, input preservation, and invalid weights, variances, or lengths.

### Lab B — the scaled forward algorithm

Implement **hmm_forward** in [labs/exercises.py](../../labs/exercises.py). Given an initial state distribution, a row-stochastic transition matrix, and per-step emission likelihoods, return the log likelihood of the observation sequence and the final filtered state distribution.

Run:

~~~text
python -m labs.checks hmm-forward
~~~

The checks cover a single-state chain, a uniform chain whose answer is a product of mixture terms, a deterministic alternating chain, a two-thousand-step sequence that underflows without scaling, an impossible observation that must be rejected, generators, input preservation, and non-stochastic or mismatched inputs.

### Lab C — deciding d-separation

Implement **d_separated** in [labs/exercises.py](../../labs/exercises.py). Given the edges of a DAG, a source, a target, and a conditioning set, return whether every path between source and target is blocked under the two blocking rules from lesson 16 §6.

Run:

~~~text
python -m labs.checks d-separation
~~~

The checks cover chains, forks, and colliders with and without conditioning, a collider opened by a descendant, the M-bias graph, a graph where one of two paths is blocked and the other is not, generators, input preservation, and invalid inputs including a cycle, an unknown node, and a conditioned endpoint.

### Guided experiment

1. Simulate a two-component mixture, run EM from ten random starts, and plot the spread of final log-likelihoods.
2. Verify monotonicity numerically, then deliberately use the old mean in the variance update and watch it break.
3. Sweep component separation from 0.5 to 5 standard deviations and plot iterations-to-convergence against the fraction of missing information.
4. Force a variance collapse, then repair it with a floor and with an inverse-gamma prior, and compare the fits.
5. Run an MCMC sampler on a two-component mixture and demonstrate label switching in the trace plots.
6. Compare AIC, BIC, and held-out likelihood for component counts 1 through 8 on data generated from three components.
7. Take the same data through K-means and a full-covariance mixture, and construct a dataset where they disagree.
8. Right-censor a Gaussian sample, then compare naive substitution of the censoring point against EM.
9. Moralize a v-structure and confirm numerically that the marginal independence is no longer readable from the undirected graph.
10. Run variable elimination on a star graph under both elimination orders and measure the intermediate factor sizes.
11. Implement forward–backward, verify it against brute-force enumeration on a short chain, then run it on a long chain without scaling and observe the underflow.
12. Implement Baum–Welch on simulated sequences and confirm the monotone likelihood and the recovery of transition structure up to state permutation.

## 26. Derivations to own

1. Derive the mixture mean and variance, identifying the between-component term as the law of total variance.
2. Derive the responsibility formula from Bayes' rule and show the responsibilities sum to one.
3. Derive the mixture score with respect to a component mean and show the weights are responsibilities.
4. Derive the E-step from the ELBO by showing the KL term is minimized at the exact posterior.
5. Derive the M-step objective \(Q\) and explain why the expectation moves outside the logarithm.
6. Derive all three Gaussian-mixture M-step updates, including the Lagrange multiplier for the weights.
7. Prove EM monotonicity in three lines from the ELBO decomposition.
8. Derive the \(Q\)-plus-KL difference identity for the likelihood increment.
9. State the missing information principle and derive the EM convergence rate from it.
10. Show the Gaussian mixture likelihood is unbounded, and derive the MAP-EM variance update that removes the spike.
11. Show a two-component Bernoulli mixture on one binary variable is not identifiable.
12. Derive K-means as the zero-variance limit of EM for a spherical equal-weight mixture.
13. Derive the EM updates for a Gaussian sample with right-censored observations.
14. Derive the latent class M-step as a responsibility-weighted frequency.
15. State Hammersley–Clifford and derive the MRF log-likelihood gradient, identifying the term requiring inference.
16. Moralize a v-structure and prove the marginal independence is not represented in the moral graph.
17. Derive both sum-product message updates and verify exactness on a chain.
18. Derive the cost of variable elimination in terms of induced width, and show that treewidth is the minimum induced width over all elimination orders.
19. Derive the forward recursion, the scaling identity \(\log p(x_{1:T})=\sum_t\log c_t\), and the filtered-posterior interpretation.
20. Derive the Baum–Welch transition update from the pairwise posteriors.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-latent
```

## 27. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–7. Compute mixture and graph quantities directly.

**A1 · Foundation · paper — Mixture moments.** Compute mean, variance, and modality for \(0.5N(-2,1)+0.5N(2,1)\), \(0.9N(0,1)+0.1N(6,1)\), and \(0.5N(0,1)+0.5N(0,4)\). Confirm modality numerically from the density rather than equating components with modes.

**A2 · Foundation · paper — Responsibilities.** For \(x=(-3,-1,0,1,3)\), \(\pi=(0.4,0.6)\), \(\mu=(-1,2)\), and unit component variances, compute every responsibility using log-sum-exp and verify each row sums to one.

**A3 · Foundation · paper — One EM step.** For \(x=(-2,-1.5,-1,1,1.5,2)\), initialize \(\pi=(0.5,0.5)\), \(\mu=(-0.5,0.5)\), and variances \((1,1)\). Perform one E-step and M-step, using the new means in the variance updates, and report observed log likelihood before and after.

**A4 · Foundation · paper — Factorization.** For binary DAG edges \(A\to C,B\to C,C\to D,C\to E,D\to F,E\to F\), write the joint factorization and count free conditional-probability parameters node by node.

**A5 · Foundation · paper — Separation.** In the undirected graph with edges \(A-B,B-C,C-D,B-E,E-D\), decide \(A\perp D\mid S\) for \(S=\varnothing,\{B\},\{C\},\{B,C\},\{C,E\}\).

**A6 · Foundation · paper — Forward recursion.** Use initial state probabilities \((0.6,0.4)\), transition matrix \(\begin{pmatrix}.7&.3\\.2&.8\end{pmatrix}\), emission probabilities \(P(1\mid z)=(.9,.3)\), and observations \((1,0)\). Run two scaled forward steps and recover the log likelihood from the scale factors.

**A7 · Foundation · paper — Elimination.** With binary factors \(\phi_1(A,B),\phi_2(B,C),\phi_3(B,D),\phi_4(C,D)\), eliminate \(B\) and then \(C\). Write the product and sum at each step and record every intermediate scope and table size.

### Core — problems 8–16. Connect algorithms, guarantees, and diagnostics.

**A8 · Core · paper — Monotonicity in code.** For \(x=(-2,-1.5,-1,1,1.5,2)\), start from \(\pi=(0.5,0.5)\), \(\mu=(-3,3)\), \(\sigma^2=(1,1)\) and run six EM iterations, logging the observed log likelihood at each iteration's input parameters and asserting it never decreases. Then rerun with each bug in turn: (a) the variance update uses the old means; (b) the E-step skips the division by the row sum (with \(\pi_k=N_k/\sum_jN_j\)); (c) the log likelihood is logged after the update instead of before. For each bug, say whether the assertion fires, and name a check that catches the bugs it misses.

**A9 · Core · paper — Local optima.** For \(x=(0,1,2,6,7,8,12,13,14)\) with \(\pi=(0.5,0.5)\) and unit variances held fixed, run means-only EM from every start \((\mu_1,\mu_2)\in\{0,3,6,9,12,15\}^2\) until the means move less than \(10^{-12}\). Group the 36 starts by the fixed point reached (sorted means), report each fixed point's log likelihood, classify it as a local maximum or a saddle using the Hessian, and say which basin a single grid start most often lands in.

**A10 · Core · paper — Missing information.** For \(d\in\{0.5,1,1.5,2.5\}\), build the deterministic sample \(x=\{-d+z_j\}\cup\{d+z_j\}\) with \(z_j=\Phi^{-1}((j-0.5)/50)\), \(j=1,\dots,50\) (\(n=100\)). With \(\pi=(0.5,0.5)\) and unit variances fixed, run means-only EM from \(\mu=(-2,1)\) until both means move less than \(10^{-8}\). Report the iterations, the EM rate (largest eigenvalue of the EM map's Jacobian at the fixed point), and the observed-information SE of \(\hat\mu_1\) against the complete-data SE \(1/\sqrt{50}\approx0.141\).

**A11 · Core · paper — Degeneracy.** For \(x=(-1.2,-0.4,0.3,1.1,5.0)\), start EM at \(\pi=(0.8,0.2)\), \(\mu=(0,5)\), \(\sigma^2=(1,1)\). Run it (a) with free variances, (b) with a floor \(\sigma_k^2\ge0.01\), (c) with an inverse-gamma\((2,0.5)\) prior, whose MAP update is \(\sigma_k^2=(S_k+1)/(N_k+6)\), and (d) with one tied variance. Report the final \(\pi\), \(\mu\), \(\sigma^2\), and log likelihood for each, and state what each remedy changes about the estimand.

**A12 · Core · paper — Label switching.** For \(x=(-3.5,-3,-2.5,2.5,3,3.5)\) and the model \(0.5N(\mu_1,1)+0.5N(\mu_2,1)\) with independent \(N(0,10^2)\) priors, compute the posterior of \((\mu_1,\mu_2)\) on the grid \([-7,7]^2\) with step 0.02. Report \(E[\mu_1]\), \(E[\mu_2]\), \(\operatorname{sd}(\mu_1)\), and \(P(\mu_1<\mu_2)\), then three invariant summaries: \(E[\min(\mu_1,\mu_2)]\) and \(E[\max(\mu_1,\mu_2)]\), the posterior predictive density at \(x=0\) and \(x=3\), and the probability that \(x=-3.5\) shares a component with \(x=-2.5\) and with \(x=2.5\).

**A13 · Core · paper — Model selection.** On \(n=400\) training points, Gaussian mixtures with \(K=1,\dots,5\) (\(p=3K-1\)) reach \(\ell_K=(-1012.4,-951.7,-940.2,-937.9,-936.1)\), and they score \((-1015.0,-957.3,-947.9,-948.4,-950.6)\) on 400 held-out points. Parametric-bootstrap 95th percentiles of the LR statistic are 10.2 for \(K=2\) vs 3 (simulated under the fitted \(K=2\)) and 9.6 for \(K=3\) vs 4. Compute AIC, BIC, and the two LR statistics, choose \(K\) under each criterion, and compare the bootstrap cutoffs with the naive \(\chi^2_3\) cutoff 7.81.

**A14 · Core · paper — K-means limit.** For \(x=(0,1,2,6,7,12)\), run Lloyd's algorithm from centroids \((1,7)\). Then run means-only EM (equal weights, a fixed shared variance \(\sigma^2\)) from the same start for \(\sigma^2\in\{25,16,9,4,1,0.25\}\). Report the converged means, the component-1 responsibility of \(x=6\), and the iteration count, and say where EM matches Lloyd's and where it diverges.

**A15 · Core · paper — Censoring.** Take the ten values \(x_i=20+10\,\Phi^{-1}((i-0.5)/10)\), which to two decimals are \((3.55,9.64,13.26,16.15,18.74,21.26,23.85,26.74,30.36,36.45)\), and right-censor them at \(c=25\), so the last three are recorded as \(25^+\). Estimate \(\mu\), \(\sigma\), and the 90th percentile \(\mu+1.2816\sigma\): (a) from the uncensored values, (b) by substituting 25 for the censored ones, and (c) by EM for the censored normal likelihood started at \(\mu=20\), \(\sigma^2=100\). Report the bias of (b) and (c) relative to (a).

**A16 · Core · paper — Sum-product.** A binary tree has edges \(A-B\), \(B-C\), \(B-D\) with potentials \(\psi_{AB}=\begin{pmatrix}3&1\\1&2\end{pmatrix}\), \(\psi_{BC}=\begin{pmatrix}2&1\\1&1\end{pmatrix}\), \(\psi_{BD}=\begin{pmatrix}1&2\\2&1\end{pmatrix}\) (rows index the first-named variable). Compute every single-node marginal by one inward and one outward sum-product pass with root \(B\), and verify each against brute-force enumeration of the 16 states.

### Stretch — problems 17–24. Analyze structure, identifiability, and cost.

**A17 · Stretch · paper — Unbounded likelihood.** For \(x=(0,1,2,3,4)\) and a 2-component model with \(\pi=(0.2,0.8)\), \(\mu_2=2\), \(\sigma_2^2=2\) fixed, set \(\mu_1=0\) and evaluate \(\ell\) at \(\sigma_1=1,0.1,0.01,0.001\). Then characterize every direction in which a \(K\)-component Gaussian mixture's likelihood diverges on these five points, and explain why random restarts alone cannot fix the problem.

**A18 · Stretch · paper — Identifiability.** Take two equal-weight classes with \(\theta_1=(0.8,0.7)\) and \(\theta_2=(0.2,0.3)\) on two binary indicators. Compute the exact cell probabilities, run population EM (the cell probabilities as weights) from five random starts, and show the fits reach the same log likelihood at different parameters. Then add a third indicator with \(\theta_{13}=0.9\), \(\theta_{23}=0.1\), repeat, and show all fits agree up to a label swap. Explain both results by counting parameters against free cells.

**A19 · Stretch · paper — Overfitted order.** Data come from \(N(0,1)\) and you fit \(p(x)=(1-\pi)\varphi(x)+\pi\varphi(x-\mu)\) with unit variances. Show that every point of \(\{\pi=0\}\cup\{\mu=0\}\) reproduces the true law exactly, and compute the Fisher information matrix in \((\pi,\mu)\) at \((\pi,\mu)=(0,1)\) and at \((0.5,0)\). Show both matrices are singular, and explain what this does to the usual \(\sqrt n\) asymptotics and to the LR test.

**A20 · Stretch · paper — Conditional independence violation.** Two equal-weight classes have four binary indicators with \(P(x_d=1)\) equal to 0.8 in class 1 and 0.2 in class 2, except that within each class \(x_2\) copies \(x_1\) with probability \(\rho\) and is otherwise drawn from the class rate. For \(\rho\in\{0,0.3,0.6,0.9\}\), use the exact cell probabilities as data with \(n=2000\) (expected counts), fit latent class models with \(K=1,2,3\) by EM (4 random starts each), and report the BIC for each \(K\) and the selected \(K\). Describe what the spurious class represents at \(\rho=0.9\).

**A21 · Stretch · paper — Perfect maps.** (i) Let \(A,C\) be independent fair coins and \(B=A\lor C\). (ii) Let \((A,B,C,D)\in\{-1,1\}^4\) have \(p\propto\exp(AB+BC+CD+DA)\). For (i), verify \(A\perp C\) and \(A\not\perp C\mid B\) numerically, and prove that no undirected graph is a perfect map. For (ii), verify \(A\perp C\mid\{B,D\}\) at \(B=D=1\), compute \(E[AC]\) to show \(A\not\perp C\), and prove that no DAG is a perfect map.

**A22 · Stretch · paper — Treewidth.** Number the \(3\times3\) grid 1–9 in row-major order, and take the 9-node chain 1–2–…–9. For each graph, run min-degree and min-fill elimination (breaking ties by smallest label) and record the order, the induced width, and the largest intermediate factor. Confirm the grid's treewidth by brute force over all \(9!\) orders, and predict the binary table size \(2^{w+1}\) for \(k\times k\) grids with \(k=10\) and \(k=100\).

**A23 · Stretch · paper — Marginals versus mode.** On the binary chain \(x_1-x_2-x_3\), let \(p(x)\propto\prod_ju(x_j)\prod_j\psi(x_j,x_{j+1})\) with \(u(0)=2\), \(u(1)=1\), \(\psi(0,0)=3\), \(\psi(1,1)=8\), and \(\psi(0,1)=\psi(1,0)=1\). Compute \(Z\), every marginal \(P(x_j=1)\), the marginal-wise argmax and its joint probability, and the max-product (Viterbi) path and its probability, and quantify the gap.

**A24 · Stretch · paper — Complete latent-structure study.** Use the twelve eruption-style durations \(x=(1.8,2.0,2.1,2.3,2.4,3.9,4.1,4.3,4.4,4.5,4.7,4.8)\). Fit Gaussian mixtures with \(K=1,2,3\) and free variances floored at 0.01, from five starts per \(K\) with means placed at data values. Report the spread of final log likelihoods, the smallest effective count, and BIC. For the chosen \(K\), compute observed-information SEs of the means by a numerical Hessian and compare them with completed-data SEs \(\sigma_k/\sqrt{N_k}\), then refit leaving out each point in turn to measure stability. Finish with two sentences separating the claims the fit supports from those it does not.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** Are mixture component labels identifiable without a convention?

**K2 · Core · gate — Derivation.** Derive the responsibility in a finite mixture.

**K3 · Core · gate — Calculation.** Two equally weighted N(−1,1) and N(1,1) components are evaluated at x=0. Find the responsibility of the first.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-latent experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does monotone EM likelihood guarantee a finite global maximum?

**K6 · Stretch · gate — RE/RS transfer.** Audit a latent-state sequence model.

## Mastery check

Given an unfamiliar latent-variable model, write its complete- and incomplete-data likelihoods; identify whether the posterior over latents is tractable and therefore whether EM or variational inference applies; derive the E-step and M-step and prove the resulting monotonicity; predict convergence speed from the fraction of missing information; detect and repair unbounded-likelihood degeneracies; distinguish label switching from genuine non-identifiability and report accordingly; choose a component count without misusing a likelihood-ratio test; draw the model as a directed, undirected, and factor graph and say what each conversion loses; predict exact-inference cost from treewidth before writing code; and state which claims the fit supports and which it does not.

The next advanced statistics unit should develop nonparametric and order statistics — empirical CDF theory with Glivenko–Cantelli and DKW, order statistics and extreme values, rank-based tests, kernel density estimation with its bandwidth-bias tradeoff, and Rao–Blackwellization. Those tools answer the question this unit repeatedly deferred: what can be estimated when no parametric family is assumed at all.
