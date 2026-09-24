/* Module 3: statements, offline checks, and marking references. */
GU.answers("03-projection", {

A1: {
  "statement": "**A1 · Foundation · paper — the metric changes the angle.** For \\(u=(1,1)\\), \\(v=(1,-1)\\), and \\(G=\\operatorname{diag}(1,4)\\), compute the inner product, both squared lengths, and the metric cosine. Compare with the Euclidean cosine.",
  "plain": "The metric inner product is −3, both squared lengths are 5, and the metric cosine is −3/5. The Euclidean cosine is 0. A changed metric changes orthogonality.",
  "solution": "<p>The metric inner product is −3, both squared lengths are 5, and the metric cosine is −3/5. The Euclidean cosine is 0. A changed metric changes orthogonality.</p>",
  "hints": {
    "ip": "Substitute the result back into the defining equations.",
    "norm": "Substitute the result back into the defining equations.",
    "cos": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "ip",
      "label": "inner product",
      "type": "num",
      "ans": -3
    },
    {
      "id": "norm",
      "label": "each squared length",
      "type": "num",
      "ans": 5
    },
    {
      "id": "cos",
      "label": "metric cosine",
      "type": "num",
      "ans": -0.6
    }
  ]
},

A2: {
  "statement": "**A2 · Foundation · paper — positive diagonals are not enough.** Which of \\(I_2\\), \\(\\operatorname{diag}(1,0)\\), \\(\\begin{pmatrix}1&2\\\\2&1\\end{pmatrix}\\), and \\(\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}\\) define inner products? For each rejection exhibit a nonzero vector with nonpositive squared length.",
  "plain": "The first and fourth are positive definite. The second kills e2. The third gives (1,−1) squared length −2. For the fourth, 2x²+2xy+2y²=x²+y²+(x+y)²>0 away from zero.",
  "solution": "<p>The first and fourth are positive definite. The second kills e2. The third gives (1,−1) squared length −2. For the fourth, 2x²+2xy+2y²=x²+y²+(x+y)²&gt;0 away from zero.</p>",
  "hints": {
    "valid": "Test vectors (0,1) and (1,−1), then complete squares."
  },
  "fields": [
    {
      "id": "valid",
      "label": "valid positions (1-based)",
      "type": "set",
      "ans": [
        1,
        4
      ]
    }
  ]
},

A3: {
  "statement": "**A3 · Core · paper — derive the cosine bound.** Prove Cauchy–Schwarz by choosing a scalar \\(t\\) in \\(\\|u-tv\\|_G^2\\ge0\\). Handle a zero vector and characterize equality.",
  "plain": "If v=0 the inequality is equality. Otherwise choose t=<u,v>G/<v,v>G. Expansion gives ||u||G²−<u,v>G²/||v||G²≥0. Equality holds precisely when u=tv; allowing a zero vector, this is dependence of the pair. Positivity is the step converting zero squared norm into a zero vector.",
  "solution": "<p>If v=0 the inequality is equality. Otherwise choose t=&lt;u,v&gt;G/&lt;v,v&gt;G. Expansion gives ||u||G²−&lt;u,v&gt;G²/||v||G²≥0. Equality holds precisely when u=tv; allowing a zero vector, this is dependence of the pair. Positivity is the step converting zero squared norm into a zero vector.</p>"
},

A4: {
  "statement": "**A4 · Foundation · paper — two complements for one line.** Find a generator of the Euclidean complement of \\(S=\\operatorname{span}\\{(1,2)\\}\\), and one of its complement under \\(G=\\operatorname{diag}(1,4)\\).",
  "plain": "Euclidean: r1+2r2=0, so (−2,1). Weighted: r1+8r2=0, so (−8,1). The dimensions agree although the lines differ.",
  "solution": "<p>Euclidean: r1+2r2=0, so (−2,1). Weighted: r1+8r2=0, so (−8,1). The dimensions agree although the lines differ.</p>",
  "hints": {
    "euclidean": "Substitute the result back into the defining equations.",
    "weighted": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "euclidean",
      "label": "Euclidean generator",
      "type": "ratio",
      "ans": [
        -2,
        1
      ]
    },
    {
      "id": "weighted",
      "label": "weighted generator",
      "type": "ratio",
      "ans": [
        -8,
        1
      ]
    }
  ]
},

A5: {
  "statement": "**A5 · Foundation · paper — a weighted foot.** Project \\(x=(2,0)\\) onto \\(u=(1,1)\\) under \\(G=\\operatorname{diag}(1,4)\\). Give the coefficient, projected point, residual, and squared metric distance.",
  "plain": "α=2/5; p=(2/5,2/5); r=(8/5,−2/5); squared metric distance 16/5. Check u^TGr=8/5−8/5=0.",
  "solution": "<p>α=2/5; p=(2/5,2/5); r=(8/5,−2/5); squared metric distance 16/5. Check u^TGr=8/5−8/5=0.</p>",
  "hints": {
    "alpha": "Substitute the result back into the defining equations.",
    "p": "Substitute the result back into the defining equations.",
    "r": "Substitute the result back into the defining equations.",
    "error": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "alpha",
      "label": "coefficient",
      "type": "num",
      "ans": 0.4
    },
    {
      "id": "p",
      "label": "projected point",
      "type": "vec",
      "ans": [
        0.4,
        0.4
      ]
    },
    {
      "id": "r",
      "label": "residual",
      "type": "vec",
      "ans": [
        1.6,
        -0.4
      ]
    },
    {
      "id": "error",
      "label": "squared metric distance",
      "type": "num",
      "ans": 3.2
    }
  ]
},

A6: {
  "statement": "**A6 · Core · paper — a plane from a skew basis.** For \\(b_1=(1,0,1)\\), \\(b_2=(0,1,1)\\), project \\(x=(1,1,0)\\) using the Gram system. Give coefficients, projected point, residual, and squared distance.",
  "plain": "The Gram system [[2,1],[1,2]]c=(1,1) gives c=(1/3,1/3). Hence p=(1/3,1/3,2/3), r=(2/3,2/3,−2/3), and squared distance 4/3. Each generator has zero dot product with r.",
  "solution": "<p>The Gram system [[2,1],[1,2]]c=(1,1) gives c=(1/3,1/3). Hence p=(1/3,1/3,2/3), r=(2/3,2/3,−2/3), and squared distance 4/3. Each generator has zero dot product with r.</p>",
  "hints": {
    "c": "Substitute the result back into the defining equations.",
    "p": "Substitute the result back into the defining equations.",
    "error": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "c",
      "label": "coefficients",
      "type": "vec",
      "ans": [
        0.3333333333333333,
        0.3333333333333333
      ]
    },
    {
      "id": "p",
      "label": "projected point",
      "type": "vec",
      "ans": [
        0.3333333333333333,
        0.3333333333333333,
        0.6666666666666666
      ]
    },
    {
      "id": "error",
      "label": "squared distance",
      "type": "num",
      "ans": 1.3333333333333333
    }
  ]
},

