---
id: math.statistics.resampling-sequential-experimental-design
title: Bootstrap, permutation tests, sequential inference, and experimental design
prerequisites: [math.statistics.hypothesis-testing-confidence-power]
estimated_hours: 36
---

# Bootstrap, permutation tests, sequential inference, and experimental design

The previous chapter calibrated tests from probability models. But real estimators may be nonlinear, analytic standard errors may be unavailable, observations may arrive over time, and experiments may use assignment structures that a generic formula cannot see.

This chapter develops three responses:

- **resampling** approximates repeated datasets using the structure of the observed data or experimental assignment;
- **sequential inference** remains valid when evidence is monitored over time;
- **experimental design** creates trustworthy comparisons before any test is calculated.

The unifying question is: **what could legitimately have varied?** A bootstrap varies sampled units. A permutation test varies assignments or labels permitted by a null. A sequential method varies the stopping time. A randomized experiment varies treatment assignment. Each method is only as valid as that variation story.

By the end, you should be able to construct and diagnose bootstrap distributions; choose row, paired, stratified, cluster, or block resampling; derive exact and Monte Carlo permutation tests; connect randomization inference to an assignment mechanism; explain why ordinary repeated peeking fails; calculate likelihood-ratio e-values and anytime p-values; interpret confidence sequences; and design blocked, paired, factorial, or cluster-randomized experiments for AI systems.

## 0. Repeated sampling is the target

An estimator \(\hat\theta=T(X_1,\ldots,X_n)\) has a sampling distribution across fresh datasets from the target population. Standard errors, bias, intervals, and tests are summaries of that distribution.

Sometimes an exact sampling law is known. A Bernoulli count is binomial, and a Gaussian mean has familiar formulas. But consider:

- the median of a skewed latency distribution;
- the maximum error across safety categories;
- a ratio of two noisy metrics;
- an accuracy difference with prompts nested in tasks;
- a model selected from many checkpoints.

Deriving a correct finite-sample distribution can be difficult or impossible. Resampling constructs hypothetical datasets using an estimated version of the original data-generating process.

That does not make resampling assumption-free. It moves assumptions into the resampling rule. Resampling rows asserts that rows are exchangeable sampling units. Resampling users asserts that users are the independent units. Shuffling treatment labels asserts that the chosen assignments would be equivalent under the null.

**Worked example — median latency.** The sample median is easy to compute but has a sampling distribution that depends on population density near the true median. A bootstrap can approximate its variability without explicitly estimating that density. It still fails if requests were serially dependent and individual requests are resampled as though independent.

> **Practice — Foundation:** Describe the repeated-sampling experiment whose distribution would quantify uncertainty in a sample mean.
>
> **Practice — Core:** Explain what assumption is introduced by resampling individual rows from a clustered dataset.
>
> **Practice — Stretch:** Give an estimator whose uncertainty depends strongly on rare observations. Predict when an observed-sample resampling method will underestimate its error.

## 1. The empirical distribution is a fitted population

Given observations \(x_1,\ldots,x_n\), the empirical distribution places probability \(1/n\) on each observed value:

$$
\hat P_n=\frac1n\sum_{i=1}^n\delta_{x_i},
$$

where \(\delta_{x_i}\) is a point mass at \(x_i\). Drawing \(n\) times independently from \(\hat P_n\) is equivalent to sampling the observed rows with replacement.

A **nonparametric bootstrap sample**

$$
X_1^*,\ldots,X_n^*\overset{\mathrm{iid}}{\sim}\hat P_n
$$

has the same size as the original sample. Repeated values are expected; omitted values are expected. Compute the estimator on that sample:

$$
\hat\theta^*=T(X_1^*,\ldots,X_n^*).
$$

Conditional on the observed data, the distribution of \(\hat\theta^*\) approximates the unknown sampling distribution of \(\hat\theta\).

![Bootstrap resampling treats the observed sample as an empirical population and repeatedly recomputes the estimator.](../assets/bootstrap-resampling.svg)

This is a plug-in argument. The unknown population \(P\) is replaced by \(\hat P_n\), then the repeated experiment is replayed under that fitted population.

> **Practice — Foundation:** Write the empirical probabilities assigned to values in the sample \(2,2,5,9\).
>
> **Practice — Core:** List all conceptual steps from one observed dataset to a bootstrap distribution of the median.
>
> **Practice — Stretch:** Explain why using bootstrap samples of size \(n/2\) changes the target distribution unless an additional scaling argument is supplied.

## 2. The bootstrap algorithm

For \(B\) resamples:

1. draw \(n\) indices independently and uniformly from \(1,\ldots,n\);
2. form a same-size sample using those indices;
3. compute \(\hat\theta_b^*\);
4. store the result.

The stored values approximate a conditional distribution given the observed dataset.

The bootstrap estimate of standard error is the sample standard deviation of the bootstrap estimates:

$$
\widehat{\operatorname{SE}}_{\mathrm{boot}}
=
\sqrt{
\frac{1}{B-1}
\sum_{b=1}^B
\left(\hat\theta_b^*-\bar{\hat\theta}^*\right)^2
}.
$$

The bootstrap estimate of bias is

