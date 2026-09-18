---
id: math.linear-algebra.linear-maps-rank
title: The elimination workbench — systems, rank and the four subspaces
prerequisites: [math.linear-algebra.vectors-spaces-bases]
estimated_hours: 28
answers: 02-elimination
---

# The elimination workbench — systems, rank and the four subspaces

Two questions — does a solution exist, and is it unique — turn out to be the span and independence questions of the previous unit wearing different clothes. One algorithm answers both, and the answer is four subspaces.

## 0. Where this is going

The previous unit asked what a pile of arrows can reach. This one asks the same question backwards: given a target \(b\), *which* combination of the columns produces it, and is there more than one answer?

| Question about \(Ax=b\) | The idea it really is | Answered by |
|---|---|---|
| **Existence** — is there any solution? | Is \(b\in\operatorname{span}\{\text{columns of }A\}\)? | No pivot in the augmented column |
| **Uniqueness** — is there only one? | Are the columns of \(A\) independent? | No free columns |

Everything below is machinery for reading those two answers off one computation. By the end you should be able to look at a shape — \(A\in\mathbb R^{768\times3072}\), say — and state before computing anything that \(Ax=b\) is solvable for every \(b\) when the rank is full, and that its solution is *never* unique. Both are corollaries of one identity you will prove: \(\operatorname{rank}+\operatorname{nullity}=n\).

**How to work through this.** Work the elimination bench in section 2 by hand before pressing *full RREF* — the point is to feel which column becomes free and why. Each teaching section ends with three practice prompts. The exercise bank in sections 10–14 carries the same header on every item — identifier, difficulty, and the tools it expects — with a checker underneath: type what can be typed, have a written argument marked, and open the reference solution once you have attempted it. The checkpoint in section 15 is the gate.

## 1. Three ways to read \(Ax\)

A matrix is not a grid of numbers with a multiplication rule attached. It is a list of vectors, and \(Ax\) is the one operation the previous unit spent its whole length on.

**Reading 1 — a combination of the columns.** If \(A=[\,a_1\ a_2\ \cdots\ a_n\,]\) then

$$
Ax = x_1a_1 + x_2a_2 + \dots + x_na_n .
$$

\(Ax\) *is* a linear combination of the columns with \(x\) as the coefficients. So \(Ax=b\) asks: what recipe builds \(b\) out of the columns? This is the reading to default to.

**Reading 2 — rows against \(x\).** The \(i\)-th entry of \(Ax\) is row \(i\) dotted with \(x\), so \(Ax=b\) is \(m\) scalar equations, each saying "\(x\) lies on this hyperplane". This is the intersecting-lines picture from school. It is correct, it scales badly in the head, and it hides the span question entirely.

**Reading 3 — a map.** \(A\) is a function \(\mathbb R^n\to\mathbb R^m\) satisfying \(A(u+v)=Au+Av\) and \(A(cu)=cAu\). Those two rules are the whole definition of **linear**, and every matrix fact downstream is a consequence of them. Note the asymmetry: \(n\) columns living in \(\mathbb R^m\), so input and output are different spaces.

**The habit to build.** When you meet \(Wh\) in a paper, read it as *a combination of \(W\)'s columns weighted by \(h\)*, not as "a matrix multiply". Every claim about what a layer can represent is a claim about the span of those columns.

> **Practice — Foundation:** Write \(Ax\) for \(A=\begin{pmatrix}1&2\\3&4\end{pmatrix}\), \(x=(5,-1)\) as a combination of columns and as two row equations.
>
> **Practice — Core:** Show from the two linearity rules alone that \(A0=0\), and that the image of a subspace is a subspace.
>
> **Practice — Stretch:** Give a map \(\mathbb R^2\to\mathbb R^2\) satisfying \(T(cu)=cT(u)\) for all scalars but failing additivity, and say which reading of \(Ax\) it breaks.

## 2. Elimination: the only algorithm here

Three operations on the rows leave the solution set completely unchanged:

1. **Swap** two rows.
2. **Scale** a row by a nonzero constant.
3. **Add** a multiple of one row to another.

Each is reversible, which is exactly why the solution set survives: anything the new system admits, the old one admits too. Gaussian elimination is these three moves applied with a purpose — clear the entries below each pivot, left to right.

