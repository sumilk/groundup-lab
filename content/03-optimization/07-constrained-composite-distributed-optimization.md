---
id: math.optimization.constrained-composite-distributed
title: Constrained, composite and distributed optimization
prerequisites: [math.optimization.preconditioning-adaptive-schedules, math.optimization.convexity-smoothness-duality]
estimated_hours: 36
---

# Constrained, composite and distributed optimization

Three assumptions have been quietly in force since the convexity lesson: that the objective is differentiable everywhere, that every point in parameter space is allowed, and that "the gradient" is a thing one process computes. Production training violates all three. ReLU and quantization are nondifferentiable; KL trust regions and norm bounds are hard constraints; and the gradient in a real run is the output of a collective operation over hundreds of devices, each holding a shard of the optimizer state.

This lesson supplies the three corresponding tools — projection, the proximal operator, and the trust region — and then works through what the distributed setting does to the estimator you thought you were using.

## 1. Projected gradient and nonexpansiveness

Constrain \(x\in C\) for convex closed \(C\) and iterate

$$
x_{t+1}=\Pi_C\bigl(x_t-\eta\nabla f(x_t)\bigr),
\qquad
\Pi_C(y)=\operatorname*{arg\,min}_{z\in C}\lVert z-y\rVert^2 .
$$

The whole convergence theory carries over because projection onto a convex set is **nonexpansive**:

$$
\lVert\Pi_C(u)-\Pi_C(v)\rVert\le\lVert u-v\rVert .
$$

Since \(x^\star=\Pi_C(x^\star)\) at a constrained optimum, every contraction argument from the convexity lesson survives the extra step untouched. That is the entire reason projected methods are as well behaved as unconstrained ones.

Projections worth knowing in closed form: onto an \(\ell_2\) ball, \(y\mapsto y\min(1,\rho/\lVert y\rVert)\); onto the probability simplex, a sort-and-threshold algorithm; onto the PSD cone, clip the eigenvalues at zero (an application of the spectral theorem from the eigenvalue lesson); onto a box, clamp coordinatewise.

## 2. Proximal operators and composite objectives

Most real regularizers are convex but nonsmooth. Split the objective:

$$
\min_x\ f(x)+h(x),
\qquad f\ \text{smooth},\quad h\ \text{convex, possibly nonsmooth}.
$$

Define the **proximal operator**

$$
\operatorname{prox}_{\eta h}(y)=\operatorname*{arg\,min}_z\Bigl\{h(z)+\frac1{2\eta}\lVert z-y\rVert^2\Bigr\},
$$

and iterate \(x_{t+1}=\operatorname{prox}_{\eta h}(x_t-\eta\nabla f(x_t))\). This is proximal gradient descent, and it keeps GD's rates even though \(h\) has no gradient.

Three instances tie the track together:

- **\(h=\) indicator of \(C\).** Then \(\operatorname{prox}_{\eta h}=\Pi_C\): projected gradient is a special case, and a hard constraint is just an infinitely steep penalty.
- **\(h=\lambda\lVert x\rVert_1\).** The prox separates coordinatewise and solves to the **soft-threshold** \(\operatorname{sign}(y_i)\max(|y_i|-\eta\lambda,0)\). That closed form is why \(\ell_1\) produces exact zeros while \(\ell_2\) only shrinks: the prox has a flat region at zero.
- **\(h=\tfrac\lambda2\lVert x\rVert^2\).** The prox is \(y/(1+\eta\lambda)\), a uniform multiplicative shrink. Compare the AdamW update of the preconditioning lesson: decoupled weight decay is, to first order in \(\eta\lambda\), **a proximal step on the \(\ell_2\) penalty**. Decoupling was not an arbitrary fix; it restored the correct proximal structure that the coupled form destroyed.

## 3. Mirror descent: choosing the geometry of the constraint

Rewrite one GD step as a proximal problem in a Bregman divergence \(D_\psi\):

$$
x_{t+1}=\operatorname*{arg\,min}_{x\in C}\Bigl\{\nabla f(x_t)^Tx+\frac1\eta D_\psi(x,x_t)\Bigr\}.
$$

With \(\psi=\tfrac12\lVert\cdot\rVert^2\) this is projected gradient. With \(\psi\) the negative entropy on the simplex it becomes **exponentiated gradient**:

$$
x_{t+1,i}\propto x_{t,i}\exp\bigl(-\eta\,\nabla f(x_t)_i\bigr).
$$

