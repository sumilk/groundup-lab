# Hands-on labs

Use Python 3.11 or later. These 86 exercises need only the standard library; no GPU, API key, package installation, or paid dataset is required.

In the theory reader, select the linked exercise inside a lesson to open its runnable Python workspace on the right without losing your reading position. If a lesson gains multiple coding exercises, task tabs share that workspace. The implementation and most recent output are saved in that browser for each task. **Run tests** executes the behavioral check, **Run code** supports print-based exploration, **Stop** terminates a stuck worker, and **Reset starter** restores the authored skeleton. The command-line workflow below remains available.

1. Read the linked lesson and make a prediction.
2. Implement one function from a blank definition in its topic's exercises.py (see the layout below).
3. Run its check, for example: **python -m labs.checks softmax**.
4. Explain a failed case before editing.
5. After an attempt, inspect the topic's reference.py and compare reasoning.
6. Run **python -m labs.checks --reference** to verify the reference suite.

| Task argument | Lesson | Evidence |
|---|---|---|
| moments | [Python](../content/01-python/01-python-memory-iteration.md) | Stable one-pass statistics |
| span | [Vectors, span, independence and bases](../content/02-linear-algebra/01-vectors-spaces-bases.md) | Elimination decides membership in a span and returns coefficients |
| dependence | [Vectors, span, independence and bases](../content/02-linear-algebra/01-vectors-spaces-bases.md) | Explicit dependency relation, or a certificate of independence |
| coordinates | [Vectors, span, independence and bases](../content/02-linear-algebra/01-vectors-spaces-bases.md) | Coordinates in a chosen basis with a degeneracy measure |
| echelon | [Systems, elimination and the four subspaces](../content/02-linear-algebra/02-systems-elimination-subspaces.md) | Reduced row echelon form with pivot columns |
| solve-complete | [Systems, elimination and the four subspaces](../content/02-linear-algebra/02-systems-elimination-subspaces.md) | Particular solution plus a null-space basis, or inconsistency |
| lu | [Systems, elimination and the four subspaces](../content/02-linear-algebra/02-systems-elimination-subspaces.md) | LU factorization with partial pivoting |
| project-onto | [Projection and least squares](../content/02-linear-algebra/03-projections-least-squares.md) | Projection matrix, projected vector, and residual from a column basis |
| normal-equations | [Projection and least squares](../content/02-linear-algebra/03-projections-least-squares.md) | Full-column-rank least squares by Gram construction and elimination |
| gram-metric | [Projection and least squares](../content/02-linear-algebra/03-projections-least-squares.md) | Validate positive definiteness and compute a metric inner product |
| gram-schmidt | [Orthonormal bases and QR](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Classical and modified factorizations with distinct arithmetic schedules |
| qr-solve | [Orthonormal bases and QR](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Reorthogonalization, accumulated R corrections, and triangular least squares |
| orthogonality-defect | [Orthonormal bases and QR](../content/02-linear-algebra/04-orthonormal-bases-qr.md) | Off-diagonal overlap without confusing it with normalization |
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
| pinv-via-svd | [Pseudoinverse and regularization](../content/02-linear-algebra/10-pseudoinverse-regularization.md) | Moore–Penrose identities on the truncation, with a singular value equal to tol discarded |
| ridge-solve | [Pseudoinverse and regularization](../content/02-linear-algebra/10-pseudoinverse-regularization.md) | Normal-equations oracle, a norm that never grows with λ, and underflow-safe gains |
| min-norm-solution | [Pseudoinverse and regularization](../content/02-linear-algebra/10-pseudoinverse-regularization.md) | Truncated A⁺b with the kept rank and a residual measured against the full matrix |
| search | [DSA](../content/04-dsa/01-invariants-search-graphs-dp.md) | Exhaustive boundary cases |
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
| softmax | [PyTorch](../content/08-pytorch/01-tensors-autograd-training.md) | Stability and shift invariance |
| threshold-gate | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | Exact firing at the z = 0 boundary, with fsum against cancelling terms |
| compose-halfspaces | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | AND, OR and k-of-n votes over half-space units |
| hebbian-update | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | Oja settles on the top eigenvector while plain Hebb grows, and overflow is reported |
| perceptron-train | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | The lesson's OR trace, convergence on separable tables, and reported XOR non-convergence |
| dnf-network | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | One hidden unit per true row, checked on every input of random truth tables |
| staircase-weights | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | Shared-edge coefficients that reproduce the pulse sum on both sides of every edge |
| heat-cold | [Connectionism and the threshold unit](../content/09-deep-learning-core/01-connectionism-threshold-unit.md) | The brief-touch illusion and randomized agreement with the timing specification |
| prime-implicants | [What a network can represent](../content/09-deep-learning-core/02-network-expressivity.md) | Sorted prime implicants against brute force, covering every true row |
| parity-network | [What a network can represent](../content/09-deep-learning-core/02-network-expressivity.md) | Parity on every input for four constructions, with their unit and connection counts |
| network-stats | [What a network can represent](../content/09-deep-learning-core/02-network-expressivity.md) | Units, connections, depth, layering and dense size on the lesson's networks |
| polygon-indicator | [What a network can represent](../content/09-deep-learning-core/02-network-expressivity.md) | An edge-AND network that matches the closed convex polygon on a grid |
| irreducible-error | [What a network can represent](../content/09-deep-learning-core/02-network-expressivity.md) | Minimal misclassified weight per code, never raised by refining the codes |
| relu-interpolant | [What a network can represent](../content/09-deep-learning-core/02-network-expressivity.md) | Exact ReLU interpolation through the knots from slope changes |
| bigram | [NLP](../content/11-nlp/01-text-representations-language-models.md) | Correct target offsets |
| attention | [LLM systems](../content/12-llm-systems/01-causal-transformers-training-systems.md) | Prefix causality |
| bellman | [RL](../content/13-reinforcement-learning/01-mdps-bellman-td.md) | Known solution and stochastic expectation |

## Where the code lives

Each course part has a package under labs/ holding its starters (exercises.py), reference implementations (reference.py), and behavioral checks (checks.py). The top-level labs/exercises.py and labs/reference.py only gather the topic modules, so **python -m labs.checks** still tests every task. Write your implementations in the topic modules, not in labs/exercises.py itself: code placed above its imports is overwritten by the starters. Each topic module is separate, so to reuse one of your implementations from another topic, import it, for example from labs.probability\_inference.exercises import horvitz\_thompson.

| Package | Lessons |
|---|---|
| programming | Python (01), DSA (04) |
| linalg_structure | Linear algebra Part I: LA01–LA02 |
| linalg_geometry | Linear algebra Part II: LA03–LA07 |
| linalg_decomposition | Linear algebra Part III: LA08–LA10 |
| probability_models | Probability and statistics Part I: PS00–PS04 |
| probability_inference | Probability and statistics Part II: PS05–PS11 |
| probability_modern_tools | Probability and statistics Part III: PS12–PS18 |
| deep_learning_core | Deep learning core: NN01–NN02 |
| ml_systems | PyTorch (08), NLP (11), LLM systems (12), RL (13) |

## Adding a lab

labs/registry.json is the one list of labs the code reads. **python -m labs.checks** builds its CHECKS from it, and scripts/build-theory.mjs builds the browser labs from the same entries, so the CLI and the browser cannot drift apart. The task table above is documentation for readers; update it by hand (step 4).

1. In the matching topic package, write the starter in exercises.py, the solution (same name) in reference.py, and the check in checks.py. A check is a public function taking a single argument m, the module under test. Put shared assertion helpers in labs/check_helpers.py.
2. Add one entry to labs/registry.json:

   | Field | Meaning |
   |---|---|
   | task | Name for python -m labs.checks and the browser tab, e.g. solve-complete |
   | lesson | Lesson path under content/ |
   | title | Browser tab title |
   | function | Starter in exercises.py; the reference uses the same name |
   | check | Check function in checks.py |
   | supportFunctions | Optional: reference functions preloaded for browser learners |

   Entry order is the order in which the full suite runs. Within a lesson, it is also the order of the lesson's exercise links.
3. Link the exercise from the lesson as `[text](../../labs/exercises.py)`. The reader opens the lesson's n-th registry entry from its n-th link.
4. Add a row for the task to the table above, under its lesson, and update the exercise count at the top of this README and in the top-level README.
5. Run python -m labs.checks --reference your-task, then node scripts/build-theory.mjs, node scripts/check-theory.mjs and python scripts/check_browser_labs.py.

Mistakes are reported, not skipped. Both the CLI and the build reject a malformed registry: duplicate task, function or check names, missing or unknown fields, or invalid JSON. They list every problem found. The CLI also rejects an entry whose check does not exist, and a check with no entry. The build additionally requires each entry's lesson, starter, reference and support functions to exist. It also rejects a starter that has a same-named reference solution but no entry, which catches a missing entry even before the lab's check is written.

Other functions in exercises.py, such as helpers learners write for themselves, are not labs and need no entry. Both the build and **python -m labs.checks** take each starter from the exercises.py in the same topic as its reference solution, whatever order the topics are imported in. A learner helper that reuses a starter's name in another topic never replaces the starter. A starter missing from its own topic is reported by the build, and its check fails in the CLI. scripts/check\_lab\_registry.py runs these cases against the real build and CLI. It also follows the steps above end to end in a scratch copy: a sample running-totals lab with a chain of private reference helpers goes through the CLI, the reader checks, the reference harness and the browser runner. A learner's own implementation must pass in the runner, which, unlike the reference harness, never receives the private helpers. The sample goes after whatever labs the lesson already has, and the script stops with a clear message if a real lab ever takes one of the sample names.

A new topic package is a directory under labs/ with an \_\_init\_\_.py and all three modules. Its name must be a Python identifier that no module in labs/ already uses, e.g. optimization, not 03-optimization or reference. Add a line for it to labs/exercises.py and labs/reference.py. The CLI and the build find topic packages themselves, and both report a misnamed or incomplete one.

Student functions intentionally raise NotImplementedError initially. Their failing tests mean the exercise has not been implemented, not that installation failed. Passing checks supplies behavioral evidence; it does not automatically establish understanding.

The PyTorch, MLP, tokenizer, and policy-gradient projects in the lessons are implementation specifications. Full executable scaffolds for those projects are still pending.
