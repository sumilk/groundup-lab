---
id: math.statistics.exponential-families-regression-glms
title: Exponential families, statistical regression, GLMs, and partial pooling
prerequisites: [math.statistics.sampling-design-ml-evaluation, math.linear-algebra.projections-least-squares, math.calculus.gradients-optimization]
answers: ps-11-exponential-families-regression-glms
estimated_hours: 50
---

# Exponential families, statistical regression, GLMs, and partial pooling

A regression is not merely a line fitted through points. It is a conditional probability model: the distribution of an outcome is allowed to change with measured inputs. That viewpoint unifies least squares, logistic regression, Poisson regression, analysis of variance, weighted estimation, and many hierarchical models used in AI experiments.

The unification begins one level earlier. A **sufficient statistic** identifies what a probability model permits us to discard, and an **exponential family** exposes a common geometry behind many likelihoods. Generalized linear models then make an exponential-family mean depend on a linear predictor through a link function. The result is a compact language for effects, uncertainty, diagnostics, and partial pooling—not just a collection of optimization objectives.

By the end, you should be able to prove sufficiency with the factorization theorem; recognize and manipulate exponential families; derive moments from a log-partition function; fit and interpret linear, logistic, and Poisson models; derive standard, heteroskedasticity-robust, and cluster-robust uncertainty; connect \(t\)-tests and ANOVA to regression; diagnose misspecification, separation, and overdispersion; explain iteratively reweighted least squares; and use mixed-effects models to represent grouped variation without either ignoring groups or estimating each group in isolation.

## 0. Regression models a conditional distribution

For an outcome \(Y\) and predictors \(X=x\), a regression model specifies some part of

$$
P(Y\mid X=x).
$$

The simplest target is the conditional mean

$$
m(x)=E[Y\mid X=x].
$$

A linear mean model asserts \(m(x)=x^T\beta\). This is a claim about the mean, not necessarily a claim that individual observations lie near a straight line or that \(X\) is random. A full Gaussian linear model adds

$$
Y_i\mid x_i\sim\mathcal N(x_i^T\beta,\sigma^2),
$$

usually with conditional independence across \(i\). The mean structure, variance structure, outcome distribution, and dependence structure are separate assumptions.

**Worked example — latency versus batch size.** Suppose \(Y\) is request latency and \(x\) contains an intercept and batch size. A line for \(E[Y\mid x]\) may be a useful local summary even if latency is right-skewed. Gaussian prediction intervals, however, require more: roughly stable conditional variance and an adequate conditional shape. Estimating an average slope can remain meaningful after Gaussianity fails, while a naive standard error or tail prediction can fail badly.

> **Practice — Foundation:** Two models share the mean \(E[Y\mid x]=1+2x\): (a) \(Y\mid x\sim\mathcal N(1+2x,1)\) and (b) \(Y\mid x\sim\mathcal N(1+2x,(1+x)^2)\). At \(x=3\), give the conditional mean and \(P(Y>9\mid x=3)\) under each model.
>
> **Hint:** Both means are \(7\); standardize \(9\) with standard deviation 1 in (a) and 4 in (b), so only the tail probability (about 0.023 versus 0.309) differs.
>
> **Practice — Core:** For \(E[Y\mid X=x]=2+0.4x\), interpret the intercept, slope, and predicted mean at \(x=5\).
>
> **Hint:** The intercept 2 is the mean at \(x=0\), the slope 0.4 is the mean change per one-unit increase in \(x\), and the prediction is \(2+0.4\cdot5=4\).
>
> **Practice — Stretch:** Model A: \(Y\mid x\sim\mathcal N(2x,1)\). Model B: \(Y=2x+\varepsilon\) with \(\varepsilon\) Laplace of scale 2 (density \(\tfrac14e^{-|\varepsilon|/2}\), variance 8). At \(x=1\), compute the conditional mean, conditional variance, and \(P(|Y-2|>4\mid x=1)\) under each, and state which regression conclusions (slope, predicted mean, prediction intervals) agree.
>
> **Hint:** The mean \(2x\) is identical, so slope and predicted mean agree; for the tails use \(P(|Z|>4)\approx6.3\times10^{-5}\) and the Laplace identity \(P(|\varepsilon|>c)=e^{-c/2}\).

