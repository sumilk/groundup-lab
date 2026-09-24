---
id: math.probability.random-variables-distributions
title: Random variables, distributions, moments, and simulation
prerequisites: [math.probability.foundations, math.calculus.gradients-optimization]
answers: ps-01-random-variables-distributions
estimated_hours: 32
---

# Random variables, distributions, moments, and simulation

A probability space describes uncertainty over outcomes. A **random variable** extracts a numerical or categorical quantity from those outcomes. Its **distribution** records how probability is allocated across its possible values.

This separation matters in machine learning. A token ID, class label, reward, logit, latency, and model score are different functions of an underlying experiment. They can be defined on the same data-generating process while having very different distributions.

By the end of this unit, you should be able to move between a random variable, its PMF or density, its CDF, expectations, moments, and samples; derive the main properties of common distribution families; choose a plausible family from a data-generating story; and implement reproducible categorical sampling without a library sampler.

## 0. Begin with the experiment

Review [probability foundations](00-probability-foundations.md) if you cannot yet construct a finite sample space, condition on an event, or distinguish independence from disjointness. This unit also uses finite sums, elementary algebra, derivatives, and one-dimensional integrals. The calculus ideas are reviewed when first needed.

The order of construction is:

$$
\text{experiment}
\longrightarrow
(\Omega,P)
\longrightarrow
X(\omega)
\longrightarrow
\text{distribution of }X.
$$

A named distribution is not a substitute for a data-generating story. Start with what is repeated, what is held fixed, what can depend on what, and what quantity is recorded.

> **Practice — Foundation:** For one die roll, separate the outcome, the event “even,” and the observed value “number of dots.” Which object is a set?
>
> **Hint:** An event is a subset; an observed value is the output of a measurement.
>
> **Practice — Core:** An evaluation picks prompt 1 or prompt 2 with probability \(1/2\) each. For prompt 1 the response length is 20 or 40 tokens with probability \(1/2\) each; for prompt 2 it is always 100 tokens. Write the sample space as (prompt, length) outcomes with their masses, define the measurement \(L\), and compute \(P(L\ge40)\).
>
> **Hint:** Multiply the prompt-selection probability by the generation probability for each outcome; the three outcomes have masses 1/4, 1/4, 1/2.
>
> **Practice — Stretch:** Experiment 1 flips a fair coin and sets \(B=1\) on heads. Experiment 2 draws \(U\sim\text{Uniform}(0,1)\) and sets \(B=\mathbf 1\{U<0.5\}\). Show that both give \(B\sim\text{Bernoulli}(1/2)\), then compute \(P(U<0.1\mid B=1)\) and explain why no analogous question exists for the coin.
>
> **Hint:** Given B = 1, U is uniform on (0, 0.5), so the conditional probability is 0.1/0.5; the coin's sample space has nothing finer than heads and tails.

## 1. A random variable is a function

A random variable \(X\) maps each outcome to a value:

$$
X:\Omega\to\mathcal X.
$$

The codomain \(\mathcal X\) may be numerical, categorical, vector-valued, or structured. The traditional name “random variable” does not mean the function itself changes. Once \(\omega\) is known, \(X(\omega)\) is fixed; uncertainty about the outcome induces uncertainty about the value.

**Example — one request, several variables.** For one model-serving request, the outcome might contain the prompt, sampled tokens, hardware state, and timing information. From that outcome define:

- \(T\): number of generated tokens;
- \(L\): latency in milliseconds;
- \(Y\): whether a safety filter fired;
- \(C\): the final stop-reason category.

These variables share an experiment and can be dependent. Treating rows in a table as unrelated just because the columns have different names would discard that structure.

### Preimages define events

Statements about a random variable are events in \(\Omega\):

$$
\{X\le x\}=\{\omega\in\Omega:X(\omega)\le x\}.
$$

Thus \(P(X\le x)\) is shorthand for the probability of a set of outcomes. This is the bridge from the event language of Unit 1 to distributions.

> **Practice — Foundation:** On two coin tosses, define \(X\) as the number of heads. Write the function from all four outcomes to numbers.
>
> **Hint:** Map each ordered outcome to its head count before combining masses.
>
> **Practice — Core:** On one fair die roll \(\omega\), let \(X=\mathbf 1\{\omega\text{ is even}\}\) and \(Y=\mathbf 1\{\omega=6\}\). Show that both have support \(\{0,1\}\) and derive both PMFs.
>
> **Hint:** Count the outcomes each map sends to 1: three for X and one for Y.
>
> **Practice — Stretch:** Let \(X\) be the number of dots on a fair die. Explain why “what is the probability that \(X\) happened?” is a type error, then answer two corrected questions: \(P(X\ge5)\), and the realized value of \(X\) when the outcome is \(\omega=4\).
>
> **Hint:** X is a function, not an event; the event {X ≥ 5} = {5, 6} has probability 1/3, and the realized value is X(4) = 4.

## 2. Discrete distributions: PMFs and support

A random variable is **discrete** when its possible values form a finite or countable set. Its probability mass function is

$$
p_X(x)=P(X=x).
$$

It satisfies

$$
p_X(x)\ge0,
\qquad
\sum_xp_X(x)=1.
$$

The **support** is the set of values with positive mass. If \(X\) counts heads in three fair independent flips, then

$$
p_X(0)=\frac18,\quad
p_X(1)=\frac38,\quad
p_X(2)=\frac38,\quad
p_X(3)=\frac18.
$$

To find the probability of a set \(A\) of values, add its masses:

$$
P(X\in A)=\sum_{x\in A}p_X(x).
$$

The notation \(p_X(x)\) describes a probability distribution. A model output such as \(0.8\) is not automatically a calibrated probability merely because it lies between zero and one.

![A discrete PMF and the CDF obtained by accumulating the same probability masses.](../assets/pmf-cdf.svg)

**Worked example — read the PMF and CDF together.** For the three-flip head count, \(P(X\le1)=p_X(0)+p_X(1)=1/8+3/8=1/2\). On the CDF this is the height immediately after the jump at one. Meanwhile \(P(1<X\le3)=F_X(3)-F_X(1)=1-1/2=1/2\). The PMF answers “how much mass is exactly here?”; the CDF answers “how much mass has accumulated up to here?”

> **Practice — Foundation:** Check whether \(p(0)=0.1,p(1)=0.3,p(2)=0.6\) is a valid PMF and compute \(P(X\ge1)\).
>
> **Hint:** Check nonnegativity and sum one, then add the requested cells.
>
> **Practice — Core:** A token sampler returns ranks 1, 2, and 3 with probabilities proportional to 6, 3, and 1. Normalize the weights and compute the expected rank.
>
> **Hint:** Divide by the sum of weights before taking a weighted rank average.
>
> **Practice — Stretch:** On support \(\{0,5,10\}\), let PMF A be \((0.1,0.8,0.1)\) and PMF B be \((0.45,0.1,0.45)\). Verify that both have mean 5, compute \(P(|X-5|\ge5)\) under each, and explain why the mean alone misses the difference.
>
> **Hint:** Both PMFs are symmetric about 5, so the mean is 5; the tail event is {0, 10}, with probability 0.2 under A and 0.9 under B.

## 3. CDFs unify discrete and continuous variables

The cumulative distribution function is

$$
F_X(x)=P(X\le x).
$$

Every CDF has four properties:

1. \(F_X\) is nondecreasing.
2. \(0\le F_X(x)\le1\).
3. \(F_X(x)\to0\) as \(x\to-\infty\), and \(F_X(x)\to1\) as \(x\to\infty\).
4. \(F_X\) is right-continuous.

For any \(a<b\),

$$
P(a<X\le b)=F_X(b)-F_X(a).
$$

For a discrete variable, the CDF is a step function and the jump at \(x\) equals \(p_X(x)\):

$$
p_X(x)=F_X(x)-F_X(x^-).
$$

### Quantiles

For \(0<q<1\), define a \(q\)-quantile by

$$
Q(q)=\inf\{x:F_X(x)\ge q\}.
$$

This definition works even when a flat region or jump prevents solving \(F_X(x)=q\) exactly. The median is a 0.5-quantile. Quantiles are often more informative than means for skewed latency, loss, or response-length distributions.

> **Practice — Foundation:** For \(P(X=1)=0.2\), \(P(X=2)=0.5\), \(P(X=4)=0.3\), compute \(F_X(0.5)\), \(F_X(1)\), \(F_X(3)\), and \(F_X(4)\).
>
> **Hint:** Add the masses at support points less than or equal to the argument; F(1) includes the jump at 1, and F(3) = F(2) because there is no mass at 3.
>
> **Practice — Core:** A CDF equals \(0\) for \(x<0\), \(0.25\) on \([0,1)\), \(0.5\) on \([1,3)\), \(0.9\) on \([3,5)\), and \(1\) for \(x\ge5\). Recover \(P(1<X\le5)\), \(P(X=3)\), and the median set.
>
> **Hint:** Use F(5) − F(1) for the interval and the jump size at 3 for the point mass; a median m needs F(m) ≥ 0.5 and P(X ≥ m) ≥ 0.5, which holds on the whole interval [1, 3].
>
> **Practice — Stretch:** Write `check_cdf(xs, Fs)` that reports monotonicity and range violations for tabulated CDF values. Test it on `xs=[0,1,2,3]` with `Fs=[0.1,0.4,0.35,1.0]` and with `Fs=[0,0.5,1.2,1.0]`, then give a function that passes on this grid but is not a valid CDF between the grid points.
>
> **Hint:** The first table decreases from 0.4 to 0.35 at index 2 and the second exceeds 1 at index 2; a function can pass at the integers yet dip between them, for example dropping to 0 on (1.4, 1.6).

## 4. Continuous distributions: density is not probability

A continuous random variable may have a probability density function \(f_X\) satisfying

$$
f_X(x)\ge0,
\qquad
\int_{-\infty}^{\infty}f_X(x)\,dx=1.
$$

Interval probabilities are areas:

$$
P(a<X\le b)=\int_a^bf_X(x)\,dx.
$$

The CDF is

$$
F_X(x)=\int_{-\infty}^xf_X(t)\,dt,
$$

