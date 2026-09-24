# Information, learning, and decision theory — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Connect coding and prediction to statistical generalization and action under uncertainty. The goal is to recognize what a bound or metric actually licenses, then choose a decision using the right loss and information.

The [entropy, generalization, and decisions overview](01-entropy-generalization-decisions.md) remains an orientation page. Detailed units reserve 02–15. Existing probability/statistics lessons supply the random-variable, inference, and calibration machinery.

**Legacy-page review:** Keep the overview: the finite-class ERM argument and prediction-to-cost decision rule are useful bridges linked from authored probability and optimization lessons. Fold its material into IL02/IL03/IL06/IL11, and migrate those inbound links when the successors exist. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 14 units; 418 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `IL02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `math.learning.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own information inequalities, learning guarantees, online regret, and decision theory. Probability owns estimation, confidence intervals, proper scoring-rule derivations, and conformal guarantees. Classical ML owns estimator implementations; NLP owns tokenizer measurements; Practical AI Systems owns operational routing.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| IL02 | Entropy, coding, and cross-entropy | 26 | PS02, F02 |
| IL03 | KL divergence, mutual information, and data processing | 28 | IL02, OPT03 |
| IL04 | Variational identities and information objectives | 28 | IL03, PS14 |
| IL05 | Minimum description length and rate–distortion | 28 | IL03, OPT03 |
| IL06 | PAC learning and uniform convergence | 32 | PS05, IL03 |
| IL07 | VC dimension and Rademacher complexity | 34 | IL06, LA03 |
| IL08 | Algorithmic stability, compression, and PAC-Bayes | 34 | IL07, PS09, OPT03 |
| IL09 | Online learning, experts, and regret | 30 | IL03, OPT03 |
| IL10 | Distribution shift and limits of guarantees | 28 | IL08, PS10, PS13 |
| IL11 | Bayesian decisions, costs, and abstention | 28 | PS09, PS13, IL03 |
| IL12 | Value of information and experimental choice | 28 | IL11, PS08 |
| IL13 | Robust and multi-objective decisions | 28 | IL11, OPT07 |
| IL14 | Auditing information and generalization claims | 26 | IL05, IL10, IL13 |
| IL15 | Capstone: a defensible prediction-to-decision system | 40 | IL12, IL14, RP04 |

## 4. Detailed module briefs

### Part I · Information

*Thesis: a probability model is also a code, but the units and assumptions matter.*

**Module 02 — Entropy, coding, and cross-entropy**

`handle: IL02` · `id: math.learning.entropy-coding` · 26h · prerequisites: PS02, F02 · proposed bank: `il-02-entropy-coding`

**Spine and derivations:** Self-information, entropy, conditional entropy, chain rules, prefix coding, Kraft inequality, and source-coding bounds; derive expected code length versus entropy.

**Interactive experiment:** `il-entropy-coding` — Change symbol frequencies and coding alphabet; show zero-probability model failure and finite-message overhead.

**Implementation ladder:** Implement entropy_bits, prefix_code_lengths, and cross_entropy with support checks.

**RE gate:** Compare compression or LM loss in consistent units with explicit token/byte denominators.

**RS gate:** Prove the entropy lower bound for prefix codes and identify the iid assumption in a coding experiment.

**Module 03 — KL divergence, mutual information, and data processing**

`handle: IL03` · `id: math.learning.divergences-information` · 28h · prerequisites: IL02, OPT03 · proposed bank: `il-03-divergences-information`

**Spine and derivations:** Gibbs inequality, KL asymmetry and support, mutual information as expected KL, chain rules, and data processing; separate differential entropy from invariant information.

**Interactive experiment:** `il-divergences-information` — Alter a noisy channel and a deterministic transformation; display MI loss and infinite KL under support mismatch.

**Implementation ladder:** Implement discrete_kl, joint_mutual_information, and channel_pushforward.

**RE gate:** Diagnose an invalid empirical MI estimate or mismatched distribution support.

**RS gate:** Prove data processing for a finite Markov chain and state its equality condition in that setting.

**Module 04 — Variational identities and information objectives**

`handle: IL04` · `id: math.learning.variational-information` · 28h · prerequisites: IL03, PS14 · proposed bank: `il-04-variational-information`

**Spine and derivations:** Jensen and variational KL identities, ELBO as a reused result, contrastive lower bounds and negative sampling assumptions; information estimates versus optimization surrogates.

**Interactive experiment:** `il-variational-information` — Change negative distribution and batch size; show a bound ceiling and a false MI interpretation.

**Implementation ladder:** Implement finite_variational_bound, contrastive_objective, and exact_joint_comparison.

**RE gate:** Verify a loss on a known finite distribution before using learned critics.

**RS gate:** Derive one bound with its sampling assumptions and explain why a better bound need not imply a better representation.

**Module 05 — Minimum description length and rate–distortion**

