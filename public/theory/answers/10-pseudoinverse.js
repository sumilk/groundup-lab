/* Authored offline checks and reference rubrics for LA10. Typed fields avoid e-notation. */
GU.answers("10-pseudoinverse", {
A1: {
  "statement": "**A1 · Foundation · paper · required — a rank-one pseudoinverse.** Let A=uvᵀ with u=(1,2,2) and v=(3,4), a 3×2 matrix of rank one. Write its compact SVD, then give A⁺, its first row, and ‖A⁺‖₂. Check AA⁺A=A on one entry.",
  "plain": "A=uvᵀ has ‖u‖=3 and ‖v‖=5, so its compact SVD has one channel: σ₁=15, u₁=(1,2,2)/3 and v₁=(3,4)/5. Then A⁺=v₁u₁ᵀ/15=vuᵀ/225, a 2×3 matrix whose first row is 3(1,2,2)/225=(1/75, 2/75, 2/75) and second row 4(1,2,2)/225. Its 2-norm is 1/σ₁=1/15. Check entry (1,1) of AA⁺A: A=[[3,4],[6,8],[6,8]], AA⁺=u₁u₁ᵀ, and the first row of u₁u₁ᵀA is (1/9)(1·(3,4)+2·(6,8)+2·(6,8))=(1/9)(27,36)=(3,4), the first row of A.",
  "solution": "<p>A=uvᵀ has ‖u‖=3 and ‖v‖=5, so its compact SVD has one channel: σ₁=15, u₁=(1,2,2)/3 and v₁=(3,4)/5. Then A⁺=v₁u₁ᵀ/15=vuᵀ/225, a 2×3 matrix whose first row is 3(1,2,2)/225=(1/75, 2/75, 2/75) and second row 4(1,2,2)/225. Its 2-norm is 1/σ₁=1/15. Check entry (1,1) of AA⁺A: A=[[3,4],[6,8],[6,8]], AA⁺=u₁u₁ᵀ, and the first row of u₁u₁ᵀA is (1/9)(1·(3,4)+2·(6,8)+2·(6,8))=(1/9)(27,36)=(3,4), the first row of A.</p>",
  "fields": [
    {
      "id": "row",
      "label": "first row of A⁺",
      "type": "vec",
      "ans": [
        0.013333333333333334,
        0.02666666666666667,
        0.02666666666666667
      ]
    },
    {
      "id": "norm",
      "label": "‖A⁺‖₂",
      "type": "num",
      "ans": 0.06666666666666667
    }
  ],
  "hints": {
    "row": "A rank-one A=uvᵀ has A⁺=vuᵀ/(‖u‖²‖v‖²); here ‖u‖²‖v‖²=9·25.",
    "norm": "The only gain of A is ‖u‖‖v‖; the pseudoinverse has the reciprocal gain."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper · required — shortest solution by perpendicularity.** For A=[[1,2,0],[0,1,−1]] and b=(3,1), parameterize all solutions by one free variable, find a kernel vector, and choose the solution perpendicular to it. Confirm your answer with the formula Aᵀ(AAᵀ)⁻¹b.",
  "plain": "Free variable x₂=t gives x₁=3−2t and x₃=t−1, so every solution is (3−2t, t, t−1). The kernel is spanned by (−2,1,1), since −2+2=0 and 1−1=0. Perpendicularity: −2(3−2t)+t+(t−1)=6t−7=0, so t=7/6 and x†=(2/3, 7/6, 1/6). Check: 2/3+7/3=3 and 7/6−1/6=1. Formula: AAᵀ=[[5,2],[2,2]] with inverse [[2,−2],[−2,5]]/6, so z=(AAᵀ)⁻¹b=(4,−1)/6 and Aᵀz=(4/6, 8/6−1/6, 1/6)=(2/3, 7/6, 1/6), the same vector.",
  "solution": "<p>Free variable x₂=t gives x₁=3−2t and x₃=t−1, so every solution is (3−2t, t, t−1). The kernel is spanned by (−2,1,1), since −2+2=0 and 1−1=0. Perpendicularity: −2(3−2t)+t+(t−1)=6t−7=0, so t=7/6 and x†=(2/3, 7/6, 1/6). Check: 2/3+7/3=3 and 7/6−1/6=1. Formula: AAᵀ=[[5,2],[2,2]] with inverse [[2,−2],[−2,5]]/6, so z=(AAᵀ)⁻¹b=(4,−1)/6 and Aᵀz=(4/6, 8/6−1/6, 1/6)=(2/3, 7/6, 1/6), the same vector.</p>",
  "fields": [
    {
      "id": "x",
      "label": "minimum-norm solution",
      "type": "vec",
      "ans": [
        0.6666666666666666,
        1.1666666666666667,
        0.16666666666666666
      ]
    }
  ],
  "hints": {
    "x": "Solve for x₁ and x₃ in terms of x₂, then make the solution perpendicular to the kernel vector (−2,1,1)."
  }
},
A3: {
  "statement": "**A3 · Core · paper · required — project, then shorten.** Let A=[[1,−1],[2,−2],[1,−1]] and b=(1,0,1). Project b onto range(A), find every w with Aw equal to that projection, and choose the shortest. Report the residual and check that it is perpendicular to the column.",
  "plain": "The column space is the line through c=(1,2,1). Since c·b=2 and ‖c‖²=6, the projection is ŷ=(1/3)c=(1/3, 2/3, 1/3). Aw=(w₁−w₂)c, so every w with Aw=ŷ satisfies w₁−w₂=1/3: the line (1/3,0)+t(1,1). The shortest point on it is perpendicular to the kernel direction (1,1), giving w†=(1/6, −1/6), of length √2/6. The residual b−ŷ=(2/3, −2/3, 2/3) has length 2/√3 and c·(b−ŷ)=2/3−4/3+2/3=0.",
  "solution": "<p>The column space is the line through c=(1,2,1). Since c·b=2 and ‖c‖²=6, the projection is ŷ=(1/3)c=(1/3, 2/3, 1/3). Aw=(w₁−w₂)c, so every w with Aw=ŷ satisfies w₁−w₂=1/3: the line (1/3,0)+t(1,1). The shortest point on it is perpendicular to the kernel direction (1,1), giving w†=(1/6, −1/6), of length √2/6. The residual b−ŷ=(2/3, −2/3, 2/3) has length 2/√3 and c·(b−ŷ)=2/3−4/3+2/3=0.</p>",
  "fields": [
    {
      "id": "w",
      "label": "shortest least-squares solution",
      "type": "vec",
      "ans": [
        0.16666666666666666,
        -0.16666666666666666
      ]
    },
    {
      "id": "r",
      "label": "residual b−ŷ",
      "type": "vec",
      "ans": [
        0.6666666666666666,
        -0.6666666666666666,
        0.6666666666666666
      ]
    }
  ],
  "hints": {
    "w": "First project b onto the line through (1,2,1); then choose w₁−w₂ equal to the projection coefficient with w₁=−w₂.",
    "r": "Subtract the projection (1/3)(1,2,1) from b."
  }
},
A4: {
  "statement": "**A4 · Core · paper · required — ridge on two channels.** In singular coordinates a problem has σ=(2, 0.2) and observed coordinates uᵢᵀb=(4, 0.06). For λ=0.04, give both filter factors and the coordinates of x_λ along v₁ and v₂. Compare with the unregularized coordinates, and say which channel ridge changed and why.",
  "plain": "The filter factors are f₁=4/(4+0.04)=4/4.04≈0.9901 and f₂=0.04/(0.04+0.04)=1/2. The unregularized coordinates are βᵢ/σᵢ=(2, 0.3). Ridge multiplies them by fᵢ, giving about (1.9802, 0.15). The strong channel is almost unchanged because σ₁²=4 is a hundred times λ. The weak channel is halved, because σ₂²=0.04 equals λ, which puts it exactly at the midpoint σ=√λ of the filter. Rubric: both factors with σ squared; both sets of coordinates; the explanation compares σᵢ² with λ for each channel.",
  "solution": "<p>The filter factors are f₁=4/(4+0.04)=4/4.04≈0.9901 and f₂=0.04/(0.04+0.04)=1/2. The unregularized coordinates are βᵢ/σᵢ=(2, 0.3). Ridge multiplies them by fᵢ, giving about (1.9802, 0.15). The strong channel is almost unchanged because σ₁²=4 is a hundred times λ. The weak channel is halved, because σ₂²=0.04 equals λ, which puts it exactly at the midpoint σ=√λ of the filter. Rubric: both factors with σ squared; both sets of coordinates; the explanation compares σᵢ² with λ for each channel.</p>",
  "fields": [
    {
      "id": "f",
      "label": "filter factors f₁, f₂",
      "type": "vec",
      "ans": [
        0.9900990099009901,
        0.5
      ]
    },
    {
      "id": "coords",
      "label": "coordinates of x_λ along v₁, v₂",
      "type": "vec",
      "ans": [
        1.9801980198019802,
        0.15
      ]
    }
  ],
  "hints": {
    "f": "Use σ², not σ: f=σ²/(σ²+λ) with σ₂²=0.04.",
    "coords": "Multiply each βᵢ/σᵢ by its own filter factor."
  }
},
A5: {
  "statement": "**A5 · Core · paper · required — bracket and bisect.** For A=diag(4, 0.5) and b=(4, 0.1), the discrepancy target is 0.05. Check that a root exists, confirm that λ=10⁻⁴ and λ=1 bracket it, and perform two steps of bisection in log λ, giving the bracket after each step.",
  "plain": "Here b lies in range(A), so the floor ‖(I−AA⁺)b‖ is 0. The ceiling is ‖b‖=√16.01≈4.001, and Aᵀb≠0, so the target 0.05 is attainable and has a unique root. ρ(λ)²=(λ/(16+λ))²·16+(λ/(0.25+λ))²·0.01. At λ=10⁻⁴, ρ≈4.7·10⁻⁵ is below the target, and at λ=1, ρ≈0.249 is above it, so they bracket the root. Step 1 tests √(10⁻⁴·1)=10⁻², where ρ≈4.59·10⁻³ is below the target, giving the bracket [10⁻², 1]. Step 2 tests 10⁻¹, where ρ≈0.0379 is still below, giving [10⁻¹, 1]. Continuing converges to λ≈0.140.",
  "solution": "<p>Here b lies in range(A), so the floor ‖(I−AA⁺)b‖ is 0. The ceiling is ‖b‖=√16.01≈4.001, and Aᵀb≠0, so the target 0.05 is attainable and has a unique root. ρ(λ)²=(λ/(16+λ))²·16+(λ/(0.25+λ))²·0.01. At λ=10⁻⁴, ρ≈4.7·10⁻⁵ is below the target, and at λ=1, ρ≈0.249 is above it, so they bracket the root. Step 1 tests √(10⁻⁴·1)=10⁻², where ρ≈4.59·10⁻³ is below the target, giving the bracket [10⁻², 1]. Step 2 tests 10⁻¹, where ρ≈0.0379 is still below, giving [10⁻¹, 1]. Continuing converges to λ≈0.140.</p>",
  "fields": [
    {
      "id": "bracket",
      "label": "bracket after two steps (low, high)",
      "type": "vec",
      "ans": [
        0.1,
        1
      ]
    }
  ],
  "hints": {
    "bracket": "Bisect in log λ: the midpoint of [10⁻⁴, 1] is 10⁻²; compare each residual with the target 0.05."
  }
},
A6: {
  "statement": "**A6 · Foundation · paper · required — two steps of gradient descent.** For the single equation x₁+x₂=2 written as A=[[1,1]] and b=(2), start at 0 with η=1/4. Compute x₁ and x₂, the factor by which the error shrinks each step, and the limit.",
  "plain": "Here σ₁²=‖(1,1)‖²=2 and η=1/4 satisfies 0<η≤1/σ₁². From 0, the gradient is Aᵀ(A·0−b)=−(2,2), so x₁=(0.5, 0.5). Then Ax₁−b=−1, so x₂=(0.5,0.5)+0.25(1,1)=(0.75, 0.75). The error in the single channel shrinks by 1−ησ₁²=1/2 at each step, and the limit is x†=(1,1), the minimum-norm solution.",
  "solution": "<p>Here σ₁²=‖(1,1)‖²=2 and η=1/4 satisfies 0&lt;η≤1/σ₁². From 0, the gradient is Aᵀ(A·0−b)=−(2,2), so x₁=(0.5, 0.5). Then Ax₁−b=−1, so x₂=(0.5,0.5)+0.25(1,1)=(0.75, 0.75). The error in the single channel shrinks by 1−ησ₁²=1/2 at each step, and the limit is x†=(1,1), the minimum-norm solution.</p>",
  "fields": [
    {
      "id": "x2",
      "label": "second iterate x₂",
      "type": "vec",
      "ans": [
        0.75,
        0.75
      ]
    },
    {
      "id": "factor",
      "label": "error shrink factor per step",
      "type": "num",
      "ans": 0.5
    },
    {
      "id": "limit",
      "label": "limit",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    }
  ],
  "hints": {
    "x2": "Each step adds η·(b−Ax)·(1,1).",
    "factor": "The factor is 1−ησ² with σ² the squared length of the row.",
    "limit": "From zero the iteration stays in the row space."
  }
},
A7: {
  "statement": "**A7 · Core · paper · required — the reverse-order rule fails.** For A=[[1,1],[0,0]] and B=[[1,0],[0,0]], compute (AB)⁺ and B⁺A⁺ and show that they differ. Then prove that (QW)⁺=WᵀQᵀ whenever Q has orthonormal columns and W has orthonormal rows.",
  "plain": "AB=[[1,0],[0,0]], which is its own pseudoinverse, so (AB)⁺=[[1,0],[0,0]]. B⁺=B, and A=(1,0)ᵀ(1,1) has A⁺=[[1/2,0],[1/2,0]]. Then B⁺A⁺=[[1/2,0],[0,0]], which differs in entry (1,1). Proof of the special case: let G=WᵀQᵀ. Then (QW)G(QW)=Q(WWᵀ)(QᵀQ)W=QW and G(QW)G=Wᵀ(QᵀQ)(WWᵀ)Qᵀ=G. Also (QW)G=QQᵀ and G(QW)=WᵀW are symmetric. The four identities determine the pseudoinverse uniquely, so (QW)⁺=WᵀQᵀ. Rubric: both products computed correctly; a specific entry where they differ; all four identities checked, using QᵀQ=I and WWᵀ=I; uniqueness cited.",
  "solution": "<p>AB=[[1,0],[0,0]], which is its own pseudoinverse, so (AB)⁺=[[1,0],[0,0]]. B⁺=B, and A=(1,0)ᵀ(1,1) has A⁺=[[1/2,0],[1/2,0]]. Then B⁺A⁺=[[1/2,0],[0,0]], which differs in entry (1,1). Proof of the special case: let G=WᵀQᵀ. Then (QW)G(QW)=Q(WWᵀ)(QᵀQ)W=QW and G(QW)G=Wᵀ(QᵀQ)(WWᵀ)Qᵀ=G. Also (QW)G=QQᵀ and G(QW)=WᵀW are symmetric. The four identities determine the pseudoinverse uniquely, so (QW)⁺=WᵀQᵀ. Rubric: both products computed correctly; a specific entry where they differ; all four identities checked, using QᵀQ=I and WWᵀ=I; uniqueness cited.</p>",
  "fields": [
    {
      "id": "entries",
      "label": "entry (1,1) of (AB)⁺ and of B⁺A⁺",
      "type": "vec",
      "ans": [
        1,
        0.5
      ]
    }
  ],
  "hints": {
    "entries": "A has rank one with A⁺=Aᵀ/‖A‖F²; B is already an orthogonal projector."
  }
},
A8: {
  "statement": "**A8 · Core · paper · required — the projector is unique.** Prove that AA⁺ is the orthogonal projector onto range(A), and that it is the only matrix P with P²=P, Pᵀ=P and range(P)=range(A).",
  "plain": "Write A=UᵣΣᵣVᵣᵀ. Then AA⁺=UᵣΣᵣVᵣᵀVᵣΣᵣ⁻¹Uᵣᵀ=UᵣUᵣᵀ, which is symmetric, satisfies (UᵣUᵣᵀ)²=UᵣUᵣᵀ because UᵣᵀUᵣ=I, and has range spanned by the columns of Uᵣ, which is range(A). For uniqueness, let P and Q both be symmetric idempotents with range S. For y∈S, Py=y; for y⊥S, Pᵀ=P gives (Py)·z=y·(Pz)=0 for every z, so Py∈S is perpendicular to S and is zero. The same holds for Q, so P and Q agree on S and on S^⊥, which together span ℝᵐ. Rubric: AA⁺ simplified to UᵣUᵣᵀ; symmetry, idempotence and range verified; uniqueness argued separately on S and on S^⊥ using symmetry.",
  "solution": "<p>Write A=UᵣΣᵣVᵣᵀ. Then AA⁺=UᵣΣᵣVᵣᵀVᵣΣᵣ⁻¹Uᵣᵀ=UᵣUᵣᵀ, which is symmetric, satisfies (UᵣUᵣᵀ)²=UᵣUᵣᵀ because UᵣᵀUᵣ=I, and has range spanned by the columns of Uᵣ, which is range(A). For uniqueness, let P and Q both be symmetric idempotents with range S. For y∈S, Py=y; for y⊥S, Pᵀ=P gives (Py)·z=y·(Pz)=0 for every z, so Py∈S is perpendicular to S and is zero. The same holds for Q, so P and Q agree on S and on S^⊥, which together span ℝᵐ. Rubric: AA⁺ simplified to UᵣUᵣᵀ; symmetry, idempotence and range verified; uniqueness argued separately on S and on S^⊥ using symmetry.</p>"
},
A9: {
  "statement": "**A9 · Core · paper · required — the push-through form of ridge.** Prove that (AᵀA+λI)⁻¹Aᵀ=Aᵀ(AAᵀ+λI)⁻¹ for λ>0. For a 10×10⁶ matrix, say which side is cheaper to solve with, and why the identity survives λ→0⁺ only in the form Aᵀ(AAᵀ)⁻¹ when A has full row rank.",
  "plain": "Start from Aᵀ(AAᵀ+λI)=AᵀAAᵀ+λAᵀ=(AᵀA+λI)Aᵀ. Both AAᵀ+λI and AᵀA+λI are positive definite for λ>0, hence invertible. Multiplying on the left by (AᵀA+λI)⁻¹ and on the right by (AAᵀ+λI)⁻¹ gives (AᵀA+λI)⁻¹Aᵀ=Aᵀ(AAᵀ+λI)⁻¹. For a 10×10⁶ matrix the right side needs a 10×10 solve instead of a 10⁶×10⁶ one, so it is far cheaper. As λ→0⁺ both sides tend to A⁺, but only when A has full row rank is AAᵀ invertible, so that the limit can be written Aᵀ(AAᵀ)⁻¹; otherwise the limit exists but neither inverse does. Rubric: the commuting identity; invertibility justified by positive definiteness; the cost comparison by matrix size; the full-row-rank condition for the limit formula.",
  "solution": "<p>Start from Aᵀ(AAᵀ+λI)=AᵀAAᵀ+λAᵀ=(AᵀA+λI)Aᵀ. Both AAᵀ+λI and AᵀA+λI are positive definite for λ&gt;0, hence invertible. Multiplying on the left by (AᵀA+λI)⁻¹ and on the right by (AAᵀ+λI)⁻¹ gives (AᵀA+λI)⁻¹Aᵀ=Aᵀ(AAᵀ+λI)⁻¹. For a 10×10⁶ matrix the right side needs a 10×10 solve instead of a 10⁶×10⁶ one, so it is far cheaper. As λ→0⁺ both sides tend to A⁺, but only when A has full row rank is AAᵀ invertible, so that the limit can be written Aᵀ(AAᵀ)⁻¹; otherwise the limit exists but neither inverse does. Rubric: the commuting identity; invertibility justified by positive definiteness; the cost comparison by matrix size; the full-row-rank condition for the limit formula.</p>"
},
A10: {
  "statement": "**A10 · Core · paper · required — preconditioning moves the answer.** For x₁+x₂=2 and the SPD preconditioner P=diag(1,4), find the step-size range in which the preconditioned iteration xₜ₊₁=xₜ−ηPAᵀ(Axₜ−b) converges, and its limit from x₀=0. Explain why the limit is not (1,1).",
  "plain": "Substituting x=P^½z with P^½=diag(1,2) turns the iteration into plain gradient descent for B=AP^½=[[1,2]], whose squared gain is σ₁(B)²=5. It converges for 0<η<2/5. From x₀=0 the limit minimizes xᵀP⁻¹x=x₁²+x₂²/4 subject to x₁+x₂=2. The minimizer satisfies 2x₁=x₂/2, so x₂=4x₁, and x₁+x₂=2 gives x=(0.4, 1.6). This is not (1,1) because the preconditioner makes the second coordinate four times cheaper to use in the P⁻¹ norm, so the iteration's implicit choice favours it. Rubric: the change of variables and the step range from σ₁(AP^½)²; the constrained minimization in the P⁻¹ norm; the explanation in terms of which coordinate is cheap.",
  "solution": "<p>Substituting x=P^½z with P^½=diag(1,2) turns the iteration into plain gradient descent for B=AP^½=[[1,2]], whose squared gain is σ₁(B)²=5. It converges for 0&lt;η&lt;2/5. From x₀=0 the limit minimizes xᵀP⁻¹x=x₁²+x₂²/4 subject to x₁+x₂=2. The minimizer satisfies 2x₁=x₂/2, so x₂=4x₁, and x₁+x₂=2 gives x=(0.4, 1.6). This is not (1,1) because the preconditioner makes the second coordinate four times cheaper to use in the P⁻¹ norm, so the iteration's implicit choice favours it. Rubric: the change of variables and the step range from σ₁(AP^½)²; the constrained minimization in the P⁻¹ norm; the explanation in terms of which coordinate is cheap.</p>",
  "fields": [
    {
      "id": "eta",
      "label": "upper limit of the step-size range",
      "type": "num",
      "ans": 0.4
    },
    {
      "id": "limit",
      "label": "limit from zero",
      "type": "vec",
      "ans": [
        0.4,
        1.6
      ]
    }
  ],
  "hints": {
    "eta": "Compute the squared gain of AP^½ with P^½=diag(1,2).",
    "limit": "Minimize x₁²+x₂²/4 along the line x₁+x₂=2."
  }
},
A11: {
  "statement": "**A11 · Core · paper · required — diagnose an unstable report.** A fitted model has σ₁=10 and σ₂=0.01, with v₁=(0.8,0.6) and v₂=(0.6,−0.8). A data change of size 0.01 lies entirely along u₂. Find the change in the coefficients, the largest possible change in the fitted values at the training inputs, and the change in prediction at the inputs (4,3) and (3,−4). A colleague reports \"the model is unstable\". Say exactly what is unstable.",
  "plain": "The change has coordinate 0.01 along u₂ and none along u₁. Dividing by σ₂=0.01 moves the coefficients by 1 along v₂, so ‖δw‖=1. The fitted values at the training inputs change by Xδw=0.01·u₂, at most 0.01 in any entry. The prediction at q changes by q·δw=q·v₂. For (4,3), q·v₂=2.4−2.4=0, so the prediction does not change. For (3,−4), q·v₂=1.8+3.2=5, so it changes by 5. The fitted values and predictions at inputs like (4,3), which lies along v₁, are stable. What is unstable is the coefficient vector along v₂ and any prediction at an input with a large v₂ component, such as (3,−4). Rubric: coefficient change from division by σ₂; fitted-value change bounded by the data change; both predictions computed from q·v₂; the report's claim narrowed to the v₂ direction.",
  "solution": "<p>The change has coordinate 0.01 along u₂ and none along u₁. Dividing by σ₂=0.01 moves the coefficients by 1 along v₂, so ‖δw‖=1. The fitted values at the training inputs change by Xδw=0.01·u₂, at most 0.01 in any entry. The prediction at q changes by q·δw=q·v₂. For (4,3), q·v₂=2.4−2.4=0, so the prediction does not change. For (3,−4), q·v₂=1.8+3.2=5, so it changes by 5. The fitted values and predictions at inputs like (4,3), which lies along v₁, are stable. What is unstable is the coefficient vector along v₂ and any prediction at an input with a large v₂ component, such as (3,−4). Rubric: coefficient change from division by σ₂; fitted-value change bounded by the data change; both predictions computed from q·v₂; the report's claim narrowed to the v₂ direction.</p>",
  "fields": [
    {
      "id": "dw",
      "label": "‖δw‖",
      "type": "num",
      "ans": 1
    },
    {
      "id": "pred",
      "label": "prediction changes at (4,3) and (3,−4)",
      "type": "vec",
      "ans": [
        0,
        5
      ]
    }
  ],
  "hints": {
    "dw": "A change of 0.01 along u₂ becomes 0.01/σ₂ along v₂.",
    "pred": "Each prediction changes by q·δw; compute q·v₂."
  }
},
A12: {
  "statement": "**A12 · Stretch · paper · extension — penalize roughness, not size.** Minimize ‖x−b‖²+λ‖Lx‖² for b=(0,2), λ=1 and the difference operator L=[[−1,1]]. Solve the normal equations, describe which vectors the penalty leaves untouched, and explain why the answer is not a shrunken copy of b.",
  "plain": "The normal equations are (I+λLᵀL)x=b with LᵀL=[[1,−1],[−1,1]]. At λ=1, [[2,−1],[−1,2]]x=(0,2), whose solution is x=(2/3, 4/3). The penalty ‖Lx‖²=(x₂−x₁)² is zero exactly on constant vectors, the kernel of L. Writing b=(1,1)+(−1,1), the constant part (1,1) passes untouched and the difference part is divided by 1+2λ=3, giving (1,1)+(−1/3,1/3)=(2/3,4/3). Ridge would shrink both parts towards zero; this penalty shrinks only roughness. Rubric: correct normal equations and solution; the kernel of L identified as the constants; the decomposition showing which part is damped.",
  "solution": "<p>The normal equations are (I+λLᵀL)x=b with LᵀL=[[1,−1],[−1,1]]. At λ=1, [[2,−1],[−1,2]]x=(0,2), whose solution is x=(2/3, 4/3). The penalty ‖Lx‖²=(x₂−x₁)² is zero exactly on constant vectors, the kernel of L. Writing b=(1,1)+(−1,1), the constant part (1,1) passes untouched and the difference part is divided by 1+2λ=3, giving (1,1)+(−1/3,1/3)=(2/3,4/3). Ridge would shrink both parts towards zero; this penalty shrinks only roughness. Rubric: correct normal equations and solution; the kernel of L identified as the constants; the decomposition showing which part is damped.</p>",
  "fields": [
    {
      "id": "x",
      "label": "solution x",
      "type": "vec",
      "ans": [
        0.6666666666666666,
        1.3333333333333333
      ]
    }
  ],
  "hints": {
    "x": "Solve (I+LᵀL)x=b with LᵀL=[[1,−1],[−1,1]]."
  }
},
A13: {
  "statement": "**A13 · Stretch · paper · extension — overshoot above 1/σ₁².** For A=diag(2,1), b=(2,1) and η=0.4, which lies in (1/σ₁², 2/σ₁²), compute the top channel's filter factor 1−(1−ησ₁²)ᵗ for t=1, 2, 3. Show that the iteration still converges, and explain why this is not a damping filter.",
  "plain": "Here σ₁²=4 and σ₂²=1, so 1/σ₁²=0.25 and 2/σ₁²=0.5, and η=0.4 lies between them. The top channel's ratio is 1−0.4·4=−0.6, so its filter factor 1−(−0.6)ᵗ is 1.6, 0.64 and 1.216 for t=1, 2, 3. Both ratios, −0.6 and 0.6, have absolute value below 1, so every channel converges and the limit is A⁺b=(1,1). But the top factor first overshoots to 1.6, then undershoots, oscillating around 1. A damping filter would rise steadily from 0 to 1, so this is not one. Rubric: the step range checked against σ₁²; the three factor values; convergence from |ratio|<1; the overshoot identified as the reason it is not a monotone filter.",
  "solution": "<p>Here σ₁²=4 and σ₂²=1, so 1/σ₁²=0.25 and 2/σ₁²=0.5, and η=0.4 lies between them. The top channel's ratio is 1−0.4·4=−0.6, so its filter factor 1−(−0.6)ᵗ is 1.6, 0.64 and 1.216 for t=1, 2, 3. Both ratios, −0.6 and 0.6, have absolute value below 1, so every channel converges and the limit is A⁺b=(1,1). But the top factor first overshoots to 1.6, then undershoots, oscillating around 1. A damping filter would rise steadily from 0 to 1, so this is not one. Rubric: the step range checked against σ₁²; the three factor values; convergence from |ratio|&lt;1; the overshoot identified as the reason it is not a monotone filter.</p>",
  "fields": [
    {
      "id": "f",
      "label": "top-channel filter factors at t = 1, 2, 3",
      "type": "vec",
      "ans": [
        1.6,
        0.64,
        1.216
      ]
    }
  ],
  "hints": {
    "f": "The ratio is 1−ησ₁² = −0.6; the factor after t steps is 1 minus its t-th power."
  }
},
B1: {
  "statement": "**B1 · Foundation · NumPy — three routines, three ranks.** For A=diag(1, 10⁻¹⁰, 10⁻¹⁵, 10⁻¹⁷) as a 4×4 matrix, report the rank implied by `np.linalg.pinv` (count the nonzero singular values of its output), by `np.linalg.matrix_rank`, and by the rank returned from `np.linalg.lstsq`, all at their defaults. Explain each answer from the documented tolerance, then choose an absolute tolerance from a stated noise level of 10⁻⁸ and report the rank again.",
  "plain": "Reference run: scripts/verify/la10/experiments/b1_tolerances.py with NumPy 2.0.2 in float64. The singular values are 1, 10⁻¹⁰, 10⁻¹⁵ and 10⁻¹⁷. `pinv` zeroes values less than or equal to 10⁻¹⁵·σ₁, so it discards both 10⁻¹⁵ and 10⁻¹⁷: the output has 2 nonzero singular values. The equality case at exactly 10⁻¹⁵ decides this. `matrix_rank` counts values greater than σ₁·max(m,n)·ε=4·2.22·10⁻¹⁶≈8.88·10⁻¹⁶, giving 3. `lstsq` treats as zero values smaller than ε·max(m,n)·σ₁, the same 8.88·10⁻¹⁶ since NumPy 2.0, and also reports rank 3. With an absolute tolerance of 10⁻⁸ from the stated noise level, only σ=1 is kept: rank 1. Measured output: ranks 2, 3, 3 and 1. Rubric: the three default ranks, each explained by the documented threshold and its comparison (≤ or <); the version recorded; the noise-based rank with the tolerance stated as absolute.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/b1_tolerances.py with NumPy 2.0.2 in float64. The singular values are 1, 10⁻¹⁰, 10⁻¹⁵ and 10⁻¹⁷. `pinv` zeroes values less than or equal to 10⁻¹⁵·σ₁, so it discards both 10⁻¹⁵ and 10⁻¹⁷: the output has 2 nonzero singular values. The equality case at exactly 10⁻¹⁵ decides this. `matrix_rank` counts values greater than σ₁·max(m,n)·ε=4·2.22·10⁻¹⁶≈8.88·10⁻¹⁶, giving 3. `lstsq` treats as zero values smaller than ε·max(m,n)·σ₁, the same 8.88·10⁻¹⁶ since NumPy 2.0, and also reports rank 3. With an absolute tolerance of 10⁻⁸ from the stated noise level, only σ=1 is kept: rank 1. Measured output: ranks 2, 3, 3 and 1. Rubric: the three default ranks, each explained by the documented threshold and its comparison (≤ or &lt;); the version recorded; the noise-based rank with the tolerance stated as absolute.</p>"
},
B2: {
  "statement": "**B2 · Core · NumPy — a Picard plot of a Hilbert system.** Build the 12×12 Hilbert matrix H with entries 1/(i+j+1), set x=(1,…,1) and b=Hx+e with Gaussian e of norm 10⁻⁸ from a fixed seed. Make the Picard plot from `np.linalg.svd`, locate where |uᵢᵀb| reaches the noise level, and compare that index with the truncation k that minimizes ‖x_k−x‖.",
  "plain": "Reference run: scripts/verify/la10/experiments/b2_hilbert_picard.py (NumPy 2.0.2, seed 0 for `np.random.default_rng`, e scaled to norm exactly 10⁻⁸). The singular values fall from 1.80 to 1.04·10⁻¹⁶. The observed |uᵢᵀb| fall from 5.17 to 1.27·10⁻⁷ at channel 6, then sit between about 6·10⁻¹⁰ and 7·10⁻⁹ for channels 7–12, near the per-channel noise level 10⁻⁸/√12≈2.9·10⁻⁹: the plateau begins at channel 7. The ratios |uᵢᵀb|/σᵢ fall to 1.1·10⁻² at channel 6 and then climb to 5.9·10⁶. The truncation error is smallest at k=6, with error 2.32·10⁻³, against 5.92·10⁶ with all 12 channels. The best cutoff sits just before the plateau. The last singular values are near rounding level, so their computed u and v are themselves inaccurate; this does not change the conclusion, since those channels are discarded. Rubric: construction, seed and noise scaling stated; the Picard plot with all three series; the plateau index and best k compared; the remark about singular values at rounding level.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/b2_hilbert_picard.py (NumPy 2.0.2, seed 0 for `np.random.default_rng`, e scaled to norm exactly 10⁻⁸). The singular values fall from 1.80 to 1.04·10⁻¹⁶. The observed |uᵢᵀb| fall from 5.17 to 1.27·10⁻⁷ at channel 6, then sit between about 6·10⁻¹⁰ and 7·10⁻⁹ for channels 7–12, near the per-channel noise level 10⁻⁸/√12≈2.9·10⁻⁹: the plateau begins at channel 7. The ratios |uᵢᵀb|/σᵢ fall to 1.1·10⁻² at channel 6 and then climb to 5.9·10⁶. The truncation error is smallest at k=6, with error 2.32·10⁻³, against 5.92·10⁶ with all 12 channels. The best cutoff sits just before the plateau. The last singular values are near rounding level, so their computed u and v are themselves inaccurate; this does not change the conclusion, since those channels are discarded. Rubric: construction, seed and noise scaling stated; the Picard plot with all three series; the plateau index and best k compared; the remark about singular values at rounding level.</p>"
},
B3: {
  "statement": "**B3 · Core · NumPy — L-curve against the discrepancy principle.** Build a 64×64 Gaussian blur matrix A with entries exp(−(i−j)²/(2·3²)) normalized so each row sums to 1, a smooth true signal, and noise of known norm δ. Compute the ridge solution on a grid of λ, find the L-curve's maximum-curvature point and the discrepancy choice with τ=1.1, and report both errors. Report honestly whichever fails, and whether the L-curve corner is stable when the grid density changes.",
  "plain": "Reference run: scripts/verify/la10/experiments/b3_lcurve_discrepancy.py (NumPy 2.0.2, seed 1). A has entries exp(−(i−j)²/18), each row divided by its sum; x_j=exp(−((j−20)/6)²)+0.6·exp(−((j−44)/4)²), so ‖x‖≈3.054; e is Gaussian scaled to δ=10⁻³. Ridge is computed from the SVD filter, on a grid of λ from 10⁻¹⁴ to 1. The L-curve's maximum discrete curvature is at λ≈1.0·10⁻⁷ with 10 points per decade, and 1.1·10⁻⁷ with 20, both with error about 0.24–0.25. The discrepancy principle with τ=1.1, bracketed on [10⁻¹⁴, 1] and bisected in log λ, gives λ≈1.75·10⁻⁴ with error 0.0207. The best λ on a fine grid is 1.58·10⁻⁴, also with error 0.0207. Here the L-curve corner fails: it under-regularizes by three orders of magnitude, with twelve times the discrepancy error. Its location moves slightly with grid density but stays in the wrong place. Rubric: matrices, signal, seed and δ stated; both choices computed by a documented method with the bracket checked; both errors reported; the failing method named; grid sensitivity of the corner tested.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/b3_lcurve_discrepancy.py (NumPy 2.0.2, seed 1). A has entries exp(−(i−j)²/18), each row divided by its sum; x_j=exp(−((j−20)/6)²)+0.6·exp(−((j−44)/4)²), so ‖x‖≈3.054; e is Gaussian scaled to δ=10⁻³. Ridge is computed from the SVD filter, on a grid of λ from 10⁻¹⁴ to 1. The L-curve's maximum discrete curvature is at λ≈1.0·10⁻⁷ with 10 points per decade, and 1.1·10⁻⁷ with 20, both with error about 0.24–0.25. The discrepancy principle with τ=1.1, bracketed on [10⁻¹⁴, 1] and bisected in log λ, gives λ≈1.75·10⁻⁴ with error 0.0207. The best λ on a fine grid is 1.58·10⁻⁴, also with error 0.0207. Here the L-curve corner fails: it under-regularizes by three orders of magnitude, with twelve times the discrepancy error. Its location moves slightly with grid density but stays in the wrong place. Rubric: matrices, signal, seed and δ stated; both choices computed by a documented method with the bracket checked; both errors reported; the failing method named; grid sensitivity of the corner tested.</p>"
},
B4: {
  "statement": "**B4 · Stretch · NumPy — normal equations against stacked QR.** Build a 200×20 matrix A=UΣVᵀ with orthonormal factors from seeded Gaussian matrices and singular values spaced logarithmically from 1 to 10⁻⁸, so κ₂=10⁸. Take b=A·(1,…,1)+r, where r has norm 10⁻⁶ and is orthogonal to range(A). For λ=10⁻¹² and λ=10⁻⁴, solve ridge three ways: `np.linalg.solve` on AᵀA+λI, `np.linalg.lstsq` on the stacked system [A; √λI], and the filter formula from the known factors. Report each method's relative difference from the filter answer, and relate the measured differences to the two condition numbers of Section 7.3, saying what those numbers do and do not guarantee.",
  "plain": "Reference run: scripts/verify/la10/experiments/b4_ridge_algorithms.py (NumPy 2.0.2, seed 2). U and V come from QR factors of Gaussian matrices, σ is `np.logspace(0, -8, 20)`, b=A·(1,…,1)+r with ‖r‖=10⁻⁶ orthogonal to range(A), and the filter formula V·(σ/(σ²+λ)·Uᵀb) is the reference. At λ=10⁻¹², κ₂(AᵀA+λI)=10¹² and the stacked matrix has condition number 10⁶. Measured relative differences from the filter answer: 3.9·10⁻⁵ for the normal equations, 4.7·10⁻¹² for stacked `lstsq`. At λ=10⁻⁴ the numbers are 10⁴ and 10², and the differences are 6.9·10⁻¹³ and 3.3·10⁻¹⁵. The condition numbers bound how much rounding errors of size about u≈1.1·10⁻¹⁶ can be amplified: up to about 10¹²u≈10⁻⁴ for the normal equations at λ=10⁻¹², and 10⁶u≈10⁻¹⁰ for the stacked problem. The measured differences lie within those ceilings and are smaller than them; the bounds do not predict the exact digits. The extra loss of the normal equations comes from forming AᵀA, an algorithmic error. The stacked least-squares problem has its own sensitivity, including the residual term of Section 5.3, which no algorithm removes. Rubric: construction with the stated b; three solutions and both λ; relative differences reported as measurements; bounds read as ceilings, not predictions; the algorithmic loss distinguished from the problem's sensitivity.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/b4_ridge_algorithms.py (NumPy 2.0.2, seed 2). U and V come from QR factors of Gaussian matrices, σ is `np.logspace(0, -8, 20)`, b=A·(1,…,1)+r with ‖r‖=10⁻⁶ orthogonal to range(A), and the filter formula V·(σ/(σ²+λ)·Uᵀb) is the reference. At λ=10⁻¹², κ₂(AᵀA+λI)=10¹² and the stacked matrix has condition number 10⁶. Measured relative differences from the filter answer: 3.9·10⁻⁵ for the normal equations, 4.7·10⁻¹² for stacked `lstsq`. At λ=10⁻⁴ the numbers are 10⁴ and 10², and the differences are 6.9·10⁻¹³ and 3.3·10⁻¹⁵. The condition numbers bound how much rounding errors of size about u≈1.1·10⁻¹⁶ can be amplified: up to about 10¹²u≈10⁻⁴ for the normal equations at λ=10⁻¹², and 10⁶u≈10⁻¹⁰ for the stacked problem. The measured differences lie within those ceilings and are smaller than them; the bounds do not predict the exact digits. The extra loss of the normal equations comes from forming AᵀA, an algorithmic error. The stacked least-squares problem has its own sensitivity, including the residual term of Section 5.3, which no algorithm removes. Rubric: construction with the stated b; three solutions and both λ; relative differences reported as measurements; bounds read as ceilings, not predictions; the algorithmic loss distinguished from the problem's sensitivity.</p>"
},
C1: {
  "statement": "**C1 · Core · PyTorch — where autograd descent lands.** For a random 20×100 matrix A and b in float64, run plain gradient descent on ½‖Ax−b‖² with autograd, once from zero and once from a random start x₀. Compare each limit with `torch.linalg.pinv(A) @ b`, and show that the difference in the second case equals the projection of x₀ onto ker(A).",
  "plain": "Reference run: scripts/verify/la10/experiments/c1_gd_kernel.py (PyTorch 2.8.0, float64, `torch.manual_seed(0)`, A of size 20×100). The step is η=1/σ₁²≈5.39·10⁻³, inside the monotone range, and the run stops when the gradient norm falls below 10⁻¹². From zero: 157 steps, residual 1.3·10⁻¹³, and distance 2.3·10⁻¹⁴ from `torch.linalg.pinv(A) @ b`. From a random start x₀ with a kernel part x₀−A⁺Ax₀ of norm 9.52: 164 steps, residual 1.4·10⁻¹³, distance 9.52 from the pinv solution, and distance 2.7·10⁻¹⁴ from the predicted limit A⁺b+(x₀−A⁺Ax₀). So the second run converged to a different solution, and the difference is exactly the kernel part of the start, as Theorem 11 predicts. Rubric: a valid step size stated; stopping rule and residuals reported; the zero-start comparison with pinv; the kernel projection computed independently and matched.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/c1_gd_kernel.py (PyTorch 2.8.0, float64, `torch.manual_seed(0)`, A of size 20×100). The step is η=1/σ₁²≈5.39·10⁻³, inside the monotone range, and the run stops when the gradient norm falls below 10⁻¹². From zero: 157 steps, residual 1.3·10⁻¹³, and distance 2.3·10⁻¹⁴ from `torch.linalg.pinv(A) @ b`. From a random start x₀ with a kernel part x₀−A⁺Ax₀ of norm 9.52: 164 steps, residual 1.4·10⁻¹³, distance 9.52 from the pinv solution, and distance 2.7·10⁻¹⁴ from the predicted limit A⁺b+(x₀−A⁺Ax₀). So the second run converged to a different solution, and the difference is exactly the kernel part of the start, as Theorem 11 predicts. Rubric: a valid step size stated; stopping rule and residuals reported; the zero-start comparison with pinv; the kernel projection computed independently and matched.</p>"
},
C2: {
  "statement": "**C2 · Core · PyTorch — weight decay, ridge, and Adam.** For an overdetermined least-squares problem, take the objective f(w)=‖Xw−y‖²/(2N)+(λ/2)‖w‖², minimized by the solution of (XᵀX/N+λI)w=Xᵀy/N. Minimize it with full-batch SGD and `weight_decay=λ`. Then repeat with `torch.optim.Adam(weight_decay=λ)`, which adds λw to the gradient before the adaptive step (`decoupled_weight_decay=False`), and with `torch.optim.AdamW(weight_decay=λ)`. Report each run's distance from the ridge solution, and explain which runs minimize f and why the other does not.",
  "plain": "Reference run: scripts/verify/la10/experiments/c2_weight_decay.py (PyTorch 2.8.0, float64, `torch.manual_seed(1)`, N=200, d=5, λ=0.1, columns scaled by 1, 2, 4, 0.5, 1; 40,000 full-batch steps with the learning rate cut by 100 halfway). SGD with weight_decay=λ adds λw to the gradient of ‖Xw−y‖²/(2N), so it is gradient descent on f; its distance from the ridge solution is 3.7·10⁻¹⁴. Adam with weight_decay=λ and decoupled_weight_decay=False also adds λw to the loss gradient before forming its moments. It is therefore Adam applied to the same fixed objective f, and its stationary points are those of f; it ends at distance 2.0·10⁻⁷, with ridge-gradient norm 1.1·10⁻⁶. This identifies the objective; it does not promise convergence for every Adam setting. AdamW instead shrinks w by a factor 1−ηλ outside the adaptive step. Its stationary condition involves the adaptively scaled loss gradient, roughly D∇loss(w)+λw=0 for the effective scaling D, not ∇loss(w)+λw=0, so it does not minimize f: it ends at distance 0.97, with ridge-gradient norm 0.38. Rubric: the objective and its normalization stated; SGD and coupled Adam both matched to the closed form, with the reason; AdamW's different stationary condition explained; numerical distances reported.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/c2_weight_decay.py (PyTorch 2.8.0, float64, `torch.manual_seed(1)`, N=200, d=5, λ=0.1, columns scaled by 1, 2, 4, 0.5, 1; 40,000 full-batch steps with the learning rate cut by 100 halfway). SGD with weight_decay=λ adds λw to the gradient of ‖Xw−y‖²/(2N), so it is gradient descent on f; its distance from the ridge solution is 3.7·10⁻¹⁴. Adam with weight_decay=λ and decoupled_weight_decay=False also adds λw to the loss gradient before forming its moments. It is therefore Adam applied to the same fixed objective f, and its stationary points are those of f; it ends at distance 2.0·10⁻⁷, with ridge-gradient norm 1.1·10⁻⁶. This identifies the objective; it does not promise convergence for every Adam setting. AdamW instead shrinks w by a factor 1−ηλ outside the adaptive step. Its stationary condition involves the adaptively scaled loss gradient, roughly D∇loss(w)+λw=0 for the effective scaling D, not ∇loss(w)+λw=0, so it does not minimize f: it ends at distance 0.97, with ridge-gradient norm 0.38. Rubric: the objective and its normalization stated; SGD and coupled Adam both matched to the closed form, with the reason; AdamW's different stationary condition explained; numerical distances reported.</p>"
},
C3: {
  "statement": "**C3 · Stretch · PyTorch · extension — a parameterization with a sparse bias.** For an underdetermined system with a sparse signed solution, parameterize w=u⊙u−v⊙v with u₀=v₀=α·1 and run small-step gradient descent at α=10⁻³ and α=1. Compare the ℓ₁ and ℓ₂ norms of the two limits with the minimum-ℓ₂ solution. State which theorem the experiment illustrates and why it does not certify it.",
  "plain": "Reference run: scripts/verify/la10/experiments/c3_signed_param.py (PyTorch 2.8.0, float64, `torch.manual_seed(3)`, A of size 20×60 scaled by 1/√20, w* with entries 1.5, −2 and 1 at positions 3, 17 and 41). The minimum-ℓ₂ solution has ℓ₁ norm 8.97 and ℓ₂ norm 1.81, against ‖w*‖₁=4.5. At α=10⁻³ with step 0.05, after 400,000 steps (residual 5·10⁻⁷), the limit has ℓ₁ norm 4.52 and lies within 0.013 of the sparse w*. At α=1 with step 0.005, after 572 steps (residual 1.4·10⁻⁸), it has ℓ₁ norm 8.88 and lies within 0.033 of the minimum-ℓ₂ solution. This illustrates the result of Woodworth and coauthors: small initialization behaves like ℓ₁ minimization, large like ℓ₂. It cannot certify it, because the theorem concerns gradient flow and the limit α→0 after convergence, while this run uses finite steps, a finite α, and convergence observed rather than assumed. Rubric: signed parameterization and initialization; both α with step, step count and residual; norms compared with w* and the minimum-ℓ₂ solution; the limits of the evidence stated.",
  "solution": "<p>Reference run: scripts/verify/la10/experiments/c3_signed_param.py (PyTorch 2.8.0, float64, `torch.manual_seed(3)`, A of size 20×60 scaled by 1/√20, w* with entries 1.5, −2 and 1 at positions 3, 17 and 41). The minimum-ℓ₂ solution has ℓ₁ norm 8.97 and ℓ₂ norm 1.81, against ‖w*‖₁=4.5. At α=10⁻³ with step 0.05, after 400,000 steps (residual 5·10⁻⁷), the limit has ℓ₁ norm 4.52 and lies within 0.013 of the sparse w*. At α=1 with step 0.005, after 572 steps (residual 1.4·10⁻⁸), it has ℓ₁ norm 8.88 and lies within 0.033 of the minimum-ℓ₂ solution. This illustrates the result of Woodworth and coauthors: small initialization behaves like ℓ₁ minimization, large like ℓ₂. It cannot certify it, because the theorem concerns gradient flow and the limit α→0 after convergence, while this run uses finite steps, a finite α, and convergence observed rather than assumed. Rubric: signed parameterization and initialization; both α with step, step count and residual; norms compared with w* and the minimum-ℓ₂ solution; the limits of the evidence stated.</p>"
},
M1: {
  "statement": "**M1 · Core · mixed — one fit, three chapters.** Let A be the 3×2 matrix with columns (3,0,0) and (0,0.01,0), and b=(3, 0.02, 1). Find the projection of b onto range(A) and the residual, the least-squares solution, the best rank-one approximation of A and its 2-norm error, the truncated solution keeping one channel, and the sensitivity factor κ₂/cosθ. Which of the two solutions would you report, and on what evidence?",
  "plain": "The projection of b onto range(A), the span of e₁ and e₂, is ŷ=(3, 0.02, 0), with residual (0,0,1). The least-squares solution is x=(3/3, 0.02/0.01)=(1, 2). The best rank-one approximation keeps the σ₁=3 channel, [[3,0],[0,0],[0,0]], with 2-norm error σ₂=0.01 by Eckart–Young. The truncated solution keeping one channel is (1, 0). κ₂=300 and cosθ=‖ŷ‖/‖b‖=√9.0004/√10.0004≈0.9487, so κ₂/cosθ≈316. The second coordinate 2 rests entirely on the observation 0.02 in a channel of gain 0.01; if that entry is uncertain at the level 0.01, report (1,0) with that caveat, otherwise (1,2). Rubric: projection and residual; both solutions; the rank-one error by Eckart–Young; the sensitivity factor; a reporting decision tied to the noise level.",
  "solution": "<p>The projection of b onto range(A), the span of e₁ and e₂, is ŷ=(3, 0.02, 0), with residual (0,0,1). The least-squares solution is x=(3/3, 0.02/0.01)=(1, 2). The best rank-one approximation keeps the σ₁=3 channel, [[3,0],[0,0],[0,0]], with 2-norm error σ₂=0.01 by Eckart–Young. The truncated solution keeping one channel is (1, 0). κ₂=300 and cosθ=‖ŷ‖/‖b‖=√9.0004/√10.0004≈0.9487, so κ₂/cosθ≈316. The second coordinate 2 rests entirely on the observation 0.02 in a channel of gain 0.01; if that entry is uncertain at the level 0.01, report (1,0) with that caveat, otherwise (1,2). Rubric: projection and residual; both solutions; the rank-one error by Eckart–Young; the sensitivity factor; a reporting decision tied to the noise level.</p>",
  "fields": [
    {
      "id": "x",
      "label": "least-squares solution",
      "type": "vec",
      "ans": [
        1,
        2
      ]
    },
    {
      "id": "factor",
      "label": "κ₂/cosθ",
      "type": "num",
      "ans": 316.22706331891925
    }
  ],
  "hints": {
    "x": "Each column has one nonzero entry; divide the matching entries of b.",
    "factor": "cosθ is the length of the projection of b over the length of b."
  }
},
M2: {
  "statement": "**M2 · Core · mixed — conditioning bought by ridge.** A 3×2 matrix has singular values 10 and 0.1. Give κ₂(AᵀA), κ₂(AᵀA+λI) at λ=0.01, and the condition number of the stacked matrix [A; √λI]. Explain which of these governs the accuracy of a QR solve of the stacked problem, and which the accuracy of solving the normal equations.",
  "plain": "κ₂(AᵀA)=(10/0.1)²=10⁴. With λ=0.01, κ₂(AᵀA+λI)=(100+0.01)/(0.01+0.01)=5000.5, since a 3×2 matrix with two positive singular values has μ_min=σ₂²=0.01. The stacked matrix has condition number √5000.5≈70.7. Solving the normal equations directly can amplify rounding in the formed matrix AᵀA+λI by up to about 5000.5. A QR solve of the stacked problem avoids forming that matrix, so its extra algorithmic error is governed by about 70.7. The stacked problem is still a least-squares problem, so its intrinsic sensitivity also has the residual-dependent term of Section 5.3, which grows like κ²tanθ with κ≈70.7 and no algorithm removes. Rubric: the three numbers; μ_min identified correctly; the square-root relation; the algorithmic error of forming the Gram matrix distinguished from the stacked problem's own least-squares sensitivity.",
  "solution": "<p>κ₂(AᵀA)=(10/0.1)²=10⁴. With λ=0.01, κ₂(AᵀA+λI)=(100+0.01)/(0.01+0.01)=5000.5, since a 3×2 matrix with two positive singular values has μ_min=σ₂²=0.01. The stacked matrix has condition number √5000.5≈70.7. Solving the normal equations directly can amplify rounding in the formed matrix AᵀA+λI by up to about 5000.5. A QR solve of the stacked problem avoids forming that matrix, so its extra algorithmic error is governed by about 70.7. The stacked problem is still a least-squares problem, so its intrinsic sensitivity also has the residual-dependent term of Section 5.3, which grows like κ²tanθ with κ≈70.7 and no algorithm removes. Rubric: the three numbers; μ_min identified correctly; the square-root relation; the algorithmic error of forming the Gram matrix distinguished from the stacked problem's own least-squares sensitivity.</p>",
  "fields": [
    {
      "id": "kappas",
      "label": "κ₂(AᵀA), κ₂(AᵀA+λI), stacked condition number",
      "type": "vec",
      "ans": [
        10000.0,
        5000.5,
        70.71421356417676
      ]
    }
  ],
  "hints": {
    "kappas": "Use (σ₁²+λ)/(σ₂²+λ) for the ridge matrix, and its square root for the stacked one."
  }
},
M3: {
  "statement": "**M3 · Stretch · mixed — weights and a penalty together.** Minimize (Ax−b)ᵀW(Ax−b)+λ‖x‖² for A=[[1],[1]], W=diag(1,3), b=(1,3) and λ=1. Derive the normal equations from the weighted geometry of [LA03](03-projections-least-squares.md), solve them, and show that the answer is the ordinary ridge solution for the rescaled problem W^½Ax≈W^½b.",
  "plain": "The objective is (Ax−b)ᵀW(Ax−b)+λxᵀx. Setting its gradient to zero gives (AᵀWA+λI)x=AᵀWb, the weighted normal equations of LA03 with λI added. Here AᵀWA=1+3=4 and AᵀWb=1+9=10, so (4+1)x=10 and x=2. Rescaling, W^½A=(1,√3) and W^½b=(1,3√3), and ordinary ridge on these gives ((1+3)+1)x=1+9, the same equation. The weighted problem is ridge in the geometry where the residual is measured by W. Rubric: correct normal equations from the gradient; the value x=2; the rescaled problem shown to give the same equations.",
  "solution": "<p>The objective is (Ax−b)ᵀW(Ax−b)+λxᵀx. Setting its gradient to zero gives (AᵀWA+λI)x=AᵀWb, the weighted normal equations of LA03 with λI added. Here AᵀWA=1+3=4 and AᵀWb=1+9=10, so (4+1)x=10 and x=2. Rescaling, W^½A=(1,√3) and W^½b=(1,3√3), and ordinary ridge on these gives ((1+3)+1)x=1+9, the same equation. The weighted problem is ridge in the geometry where the residual is measured by W. Rubric: correct normal equations from the gradient; the value x=2; the rescaled problem shown to give the same equations.</p>",
  "fields": [
    {
      "id": "x",
      "label": "minimizer x",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "x": "Compute AᵀWA and AᵀWb, then add λ to the first."
  }
},
K1: {
  "statement": "**K1 · Foundation · gate — answer the two opening questions.** In a paragraph each, without formulas until the last sentence, explain which solution a least-squares routine returns when there are many, and why the coefficients of the near-collinear fit jumped while the fitted values did not.",
  "plain": "When many coefficient vectors fit equally well, they differ by moves the matrix cannot see, the directions of its kernel. A least-squares routine based on the SVD keeps none of those invisible parts, so it returns the shortest equally good answer, the one in the row space. In the near-collinear fit, the difference of the two features is a direction the data barely see, a channel with a tiny gain. Any part of the observations that lands there, including a small disturbance, is divided by that gain, so the coefficients move a great deal along the weak direction while the fitted values change only by the disturbance itself. In formulas: x†=A⁺b, and the jump is δw=(u₁ᵀδy/σ₁)v₁+(u₂ᵀδy/σ₂)v₂≈(u₂ᵀδy/σ₂)v₂, since the first term is about 0.0005. Rubric: the invisible directions named; shortest equally good answer in the row space; division by a small singular value; fitted values change only by the small amount that was divided; formulas only at the end.",
  "solution": "<p>When many coefficient vectors fit equally well, they differ by moves the matrix cannot see, the directions of its kernel. A least-squares routine based on the SVD keeps none of those invisible parts, so it returns the shortest equally good answer, the one in the row space. In the near-collinear fit, the difference of the two features is a direction the data barely see, a channel with a tiny gain. Any part of the observations that lands there, including a small disturbance, is divided by that gain, so the coefficients move a great deal along the weak direction while the fitted values change only by the disturbance itself. In formulas: x†=A⁺b, and the jump is δw=(u₁ᵀδy/σ₁)v₁+(u₂ᵀδy/σ₂)v₂≈(u₂ᵀδy/σ₂)v₂, since the first term is about 0.0005. Rubric: the invisible directions named; shortest equally good answer in the row space; division by a small singular value; fitted values change only by the small amount that was divided; formulas only at the end.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — derive ridge with its assumptions.** Starting from the objective ‖Ax−b‖²+λ‖x‖², derive its unique minimizer, its SVD form, and its limit as λ→0⁺. Mark every step that uses λ>0, and say what fails at λ=0 when A is rank-deficient.",
  "plain": "Expand ‖Ax−b‖²+λ‖x‖²=xᵀ(AᵀA+λI)x−2bᵀAx+bᵀb. For λ>0, xᵀ(AᵀA+λI)x=‖Ax‖²+λ‖x‖²>0 for x≠0, so the matrix is positive definite (uses λ>0), the quadratic has exactly one minimizer, and it solves (AᵀA+λI)x=Aᵀb. In an orthonormal basis of right singular vectors completed by a kernel basis, the matrix is diagonal with entries σᵢ²+λ and λ (the kernel entries are invertible only because λ>0), while Aᵀb has coordinates σᵢβᵢ and zero. So x_λ=Σσᵢβᵢ/(σᵢ²+λ)vᵢ. As λ→0⁺, each factor tends to 1/σᵢ, giving A⁺b. At λ=0 with A rank-deficient, AᵀA is singular, the minimizer is not unique, and the kernel coordinates are undetermined; the limit selects the one with zero kernel part. Rubric: positive definiteness with λ>0 marked; the SVD-basis computation with the kernel entries; the limit; the failure at λ=0 explained.",
  "solution": "<p>Expand ‖Ax−b‖²+λ‖x‖²=xᵀ(AᵀA+λI)x−2bᵀAx+bᵀb. For λ&gt;0, xᵀ(AᵀA+λI)x=‖Ax‖²+λ‖x‖²&gt;0 for x≠0, so the matrix is positive definite (uses λ&gt;0), the quadratic has exactly one minimizer, and it solves (AᵀA+λI)x=Aᵀb. In an orthonormal basis of right singular vectors completed by a kernel basis, the matrix is diagonal with entries σᵢ²+λ and λ (the kernel entries are invertible only because λ&gt;0), while Aᵀb has coordinates σᵢβᵢ and zero. So x_λ=Σσᵢβᵢ/(σᵢ²+λ)vᵢ. As λ→0⁺, each factor tends to 1/σᵢ, giving A⁺b. At λ=0 with A rank-deficient, AᵀA is singular, the minimizer is not unique, and the kernel coordinates are undetermined; the limit selects the one with zero kernel part. Rubric: positive definiteness with λ&gt;0 marked; the SVD-basis computation with the kernel entries; the limit; the failure at λ=0 explained.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — a small case end to end.** For A=[[2,0],[0,0],[0,1]] and b=(2,5,3), find A⁺, the least-squares solution, the residual, and the ridge solution at λ=1.",
  "plain": "A has orthogonal columns 2e₁ and e₃, so its compact SVD has σ=(2,1), u₁=e₁, v₁=e₁, u₂=e₃, v₂=e₂. Hence A⁺=[[1/2,0,0],[0,0,1]]. The least-squares solution is A⁺b=(1, 3), the residual is b−Ax=(0,5,0), and it is perpendicular to both columns. Ridge at λ=1 multiplies each channel by σ/(σ²+λ): 2/(4+1)·2=0.8 and 1/(1+1)·3=1.5, so x_λ=(0.8, 1.5).",
  "solution": "<p>A has orthogonal columns 2e₁ and e₃, so its compact SVD has σ=(2,1), u₁=e₁, v₁=e₁, u₂=e₃, v₂=e₂. Hence A⁺=[[1/2,0,0],[0,0,1]]. The least-squares solution is A⁺b=(1, 3), the residual is b−Ax=(0,5,0), and it is perpendicular to both columns. Ridge at λ=1 multiplies each channel by σ/(σ²+λ): 2/(4+1)·2=0.8 and 1/(1+1)·3=1.5, so x_λ=(0.8, 1.5).</p>",
  "fields": [
    {
      "id": "x",
      "label": "least-squares solution",
      "type": "vec",
      "ans": [
        1,
        3
      ]
    },
    {
      "id": "r",
      "label": "residual",
      "type": "vec",
      "ans": [
        0,
        5,
        0
      ]
    },
    {
      "id": "ridge",
      "label": "ridge solution at λ=1",
      "type": "vec",
      "ans": [
        0.8,
        1.5
      ]
    }
  ],
  "hints": {
    "x": "The columns are 2e₁ and e₃: read off the matching entries of b.",
    "r": "Only the entry of b that no column reaches survives.",
    "ridge": "Each channel contributes σβ/(σ²+λ)."
  }
},
K4: {
  "statement": "**K4 · Core · gate — debug a ridge solver.** A `ridge_solve` passes every test with λ=0 but uses the filter σᵢ/(σᵢ+λ). For a channel with σ=0.1 and λ=0.01, give the correct and the buggy filter factors. Explain why the λ=0 tests could not catch the bug, and design a check that would.",
  "plain": "The correct factor is σ²/(σ²+λ)=0.01/0.02=0.5. The buggy factor is σ/(σ+λ)=0.1/0.11≈0.909. At λ=0 both formulas equal 1, so the tests with λ=0 cannot distinguish them. A check that catches the bug compares the result with an independent solve of (AᵀA+λI)x=Aᵀb at a λ comparable to σ², or checks a single channel with known σ and λ, as Lab B does with f₂≈0.00956. Rubric: both factor values; why λ=0 cannot detect the difference; an independent oracle at positive λ near σ².",
  "solution": "<p>The correct factor is σ²/(σ²+λ)=0.01/0.02=0.5. The buggy factor is σ/(σ+λ)=0.1/0.11≈0.909. At λ=0 both formulas equal 1, so the tests with λ=0 cannot distinguish them. A check that catches the bug compares the result with an independent solve of (AᵀA+λI)x=Aᵀb at a λ comparable to σ², or checks a single channel with known σ and λ, as Lab B does with f₂≈0.00956. Rubric: both factor values; why λ=0 cannot detect the difference; an independent oracle at positive λ near σ².</p>",
  "fields": [
    {
      "id": "f",
      "label": "correct and buggy filter factors",
      "type": "vec",
      "ans": [
        0.5,
        0.9090909090909092
      ]
    }
  ],
  "hints": {
    "f": "Square σ in the correct formula; the buggy one uses σ itself."
  }
},
K5: {
  "statement": "**K5 · Stretch · gate — critique a generalization claim.** A report says: \"Gradient descent found the minimum-norm interpolating solution, so the model will generalize well.\" Identify what Section 10 does establish, the conditions it needs, and what the claim adds that no theorem in this chapter supports.",
  "plain": "Section 10 establishes that plain gradient descent on squared loss for a linear model, with 0<η<2/σ₁², converges to A⁺b+P_{ker A}x₀, so from zero it reaches the minimum-norm solution. That needs zero (or row-space) initialization, no preconditioning or adaptive scaling, the linear parameterization, squared loss, and a step in the convergence range. The claim adds that this solution generalizes. Nothing in the chapter supports that: the minimum-norm interpolator can fit noise, as the full-inversion solutions of Sections 6 and 9 did, and whether it predicts well depends on the data distribution and noise, the subject of PS06 and PS12. Rubric: the theorem stated with all its conditions; the unsupported step from implicit bias to generalization identified; a counterexample or reference to the chapter's over-fitting examples; the statistical question deferred correctly.",
  "solution": "<p>Section 10 establishes that plain gradient descent on squared loss for a linear model, with 0&lt;η&lt;2/σ₁², converges to A⁺b+P_{ker A}x₀, so from zero it reaches the minimum-norm solution. That needs zero (or row-space) initialization, no preconditioning or adaptive scaling, the linear parameterization, squared loss, and a step in the convergence range. The claim adds that this solution generalizes. Nothing in the chapter supports that: the minimum-norm interpolator can fit noise, as the full-inversion solutions of Sections 6 and 9 did, and whether it predicts well depends on the data distribution and noise, the subject of PS06 and PS12. Rubric: the theorem stated with all its conditions; the unsupported step from implicit bias to generalization identified; a counterexample or reference to the chapter's over-fitting examples; the statistical question deferred correctly.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — defend a different penalty.** You must reconstruct a smooth signal sampled at 100 points from blurred, noisy data. Argue for or against replacing the ridge penalty λ‖x‖² by λ‖Dx‖², where D takes first differences. Say what each penalty treats as simple, which vectors D leaves unpenalized, how you would choose λ, and what the normal equations become.",
  "plain": "Ridge treats the zero vector as simplest and shrinks every channel towards it, including the smooth bulk of the signal. The penalty ‖Dx‖² treats constant signals as simplest, since D annihilates them, and penalizes roughness. Blur suppresses the high-frequency components of a signal; inverting it would amplify the noise in exactly those components, which are the ones ‖Dx‖² penalizes most. For a target that really is smooth, this can give a better reconstruction than ridge at a comparable level of noise suppression, but that is an assumption about the target, not an automatic gain. The normal equations become (AᵀA+λDᵀD)x=Aᵀb, which has a unique solution when ker(A)∩ker(D)={0}, here when A does not annihilate constants. Choose λ by the discrepancy principle if δ is known, otherwise by validation, and check the residual against the noise. The argument fails if the signal has jumps, which ‖Dx‖² smears. Rubric: what each penalty treats as simple; the kernel of D; the role of blur in suppressing high frequencies; the smoothness assumption stated as an assumption; normal equations and uniqueness condition; a parameter-choice rule; a stated limitation.",
  "solution": "<p>Ridge treats the zero vector as simplest and shrinks every channel towards it, including the smooth bulk of the signal. The penalty ‖Dx‖² treats constant signals as simplest, since D annihilates them, and penalizes roughness. Blur suppresses the high-frequency components of a signal; inverting it would amplify the noise in exactly those components, which are the ones ‖Dx‖² penalizes most. For a target that really is smooth, this can give a better reconstruction than ridge at a comparable level of noise suppression, but that is an assumption about the target, not an automatic gain. The normal equations become (AᵀA+λDᵀD)x=Aᵀb, which has a unique solution when ker(A)∩ker(D)={0}, here when A does not annihilate constants. Choose λ by the discrepancy principle if δ is known, otherwise by validation, and check the residual against the noise. The argument fails if the signal has jumps, which ‖Dx‖² smears. Rubric: what each penalty treats as simple; the kernel of D; the role of blur in suppressing high frequencies; the smoothness assumption stated as an assumption; normal equations and uniqueness condition; a parameter-choice rule; a stated limitation.</p>"
}
});