A matrix is in **row echelon form** when every nonzero row starts further right than the one above it. The first nonzero entry of a row is its **pivot**; a column holding a pivot is a **pivot column** and every other column is a **free column**, whose variable is a **free variable**. Scaling each pivot to 1 and clearing *above* as well as below gives **reduced** row echelon form, which is unique for a given matrix — a fact worth pausing on, since the sequence of operations that gets you there is not.

Work the bench below by hand: choose a row operation, apply it, and watch the pivots appear. The verdict panel updates after every move — read it only after you have predicted it.

```lab
la-elim
```

**What the pivots are telling you.** The number of pivots is the rank. Pivot columns add something new to the span; free columns are the ones already reachable. A pivot in the *right-hand* column is the signature of \(0=1\): the system is inconsistent and \(b\) lies outside the span of the columns.

> **Practice — Foundation:** Apply one row operation of each kind to a \(2\times3\) system and confirm the solution set is unchanged.
>
> **Practice — Core:** Explain why scaling a row by zero is not permitted, in terms of reversibility rather than convention.
>
> **Practice — Stretch:** Reduce a matrix two different ways to reduced row echelon form and argue from uniqueness that the pivot columns cannot differ.

## 3. Rank is one number that answers both questions

Elimination hands you a count, and that count is the most important integer attached to a matrix.

The **rank** \(r\) of \(A\) is the number of pivots in any echelon form. Equivalently — and this is the content, not the definition — \(r\) is the dimension of the span of the columns, and also the dimension of the span of the rows.

**Theorem 5 — row rank equals column rank.** For any \(A\in\mathbb R^{m\times n}\), the column span and the row span have the same dimension.

*Why.* Row operations are reversible combinations of rows, so the row span never changes, and the nonzero rows of the echelon form are visibly independent — each starts at a different column. Meanwhile the pivot columns of the original matrix are independent, and every free column is a combination of the pivot columns to its left, so the pivot columns are a basis of the column span. Both counts equal the number of pivots.

This is a genuinely surprising theorem: the two spans live in different spaces, \(\mathbb R^m\) and \(\mathbb R^n\). It is doing real work every time someone says "the rank" without saying which one.

Consequences worth instant recall, for \(A\in\mathbb R^{m\times n}\):

- \(r\le\min(m,n)\); full rank means equality.
- \(r=n\) (*full column rank*) \(\iff\) the columns are independent \(\iff\) a solution, when it exists, is unique.
- \(r=m\) (*full row rank*) \(\iff\) the columns span \(\mathbb R^m\) \(\iff\) a solution exists for every \(b\).
- If \(n>m\), full column rank is impossible — the pigeonhole theorem of the previous unit, restated.

### Why this matters for ML

\(\operatorname{rank}(AB)\le\min(\operatorname{rank}A,\operatorname{rank}B)\): rank cannot be created by multiplication. That one inequality is the whole story of low-rank adaptation — \(\Delta W=BA\) with inner dimension \(r\) has rank at most \(r\), so the update reaches only a low-dimensional slice of the possible updates. It is also why an attention head's pre-softmax score matrix \(QK^{\mathsf T}\) has rank at most \(d_\text{head}\) however long the sequence, and why stacking two linear layers with nothing between them buys no expressiveness.

> **Practice — Foundation:** State the largest possible rank of a \(4\times7\) matrix and what full rank would mean for solvability.
>
> **Practice — Core:** Prove \(\operatorname{rank}(AB)\le\operatorname{rank}(B)\) using the column reading of \(Ax\).
>
> **Practice — Stretch:** Construct \(A,B\) with \(\operatorname{rank}(AB)\) strictly less than both ranks, and say what collapsed.

## 4. Existence, uniqueness, and exactly three outcomes

A linear system has no solution, exactly one, or infinitely many — never two. If \(x_1\) and \(x_2\) both solve \(Ax=b\) then \(A(x_1-x_2)=0\), and every multiple of that difference can be added to a solution to make another. One extra solution forces a whole line of them.

| Echelon form shows | Outcome | Solution set |
|---|---|---|
| Pivot in the right-hand column | No solution | Empty — \(b\notin C(A)\) |
| No pivot in the right-hand column, no free columns | Exactly one | A point |
| No pivot in the right-hand column, \(f\) free columns | Infinitely many | An \(f\)-dimensional affine set |

The lab below draws the same \(2\times2\) system twice. The **row picture** is two lines whose intersection is the solution; the **column picture** asks which combination of two arrows reaches \(b\). Drag until the lines are parallel and watch what each picture says: in one the lines miss, in the other the arrows are collinear and \(b\) is off their line.

