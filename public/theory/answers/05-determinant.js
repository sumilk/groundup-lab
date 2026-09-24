/* Authored reference solutions and offline numeric checks. */
GU.answers("05-determinant", {
A1: {
  "statement": "**A1 · Foundation · paper — one cell, two numbers.** For \\(A=\\begin{pmatrix}2&1\\\\1&3\\end{pmatrix}\\), find the signed determinant, ordinary area, and signed first-row cofactor contributions.",
  "plain": "The contributions are 2·3=6 and −1·1=−1. Their sum is 5; ordinary area is |5|=5. The ordered image frame has positive orientation.",
  "solution": "<p>The contributions are 2·3=6 and −1·1=−1. Their sum is 5; ordinary area is |5|=5. The ordered image frame has positive orientation.</p>",
  "fields": [
    {
      "id": "det",
      "label": "signed determinant",
      "type": "num",
      "ans": 5
    },
    {
      "id": "area",
      "label": "ordinary area",
      "type": "num",
      "ans": 5
    },
    {
      "id": "pieces",
      "label": "signed contributions",
      "type": "vec",
      "ans": [
        6,
        -1
      ]
    }
  ],
  "hints": {
    "det": "Keep the subtraction between the two diagonal products.",
    "area": "Ordinary area is the absolute value of the signed determinant.",
    "pieces": "Include both the entry and its signed cofactor in each contribution."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — slide, swap, scale.** Start with columns \\(u=(2,1),v=(1,3)\\). Find the determinants of \\([u\\ v+4u]\\), \\([v\\ u]\\), and \\([-2u\\ v]\\).",
  "plain": "The starting determinant is 5. Column addition leaves it 5, a swap changes it to −5, and multiplying one column by −2 gives −10.",
  "solution": "<p>The starting determinant is 5. Column addition leaves it 5, a swap changes it to −5, and multiplying one column by −2 gives −10.</p>",
  "fields": [
    {
      "id": "d",
      "label": "three determinants",
      "type": "vec",
      "ans": [
        5,
        -5,
        -10
      ]
    }
  ],
  "hints": {
    "d": "Apply one column-operation rule per matrix, always starting from the original columns."
  }
},
A3: {
  "statement": "**A3 · Core · paper — derive the subtraction.** Derive \\(ad-bc\\) from the three defining properties. Include the argument that a column swap negates D.",
  "plain": "Expand D(u+v,u+v)=0 to obtain D(u,v)+D(v,u)=0. Expand D(ae₁+ce₂,be₁+de₂). The repeated-basis terms vanish, D(e₁,e₂)=1, and D(e₂,e₁)=−1, leaving ad−bc.",
  "solution": "<p>Expand D(u+v,u+v)=0 to obtain D(u,v)+D(v,u)=0. Expand D(ae₁+ce₂,be₁+de₂). The repeated-basis terms vanish, D(e₁,e₂)=1, and D(e₂,e₁)=−1, leaving ad−bc.</p>"
},
A4: {
  "statement": "**A4 · Core · paper — uniqueness without division.** Prove every alternating multilinear F on n columns equals \\(F(e_1,\\ldots,e_n)\\det\\), including when the value on the standard basis is zero.",
  "plain": "Expand each column in the standard basis. Repeated selected directions give zero. Distinct selections are permutations, each with value sgn(σ)F(e₁,…,eₙ). Factoring out this value leaves the determinant permutation sum. The argument never divides, so also proves F is identically zero when its basis value is zero.",
  "solution": "<p>Expand each column in the standard basis. Repeated selected directions give zero. Distinct selections are permutations, each with value sgn(σ)F(e₁,…,eₙ). Factoring out this value leaves the determinant permutation sum. The argument never divides, so also proves F is identically zero when its basis value is zero.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — a swap ledger.** Compute \\(\\det\\begin{pmatrix}0&2&1\\\\1&1&0\\\\2&0&1\\end{pmatrix}\\) by elimination. Record each row operation.",
  "plain": "Swap rows 1 and 2. Subtract twice the new row 1 from row 3, giving (0,−2,1). Add row 2 to row 3, giving (0,0,2). The diagonal product is 1·2·2=4. One swap gives original determinant −4.",
  "solution": "<p>Swap rows 1 and 2. Subtract twice the new row 1 from row 3, giving (0,−2,1). Add row 2 to row 3, giving (0,0,2). The diagonal product is 1·2·2=4. One swap gives original determinant −4.</p>",
  "fields": [
    {
      "id": "d",
      "label": "determinant",
      "type": "num",
      "ans": -4
    }
  ],
  "hints": {
    "d": "The triangular determinant is 4; undo the one row swap."
  }
},
A6: {
  "statement": "**A6 · Core · paper — two cofactor views.** For \\(A=\\begin{pmatrix}2&1&0\\\\1&2&1\\\\1&0&2\\end{pmatrix}\\), give the first-column and first-row contributions and reconcile their sums.",
  "plain": "The first-column contributions are 2(4)=8, −1(2)=−2, and 1(1)=1. The first-row contributions are 2(4)=8, −1(2−1)=−1, and 0. Both sum to 7. They split different edges, so their individual contributions need not match.",
  "solution": "<p>The first-column contributions are 2(4)=8, −1(2)=−2, and 1(1)=1. The first-row contributions are 2(4)=8, −1(2−1)=−1, and 0. Both sum to 7. They split different edges, so their individual contributions need not match.</p>",
  "fields": [
    {
      "id": "col",
      "label": "first-column contributions",
      "type": "vec",
      "ans": [
        8,
        -2,
        1
      ]
    },
    {
      "id": "row",
      "label": "first-row contributions",
      "type": "vec",
      "ans": [
        8,
        -1,
        0
      ]
    }
  ],
  "hints": {
    "col": "Expand down column 1 with signs +, −, +.",
    "row": "Delete row 1 and each selected column; include its entry multiplier."
  }
},
A7: {
  "statement": "**A7 · Core · paper — composition including collapse.** Prove \\(\\det(AB)=\\det A\\det B\\) without assuming either factor is invertible.",
  "plain": "Fix A and define F(b₁,…,bₙ)=det(Ab₁,…,Abₙ). Linearity of A makes F multilinear; repeated columns stay repeated, so F is alternating. Uniqueness up to the basis value gives F(B)=F(I)det B=det A det B, including the case F(I)=0.",
  "solution": "<p>Fix A and define F(b₁,…,bₙ)=det(Ab₁,…,Abₙ). Linearity of A makes F multilinear; repeated columns stay repeated, so F is alternating. Uniqueness up to the basis value gives F(B)=F(I)det B=det A det B, including the case F(I)=0.</p>"
},
A8: {
  "statement": "**A8 · Foundation · paper — scale all columns.** For a 3×3 A with \\(\\det A=-2\\), compute \\(\\det(-2A)\\), \\(\\det(A^{\\mathsf T})\\), and \\(\\det(A^{-1})\\).",
  "plain": "Scaling all three columns multiplies by (−2)³, giving 16. Transpose leaves −2 unchanged. The inverse has determinant −1/2.",
  "solution": "<p>Scaling all three columns multiplies by (−2)³, giving 16. Transpose leaves −2 unchanged. The inverse has determinant −1/2.</p>",
  "fields": [
    {
      "id": "d",
      "label": "three determinants",
      "type": "vec",
      "ans": [
        16,
        -2,
        -0.5
      ]
    }
  ],
  "hints": {
    "d": "There are three column scale factors; transpose preserves the value; inversion reciprocates it."
  }
},
A9: {
  "statement": "**A9 · Core · paper — a QR volume certificate.** A square QR has positive R diagonal \\((2,3,1/2)\\) and \\(\\det Q=-1\\). Find volume and signed determinant. Explain geometrically why multiplying the original column lengths generally fails.",
  "plain": "The perpendicular heights multiply to 3, so volume is 3 and determinant is −3. Original columns may lean into previous directions; their full lengths overcount the new perpendicular heights. QR removes those parallel components.",
  "solution": "<p>The perpendicular heights multiply to 3, so volume is 3 and determinant is −3. Original columns may lean into previous directions; their full lengths overcount the new perpendicular heights. QR removes those parallel components.</p>",
  "fields": [
    {
      "id": "v",
      "label": "volume",
      "type": "num",
      "ans": 3
    },
    {
      "id": "d",
      "label": "signed determinant",
      "type": "num",
      "ans": -3
    }
  ],
  "hints": {
    "v": "Multiply the three positive QR heights.",
    "d": "Attach the orientation sign supplied by Q."
  }
},
A10: {
  "statement": "**A10 · Stretch · paper — orientation cannot jump.** Prove a continuous matrix path from \\(I_3\\) to \\(\\operatorname{diag}(1,1,-1)\\) contains a singular matrix. Must every path between two positive-determinant matrices stay invertible?",
  "plain": "The determinant polynomial is continuous and its endpoint values are 1 and −1, so the intermediate value theorem supplies a zero. Positive endpoints do not constrain an arbitrary path to stay invertible: a path from I to itself through the zero matrix is a counterexample. The claim concerns every path across opposite signs, not every path within one sign at its endpoints.",
  "solution": "<p>The determinant polynomial is continuous and its endpoint values are 1 and −1, so the intermediate value theorem supplies a zero. Positive endpoints do not constrain an arbitrary path to stay invertible: a path from I to itself through the zero matrix is a counterexample. The claim concerns every path across opposite signs, not every path within one sign at its endpoints.</p>"
},
A11: {
  "statement": "**A11 · Core · paper — mass is not signed.** A uniform source has density 1 on \\([0,1]^2\\). Apply \\(y=\\operatorname{diag}(-2,3)x+(4,1)\\). Give the output rectangle, its area, and its density.",
  "plain": "The output is [2,4]×[1,4], area 6. Density is 1/6 on that rectangle and zero outside (boundary conventions do not affect probabilities). The determinant is −6; its negative sign flips orientation, not mass.",
  "solution": "<p>The output is [2,4]×[1,4], area 6. Density is 1/6 on that rectangle and zero outside (boundary conventions do not affect probabilities). The determinant is −6; its negative sign flips orientation, not mass.</p>",
  "fields": [
    {
      "id": "area",
      "label": "output area",
      "type": "num",
      "ans": 6
    },
    {
      "id": "p",
      "label": "density inside",
      "type": "num",
      "ans": 0.16666666666666666
    }
  ],
  "hints": {
    "area": "Multiply the output side lengths 2 and 3.",
    "p": "The probability mass remains 1 over an area of 6."
  }
},
A12: {
  "statement": "**A12 · Stretch · paper — local invertibility is insufficient.** For \\(f(s,t)=(e^s\\cos t,e^s\\sin t)\\), the supplied Jacobian has determinant \\(e^{2s}>0\\). Explain why f on all of \\(\\mathbb R^2\\) is not globally one-to-one and why a single-preimage density formula is unjustified.",
  "plain": "The inputs (s,t) and (s,t+2π) have identical images. A nonzero determinant supplies local volume scaling but does not remove this periodic overlap. One must restrict to a suitable injective angular domain or account for the mass from all relevant preimages; plugging an arbitrary one into the bijective density formula misses contributions.",
  "solution": "<p>The inputs (s,t) and (s,t+2π) have identical images. A nonzero determinant supplies local volume scaling but does not remove this periodic overlap. One must restrict to a suitable injective angular domain or account for the mass from all relevant preimages; plugging an arbitrary one into the bijective density formula misses contributions.</p>"
},
B1: {
  "statement": "**B1 · Foundation · NumPy — verify the sign ledger.** Compare `np.linalg.det` with your elimination routine on A5, an identity, a row-swapped identity, and a singular matrix. State a numerical comparison tolerance.",
  "plain": "Expected determinants are −4, 1, −1, and 0. Report floating-point dtype and use an absolute tolerance such as 1e−12 for these small fixtures, with a relative tolerance for nonzero comparisons. A numerical agreement is evidence for the code, not a proof of the determinant rules.",
  "solution": "<p>Expected determinants are −4, 1, −1, and 0. Report floating-point dtype and use an absolute tolerance such as 1e−12 for these small fixtures, with a relative tolerance for nonzero comparisons. A numerical agreement is evidence for the code, not a proof of the determinant rules.</p>"
},
B2: {
  "statement": "**B2 · Core · NumPy — same map, different cells.** For \\(A=\\begin{pmatrix}2&1\\\\0&-3\\end{pmatrix}\\), compare absolute volume ratios on B=I, \\(B=\\begin{pmatrix}1&1\\\\0&2\\end{pmatrix}\\), and B with its columns swapped.",
  "plain": "The source volumes are 1, 2, and 2; image volumes are 6, 12, and 12. Every ratio is 6. The signed source determinants are 1, 2, −2; the corresponding signed image determinants are −6, −12, 12. Absolute ratios ignore the basis orientation.",
  "solution": "<p>The source volumes are 1, 2, and 2; image volumes are 6, 12, and 12. Every ratio is 6. The signed source determinants are 1, 2, −2; the corresponding signed image determinants are −6, −12, 12. Absolute ratios ignore the basis orientation.</p>",
  "fields": [
    {
      "id": "r",
      "label": "three ratios",
      "type": "vec",
      "ans": [
        6,
        6,
        6
      ]
    }
  ],
  "hints": {
    "r": "Compute |det(AB)|/|det B| in each case."
  }
},
B3: {
  "statement": "**B3 · Core · NumPy — a product can exceed storage.** In float64 use 4×4 diagonal matrices with every diagonal entry \\(10^{100}\\), then \\(10^{-100}\\). Compare `det` and `slogdet`; predict both log-magnitudes.",
  "plain": "The exact determinants are 10⁴⁰⁰ and 10⁻⁴⁰⁰, beyond the ordinary float64 product range in opposite directions. Raw det may report infinity and zero; slogdet gives sign +1 and log-magnitudes ±400 log(10), about ±921.034. Compare those logs, not exp(logabsdet), which would recreate the range problem.",
  "solution": "<p>The exact determinants are 10⁴⁰⁰ and 10⁻⁴⁰⁰, beyond the ordinary float64 product range in opposite directions. Raw det may report infinity and zero; slogdet gives sign +1 and log-magnitudes ±400 log(10), about ±921.034. Compare those logs, not exp(logabsdet), which would recreate the range problem.</p>",
  "fields": [
    {
      "id": "logs",
      "label": "two log-magnitudes",
      "type": "vec",
      "ans": [
        921.0340371976183,
        -921.0340371976183
      ]
    }
  ],
  "hints": {
    "logs": "Sum four natural logarithms of the diagonal magnitude."
  }
},
B4: {
  "statement": "**B4 · Core · NumPy — small is not the same as fragile.** Compare \\(10^{-6}I_3\\) and \\(\\operatorname{diag}(10^6,10^{-6})\\). Record determinants and the output lengths of all coordinate unit vectors. Explain why determinant alone cannot summarize directional distortion.",
  "plain": "The first determinant is 10⁻¹⁸ and all three output lengths are 10⁻⁶. The second determinant is 1 and its two output lengths are 10⁶ and 10⁻⁶. A tiny determinant can reflect uniform rescaling; determinant 1 can conceal enormous directional imbalance.",
  "solution": "<p>The first determinant is 10⁻¹⁸ and all three output lengths are 10⁻⁶. The second determinant is 1 and its two output lengths are 10⁶ and 10⁻⁶. A tiny determinant can reflect uniform rescaling; determinant 1 can conceal enormous directional imbalance.</p>"
},
B5: {
  "statement": "**B5 · Core · NumPy — when the input already collapsed.** For \\(A_\\varepsilon=\\begin{pmatrix}1&1\\\\1&1+\\varepsilon\\end{pmatrix}\\), sweep \\(\\varepsilon=10^{-4},10^{-8},10^{-12},10^{-16}\\) in float64. Print the stored bottom-right entry minus 1 before computing either determinant formula.",
  "plain": "The intended real determinant is ε, but the determinant of the stored matrix is the represented increment (1+ε)−1. In ordinary IEEE float64 the ε=10⁻¹⁶ entry rounds to 1, so the stored matrix is singular. Report both intended ε and stored increment. No determinant algorithm or logarithm can recover information that was rounded out before it ran.",
  "solution": "<p>The intended real determinant is ε, but the determinant of the stored matrix is the represented increment (1+ε)−1. In ordinary IEEE float64 the ε=10⁻¹⁶ entry rounds to 1, so the stored matrix is singular. Report both intended ε and stored increment. No determinant algorithm or logarithm can recover information that was rounded out before it ran.</p>"
},
B6: {
  "statement": "**B6 · Stretch · NumPy — volume from QR.** Use library QR on the 3×3 example in A6 and on the 3×2 matrix with columns \\((1,1,0),(1,0,1)\\). Compare the product of absolute R diagonals with the appropriate cell volume.",
  "plain": "For the square matrix the product is 7. For the tall matrix the two positive geometric heights are √2 and √(3/2), with product √3. Its Gram matrix is [[2,1],[1,2]], determinant 3, so sqrt(det(AᵀA)) agrees. There is no determinant of the rectangular input itself. Library sign choices do not affect the absolute product.",
  "solution": "<p>For the square matrix the product is 7. For the tall matrix the two positive geometric heights are √2 and √(3/2), with product √3. Its Gram matrix is [[2,1],[1,2]], determinant 3, so sqrt(det(AᵀA)) agrees. There is no determinant of the rectangular input itself. Library sign choices do not affect the absolute product.</p>",
  "fields": [
    {
      "id": "v",
      "label": "square and embedded cell volumes",
      "type": "vec",
      "ans": [
        7,
        1.7320508075688772
      ]
    }
  ],
  "hints": {
    "v": "For the tall case use the Gram determinant or the two QR heights."
  }
},
C1: {
  "statement": "**C1 · Foundation · PyTorch — batch the orientations.** Create a float64 batch containing \\(I_2\\), \\(\\operatorname{diag}(-1,1)\\), and \\(\\operatorname{diag}(1,0)\\). Use `torch.linalg.slogdet`. Predict the sign and log-magnitude for each.",
  "plain": "Signs are [1,−1,0]. Log-magnitudes are [0,0,−∞]. Reflection keeps unit area but changes orientation; collapse has zero area, represented by sign 0 and logarithm −∞. Do not treat −∞ as an ordinary finite answer.",
  "solution": "<p>Signs are [1,−1,0]. Log-magnitudes are [0,0,−∞]. Reflection keeps unit area but changes orientation; collapse has zero area, represented by sign 0 and logarithm −∞. Do not treat −∞ as an ordinary finite answer.</p>",
  "fields": [
    {
      "id": "s",
      "label": "three signs",
      "type": "vec",
      "ans": [
        1,
        -1,
        0
      ]
    }
  ],
  "hints": {
    "s": "Read orientation separately from log area; zero is the singular sign."
  }
},
C2: {
  "statement": "**C2 · Core · PyTorch — an affine density calculation.** For \\(A=\\operatorname{diag}(-2,3)\\), take source log-density −2 at x. Use `slogdet` to compute the output log-density at Ax. Explain why `log(det(A))` is unsuitable over the reals.",
  "plain": "Output log-density is −2−log(6), approximately −3.791759469. det(A)=−6 has no real logarithm; log absolute determinant is log(6), while a separate sign records orientation.",
  "solution": "<p>Output log-density is −2−log(6), approximately −3.791759469. det(A)=−6 has no real logarithm; log absolute determinant is log(6), while a separate sign records orientation.</p>",
  "fields": [
    {
      "id": "lp",
      "label": "output log-density",
      "type": "num",
      "ans": -3.791759469228055
    }
  ],
  "hints": {
    "lp": "Subtract log absolute volume expansion from the source log-density."
  }
},
C3: {
  "statement": "**C3 · Core · PyTorch — compose without losing the sign.** Let \\(A=\\operatorname{diag}(-2,1)\\), \\(B=\\begin{pmatrix}1&1\\\\0&-3\\end{pmatrix}\\). Verify that product signs multiply and log-magnitudes add. Compare AB and BA.",
  "plain": "Both factors reverse orientation, with signs −1 and logs log(2), log(3). Both products have sign +1 and log-magnitude log(6), but AB=[[-2,−2],[0,−3]] and BA=[[-2,1],[0,−3]] are different maps. Determinant multiplicativity does not assert matrix commutativity.",
  "solution": "<p>Both factors reverse orientation, with signs −1 and logs log(2), log(3). Both products have sign +1 and log-magnitude log(6), but AB=[[-2,−2],[0,−3]] and BA=[[-2,1],[0,−3]] are different maps. Determinant multiplicativity does not assert matrix commutativity.</p>"
},
C4: {
  "statement": "**C4 · Stretch · PyTorch — triangular flow bookkeeping.** A supplied local Jacobian is \\(J=\\begin{pmatrix}1&0\\\\5&2\\end{pmatrix}\\). Verify its volume factor, then replace 5 by several large and small finite values. State what remains fixed and what the experiment does not establish.",
  "plain": "The determinant remains 2, sign +1, log-magnitude log(2), and local density multiplier 1/2. The off-diagonal entry changes the shear. This pointwise experiment establishes no global injectivity for an otherwise unspecified nonlinear map and no bound on directional sensitivity.",
  "solution": "<p>The determinant remains 2, sign +1, log-magnitude log(2), and local density multiplier 1/2. The off-diagonal entry changes the shear. This pointwise experiment establishes no global injectivity for an otherwise unspecified nonlinear map and no bound on directional sensitivity.</p>",
  "fields": [
    {
      "id": "density",
      "label": "local density multiplier",
      "type": "num",
      "ans": 0.5
    }
  ],
  "hints": {
    "density": "For this triangular Jacobian use the diagonal product, then reciprocate its absolute value."
  }
},
M1: {
  "statement": "**M1 · Core · paper — collapse through the four subspaces.** For \\(A=\\begin{pmatrix}1&2\\\\2&4\\end{pmatrix}\\), find its determinant, rank, and bases for all four fundamental subspaces. Connect zero area to the null space.",
  "plain": "det A=0 and rank A=1. C(A) and C(Aᵀ) both have basis {(1,2)}. N(A) and N(Aᵀ) both have basis {(−2,1)}. Moving along the nonzero kernel direction changes no output; a two-dimensional cell maps into a line.",
  "solution": "<p>det A=0 and rank A=1. C(A) and C(Aᵀ) both have basis {(1,2)}. N(A) and N(Aᵀ) both have basis {(−2,1)}. Moving along the nonzero kernel direction changes no output; a two-dimensional cell maps into a line.</p>",
  "fields": [
    {
      "id": "dr",
      "label": "determinant and rank",
      "type": "vec",
      "ans": [
        0,
        1
      ]
    }
  ],
  "hints": {
    "dr": "The second column is twice the first, but the first is nonzero."
  }
},
M2: {
  "statement": "**M2 · Core · paper — the projection keeps lengths selectively.** For the orthogonal projector \\(P=\\operatorname{diag}(1,1,0)\\), find the determinant and rank. Explain why P preserves every vector in its range despite its zero determinant.",
  "plain": "The determinant is 0 and rank is 2. Vectors (x,y,0) are fixed, so their lengths are preserved. The third coordinate is discarded; three-dimensional volume collapses to zero even though two-dimensional geometry in the range survives.",
  "solution": "<p>The determinant is 0 and rank is 2. Vectors (x,y,0) are fixed, so their lengths are preserved. The third coordinate is discarded; three-dimensional volume collapses to zero even though two-dimensional geometry in the range survives.</p>",
  "fields": [
    {
      "id": "dr",
      "label": "determinant and rank",
      "type": "vec",
      "ans": [
        0,
        2
      ]
    }
  ],
  "hints": {
    "dr": "Separate the two surviving coordinate directions from the lost third direction."
  }
},
M3: {
  "statement": "**M3 · Core · paper — the same operator in another basis.** For invertible S, prove A and \\(S^{-1}AS\\) have the same determinant. Contrast this with the cell whose edge matrix is AS.",
  "plain": "Multiplicativity gives det(S⁻¹AS)=det(S)⁻¹ det(A) det(S)=det A. In contrast det(AS)=det A det S: AS maps the cell with source edges S, whose signed volume need not be 1. A simultaneous basis change is not the same as choosing a differently sized source cell.",
  "solution": "<p>Multiplicativity gives det(S⁻¹AS)=det(S)⁻¹ det(A) det(S)=det A. In contrast det(AS)=det A det S: AS maps the cell with source edges S, whose signed volume need not be 1. A simultaneous basis change is not the same as choosing a differently sized source cell.</p>"
},
M4: {
  "statement": "**M4 · Stretch · paper — rectangular volume from the Gram matrix.** For A with columns \\((1,1,0),(1,0,1)\\), compute \\(A^{\\mathsf T}A\\), its determinant, and the embedded area. Explain why no scalar determinant of A was used.",
  "plain": "The Gram matrix is [[2,1],[1,2]], with determinant 3. QR gives area √3. The Gram matrix is square while A is 3×2; sqrt(det(AᵀA)) describes an unsigned two-dimensional cell in three-dimensional space.",
  "solution": "<p>The Gram matrix is [[2,1],[1,2]], with determinant 3. QR gives area √3. The Gram matrix is square while A is 3×2; sqrt(det(AᵀA)) describes an unsigned two-dimensional cell in three-dimensional space.</p>",
  "fields": [
    {
      "id": "d",
      "label": "Gram determinant",
      "type": "num",
      "ans": 3
    },
    {
      "id": "a",
      "label": "embedded area",
      "type": "num",
      "ans": 1.7320508075688772
    }
  ],
  "hints": {
    "d": "Compute the determinant of the 2×2 matrix of column inner products.",
    "a": "The Gram determinant is the square of the area."
  }
},
M5: {
  "statement": "**M5 · Core · mixed — RREF erased the scale.** Both \\(I_2\\) and \\(\\operatorname{diag}(2,3)\\) reduce to I. Give their determinants and explain why RREF alone cannot recover them.",
  "plain": "The determinants are 1 and 6. Reducing the latter to I scales its rows by 1/2 and 1/3. RREF preserves rank and solution equivalence under the corresponding row operations, but raw determinant scale is lost unless those operation factors are retained.",
  "solution": "<p>The determinants are 1 and 6. Reducing the latter to I scales its rows by 1/2 and 1/3. RREF preserves rank and solution equivalence under the corresponding row operations, but raw determinant scale is lost unless those operation factors are retained.</p>",
  "fields": [
    {
      "id": "d",
      "label": "two determinants",
      "type": "vec",
      "ans": [
        1,
        6
      ]
    }
  ],
  "hints": {
    "d": "Record the factors used to normalize the pivots."
  }
},
M6: {
  "statement": "**M6 · Stretch · paper — a fixed metric changes the unit.** Let G be positive definite and define a square cell B\\'s metric volume as \\(\\sqrt{\\det(B^{\\mathsf T}GB)}\\). For invertible B and A, show that applying A changes this volume by \\(|\\det A|\\) when the same G is used before and after.",
  "plain": "By multiplicativity and transpose invariance, det(BᵀGB)=(det B)²det G. G is positive definite, so its determinant is positive: Gram–Schmidt in the G metric gives an invertible Q with QᵀGQ=I, hence (det Q)²det G=1. The metric volume is |det B|√det G. Replacing B by AB multiplies by |det A|; the fixed metric unit cancels in the ratio. Using different input and output metrics would introduce their volume-unit ratio.",
  "solution": "<p>By multiplicativity and transpose invariance, det(BᵀGB)=(det B)²det G. G is positive definite, so its determinant is positive: Gram–Schmidt in the G metric gives an invertible Q with QᵀGQ=I, hence (det Q)²det G=1. The metric volume is |det B|√det G. Replacing B by AB multiplies by |det A|; the fixed metric unit cancels in the ratio. Using different input and output metrics would introduce their volume-unit ratio.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — read the signed cell.** For \\(A=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}\\), find determinant, ordinary area, orientation sign, and the factor by which a density changes under A.",
  "plain": "The determinant is 4−6=−2, ordinary area 2, orientation sign −1, and density multiplier 1/2. Volume multiplies by 2 while mass stays fixed.",
  "solution": "<p>The determinant is 4−6=−2, ordinary area 2, orientation sign −1, and density multiplier 1/2. Volume multiplies by 2 while mass stays fixed.</p>",
  "fields": [
    {
      "id": "d",
      "label": "determinant",
      "type": "num",
      "ans": -2
    },
    {
      "id": "a",
      "label": "area",
      "type": "num",
      "ans": 2
    },
    {
      "id": "s",
      "label": "orientation sign",
      "type": "num",
      "ans": -1
    },
    {
      "id": "p",
      "label": "density multiplier",
      "type": "num",
      "ans": 0.5
    }
  ],
  "hints": {
    "d": "Subtract the signed diagonal products.",
    "a": "Take the absolute determinant.",
    "s": "A negative determinant reverses the ordered frame.",
    "p": "Use the reciprocal of the ordinary area factor."
  }
},
K2: {
  "statement": "**K2 · Core · gate — define and force.** State the three defining properties and prove they force a unique function. Explain why separate linearity does not imply additivity in the whole matrix.",
  "plain": "State multilinearity in each column with others fixed, zero for repeated columns, and value 1 on the ordered standard basis. Expand in basis vectors: repeated selections vanish and each permutation contributes its parity times its entry product, forcing the formula. For existence check those properties on that formula. Whole-matrix additivity fails with A=B=I₂: det(2I₂)=4 but det I₂+det I₂=2.",
  "solution": "<p>State multilinearity in each column with others fixed, zero for repeated columns, and value 1 on the ordered standard basis. Expand in basis vectors: repeated selections vanish and each permutation contributes its parity times its entry product, forcing the formula. For existence check those properties on that formula. Whole-matrix additivity fails with A=B=I₂: det(2I₂)=4 but det I₂+det I₂=2.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — compute and audit a sign.** Compute \\(\\det\\begin{pmatrix}0&1&0\\\\0&0&2\\\\3&0&0\\end{pmatrix}\\) by elimination. State swap count, volume, and orientation.",
  "plain": "Swap row 1 with row 3, then row 2 with row 3. The diagonal is (3,1,2), with product 6. Two swaps keep the sign positive; ordinary volume is 6 and orientation sign is +1.",
  "solution": "<p>Swap row 1 with row 3, then row 2 with row 3. The diagonal is (3,1,2), with product 6. Two swaps keep the sign positive; ordinary volume is 6 and orientation sign is +1.</p>",
  "fields": [
    {
      "id": "d",
      "label": "determinant",
      "type": "num",
      "ans": 6
    },
    {
      "id": "s",
      "label": "swap count for this elimination",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "d": "The cycle needs two swaps, not one.",
    "s": "Move the row containing the first pivot into place, then the row containing the second pivot."
  }
},
K4: {
  "statement": "**K4 · Core · gate — composition with a singular case.** Prove determinant multiplicativity and use it to explain why composing any square map with a singular map has zero determinant.",
  "plain": "The alternating multilinear function F(B)=det(Ab₁,…,Abₙ) equals F(I)det B=det A det B, even when F(I)=0. A singular factor has zero determinant, so either multiplication order has zero product determinant. Geometrically rank cannot increase past the singular factor’s lost dimension under composition.",
  "solution": "<p>The alternating multilinear function F(B)=det(Ab₁,…,Abₙ) equals F(I)det B=det A det B, even when F(I)=0. A singular factor has zero determinant, so either multiplication order has zero product determinant. Geometrically rank cannot increase past the singular factor’s lost dimension under composition.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — reject a numerical conclusion.** A report says “determinant 1 means no distortion; determinant \\(10^{-18}\\) means unusable; log storage fixes near dependence.” Refute all three claims with examples or mechanisms.",
  "plain": "diag(10⁶,10⁻⁶) has determinant 1 and extreme directional imbalance. 10⁻⁶I₃ has determinant 10⁻¹⁸ but scales all directions uniformly, with no directional imbalance. Log storage prevents raw-product overflow/underflow, not rounding of nearly equal input columns into identical ones or perturbation sensitivity. Record dtype, input scale, and an appropriate sensitivity diagnostic rather than these determinant-only claims.",
  "solution": "<p>diag(10⁶,10⁻⁶) has determinant 1 and extreme directional imbalance. 10⁻⁶I₃ has determinant 10⁻¹⁸ but scales all directions uniformly, with no directional imbalance. Log storage prevents raw-product overflow/underflow, not rounding of nearly equal input columns into identical ones or perturbation sensitivity. Record dtype, input scale, and an appropriate sensitivity diagnostic rather than these determinant-only claims.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — transfer to a nonlinear cell.** For \\(f(s,t)=(s,e^s t)\\), use the supplied Jacobian from section 8. At \\(s=\\log2\\), find the volume and density factors. Derive the output density formula at arbitrary y and verify that a unique inverse exists.",
  "plain": "The volume factor is 2 and density factor 1/2. The unique inverse is (s,t)=(y₁,e⁻ʸ¹y₂). Hence pY(y₁,y₂)=pX(y₁,e⁻ʸ¹y₂)e⁻ʸ¹ on the transformed support. This divides by the forward determinant evaluated at the preimage; it does not multiply by that determinant. The given inverse is smooth and defined everywhere, so this map meets the bijective change-of-variables assumptions.",
  "solution": "<p>The volume factor is 2 and density factor 1/2. The unique inverse is (s,t)=(y₁,e⁻ʸ¹y₂). Hence pY(y₁,y₂)=pX(y₁,e⁻ʸ¹y₂)e⁻ʸ¹ on the transformed support. This divides by the forward determinant evaluated at the preimage; it does not multiply by that determinant. The given inverse is smooth and defined everywhere, so this map meets the bijective change-of-variables assumptions.</p>",
  "fields": [
    {
      "id": "v",
      "label": "local volume factor",
      "type": "num",
      "ans": 2
    },
    {
      "id": "p",
      "label": "local density factor",
      "type": "num",
      "ans": 0.5
    }
  ],
  "hints": {
    "v": "Evaluate eˢ at log 2.",
    "p": "Conserve probability mass as the cell expands."
  }
},
M7: {
  "statement": "**M7 · Stretch · mixed — Sign and log-volume without overflow.** For A=diag(−10²⁰⁰,10²⁰⁰), give the determinant sign and log absolute determinant divided by log(10), without forming the product.",
  "plain": "The sign is −1 and log|det A|/log 10 is 400. Multiplying first can overflow; adding logarithms avoids that representational failure.",
  "solution": "<p>The sign is −1 and log|det A|/log 10 is 400. Multiplying first can overflow; adding logarithms avoids that representational failure.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Numerical result(s), in requested order",
      "type": "vec",
      "ans": [
        -1,
        400
      ]
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
