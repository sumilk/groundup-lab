# PyTorch: tensor storage, autograd, and the training loop

**Prerequisites:** Python, linear algebra, chain rule. **Outcome:** explain each tensor operation and each state change during training.

## Shape is not storage

A tensor has values, shape, strides, dtype, device, and storage. For a strided tensor, element address is determined by storage offset plus $\sum_k i_k s_k$, where $s_k$ is the stride along dimension $k$.

Transposing usually changes the view's indexing metadata rather than rearranging data. A view operation requires compatible layout; reshape may return a view or make a copy. Do not assume reshape always allocates or never allocates.

~~~python
import torch

x = torch.arange(12).reshape(3, 4)
y = x.transpose(0, 1)
print(x.shape, x.stride())
print(y.shape, y.stride())
z = y.contiguous().view(-1)
assert z.shape == (12,)
~~~

> **Predict:** Does z have the same flattened order as x? Explain which logical order contiguous materializes.

Broadcasting aligns dimensions from the right. Dimensions must match or one must be one. Adding shapes $(B,T,D)$ and $(D,)$ works; adding $(B,T,D)$ and $(B,D)$ generally does not express the intended batch-specific bias. A bias shaped $(B,1,D)$ does.

A broadcast variable receives summed gradients over its broadcast dimensions. Derive this from repeated use of the same scalar in the computation graph.

## Autograd is reverse accumulation

For $L=f(g(x))$, reverse mode propagates $J_g^T\nabla_g L$. Operations build a graph during the forward pass; backward accumulates gradients into leaves that require them.

~~~python
w = torch.tensor(2.0, requires_grad=True)
loss = (3*w - 1)**2
loss.backward()
assert w.grad.item() == 30.0
~~~

A second fresh forward/backward without clearing the gradient adds another 30. Gradient accumulation can be intentional for microbatches; it is not automatically reset per optimizer step.

See the [official autograd tutorial](https://docs.pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html) for graph and gradient behavior. In-place changes to values saved for backward can invalidate derivative computation. Detaching breaks a gradient path; copying a tensor's value into an unrelated tensor does not preserve that path automatically.

## Logits and cross-entropy

A multiclass model emits unnormalized scores $z\in\mathbb R^C$. For class index $y$,

$$
\ell(z,y)=\log\sum_j e^{z_j}-z_y,\qquad
\frac{\partial\ell}{\partial z_j}=\operatorname{softmax}(z)_j-\mathbf 1[j=y].
$$

Compute log-sum-exp stably using $m=\max_jz_j$:

$$
\log\sum_j e^{z_j}=m+\log\sum_j e^{z_j-m}.
$$

For ordinary index targets, pass logits of shape $(B,C)$ and integer targets of shape $(B,)$ to cross-entropy. Do not pre-apply softmax. More advanced probability-target and spatial modes have different shape contracts; check the [loss documentation](https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html).

## Training and evaluation state

~~~python
model.train()
for inputs, targets in train_loader:
    optimizer.zero_grad(set_to_none=True)
    logits = model(inputs)
    loss = torch.nn.functional.cross_entropy(logits, targets)
    loss.backward()
    optimizer.step()

model.eval()
with torch.no_grad():
    logits = model(validation_inputs)
~~~

The optimizer changes parameters using gradients. Clearing gradients, backward, and stepping are separate operations. Training mode affects modules such as dropout and batch normalization. Evaluation mode does not itself disable gradient tracking; no-grad does not itself switch dropout off.

For unequal microbatches, weight mean losses by their sample counts when accumulating to reproduce a full-batch average. A blind division by the number of microbatches is wrong when sizes differ.

## Lab and problems

Implement stable_softmax in [exercises.py](../../labs/exercises.py). Then write a two-layer classifier, an explicit training loop, and a numerical gradient check on a tiny float64 input.

1. Derive the gradient of a broadcast bias.
2. Explain why train and eval are independent from no-grad.
3. Compare repeated backward with and without clearing leaf gradients.
4. Why can copying through a Python number break differentiation?
5. Predict the result of transposition followed by contiguous flattening.

<details><summary>Solutions</summary>

Broadcast bias gradients sum over every use. A Python number has no autograd history. Transposition changes logical traversal; contiguous materializes that traversal, producing a different flatten order from the original. Zeroing controls accumulation; eval controls module behavior; no-grad controls graph recording.

</details>

**Mastery:** defend shapes, strides, dtype, device, and gradients without trial-and-error fixes. Later units: data loading, custom autograd, hooks, mixed precision, compilation, checkpointing, distributed training, and profiling.
