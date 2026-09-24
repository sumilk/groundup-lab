---
id: math.probability.limit-theorems-monte-carlo
title: Repeated samples, limit theorems, and Monte Carlo error
prerequisites: [math.probability.joint-conditioning-covariance]
answers: ps-05-limit-theorems-monte-carlo
estimated_hours: 30
---

# Repeated samples, limit theorems, and Monte Carlo error

A single random observation can be noisy. An average of many observations is often more stable. That simple fact powers benchmark averages, simulation, minibatch gradients, polling, randomized algorithms, and empirical research—but several different mathematical ideas hide inside it.

This unit separates them:

- a **law of large numbers** says an average approaches its target;
- a **central limit theorem** describes the approximate shape and scale of its random error;
- a **concentration inequality** gives a finite-sample ceiling on the chance of a large error;
- a **Monte Carlo standard error** estimates the remaining simulation noise;
- heavy tails and dependence explain why blindly using an iid square-root rule can be dangerously optimistic.

By the end, you should be able to derive the variance of an average, distinguish convergence concepts, standardize a sample mean, decide when a Gaussian approximation is plausible, choose and interpret a concentration bound, estimate Monte Carlo error, and repair uncertainty calculations when observations arrive in correlated clusters.

## 0. The repeated-sampling mental model

Let \(X_1,\ldots,X_n\) be observations produced by repeating an experiment. The sample mean is

$$
\bar X_n=\frac1n\sum_{i=1}^n X_i.
$$

There are three layers to keep separate:

1. The population or simulation model gives each \(X_i\) a distribution with mean \(\mu\).
2. One realized dataset gives one numerical value of \(\bar X_n\).
3. Repeating the entire dataset-generation process gives a **sampling distribution** for \(\bar X_n\).

The third layer is easy to miss. An estimator is a function of random data, so before data are observed it is itself a random variable.

**Worked example — accuracy across repeated test sets.** Suppose a fixed classifier has probability \(p=0.7\) of answering a randomly drawn benchmark item correctly. Encode correctness as \(X_i\in\{0,1\}\). A test set of 100 items produces one accuracy \(\bar X_{100}\). If we independently draw 1,000 new test sets, we obtain 1,000 different accuracies. Their histogram approximates the sampling distribution of \(\bar X_{100}\); it is not the distribution of individual correctness values.

> **Practice — Foundation:** Identify the experiment, observation, estimator, and target when estimating a model's success probability from 200 independently sampled prompts.
>
> **Hint:** The experiment is drawing 200 prompts and running the model; each observation is one 0/1 success; the estimator is the proportion of successes; the target is the model's success probability over the prompt population, which stays fixed across repetitions.
>
> **Practice — Core:** Simulate the sampling distribution of the average of five fair-die rolls: with NumPy `default_rng(0)`, draw 10,000 datasets of 5 rolls each. Report the mean and standard deviation of the 10,000 averages and compare them with \(3.5\) and \(\sqrt{(35/12)/5}\approx0.764\). Identify the two nested repetitions.
>
> **Hint:** The inner repetition rolls 5 dice to make one dataset and one average; the outer repetition makes 10,000 such datasets. One die has variance \(35/12\), so the average has variance \(35/60\).
>
> **Practice — Stretch:** A report bootstraps rows from the fixed dataset \((2,3,5,7,11)\). List the only values a bootstrap resample can contain, give the smallest and largest possible bootstrap mean, and compute the bootstrap standard deviation of the mean, \(\sqrt{\hat\sigma^2/n}\) with the divisor-\(n\) variance \(\hat\sigma^2\). Explain why this differs conceptually from drawing fresh datasets from the unknown population.
>
> **Hint:** Resamples only reuse 2, 3, 5, 7 and 11, so bootstrap means lie in \([2,11]\). The plug-in variance is \(\hat\sigma^2=10.24\), so the bootstrap SD is \(\sqrt{10.24/5}\approx1.43\). Fresh population draws could include values such as 1 or 13, which the empirical distribution never produces.

## 1. Why averaging reduces variance

Assume initially that \(X_1,\ldots,X_n\) are independent and identically distributed—**iid**—with

$$
E[X_i]=\mu,\qquad \operatorname{Var}(X_i)=\sigma^2<\infty.
$$

Linearity of expectation gives

$$
E[\bar X_n]
=\frac1n\sum_{i=1}^nE[X_i]
=\mu.
$$

Independence makes all cross-covariances zero, so

$$
\operatorname{Var}(\bar X_n)
=\frac1{n^2}\sum_{i=1}^n\operatorname{Var}(X_i)
=\frac{\sigma^2}{n}.
$$

Therefore

$$
\operatorname{SD}(\bar X_n)=\frac{\sigma}{\sqrt n}.
$$

This is the square-root law: multiplying the sample size by four halves the standard deviation of the mean. Multiplying it by one hundred divides that standard deviation by ten.

![Several running sample means fluctuate strongly at first and then settle into a band that narrows at the inverse-square-root rate.](../assets/averaging-stabilizes.svg)

The paths in the diagram do not have to move steadily toward \(\mu\). New observations can temporarily move an average away. Stability is a statement about the shrinking distribution of error, not monotone progress along every realized path.

**Worked example — Bernoulli accuracy.** If \(X_i\sim\operatorname{Bernoulli}(0.7)\), then \(\sigma^2=p(1-p)=0.21\). At \(n=100\), the standard deviation of observed accuracy across independent test sets is

$$
\sqrt{\frac{0.21}{100}}\approx0.0458.
$$

At \(n=10{,}000\), it is approximately \(0.00458\). One extra decimal place of stability costs roughly one hundred times as many independent items.

> **Practice — Foundation:** Derive the mean and variance of an average of 25 iid variables with mean 4 and variance 9.
>
> **Hint:** The mean of \(\bar X\) is still 4; the variance of an iid mean is the individual variance divided by \(n\), here \(9/25\).
>
> **Practice — Core:** Two independent estimates use \(n\) and \(9n\) observations. Compare their standard deviations and the widths of equally calibrated error bars.
>
> **Hint:** Standard deviation scales with the inverse square root of sample size.
>
> **Practice — Stretch:** Derive the variance of a weighted average \(\sum_iw_iX_i\) for independent observations with common variance \(\sigma^2\). Show that under \(\sum_iw_i=1\) equal weights minimize it, and check with \(n=3\), \(\sigma^2=1\): compare \(w=(0.5,0.25,0.25)\) with \(w=(1/3,1/3,1/3)\).
>
> **Hint:** The variance is \(\sigma^2\sum_iw_i^2\). Write \(w_i=1/n+d_i\) with \(\sum_id_i=0\), so \(\sum_iw_i^2=1/n+\sum_id_i^2\); the check gives \(0.375\) versus \(0.333\).

## 2. Convergence in probability and the weak law

A sequence of random variables \(Y_n\) converges **in probability** to a constant \(c\) if, for every tolerance \(\varepsilon>0\),

$$
P(|Y_n-c|>\varepsilon)\longrightarrow0
\qquad\text{as }n\to\infty.
$$

Write this as \(Y_n\xrightarrow{P}c\).

The weak law of large numbers states, under common conditions such as iid observations with finite mean,

