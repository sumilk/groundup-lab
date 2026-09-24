# LLM training, accelerator systems, and inference — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Build a correct small language model, then understand the hardware and distributed protocols needed to train and serve larger ones. RE depth means measured performance and recovery; RS depth means that systems choices preserve the scientific objective and that scaling claims are tested honestly.

The [causal transformers and training systems overview](01-causal-transformers-training-systems.md) is retained. Detailed units reserve 02–21. This plan expands the combined PyTorch & Systems and NLP & LLM catalog topics into explicit model, accelerator, distributed, and inference branches.

**Legacy-page review:** Keep the overview: causal masking, next-token alignment, a causality perturbation check and KV-cache equivalence are concrete implementation material. It owns `attention`. Transfer this material to SYS02/SYS03/SYS15, including the registered task and workload diagnostics, before retirement. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 20 units; 682 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `SYS02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `llm-systems.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own decoder integration, pretraining execution, GPU/kernel performance, distributed training, and serving. PyTorch owns framework semantics; Deep Learning owns architectural principles; NLP owns tokenizer/corpus correctness; RL owns preference objectives and policy optimization; Practical AI Systems owns application orchestration.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| SYS02 | Decoder-only language models from primitives | 36 | DL07, NLP07, PT09 |
| SYS03 | Packed sequences and pretraining data flow | 28 | SYS02, NLP10, PT08 |
| SYS04 | Pretraining baselines and training diagnostics | 32 | SYS03, PT11, OPT06 |
| SYS05 | Scaling laws and compute allocation | 34 | SYS04, PS06, PS08, F06 |
| SYS06 | GPU architecture, memory hierarchy, and rooflines | 30 | SYS02, PT12 |
| SYS07 | Kernel primitives, reductions, and fusion | 36 | SYS06, PT06 |
| SYS08 | Memory-efficient attention and online softmax | 38 | SYS07, DL07 |
| SYS09 | Low precision, quantization, and numerical audits | 34 | SYS07, PT10, LA09 |
| SYS10 | Collectives and data-parallel training | 34 | SYS04, PT13, SYS06 |
| SYS11 | Sharding, tensor parallelism, and pipeline parallelism | 38 | SYS10, LA21 |
| SYS12 | Distributed data, checkpoints, and fault recovery | 34 | SYS11, PT11, PY12 |
| SYS13 | Expert parallelism and long-context training | 34 | SYS11, DL15, SYS08 |
| SYS14 | Reliable training and observability | 32 | SYS12, SYS09 |
| SYS15 | KV caches, decoding, and incremental equivalence | 30 | SYS02, NLP13, PT12 |
| SYS16 | Continuous batching and serving schedulers | 34 | SYS15, DS05, PY09 |
| SYS17 | Speculative decoding and compressed inference | 32 | SYS16, SYS09, PS02 |
| SYS18 | Instruction tuning and parameter-efficient adaptation | 32 | SYS04, DL10, NLP12 |
| SYS19 | Post-training rollout and learner systems | 34 | SYS18, RL10, SYS16 |
| SYS20 | Systems research and performance methodology | 30 | SYS14, SYS17, RP04 |
| SYS21 | Capstone: a training or serving systems study | 50 | SYS20 |

## 4. Detailed module briefs

### Part I · A correct language model

*Thesis: a reproducible small run is the reference for every later systems optimization.*

**Module 02 — Decoder-only language models from primitives**

`handle: SYS02` · `id: llm-systems.decoder-reference` · 36h · prerequisites: DL07, NLP07, PT09 · proposed bank: `sys-02-decoder-reference`

**Spine and derivations:** Tokenizer-to-logit contract, embeddings, causal blocks, position handling, tied heads, initialization, shifted targets, and token-normalized loss.

**Interactive experiment:** `sys-decoder-reference` — Change target shift or mask; reveal future leakage and apparently excellent loss from copied labels.

**Implementation ladder:** Implement decoder_reference, causal_prefix_test, and logits_gradient_parity.

**RE gate:** Train a tiny LM end to end and match a specified architecture numerically.

**RS gate:** Explain which modeling assumptions the objective makes and isolate one architecture change.

**Module 03 — Packed sequences and pretraining data flow**

