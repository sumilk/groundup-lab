---
id: math.statistics.estimation-likelihood-fisher
title: Estimation, likelihood, Fisher information, and asymptotics
prerequisites: [math.probability.limit-theorems-monte-carlo, math.probability.random-variables-distributions]
estimated_hours: 28
---

# Estimation, likelihood, Fisher information, and asymptotics

Probability starts with a model and derives what data might look like. Estimation reverses the direction: data have been observed, but some feature of the model or population is unknown.

That reversal creates several distinct questions:

- What quantity are we trying to learn?
- Which function of the data will estimate it?
- Across repeated datasets, is that function systematically wrong or highly variable?
- How does a probabilistic model turn observed data into a likelihood?
- When does maximizing likelihood recover the target?
- How much information does one observation carry?
- When are Gaussian standard-error calculations justified?

This chapter builds those ideas from finite examples to the asymptotic tools used in research. By the end, you should be able to distinguish a parameter from an estimator and an estimate, derive bias–variance–MSE decompositions, obtain Bernoulli and Gaussian maximum-likelihood estimators, diagnose non-identifiability, calculate Fisher information, explain consistency and asymptotic normality, use the delta method, and identify where misspecification or dependence invalidates familiar uncertainty formulas.

## 0. Parameter, estimand, estimator, and estimate

Suppose data \(X_1,\ldots,X_n\) come from an unknown distribution \(P\).

- A **parameter** is a coordinate in a model, such as the Bernoulli probability \(p\).
- An **estimand** is the population quantity we choose to learn, such as \(E_P[X]\), a median, or an accuracy difference. It need not be a model parameter.
- An **estimator** is a rule applied to random data:

$$
\hat\theta=T(X_1,\ldots,X_n).
$$

- An **estimate** is the numerical value of that rule after one dataset is observed.

The hat marks a random estimator before observation and a realized estimate after observation; context tells which meaning is intended.

**Worked example — estimating correctness.** Let \(X_i=1\) if a model answers prompt \(i\) correctly and \(0\) otherwise. Under an iid Bernoulli model, \(p\) is the unknown success probability, \(\hat p=\frac1n\sum_iX_i\) is an estimator, and \(0.73\) might be its value on one test set. If the target population changes from public benchmarks to deployed user requests, the estimand changes even if the formula for \(\hat p\) does not.

> **Practice — Foundation:** Label the parameter, estimator, estimate, and data in a study that reports an average latency of 182 ms from 500 requests.
>
> **Practice — Core:** Give an estimand that is not naturally a finite-dimensional model parameter, and construct an estimator for it.
>
> **Practice — Stretch:** Describe two different target populations for the same model-evaluation dataset. Explain why the same numerical estimate need not support both generalizations.

## 1. An estimator has a sampling distribution

Before data are observed, \(\hat\theta\) varies from dataset to dataset. Its probability law under a fixed data-generating distribution is the estimator's **sampling distribution**.

To study it conceptually:

1. fix the population or model parameter \(\theta\);
2. draw a complete dataset of size \(n\);
3. compute \(\hat\theta\);
4. repeat steps 2–3 many times.

This repeated-dataset thought experiment defines quantities such as

$$
E_\theta[\hat\theta],
\qquad
\operatorname{Var}_\theta(\hat\theta),
\qquad
P_\theta(|\hat\theta-\theta|>\varepsilon).
$$

The subscript reminds us that estimator behavior can depend on the unknown truth. An estimator can be excellent at one parameter value and poor at another.

**Worked example — two estimators of a mean.** For iid data with mean \(\mu\) and variance \(\sigma^2\), both \(X_1\) and \(\bar X_n\) are unbiased estimators of \(\mu\). Their variances are \(\sigma^2\) and \(\sigma^2/n\). Unbiasedness alone does not distinguish them, but their sampling distributions do.

> **Practice — Foundation:** Describe how to simulate the sampling distribution of a sample median from a known distribution.
>
> **Practice — Core:** Compare \(X_1\) and \((X_1+X_2)/2\) as estimators of a common mean, including expectation and variance.
>
> **Practice — Stretch:** Construct an estimator whose sampling distribution depends strongly on \(\theta\), then identify a parameter region where it performs poorly.

## 2. Bias and variance measure different errors

The bias of an estimator at \(\theta\) is

$$
\operatorname{Bias}_\theta(\hat\theta)
=E_\theta[\hat\theta]-\theta.
$$

An estimator is **unbiased** if this equals zero for every permitted \(\theta\). Its variance is

$$
\operatorname{Var}_\theta(\hat\theta)
=E_\theta\!\left[
(\hat\theta-E_\theta[\hat\theta])^2
\right].
$$

Bias measures displacement of the sampling-distribution center from the target. Variance measures spread around that center.

![Sampling distributions can be centered but wide, shifted but narrow, or both centered and narrow.](../assets/estimator-bias-variance.svg)

