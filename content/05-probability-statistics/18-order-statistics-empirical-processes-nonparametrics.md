---
id: math.statistics.order-statistics-empirical-processes
title: Order statistics, empirical processes, rank tests, and density estimation
prerequisites: [math.statistics.hypothesis-testing-confidence-power, math.statistics.resampling-sequential-experimental-design]
estimated_hours: 44
---

# Order statistics, empirical processes, rank tests, and density estimation

Every method so far has assumed a family. Maximum likelihood needs a likelihood; a GLM needs a link and a variance function; a mixture needs component shapes. This unit asks what remains estimable when you refuse to name a family at all, and the answer is more than most people expect — but the guarantees change character, from "efficient if the model is right" to "valid whatever the distribution, at a cost in efficiency."

Three threads run through it. **Order statistics** are what you get by sorting, and they turn out to have exact, computable distributions that depend on the population only through its CDF. **Empirical process theory** upgrades the plug-in principle from pointwise consistency, which lessons 06 and 08 established, to *uniform* control over the whole distribution function, with a finite-sample band you can draw. **Ranks** replace values by their positions, and because the rank vector has the same distribution under any continuous population, statistics built from ranks have null distributions you can compute exactly without knowing anything.

The practical payoff for AI work is concentrated and specific. A win rate between two models — the fraction of prompts where A scores above B — is exactly the Mann–Whitney estimand, with consequences for ranking that most leaderboards get wrong. A p99 latency claim is a statement about an order statistic, with uncertainty that behaves nothing like a mean's. And the conformal threshold from lesson 13 is literally an order statistic, its coverage guarantee a rank argument.

By the end, you should be able to derive the distribution of any order statistic; state the asymptotic distribution of a sample quantile and explain the density in its denominator; distinguish Glivenko–Cantelli from the pointwise law of large numbers and both from DKW; draw a finite-sample uniform confidence band; explain why rank statistics are distribution-free and what that costs in efficiency; compute and correctly interpret Mann–Whitney, including why it is not a test of medians and why win rates are not transitive; recognize U-statistics as the common framework; use kernel density estimation with a defensible bandwidth and know its rate and boundary problems; and apply Rao–Blackwellization to reduce Monte Carlo variance.

## 0. What distribution-free means, and what it does not

A procedure is **distribution-free** when its behaviour under the null hypothesis does not depend on the population distribution. A **nonparametric** model is one whose parameter is the distribution itself rather than a finite-dimensional vector. The two often travel together and are not the same thing.

Three clarifications prevent most confusion.

**Distribution-free is a statement about the null, not about power.** The Wilcoxon test's null distribution is the same for every continuous population, so its type I error is exact. Its *power* depends heavily on the population, and so does the meaning of the alternative it detects.

**Nonparametric does not mean assumption-free.** Independence, identical distribution, exchangeability, continuity, and smoothness are all still assumptions, and the first is usually the one that fails in logged data. A nonparametric method applied to dependent rows is wrong in exactly the way lesson 10 described for clustered evaluation.

**Assuming less costs something, and the currency is rate.** Estimating a mean converges at \(n^{-1/2}\). Estimating a whole density converges at \(n^{-2/5}\) in one dimension and worse in more, because you are estimating infinitely many things at once. Refusing to name a family is not free; it is paid for in sample size.

**Worked example — the same question, three commitments.** "Is model B better?" can mean: the mean score difference is positive (a parametric or asymptotic claim about one number), the median difference is positive (a location claim needing much less structure), or \(P(B>A)>1/2\) (a purely ordinal claim). The three can disagree in sign on the same data, and the choice among them is substantive, not statistical.

> **Practice — Foundation:** Distinguish distribution-free from nonparametric with one example of each.
>
> **Practice — Core:** Name three assumptions a "nonparametric" evaluation still makes, and which is most likely to fail on logged traffic.
>
> **Practice — Stretch:** Construct a distribution where the mean difference and the ordinal comparison \(P(B>A)\) point in opposite directions, and say which claim a deployment decision needs.

## 1. Order statistics

Given \(X_1,\dots,X_n\), sort them to get the **order statistics**

$$
X_{(1)}\le X_{(2)}\le\dots\le X_{(n)}.
$$

For iid observations with CDF \(F\), the distribution of each is exact and elementary. The event \(X_{(k)}\le x\) says at least \(k\) of the observations fell at or below \(x\), and each does so independently with probability \(F(x)\). Hence

$$
P\bigl(X_{(k)}\le x\bigr)=\sum_{j=k}^n\binom nj F(x)^j\bigl(1-F(x)\bigr)^{n-j}.
$$

Two special cases are worth memorizing: \(P(X_{(n)}\le x)=F(x)^n\) for the maximum and \(P(X_{(1)}>x)=(1-F(x))^n\) for the minimum.

Differentiating gives the density, when \(F\) has one:

$$
f_{(k)}(x)=\frac{n!}{(k-1)!\,(n-k)!}\,F(x)^{k-1}\bigl(1-F(x)\bigr)^{n-k}f(x).
$$

Read it as a multinomial count: \(k-1\) observations below \(x\), one at \(x\), and \(n-k\) above, with the factorials counting arrangements.

The uniform case is the master case, because \(F(X)\sim\mathrm{Unif}(0,1)\) under the probability integral transform. For uniforms,

$$
U_{(k)}\sim\mathrm{Beta}(k,\,n-k+1),
\qquad
E[U_{(k)}]=\frac{k}{n+1},
\qquad
\operatorname{Var}(U_{(k)})=\frac{k(n-k+1)}{(n+1)^2(n+2)}.
$$

Everything else follows by the transformation \(X_{(k)}=F^{-1}(U_{(k)})\), which is why order-statistic results are usually stated for uniforms and then pushed through a quantile function.

**Worked example — where the expected maximum sits.** For \(n=100\) uniforms, \(E[U_{(100)}]=100/101\approx0.990\), not \(1\). The expected largest of \(n\) draws sits at the \(n/(n+1)\) quantile — a useful sanity check whenever a maximum is being used to estimate a bound, and the source of the standard bias correction in "largest observed value" estimators.

> **Practice — Foundation:** Write the CDF of the maximum and the minimum of \(n\) iid observations.
>
> **Practice — Core:** Derive the density of \(X_{(k)}\) from the multinomial argument and check it integrates to one for \(n=2\).
>
> **Practice — Stretch:** Use the probability integral transform to obtain the distribution of the median of five exponential observations.

## 2. Joint distributions and spacings

The joint density of the full ordered sample is

$$
f_{(1),\dots,(n)}(x_1,\dots,x_n)=n!\prod_{i=1}^n f(x_i)
\qquad\text{on }x_1<x_2<\dots<x_n,
$$

and zero elsewhere. The \(n!\) is the number of unordered samples mapping to the same ordered one; sorting loses exactly the ordering information, which is the intuition behind the order statistics being sufficient for an iid model with unknown \(F\).

**Spacings** are the gaps \(D_k=X_{(k)}-X_{(k-1)}\), and they carry the local density information. For the exponential distribution the result is exceptionally clean: by the **Rényi representation**, the scaled spacings

$$
(n-k+1)\bigl(X_{(k)}-X_{(k-1)}\bigr)
$$

are independent and identically Exponential(\(\lambda\)) for \(k=1,\dots,n\), with \(X_{(0)}=0\). The memorylessness of the exponential makes each gap a fresh exponential race among the survivors, and the number of survivors shrinks by one each time.

Spacings are the basis of several practical tools: goodness-of-fit tests that look at whether gaps behave as expected, uniformity tests, and nearest-neighbour density estimates, which are spacing-based in one dimension.

**Worked example — why the last gaps are enormous.** With \(n=1000\) exponential latencies, the expected gap between the 999th and 1000th order statistic is \(\lambda^{-1}/1\), while the gap between the 500th and 501st is \(\lambda^{-1}/501\). The tail is sparse by construction, which is precisely why estimating a p999 from 1,000 observations is hopeless: the data in that region is a single gap.

> **Practice — Foundation:** Write the joint density of the ordered sample and explain the factorial.
>
> **Practice — Core:** Derive the distribution of the smallest spacing for exponential data using the Rényi representation.
>
> **Practice — Stretch:** Explain why extreme quantile estimates have variance dominated by a handful of gaps, and relate this to the bootstrap's failure for extremes from lesson 08.

## 3. Sample quantiles and the density in the denominator

The sample \(p\)-quantile \(\hat q_p\) is an order statistic, typically \(X_{(\lceil np\rceil)}\) with conventions varying by interpolation rule. It is consistent for the population quantile \(q_p\) whenever \(F\) is strictly increasing at \(q_p\), and its asymptotic distribution is

$$
\sqrt n\,\bigl(\hat q_p-q_p\bigr)\ \xrightarrow{d}\ \mathcal N\!\left(0,\ \frac{p(1-p)}{f(q_p)^2}\right).
$$

The numerator is familiar Bernoulli variance: whether an observation falls below \(q_p\) is a coin flip with probability \(p\). The interesting term is the **density in the denominator**, and it governs everything about quantile uncertainty.