and where the CDF is differentiable, \(f_X(x)=F_X'(x)\).

For a genuinely continuous distribution,

$$
P(X=x)=0
$$

for every single point. Therefore \(f_X(x)\) is not \(P(X=x)\). A density may exceed one: the uniform density on \([0,0.1]\) equals ten, while the total area remains one. Density also has inverse units. If \(X\) is measured in seconds, \(f_X(x)\) has units of inverse seconds.

Not every distribution is purely discrete or purely continuous. A generation process may stop immediately with positive probability and otherwise have a continuous latency. Such a mixed distribution has a point mass plus a density; forcing it into only one category loses information.

![The probability of a continuous interval is area under the density; a point has zero width and zero probability.](../assets/density-area.svg)

<details><summary>Checkpoint: can a density equal 5?</summary>

Yes. If \(X\sim\operatorname{Uniform}(0,0.2)\), then \(f_X(x)=5\) inside the interval. But \(P(X=0.1)=0\), while \(P(0.08<X<0.12)=5(0.04)=0.2\). Density height, point probability, and interval probability are different quantities.

</details>

> **Practice — Foundation:** For density \(f(x)=2x\) on \([0,1]\), verify normalization and compute \(P(X>1/2)\).
>
> **Hint:** Integrate 2x over the full interval, then over the requested tail.
>
> **Practice — Core:** Let \(X\sim\text{Uniform}(0,0.25)\). Write its density, note where it exceeds one, and show that \(P(a<X<b)\le1\) for every interval \((a,b)\).
>
> **Hint:** The height is 1/0.25 = 4, and an interval's probability is 4 times the length of its overlap with (0, 0.25), which is at most 0.25.
>
> **Practice — Stretch:** Python's `random.random()` returns multiples of \(2^{-53}\) in \([0,1)\), each with equal probability. Compare \(P(U=0.5)\) for an ideal \(U\sim\text{Uniform}(0,1)\) with the probability that the machine sampler returns exactly 0.5.
>
> **Hint:** The ideal continuous law gives any single point probability 0; the machine sampler has \(2^{53}\) equally likely outputs, so 0.5 has probability \(2^{-53}\approx1.1\times10^{-16}\).

## 5. Expectation is an average under a distribution

For a discrete \(X\),

$$
E[X]=\sum_xx\,p_X(x).
$$

For a continuous \(X\) with density,

$$
E[X]=\int_{-\infty}^{\infty}x f_X(x)\,dx.
$$

An expectation exists when the relevant absolute sum or integral is finite. A distribution can be valid while its mean or variance is infinite. Do not manipulate a moment before checking that it exists.

### LOTUS: transform values, not necessarily distributions

For a function \(g\), the law of the unconscious statistician gives

$$
E[g(X)]=
\begin{cases}
\sum_x g(x)p_X(x),&X\text{ discrete},\\[4pt]
\int g(x)f_X(x)\,dx,&X\text{ continuous}.
\end{cases}
$$

You do not need to derive the full distribution of \(g(X)\) merely to compute its expectation.

Linearity follows directly:

$$
E[aX+b]=aE[X]+b.
$$

More generally, \(E[\sum_i a_iX_i]=\sum_i a_iE[X_i]\) whether or not the \(X_i\) are independent.

> **Practice — Foundation:** Compute \(E[X]\) for a fair die and explain why the answer need not be a possible outcome.
>
> **Hint:** Average the six values with equal weights.
>
> **Practice — Core:** For \(X\sim\text{Bernoulli}(p)\), derive \(E[3X-2]\) two ways: from its distribution and from linearity.
>
> **Hint:** Map zero and one through the affine function, then compare with linearity.
>
> **Practice — Stretch:** Option A always loses 10. Option B loses 0 with probability \(0.99\) and 1,000 with probability \(0.01\). Verify that both expected losses are 10, then compute each standard deviation and \(P(\text{loss}>100)\).
>
> **Hint:** For B, E[L²] = 0.01·1,000,000 = 10,000, so Var = 10,000 − 100; the tail probability is 0 for A and 0.01 for B.

## 6. Moments summarize location and spread

The \(k\)-th raw moment is \(E[X^k]\). The mean is \(\mu=E[X]\). The variance is the second central moment:

$$
\operatorname{Var}(X)=E[(X-\mu)^2].
$$

Expanding the square gives the computational identity

$$
\operatorname{Var}(X)=E[X^2]-E[X]^2.
$$

This identity is algebraically correct but can be numerically unstable when the two terms are large and nearly equal. Use a centered two-pass calculation or Welford's recurrence from [numerical stability](../00-foundations/01-numerical-stability.md) for data.

The standard deviation

$$
\operatorname{SD}(X)=\sqrt{\operatorname{Var}(X)}
$$

has the same units as \(X\). Variance has squared units.

For an affine transformation \(Y=aX+b\),

$$
E[Y]=aE[X]+b,
\qquad
\operatorname{Var}(Y)=a^2\operatorname{Var}(X).
$$

Adding \(b\) moves every value without changing spread; multiplying by \(a\) scales deviations by \(|a|\).

Higher moments describe additional shape but can be fragile under heavy tails. A mean and variance do not uniquely determine a distribution except within special families such as the Gaussian.

> **Practice — Foundation:** For \(P(X=-1)=P(X=1)=1/2\), compute the first two raw moments, variance, and standard deviation.
>
> **Hint:** The sign changes the first moment, but not the square.
>
> **Practice — Core:** Prove \(\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)\) from the definition, carefully tracking the shifted mean.
>
> **Hint:** Subtract the transformed mean before squaring; the additive shift cancels.
>
> **Practice — Stretch:** Let \(X_n=\pm n\) with probability \(1/2\) each. Compute \(E[X_n]\), \(\operatorname{Var}(X_n)\), and \(P(|X_n|\ge10)\) for \(n=1,10,100\), and explain what changes in the tails.
>
> **Hint:** The symmetric values keep the mean at 0 while \(E[X_n^2]=n^2\); the tail event has probability 0 for n = 1 and 1 for n = 10 and 100.

## 7. Bernoulli and categorical variables

### Bernoulli

A Bernoulli random variable records one binary trial:

$$
X\sim\operatorname{Bernoulli}(p),
\qquad
P(X=1)=p,\quad P(X=0)=1-p.
$$

