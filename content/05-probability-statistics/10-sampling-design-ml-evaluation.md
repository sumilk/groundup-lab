---
id: math.statistics.sampling-design-ml-evaluation
title: Sampling design, dataset construction, and rigorous ML evaluation
prerequisites: [math.statistics.bayesian-modeling-computation]
answers: ps-10-sampling-design-ml-evaluation
estimated_hours: 42
---

# Sampling design, dataset construction, and rigorous ML evaluation

A statistical calculation begins after data exist, but validity often depends on how those data entered the table. Which units were reachable? Which were sampled? Which responded? Which labels were purchased? Which tasks were selected? Which benchmark versions influenced training? A random number generator cannot repair an undefined population or a biased sampling frame.

This chapter develops sampling as both a data-collection design and a computational technique. It starts with finite populations, sampling with and without replacement, inclusion probabilities, stratification, clustering, multistage designs, weights, and nonresponse. It then adds rejection and variance-reduction sampling before applying the full probability-and-statistics track to ML evaluation under seeds, dependence, adaptive selection, contamination, and distribution shift.

By the end, you should be able to define a target population and sampling frame; derive simple-random-sampling estimators and finite-population corrections; design stratified, cluster, multistage, or unequal-probability samples; use Horvitz–Thompson weighting; diagnose nonresponse and convenience sampling; implement rejection sampling; reason about active and adaptive collection; construct leakage-resistant evaluation splits; quantify several randomness axes; and design an evaluation whose uncertainty and conclusions match deployment.

## 0. Population, frame, sample, and estimand are different objects

A **target population** is the collection to which a claim should apply. A **sampling frame** is the operational list or process from which units can actually be selected. A **sample** is the realized collection. An **estimand** is the population quantity being learned.

For a finite population of \(N\) fixed values \(y_1,\ldots,y_N\), the population mean is

$$
\bar Y_N=\frac1N\sum_{i=1}^Ny_i.
$$

In design-based inference, these values are fixed. Randomness comes from the sample-selection mechanism. In model-based inference, the values may instead be treated as draws from a probability model. Both views can be useful, but their uncertainty refers to different hypothetical repetitions.

![A sample reaches the target population only through its frame and selection process.](../assets/sampling-frame-coverage.svg)

Coverage error occurs when target units are absent from the frame or frame units are outside the target. Random selection within a flawed frame gives an excellent probability sample of the wrong population.

**Worked example — product feedback.** The target is all active users, but the frame contains users who opened a feedback widget. Randomly sampling widget openers does not make silent users representative. The selection event may depend on dissatisfaction, platform, language, or engagement.

> **Practice — Foundation:** A poll about a ballot measure targets 2,000,000 registered voters. It dials 1,000 numbers drawn from a list of 1,500,000 landlines; 600 people answer and 330 favor the measure. Identify the target population, sampling frame, sample, and estimand, and compute the naive estimate.
>
> **Hint:** The frame is the landline list, while the estimand is the favorable share among all 2,000,000 voters; the naive estimate is \(330/600\).
>
> **Practice — Core:** An assistant will serve next quarter's conversations for five enterprise customers. You hold 50,000 logged conversations from last month for three of them, who will generate 60% of next quarter's traffic. Define the target population, frame, sample, and estimand, and state the share of target traffic the frame cannot reach at all.
>
> **Hint:** Write the estimand as a mean over next quarter's conversations; traffic from the two missing customers never appears in the frame.
>
> **Practice — Stretch:** The frame lists all 10,000 users, so coverage is complete. True satisfaction is 70%, but satisfied users answer the survey with probability 0.4 and dissatisfied users with probability 0.1. Compute the expected satisfaction share among respondents.
>
> **Hint:** The respondent share is \(P(\text{sat})P(R\mid\text{sat})/P(R)=0.28/(0.28+0.03)\).

## 1. Sampling with and without replacement

In sampling **with replacement**, each draw returns the selected unit before the next draw. A unit can appear several times. Conditional on a fixed finite population and equal draw probabilities, draws are independent.

In sampling **without replacement**, selected units cannot reappear. Draws are dependent: selecting one unit changes later possibilities. This dependence reduces uncertainty because the sample cannot repeatedly waste draws on the same unit.

A **simple random sample without replacement** (SRSWOR) of size \(n\) gives each subset of \(n\) population units equal probability. Each unit has first-order inclusion probability

$$
\pi_i=P(i\text{ is included})=\frac nN.
$$

Each pair \(i\neq j\) has joint inclusion probability

$$
\pi_{ij}
=P(i,j\text{ both included})
=\frac{n(n-1)}{N(N-1)}.
$$

Equal marginal inclusion probabilities alone do not define SRSWOR; joint probabilities determine dependence and variance.

**Worked example — sample two of four.** The six possible unordered samples are \(\{1,2\},\{1,3\},\{1,4\},\{2,3\},\{2,4\},\{3,4\}\). Each unit appears in three samples, so \(\pi_i=3/6=1/2=n/N\). Each pair appears once, so \(\pi_{ij}=1/6\).

> **Practice — Foundation:** Count the SRSWOR samples of size three from ten units, and compare with the number of ordered with-replacement draw sequences of length three.
>
> **Hint:** Without replacement and unordered gives \(\binom{10}{3}\); ordered with replacement gives \(10^3\).
>
> **Practice — Core:** For \(N=10\) and \(n=3\), derive \(\pi_i\) and \(\pi_{ij}\) by counting subsets, and check them against \(n/N\) and \(n(n-1)/[N(N-1)]\).
>
> **Hint:** Subsets containing unit \(i\) choose the other two from nine: \(\binom92/\binom{10}3\); for a pair, choose the remaining unit from eight.
>
> **Practice — Stretch:** Units 1–4 form fixed pairs \(\{1,2\}\) and \(\{3,4\}\), and the design picks one pair with probability \(1/2\). Show that \(\pi_i=1/2\) as under SRSWOR with \(n=2\), but \(\pi_{12}=1/2\) and \(\pi_{13}=0\). For \(y=(1,1,5,5)\), compute \(\operatorname{Var}(\bar y_s)\) under this design and under SRSWOR.
>
> **Hint:** Under the pair design \(\bar y_s\) is either 1 or 5; under SRSWOR use \((1-n/N)S_Y^2/n\) with \(S_Y^2=16/3\).

## 2. The finite-population correction measures information left behind

The SRSWOR sample mean

$$
\bar y_s=\frac1n\sum_{i\in s}y_i
$$

is unbiased for \(\bar Y_N\). Define finite-population variance

$$
S_Y^2=\frac1{N-1}\sum_{i=1}^N(y_i-\bar Y_N)^2.
$$

Then

$$
\operatorname{Var}_{\mathrm{design}}(\bar y_s)
=
\left(1-\frac nN\right)\frac{S_Y^2}{n}.
$$

The factor

$$
\sqrt{1-\frac nN}
$$

is the **finite-population correction** (FPC) for the standard error. It matters when the sample fraction \(f=n/N\) is not negligible. If the entire population is observed, \(f=1\) and design uncertainty is zero.

The FPC does not eliminate measurement error, missing outcomes, future-population change, or model uncertainty. A census of today's benchmark has no sampling uncertainty about today's benchmark mean, yet it may poorly predict future deployment.

**Worked example.** Sampling \(400\) of \(1{,}000\) units gives an FPC of \(\sqrt{0.6}\approx0.775\). Ignoring it overstates design standard error by about 29%. Sampling \(400\) from ten million makes the correction effectively one.

