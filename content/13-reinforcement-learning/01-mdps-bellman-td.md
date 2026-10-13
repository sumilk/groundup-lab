# Reinforcement learning: MDPs, Bellman equations, and TD learning

**Prerequisites:** probability, linear algebra, dynamic programming. **Outcome:** derive and implement tabular evaluation and control before neural RL.

## The sequential decision model

A finite Markov decision process specifies states $S$, actions $A$, transition probabilities $P(s'\mid s,a)$, expected immediate rewards $r(s,a)$, and discount $\gamma$. A policy $\pi(a\mid s)$ selects actions. Markov means the current state contains the information needed to predict the next transition given the action.

If your observation omits relevant history, treating it as a state does not make the environment Markov. Partial observability requires memory, belief states, or an explicit approximation.

For $0\le\gamma<1$ and bounded rewards, discounted return is $G_t=\sum_{k=0}^{\infty}\gamma^k R_{t+k+1}$. Finite-horizon undiscounted problems need separate termination assumptions.

~~~mermaid
flowchart LR
  S["state s"] --> A["action a"]
  P["policy"] --> A
  A --> E["environment"]
  E --> R["reward"]
  E --> N["next state"]
  N --> P
~~~

## Bellman expectation equation

Define $V^\pi(s)=E_\pi[G_t\mid S_t=s]$. Split off the first reward and condition on action and next state:

$$
V^\pi(s)=\sum_a\pi(a\mid s)\left[r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)V^\pi(s')\right].
$$

In matrix form, $V^\pi=r_\pi+\gamma P_\pi V^\pi$, so

$$
V^\pi=(I-\gamma P_\pi)^{-1}r_\pi.
$$

The inverse exists for finite stochastic $P_\pi$ and $\gamma<1$. Numerically solve the linear system rather than explicitly inverting it.

The Bellman operator contracts the sup norm:

$$
\|T^\pi V-T^\pi W\|_\infty\le\gamma\|V-W\|_\infty.
$$

Each transition-weighted difference is bounded by the largest difference because probabilities sum to one. This proves convergence of repeated evaluation to a unique fixed point.

## Optimal control

Replace the policy average with a maximum:

$$
(T^*V)(s)=\max_a\left[r(s,a)+\gamma\sum_{s'}P(s'\mid s,a)V(s')\right].
$$

The inequality $|\max_a u_a-\max_a v_a|\le\max_a|u_a-v_a|$ establishes the same contraction. Value iteration applies this operator repeatedly, then chooses a maximizing action in each state.

**Worked example:** one continuing state offers reward 1 or 2, both returning to itself. With $\gamma=0.9$, optimal value solves $V=2+0.9V$, giving 20. Always choosing reward 1 gives 10.

## Learning from samples

Monte Carlo estimates values from complete observed returns. TD(0) bootstraps:

$$
V(S_t)\leftarrow V(S_t)+\alpha[R_{t+1}+\gamma V(S_{t+1})-V(S_t)].
$$

TD can update before the episode finishes but uses an estimated target. Tabular Q-learning uses

$$
Q(s,a)\leftarrow Q(s,a)+\alpha[r+\gamma\max_{a'}Q(s',a')-Q(s,a)].
$$

Its convergence requires conditions on exploration, learning rates, and the environment; it does not establish that arbitrary neural Q-learning converges.

True terminal transitions do not bootstrap beyond termination. An external time-limit truncation may require bootstrapping if the underlying task continues. Record termination and truncation separately.

## Lab and problems

Implement bellman_backup in [exercises.py](../../labs/exercises.py). Then build a three-state environment and compare exact policy evaluation with iterative evaluation and sampled TD.

1. Prove the contraction inequality.
2. Compute the one-state values above.
3. Explain why future action choices make RL different from supervised prediction.
4. Derive the fixed-point error bound from Bellman residual: $\|V-V^*\|\le\|V-T^*V\|/(1-\gamma)$.
5. Construct a truncation example where incorrectly forcing zero bootstrap biases values.

<details><summary>Solutions</summary>

Use triangle inequality and contraction: error is at most residual plus $\gamma$ times error, then rearrange. In a continuing positive-reward process, forcing value to zero at an arbitrary time limit removes genuine future rewards. For the one-state example, repeated optimal backups sum a geometric series.

</details>

**Mastery:** implement a tabular solver, prove its convergence, and distinguish sample, approximation, and environment errors. Later units: exploration, importance sampling, eligibility traces, DQN, distributional RL, offline RL, and partial observability.
