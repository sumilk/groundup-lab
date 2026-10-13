# Reinforcement learning and post-training — build plan

*An authoring brief, following the [linear algebra plan](../02-linear-algebra/_plan.md) and the probability/statistics teaching sequence. These are planned learning units, not newly authored lessons or registered labs.*

## 1. Target and current state

Build sequential decision-making from finite problems with exact solutions to policy optimization and language-model post-training. Every estimator must identify its sampling policy, normalization, baseline, and approximation; every improvement must survive reward and evaluation audits.

Two overviews exist: [MDPs, Bellman equations, and TD](01-mdps-bellman-td.md) and [policy gradients and actor–critic](02-policy-gradients-actor-critic.md). Preserve both paths. Detailed units reserve 03–20 so the new bandit-to-control sequence does not require destructive renumbering.

**Legacy-page review:** Keep both overviews: the first develops Bellman contraction, termination/truncation and the `bellman` task; the second connects trajectory gradients, baselines, GAE and PPO semantics. PS14 supplies gradient-estimator tools, not the complete RL setting. Migrate the first into RL04/RL05 and the second into RL08/RL09/RL10 before retiring either. See the [cross-track audit](../_legacy-audit.md) for the removal criteria and current coverage.

**Scope:** 18 units; 596 estimated study hours including derivations, practice, and the capstone. These are planning estimates, not elapsed-time requirements or hiring guarantees. Diagnose existing knowledge and use the gates to skip material already mastered. Module numbers below are file-number reservations within this track; retained overview pages are outside the new sequence unless explicitly listed.

## 2. Teaching and authoring contract

Apply the [shared authoring contract and prerequisite key](../_plans.md). Each unit must develop its spine through definitions, a worked small example, derivations with assumptions, an interactive prediction and failure case, and an ML application. Close every numbered teaching section with Foundation / Core / Stretch practice and static hints. Include three small checkable implementations, a derivations list, a cumulative exercise set, and the six-part mastery checkpoint. Each module's RE and RS gates below are additional concrete evidence requirements.

Module handles such as `RL03` refer to this plan; `LA08` and `PS05` refer to the reference tracks. Dependencies list actual conceptual entry requirements, not a requirement to finish every earlier track. New content IDs use `rl.<slug>`; preserve existing IDs and filenames where noted below. Proposed answer banks and lab IDs are namespaced, are not yet registered, and must be validated when implemented.

**Ownership boundary.** Own bandits, control, policy-gradient estimators, preference objectives, verifiable rewards, and sequential evaluation. Probability owns likelihood/importance sampling; optimization owns stochastic approximation; LLM Systems owns rollout infrastructure and serving; Practical AI Systems owns tool permissions and application reliability.

## 3. Module map

| Handle | Module | Hours | Prerequisites |
|---|---|---:|---|
| RL03 | Bandits and exploration | 28 | PS05, PS09 |
| RL04 | MDPs, Bellman equations, and planning | 30 | RL03, DS08, LA02 |
| RL05 | Monte Carlo, TD, SARSA, and Q-learning | 32 | RL04, OPT04 |
| RL06 | Importance sampling and off-policy evaluation | 30 | RL05, PS09, PS10 |
| RL07 | Deep value learning and instability | 32 | RL05, PT09, NN08 |
| RL08 | Policy-gradient estimators and baselines | 32 | RL06, PT05, PS14 |
| RL09 | Actor–critic, advantage estimation, and GAE | 32 | RL08, RL07 |
| RL10 | Trust regions, PPO, and KL control | 36 | RL09, OPT07 |
| RL11 | Continuous control, entropy regularization, and offline RL | 34 | RL10, RL06 |
| RL12 | Preference data and reward modeling | 32 | RL08, PS11, NLP12, SYS18 |
| RL13 | RLHF and KL-regularized policy optimization | 34 | RL12, RL10 |
| RL14 | DPO and direct preference objectives | 32 | RL12, IL03, OPT03 |
| RL15 | Verifiable rewards and group-relative policy optimization | 36 | RL13, RL14, SYS18 |
| RL16 | Reward hacking, process rewards, and evaluator validity | 32 | RL15, PS10, NLP12 |
| RL17 | Model-based RL, planning, and partial observability | 34 | RL11, DS10, PS17 |
| RL18 | Reasoning, search, and test-time compute | 32 | RL16, RL17, NLP13 |
| RL19 | RL experimental design and replication | 30 | RL18, PS08, RP04 |
| RL20 | Capstone: a policy or post-training study | 48 | RL19 |