> **Practice — Foundation:** Calculate the FPC for \(n=200,N=800\).
>
> **Hint:** The sampling fraction is \(f=200/800=0.25\); the SE correction is \(\sqrt{1-f}\).
>
> **Practice — Core:** Derive the SRSWOR variance of the mean from inclusion indicators, then verify it by enumerating all samples of size 2 from \(y=(1,2,6)\).
>
> **Hint:** Use \(\operatorname{Cov}(I_i,I_j)=\pi_{ij}-\pi_i\pi_j<0\); the three sample means are 1.5, 3.5, and 4, and \(S_Y^2=7\).
>
> **Practice — Stretch:** All 500 items of a benchmark are scored, and accuracy is 0.80. Compute the FPC-corrected design SE and the iid SE \(\sqrt{0.8(0.2)/500}\), and explain which is appropriate when the claim concerns future items from the same generator.
>
> **Hint:** With \(f=1\) the design SE is zero for this fixed list; a future-item claim treats the 500 items as draws from a superpopulation.

## 3. Stratified sampling guarantees coverage of declared groups

Partition the population into \(H\) non-overlapping strata. Stratum \(h\) has population size \(N_h\), sample size \(n_h\), population mean \(\bar Y_h\), and weight

$$
W_h=\frac{N_h}{N}.
$$

Sample independently within each stratum. The stratified mean estimator is

$$
\hat{\bar Y}_{\mathrm{strat}}
=\sum_{h=1}^H W_h\bar y_h.
$$

Under SRSWOR within strata, its estimated variance is

$$
\widehat{\operatorname{Var}}(\hat{\bar Y}_{\mathrm{strat}})
=
\sum_{h=1}^H
W_h^2
\left(1-\frac{n_h}{N_h}\right)
\frac{s_h^2}{n_h}.
$$

**Proportional allocation** uses \(n_h\propto N_h\). With equal per-unit costs, **Neyman allocation** uses

$$
n_h\propto N_hS_h,
$$

placing more samples in large, variable strata. Minimum per-stratum sizes may be imposed for subgroup precision even when they are not optimal for the overall mean.

![Stratified sampling draws inside every group, while cluster sampling selects whole groups.](../assets/stratified-versus-cluster.svg)

**Worked example — language evaluation.** If deployment is 70% English, 20% Hindi, and 10% Tamil but the evaluation samples 200 examples from every language, the raw average targets an equal-language mixture. Weighting stratum means by \(0.7,0.2,0.1\) targets deployment composition while retaining sufficient Tamil observations for subgroup analysis.

> **Practice — Foundation:** English makes up 80% of deployment traffic with sample accuracy 0.9; other languages make up 20% with sample accuracy 0.6. Compute the stratified mean and compare it with the unweighted mean of the two stratum means.
>
> **Hint:** Weight each stratum mean by its population share: \(0.8(0.9)+0.2(0.6)\).
>
> **Practice — Core:** Derive the stratified variance estimator under independent within-stratum SRSWOR, then evaluate the SE for \(N=(800,200)\), \(n=(40,40)\), and \(s^2=(0.09,0.25)\).
>
> **Hint:** Independence across strata makes the variance a sum; stratum \(h\) contributes \(W_h^2(1-n_h/N_h)s_h^2/n_h\).
>
> **Practice — Stretch:** Allocate \(n=1{,}000\) labels over strata with \(N=(9000,900,100)\) and \(S=(0.3,0.5,0.1)\), where the third is a rare safety stratum. Compute proportional and Neyman allocations, then a Neyman allocation constrained to at least 100 labels in the safety stratum.
>
> **Hint:** Neyman uses \(n_h\propto N_hS_h=(2700,450,10)\); impose the minimum first and split the remaining 900 in proportion to \(N_hS_h\).

## 4. Cluster sampling trades collection efficiency for information

A cluster contains several population units: students within schools, messages within users, prompts within tasks, or trajectories within environments.

In one-stage cluster sampling, sample clusters and observe every element in each selected cluster. In two-stage sampling, select clusters and then sample elements within them. If cluster \(j\) has inclusion probability \(\pi_j\) and unit \(i\) has conditional probability \(\pi_{i\mid j}\), the unit's overall inclusion probability is

$$
\pi_{ij}=\pi_j\pi_{i\mid j}.
$$

Units within a cluster tend to resemble one another. For equal cluster size \(m\) and intraclass correlation \(\rho\), a common approximation to the variance inflation relative to iid rows is

$$
\operatorname{DEFF}\approx1+(m-1)\rho.
$$

The effective row count is roughly \(n/\operatorname{DEFF}\). More observations inside the same few clusters eventually add little information about variation across clusters.

Strata and clusters are opposites in design logic:

- stratification samples from every stratum to spread representation;
- cluster sampling selects a subset of clusters to reduce collection cost.

The same labels—such as regions—can serve either role depending on the design.

**Worked example — prompt tasks.** One thousand prompts from each of three tasks may provide precise means for those tasks but weak evidence about a broader task population. Thirty prompts from each of one hundred sampled tasks can contain much more information about cross-task generalization.

> **Practice — Foundation:** Calculate the design effect for \(m=20,\rho=0.1\), and the effective sample size of 2,000 rows.
>
> **Hint:** \(\operatorname{DEFF}=1+(m-1)\rho\); divide the row count by it.
>
> **Practice — Core:** With a budget of 1,200 rows and \(\rho=0.1\), compare 40 clusters of 30 rows with 120 clusters of 10 rows by DEFF and effective sample size, and find the limit of the effective size for 40 clusters as rows per cluster grow without bound.
>
> **Hint:** With \(k\) clusters of size \(m\), \(n_{\mathrm{eff}}=km/(1+(m-1)\rho)\), which tends to \(k/\rho\) as \(m\to\infty\).
>
> **Practice — Stretch:** Sample 5 of 50 domains by SRS, then 4 of each selected domain's 40 documents, then 3 of each selected document's 30 passages. Derive a passage's inclusion probability and its Horvitz–Thompson weight.
>
> **Hint:** Multiply the conditional inclusion probabilities of the three stages: \(5/50\times4/40\times3/30\).

## 5. Unequal inclusion probabilities require weights

Suppose population unit \(i\) has known inclusion probability \(\pi_i>0\), not necessarily equal across units. Let \(I_i\) indicate whether it appears in the sample. The Horvitz–Thompson estimator of the population total

$$
Y=\sum_{i=1}^Ny_i
$$

is

$$
\hat Y_{\mathrm{HT}}
=
\sum_{i=1}^N\frac{I_iy_i}{\pi_i}
=
\sum_{i\in s}\frac{y_i}{\pi_i}.
$$

It is design-unbiased because

$$
E\left[\frac{I_iy_i}{\pi_i}\right]=y_i.
$$

The population mean estimate is \(\hat Y_{\mathrm{HT}}/N\) when \(N\) is known.

![Inverse inclusion weighting lets a rarely sampled unit represent the population mass associated with its small inclusion probability.](../assets/unequal-inclusion-weighting.svg)

Small \(\pi_i\) creates large weights and potentially enormous variance. Exact design variance depends on joint inclusion probabilities \(\pi_{ij}\), not only marginal weights. Weight trimming trades variance reduction for bias and must be disclosed.

With replacement, selecting unit \(i\) on each draw with probability \(p_i\) leads to the Hansen–Hurwitz total estimator

$$
\hat Y_{\mathrm{HH}}
=
\frac1n\sum_{k=1}^n\frac{y_{i_k}}{p_{i_k}}.
$$

Do not interchange inclusion probability \(\pi_i\) with per-draw selection probability \(p_i\).

