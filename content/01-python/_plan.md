# Python and numerical programming — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Progress from reasoning about objects to building reliable, profiled research code. Every optimization must preserve a stated contract; every abstraction must earn its place in a usable experiment.

The existing [objects and iteration overview](01-python-memory-iteration.md) remains a bridge and retains its path. It has no front-matter ID today; do not invent an existing contract. Detailed new units reserve file numbers 02–15.

**Legacy-page review:** Keep the overview as a temporary entry bridge: it teaches aliasing, mutation, iterator lifetime and streaming memory, and owns the `moments` browser task. Transfer these examples to PY02, PY04 and PY07 when those lessons are authored; then retire the overview after migrating its task and inbound links. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 14 units; 324 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `PY02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `python.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own Python semantics, NumPy, packaging, concurrency, and CPU profiling. DSA owns algorithmic proofs; PyTorch owns tensor/autograd framework behavior; LLM Systems owns accelerator and distributed performance.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| PY02 | Objects, names, mutation, and lifetime | 20 | F00 |
| PY03 | Functions, closures, protocols, and types | 20 | PY02 |
| PY04 | Iteration, generators, and reliable I/O | 22 | PY03 |
| PY05 | Profiling and performance reasoning | 18 | PY04 |
| PY06 | NumPy shapes, strides, views, and broadcasting | 24 | PY05, LA02 |
| PY07 | Vectorization, stable reductions, and random streams | 24 | PY06, F01, PS01 |
| PY08 | Data contracts, storage, and serialization | 20 | PY04, F04 |
| PY09 | Concurrency, parallelism, and backpressure | 24 | PY05, PY08 |
| PY10 | Packages, command-line tools, and configuration | 20 | PY03, F04 |
| PY11 | Testing numerical and experimental code | 24 | PY07, PY10, F05 |
| PY12 | Experiment orchestration and resumable sweeps | 24 | PY09, PY11 |
| PY13 | Compiled boundaries and performance extensions | 24 | PY06, PY11 |
| PY14 | Reading and debugging unfamiliar research code | 24 | PY12 |
| PY15 | Capstone: a reusable streaming experiment package | 36 | PY13, PY14 |

## 4. Detailed module briefs

### Part I · Program semantics

*Thesis: state and lifetime explain most supposedly mysterious language failures.*

**Module 02 — Objects, names, mutation, and lifetime**

`handle: PY02` · `id: python.objects-state-mutation` · 20h · prerequisites: F00 · proposed bank: `py-02-objects-state-mutation`

**Spine and derivations:** Binding versus copying, identity versus equality, mutable defaults, hash contracts, reference lifetime, and cyclic structures; draw alias graphs before execution.

**Interactive experiment:** `py-objects-state-mutation` — Edit a nested container and choose shallow/deep copy; reveal shared leaves and tuple-contained mutation.

**Implementation ladder:** Implement independent_batches, copy_tree for an explicit acyclic contract, and immutable_config validation.

**RE gate:** Repair state leaking between experiment runs and show input-preservation tests.

**RS gate:** Explain how hidden shared state invalidates supposedly independent comparisons.

**Module 03 — Functions, closures, protocols, and types**

`handle: PY03` · `id: python.functions-protocols-types` · 20h · prerequisites: PY02 · proposed bank: `py-03-functions-protocols-types`

**Spine and derivations:** Argument binding, lexical scope, closures, decorators, descriptors at an introductory level, structural protocols, and runtime validation; types are not automatic checks.

**Interactive experiment:** `py-functions-protocols-types` — Change closure capture time and decorator order; display actual call bindings and a late-binding failure.

**Implementation ladder:** Implement a configurable decorator, a callable metric protocol, and a validated dataclass configuration.

**RE gate:** Design a small interchangeable component interface without global state.

**RS gate:** State behavioral assumptions a type signature cannot express and construct a violating implementation.

**Module 04 — Iteration, generators, and reliable I/O**

`handle: PY04` · `id: python.iteration-streaming-io` · 22h · prerequisites: PY03 · proposed bank: `py-04-iteration-streaming-io`

**Spine and derivations:** Iterator exhaustion, generator suspension, resource ownership, context managers, serialization, and streaming memory bounds; derive online moments and merge summaries.

**Interactive experiment:** `py-iteration-streaming-io` — Change batch size and consumer retention; display peak live objects and a consumed-iterator failure.

**Implementation ladder:** Implement jsonl_records, bounded_batches, and merge_moments with line-numbered errors.

**RE gate:** Process input larger than RAM with bounded memory and explicit malformed-record policy.

**RS gate:** Demonstrate when a streaming summary loses information needed for a later analysis.

**Module 05 — Profiling and performance reasoning**

`handle: PY05` · `id: python.profiling-complexity` · 18h · prerequisites: PY04 · proposed bank: `py-05-profiling-complexity`

