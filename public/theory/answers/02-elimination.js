/* Answers, checks and reference solutions for Linear Algebra Module 2 —
   systems, elimination, rank, and the four fundamental subspaces. */
GU.answers("02-elimination", {

A1: {
  statement: "Solve x+2y+z=4, 2x+3y-z=3, 3x+5y=7 by elimination. Give rank A and rank of the augmented matrix.",
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
  statement: "For (a) three coefficient columns with two pivots and no pivot in the RHS, (b) a row [0 0 0 | 5], (c) a 4x4 coefficient matrix with four pivots: how many solutions?",
  fields: [
    { id: "a", label: "case (a)", type: "choice", opts: ["none", "exactly one", "infinitely many"], ans: "infinitely many" },
    { id: "b", label: "case (b)", type: "choice", opts: ["none", "exactly one", "infinitely many"], ans: "none" },
    { id: "c", label: "case (c)", type: "choice", opts: ["none", "exactly one", "infinitely many"], ans: "exactly one" }
  ],
  plain: "(a) infinitely many — one free column; (b) none — 0 = 5; (c) exactly one.",
  solution: "<p>(a) Consistent, and three columns with two pivots leaves one free column, so the solution set is a one-dimensional affine set.</p><p>(b) That row reads \\(0=5\\). A pivot in the right-hand column is exactly the signature of inconsistency: \\(b\\) is outside the column space.</p><p>(c) Four pivots in four columns leaves no free variable, so the null space is trivial and the solution is unique.</p>"
},

A3: {
  statement: "Find the complete solution set of x1+2x2+3x3=6 in R^3 as x_p + N(A), with an explicit null-space basis, and name the object.",
  fields: [
    { id: "r", label: "rank", type: "num", ans: 1 },
    { id: "n", label: "nullity", type: "num", ans: 2 },
    { id: "shape", label: "the solution set is a", type: "choice", opts: ["point", "line", "plane", "all of R³"], ans: "plane" }
  ],
  plain: "x_p=(6,0,0); N(A)=span{(-2,1,0),(-3,0,1)}; an affine plane.",
  solution: "<p>One equation, one pivot: rank 1, and with three columns rank–nullity gives nullity 2.</p><p>Setting the free variables to zero gives \\(x_p=(6,0,0)\\). Setting \\(x_2=1,x_3=0\\) gives \\((-2,1,0)\\); setting \\(x_2=0,x_3=1\\) gives \\((-3,0,1)\\). The complete set is \\((6,0,0)+\\operatorname{span}\\{(-2,1,0),(-3,0,1)\\}\\): a plane, but an affine one — it misses the origin, so it is not a subspace.</p>"
},

A4: {
  statement: "For A = [[1,2,3],[2,4,6],[1,1,1]] give the rank, a basis for C(A), a basis for N(A), and verify rank-nullity.",
  fields: [
    { id: "r", label: "rank", type: "num", ans: 2 },
    { id: "n", label: "dim N(A)", type: "num", ans: 1 }
  ],
  hints: { r: "Look at rows 1 and 2 before eliminating." },
  plain: "Rank 2; C(A) basis (1,2,1),(2,4,1); N(A) basis (1,-2,1); 2+1=3.",
  solution: "<p>\\(R_2=2R_1\\), so elimination leaves two nonzero rows and the rank is 2. The pivots sit in columns 1 and 2, so the first two columns of the <em>original</em> matrix, \\((1,2,1)\\) and \\((2,4,1)\\), are a basis of \\(C(A)\\).</p><p>For the null space, \\(x+2y+3z=0\\) and \\(x+y+z=0\\) give \\(y=-2z\\) and \\(x=z\\), so \\(N(A)=\\operatorname{span}\\{(1,-2,1)\\}\\). Rank–nullity: \\(2+1=3\\), the number of columns.</p>"
},

A5: {
  statement: "For which k does [[1,2],[3,k]] x = (1,5) have no solution, one solution, infinitely many?",
  fields: [
    { id: "unique", label: "unique for every k except", type: "num", ans: 6 },
    { id: "inf", label: "values of k giving infinitely many", type: "choice", opts: ["none", "k=6", "every k"], ans: "none" }
  ],
  hints: { inf: "Infinitely many needs the columns dependent AND b in their span. Check the second condition." },
  plain: "k != 6 unique; k = 6 no solution; infinitely many never happens for this b.",
  solution: "<p>\\(\\det=k-6\\). For \\(k\\ne6\\) the columns are independent, so there is exactly one solution.</p><p>At \\(k=6\\), \\(R_2-3R_1\\) gives \\([0\\ 0\\mid 2]\\): inconsistent, no solution. Infinitely many would need the columns dependent <em>and</em> \\(b\\) inside their span, which would require the right-hand side \\((1,3)\\) rather than \\((1,5)\\). Two conditions, not one.</p>"
},

A6: {
  statement: "Give a 3x4 matrix whose null space is exactly span{(1,-1,0,0),(0,0,1,-1)}, or prove none exists. What must its rank be?",
  fields: [
    { id: "r", label: "the rank must be", type: "num", ans: 2 }
  ],
  plain: "Rank 2 by rank-nullity; e.g. rows (1,1,0,0), (0,0,1,1), (0,0,0,0).",
  solution: "<p>The prescribed null space has dimension 2 and the matrix has four columns, so rank–nullity forces rank \\(4-2=2\\). A \\(3\\times4\\) matrix can have rank 2, so nothing is ruled out.</p><p>Take rows \\((1,1,0,0)\\), \\((0,0,1,1)\\) and a zero row. Each generator is killed by both rows, and the two rows are independent so the rank is exactly 2 — which by rank–nullity means the null space is exactly two-dimensional, hence exactly the span given.</p>"
},

A7: {
  statement: "Prove Theorem 6 in both directions and deduce the trichotomy: zero, one, or infinitely many solutions, never exactly two.",
  plain: "Both inclusions are one line each; two distinct solutions give a nonzero null vector, whose whole line can be added.",
  solution: "<p>If \\(n\\in N(A)\\) then \\(A(x_p+n)=Ax_p+An=b+0=b\\), so \\(x_p+N(A)\\subseteq\\) the solution set. Conversely, if \\(Ax=b\\) then \\(A(x-x_p)=b-b=0\\), so \\(x-x_p\\in N(A)\\) and \\(x\\in x_p+N(A)\\). Both steps use linearity, and nothing else.</p><p>Trichotomy: if there are two distinct solutions \\(x_1\\ne x_2\\) then \\(n=x_1-x_2\\) is a nonzero null vector, so \\(x_1+tn\\) solves the system for every real \\(t\\) — infinitely many. Hence the count is 0, 1, or infinite; \"exactly two\" is impossible because the null space is closed under scaling.</p>"
},

A8: {
  statement: "Prove that each of the three row operations leaves the solution set unchanged, and say exactly where reversibility is used.",
  plain: "Each operation maps solutions to solutions; reversibility gives the other inclusion.",
  solution: "<p>Each operation replaces the equations by linear combinations of them, so any \\(x\\) satisfying the old system satisfies the new one: solutions are preserved forwards for all three.</p><p>The converse needs reversibility. A swap is its own inverse; scaling by \\(c\\ne0\\) is undone by \\(1/c\\); adding \\(cR_i\\) to \\(R_j\\) is undone by adding \\(-cR_i\\). Since the inverse operation is itself a row operation, it also preserves solutions forwards, giving the reverse inclusion. Scaling by \\(0\\) has no inverse — and indeed it can enlarge the solution set, which is why it is excluded.</p>"
},

A9: {
  statement: "Prove rank-nullity from the echelon form, being explicit about independence and spanning of the constructed null-space basis.",
  plain: "Each column is a pivot column or a free column; the free-variable construction gives one independent null vector per free column, and they span.",
  solution: "<p>Reduce \\(A\\). Every one of the \\(n\\) columns is either a pivot column or a free column, so \\(\\#\\text{pivots}+\\#\\text{free}=n\\), and \\(\\#\\text{pivots}=\\operatorname{rank}A\\).</p><p>For each free column build \\(v_j\\) by setting that free variable to 1, the other free variables to 0, and solving for the pivot variables. <em>Independent:</em> \\(v_j\\) has a 1 in free position \\(j\\) where every other \\(v_i\\) has 0, so a vanishing combination forces each coefficient to vanish in turn. <em>Spanning:</em> given any \\(x\\in N(A)\\), subtract \\(\\sum_j x_{f_j}v_j\\); the result is a null vector with every free variable zero, and the reduced equations then force the pivot variables to zero too. So \\(\\dim N(A)=\\#\\text{free}\\) and the counts add to \\(n\\).</p>"
},

A10: {
  statement: "Prove rank(AB) <= min(rank A, rank B), then give matrices where rank(AB) is strictly less than both.",
  plain: "Columns of AB lie in C(A); rows of AB lie in the row space of B. Take A=[[1,0],[0,0]] and B=[[0,0],[0,1]].",
  solution: "<p>Each column of \\(AB\\) is \\(A\\) applied to a column of \\(B\\), hence lies in \\(C(A)\\); so \\(C(AB)\\subseteq C(A)\\) and \\(\\operatorname{rank}(AB)\\le\\operatorname{rank}(A)\\). Each row of \\(AB\\) is a combination of rows of \\(B\\), so the row space of \\(AB\\) sits inside that of \\(B\\), and by Theorem 5 \\(\\operatorname{rank}(AB)\\le\\operatorname{rank}(B)\\).</p><p>Strictness: \\(A=\\begin{pmatrix}1&0\\\\0&0\\end{pmatrix}\\), \\(B=\\begin{pmatrix}0&0\\\\0&1\\end{pmatrix}\\) both have rank 1, but \\(AB=0\\) has rank 0. \\(A\\) keeps only the first coordinate and \\(B\\) produces only the second, so the image of \\(B\\) sits entirely inside the null space of \\(A\\).</p>"
},

A11: {
  statement: "Prove row operations change the column space but preserve dependency relations among the columns; explain the pivot-column recipe.",
  plain: "Row operations are left multiplication by an invertible E: Ac = 0 iff EAc = 0. The relations are identical, the spaces are not.",
  solution: "<p>A row operation is left multiplication by an invertible matrix \\(E\\). For any coefficient vector \\(c\\), \\((EA)c=E(Ac)\\), and since \\(E\\) is invertible, \\((EA)c=0\\) exactly when \\(Ac=0\\). The dependency relations among the columns are therefore identical before and after.</p><p>The column <em>space</em> is not: \\(C(EA)=E\\,C(A)\\), a different subspace in general. So you may read <em>which</em> columns are pivot columns off the echelon form — that is a statement about relations — but the basis vectors themselves must be taken from the original matrix, whose column space is the one you wanted.</p>"
},

A12: {
  statement: "A in R^{3x5} has rank 3. Give the four subspace dimensions, say for which b the system is solvable, and with how many solutions.",
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
  statement: "Implement eliminate(A, tol) with partial pivoting, returning the echelon form and pivot columns.",
  plain: "Walk the columns; for each, take the largest-magnitude candidate at or below the current row as pivot, swap it up, and clear below.",
  solution: "<p>Keep a current row index. For each column, find the row at or below it with the largest absolute entry; if that entry is at most <code>tol</code>, the column is free — move to the next column without advancing the row. Otherwise swap it into place, subtract multiples to clear everything below, record the column as a pivot, and advance.</p><p>Return the pivot list as well as the matrix: it is what tells you the rank, which variables are free, and which original columns form a basis of the column space.</p>"
},

B2: {
  statement: "Extend to rref(A): scale each pivot to 1 and clear above as well as below; check idempotence.",
  plain: "After the forward sweep, normalise each pivot row and eliminate upwards. rref(rref(A)) == rref(A) because the reduced form is unique.",
  solution: "<p>Forward-eliminate as in B1, then for each pivot row divide by the pivot and subtract multiples of it from every <em>other</em> row, not just those below.</p><p>Idempotence is a real test rather than a tautology: it fails immediately if you clear only downwards, or if you normalise before clearing and let rounding drift. Compare against your Lab A implementation on random inputs — they compute the same unique object, so they must agree to tolerance.</p>"
},

B3: {
  statement: "Write solve_complete(A, b) returning None or a particular solution plus a null-space basis; test all three outcomes.",
  plain: "Reduce the augmented matrix; a pivot in the last column means None; otherwise read the particular solution off the pivot rows and build one null vector per free column.",
  solution: "<p>Augment, reduce, then check the rows beyond the last pivot: any nonzero right-hand side there is the \\(0=c\\) signature, so return <code>None</code>.</p><p>Otherwise set every free variable to zero and read the pivot variables straight off the reduced right-hand side. For the basis, set one free variable to 1 at a time; the pivot entries are the negated coefficients from that free column. Test against a unique case (empty basis), a rank-deficient consistent case, and an inconsistent one.</p>"
},

B4: {
  statement: "Verify rank-nullity on 200 random matrices using your own rank and null-space basis, and check the basis.",
  plain: "len(basis) should equal columns - rank, every A@v should be ~0, and the basis should be independent.",
  solution: "<p>Draw shapes at random, including wide, tall and square, and build some deliberately rank-deficient by repeating a column. For each, assert <code>rank + len(basis) == n_cols</code>, that \\(\\|Av\\|\\) is at machine level for every basis vector, and that stacking the basis gives a matrix of full column rank.</p><p>The third check is the one that catches a subtly wrong construction: a basis can satisfy \\(Av=0\\) and still be dependent, in which case it is too large and the count no longer measures the nullity.</p>"
},

B5: {
  statement: "Implement lu(A) with partial pivoting, assert PA = LU, and time 20 right-hand sides against 20 eliminations.",
  plain: "Factorization is O(n^3) once; each solve is two O(n^2) triangular sweeps, so the ratio approaches 20x on large n.",
  solution: "<p>Store the multipliers in the strictly lower triangle as you clear each column, and record every swap in a permutation. Then \\(PA=LU\\) exactly, up to rounding.</p><p>Timing: one factorization plus twenty forward/back substitutions against twenty full eliminations. For \\(n=500\\) the ratio should be close to twenty; below \\(n\\approx50\\) the overheads dominate and the gap narrows, which is itself worth seeing.</p>"
},

B6: {
  statement: "Solve [[eps,1],[1,1]] x = b with eps = 1e-16, with and without pivoting, and explain the failure.",
  plain: "Without pivoting the multiplier is 1/eps ~ 1e16; the exact 1 in the second row is lost to rounding and the first coordinate comes back wrong.",
  solution: "<p>Without pivoting the multiplier is \\(1/\\varepsilon\\approx10^{16}\\). Subtracting \\(10^{16}\\) times the first row swamps the second row's original entries, so they round away entirely; the computed second equation carries no information about the original problem and the first coordinate comes back catastrophically wrong.</p><p>With partial pivoting the rows swap first, the multiplier becomes \\(\\varepsilon\\), and nothing is lost. The system is perfectly well conditioned — this is an algorithm failure, not a problem failure, which is exactly why the swap is not optional.</p>"
},

B7: {
  statement: "Compute numerical rank of a noisy 20x20 matrix at five tolerances and plot rank against tolerance.",
  plain: "The rank is a step function of the tolerance; the step sits wherever the singular values have a gap.",
  solution: "<p>Take a matrix of true rank \\(k\\), add noise of size \\(10^{-10}\\), and count singular values above each tolerance. The plot is a staircase: flat wherever the tolerance sits inside a gap in the spectrum, dropping wherever it crosses a cluster.</p><p>The moral is that \"the rank\" is a reading of that staircase at a chosen point. When the spectrum has no clear gap, the number you report is a choice; say which tolerance you used, or the claim cannot be reproduced.</p>"
},

B8: {
  statement: "Build bases for all four subspaces from one RREF and verify the four dimensions.",
  plain: "Pivot columns of the original A for C(A); nonzero rows of the RREF for the row space; free-variable vectors for N(A); the same construction on A^T for the left null space.",
  solution: "<p>From one reduction you get the pivot columns — take those columns of the <em>original</em> \\(A\\) for \\(C(A)\\) — and the nonzero reduced rows, which are a basis of the row space. The free-variable construction gives \\(N(A)\\). Repeat on \\(A^{\\mathsf T}\\) for \\(N(A^{\\mathsf T})\\).</p><p>Check the dimensions against \\(r,\\ n-r,\\ r,\\ m-r\\). That the row space and null space meet only at the origin follows from the counts, not from any angle: their dimensions sum to \\(n\\) and their intersection is trivial. Perpendicularity is a separate claim that needs an inner product.</p>"
},

C1: {
  statement: "For nn.Linear(768,3072), state max rank, whether Wx=b can be unique, and the nullity at full rank; then verify.",
  plain: "The weight is 3072x768, so rank <= 768; with 768 columns and full column rank the null space is trivial and solutions are unique when they exist.",
  solution: "<p>PyTorch stores the weight as \\(3072\\times768\\), so the rank is at most \\(\\min(3072,768)=768\\). At full rank the columns are independent, the null space is \\(\\{0\\}\\), and a solution of \\(Wx=b\\) is unique whenever it exists.</p><p>But existence is the rare case: the column space is a 768-dimensional subspace of \\(\\mathbb R^{3072}\\), so almost no \\(b\\) is reachable exactly. Tall and full column rank means uniqueness always, existence almost never — which is precisely the situation least squares was invented for.</p>"
},

C2: {
  statement: "Build dW = B A with d=k=512, r=8. Verify rank <= 8 and describe N(dW).",
  plain: "rank(BA) <= 8 by the product bound; the null space has dimension at least 504.",
  solution: "<p>Every column of \\(BA\\) is a combination of the eight columns of \\(B\\), so \\(\\operatorname{rank}(\\Delta W)\\le8\\); generically it is exactly 8. <code>torch.linalg.matrix_rank</code> confirms it, and the singular value plot shows eight nonzero values and a floor at machine precision.</p><p>Rank–nullity in \\(\\mathbb R^{512}\\) gives \\(\\dim N(\\Delta W)\\ge512-8=504\\): the adapter leaves at least 504 independent input directions completely unchanged. That is the honest statement of what a rank-8 update can and cannot touch.</p>"
},

C3: {
  statement: "Compute the rank of QK^T for d_head=64, sequence 1024, explain the bound, and check whether it survives softmax.",
  plain: "rank(QK^T) <= 64 by the product bound; softmax is nonlinear and applied row-wise, so the result is generally full rank.",
  solution: "<p>\\(Q\\) is \\(1024\\times64\\) and \\(K^{\\mathsf T}\\) is \\(64\\times1024\\), so the product has rank at most 64 no matter how long the sequence. A \\(1024\\times1024\\) score matrix is therefore extremely rank deficient before the softmax.</p><p>After the softmax it is not. Exponentiating and normalising each row is nonlinear, and the numerical rank of the attention matrix typically jumps to full. So \"attention is low rank\" is a claim about the scores, not about the mixing matrix actually applied to the values — a distinction papers are not always careful about.</p>"
},

C4: {
  statement: "Train a linear probe, find a null-space direction, add a large multiple of it to an activation, and confirm the output is unchanged.",
  plain: "The null space of w^T is a hyperplane of dimension d-1; any edit inside it is invisible to the probe by construction.",
  solution: "<p>The probe computes \\(w^{\\mathsf T}h\\). Its null space is \\(\\{x:w^{\\mathsf T}x=0\\}\\), of dimension \\(d-1\\). Take a random \\(x\\), subtract its component along \\(w\\), and add any multiple of the result to \\(h\\): the probe output is unchanged to machine precision, however large the multiple.</p><p>So a flat probe reading is evidence about one direction out of \\(d\\). It cannot distinguish \"the representation did not change\" from \"the representation changed entirely within the 767 directions this probe cannot see\".</p>"
},

C5: {
  statement: "Fit least squares with two near-duplicate columns; report the condition number and the coefficients before and after a 1e-6 perturbation.",
  plain: "Near-duplicate columns make the design nearly rank deficient; coefficients swing wildly while the fit barely moves.",
  solution: "<p>With columns \\(a\\) and \\(a+\\delta\\), the design is nearly rank deficient and \\(\\kappa\\) is large. A \\(10^{-6}\\) perturbation of the data can flip the sign of both coefficients while leaving the residual essentially unchanged: the data pins down their <em>sum</em>, not either one.</p><p>Dropping one column restores stability at no cost in fit. The lesson is that individual coefficients are only interpretable when the design is well conditioned, and that forming \\(A^{\\mathsf T}A\\) squares the problem.</p>"
},

C6: {
  statement: "Plot the singular values of a trained weight on a log scale and give the numerical rank at three tolerances.",
  plain: "Usually there is no clean gap: the rank you report is a function of the threshold, and a heavy tail is not the same as low rank.",
  solution: "<p>Trained weights rarely show a clean gap; the spectrum decays smoothly, so the numerical rank moves steadily as the tolerance changes. Report all three numbers and the thresholds, not one number.</p><p>What follows about the layer is less than people usually claim: a decaying spectrum says a low-rank approximation would lose little in Frobenius norm, not that the layer's function is low rank, and certainly not that the discarded directions are unused by the network.</p>"
},

M1: {
  statement: "For 3x3 rank 3, 3x5 rank 3, and 5x3 rank 3: state existence and uniqueness from rank alone.",
  plain: "Square full rank: exists and unique. Wide full row rank: always exists, never unique. Tall full column rank: unique when it exists, rarely exists.",
  solution: "<p><strong>3×3, rank 3.</strong> Full row and column rank: the columns span \\(\\mathbb R^3\\) and are independent, so every \\(b\\) has exactly one solution.</p><p><strong>3×5, rank 3.</strong> Full row rank, so existence for every \\(b\\); nullity \\(5-3=2\\), so never unique.</p><p><strong>5×3, rank 3.</strong> Full column rank, so nullity 0 and uniqueness whenever a solution exists; but the column space is a 3-dimensional subspace of \\(\\mathbb R^5\\), so existence fails for almost every \\(b\\).</p>"
},

M2: {
  statement: "For A = [[1,2,3],[2,4,6],[3,6,10]] find the rank and a basis for each of the four subspaces; verify both dimension counts.",
  plain: "Rank 2. C(A): (1,2,3),(3,6,10). N(A): (-2,1,0). Row space: (1,2,0),(0,0,1). N(A^T): (2,-1,0).",
  solution: "<p>\\(R_2=2R_1\\) and \\(R_3-3R_1=(0,0,1)\\), so the reduced form has rows \\((1,2,0)\\) and \\((0,0,1)\\): rank 2, pivots in columns 1 and 3.</p><p>\\(C(A)\\): columns 1 and 3 of the original, \\((1,2,3)\\) and \\((3,6,10)\\). \\(N(A)\\): one free column gives \\((-2,1,0)\\). Row space: the two nonzero reduced rows. \\(N(A^{\\mathsf T})\\): \\(2R_1-R_2=0\\) gives \\((2,-1,0)\\).</p><p>Counts: \\(2+1=3\\) columns and \\(2+1=3\\) rows. Both are rank–nullity, applied to \\(A\\) and to \\(A^{\\mathsf T}\\), sharing one rank by Theorem 5.</p>"
},

M3: {
  statement: "Find the complete solution set of [[1,1,1],[1,2,3]] x = (2,5), describe it geometrically, and say which point the convention picks.",
  plain: "x = (-1,3,0) + t(1,-2,1): a line in R^3. The convention picks the point with the free variable x3 = 0.",
  solution: "<p>\\(R_2-R_1\\) gives \\((0,1,2\\mid3)\\), and clearing upwards gives \\((1,0,-1\\mid-1)\\). So \\(x_1=-1+x_3\\), \\(x_2=3-2x_3\\), with \\(x_3\\) free.</p><p>The complete set is \\((-1,3,0)+x_3(1,-2,1)\\): a line in \\(\\mathbb R^3\\), affine rather than linear since it misses the origin. The free-variable convention selects \\(x_3=0\\), which is a choice of representative, not a distinguished solution — any point on the line would do.</p>"
},

M4: {
  statement: "For a 3x2 matrix of rank 2, characterise the b for which Ax=b is solvable, and connect it to the left null space.",
  plain: "Solvable exactly for b in the plane C(A); equivalently for b with y^T b = 0 for the single independent y in N(A^T).",
  solution: "<p>Rank 2 with two columns means the columns are independent and \\(C(A)\\) is a plane through the origin in \\(\\mathbb R^3\\). \\(Ax=b\\) is solvable exactly when \\(b\\) lies in that plane, and then the solution is unique since the nullity is 0.</p><p>The left null space has dimension \\(3-2=1\\). If \\(y\\) spans it then \\(y^{\\mathsf T}A=0\\), so any solvable \\(b=Ax\\) satisfies \\(y^{\\mathsf T}b=0\\); a dimension count shows the converse. So the left null space supplies the single scalar test for reachability — and the geometric reading of that test as \"perpendicular to the plane\" is what the next unit earns.</p>"
},

M5: {
  statement: "Construct a system where exact elimination is unique but float64 elimination without pivoting is badly wrong; report both and the condition number.",
  plain: "Use a tiny leading pivot, e.g. [[1e-16,1],[1,1]]; the problem is well conditioned but the unpivoted algorithm is not backward stable.",
  solution: "<p>Take \\(\\begin{pmatrix}10^{-16}&1\\\\1&1\\end{pmatrix}x=\\begin{pmatrix}1\\\\2\\end{pmatrix}\\). Exactly, \\(x\\approx(1,1)\\). Without pivoting the multiplier is \\(10^{16}\\), the second row's original entries round away, and the computed \\(x_1\\) comes back as 0 or worse.</p><p>\\(\\kappa(A)\\approx2.6\\): the <em>problem</em> is well conditioned. The error is entirely the algorithm's, which is why \"the answer is wrong\" and \"the matrix is ill conditioned\" are separate diagnoses and partial pivoting fixes only the first.</p>"
},

M6: {
  statement: "\"Our layer starts at rank 4, so it can only learn four output directions.\" Give a parameterization where this holds at every step and one where it fails after one step.",
  plain: "True if the layer is stored as a product with inner dimension 4; false if it is a full weight merely initialised at rank 4.",
  solution: "<p><strong>True:</strong> store the layer as \\(W=BA\\) with \\(B\\in\\mathbb R^{d\\times4}\\). Gradient descent updates \\(B\\) and \\(A\\), and the product has rank at most 4 at every step — the constraint is structural.</p><p><strong>False:</strong> store a full \\(W\\) and merely initialise it at rank 4. The gradient of a generic loss is full rank, so after one step \\(W\\) is full rank. Initialisation constrains the starting point, not the reachable set. The claim is about the parameterization, and stating it without naming which one is what makes it wrong.</p>"
},

M7: {
  statement: "A probe reports flat accuracy across fine-tuning. Using rank-nullity, state what that does and does not license.",
  plain: "It licenses a statement about one direction; it does not license any claim about the other d-1.",
  solution: "<p>A probe \\(w\\) reads a single linear functional. Rank–nullity gives \\(\\dim N(w^{\\mathsf T})=d-1\\), so all but one direction of change are invisible to it. Flat accuracy licenses: the component of the representation along \\(w\\) is roughly unchanged in the way the probe measures.</p><p>It does not license: that the representation is unchanged, that the feature is absent, or that fine-tuning did nothing. A rewrite confined to the null space produces exactly the same reading. To say more you need either many probes spanning more directions, or a measurement that is not a single linear functional.</p>"
},

M8: {
  statement: "Someone draws the four subspaces with right angles. What structure does that assume, which two claims is it making, and what here does not depend on them?",
  plain: "It assumes an inner product; the claims are N(A) perp row space and N(A^T) perp C(A). Rank, dimensions, rank-nullity and the solution structure do not depend on them.",
  solution: "<p>Right angles require an inner product — a choice of geometry that nothing in this unit supplied. The picture is asserting two things: \\(N(A)\\perp C(A^{\\mathsf T})\\) in \\(\\mathbb R^n\\) and \\(N(A^{\\mathsf T})\\perp C(A)\\) in \\(\\mathbb R^m\\), both true for the standard inner product and both proved in the next unit.</p><p>Independent of them: the rank, all four dimensions, Theorem 5, rank–nullity, the trichotomy, and \\(x_p+N(A)\\). Those survive any invertible change of coordinates, while the right angles do not — a distinction worth keeping when the coordinates came out of training rather than a textbook.</p>"
},

K1: {
  statement: "Explain what rank measures without using the word matrix, then state the two questions about Ax=b it answers.",
  plain: "Rank is the number of independent directions the list of columns reaches.",
  solution: "<p>Rank is the dimension of the span of the columns — the number of genuinely independent directions the list of vectors reaches, after redundancy is discarded. Equivalently, by Theorem 5, the same count for the rows.</p><p>Existence: \\(Ax=b\\) is solvable for every \\(b\\in\\mathbb R^m\\) exactly when the rank equals \\(m\\), because that is when the columns span the whole output space. Uniqueness: solutions are unique exactly when the rank equals \\(n\\), because that is when the columns are independent and the null space is trivial.</p>"
},

K2: {
  statement: "For A = [[1,2,3],[2,4,6],[3,6,10]] give the rank, a basis for each of the four subspaces, and verify both counts.",
  plain: "Same as the cumulative problem: rank 2; C(A)=(1,2,3),(3,6,10); N(A)=(-2,1,0); row space (1,2,0),(0,0,1); N(A^T)=(2,-1,0).",
  solution: "<p>Rank 2, since \\(R_2=2R_1\\) while \\(R_3\\) is independent of \\(R_1\\). Pivots in columns 1 and 3.</p><p>\\(C(A)=\\operatorname{span}\\{(1,2,3),(3,6,10)\\}\\); \\(N(A)=\\operatorname{span}\\{(-2,1,0)\\}\\); row space \\(=\\operatorname{span}\\{(1,2,0),(0,0,1)\\}\\); \\(N(A^{\\mathsf T})=\\operatorname{span}\\{(2,-1,0)\\}\\). Counts: \\(2+1=3\\) columns, \\(2+1=3\\) rows.</p>"
},

K3: {
  statement: "Prove the solution set of Ax=b is either empty or an affine set of dimension dim N(A), and say where linearity is used.",
  plain: "Theorem 6 plus the definition of affine; linearity is used in both inclusions.",
  solution: "<p>If no solution exists the set is empty. Otherwise fix \\(x_p\\) with \\(Ax_p=b\\). Then \\(A(x_p+n)=b\\) for every \\(n\\in N(A)\\) — this uses additivity and the fact that \\(An=0\\) — and conversely any solution \\(x\\) gives \\(A(x-x_p)=0\\), so \\(x-x_p\\in N(A)\\).</p><p>Hence the set is \\(x_p+N(A)\\), a translate of a subspace, so affine of dimension \\(\\dim N(A)\\). Linearity is used exactly twice, once per inclusion; without it neither step survives.</p>"
},

K4: {
  statement: "5 equations, 8 unknowns. What is certain about existence and uniqueness before seeing any entry, and what is not?",
  plain: "Certain: never unique, since nullity >= 3. Not certain: whether a solution exists at all.",
  solution: "<p>Certain: the rank is at most 5, so rank–nullity gives \\(\\dim N(A)\\ge8-5=3\\). The null space is nontrivial, so <em>if</em> a solution exists there are infinitely many — a solution is never unique.</p><p>Not certain: existence. Full row rank would give a solution for every \\(b\\), but the rank could be less, in which case the column space is a proper subspace of \\(\\mathbb R^5\\) and some \\(b\\) are unreachable. \"More unknowns than equations\" bounds uniqueness, never existence.</p>"
},

K5: {
  statement: "Describe what happens in the row picture and the column picture as the matrix becomes singular, with b inside and outside the column space.",
  plain: "Rows: lines become parallel — coincident if b is in the span, distinct if not. Columns: arrows become collinear; b on that line gives infinitely many solutions, off it none.",
  solution: "<p><strong>Row picture.</strong> The two lines approach parallel. If \\(b\\) stays in the column space they become the same line at the limit — every point on it solves the system. If not, they become parallel and distinct and never meet.</p><p><strong>Column picture.</strong> The two column arrows become collinear, so the column space collapses from the plane to a line. If \\(b\\) lies on that line there are infinitely many recipes for it — the difference between any two is a null vector. If \\(b\\) is off the line, no combination reaches it.</p><p>Just before the limit both pictures still report a unique solution, sitting at a point that moves enormously under a small perturbation. That is conditioning, not singularity.</p>"
},

K6: {
  statement: "\"A 768x768 weight matrix has rank 400.\" What else must be reported, and what does it imply about capacity?",
  plain: "The tolerance (and how the spectrum behaves near it). It implies a Frobenius-norm approximation claim, not a claim about the layer's function.",
  solution: "<p>Missing: the tolerance, the method (singular values against what threshold), and ideally the spectrum near it. Exact rank is not computable in floating point, so \"rank 400\" without a threshold is not reproducible — the same matrix can read 380 or 450 at defensible tolerances.</p><p>What it would imply: the map's image is well approximated by a 400-dimensional subspace, so roughly 368 input directions are nearly annihilated and a low-rank factorization would lose little in Frobenius norm. What it would not imply: that the layer's contribution to the network is 400-dimensional in any functional sense, that the discarded directions are unused downstream, or anything at all about a nonlinear network's capacity.</p>"
}

});