> **Practice — Foundation:** Observed values \((3,8,5)\) have inclusion probabilities \((0.1,0.4,0.5)\). Calculate the Horvitz–Thompson total.
>
> **Hint:** Sum \(y_i/\pi_i\): \(3/0.1+8/0.4+5/0.5\).
>
> **Practice — Core:** Prove design unbiasedness using inclusion indicators, then verify it for \(y=(2,4,6)\) under the design that selects \(\{1,2\}\), \(\{1,3\}\), \(\{2,3\}\) with probabilities 0.5, 0.3, 0.2.
>
> **Hint:** Each \(\pi_i\) is the total probability of the samples containing \(i\), giving \((0.8,0.7,0.5)\); average the three HT totals with the design probabilities.
>
> **Practice — Stretch:** Under independent (Poisson) sampling, 100 units have \(y=1\) and \(\pi=0.5\), and one unit has \(y=100\) and \(\pi=0.01\). Compute the HT variance \(\sum_i(1-\pi_i)y_i^2/\pi_i\), then the bias, variance, and RMSE after trimming the rare unit's weight from 100 to 10.
>
> **Hint:** Trimming changes the rare unit's expected contribution from \(0.01\times100\times100=100\) to \(0.01\times10\times100=10\).

## 6. Nonresponse introduces a second selection mechanism

Sampling a unit does not ensure observing its outcome. Let \(R_i=1\) indicate response and

$$
r_i=P(R_i=1\mid\text{available information})
$$

be response propensity. A combined weight may include both sampling and response probabilities:

$$
w_i=\frac1{\pi_i r_i}.
$$

Weighting is credible only if response propensities are known or estimable from information sufficient to make remaining nonresponse ignorable for the estimand.

- **Missing completely at random:** response is unrelated to observed and missing values.
- **Missing at random:** conditional on observed variables, response does not depend on the missing value.
- **Missing not at random:** response still depends on the unseen value after conditioning.

These are assumptions about distributions, not labels diagnosed conclusively from observed data alone. Sensitivity analysis should vary plausible missing-outcome behavior when nonignorability matters.

**Worked example — human ratings.** Raters may skip outputs that are very long, unsafe, or difficult to assess. Complete-case averages then target easy-to-rate outputs. Logging skip reasons and assignment features supports response modeling, but unseen discomfort may still make missingness nonignorable.

> **Practice — Foundation:** From 1,000 users, 200 are sampled by SRS and 150 respond. Give the sampling probability, the response rate, and the combined weight, assuming response is uniform.
>
> **Hint:** The overall probability of observing a user is \(\pi r=0.2\times0.75\); the weight is its inverse.
>
> **Practice — Core:** Units are sampled with \(\pi=0.1\). Group A responds with \(r=0.8\) and group B with \(r=0.4\). Respondents are 40 from A with mean 4 and 20 from B with mean 2. Derive the combined weights and compare the weighted mean with the unweighted respondent mean.
>
> **Hint:** \(w=1/(\pi r)\) gives 12.5 and 25; the weighted mean is \(\sum wy/\sum w\).
>
> **Practice — Stretch:** Of 200 outputs, 150 are rated with mean quality 4.0 and 50 are skipped. Suppose skipped outputs have mean \(4.0-\delta\). Compute the overall mean for \(\delta\in\{0,0.5,1,2\}\) and find the \(\delta\) at which it drops below 3.7.
>
> **Hint:** The overall mean is \((150\cdot4+50(4-\delta))/200=4-\delta/4\).

## 7. Convenience samples need an identification argument

A convenience sample has unknown or uncontrolled inclusion probabilities. Examples include voluntary surveys, public benchmark submissions, scraped web text, support tickets, and users who enable telemetry.

Large size reduces variance around the convenience-sample distribution. It does not reduce bias between that distribution and the target. If selection depends on unobserved outcomes after conditioning on recorded covariates, reweighting cannot identify the target mean without additional assumptions.

Post-stratification or calibration weighting chooses weights so sample covariate totals match known population totals. This can correct imbalance on observed variables when:

1. every target region has sample overlap;
2. covariates capture selection-related outcome differences;
3. measurements are comparable across sample and population.

**Worked example — web preference data.** Millions of public comparisons may precisely estimate preferences of participating users and prompts. They need not estimate preferences of enterprise users, low-resource languages, or people who decline data sharing. “Internet-scale” is not a sampling design.

> **Practice — Foundation:** A voluntary survey collects 100,000 responses with satisfaction 80%, while the population rate is 60%. Compute the bias and the naive SE \(\sqrt{0.8(0.2)/100000}\), and compare them.
>
> **Hint:** The SE shrinks like \(1/\sqrt n\); the bias \(0.8-0.6\) does not depend on \(n\).
>
> **Practice — Core:** A sample is 70% young (mean outcome 0.8) and 30% old (mean 0.5); the population is 40% young. Compute the raw and post-stratified estimates, and state the assumptions under which the latter recovers the target mean.
>
> **Hint:** Reweight the cell means by population shares: \(0.4(0.8)+0.6(0.5)\).
>
> **Practice — Stretch:** A web dataset is 90% English and 10% other languages, with preference for model A of 0.6 in English and 0.3 otherwise. Compute the estimate for a global target with a 50/50 language mix and for an enterprise target that is 20% English, and compare both with the raw average.
>
> **Hint:** The cell means stay fixed and only the weights \(W_h\) change; the raw average uses \((0.9,0.1)\).

## 8. Domain mixtures determine what an average means

Let domains \(h=1,\ldots,H\) have target weights \(W_h\) and domain performance \(\mu_h\). The target average is

$$
\mu_{\mathrm{target}}=\sum_hW_h\mu_h.
$$

An unweighted benchmark average instead uses benchmark composition. Changing domain proportions changes the estimand even if every \(\mu_h\) stays fixed.

Under covariate shift, if outcome behavior conditional on \(X\) is stable,

$$
p_{\mathrm{target}}(y\mid x)=p_{\mathrm{source}}(y\mid x),
$$

then

$$
E_{\mathrm{target}}[g(X,Y)]
=
E_{\mathrm{source}}\left[
\frac{p_{\mathrm{target}}(X)}
{p_{\mathrm{source}}(X)}
g(X,Y)
\right].
$$

This requires overlap: source probability must be positive wherever the target places relevant mass. Extreme density ratios behave like extreme sampling weights and destroy precision.

Class balancing is another mixture choice. Oversampling rare classes can improve training, but evaluation must reweight to the intended class prevalence when estimating deployed average loss. Per-class reporting prevents one mixture from hiding failures.

> **Practice — Foundation:** Domain accuracies are \((0.9,0.7,0.5)\). Compute the metric under deployment weights \((0.5,0.3,0.2)\) and under benchmark composition \((0.2,0.3,0.5)\).
>
> **Hint:** Each answer is \(\sum_hW_h\mu_h\) with its own weights.
>
> **Practice — Core:** Derive the covariate-shift importance identity, then check it with \(X\in\{0,1\}\), \(p_S(X=1)=0.2\), \(p_T(X=1)=0.6\), \(E[g\mid X=0]=0.9\), and \(E[g\mid X=1]=0.4\).
>
> **Hint:** The weights are \(w(1)=0.6/0.2\) and \(w(0)=0.4/0.8\); compute \(E_S[wg]\) and compare it with \(\sum_xp_T(x)E[g\mid x]\).
>
> **Practice — Stretch:** Model A scores \((0.95,0.60)\) on two domains and model B scores \((0.85,0.75)\). Find the weight \(W\) on domain 1 at which the ranking flips, and compute both scores at \(W=0.8\) and \(W=0.3\).
>
> **Hint:** Both scores are linear in \(W\): \(0.60+0.35W\) and \(0.75+0.10W\); set them equal.

## 9. Random-variate generation has several basic constructions

Inverse-CDF sampling handles distributions with computable quantiles. Other reusable ideas include:

### Transformation

Draw a simple variable and transform it. Box–Muller transforms two independent uniform variables into Gaussian variables:

$$
Z_1=\sqrt{-2\log U_1}\cos(2\pi U_2),
\qquad
Z_2=\sqrt{-2\log U_1}\sin(2\pi U_2).
$$

### Composition

For a mixture, first sample component \(K\), then sample from \(p(x\mid K)\).

### Rejection sampling

Suppose target density \(f\) and proposal \(q\) satisfy

