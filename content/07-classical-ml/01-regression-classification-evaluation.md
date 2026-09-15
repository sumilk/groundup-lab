# Classical ML: linear models, likelihoods, and honest evaluation

**Prerequisites:** matrix calculus and probability. **Outcome:** implement regression and classification, then defend the evaluation design.

## Regression as a probabilistic model

Assume $y_i=x_i^Tw+\epsilon_i$, with independent $\epsilon_i\sim N(0,\sigma^2)$. Ignoring constants, negative log likelihood is

$$
\frac{1}{2\sigma^2}\sum_i(y_i-x_i^Tw)^2.
$$

Thus squared-error minimization is MLE under a Gaussian noise model. The algorithm can still be useful when that model is imperfect, but inferential claims must account for misspecification.

For $L=\|Xw-y\|^2/(2N)$, stationary points satisfy $X^TXw=X^Ty$. This does not justify explicitly forming an inverse. Prefer a numerical least-squares solver; rank and conditioning determine uniqueness and sensitivity.

With Gaussian prior $w\sim N(0,\tau^2I)$, MAP adds a quadratic penalty. Under this likelihood scaling, the unnormalized penalty coefficient is $\sigma^2/\tau^2$. Always track whether the empirical loss is a sum or mean before comparing regularization parameters.

## Logistic regression

For binary labels, set $z=x^Tw+b$ and $p=\sigma(z)=1/(1+e^{-z})$. The log odds are linear: $\log[p/(1-p)]=z$.

Binary negative log likelihood is

$$
\ell(z,y)=-y\log p-(1-y)\log(1-p)
=\log(1+e^z)-yz.
$$

A stable expression is $\max(z,0)-yz+\log(1+e^{-|z|})$. Its derivative is $\partial\ell/\partial z=p-y$. For a batch, $\nabla_w L=X^T(p-y)/N$. Its Hessian is $X^TDX/N$, where $D_{ii}=p_i(1-p_i)\ge0$, proving convexity.

Perfectly separable data can drive unregularized weights toward infinity: convexity does not guarantee a finite optimum. Regularization can restore a finite solution.

> **Predict:** Why does applying sigmoid and then taking logs fail for extreme logits even when the algebra is correct?

## Bias, variance, and preprocessing

For squared error at a fixed input, expected prediction error decomposes into squared bias, prediction variance, and irreducible observation noise under the usual independent-noise assumptions. Increasing model flexibility can reduce bias while increasing variance.

Fit preprocessing on training data only. Standardization, imputation, vocabulary learning, feature selection, and PCA all estimate properties of data. A pipeline that learns them from the full dataset leaks information into evaluation.

Split by the unit that matches deployment. Time-series forecasting needs chronological boundaries and attention to overlapping label windows. Customer-specific generalization may need customer-group splits.

## Model alternatives

A decision tree partitions feature space and predicts within leaves. Deep trees reduce training error but can have high variance. Bagging averages diverse fitted models; boosting adds models sequentially to reduce an objective. Kernel methods compare examples in an implicit feature space. These are distinct inductive biases, not automatic upgrades over linear models.

This lesson establishes the linear baseline. Full trees, boosting, SVM, kernels, clustering, mixture models, EM, and Gaussian processes remain separate future lessons.

## Evaluation and decisions

Use held-out loss to evaluate probabilities and a task-specific decision metric for actions. Precision depends on prevalence; recall measures positive-case coverage. ROC-AUC measures ranking over thresholds and can obscure poor precision on rare events. Calibration asks whether predicted probabilities match observed frequencies.

Treat a test set as a final evaluation, not a repeated tuning resource. Report uncertainty and compare to simple baselines. For a trading task, include costs and an executable time ordering; for call quality, stratify errors by language, customer, and failure category.

## Lab and problems

1. Implement logistic loss and gradient without a model library.
2. Check the gradient against central differences at extreme and ordinary logits.
3. Overfit a tiny clean dataset, then fit a regularized version.
4. Compare chronological and random splits on synthetic autocorrelated data.
5. Derive the Hessian and explain why separability can produce diverging weights.
6. Show how refitting a scaler on validation data changes the evaluation.

<details><summary>Solutions</summary>

Sigmoid may round to exactly zero or one, so taking logarithms can produce infinities. The logit-space stable formula avoids this. On separable data, increasing margin improves likelihood indefinitely toward its supremum. The Hessian is positive semidefinite but does not force a finite solution. Validation preprocessing must reuse training statistics.

</details>

**Mastery:** derive, implement, diagnose, and evaluate one baseline without delegating its core logic.