```lab
la-picture
```

**The trap in the row picture.** Two nearly parallel lines still intersect, at a point that moves enormously when either line twitches. Nothing looks wrong — there is a unique solution and the algebra is valid — and the answer can still be numerically worthless. Section 8 names that failure.

> **Practice — Foundation:** Give a \(2\times2\) system with no solution and one with infinitely many, and identify the echelon signature of each.
>
> **Practice — Core:** Prove the trichotomy from linearity, being explicit about where you use \(A(x_1-x_2)=0\).
>
> **Practice — Stretch:** For \(A\in\mathbb R^{3\times5}\) of rank 3, describe the solution set of \(Ax=b\) for every \(b\), and say why "overdetermined" and "underdetermined" are statements about rank rather than shape.

## 5. The complete solution: one particular, plus a subspace

Solve the homogeneous system first; it carries the structure.

The **null space** of \(A\) is \(N(A)=\{x\in\mathbb R^n : Ax=0\}\). It is a subspace of \(\mathbb R^n\) — it contains \(0\) and is closed under addition and scaling because \(A\) is linear — and its dimension is the **nullity**.

**Theorem 6 — the structure of every solution set.** If \(Ax_p=b\) has any solution, the complete set of solutions is

$$
\{x_p+n : n\in N(A)\} = x_p + N(A).
$$

*Why.* Both directions in one line each. \(A(x_p+n)=b+0=b\); and if \(Ax=b\) then \(A(x-x_p)=0\), so \(x=x_p+n\) with \(n\in N(A)\).

So the solution set is an **affine set** of dimension equal to the nullity, and the system is uniquely solvable exactly when \(N(A)=\{0\}\).

**Reading the null space off the echelon form.** The recipe is mechanical and worth doing by hand a few times: set one free variable to 1 and the rest to 0, back-substitute for the pivot variables, and you have one null-space basis vector. Repeat for each free variable. You get exactly \(f\) vectors, they are independent by construction — each has a 1 where the others have 0 — and they span \(N(A)\).

**Theorem 7 — rank–nullity.** For \(A\in\mathbb R^{m\times n}\),

$$
\operatorname{rank}(A)+\dim N(A)=n .
$$

*Why.* Every column is either a pivot column or a free column; there are \(n\) of them; pivots count the rank and free columns count the null-space basis just constructed. The theorem is a counting argument wearing a suit.

Read it as a conservation law: the \(n\) input dimensions are split between what the map preserves and what it destroys. Nothing you do to \(A\) changes that total — you can only move dimensions from one side to the other.

### Why this matters for ML

A linear probe \(w^{\mathsf T}h\) has an enormous null space: in \(\mathbb R^{768}\), 767 dimensions of activation change are invisible to it. "The probe's accuracy did not move" is therefore not evidence that the representation did not move; it is evidence about one direction out of 768. Rank–nullity is the precise statement of how much a measurement is not seeing.

> **Practice — Foundation:** For \(A=\begin{pmatrix}1&2\\2&4\end{pmatrix}\), find \(N(A)\) and check rank–nullity.
>
> **Practice — Core:** Prove both directions of Theorem 6 and identify where linearity is used in each.
>
> **Practice — Stretch:** Explain why the null-space basis read off the echelon form is independent without computing a determinant.

## 6. The four fundamental subspaces

One matrix, four subspaces, two in each space. Everything later is bookkeeping about these.

| Subspace | Definition | Lives in | Dimension |
|---|---|---|---|
| Column space \(C(A)\) | span of the columns; all reachable \(Ax\) | \(\mathbb R^m\) | \(r\) |
| Null space \(N(A)\) | all \(x\) with \(Ax=0\) | \(\mathbb R^n\) | \(n-r\) |
| Row space \(C(A^{\mathsf T})\) | span of the rows | \(\mathbb R^n\) | \(r\) |
| Left null space \(N(A^{\mathsf T})\) | all \(y\) with \(A^{\mathsf T}y=0\) | \(\mathbb R^m\) | \(m-r\) |

The two dimension counts are rank–nullity applied to \(A\) and to \(A^{\mathsf T}\), sharing the same \(r\) by Theorem 5. The input space \(\mathbb R^n\) splits into row space and null space; the output space \(\mathbb R^m\) splits into column space and left null space. *Splits* is doing real work there — the pieces meet only at \(0\) and their dimensions add up — but the fact that they are also *perpendicular* needs an inner product, which the next unit supplies. Do not accept the four-subspace diagram with right angles in it before then.