Because \(X^2=X\),

$$
E[X]=p,
\qquad
\operatorname{Var}(X)=p-p^2=p(1-p).
$$

Any event indicator is Bernoulli. This makes Bernoulli variables the basic building blocks for counts and empirical proportions.

### Categorical

A categorical variable chooses one of \(K\) classes:

$$
P(X=k)=p_k,
\qquad
p_k\ge0,\quad\sum_{k=1}^Kp_k=1.
$$

If class \(k\) is encoded by the one-hot vector \(e_k\), then

$$
E[e_X]=(p_1,\ldots,p_K)^T.
$$

Class numbers such as 1, 2, and 3 are labels, not quantities. Their numerical mean changes if labels are permuted; the one-hot representation preserves the categorical meaning.

In a language model, softmax converts logits \(z_k\) into categorical probabilities

$$
p_k=\frac{e^{z_k}}{\sum_je^{z_j}}.
$$

Adding the same constant to every logit leaves the distribution unchanged. Numerically, subtract \(\max_jz_j\) before exponentiating.

> **Practice — Foundation:** Encode a correctness outcome as Bernoulli and compute its mean and variance when accuracy is \(0.8\).
>
> **Hint:** For a Bernoulli variable, X² equals X.
>
> **Practice — Core:** Normalize categorical weights \((2,5,3)\), sample conceptually with a uniform number, and show which cumulative interval maps to each label.
>
> **Hint:** Cumulative intervals must cover [0,1) without overlaps or gaps.
>
> **Practice — Stretch:** A model outputs “Paris” with probability 0.5, “paris” with 0.3, and “Lyon” with 0.2, where the first two are the same semantic answer. Compute the label entropy in bits, then the semantic-answer probability of Paris and the entropy after merging synonyms.
>
> **Hint:** Label entropy uses (0.5, 0.3, 0.2) and is about 1.485 bits; merge synonyms first to get (0.8, 0.2), with probability 0.8 for Paris and entropy about 0.722 bits.

## 8. Binomial, geometric, and Poisson counts

### Binomial: successes in a fixed number of trials

Let \(X=\sum_{i=1}^nX_i\), where the \(X_i\) are independent Bernoulli variables with the same success probability \(p\). Then

$$
X\sim\operatorname{Binomial}(n,p)
$$

with

$$
P(X=k)={n\choose k}p^k(1-p)^{n-k},
\qquad k=0,1,\ldots,n.
$$

The combinatorial factor chooses which \(k\) trials succeeded. Linearity gives \(E[X]=np\). Independence makes variances add, so

$$
\operatorname{Var}(X)=np(1-p).
$$

The binomial model requires a fixed trial count, binary outcomes, a common \(p\), and independent trials. “Count data” alone does not justify it.

**Worked example — exact binomial tail.** Suppose eight independently sampled evaluation items each pass with probability \(p=0.75\). The probability of at least seven passes is

$$
{8\choose7}(0.75)^7(0.25)+(0.75)^8
\approx0.367.
$$

The first term chooses which one of eight items failed; the second covers no failures. If the items share a passage or template, independence may fail and this tail calculation no longer follows.

### Geometric: waiting time to the first success

With support \(1,2,\ldots\),

$$
P(X=k)=(1-p)^{k-1}p.
$$

Here \(X\) counts the successful trial itself. Some software instead counts failures and uses support \(0,1,\ldots\); always state the convention.

The geometric distribution is memoryless:

$$
P(X>s+t\mid X>s)=P(X>t).
$$

Its mean and variance are

$$
E[X]=\frac1p,
\qquad
\operatorname{Var}(X)=\frac{1-p}{p^2}.
$$

### Poisson: event counts over exposure

For rate or expected count \(\lambda>0\),

$$
X\sim\operatorname{Poisson}(\lambda),
\qquad
P(X=k)=e^{-\lambda}\frac{\lambda^k}{k!}.
$$

Its mean and variance both equal \(\lambda\). This equality is a diagnostic implication, not a universal truth about counts. Real data often have variance larger than the mean because rates differ across cases, events cluster, or observations are dependent.

If \(n\) is large, \(p\) is small, and \(np\approx\lambda\), a \(\operatorname{Binomial}(n,p)\) count is approximately Poisson. The approximation describes many rare opportunities, not merely any rare observed result.

**Worked example — a Poisson interval.** If failures arrive at an approximately constant rate of two per hour, then the probability of no failures in a half-hour uses exposure-adjusted mean \(\lambda=1\):

$$
P(X=0)=e^{-1}\approx0.368.
$$

Using \(\lambda=2\) would mix an hourly rate with a half-hour exposure. Parameters carry units and must be scaled with the observation window.

> **Practice — Foundation:** Identify whether each variable is best modelled initially as binomial, geometric, or Poisson: successes in fixed trials, trials until first success, arrivals in a fixed interval.
>
> **Hint:** Distinguish a fixed number of trials, a stopping time, and a count over exposure.
>
> **Practice — Core:** Derive the mean of a geometric variable by a tail-sum argument, then state which support convention you used.
>
> **Hint:** For support 1,2,..., sum P(X>k) starting at k=0.
>
> **Practice — Stretch:** Hold \(np=2\) and compare Binomial\((n,p)\) with Poisson\((2)\) for \((n,p)=(10,0.2),(100,0.02),(1000,0.002)\). Compute \(P(X=0)\) under each binomial and the total-variation distance \(\tfrac12\sum_k|p_{\text{bin}}(k)-p_{\text{Pois}}(k)|\), and state at which \(n\) the approximation is poor.
>
> **Hint:** P(X=0) is \((1-p)^n\) against \(e^{-2}\approx0.135\); the total-variation distances are about 0.052, 0.0046 and 0.00045, so n = 10 is the poor case.

