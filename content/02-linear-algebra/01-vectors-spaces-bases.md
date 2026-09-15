---
id: math.linear-algebra.vectors-spaces-bases
title: Vectors, vector spaces and bases
prerequisites: [foundations.mathematical-language]
estimated_hours: 20
---

# Vectors, vector spaces and bases

## 1. A vector is not merely a list

A vector is an element of a vector space. A list of numbers represents that element relative to a chosen ordered basis. Confusing the object with its coordinates becomes costly when studying embeddings, attention, change of basis and low-rank representations.

A real vector space \(V\) is closed under vector addition and scalar multiplication and satisfies the familiar associativity, identity, inverse and distributive axioms. The space may consist of coordinate tuples, polynomials, functions, matrices or random variables.

For a basis \(B=(b_1,\dots,b_d)\), every \(v\in V\) has a unique representation

$$
v=\sum_{i=1}^d \alpha_i b_i,
\qquad
[v]_B=(\alpha_1,\dots,\alpha_d)^T.
$$

The geometric vector \(v\) is unchanged when the basis changes; its coordinate column changes.

![A vector represented in two bases](../assets/change-of-basis.svg)

> **Stop and predict.** If a vector has coordinates \([2,1]^T\) in the standard basis, can it have coordinates \([1,1]^T\) in another basis without changing the vector? Construct such a basis.

## 2. Span and linear independence

The span of \(S=\{v_1,\dots,v_k\}\) is

$$
\operatorname{span}(S)=\left\{\sum_{i=1}^k\alpha_i v_i:\alpha_i\in\mathbb R\right\}.
$$

It is the smallest subspace containing every \(v_i\). The vectors are linearly independent if

$$
\sum_i\alpha_i v_i=0 \implies \alpha_i=0\quad\text{for all }i.
$$

A basis is simultaneously spanning and independent. Spanning gives existence of coordinates; independence gives uniqueness.

### Why this matters for ML

- Redundant features are linearly dependent directions.
- Embedding width bounds the dimension of the representable coordinate space.
- Low-rank adapters constrain updates to a subspace.
- Identifiability failures often arise because multiple parameter directions represent the same function.

## 3. Inner products and geometry

An inner product supplies lengths and angles. In \(\mathbb R^d\), the standard inner product is

$$
\langle x,y\rangle=x^Ty.
$$

The induced norm and cosine are

$$
\|x\|_2=\sqrt{x^Tx},\qquad
\cos\theta=\frac{x^Ty}{\|x\|_2\|y\|_2}.
$$

Orthogonality means \(x^Ty=0\). It is stronger than weak similarity: it expresses zero component in the other direction under the chosen inner product.

A matrix \(G\succ0\) defines another inner product, \(\langle x,y\rangle_G=x^TGy\). Thus “distance” is part of the model, not an inevitable property of coordinates.

## 4. Coordinates under a change of basis

Let \(B,C\in\mathbb R^{d\times d}\) contain basis vectors as columns. Then

$$
v=B[v]_B=C[v]_C.
$$

If \(C\) is invertible,

$$
[v]_C=C^{-1}B[v]_B.
$$

**Own this derivation.** Do not memorize the order of matrices. Reconstruct it from the invariant vector \(v\).

If the basis is orthonormal, \(C^{-1}=C^T\), which makes coordinate conversion stable and cheap. For a highly non-orthogonal basis, small perturbations in \(v\) can create large changes in coordinates.

## 5. Affine spaces

A subspace must contain zero. Many model sets do not. An affine space is a translated subspace:

$$
\mathcal A=x_0+S=\{x_0+s:s\in S\}.
$$

The solution set of \(Ax=b\), when nonempty, is affine: a particular solution plus the null space of \(A\).

## Implementation lab

Implement without a high-level estimator:

- independence and rank checks using SVD tolerances;
- coordinate conversion between arbitrary bases;
- Gram–Schmidt and modified Gram–Schmidt;
- cosine similarity and a learned \(G\)-metric;
- tests showing loss of accuracy for nearly dependent bases.

Before coding, specify shapes and the invariant \(B[v]_B=C[v]_C\).

## Problems

1. Prove that the intersection of two subspaces is a subspace. Is their union necessarily one?
2. Determine whether \((1,1,0),(1,0,1),(0,1,1)\) form a basis of \(\mathbb R^3\).
3. Construct an orthonormal basis for the span of \((1,1,0),(1,0,1)\).
4. Explain why cosine similarity is unchanged by positive rescaling but Euclidean distance is not.
5. **Transfer.** Suppose every embedding is transformed by an invertible matrix \(A\). What must happen to a downstream linear weight matrix to preserve logits?

<details><summary>Solution sketches</summary>

1. Zero belongs to both; closure under addition and scalar multiplication is inherited. A union fails when one vector is taken from each subspace and their sum lies in neither; the union is a subspace only if one is contained in the other.
2. The determinant of the column matrix is \(-2\), so the vectors are independent and span \(\mathbb R^3\).
3. Normalize \((1,1,0)\), subtract its projection from \((1,0,1)\), then normalize the residual.
4. For \(a,b>0\), numerator and denominator both scale by \(ab\). Distance \(\|ax-by\|\) generally changes.
5. If row embeddings become \(x'=xA\) and logits were \(xW\), choose \(W'=A^{-1}W\) so \(x'W'=xW\).

</details>

## Mastery gate

Explain the object/coordinate distinction, derive change of basis, implement it with tests, and diagnose why a nearly dependent basis produces unstable coordinates.