Where the density is high, many observations sit near the quantile and it is pinned down precisely. Where the density is low — in a tail — few observations are nearby and the quantile wanders. The variance scales as \(1/f(q_p)^2\), so a density ten times smaller gives a standard error a hundred times larger in variance terms.

Three consequences for practice:

- **The median is the easy case.** \(p(1-p)=1/4\) is maximal but \(f\) is typically largest at the centre, and for a Gaussian the median's variance is \(\pi/2\approx1.57\) times the mean's — the familiar 64% efficiency of the median under normality.
- **Extreme quantiles are hard, and the difficulty is not fixed by more data alone.** The standard error of a p99 shrinks at \(n^{-1/2}\), but the constant involves \(1/f(q_{0.99})\), which for a heavy-tailed latency distribution can be enormous.
- **Estimating the standard error requires estimating a density**, which is the problem of sections 17 to 19. This is why practitioners use the bootstrap or distribution-free order-statistic intervals for quantiles instead.

The distribution-free alternative is exact and often better: since \(\sum_i 1\{X_i\le q_p\}\sim\mathrm{Binomial}(n,p)\), an interval for \(q_p\) can be formed from two order statistics \([X_{(r)},X_{(s)}]\) whose binomial tail probabilities give the desired coverage. No density, no asymptotics.

**Worked example — a p99 latency SLO.** With 2,000 logged requests, the p99 is roughly \(X_{(1980)}\), and the binomial method gives an exact interval from about \(X_{(1966)}\) to \(X_{(1992)}\) for 95% coverage — a range containing 26 order statistics. Reporting the p99 as a single number without that width is the most common quantitative error in latency reporting.

> **Practice — Foundation:** State the asymptotic variance of a sample quantile and identify each factor.
>
> **Practice — Core:** Compute the asymptotic relative efficiency of the median against the mean for a Gaussian population.
>
> **Practice — Stretch:** Construct a distribution-free confidence interval for the 0.9 quantile from binomial tail probabilities, and verify its coverage by simulation.

## 4. Extremes need their own theory

The central limit theorem describes averages. Maxima have a parallel theory with a different set of limits, and using the wrong one is a common failure in tail-risk work.

The **Fisher–Tippett–Gnedenko theorem** says that if \((X_{(n)}-b_n)/a_n\) converges in distribution to a nondegenerate limit, that limit belongs to one of three families, unified as the **generalized extreme value** distribution

$$
G_\xi(z)=\exp\left(-\bigl(1+\xi z\bigr)^{-1/\xi}\right),
$$

with \(\xi=0\) interpreted as the limit, giving **Gumbel** (light tails: normal, exponential), \(\xi>0\) giving **Fréchet** (heavy tails: Pareto, Cauchy, \(t\)), and \(\xi<0\) giving **Weibull** (bounded support). The shape parameter \(\xi\) is the whole story, and it is a property of the tail that no amount of central data reveals.

The complementary approach is **peaks over threshold**: by the Pickands–Balkema–de Haan theorem, exceedances over a high threshold \(u\) converge to a **generalized Pareto** distribution. This uses all observations above \(u\) rather than one maximum per block, and is the standard practical tool.

Two warnings. First, **the bootstrap fails for extremes**, as lesson 08 stated: the empirical distribution has no mass beyond the observed maximum, so resampling cannot represent uncertainty about unseen values. Second, **threshold choice is the entire difficulty** — too low and the asymptotic approximation fails, too high and almost no data remains. Mean-residual-life plots and stability of \(\hat\xi\) across thresholds are the standard diagnostics, and they are genuinely ambiguous.

**Worked example — a tail index changes the question.** Two latency distributions have identical medians and p95s. One has \(\xi=0\), so the p9999 is about 1.3 times the p99; the other has \(\xi=0.4\), so the p9999 is about 6 times the p99. The central statistics that a dashboard reports are identical, and the capacity plan implied by the two is not.

> **Practice — Foundation:** Name the three extreme-value families and the tail behaviour each corresponds to.
>
> **Practice — Core:** Derive the limiting distribution of the maximum of \(n\) exponential observations with the right centring and scaling.
>
> **Practice — Stretch:** Fit a generalized Pareto to exceedances at three thresholds, assess stability of \(\hat\xi\), and state what you would report.

## 5. The empirical CDF as a random function

Lessons 06 and 08 introduced the empirical distribution as a fitted population. Here it is treated as a **random function** rather than a plug-in device, which is what makes uniform statements possible.

Define

$$
\hat F_n(x)=\frac1n\sum_{i=1}^n\mathbf 1\{X_i\le x\}.
$$

At any fixed \(x\), \(n\hat F_n(x)\sim\mathrm{Binomial}(n,F(x))\), so \(\hat F_n(x)\) is unbiased with variance \(F(x)(1-F(x))/n\). The pointwise law of large numbers and CLT follow immediately, and give a pointwise confidence interval at any single \(x\).

That is not enough for most purposes. A pointwise interval is valid at one pre-chosen \(x\); scanning a plot for the largest discrepancy and reading off its pointwise interval is the multiple-comparisons error of lesson 07, applied to a continuum. Any statement about the *whole* function — a goodness-of-fit test, a band drawn around a curve, a supremum distance — requires uniform control, and that is what the next two sections supply.

The covariance structure is worth noting because it drives everything downstream:

$$
\operatorname{Cov}\bigl(\hat F_n(s),\hat F_n(t)\bigr)=\frac{F(s\wedge t)-F(s)F(t)}{n},
$$

which is the covariance of a Brownian bridge divided by \(n\). The variance vanishes at both ends, where \(F\) is 0 or 1 — a fact that will explain the tail insensitivity of the Kolmogorov–Smirnov test in section 16.

**Worked example — the band that was not a band.** An engineer plots an empirical CDF with pointwise 95% intervals and observes the fitted lognormal leaving the interval somewhere in the middle. That excursion is not evidence at the 5% level, because the maximum of many pointwise deviations exceeds any single one. The correct object is a uniform band, and it is roughly 1.4 times wider at the centre.

> **Practice — Foundation:** State the mean and variance of the empirical CDF at a fixed point.
>
> **Practice — Core:** Derive the covariance of \(\hat F_n(s)\) and \(\hat F_n(t)\) and note where it vanishes.
>
> **Practice — Stretch:** Explain precisely why pointwise intervals cannot be read as a band, and quantify the difference for \(n=200\).

## 6. Glivenko–Cantelli: the fundamental theorem of statistics

**Theorem (Glivenko–Cantelli).** For iid observations from any CDF \(F\),

$$
\sup_{x\in\mathbb R}\bigl|\hat F_n(x)-F(x)\bigr|\ \xrightarrow{\text{a.s.}}\ 0 .
$$

The empirical distribution converges to the truth **uniformly**, not merely at each point, and with no assumptions on \(F\) whatever — not continuity, not moments, not a density.

The proof idea is worth carrying because it generalizes. Partition the range into finitely many cells at quantiles \(F^{-1}(j/m)\); apply the pointwise law of large numbers at those finitely many points; and use monotonicity of both \(\hat F_n\) and \(F\) to control the function between grid points by its values at the grid, with error at most \(1/m\). Take \(m\) large. Monotonicity is doing the work of turning finitely many pointwise statements into a uniform one.

This result is why the plug-in principle works at all, and why the bootstrap has any hope: every functional that is continuous with respect to the supremum distance inherits consistency automatically. Substituting \(\hat F_n\) for \(F\) in a continuous functional gives a consistent estimator, which retroactively justifies the bootstrap machinery of lesson 08 and the plug-in estimators of lesson 06.

The generalization is one of the load-bearing ideas of statistical learning theory: replace the class of half-lines \(\{(-\infty,x]\}\) by a richer class of sets or functions, and uniform convergence holds if and only if the class is not too rich — VC dimension for sets, metric entropy for functions. The uniform convergence of empirical means over a hypothesis class is exactly what generalization bounds require, so lesson 06's entropy-and-generalization material and this theorem are the same mathematics at different levels of generality.

**Worked example — why "it works on my sample" generalizes.** Evaluating one fixed metric on a held-out sample needs only the pointwise law of large numbers. Selecting the best of 500 model variants on that sample needs uniform convergence over 500 functions, and the penalty is roughly \(\sqrt{\log 500/(2n)}\). Glivenko–Cantelli is the continuum version of the same accounting.

> **Practice — Foundation:** State Glivenko–Cantelli and say what distinguishes it from the pointwise law of large numbers.
>
> **Practice — Core:** Sketch the grid-plus-monotonicity proof and identify where monotonicity is essential.
>
> **Practice — Stretch:** Explain the connection between uniform convergence of the empirical CDF and generalization bounds over a hypothesis class.

## 7. DKW gives a finite-sample band you can draw

Glivenko–Cantelli is asymptotic. The **Dvoretzky–Kiefer–Wolfowitz inequality**, with Massart's sharp constant, is not:

$$
P\left(\sup_x\bigl|\hat F_n(x)-F(x)\bigr|>\varepsilon\right)\le 2e^{-2n\varepsilon^2}
\qquad\text{for all }\varepsilon>0 .
$$

Inverting it gives a **uniform confidence band** valid at every sample size and for every distribution. Setting the right side to \(\alpha\),