$$
\widehat{\operatorname{bias}}_{\mathrm{boot}}
=\bar{\hat\theta}^*-\hat\theta.
$$

There are two distinct approximation errors:

- **statistical error:** \(\hat P_n\) differs from the population \(P\);
- **Monte Carlo error:** only \(B\) resamples approximate the exact bootstrap distribution.

Increasing \(B\) reduces the second error but cannot create population support missing from the observed sample.

**Worked example — sample mean.** For iid data, the bootstrap standard error of the sample mean approximates \(s/\sqrt n\). This familiar case is useful for debugging code. The real value of the bootstrap is applying the same repeated-computation idea to statistics whose analytic standard errors are less convenient.

> **Practice — Foundation:** Distinguish sample size \(n\) from bootstrap repetition count \(B\).
>
> **Practice — Core:** Explain why increasing \(B\) from 1,000 to 100,000 does not repair a biased sample of the target population.
>
> **Practice — Stretch:** Derive the conditional variance of a bootstrap sample mean and compare it with the usual plug-in variance of the original sample mean.

## 3. Bootstrap intervals summarize the resampling distribution

Let \(q_\gamma^*\) denote the empirical \(\gamma\)-quantile of bootstrap estimates.

### Percentile interval

The percentile interval uses

$$
[q_{\alpha/2}^*,q_{1-\alpha/2}^*].
$$

It is intuitive and transformation-respecting: applying a monotone transformation to all estimates transforms the percentile endpoints in the same way. But skewness and estimator bias can make its coverage inaccurate.

### Basic interval

Reflect bootstrap errors around the observed estimate:

$$
\left[
2\hat\theta-q_{1-\alpha/2}^*,
2\hat\theta-q_{\alpha/2}^*
\right].
$$

This interval attempts to correct displacement of the bootstrap distribution, but it is not invariant to nonlinear transformations.

### Studentized interval

If each estimate has a usable standard-error estimate, bootstrap a standardized pivot:

$$
t_b^*=\frac{\hat\theta_b^*-\hat\theta}
{\widehat{\operatorname{SE}}_b^*}.
$$

Quantiles of \(t_b^*\) can deliver better coverage, at the cost of estimating uncertainty inside every resample.

Bias-corrected and accelerated intervals additionally adjust for median bias and changing standard error. They can improve accuracy but do not rescue a wrong sampling unit or an estimator with unstable behavior.

**Worked example — ratio metric.** A conversion-per-cost ratio is right-skewed when cost can be small. A symmetric estimate \(\pm 1.96\) standard-error interval may extend into impossible values. A bootstrap distribution can reveal skewness, but resamples with near-zero denominator may also expose that the ratio itself is unstable.

> **Practice — Foundation:** Write the endpoints of a 95% percentile interval from bootstrap quantiles.
>
> **Practice — Core:** Derive the basic interval by reflecting bootstrap error quantiles around \(\hat\theta\).
>
> **Practice — Stretch:** Compare percentile and basic intervals under the transformation \(\phi=\log\theta\). Explain why only one transforms automatically.

## 4. The resampling unit must match the sampling unit

If data are iid rows, resample rows. If users are independently sampled and each supplies many rows, resample users with their complete collections. If systems are compared on the same prompts, resample paired prompt records rather than sampling each model separately.

### Cluster bootstrap

Suppose cluster \(j\) contains observations \(X_{j1},\ldots,X_{jn_j}\). Sample clusters with replacement and carry every row in a selected cluster into the bootstrap dataset. This preserves within-cluster dependence.

Unequal cluster sizes raise an estimand question:

- averaging all rows targets the average row or interaction;
- averaging cluster means equally targets the average cluster;
- weighting clusters by a specified deployment distribution targets that mixture.

The bootstrap must recompute the same estimator used for the intended target.

### Stratified bootstrap

If sampling was performed independently within strata, resample within each stratum and preserve planned stratum sizes. This avoids injecting artificial composition variability that the design fixed.

### Block bootstrap

For time series, sample contiguous blocks rather than individual times. Blocks preserve local serial structure. Block length trades dependence preservation against the number of approximately independent pieces.

**Worked example — call-quality evaluation.** Ten thousand utterances come from 80 calls. A row bootstrap treats 10,000 utterances as independent. A call bootstrap draws 80 calls with replacement and includes each selected call's utterances. If deployment generalization is to new calls, the latter mirrors the study's independent sampling axis.

> **Practice — Foundation:** Choose the resampling unit for responses nested within users.
>
> **Practice — Core:** Contrast an interaction-weighted mean with a user-weighted mean when user activity varies greatly.
>
> **Practice — Stretch:** Design a two-stage bootstrap for tasks containing prompts, and state whether it targets new tasks, new prompts within fixed tasks, or both.

## 5. Bootstrap failure modes are structural

The ordinary bootstrap works when the empirical distribution approximates the population in the way relevant to the estimator. Important failures include:

- **extreme statistics:** the empirical distribution has no values beyond the observed maximum, so it cannot reproduce uncertainty in unseen extremes;
- **very small samples:** a few support points poorly approximate the population shape;
- **rare events:** no observed failures means every ordinary resample also has zero failures;
- **non-smooth estimators:** thresholds, model selection, and boundary parameters can change discontinuously;
- **dependence:** row resampling destroys serial or cluster structure;
- **non-identical distributions:** rows from changing policies or domains are not exchangeable;
- **post-selection inference:** resampling only the final chosen model omits the selection procedure.

