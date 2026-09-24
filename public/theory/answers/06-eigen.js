/* Authored solutions and offline typed checks. */
GU.answers("06-eigen", {
A1: {
    "statement": "**A1 · Foundation · paper — three kinds of invariant line.** For \\(A=\\operatorname{diag}(2,-1,0)\\), give the eigenvalues in coordinate order and describe all three axis images. Is zero an eigenvector?",
    "plain": "The eigenvalues are 2, −1, 0. The first axis stretches, the second reverses, and the third collapses to the origin. Every coordinate axis is invariant because its image stays inside it. Zero belongs to each eigenspace but is excluded from being an eigenvector.",
    "solution": "<p>The eigenvalues are 2, −1, 0. The first axis stretches, the second reverses, and the third collapses to the origin. Every coordinate axis is invariant because its image stays inside it. Zero belongs to each eigenspace but is excluded from being an eigenvector.</p>",
    "fields": [
      {
        "id": "values",
        "label": "eigenvalues in coordinate order",
        "type": "vec",
        "ans": [
          2,
          -1,
          0
        ]
      }
    ],
    "hints": {
      "values": "Read each coordinate-vector image from the corresponding column."
    }
  },
A2: {
    "statement": "**A2 · Core · paper — a room with incoming traffic.** For \\(A=\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}\\), decide which coordinate axes are invariant. Find a different invariant line complementary to the first axis.",
    "plain": "Ae₁=2e₁, so the first axis is invariant. Ae₂=(1,3), so the second is not. Solving (A−3I)v=0 gives v=(1,1); this line is invariant and independent of e₁. The standard complement fails, but an invariant complement exists.",
    "solution": "<p>Ae₁=2e₁, so the first axis is invariant. Ae₂=(1,3), so the second is not. Solving (A−3I)v=0 gives v=(1,1); this line is invariant and independent of e₁. The standard complement fails, but an invariant complement exists.</p>"
  },
A3: {
    "statement": "**A3 · Foundation · paper — roots and null spaces.** For \\(A=\\begin{pmatrix}2&1\\\\0&1\\end{pmatrix}\\), give the monic characteristic coefficients, then one eigenvector for each root.",
    "plain": "The polynomial is t²−3t+2=(t−2)(t−1). The λ=2 eigenspace is span((1,0)); the λ=1 eigenspace is span((−1,1)). These directions are independent but not perpendicular.",
    "solution": "<p>The polynomial is t²−3t+2=(t−2)(t−1). The λ=2 eigenspace is span((1,0)); the λ=1 eigenspace is span((−1,1)). These directions are independent but not perpendicular.</p>",
    "fields": [
      {
        "id": "coeff",
        "label": "coefficients in descending powers",
        "type": "vec",
        "ans": [
          1,
          -3,
          2
        ]
      }
    ],
    "hints": {
      "coeff": "Expand det(tI−A), keeping the coefficient of t negative."
    }
  },
A4: {
    "statement": "**A4 · Core · paper — prove independence.** Prove eigenvectors belonging to pairwise distinct eigenvalues are linearly independent. Explain why this does not imply orthogonality.",
    "plain": "Assume a shortest dependence ∑cᵢvᵢ=0; all coefficients are nonzero. Applying A and subtracting λₘ times the relation leaves a shorter dependence with coefficients cᵢ(λᵢ−λₘ), all nonzero. This is impossible. Orthogonality never entered: (1,0) and (−1,1) in A3 have nonzero dot product.",
    "solution": "<p>Assume a shortest dependence ∑cᵢvᵢ=0; all coefficients are nonzero. Applying A and subtracting λₘ times the relation leaves a shorter dependence with coefficients cᵢ(λᵢ−λₘ), all nonzero. This is impossible. Orthogonality never entered: (1,0) and (−1,1) in A3 have nonzero dot product.</p>"
  },
A5: {
    "statement": "**A5 · Core · paper — compute in the hidden basis.** For A from A3 and \\(x_0=(0,1)\\), compute eigen-coordinates in the ordered basis \\((1,0),(-1,1)\\), then \\(A^3x_0\\).",
    "plain": "Solve (0,1)=c₁(1,0)+c₂(−1,1), giving c₁=c₂=1. Three applications give 8(1,0)+(−1,1)=(7,1). The inverse basis matrix, not its transpose, reads the coordinates.",
    "solution": "<p>Solve (0,1)=c₁(1,0)+c₂(−1,1), giving c₁=c₂=1. Three applications give 8(1,0)+(−1,1)=(7,1). The inverse basis matrix, not its transpose, reads the coordinates.</p>",
    "fields": [
      {
        "id": "c",
        "label": "initial eigen-coordinates",
        "type": "vec",
        "ans": [
          1,
          1
        ]
      },
      {
        "id": "x",
        "label": "A³x₀",
        "type": "vec",
        "ans": [
          7,
          1
        ]
      }
    ],
    "hints": {
      "c": "Match the second coordinate first, then the first.",
      "x": "Raise each eigenvalue to the third power before recombining."
    }
  },
A6: {
    "statement": "**A6 · Core · paper — same roots, different machines.** Compare I with \\(J=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}\\). Give the geometric multiplicity of 1 for each and \\(J^5e_2\\).",
    "plain": "Both have characteristic polynomial (t−1)², so algebraic multiplicity is 2. For I the eigenspace is all of R², dimension 2. For J it is the horizontal axis, dimension 1. Since J=I+N and N²=0, J⁵=I+5N and J⁵e₂=(5,1).",
    "solution": "<p>Both have characteristic polynomial (t−1)², so algebraic multiplicity is 2. For I the eigenspace is all of R², dimension 2. For J it is the horizontal axis, dimension 1. Since J=I+N and N²=0, J⁵=I+5N and J⁵e₂=(5,1).</p>",
    "fields": [
      {
        "id": "dims",
        "label": "geometric multiplicities for I, J",
        "type": "vec",
        "ans": [
          2,
          1
        ]
      },
      {
        "id": "x",
        "label": "J⁵e₂",
        "type": "vec",
        "ans": [
          5,
          1
        ]
      }
    ],
    "hints": {
      "dims": "Find the null spaces of I−I and J−I.",
      "x": "The off-diagonal contribution accumulates once per step."
    }
  },
A7: {
    "statement": "**A7 · Core · paper — name the field.** For \\(R=\\begin{pmatrix}0&-1\\\\1&0\\end{pmatrix}\\), decide diagonalizability over the reals and over the complex numbers. Verify a complex eigenvector directly.",
    "plain": "There are no real roots of t²+1, hence no real eigenbasis. Over C the distinct eigenvalues i and −i give independent eigenvectors (1,−i) and (1,i). For example R(1,−i)=(i,1)=i(1,−i). The real plane remains invariant.",
    "solution": "<p>There are no real roots of t²+1, hence no real eigenbasis. Over C the distinct eigenvalues i and −i give independent eigenvectors (1,−i) and (1,i). For example R(1,−i)=(i,1)=i(1,−i). The real plane remains invariant.</p>"
  },
A8: {
    "statement": "**A8 · Core · paper — stable yet initially larger.** For \\(H=\\begin{pmatrix}1/2&4\\\\0&1/2\\end{pmatrix}\\), compute \\(He_2\\), \\(H^2e_2\\), and ρ(H). Does every initial vector eventually decay?",
    "plain": "He₂=(4,1/2), H²e₂=(4,1/4), and ρ=1/2. Writing H=(1/2)I+N with N²=0 gives Hᵏ=(1/2)ᵏI+k(1/2)ᵏ⁻¹N. Both terms tend to zero, so every vector decays despite temporary amplification.",
    "solution": "<p>He₂=(4,1/2), H²e₂=(4,1/4), and ρ=1/2. Writing H=(1/2)I+N with N²=0 gives Hᵏ=(1/2)ᵏI+k(1/2)ᵏ⁻¹N. Both terms tend to zero, so every vector decays despite temporary amplification.</p>",
    "fields": [
      {
        "id": "one",
        "label": "He₂",
        "type": "vec",
        "ans": [
          4,
          0.5
        ]
      },
      {
        "id": "two",
        "label": "H²e₂",
        "type": "vec",
        "ans": [
          4,
          0.25
        ]
      },
      {
        "id": "rho",
        "label": "spectral radius",
        "type": "num",
        "ans": 0.5
      }
    ],
    "hints": {
      "one": "Read the second column.",
      "two": "Multiply H by your first result.",
      "rho": "A triangular matrix has its eigenvalues on the diagonal."
    }
  },
A9: {
    "statement": "**A9 · Core · paper — a failed stopping rule.** For \\(A=\\operatorname{diag}(-2,1)\\) and \\(x_0=(1,0)\\), compare consecutive unit-arrow distance, consecutive line distance, and eigen-residual.",
    "plain": "The unit vectors alternate e₁ and −e₁. Arrow distance is 2, while min(||xnext−x||,||xnext+x||)=0. The Rayleigh estimate is −2 and residual is 0 at every step. A stopping rule requiring arrow distance to vanish is inappropriate.",
    "solution": "<p>The unit vectors alternate e₁ and −e₁. Arrow distance is 2, while min(||xnext−x||,||xnext+x||)=0. The Rayleigh estimate is −2 and residual is 0 at every step. A stopping rule requiring arrow distance to vanish is inappropriate.</p>",
    "fields": [
      {
        "id": "d",
        "label": "arrow distance, line distance, residual",
        "type": "vec",
        "ans": [
          2,
          0,
          0
        ]
      }
    ],
    "hints": {
      "d": "An arrow reverses while its line stays the same."
    }
  },
A10: {
    "statement": "**A10 · Stretch · paper — a rotating room.** If A is real and \\(A(u+iv)=(a+ib)(u+iv)\\) with b≠0, derive the real invariant-plane block in the basis (u,v) and justify independence of u,v.",
    "plain": "Equating real and imaginary parts gives Au=au−bv and Av=bu+av, so the block columns are (a,−b) and (b,a). If u,v were dependent, the nonzero complex eigenvector would be a complex scalar times a real vector w, forcing Aw=(a+ib)w despite b≠0, impossible. The resulting real plane is invariant.",
    "solution": "<p>Equating real and imaginary parts gives Au=au−bv and Av=bu+av, so the block columns are (a,−b) and (b,a). If u,v were dependent, the nonzero complex eigenvector would be a complex scalar times a real vector w, forcing Aw=(a+ib)w despite b≠0, impossible. The resulting real plane is invariant.</p>"
  },
A11: {
    "statement": "**A11 · Core · paper — a precise 2×2 criterion.** Prove the Lab C rule: a real 2×2 matrix \\(A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}\\) is diagonalizable over the reals exactly when \\(\\Delta=(a-d)^2+4bc>0\\), or Δ=0 and A is scalar. Include the discriminant-zero case, then apply the rule to \\(\\begin{pmatrix}3&1\\\\2&2\\end{pmatrix}\\), \\(\\begin{pmatrix}1&-2\\\\1&3\\end{pmatrix}\\), and \\(\\begin{pmatrix}2&1\\\\0&2\\end{pmatrix}\\).",
    "plain": "Positive discriminant means two distinct real eigenvalues, whose eigenvectors are independent. Negative discriminant means no real eigenvalues, hence no real eigenbasis. At zero discriminant both roots are λ; any diagonalization would yield A=V(λI)V⁻¹=λI. Conversely λI is already diagonal. Applications: [[3,1],[2,2]] has Δ=1+8=9>0 and eigenvalues 4,1, so it is diagonalizable; [[1,−2],[1,3]] has Δ=4−8=−4<0 and eigenvalues 2±i, so it is not diagonalizable over the reals; [[2,1],[0,2]] has Δ=0 but is not scalar, so it is defective. This is an exact algebraic rule; floating-point proximity to zero is not exact equality.",
    "solution": "<p>Positive discriminant means two distinct real eigenvalues, whose eigenvectors are independent. Negative discriminant means no real eigenvalues, hence no real eigenbasis. At zero discriminant both roots are λ; any diagonalization would yield A=V(λI)V⁻¹=λI. Conversely λI is already diagonal. Applications: [[3,1],[2,2]] has Δ=1+8=9>0 and eigenvalues 4,1, so it is diagonalizable; [[1,−2],[1,3]] has Δ=4−8=−4<0 and eigenvalues 2±i, so it is not diagonalizable over the reals; [[2,1],[0,2]] has Δ=0 but is not scalar, so it is defective. This is an exact algebraic rule; floating-point proximity to zero is not exact equality.</p>"
  },
A12: {
    "statement": "**A12 · Stretch · paper — stable factors, unstable product.** Let \\(B=\\begin{pmatrix}0&2\\\\0&0\\end{pmatrix}\\), \\(C=\\begin{pmatrix}0&0\\\\2&0\\end{pmatrix}\\). Compute ρ(B), ρ(C), ρ(BC), and explain what this prevents you from claiming about varying recurrent derivatives.",
    "plain": "B²=C²=0, so both radii are 0. BC=diag(4,0), whose radius is 4. Alternating these two factors can grow by 4 per pair on e₁. Stability of each fixed factor does not guarantee stability of their varying product.",
    "solution": "<p>B²=C²=0, so both radii are 0. BC=diag(4,0), whose radius is 4. Alternating these two factors can grow by 4 per pair on e₁. Stability of each fixed factor does not guarantee stability of their varying product.</p>",
    "fields": [
      {
        "id": "r",
        "label": "ρ(B), ρ(C), ρ(BC)",
        "type": "vec",
        "ans": [
          0,
          0,
          4
        ]
      }
    ],
    "hints": {
      "r": "Multiply BC explicitly; a product need not inherit either factor’s eigenvalues."
    }
  },
B1: {
    "statement": "**B1 · Foundation · NumPy — verify equations, not vector signs.** Use float64 `np.linalg.eig` on A3. Check each returned pair with \\(\\|Av-\\lambda v\\|\\). Why should you not compare eigenvectors entrywise against one answer?",
    "plain": "Create A=np.array([[2,1],[0,1]],dtype=float); w,V=np.linalg.eig(A). Each column V[:,j] belongs to w[j]. Measure np.linalg.norm(A@V[:,j]−w[j]*V[:,j]) and report a tolerance such as 1e−12 for this small fixture. Signs, nonzero scaling, ordering, and complex phases can differ while representing the same eigenpair. Residual checks test the defining equation.",
    "solution": "<p>Create A=np.array([[2,1],[0,1]],dtype=float); w,V=np.linalg.eig(A). Each column V[:,j] belongs to w[j]. Measure np.linalg.norm(A@V[:,j]−w[j]*V[:,j]) and report a tolerance such as 1e−12 for this small fixture. Signs, nonzero scaling, ordering, and complex phases can differ while representing the same eigenpair. Residual checks test the defining equation.</p>"
  },
B2: {
    "statement": "**B2 · Core · NumPy — near a missing eigenvector.** For \\(J_\\varepsilon=\\begin{pmatrix}1&1\\\\\\varepsilon&1\\end{pmatrix}\\), sweep ε=1, 10⁻⁴, 10⁻⁸, 0 in float64. Measure the eigenvalue gap, eigenpair residuals, and absolute determinant of the unit eigenvector matrix. Predict the limits.",
    "plain": "For ε>0 the gap is 2√ε and normalized eigenvectors can be chosen proportional to (1,±√ε), giving |det V|=2√ε/(1+ε). The four gaps are 2, 0.02, 0.0002, 0; the determinant magnitudes are 1, about 0.019998, about 0.0002, and ideally 0. At ε=0 numerical eig may supply nearly parallel columns with small residuals. Small residuals do not establish a usable full eigenbasis or exact geometric multiplicity.",
    "solution": "<p>For ε&gt;0 the gap is 2√ε and normalized eigenvectors can be chosen proportional to (1,±√ε), giving |det V|=2√ε/(1+ε). The four gaps are 2, 0.02, 0.0002, 0; the determinant magnitudes are 1, about 0.019998, about 0.0002, and ideally 0. At ε=0 numerical eig may supply nearly parallel columns with small residuals. Small residuals do not establish a usable full eigenbasis or exact geometric multiplicity.</p>"
  },
B3: {
    "statement": "**B3 · Core · NumPy — two convergence speeds.** Run normalized iteration from (1,1) on diag(2,1) and diag(1,0.98). Compare the second-to-first coordinate magnitude ratio at k=20 and k=100. Predict before running.",
    "plain": "The ratios are 2⁻ᵏ and 0.98ᵏ, since normalization cancels in a ratio. At 20 they are about 9.536743×10⁻⁷ and 0.66760797; at 100 about 7.888609×10⁻³¹ and 0.13261956. A fixed iteration count says little without the ratio of eigenvalue magnitudes. Start with x=np.array([1.,1.]); normalize and repeat x=A@x; x/=np.linalg.norm(x).",
    "solution": "<p>The ratios are 2⁻ᵏ and 0.98ᵏ, since normalization cancels in a ratio. At 20 they are about 9.536743×10⁻⁷ and 0.66760797; at 100 about 7.888609×10⁻³¹ and 0.13261956. A fixed iteration count says little without the ratio of eigenvalue magnitudes. Start with x=np.array([1.,1.]); normalize and repeat x=A@x; x/=np.linalg.norm(x).</p>",
    "fields": [
      {
        "id": "r",
        "label": "close-preset ratio at k=100",
        "type": "num",
        "ans": 0.13261955589475294
      }
    ],
    "hints": {
      "r": "Raise 0.98 to the hundredth power; normalization does not affect the ratio."
    }
  },
B4: {
    "statement": "**B4 · Core · NumPy — record the whole transient.** For H from A8 and start e₂, record raw lengths for k=0,…,30. Find the maximizing k and compare it with ρ(H). Verify the closed-form vector for k≥1.",
    "plain": "The vector is (4k·0.5^(k−1),0.5^k). The maximum in this range occurs at k=1 with length √16.25≈4.031128874; k=2 has length √16.0625≈4.007804886. Later lengths decay to zero. The radius 0.5 predicts eventual decay but neither the peak length nor its time.",
    "solution": "<p>The vector is (4k·0.5^(k−1),0.5^k). The maximum in this range occurs at k=1 with length √16.25≈4.031128874; k=2 has length √16.0625≈4.007804886. Later lengths decay to zero. The radius 0.5 predicts eventual decay but neither the peak length nor its time.</p>",
    "fields": [
      {
        "id": "k",
        "label": "peak iteration in 0,…,30",
        "type": "num",
        "ans": 1
      }
    ],
    "hints": {
      "k": "Compare the first two vectors and then the decaying formula."
    }
  },
B5: {
    "statement": "**B5 · Stretch · NumPy — residual without dominance.** Run your Python power solver on A3 from (−1,1), then from (−1+10⁻⁴,1). Compare immediate residual convergence with a longer forced iteration and explain the role of initial eigen-coordinates.",
    "plain": "For the exact start, c₁=0 and c₂=1, so λ=1 is returned at iteration 0 with zero residual: correct eigenpair, not dominant. For the perturbed start c₁=10⁻⁴ and c₂=1. The dominant term grows like 2ᵏ10⁻⁴ and becomes comparable around k=14. A forced-iteration trace makes that transition visible. Roundoff or perturbation can supply a missing component, but the exact theorem cannot assume it.",
    "solution": "<p>For the exact start, c₁=0 and c₂=1, so λ=1 is returned at iteration 0 with zero residual: correct eigenpair, not dominant. For the perturbed start c₁=10⁻⁴ and c₂=1. The dominant term grows like 2ᵏ10⁻⁴ and becomes comparable around k=14. A forced-iteration trace makes that transition visible. Roundoff or perturbation can supply a missing component, but the exact theorem cannot assume it.</p>"
  },
B6: {
    "statement": "**B6 · Stretch · NumPy — the polynomial loses a root.** For diag(10⁸,10⁻⁸), compare the direct quadratic formula from trace and determinant with `np.linalg.eigvals`. Inspect the smaller root and its relative error; explain the subtraction.",
    "plain": "The true roots are 10⁸ and 10⁻⁸. The small root from (trace−sqrt(trace²−4det))/2 subtracts numbers near 10⁸ to recover a number near 10⁻⁸, losing relative accuracy; exact observed rounding depends on arithmetic. Report both absolute and relative error instead of demanding one machine-specific value. For this diagonal matrix eigvals can read the diagonal accurately. This illustration does not mean all matrix eigenproblems are well conditioned.",
    "solution": "<p>The true roots are 10⁸ and 10⁻⁸. The small root from (trace−sqrt(trace²−4det))/2 subtracts numbers near 10⁸ to recover a number near 10⁻⁸, losing relative accuracy; exact observed rounding depends on arithmetic. Report both absolute and relative error instead of demanding one machine-specific value. For this diagonal matrix eigvals can read the diagonal accurately. This illustration does not mean all matrix eigenproblems are well conditioned.</p>"
  },
C1: {
    "statement": "**C1 · Foundation · PyTorch — a batch of different obstructions.** Use float64 `torch.linalg.eig` on a batch containing I, J from A6, and R from A7. Check residuals in the returned complex dtype. Explain why small residuals do not prove all three returned eigenvector matrices are invertible.",
    "plain": "Build a tensor of shape (3,2,2), call w,V=torch.linalg.eig(A), and compute A.to(V.dtype)@V−V*w.unsqueeze(−2). Columns are paired with eigenvalues, so broadcasting must multiply columns. I has a full eigenspace, J is defective, and R has a complex eigenbasis. J can have two returned near-parallel approximate eigenvectors with small residuals. Residuals alone do not test independence.",
    "solution": "<p>Build a tensor of shape (3,2,2), call w,V=torch.linalg.eig(A), and compute A.to(V.dtype)@V−V*w.unsqueeze(−2). Columns are paired with eigenvalues, so broadcasting must multiply columns. I has a full eigenspace, J is defective, and R has a complex eigenbasis. J can have two returned near-parallel approximate eigenvectors with small residuals. Residuals alone do not test independence.</p>"
  },
C2: {
    "statement": "**C2 · Core · PyTorch — forward and backward recurrence.** For H from A8, propagate e₂ with H and e₁ with Hᵀ for five steps. Compare lengths at every step and explain what is special about these starts.",
    "plain": "Hᵏe₂=(4k·0.5^(k−1),0.5^k); (Hᵀ)ᵏe₁=(0.5^k,4k·0.5^(k−1)). The components are swapped, so the lengths agree at each k for these starts. Use float64 and direct multiplication. Equal spectra alone would not imply equal lengths for arbitrary chosen starts. At k=5 the vectors are (1.25,0.03125) and (0.03125,1.25).",
    "solution": "<p>Hᵏe₂=(4k·0.5^(k−1),0.5^k); (Hᵀ)ᵏe₁=(0.5^k,4k·0.5^(k−1)). The components are swapped, so the lengths agree at each k for these starts. Use float64 and direct multiplication. Equal spectra alone would not imply equal lengths for arbitrary chosen starts. At k=5 the vectors are (1.25,0.03125) and (0.03125,1.25).</p>",
    "fields": [
      {
        "id": "x",
        "label": "H⁵e₂",
        "type": "vec",
        "ans": [
          1.25,
          0.03125
        ]
      }
    ],
    "hints": {
      "x": "Use the nilpotent-part formula, with k=5."
    }
  },
C3: {
    "statement": "**C3 · Core · PyTorch — norm normalization can hide decay.** For diag(0.8,0.4), compare raw and normalized iteration from (1,1). Report raw length and normalized coordinate ratio after ten steps. Explain why a unit normalized output is not evidence against vanishing.",
    "plain": "Raw output is (0.8¹⁰,0.4¹⁰), of norm about 0.1073742336. Its second-to-first ratio is (1/2)¹⁰=1/1024, shared by the normalized output. Normalization divides away the shrinking length. Keep a raw path or accumulate logarithmic gains separately.",
    "solution": "<p>Raw output is (0.8¹⁰,0.4¹⁰), of norm about 0.1073742336. Its second-to-first ratio is (1/2)¹⁰=1/1024, shared by the normalized output. Normalization divides away the shrinking length. Keep a raw path or accumulate logarithmic gains separately.</p>",
    "fields": [
      {
        "id": "ratio",
        "label": "second-to-first magnitude ratio",
        "type": "num",
        "ans": 0.0009765625
      }
    ],
    "hints": {
      "ratio": "Divide the two scalar powers before evaluating them."
    }
  },
C4: {
    "statement": "**C4 · Stretch · PyTorch — inspect an alternating product.** Use B and C from A12. Apply C and then B repeatedly to e₁. Compare twenty individual updates with twenty repetitions of only B. State why fixed-matrix spectral reasoning cannot be applied separately to the alternating factors.",
    "plain": "One C-then-B pair acts as BC=diag(4,0). Twenty individual updates comprise ten pairs and give 4¹⁰e₁=1,048,576e₁. Repeated B sends e₁ to zero on the first update. Each factor has radius 0 but the alternating product grows. The fixed recurrence theorem applies to the pair map BC, not independently to its factors.",
    "solution": "<p>One C-then-B pair acts as BC=diag(4,0). Twenty individual updates comprise ten pairs and give 4¹⁰e₁=1,048,576e₁. Repeated B sends e₁ to zero on the first update. Each factor has radius 0 but the alternating product grows. The fixed recurrence theorem applies to the pair map BC, not independently to its factors.</p>",
    "fields": [
      {
        "id": "x",
        "label": "first coordinate after twenty alternating updates",
        "type": "num",
        "ans": 1048576
      }
    ],
    "hints": {
      "x": "Count pairs: twenty individual multiplications make ten BC factors."
    }
  },
M1: {
    "statement": "**M1 · Core · paper — projection is already spectral.** For the orthogonal projector onto span((1,1)), write P, find its two eigenspaces, and compute P¹⁰, rank(P), and det(P).",
    "plain": "P=(1/2)[[1,1],[1,1]]. Its range span((1,1)) has eigenvalue 1; its null space span((1,−1)) has eigenvalue 0. Thus P²=P and P¹⁰=P. Rank is 1 and determinant 0. Projection preserves the range and kills the orthogonal complement.",
    "solution": "<p>P=(1/2)[[1,1],[1,1]]. Its range span((1,1)) has eigenvalue 1; its null space span((1,−1)) has eigenvalue 0. Thus P²=P and P¹⁰=P. Rank is 1 and determinant 0. Projection preserves the range and kills the orthogonal complement.</p>",
    "fields": [
      {
        "id": "rd",
        "label": "rank and determinant",
        "type": "vec",
        "ans": [
          1,
          0
        ]
      }
    ],
    "hints": {
      "rd": "One direction survives and one disappears."
    }
  },
M2: {
    "statement": "**M2 · Core · paper — volume does not predict stability.** For diag(2,1/4), give determinant and spectral radius. Does shrinking every cell volume imply every vector decays?",
    "plain": "The determinant is 1/2 and radius is 2. Cell area shrinks by 1/2 each step while the first axis grows by 2 each step. Product of eigenvalues controls volume; maximum eigenvalue magnitude controls asymptotic decay of all vectors.",
    "solution": "<p>The determinant is 1/2 and radius is 2. Cell area shrinks by 1/2 each step while the first axis grows by 2 each step. Product of eigenvalues controls volume; maximum eigenvalue magnitude controls asymptotic decay of all vectors.</p>",
    "fields": [
      {
        "id": "d",
        "label": "determinant",
        "type": "num",
        "ans": 0.5
      },
      {
        "id": "r",
        "label": "spectral radius",
        "type": "num",
        "ans": 2
      }
    ],
    "hints": {
      "d": "Multiply the diagonal entries.",
      "r": "Take the largest magnitude, not the product."
    }
  },
M3: {
    "statement": "**M3 · Core · paper — an invariant plane in three dimensions.** For the 3×3 rotation-plus-stretch example in section 1, give the restriction to the xy-plane, the restriction to the z-axis, and A⁴. Is A diagonalizable over the reals?",
    "plain": "The plane restriction is [[0,−1],[1,0]], and the axis restriction is [2]. After four applications the plane returns to the identity and the axis scales by 16, so A⁴=diag(1,1,16). There is only one real eigenline, the z-axis, so no real eigenbasis. A complex eigenbasis exists.",
    "solution": "<p>The plane restriction is [[0,−1],[1,0]], and the axis restriction is [2]. After four applications the plane returns to the identity and the axis scales by 16, so A⁴=diag(1,1,16). There is only one real eigenline, the z-axis, so no real eigenbasis. A complex eigenbasis exists.</p>",
    "fields": [
      {
        "id": "diag",
        "label": "diagonal of A⁴",
        "type": "vec",
        "ans": [
          1,
          1,
          16
        ]
      }
    ],
    "hints": {
      "diag": "A quarter-turn repeated four times returns; the axial scale is 2⁴."
    }
  },
M4: {
    "statement": "**M4 · Core · paper — coordinates are not projections.** For V from section 5, compute V⁻¹(0,1) and Vᵀ(0,1). Which gives eigen-coordinates, and what condition would make the two procedures coincide for every input?",
    "plain": "The inverse gives (1,1), while the transpose gives (0,1). Only the inverse gives eigen-coordinates. Equality for every input requires V⁻¹=Vᵀ, equivalently VᵀV=I: an orthonormal basis, not merely independent or individually unit eigenvectors.",
    "solution": "<p>The inverse gives (1,1), while the transpose gives (0,1). Only the inverse gives eigen-coordinates. Equality for every input requires V⁻¹=Vᵀ, equivalently VᵀV=I: an orthonormal basis, not merely independent or individually unit eigenvectors.</p>",
    "fields": [
      {
        "id": "inv",
        "label": "inverse result",
        "type": "vec",
        "ans": [
          1,
          1
        ]
      },
      {
        "id": "transpose",
        "label": "transpose result",
        "type": "vec",
        "ans": [
          0,
          1
        ]
      }
    ],
    "hints": {
      "inv": "Solve Vc=(0,1).",
      "transpose": "Compute dot products with the columns of V."
    }
  },
M5: {
    "statement": "**M5 · Stretch · paper — invariant does not mean reducing.** For J from A6 let S=span(e₁). Show S is invariant but S⊥ is not. Prove there is no invariant complementary line at all.",
    "plain": "Je₁=e₁, while Je₂=e₁+e₂ is not in span(e₂). Any invariant line must be an eigenline; the only eigenvalue is 1 and its eigenspace is S. Therefore no other line can be an invariant complement. A linear complement always exists, but it need not be invariant.",
    "solution": "<p>Je₁=e₁, while Je₂=e₁+e₂ is not in span(e₂). Any invariant line must be an eigenline; the only eigenvalue is 1 and its eigenspace is S. Therefore no other line can be an invariant complement. A linear complement always exists, but it need not be invariant.</p>"
  },
M6: {
    "statement": "**M6 · Stretch · mixed — a residual has a precise perturbation meaning.** For a unit real vector x, let λ̂=xᵀAx and r=Ax−λ̂x. Construct a matrix perturbation E such that (A+E)x=λ̂x and compute its Frobenius norm. Does this prove λ̂ is close to a true eigenvalue of A?",
    "plain": "Take E=−rxᵀ. Since xᵀx=1, Ex=−r, giving the exact eigenpair for A+E. The sum of squares of E entries is (∑rᵢ²)(∑xⱼ²)=||r||², so ||E||F=||r||. This is a small backward perturbation certificate, not a universal forward eigenvalue-error bound; nonsymmetric eigenproblems can be sensitive.",
    "solution": "<p>Take E=−rxᵀ. Since xᵀx=1, Ex=−r, giving the exact eigenpair for A+E. The sum of squares of E entries is (∑rᵢ²)(∑xⱼ²)=||r||², so ||E||F=||r||. This is a small backward perturbation certificate, not a universal forward eigenvalue-error bound; nonsymmetric eigenproblems can be sensitive.</p>"
  },
K1: {
    "statement": "**K1 · Foundation · gate — read the rooms.** For \\(A=\\begin{pmatrix}3&1\\\\0&2\\end{pmatrix}\\), find both eigenvalues and eigenspaces, and say whether the second coordinate axis is invariant.",
    "plain": "The eigenvalues are 3 and 2. The corresponding eigenspaces are span((1,0)) and span((−1,1)). The second axis is not invariant since Ae₂=(1,2). Distinct eigenvalues give an eigenbasis, though the coordinate axes are not both eigenlines.",
    "solution": "<p>The eigenvalues are 3 and 2. The corresponding eigenspaces are span((1,0)) and span((−1,1)). The second axis is not invariant since Ae₂=(1,2). Distinct eigenvalues give an eigenbasis, though the coordinate axes are not both eigenlines.</p>",
    "fields": [
      {
        "id": "values",
        "label": "eigenvalues, largest first",
        "type": "vec",
        "ans": [
          3,
          2
        ]
      }
    ],
    "hints": {
      "values": "For a triangular matrix expand det(tI−A) along its triangular diagonal."
    }
  },
K2: {
    "statement": "**K2 · Core · gate — derive and use a diagonalization.** For A in K1, construct V and Λ, justify A=VΛV⁻¹, and compute A⁴(0,1).",
    "plain": "Choose V=[[1,−1],[0,1]], Λ=diag(3,2), V⁻¹=[[1,1],[0,1]]. The eigenvector column equations establish AV=VΛ; V is invertible. Initial eigen-coordinates are (1,1), so A⁴(0,1)=81(1,0)+16(−1,1)=(65,16).",
    "solution": "<p>Choose V=[[1,−1],[0,1]], Λ=diag(3,2), V⁻¹=[[1,1],[0,1]]. The eigenvector column equations establish AV=VΛ; V is invertible. Initial eigen-coordinates are (1,1), so A⁴(0,1)=81(1,0)+16(−1,1)=(65,16).</p>",
    "fields": [
      {
        "id": "x",
        "label": "A⁴(0,1)",
        "type": "vec",
        "ans": [
          65,
          16
        ]
      }
    ],
    "hints": {
      "x": "Raise 3 and 2 to the fourth power and recombine the eigenvectors."
    }
  },
K3: {
    "statement": "**K3 · Core · gate — diagnose the obstruction.** Compare \\(D=\\begin{pmatrix}2&1\\\\0&2\\end{pmatrix}\\) with the quarter-turn R. State each diagonalizability verdict over R and C, and derive Dᵏ for k≥1.",
    "plain": "D has a repeated eigenvalue 2 and a one-dimensional eigenspace, so it is defective over both fields. Dᵏ=2ᵏI+k2^(k−1)N, N=[[0,1],[0,0]]. R lacks real eigenvalues but has distinct complex eigenvalues ±i, so is diagonalizable over C only. The two failures over R have different causes.",
    "solution": "<p>D has a repeated eigenvalue 2 and a one-dimensional eigenspace, so it is defective over both fields. Dᵏ=2ᵏI+k2^(k−1)N, N=[[0,1],[0,0]]. R lacks real eigenvalues but has distinct complex eigenvalues ±i, so is diagonalizable over C only. The two failures over R have different causes.</p>"
  },
K4: {
    "statement": "**K4 · Core · gate — defend the stability statement.** State the exact condition for Aᵏx→0 for every x. Give a 2×2 counterexample to each claim: “ρ<1 means every step shrinks length” and “ρ=1 means powers stay bounded.”",
    "plain": "The condition is ρ(A)<1 for a fixed finite-dimensional matrix. H=[[0.5,4],[0,0.5]] has radius 0.5 but ||He₂||>4. J=[[1,1],[0,1]] has radius 1 but Jᵏe₂=(k,1) is unbounded. The proof of sufficiency in the defective case uses polynomial-times-geometric decay in Jordan blocks.",
    "solution": "<p>The condition is ρ(A)&lt;1 for a fixed finite-dimensional matrix. H=[[0.5,4],[0,0.5]] has radius 0.5 but ||He₂||&gt;4. J=[[1,1],[0,1]] has radius 1 but Jᵏe₂=(k,1) is unbounded. The proof of sufficiency in the defective case uses polynomial-times-geometric decay in Jordan blocks.</p>"
  },
K5: {
    "statement": "**K5 · Stretch · gate — audit a convergence report.** A report says “the returned vector has norm 1, its eigen-residual is below 10⁻¹⁰, and iteration stopped before 200 steps; therefore it is the dominant eigenvector and the raw recurrence does not vanish.” Refute both conclusions with one matrix and start.",
    "plain": "Take A=diag(0.8,0.4), x₀=e₂. The solver immediately returns a unit vector with zero residual and eigenvalue 0.4, even though the dominant eigenvalue is 0.8. Raw iterates are 0.4ᵏe₂ and vanish. Normalization conceals magnitude; residual convergence alone does not certify dominance.",
    "solution": "<p>Take A=diag(0.8,0.4), x₀=e₂. The solver immediately returns a unit vector with zero residual and eigenvalue 0.4, even though the dominant eigenvalue is 0.8. Raw iterates are 0.4ᵏe₂ and vanish. Normalization conceals magnitude; residual convergence alone does not certify dominance.</p>"
  },
K6: {
    "statement": "**K6 · Stretch · gate — transfer from a line to a subsystem.** Let B have independent columns and satisfy AB=BC. Prove AᵏB=BCᵏ. If ρ(C)<1, what happens to all starts in range(B)? Must ρ(A)<1? Give an example.",
    "plain": "Induct: A⁰B=B=BC⁰, and A^(k+1)B=A(BCᵏ)=(AB)Cᵏ=BC^(k+1). Thus x₀=Bc yields Aᵏx₀=BCᵏc→0 when ρ(C)<1. Nothing follows about starts outside that range. Example A=diag(2,0.5), B=e₂, C=[0.5]: every start in the second axis decays although ρ(A)=2.",
    "solution": "<p>Induct: A⁰B=B=BC⁰, and A^(k+1)B=A(BCᵏ)=(AB)Cᵏ=BC^(k+1). Thus x₀=Bc yields Aᵏx₀=BCᵏc→0 when ρ(C)&lt;1. Nothing follows about starts outside that range. Example A=diag(2,0.5), B=e₂, C=[0.5]: every start in the second axis decays although ρ(A)=2.</p>"
  },
M7: {
  "statement": "**M7 · Stretch · mixed — A residual measures a local eigenpair claim.** For [[1,10⁶],[10⁻⁶,1]], compute its two eigenvalues and compare them with those before adding the lower-left entry.",
  "plain": "The characteristic equation is (1−λ)²−1=0, so the new eigenvalues are 0 and 2. The original pair was 1,1. The perturbation has norm 10⁻⁶ but moves the eigenvalues by one.",
  "solution": "<p>The characteristic equation is (1−λ)²−1=0, so the new eigenvalues are 0 and 2. The original pair was 1,1. The perturbation has norm 10⁻⁶ but moves the eigenvalues by one.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Numerical result(s), in requested order",
      "type": "vec",
      "ans": [
        0,
        2
      ]
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
