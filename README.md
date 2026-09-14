# GroundUp Lab

Progressive AI study for Sumil: Python, DSA, mathematics, probability/statistics, information/learning/decision theory, ML, PyTorch, deep learning, NLP, LLM systems, RL, and practical AI systems.

**[Open the theory index](content/README.md)** · **[Run the labs](labs/README.md)** · **[Deployment guide](docs/DEPLOYMENT.md)**

| Track | Start studying |
|---|---|
| 00 Foundations | [Mathematical language](content/00-foundations/00-mathematical-language.md) |
| 01 Python | [Objects, iteration, and streaming](content/01-python/01-python-memory-iteration.md) |
| 02 Mathematics | [Vector spaces and bases](content/02-mathematics/01-vectors-spaces-bases.md) |
| 03 DSA | [Invariants, search, graphs, and DP](content/03-dsa/01-invariants-search-graphs-dp.md) |
| 04 Probability and statistics | [Inference and uncertainty](content/04-probability-statistics/01-inference-estimation-uncertainty.md) |
| 05 Information, learning, and decisions | [Entropy, generalization, and decisions](content/05-information-learning-decision/01-entropy-generalization-decisions.md) |
| 06 Classical ML | [Regression, classification, evaluation](content/06-classical-ml/01-regression-classification-evaluation.md) |
| 07 PyTorch | [Tensors, autograd, training](content/07-pytorch/01-tensors-autograd-training.md) |
| 08 Deep learning | [Backprop, initialization, regularization](content/08-deep-learning/01-backprop-initialization-regularization.md) |
| 09 NLP | [Text representations and language models](content/09-nlp/01-text-representations-language-models.md) |
| 10 LLM systems | [Causal transformers and systems](content/10-llm-systems/01-causal-transformers-training-systems.md) |
| 11 Reinforcement learning | [MDPs, Bellman equations, TD](content/11-reinforcement-learning/01-mdps-bellman-td.md) |
| 12 Practical AI systems | [Retrieval, tools, evaluation, deployment](content/12-agentic-systems/01-retrieval-tools-evaluation.md) |

## What exists

20 authored lessons, six CPU exercises with separate reference implementations and behavioral checks, mathematical SVGs/Mermaid diagrams, and a browser theory reader. The content is an initial release, not the requested complete book-depth course. Advanced coverage is explicitly listed as pending in each lesson.

## Website

The existing private tutor is at https://groundup-lab.sumil.chatgpt.site. The reader is added in this repository at public/theory/index.html, with a home-page link. **This commit does not prove it has been deployed to that existing URL.** See the deployment guide for the current blocker and the automatic-deployment option.

## Local use

Run **node scripts/build-theory.mjs**, then **python -m http.server 8000 --directory public**. Open http://localhost:8000/theory/index.html. Run **python -m labs.checks --reference** for reference validation, or **python -m labs.checks softmax** for your implementation. The reader uses public CDN libraries for Markdown, equations, and diagrams; its lesson content is loaded from this site's own generated catalog.

For the full tutor app, use **pnpm run install:ci** then **pnpm build**. Its model default is gpt-6-astra; live tutoring requires a server-side API key. Browser reading and CPU exercises do not require it.

## Honest progress

Reading completion and saved notes are local browser conveniences, not assessed mastery. The existing tutor's heuristic evidence scores also do not establish mastery. A passing behavioral test is one kind of evidence; explain the derivation and solve a transfer problem as well.
