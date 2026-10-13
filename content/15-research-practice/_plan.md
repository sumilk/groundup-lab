# Research practice and RE/RS project defense — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Turn technical competence into reproducible and defensible research. Develop the ability to select a tractable question, reproduce a result, design a discriminating experiment, communicate limitations, and sustain an original investigation.

Research Practice already appears in [the curriculum catalog](../../lib/curriculum.ts), with paper reading, experiments, reproduction, extension, and defense. It has no authored content directory or lesson today. This new directory contains a plan only; units 01–12 are all proposed.

**Scope:** 12 units; 430 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `RP01` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `research.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own research workflow, claim decomposition, experimental planning, reproduction, communication, and role-specific defense. Probability owns statistical inference; subject tracks own technical theorems and implementations. RP04 is deliberately accessible early and does not depend on any subject capstone that itself requires RP04.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| RP01 | Paper reading and claim decomposition | 20 | F04, PY02 |
| RP02 | Literature maps and baseline selection | 24 | RP01, PS06 |
| RP03 | Research questions, estimands, and hypotheses | 24 | RP02, PS07 |
| RP04 | Experimental design, ablations, and compute budgets | 30 | RP03, PS08, PY11 |
| RP05 | Faithful paper reproduction | 50 | RP04, PT09 |
| RP06 | Diagnosing research discrepancies | 30 | RP05, PY14 |
| RP07 | Designing an original extension | 44 | RP06 |
| RP08 | Executing and revising a research agenda | 44 | RP07 |
| RP09 | Scientific writing and executable communication | 30 | RP08 |
| RP10 | Evaluation validity, safety research, and impact | 28 | RP04, PS10, PS16 |
| RP11 | RE/RS interviews and project defense | 36 | RP09, RP10, DS14 |
| RP12 | Capstone: reproduction plus original contribution | 70 | RP11 |

## 4. Detailed module briefs

### Part I · Questions and evidence

*Thesis: a research contribution begins as a claim that an experiment or proof could refute.*

**Module 01 — Paper reading and claim decomposition**

`handle: RP01` · `id: research.paper-reading-claims` · 20h · prerequisites: F04, PY02 · proposed bank: `rp-01-paper-reading-claims`

**Spine and derivations:** Separate problem, assumptions, method, evidence, scope, and novelty; trace equations to implementations and figures to raw measurements.

**Interactive experiment:** `rp-paper-reading-claims` — Reveal abstract, method, and appendix in stages; update which claims have direct support.

**Implementation ladder:** Implement a claim/evidence table, a symbol-to-code map, and a minimal reproduction checklist.

**RE gate:** Locate the code/data/config needed for one figure and identify missing artifacts.

**RS gate:** Restate the central claim with quantifiers and distinguish empirical evidence from theorem assumptions.

**Module 02 — Literature maps and baseline selection**

`handle: RP02` · `id: research.literature-baselines` · 24h · prerequisites: RP01, PS06 · proposed bank: `rp-02-literature-baselines`

**Spine and derivations:** Primary versus secondary evidence, citation trails, competing hypotheses, strongest relevant baselines, and novelty relative to known work.

**Interactive experiment:** `rp-literature-baselines` — Add an overlooked baseline to a comparison graph; show a novelty claim becoming narrower.

**Implementation ladder:** Build an annotated primary-source map, baseline matrix, and dependency map.

**RE gate:** Reproduce a small baseline before implementing a proposed improvement.

**RS gate:** Explain why the selected comparison addresses the claimed contribution and identify a disconfirming paper.

**Module 03 — Research questions, estimands, and hypotheses**

`handle: RP03` · `id: research.questions-estimands` · 24h · prerequisites: RP02, PS07 · proposed bank: `rp-03-questions-estimands`

**Spine and derivations:** Operationalize a question, define outcome and unit of analysis, distinguish exploratory/confirmatory work, and prestate effect direction and meaningful magnitude.

**Interactive experiment:** `rp-questions-estimands` — Change task sampling or metric aggregation; show the estimand changing with identical predictions.

**Implementation ladder:** Write a hypothesis specification, synthetic power scenario, and confound inventory.

**RE gate:** Translate a hypothesis into executable input/output and metric contracts.

**RS gate:** Choose a falsifiable question and state which outcome would change the conclusion.

**Module 04 — Experimental design, ablations, and compute budgets**

`handle: RP04` · `id: research.experimental-design` · 30h · prerequisites: RP03, PS08, PY11 · proposed bank: `rp-04-experimental-design`

**Spine and derivations:** Controls, randomization/blocking, paired designs, factorial interactions, search budgets, stopping rules, failure accounting, and uncertainty.

**Interactive experiment:** `rp-experimental-design` — Vary seeds, tasks, tuning budget, and interaction effects; expose an apparent gain from unequal treatment.

**Implementation ladder:** Implement an ablation manifest, randomized assignment, and a complete-results ledger.

**RE gate:** Execute the planned comparisons with reproducible runs and all failure states retained.

**RS gate:** Justify the analysis and distinguish the sampled unit from repeated measurements of that unit.

### Part II · Reproduction and extension

*Thesis: originality becomes assessable when the baseline and alternatives are clear.*

**Module 05 — Faithful paper reproduction**

`handle: RP05` · `id: research.faithful-reproduction` · 50h · prerequisites: RP04, PT09 · proposed bank: `rp-05-faithful-reproduction`

**Spine and derivations:** Match objective, data, architecture, optimizer, selection, and evaluation; record ambiguities, reproduction tolerances, and deviations.

**Interactive experiment:** `rp-faithful-reproduction` — Toggle a hidden recipe difference; compare effects on a supplied reproduction trace.

**Implementation ladder:** Deliver a minimal reference implementation, recipe-difference audit, and reproduced figure.

**RE gate:** Recreate a published small-scale result within a prespecified tolerance or localize the discrepancy.

**RS gate:** Explain whether a failed reproduction contradicts the claim or only exposes missing implementation detail.

**Module 06 — Diagnosing research discrepancies**

`handle: RP06` · `id: research.debugging-discrepancies` · 30h · prerequisites: RP05, PY14 · proposed bank: `rp-06-debugging-discrepancies`

**Spine and derivations:** Bisect data/model/objective/metric differences, use exact small oracles, distinguish nondeterminism from systematic bias, and test alternative explanations.

**Interactive experiment:** `rp-debugging-discrepancies` — Reveal layered bugs in a pipeline; show how a successful patch can leave the reported conclusion unsupported.

**Implementation ladder:** Implement layerwise trace comparisons, a synthetic oracle, and a discrepancy log.

**RE gate:** Find a discrepancy's first cause and identify every affected artifact.

**RS gate:** Update the interpretation without selecting only the runs that support the initial hypothesis.

**Module 07 — Designing an original extension**

`handle: RP07` · `id: research.original-extension` · 44h · prerequisites: RP06 · proposed bank: `rp-07-original-extension`

**Spine and derivations:** Change one substantive assumption, predict mechanisms, specify competing explanations, identify informative failures, and scope work to available resources.

**Interactive experiment:** `rp-original-extension` — Compare proposed experiments by which hypotheses they distinguish; show an expensive but uninformative ablation.

**Implementation ladder:** Produce an extension proposal, discriminating experiment matrix, and feasibility pilot.

**RE gate:** Build the smallest implementation that tests the new idea reliably.

**RS gate:** Defend novelty and explain why the result would matter even if the preferred hypothesis fails.

**Module 08 — Executing and revising a research agenda**

`handle: RP08` · `id: research.research-execution` · 44h · prerequisites: RP07 · proposed bank: `rp-08-research-execution`

**Spine and derivations:** Milestones, evidence-based continuation/stop decisions, experiment tracking, exploratory pivots, resource accounting, and preservation of negative evidence.

**Interactive experiment:** `rp-research-execution` — Reveal results sequentially; choose the next experiment while logging deviations from the original plan.

**Implementation ladder:** Maintain a decision journal, versioned experiment ledger, and revised hypothesis map.

**RE gate:** Keep a long-running project reproducible across code, data, and environment changes.

**RS gate:** Explain why each pivot followed evidence and avoid presenting post-hoc predictions as preregistered ones.

### Part III · Scientific responsibility and defense

*Thesis: a result must remain useful when another person challenges its assumptions.*

**Module 09 — Scientific writing and executable communication**

`handle: RP09` · `id: research.scientific-writing` · 30h · prerequisites: RP08 · proposed bank: `rp-09-scientific-writing`

**Spine and derivations:** Problem-method-evidence structure, figures with units/uncertainty, limitations, reproducibility instructions, and concise technical argument.

**Interactive experiment:** `rp-scientific-writing` — Change plotting axes, aggregation, or omitted runs; show how presentation can exaggerate a result.

**Implementation ladder:** Produce executable figures, a short paper, and an artifact reproduction guide.

**RE gate:** Enable another researcher to regenerate the main result without private instructions.

**RS gate:** Write a conclusion whose scope exactly matches the evidence and address a strong alternative explanation.

**Module 10 — Evaluation validity, safety research, and impact**

`handle: RP10` · `id: research.evaluation-safety-impact` · 28h · prerequisites: RP04, PS10, PS16 · proposed bank: `rp-10-evaluation-safety-impact`

**Spine and derivations:** Capability versus behavior measurement, threat models, controlled red-team tasks, evaluator error, sensitive-data handling, and dual-use/impact reasoning matched to the project.

**Interactive experiment:** `rp-evaluation-safety-impact` — Change task visibility, threat assumptions, and judge errors; show a reassuring average missing a concentrated failure.

**Implementation ladder:** Build a threat-model worksheet, controlled evaluation fixture, and limitations/impact statement.

**RE gate:** Produce auditable tests and enforce the project environment's action/data boundaries.

**RS gate:** Explain which risk claim the evidence supports and which remains unmeasured.

**Module 11 — RE/RS interviews and project defense**

`handle: RP11` · `id: research.re-rs-defense` · 36h · prerequisites: RP09, RP10, DS14 · proposed bank: `rp-11-re-rs-defense`

**Spine and derivations:** Coding from constraints, derivation under changed assumptions, debugging unfamiliar code, systems tradeoffs, paper critique, and research proposal defense.

**Interactive experiment:** `rp-re-rs-defense` — Introduce an unseen constraint or failed run during a project presentation; assess how the argument changes.

**Implementation ladder:** Prepare a coding/debugging exercise, derivation dossier, and timed technical defense recording.

**RE gate:** Implement and diagnose unfamiliar components while explaining correctness and resource costs.

**RS gate:** Defend novelty, theory assumptions, experimental controls, and the next decisive experiment.

**Module 12 — Capstone: reproduction plus original contribution**

`handle: RP12` · `id: research.capstone-research-portfolio` · 70h · prerequisites: RP11 · proposed bank: `rp-12-capstone-research-portfolio`

**Spine and derivations:** No new theory: one faithful reproduction, one justified extension, complete artifacts, honest negative evidence, and a coherent research direction.

**Interactive experiment:** `rp-capstone-research-portfolio` — Allow a reviewer to rerun figures, change one assumption, and inspect excluded/failed runs.

**Implementation ladder:** Deliver repository, technical report, and an independently executable artifact review.

**RE gate:** Another researcher reproduces the main results and can extend the implementation.

**RS gate:** Defend a substantive contribution or a well-supported negative result and propose a credible next study.

## 5. Write order and milestones

Start RP01 while reading any technical unit. RP02–RP04 become available after statistical inference and should run alongside the first serious experiments. RP05–RP09 follow one selected subject project, not every track. RP10 can run after RP04. RP11–RP12 combine technical defense with a reproduction/extension portfolio. Credit an existing subject capstone as the same research artifact where appropriate rather than counting its work twice.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Produce one faithful reproduction and one original extension in a chosen specialization. A common artifact can satisfy the subject capstone and RP12, with hours counted once. The RE defense emphasizes reliable implementation, diagnosis, and cost; the RS defense emphasizes question selection, novelty, inference, and the next research direction. Both require a clear written report and reproducible evidence.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add claim/evidence matrices, experiment-design simulators, and interactive figure-audit examples. Most activities are artifact-based; the three implementation tasks may be scripts, structured manifests, or analysis notebooks, each with an explicit validator. Avoid grading novelty by output length or claiming hiring readiness from a quiz.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