For multivariable differentiation, review the [local calculus bridge](03-transformations-convolution-jacobians.md#local-calculus-bridge-gradients-and-jacobians): gradient/Jacobian shapes, the chain rule, Hessians, and the separate conditions for differentiating an expectation.

## 1. Sufficiency asks what the model lets us forget

Let \(X\) have density or mass \(p_\theta(x)\). A statistic \(T(X)\) is **sufficient** for \(\theta\) if the conditional distribution of the full data given \(T(X)\) does not depend on \(\theta\). Once \(T\) is known, the remaining arrangement contains no additional information about \(\theta\) under the assumed model.

The Fisher–Neyman factorization theorem gives a practical criterion. \(T\) is sufficient when

$$
p_\theta(x)=g_\theta(T(x))h(x),
$$

where \(h\) does not depend on \(\theta\). Every part involving the unknown parameter flows through \(T(x)\).

![Under an iid Bernoulli model, many sequences compress to the same sufficient count.](../assets/sufficiency-compression.svg)

For iid Bernoulli observations \(x_i\in\{0,1\}\),

$$
p_p(x_{1:n})
=\prod_{i=1}^n p^{x_i}(1-p)^{1-x_i}
=p^{\sum_i x_i}(1-p)^{n-\sum_i x_i}.
$$

Thus \(T(X)=\sum_iX_i\) is sufficient for \(p\). Conditional on \(T=s\), all binary sequences with \(s\) successes have the same probability \(1/\binom ns\), independent of \(p\).

**Worked example — why order suddenly matters.** If the model changes to \(P(X_i=1)=\operatorname{logit}^{-1}(\alpha+\beta i)\), the success count alone is not sufficient for \((\alpha,\beta)\). Early and late successes carry different evidence about the time trend. Sufficiency is never a property of a data summary by itself; it is a property relative to a model.

> **Practice — Foundation:** For iid Poisson data \(x=(2,0,3,1)\), factor the likelihood as \(g_\lambda(T(x))\,h(x)\), state \(T(x)\) and its observed value, and give \(h(x)\) numerically.
>
> **Hint:** \(\prod_ie^{-\lambda}\lambda^{x_i}/x_i!=e^{-4\lambda}\lambda^{\sum x_i}\cdot\prod_i1/x_i!\); the observed \(T=6\) and \(h(x)=1/(2!\,0!\,3!\,1!)=1/12\).
>
> **Practice — Core:** For three iid Bernoulli\((p)\) trials, compute \(P\{X=(1,0,1)\mid S=2\}\) as a function of \(p\) and show that it equals \(1/3\) for every \(p\).
>
> **Hint:** The numerator is \(p^2(1-p)\) and the denominator is \(P(S=2)=3p^2(1-p)\); the \(p\)-factors cancel.
>
> **Practice — Stretch:** Let \(X_i\sim\operatorname{Bernoulli}(\operatorname{sigmoid}(\alpha+\beta i))\) independently for \(i=1,\ldots,4\). Show that \(x=(1,1,0,0)\) and \(y=(0,0,1,1)\) have the same count but \(L(x)/L(y)=e^{-4\beta}\), so \((\sum_iX_i,n)\) is not sufficient for \((\alpha,\beta)\).
>
> **Hint:** The normalizers \(\prod_i(1+e^{\alpha+\beta i})\) are identical for both sequences, so the ratio is \(\exp\{\sum_i(x_i-y_i)(\alpha+\beta i)\}\).

## 2. Minimal sufficiency and information-preserving compression

A sufficient statistic can contain irrelevant detail: the full sample \(X\) is always sufficient for its own model. A statistic is **minimal sufficient** when every other sufficient statistic determines it, up to equivalent representations.

For dominated families, a useful likelihood-ratio criterion is

$$
\frac{p_\theta(x)}{p_\theta(y)}
\text{ is independent of }\theta
\quad\Longleftrightarrow\quad
T(x)=T(y).
$$

For iid Bernoulli data, the likelihood ratio for two sequences is independent of \(p\) exactly when they have the same success count. The count is therefore minimal sufficient.

For iid Gaussian observations with both \(\mu\) and \(\sigma^2\) unknown,

$$
\sum_i(x_i-\mu)^2
=\sum_i x_i^2-2\mu\sum_i x_i+n\mu^2.
$$

The likelihood depends on the data through

$$
T(X)=\left(\sum_iX_i,\sum_iX_i^2\right),
$$

or equivalently \((\bar X,\sum_i(X_i-\bar X)^2)\). The sample mean alone loses information about variance.

**Worked example — distributed aggregation.** Workers processing Gaussian observations need only transmit \(n\), \(\sum x_i\), and \(\sum x_i^2\) to reconstruct the Gaussian likelihood for \((\mu,\sigma^2)\). This is exact under the model, unlike a histogram approximation. If observations have worker-specific means, those global sums cease to preserve all relevant evidence.

> **Practice — Foundation:** For two iid Bernoulli\((p)\) trials, compute \(L(p;(1,0))/L(p;(0,1))\). Use it to explain why the full sample \((X_1,X_2)\), which takes four values, is sufficient but not minimal, while \(S=X_1+X_2\) takes three.
>
> **Hint:** The ratio is \(p(1-p)/[(1-p)p]=1\) for every \(p\), so a minimal statistic must merge \((1,0)\) and \((0,1)\).
>
> **Practice — Core:** For \(x=(1,3,2)\) iid from \(\mathcal N(\mu,1)\), factor the likelihood as \(g_\mu(\sum_ix_i)\,h(x)\), giving the numerical values of \(\sum_ix_i\) and \(\sum_ix_i^2\) and the explicit \(g\) and \(h\).
>
> **Hint:** Expand \(\sum_i(x_i-\mu)^2=\sum_ix_i^2-2\mu\sum_ix_i+3\mu^2=14-12\mu+3\mu^2\); only the terms containing \(\mu\) belong in \(g\).
>
> **Practice — Stretch:** For the Cauchy location model \(p_\theta(x)=1/[\pi(1+(x-\theta)^2)]\), the samples \((0,2)\) and \((-1,3)\) have the same mean. Compute their likelihood ratio at \(\theta=0\) and \(\theta=1\), conclude that the mean is not sufficient, and explain what this suggests about which families admit fixed-dimensional sufficient statistics.
>
> **Hint:** You should get ratios 4 and 6.25; a \(\theta\)-dependent ratio means the samples cannot share a sufficient value, and the Pitman–Koopman–Darmois theorem says only exponential families (with fixed support) compress to fixed dimension.

## 3. Exponential families expose a shared likelihood form

A regular exponential family has density or mass

$$
p_\eta(y)
=h(y)\exp\!\left(\eta^TT(y)-A(\eta)\right),
$$

where

- \(T(y)\) is the sufficient-statistic vector;
- \(\eta\) is the **natural parameter**;
- \(A(\eta)\) is the **log-partition function** that normalizes the distribution;
- \(h(y)\) is the base measure.

For iid observations,

$$
p_\eta(y_{1:n})
=\left[\prod_i h(y_i)\right]
\exp\!\left(\eta^T\sum_iT(y_i)-nA(\eta)\right),
$$

so \(\sum_iT(Y_i)\) is sufficient for \(\eta\).

Common one-parameter examples are:

| Distribution | Natural parameter \(\eta\) | Statistic \(T(y)\) | \(A(\eta)\) |
|---|---:|---:|---:|
| Bernoulli\((p)\) | \(\log[p/(1-p)]\) | \(y\) | \(\log(1+e^\eta)\) |
| Poisson\((\lambda)\) | \(\log\lambda\) | \(y\) | \(e^\eta\) |
| Gaussian\((\mu,\sigma^2) known\) | \(\mu/\sigma^2\) | \(y\) | \(\sigma^2\eta^2/2\) |

The categorical, multinomial, gamma, beta, and full Gaussian families also have exponential-family representations, sometimes with constrained or vector natural parameters.

**Worked example — Bernoulli in natural form.** With \(\eta=\log[p/(1-p)]\), \(p=e^\eta/(1+e^\eta)\). Then

$$
p^y(1-p)^{1-y}
=\exp\left(y\eta-\log(1+e^\eta)\right).
$$

The log odds are not an arbitrary logistic-regression convention; they are the Bernoulli natural parameter.

> **Practice — Foundation:** Write the Poisson\((\lambda=2)\) mass at \(y=3\) in the form \(h(y)\exp\{\eta y-A(\eta)\}\) with \(\eta=\log\lambda\). Give \(h(3)\), \(\eta\), and \(A(\eta)\), and check that the product equals \(e^{-2}2^3/3!\approx0.180\).
>
> **Hint:** \(\lambda^ye^{-\lambda}/y!=(1/y!)\exp(y\log\lambda-\lambda)\), so \(h(y)=1/y!\) and \(A(\eta)=e^\eta=2\).
>
> **Practice — Core:** Put \(\mathcal N(\mu,4)\) into the form \(h(y)\exp\{\eta T(y)-A(\eta)\}\). Identify \(h(y)\), \(T(y)\), \(\eta\), and \(A(\eta)\), and evaluate \(\eta\) and \(A(\eta)\) at \(\mu=2\).
>
> **Hint:** Expand \(-(y-\mu)^2/8=-y^2/8+y\mu/4-\mu^2/8\): the cross term gives \(\eta=\mu/4\), and \(\mu^2/8=2\eta^2\) is \(A\); at \(\mu=2\), \(\eta=0.5\) and \(A=0.5\).
>
> **Practice — Stretch:** For \(Y\sim\operatorname{Uniform}(0,\theta)\), show that \(\partial_\theta\log p_\theta(y)=-1/\theta\) on the support, so its expectation at \(\theta=2\) is \(-0.5\) rather than 0. Explain which exponential-family identity fails and why.
>
> **Hint:** Differentiating \(\int_0^\theta p_\theta(y)\,dy=1\) by Leibniz' rule produces a boundary term \(p_\theta(\theta)=1/\theta\); that term, absent when the support is fixed, is what breaks the zero-mean score.

## 4. The log-partition function generates moments and geometry

Normalization requires

$$
e^{A(\eta)}=\int h(y)e^{\eta^TT(y)}\,dy.
$$

Differentiate \(A\) under regularity conditions:

$$
\nabla A(\eta)=E_\eta[T(Y)],
\qquad
\nabla^2 A(\eta)=\operatorname{Cov}_\eta(T(Y)).
$$

The Hessian is positive semidefinite, so \(A\) is convex. Natural parameters \(\eta\) and mean parameters \(\mu_T=E[T(Y)]\) are related by the gradient map. Curvature measures uncertainty and also supplies Fisher information.

![The log-partition function maps natural parameters to moments and curvature.](../assets/exponential-family-map.svg)

**Worked example — Bernoulli curvature.** For Bernoulli data,

$$
A(\eta)=\log(1+e^\eta),\quad
A'(\eta)=\frac{e^\eta}{1+e^\eta}=p,
$$

and

$$
A''(\eta)=p(1-p)=\operatorname{Var}(Y).
$$

For a sample, the log likelihood is

$$
\ell(\eta)=\eta^T\sum_iT(y_i)-nA(\eta)+\text{constant}.
$$

Its score sets empirical sufficient statistics equal to model expectations:

$$
\frac1n\sum_iT(y_i)=\nabla A(\hat\eta).
$$

This **moment matching** explains many familiar MLE formulas.

> **Practice — Foundation:** For the Poisson log-partition \(A(\eta)=e^\eta\) at \(\lambda=3\) (so \(\eta=\log3\)), compute \(A'(\eta)\) and \(A''(\eta)\) numerically and identify them as moments of \(Y\).
>
> **Hint:** Both derivatives of \(e^\eta\) equal \(e^\eta=\lambda=3\), which are the Poisson mean and variance.
>
> **Practice — Core:** For Poisson data \(y=(1,4,2,5)\), write \(\ell(\eta)=\eta\sum_iy_i-nA(\eta)+\text{const}\), derive the score, solve for \(\hat\eta\), and verify the moment-matching equation \(A'(\hat\eta)=\bar y\).
>
> **Hint:** The score is \(\sum_iy_i-4e^\eta=12-4e^\eta\); its zero gives \(e^{\hat\eta}=3\), i.e. \(\hat\eta=\log3\approx1.099\).
>
> **Practice — Stretch:** Use the redundant Bernoulli representation \(T(y)=(\mathbf1\{y=0\},\mathbf1\{y=1\})\), \(\eta=(\eta_0,\eta_1)\), \(A(\eta)=\log(e^{\eta_0}+e^{\eta_1})\). Compute \(\nabla^2A\) at \(\eta=(0,0)\), show it is singular, and find the direction along which \(\eta\) changes but the distribution does not.
>
> **Hint:** \(\nabla^2A=\operatorname{Cov}(T)\), and \(T_0+T_1=1\) is constant, so at \(p=1/2\) the Hessian is \(0.25\begin{pmatrix}1&-1\\-1&1\end{pmatrix}\) with null vector \((1,1)\).

## 5. Sufficiency helps estimators, but only inside the model

If \(T\) is sufficient and \(U(X)\) is an unbiased estimator, the Rao–Blackwell estimator

$$
\tilde U(T)=E[U(X)\mid T]
$$

is still unbiased and has no larger variance:

$$
\operatorname{Var}(U)
=E[\operatorname{Var}(U\mid T)]
+\operatorname{Var}(E[U\mid T]).
$$

Thus conditioning on \(T\) removes variation irrelevant to \(\theta\) under the model. With an additional **completeness** property, an unbiased function of a complete sufficient statistic is the unique minimum-variance unbiased estimator.

These are model-based guarantees, not universal compression guarantees. If sequence order reveals drift, subgroup labels reveal heterogeneity, or acquisition metadata reveals selection, discarding them may make the model impossible to criticize. A statistic can be sufficient for parameters in a wrong model while hiding why the model is wrong.

**Worked example — one Bernoulli draw selected at random.** Let \(U=X_1\), an unbiased estimator of \(p\). Given \(S=\sum_iX_i\), exchangeability gives \(E[X_1\mid S]=S/n=\bar X\). Rao–Blackwellization turns one noisy bit into the sample proportion, whose variance is \(p(1-p)/n\) rather than \(p(1-p)\).

> **Practice — Foundation:** Let \(U=X_1\) with \(X_1,\ldots,X_4\) iid Bernoulli\((0.3)\) and \(S=\sum_iX_i\). Using \(\operatorname{Var}(U)=E[\operatorname{Var}(U\mid S)]+\operatorname{Var}(E[U\mid S])\), compute \(\operatorname{Var}(U)\), \(\operatorname{Var}(E[U\mid S])\), and \(E[\operatorname{Var}(U\mid S)]\).
>
> **Hint:** \(E[U\mid S]=S/4\), so \(\operatorname{Var}(E[U\mid S])=0.21/4=0.0525\); the remaining \(0.21-0.0525\) is the nonnegative term that conditioning removes.
>
> **Practice — Core:** With \(X_1,X_2,X_3\) iid Bernoulli\((p)\), \(U=X_1X_2\) is unbiased for \(p^2\). Compute \(E[U\mid S=s]\) for \(s=0,1,2,3\), show it equals \(S(S-1)/6\), and compare \(\operatorname{Var}(U)\) with the Rao–Blackwellized variance at \(p=0.5\).
>
> **Hint:** Given \(S=s\), the successes occupy a uniformly random \(s\)-subset of three positions, so \(P(X_1=X_2=1\mid S=s)=s(s-1)/(3\cdot2)\); at \(p=0.5\) compare \(0.1875\) with \(5/48\approx0.104\).
>
> **Practice — Stretch:** Two annotators each label 10 items: A marks 9 successes and B marks 1. Under a common-\(p\) iid model, \(S=10\) of \(n=20\) is sufficient. Compute \(\hat p\), then use the raw split to compute the Pearson \(\chi^2\) homogeneity statistic and its \(p\)-value, and explain what storing only \(S\) would have made impossible.
>
> **Hint:** Under the common-\(p\) model every expected cell count is 5, so the statistic is \(4\cdot(9-5)^2/5=12.8\) on 1 degree of freedom.

## 6. Linear regression is projection plus a sampling model

Stack \(n\) outcomes into \(y\in\mathbb R^n\) and predictor rows into \(X\in\mathbb R^{n\times p}\). Ordinary least squares chooses

$$
\hat\beta=\arg\min_b\lVert y-Xb\rVert_2^2.
$$

Differentiating gives the normal equations

$$
X^TX\hat\beta=X^Ty.
$$

When \(X\) has full column rank, the algebraic expression is \((X^TX)^{-1}X^Ty\), but numerical software should solve a least-squares problem with QR or SVD rather than explicitly forming the inverse. The fitted vector

$$
\hat y=X\hat\beta=Hy,
\qquad H=X(X^TX)^{-1}X^T,
$$

is the projection of \(y\) onto the column space of \(X\). Residuals \(e=y-\hat y\) are orthogonal to every fitted predictor column: \(X^Te=0\).

![Least squares decomposes the outcome into a fitted projection and an orthogonal residual.](../assets/vector-projection.svg)

With conditionally iid Gaussian errors, OLS is also the MLE of \(\beta\). The projection result needs no Gaussian assumption; exact small-sample probability statements do.

**Worked example — a binary treatment indicator.** Let \(X\) contain an intercept and \(z_i\in\{0,1\}\). The fitted intercept is the control mean, and the fitted coefficient of \(z\) is treated mean minus control mean. A two-group difference in means is therefore a regression coefficient.

> **Practice — Foundation:** Fit OLS with an intercept to \(x=(0,1,2)\), \(y=(1,1,4)\), and verify \(\sum_ie_i=0\). Then show that this identity is exactly the intercept row of \(X^Te=0\).
>
> **Hint:** The first column of \(X\) is \(\mathbf1\), so the first normal equation reads \(\mathbf1^Te=\sum_ie_i=0\); your fitted line should be \(0.5+1.5x\).
>
> **Practice — Core:** By centering, derive \(\hat\beta_1=S_{xy}/S_{xx}\) and \(\hat\beta_0=\bar y-\hat\beta_1\bar x\) for simple regression, then apply them to \(x=(1,2,3,6)\), \(y=(2,3,5,6)\).
>
> **Hint:** Write \(y_i-b_0-b_1x_i=(\tilde y_i-b_1\tilde x_i)+(\bar y-b_0-b_1\bar x)\); the cross term vanishes, and here \(S_{xy}=11\), \(S_{xx}=14\).
>
> **Practice — Stretch:** Let \(X\) have columns \(\mathbf1\), \(x\), and \(2x\) with \(x=(0,1,2)\) and \(y=(1,1,4)\). Show that \(\beta=(0.5,1.5,0)\) and \(\beta=(0.5,0.5,0.5)\) give the same fitted vector, find the null space of \(X\), and state which object remains unique.
>
> **Hint:** Column 3 is twice column 2, so any \(\beta+c(0,2,-1)\) gives the same \(X\beta\); the projection \(\hat y=(0.5,2,3.5)\) is unique while coefficients are not.

## 7. Coefficients are conditional comparisons, not automatic causes

In the multiple linear mean model

$$
E[Y\mid X]=\beta_0+\beta_1X_1+\cdots+\beta_pX_p,
$$

\(\beta_j\) is the change in fitted conditional mean for a one-unit increase in \(X_j\), holding the other represented predictors fixed. This interpretation depends on coding and functional form.

It is not automatically causal. A causal interpretation additionally needs a design or identification argument: random assignment, an adequate adjustment set under a causal model, or another defensible source of exogenous variation. Controlling for a mediator or collider can create rather than remove bias.

Scaling also matters. Replacing \(X_j\) by \(X_j/1000\) multiplies its coefficient by 1000 without changing predictions. Centering changes the intercept and lower-order terms in models with interactions, not the fitted surface.

**Worked example — model size and benchmark score.** A positive coefficient on parameter count after controlling for training compute compares models at the same represented compute. It does not estimate what would happen if one enlarged a fixed model while keeping every other training choice coherent. Architecture, data, optimizer, and selection may all confound the observed association.

> **Practice — Foundation:** A fitted model is \(E[\text{reward}]=3.1-0.7\,\text{latency}+0.2\,\text{length}\), with latency in seconds and length in hundreds of tokens. Compute the predicted reward difference between responses with latencies 2.5 s and 1.0 s at equal length, and state what is held fixed.
>
> **Hint:** Only the latency term changes: \(-0.7\times(2.5-1.0)=-1.05\), with length held at the same value in both predictions.
>
> **Practice — Core:** A fit on file size in bytes gives \(\hat y=4+3\times10^{-9}b\). Rewrite it using gigabytes \(g=b/10^9\), and check that both versions give the same prediction for a 2.5 GB file.
>
> **Hint:** Substitute \(b=10^9g\): the coefficient is multiplied by \(10^9\) to become 3, and both versions predict \(4+3\times2.5=11.5\).
>
> **Practice — Stretch:** Let \(T\sim\operatorname{Bernoulli}(0.5)\) be randomized, \(U,V\) iid \(\mathcal N(0,1)\), \(Y=T+U\), and \(C=T+U+V\). Draw the causal graph, show that the regression of \(Y\) on \(T\) has slope 1, and show that \(E[Y\mid T,C]=0.5T+0.5C\), so adjusting for \(C\) biases the treatment coefficient.
>
> **Hint:** Given \(T\), \(C-T=U+V\) with equal variances, so \(E[U\mid T,C]=(C-T)/2\); substitute into \(Y=T+U\). \(C\) is a common effect of \(T\) and \(U\).

## 8. Sampling distributions turn fitted coefficients into uncertain estimates

Under the fixed-design homoskedastic model

$$
y=X\beta+\varepsilon,
\qquad E[\varepsilon\mid X]=0,
\qquad \operatorname{Var}(\varepsilon\mid X)=\sigma^2I,
$$

the OLS error is

$$
\hat\beta-\beta=(X^TX)^{-1}X^T\varepsilon,
$$

so

$$
E[\hat\beta\mid X]=\beta,
\qquad
\operatorname{Var}(\hat\beta\mid X)=\sigma^2(X^TX)^{-1}.
$$

Estimate noise variance by

$$
s^2=\frac{\lVert e\rVert^2}{n-p}.
$$

The \(n-p\) denominator reflects the \(p\) fitted directions consumed by the projection. Under Gaussian errors,

$$
\frac{\hat\beta_j-\beta_j}{s\sqrt{(X^TX)^{-1}_{jj}}}
\sim t_{n-p}.
$$

Without Gaussian errors, the same standardization is often asymptotically normal under suitable conditions, but exact finite-sample \(t\) claims no longer follow.

**Worked example — why predictor spread matters.** In simple regression with an intercept,

$$
\operatorname{SE}(\hat\beta_1)=\frac{s}{\sqrt{\sum_i(x_i-\bar x)^2}}.
$$

More observations help, but so does placing observations across a wider informative range. Repeating the same \(x\) value cannot identify a slope regardless of sample size.

> **Practice — Foundation:** For simple regression with an intercept, design \(x=(0,2,4,6)\), and residual scale \(s=1.5\), compute \(S_{xx}\), the slope entry \((X^TX)^{-1}_{22}\), and the slope standard error \(s\sqrt{(X^TX)^{-1}_{22}}\).
>
> **Hint:** The slope entry of \((X^TX)^{-1}\) is \(1/S_{xx}\) with \(S_{xx}=20\) here; \(s\) supplies the noise scale and \(1/\sqrt{S_{xx}}\) the design spread.
>
> **Practice — Core:** Derive \(\operatorname{Var}(\hat\beta\mid X)=\sigma^2(X^TX)^{-1}\) from \(\hat\beta-\beta=(X^TX)^{-1}X^T\varepsilon\), then evaluate it for an intercept plus \(x=(-1,0,1)\) with \(\sigma^2=2\).
>
> **Hint:** Use \(\operatorname{Var}(A\varepsilon)=A\operatorname{Var}(\varepsilon)A^T\) with \(A=(X^TX)^{-1}X^T\); here \(X^TX=\operatorname{diag}(3,2)\).
>
> **Practice — Stretch:** Design 1 has \(n=1000\) rows, 500 at \(x=1.00\) and 500 at \(x=1.02\). Design 2 has 10 rows, 5 at \(x=0\) and 5 at \(x=2\). With \(\sigma=1\), compute \(S_{xx}\) and the slope standard error for each, and use \(X^TX\) to diagnose why the large design is worse.
>
> **Hint:** With half the rows at each of two points \(a,b\), \(S_{xx}=n(b-a)^2/4\): 0.1 versus 10, so small spread makes \(S_{xx}\) tiny regardless of \(n\).

## 9. Tests, confidence intervals, and ANOVA are regression operations

A linear hypothesis has the form

$$
H_0:R\beta=r.
$$

For one contrast \(c^T\beta\), a \(t\)-statistic divides the estimated contrast by its standard error. For several simultaneous restrictions, compare the increase in residual sum of squares from a restricted model to the unrestricted residual scale:

$$
F=
\frac{(\operatorname{RSS}_R-\operatorname{RSS}_U)/q}
{\operatorname{RSS}_U/(n-p)},
$$

where \(q\) restrictions were imposed.

Analysis of variance is regression with categorical predictors encoded by indicator columns. A one-way ANOVA tests whether adding group indicators improves fit beyond a common intercept. A factorial ANOVA adds multiple factors and their interaction columns. The method is not a separate universe from linear models.

**Worked example — three prompting strategies.** Encode baseline, chain-of-thought, and tool-use strategies with an intercept plus two indicators. The indicator coefficients compare each strategy with baseline. Testing both coefficients jointly asks whether all three population means are equal. Changing the reference group changes individual coefficient labels but not the joint fitted model or omnibus test.

Multiple comparisons remain multiple comparisons. Inspecting every pair, subgroup, benchmark, and transformation requires prespecification or family-aware uncertainty, as developed in Chapter 8.

> **Practice — Foundation:** A category takes values base, cot, and tool. With an intercept and base as reference, write the design rows for four observations (base, cot, tool, cot). Then show that adding a third indicator for base creates an exact column dependence.
>
> **Hint:** The three indicator columns sum to the intercept column; dropping the base indicator removes that exact dependence.
>
> **Practice — Core:** Groups A \(=(3,5,4)\) and B \(=(7,9,8)\). Regress \(y\) on an intercept and \(z=\mathbf1\{B\}\): give \(\hat\beta_0\), \(\hat\beta_1\), \(s^2\), \(\operatorname{SE}(\hat\beta_1)\), and \(t\), and check that \(t\) equals the pooled two-sample \(t\)-statistic.
>
> **Hint:** With a 0/1 indicator, \(\hat\beta_0\) is the A mean and \(\hat\beta_1\) the difference in means; \(\operatorname{SE}(\hat\beta_1)=s\sqrt{1/3+1/3}\) is the pooled two-sample formula.
>
> **Practice — Stretch:** In a \(2\times2\) factorial with \(\pm1\) coding and \(E[Y]=\beta_0+\beta_Aa+\beta_Bb+\beta_{AB}ab\), the cell means are \(\mu_{--}=10\), \(\mu_{+-}=16\), \(\mu_{-+}=14\), \(\mu_{++}=8\). Write the contrast vectors for \(\beta_A\) and \(\beta_{AB}\), compute all four coefficients and the effect of \(A\) at each level of \(B\), and explain why the main effect of \(A\) misleads here.
>
> **Hint:** Each coefficient is a quarter of a signed sum of cell means, e.g. \(\beta_A=(\mu_{+-}+\mu_{++}-\mu_{--}-\mu_{-+})/4\); then compare the simple effects of \(A\) at \(b=-1\) and \(b=+1\).

## 10. Diagnostics target different assumption failures

Regression assumptions do not collapse into one residual plot. Ask separate questions:

1. **Mean form:** is \(E[Y\mid X]\) represented adequately?
2. **Variance form:** is conditional variance constant or correctly modeled?
3. **Dependence:** are residuals correlated within user, task, time, or run?
4. **Tail behavior:** do a few observations dominate estimates or small-sample approximations?
5. **Leverage:** are some predictor rows geometrically unusual?
6. **Selection:** does the observed sample represent the target population?

Leverage is the diagonal \(h_{ii}\) of the hat matrix. A high-leverage row has unusual predictors and can strongly change the fit if its residual is also large. Influence combines predictor geometry and outcome disagreement; Cook-like diagnostics quantify the fitted change after deletion.

Residual-versus-fitted plots reveal nonlinear means and changing spread; scale-location plots emphasize heteroskedasticity; quantile plots examine residual shape; grouped and time-ordered residual plots reveal dependence. Diagnostics suggest specific revisions—they do not certify a model because a cloud “looks random.”

**Worked example — long-context evaluations.** If residual variance grows with context length, a constant-variance standard error is suspect. If the mean also bends near the context limit, robust standard errors repair neither the linear mean nor extrapolation beyond observed lengths. Add a justified nonlinear term or model separate regions, then evaluate on held-out context ranges.

> **Practice — Foundation:** For \(x=(0,1,2,10)\) in a simple regression with an intercept, compute each leverage \(h_{ii}=1/n+(x_i-\bar x)^2/S_{xx}\), check that they sum to 2, and explain why row 4 can be influential even if its residual is small.
>
> **Hint:** Here \(\bar x=3.25\) and \(S_{xx}=62.75\); leverage uses only \(x\), whereas a residual and an influence measure such as Cook's distance also involve \(y\).
>
> **Practice — Core:** Match each residual summary to an assumption failure: (a) residual means by \(x\)-bin are \(+2,-1,-2,-1,+2\); (b) residual SDs by fitted-value bin are \(0.5,1,2,4\); (c) residuals from the same prompt share means such as \(+1.5\) and \(-1.2\), with within-prompt correlation 0.4; (d) one residual equals 6 at a row with leverage 0.9.
>
> **Hint:** A U-shape in bin means signals mean form, SD growing with the fit signals variance, shared prompt means signal dependence, and a large residual at high leverage signals influence.
>
> **Practice — Stretch:** Twenty sampled tasks have effects of 0.1 on 18 easy tasks and 1.5 on 2 hard tasks, and the two hard tasks are flagged as influential. The deployment population is 10% hard. Compute the mean effect with and without the flagged tasks and the population-target mean, and explain what deletion did to the estimand.
>
> **Hint:** The full-sample mean \((18\cdot0.1+2\cdot1.5)/20\) matches the population mix \(0.9(0.1)+0.1(1.5)\); deletion leaves only the easy-task effect.

## 11. Sandwich uncertainty tolerates heteroskedasticity

If the conditional mean is correctly specified but

$$
\operatorname{Var}(\varepsilon\mid X)=\Omega
$$

is not \(\sigma^2I\), OLS can still estimate the linear mean consistently under suitable exogeneity and sampling conditions. Its covariance becomes

$$
\operatorname{Var}(\hat\beta\mid X)
=(X^TX)^{-1}X^T\Omega X(X^TX)^{-1}.
$$

The heteroskedasticity-consistent **sandwich estimator** replaces unknown error variances with squared residuals:

$$
\widehat V_{\mathrm{HC0}}
=(X^TX)^{-1}
\left(\sum_i e_i^2x_ix_i^T\right)
(X^TX)^{-1}.
$$

Small-sample variants adjust residuals for degrees of freedom or leverage because high-leverage residuals are mechanically shrunken. “Robust standard error” is incomplete reporting; name the estimator and independent sampling unit.

When rows share a cluster \(g\), preserve within-cluster covariance by aggregating score-like contributions before taking outer products:

$$
\widehat V_{\mathrm{cluster}}
=(X^TX)^{-1}
\left(\sum_g X_g^Te_ge_g^TX_g\right)
(X^TX)^{-1},
$$

plus an appropriate finite-cluster correction. Precision is then governed largely by the number and diversity of clusters, not the number of correlated rows.

**Worked example — repeated prompts.** Comparing two systems on 10,000 outputs generated from only 40 prompts does not create 10,000 independent prompt draws. Row-wise HC standard errors can allow unequal output variance, but they still ignore shared prompt difficulty. Cluster at the prompt level, preserve system pairing, and be cautious with only 40 clusters.

Robust covariance repairs a variance formula. It does not repair omitted-variable bias, nonlinear means, selection bias, measurement error, poor overlap, or an undefined target population.

> **Practice — Foundation:** Reuse the problem-4 data \(x=(0,1,2,3)\) with residuals \(e=(0.3,0.1,-1.1,0.7)\). Write the bread \((X^TX)^{-1}\) and the meat \(\sum_ie_i^2x_ix_i^T\) numerically for \(x_i=(1,x_i)^T\), and verify that the slope entry of the HC0 sandwich is \(0.0644\).
>
> **Hint:** \(X^TX\) has entries \(4,6,6,14\); the meat entries are \(\sum e_i^2=1.8\), \(\sum e_i^2x_i=3.9\), and \(\sum e_i^2x_i^2=9.26\).
>
> **Practice — Core:** Fit an intercept-only model to four rows in two clusters, with residuals \((1,1)\) in cluster 1 and \((-1,-1)\) in cluster 2. Compute the HC0 variance and the cluster-robust variance (no finite-cluster correction). Repeat with residuals \((1,-1)\) in both clusters, and explain why clustering sums \(x_ie_i\) within groups before squaring.
>
> **Hint:** With only an intercept, the bread is \(1/n=1/4\) and the meat is \(\sum_ie_i^2\) row-wise versus \(\sum_g(\sum_{i\in g}e_i)^2\) when clustered; same-sign residuals add before squaring.
>
> **Practice — Stretch:** Let \(Z,U,\varepsilon\) be independent \(\mathcal N(0,1)\), \(T=Z+U\), and \(Y=2Z+(1+|T|)\varepsilon\). Compute the population OLS slope of \(Y\) on \(T\) and the causal effect of \(T\) on \(Y\), and explain why HC1 intervals can cover the former but not the latter.
>
> **Hint:** The population slope is \(\operatorname{Cov}(Y,T)/\operatorname{Var}(T)=2/2=1\), while \(T\) has no arrow into \(Y\), so its causal effect is 0; heteroskedasticity only affects the variance.

## 12. Weighted and generalized least squares encode different reasons for weighting

Weighted least squares minimizes

$$
\sum_i w_i(y_i-x_i^T\beta)^2.
$$

If independent errors have known variances \(\operatorname{Var}(\varepsilon_i\mid X)=\sigma_i^2\), choosing \(w_i=1/\sigma_i^2\) gives more influence to precise observations. More generally, if \(\operatorname{Var}(\varepsilon\mid X)=\Sigma\), generalized least squares minimizes

$$
(y-X\beta)^T\Sigma^{-1}(y-X\beta).
$$

Whitening by a matrix \(L\) with \(L^TL=\Sigma^{-1}\) turns this into ordinary least squares on \(Ly\) and \(LX\).

Do not confuse precision weights with sampling or inverse-propensity weights. Precision weighting changes efficiency for a conditional model. Sampling weights change which population the estimating equation represents. Frequency weights describe replicated cases. Software may use the same argument name for all three while their estimands and valid uncertainty differ.

**Worked example — benchmark aggregation.** Suppose task-level score estimates have different Monte Carlo variances. Inverse-variance weighting estimates a precision-weighted task effect, not the average effect over a deployment task distribution. If deployment weights are specified, use those for the estimand and propagate each task's uncertainty separately.

> **Practice — Foundation:** Two independent measurements are \(y_1=10\) with variance 1 and \(y_2=16\) with variance 4. Compute the normalized inverse-variance weights, the weighted mean, and its variance, and state why the second observation receives one quarter of the first's weight.
>
> **Hint:** The weights are \(1/\sigma_i^2=(1,1/4)\); the estimate is \(\sum_iw_iy_i/\sum_iw_i\) with variance \(1/\sum_iw_i\).
>
> **Practice — Core:** Show that if \(\Sigma=CC^T\) and \(L=C^{-1}\), then \(\lVert Ly-LX\beta\rVert^2=(y-X\beta)^T\Sigma^{-1}(y-X\beta)\). Check numerically with \(\Sigma=\operatorname{diag}(1,4)\), \(y=(10,16)\), and \(X=\mathbf1\) that OLS on the whitened data gives 11.2.
>
> **Hint:** \((C^{-1})^TC^{-1}=(CC^T)^{-1}=\Sigma^{-1}\); here \(C^{-1}=\operatorname{diag}(1,1/2)\) gives \(y^\star=(10,8)\) and \(X^\star=(1,0.5)\).
>
> **Practice — Stretch:** Stratum 1 has estimated effect 1.0 with SE 0.1 and makes up 20% of the population; stratum 2 has effect 3.0 with SE 0.3 and makes up 80%. Compute the inverse-variance-weighted and population-weighted averages, and state the question each answers correctly.
>
> **Hint:** Inverse-variance weights \(1/0.01\) and \(1/0.09\) give shares 0.9 and 0.1; population weights 0.2 and 0.8 target the average effect over the population.

## 13. A generalized linear model has three moving parts

A generalized linear model (GLM) specifies:

1. an exponential-family conditional distribution for \(Y_i\mid x_i\);
2. a linear predictor \(\eta_i=x_i^T\beta\);
3. a link \(g\) connecting the conditional mean \(\mu_i=E[Y_i\mid x_i]\) to the predictor:

$$
g(\mu_i)=\eta_i.
$$

![A GLM maps predictors through a linear predictor and inverse link to a conditional outcome distribution.](../assets/glm-link-mean.svg)

For a one-parameter exponential family with dispersion \(\phi\), a common representation is

$$
p(y\mid\theta,\phi)
=\exp\left(
\frac{y\theta-b(\theta)}{a(\phi)}+c(y,\phi)
\right).
$$

Then

$$
E[Y]=b'(\theta),
\qquad
\operatorname{Var}(Y)=b''(\theta)a(\phi).
$$

The **canonical link** sets the natural parameter \(\theta\) equal to \(x^T\beta\). Identity is canonical for Gaussian means, logit for Bernoulli means, and log for Poisson means. Noncanonical links are allowed when scientific interpretation or constraints favor them.

| Outcome | Mean range | Common link | Conditional variance |
|---|---:|---:|---:|
| Gaussian | \(\mathbb R\) | identity | \(\sigma^2\) |
| Bernoulli | \((0,1)\) | logit | \(\mu(1-\mu)\) |
| Poisson | \((0,\infty)\) | log | \(\mu\) |

The link does not transform observed outcomes into Gaussian data. It transforms the modeled mean. A log link does not mean “take logs and run OLS”; zeros remain valid Poisson outcomes and the variance model remains different.

**Worked example — choosing all three parts.** For whether an evaluation item passes, choose a Bernoulli outcome, linear predictor containing system and task features, and logit link. For failures counted over unequal accelerator-hours, choose a Poisson or overdispersed count family, a predictor with hardware features, a log link, and log exposure as an offset. Changing only the link does not turn a binary outcome into a count model.

> **Practice — Foundation:** For the logistic model \(\operatorname{logit}\mu=-1+0.5x\), name the random component, linear predictor, and link, and compute the fitted mean at \(x=4\).
>
> **Hint:** Bernoulli\((\mu)\) is the random component, \(\eta=-1+0.5x\) the linear predictor, and logit the link; invert with \(\mu=1/(1+e^{-\eta})\) at \(\eta=1\).
>
> **Practice — Core:** An identity-link Bernoulli model fitted on \(x\in[0,6]\) gives \(\mu=0.2+0.1x\); a logit-link fit gives \(\operatorname{logit}\mu=-1.39+0.5x\). Compute both fitted means at \(x=-3\) and \(x=10\), and explain which model can produce invalid probabilities.
>
> **Hint:** The identity inverse link returns \(\eta\) itself, which is unbounded (\(-0.1\) and \(1.2\) here); the logistic inverse \(1/(1+e^{-\eta})\) lies in \((0,1)\) for every \(\eta\).
>
> **Practice — Stretch:** Take the complementary log-log link \(\mu=1-\exp(-e^\eta)\) with \(\eta=\log(\lambda t)\). Show that \(\mu\) equals the probability of at least one event of a Poisson process with rate \(\lambda\) over time \(t\), evaluate \(\mu\) and \(d\mu/d\eta\) for \(\lambda=0.002\), \(t=500\), and explain what the score loses relative to the canonical logit link.
>
> **Hint:** \(1-\exp(-e^\eta)=1-e^{-\lambda t}\); for the score, the chain rule adds the factor \((d\mu/d\eta)/[\mu(1-\mu)]\), which is not 1, so the simple \(X^T(y-\mu)\) form is lost.

## 14. Logistic regression models log odds and Bernoulli information

For \(Y_i\in\{0,1\}\), logistic regression sets

$$
p_i=P(Y_i=1\mid x_i)=\sigma(x_i^T\beta),
\qquad
\log\frac{p_i}{1-p_i}=x_i^T\beta.
$$

The log likelihood is

$$
\ell(\beta)=\sum_i\left[y_i\eta_i-\log(1+e^{\eta_i})\right],
\qquad \eta_i=x_i^T\beta.
$$

Its score and observed information are

$$
\nabla\ell=X^T(y-p),
\qquad
-\nabla^2\ell=X^TWX,
$$

where \(W_{ii}=p_i(1-p_i)\). The information vanishes near probabilities zero and one: labels there change the fitted boundary less than uncertain cases with similar predictor geometry.

Exponentiating \(\beta_j\) gives the conditional **odds ratio** for a one-unit predictor increase, holding represented covariates fixed. It is not a risk ratio and not a constant probability difference. The probability change depends on the starting probability:

$$
\frac{\partial p}{\partial x_j}=\beta_jp(1-p).
$$

**Worked example — the same odds ratio, different probability changes.** If \(\beta_j=\log2\), the odds double. Starting at \(p=0.5\), probability becomes \(2/3\), a 0.167 increase. Starting at \(p=0.01\), it becomes about 0.0198, an increase below 0.01.

Evaluate probabilistic predictions with proper losses and calibration, not only a thresholded accuracy. Case-control or outcome-dependent sampling can preserve some slope information while changing the intercept and deployment probabilities; sampling design must be reflected in fitting and recalibration.

> **Practice — Foundation:** A logistic coefficient of \(\log1.5\) is attached to a binary \(x\), and \(P(Y=1\mid x=0)=0.4\). Interpret the odds ratio, and compute the odds and probability at \(x=1\).
>
> **Hint:** Multiply the odds \(0.4/0.6\) by \(e^{\log1.5}=1.5\), then convert back with \(p=\text{odds}/(1+\text{odds})\).
>
> **Practice — Core:** Derive the logistic score \(X^T(y-p)\) from the Bernoulli log likelihood. Evaluate it at \(\beta=(0,0)\) for an intercept plus \(x=(-1,0,1,2)\) and \(y=(0,0,1,1)\).
>
> **Hint:** Differentiating \(y\eta-\log(1+e^\eta)\) gives \(y-\sigma(\eta)\) times \(\partial\eta/\partial\beta=x_i\); at \(\beta=0\) every \(\sigma(\eta_i)=0.5\).
>
> **Practice — Stretch:** A treatment has conditional odds ratio 3 in every subgroup. Compute treated risks and risk differences for baseline risks 0.02, 0.25, 0.5, and 0.9. Then for a population that is half 0.02-baseline and half 0.9-baseline, compute the marginal risk difference and marginal odds ratio.
>
> **Hint:** Convert each baseline to odds, multiply by 3, and convert back; for the mixture, average probabilities (not odds) before forming the marginal contrasts.

## 15. Bradley–Terry turns pairwise preferences into a logistic model

Logistic regression models a binary outcome given covariates. Replace "did the event occur" with "did item \(i\) beat item \(j\)" and the same machinery becomes the standard model for preference data — the likelihood behind reward models, arena leaderboards, and every head-to-head evaluation in AI research.

**The model.** Give each item a latent strength \(\theta_i\). The Bradley–Terry model says

$$
P(i\succ j)=\frac{e^{\theta_i}}{e^{\theta_i}+e^{\theta_j}}
=\sigma(\theta_i-\theta_j),
$$

with \(\sigma\) the logistic function. Read that second form carefully: **Bradley–Terry is logistic regression with a design matrix of \(+1\), \(-1\), and zeros.** For a comparison between \(i\) and \(j\), the covariate vector has \(+1\) in position \(i\), \(-1\) in position \(j\), and zeros elsewhere; the coefficient vector is \(\theta\). Everything in the previous section applies unchanged: the log-odds are linear, the Bernoulli information is \(\sigma(1-\sigma)\), and fitting is iteratively reweighted least squares.

**Identifiability.** Only differences \(\theta_i-\theta_j\) enter the likelihood, so \(\theta\) and \(\theta+c\mathbf1\) give identical probabilities. The parameter is identified only up to an additive constant, exactly the non-identifiability discussed for sufficiency earlier in this lesson. Fix it by pinning one item to zero or by constraining \(\sum_i\theta_i=0\). Reporting "model A scored 1183" is meaningless without stating the constraint and the reference set.

**Worked example.** Suppose \(\hat\theta_A-\hat\theta_B=0.7\). Then

$$
P(A\succ B)=\sigma(0.7)=\frac1{1+e^{-0.7}}\approx0.668 .
$$

A strength difference of \(0.7\) log-odds is a \(67\%\) win rate, not a \(70\%\) one — the logistic link is not the identity, and reading coefficient differences as probabilities is a common error.

**Information and design.** From the logistic Fisher information, a comparison between \(i\) and \(j\) contributes \(\sigma(1-\sigma)\) to the information about \(\theta_i-\theta_j\), which is maximized at \(\sigma=1/2\) — that is, when the two items are **evenly matched**. Comparisons between a strong and a hopeless item carry almost no information. This is the statistical justification for adaptive matchmaking in evaluation arenas, and it is also the reason a leaderboard built from random pairings is far less efficient than its sample size suggests.

**Ties and multiple comparisons.** Basic Bradley–Terry has no tie category; extensions (Davidson, or an ordinal model) add one. Dropping ties instead is a selection decision and biases strengths toward whichever items tie less often.

**Where it breaks, and this matters for AI evaluation.**

- **Non-transitivity.** The model forces a total order. If A beats B, B beats C, and C beats A systematically, no \(\theta\) fits, and the estimate will average the cycle away without warning. Test by comparing observed win rates against fitted ones on triads.
- **Rater dependence.** Multiple judgments from one rater, or one prompt, are clustered. Standard errors must use cluster-robust or bootstrap-by-rater methods, exactly as established earlier in this lesson; treating each comparison as independent understates uncertainty, often by a large factor.
- **Position and verbosity bias.** If judges prefer the first-shown or longer response, that effect is a covariate, not noise. Add it to the design matrix and estimate it — the model already accommodates extra columns.
- **Nonstationary populations.** Strengths estimated against one opponent pool do not transfer to another. A rating is relative to the field.

The practical recommendation: report strengths with a stated constraint, cluster-robust intervals, an explicit tie policy, and a non-transitivity check. A leaderboard without those is a point estimate with unknown uncertainty.

> **Practice — Foundation:** Compute \(P(i\succ j)\) for \(\theta_i-\theta_j\in\{0,0.5,2\}\).
>
> **Hint:** Use \(\sigma(d)=1/(1+e^{-d})\); for \(d=0.5\) first compute \(e^{-0.5}\approx0.607\). As a check, \(d=0\) must give exactly 0.5.
>
> **Practice — Core:** Four items A–D have five recorded comparisons: A beats B, B beats C, C beats D, A beats C, and D beats B. Write the \(5\times4\) Bradley–Terry design matrix, show that its columns are linearly dependent, and state a constraint that removes the dependence.
>
> **Hint:** Each row has one \(+1\) and one \(-1\), so \(X\mathbf1=0\); pinning \(\theta_A=0\) (dropping its column) or imposing \(\sum_i\theta_i=0\) removes the null direction.
>
> **Practice — Stretch:** A leaderboard uses 40,000 comparisons from 300 raters (about 133 per rater) and reports naive \(\pm4\) rating-point intervals. With rater-level intraclass correlation \(\rho=0.01\), compute the design effect \(1+(m-1)\rho\) and the corrected half-width. Then compare the Fisher information per comparison at win probability 0.5 versus 0.9, and state one matchmaking rule that raises information while keeping all items identifiable.
>
> **Hint:** Inflate the half-width by \(\sqrt{1+(m-1)\rho}\) with \(m=40000/300\); compare \(p(1-p)\) at 0.5 and 0.9, and keep the comparison graph connected so relative strengths stay identified.

## 16. Poisson regression models rates through exposure

For a count \(Y_i\geq0\), Poisson regression uses

$$
Y_i\mid x_i\sim\operatorname{Poisson}(\mu_i),
\qquad
\log\mu_i=x_i^T\beta.
$$

If observations have exposures \(t_i\), model a rate by including a fixed **offset**:

$$
\log\mu_i=\log t_i+x_i^T\beta.
$$

The offset coefficient is fixed at one. Exponentiating \(\beta_j\) gives a multiplicative rate ratio.

The Poisson variance equals its mean. Real count data often show **overdispersion** from heterogeneity, clustering, excess zeros, or dependence. The Pearson dispersion diagnostic

$$
\hat\phi=\frac1{n-p}\sum_i\frac{(y_i-\hat\mu_i)^2}{\hat\mu_i}
$$

substantially above one signals that model-based Poisson uncertainty is too small. Quasi-Poisson scaling, negative-binomial models, cluster-robust covariance, random effects, or a better mean model address different causes; choose by mechanism rather than by a single diagnostic number.

**Worked example — failures per accelerator-hour.** A machine observed for 100 hours and one observed for 10 hours should not be compared as raw counts. With \(\log t_i\) as an offset, a coefficient for hardware type compares failure rates at equal exposure. Treating exposure as an ordinary learned predictor wrongly estimates whether counts scale proportionally with observed time.

> **Practice — Foundation:** A Poisson regression with log exposure offset has coefficient 0.2 on a binary new-GPU indicator, and the old GPU fails at 5 per 1,000 hours. Interpret \(e^{0.2}\) and compute the expected failures for a new GPU over 3,000 hours.
>
> **Hint:** \(e^{0.2}\approx1.221\) multiplies the rate; the expected count is rate times exposure, which the offset \(\log t\) enters with coefficient one.
>
> **Practice — Core:** Derive the Poisson score for \(\log\mu_i=\log t_i+x_i^T\beta\). For the intercept-only model with counts \(y=(3,7)\) and exposures \(t=(10,30)\), solve for \(\hat\beta_0\) and the fitted rate.
>
> **Hint:** \(\ell=\sum_i[y_i(\log t_i+\beta_0)-t_ie^{\beta_0}]+c\), so the score is \(\sum_i(y_i-t_ie^{\beta_0})\); total observed must equal total expected.
>
> **Practice — Stretch:** Compute the mean, variance, and dispersion ratio for three count mechanisms and propose a model or correction for each: (a) Poisson with a gamma-distributed rate of mean 4 and shape \(k=2\); (b) zero inflation, a structural zero with probability 0.3 and otherwise Poisson(4); (c) each Poisson(2) count accidentally recorded twice, \(Y=2X\). For (b), also compare \(P(Y=0)\) with a Poisson of the same mean.
>
> **Hint:** Use \(\operatorname{Var}(Y)=E[\operatorname{Var}(Y\mid\cdot)]+\operatorname{Var}(E[Y\mid\cdot])\) for (a) and (b), and \(\operatorname{Var}(2X)=4\operatorname{Var}(X)\) for (c).

## 17. GLM fitting is repeated local weighted least squares

For canonical GLMs, log likelihood is concave in \(\beta\) when the design is well behaved. Newton's update is

$$
\beta_{\text{new}}
=\beta_{\text{old}}
+(X^TWX)^{-1}X^T(y-\mu).
$$

It can be written as **iteratively reweighted least squares** (IRLS): construct a working response \(z\) by locally linearizing the link, then solve weighted least squares with weights determined by current fitted variance and link derivative. Recompute and repeat.

Numerical safeguards still matter:

- compute logistic loss with stable softplus identities;
- solve linear systems rather than invert \(X^TWX\);
- use line search or trust-region damping when Newton steps are too aggressive;
- standardize poorly scaled predictors for optimization while preserving interpretable transformations;
- check rank, convergence, gradient size, and coefficient path.

In completely separated logistic data, likelihood approaches its supremum as some coefficient norms diverge. The Hessian can be positive semidefinite while no finite MLE exists. Penalization, weakly informative priors, or bias-reduced likelihood can yield finite estimates, but the separation itself should be reported.

**Worked example — rare safety failures.** If one feature perfectly separates all observed failures from successes, an optimizer may return increasingly large coefficients and tiny fitted loss. This is not strong finite evidence for a precisely known effect. It is a boundary estimate driven by limited overlap. Inspect feature-label tables, coefficient paths, and held-out behavior.

> **Practice — Foundation:** For intercept-only logistic data \(y=(1,1,1,0)\), take one Newton/IRLS step from \(\beta=0\), and compute the IRLS weight \(p(1-p)\) at \(\beta=0\) and at the new \(\beta\). Explain why the weights must be recomputed.
>
> **Hint:** The step is score over information, \((3-4\cdot0.5)/(4\cdot0.25)=1\); the weights change because \(p=\sigma(\beta)\) changes with \(\beta\).
>
> **Practice — Core:** Derive the Newton step \(\delta=(X^TWX)^{-1}X^T(y-p)\) from the logistic gradient and Hessian. Apply it once from \(\beta=(0,0)\) with an intercept, \(x=(0,0,0,1,1,1)\), and \(y=(0,0,1,0,1,1)\), and compare with the MLE \((\log0.5,\log4)\).
>
> **Hint:** At \(\beta=0\), \(W=0.25I\), so \(X^TWX=\begin{pmatrix}1.5&0.75\\0.75&0.75\end{pmatrix}\), and \(X^T(y-p)=(0,0.5)\).
>
> **Practice — Stretch:** With NumPy seed 0, draw \(n=100\), \(x_i\sim\mathcal N(0,1)\), and \(y_i\sim\operatorname{Bernoulli}(\sigma(\kappa x_i))\) for \(\kappa\in\{1,5,25\}\), plus a fully separated set \(y_i=\mathbf1\{x_i>0\}\). Fit intercept-plus-slope logistic models by 30 Newton steps, unpenalized and with penalty \(0.5\lVert\beta\rVert^2\). Report the final slope, its Wald SE, and whether the unpenalized iterates stabilize.
>
> **Hint:** In the separated case the unpenalized slope keeps growing and the weights \(p(1-p)\) collapse, making \(X^TWX\) nearly singular; the penalty adds \(I\) to the Hessian and keeps both the estimate and SE finite.

## 18. Deviance and residuals compare fitted distributions

For a fitted GLM, the **saturated model** gives each observation enough freedom to reproduce its outcome. Deviance compares fitted log likelihood with saturated log likelihood:

$$
D=2\left(\ell_{\mathrm{sat}}-\ell_{\mathrm{fit}}\right).
$$

For Poisson observations,

$$
D=2\sum_i
\left[y_i\log\frac{y_i}{\hat\mu_i}-(y_i-\hat\mu_i)\right],
$$

with the \(y_i\log(y_i/\hat\mu_i)\) term defined as zero when \(y_i=0\). Deviance residuals assign signed square roots of observation contributions. Pearson residuals scale \(y_i-\hat\mu_i\) by modeled standard deviation.

For nested regular models, a deviance difference is a likelihood-ratio statistic and is often approximately chi-squared with degrees of freedom equal to the parameter-count difference. Boundaries, small samples, adaptive model selection, separation, and misspecification can invalidate that calibration.

Predictive model comparison asks a different question. Cross-validated log loss estimates out-of-sample predictive performance for a specified split distribution. In-sample deviance rewards flexibility and should not be mistaken for deployment evidence.

**Worked example — omitted interaction.** A logistic model fits language and model version as additive effects. Deviance residuals show opposite version errors across languages. Adding a prespecified language-by-version interaction tests whether the version contrast changes by language. If the pattern was discovered by searching hundreds of slices, confirmation needs fresh data or selection-aware inference.

> **Practice — Foundation:** For Poisson counts \(y=(2,5)\), state the saturated fitted means and explain why the saturated model's deviance is zero. Then compute the deviance of the intercept-only fit \(\hat\mu=3.5\).
>
> **Hint:** Saturated means \(\hat\mu_i=y_i\), so every term \(y_i\log(y_i/\hat\mu_i)-(y_i-\hat\mu_i)\) is zero; for \(\hat\mu=3.5\) the \((y_i-\hat\mu_i)\) terms sum to zero.
>
> **Practice — Core:** Calculate Poisson deviance for observations \(0,3\) and fitted means \(1,2\).
>
> **Hint:** Set the \(y\log(y/\mu)\) term to 0 for \(y_1=0\): \(D=2[(0-(0-1))+(3\log1.5-(3-2))]\).
>
> **Practice — Stretch:** Give numbers for two cases where a \(\chi^2_1\) deviance reference misleads: (a) testing a random-intercept variance \(\tau^2=0\) with likelihood-ratio statistic 2.71, where the null reference is a 50:50 mixture of a point mass at 0 and \(\chi^2_1\); (b) reporting the largest deviance drop among 20 independent null candidate terms. Compute the naive and corrected tail probabilities, and propose a better evaluation.
>
> **Hint:** Under the boundary null the statistic is 0 half the time, so the \(p\)-value is half the \(\chi^2_1\) tail; for the selected term use \(1-0.95^{20}\) as the probability that some null term passes 3.84.

## 19. Mixed-effects models represent group variation and partial pooling

Rows in AI research are often nested: outputs within prompts, prompts within tasks, users within organizations, or checkpoints within training runs. A random-intercept model is

$$
y_{ij}=x_{ij}^T\beta+b_j+\varepsilon_{ij},
\qquad
b_j\sim\mathcal N(0,\tau^2),
\qquad
\varepsilon_{ij}\sim\mathcal N(0,\sigma^2).
$$

\(\beta\) describes population-level fixed effects; \(b_j\) describes modeled group deviations. Marginally, two rows in the same group have covariance \(\tau^2\), so the model represents dependence rather than pretending rows are independent.

For a group mean \(\bar y_j\) with \(n_j\) observations and a known population mean \(\mu\), the normal-normal posterior or empirical-Bayes predictor has the form

$$
\tilde\mu_j
=w_j\bar y_j+(1-w_j)\mu,
\qquad
w_j=\frac{\tau^2}{\tau^2+\sigma^2/n_j}.
$$

Small or noisy groups shrink more toward the population; large precise groups shrink less.

![Partial pooling shrinks noisy group estimates more strongly than precise group estimates.](../assets/partial-pooling.svg)

**No pooling** fits unrelated group parameters and can overreact to tiny groups. **Complete pooling** erases heterogeneity. **Partial pooling** shares information through an estimated population distribution. Random slopes allow treatment or predictor effects to vary across groups, but estimating their covariance needs enough independent groups.

Maximum likelihood estimates fixed effects and variance components jointly. Restricted maximum likelihood adjusts Gaussian variance-component estimation for fitted fixed effects. Bayesian models place priors on every level and propagate variance-component uncertainty. With few groups, asymptotic standard errors and estimated heterogeneity can be unstable under either approach.

**Worked example — benchmark tasks.** A system effect may vary by task. Treating 5,000 examples as independent understates new-task uncertainty; fitting 20 unrelated effects makes small tasks erratic. A random-slope model estimates the average system effect, between-task variation, and partially pooled task effects. It still requires the sampled tasks to represent the target task population.

> **Practice — Foundation:** Compute \(w_j\) when \(\tau^2=1\), \(\sigma^2=4\), and \(n_j=1,4,100\).
>
> **Hint:** Use \(w_j=\tau^2/(\tau^2+\sigma^2/n_j)=1/(1+4/n_j)\); larger groups receive weight closer to 1.
>
> **Practice — Core:** In \(y_{ij}=\mu+b_j+\varepsilon_{ij}\) with \(b_j\sim\mathcal N(0,\tau^2)\) and \(\varepsilon_{ij}\sim\mathcal N(0,\sigma^2)\) independent, derive \(\operatorname{Cov}(y_{ij},y_{ik})\) for \(i\ne k\) and the intraclass correlation. Evaluate both with \(\tau^2=1\), \(\sigma^2=4\), along with the variance of a five-observation group mean.
>
> **Hint:** The shared \(b_j\) is the only common term, so the covariance is \(\tau^2\), \(\rho=\tau^2/(\tau^2+\sigma^2)\), and \(\operatorname{Var}(\bar y_j)=\tau^2+\sigma^2/n_j\).
>
> **Practice — Stretch:** Fifty prompts are fully crossed with six raters (300 scores): \(y_{pr}=\mu+a_p+b_r+\varepsilon_{pr}\) with \(\tau_p^2=0.5\), \(\tau_r^2=0.2\), and \(\sigma^2=1\). State the population each random factor represents, compute the variance of the grand mean, and compare it with the naive total variance divided by 300.
>
> **Hint:** Averaging over cells leaves \(\bar a\) (50 prompts) and \(\bar b\) (6 raters) intact: \(\tau_p^2/50+\tau_r^2/6+\sigma^2/300\), dominated by the six raters.

## 20. A disciplined regression workflow for AI research

### Before fitting

1. Define the population, unit, outcome, intervention or predictor, and target contrast.
2. Draw the dependence structure: task, prompt, user, rater, run, checkpoint, and time.
3. Decide whether the goal is description, prediction, or causal estimation.
4. Specify functional form, interactions, exposure, and link before viewing every result.
5. Reserve data for selection, calibration, and final evaluation at the appropriate group and time level.

### During fitting

1. Inspect support and overlap rather than only marginal histograms.
2. use stable likelihood calculations and rank-aware solvers;
3. record preprocessing, coding, weights, offsets, regularization, and convergence;
4. model or preserve dependence;
5. diagnose mean form, variance, tails, leverage, separation, overdispersion, and group heterogeneity separately.

### After fitting

1. Report effects on an interpretable scale with uncertainty.
2. distinguish conditional coefficients, marginal predictions, and causal effects;
3. compare against held-out data using proper predictive scores and target-weighted summaries;
4. run sensitivity analyses for coding, functional form, clusters, influential groups, missingness, and shift;
5. preserve residual and subgroup diagnostics without turning exploratory discoveries into confirmatory claims.

**Worked example — comparing agent versions.** Use a paired task design and model success with version, task characteristics, and prespecified interactions. Add task random effects and, if enough tasks exist, a random version slope. Report the population-average probability difference using marginal predictions, not only a conditional odds ratio. Validate calibration and performance on later tasks, and keep adaptive failure discovery separate from confirmation.

> **Practice — Foundation:** Label each goal as descriptive, predictive, or causal: (1) latency in our logs rises 3 ms per 1,000 tokens; (2) forecast tomorrow's queue length; (3) switching to model B would raise resolution by 4 points; (4) among the sampled tasks, code tasks score lower; (5) flag whether a new prompt will fail.
>
> **Hint:** Ask whether the statement summarizes observed data, forecasts unseen outcomes, or claims what would happen under an intervention.
>
> **Practice — Core:** Two systems answer 200 prompts, and each output receives a binary correctness judgment from each of 3 raters (1,200 judgments). Write a complete model with outcome distribution, link, fixed system effect, and prompt and rater random intercepts, and state the number of independent prompts, raters, and rows.
>
> **Hint:** Use \(y_{psr}\sim\operatorname{Bernoulli}(\mu)\) with \(\operatorname{logit}\mu=\beta_0+\beta_1s+a_p+c_r\), \(a_p\sim\mathcal N(0,\tau_p^2)\), \(c_r\sim\mathcal N(0,\tau_r^2)\); with only 3 raters, \(\tau_r^2\) is barely estimable.
>
> **Practice — Stretch:** A paper reports accuracy 0.7 on 3,000 completions (30 tasks with 100 completions each), a row-level random split, and SE \(\sqrt{0.7\cdot0.3/3000}\), while claiming results for new tasks. With within-task intraclass correlation 0.3, compute the corrected SE and effective sample size, and redesign the model, uncertainty, and split.
>
> **Hint:** Inflate the SE by \(\sqrt{1+(m-1)\rho}\) with \(m=100\); the effective sample size is about 98 rows rather than 3,000, so a new-task claim needs a task-level split and task resampling.

## 21. Runnable labs

This chapter has three coding exercises. Each opens as a separate tab in the lesson's right-hand Python workspace.

### Lab A — simple OLS and slope uncertainty

Implement **simple_ols** in [labs/exercises.py](../../labs/exercises.py). Given finite predictor and outcome iterables, return:

1. fitted intercept;
2. fitted slope;
3. residual standard error using \(n-2\) degrees of freedom;
4. conventional homoskedastic slope standard error.

Run:

~~~text
python -m labs.checks simple-ols
~~~

The checks cover exact lines, noisy data, translation and scaling behavior, generators, input preservation, degenerate predictors, and invalid observations.

### Lab B — stable logistic loss and gradient

Implement **logistic_loss_gradient** in [labs/exercises.py](../../labs/exercises.py). Given a finite rectangular design matrix, binary outcomes, and coefficients, return the mean Bernoulli negative log likelihood and its gradient.

Run:

~~~text
python -m labs.checks logistic-gradient
~~~

The checks cover ordinary and extreme logits, numerical gradients, generators, input preservation, shape failures, and invalid binary labels.

### Lab C — normal-normal partial pooling

Implement **partial_pooling_means** in [labs/exercises.py](../../labs/exercises.py). Given group means, positive group sizes, known within-group variance, a population mean, and between-group variance, return pooled group means and their data weights \(w_j\).

Run:

~~~text
python -m labs.checks partial-pooling
~~~

The checks cover no heterogeneity, noiseless observations, unequal group sizes, translation, generators, input preservation, and invalid variance or sample-size inputs.

### Guided experiment

1. Verify that Bernoulli likelihoods are identical for sequences with the same sufficient count, then add time drift and show the equivalence disappears.
2. Numerically differentiate Bernoulli and Poisson log-partition functions to recover means and variances.
3. Simulate OLS under Gaussian, heavy-tailed, heteroskedastic, and clustered errors; compare model-based, HC, and cluster-robust coverage.
4. Fit the same categorical comparison as a difference in means, regression, and ANOVA contrast.
5. Trace logistic Newton steps as separation increases and compare penalized fits.
6. Simulate Poisson rates with unequal exposure, then add latent rate heterogeneity and diagnose overdispersion.
7. Vary group sizes and variance ratios to visualize partial-pooling weights and new-group predictive uncertainty.

## 22. Derivations to own

1. Prove Bernoulli sufficiency both by factorization and by conditional distribution.
2. Apply the likelihood-ratio criterion for minimal sufficiency.
3. Derive sufficient statistics for Gaussian data with unknown mean and variance.
4. Put Bernoulli, Poisson, categorical, and fixed-variance Gaussian distributions in natural exponential-family form.
5. Derive \(\nabla A(\eta)=E[T]\) and \(\nabla^2A(\eta)=\operatorname{Cov}(T)\).
6. Derive exponential-family MLE moment matching.
7. Prove the Rao–Blackwell variance inequality with total variance.
8. Derive OLS normal equations, projection, and coefficient covariance.
9. Derive \(t\)- and \(F\)-statistics for linear contrasts under Gaussian errors.
10. Derive HC and cluster-sandwich covariance estimators from score contributions.
11. Show GLS is OLS after whitening.
12. Derive logistic and Poisson scores and Hessians.
13. Derive IRLS from a second-order likelihood approximation.
14. Derive Poisson deviance and its zero-count convention.
15. Derive normal-normal partial pooling and the random-intercept intraclass correlation.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-glm
```

## 23. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–7. Work these without software first. They are deliberately concrete: every problem has a numerical or symbolic answer that you can check before moving to the less scaffolded problems.

**A1 · Foundation · paper — Factorization and sufficiency.** For iid observations \(x_1,\ldots,x_n\), write the joint likelihood, factor all parameter dependence through a statistic \(T(x)\), and state the dimension of \(T\) for each model:
   1. \(X_i\sim\operatorname{Bernoulli}(p)\), with \(p\in(0,1)\);
   2. \(X_i\sim\operatorname{Poisson}(\lambda)\), with \(\lambda>0\);
   3. \(X_i\sim\mathcal N(\mu,4)\), with unknown \(\mu\);
   4. \(X_i\sim\mathcal N(\mu,\sigma^2)\), with both parameters unknown.
   Explain why retaining only the sample mean is enough in case 3 but not in case 4.

**A2 · Foundation · paper — Natural exponential-family form.** For one observation, express Bernoulli, Poisson, \(\mathcal N(\mu,4)\), and a three-class categorical distribution as

   $$
   p(x\mid\eta)=h(x)\exp\{\eta^TT(x)-A(\eta)\}.
   $$

   Identify \(h,T,\eta,A\), the natural-parameter space, and the map back to the ordinary parameter. For the categorical model, use class 3 as the reference and explain why three unconstrained logits would be redundant.

**A3 · Foundation · paper — The partition function does the bookkeeping.** For Bernoulli, use \(A(\eta)=\log(1+e^\eta)\). For Poisson, use \(A(\eta)=e^\eta\). Differentiate each twice, express the answers in the ordinary parameter, and verify that \(A'(\eta)\) and \(A''(\eta)\) equal the mean and variance of the sufficient statistic. What happens to Bernoulli curvature as \(p\to0\) or \(p\to1\)?

**A4 · Foundation · paper — Simple OLS by hand.** For

   $$
   x=(0,1,2,3),\qquad y=(1,2,2,5),
   $$

   compute \(\bar x,\bar y,S_{xx},S_{xy},\hat\beta_0,\hat\beta_1\), all four fitted values and residuals, RSS, \(s^2=\operatorname{RSS}/(n-2)\), and the conventional standard error \(s/\sqrt{S_{xx}}\) of the slope. Verify both normal equations \(\sum_i e_i=0\) and \(\sum_i x_ie_i=0\).

**A5 · Foundation · paper — Indicator coding changes coordinates, not fitted means.** A four-level factor has fitted means

   $$
   \mu_A=m,\quad \mu_B=m+1.2,\quad \mu_C=m-0.4,\quad \mu_D=m+0.7.
   $$

   Write the design row and coefficient vector using \(A\) as the reference. Then re-express exactly the same four means using \(C\) as the reference. Which individual coefficients change, and which scientifically meaningful contrasts remain invariant?

**A6 · Foundation · paper — An odds ratio is not a risk difference.** Consider

   $$
   \operatorname{logit}P(Y=1\mid x)=\alpha+x\log2,
   $$

   for \(x\in\{0,1\}\). Compute both probabilities, the odds ratio, and the risk difference when (a) \(\alpha=-2\) and (b) \(\alpha=1\). Explain why the odds ratio is identical but the risk difference is not.

**A7 · Foundation · paper — Poisson exposure and rate ratios.** System A records 20 failures over 100 accelerator-hours; system B records 12 failures over 40 accelerator-hours. Fit the two-group Poisson model

   $$
   \log E[Y_i]=\log t_i+\beta_0+\beta_1\mathbf1\{i=B\}.
   $$

   Using the observed rates as the fitted group rates, compute \(\hat\beta_0,\hat\beta_1\), and \(e^{\hat\beta_1}\). Then show what raw-count comparison would conclude and explain why it targets the wrong quantity.

### Core — problems 8–15. These combine derivation with model criticism. Show intermediate quantities; a final number without the model or estimating equation is not a complete answer.

**A8 · Core · paper — Minimal sufficiency by likelihood ratios.** Let \(X_1,X_2,X_3\) be iid Bernoulli\((p)\), and take the eight binary sequences as the sample space.
   1. For two sequences \(x,y\), simplify \(L(p;x)/L(p;y)\).
   2. Determine exactly when this ratio is independent of \(p\).
   3. Partition all eight sequences into the resulting equivalence classes.
   4. Explain why the class label is a minimal sufficient statistic and why recording the order of the three outcomes contains no additional information about \(p\) under this model.

**A9 · Core · paper — Rao–Blackwellization with an exact variance comparison.** With \(X_1,\ldots,X_n\overset{\mathrm{iid}}{\sim}\operatorname{Bernoulli}(p)\), consider the unbiased estimator \(U=X_1\).
   1. Let \(S=\sum_iX_i\). Derive \(E[U\mid S]\) without invoking a memorized result.
   2. Show that the resulting estimator is \(\bar X\) and remains unbiased.
   3. Compute \(\operatorname{Var}(U)\), \(\operatorname{Var}(\bar X)\), and the exact reduction.
   4. Reconcile the result with the law of total variance by finding \(E[\operatorname{Var}(U\mid S)]\).

**A10 · Core · paper — A \(2\times2\) factorial model as regression.** Code factors \(a,b\in\{-1,+1\}\) and use

    $$
    E[Y\mid a,b]=\beta_0+\beta_Aa+\beta_Bb+\beta_{AB}ab.
    $$

    The four cell means are

    $$
    \mu_{--}=10,\qquad \mu_{+-}=14,\qquad
    \mu_{-+}=12,\qquad \mu_{++}=24.
    $$

    Write the \(4\times4\) design matrix, solve for all four coefficients, reconstruct the cell means, and compute the effect of changing \(A\) from \(-1\) to \(+1\) separately at \(B=-1\) and \(B=+1\). Explain why reporting only one “main effect of \(A\)” hides important structure.

**A11 · Core · paper — Conventional versus heteroskedasticity-consistent uncertainty.** Reuse the OLS data from problem 4. For simple regression with an intercept, compute the HC0 slope variance

    $$
    \widehat{\operatorname{Var}}_{\mathrm{HC0}}(\hat\beta_1)
    =\frac{\sum_i(x_i-\bar x)^2e_i^2}{S_{xx}^2},
    $$

    and its HC1 correction \(n/(n-2)\). Compare both standard errors with the conventional value from problem 4. Then run a seeded simulation with fixed \(x_i\in\{-2,-1,0,1,2\}\),

    $$
    Y_i=1+2x_i+\varepsilon_i,\qquad
    \varepsilon_i\sim\mathcal N\!\left(0,(1+|x_i|)^2\right),
    $$

    repeating each design point 20 times per dataset. Across at least 2,000 datasets, compare nominal 95% interval coverage for the conventional and HC1 slope intervals. State why one four-row example cannot establish a general ordering of their widths.

**A12 · Core · paper — Clustering and effective sample size.** Suppose \(G=50\) independent tasks each contribute \(m=20\) exchangeable prompt scores with common marginal variance and intraclass correlation \(\rho\).
    1. Derive the variance of a task mean and the design effect \(1+(m-1)\rho\) relative to independent rows.
    2. Compute the effective row count

       $$
       n_{\mathrm{eff}}=\frac{Gm}{1+(m-1)\rho}
       $$

       and standard-error inflation for \(\rho=0,0.1,0.5\).
    3. Compare adding 20 more prompts to every existing task with collecting 50 new tasks when the deployment claim concerns new tasks. Explain which operation increases the number of independent units.

**A13 · Core · paper — GLS by whitening.** Consider the intercept-only model \(y=\beta\mathbf1+\varepsilon\) with

    $$
    y=\begin{pmatrix}1\\3\end{pmatrix},\qquad
    \Sigma=\begin{pmatrix}1&0.5\\0.5&4\end{pmatrix}.
    $$

    Compute \(\Sigma^{-1}\) and the GLS estimate

    $$
    \hat\beta_{\mathrm{GLS}}
    =\frac{\mathbf1^T\Sigma^{-1}y}
    {\mathbf1^T\Sigma^{-1}\mathbf1}.
    $$

    Next factor \(\Sigma=CC^T\) with

    $$
    C=\begin{pmatrix}1&0\\0.5&\sqrt{3.75}\end{pmatrix},
    $$

    transform \(y^\star=C^{-1}y\) and \(X^\star=C^{-1}\mathbf1\), and verify that OLS of \(y^\star\) on \(X^\star\) through the origin gives the same estimate. Explain why the result is closer to the first observation than the raw mean is.

**A14 · Core · paper — One logistic Newton/IRLS step.** Fit an intercept-only Bernoulli model to \(y=(1,1,0)\), starting from \(\beta^{(0)}=0\).
    1. Write the mean negative log likelihood, gradient, and Hessian.
    2. Evaluate them at zero and take one undamped Newton step.
    3. Compare the result with the exact MLE \(\operatorname{logit}(2/3)\).
    4. Verify the analytic gradient by a centered finite difference, using several step sizes rather than reporting one convenient match.
    5. Explain why a line search or damping rule is still needed in a general multivariable problem even though this step succeeds.

**A15 · Core · paper — Count-diagnostic triage.** For each pattern below, identify the first mechanism to investigate, name a suitable model or correction, and state one diagnostic that distinguishes it from the other patterns.
    1. Residual means curve systematically with a recorded predictor, but variance is close to the fitted Poisson mean within narrow predictor bins.
    2. Conditional means look correct, but variance grows approximately as \(\mu+\mu^2/k\), without an unusual zero spike.
    3. Means and positive counts look plausible under a negative-binomial model, but zero counts remain far more common than predicted.
    4. Two machines have similar failure rates per hour, but the higher-exposure machine always has larger raw residuals because exposure was omitted from the fitted mean.

### Stretch — problems 16–24. These are miniature research assignments. A complete submission includes assumptions, derivations or code, diagnostics, and a short interpretation that does not overstate the estimand.

**A16 · Stretch · paper — Sufficiency breaks under drift.** Compare the binary sequences

    $$
    x=(1,1,1,0,0,0),\qquad y=(0,0,0,1,1,1)
    $$

    observed at \(t=(-5,-3,-1,1,3,5)\).

    1. Show that they have identical likelihood under an iid Bernoulli model.
    2. Under \(\operatorname{logit}P(X_i=1)=\alpha+\beta t_i\), derive \(\log[L(\alpha,\beta;x)/L(\alpha,\beta;y)]\).
    3. Evaluate the ratio at \(\beta=-0.4\), explain which sequence is favored, and identify the statistic discarded by the iid sufficient count.
    4. Generalize: state a sufficient statistic for \((\alpha,\beta)\) when the \(t_i\) are fixed.

**A17 · Stretch · paper — A curved exponential family cannot generally match every sufficient moment.** Begin with \(X_i\sim\mathcal N(\mu,\sigma^2)\), but impose the nonlinear restriction \(\sigma^2=\mu^2\) with \(\mu>0\).
    1. Write the likelihood using \(S_1=\sum_iX_i\) and \(S_2=\sum_iX_i^2\).
    2. Derive the likelihood equation \(n\mu^2+S_1\mu-S_2=0\) and its positive solution.
    3. For \(x=(1,2,3)\), compute the restricted MLE.
    4. The model implies \(E[X]=\mu\) and \(E[X^2]=2\mu^2\). Show that no \(\mu\) matches both empirical moments in this sample, and explain why ordinary full-family moment matching fails on a curved subfamily.

**A18 · Stretch · paper — Complete separation and finite remedies.** Fit the no-intercept logistic model \(P(Y=1\mid x)=\operatorname{sigmoid}(\beta x)\) to

    $$
    x=(-2,-1,1,2),\qquad y=(0,0,1,1).
    $$

    1. Prove that the data are completely separated and write the mean negative log likelihood as a scalar function of \(\beta\).
    2. Evaluate it at \(\beta=0,1,3,10\), and prove that no finite MLE exists.
    3. Add the penalty \(0.1\beta^2/2\), derive the penalized score, and locate its zero numerically.
    4. Compare ridge penalization, a weakly informative Gaussian prior, and bias-reduced likelihood: state what extra structure each adds and which uncertainty claim remains unsupported without overlap.

**A19 · Stretch · paper — Winner's curse after searching 50 null features.** With a fixed seed, repeat the following experiment at least 2,000 times:
    1. Generate \(n=200\) independent rows with \(Y\sim\mathcal N(0,1)\) and 50 independent standard-normal features, all unrelated to \(Y\).
    2. Fit 50 separate simple regressions and retain the feature with the largest absolute \(t\)-statistic.
    3. Record whether its naive 95% coefficient interval excludes zero and the selected coefficient's absolute magnitude.
    4. Repeat using 100 rows for selection and the untouched 100 rows for confirmation of only the selected feature.

    Report the false-positive rate and coefficient-selection bias for both procedures. Compare the naive search result with the benchmark \(1-0.95^{50}\), and explain why sample splitting repairs confirmation but not the exploratory estimate.

**A20 · Stretch · paper — Four weighting schemes, four estimands.** Three task types have observed effects

    $$
    d=(0,1,1),
    $$

    estimated variances \(v=(1,1,9)\), inclusion probabilities \(\pi=(1,0.5,0.25)\), frequency weights \(f=(4,2,1)\), and deployment target weights \(q=(0.2,0.3,0.5)\).

    Compute the unweighted mean, inverse-variance mean, normalized inverse-inclusion (Hájek) mean, frequency-weighted mean, and deployment-weighted mean. For each, write the estimating equation or weighted target and state the population it answers. Explain why choosing whichever estimate is most favorable is an estimand change rather than a robustness analysis.

**A21 · Stretch · paper — Rare failures, exposure, and case-control sampling.** Suppose hardware A fails according to a Poisson process with rate \(0.001\) per hour and B with rate \(0.002\) per hour.
    1. Compute the probability of at least one failure over 10 and 1,000 hours for both systems. Compare risk ratios, odds ratios, and the constant rate ratio.
    2. Explain why a binary logistic model without exposure cannot represent all four probabilities with one hardware coefficient, whereas a Poisson count model with a log-exposure offset can represent the rates.
    3. A case-control dataset retains every deployment failure but only \(1/99\) of nonfailures. Derive the additive change in log odds caused by sampling and the intercept correction needed for deployment probabilities.
    4. State which quantities can remain transportable under outcome-dependent sampling and which require prevalence or sampling fractions.

**A22 · Stretch · paper — Crossed effects and the unit supporting each claim.** An evaluation compares versions A and B on 30 sampled tasks, 20 prompts nested within each task, three independent training runs per version, and eight raters. Every generated answer is scored by two randomly assigned raters.

    1. Write a mixed model containing a fixed version effect, task and prompt-within-task random intercepts, rater and training-run random intercepts, and a task-specific random version slope.
    2. For claims about new prompts, new tasks, new raters, and new training runs, identify the corresponding sampled unit and variance component.
    3. Propose a split and resampling scheme for a final new-task claim.
    4. Explain what becomes unidentified or confounded if A is scored only by raters 1–4 and B only by raters 5–8.

**A23 · Stretch · paper — When Gaussian partial pooling invents a nonexistent middle.** With a fixed seed, simulate \(J=40\) group effects from

    $$
    \theta_j\sim\tfrac12\mathcal N(-3,0.25^2)
    +\tfrac12\mathcal N(3,0.25^2),
    $$

    then draw five observations per group from \(\mathcal N(\theta_j,2^2)\).

    Fit or approximate (a) a single-Gaussian random-effects model and (b) a two-component hierarchical mixture. Compare group-effect RMSE, sign errors, interval coverage, the fraction of posterior means placed in the low-density interval \((-1,1)\), and held-out new-group log score. Explain when the simpler model might still estimate the overall mean adequately while failing subgroup and prediction goals.

**A24 · Stretch · paper — Capstone: a defensible agent comparison.** Version B of a support agent is claimed to improve successful resolution by at least three percentage points on future task families without increasing p95 latency by more than 10%. Available data include 40 sampled task families, 25 prompts per family, three stochastic completions from each version and prompt, three independent training runs per version, two blinded ratings per completion drawn from eight raters, latency, token cost, and a timestamp. The team has already used 25 task families repeatedly while developing B; 15 later task families remain untouched.

    Produce a preregistered analysis plan containing:

    1. target population, primary estimands, noninferiority/superiority thresholds, and exchangeable unit;
    2. pairing, randomization, rater assignment, development/final split, and handling of missing or failed runs;
    3. a model for binary resolution and a method for p95 latency, both respecting tasks, prompts, raters, runs, and time;
    4. uncertainty, power or detectable-effect reasoning, multiplicity policy, and a decision rule;
    5. diagnostics for calibration, heterogeneity, influential tasks, separation, dependence, and distribution shift;
    6. the exact tables and plots that would support or falsify the deployment claim.

    **Ten-point rubric:** two points each for estimand alignment, design and leakage control, dependence-aware modelling, valid uncertainty and multiplicity, and diagnostics plus transparent reporting. An analysis automatically fails if it treats completions as independent deployment units, uses a prompt-level random split across task families, changes the primary metric after inspecting the final 15 families, reports only a p-value, or interprets a conditional odds ratio as the required marginal percentage-point improvement.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** What does a GLM link connect?

**K2 · Core · gate — Derivation.** Derive the intercept-only logistic MLE when both labels occur.

**K3 · Core · gate — Calculation.** For 15 successes in 20 observations, find the fitted probability of an intercept-only logistic model.

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-glm experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does finite optimizer output establish existence of an unregularized logistic MLE?

**K6 · Stretch · gate — RE/RS transfer.** Audit a Bradley–Terry preference study.

## Mastery check

Given an unfamiliar regression claim, reconstruct the conditional probability model; identify its sufficient statistics and exponential-family structure where present; derive its score, information, and estimand; fit it stably; choose uncertainty matching heteroskedasticity and dependence; interpret effects on appropriate conditional and marginal scales; diagnose functional-form, leverage, separation, overdispersion, and selection failures; and decide whether no pooling, complete pooling, or partial pooling matches the population being studied.

The next advanced statistics unit should develop predictive uncertainty, calibration, proper scoring rules, and conformal prediction. Those ideas use GLM probabilities as a concrete starting point while extending guarantees beyond a single parametric outcome model.