## 4. Detailed module briefs

### Part I · Exact sequential decisions

*Thesis: small state spaces make assumptions and estimator bias visible.*

**Module 03 — Bandits and exploration**

`handle: RL03` · `id: rl.bandits-exploration` · 28h · prerequisites: PS05, PS09 · proposed bank: `rl-03-bandits-exploration`

**Spine and derivations:** Stochastic bandits, regret, epsilon-greedy, UCB confidence reasoning, Thompson sampling, and nonstationary counterexamples.

**Interactive experiment:** `rl-bandits-exploration` — Change gaps, noise, and drift; show premature commitment and confidence failure with heavy-tailed rewards.

**Implementation ladder:** Implement epsilon_greedy, ucb, and thompson_beta_bernoulli.

**RE gate:** Compare policies with common problem instances and multiple independent runs.

**RS gate:** Derive a confidence-based choice rule and state the stochastic assumptions of its regret claim.

**Module 04 — MDPs, Bellman equations, and planning**

`handle: RL04` · `id: rl.mdps-bellman-planning` · 30h · prerequisites: RL03, DS08, LA02 · proposed bank: `rl-04-mdps-bellman-planning`

**Spine and derivations:** States/actions/transitions/rewards, discounted returns, Bellman expectation/optimality operators, contraction, policy iteration, and value iteration.

**Interactive experiment:** `rl-mdps-bellman-planning` — Edit transitions and discount; show terminal rewards, unreachable states, and failure of a discounted argument at gamma one.

**Implementation ladder:** Implement policy_evaluation, value_iteration, and policy_iteration.

**RE gate:** Match iterative values to a direct small linear solve and validate terminal conventions.

**RS gate:** Prove Bellman contraction and identify which assumptions ensure a unique fixed point.

**Module 05 — Monte Carlo, TD, SARSA, and Q-learning**

`handle: RL05` · `id: rl.mc-td-control` · 32h · prerequisites: RL04, OPT04 · proposed bank: `rl-05-mc-td-control`

**Spine and derivations:** Prediction/control, bootstrapping, on/off-policy targets, TD fixed points, exploration coverage, and terminal versus truncated episodes.

**Interactive experiment:** `rl-mc-td-control` — Change behavior policy and truncation; show biased returns and the SARSA/Q-learning policy distinction.

**Implementation ladder:** Implement mc_returns, td_update, and tabular_control_variants.

**RE gate:** Recover known small-MDP values and handle timeout bootstrapping correctly.

**RS gate:** Explain the convergence assumptions and give a case where insufficient coverage breaks learning.

**Module 06 — Importance sampling and off-policy evaluation**

`handle: RL06` · `id: rl.offpolicy-estimation` · 30h · prerequisites: RL05, PS09, PS10 · proposed bank: `rl-06-offpolicy-estimation`

**Spine and derivations:** Trajectory/per-decision ratios, support overlap, self-normalization bias, variance explosion, doubly robust estimation, and confidence limitations.

**Interactive experiment:** `rl-offpolicy-estimation` — Change behavior-target mismatch and horizon; show rare enormous weights and zero-support actions.

**Implementation ladder:** Implement trajectory_weights, per_decision_is, and tabular_doubly_robust.

**RE gate:** Validate estimators against an exact MDP and report effective sample size and failures.

**RS gate:** Derive unbiasedness under support and explain why clipping trades variance for bias.

### Part II · Function approximation

*Thesis: bootstrapping and policy updates introduce coupled sources of error.*

**Module 07 — Deep value learning and instability**

`handle: RL07` · `id: rl.deep-value-learning` · 32h · prerequisites: RL05, PT09, NN08 · proposed bank: `rl-07-deep-value-learning`

**Spine and derivations:** Function approximation, replay, target networks, DQN/double DQN, maximization bias, and the deadly triad.

**Interactive experiment:** `rl-deep-value-learning` — Change target lag and replay distribution; expose divergence and overestimation despite lower training loss.

**Implementation ladder:** Implement dqn_target, replay_buffer, and double_q_update.

**RE gate:** Reproduce a small baseline and ablate target/replay components with fixed environments.

**RS gate:** Explain which stability mechanism each component targets without claiming a general convergence guarantee.

**Module 08 — Policy-gradient estimators and baselines**

