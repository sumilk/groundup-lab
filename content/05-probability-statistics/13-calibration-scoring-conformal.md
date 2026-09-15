---
id: math.statistics.calibration-scoring-conformal
title: Calibration, proper scoring rules, and conformal prediction
prerequisites: [math.statistics.estimation-likelihood-fisher, math.statistics.hypothesis-testing-confidence-power]
estimated_hours: 32
---

# Calibration, proper scoring rules, and conformal prediction

A model that outputs \(0.8\) is making a claim. This unit is about what that claim means, how to test it, how to score it without rewarding dishonesty, and how to attach a guarantee to a prediction even when the model is badly wrong.

Three separate questions get confused constantly, so separate them now:

- **Calibration** — when the model says \(0.8\), does the event happen \(80\%\) of the time? A property of the *probabilities*.
- **Scoring** — how good is this forecast overall, in a way that cannot be gamed? A property of the *evaluation rule*.
- **Coverage** — can I produce a set of outcomes that contains the truth with a stated probability, with no assumption that the model is correct? A property of a *procedure*.

A model can be perfectly calibrated and useless. A model can be sharp and dangerously overconfident. And a model can be both bad and still support a valid coverage guarantee. Each section below makes one of those statements precise.

## 0. Prerequisite check

You should be comfortable with conditional expectation, the law of total expectation, the idea of a sampling distribution, quantiles of an empirical distribution, and the meaning of a coverage statement from [hypothesis testing and confidence intervals](07-hypothesis-testing-confidence-power.md). Exchangeability, developed for permutation tests in [resampling and experimental design](08-resampling-sequential-experimental-design.md), is the central assumption of section 7.

## 1. What calibration actually claims

Let \(q(X)\in[0,1]\) be a model's predicted probability that \(Y=1\). The model is **perfectly calibrated** when

$$
P\bigl(Y=1\;\big|\;q(X)=p\bigr)=p
\qquad\text{for every }p\text{ in the range of }q .
$$

Equivalently \(E[Y\mid q(X)]=q(X)\): the predicted probability is the conditional mean given itself. This is a statement about a *joint* distribution of \((X,Y)\), not a property the model carries around on its own.

Two immediate observations, both of which people get wrong:

**Calibration is not accuracy.** Predict the base rate \(\bar p\) for every input. Then \(P(Y=1\mid q(X)=\bar p)=\bar p\) exactly, so the model is perfectly calibrated — and it has learned nothing. The missing property is **sharpness**: how far the predictions spread away from the base rate. Calibration without sharpness is worthless, and section 4 makes the tradeoff arithmetic.

**Accuracy is not calibration.** A classifier that outputs \(0.99\) whenever it is right \(90\%\) of the time can have excellent accuracy and terrible probabilities. Any decision that compares a probability to a cost threshold — abstain, escalate, retry, route to a human — breaks under that model even though its top-1 accuracy looks fine.

> **Practice — Foundation:** State in one sentence what a model claims when it outputs \(0.3\), and give an observable consequence of that claim.
>
> **Practice — Core:** Construct a two-input example where model A has higher accuracy and model B is better calibrated, and name a decision rule that prefers each.
>
> **Practice — Stretch:** Show that \(E[Y\mid q(X)]=q(X)\) implies \(E[Y]=E[q(X)]\), and explain why matching average predicted probability to the base rate is necessary but far from sufficient for calibration.

## 2. Reliability diagrams and the trouble with ECE

Calibration conditions on \(q(X)=p\), an event of probability zero for a continuous score. In practice we bin. Partition \([0,1]\) into \(K\) bins, and in bin \(k\) with \(n_k\) observations record the mean predicted probability \(\bar q_k\) and the empirical rate \(o_k\). Plotting \(o_k\) against \(\bar q_k\) gives a **reliability diagram**; perfect calibration is the diagonal.

The usual summary is the **expected calibration error**

$$
\widehat{\mathrm{ECE}}=\sum_{k=1}^K\frac{n_k}n\bigl|\bar q_k-o_k\bigr| .
$$

It is worth knowing exactly how bad this estimator is.

**ECE is biased upward, always.** Even under *perfect* calibration, \(o_k\) is a sample proportion and fluctuates around \(\bar q_k\). Since ECE takes absolute values, those fluctuations cannot cancel — they add. For a bin with \(n_k\) observations near probability \(p\), the mean absolute deviation of a sample proportion is approximately

