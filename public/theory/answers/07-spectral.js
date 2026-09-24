/* Authored solutions and offline typed checks. */
GU.answers("07-spectral", {
A1: {
  "statement": "**A1 · Foundation · paper — reciprocal entries.** For A=[[2,1],[1,3]], u=(1,0), and v=(0,1), compute uᵀAv and (Au)ᵀv. State the property these measurements illustrate.",
  "plain": "Both measurements are 1. Symmetry makes moving A across a real dot product leave the value unchanged.",
  "solution": "<p>Both measurements are 1. Symmetry makes moving A across a real dot product leave the value unchanged.</p>",
  "fields": [
    {
      "id": "values",
      "label": "uᵀAv, (Au)ᵀv",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    }
  ],
  "hints": {
    "values": "Read the two off-diagonal entries."
  }
},
A2: {
  "statement": "**A2 · Core · paper — two rooms stay separate.** Prove that the orthogonal complement of an invariant subspace of a real symmetric matrix is invariant. Identify the step that fails for a nonsymmetric matrix.",
  "plain": "Take x∈S⊥ and s∈S. Then sᵀAx=(As)ᵀx=0, since As∈S. Thus Ax is orthogonal to every s and belongs to S⊥. Without symmetry, moving A across the dot product produces Aᵀs rather than As; invariance under A supplies no claim about Aᵀs.",
  "solution": "<p>Take x∈S⊥ and s∈S. Then sᵀAx=(As)ᵀx=0, since As∈S. Thus Ax is orthogonal to every s and belongs to S⊥. Without symmetry, moving A across the dot product produces Aᵀs rather than As; invariance under A supplies no claim about Aᵀs.</p>"
},
A3: {
  "statement": "**A3 · Core · paper — diagonalize a landscape.** For A=[[2,1],[1,2]], use q₁=(1,−1)/√2 and q₂=(1,1)/√2. Give the eigenvalues in that order, the eigen-coordinates of x=(2,0), and xᵀAx.",
  "plain": "Aq₁=q₁ and Aq₂=3q₂, with orthonormal q₁,q₂. Qᵀ(2,0)=(√2,√2). Hence xᵀAx=1·2+3·2=8, also obtained from Ax=(4,2).",
  "solution": "<p>Aq₁=q₁ and Aq₂=3q₂, with orthonormal q₁,q₂. Qᵀ(2,0)=(√2,√2). Hence xᵀAx=1·2+3·2=8, also obtained from Ax=(4,2).</p>",
  "fields": [
    {
      "id": "eigen",
      "label": "eigenvalues in supplied order",
      "type": "vec",
      "ans": [
        1,
        3
      ]
    },
    {
      "id": "coords",
      "label": "eigen-coordinates",
      "type": "vec",
      "ans": [
        1.4142135623730951,
        1.4142135623730951
      ]
    },
    {
      "id": "value",
      "label": "xᵀAx",
      "type": "num",
      "ans": 8
    }
  ],
  "hints": {
    "eigen": "Multiply each supplied direction by A.",
    "coords": "Take dot products with the normalized axes.",
    "value": "Sum λᵢyᵢ²."
  }
},
A4: {
  "statement": "**A4 · Core · paper — weighted votes.** For A=diag(1,3) and x=(1,2), compute R_A(x) and the squared residual of the normalized vector. Is R_A(x) an eigenvalue?",
  "plain": "The normalized coordinates are (1,2)/√5, so the weights are 1/5 and 4/5. R=13/5=2.6, which is neither eigenvalue. The squared residual is (1/5)(1−2.6)²+(4/5)(3−2.6)²=16/25=0.64.",
  "solution": "<p>The normalized coordinates are (1,2)/√5, so the weights are 1/5 and 4/5. R=13/5=2.6, which is neither eigenvalue. The squared residual is (1/5)(1−2.6)²+(4/5)(3−2.6)²=16/25=0.64.</p>",
  "fields": [
    {
      "id": "r",
      "label": "Rayleigh quotient",
      "type": "num",
      "ans": 2.6
    },
    {
      "id": "res",
      "label": "squared residual for the unit vector",
      "type": "num",
      "ans": 0.64
    }
  ],
  "hints": {
    "r": "Divide the quadratic value 13 by squared length 5.",
    "res": "Use the eigenvalue variance identity with squared-coordinate weights."
  }
},
A5: {
  "statement": "**A5 · Core · paper — zero height is not zero image.** For A=diag(1,−1) and x=(1,1), compute xᵀAx and Ax. State an additional hypothesis under which zero quadratic value would imply zero image, and prove it.",
  "plain": "The quadratic value is 0, but Ax=(1,−1) is nonzero. Symmetric PSD is sufficient for the stronger implication: in an orthonormal eigenbasis, 0=∑λᵢyᵢ² is a sum of nonnegative terms, forcing λᵢyᵢ=0 for every i. Therefore Ax=0. The saddle permits cancellation between positive and negative terms.",
  "solution": "<p>The quadratic value is 0, but Ax=(1,−1) is nonzero. Symmetric PSD is sufficient for the stronger implication: in an orthonormal eigenbasis, 0=∑λᵢyᵢ² is a sum of nonnegative terms, forcing λᵢyᵢ=0 for every i. Therefore Ax=0. The saddle permits cancellation between positive and negative terms.</p>",
  "fields": [
    {
      "id": "q",
      "label": "quadratic value",
      "type": "num",
      "ans": 0
    },
    {
      "id": "image",
      "label": "Ax",
      "type": "vec",
      "ans": [
        1,
        -1
      ]
    }
  ],
  "hints": {
    "q": "Subtract the two coordinate squares.",
    "image": "Apply the signs of the diagonal to the coordinates."
  }
},
A6: {
  "statement": "**A6 · Foundation · paper — read the contour radii.** For A=diag(1,9), give the positive intercepts of xᵀAx=1 on the two coordinate axes. Which axis has greater stiffness?",
  "plain": "The positive intercepts are (1,0) and (0,1/3), so the radii in coordinate order are 1 and 1/3. The second axis is stiffer: its eigenvalue 9 charges more quadratic value for the same squared displacement.",
  "solution": "<p>The positive intercepts are (1,0) and (0,1/3), so the radii in coordinate order are 1 and 1/3. The second axis is stiffer: its eigenvalue 9 charges more quadratic value for the same squared displacement.</p>",
  "fields": [
    {
      "id": "radii",
      "label": "radii in coordinate order",
      "type": "vec",
      "ans": [
        1,
        0.3333333333333333
      ]
    }
  ],
  "hints": {
    "radii": "Solve λᵢt²=1 separately on each axis."
  }
},
A7: {
  "statement": "**A7 · Core · paper — a determinant trap.** Give one symmetric 2×2 matrix with positive determinant that is not PD, and one with positive diagonal entries that is indefinite. Explain why each shortcut fails.",
  "plain": "For −I₂ the determinant is 1 but every nonzero quadratic value is negative. A determinant is only the product of eigenvalues. For [[1,2],[2,1]] both diagonal entries are positive, but x=(1,−1) gives quadratic value −2 while x=(1,1) gives 6; the form is indefinite. Diagonal entries test only the coordinate axes.",
  "solution": "<p>For −I₂ the determinant is 1 but every nonzero quadratic value is negative. A determinant is only the product of eigenvalues. For [[1,2],[2,1]] both diagonal entries are positive, but x=(1,−1) gives quadratic value −2 while x=(1,1) gives 6; the form is indefinite. Diagonal entries test only the coordinate axes.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — complete the squares.** Compute the Cholesky pivots and lower-triangular factor for A=[[4,2],[2,3]]. Verify its product and express xᵀAx as a sum of two squares.",
  "plain": "The pivots are 4 and 3−(2/2)²=2. L=[[2,0],[1,√2]], and LLᵀ=[[4,2],[2,1+2]]=A. Since Lᵀx=(2x₁+x₂,√2x₂), the form is (2x₁+x₂)²+2x₂².",
  "solution": "<p>The pivots are 4 and 3−(2/2)²=2. L=[[2,0],[1,√2]], and LLᵀ=[[4,2],[2,1+2]]=A. Since Lᵀx=(2x₁+x₂,√2x₂), the form is (2x₁+x₂)²+2x₂².</p>",
  "fields": [
    {
      "id": "p",
      "label": "pivots",
      "type": "vec",
      "ans": [
        4,
        2
      ]
    },
    {
      "id": "l",
      "label": "L entries row by row",
      "type": "vec",
      "ans": [
        2,
        0,
        1,
        1.4142135623730951
      ]
    }
  ],
  "hints": {
    "p": "Subtract the already constructed factor entry squared.",
    "l": "Choose positive diagonal square roots and a zero upper triangle."
  }
},
A9: {
  "statement": "**A9 · Core · paper — invisible skew.** Find the symmetric part of A=[[1,4],[0,1]]. Give its ascending eigenvalues and evaluate xᵀAx at x=(1,−1). Why do A's own eigenvalues not classify this quadratic form?",
  "plain": "The symmetric part is [[1,2],[2,1]], with ascending eigenvalues −1,3. For x=(1,−1), Ax=(−3,−1), and xᵀAx=−2. The original triangular matrix has eigenvalues 1,1, but it is nonsymmetric, so its eigenvalues do not give an orthogonal squared-coordinate decomposition of its quadratic form.",
  "solution": "<p>The symmetric part is [[1,2],[2,1]], with ascending eigenvalues −1,3. For x=(1,−1), Ax=(−3,−1), and xᵀAx=−2. The original triangular matrix has eigenvalues 1,1, but it is nonsymmetric, so its eigenvalues do not give an orthogonal squared-coordinate decomposition of its quadratic form.</p>",
  "fields": [
    {
      "id": "eig",
      "label": "ascending eigenvalues of the symmetric part",
      "type": "vec",
      "ans": [
        -1,
        3
      ]
    },
    {
      "id": "q",
      "label": "xᵀAx",
      "type": "num",
      "ans": -2
    }
  ],
  "hints": {
    "eig": "Average the two off-diagonal entries, then test the sum and difference directions.",
    "q": "Multiply by the original A and take the dot product."
  }
},
A10: {
  "statement": "**A10 · Stretch · paper — the middle eigenvalue without a polynomial.** For A=diag(1,4,9), prove min over all planes S of max over nonzero x in S of R_A(x)=4. Supply a plane attaining the minimum.",
  "plain": "Any plane S intersects span(e₂,e₃) nontrivially, since 2+2>3. Such an intersection vector has Rayleigh quotient at least 4, so max on S is at least 4. The plane span(e₁,e₂) has all quotients between 1 and 4 and attains 4 at e₂. Thus the minimum of these maxima is exactly 4.",
  "solution": "<p>Any plane S intersects span(e₂,e₃) nontrivially, since 2+2&gt;3. Such an intersection vector has Rayleigh quotient at least 4, so max on S is at least 4. The plane span(e₁,e₂) has all quotients between 1 and 4 and attains 4 at e₂. Thus the minimum of these maxima is exactly 4.</p>",
  "fields": [
    {
      "id": "value",
      "label": "min–max value",
      "type": "num",
      "ans": 4
    }
  ],
  "hints": {
    "value": "Use the dimension inequality, then exhibit a plane that attains the bound."
  }
},
A11: {
  "statement": "**A11 · Stretch · paper — existence before orthogonality.** Reconstruct the spectral theorem's maximum-on-the-sphere proof. Explain why proving distinct eigenvectors are orthogonal is not already a proof of the theorem.",
  "plain": "Continuity and compactness give a unit maximizer q of xᵀAx. For unit v⊥q, evaluating at (q+tv)/√(1+t²) yields 2t vᵀAq+t²(vᵀAv−λ)≤0 for both signs of small t. Therefore vᵀAq=0 and Aq=λq. Symmetry makes q⊥ invariant; in an orthonormal basis the restriction is symmetric. Induct on dimension, joining q to that restriction’s orthonormal eigenbasis. The column equations give A=QΛQᵀ. Distinct-eigenvector orthogonality does not prove that eigenvectors exist or fill repeated eigenspaces.",
  "solution": "<p>Continuity and compactness give a unit maximizer q of xᵀAx. For unit v⊥q, evaluating at (q+tv)/√(1+t²) yields 2t vᵀAq+t²(vᵀAv−λ)≤0 for both signs of small t. Therefore vᵀAq=0 and Aq=λq. Symmetry makes q⊥ invariant; in an orthonormal basis the restriction is symmetric. Induct on dimension, joining q to that restriction’s orthonormal eigenbasis. The column equations give A=QΛQᵀ. Distinct-eigenvector orthogonality does not prove that eigenvectors exist or fill repeated eigenspaces.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — same inertia, different spectrum.** Let A=I₂ and T=diag(2,1). Compute TᵀAT and T⁻¹AT. Explain which describes a transformed quadratic form and why its eigenvalues can change without its inertia changing.",
  "plain": "Congruence gives TᵀAT=diag(4,1); similarity gives T⁻¹AT=I₂. Substituting x=Ty in xᵀAx gives the congruence matrix. It rescales lengths in coordinates, so eigenvalues can change. Both forms have inertia (2 positive, 0 negative, 0 zero): invertible substitution preserves dimensions of positive and negative subspaces.",
  "solution": "<p>Congruence gives TᵀAT=diag(4,1); similarity gives T⁻¹AT=I₂. Substituting x=Ty in xᵀAx gives the congruence matrix. It rescales lengths in coordinates, so eigenvalues can change. Both forms have inertia (2 positive, 0 negative, 0 zero): invertible substitution preserves dimensions of positive and negative subspaces.</p>",
  "fields": [
    {
      "id": "congruence",
      "label": "diagonal of TᵀAT",
      "type": "vec",
      "ans": [
        4,
        1
      ]
    },
    {
      "id": "similarity",
      "label": "diagonal of T⁻¹AT",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    }
  ],
  "hints": {
    "congruence": "The form transforms with a transpose on the left.",
    "similarity": "An operator changes basis with an inverse on the left."
  }
},
B1: {
  "statement": "**B1 · Foundation · NumPy — audit the factorization.** Use `np.linalg.eigh` on [[2,1],[1,2]]. Report ascending eigenvalues, ‖AQ−QΛ‖, ‖QᵀQ−I‖, and ‖A−QΛQᵀ‖. Explain what each residual checks.",
  "plain": "The ascending eigenvalues are 1 and 3. Compute residual norms from A@Q−Q@diag(values), Q.T@Q−I, and A−Q@diag(values)@Q.T. They should be close to float64 roundoff for this small matrix, not necessarily exactly zero. The first checks eigenpair equations, the second orthonormality, and the third reconstruction. Eigenvector signs may differ without affecting these tests.",
  "solution": "<p>The ascending eigenvalues are 1 and 3. Compute residual norms from A@Q−Q@diag(values), Q.T@Q−I, and A−Q@diag(values)@Q.T. They should be close to float64 roundoff for this small matrix, not necessarily exactly zero. The first checks eigenpair equations, the second orthonormality, and the third reconstruction. Eigenvector signs may differ without affecting these tests.</p>",
  "fields": [
    {
      "id": "eigen",
      "label": "ascending eigenvalues",
      "type": "vec",
      "ans": [
        1,
        3
      ]
    }
  ],
  "hints": {
    "eigen": "Compare equations instead of the signs of eigenvector entries."
  }
},
B2: {
  "statement": "**B2 · Core · NumPy — a sweep is evidence.** Sample 721 equally spaced angles over one full turn for A=[[2,1],[1,2]]. Compare sampled Rayleigh extrema with eigenvalues; compute every eigen-coordinate weight. Repeat after rotating A by an arbitrary angle and explain why the sampled extrema need not be exact.",
  "plain": "Use v=(cos φ,sin φ) and evaluate vᵀAv. Eigen-coordinates y=Qᵀv give weights yᵢ², whose sum is 1. For this unrotated fixture the angle grid includes the two eigenlines, so extrema are 1 and 3 up to roundoff. An arbitrary rotation moves the true extremizing angles off the grid: the sampled minimum can exceed 1 and the sampled maximum can fall below 3. A dense scan is evidence; the spectral theorem certifies the full bounds.",
  "solution": "<p>Use v=(cos φ,sin φ) and evaluate vᵀAv. Eigen-coordinates y=Qᵀv give weights yᵢ², whose sum is 1. For this unrotated fixture the angle grid includes the two eigenlines, so extrema are 1 and 3 up to roundoff. An arbitrary rotation moves the true extremizing angles off the grid: the sampled minimum can exceed 1 and the sampled maximum can fall below 3. A dense scan is evidence; the spectral theorem certifies the full bounds.</p>",
  "fields": [
    {
      "id": "bounds",
      "label": "true minimum and maximum",
      "type": "vec",
      "ans": [
        1,
        3
      ]
    }
  ],
  "hints": {
    "bounds": "The extrema occur at the two orthogonal eigenlines; check whether your angle grid contains them."
  }
},
B3: {
  "statement": "**B3 · Core · NumPy — test the threshold's meaning.** At tol=10⁻¹², compare your Cholesky acceptance on 10⁻¹⁴I₂, diag(1,10⁻¹⁴), [[1,1],[1,1]], and [[1,2],[2,1]]. Compare with library Cholesky and actual eigenvalues. Explain any different decisions without calling every rejection indefinite.",
  "plain": "Our test accepts 10⁻¹⁴I because its cutoff is 10⁻²⁶, then rejects diag(1,10⁻¹⁴) at cutoff 10⁻¹², rejects the singular PSD matrix on a zero pivot, and rejects the indefinite matrix on a negative pivot. Their eigenvalues are respectively (10⁻¹⁴,10⁻¹⁴), (10⁻¹⁴,1), (0,2), and (−1,3). Library Cholesky normally accepts the first two for these representable diagonal fixtures; its acceptance policy need not include our relative cutoff. Only the last matrix is indefinite. Record actual diagnostics and reconstruction errors.",
  "solution": "<p>Our test accepts 10⁻¹⁴I because its cutoff is 10⁻²⁶, then rejects diag(1,10⁻¹⁴) at cutoff 10⁻¹², rejects the singular PSD matrix on a zero pivot, and rejects the indefinite matrix on a negative pivot. Their eigenvalues are respectively (10⁻¹⁴,10⁻¹⁴), (10⁻¹⁴,1), (0,2), and (−1,3). Library Cholesky normally accepts the first two for these representable diagonal fixtures; its acceptance policy need not include our relative cutoff. Only the last matrix is indefinite. Record actual diagnostics and reconstruction errors.</p>",
  "fields": [
    {
      "id": "accepted",
      "label": "accepted=1, rejected=0 in fixture order",
      "type": "vec",
      "ans": [
        1,
        0,
        0,
        0
      ]
    }
  ],
  "hints": {
    "accepted": "Compute the maximum entry and each pivot separately for each matrix."
  }
},
B4: {
  "statement": "**B4 · Core · NumPy — covariance has a forced null direction.** Center the rows of X=[[1,0,2],[0,1,2],[1,1,4]]. Form C=XᵀX/3 after centering. Give its rank and one exact nonzero null direction. Verify that the Rayleigh maximum equals its largest eigenvalue.",
  "plain": "After centering, C=(1/9)[[2,−1,2],[−1,2,2],[2,2,8]]. Its eigenvalues are 0,1/3,1, so rank is 2. The exact direction (−2,−2,1) is null because the third original column is twice the sum of the first two; centering preserves that relation. The top unit eigenvector (1,1,4)/√18 has Rayleigh quotient 1, the largest possible.",
  "solution": "<p>After centering, C=(1/9)[[2,−1,2],[−1,2,2],[2,2,8]]. Its eigenvalues are 0,1/3,1, so rank is 2. The exact direction (−2,−2,1) is null because the third original column is twice the sum of the first two; centering preserves that relation. The top unit eigenvector (1,1,4)/√18 has Rayleigh quotient 1, the largest possible.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "rank",
      "type": "num",
      "ans": 2
    },
    {
      "id": "eig",
      "label": "ascending eigenvalues",
      "type": "vec",
      "ans": [
        0,
        0.3333333333333333,
        1
      ]
    }
  ],
  "hints": {
    "rank": "Use the exact relation between columns, and note the two centered independent columns.",
    "eig": "Test the null direction, the difference direction, and their orthogonal complement."
  }
},
B5: {
  "statement": "**B5 · Stretch · NumPy — positive diagonal can hide a saddle.** For the 3×3 matrix with diagonal 1 and all off-diagonal entries 2, compute the ascending eigenvalues, determinant, and first two leading principal minors. Refute the rule “positive diagonal and determinant imply PD in every dimension.”",
  "plain": "A=2·11ᵀ−I has eigenvalue 5 on span((1,1,1)) and eigenvalue −1 on its orthogonal plane. Thus ascending values are −1,−1,5 and determinant 5. The first two leading minors are 1 and −3. The positive diagonal and determinant hide two negative directions.",
  "solution": "<p>A=2·11ᵀ−I has eigenvalue 5 on span((1,1,1)) and eigenvalue −1 on its orthogonal plane. Thus ascending values are −1,−1,5 and determinant 5. The first two leading minors are 1 and −3. The positive diagonal and determinant hide two negative directions.</p>",
  "fields": [
    {
      "id": "eig",
      "label": "ascending eigenvalues",
      "type": "vec",
      "ans": [
        -1,
        -1,
        5
      ]
    },
    {
      "id": "det",
      "label": "determinant",
      "type": "num",
      "ans": 5
    },
    {
      "id": "minor",
      "label": "first two leading principal minors",
      "type": "vec",
      "ans": [
        1,
        -3
      ]
    }
  ],
  "hints": {
    "eig": "Apply the matrix to the all-ones vector and to vectors whose entries sum to zero.",
    "det": "Multiply eigenvalues including both negative signs.",
    "minor": "The second leading block is [[1,2],[2,1]]."
  }
},
C1: {
  "statement": "**C1 · Foundation · PyTorch — a batch of landscapes.** In float64, use `torch.linalg.eigh` on a batch containing diag(1,3), diag(1,0), diag(1,−1), and the zero matrix. Classify each from all its eigenvalue signs; explain why a zero eigenvalue is not itself evidence of a saddle.",
  "plain": "The four matrices are PD; PSD and singular; indefinite; and the zero form, which is both PSD and negative semidefinite. Their spectra are (1,3), (0,1), (−1,1), and (0,0). A saddle needs both positive and negative eigenvalues for this quadratic classification; a zero eigenvalue alone supplies a flat direction.",
  "solution": "<p>The four matrices are PD; PSD and singular; indefinite; and the zero form, which is both PSD and negative semidefinite. Their spectra are (1,3), (0,1), (−1,1), and (0,0). A saddle needs both positive and negative eigenvalues for this quadratic classification; a zero eigenvalue alone supplies a flat direction.</p>"
},
C2: {
  "statement": "**C2 · Core · PyTorch — flat or tilted.** For A=diag(2,0), evaluate f(x)=½xᵀAx−bᵀx along x=(1,t), t=−10,0,10. Compare b=(2,0) and b=(2,1). Report both sequences and interpret the set of minimizers or absence of a lower bound.",
  "plain": "On (1,t), the first function is −1 for every t. Its minimizers are all (1,t). The second is −1−t, giving 9,−1,−11 at t=−10,0,10, and tends to −∞ as t→+∞. The Hessian is the same PSD matrix, but the linear term tilts its null direction.",
  "solution": "<p>On (1,t), the first function is −1 for every t. Its minimizers are all (1,t). The second is −1−t, giving 9,−1,−11 at t=−10,0,10, and tends to −∞ as t→+∞. The Hessian is the same PSD matrix, but the linear term tilts its null direction.</p>",
  "fields": [
    {
      "id": "flat",
      "label": "values for b=(2,0)",
      "type": "vec",
      "ans": [
        -1,
        -1,
        -1
      ]
    },
    {
      "id": "tilt",
      "label": "values for b=(2,1)",
      "type": "vec",
      "ans": [
        9,
        -1,
        -11
      ]
    }
  ],
  "hints": {
    "flat": "Complete x₁²−2x₁ and set x₁=1.",
    "tilt": "Include the term −x₂."
  }
},
C3: {
  "statement": "**C3 · Core · PyTorch — shifts change the model.** For A=[[1,2],[2,1]], compare the eigenvalues after adding αI for α=0,1,1.1. Find the strict condition on α for PD, and explain why equality at the boundary is insufficient.",
  "plain": "The shifted spectra are (−1,3), (0,4), and (0.1,4.1). Positive definiteness requires α>1. At α=1 the smallest eigenvalue is zero, so the form is PSD but singular. Shifting repairs this quadratic model by changing it; it does not certify the original A.",
  "solution": "<p>The shifted spectra are (−1,3), (0,4), and (0.1,4.1). Positive definiteness requires α&gt;1. At α=1 the smallest eigenvalue is zero, so the form is PSD but singular. Shifting repairs this quadratic model by changing it; it does not certify the original A.</p>",
  "fields": [
    {
      "id": "spectra",
      "label": "eigenvalues for α=0,1,1.1 in order",
      "type": "vec",
      "ans": [
        -1,
        3,
        0,
        4,
        0.1,
        4.1
      ]
    }
  ],
  "hints": {
    "spectra": "The same eigenvectors remain; add α to every eigenvalue."
  }
},
C4: {
  "statement": "**C4 · Stretch · PyTorch — repeated axes are not identifiable.** For A=diag(1,1,4), rotate the first two columns of an orthonormal eigenbasis by angle 0.37. Verify both eigenbases, then compare their first columns and the projectors onto their first two columns. What should a regression test compare?",
  "plain": "Take Q=I and Q̃ with the 2×2 rotation [[cos .37,−sin .37],[sin .37,cos .37]] in its upper-left block. Both are orthogonal and satisfy AQ=Q diag(1,1,4). Their first columns differ, but the first-two-column projectors are both diag(1,1,0). Compare eigenpair residuals, orthogonality, reconstruction, and the repeated-eigenspace projector. Comparing a particular first eigenvector overstates its identifiability.",
  "solution": "<p>Take Q=I and Q̃ with the 2×2 rotation [[cos .37,−sin .37],[sin .37,cos .37]] in its upper-left block. Both are orthogonal and satisfy AQ=Q diag(1,1,4). Their first columns differ, but the first-two-column projectors are both diag(1,1,0). Compare eigenpair residuals, orthogonality, reconstruction, and the repeated-eigenspace projector. Comparing a particular first eigenvector overstates its identifiability.</p>"
},
M1: {
  "statement": "**M1 · Core · paper — projection already knows the theorem.** Let P be the orthogonal projector onto span((1,1)). Give its matrix and ascending eigenvalues. Express xᵀPx as a squared length; classify I−P and identify its null space.",
  "plain": "P=(1/2)[[1,1],[1,1]] has eigenvalues 0 and 1. Since PᵀP=P, xᵀPx=‖Px‖². I−P is a symmetric orthogonal projector and therefore PSD, singular, with null space span((1,1)).",
  "solution": "<p>P=(1/2)[[1,1],[1,1]] has eigenvalues 0 and 1. Since PᵀP=P, xᵀPx=‖Px‖². I−P is a symmetric orthogonal projector and therefore PSD, singular, with null space span((1,1)).</p>",
  "fields": [
    {
      "id": "eig",
      "label": "ascending eigenvalues of P",
      "type": "vec",
      "ans": [
        0,
        1
      ]
    }
  ],
  "hints": {
    "eig": "A projector fixes its range and kills its orthogonal complement."
  }
},
M2: {
  "statement": "**M2 · Core · paper — QR predicts Cholesky.** If X has independent columns and thin QR factorization X=QR with positive diagonal R, prove XᵀX=RᵀR. Which matrix is the Cholesky factor? Explain why this identity is not an instruction to solve least squares through normal equations.",
  "plain": "XᵀX=RᵀQᵀQR=RᵀR because thin Q has orthonormal columns. Rᵀ is lower triangular with positive diagonal, so uniqueness makes it the Cholesky factor of the Gram matrix. This exact identity does not make forming XᵀX a stable least-squares strategy: Gram formation can lose information in nearly dependent columns, and its spectral condition number squares that of X. QR works directly with the original columns; the full conditioning account comes in Module 9.",
  "solution": "<p>XᵀX=RᵀQᵀQR=RᵀR because thin Q has orthonormal columns. Rᵀ is lower triangular with positive diagonal, so uniqueness makes it the Cholesky factor of the Gram matrix. This exact identity does not make forming XᵀX a stable least-squares strategy: Gram formation can lose information in nearly dependent columns, and its spectral condition number squares that of X. QR works directly with the original columns; the full conditioning account comes in Module 9.</p>"
},
M3: {
  "statement": "**M3 · Core · paper — solve a bowl.** For A=[[4,2],[2,3]] and b=(6,5), use two triangular solves to find the minimizer of ½xᵀAx−bᵀx. Give the minimum value and prove uniqueness without differentiation.",
  "plain": "L=[[2,0],[1,√2]]. Solve Lz=b: z₁=3 and z₂=√2. Solve Lᵀx=z: x₂=1 and x₁=1. Thus x★=(1,1) and f(x★)=−bᵀx★/2=−11/2. Expanding gives f(x)−f(x★)=½(x−x★)ᵀA(x−x★)>0 for every different x, proving uniqueness.",
  "solution": "<p>L=[[2,0],[1,√2]]. Solve Lz=b: z₁=3 and z₂=√2. Solve Lᵀx=z: x₂=1 and x₁=1. Thus x★=(1,1) and f(x★)=−bᵀx★/2=−11/2. Expanding gives f(x)−f(x★)=½(x−x★)ᵀA(x−x★)&gt;0 for every different x, proving uniqueness.</p>",
  "fields": [
    {
      "id": "x",
      "label": "minimizer",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    },
    {
      "id": "f",
      "label": "minimum value",
      "type": "num",
      "ans": -5.5
    }
  ],
  "hints": {
    "x": "Solve the lower system first and the transpose system second.",
    "f": "At the stationary solution Ax=b, the two quadratic/linear contributions combine to −bᵀx/2."
  }
},
M4: {
  "statement": "**M4 · Core · paper — recurrence with symmetry.** For symmetric A with all eigenvalues of magnitude at most 0.8, prove ‖Aᵏx‖≤0.8ᵏ‖x‖. Explain why the transient amplification from Module 6 cannot occur under this hypothesis.",
  "plain": "In an orthonormal eigenbasis x=∑yᵢqᵢ, ‖Aᵏx‖²=∑λᵢ²ᵏyᵢ²≤0.8²ᵏ∑yᵢ² for k≥0. Taking square roots yields the bound. There are no nonorthogonal eigenvector cancellations to unravel and cause temporary growth; in fact every application contracts norm by at most 0.8.",
  "solution": "<p>In an orthonormal eigenbasis x=∑yᵢqᵢ, ‖Aᵏx‖²=∑λᵢ²ᵏyᵢ²≤0.8²ᵏ∑yᵢ² for k≥0. Taking square roots yields the bound. There are no nonorthogonal eigenvector cancellations to unravel and cause temporary growth; in fact every application contracts norm by at most 0.8.</p>"
},
M5: {
  "statement": "**M5 · Stretch · paper — a metric changes symmetry's entry test.** Let G be symmetric PD and GA=AᵀG. Prove B=G¹ᐟ²AG⁻¹ᐟ² is symmetric, deduce real eigenvalues for A, and explain how to choose its eigenvectors G-orthonormally.",
  "plain": "Let S=G¹ᐟ², so S is symmetric and invertible. GA=AᵀG gives Aᵀ=S²AS⁻². Then Bᵀ=S⁻¹AᵀS=SAS⁻¹=B. Diagonalize B=QΛQᵀ with orthonormal Q. A=S⁻¹QΛQᵀS has real eigenvalues and eigenvector matrix V=S⁻¹Q. Finally VᵀGV=QᵀS⁻¹S²S⁻¹Q=I, so its columns are G-orthonormal.",
  "solution": "<p>Let S=G¹ᐟ², so S is symmetric and invertible. GA=AᵀG gives Aᵀ=S²AS⁻². Then Bᵀ=S⁻¹AᵀS=SAS⁻¹=B. Diagonalize B=QΛQᵀ with orthonormal Q. A=S⁻¹QΛQᵀS has real eigenvalues and eigenvector matrix V=S⁻¹Q. Finally VᵀGV=QᵀS⁻¹S²S⁻¹Q=I, so its columns are G-orthonormal.</p>"
},
M6: {
  "statement": "**M6 · Stretch · mixed — a covariance audit.** A centered dataset has five observations and eight features. A report claims its empirical covariance has eight strictly positive eigenvalues, “because every feature has nonzero variance.” Give the largest possible rank and smallest possible nullity, and explain what to inspect in the report.",
  "plain": "The centered rows sum to zero, so rank(X)≤4. The Gram covariance has the same null space as X, hence rank at most 4 and nullity at least 8−4=4. Positive feature variances only ensure positive diagonal entries. Inspect centering, dimensions, diagonal regularization/shifts, whether a population covariance was substituted, and the scale of reported tiny eigenvalues relative to roundoff. Exact rank bounds cannot be overturned by rounded positive numbers.",
  "solution": "<p>The centered rows sum to zero, so rank(X)≤4. The Gram covariance has the same null space as X, hence rank at most 4 and nullity at least 8−4=4. Positive feature variances only ensure positive diagonal entries. Inspect centering, dimensions, diagonal regularization/shifts, whether a population covariance was substituted, and the scale of reported tiny eigenvalues relative to roundoff. Exact rank bounds cannot be overturned by rounded positive numbers.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "largest possible rank",
      "type": "num",
      "ans": 4
    },
    {
      "id": "null",
      "label": "smallest possible nullity",
      "type": "num",
      "ans": 4
    }
  ],
  "hints": {
    "rank": "Centering costs at least one dimension among five observation rows.",
    "null": "Use eight columns and rank–nullity."
  }
},
K1: {
  "statement": "**K1 · Foundation · gate — read the axes.** For A=[[3,1],[1,3]], give ascending eigenvalues, one orthonormal eigenbasis, and the long and short semiaxis lengths of xᵀAx=1. Explain the inverse relation between radius and eigenvalue.",
  "plain": "The ascending eigenvalues are 2 and 4, with q₁=(1,−1)/√2 and q₂=(1,1)/√2. The unit-level ellipse has long semiaxis 1/√2 along q₁ and short semiaxis 1/2 along q₂. On an eigenline λᵢt²=1, so a larger eigenvalue reaches the same height with a shorter displacement.",
  "solution": "<p>The ascending eigenvalues are 2 and 4, with q₁=(1,−1)/√2 and q₂=(1,1)/√2. The unit-level ellipse has long semiaxis 1/√2 along q₁ and short semiaxis 1/2 along q₂. On an eigenline λᵢt²=1, so a larger eigenvalue reaches the same height with a shorter displacement.</p>",
  "fields": [
    {
      "id": "eig",
      "label": "ascending eigenvalues",
      "type": "vec",
      "ans": [
        2,
        4
      ]
    },
    {
      "id": "radius",
      "label": "long and short semiaxis lengths",
      "type": "vec",
      "ans": [
        0.7071067811865475,
        0.5
      ]
    }
  ],
  "hints": {
    "eig": "Apply A to the difference and sum directions.",
    "radius": "Take reciprocal square roots of the positive eigenvalues."
  }
},
K2: {
  "statement": "**K2 · Core · gate — defend the geometric guarantee.** Prove the real spectral theorem, naming the existence fact used and explaining how the induction preserves symmetry. State why repeated eigenvalues cause no defect.",
  "plain": "The continuous quadratic form has a maximum on the compact unit sphere. For a unit maximizer q and unit v⊥q, maximality at normalized q+tv for both signs of small t forces vᵀAq=0, hence Aq=(qᵀAq)q. Symmetry makes q⊥ invariant, and the restriction in an orthonormal basis stays symmetric because its entries are paired dot products. Induct on dimension and assemble Q; then AQ=QΛ and QᵀQ=I imply A=QΛQᵀ. The construction never assumes distinct eigenvalues, so repeated eigenvalues do not prevent a complete orthonormal eigenbasis.",
  "solution": "<p>The continuous quadratic form has a maximum on the compact unit sphere. For a unit maximizer q and unit v⊥q, maximality at normalized q+tv for both signs of small t forces vᵀAq=0, hence Aq=(qᵀAq)q. Symmetry makes q⊥ invariant, and the restriction in an orthonormal basis stays symmetric because its entries are paired dot products. Induct on dimension and assemble Q; then AQ=QΛ and QᵀQ=I imply A=QΛQᵀ. The construction never assumes distinct eigenvalues, so repeated eigenvalues do not prevent a complete orthonormal eigenbasis.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — diagnose three zero readings.** Compare A=diag(1,−1) at x=(1,1), B=diag(1,0) at x=(0,1), and C=0 at any nonzero x. Each has zero quadratic value. Give the images and explain which zero sets are null spaces.",
  "plain": "Ax=(1,−1) is nonzero: the saddle’s zero set is the union of lines x₁=±x₂, while its null space is {0}. Bx=(0,0); the PSD zero set is exactly the vertical null line. Cx=(0,0) for every x; the zero set and null space are both the entire plane. Cancellation explains the first zero, a null direction the second, and a zero operator the third.",
  "solution": "<p>Ax=(1,−1) is nonzero: the saddle’s zero set is the union of lines x₁=±x₂, while its null space is {0}. Bx=(0,0); the PSD zero set is exactly the vertical null line. Cx=(0,0) for every x; the zero set and null space are both the entire plane. Cancellation explains the first zero, a null direction the second, and a zero operator the third.</p>",
  "fields": [
    {
      "id": "a",
      "label": "first image",
      "type": "vec",
      "ans": [
        1,
        -1
      ]
    },
    {
      "id": "b",
      "label": "second image",
      "type": "vec",
      "ans": [
        0,
        0
      ]
    }
  ],
  "hints": {
    "a": "A zero dot product does not imply that the second vector vanishes.",
    "b": "The second coordinate eigenvalue is zero."
  }
},
K4: {
  "statement": "**K4 · Core · gate — construct and audit a certificate.** Factor A=[[9,3],[3,2]] by Cholesky, giving its pivots and L. Explain exactly what this certifies in exact arithmetic, and what extra qualifications accompany a floating-point, tolerance-based test.",
  "plain": "The pivots are 9 and 2−(3/3)²=1, so L=[[3,0],[1,1]]. Its product is A and its diagonal is positive, making L invertible. In exact arithmetic xᵀAx=‖Lᵀx‖²>0 proves PD. Floating-point results require input symmetry validation, a declared cutoff and scale, finite arithmetic, and a reconstruction audit. A relative-cutoff rejection can include an exactly PD matrix; it does not prove indefiniteness.",
  "solution": "<p>The pivots are 9 and 2−(3/3)²=1, so L=[[3,0],[1,1]]. Its product is A and its diagonal is positive, making L invertible. In exact arithmetic xᵀAx=‖Lᵀx‖²&gt;0 proves PD. Floating-point results require input symmetry validation, a declared cutoff and scale, finite arithmetic, and a reconstruction audit. A relative-cutoff rejection can include an exactly PD matrix; it does not prove indefiniteness.</p>",
  "fields": [
    {
      "id": "pivot",
      "label": "pivots",
      "type": "vec",
      "ans": [
        9,
        1
      ]
    },
    {
      "id": "l",
      "label": "L entries row by row",
      "type": "vec",
      "ans": [
        3,
        0,
        1,
        1
      ]
    }
  ],
  "hints": {
    "pivot": "Subtract the squared off-diagonal factor entry from 2.",
    "l": "Use positive diagonal square roots and match entry a₂₁."
  }
},
K5: {
  "statement": "**K5 · Stretch · gate — a bounded optimization claim.** For A=diag(2,0), decide whether f(x)=½xᵀAx−bᵀx has a minimizer for b=(4,0) and b=(4,1). Give every minimizer or a direction showing unboundedness. State the general PSD compatibility criterion.",
  "plain": "For b=(4,0), f=x₁²−4x₁=(x₁−2)²−4. Every (2,t) is a minimizer, with value −4. For b=(4,1), f(2,t)=−4−t tends to −∞ as t→+∞. In general, for symmetric PSD A, a minimizer exists iff b∈range(A)=ker(A)⊥; then all minimizers are x★+ker(A) for any Ax★=b. If b has a nonzero null-space component, its linear term gives unbounded descent.",
  "solution": "<p>For b=(4,0), f=x₁²−4x₁=(x₁−2)²−4. Every (2,t) is a minimizer, with value −4. For b=(4,1), f(2,t)=−4−t tends to −∞ as t→+∞. In general, for symmetric PSD A, a minimizer exists iff b∈range(A)=ker(A)⊥; then all minimizers are x★+ker(A) for any Ax★=b. If b has a nonzero null-space component, its linear term gives unbounded descent.</p>",
  "fields": [
    {
      "id": "x",
      "label": "first coordinate of every minimizer in the compatible case",
      "type": "num",
      "ans": 2
    },
    {
      "id": "value",
      "label": "minimum in the compatible case",
      "type": "num",
      "ans": -4
    }
  ],
  "hints": {
    "x": "Complete the square in x₁.",
    "value": "Evaluate at x₁=2; the free coordinate has no linear term in the first case."
  }
},
K6: {
  "statement": "**K6 · Stretch · gate — recover a missing axis variationally.** A symmetric 3×3 matrix has ascending eigenvalues 1,4,9. Without choosing its entries, prove that every plane contains a nonzero vector of Rayleigh quotient at least 4 and that some plane has no quotient greater than 4. If a unit probe has R=3.9 and residual norm 0.2, what eigenvalue-proximity statement is justified? Does that alone identify a unique signed eigenvector?",
  "plain": "Every plane intersects span(q₂,q₃) nontrivially, because the dimensions sum to 4>3. The intersection supplies a Rayleigh quotient at least 4. On span(q₁,q₂), all quotients are at most 4, and q₂ attains 4. For the probe, symmetry guarantees minᵢ|λᵢ−3.9|≤0.2; in this stated spectrum only 4 lies in [3.7,4.1]. This identifies the nearby eigenvalue, not a unique signed eigenvector: eigenvector signs are inherently arbitrary and the residual need not be zero. With the known gaps, one can additionally bound leakage outside that eigenspace; it is not exact alignment.",
  "solution": "<p>Every plane intersects span(q₂,q₃) nontrivially, because the dimensions sum to 4&gt;3. The intersection supplies a Rayleigh quotient at least 4. On span(q₁,q₂), all quotients are at most 4, and q₂ attains 4. For the probe, symmetry guarantees minᵢ|λᵢ−3.9|≤0.2; in this stated spectrum only 4 lies in [3.7,4.1]. This identifies the nearby eigenvalue, not a unique signed eigenvector: eigenvector signs are inherently arbitrary and the residual need not be zero. With the known gaps, one can additionally bound leakage outside that eigenspace; it is not exact alignment.</p>",
  "fields": [
    {
      "id": "eigen",
      "label": "eigenvalue lying within 0.2 of 3.9",
      "type": "num",
      "ans": 4
    }
  ],
  "hints": {
    "eigen": "Compare the residual bound with each of the three supplied eigenvalues."
  }
},
M7: {
  "statement": "**M7 · Stretch · mixed — The complex-Hermitian analogue.** Compute the eigenvalues of H=[[2,i],[−i,2]] and determine whether H is positive definite.",
  "plain": "det(H−λI)=(2−λ)²−1 gives λ=1,3. The matrix is Hermitian with positive eigenvalues, hence positive definite.",
  "solution": "<p>det(H−λI)=(2−λ)²−1 gives λ=1,3. The matrix is Hermitian with positive eigenvalues, hence positive definite.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Numerical result(s), in requested order",
      "type": "vec",
      "ans": [
        1,
        3
      ]
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
