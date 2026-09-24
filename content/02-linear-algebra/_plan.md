# Linear algebra — build plan

*An authoring brief in the [shared curriculum format](../_plans.md). Existing coverage is recorded separately from proposed additions. This file is excluded from the lesson reader.*

## 1. Target and current state

Develop exact vector-space arguments into numerically trustworthy algorithms, then use them to audit model geometry. The RE route emphasizes stable computation, matrix-free implementation, and measured cost; the RS route emphasizes proof assumptions, invariance, and falsifiable claims about representations. Retain the original 26-module scope and all eight authored lessons. Modules 01–02 now receive full briefs, and every research module receives explicit prerequisites and role-specific gates.

**Coverage audit:** 8 authored lessons, 24 registered browser Python tasks, and 224 hours in current lesson metadata. **Planned scope:** 26 modules and 728 estimated study hours, including the existing 224 hours; 18 modules are new. Existing-module hours are retained as baseline estimates, not an assertion that their expansion work costs nothing. Re-estimate when writing. These are comprehensive curriculum estimates, not a required preparation schedule; count reused capstones only once.

**Status vocabulary.** “Authored / expand” means the linked lesson and listed Python tasks exist, with targeted additions or verification still planned. It does not certify complete coverage or external review. “New” means no lesson, bank, figure, or Python task is being claimed as implemented. The module map and detailed briefs distinguish these states.

### Existing-lesson update completed

LA01–LA08 retain their derivations, interactive figures and 24 registered Python tasks. Each now has a bounded local audit and an additional checked cumulative exercise: scale-aware rank; pivot growth/backward error; normal-equation versus QR/SVD diagnostics; QR reconstruction versus orthogonality; sign/log-volume; nonnormal spectral sensitivity; the complex-Hermitian convention; and stable subspace/held-out PCA comparisons. Full new modules below remain planned.

### Coverage and remaining work

| Handle | Current coverage and evidence | Still to add or verify |
|---|---|---|
| LA01 | [01-vectors-spaces-bases.md](01-vectors-spaces-bases.md). Vector-space axioms, dimension bound, subspaces, bases/coordinates, affine sets, Gram/metric previews, numerical dependence, and three interactive workbenches. | Scale-sensitive local rank audit added; broader representation datasets remain an extension. |
| LA02 | [02-systems-elimination-subspaces.md](02-systems-elimination-subspaces.md). Elimination, rank-nullity, complete solution sets, all four fundamental subspaces, partial-pivot LU, and near-singular experiments. | Pivot-growth and local backward-error audit added; a full perturbation treatment remains LA09. |
| LA03 | [03-projections-least-squares.md](03-projections-least-squares.md). General metrics, Cauchy–Schwarz, orthogonal complements, projection theorem, rank-deficient least squares, weighted residuals, and linked geometric experiments. | Added a local algorithm-comparison protocol linked to the existing QR/SVD lessons; a broader numerical implementation remains LA11. |
| LA04 | [04-orthonormal-bases-qr.md](04-orthonormal-bases-qr.md). Classical/modified Gram–Schmidt, reorthogonalization, reduced/complete/metric QR, triangular least-squares solves, and orthogonal initialization. | Reconstruction/orthogonality comparison across scales added; full Householder/blocked QR remains LA11. |
| LA05 | [05-determinants-volume.md](05-determinants-volume.md). Multilinear/alternating definition, elimination sign bookkeeping, multiplicativity, QR volume proof, cofactors, and density-volume examples. | Small sign/log-absolute-determinant extension added; production factorization algorithms remain LA11. |
| LA06 | [06-eigenvalues-diagonalization.md](06-eigenvalues-diagonalization.md). Invariant subspaces, characteristic polynomial, real/complex distinctions, defects, matrix powers, transient growth, and qualified power-iteration convergence. | Local nonnormal sensitivity counterexample added; Schur decomposition and the full pseudospectral extension remain LA13. |
| LA07 | [07-spectral-theorem-quadratic-forms.md](07-spectral-theorem-quadratic-forms.md). Calculus-free symmetric spectral theorem, variational eigenvalue results, Rayleigh/residual identities, PSD/PD geometry, and Cholesky pivot audits. | Short complex-Hermitian analogue added; Fourier applications remain LA13/LA14 and covariance assumptions stay in PS04. |
| LA08 | [08-svd-low-rank.md](08-svd-low-rank.md). Full/reduced/compact SVD, four subspaces, spectral/Frobenius Eckart–Young proofs, centered affine PCA, whitening, and minimum-norm preview. | Held-out reconstruction and repeated-singular-value projector comparisons added; larger empirical audits remain extensions. |
| LA09 | No authored lesson. Previewed in LA01–LA08; no dedicated lesson. | Full perturbation/backward-error development; norm controls and scale-aware condition experiments. |
| LA10 | No authored lesson. Minimum-norm channels previewed in LA08; no full treatment. | Moore–Penrose identities, rank-deficient solves, ridge spectral filters, and explicit implicit-bias conditions. |
| LA11 | No authored lesson. Small LU, QR, and Cholesky exist; blocked/Householder methods do not. | Householder QR, blocked LU/Cholesky, triangular solves, BLAS cost models, and stable log-determinants. |
| LA12 | No authored lesson. No dedicated iterative-solver lesson. | Stationary splittings, steepest descent, conjugate gradients, residual stopping, and preconditioners; LA11 is no longer a required predecessor. |
| LA13 | No authored lesson. Power iteration exists; advanced spectral methods do not. | Lanczos, reorthogonalization, Ritz residuals, real/complex Schur outline, randomized SVD, and spectral-gap sensitivity; a limited pseudospectrum example. |
| LA14 | No authored lesson. No dedicated sparse/structured lesson. | Sparse storage, fill-in/orderings, matrix-free actions, graph Laplacians, Toeplitz/circulant families, and a complex-DFT bridge. |
| LA15 | No authored lesson. No dedicated matrix-calculus lesson. | Fréchet derivative/local linearization, shape/layout convention, matrix products, quadratic forms, and softmax derivatives. |
| LA16 | No authored lesson. No dedicated adjoint lesson. | Adjoint definitions in Euclidean/general metrics, JVP/VJP composition, and mode cost/memory accounting. |
| LA17 | No authored lesson. No dedicated backpropagation lesson in this track. | Branched graphs, fan-out accumulation, broadcast/reduction adjoints, stable softmax-cross-entropy, and checkpointing cost. |
| LA18 | No authored lesson. Curvature is previewed in LA07; structured differential treatment is absent. | HVPs, generalized Gauss–Newton, model versus empirical Fisher, natural gradient, and K-FAC approximation assumptions. |
| LA19 | No authored lesson. No dedicated low-rank model lesson. | Low-rank updates, tangent/reachable sets, adapter composition/merging, rank budgets, and surgery/distillation geometry. |
| LA20 | No authored lesson. JL is taught probabilistically in PS12; no computational sketching lesson. | Subspace embeddings, sketched least squares, leverage/coherence effects, and held-out distortion diagnostics. |
| LA21 | No authored lesson. Basic matrix shape notation exists; no multilinear unit. | Tensor products and multilinear maps, einsum semantics, contraction order, logical reshape versus storage, and explicit cost models. |
| LA22 | No authored lesson. Attention-related overlap examples appear early; no full algebraic treatment. | QK/OV composition, bilinear forms, pre-softmax score-rank bounds, softmax rank changes, positional structure, and multi-head gauge freedoms. |
| LA23 | No authored lesson. Block notation is used in Gaussian lessons; no dedicated algebraic derivation. | Vectorization conventions, Kronecker identities/spectra, block elimination, Schur complements, and structured solve costs. |
| LA24 | No authored lesson. Spectral basics and an MP preview exist; no trained-model audit. | Random-matrix null assumptions, spectral normalization/centering, singular versus covariance spectra, Lipschitz bounds, and qualified edge-of-stability studies. |
| LA25 | No authored lesson. LA01 establishes the dimension/interference motivation; no dedicated recovery or dictionary unit. | Coherence, sparse identifiability, RIP as a sufficient condition, recovery objectives, dictionary symmetries, and sparse autoencoder diagnostics. |
| LA26 | No authored lesson. No integrated capstone lesson or report template. | A reproducible audit combining rank, spectra, subspace comparisons, and an ablation predicted by the algebra. |

