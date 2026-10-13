# Deep learning advanced — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

This track begins where [Deep Learning Core](../09-deep-learning-core/_plan.md) ends. Core builds every standard architecture from first principles: threshold units, backpropagation, optimization, batch normalization and dropout, CNNs, RNNs/LSTMs, CTC, attention and transformers, autoencoders, VAEs, flows and diffusion, GANs, GNNs, and energy-based memories. Advanced studies why trained networks behave as they do, what representations they learn, which modern building blocks Core leaves out, and which research claims survive intervention.

**Entry route.** A learner needs Core NN01–NN08 and its P1 project before any module here. Each module also lists the Core branch it builds on: NN10 for vision, NN12 for sequences, NN15 for attention, and NN19/NN24 for generative models. Advanced does not re-teach Core. Where a topic starts in Core, the brief names the Core module and covers only the material beyond it.

**Restructure note.** This plan replaces the earlier 18-unit deep learning plan (DL02–DL19). Units that Core now teaches in full were removed: MLPs and backpropagation (now NN02–NN05), autoencoders and variational models (now NN17–NN18). Initialization, normalization and residuals, loss design, convolution, and recurrent/state-space models were narrowed to the parts Core leaves out. Representation, generative, and research units were kept and renumbered. §8 maps every old handle to its new home.

**Legacy-page review:** Keep the [backpropagation, initialization, and regularization overview](01-backprop-initialization-regularization.md) for now. It is a useful NumPy-to-autograd bridge: a complete batched ReLU-network backward pass, an initialization argument, and a dropout exercise. Retire it once Core NN05 and NN08 and Advanced DLA02 have absorbed its examples. See the [cross-track audit](../_legacy-audit.md) for the removal criteria.

