# Legacy lesson relevance and redundancy audit

Reviewed all **19 existing lesson pages outside linear algebra and probability/statistics**: 11 legacy introductory overviews plus two Foundations and six Optimization pages. The decision is based on current teaching and dependencies, not page length or overlap with an unauthored plan.

**Result:** remove one redundant Classical ML overview; retain ten useful overviews and eight Foundations/Optimization expansion targets. No Python task, learner implementation, reference function, or check is deleted. The reader has **45 lesson pages across 13 tracks**, with **67 browser Python tasks**. The curriculum still has 15 plans and 243 module briefs.

## Retention and removal criteria

- Retain material that supplies a unique explanation, worked derivation, implementation contract, prerequisite bridge or live lab. A planned replacement is not an authored replacement.
- Remove an overview when its substantive teaching is already covered by authored lessons, its useful remaining exercises are explicitly assigned in the plan, and inbound links and runtime dependencies are reconciled.
- Expand Foundations and existing Optimization units in place. For temporary overviews, retire the page only after its designated successors teach the retained material and inherit its links and tasks. Do not create placeholder lessons or count an overview as a completed detailed module.

## Page-by-page decisions

| Existing page | Decision and relevant material | Planned destination / live browser task |
|---|---|---|
| [00-mathematical-language](00-foundations/00-mathematical-language.md) | Keep: typed mathematical objects, shape checks, quantifiers and proof diagnostics are active prerequisites. | F00 (expand in place); no registered browser task |
| [01-numerical-stability](00-foundations/01-numerical-stability.md) | Keep: floating-point failure cases, log-sum-exp, conditioning versus stability and numerical debugging. | F01 (expand in place); no registered browser task |
| [01-python-memory-iteration](01-python/01-python-memory-iteration.md) | Keep temporarily: aliasing/mutation, generators and the streaming-moments implementation. | PY02, PY04, PY07; tasks: `moments` |
| [01-calculus-gradients-optimization](03-optimization/01-calculus-gradients-optimization.md) | Keep: the current derivative/chain-rule/curvature entry lesson; probability depends on its stable ID. | OPT01 (expand in place); no registered browser task |
| [03-convexity-smoothness-duality](03-optimization/03-convexity-smoothness-duality.md) | Keep: convexity, rates, duality and worked dual derivations; not a stub. | OPT03 (expand in place); no registered browser task |
| [04-stochastic-approximation-sgd](03-optimization/04-stochastic-approximation-sgd.md) | Keep: stochastic approximation, batch/noise tradeoffs and estimator bias; not a stub. | OPT04 (expand in place); no registered browser task |
| [05-nonconvex-landscapes-training-dynamics](03-optimization/05-nonconvex-landscapes-training-dynamics.md) | Keep: stationary-point, Hessian, implicit-bias and training-dynamics material; expand and audit claims in place. | OPT05 (expand in place); no registered browser task |
| [06-preconditioning-adaptive-methods-schedules](03-optimization/06-preconditioning-adaptive-methods-schedules.md) | Keep: preconditioning, AdamW, schedules and parameterization comparisons; not a stub. | OPT06 (expand in place); no registered browser task |
| [07-constrained-composite-distributed-optimization](03-optimization/07-constrained-composite-distributed-optimization.md) | Keep: projected/proximal/mirror methods and distributed objective semantics; not a stub. | OPT07 (expand in place); no registered browser task |
| [01-invariants-search-graphs-dp](04-dsa/01-invariants-search-graphs-dp.md) | Keep temporarily: lower-bound invariant, BFS correctness and coin-DP state design. | DS02, DS04, DS06, DS08; tasks: `search` |
| [01-entropy-generalization-decisions](06-information-learning-decision/01-entropy-generalization-decisions.md) | Keep temporarily: entropy/KL bridge, finite-class ERM bound and cost-sensitive decision rule; linked by PS05, PS13 and OPT05. | IL02, IL03, IL06, IL11; no registered browser task |
| [01-tensors-autograd-training](08-pytorch/01-tensors-autograd-training.md) | Keep temporarily: strides/views, gradient accumulation and training/evaluation state contracts. | PT02, PT03, PT05, PT07, PT09, PT13; tasks: `softmax` |
| [01-backprop-initialization-regularization](10-deep-learning-advanced/01-backprop-initialization-regularization.md) | Keep temporarily: complete batched MLP gradients, initialization and dropout exercises. | Core NN05 and NN08, Advanced DLA02; no registered browser task |
| [01-text-representations-language-models](11-nlp/01-text-representations-language-models.md) | Keep temporarily: text/token conventions, TF–IDF, naive Bayes and perplexity checks. | NLP02, NLP03, NLP04, NLP06, NLP07; tasks: `bigram` |
| [01-causal-transformers-training-systems](12-llm-systems/01-causal-transformers-training-systems.md) | Keep temporarily: causal masking, shifted targets, causality tests, memory and cache equivalence. | SYS02, SYS03, SYS15; tasks: `attention` |
| [01-mdps-bellman-td](13-reinforcement-learning/01-mdps-bellman-td.md) | Keep temporarily: MDP semantics, Bellman contraction and termination versus truncation. | RL04–RL05; tasks: `bellman` |
| [02-policy-gradients-actor-critic](13-reinforcement-learning/02-policy-gradients-actor-critic.md) | Keep temporarily: trajectory gradients, reward-to-go, GAE and PPO objective semantics. | RL08–RL10; no registered browser task |
| [01-retrieval-tools-evaluation](14-agentic-systems/01-retrieval-tools-evaluation.md) | Keep temporarily: retrieval failure attribution, tool state/idempotency, evaluation and rollback. | APP02, APP03, APP04, APP06, APP10, APP12; no registered browser task |
| Retired `07-classical-ml/01-regression-classification-evaluation.md` | Removed: OLS/logistic derivations, estimator error, leakage and calibration have authored homes. The short model-family list was orientation only. No front-matter ID, browser task or lesson-to-lesson inbound link depended on it. | [ML02–ML16 and preserved implementation requirements](07-classical-ml/_plan.md#current-reading-route-and-preserved-implementation-work); no registered browser task |

## What remains to author

The retained ten overviews are not at LA/probability lesson depth. Their plans now name exactly what must be transferred into detailed units before retirement. Classical ML has no standalone authored page after this cleanup: use its linked reading route now, then implement ML02–ML16 rather than restoring a redundant overview. Foundations and Optimization retain their IDs and expand in place. No proposed module has been marked complete by this audit.

## Validation

Rebuild and check the reader using `node scripts/build-theory.mjs` and `node scripts/check-theory.mjs`. Check relative links in both indexes and all plans, confirm the retired path is absent from the reader and lab registry, and confirm the six browser tasks owned by retained overviews remain registered. Plans and this audit use underscore-prefixed filenames and are excluded from the lesson catalog.
