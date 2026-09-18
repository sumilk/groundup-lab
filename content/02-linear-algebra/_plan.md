# Linear algebra track — build plan

*Written for whoever writes the next module: you in a later session, a collaborator, or a model
working from this file as its brief. It fixes the format, names every module, and says what each one
owes the reader. It is not a lesson and is not built into the reader.*

Three modules exist. Twenty-three do not. This plan exists because the expensive mistakes in a track
like this are structural — two modules that teach the same thing differently, a theorem used three
modules before it is proved, an identifier that breaks another track's prerequisites — and those are
cheap to prevent here and costly to repair later.

## 1. What is already fixed

The reader's identifiers, exercise grammar, and answer-bank interfaces are shared contracts.
The first two modules provide a teaching baseline, not a rigid page template: use new visual
experiments, prediction/reveal sequences, linked views, and other structures when they make an
idea easier to understand. Preserve the checkable practice and prerequisite discipline.

**The geometry boundary.** Module 1 previews inner products, Gram matrices, and metric changes to support its overlap experiments. Module 2 uses the standard dot product explicitly when proving that the row and null spaces have trivial intersection. Module 3 develops orthogonal complements, general metrics, and projection from those definitions; Module 4 owns Gram–Schmidt and its stability comparison. Earlier numerical previews may use supplied library calls, but must not require implementing untaught later algorithms.

**The reference page format.** Numbered teaching sections, each closing with three practice prompts tagged
Foundation / Core / Stretch. Interactive figures embedded by a fenced `lab` block naming a registered
lab. A runnable-labs section linking three stdlib Python exercises. Then one exercise bank in a
single grammar, a derivations list, a cumulative set, and a six-problem checkpoint.

**The exercise grammar.** Every exercise header reads

```
**A7 · Core · paper — the three faces of dependence.**
```

identifier, difficulty, mode, then the name. Modes are `paper`, `NumPy`, `PyTorch`, `mixed`, `gate`.
Identifier prefixes are `A` by hand, `B` NumPy, `C` PyTorch, `M` cumulative, `K` checkpoint. The build
fails if a header does not parse or if an identifier has no entry in the answer bank.

**Every exercise is checkable.** One entry per exercise in `public/theory/answers/<bank>.js`:
`statement`, `plain`, `solution`, plus `fields` wherever an answer is typeable (`num`, `vec`, `ratio`,
`set`, `choice`) and `hints` keyed by field. Typed answers are graded offline in the browser; written
arguments are marked against `solution` by whichever model the reader is connected to.

**Identifiers are load-bearing.** Five ids are referenced by other tracks and must survive any
restructuring, on whichever module ends up carrying that material:

| id | referenced by |
|---|---|
| `math.linear-algebra.vectors-spaces-bases` | optimization 01 |
| `math.linear-algebra.linear-maps-rank` | internal |
| `math.linear-algebra.projections-least-squares` | optimization 03, probability 11 |
| `math.linear-algebra.eigen-invariant-subspaces` | optimization 03, 05, probability 04 |
| `math.linear-algebra.svd-pca` | optimization 06, probability 12 |

New modules take new ids of the form `math.linear-algebra.<slug>`. Never recycle an id for different
material — a stale prerequisite is silent.

**Validation.** `node scripts/build-theory.mjs && node scripts/check-theory.mjs` must pass, and
`python -m labs.checks --reference` must be green. The checker enforces catalog freshness, link
targets, lab registration, reader script loading, exercise grammar, and answer-bank coverage.

## 2. Renames — applied

The two built modules were named for their labs. That reads well on a standalone page and badly in a
catalogue of forty-three lessons across fourteen tracks, where the title is the only thing a reader
searching for "elimination" will see. Titles become plainly descriptive; the character moves to the
opening line, where it belongs.

