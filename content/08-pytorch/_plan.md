# PyTorch and differentiable programming — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Learn to turn equations into correct, inspectable, reproducible tensor programs. The RE target is a trainer and model component that survives edge cases and failure recovery; the RS target adds confidence that the implementation computes the intended objective and derivatives.

The existing [tensor/autograd/training overview](01-tensors-autograd-training.md) remains a bridge. New detailed units reserve 02–15. These are implementation plans; framework versions must be pinned and API examples verified against official documentation when lessons are authored.

**Legacy-page review:** Keep the overview: tensor strides, autograd accumulation, train/eval versus gradient mode, and unequal-microbatch semantics are distinct implementation content. It also owns `softmax`. Transfer its examples and task into PT02/PT03/PT05/PT07/PT09/PT13 before retirement. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 14 units; 392 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `PT02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `pytorch.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own PyTorch tensor semantics, autograd, modules, training state, and local debugging. LA owns derivative geometry; Deep Learning owns architecture; LLM Systems owns GPU architecture, custom high-performance kernels, real collectives, sharding, and serving. PT13 supplies a CPU optimizer-equivalence oracle rather than a distributed-training course.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| PT02 | Tensors, storage, dtype, and devices | 24 | PY06, F01 |
| PT03 | Broadcasting, indexing, reductions, and einsum | 26 | PT02, LA02 |
| PT04 | Modules, parameters, buffers, and state | 22 | PT03, PY10 |
| PT05 | Autograd, vector products, and graph lifetime | 30 | PT04, OPT02 |
| PT06 | Custom autograd and derivative validation | 28 | PT05 |
| PT07 | Losses, masks, and objective semantics | 26 | PT05, PS06 |
| PT08 | Datasets, loaders, randomness, and transfers | 24 | PT04, PY09, PS01 |
| PT09 | Training loops and systematic debugging | 30 | PT07, PT08, OPT06 |
| PT10 | Mixed precision and memory management | 28 | PT09, F01 |
| PT11 | Checkpointing and faithful resumption | 26 | PT10, PY12 |
| PT12 | Profiling and compilation correctness | 28 | PT10, PY05 |
| PT13 | Gradient accumulation and replica equivalence | 26 | PT11, OPT07 |
| PT14 | Implementing a model component from a paper | 30 | PT06, PT12, DL07 |
| PT15 | Capstone: a reliable research trainer | 44 | PT13, PT14 |

## 4. Detailed module briefs

### Part I · Tensor semantics

*Thesis: every tensor has logical dimensions, physical storage, and ownership.*

**Module 02 — Tensors, storage, dtype, and devices**

`handle: PT02` · `id: pytorch.tensors-storage-devices` · 24h · prerequisites: PY06, F01 · proposed bank: `pt-02-tensors-storage-devices`

**Spine and derivations:** Shapes, strides, views, copies, contiguous layouts, dtype promotion, device placement, and aliasing; derive address maps for sliced tensors.

**Interactive experiment:** `pt-tensors-storage-devices` — Edit strides and dtype in a storage viewer; reveal a copy hidden in reshape and an invalid overlapping write.

**Implementation ladder:** Implement stride_offset, view_or_copy_audit, and tensor_roundtrip_checks locally.

**RE gate:** Predict storage sharing and diagnose an unexpected allocation or device mismatch.

**RS gate:** Explain when mathematically equivalent dtype paths compute materially different results.

**Module 03 — Broadcasting, indexing, reductions, and einsum**

`handle: PT03` · `id: pytorch.broadcasting-indexing-einsum` · 26h · prerequisites: PT02, LA02 · proposed bank: `pt-03-broadcasting-indexing-einsum`

**Spine and derivations:** Broadcast alignment, advanced indexing, gather/scatter semantics, einsum index notation, masked reductions, and accumulation under repeated indices.

**Interactive experiment:** `pt-broadcasting-indexing-einsum` — Change batch/head/sequence axes; show a silently broadcast objective and repeated-index accumulation.

**Implementation ladder:** Implement batched_gather, masked_mean, and attention_score_reference.

**RE gate:** Pass an unseen shape gauntlet including singleton, empty, and noncontiguous tensors.

**RS gate:** Prove indexed equivalence and identify when a rearrangement changes reduction weighting.

**Module 04 — Modules, parameters, buffers, and state**

`handle: PT04` · `id: pytorch.modules-parameters-state` · 22h · prerequisites: PT03, PY10 · proposed bank: `pt-04-modules-parameters-state`

**Spine and derivations:** Parameter registration, buffers, train/eval modes, device transfer, state dictionaries, weight tying, and optimizer parameter groups.

**Interactive experiment:** `pt-modules-parameters-state` — Toggle train/eval and tie two weights; inspect registered state and duplicate optimizer updates.

**Implementation ladder:** Implement a custom module, a tied-weight model, and a state_roundtrip audit.

**RE gate:** Save/load a model without dropping buffers or updating shared parameters twice.

**RS gate:** Separate architectural parameters, learned state, and training-only state in a reproducibility claim.