$$
\varepsilon_n=\sqrt{\frac{\ln(2/\alpha)}{2n}},
\qquad
\hat F_n(x)\pm\varepsilon_n\ \text{(clipped to }[0,1]\text{)},
$$

contains the entire true CDF with probability at least \(1-\alpha\), simultaneously at every \(x\). This is one of the most useful inequalities in applied statistics and one of the least used.

![A constant-width band around the empirical CDF contains the whole true curve at once, so any quantile read off it becomes an interval.](../assets/ecdf-dkw-band.svg)

Three properties to appreciate. It is **distribution-free**: no continuity, no moments, nothing. It is **finite-sample**: no asymptotic approximation to apologize for. And it is **uniform**, so you may look at the band, choose the most interesting \(x\) after seeing the data, and still make a valid statement — the multiplicity is already paid for.

The band has constant width, which is its main inefficiency: the true uncertainty is smaller in the tails, where the binomial variance vanishes, so a constant-width band is conservative there and the shape is wrong for tail questions. Weighted bands and the Anderson–Darling weighting address this at the cost of simplicity.

For \(\alpha=0.05\), \(\varepsilon_n=\sqrt{\ln 40/(2n)}\approx1.358/\sqrt n\). At \(n=1000\) that is \(\pm0.043\) — a useful, honest, half-line calculation.

**Worked example — certifying a latency distribution.** With 5,000 logged latencies, \(\varepsilon_n\approx0.019\). The band around the empirical CDF then certifies, simultaneously, every quantile claim you can read off it: the true p95 lies between the empirical \(0.931\) and \(0.969\) quantiles. One inequality, all quantiles, no distributional assumption.

> **Practice — Foundation:** Compute \(\varepsilon_n\) for \(\alpha=0.05\) at \(n=400\) and state what the band guarantees.
>
> **Practice — Core:** Convert a DKW band on the CDF into simultaneous bounds on a set of quantiles.
>
> **Practice — Stretch:** Explain why the constant-width band is conservative in the tails, and propose a weighting that is not.

## 8. The empirical process and where bootstrap guarantees come from

Scale the deviation by \(\sqrt n\) and it converges to a nondegenerate random function. The **empirical process**

$$
\mathbb G_n(x)=\sqrt n\bigl(\hat F_n(x)-F(x)\bigr)
$$

converges weakly, for continuous \(F\), to \(B(F(x))\), where \(B\) is a **Brownian bridge** — a Gaussian process on \([0,1]\) with mean zero, covariance \(s\wedge t-st\), and \(B(0)=B(1)=0\).

This single result supplies the null distributions of the classical goodness-of-fit tests. The Kolmogorov–Smirnov statistic \(\sqrt n\sup_x|\hat F_n-F|\) converges to \(\sup_t|B(t)|\), whose distribution is a known series; the Cramér–von Mises and Anderson–Darling statistics are integrals of \(B^2\) against different weights. That these limits do not depend on \(F\) is the reason the tests are distribution-free, and it traces back to the probability integral transform: \(F(X)\) is uniform, so the problem is always the uniform problem in disguise.

The same theory explains the bootstrap's asymptotic validity. The bootstrap resamples from \(\hat F_n\) rather than \(F\), and works when the functional of interest is suitably differentiable with respect to the distribution — the **functional delta method**, with the derivative being the **influence function**. Lesson 08's practical account of when the bootstrap fails is the applied face of this: failures occur exactly where the functional is not smooth in \(F\) (the maximum, a boundary parameter) or where the process does not converge as assumed (dependence, heavy tails without moments).

Influence functions are also the bridge to the sandwich estimators of lesson 11 and the doubly robust estimators of lesson 16: writing an estimator as an average of influence-function contributions plus a negligible remainder gives its asymptotic variance immediately, which is why modern causal inference is phrased in those terms.

**Worked example — reading the bridge.** Simulate 10,000 datasets of \(n=500\) uniforms, compute \(\sqrt n\sup|\hat F_n-F|\), and the histogram matches the Kolmogorov distribution regardless of whether you generated uniforms, exponentials, or Cauchy variables and transformed. That invariance *is* distribution-freeness, visible in one experiment.

> **Practice — Foundation:** State the limit of the empirical process and name its covariance function.
>
> **Practice — Core:** Explain why the Kolmogorov–Smirnov null distribution does not depend on \(F\), using the probability integral transform.
>
> **Practice — Stretch:** Define the influence function of the mean and of the median, and relate their forms to the robustness of each estimator.

## 9. Ranks are distribution-free because the rank vector is uniform

Replace each observation by its position in the sorted sample. For a continuous population, ties have probability zero, and the resulting **rank vector** \((R_1,\dots,R_n)\) is a permutation of \(1,\dots,n\).

The key fact: under the null hypothesis that the observations are exchangeable, every permutation is equally likely,

$$
P\bigl((R_1,\dots,R_n)=\pi\bigr)=\frac1{n!}\qquad\text{for every permutation }\pi,
$$

**whatever the population distribution is**. The ranks carry no information about \(F\), only about relative order, so any statistic computed from ranks alone has a null distribution that can be enumerated exactly by combinatorics.

This is the whole source of distribution-freeness. It requires only continuity (so ranks are well defined) and exchangeability under the null (so all permutations are equally likely). It requires nothing about shape, moments, or tails.

Three structural consequences:

- **Exact small-sample tests.** For small \(n\) the null distribution can be enumerated exhaustively rather than approximated. No normality, no asymptotics.
- **Robustness to outliers is automatic.** Replacing the largest observation by \(10^6\) does not change its rank, so rank statistics have bounded influence functions.
- **Information is discarded.** Ranks retain order and nothing else. If the spacings carry signal — and for a location shift with known shape they do — a rank test cannot use it, which is the source of the efficiency loss quantified in section 13.

The connection to lesson 13 is exact and worth making explicit: split conformal prediction takes the \(\lceil(n+1)(1-\alpha)\rceil\)-th order statistic of the calibration scores, and its coverage guarantee is precisely the statement that the test point's score is equally likely to take any rank among the \(n+1\) scores under exchangeability. Conformal prediction is a rank argument wearing machine-learning clothes.

**Worked example — counting instead of assuming.** With \(n=6\) paired differences, the signed-rank statistic takes finitely many values, and the exact null probability of each is a count over the \(2^6=64\) sign assignments. A p-value from that enumeration is exact at any sample size, where a \(t\)-test at \(n=6\) is leaning entirely on an assumption you cannot check.

> **Practice — Foundation:** State why the rank vector is uniform over permutations under exchangeability.
>
> **Practice — Core:** Enumerate the null distribution of the sum of the ranks of a randomly chosen subset of size 2 from 4 observations.
>
> **Practice — Stretch:** Show that conformal coverage is a rank statement, and identify the exchangeability assumption it needs.

## 10. The sign test and the Wilcoxon signed-rank test

For paired data — the same prompts scored by two models, the standard design from lesson 07 — compute differences \(D_i\) and test whether they are centred at zero.

**The sign test** uses only the signs. Under the null that \(P(D>0)=1/2\), the number of positive differences is \(\mathrm{Binomial}(n,1/2)\), and the p-value is an exact binomial tail. Assumptions: independence and a median of zero. Nothing else — not symmetry, not continuity beyond handling ties, not finite moments. It is the most assumption-light test in common use, and correspondingly the least powerful.

**The Wilcoxon signed-rank test** uses signs *and* the ranks of \(|D_i|\). Let \(W^+\) be the sum of ranks of the positive differences. Under the null that the \(D_i\) are symmetric about zero,

$$
E[W^+]=\frac{n(n+1)}4,
\qquad
\operatorname{Var}(W^+)=\frac{n(n+1)(2n+1)}{24},
$$

with exact enumeration available for small \(n\) and a normal approximation with continuity correction for large \(n\).

The extra assumption is **symmetry** of the difference distribution about its centre, and it is not cosmetic. If the differences are skewed — very common when one model occasionally fails catastrophically — the signed-rank test can reject even when the median difference is zero, because large-magnitude differences on one side dominate the rank sum. The sign test remains valid there. Choosing between them is choosing which assumption you are willing to make, and the asymmetry of model-comparison score differences makes this a live question rather than a textbook one.

**Worked example — a skew that fooled a test.** Model B beats A slightly on 60% of prompts and loses catastrophically on 5%. The median difference favours B. The mean favours A. The signed-rank statistic, which weights by magnitude rank, sits between and depends on how heavy the catastrophic tail is. Three defensible tests, three answers, and the right one depends on whether rare catastrophic failures matter for the decision — which is a product question, not a statistical one.

> **Practice — Foundation:** Compute an exact sign-test p-value for 9 positives out of 12.
>
> **Practice — Core:** Compute the signed-rank statistic for eight paired differences and compare exact and normal-approximation p-values.
>
> **Practice — Stretch:** Construct a skewed difference distribution with median zero where the signed-rank test rejects at nominal 5% far more often than 5%.

## 11. Mann–Whitney estimates \(P(X>Y)\), not a difference of medians

