/* Module 4: complete exercise statements and offline references. */
GU.answers("04-qr", {
A1: {
    "statement": "**A1 · Foundation · paper — coordinates and missing energy.** Let \\(q_1=(1,1,0)/\\sqrt2\\), \\(q_2=(0,0,1)\\), and \\(b=(3,1,2)\\). Find \\(Q^{\\mathsf T}b\\), the projection, the residual, and the squared residual norm.",
    "plain": "The coordinates are (2√2,2); Q times them is (2,2,2). The residual is (1,−1,0) and its squared norm is 2. Its dot product with each q is zero. The energy split is 14=12+2.",
    "solution": "<p>The coordinates are (2√2,2); Q times them is (2,2,2). The residual is (1,−1,0) and its squared norm is 2. Its dot product with each q is zero. The energy split is 14=12+2.</p>",
    "fields": [
      {
        "id": "c",
        "label": "projection coordinates",
        "type": "vec",
        "ans": [
          2.8284271247461903,
          2
        ]
      },
      {
        "id": "p",
        "label": "projected vector",
        "type": "vec",
        "ans": [
          2,
          2,
          2
        ]
      },
      {
        "id": "error",
        "label": "squared residual norm",
        "type": "num",
        "ans": 2
      }
    ],
    "hints": {
      "c": "Take one inner product with each column; reconstruct before subtracting.",
      "p": "Take one inner product with each column; reconstruct before subtracting.",
      "error": "Take one inner product with each column; reconstruct before subtracting."
    }
  },
A2: {
    "statement": "**A2 · Foundation · paper — orthogonal does not mean normalized.** For \\(Q=\\operatorname{diag}(2,3)\\), compute the maximum off-diagonal overlap and maximum diagonal error of \\(Q^{\\mathsf T}Q-I\\). Is \\(Q^{\\mathsf T}\\) an inverse?",
    "plain": "QᵀQ=diag(4,9). Off-diagonal overlap is 0 and maximum diagonal error is 8. The transpose is not an inverse: QᵀQ is not I. Pairwise perpendicular columns need not have unit length.",
    "solution": "<p>QᵀQ=diag(4,9). Off-diagonal overlap is 0 and maximum diagonal error is 8. The transpose is not an inverse: QᵀQ is not I. Pairwise perpendicular columns need not have unit length.</p>",
    "fields": [
      {
        "id": "overlap",
        "label": "off-diagonal overlap",
        "type": "num",
        "ans": 0
      },
      {
        "id": "diag",
        "label": "maximum diagonal error",
        "type": "num",
        "ans": 8
      }
    ],
    "hints": {
      "overlap": "Use the defining identities and check the result by substitution.",
      "diag": "Use the defining identities and check the result by substitution."
    }
  },
A3: {
    "statement": "**A3 · Core · paper — one complete Gram–Schmidt factorization.** Factor the matrix with columns \\((1,1,0),(1,0,1)\\) into positive-diagonal reduced QR. Show both projection and normalization steps.",
    "plain": "q1=(1,1,0)/√2. The coefficient r12=1/√2 leaves v2=(1/2,−1/2,1), whose norm is √(3/2), so q2=(1,−1,2)/√6. R has rows (√2,1/√2) and (0,√(3/2)). The dot product q1ᵀq2 is zero; both unit lengths and QR=A can be checked directly.",
    "solution": "<p>q1=(1,1,0)/√2. The coefficient r12=1/√2 leaves v2=(1/2,−1/2,1), whose norm is √(3/2), so q2=(1,−1,2)/√6. R has rows (√2,1/√2) and (0,√(3/2)). The dot product q1ᵀq2 is zero; both unit lengths and QR=A can be checked directly.</p>",
    "fields": [
      {
        "id": "v",
        "label": "second unnormalized residual",
        "type": "vec",
        "ans": [
          0.5,
          -0.5,
          1
        ]
      },
      {
        "id": "diag",
        "label": "R diagonal",
        "type": "vec",
        "ans": [
          1.4142135623730951,
          1.224744871391589
        ]
      }
    ],
    "hints": {
      "v": "Use the defining identities and check the result by substitution.",
      "diag": "Use the defining identities and check the result by substitution."
    }
  },
A4: {
    "statement": "**A4 · Core · paper — the first failed direction.** Run exact Gram–Schmidt on \\((1,0,0),(2,0,0),(0,1,0)\\). At which column does the full-column-rank algorithm stop? If a basis finder skips that column, what basis and dimension result?",
    "plain": "Column 2 leaves zero after subtracting 2e1, so the specified full-column-rank algorithm stops there. A basis finder can skip it and accept column 3, giving (e1,e2), dimension 2. Such a basis finder needs a rectangular coefficient matrix for the original three columns, not an invertible 3×3 R.",
    "solution": "<p>Column 2 leaves zero after subtracting 2e1, so the specified full-column-rank algorithm stops there. A basis finder can skip it and accept column 3, giving (e1,e2), dimension 2. Such a basis finder needs a rectangular coefficient matrix for the original three columns, not an invertible 3×3 R.</p>",
    "fields": [
      {
        "id": "stop",
        "label": "first rejected column (1-based)",
        "type": "num",
        "ans": 2
      },
      {
        "id": "dim",
        "label": "span dimension",
        "type": "num",
        "ans": 2
      }
    ],
    "hints": {
      "stop": "Use the defining identities and check the result by substitution.",
      "dim": "Use the defining identities and check the result by substitution."
    }
  },
A5: {
    "statement": "**A5 · Core · paper — the successive-span invariant.** Prove that after step \\(j\\), the first \\(j\\) columns of \\(Q\\) and \\(A\\) span the same space. Explain why independence is required for normalization.",
    "plain": "Assume the spans agree at j−1. The residual vj is aj minus a combination of earlier qi, so qj lies in the first j original columns whenever vj is nonzero. Conversely aj=Σi<j rij qi+rjj qj lies in the new span. If vj were zero, aj would be in the earlier span, contradicting independence. Orthogonality to each earlier q follows by expanding its inner product with vj.",
    "solution": "<p>Assume the spans agree at j−1. The residual vj is aj minus a combination of earlier qi, so qj lies in the first j original columns whenever vj is nonzero. Conversely aj=Σi&lt;j rij qi+rjj qj lies in the new span. If vj were zero, aj would be in the earlier span, contradicting independence. Orthogonality to each earlier q follows by expanding its inner product with vj.</p>"
  },
A6: {
    "statement": "**A6 · Core · paper — the sign convention earns uniqueness.** Prove uniqueness of full-column-rank reduced QR with positive diagonal. Exhibit the sign ambiguity when positivity is removed.",
    "plain": "The first column fixes r11=||a1||>0 and q1=a1/r11. Once earlier qi are fixed, their inner products with aj uniquely fix rij. Subtract those components: the remaining nonzero vector has a uniquely determined positive length rjj and normalized direction qj. Induction fixes every column. Without positivity, any diagonal D with ±1 entries gives (QD)(DR)=QR; those Q columns remain orthonormal.",
    "solution": "<p>The first column fixes r11=||a1||&gt;0 and q1=a1/r11. Once earlier qi are fixed, their inner products with aj uniquely fix rij. Subtract those components: the remaining nonzero vector has a uniquely determined positive length rjj and normalized direction qj. Induction fixes every column. Without positivity, any diagonal D with ±1 entries gives (QD)(DR)=QR; those Q columns remain orthonormal.</p>"
  },
A7: {
    "statement": "**A7 · Foundation · paper — back substitution is ordered.** Solve \\(Rx=c\\) for \\(R=\\begin{pmatrix}2&-1&3\\\\0&4&2\\\\0&0&5\\end{pmatrix}\\), \\(c=(9,2,10)\\), starting with the last row.",
    "plain": "The last row gives x3=2. The second gives x2=−1/2. The first then reads 2x1+1/2+6=9, so x1=5/4. Substitution recovers all three entries of c.",
    "solution": "<p>The last row gives x3=2. The second gives x2=−1/2. The first then reads 2x1+1/2+6=9, so x1=5/4. Substitution recovers all three entries of c.</p>",
    "fields": [
      {
        "id": "x",
        "label": "solution vector",
        "type": "vec",
        "ans": [
          1.25,
          -0.5,
          2
        ]
      }
    ],
    "hints": {
      "x": "Start with 5x₃=10, then substitute upwards."
    }
  },
A8: {
    "statement": "**A8 · Core · paper — why least squares reduces to R.** Derive \\(\\|b-Ax\\|^2=\\|(I-QQ^{\\mathsf T})b\\|^2+\\|Q^{\\mathsf T}b-Rx\\|^2\\). Prove uniqueness of the minimizing coefficients under the stated rank assumption.",
    "plain": "Write b−QRx=(I−QQᵀ)b+Q(Qᵀb−Rx). The first term is perpendicular to C(Q); the second belongs to it. Pythagoras applies, and Q preserves the length of the coefficient-space term. The second squared norm reaches zero at the unique solution of Rx=Qᵀb because R is triangular with nonzero diagonal. The first term is independent of x.",
    "solution": "<p>Write b−QRx=(I−QQᵀ)b+Q(Qᵀb−Rx). The first term is perpendicular to C(Q); the second belongs to it. Pythagoras applies, and Q preserves the length of the coefficient-space term. The second squared norm reaches zero at the unique solution of Rx=Qᵀb because R is triangular with nonzero diagonal. The first term is independent of x.</p>"
  },
A9: {
    "statement": "**A9 · Core · paper — complete QR has extra freedom.** Give the shapes in reduced and complete QR for a full-column-rank \\(5\\times2\\) matrix. How many complementary columns are added? Explain why positive diagonal does not make the complete \\(Q\\) unique.",
    "plain": "Reduced shapes are Q:5×2 and R:2×2. Complete shapes are Qhat:5×5 and Rhat:5×2, with three zero rows under R. Three complementary columns are added. They may be replaced by any orthonormal basis of the same complement, for example by changing one sign, without changing A. The positive-diagonal convention constrains the reduced portion only.",
    "solution": "<p>Reduced shapes are Q:5×2 and R:2×2. Complete shapes are Qhat:5×5 and Rhat:5×2, with three zero rows under R. Three complementary columns are added. They may be replaced by any orthonormal basis of the same complement, for example by changing one sign, without changing A. The positive-diagonal convention constrains the reduced portion only.</p>",
    "fields": [
      {
        "id": "extra",
        "label": "complementary columns",
        "type": "num",
        "ans": 3
      }
    ],
    "hints": {
      "extra": "Use the defining identities and check the result by substitution."
    }
  },
A10: {
    "statement": "**A10 · Stretch · paper — Gram–Schmidt with a metric.** For \\(a_1=(1,1),a_2=(1,0)\\) under \\(G=\\operatorname{diag}(1,4)\\), compute \\(q_1,q_2,R\\) with positive diagonal and verify \\(Q^{\\mathsf T}GQ=I\\).",
    "plain": "q1=(1,1)/√5 and r12=1/√5. The residual is (4/5,−1/5), with G-norm 2/√5, so q2=(2,−1/2)/√5. R has rows (√5,1/√5), (0,2/√5). The G-cross product vanishes and both G-squared norms equal 1. Ordinary dot products do not give these coordinates.",
    "solution": "<p>q1=(1,1)/√5 and r12=1/√5. The residual is (4/5,−1/5), with G-norm 2/√5, so q2=(2,−1/2)/√5. R has rows (√5,1/√5), (0,2/√5). The G-cross product vanishes and both G-squared norms equal 1. Ordinary dot products do not give these coordinates.</p>",
    "fields": [
      {
        "id": "v",
        "label": "second unnormalized residual",
        "type": "vec",
        "ans": [
          0.8,
          -0.2
        ]
      },
      {
        "id": "diag",
        "label": "positive R diagonal",
        "type": "vec",
        "ans": [
          2.23606797749979,
          0.8944271909999159
        ]
      }
    ],
    "hints": {
      "v": "Use the defining identities and check the result by substitution.",
      "diag": "Use the defining identities and check the result by substitution."
    }
  },
A11: {
    "statement": "**A11 · Stretch · paper — repairing Q without losing A.** A first orthogonalization pass leaves \\(v=a_j-\\sum_i r_{ij}q_i\\). A second pass removes \\(\\sum_i\\delta_iq_i\\). Derive the updated \\(R\\) entries and show what reconstruction error results if the first-pass coefficients are overwritten by \\(\\delta_i\\).",
    "plain": "Let w=v−Σδi qi. Then aj=Σ(rij+δi)qi+w, so accumulate the corrections. If the coefficients are replaced by δi and qj rjj=w, reconstruction becomes Σδi qi+w=aj−Σrij qi. Thus the lost first-pass projection is exactly the reconstruction error. Normalization of w changes neither this equality nor the required accumulation.",
    "solution": "<p>Let w=v−Σδi qi. Then aj=Σ(rij+δi)qi+w, so accumulate the corrections. If the coefficients are replaced by δi and qj rjj=w, reconstruction becomes Σδi qi+w=aj−Σrij qi. Thus the lost first-pass projection is exactly the reconstruction error. Normalization of w changes neither this equality nor the required accumulation.</p>"
  },
A12: {
    "statement": "**A12 · Stretch · paper — a reflection is an isometry.** Let \\(u=(1,1)/\\sqrt2\\), \\(H=I-2uu^{\\mathsf T}\\). Compute \\(H(3,1)\\). Prove \\(H^2=I\\), and identify which direction flips and which stays fixed.",
    "plain": "H has rows (0,−1),(−1,0), so H(3,1)=(−1,−3). Since uᵀu=1, expansion gives H²=I−4uuᵀ+4uuᵀuuᵀ=I. Hu=−u; for v perpendicular to u, Hv=v. Symmetry plus H²=I implies HᵀH=I.",
    "solution": "<p>H has rows (0,−1),(−1,0), so H(3,1)=(−1,−3). Since uᵀu=1, expansion gives H²=I−4uuᵀ+4uuᵀuuᵀ=I. Hu=−u; for v perpendicular to u, Hv=v. Symmetry plus H²=I implies HᵀH=I.</p>",
    "fields": [
      {
        "id": "image",
        "label": "transformed vector",
        "type": "vec",
        "ans": [
          -1,
          -3
        ]
      }
    ],
    "hints": {
      "image": "Use the defining identities and check the result by substitution."
    }
  },
B1: {
    "statement": "**B1 · Foundation · NumPy — factor shapes and signs.** Use `np.linalg.qr(A, mode=\"reduced\")` on the two-column example. Align the signs to positive diagonal, verify both factors against A3, and compare with `mode=\"complete\"`. Record shapes and errors.",
    "plain": "Use s=np.where(np.diag(R)<0,−1.,1.), Q=Q*s, R=s[:,None]*R. The reduced factors agree with A3 within rounding; shapes are (3,2) and (2,2). Complete shapes are (3,3) and (3,2). Check Q.T@Q, Q@R−A, and positive reduced diagonal separately. Do not require a particular complementary column sign.",
    "solution": "<p>Use s=np.where(np.diag(R)&lt;0,−1.,1.), Q=Q*s, R=s[:,None]*R. The reduced factors agree with A3 within rounding; shapes are (3,2) and (2,2). Complete shapes are (3,3) and (3,2). Check Q.T@Q, Q@R−A, and positive reduced diagonal separately. Do not require a particular complementary column sign.</p>"
  },
B2: {
    "statement": "**B2 · Core · NumPy — same input different arithmetic.** Implement CGS, MGS, and two-pass MGS in a chosen dtype. For the three-column fixture in section 3, sweep \\(\\varepsilon\\in\\{10^{-2},10^{-4},10^{-6},10^{-8}\\}\\) in float32 and float64, and compare with library QR. Report all three diagnostics, dtype, norm threshold, and rejected cases.",
    "plain": "Cast the input first and keep arithmetic in the selected dtype. CGS coefficients use the original column; MGS uses the current residual; reorthogonalization accumulates corrections before normalization. Audit overlap, diagonal error, and relative Frobenius reconstruction on each completed factorization, preferably with diagnostics accumulated in float64. CGS can reconstruct accurately while losing orthogonality badly; MGS improves the common fixture but is not uniformly exact. Two passes and library QR should usually improve orthogonality on resolvable cases. Exact numbers depend on operation order, dtype, and thresholds; rejected columns must be reported rather than normalized or silently dropped.",
    "solution": "<p>Cast the input first and keep arithmetic in the selected dtype. CGS coefficients use the original column; MGS uses the current residual; reorthogonalization accumulates corrections before normalization. Audit overlap, diagonal error, and relative Frobenius reconstruction on each completed factorization, preferably with diagnostics accumulated in float64. CGS can reconstruct accurately while losing orthogonality badly; MGS improves the common fixture but is not uniformly exact. Two passes and library QR should usually improve orthogonality on resolvable cases. Exact numbers depend on operation order, dtype, and thresholds; rejected columns must be reported rather than normalized or silently dropped.</p>"
  },
B3: {
    "statement": "**B3 · Core · NumPy — QR versus the Gram system.** For \\(A=\\begin{pmatrix}1&1\\\\0&10^{-8}\\end{pmatrix}\\), \\(b=(2,10^{-8})\\), compare `np.linalg.solve(A.T @ A, A.T @ b)` with QR plus `np.linalg.solve(R,Q.T@b)` in float64. Show the stored Gram matrix and compare with the exact coefficients.",
    "plain": "Exact coefficients are (1,1). The stored Gram matrix typically has four entries equal to 1 because 1+10⁻¹⁶ rounds to 1, and the Gram solve reports singularity. QR retains the original 10⁻⁸ separation and recovers approximately (1,1). Inspect actual stored entries and exceptions instead of relying only on an expected error message.",
    "solution": "<p>Exact coefficients are (1,1). The stored Gram matrix typically has four entries equal to 1 because 1+10⁻¹⁶ rounds to 1, and the Gram solve reports singularity. QR retains the original 10⁻⁸ separation and recovers approximately (1,1). Inspect actual stored entries and exceptions instead of relying only on an expected error message.</p>",
    "fields": [
      {
        "id": "x",
        "label": "exact coefficients",
        "type": "vec",
        "ans": [
          1,
          1
        ]
      }
    ],
    "hints": {
      "x": "Use the defining identities and check the result by substitution."
    }
  },
B4: {
    "statement": "**B4 · Core · NumPy — one factorization several targets.** Use the design \\(A=[\\mathbf1\\ t]\\) with \\(t=(0,1,2)\\) and target columns \\((1,2,2)\\), \\((1,3,5)\\). Factor A once, solve for both targets, and report each squared residual norm.",
    "plain": "The coefficient columns are (7/6,1/2) and (1,2); squared errors are 1/6 and 0. Compute C=Q.T@B and solve R@X=C using the same factors. Explicit residuals B−A@X should be perpendicular to both design columns. The second target is exactly in the span, up to rounding.",
    "solution": "<p>The coefficient columns are (7/6,1/2) and (1,2); squared errors are 1/6 and 0. Compute C=Q.T@B and solve R@X=C using the same factors. Explicit residuals B−A@X should be perpendicular to both design columns. The second target is exactly in the span, up to rounding.</p>",
    "fields": [
      {
        "id": "first",
        "label": "first coefficients",
        "type": "vec",
        "ans": [
          1.1666666666666667,
          0.5
        ]
      },
      {
        "id": "second",
        "label": "second coefficients",
        "type": "vec",
        "ans": [
          1,
          2
        ]
      },
      {
        "id": "errors",
        "label": "squared errors",
        "type": "vec",
        "ans": [
          0.16666666666666666,
          0
        ]
      }
    ],
    "hints": {
      "first": "Use the defining identities and check the result by substitution.",
      "second": "Use the defining identities and check the result by substitution.",
      "errors": "Use the defining identities and check the result by substitution."
    }
  },
B5: {
    "statement": "**B5 · Core · NumPy — order changes the axes.** Factor the worked example A and its reversed-column matrix with positive diagonals. Compare Q directly, then compare the projectors and their action on \\((0,0,1)\\). Explain the distinction.",
    "plain": "The first orthonormal direction follows the first supplied column, so reversing columns changes Q and R. Both completed bases span the same plane, so QQᵀ is unchanged within rounding. Projection of e3 is (1/3,−1/3,2/3). This checks a basis-invariant object rather than incorrectly demanding entrywise equality of bases.",
    "solution": "<p>The first orthonormal direction follows the first supplied column, so reversing columns changes Q and R. Both completed bases span the same plane, so QQᵀ is unchanged within rounding. Projection of e3 is (1/3,−1/3,2/3). This checks a basis-invariant object rather than incorrectly demanding entrywise equality of bases.</p>",
    "fields": [
      {
        "id": "p",
        "label": "projection of e₃",
        "type": "vec",
        "ans": [
          0.3333333333333333,
          -0.3333333333333333,
          0.6666666666666666
        ]
      }
    ],
    "hints": {
      "p": "Use the defining identities and check the result by substitution."
    }
  },
B6: {
    "statement": "**B6 · Stretch · NumPy — audit a misleading scalar.** Compute the off-diagonal defect for \\(2I_3\\), the zero \\(3\\times2\\) matrix, and an orthonormal \\(3\\times2\\) matrix. Add a second diagnostic that distinguishes their normalization. Explain why dividing by column norms is not a safe repair for all three.",
    "plain": "All three have zero off-diagonal defect. Their maximum squared-length errors are 3, 1, and 0 respectively. Normalization fixes nonzero perpendicular columns such as 2I, but division by a zero column norm is undefined and cannot create a missing direction.",
    "solution": "<p>All three have zero off-diagonal defect. Their maximum squared-length errors are 3, 1, and 0 respectively. Normalization fixes nonzero perpendicular columns such as 2I, but division by a zero column norm is undefined and cannot create a missing direction.</p>",
    "fields": [
      {
        "id": "diag",
        "label": "squared-length errors in the stated order",
        "type": "vec",
        "ans": [
          3,
          1,
          0
        ]
      }
    ],
    "hints": {
      "diag": "Use the defining identities and check the result by substitution."
    }
  },
B7: {
    "statement": "**B7 · Stretch · NumPy — sensitivity survives stable QR.** Keep A from B3 fixed and perturb only the second component of b by \\(10^{-10}\\). Solve by QR before and after. Compare the coefficient change with the target change; explain what a tiny reconstruction residual can and cannot establish.",
    "plain": "The new coefficients are (0.99,1.01), so their change is (−0.01,0.01), with norm √2·10⁻², despite a target change of only 10⁻¹⁰. Both square systems can be solved with a tiny residual. QR avoids extra error from the Gram construction, but the original map amplifies this perturbation; a tiny residual does not bound coefficient sensitivity by itself.",
    "solution": "<p>The new coefficients are (0.99,1.01), so their change is (−0.01,0.01), with norm √2·10⁻², despite a target change of only 10⁻¹⁰. Both square systems can be solved with a tiny residual. QR avoids extra error from the Gram construction, but the original map amplifies this perturbation; a tiny residual does not bound coefficient sensitivity by itself.</p>",
    "fields": [
      {
        "id": "change",
        "label": "coefficient change",
        "type": "vec",
        "ans": [
          -0.01,
          0.01
        ]
      }
    ],
    "hints": {
      "change": "Use the defining identities and check the result by substitution."
    }
  },
B8: {
    "statement": "**B8 · Stretch · NumPy — orthonormal polynomials.** In the polynomial space of degree at most two, use \\(\\langle f,g\\rangle=\\int_0^1f(t)g(t)\\,dt\\). Apply metric Gram–Schmidt to \\(1,t,t^2\\) in coefficient coordinates. Derive the Gram matrix entries analytically, then verify the computed orthonormality numerically.",
    "plain": "With coefficient order (1,t,t²), the metric entries are Gij=1/(i+j+1) for zero-based i,j. Positive-leading-coefficient Gram–Schmidt gives q1=1, q2=√12(t−1/2), q3=√180(t²−t+1/6). The residual for t² has squared norm 1/180; the norms follow by integration. A coefficient-array Euclidean dot product would produce the wrong geometry. Check Q.T@G@Q against I.",
    "solution": "<p>With coefficient order (1,t,t²), the metric entries are Gij=1/(i+j+1) for zero-based i,j. Positive-leading-coefficient Gram–Schmidt gives q1=1, q2=√12(t−1/2), q3=√180(t²−t+1/6). The residual for t² has squared norm 1/180; the norms follow by integration. A coefficient-array Euclidean dot product would produce the wrong geometry. Check Q.T@G@Q against I.</p>",
    "fields": [
      {
        "id": "norm",
        "label": "squared norm before normalizing the third polynomial",
        "type": "num",
        "ans": 0.005555555555555556
      }
    ],
    "hints": {
      "norm": "Use the defining identities and check the result by substitution."
    }
  },
C1: {
    "statement": "**C1 · Foundation · PyTorch — tall orthogonal initialization.** Create a float64 \\(5\\times3\\) tensor and apply `torch.nn.init.orthogonal_` with gain 1. Check which Gram matrix is an identity, then test length preservation for several input vectors. State the rank of the other Gram matrix.",
    "plain": "W.T@W is I3 within floating-point error. Thus ||Wx||²=xᵀWᵀWx=||x||². W@W.T is a rank-3 projector in R5 and cannot be I5. Use a fixed seed for reproducibility and report both maximum deviations and vector norm errors.",
    "solution": "<p>W.T@W is I3 within floating-point error. Thus ||Wx||²=xᵀWᵀWx=||x||². W@W.T is a rank-3 projector in R5 and cannot be I5. Use a fixed seed for reproducibility and report both maximum deviations and vector norm errors.</p>",
    "fields": [
      {
        "id": "rank",
        "label": "rank of W Wᵀ",
        "type": "num",
        "ans": 3
      }
    ],
    "hints": {
      "rank": "Use the defining identities and check the result by substitution."
    }
  },
C2: {
    "statement": "**C2 · Core · PyTorch — wide maps discard directions.** Initialize a float64 \\(3\\times5\\) W with gain 1. Check the row identity. Construct a nonzero vector in its null space using a complete QR of \\(W^{\\mathsf T}\\), and compare \\(\\|Wx\\|\\) with \\(\\|x\\|\\).",
    "plain": "W@W.T≈I3. Complete QR of W.T has five columns; its last two span N(W), so choose one as x. Its norm is approximately 1 and ||Wx|| is near zero. W.T@W is a rank-3 projector, not I5. If a routine returns only reduced Q, it does not supply the complementary columns.",
    "solution": "<p>W@W.T≈I3. Complete QR of W.T has five columns; its last two span N(W), so choose one as x. Its norm is approximately 1 and ||Wx|| is near zero. W.T@W is a rank-3 projector, not I5. If a routine returns only reduced Q, it does not supply the complementary columns.</p>",
    "fields": [
      {
        "id": "dim",
        "label": "null-space dimension",
        "type": "num",
        "ans": 2
      }
    ],
    "hints": {
      "dim": "Use the defining identities and check the result by substitution."
    }
  },
C3: {
    "statement": "**C3 · Core · PyTorch — a linear chain and its gain.** Multiply four square float64 orthogonal matrices, each initialized with gain 1. Repeat with gain 2 at every layer, using the same underlying orthogonal directions. Predict the ratio of output to input norm before computing it.",
    "plain": "The gain-1 product is orthogonal, so its norm ratio is 1. Four factors of gain 2 give W4W3W2W1=16 times an orthogonal matrix, so the norm ratio is 16 for every nonzero input. Measure matrix orthogonality after removing the overall gain, and avoid confusing length with squared length.",
    "solution": "<p>The gain-1 product is orthogonal, so its norm ratio is 1. Four factors of gain 2 give W4W3W2W1=16 times an orthogonal matrix, so the norm ratio is 16 for every nonzero input. Measure matrix orthogonality after removing the overall gain, and avoid confusing length with squared length.</p>",
    "fields": [
      {
        "id": "gain1",
        "label": "norm ratio at gain 1",
        "type": "num",
        "ans": 1
      },
      {
        "id": "gain2",
        "label": "norm ratio at gain 2",
        "type": "num",
        "ans": 16
      }
    ],
    "hints": {
      "gain1": "Use the defining identities and check the result by substitution.",
      "gain2": "Use the defining identities and check the result by substitution."
    }
  },
C4: {
    "statement": "**C4 · Core · PyTorch — nonlinearity breaks the promise.** Use \\(W=I_2\\), \\(x=(-3,4)\\), and ReLU after the linear map. Compute the input and output squared norms. Explain why this does not contradict orthogonality of W.",
    "plain": "The linear map preserves x and its squared norm 25. ReLU outputs (0,4), whose squared norm is 16. The orthogonality identity constrains W alone; the nonlinear activation can discard components.",
    "solution": "<p>The linear map preserves x and its squared norm 25. ReLU outputs (0,4), whose squared norm is 16. The orthogonality identity constrains W alone; the nonlinear activation can discard components.</p>",
    "fields": [
      {
        "id": "norms",
        "label": "input and output squared norms",
        "type": "vec",
        "ans": [
          25,
          16
        ]
      }
    ],
    "hints": {
      "norms": "Use the defining identities and check the result by substitution."
    }
  },
C5: {
    "statement": "**C5 · Stretch · PyTorch — an update leaves the constraint.** Start at \\(W=I_2\\) and apply the explicit update \\(W\\leftarrow W-0.1\\operatorname{diag}(1,0)\\). Compute \\(W^{\\mathsf T}W\\) and measure length changes along each coordinate axis. Explain why an initialization is not an ongoing constraint.",
    "plain": "The updated W=diag(0.9,1), with WᵀW=diag(0.81,1). It scales e1 length by 0.9 and leaves e2 length unchanged. Unrestricted parameter updates are not required to remain on the orthogonality constraint; imposing such a constraint would require an additional mechanism.",
    "solution": "<p>The updated W=diag(0.9,1), with WᵀW=diag(0.81,1). It scales e1 length by 0.9 and leaves e2 length unchanged. Unrestricted parameter updates are not required to remain on the orthogonality constraint; imposing such a constraint would require an additional mechanism.</p>",
    "fields": [
      {
        "id": "diag",
        "label": "diagonal of WᵀW",
        "type": "vec",
        "ans": [
          0.81,
          1
        ]
      }
    ],
    "hints": {
      "diag": "Use the defining identities and check the result by substitution."
    }
  },
C6: {
    "statement": "**C6 · Stretch · PyTorch — audit a QR solve.** In float64, solve the three-point regression example using `torch.linalg.qr(A, mode=\"reduced\")` and a triangular solve with a column-shaped right-hand side. Compare coefficients, residual orthogonality, and squared error with the derived result. Repeat in float32 and state a suitable comparison tolerance for each.",
    "plain": "Use rhs=Q.T@y[:,None], then torch.linalg.solve_triangular(R,rhs,upper=True), and flatten the coefficient column. The result is approximately (7/6,1/2), residual (−1/6,1/3,−1/6), SSE 1/6, and A.T@residual near zero. For this small benign case tolerances around 1e−12 in float64 and 1e−5 in float32 are reasonable, but report measured errors rather than treating tolerances as universal constants.",
    "solution": "<p>Use rhs=Q.T@y[:,None], then torch.linalg.solve_triangular(R,rhs,upper=True), and flatten the coefficient column. The result is approximately (7/6,1/2), residual (−1/6,1/3,−1/6), SSE 1/6, and A.T@residual near zero. For this small benign case tolerances around 1e−12 in float64 and 1e−5 in float32 are reasonable, but report measured errors rather than treating tolerances as universal constants.</p>"
  },
M1: {
    "statement": "**M1 · Core · mixed — the four subspaces through QR.** For full-column-rank \\(A\\in\\mathbb R^{5\\times3}\\), identify \\(C(A)\\), \\(N(A)\\), \\(C(A^{\\mathsf T})\\), and \\(N(A^{\\mathsf T})\\) in terms of a complete QR. Give their dimensions.",
    "plain": "C(A) is spanned by the first three columns of complete Q, dimension 3. N(A)={0}, dimension 0, because R is invertible. The row space is all R3, dimension 3. The last two complete-Q columns span N(Aᵀ), dimension 2. The first and last statements use the Euclidean orthogonal-complement identity.",
    "solution": "<p>C(A) is spanned by the first three columns of complete Q, dimension 3. N(A)={0}, dimension 0, because R is invertible. The row space is all R3, dimension 3. The last two complete-Q columns span N(Aᵀ), dimension 2. The first and last statements use the Euclidean orthogonal-complement identity.</p>",
    "fields": [
      {
        "id": "dims",
        "label": "dimensions in the requested order",
        "type": "vec",
        "ans": [
          3,
          0,
          3,
          2
        ]
      }
    ],
    "hints": {
      "dims": "Use the defining identities and check the result by substitution."
    }
  },
M2: {
    "statement": "**M2 · Core · paper — a different feature basis.** Let \\(A\\) have independent columns and \\(S\\) be invertible. Compare the least-squares fitted values for designs \\(A\\) and \\(AS\\), and derive the relation between their minimizing coefficient vectors.",
    "plain": "C(AS)=C(A), since S maps coefficient space onto itself. The projection theorem therefore gives identical fitted values and residuals. If x minimizes the problem with A, then z=S⁻¹x is the unique minimizer for AS because ASz=Ax. The QR bases themselves can differ; the projector is invariant.",
    "solution": "<p>C(AS)=C(A), since S maps coefficient space onto itself. The projection theorem therefore gives identical fitted values and residuals. If x minimizes the problem with A, then z=S⁻¹x is the unique minimizer for AS because ASz=Ax. The QR bases themselves can differ; the projector is invariant.</p>"
  },
M3: {
    "statement": "**M3 · Core · paper — the impossible shortcut.** For \\(Q=\\begin{pmatrix}1&0\\\\0&1\\\\0&0\\end{pmatrix}\\), compute \\(Q^{\\mathsf T}Q\\), \\(QQ^{\\mathsf T}\\), and the projection residual of \\((1,2,3)\\). Explain why \\(Q^{-1}\\) is invalid notation for a two-sided inverse.",
    "plain": "QᵀQ=I2; QQᵀ=diag(1,1,0). The projection is (1,2,0) and residual (0,0,3), squared norm 9. Q is not square and cannot have a two-sided inverse; its transpose is a left inverse and a coordinate extractor.",
    "solution": "<p>QᵀQ=I2; QQᵀ=diag(1,1,0). The projection is (1,2,0) and residual (0,0,3), squared norm 9. Q is not square and cannot have a two-sided inverse; its transpose is a left inverse and a coordinate extractor.</p>",
    "fields": [
      {
        "id": "r",
        "label": "residual",
        "type": "vec",
        "ans": [
          0,
          0,
          3
        ]
      },
      {
        "id": "error",
        "label": "squared residual norm",
        "type": "num",
        "ans": 9
      }
    ],
    "hints": {
      "r": "Use the defining identities and check the result by substitution.",
      "error": "Use the defining identities and check the result by substitution."
    }
  },
M4: {
    "statement": "**M4 · Stretch · mixed — a threshold is not a theorem.** Compare Gram–Schmidt acceptance of \\(I_2\\) and \\(10^{-13}I_2\\) using absolute `tol=1e-12`. State their exact ranks and explain how a scale-aware reporting policy would improve the interpretation.",
    "plain": "Both matrices have exact rank 2. The first is accepted; the second is rejected at its first residual because 10⁻¹³≤10⁻¹². Report input scale, threshold, and residual lengths, and consider a threshold proportional to an input scale when scale invariance is appropriate. Such a policy is still a numerical convention, not proof of exact dependence.",
    "solution": "<p>Both matrices have exact rank 2. The first is accepted; the second is rejected at its first residual because 10⁻¹³≤10⁻¹². Report input scale, threshold, and residual lengths, and consider a threshold proportional to an input scale when scale invariance is appropriate. Such a policy is still a numerical convention, not proof of exact dependence.</p>",
    "fields": [
      {
        "id": "ranks",
        "label": "exact ranks",
        "type": "vec",
        "ans": [
          2,
          2
        ]
      }
    ],
    "hints": {
      "ranks": "Use the defining identities and check the result by substitution."
    }
  },
M5: {
    "statement": "**M5 · Core · paper — normal equations through QR.** Derive \\(A^{\\mathsf T}A=R^{\\mathsf T}R\\). Explain why solving this system is algebraically consistent with the QR solve but discards its main numerical advantage.",
    "plain": "AᵀA=RᵀQᵀQR=RᵀR and Aᵀb=RᵀQᵀb. Since Rᵀ is invertible, the exact normal equations reduce to Rx=Qᵀb. Explicitly forming either AᵀA or RᵀR reintroduces products and additions that may hide small directions, as in the ε example. The exact equivalence does not imply numerical equivalence.",
    "solution": "<p>AᵀA=RᵀQᵀQR=RᵀR and Aᵀb=RᵀQᵀb. Since Rᵀ is invertible, the exact normal equations reduce to Rx=Qᵀb. Explicitly forming either AᵀA or RᵀR reintroduces products and additions that may hide small directions, as in the ε example. The exact equivalence does not imply numerical equivalence.</p>"
  },
M6: {
    "statement": "**M6 · Stretch · paper — weighted least squares in orthonormal coordinates.** If \\(A=QR\\), \\(Q^{\\mathsf T}GQ=I\\), and \\(G\\) is positive definite, derive the triangular system minimizing \\((b-Ax)^{\\mathsf T}G(b-Ax)\\). State the residual condition.",
    "plain": "Use the G-orthogonal projection p=QQᵀGb. The residual decomposition gives ||b−Ax||G²=||b−p||G²+||QᵀGb−Rx||², because Q is an isometry from Euclidean coefficient space into G-geometry. Solve Rx=QᵀGb. The residual satisfies QᵀGr=0 and hence AᵀGr=0. This requires nonzero R diagonals for coefficient uniqueness.",
    "solution": "<p>Use the G-orthogonal projection p=QQᵀGb. The residual decomposition gives ||b−Ax||G²=||b−p||G²+||QᵀGb−Rx||², because Q is an isometry from Euclidean coefficient space into G-geometry. Solve Rx=QᵀGb. The residual satisfies QᵀGr=0 and hence AᵀGr=0. This requires nonzero R diagonals for coefficient uniqueness.</p>"
  },
M7: {
    "statement": "**M7 · Core · mixed — duplicates survive the change of solver.** The design has two identical nonzero columns. Does replacing a normal-equations solver with the full-column-rank QR routine make the coefficient vector unique? Explain the exact geometric result and the appropriate behavior of the coding lab.",
    "plain": "No. The column space still has dimension 1, so fitted values are unique but two coefficients can trade off along the null vector (1,−1). The full-column-rank QR algorithm encounters a zero residual at column 2 and the coding lab rejects it. A rank-aware extension can represent the fit, but a choice of one coefficient vector needs a convention or extra objective.",
    "solution": "<p>No. The column space still has dimension 1, so fitted values are unique but two coefficients can trade off along the null vector (1,−1). The full-column-rank QR algorithm encounters a zero residual at column 2 and the coding lab rejects it. A rank-aware extension can represent the fit, but a choice of one coefficient vector needs a convention or extra objective.</p>"
  },
M8: {
    "statement": "**M8 · Stretch · mixed — order and measured novelty.** For columns \\(a_1=(1,0)\\), \\(a_2=(1,\\varepsilon)\\), compare the positive QR diagonals before and after reversing their order, with \\(\\varepsilon>0\\). Explain why a diagonal entry measures novelty relative to previous columns rather than a basis-independent importance score.",
    "plain": "In the original order the diagonal is (1,ε). In reversed order it is (√(1+ε²), ε/√(1+ε²)): the second value is the distance from (1,0) to the first-column line. Both span R2. Each diagonal depends on the ordered preceding span and on column scaling, so it is not an intrinsic importance score.",
    "solution": "<p>In the original order the diagonal is (1,ε). In reversed order it is (√(1+ε²), ε/√(1+ε²)): the second value is the distance from (1,0) to the first-column line. Both span R2. Each diagonal depends on the ordered preceding span and on column scaling, so it is not an intrinsic importance score.</p>"
  },
K1: {
    "statement": "**K1 · Foundation · gate — coordinates and shapes.** State reduced QR shapes for a \\(6\\times4\\) full-column-rank matrix. Give the coordinates of a projected target and the formula for its fitted value. State whether \\(QQ^{\\mathsf T}=I_6\\).",
    "plain": "Q is 6×4, R is 4×4, projected coordinates are Qᵀb in R4, and the fitted point is QQᵀb in R6. QQᵀ is a rank-4 projector, so it is not I6.",
    "solution": "<p>Q is 6×4, R is 4×4, projected coordinates are Qᵀb in R4, and the fitted point is QQᵀb in R6. QQᵀ is a rank-4 projector, so it is not I6.</p>",
    "fields": [
      {
        "id": "rank",
        "label": "rank of Q Qᵀ",
        "type": "num",
        "ans": 4
      }
    ],
    "hints": {
      "rank": "Use the defining identities and check the result by substitution."
    }
  },
K2: {
    "statement": "**K2 · Core · gate — construct and certify.** Find the positive QR of \\(A=\\begin{pmatrix}3&1\\\\0&2\\\\0&0\\end{pmatrix}\\). Project \\(b=(1,2,3)\\) and solve the least-squares problem. Check the residual against every original column.",
    "plain": "Q has columns e1,e2 and R has rows (3,1),(0,2). Qᵀb=(1,2), giving x2=1 and x1=0. The fit is (1,2,0), residual (0,0,3), SSE 9. Both original columns have third coordinate zero, so each is perpendicular to the residual.",
    "solution": "<p>Q has columns e1,e2 and R has rows (3,1),(0,2). Qᵀb=(1,2), giving x2=1 and x1=0. The fit is (1,2,0), residual (0,0,3), SSE 9. Both original columns have third coordinate zero, so each is perpendicular to the residual.</p>",
    "fields": [
      {
        "id": "x",
        "label": "least-squares coefficients",
        "type": "vec",
        "ans": [
          0,
          1
        ]
      },
      {
        "id": "sse",
        "label": "squared error",
        "type": "num",
        "ans": 9
      }
    ],
    "hints": {
      "x": "Use the defining identities and check the result by substitution.",
      "sse": "Use the defining identities and check the result by substitution."
    }
  },
K3: {
    "statement": "**K3 · Core · gate — prove the triangular solve.** Prove the QR objective split and use it to justify the unique minimizer, without forming normal equations.",
    "plain": "Decompose b into QQᵀb and its perpendicular residual. Subtract QRx only from the first component, apply Pythagoras, and use ||Qz||=||z||. The coefficient-dependent term is ||Qᵀb−Rx||², uniquely zero at the back-substitution solution since R has nonzero diagonal. The proof must explicitly mention perpendicularity and full column rank.",
    "solution": "<p>Decompose b into QQᵀb and its perpendicular residual. Subtract QRx only from the first component, apply Pythagoras, and use ||Qz||=||z||. The coefficient-dependent term is ||Qᵀb−Rx||², uniquely zero at the back-substitution solution since R has nonzero diagonal. The proof must explicitly mention perpendicularity and full column rank.</p>"
  },
K4: {
    "statement": "**K4 · Core · gate — an audit catches the wrong guarantee.** A factorization reports relative reconstruction error \\(10^{-15}\\), off-diagonal overlap \\(0.4\\), and diagonal error \\(10^{-15}\\). Is it safe to substitute \\(Q^{\\mathsf T}b\\) as orthonormal coordinates? Explain which exact step fails.",
    "plain": "No. Reconstruction and normalization pass, but QᵀQ has large off-diagonal entries. For b=Qc, Qᵀb=QᵀQc need not equal c, and QQᵀ is not established as the orthogonal projector. The near-perpendicularity condition, not merely reconstruction, is needed for the coordinate and least-squares formulas.",
    "solution": "<p>No. Reconstruction and normalization pass, but QᵀQ has large off-diagonal entries. For b=Qc, Qᵀb=QᵀQc need not equal c, and QQᵀ is not established as the orthogonal projector. The near-perpendicularity condition, not merely reconstruction, is needed for the coordinate and least-squares formulas.</p>"
  },
K5: {
    "statement": "**K5 · Stretch · gate — explain the arithmetic difference.** Explain why CGS and MGS agree exactly but can differ in floating point. Describe a reproducible comparison, including a failure case and the second-pass correction to R.",
    "plain": "Exact perpendicularity makes earlier subtractions invisible to every different qi inner product. Floating-point qi may not be perpendicular; coefficients computed against the original large column can contaminate a tiny residual. Use the section-3 fixture, fix ε, dtype and operation order, and report overlap, unit-length error and reconstruction; include an exact-dependent preset and state rejection policy. MGS is not an unconditional cure. A second pass removes new δi qi and must add δi to rij to preserve reconstruction.",
    "solution": "<p>Exact perpendicularity makes earlier subtractions invisible to every different qi inner product. Floating-point qi may not be perpendicular; coefficients computed against the original large column can contaminate a tiny residual. Use the section-3 fixture, fix ε, dtype and operation order, and report overlap, unit-length error and reconstruction; include an exact-dependent preset and state rejection policy. MGS is not an unconditional cure. A second pass removes new δi qi and must add δi to rij to preserve reconstruction.</p>"
  },
K6: {
    "statement": "**K6 · Stretch · gate — transfer to polynomials.** Under \\(\\langle f,g\\rangle=\\int_0^1fg\\), orthonormalize \\(1,t\\). Use the resulting coordinates to recover the best degree-1 approximation to \\(t^2\\), and compute its squared error.",
    "plain": "q1=1 and q2=√12(t−1/2). The coordinates of t² are 1/3 and √12(1/4−1/6)=1/√12. Reconstruction is 1/3+(t−1/2)=t−1/6. The residual t²−t+1/6 has zero inner products with 1 and t, and integrating its square gives 1/180. This is QR geometry in a function space, with the integral metric rather than the raw coefficient dot product.",
    "solution": "<p>q1=1 and q2=√12(t−1/2). The coordinates of t² are 1/3 and √12(1/4−1/6)=1/√12. Reconstruction is 1/3+(t−1/2)=t−1/6. The residual t²−t+1/6 has zero inner products with 1 and t, and integrating its square gives 1/180. This is QR geometry in a function space, with the integral metric rather than the raw coefficient dot product.</p>",
    "fields": [
      {
        "id": "c",
        "label": "constant and linear coefficients",
        "type": "vec",
        "ans": [
          -0.16666666666666666,
          1
        ]
      },
      {
        "id": "sse",
        "label": "squared error",
        "type": "num",
        "ans": 0.005555555555555556
      }
    ],
    "hints": {
      "c": "Use the defining identities and check the result by substitution.",
      "sse": "Use the defining identities and check the result by substitution."
    }
  },
M9: {
  "statement": "**M9 · Stretch · mixed — Audit QR across scales.** If Q=2I₂ and R=A/2, does exact reconstruction certify QR with orthonormal columns? Find ‖QᵀQ−I₂‖F.",
  "plain": "QR=A exactly, but QᵀQ=4I₂, so orthogonality error is ‖3I₂‖F=3√2. Reconstruction and orthogonality must be tested separately.",
  "solution": "<p>QR=A exactly, but QᵀQ=4I₂, so orthogonality error is ‖3I₂‖F=3√2. Reconstruction and orthogonality must be tested separately.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Numerical result(s), in requested order",
      "type": "num",
      "ans": 4.242640687119286
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