### Part II · Differentiable programs

*Thesis: a gradient is the derivative of the executed program and its exact reductions.*

**Module 05 — Autograd, vector products, and graph lifetime**

`handle: PT05` · `id: pytorch.autograd-vjp-jvp` · 30h · prerequisites: PT04, OPT02 · proposed bank: `pt-05-autograd-vjp-jvp`

**Spine and derivations:** Reverse-mode graph construction, VJPs/JVPs, accumulation, leaf tensors, detach, no-grad, graph retention, and higher derivatives; derive elementary VJPs.

**Interactive experiment:** `pt-autograd-vjp-jvp` — Step through a branched graph; show missing accumulation, detached paths, and retained-graph memory.

**Implementation ladder:** Implement manual_vjp, random_direction_gradcheck, and hvp_reference.

**RE gate:** Locate a missing or stale gradient and match autograd to an independent directional oracle.

**RS gate:** Explain exactly which function is differentiated when a branch, detach, or stop-gradient is present.

**Module 06 — Custom autograd and derivative validation**

`handle: PT06` · `id: pytorch.custom-autograd` · 28h · prerequisites: PT05 · proposed bank: `pt-06-custom-autograd`

**Spine and derivations:** Saved intermediates, backward contracts, broadcast reduction in gradients, non-differentiable points, finite-difference tolerances, and double backward.

**Interactive experiment:** `pt-custom-autograd` — Vary finite-difference epsilon and operation scale; expose correct-looking but transposed gradients.

**Implementation ladder:** Implement a custom normalization function, a broadcast backward helper, and a second-derivative check.

**RE gate:** Pass first- and second-order checks where supported and explicitly reject unsupported derivatives.

**RS gate:** Derive the custom VJP and identify the exceptional set where a classical derivative is undefined.

**Module 07 — Losses, masks, and objective semantics**

`handle: PT07` · `id: pytorch.losses-masks-objectives` · 26h · prerequisites: PT05, PS06 · proposed bank: `pt-07-losses-masks-objectives`

**Spine and derivations:** Stable cross-entropy, class versus token means, padding/ignore masks, label smoothing, sample weights, and variable-length batches.

**Interactive experiment:** `pt-losses-masks-objectives` — Change valid-token counts and padding; compare mean-of-means with a true token mean and an all-masked batch.

**Implementation ladder:** Implement masked_cross_entropy, weighted_loss, and objective_parity_test.

**RE gate:** Show that regrouping samples does not change the intended accumulated gradient.

**RS gate:** Derive how a normalization change alters the population objective or gradient scale.

**Module 08 — Datasets, loaders, randomness, and transfers**

`handle: PT08` · `id: pytorch.datasets-loaders-rng` · 24h · prerequisites: PT04, PY09, PS01 · proposed bank: `pt-08-datasets-loaders-rng`

**Spine and derivations:** Map/iterable datasets, collation, worker sharding, independent RNG streams, pinning and asynchronous transfer concepts, and deterministic split identity.

**Interactive experiment:** `pt-datasets-loaders-rng` — Change workers and prefetch depth; reveal duplicated records and correlated augmentations.

**Implementation ladder:** Implement variable_length_collate, worker_shard_plan, and sample_identity_audit.

**RE gate:** Prove each intended example is consumed with the correct frequency under restart.

**RS gate:** Distinguish deterministic execution from a valid random-sampling design.

**Module 09 — Training loops and systematic debugging**

`handle: PT09` · `id: pytorch.training-loop-debugging` · 30h · prerequisites: PT07, PT08, OPT06 · proposed bank: `pt-09-training-loop-debugging`

**Spine and derivations:** Optimizer ordering, zeroing and accumulating gradients, one-batch overfit, evaluation isolation, clipping, logging, and anomaly localization.

**Interactive experiment:** `pt-training-loop-debugging` — Inject wrong mode, stale gradients, and label offsets into a tiny trainer; show the first diverging diagnostic.

**Implementation ladder:** Implement train_step, evaluate_step, and one_batch_overfit_check.

**RE gate:** Build a trainer from a blank file and identify an injected bug from measured evidence.

**RS gate:** Explain why decreasing training loss alone is insufficient evidence of objective correctness.

### Part III · Reliable training

*Thesis: state, precision, and restart semantics are part of the experiment.*

**Module 10 — Mixed precision and memory management**

`handle: PT10` · `id: pytorch.precision-memory` · 28h · prerequisites: PT09, F01 · proposed bank: `pt-10-precision-memory`

**Spine and derivations:** Floating-point formats, autocast policy, loss scaling, optimizer state precision, activation memory, recomputation, and numerical tolerances.

**Interactive experiment:** `pt-precision-memory` — Change format range and loss scale; show overflow, underflow, and skipped optimizer steps.

**Implementation ladder:** Implement a precision_error_fixture, memory_accounting_report, and checkpointed-versus-full gradient comparison.

**RE gate:** Produce stable training with measured peak memory and documented precision deviations.

