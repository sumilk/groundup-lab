---
id: math.optimization.preconditioning-adaptive-schedules
title: Preconditioning, adaptive methods and schedules
prerequisites: [math.optimization.nonconvex-landscapes, math.linear-algebra.svd-pca]
estimated_hours: 40
---

# Preconditioning, adaptive methods and schedules

Every optimizer you will ever run in production has the same shape:

$$
x_{t+1}=x_t-\eta\,P_t^{-1}m_t,
$$

where \(m_t\) is some accumulation of past gradients and \(P_t\) is a matrix you can afford to invert. SGD takes \(P=I\). Adam takes \(P=\operatorname{diag}(\sqrt{\hat v})\). Shampoo takes a Kronecker factorization. Newton would take \(P=H\) and cannot. **Naming the \(P\), and the norm it corresponds to, is the entire subject.**

This lesson also covers the two things that decide whether your \(\eta\) is the right number at all: the schedule, and how the optimal \(\eta\) moves when you change model width.

## 1. Preconditioning is a change of variables

Substitute \(y=P^{1/2}x\) for symmetric \(P\succ0\) and run plain GD in \(y\). Mapping back,

$$
x_{t+1}=x_t-\eta P^{-1}\nabla f(x_t),
$$

and the effective curvature is \(P^{-1/2}HP^{-1/2}\). From the convexity lesson, the step count goes like the condition number, so the goal is

$$
\kappa\bigl(P^{-1/2}HP^{-1/2}\bigr)\ll\kappa(H).
$$

\(P=H\) gives \(\kappa=1\) and one-step convergence on a quadratic: that is Newton's method. It is unusable at scale for three separate reasons, and it matters that you can name all three — \(H\) is \(d\times d\) with \(d\sim10^{11}\); \(H\) is indefinite in a nonconvex landscape, so \(H^{-1}g\) can point uphill; and \(H\) is estimated from a minibatch, so its small eigenvalues are noise-dominated exactly where the inverse is most sensitive (the SVD lesson's ill-conditioning argument, applied to the preconditioner itself).

A second framing will unify everything in section 4. Steepest descent is only defined relative to a norm:

$$
\Delta x=\operatorname*{arg\,min}_{\lVert\delta\rVert\le\rho}\ \nabla f(x)^T\delta .
$$

Choosing \(\lVert\cdot\rVert_2\) gives \(-\eta g\). Choosing \(\lVert\delta\rVert_P=\sqrt{\delta^TP\delta}\) gives \(-\eta P^{-1}g\). Choosing the \(\ell_\infty\) norm gives \(-\eta\operatorname{sign}(g)\). Choosing the spectral norm on a weight *matrix* gives something else again. **An optimizer is a choice of geometry on weight space.**

## 2. Adam, read two ways

Adam maintains

$$
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t,
\qquad
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2,
$$

$$
\hat m_t=\frac{m_t}{1-\beta_1^t},
\qquad
\hat v_t=\frac{v_t}{1-\beta_2^t},
\qquad
x_{t+1}=x_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}.
$$

**Bias correction, derived.** Unrolling from \(v_0=0\) gives \(v_t=(1-\beta_2)\sum_{i\le t}\beta_2^{t-i}g_i^2\). If \(\mathbb E[g_i^2]\) is approximately stationary at \(\bar g^2\), then \(\mathbb E[v_t]=(1-\beta_2^t)\bar g^2\). Dividing by \((1-\beta_2^t)\) removes the shrinkage toward zero that would otherwise make early steps enormous.

**Reading one: diagonal preconditioner.** \(P=\operatorname{diag}(\sqrt{\hat v})\) is an estimate of per-coordinate gradient scale — a second *moment*, not a variance, and not a curvature. It fixes the case where coordinates differ in scale by orders of magnitude, which is the common case across the layers of a transformer.

**Reading two: sign descent with memory.** When \(\epsilon\ll\sqrt{\hat v}\) and \(\beta_1=\beta_2=0\), the update collapses to \(-\eta\operatorname{sign}(g)\). With momentum it is a smoothed sign. Two consequences follow immediately and explain a great deal of practice:

- **The update magnitude is about \(\eta\) per coordinate, independent of gradient scale.** So \(\eta\) is a *trust-region radius in weight space*, not a curvature-scaled step. This is why AdamW learning rates are so consistent across very different models, and why the SGD linear-scaling rule of the SGD lesson does not transfer.
- **Adam is invariant to per-coordinate rescaling of the gradient but not to rotation.** Rotate the problem and the diagonal preconditioner is worthless. Its advantage comes entirely from the coordinate system your parameterization happens to supply — which is a real advantage, since layers are a meaningful basis, but not a general one. The lab makes you demonstrate this.

