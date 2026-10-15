# Deep Learning Core Chapter 1 — change plan

Status: implemented on 2026-10-15. Validation and remaining limits are recorded below.

## Outcome and scope

Make NN01 a mathematically reliable, intuitive source that a student can study without the CMU lecture, external readings, or an LLM tutor. Standalone means self-contained given explicitly declared prerequisites; it does not mean teaching all of linear algebra, probability, and programming inside this chapter.

Keep CMU 11-785 as the curriculum backbone: connectionism and early units, Boolean expressivity, geometric composition, function approximation, then learning and deeper expressivity in subsequent modules. Adapt the pacing and explanations for independent reading. Preserve the chapter's historical motivation and constructive examples.

This change covers NN01 prose, diagrams, interactive labs, answers, assessments, and focused correctness checks. Update NN02's authoring brief where it contradicts NN01. Do not author NN02–NN25, restructure the Advanced track, or publish a deployment as part of this work. Preserve lesson IDs, registered lab IDs, answer-bank keys, and Python task interfaces wherever possible so saved work remains usable.

## 1. Correct the mathematical claims first — P0

### 1.1 Separate the cylinder experiment from a universality proof

Confirmed issue: the current construction adds cylinder counts, subtracts their distant floors, and thresholds once. The tails remain above the floors at finite distances; this does not implement the stated union.

- Retain the single-cylinder count experiment and its limiting fraction formula.
- Remove the unsupported union proof from the prose, lab explanation, quiz feedback, and A5/A6 solutions.
- Add a short counterexample: target discs of radius 2 centred at (−3,0) and (3,0), threshold τ=2/3. At the midpoint, the limiting combined normalized score after subtracting one floor is approximately 0.716, so the proposed rule fires outside both discs.
- Explain that increasing the number of edge units improves angular resolution but does not remove this tail interaction.
- Keep the edge–AND–OR construction as the chapter's constructive method for unions of polygons. Defer a rigorous one-hidden-layer approximation argument to NN02, with its domain, activation, and error assumptions stated there.
- Rewrite the two-cylinder practice prompt as a failure-analysis exercise rather than asking students to derive a purported exact union rule.

Acceptance: the single-cylinder result is explained correctly; no exercise or reference answer treats baseline subtraction as a general union construction; the counterexample is reproducible.

### 1.2 State exactly what approximation means

- Distinguish exact Boolean computation, exact finite polygon constructions, and approximation of more general regions.
- State a bounded domain and an explicit error notion. Use disagreement area for suitable planar regions and maximum vertical error for continuous functions on a compact interval. Explain assumptions without requiring measure theory.
- Prove the one-dimensional continuous-function approximation claim using uniform continuity; introduce the stronger LΔ/2 bound only for an L-Lipschitz target. Do not imply that every continuous function has a bounded slope or a universal 1/K error rate.
- Qualify the dimension-dependent block count as a property of this grid construction under stated regularity assumptions, rather than an unconditional lower bound on all networks.
- Add a visible distinction between representability, learnability, and generalization. A construction of weights guarantees neither successful training nor good predictions on unseen data.
- Audit the opening promises and quiz answers against these narrower statements.

Acceptance: every use of “any,” “universal,” or “arbitrary precision” has a nearby scope and meaning of error, or explicitly points to a later theorem.

### 1.3 Repair boundaries and finite-polygon geometry

- Keep A3's requested closed ring, 1≤|x₁|+|x₂|≤2. Replace the reference constructions that currently exclude the inner boundary, in both the answer bank and the region lab. Derive and verify both the natural composition and the one-hidden-layer alternative before presenting them.
- Make pulses explicitly half-open under θ(0)=1. Address the final endpoint separately when claiming a bound on a closed interval. Align the browser visualizer with the defined network rather than silently clamping the final sample into the last block.
- Resolve the polygon mismatch: edge offset cos(π/N) defines an inscribed regular polygon, while the current wording describes a polygon surrounding the unit disc. Prefer circumscribed polygons with unit edge offset for the cylinder experiment; update finite-N equations, diagrams, and readouts together.
- Audit other boundary-dependent solutions, including the outside-square example, shared edges, and threshold equality.