`handle: IL05` · `id: math.learning.mdl-rate-distortion` · 28h · prerequisites: IL03, OPT03 · proposed bank: `il-05-mdl-rate-distortion`

**Spine and derivations:** Two-part codes, model complexity, MDL, lossy coding, distortion measures, and rate–distortion Lagrangians; distinguish a coding argument from a Bayesian identity.

**Interactive experiment:** `il-mdl-rate-distortion` — Vary codebook size and distortion penalty; expose overfitting from ignoring model-description cost.

**Implementation ladder:** Implement two_part_code_cost, scalar_quantizer, and rate_distortion_curve.

**RE gate:** Report model-storage and payload costs in a compression comparison.

**RS gate:** Defend a distortion metric and show a case where low reconstruction error misses task utility.

### Part II · Learning guarantees

*Thesis: a theorem must name the sampling process, hypothesis class, and failure probability.*

**Module 06 — PAC learning and uniform convergence**

`handle: IL06` · `id: math.learning.pac-uniform-convergence` · 32h · prerequisites: PS05, IL03 · proposed bank: `il-06-pac-uniform-convergence`

**Spine and derivations:** Population versus empirical risk, union bounds, finite-class Hoeffding bounds, realizable versus agnostic learning, and train/test independence.

**Interactive experiment:** `il-pac-uniform-convergence` — Change hypothesis count and sample size; compare empirical overfitting with bound size and a reused-test-set failure.

**Implementation ladder:** Implement finite_class_erm, union_bound_budget, and empirical_generalization_gap.

**RE gate:** Keep selection and final evaluation separate in a hypothesis search.

**RS gate:** Derive a finite-class guarantee and explain every probability and quantifier in it.

**Module 07 — VC dimension and Rademacher complexity**

`handle: IL07` · `id: math.learning.vc-rademacher` · 34h · prerequisites: IL06, LA03 · proposed bank: `il-07-vc-rademacher`

**Spine and derivations:** Shattering, growth functions, VC bounds, symmetrization, empirical Rademacher complexity, and norm-constrained linear classes.

**Interactive experiment:** `il-vc-rademacher` — Move points and labels; compare shattering with poor random-label fit and vacuous high-capacity bounds.

**Implementation ladder:** Implement small_shattering_check, rademacher_simulation, and linear_class_bound.

**RE gate:** Estimate a complexity term without presenting a tiny enumeration as a general proof.

**RS gate:** Prove a shattering claim and a simple norm-based complexity bound with assumptions.

**Module 08 — Algorithmic stability, compression, and PAC-Bayes**

`handle: IL08` · `id: math.learning.stability-pac-bayes` · 34h · prerequisites: IL07, PS09, OPT03 · proposed bank: `il-08-stability-pac-bayes`

**Spine and derivations:** Uniform stability, replace-one arguments, compression bounds, PAC-Bayes with data-independent priors or explicit corrections, and vacuity checks.

**Interactive experiment:** `il-stability-pac-bayes` — Remove one observation or change the prior after seeing data; show sensitivity and an invalid certificate.

**Implementation ladder:** Implement replace_one_audit, kl_bernoulli_bound, and pac_bayes_objective on a finite class.

**RE gate:** Compute a bound with all constants and disclose when it exceeds the trivial risk limit.

**RS gate:** Explain why a data-dependent prior needs an additional argument and derive a simple stability result.

**Module 09 — Online learning, experts, and regret**

`handle: IL09` · `id: math.learning.online-learning-regret` · 30h · prerequisites: IL03, OPT03 · proposed bank: `il-09-online-learning-regret`

**Spine and derivations:** External regret, exponential weights, adversarial versus stochastic sequences, comparator classes, and online-to-batch conversion under stated assumptions.

**Interactive experiment:** `il-online-learning-regret` — Change loss sequences and learning rate; show adversarial switching and the difference between static and dynamic comparators.

**Implementation ladder:** Implement exponential_weights, regret_curve, and online_to_batch_average.

**RE gate:** Choose an appropriate comparator for a drifting workload and log complete losses.

**RS gate:** Derive a bounded-loss regret guarantee and state what conversion to statistical risk requires.

**Module 10 — Distribution shift and limits of guarantees**

`handle: IL10` · `id: math.learning.distribution-shift-limits` · 28h · prerequisites: IL08, PS10, PS13 · proposed bank: `il-10-distribution-shift-limits`

**Spine and derivations:** Covariate/label/concept shift, support overlap, importance weighting, effective sample size, selective prediction, and impossibility without assumptions.

**Interactive experiment:** `il-distribution-shift-limits` — Move test mass outside training support; show exploding weights and misleading average calibration.

**Implementation ladder:** Implement weighted_risk, effective_sample_size, and coverage_risk_curve.

**RE gate:** Detect unsupported extrapolation and produce slice-level errors with uncertainty.

**RS gate:** Construct two indistinguishable training distributions that imply different test risks.

### Part III · Decisions

