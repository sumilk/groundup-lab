/* Answers, checks and reference solutions for Linear Algebra Module 1. */
GU.answers("01-span", {
A1: {
  "statement": "**A1 · Foundation · paper — arithmetic and recipes.** Let \\(u=(4,1)\\), \\(v=(-1,2)\\). Compute \\(2u+3v\\), and find scalars \\(a,b\\) with \\(au+bv=(6,-3)\\). Check the second answer by substitution.",
  "plain": "2u+3v=(8,2)+(−3,6)=(5,8).\n\nFor au+bv=(6,−3), compare coordinates: 4a−b=6 and a+2b=−3. The first gives b=4a−6; substituting, a+8a−12=−3, so 9a=9, a=1 and b=−2.\n\nCheck by substitution: 1·(4,1)+(−2)·(−1,2)=(4+2, 1−4)=(6,−3). The pair u, v is independent (D=4·2−1·(−1)=9≠0), so this is the only recipe. Rubric: the combination computed coordinate by coordinate; a and b found by solving the two coordinate equations; the substitution check written out, showing au+bv equals the target.",
  "solution": "<p>2u+3v=(8,2)+(−3,6)=(5,8).</p><p>For au+bv=(6,−3), compare coordinates: 4a−b=6 and a+2b=−3. The first gives b=4a−6; substituting, a+8a−12=−3, so 9a=9, a=1 and b=−2.</p><p>Check by substitution: 1·(4,1)+(−2)·(−1,2)=(4+2, 1−4)=(6,−3). The pair u, v is independent (D=4·2−1·(−1)=9≠0), so this is the only recipe. Rubric: the combination computed coordinate by coordinate; a and b found by solving the two coordinate equations; the substitution check written out, showing au+bv equals the target.</p>",
  "fields": [
    {
      "id": "r",
      "label": "2u + 3v",
      "type": "vec",
      "ans": [
        5,
        8
      ]
    },
    {
      "id": "a",
      "label": "a",
      "type": "num",
      "ans": 1
    },
    {
      "id": "b",
      "label": "b",
      "type": "num",
      "ans": -2
    }
  ],
  "hints": {
    "r": "Scale first: 2(4,1)=(8,2) and 3(−1,2)=(−3,6). Then add coordinate by coordinate.",
    "a": "The coordinates give 4a−b=6 and a+2b=−3. Solve the first for b and substitute into the second.",
    "b": "Once a is known, b=4a−6 from the first equation."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — name the span in space.** For each list in \\(\\mathbb R^3\\), say whether its span is a point, a line, a plane, or all of \\(\\mathbb R^3\\), and give its dimension: (a) \\((2,-1,4)\\); (b) \\((1,0,2),(0,1,-1)\\); (c) \\((1,2,1),(2,4,2),(3,6,3)\\); (d) \\((1,0,1),(0,1,0),(1,1,2)\\). For (b), write the plane as \\(z=px+qy\\).",
  "plain": "(a) One nonzero vector spans the line {t(2,−1,4)}: dimension 1.\n\n(b) a(1,0,2)+b(0,1,−1)=(a,b,2a−b). Neither vector is a multiple of the other, so the span is a plane of dimension 2, namely z=2x−y: (p,q)=(2,−1).\n\n(c) (2,4,2)=2(1,2,1) and (3,6,3)=3(1,2,1), so by Theorem 1(3) both can be removed without changing the span. The span is the line through (1,2,1): dimension 1. Three generators, dimension one: the number of vectors is only an upper bound.\n\n(d) a(1,0,1)+b(0,1,0)+c(1,1,2)=(a+c, b+c, a+2c)=(x,y,z) gives c=z−x, a=2x−z, b=y−z+x for every target, so the list spans R³ and (by the uniqueness of that solution, Theorem 8) is a basis: dimension 3.\n\nRubric: (1) each object and dimension correct; (2) redundant generators in (c) removed with a reason; (3) (b) plane equation derived; (4) (d) spanning shown by solving for a general target.",
  "solution": "<p>(a) One nonzero vector spans the line {t(2,−1,4)}: dimension 1.</p><p>(b) a(1,0,2)+b(0,1,−1)=(a,b,2a−b). Neither vector is a multiple of the other, so the span is a plane of dimension 2, namely z=2x−y: (p,q)=(2,−1).</p><p>(c) (2,4,2)=2(1,2,1) and (3,6,3)=3(1,2,1), so by Theorem 1(3) both can be removed without changing the span. The span is the line through (1,2,1): dimension 1. Three generators, dimension one: the number of vectors is only an upper bound.</p><p>(d) a(1,0,1)+b(0,1,0)+c(1,1,2)=(a+c, b+c, a+2c)=(x,y,z) gives c=z−x, a=2x−z, b=y−z+x for every target, so the list spans R³ and (by the uniqueness of that solution, Theorem 8) is a basis: dimension 3.</p><p>Rubric: (1) each object and dimension correct; (2) redundant generators in (c) removed with a reason; (3) (b) plane equation derived; (4) (d) spanning shown by solving for a general target.</p>",
  "fields": [
    {
      "id": "s1",
      "label": "(a) span of (2,−1,4)",
      "type": "choice",
      "opts": [
        "point",
        "line",
        "plane",
        "all of R³"
      ],
      "ans": "line"
    },
    {
      "id": "d1",
      "label": "(a) dimension",
      "type": "num",
      "ans": 1
    },
    {
      "id": "s2",
      "label": "(b) span of (1,0,2),(0,1,−1)",
      "type": "choice",
      "opts": [
        "point",
        "line",
        "plane",
        "all of R³"
      ],
      "ans": "plane"
    },
    {
      "id": "d2",
      "label": "(b) dimension",
      "type": "num",
      "ans": 2
    },
    {
      "id": "pq",
      "label": "(b) (p, q) in z = px + qy",
      "type": "vec",
      "ans": [
        2,
        -1
      ]
    },
    {
      "id": "s3",
      "label": "(c) span of the three multiples",
      "type": "choice",
      "opts": [
        "point",
        "line",
        "plane",
        "all of R³"
      ],
      "ans": "line"
    },
    {
      "id": "d3",
      "label": "(c) dimension",
      "type": "num",
      "ans": 1
    },
    {
      "id": "s4",
      "label": "(d) span of (1,0,1),(0,1,0),(1,1,2)",
      "type": "choice",
      "opts": [
        "point",
        "line",
        "plane",
        "all of R³"
      ],
      "ans": "all of R³"
    },
    {
      "id": "d4",
      "label": "(d) dimension",
      "type": "num",
      "ans": 3
    }
  ],
  "hints": {
    "s1": "One nonzero vector: its multiples t(2,−1,4) form a set with one free parameter.",
    "d1": "Count free parameters in t(2,−1,4), not coordinates.",
    "s2": "Neither vector is a multiple of the other, so the span has two free parameters.",
    "d2": "Two independent generators form a basis of their span.",
    "pq": "A general combination is a(1,0,2)+b(0,1,−1)=(a,b,2a−b). Read z in terms of x=a and y=b.",
    "s3": "(2,4,2) and (3,6,3) are 2 and 3 times (1,2,1). Remove them with Theorem 1(3).",
    "d3": "After removing the redundant multiples, one nonzero vector remains.",
    "s4": "Write a(1,0,1)+b(0,1,0)+c(1,1,2)=(a+c, b+c, a+2c) and solve for a, b, c in terms of x, y, z.",
    "d4": "Three independent vectors in R³: use Theorem 12."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — reachable or not in space.** Decide whether \\((4,0,4)\\) and \\((1,2,3)\\) lie in \\(\\operatorname{span}\\{(1,1,0),(1,-1,2)\\}\\). Give the coefficients when a target is reachable, and name the equation that fails when it is not.",
  "plain": "A general combination is a(1,1,0)+b(1,−1,2)=(a+b, a−b, 2b).\n\n(4,0,4): 2b=4 gives b=2, and a+b=4 gives a=2. The remaining equation a−b=0 holds, so (4,0,4)=2(1,1,0)+2(1,−1,2)=(4,0,4). Reachable, with coefficients (2,2).\n\n(1,2,3): 2b=3 gives b=3/2 and a+b=1 gives a=−1/2. The second coordinate would then be a−b=−2, not 2. The equation a−b=2 fails, so (1,2,3) is not in the span. Geometrically, the span is a plane through the origin in R³ and this point lies off it.\n\nRubric: (1) general combination written; (2) reachable target solved and checked in every coordinate; (3) the failing equation named for the unreachable target.",
  "solution": "<p>A general combination is a(1,1,0)+b(1,−1,2)=(a+b, a−b, 2b).</p><p>(4,0,4): 2b=4 gives b=2, and a+b=4 gives a=2. The remaining equation a−b=0 holds, so (4,0,4)=2(1,1,0)+2(1,−1,2)=(4,0,4). Reachable, with coefficients (2,2).</p><p>(1,2,3): 2b=3 gives b=3/2 and a+b=1 gives a=−1/2. The second coordinate would then be a−b=−2, not 2. The equation a−b=2 fails, so (1,2,3) is not in the span. Geometrically, the span is a plane through the origin in R³ and this point lies off it.</p><p>Rubric: (1) general combination written; (2) reachable target solved and checked in every coordinate; (3) the failing equation named for the unreachable target.</p>",
  "fields": [
    {
      "id": "p",
      "label": "(4,0,4) in the span?",
      "type": "choice",
      "opts": [
        "yes",
        "no"
      ],
      "ans": "yes"
    },
    {
      "id": "pc",
      "label": "coefficients for (4,0,4)",
      "type": "vec",
      "ans": [
        2,
        2
      ]
    },
    {
      "id": "q",
      "label": "(1,2,3) in the span?",
      "type": "choice",
      "opts": [
        "yes",
        "no"
      ],
      "ans": "no"
    }
  ],
  "hints": {
    "p": "Write a(1,1,0)+b(1,−1,2)=(a+b, a−b, 2b) and compare with the target one coordinate at a time.",
    "pc": "The third coordinate gives 2b=4 directly; then use a+b=4.",
    "q": "The third coordinate fixes b=3/2 and the first then fixes a. Test the second coordinate."
  }
},
A4: {
  "statement": "**A4 · Foundation · paper — exhibit the redundancy.** Decide independence for each list, giving a nonzero dependency relation when one exists:\n\n| Case | Vectors |\n|---|---|\n| (a) | \\((3,-1),(-6,2)\\) |\n| (b) | \\((1,1,1),(1,2,3),(2,3,4)\\) |\n| (c) | \\((1,0,2),(0,3,1),(0,0,5)\\) |\n| (d) | \\((1,2),(3,1),(0,5)\\) |\n| (e) | \\((1,2,0),(0,0,0),(3,1,4)\\) |",
  "plain": "(a) Dependent: (−6,2)=−2(3,−1), so 2(3,−1)+1(−6,2)=0. Coefficients (2,1) or any nonzero multiple.\n\n(b) Dependent: (1,1,1)+(1,2,3)=(2,3,4), so the relation is (1,1,−1). Every pair in this list is independent; the redundancy lives in the triple.\n\n(c) Independent. In a(1,0,2)+b(0,3,1)+c(0,0,5)=0 the first coordinate gives a=0, the second 3b=0, and the third 2a+b+5c=5c=0.\n\n(d) Dependent without computation: three vectors in R² (Corollary 5). Solving a+3b=0 and 2a+b+5c=0 with b=1 gives a=−3, c=1, and −3(1,2)+(3,1)+(0,5)=(0,0).\n\n(e) Dependent: 0·(1,2,0)+1·(0,0,0)+0·(3,1,4)=0 has a nonzero coefficient. The coefficients on the other two are forced to be zero because (1,2,0) and (3,1,4) are independent, so the relation is (0,1,0) up to scale, not (1,1,1).\n\nRubric: (1) each verdict correct; (2) each relation is an explicit nonzero coefficient list that checks; (3) (d) uses the dimension bound; (4) (e) explains why the other coefficients must vanish.",
  "solution": "<p>(a) Dependent: (−6,2)=−2(3,−1), so 2(3,−1)+1(−6,2)=0. Coefficients (2,1) or any nonzero multiple.</p><p>(b) Dependent: (1,1,1)+(1,2,3)=(2,3,4), so the relation is (1,1,−1). Every pair in this list is independent; the redundancy lives in the triple.</p><p>(c) Independent. In a(1,0,2)+b(0,3,1)+c(0,0,5)=0 the first coordinate gives a=0, the second 3b=0, and the third 2a+b+5c=5c=0.</p><p>(d) Dependent without computation: three vectors in R² (Corollary 5). Solving a+3b=0 and 2a+b+5c=0 with b=1 gives a=−3, c=1, and −3(1,2)+(3,1)+(0,5)=(0,0).</p><p>(e) Dependent: 0·(1,2,0)+1·(0,0,0)+0·(3,1,4)=0 has a nonzero coefficient. The coefficients on the other two are forced to be zero because (1,2,0) and (3,1,4) are independent, so the relation is (0,1,0) up to scale, not (1,1,1).</p><p>Rubric: (1) each verdict correct; (2) each relation is an explicit nonzero coefficient list that checks; (3) (d) uses the dimension bound; (4) (e) explains why the other coefficients must vanish.</p>",
  "fields": [
    {
      "id": "a",
      "label": "(a)",
      "type": "choice",
      "opts": [
        "independent",
        "dependent"
      ],
      "ans": "dependent"
    },
    {
      "id": "ac",
      "label": "(a) relation coefficients",
      "type": "ratio",
      "ans": [
        2,
        1
      ]
    },
    {
      "id": "b",
      "label": "(b)",
      "type": "choice",
      "opts": [
        "independent",
        "dependent"
      ],
      "ans": "dependent"
    },
    {
      "id": "bc",
      "label": "(b) relation coefficients",
      "type": "ratio",
      "ans": [
        1,
        1,
        -1
      ]
    },
    {
      "id": "c",
      "label": "(c)",
      "type": "choice",
      "opts": [
        "independent",
        "dependent"
      ],
      "ans": "independent"
    },
    {
      "id": "d",
      "label": "(d)",
      "type": "choice",
      "opts": [
        "independent",
        "dependent"
      ],
      "ans": "dependent"
    },
    {
      "id": "dc",
      "label": "(d) relation coefficients",
      "type": "ratio",
      "ans": [
        -3,
        1,
        1
      ]
    },
    {
      "id": "e",
      "label": "(e)",
      "type": "choice",
      "opts": [
        "independent",
        "dependent"
      ],
      "ans": "dependent"
    },
    {
      "id": "ec",
      "label": "(e) relation coefficients",
      "type": "ratio",
      "ans": [
        0,
        1,
        0
      ]
    }
  ],
  "hints": {
    "a": "Compare (−6,2) with (3,−1): is one a scalar multiple of the other?",
    "ac": "(−6,2)=−2(3,−1). Move everything to one side; any nonzero multiple of the relation is accepted.",
    "b": "Add the first two vectors and compare with the third.",
    "bc": "(1,1,1)+(1,2,3)=(2,3,4). Write that as a combination equal to zero.",
    "c": "The matrix of columns is triangular: solve the zero combination from the last coordinate up.",
    "d": "Three vectors in R²: Corollary 5 settles the verdict before any arithmetic.",
    "dc": "Solve a+3b=0 and 2a+b+5c=0. Choose b=1; the first equation gives a, the second gives c.",
    "e": "One vector in the list is the zero vector.",
    "ec": "Put coefficient 1 on the zero vector. The other two vectors are independent, so their coefficients are forced to vanish."
  }
},
A5: {
  "statement": "**A5 · Foundation · paper — a parameter in three dimensions.** Find every \\(t\\) for which \\((1,2,t)\\), \\((0,2,1)\\), \\((t,0,1)\\) are dependent. For the larger such \\(t\\), give a dependency relation.",
  "plain": "Write a(1,2,t)+b(0,2,1)+c(t,0,1)=0 by coordinates: a+ct=0, 2a+2b=0, ta+b+c=0.\n\nThe first gives a=−ct and the second b=−a=ct. Substituting into the third: −ct²+ct+c=c(1+t−t²)=0. If 1+t−t²≠0 then c=0, hence a=b=0, and the list is independent. If t²−t−1=0, that is t=(1±√5)/2, then c is free and c=1 gives the nonzero relation (a,b,c)=(−t,t,1).\n\nThe larger root is t=(1+√5)/2≈1.618, with relation (−(1+√5)/2, (1+√5)/2, 1). Check the third coordinate: t·(−t)+t+1=−(t²−t−1)=0.\n\nRubric: (1) reduces the system to c(1+t−t²)=0; (2) both roots found; (3) explains independence for other t; (4) relation for the larger root checked.",
  "solution": "<p>Write a(1,2,t)+b(0,2,1)+c(t,0,1)=0 by coordinates: a+ct=0, 2a+2b=0, ta+b+c=0.</p><p>The first gives a=−ct and the second b=−a=ct. Substituting into the third: −ct²+ct+c=c(1+t−t²)=0. If 1+t−t²≠0 then c=0, hence a=b=0, and the list is independent. If t²−t−1=0, that is t=(1±√5)/2, then c is free and c=1 gives the nonzero relation (a,b,c)=(−t,t,1).</p><p>The larger root is t=(1+√5)/2≈1.618, with relation (−(1+√5)/2, (1+√5)/2, 1). Check the third coordinate: t·(−t)+t+1=−(t²−t−1)=0.</p><p>Rubric: (1) reduces the system to c(1+t−t²)=0; (2) both roots found; (3) explains independence for other t; (4) relation for the larger root checked.</p>",
  "fields": [
    {
      "id": "t",
      "label": "all such t",
      "type": "set",
      "ans": [
        1.618033988749895,
        -0.6180339887498949
      ]
    },
    {
      "id": "rel",
      "label": "relation for the larger t",
      "type": "ratio",
      "ans": [
        -1.618033988749895,
        1.618033988749895,
        1
      ]
    }
  ],
  "hints": {
    "t": "From a+ct=0 and 2a+2b=0 express a and b through c, then substitute into ta+b+c=0. The roots involve sqrt(5).",
    "rel": "Take c=1: then a=−t and b=t. Enter numbers such as -(1+sqrt(5))/2."
  }
},
A6: {
  "statement": "**A6 · Core · paper — the subspace test.** Which subsets of \\(\\mathbb R^3\\) are subspaces: (a) \\(x-2y+3z=0\\); (b) \\(x^2=y^2\\); (c) \\(x+y=z+1\\); (d) \\(\\{(s+t,s,t):s,t\\in\\mathbb R\\}\\); (e) \\(x\\ge y\\)? For a yes, check all three conditions. For a no, give a specific failed condition and a counterexample.",
  "plain": "(a) Subspace. 0 satisfies it; if x−2y+3z=0 and x'−2y'+3z'=0, adding gives the equation for the sum; multiplying by c gives it for the multiple.\n\n(b) Not a subspace. It is the union of the planes x=y and x=−y. It contains 0 and is closed under scaling, but (1,1,0) and (1,−1,0) are in it while their sum (2,0,0) has x²=4≠0=y². Closure under addition fails.\n\n(c) Not a subspace. 0 fails it, since 0+0=0+1 is false. It is an affine plane.\n\n(d) Subspace: {(s+t,s,t)}=span{(1,1,0),(1,0,1)}, and every span is a subspace (Theorem 6).\n\n(e) Not a subspace. It contains 0 and is closed under addition, but (1,0,0) satisfies 1≥0 while −1·(1,0,0)=(−1,0,0) does not. Closure under scaling by negative numbers fails.\n\nRubric: (1) all five verdicts correct; (2) each yes checks all three conditions; (3) each no names the failed condition with a concrete counterexample; (4) (d) is recognized as a span.",
  "solution": "<p>(a) Subspace. 0 satisfies it; if x−2y+3z=0 and x'−2y'+3z'=0, adding gives the equation for the sum; multiplying by c gives it for the multiple.</p><p>(b) Not a subspace. It is the union of the planes x=y and x=−y. It contains 0 and is closed under scaling, but (1,1,0) and (1,−1,0) are in it while their sum (2,0,0) has x²=4≠0=y². Closure under addition fails.</p><p>(c) Not a subspace. 0 fails it, since 0+0=0+1 is false. It is an affine plane.</p><p>(d) Subspace: {(s+t,s,t)}=span{(1,1,0),(1,0,1)}, and every span is a subspace (Theorem 6).</p><p>(e) Not a subspace. It contains 0 and is closed under addition, but (1,0,0) satisfies 1≥0 while −1·(1,0,0)=(−1,0,0) does not. Closure under scaling by negative numbers fails.</p><p>Rubric: (1) all five verdicts correct; (2) each yes checks all three conditions; (3) each no names the failed condition with a concrete counterexample; (4) (d) is recognized as a span.</p>",
  "fields": [
    {
      "id": "a",
      "label": "(a) x − 2y + 3z = 0",
      "type": "choice",
      "opts": [
        "subspace",
        "not a subspace"
      ],
      "ans": "subspace"
    },
    {
      "id": "b",
      "label": "(b) x² = y²",
      "type": "choice",
      "opts": [
        "subspace",
        "not a subspace"
      ],
      "ans": "not a subspace"
    },
    {
      "id": "c",
      "label": "(c) x + y = z + 1",
      "type": "choice",
      "opts": [
        "subspace",
        "not a subspace"
      ],
      "ans": "not a subspace"
    },
    {
      "id": "d",
      "label": "(d) {(s+t, s, t)}",
      "type": "choice",
      "opts": [
        "subspace",
        "not a subspace"
      ],
      "ans": "subspace"
    },
    {
      "id": "e",
      "label": "(e) x ≥ y",
      "type": "choice",
      "opts": [
        "subspace",
        "not a subspace"
      ],
      "ans": "not a subspace"
    }
  ],
  "hints": {
    "a": "A homogeneous linear equation: add two solutions and scale one.",
    "b": "x²=y² means x=y or x=−y. Add one point from each of those two planes.",
    "c": "Test the zero vector before anything else.",
    "d": "This set is s(1,1,0)+t(1,0,1): a span.",
    "e": "Take a point with x>y and multiply it by −1."
  }
},
A7: {
  "statement": "**A7 · Foundation · paper — coordinates in a 3×3 basis.** Show that \\(B=((1,0,1),(2,1,0),(0,1,1))\\) is a basis of \\(\\mathbb R^3\\) and find \\([v]_B\\) for \\(v=(3,3,4)\\). Reconstruct \\(v\\) from your answer.",
  "plain": "Write c₁(1,0,1)+c₂(2,1,0)+c₃(0,1,1)=(x,y,z): c₁+2c₂=x, c₂+c₃=y, c₁+c₃=z.\n\nIndependence: with x=y=z=0, c₁=−2c₂ and c₃=−c₂, so c₁+c₃=−3c₂=0 and all three vanish. Three independent vectors in R³ form a basis (Theorem 12).\n\nFor v=(3,3,4): c₁=3−2c₂ and c₃=3−c₂, so c₁+c₃=6−3c₂=4 and c₂=2/3. Then c₁=5/3 and c₃=7/3, so [v]_B=(5/3, 2/3, 7/3).\n\nReconstruction: (5/3)(1,0,1)+(2/3)(2,1,0)+(7/3)(0,1,1)=(5/3+4/3, 2/3+7/3, 5/3+7/3)=(3,3,4).\n\nRubric: (1) proves independence from the zero combination, not by assertion; (2) cites Theorem 12 (or proves spanning) for the basis claim; (3) coordinates solved correctly; (4) reconstruction shown.",
  "solution": "<p>Write c₁(1,0,1)+c₂(2,1,0)+c₃(0,1,1)=(x,y,z): c₁+2c₂=x, c₂+c₃=y, c₁+c₃=z.</p><p>Independence: with x=y=z=0, c₁=−2c₂ and c₃=−c₂, so c₁+c₃=−3c₂=0 and all three vanish. Three independent vectors in R³ form a basis (Theorem 12).</p><p>For v=(3,3,4): c₁=3−2c₂ and c₃=3−c₂, so c₁+c₃=6−3c₂=4 and c₂=2/3. Then c₁=5/3 and c₃=7/3, so [v]_B=(5/3, 2/3, 7/3).</p><p>Reconstruction: (5/3)(1,0,1)+(2/3)(2,1,0)+(7/3)(0,1,1)=(5/3+4/3, 2/3+7/3, 5/3+7/3)=(3,3,4).</p><p>Rubric: (1) proves independence from the zero combination, not by assertion; (2) cites Theorem 12 (or proves spanning) for the basis claim; (3) coordinates solved correctly; (4) reconstruction shown.</p>",
  "fields": [
    {
      "id": "c",
      "label": "[v]_B",
      "type": "vec",
      "ans": [
        1.6666666666666667,
        0.6666666666666666,
        2.3333333333333335
      ]
    }
  ],
  "hints": {
    "c": "Coordinates give c₁+2c₂=3, c₂+c₃=3, c₁+c₃=4. Express c₁ and c₃ through c₂; the answers are thirds, so enter e.g. 5/3."
  }
},
A8: {
  "statement": "**A8 · Foundation · paper — extend to a basis.** Extend the independent list \\((1,2,0,1),(0,1,1,0)\\) to a basis of \\(\\mathbb R^4\\) by trying \\(e_1,e_2,e_3,e_4\\) in order and appending each one that lies outside the current span. Which standard basis vectors are appended?",
  "plain": "Start with u₁=(1,2,0,1), u₂=(0,1,1,0). A combination au₁+bu₂=(a, 2a+b, b, a).\n\ne₁=(1,0,0,0): the first coordinate needs a=1 but the fourth needs a=0, so e₁ is outside the span. Append it (Lemma 3 keeps the list independent).\n\ne₂=(0,1,0,0): now au₁+bu₂+ce₁=(a+c, 2a+b, b, a). The fourth and third coordinates force a=b=0, and then the second coordinate is 0, not 1. Outside the span: append it.\n\nThe list u₁,u₂,e₁,e₂ has four independent vectors in the four-dimensional R⁴, so by Theorem 12 it is a basis. e₃ and e₄ therefore lie in its span and are skipped. Appended: e₁ and e₂.\n\nRubric: (1) each candidate tested for membership with a reason; (2) uses Lemma 3 for independence; (3) stops correctly using Theorem 12.",
  "solution": "<p>Start with u₁=(1,2,0,1), u₂=(0,1,1,0). A combination au₁+bu₂=(a, 2a+b, b, a).</p><p>e₁=(1,0,0,0): the first coordinate needs a=1 but the fourth needs a=0, so e₁ is outside the span. Append it (Lemma 3 keeps the list independent).</p><p>e₂=(0,1,0,0): now au₁+bu₂+ce₁=(a+c, 2a+b, b, a). The fourth and third coordinates force a=b=0, and then the second coordinate is 0, not 1. Outside the span: append it.</p><p>The list u₁,u₂,e₁,e₂ has four independent vectors in the four-dimensional R⁴, so by Theorem 12 it is a basis. e₃ and e₄ therefore lie in its span and are skipped. Appended: e₁ and e₂.</p><p>Rubric: (1) each candidate tested for membership with a reason; (2) uses Lemma 3 for independence; (3) stops correctly using Theorem 12.</p>",
  "fields": [
    {
      "id": "idx",
      "label": "indices j of the appended e_j",
      "type": "set",
      "ans": [
        1,
        2
      ]
    }
  ],
  "hints": {
    "idx": "e₁ fails the fourth coordinate test for a(1,2,0,1)+b(0,1,1,0). After two appends the list has four independent vectors; Theorem 12 says it already spans R⁴."
  }
},
A9: {
  "statement": "**A9 · Foundation · paper — angle and Cauchy–Schwarz.** For \\(u=(1,2,2)\\) and \\(v=(2,-1,2)\\), compute \\(u\\cdot v\\), \\(\\|u\\|\\), \\(\\|v\\|\\) and \\(\\cos\\theta\\), and check the Cauchy–Schwarz inequality. Then find a nonzero vector orthogonal to both.",
  "plain": "u·v=2−2+4=4, ‖u‖=√(1+4+4)=3, ‖v‖=√(4+1+4)=3. So cos θ=4/(3·3)=4/9, and θ≈63.6°.\n\nCauchy–Schwarz: |u·v|=4 ≤ ‖u‖‖v‖=9. The inequality is strict because u and v are not multiples of each other.\n\nAn orthogonal vector (x,y,z) solves x+2y+2z=0 and 2x−y+2z=0. Subtracting twice the first from the second gives −5y−2z=0; take y=2, z=−5, then x=−2y−2z=6. So n=(6,2,−5) (any nonzero multiple): u·n=6+4−10=0 and v·n=12−2−10=0.\n\nRubric: (1) correct dot product, lengths and cosine; (2) Cauchy–Schwarz checked numerically; (3) orthogonal vector derived from two equations and checked.",
  "solution": "<p>u·v=2−2+4=4, ‖u‖=√(1+4+4)=3, ‖v‖=√(4+1+4)=3. So cos θ=4/(3·3)=4/9, and θ≈63.6°.</p><p>Cauchy–Schwarz: |u·v|=4 ≤ ‖u‖‖v‖=9. The inequality is strict because u and v are not multiples of each other.</p><p>An orthogonal vector (x,y,z) solves x+2y+2z=0 and 2x−y+2z=0. Subtracting twice the first from the second gives −5y−2z=0; take y=2, z=−5, then x=−2y−2z=6. So n=(6,2,−5) (any nonzero multiple): u·n=6+4−10=0 and v·n=12−2−10=0.</p><p>Rubric: (1) correct dot product, lengths and cosine; (2) Cauchy–Schwarz checked numerically; (3) orthogonal vector derived from two equations and checked.</p>",
  "fields": [
    {
      "id": "vals",
      "label": "u·v, ‖u‖, ‖v‖",
      "type": "vec",
      "ans": [
        4,
        3,
        3
      ]
    },
    {
      "id": "cos",
      "label": "cos θ",
      "type": "num",
      "ans": 0.4444444444444444
    },
    {
      "id": "n",
      "label": "a vector orthogonal to both",
      "type": "ratio",
      "ans": [
        6,
        2,
        -5
      ]
    }
  ],
  "hints": {
    "vals": "u·v=1·2+2·(−1)+2·2. Each length is the square root of a sum of three squares; both are perfect squares.",
    "cos": "Divide u·v by the product of the two lengths.",
    "n": "Solve x+2y+2z=0 and 2x−y+2z=0. Eliminate x, choose y, then solve for z and x."
  }
},
A10: {
  "statement": "**A10 · Foundation · paper — split a vector.** In \\(\\mathbb R^3\\), let \\(U=\\{x+y+z=0\\}\\) and \\(Y=\\operatorname{span}\\{(1,1,1)\\}\\). Show that \\(\\mathbb R^3=U\\oplus Y\\) and write \\((3,0,0)\\) as \\(u+w\\) with \\(u\\in U\\), \\(w\\in Y\\).",
  "plain": "U∩Y={0}: a vector t(1,1,1) in U has coordinate sum 3t=0, so t=0. By Theorem 15 the sum U+Y is direct, and by Theorem 16 its dimension is 2+1−0=3, so U⊕Y=R³ (Theorem 13).\n\nTo split (3,0,0): w=t(1,1,1) and u=(3,0,0)−w must satisfy 3−3t=0, so t=1. Then w=(1,1,1) and u=(2,−1,−1), whose coordinates sum to 0. In general w=((x+y+z)/3)(1,1,1).\n\nRubric: (1) shows U∩Y={0} explicitly; (2) uses Theorems 15, 16 and 13 (or a direct argument) for U⊕Y=R³; (3) correct u and w with a check that u∈U.",
  "solution": "<p>U∩Y={0}: a vector t(1,1,1) in U has coordinate sum 3t=0, so t=0. By Theorem 15 the sum U+Y is direct, and by Theorem 16 its dimension is 2+1−0=3, so U⊕Y=R³ (Theorem 13).</p><p>To split (3,0,0): w=t(1,1,1) and u=(3,0,0)−w must satisfy 3−3t=0, so t=1. Then w=(1,1,1) and u=(2,−1,−1), whose coordinates sum to 0. In general w=((x+y+z)/3)(1,1,1).</p><p>Rubric: (1) shows U∩Y={0} explicitly; (2) uses Theorems 15, 16 and 13 (or a direct argument) for U⊕Y=R³; (3) correct u and w with a check that u∈U.</p>",
  "fields": [
    {
      "id": "u",
      "label": "u",
      "type": "vec",
      "ans": [
        2,
        -1,
        -1
      ]
    },
    {
      "id": "w",
      "label": "w",
      "type": "vec",
      "ans": [
        1,
        1,
        1
      ]
    }
  ],
  "hints": {
    "u": "u is what remains after subtracting w; check that its coordinates add to 0.",
    "w": "w=t(1,1,1). Choose t so that (3,0,0)−t(1,1,1) has coordinate sum zero."
  }
},
A11: {
  "statement": "**A11 · Core · paper — Taylor coordinates.** Show that \\(B=(1,\\ x-1,\\ (x-1)^2)\\) is a basis of \\(P_2\\) and find \\([2-x+3x^2]_B\\). Explain what the three coordinates are in calculus terms.",
  "plain": "Basis: in a+b(x−1)+c(x−1)²=0, the x² coefficient is c, so c=0; then the x coefficient is b, so b=0; then a=0. Three independent vectors in the three-dimensional P₂ form a basis (Theorem 12).\n\nExpand a+b(x−1)+c(x−1)²=(a−b+c)+(b−2c)x+cx² and match 2−x+3x²: c=3, b−6=−1 so b=5, a−5+3=2 so a=4. Hence [p]_B=(4,5,3).\n\nCheck: 4+5(x−1)+3(x−1)²=4+5x−5+3x²−6x+3=2−x+3x².\n\nIn calculus terms these are the Taylor coefficients at x=1: p(1)=4, p′(1)=−1+6=5, and p″(1)/2=6/2=3.\n\nRubric: (1) proves independence by matching powers from x² down; (2) invokes Theorem 12 or proves spanning; (3) correct coordinates with a reconstruction check; (4) identifies them as p(1), p′(1), p″(1)/2.",
  "solution": "<p>Basis: in a+b(x−1)+c(x−1)²=0, the x² coefficient is c, so c=0; then the x coefficient is b, so b=0; then a=0. Three independent vectors in the three-dimensional P₂ form a basis (Theorem 12).</p><p>Expand a+b(x−1)+c(x−1)²=(a−b+c)+(b−2c)x+cx² and match 2−x+3x²: c=3, b−6=−1 so b=5, a−5+3=2 so a=4. Hence [p]_B=(4,5,3).</p><p>Check: 4+5(x−1)+3(x−1)²=4+5x−5+3x²−6x+3=2−x+3x².</p><p>In calculus terms these are the Taylor coefficients at x=1: p(1)=4, p′(1)=−1+6=5, and p″(1)/2=6/2=3.</p><p>Rubric: (1) proves independence by matching powers from x² down; (2) invokes Theorem 12 or proves spanning; (3) correct coordinates with a reconstruction check; (4) identifies them as p(1), p′(1), p″(1)/2.</p>",
  "fields": [
    {
      "id": "c",
      "label": "[2 − x + 3x²]_B",
      "type": "vec",
      "ans": [
        4,
        5,
        3
      ]
    }
  ],
  "hints": {
    "c": "Expand a+b(x−1)+c(x−1)² and match the coefficients of x², then x, then 1. Or use p(1), p′(1), p″(1)/2."
  }
},
A12: {
  "statement": "**A12 · Core · paper — a coordinate change in three dimensions.** Let \\(B=((2,0,1),(1,1,0),(0,1,1))\\) and \\(Q=((1,0,0),(1,1,0),(1,1,1))\\). A vector has \\([v]_B=(1,-1,2)\\). Find \\(v\\) and \\([v]_Q\\), then write the matrix that converts every \\(B\\)-coordinate vector into \\(Q\\)-coordinates.",
  "plain": "v=B[v]_B=(2,0,1)−(1,1,0)+2(0,1,1)=(1,1,3).\n\nA combination of the columns of Q is (d+e+f, e+f, f). For v: f=3, e=1−3=−2, d=1−(−2)−3=0, so [v]_Q=(0,−2,3).\n\nThe conversion matrix Q⁻¹B has columns [b_j]_Q: (2,0,1) gives f=1, e=−1, d=2, so (2,−1,1); (1,1,0) gives (0,1,0); (0,1,1) gives f=1, e=0, d=−1, so (−1,0,1). As rows: [[2,0,−1],[−1,1,0],[1,0,1]].\n\nCheck: Q⁻¹B(1,−1,2)=(2−0−2, −1−1+0, 1+0+2)=(0,−2,3), matching the direct calculation. (B is a basis: a(2,0,1)+b(1,1,0)+c(0,1,1)=0 forces b=−2a, c=2a, then 3a=0.)\n\nRubric: (1) v computed; (2) [v]_Q solved by back-substitution; (3) conversion matrix columns are [b_j]_Q; (4) a consistency check of the matrix against [v]_Q.",
  "solution": "<p>v=B[v]_B=(2,0,1)−(1,1,0)+2(0,1,1)=(1,1,3).</p><p>A combination of the columns of Q is (d+e+f, e+f, f). For v: f=3, e=1−3=−2, d=1−(−2)−3=0, so [v]_Q=(0,−2,3).</p><p>The conversion matrix Q⁻¹B has columns [b_j]_Q: (2,0,1) gives f=1, e=−1, d=2, so (2,−1,1); (1,1,0) gives (0,1,0); (0,1,1) gives f=1, e=0, d=−1, so (−1,0,1). As rows: [[2,0,−1],[−1,1,0],[1,0,1]].</p><p>Check: Q⁻¹B(1,−1,2)=(2−0−2, −1−1+0, 1+0+2)=(0,−2,3), matching the direct calculation. (B is a basis: a(2,0,1)+b(1,1,0)+c(0,1,1)=0 forces b=−2a, c=2a, then 3a=0.)</p><p>Rubric: (1) v computed; (2) [v]_Q solved by back-substitution; (3) conversion matrix columns are [b_j]_Q; (4) a consistency check of the matrix against [v]_Q.</p>",
  "fields": [
    {
      "id": "v",
      "label": "v",
      "type": "vec",
      "ans": [
        1,
        1,
        3
      ]
    },
    {
      "id": "vc",
      "label": "[v]_Q",
      "type": "vec",
      "ans": [
        0,
        -2,
        3
      ]
    },
    {
      "id": "P",
      "label": "conversion matrix, rows left to right (9 entries)",
      "type": "vec",
      "ans": [
        2,
        0,
        -1,
        -1,
        1,
        0,
        1,
        0,
        1
      ]
    }
  ],
  "hints": {
    "v": "v=1·(2,0,1)−1·(1,1,0)+2·(0,1,1). Add coordinate by coordinate.",
    "vc": "d(1,0,0)+e(1,1,0)+f(1,1,1)=(d+e+f, e+f, f). Solve from the last coordinate up.",
    "P": "Column j is [b_j]_Q. Find the Q-coordinates of (2,0,1), (1,1,0) and (0,1,1), then read the matrix row by row."
  }
},
A13: {
  "statement": "**A13 · Core · paper — sum and intersection in four dimensions.** Let \\(U=\\operatorname{span}\\{(1,0,1,0),(0,1,0,1)\\}\\) and \\(Y=\\operatorname{span}\\{(1,1,1,1),(1,0,0,0)\\}\\) in \\(\\mathbb R^4\\). Find \\(\\dim U\\), \\(\\dim Y\\), \\(\\dim(U+Y)\\), \\(\\dim(U\\cap Y)\\), and a nonzero vector in \\(U\\cap Y\\). Check the numbers against Theorem 16.",
  "plain": "U: (1,0,1,0) and (0,1,0,1) are not multiples, so dim U=2. Y: (1,1,1,1) and (1,0,0,0) are not multiples, so dim Y=2.\n\nU+Y is spanned by all four generators (Theorem 14). Since (1,1,1,1)=(1,0,1,0)+(0,1,0,1), it is redundant, leaving (1,0,1,0),(0,1,0,1),(1,0,0,0). These are independent: a(1,0,1,0)+b(0,1,0,1)+c(1,0,0,0)=(a+c, b, a, b)=0 forces a=b=c=0. So dim(U+Y)=3.\n\nTheorem 16 gives dim(U∩Y)=2+2−3=1, and (1,1,1,1) lies in both U and Y, so U∩Y=span{(1,1,1,1)}.\n\nRubric: (1) dimensions of U and Y justified; (2) redundancy of (1,1,1,1) found and independence of the rest shown; (3) Theorem 16 used for the intersection with an explicit vector.",
  "solution": "<p>U: (1,0,1,0) and (0,1,0,1) are not multiples, so dim U=2. Y: (1,1,1,1) and (1,0,0,0) are not multiples, so dim Y=2.</p><p>U+Y is spanned by all four generators (Theorem 14). Since (1,1,1,1)=(1,0,1,0)+(0,1,0,1), it is redundant, leaving (1,0,1,0),(0,1,0,1),(1,0,0,0). These are independent: a(1,0,1,0)+b(0,1,0,1)+c(1,0,0,0)=(a+c, b, a, b)=0 forces a=b=c=0. So dim(U+Y)=3.</p><p>Theorem 16 gives dim(U∩Y)=2+2−3=1, and (1,1,1,1) lies in both U and Y, so U∩Y=span{(1,1,1,1)}.</p><p>Rubric: (1) dimensions of U and Y justified; (2) redundancy of (1,1,1,1) found and independence of the rest shown; (3) Theorem 16 used for the intersection with an explicit vector.</p>",
  "fields": [
    {
      "id": "dims",
      "label": "dim U, dim W, dim(U+W), dim(U∩W)",
      "type": "vec",
      "ans": [
        2,
        2,
        3,
        1
      ]
    },
    {
      "id": "z",
      "label": "nonzero vector in U∩W",
      "type": "ratio",
      "ans": [
        1,
        1,
        1,
        1
      ]
    }
  ],
  "hints": {
    "dims": "Notice that (1,1,1,1) is the sum of U's two generators. Then decide whether (1,0,0,0) lies in U.",
    "z": "One of Y's generators is already a combination of U's generators."
  }
},
A14: {
  "statement": "**A14 · Core · paper — sums of independent vectors.** Suppose \\(u,v,w\\) are independent in a vector space \\(V\\). Prove that \\(u+v,\\ v+w,\\ w+u\\) are independent, and that \\(u-v,\\ v-w,\\ w-u\\) are dependent.",
  "proof": true,
  "plain": "Independence of u+v, v+w, w+u. Suppose a(u+v)+b(v+w)+c(w+u)=0. Collect terms: (a+c)u+(a+b)v+(b+c)w=0. Because u, v, w are independent, every coefficient vanishes: a+c=0, a+b=0, b+c=0. Adding the three equations gives 2(a+b+c)=0, so a+b+c=0; subtracting each equation from this gives b=0, c=0 and a=0. Only the trivial combination reaches 0, so the list is independent. (Division by 2 is where real scalars matter.)\n\nDependence of u−v, v−w, w−u. Their sum is (u−v)+(v−w)+(w−u)=0, a relation with coefficients (1,1,1), none of them zero. So the list is dependent, and no independence hypothesis is even needed.\n\nRubric: (1) sets up an arbitrary zero combination of the new vectors, not a particular one; (2) regroups by u, v, w and invokes independence of the original list explicitly; (3) solves the 3×3 system correctly to get a=b=c=0; (4) exhibits the explicit relation (1,1,1) for the differences; (5) does not argue from pictures or pairwise non-parallelism.",
  "solution": "<p>Independence of u+v, v+w, w+u. Suppose a(u+v)+b(v+w)+c(w+u)=0. Collect terms: (a+c)u+(a+b)v+(b+c)w=0. Because u, v, w are independent, every coefficient vanishes: a+c=0, a+b=0, b+c=0. Adding the three equations gives 2(a+b+c)=0, so a+b+c=0; subtracting each equation from this gives b=0, c=0 and a=0. Only the trivial combination reaches 0, so the list is independent. (Division by 2 is where real scalars matter.)</p><p>Dependence of u−v, v−w, w−u. Their sum is (u−v)+(v−w)+(w−u)=0, a relation with coefficients (1,1,1), none of them zero. So the list is dependent, and no independence hypothesis is even needed.</p><p>Rubric: (1) sets up an arbitrary zero combination of the new vectors, not a particular one; (2) regroups by u, v, w and invokes independence of the original list explicitly; (3) solves the 3×3 system correctly to get a=b=c=0; (4) exhibits the explicit relation (1,1,1) for the differences; (5) does not argue from pictures or pairwise non-parallelism.</p>"
},
A15: {
  "statement": "**A15 · Core · paper — find the flaw.** A student argues: \"If \\(v_1,v_2,v_3\\) are dependent, then \\(c_1v_1+c_2v_2+c_3v_3=0\\) with some \\(c_i\\ne0\\). Dividing by \\(c_1\\) gives \\(v_1=-(c_2/c_1)v_2-(c_3/c_1)v_3\\), so \\(v_1\\) lies in the span of \\(v_2,v_3\\).\" Identify the first invalid step, give a dependent list in \\(\\mathbb R^2\\) for which the conclusion is false, and state the correct conclusion.",
  "proof": true,
  "plain": "The first invalid step is \"dividing by c₁\". Dependence guarantees that some coefficient is nonzero, not that c₁ is. The division is legal only after choosing an index j with c_j≠0, as in the proof of Theorem 1.\n\nCounterexample in R²: v₁=(1,0), v₂=(1,1), v₃=(2,2). The list is dependent, since 0·v₁+2v₂−v₃=0. Every relation has c₁=0: from a(1,0)+b(1,1)+c(2,2)=0 the second coordinate gives b+2c=0, and then the first gives a=0. And v₁ is not in span{v₂,v₃}, which is the line y=x. So the conclusion \"v₁ lies in the span of v₂, v₃\" is false for this list.\n\nCorrect conclusion: some v_j with c_j≠0 lies in the span of the others (Theorem 1). Sharper, by Lemma 2: if j is the largest index with c_j≠0, then v_j lies in the span of v₁,…,v_{j−1}.\n\nRubric: (1) names the division by c₁ as the invalid step and says why (c₁ may be 0); (2) gives an explicit dependent list and shows that every relation has c₁=0, not just one relation; (3) verifies that v₁ is outside the span of the others; (4) states the corrected conclusion with an existential index j.",
  "solution": "<p>The first invalid step is \"dividing by c₁\". Dependence guarantees that some coefficient is nonzero, not that c₁ is. The division is legal only after choosing an index j with c_j≠0, as in the proof of Theorem 1.</p><p>Counterexample in R²: v₁=(1,0), v₂=(1,1), v₃=(2,2). The list is dependent, since 0·v₁+2v₂−v₃=0. Every relation has c₁=0: from a(1,0)+b(1,1)+c(2,2)=0 the second coordinate gives b+2c=0, and then the first gives a=0. And v₁ is not in span{v₂,v₃}, which is the line y=x. So the conclusion \"v₁ lies in the span of v₂, v₃\" is false for this list.</p><p>Correct conclusion: some v_j with c_j≠0 lies in the span of the others (Theorem 1). Sharper, by Lemma 2: if j is the largest index with c_j≠0, then v_j lies in the span of v₁,…,v_{j−1}.</p><p>Rubric: (1) names the division by c₁ as the invalid step and says why (c₁ may be 0); (2) gives an explicit dependent list and shows that every relation has c₁=0, not just one relation; (3) verifies that v₁ is outside the span of the others; (4) states the corrected conclusion with an existential index j.</p>"
},
A16: {
  "statement": "**A16 · Core · paper — the span of any set.** For an arbitrary subset \\(S\\subseteq V\\), possibly empty or infinite, define \\(\\operatorname{span}S\\) as the set of all finite linear combinations of elements of \\(S\\), with \\(\\operatorname{span}\\varnothing=\\{0\\}\\). Prove that \\(\\operatorname{span}S\\) is a subspace, that it equals the intersection of all subspaces containing \\(S\\), and that \\(\\operatorname{span}(S\\cup T)=\\operatorname{span}S+\\operatorname{span}T\\).",
  "proof": true,
  "plain": "Write elements of span S as finite sums Σcᵢsᵢ with sᵢ∈S; the empty sum is 0.\n\nSubspace. 0∈span S (the empty sum, or all coefficients zero). The sum of two finite combinations is a finite combination of the finitely many elements used by either, and c·Σcᵢsᵢ=Σ(ccᵢ)sᵢ. So span S passes the three-part test. When S=∅, span S={0}, which is a subspace.\n\nIntersection. Let I be the intersection of all subspaces containing S; V itself is one, so I is defined, and I is a subspace by Theorem 7. span S is one of the subspaces containing S, so I⊆span S. Conversely, any subspace U⊇S contains every finite combination of elements of S, by closure under scaling and then adding one term at a time; so span S⊆U for every such U, hence span S⊆I. Thus span S=I. For S=∅, every subspace contains ∅, and the intersection of all subspaces is {0}.\n\nSums. An element of span(S∪T) is a finite combination; grouping the terms from S and the terms from T (an element in both may be put in either group) writes it as x+y with x∈span S, y∈span T. Conversely x+y is a finite combination of elements of S∪T. So span(S∪T)=span S+span T.\n\nRubric: (1) checks all three subspace conditions, including 0 via the empty sum; (2) proves both inclusions for the intersection characterization; (3) justifies closure for a finite sum by adding one term at a time; (4) handles S=∅ explicitly; (5) proves both inclusions for the sum identity.",
  "solution": "<p>Write elements of span S as finite sums Σcᵢsᵢ with sᵢ∈S; the empty sum is 0.</p><p>Subspace. 0∈span S (the empty sum, or all coefficients zero). The sum of two finite combinations is a finite combination of the finitely many elements used by either, and c·Σcᵢsᵢ=Σ(ccᵢ)sᵢ. So span S passes the three-part test. When S=∅, span S={0}, which is a subspace.</p><p>Intersection. Let I be the intersection of all subspaces containing S; V itself is one, so I is defined, and I is a subspace by Theorem 7. span S is one of the subspaces containing S, so I⊆span S. Conversely, any subspace U⊇S contains every finite combination of elements of S, by closure under scaling and then adding one term at a time; so span S⊆U for every such U, hence span S⊆I. Thus span S=I. For S=∅, every subspace contains ∅, and the intersection of all subspaces is {0}.</p><p>Sums. An element of span(S∪T) is a finite combination; grouping the terms from S and the terms from T (an element in both may be put in either group) writes it as x+y with x∈span S, y∈span T. Conversely x+y is a finite combination of elements of S∪T. So span(S∪T)=span S+span T.</p><p>Rubric: (1) checks all three subspace conditions, including 0 via the empty sum; (2) proves both inclusions for the intersection characterization; (3) justifies closure for a finite sum by adding one term at a time; (4) handles S=∅ explicitly; (5) proves both inclusions for the sum identity.</p>"
},
A17: {
  "statement": "**A17 · Stretch · paper — a relation between functions.** Is \\(\\sin x,\\cos x,\\sin(x+\\pi/4)\\) an independent list of functions \\(\\mathbb R\\to\\mathbb R\\)? A relation must hold at every \\(x\\), not just at a few sampled points. Find one or prove none exists.",
  "plain": "Dependent. The angle-addition formula gives sin(x+π/4)=sin x cos(π/4)+cos x sin(π/4)=(sin x+cos x)/√2 for every real x. Therefore sin x+cos x−√2·sin(x+π/4)=0 for every x, a relation with coefficients (1,1,−√2).\n\nThe identity holds for all x, which is what a relation among functions requires; agreement at finitely many sample points would not be enough. The pair sin x, cos x alone is independent: a sin x+b cos x=0 at x=0 gives b=0 and at x=π/2 gives a=0.\n\nRubric: (1) correct verdict; (2) explicit relation justified by the angle-addition identity for all x; (3) explains why sampled points are not enough.",
  "solution": "<p>Dependent. The angle-addition formula gives sin(x+π/4)=sin x cos(π/4)+cos x sin(π/4)=(sin x+cos x)/√2 for every real x. Therefore sin x+cos x−√2·sin(x+π/4)=0 for every x, a relation with coefficients (1,1,−√2).</p><p>The identity holds for all x, which is what a relation among functions requires; agreement at finitely many sample points would not be enough. The pair sin x, cos x alone is independent: a sin x+b cos x=0 at x=0 gives b=0 and at x=π/2 gives a=0.</p><p>Rubric: (1) correct verdict; (2) explicit relation justified by the angle-addition identity for all x; (3) explains why sampled points are not enough.</p>",
  "fields": [
    {
      "id": "v",
      "label": "verdict",
      "type": "choice",
      "opts": [
        "independent",
        "dependent"
      ],
      "ans": "dependent"
    },
    {
      "id": "c",
      "label": "coefficients on (sin x, cos x, sin(x+π/4))",
      "type": "ratio",
      "ans": [
        1,
        1,
        -1.4142135623730951
      ]
    }
  ],
  "hints": {
    "v": "Expand sin(x+π/4) with the angle-addition formula before deciding.",
    "c": "sin(x+π/4)=(sin x+cos x)/√2. One coefficient is irrational: enter it as -sqrt(2)."
  }
},
A18: {
  "statement": "**A18 · Stretch · paper — three subspaces.** Call \\(U_1+U_2+U_3\\) direct when each of its vectors has exactly one representation \\(u_1+u_2+u_3\\) with \\(u_i\\in U_i\\). Show with three lines in \\(\\mathbb R^2\\) that pairwise intersections \\(U_i\\cap U_j=\\{0\\}\\) do not make the sum direct. Then prove that the sum is direct if and only if \\(U_1\\cap U_2=\\{0\\}\\) and \\(U_3\\cap(U_1+U_2)=\\{0\\}\\).",
  "proof": true,
  "plain": "Uniqueness of every representation is equivalent to uniqueness for 0: if u₁+u₂+u₃=u₁'+u₂'+u₃', subtracting gives a representation of 0 by (u₁−u₁')+(u₂−u₂')+(u₃−u₃'). So the sum is direct exactly when u₁+u₂+u₃=0 forces u₁=u₂=u₃=0.\n\nCounterexample: in R² take the x-axis, the y-axis and the line y=x. Any two meet only in 0. But (1,0)+(0,1)+(−1,−1)=0 is a representation of 0 with nonzero pieces, and (1,1) has the two representations 0+0+(1,1) and (1,0)+(0,1)+0. The sum is R² but not direct: dimensions 1+1+1=3 exceed 2.\n\n(⇒) If x∈U₁∩U₂ is nonzero, then x+(−x)+0=0 is a nontrivial representation of 0. If y∈U₃∩(U₁+U₂) is nonzero, write y=u₁+u₂; then u₁+u₂+(−y)=0 is nontrivial. So both intersections are {0}.\n\n(⇐) Suppose u₁+u₂+u₃=0. Then u₃=−(u₁+u₂) lies in U₃∩(U₁+U₂)={0}, so u₃=0. Now u₁=−u₂ lies in U₁∩U₂={0}, so u₁=u₂=0.\n\nRubric: (1) reduces uniqueness to the representations of 0; (2) gives an explicit three-line counterexample with a nontrivial representation of 0; (3) proves both directions of the criterion; (4) uses the correct intersection U₃∩(U₁+U₂), not only pairwise intersections.",
  "solution": "<p>Uniqueness of every representation is equivalent to uniqueness for 0: if u₁+u₂+u₃=u₁'+u₂'+u₃', subtracting gives a representation of 0 by (u₁−u₁')+(u₂−u₂')+(u₃−u₃'). So the sum is direct exactly when u₁+u₂+u₃=0 forces u₁=u₂=u₃=0.</p><p>Counterexample: in R² take the x-axis, the y-axis and the line y=x. Any two meet only in 0. But (1,0)+(0,1)+(−1,−1)=0 is a representation of 0 with nonzero pieces, and (1,1) has the two representations 0+0+(1,1) and (1,0)+(0,1)+0. The sum is R² but not direct: dimensions 1+1+1=3 exceed 2.</p><p>(⇒) If x∈U₁∩U₂ is nonzero, then x+(−x)+0=0 is a nontrivial representation of 0. If y∈U₃∩(U₁+U₂) is nonzero, write y=u₁+u₂; then u₁+u₂+(−y)=0 is nontrivial. So both intersections are {0}.</p><p>(⇐) Suppose u₁+u₂+u₃=0. Then u₃=−(u₁+u₂) lies in U₃∩(U₁+U₂)={0}, so u₃=0. Now u₁=−u₂ lies in U₁∩U₂={0}, so u₁=u₂=0.</p><p>Rubric: (1) reduces uniqueness to the representations of 0; (2) gives an explicit three-line counterexample with a nontrivial representation of 0; (3) proves both directions of the criterion; (4) uses the correct intersection U₃∩(U₁+U₂), not only pairwise intersections.</p>"
},
A19: {
  "statement": "**A19 · Stretch · paper — dimension counting.** For subspaces \\(S,T\\subseteq\\mathbb R^5\\) with \\(\\dim S=\\dim T=3\\), give every possible value of \\(\\dim(S\\cap T)\\) and justify both extremes. State which theorem forces the lower bound.",
  "plain": "By Theorem 16, dim(S∩T)=3+3−dim(S+T). Since S+T⊆R⁵, dim(S+T)≤5 (Theorem 13), so dim(S∩T)≥1. Since S∩T⊆S, dim(S∩T)≤3.\n\nAll three values occur. Value 3: S=T=span{e₁,e₂,e₃}. Value 2: S=span{e₁,e₂,e₃}, T=span{e₁,e₂,e₄}, with S∩T=span{e₁,e₂}. Value 1: S=span{e₁,e₂,e₃}, T=span{e₁,e₄,e₅}, with S∩T=span{e₁} and S+T=R⁵.\n\nThe lower bound is forced by the dimension formula for a sum (Theorem 16) together with dim(S+T)≤5: two three-dimensional subspaces of R⁵ cannot meet only at 0.\n\nRubric: (1) lower bound from Theorem 16 with dim(S+T)≤5; (2) upper bound from S∩T⊆S; (3) an explicit example for each of the three values; (4) names the theorem forcing the lower bound.",
  "solution": "<p>By Theorem 16, dim(S∩T)=3+3−dim(S+T). Since S+T⊆R⁵, dim(S+T)≤5 (Theorem 13), so dim(S∩T)≥1. Since S∩T⊆S, dim(S∩T)≤3.</p><p>All three values occur. Value 3: S=T=span{e₁,e₂,e₃}. Value 2: S=span{e₁,e₂,e₃}, T=span{e₁,e₂,e₄}, with S∩T=span{e₁,e₂}. Value 1: S=span{e₁,e₂,e₃}, T=span{e₁,e₄,e₅}, with S∩T=span{e₁} and S+T=R⁵.</p><p>The lower bound is forced by the dimension formula for a sum (Theorem 16) together with dim(S+T)≤5: two three-dimensional subspaces of R⁵ cannot meet only at 0.</p><p>Rubric: (1) lower bound from Theorem 16 with dim(S+T)≤5; (2) upper bound from S∩T⊆S; (3) an explicit example for each of the three values; (4) names the theorem forcing the lower bound.</p>",
  "fields": [
    {
      "id": "vals",
      "label": "all possible values of dim(S∩T)",
      "type": "set",
      "ans": [
        1,
        2,
        3
      ]
    }
  ],
  "hints": {
    "vals": "Theorem 16 with dim(S+T)≤5 gives the lower bound; S∩T⊆S gives the upper bound. Every value in between occurs."
  }
},
A20: {
  "statement": "**A20 · Stretch · paper — a single exchange.** Let \\(v_1,\\dots,v_n\\) be a basis of \\(V\\) and \\(w=c_1v_1+\\dots+c_nv_n\\). Prove that replacing \\(v_j\\) by \\(w\\) gives a basis exactly when \\(c_j\\ne0\\).",
  "proof": true,
  "plain": "Let B'=(v₁,…,v_{j−1},w,v_{j+1},…,v_n).\n\nIf c_j≠0: solve for v_j=(1/c_j)(w−Σ_{i≠j}cᵢvᵢ). So v_j lies in span B', and so do the other vᵢ, hence span B' contains span(v₁,…,v_n)=V. B' is a spanning list of length n in the n-dimensional space V, so it is a basis by Theorem 12.\n\nIf c_j=0: w=Σ_{i≠j}cᵢvᵢ lies in the span of the other vectors of B', so B' is dependent by Theorem 1 and is not a basis.\n\nRubric: (1) solves for v_j and says why division by c_j is allowed; (2) shows every old basis vector lies in span B'; (3) concludes basis by counting with Theorem 12, or proves independence directly; (4) treats c_j=0 and shows B' is dependent there; (5) states the equivalence in both directions.",
  "solution": "<p>Let B'=(v₁,…,v_{j−1},w,v_{j+1},…,v_n).</p><p>If c_j≠0: solve for v_j=(1/c_j)(w−Σ_{i≠j}cᵢvᵢ). So v_j lies in span B', and so do the other vᵢ, hence span B' contains span(v₁,…,v_n)=V. B' is a spanning list of length n in the n-dimensional space V, so it is a basis by Theorem 12.</p><p>If c_j=0: w=Σ_{i≠j}cᵢvᵢ lies in the span of the other vectors of B', so B' is dependent by Theorem 1 and is not a basis.</p><p>Rubric: (1) solves for v_j and says why division by c_j is allowed; (2) shows every old basis vector lies in span B'; (3) concludes basis by counting with Theorem 12, or proves independence directly; (4) treats c_j=0 and shows B' is dependent there; (5) states the equivalence in both directions.</p>"
},
B1: {
  "statement": "**B1 · Foundation · NumPy — build a linear combination.** Implement both functions, then compare them on several rectangular shapes, negative coefficients, and zero coefficients. Use loops only in the first implementation, and matrix multiplication in the second.\n\n~~~python\nimport numpy as np\n\ndef lincomb_loops(vectors, coeffs):\n    \"\"\"Nonempty list of equal-length 1-D vectors; one coefficient each.\"\"\"\n    raise NotImplementedError(\"Accumulate each coefficient times its vector\")\n\ndef lincomb_vec(V, c):\n    \"\"\"V has shape (n, k), with vectors as columns; c has shape (k,).\"\"\"\n    raise NotImplementedError(\"Express the same operation with @\")\n\nvectors = [np.array([1., 0., 2.]), np.array([3., 1., -1.])]\nc = np.array([-1., 2.])\nV = np.column_stack(vectors)\nassert np.allclose(lincomb_loops(vectors, c), lincomb_vec(V, c))\n~~~",
  "plain": "A reference implementation accumulates term by term: start from np.zeros_like(vectors[0], dtype=float), then for each pair (v, c) add c * v. The vectorised form is V @ c, which is the same sum Σ cᵢvᵢ because matrix-vector multiplication combines the columns of V with the entries of c (section 10). On the given fixture both return −1·(1,0,2)+2·(3,1,−1)=(5,2,−4). Also test a 4×5 case with random data, a coefficient list containing zeros, and all-negative coefficients; compare with np.allclose.\n\nRubric: (1) the loop version uses no matrix multiplication and handles an arbitrary number of vectors; (2) the vectorised version is V @ c with V built by np.column_stack; (3) tests cover rectangular shapes, zero and negative coefficients, with the fixture value (5,2,−4); (4) the answer states why the two agree, citing the column picture of Vc.",
  "solution": "<p>A reference implementation accumulates term by term: start from np.zeros_like(vectors[0], dtype=float), then for each pair (v, c) add c * v. The vectorised form is V @ c, which is the same sum Σ cᵢvᵢ because matrix-vector multiplication combines the columns of V with the entries of c (section 10). On the given fixture both return −1·(1,0,2)+2·(3,1,−1)=(5,2,−4). Also test a 4×5 case with random data, a coefficient list containing zeros, and all-negative coefficients; compare with np.allclose.</p><p>Rubric: (1) the loop version uses no matrix multiplication and handles an arbitrary number of vectors; (2) the vectorised version is V @ c with V built by np.column_stack; (3) tests cover rectangular shapes, zero and negative coefficients, with the fixture value (5,2,−4); (4) the answer states why the two agree, citing the column picture of Vc.</p>"
},
B2: {
  "statement": "**B2 · Core · NumPy — an independence decision needs a tolerance.** Implement `is_dependent_2d(u, v, tol=1e-9)` using \\(|u_1v_2-u_2v_1|\\le\\mathrm{tol}\\). Compare an exactly parallel pair, unit vectors separated by \\(10^{-8}\\) radians, and the standard basis. Find an answer that changes with `tol`. Then multiply both input vectors by \\(10^{-6}\\). Explain why a fixed determinant threshold is scale-sensitive: scaling both columns by \\(s\\) scales the determinant by \\(s^2\\). For nonzero vectors, compare with the scale-free ratio in section 13.",
  "plain": "Implement is_dependent_2d(u, v, tol) as abs(u[0]*v[1] - u[1]*v[0]) <= tol. An exactly parallel pair gives 0 and is reported dependent; the standard basis gives 1 and is independent. Unit vectors 10⁻⁸ radians apart give |D|=sin(10⁻⁸)≈10⁻⁸: dependent at tol=10⁻⁷, independent at tol=10⁻⁹, so the verdict changes with tol.\n\nScaling both vectors by s scales D by s². After multiplying the standard basis by 10⁻⁶, D becomes 10⁻¹², which is below 10⁻⁹, so an obviously independent pair is reported dependent. A fixed absolute threshold on D therefore mixes size with angle. For nonzero vectors the ratio |D|/(‖u‖‖v‖)=|sin θ| of section 13 is unchanged by scaling and measures the angle alone.\n\nRubric: (1) implements the stated test exactly; (2) reports the three comparison cases with numbers; (3) exhibits a tol-dependent verdict; (4) shows the s² scaling and the rescaled failure; (5) proposes the scale-free ratio and notes it needs nonzero vectors.",
  "solution": "<p>Implement is_dependent_2d(u, v, tol) as abs(u[0]*v[1] - u[1]*v[0]) &lt;= tol. An exactly parallel pair gives 0 and is reported dependent; the standard basis gives 1 and is independent. Unit vectors 10⁻⁸ radians apart give |D|=sin(10⁻⁸)≈10⁻⁸: dependent at tol=10⁻⁷, independent at tol=10⁻⁹, so the verdict changes with tol.</p><p>Scaling both vectors by s scales D by s². After multiplying the standard basis by 10⁻⁶, D becomes 10⁻¹², which is below 10⁻⁹, so an obviously independent pair is reported dependent. A fixed absolute threshold on D therefore mixes size with angle. For nonzero vectors the ratio |D|/(‖u‖‖v‖)=|sin θ| of section 13 is unchanged by scaling and measures the angle alone.</p><p>Rubric: (1) implements the stated test exactly; (2) reports the three comparison cases with numbers; (3) exhibits a tol-dependent verdict; (4) shows the s² scaling and the rescaled failure; (5) proposes the scale-free ratio and notes it needs nonzero vectors.</p>"
},
B3: {
  "statement": "**B3 · Core · NumPy — the Gram determinant, and its limits.** Form \\(G=V^TV\\); `np.linalg.det` is allowed (the determinant is defined in LA05; only whether it is zero matters here). Use random \\(3\\times3\\) and \\(3\\times2\\) matrices and dependent versions made by replacing one column with another. In exact arithmetic, \\(\\det G=0\\) exactly when the columns are dependent; justify this using \\(c^TGc=\\|Vc\\|^2\\). Compare with floating-point results without expecting literal zero. In two columns, derive\n\n$$\n\\det G=\\|u\\|^2\\|v\\|^2-(u^Tv)^2\n=\\|u\\|^2\\|v\\|^2\\sin^2\\theta.\n$$\n\nSo \\(\\sqrt{\\det G}\\) is area. In three columns it is volume, a fact developed in the determinant treatment. Now make two columns nearly parallel and explain why a very small or slightly negative computed determinant is not a trustworthy geometric volume. Do not hide that failure by blindly taking a square root.",
  "plain": "Justification: for any c, cᵀGc=‖Vc‖², so Gc=0 implies Vc=0, and Vc=0 implies Gc=VᵀVc=0 (Theorem 18). G is square, and in exact arithmetic det G=0 exactly when Gc=0 has a nonzero solution, that is, exactly when the columns of V are dependent (the determinant fact is proved in LA05).\n\nFor two columns u, v: G=[[‖u‖², u·v],[u·v, ‖v‖²]], so det G=‖u‖²‖v‖²−(u·v)²=‖u‖²‖v‖²(1−cos²θ)=‖u‖²‖v‖²sin²θ. Hence √det G=‖u‖‖v‖|sin θ| is the parallelogram area.\n\nNumerically, random 3×3 and 3×2 matrices give clearly positive det G; replacing a column by a copy gives a value at rounding level, possibly negative, and usually not literal zero. With nearly parallel columns, forming G squares the small quantity and rounding in the entries can exceed the true determinant, so the computed value can have no correct digits or the wrong sign. Taking a square root would hide that failure or raise an error; report the raw value with a warning instead.\n\nRubric: (1) proves Gc=0 ⟺ Vc=0 using cᵀGc=‖Vc‖²; (2) derives the two-column formula with sin²θ; (3) reports dependent cases as small nonzero values rather than zero; (4) explains why near-parallel columns make the computed determinant untrustworthy, including a possible negative value.",
  "solution": "<p>Justification: for any c, cᵀGc=‖Vc‖², so Gc=0 implies Vc=0, and Vc=0 implies Gc=VᵀVc=0 (Theorem 18). G is square, and in exact arithmetic det G=0 exactly when Gc=0 has a nonzero solution, that is, exactly when the columns of V are dependent (the determinant fact is proved in LA05).</p><p>For two columns u, v: G=[[‖u‖², u·v],[u·v, ‖v‖²]], so det G=‖u‖²‖v‖²−(u·v)²=‖u‖²‖v‖²(1−cos²θ)=‖u‖²‖v‖²sin²θ. Hence √det G=‖u‖‖v‖|sin θ| is the parallelogram area.</p><p>Numerically, random 3×3 and 3×2 matrices give clearly positive det G; replacing a column by a copy gives a value at rounding level, possibly negative, and usually not literal zero. With nearly parallel columns, forming G squares the small quantity and rounding in the entries can exceed the true determinant, so the computed value can have no correct digits or the wrong sign. Taking a square root would hide that failure or raise an error; report the raw value with a warning instead.</p><p>Rubric: (1) proves Gc=0 ⟺ Vc=0 using cᵀGc=‖Vc‖²; (2) derives the two-column formula with sin²θ; (3) reports dependent cases as small nonzero values rather than zero; (4) explains why near-parallel columns make the computed determinant untrustworthy, including a possible negative value.</p>"
},
B4: {
  "statement": "**B4 · Core · NumPy — membership by reconstruction.** Write `in_span(V, w, atol=1e-9, rtol=1e-9)` using `np.linalg.lstsq(V, w, rcond=None)` and a residual test. The least-squares solver is allowed here as a preview of the projections chapter. Always compute `np.linalg.norm(V @ c - w)` yourself: the returned `residuals` array can be empty for underdetermined or rank-deficient inputs even when the target is outside the span. Test reachable, unreachable, and nearly reachable targets; specify your absolute-plus-relative decision rule.",
  "plain": "Reference rule: c = np.linalg.lstsq(V, w, rcond=None)[0]; r = np.linalg.norm(V @ c - w); return r <= atol + rtol * np.linalg.norm(w). Compute r yourself, because the returned residuals array is empty when V is rank-deficient or has more columns than rows, even for an unreachable target.\n\nTests: a reachable target (w=Vc₀ for a random c₀) returns True with r near 10⁻¹⁵; an unreachable target (add a vector orthogonal to the column span) returns False with r equal to that vector's length; a dependent V such as columns (1,2),(2,4) still works; a nearly reachable target w=Vc₀+10⁻¹²n is accepted, while w=Vc₀+10⁻⁶n is rejected, under atol=rtol=10⁻⁹. State the rule and the tolerances with every result.\n\nRubric: (1) computes the residual explicitly rather than trusting the returned residuals; (2) uses an absolute-plus-relative threshold and states it; (3) tests reachable, unreachable, dependent and nearly reachable cases; (4) explains why an empty residuals array is not evidence of membership.",
  "solution": "<p>Reference rule: c = np.linalg.lstsq(V, w, rcond=None)[0]; r = np.linalg.norm(V @ c - w); return r &lt;= atol + rtol * np.linalg.norm(w). Compute r yourself, because the returned residuals array is empty when V is rank-deficient or has more columns than rows, even for an unreachable target.</p><p>Tests: a reachable target (w=Vc₀ for a random c₀) returns True with r near 10⁻¹⁵; an unreachable target (add a vector orthogonal to the column span) returns False with r equal to that vector's length; a dependent V such as columns (1,2),(2,4) still works; a nearly reachable target w=Vc₀+10⁻¹²n is accepted, while w=Vc₀+10⁻⁶n is rejected, under atol=rtol=10⁻⁹. State the rule and the tolerances with every result.</p><p>Rubric: (1) computes the residual explicitly rather than trusting the returned residuals; (2) uses an absolute-plus-relative threshold and states it; (3) tests reachable, unreachable, dependent and nearly reachable cases; (4) explains why an empty residuals array is not evidence of membership.</p>"
},
B5: {
  "statement": "**B5 · Core · NumPy — a nonzero relation in a wide matrix.** Draw \\(V\\) with shape \\((5,6)\\) and find \\(c\\ne0\\) such that \\(Vc\\approx0\\). `np.linalg.svd` is allowed. The SVD gives mutually perpendicular unit right directions; its theory comes later. For this experiment, request the **full** right factor:\n\n~~~python\nimport numpy as np\n\nrng = np.random.default_rng(0)\nV = rng.normal(size=(5, 6))\nU, singular_values, Vh = np.linalg.svd(V, full_matrices=True)\nc = Vh[-1]\nprint(Vh.shape, np.linalg.norm(V @ c), np.linalg.norm(c))\n~~~\n\nFor a full-row-rank \\(5\\times6\\) matrix, `Vh` has shape \\((6,6)\\), and its final row supplies the missing null direction. There are only five returned singular values; the null direction corresponds to the extra right vector, not necessarily to a zero in that returned list. Repeat with `full_matrices=False`: `Vh` is then \\((5,6)\\), and its final row generally does **not** give a dependency relation. Explain the difference before using SVD to check another wide matrix.",
  "plain": "With full_matrices=True, Vh has shape (6,6) and singular_values has five entries. The rows of Vh are orthonormal; the first five pair with the returned singular values, and the sixth row spans the directions sent to 0 (for a full-row-rank 5×6 matrix the null space has dimension exactly one). So c=Vh[-1] satisfies ‖Vc‖≈10⁻¹⁵ and ‖c‖=1, a normalized dependency relation among the six columns.\n\nWith full_matrices=False, Vh has shape (5,6): it keeps only the five rows paired with singular values. Its last row pairs with the smallest positive singular value σ₅, so ‖V·Vh[-1]‖=σ₅, which is positive and not small in general. The null direction is simply not returned. Always check ‖Vc‖ before calling a vector a relation.\n\nRubric: (1) states both Vh shapes correctly; (2) explains that the null direction is the extra sixth row, not a zero singular value; (3) reports ‖Vc‖ and ‖c‖ for the full case; (4) shows that the reduced factor's last row gives ‖Vc‖=σ₅≠0.",
  "solution": "<p>With full_matrices=True, Vh has shape (6,6) and singular_values has five entries. The rows of Vh are orthonormal; the first five pair with the returned singular values, and the sixth row spans the directions sent to 0 (for a full-row-rank 5×6 matrix the null space has dimension exactly one). So c=Vh[-1] satisfies ‖Vc‖≈10⁻¹⁵ and ‖c‖=1, a normalized dependency relation among the six columns.</p><p>With full_matrices=False, Vh has shape (5,6): it keeps only the five rows paired with singular values. Its last row pairs with the smallest positive singular value σ₅, so ‖V·Vh[-1]‖=σ₅, which is positive and not small in general. The null direction is simply not returned. Always check ‖Vc‖ before calling a vector a relation.</p><p>Rubric: (1) states both Vh shapes correctly; (2) explains that the null direction is the extra sixth row, not a zero singular value; (3) reports ‖Vc‖ and ‖c‖ for the full case; (4) shows that the reduced factor's last row gives ‖Vc‖=σ₅≠0.</p>"
},
B6: {
  "statement": "**B6 · Core · NumPy — coordinates near collapse.** For \\(B=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\), implement `coords_in_basis(B, v)` using\n\n$$\nB^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix},\n$$\n\nrejecting a determinant too small under your stated tolerance. Check standard, skewed, and rotated bases by reconstruction. Then use \\(b_1=(1,0)\\), \\(b_2=(\\cos\\theta,\\sin\\theta)\\), and fixed \\(v=(0,2)\\). Sweep \\(\\theta\\) toward zero and plot \\(\\|[v]_B\\|\\). Repeat with \\(v=(3,0)\\), whose coordinates stay \\((3,0)\\) along this path. Sensitivity permits large changes; it does not require every target to have large coordinates.",
  "plain": "Implement coords_in_basis(B, v): compute det=ad−bc; if abs(det) <= tol (state it, for example 10⁻¹²·‖b₁‖‖b₂‖) raise ValueError; otherwise return (1/det)·[[d,−b],[−c,a]] @ v, and check B @ result ≈ v for standard, skewed and rotated bases.\n\nFor b₁=(1,0), b₂=(cos θ, sin θ), det=sin θ. The target (0,2) solves c₁+c₂cos θ=0, c₂ sin θ=2, so c₂=2/sin θ and c₁=−2cos θ/sin θ. The norm is ‖[v]_B‖=(2/sin θ)·√(1+cos²θ)≈2√2/θ as θ→0 (about 28284 at θ=10⁻⁴); on a log-log plot the slope is −1. The target (3,0)=3b₁ has coordinates (3,0) for every θ, because it lies along b₁ exactly. Near-collapse makes some targets extremely sensitive without forcing every target to have large coordinates.\n\nRubric: (1) implements the 2×2 inverse with an explicit, stated rejection threshold; (2) verifies by reconstruction; (3) derives or measures the growth (2/sin θ)√(1+cos²θ)≈2√2/θ for (0,2); (4) explains why (3,0) stays bounded; (5) the plot is labelled with axes and scale.",
  "solution": "<p>Implement coords_in_basis(B, v): compute det=ad−bc; if abs(det) &lt;= tol (state it, for example 10⁻¹²·‖b₁‖‖b₂‖) raise ValueError; otherwise return (1/det)·[[d,−b],[−c,a]] @ v, and check B @ result ≈ v for standard, skewed and rotated bases.</p><p>For b₁=(1,0), b₂=(cos θ, sin θ), det=sin θ. The target (0,2) solves c₁+c₂cos θ=0, c₂ sin θ=2, so c₂=2/sin θ and c₁=−2cos θ/sin θ. The norm is ‖[v]_B‖=(2/sin θ)·√(1+cos²θ)≈2√2/θ as θ→0 (about 28284 at θ=10⁻⁴); on a log-log plot the slope is −1. The target (3,0)=3b₁ has coordinates (3,0) for every θ, because it lies along b₁ exactly. Near-collapse makes some targets extremely sensitive without forcing every target to have large coordinates.</p><p>Rubric: (1) implements the 2×2 inverse with an explicit, stated rejection threshold; (2) verifies by reconstruction; (3) derives or measures the growth (2/sin θ)√(1+cos²θ)≈2√2/θ for (0,2); (4) explains why (3,0) stays bounded; (5) the plot is labelled with axes and scale.</p>"
},
B7: {
  "statement": "**B7 · Stretch · NumPy — rebuild the span picture.** In matplotlib, draw \\(u=(1,2)\\), \\(v=(-1,1)\\), then scatter 2,000 combinations with coefficients uniform on \\([-2,2]\\). Overlay the four boundary corners \\(\\pm2u\\pm2v\\) in cyclic order. Save the figure, then repeat with \\(v=2u\\) and save that figure too. Label the shaded or sampled region as a bounded set of combinations, not the entire span. Explain what finite samples can illustrate and what they cannot prove.",
  "plain": "Sample a, b uniformly on [−2,2] (2,000 draws), form the points a·u+b·v, and scatter them. Draw the polygon through the corners 2u+2v, 2u−2v, −2u−2v, −2u+2v in that cyclic order: with u=(1,2), v=(−1,1) these are (0,6), (4,2), (0,−6), (−4,−2). The cloud fills that parallelogram. With v=2u every point is (a+2b)u with a+2b∈[−6,6], so the cloud collapses to the segment from (−6,−12) to (6,12) and the \"parallelogram\" degenerates.\n\nLabel the plots \"combinations with coefficients in [−2,2]\", not \"the span\": the span is the whole plane in the first case and the whole line in the second. A finite sample can illustrate the shape of a bounded set of combinations, and can show collapse vividly, but it cannot prove that a point is outside the span or that the span is two-dimensional; that needs an argument such as D(u,v)=1·1−2·(−1)=3≠0.\n\nRubric: (1) correct corner order and coordinates; (2) both figures saved and labelled as bounded sets; (3) correct description of the collapsed case; (4) explains what sampling can and cannot establish, with an exact test for the claim.",
  "solution": "<p>Sample a, b uniformly on [−2,2] (2,000 draws), form the points a·u+b·v, and scatter them. Draw the polygon through the corners 2u+2v, 2u−2v, −2u−2v, −2u+2v in that cyclic order: with u=(1,2), v=(−1,1) these are (0,6), (4,2), (0,−6), (−4,−2). The cloud fills that parallelogram. With v=2u every point is (a+2b)u with a+2b∈[−6,6], so the cloud collapses to the segment from (−6,−12) to (6,12) and the \"parallelogram\" degenerates.</p><p>Label the plots \"combinations with coefficients in [−2,2]\", not \"the span\": the span is the whole plane in the first case and the whole line in the second. A finite sample can illustrate the shape of a bounded set of combinations, and can show collapse vividly, but it cannot prove that a point is outside the span or that the span is two-dimensional; that needs an argument such as D(u,v)=1·1−2·(−1)=3≠0.</p><p>Rubric: (1) correct corner order and coordinates; (2) both figures saved and labelled as bounded sets; (3) correct description of the collapsed case; (4) explains what sampling can and cannot establish, with an exact test for the claim.</p>"
},
B8: {
  "statement": "**B8 · Stretch · NumPy — geometry under a coordinate change.** Use \\(B=\\begin{pmatrix}1&2\\\\0&1\\end{pmatrix}\\). For several vectors \\(x,y\\), solve for their coordinate lists \\(c,d\\). Compare \\(x^Ty\\), \\(c^Td\\), and \\(c^T(B^TB)d\\). Include \\(x=(1,0),y=(0,1)\\). Explain which calculation preserves the original geometry and why an invertible coordinate change preserves independence even when the raw coordinate cosine changes. Gram–Schmidt and its numerical variants belong to Module 4.",
  "plain": "B=[[1,2],[0,1]] has columns b₁=(1,0), b₂=(2,1), and G=BᵀB=[[1,2],[2,5]]. For x=(1,0), y=(0,1): solving Bc=x gives c=(1,0), and Bd=y gives d=(−2,1) (from d₂=1 and d₁+2d₂=0). Then xᵀy=0, the raw coordinate product cᵀd=−2, and Gd=(−2+2, −4+5)=(0,1), so cᵀGd=0.\n\nSo the standard geometry is recovered only by weighting with the Gram matrix; the raw coordinate dot product silently uses a different inner product in which b₁ and b₂ are perpendicular unit vectors. Independence survives any invertible coordinate change: if Σaᵢcᵢ=0 among coordinate vectors then applying B gives Σaᵢxᵢ=0 among the original vectors, and conversely with B⁻¹, so the relations are identical. Angles and lengths are not preserved unless BᵀB=I.\n\nRubric: (1) computes c, d and all three products correctly for the required pair; (2) tests several other pairs and reports agreement of xᵀy with cᵀGd; (3) explains why independence is preserved using relations; (4) states the condition BᵀB=I for raw coordinates to keep the geometry.",
  "solution": "<p>B=[[1,2],[0,1]] has columns b₁=(1,0), b₂=(2,1), and G=BᵀB=[[1,2],[2,5]]. For x=(1,0), y=(0,1): solving Bc=x gives c=(1,0), and Bd=y gives d=(−2,1) (from d₂=1 and d₁+2d₂=0). Then xᵀy=0, the raw coordinate product cᵀd=−2, and Gd=(−2+2, −4+5)=(0,1), so cᵀGd=0.</p><p>So the standard geometry is recovered only by weighting with the Gram matrix; the raw coordinate dot product silently uses a different inner product in which b₁ and b₂ are perpendicular unit vectors. Independence survives any invertible coordinate change: if Σaᵢcᵢ=0 among coordinate vectors then applying B gives Σaᵢxᵢ=0 among the original vectors, and conversely with B⁻¹, so the relations are identical. Angles and lengths are not preserved unless BᵀB=I.</p><p>Rubric: (1) computes c, d and all three products correctly for the required pair; (2) tests several other pairs and reports agreement of xᵀy with cᵀGd; (3) explains why independence is preserved using relations; (4) states the condition BᵀB=I for raw coordinates to keep the geometry.</p>"
},
B9: {
  "statement": "**B9 · Stretch · NumPy — two degeneracy measures.** Implement `hadamard_ratio(B)` and compare it with `np.linalg.cond(B)` on two paths: \\(B_\\theta\\) with columns \\(e_1\\) and \\((\\cos\\theta,\\sin\\theta)\\) for \\(\\theta=10^{-k}\\), and \\(S_t=\\operatorname{diag}(1,t)\\) for \\(t=10^{-k}\\), with \\(k=0,1,\\dots,8\\) in both. Plot both measures against \\(k\\) on a log scale and report their values at \\(\\theta=10^{-4}\\) and at \\(t=10^{-4}\\). State which you would put in a bug report, which you would put in a loss curve, and why they are not interchangeable.",
  "plain": "For Bθ with columns e₁=(1,0) and (cos θ, sin θ): h=|sin θ| (section 13), and np.linalg.cond gives the ratio of singular values, which equals cot(θ/2)≈2/θ for small θ. At θ=10⁻⁴: h≈10⁻⁴ and cond≈2·10⁴.\n\nFor S_t=diag(1,t): the columns are perpendicular, so h=1 for every t, while cond=1/t, which is 10⁴ at t=10⁻⁴. On a log scale h falls with slope 1 on the angle path and stays flat on the scaling path, while cond rises on both.\n\nh measures angular collapse only; cond bounds how much relative input error can be amplified in the coordinates, which is what a bug report about unstable coefficients needs. A logged h is a useful labelled monitor of collapsing directions in a loss curve, but it cannot show that coordinates are stable, so the two are not interchangeable.\n\nRubric: (1) correct formulas or measured values on both paths, including the values at 10⁻⁴; (2) a log-scale plot with both measures; (3) identifies diag(1,t) as the case h misses; (4) justifies which measure belongs in which report.",
  "solution": "<p>For Bθ with columns e₁=(1,0) and (cos θ, sin θ): h=|sin θ| (section 13), and np.linalg.cond gives the ratio of singular values, which equals cot(θ/2)≈2/θ for small θ. At θ=10⁻⁴: h≈10⁻⁴ and cond≈2·10⁴.</p><p>For S_t=diag(1,t): the columns are perpendicular, so h=1 for every t, while cond=1/t, which is 10⁴ at t=10⁻⁴. On a log scale h falls with slope 1 on the angle path and stays flat on the scaling path, while cond rises on both.</p><p>h measures angular collapse only; cond bounds how much relative input error can be amplified in the coordinates, which is what a bug report about unstable coefficients needs. A logged h is a useful labelled monitor of collapsing directions in a loss curve, but it cannot show that coordinates are stable, so the two are not interchangeable.</p><p>Rubric: (1) correct formulas or measured values on both paths, including the values at 10⁻⁴; (2) a log-scale plot with both measures; (3) identifies diag(1,t) as the case h misses; (4) justifies which measure belongs in which report.</p>"
},
C1: {
  "statement": "**C1 · Foundation · PyTorch — embedding rows.** Generate a random matrix \\(E\\in\\mathbb R^{5000\\times64}\\). Before computing, state whether its rows must be dependent and the largest possible rank. Compute `torch.linalg.matrix_rank(E)`. Full rank here means rank 64; it cannot mean that all 5,000 rows are independent. Create a version whose last column duplicates its first, then compare the result with your prediction.",
  "plain": "Prediction: 5,000 rows in R⁶⁴ must be dependent (Corollary 5), and the rank is at most 64. torch.linalg.matrix_rank(E) on a seeded float64 Gaussian matrix returns 64. That means the row span is all of R⁶⁴, or equivalently the 64 columns are independent; it cannot mean the 5,000 rows are independent, since at most 64 of them can be.\n\nCopying the first column into the last makes the columns exactly dependent, so the exact rank drops to at most 63; matrix_rank returns 63 because the smallest singular value is at rounding level, far below its default tolerance. Report the dtype and the tolerance used. With real embeddings, a rank below 64 is a numerical statement at a tolerance; investigate duplicated features, normalization or low precision before reading meaning into it.\n\nRubric: (1) predicts dependence and the maximum rank 64 before computing; (2) interprets full rank correctly as a statement about 64 directions; (3) predicts and observes the drop to 63 with the duplicated column; (4) states dtype and tolerance; (5) avoids a semantic interpretation of a rank gap.",
  "solution": "<p>Prediction: 5,000 rows in R⁶⁴ must be dependent (Corollary 5), and the rank is at most 64. torch.linalg.matrix_rank(E) on a seeded float64 Gaussian matrix returns 64. That means the row span is all of R⁶⁴, or equivalently the 64 columns are independent; it cannot mean the 5,000 rows are independent, since at most 64 of them can be.</p><p>Copying the first column into the last makes the columns exactly dependent, so the exact rank drops to at most 63; matrix_rank returns 63 because the smallest singular value is at rounding level, far below its default tolerance. Report the dtype and the tolerance used. With real embeddings, a rank below 64 is a numerical statement at a tolerance; investigate duplicated features, normalization or low precision before reading meaning into it.</p><p>Rubric: (1) predicts dependence and the maximum rank 64 before computing; (2) interprets full rank correctly as a statement about 64 directions; (3) predicts and observes the drop to 63 with the duplicated column; (4) states dtype and tolerance; (5) avoids a semantic interpretation of a rank gap.</p>"
},
C2: {
  "statement": "**C2 · Core · PyTorch — what a factored update can express.** Construct \\(\\Delta W=LR\\) with \\(L\\in\\mathbb R^{256\\times8}\\) and \\(R\\in\\mathbb R^{8\\times256}\\). Prove that every output \\(\\Delta W x=L(Rx)\\) lies in \\(\\operatorname{span}(L)\\), the span of the columns of \\(L\\), hence rank is at most 8. Verify it numerically. Distinguish a **fixed** \\(L\\), which fixes the allowed output subspace, from trainable \\(L\\), which can move that subspace while keeping its dimension at most 8. Also explain why a low-rank update does not force \\(W+\\Delta W\\) itself to have low rank.",
  "plain": "Proof: for any x, ΔWx=L(Rx)=Σⱼ(Rx)ⱼlⱼ is a combination of the eight columns lⱼ of L, so every output lies in span(L), a subspace of dimension at most 8. The column span of ΔW is therefore inside span(L), and rank ΔW≤8. Numerically, with float64 random factors, torch.linalg.matrix_rank(L@R) returns 8, and every singular value after the eighth is at rounding level relative to the first.\n\nA fixed L fixes the output subspace span(L) once and for all; training R only moves within it. A trainable L can rotate that subspace during training, but at every step it still has dimension at most 8. A low-rank update does not make W+ΔW low rank: with W=I (rank 256) and ΔW rank 8, W+ΔW is generically still rank 256; only the change is restricted.\n\nRubric: (1) proves span containment from ΔWx=L(Rx); (2) verifies rank 8 numerically with a stated tolerance; (3) distinguishes fixed and trainable L; (4) gives an example showing W+ΔW need not be low rank.",
  "solution": "<p>Proof: for any x, ΔWx=L(Rx)=Σⱼ(Rx)ⱼlⱼ is a combination of the eight columns lⱼ of L, so every output lies in span(L), a subspace of dimension at most 8. The column span of ΔW is therefore inside span(L), and rank ΔW≤8. Numerically, with float64 random factors, torch.linalg.matrix_rank(L@R) returns 8, and every singular value after the eighth is at rounding level relative to the first.</p><p>A fixed L fixes the output subspace span(L) once and for all; training R only moves within it. A trainable L can rotate that subspace during training, but at every step it still has dimension at most 8. A low-rank update does not make W+ΔW low rank: with W=I (rank 256) and ΔW rank 8, W+ΔW is generically still rank 256; only the change is restricted.</p><p>Rubric: (1) proves span containment from ΔWx=L(Rx); (2) verifies rank 8 numerically with a stated tolerance; (3) distinguishes fixed and trainable L; (4) gives an example showing W+ΔW need not be low rank.</p>"
},
C3: {
  "statement": "**C3 · Core · PyTorch — measure overlap without assuming the conclusion.** Generate \\(m\\) random unit vectors in \\(\\mathbb R^{64}\\) for \\(m\\in\\{32,64,128,1024\\}\\). Compute the largest absolute off-diagonal inner product. A starting point is:\n\n~~~python\nimport torch\n\ntorch.manual_seed(0)\nfor m in (32, 64, 128, 1024):\n    F = torch.randn(m, 64, dtype=torch.float64)\n    F = F / torch.linalg.vector_norm(F, dim=1, keepdim=True)\n    overlaps = (F @ F.T).abs()\n    overlaps.fill_diagonal_(0)\n    print(m, overlaps.max().item())\n~~~\n\nRepeat across several seeds and plot the results. Independence is impossible for \\(m>64\\), but maximum overlap is a separate measurement. Next construct \\(x=\\sum_i a_i f_i\\) with only a few nonzero activations and measure dot-product readout errors. Increase the number of active features. Explain why the largest pairwise overlap does not by itself determine the total interference.",
  "plain": "For m>64 dependence is forced (Corollary 5), and for m≤64 random directions are independent with probability one. Maximum absolute off-diagonal overlap grows with m, because more pairs give more chances for a large one; report the values per seed and their spread instead of asserting a number in advance.\n\nFor x=Σaᵢfᵢ with few active features, readout j is fⱼ·x=aⱼ+Σ_{i≠j}aᵢ fⱼ·fᵢ. The error is the cross-talk sum. It depends on how many features are active, their signs and magnitudes, and which pairs overlap, not only on the largest overlap: many small overlaps can add up, and a large overlap between two features that are never co-active costs nothing. Increasing the number of active features increases the typical error roughly like the square root of that number for random signs.\n\nA maximum pairwise overlap therefore neither bounds the accumulated interference by itself nor says anything about a trained network, whose features are not random and whose decoder may not be a plain dot product.\n\nRubric: (1) states forced dependence for m>64; (2) reports overlaps across seeds with spread; (3) writes the readout formula and identifies cross-talk; (4) measures error as active count grows; (5) explains why maximum overlap is insufficient and why random vectors are not a trained model.",
  "solution": "<p>For m&gt;64 dependence is forced (Corollary 5), and for m≤64 random directions are independent with probability one. Maximum absolute off-diagonal overlap grows with m, because more pairs give more chances for a large one; report the values per seed and their spread instead of asserting a number in advance.</p><p>For x=Σaᵢfᵢ with few active features, readout j is fⱼ·x=aⱼ+Σ_{i≠j}aᵢ fⱼ·fᵢ. The error is the cross-talk sum. It depends on how many features are active, their signs and magnitudes, and which pairs overlap, not only on the largest overlap: many small overlaps can add up, and a large overlap between two features that are never co-active costs nothing. Increasing the number of active features increases the typical error roughly like the square root of that number for random signs.</p><p>A maximum pairwise overlap therefore neither bounds the accumulated interference by itself nor says anything about a trained network, whose features are not random and whose decoder may not be a plain dot product.</p><p>Rubric: (1) states forced dependence for m&gt;64; (2) reports overlaps across seeds with spread; (3) writes the readout formula and identifies cross-talk; (4) measures error as active count grows; (5) explains why maximum overlap is insufficient and why random vectors are not a trained model.</p>"
},
C4: {
  "statement": "**C4 · Stretch · PyTorch — low-rank initialization is not a rank constraint.** Compare two bias-free models learning the identity map in 64 dimensions. Model one is `nn.Linear(64, 64, bias=False, dtype=torch.float64)`, initialized with the rank-4 weight \\(P=\\operatorname{diag}(1,1,1,1,0,\\dots,0)\\). Model two always uses \\(W=LR\\), with shapes \\((64,4)\\) and \\((4,64)\\), initialized with the corresponding first four standard basis columns and rows. Use \\(X=8I_{64}\\), target \\(X\\), and mean squared error over all entries; batches are row vectors, so predictions are `X @ W.T`.\n\nThe identity fixture makes the comparison exact: show that the loss equals \\(\\|W-I\\|_F^2/64\\), where \\(\\|M\\|_F^2\\) is the sum of squared entries of \\(M\\). Train both models with gradient descent and report their losses and ranks. Then derive the unrestricted weight after one step with learning rate \\(\\eta\\), give its exact rank, and find the learning rates for which repeated steps converge. Explain why initial rank does not constrain later parameter updates, while storing the weight as a product keeps the rank bound at every step.",
  "plain": "On X=8I the loss is ‖XWᵀ−X‖_F²/64²=64‖W−I‖_F²/64²=‖W−I‖_F²/64. A rank-at-most-4 W has a null space of dimension at least 60; for an orthonormal basis z₁,…,z₆₀ of it, ‖(W−I)zᵢ‖=‖zᵢ‖=1, so ‖W−I‖_F²≥60 and the loss is at least 60/64. P=diag(1,1,1,1,0,…,0) attains this. For the factored model, L=[e₁…e₄] and R=Lᵀ give LR=P, and the gradient with respect to the factors vanishes there, so it stays at loss 60/64=0.9375 and rank 4.\n\nThe unrestricted gradient is (W−I)/32, so one step gives W₁=P−(η/32)(P−I)=(1−η/32)P+(η/32)I. Its first four diagonal entries are 1 and the other 60 are η/32, so for every η>0 the exact rank is 64. The error evolves as W_{k+1}−I=(1−η/32)(W_k−I), which converges to 0 exactly when 0<η<64; η=32 reaches I in one step. The unrestricted optimum is 0.\n\nInitial rank is a property of the starting point, not of the parameterization: gradient steps add a full-rank multiple of I. Storing W=LR keeps rank ≤4 at every step because every product LR has rank at most 4.\n\nRubric: (1) derives the 60/64 lower bound and shows P attains it; (2) computes W₁ and its rank for all η>0; (3) states convergence for 0<η<64; (4) reports both final losses and ranks from training; (5) explains parameterization versus initialization.",
  "solution": "<p>On X=8I the loss is ‖XWᵀ−X‖_F²/64²=64‖W−I‖_F²/64²=‖W−I‖_F²/64. A rank-at-most-4 W has a null space of dimension at least 60; for an orthonormal basis z₁,…,z₆₀ of it, ‖(W−I)zᵢ‖=‖zᵢ‖=1, so ‖W−I‖_F²≥60 and the loss is at least 60/64. P=diag(1,1,1,1,0,…,0) attains this. For the factored model, L=[e₁…e₄] and R=Lᵀ give LR=P, and the gradient with respect to the factors vanishes there, so it stays at loss 60/64=0.9375 and rank 4.</p><p>The unrestricted gradient is (W−I)/32, so one step gives W₁=P−(η/32)(P−I)=(1−η/32)P+(η/32)I. Its first four diagonal entries are 1 and the other 60 are η/32, so for every η&gt;0 the exact rank is 64. The error evolves as W_{k+1}−I=(1−η/32)(W_k−I), which converges to 0 exactly when 0&lt;η&lt;64; η=32 reaches I in one step. The unrestricted optimum is 0.</p><p>Initial rank is a property of the starting point, not of the parameterization: gradient steps add a full-rank multiple of I. Storing W=LR keeps rank ≤4 at every step because every product LR has rank at most 4.</p><p>Rubric: (1) derives the 60/64 lower bound and shows P attains it; (2) computes W₁ and its rank for all η&gt;0; (3) states convergence for 0&lt;η&lt;64; (4) reports both final losses and ranks from training; (5) explains parameterization versus initialization.</p>"
},
C5: {
  "statement": "**C5 · Stretch · PyTorch — translate a claim you read.** Find “column space” or “rank” in a paper you are reading, or use the factored update in C2. Write two sentences: identify the matrix's input and output spaces, then state the geometric restriction. Add one thing the rank claim does not establish, such as feature meaning, downstream accuracy, or ease of optimization.",
  "plain": "A good answer names the matrix, its input and output spaces, and the restriction. For C2's update: ΔW maps R²⁵⁶ to R²⁵⁶, and every output lies in span(L), a subspace of dimension at most 8; equivalently rank ΔW≤8. The second sentence states what this rules out: the update cannot change outputs in more than 8 independent directions at once.\n\nWhat the rank claim does not establish: that those 8 directions carry any particular meaning, that the constrained update matches full fine-tuning accuracy, or that training finds a good B and A. Those are empirical and optimization questions.\n\nRubric: (1) identifies the input and output spaces with dimensions; (2) states the column-span or rank restriction precisely; (3) gives one concrete consequence of the restriction; (4) names at least one claim the rank statement does not support.",
  "solution": "<p>A good answer names the matrix, its input and output spaces, and the restriction. For C2's update: ΔW maps R²⁵⁶ to R²⁵⁶, and every output lies in span(L), a subspace of dimension at most 8; equivalently rank ΔW≤8. The second sentence states what this rules out: the update cannot change outputs in more than 8 independent directions at once.</p><p>What the rank claim does not establish: that those 8 directions carry any particular meaning, that the constrained update matches full fine-tuning accuracy, or that training finds a good B and A. Those are empirical and optimization questions.</p><p>Rubric: (1) identifies the input and output spaces with dimensions; (2) states the column-span or rank restriction precisely; (3) gives one concrete consequence of the restriction; (4) names at least one claim the rank statement does not support.</p>"
},
C6: {
  "statement": "**C6 · Core · PyTorch — probes and null spaces.** With `torch.manual_seed(0)` and `float64`, draw activations \\(H\\in\\mathbb R^{200\\times8}\\) from a standard normal and labels \\(y_i=\\mathbb 1[H_{i1}+H_{i2}>0]\\). Train a bias-free logistic-regression probe \\(w\\in\\mathbb R^8\\) by full-batch gradient descent from \\(w=0\\) (learning rate 0.5, 500 steps). Describe the null space of \\(w\\) in words and give its dimension. Form \\(z=e_3-w(w^Te_3)/(w^Tw)\\), edit every activation to \\(h_i'=h_i+5z\\), and report \\(w^Tz\\), \\(\\|5z\\|\\), \\(\\max_i|w^Th_i'-w^Th_i|\\), and the probe accuracy before and after. Then say what \"the probe's accuracy did not move\" does and does not imply.",
  "plain": "The null space {z: wᵀz=0} is the set of activation changes the probe cannot see; for nonzero w in R⁸ it has dimension 7. The trained w points mostly along (1,1,0,…,0)/√2, matching the labelling rule. z=e₃−w(wᵀe₃)/(wᵀw) removes from e₃ its component along w, so wᵀz=0 up to rounding (about 10⁻¹⁶), and because w has little e₃ component, ‖5z‖ is close to 5.\n\nEvery score wᵀhᵢ changes by at most rounding (about 10⁻¹⁵), so the probe's predictions and accuracy are identical before and after, even though every activation moved by about 5. \"Accuracy did not move\" therefore shows only that the edit lies (almost) in the probe's null space. It does not show that the representation was unchanged, that other features in h were unaffected, or that a different probe or the downstream model would be unaffected. Unchanged accuracy is weaker still than unchanged scores.\n\nRubric: (1) describes the null space and gives dimension 7; (2) reports wᵀz, ‖5z‖, the maximum score change and both accuracies; (3) explains the projection that makes z invisible to w; (4) separates what unchanged accuracy shows from what it does not.",
  "solution": "<p>The null space {z: wᵀz=0} is the set of activation changes the probe cannot see; for nonzero w in R⁸ it has dimension 7. The trained w points mostly along (1,1,0,…,0)/√2, matching the labelling rule. z=e₃−w(wᵀe₃)/(wᵀw) removes from e₃ its component along w, so wᵀz=0 up to rounding (about 10⁻¹⁶), and because w has little e₃ component, ‖5z‖ is close to 5.</p><p>Every score wᵀhᵢ changes by at most rounding (about 10⁻¹⁵), so the probe's predictions and accuracy are identical before and after, even though every activation moved by about 5. \"Accuracy did not move\" therefore shows only that the edit lies (almost) in the probe's null space. It does not show that the representation was unchanged, that other features in h were unaffected, or that a different probe or the downstream model would be unaffected. Unchanged accuracy is weaker still than unchanged scores.</p><p>Rubric: (1) describes the null space and gives dimension 7; (2) reports wᵀz, ‖5z‖, the maximum score change and both accuracies; (3) explains the projection that makes z invisible to w; (4) separates what unchanged accuracy shows from what it does not.</p>"
},
C7: {
  "statement": "**C7 · Core · PyTorch — what survives a change of coordinates.** Stack the activation vectors \\(v_1=(1,1,0,0)\\), \\(v_2=(1,-1,0,0)\\), \\(v_3=(0,0,1,1)\\), \\(v_4=v_1+v_3\\) as rows of a `float64` tensor and map each through the invertible \\(A=\\operatorname{diag}(2,1,1,3)\\). Before and after the map, report `torch.linalg.matrix_rank` of the stack, whether the relation \\(v_1+v_3-v_4=0\\) still holds for the images, whether the images of \\(v_1,v_2,v_3\\) are independent, \\(\\|v_1\\|\\), and the cosines of the pairs \\((v_1,v_2)\\) and \\((v_1,v_4)\\). Classify span, independence, dimension, rank, norm and cosine similarity as surviving or not, and relate the split to the inner-product section: the survivors are the properties that never needed a geometry.",
  "plain": "Before the map: rank 3, since v₄=v₁+v₃ and v₁,v₂,v₃ are independent. The images are Av₁=(2,1,0,0), Av₂=(2,−1,0,0), Av₃=(0,0,1,3), Av₄=(2,1,1,3); the relation Av₁+Av₃−Av₄=0 still holds because A is linear, the images of v₁,v₂,v₃ stay independent because A is invertible, and the rank stays 3.\n\nNorms and cosines change: ‖v₁‖=√2 becomes ‖Av₁‖=√5; cos(v₁,v₂)=0 becomes (4−1)/5=3/5; cos(v₁,v₄)=2/(√2·2)=1/√2≈0.707 becomes (4+1)/(√5·√15)=1/√3≈0.577.\n\nSurvive: span relations, independence, dimension and rank, which are defined from linear combinations alone. Do not survive: norm and cosine, which depend on the chosen inner product (section 11); A is not orthogonal, so it changes the geometry.\n\nRubric: (1) correct ranks and relation check before and after; (2) correct norm and both cosines before and after; (3) correct classification of all six properties; (4) explains the split by whether the property needs an inner product.",
  "solution": "<p>Before the map: rank 3, since v₄=v₁+v₃ and v₁,v₂,v₃ are independent. The images are Av₁=(2,1,0,0), Av₂=(2,−1,0,0), Av₃=(0,0,1,3), Av₄=(2,1,1,3); the relation Av₁+Av₃−Av₄=0 still holds because A is linear, the images of v₁,v₂,v₃ stay independent because A is invertible, and the rank stays 3.</p><p>Norms and cosines change: ‖v₁‖=√2 becomes ‖Av₁‖=√5; cos(v₁,v₂)=0 becomes (4−1)/5=3/5; cos(v₁,v₄)=2/(√2·2)=1/√2≈0.707 becomes (4+1)/(√5·√15)=1/√3≈0.577.</p><p>Survive: span relations, independence, dimension and rank, which are defined from linear combinations alone. Do not survive: norm and cosine, which depend on the chosen inner product (section 11); A is not orthogonal, so it changes the geometry.</p><p>Rubric: (1) correct ranks and relation check before and after; (2) correct norm and both cosines before and after; (3) correct classification of all six properties; (4) explains the split by whether the property needs an inner product.</p>"
},
M1: {
  "statement": "**M1 · Foundation · mixed — Three recipes.** For \\(u=(2,-1)\\), \\(v=(-6,3)\\), find three coefficient pairs producing \\((4,-2)\\). Describe all such pairs.",
  "plain": "Write a(2,−1)+b(−6,3)=(2a−6b, −a+3b). Since v=−3u, every combination is (a−3b)u, and (4,−2)=2u, so the condition is a−3b=2 (both coordinates give the same equation).\n\nThree pairs: (2,0), (5,1), (−1,−1). Check (5,1): (10−6, −5+3)=(4,−2). All pairs: (a,b)=(2+3t, t) for t∈R, a line of solutions. Any two pairs differ by a multiple of (3,1), which is the relation 3u+v=0.\n\nRubric: (1) reduces to the single equation a−3b=2; (2) gives three distinct valid pairs, each checked; (3) describes all pairs as a one-parameter family; (4) connects the non-uniqueness to the relation between u and v.",
  "solution": "<p>Write a(2,−1)+b(−6,3)=(2a−6b, −a+3b). Since v=−3u, every combination is (a−3b)u, and (4,−2)=2u, so the condition is a−3b=2 (both coordinates give the same equation).</p><p>Three pairs: (2,0), (5,1), (−1,−1). Check (5,1): (10−6, −5+3)=(4,−2). All pairs: (a,b)=(2+3t, t) for t∈R, a line of solutions. Any two pairs differ by a multiple of (3,1), which is the relation 3u+v=0.</p><p>Rubric: (1) reduces to the single equation a−3b=2; (2) gives three distinct valid pairs, each checked; (3) describes all pairs as a one-parameter family; (4) connects the non-uniqueness to the relation between u and v.</p>"
},
M2: {
  "statement": "**M2 · Foundation · mixed — Two dimensions, two descriptions.** For \\(B=((2,1),(1,1))\\), find the coordinates of \\((5,3)\\). Reverse the basis order and find the new coordinates.",
  "plain": "c₁(2,1)+c₂(1,1)=(5,3) gives 2c₁+c₂=5 and c₁+c₂=3. Subtracting, c₁=2, then c₂=1: [v]_B=(2,1). Check: 2(2,1)+(1,1)=(5,3).\n\nWith the order reversed, B'=((1,1),(2,1)), the same recipe reads 1·(1,1)+2·(2,1), so [v]_{B'}=(1,2). The ordered basis and the coordinate list change together; the vector does not change.\n\nRubric: (1) system solved and checked; (2) reversed order handled by reordering the coordinates, with a reason.",
  "solution": "<p>c₁(2,1)+c₂(1,1)=(5,3) gives 2c₁+c₂=5 and c₁+c₂=3. Subtracting, c₁=2, then c₂=1: [v]_B=(2,1). Check: 2(2,1)+(1,1)=(5,3).</p><p>With the order reversed, B'=((1,1),(2,1)), the same recipe reads 1·(1,1)+2·(2,1), so [v]_{B'}=(1,2). The ordered basis and the coordinate list change together; the vector does not change.</p><p>Rubric: (1) system solved and checked; (2) reversed order handled by reordering the coordinates, with a reason.</p>",
  "fields": [
    {
      "id": "c",
      "label": "coordinates in B",
      "type": "vec",
      "ans": [
        2,
        1
      ]
    },
    {
      "id": "reversed",
      "label": "coordinates after reversing B",
      "type": "vec",
      "ans": [
        1,
        2
      ]
    }
  ],
  "hints": {
    "c": "Solve 2c₁+c₂=5 and c₁+c₂=3; subtracting the equations isolates c₁.",
    "reversed": "Reversing the basis reverses the coordinate list; no new solve is needed."
  }
},
M3: {
  "statement": "**M3 · Foundation · mixed — Subspace or affine set.** Classify \\(2x-y+z=0\\) and \\(2x-y+z=3\\) in \\(\\mathbb R^3\\). Give a basis for the first and a point-plus-subspace description for the second.",
  "plain": "2x−y+z=0 is a subspace: it contains 0 and is closed under addition and scaling because the equation is homogeneous and linear. Solving z=y−2x gives (x,y,y−2x)=x(1,0,−2)+y(0,1,1), so a basis is (1,0,−2),(0,1,1): two independent vectors, dimension 2.\n\n2x−y+z=3 is not a subspace, because 0 does not satisfy it. It is an affine plane: the point (0,0,3) satisfies it, and any two solutions differ by a solution of the homogeneous equation. So it equals (0,0,3)+S with S the subspace above.\n\nRubric: (1) classifies both sets correctly with the failing condition named; (2) gives a correct basis and checks both vectors satisfy the equation; (3) gives a valid anchor point; (4) identifies the direction subspace as the solution set of the homogeneous equation.",
  "solution": "<p>2x−y+z=0 is a subspace: it contains 0 and is closed under addition and scaling because the equation is homogeneous and linear. Solving z=y−2x gives (x,y,y−2x)=x(1,0,−2)+y(0,1,1), so a basis is (1,0,−2),(0,1,1): two independent vectors, dimension 2.</p><p>2x−y+z=3 is not a subspace, because 0 does not satisfy it. It is an affine plane: the point (0,0,3) satisfies it, and any two solutions differ by a solution of the homogeneous equation. So it equals (0,0,3)+S with S the subspace above.</p><p>Rubric: (1) classifies both sets correctly with the failing condition named; (2) gives a correct basis and checks both vectors satisfy the equation; (3) gives a valid anchor point; (4) identifies the direction subspace as the solution set of the homogeneous equation.</p>"
},
M4: {
  "statement": "**M4 · Foundation · mixed — Independent but not orthogonal.** Give three vectors in \\(\\mathbb R^3\\) that are independent while every pair has a nonzero dot product, and verify both claims. Then explain why three nonzero, pairwise orthogonal vectors in \\(\\mathbb R^3\\) are automatically a basis.",
  "plain": "Example: (1,2,0), (0,1,2), (2,0,1).\n\nIndependence: a(1,2,0)+b(0,1,2)+c(2,0,1)=(a+2c, 2a+b, 2b+c)=0 gives a=−2c, b=−2a=4c, and then 2b+c=9c=0, so c=0 and a=b=0.\n\nNot orthogonal: the pairwise dot products are (1,2,0)·(0,1,2)=2, (1,2,0)·(2,0,1)=2 and (0,1,2)·(2,0,1)=2, all nonzero.\n\nThree nonzero pairwise orthogonal vectors are independent (section 11: dot a zero combination with each vector), and three independent vectors in the three-dimensional R³ form a basis by Theorem 12. Independence does not require right angles; right angles between nonzero vectors do force independence.\n\nRubric: (1) gives three explicit vectors in R³; (2) proves independence from the zero-combination definition; (3) computes all three dot products; (4) proves the orthogonal-implies-basis claim using the section 11 argument and Theorem 12.",
  "solution": "<p>Example: (1,2,0), (0,1,2), (2,0,1).</p><p>Independence: a(1,2,0)+b(0,1,2)+c(2,0,1)=(a+2c, 2a+b, 2b+c)=0 gives a=−2c, b=−2a=4c, and then 2b+c=9c=0, so c=0 and a=b=0.</p><p>Not orthogonal: the pairwise dot products are (1,2,0)·(0,1,2)=2, (1,2,0)·(2,0,1)=2 and (0,1,2)·(2,0,1)=2, all nonzero.</p><p>Three nonzero pairwise orthogonal vectors are independent (section 11: dot a zero combination with each vector), and three independent vectors in the three-dimensional R³ form a basis by Theorem 12. Independence does not require right angles; right angles between nonzero vectors do force independence.</p><p>Rubric: (1) gives three explicit vectors in R³; (2) proves independence from the zero-combination definition; (3) computes all three dot products; (4) proves the orthogonal-implies-basis claim using the section 11 argument and Theorem 12.</p>"
},
M5: {
  "statement": "**M5 · Core · mixed — Coordinates carry relations.** Let \\(B\\) be a basis of an \\(n\\)-dimensional space \\(V\\). Prove that \\(w_1,\\dots,w_k\\) are independent in \\(V\\) exactly when \\([w_1]_B,\\dots,[w_k]_B\\) are independent in \\(\\mathbb R^n\\). Use this with the basis \\((1,x,x^2)\\) to find a dependency relation among \\(1+2x\\), \\(x-x^2\\), \\(1+x+x^2\\).",
  "plain": "The coordinate map v↦[v]_B is linear (section 10): [Σaᵢwᵢ]_B=Σaᵢ[wᵢ]_B. It is also one-to-one, because [v]_B=0 means v=0·b₁+…+0·b_n=0.\n\n(⇒) If Σaᵢ[wᵢ]_B=0, then [Σaᵢwᵢ]_B=0, so Σaᵢwᵢ=0, and independence of the wᵢ gives every aᵢ=0.\n(⇐) If Σaᵢwᵢ=0, then Σaᵢ[wᵢ]_B=[0]_B=0, and independence of the coordinate vectors gives every aᵢ=0. So a list and its coordinate lists satisfy exactly the same relations.\n\nApplication: in (1,x,x²) the lists are (1,2,0), (0,1,−1), (1,1,1). Solving a(1,2,0)+b(0,1,−1)+c(1,1,1)=0: a+c=0, 2a+b+c=0, −b+c=0 gives c=−a, b=c=−a and 2a−a−a=0 for every a. With a=1: (1,−1,−1). Check: (1+2x)−(x−x²)−(1+x+x²)=0.\n\nRubric: (1) states and uses linearity and one-to-one-ness of the coordinate map; (2) proves both directions; (3) coefficient lists written correctly in (1,x,x²); (4) relation found and checked on the polynomials.",
  "solution": "<p>The coordinate map v↦[v]_B is linear (section 10): [Σaᵢwᵢ]_B=Σaᵢ[wᵢ]_B. It is also one-to-one, because [v]_B=0 means v=0·b₁+…+0·b_n=0.</p><p>(⇒) If Σaᵢ[wᵢ]_B=0, then [Σaᵢwᵢ]_B=0, so Σaᵢwᵢ=0, and independence of the wᵢ gives every aᵢ=0.\n(⇐) If Σaᵢwᵢ=0, then Σaᵢ[wᵢ]_B=[0]_B=0, and independence of the coordinate vectors gives every aᵢ=0. So a list and its coordinate lists satisfy exactly the same relations.</p><p>Application: in (1,x,x²) the lists are (1,2,0), (0,1,−1), (1,1,1). Solving a(1,2,0)+b(0,1,−1)+c(1,1,1)=0: a+c=0, 2a+b+c=0, −b+c=0 gives c=−a, b=c=−a and 2a−a−a=0 for every a. With a=1: (1,−1,−1). Check: (1+2x)−(x−x²)−(1+x+x²)=0.</p><p>Rubric: (1) states and uses linearity and one-to-one-ness of the coordinate map; (2) proves both directions; (3) coefficient lists written correctly in (1,x,x²); (4) relation found and checked on the polynomials.</p>",
  "fields": [
    {
      "id": "rel",
      "label": "coefficients on (1+2x, x−x², 1+x+x²)",
      "type": "ratio",
      "ans": [
        1,
        -1,
        -1
      ]
    }
  ],
  "hints": {
    "rel": "The coefficient lists are (1,2,0), (0,1,−1), (1,1,1). Solve a+c=0, 2a+b+c=0, −b+c=0."
  }
},
M6: {
  "statement": "**M6 · Core · mixed — Find the hidden relation.** Let \\(u=(1,2,-1)\\), \\(v=(2,1,3)\\), \\(w=(4,5,1)\\). Find a nonzero relation, a basis of the span, and all coefficient lists expressing \\(w\\) with these three generators.",
  "plain": "Solve w=au+bv: a+2b=4 and 2a+b=5 give a=2, b=1, and the third coordinate checks: 2(−1)+1·3=1. So w=2u+v and 2u+v−w=0 is a relation, coefficients (2,1,−1).\n\nu and v are not multiples, so they are independent and form a basis of the span, which is a plane through the origin (dimension 2). A normal n=(p,q,r) must satisfy n·u=p+2q−r=0 and n·v=2p+q+3r=0; subtracting twice the first from the second gives −3q+5r=0, so r=3, q=5 and p=r−2q=−7, i.e. n=(−7,5,3). The plane is 7x−5y−3z=0 (check with w: 28−25−3=0).\n\nAll recipes for w: (a,b,c) with au+bv+cw=w means (a,b,c−1) is a multiple of the relation, so (a,b,c)=(2s, s, 1−s) for s∈R. For example s=0 gives (0,0,1) and s=1 gives (2,1,0).\n\nRubric: (1) relation found and checked in all coordinates; (2) basis of the span justified; (3) all recipes for w described as a one-parameter family.",
  "solution": "<p>Solve w=au+bv: a+2b=4 and 2a+b=5 give a=2, b=1, and the third coordinate checks: 2(−1)+1·3=1. So w=2u+v and 2u+v−w=0 is a relation, coefficients (2,1,−1).</p><p>u and v are not multiples, so they are independent and form a basis of the span, which is a plane through the origin (dimension 2). A normal n=(p,q,r) must satisfy n·u=p+2q−r=0 and n·v=2p+q+3r=0; subtracting twice the first from the second gives −3q+5r=0, so r=3, q=5 and p=r−2q=−7, i.e. n=(−7,5,3). The plane is 7x−5y−3z=0 (check with w: 28−25−3=0).</p><p>All recipes for w: (a,b,c) with au+bv+cw=w means (a,b,c−1) is a multiple of the relation, so (a,b,c)=(2s, s, 1−s) for s∈R. For example s=0 gives (0,0,1) and s=1 gives (2,1,0).</p><p>Rubric: (1) relation found and checked in all coordinates; (2) basis of the span justified; (3) all recipes for w described as a one-parameter family.</p>",
  "fields": [
    {
      "id": "rel",
      "label": "relation coefficients on (u, v, w)",
      "type": "ratio",
      "ans": [
        2,
        1,
        -1
      ]
    },
    {
      "id": "dim",
      "label": "dimension of the span",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "rel": "Try w=au+bv: the first two coordinates give a+2b=4 and 2a+b=5. Check the third coordinate.",
    "dim": "u and v are not multiples of each other, and w is a combination of them."
  }
},
M7: {
  "statement": "**M7 · Core · mixed — Same geometry in different coordinates.** Set \\(B=\\operatorname{diag}(2,1)\\), \\(x=(1,3)\\), and \\(y=(3,-1)\\). Compute the dot product of their standard coordinates, the raw dot product of their \\(B\\)-coordinates, and the dot product using the Gram matrix \\(B^TB\\). Explain the discrepancy.",
  "plain": "x·y=1·3+3·(−1)=0, so x and y are perpendicular. The B-coordinates are c=(1/2,3) and d=(3/2,−1), whose raw dot product is 3/4−3=−9/4. With BᵀB=diag(4,1), cᵀ(BᵀB)d=4·(3/4)+1·(−3)=0, which recovers the standard answer.\n\nThe raw coordinate dot product treats the basis vectors (2,0) and (0,1) as if they had equal unit length, so it computes angles in a different geometry. Weighting by the Gram matrix restores the original one.\n\nRubric: (1) three products correct; (2) B-coordinates computed correctly; (3) explains that raw coordinates use a different inner product and that BᵀB restores the original.",
  "solution": "<p>x·y=1·3+3·(−1)=0, so x and y are perpendicular. The B-coordinates are c=(1/2,3) and d=(3/2,−1), whose raw dot product is 3/4−3=−9/4. With BᵀB=diag(4,1), cᵀ(BᵀB)d=4·(3/4)+1·(−3)=0, which recovers the standard answer.</p><p>The raw coordinate dot product treats the basis vectors (2,0) and (0,1) as if they had equal unit length, so it computes angles in a different geometry. Weighting by the Gram matrix restores the original one.</p><p>Rubric: (1) three products correct; (2) B-coordinates computed correctly; (3) explains that raw coordinates use a different inner product and that BᵀB restores the original.</p>",
  "fields": [
    {
      "id": "standard",
      "label": "standard dot product",
      "type": "num",
      "ans": 0
    },
    {
      "id": "raw",
      "label": "raw coordinate dot product",
      "type": "num",
      "ans": -2.25
    },
    {
      "id": "metric",
      "label": "Gram-weighted dot product",
      "type": "num",
      "ans": 0
    }
  ],
  "hints": {
    "standard": "Multiply (1,3) and (3,−1) coordinate by coordinate and add.",
    "raw": "Coordinates in diag(2,1) halve the first entry: (1/2,3) and (3/2,−1). Enter the result as a fraction.",
    "metric": "BᵀB=diag(4,1). Weight the product of first coordinates by 4."
  }
},
M8: {
  "statement": "**M8 · Core · mixed — A union claim.** Prove that \\(U\\cup Y\\) is a subspace exactly when \\(U\\subseteq Y\\) or \\(Y\\subseteq U\\). Your proof must establish both directions.",
  "plain": "(⇐) If U⊆Y, then U∪Y=Y, a subspace; symmetrically if Y⊆U.\n\n(⇒) Suppose neither contains the other. Choose u∈U with u∉Y and w∈Y with w∉U. Both lie in U∪Y. If u+w were in U, then w=(u+w)−u would be in U, a contradiction. If u+w were in Y, then u=(u+w)−w would be in Y, a contradiction. So u+w∉U∪Y, and the union is not closed under addition. By contraposition, if the union is a subspace then one contains the other.\n\nRubric: (1) proves the easy direction; (2) chooses elements outside the other subspace, not arbitrary ones; (3) rules out u+w∈U and u+w∈Y separately using closure under subtraction; (4) states the conclusion as the contrapositive correctly.",
  "solution": "<p>(⇐) If U⊆Y, then U∪Y=Y, a subspace; symmetrically if Y⊆U.</p><p>(⇒) Suppose neither contains the other. Choose u∈U with u∉Y and w∈Y with w∉U. Both lie in U∪Y. If u+w were in U, then w=(u+w)−u would be in U, a contradiction. If u+w were in Y, then u=(u+w)−w would be in Y, a contradiction. So u+w∉U∪Y, and the union is not closed under addition. By contraposition, if the union is a subspace then one contains the other.</p><p>Rubric: (1) proves the easy direction; (2) chooses elements outside the other subspace, not arbitrary ones; (3) rules out u+w∈U and u+w∈Y separately using closure under subtraction; (4) states the conclusion as the contrapositive correctly.</p>"
},
M9: {
  "statement": "**M9 · Stretch · mixed — Several relations at once.** A \\(4\\times7\\) matrix has rank 4, so its full SVD returns four positive singular values. How many independent dependency relations do its columns have, which rows of the full factor `Vh` supply them, and what are the shapes of `U`, the singular values and `Vh` in the full and the reduced SVD?",
  "plain": "The columns are seven vectors in R⁴, so they are dependent (Corollary 5). The rows of the full Vh (shape 7×7) are orthonormal; the first four pair with the four positive singular values, and the last three are sent to 0 by the matrix. Those three rows are three independent relations (orthonormal vectors are independent). Every relation is a combination of them, because the null space has dimension 7−4=3 (rank–nullity, proved in LA02).\n\nShapes: full SVD gives U 4×4, four singular values, Vh 7×7. Reduced SVD gives U 4×4, four singular values, Vh 4×7; it omits the three null directions entirely, so no row of the reduced Vh is a relation.\n\nRubric: (1) dependence from the dimension count; (2) identifies the last three rows of the full Vh and why they are independent; (3) cites rank–nullity for 'every relation'; (4) all shapes for both variants.",
  "solution": "<p>The columns are seven vectors in R⁴, so they are dependent (Corollary 5). The rows of the full Vh (shape 7×7) are orthonormal; the first four pair with the four positive singular values, and the last three are sent to 0 by the matrix. Those three rows are three independent relations (orthonormal vectors are independent). Every relation is a combination of them, because the null space has dimension 7−4=3 (rank–nullity, proved in LA02).</p><p>Shapes: full SVD gives U 4×4, four singular values, Vh 7×7. Reduced SVD gives U 4×4, four singular values, Vh 4×7; it omits the three null directions entirely, so no row of the reduced Vh is a relation.</p><p>Rubric: (1) dependence from the dimension count; (2) identifies the last three rows of the full Vh and why they are independent; (3) cites rank–nullity for 'every relation'; (4) all shapes for both variants.</p>",
  "fields": [
    {
      "id": "k",
      "label": "number of independent dependency relations",
      "type": "num",
      "ans": 3
    }
  ],
  "hints": {
    "k": "Seven columns, rank four: count the right singular vectors that are not paired with a returned singular value."
  }
},
M10: {
  "statement": "**M10 · Stretch · mixed — Diagnose a misleading numerical report.** Someone reports “the basis is safe: the reconstruction error is tiny and the Hadamard ratio is 1.” Use \\(B=\\operatorname{diag}(1,10^{-5})\\) to construct a counterexample based on input perturbation. Name the claim the residual does support.",
  "plain": "B=diag(1,10⁻⁵) has perpendicular columns, so its Hadamard ratio is 1. Take v=(1,0): its coordinates are (1,0). Perturb the input by (0,10⁻⁵) to v'=(1,10⁻⁵): its coordinates are (1,1). An input change of size 10⁻⁵ moved the coordinates by 1, an amplification of 10⁵ (the condition number). Both solves reconstruct their inputs essentially exactly, so both residuals are tiny.\n\nThe report is therefore misleading: the Hadamard ratio sees only angular collapse, and the residual shows only that the computed coordinates reproduce the given input. What the residual supports is \"these coordinates reconstruct this input accurately\"; it says nothing about how the coordinates respond to errors in the input.\n\nRubric: (1) gives an explicit input and perturbation with both coordinate vectors; (2) computes the amplification factor; (3) explains why both residuals are small and the ratio is 1; (4) names the claim the residual supports and the one it does not.",
  "solution": "<p>B=diag(1,10⁻⁵) has perpendicular columns, so its Hadamard ratio is 1. Take v=(1,0): its coordinates are (1,0). Perturb the input by (0,10⁻⁵) to v'=(1,10⁻⁵): its coordinates are (1,1). An input change of size 10⁻⁵ moved the coordinates by 1, an amplification of 10⁵ (the condition number). Both solves reconstruct their inputs essentially exactly, so both residuals are tiny.</p><p>The report is therefore misleading: the Hadamard ratio sees only angular collapse, and the residual shows only that the computed coordinates reproduce the given input. What the residual supports is \"these coordinates reconstruct this input accurately\"; it says nothing about how the coordinates respond to errors in the input.</p><p>Rubric: (1) gives an explicit input and perturbation with both coordinate vectors; (2) computes the amplification factor; (3) explains why both residuals are small and the ratio is 1; (4) names the claim the residual supports and the one it does not.</p>"
},
M11: {
  "statement": "**M11 · Stretch · mixed — Keep the logits unchanged.** Row embeddings transform as \\(x'=xA\\), where \\(A\\in\\mathbb R^{d\\times d}\\) is invertible. Original logits are \\(xW\\), with \\(W\\in\\mathbb R^{d\\times k}\\). Derive the new downstream weights that preserve every logit. Does Euclidean cosine between embeddings have to remain unchanged?",
  "plain": "We want x'W'=xW for every row x. Substitute x'=xA: xAW'=xW for every x. Choosing W'=A⁻¹W works, since xAA⁻¹W=xW. It is the only choice: taking x to be each standard basis row gives AW'=W, and A is invertible, so W'=A⁻¹W. Shapes: A⁻¹ is d×d and W is d×k, so W' is d×k.\n\nCosine need not be preserved. A invertible can scale or shear directions unequally. Example: d=2, A=diag(2,1), x=(1,1), y=(1,−1). Before, x·y=0, so the cosine is 0. After, xA=(2,1) and yA=(2,−1), with dot product 3 and cosine 3/5. The logits are unchanged, yet the embedding geometry changed. Dot products are preserved exactly when A is orthogonal (AAᵀ=I, so xA·yA=x·y); cosines are preserved when A is a nonzero scalar multiple of an orthogonal matrix, since the common factor cancels in the ratio.\n\nRubric: (1) derives W'=A⁻¹W and checks the shapes; (2) argues uniqueness or at least verifies the formula for every x; (3) gives an explicit example where cosine changes; (4) states when cosine would be preserved.",
  "solution": "<p>We want x'W'=xW for every row x. Substitute x'=xA: xAW'=xW for every x. Choosing W'=A⁻¹W works, since xAA⁻¹W=xW. It is the only choice: taking x to be each standard basis row gives AW'=W, and A is invertible, so W'=A⁻¹W. Shapes: A⁻¹ is d×d and W is d×k, so W' is d×k.</p><p>Cosine need not be preserved. A invertible can scale or shear directions unequally. Example: d=2, A=diag(2,1), x=(1,1), y=(1,−1). Before, x·y=0, so the cosine is 0. After, xA=(2,1) and yA=(2,−1), with dot product 3 and cosine 3/5. The logits are unchanged, yet the embedding geometry changed. Dot products are preserved exactly when A is orthogonal (AAᵀ=I, so xA·yA=x·y); cosines are preserved when A is a nonzero scalar multiple of an orthogonal matrix, since the common factor cancels in the ratio.</p><p>Rubric: (1) derives W'=A⁻¹W and checks the shapes; (2) argues uniqueness or at least verifies the formula for every x; (3) gives an explicit example where cosine changes; (4) states when cosine would be preserved.</p>"
},
M12: {
  "statement": "**M12 · Stretch · mixed — Audit a claim about rank-one gradients.** For a linear layer \\(y=Wx\\) trained on one example \\((x,t)\\) with loss \\(\\tfrac12\\|Wx-t\\|^2\\), show that the gradient with respect to \\(W\\) is \\((Wx-t)x^T\\), a matrix of rank at most one. Someone concludes: “so training can only ever change \\(W\\) along one direction.” Starting from \\(W_0=0\\in\\mathbb R^{2\\times2}\\), take one step with learning rate 1 on the example \\((e_1,e_1)\\) and then one on \\((e_2,e_2)\\); report \\(W_2\\) and its rank. State the correct claim about \\(W_k-W_0\\) after \\(k\\) single-example steps.",
  "plain": "Gradient: the loss is ½Σᵢ((Wx)ᵢ−tᵢ)², and ∂/∂Wᵢⱼ of it is ((Wx)ᵢ−tᵢ)xⱼ, so the gradient is the outer product (Wx−t)xᵀ. Every column of an outer product is a multiple of Wx−t, so its rank is at most one.\n\nStep 1, example (e₁,e₁): W₀e₁−e₁=−e₁, gradient −e₁e₁ᵀ, so W₁=0−1·(−e₁e₁ᵀ)=e₁e₁ᵀ. Step 2, example (e₂,e₂): W₁e₂=0, so W₁e₂−e₂=−e₂, gradient −e₂e₂ᵀ, and W₂=e₁e₁ᵀ+e₂e₂ᵀ=I. Its rank is 2, so the claim is false.\n\nCorrect claim: each single-example step changes W by a matrix of rank at most one, so W_k−W₀ is a sum of k such matrices; its columns lie in the span of the k vectors Wx−t used, so rank(W_k−W₀)≤k. Many steps on varied examples can move W in every direction.\n\nRubric: (1) derives the gradient entry by entry and shows rank ≤1; (2) computes W₁ and W₂ correctly; (3) states rank(W₂)=2 and that the claim fails; (4) states and justifies rank(W_k−W₀)≤k.",
  "solution": "<p>Gradient: the loss is ½Σᵢ((Wx)ᵢ−tᵢ)², and ∂/∂Wᵢⱼ of it is ((Wx)ᵢ−tᵢ)xⱼ, so the gradient is the outer product (Wx−t)xᵀ. Every column of an outer product is a multiple of Wx−t, so its rank is at most one.</p><p>Step 1, example (e₁,e₁): W₀e₁−e₁=−e₁, gradient −e₁e₁ᵀ, so W₁=0−1·(−e₁e₁ᵀ)=e₁e₁ᵀ. Step 2, example (e₂,e₂): W₁e₂=0, so W₁e₂−e₂=−e₂, gradient −e₂e₂ᵀ, and W₂=e₁e₁ᵀ+e₂e₂ᵀ=I. Its rank is 2, so the claim is false.</p><p>Correct claim: each single-example step changes W by a matrix of rank at most one, so W_k−W₀ is a sum of k such matrices; its columns lie in the span of the k vectors Wx−t used, so rank(W_k−W₀)≤k. Many steps on varied examples can move W in every direction.</p><p>Rubric: (1) derives the gradient entry by entry and shows rank ≤1; (2) computes W₁ and W₂ correctly; (3) states rank(W₂)=2 and that the claim fails; (4) states and justifies rank(W_k−W₀)≤k.</p>",
  "fields": [
    {
      "id": "W2",
      "label": "W₂, entries row by row",
      "type": "vec",
      "ans": [
        1,
        0,
        0,
        1
      ]
    },
    {
      "id": "r",
      "label": "rank of W₂",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "W2": "Step 1: W₀e₁−e₁=−e₁, so the gradient is −e₁e₁ᵀ and W₁=e₁e₁ᵀ. Step 2 uses W₁e₂=0.",
    "r": "Two rank-one updates along different directions can add up to rank two."
  }
},
M13: {
  "statement": "**M13 · Stretch · mixed — Scale-aware rank reporting.** For \\(A=\\operatorname{diag}(4,\\,2\\cdot10^{-7})\\), report the exact rank and the numerical rank under the rule “count gains strictly larger than \\(10^{-6}\\)”. Repeat for \\(10^3A\\). Then apply the relative rule “count gains larger than \\(10^{-6}\\) times the largest gain” to both, and say which claims are invariant under the rescaling.",
  "plain": "The gains of A are 4 and 2·10⁻⁷; those of 10³A are 4000 and 2·10⁻⁴. Both are nonzero in both cases, so the exact rank is 2 before and after rescaling.\n\nFixed rule (count gains above 10⁻⁶): A gives 1, since 2·10⁻⁷ is below the threshold; 10³A gives 2, since 2·10⁻⁴ is above it. Relative rule: the thresholds are 4·10⁻⁶ and 4·10⁻³, and the small gain falls below each, so both give 1.\n\nInvariant under the common rescaling: the exact rank and the relative-rule rank. The fixed-threshold rank changes, so a numerical rank must be reported with its rule.\n\nRubric: (1) exact rank justified by nonzero gains; (2) fixed-rule counts before and after; (3) relative-rule counts with their thresholds; (4) names the invariant claims.",
  "solution": "<p>The gains of A are 4 and 2·10⁻⁷; those of 10³A are 4000 and 2·10⁻⁴. Both are nonzero in both cases, so the exact rank is 2 before and after rescaling.</p><p>Fixed rule (count gains above 10⁻⁶): A gives 1, since 2·10⁻⁷ is below the threshold; 10³A gives 2, since 2·10⁻⁴ is above it. Relative rule: the thresholds are 4·10⁻⁶ and 4·10⁻³, and the small gain falls below each, so both give 1.</p><p>Invariant under the common rescaling: the exact rank and the relative-rule rank. The fixed-threshold rank changes, so a numerical rank must be reported with its rule.</p><p>Rubric: (1) exact rank justified by nonzero gains; (2) fixed-rule counts before and after; (3) relative-rule counts with their thresholds; (4) names the invariant claims.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "exact rank; fixed rule for A; fixed rule for 10³A; relative rule for A; relative rule for 10³A",
      "type": "vec",
      "ans": [
        2,
        1,
        2,
        1,
        1
      ]
    }
  ],
  "hints": {
    "audit": "The gains are 4 and 2·10⁻⁷, then 4000 and 2·10⁻⁴. The relative threshold is 10⁻⁶ times the largest gain in each case."
  }
},
K1: {
  "statement": "**K1 · Checkpoint · gate — Define and explain.** State linear independence from memory. Explain why the zero-combination definition is useful and prove its equivalence to “no vector is in the span of the others.”",
  "proof": true,
  "plain": "Definition: v₁,…,v_k are linearly independent if c₁v₁+…+c_kv_k=0 holds only for c₁=…=c_k=0.\n\nWhy this form: it treats all k vectors symmetrically, needs no choice of a special vector, and is a homogeneous linear system that elimination can decide; it also makes uniqueness of coordinates a one-line subtraction.\n\nEquivalence with \"no vector is in the span of the others\" (for k≥1). If some v_j=Σ_{i≠j}aᵢvᵢ, then Σ_{i≠j}aᵢvᵢ−v_j=0 is a relation with coefficient −1≠0 on v_j, so the list is dependent. Conversely, if Σcᵢvᵢ=0 with some coefficient nonzero, choose j with c_j≠0; then v_j=Σ_{i≠j}(−cᵢ/c_j)vᵢ lies in the span of the others. Taking contrapositives, the list is independent exactly when no vector lies in the span of the others.\n\nRubric: (1) states the definition with \"only\" and all coefficients; (2) gives at least one real reason for the zero-combination form; (3) proves both directions; (4) chooses an index with nonzero coefficient before dividing; (5) points to the −1 coefficient as the nonzero one in the converse.",
  "solution": "<p>Definition: v₁,…,v_k are linearly independent if c₁v₁+…+c_kv_k=0 holds only for c₁=…=c_k=0.</p><p>Why this form: it treats all k vectors symmetrically, needs no choice of a special vector, and is a homogeneous linear system that elimination can decide; it also makes uniqueness of coordinates a one-line subtraction.</p><p>Equivalence with \"no vector is in the span of the others\" (for k≥1). If some v_j=Σ_{i≠j}aᵢvᵢ, then Σ_{i≠j}aᵢvᵢ−v_j=0 is a relation with coefficient −1≠0 on v_j, so the list is dependent. Conversely, if Σcᵢvᵢ=0 with some coefficient nonzero, choose j with c_j≠0; then v_j=Σ_{i≠j}(−cᵢ/c_j)vᵢ lies in the span of the others. Taking contrapositives, the list is independent exactly when no vector lies in the span of the others.</p><p>Rubric: (1) states the definition with \"only\" and all coefficients; (2) gives at least one real reason for the zero-combination form; (3) proves both directions; (4) chooses an index with nonzero coefficient before dividing; (5) points to the −1 coefficient as the nonzero one in the converse.</p>"
},
K2: {
  "statement": "**K2 · Checkpoint · gate — Find the redundancy in four dimensions.** For \\(u=(1,0,2,1)\\), \\(v=(0,1,1,-1)\\), \\(w=(2,-3,1,5)\\), decide independence, give an explicit dependency relation if one exists, and give the dimension of the span and a basis for it.",
  "plain": "Try w=au+bv. The first coordinate gives a=2 and the second gives b=−3. Check the others: third 2·2+(−3)·1=1 and fourth 2·1+(−3)(−1)=5, both matching w=(2,−3,1,5). So w=2u−3v and 2u−3v−w=0: the list is dependent, with relation (2,−3,−1).\n\nu and v are not multiples of each other (u has second coordinate 0, v does not, and v has first coordinate 0, u does not), so they are independent. The span is the plane in R⁴ with basis (u,v): dimension 2.\n\nRubric: (1) relation found and checked in all four coordinates; (2) independence of u, v justified; (3) dimension and basis stated.",
  "solution": "<p>Try w=au+bv. The first coordinate gives a=2 and the second gives b=−3. Check the others: third 2·2+(−3)·1=1 and fourth 2·1+(−3)(−1)=5, both matching w=(2,−3,1,5). So w=2u−3v and 2u−3v−w=0: the list is dependent, with relation (2,−3,−1).</p><p>u and v are not multiples of each other (u has second coordinate 0, v does not, and v has first coordinate 0, u does not), so they are independent. The span is the plane in R⁴ with basis (u,v): dimension 2.</p><p>Rubric: (1) relation found and checked in all four coordinates; (2) independence of u, v justified; (3) dimension and basis stated.</p>",
  "fields": [
    {
      "id": "rel",
      "label": "relation coefficients on (u, v, w)",
      "type": "ratio",
      "ans": [
        2,
        -3,
        -1
      ]
    },
    {
      "id": "dim",
      "label": "dimension of the span",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "rel": "Try w=au+bv: the first coordinate gives a and the second gives b. Check the last two coordinates.",
    "dim": "u and v are not parallel; w is a combination of them."
  }
},
K3: {
  "statement": "**K3 · Checkpoint · gate — Complements are not unique.** Prove or disprove: if \\(V=U\\oplus Y\\) and \\(V=U\\oplus Y'\\), then \\(Y=Y'\\). Then prove what is determined: \\(\\dim Y=\\dim V-\\dim U\\) when \\(V\\) is finite-dimensional.",
  "proof": true,
  "plain": "Disprove. In V=R², let U be the x-axis, Y the y-axis and Y' the line y=x. U∩Y={0} and U∩Y'={0}, and each sum has dimension 1+1=2, so R²=U⊕Y=U⊕Y' by Theorems 15, 16 and 13. But Y≠Y'. Complements are not unique.\n\nWhat is determined is the dimension. If V=U⊕Y, then U∩Y={0}, so Theorem 16 gives dim V=dim(U+Y)=dim U+dim Y−0, hence dim Y=dim V−dim U. The same holds for Y', so every complement of U has the same dimension even though the subspaces differ.\n\nRubric: (1) gives an explicit counterexample and verifies both sums are direct and equal to V; (2) shows Y≠Y'; (3) derives dim Y=dim V−dim U from the dimension formula with U∩Y={0}; (4) states clearly what is and is not determined.",
  "solution": "<p>Disprove. In V=R², let U be the x-axis, Y the y-axis and Y' the line y=x. U∩Y={0} and U∩Y'={0}, and each sum has dimension 1+1=2, so R²=U⊕Y=U⊕Y' by Theorems 15, 16 and 13. But Y≠Y'. Complements are not unique.</p><p>What is determined is the dimension. If V=U⊕Y, then U∩Y={0}, so Theorem 16 gives dim V=dim(U+Y)=dim U+dim Y−0, hence dim Y=dim V−dim U. The same holds for Y', so every complement of U has the same dimension even though the subspaces differ.</p><p>Rubric: (1) gives an explicit counterexample and verifies both sums are direct and equal to V; (2) shows Y≠Y'; (3) derives dim Y=dim V−dim U from the dimension formula with U∩Y={0}; (4) states clearly what is and is not determined.</p>"
},
K4: {
  "statement": "**K4 · Checkpoint · gate — Debug an independence test.** A colleague's `is_independent(vectors, tol)` returns `True` whenever no two of the vectors are parallel, testing each pair with \\(|u\\cdot v|<(1-\\mathrm{tol})\\|u\\|\\|v\\|\\). Give three vectors in \\(\\mathbb R^3\\) on which it returns the wrong answer, explain the bug using Theorem 1, and describe a correct test built on `dependency_relation`, with one regression test you would add.",
  "plain": "Failing input: (1,0,1), (0,1,1), (1,1,2). No two are parallel, so every pair passes and the function returns True; but (1,0,1)+(0,1,1)−(1,1,2)=0, so the list is dependent.\n\nThe bug: Theorem 1 says dependence means some vector lies in the span of all the others, not necessarily in the span of one other. A pairwise test detects only relations that involve two vectors. It is correct for lists of length 2 and wrong in general.\n\nCorrect test: is_independent(vectors, tol) returns dependency_relation(vectors, tol) is None. That function eliminates on the whole list and either returns a normalized relation c with Vc≈0 or None; it detects relations of any size. Regression tests: the failing triple above must return False; the pairwise-independent triple (1,0),(0,1),(1,1) must return False; the standard basis of R³ must return True; and any list with more vectors than coordinates must return False.\n\nRubric: (1) gives a concrete input on which the pairwise test is wrong and shows the relation; (2) explains the bug with Theorem 1 (a vector in the span of several others); (3) proposes a test on the whole list via dependency_relation; (4) adds at least one regression test with its expected output.",
  "solution": "<p>Failing input: (1,0,1), (0,1,1), (1,1,2). No two are parallel, so every pair passes and the function returns True; but (1,0,1)+(0,1,1)−(1,1,2)=0, so the list is dependent.</p><p>The bug: Theorem 1 says dependence means some vector lies in the span of all the others, not necessarily in the span of one other. A pairwise test detects only relations that involve two vectors. It is correct for lists of length 2 and wrong in general.</p><p>Correct test: is_independent(vectors, tol) returns dependency_relation(vectors, tol) is None. That function eliminates on the whole list and either returns a normalized relation c with Vc≈0 or None; it detects relations of any size. Regression tests: the failing triple above must return False; the pairwise-independent triple (1,0),(0,1),(1,1) must return False; the standard basis of R³ must return True; and any list with more vectors than coordinates must return False.</p><p>Rubric: (1) gives a concrete input on which the pairwise test is wrong and shows the relation; (2) explains the bug with Theorem 1 (a vector in the span of several others); (3) proposes a test on the whole list via dependency_relation; (4) adds at least one regression test with its expected output.</p>"
},
K5: {
  "statement": "**K5 · Checkpoint · gate — Explain collapse precisely.** Hold \\(b_1=e_2\\) fixed and let \\(b_2=\\varepsilon e_1+e_2\\), with \\(\\varepsilon\\ne0\\) tending to zero. Find the coordinates of a fixed point \\((x,y)\\), separating \\(x\\ne0\\) from \\(x=0\\), and state what happens to existence and uniqueness at \\(\\varepsilon=0\\). A lab note reads: “as \\(\\varepsilon\\) shrinks the coordinates blow up, so the point is leaving the span.” Critique it.",
  "plain": "Coordinates: c₁e₂+c₂(εe₁+e₂)=(εc₂, c₁+c₂)=(x,y) gives εc₂=x and c₁+c₂=y, so c₂=x/ε and c₁=y−x/ε.\n\nIf x≠0, both coordinates grow like |x|/ε as ε→0; the recipe walks far along b₂ and back along b₁ while the point stays put. If x=0, the coordinates are (y,0) for every ε: the point lies on b₁ and is unaffected.\n\nAt ε=0 the list e₂, e₂ is dependent. Existence fails for every point with x≠0 (the span is the y-axis). Uniqueness fails for points with x=0: c₁+c₂=y has infinitely many solutions. The unique-coordinates theorem is still true; its hypothesis that the list is a basis has stopped holding.\n\nCritique of the note: for every ε≠0 the point is in the span, because the span is all of R². Large coordinates signal sensitivity, not leaving the span; exact membership fails only at ε=0. The note confuses ill-conditioning with loss of membership.\n\nRubric: (1) correct coordinate formulas; (2) separates x≠0 and x=0; (3) states existence and uniqueness at ε=0 separately; (4) correctly critiques the note, distinguishing large coordinates from loss of membership.",
  "solution": "<p>Coordinates: c₁e₂+c₂(εe₁+e₂)=(εc₂, c₁+c₂)=(x,y) gives εc₂=x and c₁+c₂=y, so c₂=x/ε and c₁=y−x/ε.</p><p>If x≠0, both coordinates grow like |x|/ε as ε→0; the recipe walks far along b₂ and back along b₁ while the point stays put. If x=0, the coordinates are (y,0) for every ε: the point lies on b₁ and is unaffected.</p><p>At ε=0 the list e₂, e₂ is dependent. Existence fails for every point with x≠0 (the span is the y-axis). Uniqueness fails for points with x=0: c₁+c₂=y has infinitely many solutions. The unique-coordinates theorem is still true; its hypothesis that the list is a basis has stopped holding.</p><p>Critique of the note: for every ε≠0 the point is in the span, because the span is all of R². Large coordinates signal sensitivity, not leaving the span; exact membership fails only at ε=0. The note confuses ill-conditioning with loss of membership.</p><p>Rubric: (1) correct coordinate formulas; (2) separates x≠0 and x=0; (3) states existence and uniqueness at ε=0 separately; (4) correctly critiques the note, distinguishing large coordinates from loss of membership.</p>"
},
K6: {
  "statement": "**K6 · Checkpoint · gate — Symmetric plus antisymmetric.** In the space \\(V\\) of real \\(2\\times2\\) matrices, let \\(U\\) be the symmetric matrices (\\(A^T=A\\)) and \\(Y\\) the antisymmetric ones (\\(A^T=-A\\)). Prove \\(V=U\\oplus Y\\), find \\(\\dim U\\) and \\(\\dim Y\\), and split \\(\\begin{pmatrix}1&2\\\\4&3\\end{pmatrix}\\) into its symmetric and antisymmetric parts.",
  "plain": "U and Y are subspaces: transposition respects sums and scalar multiples, so sums and multiples of symmetric (antisymmetric) matrices are symmetric (antisymmetric), and 0 is both.\n\nU∩Y={0}: if Aᵀ=A and Aᵀ=−A then A=−A, so A=0. Every A splits as A=(A+Aᵀ)/2+(A−Aᵀ)/2, and the first part is symmetric, the second antisymmetric. So V=U+Y, and by Theorem 15 the sum is direct: V=U⊕Y.\n\nDimensions: U has basis [[1,0],[0,0]], [[0,0],[0,1]], [[0,1],[1,0]], so dim U=3; Y has basis [[0,1],[−1,0]], so dim Y=1. Check: 3+1=4=dim V.\n\nFor A=[[1,2],[4,3]]: Aᵀ=[[1,4],[2,3]], so the symmetric part is [[1,3],[3,3]] and the antisymmetric part is [[0,−1],[1,0]]. Their sum is [[1,2],[4,3]].\n\nRubric: (1) proves U and Y are subspaces; (2) proves U∩Y={0} and the splitting formula; (3) bases and dimensions given; (4) correct split of the given matrix, with a check that the parts add up.",
  "solution": "<p>U and Y are subspaces: transposition respects sums and scalar multiples, so sums and multiples of symmetric (antisymmetric) matrices are symmetric (antisymmetric), and 0 is both.</p><p>U∩Y={0}: if Aᵀ=A and Aᵀ=−A then A=−A, so A=0. Every A splits as A=(A+Aᵀ)/2+(A−Aᵀ)/2, and the first part is symmetric, the second antisymmetric. So V=U+Y, and by Theorem 15 the sum is direct: V=U⊕Y.</p><p>Dimensions: U has basis [[1,0],[0,0]], [[0,0],[0,1]], [[0,1],[1,0]], so dim U=3; Y has basis [[0,1],[−1,0]], so dim Y=1. Check: 3+1=4=dim V.</p><p>For A=[[1,2],[4,3]]: Aᵀ=[[1,4],[2,3]], so the symmetric part is [[1,3],[3,3]] and the antisymmetric part is [[0,−1],[1,0]]. Their sum is [[1,2],[4,3]].</p><p>Rubric: (1) proves U and Y are subspaces; (2) proves U∩Y={0} and the splitting formula; (3) bases and dimensions given; (4) correct split of the given matrix, with a check that the parts add up.</p>",
  "fields": [
    {
      "id": "dims",
      "label": "dim U, dim W",
      "type": "vec",
      "ans": [
        3,
        1
      ]
    },
    {
      "id": "sym",
      "label": "symmetric part, entries row by row",
      "type": "vec",
      "ans": [
        1,
        3,
        3,
        3
      ]
    },
    {
      "id": "anti",
      "label": "antisymmetric part, entries row by row",
      "type": "vec",
      "ans": [
        0,
        -1,
        1,
        0
      ]
    }
  ],
  "hints": {
    "dims": "A symmetric 2×2 matrix is fixed by its diagonal and one off-diagonal entry; an antisymmetric one has zero diagonal and one free entry.",
    "sym": "The symmetric part is (A+Aᵀ)/2. Average the off-diagonal entries 2 and 4.",
    "anti": "The antisymmetric part is (A−Aᵀ)/2. Its diagonal is zero."
  }
}
});