An unbiased estimator can be too noisy to use. A mildly biased estimator can make smaller errors overall. Bias is not automatically a defect; hidden or unquantified bias is the danger.

**Worked example — a deliberately biased mean.** If \(\bar X_n\) estimates \(\mu\), define

$$
\tilde\mu=\frac{n}{n+1}\bar X_n.
$$

Then

$$
E[\tilde\mu]=\frac{n}{n+1}\mu,
\qquad
\operatorname{Bias}(\tilde\mu)=-\frac{\mu}{n+1},
$$

and

$$
\operatorname{Var}(\tilde\mu)
=\left(\frac{n}{n+1}\right)^2\frac{\sigma^2}{n}.
$$

The shrinkage introduces bias but lowers variance. Whether it helps depends on \(\mu,\sigma^2\), and the loss used to judge error.

> **Practice — Foundation:** Compute the bias of \(2\bar X_n\) as an estimator of \(\mu\).
>
> **Practice — Core:** Find the bias and variance of \(a\bar X_n+b\) for estimating \(\mu\).
>
> **Practice — Stretch:** Give an example where unbiasedness is a poor primary design criterion because rare, enormous errors dominate the estimator's usefulness.

## 3. Mean squared error combines bias and variance

Under squared-error loss, the mean squared error is

$$
\operatorname{MSE}_\theta(\hat\theta)
=E_\theta[(\hat\theta-\theta)^2].
$$

Add and subtract \(E[\hat\theta]\):

$$
\hat\theta-\theta
=
(\hat\theta-E[\hat\theta])
+
(E[\hat\theta]-\theta).
$$

After squaring and taking expectations, the cross-term vanishes because \(E[\hat\theta-E[\hat\theta]]=0\). Therefore

$$
\boxed{
\operatorname{MSE}_\theta(\hat\theta)
=
\operatorname{Var}_\theta(\hat\theta)
+
\operatorname{Bias}_\theta(\hat\theta)^2
}.
$$

This identity is about one estimator at one parameter value. Comparing estimators globally requires specifying whether we care about worst-case MSE, average MSE under a distribution of parameter values, or performance in a particular region.

**Worked example — when shrinkage helps.** For \(\tilde\mu=a\bar X_n\),

$$
\operatorname{MSE}(\tilde\mu)
=a^2\frac{\sigma^2}{n}+(a-1)^2\mu^2.
$$

Differentiating with respect to \(a\) gives the MSE-minimizing value

$$
a^*=\frac{\mu^2}{\mu^2+\sigma^2/n}.
$$

This oracle value depends on unknown \(\mu\), so it is not directly usable. The calculation still reveals why stronger shrinkage is attractive when sampling noise is large relative to signal.

> **Practice — Foundation:** Compute MSE from bias \(0.2\) and variance \(0.09\).
>
> **Practice — Core:** Derive the bias–variance decomposition without skipping the cross-term.
>
> **Practice — Stretch:** Compare two estimators whose MSE curves cross as \(\theta\) changes. Explain why declaring one estimator “best” requires a parameter region or decision criterion.

## 4. The plug-in principle and empirical distribution

Many estimators arise by replacing an unknown population distribution with the empirical distribution, which assigns mass \(1/n\) to each observation.

If

$$
\theta=E_P[g(X)],
$$

the plug-in estimator is

$$
\hat\theta
=\frac1n\sum_{i=1}^ng(X_i).
$$

Examples include:

- population mean \(\rightarrow\) sample mean;
- event probability \(\rightarrow\) observed event fraction;
- population second moment \(\rightarrow n^{-1}\sum_iX_i^2\);
- population CDF \(F(t)\) \(\rightarrow n^{-1}\sum_i\mathbf1\{X_i\le t\}\).

Plug-in does not guarantee unbiasedness. The population variance can be written

$$
\sigma^2=E[(X-\mu)^2].
$$

Replacing both \(P\) and \(\mu\) gives

$$
\frac1n\sum_i(X_i-\bar X_n)^2,
$$

which is biased downward for iid finite-variance data because the same observations estimated the center. Multiplying by \(n/(n-1)\) gives the familiar unbiased sample variance when \(n\ge2\).

> **Practice — Foundation:** Write plug-in estimators for \(E[X^3]\) and \(P(X>5)\).
>
> **Practice — Core:** Show algebraically that \(n^{-1}\sum_i(X_i-\bar X)^2=n^{-1}\sum_iX_i^2-\bar X^2\).
>
> **Practice — Stretch:** Find a nonlinear population functional for which a naive plug-in estimate is biased. Use simulation to study whether the bias vanishes with sample size.

## 5. Likelihood compares parameter values after data are fixed

Let a model assign density or mass \(p_\theta(x)\) to observation \(x\). For iid observed data \(x_1,\ldots,x_n\), the likelihood is

$$
L(\theta;x_{1:n})
=\prod_{i=1}^np_\theta(x_i).
$$

The same expression is read in two directions:

- as a function of possible data with \(\theta\) fixed, it is a probability mass or density;
- as a function of \(\theta\) with observed data fixed, it is a likelihood.

A likelihood need not integrate or sum to one over \(\theta\). It is not a posterior probability distribution over parameters.

Products of many probabilities underflow, so use the log-likelihood

$$
\ell(\theta)
=\log L(\theta)
=\sum_{i=1}^n\log p_\theta(x_i).
$$

The logarithm preserves the maximizer because it is strictly increasing.

![With data fixed, a larger sample usually produces a sharper log-likelihood peak around its maximizer.](../assets/likelihood-curvature.svg)

Likelihood is comparative within a specified model. A high likelihood under one parameter does not prove the model family is adequate, and raw likelihoods from datasets of different sizes are not directly comparable.

> **Practice — Foundation:** Explain why \(L(\theta;x)\) is not generally a probability distribution over \(\theta\).
>
> **Practice — Core:** Derive the log-likelihood for iid Poisson observations and identify which data summary it depends on.
>
> **Practice — Stretch:** Construct two model families whose likelihood maxima cannot be compared meaningfully without accounting for model complexity or predictive evaluation.

## 6. Bernoulli maximum likelihood from first principles

For observations \(x_i\in\{0,1\}\) and success count \(s=\sum_ix_i\),

$$
L(p)=p^s(1-p)^{n-s},
\qquad 0\le p\le1.
$$

For \(0<p<1\),

$$
\ell(p)=s\log p+(n-s)\log(1-p).
$$

Differentiate:

$$
\ell'(p)=\frac{s}{p}-\frac{n-s}{1-p}.
$$

Setting the score to zero gives

$$
s(1-p)=(n-s)p
\quad\Longrightarrow\quad
\hat p_{\text{MLE}}=\frac{s}{n}.
$$

The second derivative

$$
\ell''(p)
=-\frac{s}{p^2}-\frac{n-s}{(1-p)^2}
$$

is negative in the interior, confirming a maximum.

**Boundary cases matter.** If \(s=0\), the maximum is \(p=0\); if \(s=n\), it is \(p=1\). The derivative-zero argument does not find these boundary maxima.

**Worked example — seven successes.** For \(s=7,n=10\), the MLE is \(0.7\), and the maximized log-likelihood is

$$
7\log(0.7)+3\log(0.3)\approx-6.109.
$$

This negative number is normal: probabilities are at most one, so their logarithms are nonpositive.

> **Practice — Foundation:** Derive the Bernoulli MLE for 18 successes in 30 trials and evaluate the score at the answer.
>
> **Practice — Core:** Compare the likelihood at \(p=0.4,0.6,0.8\) for 8 successes in 10 trials without multiplying tiny numbers.
>
> **Practice — Stretch:** Study the all-success case. Explain why the plug-in Fisher standard error becomes zero and why that does not mean the unknown probability is known exactly.

## 7. General maximum-likelihood workflow

A maximum-likelihood estimator is

$$
\hat\theta_{\text{MLE}}
\in\arg\max_{\theta\in\Theta}\ell(\theta).
$$

The notation permits multiple maximizers. A reliable workflow is:

1. specify the observation model and parameter space \(\Theta\);
2. write the joint likelihood, including dependence if present;
3. move to log space;
4. identify data terms that do not depend on \(\theta\);
5. differentiate only where valid;
6. check stationary points, boundaries, constraints, and non-identifiability;
7. verify the candidate numerically;
8. assess model fit separately from optimization success.

The equation \(\nabla\ell(\theta)=0\) is neither necessary nor sufficient for a global maximum. Constrained optima can lie on boundaries; non-concave likelihoods can have local maxima and saddle points.

**Invariance of the MLE.** If \(\eta=g(\theta)\) and \(g\) is one-to-one, then the MLE of \(\eta\) is \(g(\hat\theta)\). For many-to-one transformations, define the induced likelihood carefully and maximize over all preimages.

> **Practice — Foundation:** List the checks required after solving a score equation.
>
> **Practice — Core:** Find the MLE of the rate \(\lambda\) from iid exponential observations, including the parameter constraint.
>
> **Practice — Stretch:** Give a likelihood with multiple local maxima and describe how you would separate an optimization failure from genuine non-identifiability.

## 8. Gaussian MLE and the degrees-of-freedom correction

Let \(X_i\sim\mathcal N(\mu,\sigma^2)\) iid with both parameters unknown. Ignoring constants,

$$
\ell(\mu,\sigma^2)
=-\frac n2\log\sigma^2
-\frac{1}{2\sigma^2}\sum_{i=1}^n(x_i-\mu)^2.
$$

For fixed \(\sigma^2\), maximizing over \(\mu\) minimizes squared deviations, giving

$$
\hat\mu_{\text{MLE}}=\bar x.
$$

Substituting \(\bar x\) and differentiating with respect to \(\sigma^2\) gives