For two independent samples \(X_1,\dots,X_m\) and \(Y_1,\dots,Y_n\), pool and rank. The **Wilcoxon rank-sum** statistic is the sum of ranks in the first sample; the equivalent **Mann–Whitney** form counts pairwise wins,

$$
U=\sum_{i=1}^m\sum_{j=1}^n\left[\mathbf 1\{X_i>Y_j\}+\tfrac12\mathbf 1\{X_i=Y_j\}\right],
$$

related by \(U=R_X-\frac{m(m+1)}2\). Under the null that both samples come from the same distribution,

$$
E[U]=\frac{mn}2,
\qquad
\operatorname{Var}(U)=\frac{mn(m+n+1)}{12},
$$

with a tie correction subtracting \(\frac{mn\sum_j(t_j^3-t_j)}{12(m+n)(m+n-1)}\) for tie groups of sizes \(t_j\).

Now the part that matters most and is most often stated wrongly. The estimand is

$$
\hat\theta=\frac U{mn}\ \longrightarrow\ \theta=P(X>Y)+\tfrac12P(X=Y),
$$

the probability that a randomly chosen \(X\) beats a randomly chosen \(Y\). This is **not** a difference of medians, and it is not a difference of means. It coincides with a statement about medians only under an added **location-shift model** — the assumption that the two distributions have the same shape and differ by a constant. Without that assumption:

- Mann–Whitney can be significant when the two medians are **identical**, if the distributions differ in shape.
- Two distributions with the same \(\theta=1/2\) can have very different means.
- Most importantly, \(\theta\) is **not transitive**: there exist distributions with \(P(A>B)>1/2\), \(P(B>C)>1/2\), and \(P(C>A)>1/2\). Non-transitive dice are the standard construction.

That last point has a direct consequence for AI evaluation. A **win rate** between two models is exactly \(\hat\theta\). Building a global ranking from pairwise win rates therefore assumes a structure the statistic does not provide, and observed preference cycles in model arenas are not necessarily noise or rater error — they are what a non-transitive functional does. Fitting a Bradley–Terry model, as lesson 11 §15 does, imposes transitivity by assumption; the honest report includes how badly that assumption fits.

**Worked example — the tie in win rate that hides everything.** Model A scores uniformly on \([0,1]\). Model B scores \(0.4\) always. Then \(P(A>B)=0.6\), so B looks worse. Model C scores \(0.55\) always, so \(P(C>A)=0.55\) and \(P(C>B)=1\). Now replace A with a bimodal model and the cycle appears. The win rate is a real quantity; it is just not an ordering.

> **Practice — Foundation:** Compute \(U\) and \(\hat\theta\) for two small samples with a tie.
>
> **Practice — Core:** Construct two distributions with equal medians for which Mann–Whitney has power approaching one.
>
> **Practice — Stretch:** Build three score distributions exhibiting a win-rate cycle, and explain what a Bradley–Terry fit would report about them.

## 12. Hodges–Lehmann estimates and distribution-free intervals

A test is more useful with an estimate attached. Inverting a rank test — collecting the set of shift values not rejected — gives both.

The **Hodges–Lehmann estimator** for a two-sample shift is the median of all \(mn\) pairwise differences,

$$
\hat\Delta_{\text{HL}}=\operatorname{median}\{X_i-Y_j\},
$$

and for the one-sample symmetric case it is the median of the \(\binom n2+n\) **Walsh averages** \((D_i+D_j)/2\) for \(i\le j\). These are the point estimates whose associated tests are the rank-sum and signed-rank tests respectively, in the same sense that the sample mean is the estimate associated with the \(t\)-test.

The confidence interval comes free: the endpoints are order statistics of the pairwise differences, at ranks determined by the critical values of the rank statistic. The result is **distribution-free** — exact coverage for any continuous population — and robust, with a breakdown point of about 29% for the two-sample version, against 0% for the difference of means.

The efficiency is excellent. Under normality the Hodges–Lehmann estimator has asymptotic relative efficiency \(3/\pi\approx0.955\) against the sample mean, so the insurance costs about 5% of sample size. Under heavier tails it wins, often by a lot.

**Worked example — the interval that survives one bad row.** Two samples of 40 model scores give a mean difference of \(0.031\) with interval \([0.004,0.058]\). One logged score is corrupted to \(-50\). The mean difference becomes \(-1.22\) with an interval spanning zero; the Hodges–Lehmann estimate moves from \(0.029\) to \(0.028\) and its interval barely changes. Robustness is not an abstraction when data comes from a pipeline.

> **Practice — Foundation:** Compute the Hodges–Lehmann estimate for two samples of size three.
>
> **Practice — Core:** Explain how inverting a rank test produces a confidence interval with endpoints at pairwise-difference order statistics.
>
> **Practice — Stretch:** Compare the breakdown point and efficiency of the mean difference and the Hodges–Lehmann estimator, and state when each is preferable.

## 13. Efficiency: the price of assuming less

Asymptotic relative efficiency compares the sample sizes two tests need for the same power against the same local alternative. The classical numbers are worth memorizing because they are so favourable to rank methods.

| Comparison | Gaussian | Uniform | Logistic | Laplace | Heavy tails |
|---|---|---|---|---|---|
| Wilcoxon vs \(t\) | 0.955 | 1.00 | 1.10 | 1.50 | \(\to\infty\) |
| Sign vs \(t\) | 0.637 | 0.33 | 0.82 | 2.00 | \(\to\infty\) |

Three facts follow.

**The cost under ideal conditions is small.** Wilcoxon needs about 5% more data than the \(t\)-test when the \(t\)-test's assumptions hold exactly. That is a modest insurance premium.

**The gain under non-ideal conditions is unbounded.** For heavy-tailed populations the \(t\)-test's efficiency collapses, because the sample mean's variance is driven by rare extremes while ranks are unaffected. For a Cauchy population the \(t\)-test is not even consistent for a location comparison, while Wilcoxon is perfectly well behaved.

**There is a floor.** The Hodges–Lehmann bound states that the ARE of Wilcoxon against \(t\) is at least \(0.864\) for **every** continuous distribution. The worst case is bounded; the best case is not. That asymmetry is the argument for rank methods as a default in settings where you cannot inspect the distribution, which describes most automated evaluation.

The counterargument deserves a fair statement: rank methods answer an ordinal question. If the decision depends on the size of an effect on the original scale — cost per request, tokens saved, seconds of latency — then a shift in \(P(X>Y)\) does not answer it, and converting back requires the location-shift assumption you were avoiding.

**Worked example — 5% versus everything.** A team standardizes on Wilcoxon for all model comparisons. On normally distributed score differences they lose 5% effective sample size. On the 15% of their benchmarks with occasional catastrophic failures, they avoid conclusions driven entirely by two rows. That is a good trade, and it is a defensible default to write down.

> **Practice — Foundation:** State the ARE of the Wilcoxon test relative to the \(t\)-test under normality.
>
> **Practice — Core:** Explain why the \(t\)-test's efficiency collapses for heavy-tailed populations, in terms of the sample mean's variance.
>
> **Practice — Stretch:** Simulate the power of both tests under Gaussian, Laplace, and contaminated-normal alternatives and reproduce the ordering in the table.

## 14. U-statistics are the common framework

Many of the estimators above share a form. Given a symmetric **kernel** \(h\) of \(m\) arguments, the **U-statistic** is the average over all subsets:

$$
U_n=\binom nm^{-1}\sum_{i_1<\dots<i_m}h(X_{i_1},\dots,X_{i_m}).
$$

It is the unique minimum-variance unbiased estimator of \(\theta=E[h(X_1,\dots,X_m)]\) among unbiased estimators symmetric in the data — a Rao–Blackwell argument, since the order statistics are sufficient for an iid model with unknown \(F\) and the U-statistic is the conditional expectation of \(h\) given them. That is the direct link back to lesson 11 §5.

Examples make the unification concrete:

- \(h(x)=x\) gives the sample mean, \(m=1\).
- \(h(x_1,x_2)=\frac12(x_1-x_2)^2\) gives the unbiased sample variance, \(m=2\).
- \(h(x,y)=\mathbf 1\{x>y\}\) across two samples gives Mann–Whitney.
- \(h(x_1,x_2)=\mathbf 1\{x_1+x_2>0\}\) gives the signed-rank statistic in disguise.
- Gini's mean difference, Kendall's \(\tau\), and the energy-distance statistics are all U-statistics.

The **Hoeffding decomposition** gives the asymptotics. Define the projection \(h_1(x)=E[h(x,X_2,\dots,X_m)]-\theta\) and \(\zeta_1=\operatorname{Var}(h_1(X_1))\). Then whenever \(\zeta_1>0\),

$$
\sqrt n\,(U_n-\theta)\ \xrightarrow{d}\ \mathcal N(0,\ m^2\zeta_1),
$$

so a U-statistic is asymptotically a sample mean of its own projection — which is its influence function, connecting back to section 8. The **degenerate** case \(\zeta_1=0\) has a different, non-Gaussian limit built from chi-square variables, and it is exactly the case arising under the null for kernel two-sample tests, which is why those tests use permutation rather than normal approximations for their null distributions.