| File | Was | Becomes |
|---|---|---|
| `01-vectors-spaces-bases.md` | The span workbench — vectors, span, independence and bases | **Vectors, span, independence and bases** |
| `02-linear-maps-rank.md` → `02-systems-elimination-subspaces.md` | The elimination workbench — systems, rank and the four subspaces | **Systems, elimination and the four fundamental subspaces** |
| `03-projections-least-squares.md` | Orthogonal projections and least squares *(legacy stub)* | **Inner products, orthogonality, projection and least squares** — Module 3 complete |
| `04-eigenvalues-invariant-subspaces.md` → `06-eigenvalues-diagonalization.md` | Eigenvalues, eigenvectors and invariant subspaces *(legacy stub)* | rewritten as Module 6 |
| `05-svd-pca.md` → `08-svd-low-rank.md` | Singular value decomposition and PCA *(legacy stub)* | rewritten as Module 8 |

These renames are done; the table records what moved. Ids stayed put. Filenames follow the module number, so renaming a file means updating `content/README.md`
and any relative links; the checker catches the links, not the README. Answer-bank keys follow the
file: `01-span`, `02-elimination`, then `03-projection`, `04-qr`, and so on.

## 3. The twenty-six modules

Six parts. Each part has a thesis; each module has a spine of two to five results it exists to
establish, and everything else in it is scaffolding for those.

| # | Module | Part | Hours |
|---|---|---|---|
| 1 | Vectors, span, independence and bases | I · Structure | 30 ✅ |
| 2 | Systems, elimination and the four fundamental subspaces | I | 28 ✅ |
| 3 | Inner products, orthogonality, projection and least squares | II · Geometry | 30 ✅ |
| 4 | Orthonormal bases, Gram–Schmidt and QR | II | 24 |
| 5 | Determinants as signed volume | II | 20 |
| 6 | Eigenvalues, invariant subspaces and diagonalization | II | 30 |
| 7 | Symmetric matrices, the spectral theorem and quadratic forms | II | 28 |
| 8 | The SVD: geometry, rank and low-rank approximation | III · Decomposition | 34 |
| 9 | Norms, conditioning and numerical stability | III | 26 |
| 10 | The pseudoinverse, regularization and rank-deficient problems | III | 26 |
| 11 | Direct solvers at scale: Cholesky, blocking and the memory hierarchy | IV · Numerical | 26 |
| 12 | Iterative solvers: splittings, steepest descent and conjugate gradients | IV | 30 |
| 13 | Krylov and randomized methods for eigenproblems | IV | 30 |
| 14 | Sparse and structured matrices, matrix-free operators | IV | 24 |
| 15 | Matrix calculus I: derivatives, layouts and Jacobians | V · Calculus | 28 |
| 16 | Matrix calculus II: the chain rule as composition, and adjoints | V | 28 |
| 17 | Backpropagation as adjoint accumulation | V | 30 |
| 18 | Second-order structure: Hessian, Gauss–Newton, Fisher, K-FAC | V | 32 |
| 19 | Low-rank structure in trained models | VI · Research | 26 |
| 20 | Random projections, sketching and randomized numerical linear algebra | VI | 28 |
| 21 | Tensors as multilinear maps: contraction, einsum and cost | VI | 26 |
| 22 | Attention as a bilinear form | VI | 28 |
| 23 | Kronecker and block structure | VI | 24 |
| 24 | Spectra of trained networks | VI | 30 |
| 25 | Superposition geometry and dictionary learning | VI | 32 |
| 26 | Capstone: a linear-algebra audit of a real model | VI | 30 |

Total ≈ 730 hours of study; the three built modules are 88 of them.

### Part II · Geometry (3–7)

*Thesis: add an inner product and every structural fact from Part I acquires a picture — and a new
class of failure, because the picture depends on a choice.*

