# LLM implementation: causal attention and training systems

**Prerequisites:** PyTorch, backpropagation, NLP, probability. **Outcome:** derive a causal attention layer and build a small decoder model from primitives.

## Attention with explicit shapes

Let $X\in\mathbb R^{B\times T\times d}$. Project to queries, keys, and values. For one head, $Q,K\in\mathbb R^{B\times T\times d_k}$ and $V\in\mathbb R^{B\times T\times d_v}$.

$$
S=QK^T/\sqrt{d_k}+M,\quad A=\operatorname{softmax}(S),\quad O=AV.
$$

Transpose the final two dimensions of K. Scores have shape $(B,T,T)$, and softmax normalizes over keys. Causal mask $M_{ij}$ is zero for $j\le i$ and negative infinity for future positions.

If independent query/key coordinates have unit variance, their dot product has variance $d_k$. Dividing by $\sqrt{d_k}$ stabilizes scale under those assumptions.

A row with all keys masked gives undefined normalization. Ensure every valid query has a valid key, and handle padding queries explicitly.

## Causality is a testable property

Change a future token while holding the prefix fixed. Every earlier output must remain unchanged with dropout disabled. This tests causality more directly than looking at the mask's shape.

~~~mermaid
flowchart TD
  X["token and position inputs"] --> N["normalize"]
  N --> A["causal multi-head attention"]
  X --> R["residual sum"]
  A --> R
  R --> F["normalize and MLP"]
  R --> Y["second residual sum"]
  F --> Y
~~~

Multiple heads reshape projected features into separate groups, apply attention per group, concatenate, and project back. Position information is necessary because the attention computation itself does not intrinsically encode token order. Absolute embeddings and rotary representations inject position differently.

## Decoder objective

For token sequence $x_0,\ldots,x_T$, inputs are $x_0,\ldots,x_{T-1}$ and targets $x_1,\ldots,x_T$.

$$
\mathcal L=-\frac1N\sum_{\text{valid positions}}\log p_\theta(x_{t+1}\mid x_{\le t}).
$$

N counts valid target positions. Loss masks must exclude padding and any intentionally excluded training targets. A reduction over batch size instead of valid tokens changes gradient scale with sequence length.

Begin with a byte-level vocabulary and a tiny local corpus. Use CPU or small-GPU configurations first; your 6 GB RTX 2060 is suitable for correctness-scale experiments, not an assumed large-model training budget.

## Memory and compute

Materialized scores cost $O(BHT^2)$ elements. Query/key/value activations and MLP intermediates contribute additional memory. Training also stores parameters, gradients, and optimizer state; mixed-precision copies depend on implementation.

During autoregressive generation, a KV cache stores earlier keys and values so they are not recomputed at every step. Cache size scales roughly as $2LBT H_{\mathrm{kv}}d_h$ elements. It saves repeated projection work but does not eliminate attention over the prefix.

Activation checkpointing trades recomputation for saved activation memory. Gradient accumulation trades sequential microbatch computation for a larger effective batch. Neither makes total training computation free.

## Implementation ladder

1. Implement normalization, linear projections, softmax, and causal attention.
2. Add a residual block, MLP, token embeddings, and language-model head.
3. Overfit a tiny batch; compare against numerical and reference checks.
4. Implement generation, checkpoint/resume, and deterministic evaluation.
5. Implement BPE and a reproducible data pipeline.
6. Profile before optimizing; inspect sequence length, dtype, layout, and kernels.
7. Progress to efficient attention, distributed training, data filtering, and preference training.

This is a staged path toward the implementation demands of [Stanford CS336, Language Modeling from Scratch](https://cs336.stanford.edu/spring2025/). This introductory lesson does not substitute for its complete assignment sequence.

## Lab and problems

Implement causal_attention in [exercises.py](../../labs/exercises.py) for a single unbatched head. The checks include a future-token perturbation.

1. Derive score and output shapes.
2. Show why masking after softmax without renormalizing is wrong.
3. Estimate score memory for a given batch, head count, length, and dtype.
4. Compare full-prefix and cached generation token by token.
5. Explain why tokens/second alone is insufficient without quality and workload details.

<details><summary>Solutions</summary>

Post-softmax deletion leaves row probabilities summing below one. Cache outputs should match full-prefix outputs within numerical tolerance with identical positions and evaluation settings. Score storage is $BHT^2$ times bytes per element, excluding other activations and workspaces. Throughput comparisons need matching context length, batch size, model, hardware, and quality constraints.

</details>

**Mastery:** derive attention, pass causality checks, and defend a memory budget. Later units: tokenizer implementation, rotary positions, efficient attention, Triton kernels, mixed precision, distributed optimizers, scaling laws, data curation, SFT, DPO, and RL post-training.
