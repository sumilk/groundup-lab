# Probability and statistics — build plan

*An authoring brief in the [shared curriculum format](../_plans.md). Existing coverage is recorded separately from proposed additions. This file is excluded from the lesson reader.*

## 1. Target and current state

Build probabilistic models from finite experiments through research-grade inference, computation, and dependent data. The RE route emphasizes reliable samplers, evaluation estimators, diagnostics, and uncertainty-aware pipelines; the RS route emphasizes identification, assumptions, asymptotic versus finite-sample reasoning, and falsifiable empirical claims. Preserve the substantial 00–18 sequence and add focused 19–29 extensions. In particular, stochastic processes/time series were explicitly named as the next unfinished cluster at the end of PS18.

**Coverage audit:** 19 authored lessons, 37 registered browser Python tasks, and 664 hours in current lesson metadata. **Planned scope:** 30 modules and 1060 estimated study hours, including the existing 664 hours; 11 modules are new. Existing-module hours are retained as baseline estimates, not an assertion that their expansion work costs nothing. Re-estimate when writing. These are comprehensive curriculum estimates, not a required preparation schedule; count reused capstones only once.

**Status vocabulary.** “Authored / expand” means the linked lesson and listed Python tasks exist, with targeted additions or verification still planned. It does not certify complete coverage or external review. “New” means no lesson, bank, figure, or Python task is being claimed as implemented. The module map and detailed briefs distinguish these states.

### Coverage and remaining work

| Handle | Current coverage and evidence | Still to add or verify |
|---|---|---|
| PS00 | [00-probability-foundations.md](00-probability-foundations.md). Finite sample spaces, axioms, counting, conditioning, Bayes, independence, indicators, and exact conditional probability lab. | Maintain the implemented common format; conditional-event enumerator and independence counterexample tasks; diagnostic repair links. |
| PS01 | [01-random-variables-distributions.md](01-random-variables-distributions.md). PMFs/CDFs/densities, moments, common families, inverse-CDF simulation, log-space discipline, and categorical sampling. | Maintain the implemented common format; explicit atoms/mixed laws and quantile conventions; numerical tail-probability exercises and additional sampler tests. |
| PS02 | [02-joint-distributions-conditioning-covariance.md](02-joint-distributions-conditioning-covariance.md). Marginals, conditional laws/expectations, total expectation/variance, covariance matrices, Simpson reversals, and conditional independence. | Maintain the implemented common format; conditional-mixture simulation and covariance PSD checks, with a finite nonzero-mean example. |
| PS03 | [03-transformations-convolution-jacobians.md](03-transformations-convolution-jacobians.md). Discrete pushforwards, CDF method, inverse branches, Jacobians, affine/polar transformations, convolution, and flow examples. | Maintain the implemented common format; explicit singular-map/support cases; invertible-flow round-trip and density-normalization checks. |
| PS04 | [04-multivariate-gaussian-geometry.md](04-multivariate-gaussian-geometry.md). Covariance ellipsoids, affine sampling, Gaussian closure, marginals/conditionals, independence, whitening, and singular covariance caveats. | Maintain the implemented common format; stable block solves without explicit inverses; contrast a full density with a degenerate Gaussian on a subspace. |
| PS05 | [05-limit-theorems-monte-carlo.md](05-limit-theorems-monte-carlo.md). Weak/strong laws, CLT, standard errors, concentration/Chernoff methods, heavy tails, dependence, and batch-means estimation. | Maintain the implemented common format; convergence-mode counterexamples, coverage simulations, and robust-mean extensions; formal process guarantees deferred to PS19/PS22. |
| PS06 | [06-estimation-likelihood-fisher.md](06-estimation-likelihood-fisher.md). Estimands/estimators, bias/variance/MSE, likelihood, Bernoulli/Gaussian MLE, identifiability, Fisher, CRLB, delta method, and misspecification. | Maintain the implemented common format; worked irregular/boundary models, likelihood profiles, and analytic-versus-simulated coverage; clarify conditions for score/interchange identities. |
| PS07 | [07-hypothesis-testing-confidence-power.md](07-hypothesis-testing-confidence-power.md). Tests/p-values, confidence duality, exact binomial inference, mean tests, pairing/clustering, power/effect sizes, LRTs, Holm/BH, and selection pitfalls. | Maintain the implemented common format; equivalence/noninferiority with prespecified margins; null calibration of boundary tests and dependent-comparison qualifications. |
| PS08 | [08-resampling-sequential-experimental-design.md](08-resampling-sequential-experimental-design.md). Bootstrap/permutation variants, resampling units, failure modes, e-processes/confidence sequences, randomization, blocking, factorial designs, and interference. | Maintain the implemented common format; stronger studentized/cluster examples and explicit optional-stopping conditions; full martingale proofs belong to PS22. |
| PS09 | [09-bayesian-modeling-computation.md](09-bayesian-modeling-computation.md). Priors, conjugacy, posterior prediction, sensitivity, hierarchies, importance sampling, chain stationary/limiting behavior, MH, diagnostics, and HMC/VI overview. | Maintain the implemented common format; multi-chain diagnostics and simulation-based calibration as local work; full HMC/SMC in PS25, not a claim they are already implemented. |
| PS10 | [10-sampling-design-ml-evaluation.md](10-sampling-design-ml-evaluation.md). Frames/estimands, finite-population corrections, strata/clusters/weights, nonresponse, simulation variance reduction, adaptive sampling, seeds, contamination, and shift. | Maintain the implemented common format; crossed task/seed uncertainty examples, judge-error sensitivity, and a fully replayable evaluation protocol; adaptive collection deepens in PS27. |
| PS11 | [11-exponential-families-regression-glms.md](11-exponential-families-regression-glms.md). Sufficiency, exponential-family geometry, OLS uncertainty, ANOVA, sandwich/GLS, logistic/Poisson/Bradley–Terry, IRLS, and partial pooling. | Maintain the implemented common format; explicit separation/weak overlap cases, cluster-robust uncertainty, and a connected-comparison-graph check for preferences. |
| PS12 | [12-high-dimensional-probability.md](12-high-dimensional-probability.md). Norm/angle concentration, thin shells, JL, sample-covariance spectra, attention/initialization scale, and projection-distortion lab. | Maintain the implemented common format; qualify finite-probability versus almost-sure wording in the JL discussion, dimension-bound constants, covariance-null assumptions, and eigenvector stability. |
| PS13 | [13-calibration-scoring-conformal.md](13-calibration-scoring-conformal.md). Reliability/ECE, proper Brier/log scores, decomposition, recalibration, prior shift, split conformal, and threshold/ECE labs. | Completed common format and claim corrections; continue deeper verification of binning versus finite-sample ECE bias, conditional versus marginal validity, dependence counterexamples, and ambiguous score-impossibility exercise. |
| PS14 | [14-latent-variables-elbo-gradient-estimators.md](14-latent-variables-elbo-gradient-estimators.md). ELBO derivations, amortization, score-function/pathwise gradients, an exact variance comparison, Gumbel-max/relaxation, and Gaussian ELBO lab. | Maintain the implemented common format; explicit differentiation-under-integral conditions, baseline/stop-gradient checks, finite discrete oracles, and biased-relaxation comparisons. |
| PS15 | [15-score-matching-diffusion-sampling.md](15-score-matching-diffusion-sampling.md). Score/normalizer identity, Hyvärinen/denoising arguments, Gaussian forward chain, diffusion ELBO, sampler/guidance overview, and decoding surgery. | Maintain the implemented common format; boundary assumptions in integration by parts, explicit reverse-time conventions, analytic score/sampler checks; rigorous SDE work belongs to PS24. |
| PS16 | [16-causal-inference-missing-data.md](16-causal-inference-missing-data.md). Potential outcomes, DAGs/d-separation, adjustment/IPW/AIPW, instruments/weak instruments, DiD/RD, sensitivity, missingness, and Rubin pooling. | Maintain the implemented common format; executable cross-fitted AIPW and imputation studies, nuisance-rate qualifications, and better distinction between diagnostics and identification. |
| PS17 | [17-mixtures-em-graphical-models.md](17-mixtures-em-graphical-models.md). Mixture responsibilities/EM, singularities, label switching/identifiability, model selection, exact graphical inference, junction trees, and HMMs. | Maintain the implemented common format; executable backward/smoothing and variable-elimination tasks, missing-information examples, and singular-model selection qualifications. |
| PS18 | [18-order-statistics-empirical-processes-nonparametrics.md](18-order-statistics-empirical-processes-nonparametrics.md). Quantiles/extremes, GC/DKW, empirical-process overview, rank/U-statistic tests, KDE/regression, and Rao–Blackwellization. | Maintain the implemented common format; exact quantile/tie cases, dependent-data counterexamples, and qualified block-resampling repairs; rare-tail modeling expands in PS28. |
| PS19 | No authored lesson. Stationary/limiting chain ideas exist in PS09 and HMMs in PS17; no general process unit. | A dedicated process sequence, finite-dimensional distributions, stationarity, transition powers, communicating classes, hitting times, and ergodic averages. |
| PS20 | No authored lesson. Autocorrelation/batch means are previewed; no dedicated time-series course. | Weak/strict stationarity, ACF/PACF, AR/MA/ARMA models, spectral intuition, HAC/block bootstrap conditions, and rolling-origin evaluation. |
| PS21 | No authored lesson. Poisson/exponential marginal families exist in PS01; no process or queueing unit. | Independent/stationary increments, exponential interarrivals, renewal reward, inspection paradox, and finite-state queue models. |
| PS22 | No authored lesson. E-process/confidence-sequence construction exists in PS08; full information-flow and stopping theory does not. | Filtrations, martingale differences, supermartingales, stopping times, optional-stopping conditions, Ville/Azuma-style bounds, and adaptive confidence sequences. |
| PS23 | No authored lesson. Finite and density calculations exist; no systematic measure-theoretic bridge. | Sigma-algebras/measurability, measures/integration, null sets, convergence modes, MCT/DCT/Fatou, Radon–Nikodym interpretation, and conditional expectation as projection. |
| PS24 | No authored lesson. Discrete Gaussian diffusion and reverse-sampler overview exist; no stochastic-calculus development. | Brownian increments/quadratic variation, Itô integral/isometry, Itô formula, linear SDEs, Fokker–Planck/reversal assumptions, and discretization orders. |
| PS25 | No authored lesson. Importance sampling/MH are implemented and HMC is previewed; no full HMC/SMC workflow. | Hamiltonian proposals/Metropolis correction, adaptation boundaries, sequential importance sampling/resampling, particle filtering, and simulation-based calibration. |
| PS26 | No authored lesson. Heavy-tail summaries, sandwich errors, and doubly robust ideas exist; no unified robust/influence-function development. | M-estimation, influence functions, contamination and breakdown, orthogonal scores, cross-fitting, nuisance-product rates, and robust confidence analysis. |
| PS27 | No authored lesson. Peeking, active selection, multiplicity, and benchmark reuse are discussed; no integrated adaptive-evaluation unit. | Predictable inclusion policies, adaptive estimands, sequential weighting, reusable-test-set limitations, selective-inference examples, and judge/label uncertainty. |
| PS28 | No authored lesson. Order-statistic extremes and importance sampling exist; no survival/censoring or rare-event design lesson. | Survival/hazard, right censoring/truncation, Kaplan–Meier under independent censoring, restricted mean time, rare-event sampling, and extreme-value assumptions. |
| PS29 | No authored lesson. No integrated track capstone; individual lessons contain evaluation workflows. | One end-to-end report with exact synthetic control, real or realistic benchmark, dependence/selection audit, and reproducible uncertainty. |