$$
\bar X_n\xrightarrow{P}\mu.
$$

Translate the symbols into a sentence: choose any fixed error tolerance, however small. The probability that the sample mean misses the population mean by more than that tolerance eventually becomes arbitrarily small.

The weak law does **not** say:

- \(\bar X_n=\mu\) for a finite \(n\);
- error decreases on every step of a realized run;
- all distributions converge at the same speed;
- a dataset with dependent or shifting observations behaves as if it were iid.

**Worked example — interpreting the event.** Let \(X_i\) be response latency with mean \(200\) ms. Setting \(\varepsilon=10\) ms makes the deviation event

$$
\{|\bar X_n-200|>10\}.
$$

The law says the probability of this event vanishes with \(n\); it does not supply a usable sample size by itself.

> **Practice — Foundation:** For the accuracy \(\bar X_n\) of a model with true accuracy \(\mu=0.7\), write in words what \(\bar X_n\xrightarrow{P}\mu\) means for the fixed tolerance \(\varepsilon=0.01\).
>
> **Hint:** Fix \(\varepsilon=0.01\) first: the claim is that \(P(|\bar X_n-0.7|>0.01)\) tends to zero as \(n\) grows. It says nothing about one particular run of evaluations.
>
> **Practice — Core:** The coin flips \(1,0,1,1,0,0,1,0\) (\(\mu=0.5\)) give running means \(\bar x_1,\dots,\bar x_8\). Compute them, count how many times the error \(|\bar x_n-0.5|\) increases from one step to the next, and explain why this does not contradict convergence.
>
> **Hint:** The running means are \(1,0.5,0.667,0.75,0.6,0.5,0.571,0.5\). Convergence in probability is a statement about the probability of large error at each large \(n\); it does not require each successive error to shrink.
>
> **Practice — Stretch:** Let \(Y_n\) equal 1 with probability \(1/n\) and 0 otherwise. Prove that \(Y_n\xrightarrow{P}0\). Then compare two constructions: (a) the \(Y_n\) are independent; (b) \(Y_n=\mathbf 1\{U\le1/n\}\) for one shared \(U\sim\text{Uniform}(0,1)\). In which construction is every realization eventually zero?
>
> **Hint:** \(P(|Y_n|>\varepsilon)=1/n\to0\) in both constructions. In (a), \(\sum1/n=\infty\) and the second Borel–Cantelli lemma gives infinitely many 1s almost surely. In (b), every path with \(U>0\) is zero once \(n>1/U\).

## 3. A weak-law proof from Chebyshev's inequality

Chebyshev's inequality says that any random variable \(Y\) with finite variance obeys

$$
P(|Y-E[Y]|\ge\varepsilon)
\le
\frac{\operatorname{Var}(Y)}{\varepsilon^2}.
$$

Apply it to the iid sample mean:

$$
P(|\bar X_n-\mu|\ge\varepsilon)
\le
\frac{\sigma^2}{n\varepsilon^2}.
$$

For fixed \(\sigma^2\) and \(\varepsilon>0\), the right side approaches zero. This proves a finite-variance version of the weak law.

Notice the proof's architecture:

1. show the estimator is centered at the target;
2. show its variance shrinks;
3. convert shrinking variance into shrinking deviation probability.

That template reappears throughout statistics and learning theory.

**Worked example — a valid but loose guarantee.** Suppose \(\sigma^2=4\), \(n=1{,}000\), and the tolerance is \(0.2\). Chebyshev gives

$$
P(|\bar X_n-\mu|\ge0.2)
\le\frac{4}{1000(0.2)^2}=0.1.
$$

The true probability might be far smaller. An inequality is a guaranteed ceiling under its assumptions, not an estimate of the actual tail probability.

> **Practice — Foundation:** Use Chebyshev to bound \(P(|\bar X_n-\mu|\ge0.5)\) when \(\sigma^2=9\) and \(n=400\).
>
> **Hint:** Insert the variance of the mean, not the variance of one observation.
>
> **Practice — Core:** Solve \(\sigma^2/(n\varepsilon^2)\le\delta\) for \(n\), then evaluate it for \(\sigma^2=4\), \(\varepsilon=0.1\), \(\delta=0.05\), and interpret the resulting sample-size requirement.
>
> **Hint:** Rearrange to \(n\ge\sigma^2/(\varepsilon^2\delta)\) and round up: \(4/(0.01\times0.05)\). This is a distribution-free guarantee, so it is usually conservative.
>
> **Practice — Stretch:** Repeat the weak-law proof for independent, non-identically distributed variables with common mean \(\mu\) and variances bounded by \(V\); for example, variances alternating between 1 and 4, so \(V=4\). Evaluate the resulting bound at \(n=100\), \(\varepsilon=0.5\), compare it with the bound from the actual average variance 2.5, and identify the precise step where independence is used.
>
> **Hint:** \(\operatorname{Var}(\bar X_n)=n^{-2}\sum_i\operatorname{Var}X_i\le V/n\) holds only because independence removes the off-diagonal covariances; then Chebyshev gives \(V/(n\varepsilon^2)=0.16\), versus \(0.1\) using 2.5.

## 4. Almost-sure convergence and the strong law

Convergence in probability asks about the deviation probability separately at each \(n\). **Almost-sure convergence** asks about an entire infinite sample path:

$$
P\!\left(\lim_{n\to\infty}\bar X_n=\mu\right)=1.
$$

Write \(\bar X_n\xrightarrow{\text{a.s.}}\mu\). Under standard iid finite-mean assumptions, the strong law of large numbers gives this stronger conclusion.

A useful mental picture is:

- weak law: at a large chosen time, most paths are close;
- strong law: with probability one, a whole path eventually stays within every fixed tolerance.

“Almost surely” still allows an exceptional set of paths, but that set has probability zero. Probability zero is not the same logical statement as impossibility; a continuous variable taking one exact value is the familiar example.

We will use the strong law as a theorem rather than prove it here. Its proof requires tools beyond the finite-variance Chebyshev argument above.

> **Practice — Foundation:** For iid fair-coin running proportions \(\hat p_n\), state in one sentence each what \(P(|\hat p_n-0.5|>0.01)\to0\) claims and what \(P(\hat p_n\to0.5)=1\) claims, without using the phrase “stronger convergence.”
>
> **Hint:** The first is a statement about the distribution of \(\hat p_n\) at each fixed large \(n\). The second is about whole infinite paths: almost every path eventually stays within any band forever.
>
> **Practice — Core:** Let \(Y_n\) be independent Bernoulli\((1/n)\). Compute \(P(Y_n=1)\) at \(n=1000\) and the probability that a path has at least one 1 among \(n=1001,\dots,2000\). Use the two numbers to explain what almost-sure convergence requires beyond a small failure probability at each fixed \(n\).
>
> **Hint:** \(\prod_{n=1001}^{2000}(1-1/n)\) telescopes to \(1000/2000\), so half of all paths leave the band somewhere in that block even though each single time has failure probability about \(0.001\).
>
> **Practice — Stretch:** For independent \(Y_n\sim\text{Bernoulli}(1/n)\), show that the probability of no 1 among \(n=N+1,\dots,2N\) equals \(1/2\) for every \(N\). Use this to explain why even a very long prefix of zeros cannot verify the probability-one statement that the path is eventually zero, and which of the two is actually true here.
>
> **Hint:** \(\prod_{n=N+1}^{2N}\frac{n-1}{n}=\frac N{2N}\). Each future block independently has probability \(1/2\) of containing a 1, so any finite prefix is followed by more 1s almost surely.