**Module 3 — Inner products, orthogonality, projection and least squares**
`id: math.linear-algebra.projections-least-squares` · prereq: 2 · 30h · bank `03-projection`
Spine: the inner product axioms and the \(G\)-metric as a choice; orthogonal complements and
\(N(A)\perp C(A^{\mathsf T})\), developing the right-angled four-subspace picture previewed in
Module 2 §§6–7; the projection theorem and the normal equations; least squares as projection onto the
column space.
Labs: `la-project` (drag a vector and a line/plane, watch the projection and residual, toggle the
\(G\)-metric to see "orthogonal" change meaning); `la-lsq` (drag data points, watch the fitted line,
the residual vector and \(\|r\|^2\) live); reuse `la-map`.
Python: `project_onto` (projection matrix from a basis, stdlib), `normal_equations` (solve by
elimination and report the residual), `gram_metric` (inner product under \(G\), reject non-PD \(G\)).
ML anchor: cosine similarity is a choice of \(G\); why the normal equations square the conditioning.
Checkpoint theme: state what the four-subspace diagram assumes and prove one of its two orthogonality
claims.
Built extensions: a candidate-versus-projection experiment exposing the excess-error identity,
prediction/reveal prompts, and linked data/observation-space views for three-point regression.
The shared `plot3.js` supplies orthographic vector/plane drawing and a draggable camera.

**Module 4 — Orthonormal bases, Gram–Schmidt and QR**
`id: …orthonormal-bases-qr` · prereq: 3 · 24h · bank `04-qr`
Spine: orthonormal bases make coordinates free (\(c=Q^{\mathsf T}v\)); Gram–Schmidt and its modified
form; QR existence and uniqueness; least squares by QR rather than the normal equations.
Labs: `la-gramschmidt` (drag two or three vectors, watch each projection subtracted in sequence, with
a near-dependent preset that visibly breaks the classical version).
Python: `gram_schmidt` (classical and modified, returning both so the student compares), `qr_solve`,
`orthogonality_defect` (max off-diagonal of \(Q^{\mathsf T}Q\)).
ML anchor: orthogonal initialization; why QR is the stable path to least squares.

**Module 5 — Determinants as signed volume**
`id: …determinants-volume` · prereq: 4 · 20h · bank `05-determinant`
Spine: the three defining properties (multilinear, alternating, normalized) and why they force
uniqueness; \(\det(AB)=\det A\det B\); volume scaling and orientation; the change-of-variables
Jacobian factor as the reason this matters at all.
Labs: `la-det` (drag the columns of a 2×2 or 3×3, watch signed area/volume, orientation flip, and the
cofactor expansion as a decomposition of the parallelepiped).
Python: `det_by_elimination` (track the sign through swaps), `volume_ratio`, `cofactor_2x2`.
Honest framing: determinants are pedagogically central and computationally marginal — say so, and
point at \(\log|\det|\) in normalizing flows as where they do earn their keep.

**Module 6 — Eigenvalues, invariant subspaces and diagonalization**
`id: math.linear-algebra.eigen-invariant-subspaces` · prereq: 5 · 30h · bank `06-eigen`
Spine: invariant subspaces as the real object, eigenvectors as the one-dimensional case; the
characteristic polynomial and why it is the wrong computational tool; diagonalizability, defective
matrices and the Jordan story stated without proof; \(A^k\) and the dynamics of iteration.
Labs: `la-eigen` (drag a 2×2's columns, see the image of the unit circle, the eigenvector directions
appearing as the fixed rays, complex pairs shown as rotation); `la-power` (iterate \(x\mapsto Ax/\|Ax\|\)
and watch convergence to the dominant direction, with a preset where the top two eigenvalues are close).
Python: `power_iteration` (with a convergence report), `char_poly_2x2`, `is_diagonalizable_2x2`.
ML anchor: the spectral radius as the stability criterion for recurrence; why repeated multiplication
by the same matrix explains exploding and vanishing gradients.

**Module 7 — Symmetric matrices, the spectral theorem and quadratic forms**
`id: …spectral-theorem-quadratic-forms` · prereq: 6 · 28h · bank `07-spectral`
Spine: the spectral theorem \(A=Q\Lambda Q^{\mathsf T}\); the Rayleigh quotient and the variational
characterization of eigenvalues; quadratic forms, level sets and positive definiteness; Cholesky as
the computational test.
Labs: `la-quadform` (drag the eigenvalues of a symmetric 2×2, watch level sets go from ellipses to
hyperbolas to degenerate, with the Rayleigh quotient traced as a point moves round the circle).
Python: `rayleigh_quotient`, `cholesky` (and a clean failure on an indefinite matrix), `is_pd`.
ML anchor: covariance matrices, the Hessian's eigenvalues as curvature, why "positive definite" is
the precondition for most of optimization.