$$
\hat\sigma^2_{\text{MLE}}
=\frac1n\sum_{i=1}^n(x_i-\bar x)^2.
$$

Under iid Gaussian sampling—and more generally for iid data with finite variance—

$$
E[\hat\sigma^2_{\text{MLE}}]
=\frac{n-1}{n}\sigma^2.
$$

Thus the MLE is biased downward. The unbiased estimator is

$$
s^2=\frac1{n-1}\sum_i(x_i-\bar x)^2.
$$

MLE and unbiasedness optimize different criteria. The MLE chooses the parameter that maximizes observed-data likelihood; the correction chooses a scaling with exact repeated-sample expectation \(\sigma^2\).

**Worked example — two observations.** For data \(0,2\), \(\bar x=1\). Squared deviations sum to 2, so the Gaussian MLE variance is \(1\), while the unbiased sample variance is \(2\). With so little data, estimating the mean has consumed substantial information about spread.

> **Practice — Foundation:** Compute Gaussian mean and variance MLEs for \(1,2,6\).
>
> **Practice — Core:** Prove \(\sum_i(x_i-\mu)^2=\sum_i(x_i-\bar x)^2+n(\bar x-\mu)^2\) and use it to establish the mean MLE.
>
> **Practice — Stretch:** Simulate Gaussian samples at several \(n\) and compare empirical bias and MSE of the \(1/n\) and \(1/(n-1)\) variance estimators.

## 9. Identifiability and sufficient summaries

### Identifiability

A parameter is identifiable if different parameter values imply different observable distributions:

$$
P_{\theta_1}=P_{\theta_2}
\quad\Longrightarrow\quad
\theta_1=\theta_2.
$$

If \(X\sim\mathcal N(\theta^2,1)\) with \(\theta\in\mathbb R\), then \(\theta\) and \(-\theta\) produce the same distribution. No amount of data can determine the sign without another assumption. This is not an optimizer defect; it is missing information in the model.

Neural networks often have parameter symmetries. Permuting hidden units can leave the represented function unchanged. Parameter non-identifiability need not prevent accurate prediction, but it changes how parameter uncertainty should be interpreted.

### Sufficiency

A statistic \(T(X)\) is sufficient for \(\theta\) when, under the model, the remaining details of the sample contain no additional information about \(\theta\).

For Bernoulli data,

$$
L(p;x_{1:n})=p^{\sum x_i}(1-p)^{n-\sum x_i}.
$$

The likelihood depends on the sequence only through \(S=\sum_iX_i\), so the success count is sufficient for \(p\). Order can be discarded for estimating \(p\) under the iid Bernoulli model.

Sufficiency is model-dependent. If success probability drifts over time, order may be crucial.

> **Practice — Foundation:** Show why \(\theta\) is not identifiable in the model \(X\sim\mathcal N(\theta^2,1)\).
>
> **Practice — Core:** Identify a sufficient statistic for the Poisson rate from iid observations by factoring the likelihood.
>
> **Practice — Stretch:** Give an example where compressing data to a formerly sufficient statistic destroys evidence after the model is expanded.

## 10. Score and Fisher information

For one observation, the **score** is the derivative of log probability or density:

$$
U_\theta(X)
=\frac{\partial}{\partial\theta}\log p_\theta(X).
$$

Under regularity conditions that allow differentiation through the integral,

$$
E_\theta[U_\theta(X)]=0.
$$

Fisher information can then be written in two equivalent ways:

$$
I_1(\theta)
=E_\theta[U_\theta(X)^2]
=-E_\theta\!\left[
\frac{\partial^2}{\partial\theta^2}\log p_\theta(X)
\right].
$$

Interpretations:

- the score measures how one observation locally pushes the fitted parameter;
- large score variance means observations respond strongly to parameter changes;
- large negative expected curvature means the likelihood peak is locally sharp.

For independent observations, scores add and information adds:

$$
I_n(\theta)=nI_1(\theta).
$$

**Worked example — Bernoulli information.** The one-observation score is

$$
U_p(X)=\frac{X}{p}-\frac{1-X}{1-p}
=\frac{X-p}{p(1-p)}.
$$

Since \(\operatorname{Var}(X)=p(1-p)\),

$$
I_1(p)=\frac1{p(1-p)}.
$$

This grows near the boundary in the \(p\) parameterization, but regular asymptotic approximations become delicate there. Information is local and parameterization-dependent; it is not a universal count of useful examples.

> **Practice — Foundation:** Derive the score for one Gaussian observation when variance is known and mean is the parameter.
>
> **Practice — Core:** Compute Fisher information for the Gaussian mean and verify additivity across \(n\) independent observations.
>
> **Practice — Stretch:** Reparameterize Bernoulli probability by log odds \(\eta=\log(p/(1-p))\). Derive information for \(\eta\) and explain why its numerical value differs from information for \(p\).

## 11. The Cramér–Rao lower bound and efficiency

Under regularity conditions, any unbiased estimator \(\hat\theta\) satisfies

