---
id: math.probability.joint-conditioning-covariance
title: Joint distributions, conditioning, and covariance
prerequisites: [math.probability.random-variables-distributions]
answers: ps-02-joint-conditioning-covariance
estimated_hours: 24
---

# Joint distributions, conditioning, and covariance

Most ML experiments produce several related measurements. A training run has loss, accuracy, throughput, memory use, and thousands of per-example outputs. Separate one-variable distributions cannot tell us how these quantities relate. That information lives in their **joint distribution**.

This unit stays with finite tables and second moments so every operation remains visible. By the end, you should be able to marginalize and condition a joint distribution, use conditional expectation, derive total expectation and total variance, compute covariance without confusing it with independence, and identify when aggregation or clustered data changes an evaluation claim.

## 0. Prerequisite check

You should be able to normalize a PMF, compute an expectation and variance, apply conditional probability to finite events, and explain why zero covariance need not imply independence. Review [random variables and distributions](01-random-variables-distributions.md) if those steps are not yet routine.

The learning route is deliberately cumulative: construct one joint table, obtain marginals by summing, condition by slicing and renormalizing, turn conditional means into random variables, and only then compress dependence into covariance. The final sections show what that compression misses and why changing group weights can reverse an aggregate comparison.

## 1. Joint mass describes combinations

For discrete variables \(X\) and \(Y\),

$$
p_{X,Y}(x,y)=P(X=x,Y=y),
$$

with nonnegative entries summing to one. Consider an evaluation where \(X\) identifies model version B and \(Y\) records a pass:

| joint mass | \(Y=0\) | \(Y=1\) | row sum |
|---|---:|---:|---:|
| \(X=0\) | 0.30 | 0.20 | 0.50 |
| \(X=1\) | 0.10 | 0.40 | 0.50 |
| column sum | 0.40 | 0.60 | 1.00 |

![A joint probability table, its row and column marginals, and a conditional row normalized to one.](../assets/joint-marginals.svg)

The support is the set of pairs with positive mass. It need not be rectangular. If \(X\) is prompt length and \(Y\) is the number of masked prompt tokens, pairs with \(Y>X\) are impossible even if both marginal ranges include those values.

> **Practice — Foundation:** Check whether the \(2\times3\) table with rows \(X=0:(0.10,0.25,0.15)\) and \(X=1:(0.20,0.05,0.30)\) is a valid joint PMF by testing sign and total mass.
>
> **Hint:** All entries are nonnegative, but the rows sum to 0.50 and 0.55, so the total is 1.05 and the table is not a valid PMF.
>
> **Practice — Core:** Start from the section's table \((0.30,0.20;0.10,0.40)\). Subtract \(0.10\) from cells \((0,0)\) and \((1,1)\) and add \(0.10\) to cells \((0,1)\) and \((1,0)\). Verify that both marginals are unchanged, and compare \(P(Y=1\mid X=1)\) in the two tables.
>
> **Hint:** Each row and column gains one +0.10 and one −0.10, so the marginals are preserved; the conditional falls from 0.40/0.50 = 0.8 to 0.30/0.50 = 0.6, and the new table factorizes.
>
> **Practice — Stretch:** Two systems are each 80% correct on the same 10 examples. In scenario 1 both fail on examples 1 and 2; in scenario 2, system A fails on examples 1–2 and B on examples 3–4. Compute \(P(\text{both wrong})\) and \(P(\text{at least one wrong})\) in each scenario, and explain why the per-system accuracies cannot distinguish them.
>
> **Hint:** Pair the outcomes by example: overlapping errors give 0.2 and 0.2, while disjoint errors give 0 and 0.4, although every marginal accuracy is 0.8.

## 2. Marginalization adds over what is not observed

To obtain the distribution of \(X\), sum over every compatible value of \(Y\):

$$
p_X(x)=\sum_y p_{X,Y}(x,y).
$$

Similarly,

$$
p_Y(y)=\sum_x p_{X,Y}(x,y).
$$

In the table,

$$
P(X=1)=0.10+0.40=0.50,
$$

and

$$
P(Y=1)=0.20+0.40=0.60.
$$

**Common wrong turn.** Marginalization is probability-weighted aggregation, not an unweighted average of unique row or column values. It preserves duplicated probability mass because that mass represents how often combinations occur.

<details><summary>Checkpoint: prove the marginal normalizes</summary>

$$
\sum_xp_X(x)=\sum_x\sum_yp_{X,Y}(x,y)=1.
$$

The order of finite sums can be exchanged. Every joint cell appears exactly once.

