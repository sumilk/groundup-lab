# GroundUp Lab — theory and practice

The repository now has **47 authored lesson pages across 14 tracks**, including 10 retained introductory overviews, with linear algebra, optimization, and probability/statistics as separate tracks. This is an initial cross-curriculum release, **not complete coverage**. Each track has substantial expansion work remaining. Depth labels are targets and have not been independently verified.

## Detailed build plans

See the [curriculum build-plan index](_plans.md) for all 16 subject plans in a shared detailed format, including the updated [linear algebra plan](02-linear-algebra/_plan.md) and the [probability/statistics coverage and expansion plan](05-probability-statistics/_plan.md). They specify prerequisites, derivations, interactive experiments, implementation ladders, RE/RS gates, and capstones, including a new Research Practice sequence. These are authoring plans; they do not increase authored lesson counts.

The existing LA and probability lessons have also received a correctness and practice update. All 19 probability lessons now include static hints, a prediction/reveal experiment, an offline answer bank, and six-part checkpoints. LA01–LA08 include targeted numerical/research audits. LA09 now develops norms, perturbation bounds, backward error, and stability with two interactive figures and three additional Python tasks. These additions preserve the existing lesson IDs and Python tasks; broader experiments, additional implementation ladders and new advanced lessons in the plans remain future work.

See the [legacy-page audit](_legacy-audit.md) for retention and retirement decisions. Classical ML currently has a [reading route through authored material and a detailed build plan](07-classical-ml/_plan.md#current-reading-route-and-preserved-implementation-work), rather than a duplicate overview lesson. Research Practice also remains plan-only. The 10 retained overviews are useful entry bridges, not completion of their proposed detailed modules.

## Start here

Read a lesson, write a prediction, reconstruct its derivations, implement the lab, then solve an unfamiliar variant. Use an LLM for hints and critique after an attempt. Do not infer mastery from answer length, XP, or a simple code-pattern check.

### Practice difficulty convention

The shared format, implemented across LA and probability/statistics, uses three short practice prompts after numbered teaching sections. Retained legacy pages still need their planned format expansion:

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
| 02 Linear algebra | [Norms, conditioning, and numerical stability](02-linear-algebra/09-norms-conditioning-stability.md) |
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
| 08 PyTorch | [Tensors, autograd, training](08-pytorch/01-tensors-autograd-training.md) |
| 09 Deep learning core | [Connectionism and the threshold unit](09-deep-learning-core/01-connectionism-threshold-unit.md) |
| 09 Deep learning core | [What a network can represent](09-deep-learning-core/02-network-expressivity.md) |
| 10 Deep learning advanced | [Backprop, initialization, regularization](10-deep-learning-advanced/01-backprop-initialization-regularization.md) |
| 11 NLP | [Text representations and language models](11-nlp/01-text-representations-language-models.md) |
| 12 LLM systems | [Causal transformers and systems](12-llm-systems/01-causal-transformers-training-systems.md) |
| 13 Reinforcement learning | [MDPs, Bellman equations, TD](13-reinforcement-learning/01-mdps-bellman-td.md) |
| 13 Reinforcement learning | [Policy gradients and actor–critic](13-reinforcement-learning/02-policy-gradients-actor-critic.md) |
| 14 Practical AI systems | [Retrieval, tools, evaluation, deployment](14-agentic-systems/01-retrieval-tools-evaluation.md) |

## Progression

Study Python and mathematical language first. Move through linear algebra, then the optimization track, alongside DSA. Continue through probability/statistics, information/learning/decision theory, and classical ML. Then study PyTorch, manual backprop, NLP, and transformers. Start tabular RL after probability and DP; policy gradients follow backprop and MDPs. Practical systems can run alongside the later implementation tracks.

### Probability and statistics build order

The 19 numbered lessons below are authored. See the [probability/statistics plan](05-probability-statistics/_plan.md) for the coverage audit, existing-lesson improvements, explicit prerequisites, and 11 proposed additions (PS19–PS29). The list records current coverage; it does not imply every topic is complete.

1. **Authored:** finite sample spaces, probability axioms, conditioning, Bayes, and independence.
2. **Authored:** random variables, common distributions, moments, and simulation.
3. **Authored:** joint distributions, conditioning, covariance, total expectation, and total variance.
4. **Authored:** transformations, convolution, and one- and multi-dimensional Jacobians.
5. **Authored:** multivariate Gaussian geometry, affine maps, marginals, and conditioning.
6. **Authored:** laws of large numbers, central limit behavior, Monte Carlo error, concentration, heavy tails, and dependence.
7. **Authored:** estimation, bias/variance/MSE, likelihood, identifiability, Fisher information, and asymptotics.
8. **Authored:** hypothesis testing, confidence intervals, power, effect sizes, likelihood-ratio tests, and multiple comparisons.
9. **Authored:** bootstrap, permutation tests, sequential testing, and experimental design.
10. **Authored:** Bayesian modeling, posterior checks, importance sampling, and MCMC.
11. **Authored:** sampling design and ML evaluation under seed variance, clustering, dependence, selection, contamination, and distribution shift.
12. **Authored:** sufficient statistics, exponential families, statistical regression, GLMs, robust uncertainty, and mixed-effects partial pooling.
13. **Authored:** high-dimensional probability, concentration in many dimensions, random vectors, and projections.
14. **Authored:** calibration, proper scoring rules, reliability diagrams, and conformal prediction.
15. **Authored:** latent variables, the evidence lower bound, and gradient estimators.
16. **Authored:** score matching, diffusion, and sampling from generative models.
17. **Authored:** observational causal inference — DAGs and d-separation, backdoor adjustment, propensity weighting, doubly robust estimation, instruments, difference-in-differences — and missing-data mechanisms with multiple imputation.
18. **Authored:** finite mixtures, the EM algorithm, identifiability of latent structure, and directed, undirected, and factor graphical models with exact inference.
19. **Authored:** order statistics, empirical process theory with Glivenko–Cantelli and DKW, rank and permutation tests, U-statistics, kernel density estimation, and Rao–Blackwellized Monte Carlo.

**Planned additions:** stochastic processes/Markov chains, time series, Poisson/renewal/queueing processes, martingales, measure-based probability, stochastic calculus, advanced Monte Carlo, robust/semiparametric inference, adaptive evaluation, survival/rare events, and a research capstone. These are planned units, not new authored lessons.

## Hands-on resources

- [Seventy runnable exercises and behavioral checks](../labs/README.md)
- [Learner implementation file](../labs/exercises.py)
- [Reference solutions — attempt first](../labs/reference.py)
- [Web reader source](../public/theory/index.html)
- [Deployment and pipeline status](../docs/DEPLOYMENT.md)

## Coverage status

**Authored** means explanatory content, equations, examples, exercises, and solution sketches exist. It does not mean every topic is exhausted or externally reviewed. Each new lesson ends with its pending expansions. Full projects, complete proof sequences, and advanced modules remain in progress. Python/NumPy conceptual examples and CPU labs are the initial implementation layer; large-scale training and custom kernels are not yet implemented here.