Multiplicative, automatically feasible, no projection required — and you have seen this update twice already. It is the exponential tilt \(\pi\propto\pi_{\mathrm{ref}}e^{A/\beta}\) from the convexity lesson's KL-constrained problem, and it is the shape of a softmax policy update.

The rate tells you when to prefer it. On the simplex, Euclidean methods carry a dimension factor \(\sqrt d\); entropic mirror descent carries \(\sqrt{\log d}\). For a vocabulary of \(10^5\), that is a difference between \(316\) and \(3.4\). **Matching the geometry to the constraint set is worth more than any constant-factor tuning.**

## 4. Trust regions, and what gradient clipping actually is

A trust region admits that your local model is only valid nearby: minimize the model subject to \(\lVert\delta\rVert\le\Delta\), then expand or shrink \(\Delta\) according to the ratio of actual to predicted decrease. Two ML instances are trust regions in disguise.

**Gradient clipping.** Replacing \(g\) with \(g\min(1,c/\lVert g\rVert)\) and stepping by \(\eta\) is exactly a step of length \(\min(\eta\lVert g\rVert,\eta c)\) along \(g\) — a fixed-radius \(\ell_2\) trust region. Read through the convexity lesson: it is an admission that your smoothness constant \(L\) is only valid locally, so you cap the distance travelled rather than the curvature assumed. Read through the landscape lesson: it is what keeps a loss spike from destroying the run.

But clipping is **not** an unbiased gradient estimator. \(\mathbb E[\operatorname{clip}(\hat g)]\ne\operatorname{clip}(\mathbb E[\hat g])\), and when clipping is active on a nontrivial fraction of steps you are optimizing a different objective than you wrote down. The bias grows with gradient noise, hence shrinks with batch size — so clipping thresholds do not transfer across batch sizes. Per-sample clipping (as in differentially private training) biases far more aggressively than per-batch clipping and must be analyzed separately.

**PPO and TRPO.** The KL constraint on the policy update is a trust region in distribution space rather than parameter space, whose solution is the exponential tilt of the convexity lesson and whose practical surrogate is ratio clipping. Same idea, different norm — see [policy gradients and actor-critic](../12-reinforcement-learning/02-policy-gradients-actor-critic.md).

## 5. Nonsmoothness you are already shipping

ReLU, max-pooling, absolute values and hard attention masks are nondifferentiable on measure-zero sets. Autodiff returns **a** subgradient by convention (frameworks pick \(0\) or \(1\) at the ReLU kink), and for almost all inputs this coincides with the true gradient, so practice is mostly safe.

Where it stops being safe is worth naming. Subdifferential calculus lacks a chain rule for nonconvex compositions — the Clarke subdifferential satisfies only an inclusion — so autodiff through nested nonsmooth operations can return a direction that is not a descent direction. Ties, clamps at exactly the boundary and `max` with equal arguments are where you see it.

**Quantization-aware training** is the case that most often lands on a research engineer's desk. The constraint set (a discrete grid) is nonconvex, so projected gradient has no guarantee; the straight-through estimator forward-quantizes and backward-passes the identity, which is a deliberately biased gradient that happens to behave like a crude prox step. Treat STE as a heuristic with known failure modes — dead ranges when the clipping range is misset, and gradient mismatch that grows as bit width falls — rather than as a method with a theorem behind it.

## 6. What "the gradient" means across 512 devices

**Data-parallel all-reduce.** Averaging per-rank gradients gives exactly the full-batch gradient over the union of the shards — *provided* the shards are exchangeable. Sort by length, by source, or by language and each rank's gradient is a biased sample; the mean is still the mean over the whole batch, but any per-rank statistic you use for control (gradient-norm clipping thresholds, skip rules, loss-based sampling) is now measuring something different on each rank. This is the bias discussion from the SGD lesson, relocated to a place where it is much harder to see.

**Accumulation.** \(k\) micro-batches must be averaged, not summed, or the effective learning rate is \(k\times\) larger than intended. With an uneven final micro-batch, a plain mean-of-means also silently reweights examples. The invariant to test: accumulated gradient over \(k\) micro-batches equals the single-batch gradient over the same examples, to float tolerance.