The lab below is the \(2\times2\) case, where all of it is visible at once. Drag the columns of \(A\) and watch the unit square map to a parallelogram; collapse the columns onto one line and the column space drops to a line while the null space appears as the inputs crushed to the origin.

```lab
la-map
```

**The determinant as a volume.** The area of that parallelogram is \(|\det A|\), and its sign says whether orientation flipped. Zero area is exactly rank deficiency — the collapse of the previous unit, now happening to a map instead of a span. Determinants get their own treatment later; for now treat \(|\det|\) as an area factor and nothing more.

> **Practice — Foundation:** For a \(3\times5\) matrix of rank 2, give the dimension of all four subspaces.
>
> **Practice — Core:** Show that \(C(A)\) is a subspace of \(\mathbb R^m\) directly from the column reading of \(Ax\).
>
> **Practice — Stretch:** Construct a matrix whose left null space is nontrivial and explain what that says about which \(b\) are reachable.

## 7. What is deliberately still missing

Notice what was not claimed. Nothing above said the null space is perpendicular to the row space, measured an angle, or used a dot product. Pivots, rank, the four subspaces, rank–nullity and the complete solution set are pure vector-space structure, invariant under any invertible change of coordinates.

The next unit adds the inner product and the picture gains right angles — \(N(A)\perp C(A^{\mathsf T})\) and \(N(A^{\mathsf T})\perp C(A)\) — which is what makes least squares work. Keeping the two layers separate is worth real effort: it tells you which results survive when the geometry changes, and in a network whose coordinates come from training, the geometry is not given.

> **Practice — Foundation:** State which quantities in this unit would change if every vector were re-expressed in a skewed basis.
>
> **Practice — Core:** Give a change of coordinates that preserves rank but destroys an orthogonality relation you might have assumed.
>
> **Practice — Stretch:** Explain why "these two features are orthogonal" is a measurement while "rank is 4" is a theorem, and what each would need to be reproducible.

## 8. Elimination on a real machine

Everything above is exact arithmetic. Floating point changes the algorithm, not the theory.

**LU: elimination, remembered.** Record the multipliers used to clear each column and elimination factors the matrix as \(A=LU\), or \(PA=LU\) with row swaps. The point is reuse: factoring costs \(O(n^3)\), but each new right-hand side then costs \(O(n^2)\) by forward and back substitution. Solving \(Ax=b\) for twenty right-hand sides should never cost twenty eliminations.

**Partial pivoting is not optional.** Textbook elimination divides by whatever sits in the pivot position. If that entry is tiny the multipliers are huge and rounding error in them swamps the answer. Always swapping in the largest available entry in the column keeps every multiplier at most 1 in magnitude, which is why a library solver is trustworthy and a naive hand-written elimination is not.

**Rank is not a computable property.** Exact rank asks whether a number is exactly zero, and in floating point almost nothing is exactly zero. Every library computes *numerical rank*: the number of singular values above a tolerance. Rank therefore depends on a threshold you chose, and the same matrix can be rank 5 and rank 7 on the same day. Report the tolerance or the claim is not reproducible.

**Conditioning.** The condition number \(\kappa(A)\) bounds how much a relative error in \(b\) is amplified in \(x\). At \(\kappa\approx10^{8}\) you have lost roughly half your digits in float32 — which is why nobody forms the normal equations \(A^{\mathsf T}A\) if they can avoid it, since that squares the condition number, and why near-duplicate features destabilise training.

> **Practice — Foundation:** Count the operations in one elimination and in one triangular solve, and state the ratio for twenty right-hand sides.
>
> **Practice — Core:** Explain why partial pivoting bounds the multipliers by 1, and what that bounds in the error.
>
> **Practice — Stretch:** Construct a matrix whose numerical rank changes with the tolerance and state what you would report about it.

## 9. Runnable labs

Three coding exercises run in this page's Python workspace, each as its own tab, using the standard library only.

### Lab A — reduced row echelon form

Implement **row_echelon** in [labs/exercises.py](../../labs/exercises.py). Return the reduced row echelon form together with the pivot columns, treating any candidate pivot at or below the tolerance as zero. Reduced form is unique, so your output is fully determined by the input.

Run:

~~~text
python -m labs.checks echelon
~~~