**Scope:** 15 units; 460 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; the retained overview (01) is outside the sequence.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `DLA02` refer to this plan; `NN08` refers to the Core track, and `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `deep-learning-advanced.<slug>`. Proposed answer banks (`dla-NN-<slug>`) and lab IDs (`dla-<slug>`) are namespaced, are not yet registered, and must be validated when implemented.

**Track-specific rule.** Inherit Core's implementation discipline. Any new layer or objective gets a hand-written forward and backward pass with a finite-difference check before a framework version is used. Every symbol's tensor shape is stated at first use.

**Ownership boundary.** Core owns first-principles architectures and their training rules. This track owns signal-propagation theory, modern building blocks beyond Core, representation learning, controlled architectural experiments, and research evidence. LA owns adjoint geometry, optimization owns convergence and optimizer mechanics, probability owns ELBO and diffusion probability derivations, NLP owns language data, and LLM Systems owns scaled implementation.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| DLA02 | Initialization and signal propagation | 30 | NN08, PS12, PT09 |
| DLA03 | Layer normalization, residual pathways, and weight decay | 26 | DLA02, NN15, PT06 |
| DLA04 | Loss design beyond cross-entropy | 22 | NN08, PS06 |
| DLA05 | Equivariance and modern vision architectures | 26 | NN10, DLA03 |
| DLA06 | State-space and linear-recurrent sequence models | 28 | NN12, LA07 |
| DLA07 | Self-supervision and contrastive learning | 30 | NN15, DLA04, IL04 |
| DLA08 | Transfer learning and efficient adaptation | 28 | DLA07, LA19 |
| DLA09 | Multimodal representations and fusion | 30 | DLA05, DLA07 |
| DLA10 | Sparse experts and conditional computation | 30 | NN15, OPT04 |
| DLA11 | Advanced flows and energy-based training | 30 | NN19, NN24, PS09 |
| DLA12 | Diffusion and flow matching beyond DDPM | 36 | NN19, PS15, OPT02 |
| DLA13 | Interpretability and causal interventions | 34 | DLA07, LA25, PS16 |
| DLA14 | Robustness, uncertainty, and data failures | 30 | DLA08, PS13, ML13 |
| DLA15 | Representation dynamics and architecture research | 32 | DLA10, DLA13, DLA14, RP04 |
| DLA16 | Capstone: a defensible architecture study | 48 | DLA15 |

## 4. Detailed module briefs

### Part I · Signal propagation and modern building blocks

*Thesis: whether a deep network trains at all is decided by signal scales, normalization axes, and objective design, which Core treats only as working tools.*

**Module 02 — Initialization and signal propagation**

`handle: DLA02` · `id: deep-learning-advanced.initialization-signal` · 30h · prerequisites: NN08, PS12, PT09 · proposed bank: `dla-02-initialization-signal`

**Builds on Core:** NN05 (backward recursion), NN08 (batch normalization).

**Spine and derivations:** Variance propagation, fan-in/fan-out, Xavier/He assumptions, gradient scale, saturation, and dynamical-isometry intuition; distinguish iid approximations from exact results.

**Interactive experiment:** `dla-initialization-signal` — Change depth, width, and activation; show activation/gradient variance collapse and correlated-input failures.

**Implementation ladder:** Implement initialization_sweep, layer_signal_log, and jacobian_spectrum_probe.

**RE gate:** Diagnose a deep network that fails before useful learning begins.

**RS gate:** Derive a variance recurrence and state where independence approximations break.

**Module 03 — Layer normalization, residual pathways, and weight decay**

`handle: DLA03` · `id: deep-learning-advanced.normalization-residuals` · 26h · prerequisites: DLA02, NN15, PT06 · proposed bank: `dla-03-normalization-residuals`

**Builds on Core:** NN08 (batch normalization, dropout, weight decay as a step), NN15 (pre- versus post-norm blocks).

**Spine and derivations:** Layer and RMS normalization and their axis choices against batch normalization; residual Jacobians and signal scale through depth; residual-branch scaling; decoupled weight decay versus L2 regularization under adaptive optimizers.

**Interactive experiment:** `dla-normalization-residuals` — Change normalization axes, residual scale, and depth; expose train/eval mismatch, singleton-batch pathologies, and residual-stream growth.

**Implementation ladder:** Implement layernorm_forward_backward, rmsnorm_forward_backward, and residual_scale_probe.

**RE gate:** Match normalization derivatives and state behavior on degenerate inputs.

**RS gate:** Explain a normalization or regularization effect without confusing optimization with generalization.

**Module 04 — Loss design beyond cross-entropy**

`handle: DLA04` · `id: deep-learning-advanced.loss-design` · 22h · prerequisites: NN08, PS06 · proposed bank: `dla-04-loss-design`

**Builds on Core:** NN04 (L2, KL and cross-entropy divergences, label smoothing).

**Spine and derivations:** Ranking and contrastive objectives, class imbalance and reweighting, robust losses under outliers and label noise, masking and reduction, and surrogate consistency in simple cases; connect output parameterization to target support.

**Interactive experiment:** `dla-loss-design` — Vary outliers and label noise; show divergent behavior of squared, absolute, and logistic losses.

**Implementation ladder:** Implement stable_losses, weighted_objective, and gradient_profile.

**RE gate:** Choose a loss with correct masking and reduction for the task.

**RS gate:** Derive the conditional-risk minimizer and show when a surrogate optimizes the wrong target.

**Module 05 — Equivariance and modern vision architectures**

`handle: DLA05` · `id: deep-learning-advanced.equivariance-vision` · 26h · prerequisites: NN10, DLA03 · proposed bank: `dla-05-equivariance-vision`

**Builds on Core:** NN09–NN10 (convolution, its backward pass, padding/stride rules, and CNN architectures through ResNet).

**Spine and derivations:** Translation equivariance as a precise statement and its boundary conditions; how subsampling and padding break it; group-equivariant layers; inductive bias of CNNs against patch-based vision transformers; modern convolutional designs.

**Interactive experiment:** `dla-equivariance-vision` — Shift an image and vary padding/stride; display where equivariance fails and how receptive fields grow.

**Implementation ladder:** Implement equivariance_test, group_conv_reference, and patch_embedding.

**RE gate:** Measure equivariance error for a reference CNN across shifts, paddings, and strides.

**RS gate:** Prove an equivariance statement under explicit boundary assumptions and show its failure after subsampling.

**Module 06 — State-space and linear-recurrent sequence models**

`handle: DLA06` · `id: deep-learning-advanced.state-space-models` · 28h · prerequisites: NN12, LA07 · proposed bank: `dla-06-state-space-models`

**Builds on Core:** NN11–NN12 (RNNs, BPTT, the Jacobian chain, LSTMs and GRUs).

**Spine and derivations:** Continuous state-space models and their discretization; the convolutional view of linear recurrences; parallel scans; spectral parameterizations; selective (input-dependent) variants as extensions; what linear-system stability results do and do not transfer.

**Interactive experiment:** `dla-state-space-models` — Vary recurrent spectrum and sequence length; show stable eigenvalues with transient growth and truncated-gradient bias.

**Implementation ladder:** Implement discretize_ssm, linear_state_space_scan, and ssm_convolution_kernel.

**RE gate:** Compare sequential and convolutional linear-state outputs on a small oracle.

**RS gate:** Derive gradient propagation and state which linear-system conclusions do not transfer to input-dependent recurrences.

### Part II · Representation learning

*Thesis: what a network learns is fixed by its objective and data, and representations must be evaluated by protocols that cannot leak.*

**Module 07 — Self-supervision and contrastive learning**

`handle: DLA07` · `id: deep-learning-advanced.self-supervised-contrastive` · 30h · prerequisites: NN15, DLA04, IL04 · proposed bank: `dla-07-self-supervised-contrastive`

**Spine and derivations:** Positive-pair definitions, augmentations, contrastive losses, negative sampling, collapse, stop-gradient mechanisms, and linear-probe evaluation.

**Interactive experiment:** `dla-self-supervised-contrastive` — Change augmentations and negatives; show shortcut solutions and representation collapse with a misleading loss.

**Implementation ladder:** Implement contrastive_loss, augmentation_audit, and frozen_probe_protocol.

**RE gate:** Build a reproducible representation experiment with data-independent probe splits.

**RS gate:** Defend whether the objective preserves task-relevant information and give a harmful augmentation example.

**Module 08 — Transfer learning and efficient adaptation**

`handle: DLA08` · `id: deep-learning-advanced.transfer-adaptation` · 28h · prerequisites: DLA07, LA19 · proposed bank: `dla-08-transfer-adaptation`

**Spine and derivations:** Frozen versus full tuning, low-rank updates, adapter placement, forgetting, few-shot selection, and transfer under distribution mismatch.

**Interactive experiment:** `dla-transfer-adaptation` — Change adapter rank and target mismatch; show low training error with poor transfer and unreachable update directions.

**Implementation ladder:** Implement low_rank_adapter, merge_parity_check, and transfer_matrix.

**RE gate:** Verify adapter merging and compare methods at declared trainable-state and tuning budgets.

**RS gate:** Separate low-rank parameterization from an empirical claim that the optimal update has low rank.

**Module 09 — Multimodal representations and fusion**

`handle: DLA09` · `id: deep-learning-advanced.multimodal-fusion` · 30h · prerequisites: DLA05, DLA07 · proposed bank: `dla-09-multimodal-fusion`

**Spine and derivations:** Patch/audio representations, cross-attention, aligned objectives, modality missingness, synchronization, and modality dominance.

**Interactive experiment:** `dla-multimodal-fusion` — Drop or permute one modality; show performance driven by a shortcut in the other channel.

**Implementation ladder:** Implement multimodal_collate, cross_attention_fusion, and modality_ablation_suite.

**RE gate:** Handle missing or variable-length modalities without silent alignment mistakes.

**RS gate:** Design an intervention demonstrating information transfer across modalities rather than dataset leakage.

**Module 10 — Sparse experts and conditional computation**

`handle: DLA10` · `id: deep-learning-advanced.sparse-experts` · 30h · prerequisites: NN15, OPT04 · proposed bank: `dla-10-sparse-experts`

**Spine and derivations:** Routing, top-k dispatch, capacity limits, auxiliary balancing losses, expert collapse, and active versus total parameters.

**Interactive experiment:** `dla-sparse-experts` — Vary router temperature, capacity, and input skew; show dropped tokens and overloaded experts.

**Implementation ladder:** Implement router_reference, dispatch_combine, and load_balance_metrics.

**RE gate:** Match sparse and explicit-reference outputs and account for token drops.

**RS gate:** Compare sparse/dense models with clearly separated compute, parameter, and communication budgets.

### Part III · Generative modeling beyond the core

*Thesis: objectives and sampling procedures define what a model learns, and the sampler's error is a separate quantity from the objective's.*

**Module 11 — Advanced flows and energy-based training**

`handle: DLA11` · `id: deep-learning-advanced.flows-energy-models` · 30h · prerequisites: NN19, NN24, PS09 · proposed bank: `dla-11-flows-energy-models`

**Builds on Core:** NN19 (change of variables, invertible flows), NN23–NN24 (Hopfield energy, Boltzmann machines, contrastive divergence).

**Spine and derivations:** Coupling and autoregressive flows with tractable Jacobian determinants; continuous-time flows; energy-based models over continuous inputs; score-based and noise-contrastive training; Langevin sampling and its diagnostics.

**Interactive experiment:** `dla-flows-energy-models` — Change invertibility and sampler step size; show a density sign error and a trapped Markov chain.

**Implementation ladder:** Implement affine_coupling, inverse_roundtrip, and langevin_energy_sampler.

**RE gate:** Verify forward/inverse log-density consistency and compare samples with a finite or analytic oracle.

**RS gate:** Explain bias from incomplete MCMC mixing and distinguish normalized likelihood from unnormalized energy.

**Module 12 — Diffusion and flow matching beyond DDPM**

`handle: DLA12` · `id: deep-learning-advanced.diffusion-flow-matching` · 36h · prerequisites: NN19, PS15, OPT02 · proposed bank: `dla-12-diffusion-flow-matching`

**Builds on Core:** NN19 (forward noising, DDPM sampling, the reverse SDE and probability-flow ODE, classifier-free guidance).

**Spine and derivations:** Noise and target parameterizations and their equivalences; ODE/SDE solver choice and discretization error; flow-matching conditional velocities and rectified paths; few-step sampling and distillation; guidance as a fidelity–diversity trade-off.

**Interactive experiment:** `dla-diffusion-flow-matching` — Change schedule, step count, and guidance; show quality/diversity tradeoffs and instability at coarse steps.

**Implementation ladder:** Implement flow_matching_velocity, ode_sampler_with_error_log, and parameterization_converter on two-dimensional data.

**RE gate:** Reproduce a known target distribution with logged solver and compute settings.

**RS gate:** Derive the selected training target and separate objective approximation from sampling error.

### Part IV · Research evidence

*Thesis: behavior, mechanism, and robustness require different experiments.*

**Module 13 — Interpretability and causal interventions**

`handle: DLA13` · `id: deep-learning-advanced.interpretability-mechanisms` · 34h · prerequisites: DLA07, LA25, PS16 · proposed bank: `dla-13-interpretability-mechanisms`

**Spine and derivations:** Probes versus mechanisms, activation patching, ablation controls, superposition and sparse dictionaries as linked LA results, and causal ambiguity.

**Interactive experiment:** `dla-interpretability-mechanisms` — Patch relevant and control activations; show off-manifold interventions and a predictive but noncausal probe.

**Implementation ladder:** Implement activation_capture, controlled_patch, and sparse_feature_audit.

**RE gate:** Produce reproducible intervention effects with matched controls and artifact provenance.

**RS gate:** Defend a narrowly stated mechanism claim and identify alternative explanations.

**Module 14 — Robustness, uncertainty, and data failures**

`handle: DLA14` · `id: deep-learning-advanced.robustness-uncertainty` · 30h · prerequisites: DLA08, PS13, ML13 · proposed bank: `dla-14-robustness-uncertainty`

**Spine and derivations:** Corruptions, adversarial perturbations under explicit norms, ensembles, epistemic/aleatoric distinctions, OOD limits, and subgroup failure analysis.

**Interactive experiment:** `dla-robustness-uncertainty` — Change perturbation norm or corruption severity; show gradient masking and aggregate metrics hiding brittle slices.

**Implementation ladder:** Implement corruption_suite, constrained_attack, and uncertainty_shift_report.

**RE gate:** Evaluate attacks with independent checks and avoid interpreting attack failure as robustness proof.

**RS gate:** State the threat model and separate empirical robustness from certified guarantees.

**Module 15 — Representation dynamics and architecture research**

`handle: DLA15` · `id: deep-learning-advanced.representation-research` · 32h · prerequisites: DLA10, DLA13, DLA14, RP04 · proposed bank: `dla-15-representation-research`

**Spine and derivations:** Learning curves, matched-compute ablations, feature drift, similarity invariances, scaling controls, and hypothesis-driven architecture changes.

**Interactive experiment:** `dla-representation-research` — Compare representation metrics before/after basis changes; reveal a metric shift with unchanged predictions.

**Implementation ladder:** Implement representation_similarity, architecture_ablation, and compute_quality_frontier.

**RE gate:** Reproduce a baseline architecture and log all substantive implementation differences.

**RS gate:** Prestate a mechanism prediction and design an experiment that could falsify it.

**Module 16 — Capstone: a defensible architecture study**

`handle: DLA16` · `id: deep-learning-advanced.capstone-architecture-study` · 48h · prerequisites: DLA15 · proposed bank: `dla-16-capstone-architecture-study`

**Spine and derivations:** No new theory: a faithful baseline, one substantive architectural change, numerical parity tests, budget controls, and mechanistic or behavioral evidence.

**Interactive experiment:** `dla-capstone-architecture-study` — Display all seeds and budget curves, including failures and a held-out evaluation condition.

**Implementation ladder:** Deliver reference model, ablation runner, and paper-style report with executable figures. Build on the Core NN25 library where the chosen architecture allows it.

**RE gate:** Show a useful performance/cost tradeoff with correctness and resumption evidence.

**RS gate:** Defend the hypothesis, a negative control, and the boundary of the result's generality.

## 5. Write order and milestones

Write DLA02–DLA04 first: they are the shared bridge from Core, and DLA04 feeds the representation units. DLA05–DLA06 extend Core's vision and sequence branches and can be written in either order. DLA07–DLA08 build representation/transfer skills; DLA09–DLA10 are specialization units. DLA11–DLA12 form the generative branch and need only Core's generative modules. DLA13–DLA15 provide the research synthesis before DLA16.

A learner can begin LLM Systems after Core NN15 without any Advanced module. DLA10 (sparse experts) and DLA08 (efficient adaptation) are the Advanced prerequisites that LLM Systems later draws on.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Choose one architecture question in vision, sequences, generative modeling, or multimodal learning. Reproduce a small baseline, predict the effect of one change, test at matched resources, and release executable figures. Include a held-out condition and a result that constrains the original hypothesis.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add signal-propagation, equivariance, state-space, modality-ablation, and expert-routing views. Generative visualizations use two-dimensional distributions in-browser; model training runs locally. Specialist projects declare CPU, single-accelerator, and optional larger-scale variants without equating them.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Reuse Core's visual primitives where they exist; build new shared primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For planning changes, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.

## 8. Handle migration from the earlier plan

Every handle from the earlier deep learning plan maps to one place. Use this table to update any external note or route that still cites an old handle.

| Old handle | Old module | New home |
|---|---|---|
| DL02 | MLPs and backpropagation from primitives | Core NN02–NN05 |
| DL03 | Loss functions and prediction objectives | Core NN04 for divergences; DLA04 for the rest |
| DL04 | Initialization and signal propagation | DLA02 |
| DL05 | Normalization, residual pathways, and regularization | Core NN08 for batch norm and dropout; DLA03 for the rest |
| DL06 | Convolution, equivariance, and vision models | Core NN09–NN10 for convolution; DLA05 for equivariance |
| DL07 | Attention and transformer blocks | Core NN15 |
| DL08 | Recurrent, gated, and state-space sequence models | Core NN11–NN12 for RNNs and gating; DLA06 for state-space models |
| DL09 | Self-supervision and contrastive learning | DLA07 |
| DL10 | Transfer learning and efficient adaptation | DLA08 |
| DL11 | Autoencoders and variational models | Core NN17–NN18 |
| DL12 | Normalizing flows and energy-based models | DLA11 |
| DL13 | Diffusion and flow-matching models | DLA12 |
| DL14 | Multimodal representations and fusion | DLA09 |
| DL15 | Sparse experts and conditional computation | DLA10 |
| DL16 | Interpretability and causal interventions | DLA13 |
| DL17 | Robustness, uncertainty, and data failures | DLA14 |
| DL18 | Representation dynamics and architecture research | DLA15 |
| DL19 | Capstone: a defensible architecture study | DLA16 |
