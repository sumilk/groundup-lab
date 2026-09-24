---
id: math.linear-algebra.linear-maps-rank
title: Systems, elimination and the four fundamental subspaces
prerequisites: [math.linear-algebra.vectors-spaces-bases]
estimated_hours: 28
answers: 02-elimination
---

# Systems, elimination and the four fundamental subspaces

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
> **Hint:** Multiply each column by the corresponding entry of x. Separately dot each row with x; both calculations must give the same output vector.
>
> **Practice — Core:** Show from the two linearity rules alone that \(A0=0\), and that the image of a subspace is a subspace.
>
> **Hint:** Use A(0+0)=A0+A0 and cancellation. For the image, choose preimages of two output vectors and apply linearity to their combination.
>
> **Practice — Stretch:** Give a map \(\mathbb R^2\to\mathbb R^2\) satisfying \(T(cu)=cT(u)\) for all scalars but failing additivity, and say which reading of \(Ax\) it breaks.
>
> **Hint:** Try T(x,y)=(x³/(x²+y²),0) away from the origin and T(0,0)=0. Check scaling for negative scalars as well, then test addition on e₁ and e₂.

## 2. Elimination: the only algorithm here

Three operations on the rows leave the solution set completely unchanged:

1. **Swap** two rows.
2. **Scale** a row by a nonzero constant.
3. **Add** a multiple of one row to another.

Each is reversible, which is exactly why the solution set survives: anything the new system admits, the old one admits too. Gaussian elimination is these three moves applied with a purpose — clear the entries below each pivot, left to right.

A matrix is in **row echelon form** when all zero rows are at the bottom and the first nonzero entry of each nonzero row lies strictly to the right of the first nonzero entry in the preceding nonzero row. The first nonzero entry of a row is its **pivot**; a column holding a pivot is a **pivot column** and every other column is a **free column**, whose variable is a **free variable**. Scaling each pivot to 1 and clearing *above* as well as below gives **reduced** row echelon form, which is unique for a given matrix — a fact worth pausing on, since the sequence of operations that gets you there is not.

Work the bench below by hand: choose a row operation, apply it, and watch the pivots appear. The verdict panel updates after every move — read it only after you have predicted it.

```lab
la-elim
```

**What the pivots are telling you.** The number of pivots is the rank. Pivot columns add something new to the span; free columns are the ones already reachable. A pivot in the *right-hand* column is the signature of \(0=1\): the system is inconsistent and \(b\) lies outside the span of the columns.

> **Practice — Foundation:** For the \(2\times3\) system \(x+2y+z=4\), \(2x+3y-z=3\), apply each operation to the original augmented matrix separately: swap \(R_1\leftrightarrow R_2\); scale \(R_1\) by 3; replace \(R_2\) by \(R_2-2R_1\). Check that \((-1,2,1)\) solves all three new systems, and write the inverse of each operation.
>
> **Hint:** The third operation gives the row [0 −1 −3 | −5]. The inverses are the same swap, scaling by 1/3, and R₂ ← R₂+2R₁.
>
> **Practice — Core:** Explain why scaling a row by zero is not permitted, in terms of reversibility rather than convention.
>
> **Hint:** Compare a nonzero equation with the equation obtained by multiplying it by zero. Can the original restriction be recovered from the new one?
>
> **Practice — Stretch:** Reduce \(A=\begin{pmatrix}1&2&1\\2&4&3\end{pmatrix}\) to reduced row echelon form twice: once starting with \(R_2\leftarrow R_2-2R_1\), once starting with \(R_1\leftrightarrow R_2\) and then scaling the new first row by \(\tfrac12\). Confirm both routes reach the same form, and argue from uniqueness that no sequence of operations can make column 2 a pivot column.
>
> **Hint:** Both routes end at rows (1,2,0) and (0,0,1), with pivots in columns 1 and 3. Column 2 is twice column 1, and row operations preserve that column relation.

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
> **Hint:** Rank cannot exceed the smaller dimension. If rank reaches the number of rows, every target is reachable; use nullity to assess uniqueness.
>
> **Practice — Core:** Prove \(\operatorname{rank}(AB)\le\operatorname{rank}(B)\) using the column reading of \(Ax\).
>
> **Hint:** The image of AB is A applied to C(B). Apply A to a basis of C(B); those images span C(AB), though they may become dependent.
>
> **Practice — Stretch:** Construct \(A,B\) with \(\operatorname{rank}(AB)\) strictly less than both ranks, and say what collapsed.
>
> **Hint:** Use nonzero projections onto the two different coordinate axes. Arrange for B’s image to lie in A’s kernel.

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
> **Hint:** Try repeated left-hand sides with inconsistent right-hand sides, then with consistent right-hand sides. Inspect the final augmented row.
>
> **Practice — Core:** Prove the trichotomy from linearity, being explicit about where you use \(A(x_1-x_2)=0\).
>
> **Hint:** If a solution exists, subtract it from any other solution. Conversely add an arbitrary null vector to a fixed solution and apply A.
>
> **Practice — Stretch:** For \(A\in\mathbb R^{3\times5}\) of rank 3, describe the solution set of \(Ax=b\) for every \(b\), distinguish the shape label "underdetermined" from the rank conditions that decide consistency and uniqueness.
>
> **Hint:** Full row rank makes every b reachable. Rank–nullity gives the number of free directions; express every solution as one point plus the kernel.

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