The checks cover a rank-deficient square system, a diagonal matrix, a leading zero column, the all-zero matrix, idempotence of the reduction, a pivot below the tolerance, input preservation, and ragged or non-finite input.

### Lab B — the complete solution set

Implement **solve_complete** in [labs/exercises.py](../../labs/exercises.py). Return `None` when the system is inconsistent, otherwise a particular solution with free variables set to zero and a basis of the null space, one vector per free column. This is Theorem 6 made executable, and its output length is Theorem 7.

Run:

~~~text
python -m labs.checks solve-complete
~~~

The checks cover a consistent rank-deficient system, an inconsistent one, a unique solution with an empty basis, a wide system with two free variables, independence of the returned basis, the homogeneous case, input preservation, and mismatched shapes.

### Lab C — LU with partial pivoting

Implement **lu_factor** in [labs/exercises.py](../../labs/exercises.py). Return the permutation, a unit lower triangular \(L\) whose multipliers are at most 1 in magnitude, and an upper triangular \(U\) with \(PA=LU\).

Run:

~~~text
python -m labs.checks lu
~~~

The checks cover a matrix needing a swap on the first column, a three-by-three case, the tiny-pivot matrix that breaks naive elimination, a singular matrix, the identity, input preservation, and non-square or non-finite input.

### Guided experiment

1. Eliminate a \(3\times4\) system by hand, then confirm your echelon form against Lab A.
2. Verify rank–nullity on twenty random matrices of assorted shapes using your own rank and null-space basis.
3. Solve one system with twenty right-hand sides, once per elimination and once from a single LU, and report the ratio of times.
4. Solve \(\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix}x=b\) with and without pivoting for \(\varepsilon=10^{-16}\) and compare against the exact answer.
5. Compute numerical rank of a noisy matrix at five tolerances and plot rank against tolerance.
6. Build bases for all four subspaces from one reduction and check the four dimensions against \(r,\ n-r,\ r,\ m-r\).

## 10. Exercises · by hand

Eliminate by hand and keep the record of moves; a bare answer with no row operations behind it teaches nothing.

**A1 · Foundation · paper — solve and classify.** Solve \(x+2y+z=4\), \(2x+3y-z=3\), \(3x+5y=7\) by elimination, showing every row operation. Then give the rank of the coefficient matrix and of the augmented matrix.

**A2 · Foundation · paper — read the echelon form.** For each case state the number of solutions and the reason: (a) three coefficient columns, two pivots, no pivot in the right-hand column; (b) a row reading \([0\ 0\ 0\mid5]\); (c) a \(4\times4\) coefficient matrix with four pivots.

**A3 · Foundation · paper — a plane as a solution set.** Find the complete solution set of \(x_1+2x_2+3x_3=6\) in \(\mathbb R^3\). Write it as \(x_p+N(A)\) with an explicit null-space basis, and name the geometric object.

**A4 · Foundation · paper — all four subspaces.** For \(A=\begin{pmatrix}1&2&3\\2&4&6\\1&1&1\end{pmatrix}\) compute the rank, a basis for \(C(A)\), a basis for \(N(A)\), and verify rank–nullity.

**A5 · Foundation · paper — a parameter decides.** For which \(k\) does \(\begin{pmatrix}1&2\\3&k\end{pmatrix}x=\begin{pmatrix}1\\5\end{pmatrix}\) have no solution, one solution, infinitely many? Draw the row picture in each case.

**A6 · Core · paper — build to order.** Give a \(3\times4\) matrix whose null space is exactly \(\operatorname{span}\{(1,-1,0,0),(0,0,1,-1)\}\), or prove none exists. What must its rank be?

**A7 · Core · paper — the structure theorem.** Prove Theorem 6 in both directions, then use it to prove the trichotomy: zero, one, or infinitely many solutions, never exactly two.

**A8 · Core · paper — why row operations are safe.** Prove that each of the three row operations leaves the solution set unchanged. Say exactly where reversibility is used.

**A9 · Core · paper — counting, carefully.** Prove rank–nullity from the echelon form, being explicit about why the constructed null-space vectors are independent and why they span.

**A10 · Core · paper — rank under multiplication.** Prove \(\operatorname{rank}(AB)\le\min(\operatorname{rank}A,\operatorname{rank}B)\), then exhibit matrices where the rank of the product is strictly smaller than both.