$$
\operatorname{Var}_\theta(\hat\theta)
\ge
\frac1{I_n(\theta)}.
$$

This is the Cramér–Rao lower bound. It says that within the class of unbiased estimators and under the stated model, information limits precision.

For iid Bernoulli data,

$$
\operatorname{Var}(\hat p)
=\frac{p(1-p)}n
=\frac1{I_n(p)}.
$$

The sample proportion attains the bound and is efficient in this finite-sample sense.

Important qualifications:

- biased estimators require a modified bound;
- boundary parameters and parameter-dependent support can violate regularity;
- nuisance parameters change the relevant information calculation;
- a lower bound inside a wrong model does not guarantee real-world accuracy;
- attaining the bound does not make the chosen estimand scientifically useful.

> **Practice — Foundation:** Evaluate the Bernoulli Cramér–Rao bound at \(p=0.5,n=100\).
>
> **Practice — Core:** Show that the sample mean attains the bound when estimating a Gaussian mean with known variance.
>
> **Practice — Stretch:** Explain how a biased shrinkage estimator can have MSE below an unbiased Cramér–Rao variance bound without contradiction.

## 12. Consistency asks whether error vanishes

An estimator is consistent for \(\theta\) if

$$
\hat\theta_n\xrightarrow{P}\theta.
$$

The Bernoulli MLE \(\hat p=\bar X_n\) is consistent by the law of large numbers.

Unbiasedness and consistency are different:

- \(X_1\) is unbiased for a common mean but not consistent because it does not use increasing information;
- \(\frac{n}{n+1}\bar X_n\) is biased for every finite \(n\) but consistent because its bias and variance both vanish.

For MLE, divide the log-likelihood by \(n\):

$$
\frac1n\ell_n(\theta)
=\frac1n\sum_{i=1}^n\log p_\theta(X_i).
$$

The law of large numbers suggests convergence to

$$
E_{\theta_0}[\log p_\theta(X)].
$$

Under identifiability and additional uniformity conditions, this expected log-likelihood is uniquely maximized at the true parameter \(\theta_0\), leading the empirical maximizer toward \(\theta_0\).

Pointwise convergence of the objective is not by itself enough to guarantee convergence of its maximizer. The parameter space, continuity, tails, and control over all candidate parameters matter.

> **Practice — Foundation:** Decide whether \(X_1\), \(\bar X_n+1/n\), and \(2\bar X_n\) are consistent for \(\mu\).
>
> **Practice — Core:** Prove consistency of the sample proportion using either the weak law or Chebyshev.
>
> **Practice — Stretch:** Construct objective functions that converge pointwise but whose maximizers escape. Explain why MLE consistency needs more than pointwise convergence.

## 13. Asymptotic normality explains the local error shape

Under regularity conditions, a one-dimensional MLE often satisfies

$$
\sqrt n(\hat\theta-\theta_0)
\xrightarrow{d}
\mathcal N\!\left(0,\frac1{I_1(\theta_0)}\right).
$$

Equivalently, for large \(n\),

$$
\hat\theta
\approx
\mathcal N\!\left(
\theta_0,\frac1{nI_1(\theta_0)}
\right).
$$

![Consistency makes the raw sampling distribution contract, while asymptotic normality describes the stable shape of the square-root-scaled error.](../assets/asymptotic-estimator.svg)

The core derivation is a Taylor expansion of the sample score around the truth:

$$
0=U_n(\hat\theta)
\approx
U_n(\theta_0)
+
(\hat\theta-\theta_0)U_n'(\theta_0).
$$

Rearranging,