### Part III · Decomposition and conditioning (8–10)

*Thesis: one factorization subsumes the geometry of Parts I–II and quantifies how much of it survives
floating point.*

**Module 8 — The SVD: geometry, rank and low-rank approximation**
`id: math.linear-algebra.svd-pca` · prereq: 7 · 34h · bank `08-svd`
Spine: every matrix is a rotation, a scaling and a rotation; singular values and vectors; the four
subspaces read straight off \(U\) and \(V\); Eckart–Young; PCA as the SVD of a centred data matrix.
Labs: `la-svd` (drag a 2×2, see the unit circle map to an ellipse with the singular vectors drawn, and
the rank-1 truncation shown against the original); `la-approx` (a small image or matrix heatmap
reconstructed at increasing rank, with the error curve beside it).
Python: `svd_2x2` (closed form via the eigenvectors of \(A^{\mathsf T}A\)), `truncate_rank`,
`explained_variance`.
ML anchor: numerical rank versus mathematical rank; what a decaying spectrum does and does not say
about a layer; PCA whitening and its effect on the geometry of representations.

**Module 9 — Norms, conditioning and numerical stability**
`id: …norms-conditioning-stability` · prereq: 8 · 26h · bank `09-conditioning`
Spine: vector and matrix norms, induced norms, \(\|A\|_2=\sigma_1\); the condition number and the
perturbation bound; backward stability as the right standard for an algorithm; catastrophic
cancellation.
Labs: `la-norms` (unit balls in \(\ell^1,\ell^2,\ell^\infty\) and the image of each under a dragged
matrix, with the induced norm read off); `la-condition` (perturb \(b\) and watch \(x\) move, with the
amplification measured against \(\kappa\)).
Python: `matrix_norm_1_inf`, `condition_estimate` (power iteration on \(A^{\mathsf T}A\)),
`cancellation_demo`.
ML anchor: float32 versus float64 in training; why the loss going to NaN is sometimes a conditioning
story; gradient clipping as a norm constraint.

**Module 10 — The pseudoinverse, regularization and rank-deficient problems**
`id: …pseudoinverse-regularization` · prereq: 9 · 26h · bank `10-pseudoinverse`
Spine: the Moore–Penrose pseudoinverse and its four defining properties; the minimum-norm solution;
ridge regression as a spectral filter and its geometry; the bias–variance reading of shrinkage.
Labs: `la-ridge` (drag the ridge parameter and watch coefficients shrink along the spectrum, with the
near-collinear preset where two coefficients trade off wildly).
Python: `pinv_via_svd`, `ridge_solve`, `min_norm_solution`.
ML anchor: weight decay as ridge; why an overparameterized interpolating solution is the minimum-norm
one, and what that implies about implicit regularization.

### Part IV · Numerical linear algebra (11–14)

*Thesis: everything above assumed you could compute it. At scale you cannot, and the algorithms that
replace exact solves have their own geometry.*

**Module 11 — Direct solvers at scale** `id: …direct-solvers-scale` · prereq: 10 · 26h · `11-direct`
Spine: Cholesky for symmetric positive definite systems and its cost; blocked LU and QR; BLAS levels
and why level-3 dominates; the memory hierarchy as the actual constraint.
Labs: `la-blocking` (an animated blocked factorization showing which submatrix is touched when, with
an operation counter).
Python: `cholesky_blocked` (small blocks, stdlib), `flop_count`, `triangular_solve`.

**Module 12 — Iterative solvers** `id: …iterative-solvers-cg` · prereq: 11 · 30h · `12-iterative`
Spine: splitting methods and their convergence condition; steepest descent on a quadratic and its
zig-zag; conjugate gradients as \(A\)-orthogonal search directions; preconditioning as a change of
metric.
Labs: `la-descent` (drag the condition number of a 2D quadratic and watch steepest descent zig-zag
while CG finishes in two steps); `la-precondition` (the same problem after a metric change).
Python: `jacobi_iteration`, `conjugate_gradient`, `residual_history`.
ML anchor: gradient descent is steepest descent on a local quadratic; momentum and preconditioning as
the same idea seen twice; why Adam is a diagonal preconditioner.