**Memory accounting.** For \(P\) parameters trained with AdamW in mixed precision, the steady-state cost is roughly: bf16 parameters \(2P\), bf16 gradients \(2P\), fp32 master weights \(4P\), and Adam's \(m\) and \(v\) at \(4P\) each — about \(16P\) bytes before activations. **Optimizer state, not parameters, dominates.** That single arithmetic fact is the motivation for the entire sharding literature: ZeRO stage 1 shards the optimizer state, stage 2 also shards gradients, stage 3 also shards parameters (gathering each layer's shard just in time), trading progressively more communication for memory. FSDP is the same idea expressed as sharded modules.

**Mixed precision.** Keep fp32 master weights and fp32 optimizer state: a bf16 weight has about 8 bits of mantissa, so an update smaller than roughly \(2^{-8}\) of the weight is silently lost to rounding, which is common late in training. bf16 shares fp32's exponent range and so needs no loss scaling; fp16 does. Reduction order changes results, so bitwise determinism requires fixing it.

**Communication-efficient variants.** Local SGD and DiLoCo take many local steps between infrequent averages, trading gradient staleness for a large reduction in communication — a genuine change to the optimization problem, not merely an engineering optimization, and it should be evaluated as one.

**Resume correctness.** A checkpoint must restore model weights, optimizer state (including step counters that drive bias correction), the schedule position, the data-loader position, and every RNG stream. Restore any subset and the run continues plausibly while being subtly wrong: a reset \(\hat v\) makes the first steps after resume enormous, a reset data position re-trains on seen data, a reset schedule position replays warmup. The test is that resuming from step \(t\) and running to \(t+n\) matches the uninterrupted run to tolerance. Engineering detail belongs to the systems track; the *semantics* belong here, because each of these is a change to the estimator.

## 7. Failure modes

- **Projecting after the optimizer rather than inside it.** Clamping weights post-hoc is not projected gradient, and it breaks the momentum and second-moment state that were computed in the unclamped geometry.
- **Clipping thresholds copied across batch sizes or model scales.** The bias depends on the noise level; the threshold must be re-derived, ideally from a gradient-norm percentile.
- **Treating STE as exact.** Quantization results that hold at 8 bits routinely fail at 4.
- **Mean-of-means over uneven micro-batches or ranks.** Weights examples by the inverse size of their group.
- **Reduction nondeterminism reported as a method difference.** Fix the seed, the reduction order and the kernel selection before believing any small gap.
- **Fixed penalties standing in for constraints.** A fixed KL coefficient does not hold KL fixed; if you need a constraint, control the multiplier.

## Implementation lab

1. Implement \(\Pi_C\) for the \(\ell_2\) ball, the box, the simplex (sort-and-threshold) and the PSD cone. Verify nonexpansiveness on random pairs and verify idempotence.
2. Solve a norm-constrained least-squares problem with projected gradient; check the KKT conditions and complementary slackness against the dual solution from the convexity lesson.
3. Implement ISTA with soft-thresholding for Lasso. Verify the solution satisfies the subgradient optimality condition, count the exact zeros, and compare convergence against plain subgradient descent.
4. Show numerically that AdamW's decoupled decay matches the \(\ell_2\) prox step to \(O(\eta^2\lambda^2)\), and that the coupled form does not.
5. Compare exponentiated gradient against projected GD on a simplex-constrained problem across \(d\in\{10,10^3,10^5\}\); plot iterations-to-tolerance against \(d\) and identify the \(\sqrt d\) versus \(\sqrt{\log d}\) scaling.
6. **Clipping bias.** At a fixed point, estimate \(\mathbb E[\operatorname{clip}(\hat g)]\) by averaging many minibatches and compare with \(\operatorname{clip}(\nabla f)\). Plot the bias against batch size and against the threshold, and repeat for per-sample clipping.
7. **Distributed semantics on one machine.** Simulate \(R\) ranks. (a) Verify the all-reduce mean equals the full-batch gradient. (b) Shard by sequence length and measure the induced per-rank gradient-norm skew. (c) Implement accumulation as mean and as sum and show which matches full-batch. (d) Compute the \(16P\) memory model and check it against a real `torch` run. (e) Checkpoint at step \(t\), resume, and verify the trajectory matches the uninterrupted run — then deliberately fail to restore the data-loader position and the Adam step counter, and quantify each error separately.

**From-scratch constraint:** write every projection and prox yourself from its defining optimization problem, and derive the simplex projection rather than copying it.

## Problems