**Worked example — maximum latency.** Every bootstrap resample uses observed latencies, so its maximum cannot exceed the observed maximum. If the target is a future extreme or high quantile, this truncated support can severely understate tail uncertainty. An explicit tail model or a different estimand may be required.

The remedy is not always a more elaborate bootstrap. Sometimes the data do not contain enough information. Honest uncertainty can be wide or the estimand may be unidentified.

### Model-based and specialized alternatives

A **parametric bootstrap** fits a model \(P_{\hat\theta}\), simulates new datasets from that fitted model, and refits the estimator on every simulation. Unlike an empirical bootstrap, it can generate values not seen in the sample. That is useful for rare events or smooth tail models, but its validity now depends directly on model specification.

Regression residuals should not be resampled blindly when their variance changes with the predictors. Residual, wild, pairs, and cluster bootstraps replay different assumptions. Likewise, an \(m\)-out-of-\(n\) bootstrap uses smaller resamples plus an explicit scaling theory for some irregular estimators. These are distinct methods, not interchangeable software settings.

**Worked example — parametric rare failures.** After observing no failures, an ordinary row bootstrap always estimates zero. A parametric bootstrap from a boundary estimate \(p=0\) does too. Smoothing or a prior-like correction can move the fitted model away from the boundary, but then the result reflects that added model assumption. The data alone did not contain a failure-rate scale.

> **Practice — Foundation:** Explain why an ordinary bootstrap cannot generate an observation above the sample maximum.
>
> **Practice — Core:** Predict the ordinary bootstrap interval after observing zero failures in 30 trials and explain why it is misleading.
>
> **Practice — Stretch:** Construct a selection pipeline for which bootstrapping only the selected estimator understates uncertainty. Describe how to bootstrap the complete pipeline.

## 6. A permutation test needs exchangeability

A permutation test constructs a null distribution by applying transformations that leave the joint data distribution unchanged under the null.

![A valid permutation test replays only assignments or label changes justified by the null and design.](../assets/permutation-randomization.svg)

If treatment labels were randomly assigned to \(n_A\) of \(n\) units, the randomization distribution includes the \(\binom n{n_A}\) assignments allowed by that design. Outcomes remain fixed; labels move. For each assignment \(g\), calculate \(T(gx)\). The exact p-value is the fraction of allowed assignments at least as extreme as the observed assignment.

Exchangeability is not the claim that rows look similar. It is a probabilistic invariance: under the null and design, the transformed dataset has the same distribution as the original.

Arbitrarily shuffling labels can be invalid when:

- assignments were blocked or clustered;
- observations are paired;
- time order matters;
- covariate distributions differ by design;
- only some assignments were possible;
- the null makes means equal but not full distributions exchangeable.

> **Practice — Foundation:** Define exchangeability in the context of a permutation test.
>
> **Practice — Core:** Count the possible assignments of four units to A and four to B.
>
> **Practice — Stretch:** Give two data-generating distributions with equal means but unequal variances and explain why unrestricted label permutation may test more than mean equality.

## 7. Paired permutation tests become sign-flip tests

For paired observations, define differences \(D_i=Y_{i,B}-Y_{i,A}\). Under a sharp null that swapping A and B within any pair changes nothing, each difference may have its sign flipped:

$$
D_i^*=S_iD_i,
\qquad
S_i\in\{-1,+1\}.
$$

There are \(2^n\) sign assignments for \(n\) pairs. With statistic \(T=\bar D\), an exact two-sided p-value is

$$
\frac{
\#\{s:|\bar D_s^*|\geq|\bar D_{\mathrm{obs}}|\}
}{2^n}.
$$

Zero differences generate duplicate statistic values but still correspond to distinct equally likely sign assignments. They may be removed for computational efficiency if the probability weights are handled consistently.

**Worked example — three pairs.** Let differences be \(2,-1,3\). The observed mean is \(4/3\). Among eight sign assignments, four produce a mean whose absolute value is at least \(4/3\), so the exact two-sided p-value is \(4/8=0.5\). A positive observed mean is not automatically rare.

For paired binary predictions, sign flipping the discordant outcomes yields the exact McNemar/binomial comparison from Chapter 08.

> **Practice — Foundation:** How many sign assignments exist for six nonzero paired differences?
>
> **Practice — Core:** Enumerate all sign assignments for differences \(2,-1,3\) and verify the two-sided p-value.
>
> **Practice — Stretch:** Distinguish the sharp pairwise null needed for literal within-pair swaps from the weaker null that only the average difference is zero.

## 8. Independent-group randomization follows the assignment mechanism

In a completely randomized experiment with \(n_A\) units assigned A and \(n_B\) assigned B, hold outcomes fixed and enumerate every allocation with those group sizes. A difference in means is common:

$$
T=\bar Y_A-\bar Y_B.
$$

Under the sharp null of no treatment effect for any unit, every allowed assignment reveals the outcomes that would have been observed: they are unchanged. The randomization distribution is therefore exact conditional on the observed outcomes.

