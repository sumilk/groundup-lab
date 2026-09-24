/* Answers, checks and reference solutions for Linear Algebra Module 1. */
GU.answers("01-span", {

/* ============================== TRACK A ================================== */

A1: {
  statement: "**A1 · Foundation · paper — arithmetic and recipes.** Let \\(u=(2,-1)\\), \\(v=(1,3)\\). Compute \\(3u-2v\\), and find scalars \\(a,b\\) with \\(au+bv=(7,4)\\). Check the second answer by substitution.",
  fields: [
    { id: "r", label: "3u − 2v", type: "vec", ans: [4, -9] },
    { id: "a", label: "a", type: "num", ans: 17 / 7 },
    { id: "b", label: "b", type: "num", ans: 15 / 7 }
  ],
  hints: {
    r: "Scale first, subtract second: \\(3(2,-1)=(6,-3)\\) and \\(2(1,3)=(2,6)\\).",
    a: "Two equations, two unknowns: \\(2a+b=7\\) and \\(-a+3b=4\\). The answer is not an integer.",
    b: "Substitute \\(b=7-2a\\) into the second equation."
  },
  plain: "3u-2v = (4,-9). a = 17/7, b = 15/7.",
  solution:
    "<p>\\(3\\mathbf{u} = (6,-3)\\) and \\(2\\mathbf{v} = (2,6)\\), so \\(3\\mathbf{u}-2\\mathbf{v} = (4,-9)\\).</p>" +
    "<p>For the second part, \\(a(2,-1)+b(1,3)=(7,4)\\) is the pair of equations \\(2a+b=7\\), \\(-a+3b=4\\). " +
    "From the first, \\(b = 7-2a\\); substituting, \\(-a+21-6a=4\\), so \\(-7a=-17\\) and \\(a=\\tfrac{17}{7}\\), " +
    "\\(b=\\tfrac{15}{7}\\).</p>" +
    "<p>Check: \\(2\\cdot\\tfrac{17}{7}+\\tfrac{15}{7}=\\tfrac{49}{7}=7\\) and \\(-\\tfrac{17}{7}+3\\cdot\\tfrac{15}{7}=\\tfrac{28}{7}=4\\). " +
    "That a solution exists at all is the interesting part: \\(\\mathbf{u},\\mathbf{v}\\) are independent, so they span " +
    "\\(\\mathbb{R}^2\\) and <em>every</em> target has exactly one recipe — Theorem 3, before we stated it.</p>"
},

A2: {
  statement: "**A2 · Foundation · paper — name the span.** Describe \\(\\operatorname{span}\\{(1,2,3)\\}\\), \\(\\operatorname{span}\\{(1,0,0),(0,1,0)\\}\\), and \\(\\operatorname{span}\\{(1,1,0),(2,2,0),(0,0,1)\\}\\). For each, give its dimension and say whether it is a point, line, plane, or all of \\(\\mathbb R^3\\).",
  fields: [
    { id: "s1", label: "span{(1,2,3)}", type: "choice", opts: ["point", "line", "plane", "all of R³"], ans: "line" },
    { id: "d1", label: "its dimension", type: "num", ans: 1 },
    { id: "s2", label: "span{(1,0,0),(0,1,0)}", type: "choice", opts: ["point", "line", "plane", "all of R³"], ans: "plane" },
    { id: "d2", label: "its dimension", type: "num", ans: 2 },
    { id: "s3", label: "span{(1,1,0),(2,2,0),(0,0,1)}", type: "choice", opts: ["point", "line", "plane", "all of R³"], ans: "plane" },
    { id: "d3", label: "its dimension", type: "num", ans: 2 }
  ],
  hints: {
    s3: "Count the <em>independent</em> vectors, not the vectors. Look hard at the first two.",
    d3: "Three generators, but one is redundant."
  },
  plain: "Line (dim 1); the xy-plane (dim 2); a plane (dim 2) — since (2,2,0)=2(1,1,0).",
  solution:
    "<p><strong>span{(1,2,3)}</strong> — one nonzero vector, so a <em>line</em> through the origin, dimension 1. " +
    "Parametrically \\(\\{(t,2t,3t) : t\\in\\mathbb{R}\\}\\).</p>" +
    "<p><strong>span{(1,0,0),(0,1,0)}</strong> — two independent vectors, so a <em>plane</em> through the origin, " +
    "dimension 2. It is exactly \\(\\{(x,y,0)\\}\\), the \\(xy\\)-plane, i.e. the set \\(z=0\\).</p>" +
    "<p><strong>span{(1,1,0),(2,2,0),(0,0,1)}</strong> — the trap. \\((2,2,0)=2(1,1,0)\\), so the second generator " +
    "contributes nothing: by Theorem 1(3) it can be deleted without changing the span. What is left is " +
    "\\(\\operatorname{span}\\{(1,1,0),(0,0,1)\\}\\), two independent vectors, so a <em>plane</em> of dimension 2 — " +
    "the set \\(\\{(t,t,s)\\}\\), equivalently the plane \\(x=y\\). Three generators, dimension two: the number of " +
    "vectors you are handed is an upper bound on the dimension, never a measurement of it.</p>"
},

A3: {
  statement: "**A3 · Foundation · paper — reachable or not.** Is \\((4,5)\\) in \\(\\operatorname{span}\\{(1,2),(2,4)\\}\\)? Is \\((3,6)\\)? Give both a geometric description and a coefficient calculation.",
  fields: [
    { id: "p", label: "(4,5) ∈ span?", type: "choice", opts: ["yes", "no"], ans: "no" },
    { id: "q", label: "(3,6) ∈ span?", type: "choice", opts: ["yes", "no"], ans: "yes" }
  ],
  hints: { p: "First work out what that span actually <em>is</em>. The two generators are not independent." },
  plain: "The span is the line y=2x. (4,5) is not on it; (3,6) is.",
  solution:
    "<p>First reduce the span. \\((2,4)=2(1,2)\\), so \\(\\operatorname{span}\\{(1,2),(2,4)\\}=\\operatorname{span}\\{(1,2)\\}\\) — " +
    "the <em>line</em> \\(\\{(t,2t)\\}\\), that is \\(y=2x\\). Not a plane; the second vector was redundant.</p>" +
    "<p><strong>(4,5):</strong> we would need \\(t=4\\) and \\(2t=5\\) simultaneously. Inconsistent, so <em>no</em>. " +
    "Geometrically \\(5 \\ne 8\\), so the point sits off the line.</p>" +
    "<p><strong>(3,6):</strong> \\(t=3\\) gives \\((3,6)\\). <em>Yes</em>, with \\((3,6)=3(1,2)+0(2,4)\\) — or " +
    "\\(1\\cdot(1,2)+1\\cdot(2,4)\\), or infinitely many other recipes. Non-uniqueness of the coefficients is exactly " +
    "what dependence buys you, and exactly what Theorem 3 says a basis removes.</p>"
},

A4: {
  statement: "**A4 · Foundation · paper — exhibit the redundancy.** Decide independence for each list, giving a nonzero dependency relation when one exists:\n\n| Case | Vectors |\n|---|---|\n| (a) | \\((1,2),(3,7)\\) |\n| (b) | \\((1,2),(2,4)\\) |\n| (c) | \\((1,0,1),(0,1,1),(1,1,2)\\) |\n| (d) | \\((1,0,0),(0,1,0),(0,0,1),(1,1,1)\\) |\n| (e) | \\((0,0),(1,3)\\) |",
  fields: [
    { id: "a", label: "(a)", type: "choice", opts: ["independent", "dependent"], ans: "independent" },
    { id: "b", label: "(b)", type: "choice", opts: ["independent", "dependent"], ans: "dependent" },
    { id: "bc", label: "(b) coefficients", type: "ratio", ans: [2, -1] },
    { id: "c", label: "(c)", type: "choice", opts: ["independent", "dependent"], ans: "dependent" },
    { id: "cc", label: "(c) coefficients", type: "ratio", ans: [1, 1, -1] },
    { id: "d", label: "(d)", type: "choice", opts: ["independent", "dependent"], ans: "dependent" },
    { id: "dc", label: "(d) coefficients", type: "ratio", ans: [1, 1, 1, -1] },
    { id: "e", label: "(e)", type: "choice", opts: ["independent", "dependent"], ans: "dependent" },
    { id: "ec", label: "(e) coefficients", type: "ratio", ans: [1, 0] }
  ],
  hints: {
    bc: "Any nonzero multiple of the right relation is accepted — so scale is not what is wrong.",
    d: "Four vectors in \\(\\mathbb{R}^3\\). You do not need to compute anything.",
    ec: "Which coefficient is <em>forced</em> to be zero, and which is free?"
  },
  plain: "(a) independent. (b) dependent, 2v1-v2=0. (c) dependent, v1+v2-v3=0. (d) dependent, e1+e2+e3-(1,1,1)=0. (e) dependent, 1·(0,0)+0·(1,3)=0.",
  solution:
    "<p><strong>(a) Independent.</strong> \\(\\det\\begin{pmatrix}1&3\\\\2&7\\end{pmatrix} = 7-6 = 1 \\ne 0\\), so neither is a " +
    "multiple of the other.</p>" +
    "<p><strong>(b) Dependent.</strong> \\((2,4)=2(1,2)\\), giving \\(2(1,2)-1(2,4)=\\mathbf{0}\\): coefficients \\((2,-1)\\), " +
    "or any nonzero multiple.</p>" +
    "<p><strong>(c) Dependent.</strong> \\((1,0,1)+(0,1,1)=(1,1,2)\\), so \\((1,1,-1)\\). Worth noting: <em>every pair</em> " +
    "here is independent — dependence lives in the set of three, which is the point of A13.</p>" +
    "<p><strong>(d) Dependent, with no computation.</strong> Four vectors in \\(\\mathbb{R}^3\\) and \\(4 &gt; 3\\), so " +
    "Theorem 2 settles it before you look at the entries. The explicit relation is " +
    "\\(\\mathbf{e}_1+\\mathbf{e}_2+\\mathbf{e}_3-(1,1,1)=\\mathbf{0}\\): coefficients \\((1,1,1,-1)\\).</p>" +
    "<p><strong>(e) Dependent.</strong> Any set containing \\(\\mathbf{0}\\) is dependent: take \\(c_1=1, c_2=0\\), so " +
    "\\(1\\cdot(0,0)+0\\cdot(1,3)=\\mathbf{0}\\) with a nonzero coefficient. Coefficients \\((1,0)\\). Note the relation " +
    "is <em>not</em> \\((1,1)\\) — the second coefficient is forced to vanish, because \\((1,3)\\ne\\mathbf{0}\\).</p>"
},

A5: {
  statement: "**A5 · Foundation · paper — a parameter changes the span.** For which \\(t\\) are \\((1,t)\\) and \\((t,4)\\) dependent? Interpret both answers geometrically.",
  fields: [{ id: "t", label: "all such t", type: "set", ans: [-2, 2] }],
  hints: { t: "Two vectors in \\(\\mathbb{R}^2\\) are dependent exactly when the determinant vanishes. There is more than one root." },
  plain: "t = 2 and t = -2.",
  solution:
    "<p>Two vectors in \\(\\mathbb{R}^2\\) are dependent iff \\(\\det = 0\\): here " +
    "\\(1\\cdot 4 - t\\cdot t = 4-t^2 = 0\\), so \\(t = \\pm 2\\).</p>" +
    "<p><strong>\\(t=2\\):</strong> the vectors are \\((1,2)\\) and \\((2,4)\\) — the second is \\(+2\\) times the first. " +
    "Same direction, one twice as long; the span is the line \\(y=2x\\).</p>" +
    "<p><strong>\\(t=-2\\):</strong> the vectors are \\((1,-2)\\) and \\((-2,4)\\) — the second is \\(-2\\) times the first. " +
    "<em>Opposite</em> direction. The span is still a line, \\(y=-2x\\), because span is closed under negative scalars. " +
    "Missing \\(t=-2\\) is the standard slip: dependence is about lying on a common line through the origin, not about " +
    "pointing the same way.</p>"
},

A6: {
  statement: "**A6 · Core · paper — the subspace test.** Which subsets of \\(\\mathbb R^3\\) are subspaces: (a) \\(x+y+z=0\\); (b) \\(x+y+z=1\\); (c) \\(x=y=z\\); (d) \\(xyz=0\\); (e) \\(x\\in\\mathbb Z\\)? For a yes, check all three conditions. For a no, give a specific failed condition and a counterexample.",
  fields: [
    { id: "a", label: "(a) x+y+z=0", type: "choice", opts: ["subspace", "not a subspace"], ans: "subspace" },
    { id: "b", label: "(b) x+y+z=1", type: "choice", opts: ["subspace", "not a subspace"], ans: "not a subspace" },
    { id: "c", label: "(c) x=y=z", type: "choice", opts: ["subspace", "not a subspace"], ans: "subspace" },
    { id: "d", label: "(d) xyz=0", type: "choice", opts: ["subspace", "not a subspace"], ans: "not a subspace" },
    { id: "e", label: "(e) x ∈ ℤ", type: "choice", opts: ["subspace", "not a subspace"], ans: "not a subspace" }
  ],
  hints: {
    d: "It contains \\(\\mathbf{0}\\) and survives scaling. Try adding two of its members.",
    e: "It contains \\(\\mathbf{0}\\) and is closed under addition. Now scale by \\(\\tfrac12\\)."
  },
  plain: "(a) yes. (b) no, 0 not in it. (c) yes. (d) no, not closed under addition. (e) no, not closed under scaling.",
  solution:
    "<p><strong>(a) Subspace.</strong> \\(\\mathbf{0}\\) satisfies \\(0+0+0=0\\); if \\(\\mathbf{u},\\mathbf{w}\\) both have " +
    "coordinate sum \\(0\\) so does \\(\\mathbf{u}+\\mathbf{w}\\); and \\(c\\mathbf{u}\\) has sum \\(c\\cdot 0=0\\). " +
    "It is a plane through the origin, dimension 2.</p>" +
    "<p><strong>(b) Not.</strong> \\(\\mathbf{0}\\notin W\\) since \\(0+0+0=1\\) is false. Fails at the first condition. " +
    "It is a plane, but a translated one — an affine set.</p>" +
    "<p><strong>(c) Subspace.</strong> The line \\(\\{(t,t,t)\\}\\) \\(=\\operatorname{span}\\{(1,1,1)\\}\\), and every span " +
    "is a subspace (A8). Dimension 1.</p>" +
    "<p><strong>(d) Not — and this is the instructive one.</strong> \\(xyz=0\\) is the union of the three coordinate planes. " +
    "It contains \\(\\mathbf{0}\\), and it <em>is</em> closed under scaling, so two of the three conditions hold. But " +
    "\\((1,1,0)\\) and \\((0,0,1)\\) both lie in it while \\((1,1,1)\\) does not. A union of subspaces is almost never a " +
    "subspace — which is checkpoint problem 3.</p>" +
    "<p><strong>(e) Not.</strong> It contains \\(\\mathbf{0}\\) and is closed under addition (integers add to integers), " +
    "but \\(\\tfrac12(1,0,0)=(\\tfrac12,0,0)\\notin W\\). Scaling is the condition that fails, and it fails because " +
    "\\(\\mathbb{Z}\\) is not closed under division — the underlying field matters.</p>"
},

A7: {
  proof: true,
  statement: "**A7 · Core · paper — the three faces of dependence.** Prove Theorem 1 by the cycle (1) implies (2), (2) implies (3), (3) implies (1). Pick an index with \\(c_j\\ne0\\) **before** dividing by \\(c_j\\). Include the case of a single zero generator.",
  reference:
    "(1)=>(2): dependence gives scalars c_i, not all zero, with sum c_i v_i = 0. CHOOSE an index j with c_j != 0 — this choice must be made explicitly before dividing. Then c_j v_j = -sum_{i!=j} c_i v_i, and since c_j != 0 we may divide by it: v_j = sum_{i!=j} (-c_i/c_j) v_i, which exhibits v_j in the span of the others.\n" +
    "(2)=>(3): say v_j = sum_{i!=j} a_i v_i, and write S = {v_1..vk}, S' = S minus v_j. span S' is contained in span S trivially. For the reverse, take w = sum_i b_i v_i in span S and substitute: w = sum_{i!=j} b_i v_i + b_j sum_{i!=j} a_i v_i = sum_{i!=j} (b_i + b_j a_i) v_i, which lies in span S'. So the two spans are equal.\n" +
    "(3)=>(1): if span S = span S', then v_j is in span S, hence in span S', so v_j = sum_{i!=j} a_i v_i. Rearranged, sum_{i!=j} a_i v_i + (-1) v_j = 0 — a relation whose coefficient on v_j is -1, which is nonzero. So the set is dependent.\n" +
    "Common failures: dividing by c_j without first asserting c_j != 0; proving only (1)=>(2) and (2)=>(1) and claiming the equivalence of all three; asserting span S' is contained in span S without noting it is the trivial inclusion; forgetting that (3) requires exhibiting a NONZERO coefficient, which is why -1 is the coefficient to point at.",
  solution:
    "<p><strong>(1) ⟹ (2).</strong> Dependence gives scalars \\(c_i\\), not all zero, with \\(\\sum_i c_i\\mathbf{v}_i=\\mathbf{0}\\). " +
    "<em>Choose</em> an index \\(j\\) with \\(c_j \\ne 0\\) — this choice must be made before you divide by anything. Then " +
    "\\(c_j\\mathbf{v}_j = -\\sum_{i\\ne j} c_i\\mathbf{v}_i\\), and since \\(c_j\\ne 0\\) we may divide:</p>" +
    "\\[ \\mathbf{v}_j = \\sum_{i \\ne j} \\left(\\frac{-c_i}{c_j}\\right)\\mathbf{v}_i \\in \\operatorname{span}\\{\\mathbf{v}_i\\}_{i\\ne j}. \\]" +
    "<p><strong>(2) ⟹ (3).</strong> Suppose \\(\\mathbf{v}_j=\\sum_{i\\ne j} a_i\\mathbf{v}_i\\). Write \\(S\\) for the whole set " +
    "and \\(S'=S\\setminus\\{\\mathbf{v}_j\\}\\). The inclusion \\(\\operatorname{span}S' \\subseteq \\operatorname{span}S\\) is " +
    "immediate, since every combination from \\(S'\\) is a combination from \\(S\\) with \\(c_j=0\\). For the other direction " +
    "take \\(\\mathbf{w}=\\sum_i b_i\\mathbf{v}_i\\) and substitute:</p>" +
    "\\[ \\mathbf{w} = \\sum_{i\\ne j} b_i\\mathbf{v}_i + b_j\\sum_{i\\ne j}a_i\\mathbf{v}_i = \\sum_{i\\ne j}(b_i + b_j a_i)\\mathbf{v}_i \\in \\operatorname{span}S'. \\]" +
    "<p>So \\(\\operatorname{span}S = \\operatorname{span}S'\\).</p>" +
    "<p><strong>(3) ⟹ (1).</strong> If \\(\\operatorname{span}S=\\operatorname{span}S'\\) then \\(\\mathbf{v}_j\\), which is " +
    "certainly in \\(\\operatorname{span}S\\), lies in \\(\\operatorname{span}S'\\): \\(\\mathbf{v}_j=\\sum_{i\\ne j}a_i\\mathbf{v}_i\\). " +
    "Rearranging,</p>" +
    "\\[ \\sum_{i\\ne j} a_i\\mathbf{v}_i + (-1)\\mathbf{v}_j = \\mathbf{0}, \\]" +
    "<p>a relation whose coefficient on \\(\\mathbf{v}_j\\) is \\(-1 \\ne 0\\). Hence \\(S\\) is dependent, closing the cycle.</p>" +
    "<div class=\"sol-note\"><strong>What usually goes wrong.</strong> Dividing by \\(c_j\\) without first asserting it is " +
    "nonzero — that single omission is the whole content of the step. And proving (1)⟺(2) only: with three statements a " +
    "cycle is the economical route, but you must actually close it.</div>",
  plain: "(1)=>(2): dependence gives scalars c_i, not all zero, with sum c_i v_i = 0. CHOOSE an index j with c_j != 0 — this choice must be made explicitly before dividing. Then c_j v_j = -sum_{i!=j} c_i v_i, and since c_j != 0 we may divide by it: v_j = sum_{i!=j} (-c_i/c_j) v_i, which exhibits v_j in the span of the others.\n(2)=>(3): say v_j = sum_{i!=j} a_i v_i, and write S = {v_1..vk}, S' = S minus v_j. span S' is contained in span S trivially. For the reverse, take w = sum_i b_i v_i in span S and substitute: w = sum_{i!=j} b_i v_i + b_j sum_{i!=j} a_i v_i = sum_{i!=j} (b_i + b_j a_i) v_i, which lies in span S'. So the two spans are equal.\n(3)=>(1): if span S = span S', then v_j is in span S, hence in span S', so v_j = sum_{i!=j} a_i v_i. Rearranged, sum_{i!=j} a_i v_i + (-1) v_j = 0 — a relation whose coefficient on v_j is -1, which is nonzero. So the set is dependent.\nCommon failures: dividing by c_j without first asserting c_j != 0; proving only (1)=>(2) and (2)=>(1) and claiming the equivalence of all three; asserting span S' is contained in span S without noting it is the trivial inclusion; forgetting that (3) requires exhibiting a NONZERO coefficient, which is why -1 is the coefficient to point at."
},

A8: {
  proof: true,
  statement: "**A8 · Core · paper — span is the smallest subspace.** Prove that \\(\\operatorname{span}\\{v_1,\\dots,v_k\\}\\) passes the three-part test. Then prove that every subspace containing all the generators contains their span. Handle the empty generator list as well.",
  reference:
    "Subspace: (i) 0 = sum 0*v_i is a linear combination, so 0 is in the span. (ii) closure under addition: sum c_i v_i + sum d_i v_i = sum (c_i + d_i) v_i, again a linear combination. (iii) closure under scaling: a * sum c_i v_i = sum (a c_i) v_i. Each step uses the distributive axioms (7) and (8), not just rearrangement.\n" +
    "Smallest: let W be a subspace with every v_i in W. Each c_i v_i is in W by closure under scaling. Then sum_{i=1}^{k} c_i v_i is in W by closure under addition — formally by induction on k, since the axiom gives closure for two summands at a time. Hence every element of the span lies in W, i.e. span is contained in W.\n" +
    "Common failures: asserting closure under addition for k summands directly from the two-summand axiom without the induction; forgetting to check 0 is in the set; proving span is a subset of W but not stating why that is what 'smallest' means.",
  solution:
    "<p><strong>It is a subspace.</strong> Write \\(U=\\operatorname{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}\\).</p>" +
    "<ul><li>\\(\\mathbf{0}\\in U\\): take every \\(c_i=0\\), so \\(\\mathbf{0}=\\sum_i 0\\,\\mathbf{v}_i\\) is itself a linear combination.</li>" +
    "<li>Closed under addition: \\(\\sum_i c_i\\mathbf{v}_i + \\sum_i d_i\\mathbf{v}_i = \\sum_i (c_i+d_i)\\mathbf{v}_i\\), " +
    "which is again a linear combination. (The regrouping is axiom (8) plus commutativity, not mere notation.)</li>" +
    "<li>Closed under scaling: \\(a\\sum_i c_i\\mathbf{v}_i = \\sum_i (ac_i)\\mathbf{v}_i\\), by axioms (7) and (5).</li></ul>" +
    "<p><strong>It is the smallest.</strong> Let \\(W\\) be any subspace with \\(\\mathbf{v}_i\\in W\\) for all \\(i\\). " +
    "By closure under scaling, \\(c_i\\mathbf{v}_i\\in W\\) for every scalar. By closure under addition — applied " +
    "\\(k-1\\) times, formally an induction on \\(k\\), since the axiom only gives you two summands at a time — the sum " +
    "\\(\\sum_{i=1}^{k} c_i\\mathbf{v}_i\\) lies in \\(W\\). That sum was an arbitrary element of \\(U\\), so \\(U\\subseteq W\\).</p>" +
    "<p>Since \\(U\\) is itself such a subspace, it is the least one under inclusion. This is what licenses the phrase " +
    "\"the subspace generated by\" — and why \"span\" and \"subspace\" are two views of one object.</p>" +
    "<div class=\"sol-note\"><strong>What usually goes wrong.</strong> Jumping from the two-summand closure axiom to a " +
    "\\(k\\)-fold sum without the induction. It is one line to say, and leaving it out is the difference between a proof " +
    "and a gesture.</div>",
  plain: "Subspace: (i) 0 = sum 0*v_i is a linear combination, so 0 is in the span. (ii) closure under addition: sum c_i v_i + sum d_i v_i = sum (c_i + d_i) v_i, again a linear combination. (iii) closure under scaling: a * sum c_i v_i = sum (a c_i) v_i. Each step uses the distributive axioms (7) and (8), not just rearrangement.\nSmallest: let W be a subspace with every v_i in W. Each c_i v_i is in W by closure under scaling. Then sum_{i=1}^{k} c_i v_i is in W by closure under addition — formally by induction on k, since the axiom gives closure for two summands at a time. Hence every element of the span lies in W, i.e. span is contained in W.\nCommon failures: asserting closure under addition for k summands directly from the two-summand axiom without the induction; forgetting to check 0 is in the set; proving span is a subset of W but not stating why that is what 'smallest' means."
},

A9: {
  proof: true,
  statement: "**A9 · Core · paper — exactly one recipe.** Complete both directions of Theorem 3. Distinguish existence from uniqueness at every step, including in the converse.",
  reference:
    "(=>) Assume B is a basis. EXISTENCE: B spans V, so every v has at least one representation. UNIQUENESS: suppose sum c_i b_i = sum d_i b_i. Subtract: sum (c_i - d_i) b_i = 0. Independence forces every c_i - d_i = 0, so c_i = d_i for all i. Hence exactly one.\n" +
    "(<=) Assume every v has exactly one representation. SPANNING: existence for every v is precisely the statement that B spans V. INDEPENDENCE: suppose sum c_i b_i = 0. The zero vector also has the representation sum 0*b_i = 0. Uniqueness applied to v = 0 forces c_i = 0 for all i. Hence B is independent, and with spanning, a basis.\n" +
    "Common failures: proving only the forward direction; in the converse, forgetting that uniqueness must be applied to the specific vector 0 (that is where independence comes from); conflating 'at least one' with 'exactly one' and so never using independence at all.",
  solution:
    "<p><strong>(⟹) \\(B\\) a basis gives exactly one representation.</strong></p>" +
    "<p><em>Existence.</em> \\(B\\) spans \\(V\\), so every \\(\\mathbf{v}\\) has at least one representation — that is what " +
    "spanning means.</p>" +
    "<p><em>Uniqueness.</em> Suppose \\(\\sum_i c_i\\mathbf{b}_i = \\sum_i d_i\\mathbf{b}_i\\). Subtracting, " +
    "\\(\\sum_i (c_i-d_i)\\mathbf{b}_i=\\mathbf{0}\\). Independence says the only such relation is the trivial one, so " +
    "\\(c_i-d_i=0\\), i.e. \\(c_i=d_i\\) for every \\(i\\).</p>" +
    "<p><strong>(⟸) Exactly one representation makes \\(B\\) a basis.</strong></p>" +
    "<p><em>Spanning.</em> \"Every \\(\\mathbf{v}\\) has a representation\" is literally the definition of spanning.</p>" +
    "<p><em>Independence.</em> Suppose \\(\\sum_i c_i\\mathbf{b}_i=\\mathbf{0}\\). But \\(\\mathbf{0}\\) also has the " +
    "representation \\(\\sum_i 0\\,\\mathbf{b}_i\\). Apply the uniqueness hypothesis <em>to the vector</em> \\(\\mathbf{0}\\): " +
    "the two coefficient lists must agree, so \\(c_i=0\\) for all \\(i\\).</p>" +
    "<div class=\"sol-note\"><strong>Where the work is.</strong> The forward direction uses independence; the converse " +
    "<em>produces</em> it, and it produces it by applying uniqueness at the single point \\(\\mathbf{v}=\\mathbf{0}\\). If your " +
    "converse never mentions \\(\\mathbf{0}\\), you have proved spanning and stopped.</div>",
  plain: "(=>) Assume B is a basis. EXISTENCE: B spans V, so every v has at least one representation. UNIQUENESS: suppose sum c_i b_i = sum d_i b_i. Subtract: sum (c_i - d_i) b_i = 0. Independence forces every c_i - d_i = 0, so c_i = d_i for all i. Hence exactly one.\n(<=) Assume every v has exactly one representation. SPANNING: existence for every v is precisely the statement that B spans V. INDEPENDENCE: suppose sum c_i b_i = 0. The zero vector also has the representation sum 0*b_i = 0. Uniqueness applied to v = 0 forces c_i = 0 for all i. Hence B is independent, and with spanning, a basis.\nCommon failures: proving only the forward direction; in the converse, forgetting that uniqueness must be applied to the specific vector 0 (that is where independence comes from); conflating 'at least one' with 'exactly one' and so never using independence at all."
},

A10: {
  proof: true,
  statement: "**A10 · Core · paper — adding a new direction.** If \\(v_1,\\dots,v_k\\) are independent and \\(w\\) is outside their span, prove that \\(v_1,\\dots,v_k,w\\) are independent. This is the step that lets you extend an independent list to a basis.",
  reference:
    "Suppose sum_{i} c_i v_i + d w = 0. Split on d.\n" +
    "Case d != 0: then w = sum_i (-c_i/d) v_i, so w is in span{v1..vk}, contradicting the hypothesis. So this case cannot occur.\n" +
    "Case d = 0: the relation reduces to sum_i c_i v_i = 0, and independence of {v1..vk} forces every c_i = 0.\n" +
    "Either way all coefficients vanish, so the enlarged set is independent.\n" +
    "Common failures: not case-splitting on d, and instead dividing by d immediately; concluding only that d = 0 and forgetting to then invoke independence of the original set for the c_i; arguing from 'w adds a new direction' without a relation.",
  solution:
    "<p>Suppose \\(\\sum_{i=1}^{k} c_i\\mathbf{v}_i + d\\,\\mathbf{w} = \\mathbf{0}\\). The whole proof is a case split on \\(d\\).</p>" +
    "<p><strong>If \\(d \\ne 0\\):</strong> we may divide, giving " +
    "\\(\\mathbf{w} = \\sum_i \\left(\\tfrac{-c_i}{d}\\right)\\mathbf{v}_i\\), which puts \\(\\mathbf{w}\\) in " +
    "\\(\\operatorname{span}\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k\\}\\) — contradicting the hypothesis. So this case is empty.</p>" +
    "<p><strong>Hence \\(d = 0\\),</strong> and the relation collapses to \\(\\sum_i c_i\\mathbf{v}_i=\\mathbf{0}\\). Independence " +
    "of the original set forces \\(c_1=\\cdots=c_k=0\\).</p>" +
    "<p>Every coefficient vanishes, so \\(\\{\\mathbf{v}_1,\\ldots,\\mathbf{v}_k,\\mathbf{w}\\}\\) is independent. \\(\\square\\)</p>" +
    "<div class=\"sol-note\"><strong>Why this is the engine.</strong> Start with any independent set, and while it fails to " +
    "span, pick a \\(\\mathbf{w}\\) outside the span and adjoin it. This lemma says independence survives. In " +
    "\\(\\mathbb{R}^n\\) the process must stop within \\(n\\) steps by Theorem 2 — and when it stops, nothing is outside the " +
    "span, so you have a basis. That is the proof that every independent set extends to a basis.</div>",
  plain: "Suppose sum_{i} c_i v_i + d w = 0. Split on d.\nCase d != 0: then w = sum_i (-c_i/d) v_i, so w is in span{v1..vk}, contradicting the hypothesis. So this case cannot occur.\nCase d = 0: the relation reduces to sum_i c_i v_i = 0, and independence of {v1..vk} forces every c_i = 0.\nEither way all coefficients vanish, so the enlarged set is independent.\nCommon failures: not case-splitting on d, and instead dividing by d immediately; concluding only that d = 0 and forgetting to then invoke independence of the original set for the c_i; arguing from 'w adds a new direction' without a relation."
},

A11: {
  statement: "**A11 · Core · paper — vectors that are polynomials.** Let \\(P_2\\) be the real polynomials of degree at most two, including the zero polynomial. Show that \\((1,x,x^2)\\) is a basis. Then show that \\(B=(1,1+x,1+x+x^2)\\) is a basis and find \\([3+2x-x^2]_B\\).",
  fields: [{ id: "c", label: "[3 + 2x − x²]_B in B = {1, 1+x, 1+x+x²}", type: "vec", ans: [1, 3, -1] }],
  hints: { c: "Expand \\(c_1 + c_2(1+x) + c_3(1+x+x^2)\\) and match coefficients — start from \\(x^2\\), where only one term contributes." },
  plain: "[3+2x-x^2]_B = (1, 3, -1).",
  solution:
    "<p><strong>\\(\\{1,x,x^2\\}\\) is a basis.</strong> Spanning is the definition of \\(P_2\\). For independence, suppose " +
    "\\(a + bx + cx^2 = 0\\) <em>as a function</em>, i.e. for every real \\(x\\). Evaluating at \\(x=0\\) gives \\(a=0\\); at " +
    "\\(x=1\\) and \\(x=-1\\), \\(b+c=0\\) and \\(-b+c=0\\), so \\(b=c=0\\). (Three evaluations, three unknowns — this is the " +
    "Vandermonde argument in miniature.)</p>" +
    "<p><strong>\\(B=\\{1,\\,1+x,\\,1+x+x^2\\}\\) is a basis.</strong> Its members expressed in the standard basis have " +
    "coordinate columns \\((1,0,0), (1,1,0), (1,1,1)\\) — an upper-triangular matrix with \\(1\\)s on the diagonal, so " +
    "determinant \\(1 \\ne 0\\) and the three are independent. Three independent vectors in a 3-dimensional space are a " +
    "basis by Theorem 4, with no need to check spanning separately.</p>" +
    "<p><strong>Coordinates.</strong> Expand and match, starting where only one term contributes:</p>" +
    "\\[ c_1 + c_2(1+x) + c_3(1+x+x^2) = (c_1+c_2+c_3) + (c_2+c_3)x + c_3 x^2. \\]" +
    "<p>Matching \\(x^2\\): \\(c_3=-1\\). Matching \\(x\\): \\(c_2+c_3=2\\), so \\(c_2=3\\). Matching the constant: " +
    "\\(c_1+3-1=3\\), so \\(c_1=1\\). Hence \\([3+2x-x^2]_B=(1,3,-1)\\).</p>" +
    "<p>Check: \\(1 + 3(1+x) - (1+x+x^2) = 1+3+3x-1-x-x^2 = 3+2x-x^2\\). ✓ The same polynomial has coordinates " +
    "\\((3,2,-1)\\) in the standard basis and \\((1,3,-1)\\) in \\(B\\) — coordinates belong to a basis, never to the vector.</p>"
},

A12: {
  statement: "**A12 · Stretch · paper — a relation between functions.** Is \\(\\sin x,\\cos x,\\sin(x+\\pi/4)\\) an independent list of functions \\(\\mathbb R\\to\\mathbb R\\)? A relation must hold at every \\(x\\), not just at a few sampled points. Find one or prove none exists.",
  fields: [
    { id: "v", label: "verdict", type: "choice", opts: ["independent", "dependent"], ans: "dependent" },
    { id: "c", label: "coefficients on (sin x, cos x, sin(x+π/4))", type: "ratio", ans: [1, 1, -Math.SQRT2] }
  ],
  hints: {
    c: "Use the angle-addition formula on the third function. One coefficient is irrational — enter it as <code>-sqrt(2)</code>."
  },
  plain: "Dependent: sin x + cos x - sqrt(2) sin(x + pi/4) = 0 for all x.",
  solution:
    "<p><strong>Dependent.</strong> By the angle-addition formula,</p>" +
    "\\[ \\sin\\!\\left(x+\\tfrac{\\pi}{4}\\right) = \\sin x\\cos\\tfrac{\\pi}{4} + \\cos x\\sin\\tfrac{\\pi}{4} = \\tfrac{1}{\\sqrt2}(\\sin x + \\cos x). \\]" +
    "<p>Multiplying by \\(\\sqrt2\\) and rearranging gives the relation</p>" +
    "\\[ 1\\cdot\\sin x + 1\\cdot\\cos x - \\sqrt{2}\\,\\sin\\!\\left(x+\\tfrac{\\pi}{4}\\right) = 0 \\quad\\text{for every } x, \\]" +
    "<p>so the coefficients \\((1,1,-\\sqrt2)\\) — or any nonzero multiple — witness dependence.</p>" +
    "<div class=\"sol-note\"><strong>The point of the exercise.</strong> These are not tuples; they are elements of the vector " +
    "space of functions \\(\\mathbb{R}\\to\\mathbb{R}\\), where the zero vector is the function that is zero everywhere. So the " +
    "relation has to hold <em>identically</em>, not at one convenient value of \\(x\\) — checking \\(x=0\\) alone proves nothing. " +
    "Every theorem in this module applies here unchanged, which is the payoff of View 4. Incidentally " +
    "\\(\\{\\sin x,\\cos x\\}\\) <em>is</em> independent, and the third function was always inside their span: it is a phase " +
    "shift, and phase shifts live in a 2-dimensional space. That fact is the whole of Fourier analysis in embryo.</div>"
},

A13: {
  proof: true,
  statement: "**A13 · Stretch · paper — pairwise is not enough.** Give three vectors in \\(\\mathbb R^3\\) that are pairwise independent but dependent together. Verify both claims. Explain why checking every pair cannot certify independence of a longer list.\n\n<details><summary>Hints for the by-hand exercises — open after an attempt</summary>\n\nA1–A5: expand the coordinates before reaching for a determinant. For A4, a relation is an entire coefficient list, not just the word “dependent.” A6: two points in different coordinate planes expose the problem with \\(xyz=0\\). A7: isolate a vector using a coefficient known to be nonzero. A8: add two arbitrary combinations and collect coefficients. A9: subtract two recipes. A10: split on whether the coefficient of \\(w\\) vanishes. A11: compare coefficients of \\(1,x,x^2\\). A12: use the angle-addition identity. A13: take two independent vectors and add them to make the third.\n\n</details>",
  reference:
    "Example: v1 = (1,0,0), v2 = (0,1,0), v3 = (1,1,0). No two of these are scalar multiples of one another, so every PAIR is independent. But v1 + v2 - v3 = 0, a nontrivial relation, so the set of three is dependent.\n" +
    "Why: independence asks whether there is ANY nontrivial relation supported on the whole set. Checking pairs only rules out relations whose support has size 2. A relation can have support of size 3 (or k) while every 2-element subset admits none. Equivalently, the three vectors lie in a common plane through the origin without any two being collinear — the geometric version of the same statement.\n" +
    "Common failures: giving three vectors of which two ARE multiples (so a pair is dependent and the example fails); giving a correct example but explaining it as 'they are coplanar' without connecting coplanarity to the existence of a relation with three nonzero coefficients.",
  solution:
    "<p><strong>An example.</strong> \\(\\mathbf{v}_1=(1,0,0)\\), \\(\\mathbf{v}_2=(0,1,0)\\), \\(\\mathbf{v}_3=(1,1,0)\\).</p>" +
    "<p><em>Pairwise independent:</em> no two of them are scalar multiples of one another — check the three pairs. " +
    "<em>Dependent as a set:</em> \\(\\mathbf{v}_1+\\mathbf{v}_2-\\mathbf{v}_3=\\mathbf{0}\\), a relation with all three " +
    "coefficients nonzero.</p>" +
    "<p><strong>Why this is not a curiosity.</strong> Independence asks whether <em>any</em> nontrivial relation exists on the " +
    "whole set. Checking pairs only rules out relations whose support has size two. Nothing stops a relation from needing " +
    "all three vectors at once, and that is exactly what happens here. Geometrically: the three vectors lie in a common " +
    "plane through the origin (the \\(xy\\)-plane) without any two lying on a common line.</p>" +
    "<div class=\"sol-note\"><strong>Why an RE should care.</strong> This is why \"the feature directions are roughly " +
    "pairwise orthogonal, so they are independent\" is a non-sequitur. Pairwise near-orthogonality bounds each " +
    "\\(|\\langle \\mathbf{v}_i,\\mathbf{v}_j\\rangle|\\) and says nothing about the joint relation that Theorem 2 guarantees " +
    "must exist once \\(m &gt; d\\). C3 makes you measure the gap.</div>",
  plain: "Example: v1 = (1,0,0), v2 = (0,1,0), v3 = (1,1,0). No two of these are scalar multiples of one another, so every PAIR is independent. But v1 + v2 - v3 = 0, a nontrivial relation, so the set of three is dependent.\nWhy: independence asks whether there is ANY nontrivial relation supported on the whole set. Checking pairs only rules out relations whose support has size 2. A relation can have support of size 3 (or k) while every 2-element subset admits none. Equivalently, the three vectors lie in a common plane through the origin without any two being collinear — the geometric version of the same statement.\nCommon failures: giving three vectors of which two ARE multiples (so a pair is dependent and the example fails); giving a correct example but explaining it as 'they are coplanar' without connecting coplanarity to the existence of a relation with three nonzero coefficients."
},

/* ============================== TRACK B ================================== */

B1: {
  statement: "**B1 · Foundation · NumPy — build a linear combination.** Implement both functions, then compare them on several rectangular shapes, negative coefficients, and zero coefficients. Use loops only in the first implementation, and matrix multiplication in the second.\n\n~~~python\nimport numpy as np\n\ndef lincomb_loops(vectors, coeffs):\n    \"\"\"Nonempty list of equal-length 1-D vectors; one coefficient each.\"\"\"\n    raise NotImplementedError(\"Accumulate each coefficient times its vector\")\n\ndef lincomb_vec(V, c):\n    \"\"\"V has shape (n, k), with vectors as columns; c has shape (k,).\"\"\"\n    raise NotImplementedError(\"Express the same operation with @\")\n\nvectors = [np.array([1., 2., 0.]), np.array([0., 1., 3.])]\nc = np.array([2., -1.])\nV = np.column_stack(vectors)\nassert np.allclose(lincomb_loops(vectors, c), lincomb_vec(V, c))\n~~~",
  plain: "Accumulate c_i * v_i in a loop; the vectorised form is V @ c.",
  solution:
    "<pre><code>import numpy as np\n\ndef lincomb_loops(vectors, coeffs):\n" +
    "    assert len(vectors) == len(coeffs)\n" +
    "    out = np.zeros_like(np.asarray(vectors[0], dtype=float))\n" +
    "    for v, c in zip(vectors, coeffs):\n" +
    "        out = out + c * np.asarray(v, dtype=float)\n" +
    "    return out\n\ndef lincomb_vec(V, c):\n    return V @ c            # columns of V, weighted by c\n</code></pre>" +
    "<p><strong>The property test</strong> — this, not three hand-picked examples, is the check that matters:</p>" +
    "<pre><code>rng = np.random.default_rng(0)\nfor _ in range(200):\n" +
    "    n, k = rng.integers(1, 8), rng.integers(1, 8)\n" +
    "    V = rng.normal(size=(n, k)); c = rng.normal(size=k)\n" +
    "    assert np.allclose(lincomb_loops(list(V.T), list(c)), lincomb_vec(V, c))\n" +
    "# linearity in the coefficients, which is the actual mathematical content\n" +
    "for _ in range(200):\n    V = rng.normal(size=(5, 3)); c, d = rng.normal(size=3), rng.normal(size=3)\n" +
    "    a = rng.normal()\n    assert np.allclose(V @ (a*c + d), a*(V @ c) + V @ d)\n</code></pre>" +
    "<div class=\"sol-note\"><strong>The idea to keep.</strong> <code>V @ c</code> <em>is</em> the linear combination of the " +
    "columns of <code>V</code> weighted by <code>c</code>. Read every matrix-vector product that way from here on and half of " +
    "Module 2 becomes obvious.</div>"
},

B2: {
  statement: "**B2 · Core · NumPy — an independence decision needs a tolerance.** Implement `is_dependent_2d(u, v, tol=1e-9)` using \\(|u_1v_2-u_2v_1|\\le\\mathrm{tol}\\). Compare an exactly parallel pair, unit vectors separated by \\(10^{-8}\\) radians, and the standard basis. Find an answer that changes with `tol`. Then multiply both input vectors by \\(10^{-6}\\). Explain why a fixed determinant threshold is scale-sensitive: scaling both columns by \\(s\\) scales the determinant by \\(s^2\\). For nonzero vectors, compare with the scale-free ratio in section 12.",
  plain: "First implement the requested absolute determinant threshold. Rescaling both vectors by s scales the determinant by s² and can change its verdict. For nonzero vectors compare |det|/(||u|| ||v||) with an angular tolerance.",
  solution: "<pre><code>def is_dependent_2d(u, v, tol=1e-9):\n    return abs(u[0]*v[1] - u[1]*v[0]) &lt;= tol\n</code></pre><p>Parallel vectors give zero determinant. Unit vectors separated by \\(10^{-8}\\) radians have determinant approximately \\(10^{-8}\\), so tolerances \\(10^{-6}\\) and \\(10^{-12}\\) give different verdicts. The standard basis has determinant 1, but scaling both vectors by \\(10^{-6}\\) makes it \\(10^{-12}\\): the absolute test now calls the pair numerically dependent even though it is still orthogonal.</p><p>For nonzero vectors compare \\(|\\det|/(\\|u\\|\\|v\\|)=|\\sin\\theta|\\) with a dimensionless tolerance. Handle a zero vector separately. This ratio measures angular collapse, not unequal column scaling. Numerical rank and conditioning are developed in Modules 8–9.</p>"
},

B3: {
  statement: "**B3 · Core · NumPy — the Gram determinant, and its limits.** Form \\(G=V^TV\\); `np.linalg.det` is allowed. Use random \\(3\\times3\\) and \\(3\\times2\\) matrices and dependent versions made by replacing one column with another. In exact arithmetic, \\(\\det G=0\\) exactly when the columns are dependent; justify this using \\(c^TGc=\\|Vc\\|^2\\). Compare with floating-point results without expecting literal zero. In two columns, derive\n\n$$\n\\det G=\\|u\\|^2\\|v\\|^2-(u^Tv)^2\n=\\|u\\|^2\\|v\\|^2\\sin^2\\theta.\n$$\n\nSo \\(\\sqrt{\\det G}\\) is area. In three columns it is volume, a fact developed in the determinant treatment. Now make two columns nearly parallel and explain why a very small or slightly negative computed determinant is not a trustworthy geometric volume. Do not hide that failure by blindly taking a square root.",
  plain: "Use c^T V^T V c = ||Vc||² to prove identical null spaces, hence det G = 0 iff the columns are dependent in exact arithmetic. For two columns det G = ||u||²||v||² - (u^T v)², whose square root is area. Near dependence, rounding in G and its determinant can destroy relative accuracy or produce a negative result.",
  solution: "<p>If \\(Vc=0\\), then \\(V^TVc=0\\). Conversely, \\(V^TVc=0\\) gives \\(\\|Vc\\|^2=0\\), hence \\(Vc=0\\). Thus the Gram matrix is singular exactly when the columns are dependent, including for a tall \\(V\\).</p><p>For two columns, expand the 2×2 determinant to obtain \\(\\|u\\|^2\\|v\\|^2-(u^Tv)^2=\\|u\\|^2\\|v\\|^2\\sin^2\\theta\\). Its square root is the parallelogram area. Test both 3×3 and 3×2 matrices, then duplicate a column and make two columns nearly parallel. Do not expect exact zero from floating-point determinants: subtraction of nearly equal quantities and rounding in the Gram matrix can obscure a small positive value or make it negative. Taking a square root blindly cannot repair this. The general volume interpretation is developed in Module 5.</p>"
},

B4: {
  statement: "**B4 · Core · NumPy — membership by reconstruction.** Write `in_span(V, w, atol=1e-9, rtol=1e-9)` using `np.linalg.lstsq(V, w, rcond=None)` and a residual test. The least-squares solver is allowed here as a preview of the projections chapter. Always compute `np.linalg.norm(V @ c - w)` yourself: the returned `residuals` array can be empty for underdetermined or rank-deficient inputs even when the target is outside the span. Test reachable, unreachable, and nearly reachable targets; specify your absolute-plus-relative decision rule.",
  plain: "Compute c with lstsq, then explicitly measure ||Vc-w||. Accept when residual <= atol + rtol*||w||. Do not use an empty returned residuals array as evidence of consistency. Test dependent and rectangular cases as well as a nearly reachable target.",
  solution: "<pre><code>def in_span(V, w, atol=1e-9, rtol=1e-9):\n    c, *_ = np.linalg.lstsq(V, w, rcond=None)\n    residual = np.linalg.norm(V @ c - w)\n    return residual &lt;= atol + rtol*np.linalg.norm(w), c\n</code></pre><p>For the xy-plane in ℝ³, (3,4,0) is reachable and (0,0,1) is not. A target (3,4,δ) has residual |δ|, so vary δ across the threshold. Include a rank-deficient input with an unreachable target: the library's returned residuals array can be empty even then. This is a numerical membership decision, and a small residual does not guarantee stable coefficients.</p>"
},

B5: {
  statement: "**B5 · Core · NumPy — a nonzero relation in a wide matrix.** Draw \\(V\\) with shape \\((5,6)\\) and find \\(c\\ne0\\) such that \\(Vc\\approx0\\). `np.linalg.svd` is allowed. The SVD gives orthonormal right directions; its theory comes later. For this experiment, request the **full** right factor:\n\n~~~python\nimport numpy as np\n\nrng = np.random.default_rng(0)\nV = rng.normal(size=(5, 6))\nU, singular_values, Vh = np.linalg.svd(V, full_matrices=True)\nc = Vh[-1]\nprint(Vh.shape, np.linalg.norm(V @ c), np.linalg.norm(c))\n~~~\n\nFor a full-row-rank \\(5\\times6\\) matrix, `Vh` has shape \\((6,6)\\), and its final row supplies the missing null direction. There are only five returned singular values; the null direction corresponds to the extra right vector, not necessarily to a zero in that returned list. Repeat with `full_matrices=False`: `Vh` is then \\((5,6)\\), and its final row generally does **not** give a dependency relation. Explain the difference before using SVD to check another wide matrix.",
  plain: "For a full-row-rank 5×6 matrix, full SVD returns Vh of shape 6×6 but only five singular values. The final row of full Vh is the extra null direction, not a vector paired with the smallest returned singular value. Reduced Vh has shape 5×6 and omits it. Check ||Vc|| and ||c||=1.",
  solution: "<pre><code>rng = np.random.default_rng(0)\nV = rng.normal(size=(5, 6))\nU, s, Vh = np.linalg.svd(V, full_matrices=True)\nc = Vh[-1]\nassert Vh.shape == (6, 6)\nassert np.isclose(np.linalg.norm(c), 1)\nassert np.linalg.norm(V @ c) &lt; 1e-9 * np.linalg.norm(V)\nUr, sr, Vhr = np.linalg.svd(V, full_matrices=False)\nassert Vhr.shape == (5, 6)\n</code></pre><p>The five returned singular values can all be positive. The full right factor has an additional row spanning the null direction, beyond those paired with the returned values. The last row of the reduced factor generally has a nonzero image, with norm equal to the smallest returned singular value. Repeat the residual check across seeds and wide shapes.</p>"
},

B6: {
  statement: "**B6 · Core · NumPy — coordinates near collapse.** For \\(B=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}\\), implement `coords_in_basis(B, v)` using\n\n$$\nB^{-1}=\\frac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix},\n$$\n\nrejecting a determinant too small under your stated tolerance. Check standard, skewed, and rotated bases by reconstruction. Then use \\(b_1=(1,0)\\), \\(b_2=(\\cos\\theta,\\sin\\theta)\\), and fixed \\(v=(0,1)\\). Sweep \\(\\theta\\) toward zero and plot \\(\\|[v]_B\\|\\). Repeat with \\(v=(1,0)\\), whose coordinates stay \\((1,0)\\) along this path. Sensitivity permits large changes; it does not require every target to have large coordinates.",
  plain: "For b1=(1,0), b2=(cos θ,sin θ), v=(0,1) has coordinates (-cot θ,csc θ), which grow as θ→0. The target (1,0) instead has coordinates (1,0) throughout. Reject a determinant below a stated threshold and check reconstruction.",
  solution: "<pre><code>def coords_in_basis(B, v, tol=1e-14):\n    (a, b), (c, d) = B\n    det = a*d - b*c\n    if abs(det) &lt;= tol:\n        raise ValueError(\"basis rejected at this tolerance\")\n    return np.array([d*v[0]-b*v[1], -c*v[0]+a*v[1]]) / det\n</code></pre><p>Check standard, rotated, and skewed bases using reconstruction. On the specified path, \\(v=(0,1)\\) has coordinates \\((-\\cot\\theta,\\csc\\theta)\\), whose norm grows like \\(\\sqrt2/|\\theta|\\). In contrast, \\(v=(1,0)\\) has coordinates \\((1,0)\\) for every nonzero angle. Ill-conditioning permits sensitive directions; it does not force every target to have large coordinates.</p>"
},

B7: {
  statement: "**B7 · Stretch · NumPy — rebuild the span picture.** In matplotlib, draw \\(u=(1,2)\\), \\(v=(-1,1)\\), then scatter 2,000 combinations with coefficients uniform on \\([-2,2]\\). Overlay the four boundary corners \\(\\pm2u\\pm2v\\) in cyclic order. Save the figure, then repeat with \\(v=2u\\) and save that figure too. Label the shaded or sampled region as a bounded set of combinations, not the entire span. Explain what finite samples can illustrate and what they cannot prove.",
  plain: "Sample coefficients, map through V, scatter. With v = 2u the cloud collapses to a segment.",
  solution:
    "<pre><code>import numpy as np, matplotlib.pyplot as plt\n\n" +
    "def span_picture(u, v, ax, n=2000, seed=0):\n    rng = np.random.default_rng(seed)\n" +
    "    ab = rng.uniform(-2, 2, size=(n, 2))\n    V = np.column_stack([u, v])\n" +
    "    pts = ab @ V.T                                   # each row is a*u + b*v\n" +
    "    ax.scatter(pts[:, 0], pts[:, 1], s=3, alpha=.25)\n" +
    "    corners = np.array([[2,2], [2,-2], [-2,-2], [-2,2], [2,2]]) @ V.T\n" +
    "    ax.plot(corners[:, 0], corners[:, 1], lw=1)\n" +
    "    for w, name in ((u, \"u\"), (v, \"v\")):\n" +
    "        ax.annotate(name, xy=w, xytext=(0, 0),\n                    arrowprops=dict(arrowstyle=\"-&gt;\"))\n" +
    "    ax.set_aspect(\"equal\"); ax.axhline(0, lw=.5); ax.axvline(0, lw=.5)\n\n" +
    "u = np.array([2., .5])\nfig, axes = plt.subplots(1, 2, figsize=(11, 5))\n" +
    "span_picture(u, np.array([-.5, 2.]), axes[0]); axes[0].set_title(\"independent: fills a 2-D region\")\n" +
    "span_picture(u, 2*u,               axes[1]); axes[1].set_title(\"dependent: collapses to a segment\")\n" +
    "fig.savefig(\"span.png\", dpi=150)\n</code></pre>" +
    "<div class=\"sol-note\"><strong>What to notice in the second panel.</strong> You sampled 2000 points from a " +
    "2-parameter family and they landed in a 1-dimensional set. The map \\((a,b)\\mapsto a\\mathbf{u}+b\\mathbf{v}\\) has a " +
    "1-dimensional null space — every \\((a,b)\\) on the line \\(a+2b=0\\) maps to the origin — so information is destroyed. " +
    "Rank plus nullity equals two. You have just drawn the rank-nullity theorem, which Module 2 proves.</div>"
},

/* ============================== TRACK C ================================== */

C1: {
  statement: "**C1 · Foundation · PyTorch — embedding rows.** Generate a random matrix \\(E\\in\\mathbb R^{5000\\times64}\\). Before computing, state whether its rows must be dependent and the largest possible rank. Compute `torch.linalg.matrix_rank(E)`. Full rank here means rank 64; it cannot mean that all 5,000 rows are independent. Create a version whose last column duplicates its first, then compare the result with your prediction. If you later use actual embeddings, investigate any rank gap rather than assigning it a semantic interpretation automatically.",
  plain: "5000 rows in R^64 must be dependent. Maximum rank is 64. A seeded random float64 matrix will ordinarily have numerical rank 64; duplicating its first column as the last makes exact rank at most 63, usually numerically 63. Report tolerance and precision; a numerical rank shortfall is not automatically semantic evidence.",
  solution: "<pre><code>import torch\ntorch.manual_seed(0)\nE = torch.randn(5000, 64, dtype=torch.float64)\nprint(torch.linalg.matrix_rank(E).item())\nF = E.clone()\nF[:, -1] = F[:, 0]\nprint(torch.linalg.matrix_rank(F).item())\n</code></pre><p>The rows are dependent because 5000 exceeds 64. The expected numerical ranks for this fixture are 64 and 63; full rank never means all 5000 rows are independent. A tolerance-dependent rank estimate for trained embeddings requires investigation, not an automatic interpretation as a missing semantic direction.</p>"
},

C2: {
  statement: "**C2 · Core · PyTorch — what a factored update can express.** Construct \\(\\Delta W=BA\\) with \\(B\\in\\mathbb R^{256\\times8}\\) and \\(A\\in\\mathbb R^{8\\times256}\\). Prove that every output \\(\\Delta W x=B(Ax)\\) lies in \\(\\operatorname{span}(B)\\), hence rank is at most 8. Verify it numerically. Distinguish a **fixed** \\(B\\), which fixes the allowed output subspace, from trainable \\(B\\), which can move that subspace while keeping its dimension at most 8. Also explain why a low-rank update does not force \\(W+\\Delta W\\) itself to have low rank.",
  plain: "Every column of ΔW=BA lies in span(B), hence rank at most 8. Fixed B fixes the reachable output subspace; trainable B can move it. Low rank of ΔW does not imply low rank of W+ΔW. Check numerical rank with float64 and a stated tolerance.",
  solution: "<pre><code>torch.manual_seed(0)\nB = torch.randn(256, 8, dtype=torch.float64)\nA = torch.randn(8, 256, dtype=torch.float64)\nupdate = B @ A\nprint(torch.linalg.matrix_rank(update).item())\n</code></pre><p>For every input, \\(\\Delta Wx=B(Ax)\\) is a combination of B's eight columns, so its image has dimension at most eight. Training B can change which subspace is used while retaining that bound at each step. A full-rank base weight plus this update may remain full rank: for example, \\(I+e_1e_1^T\\) is invertible although the update has rank one.</p>"
},

C3: {
  statement: "**C3 · Core · PyTorch — measure overlap without assuming the conclusion.** Generate \\(m\\) random unit vectors in \\(\\mathbb R^{64}\\) for \\(m\\in\\{32,64,128,1024\\}\\). Compute the largest absolute off-diagonal inner product. A starting point is:\n\n~~~python\nimport torch\n\ntorch.manual_seed(0)\nfor m in (32, 64, 128, 1024):\n    F = torch.randn(m, 64, dtype=torch.float64)\n    F = F / torch.linalg.vector_norm(F, dim=1, keepdim=True)\n    overlaps = (F @ F.T).abs()\n    overlaps.fill_diagonal_(0)\n    print(m, overlaps.max().item())\n~~~\n\nRepeat across several seeds and plot the results. Independence is impossible for \\(m>64\\), but maximum overlap is a separate measurement. Next construct \\(x=\\sum_i a_i f_i\\) with only a few nonzero activations and measure dot-product readout errors. Increase the number of active features. Explain why a maximum pairwise overlap does not by itself determine the accumulated interference or prove a claim about a trained network.",
  plain: "For m>64 dependence is forced. Measure maximum absolute pairwise overlap across seeds without prescribing an empirical value. For sparse activations x=Σa_i f_i, readout j is a_j+Σ_{i≠j}a_i<f_j,f_i>. Overlap alone does not determine this sum: activity, signs, magnitudes, and the decoder matter.",
  solution: "<p>Run the supplied float64 experiment for several seeds, recording the largest absolute off-diagonal Gram entry at each m. Dependence follows from m>64; the measured overlap is a different quantity and need not rise monotonically between independent draws.</p><p>Generate activation vectors with several chosen support sizes, construct \\(x=\\sum_i a_i f_i\\), and compare \\(f_j^Tx\\) with \\(a_j\\). Their difference is \\(\\sum_{i\\ne j}a_i f_j^Tf_i\\). If the largest overlap is μ, its absolute value is at most \\(\\mu\\sum_{i\\ne j}|a_i|\\); cancellation can make it smaller. Report the activation distribution and errors. Synthetic overlap measurements alone establish neither model interpretability nor recoverability in a trained network.</p>"
},

C4: {
  statement: "**C4 · Stretch · PyTorch — low-rank initialization is not a rank constraint.** Compare two bias-free models learning the identity map in 64 dimensions. Model one is `nn.Linear(64, 64, bias=False, dtype=torch.float64)`, initialized with the rank-4 weight \\(P=\\operatorname{diag}(1,1,1,1,0,\\dots,0)\\). Model two always uses \\(W=BA\\), with shapes \\((64,4)\\) and \\((4,64)\\), initialized with the corresponding first four standard basis columns and rows. Use \\(X=8I_{64}\\), target \\(X\\), and mean squared error over all entries; batches are row vectors, so predictions are `X @ W.T`.\n\nThe identity fixture makes the comparison exact:\n\n$$\nL(W)=\\frac{\\|XW^T-X\\|_F^2}{64^2}\n=\\frac{\\|W-I\\|_F^2}{64},\n$$\n\nwhere \\(\\|M\\|_F^2\\) is the sum of squared entries of \\(M\\). Any rank-at-most-4 map misses at least 60 orthogonal input directions; completing an orthonormal basis of its null space gives \\(\\|W-I\\|_F^2\\ge60\\). The displayed projection attains this bound, so the best constrained loss is \\(60/64\\). This lower-bound argument previews orthogonality and rank–nullity from the next chapters.\n\nTrain both with gradient descent and report the losses and ranks. At the projection initialization the factors already achieve the constrained optimum. The unrestricted layer has gradient \\(2(W-I)/64\\), so a step with \\(0<\\eta<32\\) immediately creates nonzero weights in the other 60 diagonal positions: its exact rank becomes 64. It can approach zero loss. Explain why initial rank does not constrain later parameter updates, while storing the weight as a product keeps the rank bound for every step.",
  plain: "On X=8I, L(W)=||W-I||_F²/64. Any rank≤4 map has loss≥60/64; P=diag(I4,0) attains it, and the specified factors are stationary there. The unrestricted gradient is 2(W-I)/64, so W1=P+(η/32)(I-P), full rank for η>0; iterations converge to I for 0<η<64. Its optimum is zero. Initial rank is not a structural constraint.",
  solution: "<pre><code>import torch\nfrom torch import nn\ntorch.manual_seed(0)\ndtype = torch.float64\nI = torch.eye(64, dtype=dtype)\nX = 8 * I\nP = I.clone(); P[4:, 4:] = 0\nlayer = nn.Linear(64, 64, bias=False, dtype=dtype)\nwith torch.no_grad():\n    layer.weight.copy_(P)\nB = nn.Parameter(I[:, :4].clone())\nA = nn.Parameter(I[:4, :].clone())\nopt = torch.optim.SGD([layer.weight, B, A], lr=16)\nfor _ in range(40):\n    opt.zero_grad()\n    free_loss = ((layer(X) - X)**2).mean()\n    constrained_loss = ((X @ (B @ A).T - X)**2).mean()\n    (free_loss + constrained_loss).backward()\n    opt.step()\nprint(((layer(X)-X)**2).mean().item(),\n      ((X @ (B @ A).T-X)**2).mean().item())\nprint(torch.linalg.matrix_rank(layer.weight).item(),\n      torch.linalg.matrix_rank(B @ A).item())\n</code></pre><p>The unrestricted loss approaches zero and its rank becomes 64. The factors remain at their constrained optimum, loss 60/64 and rank 4: \\((BA-I)A^T=0\\) and \\(B^T(BA-I)=0\\) at this initialization. The lower bound follows from at least 60 orthonormal null directions, each contributing one to \\(\\|W-I\\|_F^2\\).</p><p>The unrestricted recurrence is \\(W_{t+1}-I=(1-\\eta/32)(W_t-I)\\). Thus positive learning rates below 64 converge, η=32 reaches I in one step, and η=0 leaves rank 4. This exact comparison concerns this map and loss, not all nonlinear networks.</p>"
},

C5: {
  statement: "**C5 · Stretch · PyTorch — translate a claim you read.** Find “column space” or “rank” in a paper you are reading, or use the factored update in C2. Write two sentences: identify the matrix's input and output spaces, then state the geometric restriction. Add one thing the rank claim does not establish, such as feature meaning, downstream accuracy, or ease of optimization.",
  plain: "Identify the actual input and output spaces, describe the image or kernel restriction, and separate the rank theorem from empirical claims. Using C2: ΔW maps R^256 to R^256 with image contained in span(B), dimension≤8. This alone says nothing about downstream accuracy or feature meaning.",
  solution: "<p>For C2: “The update maps 256-dimensional inputs into 256-dimensional outputs. Every output lies in the span of B's eight columns, so its image has dimension at most eight.” Add: “That bound alone predicts neither downstream accuracy nor which semantic features are affected.”</p><p>A paper example should specify its actual matrix shapes and distinguish an exact factorization bound from a measured numerical rank. Trainable factors can move the subspace; the dimension bound does not identify a fixed set of directions throughout training.</p>"
}

});