A7: {
  "statement": "**A7 · Core · paper — why the nearest point is unique.** Prove the projection theorem for a finite-dimensional subspace under a positive definite metric. Establish existence as well as uniqueness; do not begin by assuming a minimizer exists.",
  "plain": "For a nonzero subspace select a basis B. Its Gram matrix H=B^TGB is positive definite since c≠0 implies Bc≠0. Solve Hc=B^TGx, set p=Bc, r=x−p. Then r is orthogonal to the subspace. For q in the subspace, ||x−q||G²=||r||G²+||p−q||G², minimized only at q=p. For the zero subspace take p=0. This constructs existence before invoking uniqueness.",
  "solution": "<p>For a nonzero subspace select a basis B. Its Gram matrix H=B^TGB is positive definite since c≠0 implies Bc≠0. Solve Hc=B^TGx, set p=Bc, r=x−p. Then r is orthogonal to the subspace. For q in the subspace, ||x−q||G²=||r||G²+||p−q||G², minimized only at q=p. For the zero subspace take p=0. This constructs existence before invoking uniqueness.</p>"
},

A8: {
  "statement": "**A8 · Core · paper — idempotent is not enough.** For \\(Q=\\begin{pmatrix}1&1\\\\0&0\\end{pmatrix}\\), compute \\(Q^2\\), its range and kernel, and its action on \\(e_2\\). Explain why it is not a Euclidean orthogonal projector.",
  "plain": "Q²=Q. The range is the x-axis; the kernel is span{(−1,1)}. Qe2=e1, although zero is the nearest x-axis point to e2. Q is not symmetric and its kernel is not the Euclidean complement of its range.",
  "solution": "<p>Q²=Q. The range is the x-axis; the kernel is span{(−1,1)}. Qe2=e1, although zero is the nearest x-axis point to e2. Q is not symmetric and its kernel is not the Euclidean complement of its range.</p>",
  "hints": {
    "image": "Substitute the result back into the defining equations.",
    "kernel": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "image",
      "label": "Qe2",
      "type": "vec",
      "ans": [
        1,
        0
      ]
    },
    {
      "id": "kernel",
      "label": "kernel generator",
      "type": "ratio",
      "ans": [
        -1,
        1
      ]
    }
  ]
},

A9: {
  "statement": "**A9 · Core · paper — self-adjoint in the right metric.** For \\(P=\\tfrac15\\begin{pmatrix}1&4\\\\1&4\\end{pmatrix}\\), verify \\(P^2=P\\) and \\(P^{\\mathsf T}G=GP\\) with \\(G=\\operatorname{diag}(1,4)\\). Identify the range and kernel.",
  "plain": "P²=P and P^TG=GP=(1/5)[[1,4],[4,16]]. The range is span{(1,1)} and kernel is span{(−4,1)}. P is G-orthogonal despite not being ordinarily symmetric.",
  "solution": "<p>P²=P and P^TG=GP=(1/5)[[1,4],[4,16]]. The range is span{(1,1)} and kernel is span{(−4,1)}. P is G-orthogonal despite not being ordinarily symmetric.</p>",
  "hints": {
    "kernel": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "kernel",
      "label": "kernel generator",
      "type": "ratio",
      "ans": [
        -4,
        1
      ]
    }
  ]
},

A10: {
  "statement": "**A10 · Foundation · paper — fit three heights.** Fit \\(a+bt\\) to \\((0,1),(1,2),(2,2)\\) by the normal equations. Give the coefficients and residual vector, then verify the residual sums against both design columns.",
  "plain": "a=7/6, b=1/2, residual (−1/6,1/3,−1/6). Both Σr_i and Σt_i r_i vanish. Squared error is 1/6.",
  "solution": "<p>a=7/6, b=1/2, residual (−1/6,1/3,−1/6). Both Σr_i and Σt_i r_i vanish. Squared error is 1/6.</p>",
  "hints": {
    "w": "Substitute the result back into the defining equations.",
    "r": "Substitute the result back into the defining equations.",
    "sse": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "w",
      "label": "(intercept, slope)",
      "type": "vec",
      "ans": [
        1.1666666666666667,
        0.5
      ]
    },
    {
      "id": "r",
      "label": "residual",
      "type": "vec",
      "ans": [
        -0.16666666666666666,
        0.3333333333333333,
        -0.16666666666666666
      ]
    },
    {
      "id": "sse",
      "label": "squared error",
      "type": "num",
      "ans": 0.16666666666666666
    }
  ]
},

A11: {
  "statement": "**A11 · Core · paper — a unique fit with many recipes.** For \\(A=\\begin{pmatrix}1&1\\\\2&2\\end{pmatrix}\\), \\(y=(1,0)\\), find the fitted vector and all least-squares coefficient vectors. Compare the free-variable-zero representative with the smallest Euclidean coefficient norm.",
  "plain": "The fitted vector is (1/5,2/5); all coefficients are (1/5−t,t). Free-variable-zero selects (1/5,0). Completing the square in (1/5−t)²+t² gives the minimum-norm pair (1/10,1/10). Neither coefficient choice changes fitted values.",
  "solution": "<p>The fitted vector is (1/5,2/5); all coefficients are (1/5−t,t). Free-variable-zero selects (1/5,0). Completing the square in (1/5−t)²+t² gives the minimum-norm pair (1/10,1/10). Neither coefficient choice changes fitted values.</p>",
  "hints": {
    "fit": "Substitute the result back into the defining equations.",
    "min": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "fit",
      "label": "fitted vector",
      "type": "vec",
      "ans": [
        0.2,
        0.4
      ]
    },
    {
      "id": "min",
      "label": "minimum-norm pair",
      "type": "vec",
      "ans": [
        0.1,
        0.1
      ]
    }
  ]
},

