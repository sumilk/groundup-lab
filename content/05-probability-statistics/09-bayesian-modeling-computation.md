---
id: math.statistics.bayesian-modeling-computation
title: Bayesian modeling, posterior prediction, importance sampling, and MCMC
prerequisites: [math.statistics.resampling-sequential-experimental-design, math.probability.multivariate-gaussian-geometry]
answers: ps-09-bayesian-modeling-computation
estimated_hours: 44
---

# Bayesian modeling, posterior prediction, importance sampling, and MCMC

Bayesian inference treats unknown quantities as part of a joint probability model. Before observing data, uncertainty about parameters is represented by a prior distribution. The likelihood connects parameters to possible observations. Conditioning the joint model on observed data produces a posterior distribution.

That compact description hides the hard work. A posterior is only as meaningful as its sampling model, prior, parameterization, and computation. A narrow posterior can be precisely wrong under selection bias or misspecification. A sophisticated sampler can faithfully explore an irrelevant model. Bayesian workflow therefore joins modeling, computation, criticism, and decisions.

This chapter starts with finite Bayes' rule and builds toward continuous posterior geometry, hierarchical partial pooling, posterior predictive checks, importance sampling, and Markov chain Monte Carlo. By the end, you should be able to write a generative model; derive conjugate updates; distinguish posterior, predictive, and likelihood quantities; perform prior and posterior predictive checks; calculate posterior decisions; stabilize importance weights; implement Metropolis–Hastings; diagnose effective sample size and convergence; and audit Bayesian claims in AI research.

## 0. Bayes' rule updates possibilities

For a discrete unknown hypothesis \(H\) and observed data \(D=d\),