</details>

> **Practice — Foundation:** A joint PMF has rows \(X=0:(0.05,0.15)\), \(X=1:(0.20,0.10)\), and \(X=2:(0.30,0.20)\) over \(Y\in\{0,1\}\). Sum across columns to obtain \(p_X\), then verify that the marginal normalizes.
>
> **Hint:** Add each row: the row sums are 0.20, 0.30 and 0.50, which total 1.
>
> **Practice — Core:** For the \(3\times2\) table with rows \(X=1:(0.12,0.18)\), \(X=2:(0.25,0.05)\), \(X=3:(0.08,0.32)\) over \(Y\in\{0,1\}\), compute both marginals and verify that summing in either order gives total mass one.
>
> **Hint:** The row sums are (0.30, 0.30, 0.40) and the column sums are (0.45, 0.55); both vectors add to 1 because each cell is counted once.
>
> **Practice — Stretch:** A stream of (user, item) pairs is \((u_1,a),(u_2,a),(u_1,b),(u_3,c),(u_1,a)\). Compute the user and item marginal counts with two dictionaries in one pass. Then, for \(10^6\) users, \(10^5\) items, and \(10^7\) observed pairs, compare the dense table size with the dictionary memory.
>
> **Hint:** Increment one user counter and one item counter per pair (u1:3, u2:1, u3:1; a:3, b:1, c:1); the dense table has \(10^{11}\) cells, while the dictionaries hold at most \(1.1\times10^6\) keys.

## 3. Conditioning selects a slice and renormalizes it

For \(p_X(x)>0\),

$$
p_{Y\mid X}(y\mid x)
=\frac{p_{X,Y}(x,y)}{p_X(x)}.
$$

For \(X=1\), the selected row is \((0.10,0.40)\) and its total is \(0.50\). Dividing gives

$$
p_{Y\mid X}(0\mid1)=0.20,
\qquad
p_{Y\mid X}(1\mid1)=0.80.
$$

For \(X=0\), the conditional pass probability is \(0.20/0.50=0.40\). Conditioning changes the reference population from all observations to those with a specified value of \(X\).

The product rule reconstructs the joint distribution:

$$
p_{X,Y}(x,y)=p_{Y\mid X}(y\mid x)p_X(x).
$$

> **Predict before calculating.** If the two rows of a joint table are proportional, will conditioning on the row change the distribution of \(Y\)? What does that suggest about independence?

> **Practice — Foundation:** In the section's table \((0.30,0.20;0.10,0.40)\), select the column \(Y=1\) and renormalize it to compute \(p_{X\mid Y}(x\mid1)\) for \(x=0,1\).
>
> **Hint:** Divide the column (0.20, 0.40) by its sum 0.60.
>
> **Practice — Core:** Model A passes 45 and fails 15 prompts; model B passes 20 and fails 20. Compute \(P(Y=\text{pass}\mid X=A)\) and \(P(X=A\mid Y=\text{pass})\), and explain the different denominators.
>
> **Hint:** The first fixes the model-A row (45/60); the second fixes the pass column (45/65).
>
> **Practice — Stretch:** A subgroup makes up 2% of traffic and has error rate 0.40; the other 98% has error rate 0.05. Compute the overall error rate and the fraction of all errors that come from the subgroup, and report both without conflating them with the subgroup's conditional error rate.
>
> **Hint:** Multiply each error rate by its prevalence: the subgroup contributes 0.008 of the overall 0.057, about 14% of errors, despite its conditional rate of 40%.

## 4. Independence factorizes the complete table

Variables \(X\) and \(Y\) are independent exactly when

$$
p_{X,Y}(x,y)=p_X(x)p_Y(y)
$$

for every pair. Equivalently, every positive-mass conditional distribution of \(Y\) equals its marginal distribution.

In the example,

$$
p_{X,Y}(1,1)=0.40
\ne
p_X(1)p_Y(1)=0.50(0.60)=0.30,
$$

so the variables are dependent.

Checking one covariance is not equivalent to checking factorization. Checking only the most visible cells is also insufficient: independence is a claim about the entire joint law.

<details><summary>Checkpoint answer: proportional rows</summary>

After normalization, proportional rows become identical conditional distributions. If every positive row has the same conditional distribution, it also equals the weighted marginal distribution, so the joint PMF factorizes.

</details>