## 2. Teaching and authoring contract

The 19 authored lessons now include offline hints after every section-practice prompt, one registered prediction/reveal experiment with a boundary or failure preset per lesson, identified cumulative exercises with authored answer banks, and six-part checkpoints with numerical checks and written rubrics. All 37 registered Python tasks are retained. The experiments deliberately isolate one mechanism each; they do not yet implement every proposed view in the briefs below. Some units still have only one or two registered Python tasks: the complementary three-task implementation ladders remain expansion work. New advanced modules remain unauthored.

**Completed correctness pass:** PS12 now distinguishes finite-probability JL bounds, norm-concentration approximations and asymptotic covariance spectra; PS13 separates binned/population calibration, proper-score claims and marginal conformal guarantees; PS14 distinguishes evidence estimation from self-normalized expectations and qualifies importance-weighted-bound convergence; PS15 distinguishes a reverse posterior conditioned on clean data from a learned reverse transition; PS16 states nuisance-rate conditions for cross-fitted inference; PS18 qualifies dependent-data resampling. PS03 supplies a local multivariable-calculus bridge until OPT02 is authored.

Retain existing `math.probability.*` and `math.statistics.*` IDs exactly. New probability/process units use `math.probability.*`; new statistical units use `math.statistics.*`. Every proposed bank uses a `ps-NN-` prefix. The maps below distinguish an already covered concept, a deeper extension, and a wholly new lesson rather than labeling all advanced topics absent.