**Module 13 — Krylov and randomized methods for eigenproblems**
`id: …krylov-randomized-eigen` · prereq: 12 · 30h · `13-krylov`
Spine: the Krylov subspace; Lanczos for symmetric problems; the QR algorithm in outline; randomized
range finding and the randomized SVD with its error bound.
Labs: `la-krylov` (watch the Krylov subspace grow and the Ritz values converge to the extreme
eigenvalues first); `la-randsvd` (sketch size versus approximation error).
Python: `lanczos_tridiag`, `randomized_range_finder`, `ritz_values`.

**Module 14 — Sparse and structured matrices** `id: …sparse-structured` · prereq: 13 · 24h · `14-sparse`
Spine: sparsity patterns and fill-in; matrix-free operators — you need the action, not the matrix;
graph Laplacians and what their spectrum says; structured families (Toeplitz, circulant, and the FFT
connection).
Labs: `la-graph` (drag a small graph, see the Laplacian and its Fiedler vector partition the nodes).
Python: `sparse_matvec` (dictionary-of-keys), `laplacian_from_edges`, `fiedler_vector`.

### Part V · Calculus on matrices (15–18)

*Thesis: the derivative of a map between vector spaces is a linear map, and backpropagation is what
you get when you take that seriously.*

**Module 15 — Matrix calculus I** `id: …matrix-calculus-jacobians` · prereq: 10 · 28h · `15-calculus`
Spine: the derivative as the best linear approximation; Jacobians; numerator versus denominator
layout stated once and then held; derivatives of the maps that actually occur (\(Ax\), \(x^{\mathsf T}Ax\),
\(\|x\|^2\), softmax, a matrix product).
Labs: `la-jacobian` (drag an input point, see the local linearization of a nonlinear 2D map as the
image of a small circle becoming an ellipse).
Python: `numeric_jacobian` (central differences), `jacobian_check` (compare an analytic Jacobian
against the numeric one — the gradient check every practitioner should be able to write).

**Module 16 — Matrix calculus II: composition and adjoints**
`id: …chain-rule-adjoints` · prereq: 15 · 28h · `16-adjoints`
Spine: the chain rule as composition of linear maps; the adjoint of a linear map and why the
transpose appears; JVP versus VJP; the cost asymmetry that decides forward versus reverse mode.
Labs: `la-vjp` (a three-layer chain drawn as maps, with the forward and reverse passes animated and
their costs counted).
Python: `jvp_chain`, `vjp_chain`, `mode_cost` (operation counts for both modes given layer shapes).

**Module 17 — Backpropagation as adjoint accumulation**
`id: …backpropagation-adjoints` · prereq: 16 · 30h · `17-backprop`
Spine: the computational graph; reverse accumulation; per-layer VJPs for linear, elementwise and
softmax-cross-entropy layers; checkpointing as a memory–compute trade.
Labs: `la-graphflow` (a small graph where you step the reverse pass node by node and watch adjoints
accumulate).
Python: `backward_linear`, `backward_softmax_ce`, `finite_difference_check`.
ML anchor: this is the module that makes a from-scratch training loop unmysterious.

**Module 18 — Second-order structure** `id: …second-order-curvature` · prereq: 17 · 32h · `18-curvature`
Spine: the Hessian and its spectrum; Gauss–Newton as a positive semidefinite surrogate; the Fisher
information and its equivalence to Gauss–Newton for exponential families; natural gradient; K-FAC as
a Kronecker approximation.
Labs: `la-curvature` (level sets of a quadratic with a draggable Hessian spectrum, Newton versus
gradient step drawn); `la-hvp` (Hessian-vector products without forming the Hessian).
Python: `hessian_vector_product`, `gauss_newton_step`, `spectral_summary`.

### Part VI · The research layer (19–26)

*Thesis: the linear algebra a research engineer actually argues with — claims about rank, spectra and
geometry made about real models, and the standards of evidence they need.*

