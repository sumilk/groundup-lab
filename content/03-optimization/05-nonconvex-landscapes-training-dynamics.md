---
id: math.optimization.nonconvex-landscapes
title: Nonconvex landscapes and training dynamics
prerequisites: [math.optimization.stochastic-approximation-sgd, math.linear-algebra.eigen-invariant-subspaces]
estimated_hours: 36
---

# Nonconvex landscapes and training dynamics

Lesson 08 gave you the theory of a landscape you do not have. This lesson is about the one you do: a loss surface whose Hessian is indefinite everywhere, whose sharpness is not a constant but a *variable that training itself drives*, and whose minima are not points but high-dimensional manifolds that differ in how they generalize.

The organizing claim is that the important nonconvex phenomena are all **spectral**. Saddles, escape times, the stability threshold, flatness, implicit bias and loss spikes are each statements about the eigenvalues of \(\nabla^2f\) or of a closely related PSD surrogate. If you can estimate that spectrum matrix-free — which you learned to do in [eigenvalues and invariant subspaces](../02-linear-algebra/06-eigenvalues-diagonalization.md) — you can measure every one of them.

## 1. Stationary points in high dimension

At \(\nabla f(x)=0\), the Hessian's signature classifies the point. Let \(k\) be the number of negative eigenvalues (the **index**):

- \(k=0\), all eigenvalues positive: local minimum.
- \(k=d\): local maximum.
- \(0<k<d\): saddle.
- Zero eigenvalues: degenerate; second order is silent and higher-order terms decide.

For deep networks the fourth case is the common one — flat directions arise from parameter symmetries (permuting hidden units, rescaling across a ReLU, the \(\mathrm{softmax}\) shift invariance), and those symmetries make the minimizer a manifold rather than a point. An exactly isolated minimum is the exception, not the rule.

A minimum satisfying \(\lambda_{\min}>0\) is a **second-order stationary point**; the useful algorithmic target is the approximate version, \(\lVert\nabla f\rVert\le\varepsilon\) and \(\lambda_{\min}(\nabla^2f)\ge-\sqrt{\rho\varepsilon}\).

## 2. Why the landscape is mostly saddles

Take a random symmetric matrix from the Gaussian orthogonal ensemble. Its spectrum follows the semicircle law, roughly symmetric about zero, so each eigenvalue is positive with probability about \(1/2\) and the eigenvalues repel rather than move independently. The probability that **all** \(d\) are positive decays like \(e^{-cd^2}\) — not merely exponentially in \(d\), but in \(d^2\), because of that repulsion.

The consequence: in a model with \(10^9\) parameters, a randomly encountered critical point is overwhelmingly a saddle. Local minima are not the obstacle folklore claims; the obstacle is **plateaus around high-index saddles**, where the gradient is small and progress along the few escape directions is slow.

Random-matrix theory also supplies the level structure: in the canonical spin-glass analysis, the index of a critical point decreases with its loss value. High-loss critical points have many negative directions and are easy to leave; low-loss critical points are nearly minima. This is the theoretical version of the empirical observation that most sufficiently-trained large models reach comparable loss.

The same tools cover a gap you will otherwise feel later: the Marchenko-Pastur law describes the spectrum of a sample covariance \(\frac1N X^TX\), which is what you actually get when you estimate the covariance in PCA from finite data (the SVD lesson), and it is why small eigenvalues of an empirical covariance are biased low and large ones biased high.

## 3. Escaping saddles

Plain gradient descent can be trapped: there are constructions where GD from a random initialization needs exponentially many steps to escape a chain of saddles. The fix is noise. Under the **strict saddle property** — every stationary point is either a local minimum or has \(\lambda_{\min}\le-\gamma<0\) — perturbed gradient descent, which injects a small random kick when the gradient is small, reaches an approximate second-order stationary point in time polynomial in dimension and polylogarithmic in the target accuracy.

The mechanism is simple enough to reason about: near a saddle the dynamics along the negative-curvature direction are \(e_{t+1}=(1+\eta|\lambda|)e_t\), an exponential escape, but only if \(e_0\ne0\). Noise guarantees a nonzero component. SGD supplies that noise for free, which is one honest reason minibatch noise helps.