> **Practice — Foundation:** For the table with rows \(X=0:(0.10,0.15,0.25)\) and \(X=1:(0.10,0.25,0.15)\) over \(Y\in\{0,1,2\}\), test cell \((0,0)\) against the product of marginals, then test cell \((0,1)\), and explain why the first match is insufficient.
>
> **Hint:** The marginals are (0.5, 0.5) and (0.2, 0.4, 0.4); cell (0,0) matches 0.5·0.2 = 0.10, but cell (0,1) has 0.15 where the product is 0.20.
>
> **Practice — Core:** Construct the independent joint PMF for \(p_X=(0.3,0.7)\) and \(p_Y=(0.2,0.5,0.3)\), then recover both marginals from the product table.
>
> **Hint:** Take the outer product: the first row is (0.06, 0.15, 0.09) and the second is (0.14, 0.35, 0.21).
>
> **Practice — Stretch:** With `random.Random(0)`, simulate independent \(X\sim\text{Bernoulli}(0.3)\) and \(Y\) uniform on \(\{0,1,2\}\). For \(n=100,1{,}000,10{,}000\), generate 200 datasets each and report the average of \(\max_{x,y}|\hat p(x,y)-\hat p(x)\hat p(y)|\). Explain why the discrepancy is never exactly zero.
>
> **Hint:** Compute the statistic separately for each dataset and then average; it should shrink roughly like \(1/\sqrt n\), with values near 0.024, 0.008 and 0.0025.

## 5. Joint expectation weights every combination

For a function \(g\),

$$
E[g(X,Y)]
=\sum_x\sum_y g(x,y)p_{X,Y}(x,y).
$$

Choosing \(g(X,Y)=XY\) gives \(E[XY]\). Choosing \(g(X,Y)=X+Y\) and distributing the sum proves

$$
E[X+Y]=E[X]+E[Y]
$$

without independence.

**Worked example — calculate from cells.** In the binary table, only cell \((1,1)\) contributes to \(XY\), so

$$
E[XY]=1\cdot1\cdot0.40=0.40.
$$

Because \(X\) and \(Y\) are indicators, \(E[X]=0.50\) and \(E[Y]=0.60\).

> **Practice — Foundation:** For \(p(0,1)=0.1\), \(p(0,2)=0.3\), \(p(1,1)=0.4\), \(p(1,2)=0.2\), compute \(E[X+Y]\) directly from the cells and check it against \(E[X]+E[Y]\).
>
> **Hint:** Weight the pair sums 1, 2, 2, 3 by their masses; the marginals give E[X] = 0.6 and E[Y] = 1.5.
>
> **Practice — Core:** For the same table \(p(0,1)=0.1\), \(p(0,2)=0.3\), \(p(1,1)=0.4\), \(p(1,2)=0.2\), compute \(E[XY]\) and compare it with \(E[X]E[Y]\). State what equality would and would not establish.
>
> **Hint:** Only cells with X = 1 contribute: E[XY] = 0.4·1 + 0.2·2 = 0.8, compared with 0.6·1.5 = 0.9, so the covariance is −0.1.
>
> **Practice — Stretch:** Let \(X\) be uniform on \(\{-2,-1,1,2\}\) and \(Y=X^2\). Show that \(\operatorname{Cov}(X,Y)=0\), then verify dependence by comparing \(P(Y=4\mid X=2)\) with \(P(Y=4)\).
>
> **Hint:** By symmetry E[X] = E[X³] = 0; the conditional probability is 1, while the marginal is 1/2.

## 6. Conditional expectation is a random variable

For each value \(x\),

$$
m(x)=E[Y\mid X=x]
=\sum_y y\,p_{Y\mid X}(y\mid x).
$$

Before observing \(X\), \(m(X)=E[Y\mid X]\) is itself random. In the binary example,

$$
m(0)=0.40,
\qquad
m(1)=0.80.
$$

Conditional expectation is the best squared-error predictor using information in \(X\). For any function \(g(X)\),

$$
E[(Y-g(X))^2]
=E[(Y-m(X))^2]+E[(m(X)-g(X))^2].
$$

The cross-term disappears because

$$
E[Y-m(X)\mid X]=0.
$$

This is a population optimum. Learning \(m\) from finite data introduces approximation, optimization, and estimation errors.