\(\epsilon\) is not merely numerical hygiene. It sets the gradient scale below which Adam stops behaving like sign descent and reverts toward SGD, so it interacts with loss scaling and with low-precision training.

## 3. AdamW: why decoupling is not cosmetic

Add \(\tfrac\lambda2\lVert x\rVert^2\) to the loss. The gradient becomes \(g+\lambda x\), and Adam divides the whole thing by \(\sqrt{\hat v}\):

$$
\Delta x=-\eta\frac{\hat m(g+\lambda x)}{\sqrt{\hat v}+\epsilon}.
$$

The regularization pull on coordinate \(i\) is scaled by \(1/\sqrt{\hat v_i}\), so coordinates with historically large gradients get **less** decay. That is the opposite of what a norm penalty is supposed to mean, and it couples your regularization strength to gradient history. AdamW decouples them:

$$
x_{t+1}=x_t-\eta\frac{\hat m_t}{\sqrt{\hat v_t}+\epsilon}-\eta\lambda x_t .
$$

Now decay is uniform and multiplicative: \(x\leftarrow(1-\eta\lambda)x\). Two practical corollaries. First, the decoupled form implies an **equilibrium weight norm** where per-step shrinkage \(\eta\lambda\lVert x\rVert\) balances the update norm \(\approx\eta\sqrt d\), which is why \(\lambda\) controls scale rather than merely discouraging it. Second, \(\eta\) and \(\lambda\) interact through the product \(\eta\lambda\): changing the schedule changes your effective regularization unless you compensate.

## 4. Matrix preconditioners: Fisher, Kronecker, spectral

**Natural gradient.** Preconditioning by the Fisher information \(F=\mathbb E[\nabla\log p\,\nabla\log p^T]\) makes the step invariant to reparameterizations of the model's distribution: it is steepest descent in KL geometry rather than Euclidean geometry. For losses that are the negative log-likelihood of an exponential family with matching link — cross-entropy with softmax, squared error with Gaussian — the Fisher **equals** the generalized Gauss-Newton matrix from the landscape lesson. That identity is why natural gradient is a practical proposal at all: \(G\) is PSD by construction, so its inverse cannot point uphill.

**K-FAC.** Still \(d\times d\). The Kronecker-factored approximation observes that for a layer with input activations \(a\) and output gradients \(s\), the per-layer Fisher block is \(\mathbb E[aa^T\otimes ss^T]\), and approximates it by \(\mathbb E[aa^T]\otimes\mathbb E[ss^T]=A\otimes S\). Then the Kronecker identity

$$
(A\otimes S)^{-1}=A^{-1}\otimes S^{-1},
\qquad
(A\otimes S)\operatorname{vec}(W)=\operatorname{vec}(SWA^T)
$$

turns one intractable \(mn\times mn\) inverse into two small ones of size \(m\) and \(n\). This is the payoff of Kronecker and \(\operatorname{vec}\) algebra, and a standing argument for treating matrix calculus as core rather than optional.

**Shampoo** applies the same idea without the probabilistic story, preconditioning a gradient matrix on both sides with accumulated \(L=\sum GG^T\) and \(R=\sum G^TG\) raised to \(-1/4\).

**Muon** takes the norm view seriously. Steepest descent for a *matrix* parameter under the spectral norm has a closed form: if the momentum matrix has SVD \(M=U\Sigma V^T\), the optimal direction is

$$
\Delta W\propto UV^T,
$$

the orthogonal polar factor — all singular values set to one. Computing it via an SVD would be too slow, so a few Newton-Schulz iterations approximate the orthogonalization in matmuls only. Read this next to section 1: Muon is what you get by deciding that the right notion of "step size" for a weight *matrix* is its spectral norm rather than its entrywise \(\ell_2\) norm, which is a statement about how much the layer's function is allowed to move.

The family view is the thing to carry away:

| Optimizer | Geometry / preconditioner | Cost per step |
|---|---|---|
| SGD | Euclidean, \(P=I\) | \(O(d)\) |
| Adam / AdamW | diagonal, near \(\ell_\infty\) | \(O(d)\) |
| K-FAC | Kronecker-factored Fisher | \(O(m^3+n^3)\) per layer, amortized |
| Shampoo | two-sided accumulated preconditioner | as above |
| Muon | spectral norm on matrices | a few matmuls |
| Newton | \(P=H\), affine-invariant | impossible |

## 5. Schedules

**Warmup** does three separable jobs, and knowing which one binds tells you how long it should be: \(\hat v\) is a high-variance estimate for roughly the first \(1/(1-\beta_2)\) steps; curvature is transiently large early, so \(2/L\) is transiently small; and the initial loss is far from the minimum, so early large steps waste distance. Only the second is affected by model scale.

**Cosine** decay to near zero at a pre-committed horizon produces the familiar smooth curve, but the horizon is a commitment: stopping a cosine run early leaves you at a learning rate that was never meant to be final, and extending it requires restarting the schedule.