Anisotropy matters: SGD's noise covariance \(\Sigma\) is aligned with the Hessian in real networks rather than isotropic, so escape is fastest exactly along the sharp directions. This is a real difference between SGD and GD-plus-Gaussian-noise, and it is measurable.

## 4. The Hessian spectrum of an actual network

Decompose the Hessian of \(f=\ell(h(x))\), with \(J\) the Jacobian of the network outputs with respect to parameters:

$$
\nabla^2f
=\underbrace{J^T(\nabla^2\ell)J}_{\text{Gauss-Newton }G}
+\underbrace{\sum_k\frac{\partial\ell}{\partial h_k}\nabla^2h_k}_{\text{residual }R}.
$$

The **generalized Gauss-Newton** term \(G\) is PSD whenever the loss is convex in the network outputs — true for cross-entropy and squared error. The residual \(R\) carries all the indefiniteness and shrinks as the model fits, since it is weighted by output-space gradients.

Measured spectra of trained networks show a consistent shape: a dense **bulk** concentrated near zero (the flat directions and symmetries) plus a small number of **outliers** separated from it, typically on the order of the number of classes or of dominant data clusters. The outliers come from \(G\) and carry most of \(\operatorname{tr}(H)\); they set \(L\), so they set the stability threshold and, via \(\operatorname{tr}(H\Sigma)\) in the SGD lesson, they set the noise amplification too.

This decomposition is not an aside: it is exactly why the practical second-order methods of the preconditioning lesson (K-FAC, Shampoo, natural gradient) approximate \(G\) or the Fisher rather than \(H\). You cannot invert an indefinite matrix and call it a preconditioner.

## 5. The edge of stability

Lesson 08 said stability requires \(\eta<2/L\). In a real run, \(L\) is not given — it *moves*, and it moves toward you.

Full-batch GD on a network shows **progressive sharpening**: \(\lambda_{\max}\) grows during training until it reaches \(2/\eta\), then stops and hovers there, oscillating just above and below. Training continues, non-monotonically in the short run and downward over longer windows. The stability threshold is therefore not a constraint you satisfy but an **equilibrium the dynamics seek out**.

The practical readings:

- The largest usable learning rate cannot be read off the initial curvature; early sharpness is not final sharpness.
- \(\eta\) selects the sharpness of the solution you end at: \(\lambda_{\max}\approx2/\eta\) is a property of the endpoint, and smaller \(\eta\) ends at sharper minima.
- Warmup does real work: it keeps you below the threshold while curvature is transiently large, and lets sharpening find the equilibrium rather than a divergence.
- A quadratic **cannot** show this behaviour — its Hessian is constant. Progressive sharpening is a genuinely nonlinear effect, and any intuition you build on quadratics will miss it.

With minibatches the picture becomes a stochastic version of the same equilibrium, with the threshold lowered by the noise term of the SGD lesson.

## 6. Flatness, and why the naive version is wrong

The generalization folklore says flat minima generalize better. The standard measure — \(\lambda_{\max}\) or \(\operatorname{tr}(H)\) at the minimum — has a fatal problem: for a ReLU network, rescaling one layer by \(\alpha\) and the next by \(1/\alpha\) leaves the represented function **exactly unchanged** while changing the Hessian spectrum arbitrarily. Sharpness in this sense is a property of the parameterization, not of the function, so it cannot by itself explain generalization.

What survives:

- **Scale-normalized measures**, e.g. sharpness evaluated over a ball whose radius scales with the local parameter norm, are reparameterization-aware and correlate better.
- **Worst-case sharpness in a neighbourhood** — \(\max_{\lVert\epsilon\rVert\le\rho}f(x+\epsilon)\) — is the objective that sharpness-aware minimization actually optimizes, and it is a different (and better-behaved) quantity than \(\lambda_{\max}\).
- **Information-theoretic flatness**, via the description length of the minimum, is the version with an actual generalization argument behind it — see [entropy, generalization and decisions](../06-information-learning-decision/01-entropy-generalization-decisions.md).

Hold the whole cluster of claims loosely. The correlation between flatness and generalization is real and repeatedly observed; the causal story is not settled, and the counterexamples are not exotic.

## 7. Implicit bias: which minimum you land on

With more parameters than constraints, the minimizer is not unique and the algorithm picks. These choices are provable in simple cases:

