---
id: math.statistics.exponential-families-regression-glms
title: Exponential families, statistical regression, GLMs, and partial pooling
prerequisites: [math.statistics.sampling-design-ml-evaluation, math.linear-algebra.projections-least-squares]
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

> **Practice — Foundation:** Distinguish a model for \(E[Y\mid X]\) from a model for the complete distribution \(Y\mid X\).
>
> **Practice — Core:** For \(E[Y\mid X=x]=2+0.4x\), interpret the intercept, slope, and predicted mean at \(x=5\).
>
> **Practice — Stretch:** Construct two conditional distributions with the same linear mean but different variance and tail behavior. State which regression conclusions agree.

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

> **Practice — Foundation:** Factor the iid Poisson likelihood and identify a sufficient statistic for its rate.
>
> **Practice — Core:** Show directly that the conditional distribution of a Bernoulli sequence given its success count does not depend on \(p\).
>
> **Practice — Stretch:** Give a plausible data-generating process for which \((\sum_iX_i,n)\) is insufficient even though each \(X_i\) is binary.

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

> **Practice — Foundation:** Explain why the complete sample is sufficient but usually not minimal.
>
> **Practice — Core:** Factor the Gaussian likelihood with known variance and show that \(\sum_iX_i\) is sufficient for \(\mu\).
>
> **Practice — Stretch:** Determine whether a fixed-dimensional sufficient statistic can preserve an arbitrary iid density family, and explain what this suggests about model structure.

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

> **Practice — Foundation:** Rewrite a Poisson mass function using \(\eta=\log\lambda\).
>
> **Practice — Core:** Put a Gaussian with known variance into exponential-family form and identify all terms.
>
> **Practice — Stretch:** Explain why allowing a distribution's support to depend on its parameter can break regular exponential-family arguments.

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

> **Practice — Foundation:** Differentiate the Poisson log-partition function twice and identify the mean and variance.
>
> **Practice — Core:** Derive the exponential-family score and explain why its zero is a moment-matching equation.
>
> **Practice — Stretch:** Relate strict convexity of \(A\) to one-to-one mapping between natural and mean parameters, noting what can fail in redundant representations.

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

> **Practice — Foundation:** Use total variance to explain why Rao–Blackwellization cannot increase variance.
>
> **Practice — Core:** Rao–Blackwellize \(X_1\) given the binomial success count and compare variances.
>
> **Practice — Stretch:** Explain why retaining raw data can still be essential even after computing a sufficient statistic for the fitted model.

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

> **Practice — Foundation:** Show from the normal equations that residuals sum to zero when \(X\) includes an intercept.
>
> **Practice — Core:** Derive the intercept and slope formulas for simple linear regression from centered variables.
>
> **Practice — Stretch:** Explain what the fitted vector and coefficient vector mean when \(X\) is rank deficient, and state which object remains unique.

## 7. Coefficients are conditional comparisons, not automatic causes

In the multiple linear mean model

$$
E[Y\mid X]=\beta_0+\beta_1X_1+\cdots+\beta_pX_p,
$$

\(\beta_j\) is the change in fitted conditional mean for a one-unit increase in \(X_j\), holding the other represented predictors fixed. This interpretation depends on coding and functional form.

It is not automatically causal. A causal interpretation additionally needs a design or identification argument: random assignment, an adequate adjustment set under a causal model, or another defensible source of exogenous variation. Controlling for a mediator or collider can create rather than remove bias.

Scaling also matters. Replacing \(X_j\) by \(X_j/1000\) multiplies its coefficient by 1000 without changing predictions. Centering changes the intercept and lower-order terms in models with interactions, not the fitted surface.

**Worked example — model size and benchmark score.** A positive coefficient on parameter count after controlling for training compute compares models at the same represented compute. It does not estimate what would happen if one enlarged a fixed model while keeping every other training choice coherent. Architecture, data, optimizer, and selection may all confound the observed association.

> **Practice — Foundation:** Interpret a coefficient of \(-0.7\) on latency measured in seconds when the outcome is reward.
>
> **Practice — Core:** Show how a coefficient changes when its predictor is converted from bytes to gigabytes while fitted predictions remain unchanged.
>
> **Practice — Stretch:** Draw a causal structure in which adjusting for an additional variable biases an otherwise valid treatment comparison.

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

> **Practice — Foundation:** Explain each factor in \(s\sqrt{(X^TX)^{-1}_{jj}}\).
>
> **Practice — Core:** Derive the covariance of \(\hat\beta\) from its linear expression in \(\varepsilon\).
>
> **Practice — Stretch:** Construct a design with many rows but an extremely uncertain slope and diagnose it through \(X^TX\).

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

> **Practice — Foundation:** Encode a three-level category with an intercept without creating exact column dependence.
>
> **Practice — Core:** Express a two-sample mean comparison as a regression coefficient test.
>
> **Practice — Stretch:** Design contrasts that test a main effect and interaction in a \(2\times2\) factorial experiment, and explain when a main effect is misleading.

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

> **Practice — Foundation:** Distinguish a residual, leverage value, and influence measure.
>
> **Practice — Core:** Match four residual patterns—curve, funnel, clusters, and one remote point—to likely assumption failures.
>
> **Practice — Stretch:** Explain why deleting every influential observation can create a less representative and more biased analysis.

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

> **Practice — Foundation:** Identify the bread and meat matrices in the HC0 sandwich estimator.
>
> **Practice — Core:** Explain why clustering sums \(x_ie_i\) within groups before forming outer products.
>
> **Practice — Stretch:** Construct a regression whose HC standard error is valid for its fitted pseudo-parameter but whose causal interpretation remains badly biased.

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

> **Practice — Foundation:** State why an observation with variance four times larger receives one quarter of the inverse-variance weight.
>
> **Practice — Core:** Show algebraically that GLS is OLS after whitening.
>
> **Practice — Stretch:** Give an example where inverse-variance and population weights produce different correct answers to different questions.

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