> **Practice — Foundation:** For \(p(0,1)=0.1\), \(p(0,2)=0.3\), \(p(1,1)=0.4\), \(p(1,2)=0.2\), compute \(m(y)=E[X\mid Y=y]\) for \(y=1,2\).
>
> **Hint:** Each column has mass 0.5; E[X | Y=y] is the X = 1 cell of that column divided by 0.5.
>
> **Practice — Core:** Let \(P(Y=1)=0.2\), \(P(Y=2)=0.5\), \(P(Y=3)=0.3\). Given \(Y=1\), \(X\) is uniform on \(\{1,3\}\); given \(Y=2\), uniform on \(\{4,6\}\); given \(Y=3\), \(X=2\). Derive the PMF of \(m(Y)=E[X\mid Y]\) and its mean.
>
> **Hint:** The conditional means are 2, 5 and 2; group y = 1 and y = 3, which share the value 2, to get mass 0.5 at 2 and 0.5 at 5.
>
> **Practice — Stretch:** A classifier outputs scores \(S\in\{0.2,0.5,0.8\}\), each on one third of examples, and the observed positive rates at those scores are \(0.10,0.50,0.95\). Tabulate \(E[Y\mid S]-S\), compute its probability-weighted absolute average, and say where the model is over- or underconfident.
>
> **Hint:** The gaps are −0.10, 0 and +0.15, with weighted absolute average 0.25/3 ≈ 0.083; the scores are too high at 0.2 and too low at 0.8.

## 7. Total expectation averages conditional means correctly

The law of total expectation is

$$
E[Y]=E[E[Y\mid X]].
$$

For discrete \(X\),

$$
E[Y]=\sum_xE[Y\mid X=x]p_X(x).
$$

**Worked example — unequal request types.** Suppose easy, medium, and hard requests occur with probabilities \(0.5,0.3,0.2\) and have mean token counts \(50,200,800\). Then

$$
E[Y]=0.5(50)+0.3(200)+0.2(800)=245.
$$

The unweighted average \((50+200+800)/3=350\) answers a different question in which request types are equally probable.

> **Practice — Foundation:** Group A has 80% of requests with mean latency 100 ms; group B has 20% with mean 600 ms. Compute the overall mean and compare it with the unweighted average of the two group means.
>
> **Hint:** Use the weights 0.8 and 0.2: 0.8·100 + 0.2·600 = 200, while the unweighted average is 350.
>
> **Practice — Core:** For \(p(0,1)=0.1\), \(p(0,2)=0.3\), \(p(1,1)=0.4\), \(p(1,2)=0.2\), compute \(E[Y]\) directly and then as \(\sum_xE[Y\mid X=x]p_X(x)\).
>
> **Hint:** Directly, E[Y] = 0.5·1 + 0.5·2; in two stages, E[Y | X=0] = 0.7/0.4 = 1.75 and E[Y | X=1] = 0.8/0.6 ≈ 1.333, weighted by 0.4 and 0.6.
>
> **Practice — Stretch:** A model's accuracy is 0.95 on easy prompts and 0.40 on hard prompts. Compute overall accuracy when the test set is 80% easy and when deployment traffic is 30% easy, and relate the change to evaluation under distribution shift.
>
> **Hint:** The conditional accuracies stay fixed and only the mixing weights change: 0.8·0.95 + 0.2·0.40 against 0.3·0.95 + 0.7·0.40.

## 8. Total variance separates two sources of variation

The law of total variance is

$$
\operatorname{Var}(Y)
=E[\operatorname{Var}(Y\mid X)]
+\operatorname{Var}(E[Y\mid X]).
$$

The first term is average variation **within** groups. The second is variation **between** group means.

**Worked example — latency mixtures step by step.** Two equally common request types have conditional means 100 ms and 500 ms, each with variance \(400\text{ ms}^2\).

First compute the overall mean:

$$
E[Y]=\tfrac12(100)+\tfrac12(500)=300.
$$

The within-group term is

$$
E[\operatorname{Var}(Y\mid X)]=\tfrac12(400)+\tfrac12(400)=400.
$$

The between-group term is

$$
\operatorname{Var}(E[Y\mid X])
=\tfrac12(100-300)^2+\tfrac12(500-300)^2
=40{,}000.
$$

Therefore total variance is \(40{,}400\text{ ms}^2\). Most variation comes from mixing request types, not from noise within a type.