A12: {
  "statement": "**A12 · Stretch · paper — weighted residual sums.** Fit a constant to \\(y=(0,2)\\) with weights \\((1,3)\\). Give the weighted normal equation, the coefficient, and both the ordinary and weighted residual sums. Explain when the familiar zero-sum residual rule applies.",
  "plain": "The normal equation is 4c=6, so c=3/2 and residuals are (−3/2,1/2). The ordinary sum is −1 and the weighted sum is zero. Euclidean least squares gives ordinary zero-sum residuals if the constant vector is in the design column space; weighted least squares gives the corresponding weighted orthogonality condition.",
  "solution": "<p>The normal equation is 4c=6, so c=3/2 and residuals are (−3/2,1/2). The ordinary sum is −1 and the weighted sum is zero. Euclidean least squares gives ordinary zero-sum residuals if the constant vector is in the design column space; weighted least squares gives the corresponding weighted orthogonality condition.</p>",
  "hints": {
    "c": "Substitute the result back into the defining equations.",
    "sum": "Substitute the result back into the defining equations.",
    "weighted": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "c",
      "label": "constant",
      "type": "num",
      "ans": 1.5
    },
    {
      "id": "sum",
      "label": "ordinary residual sum",
      "type": "num",
      "ans": -1
    },
    {
      "id": "weighted",
      "label": "weighted residual sum",
      "type": "num",
      "ans": 0
    }
  ]
},

B1: {
  "statement": "**B1 · Foundation · NumPy — compute a projector by solves.** Implement a Euclidean projector from a full-column-rank basis using `np.linalg.solve`, without explicitly forming an inverse. Test a line, a plane, and a square basis; verify symmetry, idempotence, range membership, and residual orthogonality.",
  "plain": "Compute P=B@solve(B.T@B,B.T), then p=P@x and r=x−p. Assert P.T≈P, P@P≈P, p in span(B), B.T@r≈0. A square invertible B yields identity. Reject dependent columns or report numerical failure, and state tolerances. These are small normal-equation experiments, not a stable solver recommendation.",
  "solution": "<p>Compute P=B@solve(B.T@B,B.T), then p=P@x and r=x−p. Assert P.T≈P, P@P≈P, p in span(B), B.T@r≈0. A square invertible B yields identity. Reject dependent columns or report numerical failure, and state tolerances. These are small normal-equation experiments, not a stable solver recommendation.</p>"
},

B2: {
  "statement": "**B2 · Core · NumPy — change the metric deliberately.** Extend B1 to \\(P_G=B(B^{\\mathsf T}GB)^{-1}B^{\\mathsf T}G\\). Generate positive definite metrics as \\(G=H^{\\mathsf T}H+I\\). Verify metric self-adjointness and exhibit a projector that is not ordinarily symmetric.",
  "plain": "Use P=B@solve(B.T@G@B,B.T@G). Check P@P≈P, P.T@G≈G@P, and B.T@G@(x−P@x)≈0. With B=(1,1)^T and G=diag(1,4), P=[[1,4],[1,4]]/5 is not symmetric. Constructing H.T@H+I guarantees positivity because z^TGz=||Hz||²+||z||².",
  "solution": "<p>Use P=B@solve(B.T@G@B,B.T@G). Check P@P≈P, P.T@G≈G@P, and B.T@G@(x−P@x)≈0. With B=(1,1)^T and G=diag(1,4), P=[[1,4],[1,4]]/5 is not symmetric. Constructing H.T@H+I guarantees positivity because z^TGz=||Hz||²+||z||².</p>"
},

B3: {
  "statement": "**B3 · Core · NumPy — a basis change cannot change the shadow.** Choose a tall full-column-rank \\(B\\) and invertible \\(R\\). Compute projectors from \\(B\\) and \\(BR\\), check that they agree, and relate the coefficient vectors. Include a poorly scaled \\(R\\) and explain any numerical disagreement.",
  "plain": "Both bases span the same subspace, so exact projectors agree by uniqueness. If Bc=BRd, independence gives c=Rd, hence d=R^{-1}c. Ill-scaled R can worsen the Gram computation even though the geometric projector is identical. Report residuals, self-adjointness defects, and tolerances instead of treating numerical disagreement as failure of the theorem.",
  "solution": "<p>Both bases span the same subspace, so exact projectors agree by uniqueness. If Bc=BRd, independence gives c=Rd, hence d=R^{-1}c. Ill-scaled R can worsen the Gram computation even though the geometric projector is identical. Report residuals, self-adjointness defects, and tolerances instead of treating numerical disagreement as failure of the theorem.</p>"
},

B4: {
  "statement": "**B4 · Core · NumPy — check the four-subspace angles.** Construct a rank-2 \\(3\\times3\\) matrix from independent columns and one dependent column. Use Module 2 elimination to find bases for the four subspaces. Check the two Euclidean orthogonality identities, then replace the output metric by \\(G=\\operatorname{diag}(1,2,4)\\) and recompute the column-space complement.",
  "plain": "For example take A=[[1,0,1],[0,1,1],[1,1,2]]. Its image plane has normal (−1,−1,1); its kernel is span{(−1,−1,1)}. Under G, output complement solves A^TGr=0, giving r proportional to (−4,−2,1). Check basis dot-product matrices are zero for the correct metric. Reusing the old complement with the new metric is generally wrong.",
  "solution": "<p>For example take A=[[1,0,1],[0,1,1],[1,1,2]]. Its image plane has normal (−1,−1,1); its kernel is span{(−1,−1,1)}. Under G, output complement solves A^TGr=0, giving r proportional to (−4,−2,1). Check basis dot-product matrices are zero for the correct metric. Reusing the old complement with the new metric is generally wrong.</p>",
  "hints": {
    "weighted": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "weighted",
      "label": "weighted output-complement generator",
      "type": "ratio",
      "ans": [
        -4,
        -2,
        1
      ]
    }
  ]
},