$$
f(x)\leq Mq(x)
$$

for every \(x\). Propose \(X\sim q\), draw \(U\sim\operatorname{Uniform}(0,1)\), and accept when

$$
U\leq\frac{f(X)}{Mq(X)}.
$$

![Rejection sampling accepts proposal points with a target-shaped probability below a valid envelope.](../assets/rejection-sampling-envelope.svg)

The acceptance rate is \(1/M\) when \(f\) and \(q\) are normalized. An invalid envelope biases the sample; a loose envelope is valid but inefficient.

### Discrete tables

CDF lookup supports moderate categorical distributions. Alias tables use preprocessing to permit constant-time repeated draws. The preprocessing, normalization, and finite-precision edge cases remain part of correctness.

> **Practice — Foundation:** Target \(f(x)=6x(1-x)\) on \([0,1]\), proposal \(q=\operatorname{Uniform}(0,1)\), and \(M=1.5\). Decide acceptance for \((x,u)=(0.5,0.9)\) and \((0.1,0.5)\).
>
> **Hint:** Accept when \(u\le f(x)/(Mq(x))\); \(f(0.5)=1.5\) and \(f(0.1)=0.54\).
>
> **Practice — Core:** Prove that an accepted rejection-sampling proposal has density \(f\), and compute the acceptance rate for the \(f(x)=6x(1-x)\), \(M=1.5\) example.
>
> **Hint:** \(P(X\in dx,\text{accept})=q(x)\frac{f(x)}{Mq(x)}dx=f(x)dx/M\); divide by \(P(\text{accept})=1/M\).
>
> **Practice — Stretch:** The bimodal target \(f(x)=1+\cos(4\pi x)\) on \([0,1]\) is sampled with a uniform proposal. Give the smallest valid \(M\) and its acceptance rate, then find the fraction of \([0,1]\) where the envelope fails if someone uses \(M=1.5\).
>
> **Hint:** Validity needs \(M\ge\max f=2\); the \(M=1.5\) envelope fails where \(\cos(4\pi x)>0.5\).

## 10. Variance reduction changes the simulation design

Monte Carlo accuracy can improve without simply increasing independent draw count.

### Antithetic sampling

If \(U\sim\operatorname{Uniform}(0,1)\), pair \(U\) with \(1-U\). For monotone integrands, their errors are often negatively correlated.

### Control variates

If \(E[C]=\mu_C\) is known, estimate

$$
\hat\mu_{\mathrm{cv}}
=
\bar Y-c(\bar C-\mu_C).
$$

Its variance is minimized at

$$
c^*=\frac{\operatorname{Cov}(Y,C)}{\operatorname{Var}(C)}.
$$

Estimating \(c\) from the same simulation adds uncertainty that should be included or separated by a pilot run.

### Stratified and Latin hypercube sampling

Force samples across regions of the input space rather than allowing random gaps. Weight regional estimates by their probability mass.

### Quasi-Monte Carlo

Low-discrepancy deterministic points fill a unit cube more evenly than iid uniforms. Error theory differs from ordinary Monte Carlo; randomized constructions can restore replication-based uncertainty.

**Worked example — paired model simulation.** Evaluating two systems on the same sampled scenarios estimates their difference with variance

$$
\operatorname{Var}(A-B)
=\operatorname{Var}(A)+\operatorname{Var}(B)-2\operatorname{Cov}(A,B).
$$

Common random numbers create positive covariance and can greatly reduce comparison variance.

> **Practice — Foundation:** To estimate \(E[U^2]=1/3\) with \(U\sim\operatorname{Uniform}(0,1)\), compute \(\operatorname{Cov}(U^2,(1-U)^2)\), then the variance of the antithetic pair average and of the average of two iid draws.
>
> **Hint:** \(E[U^2(1-U)^2]=\int_0^1u^2(1-u)^2du=1/30\) and \(\operatorname{Var}(U^2)=1/5-1/9\).
>
> **Practice — Core:** Derive the optimal control-variate coefficient, then compute it for \(Y=e^U\) with control \(C=U\) (\(E[C]=1/2\)), together with the fraction of \(\operatorname{Var}(Y)\) removed.
>
> **Hint:** \(\operatorname{Cov}(e^U,U)=E[Ue^U]-(e-1)/2\) with \(\int_0^1ue^udu=1\), and \(\operatorname{Var}(U)=1/12\).
>
> **Practice — Stretch:** A simulator on \([0,1]^{50}\) is \(f(x)=x_1+x_2+0.01\sum_{j=3}^{50}x_j\). Compute \(\operatorname{Var}f(X)\) and the iid Monte Carlo variance with \(n=100\), then explain why Latin hypercube sampling removes most of this variance for an additive \(f\), and what randomized QMC adds.
>
> **Hint:** Coordinates are independent with variance \(1/12\) each, so \(\operatorname{Var}f=(1+1+48\times10^{-4})/12\); LHS stratifies every one-dimensional margin.

## 11. Active and adaptive sampling must record selection probabilities

An active learner chooses which examples to label using current model uncertainty. An adaptive evaluator allocates more samples to promising or risky regions. These strategies can save labels or concentrate safety discovery, but the observed labeled set no longer follows the original population distribution.

At time \(t\), let selection probability

$$
\pi_t=P(I_t=1\mid\mathcal H_{t-1},X_t)
$$

depend on recorded history and current covariates. Inverse-probability or doubly robust estimators can target a population mean if probabilities are known, positive, and the adaptive dependence is handled. Selecting with zero probability makes that region unidentifiable from observed labels.

Model uncertainty is not itself an inclusion probability. A heuristic ranking must be randomized or otherwise modeled if design-based correction is desired.

**Worked example — safety red teaming.** Oversampling prompts likely to elicit failures improves failure discovery. The raw failure fraction then estimates the red-team mixture, not deployment prevalence. Retain known sampling probabilities or combine a probability deployment sample for prevalence with targeted samples for taxonomy and stress testing.

> **Practice — Foundation:** A pool has 900 easy items (error 0.02) and 100 hard items (error 0.5). An active learner labels exactly the 100 hard items. Compute the error rate of the labeled set and the population error rate.
>
> **Hint:** The population rate is \(0.9(0.02)+0.1(0.5)\); the labeled set contains only the hard stratum.
>
> **Practice — Core:** Item \(t\) is labeled with logged probability \(\pi_t=0.8\) if the model is uncertain and 0.1 otherwise. The labeled uncertain items have losses \((1,0,1)\) and the labeled certain items \((0,1)\). Write each inverse-probability contribution and the estimated total loss.
>
> **Hint:** Divide each labeled loss by its \(\pi_t\); \(E[I_t/\pi_t\mid\mathcal H_{t-1},X_t]=1\) gives unbiasedness.
>
> **Practice — Stretch:** From 1,000,000 prompts, 500 uniform-random labels find 5 failures, and 500 targeted labels find 200 failures. Estimate prevalence and its SE from the probability sample, compute the naive pooled rate, and explain how logging targeted \(\pi\) would let both streams be combined.
>
> **Hint:** The prevalence estimate uses only the uniform stream: \(5/500\) with SE \(\sqrt{0.01(0.99)/500}\); the raw pooled rate is \(205/1000\).

## 12. Dataset splits must separate the dependence that matters

A random row split is valid only when rows are exchangeable and future use resembles another row from the same population. Common alternatives are:

- **group split:** keep all rows from one user, patient, document, task, or entity together;
- **time split:** train on the past and evaluate on later observations;
- **geographic or domain split:** test transfer to held-out environments;
- **leave-one-group-out:** approximate generalization to a new group;
- **nested split:** place model and hyperparameter selection inside an outer evaluation split.

Leakage occurs whenever information unavailable at prediction time crosses into training or selection. It includes more than duplicate rows:

- fitting normalization or vocabulary on the full dataset;
- selecting features using test labels;
- splitting passages from the same document across train and test;
- using future observations to construct past predictors;
- tuning prompts or thresholds against test outcomes;
- choosing the reported metric after seeing all results.

Every data-dependent transformation belongs inside the training fold. A pipeline evaluated by cross-validation must refit preprocessing, feature selection, calibration, and model selection separately within each fold.

**Worked example — conversation leakage.** Splitting messages randomly lets the same conversation appear in train and test. Style, user identity, and earlier context make rows dependent. A conversation-level split estimates transfer to new conversations; a user-level split asks the harder question of transfer to new users.

> **Practice — Foundation:** A feature has training values \((1,2,3)\) and test value \(10\). Compute the centering mean when a scaler is fit on training rows only and when it is fit on all four rows, and explain the leak.
>
> **Hint:** The training-only mean is 2; including the test value moves it to 4, so test information enters the training features.
>
> **Practice — Core:** Choose row, document, user, or time splitting for: (a) a spam filter for new users next month, (b) an OCR model for new multi-page documents from known scanners, (c) a weekly demand forecast.
>
> **Hint:** Match the split to what is new at prediction time: new users and a later month, new documents, a later week.
>
> **Practice — Stretch:** A nested evaluation has 5 outer folds and 4 inner folds and searches 3 feature sets × 4 models × 5 thresholds. Count the model fits per outer fold and in total, and state which data each selection step may see.
>
> **Hint:** The inner search fits 60 configurations × 4 folds, plus one refit of the winner on the outer training data.

## 13. Seeds sample some randomness but not all uncertainty

An ML result may vary across:

- sampled training data;
- initialization and minibatch order;
- hyperparameter search;
- checkpoints;
- test items and tasks;
- stochastic outputs;
- raters;
- systems and hardware.

Repeated seeds usually vary initialization and training order while holding the dataset, architecture family, research decisions, and benchmark fixed. Seed-to-seed standard error therefore does not measure uncertainty over new tasks or data.

A conceptual crossed decomposition is

$$
Y_{s,t,i}
=
\mu+A_s+B_t+C_{st}+\varepsilon_{sti},
$$

where \(s\) indexes seed, \(t\) task, and \(i\) item. Whether each term is fixed or random depends on the intended generalization.

**Worked example — five seeds on one benchmark.** The mean across seeds estimates average performance over the implemented seed distribution conditional on that benchmark and training dataset. Treating all seed-item predictions as iid exaggerates information because every seed sees the same items and every item is scored by all seeds.

> **Practice — Foundation:** Five seeds on a fixed benchmark give accuracies \((0.81,0.83,0.80,0.84,0.82)\). Compute the mean, SD, and seed SE, and name what the seeds changed and what stayed fixed.
>
> **Hint:** The SD uses denominator 4; the seed SE is \(\text{SD}/\sqrt5\).
>
> **Practice — Core:** In \(Y_{st}=\mu+A_s+B_t+\varepsilon_{st}\), take \(\operatorname{Var}(A)=0.0004\), \(\operatorname{Var}(B)=0.01\), and \(\operatorname{Var}(\varepsilon)=0.0025\). For \(S=5\) seeds and \(T=10\) tasks, compute the variance of the grand mean for new seeds on fixed tasks and for new seeds and new tasks.
>
> **Hint:** Each random term's variance is divided by the number of distinct levels averaged over: \(\sigma_A^2/S\), \(\sigma_B^2/T\), \(\sigma_\varepsilon^2/(ST)\).
>
> **Practice — Stretch:** In a fully crossed 4-seed × 6-task design with one run per cell, the mean squares are \(\mathrm{MS}_{\mathrm{seed}}=0.02\), \(\mathrm{MS}_{\mathrm{task}}=0.05\), and \(\mathrm{MS}_{\mathrm{res}}=0.002\). Estimate \(\sigma_A^2\), \(\sigma_B^2\), and \(\sigma_\varepsilon^2\).
>
> **Hint:** With one observation per cell, \(E[\mathrm{MS}_{\mathrm{seed}}]=\sigma_\varepsilon^2+T\sigma_A^2\) and \(E[\mathrm{MS}_{\mathrm{task}}]=\sigma_\varepsilon^2+S\sigma_B^2\).

## 14. Metric aggregation defines the estimand

Micro-averaging pools all rows. Macro-averaging gives each group equal weight. A deployment-weighted average uses target mixture weights. None is universally correct.

Nonlinear metrics require additional care:

- average of ratios differs from ratio of totals;
- F-scores couple precision and recall;
- maxima and worst-group metrics are selection-sensitive;
- quantiles have tail-specific uncertainty;
- pass-at-\(k\) depends on a defined repeated-generation process;
- token-average loss weights long sequences more heavily than document-average loss.

Write the estimand as an equation before computing it. For domain means \(\mu_h\):

$$
\mu_W=\sum_hW_h\mu_h.
$$

Changing \(W_h\) changes the question, not merely presentation.

**Worked example — task macro versus item micro.** Model A excels on one enormous easy task and loses slightly on nine small tasks. It can win the item-micro average and lose the task-macro average. Neither ranking is contradictory; they target different populations of items or tasks.

> **Practice — Foundation:** Task 1 has 90/100 correct and task 2 has 5/10, with deployment weights 0.3 and 0.7. Compute micro, macro, and deployment-weighted accuracy.
>
> **Hint:** Micro pools counts, \(95/110\); macro averages 0.9 and 0.5 equally.
>
> **Practice — Core:** Model A scores 0.95 on a 1,000-item task and 0.60 on two 10-item tasks; model B scores 0.90 on all three. Compute micro and macro accuracy for both models and state which wins under each.
>
> **Hint:** Micro weights tasks 1000:10:10, macro weights them equally.
>
> **Practice — Stretch:** System A has 80% of requests under 500 ms, 90% correct, and 70% both; system B has 75% fast, 85% correct, and 72% both. Show that marginal comparisons favor A, while the estimand \(P(\text{fast and correct})\) favors B.
>
> **Hint:** The joint rate is not determined by the two marginal rates, so separate tests of speed and quality cannot answer the joint question.

## 15. Evaluation uncertainty should replay the claimed generalization

For two systems evaluated on common items, use paired differences. For tasks containing items, a hierarchical bootstrap can:

1. resample tasks if generalizing to new tasks;
2. resample paired items inside each selected task if generalizing to new items;
3. preserve both systems' results on each item;
4. recompute the complete metric and aggregation.

If tasks are fixed, do not resample them to imply a task superpopulation. If items exhaust a finite benchmark, an FPC can describe that finite list, but a future-item or future-task claim needs a broader population model.

For stochastic generators, repeated outputs within one prompt estimate conditional output variability. They do not increase the number of independent prompts. For human raters, preserve assignment blocks and model rater effects or resample at the relevant rater and item units.

**Worked example — win rate with ties.** Resampling individual model outputs separately breaks prompt pairing. Resample the prompt record containing both outputs and the judge result. If multiple judges rate each pair, decide whether the target averages over this fixed panel or predicts a new rater.

> **Practice — Foundation:** On four items, model A is correct on \((1,1,0,0)\) and model B on \((1,1,1,0)\). Compute the paired mean difference and its SE, and compare with the unpaired SE.
>
> **Hint:** Form the per-item differences \((0,0,1,0)\) first; the paired SE is \(\mathrm{SD}(d)/\sqrt4\).
>
> **Practice — Core:** Three fixed tasks have 50 prompts each, with task mean differences \((0.10,0.02,-0.03)\). Specify a bootstrap for new prompts within the fixed tasks and another for new tasks, and give the between-task SE that the new-task bootstrap approximates.
>
> **Hint:** The new-task bootstrap resamples the three task records first; its SE is dominated by \(\mathrm{SD}(\text{task means})/\sqrt3\).
>
> **Practice — Stretch:** Three raters score all 100 prompts, with rater variance 0.04, prompt variance 0.09, and residual variance 0.25. Compute the variance of the grand mean under the crossed model and compare it with the value from treating all 300 ratings as iid.
>
> **Hint:** Crossed: \(\sigma_r^2/R+\sigma_p^2/P+\sigma_e^2/(RP)\); flat iid: total variance divided by 300.