A fixed nonzero linear probe \(w^{\mathsf T}h\) has an enormous null space: in \(\mathbb R^{768}\), 767 dimensions of activation change are invisible to it. An edit in that null space leaves every probe score unchanged. Unchanged accuracy is a weaker observation: scores can change greatly without changing predictions, and even different predictions can have the same aggregate accuracy. It does not establish that the component measured by the probe stayed fixed. Rank–nullity describes the directions invisible to the fixed linear score itself.

> **Practice — Foundation:** For \(A=\begin{pmatrix}1&2\\2&4\end{pmatrix}\), find \(N(A)\) and check rank–nullity.
>
> **Hint:** The second equation duplicates the first. Solve x₁+2x₂=0 with x₂ free, then compare the kernel dimension with the rank.
>
> **Practice — Core:** Prove both directions of Theorem 6 and identify where linearity is used in each.
>
> **Hint:** Apply A to xₚ+n to prove one inclusion. For the other, subtract xₚ from an arbitrary solution and show that the difference belongs to N(A).
>
> **Practice — Stretch:** Explain why the null-space basis read off the echelon form is independent without computing a determinant.
>
> **Hint:** Each null-space basis vector gives one free variable value 1 and the others 0. Read those free coordinates in a proposed zero combination.

## 6. The four fundamental subspaces

One matrix, four subspaces, two in each space. Everything later is bookkeeping about these.

| Subspace | Definition | Lives in | Dimension |
|---|---|---|---|
| Column space \(C(A)\) | span of the columns; all reachable \(Ax\) | \(\mathbb R^m\) | \(r\) |
| Null space \(N(A)\) | all \(x\) with \(Ax=0\) | \(\mathbb R^n\) | \(n-r\) |
| Row space \(C(A^{\mathsf T})\) | span of the rows | \(\mathbb R^n\) | \(r\) |
| Left null space \(N(A^{\mathsf T})\) | all \(y\) with \(A^{\mathsf T}y=0\) | \(\mathbb R^m\) | \(m-r\) |

The two dimension counts are rank–nullity applied to \(A\) and to \(A^{\mathsf T}\), sharing the same \(r\) by Theorem 5. These dimension counts alone do not prove that the pairs have trivial intersection. Here is the missing step for the input pair: if \(z=A^{\mathsf T}y\) also satisfies \(Az=0\), then \(z^{\mathsf T}z=y^{\mathsf T}Az=0\), so \(z=0\). Apply the same argument to \(A^{\mathsf T}\) for the output pair. Combined with the dimension counts, this proves the two direct-sum decompositions. The argument uses the positivity of the standard dot product, previewed in Module 1. Module 3 develops the stronger orthogonal-complement statements and explains what changes with the metric.

The lab below is the \(2\times2\) case, where all of it is visible at once. Drag the columns of \(A\) and watch the unit square map to a parallelogram; collapse the columns onto one line and the column space drops to a line while the null space appears as the inputs crushed to the origin.

```lab
la-map
```

**The determinant as a volume.** The area of that parallelogram is \(|\det A|\), and the sign of \(\det A\) says whether orientation flipped. Zero area is exactly rank deficiency — the collapse of the previous unit, now happening to a map instead of a span. Determinants get their own treatment later; for now treat \(|\det|\) as an area factor and nothing more.

