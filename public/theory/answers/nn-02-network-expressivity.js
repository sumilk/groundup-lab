/* NN02 offline answers and rubrics; statements match the lesson source. */
/* Changed checkpoint questions keep their prior attempts in a local archive.
   Writes are ordered so a failed archive write cannot discard active work. */
(function () {
  try {
    var version = "nn02-core-checkpoints-v2", key = "nn02:checkpoint-version";
    if (localStorage.getItem(key) === version) return;
    var all = JSON.parse(localStorage.getItem("gu.work.v1") || "{}"), page = all["nn-02-network-expressivity"];
    var previous = {};
    if (page) ["K3", "K6"].forEach(function (id) { if (page[id]) previous[id] = page[id]; });
    if (Object.keys(previous).length) {
      localStorage.setItem("nn02:checkpoint-previous:v1", JSON.stringify(previous));
      ["K3", "K6"].forEach(function (id) { delete page[id]; });
      localStorage.setItem("gu.work.v1", JSON.stringify(all));
    }
    localStorage.setItem(key, version);
  } catch (_) { /* Private storage or quota failure: retain active work. */ }
})();
GU.answers("nn-02-network-expressivity", {
A1: {
  "statement": "**A1 · Foundation · paper — reading a unit backwards.** A threshold unit on four Boolean inputs has weights (1,−1,1,−1) and bias −1. Describe what it computes as \"at least r of four literals are true\", naming the literals and r, and count how many of the 16 inputs make it fire.",
  "plain": "Positive weights mark plain literals and negative weights negated ones, so the literals are x₁, x̄₂, x₃ and x̄₄. With two negated literals the bias is |Q|−r=2−r, and 2−r=−1 gives r=3: the unit fires when at least 3 of the four literals are true. Check one row: at (1,0,1,1) the literals are 1, 1, 1, 0, three true, and the score is 1−0+1−1−1=0, so it fires. The map from inputs to literal values is one-to-one, so the firing inputs correspond to literal patterns with at least three ones: C(4,3)+C(4,4)=5 inputs. Rubric: literals read from the weight signs; r recovered from the bias formula; one row checked; the count 5 justified by the correspondence with literal patterns.",
  "solution": "<p>Positive weights mark plain literals and negative weights negated ones, so the literals are x₁, x̄₂, x₃ and x̄₄. With two negated literals the bias is |Q|−r=2−r, and 2−r=−1 gives r=3: the unit fires when at least 3 of the four literals are true. Check one row: at (1,0,1,1) the literals are 1, 1, 1, 0, three true, and the score is 1−0+1−1−1=0, so it fires. The map from inputs to literal values is one-to-one, so the firing inputs correspond to literal patterns with at least three ones: C(4,3)+C(4,4)=5 inputs. Rubric: literals read from the weight signs; r recovered from the bias formula; one row checked; the count 5 justified by the correspondence with literal patterns.</p>",
  "fields": [
    {
      "id": "r",
      "label": "r",
      "type": "num",
      "ans": 3
    },
    {
      "id": "c",
      "label": "number of firing inputs",
      "type": "num",
      "ans": 5
    }
  ],
  "hints": {
    "r": "The bias of an at-least-r unit is the number of negated literals minus r.",
    "c": "Each input gives a different pattern of literal values; count patterns with at least three ones."
  }
},
A2: {
  "statement": "**A2 · Core · paper — a redundant prime implicant.** A four-input function is true exactly on rows {0, 1, 5, 7, 8, 9, 13, 15}. Exactly one of its prime implicants belongs to no smallest cover. Identify that implicant, prove the claim, and say how many AND units a smallest cover saves compared with one unit per true row.",
  "plain": "Write rows as ABCD. The true rows are 0000, 0001, 1000, 1001 (B=0, C=0), and 0101, 0111, 1101, 1111 (B=1, D=1). The prime implicants are B̄C̄ (-00-: rows 0, 1, 8, 9), BD (-1-1: rows 5, 7, 13, 15) and C̄D (--01: rows 1, 5, 9, 13). Each is prime. Freeing B in B̄C̄ gives --0-, which admits the false row 4, and freeing C gives -0--, which admits the false row 2. Freeing B in BD gives ---1, which admits the false row 3, and freeing D gives -1--, which admits the false row 4. Freeing C in C̄D gives ---1, which admits row 3, and freeing D gives --0-, which admits row 4. B̄C̄ is the only prime implicant containing rows 0 and 8, and BD the only one containing 7 and 15, so both are essential, and together they already cover all eight true rows. C̄D covers rows 1, 5, 9, 13, which the essential terms cover, so no minimum cover uses it. The plain DNF network has 8 AND units and the reduced one 2, so a smallest cover saves 6 AND units (9 units against 3, counting the OR). Rubric: all three prime implicants with their rows; primality checked by freeing positions; essential terms identified; the argument that C̄D is redundant; the saving of 6.",
  "solution": "<p>Write rows as ABCD. The true rows are 0000, 0001, 1000, 1001 (B=0, C=0), and 0101, 0111, 1101, 1111 (B=1, D=1). The prime implicants are B̄C̄ (-00-: rows 0, 1, 8, 9), BD (-1-1: rows 5, 7, 13, 15) and C̄D (--01: rows 1, 5, 9, 13). Each is prime. Freeing B in B̄C̄ gives --0-, which admits the false row 4, and freeing C gives -0--, which admits the false row 2. Freeing B in BD gives ---1, which admits the false row 3, and freeing D gives -1--, which admits the false row 4. Freeing C in C̄D gives ---1, which admits row 3, and freeing D gives --0-, which admits row 4. B̄C̄ is the only prime implicant containing rows 0 and 8, and BD the only one containing 7 and 15, so both are essential, and together they already cover all eight true rows. C̄D covers rows 1, 5, 9, 13, which the essential terms cover, so no minimum cover uses it. The plain DNF network has 8 AND units and the reduced one 2, so a smallest cover saves 6 AND units (9 units against 3, counting the OR). Rubric: all three prime implicants with their rows; primality checked by freeing positions; essential terms identified; the argument that C̄D is redundant; the saving of 6.</p>",
  "fields": [
    {
      "id": "p",
      "label": "number of prime implicants",
      "type": "num",
      "ans": 3
    },
    {
      "id": "s",
      "label": "AND units saved",
      "type": "num",
      "ans": 6
    }
  ],
  "hints": {
    "p": "Look for blocks of four true rows: one with B=C=0, one with B=D=1, and one more with C=0, D=1.",
    "s": "One unit per true row uses 8 AND units; the two essential implicants already cover everything."
  }
},
A3: {
  "statement": "**A3 · Core · paper — exactly two of four.** Prove that every DNF formula for \"exactly two of x₁, …, x₄ are on\" has at least 6 terms. Then give a threshold network with 3 units that computes it, and check it on one row of each possible count.",
  "plain": "Let f be 1 exactly when two of the four inputs are on; it is true on C(4,2)=6 rows. Suppose an implicant omits xᵢ. Take a row where it is true, which has exactly two ones, and flip xᵢ. The term stays true, but the row now has one or three ones, where f is 0, so the term was not an implicant. Every implicant therefore fixes all four inputs and covers exactly one true row, and a DNF needs at least 6 terms. A threshold network: h₁=θ(x₁+x₂+x₃+x₄−2) and h₂=θ(x₁+x₂+x₃+x₄−3), with output θ(h₁−h₂−1). With one input on, (h₁,h₂)=(0,0) and the score is −1; with two, (1,0) and the score is 0, so it fires; with three or four, (1,1) and the score is −1; with none, −1. Three units in total. Rubric: the flipping argument covers both directions (one or three ones); the conclusion that implicants are full rows; the count 6; a 3-unit network checked on every count from 0 to 4.",
  "solution": "<p>Let f be 1 exactly when two of the four inputs are on; it is true on C(4,2)=6 rows. Suppose an implicant omits xᵢ. Take a row where it is true, which has exactly two ones, and flip xᵢ. The term stays true, but the row now has one or three ones, where f is 0, so the term was not an implicant. Every implicant therefore fixes all four inputs and covers exactly one true row, and a DNF needs at least 6 terms. A threshold network: h₁=θ(x₁+x₂+x₃+x₄−2) and h₂=θ(x₁+x₂+x₃+x₄−3), with output θ(h₁−h₂−1). With one input on, (h₁,h₂)=(0,0) and the score is −1; with two, (1,0) and the score is 0, so it fires; with three or four, (1,1) and the score is −1; with none, −1. Three units in total. Rubric: the flipping argument covers both directions (one or three ones); the conclusion that implicants are full rows; the count 6; a 3-unit network checked on every count from 0 to 4.</p>",
  "fields": [
    {
      "id": "t",
      "label": "minimum DNF terms",
      "type": "num",
      "ans": 6
    },
    {
      "id": "u",
      "label": "threshold units in your network",
      "type": "num",
      "ans": 3
    }
  ],
  "hints": {
    "t": "Flipping an omitted input moves the count of ones away from two.",
    "u": "One unit for at least two, one for at least three, and an output that compares them."
  }
},
A4: {
  "statement": "**A4 · Core · paper — parity at n=10.** Give the units, connections and depth of the DNF, counting and three-unit tree constructions for 10-bit parity, and the number of pass-through units the layered tree needs with the pairing rule of Section 3.",
  "plain": "DNF: 2⁹+1=513 units and 11·2⁹=5632 connections, depth 2. Counting: 11 units and 10²+10=110 connections, depth 2. Three-unit tree: 3·9=27 units and 6·9=54 connections, depth 2⌈log₂ 10⌉=8. Pairing rounds go 10→5→3→2→1. Rounds with 5 and with 3 values each carry one value, which needs two pass-through units, so the layered tree adds 4 units, for 31 in all. Rubric: each formula applied with n=10; the ceiling in the depth; the round-by-round carry count.",
  "solution": "<p>DNF: 2⁹+1=513 units and 11·2⁹=5632 connections, depth 2. Counting: 11 units and 10²+10=110 connections, depth 2. Three-unit tree: 3·9=27 units and 6·9=54 connections, depth 2⌈log₂ 10⌉=8. Pairing rounds go 10→5→3→2→1. Rounds with 5 and with 3 values each carry one value, which needs two pass-through units, so the layered tree adds 4 units, for 31 in all. Rubric: each formula applied with n=10; the ceiling in the depth; the round-by-round carry count.</p>",
  "fields": [
    {
      "id": "du",
      "label": "DNF units",
      "type": "num",
      "ans": 513
    },
    {
      "id": "cc",
      "label": "counting connections",
      "type": "num",
      "ans": 110
    },
    {
      "id": "tu",
      "label": "tree units",
      "type": "num",
      "ans": 27
    },
    {
      "id": "td",
      "label": "tree depth",
      "type": "num",
      "ans": 8
    },
    {
      "id": "pt",
      "label": "pass-through units",
      "type": "num",
      "ans": 4
    }
  ],
  "hints": {
    "du": "2ⁿ⁻¹ AND units plus one OR.",
    "cc": "Each of n counting units reads n inputs; the output reads n units.",
    "tu": "n−1 XOR blocks of three units each.",
    "td": "⌈log₂ 10⌉ rounds of two layers.",
    "pt": "Count the rounds that start with an odd number of values."
  }
},
A5: {
  "statement": "**A5 · Stretch · paper — waiting values in a tournament.** For 5-bit parity, follow the pairing rule round by round, mark each value that waits, and count the pass-through units of the strictly layered tree. Then prove that every pairing tree for 5 inputs with depth 6 has some value that waits at least two layers.",
  "plain": "Round 1 pairs (x₁,x₂) and (x₃,x₄); x₅ waits through layers 1 and 2, needing two copies. Round 2 has z₁₂, z₃₄ and the copied x₅; it pairs z₁₂ with z₃₄ and x₅ waits through layers 3 and 4, two more copies. Round 3 pairs the two remaining values. The layered tree has 3·4=12 block units plus 4 copies, 16 units, and depth 6. For the proof: a depth-6 tree has at most three levels of blocks, and a binary tree with three full levels has 8 leaves. With 5 leaves, some leaf is fewer than three blocks below the root, so that input is first read by a block in layer 3 or later. In a strictly layered network it must be copied through at least two layers, since an input sits at depth 0. Rubric: the round-by-round trace with the waiting value marked; the count 4 and total 16; a correct counting argument that not all five leaves can be three blocks deep; the conclusion about waiting at least two layers.",
  "solution": "<p>Round 1 pairs (x₁,x₂) and (x₃,x₄); x₅ waits through layers 1 and 2, needing two copies. Round 2 has z₁₂, z₃₄ and the copied x₅; it pairs z₁₂ with z₃₄ and x₅ waits through layers 3 and 4, two more copies. Round 3 pairs the two remaining values. The layered tree has 3·4=12 block units plus 4 copies, 16 units, and depth 6. For the proof: a depth-6 tree has at most three levels of blocks, and a binary tree with three full levels has 8 leaves. With 5 leaves, some leaf is fewer than three blocks below the root, so that input is first read by a block in layer 3 or later. In a strictly layered network it must be copied through at least two layers, since an input sits at depth 0. Rubric: the round-by-round trace with the waiting value marked; the count 4 and total 16; a correct counting argument that not all five leaves can be three blocks deep; the conclusion about waiting at least two layers.</p>",
  "fields": [
    {
      "id": "pt",
      "label": "pass-through units",
      "type": "num",
      "ans": 4
    },
    {
      "id": "u",
      "label": "units in the layered tree",
      "type": "num",
      "ans": 16
    }
  ],
  "hints": {
    "pt": "An odd value waits in two of the three rounds.",
    "u": "Four blocks of three units, plus the copies."
  }
},
A6: {
  "statement": "**A6 · Core · paper — Shannon at twelve inputs.** Check that s=85 satisfies the hypothesis of the counting theorem for n=12, and give the exponent e for which at most a fraction 2ᵉ of 12-input functions have fan-in-2 circuits with at most 85 gates.",
  "plain": "The hypothesis requires s≤2ⁿ/(4n)=4096/48≈85.33, and 85 satisfies it. The theorem's bound gives the fraction at most \\(2^{n+2^n/n-2^{n-1}}\\) with n=12: e=12+4096/12−2048=12+1024/3−2048=−5084/3≈−1694.67. So all but a fraction \\(2^{-1694.67}\\) of the 12-input functions need more than 85 gates. Rubric: the hypothesis checked; the exponent computed exactly; a correct interpretation as a fraction of all \\(2^{4096}\\) functions.",
  "solution": "<p>The hypothesis requires s≤2ⁿ/(4n)=4096/48≈85.33, and 85 satisfies it. The theorem's bound gives the fraction at most \\(2^{n+2^n/n-2^{n-1}}\\) with n=12: e=12+4096/12−2048=12+1024/3−2048=−5084/3≈−1694.67. So all but a fraction \\(2^{-1694.67}\\) of the 12-input functions need more than 85 gates. Rubric: the hypothesis checked; the exponent computed exactly; a correct interpretation as a fraction of all \\(2^{4096}\\) functions.</p>",
  "fields": [
    {
      "id": "e",
      "label": "exponent e",
      "type": "num",
      "ans": -1694.6666666666667
    }
  ],
  "hints": {
    "e": "Use n+2ⁿ/n−2ⁿ⁻¹; an exact fraction such as −5084/3 is accepted."
  }
},
A7: {
  "statement": "**A7 · Foundation · paper — the cake problem.** A flat cake is cut with six straight strokes, every two of which cross inside the cake and no three through one point. Find the number of pieces by adding the strokes one at a time. Then find the most pieces that five plane cuts in general position can make of a solid block.",
  "plain": "The strokes are lines in general position, so the count is Φ(6,2)=1+6+15=22. Adding strokes one at a time, the k-th stroke crosses the k−1 earlier ones, is cut into k pieces, and adds k cake pieces: 1, 2, 4, 7, 11, 16, 22. Five planes in general position make Φ(5,3)=1+5+10+10=26 pieces of a block large enough to contain every cell. Rubric: the incremental count for the plane; the formula applied in three dimensions; a remark that the block must contain all the cells.",
  "solution": "<p>The strokes are lines in general position, so the count is Φ(6,2)=1+6+15=22. Adding strokes one at a time, the k-th stroke crosses the k−1 earlier ones, is cut into k pieces, and adds k cake pieces: 1, 2, 4, 7, 11, 16, 22. Five planes in general position make Φ(5,3)=1+5+10+10=26 pieces of a block large enough to contain every cell. Rubric: the incremental count for the plane; the formula applied in three dimensions; a remark that the block must contain all the cells.</p>",
  "fields": [
    {
      "id": "p",
      "label": "cells in the plane",
      "type": "num",
      "ans": 22
    },
    {
      "id": "s",
      "label": "cells in ℝ³",
      "type": "num",
      "ans": 26
    }
  ],
  "hints": {
    "p": "Each new line in general position is cut into one more piece than the number of lines before it.",
    "s": "Sum C(5,k) for k from 0 to 3."
  }
},
A8: {
  "statement": "**A8 · Stretch · paper — the 5+5 checkerboard.** On [0,5]² draw the lines x₁=0.5, …, 4.5 and x₂=0.5, …, 4.5, and let the target fire when the number of lines at or below the point, on both axes together, is odd. Give the unit counts of the AND-per-cell, counting and skip-connection constructions, and prove that the last two are the smallest possible among networks in which only the first layer reads the input.",
  "plain": "The ten lines make 6×6=36 cells. With k and m from 0 to 5, three values are even and three odd, so 2·3·3=18 cells have odd k+m. AND per cell: 10+18+1=29 units. Counting, layered: p₁ and p₂ are alternating sums of five units each, the second layer is θ(p₁+p₂−1) and θ(p₁+p₂−2), and the output is θ(A−B−1), so 10+2+1=13 units. With a skip connection: c=θ(p₁+p₂−2) and output θ(p₁+p₂−2c−1), 12 units. Optimality, among networks in which only the first layer reads the input: crossing any of the ten lines flips the label, so every point of every line is a boundary point and the first layer needs at least 10 units. The vertical line x₁=0.5 and the horizontal line x₂=0.5 cross at (0.5,0.5) with opposite sectors equal, so the crossing obstruction rules out one hidden layer; some extra unit is needed, giving at least 12. A strictly layered network of depth 3 with one second-layer unit c would compute c, 1−c or a constant, making c or its complement a one-hidden-layer network for the checkerboard, which is ruled out; deeper strictly layered networks have at least two units between the first layer and the output. So at least 13. Rubric: the three counts; the boundary-line lower bound; a named crossing point; the layered argument for the second unit.",
  "solution": "<p>The ten lines make 6×6=36 cells. With k and m from 0 to 5, three values are even and three odd, so 2·3·3=18 cells have odd k+m. AND per cell: 10+18+1=29 units. Counting, layered: p₁ and p₂ are alternating sums of five units each, the second layer is θ(p₁+p₂−1) and θ(p₁+p₂−2), and the output is θ(A−B−1), so 10+2+1=13 units. With a skip connection: c=θ(p₁+p₂−2) and output θ(p₁+p₂−2c−1), 12 units. Optimality, among networks in which only the first layer reads the input: crossing any of the ten lines flips the label, so every point of every line is a boundary point and the first layer needs at least 10 units. The vertical line x₁=0.5 and the horizontal line x₂=0.5 cross at (0.5,0.5) with opposite sectors equal, so the crossing obstruction rules out one hidden layer; some extra unit is needed, giving at least 12. A strictly layered network of depth 3 with one second-layer unit c would compute c, 1−c or a constant, making c or its complement a one-hidden-layer network for the checkerboard, which is ruled out; deeper strictly layered networks have at least two units between the first layer and the output. So at least 13. Rubric: the three counts; the boundary-line lower bound; a named crossing point; the layered argument for the second unit.</p>",
  "fields": [
    {
      "id": "a",
      "label": "AND-per-cell units",
      "type": "num",
      "ans": 29
    },
    {
      "id": "c",
      "label": "counting units, layered",
      "type": "num",
      "ans": 13
    },
    {
      "id": "s",
      "label": "units with a skip connection",
      "type": "num",
      "ans": 12
    }
  ],
  "hints": {
    "a": "Count the odd-sum cells of a 6×6 grid, then add the lines and the output.",
    "c": "Line units, two comparison units, and an output.",
    "s": "One comparison unit is enough when the output can also read the line units."
  }
},
A9: {
  "statement": "**A9 · Core · paper — a thousandth of the disc.** Find the smallest N for which the circumscribed regular N-gon has disagreement area at most 0.001 with the unit disc, and the smallest N for the inscribed one. Compare both with the asymptotic formulas.",
  "plain": "Circumscribed: N tan(π/N)−π≤0.001. At N=101 the error is 0.001014 and at N=102 it is 0.000994, so N=102. Inscribed: π−(N/2)sin(2π/N)≤0.001 first holds at N=144. The asymptotic formulas give N≈√(π³/(3·0.001))≈101.7 and N≈√(2π³/(3·0.001))≈143.8, rounding up to the same answers. Rubric: both exact errors evaluated near the threshold; the asymptotic check; units N+1 noted.",
  "solution": "<p>Circumscribed: N tan(π/N)−π≤0.001. At N=101 the error is 0.001014 and at N=102 it is 0.000994, so N=102. Inscribed: π−(N/2)sin(2π/N)≤0.001 first holds at N=144. The asymptotic formulas give N≈√(π³/(3·0.001))≈101.7 and N≈√(2π³/(3·0.001))≈143.8, rounding up to the same answers. Rubric: both exact errors evaluated near the threshold; the asymptotic check; units N+1 noted.</p>",
  "fields": [
    {
      "id": "c",
      "label": "smallest N, circumscribed",
      "type": "num",
      "ans": 102
    },
    {
      "id": "i",
      "label": "smallest N, inscribed",
      "type": "num",
      "ans": 144
    }
  ],
  "hints": {
    "c": "Start from √(π³/(3ε)) and check the neighbouring integers exactly.",
    "i": "The inscribed error is about twice the circumscribed one, so N grows by about √2."
  }
},
A10: {
  "statement": "**A10 · Core · paper — two missing lines.** In the 3+3 checkerboard of Section 6, keep only the first-layer lines x₁=1, x₁=3, x₂=1 and x₂=3. Give the number of code regions and the irreducible error, and the best agreement any later layers can reach.",
  "plain": "With x₁ lines only at 1 and 3, the x₁ intervals are [0,1), [1,3) and [3,4], and likewise for x₂, so there are 3×3=9 code regions. The four corner regions are single cells with no error. Each of the four edge regions is a 1×2 strip containing one target cell and one other cell, costing 1 each. The centre region is the 2×2 block of cells, with two target cells and two others, costing 2. The irreducible error is 4+2=6, so the best agreement is (16−6)/16=0.625. Rubric: nine code regions identified; each region's minority area; the total 6 and the agreement 62.5%.",
  "solution": "<p>With x₁ lines only at 1 and 3, the x₁ intervals are [0,1), [1,3) and [3,4], and likewise for x₂, so there are 3×3=9 code regions. The four corner regions are single cells with no error. Each of the four edge regions is a 1×2 strip containing one target cell and one other cell, costing 1 each. The centre region is the 2×2 block of cells, with two target cells and two others, costing 2. The irreducible error is 4+2=6, so the best agreement is (16−6)/16=0.625. Rubric: nine code regions identified; each region's minority area; the total 6 and the agreement 62.5%.</p>",
  "fields": [
    {
      "id": "c",
      "label": "code regions",
      "type": "num",
      "ans": 9
    },
    {
      "id": "f",
      "label": "irreducible error (area)",
      "type": "num",
      "ans": 6
    },
    {
      "id": "g",
      "label": "best agreement (fraction of window)",
      "type": "num",
      "ans": 0.625
    }
  ],
  "hints": {
    "c": "Two lines per axis split each axis into three intervals.",
    "f": "Add the minority area of each merged region: strips cost 1, the centre block 2.",
    "g": "Subtract the floor from the window area 16, then divide by 16."
  }
},
A11: {
  "statement": "**A11 · Stretch · paper — lower bounds for folding with width three.** For \\(t^{\\circ 12}\\), derive the lower bound on the number of hidden layers of width at most 3, and on the hidden units of a one-hidden-layer ReLU network, that follows from the pieces theorem for uniform error strictly below ½. Prove the pieces bound. Give known upper bounds from explicit constructions in this chapter. Do the lower bounds prove the exact minima? What changes if error at most ½ is allowed?",
  "plain": "A network with L hidden layers of width at most m has at most (m+1)ᴸ common linear pieces. On each old common piece every new pre-activation is affine, so each of the m ReLUs adds at most one bend; the number of pieces grows by at most m+1 per layer. Uniform error strictly below ½ forces a separate zero crossing between each consecutive pair of sawtooth extrema, hence at least 2¹² pieces. Width at most 3 therefore requires 4ᴸ≥4096, or L≥6. A shallow network requires m+1≥4096, or m≥4095. These are necessary bounds, not exact minima. The width-2 construction computes the target exactly in 12 hidden layers, and interpolation with 4096 hidden ReLUs computes it exactly in one hidden layer. Thus the established ranges are 6≤L_min≤12 and 4095≤m_min≤4096. With error at most ½, the constant output ½ works with no hidden units. Rubric: inductive pieces bound; strict-error crossing argument; both necessary lower bounds; explicit upper constructions; no unsupported optimality claim; the equality-tolerance counterexample.",
  "solution": "<p>A network with L hidden layers of width at most m has at most (m+1)ᴸ common linear pieces. On each old common piece every new pre-activation is affine, so each of the m ReLUs adds at most one bend; the number of pieces grows by at most m+1 per layer. Uniform error strictly below ½ forces a separate zero crossing between each consecutive pair of sawtooth extrema, hence at least 2¹² pieces. Width at most 3 therefore requires 4ᴸ≥4096, or L≥6. A shallow network requires m+1≥4096, or m≥4095. These are necessary bounds, not exact minima. The width-2 construction computes the target exactly in 12 hidden layers, and interpolation with 4096 hidden ReLUs computes it exactly in one hidden layer. Thus the established ranges are 6≤L_min≤12 and 4095≤m_min≤4096. With error at most ½, the constant output ½ works with no hidden units. Rubric: inductive pieces bound; strict-error crossing argument; both necessary lower bounds; explicit upper constructions; no unsupported optimality claim; the equality-tolerance counterexample.</p>",
  "fields": [
    {
      "id": "L",
      "label": "necessary lower bound on hidden layers from this theorem",
      "type": "num",
      "ans": 6
    },
    {
      "id": "m",
      "label": "necessary lower bound on shallow hidden units from this theorem",
      "type": "num",
      "ans": 4095
    }
  ],
  "hints": {
    "L": "Solve 4ᴸ≥2¹² for the necessary bound; the chapter separately gives a 12-layer construction.",
    "m": "Use m+1≥2¹². This does not supply a network with 4095 units."
  }
},
A12: {
  "statement": "**A12 · Stretch · paper — depth rescues squares, but not fully.** (a) Build x³ exactly with two hidden layers of units with activation z². (b) Prove that L hidden layers of such units compute polynomials of degree at most 2ᴸ. (c) Conclude that no fixed depth makes z² networks universal approximators on [−1,1].",
  "plain": "(a) First layer: a=(x+½)² and b=(x−½)², so a−¼=x²+x and b−¼=x²−x. Second layer: c=(a−¼)²=(x²+x)² and d=(b−¼)²=(x²−x)², each a z² unit with weight 1 and bias −¼. Output (c−d)/4=[(x²+x)²−(x²−x)²]/4=4x³/4=x³. (b) A first-layer unit squares an affine function of x, giving degree at most 2. If layer ℓ−1 has degree at most \\(2^{\\ell-1}\\), a unit of layer ℓ squares a weighted sum of them, giving degree at most 2^ℓ, and the summing output keeps the degree. (c) Fix L and let D=2ᴸ. Every such network is a polynomial of degree at most D. Take D+2 distinct points in [−1,1]. The (D+1)-th divided difference on them is a weighted sum Σcᵢe(xᵢ) that is 0 for every polynomial of degree at most D and 1 for \\(x^{D+1}\\). So for any network N, \\(1=\\sum_i c_i(x^{D+1}-N)(x_i)\\le(\\sum_i|c_i|)\\max|x^{D+1}-N|\\), and the error is at least 1/Σ|cᵢ|>0. No fixed depth reaches every accuracy for \\(x^{D+1}\\). For L=3 the degree bound is 8. Rubric: an explicit two-layer construction checked by expansion; the induction on degree; a valid argument that a fixed-degree family has a positive distance from some continuous function.",
  "solution": "<p>(a) First layer: a=(x+½)² and b=(x−½)², so a−¼=x²+x and b−¼=x²−x. Second layer: c=(a−¼)²=(x²+x)² and d=(b−¼)²=(x²−x)², each a z² unit with weight 1 and bias −¼. Output (c−d)/4=[(x²+x)²−(x²−x)²]/4=4x³/4=x³. (b) A first-layer unit squares an affine function of x, giving degree at most 2. If layer ℓ−1 has degree at most \\(2^{\\ell-1}\\), a unit of layer ℓ squares a weighted sum of them, giving degree at most 2^ℓ, and the summing output keeps the degree. (c) Fix L and let D=2ᴸ. Every such network is a polynomial of degree at most D. Take D+2 distinct points in [−1,1]. The (D+1)-th divided difference on them is a weighted sum Σcᵢe(xᵢ) that is 0 for every polynomial of degree at most D and 1 for \\(x^{D+1}\\). So for any network N, \\(1=\\sum_i c_i(x^{D+1}-N)(x_i)\\le(\\sum_i|c_i|)\\max|x^{D+1}-N|\\), and the error is at least 1/Σ|cᵢ|&gt;0. No fixed depth reaches every accuracy for \\(x^{D+1}\\). For L=3 the degree bound is 8. Rubric: an explicit two-layer construction checked by expansion; the induction on degree; a valid argument that a fixed-degree family has a positive distance from some continuous function.</p>",
  "fields": [
    {
      "id": "deg",
      "label": "degree bound for L=3",
      "type": "num",
      "ans": 8
    }
  ],
  "hints": {
    "deg": "Each layer at most doubles the degree."
  }
},
B1: {
  "statement": "**B1 · Core · NumPy — parity at scale.** Write the counting and DNF parity networks as weight matrices and bias vectors. Evaluate both on all Boolean inputs for n=4, …, 14 using two affine stages; split the input batch when needed. Report time per input and nonzero/dense parameter counts. Using float64 and 1 GB=10⁹ bytes, find separately the largest n for which (a) the DNF weights and biases fit in 1 GB and (b) its full all-input hidden activation matrix fits in 1 GB. Estimate peak working memory, including inputs, pre-activations, threshold outputs, and temporary arrays; explain why it differs from either single-array budget. Do not allocate enormous arrays merely to verify the formulas.",
  "plain": "Use two affine stages: hidden threshold outputs, then the threshold output. Counting uses (n+1)² stored weights and biases. DNF uses 2ⁿ⁻¹ hidden units and P(n)=(n+2)2ⁿ⁻¹+1 stored weights and biases. Its float64 parameter storage is 8P(n) bytes: 838,860,808 bytes at n=23 and 1,744,830,472 at n=24, so the largest n below 10⁹ bytes is 23. This is not the activation budget. The full all-input hidden matrix has A(n)=2ⁿ·2ⁿ⁻¹ entries and uses 8A(n) bytes in float64: 268,435,456 bytes at n=13 and 1,073,741,824 at n=14, so its largest n under 1 GB is 13. A Boolean threshold array can use a different dtype, but the question fixes float64 for this comparison. Peak memory also includes X, pre-activations, threshold outputs, final outputs, and any temporary matrices. Batch inputs to evaluate n=14 without materializing the full hidden batch. Estimate peak from the actual evaluation order and report dtypes and batch size rather than equating it with one array. Rubric: correct parameter counts and the separate maxima 23 and 13; decimal GB versus binary GiB; batched exhaustive agreement; an explicit working-memory inventory; reproducible timings without allocating hypothetical giant arrays.",
  "solution": "<p>Use two affine stages: hidden threshold outputs, then the threshold output. Counting uses (n+1)² stored weights and biases. DNF uses 2ⁿ⁻¹ hidden units and P(n)=(n+2)2ⁿ⁻¹+1 stored weights and biases. Its float64 parameter storage is 8P(n) bytes: 838,860,808 bytes at n=23 and 1,744,830,472 at n=24, so the largest n below 10⁹ bytes is 23. This is not the activation budget. The full all-input hidden matrix has A(n)=2ⁿ·2ⁿ⁻¹ entries and uses 8A(n) bytes in float64: 268,435,456 bytes at n=13 and 1,073,741,824 at n=14, so its largest n under 1 GB is 13. A Boolean threshold array can use a different dtype, but the question fixes float64 for this comparison. Peak memory also includes X, pre-activations, threshold outputs, final outputs, and any temporary matrices. Batch inputs to evaluate n=14 without materializing the full hidden batch. Estimate peak from the actual evaluation order and report dtypes and batch size rather than equating it with one array. Rubric: correct parameter counts and the separate maxima 23 and 13; decimal GB versus binary GiB; batched exhaustive agreement; an explicit working-memory inventory; reproducible timings without allocating hypothetical giant arrays.</p>"
},
B2: {
  "statement": "**B2 · Core · NumPy — counting cells by sampling.** Draw N=4, 8, 16 and 32 random lines meeting the square [−1,1]² (seed 0). Count the distinct first-layer codes on a 2000×2000 grid in the square and compare with Φ(N,2). Explain why sampling in a window undercounts, and estimate how many cells lie outside the window.",
  "plain": "Draw each line through two independent uniform points of the square, or with a uniform angle and an offset in [−1,1], using rng=np.random.default_rng(0). Codes on a 2000×2000 grid are the rows of the boolean matrix of signs; count unique rows with np.unique(axis=0). The counts must not exceed Φ(N,2)=1+N+N(N−1)/2, which is 11, 37, 137 and 529. They fall below it because some intersection points lie outside the window, so the cells on their far side are never sampled, and very thin cells can be missed between grid points. Estimate the cells outside by counting intersection points that lie outside the square: in general position each such crossing removes about one cell from the visible count. Rubric: a seeded experiment; counts compared with Φ(N,2); both reasons for undercounting; an estimate of missing cells based on outside intersections.",
  "solution": "<p>Draw each line through two independent uniform points of the square, or with a uniform angle and an offset in [−1,1], using rng=np.random.default_rng(0). Codes on a 2000×2000 grid are the rows of the boolean matrix of signs; count unique rows with np.unique(axis=0). The counts must not exceed Φ(N,2)=1+N+N(N−1)/2, which is 11, 37, 137 and 529. They fall below it because some intersection points lie outside the window, so the cells on their far side are never sampled, and very thin cells can be missed between grid points. Estimate the cells outside by counting intersection points that lie outside the square: in general position each such crossing removes about one cell from the visible count. Rubric: a seeded experiment; counts compared with Φ(N,2); both reasons for undercounting; an estimate of missing cells based on outside intersections.</p>"
},
B3: {
  "statement": "**B3 · Core · NumPy — staircase versus ReLU for xy.** Build the two-ridge networks of Section 7 for K=5, 10, 20, 40 and 80, with threshold and with ReLU units. Measure the largest error on a 401×401 grid, fit the slope of log error against log K, and compare it with the slopes −1 and −2 predicted by the bounds.",
  "plain": "For each K build the skyline S of g(t)=t²/4 on [−2,2] with midpoint heights and the endpoint correction, and the ReLU interpolant with K intervals. Evaluate S(x+y)−S(x−y) and the ReLU version on a 401×401 grid. The skyline's error should be close to 2/K and below the bound 4/K; the ReLU error should be close to 1/K² and below 2/K². A least-squares fit of log(error) against log(K) gives slopes near −1 for the skyline and −2 for ReLU. Report the measured slopes and explain any deviation, for example grid points that miss the worst block. Rubric: both networks built from the stated formulas; errors below the proved bounds; fitted slopes near −1 and −2; a sentence linking the slopes to the first-order and second-order error terms.",
  "solution": "<p>For each K build the skyline S of g(t)=t²/4 on [−2,2] with midpoint heights and the endpoint correction, and the ReLU interpolant with K intervals. Evaluate S(x+y)−S(x−y) and the ReLU version on a 401×401 grid. The skyline's error should be close to 2/K and below the bound 4/K; the ReLU error should be close to 1/K² and below 2/K². A least-squares fit of log(error) against log(K) gives slopes near −1 for the skyline and −2 for ReLU. Report the measured slopes and explain any deviation, for example grid points that miss the worst block. Rubric: both networks built from the stated formulas; errors below the proved bounds; fitted slopes near −1 and −2; a sentence linking the slopes to the first-order and second-order error terms.</p>"
},
B4: {
  "statement": "**B4 · Stretch · NumPy — no shallow shortcut.** For k=6, fit one-hidden-layer ReLU networks with m=8, 16, 32, 62 and 64 units to \\(t^{\\circ 6}\\) by least squares, using fixed equally spaced breakpoints and solving only for the output weights. Report the largest error and the mean squared error for each m. Confirm that the largest error is at least ½ whenever m≤62, and explain why least squares can still make the mean squared error small.",
  "plain": "Use breakpoints bᵢ=i/m for i=0,…,m−1, form the design matrix with a constant column and columns ReLU(x−bᵢ), and solve for the output weights with np.linalg.lstsq on 4097 points in [0,1]. For m≤62 the theorem of Section 8 guarantees a largest error of at least ½, since a one-hidden-layer network with m units has at most m+1≤63<64 pieces; the measurements must agree. At m=64 the breakpoints include every knot i/64 of \\(t^{\\circ 6}\\), so the fit is exact up to rounding. The mean squared error can be much smaller than ¼ because least squares trades a few large errors at the teeth for small errors elsewhere; the theorem controls the largest error, not the average. Rubric: the design matrix and fit described; largest errors at least ½ for every m≤62; the exact fit at m=64 explained by aligned breakpoints; the distinction between largest and mean squared error.",
  "solution": "<p>Use breakpoints bᵢ=i/m for i=0,…,m−1, form the design matrix with a constant column and columns ReLU(x−bᵢ), and solve for the output weights with np.linalg.lstsq on 4097 points in [0,1]. For m≤62 the theorem of Section 8 guarantees a largest error of at least ½, since a one-hidden-layer network with m units has at most m+1≤63&lt;64 pieces; the measurements must agree. At m=64 the breakpoints include every knot i/64 of \\(t^{\\circ 6}\\), so the fit is exact up to rounding. The mean squared error can be much smaller than ¼ because least squares trades a few large errors at the teeth for small errors elsewhere; the theorem controls the largest error, not the average. Rubric: the design matrix and fit described; largest errors at least ½ for every m≤62; the exact fit at m=64 explained by aligned breakpoints; the distinction between largest and mean squared error.</p>"
},
C1: {
  "statement": "**C1 · Core · PyTorch — representing is not learning.** Train a ReLU network with 4 hidden layers of width 2 to fit \\(t^{\\circ 4}\\) on 1024 points, from 20 random initializations, and train a one-hidden-layer network of width 64 the same way. Report the final largest error of every run, and compare the deep runs with the exact weights of Lemma 1. Explain what the gap says about representation versus optimization.",
  "plain": "Train both models with Adam on 1024 equally spaced points in [0,1] and mean squared error, for a fixed number of steps, from 20 seeds. The exact deep solution of Lemma 1 has zero error, but many deep, narrow runs stall: with width 2, a unit whose pre-activation stays negative on the data receives no gradient, and the network collapses to fewer pieces. The width-64 one-hidden-layer network has more than the 15 units that \\(t^{\\circ 4}\\) requires, and it usually fits well, though not always exactly. Report every run's final largest error, how many deep runs reach below ½, and how many units are dead at the end. The conclusion is that the existence of a small exact network does not mean gradient descent from a random start finds it: representation and optimization are different questions. Rubric: all 20 runs reported for each model; the exact deep solution used as the reference; dead or saturated units identified as a cause; the representation versus optimization distinction stated.",
  "solution": "<p>Train both models with Adam on 1024 equally spaced points in [0,1] and mean squared error, for a fixed number of steps, from 20 seeds. The exact deep solution of Lemma 1 has zero error, but many deep, narrow runs stall: with width 2, a unit whose pre-activation stays negative on the data receives no gradient, and the network collapses to fewer pieces. The width-64 one-hidden-layer network has more than the 15 units that \\(t^{\\circ 4}\\) requires, and it usually fits well, though not always exactly. Report every run's final largest error, how many deep runs reach below ½, and how many units are dead at the end. The conclusion is that the existence of a small exact network does not mean gradient descent from a random start finds it: representation and optimization are different questions. Rubric: all 20 runs reported for each model; the exact deep solution used as the reference; dead or saturated units identified as a cause; the representation versus optimization distinction stated.</p>"
},
C2: {
  "statement": "**C2 · Stretch · PyTorch — a one-unit first layer.** Train networks whose first layer has width 1, followed by two hidden layers of width 64, to fit ‖x‖² on [−1,1]², and compare with a first layer of width 3. Report the final largest and mean squared errors over 5 seeds. Check that the width-1 networks are constant along a line through the origin, and relate their largest error to the bound of Section 9.",
  "plain": "Build the first layer as nn.Linear(2,1) or nn.Linear(2,3), followed by ReLU layers of width 64 and a linear output, and train on uniform samples of [−1,1]² with target x₁²+x₂², for 5 seeds. For width 1, the first layer's weight vector w has a null direction v ⟂ w, and the network is constant along every line parallel to v. Check this by evaluating along x=τv for τ∈[−1,1]. The target varies from 0 to 1 along such a line, so the largest error is at least ½, matching Section 9. The width-3 networks can fit closely. Report final largest and mean squared errors for each seed and width. Rubric: both widths trained with seeds; constancy along v verified numerically; the largest-error floor of ½ for width 1 explained; width 3 compared.",
  "solution": "<p>Build the first layer as nn.Linear(2,1) or nn.Linear(2,3), followed by ReLU layers of width 64 and a linear output, and train on uniform samples of [−1,1]² with target x₁²+x₂², for 5 seeds. For width 1, the first layer's weight vector w has a null direction v ⟂ w, and the network is constant along every line parallel to v. Check this by evaluating along x=τv for τ∈[−1,1]. The target varies from 0 to 1 along such a line, so the largest error is at least ½, matching Section 9. The width-3 networks can fit closely. Report final largest and mean squared errors for each seed and width. Rubric: both widths trained with seeds; constancy along v verified numerically; the largest-error floor of ½ for width 1 explained; width 3 compared.</p>"
},
M1: {
  "statement": "**M1 · Core · mixed — revisiting two squares.** NN01 represented the union of the squares −3≤x₁≤−1 and 1≤x₁≤3, both with |x₂|≤1, using a 2–6–2–1 network of 9 threshold units. Build an exact one-hidden-layer network for the same region with 7 units, and prove that no exact threshold network in which only the first layer reads the input has fewer.",
  "plain": "First layer: θ(x₁+3), θ(−1−x₁), θ(x₁−1), θ(3−x₁), θ(1−x₂) and θ(1+x₂). Let C be the sum of the first four and T the sum of the last two. C is 2 for x₁<−3, 3 on [−3,−1], 2 on (−1,1), 3 on [1,3] and 2 for x₁>3, so C=3 exactly on the two closed x₁-intervals. T is 2 exactly when |x₂|≤1 and 1 otherwise. The output θ(C+T−5) fires exactly when C=3 and T=2, which is the union, including its boundary: 7 units with one hidden layer. Lower bound: the boundary contains segments on the six distinct lines x₁=−3, −1, 1, 3 and x₂=±1, so by the first-layer corollary any exact network in which only the first layer reads the input has at least 6 first-layer units, plus an output, so at least 7. Rubric: six correct first-layer units with boundary conventions; the values of C and T on every interval; the output threshold; the boundary-line lower bound; the conclusion that 7 is optimal.",
  "solution": "<p>First layer: θ(x₁+3), θ(−1−x₁), θ(x₁−1), θ(3−x₁), θ(1−x₂) and θ(1+x₂). Let C be the sum of the first four and T the sum of the last two. C is 2 for x₁&lt;−3, 3 on [−3,−1], 2 on (−1,1), 3 on [1,3] and 2 for x₁&gt;3, so C=3 exactly on the two closed x₁-intervals. T is 2 exactly when |x₂|≤1 and 1 otherwise. The output θ(C+T−5) fires exactly when C=3 and T=2, which is the union, including its boundary: 7 units with one hidden layer. Lower bound: the boundary contains segments on the six distinct lines x₁=−3, −1, 1, 3 and x₂=±1, so by the first-layer corollary any exact network in which only the first layer reads the input has at least 6 first-layer units, plus an output, so at least 7. Rubric: six correct first-layer units with boundary conventions; the values of C and T on every interval; the output threshold; the boundary-line lower bound; the conclusion that 7 is optimal.</p>",
  "fields": [
    {
      "id": "u",
      "label": "units",
      "type": "num",
      "ans": 7
    }
  ],
  "hints": {
    "u": "Six boundary lines, one unit each, and an output that adds them."
  }
},
M2: {
  "statement": "**M2 · Core · mixed — lower and upper bounds at n=8.** For 8-input Boolean functions, compute the parameter lower bound of Section 11 for an architecture that represents every function, and the parameter count of the DNF architecture with 2ⁿ⁻¹ hidden units. Explain why the DNF architecture can represent functions with more than 2ⁿ⁻¹ true rows.",
  "plain": "For n=8 an architecture representing every function needs W≥2⁸/log₂(257)≈31.98, so at least 32 parameters. The DNF architecture with 2⁷=128 hidden units, each reading 8 inputs, has 128·9 hidden parameters and 129 output parameters: 2⁷(8+2)+1=1281. A function with more than 128 true rows has a complement with fewer than 128; the same architecture builds one AND unit per true row of the complement, with unused units given weights that never fire, and an output θ(−Σh) that fires when none of them does. Rubric: the lower bound computed and rounded up; the DNF parameter count; the complement argument for functions with many true rows.",
  "solution": "<p>For n=8 an architecture representing every function needs W≥2⁸/log₂(257)≈31.98, so at least 32 parameters. The DNF architecture with 2⁷=128 hidden units, each reading 8 inputs, has 128·9 hidden parameters and 129 output parameters: 2⁷(8+2)+1=1281. A function with more than 128 true rows has a complement with fewer than 128; the same architecture builds one AND unit per true row of the complement, with unused units given weights that never fire, and an output θ(−Σh) that fires when none of them does. Rubric: the lower bound computed and rounded up; the DNF parameter count; the complement argument for functions with many true rows.</p>",
  "fields": [
    {
      "id": "lb",
      "label": "parameter lower bound",
      "type": "num",
      "ans": 32
    },
    {
      "id": "ub",
      "label": "DNF architecture parameters",
      "type": "num",
      "ans": 1281
    }
  ],
  "hints": {
    "lb": "Solve (2⁸+1)^W≥2^{256} for the smallest whole W.",
    "ub": "Count 128 units with 8 weights and a bias, then the output's 128 weights and bias."
  }
},
M3: {
  "statement": "**M3 · Stretch · mixed — parity is a set of stripes.** Embed the Boolean cube in ℝⁿ and look at the hidden hyperplanes of the counting parity network. Explain, using the cell-constancy lemma and the crossing obstruction, why one hidden layer suffices for parity, whose boundaries are parallel, but not for the two-dimensional checkerboard.",
  "plain": "On the cube, the counting network's hidden units are θ(Σxᵢ−k), whose hyperplanes Σxᵢ=k are parallel. Parallel hyperplanes never cross, so their cells are slabs between consecutive levels, and parity is constant on each slab of the cube. The output reads the slab index through the alternating sum, a function of one variable, which a single threshold unit on the hidden outputs can compute because the hidden pattern is a staircase. The crossing obstruction needs a point where two boundary hyperplanes cross with opposite sectors equal; slabs have no such point. In the two-dimensional checkerboard the boundary lines are vertical and horizontal, every pair crosses, and at each crossing the four sectors alternate, so the obstruction applies and one hidden layer is impossible. Rubric: the hidden hyperplanes identified as parallel; parity constant on slabs; the staircase making the output linear-threshold; the precise hypothesis of the crossing obstruction and why it fails for slabs but holds for the checkerboard.",
  "solution": "<p>On the cube, the counting network's hidden units are θ(Σxᵢ−k), whose hyperplanes Σxᵢ=k are parallel. Parallel hyperplanes never cross, so their cells are slabs between consecutive levels, and parity is constant on each slab of the cube. The output reads the slab index through the alternating sum, a function of one variable, which a single threshold unit on the hidden outputs can compute because the hidden pattern is a staircase. The crossing obstruction needs a point where two boundary hyperplanes cross with opposite sectors equal; slabs have no such point. In the two-dimensional checkerboard the boundary lines are vertical and horizontal, every pair crosses, and at each crossing the four sectors alternate, so the obstruction applies and one hidden layer is impossible. Rubric: the hidden hyperplanes identified as parallel; parity constant on slabs; the staircase making the output linear-threshold; the precise hypothesis of the crossing obstruction and why it fails for slabs but holds for the checkerboard.</p>"
},
M4: {
  "statement": "**M4 · Stretch · mixed — a flawed argument, diagnosed.** A student argues: \"A one-hidden-layer network approximates the 8+8 checkerboard in disagreement area as closely as we like. So with enough units it represents the checkerboard exactly. Adding cylinders, one per cell, proves this directly.\" Identify every error, give the correct statement for each claim, and say which theorem of this chapter settles it.",
  "plain": "First claim: approximation in disagreement area holds for one hidden layer with a threshold output, by Section 7's band argument. Second claim: approximation does not imply exact representation. The crossing obstruction of Section 5 proves that no one-hidden-layer threshold network, of any width, represents the checkerboard exactly; small disagreement area for every target accuracy and impossibility of zero disagreement are compatible. Third claim: adding cylinders, one per cell, with distant floors subtracted, is not valid. Each cylinder's excess above ½ decays only like ρ/(πr), and Section 7 shows a row of three discs already makes a gap point fire. Shrinking cells changes no ratio, so finer cells do not help. Correct statements: one hidden layer approximates in area; two hidden layers are necessary and sufficient for exactness, with 19 units strictly layered. Rubric: the three claims separated; the band argument cited for the first; the crossing obstruction for the second; the tail computation or scale invariance for the third; correct replacement statements.",
  "solution": "<p>First claim: approximation in disagreement area holds for one hidden layer with a threshold output, by Section 7's band argument. Second claim: approximation does not imply exact representation. The crossing obstruction of Section 5 proves that no one-hidden-layer threshold network, of any width, represents the checkerboard exactly; small disagreement area for every target accuracy and impossibility of zero disagreement are compatible. Third claim: adding cylinders, one per cell, with distant floors subtracted, is not valid. Each cylinder's excess above ½ decays only like ρ/(πr), and Section 7 shows a row of three discs already makes a gap point fire. Shrinking cells changes no ratio, so finer cells do not help. Correct statements: one hidden layer approximates in area; two hidden layers are necessary and sufficient for exactness, with 19 units strictly layered. Rubric: the three claims separated; the band argument cited for the first; the crossing obstruction for the second; the tail computation or scale invariance for the third; correct replacement statements.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — measure a network.** Three threshold units sit on three Boolean inputs. The first takes all three inputs; the second takes only x₁ and x₂; the output takes the first two units together with x₃. Report the longest input-to-output path length, the counts of units, arrows and biases, whether any arrow skips a layer, and how many copy units would remove every skip.",
  "plain": "Call the first unit a and the second b. Both are at depth 1 and the output y at depth 2, so the network has depth 2. There are 3 units, 3+2+3=8 connections and 3 biases. It is not strictly layered, because x₃→y jumps from depth 0 to depth 2. Strict layering needs one copy of x₃ at depth 1, so 1 pass-through unit. Rubric: correct depths; the connection count; the skip connection identified; one pass-through unit.",
  "solution": "<p>Call the first unit a and the second b. Both are at depth 1 and the output y at depth 2, so the network has depth 2. There are 3 units, 3+2+3=8 connections and 3 biases. It is not strictly layered, because x₃→y jumps from depth 0 to depth 2. Strict layering needs one copy of x₃ at depth 1, so 1 pass-through unit. Rubric: correct depths; the connection count; the skip connection identified; one pass-through unit.</p>",
  "fields": [
    {
      "id": "d",
      "label": "depth",
      "type": "num",
      "ans": 2
    },
    {
      "id": "c",
      "label": "connections",
      "type": "num",
      "ans": 8
    },
    {
      "id": "p",
      "label": "pass-through units",
      "type": "num",
      "ans": 1
    }
  ],
  "hints": {
    "d": "The longest path is input, a hidden unit, then the output.",
    "c": "Add the arrows into a, b and y.",
    "p": "Only one arrow jumps over a layer."
  }
},
K2: {
  "statement": "**K2 · Stretch · gate — derive a cell bound.** Prove by induction that N lines in the plane make at most 1+N+N(N−1)/2 cells, without using the general d-dimensional theorem. Use it to bound the number of codes that a first layer of 10 threshold units can produce on the open cells of ℝ².",
  "plain": "Add the lines one at a time. Line k crosses the earlier k−1 lines in at most k−1 points, which cut it into at most k pieces. Each piece lies in one old cell and splits it in two, so line k adds at most k cells. Starting from 1 cell, N lines give at most 1+(1+2+⋯+N)=1+N(N+1)/2=1+N+N(N−1)/2. For a first layer of 10 threshold units, the codes on the open cells are at most the number of cells, 1+10+45=56, because each unit is constant on each cell. Rubric: the piece-count step with its at most k−1 crossings; why each piece adds exactly one cell; the closed form; the bound 56 with the reason codes are constant on cells.",
  "solution": "<p>Add the lines one at a time. Line k crosses the earlier k−1 lines in at most k−1 points, which cut it into at most k pieces. Each piece lies in one old cell and splits it in two, so line k adds at most k cells. Starting from 1 cell, N lines give at most 1+(1+2+⋯+N)=1+N(N+1)/2=1+N+N(N−1)/2. For a first layer of 10 threshold units, the codes on the open cells are at most the number of cells, 1+10+45=56, because each unit is constant on each cell. Rubric: the piece-count step with its at most k−1 crossings; why each piece adds exactly one cell; the closed form; the bound 56 with the reason codes are constant on cells.</p>",
  "fields": [
    {
      "id": "c",
      "label": "bound on codes",
      "type": "num",
      "ans": 56
    }
  ],
  "hints": {
    "c": "Evaluate 1+N+N(N−1)/2 at N=10."
  }
},
K3: {
  "statement": "**K3 · Core · gate — a ridge construction and its error budget.** Construct a one-hidden-layer approximation to 3xy on [−1,1]² by scaling the two-ridge construction. Give the two directions and the type of output unit. Use the bounds 4/K for xy with midpoint skylines and 2/K² for xy with ReLU interpolation to find the smallest K certified to give error at most 0.02 for 3xy in each construction. Count hidden units, keeping zero-weight units as in Section 7, and explain why sampled error is not the guarantee.",
  "plain": "Use 3xy=(3/4)(x+y)²−(3/4)(x−y)². The two hidden directions are (1,1) and (1,−1), and the output sums the ridge approximations with opposite signs; there is no final threshold. Scaling the xy network output by 3 scales its guaranteed errors by 3, to 12/K for midpoint skylines and 6/K² for ReLU interpolation. For error at most 0.02, the skyline needs K≥600 and uses 2(K+1)=1202 hidden threshold units. Interpolation needs K²≥300, so K=18 and 2K=36 hidden ReLU units. Both counts exclude the summing output and retain zero-weight units as specified. Match each ridge at its final endpoint using the correction in Section 7. A sampled maximum may be smaller or miss unsampled errors; the algebraic error budget is the guarantee on the whole box. Rubric: ridge identity and directions; summing output; scaled bounds; certified block counts and hidden-unit counts; endpoint and sampled-versus-uniform qualifications.",
  "solution": "<p>Use 3xy=(3/4)(x+y)²−(3/4)(x−y)². The two hidden directions are (1,1) and (1,−1), and the output sums the ridge approximations with opposite signs; there is no final threshold. Scaling the xy network output by 3 scales its guaranteed errors by 3, to 12/K for midpoint skylines and 6/K² for ReLU interpolation. For error at most 0.02, the skyline needs K≥600 and uses 2(K+1)=1202 hidden threshold units. Interpolation needs K²≥300, so K=18 and 2K=36 hidden ReLU units. Both counts exclude the summing output and retain zero-weight units as specified. Match each ridge at its final endpoint using the correction in Section 7. A sampled maximum may be smaller or miss unsampled errors; the algebraic error budget is the guarantee on the whole box. Rubric: ridge identity and directions; summing output; scaled bounds; certified block counts and hidden-unit counts; endpoint and sampled-versus-uniform qualifications.</p>",
  "fields": [
    {
      "id": "stepK",
      "label": "smallest K certified by the skyline bound",
      "type": "num",
      "ans": 600
    },
    {
      "id": "stepUnits",
      "label": "hidden threshold units",
      "type": "num",
      "ans": 1202
    },
    {
      "id": "reluK",
      "label": "smallest K certified by the ReLU bound",
      "type": "num",
      "ans": 18
    },
    {
      "id": "reluUnits",
      "label": "hidden ReLU units",
      "type": "num",
      "ans": 36
    }
  ],
  "hints": {
    "stepK": "Scale the xy error bound by 3, then solve 12/K≤0.02.",
    "stepUnits": "Two ridges with K+1 hidden thresholds each.",
    "reluK": "Solve 6/K²≤0.02 and round K up.",
    "reluUnits": "Two ridges with K hidden ReLUs each."
  }
},
K4: {
  "statement": "**K4 · Core · gate — debug two size claims.** A student's counting network for 5-bit parity uses the output \\(\\theta\\big(\\sum_k(-1)^{k+1}c_k\\big)\\), with bias 0, and the student reports its depth as 1 \"because it has one hidden layer\". Find on how many of the 32 inputs the network is wrong, correct the bias, and correct the depth.",
  "plain": "With bias 0 the output is θ(alternating sum), and the alternating sum is 0 or 1, never negative, so the output is 1 on every input. It is wrong on the 16 inputs with an even number of ones. The output must fire at sum 1 and stay silent at sum 0, so any bias b with −1≤b<0 works; the chapter uses −1. The depth is the longest path in arrows, input to counting unit to output, so it is 2. One hidden layer means depth 2, not 1. Rubric: why bias 0 always fires; the count of 16 wrong inputs; a correct bias range or value; depth defined by arrows on the longest path.",
  "solution": "<p>With bias 0 the output is θ(alternating sum), and the alternating sum is 0 or 1, never negative, so the output is 1 on every input. It is wrong on the 16 inputs with an even number of ones. The output must fire at sum 1 and stay silent at sum 0, so any bias b with −1≤b&lt;0 works; the chapter uses −1. The depth is the longest path in arrows, input to counting unit to output, so it is 2. One hidden layer means depth 2, not 1. Rubric: why bias 0 always fires; the count of 16 wrong inputs; a correct bias range or value; depth defined by arrows on the longest path.</p>",
  "fields": [
    {
      "id": "w",
      "label": "inputs on which it is wrong",
      "type": "num",
      "ans": 16
    },
    {
      "id": "d",
      "label": "correct depth",
      "type": "num",
      "ans": 2
    }
  ],
  "hints": {
    "w": "An alternating sum of a staircase is 0 or 1, so a zero bias never makes the score negative.",
    "d": "Count arrows on the path from an input to the output."
  }
},
K5: {
  "statement": "**K5 · Core · gate — critique an experiment.** A student reports: \"A 9-unit polygon network scores 98.9% on a 150×150 grid for the disc of radius 1.5, so it represents the disc. Universal approximation then shows that one hidden layer represents every shape exactly, so depth is never needed, and gradient descent will find these weights.\" Identify the separate claims, state what the chapter supports for each, and give a precise disagreement-area statement for the 9-unit network.",
  "plain": "There are four separate claims. (1) Representation: a disc cannot be represented exactly by any threshold network, because its boundary would have to lie on finitely many lines. The octagon network has disagreement area 1.5²·(8tan(π/8)−π)≈0.387 with the disc, in the window [−3,3]² of area 36, which matches the 98.9% grid score. (2) Universal approximation gives approximation within any tolerance, not exact representation, and the crossing obstruction shows that some shapes need two hidden layers to be exact. (3) Depth is needed for exactness in the checkerboard and saves exponentially many units for the sawtooth. (4) Universal approximation says nothing about whether gradient descent finds the weights. A precise statement: the 9-unit circumscribed octagon network disagrees with the disc of radius 1.5 on an area of about 0.387, and a circumscribed N-gon reduces this to 2.25(N tan(π/N)−π). Rubric: the four claims separated; the exact-representation impossibility; the disagreement area computed; depth results cited correctly; learning separated from representation.",
  "solution": "<p>There are four separate claims. (1) Representation: a disc cannot be represented exactly by any threshold network, because its boundary would have to lie on finitely many lines. The octagon network has disagreement area 1.5²·(8tan(π/8)−π)≈0.387 with the disc, in the window [−3,3]² of area 36, which matches the 98.9% grid score. (2) Universal approximation gives approximation within any tolerance, not exact representation, and the crossing obstruction shows that some shapes need two hidden layers to be exact. (3) Depth is needed for exactness in the checkerboard and saves exponentially many units for the sawtooth. (4) Universal approximation says nothing about whether gradient descent finds the weights. A precise statement: the 9-unit circumscribed octagon network disagrees with the disc of radius 1.5 on an area of about 0.387, and a circumscribed N-gon reduces this to 2.25(N tan(π/N)−π). Rubric: the four claims separated; the exact-representation impossibility; the disagreement area computed; depth results cited correctly; learning separated from representation.</p>",
  "fields": [
    {
      "id": "a",
      "label": "disagreement area of the 9-unit network",
      "type": "num",
      "ans": 0.3872606521386771
    }
  ],
  "hints": {
    "a": "Scale the unit-disc octagon error by the square of the radius; π and tan are accepted, e.g. 2.25*(8*(sqrt(2)-1)-pi)."
  }
},
K6: {
  "statement": "**K6 · Stretch · gate — a lower bound is not a construction.** Rebuild the crossing argument for a one-hidden-layer ReLU approximation to \\(t^{\\circ 5}\\) with uniform error strictly below ½. State the resulting lower bound on hidden units. What does it say about widths 30 and 31? Give an exact deep construction and an exact shallow interpolation construction from the chapter, with their hidden-unit counts. Does the lower bound establish the optimum at 31? Finally explain why the constant output ½ defeats every such lower-bound claim if error at most ½ is permitted.",
  "plain": "The target t^∘5 has 32 linear pieces and alternates between 0 and 1 at 33 dyadic grid points. If the uniform error is strictly below ½, g−½ alternates strictly in sign there and has at least 32 zeros separated by nonzero values. One affine piece cannot contain two such zeros, so g has at least 32 pieces. A shallow m-unit ReLU network has at most m+1 pieces; hence m≥31. Width 30 is impossible for that tolerance, while width 31 is only not ruled out by this bound. The explicit deep construction has 5 hidden layers of width 2, or 10 hidden units, plus a summing output. The shallow interpolant uses 32 hidden units and is exact. This proves 31≤m_min≤32, not that 31 is achievable. At the non-strict tolerance ½ the constant output g=½ has exactly that maximum error for every fold count and needs no hidden units. Rubric: alternating values and crossing proof; necessary bound 31; necessity versus sufficiency at widths 30/31; both explicit constructions and counts; distinction between <½ and ≤½.",
  "solution": "<p>The target t^∘5 has 32 linear pieces and alternates between 0 and 1 at 33 dyadic grid points. If the uniform error is strictly below ½, g−½ alternates strictly in sign there and has at least 32 zeros separated by nonzero values. One affine piece cannot contain two such zeros, so g has at least 32 pieces. A shallow m-unit ReLU network has at most m+1 pieces; hence m≥31. Width 30 is impossible for that tolerance, while width 31 is only not ruled out by this bound. The explicit deep construction has 5 hidden layers of width 2, or 10 hidden units, plus a summing output. The shallow interpolant uses 32 hidden units and is exact. This proves 31≤m_min≤32, not that 31 is achievable. At the non-strict tolerance ½ the constant output g=½ has exactly that maximum error for every fold count and needs no hidden units. Rubric: alternating values and crossing proof; necessary bound 31; necessity versus sufficiency at widths 30/31; both explicit constructions and counts; distinction between &lt;½ and ≤½.</p>",
  "fields": [
    {
      "id": "lowerBound",
      "label": "necessary shallow hidden-unit bound",
      "type": "num",
      "ans": 31
    },
    {
      "id": "deepUnits",
      "label": "hidden units in the exact deep construction",
      "type": "num",
      "ans": 10
    },
    {
      "id": "shallowExact",
      "label": "hidden units in the exact shallow interpolant",
      "type": "num",
      "ans": 32
    }
  ],
  "hints": {
    "lowerBound": "Use m+1≥2⁵; distinguish the conclusion from an existence claim.",
    "deepUnits": "Each of the five hidden layers has two units.",
    "shallowExact": "The supplied interpolant uses one hidden unit for the initial slope and one for each interior bend."
  }
}
});