**A11 · Stretch · paper — which columns are the basis.** Prove that row operations change the column space but never the dependency relations among the columns. Explain why that makes "find the pivot columns in the echelon form, then take those columns of the *original* matrix" correct.

**A12 · Stretch · paper — read the shape.** \(A\in\mathbb R^{3\times5}\) has rank 3. Give the dimension of all four subspaces, say for which \(b\) the system is solvable, and with how many solutions each.

## 11. Exercises · NumPy

No `np.linalg.solve` and no `matrix_rank` until a problem says to compare against them.

**B1 · Foundation · NumPy — forward elimination.** Implement `eliminate(A, tol=1e-9)` with partial pivoting, returning the echelon form and the pivot columns. Swap in the largest-magnitude entry before clearing each column.

**B2 · Foundation · NumPy — reduce all the way.** Extend it to `rref(A)`: scale each pivot to 1 and clear above as well as below. Verify on random matrices that the result is idempotent to tolerance, and compare against your Lab A implementation.

**B3 · Core · NumPy — the complete solution.** Write `solve_complete(A, b)` returning `None` or a particular solution plus a null-space basis. Test it against all three outcomes of section 4.

**B4 · Core · NumPy — the counting law, measured.** Verify rank–nullity on 200 random matrices of assorted shapes using your own rank and null-space basis, then check each basis vector really satisfies \(Av\approx0\) and that the basis is independent.

**B5 · Core · NumPy — factor once, solve many.** Implement `lu(A)` with partial pivoting returning \(P,L,U\) and assert \(PA=LU\). Time twenty right-hand sides through one factorization against twenty full eliminations and report the ratio.

**B6 · Core · NumPy — where naive elimination dies.** Take \(\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix}\) with \(\varepsilon=10^{-16}\). Solve with and without pivoting, compare against the exact solution, and explain the failure in one sentence.

**B7 · Stretch · NumPy — rank is a threshold.** Compute the numerical rank of a random \(20\times20\) matrix perturbed by noise of size \(10^{-10}\) at five tolerances. Plot rank against tolerance and mark where the singular values cluster.

**B8 · Stretch · NumPy — four bases from one reduction.** Build bases for all four fundamental subspaces from a single reduced row echelon computation, verify the four dimensions, and check numerically that the row space and null space meet only at the origin.

## 12. Exercises · PyTorch

**C1 · Foundation · PyTorch — read the shape first.** Take `nn.Linear(768, 3072)`. Before computing, state the maximum possible rank of its weight, whether \(Wx=b\) can have a unique solution, and the nullity if the rank is full. Then verify each with `torch.linalg`.

**C2 · Core · PyTorch — what a factored update can reach.** Build \(\Delta W=BA\) with \(d=k=512\), \(r=8\). Verify \(\operatorname{rank}(\Delta W)\le8\) numerically, then describe \(N(\Delta W)\): how many input directions does the adapter leave untouched?

**C3 · Core · PyTorch — a rank bound that survives training.** For one attention head with \(d_\text{head}=64\) and sequence length 1024, compute the rank of the pre-softmax score matrix \(QK^{\mathsf T}\), explain the bound from section 3, then check whether the rank survives the softmax.

**C4 · Core · PyTorch — what a probe cannot see.** Train a linear probe on frozen activations, find a direction in its null space, add a large multiple of it to an activation, and confirm the probe output is unchanged. Write two sentences on what this means for "the probe found the feature".

**C5 · Stretch · PyTorch — conditioning in a regression.** Fit least squares on a design matrix with two near-duplicate columns. Report the condition number, the coefficients, and the coefficients after a \(10^{-6}\) perturbation of the data. Re-run with one column dropped and compare stability.

**C6 · Stretch · PyTorch — audit a rank claim.** Take a trained weight matrix, plot its singular values on a log scale, and state the numerical rank at three tolerances. Say what, if anything, follows about the layer.

## 13. Derivations to own