**Module 19 — Low-rank structure in trained models** `id: …low-rank-models` · 26h · `19-lowrank`
LoRA and its reachable set; adapter composition; the difference between a low-rank *parameterization*
and a merely low-rank *initialization*; distillation and model surgery. Labs: `la-lora` (the reachable
update set drawn as a rank-constrained manifold in a small case). Python: `rank_of_product`,
`best_rank_k`, `merge_adapter`.

**Module 20 — Random projections and sketching** `id: …random-projections-sketching` · 28h · `20-sketch`
Johnson–Lindenstrauss with a proof sketch; subspace embeddings; sketched least squares; when a
sketch is safe and when it is not. Labs: `la-jl` (distortion of pairwise distances as the target
dimension drops). Python: `jl_projection`, `distortion_stats`, `sketched_lstsq`.

**Module 21 — Tensors as multilinear maps** `id: …tensors-contraction` · 26h · `21-tensors`
Contraction as the primitive; einsum read as a specification rather than a trick; reshapes and
memory layout; contraction cost and why the order matters. Labs: `la-einsum` (an einsum string with
its contraction drawn and its cost computed). Python: `einsum_cost`, `contract_pair`, `reshape_view`.

**Module 22 — Attention as a bilinear form** `id: …attention-bilinear` · 28h · `22-attention`
\(q^{\mathsf T}Kk\) as a bilinear form; the rank bound on \(QK^{\mathsf T}\) and what softmax does to it;
QK and OV circuits as compositions; positional structure as additive or multiplicative terms. Labs:
`la-attention` (a small score matrix with draggable queries/keys, its rank shown before and after
softmax). Python: `score_rank`, `softmax_rows`, `ov_circuit`.

**Module 23 — Kronecker and block structure** `id: …kronecker-block` · 24h · `23-kronecker`
The Kronecker product and its spectrum; vec and the mixed-product identity; block matrices and
Schur complements; structured parameterizations as constraints on reachable weights. Labs:
`la-kron` (a Kronecker product built visually from its factors). Python: `kron`, `vec_identity`,
`schur_complement`.

**Module 24 — Spectra of trained networks** `id: …spectra-trained-networks` · 30h · `24-spectra`
Marchenko–Pastur as the null model; heavy-tailed deviations and what they are claimed to mean;
spectral norm and Lipschitz bounds; the edge of stability. Labs: `la-mp` (empirical spectrum against
the MP law as aspect ratio changes). Python: `empirical_spectrum`, `mp_density`, `spectral_norm`.
This module is mostly about standards of evidence: most public claims here are underspecified.

**Module 25 — Superposition geometry and dictionary learning**
`id: …superposition-geometry` · 32h · `25-superposition`
Almost-orthogonal codes and how many fit; interference as a measurable quantity; compressed sensing
and the restricted isometry property; dictionary learning and sparse autoencoders as the practical
instrument. Labs: `la-superpose` (pack \(m\) unit vectors in \(\mathbb R^d\) and watch maximum
interference grow with \(m\)). Python: `max_coherence`, `sparse_recovery`, `dictionary_step`.
This is the payoff of Module 1's Theorem 2, four hundred hours later.

**Module 26 — Capstone: a linear-algebra audit of a real model** `id: …capstone-audit` · 30h · `26-audit`
No new theory. One model, one report: numerical rank per layer with stated tolerances, spectra
against the MP null, subspace overlap between layers, probe null spaces, an ablation whose predicted
effect follows from the rank argument. The deliverable is the report, and the checkpoint is whether a
sceptical reader could reproduce every number in it.

## 4. Infrastructure the plan needs

The current lab kit draws 2D vectors on a canvas. Five additions, each shared by several modules —
build them when the first module that needs them is written, not before.