If the experiment randomized within blocks, permute within blocks. If whole users or classrooms were randomized, permute cluster labels. If treatment was assigned adaptively over time, reproduce that assignment algorithm. The design defines the reference distribution.

For observational groups, label exchangeability is an assumption rather than a consequence of randomization. Covariate adjustment can help but does not manufacture random assignment.

**Worked example — blocked prompt assignment.** Prompts are divided into coding, reasoning, and safety strata before randomly choosing which model serves each prompt. A valid randomization test reassigns model labels within each stratum while preserving its allocation counts. Shuffling across all prompts would allow assignments excluded by the design and could confound domain with model.

> **Practice — Foundation:** State what remains fixed and what changes in a randomization test.
>
> **Practice — Core:** Describe the allowed permutations for an experiment assigning one treatment per user, with many responses per user.
>
> **Practice — Stretch:** Compare the null tested by a randomized-label test with the null tested by an asymptotic unequal-variance t test.

## 9. Monte Carlo permutation tests need finite-simulation correction

Enumeration becomes expensive: \(2^{30}\) sign assignments already exceed one billion. Instead sample \(B\) allowed transformations at random.

If \(b\) sampled statistics are at least as extreme as the observed statistic, use

$$
\hat p=\frac{b+1}{B+1},
$$

when the observed assignment and sampled assignments are treated exchangeably. The plus-one correction prevents impossible claims of zero p-value and provides valid finite-\(B\) calibration under the standard Monte Carlo construction.

The smallest reportable value is \(1/(B+1)\). To resolve a threshold near \(10^{-4}\), a few thousand permutations are not enough.

Simulation randomness should be reproducible without mutating application-wide random state. Use a local seeded generator and report \(B\). Near a decision threshold, increase \(B\) or quantify Monte Carlo uncertainty.

**Worked example.** With \(B=999\) sampled permutations and \(b=19\) at least as extreme, the corrected p-value is \(20/1000=0.02\), not \(19/999\) and not zero.

> **Practice — Foundation:** Calculate the corrected p-value for \(b=0,B=999\).
>
> **Practice — Core:** Explain why 999 permutations cannot resolve whether a p-value is \(10^{-5}\) or \(10^{-4}\).
>
> **Practice — Stretch:** Construct a confidence interval for the Monte Carlo tail probability and use it to decide whether more permutations are needed.

## 10. Bootstrap and permutation answer different questions

Both methods repeatedly recompute a statistic, but their reference distributions differ.

| Method | What varies? | Main target |
|---|---|---|
| Bootstrap | sampled units from an empirical population | sampling uncertainty of an estimator |
| Permutation/randomization | labels, signs, or assignments allowed by a null/design | null distribution of a test statistic |

A bootstrap sample repeats and omits observations. A permutation usually uses each observed outcome once while changing its assignment. A bootstrap interval need not correspond to a permutation p-value unless specifically constructed as dual procedures.

**Worked example — paired model scores.** Resampling prompt pairs estimates uncertainty in the average model difference over new prompts. Sign-flipping differences tests a symmetry or sharp-null claim conditional on the observed magnitudes. The numerical answers can differ because the hypothetical repetitions differ.

> **Practice — Foundation:** State what is resampled in a row bootstrap and what is shuffled in a two-group permutation test.
>
> **Practice — Core:** Choose between bootstrap and permutation for estimating the standard error of a median and for testing a randomized treatment assignment.
>
> **Practice — Stretch:** Give a setting where a bootstrap test and permutation test target meaningfully different null hypotheses despite using the same statistic.

## 11. Randomization creates causal identification

Let \(Y_i(1)\) and \(Y_i(0)\) be unit \(i\)'s potential outcomes under treatment and control. Only one is observed:

$$
Y_i^{\mathrm{obs}}
=Z_iY_i(1)+(1-Z_i)Y_i(0).
$$

Random assignment makes treatment \(Z_i\) independent of the potential outcomes before treatment. Therefore, differences between assigned groups can identify causal effects without assuming the groups were naturally comparable.

The **sharp null**

$$
H_0:Y_i(1)=Y_i(0)\quad\text{for every }i
$$

imputes every missing potential outcome, enabling an exact randomization test. The weaker average null

$$
H_0:\frac1n\sum_i[Y_i(1)-Y_i(0)]=0
$$

does not specify every missing outcome, so exact finite-sample testing requires additional reasoning.

Randomization does not prevent attrition, noncompliance, measurement bias, interference between units, or failure to generalize beyond study units. It identifies a contrast under the implemented intervention and design.

> **Practice — Foundation:** Explain why both potential outcomes cannot usually be observed for one unit.
>
> **Practice — Core:** Show why the sharp null allows every outcome under every assignment to be known.
>
> **Practice — Stretch:** Describe interference in a multi-agent system experiment and explain how it violates a no-interference analysis.

## 12. Repeated peeking invalidates a fixed-sample threshold

A test designed for one analysis at sample size \(n\) controls

$$
P_{H_0}(p_n\leq\alpha)\leq\alpha.
$$

It does not automatically control

$$
P_{H_0}(\exists t\leq n:p_t\leq\alpha).
$$

Looking after every batch creates many chances for noise to cross the boundary. Stopping at the first favorable result then selects a path precisely because it was extreme.