> **Practice — Foundation:** For a \(3\times5\) matrix of rank 2, give the dimension of all four subspaces.
>
> **Hint:** Column and row spaces both have dimension rank. Apply rank–nullity to A and to Aᵀ for the other two dimensions.
>
> **Practice — Core:** Show that \(C(A)\) is a subspace of \(\mathbb R^m\) directly from the column reading of \(Ax\).
>
> **Hint:** Write two outputs as Ax and Ay. Their linear combination is A applied to the corresponding combination of inputs.
>
> **Practice — Stretch:** Construct a matrix whose left null space is nontrivial and explain what that says about which \(b\) are reachable.
>
> **Hint:** Choose a matrix with a zero output row. Its corresponding coordinate vector lies in N(Aᵀ) and imposes a compatibility condition on reachable targets.

## 7. What depends on a choice of geometry

Module 1 introduced inner products for its overlap experiments, and section 6 used the standard dot product to prove trivial intersection. Rank, nullity, existence, uniqueness, and the affine solution structure do not require an inner product. The identification of rows with vectors in the input space does depend on coordinates: intrinsically, rows are linear functionals in the dual space. Under a general basis change, row covectors and input vectors transform differently. The four dimensions are invariant, but one must not treat the coordinate row space as a canonically chosen subspace of the input space.

Module 3 develops orthogonal complements and projections. For the standard Euclidean inner products, \(N(A)\perp C(A^{\mathsf T})\) and \(N(A^{\mathsf T})\perp C(A)\). For other metrics, the corresponding statements use the adjoint for those metrics rather than the bare transpose. A passive coordinate change preserves a fixed geometry only when its metric is transformed too, as Module 1 showed.

> **Practice — Foundation:** Let \(A=\begin{pmatrix}1&1\\2&2\end{pmatrix}\) and re-express input vectors in the skewed basis \(B=((1,0),(1,1))\), so the matrix acting on coordinates is \(AB\). Say whether each of these changes: the coordinates of the null vector \((1,-1)\); the raw dot product of the coordinate lists of \(e_1\) and \(e_2\); the rank; the nullity; and the set of points solving \(Ax=(2,4)\).
>
> **Hint:** (1,−1) has B-coordinates (2,−1), and AB(2,−1)=0. The coordinates of e₁,e₂ are (1,0),(−1,1), with raw dot product −1 instead of 0.
>
> **Practice — Core:** Give a change of coordinates that preserves rank but changes a raw coordinate dot product from zero to nonzero. Explain how transforming the metric preserves the original orthogonality relation.
>
> **Hint:** Start with two perpendicular standard basis vectors, then express them in a skew basis B. Test their coordinate dot product and then the corrected metric BᵀB.
>
> **Practice — Stretch:** For \(A=\operatorname{diag}(1,10^{-10})\), give the exact rank and the numerical rank that counts singular values above \(10^{-8}\). For \(u=(1,1)\) and \(v=(1,-1+10^{-12})\), give the exact Euclidean inner product and the value float64 returns, and say whether "orthogonal to tolerance \(10^{-10}\)" is a theorem or a measurement. List what must be reported to reproduce each measured claim.
>
> **Hint:** Exact rank is 2 but only one singular value exceeds 10⁻⁸. The exact inner product is 10⁻¹², nonzero; float64 returns about 9.9998×10⁻¹³ because −1+10⁻¹² is rounded.

## 8. Elimination on a real machine

Everything above is exact arithmetic. Floating point changes the algorithm, not the theory.

**LU: elimination, remembered.** Record the multipliers used to clear each column and elimination factors the matrix as \(A=LU\), or \(PA=LU\) with row swaps. The point is reuse: factoring costs \(O(n^3)\), but each new right-hand side then costs \(O(n^2)\) by forward and back substitution. Solving \(Ax=b\) for twenty right-hand sides should never cost twenty eliminations.

**Partial pivoting is not optional.** Textbook elimination divides by whatever sits in the pivot position. If that entry is tiny the multipliers are huge and rounding error in them swamps the answer. Swapping in the largest available entry in the column keeps every multiplier at most 1 in magnitude. This controls the multipliers, but intermediate entries can still grow; partial pivoting is usually effective, not an unconditional accuracy guarantee. Once a pivot is accepted, do not skip a row operation merely because its multiplier is small: it may multiply a large entry elsewhere in the row.

**Exact rank and numerical rank are different questions.** Exact rank is computable for exact rational data, but rounding or measurement noise can change it. Numerical routines commonly estimate rank by counting singular values above a tolerance; elimination-based estimates instead threshold pivots. The estimate therefore depends on the method and threshold. Report both, together with the data precision, rather than presenting a numerical estimate as an exact theorem.

