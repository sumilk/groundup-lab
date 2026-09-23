# Curriculum build plans — research engineer and research scientist preparation

These plans extend the [linear algebra build plan](02-linear-algebra/_plan.md) using the depth and progression of the [probability/statistics sequence](README.md#probability-and-statistics-build-order). They are authoring briefs: **13 new track plans with 187 detailed module briefs**, including expansions of eight existing lessons. They do not represent 187 newly authored lessons, runnable labs, or completed competencies.

The organizing target is practical research at leading AI labs: derive the method, implement it correctly, diagnose failures, measure cost and quality, and defend the evidence. Research engineer (RE) and research scientist (RS) routes share that foundation. RE gates emphasize implementation, performance, and reliability; RS gates emphasize mathematical assumptions, question selection, and experimental inference. Both require coding and scientific judgment.

## 1. Plans and current coverage

| Track | Plan | Planned units | Estimated study hours |
|---|---|---:|---:|
| 00 | [Foundations](00-foundations/_plan.md) | 8 | 134 |
| 01 | [Python and numerical programming](01-python/_plan.md) | 14 | 324 |
| 03 | [Calculus and optimization](03-optimization/_plan.md) | 12 | 414 |
| 04 | [Data structures and algorithms](04-dsa/_plan.md) | 14 | 364 |
| 06 | [Information, learning, and decision theory](06-information-learning-decision/_plan.md) | 14 | 418 |
| 07 | [Classical machine learning](07-classical-ml/_plan.md) | 15 | 436 |
| 08 | [PyTorch and differentiable programming](08-pytorch/_plan.md) | 14 | 392 |
| 09 | [Deep learning](09-deep-learning/_plan.md) | 18 | 570 |
| 10 | [Natural language processing and language data](10-nlp/_plan.md) | 14 | 414 |
| 11 | [LLM training, accelerator systems, and inference](11-llm-systems/_plan.md) | 20 | 682 |
| 12 | [Reinforcement learning and post-training](12-reinforcement-learning/_plan.md) | 18 | 596 |
| 13 | [Practical AI, retrieval, and agentic systems](13-agentic-systems/_plan.md) | 14 | 406 |
| 14 | [Research practice and RE/RS project defense](14-research-practice/_plan.md) | 12 | 430 |

The estimates total **5,580 hours before diagnostic skips and reuse**, excluding the reference LA and probability/statistics tracks. This is a comprehensive authoring scope across several specializations, not a single required preparation schedule. Count a shared project only once when it satisfies both a subject capstone and Research Practice. Budget a selected route from its prerequisite closure; do not sum every track and call that a time-to-hire estimate.

The [LA plan](02-linear-algebra/_plan.md) remains the reference for its 26 modules. The probability/statistics track already has 19 numbered detailed lessons (00–18); use those actual files as its sequence. Its README also mentions an optional overview that is not an additional numbered lesson. Research Practice is present in `lib/curriculum.ts` but had no content directory; its new plan fills that authoring gap.

**Status vocabulary:** an existing overview is orientation; an existing detailed lesson is an expansion target where specified; every other brief is planned. A proposed lab ID, answer bank, or function name is a reservation, not a registered implementation. No reader or curriculum completion state should be advanced until the lesson and its checks exist.

## 2. What is restructured and why

The existing content directories are the authoring boundaries. The broader cards in `lib/curriculum.ts` combine some of these subjects and are a navigation summary, not the authoritative inventory of authored lessons. Keep that catalog stable until actual lessons are integrated; then map each implemented lesson to the appropriate card and update metadata deliberately.

| Existing broad area | Detailed ownership |
|---|---|
| Python & DSA | Python language/numerical software in 01; algorithm correctness and resource bounds in 04 |
| Mathematics | Mathematical language/numerics in 00; LA in 02; calculus/optimization in 03; probability in 05; information/learning/decision theory in 06 |
| Machine Learning | Statistical derivations in 05; estimator and pipeline behavior in 07 |
| PyTorch & Systems | Framework semantics, autodiff, and trainer correctness in 08; kernels, distributed training, reliability, and serving in 11 |
| Deep Learning | Architectural and representation principles in 09, including vision, state-space models, diffusion/flow matching, multimodal learning, sparse experts, and interpretability |
| NLP & LLMs | Language/text/tokenization/corpus/evaluation in 10; pretraining and adaptation execution in 11; application workflows in 13 |
| RL & Post-training | Control, policy estimators, preferences, DPO, RLVR/GRPO, planning, and reward validity in 12; actor/learner infrastructure in 11 |
| Research Practice | Explicit sequence in 14 from paper reading to reproduction, original extension, and RE/RS defense |

The added research topics serve concrete capability gaps: numerical verification before kernels; objective equivalence before sharding; independent evaluation before reward optimization; modality and distribution interventions before representation claims; and reproducible evidence before project defense. They are branches with prerequisites rather than mandatory detours before a first useful project.

## 3. Prerequisite key and study routes

Handles are planning references, not reader front-matter IDs. `F00` means Foundations module 00; `OPT03` means Optimization module 03. The detailed briefs specify proposed content IDs separately. Existing IDs are preserved exactly.

| Prefix | Source | Number convention |
|---|---|---|
| F | [Foundations](00-foundations/_plan.md) | 00–07 |
| PY | [Python](01-python/_plan.md) | 02–15; existing 01 is an overview |
| LA | [Linear algebra](02-linear-algebra/_plan.md) | 01–26; LA01–LA08 are authored |
| OPT | [Optimization](03-optimization/_plan.md) | 01–12; existing 01 and 03–07 expand in place |
| DS | [DSA](04-dsa/_plan.md) | 02–15; existing 01 is an overview |
| PS | [Probability/statistics](README.md#probability-and-statistics-build-order) | Actual filename numbers 00–18, not the README list positions |
| IL | [Information/learning/decisions](06-information-learning-decision/_plan.md) | 02–15 |
| ML | [Classical ML](07-classical-ml/_plan.md) | 02–16 |
| PT | [PyTorch](08-pytorch/_plan.md) | 02–15 |
| DL | [Deep Learning](09-deep-learning/_plan.md) | 02–19 |
| NLP | [NLP](10-nlp/_plan.md) | 02–15 |
| SYS | [LLM Systems](11-llm-systems/_plan.md) | 02–21 |
| RL | [RL/Post-training](12-reinforcement-learning/_plan.md) | 03–20; existing 01–02 are overviews |
| APP | [Practical AI Systems](13-agentic-systems/_plan.md) | 02–15 |
| RP | [Research Practice](14-research-practice/_plan.md) | 01–12 |

**Resolve prerequisites literally.** Follow each module map, including forward-numbered dependencies and cross-track gates. A range in the route sketches below describes a destination sequence, not permission to omit its prerequisites. An existing overview alone does not satisfy a detailed gate. Where LA's prose write order differs from its stated prerequisites (notably LA11/LA12), honor the prerequisite or explicitly revise it when authoring; do not silently require an untaught algorithm.

**Shared entry route.** Diagnose F00–F03, PY02–PY07, and DS02–DS05. Develop LA01–LA08 and OPT01–OPT03 alongside PS00–PS06. PS05 unlocks stochastic optimization; OPT06 and PT02–PT09 unlock reliable neural training. Read RP01 early; RP02–RP04 follow the required inference/design units. Use ML02–ML05 for transparent baselines and DL02–DL07 for a first neural model, completing LA09–LA10 where ridge/conditioning require them.

**RE: training and systems.** Build toward PT15 and SYS02–SYS14, choosing accelerator or distributed depth. Add SYS15–SYS17 for inference, or SYS18–SYS19 plus the required RL units for post-training infrastructure. Finish one SYS21 project and an RP reproduction/defense. Success means a measured end-to-end improvement with objective parity, clear failure behavior, and reproducible artifacts.

**RE: evaluation and agent infrastructure.** Build toward NLP07, NLP09–NLP14, APP02–APP12, and the PS evaluation/calibration sequence. Use DS13 for retrieval indexes and PY12/PT11 for reliable state. APP13–APP15 are the learned-agent extension. Success means replayable task evaluation, correct tools/state, and cost-quality evidence against a simpler baseline.

**RS: optimization and learning.** Build toward OPT08–OPT12 and IL06–IL14, with the LA numerical/curvature and probability prerequisites actually used. Choose OPT10 as a bilevel specialization. Integrate one theoretical derivation, one exact toy oracle, and a controlled neural experiment with RP05–RP12.

**RS: representations and generative modeling.** Build toward DL09–DL19 with a selected vision, sequence, diffusion, multimodal, or interpretability branch. Use PS14–PS17 for latent/generative inference, LA19–LA25 for relevant geometry, and IL04 for information objectives. An early branch project can precede the full DL19 synthesis. Success means an explicit mechanism or behavior claim tested with interventions and competing explanations.

**RE/RS: RL and post-training.** Build RL03–RL10 first, then RL12–RL16 alongside SYS18–SYS19. Add RL11 for offline/continuous control or RL17–RL18 for planning/test-time compute. Finish RL19–RL20 and RP defense. Success means a verified estimator, valid reward/evaluation channel, and an improvement at a declared interaction or token budget.

**Milestone exits.** A first sound CPU experiment, a correct small neural trainer, and one defensible specialization project are separate accomplishments. Do not wait for the entire curriculum to begin reproductions. Defer unrelated specialist modules; use their diagnostics when a research question makes them necessary.

## 4. Shared lesson-authoring contract

This is the minimum owed by every new lesson; adapt the presentation when a different visual or experiment teaches better. The linear algebra format is a baseline, not a ceiling.

1. **Prerequisite diagnostic:** three to six short checks with a concrete repair link. Declare notation, tensor shapes, units, and the outcome. For future prerequisite lessons, either author them first or supply a named external reading and diagnostic; do not insert dead links.
2. **Learning route:** show the path from finite/scalar examples to general statements and then research judgment, as the probability lessons do. State two to five central results. Divide overloaded briefs into teachable subsections or later lessons without changing an existing ID's meaning.
3. **Numbered teaching sections:** introduce definitions before using them, develop a fully worked example, derive the result with assumptions, and distinguish exact identity, approximation, high-probability bound, asymptotic claim, and empirical observation.
4. **Section practice:** Foundation checks a definition or direct computation; Core combines ideas; Stretch tests transfer, a proof, or a failure mode. Every prompt has an authored static `> **Hint:**` in its blockquote. Hints must work offline.
5. **Interactive experiment:** specify controls, readouts with units, the prediction before revealing an outcome, and at least one degenerate or adversarial preset. A simulator must identify the phenomenon it cannot measure, especially real hardware speed or real-world model quality.
6. **Implementation ladder:** provide three checkable small tasks with explicit inputs, outputs, mutation policy, edge cases, and tolerances. Use stdlib Python for browser tasks, NumPy for local numerical algorithms, and PyTorch for local differentiable models. In research/tooling modules, a validated manifest or analysis script is a legitimate implementation artifact.
7. **Derivations to own:** list the results the learner must reconstruct unaided, including assumptions and one counterexample outside them. For software modules, a state-transition invariant or complexity proof plays the same role.
8. **Exercise bank and cumulative transfer:** use paper, NumPy, PyTorch, mixed, and gate modes as appropriate; include both a direct check and an unfamiliar variant. Include RE and RS evidence from the module brief and a failure-diagnosis task.
9. **Six-part checkpoint:** concept explanation, derivation, small calculation, implementation/debugging, experiment critique, and unfamiliar extension. A critical conceptual or correctness error requires repair even if the numerical quiz score is high.
10. **Research connection and reading:** identify a primary paper, official implementation, or authoritative textbook chapter that the result unlocks. Document version-specific behavior for frameworks/algorithms and mark open questions explicitly. End with pending coverage rather than an unsupported claim of completeness.

### Exercise, answer-bank, and identifier contracts

Use LA's exact exercise-header grammar, for example:

```text
**A7 · Core · paper — a counterexample to the claim.**
```

Prefixes: `A` paper, `B` NumPy, `C` PyTorch, `M` cumulative, `K` checkpoint. Modes are `paper`, `NumPy`, `PyTorch`, `mixed`, and `gate`; difficulty is Foundation, Core, or Stretch. New answer banks are namespaced per track and unit, such as `pt-05-autograd-vjp-jvp`, so they cannot collide with LA's `01-span` style banks.

Use one answer entry per exercise in `public/theory/answers/<bank>.js`, carrying `statement`, `plain`, and `solution`; include `fields` for typeable answers (`num`, `vec`, `ratio`, `set`, `choice`) and field-keyed `hints`. Typed checks and hints run offline; written proof assessment uses the explicit solution/rubric. Do not pretend a text-pattern check verifies a proof.

New lesson filenames follow the reserved number plus the brief's slug. Retain all existing lesson paths and front-matter IDs unless a separately implemented migration updates every inbound reference. This particularly protects the optimization IDs and the two Foundations IDs. New IDs and proposed lab/bank names must be unique. Overview pages without current metadata do not secretly have new IDs assigned by this plan.

A new interactive registers through `GU.lab(id, mount)` and a fenced `lab` block only after it exists. Declare controls before `K.plot`; the draw callback runs during construction. Register Python stubs, references, behavioral checks, and browser entries together. Extend existing checker coverage where needed when another track adopts the richer bank grammar; do not assume all LA-specific assertions already apply to every track.

## 5. Evidence, compute, and assessment

Every empirical module reports the sampling/evaluation unit, baseline, selection budget, seeds or resampling design, raw failures, and the effect size with justified uncertainty. The number of repeats follows variability, desired precision, and compute constraints; three lucky seeds are not a universal scientific standard. Separate exploratory runs from held-out confirmation and report the total budget, including failed and discarded runs.

Use three explicit execution tiers: **browser/CPU oracle**, **local array/framework experiment**, and **optional accelerator or multi-device measurement**. Set input sizes and resource limits before expensive work. CPU event simulations establish protocol/algorithm behavior; they do not certify GPU throughput, networking behavior, or large-scale scientific effects. Record versions, hardware, dtype, shapes, synchronization, warmup, peak memory, raw timing distributions, and correctness tolerances for performance claims.

Portfolio evidence is shared across roles: source and environment, data provenance/splits, an exact or trusted reference, tests, complete run configurations, raw results, executable figures, and a concise limitations statement. RE assessment adds implementation under an unseen failure or resource constraint. RS assessment adds a new hypothesis, a derivation or identification argument, competing explanations, and a proposed decisive follow-up. These are preparation targets, not promises about any employer's interview process.

## 6. Authoring sequence and validation

First expand the foundational Python, calculus, and tensor units that many later plans depend on. Then establish a correct MLP/trainer and tokenizer/decoder baseline. Build shared visuals when first needed: reuse LA's chart/heat primitives, and add storage, state-machine, graph/trellis, and distributed timeline widgets only for authored lessons. Prioritize the selected specialization after those shared gates.

For an implemented lesson, run:

```sh
node scripts/build-theory.mjs
node scripts/check-theory.mjs
python3 -m labs.checks --reference
```

Then inspect the reader in both themes, complete one typed and one written exercise, run the failure preset, and check local extension instructions from a clean environment. Add relevant bank/lab checks where the generic checker does not yet cover a new track. Do not build shared infrastructure just to make a planning document look complete.

For a plan-only change, verify all local links, module-number/ID uniqueness, prerequisite references, and the dependency graph. Confirm the builder excludes underscore-prefixed files, so these plans remain outside the lesson catalog. Preserve unrelated generated-file edits in the working tree.

## 7. Role grounding and primary technical anchors

Role emphasis was checked against official pages on 2026-09-23. OpenAI's RE description emphasizes strong programming, distributed systems, and high-performance ML implementations; its RS description emphasizes new ideas and independent ownership of a research agenda. The RE/RS gates here are a curriculum design inference from those responsibilities, not an official hiring syllabus. Sources: [Research Engineer](https://openai.com/careers/research-engineer-san-francisco/) and [Research Scientist](https://openai.com/careers/research-scientist-san-francisco/).

The breadth across pretraining, inference/performance, RL, evaluations, and interpretability is also informed by [Anthropic's research/engineering careers](https://www.anthropic.com/careers) and [Google DeepMind's careers](https://deepmind.google/careers/). Individual roles vary; choose a specialization from an actual role and research interest rather than treating all topics as equal hiring requirements.

Technical anchors for authoring include [PyTorch autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html) for PT05–PT06 and [numerical accuracy](https://docs.pytorch.org/docs/stable/notes/numerical_accuracy.html) for PT10; [FlashAttention](https://arxiv.org/abs/2205.14135) for SYS08's IO-aware exact-attention treatment; [speculative decoding](https://arxiv.org/abs/2211.17192) for SYS17's distribution-preserving acceptance rule; [DPO](https://arxiv.org/abs/2305.18290) for RL14; and [DeepSeekMath](https://arxiv.org/abs/2402.03300) for the specified GRPO formulation in RL15. Each future lesson must cite the exact version/variant it implements and compare its assumptions with the brief's failure case.