> **Practice — Foundation:** Name the random component, linear predictor, and link in logistic regression.
>
> **Practice — Core:** Explain why an identity-link Bernoulli model can produce invalid fitted means while a logit link cannot.
>
> **Practice — Stretch:** Design a noncanonical link for a probability and discuss the interpretive benefit and computational cost.

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

> **Practice — Foundation:** Convert a logistic coefficient of \(\log 1.5\) into an odds-ratio interpretation.
>
> **Practice — Core:** Derive the logistic score from the Bernoulli log likelihood.
>
> **Practice — Stretch:** Show numerically why a constant log-odds effect is not a constant risk difference across subgroups with different baselines.

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
> **Practice — Core:** Write the design matrix for four items and five recorded comparisons, then state why the columns are linearly dependent and which constraint removes it.
>
> **Practice — Stretch:** A leaderboard uses 40,000 comparisons from 300 raters and reports \(\pm4\) rating-point intervals. Estimate how the interval changes under rater-level clustering with a plausible intraclass correlation, and design a matchmaking policy that maximizes information per comparison while keeping the estimates identifiable.

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

> **Practice — Foundation:** Interpret \(e^{0.2}\) for a Poisson-regression coefficient.
>
> **Practice — Core:** Derive the Poisson score with a log link and exposure offset.
>
> **Practice — Stretch:** Construct three distinct mechanisms producing overdispersion and propose a different model or variance correction for each.

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

> **Practice — Foundation:** Explain why IRLS must change its weights after each iteration.
>
> **Practice — Core:** Derive the logistic Newton step from its gradient and Hessian.
>
> **Practice — Stretch:** Simulate increasingly separated data and compare unpenalized and penalized coefficient paths, calibration, and uncertainty.

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

> **Practice — Foundation:** Explain what a saturated model means and why its deviance is zero relative to itself.
>
> **Practice — Core:** Calculate Poisson deviance for observations \(0,3\) and fitted means \(1,2\).
>
> **Practice — Stretch:** Give two cases where a chi-squared deviance-difference reference is unreliable and propose a better evaluation.

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
> **Practice — Core:** Derive the covariance between two observations in the same random-intercept group and the resulting intraclass correlation.
>
> **Practice — Stretch:** Design a crossed random-effects model for model outputs scored by both prompts and raters, stating the population represented by each random factor.

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

> **Practice — Foundation:** Label five statements as descriptive, predictive, or causal regression goals.
>
> **Practice — Core:** Write a complete regression specification for repeated binary judgments nested within prompts and raters.
>
> **Practice — Stretch:** Audit a model-comparison paper whose rows are completions but whose claimed population is tasks; redesign its model, uncertainty, and split.

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

## 23. End-of-unit practice (graded)

**Foundation — problems 1–7.** Work these without software first. They are deliberately concrete: every problem has a numerical or symbolic answer that you can check before moving to the less scaffolded problems.

1. **Factorization and sufficiency.** For iid observations \(x_1,\ldots,x_n\), write the joint likelihood, factor all parameter dependence through a statistic \(T(x)\), and state the dimension of \(T\) for each model:
   1. \(X_i\sim\operatorname{Bernoulli}(p)\), with \(p\in(0,1)\);
   2. \(X_i\sim\operatorname{Poisson}(\lambda)\), with \(\lambda>0\);
   3. \(X_i\sim\mathcal N(\mu,4)\), with unknown \(\mu\);
   4. \(X_i\sim\mathcal N(\mu,\sigma^2)\), with both parameters unknown.
   Explain why retaining only the sample mean is enough in case 3 but not in case 4.
2. **Natural exponential-family form.** For one observation, express Bernoulli, Poisson, \(\mathcal N(\mu,4)\), and a three-class categorical distribution as

   $$
   p(x\mid\eta)=h(x)\exp\{\eta^TT(x)-A(\eta)\}.
   $$

   Identify \(h,T,\eta,A\), the natural-parameter space, and the map back to the ordinary parameter. For the categorical model, use class 3 as the reference and explain why three unconstrained logits would be redundant.