`handle: SYS03` · `id: llm-systems.packing-data-loader` · 28h · prerequisites: SYS02, NLP10, PT08 · proposed bank: `sys-03-packing-data-loader`

**Spine and derivations:** Document boundaries, packing, attention/loss masks, shuffling, worker identity, token accounting, and replayable data cursors.

**Interactive experiment:** `sys-packing-data-loader` — Repack the same documents; show unintended cross-document attention and changing sample weights.

**Implementation ladder:** Implement packing_reference, document_mask, and data_cursor_replay.

**RE gate:** Match packed and unpacked objectives under the declared boundary convention.

**RS gate:** Explain how packing or data ordering changes the experiment and which equivalences do not hold.

**Module 04 — Pretraining baselines and training diagnostics**

`handle: SYS04` · `id: llm-systems.pretraining-baseline` · 32h · prerequisites: SYS03, PT11, OPT06 · proposed bank: `sys-04-pretraining-baseline`

**Spine and derivations:** Optimizer/schedule integration, warmup, token budgets, validation frequency, gradient/activation diagnostics, and failure triage.

**Interactive experiment:** `sys-pretraining-baseline` — Vary batch, LR, and corpus mixture; show spikes, bad validation denominators, and a changed-token-budget comparison.

**Implementation ladder:** Implement pretraining_runner, diagnostic_hooks, and baseline_reproduction_report.

**RE gate:** Resume a run and reproduce the baseline within declared numerical tolerances.

**RS gate:** Separate an optimization improvement from more data, more tuning, or a changed validation distribution.

**Module 05 — Scaling laws and compute allocation**

`handle: SYS05` · `id: llm-systems.scaling-compute` · 34h · prerequisites: SYS04, PS06, PS08, F06 · proposed bank: `sys-05-scaling-compute`

**Spine and derivations:** Parameter/token/compute accounting, empirical power-law fits, irreducible-loss terms, uncertainty, held-out scale prediction, and non-identifiability of fits.

**Interactive experiment:** `sys-scaling-compute` — Change fit range and noise; show several laws fitting observed runs but disagreeing on extrapolation.

**Implementation ladder:** Implement scaling_fit, compute_allocation_search, and heldout_scale_prediction.

**RE gate:** Account for actual training FLOPs and wall time, including discarded runs.

**RS gate:** Prestate a held-out prediction and report uncertainty and extrapolation failure.

### Part II · Accelerators and kernels

*Thesis: bytes, synchronization, and numerical equivalence determine useful speed.*

**Module 06 — GPU architecture, memory hierarchy, and rooflines**

`handle: SYS06` · `id: llm-systems.gpu-memory-roofline` · 30h · prerequisites: SYS02, PT12 · proposed bank: `sys-06-gpu-memory-roofline`

**Spine and derivations:** SIMT execution, warps, memory hierarchy, coalescing, arithmetic intensity, occupancy tradeoffs, bandwidth/compute roofs, and launch overhead.

**Interactive experiment:** `sys-gpu-memory-roofline` — Change tile size and tensor dimensions; compare predicted bytes/FLOPs with a supplied timing trace and occupancy limits.

**Implementation ladder:** Implement roofline_estimate, memory_traffic_count, and synchronized_microbenchmark.

**RE gate:** Identify a bottleneck using measured evidence and avoid asynchronous timing errors.

**RS gate:** Explain which hardware assumptions support the cost model and where it fails.

**Module 07 — Kernel primitives, reductions, and fusion**

`handle: SYS07` · `id: llm-systems.kernel-primitives` · 36h · prerequisites: SYS06, PT06 · proposed bank: `sys-07-kernel-primitives`

**Spine and derivations:** Indexing, tiling, masks, reductions, synchronization, register pressure, race conditions, and fusion; implement a specified Triton or CUDA route with versions pinned.

**Interactive experiment:** `sys-kernel-primitives` — Change block size and tail length; show out-of-bounds lanes, race symptoms, and register-spill penalties.

**Implementation ladder:** Implement vector_kernel, stable_row_reduction, and fused_normalization with reference comparisons.

**RE gate:** Pass irregular-shape and numerical tests before publishing speedups.

**RS gate:** Derive the reduction and quantify the numerical effect of reassociation.

**Module 08 — Memory-efficient attention and online softmax**