## 16. Adaptive selection expands the analysis family

The final reported result may have been selected across:

- datasets and filters;
- architectures and checkpoints;
- hyperparameters and prompts;
- seeds;
- metrics and thresholds;
- subgroups;
- stopping times;
- plotting and exclusion choices.

An untouched test set evaluates the chosen pipeline only if no test information influenced selection. Repeatedly checking the same set converts it into development data even when labels remain hidden behind a leaderboard.

Nested evaluation repeats selection inside each outer training sample. Selective inference, reusable-holdout methods, sequentially valid tests, or a fresh confirmation sample address other workflows. None creates information about populations missing from the frame.

**Worked example — best seed reporting.** Selecting the highest of 20 noisy seed scores and attaching a standard error as though the seed were prespecified ignores the maximum operation. The valid repeated experiment must rerun all 20 seeds and reselect the winner, or the estimand must instead average over seeds.

> **Practice — Foundation:** List four choices that belong to an ML analysis family, and count the family for 3 checkpoints, 4 prompt templates, 2 metrics, and 5 seeds.
>
> **Hint:** The family size multiplies the option counts.
>
> **Practice — Core:** Nested cross-validation uses 5 outer folds, 3 inner folds, and 10 hyperparameter settings. Count the model fits and explain how the outer estimate includes the selection step.
>
> **Hint:** Each outer fold runs its own \(10\times3\) inner search plus one refit, so selection is repeated as part of every evaluation replicate.
>
> **Practice — Stretch:** Every one of \(K\) configurations has true accuracy 0.80 and a validation score \(0.80+\mathcal N(0,0.01^2)\). Compute the expected optimism of the best score for \(K=1,10,100\), then confirm it by simulation with seed 0 and 10,000 replications.
>
> **Hint:** Optimism is \(0.01\,E[\max\text{ of }K\text{ standard normals}]\), about \(1.54\) for \(K=10\) and \(2.51\) for \(K=100\).

## 17. Benchmark contamination is dependence, not only duplication

Direct train-test duplication is the clearest contamination, but dependence can be subtler:

- paraphrases or translations of test items appear in training;
- solutions, explanations, or answer keys are present;
- benchmark authors publish development examples that shape methods;
- repeated leaderboard feedback tunes the research community;
- synthetic training data are generated by a model exposed to the benchmark;
- the benchmark is chosen because preliminary performance looked favorable.

Contamination changes the interpretation of performance. The score may measure retrieval or adaptation to a known benchmark rather than generalization to unseen tasks.

Auditing uses provenance, time, semantic similarity, memorization probes, held-out canaries, and comparison with newly collected data. Each method has false positives and false negatives. Absence of detected overlap is not proof of independence.

**Worked example — benchmark saturation.** Even if a final model's training corpus has no exact test rows, years of public optimization against the benchmark can make architectures, prompts, and preprocessing benchmark-specific. Community-level adaptive reuse narrows the meaning of the test set.

> **Practice — Foundation:** A 1,000-item test set has 20 items found verbatim in training data and 50 found as paraphrases. Classify each kind and compute the exact, semantic, and total contamination rates.
>
> **Hint:** Exact means a string match after normalization; semantic means the same problem with a different surface form.
>
> **Practice — Core:** A model's training cutoff is June 2024. Benchmark items were released in January 2023 (400 items, accuracy 0.85), March 2024 (300, 0.80), and September 2024 (300, 0.62). Compute accuracy on pre-cutoff and post-cutoff items and design a temporal provenance audit.
>
> **Hint:** Pool the two pre-cutoff batches: \((340+240)/700\); compare with the post-cutoff batch.
>
> **Practice — Stretch:** Fifty teams each have true accuracy 0.70. Each team submits 20 variants to a public leaderboard of 500 items and keeps its best public score. Estimate the expected inflation of a team's best public score, and explain how this overfits without anyone seeing hidden labels.
>
> **Hint:** Each public score has SE \(\sqrt{0.21/500}\approx0.0205\), and \(E[\max\text{ of }20\text{ standard normals}]\approx1.87\).

## 18. Distribution shift changes either inputs, outcomes, or their relationship

Let source distribution be \(P_S(X,Y)\) and deployment target be \(P_T(X,Y)\).

- **Covariate shift:** \(P_S(X)\neq P_T(X)\) but \(P_S(Y\mid X)=P_T(Y\mid X)\).
- **Label shift:** \(P_S(Y)\neq P_T(Y)\) but \(P_S(X\mid Y)=P_T(X\mid Y)\).
- **Concept shift:** \(P_S(Y\mid X)\neq P_T(Y\mid X)\).

![Training, benchmark, and deployment distributions can overlap while still targeting meaningfully different populations.](../assets/evaluation-distribution-shift.svg)

Covariate-shift weighting cannot repair concept shift. Label-shift correction depends on stable class-conditional features and identifiable confusion behavior. No weighting method extrapolates reliably into target regions with no source overlap.

Detect shift with domain classifiers, density-ratio diagnostics, feature and label summaries, subgroup metrics, and predictive residuals. Detection is easier than proving performance stability: small measured input shift can hide a large change in rare, decision-critical regions.

**Worked example — policy-induced shift.** Deploying a refusal model changes which users continue interacting and which prompts arrive later. The system affects its own future input distribution. A static benchmark sampled before deployment cannot capture this feedback without an explicit longitudinal or causal model.

> **Practice — Foundation:** Classify each change as covariate, label, or concept shift: (a) more night-time photos with the same labeling rule; (b) flu prevalence rises from 5% to 20% with stable symptoms given flu; (c) the definition of spam is changed.
>
> **Hint:** Check which of \(P(X)\), \(P(Y)\) with stable \(P(X\mid Y)\), or \(P(Y\mid X)\) changes.
>
> **Practice — Core:** The source has \(X\sim\operatorname{Uniform}(0,1)\) and the target \(X\sim\operatorname{Uniform}(0,2)\). State the invariance and overlap assumptions for covariate-shift weighting, and compute the target mass that has no source overlap.
>
> **Hint:** \(w(x)=p_T(x)/p_S(x)\) is undefined where \(p_S(x)=0\), here for \(x\in(1,2]\).
>
> **Practice — Stretch:** Borderline prompts are 20% of traffic. The model refuses 60% of them, and refused users leave with probability 0.5; other users always return. Compute next month's borderline share and propose an evaluation that measures this feedback.
>
> **Hint:** Borderline retention is \(1-0.6\times0.5=0.7\); multiply each group's mass by its retention and renormalize.

## 19. A rigorous ML evaluation protocol

Before collection:

1. define deployment population, frame, unit, and estimand;
2. identify strata, clusters, time order, and interference groups;
3. choose a probability or justified purposive sample;
4. record inclusion and response probabilities where weighting is planned;
5. predeclare primary metrics, aggregation weights, comparisons, and stopping;
6. separate training, selection, calibration, and confirmation data;
7. plan sample sizes across every claimed random axis.

During collection:

1. preserve pairing and cluster identifiers;
2. log selection, assignment, response, exclusions, versions, and timestamps;
3. blind human assessment where possible;
4. monitor coverage gaps and missingness without silently changing the estimand;
5. quarantine test feedback from development.

After collection:

1. calculate effects and uncertainty using the design;
2. apply finite-population, weight, cluster, and multiplicity adjustments where justified;
3. report subgroup, tail, and sensitivity analyses;
4. quantify seed, task, item, output, and rater variation separately;
5. audit contamination and shift;
6. state unsupported populations and likely failure modes;
7. preserve enough provenance to reproduce the sampling path.