**Conditioning.** The condition number \(\kappa(A)\) bounds how much a relative error in \(b\) is amplified in \(x\). In the worst case, relative errors can grow by a factor of \(\kappa\): the usual rule of thumb is a loss of about \(\log_{10}\kappa\) decimal digits. At \(\kappa\approx10^8\), float32's roughly seven decimal digits can be exhausted; float64's roughly sixteen can lose about half. This is a sensitivity bound, not a prediction that every right-hand side loses that many digits. For a full-column-rank design matrix, forming the normal equations squares the 2-norm condition number, which is why QR is often preferred. These ideas are developed in Modules 4 and 9.

> **Practice — Foundation:** For \(n=1000\), use \(\tfrac23n^3\) flops for an LU factorization and \(2n^2\) flops for one forward-plus-back substitution. Count the flops for twenty right-hand sides done as (a) twenty full factor-and-solve passes and (b) one factorization reused twenty times, and give the ratio.
>
> **Hint:** (a) is 20(⅔n³+2n²) and (b) is ⅔n³+20·2n². With n=1000 the ratio is just under 19, not 20, because the substitutions are not free.
>
> **Practice — Core:** Eliminate \(A=\begin{pmatrix}1&0&1\\-1&1&1\\-1&-1&1\end{pmatrix}\) with partial pivoting, keeping the current row on ties. Explain why every multiplier has magnitude at most 1, show that the last entry of \(U\) nevertheless grows to 4, and say why bounded multipliers alone do not guarantee a small forward error.
>
> **Hint:** Each pivot has the largest magnitude in its column, and here every multiplier is −1. Each step adds the pivot row to the rows below, doubling the last column: 1, 2, 4.
>
> **Practice — Stretch:** For \(A=\operatorname{diag}(1,10^{-6})\), report the numerical rank at tolerances \(10^{-4}\) and \(10^{-8}\), then multiply \(A\) by 1000 and repeat at \(10^{-4}\). State the exact rank in every case and list what you would report alongside a numerical rank.
>
> **Hint:** The singular values are 1 and 10⁻⁶, giving numerical ranks 1 and 2; after scaling they are 1000 and 10⁻³, so the count at 10⁻⁴ becomes 2. Exact rank is 2 throughout.

## Local numerical and research audit

### Pivot growth and backward error

Partial pivoting avoids division by a needlessly small entry in the current pivot column, but it does not guarantee that all elimination intermediates stay small. Track element growth as \(\rho=\max_{i,j,k}|a_{ij}^{(k)}|/\max_{i,j}|a_{ij}|\), over the active elimination matrices, as well as the factorization residual. Growth is a risk diagnostic, not a forward-error estimate.

For a computed solution \(\hat x\), report \(r=b-A\hat x\) and the normwise backward-error indicator \(\eta=\|r\|_\infty/(\|A\|_\infty\|\hat x\|_\infty+\|b\|_\infty)\). Define the all-zero exact problem as zero error; do not divide by zero. Small backward error says the result solves a nearby problem. It does not say the solution is accurate when the original problem is ill-conditioned.

**M9 · Stretch · mixed — Pivot growth and backward error.** For A=diag(1,10⁻⁸), b=(1,10⁻⁸), and x̂=(1,0), calculate the infinity-norm residual and explain why it understates solution error.

## 9. Runnable labs

Three coding exercises run in this page's Python workspace, each as its own tab, using the standard library only.

### Lab A — reduced row echelon form

Implement **row_echelon** in [labs/exercises.py](../../labs/exercises.py). Return the reduced row echelon form together with the pivot columns, treating any candidate pivot at or below the tolerance as zero. Exact RREF is unique. With floating point and thresholded pivots, compare outputs to tolerance and check pivot normalization and cleared pivot columns; exact uniqueness is not an error bound.

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
4. Solve \(\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix}x=(1,2)^T\) with and without pivoting for \(\varepsilon=10^{-16}\) and compare against the exact answer.
5. Compute numerical rank of a noisy matrix at five tolerances and plot rank against tolerance.
6. Track row operations on \([A\mid I_m]\), pivoting only in the coefficient block, to build bases for all four subspaces from one reduction and check the four dimensions against \(r,\ n-r,\ r,\ m-r\).

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

**B6 · Core · NumPy — where naive elimination dies.** Take \(\begin{pmatrix}\varepsilon&1\\1&1\end{pmatrix}x=(1,2)^T\) with \(\varepsilon=10^{-16}\). Solve with and without pivoting, compare against the exact solution, and explain the failure in one sentence.