There are several valid responses:

- **fixed horizon:** do not inspect the confirmatory statistic until the planned sample size;
- **alpha spending:** allocate Type I error across scheduled looks;
- **group-sequential boundaries:** use jointly calibrated early-stopping thresholds;
- **always-valid evidence:** construct e-values or confidence sequences valid at arbitrary stopping times.

![Sequential inference must control the chance of ever crossing an evidence boundary under the null.](../assets/sequential-evidence.svg)

**Worked example — union-bound spending.** If five planned analyses use levels \(\alpha_1,\ldots,\alpha_5\) with \(\sum_t\alpha_t\leq0.05\), then the union bound limits the chance of any null rejection to 0.05 regardless of dependence among looks. This simple rule is valid but can be conservative because looks are strongly correlated.

> **Practice — Foundation:** Distinguish a fixed-time Type I error event from an ever-crossing event.
>
> **Practice — Core:** Construct a simple alpha-spending schedule for four planned looks with total at most 0.05.
>
> **Practice — Stretch:** Simulate a true-null z statistic as data accumulate and compare false-rejection rates for fixed 0.05 thresholds and a valid sequential boundary.

## 13. Likelihood-ratio e-values support anytime-valid testing

For a simple null distribution \(P_0\) and alternative \(P_1\), the likelihood ratio after observations \(X_1,\ldots,X_t\) is

$$
E_t
=
\prod_{i=1}^t
\frac{p_1(X_i)}{p_0(X_i)}.
$$

Under \(P_0\), \(E_t\) is a nonnegative martingale with \(E_0=1\). It measures how much more strongly the observed path is supported by the specified alternative than by the null.

Ville's inequality gives

$$
P_0\left(\sup_{t\geq0}E_t\geq\frac1\alpha\right)
\leq\alpha.
$$

Therefore, reject whenever \(E_t\geq1/\alpha\), even if the stopping time is chosen by watching \(E_t\). An anytime p-value through time \(t\) is

$$
p_t^{\mathrm{any}}
=\min\left(1,\frac1{\max_{0\leq s\leq t}E_s}\right).
$$

It never increases because it records the strongest evidence so far.

**Worked example — Bernoulli evidence.** To compare \(H_0:p=p_0\) with \(H_1:p=p_1\), each success multiplies evidence by \(p_1/p_0\), and each failure multiplies it by \((1-p_1)/(1-p_0)\). Compute in log space:

$$
\log E_t
=S_t\log\frac{p_1}{p_0}
+(t-S_t)\log\frac{1-p_1}{1-p_0}.
$$

A poorly chosen point alternative may accumulate evidence slowly even when the null is false. Mixtures over alternatives or predictable adaptive bets can provide broader power while preserving the supermartingale property.

> **Practice — Foundation:** State the e-value rejection threshold for \(\alpha=0.05\).
>
> **Practice — Core:** Derive the Bernoulli log likelihood ratio after \(s\) successes in \(t\) observations.
>
> **Practice — Stretch:** Explain why choosing \(p_1\) after inspecting the complete data generally breaks the simple martingale argument, and describe a valid mixture alternative.

## 14. Confidence sequences cover at every time

A \(1-\alpha\) **confidence sequence** is a sequence of sets \(C_t\) satisfying

$$
P_\theta(\theta\in C_t\text{ for every }t\geq1)
\geq1-\alpha.
$$

This is stronger than having a separate 95% confidence interval at each fixed time. Pointwise 95% coverage at every \(t\) does not imply 95% simultaneous coverage across all times.

Confidence sequences can be constructed by inverting families of sequential tests. They are typically wider than fixed-time intervals early on because they pay for continuous validity. Their advantage is operational: data collection can stop for efficacy, futility, budget, or external reasons without invalidating coverage, provided the construction's assumptions remain true.

Optional continuation matters too. If a disappointing study is extended while a favorable one is stopped, a fixed interval at the eventual stopping time inherits selection. An anytime-valid sequence is designed for that behavior.

> **Practice — Foundation:** Distinguish pointwise confidence intervals from a confidence sequence.
>
> **Practice — Core:** Explain why inverting anytime-valid tests yields simultaneous coverage.
>
> **Practice — Stretch:** Design stopping rules for efficacy and futility using a confidence sequence and a practically meaningful effect threshold.

## 15. Design dominates analysis

No analysis can fully repair a study in which treatment is confounded with time, hardware, evaluator, or population.

### Randomization

Randomization prevents systematic pre-treatment differences in expectation and supplies a known assignment distribution.

### Pairing

Expose both systems to the same unit when carryover and interference are controlled. Analyze within-pair differences.

### Blocking

Group units by important pre-treatment variables, then randomize within each block.

![Blocked randomization balances treatment within known sources of variation while preserving random assignment.](../assets/blocked-randomization.svg)

### Blinding

Hide assignment from human raters or adjudicators when knowledge of the system could affect measurement.

### Replication

Replicate at the unit where randomness enters. Repeating deterministic scoring on the same fixed outputs is not new replication.