- **Least squares from zero initialization.** GD stays in the row space of \(X\), so it converges to the **minimum-norm** interpolant — the same pseudoinverse solution you derived in [SVD and PCA](../02-linear-algebra/08-svd-low-rank.md). The regularizer is implicit in the initialization and the update, not in the objective.
- **Separable logistic regression.** GD drives \(\lVert w\rVert\to\infty\) while the *direction* converges to the \(\ell_2\) **max-margin** separator, at a rate like \(1/\log t\). You get an SVM without writing one, and the convergence is so slow that "training loss still decreasing" tells you almost nothing about the direction having settled.
- **Initialization scale** selects the regime: large initialization gives lazy or kernel-like training where features barely move; small initialization gives rich, feature-learning training. Which one you are in changes what the network learns, not merely how fast.
- **Label-noise SGD** provably biases toward flatter solutions in simple models, giving one of the few rigorous links between noise and flatness.

Practical consequence: "we changed only the optimizer/init scale/batch size" is never a claim about speed only. It is a claim about which solution you converge to.

## 8. Loss spikes at scale

A large pretraining run produces a loss curve that is mostly smooth with occasional sharp spikes, some of which recover and some of which destroy the run. Triage in this order, because the fixes have very different costs:

1. **Data.** Is the spike reproducible from the same shard? A corrupted, duplicated, or wildly out-of-distribution document is the cheapest explanation and the easiest test: replay the batch on the pre-spike checkpoint.
2. **Numerics.** Is there an inf/NaN in bf16 or fp16, an overflowing attention logit, or a growing \(\lVert W_QW_K^T\rVert\)? QK-normalization and a z-loss penalty on \(\log\sum e^{z}\) address the logit-growth mode directly.
3. **Curvature.** Has \(\lambda_{\max}\) drifted up into \(2/\eta\)? This is the edge-of-stability mechanism, and the fix is the schedule, not the data.
4. **Optimizer state.** After a spike, Adam's \(\hat v\) contains a huge stale second moment that suppresses updates for \(O(1/(1-\beta_2))\) steps. A run can look "recovered" in loss while the optimizer is still crippled — check the update norms, not only the loss.
5. **Sharding or collective bug.** A rank with a divergent gradient contaminates the all-reduce. Log per-rank gradient norms; a single-rank outlier is diagnostic.

The standard mitigations — gradient clipping, skipping batches whose gradient norm exceeds a percentile, rewinding to a checkpoint and skipping data — all work. All of them also change the estimator, so state them as part of the method rather than treating them as operational details.

## Implementation lab

1. Implement matrix-free Lanczos on Hessian-vector products to get the top-\(k\) eigenvalues and an estimate of the bulk, without ever forming \(H\). Validate against a dense `torch.linalg.eigvalsh` on a tiny model.
2. **Reproduce the edge of stability.** Train a small network with full-batch GD at several \(\eta\); plot \(\lambda_{\max}(t)\) and \(2/\eta\) together. Confirm sharpening, the plateau at \(2/\eta\), and the non-monotone loss.
3. Construct an explicit strict saddle; compare escape times for GD, perturbed GD and SGD. Then repeat with noise covariance aligned versus isotropic and compare.
4. Plot the Hessian eigenvalue histogram of a small classifier; identify bulk and outliers; count the outliers against the number of classes. Compute the Gauss-Newton part separately and verify it is PSD to numerical tolerance.
5. **Falsify naive flatness.** Rescale consecutive layers of a trained ReLU network by \(\alpha\) and \(1/\alpha\); verify the function is unchanged to float tolerance and report how much \(\lambda_{\max}\) moved.
6. Train logistic regression on separable data for \(10^6\) steps; track \(\lVert w\rVert\) and the angle between \(w/\lVert w\rVert\) and the hard-margin SVM solution. Show the norm diverges while the angle converges, and measure the rate.
7. **Spike triage drill.** Induce a spike by bumping \(\eta\) mid-run. Then, from logs alone, produce the diagnosis: report \(\lambda_{\max}\), gradient-norm percentiles, per-layer update norms and Adam's \(\hat v\) before, during and after.

**From-scratch constraint:** Hessian-vector products via double backward only — no finite differences for the curvature measurements, and no explicit Hessian anywhere except the tiny validation case.

## Problems