`handle: SYS08` · `id: llm-systems.attention-kernels` · 38h · prerequisites: SYS07, DL07 · proposed bank: `sys-08-attention-kernels`

**Spine and derivations:** Online softmax recurrence, tiled attention, recomputation, masking, backward accumulation, and IO cost; distinguish exact real-arithmetic equivalence from floating-point parity.

**Interactive experiment:** `sys-attention-kernels` — Change query/key tile size; show running maxima/normalizers and failure without rescaling.

**Implementation ladder:** Implement online_softmax_stdlib, tiled_attention_reference, and an optional accelerator kernel.

**RE gate:** Match outputs/gradients for causal, ragged, and extreme-logit cases with stated tolerances.

**RS gate:** Derive the online recurrence and explain the IO argument without claiming universal wall-time speedup.

**Module 09 — Low precision, quantization, and numerical audits**

`handle: SYS09` · `id: llm-systems.low-precision-quantization` · 34h · prerequisites: SYS07, PT10, LA09 · proposed bank: `sys-09-low-precision-quantization`

**Spine and derivations:** Symmetric/asymmetric quantization, per-channel/group scales, clipping/outliers, accumulation precision, weight/activation/state compression, and error propagation.

**Interactive experiment:** `sys-low-precision-quantization` — Change scale/group size and outliers; show saturation and task-sensitive error hidden by average tensor MSE.

**Implementation ladder:** Implement quantize_dequantize, error_by_channel, and layer_output_audit.

**RE gate:** Compare quality, memory, and latency on supported kernels rather than size alone.

**RS gate:** Justify a calibration dataset and analyze where numerical error changes behavior.

### Part III · Distributed training

*Thesis: the global objective and recoverable state must survive partitioning.*

**Module 10 — Collectives and data-parallel training**

`handle: SYS10` · `id: llm-systems.collectives-data-parallel` · 34h · prerequisites: SYS04, PT13, SYS06 · proposed bank: `sys-10-collectives-data-parallel`

**Spine and derivations:** All-reduce/all-gather/reduce-scatter, topology and bandwidth models, buckets/overlap, weighted gradients, rank failure, and collective ordering.

**Interactive experiment:** `sys-collectives-data-parallel` — Change message sizes and rank arrival times; show deadlock and incorrect unequal-batch normalization.

**Implementation ladder:** Implement collective_simulator, two_process_gradient_parity, and communication_timeline.

**RE gate:** Match a single-process oracle and diagnose a collective-order hang.

**RS gate:** Derive communication cost under explicit topology assumptions and distinguish weak from strong scaling.

**Module 11 — Sharding, tensor parallelism, and pipeline parallelism**

`handle: SYS11` · `id: llm-systems.sharding-parallelism` · 38h · prerequisites: SYS10, LA21 · proposed bank: `sys-11-sharding-parallelism`

**Spine and derivations:** Parameter/gradient/optimizer sharding, activation partitioning, tensor-parallel matmuls, pipeline schedules, bubble cost, and checkpoint ownership.

**Interactive experiment:** `sys-sharding-parallelism` — Change partition count and microbatches; display memory savings, communication, and pipeline bubbles.

**Implementation ladder:** Implement shard_reassemble, pipeline_schedule_simulator, and a small local sharded run where hardware permits.

**RE gate:** Reconstruct identical weights and optimizer state from shards and account for replicated memory.

**RS gate:** Choose a partition from a cost model and identify workload regimes where it becomes worse.

**Module 12 — Distributed data, checkpoints, and fault recovery**

`handle: SYS12` · `id: llm-systems.distributed-data-recovery` · 34h · prerequisites: SYS11, PT11, PY12 · proposed bank: `sys-12-distributed-data-recovery`

**Spine and derivations:** Global sample identity, resharding, checkpoint consistency, atomic manifests, interrupted collectives, and at-least-once versus exactly-once processing claims.

**Interactive experiment:** `sys-distributed-data-recovery` — Kill a simulated rank at each commit boundary; show inconsistent shard sets and duplicate data after restart.

**Implementation ladder:** Implement checkpoint_manifest_validator, reshard_reference, and fault_replay.

**RE gate:** Recover a valid global state or reject an incomplete checkpoint clearly.

**RS gate:** Explain how replayed or omitted data affects reproducibility and paired treatment comparisons.