## 9. Uniform, exponential, and Gaussian variables

### Uniform: equal density over a bounded interval

For \(X\sim\operatorname{Uniform}(a,b)\),

$$
f_X(x)=\frac1{b-a}\mathbf1\{a\le x\le b\}.
$$

For \(a\le c\le d\le b\),

$$
P(c\le X\le d)=\frac{d-c}{b-a}.
$$

Its moments are

$$
E[X]=\frac{a+b}{2},
\qquad
\operatorname{Var}(X)=\frac{(b-a)^2}{12}.
$$

Equal density is not equal probability for intervals of different lengths.

**Worked example — a uniform interval.** If randomized backoff is uniform from 20 to 60 milliseconds, then the chance of landing between 30 and 45 milliseconds is

$$
\frac{45-30}{60-20}=\frac{15}{40}=0.375.
$$

Endpoints do not affect this continuous probability because individual points have probability zero.

### Exponential: waiting time at a constant rate

For rate \(\lambda>0\),

$$
f_X(x)=\lambda e^{-\lambda x}\mathbf1\{x\ge0\},
\qquad
F_X(x)=1-e^{-\lambda x}\quad(x\ge0).
$$

Its survival probability, mean, and variance are

$$
P(X>x)=e^{-\lambda x},
\qquad
E[X]=\frac1\lambda,
\qquad
\operatorname{Var}(X)=\frac1{\lambda^2}.
$$

Like the geometric distribution, it is memoryless. Constant hazard is a substantive assumption and often fails for user behavior, hardware failures, and task completion times.

**Worked example — interpret rate before calculating.** With an exponential waiting-time rate of \(0.25\) events per minute, the mean wait is four minutes. The probability of waiting more than eight minutes is \(e^{-0.25(8)}=e^{-2}\approx0.135\). The input to the exponent is dimensionless: minutes cancel against events per minute.

### Gaussian: additive variation on the real line

For \(\sigma>0\),

$$
X\sim\mathcal N(\mu,\sigma^2)
$$

has density

$$
f_X(x)=\frac1{\sigma\sqrt{2\pi}}
\exp\!\left[-\frac{(x-\mu)^2}{2\sigma^2}\right].
$$

Its mean is \(\mu\) and variance is \(\sigma^2\). Standardization gives

$$
Z=\frac{X-\mu}{\sigma}\sim\mathcal N(0,1).
$$

Roughly 68%, 95%, and 99.7% of Gaussian mass lies within one, two, and three standard deviations of the mean. These are properties of the Gaussian family, not rules for arbitrary data.

A Gaussian has support over the whole real line. It is a poor direct model for a strictly positive quantity when nonnegligible mass would fall below zero, and a poor tail model when extremes occur much more frequently than Gaussian tails predict.

**Worked example — standardize before using a Gaussian probability.** If an approximately Gaussian score has mean 70 and standard deviation 8, then a score of 86 corresponds to

$$
z=\frac{86-70}{8}=2.
$$

The Gaussian approximation places about 2.3% of observations above this value. This conclusion depends on the Gaussian model; “two standard deviations” alone does not determine a tail probability for arbitrary data.

> **Practice — Foundation:** For \(U\sim\text{Uniform}(2,10)\), compute \(P(3<U<7)\). For \(T\sim\text{Exponential}(\lambda=0.5)\), compute \(P(T>4)\).
>
> **Hint:** The uniform probability is 4/8, the interval length over the support length; the exponential survival is \(e^{-\lambda t}=e^{-2}\approx0.135\).
>
> **Practice — Core:** Verify the exponential memoryless property \(P(T>s+t\mid T>s)=P(T>t)\) algebraically, check it for \(\lambda=0.5\), \(s=2\), \(t=4\), and explain what it claims in conditional-probability language.
>
> **Hint:** Divide survival at s + t by survival at s: \(e^{-3}/e^{-1}=e^{-2}=P(T>4)\).
>
> **Practice — Stretch:** Latencies come from fast requests, Normal\((80,10^2)\) ms with probability 0.7, and slow requests, Normal\((400,50^2)\) ms with probability 0.3. Compute the mixture mean and standard deviation, then compare \(P(Y<0)\) and \(P(150<Y<250)\) under a Gaussian with those moments and under the mixture. Explain why a single exponential also fails.
>
> **Hint:** Total variance equals the within-type variances plus the spread of the type means, giving mean 176 and SD about 149.4; the fitted Gaussian puts about 0.12 below 0 and about 0.26 in (150, 250), where the mixture has almost no mass.

## 10. How the common families relate

| Distribution | Support | Data-generating question | Parameters | Mean | Variance |
|---|---|---|---|---:|---:|
| Bernoulli | \(\{0,1\}\) | Did one trial succeed? | \(p\) | \(p\) | \(p(1-p)\) |
| Categorical | \(\{1,\ldots,K\}\) | Which one of \(K\) classes occurred? | \(p_1,\ldots,p_K\) | encoding-dependent | encoding-dependent |
| Binomial | \(\{0,\ldots,n\}\) | How many of \(n\) iid binary trials succeeded? | \(n,p\) | \(np\) | \(np(1-p)\) |
| Geometric | \(\{1,2,\ldots\}\) | Which iid trial was the first success? | \(p\) | \(1/p\) | \((1-p)/p^2\) |
| Poisson | \(\{0,1,\ldots\}\) | How many constant-rate events occurred in an exposure? | \(\lambda\) | \(\lambda\) | \(\lambda\) |
| Uniform | \([a,b]\) | Is density constant on a bounded interval? | \(a,b\) | \((a+b)/2\) | \((b-a)^2/12\) |
| Exponential | \([0,\infty)\) | How long until a constant-rate event? | \(\lambda\) | \(1/\lambda\) | \(1/\lambda^2\) |
| Gaussian | \(\mathbb R\) | Is variation plausibly additive and symmetric? | \(\mu,\sigma^2\) | \(\mu\) | \(\sigma^2\) |