B5: {
  "statement": "**B5 · Stretch · NumPy — watch the Gram matrix lose rank.** Use \\(A_\\varepsilon=\\begin{pmatrix}1&1\\\\0&\\varepsilon\\\\0&0\\end{pmatrix}\\), \\(y=(1,\\varepsilon,\\varepsilon)\\). Compare a solve of the normal equations with `np.linalg.lstsq` for several small \\(\\varepsilon\\), in float32 and float64. Report coefficients, residual norm, and the actual stored Gram entries; catch singular-solve failures explicitly.",
  "plain": "Exactly, the coefficient vector is (0,1), residual (0,0,ε), and Gram matrix [[1,1],[1,1+ε²]]. In float32 around ε=1e−4, or float64 around ε=1e−8, the final entry can round to 1 and the Gram solve can fail or lose accuracy. lstsq avoids this explicit Gram construction but still uses precision and a rank cutoff. State its cutoff and do not promise accuracy below the chosen threshold.",
  "solution": "<p>Exactly, the coefficient vector is (0,1), residual (0,0,ε), and Gram matrix [[1,1],[1,1+ε²]]. In float32 around ε=1e−4, or float64 around ε=1e−8, the final entry can round to 1 and the Gram solve can fail or lose accuracy. lstsq avoids this explicit Gram construction but still uses precision and a rank cutoff. State its cutoff and do not promise accuracy below the chosen threshold.</p>"
},

B6: {
  "statement": "**B6 · Core · NumPy — vertical is not perpendicular in the data plot.** For the fitted line \\(a+bt\\) from A10, compare each observation's vertical residual with its Euclidean perpendicular distance to that line in the \\((t,y)\\) plot. Explain why minimizing these two types of distance over lines is a different problem.",
  "plain": "For a fixed line, perpendicular distance is |y_i−a−bt_i|/sqrt(1+b²), while the vertical residual magnitude is |y_i−a−bt_i|. Since the denominator varies with the fitted slope, the objectives over lines differ. Ordinary regression holds input coordinates fixed and projects the vector of heights in observation space, not each data point onto a geometric line in the data plot.",
  "solution": "<p>For a fixed line, perpendicular distance is |y_i−a−bt_i|/sqrt(1+b²), while the vertical residual magnitude is |y_i−a−bt_i|. Since the denominator varies with the fitted slope, the objectives over lines differ. Ordinary regression holds input coordinates fixed and projects the vector of heights in observation space, not each data point onto a geometric line in the data plot.</p>"
},

B7: {
  "statement": "**B7 · Stretch · NumPy — preserve geometry while changing coordinates.** Choose invertible \\(C\\), a metric \\(G\\), and a basis \\(B\\). Transform target and basis by \\(C^{-1}\\), and use metric \\(C^{\\mathsf T}GC\\). Verify that transforming the resulting projection back recovers the original projection. Repeat incorrectly using the identity metric and exhibit disagreement.",
  "plain": "The new target is C^{-1}x, the new basis C^{-1}B, and the metric is C^TGC. The coordinate projector is C^{-1}P_G C, so mapping back by C recovers P_G x. For a counterexample choose G=I, C=diag(2,1), B=(1,1)^T, x=(2,0); raw-coordinate projection mapped back gives (2/5,2/5), while the original Euclidean projection is (1,1).",
  "solution": "<p>The new target is C^{-1}x, the new basis C^{-1}B, and the metric is C^TGC. The coordinate projector is C^{-1}P_G C, so mapping back by C recovers P_G x. For a counterexample choose G=I, C=diag(2,1), B=(1,1)^T, x=(2,0); raw-coordinate projection mapped back gives (2/5,2/5), while the original Euclidean projection is (1,1).</p>",
  "hints": {
    "wrong": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "wrong",
      "label": "incorrect mapped-back point",
      "type": "vec",
      "ans": [
        0.4,
        0.4
      ]
    }
  ]
},

B8: {
  "statement": "**B8 · Stretch · NumPy — discover the excess-error identity.** Using the plane in A6, sample 200 coefficient pairs for candidate points \\(q=Bc\\). Check \\(\\|x-q\\|^2-\\|x-p\\|^2=\\|p-q\\|^2\\). Repeat under a positive definite metric. Finally replace \\(p\\) by an oblique projection and find a candidate that beats it.",
  "plain": "The equality follows because x−p is orthogonal to p−q. Verify it within a stated scale-aware tolerance and use q=p for equality at zero excess. For the failure use Q=[[1,1],[0,0]], x=e2, p=Qx=e1, and q=0: squared errors are 2 and 1, so the oblique result is worse. Finite samples illustrate the identity; the projection theorem proves it.",
  "solution": "<p>The equality follows because x−p is orthogonal to p−q. Verify it within a stated scale-aware tolerance and use q=p for equality at zero excess. For the failure use Q=[[1,1],[0,0]], x=e2, p=Qx=e1, and q=0: squared errors are 2 and 1, so the oblique result is worse. Finite samples illustrate the identity; the projection theorem proves it.</p>"
},

C1: {
  "statement": "**C1 · Foundation · PyTorch — measure the normal-equation defect.** With `torch.manual_seed(0)` and float64, generate a full-column-rank \\(A\\in\\mathbb R^{20\\times3}\\) and \\(y\\in\\mathbb R^{20}\\). Use `torch.linalg.lstsq(A, y).solution`; report the residual and \\(A^{\\mathsf T}r\\). Compare the objective at the solution and at ten perturbed coefficient vectors.",
  "plain": "Compute w=torch.linalg.lstsq(A,y).solution, r=y−A@w. The normal-equation defect A.T@r should be near zero at numerical precision, although r itself is generally nonzero. For any h, the objective increase equals ||A@h||² in exact arithmetic. Check that identity, not just whether a few perturbed losses increase.",
  "solution": "<p>Compute w=torch.linalg.lstsq(A,y).solution, r=y−A@w. The normal-equation defect A.T@r should be near zero at numerical precision, although r itself is generally nonzero. For any h, the objective increase equals ||A@h||² in exact arithmetic. Check that identity, not just whether a few perturbed losses increase.</p>"
},