**Worked example — the variance of a win rate.** \(\hat\theta=U/(mn)\) has projection \(h_1(x)=P(x>Y)-\theta\), so its variance is governed by how much \(P(x>Y)\) varies across \(x\). For two nearly identical models this variation is small and the estimate is precise; for a model that is either much better or much worse depending on the prompt, it is large. The standard error of a win rate is therefore *not* \(\sqrt{\theta(1-\theta)/N}\), and using that binomial formula understates it.

> **Practice — Foundation:** Write the sample variance as a U-statistic and identify its kernel.
>
> **Practice — Core:** Compute the projection \(h_1\) for the Mann–Whitney kernel and interpret it.
>
> **Practice — Stretch:** Explain what changes when \(\zeta_1=0\), and why kernel two-sample tests calibrate by permutation.

## 15. Permutation or rank: exchangeability against ordinal structure

Lesson 08 built permutation tests; this unit builds rank tests. They are close relatives and the distinction is precise.

A **permutation test** uses the actual values and derives its null distribution by re-randomizing labels. It is exact under exchangeability, works with any test statistic you like — including a difference of means, an AUC, or a neural network's loss — and adapts its null distribution to the observed data.

A **rank test** first replaces values by ranks and then, usually, uses the known combinatorial null distribution. It is exact under the same exchangeability condition, but its null distribution is universal rather than data-dependent, which is why critical values can be tabulated.

The relationship is that a rank test *is* a permutation test applied to rank-transformed data. The consequences:

- **Choose permutation** when you want a specific statistic on the original scale, when the estimand must be interpretable in original units, or when you have a complicated statistic with no theory.
- **Choose ranks** when you want robustness to outliers and a tabulated or exactly enumerable null, or when the meaningful signal is ordinal.
- **Both fail identically** when exchangeability fails. Clustered rows, temporal drift, and repeated prompts break both, and no amount of resampling repairs them. The remedy is to permute at the level of the exchangeable unit, exactly as lesson 10 insisted on clustering at the unit of dependence.

**Worked example — permuting the wrong thing.** An evaluation has 50 prompts, each answered 10 times by each model. Permuting all 500 rows treats responses as exchangeable and produces a null far too narrow, so every comparison is significant. Permuting the model label within prompts, or at the prompt level, respects the dependence and gives a null with the right width.

> **Practice — Foundation:** State the assumption both permutation and rank tests require.
>
> **Practice — Core:** Explain in what sense a rank test is a permutation test, and what is gained by the rank transform.
>
> **Practice — Stretch:** Design a permutation scheme for an evaluation with repeated prompts and multiple raters, and say which null hypothesis it tests.

## 16. Kolmogorov–Smirnov and its blind spots

The **Kolmogorov–Smirnov** statistic is the supremum distance between empirical and reference CDFs,

$$
D_n=\sup_x\bigl|\hat F_n(x)-F_0(x)\bigr|,
$$

with null distribution from the Brownian bridge of section 8. The two-sample version compares two empirical CDFs. It is distribution-free, simple, and widely used — and it has three failure modes that make it a poor default.

**It is insensitive in the tails.** The bridge's variance \(t(1-t)\) vanishes at the ends, so a deviation near the extremes contributes little to the supremum relative to its own scale. If the question is about tail behaviour — and in latency, loss, and risk work it usually is — KS is close to the worst available test. **Anderson–Darling**, which integrates the squared deviation weighted by \(1/(F_0(1-F_0))\), is the standard fix and is materially more powerful in the tails.

**It is invalid with estimated parameters.** If you estimate \(\mu\) and \(\sigma\) from the same data and then test against \(\mathcal N(\hat\mu,\hat\sigma^2)\), the null distribution is no longer Kolmogorov's — the fitted curve is pulled toward the data, so \(D_n\) is stochastically smaller and the test is badly conservative. The Lilliefors correction or a parametric bootstrap is required, and this error is extremely common.

**It answers a question nobody asked.** At large \(n\) every goodness-of-fit test rejects, because no parametric family is exactly true. A p-value of \(10^{-9}\) for normality of 10 million latencies conveys nothing; the useful question is whether the deviation matters for the decision, which is a question about a specific functional, not about the whole distribution.

The constructive alternative for most applied purposes is the DKW band of section 7: it shows *where* and *by how much* the fit deviates, with a simultaneous guarantee, instead of compressing everything into one number that large \(n\) makes meaningless.

**Worked example — two rejections, one useful.** KS rejects lognormality of latency at \(p<10^{-6}\). The DKW band shows the fit is within \(0.004\) everywhere below the p95 and diverges by \(0.06\) above the p99. The test says "not lognormal"; the band says "usable for central quantiles, useless for tail capacity planning," which is the sentence the capacity plan needs.

> **Practice — Foundation:** Define the KS statistic and state where its sensitivity is lowest.
>
> **Practice — Core:** Explain why estimating parameters from the same data invalidates the standard KS null distribution.
>
> **Practice — Stretch:** Compare KS, Anderson–Darling, and a DKW band on data whose deviation is confined to the upper tail, and state which you would report.

## 17. Kernel density estimation

A histogram estimates a density by counting into bins, and its defects are the bin width and the arbitrary bin origin. **Kernel density estimation** removes the origin problem by centring a small bump on every observation:

$$
\hat f_h(x)=\frac1{nh}\sum_{i=1}^nK\!\left(\frac{x-X_i}h\right),
$$

where the **kernel** \(K\) is a symmetric density — Gaussian, Epanechnikov \(\frac34(1-u^2)\) on \([-1,1]\), triangular — and \(h>0\) is the **bandwidth**. The estimate is itself a density: nonnegative and integrating to one, since each bump does.

Equivalently, \(\hat f_h\) is the density of the empirical distribution convolved with a scaled kernel. That view explains what the estimator does: it is the plug-in estimate smoothed, because the empirical distribution itself has no density at all — it is a sum of point masses. Smoothing is not an optional refinement here; it is what makes the problem well posed.

The two choices are not equally important. **Kernel shape barely matters**: the Epanechnikov kernel is optimal in an asymptotic mean-integrated-squared-error sense, and the Gaussian kernel's efficiency relative to it is about 0.95, so the choice costs a few percent. **Bandwidth matters enormously**: too small and the estimate is a spiky rendering of the sample, too large and genuine structure is smoothed away. Section 18 makes this precise, and the practical rule is to spend no time on kernel choice and real time on bandwidth.

**Worked example — the same data, three stories.** Latency data with a genuine bimodality from cache hits and misses: at \(h\) one-tenth the optimal value the plot shows 40 spurious modes, one per cluster of observations; at the optimal \(h\) it shows two; at ten times optimal it shows one. Nothing but a single scalar changed, and the engineering conclusion inverted.

> **Practice — Foundation:** Write the kernel density estimator and verify it integrates to one.
>
> **Practice — Core:** Explain why the empirical distribution has no density and what convolution with a kernel achieves.
>
> **Practice — Stretch:** Compare Gaussian and Epanechnikov kernels at the same bandwidth on the same sample, and quantify how little the choice matters against a 2× bandwidth change.

## 18. Bias, variance, and the bandwidth

Expand for a smooth density. The bias at an interior point is

$$
E\bigl[\hat f_h(x)\bigr]-f(x)=\frac{h^2}2\mu_2(K)f''(x)+o(h^2),
\qquad \mu_2(K)=\int u^2K(u)\,du,
$$

and the variance is

$$
\operatorname{Var}\bigl(\hat f_h(x)\bigr)=\frac{R(K)f(x)}{nh}+o\!\left(\frac1{nh}\right),
\qquad R(K)=\int K(u)^2du .
$$

Read both carefully, because they encode the entire tradeoff. **Bias grows with \(h^2\)** and is proportional to the second derivative: the estimator flattens peaks and fills valleys, so curvature is where the bias lives. **Variance falls with \(nh\)**, the effective number of observations contributing to each point. Larger \(h\) means more smoothing: less variance, more bias.

Integrating the squared error gives the asymptotic mean integrated squared error

$$
\mathrm{AMISE}(h)=\frac{h^4}4\mu_2(K)^2R(f'')+\frac{R(K)}{nh},
$$

minimized at

$$
h^\ast=\left(\frac{R(K)}{\mu_2(K)^2R(f'')\,n}\right)^{1/5}\propto n^{-1/5},
\qquad
\mathrm{AMISE}(h^\ast)\propto n^{-4/5}.
$$

Two conclusions that generalize far beyond density estimation. The optimal bandwidth **shrinks slowly**, as \(n^{-1/5}\): a hundredfold increase in data reduces the bandwidth by only a factor of about 2.5. And the achievable rate is \(n^{-4/5}\) in mean integrated squared error, **strictly slower than the \(n^{-1}\)** of a parametric mean-squared error. That gap is the price of not naming a family, stated exactly.

The optimal \(h^\ast\) depends on \(R(f'')=\int f''(x)^2dx\), a functional of the unknown density — the usual circularity of smoothing problems, and the reason section 19 exists.

![The same sample at three bandwidths: spurious modes when variance dominates, the true structure at the balance point, and a single smoothed bump when bias dominates.](../assets/kde-bandwidth-tradeoff.svg)

