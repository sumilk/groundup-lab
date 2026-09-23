# Deep learning — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Build networks from their computational and statistical assumptions, then study why they train, what representations they learn, and which claims survive intervention. Cover vision, sequence, generative, and multimodal models as well as transformers.

The [backpropagation, initialization, and regularization overview](01-backprop-initialization-regularization.md) is retained. Detailed units reserve 02–19. A learner should implement the first MLP in NumPy before relying on a framework trainer.

**Scope:** 18 units; 570 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `DL02` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `deep-learning.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own network architectures, representation learning, and controlled architectural experiments. LA owns adjoint geometry, optimization owns convergence and optimizer mechanics, probability owns ELBO and diffusion probability derivations, NLP owns language data, and LLM Systems owns scaled implementation.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| DL02 | MLPs and backpropagation from primitives | 30 | PY07, OPT02 |
| DL03 | Loss functions and prediction objectives | 26 | DL02, PS06 |
| DL04 | Initialization and signal propagation | 30 | DL02, PS12, PT09 |
| DL05 | Normalization, residual pathways, and regularization | 30 | DL04, PT06 |
| DL06 | Convolution, equivariance, and vision models | 30 | DL05 |
| DL07 | Attention and transformer blocks | 34 | DL05, LA08 |
| DL08 | Recurrent, gated, and state-space sequence models | 30 | DL05, LA07 |
| DL09 | Self-supervision and contrastive learning | 30 | DL07, IL04 |
| DL10 | Transfer learning and efficient adaptation | 28 | DL09, LA19 |
| DL11 | Autoencoders and variational models | 30 | DL05, PS14 |
| DL12 | Normalizing flows and energy-based models | 32 | DL11, PS03, PS09 |
| DL13 | Diffusion and flow-matching models | 36 | DL11, PS15, OPT02 |
| DL14 | Multimodal representations and fusion | 30 | DL06, DL07, DL09 |
| DL15 | Sparse experts and conditional computation | 30 | DL07, OPT04 |
| DL16 | Interpretability and causal interventions | 34 | DL09, LA25, PS16 |
| DL17 | Robustness, uncertainty, and data failures | 30 | DL10, PS13, ML13 |
| DL18 | Representation dynamics and architecture research | 32 | DL15, DL16, DL17, RP04 |
| DL19 | Capstone: a defensible architecture study | 48 | DL18 |

## 4. Detailed module briefs

### Part I · Trainable functions

*Thesis: an architecture is a parameterized function with explicit derivatives and signal scales.*

**Module 02 — MLPs and backpropagation from primitives**

`handle: DL02` · `id: deep-learning.mlp-backprop` · 30h · prerequisites: PY07, OPT02 · proposed bank: `dl-02-mlp-backprop`

**Spine and derivations:** Affine/nonlinear composition, expressivity counterexamples, squared/log losses, reverse accumulation, and batch reduction; derive a two-layer network gradient with explicit shapes.

**Interactive experiment:** `dl-mlp-backprop` — Change activation and hidden width; display fitted function, gradient flow, and a fully linear network collapse.

**Implementation ladder:** Implement mlp_forward, mlp_backward, and finite_difference_check in NumPy.

**RE gate:** Overfit a tiny dataset and match every parameter gradient to an independent check.

**RS gate:** Explain why a universal approximation statement does not imply learnability or efficient representation.

**Module 03 — Loss functions and prediction objectives**

`handle: DL03` · `id: deep-learning.losses-objectives` · 26h · prerequisites: DL02, PS06 · proposed bank: `dl-03-losses-objectives`

**Spine and derivations:** Likelihood-based losses, ranking/contrastive objectives, class imbalance, label smoothing, and surrogate consistency in simple cases; connect output parameterization to target support.

**Interactive experiment:** `dl-losses-objectives` — Vary outliers and label noise; show divergent behavior of squared, absolute, and logistic losses.

**Implementation ladder:** Implement stable_losses, weighted_objective, and gradient_profile.

**RE gate:** Choose a loss with correct masking and reduction for the task.

**RS gate:** Derive the conditional-risk minimizer and show when a surrogate optimizes the wrong target.

**Module 04 — Initialization and signal propagation**

`handle: DL04` · `id: deep-learning.initialization-signal` · 30h · prerequisites: DL02, PS12, PT09 · proposed bank: `dl-04-initialization-signal`

**Spine and derivations:** Variance propagation, fan-in/fan-out, Xavier/He assumptions, gradient scale, saturation, and dynamical-isometry intuition; distinguish iid approximations from exact results.

**Interactive experiment:** `dl-initialization-signal` — Change depth, width, and activation; show activation/gradient variance collapse and correlated-input failures.

**Implementation ladder:** Implement initialization_sweep, layer_signal_log, and jacobian_spectrum_probe.

**RE gate:** Diagnose a deep network that fails before useful learning begins.

**RS gate:** Derive a variance recurrence and state where independence approximations break.

**Module 05 — Normalization, residual pathways, and regularization**

`handle: DL05` · `id: deep-learning.normalization-residuals` · 30h · prerequisites: DL04, PT06 · proposed bank: `dl-05-normalization-residuals`

**Spine and derivations:** Batch/Layer/RMS normalization, axis choices, train/eval state, residual Jacobians, dropout expectation, and weight-decay distinctions.

**Interactive experiment:** `dl-normalization-residuals` — Change normalization axes, residual scale, and batch size; expose train/eval mismatch and singleton-batch pathologies.

**Implementation ladder:** Implement layernorm_forward_backward, residual_block, and dropout_expectation_check.

**RE gate:** Match normalization derivatives and state behavior on degenerate inputs.

**RS gate:** Explain a normalization or regularization effect without confusing optimization with generalization.

### Part II · Structured representations

*Thesis: inductive biases trade flexibility for assumptions about the input.*

**Module 06 — Convolution, equivariance, and vision models**

`handle: DL06` · `id: deep-learning.convolution-equivariance` · 30h · prerequisites: DL05 · proposed bank: `dl-06-convolution-equivariance`

**Spine and derivations:** Cross-correlation versus convolution, padding/stride/dilation, receptive fields, translation equivariance conditions, pooling, and residual CNNs.

**Interactive experiment:** `dl-convolution-equivariance` — Shift an image and vary padding/stride; display where equivariance fails and how receptive fields grow.

**Implementation ladder:** Implement conv2d_reference, conv_backward_small, and receptive_field_calculator.

**RE gate:** Match a framework convolution including boundary and gradient cases.

**RS gate:** Prove an equivariance statement under explicit boundary assumptions and show its failure after subsampling.

**Module 07 — Attention and transformer blocks**

`handle: DL07` · `id: deep-learning.attention-transformer` · 34h · prerequisites: DL05, LA08 · proposed bank: `dl-07-attention-transformer`

**Spine and derivations:** Scaled dot products, softmax attention, multi-head composition, causal masks, positional encodings, residual/norm order, and feed-forward blocks; derive core backward terms.

**Interactive experiment:** `dl-attention-transformer` — Move queries/keys and masks; expose uniform, saturated, all-masked, and future-token leakage cases.

**Implementation ladder:** Implement attention_reference, transformer_block, and causal_invariance_test.

**RE gate:** Match forward/backward reference behavior and verify that future-token changes cannot affect past outputs.

**RS gate:** Explain what softmax changes about score rank and distinguish attention weights from causal explanations.

**Module 08 — Recurrent, gated, and state-space sequence models**

`handle: DL08` · `id: deep-learning.recurrent-state-models` · 30h · prerequisites: DL05, LA07 · proposed bank: `dl-08-recurrent-state-models`

**Spine and derivations:** RNN/LSTM recurrences, backpropagation through time, exploding/vanishing Jacobian products, state-space discretization, convolutional views of linear recurrences, and selective variants as extensions.

**Interactive experiment:** `dl-recurrent-state-models` — Vary recurrent spectrum and sequence length; show stable eigenvalues with transient growth and truncated-gradient bias.

**Implementation ladder:** Implement rnn_bptt, gated_cell, and linear_state_space_scan.

**RE gate:** Compare sequential and convolutional linear-state outputs on a small oracle.

**RS gate:** Derive gradient propagation and state which linear-system conclusions do not transfer to input-dependent recurrences.

**Module 09 — Self-supervision and contrastive learning**

`handle: DL09` · `id: deep-learning.self-supervised-contrastive` · 30h · prerequisites: DL07, IL04 · proposed bank: `dl-09-self-supervised-contrastive`

**Spine and derivations:** Positive-pair definitions, augmentations, contrastive losses, negative sampling, collapse, stop-gradient mechanisms, and linear-probe evaluation.

**Interactive experiment:** `dl-self-supervised-contrastive` — Change augmentations and negatives; show shortcut solutions and representation collapse with a misleading loss.

**Implementation ladder:** Implement contrastive_loss, augmentation_audit, and frozen_probe_protocol.

**RE gate:** Build a reproducible representation experiment with data-independent probe splits.

**RS gate:** Defend whether the objective preserves task-relevant information and give a harmful augmentation example.

**Module 10 — Transfer learning and efficient adaptation**

`handle: DL10` · `id: deep-learning.transfer-adaptation` · 28h · prerequisites: DL09, LA19 · proposed bank: `dl-10-transfer-adaptation`

**Spine and derivations:** Frozen versus full tuning, low-rank updates, adapter placement, forgetting, few-shot selection, and transfer under distribution mismatch.

**Interactive experiment:** `dl-transfer-adaptation` — Change adapter rank and target mismatch; show low training error with poor transfer and unreachable update directions.

**Implementation ladder:** Implement low_rank_adapter, merge_parity_check, and transfer_matrix.

**RE gate:** Verify adapter merging and compare methods at declared trainable-state and tuning budgets.

**RS gate:** Separate low-rank parameterization from an empirical claim that the optimal update has low rank.

### Part III · Generative and multimodal models

*Thesis: objectives and sampling procedures define what a model learns.*

**Module 11 — Autoencoders and variational models**

`handle: DL11` · `id: deep-learning.autoencoders-vaes` · 30h · prerequisites: DL05, PS14 · proposed bank: `dl-11-autoencoders-vaes`

**Spine and derivations:** Reconstruction objectives, bottlenecks, reparameterization as reused probability theory, KL/reconstruction accounting, posterior collapse, and latent evaluation.

**Interactive experiment:** `dl-autoencoders-vaes` — Change decoder capacity and KL weight; show good reconstructions with unused latents and scale-dependent loss tradeoffs.

**Implementation ladder:** Implement gaussian_vae_terms, reparameterized_sample, and posterior_usage_report.

**RE gate:** Match analytic Gaussian KL and validate the training objective per observation.

**RS gate:** Explain what the ELBO bounds and why reconstruction alone does not validate a generative model.

**Module 12 — Normalizing flows and energy-based models**

`handle: DL12` · `id: deep-learning.flows-energy-models` · 32h · prerequisites: DL11, PS03, PS09 · proposed bank: `dl-12-flows-energy-models`

**Spine and derivations:** Invertible transformations, Jacobian determinants, coupling layers, energy normalization, contrastive divergence, and sampling diagnostics.

**Interactive experiment:** `dl-flows-energy-models` — Change invertibility and sampler step size; show a density sign error and a trapped Markov chain.

**Implementation ladder:** Implement affine_coupling, inverse_roundtrip, and small_energy_sampler.

**RE gate:** Verify forward/inverse log-density consistency and compare samples with a finite or analytic oracle.

**RS gate:** Explain bias from incomplete MCMC mixing and distinguish normalized likelihood from unnormalized energy.

**Module 13 — Diffusion and flow-matching models**

`handle: DL13` · `id: deep-learning.diffusion-flow-matching` · 36h · prerequisites: DL11, PS15, OPT02 · proposed bank: `dl-13-diffusion-flow-matching`

**Spine and derivations:** Denoising objectives, noise parameterizations, score connections from PS15, ODE/SDE sampling, flow-matching conditional velocities, guidance, and discretization error.

**Interactive experiment:** `dl-diffusion-flow-matching` — Change schedule, step count, and guidance; show quality/diversity tradeoffs and instability at coarse steps.

**Implementation ladder:** Implement toy_denoiser, diffusion_sampler, and flow_matching_velocity on two-dimensional data.

**RE gate:** Reproduce a known target distribution with logged solver and compute settings.

**RS gate:** Derive the selected training target and separate objective approximation from sampling error.

**Module 14 — Multimodal representations and fusion**

`handle: DL14` · `id: deep-learning.multimodal-fusion` · 30h · prerequisites: DL06, DL07, DL09 · proposed bank: `dl-14-multimodal-fusion`

**Spine and derivations:** Patch/audio representations, cross-attention, aligned objectives, modality missingness, synchronization, and modality dominance.

**Interactive experiment:** `dl-multimodal-fusion` — Drop or permute one modality; show performance driven by a shortcut in the other channel.

**Implementation ladder:** Implement multimodal_collate, cross_attention_fusion, and modality_ablation_suite.

**RE gate:** Handle missing or variable-length modalities without silent alignment mistakes.

**RS gate:** Design an intervention demonstrating information transfer across modalities rather than dataset leakage.

**Module 15 — Sparse experts and conditional computation**

`handle: DL15` · `id: deep-learning.sparse-experts` · 30h · prerequisites: DL07, OPT04 · proposed bank: `dl-15-sparse-experts`

**Spine and derivations:** Routing, top-k dispatch, capacity limits, auxiliary balancing losses, expert collapse, and active versus total parameters.

**Interactive experiment:** `dl-sparse-experts` — Vary router temperature, capacity, and input skew; show dropped tokens and overloaded experts.

**Implementation ladder:** Implement router_reference, dispatch_combine, and load_balance_metrics.

**RE gate:** Match sparse and explicit-reference outputs and account for token drops.

**RS gate:** Compare sparse/dense models with clearly separated compute, parameter, and communication budgets.

### Part IV · Research evidence

*Thesis: behavior, mechanism, and robustness require different experiments.*

**Module 16 — Interpretability and causal interventions**

`handle: DL16` · `id: deep-learning.interpretability-mechanisms` · 34h · prerequisites: DL09, LA25, PS16 · proposed bank: `dl-16-interpretability-mechanisms`

**Spine and derivations:** Probes versus mechanisms, activation patching, ablation controls, superposition and sparse dictionaries as linked LA results, and causal ambiguity.

**Interactive experiment:** `dl-interpretability-mechanisms` — Patch relevant and control activations; show off-manifold interventions and a predictive but noncausal probe.

**Implementation ladder:** Implement activation_capture, controlled_patch, and sparse_feature_audit.

**RE gate:** Produce reproducible intervention effects with matched controls and artifact provenance.

**RS gate:** Defend a narrowly stated mechanism claim and identify alternative explanations.

**Module 17 — Robustness, uncertainty, and data failures**

`handle: DL17` · `id: deep-learning.robustness-uncertainty` · 30h · prerequisites: DL10, PS13, ML13 · proposed bank: `dl-17-robustness-uncertainty`

**Spine and derivations:** Corruptions, adversarial perturbations under explicit norms, ensembles, epistemic/aleatoric distinctions, OOD limits, and subgroup failure analysis.

**Interactive experiment:** `dl-robustness-uncertainty` — Change perturbation norm or corruption severity; show gradient masking and aggregate metrics hiding brittle slices.

**Implementation ladder:** Implement corruption_suite, constrained_attack, and uncertainty_shift_report.

**RE gate:** Evaluate attacks with independent checks and avoid interpreting attack failure as robustness proof.

**RS gate:** State the threat model and separate empirical robustness from certified guarantees.

**Module 18 — Representation dynamics and architecture research**

`handle: DL18` · `id: deep-learning.representation-research` · 32h · prerequisites: DL15, DL16, DL17, RP04 · proposed bank: `dl-18-representation-research`

**Spine and derivations:** Learning curves, matched-compute ablations, feature drift, similarity invariances, scaling controls, and hypothesis-driven architecture changes.

**Interactive experiment:** `dl-representation-research` — Compare representation metrics before/after basis changes; reveal a metric shift with unchanged predictions.

**Implementation ladder:** Implement representation_similarity, architecture_ablation, and compute_quality_frontier.

**RE gate:** Reproduce a baseline architecture and log all substantive implementation differences.

**RS gate:** Prestate a mechanism prediction and design an experiment that could falsify it.

**Module 19 — Capstone: a defensible architecture study**

`handle: DL19` · `id: deep-learning.capstone-architecture-study` · 48h · prerequisites: DL18 · proposed bank: `dl-19-capstone-architecture-study`

**Spine and derivations:** No new theory: a faithful baseline, one substantive architectural change, numerical parity tests, budget controls, and mechanistic or behavioral evidence.

**Interactive experiment:** `dl-capstone-architecture-study` — Display all seeds and budget curves, including failures and a held-out evaluation condition.

**Implementation ladder:** Deliver reference model, ablation runner, and paper-style report with executable figures.

**RE gate:** Show a useful performance/cost tradeoff with correctness and resumption evidence.

**RS gate:** Defend the hypothesis, a negative control, and the boundary of the result's generality.

## 5. Write order and milestones

Write DL02–DL05 as the shared core. DL06–DL08 supply vision, attention, and recurrent/state-space branches. DL09–DL10 build representation/transfer skills; DL11–DL13 form the generative branch. DL14–DL15 are specialization units. DL16–DL18 provide the research synthesis before DL19. A learner can begin LLM Systems after DL07 without waiting for generative, multimodal, or interpretability electives.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Choose one architecture question in vision, sequences, generative modeling, or multimodal learning. Reproduce a small baseline, predict the effect of one change, test at matched resources, and release executable figures. Include a held-out condition and a result that constrains the original hypothesis.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add signal-propagation, convolution/receptive-field, sequence-state, modality-ablation, and expert-routing views. Generative visualizations use two-dimensional distributions in-browser; model training runs locally. Specialist projects declare CPU, single-accelerator, and optional larger-scale variants without equating them.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