**B7 · Stretch · NumPy — rank is a threshold.** Compute the numerical rank of a \(20\times20\) rank-5 product perturbed by noise of size \(10^{-10}\) at five tolerances. Plot rank against tolerance and mark where the singular values cluster.

**B8 · Stretch · NumPy — four bases from one reduction.** Reduce \([A\mid I_m]\) while selecting pivots only in the \(A\) block, to obtain \([R\mid E]\) with \(EA=R\). Build bases for all four fundamental subspaces from this single reduction. Use rows of \(E\) corresponding to zero rows of \(R\) for the left null space. Verify the four dimensions and prove that the row space and null space meet only at the origin.

## 12. Exercises · PyTorch

**C1 · Foundation · PyTorch — read the shape first.** Take `nn.Linear(768, 3072)`. Before computing, state the maximum possible rank of its weight, whether \(Wx=b\) can have a unique solution, and the nullity if the rank is full. Then verify each with `torch.linalg`.

**C2 · Core · PyTorch — what a factored update can reach.** Build \(\Delta W=BA\) with \(d=k=512\), \(r=8\). Verify \(\operatorname{rank}(\Delta W)\le8\) numerically, then describe \(N(\Delta W)\): how many input directions does the adapter leave untouched?

**C3 · Core · PyTorch — a rank bound that survives training.** For one attention head with \(d_\text{head}=64\) and sequence length 1024, compute the rank of the pre-softmax score matrix \(QK^{\mathsf T}\), explain the bound from section 3, then check whether the rank survives the softmax.

**C4 · Core · PyTorch — what a probe cannot see.** With `torch.manual_seed(0)`, draw frozen activations \(H\in\mathbb R^{500\times16}\) (`float64`, standard normal) and labels \(y=\mathbb 1[h_1>0]\). Fit a least-squares probe \(w\) minimizing \(\|Hw-(2y-1)\|\) with `torch.linalg.lstsq`. State the nullity of \(w^{\mathsf T}\), form \(z=e_2-w(w^{\mathsf T}e_2)/(w^{\mathsf T}w)\), replace the first activation \(h_1\) by \(h_1+100z\), and report \(w^{\mathsf T}z\), \(\|100z\|\), and the change in that activation's probe output. Write two sentences on what this means for "the probe found the feature".

**C5 · Stretch · PyTorch — conditioning in a regression.** With `torch.manual_seed(0)` and `float64`, draw \(x,u\in\mathbb R^{100}\) standard normal, set the design \(A=[\,x,\ x+10^{-4}u\,]\), and the target \(b=2x+0.01\,\epsilon\) with \(\epsilon\) standard normal. Using `torch.linalg.lstsq`, report `torch.linalg.cond(A)`, the two coefficients and their sum, and the residual norm. Perturb \(b\) by \(10^{-6}\) times fresh standard normal noise and report the coefficient change. Re-run with the single-column design \(A=[\,x\,]\) and compare coefficient stability.

**C6 · Stretch · PyTorch — audit a rank claim.** With `torch.manual_seed(0)` and `float64`, build a stand-in weight \(W=U\operatorname{diag}(s)V^{\mathsf T}+E\in\mathbb R^{256\times256}\), where \(U,V\) are the Q factors of two standard normal \(256\times256\) matrices, \(s_i=0.9^{\,i}\) for \(i=0,\dots,255\), and \(E\) has independent \(\mathcal N(0,10^{-12})\) entries (standard deviation \(10^{-6}\)). Plot the singular values of \(W\) on a log scale, report the numerical rank at absolute tolerances \(10^{-1}\), \(10^{-2}\), and \(10^{-10}\), and report the fraction of squared Frobenius norm discarded by a rank-32 truncation. Say what, if anything, follows about a layer with this weight.

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
14. Show that partial pivoting bounds every multiplier by 1 in magnitude, and explain why controlling intermediate growth and conditioning is also needed to assess the computed solution.

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

Read \(Ax\) as a combination of columns without translating; eliminate by hand and name the pivot and free columns; state what rank measures and derive both consequences for existence and uniqueness; produce the complete solution set as a particular solution plus a null-space basis and verify rank–nullity; give all four fundamental subspaces with their dimensions and identify the metric behind their standard orthogonality relations; and explain why numerical rank depends on the matrix, method, and tolerance together.

The next unit develops the inner-product preview into orthogonal complements and projection: "no solution" becomes "best approximate solution", and projection supplies the geometry behind least squares.