**Worked example — why doubling the data barely changes the plot.** Going from 1,000 to 2,000 observations reduces \(h^\ast\) by \(2^{-1/5}\approx0.87\). The visible resolution of a density plot improves slowly with sample size, which is why small structures in a KDE should be treated with suspicion unless the sample is very large or the structure is very pronounced.

> **Practice — Foundation:** State the leading bias and variance terms and say which grows and which shrinks with \(h\).
>
> **Practice — Core:** Derive \(h^\ast\propto n^{-1/5}\) by minimizing AMISE.
>
> **Practice — Stretch:** Explain why the attainable rate is \(n^{-4/5}\) rather than \(n^{-1}\), and connect it to the number of quantities being estimated.

## 19. Choosing a bandwidth, and the boundary problem

Three families of bandwidth selectors, in increasing order of effort:

**Rules of thumb.** Silverman's rule substitutes a Gaussian reference for \(R(f'')\):

$$
h_{\text{Silverman}}=0.9\,\min\!\left(\hat\sigma,\ \frac{\mathrm{IQR}}{1.34}\right)n^{-1/5}.
$$

The \(\min\) with a scaled interquartile range guards against a variance inflated by outliers. It is fast, reasonable for unimodal data, and **oversmooths multimodal densities** — the exact case where you most wanted to see structure.

**Cross-validation.** Least-squares cross-validation minimizes \(\int\hat f_h^2-\frac2n\sum_i\hat f_{h,-i}(X_i)\), an unbiased estimate of the integrated squared error up to a constant. Likelihood cross-validation maximizes \(\sum_i\log\hat f_{h,-i}(X_i)\) and is not recommended for heavy tails, where it degenerates. Cross-validation is data-driven and notoriously variable, with a selected bandwidth that itself has large sampling variation.

**Plug-in methods.** Estimate \(R(f'')\) with its own pilot bandwidth and substitute. The Sheather–Jones selector is the standard and is generally the best default: more stable than cross-validation, less biased than a rule of thumb.

**Boundary bias** is the other practical problem. Near an edge of the support — and latencies, durations, counts, and probabilities all have one at zero — part of the kernel mass falls outside the support, so the estimator is biased downward. Worse, the bias is \(O(h)\) at the boundary rather than \(O(h^2)\) in the interior, an order worse. Three fixes: **reflect** the data across the boundary, use **boundary kernels** designed for the edge, or **transform** to an unbounded scale, estimate there, and transform back with the Jacobian from lesson 03. For strictly positive data the log transform is usually the cleanest.

**Adaptive bandwidths** vary \(h\) with local density, using a wider kernel where data is sparse. They help substantially in the tails and complicate the theory.

**Worked example — the density that dipped at zero.** A KDE of response times shows density falling toward zero as \(t\to0^+\), and a team infers a minimum processing time. Half the kernel mass at small \(t\) is being placed on negative times, which is impossible. Log-transforming, estimating, and transforming back removes the artifact entirely and shows a density rising to a mode near the true minimum.

> **Practice — Foundation:** Compute Silverman's bandwidth for a sample with given standard deviation and interquartile range.
>
> **Practice — Core:** Explain why boundary bias is an order worse than interior bias and describe two fixes.
>
> **Practice — Stretch:** Compare Silverman, least-squares cross-validation, and a plug-in bandwidth on bimodal data, and report which recovers the modes.

## 20. Density estimation stops working in several dimensions

In \(d\) dimensions the same analysis gives the optimal rate

$$
\mathrm{AMISE}(h^\ast)\propto n^{-4/(4+d)} ,
$$

which degrades quickly: \(n^{-4/5}\) in one dimension, \(n^{-4/6}\) in two, \(n^{-1/2}\) in four, \(n^{-4/14}\) in ten. To achieve the same error in \(d\) dimensions as \(n\) observations give in one, you need roughly \(n^{(4+d)/5}\) observations — exponential in dimension.

The geometric reason is the concentration phenomena of lesson 12. A kernel of bandwidth \(h\) covers a volume proportional to \(h^d\), so to keep a fixed number of neighbours inside the window as \(d\) grows, \(h\) must grow toward the scale of the whole dataset, at which point the estimator is smoothing over everything and estimating nothing local. In high dimensions, nearly all the volume of a neighbourhood is near its boundary, so "local" averaging is not local.

The practical consequences are worth stating plainly. **Nonparametric density estimation is a tool for one to three dimensions.** Beyond that, use structure: a parametric family, a mixture (lesson 17), a latent-variable model with a learned decoder (lesson 14), or a normalizing flow or score-based model (lesson 15). Modern generative models are exactly the response to this barrier — they impose structure through architecture rather than smoothing through a kernel, which is how they evade a rate that would otherwise be hopeless.

A useful corollary: **do not use a kernel density estimate on embeddings.** A 768-dimensional KDE is not an approximation to anything; the bandwidth that gives nonzero density everywhere gives an essentially constant function.

**Worked example — the anomaly detector that detected nothing.** A team estimates a KDE over 50-dimensional embeddings to flag outliers by low density. At any bandwidth giving nonzero density on held-out points, the density ranking is nearly the ranking of distance-to-centroid, and the detector reduces to a crude norm threshold. The method did not fail loudly; it quietly degenerated.

> **Practice — Foundation:** State the optimal nonparametric density rate in \(d\) dimensions.
>
> **Practice — Core:** Compute how many observations are needed in five dimensions to match the error of 1,000 in one.
>
> **Practice — Stretch:** Explain the geometric mechanism behind the rate degradation using concentration of measure, and name three structural alternatives.

## 21. Nonparametric regression: local averages done properly

The same smoothing ideas estimate a conditional mean \(m(x)=E[Y\mid X=x]\) without assuming a functional form. The **Nadaraya–Watson** estimator is a kernel-weighted average,

$$
\hat m(x)=\frac{\sum_iK\!\left(\frac{x-X_i}h\right)Y_i}{\sum_iK\!\left(\frac{x-X_i}h\right)},
$$

a weighted mean of nearby outcomes. It suffers exactly the boundary problem of section 19, and for the same reason: near an edge the local window is one-sided, so a local *constant* fit is pulled by the slope.

**Local linear regression** fixes this by fitting a weighted least-squares line in each window rather than a constant, and reporting its value at \(x\). The bias improves to \(O(h^2)\) at the boundary as well as the interior, and the estimator becomes **design-adaptive**: its bias does not depend on the density of the \(X\) values, which the Nadaraya–Watson bias does. Local linear is the sensible default; local polynomial of higher order helps for derivative estimation.

Two connections close the loop. The regression discontinuity estimator of lesson 16 §18 is precisely local linear regression on each side of a cutoff, which is why bandwidth choice and boundary bias are its central technical issues. And the bias-variance decomposition here is the same one from lesson 06, with \(h\) as the capacity knob: small \(h\) is a high-capacity model that overfits, large \(h\) is a low-capacity model that underfits, and the optimal \(h\) balances them at rate \(n^{-1/5}\).

**Worked example — the slope at the edge.** Fitting Nadaraya–Watson to a rising trend truncates the rise near the right boundary, because the window there contains only points to the left, all with lower \(Y\). A local linear fit extrapolates the local slope correctly. If the quantity you care about is the value at the boundary — which is exactly the case in regression discontinuity — the difference between the two estimators is the entire result.

> **Practice — Foundation:** Write the Nadaraya–Watson estimator and describe its weights.
>
> **Practice — Core:** Explain why local linear regression removes boundary bias that local constant fitting suffers.
>
> **Practice — Stretch:** Relate bandwidth choice in local linear regression to the bandwidth issue in a regression discontinuity design, and state what a sensitivity analysis over \(h\) should show.

## 22. Rao–Blackwellization reduces Monte Carlo variance

Lesson 11 §5 proved the Rao–Blackwell inequality: conditioning an unbiased estimator on a sufficient statistic preserves unbiasedness and cannot increase variance, because

$$
\operatorname{Var}(U)=E\bigl[\operatorname{Var}(U\mid T)\bigr]+\operatorname{Var}\bigl(E[U\mid T]\bigr).
$$

That was a statement about estimators of a parameter. The same identity is a general-purpose **variance reduction technique for simulation**, and in that guise it appears everywhere in computational statistics and machine learning.

The recipe: whenever part of an expectation can be computed **analytically**, do not simulate that part. Replace \(\hat\psi=g(Z_1,Z_2)\) by \(E[g(Z_1,Z_2)\mid Z_1]\) wherever the inner expectation is available in closed form. The result has the same mean and no more variance, and the reduction equals the variance you were needlessly simulating.

Four instances worth recognizing:

- **Mixtures.** To estimate \(E[g(X)]\) for \(X\) from a mixture, do not sample the component label; average \(\sum_k\pi_kE[g(X)\mid Z=k]\) if the conditional expectations are available, or at least condition on the label to avoid simulating it.
- **Gibbs sampling.** To estimate a marginal density from a Gibbs chain, average the **conditional densities** \(\frac1M\sum_m p(x\mid z^{(m)})\) rather than histogramming the \(x^{(m)}\) draws. The variance reduction is often an order of magnitude, and the estimate is smooth rather than jagged.
- **Discrete latents in gradient estimators.** Lesson 14's score-function estimator has high variance for a categorical latent with few values. Summing exactly over the categories, weighted by their probabilities, is Rao–Blackwellization and typically reduces variance dramatically. This is why "enumerate the latent when \(K\) is small" is standard advice.
- **Evaluation.** When a metric depends on a sampled decoding, averaging the metric over the decoding distribution analytically — where possible — beats sampling one completion per prompt.

The cost is always the same: you must be able to compute the conditional expectation. The rule is to look for it before adding more samples, because an analytic conditional beats a larger \(M\) at zero marginal cost.

**Worked example — a smooth posterior marginal from a jagged chain.** A Gibbs sampler for a hierarchical model gives 2,000 draws of a group effect. The histogram is visibly rough. Averaging the 2,000 conditional Gaussian densities, each available in closed form from the model, produces a smooth curve whose Monte Carlo error is several times smaller — from the same draws, at negligible extra cost.

> **Practice — Foundation:** State the variance identity and explain why conditioning cannot increase variance.
>
> **Practice — Core:** Rao–Blackwellize a Monte Carlo estimate for a two-component mixture and compute the variance reduction exactly.
>
> **Practice — Stretch:** Apply Rao–Blackwellization to a gradient estimator with a categorical latent and compare the variance against the score-function estimator from lesson 14.

## 23. When nonparametric methods fail

Each failure below has a specific cause, and none is fixed by more data alone.

**Dependence.** Every result in this unit assumes independence or exchangeability. Under dependence, the empirical CDF still converges but at the wrong rate, DKW is invalid, rank tests have the wrong null, and KDE bandwidths chosen by cross-validation collapse toward zero because neighbouring correlated points look like a local mode. Cluster, block, or model the dependence.

**Extremes and tails.** The empirical distribution has no mass beyond the sample maximum, so extrapolation is impossible without a tail model. This defeats the bootstrap, KDE, and quantile estimation alike above the largest observation.

**Dimension.** Rates degrade as \(n^{-4/(4+d)}\), and neighbourhood-based reasoning fails geometrically. Three dimensions is a practical ceiling for density estimation.

**Boundaries and support.** Estimators that ignore known support produce mass where none can exist and bias of an order worse at the edge.

**Discreteness and ties.** Rank methods assume continuity; heavy ties require corrections, and with very few distinct values — a 1-to-5 rating scale — the corrections matter and the distribution-free guarantees weaken.

**Small samples for large claims.** A distribution-free method with \(n=20\) gives valid but very wide statements. Validity is not precision, and reporting a valid interval that spans the whole plausible range as if it settled the question is its own error.

**Worked example — cross-validation defeated by autocorrelation.** A KDE of per-minute request rates uses least-squares cross-validation, which selects a bandwidth near zero. The cause is temporal autocorrelation: each point has near-duplicates a minute away, so leaving one out leaves its neighbours in, and the criterion rewards spikes. Thinning the series or blocking the cross-validation fixes it; more data makes it worse.

> **Practice — Foundation:** List three nonparametric failure modes and the assumption each violates.
>
> **Practice — Core:** Explain why cross-validated bandwidths collapse under positive autocorrelation.
>
> **Practice — Stretch:** Design a blocked cross-validation scheme for dependent data and state what it assumes about the dependence range.

## 24. A distribution-free workflow for AI evaluation

The pieces assemble into a default procedure for comparing two systems on a benchmark, with assumptions stated rather than inherited.

1. **Identify the exchangeable unit.** Prompt, user, session, or task — not the row. Everything downstream permutes, resamples, or clusters at that level.
2. **Pick the estimand deliberately.** Mean difference, median difference, or \(P(B>A)\). These are different questions; write down which one the decision needs.
3. **Pair when the design allows it.** Same prompts through both systems removes prompt difficulty and is usually worth more than any test choice.
4. **Use a rank or permutation test by default.** Wilcoxon signed-rank for paired symmetric differences, sign test when symmetry is doubtful, permutation on the original statistic when the scale must be interpretable.
5. **Report an estimate with the test.** Hodges–Lehmann for a shift, \(\hat\theta=U/(mn)\) for a win rate, each with a distribution-free interval.
6. **Do not build a global ranking from pairwise win rates** without acknowledging non-transitivity, or without fitting and checking a model like Bradley–Terry that imposes the structure explicitly.
7. **Report quantiles with uncertainty.** Binomial order-statistic intervals for p95 and p99; never a bare number.
8. **Use a DKW band instead of a goodness-of-fit p-value** when the question is whether a distributional approximation is usable.
9. **Estimate densities only in low dimensions**, with a plug-in bandwidth, a boundary correction for bounded support, and explicit suspicion of small modes.
10. **Rao–Blackwellize anything you are simulating** that has an analytic conditional expectation, before increasing the sample count.

**Worked example — a complete comparison.** 800 prompts, both models, three samples each. Exchangeable unit: prompt. Estimand: \(P(B>A)\) on per-prompt mean scores, because the product question is ordinal. Method: paired sign test plus Hodges–Lehmann on the differences, with a prompt-level permutation null as a cross-check. Report: \(\hat\theta=0.57\) with a distribution-free interval \([0.53,0.61]\), a note that three pairwise comparisons in the suite exhibit a cycle, p95 latency with a binomial interval, and a DKW band showing the score distribution is not usable above the p99. Every number in that report has a stated assumption, and the strongest one is prompt-level exchangeability.

> **Practice — Foundation:** List the workflow steps and name the assumption each protects.
>
> **Practice — Core:** Apply steps 1 through 5 to a benchmark comparison you have seen, and state where the reported analysis diverged.
>
> **Practice — Stretch:** Audit a published leaderboard for the transitivity assumption, and propose a report that is honest about cycles.

## 25. Runnable labs

This chapter has three coding exercises. Each opens as a separate tab in the lesson's right-hand Python workspace.

### Lab A — the empirical CDF with a DKW band

Implement **ecdf_dkw_band** in [labs/exercises.py](../../labs/exercises.py). Given samples, a level \(\alpha\), and query points, return one triple per query: the empirical CDF value, and the lower and upper endpoints of the uniform band \(\hat F_n\pm\sqrt{\ln(2/\alpha)/(2n)}\), clipped to \([0,1]\).

Run:

~~~text
python -m labs.checks dkw-band
~~~

The checks cover exact step values including at sample points, queries below and above the whole sample, clipping at both ends, the band width against a hand-computed \(\varepsilon_n\), monotonicity across sorted queries, generators, input preservation, and invalid levels or empty samples.

### Lab B — Mann–Whitney with ties

Implement **mann_whitney_u** in [labs/exercises.py](../../labs/exercises.py). Given two samples, return the \(U\) statistic for the first sample, the estimate \(\hat\theta=U/(mn)\) of \(P(X>Y)+\frac12P(X=Y)\), and the tie-corrected normal-approximation \(z\) statistic.

Run:

~~~text
python -m labs.checks mann-whitney
~~~

The checks cover complete separation in both directions, a fully tied pair of samples, the identity \(U_{XY}+U_{YX}=mn\), the tie correction against its formula, invariance under any strictly increasing transformation of both samples, generators, input preservation, and empty or non-finite inputs.

### Lab C — Gaussian kernel density estimation

Implement **gaussian_kde** in [labs/exercises.py](../../labs/exercises.py). Given samples, a positive bandwidth, and query points, return the Gaussian kernel density estimate at each query.

Run:

~~~text
python -m labs.checks kde
~~~

The checks cover a single observation reproducing a Gaussian density, the average of two bumps, shift equivariance, scale equivariance including the Jacobian factor, approximate integration to one on a fine grid, decay far from the data, generators, input preservation, and nonpositive or non-finite bandwidths.

### Guided experiment

1. Simulate uniform samples and check \(E[U_{(k)}]=k/(n+1)\) against the Beta result.
2. Verify the Rényi spacing representation for exponential order statistics.
3. Estimate the variance of a sample quantile at several \(p\) and compare against \(p(1-p)/f(q_p)^2\).
4. Build binomial order-statistic intervals for a p99 and check their coverage by simulation.
5. Draw DKW bands at several \(n\) and confirm the coverage claim empirically.
6. Simulate \(\sqrt n\sup|\hat F_n-F|\) from three different populations and confirm the distribution is the same.
7. Compare the power of the \(t\)-test, Wilcoxon, and sign test under Gaussian, Laplace, and contaminated-normal alternatives.
8. Construct three score distributions with a win-rate cycle and fit Bradley–Terry to them.
9. Compute the standard error of a win rate by the U-statistic projection and compare it to the naive binomial formula.
10. Sweep KDE bandwidth over three orders of magnitude on bimodal data and locate the range that recovers both modes.
11. Estimate a density for strictly positive data with and without a log transform, and measure the boundary artifact.
12. Rao–Blackwellize a Gibbs marginal density estimate and measure the variance reduction against histogramming.

## 26. Derivations to own

