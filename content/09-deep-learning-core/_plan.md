# Deep learning core — lecture-series build plan

*An authoring brief in the [shared curriculum format](../_plans.md), built from a university lecture series on neural networks. It is a separate pipeline from the [Deep Learning Advanced track](../10-deep-learning-advanced/_plan.md) and changes nothing there. This file is excluded from the lesson reader.*

## 1. Target and current state

Follow one coherent lecture sequence from the threshold unit to Boltzmann machines. The sequence starts with what a network can represent, then derives how it learns. It builds each architecture from first principles: scanning networks become CNNs, recursion becomes RNNs, alignment leads to CTC, and attention leads to transformers. It then covers the generative families and energy-based models. The track is implementation-heavy: every forward pass the learner uses must first be written and differentiated by hand.

**Coverage audit:** 1 authored lesson (NN01) with 14 interactive panels (10 progress activities, an overview, and 3 additional figures), 19 generated SVG figures, 7 registered browser Python tasks, and a 26-entry answer bank; NN02–NN25 are planned. NN01 has a core reading route, optional historical/spectral/cylinder extensions, static section solutions, and focused mathematical checks. **Planned scope:** 25 modules and 714 estimated study hours, including four cumulative projects and the capstone. These are planning estimates, not elapsed-time requirements.

**Status vocabulary.** NN01 is *authored*; every other module below is *planned*. A proposed lesson ID, answer bank, lab ID or function name is a reservation, not a registered implementation. Do not advance reader or curriculum completion state until the lesson and its checks exist.

**Relationship to the Deep Learning Advanced track.** This track is independent. It does not edit, renumber or satisfy the gates of `10-deep-learning-advanced`, and that track's counts and handles are unchanged. Where both cover a topic (§7), the two treatments stay separate. A learner may use either one, but passing one module's gate does not automatically pass the other's. This track also teaches material the DL plan does not: Boolean and threshold-circuit expressivity, perceptron/ADALINE/MADALINE history, Viterbi/CTC alignment, Hopfield networks, and Boltzmann machines.

## 2. Source pipeline

The lecture series is the primary source. It is ingested by a script, never copied into the repository.

1. **Sync.** Run `pnpm nn:sync`, which runs `node scripts/neural-networks/sync-sources.mjs`. It writes [`_sources.json`](_sources.json) with the lecture numbers, dates, topics, slide/video links and reading lists for every configured offering. The most recent offering is the primary schedule; the previous one supplies slides and readings for lectures not yet released. Add `--readings` to cache course-hosted reading PDFs, and `--refresh` to re-download.
2. **Cache.** Slides, readings, and extracted text land in `work/neural-networks/<offering>/{slides,readings,text}`. `work/` is gitignored, so these stay local authoring references and are never published. Text extraction uses `pdftotext` (`brew install poppler`) or a Python with `pypdf` (`NN_PYTHON=/path/to/python`).
3. **Map.** Every lecture in every synced offering appears in exactly one module's *Lectures* cell (§3) or in the excluded list. When a new offering is synced, extend the map before authoring.
4. **Author.** Write the lesson from the brief, the cached slide text, and the lecture video. Then cross-check against the readings listed in the brief. Lessons are original teaching text in this curriculum's voice and format; slides are a reference, not a template, and no slide text or figure is copied.
5. **Figures and labs.** Generated figures go in `scripts/figures/nnNN.mjs` with names prefixed `nnNN-`. Browser tasks register in `labs/browser_labs.json` with the lesson path `09-deep-learning-core/NN-<slug>.md`. Answer banks are `public/theory/answers/nn-NN-<slug>.js`.
6. **Check.** `pnpm nn:check` validates the manifest, the lecture map, every brief, and every authored lesson (front matter, prerequisite resolution, answer-bank structure, and the textbook-standard checks). Then run `pnpm theory:build` and `pnpm theory:check` as for any track.

**Lectures excluded from the map:** F26 0; S26 0. These are course-logistics lectures with no teachable content.

## 3. Module map

