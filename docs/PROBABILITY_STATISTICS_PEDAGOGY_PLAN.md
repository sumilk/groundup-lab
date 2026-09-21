# Probability and statistics pedagogy plan

## Objective

Turn the probability and statistics track into a genuinely ground-up, self-study sequence that develops enough intuition, mathematical control, implementation skill, and research judgement for research-engineer and research-scientist interviews.

The target is not encyclopedic coverage. A learner should repeatedly move through:

1. a concrete phenomenon;
2. the mathematical object that represents it;
3. a derivation from definitions;
4. a calculation small enough to check by hand;
5. an implementation or simulation;
6. a failure case that breaks a tempting shortcut;
7. transfer to an AI research or evaluation decision.

## Definition of a complete lesson

Every lesson must provide:

- explicit prerequisites and a diagnostic that can redirect the learner;
- a short map explaining why the sections occur in their current order;
- notation introduced before it is used;
- at least one fully worked numerical example for each major conceptual block;
- Foundation, Core, and Stretch retrieval prompts throughout the lesson;
- derivations that state assumptions and identify where each assumption enters;
- a runnable implementation or reproducible experiment;
- a cumulative problem set with self-contained data and deliverables;
- worked answers or grading criteria, not only hints;
- one RE task involving implementation, debugging, numerical stability, or evaluation design;
- one RS task involving derivation, proof, model criticism, or research design;
- a mastery check based on observable work rather than reading completion.

## Exercise design standard

### Foundation

Foundation problems have one clear target and enough supplied information to produce a checkable answer. They test notation, direct calculation, and recognition. They must not be vague prompts such as “explore” or “discuss.”

### Core

Core problems combine at least two ideas. A complete solution shows an estimating equation, likelihood, probability law, invariant, or simulation design before reporting a result.

### Stretch

Stretch problems resemble research work. They specify the population, data-generating process or dataset, target claim, required diagnostics, and reporting expectations. Where no unique numerical answer exists, the lesson supplies a rubric and automatic failure conditions.

### Solutions

Solutions should reveal the decisive reasoning without encouraging passive reading:

- put them in collapsed sections;
- show intermediate quantities for numerical problems;
- distinguish one valid solution from all possible solutions;
- state expected simulation ranges and Monte Carlo uncertainty;
- identify conclusions that the calculation does not support.

## Curriculum-wide implementation

| Lesson | Main pedagogical change |
|---|---|
| 00 Probability foundations | Convert the cumulative set into a concrete finite-model worksheet; strengthen Bayes, independence, and selection examples. |
| 01 Random variables and distributions | Add a distribution-choice map and checkable PMF/CDF/moment/simulation problems. |
| 02 Joint distributions | Add one reusable joint-table case study spanning marginalization, conditioning, total variance, covariance, and Simpson reversal. |
| 03 Transformations and Jacobians | Add a transformation decision procedure and hand-to-code problems covering branches, support, convolution, and log densities. |
| 04 Multivariate Gaussian geometry | Add missing worked geometry, conditioning, whitening, singularity, and numerical-stability exercises. |
| 05 Limit theorems and Monte Carlo | Separate convergence concepts through counterexamples; add finite-sample planning and dependence-aware simulation tasks. |
| 06 Estimation and likelihood | Add an estimand-to-estimator workflow and concrete bias, information, delta-method, misspecification, and selection exercises. |
| 07 Testing, confidence, and power | Build one end-to-end experimental case through estimand, test, interval, power, multiplicity, and reporting. |
| 08 Resampling, sequential inference, and design | Make the resampling unit, exchangeability, stopping rule, and randomization mechanism explicit in every research exercise. |
| 09 Bayesian modelling and computation | Add prior-predictive-to-posterior-predictive workflow, hand conjugacy, importance-sampling failure, and MCMC diagnosis tasks. |
| 10 Sampling design and ML evaluation | Add a complete benchmark-design studio with population weights, clustering, contamination, seed variation, and shift. |
| 11 Exponential families, regression, and GLMs | Keep the completed 24-problem Foundation/Core/Stretch sequence and use it as the detailed reference implementation. |
| 12 High-dimensional probability | Expand substantially: sub-Gaussian variables, concentration of linear forms, union bounds, random matrices, covariance error, and random projection practice. |
| 13 Calibration, scoring, and conformal prediction | Expand calibration estimands, score decompositions, recalibration leakage, conditional-coverage limits, and paired model-evaluation exercises. |
| 14 Latent variables and gradient estimators | Add worked ELBO examples, posterior-collapse diagnostics, score-function baselines, pathwise gradients, discrete relaxations, and research exercises. |
| 15 Score matching, diffusion, and sampling | Add worked score-matching derivations, forward/reverse Gaussian calculations, sampler comparisons, guidance failure, and decoding evaluation. |
| 16 Causal inference and missing data | Preserve breadth while adding a study-design map and concrete identification-first capstone. |
| 17 Mixtures, EM, and graphical models | Add a unified latent-variable case study from responsibilities through EM, inference, identifiability, and model criticism. |
| 18 Nonparametrics | Preserve the corrected paired/unpaired, Hodges–Lehmann, U-statistic, and KDE material; add a concrete distribution-free evaluation capstone. |

## Batch sequence

1. **Foundations:** lessons 00–05.
2. **Inference and evaluation:** lessons 06–10.
3. **Statistical modelling and modern methods:** lessons 11–15.
4. **Advanced research methods:** lessons 16–18.

Each batch must pass:

    corepack pnpm theory:build
    corepack pnpm theory:check
    python -m labs.checks --reference
    git diff --check

## Completion criteria

The redesign is complete only when:

- every lesson satisfies the complete-lesson checklist;
- no exercise depends on unspecified data or an unstated target;
- every simulation specifies a seed policy, repetition count, expected comparison, and uncertainty;
- every research capstone states the exchangeable unit and target population;
- mathematical notation and terminology are consistent across lessons;
- lesson links, browser labs, and all reference checks pass;
- generated reader artifacts are current.