> **Practice — Foundation:** Let \(P(X=1)=0.5\), with \(E[Y\mid X=0]=10\), \(\operatorname{Var}(Y\mid X=0)=4\), \(E[Y\mid X=1]=20\), and \(\operatorname{Var}(Y\mid X=1)=9\). Compute the within-group term, the between-group term, and \(\operatorname{Var}(Y)\).
>
> **Hint:** The within-group term averages the variances, (4+9)/2; the between-group term is the variance of the means 10 and 20 around 15.
>
> **Practice — Core:** With probability 0.6, \(X=0\) and \(Y\) is uniform on \(\{0,2\}\); with probability 0.4, \(X=1\) and \(Y\) is uniform on \(\{4,8\}\). Compute \(E[\operatorname{Var}(Y\mid X)]\), \(\operatorname{Var}(E[Y\mid X])\), and \(\operatorname{Var}(Y)\) directly from \(E[Y^2]-E[Y]^2\), and check the decomposition.
>
> **Hint:** The conditional means are 1 and 6 and the conditional variances 1 and 4; directly, E[Y] = 3 and E[Y²] = 17.2.
>
> **Practice — Stretch:** Two request types have variance \(400\text{ ms}^2\) each, means 100 and \(100+d\) ms, and the slow type has weight \(w\). Show that \(\operatorname{Var}(Y)=400+w(1-w)d^2\), predict which \(w\) maximizes it, and tabulate it for \(w\in\{0.1,0.3,0.5\}\) and \(d\in\{0,200,400\}\).
>
> **Hint:** The between-group term of a two-point mixture is w(1−w)d², which peaks at w = 0.5; the case w = 0.5, d = 400 reproduces the section's 40,400.

## 9. Covariance measures linear co-movement

For finite second moments,

$$
\operatorname{Cov}(X,Y)
=E[(X-E[X])(Y-E[Y])]
=E[XY]-E[X]E[Y].
$$

In the binary table,

$$
\operatorname{Cov}(X,Y)=0.40-0.50(0.60)=0.10.
$$

The covariance is positive because version B and passing occur together more often than independence would predict.

If both standard deviations are positive, correlation is

$$
\rho_{X,Y}
=\frac{\operatorname{Cov}(X,Y)}
{\operatorname{SD}(X)\operatorname{SD}(Y)}.
$$

It lies between \(-1\) and \(1\) and removes measurement units. It still summarizes only linear association.

![Positive, negative, near-zero, and nonlinear dependence patterns.](../assets/covariance-patterns.svg)

**Worked counterexample — dependent with zero covariance.** Let \(X\) be uniform on \(\{-1,0,1\}\) and \(Y=X^2\). Then \(Y\) is determined by \(X\), but

$$
E[X]=0,
\qquad
E[XY]=E[X^3]=0,
$$

so covariance is zero. The curved pattern is invisible to a signed linear summary.

> **Practice — Foundation:** Before calculating, determine the sign of the covariance for each equally weighted dataset: (a) \((1,2),(2,4),(3,6)\); (b) \((1,3),(2,2),(3,1)\); (c) \((-1,1),(0,0),(1,1)\). Then confirm by computing.
>
> **Hint:** Check whether above-mean x values pair with above-mean y values; in (c), the deviations −1·(1/3) and 1·(1/3) cancel.
>
> **Practice — Core:** For the equally weighted pairs \((0,1),(1,3),(2,2),(3,6)\), compute the covariance using both \(E[XY]-E[X]E[Y]\) and centered products, then standardize it to a correlation.
>
> **Hint:** The means are 1.5 and 3 and E[XY] = 25/4; use population variances 1.25 and 3.5 in the denominator.
>
> **Practice — Stretch:** Let \(X\) be uniform on \(\{-2,-1,0,1,2\}\) and \(Y=|X|\). Plot the five points, show that \(\operatorname{Cov}(X,Y)=0\), and demonstrate dependence with \(P(Y=0\mid X=0)\) versus \(P(Y=0)\).
>
> **Hint:** E[X] = 0 and E[X|X|] = 0 by symmetry; the conditional probability is 1, while the marginal is 1/5.

## 10. Covariance matrices describe vector uncertainty

For a random vector \(Z\in\mathbb R^d\) with mean \(\mu\),

$$
\Sigma=E[(Z-\mu)(Z-\mu)^T].
$$

Its entry \(\Sigma_{ij}\) is \(\operatorname{Cov}(Z_i,Z_j)\). The matrix is symmetric, and for every vector \(a\),

$$
a^T\Sigma a
=\operatorname{Var}(a^TZ)\ge0.
$$

Thus every covariance matrix is positive semidefinite. A symmetric matrix with nonnegative diagonal entries is not automatically valid; all directional variances must be nonnegative.

For \(W=AZ+b\),

$$
E[W]=A\mu+b,
\qquad
\operatorname{Cov}(W)=A\Sigma A^T.
$$

Coordinatewise standardization sets marginal variances to one but leaves correlations. Whitening produces identity covariance, but identity covariance does not guarantee independence outside special distribution families.

