/* Answers, checks and reference solutions for Linear Algebra Module 1. */
GU.answers("01-span", {

/* ============================== TRACK A ================================== */

A1: {
  statement: "u=(2,-1), v=(1,3). Compute 3u-2v, and find scalars a,b with a·u+b·v=(7,4).",
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
  statement: "Describe span{(1,2,3)}, span{(1,0,0),(0,1,0)}, span{(1,1,0),(2,2,0),(0,0,1)} in R^3: shape and dimension.",
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
  statement: "Is (4,5) in span{(1,2),(2,4)}? Is (3,6)? Explain geometrically and algebraically.",
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
  statement: "Decide independence and give a dependency relation where one exists: (a) (1,2),(3,7); (b) (1,2),(2,4); (c) (1,0,1),(0,1,1),(1,1,2); (d) (1,0,0),(0,1,0),(0,0,1),(1,1,1); (e) (0,0),(1,3).",
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
  statement: "For which t are (1,t) and (t,4) linearly dependent? Interpret both answers as pictures.",
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
  statement: "Which are subspaces of R^3? (a) x+y+z=0; (b) x+y+z=1; (c) x=y=z; (d) xyz=0; (e) x is an integer.",
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
  statement: "Prove Theorem 1: for v1..vk, (1) linearly dependent, (2) some vj lies in the span of the others, and (3) removing some vj does not change the span, are equivalent. Prove the cycle (1)=>(2)=>(3)=>(1).",
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
    "cycle is the economical route, but you must actually close it.</div>"
},

A8: {
  proof: true,
  statement: "Prove that span{v1..vk} is a subspace of V, using the three-part test. Then prove it is the smallest: if W is any subspace containing all the vi, then span{vi} is contained in W.",
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
    "and a gesture.</div>"
},

A9: {
  proof: true,
  statement: "Prove Theorem 3 in both directions: B = {b1..bn} is a basis of V if and only if every v in V has exactly one representation v = sum c_i b_i.",
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
    "converse never mentions \\(\\mathbf{0}\\), you have proved spanning and stopped.</div>"
},

A10: {
  proof: true,
  statement: "Prove that if {v1..vk} is independent and w is not in span{v1..vk}, then {v1..vk,w} is independent.",
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
    "span, so you have a basis. That is the proof that every independent set extends to a basis.</div>"
},

A11: {
  statement: "In P2 (real polynomials of degree at most 2): show {1,x,x^2} is a basis; show {1, 1+x, 1+x+x^2} is a basis; find the coordinates of 3+2x-x^2 in the second basis.",
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
  statement: "Is {sin x, cos x, sin(x + pi/4)} linearly independent as functions R -> R? Give a dependency relation or prove there is none.",
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
  statement: "Give three vectors in R^3 that are pairwise independent but dependent as a set of three. Why does this show independence is not a pairwise property?",
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
    "must exist once \\(m &gt; d\\). C3 makes you measure the gap.</div>"
},

/* ============================== TRACK B ================================== */

B1: {
  statement: "Implement linear combination from the definition with loops, then vectorised, and assert they agree.",
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
  statement: "Write is_dependent_2d(u, v, tol) via the determinant; test on exactly dependent, nearly dependent and clearly independent pairs; find a pair whose verdict depends on tol.",
  plain: "det = u0*v1 - u1*v0; compare |det| against a tolerance scaled by the vector magnitudes.",
  solution:
    "<pre><code>def is_dependent_2d(u, v, tol=1e-9):\n    det = u[0]*v[1] - u[1]*v[0]\n" +
    "    scale = np.linalg.norm(u) * np.linalg.norm(v)      # make tol dimensionless\n" +
    "    return abs(det) &lt;= tol * max(scale, 1e-300)\n</code></pre>" +
    "<p>A pair whose verdict is tolerance-dependent, by construction:</p>" +
    "<pre><code>eps = 1e-8\nu = np.array([1.0, 0.0])\nv = np.array([np.cos(eps), np.sin(eps)])   # eps radians apart\n" +
    "is_dependent_2d(u, v, tol=1e-6)   # True\nis_dependent_2d(u, v, tol=1e-12)  # False\n</code></pre>" +
    "<div class=\"sol-note\"><strong>What this is really teaching.</strong> Rank is a discontinuous function of the entries: " +
    "an arbitrarily small perturbation takes a rank-1 matrix to rank 2. So <em>numerical rank is not a property of the " +
    "matrix</em> — it is a property of the matrix together with a tolerance, and <code>np.linalg.matrix_rank</code> quietly " +
    "picks one for you (largest singular value times max(shape) times machine epsilon). The honest question is never " +
    "\"is this dependent?\" but \"how far is it from dependent?\", and the answer is the smallest singular value. That is " +
    "Module 6. Also: the unscaled test <code>abs(det) &lt; tol</code> calls \\((10^{-6},0),(0,10^{-6})\\) dependent, which it " +
    "plainly is not — hence the normalisation.</div>"
},

B3: {
  statement: "Implement the Gram determinant test: G = V^T V, det G = 0 exactly when the columns are dependent. Explain why sqrt(det G) is the volume of the parallelepiped spanned.",
  plain: "det(V^T V) = 0 iff columns dependent; sqrt of it is the k-volume.",
  solution:
    "<pre><code>def gram_det(V):\n    G = V.T @ V\n    return np.linalg.det(G)\n\n" +
    "rng = np.random.default_rng(0)\nfor _ in range(500):                       # random -> independent with probability 1\n" +
    "    V = rng.normal(size=(3, 3))\n    assert gram_det(V) &gt; 1e-12\n\n" +
    "for _ in range(500):                       # force a dependency\n    V = rng.normal(size=(3, 3))\n" +
    "    V[:, 2] = V[:, 0] - 2*V[:, 1]\n    assert abs(gram_det(V)) &lt; 1e-9\n</code></pre>" +
    "<p><strong>Why the square root is a volume.</strong> If \\(\\mathbf{c}\\ne\\mathbf{0}\\) satisfies \\(V\\mathbf{c}=\\mathbf{0}\\) " +
    "then \\(G\\mathbf{c}=V^\\top V\\mathbf{c}=\\mathbf{0}\\), so \\(G\\) is singular. Conversely if \\(G\\mathbf{c}=\\mathbf{0}\\) " +
    "then \\(\\mathbf{c}^\\top G\\mathbf{c}=\\|V\\mathbf{c}\\|^2=0\\), forcing \\(V\\mathbf{c}=\\mathbf{0}\\). So " +
    "\\(\\det G = 0\\) exactly when the columns are dependent — and this works for a tall \\(V\\), where \\(\\det V\\) is not " +
    "even defined.</p>" +
    "<p>For the volume: in the square case \\(\\det G = \\det(V^\\top V) = (\\det V)^2\\), so \\(\\sqrt{\\det G}=|\\det V|\\), " +
    "the familiar signed volume with the sign discarded. In general, if \\(V=QR\\) with \\(Q\\) having orthonormal columns, " +
    "then \\(G=R^\\top R\\) and \\(\\sqrt{\\det G}=|\\det R|=\\prod_i |r_{ii}|\\) — each \\(|r_{ii}|\\) being the height of the " +
    "\\(i\\)-th vector above the span of its predecessors. Base times height, \\(k\\) times over. Modules 3 and 4.</p>"
},

B4: {
  statement: "Write in_span(V, w) using least squares and a residual tolerance; test in-span, orthogonal, and nearly-in-span cases.",
  plain: "Solve min_c ||Vc - w|| with lstsq and compare the residual norm against tol * ||w||.",
  solution:
    "<pre><code>def in_span(V, w, tol=1e-8):\n    c, *_ = np.linalg.lstsq(V, w, rcond=None)\n" +
    "    resid = np.linalg.norm(V @ c - w)\n    return resid &lt;= tol * max(np.linalg.norm(w), 1.0), c\n\n" +
    "V = np.array([[1., 0.], [0., 1.], [0., 0.]])      # the xy-plane in R^3\n" +
    "assert in_span(V, np.array([3., 4., 0.]))[0]      # inside\n" +
    "assert not in_span(V, np.array([0., 0., 1.]))[0]  # orthogonal to it\n" +
    "assert not in_span(V, np.array([3., 4., 1e-3]))[0]  # nearly inside\n</code></pre>" +
    "<p>An independent cross-check that does not use residuals at all, via rank:</p>" +
    "<pre><code>def in_span_rank(V, w):\n" +
    "    return np.linalg.matrix_rank(V) == np.linalg.matrix_rank(np.column_stack([V, w]))\n</code></pre>" +
    "<div class=\"sol-note\"><strong>What lstsq is really doing.</strong> It returns the \\(\\mathbf{c}\\) minimising " +
    "\\(\\|V\\mathbf{c}-\\mathbf{w}\\|\\), so \\(V\\mathbf{c}\\) is the <em>orthogonal projection</em> of \\(\\mathbf{w}\\) onto " +
    "the column space, and the residual is the distance from \\(\\mathbf{w}\\) to that subspace. You have just built " +
    "projection before meeting it — Module 3 supplies the geometry, and the normal equations " +
    "\\(V^\\top V\\mathbf{c}=V^\\top\\mathbf{w}\\) connect it back to B3's Gram matrix.</div>"
},

B5: {
  statement: "Verify Theorem 2 numerically for n=5, k=6: find an explicit nonzero c with Vc approximately 0, and report ||Vc|| and ||c||.",
  plain: "The right singular vector for the smallest singular value; with k > n that value is 0 up to rounding.",
  solution:
    "<pre><code>rng = np.random.default_rng(0)\nn, k = 5, 6\nV = rng.normal(size=(n, k))\n\n" +
    "U, s, Vt = np.linalg.svd(V)          # Vt rows are the right singular vectors\n" +
    "c = Vt[-1]                           # the one with the smallest singular value\n\n" +
    "print(np.linalg.norm(V @ c))         # ~1e-16  : the relation\n" +
    "print(np.linalg.norm(c))             # exactly 1: nonzero, as required\n" +
    "print(s)                             # 5 positive values; there is no 6th\n</code></pre>" +
    "<p>Turn it into a property test rather than one lucky seed:</p>" +
    "<pre><code>for seed in range(200):\n    rng = np.random.default_rng(seed)\n" +
    "    n = rng.integers(2, 9); k = n + rng.integers(1, 4)\n    V = rng.normal(size=(n, k))\n" +
    "    c = np.linalg.svd(V)[2][-1]\n    assert np.isclose(np.linalg.norm(c), 1.0)\n" +
    "    assert np.linalg.norm(V @ c) &lt; 1e-9 * np.linalg.norm(V)\n</code></pre>" +
    "<div class=\"sol-note\"><strong>Read what you just did.</strong> \\(V\\) has \\(6\\) columns but only \\(5\\) singular " +
    "values, so its null space has dimension at least \\(k-n=1\\) — and <code>Vt[-1]</code> is a unit vector in it. Theorem 2 " +
    "said a relation exists; the SVD <em>hands you one</em>, and the smallest singular value measures how close to " +
    "dependent a matrix is even when it is not. Note the test asserts <code>||c|| = 1</code>: without it, \\(c=\\mathbf{0}\\) " +
    "would pass and prove nothing.</div>"
},

B6: {
  statement: "Implement coords_in_basis for a 2x2 basis matrix using the explicit inverse, then plot ||[v]_B|| against the angle between b1 and b2 as b2 approaches b1.",
  plain: "c = (1/det) * [[d, -b], [-c, a]] @ v; the norm blows up like 1/sin(theta).",
  solution:
    "<pre><code>def coords_in_basis(B, v):\n    (a, b), (c, d) = B[0], B[1]        # B = [[a, b], [c, d]], columns are b1, b2\n" +
    "    det = a*d - b*c\n    if abs(det) &lt; 1e-14:\n        raise ValueError(\"not a basis\")\n" +
    "    return np.array([ d*v[0] - b*v[1], -c*v[0] + a*v[1] ]) / det\n\n" +
    "# agree with the library, on random inputs, not on one example\n" +
    "rng = np.random.default_rng(0)\nfor _ in range(500):\n    B = rng.normal(size=(2, 2))\n" +
    "    if abs(np.linalg.det(B)) &lt; 1e-6: continue\n    v = rng.normal(size=2)\n" +
    "    assert np.allclose(coords_in_basis(B, v), np.linalg.solve(B, v))\n\n" +
    "thetas = np.logspace(-4, np.log10(np.pi/2), 200)\n" +
    "norms = [np.linalg.norm(coords_in_basis(\n    np.array([[1., np.cos(t)], [0., np.sin(t)]]), np.array([1., 1.])))\n" +
    "    for t in thetas]\nplt.loglog(thetas, norms); plt.xlabel(\"angle between b1 and b2\")\n</code></pre>" +
    "<p>The plot is a straight line of slope \\(-1\\) on log-log axes: \\(\\|[\\mathbf{v}]_B\\| \\sim 1/\\theta\\) as " +
    "\\(\\theta\\to 0\\). Halve the angle and the coordinates double.</p>" +
    "<div class=\"sol-note\"><strong>The name for this.</strong> \\(\\det B = \\sin\\theta\\) here, and the inverse divides by " +
    "it. The precise statement is that the condition number \\(\\kappa(B)=\\|B\\|\\|B^{-1}\\|\\) grows like \\(1/\\sin\\theta\\), " +
    "and it bounds how much a relative error in \\(\\mathbf{v}\\) is amplified in \\(\\mathbf{c}\\). You are looking at the " +
    "reason near-duplicate features destabilise training, and at the reason Gram-Schmidt exists.</div>"
},

B7: {
  statement: "Reproduce the span lab in matplotlib: arrows for u and v, 2000 sampled points a*u + b*v with a,b uniform on [-2,2], and the boundary parallelogram. Then set v = 2u and re-run.",
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
  statement: "For a token embedding matrix E of shape (|V|, d): must its rows be linearly dependent? Then compute the rank and compare with min(|V|, d), explaining any gap.",
  plain: "Yes — |V| >> d, so Theorem 2 forces dependence. Rank is generically d, and a shortfall means a genuinely degenerate embedding.",
  solution:
    "<p><strong>Answer before computing: yes, necessarily.</strong> The rows live in \\(\\mathbb{R}^{d}\\) and there are " +
    "\\(|V| \\gg d\\) of them — 50257 rows in \\(\\mathbb{R}^{768}\\) for GPT-2. Theorem 2 applies verbatim. No training " +
    "procedure, architecture or amount of data can change this.</p>" +
    "<pre><code>import torch\nfrom transformers import AutoModel\nE = AutoModel.from_pretrained(\"gpt2\").wte.weight.detach()   # (50257, 768)\n" +
    "print(E.shape, torch.linalg.matrix_rank(E))                 # -&gt; 768\n" +
    "s = torch.linalg.svdvals(E.float())\nprint(s[0] / s[-1])                                         # condition number\n" +
    "print((s &gt; 0.01 * s[0]).sum())                              # 'effective' rank at 1% of the top\n</code></pre>" +
    "<p><strong>Reading the result.</strong> The rank comes out at \\(d=768\\), the maximum possible — so the embedding uses " +
    "every dimension. A shortfall would mean some direction of the residual stream is never written by any token, which " +
    "would be a real finding rather than a rounding artefact.</p>" +
    "<div class=\"sol-note\"><strong>The gap worth chasing.</strong> Full rank and <em>well conditioned</em> are different " +
    "claims. The singular-value spectrum of a trained embedding decays sharply, so while the rank is 768, the number of " +
    "directions carrying appreciable variance is much smaller — count them with the threshold above. That decay is why " +
    "low-rank approximation of embeddings works at all, and it is the empirical fact that C2 exploits.</div>"
},

C2: {
  statement: "For a LoRA update dW = B A with B (d,r), A (r,k) and r << d: what is rank(dW) at most, and why? Verify. Describe in span language what LoRA can and cannot express.",
  plain: "rank(dW) <= r, because every column of BA is a linear combination of the r columns of B.",
  solution:
    "<pre><code>import torch\nd = k = 256; r = 8\nB = torch.randn(d, r); A = torch.randn(r, k)\ndW = B @ A\n" +
    "print(torch.linalg.matrix_rank(dW))     # 8\n" +
    "print(torch.linalg.matrix_rank(torch.randn(d, k)))   # 256, for contrast\n</code></pre>" +
    "<p><strong>Why \\(\\le r\\), from the definition of matrix multiplication.</strong> Column \\(j\\) of \\(BA\\) is " +
    "\\(B\\mathbf{a}_j\\), a linear combination of the \\(r\\) columns of \\(B\\). So every column of \\(\\Delta W\\) lies in " +
    "\\(\\operatorname{span}\\{\\mathbf{b}_1,\\ldots,\\mathbf{b}_r\\}\\), a subspace of dimension at most \\(r\\). The column " +
    "space of \\(\\Delta W\\) is contained in it, so \\(\\operatorname{rank}(\\Delta W)\\le r\\). Equally, every row of " +
    "\\(\\Delta W\\) is a combination of the \\(r\\) rows of \\(A\\).</p>" +
    "<p><strong>In span language.</strong> LoRA does not shrink the <em>size</em> of the update — \\(\\Delta W\\) is a full " +
    "\\(d\\times k\\) matrix — it constrains its <em>shape</em>. It can only write into an \\(r\\)-dimensional subspace of " +
    "output space, the same subspace for every input, and it only reads an \\(r\\)-dimensional subspace of input space. " +
    "Anything requiring the layer to change its behaviour along \\(r+1\\) genuinely different output directions is outside " +
    "what a rank-\\(r\\) adapter can express, at any learning rate and for any amount of training.</p>" +
    "<div class=\"sol-note\"><strong>Why it works anyway.</strong> The empirical bet is that the update a fine-tune " +
    "<em>needs</em> has rapidly decaying singular values — that the task is a small perturbation living near a low-dimensional " +
    "subspace. That is a claim about the data, not a theorem, and it is exactly the claim the LoRA paper argues for. " +
    "Note also that \\(\\operatorname{rank}(\\Delta W)\\) can be strictly less than \\(r\\) if \\(B\\) or \\(A\\) is itself " +
    "rank-deficient — which is why \\(A\\) is initialised randomly and \\(B\\) at zero, not both at zero.</div>"
},

C3: {
  statement: "Generate m random unit vectors in R^64 for m in {32, 64, 128, 1024}; compute the largest off-diagonal |<vi,vj>| and plot it against m. Relate to Theorem 2.",
  plain: "Interference grows only like sqrt(log m / d) while independence becomes impossible past m = d.",
  solution:
    "<pre><code>import torch\nd = 64\nfor m in (32, 64, 128, 1024, 8192):\n" +
    "    V = torch.randn(m, d)\n    V = V / V.norm(dim=1, keepdim=True)\n" +
    "    G = V @ V.T\n    G.fill_diagonal_(0)\n" +
    "    print(m, torch.linalg.matrix_rank(V).item(), G.abs().max().item())\n</code></pre>" +
    "<p>Typical output: rank saturates at \\(64\\) the moment \\(m\\) reaches \\(64\\) and never grows again, while the maximum " +
    "interference creeps from about \\(0.4\\) to about \\(0.6\\) as \\(m\\) goes from 32 to 8192 — a 256-fold increase in the " +
    "number of features for a modest rise in the worst crosstalk.</p>" +
    "<p><strong>The two facts, side by side.</strong> Theorem 2 is absolute: past \\(m=d\\) the vectors <em>are</em> dependent, " +
    "full stop, and there exist relations among them. But dependence is not the same as <em>interference</em>. Random unit " +
    "vectors in high dimensions are nearly orthogonal — the typical inner product is \\(O(1/\\sqrt d)\\) and the worst of " +
    "\\(m\\) of them grows only like \\(\\sqrt{(\\log m)/d}\\), i.e. logarithmically in the number of features.</p>" +
    "<div class=\"sol-note\"><strong>Why this is the whole superposition story.</strong> A network wanting to represent " +
    "\\(m \\gg d\\) features cannot make them independent, so it must accept relations among them. What it can do is choose " +
    "directions so that the relations involve many features weakly rather than a few strongly — and the geometry of " +
    "\\(\\mathbb{R}^{d}\\) is unusually generous about this. The cost is paid as small, sparse interference, tolerable when " +
    "features are sparsely active. The formal version is the Johnson-Lindenstrauss lemma, Module 21.</div>"
},

C4: {
  statement: "Initialise nn.Linear(64,64) with a rank-4 weight and train it on a full-rank target map. Report the achievable loss and explain it with the word 'span'. Does gradient descent escape the rank-4 constraint?",
  plain: "It does escape: the constraint is on the initialisation, not the parameterisation, so gradients are full-rank and the loss goes to zero.",
  solution:
    "<pre><code>import torch, torch.nn as nn\ntorch.manual_seed(0)\nd = 64\n" +
    "W_true = torch.randn(d, d)\nlayer = nn.Linear(d, d, bias=False)\n" +
    "with torch.no_grad():                       # rank-4 initialisation\n" +
    "    layer.weight.copy_(torch.randn(d, 4) @ torch.randn(4, d))\n" +
    "print(torch.linalg.matrix_rank(layer.weight))       # 4\n\n" +
    "opt = torch.optim.Adam(layer.parameters(), lr=1e-3)\nfor step in range(3000):\n" +
    "    x = torch.randn(512, d)\n    loss = ((layer(x) - x @ W_true.T)**2).mean()\n" +
    "    opt.zero_grad(); loss.backward(); opt.step()\n" +
    "print(loss.item(), torch.linalg.matrix_rank(layer.weight))   # ~0, and 64\n</code></pre>" +
    "<p><strong>It escapes, and the loss goes to zero.</strong> The rank-4 matrix was only the starting <em>point</em>; the " +
    "parameter is the full \\(64\\times64\\) weight, and the gradient \\(\\partial L/\\partial W\\) is a full-rank matrix, so " +
    "the very first step moves \\(W\\) out of the rank-4 set. Low-rank matrices form a measure-zero subset of " +
    "\\(\\mathbb{R}^{64\\times64}\\) — you leave it immediately and never return.</p>" +
    "<p><strong>Contrast with the constrained case.</strong> Parameterise the layer <em>as</em> \\(BA\\) with \\(B,A\\) of inner " +
    "dimension 4 and train those instead. Now the span of the reachable outputs is capped at 4 dimensions for the whole " +
    "of training, and the loss plateaus at the error of the best rank-4 approximation of \\(W_{\\text{true}}\\) — which the " +
    "Eckart-Young theorem says is \\(\\sum_{i&gt;4}\\sigma_i^2\\) in squared Frobenius terms. Run both and compare; the gap is " +
    "the difference between a constraint on the initialisation and a constraint on the parameterisation, and it is the " +
    "difference between a bad init and LoRA.</p>"
},

C5: {
  statement: "Find 'column space' or 'rank' in a paper you are reading and write two sentences on what is being claimed geometrically.",
  plain: "Open-ended; the marking looks for a geometric reading rather than a restatement.",
  solution:
    "<p>There is no single right answer here, so the reference is what a good answer <em>does</em>. Take the LoRA abstract's " +
    "claim that pretrained models have a low \"intrinsic rank\" and that weight updates during adaptation therefore also " +
    "have low intrinsic rank.</p>" +
    "<p>A weak reading restates it: \"the update matrix has small rank\". A geometric reading says what that means about " +
    "the map: the update writes into a subspace of output space of dimension at most \\(r\\), and reads from a subspace of " +
    "input space of the same dimension — so adaptation moves the layer's behaviour along only a handful of directions " +
    "while leaving it untouched along the remaining \\(d-r\\). The claim being made is not about storage but about the " +
    "<em>shape of the change</em>: fine-tuning is conjectured to be a near-rotation in a few coordinates rather than a " +
    "general perturbation.</p>" +
    "<div class=\"sol-note\"><strong>The test to apply to your own two sentences.</strong> Could you draw it? If your " +
    "sentence about rank cannot be turned into a statement about which subspace something lives in or which directions " +
    "are moved, you have paraphrased rather than understood.</div>"
}

});