This table is a recognition aid, not a model-selection algorithm. Independence, stationarity, support, censoring, truncation, and selection mechanisms matter as much as the shape of a histogram.

> **Practice — Foundation:** Without looking back, decide whether each value is in the support: 0 under Geometric\((0.3)\) (support \(1,2,\ldots\)), 12 under Binomial\((12,0.3)\), \(-0.5\) under Exponential\((2)\), and \(2.5\) under Poisson\((3)\). Then state which constraint Poisson\((\lambda=-1)\) violates.
>
> **Hint:** Write each support first: {1, 2, …}, {0, …, 12}, [0, ∞) and {0, 1, 2, …}; a Poisson rate must be positive.
>
> **Practice — Core:** Independent trials succeed with probability \(p=0.3\). Compute \(P(\text{exactly 2 successes in 5 trials})\) and \(P(\text{first success on trial 3})\), and state which stopping rule produces each distribution.
>
> **Hint:** The binomial count uses \({5\choose2}0.3^2 0.7^3\) because the experiment stops after 5 trials; the geometric uses \(0.7^2(0.3)\) because it stops at the first success.
>
> **Practice — Stretch:** Build a decision tree that chooses a first-pass family from support, repetition structure, and stopping rule. Apply it to (a) correct answers among 50 questions of varying difficulty, (b) retries until success when failures are cached and repeated, and (c) daily error counts with bursty incidents. For each, name the first-pass family and the assumption that fails.
>
> **Hint:** The tree suggests binomial, geometric and Poisson; they fail because of unequal success probabilities, dependence between attempts, and clustered or varying event rates.

## 11. Transformations: distinguish values from density

If \(Y=g(X)\), the distribution of \(Y\) must account for how \(g\) moves and stretches probability mass.

For an affine transformation \(Y=aX+b\) with \(a>0\),

$$
F_Y(y)=P(aX+b\le y)
=F_X\!\left(\frac{y-b}{a}\right).
$$

Differentiating gives

$$
f_Y(y)=\frac1a f_X\!\left(\frac{y-b}{a}\right).
$$

The factor \(1/a\) preserves total area. For \(a<0\), the density factor is \(1/|a|\), and the CDF inequality reverses during the derivation.

For a differentiable one-to-one transformation,

$$
f_Y(y)=f_X(g^{-1}(y))
\left|\frac{d}{dy}g^{-1}(y)\right|.
$$

Non-one-to-one transformations require summing contributions from every inverse branch. The next unit derives this rule carefully and extends it to vectors using Jacobian determinants.

> **Practice — Foundation:** If \(Y=2X+3\), compute the transformed support when \(X\in\{-1,0,2\}\).
>
> **Hint:** Transform every support point, including negative ones.
>
> **Practice — Core:** For \(X\sim\text{Uniform}(0,1)\) and \(Y=X^2\), derive the CDF and density of \(Y\), including its support.
>
> **Hint:** For y between zero and one, rewrite X²<=y as X<=sqrt(y).
>
> **Practice — Stretch:** Let \(X\sim\text{Uniform}(0,1)\) and \(Y=2X\). Show that the naive density \(f_Y(y)=f_X(y/2)=1\) on \([0,2]\) integrates to 2, derive the correct density, and explain the correction through interval stretching.
>
> **Hint:** The map doubles every interval's length but keeps its probability, so the density height must halve: \(f_Y(y)=f_X(y/2)\cdot\tfrac12\).

## 12. Sampling constructs observations from a distribution

A **sample** \(X_1,\ldots,X_n\) is a collection of random variables. An iid sample means they are independent and have the same distribution. Neither property follows merely because values are stored in separate rows.

A pseudo-random number generator is deterministic stateful software designed to imitate random draws. A seed chooses its initial state. Reproducibility requires recording at least the algorithm or library, seed, code version, and sampling configuration.

### Inverse-CDF idea

If \(U\sim\operatorname{Uniform}(0,1)\), then

$$
X=F^{-1}(U)
$$

has CDF \(F\), under the generalized quantile definition. For a categorical distribution, partition \([0,1)\) into consecutive intervals with lengths \(p_1,\ldots,p_K\); the interval containing \(U\) selects the category.

For unnormalized nonnegative weights \(w_k\), draw \(U\) uniformly on \([0,W)\), where \(W=\sum_kw_k\), and return the first category whose cumulative weight exceeds \(U\). Normalization is implicit.

![Inverse-CDF categorical sampling divides a uniform interval into regions whose lengths equal category probabilities.](../assets/inverse-cdf.svg)

**Worked example — one categorical draw.** Weights \((2,3,5)\) have total ten and cumulative boundaries \((2,5,10)\). A uniform draw \(u=6.4\) lies after five and before ten, so it selects category 2. Multiplying every weight and the sampled interval by ten preserves the selected category and the distribution.

