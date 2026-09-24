# Foundations — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Build the mathematical language, numerical judgment, and reproducible working habits needed to make later research claims precise. The RE route emphasizes debugging and experiment integrity; the RS route emphasizes assumptions, counterexamples, and measurement.

Two lessons exist: [mathematical language](00-mathematical-language.md) (`foundations.mathematical-language`) and [numerical stability](01-numerical-stability.md) (`foundations.numerical-stability`). F00 and F01 expand those pages in place; both retain their IDs. The diagnostic is an entry activity, not a new lesson masquerading as authored coverage.

**Legacy-page review:** Keep and expand F00/F01 in place. Their notation, proof-reading and numerical-stability material supplies live prerequisites throughout LA, probability and optimization. Short length is not evidence of redundancy. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 8 units; 134 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `F00` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `foundations.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own notation, scalar numerical reasoning, tooling, and the initial diagnostic. Linear algebra owns matrix conditioning; optimization owns calculus; Research Practice owns inference from full experiments.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| F00 | Mathematical language, functions, and proof | 12 | none |
| F01 | Floating point and scalar stability | 14 | F00 |
| F02 | Algebra, functions, logarithms, and scales | 16 | F00 |
| F03 | Limits, asymptotic notation, and approximation | 16 | F02 |
| F04 | Linux, Git, environments, and artifacts | 16 | F00 |
| F05 | Testing, debugging, and executable contracts | 18 | PY02, F04 |
| F06 | Measurement, resource estimates, and compute budgets | 18 | F01, PY05 |
| F07 | Capstone: reproduce and diagnose a numerical experiment | 24 | F03, F05, F06 |

## 4. Detailed module briefs

### Part I · Language and numbers

*Thesis: a precise statement and a stable calculation are the first research instruments.*

**Module 00 — Mathematical language, functions, and proof**

`handle: F00` · `id: foundations.mathematical-language` · 12h · prerequisites: none · proposed bank: `f-00-mathematical-language`

**Spine and derivations:** Sets, quantifiers, implications, functions and composition; sums and products; direct proof, contradiction, induction, and counterexamples. Translate a shape-indexed statement into explicit quantifiers.

**Interactive experiment:** `f-mathematical-language` — Change quantifier order over a finite relation; display witnesses and counterexamples, including an empty domain.

**Implementation ladder:** Implement finite_relation_check, compose_functions, and induction_case_audit on small domains.

**RE gate:** Explain an off-by-one or shape contract with exact domains and a counterexample.

**RS gate:** Distinguish a finite check from a proof; repair an invalid exchange of quantifiers.

**Module 01 — Floating point and scalar stability**

`handle: F01` · `id: foundations.numerical-stability` · 14h · prerequisites: F00 · proposed bank: `f-01-numerical-stability`

**Spine and derivations:** Representable numbers, rounding, absolute versus relative error, cancellation, overflow and underflow; derive stable log-sum-exp and Welford updates.

**Interactive experiment:** `f-numerical-stability` — Vary exponent range and summation order; compare exact rational and rounded answers, including a near-zero denominator.

**Implementation ladder:** Implement stable_logsumexp, compensated_sum, and streaming_moments with finite-value contracts.

**RE gate:** Localize a NaN to its first invalid operation and repair it without hiding the input defect.

**RS gate:** Separate conditioning of a scalar problem from stability of its algorithm using measured error.

**Module 02 — Algebra, functions, logarithms, and scales**

`handle: F02` · `id: foundations.algebra-functions-logarithms` · 16h · prerequisites: F00 · proposed bank: `f-02-algebra-functions-logarithms`

**Spine and derivations:** Inverse functions, powers, logarithm identities, geometric series, inequalities, and units; derive log-odds and exponential half-life before optimization uses them.

**Interactive experiment:** `f-algebra-functions-logarithms` — Drag probability and logit on linked linear/log axes; show saturation, endpoint divergence, and log-base changes.

**Implementation ladder:** Implement log_odds, geometric_sum, and unit_conversion with explicit domains.

**RE gate:** Audit a learning-rate or throughput calculation for unit and log-base mistakes.

**RS gate:** Prove a useful inequality and give a counterexample outside its stated domain.

**Module 03 — Limits, asymptotic notation, and approximation**

`handle: F03` · `id: foundations.limits-approximations` · 16h · prerequisites: F02 · proposed bank: `f-03-limits-approximations`

**Spine and derivations:** Sequences and limits, continuity, big-O/little-o, finite versus asymptotic statements; compare absolute and relative remainders without assuming calculus.

**Interactive experiment:** `f-limits-approximations` — Change sample size and hidden constants in two cost curves; expose late crossovers and nonuniform error.

**Implementation ladder:** Implement convergence_table, empirical_order, and remainder_ratio, reporting zero-denominator cases.

**RE gate:** Choose an approximation tolerance from a downstream error budget.

**RS gate:** Explain why finitely many numerical checks cannot establish asymptotic order.

### Part II · Reproducible work

*Thesis: a result includes the inputs, environment, and process that produced it.*

**Module 04 — Linux, Git, environments, and artifacts**

`handle: F04` · `id: foundations.linux-git-environments` · 16h · prerequisites: F00 · proposed bank: `f-04-linux-git-environments`

**Spine and derivations:** Processes, streams, exit codes, paths, shell quoting, commits, branches, dependency locks, and content hashes; distinguish source, configuration, data, and generated artifacts.

**Interactive experiment:** `f-linux-git-environments` — Replay a tiny build dependency graph while changing one input; show stale-cache and dirty-worktree cases.

**Implementation ladder:** Write a CLI with exit codes, a content-hash manifest, and a clean-checkout reproduction script.

**RE gate:** Reproduce an artifact from a clean checkout and diagnose a missing environment dependency.

**RS gate:** Specify which environmental differences could change the scientific interpretation.

**Module 05 — Testing, debugging, and executable contracts**

`handle: F05` · `id: foundations.testing-debugging-contracts` · 18h · prerequisites: PY02, F04 · proposed bank: `f-05-testing-debugging-contracts`

**Spine and derivations:** Example, property, and metamorphic tests; invariants and minimal reproductions; deterministic fixtures and oracle independence.

**Interactive experiment:** `f-testing-debugging-contracts` — Toggle injected aliasing, empty-input, and order-dependence bugs; observe which tests detect each defect.

**Implementation ladder:** Implement a randomized invariant test, a minimal failing fixture, and a structured error report.

**RE gate:** Fix an unfamiliar bug using a minimal reproduction and a regression check.

**RS gate:** Identify an oracle that repeats the implementation's mistake and replace it with an independent argument.

**Module 06 — Measurement, resource estimates, and compute budgets**

`handle: F06` · `id: foundations.measurement-compute-budgets` · 18h · prerequisites: F01, PY05 · proposed bank: `f-06-measurement-compute-budgets`

**Spine and derivations:** Wall time versus CPU time, throughput versus latency, warmup and timer overhead; dimensional estimates for operations, bytes, and storage.

**Interactive experiment:** `f-measurement-compute-budgets` — Change workload size, warmup, and overhead in a timing model; show misleading speedups on tiny inputs.

**Implementation ladder:** Implement repeated_timing, memory_budget, and break_even_size using supplied traces.

**RE gate:** Produce a bounded execution plan with time, memory, and stopping limits.

**RS gate:** Separate a hardware observation from a complexity claim and specify the next discriminating measurement.

**Module 07 — Capstone: reproduce and diagnose a numerical experiment**

`handle: F07` · `id: foundations.capstone-reproducible-experiment` · 24h · prerequisites: F03, F05, F06 · proposed bank: `f-07-capstone-reproducible-experiment`

**Spine and derivations:** No new theory: combine a stated numerical claim, exact small oracle, stable computation, reproducible environment, and uncertainty about measurements.

**Interactive experiment:** `f-capstone-reproducible-experiment` — Compare naive and stable moment estimators as offset grows; reveal where identical printed values conceal different errors.

**Implementation ladder:** Package the experiment CLI, result manifest, and verification report with one command per stage.

**RE gate:** A peer reruns the experiment and detects all planted numerical or environment failures.

**RS gate:** Defend which observations support the claim and where the experiment cannot establish generality.

## 5. Write order and milestones

Run a diagnostic on quantifiers, logs, rounding, command-line use, and debugging first. Write F00–F04; pair Python PY02 with F05, then PY05 with F06. F03 is the entry gate for calculus; F04–F05 are the entry gate for reliable local labs. F07 closes the track.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Produce a numerical-failure gallery and a clean-checkout experiment bundle. Include original and corrected implementations, exact small cases, raw measurements, environment manifest, and a two-page account of error sources. RE assessment prioritizes repair and replay; RS assessment prioritizes the scope of the claim.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Reuse chartkit for error curves; add a finite-relation grid and a scalar rounding widget when their lessons are authored. Keep shell exercises local and provide transcript fixtures for browser questions.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