> **Practice — Foundation:** Turn "model B is better (60% win rate over A on 500 internal prompts)" into a population, estimand, and sampling statement, and compute the SE of the win rate.
>
> **Hint:** The win rate is a proportion over prompts, with SE \(\sqrt{p(1-p)/n}\).
>
> **Practice — Core:** A protocol samples 2,000 prompts from last month's logs, tunes a decision threshold on the same 2,000, and reports accuracy 0.80 with a 95% CI of \(\pm0.02\). Identify the first validity break in the three phases above, and compute the correct iid half-width \(1.96\sqrt{0.8(0.2)/2000}\).
>
> **Hint:** Walk the phases in order; tuning on the evaluation data breaks the requirement to separate selection and confirmation data.
>
> **Practice — Stretch:** An agent serves three languages with traffic shares \((0.6,0.3,0.1)\). A monthly budget of 1,200 labels allocates 900 to a probability sample with at least 150 per language and 300 to targeted safety search. Compute the allocation and the relative weights \(W_h/(n_h/n)\), and explain how the targeted labels stay out of prevalence estimates.
>
> **Hint:** Give the smallest language its minimum first, split the remaining 750 in proportion 0.6:0.3, then divide population shares by sample shares.

## 20. Runnable labs

This chapter has three coding exercises. Each appears as a separate tab in the lesson's right-hand Python workspace.

### Lab A — stratified finite-population mean

Implement **stratified_mean_standard_error** in [labs/exercises.py](../../labs/exercises.py). Given mappings from stratum names to observed finite values and known population sizes, return:

1. the population-weighted mean estimate;
2. its design standard error using within-stratum sample variances and finite-population corrections.

Run:

~~~text
python -m labs.checks stratified
~~~

The checks cover disproportionate sampling, census strata, generators, constant strata, input preservation, and invalid designs.

### Lab B — Horvitz–Thompson estimation

Implement **horvitz_thompson** in [labs/exercises.py](../../labs/exercises.py). Given observed values, their first-order inclusion probabilities, and known population size, return the estimated population total and mean.

Run:

~~~text
python -m labs.checks horvitz-thompson
~~~

The checks cover equal and unequal probabilities, census inclusion, scale behavior, generators, input preservation, and invalid probabilities.

### Lab C — generic rejection sampler

Implement **rejection_sample** in [labs/exercises.py](../../labs/exercises.py). Given a proposal callable that accepts a local random generator, an acceptance-probability callable, desired draw count, seed, and maximum attempts, return:

1. accepted finite values;
2. attempts used;
3. realized acceptance rate.

Run:

~~~text
python -m labs.checks rejection
~~~

The checks cover deterministic and partial acceptance, reproducibility, local random state, exhausted attempt budgets, callback validation, and invalid settings.

### Guided experiment

1. Simulate SRSWOR at several sampling fractions and verify the finite-population correction.
2. Compare proportional, equal, and Neyman stratum allocation under heterogeneous variances.
3. Increase intracluster correlation and compare naive row uncertainty with cluster-aware uncertainty.
4. Simulate unequal-probability designs and measure Horvitz–Thompson bias and weight-driven variance.
5. Vary rejection envelopes and compare correctness with acceptance efficiency.
6. Construct a benchmark mixture where micro, macro, and deployment-weighted rankings disagree.
7. Add covariate then concept shift and test when importance weighting succeeds or fails.

## 21. Derivations to own