> **Practice — Foundation:** Two variables have \(\operatorname{Var}(X)=4\), \(\operatorname{Var}(Y)=9\), and correlation \(0.5\). Build their \(2\times2\) covariance matrix and identify each entry.
>
> **Hint:** The off-diagonal entry is ρ·SD(X)·SD(Y) = 0.5·2·3; the diagonal entries are the variances.
>
> **Practice — Core:** For \(\Sigma=\begin{bmatrix}4&3\\3&9\end{bmatrix}\), compute \(a^T\Sigma a\) for \(a=(1,-1)\) and \(a=(2,1)\), and verify each against \(a_1^2\operatorname{Var}(X)+a_2^2\operatorname{Var}(Y)+2a_1a_2\operatorname{Cov}(X,Y)\).
>
> **Hint:** For (1, −1), the covariance term is −2·3, giving 4 + 9 − 6 = 7; for (2, 1), it is 16 + 9 + 12.
>
> **Practice — Stretch:** Pairwise-complete estimates give the correlation matrix \(\begin{bmatrix}1&0.9&0.1\\0.9&1&0.9\\0.1&0.9&1\end{bmatrix}\). Show that the direction \(a=(1,-1,1)\) has negative “variance,” and explain whether the likely cause is arithmetic, missing-data handling, or an invalid estimation procedure.
>
> **Hint:** Compute \(a^T\Sigma a=3-2(0.9)+2(0.1)-2(0.9)=-0.4\); entries estimated on different subsets of rows need not form a positive semidefinite matrix.

## 11. Aggregation can reverse a comparison

Suppose an easy and difficult subgroup have the following results:

| group | model A | model B |
|---|---:|---:|
| Easy | 90/100 = 90% | 19/20 = 95% |
| Difficult | 1/10 = 10% | 20/100 = 20% |

Model B is better inside both groups. Aggregating gives

$$
A:\;91/110\approx82.7\%,
\qquad
B:\;39/120=32.5\%.
$$

The reversal occurs because A was evaluated mostly on easy cases and B mostly on difficult ones. The marginal comparison uses different subgroup weights.

This does not mean every analysis should condition on every variable. State the target comparison, examine how groups were assigned or selected, and distinguish observational adjustment from a causal claim.

> **Practice — Foundation:** A model is 90% accurate on easy prompts and 20% on hard prompts. Compute its aggregate accuracy when the test mix is 50% easy and when it is 90% easy, and identify which weights control the result.
>
> **Hint:** Weight each subgroup rate by its share of the test set: 0.5·0.9 + 0.5·0.2 and 0.9·0.9 + 0.1·0.2.
>
> **Practice — Core:** Model A is evaluated on 100 easy and 20 hard prompts; model B on 20 easy and 100 hard. Choose integer correct counts so that B beats A in both groups but A wins overall, and verify all four subgroup rates and both aggregates.
>
> **Hint:** One solution: A gets 80/100 and 4/20, B gets 17/20 and 30/100; B wins 0.85 vs 0.80 and 0.30 vs 0.20, but A wins overall 84/120 vs 47/120.
>
> **Practice — Stretch:** Prompts are randomly split 100 each between models A and B. A uses a tool on 80 prompts (60 successes) and not on 20 (4 successes); B uses the tool on 20 (16 successes) and not on 80 (40 successes). Compare the models overall and within each tool-use stratum, and explain why the stratified comparison is not the right causal comparison.
>
> **Hint:** Overall, A wins 0.64 vs 0.56; within strata, B wins 0.80 vs 0.75 and 0.50 vs 0.20. Tool use is caused by the model, so it is a post-treatment variable, and stratifying on it compares different kinds of prompts.

## 12. Conditional independence

Variables \(X\) and \(Y\) are conditionally independent given \(Z\) when

$$
p(x,y\mid z)=p(x\mid z)p(y\mid z).
$$

Latency and token count may be dependent marginally because both vary with request type, yet approximately independent within each request type. Conversely, variables can be marginally independent but become dependent after conditioning on a selected subset.

Factorizations based on conditional independence power many probabilistic models. They are meaningful modelling claims, not algebraic conveniences that can be assumed after looking only at pairwise correlations.