C2: {
  statement: "**C2 · Core · PyTorch — the best code for a fixed decoder.** With `torch.manual_seed(0)` and `float64`, draw a fixed decoder \\(B\\in\\mathbb R^{8\\times3}\\) and a batch of row-vector targets \\(X\\in\\mathbb R^{32\\times8}\\), both standard normal (so the columns of \\(B\\) are independent and nonorthogonal). Compare reconstruction using optimal Gram-system codes \\(C=XB(B^{\\mathsf T}B)^{-1}\\) (computed with a solve) against the naive codes `X @ B`: report the mean squared reconstruction error of each and \\(\\max|B^{\\mathsf T}(X-CB^{\\mathsf T})^{\\mathsf T}|\\). Repeat with \\(B\\) replaced by its Q factor from `torch.linalg.qr`, and explain when the naive codes would be correct.",
  plain: "Optimal codes are solve(B.T@B, B.T@X.T).T and reconstructions codes@B.T. Their per-example error is never larger than that of the naive codes X@B, and B.T@(X−reconstruction).T is zero to rounding (about 1e-15). For the random B the naive error is visibly larger, because the naive codes omit the Gram correction. After replacing B by its orthonormal Q factor, B.T@B=I and the two codes coincide to rounding. Naive codes are correct for all targets exactly when the decoder columns are orthonormal.",
  solution: "<pre><code>torch.manual_seed(0)\nB = torch.randn(8, 3, dtype=torch.float64)\nX = torch.randn(32, 8, dtype=torch.float64)\ndef report(B):\n    C_opt = torch.linalg.solve(B.T @ B, B.T @ X.T).T\n    C_naive = X @ B\n    err = lambda C: ((X - C @ B.T) ** 2).sum(dim=1).mean().item()\n    defect = (B.T @ (X - C_opt @ B.T).T).abs().max().item()\n    print(err(C_opt), err(C_naive), defect)\nreport(B)\nreport(torch.linalg.qr(B).Q)\n</code></pre><p>The optimal code of each row is the coefficient vector of its projection onto \\(C(B)\\), so its reconstruction error is the smallest possible for that row and the residual is orthogonal to every decoder column: the defect is of order \\(10^{-15}\\). The naive codes \\(XB\\) equal the optimal ones only after multiplying by \\((B^{\\mathsf T}B)^{-1}\\); for a random nonorthogonal \\(B\\) they give a clearly larger mean squared error.</p><p>With the Q factor, \\(B^{\\mathsf T}B=I_3\\), the Gram correction is the identity, and both reports agree to rounding. So naive codes are correct for every target exactly when the decoder columns are orthonormal. This is a statement about a fixed linear decoder, not about trained nonlinear autoencoders.</p>"
},

C3: {
  "statement": "**C3 · Stretch · PyTorch — erase a probe with the smallest edit.** A fixed nonzero probe reads \\(w^{\\mathsf T}h\\). Derive the edit \\(\\delta\\) of smallest \\(G\\)-norm such that \\(w^{\\mathsf T}(h+\\delta)=0\\). Implement it with a solve, verify the constraint, and compare with Euclidean erasure for \\(w=(1,1)\\), \\(h=(2,0)\\), \\(G=\\operatorname{diag}(1,4)\\).",
  "plain": "The G-orthogonal direction to ker(w^T) is G^{-1}w. Thus δ=−(w^T h)/(w^T G^{-1}w) G^{-1}w. Positivity makes the denominator positive. Solve Gz=w rather than inverting. In the fixture δ=(−8/5,−2/5) and edited activation is (2/5,−2/5); Euclidean erasure gives (1,−1). This erases that fixed linear score, not necessarily semantic information for other decoders.",
  "solution": "<p>The G-orthogonal direction to ker(w^T) is G^{-1}w. Thus δ=−(w^T h)/(w^T G^{-1}w) G^{-1}w. Positivity makes the denominator positive. Solve Gz=w rather than inverting. In the fixture δ=(−8/5,−2/5) and edited activation is (2/5,−2/5); Euclidean erasure gives (1,−1). This erases that fixed linear score, not necessarily semantic information for other decoders.</p>",
  "hints": {
    "delta": "Substitute the result back into the defining equations.",
    "edited": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "delta",
      "label": "smallest metric edit",
      "type": "vec",
      "ans": [
        -1.6,
        -0.4
      ]
    },
    {
      "id": "edited",
      "label": "edited activation",
      "type": "vec",
      "ans": [
        0.4,
        -0.4
      ]
    }
  ]
},

C4: {
  "statement": "**C4 · Core · PyTorch — weighting changes what gets fitted.** Fit a constant to float64 targets \\((0,2,10)\\), first with equal weights, then with \\((1,1,0.01)\\). Compare coefficients, ordinary squared error, and weighted squared error. Explain why a better weighted fit need not reduce ordinary error.",
  "plain": "The ordinary constant is 4. The weighted constant is (2+0.1)/(2+0.01)=70/67. Each minimizes its own objective; ordinary error is minimized at 4, so moving to 70/67 raises ordinary error while reducing the weighted objective. Weight choice changes the geometric question and needs an application-specific justification.",
  "solution": "<p>The ordinary constant is 4. The weighted constant is (2+0.1)/(2+0.01)=70/67. Each minimizes its own objective; ordinary error is minimized at 4, so moving to 70/67 raises ordinary error while reducing the weighted objective. Weight choice changes the geometric question and needs an application-specific justification.</p>",
  "hints": {
    "ordinary": "Substitute the result back into the defining equations.",
    "weighted": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "ordinary",
      "label": "ordinary constant",
      "type": "num",
      "ans": 4
    },
    {
      "id": "weighted",
      "label": "weighted constant",
      "type": "num",
      "ans": 1.044776119402985
    }
  ]
},

C5: {
  "statement": "**C5 · Core · PyTorch — fit ambiguity survives a successful solver.** Build a float64 design with two identical nonzero columns. Obtain a least-squares solution, then add multiples of \\((1,-1)\\). Check fitted values and loss, and report what the solver's particular returned coefficients do and do not establish.",
  "plain": "A(1,−1)=0, so adding t(1,−1) leaves predictions and loss unchanged for every t. A solver selects one representative, often according to a norm criterion and rank threshold; its single output does not prove coefficient identifiability. Verify residual orthogonality and the null relation explicitly.",
  "solution": "<p>A(1,−1)=0, so adding t(1,−1) leaves predictions and loss unchanged for every t. A solver selects one representative, often according to a norm criterion and rank threshold; its single output does not prove coefficient identifiability. Verify residual orthogonality and the null relation explicitly.</p>"
},