**Worked example — online latency experiment.** Sending model A traffic in the morning and model B traffic in the evening confounds model with load and user mix. Randomly route requests concurrently, block or stratify by region and device when needed, and log assignment before the outcome. If users make repeated requests, randomize at the user level when spillover across a user's sessions is likely.

> **Practice — Foundation:** Give one purpose each for randomization, blocking, and blinding.
>
> **Practice — Core:** Design a paired human-preference evaluation while preventing order and identity effects.
>
> **Practice — Stretch:** Choose between request-level and user-level randomization for a conversational assistant whose earlier responses influence later behavior.

## 16. Factorial designs reveal interactions

Suppose two factors have two levels each: model size \(A\in\{-1,+1\}\) and retrieval \(B\in\{-1,+1\}\). A \(2\times2\) factorial design estimates:

- the main effect of model size, averaged over retrieval settings;
- the main effect of retrieval, averaged over model sizes;
- the interaction: whether retrieval's effect changes with model size.

For cell means \(\bar Y_{ab}\), one interaction contrast is

$$
\frac12[
\bar Y_{++}-\bar Y_{+-}
-\bar Y_{-+}+\bar Y_{--}
].
$$

Testing one factor at a time can miss interactions and uses runs inefficiently. Factorial designs share observations across several planned contrasts.

Interactions must be interpreted on the chosen outcome scale. No interaction in additive accuracy points does not imply no interaction in odds or utility. Multiple planned factors and outcomes also create a test family.

> **Practice — Foundation:** Name the three effects estimable in a two-factor \(2\times2\) design.
>
> **Practice — Core:** Calculate a difference-in-differences interaction from four supplied cell means.
>
> **Practice — Stretch:** Design a factorial experiment for model, prompting strategy, and tool access. Identify prohibited combinations and how they alter estimability.

## 17. Sample size, attrition, noncompliance, and interference

Power calculations must reflect the implemented design:

- clustering reduces effective information;
- blocking and pairing can increase precision;
- unequal allocation is sometimes efficient when costs or variances differ;
- multiple primary comparisons require stricter evidence or hierarchical testing;
- sequential boundaries alter fixed-horizon power;
- attrition reduces sample size and may bias comparisons;
- noncompliance changes the meaning of assignment and received treatment;
- interference makes one unit's outcome depend on another unit's assignment.

An **intention-to-treat** effect compares outcomes by randomized assignment, preserving randomization even when treatment is not followed. A per-protocol comparison conditions on behavior after assignment and may reintroduce confounding.

**Worked example — tool-use rollout.** Users randomized to tool access may never invoke the tool. The intention-to-treat estimand measures the effect of offering access. The effect among users who would use the tool is different and generally requires stronger assumptions. Reporting only active tool users destroys the original randomized comparison.

> **Practice — Foundation:** Explain why post-assignment attrition can bias a randomized experiment.
>
> **Practice — Core:** Distinguish the effect of offering a feature from the effect of actually using it.
>
> **Practice — Stretch:** Describe interference between agents sharing a memory or rate limit, then propose a cluster-randomized design.

## 18. Resampling and design for AI research

Before running an AI evaluation, draw the hierarchy:

~~~mermaid
flowchart TD
  D[Deployment population] --> T[Sampled tasks or domains]
  T --> P[Prompts within task]
  M[Training procedure] --> S[Model seeds]
  S --> O[Outputs or trajectories]
  P --> O
  O --> R[Human or automated ratings]
~~~

Then decide which nodes are sampled, randomized, fixed, or selected.

- To generalize to new tasks, task variability must appear in uncertainty.
- To generalize over retraining, seed variability must appear.
- To compare systems on common prompts, preserve prompt pairing.
- To include stochastic generation, sample outputs within prompt without pretending they are new prompts.
- To evaluate human ratings, account for raters and blinded assignment.
- To claim causal effects of a system change, randomize the change at a unit insulated from interference.

Selection must be replayed. If the best checkpoint is chosen within each seed, a bootstrap that treats the chosen checkpoints as fixed omits checkpoint-selection variability. If prompts were filtered using both systems' outputs, the filter is part of the data-generating pipeline.

**Worked example — hierarchical benchmark bootstrap.** To target new tasks and new prompts, resample tasks; inside each selected task, resample its prompts; keep both models' results paired on every prompt; recompute task aggregation and the overall difference. If the target treats the twelve benchmark tasks as fixed, do not pretend task resampling estimates a larger task population.

> **Practice — Foundation:** Draw the hierarchy for an evaluation with tasks, prompts, seeds, sampled outputs, and raters.
>
> **Practice — Core:** Specify a hierarchical bootstrap for generalizing across both tasks and prompts while preserving model pairing.
>
> **Practice — Stretch:** Audit an agent evaluation in which trajectories share tools, memory, and rate limits. Identify dependence, interference, stopping, and assignment issues.

## 19. Runnable labs

This chapter has three coding exercises. Each opens as a separate tab in the lesson's right-hand Python workspace.

### Lab A — bootstrap interval for a mean

Implement **bootstrap_mean_interval** in [labs/exercises.py](../../labs/exercises.py). Given finite values, a resample count, confidence level, and seed, return:

1. the sample mean;
2. the bootstrap standard error;
3. the percentile interval, using linear interpolation between ordered bootstrap estimates.

Run:

~~~text
python -m labs.checks bootstrap
~~~

The checks cover deterministic seeding, generators, input preservation, constant and shifted samples, interval nesting, local random state, and invalid inputs.

### Lab B — exact paired permutation test

Implement **paired_permutation_test** in [labs/exercises.py](../../labs/exercises.py). Enumerate every sign assignment for at most 20 finite paired differences and return the observed mean and inclusive two-sided exact p-value.

Run:

~~~text
python -m labs.checks permutation
~~~

The checks cover hand-enumerated examples, sign and scale invariance, zero differences, generators, limits, and invalid observations.

### Lab C — Bernoulli e-process

Implement **bernoulli_e_process** in [labs/exercises.py](../../labs/exercises.py). For binary outcomes and fixed null and alternative probabilities, return:

1. the likelihood-ratio e-value after every observation;
2. the anytime p-value obtained from the largest e-value seen, including \(E_0=1\).

Run:

~~~text
python -m labs.checks e-process
~~~

The checks cover hand calculations, evidence increases and decreases, identical models, generators, numerical overflow, input preservation, and invalid values.

### Guided experiment

1. Compare analytic and bootstrap standard errors of a mean across Gaussian, skewed, and heavy-tailed populations.
2. Measure percentile-interval coverage as sample size changes.
3. Compare row and cluster bootstraps as within-cluster correlation increases.
4. Verify the null rejection frequency of exact and Monte Carlo sign-flip tests.
5. Repeatedly monitor ordinary fixed-time p-values and an e-process under the null; compare ever-crossing frequencies.
6. Simulate blocked and unblocked randomized experiments when blocks explain substantial outcome variation.

## 20. Derivations to own

1. Derive the empirical distribution and conditional bootstrap variance of a sample mean.
2. Derive bootstrap standard-error and bias estimators.
3. Construct percentile, basic, and studentized interval formulas.
4. Explain why resampling clusters preserves within-cluster dependence.
5. Derive an exact permutation p-value from a finite transformation group.
6. Enumerate a paired sign-flip distribution.
7. Justify the Monte Carlo plus-one correction.
8. Derive randomization inference under a sharp potential-outcome null.
9. Use the union bound to justify an alpha-spending schedule.
10. Show that a simple likelihood ratio has null expectation one.
11. Use Ville's inequality to obtain an anytime rejection boundary.
12. Derive a Bernoulli log e-process and anytime p-value.
13. Explain confidence-sequence coverage by inversion.
14. Derive a \(2\times2\) factorial interaction contrast.

## 21. End-of-unit practice (graded)

**Foundation — problems 1–5.** Reconstruct each method's hypothetical repetition.

1. **Bootstrap mechanics.** From \(x=(1,2,4,9)\), show that there are \(4^4=256\) equally likely ordered bootstrap index sequences. Write a program that groups them by bootstrap mean, reports each distinct mean and probability, and verifies the exact bootstrap mean and variance against the plug-in formulas.
2. **Interval construction.** The ordered bootstrap estimates are \((1.1,1.3,1.4,1.8,2.0,2.1,2.4,2.8,3.0,3.6)\), the original estimate is \(2.0\), and this exercise defines the 10% and 90% empirical quantiles as the first and ninth entries. Calculate the corresponding 80% percentile and basic intervals.
3. **Permutation space.** For four paired differences \(d=(1,2,-1,3)\), enumerate all \(2^4\) sign assignments and the resulting mean differences. Contrast this with a completely randomized experiment assigning two of four labeled units to treatment, which has \(\binom42\) assignments.
4. **Sequential evidence.** For observations \((1,0,1,1,0,1)\), update the Bernoulli likelihood ratio for \(H_1:p=0.7\) against \(H_0:p=0.5\) after every observation. Report the running maximum e-value and anytime p-value \(\min(1,1/\max_{s\le t}E_s)\).
5. **Design vocabulary.** Distinguish randomization, pairing, blocking, blinding, replication, and stratification.

**Core — problems 6–11.** Select and execute methods for realistic data structures.

6. **Skewed estimator.** Generate \(n=40\) iid lognormal pairs with log-scale correlation 0.6 (seed 2026). Bootstrap the sample median of the first coordinate and the ratio of coordinate means using 10,000 paired resamples. Compare distribution shape, standard error, and percentile interval with a Gaussian approximation; repeat after breaking the pairing and explain the change.
7. **Cluster bootstrap.** Implement user-level resampling for unequal cluster sizes under both user-weighted and interaction-weighted estimands.
8. **Exact sign flips.** For \(d=(1,2,-1,3)\), calculate the exact two-sided paired permutation p-value using \(|\bar d|\) and inclusive tail counting.
9. **Monte Carlo calibration.** For the same statistic, estimate the permutation p-value using \(B=99,999,9{,}999\), seed 2026, and \((b+1)/(B+1)\). Report conditional Monte Carlo standard error and decide which \(B\) can resolve a 0.05 decision reliably.
10. **Alpha spending.** Use five prespecified looks with levels \((0.005,0.005,0.01,0.01,0.02)\). Verify the union-bound guarantee, then simulate the whole stopping rule for Bernoulli data under \(p=0.5\) and \(p=0.65\), 10,000 trials each, seed 2026. Compare rejection probability and expected stopping look.
11. **Blocked experiment.** In blocks A and B, outcomes under the observed assignment are treatment \((8,9)\), control \((5,6)\) and treatment \((21,20)\), control \((19,18)\), respectively. Estimate the equal-block average effect with and without block adjustment; state which target each weighting scheme estimates and why blocking can improve precision.

