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
  "plain": "The absolute column sums are 3, 4, and 1, so ‖A‖₁=4, attained at x=e₂ with Ax=(−1,3) and ‖Ax‖₁=4. The absolute row sums are 3 and 5, so ‖A‖∞=5. Matching the signs of the second row gives x=(−1,1,1), which has ‖x‖∞=1 and Ax=(−3,5), so ‖Ax‖∞=5. Transposition swaps rows and columns, so ‖Aᵀ‖∞=‖A‖₁=4 and ‖Aᵀ‖₁=‖A‖∞=5. Rubric: both norms from absolute sums; attaining vectors of unit norm in the right norm, each verified by multiplying; the transpose relation.",
  "solution": "<p>The absolute column sums are 3, 4, and 1, so ‖A‖₁=4, attained at x=e₂ with Ax=(−1,3) and ‖Ax‖₁=4. The absolute row sums are 3 and 5, so ‖A‖∞=5. Matching the signs of the second row gives x=(−1,1,1), which has ‖x‖∞=1 and Ax=(−3,5), so ‖Ax‖∞=5. Transposition swaps rows and columns, so ‖Aᵀ‖∞=‖A‖₁=4 and ‖Aᵀ‖₁=‖A‖∞=5. Rubric: both norms from absolute sums; attaining vectors of unit norm in the right norm, each verified by multiplying; the transpose relation.</p>",
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
  "statement": "**A3 · Core · paper — composition can lose the maximizing direction.** For the shear A=[[1,1],[0,1]] and its inverse B=[[1,−1],[0,1]], compute ‖AB‖₂ and ‖A‖₂‖B‖₂. Prove the general submultiplicative inequality, and explain in the picture why this pair is far from equality.",
  "plain": "AB=I, so ‖AB‖₂=1. For A, AᵀA=[[1,1],[1,2]] has eigenvalues (3±√5)/2, so ‖A‖₂=√((3+√5)/2)=(1+√5)/2≈1.618; B has the same singular values, so ‖A‖₂‖B‖₂=(3+√5)/2≈2.618. Proof of submultiplicativity: for every x, ‖ABx‖≤‖A‖‖Bx‖≤‖A‖‖B‖‖x‖, using the defining inequality of each induced norm; maximizing over ‖x‖=1 gives ‖AB‖≤‖A‖‖B‖. In the picture, B stretches most along one direction and A stretches most along a different one; B undoes exactly what A does, so the directions B lengthens are the ones A shortens and the composition stretches nothing. Rubric: the value 1 for the product, the golden-ratio norm with the AᵀA computation, both inequalities of the proof with the maximization step, and a geometric explanation that the maximizing directions differ.",
  "solution": "<p>AB=I, so ‖AB‖₂=1. For A, AᵀA=[[1,1],[1,2]] has eigenvalues (3±√5)/2, so ‖A‖₂=√((3+√5)/2)=(1+√5)/2≈1.618; B has the same singular values, so ‖A‖₂‖B‖₂=(3+√5)/2≈2.618. Proof of submultiplicativity: for every x, ‖ABx‖≤‖A‖‖Bx‖≤‖A‖‖B‖‖x‖, using the defining inequality of each induced norm; maximizing over ‖x‖=1 gives ‖AB‖≤‖A‖‖B‖. In the picture, B stretches most along one direction and A stretches most along a different one; B undoes exactly what A does, so the directions B lengthens are the ones A shortens and the composition stretches nothing. Rubric: the value 1 for the product, the golden-ratio norm with the AᵀA computation, both inequalities of the proof with the maximization step, and a geometric explanation that the maximizing directions differ.</p>",
  "fields": [
    {
      "id": "values",
      "label": "‖AB‖₂ and ‖A‖₂‖B‖₂",
      "type": "vec",
      "ans": [
        1,
        2.618033988749895
      ]
    }
  ],
  "hints": {
    "values": "AB is the identity. For ‖A‖₂, take the square root of the larger eigenvalue of AᵀA=[[1,1],[1,2]]; an answer such as (3+sqrt(5))/2 is accepted."
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
  "plain": "κ εA=50·0.004=0.2<1, so the bound applies and gives 50(0.004+0.001)/(1−0.2)=0.3125. The theorem also assumes square nonsingular A, nonzero b, and compatible induced norms. One diagonal example: A=diag(1,0.1) and E=diag(0,0.2) in the 2-norm. Then κ₂=10, εA=0.2, and κ εA=2≥1, yet A+E=diag(1,0.3) is nonsingular. The condition is sufficient, not necessary. By contrast E=diag(0,−0.1) gives κ εA=1 and a singular A+E. Any correct example must check both κ εA≥1 and nonsingularity. Rubric: the hypothesis checked before evaluating; the bound computed with its denominator; a diagonal example verified to have κεA≥1 and a nonsingular A+E.",
  "solution": "<p>κ εA=50·0.004=0.2&lt;1, so the bound applies and gives 50(0.004+0.001)/(1−0.2)=0.3125. The theorem also assumes square nonsingular A, nonzero b, and compatible induced norms. One diagonal example: A=diag(1,0.1) and E=diag(0,0.2) in the 2-norm. Then κ₂=10, εA=0.2, and κ εA=2≥1, yet A+E=diag(1,0.3) is nonsingular. The condition is sufficient, not necessary. By contrast E=diag(0,−0.1) gives κ εA=1 and a singular A+E. Any correct example must check both κ εA≥1 and nonsingularity. Rubric: the hypothesis checked before evaluating; the bound computed with its denominator; a diagonal example verified to have κεA≥1 and a nonsingular A+E.</p>",
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
  "statement": "**A6 · Stretch · paper — distance to failure in another norm.** For any induced norm, prove that ‖E‖<1/‖A⁻¹‖ keeps A+E nonsingular. Then, for A=[[1,1,0],[0,1,1],[0,0,1]], construct E with ‖E‖∞=1/3 for which A+E is singular, and conclude that the relative infinity-norm distance from A to a singular matrix is exactly 1/κ∞(A).",
  "plain": "Proof: suppose A+E were singular, so (A+E)z=0 for some z≠0. Then Az=−Ez and z=−A⁻¹Ez, so ‖z‖≤‖A⁻¹‖‖E‖‖z‖<‖z‖ when ‖E‖<1/‖A⁻¹‖, a contradiction. Construction: ‖A⁻¹‖∞=3 is attained by y=(1,−1,1), since z=A⁻¹y=(3,−2,1) has ‖z‖∞=3. Put E=−(1/3)y e₁ᵀ, whose only nonzero column is the first, equal to (−1/3, 1/3, −1/3). Then (A+E)z=Az−(1/3)y(e₁ᵀz)=y−(1/3)·3y=0, so A+E=[[2/3,1,0],[1/3,1,1],[−1/3,0,1]] is singular, and ‖E‖∞=1/3 because every row of E has one entry of size 1/3. Hence the distance to singularity in the ∞-norm is exactly 1/‖A⁻¹‖∞=1/3, and relative to ‖A‖∞=2 it is 1/6=1/κ∞(A). The same construction works in any induced norm (Gastinel–Kahan). Rubric: the contradiction argument with the strict inequality; a correct E with ‖E‖∞=1/3 and an explicit null vector of A+E; the division by ‖A‖∞ to reach 1/κ∞.",
  "solution": "<p>Proof: suppose A+E were singular, so (A+E)z=0 for some z≠0. Then Az=−Ez and z=−A⁻¹Ez, so ‖z‖≤‖A⁻¹‖‖E‖‖z‖&lt;‖z‖ when ‖E‖&lt;1/‖A⁻¹‖, a contradiction. Construction: ‖A⁻¹‖∞=3 is attained by y=(1,−1,1), since z=A⁻¹y=(3,−2,1) has ‖z‖∞=3. Put E=−(1/3)y e₁ᵀ, whose only nonzero column is the first, equal to (−1/3, 1/3, −1/3). Then (A+E)z=Az−(1/3)y(e₁ᵀz)=y−(1/3)·3y=0, so A+E=[[2/3,1,0],[1/3,1,1],[−1/3,0,1]] is singular, and ‖E‖∞=1/3 because every row of E has one entry of size 1/3. Hence the distance to singularity in the ∞-norm is exactly 1/‖A⁻¹‖∞=1/3, and relative to ‖A‖∞=2 it is 1/6=1/κ∞(A). The same construction works in any induced norm (Gastinel–Kahan). Rubric: the contradiction argument with the strict inequality; a correct E with ‖E‖∞=1/3 and an explicit null vector of A+E; the division by ‖A‖∞ to reach 1/κ∞.</p>",
  "fields": [
    {
      "id": "normE",
      "label": "‖E‖∞ of your singularizing perturbation",
      "type": "num",
      "ans": 0.3333333333333333
    },
    {
      "id": "rel",
      "label": "relative distance ‖E‖∞/‖A‖∞",
      "type": "num",
      "ans": 0.16666666666666666
    }
  ],
  "hints": {
    "normE": "Aim for 1/‖A⁻¹‖∞; the row sums of A⁻¹ are 3, 2, 1. An answer such as 1/3 is accepted.",
    "rel": "Divide by ‖A‖∞=2."
  }
},
A7: {
  "statement": "**A7 · Core · paper — a nearby problem for a wrong answer.** For A=diag(2,10⁻³), b=(2,0), and x̂=(1,1), compute relative residual, relative forward error, κ₂, and η₂. Construct E,f attaining η₂ and verify the perturbed equation. Does the residual-based forward-error ceiling hold with equality?",
  "plain": "Ax̂=(2,10⁻³), so r=(0,−10⁻³), and relative residual=10⁻³/2=5×10⁻⁴. The exact solution is x=(1,0), so relative forward error=1. κ₂=2000. The ceiling κ₂·‖r‖/‖b‖=2000·5×10⁻⁴=1 holds with equality: b lies along the strong channel and r along the weak one. With ‖A‖₂=2, ‖x̂‖₂=√2, and ‖b‖₂=2, d=2√2+2 and η₂=10⁻³/(2√2+2)≈2.071×10⁻⁴. Set t=2√2/d, E=t r x̂ᵀ/2, and f=−(1−t)r. Then Ex̂=t r, so Ex̂−f=r and (A+E)x̂=b+f. The rank-one norm gives ‖E‖₂=t‖r‖₂/√2=2·10⁻³/d=η₂‖A‖₂, and ‖f‖₂=(1−t)10⁻³=2·10⁻³/d=η₂‖b‖₂. Rubric: r and the three relative quantities; the ceiling checked; η₂ with the correct denominator; E and f constructed, the perturbed equation verified, and both norm constraints checked.",
  "solution": "<p>Ax̂=(2,10⁻³), so r=(0,−10⁻³), and relative residual=10⁻³/2=5×10⁻⁴. The exact solution is x=(1,0), so relative forward error=1. κ₂=2000. The ceiling κ₂·‖r‖/‖b‖=2000·5×10⁻⁴=1 holds with equality: b lies along the strong channel and r along the weak one. With ‖A‖₂=2, ‖x̂‖₂=√2, and ‖b‖₂=2, d=2√2+2 and η₂=10⁻³/(2√2+2)≈2.071×10⁻⁴. Set t=2√2/d, E=t r x̂ᵀ/2, and f=−(1−t)r. Then Ex̂=t r, so Ex̂−f=r and (A+E)x̂=b+f. The rank-one norm gives ‖E‖₂=t‖r‖₂/√2=2·10⁻³/d=η₂‖A‖₂, and ‖f‖₂=(1−t)10⁻³=2·10⁻³/d=η₂‖b‖₂. Rubric: r and the three relative quantities; the ceiling checked; η₂ with the correct denominator; E and f constructed, the perturbed equation verified, and both norm constraints checked.</p>",
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
  "statement": "**A8 · Stretch · paper — a second poor formula.** For f(x)=1−cos x with small x≠0, derive the relative condition number |xf′(x)/f(x)| and its limit as x→0. Explain why binary64 evaluation of 1−cos x returns 0 at x=10⁻⁸, derive an algebraically equal formula that avoids the cancellation, and evaluate it.",
  "plain": "f′(x)=sin x, so the relative condition number is |x sin x/(1−cos x)|. With 1−cos x=2sin²(x/2) and sin x=2sin(x/2)cos(x/2), it equals |x cos(x/2)/sin(x/2)|, which tends to 2 as x→0: the function is well conditioned. At x=10⁻⁸, cos x=1−5×10⁻¹⁷+…, and 5×10⁻¹⁷ is below half the spacing of binary64 numbers just under 1 (2⁻⁵⁴≈5.6×10⁻¹⁷), so cos x rounds to 1 and the direct formula returns 1−1=0. The identity 1−cos x=2sin²(x/2) avoids the subtraction: 2sin²(5×10⁻⁹)≈5×10⁻¹⁷, correct to nearly full precision. As with √(1+t)−1, the loss is caused by the evaluation path, not by the function. Rubric: the condition number and its limit 2 with a correct derivation; the rounding argument for cos(10⁻⁸); a correct cancellation-free formula and its value.",
  "solution": "<p>f′(x)=sin x, so the relative condition number is |x sin x/(1−cos x)|. With 1−cos x=2sin²(x/2) and sin x=2sin(x/2)cos(x/2), it equals |x cos(x/2)/sin(x/2)|, which tends to 2 as x→0: the function is well conditioned. At x=10⁻⁸, cos x=1−5×10⁻¹⁷+…, and 5×10⁻¹⁷ is below half the spacing of binary64 numbers just under 1 (2⁻⁵⁴≈5.6×10⁻¹⁷), so cos x rounds to 1 and the direct formula returns 1−1=0. The identity 1−cos x=2sin²(x/2) avoids the subtraction: 2sin²(5×10⁻⁹)≈5×10⁻¹⁷, correct to nearly full precision. As with √(1+t)−1, the loss is caused by the evaluation path, not by the function. Rubric: the condition number and its limit 2 with a correct derivation; the rounding argument for cos(10⁻⁸); a correct cancellation-free formula and its value.</p>",
  "fields": [
    {
      "id": "limit",
      "label": "limit of the condition number as x→0",
      "type": "num",
      "ans": 2
    },
    {
      "id": "value",
      "label": "stable value at x=10⁻⁸, in units of 10⁻¹⁷",
      "type": "num",
      "ans": 5
    }
  ],
  "hints": {
    "limit": "Rewrite 1−cos x as 2sin²(x/2) and let x→0 in x sin x/(1−cos x).",
    "value": "2sin²(x/2)≈2(x/2)²=x²/2 for small x; express x²/2 in units of 10⁻¹⁷."
  }
},
A9: {
  "statement": "**A9 · Core · paper — an unstable path to a good problem.** For A=[[ε,2],[1,1]], b=(2,2), and ε=10⁻²⁰, eliminate without row exchanges in binary64, rounding each operation. Report x̂ and the product of the computed factors. Repeat with partial pivoting, and use κ∞(A) to explain why the failure belongs to the algorithm rather than the problem.",
  "plain": "Without row exchanges the pivot is ε and the multiplier is 10²⁰. The updated pivot 1−2·10²⁰ rounds to −2·10²⁰, and the updated right-hand side 2−2·10²⁰ also rounds to −2·10²⁰. Back substitution gives x̂₂=1 and x̂₁=(2−2·1)/ε=0, so x̂=(0,1). The computed factors L=[[1,0],[10²⁰,1]] and U=[[ε,2],[0,−2·10²⁰]] multiply to [[ε,2],[1,0]]: the entry a₂₂=1 was lost, and the growth factor is 2·10²⁰/max|aᵢⱼ|=2·10²⁰/2=10²⁰. With partial pivoting the rows swap, the multiplier is ε, the pivot 2−ε rounds to 2, and x̂=(1,1), the exact solution rounded. A⁻¹=[[1,−2],[−1,ε]]/(ε−2), so ‖A⁻¹‖∞=3/(2−ε) and κ∞(A)=(2+ε)·3/(2−ε)≈3: the problem is well conditioned. A backward error of order 1 on a well-conditioned problem places the failure in the algorithm. Rubric: each rounded operation shown; the product of the computed factors and the lost entry; the pivoted solve; κ∞ computed from A⁻¹ and used to separate algorithm from problem.",
  "solution": "<p>Without row exchanges the pivot is ε and the multiplier is 10²⁰. The updated pivot 1−2·10²⁰ rounds to −2·10²⁰, and the updated right-hand side 2−2·10²⁰ also rounds to −2·10²⁰. Back substitution gives x̂₂=1 and x̂₁=(2−2·1)/ε=0, so x̂=(0,1). The computed factors L=[[1,0],[10²⁰,1]] and U=[[ε,2],[0,−2·10²⁰]] multiply to [[ε,2],[1,0]]: the entry a₂₂=1 was lost, and the growth factor is 2·10²⁰/max|aᵢⱼ|=2·10²⁰/2=10²⁰. With partial pivoting the rows swap, the multiplier is ε, the pivot 2−ε rounds to 2, and x̂=(1,1), the exact solution rounded. A⁻¹=[[1,−2],[−1,ε]]/(ε−2), so ‖A⁻¹‖∞=3/(2−ε) and κ∞(A)=(2+ε)·3/(2−ε)≈3: the problem is well conditioned. A backward error of order 1 on a well-conditioned problem places the failure in the algorithm. Rubric: each rounded operation shown; the product of the computed factors and the lost entry; the pivoted solve; κ∞ computed from A⁻¹ and used to separate algorithm from problem.</p>",
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
      "ans": 3
    }
  ],
  "hints": {
    "nopivot": "In binary64, 1−2·10²⁰ and 2−2·10²⁰ both round to −2·10²⁰. Solve for x₂ first.",
    "pivot": "After the swap the multiplier is ε and 2−ε rounds to 2.",
    "kinf": "A⁻¹=[[1,−2],[−1,ε]]/(ε−2); multiply the largest absolute row sums of A and A⁻¹."
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
  "plain": "For all three ε, relative residual is δ=10⁻⁶. Strong-direction perturbations give relative forward error 10⁻⁶ in all cases; weak-direction errors and ceilings κ₂δ are 10⁻⁴, 1, and 10⁴. The weak direction attains the ceiling, while the strong direction can be far below it. The measured residual for the strong direction may differ slightly from 10⁻⁶ through floating-point subtraction. Report deviations with a sensible relative tolerance and do not interpret one direction as a full condition estimate. Rubric: a table over the three ε values and both directions; relative residual ≈δ for all six runs; forward errors matching δ (strong direction) and δ/ε (weak direction); the ceiling κ₂δ reported and compared; an explanation that only the weak direction attains the ceiling.",
  "solution": "<p>For all three ε, relative residual is δ=10⁻⁶. Strong-direction perturbations give relative forward error 10⁻⁶ in all cases; weak-direction errors and ceilings κ₂δ are 10⁻⁴, 1, and 10⁴. The weak direction attains the ceiling, while the strong direction can be far below it. The measured residual for the strong direction may differ slightly from 10⁻⁶ through floating-point subtraction. Report deviations with a sensible relative tolerance and do not interpret one direction as a full condition estimate. Rubric: a table over the three ε values and both directions; relative residual ≈δ for all six runs; forward errors matching δ (strong direction) and δ/ε (weak direction); the ceiling κ₂δ reported and compared; an explanation that only the weak direction attains the ceiling.</p>",
  "proof": true
},
B3: {
  "statement": "**B3 · Core · NumPy — the Gram matrix forgets.** For A=[[1,1],[0,ε]], sweep ε in {10⁻⁴,10⁻⁸,10⁻¹⁰}. Compare direct singular values with `eigvalsh(A.T @ A)`. Report raw computed Gram eigenvalues, including zeros or negatives, before any clipping. Explain why clipping cannot recover lost data.",
  "plain": "In exact arithmetic the Gram eigenvalues are the squared singular values; for small ε the gains are approximately √2 and ε/√2. Forming AᵀA produces [[1,1],[1,1+ε²]]. In binary64, the last entry can round to 1 at ε=10⁻⁸ or 10⁻¹⁰; the small Gram eigenvalue is then computed as zero or as a rounding-level value near 10⁻¹⁶, possibly negative. A direct SVD can retain a small positive gain from A’s explicit ε entry. Record any negative eigenvalue returned before clipping. A clipped zero is a reporting policy, not recovered information. Rubric: dtype, raw eigenvalues, direct comparison, and an explanation of the information loss are required.",
  "solution": "<p>In exact arithmetic the Gram eigenvalues are the squared singular values; for small ε the gains are approximately √2 and ε/√2. Forming AᵀA produces [[1,1],[1,1+ε²]]. In binary64, the last entry can round to 1 at ε=10⁻⁸ or 10⁻¹⁰; the small Gram eigenvalue is then computed as zero or as a rounding-level value near 10⁻¹⁶, possibly negative. A direct SVD can retain a small positive gain from A’s explicit ε entry. Record any negative eigenvalue returned before clipping. A clipped zero is a reporting policy, not recovered information. Rubric: dtype, raw eigenvalues, direct comparison, and an explanation of the information loss are required.</p>",
  "proof": true
},
B4: {
  "statement": "**B4 · Stretch · NumPy — audit the estimator.** Compare the stdlib κ∞ estimate with `np.linalg.cond(A, np.inf)` on a pivoting matrix [[0,2],[1,3]], diag(1,10⁻¹²), and nonzero scalar multiples. Then test a nearly dependent matrix and distinguish disagreement between estimates from proof of exact singularity. Record solve residuals for the inverse-column probes.",
  "plain": "For [[0,2],[1,3]], the infinity norm is 4. Its inverse is [[−3/2,1],[1/2,0]], with infinity norm 5/2, giving κ∞=10. The diagonal fixture has κ∞=10¹². A nonzero common scalar leaves both condition numbers unchanged. The basis solves estimate inverse columns, and their residuals must be checked against the scaled matrix actually factored. Nearly dependent inputs can amplify rounding in either estimate; zero computed pivots or disagreements do not certify exact rank of the intended data. Provide actual residuals, scales, dtype, and observed estimator differences. Rubric: κ∞ for both fixtures from explicit inverses; scalar invariance demonstrated; solve residuals reported against the scaled matrix; an estimator disagreement on a nearly dependent matrix explained without claiming exact singularity.",
  "solution": "<p>For [[0,2],[1,3]], the infinity norm is 4. Its inverse is [[−3/2,1],[1/2,0]], with infinity norm 5/2, giving κ∞=10. The diagonal fixture has κ∞=10¹². A nonzero common scalar leaves both condition numbers unchanged. The basis solves estimate inverse columns, and their residuals must be checked against the scaled matrix actually factored. Nearly dependent inputs can amplify rounding in either estimate; zero computed pivots or disagreements do not certify exact rank of the intended data. Provide actual residuals, scales, dtype, and observed estimator differences. Rubric: κ∞ for both fixtures from explicit inverses; scalar invariance demonstrated; solve residuals reported against the scaled matrix; an estimator disagreement on a nearly dependent matrix explained without claiming exact singularity.</p>",
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
  "plain": "At t=2⁻³⁰, float32 rounds 1+t to 1, so the direct formula returns 0 and its relative error is approximately 1. The rationalized value is about 2⁻³¹ and remains representable. Float64 resolves 1+t and produces a much more accurate direct result here. The float64 rationalized reference is still rounded, not an exact real number; use higher precision if claiming errors beyond its accuracy. Record both dtypes and versions, and compare errors relative to the small answer, not with a large absolute tolerance. Rubric: the float32 direct result 0 with the reason (1+t rounds to 1); a relative-error comparison against the float64 rationalized value; the float64 direct result shown to be accurate at this t; versions and dtypes recorded; the limits of treating a float64 value as exact.",
  "solution": "<p>At t=2⁻³⁰, float32 rounds 1+t to 1, so the direct formula returns 0 and its relative error is approximately 1. The rationalized value is about 2⁻³¹ and remains representable. Float64 resolves 1+t and produces a much more accurate direct result here. The float64 rationalized reference is still rounded, not an exact real number; use higher precision if claiming errors beyond its accuracy. Record both dtypes and versions, and compare errors relative to the small answer, not with a large absolute tolerance. Rubric: the float32 direct result 0 with the reason (1+t rounds to 1); a relative-error comparison against the float64 rationalized value; the float64 direct result shown to be accurate at this t; versions and dtypes recorded; the limits of treating a float64 value as exact.</p>",
  "proof": true
},
C2: {
  "statement": "**C2 · Stretch · PyTorch — a stable solve can face uncertain data.** In float64, build the 6×6 matrix A with ones on the diagonal and just above it, set b=A·(1,…,1), and use `torch.linalg.solve` for b and for b+δ(1,−1,1,−1,1,−1) with δ=10⁻⁸. Report each solve's residual against its own right-hand side, the relative change in the solution and in the data (infinity norm), and their ratio. Explain why small residuals and this amplification are compatible.",
  "plain": "A⁻¹ has entries (−1)^(j−i) on and above the diagonal, so ‖A⁻¹‖∞=6, ‖A‖∞=2, and κ∞=12. With x=(1,…,1), b=(2,2,2,2,2,1) and ‖b‖∞=2. For f=δ(1,−1,1,−1,1,−1), δx=A⁻¹f=δ(6,−5,4,−3,2,−1), so the relative solution change is 6δ against a relative data change of δ/2: a ratio of 12=κ∞. Both solves have residuals of rounding size (about 10⁻¹⁶) against their own right-hand sides, because each solve is backward stable. The residual measures how well each system was solved; the amplification measures how much the exact answer moves when the data move. The two are independent. Record the PyTorch version and dtype, and compare the observed ratio with 12 up to rounding. Rubric: residuals reported per right-hand side; the relative changes and their ratio; identification of the ratio with κ∞=2n; the distinction between solver accuracy and problem sensitivity.",
  "solution": "<p>A⁻¹ has entries (−1)^(j−i) on and above the diagonal, so ‖A⁻¹‖∞=6, ‖A‖∞=2, and κ∞=12. With x=(1,…,1), b=(2,2,2,2,2,1) and ‖b‖∞=2. For f=δ(1,−1,1,−1,1,−1), δx=A⁻¹f=δ(6,−5,4,−3,2,−1), so the relative solution change is 6δ against a relative data change of δ/2: a ratio of 12=κ∞. Both solves have residuals of rounding size (about 10⁻¹⁶) against their own right-hand sides, because each solve is backward stable. The residual measures how well each system was solved; the amplification measures how much the exact answer moves when the data move. The two are independent. Record the PyTorch version and dtype, and compare the observed ratio with 12 up to rounding. Rubric: residuals reported per right-hand side; the relative changes and their ratio; identification of the ratio with κ∞=2n; the distinction between solver accuracy and problem sensitivity.</p>",
  "fields": [
    {
      "id": "ratio",
      "label": "relative solution change ÷ relative data change",
      "type": "num",
      "ans": 12
    }
  ],
  "hints": {
    "ratio": "A⁻¹f has infinity norm 6δ; the data change is δ/‖b‖∞=δ/2 in relative terms."
  }
},
M1: {
  "statement": "**M1 · Core · mixed — volume is not robustness.** For the shear A=[[1,10⁴],[0,1]] and B=10⁻⁵I₂, compute det and κ∞ of each. Explain why determinant magnitude cannot rank these problems by relative solve sensitivity, and describe the shear's ill-conditioning in the ellipse picture.",
  "plain": "det A=1 and det B=10⁻¹⁰. For the shear, A⁻¹=[[1,−10⁴],[0,1]], so ‖A‖∞=‖A⁻¹‖∞=10⁴+1 and κ∞(A)=(10⁴+1)²=100020001. For B, κ∞(B)=1 because every multiple of the identity has condition number 1. The matrix with the far smaller determinant is perfectly conditioned, and the matrix with determinant 1 is ill conditioned. A determinant multiplies all the gains together, while conditioning compares the largest with the smallest, so the two can move in opposite directions. In the ellipse picture, the shear maps the unit circle to a long thin ellipse of area π (its determinant is 1): σ₁≈10⁴ and σ₂≈10⁻⁴, so κ₂≈10⁸, and the area stays π only because the huge stretch is exactly offset by the tiny one. Rubric: both determinants and both κ∞ values; the gains-product versus gains-ratio explanation; the ellipse description with equal area but extreme elongation.",
  "solution": "<p>det A=1 and det B=10⁻¹⁰. For the shear, A⁻¹=[[1,−10⁴],[0,1]], so ‖A‖∞=‖A⁻¹‖∞=10⁴+1 and κ∞(A)=(10⁴+1)²=100020001. For B, κ∞(B)=1 because every multiple of the identity has condition number 1. The matrix with the far smaller determinant is perfectly conditioned, and the matrix with determinant 1 is ill conditioned. A determinant multiplies all the gains together, while conditioning compares the largest with the smallest, so the two can move in opposite directions. In the ellipse picture, the shear maps the unit circle to a long thin ellipse of area π (its determinant is 1): σ₁≈10⁴ and σ₂≈10⁻⁴, so κ₂≈10⁸, and the area stays π only because the huge stretch is exactly offset by the tiny one. Rubric: both determinants and both κ∞ values; the gains-product versus gains-ratio explanation; the ellipse description with equal area but extreme elongation.</p>",
  "fields": [
    {
      "id": "kA",
      "label": "κ∞ of the shear",
      "type": "num",
      "ans": 100020001
    },
    {
      "id": "kB",
      "label": "κ∞(B)",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "kA": "Invert the shear by negating its off-diagonal entry, then multiply the two largest absolute row sums.",
    "kB": "Scaling the identity scales A and A⁻¹ in opposite ways."
  }
},
M2: {
  "statement": "**M2 · Core · mixed — normalize the residual.** For A=[[2,1],[1,1]], b=(3,2), and x̂=(1.1,0.8), compute r, the relative residual ‖r‖∞/‖b‖∞, the relative forward error in the infinity norm, and κ∞(A), and check the residual-based ceiling. Then multiply A and b by 10³: which of these numbers change?",
  "plain": "Ax̂=(2.2+0.8, 1.1+0.8)=(3.0,1.9), so r=b−Ax̂=(0,0.1) and the relative residual is 0.1/3=1/30. The exact solution is x=(1,1), so x̂−x=(0.1,−0.2) and the relative forward error is 0.2. A⁻¹=[[1,−1],[−1,2]], so ‖A‖∞=3, ‖A⁻¹‖∞=3, and κ∞=9. The ceiling is κ∞·(relative residual)=9/30=0.3, which is above the actual 0.2, as the theorem requires. After multiplying A and b by 10³, the residual becomes (0,100), but ‖b‖∞ also grows by 10³, so the relative residual stays 1/30. The solution, x̂, the forward error, and κ∞ are all unchanged. Only the absolute residual changes. Rubric: r and all three relative quantities computed; κ∞ from A⁻¹; the ceiling checked; a correct list of what the scaling changes.",
  "solution": "<p>Ax̂=(2.2+0.8, 1.1+0.8)=(3.0,1.9), so r=b−Ax̂=(0,0.1) and the relative residual is 0.1/3=1/30. The exact solution is x=(1,1), so x̂−x=(0.1,−0.2) and the relative forward error is 0.2. A⁻¹=[[1,−1],[−1,2]], so ‖A‖∞=3, ‖A⁻¹‖∞=3, and κ∞=9. The ceiling is κ∞·(relative residual)=9/30=0.3, which is above the actual 0.2, as the theorem requires. After multiplying A and b by 10³, the residual becomes (0,100), but ‖b‖∞ also grows by 10³, so the relative residual stays 1/30. The solution, x̂, the forward error, and κ∞ are all unchanged. Only the absolute residual changes. Rubric: r and all three relative quantities computed; κ∞ from A⁻¹; the ceiling checked; a correct list of what the scaling changes.</p>",
  "fields": [
    {
      "id": "relres",
      "label": "relative residual",
      "type": "num",
      "ans": 0.03333333333333333
    },
    {
      "id": "forward",
      "label": "relative forward error",
      "type": "num",
      "ans": 0.2
    },
    {
      "id": "kinf",
      "label": "κ∞(A)",
      "type": "num",
      "ans": 9
    }
  ],
  "hints": {
    "relres": "Divide the largest residual entry by ‖b‖∞=3. An answer such as 1/30 is accepted.",
    "forward": "The exact solution is (1,1); take the largest entry of x̂−x.",
    "kinf": "A⁻¹=[[1,−1],[−1,2]]; multiply the largest absolute row sums of A and A⁻¹."
  }
},
M3: {
  "statement": "**M3 · Stretch · mixed — units in the parameters.** A model has two parameters measured in different units, with A=[[1,100],[1,−100]]. Compute κ₂(A). Change units with the column scaling D=diag(1,1/100), so x=Dz and the system becomes ADz=b; compute κ₂(AD). Explain what κ₂(AD)=1 says, and does not say, about the accuracy of each original parameter.",
  "plain": "The columns (1,1) and (100,−100) are orthogonal, so the singular values are their lengths √2 and 100√2, and κ₂(A)=100. With D=diag(1,1/100), AD=[[1,1],[1,−1]] has orthogonal columns of equal length √2, so κ₂(AD)=1. What it says: in the scaled parameters z=D⁻¹x, a relative data error of size ρ produces a relative error of at most ρ in z, measured in the Euclidean norm of z. Because z₂=100x₂, that norm treats one unit of x₁ and one hundredth of a unit of x₂ as equally important, so it is the right measurement when those are the scientifically comparable sizes. What it does not say: it gives no guarantee in the original unweighted norm of x, where κ₂(A)=100 applies, and it does not remove any uncertainty in the data. Choosing D is a statement about which errors matter, not a numerical trick. Rubric: both condition numbers with justification; the translation x=Dz and what the scaled norm weighs; a clear statement that scaling changes the question being asked rather than the data.",
  "solution": "<p>The columns (1,1) and (100,−100) are orthogonal, so the singular values are their lengths √2 and 100√2, and κ₂(A)=100. With D=diag(1,1/100), AD=[[1,1],[1,−1]] has orthogonal columns of equal length √2, so κ₂(AD)=1. What it says: in the scaled parameters z=D⁻¹x, a relative data error of size ρ produces a relative error of at most ρ in z, measured in the Euclidean norm of z. Because z₂=100x₂, that norm treats one unit of x₁ and one hundredth of a unit of x₂ as equally important, so it is the right measurement when those are the scientifically comparable sizes. What it does not say: it gives no guarantee in the original unweighted norm of x, where κ₂(A)=100 applies, and it does not remove any uncertainty in the data. Choosing D is a statement about which errors matter, not a numerical trick. Rubric: both condition numbers with justification; the translation x=Dz and what the scaled norm weighs; a clear statement that scaling changes the question being asked rather than the data.</p>",
  "fields": [
    {
      "id": "kA",
      "label": "κ₂(A)",
      "type": "num",
      "ans": 100
    },
    {
      "id": "kAD",
      "label": "κ₂(AD)",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "kA": "The columns are orthogonal, so the singular values are the column lengths.",
    "kAD": "After scaling, both columns have length √2."
  }
},
M4: {
  "statement": "**M4 · Stretch · mixed — componentwise evidence differs.** Let A=diag(1,10⁻⁸), b=(1,10⁻⁸), and x̂=(1,0). Compute the relative infinity-norm residual. If only b may change and every component must satisfy |fᵢ|≤η|bᵢ|, find the smallest η. Explain the diagnostic disagreement.",
  "plain": "r=(0,10⁻⁸), while ‖b‖∞=1, giving relative infinity residual 10⁻⁸. Right-hand-side-only backward correction is f=−r=(0,−10⁻⁸). Its second coordinate changes by 100% of |b₂|, so the smallest componentwise η is 1. A normwise measure normalizes by the largest coordinate and can hide a complete loss of a smaller coordinate. Rubric: the infinity-norm residual normalized by ‖b‖∞; the right-hand-side-only correction −r; the componentwise ratio for the second entry; an explanation of why normwise normalization hides the lost component.",
  "solution": "<p>r=(0,10⁻⁸), while ‖b‖∞=1, giving relative infinity residual 10⁻⁸. Right-hand-side-only backward correction is f=−r=(0,−10⁻⁸). Its second coordinate changes by 100% of |b₂|, so the smallest componentwise η is 1. A normwise measure normalizes by the largest coordinate and can hide a complete loss of a smaller coordinate. Rubric: the infinity-norm residual normalized by ‖b‖∞; the right-hand-side-only correction −r; the componentwise ratio for the second entry; an explanation of why normwise normalization hides the lost component.</p>",
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
  "statement": "**K3 · Core · gate — diagnose a small residual.** For A=[[1,1],[1,1+10⁻⁸]], b=(2,2), and x̂=(0,2), find the exact solution, then give the relative residual, the relative forward error, κ₂ to one significant figure, and η₂ (all in the 2-norm). Does the residual-based ceiling hold, and is it attained?",
  "plain": "The second equation minus the first gives 10⁻⁸x₂=0, so x₂=0 and x=(2,0). Then Ax̂=(2, 2+2·10⁻⁸), so r=(0,−2·10⁻⁸), and the relative residual is 2·10⁻⁸/‖(2,2)‖₂=2·10⁻⁸/(2√2)=(√2/2)·10⁻⁸≈0.71×10⁻⁸. The forward error is ‖(−2,2)‖₂/‖(2,0)‖₂=√2≈1.41: the answer is completely wrong. A is symmetric with eigenvalues (2+δ±√(4+δ²))/2 for δ=10⁻⁸, approximately 2 and δ/2, so κ₂≈4/δ=4×10⁸. The ceiling κ₂·(relative residual)≈4×10⁸·0.71×10⁻⁸≈2.8 holds, since 1.41≤2.8, but is not attained: r is not exactly along the weakest direction. With ‖A‖₂≈2, ‖x̂‖₂=2, and ‖b‖₂=2√2, η₂=2·10⁻⁸/(4+2√2)≈2.93×10⁻⁹. The two nearly parallel rows are the geometric source of the ill-conditioning. Rubric: the exact solution; r and all relative quantities; κ₂ from the eigenvalues with the right order of magnitude; the ceiling checked and correctly judged not attained; η₂ with the right denominator.",
  "solution": "<p>The second equation minus the first gives 10⁻⁸x₂=0, so x₂=0 and x=(2,0). Then Ax̂=(2, 2+2·10⁻⁸), so r=(0,−2·10⁻⁸), and the relative residual is 2·10⁻⁸/‖(2,2)‖₂=2·10⁻⁸/(2√2)=(√2/2)·10⁻⁸≈0.71×10⁻⁸. The forward error is ‖(−2,2)‖₂/‖(2,0)‖₂=√2≈1.41: the answer is completely wrong. A is symmetric with eigenvalues (2+δ±√(4+δ²))/2 for δ=10⁻⁸, approximately 2 and δ/2, so κ₂≈4/δ=4×10⁸. The ceiling κ₂·(relative residual)≈4×10⁸·0.71×10⁻⁸≈2.8 holds, since 1.41≤2.8, but is not attained: r is not exactly along the weakest direction. With ‖A‖₂≈2, ‖x̂‖₂=2, and ‖b‖₂=2√2, η₂=2·10⁻⁸/(4+2√2)≈2.93×10⁻⁹. The two nearly parallel rows are the geometric source of the ill-conditioning. Rubric: the exact solution; r and all relative quantities; κ₂ from the eigenvalues with the right order of magnitude; the ceiling checked and correctly judged not attained; η₂ with the right denominator.</p>",
  "fields": [
    {
      "id": "residual",
      "label": "relative residual in units of 10⁻⁸",
      "type": "num",
      "ans": 0.7071067811865476
    },
    {
      "id": "forward",
      "label": "relative forward error",
      "type": "num",
      "ans": 1.4142135623730951
    },
    {
      "id": "eta",
      "label": "η₂ in units of 10⁻⁹",
      "type": "num",
      "ans": 2.928932188134525
    }
  ],
  "hints": {
    "residual": "‖r‖₂=2·10⁻⁸ and ‖b‖₂=2√2; an answer such as sqrt(2)/2 is accepted.",
    "forward": "The exact solution is (2,0); compare it with (0,2).",
    "eta": "Use ‖A‖₂≈2, ‖x̂‖₂=2 and ‖b‖₂=2√2 in the denominator, then express in units of 10⁻⁹."
  }
},
K4: {
  "statement": "**K4 · Core · gate — debug a condition report.** A program returns the largest singular value as its “condition number,” and declares matrices with determinant magnitude below 10⁻¹² singular. Using the rotation Q=[[0.6,−0.8],[0.8,0.6]] and its column-scaled version Q·diag(1,10⁻⁹) for the first rule, and a multiple of the identity for the second, give a counterexample to each rule and describe a scale-aware replacement with explicit numerical limitations.",
  "plain": "The rotation Q and QD with D=diag(1,10⁻⁹) both have largest singular value 1 (multiplying by Q does not change singular values), but κ₂(Q)=1 while κ₂(QD)=10⁹, refuting the first rule. The perfectly conditioned 10⁻⁸I₂ has determinant 10⁻¹⁶ and would be declared singular by the second rule, refuting it too. Replace the first report by both extreme singular scales, or by a factor-and-solve estimate of the reciprocal condition number with the norm named. For numerical rank, use a tolerance relative to the largest singular value and to the input uncertainty, and disclose it. A tiny or zero computed singular value needs a precision and uncertainty qualification; a cutoff does not prove exact rank. Rubric: a counterexample to each rule (equal top singular values with different κ; a perfectly conditioned matrix with tiny determinant); a replacement that reports both extreme singular scales or a named-norm reciprocal condition estimate; a relative, disclosed rank tolerance; and an explicit statement that a cutoff is not an exact-rank proof.",
  "solution": "<p>The rotation Q and QD with D=diag(1,10⁻⁹) both have largest singular value 1 (multiplying by Q does not change singular values), but κ₂(Q)=1 while κ₂(QD)=10⁹, refuting the first rule. The perfectly conditioned 10⁻⁸I₂ has determinant 10⁻¹⁶ and would be declared singular by the second rule, refuting it too. Replace the first report by both extreme singular scales, or by a factor-and-solve estimate of the reciprocal condition number with the norm named. For numerical rank, use a tolerance relative to the largest singular value and to the input uncertainty, and disclose it. A tiny or zero computed singular value needs a precision and uncertainty qualification; a cutoff does not prove exact rank. Rubric: a counterexample to each rule (equal top singular values with different κ; a perfectly conditioned matrix with tiny determinant); a replacement that reports both extreme singular scales or a named-norm reciprocal condition estimate; a relative, disclosed rank tolerance; and an explicit statement that a cutoff is not an exact-rank proof.</p>",
  "proof": true
},
K5: {
  "statement": "**K5 · Stretch · gate — critique an experiment.** An audit perturbs only the strongest output direction, observes a small solution change, and claims the solver is backward stable and the problem robust. Identify what was actually measured and design separate tests for sensitivity and algorithmic error.",
  "plain": "The audit measured one directional response of the implemented pipeline. It neither maximized over perturbations nor isolated solver arithmetic. For sensitivity, fix stored A and controlled perturbation sizes, sweep directions including the weakest left singular direction, and compare exact or high-precision solves. For algorithmic error, fix each stored input, compare candidates with an oracle when available, and measure residual/backward error against that same input while changing algorithm or dtype. Include scales, norms, denominator validity, and repeated controlled fixtures. Empirical successes still do not prove an algorithmic backward-stability theorem. Rubric: identifies that one directional response was measured; a sensitivity test that sweeps directions including the weakest; an algorithm test that holds the input fixed and compares residual or backward error across algorithms or dtypes against an oracle; states that passing experiments do not prove a backward-stability theorem.",
  "solution": "<p>The audit measured one directional response of the implemented pipeline. It neither maximized over perturbations nor isolated solver arithmetic. For sensitivity, fix stored A and controlled perturbation sizes, sweep directions including the weakest left singular direction, and compare exact or high-precision solves. For algorithmic error, fix each stored input, compare candidates with an oracle when available, and measure residual/backward error against that same input while changing algorithm or dtype. Include scales, norms, denominator validity, and repeated controlled fixtures. Empirical successes still do not prove an algorithmic backward-stability theorem. Rubric: identifies that one directional response was measured; a sensitivity test that sweeps directions including the weakest; an algorithm test that holds the input fixed and compares residual or backward error across algorithms or dtypes against an oracle; states that passing experiments do not prove a backward-stability theorem.</p>",
  "proof": true
},
K6: {
  "statement": "**K6 · Stretch · gate — an unfamiliar error metric.** A diagonal solve uses positive coordinate scales D=diag(dᵢ) for inputs and C=diag(cᵢ) for outputs, with ‖x‖X=‖D⁻¹x‖₂ and ‖b‖Y=‖C⁻¹b‖₂. Derive the matrix whose Euclidean condition number describes these scaled norms. Explain how to report errors back in physical coordinates.",
  "plain": "Set z=D⁻¹x and y=C⁻¹b. Then Bz=y with B=C⁻¹AD. The input and output norms are Euclidean in z and y, so the relative solve condition number in these scaled metrics is κ₂(B) (for nonsingular A). For diagonal A, B has diagonal entries aᵢdᵢ/cᵢ, so take the ratio of their largest and smallest absolute values. Report physical-coordinate errors as δx=Dδz and transform data perturbations as δy=C⁻¹δb; a small scaled error can mean a larger raw error on a coordinate with large dᵢ. Rubric: correct order of scaling factors, invertibility, the diagonal gain ratio, and translation of both errors and uncertainties.",
  "solution": "<p>Set z=D⁻¹x and y=C⁻¹b. Then Bz=y with B=C⁻¹AD. The input and output norms are Euclidean in z and y, so the relative solve condition number in these scaled metrics is κ₂(B) (for nonsingular A). For diagonal A, B has diagonal entries aᵢdᵢ/cᵢ, so take the ratio of their largest and smallest absolute values. Report physical-coordinate errors as δx=Dδz and transform data perturbations as δy=C⁻¹δb; a small scaled error can mean a larger raw error on a coordinate with large dᵢ. Rubric: correct order of scaling factors, invertibility, the diagonal gain ratio, and translation of both errors and uncertainties.</p>",
  "proof": true
}
});