1. Show that each of the three row operations is reversible, and deduce that the solution set is preserved.
2. Prove that reduced row echelon form is unique.
3. Prove that the pivot columns of the original matrix are a basis of its column space.
4. Prove that the nonzero rows of an echelon form are a basis of the row space.
5. Prove Theorem 5, row rank equals column rank, from 3 and 4.
6. Prove that \(N(A)\) is a subspace directly from linearity.
7. Prove Theorem 6, that the solution set is \(x_p+N(A)\), in both directions.
8. Derive the free-variable construction of a null-space basis and prove it is independent and spanning.
9. Prove Theorem 7, rank–nullity, by counting pivot and free columns.
10. Deduce the four subspace dimensions from Theorems 5 and 7.
11. Prove \(\operatorname{rank}(AB)\le\min(\operatorname{rank}A,\operatorname{rank}B)\).
12. Show that \(A\) is invertible exactly when it is square with \(N(A)=\{0\}\).
13. Derive \(PA=LU\) from elimination with row swaps, identifying what \(L\) stores.
14. Show that partial pivoting bounds every multiplier by 1 in magnitude, and say what that bounds in the computed solution.

## 14. Exercises · cumulative

These mix the ideas rather than repeating one track, and carry the same header and checker as the exercises above.

**M1 · Foundation · mixed — three shapes, three verdicts.** For a \(3\times3\) system with rank 3, a \(3\times5\) system with rank 3, and a \(5\times3\) system with rank 3, state existence and uniqueness before computing anything, and justify each from rank alone.

**M2 · Foundation · mixed — the same matrix twice.** For \(A=\begin{pmatrix}1&2&3\\2&4&6\\3&6&10\end{pmatrix}\), find the rank, a basis for each of the four subspaces, and verify both dimension counts.

**M3 · Core · mixed — a solution set you can draw.** Find the complete solution set of \(\begin{pmatrix}1&1&1\\1&2&3\end{pmatrix}x=\begin{pmatrix}2\\5\end{pmatrix}\), describe it geometrically, and say which point the free-variable convention selects.

**M4 · Core · mixed — reachable targets.** For a \(3\times2\) matrix of rank 2, characterise exactly the set of \(b\) for which \(Ax=b\) is solvable, and connect your answer to the left null space.

**M5 · Core · mixed — the elimination that lies.** Construct a system where exact elimination gives a unique solution but float64 elimination without pivoting returns something badly wrong. Report both answers and the condition number.

**M6 · Stretch · mixed — rank claims in a paper.** "Our layer starts at rank 4, so it can only learn four output directions." Give a parameterization under which this is true at every step and one under which it is false after one gradient step.

**M7 · Stretch · mixed — probes and null spaces.** A probe reports flat accuracy across a fine-tuning run. Using rank–nullity, state precisely what that does and does not license you to conclude about the representation.

**M8 · Stretch · mixed — the geometry you have not earned.** Someone draws the four subspaces with right angles between them. State what extra structure that picture assumes, which two orthogonality claims it is making, and what in this unit does *not* depend on them.

## 15. Checkpoint

Answer all six before opening the next unit. Bring the written attempts, not just the answers.

**K1 · Checkpoint · gate — rank, without the word matrix.** Explain what the rank of \(A\) measures without using the word "matrix", then state the two questions about \(Ax=b\) it answers and how.

**K2 · Checkpoint · gate — all four, computed.** For \(A=\begin{pmatrix}1&2&3\\2&4&6\\3&6&10\end{pmatrix}\) give the rank, a basis for each of the four fundamental subspaces, and verify both dimension counts.

**K3 · Checkpoint · gate — the structure of solutions.** Prove that the solution set of \(Ax=b\) is either empty or an affine set of dimension \(\dim N(A)\). Say where your proof uses linearity.

**K4 · Checkpoint · gate — before seeing the entries.** A system has 5 equations and 8 unknowns. What can you say for certain about existence and uniqueness before seeing a single entry, and what can you *not* say?

**K5 · Checkpoint · gate — collapse in two pictures.** Describe precisely what happens in the row picture and in the column picture as the matrix becomes singular, first with \(b\) in the column space and then with \(b\) outside it.

**K6 · Checkpoint · gate — a reproducible rank claim.** Someone reports that a \(768\times768\) weight matrix "has rank 400". State what else they must report for that to be reproducible, and what it would and would not imply about the layer's capacity.

## Mastery check

Read \(Ax\) as a combination of columns without translating; eliminate by hand and name the pivot and free columns; state what rank measures and derive both consequences for existence and uniqueness; produce the complete solution set as a particular solution plus a null-space basis and verify rank–nullity; give all four fundamental subspaces with their dimensions and resist attributing orthogonality to them before it is earned; and explain why numerical rank is a statement about a tolerance rather than about the matrix.

The next unit adds the inner product: the four subspaces acquire right angles, "no solution" becomes "best approximate solution", and projection turns out to be the geometry behind least squares.