$$
E\bigl|o_k-p\bigr|\approx\sqrt{\frac{2}{\pi}}\cdot\sqrt{\frac{p(1-p)}{n_k}} .
$$

**Worked example — a perfect model with ECE 0.04.** Take a perfectly calibrated model, \(K=10\) bins, \(1000\) observations, so \(n_k=100\), and scores near \(p=0.5\). Then

$$
E|o_k-p|\approx0.798\times\sqrt{\frac{0.25}{100}}=0.798\times0.05\approx0.040 .
$$

Averaging over bins gives \(\widehat{\mathrm{ECE}}\approx0.04\) for a model whose true calibration error is exactly zero. Reporting "our ECE is 0.04, so we are well calibrated" is therefore not a measurement — without a null it is indistinguishable from perfection.

Three consequences to carry:

- **ECE is not comparable across bin counts.** More bins means smaller \(n_k\), which means more upward bias. A model can be made to look better or worse by rebinning alone.
- **ECE is not comparable across sample sizes.** The bias shrinks like \(1/\sqrt{n_k}\).
- **ECE needs a null.** Simulate outcomes from the model's own predicted probabilities, recompute ECE many times, and report the observed value against that reference distribution. This is the same discipline as the permutation nulls in the resampling lesson.

Better options exist — equal-mass rather than equal-width bins, kernel or spline smoothing of \(E[Y\mid q]\), and debiased estimators — but the reporting discipline matters more than the estimator choice.

![A reliability diagram compares predicted probability against observed frequency, while split conformal turns calibration scores into a set with guaranteed coverage.](../assets/calibration-and-coverage.svg)

> **Practice — Foundation:** With \(K=15\) equal-width bins and 3,000 points, compute the approximate ECE floor for a perfectly calibrated model with scores near \(0.5\).
>
> **Practice — Core:** Explain why equal-mass bins change the bias profile, and state what they cost in interpretability.
>
> **Practice — Stretch:** Design a simulation-based null for ECE, state precisely which hypothesis it tests, and explain why it does not test whether the model is *useful*.

## 3. Proper scoring rules: evaluation that cannot be gamed

A scoring rule \(S(q,y)\) assigns a loss to forecast \(q\) when outcome \(y\) is observed. It is **proper** if, whenever the true probability is \(p\), the expected score is minimized by reporting \(q=p\), and **strictly proper** if \(p\) is the unique minimizer. Properness is exactly the statement that *honesty is optimal*.

**The Brier score is strictly proper.** With \(S(q,y)=(q-y)^2\),

$$
E_p\bigl[S(q,Y)\bigr]=p(1-q)^2+(1-p)q^2 .
$$

Differentiating in \(q\),

$$
\frac{d}{dq}E_p[S]= -2p(1-q)+2(1-p)q=2(q-p),
$$

which vanishes only at \(q=p\), and the second derivative is \(2>0\). Reporting anything other than your true belief strictly increases expected loss.

**The log score is strictly proper.** With \(S(q,y)=-[y\log q+(1-y)\log(1-q)]\),

$$
E_p[S(q,Y)]
=-p\log q-(1-p)\log(1-q)
=H(p)+\operatorname{KL}(p\Vert q),
$$

and \(\operatorname{KL}(p\Vert q)\ge0\) with equality only at \(q=p\) by Gibbs' inequality. This is cross-entropy: **the standard training loss is a strictly proper scoring rule**, which is why maximum likelihood and honest probability reporting are the same objective — see [estimation and likelihood](06-estimation-likelihood-fisher.md).

**Accuracy is improper, and that is not a technicality.** Threshold at \(0.5\) and score \(\mathbf1\{\hat y\ne y\}\). Expected loss for report \(q\) is \(p\) if \(q<0.5\) and \(1-p\) if \(q>0.5\): it depends on \(q\) only through which side of the threshold it lands. A forecaster maximizing accuracy is indifferent between reporting \(0.51\) and \(0.99\), and any tie-breaking that rewards confidence pushes reports to the extremes. **Optimizing accuracy actively destroys calibration information.** The same argument applies to any metric computed after an argmax: top-1 accuracy, exact match, pass@1.

The two proper rules differ in what they punish. Log score is unbounded: a confident wrong answer costs infinity, so it punishes overconfidence severely. Brier is bounded by 1, so it is more forgiving of a confident mistake and more sensitive to bulk miscalibration. Choose by the decision you face, and say which you chose.

