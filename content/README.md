# GroundUp Lab — theory and practice

The repository now has **25 authored lessons across 14 tracks**, with linear algebra and optimization as separate tracks. This is an initial cross-curriculum release, **not complete textbook-equivalent coverage**. Each track has substantial expansion work remaining. The original depth labels were targets, not independently verified equivalence to Aggarwal, PRML, MacKay, UDL, or Shalev-Shwartz.

## Start here

Read a lesson, write a prediction, reconstruct its derivations, implement the lab, then solve an unfamiliar variant. Use an LLM for hints and critique after an attempt. Do not infer mastery from answer length, XP, or a simple code-pattern check.

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
| 05 Probability and statistics | [Inference and uncertainty](05-probability-statistics/01-inference-estimation-uncertainty.md) |
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

## Hands-on resources

- [Six runnable exercises and behavioral checks](../labs/README.md)
- [Learner implementation file](../labs/exercises.py)
- [Reference solutions — attempt first](../labs/reference.py)
- [Web reader source](../public/theory/index.html)
- [Deployment and pipeline status](../docs/DEPLOYMENT.md)

## Coverage status

**Authored** means explanatory content, equations, examples, exercises, and solution sketches exist. It does not mean every topic is exhausted or externally reviewed. Each new lesson ends with its pending expansions. Full course projects, complete proof sequences, and advanced modules remain in progress. Python/NumPy conceptual examples and CPU labs are the initial implementation layer; CS336-scale training and kernels are not yet implemented here.

## Depth references

Use Aggarwal for linear algebra/optimization and probability/statistics, MacKay for inference/information theory, PRML for probabilistic ML, Shalev-Shwartz and Ben-David for learning theory, and Simon Prince's Understanding Deep Learning for neural-network theory. Karpathy and CS336 anchor the implementation progression. Lessons are original explanations, not textbook reproductions.
