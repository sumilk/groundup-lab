# Information theory, learning theory, and decision theory

**Prerequisites:** probability and logarithms. **Outcome:** connect predictive loss, generalization, and action costs without conflating them.

## Entropy and predictive coding

For a discrete distribution $p$, entropy in nats is

$$
H(p)=-\sum_xp(x)\log p(x).
$$

Use $0\log0=0$ by continuity. A nearly certain event needs little average information to identify; a uniform variable with $K$ outcomes has entropy $\log K$.

If you encode or predict using $q$ while outcomes follow $p$, expected log loss is cross-entropy:

$$
H(p,q)=-\sum_xp(x)\log q(x)=H(p)+D_{\mathrm{KL}}(p\|q).
$$

KL is $\sum_xp(x)\log[p(x)/q(x)]$. If $q(x)=0$ where $p(x)>0$, KL is infinite. Jensen's inequality applied to the log establishes nonnegativity; equality holds when distributions agree on their support. KL is asymmetric and is not a metric.

For a deterministic class label $y$, observed loss is $-\log q_y$. This is one sample's loss, not the entropy of the model's complete predictive distribution.

## Mutual information

$$
I(X;Y)=D_{\mathrm{KL}}(p_{XY}\|p_Xp_Y)=H(Y)-H(Y\mid X).
$$

Mutual information measures reduction of uncertainty about one variable from observing another. Correlation captures only a particular linear relation; mutual information detects broader dependence. Estimating it reliably in high dimensions is its own statistical problem.

> **Predict:** If a deterministic transformation discards input information, can it increase mutual information with an unchanged target? State the Markov assumption needed for the data-processing inequality.

## Generalization

Population risk is $R(h)=E[\ell(h(X),Y)]$; empirical risk averages loss on the training sample. Low empirical risk alone gives no guarantee about unseen cases.

For a fixed hypothesis and iid losses in $[0,1]$, Hoeffding gives

$$
P(|R(h)-\hat R(h)|>\epsilon)\le2e^{-2n\epsilon^2}.
$$

For a finite class $\mathcal H$ of size $M$, a union bound gives, with probability at least $1-\delta$,

$$
\forall h\in\mathcal H:\quad
|R(h)-\hat R(h)|\le\sqrt{\frac{\log(2M/\delta)}{2n}}.
$$

The uniform statement matters because the chosen hypothesis depends on training data. Applying only a fixed-hypothesis guarantee to a data-selected winner is invalid.

If $\hat h$ minimizes empirical risk and $h^*$ minimizes population risk in the class, uniform error at most $\epsilon$ implies

$$
R(\hat h)\le\hat R(\hat h)+\epsilon
\le\hat R(h^*)+\epsilon\le R(h^*)+2\epsilon.
$$

The gap between the best in-class model and the best possible predictor is approximation error; finite data adds estimation error; incomplete training adds optimization error. Infinite classes require capacity notions such as VC dimension or Rademacher complexity. Those are later proof units.

## Decisions depend on costs

Let $p=P(Y=1\mid x)$. Predicting positive has conditional cost $C_{\mathrm{FP}}(1-p)$, while predicting negative costs $C_{\mathrm{FN}}p$, assuming zero cost for correct decisions. Predict positive when

$$
p>\frac{C_{\mathrm{FP}}}{C_{\mathrm{FP}}+C_{\mathrm{FN}}}.
$$

A threshold of 0.5 is justified only under matching costs in this setup. For multiple actions, choose $a^*(x)=\arg\min_a\sum_y L(a,y)P(y\mid x)$. An abstention action can be optimal if its cost is lower than both automated choices.

Accuracy, calibration, and utility answer different questions. A perfectly calibrated probability model can still be used with a poor decision rule.

## Lab and problems

1. Implement entropy and KL with explicit zero-support handling.
2. Verify cross-entropy equals entropy plus KL numerically.
3. For $M=100,n=10000,\delta=0.05$, compute the uniform bound.
4. Derive the decision threshold for false negatives costing nine times false positives.
5. Explain why testing many models on the test set invalidates its role.
6. Construct distributions for which KL differs when arguments are reversed.

<details><summary>Solutions</summary>

The bound is approximately $\sqrt{\log(4000)/20000}\approx0.0204$. Cost ratio nine gives threshold 0.1. Repeated model selection adapts to test-set noise. Try Bernoulli probabilities 0.1 and 0.5 for KL asymmetry. For a chain $Y\to X\to Z$, data processing gives $I(Y;Z)\le I(Y;X)$.

</details>

**Mastery:** derive the finite-class guarantee and choose an action using explicit losses. Later units: source coding, channel capacity, PAC/VC proofs, Rademacher complexity, calibration theory, Bayesian decisions, minimax analysis, and sequential decision theory.