## 5. Sampling distributions and standard error

The **standard error** of an estimator is the standard deviation of its sampling distribution. For an iid mean with known variance,

$$
\operatorname{SE}(\bar X_n)=\frac{\sigma}{\sqrt n}.
$$

Usually \(\sigma\) is unknown. The sample variance

$$
s^2=\frac1{n-1}\sum_{i=1}^n(X_i-\bar X_n)^2
$$

produces the estimated standard error

$$
\widehat{\operatorname{SE}}(\bar X_n)=\frac{s}{\sqrt n}.
$$

Keep three quantities distinct:

- \(s\) describes spread among individual observations;
- \(s/\sqrt n\) estimates spread among repeated sample means;
- \(|\bar X_n-\mu|\) is the unknown realized error in this particular sample.

A standard error is not the realized error and does not guarantee that the target lies within one standard error.

**Worked example — seed-to-seed variation.** Five independent training runs produce evaluation scores \(0.71,0.75,0.69,0.74,0.76\). Their mean is \(0.73\). The sample standard deviation is about \(0.029\), so the estimated standard error of the five-run mean is about \(0.013\). Reporting \(0.73\pm0.029\) describes run spread; reporting a multiple of \(0.013\) addresses uncertainty in the average under an iid-run model.

> **Practice — Foundation:** One hundred observed losses have sample standard deviation 2.0. State what 2.0 describes, compute the standard error of the mean loss, and say what happens to each quantity if 400 losses are collected instead.
>
> **Hint:** The SD describes the spread of individual losses and stays near 2.0 as \(n\) grows; the standard error \(s/\sqrt n=2.0/10\) describes the spread of the mean and halves at \(n=400\).
>
> **Practice — Core:** Compute the sample standard deviation and estimated standard error for \(2,4,4,6\). Then predict how the standard error changes if the same distribution is sampled 16 times.
>
> **Hint:** The mean is 4 and the squared deviations are \(4,0,0,4\), so \(s^2=8/3\) with divisor \(n-1=3\); divide \(s\) by \(\sqrt4\), and by \(\sqrt{16}\) for the larger sample.
>
> **Practice — Stretch:** A paper reports accuracy \(0.625\) with standard error \(0.001\) computed over one million tokens, but the four independently trained models score \(0.61, 0.64, 0.58, 0.67\). Compute the model-level standard error of the mean, compare it with \(0.001\), and explain which target each uncertainty calculation addresses.
>
> **Hint:** Treat each model as one unit: the sample SD of the four scores is about \(0.0387\), so the standard error is about \(0.0387/2\approx0.019\). The token SE covers new tokens for these fixed models; the model SE covers retraining.

## 6. The central limit theorem

The iid central limit theorem says that if \(X_i\) have mean \(\mu\) and finite, positive variance \(\sigma^2\), then

$$
Z_n=
\frac{\sqrt n(\bar X_n-\mu)}{\sigma}
\xrightarrow{d}\mathcal N(0,1).
$$

Convergence in distribution means the CDF of \(Z_n\) approaches the standard Gaussian CDF at its continuity points.

The standardization performs three jobs:

1. subtract \(\mu\) to center the error at zero;
2. multiply by \(\sqrt n\) so the shrinking error remains visible;
3. divide by \(\sigma\) to express error in standard-deviation units.

![A skewed standardized sampling distribution becomes smoother and more Gaussian as sample size grows.](../assets/clt-shape.svg)

Undoing the standardization gives the approximation

$$
\bar X_n\approx
\mathcal N\!\left(\mu,\frac{\sigma^2}{n}\right)
$$

for sufficiently large \(n\). The CLT describes the distribution of the average, not necessarily the distribution of the original \(X_i\). Highly non-Gaussian observations can still produce an approximately Gaussian mean.

If the observations themselves are Gaussian, the sample mean is exactly Gaussian for every \(n\); no approximation or large-sample argument is needed.

> **Practice — Foundation:** Standardize a sample mean of iid variables when \(n=64\), \(\mu=10\), and \(\sigma=4\).
>
> **Hint:** \(\bar X_{64}\) has standard deviation \(\sigma/\sqrt n=4/8=0.5\), so \(Z=(\bar X_{64}-10)/0.5\).
>
> **Practice — Core:** Starting from the standardized CLT, derive the approximate distribution of the sum \(S_n=\sum_iX_i\). Then, for \(n=64\), \(\mu=10\), \(\sigma=4\), approximate \(P(S_{64}>680)\).
>
> **Hint:** \(S_n=n\bar X_n\approx N(n\mu,n\sigma^2)\), which here is \(N(640,32^2)\); standardize \(680\) to \(z=40/32=1.25\).
>
> **Practice — Stretch:** For iid Uniform\((0,1)\) variables (\(\sigma^2=1/12\)), compute the standard deviation of \(\bar X_n-\mu\) and of \(\sqrt n(\bar X_n-\mu)\) at \(n=100\) and \(n=10{,}000\). Explain why the first converges to zero while the second converges to a non-degenerate distribution.
>
> **Hint:** \(\operatorname{sd}(\bar X_n-\mu)=0.2887/\sqrt n\) shrinks (0.0289, then 0.0029), while multiplying by \(\sqrt n\) keeps the SD at \(0.2887\) for every \(n\).

## 7. Using a Gaussian approximation carefully

Suppose \(X_i\sim\operatorname{Bernoulli}(p)\). Then

$$
\bar X_n\approx\mathcal N\!\left(p,\frac{p(1-p)}n\right).
$$

**Worked example — unusually high observed accuracy.** Let \(p=0.72\) and \(n=200\). The standard deviation of the accuracy is

$$
\sqrt{\frac{0.72(0.28)}{200}}\approx0.03175.
$$

An observed accuracy of \(0.78\) is approximately

$$
z=\frac{0.78-0.72}{0.03175}\approx1.89
$$

standard deviations above the target. A standard Gaussian upper tail beyond \(1.89\) is about \(0.029\).

But accuracy is a discrete count divided by \(n\). The event \(\bar X_n\ge0.78\) means at least 156 successes. A continuity correction approximates this count event using boundary \(155.5\):

$$
z_{\text{cc}}
=\frac{155.5-200(0.72)}{\sqrt{200(0.72)(0.28)}}
\approx1.81.
$$

The correction respects that the continuous approximation is standing in for discrete probability bars.

Do not turn “\(n\ge30\)” into a law. Approximation quality depends on skewness, discreteness, tails, and the event being approximated. For Bernoulli sums, checking whether both \(np\) and \(n(1-p)\) are reasonably large is more informative than checking \(n\) alone.