*Thesis: the best prediction and the best action solve different optimization problems.*

**Module 11 — Bayesian decisions, costs, and abstention**

`handle: IL11` · `id: math.learning.bayesian-decisions` · 28h · prerequisites: PS09, PS13, IL03 · proposed bank: `il-11-bayesian-decisions`

**Spine and derivations:** Posterior expected loss, Bayes actions, asymmetric errors, rejection options, and decision thresholds; derive cost-sensitive binary thresholds.

**Interactive experiment:** `il-bayesian-decisions` — Change class prior, error costs, and abstention price; show a well-calibrated predictor with a bad fixed threshold.

**Implementation ladder:** Implement bayes_action, reject_thresholds, and policy_risk.

**RE gate:** Choose a threshold from declared costs and evaluate it without retuning on test outcomes.

**RS gate:** Derive the optimal action and explain how misspecified costs change the answer.

**Module 12 — Value of information and experimental choice**

`handle: IL12` · `id: math.learning.value-information-design` · 28h · prerequisites: IL11, PS08 · proposed bank: `il-12-value-information-design`

**Spine and derivations:** Expected value of perfect/sample information, posterior decision changes, sequential acquisition costs, and one-step versus multi-step planning.

**Interactive experiment:** `il-value-information-design` — Vary test cost and informativeness; expose a highly accurate test with zero decision value.

**Implementation ladder:** Implement finite_evpi, finite_evsi, and acquisition_policy.

**RE gate:** Select the next measurement by expected decision benefit and validate on a finite oracle.

**RS gate:** Prove nonnegativity of free perfect information and identify when a myopic policy is suboptimal.

**Module 13 — Robust and multi-objective decisions**

`handle: IL13` · `id: math.learning.robust-multiobjective-decisions` · 28h · prerequisites: IL11, OPT07 · proposed bank: `il-13-robust-multiobjective-decisions`

**Spine and derivations:** Minimax decisions, distributional uncertainty sets, constrained risk, Pareto frontiers, and sensitivity to utility weights.

**Interactive experiment:** `il-robust-multiobjective-decisions` — Move uncertainty radius and budget; display conservative decisions and an infeasible constraint set.

**Implementation ladder:** Implement finite_minimax, pareto_frontier, and constraint_violation_audit.

**RE gate:** Report the frontier and infeasible cases instead of hiding tradeoffs in one score.

**RS gate:** Justify the uncertainty set and show how changing it reverses a decision.

**Module 14 — Auditing information and generalization claims**

`handle: IL14` · `id: math.learning.information-learning-audit` · 26h · prerequisites: IL05, IL10, IL13 · proposed bank: `il-14-information-learning-audit`

**Spine and derivations:** Map empirical information, compression, flatness, and scaling claims to actual estimands; distinguish proof, bound, proxy, and measurement.

**Interactive experiment:** `il-information-learning-audit` — Toggle data leakage, codebook cost, or prior selection in a supplied claim; show which conclusion survives.

**Implementation ladder:** Implement claim_assumption_matrix, bound_sanity_check, and sensitivity_report.

**RE gate:** Reproduce one claimed numerical certificate and find its weakest operational assumption.

**RS gate:** Present a counterexample or a valid restricted theorem replacing an overstated claim.

**Module 15 — Capstone: a defensible prediction-to-decision system**

`handle: IL15` · `id: math.learning.capstone-decision-system` · 40h · prerequisites: IL12, IL14, RP04 · proposed bank: `il-15-capstone-decision-system`

**Spine and derivations:** No new theory: a prediction baseline, honest learning/evaluation assumptions, calibrated uncertainty, costs, abstention, and a justified acquisition policy.

**Interactive experiment:** `il-capstone-decision-system` — Compare accuracy-only and cost-aware decisions under prior shift and measurement cost changes.

**Implementation ladder:** Deliver exact finite oracles, a fitted policy, and a report with uncertainty and sensitivity curves.

**RE gate:** Build a reproducible decision pipeline that respects a declared resource constraint.

**RS gate:** Defend which guarantees apply and the observation that would falsify the deployment assumption.

## 5. Write order and milestones

Write IL02–IL03 first. IL04 needs the ELBO route; IL05 is a compression branch. The learning sequence IL06–IL08 requires only the listed probability background. IL09 can start after IL03 and convexity. The decision branch IL11–IL13 can proceed without VC theory. IL10 and IL14 reunite the branches; IL15 is the cumulative capstone.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Build a cost-sensitive selective predictor with optional measurement acquisition. Include a finite exact problem and a real dataset experiment. Report risk, coverage, resource cost, calibration, and sensitivity to prior/utility changes. The RS extension must prove one restricted guarantee and demonstrate a failure outside its assumptions.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Reuse probability distribution controls and chartkit. Add coding-tree, shattering, bound-vs-observation, and cost-frontier views. Browser labs use finite distributions and small hypothesis classes; learned information estimators are local extensions.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