C6: {
  statement: "**C6 · Stretch · PyTorch — restrict an update to allowed directions.** A parameter update in \\(\\mathbb R^3\\) must lie in the subspace with basis \\(B=[\\,(1,0,0),\\,(0,1,1)\\,]\\). Project the proposed update \\(d=(1,2,0)\\) onto it under the Euclidean metric and under \\(G=\\operatorname{diag}(1,1,4)\\), using a solve of \\(B^{\\mathsf T}GB\\,c=B^{\\mathsf T}Gd\\). Compare the squared distances from \\(d\\) to the allowed candidates \\(q\\in\\{(1,1,1),(1,0.4,0.4),(0,0,0),(1,2,2)\\}\\) under both metrics, and check the excess-distance identity for one candidate. State precisely what this projection guarantees and what it does not say about loss improvement.",
  fields: [{"id": "pe", "label": "Euclidean projection of d", "type": "vec", "ans": [1, 1, 1]}, {"id": "pg", "label": "G-projection of d", "type": "vec", "ans": [1, 0.4, 0.4]}],
  hints: {"pe": "B^T B = diag(1,2) and B^T d = (1,2), so c = (1,1).", "pg": "B^T G B = diag(1,5) and B^T G d = (1,2), so c = (1,2/5)."},
  plain: "Euclidean: c=(1,1), projection (1,1,1), squared distance 2. Under G=diag(1,1,4): c=(1,2/5), projection (1,0.4,0.4), squared G-distance 3.2. Euclidean squared distances to the four candidates are 2, 2.72, 5, 4; G squared distances are 5, 3.2, 5, 16. Each metric's own projection wins in that metric, and every candidate's excess equals its squared distance from the projection (e.g. under G, (1,1,1) has 5 − 3.2 = 1.8 = ||(0,0.6,0.6)||_G²). The projection guarantees the closest allowed update in the chosen metric; it says nothing about loss decrease without assumptions about the objective and step size.",
  solution: "<pre><code>B = torch.tensor([[1., 0.], [0., 1.], [0., 1.]], dtype=torch.float64)\nd = torch.tensor([1., 2., 0.], dtype=torch.float64)\nfor G in (torch.eye(3, dtype=torch.float64), torch.diag(torch.tensor([1., 1., 4.], dtype=torch.float64))):\n    c = torch.linalg.solve(B.T @ G @ B, B.T @ G @ d)\n    p = B @ c\n    for q in ([1, 1, 1], [1, .4, .4], [0, 0, 0], [1, 2, 2]):\n        q = torch.tensor(q, dtype=torch.float64)\n        print(p, (d - q) @ G @ (d - q), (d - p) @ G @ (d - p) + (p - q) @ G @ (p - q))\n</code></pre><p>Euclidean: \\(B^{\\mathsf T}B=\\operatorname{diag}(1,2)\\), \\(B^{\\mathsf T}d=(1,2)\\), so \\(c=(1,1)\\), \\(p=(1,1,1)\\), residual \\((0,1,-1)\\), squared distance 2. Under \\(G\\): \\(B^{\\mathsf T}GB=\\operatorname{diag}(1,5)\\), \\(B^{\\mathsf T}Gd=(1,2)\\), so \\(c=(1,\\tfrac25)\\), \\(p_G=(1,0.4,0.4)\\), residual \\((0,1.6,-0.4)\\), squared \\(G\\)-distance \\(2.56+4(0.16)=3.2\\).</p><p>Squared distances to the candidates \\((1,1,1),(1,0.4,0.4),(0,0,0),(1,2,2)\\) are 2, 2.72, 5, 4 in the Euclidean metric and 5, 3.2, 5, 16 under \\(G\\): each metric selects a different winner, its own projection. The excess identity \\(\\|d-q\\|_G^2=\\|d-p_G\\|_G^2+\\|p_G-q\\|_G^2\\) holds for every candidate; for \\(q=(1,1,1)\\), \\(5=3.2+\\|(0,0.6,0.6)\\|_G^2=3.2+0.36+1.44\\).</p><p>The projection guarantees only that \\(p_G\\) is the unique allowed update closest to \\(d\\) in the chosen metric. Closeness to a proposed update does not by itself guarantee reduced model loss; that requires assumptions about the objective (for example a local quadratic model whose Hessian matches \\(G\\)) and the step size.</p>"
},

M1: {
  "statement": "**M1 · Foundation · mixed — three extreme subspaces.** Give the Euclidean projectors onto \\(\\{0\\}\\), all of \\(\\mathbb R^3\\), and the xy-plane. For \\(x=(1,2,3)\\), give each projected vector and residual.",
  "plain": "The projectors are 0, I3, and diag(1,1,0). Projected vectors are (0,0,0), (1,2,3), (1,2,0); residuals are (1,2,3), (0,0,0), (0,0,3). All satisfy orthogonal decomposition.",
  "solution": "<p>The projectors are 0, I3, and diag(1,1,0). Projected vectors are (0,0,0), (1,2,3), (1,2,0); residuals are (1,2,3), (0,0,0), (0,0,3). All satisfy orthogonal decomposition.</p>",
  "hints": {
    "plane": "Substitute the result back into the defining equations.",
    "residual": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "plane",
      "label": "xy-plane projection",
      "type": "vec",
      "ans": [
        1,
        2,
        0
      ]
    },
    {
      "id": "residual",
      "label": "xy-plane residual",
      "type": "vec",
      "ans": [
        0,
        0,
        3
      ]
    }
  ]
},

M2: {
  "statement": "**M2 · Core · mixed — the same subspace in two bases.** For the plane basis from A6, replace \\(B\\) by \\(BR\\), where \\(R=\\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}\\). Find the new coefficient vector for the projected point. Explain why the projector and distance do not change.",
  "plain": "Old coefficients are (1/3,1/3). Solve Rd=c: d2=1/6, d1=1/6. The basis changes recipes but not the subspace, so uniqueness of the nearest point fixes the projector and squared distance 4/3.",
  "solution": "<p>Old coefficients are (1/3,1/3). Solve Rd=c: d2=1/6, d1=1/6. The basis changes recipes but not the subspace, so uniqueness of the nearest point fixes the projector and squared distance 4/3.</p>",
  "hints": {
    "new": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "new",
      "label": "new coefficients",
      "type": "vec",
      "ans": [
        0.16666666666666666,
        0.16666666666666666
      ]
    }
  ]
},