> **Practice — Foundation:** Compute the Brier and log scores for \(q=0.9\) with \(y=1\) and with \(y=0\).
>
> **Practice — Core:** Prove strict properness of the log score directly from Gibbs' inequality, stating where strictness comes from.
>
> **Practice — Stretch:** A leaderboard ranks models by accuracy. Show that a model can rise on that leaderboard by a transformation that strictly worsens its log score, and propose a reporting rule that prevents this.

## 4. The decomposition: calibration is only one term

For a binned forecast with base rate \(\bar o\), the Brier score decomposes exactly as

$$
\mathrm{BS}
=\underbrace{\sum_k\frac{n_k}n(\bar q_k-o_k)^2}_{\text{reliability (lower better)}}
-\underbrace{\sum_k\frac{n_k}n(o_k-\bar o)^2}_{\text{resolution (higher better)}}
+\underbrace{\bar o(1-\bar o)}_{\text{uncertainty (fixed)}} .
$$

Reliability is calibration error. Resolution is sharpness — how much the outcome rate varies across the groups the model separates. Uncertainty is a property of the data alone and no model can change it.

**Worked example — calibrated versus useful.** Let the base rate be \(\bar o=0.3\), so uncertainty is \(0.3\times0.7=0.21\).

- *Model A* predicts \(0.3\) for everyone. Reliability \(=0\), resolution \(=0\). \(\mathrm{BS}=0.21\).
- *Model B* splits the data in half, predicting \(0.1\) for one half where the rate really is \(0.1\), and \(0.5\) for the other half where the rate really is \(0.5\). Reliability \(=0\), resolution \(=\tfrac12(0.1-0.3)^2+\tfrac12(0.5-0.3)^2=0.04\). \(\mathrm{BS}=0.21-0.04=0.17\).

Both are perfectly calibrated. Only B carries information. **This is why "we improved calibration" is not by itself a result** — a temperature that flattens every prediction toward the base rate improves reliability and destroys resolution. Report both terms, or report a proper score that already combines them.

> **Practice — Foundation:** Compute the three terms for a model that predicts \(0.5\) everywhere when the base rate is \(0.5\).
>
> **Practice — Core:** Construct a model with worse reliability but better Brier score than model B above, and explain how that is possible.
>
> **Practice — Stretch:** Derive the decomposition from the law of total variance applied to \(E[Y\mid q(X)]\), and identify which term each piece corresponds to.

## 5. Recalibration: fixing probabilities without retraining

Miscalibration is often a monotone distortion, which means it can be repaired by a one-dimensional post-hoc map fitted on **held-out** data.

- **Platt scaling** fits \(\sigma(as+b)\) to a score \(s\) by logistic regression: two parameters.
- **Isotonic regression** fits the best nondecreasing map: flexible, but it can overfit small calibration sets and produces a step function.
- **Temperature scaling** divides logits by a single \(T>0\) before the softmax, fitted by minimizing held-out log loss. Because dividing all logits by a positive constant cannot change their order, **temperature scaling leaves argmax predictions and therefore accuracy exactly unchanged**. It only moves the probabilities. \(T>1\) softens an overconfident model; \(T<1\) sharpens an underconfident one.

Two rules that are violated constantly. **Fit the calibration map on data the model did not train on**, or you will simply relearn the training-set overconfidence. And **evaluate calibration on a third split**, because the calibration set is now fitted data.

> **Practice — Foundation:** Explain why temperature scaling cannot change top-1 accuracy.
>
> **Practice — Core:** A model is recalibrated on its training set and reports ECE near zero. Say what has gone wrong and what you would measure instead.
>
> **Practice — Stretch:** Isotonic regression with a 500-point calibration set produces a map with 40 steps. Analyze the variance of this estimator and propose a defensible alternative.

## 6. Calibration does not survive distribution shift

Calibration is a property of the joint distribution of \((X,Y)\). Change the distribution and the property disappears, even with the model untouched.

The cleanest case is **prior shift**: \(P(X\mid Y)\) is unchanged but the class balance moves from \(\pi_{\text{train}}\) to \(\pi_{\text{test}}\). Then the correctly adjusted odds are