$$
\sqrt n(\hat\theta-\theta_0)
\approx
-
\frac{U_n(\theta_0)/\sqrt n}
{U_n'(\theta_0)/n}.
$$

The numerator follows a CLT because it is a sum of mean-zero scores. The denominator follows a law of large numbers toward \(-I_1(\theta_0)\).

In practice, substitute the estimate:

$$
\widehat{\operatorname{SE}}(\hat\theta)
\approx
\frac1{\sqrt{nI_1(\hat\theta)}}.
$$

Observed information uses the realized negative Hessian; expected information averages that curvature under the model. They are asymptotically related but need not match exactly in a finite dataset.

> **Practice — Foundation:** Use Bernoulli Fisher information to recover the large-sample standard error of \(\hat p\).
>
> **Practice — Core:** Fill in the Taylor-score derivation and state which limit theorem justifies numerator and denominator.
>
> **Practice — Stretch:** List three nonregular settings—such as a boundary or mixture model—where the usual square-root-\(n\) Gaussian approximation can fail, and predict the failure mode.

## 14. Transforming estimators: invariance and the delta method

Often the target is \(\eta=g(\theta)\). MLE invariance suggests

$$
\hat\eta=g(\hat\theta).
$$

To approximate its uncertainty, expand \(g\) around \(\theta\):

$$
g(\hat\theta)
\approx
g(\theta)+g'(\theta)(\hat\theta-\theta).
$$

If

$$
\sqrt n(\hat\theta-\theta)
\xrightarrow{d}\mathcal N(0,V),
$$

then the delta method gives

$$
\sqrt n\bigl(g(\hat\theta)-g(\theta)\bigr)
\xrightarrow{d}
\mathcal N\!\left(0,[g'(\theta)]^2V\right).
$$

For vector parameters, replace \(g'\) with the gradient or Jacobian.

**Worked example — log odds.** For Bernoulli \(p\), let

$$
g(p)=\log\frac{p}{1-p},
\qquad
g'(p)=\frac1{p(1-p)}.
$$

Since \(\operatorname{Var}(\hat p)\approx p(1-p)/n\),

$$
\operatorname{Var}(g(\hat p))
\approx\frac1{np(1-p)}.
$$

At \(\hat p=0.7,n=400\), the plug-in standard error on the log-odds scale is about

$$
\sqrt{\frac1{400(0.7)(0.3)}}\approx0.109.
$$

If \(g'(\theta)=0\), the first-order delta method degenerates and a higher-order expansion may be needed.

> **Practice — Foundation:** Use the delta method for \(g(\mu)=\mu^2\) when \(\bar X_n\) estimates a nonzero mean.
>
> **Practice — Core:** Derive an approximate variance for \(\log\hat\lambda\) when \(\hat\lambda\) is an asymptotically normal positive rate estimate.
>
> **Practice — Stretch:** Analyze what happens to the first-order delta method for \(g(\theta)=\theta^2\) at \(\theta=0\). Use a second-order argument to predict a non-Gaussian limit.

## 15. Regularization, penalized likelihood, and MAP

Pure maximum likelihood optimizes

$$
\ell(\theta).
$$

Penalized likelihood optimizes

$$
\ell(\theta)-\lambda R(\theta),
$$

where \(R\) encodes a preference such as small norm or smoothness. The penalty typically introduces bias while reducing variance or preventing unstable solutions.

Scaling matters. If \(\ell\) is a sum over \(n\) observations while \(\lambda\) is fixed, the data term grows with \(n\). If software minimizes average negative log-likelihood plus \(\lambda R\), the meaning of the same numerical \(\lambda\) differs.

With a prior density \(\pi(\theta)\), a maximum a posteriori estimate maximizes

$$
\ell(\theta)+\log\pi(\theta).
$$

This looks like penalized likelihood, but the interpretation differs: MAP is a posterior mode under a specified prior and parameterization.

**Worked example — Beta–Bernoulli shrinkage.** With a \(\operatorname{Beta}(\alpha,\beta)\) prior and \(s\) successes,

$$
\hat p_{\text{MAP}}
=\frac{s+\alpha-1}{n+\alpha+\beta-2}
$$

for an interior mode when \(\alpha,\beta>1\). The posterior mean is

$$
\frac{s+\alpha}{n+\alpha+\beta}.
$$

They are different estimators. Both shrink the raw proportion toward a prior-dependent center.

> **Practice — Foundation:** Identify the likelihood term and penalty in ridge regression.
>
> **Practice — Core:** Derive the interior Beta–Bernoulli MAP estimate and compare it with the MLE and posterior mean.
>
> **Practice — Stretch:** Show how changing from summed to averaged loss changes the effective regularization strength unless \(\lambda\) is rescaled.

## 16. Misspecification, dependence, and selection

The clean formulas above describe behavior under a chosen model. Real failures often come from outside its parameter coordinates.

### Misspecification

If the true distribution is not in \(\{P_\theta\}\), an MLE can converge to the parameter whose model is closest in expected log loss rather than to a literal truth. The estimator may remain useful, but model-based Fisher standard errors can be wrong.

Under suitable conditions, the asymptotic covariance of the square-root-scaled error has the sandwich form

$$
H^{-1}JH^{-1},
$$

where \(H\) is per-observation expected objective curvature and \(J\) is per-observation score variability. The estimator's covariance is therefore approximately \(H^{-1}JH^{-1}/n\). Under a correctly specified regular model, the information identity makes these pieces agree. Under misspecification, they need not.

### Dependence

If observations are clustered or sequential, joint likelihood does not factor into independent row terms. Treating it as though it does often preserves a familiar point estimate while underestimating uncertainty. Cluster-level resampling, cluster-robust calculations, time-series models, or explicit hierarchical likelihoods may be required.

### Selection

Choosing a model, checkpoint, prompt, metric, or stopping time using the same data changes the sampling distribution of the reported estimate. Ordinary fixed-estimator standard errors do not include this selection stage.

**Worked example — best checkpoint.** Suppose 50 checkpoints have identical true quality but noisy validation estimates. Reporting only the maximum validation score produces upward bias. Increasing validation-set size reduces per-checkpoint noise, but the selection bias depends also on the number and dependence of comparisons. An untouched test set estimates the selected checkpoint's performance without reusing the selection noise.

> **Practice — Foundation:** Classify three failures as misspecification, dependence, or selection.
>
> **Practice — Core:** Explain why repeated rows per user may leave a sample mean unchanged but make its iid standard error too small.
>
> **Practice — Stretch:** Design a simulation that separates model misspecification from post-selection bias in a many-checkpoint workflow.

## 17. Likelihood and estimation in ML systems

Many familiar ML objectives are likelihood estimators in disguise:

- binary cross-entropy is negative Bernoulli log-likelihood;
- multiclass cross-entropy is negative categorical log-likelihood;
- squared error corresponds to Gaussian conditional likelihood with fixed variance;
- token-level negative log-likelihood fits a conditional categorical distribution at each position.

But several cautions remain:

- a conditional likelihood estimates \(P(Y\mid X)\), not the input distribution \(P(X)\);
- minibatches approximate an optimization objective; they do not create more independent data;
- overparameterized networks can have many parameter values representing the same predictions;
- low training loss does not establish calibration, causal validity, robustness, or task utility;
- token-level likelihood can overweight long documents or correlated sequences;
- evaluation after architecture and hyperparameter search includes selection.

**Worked example — cross-entropy as MLE.** If a classifier emits \(q_\theta(x)\) for \(P(Y=1\mid X=x)\), one observation contributes

$$
y\log q_\theta(x)
+(1-y)\log(1-q_\theta(x)).
$$

Summing this conditional Bernoulli log-likelihood over data and maximizing it is equivalent to minimizing binary cross-entropy. The statistical statement depends on how examples were sampled and whether the conditional model is adequate—not only on whether gradient descent finds a low value.

Before interpreting a fitted number, ask:

1. What population quantity is being estimated?
2. Which randomness defines repeated datasets?
3. Is the model identifiable at the prediction or parameter level?
4. Does the uncertainty calculation include clustering and selection?
5. Would a different loss better match the actual decision?

> **Practice — Foundation:** Match binary cross-entropy, multiclass cross-entropy, and squared error to their basic likelihood models.
>
> **Practice — Core:** Derive the binary cross-entropy objective from a conditional Bernoulli likelihood and identify the iid factorization assumption.
>
> **Practice — Stretch:** Audit a token-level likelihood comparison between two language models when documents have very different lengths and domains. Propose estimands at both token and document levels.

## 18. Runnable lab: Bernoulli maximum likelihood

Implement **bernoulli_mle** in [labs/exercises.py](../../labs/exercises.py). Given a nonempty iterable containing integer zeros and ones, return:

1. the maximum-likelihood probability estimate;
2. the maximized log-likelihood, using the convention \(0\log0=0\);
3. the plug-in asymptotic standard error.

Run:

~~~text
python -m labs.checks bernoulli-mle
~~~

The checks cover mixed outcomes, all-zero and all-one boundaries, generators, replication scaling, input preservation, and invalid observations.

### Guided experiment

For true probabilities \(0.02,0.2,0.5,\) and \(0.9\), and several sample sizes:

1. repeat complete Bernoulli datasets many times;
2. plot the sampling distribution of the MLE;
3. measure empirical bias, variance, and MSE;
4. compare empirical standard deviation with the average plug-in standard error;
5. record how often boundary estimates occur;
6. identify where the Gaussian approximation is unreliable.

## 19. Derivations to own

1. Derive the bias–variance decomposition for squared error.
2. Derive bias and variance of an affine transformation of the sample mean.
3. Derive Bernoulli MLE, including boundary cases.
4. Derive Gaussian mean and variance MLEs.
5. Prove the \(n-1\) correction makes sample variance unbiased.
6. Identify sufficient statistics for Bernoulli, Poisson, and Gaussian models.
7. Derive the score and Fisher information for Bernoulli and Gaussian means.
8. Verify the Cramér–Rao bound for a sample mean.
9. Explain MLE consistency through expected log-likelihood and identifiability.
10. Reconstruct the Taylor-score argument for asymptotic normality.
11. Derive the one-dimensional delta method.
12. Derive the Beta–Bernoulli MAP estimator and distinguish it from the posterior mean.

## 20. End-of-unit practice (graded)

**Foundation — problems 1–4.** Distinguish estimation objects and execute direct bias, likelihood, and information calculations.

1. **Language.** For three studies, identify data, target population, estimand, estimator, estimate, and sampling distribution.
2. **Bias and MSE.** Compute bias, variance, and MSE for \(a\bar X+b\) as an estimator of \(\mu\).
3. **Bernoulli likelihood.** Derive and evaluate the likelihood, log-likelihood, score, MLE, and plug-in standard error for 24 successes in 40 trials.
4. **Gaussian estimation.** Compute the Gaussian mean MLE, variance MLE, and unbiased variance estimate for a small dataset.

**Core — problems 5–9.** Derive estimator properties and connect likelihood curvature to uncertainty.

5. **Competing estimators.** Compare the MSE of \(\bar X_n\) and \(a\bar X_n\). Determine the region of \(\mu\) where a specified \(a<1\) improves MSE.
6. **Exponential rate.** Derive the MLE, score, Fisher information, Cramér–Rao bound, and asymptotic standard error for an iid exponential rate.
7. **Sufficiency.** Factor three likelihoods to identify data summaries sufficient for their parameters; then describe one model change that makes each compression insufficient.
8. **Consistency.** Prove a biased estimator is consistent by separately controlling its bias and variance.
9. **Delta method.** Derive approximate uncertainty for a ratio, log rate, or odds transformation and validate it with repeated simulation.

**Stretch — problems 10–14.** Diagnose nonregularity, misspecification, dependence, and selection in realistic research workflows.

10. **Non-identifiability.** Build a model with a parameter symmetry, show the likelihood has equivalent maxima, and distinguish prediction identifiability from parameter identifiability.
11. **Boundary behavior.** Study Bernoulli MLEs near \(p=0\) at small \(n\). Compare empirical sampling distributions with plug-in Gaussian approximations and explain the zero-standard-error pathology.
12. **Misspecified likelihood.** Fit a single Gaussian to mixture data. Compare model-based Fisher uncertainty, repeated-sample empirical variation, and held-out predictive diagnostics.
13. **Clustered estimation.** Estimate an accuracy difference from prompts nested within users or tasks. Compare row-iid, cluster-aware, and paired uncertainty calculations.
14. **Post-selection estimation.** Simulate selection of the best among many equally good configurations. Quantify validation optimism and test-set correction as the number of candidates and their correlation change.

<details><summary>Worked solution sketches</summary>

1. A complete answer separates the population quantity from its data-dependent rule and treats the sampling distribution as variation across complete repeated datasets, not variation among rows inside one observed dataset.
2. \(E[a\bar X+b]=a\mu+b\), so bias is \((a-1)\mu+b\). Under iid sampling variance is \(a^2\sigma^2/n\); MSE adds the squared bias.
3. With \(s=24,n=40\), \(\hat p=0.6\). The maximized log-likelihood is \(24\log0.6+16\log0.4\), the score vanishes at \(0.6\), and plug-in standard error is \(\sqrt{0.6(0.4)/40}\).
4. The mean is the arithmetic average. Squared deviations divided by \(n\) give the Gaussian variance MLE; dividing by \(n-1\) gives the unbiased estimator.
5. The unshrunk MSE is \(\sigma^2/n\). The shrunk MSE is \(a^2\sigma^2/n+(a-1)^2\mu^2\). Solve the strict inequality between them for the requested \(a\).
6. For exponential density \(\lambda e^{-\lambda x}\), \(\hat\lambda=1/\bar X\), one-observation information is \(1/\lambda^2\), and the asymptotic variance is \(\lambda^2/n\). Verify the parameter is positive and distinguish finite-sample bias from asymptotic behavior.
7. Factorization makes Bernoulli depend on \(\sum X_i\), Poisson on \(\sum X_i\), and Gaussian forms on sums and squared sums depending on which parameters are unknown. Time variation, dependence, or additional parameters can make order or other details informative.
8. One route is Chebyshev around the estimator's expectation: bound stochastic deviation by its vanishing variance, then use the triangle inequality with a deterministic bias that tends to zero.
9. Apply a first-order Taylor expansion. For a ratio, use a two-variable gradient and the full covariance matrix; simulation should resample paired inputs so covariance is preserved.
10. Sign, label-switching, and hidden-unit permutation symmetries all work. Equivalent parameters can produce identical observable laws even when the induced predictive distribution is uniquely determined.
11. Small samples near a boundary frequently produce \(\hat p=0\), whose plug-in standard error is zero. The true repeated-sample error is not zero; the regular interior Taylor approximation has failed.
12. A single Gaussian can target mixture mean and variance while missing modes and tails. Model curvature assumes the fitted family; repeated datasets reveal estimator variation under the mixture; held-out density and residual diagnostics expose predictive misspecification.
13. Row-iid formulas omit within-cluster covariance. Cluster-aware methods use independent clusters; pairing uses within-unit differences. The correct comparison depends on the intended population of new prompts, users, or tasks.
14. Maximizing noisy validation values creates optimism. An untouched test set removes reuse of validation noise for the selected model, while more candidates generally increase optimism and stronger correlation among candidates reduces the effective number of distinct comparisons.

</details>

## Mastery check

Given an unfamiliar estimation problem, name the target and sampling unit; propose an estimator; derive or simulate its bias, variance, and MSE; write and maximize a likelihood; check boundaries and identifiability; calculate information and an asymptotic standard error when regularity permits; and explain how misspecification, dependence, regularization, or selection changes the conclusion.

The next unit develops hypothesis testing, confidence intervals, power, effect sizes, likelihood-ratio tests, and multiple-comparison control.
