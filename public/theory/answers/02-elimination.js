/* Answers and reference solutions for Linear Algebra Module 2. */
GU.answers("02-elimination", {
A1: {
  "statement": "**A1 · Foundation · paper — a unique solution.** Solve \\(x+y+2z=3\\), \\(2x+3y+3z=4\\), \\(-x+y+z=-2\\) by elimination, showing every row operation and the three pivots, then check your answer in all three equations.",
  "plain": "Augmented matrix rows (1,1,2|3), (2,3,3|4), (−1,1,1|−2). Column 1, pivot 1: R₂←R₂−2R₁ gives (0,1,−1|−2); R₃←R₃+R₁ gives (0,2,3|1). Column 2, pivot 1: R₃←R₃−2R₂ gives (0,0,5|5). The pivots are 1, 1, 5. Back substitution: 5z=5 so z=1; y−z=−2 so y=−1; x+y+2z=3 so x=3+1−2=2. The solution is (2,−1,1). Check: 2−1+2=3, 4−3+3=4, −2−1+1=−2. Rubric: each row operation written with its multiplier; the three pivots identified as nonzero; back substitution in order from the last equation; the check in all three original equations.",
  "solution": "<p>Augmented matrix rows (1,1,2|3), (2,3,3|4), (−1,1,1|−2). Column 1, pivot 1: R₂←R₂−2R₁ gives (0,1,−1|−2); R₃←R₃+R₁ gives (0,2,3|1). Column 2, pivot 1: R₃←R₃−2R₂ gives (0,0,5|5). The pivots are 1, 1, 5. Back substitution: 5z=5 so z=1; y−z=−2 so y=−1; x+y+2z=3 so x=3+1−2=2. The solution is (2,−1,1). Check: 2−1+2=3, 4−3+3=4, −2−1+1=−2. Rubric: each row operation written with its multiplier; the three pivots identified as nonzero; back substitution in order from the last equation; the check in all three original equations.</p>",
  "fields": [
    {
      "id": "x",
      "label": "solution (x, y, z)",
      "type": "vec",
      "ans": [
        2,
        -1,
        1
      ]
    }
  ],
  "hints": {
    "x": "After clearing column 1 the new rows are (0,1,−1|−2) and (0,2,3|1); clear the 2 below the second pivot next."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — an inconsistent system.** Show that \\(x-y+2z=1\\), \\(2x+y+z=4\\), \\(x+2y-z=2\\) has no solution. Give the rank of the coefficient matrix and of the augmented matrix, and find the value of the third right-hand side (currently 2) that would make the system consistent.",
  "plain": "R₂←R₂−2R₁ gives (0,3,−3|2); R₃←R₃−R₁ gives (0,3,−3|1); R₃←R₃−R₂ gives (0,0,0|−1), the equation 0=−1. So there is no solution. The coefficient matrix has two pivots, rank 2, while the augmented matrix has a pivot in its last column, rank 3 (Theorem 8). Tracking a general third right-hand side b₃ through the same operations gives b₃−b₁−(b₂−2b₁)=b₁−b₂+b₃ in the last row, so the system is consistent exactly when b₁−b₂+b₃=0, that is 1−4+b₃=0, b₃=3. Equivalently, y=(1,−1,1) spans the left null space: row 1 − row 2 + row 3 of the coefficient matrix is zero. Rubric: the row operations reaching 0=−1; both ranks with the reason; the consistency condition derived by carrying a symbolic right-hand side (or from the left null space); the value 3.",
  "solution": "<p>R₂←R₂−2R₁ gives (0,3,−3|2); R₃←R₃−R₁ gives (0,3,−3|1); R₃←R₃−R₂ gives (0,0,0|−1), the equation 0=−1. So there is no solution. The coefficient matrix has two pivots, rank 2, while the augmented matrix has a pivot in its last column, rank 3 (Theorem 8). Tracking a general third right-hand side b₃ through the same operations gives b₃−b₁−(b₂−2b₁)=b₁−b₂+b₃ in the last row, so the system is consistent exactly when b₁−b₂+b₃=0, that is 1−4+b₃=0, b₃=3. Equivalently, y=(1,−1,1) spans the left null space: row 1 − row 2 + row 3 of the coefficient matrix is zero. Rubric: the row operations reaching 0=−1; both ranks with the reason; the consistency condition derived by carrying a symbolic right-hand side (or from the left null space); the value 3.</p>",
  "fields": [
    {
      "id": "ranks",
      "label": "rank of A, rank of [A | b]",
      "type": "vec",
      "ans": [
        2,
        3
      ]
    },
    {
      "id": "b3",
      "label": "third right-hand side that makes it consistent",
      "type": "num",
      "ans": 3
    }
  ],
  "hints": {
    "ranks": "Count pivots in the coefficient block, then count again including the right-hand column.",
    "b3": "Carry b₃ through the eliminations: the last entry becomes b₁−b₂+b₃, which must vanish."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — infinitely many solutions.** Find the complete solution of \\(x_1+3x_2+x_3=3\\), \\(2x_1+6x_2+4x_3=10\\), \\(-x_1-3x_2+x_3=1\\) in the form \\(x_p+N(A)\\), with \\(x_p\\) the particular solution whose free variable is 0.",
  "plain": "R₂←R₂−2R₁ gives (0,0,2|4); R₃←R₃+R₁ gives (0,0,2|4); R₃←R₃−R₂ gives a zero row. Scaling R₂ by ½ and R₁←R₁−R₂ gives the RREF rows (1,3,0|1) and (0,0,1|2). Pivot columns 1 and 3, free column 2. The reduced equations are x₁+3x₂=1 and x₃=2. With x₂=0, x_p=(1,0,2). For the null space, set x₂=1: x₁=−3, x₃=0, so s=(−3,1,0). The complete solution is x=(1,0,2)+t(−3,1,0), a line in ℝ³ that misses the origin. Check: A x_p=(1+2, 2+8, −1+2)=(3,10,1) and As=−3(1,2,−1)+(3,6,−3)=0. Rubric: correct RREF with pivot and free columns named; x_p with the free variable 0; the null vector from setting the free variable to 1; both checks; the answer written as x_p+N(A).",
  "solution": "<p>R₂←R₂−2R₁ gives (0,0,2|4); R₃←R₃+R₁ gives (0,0,2|4); R₃←R₃−R₂ gives a zero row. Scaling R₂ by ½ and R₁←R₁−R₂ gives the RREF rows (1,3,0|1) and (0,0,1|2). Pivot columns 1 and 3, free column 2. The reduced equations are x₁+3x₂=1 and x₃=2. With x₂=0, x_p=(1,0,2). For the null space, set x₂=1: x₁=−3, x₃=0, so s=(−3,1,0). The complete solution is x=(1,0,2)+t(−3,1,0), a line in ℝ³ that misses the origin. Check: A x_p=(1+2, 2+8, −1+2)=(3,10,1) and As=−3(1,2,−1)+(3,6,−3)=0. Rubric: correct RREF with pivot and free columns named; x_p with the free variable 0; the null vector from setting the free variable to 1; both checks; the answer written as x_p+N(A).</p>",
  "fields": [
    {
      "id": "xp",
      "label": "particular solution",
      "type": "vec",
      "ans": [
        1,
        0,
        2
      ]
    },
    {
      "id": "s",
      "label": "null-space basis vector (free variable = 1)",
      "type": "vec",
      "ans": [
        -3,
        1,
        0
      ]
    }
  ],
  "hints": {
    "xp": "Column 2 is three times column 1, so x₂ is free; set it to 0 and read x₁ and x₃ from the reduced rows.",
    "s": "Solve the homogeneous reduced equations with x₂=1."
  }
},
A4: {
  "statement": "**A4 · Foundation · paper — a \\(3\\times4\\) system to RREF.** Reduce the augmented matrix of \\(x_1-x_2+2x_3=3\\), \\(2x_1-2x_2+5x_3+x_4=8\\), \\(3x_1-3x_2+7x_3+x_4=11\\) to RREF. Give the rank, the pivot columns, the particular solution with free variables 0, and the free-variable basis of the null space.",
  "plain": "R₂←R₂−2R₁ gives (0,0,1,1|2); R₃←R₃−3R₁ gives (0,0,1,1|2); R₃←R₃−R₂ gives a zero row; R₁←R₁−2R₂ gives (1,−1,0,−2|−1). The RREF has rows (1,−1,0,−2|−1), (0,0,1,1|2), (0,0,0,0|0). The rank is 2, the pivot columns are 1 and 3, and the free columns are 2 and 4. The particular solution with x₂=x₄=0 is x_p=(−1,0,2,0). Null-space basis: x₂=1, x₄=0 gives (1,1,0,0); x₂=0, x₄=1 gives (2,0,−1,1). Complete solution: (−1,0,2,0)+s(1,1,0,0)+t(2,0,−1,1). Rubric: every row operation shown; the RREF correct including the cleared entry above the second pivot; rank, pivot columns and free columns named; x_p and both null vectors read from the reduced rows and checked.",
  "solution": "<p>R₂←R₂−2R₁ gives (0,0,1,1|2); R₃←R₃−3R₁ gives (0,0,1,1|2); R₃←R₃−R₂ gives a zero row; R₁←R₁−2R₂ gives (1,−1,0,−2|−1). The RREF has rows (1,−1,0,−2|−1), (0,0,1,1|2), (0,0,0,0|0). The rank is 2, the pivot columns are 1 and 3, and the free columns are 2 and 4. The particular solution with x₂=x₄=0 is x_p=(−1,0,2,0). Null-space basis: x₂=1, x₄=0 gives (1,1,0,0); x₂=0, x₄=1 gives (2,0,−1,1). Complete solution: (−1,0,2,0)+s(1,1,0,0)+t(2,0,−1,1). Rubric: every row operation shown; the RREF correct including the cleared entry above the second pivot; rank, pivot columns and free columns named; x_p and both null vectors read from the reduced rows and checked.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "rank",
      "type": "num",
      "ans": 2
    },
    {
      "id": "xp",
      "label": "particular solution",
      "type": "vec",
      "ans": [
        -1,
        0,
        2,
        0
      ]
    },
    {
      "id": "null",
      "label": "the two null-space basis vectors, as one list of 8 entries (x₂=1 vector first)",
      "type": "vec",
      "ans": [
        1,
        1,
        0,
        0,
        2,
        0,
        -1,
        1
      ]
    }
  ],
  "hints": {
    "rank": "Rows 2 and 3 become equal after clearing column 1.",
    "xp": "Set x₂=x₄=0 and read x₁ and x₃ from the RREF rows (1,−1,0,−2|−1) and (0,0,1,1|2).",
    "null": "Set one free variable to 1 and the other to 0; remember the pivot variables take the negatives of the free-column entries."
  }
},
A5: {
  "statement": "**A5 · Foundation · paper — four equations, three unknowns.** Solve \\(x+y=3\\), \\(y+z=5\\), \\(x+z=4\\), \\(x+y+z=6\\). Then find the condition on a general right-hand side \\((b_1,b_2,b_3,b_4)\\) for this system to be consistent, and say what the fourth equation must be changed to for it to fail.",
  "plain": "Eliminate (1,1,0|3), (0,1,1|5), (1,0,1|4), (1,1,1|6): R₃←R₃−R₁ gives (0,−1,1|1); R₄←R₄−R₁ gives (0,0,1|3); R₃←R₃+R₂ gives (0,0,2|6); R₄←R₄−½R₃ gives (0,0,0|0). So z=3, y=2, x=1: the unique solution is (1,2,3), with rank 3 and three pivots in three columns. For general b, the same operations leave b₄−b₁−½(b₃−b₁+b₂)=½(2b₄−b₁−b₂−b₃) in the last row, so the system is consistent exactly when b₁+b₂+b₃=2b₄; the left null space is spanned by (1,1,1,−2). Here 3+5+4=12=2·6. Changing the fourth right-hand side to anything other than 6 (keeping the others) makes it inconsistent. Rubric: the unique solution with its check; a consistency condition derived from the zero row or from a left-null vector; the correct statement of which change breaks consistency.",
  "solution": "<p>Eliminate (1,1,0|3), (0,1,1|5), (1,0,1|4), (1,1,1|6): R₃←R₃−R₁ gives (0,−1,1|1); R₄←R₄−R₁ gives (0,0,1|3); R₃←R₃+R₂ gives (0,0,2|6); R₄←R₄−½R₃ gives (0,0,0|0). So z=3, y=2, x=1: the unique solution is (1,2,3), with rank 3 and three pivots in three columns. For general b, the same operations leave b₄−b₁−½(b₃−b₁+b₂)=½(2b₄−b₁−b₂−b₃) in the last row, so the system is consistent exactly when b₁+b₂+b₃=2b₄; the left null space is spanned by (1,1,1,−2). Here 3+5+4=12=2·6. Changing the fourth right-hand side to anything other than 6 (keeping the others) makes it inconsistent. Rubric: the unique solution with its check; a consistency condition derived from the zero row or from a left-null vector; the correct statement of which change breaks consistency.</p>",
  "fields": [
    {
      "id": "x",
      "label": "solution (x, y, z)",
      "type": "vec",
      "ans": [
        1,
        2,
        3
      ]
    }
  ],
  "hints": {
    "x": "Adding the first three equations gives 2(x+y+z)=12, consistent with the fourth; then subtract pairs."
  }
},
A6: {
  "statement": "**A6 · Foundation · paper — two parameters decide.** For the system \\(x+2y+z=1\\), \\(2x+5y+3z=3\\), \\(x+3y+kz=m\\), find every \\(k\\) giving a unique solution, and for the remaining \\(k\\) find the \\(m\\) giving infinitely many solutions. Describe the row picture in each case.",
  "plain": "R₂←R₂−2R₁ gives (0,1,1|1); R₃←R₃−R₁ gives (0,1,k−1|m−1); R₃←R₃−R₂ gives (0,0,k−2|m−2). If k≠2 there are three pivots: a unique solution, and the three planes meet in one point. If k=2 the last row is (0,0,0|m−2): for m=2 it is 0=0 and there is one free variable, so infinitely many solutions (the three planes share a line); for m≠2 it reads 0=m−2≠0, so there is no solution (the third plane is parallel to the line where the first two meet and misses it). Rubric: the reduction to (0,0,k−2|m−2) with each operation shown; the three cases correctly separated; a correct row-picture description for each case.",
  "solution": "<p>R₂←R₂−2R₁ gives (0,1,1|1); R₃←R₃−R₁ gives (0,1,k−1|m−1); R₃←R₃−R₂ gives (0,0,k−2|m−2). If k≠2 there are three pivots: a unique solution, and the three planes meet in one point. If k=2 the last row is (0,0,0|m−2): for m=2 it is 0=0 and there is one free variable, so infinitely many solutions (the three planes share a line); for m≠2 it reads 0=m−2≠0, so there is no solution (the third plane is parallel to the line where the first two meet and misses it). Rubric: the reduction to (0,0,k−2|m−2) with each operation shown; the three cases correctly separated; a correct row-picture description for each case.</p>",
  "fields": [
    {
      "id": "k",
      "label": "the one value of k that does not give a unique solution",
      "type": "num",
      "ans": 2
    },
    {
      "id": "m",
      "label": "the value of m giving infinitely many solutions at that k",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "k": "Carry k through the elimination; the third pivot is k−2.",
    "m": "At the critical k the last row reads 0 = m−2."
  }
},
A7: {
  "statement": "**A7 · Core · paper — LU by hand.** For \\(A=\\begin{pmatrix}1&2&1\\\\3&8&1\\\\0&4&1\\end{pmatrix}\\), record every elimination step as an elementary matrix, assemble \\(L\\) from the multipliers and \\(U\\) from the result, and check \\(LU=A\\). Use the two triangular factors to compute \\(x\\) with \\(Ax=(1,-3,-2)\\), showing the intermediate vector \\(c\\) with \\(Lc=b\\).",
  "plain": "Column 1: ℓ₂₁=3/1=3, ℓ₃₁=0/1=0. E₂₁ is I with −3 in position (2,1); row 2 becomes (0,2,−2). Column 2: ℓ₃₂=4/2=2; E₃₂ is I with −2 in position (3,2); row 3 becomes (0,4,1)−2(0,2,−2)=(0,0,5). So U=[[1,2,1],[0,2,−2],[0,0,5]] and L=[[1,0,0],[3,1,0],[0,2,1]], the multipliers in place. Forward substitution Lc=(1,−3,−2): c₁=1, c₂=−3−3=−6, c₃=−2−2(−6)=10. Back substitution Ux=c: 5x₃=10 gives x₃=2; 2x₂−2·2=−6 gives x₂=−1; x₁+2(−1)+2=1 gives x₁=1. So x=(1,−1,2). Check: A x=(1−2+2, 3−8+2, −4+2)=(1,−3,−2). Rubric: each elementary matrix written; L with multipliers in the right positions and U upper triangular; forward then back substitution shown; the final check against A.",
  "solution": "<p>Column 1: ℓ₂₁=3/1=3, ℓ₃₁=0/1=0. E₂₁ is I with −3 in position (2,1); row 2 becomes (0,2,−2). Column 2: ℓ₃₂=4/2=2; E₃₂ is I with −2 in position (3,2); row 3 becomes (0,4,1)−2(0,2,−2)=(0,0,5). So U=[[1,2,1],[0,2,−2],[0,0,5]] and L=[[1,0,0],[3,1,0],[0,2,1]], the multipliers in place. Forward substitution Lc=(1,−3,−2): c₁=1, c₂=−3−3=−6, c₃=−2−2(−6)=10. Back substitution Ux=c: 5x₃=10 gives x₃=2; 2x₂−2·2=−6 gives x₂=−1; x₁+2(−1)+2=1 gives x₁=1. So x=(1,−1,2). Check: A x=(1−2+2, 3−8+2, −4+2)=(1,−3,−2). Rubric: each elementary matrix written; L with multipliers in the right positions and U upper triangular; forward then back substitution shown; the final check against A.</p>",
  "fields": [
    {
      "id": "c",
      "label": "forward-substitution result c",
      "type": "vec",
      "ans": [
        1,
        -6,
        10
      ]
    },
    {
      "id": "x",
      "label": "solution x",
      "type": "vec",
      "ans": [
        1,
        -1,
        2
      ]
    }
  ],
  "hints": {
    "c": "L has 3 in row 2 and 2 in row 3, column 2; solve top row first.",
    "x": "U has diagonal 1, 2, 5; start from the last row."
  }
},
A8: {
  "statement": "**A8 · Core · paper — Gauss–Jordan inverse.** Invert \\(\\begin{pmatrix}1&2&0\\\\0&1&1\\\\1&2&1\\end{pmatrix}\\) by reducing \\([A\\mid I]\\), recording each row operation, and check one column of \\(AA^{-1}\\).",
  "plain": "Reduce [A|I] with rows (1,2,0|1,0,0), (0,1,1|0,1,0), (1,2,1|0,0,1). R₃←R₃−R₁ gives (0,0,1|−1,0,1). R₂←R₂−R₃ gives (0,1,0|1,1,−1). R₁←R₁−2R₂ gives (1,0,0|−1,−2,2). So A⁻¹=[[−1,−2,2],[1,1,−1],[−1,0,1]]. Check the first column: A(−1,1,−1)=(−1+2, 1−1, −1+2−1)=(1,0,0). Rubric: every row operation recorded on the whole augmented matrix; the left block reaching I; A⁻¹ read from the right block; one column of AA⁻¹ checked.",
  "solution": "<p>Reduce [A|I] with rows (1,2,0|1,0,0), (0,1,1|0,1,0), (1,2,1|0,0,1). R₃←R₃−R₁ gives (0,0,1|−1,0,1). R₂←R₂−R₃ gives (0,1,0|1,1,−1). R₁←R₁−2R₂ gives (1,0,0|−1,−2,2). So A⁻¹=[[−1,−2,2],[1,1,−1],[−1,0,1]]. Check the first column: A(−1,1,−1)=(−1+2, 1−1, −1+2−1)=(1,0,0). Rubric: every row operation recorded on the whole augmented matrix; the left block reaching I; A⁻¹ read from the right block; one column of AA⁻¹ checked.</p>",
  "fields": [
    {
      "id": "inv",
      "label": "A⁻¹ row by row, as one list of 9 entries",
      "type": "vec",
      "ans": [
        -1,
        -2,
        2,
        1,
        1,
        -1,
        -1,
        0,
        1
      ]
    }
  ],
  "hints": {
    "inv": "Clear column 1 using R₃−R₁ first; the left block is then upper triangular with pivots 1, 1, 1."
  }
},
A9: {
  "statement": "**A9 · Core · paper — pivoting by hand.** Compute \\(PA=LU\\) with partial pivoting for \\(A=\\begin{pmatrix}1&2&2\\\\4&4&2\\\\2&6&4\\end{pmatrix}\\). Give the order in which the original rows are used, the multipliers, and \\(U\\), and confirm every multiplier has absolute value at most 1.",
  "plain": "Column 1: the candidates are 1, 4, 2; the largest is 4 in row 2, so swap R₁↔R₂: rows (4,4,2), (1,2,2), (2,6,4). Multipliers ¼ and ½: row 2 becomes (0,1,3/2) and row 3 becomes (0,4,3). Column 2: the candidates are 1 and 4; swap rows 2 and 3, carrying their multipliers. Multiplier 1/4: row 3 becomes (0,0,3/2−3/4)=(0,0,3/4). The original rows are used in the order 2, 3, 1, so P has rows e₂, e₃, e₁, L=[[1,0,0],[1/2,1,0],[1/4,1/4,1]] and U=[[4,4,2],[0,4,3],[0,0,3/4]]. Every multiplier is ½ or ¼, at most 1 in absolute value. Check row 3 of LU: ¼(4,4,2)+¼(0,4,3)+(0,0,¾)=(1,2,2), which is row 1 of A. Rubric: the pivot choice justified at each column; the multipliers swapped along with their rows; P, L and U given; PA=LU checked on at least one row; the multiplier bound confirmed.",
  "solution": "<p>Column 1: the candidates are 1, 4, 2; the largest is 4 in row 2, so swap R₁↔R₂: rows (4,4,2), (1,2,2), (2,6,4). Multipliers ¼ and ½: row 2 becomes (0,1,3/2) and row 3 becomes (0,4,3). Column 2: the candidates are 1 and 4; swap rows 2 and 3, carrying their multipliers. Multiplier 1/4: row 3 becomes (0,0,3/2−3/4)=(0,0,3/4). The original rows are used in the order 2, 3, 1, so P has rows e₂, e₃, e₁, L=[[1,0,0],[1/2,1,0],[1/4,1/4,1]] and U=[[4,4,2],[0,4,3],[0,0,3/4]]. Every multiplier is ½ or ¼, at most 1 in absolute value. Check row 3 of LU: ¼(4,4,2)+¼(0,4,3)+(0,0,¾)=(1,2,2), which is row 1 of A. Rubric: the pivot choice justified at each column; the multipliers swapped along with their rows; P, L and U given; PA=LU checked on at least one row; the multiplier bound confirmed.</p>",
  "fields": [
    {
      "id": "order",
      "label": "order in which the original rows are used",
      "type": "vec",
      "ans": [
        2,
        3,
        1
      ]
    },
    {
      "id": "u33",
      "label": "last pivot U₃₃",
      "type": "num",
      "ans": 0.75
    }
  ],
  "hints": {
    "order": "Pick the largest absolute entry in column 1, then in column 2 among the remaining rows.",
    "u33": "After both swaps the last elimination subtracts ¼ of (0,4,3) from (0,1,3/2). An answer such as 3/4 is accepted."
  }
},
A10: {
  "statement": "**A10 · Core · paper — four subspaces of a tall matrix.** For \\(B=\\begin{pmatrix}1&2&0\\\\2&4&1\\\\3&6&1\\\\1&2&-1\\end{pmatrix}\\), give the rank, a basis for each of the four fundamental subspaces, and the consistency conditions on \\(b\\in\\mathbb R^4\\) for \\(Bx=b\\).",
  "plain": "Reduce B: R₂←R₂−2R₁ gives (0,0,1); R₃←R₃−3R₁ gives (0,0,1); R₄←R₄−R₁ gives (0,0,−1); then R₃←R₃−R₂ and R₄←R₄+R₂ give zero rows. RREF rows (1,2,0), (0,0,1). Rank 2; pivot columns 1 and 3, free column 2. C(B): columns 1 and 3 of B, (1,2,3,1) and (0,1,1,−1). Row space: (1,2,0) and (0,0,1). N(B): x₂ free gives (−2,1,0), dimension 3−2=1. N(Bᵀ): dimension 4−2=2; solving Bᵀy=0 gives the basis (−1,−1,1,0) and (−3,1,0,1) (row 3 = row 1 + row 2, and row 4 = 3·row 1 − row 2). So Bx=b is solvable exactly when −b₁−b₂+b₃=0 and −3b₁+b₂+b₄=0. Counts: 2+1=3 in ℝ³ and 2+2=4 in ℝ⁴. Rubric: the reduction; all four bases, with the column-space basis taken from B, not from the RREF; both dimension counts; two independent consistency conditions matching the left null space.",
  "solution": "<p>Reduce B: R₂←R₂−2R₁ gives (0,0,1); R₃←R₃−3R₁ gives (0,0,1); R₄←R₄−R₁ gives (0,0,−1); then R₃←R₃−R₂ and R₄←R₄+R₂ give zero rows. RREF rows (1,2,0), (0,0,1). Rank 2; pivot columns 1 and 3, free column 2. C(B): columns 1 and 3 of B, (1,2,3,1) and (0,1,1,−1). Row space: (1,2,0) and (0,0,1). N(B): x₂ free gives (−2,1,0), dimension 3−2=1. N(Bᵀ): dimension 4−2=2; solving Bᵀy=0 gives the basis (−1,−1,1,0) and (−3,1,0,1) (row 3 = row 1 + row 2, and row 4 = 3·row 1 − row 2). So Bx=b is solvable exactly when −b₁−b₂+b₃=0 and −3b₁+b₂+b₄=0. Counts: 2+1=3 in ℝ³ and 2+2=4 in ℝ⁴. Rubric: the reduction; all four bases, with the column-space basis taken from B, not from the RREF; both dimension counts; two independent consistency conditions matching the left null space.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "rank",
      "type": "num",
      "ans": 2
    },
    {
      "id": "null",
      "label": "null-space basis vector",
      "type": "vec",
      "ans": [
        -2,
        1,
        0
      ]
    }
  ],
  "hints": {
    "rank": "Column 2 is twice column 1; after clearing column 1, rows 2–4 are all multiples of (0,0,1).",
    "null": "Set the free variable x₂=1 and read x₁ and x₃ from the RREF."
  }
},
A11: {
  "statement": "**A11 · Core · paper — the reachable plane.** For \\(A=\\begin{pmatrix}1&2&3\\\\4&5&6\\\\7&8&9\\end{pmatrix}\\), find a basis of the left null space and use it to write the single equation that \\(b\\) must satisfy for \\(Ax=b\\) to be solvable. Decide whether \\(b=(1,2,3)\\) and \\(b=(1,1,2)\\) are reachable.",
  "plain": "Solve Aᵀy=0, that is y₁(1,2,3)+y₂(4,5,6)+y₃(7,8,9)=0. Reducing Aᵀ=[[1,4,7],[2,5,8],[3,6,9]] gives rows (1,4,7), (0,−3,−6) and a zero row, so y₂=−2y₃ and y₁=−4y₂−7y₃=y₃. The left null space is spanned by y=(1,−2,1), which says row 1 − 2·row 2 + row 3 = 0. So Ax=b is solvable exactly when b₁−2b₂+b₃=0: the reachable b form a plane. For b=(1,2,3): 1−4+3=0, so it is reachable; one solution is x=(−1/3,2/3,0), since A x=(−1/3+4/3, −4/3+10/3, −7/3+16/3)=(1,2,3). For b=(1,1,2): 1−2+2=1≠0, so it is not reachable. Rubric: the left-null vector found by solving Aᵀy=0 and checked; the plane equation stated; both targets tested, with an explicit solution or a clear argument for the reachable one.",
  "solution": "<p>Solve Aᵀy=0, that is y₁(1,2,3)+y₂(4,5,6)+y₃(7,8,9)=0. Reducing Aᵀ=[[1,4,7],[2,5,8],[3,6,9]] gives rows (1,4,7), (0,−3,−6) and a zero row, so y₂=−2y₃ and y₁=−4y₂−7y₃=y₃. The left null space is spanned by y=(1,−2,1), which says row 1 − 2·row 2 + row 3 = 0. So Ax=b is solvable exactly when b₁−2b₂+b₃=0: the reachable b form a plane. For b=(1,2,3): 1−4+3=0, so it is reachable; one solution is x=(−1/3,2/3,0), since A x=(−1/3+4/3, −4/3+10/3, −7/3+16/3)=(1,2,3). For b=(1,1,2): 1−2+2=1≠0, so it is not reachable. Rubric: the left-null vector found by solving Aᵀy=0 and checked; the plane equation stated; both targets tested, with an explicit solution or a clear argument for the reachable one.</p>",
  "fields": [
    {
      "id": "y",
      "label": "left-null basis vector (first entry 1)",
      "type": "vec",
      "ans": [
        1,
        -2,
        1
      ]
    }
  ],
  "hints": {
    "y": "Look for a combination of the rows that vanishes: the rows are equally spaced, so row 1 + row 3 = 2·row 2."
  }
},
A12: {
  "statement": "**A12 · Core · paper — build to order.** Give a \\(3\\times4\\) matrix whose null space is exactly \\(\\operatorname{span}\\{(1,-1,0,0),(0,0,1,-1)\\}\\), or prove none exists. What must its rank be?",
  "plain": "The null space must have dimension 2, so by rank–nullity the rank is 4−2=2. The rows of such a matrix must be perpendicular to both given vectors (every row r satisfies r·x=0 for x in the null space), so each row has the form (a,a,c,c). Take rows (1,1,0,0), (0,0,1,1) and (1,1,1,1). Their span has dimension 2, so the rank is 2 and the null space has dimension 2; both given vectors satisfy the equations x₁+x₂=0 and x₃+x₄=0, and they are independent, so they span it. Rubric: rank 2 derived from rank–nullity; a concrete matrix; verification that both vectors are in the null space and that its dimension is exactly 2.",
  "solution": "<p>The null space must have dimension 2, so by rank–nullity the rank is 4−2=2. The rows of such a matrix must be perpendicular to both given vectors (every row r satisfies r·x=0 for x in the null space), so each row has the form (a,a,c,c). Take rows (1,1,0,0), (0,0,1,1) and (1,1,1,1). Their span has dimension 2, so the rank is 2 and the null space has dimension 2; both given vectors satisfy the equations x₁+x₂=0 and x₃+x₄=0, and they are independent, so they span it. Rubric: rank 2 derived from rank–nullity; a concrete matrix; verification that both vectors are in the null space and that its dimension is exactly 2.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "the rank such a matrix must have",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "rank": "Apply rank–nullity with n=4 columns and a null space of dimension 2."
  }
},
A13: {
  "statement": "**A13 · Core · paper — find the flaw.** A student solves \\(x+y=3\\), \\(x-y=1\\) by replacing both rows at once: \\(R_1\\leftarrow R_1-R_2\\) and \\(R_2\\leftarrow R_2-R_1\\), each computed from the original rows. This gives \\(2y=2\\) and \\(-2y=-2\\), and the student concludes that \\(y=1\\) with \\(x\\) free. Identify exactly what is invalid, write the combined step as a matrix and say why Theorem 4 does not cover it, and give the correct solution.",
  "plain": "Each new row is a valid combination of the old rows, so every old solution still satisfies the new equations; the failure is the reverse direction. The combined step replaces the system by M times it, with M=[[1,−1],[−1,1]], which is singular (its rows are negatives of each other), so it cannot be undone: the new equations 2y=2 and −2y=−2 are the same equation, and the information that fixed x has been destroyed. Theorem 4 covers one row operation at a time, where row j is unchanged while row i changes; here R₂ is updated from the original R₁, not from the new one, so the step is not a sequence of legal row operations. The correct elimination R₂←R₂−R₁ gives −2y=−2, so y=1 and x=2. Rubric: identification that the step is not invertible (matrix given and shown singular); which inclusion of Theorem 4 fails and why; the correct solution (2,1).",
  "solution": "<p>Each new row is a valid combination of the old rows, so every old solution still satisfies the new equations; the failure is the reverse direction. The combined step replaces the system by M times it, with M=[[1,−1],[−1,1]], which is singular (its rows are negatives of each other), so it cannot be undone: the new equations 2y=2 and −2y=−2 are the same equation, and the information that fixed x has been destroyed. Theorem 4 covers one row operation at a time, where row j is unchanged while row i changes; here R₂ is updated from the original R₁, not from the new one, so the step is not a sequence of legal row operations. The correct elimination R₂←R₂−R₁ gives −2y=−2, so y=1 and x=2. Rubric: identification that the step is not invertible (matrix given and shown singular); which inclusion of Theorem 4 fails and why; the correct solution (2,1).</p>",
  "fields": [
    {
      "id": "x",
      "label": "correct solution (x, y)",
      "type": "vec",
      "ans": [
        2,
        1
      ]
    }
  ],
  "hints": {
    "x": "Do one legal operation, R₂←R₂−R₁, and back-substitute."
  }
},
A14: {
  "statement": "**A14 · Core · paper — the Gram matrix keeps the null space.** Prove that \\(N(A^{\\mathsf T}A)=N(A)\\) for every real matrix \\(A\\), and deduce that \\(\\operatorname{rank}(A^{\\mathsf T}A)=\\operatorname{rank}A\\). Give a matrix with complex entries showing where the argument needs real numbers.",
  "plain": "If Ax=0 then AᵀAx=0, so N(A)⊆N(AᵀA). Conversely, if AᵀAx=0, then 0=xᵀAᵀAx=(Ax)ᵀ(Ax)=‖Ax‖², the sum of the squares of the entries of Ax. A sum of squares of real numbers is zero only when every term is zero, so Ax=0. Hence the null spaces are equal. Both matrices have n columns, so rank–nullity gives rank(AᵀA)=n−dim N(AᵀA)=n−dim N(A)=rank A. The step \"sum of squares zero ⇒ each term zero\" fails over the complex numbers: for A=(1, i)ᵀ, a 2×1 matrix with N(A)={0}, AᵀA=1+i²=0, so N(AᵀA) is everything. (With the conjugate transpose the result survives.) Rubric: both inclusions; the norm-squared step with the use of real numbers stated; the rank deduction via rank–nullity; a correct complex counterexample.",
  "solution": "<p>If Ax=0 then AᵀAx=0, so N(A)⊆N(AᵀA). Conversely, if AᵀAx=0, then 0=xᵀAᵀAx=(Ax)ᵀ(Ax)=‖Ax‖², the sum of the squares of the entries of Ax. A sum of squares of real numbers is zero only when every term is zero, so Ax=0. Hence the null spaces are equal. Both matrices have n columns, so rank–nullity gives rank(AᵀA)=n−dim N(AᵀA)=n−dim N(A)=rank A. The step \"sum of squares zero ⇒ each term zero\" fails over the complex numbers: for A=(1, i)ᵀ, a 2×1 matrix with N(A)={0}, AᵀA=1+i²=0, so N(AᵀA) is everything. (With the conjugate transpose the result survives.) Rubric: both inclusions; the norm-squared step with the use of real numbers stated; the rank deduction via rank–nullity; a correct complex counterexample.</p>"
},
A15: {
  "statement": "**A15 · Stretch · paper — what the reduced form determines.** Prove that two \\(m\\times n\\) matrices have the same RREF exactly when they have the same null space, and exactly when they have the same row space. Then give two \\(2\\times2\\) matrices with the same RREF but different column spaces.",
  "plain": "Same RREF ⇒ same null space: row operations preserve the solutions of Ax=0 (Lemma 5), so N(A)=N(R)=N(A′). Same RREF ⇒ same row space: row operations preserve the row space (Theorem 7(2)), so both row spaces equal that of R. Same null space ⇒ same RREF: by Lemma 5 the RREF is fixed by the linear relations among the columns, and those relations are exactly the vectors c with Ac=0; equal null spaces give equal relations, and the uniqueness argument of Theorem 6 then gives equal RREFs. Same row space ⇒ same null space (and hence, by the previous step, same RREF): x∈N(A) exactly when every row of A has dot product 0 with x, which holds exactly when every vector of the row space has dot product 0 with x; so equal row spaces give equal null spaces. Example: [[1,0],[0,0]] and [[0,0],[1,0]] both have RREF [[1,0],[0,0]], but their column spaces are the x-axis and the y-axis. Rubric: all four implications argued, citing Lemma 5 and Theorems 6–7; the row-space step reduced to the null-space step (or argued directly); the example with both RREFs computed.",
  "solution": "<p>Same RREF ⇒ same null space: row operations preserve the solutions of Ax=0 (Lemma 5), so N(A)=N(R)=N(A′). Same RREF ⇒ same row space: row operations preserve the row space (Theorem 7(2)), so both row spaces equal that of R. Same null space ⇒ same RREF: by Lemma 5 the RREF is fixed by the linear relations among the columns, and those relations are exactly the vectors c with Ac=0; equal null spaces give equal relations, and the uniqueness argument of Theorem 6 then gives equal RREFs. Same row space ⇒ same null space (and hence, by the previous step, same RREF): x∈N(A) exactly when every row of A has dot product 0 with x, which holds exactly when every vector of the row space has dot product 0 with x; so equal row spaces give equal null spaces. Example: [[1,0],[0,0]] and [[0,0],[1,0]] both have RREF [[1,0],[0,0]], but their column spaces are the x-axis and the y-axis. Rubric: all four implications argued, citing Lemma 5 and Theorems 6–7; the row-space step reduced to the null-space step (or argued directly); the example with both RREFs computed.</p>"
},
A16: {
  "statement": "**A16 · Stretch · paper — one-sided inverses.** Prove that if \\(A\\) and \\(B\\) are \\(n\\times n\\) and \\(AB\\) is invertible, then \\(A\\) and \\(B\\) are both invertible. Then show by example that a \\(1\\times2\\) matrix \\(A\\) and a \\(2\\times1\\) matrix \\(B\\) can satisfy \\(AB=I_1\\) while \\(BA\\ne I_2\\), and say which step of your proof uses squareness.",
  "plain": "Suppose AB is invertible. If Bx=0 then ABx=0, so x=(AB)⁻¹0=0: N(B)={0}. B is square, so by the invertible matrix theorem (2⇒1) B is invertible. Then A=(AB)B⁻¹ is a product of invertible matrices, so A is invertible. For the rectangular example take A=(1 0), a 1×2 matrix, and B=(1,0)ᵀ, a 2×1 matrix: AB=(1)=I₁, but BA=[[1,0],[0,0]]≠I₂. The proof uses squareness in the step N(B)={0} ⇒ B invertible: for a 2×1 matrix, a trivial null space only gives full column rank, not a two-sided inverse. Rubric: the null-space argument for B; the invertible matrix theorem applied with squareness named; the deduction for A; a correct rectangular example with both products computed.",
  "solution": "<p>Suppose AB is invertible. If Bx=0 then ABx=0, so x=(AB)⁻¹0=0: N(B)={0}. B is square, so by the invertible matrix theorem (2⇒1) B is invertible. Then A=(AB)B⁻¹ is a product of invertible matrices, so A is invertible. For the rectangular example take A=(1 0), a 1×2 matrix, and B=(1,0)ᵀ, a 2×1 matrix: AB=(1)=I₁, but BA=[[1,0],[0,0]]≠I₂. The proof uses squareness in the step N(B)={0} ⇒ B invertible: for a 2×1 matrix, a trivial null space only gives full column rank, not a two-sided inverse. Rubric: the null-space argument for B; the invertible matrix theorem applied with squareness named; the deduction for A; a correct rectangular example with both products computed.</p>"
},
A17: {
  "statement": "**A17 · Stretch · paper — counting the cost.** Show that back substitution for an \\(n\\times n\\) upper triangular system with nonzero diagonal costs exactly \\(n^2\\) flops. Then, taking \\(\\tfrac23n^3\\) flops for an LU factorization, \\(2n^3\\) flops to form \\(A^{-1}\\), \\(2n^2\\) per pair of triangular solves and \\(2n^2\\) per matrix–vector product, compute for \\(n=2000\\) and 50 right-hand sides the ratio of the cost of the inverse route to the LU route.",
  "plain": "Back substitution on an upper triangular system with nonzero diagonal: the unknown in row i (counting from the bottom, i=1,…,n) needs i−1 multiplications and i−1 subtractions for the known terms and one division, 2i−1 flops. The total is ∑(2i−1)=n². For n=2000 and 50 right-hand sides: the inverse route costs 2n³+50·2n²=1.6×10¹⁰+4×10⁸=1.64×10¹⁰ flops; the LU route costs ⅔n³+50·2n²≈5.333×10⁹+4×10⁸=5.733×10⁹ flops. The ratio is 123/43≈2.86: forming the inverse is almost three times as expensive, and it is also less accurate. Rubric: the n² count derived row by row; both totals with the stated cost model; the ratio.",
  "solution": "<p>Back substitution on an upper triangular system with nonzero diagonal: the unknown in row i (counting from the bottom, i=1,…,n) needs i−1 multiplications and i−1 subtractions for the known terms and one division, 2i−1 flops. The total is ∑(2i−1)=n². For n=2000 and 50 right-hand sides: the inverse route costs 2n³+50·2n²=1.6×10¹⁰+4×10⁸=1.64×10¹⁰ flops; the LU route costs ⅔n³+50·2n²≈5.333×10⁹+4×10⁸=5.733×10⁹ flops. The ratio is 123/43≈2.86: forming the inverse is almost three times as expensive, and it is also less accurate. Rubric: the n² count derived row by row; both totals with the stated cost model; the ratio.</p>",
  "fields": [
    {
      "id": "ratio",
      "label": "inverse-route cost ÷ LU-route cost",
      "type": "num",
      "ans": 2.86046511627907
    }
  ],
  "hints": {
    "ratio": "Inverse: 2n³+50·2n². LU: ⅔n³+50·2n². With n=2000 an answer such as 123/43 is accepted."
  }
},
B1: {
  "statement": "**B1 · Foundation · NumPy — elementary matrices as code.** Write `elementary(kind, n, i, j=None, c=None)` returning the \\(n\\times n\\) elementary matrix for a swap, a scaling or a replacement. For random \\(4\\times5\\) matrices, check that `E @ A` performs the row operation and that the matrix of the reverse operation is `np.linalg.inv(E)` to rounding. Then eliminate a random \\(4\\times4\\) matrix without swaps, collect the elimination matrices, and confirm that their product in forward order is \\(L^{-1}\\) while the inverses in reverse order multiply to \\(L\\) with the multipliers in place.",
  "plain": "Swap: identity with rows i and j exchanged. Scaling: identity with c in position (i,i), c≠0. Replacement R_i←R_i−cR_j: identity with −c in position (i,j), j≠i. For random 4×5 matrices, E@A should equal the row-operated copy exactly (the operations involve at most one multiply–add per entry), and the reverse-operation matrix should match np.linalg.inv(E) to about 10⁻¹⁵. For the 4×4 elimination, collect L_k=I−ℓ_k e_kᵀ for k=1,2,3. The forward product L₃L₂L₁ equals L⁻¹ and generally has entries that are products of multipliers, not multipliers; the product of the inverses in reverse order, L₁⁻¹L₂⁻¹L₃⁻¹, equals L with each multiplier ℓ_ij sitting in position (i,j), as Theorem 18 predicts. Report the maximum absolute difference in each comparison. Rubric: correct elementary constructors with argument checks (c≠0, j≠i); E@A verified on random data; inverses verified; the forward product shown not to be L while the reverse product of inverses is; differences reported numerically.",
  "solution": "<p>Swap: identity with rows i and j exchanged. Scaling: identity with c in position (i,i), c≠0. Replacement R_i←R_i−cR_j: identity with −c in position (i,j), j≠i. For random 4×5 matrices, E@A should equal the row-operated copy exactly (the operations involve at most one multiply–add per entry), and the reverse-operation matrix should match np.linalg.inv(E) to about 10⁻¹⁵. For the 4×4 elimination, collect L_k=I−ℓ_k e_kᵀ for k=1,2,3. The forward product L₃L₂L₁ equals L⁻¹ and generally has entries that are products of multipliers, not multipliers; the product of the inverses in reverse order, L₁⁻¹L₂⁻¹L₃⁻¹, equals L with each multiplier ℓ_ij sitting in position (i,j), as Theorem 18 predicts. Report the maximum absolute difference in each comparison. Rubric: correct elementary constructors with argument checks (c≠0, j≠i); E@A verified on random data; inverses verified; the forward product shown not to be L while the reverse product of inverses is; differences reported numerically.</p>"
},
B2: {
  "statement": "**B2 · Core · NumPy — count the flops.** Instrument a no-pivoting LU of your own so that it counts every addition, subtraction, multiplication and division. For \\(n=5,10,20,\\dots,320\\), compare the count with \\(\\tfrac23n^3-\\tfrac12n^2-\\tfrac16n\\), and fit the exponent of the count against \\(n\\) on a log–log plot.",
  "plain": "A no-pivoting LU that clears column k of an n×n matrix performs n−k divisions for the multipliers and (n−k)² multiplications and (n−k)² subtractions for the updates, so the exact count is ∑_{j=1}^{n−1}(j+2j²)=⅔n³−½n²−⅙n. The instrumented count should match this formula exactly for every n (it is an integer identity, not an approximation). On a log–log plot of count against n, the slope between n=160 and n=320 is log₂(count(320)/count(160))≈3.003, and between n=5 and n=10 it is about 3.14: the −½n² term makes the slope approach 3 from above. Rubric: counters on every arithmetic operation, not on loop iterations; exact agreement with the formula at each n; the fitted exponent near 3 with the method stated; an explanation of why small n gives a slope above 3.",
  "solution": "<p>A no-pivoting LU that clears column k of an n×n matrix performs n−k divisions for the multipliers and (n−k)² multiplications and (n−k)² subtractions for the updates, so the exact count is ∑_{j=1}^{n−1}(j+2j²)=⅔n³−½n²−⅙n. The instrumented count should match this formula exactly for every n (it is an integer identity, not an approximation). On a log–log plot of count against n, the slope between n=160 and n=320 is log₂(count(320)/count(160))≈3.003, and between n=5 and n=10 it is about 3.14: the −½n² term makes the slope approach 3 from above. Rubric: counters on every arithmetic operation, not on loop iterations; exact agreement with the formula at each n; the fitted exponent near 3 with the method stated; an explanation of why small n gives a slope above 3.</p>"
},
B3: {
  "statement": "**B3 · Core · NumPy — factor once, solve many.** Port your Lab C factorization to NumPy (or use `scipy.linalg.lu_factor` and `lu_solve` if SciPy is available). For \\(n=500\\), time 50 right-hand sides solved from one factorization against 50 calls to `np.linalg.solve`, report the ratio, and compare it with the flop model of section 9. Repeat at \\(n=50\\) and explain the difference.",
  "plain": "The flop model predicts that for n=500 and 50 right-hand sides, one factorization plus 50 solve pairs costs ⅔n³+50·2n²≈1.08×10⁸ flops, while 50 separate solves cost 50(⅔n³+2n²)≈4.19×10⁹, a ratio near 39. Measured times usually show a smaller ratio than the model, because library solves are very efficient (blocked, cache-friendly, often multithreaded) while a hand-written substitution loop in Python pays interpreter overhead per entry; porting the substitutions to vectorized NumPy or using lu_solve brings the measured ratio closer to the model. At n=50 the factorization is cheap relative to fixed per-call overhead, so the advantage of reuse shrinks. Report hardware, library versions, repeat counts and medians. Rubric: a correct factor-once implementation; timings with repeats and a stated statistic; the flop-model prediction; an explanation of the gap between model and measurement and of the n=50 behaviour.",
  "solution": "<p>The flop model predicts that for n=500 and 50 right-hand sides, one factorization plus 50 solve pairs costs ⅔n³+50·2n²≈1.08×10⁸ flops, while 50 separate solves cost 50(⅔n³+2n²)≈4.19×10⁹, a ratio near 39. Measured times usually show a smaller ratio than the model, because library solves are very efficient (blocked, cache-friendly, often multithreaded) while a hand-written substitution loop in Python pays interpreter overhead per entry; porting the substitutions to vectorized NumPy or using lu_solve brings the measured ratio closer to the model. At n=50 the factorization is cheap relative to fixed per-call overhead, so the advantage of reuse shrinks. Report hardware, library versions, repeat counts and medians. Rubric: a correct factor-once implementation; timings with repeats and a stated statistic; the flop-model prediction; an explanation of the gap between model and measurement and of the n=50 behaviour.</p>"
},
B4: {
  "statement": "**B4 · Core · NumPy — the counting law, measured.** Verify rank–nullity on 200 random matrices of assorted shapes, including deliberately rank-deficient ones built by repeating or combining columns, using your own rank and null-space basis. Check that each basis vector satisfies \\(Av\\approx0\\) and that the basis is independent.",
  "plain": "For each random matrix, compute the RREF with a relative pivot tolerance (for example 10⁻¹⁰ times the largest absolute entry), take the rank r as the number of pivots, and build the free-variable null basis of Theorem 11. Check that r plus the number of basis vectors equals n for every matrix, that ‖Av‖ is at rounding level for each basis vector, and that the basis matrix has full column rank (each basis vector has a 1 in its own free coordinate and 0 in the others, so independence also holds exactly). Rank-deficient matrices built by repeating or combining columns should report the designed rank; report any matrix where the tolerance changes the answer. Rubric: rank–nullity verified on all 200 matrices including deficient ones; residuals Av reported; independence checked; the tolerance stated and its effect discussed.",
  "solution": "<p>For each random matrix, compute the RREF with a relative pivot tolerance (for example 10⁻¹⁰ times the largest absolute entry), take the rank r as the number of pivots, and build the free-variable null basis of Theorem 11. Check that r plus the number of basis vectors equals n for every matrix, that ‖Av‖ is at rounding level for each basis vector, and that the basis matrix has full column rank (each basis vector has a 1 in its own free coordinate and 0 in the others, so independence also holds exactly). Rank-deficient matrices built by repeating or combining columns should report the designed rank; report any matrix where the tolerance changes the answer. Rubric: rank–nullity verified on all 200 matrices including deficient ones; residuals Av reported; independence checked; the tolerance stated and its effect discussed.</p>"
},
B5: {
  "statement": "**B5 · Stretch · NumPy — growth factors in practice.** Implement partial-pivoting LU that also returns the growth factor \\(\\rho\\). Measure \\(\\rho\\) for 100 standard normal matrices at each of \\(n=10,20,40,80\\), and for the Wilkinson matrices \\(W_n\\) of section 10 at the same sizes. Solve \\(W_nx=b\\) with \\(b=W_n\\mathbf 1\\) in float64 for \\(n=20,40,60\\), report the relative error against \\(\\mathbf 1\\), and relate it to \\(\\rho u\\).",
  "plain": "Growth factor ρ = (largest absolute entry of any intermediate matrix, including U) ÷ (largest absolute entry of A). For standard normal matrices with partial pivoting, observed ρ is small and grows slowly with n, typically a few units up to perhaps ten at n=80. For the Wilkinson matrices W_n, partial pivoting with ties kept in place gives ρ=2^{n−1}: 512, about 5.2×10⁵, 5.5×10¹¹ and 6.0×10²³ for n=10, 20, 40, 80. Solving W_n x=W_n·1 in float64, the relative error is small for n=20, of order ρu≈6×10⁻¹¹ at worst, grows markedly by n=40, and at n=60 (ρu≈64) the solution can lose all accuracy, in line with the backward-error scale ρu. Rubric: a correct pivoting LU returning ρ; random-matrix growth summarized with a statistic; 2^{n−1} observed for W_n; errors for n=20, 40, 60 reported and related to ρu.",
  "solution": "<p>Growth factor ρ = (largest absolute entry of any intermediate matrix, including U) ÷ (largest absolute entry of A). For standard normal matrices with partial pivoting, observed ρ is small and grows slowly with n, typically a few units up to perhaps ten at n=80. For the Wilkinson matrices W_n, partial pivoting with ties kept in place gives ρ=2^{n−1}: 512, about 5.2×10⁵, 5.5×10¹¹ and 6.0×10²³ for n=10, 20, 40, 80. Solving W_n x=W_n·1 in float64, the relative error is small for n=20, of order ρu≈6×10⁻¹¹ at worst, grows markedly by n=40, and at n=60 (ρu≈64) the solution can lose all accuracy, in line with the backward-error scale ρu. Rubric: a correct pivoting LU returning ρ; random-matrix growth summarized with a statistic; 2^{n−1} observed for W_n; errors for n=20, 40, 60 reported and related to ρu.</p>"
},
B6: {
  "statement": "**B6 · Stretch · NumPy — rank is a threshold.** Compute the numerical rank of a \\(20\\times20\\) rank-5 product perturbed by noise of size \\(10^{-10}\\) at five tolerances. Plot rank against tolerance and mark where the singular values cluster.",
  "plain": "A 20×20 rank-5 product such as A=UV with U∈ℝ^{20×5}, V∈ℝ^{5×20}, plus noise of size 10⁻¹⁰, has five singular values of order one and fifteen at the noise level, around 10⁻¹⁰ times a modest factor. The numerical rank is 5 for every tolerance between roughly 10⁻⁸ and 10⁻¹ times the largest singular value, jumps toward 20 once the tolerance drops below the noise level (about 10⁻⁹ to 10⁻¹¹), and falls below 5 only when the tolerance exceeds the smallest signal singular value. The plot of rank against tolerance is a staircase with a long flat step at 5; mark the two clusters of singular values on it. Rubric: the construction stated with seed and dtype; ranks at five tolerances; the plot with singular-value clusters marked; the conclusion that a numerical rank is meaningful only together with its tolerance.",
  "solution": "<p>A 20×20 rank-5 product such as A=UV with U∈ℝ^{20×5}, V∈ℝ^{5×20}, plus noise of size 10⁻¹⁰, has five singular values of order one and fifteen at the noise level, around 10⁻¹⁰ times a modest factor. The numerical rank is 5 for every tolerance between roughly 10⁻⁸ and 10⁻¹ times the largest singular value, jumps toward 20 once the tolerance drops below the noise level (about 10⁻⁹ to 10⁻¹¹), and falls below 5 only when the tolerance exceeds the smallest signal singular value. The plot of rank against tolerance is a staircase with a long flat step at 5; mark the two clusters of singular values on it. Rubric: the construction stated with seed and dtype; ranks at five tolerances; the plot with singular-value clusters marked; the conclusion that a numerical rank is meaningful only together with its tolerance.</p>"
},
B7: {
  "statement": "**B7 · Stretch · NumPy — four bases from one reduction.** Reduce \\([A\\mid I_m]\\) while selecting pivots only in the \\(A\\) block, to obtain \\([R\\mid E]\\) with \\(EA=R\\). Build bases for all four fundamental subspaces from this single reduction, using rows of \\(E\\) that correspond to zero rows of \\(R\\) for the left null space. Verify the four dimensions on random rank-deficient matrices of several shapes.",
  "plain": "Reduce [A | I_m] choosing pivots only in the A block; the result [R | E] satisfies EA=R. The four bases: pivot columns of A for C(A); nonzero rows of R for C(Aᵀ); free-variable vectors from R for N(A); and the rows of E that sit beside zero rows of R, written as column vectors, for N(Aᵀ) (Theorem 14). Verify on random rank-deficient matrices of several shapes that the dimensions are r, r, n−r and m−r, that A·(null vector)≈0 and (left-null vector)ᵀA≈0, and that each basis is independent. Rubric: a single reduction produces all four bases; E recorded correctly with pivots chosen only in the A block; the four dimensions verified; residual checks for both null spaces.",
  "solution": "<p>Reduce [A | I_m] choosing pivots only in the A block; the result [R | E] satisfies EA=R. The four bases: pivot columns of A for C(A); nonzero rows of R for C(Aᵀ); free-variable vectors from R for N(A); and the rows of E that sit beside zero rows of R, written as column vectors, for N(Aᵀ) (Theorem 14). Verify on random rank-deficient matrices of several shapes that the dimensions are r, r, n−r and m−r, that A·(null vector)≈0 and (left-null vector)ᵀA≈0, and that each basis is independent. Rubric: a single reduction produces all four bases; E recorded correctly with pivots chosen only in the A block; the four dimensions verified; residual checks for both null spaces.</p>"
},
C1: {
  "statement": "**C1 · Foundation · PyTorch — read the shape first.** Take `nn.Linear(768, 3072)`. Before computing, state the maximum possible rank of its weight, whether \\(Wx=b\\) can have a unique solution, and the nullity if the rank is full. Then verify each with `torch.linalg`.",
  "plain": "nn.Linear(768, 3072) stores a weight W of shape 3072×768: it maps ℝ⁷⁶⁸ to ℝ³⁰⁷². Its rank is at most min(3072,768)=768. If the rank is full (768, which random initialization gives with probability 1), the null space is {0}: nullity 768−768=0, so Wx=b has at most one solution, and it has one only when b lies in the 768-dimensional column space inside ℝ³⁰⁷², so most b are unreachable. Verify with torch.linalg.matrix_rank on layer.weight (expect 768) and by checking that the smallest singular value is well above rounding. Rubric: the weight's shape read correctly (output × input); the rank bound; uniqueness from trivial null space; existence failing for most b; numerical confirmation.",
  "solution": "<p>nn.Linear(768, 3072) stores a weight W of shape 3072×768: it maps ℝ⁷⁶⁸ to ℝ³⁰⁷². Its rank is at most min(3072,768)=768. If the rank is full (768, which random initialization gives with probability 1), the null space is {0}: nullity 768−768=0, so Wx=b has at most one solution, and it has one only when b lies in the 768-dimensional column space inside ℝ³⁰⁷², so most b are unreachable. Verify with torch.linalg.matrix_rank on layer.weight (expect 768) and by checking that the smallest singular value is well above rounding. Rubric: the weight's shape read correctly (output × input); the rank bound; uniqueness from trivial null space; existence failing for most b; numerical confirmation.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "maximum possible rank of the weight",
      "type": "num",
      "ans": 768
    },
    {
      "id": "nullity",
      "label": "nullity when the rank is full",
      "type": "num",
      "ans": 0
    }
  ],
  "hints": {
    "rank": "The weight is 3072×768; rank cannot exceed the smaller dimension.",
    "nullity": "Apply rank–nullity with n equal to the number of input features."
  }
},
C2: {
  "statement": "**C2 · Core · PyTorch — what a factored update can reach.** Build \\(\\Delta W=BA\\) with \\(d=k=512\\) and inner dimension \\(r=8\\). Verify \\(\\operatorname{rank}(\\Delta W)\\le8\\) numerically, then give the dimensions of \\(N(\\Delta W)\\) and \\(N(\\Delta W^{\\mathsf T})\\), and say in words which input directions the adapter ignores and which output directions it can never produce.",
  "plain": "With B∈ℝ^{512×8} and A∈ℝ^{8×512}, ΔW=BA has rank at most 8 (Theorem 9), and generic random factors give exactly 8, confirmed by eight singular values far above the rest (which sit at rounding level). Then dim N(ΔW)=512−8=504 and dim N(ΔWᵀ)=512−8=504. In words: ΔW ignores every input direction in the 504-dimensional null space of A (anything A sends to zero), and every output of ΔW lies in the 8-dimensional column space of B, so the 504 output directions outside that span can never be produced by the adapter alone. Rubric: rank ≤ 8 verified numerically with a stated tolerance; both nullities from rank–nullity; the input and output interpretations tied to N(A) and C(B).",
  "solution": "<p>With B∈ℝ^{512×8} and A∈ℝ^{8×512}, ΔW=BA has rank at most 8 (Theorem 9), and generic random factors give exactly 8, confirmed by eight singular values far above the rest (which sit at rounding level). Then dim N(ΔW)=512−8=504 and dim N(ΔWᵀ)=512−8=504. In words: ΔW ignores every input direction in the 504-dimensional null space of A (anything A sends to zero), and every output of ΔW lies in the 8-dimensional column space of B, so the 504 output directions outside that span can never be produced by the adapter alone. Rubric: rank ≤ 8 verified numerically with a stated tolerance; both nullities from rank–nullity; the input and output interpretations tied to N(A) and C(B).</p>",
  "fields": [
    {
      "id": "nullities",
      "label": "dim N(ΔW) and dim N(ΔWᵀ) when the rank is 8",
      "type": "vec",
      "ans": [
        504,
        504
      ]
    }
  ],
  "hints": {
    "nullities": "Rank–nullity for the 512×512 matrix ΔW and for its transpose."
  }
},
C3: {
  "statement": "**C3 · Core · PyTorch — a rank bound on attention scores.** For one attention head with \\(d_\\text{head}=64\\) and sequence length 1024, compute the rank of the pre-softmax score matrix \\(QK^{\\mathsf T}\\), explain the bound from Theorem 9, then check whether the rank survives the softmax.",
  "plain": "Q and K are 1024×64, so the score matrix QKᵀ is 1024×1024 but has rank at most 64 by Theorem 9: every column is Q times a column of Kᵀ, so all columns lie in the 64-dimensional C(Q). Random Q and K give rank exactly 64. The softmax is applied entrywise (exponentials, then row normalization), which is not linear, so the rank bound does not survive: the resulting attention matrix is typically full rank, 1024, as a computed singular-value spectrum shows. Rubric: the bound 64 with Theorem 9 cited; numerical confirmation with a tolerance; the observation that the nonlinear softmax breaks the bound, with the measured rank after softmax.",
  "solution": "<p>Q and K are 1024×64, so the score matrix QKᵀ is 1024×1024 but has rank at most 64 by Theorem 9: every column is Q times a column of Kᵀ, so all columns lie in the 64-dimensional C(Q). Random Q and K give rank exactly 64. The softmax is applied entrywise (exponentials, then row normalization), which is not linear, so the rank bound does not survive: the resulting attention matrix is typically full rank, 1024, as a computed singular-value spectrum shows. Rubric: the bound 64 with Theorem 9 cited; numerical confirmation with a tolerance; the observation that the nonlinear softmax breaks the bound, with the measured rank after softmax.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "rank of QKᵀ",
      "type": "num",
      "ans": 64
    }
  ],
  "hints": {
    "rank": "The inner dimension of the product is d_head."
  }
},
C4: {
  "statement": "**C4 · Core · PyTorch — LU conventions in a library.** With `torch.manual_seed(0)` and `float64`, draw a \\(6\\times6\\) matrix \\(A\\) and a \\(6\\times20\\) right-hand side \\(B\\). Compute `P, L, U = torch.linalg.lu(A)` and determine from the output whether PyTorch returns \\(A=PLU\\) or \\(PA=LU\\). Check that every entry of \\(L\\) has absolute value at most 1, then solve all twenty systems with `torch.linalg.lu_factor` and `torch.linalg.lu_solve` and report the largest residual \\(\\|AX-B\\|\\).",
  "plain": "torch.linalg.lu returns P, L, U with A = P @ L @ U: P multiplies on the left of L U, so in the notation of this unit it is Pᵀ that plays the role of our P (PᵀA=LU). Confirm by checking which of ‖A−PLU‖ and ‖PA−LU‖ is at rounding level. Every entry of L has absolute value at most 1 because the library uses partial pivoting. Solving the twenty systems with lu_factor and lu_solve gives a largest residual ‖AX−B‖ at rounding level, around 10⁻¹⁴ for this size and scale in float64. Record the PyTorch version. Rubric: the convention determined from the residual test, not assumed; the multiplier bound checked; all twenty solves with the largest residual reported; version recorded.",
  "solution": "<p>torch.linalg.lu returns P, L, U with A = P @ L @ U: P multiplies on the left of L U, so in the notation of this unit it is Pᵀ that plays the role of our P (PᵀA=LU). Confirm by checking which of ‖A−PLU‖ and ‖PA−LU‖ is at rounding level. Every entry of L has absolute value at most 1 because the library uses partial pivoting. Solving the twenty systems with lu_factor and lu_solve gives a largest residual ‖AX−B‖ at rounding level, around 10⁻¹⁴ for this size and scale in float64. Record the PyTorch version. Rubric: the convention determined from the residual test, not assumed; the multiplier bound checked; all twenty solves with the largest residual reported; version recorded.</p>"
},
C5: {
  "statement": "**C5 · Stretch · PyTorch — conditioning in a regression.** With `torch.manual_seed(0)` and `float64`, draw \\(x,u\\in\\mathbb R^{100}\\) standard normal, set the design \\(A=[\\,x,\\ x+10^{-4}u\\,]\\), and the target \\(b=2x+0.01\\,\\epsilon\\) with \\(\\epsilon\\) standard normal. Using `torch.linalg.lstsq`, report `torch.linalg.cond(A)`, the two coefficients and their sum, and the residual norm. Perturb \\(b\\) by \\(10^{-6}\\) times fresh standard normal noise and report the coefficient change. Re-run with the single-column design \\(A=[\\,x\\,]\\) and compare coefficient stability.",
  "plain": "The two columns x and x+10⁻⁴u are nearly parallel, so cond(A) is large, of order 10⁴ to 10⁵. The least-squares coefficients are individually unstable, but their sum is close to 2, because the design determines the combination that multiplies x well and only weakly determines how it is split between the columns. The residual norm is near 0.01·‖ε‖, about 0.1. A perturbation of b of size 10⁻⁶ changes the individual coefficients by roughly cond(A) times 10⁻⁶, visibly more than it changes their sum. With the single-column design A=[x], the coefficient is close to 2 and changes only at the 10⁻⁶ level. Rubric: condition number, coefficients, their sum and residual reported with seed and dtype; the perturbation experiment quantified; the contrast with the one-column design explained by near-dependence of the columns.",
  "solution": "<p>The two columns x and x+10⁻⁴u are nearly parallel, so cond(A) is large, of order 10⁴ to 10⁵. The least-squares coefficients are individually unstable, but their sum is close to 2, because the design determines the combination that multiplies x well and only weakly determines how it is split between the columns. The residual norm is near 0.01·‖ε‖, about 0.1. A perturbation of b of size 10⁻⁶ changes the individual coefficients by roughly cond(A) times 10⁻⁶, visibly more than it changes their sum. With the single-column design A=[x], the coefficient is close to 2 and changes only at the 10⁻⁶ level. Rubric: condition number, coefficients, their sum and residual reported with seed and dtype; the perturbation experiment quantified; the contrast with the one-column design explained by near-dependence of the columns.</p>"
},
C6: {
  "statement": "**C6 · Stretch · PyTorch — audit a rank claim.** With `torch.manual_seed(0)` and `float64`, build a stand-in weight \\(W=U\\operatorname{diag}(s)V^{\\mathsf T}+Z\\in\\mathbb R^{256\\times256}\\), where \\(U,V\\) are the Q factors of two standard normal \\(256\\times256\\) matrices, \\(s_i=0.9^{\\,i}\\) for \\(i=0,\\dots,255\\), and \\(Z\\) has independent \\(\\mathcal N(0,10^{-12})\\) entries (standard deviation \\(10^{-6}\\)). Plot the singular values of \\(W\\) on a log scale, report the numerical rank at absolute tolerances \\(10^{-1}\\), \\(10^{-2}\\), and \\(10^{-10}\\), and report the fraction of squared Frobenius norm discarded by a rank-32 truncation. Say what, if anything, follows about a layer with this weight.",
  "plain": "The singular values of W are approximately s_i=0.9^i until they reach the noise floor, where Z dominates: Z has standard deviation 10⁻⁶, so its singular values are of order 10⁻⁶·√256·2≈3×10⁻⁵. The numerical rank at tolerance 10⁻¹ is 22 (0.9^i>0.1 for i≤21), at 10⁻² it is 44, and at 10⁻¹⁰ it is 256, because the noise floor lies far above 10⁻¹⁰. A rank-32 truncation discards the fraction ∑_{i≥32}0.81^i/∑_{i<256}0.81^i≈0.0012 of the squared Frobenius norm. What follows: the weight is well approximated by low rank in the Frobenius sense, but \"the rank\" depends entirely on the tolerance, and nothing here shows that the discarded directions are unimportant for the layer's function on real inputs. Rubric: the log-scale spectrum with the noise floor identified; three numerical ranks; the discarded-energy fraction; a conclusion that separates approximation error from functional importance.",
  "solution": "<p>The singular values of W are approximately s_i=0.9^i until they reach the noise floor, where Z dominates: Z has standard deviation 10⁻⁶, so its singular values are of order 10⁻⁶·√256·2≈3×10⁻⁵. The numerical rank at tolerance 10⁻¹ is 22 (0.9^i&gt;0.1 for i≤21), at 10⁻² it is 44, and at 10⁻¹⁰ it is 256, because the noise floor lies far above 10⁻¹⁰. A rank-32 truncation discards the fraction ∑_{i≥32}0.81^i/∑_{i&lt;256}0.81^i≈0.0012 of the squared Frobenius norm. What follows: the weight is well approximated by low rank in the Frobenius sense, but \"the rank\" depends entirely on the tolerance, and nothing here shows that the discarded directions are unimportant for the layer's function on real inputs. Rubric: the log-scale spectrum with the noise floor identified; three numerical ranks; the discarded-energy fraction; a conclusion that separates approximation error from functional importance.</p>",
  "fields": [
    {
      "id": "ranks",
      "label": "numerical ranks at tolerances 10⁻¹ and 10⁻²",
      "type": "vec",
      "ans": [
        22,
        44
      ]
    }
  ],
  "hints": {
    "ranks": "Count i with 0.9^i above each tolerance; the noise is far below both."
  }
},
M1: {
  "statement": "**M1 · Foundation · mixed — three shapes, three verdicts.** For a \\(3\\times3\\) system with rank 3, a \\(3\\times5\\) system with rank 3, and a \\(5\\times3\\) system with rank 3, state existence and uniqueness before computing anything, and justify each from rank alone.",
  "plain": "3×3, rank 3: full row rank, so a solution exists for every b, and full column rank, so it is unique. 3×5, rank 3: full row rank (3=m), so a solution exists for every b; but nullity 5−3=2, so there are infinitely many. 5×3, rank 3: full column rank, so a solution is unique when it exists; but only a 3-dimensional subspace of ℝ⁵ is reachable, so for most b there is none (the left null space has dimension 2 and imposes two conditions). Rubric: each verdict justified by r=m (existence for all b) and r=n (uniqueness) or their failure; nullity and left-nullity computed; no computation of specific matrices needed.",
  "solution": "<p>3×3, rank 3: full row rank, so a solution exists for every b, and full column rank, so it is unique. 3×5, rank 3: full row rank (3=m), so a solution exists for every b; but nullity 5−3=2, so there are infinitely many. 5×3, rank 3: full column rank, so a solution is unique when it exists; but only a 3-dimensional subspace of ℝ⁵ is reachable, so for most b there is none (the left null space has dimension 2 and imposes two conditions). Rubric: each verdict justified by r=m (existence for all b) and r=n (uniqueness) or their failure; nullity and left-nullity computed; no computation of specific matrices needed.</p>"
},
M2: {
  "statement": "**M2 · Foundation · mixed — design the subspaces.** Construct a \\(3\\times3\\) matrix whose column space is the plane \\(y_1+y_2+y_3=0\\) and whose null space is the line spanned by \\((1,1,1)\\). Verify both claims and give its rank.",
  "plain": "Take A=[[1,0,−1],[−1,1,0],[0,−1,1]], whose columns are (1,−1,0), (0,1,−1) and (−1,0,1). Each column has entries summing to 0, so C(A) lies in the plane y₁+y₂+y₃=0; the first two columns are independent, so C(A) has dimension at least 2 and equals the plane. A(1,1,1)=(1+0−1, −1+1+0, 0−1+1)=(0,0,0), so (1,1,1) is in N(A); by rank–nullity dim N(A)=3−2=1, so N(A) is exactly the line. The rank is 2. (The centering matrix I−⅓J, with J the all-ones matrix, also works.) Rubric: a concrete matrix; column space shown to equal the plane (inclusion plus dimension); null space shown to equal the line (inclusion plus rank–nullity); rank 2.",
  "solution": "<p>Take A=[[1,0,−1],[−1,1,0],[0,−1,1]], whose columns are (1,−1,0), (0,1,−1) and (−1,0,1). Each column has entries summing to 0, so C(A) lies in the plane y₁+y₂+y₃=0; the first two columns are independent, so C(A) has dimension at least 2 and equals the plane. A(1,1,1)=(1+0−1, −1+1+0, 0−1+1)=(0,0,0), so (1,1,1) is in N(A); by rank–nullity dim N(A)=3−2=1, so N(A) is exactly the line. The rank is 2. (The centering matrix I−⅓J, with J the all-ones matrix, also works.) Rubric: a concrete matrix; column space shown to equal the plane (inclusion plus dimension); null space shown to equal the line (inclusion plus rank–nullity); rank 2.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "rank of your matrix",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "rank": "A plane column space has dimension 2."
  }
},
M3: {
  "statement": "**M3 · Core · mixed — a solution set you can draw.** Find the complete solution set of \\(x-y+2z=1\\), \\(2x-y+z=4\\), describe it geometrically, and give the point of it that has \\(z=1\\).",
  "plain": "R₂←R₂−2R₁ gives y−3z=2; then R₁←R₁+R₂ gives x−z=3. With z free: x=3+z and y=2+3z. The solution set is the line (3,2,0)+t(1,3,1), the intersection of the two planes; it does not pass through the origin. At z=1 the point is (4,5,1). Check: 4−5+2=1 and 8−5+1=4. Rubric: correct elimination; the solution as a particular point plus a null direction; the geometric description as the intersection line of two planes; the z=1 point with a check.",
  "solution": "<p>R₂←R₂−2R₁ gives y−3z=2; then R₁←R₁+R₂ gives x−z=3. With z free: x=3+z and y=2+3z. The solution set is the line (3,2,0)+t(1,3,1), the intersection of the two planes; it does not pass through the origin. At z=1 the point is (4,5,1). Check: 4−5+2=1 and 8−5+1=4. Rubric: correct elimination; the solution as a particular point plus a null direction; the geometric description as the intersection line of two planes; the z=1 point with a check.</p>",
  "fields": [
    {
      "id": "point",
      "label": "the solution with z = 1",
      "type": "vec",
      "ans": [
        4,
        5,
        1
      ]
    }
  ],
  "hints": {
    "point": "Solve for x and y in terms of the free variable z, then set z=1."
  }
},
M4: {
  "statement": "**M4 · Core · mixed — reachable targets.** For a \\(3\\times2\\) matrix of rank 2, characterise exactly the set of \\(b\\) for which \\(Ax=b\\) is solvable, and connect your answer to the left null space.",
  "plain": "A 3×2 matrix of rank 2 has independent columns spanning a plane C(A) through the origin in ℝ³. Ax=b is solvable exactly when b lies in that plane. The left null space has dimension 3−2=1, spanned by some nonzero y with yᵀA=0, and Theorem 14 says b is reachable exactly when yᵀb=0: the plane is {b : yᵀb=0}. When b is reachable the solution is unique (full column rank). For example, for columns (1,0,1) and (0,1,1), y=(1,1,−1) and the condition is b₁+b₂=b₃. Rubric: the reachable set identified as the 2-dimensional column space; the one-dimensional left null space and the single condition yᵀb=0; uniqueness when solvable; an optional concrete example that is checked.",
  "solution": "<p>A 3×2 matrix of rank 2 has independent columns spanning a plane C(A) through the origin in ℝ³. Ax=b is solvable exactly when b lies in that plane. The left null space has dimension 3−2=1, spanned by some nonzero y with yᵀA=0, and Theorem 14 says b is reachable exactly when yᵀb=0: the plane is {b : yᵀb=0}. When b is reachable the solution is unique (full column rank). For example, for columns (1,0,1) and (0,1,1), y=(1,1,−1) and the condition is b₁+b₂=b₃. Rubric: the reachable set identified as the 2-dimensional column space; the one-dimensional left null space and the single condition yᵀb=0; uniqueness when solvable; an optional concrete example that is checked.</p>"
},
M5: {
  "statement": "**M5 · Core · mixed — the elimination that lies.** Construct a \\(2\\times2\\) system where exact elimination gives a unique solution but float64 elimination without pivoting returns something badly wrong. Report both answers, the condition number, and the growth factor of the unpivoted elimination.",
  "plain": "Take A=[[10⁻¹⁸,3],[2,1]] and b=(3,3). Exactly, the solution is x₂=(3−1.5·10⁻¹⁸)/(3−0.5·10⁻¹⁸) and x₁=(3−x₂)/2, which round to (1,1). Without pivoting in float64 the multiplier is 2·10¹⁸; the updated pivot 1−3·(2·10¹⁸) and the updated right-hand side 3−3·(2·10¹⁸) both round to −6·10¹⁸, so x₂=1 and then x₁=(3−3·1)/10⁻¹⁸=0: the answer (0,1) has lost x₁. The problem is well conditioned: A⁻¹=[[1,−3],[−2,10⁻¹⁸]]/(10⁻¹⁸−6), so ‖A‖∞=3, ‖A⁻¹‖∞=4/(6−10⁻¹⁸)≈2/3, and κ∞≈2. The growth factor of the unpivoted elimination is 6·10¹⁸/3=2·10¹⁸. Partial pivoting swaps the rows, uses the multiplier 5·10⁻¹⁹, and returns (1,1). Rubric: a system with a unique exact solution; the float64 unpivoted result shown step by step; κ computed and shown small; the growth factor; the pivoted comparison.",
  "solution": "<p>Take A=[[10⁻¹⁸,3],[2,1]] and b=(3,3). Exactly, the solution is x₂=(3−1.5·10⁻¹⁸)/(3−0.5·10⁻¹⁸) and x₁=(3−x₂)/2, which round to (1,1). Without pivoting in float64 the multiplier is 2·10¹⁸; the updated pivot 1−3·(2·10¹⁸) and the updated right-hand side 3−3·(2·10¹⁸) both round to −6·10¹⁸, so x₂=1 and then x₁=(3−3·1)/10⁻¹⁸=0: the answer (0,1) has lost x₁. The problem is well conditioned: A⁻¹=[[1,−3],[−2,10⁻¹⁸]]/(10⁻¹⁸−6), so ‖A‖∞=3, ‖A⁻¹‖∞=4/(6−10⁻¹⁸)≈2/3, and κ∞≈2. The growth factor of the unpivoted elimination is 6·10¹⁸/3=2·10¹⁸. Partial pivoting swaps the rows, uses the multiplier 5·10⁻¹⁹, and returns (1,1). Rubric: a system with a unique exact solution; the float64 unpivoted result shown step by step; κ computed and shown small; the growth factor; the pivoted comparison.</p>"
},
M6: {
  "statement": "**M6 · Stretch · mixed — when is a residual layer invertible?** A layer computes \\(x\\mapsto(I+uv^{\\mathsf T})x\\) with \\(u,v\\in\\mathbb R^n\\). Using the invertible matrix theorem, prove that it is invertible exactly when \\(v^{\\mathsf T}u\\ne-1\\), and describe its null space when \\(v^{\\mathsf T}u=-1\\). Give a concrete \\(u,v\\) in \\(\\mathbb R^2\\) for each case.",
  "plain": "Suppose vᵀu ≠ −1 and (I+uvᵀ)x=0. Then x=−u(vᵀx), so x is a multiple of u, say x=cu. Substituting, cu+c u(vᵀu)=c(1+vᵀu)u=0; since 1+vᵀu≠0 and (for u≠0) u≠0, c=0, so x=0. The null space is trivial, and by the invertible matrix theorem (2⇒1) the matrix is invertible. If u=0 the matrix is I and the condition holds trivially. Conversely, if vᵀu=−1 then (I+uvᵀ)u=u+u(vᵀu)=u−u=0 with u≠0, so the matrix is singular, and the argument above shows every null vector is a multiple of u: N=span{u}. Examples in ℝ²: u=(1,0), v=(1,0) gives vᵀu=1 and I+uvᵀ=diag(2,1), invertible; u=(1,0), v=(−1,0) gives vᵀu=−1 and I+uvᵀ=diag(0,1), with null space span{(1,0)}. Rubric: both directions proved; the invertible matrix theorem used for the square matrix; the null space identified as span{u} in the singular case; two checked examples.",
  "solution": "<p>Suppose vᵀu ≠ −1 and (I+uvᵀ)x=0. Then x=−u(vᵀx), so x is a multiple of u, say x=cu. Substituting, cu+c u(vᵀu)=c(1+vᵀu)u=0; since 1+vᵀu≠0 and (for u≠0) u≠0, c=0, so x=0. The null space is trivial, and by the invertible matrix theorem (2⇒1) the matrix is invertible. If u=0 the matrix is I and the condition holds trivially. Conversely, if vᵀu=−1 then (I+uvᵀ)u=u+u(vᵀu)=u−u=0 with u≠0, so the matrix is singular, and the argument above shows every null vector is a multiple of u: N=span{u}. Examples in ℝ²: u=(1,0), v=(1,0) gives vᵀu=1 and I+uvᵀ=diag(2,1), invertible; u=(1,0), v=(−1,0) gives vᵀu=−1 and I+uvᵀ=diag(0,1), with null space span{(1,0)}. Rubric: both directions proved; the invertible matrix theorem used for the square matrix; the null space identified as span{u} in the singular case; two checked examples.</p>"
},
M7: {
  "statement": "**M7 · Stretch · mixed — several probes, one blind space.** Three linear probes \\(w_1,w_2,w_3\\) read activations in \\(\\mathbb R^{768}\\), and the three vectors are independent. Find the dimension of the set of activation changes that leave all three probe scores exactly unchanged. If a fourth probe \\(w_4=w_1-w_2\\) is added, does that dimension change? Then say what stable scores on all four probes still do not show.",
  "plain": "The three probes form a 3×768 matrix W whose rows w₁ᵀ,w₂ᵀ,w₃ᵀ are independent, so rank W=3. An activation change δ leaves all three scores unchanged exactly when Wδ=0, that is δ∈N(W), and by rank–nullity dim N(W)=768−3=765. Adding w₄=w₁−w₂ does not change the row space (w₄ is a combination of existing rows), so the rank stays 3 and the blind space still has dimension 765: a dependent probe adds no new information. Stable scores on all four probes show only that the component of the change in the 3-dimensional row space is zero; the other 765 dimensions of the representation can change arbitrarily, and stable accuracy (rather than scores) would show even less. Rubric: the blind space identified as a null space; rank–nullity giving 765; the dependent probe shown not to change the rank; a precise statement of what stable scores do and do not show.",
  "solution": "<p>The three probes form a 3×768 matrix W whose rows w₁ᵀ,w₂ᵀ,w₃ᵀ are independent, so rank W=3. An activation change δ leaves all three scores unchanged exactly when Wδ=0, that is δ∈N(W), and by rank–nullity dim N(W)=768−3=765. Adding w₄=w₁−w₂ does not change the row space (w₄ is a combination of existing rows), so the rank stays 3 and the blind space still has dimension 765: a dependent probe adds no new information. Stable scores on all four probes show only that the component of the change in the 3-dimensional row space is zero; the other 765 dimensions of the representation can change arbitrarily, and stable accuracy (rather than scores) would show even less. Rubric: the blind space identified as a null space; rank–nullity giving 765; the dependent probe shown not to change the rank; a precise statement of what stable scores do and do not show.</p>",
  "fields": [
    {
      "id": "dim",
      "label": "dimension of the blind space with three probes",
      "type": "num",
      "ans": 765
    },
    {
      "id": "dim4",
      "label": "dimension after adding w₄ = w₁ − w₂",
      "type": "num",
      "ans": 765
    }
  ],
  "hints": {
    "dim": "Stack the probes as the rows of a 3×768 matrix and apply rank–nullity.",
    "dim4": "Ask whether w₄ enlarges the row space."
  }
},
M8: {
  "statement": "**M8 · Stretch · mixed — the geometry you have not earned.** Someone draws the four subspaces with right angles between them. State what extra structure that picture assumes, which two orthogonality claims it is making, and what in this unit does *not* depend on them.",
  "plain": "Right angles need an inner product; the picture assumes the standard dot product on ℝⁿ and ℝᵐ. It claims two orthogonality statements: the row space is perpendicular to the null space in ℝⁿ, and the column space is perpendicular to the left null space in ℝᵐ. Both hold for the dot product: Ax=0 says every row has dot product 0 with x, and yᵀA=0 says y has dot product 0 with every column. The genuinely inner-product-free results of this unit are rank, rank–nullity, the four dimensions, the structure x_p+N(A), the consistency test, and existence and uniqueness; these hold over any number system with reciprocals (compare K6). The two direct sums of Theorem 15 are not in that list: their proof uses zᵀz=0 ⇒ z=0, the positivity of sums of real squares, which is dot-product structure. Over the integers modulo 2, for A=[1 1] the row space and the null space are the same line, so the direct sum fails. Rubric: the inner product named as the extra structure; both orthogonality claims stated correctly; the inner-product-free results listed; the direct sums identified as depending on positivity of squares, with a supporting example or a pointer to K6.",
  "solution": "<p>Right angles need an inner product; the picture assumes the standard dot product on ℝⁿ and ℝᵐ. It claims two orthogonality statements: the row space is perpendicular to the null space in ℝⁿ, and the column space is perpendicular to the left null space in ℝᵐ. Both hold for the dot product: Ax=0 says every row has dot product 0 with x, and yᵀA=0 says y has dot product 0 with every column. The genuinely inner-product-free results of this unit are rank, rank–nullity, the four dimensions, the structure x_p+N(A), the consistency test, and existence and uniqueness; these hold over any number system with reciprocals (compare K6). The two direct sums of Theorem 15 are not in that list: their proof uses zᵀz=0 ⇒ z=0, the positivity of sums of real squares, which is dot-product structure. Over the integers modulo 2, for A=[1 1] the row space and the null space are the same line, so the direct sum fails. Rubric: the inner product named as the extra structure; both orthogonality claims stated correctly; the inner-product-free results listed; the direct sums identified as depending on positivity of squares, with a supporting example or a pointer to K6.</p>"
},
M9: {
  "statement": "**M9 · Stretch · mixed — pivot growth and backward error.** For the Wilkinson matrices \\(W_n\\) of section 10, prove by induction that partial pivoting (keeping the current row on ties) produces a last column of \\(U\\) equal to \\((1,2,4,\\dots,2^{n-1})\\). Give \\(\\rho\\) for \\(n=5\\), and evaluate the backward-error scale \\(\\rho u\\) for \\(n=60\\) in float64 (\\(u=2^{-53}\\)). Say what that number means for the computed solution.",
  "plain": "Induction on the elimination step for W_n (ones on the diagonal and in the last column, −1 below the diagonal). Claim: before step k, rows k,…,n have a 1 or −1 in column k (a 1 in row k, −1 below), zeros to the left, and every one of them has 2^{k−1} in the last column. Base k=1 holds. At step k all candidates in column k have absolute value 1, so partial pivoting keeps row k (ties kept in place) and the multipliers are −1: each row i>k becomes row i + row k, which puts 0 in column k, leaves the −1 entries in later columns unchanged (row k has zeros there except its last column), and doubles the last column to 2^k. So U has last column (1,2,4,…,2^{n−1}) and ρ=2^{n−1}. For n=5, ρ=16. For n=60, ρu=2^{59}·2^{−53}=2⁶=64: the backward-error bound allows relative data errors of order 64, far above 1, so the computed solution can be entirely wrong even though every multiplier had magnitude 1. Rubric: a correct induction hypothesis and step, including the tie-breaking convention; ρ for n=5; ρu for n=60 computed; its meaning for accuracy explained.",
  "solution": "<p>Induction on the elimination step for W_n (ones on the diagonal and in the last column, −1 below the diagonal). Claim: before step k, rows k,…,n have a 1 or −1 in column k (a 1 in row k, −1 below), zeros to the left, and every one of them has 2^{k−1} in the last column. Base k=1 holds. At step k all candidates in column k have absolute value 1, so partial pivoting keeps row k (ties kept in place) and the multipliers are −1: each row i&gt;k becomes row i + row k, which puts 0 in column k, leaves the −1 entries in later columns unchanged (row k has zeros there except its last column), and doubles the last column to 2^k. So U has last column (1,2,4,…,2^{n−1}) and ρ=2^{n−1}. For n=5, ρ=16. For n=60, ρu=2^{59}·2^{−53}=2⁶=64: the backward-error bound allows relative data errors of order 64, far above 1, so the computed solution can be entirely wrong even though every multiplier had magnitude 1. Rubric: a correct induction hypothesis and step, including the tie-breaking convention; ρ for n=5; ρu for n=60 computed; its meaning for accuracy explained.</p>",
  "fields": [
    {
      "id": "vals",
      "label": "ρ for n=5, and ρu for n=60",
      "type": "vec",
      "ans": [
        16,
        64
      ]
    }
  ],
  "hints": {
    "vals": "ρ=2^{n−1}; for n=60 multiply 2^{59} by u=2^{−53}. An answer such as 16, 2^6 is accepted."
  }
},
K1: {
  "statement": "**K1 · Checkpoint · gate — rank, without the word matrix.** Explain what the rank of \\(A\\) measures without using the word \"matrix\", then state the two questions about \\(Ax=b\\) it answers and how.",
  "plain": "Rank measures how many genuinely different directions a collection of arrows reaches: the dimension of everything you can build by combining the columns, which always equals the number of independent rows. It answers two questions about Ax=b. Existence: if the rank equals the number of equations (the output dimension), every target is reachable; otherwise only targets in the rank-dimensional column space are, and the test is that adding b as an extra column does not raise the rank. Uniqueness: if the rank equals the number of unknowns (columns), there are no free directions, so a solution, when it exists, is unique; otherwise the solutions form an affine set of dimension (number of unknowns − rank). Rubric: a correct plain-language meaning (dimension of the span of the columns, equal to that of the rows) without the word matrix; existence tied to full row rank or the rank test with b appended; uniqueness tied to full column rank and nullity.",
  "solution": "<p>Rank measures how many genuinely different directions a collection of arrows reaches: the dimension of everything you can build by combining the columns, which always equals the number of independent rows. It answers two questions about Ax=b. Existence: if the rank equals the number of equations (the output dimension), every target is reachable; otherwise only targets in the rank-dimensional column space are, and the test is that adding b as an extra column does not raise the rank. Uniqueness: if the rank equals the number of unknowns (columns), there are no free directions, so a solution, when it exists, is unique; otherwise the solutions form an affine set of dimension (number of unknowns − rank). Rubric: a correct plain-language meaning (dimension of the span of the columns, equal to that of the rows) without the word matrix; existence tied to full row rank or the rank test with b appended; uniqueness tied to full column rank and nullity.</p>"
},
K2: {
  "statement": "**K2 · Checkpoint · gate — one reduction, every answer.** For \\(C=\\begin{pmatrix}1&0&2&-1\\\\2&1&3&0\\\\0&1&-1&2\\end{pmatrix}\\) and \\(b=(1,3,1)\\), reduce \\([C\\mid b]\\) to RREF. Give the rank, the complete solution, a basis of each of the four fundamental subspaces, and check both dimension counts.",
  "plain": "Reduce [C|b]: R₂←R₂−2R₁ gives (0,1,−1,2|1); R₃←R₃−R₂ gives a zero row. RREF rows (1,0,2,−1|1), (0,1,−1,2|1), (0,0,0,0|0). Rank 2; pivot columns 1 and 2; free columns 3 and 4; consistent. Complete solution: x=(1,1,0,0)+s(−2,1,1,0)+t(1,−2,0,1). Bases: C(C) from columns 1 and 2 of C, (1,2,0) and (0,1,1); row space (1,0,2,−1) and (0,1,−1,2); N(C) as above; N(Cᵀ) spanned by (2,−1,1), since 2·row 1 − row 2 + row 3 = 0. Check b: 2·1−3+1=0. Dimension counts: 2+2=4 in ℝ⁴ and 2+1=3 in ℝ³. Rubric: the reduction with each operation; rank, pivot and free columns; x_p and both null vectors checked; all four bases with the column space taken from C; both dimension counts.",
  "solution": "<p>Reduce [C|b]: R₂←R₂−2R₁ gives (0,1,−1,2|1); R₃←R₃−R₂ gives a zero row. RREF rows (1,0,2,−1|1), (0,1,−1,2|1), (0,0,0,0|0). Rank 2; pivot columns 1 and 2; free columns 3 and 4; consistent. Complete solution: x=(1,1,0,0)+s(−2,1,1,0)+t(1,−2,0,1). Bases: C(C) from columns 1 and 2 of C, (1,2,0) and (0,1,1); row space (1,0,2,−1) and (0,1,−1,2); N(C) as above; N(Cᵀ) spanned by (2,−1,1), since 2·row 1 − row 2 + row 3 = 0. Check b: 2·1−3+1=0. Dimension counts: 2+2=4 in ℝ⁴ and 2+1=3 in ℝ³. Rubric: the reduction with each operation; rank, pivot and free columns; x_p and both null vectors checked; all four bases with the column space taken from C; both dimension counts.</p>",
  "fields": [
    {
      "id": "rank",
      "label": "rank",
      "type": "num",
      "ans": 2
    },
    {
      "id": "xp",
      "label": "particular solution (free variables 0)",
      "type": "vec",
      "ans": [
        1,
        1,
        0,
        0
      ]
    },
    {
      "id": "left",
      "label": "left-null basis vector",
      "type": "vec",
      "ans": [
        2,
        -1,
        1
      ]
    }
  ],
  "hints": {
    "rank": "After R₂−2R₁, row 3 equals the new row 2.",
    "xp": "Set x₃=x₄=0 and read x₁, x₂ from the right-hand column of the RREF.",
    "left": "Solve y₁(1,0,2,−1)+y₂(2,1,3,0)+y₃(0,1,−1,2)=0, starting from the first two coordinates."
  }
},
K3: {
  "statement": "**K3 · Checkpoint · gate — trivial null space means invertible.** Prove, without quoting the invertible matrix theorem, that an \\(n\\times n\\) matrix \\(A\\) with \\(N(A)=\\{0\\}\\) has an inverse. Say where you use that \\(A\\) is square.",
  "plain": "Suppose A is n×n with N(A)={0}. Reduce A to its RREF R. Row operations preserve the null space (Lemma 5), so Rx=0 has only x=0; hence R has no free columns, and every one of the n columns is a pivot column. Because A is square, n pivots in n columns and n rows put a pivot in every row and every column, so R=I. Writing the operations as elementary matrices, E_k⋯E₁A=I. Each E_i is invertible, so A=E₁⁻¹⋯E_k⁻¹ is a product of invertible matrices and hence invertible, with A⁻¹=E_k⋯E₁. Squareness is used when \"every column has a pivot\" becomes \"R=I\": for a tall matrix, n pivots leave zero rows at the bottom, and R is not the identity. Rubric: null space preserved under row operations; no free columns hence n pivots; squareness used explicitly to get R=I; the elementary-matrix product giving an explicit two-sided inverse.",
  "solution": "<p>Suppose A is n×n with N(A)={0}. Reduce A to its RREF R. Row operations preserve the null space (Lemma 5), so Rx=0 has only x=0; hence R has no free columns, and every one of the n columns is a pivot column. Because A is square, n pivots in n columns and n rows put a pivot in every row and every column, so R=I. Writing the operations as elementary matrices, E_k⋯E₁A=I. Each E_i is invertible, so A=E₁⁻¹⋯E_k⁻¹ is a product of invertible matrices and hence invertible, with A⁻¹=E_k⋯E₁. Squareness is used when \"every column has a pivot\" becomes \"R=I\": for a tall matrix, n pivots leave zero rows at the bottom, and R is not the identity. Rubric: null space preserved under row operations; no free columns hence n pivots; squareness used explicitly to get R=I; the elementary-matrix product giving an explicit two-sided inverse.</p>"
},
K4: {
  "statement": "**K4 · Checkpoint · gate — debug a solver.** A colleague's `lu_nopivot(A, tol)` raises an error whenever a pivot has absolute value below `tol` and otherwise eliminates without swaps. It fails on \\(\\begin{pmatrix}0&1\\\\1&1\\end{pmatrix}\\) and returns an inaccurate solution for \\(\\begin{pmatrix}10^{-12}&1\\\\1&1\\end{pmatrix}\\) with `tol=1e-15`. Explain both failures, state the fix, and write three regression tests with their expected outcomes.",
  "plain": "First failure: [[0,1],[1,1]] is invertible, but its first pivot is exactly 0, so a no-swap elimination must stop; the error is raised because the algorithm never considers a row exchange. Second failure: [[10⁻¹²,1],[1,1]] passes the test (10⁻¹²>10⁻¹⁵), but the multiplier 10¹² makes the growth factor about 10¹², so rounding swamps the second row and the solution loses about twelve digits although the matrix is well conditioned (κ∞≈4). Fix: partial pivoting, swapping in the largest absolute entry of the column at each step, so every multiplier is at most 1. Regression tests: (1) [[0,1],[1,1]] with b=(1,2) returns (1,1) to rounding; (2) [[10⁻¹²,1],[1,1]] with b=(1,2) returns x with relative error at rounding level (about 10⁻¹⁵) and every |ℓ|≤1; (3) a singular matrix such as [[1,2],[2,4]] is reported singular (a zero pivot after pivoting) rather than returning numbers. Rubric: both failures explained (zero pivot without swaps; growth from a tiny pivot on a well-conditioned matrix); partial pivoting as the fix with the multiplier bound; three concrete tests with expected outcomes.",
  "solution": "<p>First failure: [[0,1],[1,1]] is invertible, but its first pivot is exactly 0, so a no-swap elimination must stop; the error is raised because the algorithm never considers a row exchange. Second failure: [[10⁻¹²,1],[1,1]] passes the test (10⁻¹²&gt;10⁻¹⁵), but the multiplier 10¹² makes the growth factor about 10¹², so rounding swamps the second row and the solution loses about twelve digits although the matrix is well conditioned (κ∞≈4). Fix: partial pivoting, swapping in the largest absolute entry of the column at each step, so every multiplier is at most 1. Regression tests: (1) [[0,1],[1,1]] with b=(1,2) returns (1,1) to rounding; (2) [[10⁻¹²,1],[1,1]] with b=(1,2) returns x with relative error at rounding level (about 10⁻¹⁵) and every |ℓ|≤1; (3) a singular matrix such as [[1,2],[2,4]] is reported singular (a zero pivot after pivoting) rather than returning numbers. Rubric: both failures explained (zero pivot without swaps; growth from a tiny pivot on a well-conditioned matrix); partial pivoting as the fix with the multiplier bound; three concrete tests with expected outcomes.</p>"
},
K5: {
  "statement": "**K5 · Checkpoint · gate — a reproducible rank claim.** Someone reports that a \\(768\\times768\\) weight matrix \"has rank 400\". State what else they must report for that to be reproducible, and what it would and would not imply about the layer's capacity.",
  "plain": "They must report: whether \"rank 400\" is exact or numerical; the method (singular values or pivoted QR); the tolerance and whether it is absolute or relative to the largest singular value; the dtype; and ideally the singular-value spectrum near the cutoff, so readers can see whether there is a clear gap. If it is numerical rank 400 at tolerance τ, then the best rank-400 approximation has operator-norm error σ₄₀₁≤τ and Frobenius error at most √368·τ, which may or may not be small relative to the matrix. If it is exact rank 400, the layer's outputs lie in a 400-dimensional subspace and a 368-dimensional space of inputs is sent to zero. Neither statement alone shows what the layer can compute in the network, which depends on its inputs, nonlinearities, and the task. Rubric: exact versus numerical rank distinguished; method, tolerance, dtype and spectrum requested; correct approximation-error consequences of numerical rank; correct image and null-space consequences of exact rank; a caution about capacity.",
  "solution": "<p>They must report: whether \"rank 400\" is exact or numerical; the method (singular values or pivoted QR); the tolerance and whether it is absolute or relative to the largest singular value; the dtype; and ideally the singular-value spectrum near the cutoff, so readers can see whether there is a clear gap. If it is numerical rank 400 at tolerance τ, then the best rank-400 approximation has operator-norm error σ₄₀₁≤τ and Frobenius error at most √368·τ, which may or may not be small relative to the matrix. If it is exact rank 400, the layer's outputs lie in a 400-dimensional subspace and a 368-dimensional space of inputs is sent to zero. Neither statement alone shows what the layer can compute in the network, which depends on its inputs, nonlinearities, and the task. Rubric: exact versus numerical rank distinguished; method, tolerance, dtype and spectrum requested; correct approximation-error consequences of numerical rank; correct image and null-space consequences of exact rank; a caution about capacity.</p>"
},
K6: {
  "statement": "**K6 · Checkpoint · gate — rank depends on the numbers you allow.** Work with arithmetic modulo 2, where \\(1+1=0\\). Reduce \\(\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}\\) modulo 2 and compare its rank with its rank over the real numbers. Which steps of this unit's elimination theory used properties of real numbers, and which carry over to any number system in which every nonzero element has a reciprocal?",
  "plain": "Modulo 2, −1=1, so the matrix becomes [[1,1],[1,1]]; R₂←R₂−R₁ gives a zero row, so the rank is 1. Over the real numbers, R₂←R₂−R₁ gives (0,−2), a nonzero pivot, so the rank is 2. The theory of this unit used only addition, multiplication and division by nonzero elements: Theorem 4 needs reciprocals of nonzero scalars (to undo scaling), Lemma 5, Theorem 6 (uniqueness of RREF), rank–nullity and the invertible matrix theorem all carry over to any field. What does not carry over: the argument that zᵀz=0 forces z=0 (Theorem 15's direct sums, and A14), since over ℤ₂ the nonzero vector (1,1) has (1,1)·(1,1)=1+1=0; and anything about size, such as pivoting by largest absolute value or condition numbers. Rubric: both ranks with the reductions; a correct list of steps that need only field operations; identification of the sum-of-squares argument and the size-based numerics as the parts that fail.",
  "solution": "<p>Modulo 2, −1=1, so the matrix becomes [[1,1],[1,1]]; R₂←R₂−R₁ gives a zero row, so the rank is 1. Over the real numbers, R₂←R₂−R₁ gives (0,−2), a nonzero pivot, so the rank is 2. The theory of this unit used only addition, multiplication and division by nonzero elements: Theorem 4 needs reciprocals of nonzero scalars (to undo scaling), Lemma 5, Theorem 6 (uniqueness of RREF), rank–nullity and the invertible matrix theorem all carry over to any field. What does not carry over: the argument that zᵀz=0 forces z=0 (Theorem 15's direct sums, and A14), since over ℤ₂ the nonzero vector (1,1) has (1,1)·(1,1)=1+1=0; and anything about size, such as pivoting by largest absolute value or condition numbers. Rubric: both ranks with the reductions; a correct list of steps that need only field operations; identification of the sum-of-squares argument and the size-based numerics as the parts that fail.</p>",
  "fields": [
    {
      "id": "ranks",
      "label": "rank modulo 2, rank over the reals",
      "type": "vec",
      "ans": [
        1,
        2
      ]
    }
  ],
  "hints": {
    "ranks": "Modulo 2, −1 equals 1, so the two rows become equal."
  }
}
});