/* Cumulative problems, the checkpoint, and the exercises added after the first
   release. Statements are marked against these references; none carry typed
   fields, because every one of them asks for an argument. */
GU.answers("01-span", {

M1: {
  statement: "Three recipes. For \\(u=(1,2)\\), \\(v=(2,4)\\), find three coefficient pairs producing \\((3,6)\\). Describe all such pairs.",
  plain: "(3,0),(1,1),(-1,2); all pairs are (3-2t,t), t\\in\\mathbb R.",
  solution: "<p>\\((3,0),(1,1),(-1,2)\\); all pairs are \\((3-2t,t)\\), \\(t\\in\\mathbb R\\).</p>"
},

M2: {
  statement: "Two dimensions, two descriptions. For \\(B=((1,0),(1,1))\\), find the coordinates of \\((3,2)\\). Reverse the basis order and find the new coordinates.",
  plain: "(1,2)^T, then (2,1)^T. The ordered basis and its coordinate list must change together.",
  solution: "<p>\\((1,2)^T\\), then \\((2,1)^T\\). The ordered basis and its coordinate list must change together.</p>"
},

M3: {
  statement: "Subspace or affine set. Classify \\(x+y+z=0\\) and \\(x+y+z=1\\) in \\(\\mathbb R^3\\). Give a basis for the first and a point-plus-subspace description for the second.",
  plain: "The first is a two-dimensional subspace with basis (1,-1,0),(1,0,-1). The second is the affine plane (1,0,0)+S, where S is that subspace. It does not contain zero.",
  solution: "<p>The first is a two-dimensional subspace with basis \\((1,-1,0),(1,0,-1)\\). The second is the affine plane \\((1,0,0)+S\\), where \\(S\\) is that subspace. It does not contain zero.</p>"
},

M4: {
  statement: "Independent but not orthogonal. Give two such vectors, then verify independence and their nonzero dot product separately.",
  plain: "(1,0),(1,1): the second coordinate forces the second coefficient to vanish in a zero combination, then the first coefficient vanishes. Their dot product is 1.",
  solution: "<p>\\((1,0),(1,1)\\): the second coordinate forces the second coefficient to vanish in a zero combination, then the first coefficient vanishes. Their dot product is 1.</p>"
},

M5: {
  statement: "Complete the equivalence. Prove that a list is independent if and only if every vector in its span has exactly one coefficient list. Explain why “in its span” matters.",
  plain: "Existence holds by the definition of span. Subtract two representations and use independence for uniqueness. Conversely, zero's all-zero recipe is unique, so there can be no nonzero relation. Independence alone does not guarantee reaching vectors outside the span.",
  solution: "<p>Existence holds by the definition of span. Subtract two representations and use independence for uniqueness. Conversely, zero's all-zero recipe is unique, so there can be no nonzero relation. Independence alone does not guarantee reaching vectors outside the span.</p>"
},

M6: {
  statement: "Find the hidden relation. Let \\(u=(1,2,-1)\\), \\(v=(2,1,3)\\), \\(w=(4,5,1)\\). Find a nonzero relation, a basis of the span, and all coefficient lists expressing \\(w\\) with these three generators.",
  plain: "w=2u+v, so (2,1,-1) is a relation. The first two vectors are independent, hence form a basis of a plane. Every recipe for w is (2-2t,1-t,t). An equation for the plane is 7x-5y-3z=0.",
  solution: "<p>\\(w=2u+v\\), so \\((2,1,-1)\\) is a relation. The first two vectors are independent, hence form a basis of a plane. Every recipe for \\(w\\) is \\((2-2t,1-t,t)\\). An equation for the plane is \\(7x-5y-3z=0\\).</p>"
},

M7: {
  statement: "Same geometry in different coordinates. Set \\(B=\\operatorname{diag}(2,1)\\), \\(x=(1,1)\\), and \\(y=(1,-1)\\). Compute the dot product of their standard coordinates, the raw dot product of their \\(B\\)-coordinates, and the dot product using the Gram matrix \\(B^TB\\). Explain the discrepancy.",
  plain: "The standard dot product is 0. The coordinate vectors are (1/2,1), (1/2,-1), whose raw dot product is -3/4. Weighting by B^TB=\\operatorname{diag}(4,1) recovers 0. Raw coordinate dot products would choose a different geometry.",
  solution: "<p>The standard dot product is 0. The coordinate vectors are \\((1/2,1)\\), \\((1/2,-1)\\), whose raw dot product is \\(-3/4\\). Weighting by \\(B^TB=\\operatorname{diag}(4,1)\\) recovers 0. Raw coordinate dot products would choose a different geometry.</p>"
},

M8: {
  statement: "A union claim. Prove that \\(U\\cup W\\) is a subspace exactly when \\(U\\subseteq W\\) or \\(W\\subseteq U\\). Your proof must establish both directions.",
  plain: "Containment makes the union equal to the larger subspace. Otherwise choose u\\in U\\setminus W, w\\in W\\setminus U. If u+w\\in U, subtraction puts w\\in U; if u+w\\in W, subtraction puts u\\in W. Both contradict the choices, so the union fails closure under addition.",
  solution: "<p>Containment makes the union equal to the larger subspace. Otherwise choose \\(u\\in U\\setminus W\\), \\(w\\in W\\setminus U\\). If \\(u+w\\in U\\), subtraction puts \\(w\\in U\\); if \\(u+w\\in W\\), subtraction puts \\(u\\in W\\). Both contradict the choices, so the union fails closure under addition.</p>"
},

M9: {
  statement: "Dependency without a small returned singular value. A full-row-rank \\(5\\times6\\) matrix has five positive returned singular values. Explain why its columns are still dependent and how B5 recovers a relation. State the shapes for both full and reduced SVD.",
  plain: "The full factors have shapes U:5\\times5, s:5, V_h:6\\times6. The last right vector is a null direction outside the five directions paired with returned singular values. The reduced factors have shapes 5\\times5, 5, and 5\\times6, and omit that direction.",
  solution: "<p>The full factors have shapes \\(U:5\\times5\\), \\(s:5\\), \\(V_h:6\\times6\\). The last right vector is a null direction outside the five directions paired with returned singular values. The reduced factors have shapes \\(5\\times5\\), \\(5\\), and \\(5\\times6\\), and omit that direction.</p>"
},

M10: {
  statement: "Diagnose a misleading numerical report. Someone reports “the basis is safe: the reconstruction error is tiny and the Hadamard ratio is 1.” Use \\(B=\\operatorname{diag}(1,10^{-8})\\) to construct a counterexample based on input perturbation. Name the claim the residual does support.",
  plain: "Perturb v=(1,0) by (0,10^{-8}). Coordinates change from (1,0) to (1,1); both reconstructions can be exact. The residual supports accurate reconstruction of the supplied input, not insensitivity of the recovered coordinates to changes in that input.",
  solution: "<p>Perturb \\(v=(1,0)\\) by \\((0,10^{-8})\\). Coordinates change from \\((1,0)\\) to \\((1,1)\\); both reconstructions can be exact. The residual supports accurate reconstruction of the supplied input, not insensitivity of the recovered coordinates to changes in that input.</p>"
},

M11: {
  statement: "Keep the logits unchanged. Row embeddings transform as \\(x'=xA\\), where \\(A\\in\\mathbb R^{d\\times d}\\) is invertible. Original logits are \\(xW\\), with \\(W\\in\\mathbb R^{d\\times k}\\). Derive the new downstream weights that preserve every logit. Does Euclidean cosine between embeddings have to remain unchanged?",
  plain: "Choose W'=A^{-1}W; then x'W'=xAA^{-1}W=xW. A general invertible A can shear or scale different directions unequally, so Euclidean cosine need not be preserved. For example, (1,1) and (1,-1) are orthogonal before, but not after, multiplying by \\operatorname{diag}(2,1).",
  solution: "<p>Choose \\(W'=A^{-1}W\\); then \\(x'W'=xAA^{-1}W=xW\\). A general invertible \\(A\\) can shear or scale different directions unequally, so Euclidean cosine need not be preserved. For example, \\((1,1)\\) and \\((1,-1)\\) are orthogonal before, but not after, multiplying by \\(\\operatorname{diag}(2,1)\\).</p>"
},

M12: {
  statement: "Audit a rank claim. “Our layer starts at rank 4, so it can only learn four output directions.” State a parameterization under which this is true at every step and one under which it is false. Use C4 to give an exact loss comparison, then state why it does not establish a universal claim about nonlinear networks.",
  plain: "A stored factorization W=BA with inner dimension 4 preserves rank at most 4; an unrestricted weight merely initialized at rank 4 need not. On C4's fixture the constrained optimum is 60/64 and the unrestricted optimum is 0. This is a statement about a single linear map and a specified loss, not the r",
  solution: "<p>A stored factorization \\(W=BA\\) with inner dimension 4 preserves rank at most 4; an unrestricted weight merely initialized at rank 4 need not. On C4's fixture the constrained optimum is \\(60/64\\) and the unrestricted optimum is 0. This is a statement about a single linear map and a specified loss, not the representational power of an entire nonlinear network.</p>"
},

K1: {
  statement: "Define and explain",
  plain: "The zero-combination form is symmetric in all k vectors, needs no distinguished index, and is a homogeneous linear system with a decidable answer.",
  solution: "<p>Independent means the only solution of \\(c_1v_1+\\dots+c_kv_k=0\\) is the all-zero list.</p><p>Equivalence, both directions. If some \\(c_j\\ne0\\) in a relation, divide by that coefficient — the step that needs \\(c_j\\ne0\\) named first — and \\(v_j\\) is a combination of the others. Conversely, if \\(v_j=\\sum_{i\\ne j}a_iv_i\\), then \\(\\sum a_iv_i-v_j=0\\) is a relation with coefficient \\(-1\\) on \\(v_j\\), so not all coefficients vanish.</p><p>The zero form is preferred because it is symmetric in all \\(k\\) vectors, requires no choice of a distinguished index, and is a linear system you can actually solve.</p>"
},

K2: {
  statement: "Find the redundancy",
  plain: "w = 2u + v, so (2,1,-1) is a relation; the span is the plane through the origin spanned by u and v.",
  solution: "<p>\\(2u+v=(2,4,-2)+(2,1,3)=(4,5,1)=w\\), so \\((2,1,-1)\\) is a nonzero dependency relation and the three are dependent.</p><p>\\(u\\) and \\(v\\) are independent — neither is a multiple of the other — so they are a basis of the span, which is therefore a two-dimensional plane through the origin, not all of \\(\\mathbb R^3\\).</p>"
},

K3: {
  statement: "Repair a false claim",
  plain: "False in general; the union is a subspace exactly when one contains the other.",
  solution: "<p>False. Take \\(U=\\operatorname{span}\\{e_1\\}\\), \\(W=\\operatorname{span}\\{e_2\\}\\): both \\(e_1,e_2\\in U\\cup W\\) but \\(e_1+e_2\\) lies in neither, so closure under addition fails.</p><p>The exact condition is containment. If \\(U\\subseteq W\\) the union is \\(W\\), a subspace. Conversely, if neither contains the other, pick \\(u\\in U\\setminus W\\) and \\(w\\in W\\setminus U\\); if \\(u+w\\in U\\) then \\(w=(u+w)-u\\in U\\), and if \\(u+w\\in W\\) then \\(u\\in W\\) — both contradictions.</p>"
},

K4: {
  statement: "Reduce a generating list",
  plain: "Discard two; exactly three of the five are independent, and which two you may discard is not arbitrary.",
  solution: "<p>The subspace has dimension 3, so by Theorem 4 every spanning set has at least 3 elements and every independent set at most 3. A spanning set of five can be thinned to a basis of three by deleting redundant vectors one at a time (Theorem 1(3)), so you can discard two.</p><p>Exactly three are independent. But the pair you discard is not arbitrary: if two of the five are equal, you may drop either one of them, yet dropping two vectors that happen to carry a direction nothing else covers would shrink the span.</p>"
},

K5: {
  statement: "Explain collapse precisely",
  plain: "For y != 0 the coordinates blow up like y/eps; for y = 0 they stay bounded. At eps = 0 existence fails off the line and uniqueness fails on it.",
  solution: "<p>With \\(b_1=(1,0)\\), \\(b_2=(1,\\varepsilon)\\) and \\(p=(x,y)\\), solving \\(c_1b_1+c_2b_2=p\\) gives \\(c_2=y/\\varepsilon\\) and \\(c_1=x-y/\\varepsilon\\).</p><p>For \\(y\\ne0\\) both coordinates diverge as \\(\\varepsilon\\to0\\); for \\(y=0\\) they are \\((x,0)\\) for every \\(\\varepsilon\\). At \\(\\varepsilon=0\\) the two vectors are dependent: a point off the line has <em>no</em> representation and a point on it has infinitely many. Theorem 3 is not violated — its hypothesis, that \\(B\\) is a basis, has stopped holding.</p>"
},

K6: {
  statement: "Separate theorem from evidence",
  plain: "Forced: dependence, hence no exactly-orthogonal decomposition and some interference. Not forced: the size of the interference, recoverability, or interpretability.",
  solution: "<p><strong>Forced by Theorem 2.</strong> 50,000 vectors in \\(\\mathbb R^{1024}\\) are linearly dependent, so the feature directions satisfy nonzero relations, cannot be mutually orthogonal, and no linear readout can isolate all of them without interference.</p><p><strong>Not forced.</strong> How large the interference is, whether the directions are nearly orthogonal enough to be useful, whether they are findable by any method you have, and whether they correspond to anything a person would call a feature. Those are empirical claims about one model, and the theorem says nothing about them.</p>"
},

A14: {
  statement: "Prove a union of two subspaces is a subspace exactly when one contains the other; then show S+T is always a subspace and equals span(S∪T).",
  plain: "Union: containment is necessary and sufficient. Sum: closed by construction, and it is the smallest subspace containing both.",
  solution: "<p>The union claim is checkpoint 3. For the sum, \\(0=0+0\\in S+T\\); \\((s_1+t_1)+(s_2+t_2)=(s_1+s_2)+(t_1+t_2)\\); and \\(c(s+t)=cs+ct\\), so the three-part test passes.</p><p>\\(S+T\\) contains both \\(S\\) (take \\(t=0\\)) and \\(T\\), so it contains \\(S\\cup T\\) and therefore \\(\\operatorname{span}(S\\cup T)\\). Conversely every \\(s+t\\) is a combination of one element of each, so \\(S+T\\subseteq\\operatorname{span}(S\\cup T)\\). The two sets are equal.</p>"
},

A15: {
  statement: "For subspaces S,T of R^5 with dim S = dim T = 3, give every possible value of dim(S∩T) and justify both extremes.",
  plain: "1, 2 or 3. The lower bound is dim S + dim T - 5; the maximum is S = T.",
  solution: "<p>The dimension formula \\(\\dim(S+T)=\\dim S+\\dim T-\\dim(S\\cap T)\\) together with \\(\\dim(S+T)\\le5\\) forces \\(\\dim(S\\cap T)\\ge3+3-5=1\\).</p><p>All of 1, 2, 3 occur: take \\(S=\\operatorname{span}\\{e_1,e_2,e_3\\}\\) with \\(T=\\operatorname{span}\\{e_3,e_4,e_5\\}\\) (intersection dimension 1), \\(T=\\operatorname{span}\\{e_2,e_3,e_4\\}\\) (2), and \\(T=S\\) (3). Two three-dimensional subspaces of \\(\\mathbb R^5\\) can never meet only at the origin.</p>"
},

A16: {
  statement: "Prove that n vectors in R^n are a basis as soon as they are independent, without checking spanning. Name the result taken on trust.",
  plain: "Extend to a basis, count with Theorem 4, and conclude nothing was added.",
  solution: "<p>Suppose \\(v_1,\\dots,v_n\\in\\mathbb R^n\\) are independent. If they did not span, some \\(w\\) lies outside their span, and by the extension lemma \\(\\{v_1,\\dots,v_n,w\\}\\) is an independent set of \\(n+1\\) vectors in \\(\\mathbb R^n\\) — impossible, since Theorem 4 caps an independent set at \\(\\dim\\mathbb R^n=n\\).</p><p>Taken on trust until the next unit: that \\(\\dim\\mathbb R^n=n\\), i.e. that every basis has the same size. Without it, the counting step has nothing to count against.</p>"
},

B8: {
  statement: "Implement classical and modified Gram–Schmidt, orthogonalize a nearly dependent basis with both, and compare max |<q_i,q_j>|.",
  plain: "Modified Gram–Schmidt subtracts each projection from the running residual, so rounding error is not reused; loss of orthogonality grows with the condition number for the classical version and much more slowly for the modified one.",
  solution: "<p>Classical Gram–Schmidt projects the original vector onto every previous \\(q_i\\) and subtracts all projections at once; the modified version subtracts each projection from the <em>running</em> residual. In exact arithmetic they agree.</p><p>In floating point they do not. Classical reuses an already-contaminated vector for every projection, so the measured \\(\\max_{i\\ne j}|\\langle q_i,q_j\\rangle|\\) grows roughly with the square of the conditioning; modified keeps it roughly linear. On a basis with Hadamard ratio near \\(10^{-8}\\) the difference is visible in single digits of the inner products.</p>"
},

B9: {
  statement: "Implement hadamard_ratio(B) and plot it beside np.linalg.cond(B) as a basis closes to degeneracy.",
  plain: "The ratio falls to 0 and the condition number rises without bound; the ratio is bounded and comparable across matrices, the condition number is the one that predicts digits lost.",
  solution: "<p>\\(h=|\\det B|/\\prod_i\\|b_i\\|\\) lies in \\([0,1]\\), equals 1 exactly for an orthogonal basis, and is scale-invariant in each column. \\(\\kappa(B)\\) is unbounded and is the quantity that bounds error amplification in a solve.</p><p>Report \\(\\kappa\\) when the question is how many digits a computation will lose; report \\(h\\) when the question is how close to degenerate a basis is on a comparable scale. They are monotonically related for \\(2\\times2\\) but not interchangeable in general.</p>"
},

C6: {
  statement: "Train a linear probe w, describe its null space, and construct an activation edit the probe provably cannot detect.",
  plain: "The null space is the hyperplane orthogonal to w — d-1 of d directions. Adding any multiple of a vector in it leaves the probe output exactly unchanged.",
  solution: "<p>The probe reads \\(w^{\\mathsf T}h\\). Its null space is \\(\\{x : w^{\\mathsf T}x=0\\}\\), a subspace of dimension \\(d-1\\): in \\(\\mathbb R^{768}\\), 767 independent directions of change are invisible to it.</p><p>To build an undetectable edit, take any \\(x\\) with \\(w^{\\mathsf T}x=0\\) — Gram–Schmidt one random vector against \\(w\\) — and set \\(h'=h+\\alpha x\\) for any \\(\\alpha\\). Then \\(w^{\\mathsf T}h'=w^{\\mathsf T}h\\) exactly. The lesson is that flat probe accuracy is evidence about one direction, not about the representation.</p>"
},

C7: {
  statement: "Map one layer's activations through an invertible matrix and check which of span, independence, dimension, rank, norm and cosine survive.",
  plain: "Span, independence, dimension and rank survive any invertible map; norms and cosines do not.",
  solution: "<p>If \\(A\\) is invertible then \\(\\sum c_i(Av_i)=A\\sum c_iv_i\\), which is zero only when \\(\\sum c_iv_i=0\\) — so relations are preserved exactly in both directions, and independence, dimension and rank are unchanged. Spans map onto spans.</p><p>Lengths and angles are not preserved: \\(\\operatorname{diag}(2,1)\\) sends the orthogonal pair \\((1,1),(1,-1)\\) to \\((2,1),(2,-1)\\), whose cosine is \\(3/5\\). The survivors are exactly the properties defined without an inner product — which is why the first nine sections avoided one.</p>"
}

});
