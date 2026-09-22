/* Authored solutions and offline typed checks. */
GU.answers("08-svd", {
A1: {
  "statement": "**A1 · Foundation · paper — a missing input channel.** For A=[[3,0,0],[0,2,0]], give its singular values, rank, nullity, and minimum output length over all unit inputs.",
  "plain": "The gains are 3,2, rank is 2, and input nullity is 3−2=1. Unit input e₃ is killed, so the minimum amplification is zero. The list of p=2 positive gains describes the two nonzero channels and does not include every input basis direction.",
  "solution": "<p>The gains are 3,2, rank is 2, and input nullity is 3−2=1. Unit input e₃ is killed, so the minimum amplification is zero. The list of p=2 positive gains describes the two nonzero channels and does not include every input basis direction.</p>",
  "fields": [
    {
      "id": "s",
      "label": "singular values",
      "type": "vec",
      "ans": [
        3,
        2
      ]
    },
    {
      "id": "rank",
      "label": "rank",
      "type": "num",
      "ans": 2
    },
    {
      "id": "null",
      "label": "input nullity",
      "type": "num",
      "ans": 1
    },
    {
      "id": "minimum",
      "label": "minimum unit-input output length",
      "type": "num",
      "ans": 0
    }
  ],
  "hints": {
    "s": "The matrix already scales two coordinate channels.",
    "rank": "Count independent output columns.",
    "null": "Subtract rank from the input dimension.",
    "minimum": "Test the third coordinate vector."
  }
},
A2: {
  "statement": "**A2 · Core · paper — prove the paired directions.** Starting with an orthonormal eigenbasis of AᵀA, construct the positive-gain left singular vectors and prove their orthonormality. Explain what to do with zero gains.",
  "plain": "AᵀA is symmetric PSD, so the spectral theorem gives orthonormal vᵢ with eigenvalues σᵢ²≥0. For σᵢ>0 set uᵢ=Avᵢ/σᵢ. Then uᵢᵀuⱼ=vᵢᵀAᵀAvⱼ/(σᵢσⱼ)=σⱼ²δᵢⱼ/(σᵢσⱼ)=δᵢⱼ. For σᵢ=0, ‖Avᵢ‖²=0 so Avᵢ=0. Do not divide by this gain. Extend the positive-channel left vectors to an orthonormal output basis; the zero/extra directions complete the full factorization.",
  "solution": "<p>AᵀA is symmetric PSD, so the spectral theorem gives orthonormal vᵢ with eigenvalues σᵢ²≥0. For σᵢ&gt;0 set uᵢ=Avᵢ/σᵢ. Then uᵢᵀuⱼ=vᵢᵀAᵀAvⱼ/(σᵢσⱼ)=σⱼ²δᵢⱼ/(σᵢσⱼ)=δᵢⱼ. For σᵢ=0, ‖Avᵢ‖²=0 so Avᵢ=0. Do not divide by this gain. Extend the positive-channel left vectors to an orthonormal output basis; the zero/extra directions complete the full factorization.</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — signs live in the factors.** Give one SVD of diag(−3,1), with descending nonnegative gains. State why negative eigenvalues do not force negative singular values.",
  "plain": "One choice is U=diag(−1,1), Σ=diag(3,1), and Vᵀ=I₂. Multiplying reconstructs diag(−3,1), and both outer factors are orthogonal. Singular values measure nonnegative lengths; the reflection is carried by U. Other paired sign choices are valid.",
  "solution": "<p>One choice is U=diag(−1,1), Σ=diag(3,1), and Vᵀ=I₂. Multiplying reconstructs diag(−3,1), and both outer factors are orthogonal. Singular values measure nonnegative lengths; the reflection is carried by U. Other paired sign choices are valid.</p>",
  "fields": [
    {
      "id": "s",
      "label": "descending gains",
      "type": "vec",
      "ans": [
        3,
        1
      ]
    }
  ],
  "hints": {
    "s": "Take absolute gains and put the minus sign into an orthogonal factor."
  }
},
A4: {
  "statement": "**A4 · Core · paper — a rectangular shape audit.** A is 5×3 of rank two. Give full, reduced, and compact factor shapes, then the dimensions of its range, row space, null space, and left null space in that order.",
  "plain": "Full shapes: U 5×5, Σ 5×3, Vᵀ 3×3. Reduced: U 5×3, Σ 3×3, Vᵀ 3×3. Compact: Uᵣ 5×2, Σᵣ 2×2, Vᵣᵀ 2×3. Range and row space both have dimension 2; input nullity is 1; left nullity is 3.",
  "solution": "<p>Full shapes: U 5×5, Σ 5×3, Vᵀ 3×3. Reduced: U 5×3, Σ 3×3, Vᵀ 3×3. Compact: Uᵣ 5×2, Σᵣ 2×2, Vᵣᵀ 2×3. Range and row space both have dimension 2; input nullity is 1; left nullity is 3.</p>",
  "fields": [
    {
      "id": "full",
      "label": "full shapes as U rows,cols; Σ rows,cols; Vᵀ rows,cols",
      "type": "vec",
      "ans": [
        5,
        5,
        5,
        3,
        3,
        3
      ]
    },
    {
      "id": "reduced",
      "label": "reduced shapes in the same order",
      "type": "vec",
      "ans": [
        5,
        3,
        3,
        3,
        3,
        3
      ]
    },
    {
      "id": "compact",
      "label": "compact shapes in the same order",
      "type": "vec",
      "ans": [
        5,
        2,
        2,
        2,
        2,
        3
      ]
    },
    {
      "id": "dims",
      "label": "range, row space, null space, left null space dimensions",
      "type": "vec",
      "ans": [
        2,
        2,
        1,
        3
      ]
    }
  ],
  "hints": {
    "full": "Full factors contain complete ambient bases.",
    "reduced": "Use p=min(5,3)=3 paired slots.",
    "compact": "Use the two positive channels only.",
    "dims": "Use rank and rank–nullity on A and Aᵀ."
  }
},
A5: {
  "statement": "**A5 · Core · paper — one step versus an invariant line.** For A=[[1,2],[0,1]], compute its eigenvalues, the length of Ae₂, and its singular values from the eigenvalues of AᵀA.",
  "plain": "The triangular matrix has eigenvalues 1,1. Ae₂=(2,1), with length √5. AᵀA=[[1,2],[2,5]], whose trace is 6 and determinant is 1, giving eigenvalues 3±2√2. Their square roots are √2+1 and √2−1. Eigenvalues describe invariant lines; the largest singular value measures maximum one-step stretching.",
  "solution": "<p>The triangular matrix has eigenvalues 1,1. Ae₂=(2,1), with length √5. AᵀA=[[1,2],[2,5]], whose trace is 6 and determinant is 1, giving eigenvalues 3±2√2. Their square roots are √2+1 and √2−1. Eigenvalues describe invariant lines; the largest singular value measures maximum one-step stretching.</p>",
  "fields": [
    {
      "id": "eigen",
      "label": "eigenvalues",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    },
    {
      "id": "length",
      "label": "length of Ae₂",
      "type": "num",
      "ans": 2.23606797749979
    },
    {
      "id": "s",
      "label": "descending singular values",
      "type": "vec",
      "ans": [
        2.414213562373095,
        0.41421356237309515
      ]
    }
  ],
  "hints": {
    "eigen": "The eigenvalues of a triangular matrix are its diagonal entries.",
    "length": "Compute the Euclidean norm of the second column.",
    "s": "Solve the Gram characteristic polynomial and take nonnegative square roots."
  }
},
A6: {
  "statement": "**A6 · Core · paper — two error budgets.** A matrix has singular values (5,3,1). Give its spectral norm, squared Frobenius norm, rank-one spectral error, and rank-one squared Frobenius error.",
  "plain": "The spectral norm is 5. The squared Frobenius norm is 25+9+1=35. After keeping the leading channel, the spectral error is 3 and squared Frobenius error is 9+1=10.",
  "solution": "<p>The spectral norm is 5. The squared Frobenius norm is 25+9+1=35. After keeping the leading channel, the spectral error is 3 and squared Frobenius error is 9+1=10.</p>",
  "fields": [
    {
      "id": "norm",
      "label": "spectral norm",
      "type": "num",
      "ans": 5
    },
    {
      "id": "energy",
      "label": "squared Frobenius norm",
      "type": "num",
      "ans": 35
    },
    {
      "id": "spectral",
      "label": "rank-one spectral error",
      "type": "num",
      "ans": 3
    },
    {
      "id": "frob",
      "label": "rank-one squared Frobenius error",
      "type": "num",
      "ans": 10
    }
  ],
  "hints": {
    "norm": "Take the largest gain.",
    "energy": "Sum squared gains.",
    "spectral": "Take the largest discarded gain.",
    "frob": "Sum the squared discarded gains."
  }
},
A7: {
  "statement": "**A7 · Core · paper — optimal need not be unique.** For A=diag(3,1), compare B=diag(3,0) and C=diag(2,0). Give the spectral and squared Frobenius errors of each, and say which are optimal under each norm.",
  "plain": "A−B=diag(0,1) has spectral error 1 and squared Frobenius error 1. A−C=diag(1,1) has spectral error 1 and squared Frobenius error 2. The rank-one spectral lower bound is σ₂=1, so both are optimal in spectral norm. Only B of these two attains the Frobenius lower bound σ₂²=1. The strict singular-value gap does not force spectral-norm uniqueness.",
  "solution": "<p>A−B=diag(0,1) has spectral error 1 and squared Frobenius error 1. A−C=diag(1,1) has spectral error 1 and squared Frobenius error 2. The rank-one spectral lower bound is σ₂=1, so both are optimal in spectral norm. Only B of these two attains the Frobenius lower bound σ₂²=1. The strict singular-value gap does not force spectral-norm uniqueness.</p>",
  "fields": [
    {
      "id": "b",
      "label": "spectral, squared Frobenius errors for B",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    },
    {
      "id": "c",
      "label": "spectral, squared Frobenius errors for C",
      "type": "vec",
      "ans": [
        1,
        2
      ]
    }
  ],
  "hints": {
    "b": "Subtract B and inspect the diagonal residual.",
    "c": "The residual has two unit diagonal entries."
  }
},
A8: {
  "statement": "**A8 · Stretch · paper — prove an unavoidable lost direction.** Prove the spectral-norm rank-k approximation lower bound using a vector in span(v₁,…,vₖ₊₁) killed by any candidate B of rank at most k.",
  "plain": "Restrict B to the (k+1)-dimensional span of the first k+1 right singular vectors. The restricted map still has rank at most k, so rank–nullity provides a nonzero vector it kills; normalize it to x. Then ‖A−B‖₂≥‖(A−B)x‖=‖Ax‖. All singular gains on that subspace are at least σₖ₊₁, so ‖Ax‖≥σₖ₊₁. Truncation attains that bound. The argument applies for k<p; k=p admits exact reconstruction with zero error.",
  "solution": "<p>Restrict B to the (k+1)-dimensional span of the first k+1 right singular vectors. The restricted map still has rank at most k, so rank–nullity provides a nonzero vector it kills; normalize it to x. Then ‖A−B‖₂≥‖(A−B)x‖=‖Ax‖. All singular gains on that subspace are at least σₖ₊₁, so ‖Ax‖≥σₖ₊₁. Truncation attains that bound. The argument applies for k&lt;p; k=p admits exact reconstruction with zero error.</p>"
},
A9: {
  "statement": "**A9 · Core · paper — minimum norm from positive channels.** For A=[[3,0,0],[0,2,0]] and b=(6,4), give all exact solutions and the minimum-norm solution. Prove the minimum claim with orthogonal coordinates.",
  "plain": "Every solution is (2,2,t), t∈ℝ. The minimum-norm solution is (2,2,0). The first two coordinates are fixed by the positive channels, while the third is a null coordinate. Orthogonality gives squared norm 2²+2²+t²=8+t², uniquely minimized at t=0.",
  "solution": "<p>Every solution is (2,2,t), t∈ℝ. The minimum-norm solution is (2,2,0). The first two coordinates are fixed by the positive channels, while the third is a null coordinate. Orthogonality gives squared norm 2²+2²+t²=8+t², uniquely minimized at t=0.</p>",
  "fields": [
    {
      "id": "x",
      "label": "minimum-norm solution",
      "type": "vec",
      "ans": [
        2,
        2,
        0
      ]
    },
    {
      "id": "norm",
      "label": "minimum squared norm",
      "type": "num",
      "ans": 8
    }
  ],
  "hints": {
    "x": "Divide the two output coordinates by their respective gains and zero the free coordinate.",
    "norm": "Use the squared norm in the orthonormal input basis."
  }
},
A10: {
  "statement": "**A10 · Foundation · paper — energy is squared.** For gains (6,3,1), give each explained-energy ratio, the fraction retained by two channels, and the remaining Frobenius error.",
  "plain": "The total squared energy is 36+9+1=46. The individual fractions are 36/46,9/46,1/46. Keeping two retains 45/46, and the discarded tail has Frobenius norm √1=1.",
  "solution": "<p>The total squared energy is 36+9+1=46. The individual fractions are 36/46,9/46,1/46. Keeping two retains 45/46, and the discarded tail has Frobenius norm √1=1.</p>",
  "fields": [
    {
      "id": "ratios",
      "label": "individual energy fractions",
      "type": "vec",
      "ans": [
        0.782608695652174,
        0.1956521739130435,
        0.021739130434782608
      ]
    },
    {
      "id": "retained",
      "label": "two-channel retained fraction",
      "type": "num",
      "ans": 0.9782608695652174
    },
    {
      "id": "error",
      "label": "remaining Frobenius error",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "ratios": "Square before normalizing.",
    "retained": "Sum the first two squared-gain fractions.",
    "error": "Take the square root of the tail energy."
  }
},
A11: {
  "statement": "**A11 · Core · paper — center, score, reconstruct.** For X=[[8,1],[12,1],[10,0],[10,2]], compute the mean, top scores using v₁=(1,0), top explained-variance ratio, and best line's squared reconstruction error.",
  "plain": "The mean is (10,1). Centered rows are (−2,0),(2,0),(0,−1),(0,1), so X_cᵀX_c=diag(8,2). With positive horizontal v₁ the scores are −2,2,0,0. The leading variance fraction is 8/(8+2)=4/5. Projection to the line y=1 removes the two vertical offsets, leaving squared error 1+1=2.",
  "solution": "<p>The mean is (10,1). Centered rows are (−2,0),(2,0),(0,−1),(0,1), so X_cᵀX_c=diag(8,2). With positive horizontal v₁ the scores are −2,2,0,0. The leading variance fraction is 8/(8+2)=4/5. Projection to the line y=1 removes the two vertical offsets, leaving squared error 1+1=2.</p>",
  "fields": [
    {
      "id": "mean",
      "label": "feature mean",
      "type": "vec",
      "ans": [
        10,
        1
      ]
    },
    {
      "id": "scores",
      "label": "top scores in row order",
      "type": "vec",
      "ans": [
        -2,
        2,
        0,
        0
      ]
    },
    {
      "id": "ratio",
      "label": "top explained-variance ratio",
      "type": "num",
      "ans": 0.8
    },
    {
      "id": "error",
      "label": "best-line squared error",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "mean": "Average each feature separately.",
    "scores": "Subtract the mean, then take horizontal coordinates.",
    "ratio": "The ratio uses squared singular values, equivalently Gram eigenvalues.",
    "error": "Sum the squared perpendicular displacements."
  }
},
A12: {
  "statement": "**A12 · Stretch · paper — the projection budget proof.** Prove the Frobenius rank-k approximation bound using the range projector of a candidate B. Justify why αᵢ=‖Puᵢ‖² lie in [0,1] and sum to rank(P).",
  "plain": "Let P project onto range(B), with d=rank(P)≤k. Each column of A−B splits orthogonally into (I−P)A and PA−B, so its total squared error is at least ‖(I−P)A‖_F²=‖A‖_F²−‖PA‖_F². Orthogonal right invariance and the SVD give ‖PA‖_F²=∑σᵢ²αᵢ with αᵢ=‖Puᵢ‖². Projection cannot increase length, so 0≤αᵢ≤1. For an orthonormal basis q₁,…,q_d of range(P), αᵢ=∑ⱼ(qⱼᵀuᵢ)²; summing over the complete left basis gives ∑ᵢαᵢ=d. Extend singular weights by zeros to all m left directions. Allocating at most k units to descending weights cannot exceed the top-k sum, so the residual is at least ∑ᵢ>kσᵢ². Truncation attains the bound.",
  "solution": "<p>Let P project onto range(B), with d=rank(P)≤k. Each column of A−B splits orthogonally into (I−P)A and PA−B, so its total squared error is at least ‖(I−P)A‖_F²=‖A‖_F²−‖PA‖_F². Orthogonal right invariance and the SVD give ‖PA‖_F²=∑σᵢ²αᵢ with αᵢ=‖Puᵢ‖². Projection cannot increase length, so 0≤αᵢ≤1. For an orthonormal basis q₁,…,q_d of range(P), αᵢ=∑ⱼ(qⱼᵀuᵢ)²; summing over the complete left basis gives ∑ᵢαᵢ=d. Extend singular weights by zeros to all m left directions. Allocating at most k units to descending weights cannot exceed the top-k sum, so the residual is at least ∑ᵢ&gt;kσᵢ². Truncation attains the bound.</p>"
},
B1: {
  "statement": "**B1 · Foundation · NumPy — three reconstruction audits.** On [[1,2],[0,1]], [[3,0,0],[0,2,0]], and a 3×2 zero matrix, compute full and reduced SVDs. Check reconstruction and orthogonality using shape-appropriate identities. Explain which right null directions are absent from reduced factors.",
  "plain": "For the 2×2 shear, both full and reduced factors have shapes (2,2), (2,), (2,2). For the wide 2×3 matrix, full factors have (2,2), (2,), (3,3), while reduced factors have (2,2), (2,), (2,3). Its omitted third full right vector spans its input null space. For the 3×2 zero matrix, full U is 3×3, reduced U is 3×2, and Vᵀ is 2×2 in either case; all right directions are null. Form a rectangular Σ for full reconstruction, or use U[:,:p]@diag(s)@Vᵀ[:p,:]. For reduced factors check UᵀU=I_p and Vᵀ(Vᵀ)ᵀ=I_p, not the generally false U Uᵀ=I_m. Reconstruction and orthogonality errors should be near the rounding scale.",
  "solution": "<p>For the 2×2 shear, both full and reduced factors have shapes (2,2), (2,), (2,2). For the wide 2×3 matrix, full factors have (2,2), (2,), (3,3), while reduced factors have (2,2), (2,), (2,3). Its omitted third full right vector spans its input null space. For the 3×2 zero matrix, full U is 3×3, reduced U is 3×2, and Vᵀ is 2×2 in either case; all right directions are null. Form a rectangular Σ for full reconstruction, or use U[:,:p]@diag(s)@Vᵀ[:p,:]. For reduced factors check UᵀU=I_p and Vᵀ(Vᵀ)ᵀ=I_p, not the generally false U Uᵀ=I_m. Reconstruction and orthogonality errors should be near the rounding scale.</p>"
},
B2: {
  "statement": "**B2 · Core · NumPy — a tolerance changes a report.** For diag(1,10⁻⁸), count gains strictly above τσ₁ for τ=10⁻¹⁰,10⁻⁶, then repeat after multiplying A by 10⁶. Give the four numerical ranks and the exact rank. Explain the units benefit and remaining limitations of a relative threshold.",
  "plain": "Ranks are 2,1 before rescaling and 2,1 after rescaling, using τ in the stated order. The exact rank is 2 in both cases. The relative threshold changes with σ₁ and is invariant to a common nonzero scalar rescaling in exact arithmetic. It still encodes a chosen resolution, depends on noise and arithmetic, and need not match exact rank.",
  "solution": "<p>Ranks are 2,1 before rescaling and 2,1 after rescaling, using τ in the stated order. The exact rank is 2 in both cases. The relative threshold changes with σ₁ and is invariant to a common nonzero scalar rescaling in exact arithmetic. It still encodes a chosen resolution, depends on noise and arithmetic, and need not match exact rank.</p>",
  "fields": [
    {
      "id": "ranks",
      "label": "four reported numerical ranks",
      "type": "vec",
      "ans": [
        2,
        1,
        2,
        1
      ]
    },
    {
      "id": "exact",
      "label": "exact rank",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "ranks": "Compare 10⁻⁸ with each threshold, then scale both gains together.",
    "exact": "Both diagonal entries are nonzero."
  }
},
B3: {
  "statement": "**B3 · Core · NumPy — see the Gram matrix forget.** For A=[[1,1],[0,ε]] with ε=10⁻⁴,10⁻⁸,10⁻¹⁰, compare direct SVD gains with square roots of Gram eigenvalues. Record any zero or negative computed Gram eigenvalue before applying a clipping policy. Explain why clipping does not recover the missing information.",
  "plain": "The exact determinant is ε, so both gains are positive for all three ε. Their product is ε and the leading gain approaches √2, making the smaller gain approximately ε/√2. Forming AᵀA produces [[1,1],[1,1+ε²]]. Once ε² is below the rounding resolution of 1, the Gram matrix can become [[1,1],[1,1]] and lose its smaller eigenvalue. Actual returned values depend on arithmetic and solver details: record them, including any tiny negative values, rather than prescribing an exact failure threshold. Clipping a negative value to zero prevents an invalid square root but supplies no missing digits or exact-rank proof.",
  "solution": "<p>The exact determinant is ε, so both gains are positive for all three ε. Their product is ε and the leading gain approaches √2, making the smaller gain approximately ε/√2. Forming AᵀA produces [[1,1],[1,1+ε²]]. Once ε² is below the rounding resolution of 1, the Gram matrix can become [[1,1],[1,1]] and lose its smaller eigenvalue. Actual returned values depend on arithmetic and solver details: record them, including any tiny negative values, rather than prescribing an exact failure threshold. Clipping a negative value to zero prevents an invalid square root but supplies no missing digits or exact-rank proof.</p>"
},
B4: {
  "statement": "**B4 · Core · NumPy — check the whole error curve.** For the 4×3 matrix [[3,0,0],[0,2,0],[0,0,1],[0,0,0]], compute A_k for k=0,1,2,3. Compare measured squared Frobenius errors and spectral errors with tail formulas, including the endpoints.",
  "plain": "The gains are 3,2,1. At k=0,1,2,3 the squared Frobenius errors are 14,5,1,0 and spectral errors are 3,2,1,0. Compute residual norms from A−A_k, not just from the gain list, and compare them with those predictions. The endpoint k=0 is the zero approximation; k=3 reconstructs the full map.",
  "solution": "<p>The gains are 3,2,1. At k=0,1,2,3 the squared Frobenius errors are 14,5,1,0 and spectral errors are 3,2,1,0. Compute residual norms from A−A_k, not just from the gain list, and compare them with those predictions. The endpoint k=0 is the zero approximation; k=3 reconstructs the full map.</p>",
  "fields": [
    {
      "id": "frob",
      "label": "squared Frobenius errors for k=0,1,2,3",
      "type": "vec",
      "ans": [
        14,
        5,
        1,
        0
      ]
    },
    {
      "id": "spectral",
      "label": "spectral errors for k=0,1,2,3",
      "type": "vec",
      "ans": [
        3,
        2,
        1,
        0
      ]
    }
  ],
  "hints": {
    "frob": "Use sums of squared tail gains.",
    "spectral": "Use the largest tail gain, or zero for an empty tail."
  }
},
B5: {
  "statement": "**B5 · Stretch · NumPy — a good compression can destroy the task.** Let A=diag(10,1) and all observed inputs equal e₂. Compute rank-one retained matrix energy, average squared output error, and relative output error. Compare with keeping the second channel instead. Which objective prefers which approximation?",
  "plain": "Keeping the first channel retains 100/101 of squared matrix energy, but every input e₂ loses its whole output. Average squared output error is 1 and relative output norm error is 1 (100%). Keeping only the second channel retains 1/101 of matrix energy but has zero output error on these inputs. Frobenius approximation prefers the first channel; this data-weighted output objective prefers the second.",
  "solution": "<p>Keeping the first channel retains 100/101 of squared matrix energy, but every input e₂ loses its whole output. Average squared output error is 1 and relative output norm error is 1 (100%). Keeping only the second channel retains 1/101 of matrix energy but has zero output error on these inputs. Frobenius approximation prefers the first channel; this data-weighted output objective prefers the second.</p>",
  "fields": [
    {
      "id": "retained",
      "label": "matrix energy retained by the top channel",
      "type": "num",
      "ans": 0.9900990099009901
    },
    {
      "id": "error",
      "label": "average squared output error",
      "type": "num",
      "ans": 1
    },
    {
      "id": "relative",
      "label": "relative output norm error",
      "type": "num",
      "ans": 1
    },
    {
      "id": "alternative",
      "label": "squared output error when keeping channel two",
      "type": "num",
      "ans": 0
    }
  ],
  "hints": {
    "retained": "Compare 10² with 10²+1².",
    "error": "Apply A−A₁ to the actual input e₂.",
    "relative": "Divide the error norm by ‖Ae₂‖.",
    "alternative": "The second channel is precisely the one these inputs use."
  }
},
B6: {
  "statement": "**B6 · Core · NumPy — PCA reconstruction is affine.** For the dataset in A11, compute the centered SVD, scores, rank-one centered reconstruction, and reconstruction after restoring the mean. Give the ranks of the two reconstruction matrices and the squared residual. Explain why an affine line need not yield a rank-one uncentered data matrix.",
  "plain": "The centered rank-one reconstruction has rows (−2,0),(2,0),(0,0),(0,0), hence rank 1. After restoring the mean, rows are (8,1),(12,1),(10,1),(10,1). The constant second column is independent of the varying first column, so the restored matrix has rank 2. The residual squared norm remains 2. An affine line is a translated one-dimensional subspace; the uncentered row matrix can require an extra direction for that translation.",
  "solution": "<p>The centered rank-one reconstruction has rows (−2,0),(2,0),(0,0),(0,0), hence rank 1. After restoring the mean, rows are (8,1),(12,1),(10,1),(10,1). The constant second column is independent of the varying first column, so the restored matrix has rank 2. The residual squared norm remains 2. An affine line is a translated one-dimensional subspace; the uncentered row matrix can require an extra direction for that translation.</p>",
  "fields": [
    {
      "id": "ranks",
      "label": "centered and restored reconstruction ranks",
      "type": "vec",
      "ans": [
        1,
        2
      ]
    },
    {
      "id": "error",
      "label": "squared residual",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "ranks": "Check column dependence before and after adding the mean.",
    "error": "The residual contains only the two discarded vertical deviations."
  }
},
C1: {
  "statement": "**C1 · Foundation · PyTorch — rectangular batches.** Stack a full-rank and a rank-one 3×2 matrix. Use float64 `torch.linalg.svd` with reduced factors. Reconstruct both with broadcasting or diagonal embedding, and audit factor shapes and paired equations. Explain why zero-gain columns must not be constructed by dividing by their gain.",
  "plain": "For example, use A₁=[[3,0],[0,2],[0,0]] and A₂=[[3,0],[0,0],[0,0]]. With batch size two and reduced factors, U has shape (2,3,2), s has (2,2), and Vh has (2,2,2). Reconstruct with (U*s.unsqueeze(-2))@Vh. Check UᵀU and Vh Vhᵀ against a 2×2 identity per batch member, and check A vᵢ=σᵢuᵢ. The second gain of A₂ is zero: its image cannot be normalized by division; the factorization chooses an orthonormal completion instead.",
  "solution": "<p>For example, use A₁=[[3,0],[0,2],[0,0]] and A₂=[[3,0],[0,0],[0,0]]. With batch size two and reduced factors, U has shape (2,3,2), s has (2,2), and Vh has (2,2,2). Reconstruct with (U*s.unsqueeze(-2))@Vh. Check UᵀU and Vh Vhᵀ against a 2×2 identity per batch member, and check A vᵢ=σᵢuᵢ. The second gain of A₂ is zero: its image cannot be normalized by division; the factorization chooses an orthonormal completion instead.</p>",
  "fields": [
    {
      "id": "ushape",
      "label": "batched reduced U shape",
      "type": "vec",
      "ans": [
        2,
        3,
        2
      ]
    },
    {
      "id": "sshape",
      "label": "batched gains shape",
      "type": "vec",
      "ans": [
        2,
        2
      ]
    },
    {
      "id": "vshape",
      "label": "batched Vh shape",
      "type": "vec",
      "ans": [
        2,
        2,
        2
      ]
    }
  ],
  "hints": {
    "ushape": "One output vector per paired slot and per batch member.",
    "sshape": "There are two paired slots in each of two matrices.",
    "vshape": "Each right factor has one row per paired slot and two input columns."
  }
},
C2: {
  "statement": "**C2 · Core · PyTorch — repeated singular vectors can turn.** For A=2I₂, rotate U and V by the same angle while keeping Σ=2I₂. Verify that the reconstruction stays fixed. At rank one, compare the two retained projectors and their approximation errors; does equal optimal error identify one component?",
  "plain": "With any orthogonal rotation R, R(2I)Rᵀ=2I. Rank-one truncations are 2q qᵀ for the selected unit first column q, and different q generally give different projectors. Every such truncation has spectral error 2 and squared Frobenius error 4. Equal optimal error identifies no preferred one-dimensional component inside the repeated singular-value space.",
  "solution": "<p>With any orthogonal rotation R, R(2I)Rᵀ=2I. Rank-one truncations are 2q qᵀ for the selected unit first column q, and different q generally give different projectors. Every such truncation has spectral error 2 and squared Frobenius error 4. Equal optimal error identifies no preferred one-dimensional component inside the repeated singular-value space.</p>",
  "fields": [
    {
      "id": "spectral",
      "label": "rank-one spectral error",
      "type": "num",
      "ans": 2
    },
    {
      "id": "frob",
      "label": "rank-one squared Frobenius error",
      "type": "num",
      "ans": 4
    }
  ],
  "hints": {
    "spectral": "The discarded gain is still 2.",
    "frob": "Square the one discarded positive gain."
  }
},
C3: {
  "statement": "**C3 · Core · PyTorch — whitening has a sample-size factor.** For the four-row dataset in A11, compute centered PCA scores and whiten both positive-variance directions using sample covariance divisor N−1. Verify WᵀW/(N−1)=I₂. Give the two whitening scale factors.",
  "plain": "The sample covariance is diag(8/3,2/3). Multiplying the two score coordinates by √(3/8) and √(3/2) gives WᵀW/3=I₂. Equivalently W=√3 U. Dividing by singular values alone would give U and sample covariance I₂/3, missing the factor √(N−1).",
  "solution": "<p>The sample covariance is diag(8/3,2/3). Multiplying the two score coordinates by √(3/8) and √(3/2) gives WᵀW/3=I₂. Equivalently W=√3 U. Dividing by singular values alone would give U and sample covariance I₂/3, missing the factor √(N−1).</p>",
  "fields": [
    {
      "id": "scale",
      "label": "whitening scale factors in descending-variance order",
      "type": "vec",
      "ans": [
        0.6123724356957945,
        1.224744871391589
      ]
    }
  ],
  "hints": {
    "scale": "Take inverse square roots of σᵢ²/(N−1), with N=4."
  }
},
C4: {
  "statement": "**C4 · Stretch · PyTorch — translate without changing variation.** Add (100,−50) to every row of the A11 dataset. Compare centered singular values and principal-subspace projectors before and after; compare uncentered singular values as well. Explain why signs of individual returned axes are the wrong invariant.",
  "plain": "Translation cancels when the new mean is subtracted, so centered data, singular values (√8,√2), and the leading subspace projector diag(1,0) remain unchanged up to rounding. Uncentered second moments include the much larger shifted mean and generally have different singular values and axes. An eigenvector or singular-vector sign is a basis convention, while its projector describes the actual subspace.",
  "solution": "<p>Translation cancels when the new mean is subtracted, so centered data, singular values (√8,√2), and the leading subspace projector diag(1,0) remain unchanged up to rounding. Uncentered second moments include the much larger shifted mean and generally have different singular values and axes. An eigenvector or singular-vector sign is a basis convention, while its projector describes the actual subspace.</p>",
  "fields": [
    {
      "id": "s",
      "label": "centered singular values after translation",
      "type": "vec",
      "ans": [
        2.8284271247461903,
        1.4142135623730951
      ]
    }
  ],
  "hints": {
    "s": "Center the shifted observations before taking the SVD."
  }
},
M1: {
  "statement": "**M1 · Core · paper — a projector's SVD.** For the orthogonal projector P onto span((1,1)), give its singular values, spectral norm, squared Frobenius norm, and best rank-zero squared error. Why do eigenvalues and singular values coincide here?",
  "plain": "P=(1/2)[[1,1],[1,1]] has eigenvalues and singular values 1,0. A symmetric PSD matrix has nonnegative eigenvalues, so their absolute values (the singular values) coincide with them after ordering. The spectral norm is 1, squared Frobenius norm is 1, and rank-zero squared error is 1.",
  "solution": "<p>P=(1/2)[[1,1],[1,1]] has eigenvalues and singular values 1,0. A symmetric PSD matrix has nonnegative eigenvalues, so their absolute values (the singular values) coincide with them after ordering. The spectral norm is 1, squared Frobenius norm is 1, and rank-zero squared error is 1.</p>",
  "fields": [
    {
      "id": "s",
      "label": "descending singular values",
      "type": "vec",
      "ans": [
        1,
        0
      ]
    },
    {
      "id": "values",
      "label": "spectral norm, squared Frobenius norm, rank-zero squared error",
      "type": "vec",
      "ans": [
        1,
        1,
        1
      ]
    }
  ],
  "hints": {
    "s": "A projector fixes one unit direction and kills the perpendicular one.",
    "values": "Use the singular-value norm formulas."
  }
},
M2: {
  "statement": "**M2 · Core · paper — determinant forgets the shape.** For A=diag(4,1/4), give the product of singular values, determinant, largest gain, and smallest gain. Explain why unit area scaling does not imply length preservation.",
  "plain": "The gains are 4 and 1/4, their product is 1, and det(A)=1. The largest gain is 4 and the smallest is 1/4. Area preservation constrains their product, not each individual length. One axis stretches as the other contracts.",
  "solution": "<p>The gains are 4 and 1/4, their product is 1, and det(A)=1. The largest gain is 4 and the smallest is 1/4. Area preservation constrains their product, not each individual length. One axis stretches as the other contracts.</p>",
  "fields": [
    {
      "id": "values",
      "label": "gain product, determinant, largest gain, smallest gain",
      "type": "vec",
      "ans": [
        1,
        1,
        4,
        0.25
      ]
    }
  ],
  "hints": {
    "values": "The matrix is already diagonal with positive entries."
  }
},
M3: {
  "statement": "**M3 · Core · paper — least squares with a left null direction.** For A=[[2,0],[0,1],[0,0]] and b=(4,3,5), use the singular channels to give the least-squares solution, residual b−Ax, squared error, and uniqueness verdict.",
  "plain": "The positive channels give x=(4/2,3/1)=(2,3). Its fitted output is (4,3,0), leaving residual (0,0,5) and squared error 25. The residual lies in the left null space span(e₃). The solution is unique because both input singular channels are positive and ker(A)={0}.",
  "solution": "<p>The positive channels give x=(4/2,3/1)=(2,3). Its fitted output is (4,3,0), leaving residual (0,0,5) and squared error 25. The residual lies in the left null space span(e₃). The solution is unique because both input singular channels are positive and ker(A)={0}.</p>",
  "fields": [
    {
      "id": "x",
      "label": "least-squares solution",
      "type": "vec",
      "ans": [
        2,
        3
      ]
    },
    {
      "id": "residual",
      "label": "b−Ax",
      "type": "vec",
      "ans": [
        0,
        0,
        5
      ]
    },
    {
      "id": "error",
      "label": "squared error",
      "type": "num",
      "ans": 25
    }
  ],
  "hints": {
    "x": "Divide the components within the range by their gains.",
    "residual": "The third output coordinate cannot be produced by A.",
    "error": "Square the one unfit coordinate."
  }
},
M4: {
  "statement": "**M4 · Stretch · paper — a spectrum with no preferred axis.** For the centered rows (1,0),(−1,0),(0,1),(0,−1), compute the sample covariance and its eigenvalues. Show every line through the origin has the same squared reconstruction error and give that error.",
  "plain": "The mean is zero and XᵀX=2I₂, so sample covariance is (2/3)I₂ and both covariance eigenvalues are 2/3. Every unit direction captures qᵀ(2I)q=2 of the total squared variation 4. Thus every line through the origin has residual squared error 2; no axis is uniquely favored.",
  "solution": "<p>The mean is zero and XᵀX=2I₂, so sample covariance is (2/3)I₂ and both covariance eigenvalues are 2/3. Every unit direction captures qᵀ(2I)q=2 of the total squared variation 4. Thus every line through the origin has residual squared error 2; no axis is uniquely favored.</p>",
  "fields": [
    {
      "id": "eig",
      "label": "sample covariance eigenvalues",
      "type": "vec",
      "ans": [
        0.6666666666666666,
        0.6666666666666666
      ]
    },
    {
      "id": "error",
      "label": "squared reconstruction error for any line",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "eig": "Use the divisor N−1=3.",
    "error": "Subtract the direction-independent captured energy from the total."
  }
},
M5: {
  "statement": "**M5 · Core · paper — storage is a separate claim.** For a 100×80 matrix and k=5, compute dense storage, three-factor SVD storage, and two-factor storage after absorbing singular values. State what these counts do not establish about downstream prediction quality.",
  "plain": "Dense storage uses 100·80=8000 numbers. Three factors use 5(100+80+1)=905. After absorbing gains into one side, two factors use 5(100+80)=900. These counts describe scalar entries, not encoding overhead, speed on particular hardware, or downstream prediction quality; the latter depends on the approximation and relevant data.",
  "solution": "<p>Dense storage uses 100·80=8000 numbers. Three factors use 5(100+80+1)=905. After absorbing gains into one side, two factors use 5(100+80)=900. These counts describe scalar entries, not encoding overhead, speed on particular hardware, or downstream prediction quality; the latter depends on the approximation and relevant data.</p>",
  "fields": [
    {
      "id": "counts",
      "label": "dense, three-factor, two-factor entry counts",
      "type": "vec",
      "ans": [
        8000,
        905,
        900
      ]
    }
  ],
  "hints": {
    "counts": "Count each retained output vector, gain, and input vector, then absorb the gains."
  }
},
M6: {
  "statement": "**M6 · Stretch · mixed — rank survives an invertible change, PCA need not.** Multiply the second feature of the A11 centered dataset by 3. Give its new descending singular values and leading feature axis. Compare its rank with the original, and explain why invertible feature scaling preserves rank but changes the PCA objective.",
  "plain": "Scaling the second feature by 3 changes the centered Gram matrix from diag(8,2) to diag(8,18). New descending singular values are √18 and √8, and the leading feature axis is the vertical line span(e₂). Rank stays 2 because the feature scaling is invertible. The squared-error cost for vertical residuals has increased by 9, so the PCA objective and optimum have changed.",
  "solution": "<p>Scaling the second feature by 3 changes the centered Gram matrix from diag(8,2) to diag(8,18). New descending singular values are √18 and √8, and the leading feature axis is the vertical line span(e₂). Rank stays 2 because the feature scaling is invertible. The squared-error cost for vertical residuals has increased by 9, so the PCA objective and optimum have changed.</p>",
  "fields": [
    {
      "id": "s",
      "label": "new descending singular values",
      "type": "vec",
      "ans": [
        4.242640687119285,
        2.8284271247461903
      ]
    },
    {
      "id": "rank",
      "label": "new rank",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "s": "Feature scaling acts on the Gram diagonal quadratically.",
    "rank": "An invertible right multiplication preserves column/row rank."
  }
},
K1: {
  "statement": "**K1 · Foundation · gate — name both spaces.** For A=[[4,0,0],[0,1,0]], give singular values and bases for all four fundamental subspaces. State full factor shapes and explain why its smallest listed singular value is not its minimum amplification on unit inputs.",
  "plain": "The gains are 4,1. In output space, range(A)=span(e₁,e₂)=ℝ² and ker(Aᵀ)={0}, whose basis is the empty list. In input space, row(A)=span(e₁,e₂) in ℝ³ and ker(A)=span(e₃). Full U is 2×2, Σ is 2×3, and Vᵀ is 3×3. The listed smallest gain 1 is the least amplification on the row space; the omitted input direction e₃ makes the unrestricted minimum zero.",
  "solution": "<p>The gains are 4,1. In output space, range(A)=span(e₁,e₂)=ℝ² and ker(Aᵀ)={0}, whose basis is the empty list. In input space, row(A)=span(e₁,e₂) in ℝ³ and ker(A)=span(e₃). Full U is 2×2, Σ is 2×3, and Vᵀ is 3×3. The listed smallest gain 1 is the least amplification on the row space; the omitted input direction e₃ makes the unrestricted minimum zero.</p>",
  "fields": [
    {
      "id": "s",
      "label": "singular values",
      "type": "vec",
      "ans": [
        4,
        1
      ]
    },
    {
      "id": "shapes",
      "label": "full factor shapes, row/column pairs",
      "type": "vec",
      "ans": [
        2,
        2,
        2,
        3,
        3,
        3
      ]
    },
    {
      "id": "min",
      "label": "minimum amplification over all unit inputs",
      "type": "num",
      "ans": 0
    }
  ],
  "hints": {
    "s": "Read the two positive coordinate channels.",
    "shapes": "Full factors carry both complete ambient bases.",
    "min": "Test the unused third input coordinate."
  }
},
K2: {
  "statement": "**K2 · Core · gate — justify universal existence.** Prove the SVD for an arbitrary real m×n matrix, including rank deficiency. Name the theorem that provides the right singular vectors and explain how the remaining left vectors are chosen.",
  "plain": "AᵀA is symmetric PSD, so the real spectral theorem supplies orthonormal right eigenvectors with nonnegative eigenvalues. For every positive eigenvalue σᵢ², define uᵢ=Avᵢ/σᵢ; their dot products prove they are orthonormal. A zero Gram eigenvalue implies Avᵢ=0 by its squared norm. The positive images span range(A), so their number is r. Complete them to an orthonormal basis of ℝᵐ, form rectangular Σ with the r positive gains and other entries zero, and collect all right vectors in V. The column equations give AV=UΣ, hence A=UΣVᵀ. This handles tall, wide, singular, and zero maps without requiring an eigenbasis of A itself.",
  "solution": "<p>AᵀA is symmetric PSD, so the real spectral theorem supplies orthonormal right eigenvectors with nonnegative eigenvalues. For every positive eigenvalue σᵢ², define uᵢ=Avᵢ/σᵢ; their dot products prove they are orthonormal. A zero Gram eigenvalue implies Avᵢ=0 by its squared norm. The positive images span range(A), so their number is r. Complete them to an orthonormal basis of ℝᵐ, form rectangular Σ with the r positive gains and other entries zero, and collect all right vectors in V. The column equations give AV=UΣ, hence A=UΣVᵀ. This handles tall, wide, singular, and zero maps without requiring an eigenbasis of A itself.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — choose a defensible budget.** A matrix has gains (8,4,2,1). What smallest k retains at least 95% of squared energy? Give that truncation's spectral error, squared Frobenius error, and retained fraction. State the optimization claim those errors certify.",
  "plain": "Total squared energy is 64+16+4+1=85. Two channels retain 80/85≈94.12%, below 95%. Three retain 84/85≈98.82%, so the smallest budget is k=3. The spectral error is 1 and squared Frobenius error is 1. Eckart–Young says no rank-at-most-three matrix has smaller error in either of these two norms; it does not certify task accuracy.",
  "solution": "<p>Total squared energy is 64+16+4+1=85. Two channels retain 80/85≈94.12%, below 95%. Three retain 84/85≈98.82%, so the smallest budget is k=3. The spectral error is 1 and squared Frobenius error is 1. Eckart–Young says no rank-at-most-three matrix has smaller error in either of these two norms; it does not certify task accuracy.</p>",
  "fields": [
    {
      "id": "k",
      "label": "smallest qualifying k",
      "type": "num",
      "ans": 3
    },
    {
      "id": "spectral",
      "label": "spectral error",
      "type": "num",
      "ans": 1
    },
    {
      "id": "frob",
      "label": "squared Frobenius error",
      "type": "num",
      "ans": 1
    },
    {
      "id": "retained",
      "label": "retained squared-energy fraction",
      "type": "num",
      "ans": 0.9882352941176471
    }
  ],
  "hints": {
    "k": "Compare the first two and first three squared-gain prefix sums with 0.95 times the total.",
    "spectral": "Take the largest discarded gain.",
    "frob": "Sum squared discarded gains.",
    "retained": "Divide 84 by the total 85."
  }
},
K4: {
  "statement": "**K4 · Core · gate — rebuild the PCA calculation.** For X=[[8,1],[12,1],[10,0],[10,2]], give the mean, both sample covariance eigenvalues, the best affine line, and its squared reconstruction error. Give the error of the 45° line through the mean and explain the gap.",
  "plain": "The mean is (10,1), and sample covariance eigenvalues in descending order are 8/3,2/3. The best affine line is y=1, with squared error 2. A 45° line through the mean has error 2+6·(1/2)=5. Its excess is 3 because it spends half its projection weight on the lower-variation axis rather than all of it on the horizontal one.",
  "solution": "<p>The mean is (10,1), and sample covariance eigenvalues in descending order are 8/3,2/3. The best affine line is y=1, with squared error 2. A 45° line through the mean has error 2+6·(1/2)=5. Its excess is 3 because it spends half its projection weight on the lower-variation axis rather than all of it on the horizontal one.</p>",
  "fields": [
    {
      "id": "mean",
      "label": "feature mean",
      "type": "vec",
      "ans": [
        10,
        1
      ]
    },
    {
      "id": "eig",
      "label": "descending sample covariance eigenvalues",
      "type": "vec",
      "ans": [
        2.6666666666666665,
        0.6666666666666666
      ]
    },
    {
      "id": "errors",
      "label": "optimal and 45-degree squared errors",
      "type": "vec",
      "ans": [
        2,
        5
      ]
    }
  ],
  "hints": {
    "mean": "Average the four observation rows.",
    "eig": "Divide the centered Gram eigenvalues by N−1.",
    "errors": "Use the derived candidate-error formula."
  }
},
K5: {
  "statement": "**K5 · Stretch · gate — audit three overclaims.** Refute each claim with a concrete example: positive listed singular values imply no null space; 99% retained matrix energy guarantees small relative output error on every input; an SVD always identifies unique signed principal directions.",
  "plain": "First, [[1,0,0],[0,1,0]] has listed gains 1,1 but kills e₃. Second, diag(10,1) retains 100/101>99% of squared matrix energy at rank one yet makes 100% relative output error on e₂. Third, even a distinct positive channel permits simultaneous sign changes of its left and right vectors; 2I₂ additionally permits any common orthogonal rotation of its two paired bases. No uniquely signed direction is implied.",
  "solution": "<p>First, [[1,0,0],[0,1,0]] has listed gains 1,1 but kills e₃. Second, diag(10,1) retains 100/101&gt;99% of squared matrix energy at rank one yet makes 100% relative output error on e₂. Third, even a distinct positive channel permits simultaneous sign changes of its left and right vectors; 2I₂ additionally permits any common orthogonal rotation of its two paired bases. No uniquely signed direction is implied.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — distinguish absence from smallness.** A centered dataset has N=4 rows and d=6 features. Give the largest possible rank and smallest possible feature-nullity. Explain how zero variance differs from tiny positive variance for explained-variance ratios, whitening, and numerical-rank reporting. Specify what happens to the ratios if every observation is identical.",
  "plain": "Centering makes the four observation rows sum to zero, so rank is at most min(3,6)=3 and feature-nullity is at least 6−3=3. If total variation is positive, a zero gain contributes a zero explained-variance fraction; it cannot be whitened by inverse square root. A tiny positive gain contributes a small positive fraction and can be inverted algebraically, but whitening may greatly amplify errors. Numerical-rank thresholds can treat it as unusable without turning it into an exact zero. If all observations are identical, X_c=0 and every variance fraction is undefined because total variation is zero.",
  "solution": "<p>Centering makes the four observation rows sum to zero, so rank is at most min(3,6)=3 and feature-nullity is at least 6−3=3. If total variation is positive, a zero gain contributes a zero explained-variance fraction; it cannot be whitened by inverse square root. A tiny positive gain contributes a small positive fraction and can be inverted algebraically, but whitening may greatly amplify errors. Numerical-rank thresholds can treat it as unusable without turning it into an exact zero. If all observations are identical, X_c=0 and every variance fraction is undefined because total variation is zero.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "largest possible centered rank",
      "type": "num",
      "ans": 3
    },
    {
      "id": "nullity",
      "label": "smallest possible feature-nullity",
      "type": "num",
      "ans": 3
    }
  ],
  "hints": {
    "rank": "Centering removes at least one observation-space degree of freedom.",
    "nullity": "Apply rank–nullity in six-dimensional feature space."
  }
}
});
