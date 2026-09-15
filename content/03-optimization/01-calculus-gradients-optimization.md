---
id: math.calculus.gradients-optimization
title: Calculus, gradients, and optimization
prerequisites: [math.linear-algebra.vectors-spaces-bases, foundations.numerical-stability]
estimated_hours: 22
depth_anchor: Aggarwal LAO4ML, Boyd & Vandenberghe
---

# Calculus, gradients, and optimization

**Prerequisites:** functions, vectors, matrices. **Outcome:** derive a vectorized loss gradient and analyze optimization through curvature.

## Derivatives are local approximations

For $f:\mathbb R^d\to\mathbb R$,

$$
f(x+h)=f(x)+\nabla f(x)^Th+o(\|h\|).
$$

The gradient is a column vector. Its dot product with unit direction $u$ is a directional derivative. Cauchy–Schwarz shows the greatest increase under a Euclidean unit-norm constraint occurs along the normalized gradient. Under a different norm, the steepest direction may differ.

Partial derivatives vary one coordinate while keeping others fixed. Their existence alone does not guarantee differentiability: the full local linear approximation is a stronger statement.

## Chain rule

For $g:\mathbb R^d\to\mathbb R^m$, $J_{ij}=\partial g_i/\partial x_j$ forms an $m\times d$ Jacobian. For scalar outer $f$,

$$
\nabla_x(f\circ g)=J_g(x)^T\nabla_g f.
$$

Reverse-mode differentiation computes these products without materializing every Jacobian. A scalar loss with many parameters is a favorable case.

For $z=Wx+b$, $y=\tanh z$, $L=\frac12\|y-t\|^2$:

$$
\bar y=y-t,\quad \bar z=\bar y\odot(1-y^2),
$$
$$
\nabla_W L=\bar z x^T,\quad \nabla_b L=\bar z,\quad \nabla_x L=W^T\bar z.
$$

Check one entry: $\partial L/\partial W_{ij}=\bar z_i x_j$. Matrix expressions must agree with the scalar chain rule.

## Integrals and expectations

An integral accumulates contributions. With continuous density $p$,

$$
E[f(X)]=\int f(x)p(x)\,dx.
$$

The fundamental theorem connects differentiation and accumulation under regularity conditions. Differentiating under an integral also requires conditions, such as domination by an integrable function. This matters for likelihood and policy gradients.

Monte Carlo replaces an expectation with a sample average. More samples reduce statistical error under suitable assumptions; they do not repair biased sampling or unstable numerical arithmetic.

## Least squares and curvature

Let $L(w)=\|Xw-y\|^2/(2N)$ and $r=Xw-y$. Differentials give

$$
dL=r^TX\,dw/N,\quad \nabla L=X^Tr/N,\quad H=X^TX/N.
$$

Because $v^THv=\|Xv\|^2/N\ge0$, this objective is convex. Full column rank gives positive definiteness and a unique minimizer.

For a positive-definite quadratic, gradient-descent errors follow $e_{t+1}=(I-\eta H)e_t$. Along eigenvalue $\lambda$, the multiplier is $1-\eta\lambda$. Convergence needs $0<\eta<2/\lambda_{\max}$. A broad spectrum causes slow progress in low-curvature directions.

Momentum with $v_t=\beta v_{t-1}+g_t$ and $w_{t+1}=w_t-\eta v_t$ gives the scalar recurrence

$$
e_{t+1}=(1+\beta-\eta\lambda)e_t-\beta e_{t-1}.
$$

Its characteristic roots determine contraction and oscillation. Other momentum conventions multiply the gradient by $1-\beta$; learning rates must be compared using matching equations.

## Adaptive optimization and constraints

Adam tracks exponential averages $m_t$ of gradients and $v_t$ of squared gradients. Correct zero-initialization bias with $\hat m_t=m_t/(1-\beta_1^t)$ and $\hat v_t=v_t/(1-\beta_2^t)$, then step by $\eta\hat m_t/(\sqrt{\hat v_t}+\epsilon)$. The second moment is not the variance, and adaptive scaling is not an exact inverse Hessian.

For inequalities $g_i(x)\le0$, form $\mathcal L=f+\sum_i\lambda_i g_i$ with $\lambda_i\ge0$. KKT conditions combine primal feasibility, dual feasibility, stationarity, and complementary slackness $\lambda_i g_i=0$. Regularity is needed for necessity; convexity supports sufficiency. Full duality arguments require a later unit.

## Lab and problems

1. Derive and implement least-squares gradients; compare with central differences.
2. Sweep finite-difference step size and plot error.
3. Compare gradient descent and momentum on Hessian $\operatorname{diag}(1,100)$.
4. Give stationary points that are a maximum and a saddle.
5. Derive the gradient of $w^TAw$ for nonsymmetric $A$.

<details><summary>Solutions</summary>

Central differences use $[L(w+\epsilon e_i)-L(w-\epsilon e_i)]/(2\epsilon)$. Large steps cause truncation error; tiny steps amplify subtraction error. $-x^2$ has a maximum at zero; $x^2-y^2$ has a saddle. Differentiating the quadratic form gives $(A+A^T)w$.

</details>

**Mastery:** derive an unfamiliar gradient, check it numerically, and predict convergence from curvature.

**Where this continues.** Everything sketched above is developed properly in the optimization track that follows: [convexity, smoothness and duality](03-convexity-smoothness-duality.md) proves the convergence rates and derives KKT and the max-entropy softmax; [stochastic approximation, SGD and batch size](04-stochastic-approximation-sgd.md) replaces the exact gradient with an estimator and derives the critical batch size; [nonconvex landscapes and training dynamics](05-nonconvex-landscapes-training-dynamics.md) covers saddles, the edge of stability and implicit bias; [preconditioning, adaptive methods and schedules](06-preconditioning-adaptive-methods-schedules.md) builds every optimizer past Adam and the width-scaling rules; and [constrained, composite and distributed optimization](07-constrained-composite-distributed-optimization.md) covers projection, prox, trust regions and what a gradient means across many devices.
