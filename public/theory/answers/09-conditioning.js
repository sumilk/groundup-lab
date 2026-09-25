/* Authored offline checks and reference rubrics. Tiny quantities use explicit scaled units. */
GU.answers("09-conditioning", {
A1: {
  "statement": "**A1 · Foundation · paper — choose the measurement.** Give the 1-, 2-, and infinity norms of x=(2,−1,2), in that order. State what each measures, and check both √n comparison inequalities for n=3. Is either an equality?",
  "plain": "The norms are 5, 3, and 2. They measure total absolute coordinate size, Euclidean length, and largest absolute coordinate respectively. The comparisons hold: ‖x‖₁=5≤√3·3≈5.196 and ‖x‖₂=3≤√3·2≈3.464. Neither is an equality, because the coordinate magnitudes 2, 1, 2 are not all equal; equality in both √n bounds requires equal-magnitude coordinates. The chain ‖x‖∞≤‖x‖₂≤‖x‖₁ reads 2≤3≤5.",
  "solution": "<p>The norms are 5, 3, and 2. They measure total absolute coordinate size, Euclidean length, and largest absolute coordinate respectively. The comparisons hold: ‖x‖₁=5≤√3·3≈5.196 and ‖x‖₂=3≤√3·2≈3.464. Neither is an equality, because the coordinate magnitudes 2, 1, 2 are not all equal; equality in both √n bounds requires equal-magnitude coordinates. The chain ‖x‖∞≤‖x‖₂≤‖x‖₁ reads 2≤3≤5.</p>",
  "fields": [
    {
      "id": "norms",
      "label": "1-, 2-, infinity norms",
      "type": "vec",
      "ans": [
        5,
        3,
        2
      ]
    }
  ],
  "hints": {
    "norms": "Sum absolute values, then take √(4+1+4), then the largest absolute entry."
  }
},
A2: {
  "statement": "**A2 · Core · paper — two induced norms of a rectangular map.** For A=[[2,−1,0],[−1,3,1]], compute ‖A‖₁ and ‖A‖∞ and give a unit vector attaining each bound in its respective norm. Which induced norms of Aᵀ do these values give?",
  "plain": "The absolute column sums are 3, 4, and 1, so ‖A‖₁=4, attained at x=e₂ with Ax=(−1,3) and ‖Ax‖₁=4. The absolute row sums are 3 and 5, so ‖A‖∞=5. Matching the signs of the second row gives x=(−1,1,1), which has ‖x‖∞=1 and Ax=(−3,5), so ‖Ax‖∞=5. Transposition swaps rows and columns, so ‖Aᵀ‖∞=‖A‖₁=4 and ‖Aᵀ‖₁=‖A‖∞=5.",
  "solution": "<p>The absolute column sums are 3, 4, and 1, so ‖A‖₁=4, attained at x=e₂ with Ax=(−1,3) and ‖Ax‖₁=4. The absolute row sums are 3 and 5, so ‖A‖∞=5. Matching the signs of the second row gives x=(−1,1,1), which has ‖x‖∞=1 and Ax=(−3,5), so ‖Ax‖∞=5. Transposition swaps rows and columns, so ‖Aᵀ‖∞=‖A‖₁=4 and ‖Aᵀ‖₁=‖A‖∞=5.</p>",
  "fields": [
    {
      "id": "norms",
      "label": "induced 1- and infinity norms",
      "type": "vec",
      "ans": [
        4,
        5
      ]
    }
  ],
  "hints": {
    "norms": "This 2×3 matrix has three column sums and two row sums. Sum absolute entries."
  }
},
A3: {
  "statement": "**A3 · Core · paper — composition can lose the maximizing direction.** For A=diag(10,1) and B=diag(1,10), compute ‖AB‖₂ and ‖A‖₂‖B‖₂. Prove the general submultiplicative inequality.",
  "plain": "AB=10I, giving ‖AB‖₂=10, whereas ‖A‖₂‖B‖₂=100. For each x, ‖ABx‖≤‖A‖‖Bx‖≤‖A‖‖B‖‖x‖. Maximizing over ‖x‖=1 proves submultiplicativity for compatible induced norms. Here B emphasizes the direction A emphasizes less, so the two maxima cannot occur along one composition path.",
  "solution": "<p>AB=10I, giving ‖AB‖₂=10, whereas ‖A‖₂‖B‖₂=100. For each x, ‖ABx‖≤‖A‖‖Bx‖≤‖A‖‖B‖‖x‖. Maximizing over ‖x‖=1 proves submultiplicativity for compatible induced norms. Here B emphasizes the direction A emphasizes less, so the two maxima cannot occur along one composition path.</p>",
  "fields": [
    {
      "id": "values",
      "label": "norm of product, product of norms",
      "type": "vec",
      "ans": [
        10,
        100
      ]
    }
  ],
  "hints": {
    "values": "Multiply the diagonal matrices before taking the norm of their product."
  }
},
A4: {
  "statement": "**A4 · Core · paper — attain the sensitivity ceiling.** For A=diag(2,10⁻³), b=2e₁, and f=10⁻⁶e₂, find x, δx, κ₂, relative data error, and relative solution error. Repeat the last error for f=10⁻⁶e₁, and give both amplification ratios.",
  "plain": "x=e₁ and δx=A⁻¹f=(0,10⁻³). κ₂=2/10⁻³=2000. The relative data error is 10⁻⁶/‖b‖=5×10⁻⁷, and the relative solution error is 10⁻³, so the amplification ratio is 2000 and the ceiling is attained. With f=10⁻⁶e₁, δx=(5×10⁻⁷,0): the relative solution error is 5×10⁻⁷ and the ratio is 1. The normalization by ‖b‖=2 matters in both cases; forgetting it gives a ratio of 1000 instead of κ₂.",
  "solution": "<p>x=e₁ and δx=A⁻¹f=(0,10⁻³). κ₂=2/10⁻³=2000. The relative data error is 10⁻⁶/‖b‖=5×10⁻⁷, and the relative solution error is 10⁻³, so the amplification ratio is 2000 and the ceiling is attained. With f=10⁻⁶e₁, δx=(5×10⁻⁷,0): the relative solution error is 5×10⁻⁷ and the ratio is 1. The normalization by ‖b‖=2 matters in both cases; forgetting it gives a ratio of 1000 instead of κ₂.</p>",
  "fields": [
    {
      "id": "kappa",
      "label": "κ₂",
      "type": "num",
      "ans": 2000
    },
    {
      "id": "error",
      "label": "weak-direction relative solution error",
      "type": "num",
      "ans": 0.001
    },
    {
      "id": "ratios",
      "label": "weak- and strong-direction amplification ratios",
      "type": "vec",
      "ans": [
        2000,
        1
      ]
    }
  ],
  "hints": {
    "kappa": "Divide the larger diagonal gain by the smaller one.",
    "error": "Divide the second perturbation coordinate by 10⁻³; ‖x‖=1. Type 0.001 or 10^-3; e-notation is not accepted.",
    "ratios": "Divide each relative solution error by the relative data error 10⁻⁶/2."
  }
},
A5: {
  "statement": "**A5 · Core · paper — retain the denominator.** Evaluate the perturbation bound when κ=50, εA=0.004, and εb=0.001. State the hypothesis that permits it. Then give diagonal A and E, different from the lesson's A=I and E=2I, for which that hypothesis fails although A+E is nonsingular.",
  "plain": "κ εA=50·0.004=0.2<1, so the bound applies and gives 50(0.004+0.001)/(1−0.2)=0.3125. The theorem also assumes square nonsingular A, nonzero b, and compatible induced norms. One diagonal example: A=diag(1,0.1) and E=diag(0,0.2) in the 2-norm. Then κ₂=10, εA=0.2, and κ εA=2≥1, yet A+E=diag(1,0.3) is nonsingular. The condition is sufficient, not necessary. By contrast E=diag(0,−0.1) gives κ εA=1 and a singular A+E. Any correct example must check both κ εA≥1 and nonsingularity.",
  "solution": "<p>κ εA=50·0.004=0.2&lt;1, so the bound applies and gives 50(0.004+0.001)/(1−0.2)=0.3125. The theorem also assumes square nonsingular A, nonzero b, and compatible induced norms. One diagonal example: A=diag(1,0.1) and E=diag(0,0.2) in the 2-norm. Then κ₂=10, εA=0.2, and κ εA=2≥1, yet A+E=diag(1,0.3) is nonsingular. The condition is sufficient, not necessary. By contrast E=diag(0,−0.1) gives κ εA=1 and a singular A+E. Any correct example must check both κ εA≥1 and nonsingularity.</p>",
  "fields": [
    {
      "id": "bound",
      "label": "relative error ceiling",
      "type": "num",
      "ans": 0.3125
    }
  ],
  "hints": {
    "bound": "Check 50·0.004<1 first, then divide 50·(0.004+0.001) by 1−0.2."
  }
},
A6: {
  "statement": "**A6 · Stretch · paper — distance to failure.** Prove that the relative 2-norm distance from a nonsingular A to a singular matrix is 1/κ₂(A), with arbitrary real matrix perturbations permitted.",
  "plain": "Let A=UΣVᵀ with smallest gain σₙ>0. E=−σₙuₙvₙᵀ has spectral norm σₙ and (A+E)vₙ=0, so the distance is at most σₙ. For any singularizing E, choose a unit z with (A+E)z=0. Then ‖E‖₂≥‖Ez‖₂=‖Az‖₂≥σₙ, proving the lower bound. Dividing by ‖A‖₂=σ₁ yields 1/κ₂. Rubric: both inequalities, unit normalization, nonsingularity, and permission to use unstructured E are required.",
  "solution": "<p>Let A=UΣVᵀ with smallest gain σₙ&gt;0. E=−σₙuₙvₙᵀ has spectral norm σₙ and (A+E)vₙ=0, so the distance is at most σₙ. For any singularizing E, choose a unit z with (A+E)z=0. Then ‖E‖₂≥‖Ez‖₂=‖Az‖₂≥σₙ, proving the lower bound. Dividing by ‖A‖₂=σ₁ yields 1/κ₂. Rubric: both inequalities, unit normalization, nonsingularity, and permission to use unstructured E are required.</p>",
  "proof": true
},
A7: {
  "statement": "**A7 · Core · paper — a backward certificate.** For A=diag(2,10⁻³), b=(2,0), and x̂=(1,1), compute relative residual, relative forward error, κ₂, and η₂. Construct E,f attaining η₂ and verify the perturbed equation. Does the residual-based forward-error ceiling hold with equality?",
  "plain": "Ax̂=(2,10⁻³), so r=(0,−10⁻³), and relative residual=10⁻³/2=5×10⁻⁴. The exact solution is x=(1,0), so relative forward error=1. κ₂=2000. The ceiling κ₂·‖r‖/‖b‖=2000·5×10⁻⁴=1 holds with equality: b lies along the strong channel and r along the weak one. With ‖A‖₂=2, ‖x̂‖₂=√2, and ‖b‖₂=2, d=2√2+2 and η₂=10⁻³/(2√2+2)≈2.071×10⁻⁴. Set t=2√2/d, E=t r x̂ᵀ/2, and f=−(1−t)r. Then Ex̂=t r, so Ex̂−f=r and (A+E)x̂=b+f. The rank-one norm gives ‖E‖₂=t‖r‖₂/√2=2·10⁻³/d=η₂‖A‖₂, and ‖f‖₂=(1−t)10⁻³=2·10⁻³/d=η₂‖b‖₂. A complete written answer verifies these two norm constraints, not only the sign.",
  "solution": "<p>Ax̂=(2,10⁻³), so r=(0,−10⁻³), and relative residual=10⁻³/2=5×10⁻⁴. The exact solution is x=(1,0), so relative forward error=1. κ₂=2000. The ceiling κ₂·‖r‖/‖b‖=2000·5×10⁻⁴=1 holds with equality: b lies along the strong channel and r along the weak one. With ‖A‖₂=2, ‖x̂‖₂=√2, and ‖b‖₂=2, d=2√2+2 and η₂=10⁻³/(2√2+2)≈2.071×10⁻⁴. Set t=2√2/d, E=t r x̂ᵀ/2, and f=−(1−t)r. Then Ex̂=t r, so Ex̂−f=r and (A+E)x̂=b+f. The rank-one norm gives ‖E‖₂=t‖r‖₂/√2=2·10⁻³/d=η₂‖A‖₂, and ‖f‖₂=(1−t)10⁻³=2·10⁻³/d=η₂‖b‖₂. A complete written answer verifies these two norm constraints, not only the sign.</p>",
  "fields": [
    {
      "id": "residual",
      "label": "relative residual in units of 10⁻⁴",
      "type": "num",
      "ans": 5
    },
    {
      "id": "error",
      "label": "relative forward error",
      "type": "num",
      "ans": 1
    },
    {
      "id": "eta",
      "label": "η₂ in units of 10⁻⁴",
      "type": "num",
      "ans": 2.0710678118654755
    }
  ],
  "hints": {
    "residual": "Divide ‖r‖=10⁻³ by ‖b‖=2, then express the result in units of 10⁻⁴.",
    "error": "Compare (1,1) with the exact solution (1,0).",
    "eta": "The denominator is ‖A‖₂‖x̂‖₂+‖b‖₂=2√2+2. An expression such as 10/(2*sqrt(2)+2) is accepted."
  }
},
A8: {
  "statement": "**A8 · Stretch · paper — a good problem and a poor formula.** For g(t)=√(1+t)−1 and t>0, derive its relative scalar condition number and its limit as t tends to zero. Explain the binary64 direct-formula failure at t=2⁻⁵⁴.",
  "plain": "For s=√(1+t), g′(t)=1/(2s) and t=(s−1)(s+1), so |t g′(t)/g(t)|=(s+1)/(2s)→1 as t↓0. Relative conditioning is defined for t>0, not at the zero output itself. At t=2⁻⁵⁴, binary64 rounds 1+t to 1 and the direct formula returns 0. The rationalized formula retains t and gives approximately 2⁻⁵⁵. Rubric: the derivative and cancellation of s−1, the domain, and distinction between function sensitivity and an evaluation path must all be explicit.",
  "solution": "<p>For s=√(1+t), g′(t)=1/(2s) and t=(s−1)(s+1), so |t g′(t)/g(t)|=(s+1)/(2s)→1 as t↓0. Relative conditioning is defined for t&gt;0, not at the zero output itself. At t=2⁻⁵⁴, binary64 rounds 1+t to 1 and the direct formula returns 0. The rationalized formula retains t and gives approximately 2⁻⁵⁵. Rubric: the derivative and cancellation of s−1, the domain, and distinction between function sensitivity and an evaluation path must all be explicit.</p>",
  "proof": true
},
A9: {
  "statement": "**A9 · Core · paper — an unstable path to a good problem.** For A=[[ε,1],[1,1]], b=(1,2), and ε=10⁻²⁰, eliminate without row exchanges in binary64, rounding each operation. Report x̂ and the product of the computed factors. Repeat with partial pivoting, and use κ∞(A) to explain why the failure belongs to the algorithm rather than the problem.",
  "plain": "Without row exchanges the pivot is ε and the multiplier is l=10²⁰. The updated pivot 1−10²⁰ rounds to −10²⁰, and the updated right-hand side 2−10²⁰ rounds to −10²⁰. Back substitution gives x̂₂=1 and x̂₁=(1−1)/ε=0, so x̂=(0,1). The computed factors L=[[1,0],[10²⁰,1]] and U=[[ε,1],[0,−10²⁰]] multiply to [[ε,1],[1,0]]: the entry a₂₂=1 was lost. Relative forward error is 1/√2, the residual is (0,1), and η₂≈0.26. With partial pivoting the rows are swapped, the multiplier is ε, the pivot 1−ε rounds to 1, and x̂=(1,1), which is the exact solution rounded. κ∞(A)=‖A‖∞‖A⁻¹‖∞=2·2/(1−ε)≈4, so the problem is well conditioned. A large backward error on a well-conditioned problem locates the failure in the algorithm.",
  "solution": "<p>Without row exchanges the pivot is ε and the multiplier is l=10²⁰. The updated pivot 1−10²⁰ rounds to −10²⁰, and the updated right-hand side 2−10²⁰ rounds to −10²⁰. Back substitution gives x̂₂=1 and x̂₁=(1−1)/ε=0, so x̂=(0,1). The computed factors L=[[1,0],[10²⁰,1]] and U=[[ε,1],[0,−10²⁰]] multiply to [[ε,1],[1,0]]: the entry a₂₂=1 was lost. Relative forward error is 1/√2, the residual is (0,1), and η₂≈0.26. With partial pivoting the rows are swapped, the multiplier is ε, the pivot 1−ε rounds to 1, and x̂=(1,1), which is the exact solution rounded. κ∞(A)=‖A‖∞‖A⁻¹‖∞=2·2/(1−ε)≈4, so the problem is well conditioned. A large backward error on a well-conditioned problem locates the failure in the algorithm.</p>",
  "fields": [
    {
      "id": "nopivot",
      "label": "x̂ without row exchanges",
      "type": "vec",
      "ans": [
        0,
        1
      ]
    },
    {
      "id": "pivot",
      "label": "x̂ with partial pivoting",
      "type": "vec",
      "ans": [
        1,
        1
      ]
    },
    {
      "id": "kinf",
      "label": "κ∞(A), to the displayed precision",
      "type": "num",
      "ans": 4
    }
  ],
  "hints": {
    "nopivot": "In binary64, 1−10²⁰ and 2−10²⁰ both round to −10²⁰. Solve for x₂ first.",
    "pivot": "After swapping, the multiplier is ε and 1−ε rounds to 1.",
    "kinf": "A⁻¹=[[1,−1],[−1,ε]]/(ε−1). Multiply the largest absolute row sums of A and A⁻¹."
  }
},
A10: {
  "statement": "**A10 · Stretch · paper — orthogonal factors do not hurt.** Prove κ(AB)≤κ(A)κ(B) for nonsingular square A and B in any induced norm, and prove κ₂(QA)=κ₂(AQ)=κ₂(A) for orthogonal Q. For square nonsingular A=QR, show that κ₂(AᵀA)=κ₂(A)² while the triangular system Rx=Qᵀb has κ₂(R)=κ₂(A).",
  "plain": "For nonsingular A and B, ‖AB‖≤‖A‖‖B‖, and (AB)⁻¹=B⁻¹A⁻¹ gives ‖(AB)⁻¹‖≤‖B⁻¹‖‖A⁻¹‖. Multiplying yields κ(AB)≤κ(A)κ(B). For orthogonal Q, ‖Qy‖₂=‖y‖₂, so ‖QAx‖₂=‖Ax‖₂ for all x. Hence QA has the same maximum and minimum gains as A and κ₂(QA)=κ₂(A). Also ‖AQx‖₂/‖x‖₂=‖A(Qx)‖₂/‖Qx‖₂, and Q maps the unit sphere onto itself, so κ₂(AQ)=κ₂(A). For A=QR, R=QᵀA, so κ₂(R)=κ₂(A). Then AᵀA=RᵀQᵀQR=RᵀR, whose eigenvalues are the squared singular values of R, so κ₂(AᵀA)=κ₂(A)². Solving Rx=Qᵀb works with a matrix whose conditioning equals the original, whereas the normal equations work with the square. Rubric: both inequalities for the product bound, the length-preservation argument on each side, and the explicit identity AᵀA=RᵀR are required. Strict inequality is possible, as diag(10,1)·diag(1,10)=10I shows.",
  "solution": "<p>For nonsingular A and B, ‖AB‖≤‖A‖‖B‖, and (AB)⁻¹=B⁻¹A⁻¹ gives ‖(AB)⁻¹‖≤‖B⁻¹‖‖A⁻¹‖. Multiplying yields κ(AB)≤κ(A)κ(B). For orthogonal Q, ‖Qy‖₂=‖y‖₂, so ‖QAx‖₂=‖Ax‖₂ for all x. Hence QA has the same maximum and minimum gains as A and κ₂(QA)=κ₂(A). Also ‖AQx‖₂/‖x‖₂=‖A(Qx)‖₂/‖Qx‖₂, and Q maps the unit sphere onto itself, so κ₂(AQ)=κ₂(A). For A=QR, R=QᵀA, so κ₂(R)=κ₂(A). Then AᵀA=RᵀQᵀQR=RᵀR, whose eigenvalues are the squared singular values of R, so κ₂(AᵀA)=κ₂(A)². Solving Rx=Qᵀb works with a matrix whose conditioning equals the original, whereas the normal equations work with the square. Rubric: both inequalities for the product bound, the length-preservation argument on each side, and the explicit identity AᵀA=RᵀR are required. Strict inequality is possible, as diag(10,1)·diag(1,10)=10I shows.</p>",
  "proof": true
},
B1: {
  "statement": "**B1 · Foundation · NumPy — norms with independent fixtures.** Compare the stdlib norm task with `np.linalg.norm` at orders 1 and infinity on [[1,−2,0],[3,0,4]] and on 10⁻²⁰⁰ and 10²⁰⁰ multiples. State the two unscaled expected norms and check that the inputs are unchanged.",
  "plain": "The unscaled absolute column sums are 4,2,4 and row sums are 3,7, hence norms (4,7). Multiply both by |c| for scale c. Use relative comparisons with zero absolute tolerance for these nonzero fixtures so that returning zero at tiny scale cannot pass. Compare against a saved input copy. The formula uses sums, avoiding overflow from unnecessarily squaring 10²⁰⁰.",
  "solution": "<p>The unscaled absolute column sums are 4,2,4 and row sums are 3,7, hence norms (4,7). Multiply both by |c| for scale c. Use relative comparisons with zero absolute tolerance for these nonzero fixtures so that returning zero at tiny scale cannot pass. Compare against a saved input copy. The formula uses sums, avoiding overflow from unnecessarily squaring 10²⁰⁰.</p>",
  "fields": [
    {
      "id": "norms",
      "label": "unscaled induced 1- and infinity norms",
      "type": "vec",
      "ans": [
        4,
        7
      ]
    }
  ],
  "hints": {
    "norms": "For this rectangular matrix there are three column sums but only two row sums."
  }
},
B2: {
  "statement": "**B2 · Core · NumPy — sweep the weak direction.** For ε in {10⁻²,10⁻⁶,10⁻¹⁰}, use A=diag(1,ε), b=e₁, and δ=10⁻⁶. Solve with f=δe₁ and f=δe₂. Report relative residual, relative forward error, and κ₂δ; compare with the analytic predictions and explain the direction effect.",
  "plain": "For all three ε, relative residual is δ=10⁻⁶. Strong-direction perturbations give relative forward error 10⁻⁶ in all cases; weak-direction errors and ceilings κ₂δ are 10⁻⁴, 1, and 10⁴. The weak direction attains the ceiling, while the strong direction can be far below it. The measured residual for the strong direction may differ slightly from 10⁻⁶ through floating-point subtraction. Report deviations with a sensible relative tolerance and do not interpret one direction as a full condition estimate.",
  "solution": "<p>For all three ε, relative residual is δ=10⁻⁶. Strong-direction perturbations give relative forward error 10⁻⁶ in all cases; weak-direction errors and ceilings κ₂δ are 10⁻⁴, 1, and 10⁴. The weak direction attains the ceiling, while the strong direction can be far below it. The measured residual for the strong direction may differ slightly from 10⁻⁶ through floating-point subtraction. Report deviations with a sensible relative tolerance and do not interpret one direction as a full condition estimate.</p>",
  "proof": true
},
B3: {
  "statement": "**B3 · Core · NumPy — the Gram matrix forgets.** For A=[[1,1],[0,ε]], sweep ε in {10⁻⁴,10⁻⁸,10⁻¹⁰}. Compare direct singular values with `eigvalsh(A.T @ A)`. Report raw computed Gram eigenvalues, including zeros or negatives, before any clipping. Explain why clipping cannot recover lost data.",
  "plain": "In exact arithmetic the Gram eigenvalues are the squared singular values; for small ε the gains are approximately √2 and ε/√2. Forming AᵀA produces [[1,1],[1,1+ε²]]. In binary64, the last entry can round to 1 at ε=10⁻⁸ or 10⁻¹⁰; the small Gram eigenvalue is then computed as zero. A direct SVD can retain a small positive gain from A’s explicit ε entry. Record any negative eigenvalue returned before clipping. A clipped zero is a reporting policy, not recovered information. Rubric: dtype, raw eigenvalues, direct comparison, and an explanation of the information loss are required.",
  "solution": "<p>In exact arithmetic the Gram eigenvalues are the squared singular values; for small ε the gains are approximately √2 and ε/√2. Forming AᵀA produces [[1,1],[1,1+ε²]]. In binary64, the last entry can round to 1 at ε=10⁻⁸ or 10⁻¹⁰; the small Gram eigenvalue is then computed as zero. A direct SVD can retain a small positive gain from A’s explicit ε entry. Record any negative eigenvalue returned before clipping. A clipped zero is a reporting policy, not recovered information. Rubric: dtype, raw eigenvalues, direct comparison, and an explanation of the information loss are required.</p>",
  "proof": true
},
B4: {
  "statement": "**B4 · Stretch · NumPy — audit the estimator.** Compare the stdlib κ∞ estimate with `np.linalg.cond(A, np.inf)` on a pivoting matrix [[0,2],[1,3]], diag(1,10⁻¹²), and nonzero scalar multiples. Then test a nearly dependent matrix and distinguish disagreement between estimates from proof of exact singularity. Record solve residuals for the inverse-column probes.",
  "plain": "For [[0,2],[1,3]], the infinity norm is 4. Its inverse is [[−3/2,1],[1/2,0]], with infinity norm 5/2, giving κ∞=10. The diagonal fixture has κ∞=10¹². A nonzero common scalar leaves both condition numbers unchanged. The basis solves estimate inverse columns, and their residuals must be checked against the scaled matrix actually factored. Nearly dependent inputs can amplify rounding in either estimate; zero computed pivots or disagreements do not certify exact rank of the intended data. Provide actual residuals, scales, dtype, and observed estimator differences.",
  "solution": "<p>For [[0,2],[1,3]], the infinity norm is 4. Its inverse is [[−3/2,1],[1/2,0]], with infinity norm 5/2, giving κ∞=10. The diagonal fixture has κ∞=10¹². A nonzero common scalar leaves both condition numbers unchanged. The basis solves estimate inverse columns, and their residuals must be checked against the scaled matrix actually factored. Nearly dependent inputs can amplify rounding in either estimate; zero computed pivots or disagreements do not certify exact rank of the intended data. Provide actual residuals, scales, dtype, and observed estimator differences.</p>",
  "fields": [
    {
      "id": "conditions",
      "label": "κ∞ for pivoting and diagonal fixtures",
      "type": "vec",
      "ans": [
        10,
        1000000000000
      ]
    }
  ],
  "hints": {
    "conditions": "For the first matrix calculate absolute row sums of A and its analytic inverse."
  }
},
C1: {
  "statement": "**C1 · Core · PyTorch — precision changes the evaluation path.** Evaluate both cancellation formulas with tensor t=2⁻³⁰ in float32 and float64. Predict the direct float32 result and compare relative error against a float64 rationalized reference. Explain the limits of treating that reference as exact.",
  "plain": "At t=2⁻³⁰, float32 rounds 1+t to 1, so the direct formula returns 0 and its relative error is approximately 1. The rationalized value is about 2⁻³¹ and remains representable. Float64 resolves 1+t and produces a much more accurate direct result here. The float64 rationalized reference is still rounded, not an exact real number; use higher precision if claiming errors beyond its accuracy. Record both dtypes and versions, and compare errors relative to the small answer, not with a large absolute tolerance.",
  "solution": "<p>At t=2⁻³⁰, float32 rounds 1+t to 1, so the direct formula returns 0 and its relative error is approximately 1. The rationalized value is about 2⁻³¹ and remains representable. Float64 resolves 1+t and produces a much more accurate direct result here. The float64 rationalized reference is still rounded, not an exact real number; use higher precision if claiming errors beyond its accuracy. Record both dtypes and versions, and compare errors relative to the small answer, not with a large absolute tolerance.</p>",
  "proof": true
},
C2: {
  "statement": "**C2 · Stretch · PyTorch — a stable solve can face uncertain data.** In float64 solve A=diag(1,10⁻⁶) with b=e₁ and then b+10⁻⁶e₂ using `torch.linalg.solve`. Compute each solve's residual against its own supplied right-hand side, and compute the change between solutions. Explain why small solve residuals and a large change are compatible.",
  "plain": "The original solution is (1,0), and the perturbed solution is (1,1), so the Euclidean change is 1. Each candidate can have a very small residual against its own supplied b. Against the original b, the second candidate has residual (0,−10⁻⁶). These observations separate sensitivity to input changes from solver backward error; the second coordinate has inverse gain 10⁶. Report which right-hand side every residual uses.",
  "solution": "<p>The original solution is (1,0), and the perturbed solution is (1,1), so the Euclidean change is 1. Each candidate can have a very small residual against its own supplied b. Against the original b, the second candidate has residual (0,−10⁻⁶). These observations separate sensitivity to input changes from solver backward error; the second coordinate has inverse gain 10⁶. Report which right-hand side every residual uses.</p>",
  "fields": [
    {
      "id": "change",
      "label": "Euclidean change between solutions",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "change": "Solve the second diagonal coordinate for each right-hand side."
  }
},
M1: {
  "statement": "**M1 · Core · mixed — volume is not robustness.** Compare det(A), κ₂(A), and κ₂(10⁻¹²I₂) for A=diag(10⁶,10⁻⁶). Explain why determinant magnitude cannot rank these problems by relative solve sensitivity.",
  "plain": "det(A)=1 and κ₂(A)=10¹², whereas κ₂(10⁻¹²I₂)=1 and that matrix’s determinant is 10⁻²⁴. A determinant multiplies gains; conditioning compares the largest and smallest. Thus a much smaller determinant can accompany much better relative conditioning. Neither determinant here is zero.",
  "solution": "<p>det(A)=1 and κ₂(A)=10¹², whereas κ₂(10⁻¹²I₂)=1 and that matrix’s determinant is 10⁻²⁴. A determinant multiplies gains; conditioning compares the largest and smallest. Thus a much smaller determinant can accompany much better relative conditioning. Neither determinant here is zero.</p>",
  "fields": [
    {
      "id": "values",
      "label": "det(A), κ₂(A), κ₂(10⁻¹²I₂)",
      "type": "vec",
      "ans": [
        1,
        1000000000000,
        1
      ]
    }
  ],
  "hints": {
    "values": "Products of gains and ratios of gains answer different questions."
  }
},
M2: {
  "statement": "**M2 · Core · mixed — normalize the residual.** For A=diag(1,10⁻⁶), b=e₁, and x̂=(1,1), multiply both A and b by 10⁶. Give the new absolute residual norm, relative residual, and η₂. Which diagnostics remain unchanged?",
  "plain": "The scaled residual is (0,−1), with norm 1. The scaled right-hand side has norm 10⁶, so relative residual remains 10⁻⁶. The new η₂ denominator is 10⁶(√2+1), giving the same η₂=10⁻⁶/(√2+1). The candidate, exact solution, condition number, relative residual, forward error, and η₂ remain unchanged. Only the absolute residual and data scales change.",
  "solution": "<p>The scaled residual is (0,−1), with norm 1. The scaled right-hand side has norm 10⁶, so relative residual remains 10⁻⁶. The new η₂ denominator is 10⁶(√2+1), giving the same η₂=10⁻⁶/(√2+1). The candidate, exact solution, condition number, relative residual, forward error, and η₂ remain unchanged. Only the absolute residual and data scales change.</p>",
  "fields": [
    {
      "id": "residual",
      "label": "new absolute residual norm",
      "type": "num",
      "ans": 1
    },
    {
      "id": "relative",
      "label": "relative residual in units of 10⁻⁶",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "residual": "Multiply the old absolute residual by 10⁶.",
    "relative": "The denominator ‖b‖ scales too; report the coefficient of 10⁻⁶."
  }
},
M3: {
  "statement": "**M3 · Stretch · mixed — rescaling the uncertainty.** For A=diag(1,ε), 0<ε≤1, row scale with D=diag(1,1/ε). Show DA=I. If the original measurement perturbation is f=(0,δ), find Df and the resulting solution change. Explain why κ₂(DA)=1 does not erase the original uncertainty.",
  "plain": "DA=I and Df=(0,δ/ε). The original inverse also gives δx=(0,δ/ε). The scaled matrix is perfectly conditioned in unweighted Euclidean coordinates, but the transformed data uncertainty is larger. Any claim about the original physical measurement must transform its perturbation set as well as its equation. Rubric: both matrix and perturbation transformation, the solution change, and an explicit statement of which metric is being used are required.",
  "solution": "<p>DA=I and Df=(0,δ/ε). The original inverse also gives δx=(0,δ/ε). The scaled matrix is perfectly conditioned in unweighted Euclidean coordinates, but the transformed data uncertainty is larger. Any claim about the original physical measurement must transform its perturbation set as well as its equation. Rubric: both matrix and perturbation transformation, the solution change, and an explicit statement of which metric is being used are required.</p>",
  "proof": true
},
M4: {
  "statement": "**M4 · Stretch · mixed — componentwise evidence differs.** Let A=diag(1,10⁻⁸), b=(1,10⁻⁸), and x̂=(1,0). Compute the relative infinity-norm residual. If only b may change and every component must satisfy |fᵢ|≤η|bᵢ|, find the smallest η. Explain the diagnostic disagreement.",
  "plain": "r=(0,10⁻⁸), while ‖b‖∞=1, giving relative infinity residual 10⁻⁸. Right-hand-side-only backward correction is f=−r=(0,−10⁻⁸). Its second coordinate changes by 100% of |b₂|, so the smallest componentwise η is 1. A normwise measure normalizes by the largest coordinate and can hide a complete loss of a smaller coordinate.",
  "solution": "<p>r=(0,10⁻⁸), while ‖b‖∞=1, giving relative infinity residual 10⁻⁸. Right-hand-side-only backward correction is f=−r=(0,−10⁻⁸). Its second coordinate changes by 100% of |b₂|, so the smallest componentwise η is 1. A normwise measure normalizes by the largest coordinate and can hide a complete loss of a smaller coordinate.</p>",
  "fields": [
    {
      "id": "component",
      "label": "smallest componentwise η",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "component": "Normalize the second correction by |b₂|, not by the largest component of b."
  }
},
M5: {
  "statement": "**M5 · Core · mixed — a precision budget.** A backward-stable solver is applied to a system with κ₂=10⁵. Using a forward error of order κu, estimate the trustworthy decimal digits in binary64 (u=2⁻⁵³), binary32 (u=2⁻²⁴), and bfloat16 (u=2⁻⁸). Which format gives no guarantee at all? State two reasons the estimate can be pessimistic or optimistic for a particular solve.",
  "plain": "κu is about 1.1×10⁻¹¹ in binary64, 6×10⁻³ in binary32, and 390 in bfloat16. That suggests roughly 11 trustworthy digits in binary64, about 2 in binary32, and none at all in bfloat16, where κu>1 means even the leading digit is unprotected. The estimate can be pessimistic because κ is a worst case over directions and the actual data and rounding errors may not excite the weak direction. It can be optimistic because the backward-error constant grows with problem size and pivot growth, because data errors that were already present are not included, and because the bound needs κ·η<1. Report it as an order of magnitude with its assumptions, not as a measured accuracy.",
  "solution": "<p>κu is about 1.1×10⁻¹¹ in binary64, 6×10⁻³ in binary32, and 390 in bfloat16. That suggests roughly 11 trustworthy digits in binary64, about 2 in binary32, and none at all in bfloat16, where κu&gt;1 means even the leading digit is unprotected. The estimate can be pessimistic because κ is a worst case over directions and the actual data and rounding errors may not excite the weak direction. It can be optimistic because the backward-error constant grows with problem size and pivot growth, because data errors that were already present are not included, and because the bound needs κ·η&lt;1. Report it as an order of magnitude with its assumptions, not as a measured accuracy.</p>",
  "fields": [
    {
      "id": "k32",
      "label": "κu for binary32, in units of 10⁻³",
      "type": "num",
      "ans": 5.9604644775390625
    },
    {
      "id": "none",
      "label": "format with no guaranteed digit",
      "type": "choice",
      "ans": "bfloat16",
      "opts": [
        "binary64",
        "binary32",
        "bfloat16"
      ]
    }
  ],
  "hints": {
    "k32": "Multiply 10⁵ by 2⁻²⁴ and express the result in units of 10⁻³. An expression such as 10^5*2^-24*1000 is accepted.",
    "none": "A format gives no guaranteed digit when κu exceeds 1."
  }
},
K1: {
  "statement": "**K1 · Foundation · gate — name the three questions.** Define conditioning, forward error, and backward stability. For a solve, state which concerns the mathematical problem, which concerns an answer, and which concerns an algorithm under a specified arithmetic model.",
  "plain": "Conditioning measures how an exact mathematical answer changes when specified input data change under specified norms. Forward error measures a particular answer’s distance from the intended exact solution. Backward stability is an algorithmic guarantee that computed answers solve nearby data problems, with perturbations controlled on the scale of unit roundoff and problem-size/algorithm factors under an arithmetic model. Rubric: identify all three objects and avoid claiming that backward stability alone ensures small forward error on ill-conditioned problems.",
  "solution": "<p>Conditioning measures how an exact mathematical answer changes when specified input data change under specified norms. Forward error measures a particular answer’s distance from the intended exact solution. Backward stability is an algorithmic guarantee that computed answers solve nearby data problems, with perturbations controlled on the scale of unit roundoff and problem-size/algorithm factors under an arithmetic model. Rubric: identify all three objects and avoid claiming that backward stability alone ensures small forward error on ill-conditioned problems.</p>",
  "proof": true
},
K2: {
  "statement": "**K2 · Stretch · gate — prove the qualified bound.** Starting from (A+E)(x+δx)=b+f, derive the finite relative perturbation bound. State nonzero/invertibility assumptions and explain the role of κ εA<1.",
  "plain": "Assume square nonsingular A, nonzero b, x=A⁻¹b, compatible induced norms, and εA=‖E‖/‖A‖, εb=‖f‖/‖b‖. Subtraction gives (I+A⁻¹E)δx=A⁻¹(f−Ex). If q=κ εA<1, the Neumann series proves invertibility and bounds the inverse norm by 1/(1−q). Thus ‖δx‖/‖x‖≤‖A⁻¹‖(‖f‖/‖x‖+‖E‖)/(1−q)≤κ(εb+εA)/(1−κ εA), using ‖b‖≤‖A‖‖x‖. Rubric: state the assumptions, establish rather than assume perturbed invertibility, justify the numerator and denominator, and explain that q≥1 removes this guarantee without proving singularity.",
  "solution": "<p>Assume square nonsingular A, nonzero b, x=A⁻¹b, compatible induced norms, and εA=‖E‖/‖A‖, εb=‖f‖/‖b‖. Subtraction gives (I+A⁻¹E)δx=A⁻¹(f−Ex). If q=κ εA&lt;1, the Neumann series proves invertibility and bounds the inverse norm by 1/(1−q). Thus ‖δx‖/‖x‖≤‖A⁻¹‖(‖f‖/‖x‖+‖E‖)/(1−q)≤κ(εb+εA)/(1−κ εA), using ‖b‖≤‖A‖‖x‖. Rubric: state the assumptions, establish rather than assume perturbed invertibility, justify the numerator and denominator, and explain that q≥1 removes this guarantee without proving singularity.</p>",
  "proof": true
},
K3: {
  "statement": "**K3 · Core · gate — diagnose a small residual.** For A=diag(1,10⁻⁸), b=e₁, and x̂=(1,1), give κ₂, relative residual, relative forward error, and η₂. Does the residual-bound ceiling match the actual forward error?",
  "plain": "κ₂=10⁸, r=(0,−10⁻⁸), relative residual=10⁻⁸, relative forward error=1, and η₂=10⁻⁸/(√2+1). The residual ceiling is 10⁸·10⁻⁸=1, exactly matching the forward error: the residual points along the weak output channel, while b points along the strong one.",
  "solution": "<p>κ₂=10⁸, r=(0,−10⁻⁸), relative residual=10⁻⁸, relative forward error=1, and η₂=10⁻⁸/(√2+1). The residual ceiling is 10⁸·10⁻⁸=1, exactly matching the forward error: the residual points along the weak output channel, while b points along the strong one.</p>",
  "fields": [
    {
      "id": "kappa",
      "label": "κ₂",
      "type": "num",
      "ans": 100000000
    },
    {
      "id": "residual",
      "label": "relative residual in units of 10⁻⁸",
      "type": "num",
      "ans": 1
    },
    {
      "id": "forward",
      "label": "relative forward error",
      "type": "num",
      "ans": 1
    },
    {
      "id": "eta",
      "label": "η₂ in units of 10⁻⁸",
      "type": "num",
      "ans": 0.4142135623730951
    }
  ],
  "hints": {
    "kappa": "The singular values are 1 and 10⁻⁸.",
    "residual": "Normalize by ‖b‖=1, then express the result in the requested units.",
    "forward": "The candidate differs by one unit in the second solution coordinate.",
    "eta": "The normwise denominator is √2+1, not just ‖b‖."
  }
},
K4: {
  "statement": "**K4 · Core · gate — debug a condition report.** A program returns the largest singular value as its “condition number,” and declares matrices with determinant magnitude below 10⁻¹² singular. Give a counterexample to each rule and describe a scale-aware replacement with explicit numerical limitations.",
  "plain": "I and diag(1,10⁻¹²) both have largest singular value 1 but κ₂ values 1 and 10¹², refuting the first rule. The nonsingular, perfectly conditioned 10⁻⁸I₂ has determinant 10⁻¹⁶, refuting the absolute determinant cutoff. Replace the first report by both extreme singular scales or a factor/solve-based reciprocal condition estimate with a named norm. For numerical rank, use a disclosed tolerance relative to the largest gain and the input uncertainty, not a scale-free claim based on an absolute determinant threshold. Tiny or zero computed singular values require a precision and uncertainty qualification; a cutoff is not an exact-rank proof.",
  "solution": "<p>I and diag(1,10⁻¹²) both have largest singular value 1 but κ₂ values 1 and 10¹², refuting the first rule. The nonsingular, perfectly conditioned 10⁻⁸I₂ has determinant 10⁻¹⁶, refuting the absolute determinant cutoff. Replace the first report by both extreme singular scales or a factor/solve-based reciprocal condition estimate with a named norm. For numerical rank, use a disclosed tolerance relative to the largest gain and the input uncertainty, not a scale-free claim based on an absolute determinant threshold. Tiny or zero computed singular values require a precision and uncertainty qualification; a cutoff is not an exact-rank proof.</p>",
  "proof": true
},
K5: {
  "statement": "**K5 · Stretch · gate — critique an experiment.** An audit perturbs only the strongest output direction, observes a small solution change, and claims the solver is backward stable and the problem robust. Identify what was actually measured and design separate tests for sensitivity and algorithmic error.",
  "plain": "The audit measured one directional response of the implemented pipeline. It neither maximized over perturbations nor isolated solver arithmetic. For sensitivity, fix stored A and controlled perturbation sizes, sweep directions including the weakest left singular direction, and compare exact or high-precision solves. For algorithmic error, fix each stored input, compare candidates with an oracle when available, and measure residual/backward error against that same input while changing algorithm or dtype. Include scales, norms, denominator validity, and repeated controlled fixtures. Empirical successes still do not prove an algorithmic backward-stability theorem.",
  "solution": "<p>The audit measured one directional response of the implemented pipeline. It neither maximized over perturbations nor isolated solver arithmetic. For sensitivity, fix stored A and controlled perturbation sizes, sweep directions including the weakest left singular direction, and compare exact or high-precision solves. For algorithmic error, fix each stored input, compare candidates with an oracle when available, and measure residual/backward error against that same input while changing algorithm or dtype. Include scales, norms, denominator validity, and repeated controlled fixtures. Empirical successes still do not prove an algorithmic backward-stability theorem.</p>",
  "proof": true
},
K6: {
  "statement": "**K6 · Stretch · gate — an unfamiliar error metric.** A diagonal solve uses positive coordinate scales D=diag(dᵢ) for inputs and C=diag(cᵢ) for outputs, with ‖x‖X=‖D⁻¹x‖₂ and ‖b‖Y=‖C⁻¹b‖₂. Derive the matrix whose Euclidean condition number describes these scaled norms. Explain how to report errors back in physical coordinates.",
  "plain": "Set z=D⁻¹x and y=C⁻¹b. Then Bz=y with B=C⁻¹AD. The input and output norms are Euclidean in z and y, so the relative solve condition number in these scaled metrics is κ₂(B) (for nonsingular A). For diagonal A, B has diagonal entries aᵢdᵢ/cᵢ, so take the ratio of their largest and smallest absolute values. Report physical-coordinate errors as δx=Dδz and transform data perturbations as δy=C⁻¹δb; a small scaled error can mean a larger raw error on a coordinate with large dᵢ. Rubric: correct order of scaling factors, invertibility, the diagonal gain ratio, and translation of both errors and uncertainties.",
  "solution": "<p>Set z=D⁻¹x and y=C⁻¹b. Then Bz=y with B=C⁻¹AD. The input and output norms are Euclidean in z and y, so the relative solve condition number in these scaled metrics is κ₂(B) (for nonsingular A). For diagonal A, B has diagonal entries aᵢdᵢ/cᵢ, so take the ratio of their largest and smallest absolute values. Report physical-coordinate errors as δx=Dδz and transform data perturbations as δy=C⁻¹δb; a small scaled error can mean a larger raw error on a coordinate with large dᵢ. Rubric: correct order of scaling factors, invertibility, the diagonal gain ratio, and translation of both errors and uncertainties.</p>",
  "proof": true
}
});