> **Practice — Foundation:** Given \(Z=0\), \(X\sim\text{Bernoulli}(0.2)\) and \(Y\sim\text{Bernoulli}(0.3)\) are conditionally independent. Write \(X\perp Y\mid Z\) as a factorization and fill in the full \(2\times2\) table \(p(x,y\mid Z=0)\).
>
> **Hint:** Within the slice Z = 0, multiply the conditional marginals: p(1,1 | Z=0) = 0.2·0.3 = 0.06, and similarly for the other three cells.
>
> **Practice — Core:** Let \(Z\) be a fair bit; given \(Z=z\), let \(X,Y\) be independent Bernoulli\((0.1)\) if \(z=0\) and Bernoulli\((0.9)\) if \(z=1\). Verify conditional independence, then compute \(P(X=1,Y=1)\) and \(P(X=1)P(Y=1)\) marginally.
>
> **Hint:** Average the conditional products over Z: 0.5(0.01) + 0.5(0.81) = 0.41, while each marginal is 0.5, so the product is 0.25.
>
> **Practice — Stretch:** A bug \(X\) and a flaky test \(Y\) occur independently, each with probability 0.3, and an alarm \(Z\) fires iff at least one occurs. Compute \(P(X=1\mid Z=1)\) and \(P(X=1\mid Y=1,Z=1)\), and explain the selection mechanism that creates the dependence.
>
> **Hint:** P(Z=1) = 1 − 0.7² = 0.51, so P(X=1 | Z=1) = 0.3/0.51 ≈ 0.59; once the flaky test explains the alarm, the probability drops back to 0.3.

## 13. Evaluation failure modes

- **Rows are not necessarily units.** Turns from one conversation and samples from one user share context.
- **Separate metrics are related.** Accuracy and latency changes can be correlated across examples or runs.
- **Selection changes the joint law.** Filtering failed tool calls before evaluation conditions on an outcome-related event.
- **Mixtures create structure.** Heterogeneous subgroups can create large variance and dependence absent within groups.
- **Whitening is limited.** Removing second-order correlation does not remove nonlinear or higher-order dependence.
- **Conditional is not causal.** \(P(Y\mid X)\) does not say what an intervention on \(X\) would do without additional assumptions.

> **Practice — Foundation:** Match each scenario to marginalization, conditioning, dependence, covariance, or aggregation: (a) 5,000 turns from 50 conversations analyzed as iid rows; (b) accuracy reported only on tool calls that did not error; (c) overall means compared when model A saw 70% easy prompts and B saw 30%.
>
> **Hint:** Ask for each scenario what is repeated, what is filtered, and what is weighted: (a) dependence, (b) conditioning on a selected event, (c) aggregation.
>
> **Practice — Core:** Models A and B are run on 4 tasks with 25 prompts each; per-task accuracies are A: \((0.90,0.80,0.60,0.50)\) and B: \((0.85,0.75,0.65,0.45)\). Report the per-task paired differences, their mean, and a task-level standard error, and explain why 4 tasks rather than 200 rows is the relevant sample for generalizing to new tasks.
>
> **Hint:** The differences are (0.05, 0.05, −0.05, 0.05), with mean 0.025 and sample SD 0.05, so the task-level SE is 0.05/√4 = 0.025.
>
> **Practice — Stretch:** Scores for model A are math (seed 0: 0.62, seed 1: 0.70) and code (0.40, 0.42); for model B, math (0.66, 0.64) and code (0.38, 0.40). Compute each model's overall mean, the per-family mean differences, and the seed spread within each cell, and decide whether the table supports “A beats B.”
>
> **Hint:** The overall means are 0.535 and 0.520; the family differences are +0.01 and +0.02; A's math seeds differ by 0.08, larger than any gap between the models.

## 14. Runnable lab: finite joint marginals and covariance

Implement `joint_marginals_covariance` in [labs/exercises.py](../../labs/exercises.py). The input maps numeric pairs \((x,y)\) to nonnegative, possibly unnormalized weights. Return normalized marginal dictionaries and covariance.

Run:

```text
python -m labs.checks joint
```

The behavioral checks include sparse support, rescaled weights, invalid models, and the dependent \(Y=X^2\) construction with zero covariance.

### Guided extension

Using the same input format:

1. construct every positive-mass conditional PMF \(p(y\mid x)\);
2. verify each sums to one;
3. compute \(E[Y\mid X=x]\);
4. verify total expectation;
5. verify total variance by separately computing within- and between-group terms.

## 15. Derivations to own

