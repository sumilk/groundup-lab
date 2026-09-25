# Hands-on labs

Use Python 3.11 or later. These seventy exercises need only the standard library; no GPU, API key, package installation, or paid dataset is required.

In the theory reader, select the linked exercise inside a lesson to open its runnable Python workspace on the right without losing your reading position. If a lesson gains multiple coding exercises, task tabs share that workspace. The implementation and most recent output are saved in that browser for each task. **Run tests** executes the behavioral check, **Run code** supports print-based exploration, **Stop** terminates a stuck worker, and **Reset starter** restores the authored skeleton. The command-line workflow below remains available.

1. Read the linked lesson and make a prediction.
2. Implement one function in exercises.py from a blank definition.
3. Run its check, for example: **python -m labs.checks softmax**.
4. Explain a failed case before editing.
5. After an attempt, inspect reference.py and compare reasoning.
6. Run **python -m labs.checks --reference** to verify the reference suite.

| Task argument | Lesson | Evidence |
|---|---|---|
| moments | [Python](../content/01-python/01-python-memory-iteration.md) | Stable one-pass statistics |
| conditional | [Probability foundations](../content/05-probability-statistics/00-probability-foundations.md) | Exact conditioning on a finite sample space |
| categorical | [Random variables and distributions](../content/05-probability-statistics/01-random-variables-distributions.md) | Reproducible inverse-CDF sampling from weights |
| joint | [Joint distributions and covariance](../content/05-probability-statistics/02-joint-distributions-conditioning-covariance.md) | Marginalization and covariance on sparse finite support |
| convolution | [Transformations and Jacobians](../content/05-probability-statistics/03-transformations-convolution-jacobians.md) | Exact convolution of sparse finite PMFs |
| gaussian | [Multivariate Gaussian geometry](../content/05-probability-statistics/04-multivariate-gaussian-geometry.md) | Conditional Gaussian mean and uncertainty |
| monte-carlo | [Repeated samples and Monte Carlo error](../content/05-probability-statistics/05-limit-theorems-monte-carlo.md) | Dependence-aware uncertainty from contiguous batch means |
| bernoulli-mle | [Estimation and likelihood](../content/05-probability-statistics/06-estimation-likelihood-fisher.md) | Boundary-safe Bernoulli MLE and plug-in uncertainty |
| binomial-test | [Hypothesis testing and confidence intervals](../content/05-probability-statistics/07-hypothesis-testing-confidence-power.md) | Exact binomial tails and an interval obtained by inversion |
| bh-fdr | [Hypothesis testing and multiple comparisons](../content/05-probability-statistics/07-hypothesis-testing-confidence-power.md) | Benjamini–Hochberg decisions and adjusted p-values |
| bootstrap | [Bootstrap and experimental design](../content/05-probability-statistics/08-resampling-sequential-experimental-design.md) | Seeded bootstrap standard error and percentile interval |
| permutation | [Permutation tests and randomization](../content/05-probability-statistics/08-resampling-sequential-experimental-design.md) | Exact paired sign-flip test |
| e-process | [Sequential inference](../content/05-probability-statistics/08-resampling-sequential-experimental-design.md) | Bernoulli likelihood-ratio e-process and anytime p-value |
| beta-update | [Bayesian modeling and computation](../content/05-probability-statistics/09-bayesian-modeling-computation.md) | Conjugate Beta–Bernoulli updating and prediction |
| importance | [Bayesian modeling and computation](../content/05-probability-statistics/09-bayesian-modeling-computation.md) | Stable self-normalized importance weighting and ESS |
| metropolis | [Bayesian modeling and computation](../content/05-probability-statistics/09-bayesian-modeling-computation.md) | Log-space random-walk Metropolis sampling |
| stratified | [Sampling design and rigorous ML evaluation](../content/05-probability-statistics/10-sampling-design-ml-evaluation.md) | Stratified finite-population mean and standard error |
| horvitz-thompson | [Sampling design and rigorous ML evaluation](../content/05-probability-statistics/10-sampling-design-ml-evaluation.md) | Unequal-inclusion population total and mean |
| rejection | [Sampling design and rigorous ML evaluation](../content/05-probability-statistics/10-sampling-design-ml-evaluation.md) | Generic envelope-based rejection sampler |
| simple-ols | [Exponential families, regression, and GLMs](../content/05-probability-statistics/11-exponential-families-regression-glms.md) | Simple OLS coefficients and slope uncertainty |
| logistic-gradient | [Exponential families, regression, and GLMs](../content/05-probability-statistics/11-exponential-families-regression-glms.md) | Stable Bernoulli loss and logistic-regression gradient |
| partial-pooling | [Exponential families, regression, and GLMs](../content/05-probability-statistics/11-exponential-families-regression-glms.md) | Normal-normal group shrinkage and pooling weights |
| projection | [High-dimensional probability](../content/05-probability-statistics/12-high-dimensional-probability.md) | Random projection distortion of pairwise distances |
| project-onto | [Projection and least squares](../content/02-linear-algebra/03-projections-least-squares.md) | Projection matrix, projected vector, and residual from a column basis |
| normal-equations | [Projection and least squares](../content/02-linear-algebra/03-projections-least-squares.md) | Full-column-rank least squares by Gram construction and elimination |
| gram-metric | [Projection and least squares](../content/02-linear-algebra/03-projections-least-squares.md) | Validate positive definiteness and compute a metric inner product |
| gram-schmidt | [Orthonormal bases and QR](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Classical and modified factorizations with distinct arithmetic schedules |
| qr-solve | [Orthonormal bases and QR](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Reorthogonalization, accumulated R corrections, and triangular least squares |
| orthogonality-defect | [Orthonormal bases and QR](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Off-diagonal overlap without confusing it with normalization |
| calibration | [Calibration, scoring, and conformal prediction](../content/05-probability-statistics/13-calibration-scoring-conformal.md) | Binned expected calibration error |
| conformal | [Calibration, scoring, and conformal prediction](../content/05-probability-statistics/13-calibration-scoring-conformal.md) | Split conformal threshold at the finite-sample rank |
| elbo-terms | [Latent variables and the ELBO](../content/05-probability-statistics/14-latent-variables-elbo-gradient-estimators.md) | Gaussian divergence and evidence lower bound |
| gumbel | [Latent variables and the ELBO](../content/05-probability-statistics/14-latent-variables-elbo-gradient-estimators.md) | Seeded Gumbel-max categorical sampling |
| decoding | [Score matching, diffusion, and sampling](../content/05-probability-statistics/15-score-matching-diffusion-sampling.md) | Temperature and nucleus truncation of a distribution |
| diffusion | [Score matching, diffusion, and sampling](../content/05-probability-statistics/15-score-matching-diffusion-sampling.md) | Closed-form forward diffusion coefficients |
| backdoor | [Observational causal inference and missing data](../content/05-probability-statistics/16-causal-inference-missing-data.md) | Standardized effect against a crude Simpson reversal |
| ipw | [Observational causal inference and missing data](../content/05-probability-statistics/16-causal-inference-missing-data.md) | Horvitz-Thompson and Hajek weighting with effective sample size |
| iv-wald | [Observational causal inference and missing data](../content/05-probability-statistics/16-causal-inference-missing-data.md) | Intention to treat, first stage, and the Wald ratio |
| em-step | [Mixtures, EM, and graphical models](../content/05-probability-statistics/17-mixtures-em-graphical-models.md) | Monotone EM step with log-space responsibilities |
| hmm-forward | [Mixtures, EM, and graphical models](../content/05-probability-statistics/17-mixtures-em-graphical-models.md) | Scaled forward recursion and filtered state posterior |
| d-separation | [Mixtures, EM, and graphical models](../content/05-probability-statistics/17-mixtures-em-graphical-models.md) | Path blocking under the chain, fork, and collider rules |
| dkw-band | [Order statistics and nonparametrics](../content/05-probability-statistics/18-order-statistics-empirical-processes-nonparametrics.md) | Distribution-free simultaneous band around the empirical CDF |
| mann-whitney | [Order statistics and nonparametrics](../content/05-probability-statistics/18-order-statistics-empirical-processes-nonparametrics.md) | Pairwise-win statistic, win rate, and tie-corrected normal score |
| kde | [Order statistics and nonparametrics](../content/05-probability-statistics/18-order-statistics-empirical-processes-nonparametrics.md) | Gaussian kernel density estimate at arbitrary query points |
| span | [Vectors, span, independence and bases](../content/02-linear-algebra/01-vectors-spaces-bases.md) | Elimination decides membership in a span and returns coefficients |
| dependence | [Vectors, span, independence and bases](../content/02-linear-algebra/01-vectors-spaces-bases.md) | Explicit dependency relation, or a certificate of independence |
| coordinates | [Vectors, span, independence and bases](../content/02-linear-algebra/01-vectors-spaces-bases.md) | Coordinates in a chosen basis with a degeneracy measure |
| det-by-elimination | [Determinants as signed volume](../content/02-linear-algebra/05-determinants-volume.md) | Pivot products with a swap sign ledger |
| volume-ratio | [Determinants as signed volume](../content/02-linear-algebra/05-determinants-volume.md) | Volume scaling on an arbitrary nondegenerate source cell |
| cofactor-2x2 | [Determinants as signed volume](../content/02-linear-algebra/05-determinants-volume.md) | Signed coordinate contributions and cancellation |
| power-iteration | [Eigenvalues and diagonalization](../content/02-linear-algebra/06-eigenvalues-diagonalization.md) | Residual convergence, sign flips, scale invariance, and explicit iteration limits |
| char-poly-2x2 | [Eigenvalues and diagonalization](../content/02-linear-algebra/06-eigenvalues-diagonalization.md) | Monic polynomial coefficients with checked shape and finite arithmetic |
| diagonalizable-2x2 | [Eigenvalues and diagonalization](../content/02-linear-algebra/06-eigenvalues-diagonalization.md) | Exact real eigenbasis classification for integer matrices |
| rayleigh-quotient | [Spectral theorem and quadratic forms](../content/02-linear-algebra/07-spectral-theorem-quadratic-forms.md) | Scale-safe directional quadratic value |
| cholesky | [Spectral theorem and quadratic forms](../content/02-linear-algebra/07-spectral-theorem-quadratic-forms.md) | Triangular PD certificate with a relative pivot cutoff |
| is-pd | [Spectral theorem and quadratic forms](../content/02-linear-algebra/07-spectral-theorem-quadratic-forms.md) | Separate numerical rejection from invalid input |
| svd-2x2 | [SVD and PCA](../content/02-linear-algebra/08-svd-low-rank.md) | Paired orthogonal directions with scaling and a determinant shortcut |
| truncate-rank | [SVD and PCA](../content/02-linear-algebra/08-svd-low-rank.md) | Rectangular reconstruction from a retained channel budget |
| explained-variance | [SVD and PCA](../content/02-linear-algebra/08-svd-low-rank.md) | Squared-gain fractions and undefined zero-total handling |
| matrix-norms | [Norms, conditioning, and stability](../content/02-linear-algebra/09-norms-conditioning-stability.md) | Absolute column and row norm controls across scales |
| condition-estimate | [Norms, conditioning, and stability](../content/02-linear-algebra/09-norms-conditioning-stability.md) | Forward and inverse amplification with scaled pivoted solves |
| cancellation-demo | [Norms, conditioning, and stability](../content/02-linear-algebra/09-norms-conditioning-stability.md) | Direct versus rationalized evaluation with a high-precision oracle |
| search | [DSA](../content/04-dsa/01-invariants-search-graphs-dp.md) | Exhaustive boundary cases |
| softmax | [PyTorch](../content/08-pytorch/01-tensors-autograd-training.md) | Stability and shift invariance |
| bigram | [NLP](../content/10-nlp/01-text-representations-language-models.md) | Correct target offsets |
| attention | [LLM systems](../content/11-llm-systems/01-causal-transformers-training-systems.md) | Prefix causality |
| bellman | [RL](../content/12-reinforcement-learning/01-mdps-bellman-td.md) | Known solution and stochastic expectation |

Student functions intentionally raise NotImplementedError initially. Their failing tests mean the exercise has not been implemented, not that installation failed. Passing checks supplies behavioral evidence; it does not automatically establish understanding.

The PyTorch, MLP, tokenizer, and policy-gradient projects in the lessons are implementation specifications. Full executable scaffolds for those projects are still pending.
| echelon | [Systems, elimination and the four subspaces](../content/02-linear-algebra/02-systems-elimination-subspaces.md) | Reduced row echelon form with pivot columns |
| solve-complete | [Systems, elimination and the four subspaces](../content/02-linear-algebra/02-systems-elimination-subspaces.md) | Particular solution plus a null-space basis, or inconsistency |
| lu | [Systems, elimination and the four subspaces](../content/02-linear-algebra/02-systems-elimination-subspaces.md) | LU factorization with partial pivoting |