1. Derive the CDF and density of the \(k\)-th order statistic from the multinomial argument.
2. Show \(U_{(k)}\sim\mathrm{Beta}(k,n-k+1)\) and compute its mean and variance.
3. Derive the joint density of the full ordered sample and explain the factorial.
4. Prove the Rényi representation for exponential spacings.
5. Derive the asymptotic distribution of a sample quantile, identifying the density in the denominator.
6. Construct a distribution-free quantile interval from binomial tail probabilities.
7. Derive the limiting distribution of the maximum of \(n\) exponential observations.
8. Derive the mean, variance, and covariance function of the empirical CDF.
9. Prove Glivenko–Cantelli by the grid-plus-monotonicity argument.
10. Invert the DKW inequality to obtain the band width \(\varepsilon_n\).
11. Show that the rank vector is uniform over permutations under exchangeability.
12. Derive the mean and variance of the Wilcoxon signed-rank statistic.
13. Derive the mean and variance of \(U\), including the tie correction.
14. Show \(E[U/(mn)]=P(X>Y)+\frac12P(X=Y)\) and construct a non-transitive triple.
15. Derive the Hodges–Lehmann estimator by inverting the rank-sum test.
16. Write the sample variance and Mann–Whitney as U-statistics and compute their Hoeffding projections.
17. Derive the leading bias and variance of a kernel density estimate.
18. Minimize AMISE to obtain \(h^\ast\propto n^{-1/5}\) and the \(n^{-4/5}\) rate.
19. Show that boundary bias is \(O(h)\) rather than \(O(h^2)\), and that reflection removes the leading term.
20. Derive the \(d\)-dimensional rate \(n^{-4/(4+d)}\) and interpret it.
21. Derive the Rao–Blackwellized Monte Carlo estimator and its exact variance reduction.

## 27. End-of-unit practice (graded)

**Foundation — problems 1–7.** Compute order-statistic, rank, and smoothing quantities directly.

1. **Order statistics.** Compute the density and expectation of the third of five uniform order statistics.
2. **Extremes.** Write the CDF of the maximum for three named distributions and identify each limiting family.
3. **Empirical CDF.** Tabulate \(\hat F_n\) for ten observations and evaluate it at five queries including outside the range.
4. **DKW.** Compute \(\varepsilon_n\) at three sample sizes and state the guarantee in one sentence each.
5. **Sign test.** Compute exact p-values for three paired datasets.
6. **Mann–Whitney.** Compute \(U\), \(\hat\theta\), and the tie-corrected \(z\) for two small samples with ties.
7. **Bandwidth.** Compute Silverman's bandwidth for a given sample and evaluate a KDE at three points.

**Core — problems 8–16.** Connect the theory to procedures and diagnostics.

8. **Quantile uncertainty.** Compare simulated quantile variance against the asymptotic formula at \(p=0.5,0.9,0.99\), and explain the divergence pattern.
9. **Distribution-free intervals.** Build binomial order-statistic intervals for several quantiles and verify coverage by simulation.
10. **Uniform versus pointwise.** Demonstrate empirically that pointwise intervals undercover as a band, and quantify by how much.
11. **Distribution-freeness.** Show by simulation that the KS null distribution is unchanged across three populations, then break it by estimating parameters from the same data.
12. **Efficiency.** Reproduce the ARE table by simulation for at least three distributions.
13. **Symmetry assumption.** Demonstrate signed-rank inflation under skewed differences with median zero, and show the sign test remains valid.
14. **Win rates.** Estimate \(\hat\theta\) with a U-statistic standard error, and compare against the naive binomial standard error on the same data.
15. **Bandwidth selection.** Compare Silverman, cross-validation, and a plug-in rule on unimodal and bimodal data.
16. **Boundary bias.** Estimate a density for positive data directly, by reflection, and by log transform, and compare against the truth near zero.

**Stretch — problems 17–24.** Analyze failures, rates, and evaluation design.

17. **Tail estimation.** Fit a generalized Pareto at several thresholds, assess stability of \(\hat\xi\), and state what you would report about a p9999.
18. **Bootstrap failure.** Demonstrate bootstrap failure for the sample maximum and explain it in terms of the empirical distribution's support.
19. **Non-transitivity.** Construct three model score distributions with a strict win-rate cycle, fit Bradley–Terry, and quantify the misfit.
20. **Degenerate U-statistics.** Exhibit a kernel with \(\zeta_1=0\), show the limit is not Gaussian, and explain why permutation calibration is used.
21. **Dependence.** Show that DKW coverage and cross-validated bandwidths both fail under autocorrelation, and repair each.
22. **Rate barrier.** Measure the empirical convergence rate of a KDE in one, two, and four dimensions and compare against \(n^{-4/(4+d)}\).
23. **Rao–Blackwell.** Apply Rao–Blackwellization to a discrete-latent gradient estimator and measure the variance reduction against the score-function estimator.
24. **Complete distribution-free evaluation.** Take one real benchmark comparison through the full workflow, including the exchangeable unit, estimand choice, rank test, distribution-free interval, quantile uncertainty, and a statement of which assumption is the weakest.

<details><summary>Worked solution sketches</summary>

1. Use \(f_{(k)}\propto F^{k-1}(1-F)^{n-k}f\); for uniforms this is Beta\((k,n-k+1)\) with mean \(k/(n+1)\).
2. Raise each CDF to the \(n\)-th power; classify by tail — exponential and normal give Gumbel, Pareto gives Fréchet, bounded support gives Weibull.
3. The empirical CDF is a right-continuous step function with jumps of \(1/n\); it is 0 below the minimum and 1 at and above the maximum.
4. \(\varepsilon_n=\sqrt{\ln(2/\alpha)/(2n)}\); the guarantee is simultaneous over all \(x\), finite-sample, and distribution-free.
5. Count positive differences and use exact binomial tails at \(p=1/2\).
6. Rank the pooled sample, sum the first sample's ranks, subtract \(m(m+1)/2\), and apply the tie correction to the variance before forming \(z\).
7. \(h=0.9\min(\hat\sigma,\mathrm{IQR}/1.34)n^{-1/5}\); evaluate the kernel sum at each query.
8. Variance grows sharply with \(p\) because \(f(q_p)\) shrinks; the asymptotic formula degrades in the far tail where few observations sit nearby.
9. Choose ranks \(r,s\) whose binomial tail probabilities bracket the level; coverage is exact and does not depend on the distribution.
10. The supremum of many pointwise deviations exceeds any single one; the uniform band is roughly 1.4 times wider at the centre for typical levels.
11. The probability integral transform makes every continuous case the uniform case; estimating parameters pulls the reference toward the data and shrinks the statistic.
12. Simulate power curves at matched local alternatives and read off sample-size ratios; the Gaussian ratio should land near 0.955.
13. With skew, large-magnitude differences on one side dominate the rank sum even when the median is zero; the sign test uses only signs and is unaffected.
14. The U-statistic standard error uses the variance of \(P(x>Y)\) across \(x\); the binomial formula ignores that the \(mn\) pairs are dependent.
15. Silverman oversmooths bimodal data; cross-validation is unstable; the plug-in rule is usually the best compromise.
16. Direct estimation loses mass across the boundary; reflection or a log transform restores it, the latter requiring the Jacobian.
17. Report \(\hat\xi\) with its stability across thresholds and a wide interval; a p9999 from a few thousand observations is an extrapolation, not an estimate.
18. The resampled maximum never exceeds the observed maximum, so the bootstrap distribution is degenerate on one side and coverage fails.
19. Construct overlapping score distributions with different shapes; Bradley–Terry forces a total order and its residual pattern reveals the cycle.
20. Under the null of equal distributions some kernels have zero first projection; the limit is a weighted sum of chi-squares, so permutation gives the correct calibration.
21. Autocorrelation inflates effective dependence: DKW's independence assumption fails and cross-validation rewards spikes. Block or thin.
22. Fit error against \(n\) on a log-log scale; the slopes should approach \(-4/(4+d)\).
23. Enumerate the categorical latent exactly and weight by its probabilities; the variance reduction equals the variance previously spent simulating the label.
24. A complete answer names the exchangeable unit, chooses among mean, median, and ordinal estimands, pairs where possible, tests by rank or permutation, reports a distribution-free interval, gives quantile uncertainty, and names its weakest assumption.

</details>

## Mastery check

Given an unfamiliar distributional question, derive the distribution of the relevant order statistic; state and use the asymptotic law of a sample quantile, including why its precision depends on the local density; distinguish pointwise from uniform convergence and draw a valid finite-sample band; explain why rank statistics are distribution-free and quantify what that costs; compute and interpret a win rate as \(P(X>Y)\) rather than as a difference of medians, and refuse to build a ranking from it without acknowledging non-transitivity; choose a bandwidth with a defensible rule, correct for boundaries, and state the dimension beyond which you would not attempt density estimation at all; and reduce Monte Carlo variance by conditioning before increasing the sample size.

The next unit in this track should develop stochastic processes and time series — Markov chains beyond MCMC, stationarity and autocorrelation, AR and ARMA processes, Poisson and renewal processes, martingales, and forecasting with time-dependent uncertainty. It is the last of the six clusters identified for this track, and the order statistics and empirical process theory built here are what its estimators are analyzed with.