/* Cumulative problems, the checkpoint, and the exercises added after the first
   release. Statements are marked against these references; typed fields check fixed
   numerical results alongside the written arguments. */
GU.answers("01-span", {

M1: {
  statement: "**M1 · Foundation · mixed — Three recipes.** For \\(u=(1,2)\\), \\(v=(2,4)\\), find three coefficient pairs producing \\((3,6)\\). Describe all such pairs.",
  plain: "(3,0),(1,1),(-1,2); all pairs are (3-2t,t), t\\in\\mathbb R.",
  solution: "<p>\\((3,0),(1,1),(-1,2)\\); all pairs are \\((3-2t,t)\\), \\(t\\in\\mathbb R\\).</p>"
},

M2: {
  statement: "**M2 · Foundation · mixed — Two dimensions, two descriptions.** For \\(B=((1,0),(1,1))\\), find the coordinates of \\((3,2)\\). Reverse the basis order and find the new coordinates.",
  plain: "(1,2)^T, then (2,1)^T. The ordered basis and its coordinate list must change together.",
  solution: "<p>\\((1,2)^T\\), then \\((2,1)^T\\). The ordered basis and its coordinate list must change together.</p>",
  fields: [
    {
      "id": "c",
      "label": "coordinates in B",
      "type": "vec",
      "ans": [
        1,
        2
      ]
    },
    {
      "id": "reversed",
      "label": "coordinates after reversing B",
      "type": "vec",
      "ans": [
        2,
        1
      ]
    }
  ]
},

M3: {
  statement: "**M3 · Foundation · mixed — Subspace or affine set.** Classify \\(x+y+z=0\\) and \\(x+y+z=1\\) in \\(\\mathbb R^3\\). Give a basis for the first and a point-plus-subspace description for the second.",
  plain: "The first is a two-dimensional subspace with basis (1,-1,0),(1,0,-1). The second is the affine plane (1,0,0)+S, where S is that subspace. It does not contain zero.",
  solution: "<p>The first is a two-dimensional subspace with basis \\((1,-1,0),(1,0,-1)\\). The second is the affine plane \\((1,0,0)+S\\), where \\(S\\) is that subspace. It does not contain zero.</p>"
},

M4: {
  statement: "**M4 · Foundation · mixed — Independent but not orthogonal.** Give two such vectors, then verify independence and their nonzero dot product separately.",
  plain: "(1,0),(1,1): the second coordinate forces the second coefficient to vanish in a zero combination, then the first coefficient vanishes. Their dot product is 1.",
  solution: "<p>\\((1,0),(1,1)\\): the second coordinate forces the second coefficient to vanish in a zero combination, then the first coefficient vanishes. Their dot product is 1.</p>"
},

M5: {
  statement: "**M5 · Core · mixed — Complete the equivalence.** Prove that a list is independent if and only if every vector in its span has exactly one coefficient list. Explain why “in its span” matters.",
  plain: "Existence holds by the definition of span. Subtract two representations and use independence for uniqueness. Conversely, zero's all-zero recipe is unique, so there can be no nonzero relation. Independence alone does not guarantee reaching vectors outside the span.",
  solution: "<p>Existence holds by the definition of span. Subtract two representations and use independence for uniqueness. Conversely, zero's all-zero recipe is unique, so there can be no nonzero relation. Independence alone does not guarantee reaching vectors outside the span.</p>"
},

M6: {
  statement: "**M6 · Core · mixed — Find the hidden relation.** Let \\(u=(1,2,-1)\\), \\(v=(2,1,3)\\), \\(w=(4,5,1)\\). Find a nonzero relation, a basis of the span, and all coefficient lists expressing \\(w\\) with these three generators.",
  plain: "w=2u+v, so (2,1,-1) is a relation. The first two vectors are independent, hence form a basis of a plane. Every recipe for w is (2-2t,1-t,t). An equation for the plane is 7x-5y-3z=0.",
  solution: "<p>\\(w=2u+v\\), so \\((2,1,-1)\\) is a relation. The first two vectors are independent, hence form a basis of a plane. Every recipe for \\(w\\) is \\((2-2t,1-t,t)\\). An equation for the plane is \\(7x-5y-3z=0\\).</p>"
},

M7: {
  statement: "**M7 · Core · mixed — Same geometry in different coordinates.** Set \\(B=\\operatorname{diag}(2,1)\\), \\(x=(1,1)\\), and \\(y=(1,-1)\\). Compute the dot product of their standard coordinates, the raw dot product of their \\(B\\)-coordinates, and the dot product using the Gram matrix \\(B^TB\\). Explain the discrepancy.",
  plain: "The standard dot product is 0. The coordinate vectors are (1/2,1), (1/2,-1), whose raw dot product is -3/4. Weighting by B^TB=\\operatorname{diag}(4,1) recovers 0. Raw coordinate dot products would choose a different geometry.",
  solution: "<p>The standard dot product is 0. The coordinate vectors are \\((1/2,1)\\), \\((1/2,-1)\\), whose raw dot product is \\(-3/4\\). Weighting by \\(B^TB=\\operatorname{diag}(4,1)\\) recovers 0. Raw coordinate dot products would choose a different geometry.</p>",
  fields: [
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
      "ans": -0.75
    },
    {
      "id": "metric",
      "label": "metric-weighted dot product",
      "type": "num",
      "ans": 0
    }
  ]
},

M8: {
  statement: "**M8 · Core · mixed — A union claim.** Prove that \\(U\\cup W\\) is a subspace exactly when \\(U\\subseteq W\\) or \\(W\\subseteq U\\). Your proof must establish both directions.",
  plain: "Containment makes the union equal to the larger subspace. Otherwise choose u\\in U\\setminus W, w\\in W\\setminus U. If u+w\\in U, subtraction puts w\\in U; if u+w\\in W, subtraction puts u\\in W. Both contradict the choices, so the union fails closure under addition.",
  solution: "<p>Containment makes the union equal to the larger subspace. Otherwise choose \\(u\\in U\\setminus W\\), \\(w\\in W\\setminus U\\). If \\(u+w\\in U\\), subtraction puts \\(w\\in U\\); if \\(u+w\\in W\\), subtraction puts \\(u\\in W\\). Both contradict the choices, so the union fails closure under addition.</p>"
},

M9: {
  statement: "**M9 · Stretch · mixed — Dependency without a small returned singular value.** A full-row-rank \\(5\\times6\\) matrix has five positive returned singular values. Explain why its columns are still dependent and how B5 recovers a relation. State the shapes for both full and reduced SVD.",
  plain: "The full factors have shapes U:5\\times5, s:5, V_h:6\\times6. The last right vector is a null direction outside the five directions paired with returned singular values. The reduced factors have shapes 5\\times5, 5, and 5\\times6, and omit that direction.",
  solution: "<p>The full factors have shapes \\(U:5\\times5\\), \\(s:5\\), \\(V_h:6\\times6\\). The last right vector is a null direction outside the five directions paired with returned singular values. The reduced factors have shapes \\(5\\times5\\), \\(5\\), and \\(5\\times6\\), and omit that direction.</p>"
},

M10: {
  statement: "**M10 · Stretch · mixed — Diagnose a misleading numerical report.** Someone reports “the basis is safe: the reconstruction error is tiny and the Hadamard ratio is 1.” Use \\(B=\\operatorname{diag}(1,10^{-8})\\) to construct a counterexample based on input perturbation. Name the claim the residual does support.",
  plain: "Perturb v=(1,0) by (0,10^{-8}). Coordinates change from (1,0) to (1,1); both reconstructions can be exact. The residual supports accurate reconstruction of the supplied input, not insensitivity of the recovered coordinates to changes in that input.",
  solution: "<p>Perturb \\(v=(1,0)\\) by \\((0,10^{-8})\\). Coordinates change from \\((1,0)\\) to \\((1,1)\\); both reconstructions can be exact. The residual supports accurate reconstruction of the supplied input, not insensitivity of the recovered coordinates to changes in that input.</p>"
},

M11: {
  statement: "**M11 · Stretch · mixed — Keep the logits unchanged.** Row embeddings transform as \\(x'=xA\\), where \\(A\\in\\mathbb R^{d\\times d}\\) is invertible. Original logits are \\(xW\\), with \\(W\\in\\mathbb R^{d\\times k}\\). Derive the new downstream weights that preserve every logit. Does Euclidean cosine between embeddings have to remain unchanged?",
  plain: "Choose W'=A^{-1}W; then x'W'=xAA^{-1}W=xW. A general invertible A can shear or scale different directions unequally, so Euclidean cosine need not be preserved. For example, (1,1) and (1,-1) are orthogonal before, but not after, multiplying by \\operatorname{diag}(2,1).",
  solution: "<p>Choose \\(W'=A^{-1}W\\); then \\(x'W'=xAA^{-1}W=xW\\). A general invertible \\(A\\) can shear or scale different directions unequally, so Euclidean cosine need not be preserved. For example, \\((1,1)\\) and \\((1,-1)\\) are orthogonal before, but not after, multiplying by \\(\\operatorname{diag}(2,1)\\).</p>"
},

M12: {
  statement: "**M12 · Stretch · mixed — Audit a rank claim.** “Our layer starts at rank 4, so it can only learn four output directions.” State a parameterization under which this is true at every step and one under which it is false. Use C4 to give an exact loss comparison, then state why it does not establish a universal claim about nonlinear networks.",
  plain: "A stored factorization W=BA with inner dimension 4 preserves rank≤4 at every step; an unrestricted weight initialized at rank 4 need not. On C4's fixture the constrained optimum is 60/64 and the unrestricted optimum is 0. This is a claim about a specified linear map and loss, not an entire nonlinear network.",
  solution: "<p>A stored factorization \\(W=BA\\) with inner dimension 4 preserves rank at most 4; an unrestricted weight merely initialized at rank 4 need not. On C4's fixture the constrained optimum is \\(60/64\\) and the unrestricted optimum is 0. This is a statement about a single linear map and a specified loss, not the representational power of an entire nonlinear network.</p>"
},

K1: {
  statement: "**K1 · Checkpoint · gate — Define and explain.** State linear independence from memory. Explain why the zero-combination definition is useful and prove its equivalence to “no vector is in the span of the others.”",
  plain: "The zero-combination form is symmetric in all k vectors, needs no distinguished index, and is a homogeneous linear system with a decidable answer.",
  solution: "<p>Independent means the only solution of \\(c_1v_1+\\dots+c_kv_k=0\\) is the all-zero list.</p><p>Equivalence, both directions. If some \\(c_j\\ne0\\) in a relation, divide by that coefficient — the step that needs \\(c_j\\ne0\\) named first — and \\(v_j\\) is a combination of the others. Conversely, if \\(v_j=\\sum_{i\\ne j}a_iv_i\\), then \\(\\sum a_iv_i-v_j=0\\) is a relation with coefficient \\(-1\\) on \\(v_j\\), so not all coefficients vanish.</p><p>The zero form is preferred because it is symmetric in all \\(k\\) vectors, requires no choice of a distinguished index, and is a linear system you can actually solve.</p>"
},

K2: {
  statement: "**K2 · Checkpoint · gate — Find the redundancy.** For \\(u=(1,2,-1)\\), \\(v=(2,1,3)\\), \\(w=(4,5,1)\\), decide independence. Give an explicit dependency relation if one exists, and describe the span geometrically with a basis.",
  plain: "w = 2u + v, so (2,1,-1) is a relation; the span is the plane through the origin spanned by u and v.",
  solution: "<p>\\(2u+v=(2,4,-2)+(2,1,3)=(4,5,1)=w\\), so \\((2,1,-1)\\) is a nonzero dependency relation and the three are dependent.</p><p>\\(u\\) and \\(v\\) are independent — neither is a multiple of the other — so they are a basis of the span, which is therefore a two-dimensional plane through the origin, not all of \\(\\mathbb R^3\\).</p>"
},

K3: {
  statement: "**K3 · Checkpoint · gate — Repair a false claim.** Prove or disprove: the union of two subspaces of \\(\\mathbb R^n\\) is a subspace. If false, state and prove the exact condition under which it is true.",
  plain: "False in general; the union is a subspace exactly when one contains the other.",
  solution: "<p>False. Take \\(U=\\operatorname{span}\\{e_1\\}\\), \\(W=\\operatorname{span}\\{e_2\\}\\): both \\(e_1,e_2\\in U\\cup W\\) but \\(e_1+e_2\\) lies in neither, so closure under addition fails.</p><p>The exact condition is containment. If \\(U\\subseteq W\\) the union is \\(W\\), a subspace. Conversely, if neither contains the other, pick \\(u\\in U\\setminus W\\) and \\(w\\in W\\setminus U\\); if \\(u+w\\in U\\) then \\(w=(u+w)-u\\in U\\), and if \\(u+w\\in W\\) then \\(u\\in W\\) — both contradictions.</p>"
},

K4: {
  statement: "**K4 · Checkpoint · gate — Reduce a generating list.** Five vectors span a three-dimensional subspace of \\(\\mathbb R^7\\). How many can you discard while preserving the span? What is the largest independent sublist you can select? Justify the counts, and explain why you cannot necessarily discard any arbitrary pair.",
  plain: "Discard two; exactly three of the five are independent, and which two you may discard is not arbitrary.",
  solution: "<p>The subspace has dimension 3, so by Theorem 4 every spanning set has at least 3 elements and every independent set at most 3. A spanning set of five can be thinned to a basis of three by deleting redundant vectors one at a time (Theorem 1(3)), so you can discard two.</p><p>Exactly three are independent. But the pair you discard is not arbitrary: if two of the five are equal, you may drop either one of them, yet dropping two vectors that happen to carry a direction nothing else covers would shrink the span.</p>",
  fields: [
    {
      "id": "discard",
      "label": "number that can be discarded",
      "type": "num",
      "ans": 2
    },
    {
      "id": "independent",
      "label": "largest independent sublist",
      "type": "num",
      "ans": 3
    }
  ]
},

K5: {
  statement: "**K5 · Checkpoint · gate — Explain collapse precisely.** Hold \\(b_1=(1,0)\\) fixed and let \\(b_2=(1,\\varepsilon)\\), with \\(\\varepsilon\\ne0\\) tending to zero. Find the coordinates of a fixed point \\((x,y)\\). Separate \\(y\\ne0\\) from \\(y=0\\), then state what happens to existence and uniqueness at \\(\\varepsilon=0\\). The theorem remains true; its basis hypothesis stops holding.",
  plain: "For y != 0 the coordinates blow up like y/eps; for y = 0 they stay bounded. At eps = 0 existence fails off the line and uniqueness fails on it.",
  solution: "<p>With \\(b_1=(1,0)\\), \\(b_2=(1,\\varepsilon)\\) and \\(p=(x,y)\\), solving \\(c_1b_1+c_2b_2=p\\) gives \\(c_2=y/\\varepsilon\\) and \\(c_1=x-y/\\varepsilon\\).</p><p>For \\(y\\ne0\\) both coordinates diverge as \\(\\varepsilon\\to0\\); for \\(y=0\\) they are \\((x,0)\\) for every \\(\\varepsilon\\). At \\(\\varepsilon=0\\) the two vectors are dependent: a point off the line has <em>no</em> representation and a point on it has infinitely many. Theorem 3 is not violated — its hypothesis, that \\(B\\) is a basis, has stopped holding.</p>"
},

K6: {
  statement: "**K6 · Checkpoint · gate — Separate theorem from model evidence.** A transformer has residual width 1024, and someone proposes 50,000 distinct interpretable feature directions in that stream. State what dependence is forced by the dimensions and what still needs evidence about the model, its activations, and its readout. Do not turn a dimension bound into a claim about observed semantics or accuracy.",
  plain: "50,000 feature directions in R^1024 are dependent and cannot all be nonzero mutually orthogonal vectors. A linear decoder cannot recover every arbitrary 50,000-dimensional activation list. Dependence alone does not quantify errors on a restricted sparse activation distribution or establish that those directions exist, are interpretable, or are used by the trained model.",
  solution: "<p>The dimension bound forces a nonzero relation among the 50,000 directions and rules out their being mutually orthogonal nonzero vectors. If they are columns of F, then F cannot be injective on all activation lists: \\(Fa=F(a+c)\\) whenever Fc=0.</p><p>This does not measure errors for the activations a model actually uses. A restricted sparse family and a nonlinear decoder require separate analysis. Existence of these features, their semantic interpretation, activity patterns, readout errors, and usefulness are empirical claims requiring evidence.</p>"
},

A14: {
  statement: "**A14 · Stretch · paper — unions and sums.** Prove that a union of two subspaces of \\(\\mathbb R^n\\) is a subspace exactly when one contains the other. Then show the *sum* \\(S+T=\\{s+t\\}\\) always is, and that it equals \\(\\operatorname{span}(S\\cup T)\\).",
  plain: "Union: containment is necessary and sufficient. Sum: closed by construction, and it is the smallest subspace containing both.",
  solution: "<p>The union claim is checkpoint 3. For the sum, \\(0=0+0\\in S+T\\); \\((s_1+t_1)+(s_2+t_2)=(s_1+s_2)+(t_1+t_2)\\); and \\(c(s+t)=cs+ct\\), so the three-part test passes.</p><p>\\(S+T\\) contains both \\(S\\) (take \\(t=0\\)) and \\(T\\), so it contains \\(S\\cup T\\) and therefore \\(\\operatorname{span}(S\\cup T)\\). Conversely every \\(s+t\\) is a combination of one element of each, so \\(S+T\\subseteq\\operatorname{span}(S\\cup T)\\). The two sets are equal.</p>"
},

A15: {
  statement: "**A15 · Stretch · paper — dimension counting.** For subspaces \\(S,T\\subseteq\\mathbb R^5\\) with \\(\\dim S=\\dim T=3\\), give every possible value of \\(\\dim(S\\cap T)\\) and justify both extremes. State which theorem forces the lower bound.",
  plain: "1, 2 or 3. The lower bound is dim S + dim T - 5; the maximum is S = T.",
  solution: "<p>The dimension formula \\(\\dim(S+T)=\\dim S+\\dim T-\\dim(S\\cap T)\\) together with \\(\\dim(S+T)\\le5\\) forces \\(\\dim(S\\cap T)\\ge3+3-5=1\\).</p><p>All of 1, 2, 3 occur: take \\(S=\\operatorname{span}\\{e_1,e_2,e_3\\}\\) with \\(T=\\operatorname{span}\\{e_3,e_4,e_5\\}\\) (intersection dimension 1), \\(T=\\operatorname{span}\\{e_2,e_3,e_4\\}\\) (2), and \\(T=S\\) (3). Two three-dimensional subspaces of \\(\\mathbb R^5\\) can never meet only at the origin.</p>"
},

A16: {
  statement: "**A16 · Stretch · paper — one property, not two.** Prove that \\(n\\) vectors in \\(\\mathbb R^n\\) are a basis as soon as they are independent, without separately checking that they span. Identify the dimension bound and exchange argument established in sections 6 and 8, and say where they enter the proof.",
  plain: "If n independent vectors failed to span R^n, adjoining a vector outside their span would give n+1 independent vectors, contradicting the dimension bound. The basis-size theorem is proved by the exchange argument in section 8; it is not deferred to the next module.",
  solution: "<p>If the n vectors did not span, choose w outside their span. The extension lemma makes the enlarged list independent, contradicting the bound of n independent vectors in ℝⁿ. Therefore the original list is a basis. Section 8's exchange argument proves that all bases have the same size, and the standard basis establishes \\(\\dim\\mathbb R^n=n\\); no new result needs to be taken on trust until Module 2.</p>"
},

B8: {
  statement: "**B8 · Stretch · NumPy — geometry under a coordinate change.** Use \\(B=\\begin{pmatrix}1&1\\\\0&1\\end{pmatrix}\\). For several vectors \\(x,y\\), solve for their coordinate lists \\(c,d\\). Compare \\(x^Ty\\), \\(c^Td\\), and \\(c^T(B^TB)d\\). Include \\(x=(1,0),y=(0,1)\\). Explain which calculation preserves the original geometry and why an invertible coordinate change preserves independence even when the raw coordinate cosine changes. Gram–Schmidt and its numerical variants belong to Module 4.",
  plain: "B=[[1,1],[0,1]], G=B^T B=[[1,1],[1,2]]. For x=e1 and y=e2, c=(1,0) and d=(-1,1). The standard and metric-weighted dot products are 0, but the raw coordinate dot product is -1. Invertibility preserves linear relations; retaining the original metric requires G.",
  solution: "<pre><code>B = np.array([[1., 1.], [0., 1.]])\nG = B.T @ B\nfor x, y in [(np.array([1., 0.]), np.array([0., 1.])),\n             (np.array([3., 2.]), np.array([-1., 4.]))]:\n    c, d = np.linalg.solve(B, x), np.linalg.solve(B, y)\n    print(x @ y, c @ d, c @ G @ d)\n    assert np.allclose(x @ y, c @ G @ d)\n</code></pre><p>For the standard basis pair the outputs are 0, −1, 0. Since \\(x=Bc\\) and \\(y=Bd\\), \\(x^Ty=c^TB^TBd\\). A raw dot product of coordinates chooses a different geometry. An invertible coordinate change preserves every linear relation in both directions, hence independence, regardless of that geometric choice.</p>"
},

B9: {
  statement: "**B9 · Stretch · NumPy — two degeneracy measures.** Implement `hadamard_ratio(B)` and compare it with `np.linalg.cond(B)` on two paths: \\(B_\\theta\\) with columns \\((1,0)\\) and \\((\\cos\\theta,\\sin\\theta)\\) for \\(\\theta=10^{-k}\\), and \\(D_t=\\operatorname{diag}(1,t)\\) for \\(t=10^{-k}\\), with \\(k=0,1,\\dots,8\\) in both. Plot both measures against \\(k\\) on a log scale and report their values at \\(\\theta=10^{-4}\\) and at \\(t=10^{-4}\\). State which you would put in a bug report, which you would put in a loss curve, and why they are not interchangeable.",
  plain: "On the angle path h = sin(theta) and cond = cot(theta/2): at theta=1e-4, h ≈ 1e-4 and cond ≈ 2e4. On diag(1,t), h = 1 for every t while cond = 1/t = 1e4 at t=1e-4. h measures angular collapse only; cond also sees unequal scales, so use cond for sensitivity (bug reports) and h only as a labelled angular-collapse monitor.",
  solution: "<pre><code>def hadamard_ratio(B):\n    return abs(np.linalg.det(B)) / np.prod(np.linalg.norm(B, axis=0))\nfor k in range(9):\n    th = t = 10.0**-k\n    Bth = np.array([[1, np.cos(th)], [0, np.sin(th)]])\n    Dt = np.diag([1, t])\n    print(k, hadamard_ratio(Bth), np.linalg.cond(Bth), hadamard_ratio(Dt), np.linalg.cond(Dt))\n</code></pre><p>For \\(B_\\theta\\) the columns are unit vectors with inner product \\(\\rho=\\cos\\theta\\), so \\(h=\\sin\\theta\\) and \\(\\kappa_2=\\sqrt{(1+\\rho)/(1-\\rho)}=\\cot(\\theta/2)\\approx2/\\theta\\). At \\(\\theta=10^{-4}\\): \\(h\\approx1.0\\times10^{-4}\\), \\(\\kappa_2\\approx2.0\\times10^{4}\\). The two measures move together on this path only because the columns are normalized.</p><p>For \\(D_t\\) the columns stay orthogonal, so \\(h=1\\) at every \\(t\\), while \\(\\kappa_2=1/t=10^4\\) at \\(t=10^{-4}\\). The ratio is blind to unequal scaling. Put \\(\\kappa\\) in a bug report about sensitivity; \\(h\\) is suitable for a curve that monitors angular collapse, labelled as that narrower quantity.</p>"
},

C6: {
  statement: "**C6 · Core · PyTorch — probes and null spaces.** With `torch.manual_seed(0)` and `float64`, draw activations \\(H\\in\\mathbb R^{200\\times8}\\) from a standard normal and labels \\(y_i=\\mathbb 1[h_{i1}+h_{i2}>0]\\). Train a bias-free logistic-regression probe \\(w\\in\\mathbb R^8\\) by full-batch gradient descent from \\(w=0\\) (learning rate 0.5, 500 steps). Describe the null space of \\(w\\) in words and give its dimension. Form \\(z=e_3-w(w^Te_3)/(w^Tw)\\), edit every activation to \\(h_i'=h_i+5z\\), and report \\(w^Tz\\), \\(\\|5z\\|\\), \\(\\max_i|w^Th_i'-w^Th_i|\\), and the probe accuracy before and after. Then say what \"the probe's accuracy did not move\" does and does not imply.",
  plain: "The null space {z: w^T z = 0} is the 7-dimensional set of activation changes the probe cannot see. z = e3 minus its component along w satisfies w^T z = 0 up to rounding (about 1e-16), and since the trained w points mostly along (1,1,0,...,0), ||5z|| is close to 5. Every score changes by at most rounding (about 1e-15), so accuracy is identical before and after even though each activation moved by about 5. Unchanged accuracy is weaker still than unchanged scores: it does not show the representation, or even its component along w, was unchanged.",
  solution: "<pre><code>torch.manual_seed(0)\nH = torch.randn(200, 8, dtype=torch.float64)\ny = (H[:, 0] + H[:, 1] > 0).double()\nw = torch.zeros(8, dtype=torch.float64)\nfor _ in range(500):\n    p = torch.sigmoid(H @ w)\n    w -= 0.5 * H.T @ (p - y) / len(y)\ne3 = torch.zeros(8, dtype=torch.float64); e3[2] = 1\nz = e3 - w * (w @ e3) / (w @ w)\nH2 = H + 5 * z\nacc = lambda X: (((X @ w) > 0).double() == y).double().mean().item()\nprint(w @ z, (5 * z).norm(), ((H2 - H) @ w).abs().max(), acc(H), acc(H2))\n</code></pre><p>The probe score is \\(w^Th\\), so the directions it cannot see are \\(\\{z:w^Tz=0\\}\\), a hyperplane of dimension \\(8-1=7\\) (all of \\(\\mathbb R^8\\) only if \\(w=0\\)). By construction \\(w^Tz=w_3-w_3=0\\); numerically it is of order \\(10^{-16}\\). Because the labels depend only on \\(h_1+h_2\\), the trained \\(w\\) is concentrated on its first two entries, \\(w_3\\) is small, and \\(\\|5z\\|=5\\sqrt{1-w_3^2/\\|w\\|^2}\\) is close to 5.</p><p>Every score changes by \\(5w^Tz\\), so the maximum change is rounding level (about \\(10^{-15}\\)) and the accuracy is exactly the same before and after, although every activation moved by about 5. \"Accuracy did not move\" therefore cannot rule out edits in this 7-dimensional null space; it is weaker even than unchanged scores, since positive rescaling of scores or offsetting prediction flips can also leave accuracy fixed.</p>"
},

C7: {
  statement: "**C7 · Core · PyTorch — what survives a change of coordinates.** Stack the activation vectors \\(v_1=(1,1,0,0)\\), \\(v_2=(1,-1,0,0)\\), \\(v_3=(0,0,1,1)\\), \\(v_4=v_1+v_3\\) as rows of a `float64` tensor and map each through the invertible \\(A=\\operatorname{diag}(2,1,1,3)\\). Before and after the map, report `torch.linalg.matrix_rank` of the stack, whether the relation \\(v_1+v_3-v_4=0\\) still holds for the images, whether the images of \\(v_1,v_2,v_3\\) are independent, \\(\\|v_1\\|\\), and the cosines of the pairs \\((v_1,v_2)\\) and \\((v_1,v_4)\\). Classify span, independence, dimension, rank, norm and cosine similarity as surviving or not, and relate the split to the inner-product section: the survivors are the properties that never needed a geometry.",
  plain: "Rank 3 before and after; the relation v1+v3-v4=0 holds for the images; the images of v1,v2,v3 stay independent. ||v1|| changes from sqrt(2) to sqrt(5); cos(v1,v2) changes from 0 to 3/5; cos(v1,v4) changes from 1/sqrt(2) ≈ 0.707 to 1/sqrt(3) ≈ 0.577. Span, independence, dimension and rank survive; norm and cosine do not.",
  solution: "<pre><code>V = torch.tensor([[1,1,0,0],[1,-1,0,0],[0,0,1,1],[1,1,1,1]], dtype=torch.float64)\nA = torch.diag(torch.tensor([2.,1.,1.,3.], dtype=torch.float64))\nW = V @ A.T\ncos = lambda a, b: (a @ b / (a.norm() * b.norm())).item()\nprint(torch.linalg.matrix_rank(V), torch.linalg.matrix_rank(W))\nprint(W[0] + W[2] - W[3])\nprint(V[0].norm(), W[0].norm(), cos(V[0], V[1]), cos(W[0], W[1]), cos(V[0], V[3]), cos(W[0], W[3]))\n</code></pre><p>The images are \\((2,1,0,0)\\), \\((2,-1,0,0)\\), \\((0,0,1,3)\\), \\((2,1,1,3)\\). Rank is 3 before and after, and \\(Av_1+Av_3-Av_4=A(v_1+v_3-v_4)=0\\). In general \\(\\sum c_i(Av_i)=A\\sum c_iv_i\\) is zero only when \\(\\sum c_iv_i=0\\), so relations are preserved in both directions: independence, span dimension and rank survive, and spans map onto spans.</p><p>Geometry does not: \\(\\|v_1\\|=\\sqrt2\\) becomes \\(\\sqrt5\\); the orthogonal pair \\(v_1,v_2\\) acquires cosine \\(3/5\\); and \\(\\cos(v_1,v_4)\\) moves from \\(1/\\sqrt2\\approx0.707\\) to \\(5/\\sqrt{75}=1/\\sqrt3\\approx0.577\\). The survivors are exactly the properties defined without an inner product.</p>"
},
M13: {
  "statement": "**M13 · Stretch · mixed — Scale-aware rank reporting.** For diag(1,10⁻⁸), report exact rank and numerical rank using the rule “count gains strictly larger than 10⁻⁶”. Repeat after multiplying the matrix by 10⁸. Explain which claim is invariant.",
  "plain": "Exact rank is two in both cases. The fixed threshold gives one before rescaling and two afterward. A relative threshold 10⁻⁶ times the largest gain gives one in both cases. Numerical rank is a tolerance-dependent usability judgment.",
  "solution": "<p>Exact rank is two in both cases. The fixed threshold gives one before rescaling and two afterward. A relative threshold 10⁻⁶ times the largest gain gives one in both cases. Numerical rank is a tolerance-dependent usability judgment.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Exact rank; numerical rank before scaling; numerical rank after scaling",
      "type": "vec",
      "ans": [
        2,
        1,
        2
      ]
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