`handle: RL08` · `id: rl.policy-gradient-estimators` · 32h · prerequisites: RL06, PT05, PS14 · proposed bank: `rl-08-policy-gradient-estimators`

**Spine and derivations:** Trajectory likelihood ratios, policy-gradient theorem, reward-to-go, action-independent baselines, entropy terms, and gradient-estimator variance.

**Interactive experiment:** `rl-policy-gradient-estimators` — Change baseline and reward scale; compare exact finite-policy gradients with sampled estimates and a biased action-dependent baseline.

**Implementation ladder:** Implement reinforce_loss, reward_to_go, and exact_policy_gradient_oracle.

**RE gate:** Match Monte Carlo estimates to an exact small-environment gradient within uncertainty.

**RS gate:** Derive the baseline identity and state when stop-gradient is required in the implemented estimator.

**Module 09 — Actor–critic, advantage estimation, and GAE**

`handle: RL09` · `id: rl.actor-critic-gae` · 32h · prerequisites: RL08, RL07 · proposed bank: `rl-09-actor-critic-gae`

**Spine and derivations:** Value baselines, TD residuals, lambda returns, GAE bias/variance, bootstrapping masks, shared encoders, and advantage normalization.

**Interactive experiment:** `rl-actor-critic-gae` — Change lambda, critic bias, and timeout masks; show lower variance with a systematically biased advantage.

**Implementation ladder:** Implement gae, actor_critic_loss, and lambda_return_reference.

**RE gate:** Match backward recurrences to explicit sums and preserve terminal/truncation semantics.

**RS gate:** Explain the estimator bias introduced by critic error and the chosen horizon convention.

**Module 10 — Trust regions, PPO, and KL control**

`handle: RL10` · `id: rl.trust-region-ppo` · 36h · prerequisites: RL09, OPT07 · proposed bank: `rl-10-trust-region-ppo`

**Spine and derivations:** Likelihood ratios, clipped surrogate, trust-region motivation, KL penalties, multiple epochs, value clipping, and actual versus proxy constraints.

**Interactive experiment:** `rl-trust-region-ppo` — Change step size and clipping range; reveal KL growth despite a clipped objective and ratio underflow.

**Implementation ladder:** Implement ppo_surrogate, kl_diagnostics, and a minimal PPO trainer.

**RE gate:** Reproduce a stable baseline and inspect unclipped/clipped contributions and policy lag.

**RS gate:** Derive the surrogate and explain why clipping is not a hard KL constraint or guaranteed improvement.

**Module 11 — Continuous control, entropy regularization, and offline RL**

`handle: RL11` · `id: rl.continuous-offline-rl` · 34h · prerequisites: RL10, RL06 · proposed bank: `rl-11-continuous-offline-rl`

**Spine and derivations:** Reparameterized continuous policies, action transforms and Jacobians, SAC objectives, offline support mismatch, conservative value ideas, and behavior regularization.

**Interactive experiment:** `rl-continuous-offline-rl` — Change action squashing and dataset support; show missing-Jacobian density errors and extrapolated high Q values.

**Implementation ladder:** Implement squashed_gaussian_logprob, soft_bellman_target, and offline_support_audit.

**RE gate:** Validate density transforms and compare against a behavior-policy baseline.

**RS gate:** Explain why good fitted Q error on logged data need not imply a good new policy.

### Part III · Preferences and language post-training

*Thesis: the reward source and behavior distribution define the actual learning problem.*

**Module 12 — Preference data and reward modeling**

`handle: RL12` · `id: rl.preferences-reward-models` · 32h · prerequisites: RL08, PS11, NLP12, SYS18 · proposed bank: `rl-12-preferences-reward-models`

**Spine and derivations:** Bradley–Terry likelihood, identifiability up to offsets, pair construction, annotator disagreement, reward scale, length bias, and reward overoptimization.

**Interactive experiment:** `rl-preferences-reward-models` — Change comparison graph, rater noise, and response length; show unidentifiable components and spurious preference gains.

**Implementation ladder:** Implement preference_loss, comparison_graph_audit, and reward_bias_report.

**RE gate:** Verify pair orientation and held-out prompt splits before optimizing the reward.

**RS gate:** Derive the preference model and distinguish human preference, learned reward, and downstream utility.

**Module 13 — RLHF and KL-regularized policy optimization**

`handle: RL13` · `id: rl.rlhf-kl-regularization` · 34h · prerequisites: RL12, RL10 · proposed bank: `rl-13-rlhf-kl-regularization`

