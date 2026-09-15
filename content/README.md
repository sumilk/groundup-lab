# GroundUp Lab — theory and practice

The repository now has **31 authored lessons across 14 tracks**, with linear algebra and optimization as separate tracks. This is an initial cross-curriculum release, **not complete coverage**. Each track has substantial expansion work remaining. Depth labels are targets and have not been independently verified.

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
| 02 Linear algebra | [Vector spaces and bases](02-linear-algebra/01-vectors-spaces-bases.md) |
| 02 Linear algebra | [Linear maps and rank](02-linear-algebra/02-linear-maps-rank.md) |
| 02 Linear algebra | [Projections and least squares](02-linear-algebra/03-projections-least-squares.md) |
| 02 Linear algebra | [Eigenvalues and invariant subspaces](02-linear-algebra/04-eigenvalues-invariant-subspaces.md) |
| 02 Linear algebra | [SVD and PCA](02-linear-algebra/05-svd-pca.md) |
| 03 Optimization | [Calculus, gradients, and optimization](03-optimization/01-calculus-gradients-optimization.md) |
| 03 Optimization | [Convexity, smoothness and duality](03-optimization/03-convexity-smoothness-duality.md) |
| 03 Optimization | [Stochastic approximation, SGD and batch size](03-optimization/04-stochastic-approximation-sgd.md) |
| 03 Optimization | [Nonconvex landscapes and training dynamics](03-optimization/05-nonconvex-landscapes-training-dynamics.md) |
| 03 Optimization | [Preconditioning, adaptive methods and schedules](03-optimization/06-preconditioning-adaptive-methods-schedules.md) |
| 03 Optimization | [Constrained, composite and distributed optimization](03-optimization/07-constrained-composite-distributed-optimization.md) |
| 04 DSA | [Invariants, search, graphs, and DP](04-dsa/01-invariants-search-graphs-dp.md) |
| 05 Probability and statistics | [Probability foundations from finite events](05-probability-statistics/00-probability-foundations.md) |
| 05 Probability and statistics | [Optional inference and uncertainty overview](05-probability-statistics/01-inference-estimation-uncertainty.md) |
| 05 Probability and statistics | [Random variables, distributions, moments, and simulation](05-probability-statistics/02-random-variables-distributions.md) |
| 05 Probability and statistics | [Joint distributions, conditioning, and covariance](05-probability-statistics/03-joint-distributions-conditioning-covariance.md) |
| 05 Probability and statistics | [Transformations, convolution, and Jacobians](05-probability-statistics/04-transformations-convolution-jacobians.md) |
| 05 Probability and statistics | [Multivariate Gaussian geometry and conditioning](05-probability-statistics/05-multivariate-gaussian-geometry.md) |
| 05 Probability and statistics | [Repeated samples, limit theorems, and Monte Carlo error](05-probability-statistics/06-limit-theorems-monte-carlo.md) |
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
8. **Planned:** estimation, bias/variance/MSE, likelihood, Fisher information, and asymptotics.
9. **Planned core unit:** hypothesis testing, confidence intervals, power, effect sizes, likelihood-ratio tests, and multiple comparisons.
10. **Planned:** bootstrap, permutation tests, sequential testing, and experimental design.
11. **Planned:** Bayesian modelling, posterior checks, importance sampling, and MCMC.
12. **Planned:** ML evaluation under seed variance, clustering, dependence, selection, contamination, and distribution shift.

## Hands-on resources

- [Twelve runnable exercises and behavioral checks](../labs/README.md)
- [Learner implementation file](../labs/exercises.py)
- [Reference solutions — attempt first](../labs/reference.py)
- [Web reader source](../public/theory/index.html)
- [Deployment and pipeline status](../docs/DEPLOYMENT.md)

## Coverage status

**Authored** means explanatory content, equations, examples, exercises, and solution sketches exist. It does not mean every topic is exhausted or externally reviewed. Each new lesson ends with its pending expansions. Full projects, complete proof sequences, and advanced modules remain in progress. Python/NumPy conceptual examples and CPU labs are the initial implementation layer; large-scale training and custom kernels are not yet implemented here.