**Spine and derivations:** Separate asymptotic cost, interpreter overhead, allocations, I/O, and cache effects; profile inclusive versus exclusive time and distinguish microbenchmarks from workloads.

**Interactive experiment:** `py-profiling-complexity` — Vary data size and per-call overhead; reveal a faster microkernel that slows the whole pipeline.

**Implementation ladder:** Implement timing_harness, allocation_probe, and workload_scaling_report.

**RE gate:** Locate the dominant cost in an unfamiliar script and validate an end-to-end improvement.

**RS gate:** Explain the domain where the claimed speedup generalizes and a confound that would reverse it.

### Part II · Numerical data

*Thesis: shape, storage, and contracts are part of the algorithm.*

**Module 06 — NumPy shapes, strides, views, and broadcasting**

`handle: PY06` · `id: python.numpy-shapes-strides` · 24h · prerequisites: PY05, LA02 · proposed bank: `py-06-numpy-shapes-strides`

**Spine and derivations:** Index-to-address maps, broadcasting alignment, views versus copies, contiguous layouts, and reduction axes; derive batched operation shapes.

**Interactive experiment:** `py-numpy-shapes-strides` — Edit shape and strides in a storage grid; expose transposed views, overlapping storage, and unintended broadcasts.

**Implementation ladder:** Implement broadcast_shape, strided_offset, and a local batched linear model in NumPy.

**RE gate:** Fix a silently broadcast loss and account for copies and peak memory.

**RS gate:** Prove equivalence of a vectorized expression to its indexed definition.

**Module 07 — Vectorization, stable reductions, and random streams**

`handle: PY07` · `id: python.numerical-vectorization` · 24h · prerequisites: PY06, F01, PS01 · proposed bank: `py-07-numerical-vectorization`

**Spine and derivations:** Reduction order, stable softmax, masking, vectorized sampling, independent RNG streams, and reproducible shuffling; distinguish reproducibility from statistical independence.

**Interactive experiment:** `py-numerical-vectorization` — Change chunking and seed assignment; show repeated worker samples and all-masked rows.

**Implementation ladder:** Implement masked_logsumexp, minibatch_indices, and streaming_normalization with training-only statistics.

**RE gate:** Match scalar and vectorized oracles across empty axes, extreme logits, and remainder batches.

**RS gate:** Quantify a numerical or sampling discrepancy and justify the tolerance or independence claim.

**Module 08 — Data contracts, storage, and serialization**

`handle: PY08` · `id: python.data-contracts-storage` · 20h · prerequisites: PY04, F04 · proposed bank: `py-08-data-contracts-storage`

**Spine and derivations:** Schemas, missing values, dtypes, endian/layout metadata, chunked storage, memory mapping, and versioned serialization; preserve semantic identity through round trips.

**Interactive experiment:** `py-data-contracts-storage` — Toggle schema versions and missing-value encodings; show silent integer coercion and stale cache keys.

**Implementation ladder:** Implement schema_validate, versioned_record_upgrade, and content_manifest.

**RE gate:** Resume a partially written dataset without corrupting records or changing split membership.

**RS gate:** Explain why a checksum proves byte identity but not semantic validity or representative sampling.

**Module 09 — Concurrency, parallelism, and backpressure**

`handle: PY09` · `id: python.concurrency-parallelism` · 24h · prerequisites: PY05, PY08 · proposed bank: `py-09-concurrency-parallelism`

**Spine and derivations:** Threads, processes, asynchronous I/O, queues, cancellation, locks, and bounded work; discuss interpreter-version-dependent GIL behavior explicitly.

**Interactive experiment:** `py-concurrency-parallelism` — Adjust producer/consumer rates and queue size; observe memory growth, deadlock, and cancellation races.

**Implementation ladder:** Build a bounded worker pool, ordered result collector, and cancellation-safe pipeline.

**RE gate:** Demonstrate cleanup and deterministic output ordering after worker failure.

**RS gate:** Design a throughput comparison that separates parallelism from changed workload semantics.

### Part III · Research software

*Thesis: a fast prototype becomes useful when another person can trust and reproduce it.*

**Module 10 — Packages, command-line tools, and configuration**

`handle: PY10` · `id: python.packages-cli-config` · 20h · prerequisites: PY03, F04 · proposed bank: `py-10-packages-cli-config`

**Spine and derivations:** Import resolution, package boundaries, dependency locks, configuration precedence, immutable run specifications, and CLI exit semantics.

**Interactive experiment:** `py-packages-cli-config` — Change config layers and module search order; display effective configuration and import shadowing.

**Implementation ladder:** Build a package entry point, a config resolver, and a run manifest exporter.

**RE gate:** Run the same experiment from any working directory in a clean environment.