**Spine and derivations:** Token-level policy ratios, sequence rewards, reference-policy KL, reward shaping conventions, reward/value whitening, and reward-model exploitation.

**Interactive experiment:** `rl-rlhf-kl-regularization` — Change KL coefficient and reward scale; show proxy reward improvement with degraded independent evaluation.

**Implementation ladder:** Implement token_kl_estimator, sequence_reward_assignment, and rlhf_objective_audit.

**RE gate:** Reconstruct a stored rollout's loss exactly from policy versions, masks, and rewards.

**RS gate:** Derive the finite-action KL-regularized optimum and identify approximations in the practical loop.

**Module 14 — DPO and direct preference objectives**

`handle: RL14` · `id: rl.direct-preference-optimization` · 32h · prerequisites: RL12, IL03, OPT03 · proposed bank: `rl-14-direct-preference-optimization`

**Spine and derivations:** KL-regularized optimum to reward-policy relation, Bradley–Terry substitution, DPO logistic loss, reference support, beta scaling, and preference-data assumptions.

**Interactive experiment:** `rl-direct-preference-optimization` — Change reference logits and preference noise; show length confounds and a support-mismatch failure.

**Implementation ladder:** Implement dpo_from_logprobs, chosen_rejected_mask_audit, and gradient_direction_check.

**RE gate:** Match a finite-action analytic example and verify sequence-logprob aggregation.

**RS gate:** Derive DPO's objective and explain why its derivation does not guarantee superiority to online RL.

**Module 15 — Verifiable rewards and group-relative policy optimization**

`handle: RL15` · `id: rl.verifiable-rewards-grpo` · 36h · prerequisites: RL13, RL14, SYS18 · proposed bank: `rl-15-verifiable-rewards-grpo`

**Spine and derivations:** Verifier design, sparse rewards, group-relative advantages, zero-variance groups, token/sequence normalization, clipping and KL conventions, and compute-aware sampling.

**Interactive experiment:** `rl-verifiable-rewards-grpo` — Change group size, reward sparsity, and sequence length; show zero learning signal and hidden length weighting.

**Implementation ladder:** Implement verifier_fixture, group_advantages, and a specified GRPO-style objective.

**RE gate:** Handle all-equal rewards and log exact objective conventions with a finite reference test.

**RS gate:** Explain estimator bias from within-group baselines/normalization and separate algorithm variants explicitly.

**Module 16 — Reward hacking, process rewards, and evaluator validity**

`handle: RL16` · `id: rl.reward-hacking-eval` · 32h · prerequisites: RL15, PS10, NLP12 · proposed bank: `rl-16-reward-hacking-eval`

**Spine and derivations:** Outcome versus process supervision, verifier false positives/negatives, reward tampering in controlled environments, exploit loops, and independent evaluation.

**Interactive experiment:** `rl-reward-hacking-eval` — Insert a formatting exploit into a toy verifier; show rising training reward with falling true task success.

**Implementation ladder:** Implement adversarial_verifier_cases, independent_outcome_check, and reward_gap_report.

**RE gate:** Detect and contain an exploit in a sandboxed task and preserve failure traces.

**RS gate:** Estimate verifier error and explain how optimization amplifies small measurement defects.

### Part IV · Research frontiers and evaluation

*Thesis: long-horizon success requires reliable measurement and reward diagnostics.*

**Module 17 — Model-based RL, planning, and partial observability**

`handle: RL17` · `id: rl.model-based-partial-observability` · 34h · prerequisites: RL11, DS10, PS17 · proposed bank: `rl-17-model-based-partial-observability`

**Spine and derivations:** Learned dynamics, model bias accumulation, search with value/policy estimates, POMDP beliefs, memory states, and planning budgets.

**Interactive experiment:** `rl-model-based-partial-observability` — Change model error and rollout depth; show deeper planning becoming worse and aliased observations.

**Implementation ladder:** Implement belief_update, model_rollout, and small_mcts.

**RE gate:** Compare planned returns with real-environment outcomes under a fixed interaction budget.

**RS gate:** Construct a partial-observability counterexample and explain compounding model error.

**Module 18 — Reasoning, search, and test-time compute**

`handle: RL18` · `id: rl.reasoning-test-time-compute` · 32h · prerequisites: RL16, RL17, NLP13 · proposed bank: `rl-18-reasoning-test-time-compute`

**Spine and derivations:** Best-of-N, self-consistency, search/verifier allocation, pass-at-k assumptions, correlated samples, and training versus inference compute.