> **Practice — Foundation:** For \(p=0.5,n=100\), compute the mean and standard deviation of the success count and of the observed proportion.
>
> **Hint:** For the count use np and sqrt(np(1-p)); divide by n for the proportion.
>
> **Practice — Core:** Approximate \(P(\bar X_n\le0.4)\) for \(p=0.5,n=100\), first without and then with a continuity correction.
>
> **Hint:** \(\bar X\le0.4\) is \(S\le40\) with \(S\) having mean 50 and SD 5; without correction use \(z=-2\), and with correction use the boundary \(40.5\), so \(z=-1.9\). The exact value is about \(0.0284\).
>
> **Practice — Stretch:** Compare the exact binomial probability with the continuity-corrected Gaussian approximation for \(n=100,p=0.5\) at \(P(S\le40)\), \(P(S\le30)\), \(P(S\le25)\), and for \(n=100,p=0.05\) at \(P(S\ge12)\) and \(P(S\ge15)\). Report the ratio approximation/exact in each case and identify where the center is fine but the tail is not.
>
> **Hint:** Use `scipy.stats.binom` for the exact values. The ratio should be about 1.01 at \(S\le40\) but about 1.7 at \(S\le25\), and it falls to about 0.05 at \(p=0.05\), \(S\ge15\): a small absolute error can be a large relative tail error.

## 8. When the ordinary CLT approximation fails

The theorem has assumptions, and the approximation has a regime.

- **Too little averaging:** small \(n\) can preserve skewness, gaps, and multimodality.
- **Rare events:** a large \(n\) is not enough when \(np\) remains small.
- **Extreme tails:** convergence near the center can be much better than far into a tail.
- **Infinite variance:** the usual \(\sqrt n\) scaling and Gaussian limit may fail.
- **Dependence:** correlated observations change the variance and sometimes the limit.
- **Nonstationarity:** if distributions shift with \(i\), there may be no single stable \(\mu\).
- **Selection:** stopping or reporting based on observed results changes the relevant distribution.

**Worked example — rare errors.** Let an independent request fail with probability \(p=0.002\), and observe \(n=100\) requests. Although \(n\) sounds moderately large, \(np=0.2\). The exact probability of zero failures is

$$
(1-0.002)^{100}\approx0.819.
$$

The count distribution has a large point mass at zero and strong right skew. A Gaussian approximation centered at \(0.2\) cannot represent this shape well. A Poisson approximation with rate \(0.2\) is much more natural.

> **Practice — Foundation:** For a Bernoulli sum, calculate \(np\) and \(n(1-p)\) at \(n=1{,}000,p=0.001\) and assess a Gaussian approximation.
>
> **Hint:** A large n does not imply a large expected number of rare successes.
>
> **Practice — Core:** For three failure categories above—rare events, infinite variance, and dependence—give a concrete numerical example of each (for instance \(n=100\), \(p=0.002\); a Cauchy sample; and \(X_i\) all equal to one shared fair coin), and state which step of the standard CLT argument breaks.
>
> **Hint:** Rare events: \(np=0.2\) leaves a point mass at zero. Cauchy: there is no finite \(\sigma^2\) to standardize by. Shared coin: \(\operatorname{Var}(\bar X_n)=\operatorname{Var}(X_1)=0.25\) never shrinks, because the independence step fails.
>
> **Practice — Stretch:** With NumPy `default_rng(0)`, for \(n=100,1000,10000\), simulate 1,000 datasets from a Pareto distribution with \(x_m=1\), \(\alpha=1.5\) (mean 3, infinite variance; `1 + rng.pareto(1.5, size)`) and 1,000 from an Exponential with mean 3. Report the 5th, 50th and 95th percentiles of the sample means and the largest single draw for each \(n\). Explain why the Pareto means look erratic for a long time.
>
> **Hint:** Expect the Exponential 5–95% range to shrink like \(1/\sqrt n\) around 3, while the Pareto range stays right-skewed with a median below 3 (about 2.7 at \(n=100\)), and single draws in the tens of thousands appear at \(n=10^4\).

## 9. Monte Carlo estimation is expectation by sampling

Suppose a target can be written

$$
\theta=E[h(X)]
$$

but the expectation is difficult to compute analytically. Draw \(X_1,\ldots,X_n\) and use

$$
\hat\theta_n=\frac1n\sum_{i=1}^nh(X_i).
$$

This is Monte Carlo estimation. It is just a sample mean applied to the transformed variable \(h(X)\).

For an event \(A\), choose the indicator \(h(X)=\mathbf1\{X\in A\}\). Then

$$
\theta=P(X\in A),
\qquad
\hat\theta_n=\frac{\text{number of simulated hits}}n.
$$

If the draws are iid, the estimator is unbiased and

$$
\operatorname{Var}(\hat\theta_n)
=\frac{\operatorname{Var}(h(X))}{n}.
$$

**Worked example — estimating a rare event.** To estimate \(P(S\ge25)\) for a complicated random sum \(S\), simulate \(S_i\) and average \(I_i=\mathbf1\{S_i\ge25\}\). If 48 of 100,000 simulations hit, then \(\hat p=0.00048\). The plug-in standard error is approximately

$$
\sqrt{\frac{\hat p(1-\hat p)}n}
\approx0.000069.
$$

Only 48 effective hits support the estimate. The large total draw count should not create false confidence about a very small tail probability.

> **Practice — Foundation:** Let \(X\sim N(0,1)\), \(g(x)=x^2\) and \(t=4\). Write the indicator-based Monte Carlo estimator of \(P(g(X)>t)\) from \(N\) independent draws, give the true value, and compute the estimator's standard error for \(N=10{,}000\).
>
> **Hint:** \(\hat p=N^{-1}\sum_j\mathbf 1\{X_j^2>4\}\); the true value is \(P(|X|>2)\approx0.0455\) and the SE is \(\sqrt{p(1-p)/N}\).
>
> **Practice — Core:** Derive the variance of the event-probability estimator \(\hat p\) from \(N\) independent draws, find its worst case over \(p\in[0,1]\), and evaluate the standard error at \(N=10{,}000\) for \(p=0.0455\) and for the worst case.
>
> **Hint:** Each indicator is Bernoulli\((p)\), so \(\operatorname{Var}\hat p=p(1-p)/N\), which is maximized at \(p=1/2\); the SEs are about \(0.0021\) and \(0.005\).
>
> **Practice — Stretch:** Two simulated systems have outputs \(A=U^2\) and \(B=U^2+0.1U\) for \(U\sim\text{Uniform}(0,1)\). Compare the variance per draw of the paired estimator of \(E[A-B]\) (same \(U\) for both) with that of the difference of two independent estimates, and derive why pairing helps.
>
> **Hint:** Paired: \(A-B=-0.1U\) has variance \(0.01/12\). Independent: \(\operatorname{Var}A+\operatorname{Var}B\) with \(\operatorname{Var}(U^2)=4/45\) and \(\operatorname{Cov}(U^2,U)=1/12\). Pairing subtracts \(2\operatorname{Cov}(A,B)\).

## 10. Planning and monitoring Monte Carlo error

For iid draws with finite variance, a rough large-sample error bar is

$$
\hat\theta_n\pm z\,\frac{s_h}{\sqrt n},
$$

where \(s_h\) is the sample standard deviation of \(h(X_i)\) and \(z\) is a chosen Gaussian multiplier such as \(1.96\).

