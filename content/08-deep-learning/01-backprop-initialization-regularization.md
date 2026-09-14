# Deep learning: backpropagation, initialization, and regularization

**Prerequisites:** matrix calculus and PyTorch basics. **Outcome:** implement a neural network's forward and backward passes without autograd.

## Why layers need nonlinearities

If every layer is affine, composing layers still gives one affine transformation. A hidden nonlinearity changes the function class. More expressive models need assumptions and regularization because fitting the training sample alone does not establish generalization.

For row-major batches $X\in\mathbb R^{B\times d}$,

$$
Z_1=XW_1+b_1,\quad H=\operatorname{ReLU}(Z_1),\quad
Z_2=HW_2+b_2.
$$

Here $W_1$ has shape $d\times h$, $W_2$ has shape $h\times C$, and biases broadcast across the batch. Use mean multiclass cross-entropy.

## Backpropagation, element by element

Let $P=\operatorname{softmax}(Z_2)$ and $Y$ be one-hot targets. The logit derivative is

$$
G_2=(P-Y)/B.
$$

Because $Z_{2,ic}=\sum_jH_{ij}W_{2,jc}+b_{2,c}$,

$$
\frac{\partial L}{\partial W_{2,jc}}
=\sum_i \frac{\partial L}{\partial Z_{2,ic}}H_{ij}.
$$

Thus

$$
\nabla W_2=H^TG_2,\quad \nabla b_2=\sum_iG_{2,i:},
$$
$$
G_1=(G_2W_2^T)\odot\mathbf1[Z_1>0],
$$
$$
\nabla W_1=X^TG_1,\quad \nabla b_1=\sum_iG_{1,i:}.
$$

At zero, ReLU is not differentiable; numerical frameworks use a chosen subgradient convention. Keep gradient-check inputs away from that kink.

~~~mermaid
flowchart TD
  X["batch X"] --> Z["affine Z1"]
  W["W1, b1"] --> Z
  Z --> H["ReLU H"]
  H --> O["logits Z2"]
  V["W2, b2"] --> O
  O --> L["mean cross-entropy"]
  L -. "G2" .-> O
  O -. "G1" .-> Z
~~~

> **Predict:** If one hidden unit is negative for every example, what gradient reaches its incoming weights in this batch?

## Initialization

For $z=\sum_{j=1}^d w_jx_j$, assume independent zero-mean weights with variance $\sigma_w^2$ and independent identically distributed inputs. Then approximately

$$
E[z^2]=d\,\sigma_w^2 E[x^2].
$$

For a symmetric preactivation, ReLU keeps about half the second moment. Choosing weight variance near $2/d$ helps preserve second moments through ReLU layers under these assumptions. This is a heuristic distributional argument, not a universal guarantee of stable training.

Repeated Jacobian products govern backward signal. Large singular values can amplify gradients; small ones can attenuate them. Residual blocks $h_{l+1}=h_l+F(h_l)$ add an identity path to the Jacobian, giving $I+J_F$.

## Normalization and dropout

Batch normalization estimates feature statistics across a batch (and possibly spatial axes). Layer normalization normalizes features within each example/token. Their axes, learned affine parameters, and train/eval behaviors differ.

In inverted dropout, retain a unit with probability $q$ and output $mh/q$. Conditional on $h$, expected output remains $h$, but variance increases. At evaluation, dropout is disabled. Preserving expectation does not imply the whole nonlinear network's expected prediction is identical.

Weight decay penalizes parameter magnitude or shrinks parameters directly, depending on formulation. Under adaptive optimizers, decoupled weight decay is not generally equivalent to adding an L2 gradient penalty.

## Debugging order

First verify dimensions and loss. Then fit a tiny deterministic batch. Compare manual gradients to finite differences and autograd. Inspect activation and gradient distributions. Only then tune a large training run.

A flat loss can arise from broken data-label alignment, disconnected gradients, inappropriate learning rates, dead activations, or an evaluation-mode mistake. A smaller experiment distinguishes causes faster than changing many hyperparameters.

## Lab and problems

1. Implement the two-layer forward/backward formulas in NumPy.
2. Compare every parameter gradient to central differences.
3. Repeat with autograd as a reference, not as the implementation.
4. Plot activation and gradient second moments across depth for three initialization scales.
5. Derive dropout's conditional variance.
6. Explain why zero-initializing every hidden weight prevents distinct hidden features.

<details><summary>Solutions</summary>

A negative ReLU has zero local derivative. Dropout variance is $h^2(1-q)/q$. Identical hidden weights and identical updates preserve permutation symmetry, so units cannot specialize. Gradient-check disagreements at ReLU zero are not necessarily implementation errors.

</details>

**Mastery:** reproduce backprop from indices and debug a deliberately broken gradient. Later units: convolution, recurrence, normalization derivations, residual networks, generalization, generative models, diffusion, and representation learning.