**RS gate:** Specify which configuration fields define the scientific treatment and prevent unlogged overrides.

**Module 11 — Testing numerical and experimental code**

`handle: PY11` · `id: python.testing-research-code` · 24h · prerequisites: PY07, PY10, F05 · proposed bank: `py-11-testing-research-code`

**Spine and derivations:** Property and metamorphic tests, differential testing, numerical tolerances, fixtures, and flaky statistical tests; match test granularity to failure cost.

**Interactive experiment:** `py-testing-research-code` — Inject axis, sign, seed, and dtype bugs; compare exact, tolerant, and distributional checks.

**Implementation ladder:** Implement permutation_invariance checks, scalar/vector differential checks, and a synthetic data oracle.

**RE gate:** Detect a plausible implementation that passes only happy-path tests.

**RS gate:** Justify a statistical test's error rate and avoid requiring one random realization to equal its expectation.

**Module 12 — Experiment orchestration and resumable sweeps**

`handle: PY12` · `id: python.experiment-orchestration` · 24h · prerequisites: PY09, PY11 · proposed bank: `py-12-experiment-orchestration`

**Spine and derivations:** Immutable run IDs, task graphs, caches, checkpoint boundaries, retries, idempotence, and complete metric records.

**Interactive experiment:** `py-experiment-orchestration` — Interrupt a sweep at each state transition; display duplicates and results missing their configuration.

**Implementation ladder:** Implement run_state_machine, atomic_result_write, and resume_manifest.

**RE gate:** Restart a failed sweep without silently rerunning completed treatments or dropping failures.

**RS gate:** Audit selection bias introduced by reporting only successful runs.

**Module 13 — Compiled boundaries and performance extensions**

`handle: PY13` · `id: python.extension-boundaries` · 24h · prerequisites: PY06, PY11 · proposed bank: `py-13-extension-boundaries`

**Spine and derivations:** Python/native call overhead, batch boundaries, contiguous buffers, ownership, and reference correctness; choose compilation only after profiling.

**Interactive experiment:** `py-extension-boundaries` — Vary batch size and boundary overhead; expose a fast native function defeated by conversion costs.

**Implementation ladder:** Implement a buffer-contract checker, reference microkernel, and optional compiled variant benchmark.

**RE gate:** Demonstrate numerical parity and an end-to-end benefit with versions pinned.

**RS gate:** Explain why one machine's acceleration ratio is not a universal algorithmic result.

**Module 14 — Reading and debugging unfamiliar research code**

`handle: PY14` · `id: python.debugging-unfamiliar-code` · 24h · prerequisites: PY12 · proposed bank: `py-14-debugging-unfamiliar-code`

**Spine and derivations:** Trace configuration to data to objective to metric; shrink a reproducer; reason about nondeterminism and hidden mutable state.

**Interactive experiment:** `py-debugging-unfamiliar-code` — Follow an execution trace with a planted cache, shuffle, or normalization defect; reveal the first divergence.

**Implementation ladder:** Build a trace comparator, fixture minimizer, and patch regression check.

**RE gate:** Repair an unseen pipeline and explain the root cause before changing the code.

**RS gate:** Determine which published measurements require rerunning after the defect is fixed.

**Module 15 — Capstone: a reusable streaming experiment package**

`handle: PY15` · `id: python.capstone-streaming-pipeline` · 36h · prerequisites: PY13, PY14 · proposed bank: `py-15-capstone-streaming-pipeline`

**Spine and derivations:** No new theory: bounded data flow, stable numerical primitives, typed configuration, tests, profiling, resumable execution, and a usable interface.

**Interactive experiment:** `py-capstone-streaming-pipeline` — Replay a pipeline with slow producers, invalid records, interruption, and seed changes; summarize invariant violations.

**Implementation ladder:** Deliver an installable package, fault-injection suite, and performance report.

**RE gate:** Another researcher installs, extends, and resumes the pipeline from the documentation.

**RS gate:** Defend a controlled comparison implemented by the package and its remaining validity threats.

## 5. Write order and milestones

Write PY02–PY06 first. PY08 and PY10 can follow their listed dependencies before probability is studied; PY07 waits for PS01. Join the data and packaging branches at PY11–PY12. RE specialization adds PY13 and performance depth; RS still completes the correctness and orchestration gates. Finish PY14–PY15 after an unfamiliar-code exercise.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Build a streaming numerical experiment package with independently testable transformations, deterministic split assignment, bounded queues, complete run manifests, and resumption. Include a baseline and one optimization, with raw timings and equal-work comparisons. The final defense uses an unseen corrupt record and an interrupted run.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add an object-reference diagram, stride-storage grid, and queue timeline. Browser labs operate on small lists and simulated task events; NumPy, multiprocessing, packaging, and compiled extensions run locally with pinned environments.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
