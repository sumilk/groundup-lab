# GroundUp Lab

Progressive AI study for Sumil: Python, DSA, linear algebra, optimization, probability/statistics, information/learning/decision theory, ML, PyTorch, deep learning, NLP, LLM systems, RL, and practical AI systems.

**[Open the theory index](content/README.md)** · **[Run the labs](labs/README.md)** · **[Deployment guide](docs/DEPLOYMENT.md)**

| Track | Start studying |
|---|---|
| 00 Foundations | [Mathematical language](content/00-foundations/00-mathematical-language.md) |
| 01 Python | [Objects, iteration, and streaming](content/01-python/01-python-memory-iteration.md) |
| 02 Linear algebra | [Vector spaces and bases](content/02-linear-algebra/01-vectors-spaces-bases.md) |
| 03 Optimization | [Calculus, gradients, and optimization](content/03-optimization/01-calculus-gradients-optimization.md) |
| 04 DSA | [Invariants, search, graphs, and DP](content/04-dsa/01-invariants-search-graphs-dp.md) |
| 05 Probability and statistics | [Probability foundations](content/05-probability-statistics/00-probability-foundations.md) |
| 06 Information, learning, and decisions | [Entropy, generalization, and decisions](content/06-information-learning-decision/01-entropy-generalization-decisions.md) |
| 07 Classical ML | [Regression, classification, evaluation](content/07-classical-ml/01-regression-classification-evaluation.md) |
| 08 PyTorch | [Tensors, autograd, training](content/08-pytorch/01-tensors-autograd-training.md) |
| 09 Deep learning | [Backprop, initialization, regularization](content/09-deep-learning/01-backprop-initialization-regularization.md) |
| 10 NLP | [Text representations and language models](content/10-nlp/01-text-representations-language-models.md) |
| 11 LLM systems | [Causal transformers and systems](content/11-llm-systems/01-causal-transformers-training-systems.md) |
| 12 Reinforcement learning | [MDPs, Bellman equations, TD](content/12-reinforcement-learning/01-mdps-bellman-td.md) |
| 13 Practical AI systems | [Retrieval, tools, evaluation, deployment](content/13-agentic-systems/01-retrieval-tools-evaluation.md) |

## What exists

35 authored lessons, twenty-one CPU exercises with in-browser Python editors, separate reference implementations and behavioral checks, mathematical SVGs/Mermaid diagrams, and a browser theory reader. Exercise code and the latest output are saved locally per lab and can be reset to the current starter.

## Website

The existing private tutor is at https://groundup-lab.sumil.chatgpt.site. The reader is added in this repository at public/theory/index.html, with a home-page link. **This commit does not prove it has been deployed to that existing URL.** See the deployment guide for the current blocker and the automatic-deployment option.

## Local use

Run **node scripts/build-theory.mjs**, then **python -m http.server 8000 --directory public**. Open http://localhost:8000/theory/index.html. Lessons with a CPU exercise open a runnable Python workspace beside the lesson on wide screens and in a right drawer on smaller screens. Multiple exercises in one lesson are presented as task tabs. Run **python -m labs.checks --reference** for command-line reference validation. The reader uses public CDN libraries for Markdown, equations, diagrams, and its browser Python runtime; lesson and lab definitions come from this repository's generated catalogs.

For the full tutor app, use **pnpm run install:ci** then **pnpm build**. Its model default is gpt-6-astra; live tutoring requires a server-side API key. Browser reading and CPU exercises do not require it.

## Honest progress

Reading completion and saved notes are local browser conveniences, not assessed mastery. The existing tutor's heuristic evidence scores also do not establish mastery. A passing behavioral test is one kind of evidence; explain the derivation and solve a transfer problem as well.
