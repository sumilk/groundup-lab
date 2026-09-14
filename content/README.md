# GroundUp Lab — theory and practice

The repository now has **20 authored lessons across 13 tracks**, including the original seven mathematics/foundations lessons and thirteen additions. This is an initial cross-curriculum release, **not complete textbook-equivalent coverage**. Each track has substantial expansion work remaining. The original depth labels were targets, not independently verified equivalence to Aggarwal, PRML, MacKay, UDL, or Shalev-Shwartz.

## Start here

Read a lesson, write a prediction, reconstruct its derivations, implement the lab, then solve an unfamiliar variant. Use an LLM for hints and critique after an attempt. Do not infer mastery from answer length, XP, or a simple code-pattern check.

| Track | Authored lesson |
|---|---|
| 00 Foundations | [Mathematical language](00-foundations/00-mathematical-language.md) |
| 00 Foundations | [Numerical stability](00-foundations/01-numerical-stability.md) |
| 01 Python | [Objects, iteration, and streaming](01-python/01-python-memory-iteration.md) |
| 02 Mathematics | [Vector spaces and bases](02-mathematics/01-vectors-spaces-bases.md) |
| 02 Mathematics | [Linear maps and rank](02-mathematics/02-linear-maps-rank.md) |
| 02 Mathematics | [Projections and least squares](02-mathematics/03-projections-least-squares.md) |
| 02 Mathematics | [Eigenvalues and invariant subspaces](02-mathematics/04-eigenvalues-invariant-subspaces.md) |
| 02 Mathematics | [SVD and PCA](02-mathematics/05-svd-pca.md) |
| 02 Mathematics | [Calculus and optimization](02-mathematics/06-calculus-gradients-optimization.md) |
| 03 DSA | [Invariants, search, graphs, and DP](03-dsa/01-invariants-search-graphs-dp.md) |
| 04 Probability and statistics | [Inference and uncertainty](04-probability-statistics/01-inference-estimation-uncertainty.md) |
| 05 Information, learning, and decisions | [Entropy, generalization, and decisions](05-information-learning-decision/01-entropy-generalization-decisions.md) |
| 06 Classical ML | [Regression, classification, evaluation](06-classical-ml/01-regression-classification-evaluation.md) |
| 07 PyTorch | [Tensors, autograd, training](07-pytorch/01-tensors-autograd-training.md) |
| 08 Deep learning | [Backprop, initialization, regularization](08-deep-learning/01-backprop-initialization-regularization.md) |
| 09 NLP | [Text representations and language models](09-nlp/01-text-representations-language-models.md) |
| 10 LLM systems | [Causal transformers and systems](10-llm-systems/01-causal-transformers-training-systems.md) |
| 11 Reinforcement learning | [MDPs, Bellman equations, TD](11-reinforcement-learning/01-mdps-bellman-td.md) |
| 11 Reinforcement learning | [Policy gradients and actor–critic](11-reinforcement-learning/02-policy-gradients-actor-critic.md) |
| 12 Practical AI systems | [Retrieval, tools, evaluation, deployment](12-agentic-systems/01-retrieval-tools-evaluation.md) |

## Progression

Study Python and mathematical language first. Move through linear algebra and calculus, alongside DSA. Continue through probability/statistics, information/learning/decision theory, and classical ML. Then study PyTorch, manual backprop, NLP, and transformers. Start tabular RL after probability and DP; policy gradients follow backprop and MDPs. Practical systems can run alongside the later implementation tracks.

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