To target standard error at most \(r\), the idealized sample-size equation is

$$
n\ge\frac{\sigma_h^2}{r^2}.
$$

Because \(\sigma_h^2\) is unknown, use a pilot run or a conservative bound. For an indicator, \(p(1-p)\le1/4\), so

$$
n\ge\frac{1}{4r^2}
$$

guarantees the target standard-error scale under independent sampling. Achieving \(r=0.001\) can therefore require up to 250,000 draws.

**Stopping caution.** If you inspect estimates repeatedly and stop precisely when an ordinary interval first excludes an inconvenient value, its nominal coverage no longer applies automatically. A fixed sample size, a predeclared precision rule with appropriate sequential analysis, or an untouched confirmation run makes the inferential target clearer.

Also separate Monte Carlo error from model error. A billion flawless simulations can estimate the wrong probability extremely precisely if the simulator is misspecified.

> **Practice — Foundation:** Under the worst-case Bernoulli variance, calculate the sample size needed for standard error at most \(0.005\).
>
> **Hint:** Solve 0.25/n <= the square of the desired standard error.
>
> **Practice — Core:** A pilot run of 900 draws estimates \(\sigma_h=12\). Compute the current standard error and the approximate draw count required to halve it.
>
> **Hint:** The current SE is \(12/\sqrt{900}=0.4\); halving the SE requires four times as many independent draws.
>
> **Practice — Stretch:** A queue simulator's mean wait from seeds 1–5 (10,000 draws each) is \(4.12, 4.09, 4.15, 4.10, 4.14\), each with within-run standard error 0.02. Halving the time step changes the pooled estimate from 4.12 to 4.11. Real measurements (500 observations) give \(4.60\) with standard error 0.10. Write a short report that separates seed variation, Monte Carlo standard error, numerical error and simulator misspecification, with a number for each.
>
> **Hint:** The seed-to-seed SD is about \(0.026\), consistent with SE \(0.02\); the pooled MC SE is about \(0.02/\sqrt5\), the discretization error is about \(0.01\), and the gap of \(0.48\) from reality is about \(4.8\) combined SEs, which more draws cannot close.

## 11. Concentration inequalities give finite-sample ceilings

Limit theorems describe behavior as \(n\) grows. Concentration inequalities provide statements valid at a particular finite \(n\).

**Markov's inequality.** For nonnegative \(Y\) and \(a>0\),

$$
P(Y\ge a)\le\frac{E[Y]}a.
$$

The proof is one line: \(Y\ge a\mathbf1\{Y\ge a\}\); take expectations.

**Chebyshev's inequality.** Apply Markov to \((Y-E[Y])^2\):

$$
P(|Y-E[Y]|\ge\varepsilon)
\le\frac{\operatorname{Var}(Y)}{\varepsilon^2}.
$$

**Hoeffding's inequality.** If independent observations satisfy \(X_i\in[a,b]\), then

$$
P(|\bar X_n-\mu|\ge\varepsilon)
\le
2\exp\!\left(
-\frac{2n\varepsilon^2}{(b-a)^2}
\right).
$$

Stronger assumptions buy a faster, exponential tail ceiling.

![Markov, Chebyshev, and Hoeffding use progressively stronger assumptions to control increasingly sharp tail regions.](../assets/concentration-assumptions.svg)

**Worked comparison.** For independent \(X_i\in[0,1]\), \(n=500\), and \(\varepsilon=0.1\), the worst-case variance is \(1/4\). Chebyshev gives

$$
\frac{1/4}{500(0.1)^2}=0.05,
$$

while Hoeffding gives

$$
2e^{-2(500)(0.1)^2}
=2e^{-10}\approx0.0000908.
$$

Neither is automatically close to the true tail probability. Choose a bound by checking its assumptions, not by selecting the smallest number after the fact.

> **Practice — Foundation:** Use Markov to bound \(P(Y\ge20)\) for nonnegative \(Y\) with mean 3.
>
> **Hint:** Markov applies because \(Y\ge0\): \(P(Y\ge20)\le E[Y]/20=3/20\).
>
> **Practice — Core:** Derive Chebyshev from Markov, then apply Hoeffding to a mean of 800 independent values in \([-1,1]\) with tolerance \(0.1\).
>
> **Hint:** Apply Markov to a squared centered deviation; Hoeffding uses the full range width.
>
> **Practice — Stretch:** For the mean of \(n\) independent values in \([0,1]\) with tolerance \(t=0.1\), compute Chebyshev's bound (using the worst-case variance \(1/4\)) and the two-sided Hoeffding bound \(2e^{-2nt^2}\), at \(n=100\) and at \(n=1000\). Explain why “asymptotically sharper” need not mean smaller for every parameter choice.
>
> **Hint:** At \(n=100\), Chebyshev gives \(0.25/(100\times0.01)=0.25\) while Hoeffding gives \(2e^{-2}\approx0.27\); at \(n=1000\) they are \(0.025\) and about \(4\times10^{-9}\).

## 12. The Chernoff method generates every exponential bound

Markov, Chebyshev, and Hoeffding look like three unrelated results. They are one method applied to three assumptions, and seeing that turns a list to memorize into a tool you can re-derive.

**The method.** For any \(\lambda>0\), the event \(X\ge t\) is identical to \(e^{\lambda X}\ge e^{\lambda t}\). Markov applied to the nonnegative variable \(e^{\lambda X}\) gives

$$
P(X\ge t)\le\frac{E\bigl[e^{\lambda X}\bigr]}{e^{\lambda t}},
\qquad\text{hence}\qquad
P(X\ge t)\le\inf_{\lambda>0}e^{-\lambda t}E\bigl[e^{\lambda X}\bigr].
$$

Everything now depends on controlling the **moment generating function** \(E[e^{\lambda X}]\). Because the MGF of a sum of independent variables factorizes, the bound multiplies across observations — which is precisely where the exponential-in-\(n\) decay comes from. Chebyshev, by contrast, uses only a second moment and can never do better than polynomial decay.

**Sub-Gaussian variables.** Say \(X\) with mean \(\mu\) is **\(\sigma\)-sub-Gaussian** when

$$
E\bigl[e^{\lambda(X-\mu)}\bigr]\le e^{\lambda^2\sigma^2/2}
\qquad\text{for all }\lambda\in\mathbb R .
$$

The definition says: the MGF is no larger than a Gaussian's. Optimizing \(\lambda\) in the Chernoff bound then yields the Gaussian-shaped tail

$$
P\bigl(|X-\mu|\ge t\bigr)\le2\exp\!\left(-\frac{t^2}{2\sigma^2}\right).
$$

**Hoeffding is now a corollary.** Hoeffding's lemma states that a variable bounded in \([a,b]\) is \(\frac{b-a}2\)-sub-Gaussian. Averaging \(n\) independent such variables divides the sub-Gaussian parameter by \(\sqrt n\), and substituting into the display above reproduces exactly the inequality of the previous section. Bounded implies sub-Gaussian; the reverse is false, since a Gaussian is unbounded.

