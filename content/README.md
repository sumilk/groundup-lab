# GroundUp Lab — theory and practice

The repository now has **46 authored lessons across 14 tracks**, with linear algebra, optimization, and probability/statistics as separate tracks. This is an initial cross-curriculum release, **not complete coverage**. Each track has substantial expansion work remaining. Depth labels are targets and have not been independently verified.

## Detailed build plans

See the [curriculum build-plan index](_plans.md) for 13 additional subject plans modeled on the [linear algebra plan](02-linear-algebra/_plan.md) and the probability/statistics lesson structure. They specify prerequisites, derivations, interactive experiments, implementation ladders, RE/RS gates, and capstones, including a new Research Practice sequence. These are authoring plans; they do not increase authored lesson counts.

## Start here

Read a lesson, write a prediction, reconstruct its derivations, implement the lab, then solve an unfamiliar variant. Use an LLM for hints and critique after an attempt. Do not infer mastery from answer length, XP, or a simple code-pattern check.

### Practice difficulty convention

Every numbered teaching section is followed by three short practice prompts:

- **Foundation** checks definitions, notation, or a direct one-step calculation.
- **Core** combines ideas in a calculation, derivation, or interpretation task.
- **Stretch** transfers the idea to an unfamiliar setting, exposes a failure mode, or asks for a small proof or experiment.

Attempt these prompts before continuing. The end-of-unit practice set then mixes the same three levels into a cumulative ladder; its labels describe the intended reasoning difficulty, not the importance of the material.

| Track | Authored lesson |
|---|---|
| 00 Foundations | [Mathematical language](00-foundations/00-mathematical-language.md) |
| 00 Foundations | [Numerical stability](00-foundations/01-numerical-stability.md) |
| 01 Python | [Objects, iteration, and streaming](01-python/01-python-memory-iteration.md) |
| 02 Linear algebra | [Vectors, span, independence and bases](02-linear-algebra/01-vectors-spaces-bases.md) |
| 02 Linear algebra | [Systems, elimination and the four fundamental subspaces](02-linear-algebra/02-systems-elimination-subspaces.md) |
| 02 Linear algebra | [Inner products, orthogonality, projection and least squares](02-linear-algebra/03-projections-least-squares.md) |
| 02 Linear algebra | [Orthonormal bases, Gram–Schmidt and QR](02-linear-algebra/04-orthonormal-bases-qr.md) |
| 02 Linear algebra | [Determinants as signed volume](02-linear-algebra/05-determinants-volume.md) |
| 02 Linear algebra | [Eigenvalues, invariant subspaces and diagonalization](02-linear-algebra/06-eigenvalues-diagonalization.md) |
| 02 Linear algebra | [Symmetric matrices, the spectral theorem and quadratic forms](02-linear-algebra/07-spectral-theorem-quadratic-forms.md) |
| 02 Linear algebra | [The SVD — geometry, rank, low-rank approximation and PCA](02-linear-algebra/08-svd-low-rank.md) |
| 03 Optimization | [Calculus, gradients, and optimization](03-optimization/01-calculus-gradients-optimization.md) |
| 03 Optimization | [Convexity, smoothness and duality](03-optimization/03-convexity-smoothness-duality.md) |
| 03 Optimization | [Stochastic approximation, SGD and batch size](03-optimization/04-stochastic-approximation-sgd.md) |
| 03 Optimization | [Nonconvex landscapes and training dynamics](03-optimization/05-nonconvex-landscapes-training-dynamics.md) |
| 03 Optimization | [Preconditioning, adaptive methods and schedules](03-optimization/06-preconditioning-adaptive-methods-schedules.md) |
| 03 Optimization | [Constrained, composite and distributed optimization](03-optimization/07-constrained-composite-distributed-optimization.md) |
| 04 DSA | [Invariants, search, graphs, and DP](04-dsa/01-invariants-search-graphs-dp.md) |
| 05 Probability and statistics | [Probability foundations from finite events](05-probability-statistics/00-probability-foundations.md) |
| 05 Probability and statistics | [Random variables, distributions, moments, and simulation](05-probability-statistics/01-random-variables-distributions.md) |
| 05 Probability and statistics | [Joint distributions, conditioning, and covariance](05-probability-statistics/02-joint-distributions-conditioning-covariance.md) |
| 05 Probability and statistics | [Transformations, convolution, and Jacobians](05-probability-statistics/03-transformations-convolution-jacobians.md) |
| 05 Probability and statistics | [Multivariate Gaussian geometry and conditioning](05-probability-statistics/04-multivariate-gaussian-geometry.md) |
| 05 Probability and statistics | [Repeated samples, limit theorems, and Monte Carlo error](05-probability-statistics/05-limit-theorems-monte-carlo.md) |
| 05 Probability and statistics | [Estimation, likelihood, Fisher information, and asymptotics](05-probability-statistics/06-estimation-likelihood-fisher.md) |
| 05 Probability and statistics | [Hypothesis testing, confidence intervals, power, and multiple comparisons](05-probability-statistics/07-hypothesis-testing-confidence-power.md) |
| 05 Probability and statistics | [Bootstrap, permutation tests, sequential inference, and experimental design](05-probability-statistics/08-resampling-sequential-experimental-design.md) |
| 05 Probability and statistics | [Bayesian modeling, posterior prediction, importance sampling, and MCMC](05-probability-statistics/09-bayesian-modeling-computation.md) |
| 05 Probability and statistics | [Sampling design, dataset construction, and rigorous ML evaluation](05-probability-statistics/10-sampling-design-ml-evaluation.md) |
| 05 Probability and statistics | [Exponential families, statistical regression, GLMs, and partial pooling](05-probability-statistics/11-exponential-families-regression-glms.md) |
| 05 Probability and statistics | [High-dimensional probability, random vectors, and projections](05-probability-statistics/12-high-dimensional-probability.md) |
| 05 Probability and statistics | [Calibration, proper scoring rules, and conformal prediction](05-probability-statistics/13-calibration-scoring-conformal.md) |
| 05 Probability and statistics | [Latent variables, the ELBO, and gradient estimators](05-probability-statistics/14-latent-variables-elbo-gradient-estimators.md) |
| 05 Probability and statistics | [Score matching, diffusion, and sampling from generative models](05-probability-statistics/15-score-matching-diffusion-sampling.md) |
| 05 Probability and statistics | [Observational causal inference, quasi-experiments, and missing data](05-probability-statistics/16-causal-inference-missing-data.md) |
| 05 Probability and statistics | [Mixtures, the EM algorithm, and graphical models](05-probability-statistics/17-mixtures-em-graphical-models.md) |
| 05 Probability and statistics | [Order statistics, empirical processes, rank tests, and density estimation](05-probability-statistics/18-order-statistics-empirical-processes-nonparametrics.md) |
| 06 Information, learning, and decisions | [Entropy, generalization, and decisions](06-information-learning-decision/01-entropy-generalization-decisions.md) |
| 07 Classical ML | [Regression, classification, evaluation](07-classical-ml/01-regression-classification-evaluation.md) |
| 08 PyTorch | [Tensors, autograd, training](08-pytorch/01-tensors-autograd-training.md) |
| 09 Deep learning | [Backprop, initialization, regularization](09-deep-learning/01-backprop-initialization-regularization.md) |
| 10 NLP | [Text representations and language models](10-nlp/01-text-representations-language-models.md) |
| 11 LLM systems | [Causal transformers and systems](11-llm-systems/01-causal-transformers-training-systems.md) |
| 12 Reinforcement learning | [MDPs, Bellman equations, TD](12-reinforcement-learning/01-mdps-bellman-td.md) |
| 12 Reinforcement learning | [Policy gradients and actor–critic](12-reinforcement-learning/02-policy-gradients-actor-critic.md) |
| 13 Practical AI systems | [Retrieval, tools, evaluation, deployment](13-agentic-systems/01-retrieval-tools-evaluation.md) |