**Module 13 — Expert parallelism and long-context training**

`handle: SYS13` · `id: llm-systems.expert-parallel-long-context` · 34h · prerequisites: SYS11, DL15, SYS08 · proposed bank: `sys-13-expert-parallel-long-context`

**Spine and derivations:** All-to-all routing, load skew, capacity/drop semantics, sequence/context parallelism, activation memory, and positional extension assumptions.

**Interactive experiment:** `sys-expert-parallel-long-context` — Vary expert skew and sequence length; show stragglers, token drops, and quadratic-memory limits.

**Implementation ladder:** Implement route_exchange_simulator, load_skew_report, and long_context_cost_model.

**RE gate:** Match routing outputs to a dense reference and report worst-rank resource use.

**RS gate:** Separate algorithmic quality changes from altered capacity, context, or token-dropping policy.

**Module 14 — Reliable training and observability**

`handle: SYS14` · `id: llm-systems.training-reliability` · 32h · prerequisites: SYS12, SYS09 · proposed bank: `sys-14-training-reliability`

**Spine and derivations:** NaN/overflow detection, gradient anomalies, stalled workers, hardware/data failure signals, rollback policies, run health, and complete incident records.

**Interactive experiment:** `sys-training-reliability` — Inject corrupt batches and delayed ranks; compare symptom detection with root-cause evidence.

**Implementation ladder:** Implement health_monitor, failure_injection_suite, and incident_replay_bundle.

**RE gate:** Localize a training failure and resume without concealing skipped updates or data.

**RS gate:** Determine which runs remain comparable after intervention and which need repetition.

### Part IV · Inference and adaptation

*Thesis: serving cost depends on request structure and quality constraints.*

**Module 15 — KV caches, decoding, and incremental equivalence**

`handle: SYS15` · `id: llm-systems.kv-cache-decoding` · 30h · prerequisites: SYS02, NLP13, PT12 · proposed bank: `sys-15-kv-cache-decoding`

**Spine and derivations:** Prefill versus decode, cache indexing, positional offsets, grouped-query attention, memory accounting, and incremental/full-sequence parity.

**Interactive experiment:** `sys-kv-cache-decoding` — Change cache position and batch reorder; show silent position errors and memory growth with context.

**Implementation ladder:** Implement kv_cache_reference, incremental_parity, and cache_memory_estimate.

**RE gate:** Match cached and uncached logits across variable lengths and reordered requests.

**RS gate:** Explain how cache/layout choices affect cost while preserving or changing the model function.

**Module 16 — Continuous batching and serving schedulers**

`handle: SYS16` · `id: llm-systems.batching-serving` · 34h · prerequisites: SYS15, DS05, PY09 · proposed bank: `sys-16-batching-serving`

**Spine and derivations:** Admission, prefill/decode scheduling, cache pages, cancellation, queueing, head-of-line blocking, time-to-first-token, and inter-token latency.

**Interactive experiment:** `sys-batching-serving` — Change arrival distribution and length skew; show throughput gains with unacceptable tail latency.

**Implementation ladder:** Implement serving_event_simulator, page_allocator_reference, and workload_replay.

**RE gate:** Report throughput and p50/p95/p99 latency at fixed workload and quality.

**RS gate:** Explain why a closed-loop benchmark can hide overload and choose an appropriate arrival model.

**Module 17 — Speculative decoding and compressed inference**

`handle: SYS17` · `id: llm-systems.speculative-compression` · 32h · prerequisites: SYS16, SYS09, PS02 · proposed bank: `sys-17-speculative-compression`

**Spine and derivations:** Draft/target sampling, exact rejection correction under stated distributions, acceptance/cost tradeoffs, quantized-cache error, and quality-aware compression.

**Interactive experiment:** `sys-speculative-compression` — Change draft accuracy and proposal cost; show negative speedup and biased output from omitted correction.

**Implementation ladder:** Implement finite_speculative_sampler, acceptance_cost_model, and distribution_parity_check.

**RE gate:** Verify the finite output distribution before benchmarking token throughput.

**RS gate:** Derive the correction rule and distinguish exact speculative sampling from heuristic acceptance.

**Module 18 — Instruction tuning and parameter-efficient adaptation**