Acceptance: named test points on every relevant boundary have explicit expected labels. Figures, formulas, solutions, and lab scores agree at those points.

### 1.4 Qualify Hebb and Oja

- Define C=E[xxᵀ] as a second-moment matrix; require zero-mean inputs before interpreting it as covariance and discussing variance/PCA.
- Explain that the mean update conditions on current weights and assumes inputs are drawn from the stated fixed distribution; distinguish the mean-field ODE from an individual stochastic trajectory.
- State the nonzero leading-component and eigenvalue-gap assumptions for convergence to a particular principal direction. Explain sign ambiguity and repeated leading eigenvalues.
- Distinguish continuous-time normalization from discrete Oja updates, whose behavior depends on step size and input scale. Avoid promising convergence for arbitrary initialization and learning rate.
- Use the scalar and diagonal examples to explain positive feedback before introducing the general spectral derivation. Retain Sanger's rule only as an optional preview unless fully scaffolded.

Acceptance: a student can explain why the scalar rule grows, what Oja changes, and why an excessive discrete step size can still fail. PCA claims explicitly require centred data.

### 1.5 Correct the curriculum's parity claim

- Replace NN02's “exponential one-hidden-layer cost of parity” with the exponential cost of its minterm/DNF construction.
- Compare that construction with the n-counting-unit shallow threshold network and an XOR tree. Count units, parameters, and depth separately, stating gate and connectivity conventions.
- Do not use parity as an unrestricted exponential depth-separation example for threshold networks.
- Check adjacent brief language for the same conflation of a construction's cost with a lower bound.

Acceptance: NN01 and NN02's brief agree on the n+1-unit construction and do not imply it contradicts a genuine lower bound.

## 2. Make the reading route self-contained — P1

Keep the historical sequence recognizable, with these changes:

1. **Orientation:** show one complete numerical threshold calculation immediately, then explain the questions the chapter will answer.
2. **History and early models:** retain the causal story, but move long historical lists, quotations, and capacity arithmetic into clearly marked enrichment. Each model ends with its limitation and the question the next model answers.
3. **Hebbian learning:** teach the scalar example in the main route. Mark the covariance/eigenvector/ODE treatment as a mathematical extension with actual prerequisite links and a worked two-coordinate example.
4. **Perceptron and Boolean networks:** retain the OR trace, XOR proof, three-unit XOR network, and DNF construction. Add a complete table connecting hidden activations to output for one network.
5. **Geometry:** retain fences, square, complement, and shared edges. Show how each inequality becomes weights and a bias before generalizing to polygons and unions.
6. **Approximation:** teach the skyline construction and its error definition; use the cylinder as a stretch experiment illustrating both a useful limit and a failed composition argument.
7. **Closure:** summarize what students can now construct, what they cannot yet train, and how NN02 and NN03 continue the same questions.

Declare separate prerequisites for the main reading, standard-library Python work, and optional NumPy/PyTorch extensions. Link to authored lessons; do not list planned prerequisites as if they are available. Add a suggested multi-session route through the existing 20-hour estimate, separating required work from optional extensions. Reassess the estimate after the revision instead of changing it without evidence.

Acceptance: the main explanation never requires an undeclared advanced concept. Every required exercise can be solved from the chapter plus its stated prerequisites; external readings provide enrichment.

## 3. Align practice and feedback with understanding — P1

