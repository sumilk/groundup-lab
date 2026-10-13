# Policy gradients, actor–critic, and the route to PPO

**Prerequisites:** [MDPs and Bellman equations](01-mdps-bellman-td.md), probability, differentiation. **Outcome:** derive a policy-gradient estimator and implement a controlled small experiment.

## Differentiate an expectation

For a finite-horizon trajectory $\tau$, let $R(\tau)$ denote its total reward and $J(\theta)=E_{\tau\sim p_\theta}[R(\tau)]$. Assume rewards and environment dynamics have no direct parameter dependence, and regularity permits differentiation under the expectation.

$$
\nabla J=\sum_\tau \nabla p_\theta(\tau)R(\tau)
=E[p_\theta^{-1}\nabla p_\theta R]
=E[\nabla\log p_\theta(\tau)R(\tau)].
$$

Trajectory probability factors into initial-state probability, policy probabilities, and environment transitions. Only policies depend on $\theta$:

$$
\nabla\log p_\theta(\tau)=\sum_t\nabla\log\pi_\theta(a_t\mid s_t).
$$

REINFORCE uses sampled score gradients multiplied by returns. To maximize J using a minimizing optimizer, use the negative of this surrogate. Detach sampled return weights from the actor's gradient path unless deliberately deriving a different estimator.

## Reward-to-go and baselines

An action cannot causally affect rewards already received. Their expected contribution to that action's score gradient vanishes, so replace total return with reward-to-go $G_t$.

For any state-dependent, action-independent baseline $b(s)$,

$$
E_{a\sim\pi}[\nabla\log\pi(a\mid s)b(s)]
=b(s)\nabla\sum_a\pi(a\mid s)=0.
$$

Subtracting a baseline preserves the expected gradient while potentially reducing variance. Not every baseline reduces variance, and the variance-minimizing baseline is not universally equal to V without additional conditions.

Actor–critic learns a value estimate and uses an advantage estimate, such as TD residual

$$
\delta_t=r_t+\gamma V(s_{t+1})-V(s_t).
$$

Approximate critics introduce bias/variance tradeoffs. For discounted objectives, be explicit about state-occupancy weighting and discount conventions; do not transplant an undiscounted estimator unchanged.

## Generalized advantage estimation

GAE combines TD residuals:

$$
\hat A_t=\sum_{l\ge0}(\gamma\lambda)^l\delta_{t+l}.
$$

Small $\lambda$ relies more heavily on the critic; values near one use longer reward information. Episode boundaries and rollout truncations affect the recurrence. The value used for a true terminal state is zero; a continuing truncated trajectory may bootstrap.

## PPO's clipped surrogate

For samples from an old policy, define

$$
r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\mathrm{old}}(a_t\mid s_t)}.
$$

The clipped maximization surrogate is

$$
E\left[\min(r_t\hat A_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\hat A_t)\right].
$$

For positive advantage, excessive increases in probability stop improving the clipped term. For negative advantage, excessive decreases are clipped. The minimum and sign matter. Clipping the ratio everywhere without the minimum is a different objective.

PPO clipping is not a hard constraint on KL divergence and does not guarantee monotonic policy improvement. Track approximate KL, clipping fraction, entropy, critic error, and return rather than only surrogate loss.

> **Predict:** With positive advantage and ratio above $1+\epsilon$, what local actor gradient comes from the clipped minimum?

## Lab and problems

Start with a two-action Bernoulli bandit, where exact expected reward is available. Implement softmax sampling, log probabilities, REINFORCE, and a running baseline. Compare empirical gradients over many samples with the exact derivative.

Then add a small episodic environment, a value baseline, and GAE. Only after these checks implement PPO. Keep old log probabilities fixed during each update batch.

1. Prove the baseline identity.
2. Derive the derivative for a two-action bandit with sigmoid policy probability.
3. Explain why recomputing old log probabilities after parameter updates breaks PPO.
4. Compare gradient variance with two baselines.
5. Explain why rising reward-model score alone cannot establish better LLM outputs.

<details><summary>Solutions</summary>

For reward means $\mu_1,\mu_0$ and probability $p=\sigma(\theta)$, $J=p\mu_1+(1-p)\mu_0$, so $J'=p(1-p)(\mu_1-\mu_0)$. Recomputing the denominator erases the reference policy and changes ratios. On the saturated positive-advantage clipped branch, the surrogate contributes zero local gradient. Reward-model optimization can exploit model errors.

</details>

**Mastery:** verify policy gradients against an exact small case before trusting a learning curve. Later units: trust regions, PPO implementation, entropy regularization, offline evaluation, reward modeling, preference optimization, and RL for language models.