## 2. Teaching and authoring contract

LA01–LA08 already have numbered practice with static hints, three registered Python tasks each, registered interactive figures, and answer banks `01-span` through `08-svd`. Preserve those bank keys and the original reserved keys for LA09–LA26; do not rename them to the newer track-prefix convention. Preserve the existing exercise grammar, including historical checkpoint difficulty labels accepted by the reader. The remaining 18 modules have briefs only. Existing figures and functions are identified explicitly below; future figures, even when their names appeared in the old plan, remain unimplemented.

Apply the [shared exercise, hint, answer-bank, and checkpoint contracts](../_plans.md#4-shared-lesson-authoring-contract). Numbered teaching sections end with Foundation / Core / Stretch practice and static hints. Each lesson develops a finite or geometric example before abstraction, states theorem assumptions, includes a prediction/reveal experiment with a failure preset, and closes with derivations, cumulative practice, and the six-part checkpoint. Each module also has separate RE and RS evidence gates below. Authoring freedom remains: add linked views, examples, and misconception checks whenever they improve understanding.

**Identifiers and dependencies.** Handles `LANN` are planning references. Preserve every existing filename, content ID, lab/task ID, and bank key. New content IDs use `math.linear-algebra.<slug>` unless explicitly specified; filenames use the reserved two-digit number and slug. Future IDs and bank names below are reservations, not registrations. Module-map prerequisites govern the proposed teaching route; additional or revised prerequisites on authored lessons are planning changes only until their front matter and inbound references are deliberately migrated.

**Ownership boundary.** LA01 previews dot products and Gram matrices; LA02 uses the standard dot product for subspace intersection arguments; LA03 owns general inner products and orthogonal projection; LA04 owns Gram–Schmidt. Early numerical previews may call supplied routines but must not require implementing later algorithms. LA15–LA18 own matrix derivatives and adjoint/curvature identities; Optimization owns convergence and update algorithms. PS12 owns concentration/JL probability, LA20 owns computational sketching; PS04 owns Gaussian conditioning, LA23 owns Schur-complement algebra; DL16 owns neural interpretability experiments, LA25 owns sparse geometry.

## 3. Module map

| Handle | Module | Status | Hours | Prerequisites |
|---|---|---|---:|---|
| LA01 | Vectors, span, independence, and bases | Authored / expand | 30 | F00 |
| LA02 | Systems, elimination, and the four subspaces | Authored / expand | 28 | LA01 |
| LA03 | Inner products, projection, and least squares | Authored / expand | 30 | LA02 |
| LA04 | Orthonormal bases, Gram–Schmidt, and QR | Authored / expand | 24 | LA03 |
| LA05 | Determinants as signed volume | Authored / expand | 20 | LA04 |
| LA06 | Eigenvalues, invariant subspaces, and diagonalization | Authored / expand | 30 | LA05 |
| LA07 | Spectral theorem and quadratic forms | Authored / expand | 28 | LA06 |
| LA08 | SVD, low-rank approximation, and PCA | Authored / expand | 34 | LA07 |
| LA09 | Norms, conditioning, and numerical stability | New | 26 | LA08, F01 |
| LA10 | Pseudoinverse and regularization | New | 26 | LA09 |
| LA11 | Direct solvers and memory-aware factorization | New | 26 | LA10, PY06 |
| LA12 | Iterative solvers and preconditioning | New | 30 | LA10, OPT02 |
| LA13 | Krylov, Schur, and randomized spectral methods | New | 30 | LA12, PS12 |
| LA14 | Sparse and structured matrices | New | 24 | LA11, LA13, DS06 |
| LA15 | Matrix calculus I: derivatives and Jacobians | New | 28 | LA10, OPT01 |
| LA16 | Matrix calculus II: chain rule and adjoints | New | 28 | LA15 |
| LA17 | Backpropagation as adjoint accumulation | New | 30 | LA16, PY06 |
| LA18 | Second-order structure and natural geometry | New | 32 | LA17, LA23, PS11 |
| LA19 | Low-rank structure in trained models | New | 26 | LA10, LA17 |
| LA20 | Random projections and sketching | New | 28 | LA10, PS12 |
| LA21 | Tensors, contractions, and memory layout | New | 26 | LA08, PY06 |
| LA22 | Attention as a bilinear map | New | 28 | LA21, LA16 |
| LA23 | Kronecker products, block matrices, and Schur complements | New | 24 | LA10, LA21 |
| LA24 | Spectra of trained networks | New | 30 | LA13, PS12, OPT05 |
| LA25 | Superposition, compressed sensing, and dictionary learning | New | 32 | LA20, LA17, OPT07 |
| LA26 | Capstone: a linear-algebra audit of a model | New | 30 | LA19, LA22, LA24, LA25, RP04 |

## 4. Detailed module briefs

### Part I · Structure

*Thesis: coordinates describe a vector, while subspaces and rank describe what a map can do.*

**Module 01 — Vectors, span, independence, and bases**

`handle: LA01` · `id: math.linear-algebra.vectors-spaces-bases` · 30h · prerequisites: F00 · existing bank: `01-span`

**Already covered:** Vector-space axioms, dimension bound, subspaces, bases/coordinates, affine sets, Gram/metric previews, numerical dependence, and three interactive workbenches.

**Add or verify:** Scale-sensitive local rank audit added; broader representation datasets remain an extension.

**Existing artifacts:** [01-vectors-spaces-bases.md](01-vectors-spaces-bases.md); registered Python tasks: `span` → `span_coordinates`, `dependence` → `dependency_relation`, `coordinates` → `basis_coordinates`. Registered lesson figures: `la-vectors`, `la-span`, `la-basis`.

**Spine and derivations:** Prove the dimension bound and basis-coordinate uniqueness; distinguish vectors from coordinates and exact dependence from a numerical rank decision.

**Interactive experiment:** Existing la-vectors, la-span, and la-basis: drag generators, change basis/metric, and compare exact collapse with near dependence.

**Implementation ladder:** Keep span_coordinates, dependency_relation, and basis_coordinates. Extend local checks to rescaled inputs and dimension-limited embedding examples.

**RE gate:** Explain a rank verdict and show how rescaling changes an inappropriate absolute tolerance.

**RS gate:** Prove a dimension claim and explain why small pairwise overlap does not imply independence.


**Module 02 — Systems, elimination, and the four subspaces**

`handle: LA02` · `id: math.linear-algebra.linear-maps-rank` · 28h · prerequisites: LA01 · existing bank: `02-elimination`

**Already covered:** Elimination, rank-nullity, complete solution sets, all four fundamental subspaces, partial-pivot LU, and near-singular experiments.

**Add or verify:** Pivot-growth and local backward-error audit added; a full perturbation treatment remains LA09.

**Existing artifacts:** [02-systems-elimination-subspaces.md](02-systems-elimination-subspaces.md); registered Python tasks: `echelon` → `row_echelon`, `solve-complete` → `solve_complete`, `lu` → `lu_factor`. Registered lesson figures: `la-elim`, `la-picture`, `la-map`.

**Spine and derivations:** Derive solution existence/uniqueness and null-space parameterization; prove rank-nullity and the standard-dot-product row/null orthogonality.

**Interactive experiment:** Existing la-elim, la-picture, and la-map: step through elimination and vary a matrix between full rank, near singular, and exact collapse.

**Implementation ladder:** Keep row_echelon, solve_complete, and lu_factor; compare PA with LU and check residuals for consistent and inconsistent systems.

**RE gate:** Return a complete solution description and diagnose a tolerance-induced rank mistake.

**RS gate:** Prove why arbitrary pivot choices preserve exact solution sets but not necessarily numerical behavior.


### Part II · Geometry

*Thesis: an inner product turns algebraic structure into projection and metric-dependent statements.*

**Module 03 — Inner products, projection, and least squares**

`handle: LA03` · `id: math.linear-algebra.projections-least-squares` · 30h · prerequisites: LA02 · existing bank: `03-projection`

**Already covered:** General metrics, Cauchy–Schwarz, orthogonal complements, projection theorem, rank-deficient least squares, weighted residuals, and linked geometric experiments.

**Add or verify:** Added a local algorithm-comparison protocol linked to the existing QR/SVD lessons; a broader numerical implementation remains LA11.

**Existing artifacts:** [03-projections-least-squares.md](03-projections-least-squares.md); registered Python tasks: `project-onto` → `project_onto`, `normal-equations` → `normal_equations`, `gram-metric` → `gram_metric`. Registered lesson figures: `la-map`, `la-project`, `la-lsq`.

**Spine and derivations:** Prove projection existence/uniqueness in finite dimensions, normal equations, the excess-error identity, and uniqueness of fitted values despite nonunique coefficients.

**Interactive experiment:** Existing la-project/la-lsq and reused la-map: vary candidate projection and metric, inspect residual orthogonality and degenerate design matrices.

**Implementation ladder:** Keep project_onto, normal_equations, and gram_metric; use small exact cases and invalid/non-PD metric inputs.

**RE gate:** Explain why a correct normal-equation formula may be a poor solver.

**RS gate:** Distinguish orthogonality under different metrics and prove the least-squares optimality condition.

**Implementation notes retained:** a candidate-versus-projection experiment exposing the excess-error identity, prediction/reveal prompts, and linked data/observation-space views for three-point regression. The shared `plot3.js` supplies orthographic vector/plane drawing and a draggable camera.


**Module 04 — Orthonormal bases, Gram–Schmidt, and QR**

`handle: LA04` · `id: math.linear-algebra.orthonormal-bases-qr` · 24h · prerequisites: LA03 · existing bank: `04-qr`

**Already covered:** Classical/modified Gram–Schmidt, reorthogonalization, reduced/complete/metric QR, triangular least-squares solves, and orthogonal initialization.

**Add or verify:** Reconstruction/orthogonality comparison across scales added; full Householder/blocked QR remains LA11.

**Existing artifacts:** [04-orthonormal-bases-qr.md](04-orthonormal-bases-qr.md); registered Python tasks: `gram-schmidt` → `gram_schmidt`, `qr-solve` → `qr_solve`, `orthogonality-defect` → `orthogonality_defect`. Registered lesson figures: `la-gramschmidt`.

**Spine and derivations:** Derive Gram–Schmidt and QR, state full-rank and sign conventions for uniqueness, and derive least squares through a triangular system.

**Interactive experiment:** Existing la-gramschmidt: vary near dependence and float precision; inspect normalization, overlap, and reconstruction independently.

**Implementation ladder:** Keep gram_schmidt, qr_solve, and orthogonality_defect; compare classical, modified, and two-pass variants.

**RE gate:** Diagnose a factorization with a small residual but poor orthogonality.

**RS gate:** Explain the difference between exact QR existence and numerical stability of a specific construction.

**Implementation notes retained:** a step-by-step subtraction view paired with completed CGS/MGS directions, float32/float64 arithmetic switching, and separate overlap, normalization, and reconstruction audits. The solver lab uses two-pass MGS and accumulates corrections into R; dense library Householder QR is distinguished from these teaching algorithms.


**Module 05 — Determinants as signed volume**

`handle: LA05` · `id: math.linear-algebra.determinants-volume` · 20h · prerequisites: LA04 · existing bank: `05-determinant`

**Already covered:** Multilinear/alternating definition, elimination sign bookkeeping, multiplicativity, QR volume proof, cofactors, and density-volume examples.

**Add or verify:** Small sign/log-absolute-determinant extension added; production factorization algorithms remain LA11.

**Existing artifacts:** [05-determinants-volume.md](05-determinants-volume.md); registered Python tasks: `det-by-elimination` → `det_by_elimination`, `volume-ratio` → `volume_ratio`, `cofactor-2x2` → `cofactor_2x2`. Registered lesson figures: `la-det`.

**Spine and derivations:** Derive uniqueness from the determinant axioms, det(AB), orientation/volume scaling, and the limited change-of-variables preview.

**Interactive experiment:** Existing la-det: drag 2D/3D cells, compare thin versus collapsed shapes, and inspect inverse-density readouts.

**Implementation ladder:** Keep det_by_elimination, volume_ratio, and cofactor_2x2; test nonstandard source cells and swap signs.

**RE gate:** Choose a determinant representation that does not overflow and avoid using its magnitude as a rank test.

**RS gate:** Distinguish an algebraic volume identity from the calculus hypotheses needed for a density transformation.

**Implementation notes retained:** separate draggable 2D/3D cells, signed coordinate-piece overlays, equal-mass markers with inverse-density readout, exact-collapse versus thin presets, and keyboard matrix entry. The Python determinant tracks swaps without an absolute rank cutoff; the volume task tests a nonstandard source cell. The chapter separates exact algebra, floating-point evidence, and the calculus assumptions behind density changes.


**Module 06 — Eigenvalues, invariant subspaces, and diagonalization**

`handle: LA06` · `id: math.linear-algebra.eigen-invariant-subspaces` · 30h · prerequisites: LA05 · existing bank: `06-eigen`

**Already covered:** Invariant subspaces, characteristic polynomial, real/complex distinctions, defects, matrix powers, transient growth, and qualified power-iteration convergence.

**Add or verify:** Local nonnormal sensitivity counterexample added; Schur decomposition and the full pseudospectral extension remain LA13.

**Existing artifacts:** [06-eigenvalues-diagonalization.md](06-eigenvalues-diagonalization.md); registered Python tasks: `power-iteration` → `power_iteration`, `char-poly-2x2` → `char_poly_2x2`, `diagonalizable-2x2` → `is_diagonalizable_2x2`. Registered lesson figures: `la-eigen`, `la-power`.

**Spine and derivations:** Prove diagonalization criteria in stated cases; derive power iteration under a spectral gap and nonzero dominant component; contrast spectral radius with transient amplification.

**Interactive experiment:** Existing la-eigen/la-power: edit eigenlines, sign flips, rotations, annihilation, missed dominant components, and nearly tied eigenvalues.

**Implementation ladder:** Keep power_iteration, char_poly_2x2, and is_diagonalizable_2x2 with its exact-integer small-case contract.

**RE gate:** Interpret a small eigenpair residual without claiming dominance or a multiplicity theorem.

**RS gate:** Construct a nonnormal matrix with transient growth despite asymptotic decay.

**Implementation notes retained:** a probe-and-reveal eigenline hunt with draggable columns and keyboard entry; linked normalized-direction and raw-log-length histories exposing sign flips, close eigenvalues, missed dominant components, rotation, annihilation, and stable transient growth. The Python solver reports residual convergence without certifying dominance; real 2×2 diagonalizability uses exact integer arithmetic to avoid presenting a floating-point tolerance as a multiplicity theorem. The chapter distinguishes real and complex diagonalization, states Jordan existence without proof, and reserves the spectral theorem and quadratic forms for Module 7.


**Module 07 — Spectral theorem and quadratic forms**

`handle: LA07` · `id: math.linear-algebra.spectral-theorem-quadratic-forms` · 28h · prerequisites: LA06 · existing bank: `07-spectral`

**Already covered:** Calculus-free symmetric spectral theorem, variational eigenvalue results, Rayleigh/residual identities, PSD/PD geometry, and Cholesky pivot audits.

**Add or verify:** Short complex-Hermitian analogue added; Fourier applications remain LA13/LA14 and covariance assumptions stay in PS04.

**Existing artifacts:** [07-spectral-theorem-quadratic-forms.md](07-spectral-theorem-quadratic-forms.md); registered Python tasks: `rayleigh-quotient` → `rayleigh_quotient`, `cholesky` → `cholesky`, `is-pd` → `is_pd`. Registered lesson figures: `la-quadform`.

**Spine and derivations:** Prove the real symmetric spectral theorem, characterize quadratic signs and Rayleigh extrema, and derive Cholesky for positive-definite matrices.

**Interactive experiment:** Existing la-quadform: drag eigenvalues and a unit probe; compare bounded bowls, flat compatible valleys, tilted unbounded valleys, and saddles.

**Implementation ladder:** Keep rayleigh_quotient, cholesky, and is_pd, preserving documented relative pivot cutoffs.

**RE gate:** Distinguish invalid input, mathematical indefiniteness, and numerical non-acceptance.

**RS gate:** Explain why PSD curvature alone does not imply a unique minimizer or bounded affine-quadratic objective.

**Implementation notes retained:** a calculus-free sphere-maximization proof; variational min–max and residual identities; linked conic level sets, a draggable unit probe, and a full directional Rayleigh trace; exact flat/saddle/zero presets; a computed Cholesky pivot audit; and the distinction between a flat quadratic with compatible linear term and an unbounded tilted valley. The Python tests use a documented relative pivot cutoff and distinguish invalid data from numerical non-acceptance.


### Part III · Decomposition and conditioning

*Thesis: singular directions quantify approximation and sensitivity.*

**Module 08 — SVD, low-rank approximation, and PCA**

`handle: LA08` · `id: math.linear-algebra.svd-pca` · 34h · prerequisites: LA07 · existing bank: `08-svd`

**Already covered:** Full/reduced/compact SVD, four subspaces, spectral/Frobenius Eckart–Young proofs, centered affine PCA, whitening, and minimum-norm preview.

**Add or verify:** Held-out reconstruction and repeated-singular-value projector comparisons added; larger empirical audits remain extensions.

**Existing artifacts:** [08-svd-low-rank.md](08-svd-low-rank.md); registered Python tasks: `svd-2x2` → `svd_2x2`, `truncate-rank` → `truncate_rank`, `explained-variance` → `explained_variance`. Registered lesson figures: `la-svd`, `la-approx`, `la-pca`.

**Spine and derivations:** Construct SVD from the spectral theorem, prove both low-rank error bounds, and derive centered PCA as an affine reconstruction problem.

**Interactive experiment:** Existing la-svd/la-approx/la-pca: compare paired directions, rank-one removal, fixed-scale error maps, and isotropic/identical data.

**Implementation ladder:** Keep svd_2x2, truncate_rank, and explained_variance; preserve the undefined zero-total-variance case.

**RE gate:** Report approximation error and numerical-rank tolerance, including omitted null directions.

**RS gate:** Explain why individual singular vectors can be unstable while a separated subspace remains meaningful.

**Implementation notes retained:** paired input/output views with draggable matrix columns and rank-one deletion; fixed-scale original/reconstruction/residual heatmaps and a rank-error curve; draggable PCA observations with a candidate-versus-optimal line, centering switch, and isotropic/identical-point failure cases. A short minimum-norm channel derivation preserves the optimization track's inbound reference; Module 10 still owns the full pseudoinverse. The new shared chartkit and heatkit support later modules, and svdkit provides explicitly limited 2×2 teaching geometry. Python tasks cover scaled 2×2 factors, rectangular truncation, and squared variance accounting, including undefined zero-total ratios.


**Module 09 — Norms, conditioning, and numerical stability**

`handle: LA09` · `id: math.linear-algebra.norms-conditioning-stability` · 26h · prerequisites: LA08, F01 · proposed bank: `09-conditioning`

**Already covered:** Previewed in LA01–LA08; no dedicated lesson.

**Add or verify:** Full perturbation/backward-error development; norm controls and scale-aware condition experiments.

**Spine and derivations:** Derive induced norms, spectral norm, relative perturbation bounds with denominator conditions, and backward error; distinguish sensitivity from solver stability.

**Interactive experiment:** Proposed la-norms/la-condition: vary norm ball, singular spectrum, and perturbation direction; include a small-residual/large-forward-error case.

**Implementation ladder:** Implement matrix_norm_1_inf, condition_estimate, and cancellation_demo; estimate both extreme singular scales or use solves, not only a largest-eigenvalue iteration.

**RE gate:** Diagnose error using scale, residual, and conditioning together.

**RS gate:** Prove a qualified perturbation bound and expose the worst-direction assumption behind its ceiling.


**Module 10 — Pseudoinverse and regularization**

`handle: LA10` · `id: math.linear-algebra.pseudoinverse-regularization` · 26h · prerequisites: LA09 · proposed bank: `10-pseudoinverse`

**Already covered:** Minimum-norm channels previewed in LA08; no full treatment.

**Add or verify:** Moore–Penrose identities, rank-deficient solves, ridge spectral filters, and explicit implicit-bias conditions.

**Spine and derivations:** Derive all four pseudoinverse identities and the minimum-norm least-squares solution; show ridge filtering and zero-initialized least-squares GD's restricted minimum-norm result.

**Interactive experiment:** Proposed la-ridge: move the penalty and singular values; display stable predictions with unstable coefficients near collinearity.

**Implementation ladder:** Implement pinv_via_svd, ridge_solve, and min_norm_solution with explicit cutoffs; use library SVD locally and supplied tiny factors in-browser.

**RE gate:** Choose a rank cutoff or penalty and report its effect on predictions and parameter estimates.

**RS gate:** Explain why overparameterization alone does not force a minimum-norm solution; use PS06 for a separate statistical bias/variance extension.


### Part IV · Numerical algorithms

*Thesis: matrix actions and memory traffic matter as much as factorization identities.*

**Module 11 — Direct solvers and memory-aware factorization**

`handle: LA11` · `id: math.linear-algebra.direct-solvers-scale` · 26h · prerequisites: LA10, PY06 · proposed bank: `11-direct`

**Already covered:** Small LU, QR, and Cholesky exist; blocked/Householder methods do not.

**Add or verify:** Householder QR, blocked LU/Cholesky, triangular solves, BLAS cost models, and stable log-determinants.

**Spine and derivations:** Derive block updates and operation counts; contrast pivoting/orthogonality guarantees with memory-traffic models.

**Interactive experiment:** Proposed la-blocking: choose block size and watch touched submatrices, estimated operations, and traffic; flag that animation is not a hardware benchmark.

**Implementation ladder:** Implement cholesky_blocked, flop_count, and triangular_solve; add local Householder and sign/logdet checks.

**RE gate:** Match a reference solve and report residual, memory, and measured local timing.

**RS gate:** Explain when more arithmetic can still lead to faster execution and where the hardware model stops applying.


**Module 12 — Iterative solvers and preconditioning**

`handle: LA12` · `id: math.linear-algebra.iterative-solvers-cg` · 30h · prerequisites: LA10, OPT02 · proposed bank: `12-iterative`

**Already covered:** No dedicated iterative-solver lesson.

**Add or verify:** Stationary splittings, steepest descent, conjugate gradients, residual stopping, and preconditioners; LA11 is no longer a required predecessor.

**Spine and derivations:** Derive splitting convergence in its stated norm/spectral setting, CG conjugacy and exact-arithmetic finite termination, and conditioning-dependent bounds.

**Interactive experiment:** Proposed la-descent/la-precondition: change SPD spectrum and stopping tolerance; contrast exact 2D termination with finite-precision behavior.

**Implementation ladder:** Implement jacobi_iteration, conjugate_gradient, and residual_history with breakdown and invalid-SPD handling.

**RE gate:** Solve from matrix-vector actions and distinguish stopping tolerance from solution accuracy.

**RS gate:** Prove a CG property and explain why its SPD/exact-arithmetic claims do not extend unchanged to arbitrary matrices.


**Module 13 — Krylov, Schur, and randomized spectral methods**

`handle: LA13` · `id: math.linear-algebra.krylov-randomized-eigen` · 30h · prerequisites: LA12, PS12 · proposed bank: `13-krylov`

**Already covered:** Power iteration exists; advanced spectral methods do not.

**Add or verify:** Lanczos, reorthogonalization, Ritz residuals, real/complex Schur outline, randomized SVD, and spectral-gap sensitivity; a limited pseudospectrum example.

**Spine and derivations:** Derive Krylov projection and Ritz residual tests; state randomized approximation bounds with oversampling, failure probability, and spectrum assumptions.

**Interactive experiment:** Proposed la-krylov/la-randsvd: change gap, sketch size, and precision; reveal ghost Ritz values and missed subspaces.

**Implementation ladder:** Implement lanczos_tridiag, randomized_range_finder, and ritz_values; use supplied small eigensolvers in-browser and stable libraries locally.

**RE gate:** Report residuals, orthogonality loss, and randomness alongside approximate eigenvalues.

**RS gate:** Distinguish a residual guarantee from eigenvector/subspace accuracy and from dominance.


**Module 14 — Sparse and structured matrices**

`handle: LA14` · `id: math.linear-algebra.sparse-structured` · 24h · prerequisites: LA11, LA13, DS06 · proposed bank: `14-sparse`

**Already covered:** No dedicated sparse/structured lesson.

**Add or verify:** Sparse storage, fill-in/orderings, matrix-free actions, graph Laplacians, Toeplitz/circulant families, and a complex-DFT bridge.

**Spine and derivations:** Derive graph quadratic energy, zero-eigenvalue multiplicity for components, and circulant diagonalization with conjugate-transpose conventions.

**Interactive experiment:** Proposed la-graph: edit edges and ordering; display Laplacian spectrum, disconnected components, fill-in, and a nonunique Fiedler direction.

**Implementation ladder:** Implement sparse_matvec, laplacian_from_edges, and fiedler_vector using a local reference solver; benchmark storage separately from toy counts.

**RE gate:** Implement a matrix-free operator and account for fill-in and index-storage overhead.

**RS gate:** State when a spectral partition is ambiguous and why sparsity alone does not guarantee a fast factorization.


### Part V · Calculus on matrices

*Thesis: derivatives are linear maps and backpropagation composes their adjoints.*

**Module 15 — Matrix calculus I: derivatives and Jacobians**

`handle: LA15` · `id: math.linear-algebra.matrix-calculus-jacobians` · 28h · prerequisites: LA10, OPT01 · proposed bank: `15-calculus`

**Already covered:** No dedicated matrix-calculus lesson.

**Add or verify:** Fréchet derivative/local linearization, shape/layout convention, matrix products, quadratic forms, and softmax derivatives.

**Spine and derivations:** Derive differential rules for Ax, matrix products, quadratic forms, and softmax; quantify local linearization error on smooth maps.

**Interactive experiment:** Proposed la-jacobian: move input and neighborhood radius; compare exact mapped points and the Jacobian ellipse at a singular derivative.

**Implementation ladder:** Implement numeric_jacobian, jacobian_check, and local_linearization_error with step-size sweeps.

**RE gate:** Verify derivatives in random directions with documented shapes and scales.

**RS gate:** Explain the difference between a derivative map and its coordinate matrix, including layout conventions.


**Module 16 — Matrix calculus II: chain rule and adjoints**

`handle: LA16` · `id: math.linear-algebra.chain-rule-adjoints` · 28h · prerequisites: LA15 · proposed bank: `16-adjoints`

**Already covered:** No dedicated adjoint lesson.

**Add or verify:** Adjoint definitions in Euclidean/general metrics, JVP/VJP composition, and mode cost/memory accounting.

**Spine and derivations:** Derive the chain rule as composition and the adjoint identity; show why transposes appear under Euclidean coordinates and how metrics change them.

**Interactive experiment:** Proposed la-vjp: vary layer shapes and metric; compare forward/reverse arithmetic and a transpose mistaken for a general-metric adjoint.

**Implementation ladder:** Implement jvp_chain, vjp_chain, and mode_cost with an inner-product consistency check.

**RE gate:** Choose differentiation mode from input/output dimensions and intermediate storage.

**RS gate:** Prove an adjoint-composition identity and state the metric under which the matrix transpose represents it.


**Module 17 — Backpropagation as adjoint accumulation**

`handle: LA17` · `id: math.linear-algebra.backpropagation-adjoints` · 30h · prerequisites: LA16, PY06 · proposed bank: `17-backprop`

**Already covered:** No dedicated backpropagation lesson in this track.

**Add or verify:** Branched graphs, fan-out accumulation, broadcast/reduction adjoints, stable softmax-cross-entropy, and checkpointing cost.

**Spine and derivations:** Derive reverse accumulation and per-layer VJPs; show why every outgoing use contributes to a shared variable's adjoint.

**Interactive experiment:** Proposed la-graphflow: step through a branched graph and remove an accumulation edge; compare analytic and finite-difference derivatives.

**Implementation ladder:** Implement backward_linear, backward_softmax_ce, and finite_difference_check; extend to a shared-parameter graph locally.

**RE gate:** Find a missing-gradient contribution and demonstrate parity after the repair.

**RS gate:** Derive the executed function's gradient and explain how a stop-gradient changes the mathematical program.


**Module 18 — Second-order structure and natural geometry**

`handle: LA18` · `id: math.linear-algebra.second-order-curvature` · 32h · prerequisites: LA17, LA23, PS11 · proposed bank: `18-curvature`

**Already covered:** Curvature is previewed in LA07; structured differential treatment is absent.

**Add or verify:** HVPs, generalized Gauss–Newton, model versus empirical Fisher, natural gradient, and K-FAC approximation assumptions.

**Spine and derivations:** Derive HVP identities and GGN PSD structure; state precisely when an exponential-family output model yields the GGN/model-Fisher identity.

**Interactive experiment:** Proposed la-curvature/la-hvp: vary residual curvature and damping; compare Hessian, GGN, and empirical Fisher on an exact small model.

**Implementation ladder:** Implement hessian_vector_product, gauss_newton_step, and spectral_summary with a dense oracle; leave optimizer performance comparisons to OPT08.

**RE gate:** Compute a curvature action without constructing the dense Hessian and audit damping.

**RS gate:** Explain why empirical Fisher, model Fisher, and Hessian are not interchangeable and identify each approximation in K-FAC.


### Part VI · Research geometry

*Thesis: rank, spectra, and representation claims need both mathematical qualifications and empirical controls.*

**Module 19 — Low-rank structure in trained models**

`handle: LA19` · `id: math.linear-algebra.low-rank-models` · 26h · prerequisites: LA10, LA17 · proposed bank: `19-lowrank`

**Already covered:** No dedicated low-rank model lesson.

**Add or verify:** Low-rank updates, tangent/reachable sets, adapter composition/merging, rank budgets, and surgery/distillation geometry.

**Spine and derivations:** Derive rank bounds for products and sums; distinguish a fixed low-rank parameterization from unconstrained training after low-rank initialization.

**Interactive experiment:** Proposed la-lora: change factors/rank and compose adapters; expose a sum whose rank exceeds each component's rank.

**Implementation ladder:** Implement rank_of_product, best_rank_k, and merge_adapter; compare merged outputs against the factored computation.

**RE gate:** Verify merge parity and report reachable update rank without overstating task equivalence.

**RS gate:** Show why a low-rank trained update does not prove that every useful task update is low rank.


**Module 20 — Random projections and sketching**

`handle: LA20` · `id: math.linear-algebra.random-projections-sketching` · 28h · prerequisites: LA10, PS12 · proposed bank: `20-sketch`

**Already covered:** JL is taught probabilistically in PS12; no computational sketching lesson.

**Add or verify:** Subspace embeddings, sketched least squares, leverage/coherence effects, and held-out distortion diagnostics.

**Spine and derivations:** Reuse the finite-set JL bound; derive what uniform subspace preservation buys for least squares and why pairwise distances alone are insufficient.

**Interactive experiment:** Proposed la-jl: vary sketch dimension and data coherence; show acceptable pairwise error with a missed low-energy regression direction.

**Implementation ladder:** Implement jl_projection, distortion_stats, and sketched_lstsq using stable local solves.

**RE gate:** Report sketch randomness, residual inflation, and cost against an unsketched baseline.

**RS gate:** Distinguish a finite-set embedding from a subspace guarantee and give the required failure probability.


**Module 21 — Tensors, contractions, and memory layout**

`handle: LA21` · `id: math.linear-algebra.tensors-contraction` · 26h · prerequisites: LA08, PY06 · proposed bank: `21-tensors`

**Already covered:** Basic matrix shape notation exists; no multilinear unit.

**Add or verify:** Tensor products and multilinear maps, einsum semantics, contraction order, logical reshape versus storage, and explicit cost models.

**Spine and derivations:** Derive indexed contraction identities and operation/intermediate-memory counts; distinguish tensor order from matrix rank of an unfolding.

**Interactive experiment:** Proposed la-einsum: change index expression, shapes, and contraction order; reveal large intermediates and accidental repeated-index reductions.

**Implementation ladder:** Implement einsum_cost, contract_pair, and reshape_view as a storage simulation; use NumPy locally for parity.

**RE gate:** Choose a contraction order that respects peak-memory constraints and preserves the expression.

**RS gate:** Explain which properties survive a reshape and why an unfolding rank is not a universal tensor-rank claim.


**Module 22 — Attention as a bilinear map**

`handle: LA22` · `id: math.linear-algebra.attention-bilinear` · 28h · prerequisites: LA21, LA16 · proposed bank: `22-attention`

**Already covered:** Attention-related overlap examples appear early; no full algebraic treatment.

**Add or verify:** QK/OV composition, bilinear forms, pre-softmax score-rank bounds, softmax rank changes, positional structure, and multi-head gauge freedoms.

**Spine and derivations:** Derive qᵀBk, rank bounds on QKᵀ, and invariances of factored maps; give an explicit example where row softmax increases rank.

**Interactive experiment:** Proposed la-attention: drag queries/keys and apply a basis change; compare scores, normalized weights, outputs, and ranks.

**Implementation ladder:** Implement score_rank, softmax_rows, and ov_circuit with all-masked-row handling and local numerical-rank audits.

**RE gate:** Trace tensor shapes and verify a factor transformation preserves the intended attention function.

**RS gate:** Explain why low score rank does not imply the same rank bound after softmax or a causal interpretation of attention weights.


**Module 23 — Kronecker products, block matrices, and Schur complements**

`handle: LA23` · `id: math.linear-algebra.kronecker-block` · 24h · prerequisites: LA10, LA21 · proposed bank: `23-kronecker`

**Already covered:** Block notation is used in Gaussian lessons; no dedicated algebraic derivation.

**Add or verify:** Vectorization conventions, Kronecker identities/spectra, block elimination, Schur complements, and structured solve costs.

**Spine and derivations:** Prove vec identities and mixed-product rules; derive block inverse/Schur formulas with invertibility assumptions and PSD special cases.

**Interactive experiment:** Proposed la-kron: edit factors and block pivots; display spectrum products and failure of an inverse formula at a singular pivot.

**Implementation ladder:** Implement kron, vec_identity, and schur_complement with consistent row/column vectorization.

**RE gate:** Match structured and dense matrix actions and expose the memory saved.

**RS gate:** State every invertibility assumption and distinguish a structured approximation from an exact identity.


**Module 24 — Spectra of trained networks**

`handle: LA24` · `id: math.linear-algebra.spectra-trained-networks` · 30h · prerequisites: LA13, PS12, OPT05 · proposed bank: `24-spectra`

**Already covered:** Spectral basics and an MP preview exist; no trained-model audit.

**Add or verify:** Random-matrix null assumptions, spectral normalization/centering, singular versus covariance spectra, Lipschitz bounds, and qualified edge-of-stability studies.

**Spine and derivations:** Map singular values to sample-covariance eigenvalues with aspect ratio/scaling explicit; derive layerwise norm bounds and test a predeclared null.

**Interactive experiment:** Proposed la-mp: change aspect ratio, entry distribution, and correlations; compare iid nulls with structured weights and finite-sample deviations.

**Implementation ladder:** Implement empirical_spectrum, mp_density, and spectral_norm with explicit zero-atom handling where applicable.

**RE gate:** Reproduce a spectral plot with matrix orientation, normalization, seed, and rank tolerance disclosed.

**RS gate:** Explain why deviation from an iid null does not by itself establish a useful learned mechanism.


**Module 25 — Superposition, compressed sensing, and dictionary learning**

`handle: LA25` · `id: math.linear-algebra.superposition-geometry` · 32h · prerequisites: LA20, LA17, OPT07 · proposed bank: `25-superposition`

**Already covered:** LA01 establishes the dimension/interference motivation; no dedicated recovery or dictionary unit.

**Add or verify:** Coherence, sparse identifiability, RIP as a sufficient condition, recovery objectives, dictionary symmetries, and sparse autoencoder diagnostics.

**Spine and derivations:** Derive coherence bounds and one qualified sparse-recovery guarantee; distinguish exact recovery, reconstruction, sparsity, and semantic interpretability.

**Interactive experiment:** Proposed la-superpose: pack vectors and vary sparsity; show low reconstruction error with nonunique or uninterpretable dictionary atoms.

**Implementation ladder:** Implement max_coherence, sparse_recovery, and dictionary_step; use controlled synthetic ground truth before real activations.

**RE gate:** Report reconstruction/sparsity/recovery separately and detect dead or duplicated dictionary features.

**RS gate:** Defend a geometry or identifiability claim without treating sparse reconstruction as proof of a semantic feature.


**Module 26 — Capstone: a linear-algebra audit of a model**

`handle: LA26` · `id: math.linear-algebra.capstone-audit` · 30h · prerequisites: LA19, LA22, LA24, LA25, RP04 · proposed bank: `26-audit`

**Already covered:** No integrated capstone lesson or report template.

**Add or verify:** A reproducible audit combining rank, spectra, subspace comparisons, and an ablation predicted by the algebra.

**Spine and derivations:** No new theory: define numerical rank, null model, subspace metric, intervention, and a falsifiable prediction before measuring.

**Interactive experiment:** Proposed la-audit: link layer selection, singular cutoffs, subspace overlap, and ablation outcomes; expose conclusions that reverse under a tolerance change.

**Implementation ladder:** Deliver audit_model, reproduce_figures, and ablation_parity_check with a small exact reference and a local model.

**RE gate:** Another researcher regenerates every table and verifies the intervention changed only the declared component.

**RS gate:** Separate theorem, empirical observation, and speculation; defend an alternative explanation and a decisive follow-up.

## 5. Write order and milestones

The first eight modules are authored; begin with their diagnostics rather than rewriting them. Their formal dependency chain remains LA01 → LA02 → LA03 → LA04 → LA05 → LA06 → LA07 → LA08.

**Next numerical branch:** LA09 → LA10, then LA12 and LA11 as separate branches. LA12 now explicitly depends on LA10 and OPT02, so it may precede LA11 without the old prerequisite/write-order contradiction. LA13 follows LA12 and PS12; LA14 joins LA11, LA13, and graph fundamentals.

**Derivative branch:** LA15 → LA16 → LA17 after LA10 and scalar calculus. LA21 → LA23 supplies tensor/block algebra before LA18; PS11 supplies the probability model needed for Fisher statements. This makes the old hidden K-FAC prerequisites explicit. OPT02 remains an independent early multivariable bridge, so no optimization/autodiff cycle is introduced.

**Research branches:** LA19 follows pseudoinverse and adjoints; LA20 follows PS12 and regularized solves; LA21 can start after LA08 and NumPy; LA22 needs tensors and adjoints; LA24 needs spectral algorithms and probability/optimization; LA25 needs sketching, adjoints, and constrained optimization. LA26 joins these branches; its explicit dependencies replace the old claim that nearly every research module needs only LA08.

**Milestones:** after LA08, defend finite-dimensional geometry and decompositions; after LA09–LA14, choose and audit a numerical method; after LA15–LA18, derive and verify model derivatives/curvature; after a selected research branch, complete a smaller focused audit before the full LA26 synthesis. The RE route prioritizes numerics/tensors/derivatives; the RS route adds proof, invariance, null-model, and identifiability depth.

## 6. Capstone and assessment

Audit one small real model with a synthetic exact control. Report layerwise numerical rank with tolerance and scaling; spectra against an explicitly qualified null; principal-angle or projection-based subspace overlap; and a controlled ablation with a prediction derived before execution. Record code, versions, shapes, data, weights, all relevant seeds, and executable figures. An attention or low-rank audit may be an earlier branch project; full LA26 adds the spectrum and sparse-geometry synthesis. Reuse the report for Research Practice with work counted once.

Every unit uses six checkpoint tasks: explain the central concept; derive a result with assumptions; calculate a small case; implement or debug; critique misleading evidence; and defend an unfamiliar extension. Repair critical conceptual or correctness failures before advancing. A proof is assessed against a rubric, a numerical answer against an independent oracle, and an empirical claim against its design and uncertainty. Separate theoretical mastery, browser exercises, and local research implementation in progress records.

## 7. Infrastructure and validation

Already present: `chartkit.js`, `heatkit.js`, `plot3.js`, and the intentionally small `svdkit.js` in `public/theory/labs/`. Reuse them. `matrixbench.js` and `graphkit.js` remain proposed, first needed for LA11 and LA14 respectively. Keep built figure registrations, theme behavior, keyboard matrix entry, and exact/near-degenerate presets intact. The existing eight answer banks and 24 Python tasks are contracts, not placeholders to replace.

Python in the browser is standard-library-only; local NumPy/PyTorch experiments and any accelerator measurements must be labeled separately. Register a lesson's stubs, reference functions, checks, browser entries, figures, and answer bank together. Verify numeric answers by execution and proofs by an explicit argument. Tests include invalid inputs, degeneracies, input preservation, and stated tolerance behavior.

For authored changes, run `node scripts/build-theory.mjs`, `node scripts/check-theory.mjs`, and `python3 -m labs.checks --reference`. Inspect the reader in both themes, exercise the failure preset, and complete one typed and one written answer. For this plan-only change, validate links, unique IDs, prerequisite resolution and cycles, existing-artifact claims, and exclusion from the lesson catalog. No new lessons or runtime features are implemented by this document.

### Migration notes retained

Past renames are already applied: `02-linear-maps-rank.md` became `02-systems-elimination-subspaces.md`; the old eigenvalue stub became `06-eigenvalues-diagonalization.md`; the SVD stub became `08-svd-low-rank.md`. Preserve the current paths and their IDs. PCA remains under `math.linear-algebra.svd-pca`; expanding PCA later must not make that ID misleading.

Particularly sensitive inbound IDs are `math.linear-algebra.vectors-spaces-bases`, `math.linear-algebra.linear-maps-rank`, `math.linear-algebra.projections-least-squares`, `math.linear-algebra.eigen-invariant-subspaces`, and `math.linear-algebra.svd-pca`. Preserve all eight authored IDs, not only these five. Determinants may use diagnostic skips on a shorter route; the authored lesson and its place before eigenvalues remain intact. New complex/Schur material is a bounded extension, not a claim that the current real-matrix lessons already teach it.