**Warmup-stable-decay (trapezoid)** holds \(\eta\) constant, then decays over the last 10-20% of the run. It matches cosine's final loss while letting you branch a decay phase from any point of the stable phase — which is what makes continued pretraining and data-mixture ablations affordable.

Whichever you pick, the SGD lesson explains the shape you see: the sharp drop during decay is the noise ball \(\eta\sigma^2/\mu\) contracting, not the discovery of a better basin. And it explains the coupling: because the floor depends on \(\eta/B\), a batch-size ramp is a learning-rate schedule in disguise, and the two must be tuned together or reported together.

## 6. Scaling the learning rate with width

Here is the problem that costs the most compute when ignored. Under the standard parameterization, the optimal learning rate **moves** as you scale width, so a hyperparameter search at small scale is not evidence about large scale, and every scale needs its own sweep.

The maximal-update parameterization (\(\mu\)P) fixes the abstraction. The requirement is that, as width \(n\to\infty\), three things stay \(\Theta(1)\): every layer's pre-activations, the logits, and the *change* in activations caused by one optimizer step. Enforcing this forces different per-layer scalings of initialization variance and learning rate, and the scalings differ between input/embedding layers, hidden matrix-like parameters, and the output layer — under Adam, hidden-layer learning rates scale like \(1/\text{fan\_in}\), and the output layer needs an explicit \(1/\text{fan\_in}\)-style multiplier rather than a learning-rate change alone.

The payoff is \(\mu\)Transfer: tune \(\eta\), \(\beta\)s and init at a small proxy width, then transfer to the large model without re-tuning. Do not take the per-layer table on faith — the lab has you verify it by a **coordinate check**, which is also how you would debug a custom architecture that the published table does not cover.

## 7. Comparing optimizers without fooling yourself

Optimizer claims are among the least reliable results in the field. The confounds, in rough order of how often they invalidate a comparison:

- **Unequal tuning budget.** The new method was tuned; the baseline inherited defaults. Report the search space and the number of trials per method, and tune jointly over \(\eta\), \(\lambda\), warmup and \(\beta_2\) — not \(\eta\) alone.
- **Schedule coupling.** A method that prefers a different schedule shape will lose under a fixed cosine.
- **Wrong x-axis.** Per-step wins can be per-FLOP losses (Shampoo-family preconditioner updates) or per-wallclock losses (communication). Always plot steps, FLOPs and seconds.
- **Memory.** Adam's state is \(2\times\) parameters; that memory could have bought batch size or model size. Count it in the comparison.
- **Scale extrapolation.** Gains at 100M routinely vanish at 10B. If the claim is about scale, the evidence must be a trend across at least three scales.
- **Seeds.** Report the spread. A gap smaller than seed variance is not a result.
- **Numerics.** Keep fp32 master weights and fp32 optimizer state; a "better optimizer" that is really a precision difference is a common and embarrassing finding.

## Implementation lab

1. Implement SGD, heavy ball, Nesterov, Adam, AdamW, and Muon behind one interface, with the preconditioner made explicit in each. No `torch.optim`.
2. Verify Adam and AdamW produce **identical** trajectories at \(\lambda=0\) and measurably different ones at \(\lambda>0\); then show the per-coordinate decay ratio in Adam-with-L2 tracks \(1/\sqrt{\hat v_i}\).
3. Ablate bias correction: train with and without it and plot the update norms over the first \(1/(1-\beta_2)\) steps.
4. **Rotation experiment.** Build an ill-conditioned diagonal quadratic and show Adam beats SGD decisively. Then conjugate \(H\) by a random orthogonal \(Q\) and rerun. Explain the collapse, and predict before running whether Muon is affected.
5. Implement Newton-Schulz orthogonalization; check it converges to \(UV^T\) against a reference SVD, count the matmuls, and confirm the resulting update has all singular values near one.
6. Implement K-FAC for a single dense layer: estimate \(A\) and \(S\), apply \(S^{-1}GA^{-1}\) using the Kronecker identity, and verify it equals the explicit \((A\otimes S)^{-1}\operatorname{vec}(G)\) on a tiny layer.
7. **Coordinate check for \(\mu\)P.** Sweep width over at least a 16x range. Under standard parameterization, plot optimal \(\eta\) against width and show it drifts. Implement \(\mu\)P scalings, verify activation and update magnitudes are width-independent at initialization and after a few steps, and show the optimal \(\eta\) is now flat.
8. Compare cosine against warmup-stable-decay at matched compute, then branch two decay phases from one stable checkpoint and report the cost saved versus rerunning.

**From-scratch constraint:** every optimizer written from its update equations; `torch.linalg.svd` only as a reference to check Newton-Schulz against, never inside the optimizer.

