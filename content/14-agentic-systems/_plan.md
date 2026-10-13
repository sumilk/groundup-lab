# Practical AI, retrieval, and agentic systems — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Build systems whose retrieval, model, tools, and evaluation can be inspected independently and whose end-to-end behavior remains measurable. RE depth means reliable state and resource control; RS depth means identifying which component and intervention caused a change in task success.

The existing [retrieval, tools, evaluation, and deployment overview](01-retrieval-tools-evaluation.md) is retained. Detailed units reserve 02–15. Tools and external services are simulated first; real external side effects are not needed to learn the contracts.

**Legacy-page review:** Keep the overview: retrieval-versus-generation failure attribution, idempotent tool actions, deployment state and rollback are distinct system contracts. Fold its concrete exercises into APP02/APP03/APP04/APP06/APP10/APP12 before retiring the bridge. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 14 units; 406 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `APP02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `ai-systems.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own application-level retrieval composition, tool protocols, stateful workflows, task evaluation, and deployment experiments. NLP owns retrieval models and annotation science; LLM Systems owns serving engines; RL owns learned policies/rewards; probability owns uncertainty and sequential inference.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| APP02 | Task contracts and deterministic baselines | 24 | PY11, NLP12 |
| APP03 | Retrieval pipelines and evidence selection | 28 | APP02, NLP09, NLP10 |
| APP04 | Grounded generation, citation, and abstention | 28 | APP03, IL11 |
| APP05 | Context construction and persistent memory | 26 | APP04, SYS15 |
| APP06 | Tool contracts and state transitions | 28 | APP02, PY12 |
| APP07 | Planning, orchestration, and bounded execution | 28 | APP05, APP06, DS10 |
| APP08 | Multi-agent coordination and communication | 26 | APP07, PY09 |
| APP09 | Untrusted inputs and tool-use reliability | 28 | APP06, APP07 |
| APP10 | Agent evaluation and trajectory analysis | 32 | APP08, APP09, PS10, NLP12 |
| APP11 | Routing, caching, and cost-quality decisions | 28 | APP10, IL12, SYS16 |
| APP12 | Deployment, observability, and controlled rollouts | 28 | APP11, F04, PS08 |
| APP13 | Feedback data and agent improvement | 28 | APP10, RL16, PS16 |
| APP14 | End-to-end ablation and reliability study | 30 | APP12, APP13, RP04 |
| APP15 | Capstone: an auditable constrained agent | 44 | APP14 |

## 4. Detailed module briefs

### Part I · Tasks and retrieval

*Thesis: a useful answer requires the right evidence and a verifiable task contract.*

**Module 02 — Task contracts and deterministic baselines**

`handle: APP02` · `id: ai-systems.task-contracts-baselines` · 24h · prerequisites: PY11, NLP12 · proposed bank: `app-02-task-contracts-baselines`

**Spine and derivations:** Task success, allowed actions, environment state, latency/cost budgets, frozen evaluation cases, and model-free baselines.

**Interactive experiment:** `app-task-contracts-baselines` — Change the success rubric and action budget; show a fluent answer failing the actual task.

**Implementation ladder:** Implement task_fixture, deterministic_baseline, and result_schema_validator.

**RE gate:** Run an evaluation from immutable inputs with explicit failure categories.

**RS gate:** Define a measurable task outcome and identify where proxy metrics can diverge.

**Module 03 — Retrieval pipelines and evidence selection**

`handle: APP03` · `id: ai-systems.retrieval-pipelines` · 28h · prerequisites: APP02, NLP09, NLP10 · proposed bank: `app-03-retrieval-pipelines`

**Spine and derivations:** Chunking, metadata/permissions, lexical/dense fusion, reranking, query transforms, index versions, and freshness.

**Interactive experiment:** `app-retrieval-pipelines` — Change chunk size and fusion weight; separate missing-document, retrieval, and reranking failures.

**Implementation ladder:** Implement chunk_span_map, hybrid_rank_fusion, and retrieval_trace.

**RE gate:** Reproduce every returned chunk from corpus/index versions and original offsets.

**RS gate:** Attribute a gain to retrieval quality rather than changed answer prompts or leaked labels.

**Module 04 — Grounded generation, citation, and abstention**

`handle: APP04` · `id: ai-systems.grounded-generation` · 28h · prerequisites: APP03, IL11 · proposed bank: `app-04-grounded-generation`

**Spine and derivations:** Evidence-to-answer contracts, citation entailment, missing evidence, conflicts, uncertainty, and answer/abstain decisions.

**Interactive experiment:** `app-grounded-generation` — Remove or contradict a source; show unsupported citations and confident answers with no retrieved evidence.

**Implementation ladder:** Implement evidence_record, citation_span_check, and abstention_policy.

**RE gate:** Return inspectable supporting evidence and fail clearly when a required source is absent.