Prerequisite handles use the [shared key](../_plans.md#3-prerequisite-key-and-study-routes); `NN` refers to this plan. *Lectures* gives `<offering> <lecture numbers>` from [`_sources.json`](_sources.json).

| Handle | Module | Hours | Prerequisites | Lectures |
|---|---|---:|---|---|
| NN01 | Connectionism and the threshold unit | 20 | F00 | F26 1; S26 1 |
| NN02 | What a network can represent | 28 | NN01 | F26 2; S26 2 |
| NN03 | Learning as risk minimization: perceptron to logistic unit | 26 | NN02, PS06 | F26 3; S26 3 |
| NN04 | Gradient descent, network outputs, and divergences | 24 | NN03, OPT02 | F26 4; S26 4 |
| NN05 | Backpropagation calculus | 32 | NN04, PY07 | F26 5; S26 5 |
| NN06 | Convergence, loss surfaces, and momentum | 28 | NN05, OPT03 | F26 6; S26 6 |
| NN07 | Stochastic, mini-batch, and adaptive optimization | 26 | NN06, OPT04 | F26 7; S26 7 |
| NN08 | Divergences, batch normalization, and regularization | 30 | NN07 | F26 8; S26 8 |
| NN09 | Scanning for patterns: convolution as shared weights | 30 | NN08 | F26 9, 10; S26 9, 10 |
| NN10 | Backpropagation through convolution, and CNN architectures | 32 | NN09 | F26 11, 12; S26 11, 12 |
| NN11 | Recurrent networks and backpropagation through time | 28 | NN05 | F26 13; S26 13 |
| NN12 | Stability, vanishing gradients, LSTMs and GRUs | 30 | NN11, LA06 | F26 14; S26 14 |
| NN13 | Alignment-free sequence training: Viterbi, CTC, and beam search | 34 | NN12, PS17 | F26 15, 16; S26 15, 16 |
| NN14 | Language models and sequence-to-sequence translation | 26 | NN13 | F26 17; S26 17 |
| NN15 | Attention and the transformer | 34 | NN14, LA08 | F26 18, 19; S26 18, 19 |
| NN16 | Large language models: scaling, instruction tuning, and RL fine-tuning | 22 | NN15 | F26 20; S26 20 |
| NN17 | Learned representations and autoencoders | 24 | NN08 | F26 21; S26 21 |
| NN18 | Variational autoencoders | 28 | NN17, PS14 | F26 22; S26 22 |
| NN19 | Normalizing flows and diffusion | 32 | NN18, PS03, PS15 | F26 23; S26 23 |
| NN20 | Generative adversarial networks | 28 | NN18, IL03 | F26 24; S26 24 |
| NN21 | Graph neural networks | 26 | NN15, LA07 | F26 25; S26 25 |
| NN22 | Deep reinforcement learning | 24 | NN07, RL05 | S26 26 |
| NN23 | Hopfield networks and associative memory | 26 | NN03, LA07 | F26 26; S26 27 |
| NN24 | Boltzmann machines and contrastive divergence | 28 | NN23, PS09 | F26 27; S26 28 |
| NN25 | Capstone: a from-scratch library and a full model | 48 | NN10, NN13, NN15 | F26 28 |

## 4. Teaching and authoring contract

Apply the [shared authoring contract](../_plans.md#4-shared-lesson-authoring-contract) and the [textbook-quality standard](../_plans.md#textbook-quality-standard) in full. Each lesson develops its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an application. It closes every numbered teaching section with Foundation / Core / Stretch practice and static hints, and ends with three checkable implementations, a derivations list, a cumulative exercise set, and the six-part checkpoint.

**Track-specific rules.**
- **Write the derivative before using the framework.** Every layer gets a hand-written forward and backward pass in NumPy, checked against finite differences, before the lesson shows its PyTorch equivalent.
- **Shapes are part of every equation.** State the tensor shape of every symbol at first use, and give batch, time, and channel axes explicitly.
- **History is evidence, not decoration.** The historical models (McCulloch–Pitts, the perceptron, ADALINE, the neocognitron, Hopfield networks) are taught because each one isolates a failure that a later idea fixes. Every historical section ends by naming that failure.
- **Browser tasks are standard-library Python.** NumPy and PyTorch work is labelled as a local extension, as elsewhere in the curriculum.

**Front matter.** `id: neural-networks.<slug>`, `title`, `prerequisites` (authored lesson IDs only), `estimated_hours`, `answers: nn-NN-<slug>`, and `lab` when the lesson has an interactive workbench.

## 5. Cumulative projects

Four projects run through the track, each in two parts. **Part 1** extends one from-scratch NumPy library with deterministic, unit-tested operations. **Part 2** is an open-ended model on a public dataset, judged against a stated baseline with a held-out split. The capstone (NN25) merges them.

| Project | Opens after | Part 1 — from-scratch library | Part 2 — open-ended model |
|---|---|---|---|
| P1 | NN08 | Linear layer, activations, MSE and cross-entropy, SGD with momentum, batch norm, dropout, and a reverse-mode autograd core; every backward pass checked by finite differences | Frame-level classification with context windows on a public speech-feature or image dataset; report accuracy against a linear baseline |
| P2 | NN10 | 1-D and 2-D convolution with stride, padding and dilation; max/mean pooling; up/downsampling; flatten; all with backward passes | Image classification plus embedding-based verification (closed-set accuracy and open-set ROC/EER) |
| P3 | NN13 | RNN and GRU cells with BPTT; CTC loss via forward–backward; greedy and beam-search decoding | Sequence recognition trained with CTC on a public speech subset; report edit distance |
| P4 | NN15 | Scaled dot-product and multi-head attention with causal masks; positional encodings; a transformer decoder block | A small language model or attention-based recognizer; report perplexity or edit distance and the effect of one ablation |

## 6. Detailed module briefs

### Part I · What networks represent and how they learn

*Thesis: a network is a composed function whose capacity can be counted, and learning is the minimization of an empirical risk by following its derivative.*

**Module 01 — Connectionism and the threshold unit**

`handle: NN01` · `id: neural-networks.connectionism-threshold-unit` · 20h · prerequisites: F00 · proposed bank: `nn-01-connectionism-threshold-unit`

**Spine and derivations:** Associationism to connectionism; the McCulloch–Pitts unit; Boolean gates from thresholds; scalar Hebbian growth and Oja's competing shrinkage; Rosenblatt's perceptron on real inputs; the decision boundary as a hyperplane; exact finite polygon unions; continuous one-variable approximation on compact intervals with explicit error and endpoint handling. Historical detail, spectral analysis, and the cylinder experiment are optional extensions; the latter includes a failure case for baseline-subtraction unions. Separate representation, learning, and generalization. Python work requires programming preparation (PY06 or the authored Python bridge); spectral work links the authored covariance, calculus, and spectral-theorem lessons. Neither is a prerequisite for the main reading.

**Readings:** McCulloch & Pitts (1943); Hebb (1949), *The Organization of Behavior*; Rosenblatt (1958); Minsky & Papert, *Perceptrons* epilogue (1988).

**Interactive experiment:** `nn-threshold-regions` — Place threshold units in the plane; predict the region their AND/OR composition carves out; failure preset: XOR with one unit.

**Implementation ladder:** Implement threshold_gate, compose_halfspaces, and hebbian_update with a divergence check.

**RE gate:** Build AND, OR, NOT, and XOR from threshold units and verify all truth-table rows exhaustively.

**RS gate:** Explain scalar Hebbian positive feedback and Oja's competing term, give a discrete overshoot counterexample, and state a bounded-domain approximation guarantee without inferring training or generalization. The spectral extension states centering, sampling, eigenvalue-gap, and initialization assumptions explicitly.

**Module 02 — What a network can represent**

`handle: NN02` · `id: neural-networks.network-expressivity` · 28h · prerequisites: NN01 · proposed bank: `nn-02-network-expressivity`

**Spine and derivations:** MLPs as Boolean functions via DNF; the exponential minterm-construction cost of parity versus an n+1-unit shallow counting-threshold network and a linear-size XOR tree; distinguish construction upper bounds from circuit lower bounds; Shannon's counting argument under explicit circuit conventions; bounded-domain region approximation with a stated error measure; universal-approximation results with domain, activation, target-class, and norm assumptions, using a valid argument rather than the NN01 cylinder-tail heuristic; width versus depth versus activation; sum-product networks; why a bottleneck that maps differently labelled inputs to the same hidden representation cannot be repaired downstream.

**Readings:** Shannon (1949), *The synthesis of two-terminal switching circuits*; the Boolean-circuit size/depth notes in the S26 lecture 2 readings.

**Interactive experiment:** `nn-polygon-net` — Increase the number of half-space units approximating a disc; read off the area error and unit count; failure preset: a bottleneck layer that cannot pass the needed information.

**Implementation ladder:** Implement dnf_network, parity_network_depth, and polygon_indicator.

**RE gate:** Construct n-bit parity via DNF, n counting thresholds plus an output, and a tree of three-unit XOR blocks. Count units, nonzero connections, biases, and threshold-layer depth separately (including uneven tree paths and any pass-through units). State whether a parameter count includes zero entries in dense matrices. Exhaustively verify small n; do not claim an exponential lower bound for unrestricted shallow threshold networks.

**RS gate:** State one universal-approximation theorem with its activation, domain, target-class, and error assumptions. Distinguish its existence claim from a constructive size bound and from a learning guarantee; diagnose a proposed proof that adds soft cylinders and subtracts their distant floors.

**Module 03 — Learning as risk minimization: perceptron to logistic unit**

`handle: NN03` · `id: neural-networks.perceptron-to-logistic` · 26h · prerequisites: NN02, PS06 · proposed bank: `nn-03-perceptron-to-logistic`

**Spine and derivations:** Sampling an unknown function; empirical versus expected risk; the perceptron learning rule and Novikoff's convergence bound; ADALINE and the delta rule; MADALINE and its greedy training; why threshold activations block gradient learning; the logistic unit as a probability model; differentiable divergences; ERM for networks.

**Readings:** Widrow & Lehr (1990), *30 years of adaptive neural networks*; the perceptron convergence proof (Collins notes).

**Interactive experiment:** `nn-perceptron-margin` — Vary the data margin and radius; predict the number of updates against the R²/γ² bound; failure preset: non-separable data cycling forever.

**Implementation ladder:** Implement perceptron_train, adaline_step, and empirical_risk.

**RE gate:** Verify the update count never exceeds the bound across seeded separable datasets, and detect non-convergence on a non-separable dataset.

**RS gate:** Prove the perceptron bound, and explain why minimizing classification error directly is ill-posed for gradient methods.

**Module 04 — Gradient descent, network outputs, and divergences**

`handle: NN04` · `id: neural-networks.gradient-descent-divergences` · 24h · prerequisites: NN03, OPT02 · proposed bank: `nn-04-gradient-descent-divergences`

**Spine and derivations:** Derivatives as row vectors; gradient and Hessian; stationary points and their classification; iterative gradient descent and its stopping criteria; activations and their derivatives; softmax as a vector activation; one-hot targets; L2 versus KL/cross-entropy divergences and their gradients; label smoothing.

**Readings:** Goodfellow, Bengio & Courville, *Deep Learning*, §4.3 and §6.2.

**Interactive experiment:** `nn-divergence-gradients` — Compare L2 and cross-entropy gradients for a saturated sigmoid output; predict which one keeps learning; failure preset: a confident wrong prediction.

**Implementation ladder:** Implement softmax_stable, cross_entropy_grad, and gradient_descent with tolerance-based stopping.

**RE gate:** Check the softmax-with-cross-entropy gradient (ŷ−y) against finite differences, including extreme logits.

**RS gate:** Derive why KL divergence and cross-entropy have the same gradient for fixed targets, and when label smoothing changes the optimum.

**Module 05 — Backpropagation calculus**

`handle: NN05` · `id: neural-networks.backpropagation-calculus` · 32h · prerequisites: NN04, PY07 · proposed bank: `nn-05-backpropagation-calculus`

**Spine and derivations:** The chain rule and its distributed form (influence diagrams); the forward pass; scalar backward recursion; vector activations and the softmax Jacobian; multiplicative combinations; subgradients for ReLU and max; vector-form backprop with Jacobians and affine parameter rules; the full training algorithm; a reverse-mode autograd core.

**Readings:** Rumelhart, Hinton & Williams (1986); Werbos (1990), *Backpropagation through time: what it does and how to do it*.

**Interactive experiment:** `nn-backprop-trace` — Step a two-layer network's forward and backward passes node by node; predict each local gradient before it is revealed; failure preset: a dead ReLU unit.

**Implementation ladder:** Implement mlp_forward, mlp_backward, and a minimal autograd Value graph with topological backward.

**RE gate:** Pass finite-difference gradient checks for every parameter of a three-layer MLP with ReLU and softmax.

**RS gate:** Explain why reverse mode costs a constant multiple of the forward pass for scalar losses, and when forward mode would be cheaper.

**Module 06 — Convergence, loss surfaces, and momentum**

`handle: NN06` · `id: neural-networks.convergence-momentum` · 28h · prerequisites: NN05, OPT03 · proposed bank: `nn-06-convergence-momentum`

**Spine and derivations:** Backprop's failure to separate where the perceptron succeeds; loss-surface folklore and evidence; convergence rates on quadratics; the optimal and divergent step sizes; coupled versus uncoupled axes; strong convexity and Lipschitz smoothness; axis scaling and Newton's method; learning-rate decay; Rprop and QuickProp; Polyak momentum and Nesterov acceleration.

**Readings:** Brady, Raghavan & Slawny (1989); Goh (2017), *Why momentum really works*; Polyak (1964).

**Interactive experiment:** `nn-quadratic-descent` — Vary the condition number and step size on a 2-D quadratic; predict convergence, oscillation or divergence; failure preset: a step size just above 2/λ_max.

**Implementation ladder:** Implement gd_quadratic_trace, rprop_step, and nesterov_step.

**RE gate:** Measure iterations-to-tolerance against condition number for plain, momentum, and Nesterov descent, and match the predicted rates.

**RS gate:** Derive the optimal step and the momentum rate for a quadratic, and state which assumption fails for a neural loss.

**Module 07 — Stochastic, mini-batch, and adaptive optimization**

`handle: NN07` · `id: neural-networks.stochastic-adaptive-optimization` · 26h · prerequisites: NN06, OPT04 · proposed bank: `nn-07-stochastic-adaptive-optimization`

**Spine and derivations:** Incremental updates and presentation order; SGD as an unbiased gradient estimate; its variance and the need for decaying rates; convergence of batch versus SGD; mini-batches and the variance–compute trade-off; momentum and Nesterov with mini-batches; RMSprop, Adam, and their bias corrections; optimizer behaviour on valleys and saddles.

**Readings:** Duchi, Hazan & Singer (2011), AdaGrad; Kingma & Ba (2014), Adam; Nesterov (1983).

**Interactive experiment:** `nn-optimizer-race` — Run SGD, momentum, RMSprop, and Adam on Beale's function, a long valley, and a saddle; predict the winner for each; failure preset: Adam with no bias correction.

**Implementation ladder:** Implement minibatch_iterator, rmsprop_step, and adam_step with bias correction.

**RE gate:** Match a reference Adam implementation to 1e-12 over 100 steps, including the first step.

**RS gate:** Derive the variance of a mini-batch gradient, and explain why scaling the batch size alone does not scale the speed of training.

**Module 08 — Divergences, batch normalization, and regularization**

`handle: NN08` · `id: neural-networks.batchnorm-regularization` · 30h · prerequisites: NN07 · proposed bank: `nn-08-batchnorm-regularization`

**Spine and derivations:** Desiderata for a divergence; covariate shift across mini-batches; batch normalization as a vector function of the batch and its full backward pass; inference statistics; overfitting from under-specified data; weight decay; smoothness through depth; bagging and dropout as implicit ensembles; inverted dropout at test time; early stopping, gradient clipping, and data augmentation.

**Readings:** Ioffe & Szegedy (2015); Srivastava et al. (2014); the S26 lecture 7–8 note *Derivatives and influence diagrams*.

**Interactive experiment:** `nn-batchnorm-dropout` — Toggle batch norm and dropout on a small network; predict train/validation curves; failure preset: batch size 1 with batch norm.

**Implementation ladder:** Implement batchnorm_forward_backward, inverted_dropout, and weight_decay_step.

**RE gate:** Check the batch-norm backward pass against finite differences for every input, γ and β, and verify train/eval mode parity.

**RS gate:** Explain why the batch-norm gradient for one sample depends on the whole batch, and what that implies for small batches.

### Part II · Architectures for structure in space and time

*Thesis: convolution and recurrence are shared-parameter networks scanned across space or time, and their training rules follow from the shared-weight derivative.*

**Module 09 — Scanning for patterns: convolution as shared weights**

`handle: NN09` · `id: neural-networks.scanning-convolution` · 30h · prerequisites: NN08 · proposed bank: `nn-09-scanning-convolution`

**Spine and derivations:** Shift invariance by scanning an MLP; the scan as one large shared-parameter network; gradients of shared parameters as sums; distributing the scan across layers and its parameter savings; time-delay networks; filters, receptive fields, stride, and pooling; Hubel–Wiesel and the neocognitron; the convolutional layer as an affine map over channel cubes; padding and output-size rules; 1×1 convolutions; up- and downsampling.

**Readings:** Fukushima (1980), neocognitron; LeCun et al. (1998); Waibel et al. (1989), time-delay networks.

**Interactive experiment:** `nn-scan-receptive-field` — Stack scan layers with chosen kernel and stride; predict the receptive field and parameter count; failure preset: stride larger than kernel, which leaves gaps.

**Implementation ladder:** Implement scan_mlp_1d, conv_output_shape, and receptive_field.

**RE gate:** Show that a distributed scan equals the undistributed one on fixed weights, and report both parameter counts.

**RS gate:** Prove that the gradient of a shared weight is the sum of its per-position gradients.

**Module 10 — Backpropagation through convolution, and CNN architectures**

`handle: NN10` · `id: neural-networks.cnn-backprop-architectures` · 32h · prerequisites: NN09 · proposed bank: `nn-10-cnn-backprop-architectures`

**Spine and derivations:** Backprop through activation, affine map, and convolution; the input derivative as a convolution with flipped filters; the filter derivative as a correlation; max- and mean-pooling derivatives; backprop through down- and upsampling and strided or fractional convolutions; transform invariance; localization and pose; depth-wise separable convolution; data augmentation; LeNet, AlexNet, VGG, Inception, ResNet, DenseNet.

**Readings:** He et al. (2016); Krizhevsky, Sutskever & Hinton (2012); CNN Explainer (Wang et al., 2020).

**Interactive experiment:** `nn-conv-backward` — Highlight which outputs a filter tap and an input pixel influence; predict the gradient map; failure preset: stride 2 with an off-by-one padding.

**Implementation ladder:** Implement conv2d_backward, maxpool_backward, and strided_conv_backward via dilation.

**RE gate:** Match conv2d forward and backward against a reference across stride, padding, and dilation grids, with finite-difference spot checks.

**RS gate:** Derive why the input gradient is a full convolution with the flipped kernel, and what changes with stride.

**Module 11 — Recurrent networks and backpropagation through time**

`handle: NN11` · `id: neural-networks.recurrent-bptt` · 28h · prerequisites: NN05 · proposed bank: `nn-11-recurrent-bptt`

**Spine and derivations:** Finite-response (TDNN) versus infinite-response models; NARX, Jordan, and Elman networks; the state-space RNN; multi-layer and generalized recurrences; the unrolled forward pass; backpropagation through time with explicit index bookkeeping; bidirectional RNNs and their backward pass.

**Readings:** Elman (1990); Fahlman & Lebiere (1990), recurrent cascade-correlation; Werbos (1990).

**Interactive experiment:** `nn-rnn-memory` — Feed an impulse into a one-unit recurrence; predict its decay or persistence for chosen weights; failure preset: a recurrent weight above 1 with a linear activation.

**Implementation ladder:** Implement rnn_forward, bptt, and birnn_forward_backward.

**RE gate:** Pass finite-difference checks for every recurrent, input, and output weight over a 20-step sequence.

**RS gate:** Construct a recurrent parity state update and explain how shared weights process different sequence lengths. Contrast that input interface with a fixed-input MLP; do not confuse arbitrary sequence length with a lower bound for an n-input threshold network, which computes n-bit parity with n+1 units.

**Module 12 — Stability, vanishing gradients, LSTMs and GRUs**

`handle: NN12` · `id: neural-networks.stability-lstm-gru` · 30h · prerequisites: NN11, LA06 · proposed bank: `nn-12-stability-lstm-gru`

**Spine and derivations:** BIBO stability; linear recursions and the role of the largest eigenvalue; saturation behaviour with sigmoid, tanh, and ReLU; the hidden-state Jacobian chain and exploding/vanishing gradients; the long-term dependency problem; the constant error carousel; LSTM gates, peepholes, forward and backward pseudocode; GRUs; bidirectional LSTMs.

**Readings:** Hochreiter & Schmidhuber (1997); Bengio, Simard & Frasconi (1994); Cho et al. (2014).

**Interactive experiment:** `nn-gradient-flow` — Set the recurrent matrix's spectral radius and the activation; watch ‖∂h_T/∂h_0‖ over 100 steps; failure preset: spectral radius 1.1 with a linear activation.

**Implementation ladder:** Implement lstm_cell_forward, lstm_cell_backward, and gru_cell_forward.

**RE gate:** Pass LSTM and GRU gradient checks, and show that the cell-state path preserves gradient magnitude when the forget gate is near 1.

**RS gate:** Derive the bound on the gradient norm from the Jacobian product, and say what it does not guarantee for nonlinear RNNs.

**Module 13 — Alignment-free sequence training: Viterbi, CTC, and beam search**

`handle: NN13` · `id: neural-networks.ctc-alignment-decoding` · 34h · prerequisites: NN12, PS17 · proposed bank: `nn-13-ctc-alignment-decoding`

**Spine and derivations:** Time-synchronous versus order-aligned outputs; greedy decoding and its failure; training with a known alignment; Viterbi alignment and iterative re-estimation; expected divergence over all alignments; the forward (α) and backward (β) recursions; posterior state occupancy; blanks and the modified graph; the CTC gradient; prefix beam search.

**Readings:** Graves et al. (2006), *Connectionist temporal classification*; Rabiner (1989), HMM tutorial §III.

**Interactive experiment:** `nn-ctc-lattice` — Show the α lattice for a short target and output sequence; predict which paths survive the blank rules; failure preset: a repeated symbol without an intervening blank.

**Implementation ladder:** Implement viterbi_align, ctc_loss_forward_backward, and ctc_prefix_beam_search.

**RE gate:** Match the CTC loss and gradient to brute-force enumeration of all alignments on sequences short enough to list.

**RS gate:** Derive the α–β product as a posterior occupancy, and explain why greedy CTC decoding is not the most probable labelling.

**Module 14 — Language models and sequence-to-sequence translation**

`handle: NN14` · `id: neural-networks.language-models-seq2seq` · 26h · prerequisites: NN13 · proposed bank: `nn-14-language-models-seq2seq`

**Spine and derivations:** Next-token prediction; one-hot words and their projection into embeddings; TDNN and recurrent language models; sampling and its start/end conventions; encoder–decoder translation; the output-sequence probability; greedy, sampled, and beam decoding with termination; training with teacher forcing; input reversal; image captioning.

**Readings:** Bengio et al. (2003); Sutskever, Vinyals & Le (2014); Vinyals et al. (2015), show and tell.

**Interactive experiment:** `nn-decoding-strategies` — Decode from a fixed toy next-token table with greedy, sampling, and beam widths 1–5; predict the highest-probability output; failure preset: greedy commits to a dead end.

**Implementation ladder:** Implement embedding_lookup_grad, seq2seq_greedy_decode, and beam_search with length handling.

**RE gate:** Show that beam search with width k returns a sequence at least as probable as greedy on every fixture, and find a case where it misses the global optimum.

**RS gate:** Explain why a single fixed-length context vector limits long-sequence translation.

**Module 15 — Attention and the transformer**

`handle: NN15` · `id: neural-networks.attention-transformer` · 34h · prerequisites: NN14, LA08 · proposed bank: `nn-15-attention-transformer`

**Spine and derivations:** Attention over encoder states; query–key–value attention; alignment visualizations; multi-head attention; self-attention and masked self-attention; positional encodings, including the linear-shift property of sinusoids; the transformer block with residuals and normalization (pre versus post); encoder-only, decoder-only, and encoder–decoder models; tokenization (BPE); scaling by √d_k; relative and rotary positions; quadratic cost, KV caching, and flash attention; vision and audio transformers; parameter-efficient tuning.

**Readings:** Bahdanau, Cho & Bengio (2015); Vaswani et al. (2017); Su et al. (2021), RoPE; Dosovitskiy et al. (2021).

**Interactive experiment:** `nn-attention-weights` — Edit query and key vectors; predict the attention distribution before and after √d_k scaling; failure preset: unscaled attention at d_k=512 collapsing to one-hot.

**Implementation ladder:** Implement scaled_dot_attention_backward, causal_mask_attention, and sinusoidal_positions.

**RE gate:** Match multi-head causal attention forward and backward to a reference, and verify that the causal mask blocks every future position.

**RS gate:** Derive the √d_k scale from the variance of a dot product of random vectors, and state the assumption it relies on.

**Module 16 — Large language models: scaling, instruction tuning, and RL fine-tuning**

`handle: NN16` · `id: neural-networks.llm-scaling-alignment` · 22h · prerequisites: NN15 · proposed bank: `nn-16-llm-scaling-alignment`

**Spine and derivations:** Foundation models; web-scale data; evaluation difficulties; power-law scaling in parameters, data, and compute; compute-optimal allocation (Kaplan versus Chinchilla); staged training; supervised fine-tuning with chat templates; RLHF; verifiable rewards; rejection fine-tuning and REINFORCE for language models.

**Readings:** Kaplan et al. (2020); Hoffmann et al. (2022); Ouyang et al. (2022).

**Interactive experiment:** `nn-scaling-frontier` — Fit a power law to synthetic loss–compute points; predict the compute-optimal N and D for a budget; failure preset: extrapolating from points that are all in one regime.

**Implementation ladder:** Implement fit_power_law, chinchilla_allocation, and reinforce_sequence_grad.

**RE gate:** Recover known exponents from noisy synthetic scaling data with confidence intervals.

**RS gate:** State what a scaling law predicts and what it cannot predict about downstream capability.

### Part III · Representation, generation, and energy

*Thesis: a network's hidden layers learn a representation, and generative models are networks trained to put probability mass where the data are.*

**Module 17 — Learned representations and autoencoders**

`handle: NN17` · `id: neural-networks.representations-autoencoders` · 24h · prerequisites: NN08 · proposed bank: `nn-17-representations-autoencoders`

**Spine and derivations:** Logistic outputs as maximum-likelihood estimates; why weights diverge on separable data; lower layers as learned features that make data separable; weights as templates; linear autoencoders and their equivalence to PCA; nonlinear autoencoders; decoders as generative dictionaries; dictionary learning for signal separation.

**Readings:** Baldi & Hornik (1989); Hinton & Salakhutdinov (2006).

**Interactive experiment:** `nn-linear-autoencoder` — Train a 2-D-to-1-D linear autoencoder; predict the learned direction against the first principal component; failure preset: uncentered data.

**Implementation ladder:** Implement logistic_mle_separable_trace, linear_autoencoder_train, and dictionary_separate.

**RE gate:** Show that the linear autoencoder spans the same subspace as PCA, to tolerance, on seeded data.

**RS gate:** Prove that the optimal linear autoencoder spans the top principal subspace, and say what the proof does not determine.

**Module 18 — Variational autoencoders**

`handle: NN18` · `id: neural-networks.variational-autoencoders` · 28h · prerequisites: NN17, PS14 · proposed bank: `nn-18-variational-autoencoders`

**Spine and derivations:** Why a plain autoencoder does not generate; imposing a latent distribution; isotropic Gaussian properties; the intractable posterior; the variational encoder; the ELBO from Bayes; the reparameterization trick; the full training pipeline; latent-space structure; limitations, including blurriness and posterior collapse.

**Readings:** Kingma & Welling (2014); Doersch (2016), *Tutorial on variational autoencoders*.

**Interactive experiment:** `nn-vae-latent` — Vary the KL weight on a 2-D toy VAE; predict latent overlap and reconstruction quality; failure preset: KL weight so large that the posterior collapses.

**Implementation ladder:** Implement gaussian_kl, reparameterized_sample_grad, and elbo_estimate.

**RE gate:** Match the closed-form Gaussian KL to Monte Carlo estimates, and check reparameterized gradients by finite differences.

**RS gate:** Derive the ELBO and its gap, and explain why the gap is the KL from the approximate to the true posterior.

**Module 19 — Normalizing flows and diffusion**

`handle: NN19` · `id: neural-networks.flows-diffusion` · 32h · prerequisites: NN18, PS03, PS15 · proposed bank: `nn-19-flows-diffusion`

**Spine and derivations:** The VAE's one-step bottleneck; change of variables and invertible flows; noise schedules; the forward noising process in closed form; training a denoiser on a toy model; ancestral sampling; the reverse SDE versus the probability-flow ODE; denoising score matching; classifier and classifier-free guidance; latent diffusion; conditional editing.

**Readings:** Dinh, Sohl-Dickstein & Bengio (2017); Ho, Jain & Abbeel (2020); Song et al. (2021); Ho & Salimans (2022).

**Interactive experiment:** `nn-diffusion-toy` — Run forward noising and reverse sampling on a 2-D mixture; predict sample quality as steps decrease; failure preset: a noise schedule that never reaches the prior.

**Implementation ladder:** Implement forward_noise_closed_form, ddpm_sample_step, and cfg_combine.

**RE gate:** Verify that the closed-form marginal matches iterated noising statistically, and that the sampler recovers the toy mixture's modes.

**RS gate:** Derive the denoising score-matching equivalence, and state when guidance trades diversity for fidelity.

**Module 20 — Generative adversarial networks**

`handle: NN20` · `id: neural-networks.adversarial-networks` · 28h · prerequisites: NN18, IL03 · proposed bank: `nn-20-adversarial-networks`

**Spine and derivations:** Discriminative versus generative models; replacing likelihood with a learned critic; the GAN min–max objective; the optimal discriminator; the Jensen–Shannon form at optimum; why strong discriminators starve the generator; least-squares GANs; Wasserstein distance and WGANs; spectral normalization; mode collapse and minibatch discrimination; conditional, progressive, and style-based generators; Pix2Pix, CycleGAN, and StarGAN.

**Readings:** Goodfellow et al. (2014); Arjovsky, Chintala & Bottou (2017); Miyato et al. (2018).

**Interactive experiment:** `nn-gan-1d` — Train a GAN on a 1-D bimodal target; predict whether the generator covers both modes for a chosen discriminator strength; failure preset: a discriminator update ratio that triggers mode collapse.

**Implementation ladder:** Implement optimal_discriminator, js_divergence, and wasserstein_1d.

**RE gate:** Confirm that the optimal-discriminator value equals 2·JS − log 4 on discrete fixtures.

**RS gate:** Explain why JS divergence is constant for distributions with disjoint support, and how the Wasserstein distance avoids this.

**Module 21 — Graph neural networks**

`handle: NN21` · `id: neural-networks.graph-networks` · 26h · prerequisites: NN15, LA07 · proposed bank: `nn-21-graph-networks`

**Spine and derivations:** Graphs, adjacency, and node embeddings; node, edge, and graph tasks; permutation invariance and equivariance; message passing and aggregation; GCN normalization; GraphSAGE; graph attention; over-smoothing; graph transformers; expressivity and the Weisfeiler–Lehman test; the Laplacian eigenbasis view.

**Readings:** Kipf & Welling (2017); Hamilton, Ying & Leskovec (2017); Veličković et al. (2018); Xu et al. (2019); Sanchez-Lengeling et al. (2021), *A gentle introduction to GNNs*.

**Interactive experiment:** `nn-message-passing` — Run k rounds of mean aggregation on a small graph; predict when node features become indistinguishable; failure preset: two non-isomorphic graphs that 1-WL cannot separate.

**Implementation ladder:** Implement gcn_layer, wl_refine, and permutation_equivariance_check.

**RE gate:** Verify the equivariance of every layer under random node permutations.

**RS gate:** Prove that message passing is at most as expressive as 1-WL, and give a pair of graphs it cannot distinguish.

**Module 22 — Deep reinforcement learning**

`handle: NN22` · `id: neural-networks.deep-rl` · 24h · prerequisites: NN07, RL05 · proposed bank: `nn-22-deep-rl`

**Spine and derivations:** Sequential decisions and the Bellman principle; Markov processes and MDPs; model-free learning; Monte Carlo and temporal-difference estimates; SARSA and Q-learning; function approximation; DQN's instabilities from correlated data and moving targets; replay buffers and target networks; rewards from human feedback.

**Readings:** Mnih et al. (2015); Sutton & Barto (2018), ch. 6 and 9.

**Interactive experiment:** `nn-q-learning-grid` — Run tabular and approximate Q-learning on a gridworld; predict whether a target network is needed for stability; failure preset: approximate Q-learning without replay or a target network.

**Implementation ladder:** Implement td0_update, q_learning_step, and replay_target_update.

**RE gate:** Match tabular Q-learning to the value-iteration solution on a small MDP within tolerance.

**RS gate:** Name the deadly triad, and show it producing divergence on a constructed example.

**Module 23 — Hopfield networks and associative memory**

`handle: NN23` · `id: neural-networks.hopfield-networks` · 26h · prerequisites: NN03, LA07 · proposed bank: `nn-23-hopfield-networks`

**Spine and derivations:** Loopy networks of ±1 perceptrons; asynchronous evolution; the energy function and why it never increases; the spin-glass analogy; content-addressable memory; Hebbian storage; parasitic patterns and capacity limits for orthogonal and non-orthogonal patterns; training weights as energy shaping by lowering valleys and raising neighbourhoods; storing more than N patterns.

**Readings:** Hopfield (1982); Amit, Gutfreund & Sompolinsky (1985); Ramsauer et al. (2021), *Hopfield networks is all you need*.

**Interactive experiment:** `nn-hopfield-recall` — Store k patterns in an N-unit network; corrupt a probe; predict recall versus a parasitic state; failure preset: k close to 0.14N with non-orthogonal patterns.

**Implementation ladder:** Implement hopfield_energy, async_update_until_stable, and hebbian_store.

**RE gate:** Verify that energy is non-increasing under every asynchronous update, and measure recall rate against load.

**RS gate:** Prove the energy-descent property, and explain why synchronous updates can oscillate.

**Module 24 — Boltzmann machines and contrastive divergence**

`handle: NN24` · `id: neural-networks.boltzmann-machines` · 28h · prerequisites: NN23, PS09 · proposed bank: `nn-24-boltzmann-machines`

**Spine and derivations:** Expanding Hopfield capacity with hidden units; robust recall with don't-care bits; free energy and the Boltzmann distribution; the stochastic Hopfield net and temperature; annealing; the Boltzmann machine as a distribution; maximum-likelihood training as data statistics minus model statistics; Gibbs sampling for the second term; restricted Boltzmann machines; contrastive divergence; continuous-valued RBMs.

**Readings:** Ackley, Hinton & Sejnowski (1985); Hinton (2002); Hinton (2012), *A practical guide to training RBMs*.

**Interactive experiment:** `nn-rbm-gibbs` — Run Gibbs chains on a tiny RBM; compare exact and sampled model statistics as chain length grows; failure preset: CD-1 on a multimodal target.

**Implementation ladder:** Implement boltzmann_exact_partition, rbm_gibbs_step, and cd_k_update.

**RE gate:** Compare the CD-k gradient with the exact gradient by enumeration on a model with at most 10 units.

**RS gate:** Derive the log-likelihood gradient, and explain the bias that contrastive divergence introduces.

### Part IV · Synthesis

**Module 25 — Capstone: a from-scratch library and a full model**

`handle: NN25` · `id: neural-networks.capstone-library-model` · 48h · prerequisites: NN10, NN13, NN15 · proposed bank: `nn-25-capstone-library-model`

**Spine and derivations:** No new theory. Merge the P1–P4 libraries into one tested package; train one complete model end to end with it; reproduce the same model in PyTorch; deploy it behind a small inference interface; and debrief the projects' failure modes.

**Readings:** The readings of the modules the chosen model draws on.

**Interactive experiment:** `nn-capstone-parity` — Display the library and PyTorch training curves side by side across seeds, with the held-out split and every failed run.

**Implementation ladder:** Deliver the library with its test suite, the parity report, and an inference entry point with input validation.

**RE gate:** Show forward and gradient parity with PyTorch to stated tolerances, and a held-out result that matches the reference within seed variance.

**RS gate:** Defend one design choice with an ablation, and state the boundary of the result.

## 7. Overlap with other tracks

The table lists shared topics so that a learner does not study the same idea twice without meaning to. It changes no other plan.

| This track | Related elsewhere |
|---|---|
| NN05 | LA17, PT05 |
| NN06–NN07 | OPT04–OPT06 |
| NN08 | DLA02, DLA03 |
| NN09–NN10 | DLA05 |
| NN11–NN12 | DLA06 |
| NN15 | LA22 |
| NN16 | SYS02–SYS21, RL13–RL15 |
| NN17–NN18 | PS14 |
| NN19 | DLA11, DLA12, PS15 |
| NN22 | RL04–RL07 |

## 8. Write order and validation

Write NN01–NN08 in order: they form the core, and P1 depends on all of them. NN09–NN10 (with P2) and NN11–NN13 (with P3) are independent branches. NN14–NN16 follow NN13. NN17–NN20 need only NN08 plus their probability prerequisites. NN21–NN24 are electives. NN25 comes last.

For each lesson, run `pnpm nn:sync` first so that the cached slides are current. Then author, generate figures, register labs, and run `pnpm nn:check`, `pnpm theory:build`, and `pnpm theory:check`. Inspect the reader in both themes and work one exercise end to end.