**Bernstein: paying attention to the variance.** Hoeffding uses only the range, so it is wasteful whenever the variance is much smaller than the range — the common case for rare events. Bernstein's inequality, for independent observations with variance \(\sigma^2\) and \(|X_i-\mu|\le b\), gives

$$
P\bigl(|\bar X_n-\mu|\ge t\bigr)
\le2\exp\!\left(-\frac{nt^2}{2\sigma^2+\tfrac23bt}\right).
$$

For small \(t\) the denominator is dominated by \(2\sigma^2\) and the bound is **Gaussian-like in the true variance**; for large \(t\) the \(bt\) term takes over and the decay becomes exponential rather than Gaussian.

**Worked comparison — a rare event.** Let \(X_i\in[0,1]\) with true rate \(p=0.01\), so \(\sigma^2=p(1-p)=0.0099\). Take \(n=10{,}000\) and \(t=0.005\).

- *Hoeffding:* \(2\exp(-2\times10^4\times2.5\times10^{-5})=2e^{-0.5}\approx1.21\), a vacuous bound.
- *Bernstein:* denominator \(=2(0.0099)+\tfrac23(1)(0.005)=0.0198+0.00333=0.0231\), numerator \(=10^4\times2.5\times10^{-5}=0.25\), giving \(2\exp(-10.8)\approx4.1\times10^{-5}\).

Hoeffding says nothing at all; Bernstein gives four decimal places of confidence. **When the variance is far below the squared range, always use a variance-aware bound.** This is the routine situation for click rates, error rates, and any evaluation metric measured on a rare failure mode.

**Sub-exponential variables.** Squares of Gaussians — and therefore \(\chi^2\) variables, squared norms, and empirical variances — are not sub-Gaussian: their MGF is finite only for \(\lambda\) in a bounded interval. They are **sub-exponential**, and the resulting two-regime tail

$$
P\bigl(|\bar X_n-\mu|\ge t\bigr)\le2\exp\bigl(-cn\min(t,t^2)\bigr)
$$

is Gaussian for small deviations and exponential for large ones. This is the bound used for squared-norm concentration in [high-dimensional probability](12-high-dimensional-probability.md).

**McDiarmid: beyond averages.** Everything above concerns sums. Many quantities of interest — the maximum, a quantile, a cross-validation estimate, the accuracy of a model fitted to the sample — are not sums. The **bounded-differences inequality** covers them. If \(f(x_1,\ldots,x_n)\) changes by at most \(c_i\) when coordinate \(i\) alone is changed, then for independent inputs

$$
P\bigl(|f-E[f]|\ge t\bigr)\le2\exp\!\left(-\frac{2t^2}{\sum_ic_i^2}\right).
$$

Taking \(f=\bar X_n\) with \(c_i=(b-a)/n\) recovers Hoeffding, so this is a strict generalization. Its real use is elsewhere: a held-out accuracy computed on \(n\) independent examples changes by at most \(1/n\) when one example changes, so it concentrates at the same rate as a mean even though the model was fitted. This is the standard entry point to generalization bounds — see [entropy, generalization, and decisions](../06-information-learning-decision/01-entropy-generalization-decisions.md).

**The honest caveat.** Every bound here assumes independence, and independence is the assumption most often false in ML evaluation. With clustered or sequential data the effective sample size is smaller than \(n\), and all of these inequalities become optimistic by exactly that factor — the subject of the next sections.

> **Practice — Foundation:** Derive the Chernoff form \(P(X\ge t)\le e^{-\lambda t}E[e^{\lambda X}]\) from Markov's inequality in two lines.
>
> **Hint:** Apply Markov to exp(lambda X), with lambda positive.
>
> **Practice — Core:** Optimize \(\lambda\) for a \(\sigma\)-sub-Gaussian variable and confirm the \(\exp(-t^2/2\sigma^2)\) tail. Then redo the worked rare-event comparison at \(p=0.001\) and report both bounds.
>
> **Hint:** Minimize \(-\lambda t+\lambda^2\sigma^2/2\) at \(\lambda=t/\sigma^2\). For the rerun, \(\sigma^2=0.001\times0.999\) and the Bernstein denominator is \(2\sigma^2+\tfrac23(1)(0.005)\approx0.00533\), while Hoeffding stays at \(2e^{-0.5}\).
>
> **Practice — Stretch:** A leave-one-out error with 0-1 loss is computed on \(n=10{,}000\) independent examples. Under a stability assumption that replacing one example changes at most \(k=5\) other leave-one-out predictions, take \(c_i=(k+1)/n\). Apply McDiarmid for \(t=0.05\) and \(t=0.1\), then redo it for \(k=100\). Explain which assumption is doing the work and how it could fail for a high-capacity model.
>
> **Hint:** \(\sum_ic_i^2=n(k+1)^2/n^2=(k+1)^2/n\), and the bound is \(2\exp(-2t^2/\sum_ic_i^2)\). At \(k=5\) this gives about \(0.50\) and \(0.0077\); at \(k=100\) the bound is vacuous.

## 13. Heavy tails and robust summaries

A heavy-tailed distribution places non-negligible probability far from its center. The practical issue is not merely that outliers look dramatic: the moments required by familiar guarantees may not exist.

For a Pareto-type tail with parameter \(\alpha\):

- when \(\alpha\le1\), the mean is infinite;
- when \(1<\alpha\le2\), the mean exists but variance is infinite;
- when \(\alpha>2\), both mean and variance exist, though convergence can still be slow when \(\alpha\) is near 2.

If variance is infinite, the ordinary variance calculation for \(\bar X_n\), the \(s/\sqrt n\) standard error, Chebyshev's inequality, and the ordinary finite-variance CLT are not justified.

**Worked example — one observation dominates.** The nine values

$$
2,3,3,4,4,4,5,5,970
$$

have mean \(111.1\) but median \(4\). Neither summary is universally “correct”: the mean answers total divided by count and is appropriate for some cost targets, while the median describes a typical observation. The point is to choose a target and an estimator whose sensitivity matches the decision.

Robust options include:

- median or quantiles when the target is typical behavior;
- trimmed or winsorized means when a bounded influence rule is scientifically defensible;
- median-of-means: split observations into groups, average within each group, then take the median of group means;
- an explicit heavy-tailed model when tail behavior itself is the target.

Never delete extreme observations solely because they are inconvenient. First distinguish data errors, rare valid events, and a misspecified model.

> **Practice — Foundation:** For the dataset \((3,5,6,8,9)\), compute the mean and median, then add the extreme value 100 and recompute both.
>
> **Hint:** The mean moves from \(6.2\) to \(131/6\approx21.8\), while the median moves only from 6 to the average of the two middle values, \(7\).
>
> **Practice — Core:** Take the 100 values \(x_i=i\) for \(i=1,\dots,99\) and a corrupted \(x_{100}=10{,}000\), split in order into ten consecutive groups of ten. Compute the ordinary mean and the median-of-means, and compare them with the clean mean 50.5. Then explain how using 2 or 50 groups would trade robustness against the stability of each group mean.
>
> **Hint:** The group means are \(5.5,15.5,\dots,85.5\) and \((855+10000)/10=1085.5\); the median of these ten is the average of the 5th and 6th values. The ordinary mean is \(14950/100\).
>
> **Practice — Stretch:** A service's cost per request is 1 dollar with probability 0.99 and 500 dollars with probability 0.01. Compute the mean, the median and the 99.9th percentile. Which one should set a monthly budget for \(10^6\) requests, and which one a guarantee that 999 of every 1,000 requests stay below a threshold?
>
> **Hint:** The mean is \(0.99+5=5.99\), the median is 1, and the 99.9th percentile is 500. Total cost is \(n\) times the mean, so the budget needs the mean; the guarantee is a quantile target.