`handle: SYS18` · `id: llm-systems.sft-efficient-finetuning` · 32h · prerequisites: SYS04, DL10, NLP12 · proposed bank: `sys-18-sft-efficient-finetuning`

**Spine and derivations:** Chat serialization, response-only masking, packed supervision, low-rank/quantized adaptation, reference objectives, and base-model regression tests.

**Interactive experiment:** `sys-sft-efficient-finetuning` — Change template and mask boundaries; show training on user text or special tokens unintentionally.

**Implementation ladder:** Implement sft_collator, response_mask_audit, and adapter_training_recipe.

**RE gate:** Match intended target tokens and report adapter/full-model memory and quality fairly.

**RS gate:** Separate dataset, template, and optimization effects with controlled ablations.

**Module 19 — Post-training rollout and learner systems**

`handle: SYS19` · `id: llm-systems.posttraining-systems` · 34h · prerequisites: SYS18, RL10, SYS16 · proposed bank: `sys-19-posttraining-systems`

**Spine and derivations:** Actor/learner separation, rollout batching, policy versions, reward/advantage records, stale samples, KL reference state, and checkpoint coordination.

**Interactive experiment:** `sys-posttraining-systems` — Delay policy updates and alter rollout length; show off-policy ratios and mixed-version batches.

**Implementation ladder:** Implement versioned_rollout_record, policy_lag_audit, and actor_learner_simulator.

**RE gate:** Reconstruct which policy generated every token and reproduce learner loss from stored records.

**RS gate:** Explain which lag/reuse assumptions the chosen policy-gradient estimator requires.

### Part V · Systems research

*Thesis: a performance claim needs a correctness oracle and a representative workload.*

**Module 20 — Systems research and performance methodology**

`handle: SYS20` · `id: llm-systems.systems-research-study` · 30h · prerequisites: SYS14, SYS17, RP04 · proposed bank: `sys-20-systems-research-study`

**Spine and derivations:** Representative workloads, kernel versus application speed, tuning fairness, hardware disclosure, numerical quality checks, scaling efficiency, and negative results.

**Interactive experiment:** `sys-systems-research-study` — Change input distribution or utilization; show a headline speedup vanish under realistic workload replay.

**Implementation ladder:** Implement benchmark_manifest, paired_performance_report, and quality_cost_frontier.

**RE gate:** Reproduce a baseline and optimization under identical workload and correctness criteria.

**RS gate:** Defend the causal source of the gain and the regimes where the claim is unsupported.

**Module 21 — Capstone: a training or serving systems study**

`handle: SYS21` · `id: llm-systems.capstone-training-or-serving` · 50h · prerequisites: SYS20 · proposed bank: `sys-21-capstone-training-or-serving`

**Spine and derivations:** No new theory: choose one bottleneck, build a correct reference, optimize, measure end-to-end impact, and inject failures.

**Interactive experiment:** `sys-capstone-training-or-serving` — Present latency/throughput/memory/quality curves and a failure-recovery timeline.

**Implementation ladder:** Deliver baseline, optimization, benchmark suite, and a reproducible systems report.

**RE gate:** Meet a declared resource goal without losing objective correctness or recoverability.

**RS gate:** Predict a held-out workload result and explain the observed limit of the optimization.

## 5. Write order and milestones

Write SYS02–SYS04 first. SYS05 is the scaling-science branch. SYS06–SYS09 build the accelerator branch; SYS10–SYS14 build distributed training. SYS15–SYS17 can begin after a correct decoder without waiting for sharding. SYS18 is adaptation; SYS19 joins RL only after RL10. SYS20–SYS21 integrate measured systems work. CPU simulations are valid prerequisite exercises, but real multi-device proficiency requires a separately labeled hardware run.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Choose training reliability/throughput or serving latency/cost. Release a correct reference, one optimization, complete benchmark manifests, raw traces, numerical/quality checks, and fault recovery. Include small CPU reference work, a declared single-accelerator experiment, and optional multi-device scaling; never extrapolate a simulated speedup into a hardware claim.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add roofline, tiled-softmax, collective/pipeline timeline, shard-state, KV-cache, and request-queue views. These should reuse chartkit and heatkit. Custom kernels and distributed runs are local optional hardware tiers with explicit memory and time budgets. No paid cluster allocation is implied by this plan.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