- Rebalance the twelve-question review: ten conceptual/application questions and two historical questions. Cover threshold calculation, bias, perceptron updates, XOR, hidden-layer composition, region boundaries, shared units, Hebb/Oja, approximation error, and representation versus learning.
- Add a prediction before manipulation in the principal gate, perceptron, region, and approximation labs. Follow the reveal with a brief causal explanation.
- Provide static solution sketches for the required section practice, not only hints or tutor access. Retain full worked answers for cumulative problems.
- Preserve existing checkpoint keys K1–K6, but revise their contents if needed so passing them demonstrates the published mastery criteria, including a learning-rule trace and a qualified approximation claim.
- Remove required dependence on details found only in the reading list. Mark historical source questions as enrichment.
- Audit prompts that may encode additional errors: C2 asks for two matrices although the natural A4 network has three affine stages; B4 needs a consistent augmented-space margin; A5's claim about arbitrary separate edge weights needs its own proof rather than a proof restricted to equal weights per shape.
- Keep robust input validation in Python labs, but distinguish those software requirements from the neural-network concept being assessed.

Acceptance: required practice checks explanations, calculations, construction, and transfer. Students can get meaningful feedback without a model connection, and checkpoints cover the stated learning outcomes.

## 4. Keep all teaching surfaces synchronized — P1

| File or area | Planned changes |
|---|---|
| `content/09-deep-learning-core/01-connectionism-threshold-unit.md` | Claims, prerequisites, route, examples, exercises, and mastery criteria |
| `content/09-deep-learning-core/_plan.md` | NN01 scope/prerequisites and NN02 parity correction |
| `public/theory/labs/nn-01.js` | Cylinder explanation/geometry, region solutions, pulse endpoints, prediction prompts, quiz and feedback |
| `public/theory/answers/nn-01-connectionism-threshold-unit.js` | Correct solutions, assumptions, rubrics, and exact matching exercise statements |
| `scripts/figures/nn01.mjs`, `scripts/figures/nn01-illustrations.mjs` | Geometry, captions, and any diagrams affected by the revised explanations |
| `content/assets/nn01-*.svg` | Regenerated affected illustrations |
| `scripts/check-neural-networks.mjs` or a focused companion check | Behavioral verification of corrected mathematical constructions |
| `labs/checks.py`, `labs/reference.py`, `labs/browser_labs.json` | Change only where the revised task semantics require it; preserve current interfaces |
| Generated theory catalog/runtime | Rebuild using the existing pipeline after source changes |

Audit both the dedicated NN01 lab and any separately registered lab that exposes the same construction. Update overview counts and labels from the actual lab inventory; current prose, plan counts, and UI numbering should not contradict one another.

## 5. Verification and completion gates

### Mathematical verification

- Exhaustively verify relevant Boolean constructions on their full small truth tables.
- Evaluate ring, polygon, complement, and pulse networks on boundary points and points just to either side, including the final pulse endpoint.
- Check finite-N cylinder counts against direct inequalities and the limiting curve; preserve the overlapping-tail counterexample as evidence of the limitation.
- Check the scalar Hebb recurrence and deterministic Oja examples, including a deliberately unstable discrete update.
- Test the actual solution evaluator or shared implementation where practical; avoid tests that merely repeat a formula without exercising the student-facing construction.

### Integration verification

Run `node scripts/check-neural-networks.mjs`, the seven NN01 reference Python tasks, `node scripts/build-theory.mjs`, and `node scripts/check-theory.mjs`. Add focused checks for corrected behavior rather than treating existing structural checks as mathematical proof.

Open the built reader and inspect the revised lab controls, figures, equations, solution reveals, quiz feedback, and Python task tabs. Verify existing saved-state keys still resolve. Record any browser coverage that could not be completed.

### Pedagogical verification

Walk the required route as a reader with only the declared prerequisites. For every new symbol or operation, verify that its meaning, shape where relevant, and a concrete use precede required practice. Check that historical enrichment and mathematical extensions can be skipped without creating gaps in the core explanation.

If a representative student is available, ask them to explain a network, predict an update, solve an unfamiliar region problem, and distinguish approximation from learning. Record observed sticking points. An author walkthrough alone should not be described as student-validated intuition.