## 14. Dependence changes the effective sample size

For observations with common variance \(\sigma^2\) but possible dependence,

$$
\operatorname{Var}(\bar X_n)
=\frac1{n^2}
\left[
n\sigma^2
+2\sum_{i<j}\operatorname{Cov}(X_i,X_j)
\right].
$$

Positive covariance inflates uncertainty. Negative covariance can reduce it. The iid formula silently discards every covariance term.

For a weakly stationary sequence with lag-\(k\) autocorrelation \(\rho_k\), a large-\(n\) approximation is

$$
\operatorname{Var}(\bar X_n)
\approx
\frac{\sigma^2}{n}
\left(1+2\sum_{k=1}^{\infty}\rho_k\right).
$$

Define an approximate effective sample size

$$
n_{\text{eff}}
\approx
\frac{n}{1+2\sum_{k\ge1}\rho_k}.
$$

It is the iid sample size that would give roughly the same mean variance. It is a summary under assumptions, not a count of magically independent rows.

![Twenty-four weakly dependent observations carry more independent information than twenty-four observations arranged in a few repeated blocks.](../assets/dependence-effective-sample.svg)

**Worked example — persistent sequence.** If correlations resemble \(\rho_k=\rho^k\) with \(\rho=0.8\), then

$$
1+2\sum_{k\ge1}\rho^k
=1+\frac{2\rho}{1-\rho}
=9.
$$

Thus \(n_{\text{eff}}\approx n/9\). Nine thousand sequential measurements may provide uncertainty similar to only about one thousand iid measurements.

For clustered data, resample or aggregate at the independent unit: user, conversation, task, document, environment, or training run. For time series and Markov-chain output, methods include autocorrelation-aware estimators and **batch means**: divide a sufficiently long sequence into contiguous batches, average within each, and estimate uncertainty from variation among batch averages.

> **Practice — Foundation:** Identify the likely independent unit for tokens within responses, responses within users, and seeds within one training configuration.
>
> **Hint:** Group observations by the randomness shared between them.
>
> **Practice — Core:** Derive the variance of the mean of \(n\) variables with variance \(\sigma^2\) when every distinct pair has covariance \(c\). Evaluate it for \(\sigma^2=1\), \(c=0.05\) at \(n=10\) and \(n=100\), and describe what happens as \(n\to\infty\) with \(c>0\) fixed.
>
> **Hint:** There are \(n\) diagonal terms and \(n(n-1)\) off-diagonal terms, so \(\operatorname{Var}\bar X=\sigma^2/n+(n-1)c/n\), which tends to \(c\), not 0.
>
> **Practice — Stretch:** With NumPy `default_rng(0)`, simulate an AR(1) sequence \(x_t=0.8x_{t-1}+\varepsilon_t\), \(\varepsilon_t\sim N(0,1)\), of length \(n=10{,}000\), starting from the stationary law. Compare the iid standard error of the mean, \(s/\sqrt n\), with batch-means estimates using batch lengths 10, 100 and 1,000, and with the true long-run value \(\sqrt{25/n}=0.05\).
>
> **Hint:** The iid SE ignores autocorrelation and comes out near \(0.017\). Batches of length 10 are still correlated and come out low (about \(0.04\)); lengths 100 and 1,000 are near \(0.05\), but only 10 batches makes the estimate itself noisy.

## 15. Research and ML evaluation patterns

Repeated-sample reasoning appears throughout AI work:

- **Benchmark accuracy:** rows may share templates, authors, tasks, or contamination sources.
- **LLM judging:** repeated judge calls share prompts and model biases; judge randomness is only one uncertainty source.
- **Training curves:** adjacent checkpoints and minibatches are strongly dependent.
- **Multiple seeds:** seeds sample optimization randomness but not necessarily datasets, architectures, or research choices.
- **Agent rollouts:** turns within an episode share state; episode-level outcomes are often the safer unit.
- **Token losses:** millions of tokens can come from a small number of documents, so token count overstates independent information.
- **A/B evaluation:** paired prompts make the within-prompt difference the natural estimator and can remove prompt difficulty variation.
- **Simulation:** Monte Carlo precision does not validate the simulator, reward, policy, or deployment distribution.

**Worked example — paired model comparison.** On prompt \(i\), let \(A_i,B_i\in\{0,1\}\) be correctness for two models and define \(D_i=A_i-B_i\). Estimate the performance difference by \(\bar D\). Its variance is

$$
\operatorname{Var}(D_i)
=\operatorname{Var}(A_i)+\operatorname{Var}(B_i)
-2\operatorname{Cov}(A_i,B_i).
$$

If both models tend to succeed on easy prompts and fail on hard ones, covariance is positive, so pairing reduces variance relative to two independent prompt sets. The independent unit still may be a task family rather than an individual prompt.

Before attaching an error bar, answer:

1. What randomness is the probability statement over?
2. What is the target population or simulator?
3. Which units are plausibly independent?
4. Is the estimator's variance finite and stable?
5. Were stopping, filtering, or model selection decisions data-dependent?

> **Practice — Foundation:** For three examples above—benchmark accuracy on 2,000 rows drawn from 40 templates, a result averaged over 5 training seeds, and 300 agent episodes of 20 turns each—name the estimator, the target, and the plausible independent unit.
>
> **Hint:** Ask what would be drawn again in a repetition: the templates (40 units), the seeds (5 units), and the episodes (300 units, not 6,000 turns).
>
> **Practice — Core:** An evaluation has 5,000 prompts nested in 100 tasks of 50 prompts each. Overall accuracy is 0.70, and the 100 task-level accuracies have sample SD 0.15. Compute the naive row-iid standard error, the task-level standard error, and their design effect, then describe how to compare two models with task-level pairing.
>
> **Hint:** The naive SE is \(\sqrt{0.7\times0.3/5000}\approx0.0065\) and the task-level SE is \(0.15/\sqrt{100}=0.015\); the design effect is the squared ratio, about 5.4. For two models, average the per-task differences.
>
> **Practice — Stretch:** The best of 20 seeds scores 0.742 on a 2,000-example eval set; across seeds the scores have mean 0.720 and SD 0.010. Write an uncertainty audit that puts a number on within-seed evaluation noise, seed variation and the selection bias of taking the maximum, and states what remains unknown about transfer to a new dataset.
>
> **Hint:** The eval-set SE is \(\sqrt{0.74\times0.26/2000}\approx0.0098\). The expected maximum of 20 iid normals is about \(\mu+1.87\sigma=0.739\), so most of the gap to 0.720 is selection.

## 16. Runnable lab: batch-means standard error

Implement **batch_means_standard_error** in [labs/exercises.py](../../labs/exercises.py). Given a finite numeric sequence and a positive batch size that divides its length into at least two batches, return:

1. the overall sample mean;
2. the standard error estimated from the sample variance of contiguous batch means.

Run:

~~~text
python -m labs.checks monte-carlo
~~~

The checks cover batch size one, constant data, translation and scale behavior, large offsets, input preservation, and invalid batch layouts.

### Guided experiment

Generate three sequences with the same marginal mean and variance:

1. iid Gaussian observations;
2. a positively autocorrelated sequence;
3. a sequence formed by repeating every iid draw several times.

For several batch sizes, compare the naive iid standard error with the batch-means estimate. Repeat the entire experiment to learn which batch sizes are too short to absorb dependence and which leave too few batches for stable variance estimation.

## 17. Derivations to own

1. Derive the mean and variance of an iid sample mean.
2. Prove the finite-variance weak law using Chebyshev.
3. Convert the standardized CLT into approximations for a mean and a sum.
4. Derive the Bernoulli mean standard error.
5. Derive Monte Carlo variance for a transformed variable and for an indicator.
6. Prove Markov's inequality and derive Chebyshev from it.
7. Compare the \(1/n\) Chebyshev ceiling with exponential Hoeffding decay.
8. Expand the variance of a dependent sample mean into covariance terms.
9. Derive the effective-sample-size expression from autocorrelations.
10. Derive the variance of a paired estimator and state when pairing helps.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-limits
```

## 18. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–4. Read sampling distributions and execute direct variance and approximation calculations.

**A1 · Foundation · paper — Average mechanics.** Let iid observations have mean 12 and variance 25. Find the mean, variance, and standard error of \(\bar X_{100}\). Recompute for \(\bar X_{400}\).

**A2 · Foundation · paper — Convergence language.** For iid fair-coin flips with running proportion \(\hat p_n\), translate the weak law and the strong law into plain language. Then show that neither law guarantees \(|\hat p_{1000}-0.5|\le0.01\) by computing the CLT approximation, with continuity correction, to \(P(490\le S_{1000}\le510)\).

**A3 · Foundation · paper — Bernoulli sampling.** For \(p=0.4,n=250\), compute the mean and standard deviation of the success count and the sample proportion.

**A4 · Foundation · paper — Markov and Chebyshev.** If \(Y\ge0\) and \(E[Y]=10\), bound \(P(Y\ge25)\) with Markov's inequality. If \(E[Z]=0\) and \(\operatorname{Var}(Z)=9\), bound \(P(|Z|\ge6)\) with Chebyshev's inequality. State why neither calculation identifies the true probability.

### Core — problems 5–9. Combine theorems, choose approximations, and quantify Monte Carlo error.

**A5 · Core · paper — Weak-law proof.** Prove convergence in probability for independent variables sharing mean \(\mu\) whose variances are all at most \(V\).

**A6 · Core · paper — Continuity correction.** Approximate \(P(S\ge65)\) for \(S\sim\operatorname{Binomial}(100,0.5)\) with and without a continuity correction; compare with an exact computation.

**A7 · Core · paper — Monte Carlo planning.** Derive a conservative draw count for estimating any Bernoulli probability with approximate 95% half-width at most \(0.002\).

**A8 · Core · paper — Concentration choice.** For \(n=500\) independent losses in \([0,4]\), bound \(P(|\bar X-E[X]|\ge0.3)\) using (a) Chebyshev with the largest variance permitted by the range and (b) two-sided Hoeffding. List the assumptions used by each.

**A9 · Core · paper — Paired evaluation.** On eight prompts, model A correctness is \((1,1,0,1,0,1,1,0)\) and B correctness is \((1,0,0,1,1,0,1,0)\). Compute the paired mean difference and standard error. Then compute the standard error obtained by incorrectly treating the two accuracy estimates as independent.

### Stretch — problems 10–14. Audit broken assumptions and design defensible repeated-sample evidence.

**A10 · Stretch · paper — Rare events.** Requests fail independently with probability \(p=0.002\), and \(n=1000\) requests are observed. Compute \(P(S\ge5)\) exactly (binomial), with the Poisson\((2)\) approximation, with the continuity-corrected Gaussian approximation, and bound it with one-sided Hoeffding and Bernstein applied to \(\bar X\ge0.005\). Explain which numbers are approximations, exact probabilities, or guaranteed ceilings.

**A11 · Stretch · paper — Heavy tails.** With NumPy `default_rng(0)`, simulate 500 datasets of size \(n=100,1000,10000\) from a Pareto distribution with \(x_m=1\), \(\alpha=1.5\) (mean 3, infinite variance). For each \(n\), report the 5th, 50th and 95th percentiles across datasets of the sample mean, the 10% trimmed mean (trimming each tail), the median, and median-of-means with 10 groups, and state which population quantity each estimator targets.

**A12 · Stretch · paper — Dependence.** With NumPy `default_rng(0)`, generate 2,000 stationary AR(1) sequences \(x_t=\phi x_{t-1}+\varepsilon_t\), \(\varepsilon_t\sim N(0,1)\), of length \(n=1000\) for each \(\phi\in\{0,0.5,0.9\}\). For each \(\phi\), compare the empirical variance of the 2,000 sequence means with the average iid prediction \(s^2/n\), the average batch-means prediction (20 batches of 50), and the theoretical long-run value \(1/((1-\phi)^2n)\).

**A13 · Stretch · paper — Hierarchical benchmark.** A benchmark has 4 domains × 10 tasks per domain × 20 prompts per task, and each prompt is run 3 times. A variance-components fit gives domain variance 0.004, task variance 0.01, prompt variance 0.04 and run-noise variance 0.02 for the per-run score. Write the grand-mean estimator, and compute its standard error when generalizing to (a) new domains, (b) new tasks in these domains, (c) new prompts in these tasks, and (d) new runs on these prompts only. State the population each conclusion covers.

**A14 · Stretch · paper — Research critique.** A paper reports token-level accuracy \(0.832\) over \(2{,}000{,}000\) tokens with the row-iid standard error \(\sqrt{0.832\cdot0.168/n}\), but the tokens come from only 50 documents whose per-document accuracies have standard deviation 0.06. Compute the naive and document-level standard errors, the design effect and the effective sample size, and rewrite the claim conservatively.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** What does the central limit theorem approximate?

**K2 · Core · gate — Derivation.** Derive the variance of the average of n identically distributed variables with variance v and common pairwise correlation rho.

**K3 · Core · gate — Calculation.** For 100 independent Bernoulli(0.5) observations, find the standard error of the mean.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-limits experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does multiplying a correlated dataset’s row count by ten necessarily reduce its standard error by sqrt(10)?

**K6 · Stretch · gate — RE/RS transfer.** Compare two Monte Carlo estimators for a fixed compute budget.

## Mastery check

Given a repeated-sampling problem, identify the target, estimator, and independent unit; derive the estimator's mean and variance; state whether an LLN, CLT, or concentration result applies; quantify Monte Carlo error; and diagnose heavy-tail, dependence, stopping, or selection failures. Validate at least one analytic prediction with repeated simulation rather than one long run.

Next: [estimation, likelihood, Fisher information, and asymptotics](06-estimation-likelihood-fisher.md).