1. Classify the stationary points of \(f(x,y)=x^2-y^2\), \(f=x^2+y^4\) and \(f=x^2y^2\); say which are decided by the Hessian and which are not, and why the degenerate cases are the generic ones in deep networks.
2. Derive \(\nabla^2f=J^T(\nabla^2\ell)J+\sum_k\partial_{h_k}\ell\,\nabla^2h_k\) and prove the first term is PSD for cross-entropy. Explain why \(R\) need not vanish at a minimum of the training loss.
3. Argue that for a random symmetric matrix the probability of all \(d\) eigenvalues being positive decays faster than \(2^{-d}\), and say what eigenvalue repulsion contributes.
4. Show that for a ReLU network the map \((W_1,W_2)\mapsto(\alpha W_1,\alpha^{-1}W_2)\) leaves the function unchanged, and compute how \(\nabla^2f\) transforms. Conclude that \(\lambda_{\max}\) alone cannot be a generalization measure.
5. Show that GD on an under-determined least-squares problem started at \(0\) converges to \(X^+y\). Which part of the argument uses the initialization, and which uses the update rule?
6. Prove a quadratic cannot exhibit progressive sharpening. Then give the smallest model you can construct that does.
7. **Transfer.** A 30B-parameter run spikes at step 41,200 and partly recovers over 2,000 steps, but never returns to the pre-spike trend. You have per-rank gradient norms, the data-shard index, \(\lambda_{\max}\) estimates every 500 steps, and checkpoints every 1,000 steps. Give the ordered set of experiments that discriminates between the five causes in section 8, state what each one would show under each cause, and say which single measurement you would add to the logging for next time.

<details><summary>Solution sketches</summary>

1. The first is a saddle and the second a minimum by inspection of the Hessian's nonzero part; \(x^2y^2\) has a Hessian that is identically singular along both axes, so second order decides nothing. Symmetry-induced flat directions in networks make this third case generic.
2. Differentiate twice through the composition. For cross-entropy, \(\nabla^2\ell=\operatorname{diag}(p)-pp^T\succeq0\) (the convexity lesson), so \(J^T(\nabla^2\ell)J\succeq0\) for any \(J\). \(R\) vanishes only where output-space gradients vanish, i.e. at a perfect fit, which is not where training stops.
3. Independent signs would give \(2^{-d}\); repulsion makes a large positive fluctuation of the whole spectrum far more costly, and the large-deviation rate is quadratic in \(d\).
4. Positive homogeneity of ReLU gives \(\alpha^{-1}W_2\sigma(\alpha W_1x)=W_2\sigma(W_1x)\). The Hessian blocks scale as \(\alpha^{-2}\) and \(\alpha^{2}\), so \(\lambda_{\max}\) can be driven arbitrarily high or low along an orbit of identical functions.
5. Every gradient \(X^T(Xw-y)\) lies in \(\operatorname{row}(X)\); from \(w_0=0\) all iterates stay there. Convergence plus membership in the row space uniquely identifies the minimum-norm solution. The initialization fixes the affine subspace; the update rule fixes that it is the row space.
6. A quadratic's Hessian is constant, so \(\lambda_{\max}\) cannot change. A two-layer network with a single nonlinearity on scalar data already sharpens, because the curvature depends on the weights.
7. Replay the pre-spike checkpoint on the exact batch (isolates data); check per-rank norms at the spike step (isolates a single-rank or collective fault); compare \(\lambda_{\max}\) against \(2/\eta\) across the window (isolates edge-of-stability); inspect Adam \(\hat v\) and update norms during recovery (explains the failure to return to trend, since a stale second moment suppresses effective learning rate for roughly \(1/(1-\beta_2)\) steps); check for logit growth and bf16 overflow in the attention block. Failing to return to trend after loss recovery is the signature of optimizer-state damage rather than data. Add continuous logging of per-layer update-to-weight norm ratios; it is cheap and distinguishes cause 4 from the rest immediately.

</details>

## Mastery gate

Measure a real network's top Hessian eigenvalues matrix-free and interpret bulk versus outliers; reproduce the edge of stability and predict the sharpness a given learning rate will converge to; demonstrate why naive flatness is not reparameterization-invariant and state what survives the objection; prove the minimum-norm implicit bias of GD on least squares; and triage a supplied loss spike to a specific cause with the evidence you used.