1. Prove projection onto a closed convex set is nonexpansive, using the variational characterization \(\langle y-\Pi_C(y),z-\Pi_C(y)\rangle\le0\) for all \(z\in C\).
2. Derive the soft-thresholding operator from the definition of \(\operatorname{prox}_{\eta\lambda\lVert\cdot\rVert_1}\), and explain geometrically why \(\ell_2\) never produces exact zeros.
3. Show \(\operatorname{prox}\) of the indicator of \(C\) is \(\Pi_C\), and that the \(\ell_2\) prox is \(y/(1+\eta\lambda)\). Relate the second to decoupled weight decay and give the order of the approximation.
4. Show that clipping to norm \(c\) is equivalent to an adaptive step size \(\eta_{\text{eff}}=\eta\min(1,c/\lVert g\rVert)\), then construct a two-point gradient distribution where \(\mathbb E[\operatorname{clip}(\hat g)]\) points in a different direction from \(\nabla f\).
5. Derive the exponentiated-gradient update from the Bregman proximal problem with negative entropy, and connect it to the KL-constrained policy of the convexity lesson.
6. Derive the \(16P\)-bytes figure for mixed-precision AdamW, then compute the per-device memory under ZeRO stages 1, 2 and 3 with \(R\) ranks and state what each stage must communicate per step.
7. **Transfer.** A run is checkpointed at step 60,000 and resumed on a cluster with half as many ranks, with the per-rank batch size doubled to keep the global batch constant. The loss jumps on resume and recovers over about 3,000 steps. Give four candidate causes, the measurement that discriminates each, and say which of them would still have occurred had the rank count been unchanged.

<details><summary>Solution sketches</summary>

1. Apply the variational inequality at \(u\) with \(z=\Pi_C(v)\) and at \(v\) with \(z=\Pi_C(u)\); add the two and apply Cauchy-Schwarz to \(\lVert\Pi_C(u)-\Pi_C(v)\rVert^2\).
2. The objective separates; each coordinate minimizes \(\lambda|z|+\frac1{2\eta}(z-y)^2\). Checking the three cases of the subdifferential of \(|z|\) gives the shrink-and-clamp form. The \(\ell_2\) prox is smooth at zero, so its fixed point is zero only when \(y\) is, hence no exact sparsity.
3. For the indicator, the prox objective is \(\lVert z-y\rVert^2/2\eta\) over \(z\in C\), which is the projection. For \(\ell_2\), set the derivative to zero. Expanding \(1/(1+\eta\lambda)=1-\eta\lambda+O(\eta^2\lambda^2)\) recovers AdamW's \((1-\eta\lambda)\) multiplicative decay.
4. Immediate from the definition. For the bias, take \(\hat g\in\{+a,-a+b\}\) with unequal probabilities chosen so the mean is small but one atom exceeds \(c\); clipping shortens only that atom and shifts the mean.
5. Stationarity of \(g^Tx+\frac1\eta\sum_i x_i\log(x_i/x_{t,i})\) with a simplex multiplier gives \(\log x_i=\log x_{t,i}-\eta g_i+\text{const}\), hence the multiplicative update. It is the same exponential tilt, with \(-g\) in place of the advantage and \(\eta\) in place of \(1/\beta\).
6. \(2P+2P+4P+4P+4P=16P\). Stage 1 leaves \(4P\) of parameters and gradients per rank but divides the \(12P\) of master weights plus moments by \(R\); stage 2 additionally divides gradients; stage 3 also divides parameters, giving roughly \(16P/R\) plus transient gathered layers, at the cost of an all-gather of parameters in forward and backward and a reduce-scatter of gradients.
7. Candidates: (a) data-loader position not restored or resharded across a different rank count, so the epoch order changed; (b) optimizer step counter reset, so bias correction restarts and early updates are inflated; (c) schedule position reset, replaying warmup; (d) reduction order and per-rank batch composition changed, altering gradient-noise statistics and interacting with a clipping threshold tuned at the old configuration. Discriminate by comparing the first post-resume update norms against pre-resume (isolates b), logging the schedule's \(\eta\) at resume (c), replaying the identical batch on both checkpoints (a), and comparing clipped-step fractions before and after (d). Only (d) is specific to changing the rank count; (a), (b) and (c) would have occurred regardless.

</details>

## Mastery gate

Derive and implement projection, prox and mirror-descent updates from their defining problems; explain gradient clipping as a trust region and quantify its bias; explain quantization-aware training as constrained optimization and state exactly where the straight-through estimator has no guarantee; compute the memory of a mixed-precision AdamW run and the effect of each ZeRO stage; and, given a checkpoint-resume discontinuity, identify which piece of estimator state was not restored using evidence rather than inspection of the code.