M3: {
  "statement": "**M3 · Core · mixed — a residual with nonzero mean.** Fit \\(y=(1,0)\\) using the single design column \\(a=(1,2)\\). Give the fitted coefficient and residual. Explain why nonzero residual sum is consistent with the normal equations.",
  "plain": "The coefficient is 1/5, residual (4/5,−2/5), and its sum is 2/5. But a^T r=4/5−4/5=0. The design does not contain the constant vector, so the normal equations do not require the unweighted sum to vanish.",
  "solution": "<p>The coefficient is 1/5, residual (4/5,−2/5), and its sum is 2/5. But a^T r=4/5−4/5=0. The design does not contain the constant vector, so the normal equations do not require the unweighted sum to vanish.</p>",
  "hints": {
    "w": "Substitute the result back into the defining equations.",
    "sum": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "w",
      "label": "coefficient",
      "type": "num",
      "ans": 0.2
    },
    {
      "id": "sum",
      "label": "residual sum",
      "type": "num",
      "ans": 0.4
    }
  ]
},

M4: {
  "statement": "**M4 · Core · mixed — reverse the projector characterization.** Prove that \\(P^2=P\\) and \\(P^{\\mathsf T}G=GP\\), for positive definite \\(G\\), imply that \\(P\\) is the nearest-point map onto its range.",
  "plain": "For any x, Px belongs to range(P). Every s in the range is Py. Then <s,(I−P)x>G=y^TP^TG(I−P)x=y^TG(P−P²)x=0. Thus x=Px+(I−P)x is the orthogonal decomposition for range(P); the projection theorem supplies nearest-point optimality and uniqueness.",
  "solution": "<p>For any x, Px belongs to range(P). Every s in the range is Py. Then &lt;s,(I−P)x&gt;G=y^TP^TG(I−P)x=y^TG(P−P²)x=0. Thus x=Px+(I−P)x is the orthogonal decomposition for range(P); the projection theorem supplies nearest-point optimality and uniqueness.</p>"
},

M5: {
  "statement": "**M5 · Stretch · mixed — an angle drawn in the wrong space.** A plot shows a regression line with residual segments at right angles to that line and calls this ordinary least squares with fixed input coordinates. Diagnose the error, and draw or describe the correct two-space picture for the three observations in A10.",
  "plain": "Ordinary least squares minimizes vertical height errors at fixed inputs, not perpendicular distances in the data plot. Its orthogonality occurs in R³: the target vector splits into a fitted vector in span{(1,1,1),(0,1,2)} and a residual perpendicular to that plane. Perpendicular fitting in the data plot solves a different objective.",
  "solution": "<p>Ordinary least squares minimizes vertical height errors at fixed inputs, not perpendicular distances in the data plot. Its orthogonality occurs in R³: the target vector splits into a fitted vector in span{(1,1,1),(0,1,2)} and a residual perpendicular to that plane. Perpendicular fitting in the data plot solves a different objective.</p>"
},

M6: {
  "statement": "**M6 · Stretch · mixed — singular Gram matrix, existing projection.** Explain why singular \\(A^{\\mathsf T}A\\) does not make least-squares fitted values nonexistent or ambiguous. Give a complete argument for consistency of the normal equations and characterize all coefficient minimizers.",
  "plain": "Project y onto the finite-dimensional column space to obtain its unique nearest point p. Since p is in C(A), some w satisfies Aw=p. The residual is orthogonal to C(A), hence A^T(y−Aw)=0; the normal equations are consistent. All optimal fitted values equal p, so all coefficient minimizers form w+N(A). Only coefficient uniqueness fails.",
  "solution": "<p>Project y onto the finite-dimensional column space to obtain its unique nearest point p. Since p is in C(A), some w satisfies Aw=p. The residual is orthogonal to C(A), hence A^T(y−Aw)=0; the normal equations are consistent. All optimal fitted values equal p, so all coefficient minimizers form w+N(A). Only coefficient uniqueness fails.</p>"
},

M7: {
  "statement": "**M7 · Stretch · mixed — small normal residual, wrong coefficients.** Let \\(A=\\operatorname{diag}(1,\\varepsilon)\\), \\(y=(1,0)\\), and a reported coefficient vector be \\(\\tilde w=(1,1)\\). Compute its coefficient error, residual, and normal-equation defect. What happens as \\(\\varepsilon\\to0\\) through nonzero values?",
  "plain": "The exact solution is (1,0), so coefficient error norm is 1. Residual is (0,−ε), and A^T r=(0,−ε²). Both residual diagnostics go to zero despite a fixed coefficient error. Conditioning relates the diagnostics to forward error; small raw diagnostics alone are insufficient.",
  "solution": "<p>The exact solution is (1,0), so coefficient error norm is 1. Residual is (0,−ε), and A^T r=(0,−ε²). Both residual diagnostics go to zero despite a fixed coefficient error. Conditioning relates the diagnostics to forward error; small raw diagnostics alone are insufficient.</p>",
  "hints": {
    "error": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "error",
      "label": "coefficient error norm",
      "type": "num",
      "ans": 1
    }
  ]
},

M8: {
  "statement": "**M8 · Stretch · mixed — a degenerate metric breaks uniqueness.** Under the semidefinite form \\(G=\\operatorname{diag}(1,0)\\), approximate \\(x=(1,1)\\) by points of the y-axis. Find all minimizers and identify the exact step of the projection theorem that fails.",
  "plain": "Every y-axis point q=(0,t) has squared error (1,1−t)^TG(1,1−t)=1, so every t minimizes. The Gram matrix of basis e2 is zero, and zero squared length no longer implies a zero vector. Positive definiteness, not merely semidefiniteness, is needed for unique nearest points.",
  "solution": "<p>Every y-axis point q=(0,t) has squared error (1,1−t)^TG(1,1−t)=1, so every t minimizes. The Gram matrix of basis e2 is zero, and zero squared length no longer implies a zero vector. Positive definiteness, not merely semidefiniteness, is needed for unique nearest points.</p>",
  "hints": {
    "count": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "count",
      "label": "number of minimizers",
      "type": "choice",
      "ans": "infinitely many",
      "opts": [
        "none",
        "one",
        "infinitely many"
      ]
    }
  ]
},

K1: {
  "statement": "**K1 · Checkpoint · gate — state what the right angles assume.** State the metric behind the standard four-subspace diagram. Prove \\(C(A)^\\perp=N(A^{\\mathsf T})\\) in both directions, then give the corresponding identity for a positive definite output metric \\(G\\).",
  "plain": "The standard diagram assumes Euclidean inner products in the indicated input and output coordinates. r is orthogonal to C(A) iff it is orthogonal to each column iff A^Tr=0. Under metric G replace this equation by A^TGr=0, so C(A)^{perp_G}=N(A^TG). Do not identify output-space and input-space angles on one drawing.",
  "solution": "<p>The standard diagram assumes Euclidean inner products in the indicated input and output coordinates. r is orthogonal to C(A) iff it is orthogonal to each column iff A^Tr=0. Under metric G replace this equation by A^TGr=0, so C(A)^{perp_G}=N(A^TG). Do not identify output-space and input-space angles on one drawing.</p>"
},