$$
\frac{P_{\text{test}}(Y=1\mid x)}{P_{\text{test}}(Y=0\mid x)}
=\frac{P_{\text{train}}(Y=1\mid x)}{P_{\text{train}}(Y=0\mid x)}
\cdot\frac{\pi_{\text{test}}/(1-\pi_{\text{test}})}{\pi_{\text{train}}/(1-\pi_{\text{train}})} .
$$

A model calibrated on a 50/50 training mixture and deployed where the positive rate is \(1\%\) will be wildly overconfident until this correction is applied — and the correction requires knowing the new base rate.

For covariate shift and concept drift there is no such closed form. The practical conclusion is that a calibration claim must name the distribution it was measured on, and that recalibration is an ongoing operation, not a one-time fix. This is the same lesson as the evaluation-under-shift material in [sampling design and ML evaluation](10-sampling-design-ml-evaluation.md).

> **Practice — Foundation:** Apply the prior-shift correction to a predicted probability of \(0.6\) when training prevalence was \(0.5\) and deployment prevalence is \(0.05\).
>
> **Practice — Core:** Derive the odds-ratio formula from Bayes' rule, stating exactly where \(P(X\mid Y)\) invariance is used.
>
> **Practice — Stretch:** Propose a monitoring scheme that detects calibration drift in production using only delayed, partially observed labels, and state its blind spots.

## 7. Conformal prediction: coverage without believing the model

Everything above tries to make the model's probabilities trustworthy. Conformal prediction takes the opposite route: **assume nothing about the model, and still guarantee coverage.**

**Split conformal.** Fit any model on a training split. Take a separate calibration set of \(n\) examples and compute a **nonconformity score** \(s_i=s(X_i,Y_i)\) — any function measuring how badly the model fits that pair. For regression, \(s_i=|Y_i-\hat f(X_i)|\). For classification, \(s_i=1-\hat q(X_i)_{Y_i}\), one minus the probability assigned to the true label. Larger means stranger.

Set

$$
\hat q_\alpha=\text{the }\left\lceil(n+1)(1-\alpha)\right\rceil\text{-th smallest of }s_1,\ldots,s_n ,
$$

and for a new input predict the set

$$
C(X_{n+1})=\bigl\{y:\;s(X_{n+1},y)\le\hat q_\alpha\bigr\} .
$$

**Theorem.** If \((X_1,Y_1),\ldots,(X_{n+1},Y_{n+1})\) are exchangeable, then

$$
P\bigl(Y_{n+1}\in C(X_{n+1})\bigr)\ge1-\alpha ,
$$

and if the scores are almost surely distinct, coverage is also at most \(1-\alpha+\tfrac1{n+1}\).

**Why it is true, in one paragraph.** Exchangeability says all \((n+1)!\) orderings of the scores \(s_1,\ldots,s_{n+1}\) are equally likely, so the **rank** of the test score \(s_{n+1}\) among all \(n+1\) scores is uniform on \(\{1,\ldots,n+1\}\). Hence \(P(s_{n+1}\le s_{(k)})\ge k/(n+1)\) where \(s_{(k)}\) is the \(k\)-th smallest calibration score. Choosing \(k=\lceil(n+1)(1-\alpha)\rceil\) makes that at least \(1-\alpha\). No property of \(\hat f\) is used anywhere — it is a statement about ranks.

**Worked example.** With \(n=1000\) and \(\alpha=0.1\), \(k=\lceil1001\times0.9\rceil=\lceil900.9\rceil=901\), so \(\hat q_\alpha\) is the 901st smallest of the 1000 calibration residuals. Note the requirement \(k\le n\), which forces \(n\ge1/\alpha-1\): at \(\alpha=0.05\) you need at least 19 calibration points, and far more for a stable threshold.

**What the guarantee does and does not say.**

- It is **marginal**, averaged over \(X\). Coverage can be \(99\%\) on easy inputs and \(60\%\) on hard ones while the average hits \(90\%\). Group-conditional (Mondrian) conformal restores coverage within declared groups; exact conditional coverage is impossible without assumptions.
- It says nothing about **set size**. A trivially wide set covers perfectly. Model quality shows up as *efficiency*, not validity — always report average set size alongside coverage.
- It requires **exchangeability**, which fails under temporal drift, clustered data, and any calibration set contaminated by training data. The failure modes are identical to those of the permutation tests in the resampling lesson, for the same reason.
- Every reuse of the calibration set to *select* a model or score function re-enters the selection problem of the hypothesis-testing lesson.