| Addition | First needed | Used by |
|---|---|---|
| `chartkit.js` — axes, line and scatter, log scale, error curves | 8 | 8, 9, 12, 13, 20, 24 |
| `heatkit.js` — matrix heatmap with a diverging scale and a colour key | 8 | 8, 14, 21, 22, 23 |
| `plot3.js` — orthographic 3D: vectors, planes, a draggable camera *(built in Module 3)* | 3 | 3, 5, 6, 7 |
| `matrixbench.js` — the editable matrix widget generalized out of `la-elim` | 11 | 11, 12, 15, 23 |
| `graphkit.js` — small draggable graphs with adjacency and Laplacian | 14 | 14, 24 |

**The Python labs are stdlib only.** No NumPy in the browser runtime, so browser labs stay small:
3×3 and 4×4 matrices, a few hundred iterations. Anything needing real arrays belongs in Track B,
which runs locally. When a module's natural lab cannot be written in stdlib Python at a sensible
size, say so in the lesson rather than shipping a toy that misleads about cost.

## 5. Writing one module

1. **Fix the spine.** Two to five results the module exists to establish. If you cannot name them,
   the module is not ready to write.
2. **Write the teaching sections** with their practice prompts. This is the part that most repays
   care and the strongest model available: the value is in the hedging — what a theorem forces versus
   what remains empirical — and that is exactly what a weaker model smooths over.
3. **Specify the labs** before writing them: what the reader drags, what the readout says, and which
   misconception the degenerate preset exposes. A lab with no failure state is decoration.
4. **Write the labs** against `GU.labkit`, declaring every control before `K.plot`, since the draw
   function runs once during construction. Register with `GU.lab(id, mount)`.
5. **Write the Python labs**: stub in `labs/exercises.py`, reference in `labs/reference.py`, checks in
   `labs/checks.py`, registry entry in `labs/browser_labs.json`. Checks should cover the degenerate
   case, input preservation, and invalid input, not just the happy path.
6. **Write the exercise bank** in the fixed grammar, then the answer bank with typed fields wherever
   an answer is typeable. Verify every numeric answer by running it, not by reading it.
7. **Validate**: `node scripts/build-theory.mjs && node scripts/check-theory.mjs`, then
   `python -m labs.checks --reference`.
8. **Read it in the reader** in both themes, work one exercise end to end, and check that a lab's
   degenerate preset still says something true.

Steps 4, 5 and the mechanical half of 6 follow established patterns and are good candidates for a
cheaper model working from an existing module as the template. Steps 1, 2 and the proofs in 6 are not.

## 6. Write order

Dependencies allow some freedom; these three sequences are each internally ordered and can be worked
in parallel by different people or sessions.

- **Spine first:** 3 → 4 → 6 → 7 → 8. This is the classical core and the prerequisite for everything
  else; module 8 is the hinge the whole track turns on. Module 5 can be slotted in any time after 4.
- **Then applied numerics:** 9 → 10 → 12 → 11 → 13 → 14. Note 12 before 11: iterative methods connect
  directly to optimization and are more useful sooner than blocking and BLAS levels.
- **Then the autodiff line:** 15 → 16 → 17 → 18, which needs only 10 and can start early if the
  interest is training rather than theory.
- **The research layer** 19–26 needs 8, and each module is close to independent of the others. Write
  them in whatever order the current work makes urgent; 26 comes last by construction.

**Milestones worth naming.** After 8, the track can honestly claim to cover undergraduate linear
algebra. After 18, a reader can derive and implement a training step from first principles. After 26,
the track does what it set out to do: let someone read a paper's linear-algebra claims and say
precisely which are theorems, which are measurements, and which are neither.

## 7. Open questions

- **Module 5's weight.** Twenty hours on determinants is generous for something computationally
  marginal. If the track runs long, this is the first module to compress into a section of 6.
- **Where PCA lives.** Currently inside module 8 to keep the `svd-pca` id truthful. If PCA grows past
  a section it should become its own module and the id should move with the statistical material.
- **Whether Part IV should precede Part V.** Autodiff needs almost nothing from numerics; a reader
  who wants to build rather than analyse would be better served by 15–18 immediately after 10.
- **Interference between tracks.** Modules 18 and 24 overlap the optimization track's material on
  curvature and training dynamics. Decide per module which track owns the treatment and have the
  other link to it, rather than writing both.