**Stretch — problems 12–18.** Diagnose methods that appear computationally sophisticated but replay the wrong experiment.

12. **Rare-event bootstrap.** Study zero and near-zero observed failures. Explain ordinary bootstrap collapse and compare an exact model-based interval.
13. **Time dependence.** Compare row and moving-block bootstraps for an autocorrelated metric while varying block length.
14. **Selection replay.** Select a checkpoint and metric, then compare uncertainty when the bootstrap does and does not repeat selection.
15. **Weak versus sharp null.** Construct potential outcomes with zero average effect but heterogeneous individual effects. Test a sharp null and explain the mismatch.
16. **Adaptive evidence.** Compare a point-alternative e-process with a mixture over alternatives under several true effects.
17. **Interference.** Simulate users sharing an agent memory. Compare individual and cluster randomization under spillovers.
18. **Full protocol.** Design a multi-task, multi-seed AI experiment with randomization, blocking, a sampling hierarchy, sequential stopping, resampling-based uncertainty, and multiplicity control.

<details><summary>Worked solution sketches</summary>

1. Each of four draws independently chooses one of four positions, producing 256 index sequences. The exact bootstrap expectation is the sample mean, \(4\). Conditional variance of a single empirical-distribution draw is \(9.5\), so the mean of four draws has variance \(9.5/4=2.375\); the grouped probabilities must sum to one and reproduce both moments.
2. The percentile interval is \([1.1,3.0]\). Reflecting endpoints around \(2\hat\theta=4\) gives the basic interval \([4-3.0,4-1.1]=[1.0,2.9]\).
3. A completely randomized allocation has \(\binom n{n_A}\) assignments. A paired sign-flip design has \(2^n\). Enumerate only assignments permitted by the implemented design.
4. Multiply by \(0.7/0.5=1.4\) after a success and by \(0.3/0.5=0.6\) after a failure. The e-values are approximately \((1.4,0.84,1.176,1.6464,0.98784,1.382976)\); the final running maximum is 1.6464 and the final anytime p-value is about 0.6074. It never approaches 0.05.
5. Randomization creates exchangeable assignment; pairing compares within units; blocking randomizes within known groups; blinding protects measurement; replication creates independent experimental information; stratification controls sampling composition.
6. Recompute the full statistic per resample. Skewness or unstable denominators should appear in the bootstrap distribution and can make symmetric intervals misleading.
7. Resample complete users. For a user-weighted target, average user summaries equally. For an interaction-weighted target, pool selected users' rows with the intended weighting. Unequal sizes make these estimands differ.
8. The observed mean is \(1.25\), so the absolute signed sum threshold is 5. Enumerating the 16 sign patterns gives 6 sums with absolute value at least 5; the exact inclusive two-sided p-value is \(6/16=0.375\).
9. Use \((b+1)/(B+1)\). The indicator of an extreme sampled permutation is Bernoulli conditional on the data, so its Monte Carlo standard error is approximately \(\sqrt{\hat p(1-\hat p)/B}\).
10. Select nonnegative look-specific levels summing to at most the family level. Simulate the entire stopping rule; do not compare only the final-look rejection rate.
11. Randomization protects both analyses from systematic bias, but block adjustment removes explainable between-block variation when the design and model align.
12. With no observed failures, every ordinary nonparametric resample has none. More resamples do not add missing support. Exact binomial reasoning uses a population model to express remaining uncertainty.
13. Row resampling destroys autocorrelation. Contiguous blocks retain local structure; too-short blocks miss long dependence, while too-long blocks leave few effective resampling units.
14. The valid pipeline resamples data, reruns checkpoint and metric selection, then records the selected result. Conditioning on the observed winner omits winner's-curse variation.
15. A sharp null says every individual effect is zero. Effects can cancel to zero on average while violating the sharp null, so the sharp-null randomization distribution answers a stronger question.
16. A point alternative grows quickly near its chosen effect and slowly elsewhere. A prespecified mixture averages likelihood ratios and remains an e-process while spreading power across effects.
17. Individual assignment allows treated units to alter controls through shared memory. Randomizing isolated clusters aligns assignment with interference groups, though inference then depends on the number of clusters.
18. A complete protocol names all target populations and random axes, preserves paired outputs, randomizes interventions, blocks on task, declares primary contrasts, uses a valid stopping rule, resamples at generalization units, and corrects the full confirmatory family.

</details>

## Mastery check

Given an unfamiliar evaluation, state the repeated experiment; choose the correct resampling or permutation unit; construct an interval or exact test; separate statistical and Monte Carlo error; identify exchangeability assumptions; design a valid sequential stopping rule; map treatment assignment to causal claims; and build an experiment whose randomization, blocking, replication, analysis, and target population all agree.

The next unit develops Bayesian modeling, prior and posterior geometry, posterior predictive checks, importance sampling, and Markov chain Monte Carlo.