## Problems

1. Derive Adam's bias correction from \(v_t=(1-\beta_2)\sum_i\beta_2^{t-i}g_i^2\), stating the stationarity assumption. What goes wrong at \(\beta_2=0.999\) without it?
2. Show that as \(\epsilon\to0\) with \(\beta_1=\beta_2=0\), Adam's update is \(-\eta\operatorname{sign}(g)\), and conclude what \(\eta\) controls dimensionally.
3. Derive the difference between Adam-with-L2 and AdamW explicitly, and show the two coincide when \(\hat v\) is constant across coordinates.
4. Prove that a diagonal preconditioner is invariant to coordinate rescaling but not to rotation. Give the worst-case \(\kappa\) after rotating a diagonal \(H\).
5. Prove that the Fisher equals the generalized Gauss-Newton matrix for softmax cross-entropy, and explain why this makes natural gradient safe in a nonconvex landscape when Newton is not.
6. Show that \(\operatorname*{arg\,min}_{\lVert\Delta\rVert_2\le\rho}\langle M,\Delta\rangle\) over matrices with the spectral norm is \(-\rho UV^T\) for \(M=U\Sigma V^T\). Then state what quantity Muon is holding constant that Adam is not.
7. **Transfer.** Your 400M proxy model trains best at \(\eta=1\times10^{-3}\). At 7B the same \(\eta\) diverges in the first 2,000 steps; at \(2\times10^{-4}\) it is stable but clearly undertrained at matched tokens. Explain what standard parameterization predicts here, what \(\mu\)P would have predicted, and design the smallest set of runs that recovers a transferable setting without a full sweep at 7B.

<details><summary>Solution sketches</summary>

1. Take expectations of the unrolled sum under \(\mathbb E[g_i^2]\approx\bar g^2\) to get \((1-\beta_2^t)\bar g^2\). At \(\beta_2=0.999\), \(v_t\) is underestimated by roughly a factor \(1000\) at \(t=1\), so \(\hat m/\sqrt v\) is inflated by about \(\sqrt{1000}\) — an enormous first step exactly when curvature is largest.
2. With no accumulation, \(\hat m=g\), \(\hat v=g^2\), so the ratio is \(g/|g|\). Hence the update has magnitude \(\eta\) per coordinate regardless of gradient scale: \(\eta\) is a distance in weight space, not a scaled step.
3. In the coupled form the decay term appears inside the ratio, contributing \(-\eta\lambda x_i/(\sqrt{\hat v_i}+\epsilon)\); in the decoupled form it is \(-\eta\lambda x_i\). Equal when \(\sqrt{\hat v_i}+\epsilon\) is the same constant for all \(i\), which absorbs into \(\lambda\).
4. Rescaling coordinates multiplies both \(g_i\) and \(\sqrt{v_i}\) by the same factor, which cancels. Under rotation the gradient's coordinates mix while the preconditioner stays diagonal; for \(H=Q\Lambda Q^T\) with generic \(Q\), the diagonal of \(H\) is nearly constant, so the preconditioner approaches \(I\) and \(\kappa\) reverts to \(\kappa(H)\).
5. Write the Fisher as \(J^T\mathbb E[\nabla^2_{\text{logits}}\ell]J\) using the exponential-family identity that the Fisher of the output distribution equals the Hessian of its log-partition; that inner matrix is \(\operatorname{diag}(p)-pp^T\succeq0\), matching the GGN term of the landscape lesson. PSD means \(F^{-1}g\) always has nonnegative inner product with \(g\), so it cannot ascend.
6. The linear functional is maximized by putting all allowed spectral mass on the directions of \(M\); by von Neumann's trace inequality the optimum is \(UV^T\). Muon holds the *spectral* norm of the update constant, i.e. the worst-case change to the layer's action on any input direction, whereas Adam holds a per-entry magnitude constant.
7. Standard parameterization makes optimal \(\eta\) width-dependent, typically shrinking with width, so neither the proxy value nor an arbitrary smaller one is principled — you are sweeping blind at 7B. \(\mu\)P predicts the optimum is width-invariant once per-layer scalings are applied. Recovery plan: implement \(\mu\)P, run the coordinate check at two small widths to confirm width-independent activation and update magnitudes, sweep \(\eta\) at the proxy width only, and confirm at 7B with two short runs bracketing the transferred value.

</details>

## Mastery gate

Write every optimizer in section 4's table from its update equations; state the geometry each one corresponds to and the invariance it does and does not have; derive Adam's bias correction and the AdamW decoupling difference from scratch; demonstrate experimentally that diagonal preconditioning is basis-dependent; execute a \(\mu\)P coordinate check and show learning-rate transfer across at least a 16x width range; and critique a supplied optimizer comparison by naming its confounds and the specific additional runs that would settle it.