1. Prove both marginals normalize.
2. Reconstruct a joint PMF from one marginal and one conditional PMF.
3. Prove total expectation in the finite case.
4. Derive the squared-error decomposition for conditional expectation.
5. Derive total variance and show why the cross-term vanishes.
6. Derive \(\operatorname{Var}(X+Y)\) including covariance.
7. Prove covariance matrices are positive semidefinite.
8. Derive \(\operatorname{Cov}(AZ+b)=A\Sigma A^T\).

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-joint
```

## 16. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–3. Read, normalize, marginalize, and condition finite joint distributions.

**A1 · Foundation · paper — Cumulative problem 1.** For the joint table \(p(0,0)=0.30,p(0,1)=0.20,p(1,0)=0.10,p(1,1)=0.40\), compute both marginals, \(P(Y=\cdot\mid X=0)\), \(P(Y=\cdot\mid X=1)\), \(P(X=\cdot\mid Y=0)\), and \(P(X=\cdot\mid Y=1)\).

**A2 · Foundation · paper — Cumulative problem 2.** Construct the joint PMF of two fair dice conditioned on their sum being at most five.

**A3 · Foundation · paper — Cumulative problem 3.** Verify total expectation for the request-type example.

### Core — problems 4–7. Derive variance and covariance properties and diagnose dependence.

**A4 · Core · paper — Cumulative problem 4.** Recompute total variance when the two latency types occur with probabilities 0.8 and 0.2.

**A5 · Core · paper — Cumulative problem 5.** Show directly that the zero-covariance \(Y=X^2\) example does not factorize.

**A6 · Core · paper — Cumulative problem 6.** Give a symmetric matrix with positive diagonal entries that is not positive semidefinite.

**A7 · Core · paper — Cumulative problem 7.** Derive the variance of \(a^TZ\) from the covariance matrix.

### Stretch — problems 8–12. Transfer joint reasoning to aggregation, clustered evaluation, and conditional structure.

**A8 · Stretch · paper — Cumulative problem 8.** Model A scores \(90/100\) on easy prompts and \(30/100\) on hard prompts. Model B scores \(171/200\) on easy prompts and \(14/50\) on hard prompts. Verify which model wins within each difficulty group and which wins overall; then recompute both overall accuracies under a common 50–50 difficulty mixture.

**A9 · Stretch · paper — Cumulative problem 9.** An evaluation has 20,000 turns from 200 conversations (100 turns each) with turn accuracy 0.8 and within-conversation correlation \(\rho=0.05\). Compute the iid standard error, the design effect \(1+(m-1)\rho\), the corrected standard error, and the effective sample size, and explain why the iid standard error is too small.

**A10 · Stretch · paper — Cumulative problem 10.** A request is long (\(Z=1\)) with probability 0.3. Given \(Z\), slow latency \(X\) and long output \(Y\) are independent binary variables with \(P(X=1\mid Z=0)=0.1\), \(P(Y=1\mid Z=0)=0.2\), \(P(X=1\mid Z=1)=0.7\), and \(P(Y=1\mid Z=1)=0.9\). Compute \(P(X=1)\), \(P(Y=1)\), \(P(X=1,Y=1)\), and \(\operatorname{Cov}(X,Y)\) to show that \(X\) and \(Y\) are conditionally independent given \(Z\) but marginally dependent.

**A11 · Stretch · paper — Cumulative problem 11.** Create a three-variable binary joint PMF for which \(X\) and \(Y\) are independent marginally but dependent after conditioning on \(Z=1\). Verify all claims from the table.

**A12 · Stretch · paper — Cumulative problem 12.** Models A and B are scored on tasks T1, T2, T3 with 800, 150, and 50 rows. Per-task accuracies are A: \((0.70,0.90,0.90)\) and B: \((0.75,0.80,0.80)\); A's two seeds have overall scores 0.73 and 0.75, and B's have 0.75 and 0.77. Compute the row-weighted and task-equal accuracies of each model, the per-task winners, and compare the seed spread with the gap. State which checks reveal that the row-weighted leaderboard order is misleading for a task-balanced target.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** Does zero covariance imply independence?

**K2 · Core · gate — Derivation.** Derive total variance by adding and subtracting the conditional mean.

**K3 · Core · gate — Calculation.** For Bernoulli marginals P(X=1)=0.6 and P(Y=1)=0.7, find the largest possible covariance.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-joint experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Can you identify a joint law from its two marginals?

**K6 · Stretch · gate — RE/RS transfer.** Audit uncertainty for two model scores on the same tasks.

## Mastery check

Given a new finite two-variable experiment, construct and normalize its joint table, derive marginals and conditionals, calculate a conditional expectation and covariance, verify total expectation or total variance, and identify the observational unit that carries dependence. Explain every result in plain language as well as notation.

Next: [transformations, convolution, and Jacobians](03-transformations-convolution-jacobians.md).