## Progression

Study Python and mathematical language first. Move through linear algebra, then the optimization track, alongside DSA. Continue through probability/statistics, information/learning/decision theory, and classical ML. Then study PyTorch, manual backprop, NLP, and transformers. Start tabular RL after probability and DP; policy gradients follow backprop and MDPs. Practical systems can run alongside the later implementation tracks.

### Probability and statistics build order

The track is being expanded one unit at a time in this order:

1. **Authored:** finite sample spaces, probability axioms, conditioning, Bayes, and independence.
2. **Optional authored overview:** inference, estimation, and uncertainty; skim for orientation, then return after the detailed units.
3. **Authored:** random variables, common distributions, moments, and simulation.
4. **Authored:** joint distributions, conditioning, covariance, total expectation, and total variance.
5. **Authored:** transformations, convolution, and one- and multi-dimensional Jacobians.
6. **Authored:** multivariate Gaussian geometry, affine maps, marginals, and conditioning.
7. **Authored:** laws of large numbers, central limit behavior, Monte Carlo error, concentration, heavy tails, and dependence.
8. **Authored:** estimation, bias/variance/MSE, likelihood, identifiability, Fisher information, and asymptotics.
9. **Authored:** hypothesis testing, confidence intervals, power, effect sizes, likelihood-ratio tests, and multiple comparisons.
10. **Authored:** bootstrap, permutation tests, sequential testing, and experimental design.
11. **Authored:** Bayesian modeling, posterior checks, importance sampling, and MCMC.
12. **Authored:** sampling design and ML evaluation under seed variance, clustering, dependence, selection, contamination, and distribution shift.
13. **Authored:** sufficient statistics, exponential families, statistical regression, GLMs, robust uncertainty, and mixed-effects partial pooling.
14. **Authored:** high-dimensional probability, concentration in many dimensions, random vectors, and projections.
15. **Authored:** calibration, proper scoring rules, reliability diagrams, and conformal prediction.
16. **Authored:** latent variables, the evidence lower bound, and gradient estimators.
17. **Authored:** score matching, diffusion, and sampling from generative models.
18. **Authored:** observational causal inference — DAGs and d-separation, backdoor adjustment, propensity weighting, doubly robust estimation, instruments, difference-in-differences — and missing-data mechanisms with multiple imputation.
19. **Authored:** finite mixtures, the EM algorithm, identifiability of latent structure, and directed, undirected, and factor graphical models with exact inference.
20. **Authored:** order statistics, empirical process theory with Glivenko–Cantelli and DKW, rank and permutation tests, U-statistics, kernel density estimation, and Rao–Blackwellized Monte Carlo.

## Hands-on resources

- [Sixty-seven runnable exercises and behavioral checks](../labs/README.md)
- [Learner implementation file](../labs/exercises.py)
- [Reference solutions — attempt first](../labs/reference.py)
- [Web reader source](../public/theory/index.html)
- [Deployment and pipeline status](../docs/DEPLOYMENT.md)

## Coverage status

**Authored** means explanatory content, equations, examples, exercises, and solution sketches exist. It does not mean every topic is exhausted or externally reviewed. Each new lesson ends with its pending expansions. Full projects, complete proof sequences, and advanced modules remain in progress. Python/NumPy conceptual examples and CPU labs are the initial implementation layer; large-scale training and custom kernels are not yet implemented here.