$$
P(H=h\mid D=d)
=
\frac{P(D=d\mid H=h)P(H=h)}
{\sum_{h'}P(D=d\mid H=h')P(H=h')}.
$$

The pieces have different roles:

- \(P(H=h)\) is the **prior** probability;
- \(P(D=d\mid H=h)\) is the **likelihood** of \(h\) for fixed observed data;
- the denominator is the **prior predictive probability** or **evidence** for the data;
- \(P(H=h\mid D=d)\) is the **posterior** probability.

The likelihood is a function of \(h\) after data are fixed. It is not generally a probability distribution over \(h\). Multiplying prior by likelihood and dividing by the evidence makes a normalized posterior.

In odds form,

$$
\frac{P(H_1\mid d)}{P(H_0\mid d)}
=
\frac{P(H_1)}{P(H_0)}
\times
\frac{P(d\mid H_1)}{P(d\mid H_0)}.
$$

Posterior odds equal prior odds times the likelihood ratio. Evidence changes odds multiplicatively.

**Worked example — rare incidents.** A monitor has 90% sensitivity and a 5% false-alarm rate. If only 0.1% of sessions contain the incident, posterior odds after an alert are

$$
\frac{0.001}{0.999}\times\frac{0.90}{0.05}
\approx0.018.
$$

The posterior probability is about \(0.018/(1+0.018)\approx1.77\%\). A large likelihood ratio does not erase a very small base rate.

> **Practice — Foundation:** A jar holds either a fair coin or a two-headed coin, each with prior probability \(1/2\). One toss lands heads. Label the prior, likelihood, evidence, and posterior, and compute \(P(\text{two-headed}\mid\text{heads})\).
>
> **Hint:** The likelihoods of heads are \(1\) and \(0.5\), so the evidence is \(0.5(1)+0.5(0.5)=0.75\); divide the two-headed product \(0.5\) by it.
>
> **Practice — Core:** Recalculate the monitoring example if prevalence rises to 2%, then explain the change before interpreting it.
>
> **Hint:** Prior odds become \(0.02/0.98\); multiply by the unchanged likelihood ratio \(0.90/0.05=18\) and convert odds \(o\) to probability \(o/(1+o)\).
>
> **Practice — Stretch:** Keep the likelihood ratio at \(18\). Compute the posterior probability of an incident for prior probabilities \(0.001\) and \(0.10\), then find the prior probability at which the posterior is exactly \(0.5\).
>
> **Hint:** Posterior odds equal prior odds times 18, so a posterior of 0.5 (odds 1) requires prior odds \(1/18\).

## 1. A Bayesian model is a joint distribution

Let \(\theta\) be an unknown parameter and \(Y\) observed data. A basic model factorizes as

$$
p(\theta,y)=p(\theta)p(y\mid\theta).
$$

This factorization is generative:

1. draw a possible parameter \(\theta\sim p(\theta)\);
2. draw possible data \(Y\sim p(y\mid\theta)\).

After observing \(Y=y\), conditioning gives

$$
p(\theta\mid y)
=
\frac{p(y\mid\theta)p(\theta)}
{\int p(y\mid\vartheta)p(\vartheta)\,d\vartheta}.
$$

The denominator does not depend on \(\theta\), so derivations often begin with

$$
p(\theta\mid y)\propto p(y\mid\theta)p(\theta).
$$

Proportionality identifies the posterior kernel, not its normalizing constant. Expectations and probabilities still require normalization, either analytically or computationally.

**Worked example — model accuracy.** Let \(p\) be accuracy on a defined prompt population, \(p\sim\operatorname{Beta}(\alpha,\beta)\), and \(X_i\mid p\overset{\mathrm{iid}}{\sim}\operatorname{Bernoulli}(p)\). This model says more than “accuracy is unknown.” It says how prior mass is distributed, how prompts are sampled, that their outcomes are conditionally iid given \(p\), and that one stable \(p\) governs them.

> **Practice — Foundation:** Let \(\theta\in\{0.2,0.8\}\) with prior \((0.5,0.5)\) and \(Y\mid\theta\sim\operatorname{Bernoulli}(\theta)\). Write the \(2\times2\) joint table \(p(\theta,y)\), then compute \(p(Y=1)\) and \(p(\theta=0.8\mid Y=1)\).
>
> **Hint:** Each cell is prior times likelihood, e.g. \(p(0.8,1)=0.5\times0.8\); conditioning on \(Y=1\) divides that column by its sum.
>
> **Practice — Core:** For \(\mu\sim\mathcal N(0,2^2)\) and \(Y_1,Y_2\mid\mu\overset{\mathrm{iid}}{\sim}\mathcal N(\mu,1)\), write the two-step data-generating story and derive \(E[Y_1]\), \(\operatorname{Var}(Y_1)\), and \(\operatorname{Cov}(Y_1,Y_2)\).
>
> **Hint:** Use total variance \(\operatorname{Var}(Y_1)=E[\operatorname{Var}(Y_1\mid\mu)]+\operatorname{Var}(E[Y_1\mid\mu])\); the covariance comes only from the shared \(\mu\).
>
> **Practice — Stretch:** A benchmark reports 170/200 correct: 95/100 on task A and 75/100 on task B. Under one iid Bernoulli rate \(p=0.85\), compute the standard deviation of the task-A minus task-B accuracy gap and compare it with the observed gap; then name three assumptions of the iid model and propose a two-rate or hierarchical alternative.
>
> **Hint:** Under a common \(p\) the gap has SD \(\sqrt{2(0.85)(0.15)/100}\approx0.050\), so the observed gap of 0.20 is about four SDs.

## 2. Priors are model components, not decorations

A prior must be interpreted on the model's parameter scale. It can encode:

- domain knowledge available before the current data;
- population regularity shared across related groups;
- weak constraints that rule out impossible or numerically pathological regions;
- a reference distribution chosen for an explicit calibration goal.

Priors can be informative, weakly informative, or intentionally diffuse, but “flat” is not invariant to reparameterization. A density uniform in \(p\) is not uniform in log odds

$$
\eta=\log\frac{p}{1-p}.
$$

Improper priors do not integrate to one. They can sometimes produce proper posteriors, but they have no prior predictive distribution and can make model evidence undefined.

Before fitting, simulate from the **prior predictive distribution**

$$
p(y)=\int p(y\mid\theta)p(\theta)\,d\theta.
$$

If it routinely generates impossible datasets, the model needs revision before observed outcomes influence judgment.

**Worked example — accuracy prior.** A \(\operatorname{Beta}(1,1)\) prior is uniform in probability and gives substantial mass to accuracies near zero and one. For a competent model on a balanced binary task, that may be less plausible than it first sounds. A prior predictive check asks what success counts this choice produces at the planned sample size.

> **Practice — Foundation:** If \(p\sim\operatorname{Uniform}(0,1)\), the log odds \(\eta=\log(p/(1-p))\) has density \(e^\eta/(1+e^\eta)^2\). Evaluate it at \(\eta=0\) and \(\eta=3\) and explain why the prior is not flat in log odds.
>
> **Hint:** Change variables with \(dp/d\eta=p(1-p)\); at \(\eta=0\) this is \(0.5\cdot0.5\).
>
> **Practice — Core:** Derive \(P(X=1)\) for one Bernoulli observation under a \(\operatorname{Beta}(\alpha,\beta)\) prior, then give the prior predictive mean and variance of the success count \(S\) in \(n=10\) trials under \(\operatorname{Beta}(2,8)\) and compare the variance with \(\operatorname{Binomial}(10,0.2)\).
>
> **Hint:** \(E[X]=E[E[X\mid p]]=E[p]\); for \(S\) use total variance \(nE[p(1-p)]+n^2\operatorname{Var}(p)\).
>
> **Practice — Stretch:** Latency in milliseconds is modeled as \(\log L\sim\mathcal N(\mu,\sigma^2)\) with priors \(\mu\sim\mathcal N(5,2^2)\) and \(\sigma\sim\operatorname{HalfNormal}(1)\). Compute the prior probability that the median latency \(e^\mu\) is below 10 ms, the median latency at the prior 97.5% quantile of \(\mu\), and the p99-to-median ratio \(e^{2.326\sigma}\) at \(\sigma=2\); name two simulated features that would trigger revision.
>
> **Hint:** Work on the log scale: \(P(e^\mu<10)=\Phi((\log10-5)/2)\), and quantiles of \(\mu\) map to medians through \(\exp\).

## 3. Beta–Bernoulli conjugacy makes updating visible

For

$$
p\sim\operatorname{Beta}(\alpha,\beta),
\qquad
X_i\mid p\overset{\mathrm{iid}}{\sim}\operatorname{Bernoulli}(p),
$$

observe \(s=\sum_iX_i\) successes and \(f=n-s\) failures. The prior density kernel is

$$
p^{\alpha-1}(1-p)^{\beta-1},
$$

and the likelihood kernel is

$$
p^s(1-p)^f.
$$

Multiplication yields

$$
p\mid x
\sim
\operatorname{Beta}(\alpha+s,\beta+f).
$$

The prior and posterior share a family, so the prior is **conjugate** to the likelihood.

![A posterior combines prior shape and likelihood information, then normalizes the product.](../assets/bayesian-update.svg)

The posterior mean and variance are

$$
E[p\mid x]
=
\frac{\alpha+s}{\alpha+\beta+n},
$$

$$
\operatorname{Var}(p\mid x)
=
\frac{(\alpha+s)(\beta+f)}
{(\alpha+\beta+n)^2(\alpha+\beta+n+1)}.
$$

The mean is a weighted average:

$$
E[p\mid x]
=
\frac{\alpha+\beta}{\alpha+\beta+n}
\frac{\alpha}{\alpha+\beta}
+
\frac{n}{\alpha+\beta+n}\frac{s}{n}.
$$

Thus \(\alpha+\beta\) behaves like a prior information weight and \(\alpha/(\alpha+\beta)\) like its center. This is an interpretation of the algebra, not proof that the prior came from literal observations.

**Worked example.** With prior \(\operatorname{Beta}(2,2)\) and \(8\) successes in \(10\) trials, the posterior is \(\operatorname{Beta}(10,4)\), its mean is \(10/14\approx0.714\), and the next-trial success probability is also \(10/14\).

> **Practice — Foundation:** Update a \(\operatorname{Beta}(3,7)\) prior after 12 successes and 8 failures.
>
> **Hint:** Add successes and failures to the corresponding Beta parameters.
>
> **Practice — Core:** For the \(\operatorname{Beta}(3,7)\) prior with 12 successes in 20 trials, write \(E[p\mid x]=w\cdot\frac{\alpha}{\alpha+\beta}+(1-w)\frac sn\), find \(w\), and verify that the result equals \(15/30\).
>
> **Hint:** Split \((\alpha+s)/(\alpha+\beta+n)\) into \(\alpha/(\alpha+\beta+n)+s/(\alpha+\beta+n)\), then multiply and divide by \(\alpha+\beta\) and by \(n\).
>
> **Practice — Stretch:** Priors \(\operatorname{Beta}(1,1)\) and \(\operatorname{Beta}(20,20)\) both have mean 0.5. After 9 successes in 10 trials, compute each posterior mean and standard deviation, then find how many additional all-success trials the \(\operatorname{Beta}(20,20)\) analysis needs before its posterior mean exceeds 0.7.
>
> **Hint:** The posteriors are \(\operatorname{Beta}(10,2)\) and \(\operatorname{Beta}(29,21)\); solve \((29+k)/(50+k)>0.7\) for the smallest integer \(k\).

## 4. Posterior summaries answer different questions

A posterior is a distribution, not one number. Common summaries include:

- posterior mean \(E[\theta\mid y]\);
- posterior median;
- posterior mode or MAP estimate;
- posterior standard deviation;
- quantiles and credible intervals;
- probabilities of decision-relevant events.

A \(95\%\) credible interval \(C\) satisfies

$$
P(\theta\in C\mid y)=0.95.
$$

An equal-tailed interval uses the 2.5% and 97.5% posterior quantiles. A highest-posterior-density region contains high-density values and can be shorter, but may be disconnected for a multimodal posterior. Its shape is not invariant under nonlinear reparameterization.

A posterior probability such as

$$
P(p_B-p_A>0.02\mid y)
$$

directly addresses a practical threshold under the model and prior. It is not automatically a causal probability or a guarantee under distribution shift.

**Worked example — mean, mode, and boundary.** A \(\operatorname{Beta}(1,5)\) posterior has mean \(1/6\), while its mode is at the boundary zero. These summaries optimize different losses and tell different stories. Reporting only the mode would hide substantial uncertainty above zero.

> **Practice — Foundation:** For the posterior \(\operatorname{Beta}(1,3)\), with density \(3(1-p)^2\) and CDF \(1-(1-p)^3\), compute the 95% equal-tailed interval and the 95% highest-density interval, and compare their lengths.
>
> **Hint:** The density is decreasing, so the HPD interval is \([0,u]\) with \(1-(1-u)^3=0.95\); the equal-tailed ends solve the CDF at 0.025 and 0.975.
>
> **Practice — Core:** For the posterior \(\operatorname{Beta}(2,6)\), compute the mean, the mode, and (numerically) the median, and explain their ordering.
>
> **Hint:** Mode is \((a-1)/(a+b-2)\) and mean is \(a/(a+b)\); right skew pulls the median and mean above the mode.
>
> **Practice — Stretch:** The 95% HPD interval of the \(\operatorname{Beta}(1,3)\) posterior is \([0,0.632]\). Transform to \(\eta=\log(p/(1-p))\), whose density is \(3p(1-p)^3\) written in terms of \(\eta\). Show that the image \((-\infty,\operatorname{logit}0.632]\) is not an HPD region for \(\eta\) by comparing the density near its two ends.
>
> **Hint:** An HPD region needs every inside point denser than every outside point; the \(\eta\)-density tends to 0 as \(\eta\to-\infty\) but is about 0.095 at the right end.

## 5. Posterior prediction averages parameter uncertainty

For new data \(\tilde y\), the posterior predictive distribution is

$$
p(\tilde y\mid y)
=
\int p(\tilde y\mid\theta)p(\theta\mid y)\,d\theta.
$$

It averages predictions across posterior uncertainty. Plugging in one estimate,

$$
p(\tilde y\mid\hat\theta),
$$

usually understates uncertainty because it treats the selected parameter as known.

For a Beta–Bernoulli model,

$$
P(\tilde X=1\mid x)
=
E[p\mid x]
=
\frac{\alpha+s}{\alpha+\beta+n}.
$$

For \(m\) future trials, integrating \(p\) produces a beta-binomial distribution. Future outcomes become dependent marginally because they share the same uncertain \(p\), even though they are conditionally independent given \(p\).

**Worked example — two future trials.** Under a posterior \(\operatorname{Beta}(a,b)\),

$$
P(\tilde X_1=1,\tilde X_2=1\mid x)
=\frac{a(a+1)}{(a+b)(a+b+1)},
$$

which exceeds \([a/(a+b)]^2\). Learning that one future trial succeeds would raise the predicted probability for the other because both inform the same latent rate.

> **Practice — Foundation:** With posterior \(\operatorname{Beta}(10,4)\), write the integral for \(P(\tilde X=1\mid x)\), evaluate it, and compare it with the plug-in value at the MAP \(\hat p=0.75\).
>
> **Hint:** The integral \(\int_0^1p\,\operatorname{Beta}(p;10,4)\,dp\) is the posterior mean.
>
> **Practice — Core:** Derive \(P(\tilde X_1=\tilde X_2=1\mid x)\) under a \(\operatorname{Beta}(a,b)\) posterior, evaluate it for \(\operatorname{Beta}(10,4)\), and compare it with \((10/14)^2\).
>
> **Hint:** You need \(E[p^2]=\operatorname{Var}(p)+E[p]^2\), or equivalently the ratio \(B(a+2,b)/B(a,b)\).
>
> **Practice — Stretch:** Let \(y_i\mid\theta\sim\mathcal N(\theta,4)\) with prior \(\theta\sim\mathcal N(0,1)\), and observe \(n=4\) values with \(\bar y=2\). Compute the posterior for \(\theta\) and the posterior predictive variance of a new \(y\), split it into aleatoric and epistemic parts, and say which part remains as \(n\to\infty\).
>
> **Hint:** Posterior precision is \(1+n/4\); the predictive variance is \(\sigma^2+\operatorname{Var}(\theta\mid y)\) by total variance.

## 6. Posterior predictive checks criticize the model

Draw a posterior parameter and replicated data:

$$
\theta^{(s)}\sim p(\theta\mid y),
\qquad
y_{\mathrm{rep}}^{(s)}\sim p(y\mid\theta^{(s)}).
$$

Then compare features \(T(y_{\mathrm{rep}})\) with \(T(y)\). Useful discrepancies target aspects that matter:

- tail counts and maxima;
- subgroup error gaps;
- serial runs;
- calibration curves;
- missingness patterns;
- document-length effects;
- cross-task heterogeneity.

![Posterior predictive checking asks whether fitted-model replications reproduce important features of the observed data.](../assets/posterior-predictive-loop.svg)

A posterior predictive p-value

$$
P(T(y_{\mathrm{rep}})\geq T(y)\mid y)
$$

is a diagnostic, not generally a uniformly distributed frequentist p-value. The observed data are used both to fit and check, making it conservative for some discrepancies.

**Worked example — overdispersed accuracy.** A single Bernoulli rate predicts binomial variation across tasks. If observed task accuracies vary far more than posterior replicated task accuracies, the model misses heterogeneity. A hierarchical task-rate model may be more appropriate than forcing one common \(p\).

> **Practice — Foundation:** Counts \((0,0,1,6,8)\) are modeled as \(Y_i\mid\lambda\sim\operatorname{Poisson}(\lambda)\) with \(\lambda\sim\operatorname{Gamma}(2,1)\) (shape, rate). Give the posterior, its mean, and the two draws that generate one replicated dataset.
>
> **Hint:** The Gamma shape gains the total count and the rate gains \(n\); first draw \(\lambda\), then five Poisson counts.
>
> **Practice — Core:** For the counts \((0,0,1,6,8)\), compute three discrepancies on the observed data (number of zeros, maximum, and variance-to-mean ratio) and their values expected under a Poisson with \(\lambda=17/6\) (for the maximum, compute \(P(\max\ge8)\)).
>
> **Hint:** Expected zeros are \(5e^{-\lambda}\), a Poisson has variance equal to its mean, and \(P(\max\ge8)=1-P(Y\le7)^5\).
>
> **Practice — Stretch:** Suppose you chose the statistic \(T=\max_iy_i\) only after noticing the 8 in \((0,0,1,6,8)\). Explain why the resulting posterior predictive p-value is exploratory, and design an honest validation for a revised negative-binomial model using a second batch of users.
>
> **Hint:** The statistic was selected using the same data it tests; validation needs a discrepancy fixed in advance and data not used to choose it.

## 7. Sensitivity analysis reveals prior influence

Posterior conclusions should be recomputed under several defensible priors, likelihoods, and data exclusions. Sensitivity matters when:

- the dataset is small;
- the likelihood is weakly identifying;
- parameters lie near boundaries;
- hierarchical variance is estimated from few groups;
- the target is a tail probability;
- model selection depends on marginal likelihood.

Sensitivity is not an invitation to shop for a preferred result. Specify a plausible range of assumptions and report which conclusions change.

**Worked example — rare safety event.** With zero incidents, the likelihood is \((1-p)^n\). Different priors near \(p=0\) can materially affect posterior upper tails. As \(n\) grows, data dominate for regular interior questions, but an extremely small tail probability may remain prior-sensitive for a long time.

Local sensitivity changes a hyperparameter slightly and differentiates a posterior summary. Global sensitivity fits several qualitatively different models. Simulation-based calibration can test whether a complete inference pipeline recovers parameters generated from its own prior.

> **Practice — Foundation:** With 0 incidents in \(n=20\) trials, compute the posterior mean of \(p\) under \(\operatorname{Beta}(1,1)\) and under \(\operatorname{Beta}(1,19)\), and name two items from the list above that this example exhibits.
>
> **Hint:** The posterior is \(\operatorname{Beta}(\alpha,\beta+20)\) with mean \(\alpha/(\alpha+\beta+20)\).
>
> **Practice — Core:** After 6 successes in 10 trials, compare posterior means under \(\operatorname{Beta}(1,1)\) and \(\operatorname{Beta}(10,30)\), and compute \(P(p>0.5\mid y)\) under each.
>
> **Hint:** Posteriors are \(\operatorname{Beta}(7,5)\) and \(\operatorname{Beta}(16,34)\); the threshold probability is a decision-relevant summary that moves far more than a mean might suggest.
>
> **Practice — Stretch:** Groups have \(\sigma_j=10\). Prespecify a \(3\times3\) sensitivity grid with prior scales \(s_\mu\in\{5,10,20\}\) for \(\mu\) and \(s_\tau\in\{1,5,25\}\) for \(\tau\), compute the shrinkage factor \(\sigma_j^2/(\sigma_j^2+\tau^2)\) at \(\tau=1,5,25\), and state what you will report for all nine cells.
>
> **Hint:** The shrinkage factor is the weight on \(\mu\) in the conditional posterior mean; report every cell's summary, not only the favorable ones.

## 8. Marginal likelihood rewards fit and concentration

The evidence for model \(M\) is

$$
p(y\mid M)
=
\int p(y\mid\theta,M)p(\theta\mid M)\,d\theta.
$$

For two models, the Bayes factor is

$$
\operatorname{BF}_{10}
=
\frac{p(y\mid M_1)}{p(y\mid M_0)}.
$$

It updates prior model odds to posterior model odds. Unlike a maximized likelihood, marginal likelihood averages over the prior parameter space. A model spreading prior mass across predictions unsupported by data receives lower average likelihood—an automatic but prior-dependent complexity penalty.

This dependence is strong: changing prior scale can change a Bayes factor even when posterior parameter estimates barely move. Improper priors usually make marginal likelihood undefined up to arbitrary constants.

For predictive model comparison, held-out log predictive density often targets the practical question more directly than posterior model probability. Both approaches require a declared model set; posterior probability cannot assign mass to an omitted model.

> **Practice — Foundation:** One observation \(y=1\) comes from \(\mathcal N(\theta,1)\). Compute the maximized likelihood over \(\theta\) and the marginal likelihood under the prior \(\theta\sim\mathcal N(0,1)\).
>
> **Hint:** The maximum is at \(\theta=1\); marginally \(y\sim\mathcal N(0,1+1)\).
>
> **Practice — Core:** Keep \(y=1\) from \(\mathcal N(\theta,1)\). Compute the marginal likelihood under \(\theta\sim\mathcal N(0,s^2)\) for \(s=1,10,100\), and explain why it falls although the maximized likelihood stays \(1/\sqrt{2\pi}\).
>
> **Hint:** Marginally \(y\sim\mathcal N(0,1+s^2)\), whose density at 1 is about \(1/(s\sqrt{2\pi})\) for large \(s\).
>
> **Practice — Stretch:** With \(n=100\) observations from \(\mathcal N(\theta,1)\) and \(\bar y=0.3\), compare \(M_0:\theta=0\) with \(M_1:\theta\sim\mathcal N(0,100^2)\). Compute \(\mathrm{BF}_{10}\), then explain why held-out prediction would favor \(M_1\) even though the Bayes factor favors \(M_0\).
>
> **Hint:** \(\bar y\) is sufficient: \(\bar y\sim\mathcal N(0,0.01)\) under \(M_0\) and \(\mathcal N(0,0.01+10^4)\) under \(M_1\); the wide prior dilutes the evidence, while \(M_1\)'s posterior sits near 0.3.

## 9. Posterior geometry controls approximation difficulty

The log posterior is

$$
\log p(\theta\mid y)
=
\log p(y\mid\theta)+\log p(\theta)-\log p(y).
$$

Optimization can find a posterior mode

$$
\hat\theta_{\mathrm{MAP}}
=
\arg\max_\theta[\log p(y\mid\theta)+\log p(\theta)].
$$

The **Laplace approximation** expands the log posterior to second order around an interior mode:

$$
p(\theta\mid y)
\approx
\mathcal N(\hat\theta_{\mathrm{MAP}},H^{-1}),
$$

where \(H\) is the negative Hessian of the log posterior at the mode.

This works best for a single approximately quadratic mode. It can fail for skewness, boundaries, heavy tails, funnels, ridges, non-identifiability, and separated modes. Reparameterization can dramatically improve geometry without changing the underlying probability model.

**Worked example — correlated parameters.** If two parameters trade off to preserve predictions, the posterior may form a narrow tilted ridge. Independent coordinate proposals move across the ridge and are rejected, while geometry-aware proposals move along it. Optimization finding one point does not reveal the ridge's extent.

> **Practice — Foundation:** With a \(\operatorname{Beta}(2,2)\) prior and 7 successes in 10 trials, write the MAP objective \(\log p(y\mid p)+\log p(p)\) up to a constant and find the MAP.
>
> **Hint:** The objective is \(8\log p+4\log(1-p)\); set its derivative \(8/p-4/(1-p)\) to zero.
>
> **Practice — Core:** For \(\ell(p)=8\log p+4\log(1-p)\) (the \(\operatorname{Beta}(9,5)\) posterior), derive the Laplace variance \(-1/\ell''(\hat p)\) and compare it with the exact posterior variance.
>
> **Hint:** \(\ell''(p)=-8/p^2-4/(1-p)^2\), evaluated at \(\hat p=2/3\); the exact variance is \(ab/[(a+b)^2(a+b+1)]\).
>
> **Practice — Stretch:** Data are 10 points at \(-2\) and 10 at \(+2\), modeled by \(0.5\,\mathcal N(\mu_1,1)+0.5\,\mathcal N(\mu_2,1)\) with a symmetric prior. The posterior has modes near \((-2,2)\) and \((2,-2)\). Explain why a Laplace approximation at one mode reports \(P(\mu_1<0\mid y)\approx1\) while the exact posterior gives exactly \(0.5\).
>
> **Hint:** Swapping the labels \(\mu_1\leftrightarrow\mu_2\) leaves the likelihood and prior unchanged, so every marginal statement about \(\mu_1\) must be symmetric.

## 10. Hierarchical models create partial pooling

Suppose task-specific effects \(\theta_j\) vary around a population distribution:

$$
\theta_j\mid\mu,\tau
\sim\mathcal N(\mu,\tau^2),
\qquad
y_j\mid\theta_j
\sim\mathcal N(\theta_j,\sigma_j^2).
$$

Conditional on \(\mu,\tau\), the group posterior mean is a precision-weighted average:

$$
E[\theta_j\mid y_j,\mu,\tau]
=
\frac{\tau^{-2}\mu+\sigma_j^{-2}y_j}
{\tau^{-2}+\sigma_j^{-2}}.
$$

No pooling estimates every group separately. Complete pooling forces one common effect. Partial pooling learns a population distribution and moves noisy group estimates toward its center.

![Hierarchical partial pooling shrinks uncertain groups more strongly while retaining evidence for genuine heterogeneity.](../assets/hierarchical-partial-pooling.svg)

Shrinkage is adaptive. A small \(\tau\) implies similar groups and stronger pooling. A large \(\sigma_j\) means group \(j\) is imprecise and moves more. Hyperparameter uncertainty should also be propagated rather than fixing \(\mu,\tau\) at point estimates.

**Worked example — benchmark tasks.** A task with 20 examples and an extreme observed gain is more strongly pooled than a task with 5,000 examples showing the same gain. Partial pooling counters noisy winner effects while allowing well-supported task differences to remain.

> **Practice — Foundation:** Three tasks have estimates \(y=(10,2,-4)\) with \(\sigma_j=2\). Fix \(\mu=2\) and \(\tau=2\). Give the no-pooling, complete-pooling, and partial-pooling estimate for each task.
>
> **Hint:** With \(\tau=\sigma_j\) the precisions are equal, so partial pooling puts weight \(1/2\) on \(\mu\) and \(1/2\) on \(y_j\).
>
> **Practice — Core:** Rewrite the conditional posterior mean as \(B_j\mu+(1-B_j)y_j\) with \(B_j=\sigma_j^2/(\sigma_j^2+\tau^2)\), then evaluate it for \(\mu=0\), \(\tau=5\), \(y_j=10\) with \(\sigma_j=5\) (small task) and \(\sigma_j=0.5\) (large task).
>
> **Hint:** Divide numerator and denominator of the precision-weighted mean by \(\tau^{-2}+\sigma_j^{-2}\), so \(B_j=\tau^{-2}/(\tau^{-2}+\sigma_j^{-2})\).
>
> **Practice — Stretch:** In the centered form \(\theta_j\sim\mathcal N(\mu,\tau^2)\), compute the conditional posterior SD of \(\theta_j\) given \((\mu,\tau=5)\) when \(\sigma_j=20\) and when \(\sigma_j=0.1\). Use the results to explain the funnel and to predict whether the centered or the non-centered form \(\theta_j=\mu+\tau\eta_j\) samples better in each case.
>
> **Hint:** The SD is \((\tau^{-2}+\sigma_j^{-2})^{-1/2}\); when \(\sigma_j\gg\tau\) it tracks \(\tau\) (funnel, prefer non-centered), and when \(\sigma_j\ll\tau\) the data pin \(\theta_j\) (prefer centered).

## 11. Bayesian decisions require a loss function

Inference describes uncertainty. A decision also needs actions and consequences. For action \(a\), parameter \(\theta\), and loss \(L(a,\theta)\), the Bayes action minimizes posterior expected loss:

$$
a^*(y)
=
\arg\min_a E[L(a,\theta)\mid y].
$$

Different losses produce different summaries:

- squared-error loss yields the posterior mean;
- absolute-error loss yields a posterior median;
- zero-one loss over discrete actions yields a posterior mode;
- asymmetric losses yield decision-specific posterior quantiles.

For deployment, actions may include release, collect more data, route selectively, or retain the current system. A threshold on posterior probability is meaningful only after the costs of false deployment and missed improvement are specified.

The expected value of information compares the best decision now with the expected best decision after collecting possible new data, minus data-collection cost. More information is useful when it can change an action, not merely because it narrows a posterior.

**Worked example — ship or wait.** Let \(\Delta\) be utility gain from a new model. Shipping loses 100 units if \(\Delta\leq0\) and gains 10 units if \(\Delta>0\); not shipping has zero loss and zero gain. Under this simplified payoff, shipping requires posterior probability above \(100/(100+10)\approx0.909\), not merely above 0.5.

> **Practice — Foundation:** Equally weighted posterior draws are \(\theta=(1,2,2,3,10)\). Find the Bayes action under squared loss, absolute loss, and zero-one loss over the observed values.
>
> **Hint:** Squared loss gives the mean, absolute loss the median, and zero-one loss the most frequent value.
>
> **Practice — Core:** Derive the threshold \(p^*=C_F/(C_F+C_M)\) for acting, then decide for \(P(\text{improvement}\mid y)=0.85\) when \((C_F,C_M)=(100,10)\) and when \((C_F,C_M)=(5,20)\).
>
> **Hint:** Act when the expected loss of acting, \((1-p)C_F\), is below that of not acting, \(pC_M\).
>
> **Practice — Stretch:** Actions: deploy a large model (cost 3; value 10 if its gain \(\Delta>0\), otherwise \(-20\)), deploy a small model (value 4 for sure), or pay 1 to learn the sign of \(\Delta\) first. With \(P(\Delta>0\mid y)=0.7\), compute the expected utility of each action and the expected value of perfect information.
>
> **Hint:** For the information action, pick the best deployment separately in each revealed state, then average over the 0.7/0.3 probabilities and subtract the cost.

## 12. Posterior expectations become computational problems

Many targets have the form

$$
E[h(\theta)\mid y]
=
\int h(\theta)p(\theta\mid y)\,d\theta.
$$

If independent posterior draws \(\theta^{(1)},\ldots,\theta^{(S)}\) are available, approximate with

$$
\hat\mu_S=\frac1S\sum_{s=1}^S h(\theta^{(s)}).
$$

The law of large numbers provides convergence, and a Monte Carlo standard error quantifies remaining simulation noise. Posterior uncertainty and Monte Carlo error are different:

- posterior standard deviation describes uncertainty about \(\theta\) under the model;
- Monte Carlo standard error describes numerical uncertainty in estimating a posterior summary.

More computation reduces the second but not the first.

For rare posterior events, naive sampling may need enormous \(S\). For multimodal or highly correlated targets, obtaining representative draws is itself difficult. Computational diagnostics are therefore part of inference.

> **Practice — Foundation:** The posterior is \(\theta\mid y\sim\mathcal N(3,2^2)\), and \(E[\theta\mid y]\) is estimated from \(S=400\) independent draws. Give the posterior SD and the Monte Carlo SE, and say which one changes when \(S=1600\).
>
> **Hint:** MCSE is posterior SD divided by \(\sqrt S\); the posterior SD does not depend on \(S\).
>
> **Practice — Core:** Derive \(\operatorname{Var}(\hat\mu_S)=\operatorname{Var}(h(\theta))/S\) for independent draws, then compute the MCSE for estimating \(P(\theta>1\mid y)=0.2\) from \(S=10{,}000\) draws.
>
> **Hint:** The indicator \(h=1\{\theta>1\}\) has variance \(q(1-q)=0.16\).
>
> **Practice — Stretch:** Estimate how many independent posterior draws are needed to estimate a tail probability \(q=10^{-4}\) with relative standard error 10%.
>
> **Hint:** The relative SE of the indicator average is \(\sqrt{(1-q)/(qS)}\); set it equal to 0.1 and solve for \(S\).

## 13. Importance sampling corrects proposal mismatch with weights

Suppose the target density is \(\pi(\theta)\) and a proposal density \(q(\theta)\) is easy to sample. If \(q(\theta)>0\) wherever \(\pi(\theta)h(\theta)\neq0\), then

$$
E_\pi[h(\theta)]
=
E_q\left[
h(\theta)\frac{\pi(\theta)}{q(\theta)}
\right]
$$

when \(\pi\) is normalized. With proposal draws \(\theta_s\sim q\), importance weights are

$$
w_s=\frac{\pi(\theta_s)}{q(\theta_s)}.
$$

If the target is known only up to a constant, self-normalized importance sampling uses

$$
\bar w_s=\frac{w_s}{\sum_jw_j},
\qquad
\hat\mu=\sum_s\bar w_sh(\theta_s).
$$

Compute log weights

$$
\ell_s=\log\tilde\pi(\theta_s)-\log q(\theta_s)
$$

and subtract their maximum before exponentiating. This log-sum-exp stabilization prevents avoidable overflow without fixing statistical weight degeneracy.

An importance effective sample size diagnostic is

$$
\operatorname{ESS}_{\mathrm{IS}}
=\frac{1}{\sum_s\bar w_s^2}.
$$

It ranges from one to \(S\). It is a weight-concentration diagnostic, not a guarantee that the proposal covered every important target region.

![Importance sampling can collapse onto a few large weights, while MCMC can fail through slow dependent exploration.](../assets/importance-mcmc-computation.svg)

**Worked example — missed mode.** A narrow proposal centered on one of two posterior modes can give apparently uniform weights and high ESS among sampled points while never visiting the second mode. Support in a mathematical sense is not enough; proposal tail and mode coverage must be practically adequate.

> **Practice — Foundation:** The target is \(\pi=\operatorname{Exponential}(1)\) on \([0,\infty)\). Which proposals satisfy the support condition: (a) \(\operatorname{Uniform}(0,5)\), (b) \(\operatorname{Exponential}\) with rate 0.5, (c) \(\mathcal N(0,1)\)? Give \(w(\theta)\) for the valid ones.
>
> **Hint:** \(q\) must be positive wherever \(\pi\) is; check \(\theta>5\) for (a), and for (b) \(w=e^{-\theta}/(0.5e^{-\theta/2})\).
>
> **Practice — Core:** Proposal draws \(\theta=(-1,0,1,2)\) come from \(q=\mathcal N(0,1)\), and the unnormalized target is \(\tilde\pi(\theta)=\exp(-(\theta-1)^2/2)\). Compute the normalized weights and the self-normalized estimate of \(E_\pi[\theta]\), and show that the target's constant cancels.
>
> **Hint:** \(\log\tilde\pi-\log q=\theta-1/2+\text{const}\), so weights are proportional to \(e^\theta\); subtract the largest log weight (2) before exponentiating.
>
> **Practice — Stretch:** Target \(\pi=\mathcal N(0,1)\), proposal \(q=\mathcal N(0,\sigma^2)\). Show \(E_q[w]=1\) for every \(\sigma\), that \(E_q[w^2]=\sigma^2/\sqrt{2\sigma^2-1}\) is finite only when \(\sigma^2>1/2\), evaluate it at \(\sigma=1\) and \(\sigma=2\), and describe what happens to the estimator at \(\sigma=0.6\).
>
> **Hint:** \(E_q[w^2]=\int\pi^2/q\,d\theta\), and the exponent is \(-\theta^2(1-1/(2\sigma^2))\), which must be negative.

## 14. Importance resampling and diagnostics

Sampling an index with probability \(\bar w_s\) produces an approximate unweighted target draw. This **sampling-importance-resampling** step is useful inside larger algorithms but does not restore information lost to weight collapse; repeated copies of one high-weight proposal point are still one underlying discovery.

Inspect:

- maximum normalized weight;
- \(\operatorname{ESS}_{\mathrm{IS}}\);
- the distribution of log weights;
- stability across independent proposal runs;
- whether proposal draws cover all known target regions;
- sensitivity of estimates to the largest weights.

Importance estimates of normalizing constants use

$$
\hat Z=\frac1S\sum_{s=1}^S
\frac{\tilde\pi(\theta_s)}{q(\theta_s)}.
$$

This estimator can be unbiased while having enormous or infinite variance. A visually stable finite run does not prove reliability.

**Worked example — one dominant draw.** With normalized weights \(0.97\) and \(0.03/(S-1)\) for all others,

$$
\operatorname{ESS}_{\mathrm{IS}}
\approx\frac1{0.97^2}\approx1.06.
$$

Nominally having thousands of proposal draws does not matter; nearly all estimated mass rests on one point.

> **Practice — Foundation:** Compute \(\operatorname{ESS}_{\mathrm{IS}}=1/\sum_s\bar w_s^2\) for the normalized weights \((0.25,0.25,0.25,0.25)\), \((1,0,0,0)\), and \((0.4,0.3,0.2,0.1)\).
>
> **Hint:** Square each normalized weight, sum, and invert; the third sum is \(0.16+0.09+0.04+0.01\).
>
> **Practice — Core:** Normalized weights over five draws are \((0.9,0.025,0.025,0.025,0.025)\). Compute the ESS, the expected number of copies of draw 1 when resampling five indices, and explain why the resampled set carries no more information than the ESS suggests.
>
> **Hint:** Multinomial resampling gives draw \(s\) an expected \(S\bar w_s\) copies; copies of one proposal point are not new target draws.
>
> **Practice — Stretch:** Target \(\pi=t_3\) (Student t, 3 df) with fitted approximation \(\mathcal N(0,1)\). Compare proposals \(q_1=\mathcal N(0,1)\) and \(q_2=0.9\,\mathcal N(0,1)+0.1\,\operatorname{Cauchy}(0,1)\): show \(\pi/q_1\) is unbounded, bound \(\pi/q_2\) by \(\pi/(0.1\,q_{\mathrm{Cauchy}})\) (maximum about 13), and state the tradeoff.
>
> **Hint:** \(t_3\) tails decay like \(|\theta|^{-4}\): slower than a Gaussian but faster than the Cauchy's \(\theta^{-2}\).

## 15. MCMC replaces independence with a stationary distribution

A Markov chain generates

$$
\theta^{(0)},\theta^{(1)},\ldots
$$

where the next state depends on the current state. An MCMC transition is designed so the posterior \(\pi\) is stationary:

$$
\theta^{(t)}\sim\pi
\quad\Longrightarrow\quad
\theta^{(t+1)}\sim\pi.
$$

Stationarity alone is not enough. The chain must be able to reach all relevant regions and should not be trapped in cycles. Under suitable irreducibility, aperiodicity, and recurrence conditions, long-run averages converge:

$$
\frac1S\sum_{t=1}^S h(\theta^{(t)})
\longrightarrow E_\pi[h(\theta)].
$$

MCMC samples are correlated. Ten thousand stored states can contain far less information than ten thousand independent draws.

Discarding early draws as warmup reduces dependence on a poor initial state, but it cannot fix a chain that never crosses between modes or uses an incorrect transition.

> **Practice — Foundation:** For the transition matrix \(P=\begin{pmatrix}0.9&0.1\\0.2&0.8\end{pmatrix}\), solve \(\pi P=\pi\).
>
> **Hint:** In a two-state chain, stationarity means the flows balance: \(\pi_1(0.1)=\pi_2(0.2)\), with \(\pi_1+\pi_2=1\).
>
> **Practice — Core:** For \(P=\begin{pmatrix}0.9&0.1\\0.1&0.9\end{pmatrix}\) and \(h=1\{\text{state }1\}\), the lag-\(k\) autocorrelation is \(0.8^k\). Compute the integrated autocorrelation time and the ESS of 10,000 draws, and explain why the time average still converges to \(1/2\).
>
> **Hint:** \(\tau=1+2\sum_{k\ge1}0.8^k\), and the geometric sum is \(0.8/0.2=4\).
>
> **Practice — Stretch:** Build a four-state chain with blocks \(\{1,2\}\) and \(\{3,4\}\), each moving by \(\begin{pmatrix}0.5&0.5\\0.5&0.5\end{pmatrix}\) inside its block with no moves between blocks. Show that the uniform distribution is stationary, and compute the long-run average of \(h=1\{\text{state}\in\{1,2\}\}\) started from state 1 and from state 3.
>
> **Hint:** Check \(\pi P=\pi\) block by block; any mixture of the two block-uniform distributions is also stationary.

## 16. When does a chain actually have the right limit?

The previous section asserted that a well-constructed chain has the posterior as its stationary distribution and that time averages converge to posterior expectations. Both claims need conditions, and knowing them is what separates "my sampler ran" from "my sampler is estimating the thing I want".

**Stationarity.** A distribution \(\pi\) is **stationary** for a transition kernel \(P\) when

$$
\pi(y)=\sum_x\pi(x)P(x\to y)
\qquad\text{(or the integral form for continuous state).}
$$

Start in \(\pi\) and you remain in \(\pi\) forever. Stationarity alone is weak: a chain that never moves has *every* distribution as stationary.

**Detailed balance implies stationarity.** A chain is **reversible** with respect to \(\pi\) when

$$
\pi(x)P(x\to y)=\pi(y)P(y\to x)
\qquad\text{for all }x,y .
$$

Summing both sides over \(x\) gives \(\sum_x\pi(x)P(x\to y)=\pi(y)\sum_xP(y\to x)=\pi(y)\), which is stationarity. This two-line argument is the entire justification for the acceptance ratio of the next section — Metropolis–Hastings is constructed precisely to force detailed balance. Note the implication runs one way: reversibility is sufficient, not necessary, and several high-performance samplers are deliberately non-reversible.

**Irreducibility.** The chain must be able to reach every region of positive probability from every starting point. Without it, the chain has multiple stationary distributions and where you start decides where you end. In practice this fails for multimodal posteriors with deep valleys between modes: the chain is *technically* irreducible but the crossing time exceeds any budget you will run, which is operationally identical to reducibility.

**Aperiodicity.** The chain must not cycle deterministically through subsets with a fixed period. A period-2 chain alternating between two halves of the space has a stationary distribution but never converges to it. Metropolis chains with a nonzero rejection probability are automatically aperiodic, since a rejection means staying put.

**The ergodic theorem.** With irreducibility, aperiodicity, and a stationary \(\pi\), two things hold: the distribution of \(x_t\) converges to \(\pi\) regardless of the starting point, and — this is the part estimation relies on — time averages converge to space averages,

$$
\frac1T\sum_{t=1}^Tf(x_t)\;\longrightarrow\;E_\pi[f]
\qquad\text{almost surely.}
$$

This is the law of large numbers with independence replaced by ergodicity. It licenses everything you do with MCMC output.

**How fast? The spectral gap.** For a reversible chain on a finite state space, the transition matrix has eigenvalue \(1\) with the stationary distribution as its eigenvector; convergence speed is governed by the **second-largest eigenvalue modulus** \(\lambda_2\). The distance to stationarity decays like \(\lambda_2^t\), so the **mixing time** scales as

$$
t_{\text{mix}}\sim\frac1{1-\lambda_2}=\frac1{\text{spectral gap}} .
$$

This is the same eigenvalue-controls-the-rate argument that governed power iteration and gradient descent in [eigenvalues and invariant subspaces](../02-linear-algebra/06-eigenvalues-diagonalization.md) — a chain with a small gap is the probabilistic twin of an ill-conditioned optimization problem, and the geometry that causes it is the same elongated, correlated geometry described earlier in this lesson.

**What you can actually measure.** The spectral gap is not computable for a real posterior. The practical proxy is the **integrated autocorrelation time** \(\tau\), giving an effective sample size

$$
n_{\text{eff}}=\frac T{1+2\sum_{k\ge1}\rho_k}=\frac T\tau ,
$$

exactly the dependence correction developed in [limit theorems and Monte Carlo](05-limit-theorems-monte-carlo.md). A chain of \(100{,}000\) draws with \(\tau=500\) carries the information of \(200\) independent draws, and every standard error must use \(n_{\text{eff}}\), not \(T\).

**Worked example — a two-state chain.** Let the chain move with probability \(a\) from state 1 to 2 and \(b\) from 2 to 1. Stationarity gives \(\pi=(b,a)/(a+b)\), and the eigenvalues are \(1\) and \(1-a-b\). With \(a=b=0.5\) the gap is \(1\) and the chain reaches stationarity in one step. With \(a=b=0.001\) the gap is \(0.002\) and mixing takes on the order of \(500\) steps — the chain is "sticky", and a short run will report whichever state it started in with false confidence.

**The failure this explains.** Convergence diagnostics test whether a chain *looks* stationary, not whether it has explored. A chain trapped in one mode of a multimodal posterior can pass every diagnostic while sampling from the wrong distribution. No amount of running longer fixes a chain that cannot cross; you need a different kernel — tempering, mode-jumping proposals, or multiple dispersed starts.

> **Practice — Foundation:** For the two-state chain above with \(a=0.2\) and \(b=0.05\), compute \(\pi\), verify detailed balance, and give the spectral gap.
>
> **Hint:** \(\pi=(b,a)/(a+b)\); check \(\pi_1a=\pi_2b\), and the second eigenvalue is \(1-a-b\).
>
> **Practice — Core:** Prove that detailed balance implies stationarity, stating where the rows of the kernel summing to one is used. Then show that the three-state chain that stays put with probability 0.5 and otherwise moves \(1\to2\to3\to1\) has uniform stationary distribution but is not reversible.
>
> **Hint:** Sum \(\pi(x)P(x\to y)=\pi(y)P(y\to x)\) over \(x\) and use \(\sum_xP(y\to x)=1\); for the cycle compare \(\pi_1P(1\to2)=1/6\) with \(\pi_2P(2\to1)=0\).
>
> **Practice — Stretch:** Target \(\pi=0.5\,\mathcal N(-5,1)+0.5\,\mathcal N(5,1)\); four random-walk Metropolis chains with step size 1 all start at \(-5\). Compute the density ratio between \(\theta=0\) and a mode, explain why \(\hat R\) looks fine, state which assumption is technically satisfied but practically violated, and name two repairing kernels with their costs.
>
> **Hint:** The valley-to-mode ratio is about \(e^{-25/2}\approx4\times10^{-6}\); chains sharing one start agree with each other, so between-chain variance is small.

## 17. Metropolis–Hastings corrects proposed moves

At current state \(\theta\):

1. propose \(\theta'\sim q(\theta'\mid\theta)\);
2. calculate

$$
r=
\frac{\tilde\pi(\theta')q(\theta\mid\theta')}
{\tilde\pi(\theta)q(\theta'\mid\theta)};
$$

3. accept with probability \(\min(1,r)\); otherwise repeat \(\theta\).

The target normalizing constant cancels. For a symmetric random-walk proposal, \(q(\theta'\mid\theta)=q(\theta\mid\theta')\), so only the target-density ratio remains.

The acceptance rule satisfies detailed balance:

$$
\pi(\theta)K(\theta,\theta')
=
\pi(\theta')K(\theta',\theta),
$$

which implies stationarity.

Compute in log space. If

$$
\log U<
\min(0,\log r),
\qquad U\sim\operatorname{Uniform}(0,1),
$$

accept. This avoids underflow in tiny densities.

**Worked example — proposal scale.** A tiny random-walk scale accepts nearly every move but advances slowly, producing high autocorrelation. A huge scale proposes low-density states and mostly repeats the current value. A moderate acceptance rate is a symptom, not the objective; exploration and effective sample size matter.

> **Practice — Foundation:** For \(\tilde\pi(\theta)=e^{-\theta^2/2}\) with a symmetric proposal and current state \(\theta=1\), compute the acceptance probability for \(\theta'=2\) and for \(\theta'=0\).
>
> **Hint:** The symmetric proposal cancels, leaving \(\min(1,\tilde\pi(\theta')/\tilde\pi(\theta))\); for \(\theta'=2\) this is \(e^{-3/2}\).
>
> **Practice — Core:** Prove detailed balance for the off-diagonal Metropolis–Hastings transition \(K(\theta,\theta')=q(\theta'\mid\theta)\min(1,r)\), then check it numerically on states \(\{0,1\}\) with \(\pi=(1/3,2/3)\) and \(q(1\mid0)=q(0\mid1)=1/2\).
>
> **Hint:** \(\pi(\theta)q(\theta'\mid\theta)\min(1,r)=\min\{\pi(\theta)q(\theta'\mid\theta),\pi(\theta')q(\theta\mid\theta')\}\), which is symmetric in \(\theta,\theta'\).
>
> **Practice — Stretch:** On two states with uniform target, each kernel \(K_p=\begin{pmatrix}1-p&p\\p&1-p\end{pmatrix}\) leaves the uniform distribution stationary. An adaptive rule uses \(p=0.1\) whenever the chain is in state 1 and \(p=0.9\) in state 2. Compute the stationary distribution of the adapted chain and explain how warmup-only adaptation avoids this failure.
>
> **Hint:** The adapted chain has \(P(1\to2)=0.1\) and \(P(2\to1)=0.9\); solve \(\pi_1(0.1)=\pi_2(0.9)\).

## 18. Chain diagnostics test exploration, not truth

For stationary scalar draws with lag-\(k\) autocorrelation \(\rho_k\), a conceptual effective sample size is

$$
\operatorname{ESS}_{\mathrm{chain}}
\approx
\frac{S}{1+2\sum_{k\geq1}\rho_k}.
$$

Monte Carlo standard error is then approximately posterior standard deviation divided by \(\sqrt{\operatorname{ESS}}\).

Use multiple dispersed chains. Compare variation within and between chains; rank-based split-\(\hat R\) near one is desirable. Inspect trace plots, autocorrelation, energy or divergence diagnostics for geometry-aware samplers, and effective sample size for every important functional—not only parameters.

No diagnostic proves convergence. Chains trapped together in the same mode may agree. A high acceptance rate can coexist with negligible movement. A large raw sample count can hide extreme dependence.

Simulation-based calibration tests an inference algorithm end to end:

1. draw \(\theta\) from the prior;
2. draw data from the likelihood;
3. fit the model;
4. check whether the true draw has the expected rank within posterior draws.

Systematic rank patterns reveal computational or implementation errors under the model.

> **Practice — Foundation:** An MCMC run has 10,000 draws with \(\rho_k=0.5^k\). An importance run has 10,000 draws of which 100 carry normalized weight 0.01 each and the rest weight 0. Compute both effective sample sizes and state what each measures.
>
> **Hint:** MCMC: \(S/(1+2\sum_k0.5^k)\) with \(\sum_k0.5^k=1\); importance: \(1/\sum\bar w^2\).
>
> **Practice — Core:** Two chains of four draws are \(A=(1,2,1,2)\) and \(B=(5,6,5,6)\). Compute the within-chain variance \(W\), the between-chain variance \(B\), and the (non-split) \(\hat R\), and interpret them.
>
> **Hint:** \(B=n\) times the sample variance of the chain means (denominator \(m-1\)); \(\hat R=\sqrt{((n-1)W/n+B/n)/W}\).
>
> **Practice — Stretch:** For target \(0.5\,\mathcal N(-5,1)+0.5\,\mathcal N(5,1)\), four chains all start at 5 and never leave the right mode. Compare what they estimate for \(E[\theta]\) and \(P(\theta>0)\) with the truth, and explain why \(\hat R\approx1\) and the ESS is high.
>
> **Hint:** Chains that all sample \(\mathcal N(5,1)\) agree with each other perfectly; diagnostics compare chains, not the chains with the target.

## 19. HMC and variational inference make different approximations

Random-walk Metropolis ignores posterior gradients. Hamiltonian Monte Carlo (HMC) introduces auxiliary momentum and uses gradients to propose long moves that approximately follow constant-energy paths. A correction step removes numerical integration bias. HMC can explore smooth high-dimensional posteriors efficiently, but funnels, discontinuities, bad scaling, and separated modes remain difficult.

Variational inference chooses a tractable family \(q_\phi(\theta)\) and optimizes an objective equivalent to

$$
\operatorname{KL}(q_\phi(\theta)\,\|\,p(\theta\mid y)).
$$

This direction of KL heavily penalizes placing mass where the posterior has little mass, but may tolerate missing posterior regions. Simple mean-field families often underestimate dependence and tail uncertainty.

Laplace, importance sampling, MCMC, HMC, and variational inference are not a ladder where the most complex is automatically best. Choose based on target geometry, dimensionality, required summaries, compute, and diagnostics. Validate against analytic or enumerated cases whenever possible.

> **Practice — Foundation:** For a standard normal target in \(d=100\) dimensions, random-walk Metropolis works best with step size about \(2.38/\sqrt d\). Compute that step size and roughly how many steps a random walk needs to travel one standard deviation, and contrast this with an HMC proposal.
>
> **Hint:** A random walk covers distance about step \(\times\sqrt t\); set this equal to 1. HMC instead follows the gradient \(\nabla\log\pi=-\theta\) for many leapfrog steps.
>
> **Practice — Core:** The target is bivariate normal with unit variances and correlation \(\rho=0.9\). The optimal mean-field Gaussian under \(\operatorname{KL}(q\|p)\) has variances \(1/\Lambda_{ii}\), where \(\Lambda=\Sigma^{-1}\). Compute them and compare with the true marginal variance 1.
>
> **Hint:** The diagonal of \(\Sigma^{-1}\) is \(1/(1-\rho^2)\); mean field matches conditional, not marginal, precision.
>
> **Practice — Stretch:** Design a validation ladder for \(y_j\sim\mathcal N(\theta_j,1)\), \(\theta_j\sim\mathcal N(\mu,\tau^2)\): exact grid inference for \(J=2\), then MCMC for \(J=8\), then VI for \(J=50\). For the first rung, compute the exact posterior of \(\mu\) given \(\tau=1\), a flat prior on \(\mu\), and \(y=(0,2)\).
>
> **Hint:** Integrate out \(\theta_j\): \(y_j\mid\mu,\tau\sim\mathcal N(\mu,1+\tau^2)\), so with a flat prior \(\mu\) is centered at \(\bar y\) with variance \(2/J\).

## 20. Bayesian workflow for AI research

Bayesian models can express structures common in AI work:

- task and domain effects through hierarchies;
- seed-to-seed training variation;
- annotator bias and reliability;
- paired model comparisons;
- latent difficulty of prompts;
- calibration uncertainty;
- scaling-law parameters and extrapolation;
- online decisions under accumulating evidence.

The hierarchy must match the claim. If tasks are fixed, a task population prior changes the estimand. If seeds are selected, the selection rule belongs in the likelihood or evaluation pipeline. If annotator disagreement is systematic, one exchangeable error rate may be inadequate.

**Worked example — model comparison across tasks and seeds.** Let \(\delta_j\) be task-specific model differences drawn from a population with mean \(\mu_\delta\) and scale \(\tau\). Observed seed and item summaries inform each \(\delta_j\). The posterior for \(\mu_\delta\) addresses average performance over the modeled task population; posterior predictive draws of a new \(\delta_{\mathrm{new}}\) address performance on a new task. These distributions are different: prediction for a new task includes between-task variation.

For every analysis:

1. draw the graphical or generative structure;
2. simulate prior predictive data;
3. fit and diagnose computation;
4. compare posterior replicated data with observations;
5. run sensitivity analyses;
6. validate prediction on held-out or future data;
7. connect posterior summaries to an explicit decision.

> **Practice — Foundation:** In \(y_{js}=\delta_j+\varepsilon_{js}\) with \(\delta_j\sim\mathcal N(\mu_\delta,\tau^2)\) and \(\varepsilon_{js}\sim\mathcal N(0,\sigma^2)\) for 5 tasks and 3 seeds, list the observed and latent quantities and count each.
>
> **Hint:** Observed means the entries of the results table; everything given a prior, including hyperparameters, is latent.
>
> **Practice — Core:** Take \(\mu_\delta\mid y\sim\mathcal N(1.0,0.3^2)\) with \(\tau=2\) known. Compute 95% intervals for \(\mu_\delta\) and for a new task's \(\delta_{\mathrm{new}}\), and compute \(P(\delta_{\mathrm{new}}<0\mid y)\).
>
> **Hint:** \(\delta_{\mathrm{new}}=\mu_\delta+\tau z\), so its predictive variance is \(0.3^2+2^2\).
>
> **Practice — Stretch:** A Bradley–Terry model sets \(\operatorname{logit}P(i\text{ beats }j)=\theta_i-\theta_j\) for three models. Show that adding a constant to every \(\theta\) leaves the likelihood unchanged and impose \(\theta_C=0\). If pooled win rates are 0.73 for A over B and 0.62 for B over C, solve for \(\theta\) and predict A's win rate over C; then list rater and prompt effects and one posterior predictive check.
>
> **Hint:** Only differences enter the likelihood; \(\theta_B=\operatorname{logit}0.62\) and \(\theta_A=\theta_B+\operatorname{logit}0.73\).

## 21. Runnable labs

This chapter has three coding exercises. Each opens as a separate tab in the lesson's right-hand Python workspace.

### Lab A — Beta–Bernoulli updating

Implement **beta_bernoulli_update** in [labs/exercises.py](../../labs/exercises.py). Given binary outcomes and positive prior shape parameters, return:

1. posterior alpha and beta;
2. posterior mean;
3. posterior variance;
4. posterior predictive probability of success.

Run:

~~~text
python -m labs.checks beta-update
~~~

The checks cover mixed and boundary outcomes, generators, sequential coherence, fractional prior shapes, input preservation, and invalid values.

### Lab B — stable self-normalized importance sampling

Implement **self_normalized_importance** in [labs/exercises.py](../../labs/exercises.py). Given finite values and their finite log importance weights, return:

1. the weighted estimate;
2. normalized weights in input order;
3. importance effective sample size.

Use maximum subtraction before exponentiating.

Run:

~~~text
python -m labs.checks importance
~~~

The checks cover equal and extreme log weights, shift invariance, generators, input preservation, numerical stability, and invalid inputs.

### Lab C — random-walk Metropolis

Implement **random_walk_metropolis** in [labs/exercises.py](../../labs/exercises.py). Given a log-density callable, initial state, positive proposal scale, step count, and seed, return the chain after each proposal and the acceptance rate. Use a local Gaussian proposal and the log acceptance rule.

Run:

~~~text
python -m labs.checks metropolis
~~~

The checks cover deterministic seeding, constant targets, Gaussian targets, rejected proposals, local random state, invalid settings, and non-finite log densities.

### Guided experiment

1. Compare Beta posterior means and variances across prior concentrations and sample sizes.
2. Simulate prior and posterior predictive success counts and check calibration.
3. Move an importance proposal away from a target and track estimate error, maximum weight, and ESS.
4. Run Metropolis chains across proposal scales and compare acceptance, trace plots, autocorrelation, and effective sample size.
5. Fit a two-mode target from dispersed initial states and demonstrate how a single-chain summary can fail.
6. Build a hierarchical task-effect simulation and compare separate estimates with partially pooled posterior estimates.

## 22. Derivations to own

1. Derive discrete and continuous Bayes' rule from a joint distribution.
2. Derive Beta–Bernoulli posterior parameters, mean, variance, and predictive probability.
3. Derive the beta-binomial predictive distribution.
4. Separate posterior predictive variance into observation and parameter components.
5. Derive posterior mean, median, and mode as Bayes actions under three losses.
6. Derive a marginal likelihood and Bayes factor in a finite model.
7. Derive the Laplace approximation from a second-order expansion.
8. Derive Gaussian hierarchical partial pooling with fixed hyperparameters.
9. Derive self-normalized importance weights using an unnormalized target.
10. Derive importance ESS and explain its limits.
11. Prove that a likelihood ratio has null expectation one.
12. Derive the Metropolis–Hastings acceptance probability and detailed balance.
13. Relate autocorrelation to variance of an MCMC average.
14. Explain why posterior predictive checks can detect likelihood misspecification.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-posterior
```

## 23. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–6. Build fluent distinctions among Bayesian objects.

**A1 · Foundation · paper — Bayes table.** A condition has prevalence 0.01. A test has sensitivity 0.90 and false-positive rate 0.05. Build the full \(2\times2\) probability table, calculate evidence \(P(+)\), and find \(P(\text{condition}\mid+)\). Explain the base-rate effect in one sentence.

**A2 · Foundation · paper — Conjugate update.** After \(s=8\) successes and \(f=2\) failures, update \(\operatorname{Beta}(1,1)\), \(\operatorname{Beta}(2,8)\), and \(\operatorname{Beta}(1/2,1/2)\) priors. Calculate posterior mean, mode where defined, variance, and one-step predictive probability.

**A3 · Foundation · paper — Prediction.** Under each posterior from problem 2, calculate the probability that the next trial succeeds and that both of the next two trials succeed. Compare the latter with the square of the one-step probability and explain the dependence induced by parameter uncertainty.

**A4 · Foundation · paper — Intervals and decisions.** A posterior for a model's accuracy gain is \(\Delta\mid y\sim\mathcal N(0.02,0.01^2)\). Compute the 95% equal-tailed credible interval (use \(z=1.96\)), the posterior probability \(P(\Delta>0\mid y)\), and the Bayes action between *ship* (loss 50 if \(\Delta\le0\), otherwise 0) and *hold* (loss 1 if \(\Delta>0\), otherwise 0). Explain why the interval alone does not determine the action.

**A5 · Foundation · paper — Weights.** For log importance weights \((-1000,-1001,-1004)\), normalize stably, calculate ESS, and show why direct exponentiation is numerically unsafe.

**A6 · Foundation · paper — Metropolis step.** On states \(\{0,1,2,3\}\), let target mass be proportional to \((1,2,4,3)\). The proposal moves to either neighboring state with probability 1/2 in the interior and moves inward with probability 1 at a boundary. Calculate every nonzero Metropolis–Hastings acceptance probability, including the proposal-ratio correction.

### Core — problems 7–13. Connect models, computation, and criticism.

**A7 · Core · paper — Prior predictive audit.** A classifier's accuracy \(p\) will be measured on \(n=50\) prompts. The candidate priors are \(\operatorname{Beta}(1,1)\), \(\operatorname{Beta}(1/2,1/2)\), and \(\operatorname{Beta}(16,4)\). For each, compute the prior predictive mean and SD of the success count \(S\) and the prior predictive \(P(S\le25)\) (no better than a coin on a balanced task). Domain knowledge says the system should score 70–95%. State which priors you would reject or revise and why.

**A8 · Core · paper — Posterior predictive audit.** Twelve users' weekly failure counts are \((0,0,0,0,0,0,1,1,2,3,9,14)\). Fit \(Y_i\mid\lambda\sim\operatorname{Poisson}(\lambda)\) with \(\lambda\sim\operatorname{Gamma}(1,0.1)\) (shape, rate). Using posterior replicated datasets, compare the observed number of zeros, the maximum, and the variance-to-mean ratio with their replicated distributions, then state what model feature is missing.

**A9 · Core · paper — Partial pooling.** Four tasks have observed gains \(y=(8,4,1,-3)\) with standard errors \(\sigma=(2,4,1,6)\). With \(\mu=2\) fixed, calculate \(E[\theta_j\mid y_j,\mu,\tau]\) for \(\tau=1\) and \(\tau=4\), and explain which tasks move most and why.

**A10 · Core · paper — Decision threshold.** Shipping a new model gains 10 units if \(\Delta>0\) and loses 100 if \(\Delta\le0\); holding yields 0. Derive the posterior-probability threshold for shipping. With \(\Delta\mid y\sim\mathcal N(0.5,0.4^2)\), compute \(P(\Delta>0\mid y)\) and the expected utility of shipping. Then redo the decision if the utility of shipping were instead linear, \(20\Delta\).

**A11 · Core · paper — Importance collapse.** Target \(\mathcal N(0,1)\) and estimate \(E[\theta^2]=1\) by self-normalized importance sampling with \(S=1000\) draws from proposals \(\mathcal N(m,s^2)\) for \((m,s)\in\{(0,1),(0,2),(0,0.5),(2,1),(3,1)\}\). Repeat each run 200 times (seed 0) and report the mean maximum normalized weight, the median and minimum ESS, and the RMSE; relate them to \(E_q[w^2]\), which equals \(e^{m^2}\) for \(s=1\) and \(s^2/\sqrt{2s^2-1}\) for \(m=0\).

**A12 · Core · paper — Metropolis tuning.** Target \(N(0,1)\) with random-walk proposals \(N(x,s^2)\) for \(s=0.1,1,10\). Run four chains of 50,000 iterations from \((-10,-2,2,10)\), discard 10,000, and compare acceptance, trace plots, autocorrelation, bulk/tail ESS, \(\hat R\), and Monte Carlo standard error for the mean and 0.99 quantile.

**A13 · Core · paper — Approximation comparison.** The posterior is \(p\mid y\sim\operatorname{Beta}(2,10)\). Compare exact values of the mean, SD, and \(P(p>0.3\mid y)\) with (a) the Laplace approximation at the mode, (b) self-normalized importance sampling with a \(\operatorname{Uniform}(0,1)\) proposal and \(S=10{,}000\), and (c) random-walk Metropolis with step 0.1 for 22,000 iterations, discarding 2,000. Explain each discrepancy.

### Stretch — problems 14–20. Diagnose realistic Bayesian failures.

**A14 · Stretch · paper — Prior sensitivity.** With zero events in 50 trials, analyze \(\operatorname{Beta}(1,1)\), \(\operatorname{Beta}(1,99)\), \(\operatorname{Beta}(1/2,1/2)\), and \(\operatorname{Beta}(20,980)\) priors. Report posterior mean, 95% credible interval, and \(P(p>0.05\mid y)\) without selecting a preferred conclusion after seeing the answers.

**A15 · Stretch · paper — Marginal-likelihood sensitivity.** Data are \(n=25\) draws from \(\mathcal N(\theta,1)\) with \(\bar y=0.4\). Compare \(M_0:\theta=0\) with \(M_1:\theta\sim\mathcal N(0,s^2)\) for \(s=0.1,0.5,1,10,100\). Compute \(\mathrm{BF}_{10}\) and the posterior mean of \(\theta\) under \(M_1\) for each \(s\), and explain why the Bayes factor keeps changing once the posterior mean has stabilized.

**A16 · Stretch · paper — Missed mode.** The target is \(\pi=0.3\,\mathcal N(-4,0.5^2)+0.7\,\mathcal N(3,1)\). (a) Importance sampling uses proposal \(\mathcal N(3,1.2^2)\) with \(S=5000\). Compute the expected number of proposal draws below \(-2\), the approximate ESS fraction, and the estimated versus true mean. (b) Four random-walk Metropolis chains with step 1 start at \(2,3,3.5,4\). Compute the valley-to-mode density ratio and explain why \(\hat R\) and ESS look reassuring. Name one repair for each method.

**A17 · Stretch · paper — Hierarchical funnel.** Eight groups have common \(\sigma_j=10\) and data \(y=(28,8,-3,7,-1,1,18,12)\), with \(\theta_j\sim\mathcal N(\mu,\tau^2)\). For \(\tau\in\{0.1,1,5,20\}\), compute the conditional posterior SD of \(\theta_j\) given \((\mu,\tau)\) in the centered parameterization and of \(\eta_j=(\theta_j-\mu)/\tau\) in the non-centered one. Explain which parameterization has a scale that stays roughly constant across \(\tau\), and predict where a fixed-step sampler fails.

**A18 · Stretch · paper — Selection-aware model.** Ten checkpoints all have true accuracy 0.70, and each is scored on its own 400-item validation set; the best is reported. Compute the expected reported accuracy of the winner. For a winner that scored 294/400, compute the naive \(\operatorname{Beta}(1,1)\) posterior mean, 95% interval, and \(P(p>0.70)\) that conditions only on the winner's data. Then describe a generative model that includes the selection step, and a fresh-test alternative.

**A19 · Stretch · paper — Simulation-based calibration.** For \(p\sim\operatorname{Beta}(2,2)\) and \(s\mid p\sim\operatorname{Binomial}(20,p)\), run SBC with 1,000 replications (seed 0) and 99 posterior draws each, binning the rank of the true \(p\) into 10 bins. Compare the correct posterior \(\operatorname{Beta}(2+s,22-s)\) with two buggy implementations, \(\operatorname{Beta}(2+s,22)\) (failures replaced by \(n\)) and \(\operatorname{Beta}(2+2s,2+2(20-s))\) (data counted twice). Report the bin counts and a chi-square statistic, and interpret each pattern.

**A20 · Stretch · paper — Full AI analysis.** Two models are compared on 6 tasks with 3 seeds each; rater noise is folded into each seed score. The seed-averaged task differences are \(\bar d=(0.04,0.01,0.03,-0.02,0.05,0.00)\), each with within-task SE 0.01. Fit \(\delta_j\sim\mathcal N(\mu,\tau^2)\), \(\bar d_j\sim\mathcal N(\delta_j,0.01^2)\), with a flat prior on \(\mu\) and \(\tau\) set by the method of moments. Report \(P(\mu>0\mid y)\) and \(P(\delta_{\mathrm{new}}>0\mid y)\), decide whether to claim "better on a new task" under a 0.9 posterior-probability rule, and list the checks you would run before reporting.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** Distinguish posterior and posterior predictive uncertainty.

**K2 · Core · gate — Derivation.** Derive the Beta–Bernoulli posterior update.

**K3 · Core · gate — Calculation.** With a Beta(1,1) prior and 3 successes, 1 failure, find the posterior mean.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-posterior experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does a high MCMC effective sample size alone establish correctness?

**K6 · Stretch · gate — RE/RS transfer.** Assess a Bayesian benchmark model before reporting rankings.

## Mastery check

Given an unfamiliar Bayesian analysis, write the joint generative model; explain and stress-test the prior; derive or compute posterior and predictive quantities; connect summaries to losses; choose a computational approximation; quantify its Monte Carlo error; diagnose importance weights or chains; perform predictive and sensitivity checks; and restrict conclusions to the population, hierarchy, and selection process actually modeled.

The next unit develops ML evaluation under seed variation, clustering, dependence, selection, contamination, and distribution shift.