3. **The partition function does the bookkeeping.** For Bernoulli, use \(A(\eta)=\log(1+e^\eta)\). For Poisson, use \(A(\eta)=e^\eta\). Differentiate each twice, express the answers in the ordinary parameter, and verify that \(A'(\eta)\) and \(A''(\eta)\) equal the mean and variance of the sufficient statistic. What happens to Bernoulli curvature as \(p\to0\) or \(p\to1\)?
4. **Simple OLS by hand.** For

   $$
   x=(0,1,2,3),\qquad y=(1,2,2,5),
   $$

   compute \(\bar x,\bar y,S_{xx},S_{xy},\hat\beta_0,\hat\beta_1\), all four fitted values and residuals, RSS, \(s^2=\operatorname{RSS}/(n-2)\), and the conventional standard error \(s/\sqrt{S_{xx}}\) of the slope. Verify both normal equations \(\sum_i e_i=0\) and \(\sum_i x_ie_i=0\).
5. **Indicator coding changes coordinates, not fitted means.** A four-level factor has fitted means

   $$
   \mu_A=m,\quad \mu_B=m+1.2,\quad \mu_C=m-0.4,\quad \mu_D=m+0.7.
   $$

   Write the design row and coefficient vector using \(A\) as the reference. Then re-express exactly the same four means using \(C\) as the reference. Which individual coefficients change, and which scientifically meaningful contrasts remain invariant?
6. **An odds ratio is not a risk difference.** Consider

   $$
   \operatorname{logit}P(Y=1\mid x)=\alpha+x\log2,
   $$

   for \(x\in\{0,1\}\). Compute both probabilities, the odds ratio, and the risk difference when (a) \(\alpha=-2\) and (b) \(\alpha=1\). Explain why the odds ratio is identical but the risk difference is not.
7. **Poisson exposure and rate ratios.** System A records 20 failures over 100 accelerator-hours; system B records 12 failures over 40 accelerator-hours. Fit the two-group Poisson model

   $$
   \log E[Y_i]=\log t_i+\beta_0+\beta_1\mathbf1\{i=B\}.
   $$

   Using the observed rates as the fitted group rates, compute \(\hat\beta_0,\hat\beta_1\), and \(e^{\hat\beta_1}\). Then show what raw-count comparison would conclude and explain why it targets the wrong quantity.

**Core — problems 8–15.** These combine derivation with model criticism. Show intermediate quantities; a final number without the model or estimating equation is not a complete answer.

8. **Minimal sufficiency by likelihood ratios.** Let \(X_1,X_2,X_3\) be iid Bernoulli\((p)\), and take the eight binary sequences as the sample space.
   1. For two sequences \(x,y\), simplify \(L(p;x)/L(p;y)\).
   2. Determine exactly when this ratio is independent of \(p\).
   3. Partition all eight sequences into the resulting equivalence classes.
   4. Explain why the class label is a minimal sufficient statistic and why recording the order of the three outcomes contains no additional information about \(p\) under this model.
9. **Rao–Blackwellization with an exact variance comparison.** With \(X_1,\ldots,X_n\overset{\mathrm{iid}}{\sim}\operatorname{Bernoulli}(p)\), consider the unbiased estimator \(U=X_1\).
   1. Let \(S=\sum_iX_i\). Derive \(E[U\mid S]\) without invoking a memorized result.
   2. Show that the resulting estimator is \(\bar X\) and remains unbiased.
   3. Compute \(\operatorname{Var}(U)\), \(\operatorname{Var}(\bar X)\), and the exact reduction.
   4. Reconcile the result with the law of total variance by finding \(E[\operatorname{Var}(U\mid S)]\).
10. **A \(2\times2\) factorial model as regression.** Code factors \(a,b\in\{-1,+1\}\) and use

    $$
    E[Y\mid a,b]=\beta_0+\beta_Aa+\beta_Bb+\beta_{AB}ab.
    $$

    The four cell means are

    $$
    \mu_{--}=10,\qquad \mu_{+-}=14,\qquad
    \mu_{-+}=12,\qquad \mu_{++}=24.
    $$

    Write the \(4\times4\) design matrix, solve for all four coefficients, reconstruct the cell means, and compute the effect of changing \(A\) from \(-1\) to \(+1\) separately at \(B=-1\) and \(B=+1\). Explain why reporting only one “main effect of \(A\)” hides important structure.
11. **Conventional versus heteroskedasticity-consistent uncertainty.** Reuse the OLS data from problem 4. For simple regression with an intercept, compute the HC0 slope variance

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
12. **Clustering and effective sample size.** Suppose \(G=50\) independent tasks each contribute \(m=20\) exchangeable prompt scores with common marginal variance and intraclass correlation \(\rho\).
    1. Derive the variance of a task mean and the design effect \(1+(m-1)\rho\) relative to independent rows.
    2. Compute the effective row count

       $$
       n_{\mathrm{eff}}=\frac{Gm}{1+(m-1)\rho}
       $$

       and standard-error inflation for \(\rho=0,0.1,0.5\).
    3. Compare adding 20 more prompts to every existing task with collecting 50 new tasks when the deployment claim concerns new tasks. Explain which operation increases the number of independent units.
13. **GLS by whitening.** Consider the intercept-only model \(y=\beta\mathbf1+\varepsilon\) with

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
14. **One logistic Newton/IRLS step.** Fit an intercept-only Bernoulli model to \(y=(1,1,0)\), starting from \(\beta^{(0)}=0\).
    1. Write the mean negative log likelihood, gradient, and Hessian.
    2. Evaluate them at zero and take one undamped Newton step.
    3. Compare the result with the exact MLE \(\operatorname{logit}(2/3)\).
    4. Verify the analytic gradient by a centered finite difference, using several step sizes rather than reporting one convenient match.
    5. Explain why a line search or damping rule is still needed in a general multivariable problem even though this step succeeds.
15. **Count-diagnostic triage.** For each pattern below, identify the first mechanism to investigate, name a suitable model or correction, and state one diagnostic that distinguishes it from the other patterns.
    1. Residual means curve systematically with a recorded predictor, but variance is close to the fitted Poisson mean within narrow predictor bins.
    2. Conditional means look correct, but variance grows approximately as \(\mu+\mu^2/k\), without an unusual zero spike.
    3. Means and positive counts look plausible under a negative-binomial model, but zero counts remain far more common than predicted.
    4. Two machines have similar failure rates per hour, but the higher-exposure machine always has larger raw residuals because exposure was omitted from the fitted mean.

**Stretch — problems 16–24.** These are miniature research assignments. A complete submission includes assumptions, derivations or code, diagnostics, and a short interpretation that does not overstate the estimand.

16. **Sufficiency breaks under drift.** Compare the binary sequences

    $$
    x=(1,1,1,0,0,0),\qquad y=(0,0,0,1,1,1)
    $$

    observed at \(t=(-5,-3,-1,1,3,5)\).

    1. Show that they have identical likelihood under an iid Bernoulli model.
    2. Under \(\operatorname{logit}P(X_i=1)=\alpha+\beta t_i\), derive \(\log[L(\alpha,\beta;x)/L(\alpha,\beta;y)]\).
    3. Evaluate the ratio at \(\beta=-0.4\), explain which sequence is favored, and identify the statistic discarded by the iid sufficient count.
    4. Generalize: state a sufficient statistic for \((\alpha,\beta)\) when the \(t_i\) are fixed.
17. **A curved exponential family cannot generally match every sufficient moment.** Begin with \(X_i\sim\mathcal N(\mu,\sigma^2)\), but impose the nonlinear restriction \(\sigma^2=\mu^2\) with \(\mu>0\).
    1. Write the likelihood using \(S_1=\sum_iX_i\) and \(S_2=\sum_iX_i^2\).
    2. Derive the likelihood equation \(n\mu^2+S_1\mu-S_2=0\) and its positive solution.
    3. For \(x=(1,2,3)\), compute the restricted MLE.
    4. The model implies \(E[X]=\mu\) and \(E[X^2]=2\mu^2\). Show that no \(\mu\) matches both empirical moments in this sample, and explain why ordinary full-family moment matching fails on a curved subfamily.
18. **Complete separation and finite remedies.** Fit the no-intercept logistic model \(P(Y=1\mid x)=\operatorname{sigmoid}(\beta x)\) to

    $$
    x=(-2,-1,1,2),\qquad y=(0,0,1,1).
    $$

    1. Prove that the data are completely separated and write the mean negative log likelihood as a scalar function of \(\beta\).
    2. Evaluate it at \(\beta=0,1,3,10\), and prove that no finite MLE exists.
    3. Add the penalty \(0.1\beta^2/2\), derive the penalized score, and locate its zero numerically.
    4. Compare ridge penalization, a weakly informative Gaussian prior, and bias-reduced likelihood: state what extra structure each adds and which uncertainty claim remains unsupported without overlap.
19. **Winner's curse after searching 50 null features.** With a fixed seed, repeat the following experiment at least 2,000 times:
    1. Generate \(n=200\) independent rows with \(Y\sim\mathcal N(0,1)\) and 50 independent standard-normal features, all unrelated to \(Y\).
    2. Fit 50 separate simple regressions and retain the feature with the largest absolute \(t\)-statistic.
    3. Record whether its naive 95% coefficient interval excludes zero and the selected coefficient's absolute magnitude.
    4. Repeat using 100 rows for selection and the untouched 100 rows for confirmation of only the selected feature.

    Report the false-positive rate and coefficient-selection bias for both procedures. Compare the naive search result with the benchmark \(1-0.95^{50}\), and explain why sample splitting repairs confirmation but not the exploratory estimate.
20. **Four weighting schemes, four estimands.** Three task types have observed effects

    $$
    d=(0,1,1),
    $$

    estimated variances \(v=(1,1,9)\), inclusion probabilities \(\pi=(1,0.5,0.25)\), frequency weights \(f=(4,2,1)\), and deployment target weights \(q=(0.2,0.3,0.5)\).

    Compute the unweighted mean, inverse-variance mean, normalized inverse-inclusion (Hájek) mean, frequency-weighted mean, and deployment-weighted mean. For each, write the estimating equation or weighted target and state the population it answers. Explain why choosing whichever estimate is most favorable is an estimand change rather than a robustness analysis.
21. **Rare failures, exposure, and case-control sampling.** Suppose hardware A fails according to a Poisson process with rate \(0.001\) per hour and B with rate \(0.002\) per hour.
    1. Compute the probability of at least one failure over 10 and 1,000 hours for both systems. Compare risk ratios, odds ratios, and the constant rate ratio.
    2. Explain why a binary logistic model without exposure cannot represent all four probabilities with one hardware coefficient, whereas a Poisson count model with a log-exposure offset can represent the rates.
    3. A case-control dataset retains every deployment failure but only \(1/99\) of nonfailures. Derive the additive change in log odds caused by sampling and the intercept correction needed for deployment probabilities.
    4. State which quantities can remain transportable under outcome-dependent sampling and which require prevalence or sampling fractions.
22. **Crossed effects and the unit supporting each claim.** An evaluation compares versions A and B on 30 sampled tasks, 20 prompts nested within each task, three independent training runs per version, and eight raters. Every generated answer is scored by two randomly assigned raters.

    1. Write a mixed model containing a fixed version effect, task and prompt-within-task random intercepts, rater and training-run random intercepts, and a task-specific random version slope.
    2. For claims about new prompts, new tasks, new raters, and new training runs, identify the corresponding sampled unit and variance component.
    3. Propose a split and resampling scheme for a final new-task claim.
    4. Explain what becomes unidentified or confounded if A is scored only by raters 1–4 and B only by raters 5–8.
23. **When Gaussian partial pooling invents a nonexistent middle.** With a fixed seed, simulate \(J=40\) group effects from

    $$
    \theta_j\sim\tfrac12\mathcal N(-3,0.25^2)
    +\tfrac12\mathcal N(3,0.25^2),
    $$

    then draw five observations per group from \(\mathcal N(\theta_j,2^2)\).

    Fit or approximate (a) a single-Gaussian random-effects model and (b) a two-component hierarchical mixture. Compare group-effect RMSE, sign errors, interval coverage, the fraction of posterior means placed in the low-density interval \((-1,1)\), and held-out new-group log score. Explain when the simpler model might still estimate the overall mean adequately while failing subgroup and prediction goals.
24. **Capstone: a defensible agent comparison.** Version B of a support agent is claimed to improve successful resolution by at least three percentage points on future task families without increasing p95 latency by more than 10%. Available data include 40 sampled task families, 25 prompts per family, three stochastic completions from each version and prompt, three independent training runs per version, two blinded ratings per completion drawn from eight raters, latency, token cost, and a timestamp. The team has already used 25 task families repeatedly while developing B; 15 later task families remain untouched.

    Produce a preregistered analysis plan containing:

    1. target population, primary estimands, noninferiority/superiority thresholds, and exchangeable unit;
    2. pairing, randomization, rater assignment, development/final split, and handling of missing or failed runs;
    3. a model for binary resolution and a method for p95 latency, both respecting tasks, prompts, raters, runs, and time;
    4. uncertainty, power or detectable-effect reasoning, multiplicity policy, and a decision rule;
    5. diagnostics for calibration, heterogeneity, influential tasks, separation, dependence, and distribution shift;
    6. the exact tables and plots that would support or falsify the deployment claim.

    **Ten-point rubric:** two points each for estimand alignment, design and leakage control, dependence-aware modelling, valid uncertainty and multiplicity, and diagnostics plus transparent reporting. An analysis automatically fails if it treats completions as independent deployment units, uses a prompt-level random split across task families, changes the primary metric after inspecting the final 15 families, reports only a p-value, or interprets a conditional odds ratio as the required marginal percentage-point improvement.

<details><summary>Worked solution sketches</summary>

1. The four likelihood kernels are

   $$
   p^{\sum x_i}(1-p)^{n-\sum x_i},\qquad
   e^{-n\lambda}\lambda^{\sum x_i}\prod_i\frac1{x_i!},
   $$

   $$
   \exp\!\left\{-\frac18\sum_i(x_i-\mu)^2\right\},\qquad
   (\sigma^2)^{-n/2}\exp\!\left\{-\frac{\sum_i(x_i-\mu)^2}{2\sigma^2}\right\}.
   $$

   Thus one-dimensional statistics \(\sum x_i\) suffice in the first three cases. With both Gaussian parameters unknown, expand the square: parameter dependence passes through \((\sum x_i,\sum x_i^2)\), a two-dimensional statistic. The mean alone loses the dispersion information needed for \(\sigma^2\).
2. One valid choice is:

   - Bernoulli: \(T(x)=x\), \(\eta=\log[p/(1-p)]\in\mathbb R\), \(A(\eta)=\log(1+e^\eta)\), \(h(x)=1\), and \(p=\operatorname{sigmoid}(\eta)\).
   - Poisson: \(T(x)=x\), \(\eta=\log\lambda\in\mathbb R\), \(A(\eta)=e^\eta\), \(h(x)=1/x!\), and \(\lambda=e^\eta\).
   - Gaussian with variance four: \(T(x)=x\), \(\eta=\mu/4\in\mathbb R\), \(A(\eta)=2\eta^2\), and \(h(x)=(8\pi)^{-1/2}e^{-x^2/8}\); hence \(\mu=4\eta\).
   - Three-class categorical with class 3 as reference: \(T(x)=(\mathbf1\{x=1\},\mathbf1\{x=2\})\), \(\eta_j=\log(p_j/p_3)\in\mathbb R\), \(A(\eta)=\log(1+e^{\eta_1}+e^{\eta_2})\), and \(h(x)=1\). Softmax recovers the probabilities. Adding the same constant to three unconstrained logits changes no probability, so one direction is unidentifiable; fixing a reference removes it.
3. Bernoulli gives \(A'(\eta)=e^\eta/(1+e^\eta)=p\) and \(A''(\eta)=p(1-p)\). Poisson gives \(A'(\eta)=A''(\eta)=e^\eta=\lambda\). Bernoulli curvature vanishes near zero and one: nearly deterministic observations contain little local information on the natural-parameter scale and Newton steps can become poorly conditioned.
4. Here \(\bar x=1.5\), \(\bar y=2.5\), \(S_{xx}=5\), and \(S_{xy}=6\), so \(\hat\beta_1=1.2\) and \(\hat\beta_0=0.7\). Fitted values are \((0.7,1.9,3.1,4.3)\); residuals are \((0.3,0.1,-1.1,0.7)\). Therefore \(\operatorname{RSS}=1.8\), \(s^2=0.9\), and \(\operatorname{SE}(\hat\beta_1)=\sqrt{0.9/5}=\sqrt{0.18}\approx0.4243\). Both \(0.3+0.1-1.1+0.7\) and \(0(0.3)+1(0.1)+2(-1.1)+3(0.7)\) equal zero.
5. With \(A\) as reference, use rows \((1,I_B,I_C,I_D)\) and coefficients \((m,1.2,-0.4,0.7)\). With \(C\) as reference, use \((1,I_A,I_B,I_D)\) and coefficients \((m-0.4,0.4,1.6,1.1)\). The intercept and reference-relative coefficients change. Every fitted cell mean and contrast such as \(\mu_B-\mu_D=0.5\) remains unchanged.
6. When \(\alpha=-2\), the probabilities are \(\operatorname{sigmoid}(-2)\approx0.1192\) and \(\operatorname{sigmoid}(-2+\log2)\approx0.2130\), so the risk difference is about \(0.0938\). When \(\alpha=1\), they are about \(0.7311\) and \(0.8446\), so the risk difference is about \(0.1135\). In both cases the odds ratio is \(e^{\log2}=2\). The inverse-logit map is nonlinear, so a constant odds multiplier does not produce a constant probability increment.
7. The fitted rates are \(20/100=0.2\) and \(12/40=0.3\) failures per hour. Therefore \(\hat\beta_0=\log0.2\approx-1.6094\), \(\hat\beta_1=\log(0.3/0.2)=\log1.5\approx0.4055\), and \(e^{\hat\beta_1}=1.5\): B's fitted failure rate is 50% higher. Raw counts give \(12/20=0.6\) and misleadingly make B look safer because B had less exposure. The offset fixes exposure's coefficient at one and makes the learned contrast a rate comparison.
8. Write \(s_x=\sum_i x_i\) and \(s_y=\sum_i y_i\). Then

   $$
   \frac{L(p;x)}{L(p;y)}
   =\left(\frac{p}{1-p}\right)^{s_x-s_y},
   $$

   which is independent of \(p\in(0,1)\) exactly when \(s_x=s_y\). The equivalence classes are

   $$
   \{000\},\quad
   \{100,010,001\},\quad
   \{110,101,011\},\quad
   \{111\}.
   $$

   Their label is \(S=\sum_iX_i\). The likelihood-ratio criterion makes \(S\) minimal sufficient: any sufficient statistic must distinguish sequences from different classes but need not distinguish sequences within one class. Order becomes informative only after changing the model, for example by allowing trial-specific probabilities or temporal drift.
9. Conditional on \(S=s\), the \(s\) successes are exchangeable across the \(n\) positions. Exactly \({n-1\choose s-1}\) of the \({n\choose s}\) compatible sequences have \(X_1=1\), so

   $$
   E[X_1\mid S=s]=P(X_1=1\mid S=s)
   =\frac{{n-1\choose s-1}}{{n\choose s}}=\frac{s}{n}.
   $$

   Therefore \(E[U\mid S]=S/n=\bar X\), and iterated expectation preserves \(E[\bar X]=p\). The variances are

   $$
   \operatorname{Var}(U)=p(1-p),\qquad
   \operatorname{Var}(\bar X)=\frac{p(1-p)}n,
   $$

   so the reduction is \(p(1-p)(1-1/n)\). Given \(S\), \(X_1\) is Bernoulli with probability \(S/n\), hence

   $$
   E[\operatorname{Var}(U\mid S)]
   =E\!\left[\frac Sn\left(1-\frac Sn\right)\right]
   =p(1-p)\left(1-\frac1n\right).
   $$

   The total-variance identity decomposes the original variance into exactly this removable part plus \(\operatorname{Var}(S/n)\).
10. In the order \((--),(+-),(-+),(++)\), the design matrix is

    $$
    X=
    \begin{pmatrix}
    1&-1&-1& 1\\
    1& 1&-1&-1\\
    1&-1& 1&-1\\
    1& 1& 1& 1
    \end{pmatrix}.
    $$

    Its orthogonal columns give

    $$
    \beta_0=15,\qquad \beta_A=4,\qquad
    \beta_B=3,\qquad \beta_{AB}=2.
    $$

    Substitution reconstructs \((10,14,12,24)\). Changing \(A\) gives \(14-10=4\) when \(B=-1\), but \(24-12=12\) when \(B=+1\). Their average is \(8=2\beta_A\); the difference between them is \(8=4\beta_{AB}\). A lone main-effect summary suppresses the interaction and describes neither subgroup-specific effect.
11. From problem 4, \(x_i-\bar x=(-1.5,-0.5,0.5,1.5)\), \(e=(0.3,0.1,-1.1,0.7)\), and \(S_{xx}=5\). Thus

    $$
    \sum_i(x_i-\bar x)^2e_i^2
    =0.2025+0.0025+0.3025+1.1025=1.61.
    $$

    HC0 variance is \(1.61/25=0.0644\), giving standard error \(0.2538\). HC1 multiplies the variance by \(4/(4-2)=2\), giving variance \(0.1288\) and standard error \(0.3589\). The conventional standard error was \(0.4243\). Robust does not mean numerically larger in every realized sample, especially with four rows; it means the estimator targets the appropriate asymptotic covariance under heteroskedasticity.

    In the specified simulation, the true slope variance is approximately

    $$
    \frac{20\sum_{x=-2}^2x^2(1+|x|)^2}{200^2}
    =\frac{1600}{40000}=0.04,
    $$

    so the true standard error is \(0.2\). The conventional calculation effectively averages variances and gives roughly \(\sqrt{5.4/200}\approx0.164\), producing coverage around \(0.89\) rather than \(0.95\). A correct seeded implementation should find HC1 materially closer to nominal coverage, commonly around \(0.94\)–\(0.95\); exact Monte Carlo results vary. The experiment must regenerate errors, refit, and recompute both intervals on every repetition.
12. If each row has variance \(\sigma^2\) and each distinct pair within a task has covariance \(\rho\sigma^2\), then

    $$
    \operatorname{Var}(\bar Y_g)
    =\frac{\sigma^2}{m}\{1+(m-1)\rho\}.
    $$

    The bracketed term is the design effect. For \(Gm=1000\) rows:

    | \(\rho\) | Design effect | \(n_{\mathrm{eff}}\) | SE inflation |
    |---:|---:|---:|---:|
    | \(0\) | \(1\) | \(1000\) | \(1\) |
    | \(0.1\) | \(2.9\) | \(344.8\) | \(1.703\) |
    | \(0.5\) | \(10.5\) | \(95.2\) | \(3.240\) |

    Adding 20 prompts to each existing task gives \(G=50,m=40\) and \(n_{\mathrm{eff}}=2000/[1+39\rho]\). Adding 50 new tasks at 20 prompts each gives \(G=100,m=20\) and \(n_{\mathrm{eff}}=2000/[1+19\rho]\). The second is larger whenever \(\rho>0\); at \(\rho=0.1\), the values are about \(408.2\) and \(689.7\). Only the second design doubles the independent task count needed for a new-task claim.
13. The determinant of \(\Sigma\) is \(3.75\), so

    $$
    \Sigma^{-1}
    =\frac1{3.75}
    \begin{pmatrix}4&-0.5\\-0.5&1\end{pmatrix}.
    $$

    Substitution gives \(\hat\beta_{\mathrm{GLS}}=1.25\), equivalently the covariance-adjusted weighted average \(0.875(1)+0.125(3)\). Also,

    $$
    X^\star=C^{-1}\mathbf1
    =\begin{pmatrix}1\\0.5/\sqrt{3.75}\end{pmatrix},
    \qquad
    y^\star=C^{-1}y
    =\begin{pmatrix}1\\2.5/\sqrt{3.75}\end{pmatrix}.
    $$

    Therefore

    $$
    \frac{X^{\star T}y^\star}{X^{\star T}X^\star}
    =\frac{1+1.25/3.75}{1+0.25/3.75}
    =1.25.
    $$

    The first observation has much smaller marginal variance. Correlation further changes the incremental information in the second, so GLS lies closer to the first value than the unweighted mean \(2\).
14. With \(p=\operatorname{sigmoid}(\beta)\), the mean negative log likelihood, gradient, and Hessian are

    $$
    L(\beta)=-\frac13\{2\log p+\log(1-p)\},\qquad
    L'(\beta)=p-\frac23,\qquad
    L''(\beta)=p(1-p).
    $$

    At zero, \(p=1/2\), \(L'=-1/6\), and \(L''=1/4\), so

    $$
    \beta^{(1)}
    =0-\frac{-1/6}{1/4}=\frac23\approx0.6667.
    $$

    The exact MLE is \(\log[(2/3)/(1/3)]=\log2\approx0.6931\). A centered difference

    $$
    \frac{L(\beta+h)-L(\beta-h)}{2h}
    $$

    should approach the analytic gradient with \(O(h^2)\) truncation error before floating-point cancellation dominates at very small \(h\). In multiple dimensions or near separation, a raw Newton step can overshoot, encounter weak curvature, or head toward an infinite optimum. Damping or line search requires actual objective improvement.
15. The appropriate first diagnoses are:

    1. **Omitted mean structure.** Add the justified nonlinear term, interaction, or smoother and verify the residual-mean curve disappears on held-out data. A variance-only correction cannot repair a wrong conditional mean.
    2. **Latent rate heterogeneity or negative-binomial overdispersion.** Fit a negative-binomial or mechanistic random-rate model and check variance across replicated units at similar fitted means. A sandwich covariance can protect coefficient uncertainty but does not model the predictive count distribution.
    3. **Structural zeros or a separate participation process.** Compare zero-inflated and hurdle mechanisms using domain knowledge plus held-out zero and positive-count calibration. Merely lowering one dispersion parameter should not be accepted if positive counts then fit poorly.
    4. **Exposure misspecification.** Include \(\log t_i\) as an offset and examine rates rather than raw counts. After correction, residuals should no longer scale systematically with exposure.

    These mechanisms can coexist. Diagnosis therefore uses residual means, conditional variance, zero frequency, positive-count shape, and exposure jointly rather than selecting a model from one dispersion statistic.
16. Both sequences have three successes, so their iid Bernoulli likelihood is \(p^3(1-p)^3\). Under the trend model, the normalizing terms cancel between sequences and

    $$
    \log\frac{L(\alpha,\beta;x)}{L(\alpha,\beta;y)}
    =\beta\sum_i t_i(x_i-y_i)=-18\beta.
    $$

    At \(\beta=-0.4\), the likelihood ratio is \(e^{7.2}\approx1339.4\), strongly favoring early successes \(x\). The iid count discarded \(\sum_it_iX_i\), which records when successes occurred. With fixed \(t_i\), the logistic likelihood depends on data through

    $$
    T(X)=\left(\sum_iX_i,\sum_it_iX_i\right),
    $$

    sufficient for \((\alpha,\beta)\). Sufficiency changed because the model changed.
17. Up to parameter-free constants, the restricted log likelihood is

    $$
    \ell(\mu)
    =-n\log\mu-\frac{S_2-2\mu S_1+n\mu^2}{2\mu^2},
    \qquad \mu>0.
    $$

    Differentiation and multiplication by \(\mu^3\) give

    $$
    n\mu^2+S_1\mu-S_2=0,
    \qquad
    \hat\mu=\frac{-S_1+\sqrt{S_1^2+4nS_2}}{2n}.
    $$

    For \(x=(1,2,3)\), \(S_1=6\), \(S_2=14\), and \(\hat\mu=(-6+\sqrt{204})/6\approx1.3805\). The empirical first and second moments are \(2\) and \(14/3\). Matching the first requires \(\mu=2\), which predicts second moment \(8\); matching the second requires \(\mu=\sqrt{7/3}\approx1.5275\), which misses the first. The one-dimensional curved subfamily traces \((E[X],E[X^2])=(\mu,2\mu^2)\) inside a two-dimensional mean-parameter space, so an arbitrary empirical moment pair cannot lie on it.
18. Every positive \(x\) has \(y=1\) and every negative \(x\) has \(y=0\); increasing \(\beta>0\) increases every signed margin. The mean loss is

    $$
    L(\beta)
    =\frac12\left[\log(1+e^{-2\beta})+\log(1+e^{-\beta})\right].
    $$

    Its values at \(\beta=0,1,3,10\) are approximately \(0.6931,0.2201,0.02553,0.0000227\). It decreases toward zero as \(\beta\to\infty\), but is positive for every finite \(\beta\), so no finite MLE exists.

    With \(J(\beta)=L(\beta)+0.1\beta^2/2\),

    $$
    J'(\beta)
    =-\frac12\left[\frac{2}{1+e^{2\beta}}+
    \frac1{1+e^\beta}\right]+0.1\beta,
    $$

    whose zero is about \(1.46\). Ridge optimization and a zero-centered Gaussian-prior MAP have the same algebra after matching scales, but one is presented as regularization and the other as prior information with posterior uncertainty. Bias-reduced likelihood adds an information-dependent correction rather than a fixed coefficient scale. All make a finite estimate; none manufactures empirical overlap or validates calibrated extrapolation beyond the observed feature-label pattern.
19. With nearly independent null tests, the chance that at least one naive 5% test rejects is approximately

    $$
    1-0.95^{50}\approx0.923.
    $$

    The simulation should produce a similarly high exclusion rate, subject to dependence among statistics induced by sharing \(Y\). The selected coefficient's signed expectation remains zero by symmetry, but its expected absolute magnitude is strongly inflated. Reusing the same rows for selection and inference conditions on an extreme statistic while applying an unconditional interval.

    On the untouched half, only one prespecified coefficient is tested. Its false-positive rate should return to approximately \(0.05\), and its coefficient is centered at zero without winner's-curse inflation. The exploratory coefficient from the first half remains biased in magnitude; splitting creates valid confirmation, not an unbiased retrospective story about the selected development estimate. A valid submission reports its seed, empirical rates, Monte Carlo standard errors, and the complete selection rule.
20. Every weighted mean solves \(\sum_iw_i(d_i-\theta)=0\), but the weights define different targets:

    | Method | Weights | Estimate |
    |---|---|---:|
    | Unweighted | \((1,1,1)\) | \(2/3\approx0.6667\) |
    | Inverse variance | \((1,1,1/9)\) | \(10/19\approx0.5263\) |
    | Hájek inverse inclusion | \((1,2,4)\) | \(6/7\approx0.8571\) |
    | Frequency | \((4,2,1)\) | \(3/7\approx0.4286\) |
    | Deployment | \((0.2,0.3,0.5)\) | \(0.8\) |

    The first averages represented task types equally. Precision weighting targets a precision-weighted common effect and is efficient only for an appropriate common-effect model. Inverse-inclusion weighting reconstructs the sampled population. Frequency weights act as row replication. Deployment weights define the stated future mixture. These are not interchangeable variance estimators; selecting among their answers after seeing them silently changes the scientific question.
21. For exposure \(t\), the probability of at least one failure is \(1-e^{-\lambda t}\):

    | Exposure | A | B |
    |---:|---:|---:|
    | 10 hours | \(0.00995\) | \(0.01980\) |
    | 1,000 hours | \(0.63212\) | \(0.86466\) |

    The risk ratio changes from about \(1.990\) to \(1.368\). The odds ratio changes from about \(2.010\) to \(3.718\), while the underlying rate ratio remains \(0.002/0.001=2\). Exposure changes the nonlinear mapping from a rate to a binary event probability. A Poisson model

    $$
    \log E[N\mid z,t]=\log t+\beta_0+\beta_1z
    $$

    represents both rates with \(e^{\beta_1}=2\); a binary model omitting \(t\) cannot.

    If cases and controls are retained with probabilities \(s_1=1\) and \(s_0=1/99\), sample odds equal deployment odds times \(s_1/s_0=99\). Thus the sampled intercept is shifted upward by \(\log99\approx4.595\); subtract that value for deployment calibration. Under correct logistic specification and sampling based only on outcome, slopes can remain estimable, but the intercept, prevalence, calibrated risks, predictive values, and threshold decisions require deployment prevalence or known sampling fractions.
22. For a binary rating, one suitable model is

    $$
    \operatorname{logit}P(Y=1)
    =\beta_0+\beta_VV+b_{\text{task}}+
    s_{\text{task}}V+u_{\text{prompt(task)}}+
    r_{\text{rater}}+c_{\text{run}},
    $$

    with a joint distribution for task intercepts and task-specific version slopes. A completion-level random intercept can additionally connect its two ratings. Prompt variation supports new-prompt claims within represented tasks; task intercept and slope variation support new-task levels and version effects; rater variation supports new-rater scoring; run variation supports retraining claims.

    Reserve whole task families, preferably later ones, for final evaluation. Fit and tune only on development tasks, then evaluate once on held-out tasks. For nonparametric uncertainty, resample task families as the outer unit and preserve all nested prompts, completions, and ratings; propagate independent-run variation rather than treating runs as repeated rows.

    If rater pools are disjoint by version, version and rater-pool effects are perfectly aliased: a systematic severity difference between pools is indistinguishable from a version effect. Crossing or randomizing raters across versions is a design requirement, not something a mixed-model optimizer can repair afterward.
23. A correct comparison uses the same simulated groups for both models and evaluates latent effects and held-out observations separately. The single-Gaussian model estimates a broad distribution centered near zero. For noisy small groups it consequently shrinks estimates toward a region where the true population has almost no mass, increasing \((-1,1)\) posterior means and potentially sign errors. A well-identified two-component hierarchy instead borrows information toward approximately \(-3\) or \(+3\), usually improving group RMSE and new-group log score.

    Coverage must be checked against the true \(\theta_j\), not against observed group means. Mixture label switching should be handled through ordered component means or label-invariant summaries. Report Monte Carlo uncertainty across repeated datasets; one favorable seed is not evidence.

    Because the mixture is symmetric, the overall population mean is zero. With enough groups, the misspecified Gaussian model can estimate that mean well even while giving poor subgroup estimates, implausible new-group predictions, and misleading intervals. Adequacy is therefore estimand-specific: success on the grand mean does not validate the random-effects distribution.
24. One defensible plan has the following structure:

    - **Estimands and decisions:** The primary quality estimand is the task-family-weighted marginal difference \(P_B(\text{resolution})-P_A(\text{resolution})\) on future task families, averaging over prompts, runs, completions, and the target rater protocol. Claim superiority only if the lower confidence bound exceeds \(0.03\). Define latency noninferiority as \(q_{0.95,B}/q_{0.95,A}<1.10\), and require its upper bound below \(1.10\). Deployment requires both conditions.
    - **Design:** Keep the 15 later families sealed until the model, exclusions, tie handling, aggregation, and plots are frozen. Run both versions on every prompt with randomized execution order. Cross raters over versions and blind labels. Treat missing runs as failures when caused by the system and distinguish them from infrastructure censoring through a prespecified rule.
    - **Quality model:** Use a logistic mixed model with version fixed effect; task intercepts and version slopes; prompt-within-task, rater, and run effects; and a completion effect for duplicate ratings. Convert fitted results to task-weighted marginal probability differences rather than reporting the conditional odds ratio alone. A task-level paired estimator provides a transparent robustness check.
    - **Latency:** Compare paired prompt-level latency distributions while preserving run and task structure. Estimate task-weighted p95 values with a hierarchical or task-cluster bootstrap; report the ratio and its interval. Do not pool millions of token or request timings as independent evidence.
    - **Uncertainty and multiplicity:** Base primary uncertainty on held-out task families, with task-cluster resampling or model-based new-task prediction that includes the random version slope. Use development data for detectable-effect planning before unsealing. Quality and latency form a prespecified intersection decision; secondary slices use false-discovery control or are labelled exploratory.
    - **Diagnostics and reporting:** Show task-level paired effects with intervals, the distribution of task-specific version effects, calibration by version, rater severity and agreement, run variation, missingness, separation checks, influential-task leave-one-out results, p50/p95/p99 latency with uncertainty, and development-versus-final covariate shift. Publish denominators, exclusions, raw task summaries, model specification, convergence checks, and sensitivity analyses.

    Award two rubric points in a category only when the plan states both the target and the operational procedure supporting it; award one for a correct but incomplete treatment and zero for an absent or contradictory one. Any automatic-failure condition invalidates the deployment conclusion even if the numerical result is favorable.

</details>

## Mastery check

Given an unfamiliar regression claim, reconstruct the conditional probability model; identify its sufficient statistics and exponential-family structure where present; derive its score, information, and estimand; fit it stably; choose uncertainty matching heteroskedasticity and dependence; interpret effects on appropriate conditional and marginal scales; diagnose functional-form, leverage, separation, overdispersion, and selection failures; and decide whether no pooling, complete pooling, or partial pooling matches the population being studied.

The next advanced statistics unit should develop predictive uncertainty, calibration, proper scoring rules, and conformal prediction. Those ideas use GLM probabilities as a concrete starting point while extending guarantees beyond a single parametric outcome model.