**RS gate:** Distinguish lexical citation presence from actual support and design a blinded entailment audit.

**Module 05 — Context construction and persistent memory**

`handle: APP05` · `id: ai-systems.context-memory` · 26h · prerequisites: APP04, SYS15 · proposed bank: `app-05-context-memory`

**Spine and derivations:** Context budgets, ordering, truncation, summaries, episodic records, retrieval memory, staleness, and forgetting/deletion behavior.

**Interactive experiment:** `app-context-memory` — Change context order and summary compression; show lost constraints and stale remembered facts.

**Implementation ladder:** Implement context_budgeter, versioned_memory_store, and summary_regression_cases.

**RE gate:** Preserve task-critical state across a bounded context window and memory updates.

**RS gate:** Test whether a memory mechanism improves task success rather than merely increasing context length.

### Part II · Stateful tool use

*Thesis: an agent is a program that acts through fallible interfaces.*

**Module 06 — Tool contracts and state transitions**

`handle: APP06` · `id: ai-systems.tool-contracts-state` · 28h · prerequisites: APP02, PY12 · proposed bank: `app-06-tool-contracts-state`

**Spine and derivations:** Typed arguments, schemas, pre/postconditions, authorization boundaries, idempotency keys, retries, and effectful versus read-only operations.

**Interactive experiment:** `app-tool-contracts-state` — Replay a timeout after an action succeeded; show duplicate effects under naive retry.

**Implementation ladder:** Implement simulated_tool_server, idempotent_action_log, and transition_validator.

**RE gate:** Recover from ambiguous responses without duplicating an externally visible action.

**RS gate:** Specify which observations distinguish tool failure, model choice error, and environment change.

**Module 07 — Planning, orchestration, and bounded execution**

`handle: APP07` · `id: ai-systems.planning-orchestration` · 28h · prerequisites: APP05, APP06, DS10 · proposed bank: `app-07-planning-orchestration`

**Spine and derivations:** Finite-state workflows, planning/search, budgets, stopping rules, branching, cancellation, and checkpointed execution.

**Interactive experiment:** `app-planning-orchestration` — Change task depth and retry limits; show loops, abandoned branches, and hidden resource overruns.

**Implementation ladder:** Implement workflow_state_machine, budget_accounting, and resumable_executor.

**RE gate:** Terminate or resume every reachable state with correct resource accounting.

**RS gate:** Compare a planner with a simpler workflow under matched task and inference budgets.

**Module 08 — Multi-agent coordination and communication**

`handle: APP08` · `id: ai-systems.multiagent-coordination` · 26h · prerequisites: APP07, PY09 · proposed bank: `app-08-multiagent-coordination`

**Spine and derivations:** Role decomposition, shared/private state, message protocols, races, correlated errors, debate/ensemble hypotheses, and communication cost.

**Interactive experiment:** `app-multiagent-coordination` — Vary agent count and shared context; show duplicated effort and consensus on a shared mistake.

**Implementation ladder:** Implement message_protocol_simulator, conflict_resolution, and communication_cost_log.

**RE gate:** Maintain coherent shared state and compare against a single-worker baseline.

**RS gate:** Test whether gains come from specialization or simply more samples/compute.

**Module 09 — Untrusted inputs and tool-use reliability**

`handle: APP09` · `id: ai-systems.tool-security-reliability` · 28h · prerequisites: APP06, APP07 · proposed bank: `app-09-tool-security-reliability`

**Spine and derivations:** Separate task instructions from retrieved data, explicit capabilities, sandboxing, least privilege, output validation, and controlled prompt-injection fixtures.

**Interactive experiment:** `app-tool-security-reliability` — Insert malicious instructions into a synthetic retrieved page; show attempted unauthorized state transitions.

**Implementation ladder:** Implement capability_gate, untrusted_content_fixture, and action_audit_log.

**RE gate:** Demonstrate that a model-generated instruction cannot bypass an enforced tool permission.

**RS gate:** Measure attack success and benign task impact under a stated threat model, without calling a few tests a proof.

### Part III · Evaluation and deployment

*Thesis: reliability claims must survive interventions, costs, and failures.*

**Module 10 — Agent evaluation and trajectory analysis**

`handle: APP10` · `id: ai-systems.agent-evaluation` · 32h · prerequisites: APP08, APP09, PS10, NLP12 · proposed bank: `app-10-agent-evaluation`

**Spine and derivations:** Task-level versus step-level scores, environment resets, trajectory provenance, paired tasks, evaluator validity, and failure taxonomy.

**Interactive experiment:** `app-agent-evaluation` — Rescore the same trajectories under different proxies; show more successful steps with lower final task completion.

**Implementation ladder:** Implement deterministic_replay, trajectory_scorer, and paired_task_report.

**RE gate:** Reproduce failures with exact tool responses and versions.

**RS gate:** Choose the unit of analysis and separate correlated trajectories from independent tasks.