**Interactive experiment:** `rl-reasoning-test-time-compute` — Change sample dependence and verifier accuracy; show higher pass-at-k without improved per-sample quality.

**Implementation ladder:** Implement compute_budget_allocator, best_of_n_evaluator, and correlated_sample_audit.

**RE gate:** Report success at fixed cost and separate generated, verified, and selected sample counts.

**RS gate:** Explain which improvement comes from policy quality, sampling, or selection and test the mechanism.

**Module 19 — RL experimental design and replication**

`handle: RL19` · `id: rl.rl-experimental-design` · 30h · prerequisites: RL18, PS08, RP04 · proposed bank: `rl-19-rl-experimental-design`

**Spine and derivations:** Environment/version identity, independent seeds, run selection, learning-curve summaries, censored failures, and paired task evaluation.

**Interactive experiment:** `rl-rl-experimental-design` — Select seeds or stopping points interactively; expose a false winner from best-run reporting.

**Implementation ladder:** Implement run_manifest, learning_curve_aggregate, and failed_run_accounting.

**RE gate:** Reproduce a baseline with complete compute and failure records.

**RS gate:** Choose a valid unit of analysis and state uncertainty under dependent trajectories.

**Module 20 — Capstone: a policy or post-training study**

`handle: RL20` · `id: rl.capstone-policy-study` · 48h · prerequisites: RL19 · proposed bank: `rl-20-capstone-policy-study`

**Spine and derivations:** No new theory: one exact toy oracle, one learned policy task, an independent reward/evaluation channel, and a controlled algorithm change.

**Interactive experiment:** `rl-capstone-policy-study` — Compare reward, true success, KL, length, and cost on held-out tasks with all runs visible.

**Implementation ladder:** Deliver policy implementation, evaluator tests, and an executable research report.

**RE gate:** Reconstruct updates and recover experiment state from logged rollouts.

**RS gate:** Defend a causal algorithmic claim with negative controls and reward-validity evidence.

## 5. Write order and milestones

Write RL03–RL06 first, then the value branch RL07 and policy branch RL08–RL10. RL11 is continuous/offline specialization. RL12 opens the language post-training branch after SYS18; RL13–RL16 compare online, direct-preference, and verifiable-reward approaches. SYS19 depends on RL10 rather than RL15, preventing a rollout-systems cycle. RL17–RL18 add planning/test-time compute; RL19–RL20 assess research readiness.

A unit is ready for the next author only when its prerequisites have an authored route or a named external reading with an entry diagnostic. An overview that mentions an algorithm is not a substitute for teaching it. Preserve existing inbound IDs; add missing metadata only when the corresponding lesson is expanded. Do not register placeholder lessons or raise authored-coverage counts from this plan.

## 6. Capstone and assessment

Choose classical control, offline RL, preference optimization, or verifiable-reward training. Use a finite exact case to verify the estimator, then a small learned task. Include policy versions, reward provenance, objective conventions, all seeds/failures, and independent task success. The RS defense must distinguish a policy improvement from a better selection procedure or a verifier exploit.

The checkpoint has six tasks: explain a concept without notation; derive a central result and its assumptions; compute a small case by hand; implement or repair a component; diagnose a misleading experiment; defend an unfamiliar extension. Passing requires a correct derivation, implementation evidence, and a defensible limitations statement, with no critical conceptual error. Record which failed tasks need repair; do not substitute aggregate quiz points for these gates.

## 7. Infrastructure and validation

Add bandit/regret, editable MDP, importance-weight, policy-ratio, preference-graph, and verifier-failure views. Browser work stays tabular/finite; neural control and small LM post-training run locally. Expensive rollout projects declare a fixed interaction/token budget.

Browser Python remains standard-library-only. Use deterministic small fixtures there; label NumPy/PyTorch, accelerator, and multi-device work as local extensions. A CPU simulation teaches an algorithm or protocol, not accelerator performance. Each local benchmark records versions, hardware, shapes, warmup, synchronization, seeds, raw timings, and a correctness oracle. Build shared visual primitives only when the first authored unit needs them.

For lesson implementation, follow the shared validation commands in [the plan index](../_plans.md). Check invalid inputs, degenerate cases, input preservation, and the failure preset. Inspect the reader in both themes and work one exercise end to end. For this planning change, verify local links, reserved IDs, prerequisite resolution, and exclusion of `_plan.md` from the lesson catalog.