### Empirical distributions and Monte Carlo averages

Given observed values \(X_1,\ldots,X_n\), the empirical distribution puts mass \(1/n\) on each observation. For a function \(g\), the Monte Carlo estimate is

$$
\widehat\mu_n=\frac1n\sum_{i=1}^ng(X_i).
$$

For iid draws with finite variance \(\sigma_g^2=\operatorname{Var}(g(X))\),

$$
E[\widehat\mu_n]=E[g(X)],
\qquad
\operatorname{Var}(\widehat\mu_n)=\frac{\sigma_g^2}{n}.
$$

Thus typical noise shrinks like \(1/\sqrt n\), not \(1/n\). Reducing Monte Carlo standard error by a factor of ten generally requires one hundred times as many independent draws. Later units justify this behavior and handle dependent samples.

> **Practice — Foundation:** Use inverse-CDF sampling to map \(u=0.72\) into a categorical distribution with probabilities \((0.2,0.5,0.3)\).
>
> **Hint:** Find the first cumulative mass strictly above the supplied uniform draw.
>
> **Practice — Core:** Implement inverse-CDF sampling for the PMF \((0.2,0.5,0.3)\) on labels 0, 1, 2. Draw 10,000 samples using `random.Random(0)`, report the label frequencies, and check that each is within three standard errors \(\sqrt{p(1-p)/10000}\) of its target.
>
> **Hint:** Return the first label whose cumulative mass exceeds u; the standard errors are 0.004, 0.005 and about 0.0046, and this seed gives counts 1983, 5015 and 3002.
>
> **Practice — Stretch:** Sample Exponential\((\lambda=10^6)\) by the inverse transform \(-\log(1-U)/\lambda\) with \(U\) from `random.Random(0).random()`, taking \(10^6\) draws, and compare the sample mean with \(10^{-6}\) and with `random.expovariate`. Explain why \(-\log(U)/\lambda\) is not safe even though it has the same law in theory.
>
> **Hint:** `random()` can return exactly 0 but never 1, so 1 − U lies in (0, 1] and its log is finite, while log(0) raises an error; the seeded mean should be within about 0.1% of \(10^{-6}\).

## 13. Numerical and modelling discipline

### Work in log space for tiny probabilities

Products of many probabilities underflow. Use

$$
\log\prod_i p_i=\sum_i\log p_i.
$$

To add log probabilities, use log-sum-exp rather than exponentiating first. Zero probability corresponds to log probability \(-\infty\), which requires explicit handling.

### Parameters have domains

- Bernoulli and binomial require \(0\le p\le1\).
- Poisson and exponential require \(\lambda>0\).
- Gaussian requires \(\sigma>0\), or equivalently variance \(\sigma^2>0\).
- A categorical vector requires nonnegative entries and positive total mass before normalization.

A model can emit a finite numerical answer while violating these semantic constraints.

### Diagnose the assumptions, not only the fit

Ask:

1. Does the distribution have the correct support?
2. Does its experiment match how the data were generated?
3. Are observations independent, grouped, censored, truncated, or selected?
4. Are the parameter and process stable across time and subpopulations?
5. Are tails and rare events important to the decision?
6. Could a mixture or hierarchy explain apparent overdispersion?

A histogram that resembles a named density is weak evidence if these questions fail.

> **Practice — Foundation:** For each weight vector, decide whether a categorical sampler should accept it and name the check involved: \((1,2,3)\), \((0,0,0)\), \((1,-1,2)\), \((1,\text{NaN},1)\), and \((0,0,5)\).
>
> **Hint:** Check that every weight is finite, every weight is nonnegative, and the total is positive; a vector with zeros but a positive total is valid.
>
> **Practice — Core:** Create three deliberately invalid inputs—negative weight, all-zero weights, and a NaN—and specify the safest failure behavior for each.
>
> **Hint:** Reject invalid inputs before consuming randomness; do not silently renormalize NaN.
>
> **Practice — Stretch:** A script seeds `random.Random(0)` and four threads draw 1,000 numbers from the shared generator in arrival order. Two runs produce the same set of 1,000 values but different per-thread sums. Design a reproducibility report (algorithm, seed, library version, hardware, execution order) and say which field would have predicted this discrepancy.
>
> **Hint:** The seed fixes the sequence of values, not which thread receives each value; only a recorded deterministic execution order, or one generator per thread, makes the per-thread results reproducible.

## 14. Runnable lab: categorical sampling from weights

Implement `sample_categorical` in [labs/exercises.py](../../labs/exercises.py). It accepts a finite sequence of nonnegative weights, a nonnegative integer draw count, and an integer seed. It returns the sampled zero-based category indices.

Requirements:

- reject empty, negative, nonfinite, or all-zero weights;
- reject invalid draw counts and seeds;
- do not mutate the weights;
- use a local seeded random-number generator rather than global random state;
- preserve the distribution if every weight is multiplied by the same positive constant;
- never sample a zero-weight category.

Run:

```text
python -m labs.checks categorical
```

After the behavioral check passes, run at least 100 independent replications for draw counts \(10^2,10^3,10^4\). Plot the error in the estimated class probabilities against \(n\) on log axes and compare it with a reference slope proportional to \(n^{-1/2}\).

## 15. Derivations to own

Derive these results rather than memorizing the table:

1. Bernoulli mean and variance using \(X^2=X\).
2. Binomial PMF by counting which trials succeed.
3. Binomial mean and variance using a sum of indicators.
4. Geometric memorylessness from its survival function.
5. Poisson normalization using the exponential power series.
6. Uniform mean and variance by integration.
7. Exponential CDF, mean, and memorylessness.
8. The affine density transformation and its absolute scale factor.
9. Unbiasedness and variance of an iid Monte Carlo average.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-distributions
```

## 16. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–3. Read PMFs, CDFs, densities, and moments accurately.

**A1 · Foundation · paper — PMF and CDF.** Let \(p_X(x)=cx\) for \(x\in\{1,2,3,4\}\). Find \(c\), write the complete CDF, and compute \(P(1<X\le3)\).

**A2 · Foundation · paper — Density versus probability.** Let \(X\sim\operatorname{Uniform}(0,0.2)\). Find \(f_X(0.1)\), \(P(X=0.1)\), and \(P(0.08<X<0.12)\). Explain why the three answers are different kinds of quantities.

**A3 · Foundation · paper — Moments.** Derive \(\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X)\) directly from the definition.

### Core — problems 4–8. Select and manipulate distribution families while auditing assumptions.

**A4 · Core · paper — Binomial assumptions.** A moderation dataset contains 1,000 messages from 40 users, 25 messages each. Each user is independently high-risk (violation probability \(0.38\)) or low-risk (\(0.02\)) with probability \(1/2\), so the overall violation rate is \(0.2\). Compute the variance of the total violation count and compare it with the Binomial\((1000,0.2)\) variance. Explain why the count need not be binomial even though every row is binary.

**A5 · Core · paper — Overdispersion.** A per-minute request count has empirical mean 8 and variance 24. Compute its dispersion index, show that an equal mixture of Poisson\((4)\) and Poisson\((12)\) minutes reproduces both moments, and give a second process-level reason a single Poisson model may fail.

**A6 · Core · paper — Waiting times.** For \(X\sim\operatorname{Exponential}(\lambda)\), find its median and compare it with its mean. Evaluate both for \(\lambda=0.5\) per second.

**A7 · Core · paper — Transformation.** If \(X\sim\operatorname{Uniform}(0,1)\) and \(Y=X^2\), derive \(F_Y\) and \(f_Y\). Identify where the density is largest.

**A8 · Core · paper — Categorical encoding.** Three classes occur with probabilities \((0.5,0.3,0.2)\). Compute the mean class ID under the labelling \((0,1,2)\) and under the relabelling \((2,0,1)\), explain why the numeric mean is representation-dependent, and give the one-hot mean instead.

### Stretch — problems 9–14. Combine simulation, numerical reasoning, and model criticism.

**A9 · Stretch · paper — Simulation.** Estimate \(P(X\ge8)\) for \(X\sim\operatorname{Binomial}(10,0.6)\) using 50 independent batches of 10,000 draws from local RNG seeds 0 through 49. Compare the mean and standard deviation of the 50 estimates with the exact probability and its predicted Monte Carlo standard error.

**A10 · Stretch · paper — Model critique.** A team fits a Gaussian with mean 800 ms and standard deviation 150 ms to generation latency because its central histogram looks symmetric; in 10,000 logged requests, 37 exceeded 1,500 ms. Compute the Gaussian-implied \(P(Y>1500)\), compare it with the empirical rate, and list three checks needed before using any model to estimate a strict tail-latency service-level objective.

**A11 · Stretch · paper — Numerics.** A sequence has 2,000 next-token probabilities, each equal to \(0.6\). Compute the base-10 exponent of their product and the natural-log likelihood, and explain why the product underflows in double precision while the log-likelihood remains usable.

**A12 · Stretch · paper — Transfer.** Match a distribution to each story and state one assumption whose failure invalidates it: (a) exactly one of five routing destinations is selected per request; (b) GPU faults are counted during a fixed 24-hour window under a constant independent rate; (c) independent attempts continue until the first schema-valid response; (d) waiting time to the next request under a homogeneous Poisson arrival process. Distinguish the geometric support convention you use.

**A13 · Stretch · paper — Distribution forensics.** Treat this as an unknown generator: with `random.Random(13)`, draw 10,000 values `floor(r.expovariate(1/3))`. Without using its definition, report the minimum and number of distinct values, the fraction of zeros, the sample mean and variance, and the lag-1 autocorrelation. Compare these with a Geometric model on \(\{0,1,\ldots\}\) with success probability \(1-e^{-1/3}\), and explain why a good fit does not identify the mechanism.

**A14 · Stretch · paper — Sampler stress test.** A buggy categorical sampler rounds each cumulative probability to two decimals and divides by the last one before sampling. Compute its effective probabilities for weights \((1,1,1)\) and \((996,2,2)\), then design tests that reliably expose the defect in each case: give the number of draws needed and the expected size of the discrepancy in standard errors.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** How does a density differ from a point probability?

**K2 · Core · gate — Derivation.** Derive the mean and variance of a binomial count using indicators.

**K3 · Core · gate — Calculation.** Find the variance of Binomial(20, 0.3).

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-distributions experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Must a sample average estimate a finite population mean for every named distribution?

**K6 · Stretch · gate — RE/RS transfer.** Specify a model for generation lengths with a hard token cap.

## Mastery check

Given an unfamiliar data-generating story, define the random variable and support, propose a distribution, derive its mean or a relevant event probability, simulate from it with a local seed, and name two assumptions whose failure would change the result. Then distinguish model probability, density, empirical frequency, and estimator uncertainty without using those words interchangeably.

The next unit, [joint distributions, conditioning, and covariance](02-joint-distributions-conditioning-covariance.md), moves from one variable to several while keeping every calculation finite and inspectable.