1. Derive first- and second-order inclusion probabilities under SRSWOR.
2. Derive unbiasedness and finite-population variance of the sample mean.
3. Derive the stratified mean and variance estimator.
4. Derive proportional and Neyman allocation under equal costs.
5. Derive the cluster design-effect approximation from intraclass correlation.
6. Multiply conditional probabilities in a multistage inclusion design.
7. Prove Horvitz–Thompson design unbiasedness.
8. Distinguish Horvitz–Thompson inclusion weights from Hansen–Hurwitz draw weights.
9. Derive combined sampling-and-response weights.
10. Derive the covariate-shift importance identity.
11. Prove rejection sampling produces the target conditional density.
12. Derive the optimal control-variate coefficient.
13. Expand a crossed seed-by-task variance decomposition.
14. Specify a hierarchical resampling distribution matching an AI generalization claim.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-sampling
```

## 22. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–6. Reconstruct sampling designs and direct estimators.

**A1 · Foundation · paper — Population map.** Identify target, frame, unit, sample, response mechanism, and estimand for: (a) satisfaction among next month's production users sampled from request logs, (b) safety failure prevalence among public web prompts found by keyword search, and (c) mean accuracy across future customer domains estimated from 12 launch partners. For each, name one coverage failure.

**A2 · Foundation · paper — SRSWOR.** For the finite population \(y=(2,4,7,9,13)\), enumerate all size-two samples without replacement, verify equal sample probability and \(\pi_i=2/5\), and calculate the exact sampling distribution and variance of \(\bar Y_s\). For sample \(\{4,13\}\), calculate the usual finite-population standard-error estimate.

**A3 · Foundation · paper — Strata.** Two strata have \((N_1,N_2)=(800,200)\), \((n_1,n_2)=(80,50)\), sample means \((0.70,0.40)\), and sample variances \((0.21,0.24)\). Estimate the population mean and its design standard error with finite-population corrections. Compare with the unweighted mean of stratum means.

**A4 · Foundation · paper — Clusters.** Calculate \(1+(m-1)\rho\) and effective sample size \(n/\mathrm{DEFF}\) for total \(n=1{,}000\), cluster sizes \(m=5,25,100\), and \(\rho=0,0.05,0.20\). Explain the limiting behavior as \(m\) grows.

**A5 · Foundation · paper — Weights.** Units with values \((10,20,40)\) are observed with inclusion probabilities \((0.5,0.25,0.2)\). Compute their Horvitz–Thompson contribution to the population total. If the known population size is 10, compute the corresponding mean estimate and explain which randomness the weights correct.

**A6 · Foundation · paper — Rejection sampling.** Target \(f(x)=2x\) on \([0,1]\) using \(q(x)=1\) and \(M=2\). Verify the envelope and acceptance probability. Trace proposals \(x=(0.2,0.8,0.5)\) with uniforms \(u=(0.1,0.9,0.4)\), accepting when \(u\le f(x)/(Mq(x))\).

### Core — problems 7–13. Design and analyze realistic sampling workflows.

**A7 · Core · paper — Allocation.** Three strata have \(N=(6000,3000,1000)\), SDs \(S=(0.2,0.4,0.5)\), and per-label costs \(c=(1,1,4)\). Ignoring FPCs, compute the allocation and the variance \(\sum_hW_h^2S_h^2/n_h\) of the stratified mean for (a) proportional allocation with \(n=1000\), (b) Neyman allocation with \(n=1000\), (c) Neyman with at least 200 labels in stratum 3 and \(n=1000\), and (d) cost-optimal allocation \(n_h\propto N_hS_h/\sqrt{c_h}\) under a budget of 1,600 cost units. Also compute proportional allocation under the same 1,600-unit budget.

**A8 · Core · paper — Multistage sample.** From 10 organizations, select 2 by SRS: org A (100 users) and org B (40 users). Within each org, select 2 users by SRS, and within each selected user select 1 conversation by SRS. The selected users have conversation counts and sampled satisfaction scores: a1 (10 conversations, score 4), a2 (30, score 2), b1 (20, score 5), b2 (5, score 3). Derive each sampled conversation's inclusion probability and weight, the HT estimate of the total score, the estimated number of conversations \(\hat N=\sum w\), the Hájek mean, and the HT mean if \(N=12{,}000\) is known. Compare with the unweighted mean.

**A9 · Core · paper — Nonresponse.** From 10,000 users, 400 are sampled by SRS (\(\pi=0.04\)): 300 on the free plan and 100 on the paid plan. Of these, 150 free users respond with mean satisfaction 3.0 and 80 paid users respond with mean 4.0. Compute (a) the respondent mean, (b) the mean using combined weights \(1/(\pi\hat r_{\mathrm{plan}})\) with response propensities estimated by plan, and (c) a sensitivity analysis in which free-plan nonrespondents have mean \(3.0-\delta\) for \(\delta\in\{0,0.5,1\}\).

**A10 · Core · paper — Variance reduction.** Estimate \(I=E[e^U]=e-1\) for \(U\sim\operatorname{Uniform}(0,1)\) using 1,000 function evaluations: (a) plain Monte Carlo, (b) 500 antithetic pairs \((U,1-U)\), and (c) a control variate \(C=U\) with the optimal coefficient. Derive each estimator's variance analytically, then confirm with 2,000 repeated simulations (seed 0).

**A11 · Core · paper — Active labels.** A pool of 10,000 items has 1,000 with model uncertainty \(u>0.8\) and 9,000 below. The policy requests each label independently with logged probability \(\pi=0.5\) if \(u>0.8\) and \(\pi=0.02\) otherwise. It labels 510 high-uncertainty items (204 errors) and 171 low-uncertainty items (5 errors). Compute the naive labeled error rate, the HT estimate of the population error rate with its SE \(\big(\sum_{\text{labeled}}(1-\pi_i)y_i^2/\pi_i^2\big)^{1/2}/N\), and explain why \(\pi>0\) for every item is essential.

**A12 · Core · paper — Leakage-safe split.** Data cover 200 users over 12 months (January–December); the deployment serves new users next month. Design an outer split that holds out 40 users' December rows, with 4-fold user-grouped inner CV on the remaining users' January–November rows to choose among 6 hyperparameter settings. The pipeline learns a vocabulary, a feature scaler, and a probability calibrator. State (a) where each learned transformation is fit, (b) how many model fits occur, and (c) which rows are used by neither training nor testing and why.

**A13 · Core · paper — Evaluation uncertainty.** Paired differences (system B minus A) on 4 tasks × 3 prompts are: task 1 \((0.2,0.1,0.3)\), task 2 \((0,-0.1,0.1)\), task 3 \((0.4,0.3,0.5)\), task 4 \((-0.2,-0.1,0)\). Compute the mean difference and its SE under (a) treating the 12 values as iid, (b) new prompts within these fixed tasks (stratified by task, equal task weights), and (c) new tasks (between-task variation). Say which resampling scheme each SE corresponds to.

### Stretch — problems 14–21. Diagnose selection, contamination, and shift in research-scale evaluations.

**A14 · Stretch · paper — Weight instability.** Under independent (Poisson) sampling, a population of 1,000 has 990 units with \(y=1\) and \(\pi=0.1\) and 10 rare units with \(y=50\) and \(\pi=0.005\). Compute the true total, the HT variance \(\sum_i(1-\pi_i)y_i^2/\pi_i\), the probability that no rare unit is sampled and the estimate in that event, and the bias, SD, and RMSE after trimming weights at 50. Compute the Kish ESS \((\sum w)^2/\sum w^2\) for a realized sample of 99 common units and 1 rare unit.

**A15 · Stretch · paper — Convenience-data limits.** A web sample is 80% young (mean outcome 0.7) and 20% old (mean 0.4), and the population is 50/50. Compute the age-reweighted estimate. Now suppose an unrecorded trait \(H\) (enthusiast) makes up 90% of the sample in both age groups but only 30% of young and 10% of old people in the population. Young: \(H\) mean 0.75, non-\(H\) mean 0.25. Old: \(H\) mean 0.42, non-\(H\) mean 0.22. Verify that the sample cell means are reproduced, compute the true population mean, and explain why age calibration cannot fix the gap.

**A16 · Stretch · paper — Adaptive safety search.** Weekly traffic is 1,000,000 prompts, and a classifier flags 5% of them. Stream 1 is a uniform sample of 2,000 prompts, with 6 failures. Stream 2 is a stratified design: 500 random flagged prompts (30 failures) and 500 random unflagged prompts (0 failures). Estimate prevalence with an SE from stream 1, form the stratified estimate from stream 2, give a rule-of-three upper bound for the unflagged stratum, and compare with the naive pooled rate across all 3,000 labels.

**A17 · Stretch · paper — Seed fallacy.** In \(Y_{st}=\mu+A_s+B_t+\varepsilon_{st}\), take \(\sigma_A=0.01\), \(\sigma_B=0.05\), \(\sigma_\varepsilon=0.02\), and \(T=8\) fixed tasks. Compute the SE of the grand mean for \(S=5\), \(S=20\), and \(S\to\infty\) seeds under the fixed-task estimand and under the new-task estimand, and show that the new-task SE has a floor no seed count can remove.

**A18 · Stretch · paper — Benchmark reuse.** A leaderboard's public split has 1,000 items. Fifty teams each have true accuracy 0.75, and each submits 10 variants with independent public-score noise. Compute the expected best public score per team, the expected top public score across all 500 variants, and the expected private-split score of that top variant.

**A19 · Stretch · paper — Contamination audit.** Of 1,000 test items, exact matching flags 30 and semantic similarity flags 120 more. A manual check of 40 randomly chosen semantic flags confirms 24 as true paraphrases. Accuracy is 0.97 on exact-flagged items, 0.85 on semantic-flagged items, and 0.70 on the 850 unflagged items. Estimate the number of contaminated items with an SE (with and without an FPC over the 120 flags), the overall accuracy, and the clean accuracy, and state what this audit cannot detect.

**A20 · Stretch · paper — Shift failure.** Let \(X\in\{0,1\}\) with source \(P_S(X=1)=0.2\) and target \(P_T(X=1)=0.7\), and source accuracy \(P(\text{correct}\mid X=0)=0.9\), \(P(\text{correct}\mid X=1)=0.5\). (a) Under covariate shift, compute the source accuracy, the importance weights, the weighted estimate, and the true target accuracy. (b) Keep the same \(P_T(X)\) but let the target have \(P(\text{correct}\mid X=1)=0.3\) (concept shift). Compute the weighted estimate and the true target accuracy.

**A21 · Stretch · paper — Complete protocol.** An assistant serves 30 enterprise organizations with about 600,000 conversations per quarter. The quarterly budget is 3,000 labels: 2,400 for a probability sample (12 organizations drawn with probability proportional to traffic, then 200 conversations each by SRS) and 600 for targeted safety search. Compute the conversation inclusion probability and weight, and the DEFF and effective sample size for \(\rho=0.05\). Then specify the population, frame, estimand, random axes and uncertainty method, the handling of nonresponse, contamination and temporal checks, and the deployment decision rule.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** Why must an evaluation state its estimand and sampling frame?

**K2 · Core · gate — Derivation.** Derive a two-stratum target mean.

**K3 · Core · gate — Calculation.** Group accuracies are 0.9 and 0.3; the target assigns 0.25 to the first group. Find target accuracy.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-sampling experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Will more observations remove bias from an unrepresentative sampling frame?

**K6 · Stretch · gate — RE/RS transfer.** Write a replayable evaluation protocol for task and seed variation.

## Mastery check

Given an unfamiliar dataset or evaluation, define its target population and frame; reconstruct inclusion and response mechanisms; choose and derive a sampling estimator; account for strata, clusters, stages, and finite-population structure; implement or diagnose computational sampling; identify leakage and adaptive selection; quantify every claimed random axis; audit contamination and distribution shift; and limit conclusions to the population that the design actually represents.

The next unit develops [exponential families, statistical regression, GLMs, and partial pooling](11-exponential-families-regression-glms.md), using these sampling and evaluation tools throughout.
