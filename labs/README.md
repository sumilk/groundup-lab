# Hands-on labs

Use Python 3.11 or later. These first twenty-one exercises need only the standard library; no GPU, API key, package installation, or paid dataset is required.

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
| categorical | [Random variables and distributions](../content/05-probability-statistics/02-random-variables-distributions.md) | Reproducible inverse-CDF sampling from weights |
| joint | [Joint distributions and covariance](../content/05-probability-statistics/03-joint-distributions-conditioning-covariance.md) | Marginalization and covariance on sparse finite support |
| convolution | [Transformations and Jacobians](../content/05-probability-statistics/04-transformations-convolution-jacobians.md) | Exact convolution of sparse finite PMFs |
| gaussian | [Multivariate Gaussian geometry](../content/05-probability-statistics/05-multivariate-gaussian-geometry.md) | Conditional Gaussian mean and uncertainty |
| monte-carlo | [Repeated samples and Monte Carlo error](../content/05-probability-statistics/06-limit-theorems-monte-carlo.md) | Dependence-aware uncertainty from contiguous batch means |
| bernoulli-mle | [Estimation and likelihood](../content/05-probability-statistics/07-estimation-likelihood-fisher.md) | Boundary-safe Bernoulli MLE and plug-in uncertainty |
| binomial-test | [Hypothesis testing and confidence intervals](../content/05-probability-statistics/08-hypothesis-testing-confidence-power.md) | Exact binomial tails and an interval obtained by inversion |
| bh-fdr | [Hypothesis testing and multiple comparisons](../content/05-probability-statistics/08-hypothesis-testing-confidence-power.md) | Benjamini–Hochberg decisions and adjusted p-values |
| bootstrap | [Bootstrap and experimental design](../content/05-probability-statistics/09-resampling-sequential-experimental-design.md) | Seeded bootstrap standard error and percentile interval |
| permutation | [Permutation tests and randomization](../content/05-probability-statistics/09-resampling-sequential-experimental-design.md) | Exact paired sign-flip test |
| e-process | [Sequential inference](../content/05-probability-statistics/09-resampling-sequential-experimental-design.md) | Bernoulli likelihood-ratio e-process and anytime p-value |
| beta-update | [Bayesian modeling and computation](../content/05-probability-statistics/10-bayesian-modeling-computation.md) | Conjugate Beta–Bernoulli updating and prediction |
| importance | [Bayesian modeling and computation](../content/05-probability-statistics/10-bayesian-modeling-computation.md) | Stable self-normalized importance weighting and ESS |
| metropolis | [Bayesian modeling and computation](../content/05-probability-statistics/10-bayesian-modeling-computation.md) | Log-space random-walk Metropolis sampling |
| search | [DSA](../content/04-dsa/01-invariants-search-graphs-dp.md) | Exhaustive boundary cases |
| softmax | [PyTorch](../content/08-pytorch/01-tensors-autograd-training.md) | Stability and shift invariance |
| bigram | [NLP](../content/10-nlp/01-text-representations-language-models.md) | Correct target offsets |
| attention | [LLM systems](../content/11-llm-systems/01-causal-transformers-training-systems.md) | Prefix causality |
| bellman | [RL](../content/12-reinforcement-learning/01-mdps-bellman-td.md) | Known solution and stochastic expectation |

Student functions intentionally raise NotImplementedError initially. Their failing tests mean the exercise has not been implemented, not that installation failed. Passing checks supplies behavioral evidence; it does not automatically establish understanding.

The PyTorch, MLP, tokenizer, and policy-gradient projects in the lessons are implementation specifications. Full executable scaffolds for those projects are still pending.
