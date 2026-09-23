# Calculus and optimization — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Develop calculus into a language for reasoning about training algorithms, then separate convergence theorems from observed neural-network dynamics. RE learners must implement and diagnose optimizers; RS learners must defend assumptions and controlled comparisons.

Six lessons already exist: [calculus](01-calculus-gradients-optimization.md), [convexity](03-convexity-smoothness-duality.md), [SGD](04-stochastic-approximation-sgd.md), [nonconvex dynamics](05-nonconvex-landscapes-training-dynamics.md), [adaptive methods](06-preconditioning-adaptive-methods-schedules.md), and [constraints](07-constrained-composite-distributed-optimization.md). These are expansion targets, not empty slots. Preserve all six paths and their existing front-matter IDs; OPT01 specifically remains `math.calculus.gradients-optimization`. OPT02 fills the missing calculus bridge. The detailed briefs below use those exact preserved IDs.

**Scope:** 12 units; 414 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `OPT01` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `math.optimization.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own scalar/multivariable calculus and optimization guarantees. LA15–LA18 own coordinate-free Jacobians, adjoints, and matrix curvature identities; probability owns stochastic estimators. OPT02 supplies a self-contained operational derivative bridge so optimization does not wait for the entire LA research layer. PyTorch owns framework implementation; Deep Learning owns architectural experiments.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| OPT01 | Calculus, gradients, and optimization | 28 | F03, LA01, F01 |
| OPT02 | Multivariable calculus and Taylor models | 30 | OPT01, LA03, LA07 |
| OPT03 | Convexity, smoothness, and duality | 38 | OPT02, LA07 |
| OPT04 | Stochastic approximation, SGD, and batch size | 36 | OPT03, PS05 |
| OPT05 | Nonconvex landscapes and training dynamics | 36 | OPT04, LA07 |
| OPT06 | Preconditioning, adaptive methods, and schedules | 40 | OPT05, LA08 |
| OPT07 | Constrained, composite, and distributed optimization | 36 | OPT06, OPT03 |
| OPT08 | Newton, quasi-Newton, and curvature approximations | 32 | OPT07, LA10 |
| OPT09 | Variance reduction and online optimization | 30 | OPT04, OPT07, IL09 |
| OPT10 | Implicit differentiation and bilevel optimization | 34 | OPT08, PT05 |
| OPT11 | Parameterization, optimizer scaling, and transfer | 30 | OPT06, DL04 |
| OPT12 | Capstone: an optimizer claim audit | 44 | OPT08, OPT09, OPT11, RP04 |

## 4. Detailed module briefs

### Part I · Calculus to guarantees

*Thesis: a derivative is a local approximation with an error, not a symbolic trick.*

**Module 01 — Calculus, gradients, and optimization**

`handle: OPT01` · `id: math.calculus.gradients-optimization` · 28h · prerequisites: F03, LA01, F01 · proposed bank: `opt-01-gradients-optimization`

**Spine and derivations:** Limits, scalar derivatives, product/chain rules, integrals, fundamental theorem, and first-order Taylor expansion; derive common loss gradients and distinguish derivative from finite difference.

**Interactive experiment:** `opt-gradients-optimization` — Move a tangent point and finite-difference step; show truncation versus rounding error and a nondifferentiable kink.

**Implementation ladder:** Implement central_difference, scalar_gradient_check, and numerical_integral on explicit smooth domains.

**RE gate:** Diagnose a failed gradient check by scale and step-size sweep.

**RS gate:** State the regularity conditions behind a derivative or interchange of limit and integral.

**Module 02 — Multivariable calculus and Taylor models**

`handle: OPT02` · `id: math.optimization.multivariable-taylor` · 30h · prerequisites: OPT01, LA03, LA07 · proposed bank: `opt-02-multivariable-taylor`

**Spine and derivations:** Partial and directional derivatives, Jacobians, chain rule with shapes, Hessians, multivariable Taylor remainder, and constrained directional variation; derive a quadratic local model.

**Interactive experiment:** `opt-multivariable-taylor` — Drag a point on a saddle or curved valley; compare exact change with linear/quadratic predictions and step radius.

**Implementation ladder:** Implement numeric_jacobian, hessian_direction_check, and quadratic_model_error.

**RE gate:** Verify a vector-valued derivative against random directional checks.

**RS gate:** Give an example with partial derivatives but failed differentiability and explain the missing assumption.

**Module 03 — Convexity, smoothness, and duality**

`handle: OPT03` · `id: math.optimization.convexity-smoothness-duality` · 38h · prerequisites: OPT02, LA07 · proposed bank: `opt-03-convexity-smoothness-duality`

**Spine and derivations:** Convex sets/functions, Jensen, smoothness and strong convexity; prove descent and GD rates; derive Lagrangian duality, KKT under qualifications, and entropy-regularized softmax.

**Interactive experiment:** `opt-convexity-smoothness-duality` — Vary curvature and step size; show convergence, oscillation, divergence, and a duality-gap counterexample without qualification.

**Implementation ladder:** Implement gradient_descent, backtracking_search, and primal_dual_gap on tractable problems.

**RE gate:** Match observed rates to stated smoothness constants and identify violated assumptions.

**RS gate:** Prove a GD rate and derive a dual with feasibility and strong-duality conditions.

### Part II · Actual training

*Thesis: noise, geometry, and parameterization determine what an update means.*

**Module 04 — Stochastic approximation, SGD, and batch size**

`handle: OPT04` · `id: math.optimization.stochastic-approximation-sgd` · 36h · prerequisites: OPT03, PS05 · proposed bank: `opt-04-stochastic-approximation-sgd`

**Spine and derivations:** Unbiased gradients, variance scaling, Robbins–Monro conditions, noise floors, sampling with/without replacement, and critical-batch heuristics; separate conditional unbiasedness from independence.

**Interactive experiment:** `opt-stochastic-approximation-sgd` — Vary batch size, correlation, and schedule; display gradient noise and equal-example versus equal-step progress.

**Implementation ladder:** Implement minibatch_gradient, gradient_variance_estimate, and stochastic_quadratic_solver.

**RE gate:** Audit token weighting and accumulation so the update matches the intended empirical objective.

**RS gate:** Derive a stochastic descent bound and give a biased-sampling counterexample.

**Module 05 — Nonconvex landscapes and training dynamics**

`handle: OPT05` · `id: math.optimization.nonconvex-landscapes` · 36h · prerequisites: OPT04, LA07 · proposed bank: `opt-05-nonconvex-landscapes`

**Spine and derivations:** Stationarity versus optimality, saddle examples, local stability of updates, curvature estimation, implicit bias in restricted models, and parameterization-dependent sharpness.

**Interactive experiment:** `opt-nonconvex-landscapes` — Vary learning rate and Hessian eigenvalues; expose instability, flat reparameterizations, and saddle plateaus.

**Implementation ladder:** Implement hessian_vector_reference, power_curvature_estimate, and stability_trace.

**RE gate:** Investigate a loss spike with objective, gradient, curvature, and data diagnostics.

**RS gate:** Distinguish a theorem for linear models from a hypothesis about a trained neural network.

**Module 06 — Preconditioning, adaptive methods, and schedules**

`handle: OPT06` · `id: math.optimization.preconditioning-adaptive-schedules` · 40h · prerequisites: OPT05, LA08 · proposed bank: `opt-06-preconditioning-adaptive-schedules`

**Spine and derivations:** Momentum dynamics, adaptive moments and bias correction, AdamW versus coupled penalties, diagonal/matrix preconditioning, warmup/decay, and width-scaling hypotheses.

**Interactive experiment:** `opt-preconditioning-adaptive-schedules` — Change coordinate scaling and optimizer; compare update directions, transient momentum, and a zero-gradient decay case.

**Implementation ladder:** Implement momentum_step, adamw_step, and schedule_state with exact restart parity.

**RE gate:** Compare optimizers at equal tuning budget and report state memory, wall time, and validation quality.

**RS gate:** Explain which invariance a preconditioner approximates and where scale-transfer evidence fails.

**Module 07 — Constrained, composite, and distributed optimization**

`handle: OPT07` · `id: math.optimization.constrained-composite-distributed` · 36h · prerequisites: OPT06, OPT03 · proposed bank: `opt-07-constrained-composite-distributed`

**Spine and derivations:** Projection, proximal maps, mirror descent, trust regions, nonsmooth subgradients, gradient clipping, and weighted distributed objectives; derive simplex updates and correct global normalization.

**Interactive experiment:** `opt-constrained-composite-distributed` — Vary rank-local token counts and clipping order; display disagreement between local means and the intended global gradient.

**Implementation ladder:** Implement project_simplex, soft_threshold, and weighted_gradient_reduce on simulated workers.

**RE gate:** Recover single-process gradients from unequal distributed batches and document clipping semantics.

**RS gate:** Prove proximal optimality for an example and explain why clipping need not solve a trust-region problem.

### Part III · Research optimization

*Thesis: fair experiments and structured approximations connect theory to useful algorithms.*

**Module 08 — Newton, quasi-Newton, and curvature approximations**

`handle: OPT08` · `id: math.optimization.second-order-methods` · 32h · prerequisites: OPT07, LA10 · proposed bank: `opt-08-second-order-methods`

**Spine and derivations:** Newton and damped Newton, Hessian-vector products, conjugate-gradient inner solves, BFGS secant conditions, Gauss–Newton, and Fisher distinctions; derive descent safeguards.

**Interactive experiment:** `opt-second-order-methods` — Change curvature definiteness and solve tolerance; show unstable Newton steps and damping recovery.

**Implementation ladder:** Implement damped_newton, truncated_cg, and bfgs_update on small problems.

**RE gate:** Bound peak memory and match a matrix-free step to a dense oracle.

**RS gate:** State when Fisher and Gauss–Newton coincide and distinguish empirical Fisher from model Fisher.

**Module 09 — Variance reduction and online optimization**

`handle: OPT09` · `id: math.optimization.variance-reduction-online` · 30h · prerequisites: OPT04, OPT07, IL09 · proposed bank: `opt-09-variance-reduction-online`

**Spine and derivations:** Control variates, SVRG on finite sums, regret, online gradient descent, mirror descent, and adaptive adversaries; derive a regret bound with bounded gradients.

**Interactive experiment:** `opt-variance-reduction-online` — Change gradient correlation and drift; reveal stale control variates and a nonstationary stream.

**Implementation ladder:** Implement svrg_step, online_gradient_descent, and regret_accounting.

**RE gate:** Compare gradient evaluations and wall time rather than only iteration count.

**RS gate:** Prove the stated regret bound and explain why it is not automatically a generalization bound.

**Module 10 — Implicit differentiation and bilevel optimization**

`handle: OPT10` · `id: math.optimization.implicit-bilevel` · 34h · prerequisites: OPT08, PT05 · proposed bank: `opt-10-implicit-bilevel`

**Spine and derivations:** Differentiate a fixed point using the implicit function theorem, solve adjoint systems, contrast unrolling with implicit gradients, and analyze truncation bias.

**Interactive experiment:** `opt-implicit-bilevel` — Change inner solve tolerance and Hessian conditioning; compare unrolled, implicit, and finite-difference hypergradients.

**Implementation ladder:** Implement unrolled_hypergradient, implicit_quadratic_gradient, and residual_audit.

**RE gate:** Verify a hypergradient on a closed-form ridge problem and account for memory.

**RS gate:** State invertibility and smoothness requirements and expose failure at a nonunique optimum.

**Module 11 — Parameterization, optimizer scaling, and transfer**

`handle: OPT11` · `id: math.optimization.parameterization-scaling` · 30h · prerequisites: OPT06, DL04 · proposed bank: `opt-11-parameterization-scaling`

**Spine and derivations:** Feature and parameter scales, width/depth changes, update-to-weight ratios, maximal-update parameterization as a specific recipe, and confounding by compute or data.

**Interactive experiment:** `opt-parameterization-scaling` — Change width and parameter scaling; plot activation, gradient, and update scales with a failed transfer preset.

**Implementation ladder:** Implement coordinate_check, update_scale_log, and a matched-budget sweep.

**RE gate:** Reproduce a specified scaling recipe with shape-by-shape initialization and learning-rate rules.

**RS gate:** Prestate a transfer prediction and test it on a held-out width without retuning.

**Module 12 — Capstone: an optimizer claim audit**

`handle: OPT12` · `id: math.optimization.optimizer-research-audit` · 44h · prerequisites: OPT08, OPT09, OPT11, RP04 · proposed bank: `opt-12-optimizer-research-audit`

**Spine and derivations:** No new theory: an exact small benchmark, a neural benchmark, fair tuning, equal-budget comparisons, numerical diagnostics, and a falsifiable mechanism claim.

**Interactive experiment:** `opt-optimizer-research-audit` — Overlay quality versus tokens, time, and memory; expose a ranking reversal under a different budget.

**Implementation ladder:** Deliver reference updates, an experiment runner, and a reproducible claim/evidence report.

**RE gate:** Defend numerical parity, throughput, resumption, and a useful practical tradeoff.

**RS gate:** Separate mechanism evidence from correlation and report a negative or ambiguous result honestly.

## 5. Write order and milestones

Expand OPT01 and author OPT02 before deepening OPT03. PS05 is an explicit entry gate for OPT04 even though the current short page does not list it. Continue OPT04–OPT07; OPT08–OPT09 branch from there. OPT10 is an advanced elective after framework autodiff; OPT11 waits for initialization. OPT12 integrates the core research branch. Preserve the existing lesson numbering and inbound metadata during all expansions.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Audit one optimizer claim against SGD/momentum and AdamW with declared search budgets, equal-token and equal-time curves, multiple seeds chosen under a stated compute limit, and exact toy oracles. Include failures and all tried configurations. RE defense covers update correctness and systems cost; RS defense covers the mechanism and external validity.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Reuse LA curvature and chart primitives; add update-vector, gradient-noise, and per-rank normalization views. Use stdlib quadratic and projection exercises in the browser; neural experiments, autodiff, and larger solves run locally.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