In an LLM setting this is the principled backbone of selective prediction: define a nonconformity score from the model's own confidence, calibrate a threshold, and abstain when the prediction set is too large or does not meet the threshold. The guarantee holds even though the model's own probabilities are untrustworthy.

> **Practice — Foundation:** Compute \(k\) for \(n=500,\alpha=0.05\) and for \(n=50,\alpha=0.01\). Is the second feasible?
>
> **Practice — Core:** Explain why the rank argument needs exchangeability but not independence, and give a dependent-but-exchangeable example.
>
> **Practice — Stretch:** A team calibrates conformal thresholds on data from January and deploys in June with observed coverage of \(78\%\) against a target of \(90\%\). Give three mechanisms, the measurement that distinguishes each, and one adaptive method that would have degraded more gracefully.

## 8. Failure modes

- **Reporting ECE without a null or a bin count.** Both are required for the number to mean anything.
- **Optimizing an improper metric** and then wondering why probabilities are extreme.
- **Calling a flattened model "better calibrated"** when resolution was destroyed.
- **Recalibrating on training data**, or evaluating calibration on the calibration split.
- **Quoting calibration measured on one distribution as if it holds on another.**
- **Presenting conformal coverage without set size**, or using conformal sets under clear drift.
- **Treating a proper score as a complete evaluation.** It measures forecast quality, not utility, fairness, or cost-weighted risk — those need the decision-theoretic machinery of [information, learning, and decisions](../06-information-learning-decision/01-entropy-generalization-decisions.md).

## 9. Runnable labs

**Lab A — expected calibration error.** Implement `expected_calibration_error` in the [learner exercises file](../../labs/exercises.py). Given predicted probabilities, binary outcomes, and a bin count, place each probability into an equal-width bin over \([0,1]\), and return the ECE together with per-bin summaries of count, mean predicted probability, and observed rate. Reject empty input, mismatched lengths, probabilities outside \([0,1]\), outcomes other than 0/1, and non-positive bin counts. Empty bins contribute nothing.

Then investigate: simulate a perfectly calibrated model by drawing \(q_i\sim\mathrm{Uniform}(0,1)\) and \(y_i\sim\mathrm{Bernoulli}(q_i)\). Compute ECE for \(K\in\{5,10,20,50\}\) at \(n\in\{500,5000,50000\}\) and tabulate the results. Confirm the bias grows with \(K\) and shrinks with \(n\), and compare against the \(\sqrt{2/(\pi n_k)}\cdot\sqrt{p(1-p)}\) prediction.

**Lab B — split conformal threshold.** Implement `conformal_threshold` in the [learner exercises file](../../labs/exercises.py). Given calibration nonconformity scores and a miscoverage level \(\alpha\), return the \(\lceil(n+1)(1-\alpha)\rceil\)-th smallest score. Reject an empty score list, non-finite scores, \(\alpha\) outside \((0,1)\), and any \((n,\alpha)\) pair for which the required rank exceeds \(n\) — in that case no finite threshold can guarantee coverage.

Then investigate: generate calibration and test scores from the same distribution, and estimate empirical coverage over many repetitions. Confirm it lands in \([1-\alpha,\;1-\alpha+1/(n+1)]\). Then make the test scores systematically larger — a stand-in for distribution shift — and measure how fast coverage degrades.

## 10. Derivations to own

1. Strict properness of the Brier score by differentiating the expected loss.
2. Strict properness of the log score via \(E_p[S]=H(p)+\operatorname{KL}(p\Vert q)\).
3. The impropriety of thresholded accuracy, and why it drives reports to the extremes.
4. The reliability–resolution–uncertainty decomposition of the Brier score.
5. The upward bias of ECE under perfect calibration, including the \(\sqrt{2/\pi}\) factor.
6. The prior-shift odds correction from Bayes' rule.
7. The conformal rank argument, from exchangeability to the \(\lceil(n+1)(1-\alpha)\rceil\) quantile.

## 11. End-of-unit practice (graded)

**Foundation**

1. A weather model says \(0.7\) on 200 days and it rains on 130. Is this consistent with calibration? Give a rough check.
2. Compute the Brier and log scores for \(q=0.02\) when \(y=1\). Which rule punishes more, and by how much?
3. For \(n=200\) and \(\alpha=0.1\), give the conformal rank \(k\).

**Core**