**RS gate:** Specify a numerical equivalence criterion justified by downstream sensitivity.

**Module 11 — Checkpointing and faithful resumption**

`handle: PT11` · `id: pytorch.checkpoint-restart` · 26h · prerequisites: PT10, PY12 · proposed bank: `pt-11-checkpoint-restart`

**Spine and derivations:** Model/optimizer/scheduler/scaler/RNG/data-cursor state, atomic writes, versioning, distributed considerations in outline, and restart semantics.

**Interactive experiment:** `pt-checkpoint-restart` — Interrupt immediately before and after update or data advancement; display duplicate samples and schedule drift.

**Implementation ladder:** Implement full_state_checkpoint, atomic_save_protocol, and resume_parity_test.

**RE gate:** Match an uninterrupted CPU run after restart and disclose nondeterministic accelerator limits.

**RS gate:** Explain which restart differences are harmless and which invalidate paired comparisons.

**Module 12 — Profiling and compilation correctness**

`handle: PT12` · `id: pytorch.profiling-compilation` · 28h · prerequisites: PT10, PY05 · proposed bank: `pt-12-profiling-compilation`

**Spine and derivations:** Operator versus end-to-end time, synchronization, graph capture, graph breaks, dynamic shapes, compilation warmup, and correctness under specialization.

**Interactive experiment:** `pt-profiling-compilation` — Change shape frequency and compile cost; show fast steady-state code with worse total latency.

**Implementation ladder:** Implement synchronized_benchmark, graph_break_minimizer, and eager_compiled_parity.

**RE gate:** Report compile time separately and measure representative shapes and memory.

**RS gate:** Explain whether an observed speedup comes from fusion, specialization, or changed work.

**Module 13 — Gradient accumulation and replica equivalence**

`handle: PT13` · `id: pytorch.gradient-equivalence` · 26h · prerequisites: PT11, OPT07 · proposed bank: `pt-13-gradient-equivalence`

**Spine and derivations:** Global weighted objectives, microbatch accumulation, reduction semantics, clipping position, missing gradients, and optimizer state equivalence.

**Interactive experiment:** `pt-gradient-equivalence` — Vary simulated rank token counts and accumulation length; display divergence from a concatenated-batch reference.

**Implementation ladder:** Implement simulated_gradient_reduce, accumulation_equivalence, and clipping_order_audit.

**RE gate:** Match a single-batch oracle across uneven microbatches and explicit edge cases.

**RS gate:** Derive the normalization required for an unbiased intended objective under the chosen sampling scheme.

**Module 14 — Implementing a model component from a paper**

`handle: PT14` · `id: pytorch.model-component-parity` · 30h · prerequisites: PT06, PT12, DL07 · proposed bank: `pt-14-model-component-parity`

**Spine and derivations:** Translate equations, shapes, initialization, masks, and train/eval behavior into code; compare activations and derivatives layer by layer.

**Interactive experiment:** `pt-model-component-parity` — Toggle a normalization axis, epsilon location, or mask convention; reveal identical output shapes with different functions.

**Implementation ladder:** Implement a reference component, optimized component, and layerwise_parity_report.

**RE gate:** Match a specified component's forward and backward behavior and profile it.

**RS gate:** Separate faithful reproduction from a variant and predict the consequence of one deliberate change.

**Module 15 — Capstone: a reliable research trainer**

`handle: PT15` · `id: pytorch.capstone-reliable-trainer` · 44h · prerequisites: PT13, PT14 · proposed bank: `pt-15-capstone-reliable-trainer`

**Spine and derivations:** No new theory: exact objective, component parity, diagnostic logging, precision policy, resumption, and a reproducible experiment interface.

**Interactive experiment:** `pt-capstone-reliable-trainer` — Replay NaNs, OOM-sized inputs, interruption, empty masks, and malformed checkpoints in a fault timeline.

**Implementation ladder:** Deliver trainer package, fault-injection suite, and a reproducibility/performance report.

**RE gate:** Recover or fail clearly without corrupting state and reproduce a baseline within stated tolerances.

**RS gate:** Defend that the measured treatment corresponds to the intended mathematical experiment.

## 5. Write order and milestones

Write PT02–PT05 first; PT06 and PT07 branch from differentiation. PT08 supplies data semantics before PT09. PT10–PT13 establish the reliability gate. PT14 waits for the attention/architecture branch in Deep Learning, which itself only needs PT09; this avoids a cycle. PT15 is the final trainer gate. Local CPU correctness precedes every accelerator optimization.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Build a trainer that can train a small model, resume, report complete state, and detect injected numerical/data/objective defects. Publish an eager float64 oracle for a tiny case, practical-precision comparisons, and a performance profile. The trainer becomes the reusable substrate for later LLM and RL projects.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add storage-grid, autodiff-graph, objective-normalization, and checkpoint-timeline interactives. PyTorch cannot run in the stdlib browser runtime: browser tasks simulate shapes and update arithmetic; actual tensor exercises run locally. Pin framework and accelerator versions in every local lesson.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
