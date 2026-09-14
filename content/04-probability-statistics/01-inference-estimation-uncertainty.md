# Probability and statistics: inference, estimation, and uncertainty

**Prerequisites:** arithmetic, sums, [calculus](../02-mathematics/06-calculus-gradients-optimization.md) for continuous extensions. **Outcome:** distinguish a probability model, an estimate, and evidence about that estimate.

## Events and random variables

A probability space consists of outcomes $\Omega$, measurable events, and probabilities. A random variable maps outcomes to values. For a discrete variable, $p(x)\ge0$ and $\sum_xp(x)=1$. For a continuous variable, a density integrates to one; a density value is not a point probability and can exceed one.

Conditional probability is $P(A\mid B)=P(A\cap B)/P(B)$ when $P(B)>0$. Multiplying both ways yields Bayes' rule:

$$
P(H\mid D)=\frac{P(D\mid H)P(H)}{\sum_h P(D\mid h)P(h)}.
$$

The denominator sums over a partition of hypotheses. Likelihood treats observed data as fixed and parameters as variable; it need not sum to one over parameters.

**Worked example:** a rare event occurs in 1% of cases. A detector has 90% sensitivity and a 5% false-positive rate. Among 10,000 cases, expect 90 true positives and 495 false positives. Therefore $P(H\mid +)=90/585\approx0.154$, not 0.9.

> **Predict:** Keep sensitivity fixed and make prevalence ten times smaller. Which direction does positive predictive value move?

## Expectations and dependence

Linearity gives $E[aX+bY]=aE[X]+bE[Y]$ without independence. Variances satisfy

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y).
$$

Independence implies zero covariance when moments exist, but zero covariance does not generally imply independence. Let $X$ be symmetric around zero and $Y=X^2$: covariance can vanish despite deterministic dependence.

The laws of total expectation and variance are

$$
E[Y]=E[E[Y\mid X]],\qquad
\operatorname{Var}(Y)=E[\operatorname{Var}(Y\mid X)]+\operatorname{Var}(E[Y\mid X]).
$$

Derive the second by writing $Y-EY=(Y-E[Y\mid X])+(E[Y\mid X]-EY)$; the cross-term's conditional expectation is zero.

## Maximum likelihood and Bayesian estimation

For independent Bernoulli observations with $s$ successes among $n$ trials,

$$
\log L(\theta)=s\log\theta+(n-s)\log(1-\theta).
$$

Setting its derivative to zero gives $\hat\theta=s/n$ for the interior case. At all-zero or all-one data, the maximum lies on the boundary.

A Beta prior has density proportional to $\theta^{\alpha-1}(1-\theta)^{\beta-1}$. Multiplying by likelihood gives posterior Beta$(\alpha+s,\beta+n-s)$, with posterior mean

$$
E[\theta\mid D]=\frac{\alpha+s}{\alpha+\beta+n}.
$$

This is a weighted average of prior mean and empirical fraction. The posterior predictive probability of the next success equals that mean. MAP, posterior mean, and MLE solve different problems and need not coincide.

## Sampling uncertainty

For iid finite-variance observations, the sample mean has variance $\sigma^2/n$. The central limit theorem gives an asymptotic normal approximation after centering and scaling. It does not make arbitrary small-sample data normally distributed.

A frequentist 95% confidence procedure covers the fixed true parameter in 95% of repeated datasets under its assumptions. A Bayesian credible interval contains 95% posterior probability under its model and prior. Neither automatically survives biased sampling or model misspecification.

A p-value is a tail probability under a null model, not the probability the null is true. Repeatedly inspecting results and stopping when significant changes the procedure. Multiple comparisons and time dependence require explicit handling.

For your trading examples, iid bootstrap of individual returns destroys serial structure. For call-quality evaluation, repeated calls from the same customer or agent may be clustered. Choose resampling units that respect the data-generating structure.

## Lab and problems

1. Implement the Beta–Bernoulli update, then verify sequential and batch updates agree.
2. Simulate the rare-event detector and compare the posterior fraction with Bayes' rule.
3. Simulate confidence-interval coverage over repeated samples.
4. Generate symmetric $X$ and $Y=X^2$; compare covariance with dependence.
5. Explain why leakage cannot be repaired by narrower confidence intervals.

<details><summary>Solutions</summary>

Sequential updating adds the same total successes and failures. Lower prevalence increases the fraction of positive results caused by false positives. With symmetric $X$, $E[X^3]=0$ and covariance with $X^2$ can vanish. Confidence-interval simulation must fix the true parameter and resample complete datasets, not repeatedly resample one observation. Leakage changes the evaluation question and can bias the estimate.

</details>

**Mastery:** derive an estimator, identify its assumptions, and demonstrate its uncertainty empirically. Later units: common distributions, transformations/Jacobians, exponential families, sufficiency, hypothesis tests, t/F distributions, ANOVA, bootstrap, concentration, and dependent data.