4. Decompose the Brier score for a model with base rate \(0.4\) that predicts \(0.2\) on half the data (true rate \(0.25\)) and \(0.6\) on the other half (true rate \(0.55\)). Report all three terms.
5. Show that temperature scaling is a monotone reparameterization of the logits and therefore cannot change any argmax-based metric. Then say precisely which metrics it can change.
6. A model reports ECE \(=0.035\) with \(K=20\) bins on \(n=4000\) points. Estimate the ECE floor for a perfectly calibrated model in that setting and state what you can conclude.
7. Prove that conformal coverage is at least \(1-\alpha\) using only the uniformity of the rank of \(s_{n+1}\).

**Stretch**

8. A team improves ECE from 0.08 to 0.02 by temperature scaling, and downstream task performance falls. Explain how both can be true, name the quantity that moved in the wrong direction, and design the experiment that confirms it.
9. An LLM abstention system uses conformal calibration on a static benchmark and is deployed on live traffic where prompts arrive in bursts from the same users. State which conformal assumption is violated, what direction coverage will move, and give a resampling unit that restores validity.
10. Argue that no scoring rule can simultaneously be strictly proper, bounded, and invariant to the base rate, or give the counterexample. Then say which of the three properties you would give up for a medical triage model and why.

<details><summary>Solution sketches</summary>

1. The observed rate is \(130/200=0.65\) against a claim of \(0.70\). The standard error is \(\sqrt{0.7\times0.3/200}\approx0.032\), so the deviation is about \(1.5\) standard errors — consistent with calibration on this evidence alone.
2. Brier \(=(0.02-1)^2=0.9604\); log score \(=-\log(0.02)\approx3.91\). The log score is unbounded and punishes the confident error far more; Brier cannot exceed 1.
3. \(k=\lceil201\times0.9\rceil=\lceil180.9\rceil=181\).
4. Uncertainty \(=0.4\times0.6=0.24\). Reliability \(=\tfrac12(0.2-0.25)^2+\tfrac12(0.6-0.55)^2=0.0025\). Resolution \(=\tfrac12(0.25-0.4)^2+\tfrac12(0.55-0.4)^2=0.0225\). \(\mathrm{BS}=0.0025-0.0225+0.24=0.22\).
5. Dividing by \(T>0\) preserves the order of logits, so the argmax is fixed: accuracy, top-\(k\), and exact match are unchanged. It changes every probability-dependent quantity: log loss, Brier, ECE, entropy, abstention rates at a fixed threshold, and any expected-cost decision.
6. Per bin, \(n_k=200\); at \(p\approx0.5\) the floor is \(0.798\times\sqrt{0.25/200}\approx0.028\). An observed 0.035 is barely above the floor, so the data do not support a strong calibration claim in either direction; report the simulated null distribution instead.
7. Exchangeability makes the rank of \(s_{n+1}\) uniform on \(\{1,\ldots,n+1\}\), so \(P(\text{rank}\le k)=k/(n+1)\). With \(k=\lceil(n+1)(1-\alpha)\rceil\ge(n+1)(1-\alpha)\), this is at least \(1-\alpha\), and the event \(\{\text{rank}\le k\}\) implies \(s_{n+1}\le s_{(k)}=\hat q_\alpha\).
8. Temperature scaling above 1 flattens predictions, improving reliability while reducing resolution; any threshold-based downstream policy loses separation. Confirm by reporting the decomposition before and after: reliability falls, resolution falls too, and the proper score barely moves or worsens.
9. Bursty repeated prompts from the same users break exchangeability between calibration and test points — the test scores are positively dependent within a burst, so effective sample size is far below \(n\) and realized coverage becomes more variable and typically lower. Calibrate on user-level units, or use a conformal variant with group-level exchangeability.
10. Strict properness plus boundedness is achievable (Brier), but base-rate invariance is not: the uncertainty term \(\bar o(1-\bar o)\) is a fixed component of any proper score, so scores are not comparable across datasets with different prevalence. For triage, give up boundedness and use the log score, because a confident miss should be punished without limit.

</details>

## Mastery check

State what a calibration claim asserts and test it with an appropriate null rather than a bare ECE number; prove properness for Brier and log scores and explain why argmax metrics are improper; decompose a Brier score into reliability, resolution, and uncertainty and use it to reject a "better calibration" claim that destroyed sharpness; correct probabilities for prior shift; and construct a split-conformal predictor from scratch, state its guarantee exactly, name the assumption it rests on, and report coverage together with set size.