Apply the [shared exercise, hint, answer-bank, and checkpoint contracts](../_plans.md#4-shared-lesson-authoring-contract). Numbered teaching sections end with Foundation / Core / Stretch practice and static hints. Each lesson develops a finite or geometric example before abstraction, states theorem assumptions, includes a prediction/reveal experiment with a failure preset, and closes with derivations, cumulative practice, and the six-part checkpoint. Each module also has separate RE and RS evidence gates below. Authoring freedom remains: add linked views, examples, and misconception checks whenever they improve understanding.

**Identifiers and dependencies.** Handles `PSNN` are planning references. Preserve every existing filename, content ID, lab/task ID, and bank key. New content IDs use `math.probability.<slug>` unless explicitly specified; filenames use the reserved two-digit number and slug. Future IDs and bank names below are reservations, not registrations. Authored front matter now follows the module map where predecessors exist. Planned OPT02 is temporarily replaced by authored OPT01 plus the local calculus bridge in PS03; PS06, PS11 and PS14 link to that bridge. Future modules are not registered as authored prerequisites.

**Ownership boundary.** Own probability models, statistical inference, stochastic simulation, sampling/evaluation design, and dependent-data foundations. LA owns matrix geometry and numerical factorizations; Optimization owns convergence of training algorithms; IL owns information theory, learning guarantees, and decision optimization. PS14–PS15 own latent/score probability identities, DL11–DL13 own neural architectures and training, and RL owns policy algorithms. New PS27 develops validity under adaptive data collection; RP04 owns project execution. Do not duplicate existing GLM, EM, causal, nonparametric, or calibration material in new modules.

## 3. Module map

| Handle | Module | Status | Hours | Prerequisites |
|---|---|---|---:|---|
| PS00 | Finite probability foundations | Authored / expand | 24 | F00 |
| PS01 | Random variables, distributions, and simulation | Authored / expand | 32 | PS00, OPT01 |
| PS02 | Joint laws, conditioning, and covariance | Authored / expand | 24 | PS01 |
| PS03 | Transformations, convolution, and Jacobians | Authored / expand | 28 | PS02, OPT02, LA05 |
| PS04 | Multivariate Gaussian geometry and conditioning | Authored / expand | 22 | PS03, LA07 |
| PS05 | Limit theorems, concentration, and Monte Carlo error | Authored / expand | 30 | PS02 |
| PS06 | Estimation, likelihood, Fisher information, and asymptotics | Authored / expand | 28 | PS05, OPT02 |
| PS07 | Testing, confidence, power, and multiplicity | Authored / expand | 34 | PS06 |
| PS08 | Resampling, sequential inference, and experimental design | Authored / expand | 36 | PS07 |
| PS09 | Bayesian models, posterior checks, and computation | Authored / expand | 44 | PS08, PS04 |
| PS10 | Sampling design and rigorous ML evaluation | Authored / expand | 42 | PS09 |
| PS11 | Exponential families, regression, GLMs, and pooling | Authored / expand | 50 | PS10, LA03, OPT02 |
| PS12 | High-dimensional probability and random geometry | Authored / expand | 30 | PS05, LA08 |
| PS13 | Calibration, proper scores, and conformal prediction | Authored / expand | 32 | PS07, PS08, PS02 |
| PS14 | Latent variables, ELBO, and gradient estimators | Authored / expand | 36 | PS09, PS03, OPT02 |
| PS15 | Score matching, diffusion, and generative sampling | Authored / expand | 36 | PS14, PS04 |
| PS16 | Causal inference and missing data | Authored / expand | 48 | PS11, PS10 |
| PS17 | Mixtures, EM, and graphical models | Authored / expand | 44 | PS14, PS16, PS04 |
| PS18 | Order statistics, empirical processes, and nonparametrics | Authored / expand | 44 | PS08, PS11 |
| PS19 | Stochastic processes and Markov chains beyond MCMC | New | 32 | PS05, PS09, LA07 |
| PS20 | Time series, dependence, and forecasting uncertainty | New | 36 | PS19, PS11, PS18 |
| PS21 | Poisson, renewal, and queueing processes | New | 30 | PS19, PS01 |
| PS22 | Martingales, stopping times, and sequential concentration | New | 36 | PS23, PS08, PS19 |
| PS23 | Measure-based probability and conditional expectation | New | 36 | PS05, PS02, OPT01 |
| PS24 | Brownian motion, stochastic calculus, and diffusion limits | New | 40 | PS22, OPT02, PS15 |
| PS25 | Advanced Monte Carlo, HMC, and sequential inference | New | 38 | PS19, PS17, OPT02 |
| PS26 | Robust estimation and semiparametric inference | New | 38 | PS16, PS18, PS23, OPT03 |
| PS27 | Adaptive evaluation, selection, and changing data collection | New | 34 | PS22, PS26, PS13, PS10 |
| PS28 | Censoring, survival, extremes, and rare-event estimation | New | 32 | PS21, PS18, PS10 |
| PS29 | Capstone: a statistical audit of an AI research claim | New | 44 | PS10, PS13, PS20, PS27, PS28, RP04 |

## 4. Detailed module briefs

### Part I · Probability models

*Thesis: a sample space, transformation, and conditioning operation define what a number means.*

**Module 00 — Finite probability foundations**

`handle: PS00` · `id: math.probability.foundations` · 24h · prerequisites: F00 · registered bank: `ps-00-foundations`

**Already covered:** Finite sample spaces, axioms, counting, conditioning, Bayes, independence, indicators, and exact conditional probability lab.

**Add or verify:** Maintain the implemented common format; conditional-event enumerator and independence counterexample tasks; diagnostic repair links.

**Existing artifacts:** [00-probability-foundations.md](00-probability-foundations.md); registered Python tasks: `conditional` → `conditional_probability`. Registered figure: `ps-events`; offline bank: `ps-00-foundations`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive total probability/Bayes and indicator expectation; distinguish model probability from empirical frequency and pairwise from mutual independence.

**Interactive experiment:** Proposed ps-events: select events in a weighted finite grid; reveal null-conditioning events and pairwise-but-not-mutual independence.

**Implementation ladder:** Retain conditional_probability; add event_probability and independence_audit with finite exact or rational oracles.

**RE gate:** Audit an event calculation and reject conditioning on a zero-probability finite event.

**RS gate:** Construct a valid finite model and a counterexample to an unjustified independence assumption.


**Module 01 — Random variables, distributions, and simulation**

`handle: PS01` · `id: math.probability.random-variables-distributions` · 32h · prerequisites: PS00, OPT01 · registered bank: `ps-01-random-variables-distributions`

**Already covered:** PMFs/CDFs/densities, moments, common families, inverse-CDF simulation, log-space discipline, and categorical sampling.

**Add or verify:** Maintain the implemented common format; explicit atoms/mixed laws and quantile conventions; numerical tail-probability exercises and additional sampler tests.

**Existing artifacts:** [01-random-variables-distributions.md](01-random-variables-distributions.md); registered Python tasks: `categorical` → `sample_categorical`. Registered figure: `ps-distributions`; offline bank: `ps-01-random-variables-distributions`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive expectations and variances for representative families; distinguish density from mass and generalized-inverse quantiles from ordinary inverses.

**Interactive experiment:** Proposed ps-distributions: vary parameters and switch discrete/continuous/mixed laws; show atoms, support violations, and missing moments.

**Implementation ladder:** Retain sample_categorical; add discrete_quantile and distribution_moment_audit; use local tail routines with independent small cases.

**RE gate:** Validate sampler support, normalization, and empirical error without expecting exact random frequencies.

**RS gate:** State integrability and parameter conditions before manipulating moments or continuous densities.


**Module 02 — Joint laws, conditioning, and covariance**

`handle: PS02` · `id: math.probability.joint-conditioning-covariance` · 24h · prerequisites: PS01 · registered bank: `ps-02-joint-conditioning-covariance`

**Already covered:** Marginals, conditional laws/expectations, total expectation/variance, covariance matrices, Simpson reversals, and conditional independence.

**Add or verify:** Maintain the implemented common format; conditional-mixture simulation and covariance PSD checks, with a finite nonzero-mean example.

**Existing artifacts:** [02-joint-distributions-conditioning-covariance.md](02-joint-distributions-conditioning-covariance.md); registered Python tasks: `joint` → `joint_marginals_covariance`. Registered figure: `ps-joint`; offline bank: `ps-02-joint-conditioning-covariance`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive tower and total-variance identities, covariance bilinearity, and covariance PSD; distinguish zero covariance from independence.

**Interactive experiment:** Proposed ps-joint: edit a joint table and select conditioning slices; expose aggregation reversals and zero-probability slices.

**Implementation ladder:** Retain joint_marginals_covariance; add conditional_expectation_table and total_variance_decomposition.

**RE gate:** Recover correct weighted aggregates and diagnose a wrong denominator or sampling unit.

**RS gate:** Prove a conditional expectation identity and give a nonlinear dependence example with zero covariance.


**Module 03 — Transformations, convolution, and Jacobians**

`handle: PS03` · `id: math.probability.transformations-convolution-jacobians` · 28h · prerequisites: PS02, OPT02, LA05 · registered bank: `ps-03-transformations-convolution-jacobians`

**Already covered:** Discrete pushforwards, CDF method, inverse branches, Jacobians, affine/polar transformations, convolution, and flow examples.

**Add or verify:** Maintain the implemented common format; explicit singular-map/support cases; invertible-flow round-trip and density-normalization checks.

**Existing artifacts:** [03-transformations-convolution-jacobians.md](03-transformations-convolution-jacobians.md); registered Python tasks: `convolution` → `discrete_convolution`. Registered figure: `ps-transform`; offline bank: `ps-03-transformations-convolution-jacobians`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive one/many-branch change of variables, determinant volume correction, and convolution under independence.

**Interactive experiment:** Proposed ps-transform: drag an affine map or nonlinear fold; show branch multiplicity and failure of a density formula at a singular map.

**Implementation ladder:** Retain discrete_convolution; add pushforward_mass and affine_density_roundtrip; keep multidimensional sampling local.

**RE gate:** Verify normalization and Jacobian signs/absolute values against a tractable distribution.

**RS gate:** Explain which regularity/invertibility and independence assumptions each transformation requires.


**Module 04 — Multivariate Gaussian geometry and conditioning**

`handle: PS04` · `id: math.probability.multivariate-gaussian-geometry` · 22h · prerequisites: PS03, LA07 · registered bank: `ps-04-multivariate-gaussian-geometry`

**Already covered:** Covariance ellipsoids, affine sampling, Gaussian closure, marginals/conditionals, independence, whitening, and singular covariance caveats.

**Add or verify:** Maintain the implemented common format; stable block solves without explicit inverses; contrast a full density with a degenerate Gaussian on a subspace.

**Existing artifacts:** [04-multivariate-gaussian-geometry.md](04-multivariate-gaussian-geometry.md); registered Python tasks: `gaussian` → `condition_bivariate_gaussian`. Registered figure: `ps-gaussian`; offline bank: `ps-04-multivariate-gaussian-geometry`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive Gaussian affine moments and conditional mean/covariance by completing the square; distinguish Gaussian-specific zero-covariance independence.

**Interactive experiment:** Proposed ps-gaussian: drag correlation and observed value; show conditional ellipses collapsing toward a singular limit.

**Implementation ladder:** Retain condition_bivariate_gaussian; add gaussian_affine_moments and conditional_covariance_check; use Cholesky-based local computation.

**RE gate:** Compute a conditional distribution stably and identify unsupported or degenerate cases.

**RS gate:** Explain why a pseudoinverse substitution needs a support-aware degenerate-distribution argument.


### Part II · Inference and computation

*Thesis: an estimator is a random procedure whose guarantee depends on how data were obtained.*

**Module 05 — Limit theorems, concentration, and Monte Carlo error**

`handle: PS05` · `id: math.probability.limit-theorems-monte-carlo` · 30h · prerequisites: PS02 · registered bank: `ps-05-limit-theorems-monte-carlo`

**Already covered:** Weak/strong laws, CLT, standard errors, concentration/Chernoff methods, heavy tails, dependence, and batch-means estimation.

**Add or verify:** Maintain the implemented common format; convergence-mode counterexamples, coverage simulations, and robust-mean extensions; formal process guarantees deferred to PS19/PS22.

**Existing artifacts:** [05-limit-theorems-monte-carlo.md](05-limit-theorems-monte-carlo.md); registered Python tasks: `monte-carlo` → `batch_means_standard_error`. Registered figure: `ps-limits`; offline bank: `ps-05-limit-theorems-monte-carlo`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Prove a finite-variance weak law and selected concentration bounds; state LLN/CLT hypotheses and distinguish Monte Carlo error from sampling/model error.

**Interactive experiment:** Proposed ps-limits: vary sample size, tails, and correlation; show a stable-looking mean with misleading iid standard errors.

**Implementation ladder:** Retain batch_means_standard_error; add coverage_simulation and median_of_means on independent blocks.

**RE gate:** Report Monte Carlo uncertainty with an appropriate dependence model and disclose unverified assumptions.

**RS gate:** Separate convergence in distribution, probability, and almost surely; give a CLT failure case.


**Module 06 — Estimation, likelihood, Fisher information, and asymptotics**

`handle: PS06` · `id: math.statistics.estimation-likelihood-fisher` · 28h · prerequisites: PS05, OPT02 · registered bank: `ps-06-estimation-likelihood-fisher`

**Already covered:** Estimands/estimators, bias/variance/MSE, likelihood, Bernoulli/Gaussian MLE, identifiability, Fisher, CRLB, delta method, and misspecification.

**Add or verify:** Maintain the implemented common format; worked irregular/boundary models, likelihood profiles, and analytic-versus-simulated coverage; clarify conditions for score/interchange identities.

**Existing artifacts:** [06-estimation-likelihood-fisher.md](06-estimation-likelihood-fisher.md); registered Python tasks: `bernoulli-mle` → `bernoulli_mle`. Registered figure: `ps-likelihood`; offline bank: `ps-06-estimation-likelihood-fisher`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive MLE score/Hessian and regular asymptotic variance; state CRLB regularity and contrast pseudo-true parameters under misspecification.

**Interactive experiment:** Proposed ps-likelihood: vary true parameter and sample size; reveal boundary MLEs and a regularity failure hidden by a quadratic approximation.

**Implementation ladder:** Retain bernoulli_mle; add likelihood_profile and delta_method_variance with exact small-model checks.

**RE gate:** Detect boundary or nonidentifiable fits rather than returning an unjustified standard error.

**RS gate:** Explain which assumption licenses a Fisher-based interval and exhibit a case where root-n normality fails.


**Module 07 — Testing, confidence, power, and multiplicity**

`handle: PS07` · `id: math.statistics.hypothesis-testing-confidence-power` · 34h · prerequisites: PS06 · registered bank: `ps-07-hypothesis-testing-confidence-power`

**Already covered:** Tests/p-values, confidence duality, exact binomial inference, mean tests, pairing/clustering, power/effect sizes, LRTs, Holm/BH, and selection pitfalls.

**Add or verify:** Maintain the implemented common format; equivalence/noninferiority with prespecified margins; null calibration of boundary tests and dependent-comparison qualifications.

**Existing artifacts:** [07-hypothesis-testing-confidence-power.md](07-hypothesis-testing-confidence-power.md); registered Python tasks: `binomial-test` → `exact_binomial_test`, `bh-fdr` → `benjamini_hochberg`. Registered figure: `ps-testing`; offline bank: `ps-07-hypothesis-testing-confidence-power`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive test/interval duality and power in a tractable model; separate FWER/FDR and model assumptions behind each procedure.

**Interactive experiment:** Proposed ps-testing: vary effect, sample size, and number of comparisons; show significance without practical importance and invalid peeking.

**Implementation ladder:** Retain exact_binomial_test and benjamini_hochberg; add power_curve_exact and local equivalence-test checks.

**RE gate:** Choose an analysis matching paired/clustered data and report effect size with uncertainty.

**RS gate:** Explain the null family and dependence assumptions under which a multiplicity correction controls its target.


**Module 08 — Resampling, sequential inference, and experimental design**

`handle: PS08` · `id: math.statistics.resampling-sequential-experimental-design` · 36h · prerequisites: PS07 · registered bank: `ps-08-resampling-sequential-experimental-design`

**Already covered:** Bootstrap/permutation variants, resampling units, failure modes, e-processes/confidence sequences, randomization, blocking, factorial designs, and interference.

**Add or verify:** Maintain the implemented common format; stronger studentized/cluster examples and explicit optional-stopping conditions; full martingale proofs belong to PS22.

**Existing artifacts:** [08-resampling-sequential-experimental-design.md](08-resampling-sequential-experimental-design.md); registered Python tasks: `bootstrap` → `bootstrap_mean_interval`, `permutation` → `paired_permutation_test`, `e-process` → `bernoulli_e_process`. Registered figure: `ps-design`; offline bank: `ps-08-resampling-sequential-experimental-design`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive exact randomization/permutation validity under the assignment/exchangeability model; construct a finite e-process and state its conditional null requirement.

**Interactive experiment:** Proposed ps-design: vary clusters, stopping policy, and treatment assignment; show row-bootstrap undercoverage and fixed-sample peeking inflation.

**Implementation ladder:** Retain bootstrap_mean_interval, paired_permutation_test, and bernoulli_e_process; extend checks for valid stopping and exchangeability violations.

**RE gate:** Match resampling to assignment/sampling units and retain failed or stopped experiments.

**RS gate:** Distinguish randomization inference, sampling inference, and a sequential guarantee under its actual null.


**Module 09 — Bayesian models, posterior checks, and computation**

`handle: PS09` · `id: math.statistics.bayesian-modeling-computation` · 44h · prerequisites: PS08, PS04 · registered bank: `ps-09-bayesian-modeling-computation`

**Already covered:** Priors, conjugacy, posterior prediction, sensitivity, hierarchies, importance sampling, chain stationary/limiting behavior, MH, diagnostics, and HMC/VI overview.

**Add or verify:** Maintain the implemented common format; multi-chain diagnostics and simulation-based calibration as local work; full HMC/SMC in PS25, not a claim they are already implemented.

**Existing artifacts:** [09-bayesian-modeling-computation.md](09-bayesian-modeling-computation.md); registered Python tasks: `beta-update` → `beta_bernoulli_update`, `importance` → `self_normalized_importance`, `metropolis` → `random_walk_metropolis`. Registered figure: `ps-posterior`; offline bank: `ps-09-bayesian-modeling-computation`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive posterior/predictive quantities and MH acceptance; separate stationary distribution, exploration, Monte Carlo precision, and model adequacy.

**Interactive experiment:** Proposed ps-posterior: vary prior, likelihood, and proposal; reveal multimodal trapping and apparently stable single-chain summaries.

**Implementation ladder:** Retain beta_bernoulli_update, self_normalized_importance, and random_walk_metropolis; add local rank/ESS and predictive checks.

**RE gate:** Report weight/chain diagnostics and Monte Carlo error without claiming they prove correct inference.

**RS gate:** Explain how prior sensitivity and model misspecification differ from computational error.


**Module 10 — Sampling design and rigorous ML evaluation**

`handle: PS10` · `id: math.statistics.sampling-design-ml-evaluation` · 42h · prerequisites: PS09 · registered bank: `ps-10-sampling-design-ml-evaluation`

**Already covered:** Frames/estimands, finite-population corrections, strata/clusters/weights, nonresponse, simulation variance reduction, adaptive sampling, seeds, contamination, and shift.

**Add or verify:** Maintain the implemented common format; crossed task/seed uncertainty examples, judge-error sensitivity, and a fully replayable evaluation protocol; adaptive collection deepens in PS27.

**Existing artifacts:** [10-sampling-design-ml-evaluation.md](10-sampling-design-ml-evaluation.md); registered Python tasks: `stratified` → `stratified_mean_standard_error`, `horvitz-thompson` → `horvitz_thompson`, `rejection` → `rejection_sample`. Registered figure: `ps-sampling`; offline bank: `ps-10-sampling-design-ml-evaluation`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive Horvitz–Thompson and stratified estimators under known designs; make every random axis and target population explicit.

**Interactive experiment:** Proposed ps-evaluation: vary domain mixture, sampling inclusion, and cluster structure; show a ranking reversal from aggregation alone.

**Implementation ladder:** Retain stratified_mean_standard_error, horvitz_thompson, and rejection_sample; add local evaluation manifests and crossed-resampling cases.

**RE gate:** Reproduce an evaluation with inclusion probabilities, all failures, and correct uncertainty units.

**RS gate:** Explain which generalization the interval covers and why seed variation alone does not cover task/population uncertainty.


**Module 11 — Exponential families, regression, GLMs, and pooling**

`handle: PS11` · `id: math.statistics.exponential-families-regression-glms` · 50h · prerequisites: PS10, LA03, OPT02 · registered bank: `ps-11-exponential-families-regression-glms`

**Already covered:** Sufficiency, exponential-family geometry, OLS uncertainty, ANOVA, sandwich/GLS, logistic/Poisson/Bradley–Terry, IRLS, and partial pooling.

**Add or verify:** Maintain the implemented common format; explicit separation/weak overlap cases, cluster-robust uncertainty, and a connected-comparison-graph check for preferences.

**Existing artifacts:** [11-exponential-families-regression-glms.md](11-exponential-families-regression-glms.md); registered Python tasks: `simple-ols` → `simple_ols`, `logistic-gradient` → `logistic_loss_gradient`, `partial-pooling` → `partial_pooling_means`. Registered figure: `ps-glm`; offline bank: `ps-11-exponential-families-regression-glms`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive log-partition moments, GLM score/IRLS, and normal-normal pooling; separate model-based, heteroskedastic, and cluster uncertainty assumptions.

**Interactive experiment:** Proposed ps-glm: change design correlation, group size, and preference graph; expose coefficient nonidentifiability and complete separation.

**Implementation ladder:** Retain simple_ols, logistic_loss_gradient, and partial_pooling_means; add local IRLS and preference-graph diagnostics.

**RE gate:** Validate gradients and uncertainty using analytic or simulated controls and detect disconnected comparisons.

**RS gate:** Distinguish conditional regression coefficients from causal effects and state what the hierarchy assumes.


### Part III · Modern statistical tools

*Thesis: high dimension, latent structure, and evaluation need distinct assumptions and diagnostics.*

**Module 12 — High-dimensional probability and random geometry**

`handle: PS12` · `id: math.probability.high-dimensional` · 30h · prerequisites: PS05, LA08 · registered bank: `ps-12-high-dimensional`

**Already covered:** Norm/angle concentration, thin shells, JL, sample-covariance spectra, attention/initialization scale, and projection-distortion lab.

**Add or verify:** Maintain the implemented common format; qualify finite-probability versus almost-sure wording in the JL discussion, dimension-bound constants, covariance-null assumptions, and eigenvector stability.

**Existing artifacts:** [12-high-dimensional-probability.md](12-high-dimensional-probability.md); registered Python tasks: `projection` → `projection_distortion`. Registered figure: `ps-highdim`; offline bank: `ps-12-high-dimensional`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive Gaussian norm/dot-product moments and a qualified JL bound; state aspect ratio, normalization, and distribution assumptions for spectral nulls.

**Interactive experiment:** Proposed ps-highdim: vary dimension, sample size, and tail/correlation structure; compare concentration with a violating heavy-tailed distribution.

**Implementation ladder:** Retain projection_distortion; add norm_concentration_audit and covariance_null_simulation on small inputs.

**RE gate:** Report distortion, randomness, aspect ratio, and matrix normalization together.

**RS gate:** Explain why expectation preservation is not a high-probability guarantee and why a finite failure bound is not probability one.


**Module 13 — Calibration, proper scores, and conformal prediction**

`handle: PS13` · `id: math.statistics.calibration-scoring-conformal` · 32h · prerequisites: PS07, PS08, PS02 · registered bank: `ps-13-calibration-scoring-conformal`

**Already covered:** Reliability/ECE, proper Brier/log scores, decomposition, recalibration, prior shift, split conformal, and threshold/ECE labs.

**Add or verify:** Completed common format and claim corrections; continue deeper verification of binning versus finite-sample ECE bias, conditional versus marginal validity, dependence counterexamples, and ambiguous score-impossibility exercise.

**Existing artifacts:** [13-calibration-scoring-conformal.md](13-calibration-scoring-conformal.md); registered Python tasks: `calibration` → `expected_calibration_error`, `conformal` → `conformal_threshold`. Registered figure: `ps-calibration`; offline bank: `ps-13-calibration-scoring-conformal`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Prove properness and finite-sample split-conformal rank coverage under exchangeability; distinguish a binned target from population calibration error.

**Interactive experiment:** Proposed ps-calibration: change bins, sample size, and group dependence; show opposing bias components and failure of unsupported conditional coverage.

**Implementation ladder:** Retain expected_calibration_error and conformal_threshold; add conformal_coverage_audit including finite-sample quantile edge cases.

**RE gate:** Evaluate coverage and set size on independent calibration/test data with a declared deployment unit.

**RS gate:** State exactly what exchangeability guarantees and explain why dependence alone fixes neither the direction of error nor a universal repair.


**Module 14 — Latent variables, ELBO, and gradient estimators**

`handle: PS14` · `id: math.probability.latent-variables-elbo-gradient-estimators` · 36h · prerequisites: PS09, PS03, OPT02 · registered bank: `ps-14-latent-variables-elbo-gradient-estimators`

**Already covered:** ELBO derivations, amortization, score-function/pathwise gradients, an exact variance comparison, Gumbel-max/relaxation, and Gaussian ELBO lab.

**Add or verify:** Maintain the implemented common format; explicit differentiation-under-integral conditions, baseline/stop-gradient checks, finite discrete oracles, and biased-relaxation comparisons.

**Existing artifacts:** [14-latent-variables-elbo-gradient-estimators.md](14-latent-variables-elbo-gradient-estimators.md); registered Python tasks: `elbo-terms` → `gaussian_elbo_terms`, `gumbel` → `gumbel_max_sample`. Registered figure: `ps-gradient`; offline bank: `ps-14-latent-variables-elbo-gradient-estimators`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive ELBO/KL gap and both gradient identities with support/regularity conditions; separate estimator variance, approximation bias, and optimization error.

**Interactive experiment:** Proposed ps-gradient: vary latent noise, baseline, and relaxation temperature; compare exact gradients with biased/unstable estimates.

**Implementation ladder:** Retain gaussian_elbo_terms and gumbel_max_sample; add finite_latent_gradient_oracle.

**RE gate:** Verify an estimator on an exactly enumerable model before relying on neural loss curves.

**RS gate:** Explain when pathwise gradients are valid and why a low-variance straight-through estimator can remain biased.


**Module 15 — Score matching, diffusion, and generative sampling**

`handle: PS15` · `id: math.probability.score-matching-diffusion-sampling` · 36h · prerequisites: PS14, PS04 · registered bank: `ps-15-score-matching-diffusion-sampling`

**Already covered:** Score/normalizer identity, Hyvärinen/denoising arguments, Gaussian forward chain, diffusion ELBO, sampler/guidance overview, and decoding surgery.

**Add or verify:** Maintain the implemented common format; boundary assumptions in integration by parts, explicit reverse-time conventions, analytic score/sampler checks; rigorous SDE work belongs to PS24.

**Existing artifacts:** [15-score-matching-diffusion-sampling.md](15-score-matching-diffusion-sampling.md); registered Python tasks: `decoding` → `decode_distribution`, `diffusion` → `forward_diffusion_coefficients`. Registered figure: `ps-score`; offline bank: `ps-15-score-matching-diffusion-sampling`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive denoising targets and forward Gaussian coefficients; distinguish data, smoothed, learned, and guidance-modified scores.

**Interactive experiment:** Proposed ps-score: vary noise, sampler step, and guidance; compare a known mixture score with sampled output and reveal discretization bias.

**Implementation ladder:** Retain decode_distribution and forward_diffusion_coefficients; add gaussian_score_check and a local analytic-target sampler.

**RE gate:** Account separately for score error, finite sampling, solver error, and guidance-induced target changes.

**RS gate:** State the boundary/regularity assumptions behind score matching and avoid claiming arbitrary guidance preserves the data law.


**Module 16 — Causal inference and missing data**

`handle: PS16` · `id: math.statistics.causal-inference-missing-data` · 48h · prerequisites: PS11, PS10 · registered bank: `ps-16-causal-inference-missing-data`

**Already covered:** Potential outcomes, DAGs/d-separation, adjustment/IPW/AIPW, instruments/weak instruments, DiD/RD, sensitivity, missingness, and Rubin pooling.

**Add or verify:** Maintain the implemented common format; executable cross-fitted AIPW and imputation studies, nuisance-rate qualifications, and better distinction between diagnostics and identification.

**Existing artifacts:** [16-causal-inference-missing-data.md](16-causal-inference-missing-data.md); registered Python tasks: `backdoor` → `backdoor_adjustment`, `ipw` → `ipw_ate`, `iv-wald` → `wald_iv_estimate`. Registered figure: `ps-causal`; offline bank: `ps-16-causal-inference-missing-data`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive adjustment/IPW and the double-robust bias identity; state consistency, positivity, exchangeability, and the distinct assumptions behind IV/DiD.

**Interactive experiment:** Proposed ps-causal: alter assignment and missingness mechanisms; show collider adjustment, weak overlap, and interval precision without identification.

**Implementation ladder:** Retain backdoor_adjustment, ipw_ate, and wald_iv_estimate; add local cross-fitting and imputation coverage studies.

**RE gate:** Diagnose positivity/weak-identification failures and report the actual identified population.

**RS gate:** Separate double-robust consistency from root-n inference; cross-fitting alone is not a guarantee without rate/moment conditions.


**Module 17 — Mixtures, EM, and graphical models**

`handle: PS17` · `id: math.probability.mixtures-em-graphical-models` · 44h · prerequisites: PS14, PS16, PS04 · registered bank: `ps-17-mixtures-em-graphical-models`

**Already covered:** Mixture responsibilities/EM, singularities, label switching/identifiability, model selection, exact graphical inference, junction trees, and HMMs.

**Add or verify:** Maintain the implemented common format; executable backward/smoothing and variable-elimination tasks, missing-information examples, and singular-model selection qualifications.

**Existing artifacts:** [17-mixtures-em-graphical-models.md](17-mixtures-em-graphical-models.md); registered Python tasks: `em-step` → `em_step_gaussian_mixture`, `hmm-forward` → `hmm_forward`, `d-separation` → `d_separated`. Registered figure: `ps-latent`; offline bank: `ps-17-mixtures-em-graphical-models`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive EM monotonicity and Gaussian updates; derive sum-product/forward-backward and explain graph-width cost.

**Interactive experiment:** Proposed ps-latent: vary component variance, labels, and graph edges; show unbounded likelihood and exact inference becoming expensive.

**Implementation ladder:** Retain em_step_gaussian_mixture, hmm_forward, and d_separated; add local smoothing and elimination oracles.

**RE gate:** Track objective/normalization and reject collapsed components while preserving the documented algorithm.

**RS gate:** Explain why monotone likelihood is neither global optimality nor evidence of identifiable latent causes.


**Module 18 — Order statistics, empirical processes, and nonparametrics**

`handle: PS18` · `id: math.statistics.order-statistics-empirical-processes` · 44h · prerequisites: PS08, PS11 · registered bank: `ps-18-order-statistics-empirical-processes`

**Already covered:** Quantiles/extremes, GC/DKW, empirical-process overview, rank/U-statistic tests, KDE/regression, and Rao–Blackwellization.

**Add or verify:** Maintain the implemented common format; exact quantile/tie cases, dependent-data counterexamples, and qualified block-resampling repairs; rare-tail modeling expands in PS28.

**Existing artifacts:** [18-order-statistics-empirical-processes-nonparametrics.md](18-order-statistics-empirical-processes-nonparametrics.md); registered Python tasks: `dkw-band` → `ecdf_dkw_band`, `mann-whitney` → `mann_whitney_u`, `kde` → `gaussian_kde`. Registered figure: `ps-empirical`; offline bank: `ps-18-order-statistics-empirical-processes`; six checkpoint tasks K1–K6. The proposed experiment below is a broader expansion of this current view.

**Spine and derivations:** Derive order-statistic distributions, uniform bands and selected rank/U-statistic properties; distinguish pointwise and simultaneous inference.

**Interactive experiment:** Proposed ps-empirical: vary sample size, ties, dependence, and KDE bandwidth; show an iid DKW band failing on duplicated data.

**Implementation ladder:** Retain ecdf_dkw_band, mann_whitney_u, and gaussian_kde; add local quantile-interval and dependent-coverage experiments.

**RE gate:** Report a win-probability estimand correctly and handle ties/estimated-null parameters.

**RS gate:** Explain why blocking or thinning is not automatically a finite-sample distribution-free repair; state the added dependence assumptions.


### Part IV · Dependent processes

*Thesis: time order and information flow change both prediction and uncertainty.*

**Module 19 — Stochastic processes and Markov chains beyond MCMC**

`handle: PS19` · `id: math.probability.stochastic-processes-markov` · 32h · prerequisites: PS05, PS09, LA07 · proposed bank: `ps-19-stochastic-processes-markov`

**Already covered:** Stationary/limiting chain ideas exist in PS09 and HMMs in PS17; no general process unit.

**Add or verify:** A dedicated process sequence, finite-dimensional distributions, stationarity, transition powers, communicating classes, hitting times, and ergodic averages.

**Spine and derivations:** Derive Chapman–Kolmogorov, invariant laws, finite-state hitting-time equations, and an ergodic theorem with explicit irreducibility/aperiodicity qualifications.

**Interactive experiment:** Proposed ps-process: edit a finite transition graph; show periodic, reducible, absorbing, and slowly mixing cases with identical-looking short traces.

**Implementation ladder:** Implement transition_power, stationary_distribution_small, and hitting_time_solve with exact two-state controls.

**RE gate:** Distinguish stationary marginals from independent observations and diagnose inadequate run length.

**RS gate:** Prove a finite-state result and give a stationary chain that does not satisfy the intended time-average claim.


**Module 20 — Time series, dependence, and forecasting uncertainty**

`handle: PS20` · `id: math.probability.time-series-forecasting` · 36h · prerequisites: PS19, PS11, PS18 · proposed bank: `ps-20-time-series-forecasting`

**Already covered:** Autocorrelation/batch means are previewed; no dedicated time-series course.

**Add or verify:** Weak/strict stationarity, ACF/PACF, AR/MA/ARMA models, spectral intuition, HAC/block bootstrap conditions, and rolling-origin evaluation.

**Spine and derivations:** Derive AR(1) stationarity, autocovariance, long-run variance, and forecast mean/variance; separate trend, dependence, and changing distributions.

**Interactive experiment:** Proposed ps-timeseries: vary AR coefficient, drift, and horizon; show random splits leaking future information and near-unit-root intervals failing.

**Implementation ladder:** Implement simulate_arma, rolling_forecast, and long_run_variance_estimate with independent holdout periods.

**RE gate:** Evaluate forecasts with causal preprocessing and appropriate uncertainty across horizons.

**RS gate:** Explain why an estimated effective sample size cannot replace a full dependence assumption.


**Module 21 — Poisson, renewal, and queueing processes**

`handle: PS21` · `id: math.probability.poisson-renewal-queues` · 30h · prerequisites: PS19, PS01 · proposed bank: `ps-21-poisson-renewal-queues`

**Already covered:** Poisson/exponential marginal families exist in PS01; no process or queueing unit.

**Add or verify:** Independent/stationary increments, exponential interarrivals, renewal reward, inspection paradox, and finite-state queue models.

**Spine and derivations:** Derive Poisson/exponential equivalence, a qualified renewal-reward limit, and simple queue steady states; state stability and Little-law conditions.

**Interactive experiment:** Proposed ps-arrivals: vary arrival/service variability and load; expose bursty arrivals and an unstable queue with misleading short-run latency.

**Implementation ladder:** Implement poisson_arrivals, renewal_waiting_sample, and queue_event_simulator.

**RE gate:** Measure queue/latency behavior with units, warmup, and censoring disclosed; do not equate simulation with production performance.

**RS gate:** Explain why exponential marginals alone do not establish a Poisson process and when a steady-state claim is invalid.


**Module 22 — Martingales, stopping times, and sequential concentration**

`handle: PS22` · `id: math.probability.martingales-stopping` · 36h · prerequisites: PS23, PS08, PS19 · proposed bank: `ps-22-martingales-stopping`

**Already covered:** E-process/confidence-sequence construction exists in PS08; full information-flow and stopping theory does not.

**Add or verify:** Filtrations, martingale differences, supermartingales, stopping times, optional-stopping conditions, Ville/Azuma-style bounds, and adaptive confidence sequences.

**Spine and derivations:** Derive a bounded-increment exponential supermartingale and Ville's inequality; distinguish a valid stopping time from future-dependent selection.

**Interactive experiment:** Proposed ps-stopping: choose stopping rules while observing a path; compare valid anytime bounds with an inadmissible hindsight rule.

**Implementation ladder:** Implement stopped_process, sequential_boundary, and optional_stopping_counterexample.

**RE gate:** Audit predictable choices and conditional null assumptions in an online test.

**RS gate:** Prove a qualified stopping/concentration result and explain why optional stopping is not unconditional equality at arbitrary times.


### Part V · Research extensions

*Thesis: formal probability, computational approximations, and robust inference clarify the limits of convenient formulas.*

**Module 23 — Measure-based probability and conditional expectation**

`handle: PS23` · `id: math.probability.measure-conditional-expectation` · 36h · prerequisites: PS05, PS02, OPT01 · proposed bank: `ps-23-measure-conditional-expectation`

**Already covered:** Finite and density calculations exist; no systematic measure-theoretic bridge.

**Add or verify:** Sigma-algebras/measurability, measures/integration, null sets, convergence modes, MCT/DCT/Fatou, Radon–Nikodym interpretation, and conditional expectation as projection.

**Spine and derivations:** Develop finite examples first, then state/prove selected convergence results with assumptions; derive tower properties and the L2 projection characterization.

**Interactive experiment:** Proposed ps-measure: refine a finite partition and change information; show conditional averages and a failure of exchanging limit and expectation.

**Implementation ladder:** Implement partition_conditional_expectation, tower_check, and nonuniform_integrability_counterexample.

**RE gate:** Identify a code path that implicitly interchanges a limit, derivative, or expectation and document justification.

**RS gate:** State almost-sure equality and integrability precisely; give a counterexample when domination/uniform-integrability conditions are absent.


**Module 24 — Brownian motion, stochastic calculus, and diffusion limits**

`handle: PS24` · `id: math.probability.brownian-sdes-diffusion` · 40h · prerequisites: PS22, OPT02, PS15 · proposed bank: `ps-24-brownian-sdes-diffusion`

**Already covered:** Discrete Gaussian diffusion and reverse-sampler overview exist; no stochastic-calculus development.

**Add or verify:** Brownian increments/quadratic variation, Itô integral/isometry, Itô formula, linear SDEs, Fokker–Planck/reversal assumptions, and discretization orders.

**Spine and derivations:** Derive an Ornstein–Uhlenbeck solution and Itô correction; compare forward/backward time conventions and strong versus weak approximation.

**Interactive experiment:** Proposed ps-sde: vary step size and noise using coupled Brownian paths; show the missing Itô correction and sampler bias.

**Implementation ladder:** Implement brownian_path, euler_maruyama, and ou_exact_step; test moments and coupled path errors.

**RE gate:** Validate a stochastic solver against a known transition law and report the target error criterion.

**RS gate:** Explain the assumptions behind reverse-time dynamics and why ordinary calculus cannot be substituted for Itô calculus.


**Module 25 — Advanced Monte Carlo, HMC, and sequential inference**

`handle: PS25` · `id: math.probability.advanced-monte-carlo` · 38h · prerequisites: PS19, PS17, OPT02 · proposed bank: `ps-25-advanced-monte-carlo`

**Already covered:** Importance sampling/MH are implemented and HMC is previewed; no full HMC/SMC workflow.

**Add or verify:** Hamiltonian proposals/Metropolis correction, adaptation boundaries, sequential importance sampling/resampling, particle filtering, and simulation-based calibration.

**Spine and derivations:** Derive leapfrog's role in HMC and particle weight recursions; separate proposal integration error, finite-particle error, degeneracy, and model error.

**Interactive experiment:** Proposed ps-computation: vary HMC step/mass or particle count; reveal multimodal trapping and particle impoverishment despite large nominal sample counts.

**Implementation ladder:** Implement leapfrog_step, bootstrap_particle_filter, and calibration_rank_experiment against tractable targets.

**RE gate:** Compare HMC/SMC estimates with exact Gaussian or finite-state oracles and report computation/diagnostics.

**RS gate:** Explain which adaptation or resampling assumptions preserve validity and why favorable diagnostics are not a proof of correctness.


**Module 26 — Robust estimation and semiparametric inference**

`handle: PS26` · `id: math.statistics.robust-semiparametric-inference` · 38h · prerequisites: PS16, PS18, PS23, OPT03 · proposed bank: `ps-26-robust-semiparametric-inference`

**Already covered:** Heavy-tail summaries, sandwich errors, and doubly robust ideas exist; no unified robust/influence-function development.

**Add or verify:** M-estimation, influence functions, contamination and breakdown, orthogonal scores, cross-fitting, nuisance-product rates, and robust confidence analysis.

**Spine and derivations:** Derive an M-estimator sandwich and the AIPW influence function in a specified model; distinguish robustness to outliers from robustness to nuisance misspecification.

**Interactive experiment:** Proposed ps-robust: vary contamination, leverage, overlap, and nuisance error; compare point bias and interval coverage separately.

**Implementation ladder:** Implement huber_location, crossfit_aipw, and influence_variance with synthetic truth and controlled nuisance models.

**RE gate:** Detect unstable influence values and validate uncertainty under the declared data design.

**RS gate:** State the rate, overlap, and moment assumptions for root-n inference and give a failed-rate counterexample.


**Module 27 — Adaptive evaluation, selection, and changing data collection**

`handle: PS27` · `id: math.statistics.adaptive-evaluation-inference` · 34h · prerequisites: PS22, PS26, PS13, PS10 · proposed bank: `ps-27-adaptive-evaluation-inference`

**Already covered:** Peeking, active selection, multiplicity, and benchmark reuse are discussed; no integrated adaptive-evaluation unit.

**Add or verify:** Predictable inclusion policies, adaptive estimands, sequential weighting, reusable-test-set limitations, selective-inference examples, and judge/label uncertainty.

**Spine and derivations:** Derive a finite adaptive-sampling estimator under known propensities and a valid sequential test; distinguish fresh evaluation from selection on reused outcomes.

**Interactive experiment:** Proposed ps-adaptive: choose tasks using past scores and stop on apparent success; show biased naive means and a valid qualified alternative.

**Implementation ladder:** Implement logged_sampling_policy, adaptive_weighted_estimate, and selection_audit with an exact finite simulator.

**RE gate:** Reconstruct inclusion probabilities, policy versions, stopping decisions, and every evaluation failure.

**RS gate:** Explain which assumptions yield valid inference and why a final correction cannot recover unlogged selection probabilities.


**Module 28 — Censoring, survival, extremes, and rare-event estimation**

`handle: PS28` · `id: math.statistics.survival-rare-events` · 32h · prerequisites: PS21, PS18, PS10 · proposed bank: `ps-28-survival-rare-events`

**Already covered:** Order-statistic extremes and importance sampling exist; no survival/censoring or rare-event design lesson.

**Add or verify:** Survival/hazard, right censoring/truncation, Kaplan–Meier under independent censoring, restricted mean time, rare-event sampling, and extreme-value assumptions.

**Spine and derivations:** Derive product-limit estimation and an importance-weighted tail estimator; distinguish zero observed failures from zero risk and model-based tail extrapolation.

**Interactive experiment:** Proposed ps-tails: vary timeout and failure rarity; show downward-biased observed latency and apparently good tail fits beyond observed support.

**Implementation ladder:** Implement kaplan_meier, restricted_mean_time, and rare_event_importance with analytic controls.

**RE gate:** Handle timeouts without dropping them and quantify the precision of a rare-failure estimate.

**RS gate:** State censoring and tail assumptions and explain when the desired latency/risk estimand is unidentified.


### Part VI · Research synthesis

*Thesis: a statistical audit must make every uncertainty and identification claim reproducible.*

**Module 29 — Capstone: a statistical audit of an AI research claim**

`handle: PS29` · `id: math.statistics.capstone-statistical-audit` · 44h · prerequisites: PS10, PS13, PS20, PS27, PS28, RP04 · proposed bank: `ps-29-capstone-statistical-audit`

**Already covered:** No integrated track capstone; individual lessons contain evaluation workflows.

**Add or verify:** One end-to-end report with exact synthetic control, real or realistic benchmark, dependence/selection audit, and reproducible uncertainty.

**Spine and derivations:** No new theory: define estimand, sampling/assignment, metric/selection, inferential method, sensitivity, and a falsifiable improvement claim.

**Interactive experiment:** Proposed ps-audit: switch sampling unit, missingness policy, and selection history; show which reported improvements survive the justified analyses.

**Implementation ladder:** Deliver simulation_oracle, evaluation_analysis, and reproduce_report with immutable raw observations and all failure records.

**RE gate:** Regenerate estimates/intervals from logged data and diagnose an injected sampling, censoring, or weighting defect.

**RS gate:** Defend identification and coverage assumptions, report ambiguity honestly, and propose the next discriminating experiment.

## 5. Write order and milestones

**Common format update completed.** PS00–PS18 retain their existing teaching and runnable tasks, now supplemented with static hints, answer banks, prediction experiments and six-part checkpoints. The priority claim repairs below are implemented. Continue with the deeper lesson-specific extensions and implementation ladders listed in the briefs, then author new modules in the dependency order below.

**Foundation/inference route:** PS00 → PS01 → PS02, with the calculus bridge before continuous-distribution manipulations; PS03 follows multivariable derivatives and determinant volume, PS04 follows symmetric geometry. PS05–PS08 develop inference; PS09–PS11 add computation, design, and GLMs. Authored front matter now includes the available prerequisite lessons; the local calculus bridge covers the specific multivariable tools used before OPT02 is written.

**Existing advanced branches:** PS12 follows concentration/SVD; PS13 follows conditional expectation and exchangeability; PS14 → PS15 follows Bayesian computation and transformations. PS16 → PS17 retains the current causal/graphical route, strengthened with the Gaussian bridge. PS18 adds PS11 because its Rao–Blackwell/sufficiency discussion uses that material; a shorter standalone rank-test route can be designed later with an explicit diagnostic.

**New process branch:** PS19 → PS20 and PS21. PS23 is the formal-probability bridge and deliberately appears before PS22 in write order: PS23 → PS22 → PS24. Numbers reserve stable files, not a mandatory linear reading order. PS25 is the computational branch after PS19 and the authored latent-model sequence.

**New inference branch:** PS26 after causal/nonparametric/formal basics, then PS27 after martingales and calibration. PS28 follows event processes, order statistics, and sampling design. PS29 integrates evaluation, dependence, adaptive inference, and censored/tail outcomes. PS24–PS25 are specialist generative/inference electives and are not required by the evaluation capstone.

**RE milestones:** finite/simulation correctness after PS00–PS05; valid evaluation after PS06–PS13; dependent-data monitoring after PS19–PS22; adaptive/censored evaluation after PS26–PS28. **RS milestones:** reconstruct inference assumptions before using confidence statements; add PS23 for rigorous limit/conditioning arguments, PS24 for diffusion theory, PS25 for computational inference, or PS26 for semiparametric research. Begin a focused report before completing every specialist branch.

## 6. Capstone and assessment

Audit a specific AI claim such as a benchmark gain, calibrated abstention policy, or lower tail latency. Use a synthetic setting with known truth and one realistic evaluation dataset. Include the target population, unit of analysis, pairing/clustering, seeds, missing/censored cases, adaptive selection/stopping, calibration, compute, and all tried analyses. Compare at least one naive analysis with a justified correction and report cases where the data cannot identify the desired quantity. A small generative/inference study from PS24/PS25 is a separate specialization project. Reuse the final report for RP12 rather than counting it twice.

Every unit uses six checkpoint tasks: explain the central concept; derive a result with assumptions; calculate a small case; implement or debug; critique misleading evidence; and defend an unfamiliar extension. Repair critical conceptual or correctness failures before advancing. A proof is assessed against a rubric, a numerical answer against an independent oracle, and an empirical claim against its design and uncertainty. Separate theoretical mastery, browser exercises, and local research implementation in progress records.

## 7. Infrastructure and validation

All 37 current browser Python task IDs remain registered under their existing lesson paths. PS00–PS18 now have 19 dedicated figures in `public/theory/labs/ps-workbenches.js`, 19 `ps-NN-...` answer banks with 416 entries, and 909 offline practice hints. The figures reuse LA chartkit. `scripts/check-probability.mjs`, included by `scripts/check-theory.mjs`, checks analytic oracles, control boundaries, bank/exercise alignment, checkpoint coverage, hints and authored prerequisite resolution. More elaborate sampling/coverage charts, process timelines and Markov graphs remain future work.

Python in the browser is standard-library-only; local NumPy/PyTorch experiments and any accelerator measurements must be labeled separately. Register a lesson's stubs, reference functions, checks, browser entries, figures, and answer bank together. Verify numeric answers by execution and proofs by an explicit argument. Tests include invalid inputs, degeneracies, input preservation, and stated tolerance behavior.

For authored changes, run `node scripts/build-theory.mjs`, `node scripts/check-theory.mjs`, and `python3 -m labs.checks --reference`. Inspect the reader in both themes, exercise the failure preset, and complete one typed and one written answer. For plan changes, validate links, unique IDs, prerequisite resolution and cycles, existing-artifact claims, and exclusion of plans from the lesson catalog. The current implementation has also passed a 27-lesson browser smoke check and all 67 browser Python reference payloads; the reader now contains 45 pages after the separate legacy-overview cleanup.

### Completed priority accuracy repairs

These corrections are implemented in the authored lessons and their migrated solutions. Retain them when extending the lessons; this is a targeted audit, not an independent certification of the entire curriculum.

- **PS12, JL wording:** replaced the implication from concentration to “almost surely” with an explicit success probability or existence statement. Keep square-norm versus norm distortion, constants, and finite-sample versus asymptotic covariance claims consistent.
- **PS13, ECE bias:** separate sampling noise relative to a fixed binned calibration target from information lost through binning relative to the population target. The unconditional “biased upward, always” statement has been removed. Use exact/simulated counterexamples and [Roelofs et al., calibration-estimation bias](https://proceedings.mlr.press/v151/roelofs22a.html) to delimit the claim.
- **PS13, dependent conformal examples:** broken exchangeability does not alone determine whether coverage goes up or down; grouping is a justified repair only under an explicitly suitable group-level design/guarantee. Keep marginal and conditional coverage distinct; use the assumptions in [Angelopoulos and Bates](https://arxiv.org/abs/2107.07511). The underspecified scoring-rule/base-rate impossibility exercise has been replaced with a precise binary weak-versus-strict propriety task.
- **PS16, cross-fitting:** qualify the connection between nuisance consistency, double robustness, and asymptotically valid intervals. Cross-fitting does not remove rate, overlap, or moment requirements. Use the conditions in [Double/debiased machine learning](https://arxiv.org/abs/1608.00060) for PS26's extension.
- **PS18, dependence repairs:** replaced blanket “block or thin” solution advice with a specified dependent-data model, block scheme, and justified approximation or theorem. Do not promise the original iid DKW guarantee after an arbitrary thinning operation.

The coverage audit records existing teaching, not an exhaustive mathematical review. New modules are justified by a distinct missing treatment: process/time-series theory (19–22), formal probability/stochastic calculus (23–24), advanced computation (25), robust/adaptive inference (26–27), censored/rare outcomes (28), and an integrated research audit (29). Existing EM, causal inference, GLMs, calibration, and nonparametrics remain owned by 00–18 rather than being reintroduced under new names.