K2: {
  "statement": "**K2 · Checkpoint · gate — project and certify.** Project \\((1,1,0)\\) onto the plane spanned by \\((1,0,1),(0,1,1)\\). Give the Gram system, projected point, residual, and a certificate that no other plane point is closer.",
  "plain": "The Gram system [[2,1],[1,2]]c=(1,1) gives c=(1/3,1/3). Projection is (1/3,1/3,2/3), residual (2/3,2/3,−2/3). Both generator dot products vanish. For any q in the plane, squared error is 4/3+||p−q||², so equality occurs only at p.",
  "solution": "<p>The Gram system [[2,1],[1,2]]c=(1,1) gives c=(1/3,1/3). Projection is (1/3,1/3,2/3), residual (2/3,2/3,−2/3). Both generator dot products vanish. For any q in the plane, squared error is 4/3+||p−q||², so equality occurs only at p.</p>",
  "hints": {
    "p": "Substitute the result back into the defining equations.",
    "distance": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "p",
      "label": "projected point",
      "type": "vec",
      "ans": [
        0.3333333333333333,
        0.3333333333333333,
        0.6666666666666666
      ]
    },
    {
      "id": "distance",
      "label": "squared distance",
      "type": "num",
      "ans": 1.3333333333333333
    }
  ]
},

K3: {
  "statement": "**K3 · Checkpoint · gate — derive least squares without calculus.** Derive the normal equations from orthogonal projection. Explain why they are sufficient, why fitted values are always unique, and the exact condition for coefficient uniqueness.",
  "plain": "Candidates Aw fill C(A). Its unique nearest point p has residual in N(A^T), giving A^TAw=A^Ty. Orthogonal decomposition or the perturbation identity proves sufficiency. All optimal fitted values equal p; all coefficients form w+N(A), so uniqueness holds exactly when A has full column rank.",
  "solution": "<p>Candidates Aw fill C(A). Its unique nearest point p has residual in N(A^T), giving A^TAw=A^Ty. Orthogonal decomposition or the perturbation identity proves sufficiency. All optimal fitted values equal p; all coefficients form w+N(A), so uniqueness holds exactly when A has full column rank.</p>"
},

K4: {
  "statement": "**K4 · Checkpoint · gate — change geometry honestly.** For \\(x=(2,0)\\) and \\(S=\\operatorname{span}\\{(1,1)\\}\\), compute the projection under \\(I\\) and under \\(\\operatorname{diag}(1,4)\\). Explain why neither contradicts the other and how a passive coordinate change differs.",
  "plain": "Euclidean projection is (1,1); the weighted projection is (2/5,2/5). They minimize different distances. A passive basis change preserves the same projection when the metric and operator matrices are transformed together; raw dot products of new coordinates generally introduce a new geometry.",
  "solution": "<p>Euclidean projection is (1,1); the weighted projection is (2/5,2/5). They minimize different distances. A passive basis change preserves the same projection when the metric and operator matrices are transformed together; raw dot products of new coordinates generally introduce a new geometry.</p>",
  "hints": {
    "euclidean": "Substitute the result back into the defining equations.",
    "weighted": "Substitute the result back into the defining equations."
  },
  "fields": [
    {
      "id": "euclidean",
      "label": "Euclidean point",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    },
    {
      "id": "weighted",
      "label": "weighted point",
      "type": "vec",
      "ans": [
        0.4,
        0.4
      ]
    }
  ]
},

K5: {
  "statement": "**K5 · Checkpoint · gate — reject a false projector certificate.** A program reports \\(P^2\\approx P\\) and concludes that \\(Px\\) is the nearest point in its range. Give a counterexample and state the additional identity needed for a specified positive definite metric.",
  "plain": "Q=[[1,1],[0,0]] is idempotent but Qe2=e1 is not the Euclidean nearest point on its x-axis range; zero is closer. Require P^TG=GP for G-orthogonal projection, plus idempotence. For floating-point checks report tolerances and scale; approximate identities are numerical evidence rather than an exact proof.",
  "solution": "<p>Q=[[1,1],[0,0]] is idempotent but Qe2=e1 is not the Euclidean nearest point on its x-axis range; zero is closer. Require P^TG=GP for G-orthogonal projection, plus idempotence. For floating-point checks report tolerances and scale; approximate identities are numerical evidence rather than an exact proof.</p>"
},

K6: {
  "statement": "**K6 · Checkpoint · gate — separate theory from numerical execution.** A full-column-rank design produces a singular stored Gram matrix. Explain how this can happen, why explicitly inverting that Gram matrix cannot help, and which quantities you would report before trusting a computed fit.",
  "plain": "Near-dependent columns can differ at a scale ε that becomes ε² in the Gram matrix; rounding can erase that distinction. Inversion cannot recover lost information. Report dtype, rank threshold, residual norm, normal-equation defect, conditioning diagnostics, and sensitivity under perturbations. Compare against a direct least-squares solver using QR or SVD, whose theory comes later. Coefficients may remain sensitive even with a stable solver.",
  "solution": "<p>Near-dependent columns can differ at a scale ε that becomes ε² in the Gram matrix; rounding can erase that distinction. Inversion cannot recover lost information. Report dtype, rank threshold, residual norm, normal-equation defect, conditioning diagnostics, and sensitivity under perturbations. Compare against a direct least-squares solver using QR or SVD, whose theory comes later. Coefficients may remain sensitive even with a stable solver.</p>"
},
M9: {
  "statement": "**M9 · Stretch · mixed — Compare least-squares algorithms on the same problem.** A full-column-rank design has 2-norm condition number 10⁴. What is the condition number of its Gram matrix, and why can a small fitted residual coexist with a large coefficient error?",
  "plain": "The Gram condition number is 10⁸. Near-null input directions permit large coefficient changes with small prediction changes, so residual fit does not certify coefficient accuracy.",
  "solution": "<p>The Gram condition number is 10⁸. Near-null input directions permit large coefficient changes with small prediction changes, so residual fit does not certify coefficient accuracy.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Numerical result(s), in requested order",
      "type": "num",
      "ans": 100000000.0
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