**Module 11 — Routing, caching, and cost-quality decisions**

`handle: APP11` · `id: ai-systems.routing-caching-cost` · 28h · prerequisites: APP10, IL12, SYS16 · proposed bank: `app-11-routing-caching-cost`

**Spine and derivations:** Model/tool routing, semantic-cache validity, freshness, latency/cost budgets, fallbacks, and abstention/escalation decisions.

**Interactive experiment:** `app-routing-caching-cost` — Change cache similarity threshold and request drift; show cheaper answers with stale or wrong evidence.

**Implementation ladder:** Implement cache_validity_policy, cost_aware_router, and frontier_evaluator.

**RE gate:** Account for token/tool costs and invalidate cached results when dependencies change.

**RS gate:** Derive a routing decision from costs and evaluate its selection bias.

**Module 12 — Deployment, observability, and controlled rollouts**

`handle: APP12` · `id: ai-systems.deployment-observability` · 28h · prerequisites: APP11, F04, PS08 · proposed bank: `app-12-deployment-observability`

**Spine and derivations:** Versioned bundles, environment configuration, request traces, privacy-aware logging choices, canaries, rollback, drift monitoring, and sequential testing.

**Interactive experiment:** `app-deployment-observability` — Change model/prompt/index independently; expose nonreproducible regressions and rollback with stale caches.

**Implementation ladder:** Implement deployment_manifest, canary_assignment, and rollback_replay.

**RE gate:** Trace an outcome to exact versions and recover a known-good bundle.

**RS gate:** Design a rollout analysis that accounts for repeated looks and changing traffic.

**Module 13 — Feedback data and agent improvement**

`handle: APP13` · `id: ai-systems.agent-learning-feedback` · 28h · prerequisites: APP10, RL16, PS16 · proposed bank: `app-13-agent-learning-feedback`

**Spine and derivations:** Trace selection, human correction, imitation/post-training interfaces, reward labels, feedback loops, and selection/confounding in logged outcomes.

**Interactive experiment:** `app-agent-learning-feedback` — Change which failures receive labels; show apparent improvement caused by easier observed tasks.

**Implementation ladder:** Implement feedback_dataset_builder, label_provenance_check, and counterfactual_limit_report.

**RE gate:** Produce clean versioned training examples without leaking held-out task outcomes.

**RS gate:** Explain what can and cannot be inferred from feedback collected under a changing policy.

**Module 14 — End-to-end ablation and reliability study**

`handle: APP14` · `id: ai-systems.systems-ablation` · 30h · prerequisites: APP12, APP13, RP04 · proposed bank: `app-14-systems-ablation`

**Spine and derivations:** Component substitutions, factorial interactions, equal-cost comparisons, judge blinding, failure injection, and operational success metrics.

**Interactive experiment:** `app-systems-ablation` — Ablate retrieval, memory, planning, and routing; show nonadditive interactions and a hidden evaluator change.

**Implementation ladder:** Implement component_ablation_runner, fault_matrix, and paired_cost_quality_report.

**RE gate:** Identify the component responsible for a regression with replayable evidence.

**RS gate:** Test a specific interaction hypothesis and report uncertainty and negative results.

**Module 15 — Capstone: an auditable constrained agent**

`handle: APP15` · `id: ai-systems.capstone-auditable-agent` · 44h · prerequisites: APP14 · proposed bank: `app-15-capstone-auditable-agent`

**Spine and derivations:** No new theory: solve a bounded task with retrieval and simulated tools, versioned state, controlled actions, and independent evaluation.

**Interactive experiment:** `app-capstone-auditable-agent` — Run held-out tasks with missing evidence, bad tool outputs, retries, cancellation, and adversarial retrieved text.

**Implementation ladder:** Deliver system package, evaluation fixtures, and an operational/research report.

**RE gate:** Complete or fail clearly on every test with a recoverable trace and no unauthorized effects.

**RS gate:** Defend a measured improvement over a simpler baseline at equal resource budget.

## 5. Write order and milestones

Write APP02–APP04 for retrieval/grounding; APP05 is memory and APP06 is the independent tool-contract branch. Join them at APP07, then optional APP08 coordination and required APP09 reliability. APP10–APP12 create the evaluation/deployment core. APP13 is a learned-agent specialization that waits for post-training; APP14–APP15 provide the full research capstone. An application RE may complete a bounded APP12 project before the learned-agent branch.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Build a constrained research or support assistant over a small versioned corpus and simulated tools. Compare it with a deterministic or single-call baseline. Include withheld tasks, independent scoring, action limits, duplicate-action tests, evidence audits, cost/latency curves, and replayable failures.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add retrieval/evidence flow, state-machine execution, action ledger, budget, and trajectory comparison views. All browser tools are deterministic simulations. Local model calls are optional pluggable backends; the core assessment must be runnable from stored responses and synthetic fixtures.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
