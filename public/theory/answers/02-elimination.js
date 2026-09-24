/* Answers, checks and reference solutions for Linear Algebra Module 2 —
   systems, elimination, rank, and the four fundamental subspaces. */
GU.answers("02-elimination", {

A1: {
  statement: "**A1 · Foundation · paper — solve and classify.** Solve \\(x+2y+z=4\\), \\(2x+3y-z=3\\), \\(3x+5y=7\\) by elimination, showing every row operation. Then give the rank of the coefficient matrix and of the augmented matrix.",
  fields: [
    { id: "rA", label: "rank of the coefficient matrix", type: "num", ans: 2 },
    { id: "rAug", label: "rank of the augmented matrix", type: "num", ans: 2 },
    { id: "f", label: "number of free variables", type: "num", ans: 1 }
  ],
  hints: { rA: "Row 3 is row 1 plus row 2. Predict the third row before eliminating.", f: "Three unknowns, two pivots." },
  plain: "Rank 2 for both, one free variable; x=-6+5z, y=5-3z, z free.",
  solution: "<p>\\(R_3=R_1+R_2\\), so \\(R_3-R_1-R_2\\) is the zero row and the third equation carries no new information. Eliminating: \\(R_2-2R_1\\) gives \\(-y-3z=-5\\), so \\(y=5-3z\\), and back-substituting into \\(R_1\\) gives \\(x=-6+5z\\).</p><p>Both ranks are 2: no pivot lands in the right-hand column, so the system is consistent, and with three unknowns and two pivots one variable is free. The complete solution is \\((-6,5,0)+z(5,-3,1)\\) — a line in \\(\\mathbb R^3\\).</p>"
},

A2: {
  statement: "**A2 · Foundation · paper — read the echelon form.** For each case state the number of solutions and the reason: (a) three coefficient columns, two pivots, no pivot in the right-hand column; (b) a row reading \\([0\\ 0\\ 0\\mid5]\\); (c) a \\(4\\times4\\) coefficient matrix with four pivots.",
  fields: [
    { id: "a", label: "case (a)", type: "choice", opts: ["none", "exactly one", "infinitely many"], ans: "infinitely many" },
    { id: "b", label: "case (b)", type: "choice", opts: ["none", "exactly one", "infinitely many"], ans: "none" },
    { id: "c", label: "case (c)", type: "choice", opts: ["none", "exactly one", "infinitely many"], ans: "exactly one" }
  ],
  plain: "(a) infinitely many — one free column; (b) none — 0 = 5; (c) exactly one.",
  solution: "<p>(a) Consistent, and three columns with two pivots leaves one free column, so the solution set is a one-dimensional affine set.</p><p>(b) That row reads \\(0=5\\). A pivot in the right-hand column is exactly the signature of inconsistency: \\(b\\) is outside the column space.</p><p>(c) Four pivots in four columns leaves no free variable, so the null space is trivial and the solution is unique.</p>"
},

A3: {
  statement: "**A3 · Foundation · paper — a plane as a solution set.** Find the complete solution set of \\(x_1+2x_2+3x_3=6\\) in \\(\\mathbb R^3\\). Write it as \\(x_p+N(A)\\) with an explicit null-space basis, and name the geometric object.",
  fields: [
    { id: "r", label: "rank", type: "num", ans: 1 },
    { id: "n", label: "nullity", type: "num", ans: 2 },
    { id: "shape", label: "the solution set is a", type: "choice", opts: ["point", "line", "plane", "all of R³"], ans: "plane" }
  ],
  plain: "x_p=(6,0,0); N(A)=span{(-2,1,0),(-3,0,1)}; an affine plane.",
  solution: "<p>One equation, one pivot: rank 1, and with three columns rank–nullity gives nullity 2.</p><p>Setting the free variables to zero gives \\(x_p=(6,0,0)\\). Setting \\(x_2=1,x_3=0\\) gives \\((-2,1,0)\\); setting \\(x_2=0,x_3=1\\) gives \\((-3,0,1)\\). The complete set is \\((6,0,0)+\\operatorname{span}\\{(-2,1,0),(-3,0,1)\\}\\): a plane, but an affine one — it misses the origin, so it is not a subspace.</p>"
},

A4: {
  statement: "**A4 · Foundation · paper — all four subspaces.** For \\(A=\\begin{pmatrix}1&2&3\\\\2&4&6\\\\1&1&1\\end{pmatrix}\\) compute the rank, a basis for \\(C(A)\\), a basis for \\(N(A)\\), and verify rank–nullity.",
  fields: [
    { id: "r", label: "rank", type: "num", ans: 2 },
    { id: "n", label: "dim N(A)", type: "num", ans: 1 }
  ],
  hints: { r: "Look at rows 1 and 2 before eliminating." },
  plain: "Rank 2; C(A) basis (1,2,1),(2,4,1); N(A) basis (1,-2,1); 2+1=3.",
  solution: "<p>\\(R_2=2R_1\\), so elimination leaves two nonzero rows and the rank is 2. The pivots sit in columns 1 and 2, so the first two columns of the <em>original</em> matrix, \\((1,2,1)\\) and \\((2,4,1)\\), are a basis of \\(C(A)\\).</p><p>For the null space, \\(x+2y+3z=0\\) and \\(x+y+z=0\\) give \\(y=-2z\\) and \\(x=z\\), so \\(N(A)=\\operatorname{span}\\{(1,-2,1)\\}\\). Rank–nullity: \\(2+1=3\\), the number of columns.</p>"
},

A5: {
  statement: "**A5 · Foundation · paper — a parameter decides.** For which \\(k\\) does \\(\\begin{pmatrix}1&2\\\\3&k\\end{pmatrix}x=\\begin{pmatrix}1\\\\5\\end{pmatrix}\\) have no solution, one solution, infinitely many? Draw the row picture in each case.",
  fields: [
    { id: "unique", label: "unique for every k except", type: "num", ans: 6 },
    { id: "inf", label: "values of k giving infinitely many", type: "choice", opts: ["none", "k=6", "every k"], ans: "none" }
  ],
  hints: { inf: "Infinitely many needs the columns dependent AND b in their span. Check the second condition." },
  plain: "k != 6 unique; k = 6 no solution; infinitely many never happens for this b.",
  solution: "<p>\\(\\det=k-6\\). For \\(k\\ne6\\) the columns are independent, so there is exactly one solution.</p><p>At \\(k=6\\), \\(R_2-3R_1\\) gives \\([0\\ 0\\mid 2]\\): inconsistent, no solution. Infinitely many would need the columns dependent <em>and</em> \\(b\\) inside their span, which would require the right-hand side \\((1,3)\\) rather than \\((1,5)\\). Two conditions, not one.</p>"
},

A6: {
  statement: "**A6 · Core · paper — build to order.** Give a \\(3\\times4\\) matrix whose null space is exactly \\(\\operatorname{span}\\{(1,-1,0,0),(0,0,1,-1)\\}\\), or prove none exists. What must its rank be?",
  fields: [
    { id: "r", label: "the rank must be", type: "num", ans: 2 }
  ],
  plain: "Rank 2 by rank-nullity; e.g. rows (1,1,0,0), (0,0,1,1), (0,0,0,0).",
  solution: "<p>The prescribed null space has dimension 2 and the matrix has four columns, so rank–nullity forces rank \\(4-2=2\\). A \\(3\\times4\\) matrix can have rank 2, so nothing is ruled out.</p><p>Take rows \\((1,1,0,0)\\), \\((0,0,1,1)\\) and a zero row. Each generator is killed by both rows, and the two rows are independent so the rank is exactly 2 — which by rank–nullity means the null space is exactly two-dimensional, hence exactly the span given.</p>"
},

A7: {
  statement: "**A7 · Core · paper — the structure theorem.** Prove Theorem 6 in both directions, then use it to prove the trichotomy: zero, one, or infinitely many solutions, never exactly two.",
  plain: "Both inclusions are one line each; two distinct solutions give a nonzero null vector, whose whole line can be added.",
  solution: "<p>If \\(n\\in N(A)\\) then \\(A(x_p+n)=Ax_p+An=b+0=b\\), so \\(x_p+N(A)\\subseteq\\) the solution set. Conversely, if \\(Ax=b\\) then \\(A(x-x_p)=b-b=0\\), so \\(x-x_p\\in N(A)\\) and \\(x\\in x_p+N(A)\\). Both steps use linearity, and nothing else.</p><p>Trichotomy: if there are two distinct solutions \\(x_1\\ne x_2\\) then \\(n=x_1-x_2\\) is a nonzero null vector, so \\(x_1+tn\\) solves the system for every real \\(t\\) — infinitely many. Hence the count is 0, 1, or infinite; \"exactly two\" is impossible because the null space is closed under scaling.</p>"
},

A8: {
  statement: "**A8 · Core · paper — why row operations are safe.** Prove that each of the three row operations leaves the solution set unchanged. Say exactly where reversibility is used.",
  plain: "Each operation maps solutions to solutions; reversibility gives the other inclusion.",
  solution: "<p>Each operation replaces the equations by linear combinations of them, so any \\(x\\) satisfying the old system satisfies the new one: solutions are preserved forwards for all three.</p><p>The converse needs reversibility. A swap is its own inverse; scaling by \\(c\\ne0\\) is undone by \\(1/c\\); adding \\(cR_i\\) to \\(R_j\\) is undone by adding \\(-cR_i\\). Since the inverse operation is itself a row operation, it also preserves solutions forwards, giving the reverse inclusion. Scaling by \\(0\\) has no inverse — and indeed it can enlarge the solution set, which is why it is excluded.</p>"
},

A9: {
  statement: "**A9 · Core · paper — counting, carefully.** Prove rank–nullity from the echelon form, being explicit about why the constructed null-space vectors are independent and why they span.",
  plain: "Each column is a pivot column or a free column; the free-variable construction gives one independent null vector per free column, and they span.",
  solution: "<p>Reduce \\(A\\). Every one of the \\(n\\) columns is either a pivot column or a free column, so \\(\\#\\text{pivots}+\\#\\text{free}=n\\), and \\(\\#\\text{pivots}=\\operatorname{rank}A\\).</p><p>For each free column build \\(v_j\\) by setting that free variable to 1, the other free variables to 0, and solving for the pivot variables. <em>Independent:</em> \\(v_j\\) has a 1 in free position \\(j\\) where every other \\(v_i\\) has 0, so a vanishing combination forces each coefficient to vanish in turn. <em>Spanning:</em> given any \\(x\\in N(A)\\), subtract \\(\\sum_j x_{f_j}v_j\\); the result is a null vector with every free variable zero, and the reduced equations then force the pivot variables to zero too. So \\(\\dim N(A)=\\#\\text{free}\\) and the counts add to \\(n\\).</p>"
},

A10: {
  statement: "**A10 · Core · paper — rank under multiplication.** Prove \\(\\operatorname{rank}(AB)\\le\\min(\\operatorname{rank}A,\\operatorname{rank}B)\\), then exhibit matrices where the rank of the product is strictly smaller than both.",
  plain: "Columns of AB lie in C(A); rows of AB lie in the row space of B. Take A=[[1,0],[0,0]] and B=[[0,0],[0,1]].",
  solution: "<p>Each column of \\(AB\\) is \\(A\\) applied to a column of \\(B\\), hence lies in \\(C(A)\\); so \\(C(AB)\\subseteq C(A)\\) and \\(\\operatorname{rank}(AB)\\le\\operatorname{rank}(A)\\). Each row of \\(AB\\) is a combination of rows of \\(B\\), so the row space of \\(AB\\) sits inside that of \\(B\\), and by Theorem 5 \\(\\operatorname{rank}(AB)\\le\\operatorname{rank}(B)\\).</p><p>Strictness: \\(A=\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}\\), \\(B=\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}\\) both have rank 1, but \\(AB=0\\) has rank 0. \\(A\\) keeps only the first coordinate and \\(B\\) produces only the second, so the image of \\(B\\) sits entirely inside the null space of \\(A\\).</p>"
},

A11: {
  statement: "**A11 · Stretch · paper — which columns are the basis.** Prove that row operations change the column space but never the dependency relations among the columns. Explain why that makes \"find the pivot columns in the echelon form, then take those columns of the *original* matrix\" correct.",
  plain: "Row operations are left multiplication by an invertible E: Ac = 0 iff EAc = 0. The relations are identical, the spaces are not.",
  solution: "<p>A row operation is left multiplication by an invertible matrix \\(E\\). For any coefficient vector \\(c\\), \\((EA)c=E(Ac)\\), and since \\(E\\) is invertible, \\((EA)c=0\\) exactly when \\(Ac=0\\). The dependency relations among the columns are therefore identical before and after.</p><p>The column <em>space</em> is not: \\(C(EA)=E\\,C(A)\\), a different subspace in general. So you may read <em>which</em> columns are pivot columns off the echelon form — that is a statement about relations — but the basis vectors themselves must be taken from the original matrix, whose column space is the one you wanted.</p>"
},

A12: {
  statement: "**A12 · Stretch · paper — read the shape.** \\(A\\in\\mathbb R^{3\\times5}\\) has rank 3. Give the dimension of all four subspaces, say for which \\(b\\) the system is solvable, and with how many solutions each.",
  fields: [
    { id: "c", label: "dim C(A)", type: "num", ans: 3 },
    { id: "nul", label: "dim N(A)", type: "num", ans: 2 },
    { id: "row", label: "dim row space", type: "num", ans: 3 },
    { id: "left", label: "dim N(A^T)", type: "num", ans: 0 }
  ],
  plain: "3, 2, 3, 0. Solvable for every b, each with a 2-dimensional affine set of solutions.",
  solution: "<p>Rank 3 with \\(m=3\\) is full row rank, so \\(\\dim C(A)=3=\\mathbb R^3\\) and the left null space is \\(3-3=0\\)-dimensional. The row space also has dimension 3 (Theorem 5), and rank–nullity in \\(\\mathbb R^5\\) gives \\(\\dim N(A)=5-3=2\\).</p><p>Since the column space is all of \\(\\mathbb R^3\\), every \\(b\\) is reachable: the system is always solvable. And since the nullity is 2, the solution set is always a two-dimensional affine set — never a single point. Wide and full-row-rank means existence always, uniqueness never.</p>"
},

B1: {
  statement: "**B1 · Foundation · NumPy — forward elimination.** Implement `eliminate(A, tol=1e-9)` with partial pivoting, returning the echelon form and the pivot columns. Swap in the largest-magnitude entry before clearing each column.",
  plain: "Walk the columns; for each, take the largest-magnitude candidate at or below the current row as pivot, swap it up, and clear below.",
  solution: "<p>Keep a current row index. For each column, find the row at or below it with the largest absolute entry; if that entry is at most <code>tol</code>, the column is free — move to the next column without advancing the row. Otherwise swap it into place, subtract multiples to clear everything below, record the column as a pivot, and advance.</p><p>Return the pivot list as well as the matrix: it is what tells you the rank, which variables are free, and which original columns form a basis of the column space.</p>"
},

B2: {
  statement: "**B2 · Foundation · NumPy — reduce all the way.** Extend it to `rref(A)`: scale each pivot to 1 and clear above as well as below. Verify on random matrices that the result is idempotent to tolerance, and compare against your Lab A implementation.",
  plain: "Normalize each accepted pivot and clear its column in every other row. Verify both the RREF conditions and idempotence. Idempotence alone is insufficient: an ordinary echelon-form algorithm can also be idempotent.",
  solution: "<p>Normalize each accepted pivot to one, then subtract its multiple from every other row. Do not skip a nonzero factor merely because it is small: it may multiply large entries.</p><p>Check that each pivot is one, every other entry in its column is zero to tolerance, pivot positions increase, and zero rows are last. Check idempotence as an additional property. Forward elimination alone can be idempotent, so that test by itself does not establish reduced form. Compare against Lab A at a common tolerance.</p>"
},

B3: {
  statement: "**B3 · Core · NumPy — the complete solution.** Write `solve_complete(A, b)` returning `None` or a particular solution plus a null-space basis. Test it against all three outcomes of section 4.",
  plain: "Reduce the augmented matrix; a pivot in the last column means None; otherwise read the particular solution off the pivot rows and build one null vector per free column.",
  solution: "<p>Augment, reduce, then check the rows beyond the last pivot: any nonzero right-hand side there is the \\(0=c\\) signature, so return <code>None</code>.</p><p>Otherwise set every free variable to zero and read the pivot variables straight off the reduced right-hand side. For the basis, set one free variable to 1 at a time; the pivot entries are the negated coefficients from that free column. Test against a unique case (empty basis), a rank-deficient consistent case, and an inconsistent one.</p>"
},

B4: {
  statement: "**B4 · Core · NumPy — the counting law, measured.** Verify rank–nullity on 200 random matrices of assorted shapes using your own rank and null-space basis, then check each basis vector really satisfies \\(Av\\approx0\\) and that the basis is independent.",
  plain: "len(basis) should equal columns - rank, every A@v should be ~0, and the basis should be independent.",
  solution: "<p>Draw shapes at random, including wide, tall and square, and build some deliberately rank-deficient by repeating a column. For each, assert <code>rank + len(basis) == n_cols</code>, that \\(\\|Av\\|\\) is at machine level for every basis vector, and that stacking the basis gives a matrix of full column rank.</p><p>The third check is the one that catches a subtly wrong construction: a basis can satisfy \\(Av=0\\) and still be dependent, in which case it is too large and the count no longer measures the nullity.</p>"
},

B5: {
  statement: "**B5 · Core · NumPy — factor once, solve many.** Implement `lu(A)` with partial pivoting returning \\(P,L,U\\) and assert \\(PA=LU\\). Time twenty right-hand sides through one factorization against twenty full eliminations and report the ratio.",
  plain: "Factorization is O(n^3) once; each solve is two O(n^2) triangular sweeps, so the ratio approaches 20x on large n.",
  solution: "<p>Store the multipliers in the strictly lower triangle as you clear each column, and record every swap in a permutation. Then \\(PA=LU\\) exactly, up to rounding.</p><p>Timing: one factorization plus twenty forward/back substitutions against twenty full eliminations. For \\(n=500\\) the ratio should be close to twenty; below \\(n\\approx50\\) the overheads dominate and the gap narrows, which is itself worth seeing.</p>"
},

B6: {
  statement: "**B6 · Core · NumPy — where naive elimination dies.** Take \\(\\begin{pmatrix}\\varepsilon&1\\\\1&1\\end{pmatrix}x=(1,2)^T\\) with \\(\\varepsilon=10^{-16}\\). Solve with and without pivoting, compare against the exact solution, and explain the failure in one sentence.",
  plain: "Without pivoting the multiplier is 1/eps ~ 1e16; the exact 1 in the second row is lost to rounding and the first coordinate comes back wrong.",
  solution: "<p>Without pivoting the multiplier is \\(1/\\varepsilon\\approx10^{16}\\). Subtracting \\(10^{16}\\) times the first row swamps the second row's original entries, so they round away entirely; the computed second equation carries no information about the original problem and the first coordinate comes back catastrophically wrong.</p><p>With partial pivoting the rows swap first, the multiplier becomes \\(\\varepsilon\\), and nothing is lost. The system is perfectly well conditioned — this is an algorithm failure, not a problem failure, which is exactly why the swap is not optional.</p>"
},

B7: {
  statement: "**B7 · Stretch · NumPy — rank is a threshold.** Compute the numerical rank of a \\(20\\times20\\) rank-5 product perturbed by noise of size \\(10^{-10}\\) at five tolerances. Plot rank against tolerance and mark where the singular values cluster.",
  plain: "The rank is a step function of the tolerance; the step sits wherever the singular values have a gap.",
  solution: "<p>Take a matrix of true rank \\(k\\), add noise of size \\(10^{-10}\\), and count singular values above each tolerance. The plot is a staircase: flat wherever the tolerance sits inside a gap in the spectrum, dropping wherever it crosses a cluster.</p><p>The moral is that \"the rank\" is a reading of that staircase at a chosen point. When the spectrum has no clear gap, the number you report is a choice; say which tolerance you used, or the claim cannot be reproduced.</p>"
},

B8: {
  statement: "**B8 · Stretch · NumPy — four bases from one reduction.** Reduce \\([A\\mid I_m]\\) while selecting pivots only in the \\(A\\) block, to obtain \\([R\\mid E]\\) with \\(EA=R\\). Build bases for all four fundamental subspaces from this single reduction. Use rows of \\(E\\) corresponding to zero rows of \\(R\\) for the left null space. Verify the four dimensions and prove that the row space and null space meet only at the origin.",
  plain: "Reduce [A|I_m] with pivots only in A to obtain [R|E], EA=R. Use original pivot columns for C(A), nonzero R rows for row space, and R free variables for N(A). Rows of E corresponding to zero R rows form a left-null basis: they annihilate A, are independent because E is invertible, and number m−r. To prove row/null intersection trivial, write z=A^T y, Az=0, hence ||z||²=y^T Az=0.",
  solution: "<p>Apply every row operation to both blocks of \\([A\\mid I_m]\\), selecting pivots only in the A block. The result is \\([R\\mid E]\\), where E is invertible and EA=R. Take pivot columns of the original A for C(A), nonzero rows of R for the row space, and the usual free-variable construction from R for N(A).</p><p>If row i of R is zero, row i of E satisfies \\(E_{i,:}A=0\\); transpose it to obtain a left-null vector. These rows are independent because E is invertible. There are m−r of them, so they form a basis of \\(N(A^T)\\). No second reduction is needed.</p><p>Dimension counts alone do not prove trivial intersection. If \\(z=A^Ty\\) and Az=0, then \\(z^Tz=y^TAz=0\\), hence z=0. This step uses the standard dot product's positivity. Apply the same reasoning to the transpose for the other pair.</p>"
},

C1: {
  statement: "**C1 · Foundation · PyTorch — read the shape first.** Take `nn.Linear(768, 3072)`. Before computing, state the maximum possible rank of its weight, whether \\(Wx=b\\) can have a unique solution, and the nullity if the rank is full. Then verify each with `torch.linalg`.",
  plain: "The weight is 3072x768, so rank <= 768; with 768 columns and full column rank the null space is trivial and solutions are unique when they exist.",
  solution: "<p>PyTorch stores the weight as \\(3072\\times768\\), so the rank is at most \\(\\min(3072,768)=768\\). At full rank the columns are independent, the null space is \\(\\{0\\}\\), and a solution of \\(Wx=b\\) is unique whenever it exists.</p><p>But existence is the rare case: the column space is a 768-dimensional subspace of \\(\\mathbb R^{3072}\\), so almost no \\(b\\) is reachable exactly. Tall and full column rank means uniqueness always, existence almost never — which is precisely the situation least squares was invented for.</p>"
},

C2: {
  statement: "**C2 · Core · PyTorch — what a factored update can reach.** Build \\(\\Delta W=BA\\) with \\(d=k=512\\), \\(r=8\\). Verify \\(\\operatorname{rank}(\\Delta W)\\le8\\) numerically, then describe \\(N(\\Delta W)\\): how many input directions does the adapter leave untouched?",
  plain: "rank(BA) <= 8 by the product bound; the null space has dimension at least 504.",
  solution: "<p>Every column of \\(BA\\) is a combination of the eight columns of \\(B\\), so \\(\\operatorname{rank}(\\Delta W)\\le8\\); generically it is exactly 8. <code>torch.linalg.matrix_rank</code> confirms it, and the singular value plot shows eight nonzero values and a floor at machine precision.</p><p>Rank–nullity in \\(\\mathbb R^{512}\\) gives \\(\\dim N(\\Delta W)\\ge512-8=504\\): the adapter leaves at least 504 independent input directions completely unchanged. That is the honest statement of what a rank-8 update can and cannot touch.</p>"
},

C3: {
  statement: "**C3 · Core · PyTorch — a rank bound that survives training.** For one attention head with \\(d_\\text{head}=64\\) and sequence length 1024, compute the rank of the pre-softmax score matrix \\(QK^{\\mathsf T}\\), explain the bound from section 3, then check whether the rank survives the softmax.",
  plain: "rank(QK^T) <= 64 by the product bound; softmax is nonlinear and applied row-wise, so the result is generally full rank.",
  solution: "<p>\\(Q\\) is \\(1024\\times64\\) and \\(K^{\\mathsf T}\\) is \\(64\\times1024\\), so the product has rank at most 64 no matter how long the sequence. A \\(1024\\times1024\\) score matrix is therefore extremely rank deficient before the softmax.</p><p>After the softmax it is not. Exponentiating and normalising each row is nonlinear, and the numerical rank of the attention matrix typically jumps to full. So \"attention is low rank\" is a claim about the scores, not about the mixing matrix actually applied to the values — a distinction papers are not always careful about.</p>"
},

C4: {
  statement: "**C4 · Core · PyTorch — what a probe cannot see.** With `torch.manual_seed(0)`, draw frozen activations \\(H\\in\\mathbb R^{500\\times16}\\) (`float64`, standard normal) and labels \\(y=\\mathbb 1[h_1>0]\\). Fit a least-squares probe \\(w\\) minimizing \\(\\|Hw-(2y-1)\\|\\) with `torch.linalg.lstsq`. State the nullity of \\(w^{\\mathsf T}\\), form \\(z=e_2-w(w^{\\mathsf T}e_2)/(w^{\\mathsf T}w)\\), replace the first activation \\(h_1\\) by \\(h_1+100z\\), and report \\(w^{\\mathsf T}z\\), \\(\\|100z\\|\\), and the change in that activation's probe output. Write two sentences on what this means for \"the probe found the feature\".",
  plain: "w^T is a 1×16 map of rank 1, so its null space has dimension 15. w^T z is 0 up to rounding (about 1e-17), ||100z|| is close to 100 because w is concentrated on its first coordinate, and the probe output of the edited activation changes only at rounding level (about 1e-14). A flat probe reading constrains one direction out of 16; it cannot distinguish an unchanged representation from one edited heavily inside the 15 directions the probe ignores.",
  solution: "<pre><code>torch.manual_seed(0)\nH = torch.randn(500, 16, dtype=torch.float64)\ny = (H[:, 0] > 0).double()\nw = torch.linalg.lstsq(H, (2 * y - 1).unsqueeze(1)).solution.squeeze(1)\ne2 = torch.zeros(16, dtype=torch.float64); e2[1] = 1\nz = e2 - w * (w @ e2) / (w @ w)\nh_new = H[0] + 100 * z\nprint(w @ z, (100 * z).norm(), (w @ h_new - w @ H[0]).abs())\n</code></pre><p>The probe computes \\(w^{\\mathsf T}h\\), a rank-1 map from \\(\\mathbb R^{16}\\) to \\(\\mathbb R\\), so by rank–nullity its null space \\(\\{x:w^{\\mathsf T}x=0\\}\\) has dimension 15. By construction \\(w^{\\mathsf T}z=w_2-w_2=0\\); numerically it is of order \\(10^{-17}\\). The labels depend only on \\(h_1\\), so \\(w\\) is concentrated on its first entry, \\(w_2\\) is small, and \\(\\|100z\\|\\approx100\\). The edited activation moved by about 100 while its probe output changed only at rounding level (about \\(10^{-14}\\)).</p><p>So a flat probe reading is evidence about one direction out of 16. It cannot distinguish \"the representation did not change\" from \"the representation changed entirely within the 15 directions this probe cannot see\", which limits what \"the probe found the feature\" can mean.</p>"
},

C5: {
  statement: "**C5 · Stretch · PyTorch — conditioning in a regression.** With `torch.manual_seed(0)` and `float64`, draw \\(x,u\\in\\mathbb R^{100}\\) standard normal, set the design \\(A=[\\,x,\\ x+10^{-4}u\\,]\\), and the target \\(b=2x+0.01\\,\\epsilon\\) with \\(\\epsilon\\) standard normal. Using `torch.linalg.lstsq`, report `torch.linalg.cond(A)`, the two coefficients and their sum, and the residual norm. Perturb \\(b\\) by \\(10^{-6}\\) times fresh standard normal noise and report the coefficient change. Re-run with the single-column design \\(A=[\\,x\\,]\\) and compare coefficient stability.",
  plain: "cond(A) is of order 1e4 (about 2e4). The two coefficients are large and of opposite sign (tens in magnitude) while their sum is close to 2, and the residual is about the noise level, near 0.1. A 1e-6 perturbation moves each coefficient by roughly 1e-3, an amplification of about 1e3 to 1e4. With only x, the single coefficient is about 2.000 and moves by about 1e-7 under the same perturbation. The data pin down the sum of the two coefficients, not either one.",
  solution: "<pre><code>torch.manual_seed(0)\nx = torch.randn(100, dtype=torch.float64); u = torch.randn(100, dtype=torch.float64)\nA = torch.stack([x, x + 1e-4 * u], dim=1)\nb = 2 * x + 0.01 * torch.randn(100, dtype=torch.float64)\nc = torch.linalg.lstsq(A, b.unsqueeze(1)).solution.squeeze(1)\nbp = b + 1e-6 * torch.randn(100, dtype=torch.float64)\ncp = torch.linalg.lstsq(A, bp.unsqueeze(1)).solution.squeeze(1)\nprint(torch.linalg.cond(A), c, c.sum(), (A @ c - b).norm(), cp - c)\n</code></pre><p>The columns differ by \\(10^{-4}u\\), so the smallest singular value is about \\(10^{-4}\\|u\\|/\\sqrt2\\) against a largest of about \\(\\sqrt2\\|x\\|\\): \\(\\kappa\\approx2\\times10^4\\). The coefficient difference is fixed by the tiny separating direction, so the 0.01 noise is amplified into coefficients of opposite sign and size in the tens, while their sum stays near 2 and the residual stays near the noise level (about \\(0.01\\sqrt{100}=0.1\\)). The \\(10^{-6}\\) perturbation moves each coefficient by about \\(10^{-3}\\) in the same run, while the fitted values barely change.</p><p>With the single column \\(x\\) the coefficient is about 2.000 and moves by about \\(10^{-7}\\): stability returns at essentially no cost in fit. Individual coefficients are interpretable only when the design is well conditioned, and forming \\(A^{\\mathsf T}A\\) would square \\(\\kappa\\) to about \\(4\\times10^8\\).</p>"
},

C6: {
  statement: "**C6 · Stretch · PyTorch — audit a rank claim.** With `torch.manual_seed(0)` and `float64`, build a stand-in weight \\(W=U\\operatorname{diag}(s)V^{\\mathsf T}+E\\in\\mathbb R^{256\\times256}\\), where \\(U,V\\) are the Q factors of two standard normal \\(256\\times256\\) matrices, \\(s_i=0.9^{\\,i}\\) for \\(i=0,\\dots,255\\), and \\(E\\) has independent \\(\\mathcal N(0,10^{-12})\\) entries (standard deviation \\(10^{-6}\\)). Plot the singular values of \\(W\\) on a log scale, report the numerical rank at absolute tolerances \\(10^{-1}\\), \\(10^{-2}\\), and \\(10^{-10}\\), and report the fraction of squared Frobenius norm discarded by a rank-32 truncation. Say what, if anything, follows about a layer with this weight.",
  plain: "Numerical ranks are 22 at 1e-1, 44 at 1e-2, and 256 at 1e-10 (the noise floor, around 1e-8 to 3e-5, lies above 1e-10). A rank-32 truncation discards about 0.81^32 ≈ 1.2e-3 of the squared Frobenius norm. 'Rank' is therefore a tolerance-dependent report; small tail energy supports a good weight approximation but does not by itself establish downstream functional accuracy.",
  solution: "<pre><code>torch.manual_seed(0)\nU, _ = torch.linalg.qr(torch.randn(256, 256, dtype=torch.float64))\nV, _ = torch.linalg.qr(torch.randn(256, 256, dtype=torch.float64))\ns = 0.9 ** torch.arange(256, dtype=torch.float64)\nW = U @ torch.diag(s) @ V.T + 1e-6 * torch.randn(256, 256, dtype=torch.float64)\nsv = torch.linalg.svdvals(W)\nprint([(sv > t).sum().item() for t in (1e-1, 1e-2, 1e-10)])\nprint((sv[32:] ** 2).sum() / (sv ** 2).sum())\n</code></pre><p>The planted values satisfy \\(0.9^i>0.1\\) for \\(i\\le21\\) and \\(0.9^i>0.01\\) for \\(i\\le43\\), with margins far larger than the noise's spectral norm (about \\(2\\sqrt{256}\\times10^{-6}\\approx3\\times10^{-5}\\)), so the counts are 22 and 44. Below about \\(10^{-5}\\) the spectrum is the noise floor, whose smallest values are still far above \\(10^{-10}\\), so the count there is all 256. The discarded fraction for rank 32 is \\(\\sum_{i\\ge32}0.81^i/\\sum_i0.81^i\\approx0.81^{32}\\approx1.2\\times10^{-3}\\); the noise adds only about \\(6.6\\times10^{-8}\\) to the total squared norm.</p><p>So \"this layer has rank r\" must come with the dtype, method, and threshold: the same matrix reports 22, 44, or 256. Squared Frobenius truncation error equals the sum of the discarded squared singular values (Module 8), so a small tail supports a weight-space approximation claim, but it does not show the discarded directions are unused downstream; that depends on the input activations and later computation.</p>"
},

M1: {
  statement: "**M1 · Foundation · mixed — three shapes, three verdicts.** For a \\(3\\times3\\) system with rank 3, a \\(3\\times5\\) system with rank 3, and a \\(5\\times3\\) system with rank 3, state existence and uniqueness before computing anything, and justify each from rank alone.",
  plain: "Square full rank: exists and unique. Wide full row rank: always exists, never unique. Tall full column rank: unique when it exists, rarely exists.",
  solution: "<p><strong>3×3, rank 3.</strong> Full row and column rank: the columns span \\(\\mathbb R^3\\) and are independent, so every \\(b\\) has exactly one solution.</p><p><strong>3×5, rank 3.</strong> Full row rank, so existence for every \\(b\\); nullity \\(5-3=2\\), so never unique.</p><p><strong>5×3, rank 3.</strong> Full column rank, so nullity 0 and uniqueness whenever a solution exists; but the column space is a 3-dimensional subspace of \\(\\mathbb R^5\\), so existence fails for almost every \\(b\\).</p>"
},

M2: {
  statement: "**M2 · Foundation · mixed — the same matrix twice.** For \\(A=\\begin{pmatrix}1&2&3\\\\2&4&6\\\\3&6&10\\end{pmatrix}\\), find the rank, a basis for each of the four subspaces, and verify both dimension counts.",
  plain: "Rank 2. C(A): (1,2,3),(3,6,10). N(A): (-2,1,0). Row space: (1,2,0),(0,0,1). N(A^T): (2,-1,0).",
  solution: "<p>\\(R_2=2R_1\\) and \\(R_3-3R_1=(0,0,1)\\), so the reduced form has rows \\((1,2,0)\\) and \\((0,0,1)\\): rank 2, pivots in columns 1 and 3.</p><p>\\(C(A)\\): columns 1 and 3 of the original, \\((1,2,3)\\) and \\((3,6,10)\\). \\(N(A)\\): one free column gives \\((-2,1,0)\\). Row space: the two nonzero reduced rows. \\(N(A^{\\mathsf T})\\): \\(2R_1-R_2=0\\) gives \\((2,-1,0)\\).</p><p>Counts: \\(2+1=3\\) columns and \\(2+1=3\\) rows. Both are rank–nullity, applied to \\(A\\) and to \\(A^{\\mathsf T}\\), sharing one rank by Theorem 5.</p>"
},

M3: {
  statement: "**M3 · Core · mixed — a solution set you can draw.** Find the complete solution set of \\(\\begin{pmatrix}1&1&1\\\\1&2&3\\end{pmatrix}x=\\begin{pmatrix}2\\\\5\\end{pmatrix}\\), describe it geometrically, and say which point the free-variable convention selects.",
  plain: "x = (-1,3,0) + t(1,-2,1): a line in R^3. The convention picks the point with the free variable x3 = 0.",
  solution: "<p>\\(R_2-R_1\\) gives \\((0,1,2\\mid3)\\), and clearing upwards gives \\((1,0,-1\\mid-1)\\). So \\(x_1=-1+x_3\\), \\(x_2=3-2x_3\\), with \\(x_3\\) free.</p><p>The complete set is \\((-1,3,0)+x_3(1,-2,1)\\): a line in \\(\\mathbb R^3\\), affine rather than linear since it misses the origin. The free-variable convention selects \\(x_3=0\\), which is a choice of representative, not a distinguished solution — any point on the line would do.</p>"
},

M4: {
  statement: "**M4 · Core · mixed — reachable targets.** For a \\(3\\times2\\) matrix of rank 2, characterise exactly the set of \\(b\\) for which \\(Ax=b\\) is solvable, and connect your answer to the left null space.",
  plain: "Solvable exactly for b in the plane C(A); equivalently for b with y^T b = 0 for the single independent y in N(A^T).",
  solution: "<p>Rank 2 with two columns means the columns are independent and \\(C(A)\\) is a plane through the origin in \\(\\mathbb R^3\\). \\(Ax=b\\) is solvable exactly when \\(b\\) lies in that plane, and then the solution is unique since the nullity is 0.</p><p>The left null space has dimension \\(3-2=1\\). If \\(y\\) spans it then \\(y^{\\mathsf T}A=0\\), so any solvable \\(b=Ax\\) satisfies \\(y^{\\mathsf T}b=0\\); a dimension count shows the converse. So the left null space supplies the single scalar test for reachability — and the geometric reading of that test as \"perpendicular to the plane\" is what the next unit earns.</p>"
},

M5: {
  statement: "**M5 · Core · mixed — the elimination that lies.** Construct a system where exact elimination gives a unique solution but float64 elimination without pivoting returns something badly wrong. Report both answers and the condition number.",
  plain: "Use a tiny leading pivot, e.g. [[1e-16,1],[1,1]]; the problem is well conditioned but the unpivoted algorithm is not backward stable.",
  solution: "<p>Take \\(\\begin{pmatrix}10^{-16}&1\\\\1&1\\end{pmatrix}x=\\begin{pmatrix}1\\\\2\\end{pmatrix}\\). Exactly, \\(x\\approx(1,1)\\). Without pivoting the multiplier is \\(10^{16}\\), the second row's original entries round away, and the computed \\(x_1\\) comes back as 0 or worse.</p><p>\\(\\kappa(A)\\approx2.6\\): the <em>problem</em> is well conditioned. The error is entirely the algorithm's, which is why \"the answer is wrong\" and \"the matrix is ill conditioned\" are separate diagnoses and partial pivoting fixes only the first.</p>"
},

M6: {
  statement: "**M6 · Stretch · mixed — rank claims in a paper.** \"Our layer starts at rank 4, so it can only learn four output directions.\" Give a parameterization under which this is true at every step and one under which it is false after one gradient step.",
  plain: "A stored factorization W=BA of inner dimension 4 enforces rank≤4 at every step, though the image can move. Counterexample for unrestricted weights: P=diag(I4,0), L=||W-I||_F²/d, and a positive gradient step give W1=P+(2η/d)(I-P), full rank. Do not assume every loss gradient is full rank.",
  solution: "<p>A stored factorization \\(W=BA\\) with inner dimension four enforces rank at most four at every step. The subspace may move when B is trained.</p><p>For an unrestricted d×d weight with d&gt;4, choose \\(P=\\operatorname{diag}(I_4,0)\\) and \\(L=\\|W-I\\|_F^2/d\\). One positive gradient step gives \\(W_1=P+(2\\eta/d)(I-P)\\), which is full rank. This explicit counterexample suffices; the stronger claim that every generic loss has a full-rank gradient is unnecessary and can fail for small batches.</p>"
},

M7: {
  statement: "**M7 · Stretch · mixed — probes and null spaces.** A probe reports flat accuracy across a fine-tuning run. Using rank–nullity, state precisely what that does and does not license you to conclude about the representation.",
  plain: "Flat accuracy supports only unchanged aggregate accuracy on the evaluated sample. Even with a fixed nonzero probe, neither scores nor the measured component need be unchanged. For a zero-threshold probe, h→100h preserves predictions while scaling scores by 100. Null-space edits preserve scores, but are only one sufficient explanation, not a consequence of flat accuracy.",
  solution: "<p>For a fixed nonzero w, rank–nullity gives \\(\\dim N(w^T)=d-1\\). Changes in this null space leave scores unchanged. The converse inference from unchanged accuracy is invalid: \\(h\\mapsto100h\\) preserves every zero-threshold prediction while multiplying every score by 100. Even predictions can change while aggregate accuracy stays constant.</p><p>Report only the observed accuracy result. It does not establish unchanged scores, an unchanged component along w, or an unchanged representation. A retrained probe adds another ambiguity because the measurement itself changes.</p>"
},

M8: {
  statement: "**M8 · Stretch · mixed — the geometry you have not earned.** Someone draws the four subspaces with right angles between them. State what extra structure that picture assumes, which two orthogonality claims it is making, and what in this unit does *not* depend on them.",
  plain: "The standard four-subspace diagram uses Euclidean inner products and asserts N(A)⊥C(A^T), N(A^T)⊥C(A). For general metrics the relevant operator is the metric adjoint. Rank, nullities, consistency, uniqueness and affine solution structure do not require an inner product. Row covectors must not be confused with input vectors under general coordinate changes.",
  solution: "<p>The diagram assumes the standard Euclidean inner products and asserts \\(N(A)\\perp C(A^T)\\) and \\(N(A^T)\\perp C(A)\\). Module 1 previewed inner products; Module 3 develops these orthogonal-complement theorems. Other metrics require their corresponding adjoint.</p><p>Rank, the four dimensions, consistency, uniqueness, and \\(x_p+N(A)\\) do not require an inner product. Coordinates must be handled consistently: a fixed geometry survives a passive basis change if its metric transforms too, whereas a raw dot product of the new lists generally changes it. Rows intrinsically belong to the dual space, so their identification with input vectors is not canonical.</p>"
},

K1: {
  statement: "**K1 · Checkpoint · gate — rank, without the word matrix.** Explain what the rank of \\(A\\) measures without using the word \"matrix\", then state the two questions about \\(Ax=b\\) it answers and how.",
  plain: "Rank is the number of independent directions the list of columns reaches.",
  solution: "<p>Rank is the dimension of the span of the columns — the number of genuinely independent directions the list of vectors reaches, after redundancy is discarded. Equivalently, by Theorem 5, the same count for the rows.</p><p>Existence: \\(Ax=b\\) is solvable for every \\(b\\in\\mathbb R^m\\) exactly when the rank equals \\(m\\), because that is when the columns span the whole output space. Uniqueness: solutions are unique exactly when the rank equals \\(n\\), because that is when the columns are independent and the null space is trivial.</p>"
},

K2: {
  statement: "**K2 · Checkpoint · gate — all four, computed.** For \\(A=\\begin{pmatrix}1&2&3\\\\2&4&6\\\\3&6&10\\end{pmatrix}\\) give the rank, a basis for each of the four fundamental subspaces, and verify both dimension counts.",
  plain: "Same as the cumulative problem: rank 2; C(A)=(1,2,3),(3,6,10); N(A)=(-2,1,0); row space (1,2,0),(0,0,1); N(A^T)=(2,-1,0).",
  solution: "<p>Rank 2, since \\(R_2=2R_1\\) while \\(R_3\\) is independent of \\(R_1\\). Pivots in columns 1 and 3.</p><p>\\(C(A)=\\operatorname{span}\\{(1,2,3),(3,6,10)\\}\\); \\(N(A)=\\operatorname{span}\\{(-2,1,0)\\}\\); row space \\(=\\operatorname{span}\\{(1,2,0),(0,0,1)\\}\\); \\(N(A^{\\mathsf T})=\\operatorname{span}\\{(2,-1,0)\\}\\). Counts: \\(2+1=3\\) columns, \\(2+1=3\\) rows.</p>"
},

K3: {
  statement: "**K3 · Checkpoint · gate — the structure of solutions.** Prove that the solution set of \\(Ax=b\\) is either empty or an affine set of dimension \\(\\dim N(A)\\). Say where your proof uses linearity.",
  plain: "Theorem 6 plus the definition of affine; linearity is used in both inclusions.",
  solution: "<p>If no solution exists the set is empty. Otherwise fix \\(x_p\\) with \\(Ax_p=b\\). Then \\(A(x_p+n)=b\\) for every \\(n\\in N(A)\\) — this uses additivity and the fact that \\(An=0\\) — and conversely any solution \\(x\\) gives \\(A(x-x_p)=0\\), so \\(x-x_p\\in N(A)\\).</p><p>Hence the set is \\(x_p+N(A)\\), a translate of a subspace, so affine of dimension \\(\\dim N(A)\\). Linearity is used exactly twice, once per inclusion; without it neither step survives.</p>"
},

K4: {
  statement: "**K4 · Checkpoint · gate — before seeing the entries.** A system has 5 equations and 8 unknowns. What can you say for certain about existence and uniqueness before seeing a single entry, and what can you *not* say?",
  plain: "Certain: never unique, since nullity >= 3. Not certain: whether a solution exists at all.",
  solution: "<p>Certain: the rank is at most 5, so rank–nullity gives \\(\\dim N(A)\\ge8-5=3\\). The null space is nontrivial, so <em>if</em> a solution exists there are infinitely many — a solution is never unique.</p><p>Not certain: existence. Full row rank would give a solution for every \\(b\\), but the rank could be less, in which case the column space is a proper subspace of \\(\\mathbb R^5\\) and some \\(b\\) are unreachable. \"More unknowns than equations\" bounds uniqueness, never existence.</p>"
},

K5: {
  statement: "**K5 · Checkpoint · gate — collapse in two pictures.** Describe precisely what happens in the row picture and in the column picture as the matrix becomes singular, first with \\(b\\) in the column space and then with \\(b\\) outside it.",
  plain: "Rows: lines become parallel — coincident if b is in the span, distinct if not. Columns: arrows become collinear; b on that line gives infinitely many solutions, off it none.",
  solution: "<p><strong>Row picture.</strong> The two lines approach parallel. If \\(b\\) stays in the column space they become the same line at the limit — every point on it solves the system. If not, they become parallel and distinct and never meet.</p><p><strong>Column picture.</strong> The two column arrows become collinear, so the column space collapses from the plane to a line. If \\(b\\) lies on that line there are infinitely many recipes for it — the difference between any two is a null vector. If \\(b\\) is off the line, no combination reaches it.</p><p>Just before the limit both pictures still report a unique solution, sitting at a point that moves enormously under a small perturbation. That is conditioning, not singularity.</p>"
},

K6: {
  statement: "**K6 · Checkpoint · gate — a reproducible rank claim.** Someone reports that a \\(768\\times768\\) weight matrix \"has rank 400\". State what else they must report for that to be reproducible, and what it would and would not imply about the layer's capacity.",
  plain: "Report whether rank is exact or numerical, plus data precision, method, and threshold. At an absolute singular-value threshold τ, numerical rank 400 bounds rank-400 truncation error by τ in operator norm and sqrt(368)τ in Frobenius norm; these bounds need not be small relative to the matrix. Exact rank 400 implies image dimension 400 and nullity 368. Neither statement alone establishes downstream capacity.",
  solution: "<p>Ask whether 400 is an exact rank or a numerical estimate. Exact rational data admit exact-rank computation; rounded learned weights are usually assessed numerically. Report the matrix, precision, method, threshold rule, and spectrum near the cutoff.</p><p>If exactly 400 singular values exceed an absolute threshold τ, the other 368 are at most τ. The rank-400 truncation has operator-norm error at most τ and Frobenius error at most \\(\\sqrt{368}\\tau\\). Whether those errors are small depends on scale and the total spectrum. Exact rank 400 instead means a 400-dimensional image and a 368-dimensional kernel. Neither result alone determines useful features, downstream accuracy, or a nonlinear network's capacity.</p>"
},
M9: {
  "statement": "**M9 · Stretch · mixed — Pivot growth and backward error.** For A=diag(1,10⁻⁸), b=(1,10⁻⁸), and x̂=(1,0), calculate the infinity-norm residual and explain why it understates solution error.",
  "plain": "The exact solution is (1,1). The residual infinity norm is 10⁻⁸ but the solution error infinity norm is one. The backward indicator is 10⁻⁸/(1+1)=5×10⁻⁹. Ill-conditioning permits small backward error and large forward error.",
  "solution": "<p>The exact solution is (1,1). The residual infinity norm is 10⁻⁸ but the solution error infinity norm is one. The backward indicator is 10⁻⁸/(1+1)=5×10⁻⁹. Ill-conditioning permits small backward error and large forward error.</p>",
  "fields": [
    {
      "id": "audit",
      "label": "Numerical result(s), in requested order",
      "type": "num",
      "ans": 1e-08
    }
  ],
  "hints": {
    "audit": "Use the concrete matrix in the question and keep the numerical diagnostic separate from the exact algebraic claim."
  }
}
});