## Delivery order and definition of done

1. Correct claims and establish the intended mathematical conventions.
2. Revise the main route and prerequisite bridges.
3. Update labs, figures, practice, and reference answers together.
4. Add focused behavioral checks, rebuild, and inspect the reader.
5. Deliver a concise change summary with validation results and remaining limitations.

Complete when the confirmed correctness issues are resolved across every teaching surface, the core route is self-contained given its prerequisites, required assessments match its learning goals, and mathematical plus integration checks pass. Publishing remains outside this plan.

## Implementation and validation record — 2026-10-15

Implemented the corrections and teaching changes above. The chapter retains the 11-785 progression, existing lesson/lab/task IDs, and all 26 answer-bank keys. It now has a numerical opening, explicit route prerequisites, optional historical and spectral detail, 27 static practice sketches, a ten-concept/two-history review quiz, and a checkpoint covering approximation, learning, geometry, and scalar stabilization. K6 now tests whether fixed decay can replace Oja; its transfer argument needs no spectral prerequisites. The existing 20-hour estimate is retained as a planning estimate, with a suggested session allocation; no student timing study has been performed.

The polygon experiment now uses circumscribed edge offset 1. The chapter and feedback explain why cylinder tails invalidate the proposed union rule. Both ring constructions include the inner boundary. Pulse plots use the raw half-open pulse evaluator at the final endpoint, display open/closed endpoint markers, and label their error measurements as sampled. The prose separately derives a general endpoint correction, a uniform-continuity argument, and the stronger Lipschitz error bound. The parity corrections cover NN02 and the adjacent recurrent-network brief. Figures and the generated reader catalog/runtime have been rebuilt.

Changed quiz questions archive prior answers under `nn01:quiz-previous:<key>` before starting a new answer set at the existing key. Notes, region drafts, kata code, exercise work, and Python task interfaces retain their keys. The browser checks confirmed restored notes/code and revised quiz answers after reload.

Passed checks:

- `node scripts/check-neural-networks.mjs`, including the new `scripts/check-nn01-math.mjs` behavioral checks of actual lab reference programs. These cover exact region networks, both ring architectures and boundary probes, all five kata references, exhaustive small parity tables, pulse endpoints/error bounds, finite cylinder geometry, and the overlapping-tail counterexample.
- All seven NN01 Python reference tasks through `labs.checks` locally.
- `node scripts/build-theory.mjs` and `node scripts/check-theory.mjs` for generated content, links, registered labs, answer statements, and JavaScript syntax.
- `node scripts/figures/build.mjs --check` and `git diff --check`.
- Chromium browser checks at 1440×1000 and 390×844: all 14 panels mount, equations render without KaTeX parse errors, static/prediction solutions reveal, ring boundary mistakes are rejected, cylinder and pulse controls update, the quiz accepts the correct twelve answers, saved work survives reload, and the mobile page has no horizontal overflow. No JavaScript page errors were observed. Desktop and mobile screenshots plus browser diagnostics are retained locally in `work/nn01-review/`.

Remaining verification limits:

- Browser Python execution could not be completed: the worker's existing `importScripts` request for `https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.js` failed in this browser environment. The URL matches the [official Pyodide instructions](https://pyodide.org/en/stable/usage/index.html), and a separate HTTP request returned 200. The seven tasks pass locally, and the browser workspace restores its saved code. No runtime URL or global dependency change was made.
- The existing reader reports an integrity mismatch for the separate KaTeX auto-render script. The reader's direct KaTeX rendering produced nine rendered formulas without parse errors in this chapter. That pre-existing dependency issue was recorded rather than changed as part of NN01.
- Optional local NumPy/PyTorch experiments were reviewed but not executed. No representative-student study has established the chapter's intuitiveness or actual study time. This is an author review plus mathematical and integration verification, not student validation.

No deployment was performed.
