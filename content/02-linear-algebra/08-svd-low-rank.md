---
id: math.linear-algebra.svd-pca
title: The SVD — geometry, rank, low-rank approximation and PCA
prerequisites: [math.linear-algebra.spectral-theorem-quadratic-forms]
estimated_hours: 34
answers: 08-svd
---

# The SVD — geometry, rank, low-rank approximation and PCA

You have a machine with a thousand input coordinates and a hundred output coordinates. Someone asks you to replace it with a cheaper machine that can transmit only five independent signals. Which five? What information disappears? And when would “almost all the energy retained” still be a bad answer?

The singular value decomposition gives a precise language for that negotiation. It finds perpendicular input directions that the machine sends to perpendicular output directions. Each direction gets its own nonnegative gain. Keeping only some of those paired directions produces an approximation whose error we can calculate—and, for two important error measures, prove optimal.

## 0. The route through the chapter

Five results carry the work: every real matrix has an SVD; its paired directions reveal the four fundamental subspaces; its singular values measure worst-case and total squared amplification; truncation gives a best rank-constrained approximation; and PCA is that same approximation problem applied to centered observations.

We work over the reals. Let A be m×n, p=min(m,n), and r=rank(A). Singular values are in **descending** order, σ₁≥⋯≥σₚ≥0. This reverses Module 7's ascending eigenvalue convention. Input vectors live in ℝⁿ; output vectors live in ℝᵐ. Keeping those two spaces separate is the first conceptual step.

Sections 1–10 build the ideas and experiments; section 11 supplies three runnable stdlib Python tasks. Local NumPy and PyTorch exercises follow. Thirty-four hours includes derivations, coding, and unfamiliar problems, not merely reading. We introduce only the two matrix norms needed for approximation; Module 9 develops general norms and conditioning, and Module 10 develops the pseudoinverse and regularization in full.

## 1. Two spaces need two sets of directions

An eigenvector asks for Av=λv. That compares an output to its own input, so it requires a square matrix acting on the same space. Even then, a real eigenbasis may not exist. An SVD asks a different question:

> Can we find perpendicular inputs whose outputs are also perpendicular?

If so, the map can be understood as independent channels, each with an input direction vᵢ, an output direction uᵢ, and a gain σᵢ:

$$
Av_i=\sigma_i u_i.
$$

The left and right vectors are unit vectors in different spaces. A sign reversal is carried by the directions, allowing σᵢ≥0. An input direction that the map kills has gain zero; we must not try to normalize its zero output into an output direction.

**A rectangular machine you can see completely.** Consider

$$
A=\begin{pmatrix}3&0&0\\0&2&0\end{pmatrix}.
$$

It sends e₁∈ℝ³ to 3e₁∈ℝ², e₂ to 2e₂, and e₃ to zero. Its rank is 2. Its two listed singular values are 3 and 2, both positive, yet its null space is nontrivial. There are three input directions and only two output directions; the extra null direction is carried by the **full input basis**, not by an extra entry in a length-two singular-value list.

**An eigenvalue trap.** For the shear A=[[1,2],[0,1]], both eigenvalues are 1. But Ae₂=(2,1) has length √5. The eigenvalues did not bound one-step stretching, because the shear's behavior is not expressed in an orthonormal eigenbasis. Its singular values will answer that length question.

Before going on, say aloud which space each symbol belongs to: x and vᵢ are inputs, Ax and uᵢ are outputs. An SVD does not generally make vᵢ and uᵢ the same arrow.

> **Practice — Foundation:** For the displayed 2×3 matrix, give Ae₁, Ae₂, and Ae₃ with the correct output dimension.
>
> **Hint:** Read its three columns. Every output has two coordinates, including the zero output.
>
> **Practice — Core:** Why can a 2×3 matrix have all its listed singular values positive and still have a null direction?
>
> **Hint:** The list has min(m,n) entries. Compare the input dimension with the largest possible rank.
>
> **Practice — Stretch:** Find a unit input whose length grows under the shear, despite both eigenvalues being 1. Why does that not contradict Module 7?
>
> **Hint:** Try the second coordinate vector and then check whether the shear satisfies the symmetry hypothesis.

## 2. Construct the SVD from one symmetric matrix

**Theorem 27 — singular value decomposition.** Every real m×n matrix can be written

$$
A=U\Sigma V^{\mathsf T},
$$

where U is m×m orthogonal, V is n×n orthogonal, and Σ is an m×n matrix whose only possibly nonzero entries are σᵢ in positions (i,i), in descending order. Exactly r of them are positive.

*Proof, starting in input space.* The Gram matrix AᵀA is symmetric PSD because xᵀAᵀAx=‖Ax‖². Module 7 gives an orthonormal eigenbasis v₁,…,vₙ and nonnegative eigenvalues. Order the positive ones first, and write them as σᵢ². For each positive σᵢ define

$$
u_i=\frac{Av_i}{\sigma_i}.
$$

These vectors are orthonormal:

$$
u_i^{\mathsf T}u_j
=\frac{v_i^{\mathsf T}A^{\mathsf T}Av_j}{\sigma_i\sigma_j}
=\frac{\sigma_j^2}{\sigma_i\sigma_j}\,v_i^{\mathsf T}v_j
=\begin{cases}1&i=j,\\0&i\ne j.\end{cases}
$$

If vᵢ belongs to a zero eigenvalue of AᵀA, then ‖Avᵢ‖²=0, hence Avᵢ=0. Thus the images of the positive directions span range(A), and there are r of them. Complete u₁,…,uᵣ to an orthonormal basis of ℝᵐ using Module 4's basis-extension machinery. Complete V with the zero-eigenvalue directions already obtained. Every column of AV agrees with the corresponding column of UΣ, so AV=UΣ and A=UΣVᵀ.

The proof never assumes A is square, invertible, symmetric, or diagonalizable. It also explains why the division by σᵢ occurs only for positive values.

For i≤r we additionally have

$$
A^{\mathsf T}u_i=\sigma_i v_i,\qquad
AA^{\mathsf T}u_i=\sigma_i^2u_i.
$$

The first equation follows by substituting uᵢ=Avᵢ/σᵢ, and the second by applying A. Positive eigenvalues of AᵀA and AAᵀ therefore match, including multiplicities; their extra zero eigenvalues depend on n and m.

**An existence proof is not automatically a numerical algorithm.** Forming AᵀA squares singular values, making small directions harder to resolve amid rounding. For example, with A=[[1,1],[0,ε]], its determinant is ε, so it is full rank whenever ε≠0. Yet the Gram entry 1+ε² can round to 1, erasing that distinction. Production SVD routines work with A directly rather than using this proof as a recipe. Our 2×2 teaching task uses Gram geometry with explicitly limited numerical claims.

> **Practice — Foundation:** Why is every eigenvalue of AᵀA nonnegative?
>
> **Hint:** Evaluate the Gram quadratic form on a unit eigenvector and recognize a squared norm.
>
> **Practice — Core:** Derive Aᵀuᵢ=σᵢvᵢ from the construction, stating where positivity of σᵢ is needed.
>
> **Hint:** Substitute Avᵢ/σᵢ and use the eigenvector equation for AᵀA.
>
> **Practice — Stretch:** For a rank-one 3×2 matrix, explain how to construct a full U even though only one nonzero output can be normalized.
>
> **Hint:** One unit output spans the range. Extend it with two orthonormal vectors in its orthogonal complement; do not divide by the zero singular value.

## 3. Read, scale, write—and distinguish an image from a contour

For any input x, compute c=Vᵀx, then Σc, then UΣc. These are three different actions:

1. **Read** x in a perpendicular input basis.
2. **Scale** the retained coordinates, killing zero-gain coordinates and inserting any necessary output zeros.
3. **Write** the result in a perpendicular output basis.

The orthogonal maps can include reflections. For a rectangular map, the middle operation also changes dimension. “Rotate, scale, rotate” is a useful picture only if those qualifications remain attached.

```lab
la-svd
```

In the experiment, drag the columns of a 2×2 A or edit its entries. The input view shows the unit circle and the right singular directions. The output view shows the image of that circle, the left singular directions, and a moving probe's image. It auto-fits the outputs and includes a gray unit circle as a length reference; compare numerical gains rather than pixel lengths between the two views. Toggle the rank-one approximation to see exactly what deleting the second channel changes. Reveal the axes after predicting them.

Try **shear**, **reflection**, **rank one**, **thin**, **isotropic**, and **zero**. A collapsed ellipse is a line segment; the zero map produces a point. For an isotropic map the gains coincide, so any perpendicular input pair can be used: a returned axis is not a uniquely discovered feature. The thin preset has a small positive second gain; changing the displayed rank tolerance changes its reported numerical rank without changing A.

**Do not swap these two ellipses.** The image of the unit circle under diag(3,1) has semiaxes 3 and 1. The level set xᵀdiag(9,1)x=1 has semiaxes 1/3 and 1. The image asks “where do unit inputs go?” The level set asks “which inputs have unit output length?” One uses gains, the other reciprocal gains.

An SVD is not fully unique. For a positive channel you may change the signs of uᵢ and vᵢ together. Inside a repeated positive singular-value block you may rotate the input basis and output basis by the same orthogonal matrix. Null-space bases can be chosen independently. Check reconstructions, paired equations, and subspace projectors; do not demand one particular collection of signed arrows.

> **Practice — Foundation:** For diag(−3,1), can its singular values be negative? Where does the reflection go?
>
> **Hint:** Gains are nonnegative. Put the sign reversal into one orthogonal factor instead.
>
> **Practice — Core:** In the shear preset, compare its eigenvalue magnitudes with its largest singular value. Explain the different questions they answer.
>
> **Hint:** One compares an input with itself after mapping; the other maximizes output length over all unit inputs.
>
> **Practice — Stretch:** For A=2I₂, construct two visibly different SVDs with the same singular values.
>
> **Hint:** Take U=V=I, then take U=V equal to the same nontrivial orthogonal rotation.

## 4. Shapes, subspaces, and the channels that disappear

Three forms of the factorization are useful. They encode the same map but expose different amounts of unused geometry.

| Form | U factor | Middle factor | Vᵀ factor | What is retained |
|---|---|---|---|---|
| Full | m×m | m×n | n×n | Complete input and output bases |
| Reduced, also called economy | m×p | p×p | p×n | p=min(m,n) paired slots, including any zero gains |
| Compact rank-r | m×r | r×r | r×n | Only positive-gain channels |

Software terminology varies; inspect shapes rather than inferring them from the word “thin.” For the 2×3 example, reduced Vᵀ is 2×3 and omits the extra input null vector. For a rank-one example, reduced factors also contain a zero-gain slot, whereas compact rank-r factors do not.

**Theorem 28 — four subspaces from the full factors.** With positive channels first,

$$
\begin{aligned}
\operatorname{range}(A)&=\operatorname{span}(u_1,\ldots,u_r),&
\ker(A^{\mathsf T})&=\operatorname{span}(u_{r+1},\ldots,u_m),\\
\operatorname{range}(A^{\mathsf T})&=\operatorname{span}(v_1,\ldots,v_r),&
\ker(A)&=\operatorname{span}(v_{r+1},\ldots,v_n).
\end{aligned}
$$

*Proof.* Write x=Vc. Since U preserves length, Ax=0 iff Σc=0, exactly when the first r coordinates vanish. Every output is a combination of u₁,…,uᵣ, and each such uᵢ is the output of vᵢ/σᵢ. Apply the same argument to Aᵀ=VΣᵀUᵀ for the other two spaces.

Consequently the orthogonal range projector is UᵣUᵣᵀ and the row-space projector is VᵣVᵣᵀ. These survive changes of basis inside their respective subspaces.

**Exact rank and a numerical report are different objects.** Exact rank counts positive singular values. A numerical rank rule might count σᵢ>τ·σ₁ for a declared relative τ≥0. With A=diag(1,10⁻⁸), exact rank is 2; at τ=10⁻⁶ that rule reports 1. The matrix has not changed. The report states which channels the chosen resolution treats as usable. Units, measurement noise, dtype, and the downstream task should inform that resolution; there is no context-free threshold that discovers exact rank from rounded data.

**A bridge to minimum-norm solutions.** If Ax=b is consistent, the positive-channel coordinates are forced to be

$$
c_i=\frac{u_i^{\mathsf T}b}{\sigma_i}\quad(i\le r).
$$

Coordinates in ker(A) are free. Since V is orthogonal, setting all free coordinates to zero uniquely minimizes ‖x‖. For inconsistent b, first project b onto range(A); the same formula then gives the least-squares solution of minimum norm, with residual b−UᵣUᵣᵀb. This is the SVD reason behind the minimum-norm claim used in optimization. Module 10 defines the pseudoinverse operator and investigates what small σᵢ do to this division.

> **Practice — Foundation:** Give full U, Σ, Vᵀ shapes for a 5×3 rank-two matrix, then the compact factor shapes.
>
> **Hint:** Full basis sizes depend on ambient dimensions; compact basis sizes depend on rank.
>
> **Practice — Core:** For A=[[3,0,0],[0,2,0]] and b=(6,4), give every exact solution and identify the minimum-norm one.
>
> **Hint:** The first two coordinates are fixed by the two gains. The third does not affect the output but does add squared length.
>
> **Practice — Stretch:** Why can a reduced SVD of a wide full-row-rank matrix fail to display any basis of its null space?
>
> **Hint:** Its p right-factor rows are all positive-gain directions. The omitted n−p columns of the full V carry the null space.

## 5. Two error measures, two precise promises

For a matrix E, the **spectral norm** is its greatest amplification of a unit vector:

$$
\|E\|_2=\max_{\|x\|=1}\|Ex\|.
$$

The **Frobenius norm** is the ordinary Euclidean length of all its entries taken together:

$$
\|E\|_F^2=\sum_{i,j}e_{ij}^2=\sum_j\|Ee_j\|^2.
$$

The first measures worst-case error on a unit input; the second measures total squared entrywise error, equivalently the sum of squared output errors on the coordinate basis. Both are unchanged by orthogonal transformations on either side. Left invariance preserves each output length. Right invariance follows for the spectral norm because an orthogonal map permutes the unit sphere, and for the Frobenius norm by applying length preservation to each row.

**Theorem 29 — gains determine amplification and energy.** The SVD gives

$$
\|A\|_2=\sigma_1,\qquad
\|A\|_F^2=\sum_{i=1}^p\sigma_i^2.
$$

*Proof.* For a unit x=Vc, ‖Ax‖²=∑ᵢ₌₁ʳσᵢ²cᵢ²≤σ₁². Choosing x=v₁ attains the bound when A is nonzero; the zero case is immediate. Orthogonal invariance reduces the Frobenius norm to that of Σ, which has only its singular values as nonzero entries.

For a rectangular map, the **minimum** over all unit inputs is zero whenever r<n. It need not be σₚ: a wide full-row-rank matrix has positive σₚ but omitted null directions. On the row space, the smallest positive gain is σᵣ when r>0.

There is a useful isotropic-input interpretation. If a random input has mean zero and E[xxᵀ]=I, then expanding coordinates gives

$$
\mathbb E\|Ex\|^2=\|E\|_F^2.
$$

If instead x is uniform on the unit sphere in ℝⁿ, its second moment is I/n, so the average is ‖E‖_F²/n. Anisotropic inputs weight errors differently. We will use that distinction to avoid claiming that a matrix approximation automatically preserves a model's behavior.

> **Practice — Foundation:** Compute both norms of diag(4,3).
>
> **Hint:** One uses the largest gain; the other is the square root of the sum of squared gains.
>
> **Practice — Core:** For a 2×3 matrix with singular values 4 and 3, what is its minimum amplification over unit inputs? What is it on its row space?
>
> **Hint:** Rank–nullity guarantees an input direction with zero output, even though both listed gains are positive.
>
> **Practice — Stretch:** Derive E‖Ex‖²=‖E‖_F² from E[xⱼxₖ]=δⱼₖ without invoking any probability theorem beyond linearity of expectation.
>
> **Hint:** Expand each squared output coordinate and take the expectation of each cross term.

## 6. A rank budget means choosing channels

The SVD also writes a matrix as a sum of rank-one maps:

$$
A=\sum_{i=1}^r\sigma_i u_i v_i^{\mathsf T}.
$$

Each term reads the scalar vᵢᵀx, multiplies by σᵢ, and writes along uᵢ. Retaining the first k slots, with 0≤k≤p, gives

$$
A_k=\sum_{i=1}^k\sigma_i u_i v_i^{\mathsf T},\qquad
\operatorname{rank}(A_k)\le k.
$$

If k≥r then A_k=A. If k=0, the empty sum is the zero matrix. The residual simply contains the discarded channels. Define σₚ₊₁=0; then

$$
\|A-A_k\|_2=\sigma_{k+1},\qquad
\|A-A_k\|_F^2=\sum_{i>k}\sigma_i^2.
$$

These equations already predict the whole error curve. But why should this choice beat *every* rank-k matrix, including ones assembled from entirely different directions?

**Theorem 30 — Eckart–Young, spectral and Frobenius forms.** Among all matrices B with rank at most k, A_k minimizes both displayed errors.

*Spectral proof.* For k<p, restrict B to S=span(v₁,…,vₖ₊₁). Since S has dimension k+1 but B has rank at most k, there is a unit x∈S with Bx=0. Therefore

$$
\|A-B\|_2\ge\|(A-B)x\|=\|Ax\|\ge\sigma_{k+1}.
$$

A_k attains the bound. For k=p, A itself is available and has zero error.

*Frobenius proof.* Let P be the orthogonal projector onto range(B), of dimension d≤k. Columnwise orthogonality gives

$$
\|A-B\|_F^2
=\|(I-P)A\|_F^2+\|PA-B\|_F^2
\ge\|A\|_F^2-\|PA\|_F^2.
$$

Using the SVD, ‖PA‖_F²=∑ᵢ₌₁ʳσᵢ²‖Puᵢ‖². Extend this to all m left basis vectors by assigning zero weights beyond r. The numbers αᵢ=‖Puᵢ‖² lie in [0,1] and sum to d: in an orthonormal basis of range(P), expand each projected uᵢ and sum the squared dot products. A budget of d≤k units placed on descending nonnegative weights earns at most the sum of the largest k weights. Thus ‖PA‖_F²≤∑ᵢ≤kσᵢ², leaving at least ∑ᵢ>kσᵢ² error. A_k attains it.

The “budget” step is a small optimization argument: if some weight is placed on a smaller coefficient while a larger one is not filled, moving that amount upward cannot decrease the sum. Repeat until the largest coefficients are filled.

**Optimal does not always mean unique.** A tie across the cutoff lets different subspaces achieve the same best errors. For I₂ and k=1, any rank-one orthogonal projector is optimal. Even with a strict gap, spectral-norm minimizers need not be unique: for A=diag(3,1), both diag(3,0) and diag(2,0) attain spectral error 1, but their Frobenius errors differ. A strict positive cutoff gap does make the Frobenius-optimal truncation unique; the paired vectors within retained repeated blocks still need not be unique.

> **Practice — Foundation:** For singular values (5,3,1), give the rank-one spectral error and squared Frobenius error.
>
> **Hint:** Keep 5 and inspect the tail. The two error measures aggregate it differently.
>
> **Practice — Core:** Explain why the spectral proof finds a vector killed by B inside a space of dimension k+1.
>
> **Hint:** Apply rank–nullity to the restriction of B to that subspace, rather than to all of input space.
>
> **Practice — Stretch:** Verify both errors for the two rank-one approximations to diag(3,1) in the nonuniqueness example.
>
> **Hint:** The residuals are diagonal, so their largest absolute diagonal entry and sum of squared diagonal entries give the two norms directly.

## 7. The compression workbench: inspect what the tail contains

```lab
la-approx
```

The experiment constructs a small 6×6 matrix from known orthonormal factors. Move the rank budget from zero to six. Compare the original, reconstruction, and residual heatmaps, then inspect the error curve. All three heatmaps share **one fixed color scale** for a chosen fixture; a shrinking residual cannot disguise itself by recoloring its largest remaining entry as full intensity. The displayed curve is actual Frobenius error, not squared error, and the numeric readout gives both norms.

The **decaying spectrum** preset makes early gains look persuasive. The **flat spectrum** preset keeps all six gains equal: there is no privileged compression boundary, and the error falls slowly. The **exact rank two** preset stops improving after two channels. The **zero** preset has zero error at every budget; its retained-energy fraction is **undefined**, because the total is zero, not “100% explained.”

**Predict first:** if the gains are (6,3,1,0,0,0), what remains after keeping two? The error is not determined by how colorful the reconstruction looks. It is spectral error 1, Frobenius error 1, and retained squared energy 45/46.

Factor storage is another independent question. Storing U_k, σ₁,…,σ_k, and V_kᵀ uses k(m+n+1) numbers rather than mn dense entries. For a 6×6 matrix, rank three already costs 39 factor entries versus 36 original entries. Low rank is a structural description; actual compression also depends on dimensions, representation, precision, and overhead. A two-factor representation can absorb σ into one side and store k(m+n) numbers.

**A small channel can carry the whole task.** Let A=diag(10,1), and suppose every real input is e₂. Rank-one truncation retains 100/101 of the matrix's squared energy, yet maps every such input to zero, losing the entire useful output. The Frobenius theorem is correct; the task used a different weighting of input directions.

For a learned layer W and input second moment C=E[xxᵀ], the expected squared output error is

$$
\mathbb E\|(W-B)x\|^2
=\operatorname{tr}\bigl((W-B)C(W-B)^{\mathsf T}\bigr).
$$

Here trace is the sum of diagonal entries. Expand the sum as in section 5 to verify the identity. If C≠I, minimizing the ordinary Frobenius error of W need not minimize this data-weighted error. Nor does either objective by itself guarantee unchanged downstream accuracy. Module 19 returns to trained-model structure; our current theorem keeps its stated metric and rank constraint.

> **Practice — Foundation:** For gains (6,3,1,0,0,0), compute retained squared energy at rank two.
>
> **Hint:** Square the gains before summing. The denominator includes the discarded nonzero gain.
>
> **Practice — Core:** For a 100×80 matrix stored as three SVD factors of rank 5, compare factor and dense entry counts.
>
> **Hint:** Count both collections of singular vectors and the five scalar gains. No bytes-per-number assumption is needed.
>
> **Practice — Stretch:** Construct an input distribution on which a matrix's small Frobenius truncation error causes 100% relative output error.
>
> **Hint:** Concentrate inputs along a discarded positive-gain right singular vector. Compare output error with the original output norm on those inputs.

## 8. PCA chooses an affine subspace for observations

Let X be an N×d data matrix with observations in rows and features in columns. Let μ be the row vector of feature means, and define the centered matrix

$$
X_c=X-\mathbf1\mu.
$$

Centering matters because PCA describes variation around a location. Uncentered SVD instead approximates the data by a subspace through the origin, which may devote its leading direction mostly to the mean.

Take an SVD X_c=UΣVᵀ and choose 0≤k≤min(N,d). The columns vᵢ of V are **feature directions**, also called principal axes or loadings under a common convention. The projected observations are the **scores**

$$
Z_k=X_cV_k=U_k\Sigma_k\quad(N\times k).
$$

A loading is a direction in feature space; a score is one observation's coordinate along that direction. Unit entries of U are not the scores: they must be multiplied by singular values. The rank-k centered reconstruction and the reconstruction in original coordinates are

$$
\widehat X_c=Z_kV_k^{\mathsf T},\qquad
\widehat X=\mathbf1\mu+\widehat X_c.
$$

The reconstructed points lie in the **affine** space μ+span(v₁,…,v_k). The matrix with the mean added back can have rank k+1 even though its centered part has rank at most k.

**Theorem 31 — PCA's two equivalent objectives.** Among orthonormal d×k direction matrices Q, choosing V_k maximizes projected squared variation ‖X_cQ‖_F² and minimizes reconstruction error ‖X_c−X_cQQᵀ‖_F².

*Proof.* Projection splits each centered observation into perpendicular kept and discarded parts, so their squared lengths add. Hence minimizing residual energy is equivalent to maximizing projected energy. The spectral theorem applied to X_cᵀX_c, with the same projection-weight budget argument used in section 6, shows that the top k right singular directions maximize that energy. Equivalently, SVD truncation is an optimal rank-k approximation and has the required projection form. Its squared residual is ∑ᵢ>kσᵢ².

Why place the affine subspace at μ? For any candidate location a and projector P=QQᵀ, sum the squared orthogonal distances. Writing xⱼ−a=(xⱼ−μ)+(μ−a), the cross terms sum to zero because centered rows sum to zero. The result is

$$
\sum_j\|(I-P)(x_j-a)\|^2
=\sum_j\|(I-P)(x_j-\mu)\|^2
+N\|(I-P)(\mu-a)\|^2.
$$

Thus an optimum passes through the mean. The choice of a along the same affine subspace is immaterial.

For N>1, the sample covariance C=X_cᵀX_c/(N−1) has eigenvalues λᵢ=σᵢ²/(N−1), with extra zeros if needed. The **explained-variance ratio** is

$$
\frac{\sigma_i^2}{\sum_j\sigma_j^2},
$$

provided the denominator is positive. The covariance divisor cancels in the ratio. Centering also forces rank(X_c)≤min(N−1,d), so a dataset with fewer observations than features has unavoidable zero-variance directions.

> **Practice — Foundation:** If X_c is 7×4 and k=2, give the shapes of V_k, scores Z_k, and reconstructed X̂_c.
>
> **Hint:** Scores have one row per observation and one column per retained direction.
>
> **Practice — Core:** Why must the feature mean be added back after reconstructing from centered scores?
>
> **Hint:** The centered reconstruction lives around the origin; the fitted affine subspace passes through the original mean.
>
> **Practice — Stretch:** Prove the displayed affine-distance decomposition and explain why it does not uniquely identify a location parameter a along the fitted subspace.
>
> **Hint:** Expand the squares; the centered residuals sum to zero. Only the perpendicular part of μ−a appears in the added term.

## 9. Fit a line by moving the data, not a formula

```lab
la-pca
```

Drag the observations. The experiment links the point cloud, orthogonal reconstructions, mean, feature direction, and variance readout. Change the candidate line angle before revealing the optimal line. Compare its squared reconstruction error with the SVD minimum. Keyboard coordinate inputs offer the same experiment without dragging.

The **offset cloud** has a large mean in one direction and variation in another. Toggle centering off: the experiment now fits a line through the origin to raw points and labels the objective accordingly. Do not call its raw second-moment fractions centered explained variance. Toggle centering back on; the fitted line passes through the mean again.

The **line** preset has one positive variance and one zero variance. The **isotropic** preset has equal variances, so every line through the mean captures the same amount. The **identical points** preset has no centered variation at all: every line through that point reconstructs perfectly, and the variance ratios are undefined. An arbitrary displayed axis in either degenerate case is not a discovered unique feature.

Here is a complete hand-checkable dataset:

$$
X=\begin{pmatrix}8&1\\12&1\\10&0\\10&2\end{pmatrix},\qquad
\mu=(10,1),\qquad
X_c=\begin{pmatrix}-2&0\\2&0\\0&-1\\0&1\end{pmatrix}.
$$

The centered Gram matrix is diag(8,2). Thus the top feature direction is horizontal, the gains are √8 and √2, the leading explained-variance ratio is 4/5, and the best line has squared reconstruction error 2. The reconstructed observations are (8,1), (12,1), (10,1), (10,1). The mean is not itself a principal component.

For a candidate unit direction q=(cos θ,sin θ), the captured squared variation is 8cos²θ+2sin²θ. The reconstruction error is

$$
10-(8\cos^2\theta+2\sin^2\theta)=2+6\sin^2\theta.
$$

The excess above optimal is explicit. This is a useful prediction test for the lab: a 45° line should cost 5, even before pressing reveal.

> **Practice — Foundation:** For the hand-checkable dataset, list the first principal-component scores using the positive horizontal direction.
>
> **Hint:** Subtract the mean and take each row's dot product with (1,0).
>
> **Practice — Core:** Compute the reconstruction error for the 45° candidate and compare it with the best horizontal line.
>
> **Hint:** Substitute sin²45°=1/2 into the derived excess-error formula.
>
> **Practice — Stretch:** Explain why coincident observations should produce undefined variance fractions but zero reconstruction error after centering.
>
> **Hint:** Every centered observation is zero. The error is a sum of zeros; the fraction divides zero by zero.

## 10. Scaling and whitening change what counts as a good picture

PCA minimizes Euclidean reconstruction error in the supplied coordinates. Changing a feature from meters to millimeters multiplies that coordinate by 1000 and its squared errors by a million. The fitted direction can change even when the underlying measurements describe the same objects.

Standardizing each nonconstant feature to sample variance one makes a different choice: distances are measured in feature-standard-deviation units. It can be appropriate when those units match the question, but it can also amplify an unreliable low-variance feature. A constant feature cannot be standardized by dividing by its zero standard deviation. State how you handle it.

**Whitening goes further.** If the k retained covariance eigenvalues are positive, define

$$
W=X_cV_k\operatorname{diag}(\lambda_1^{-1/2},\ldots,\lambda_k^{-1/2}).
$$

With our sample covariance convention, WᵀW/(N−1)=I_k. Since λᵢ=σᵢ²/(N−1), this also equals √(N−1)U_k. Whitening rotates and rescales; PCA projection alone only changes the represented directions and discards others. In the retained space, squared distance between two rows becomes a sum of squared score differences divided by the respective λᵢ, so weak-variance directions receive more weight.

Zero variance cannot be inverted. Tiny estimated variance can turn small errors into large whitened coordinates. Truncating directions or adding a positive variance floor are modeling choices that change the transformation. They should be named, not hidden inside a square root. Module 10 develops spectral regularization, and [high-dimensional probability](../05-probability-statistics/12-high-dimensional-probability.md) examines statistical uncertainty in empirical spectra.

**A final inference check.** PCA's optimality says nothing about labels, causes, or semantic importance. A low-variance direction can predict a target perfectly. A high-variance direction can encode an irrelevant nuisance. Fitting a transform on held-out observations also uses information from those observations; evaluation pipelines should estimate centering, scaling, and principal directions on training data, then apply the fixed transform to held-out data.

What is a decaying spectrum evidence for? A good low-rank approximation **under a stated norm and coordinates**. To claim preserved task behavior, measure it on relevant inputs. To claim a uniquely identified component, inspect the spectral gaps. To claim a usable inverse transformation, inspect discarded and tiny directions.

> **Practice — Foundation:** For covariance eigenvalues (9,1), what factors multiply the two PCA score coordinates during whitening?
>
> **Hint:** Use inverse square roots of covariance eigenvalues, not inverse singular values without the sample-size factor.
>
> **Practice — Core:** A feature's sample variance is zero. Explain why neither standardization nor whitening may silently divide by it.
>
> **Hint:** The proposed scaling is undefined. Dropping a direction or using a floor is an explicit change of the transform.
>
> **Practice — Stretch:** Construct a two-feature dataset or distribution whose lower-variance coordinate predicts a label and whose higher-variance coordinate is irrelevant to it.
>
> **Hint:** Let one coordinate be a large independent nuisance and the other a small signed copy of the label.

## 11. Three runnable coding labs

All three tasks use only the Python standard library, keep inputs unchanged, and reject booleans, non-finite values, or malformed shapes with ValueError. Matrices are lists of rows. Validation helpers are supplied in the browser; NumPy experiments below run locally.

### Lab A — a small paired-direction construction

Open [2×2 SVD](../../labs/exercises.py). Implement `svd_2x2(matrix)`, returning `(U, singular_values, Vt)` with 2×2 orthogonal factors and two nonnegative descending gains. Scale A by its largest absolute entry first; zero A may return identity factors and zero gains. For scaled A=[[a,b],[c,d]], form g₁₁=a²+c², g₁₂=ab+cd, g₂₂=b²+d². A top Gram eigenvector is (cos θ,sin θ), where θ=½atan2(2g₁₂,g₁₁−g₂₂); choose θ=0 when both arguments are zero. Its perpendicular completes V.

Compute the first gain as ‖Av₁‖ using the scaled matrix. Recover the second via |det(A)|/σ₁ in scaled units, which avoids subtracting nearly equal Gram eigenvalues. Normalize Av₁ for u₁; choose a perpendicular u₂ with the sign needed for the determinant. Restore gain units. Reject non-finite reported arithmetic. This construction is useful for small visual experiments, not a general stable SVD algorithm: scaling and the determinant shortcut do not guarantee relative accuracy in a tiny singular value or recover distinctions already rounded away. A computed zero is not a certificate of exact rank.

### Lab B — spend a rank budget

Open [rank truncation](../../labs/exercises.py). Implement `truncate_rank(left, singular_values, right_t, k)`. Inputs are reduced factors with shapes m×p, length p, and p×n, where p=min(m,n)≥1, and singular values are nonnegative and descending. The supplied `_validated_svd_factors` checks shapes, gains, and approximate orthonormality (absolute dot-product tolerance 10⁻⁹). Treat accepted factors as the supplied decomposition; no eigensolver is needed. Require integer k between 0 and p, excluding bools. Return the m×n sum of the first k outer products. Zero gains are valid, k=0 returns a zero matrix, and non-finite result arithmetic raises ValueError.

### Lab C — account for squared variation

Open [explained variance](../../labs/exercises.py). Implement `explained_variance(singular_values)`, returning `(ratios, cumulative)`, two lists of the same length. Require a nonempty finite nonnegative descending list. Scale by the largest gain before squaring to avoid avoidable overflow and underflow. All-zero input raises ValueError because the fractions are undefined. Repeated or trailing-zero gains are valid. Do not force the final value to one by overwriting a computed result; ordinary floating-point tolerance handles summation. Explain why dividing raw gains by their sum would answer the wrong question.

Run `python -m labs.checks svd-2x2`, `python -m labs.checks truncate-rank`, and `python -m labs.checks explained-variance`. Add `--reference` after an attempt to check the supplied implementations.

## 12. Exercises · by hand

**A1 · Foundation · paper — a missing input channel.** For A=[[3,0,0],[0,2,0]], give its singular values, rank, nullity, and minimum output length over all unit inputs.

**A2 · Core · paper — prove the paired directions.** Starting with an orthonormal eigenbasis of AᵀA, construct the positive-gain left singular vectors and prove their orthonormality. Explain what to do with zero gains.

**A3 · Foundation · paper — signs live in the factors.** Give one SVD of diag(−3,1), with descending nonnegative gains. State why negative eigenvalues do not force negative singular values.

**A4 · Core · paper — a rectangular shape audit.** A is 5×3 of rank two. Give full, reduced, and compact factor shapes, then the dimensions of its range, row space, null space, and left null space in that order.

**A5 · Core · paper — one step versus an invariant line.** For A=[[1,2],[0,1]], compute its eigenvalues, the length of Ae₂, and its singular values from the eigenvalues of AᵀA.

**A6 · Core · paper — two error budgets.** A matrix has singular values (5,3,1). Give its spectral norm, squared Frobenius norm, rank-one spectral error, and rank-one squared Frobenius error.

**A7 · Core · paper — optimal need not be unique.** For A=diag(3,1), compare B=diag(3,0) and C=diag(2,0). Give the spectral and squared Frobenius errors of each, and say which are optimal under each norm.

**A8 · Stretch · paper — prove an unavoidable lost direction.** Prove the spectral-norm rank-k approximation lower bound using a vector in span(v₁,…,vₖ₊₁) killed by any candidate B of rank at most k.

**A9 · Core · paper — minimum norm from positive channels.** For A=[[3,0,0],[0,2,0]] and b=(6,4), give all exact solutions and the minimum-norm solution. Prove the minimum claim with orthogonal coordinates.

**A10 · Foundation · paper — energy is squared.** For gains (6,3,1), give each explained-energy ratio, the fraction retained by two channels, and the remaining Frobenius error.

**A11 · Core · paper — center, score, reconstruct.** For X=[[8,1],[12,1],[10,0],[10,2]], compute the mean, top scores using v₁=(1,0), top explained-variance ratio, and best line's squared reconstruction error.

**A12 · Stretch · paper — the projection budget proof.** Prove the Frobenius rank-k approximation bound using the range projector of a candidate B. Justify why αᵢ=‖Puᵢ‖² lie in [0,1] and sum to rank(P).

## 13. Exercises · NumPy

Use float64 arrays and `np.linalg.svd`. It returns Vᵀ as its last factor for real input. Explicitly choose full or reduced factors, and record shapes. Do not compare vector signs against one reference.

**B1 · Foundation · NumPy — three reconstruction audits.** On [[1,2],[0,1]], [[3,0,0],[0,2,0]], and a 3×2 zero matrix, compute full and reduced SVDs. Check reconstruction and orthogonality using shape-appropriate identities. Explain which right null directions are absent from reduced factors.

**B2 · Core · NumPy — a tolerance changes a report.** For diag(1,10⁻⁸), count gains strictly above τσ₁ for τ=10⁻¹⁰,10⁻⁶, then repeat after multiplying A by 10⁶. Give the four numerical ranks and the exact rank. Explain the units benefit and remaining limitations of a relative threshold.

**B3 · Core · NumPy — see the Gram matrix forget.** For A=[[1,1],[0,ε]] with ε=10⁻⁴,10⁻⁸,10⁻¹⁰, compare direct SVD gains with square roots of Gram eigenvalues. Record any zero or negative computed Gram eigenvalue before applying a clipping policy. Explain why clipping does not recover the missing information.

**B4 · Core · NumPy — check the whole error curve.** For the 4×3 matrix [[3,0,0],[0,2,0],[0,0,1],[0,0,0]], compute A_k for k=0,1,2,3. Compare measured squared Frobenius errors and spectral errors with tail formulas, including the endpoints.

**B5 · Stretch · NumPy — a good compression can destroy the task.** Let A=diag(10,1) and all observed inputs equal e₂. Compute rank-one retained matrix energy, average squared output error, and relative output error. Compare with keeping the second channel instead. Which objective prefers which approximation?

**B6 · Core · NumPy — PCA reconstruction is affine.** For the dataset in A11, compute the centered SVD, scores, rank-one centered reconstruction, and reconstruction after restoring the mean. Give the ranks of the two reconstruction matrices and the squared residual. Explain why an affine line need not yield a rank-one uncentered data matrix.

## 14. Exercises · PyTorch

**C1 · Foundation · PyTorch — rectangular batches.** Stack a full-rank and a rank-one 3×2 matrix. Use float64 `torch.linalg.svd` with reduced factors. Reconstruct both with broadcasting or diagonal embedding, and audit factor shapes and paired equations. Explain why zero-gain columns must not be constructed by dividing by their gain.

**C2 · Core · PyTorch — repeated singular vectors can turn.** For A=2I₂, rotate U and V by the same angle while keeping Σ=2I₂. Verify that the reconstruction stays fixed. At rank one, compare the two retained projectors and their approximation errors; does equal optimal error identify one component?

**C3 · Core · PyTorch — whitening has a sample-size factor.** For the four-row dataset in A11, compute centered PCA scores and whiten both positive-variance directions using sample covariance divisor N−1. Verify WᵀW/(N−1)=I₂. Give the two whitening scale factors.

**C4 · Stretch · PyTorch — translate without changing variation.** Add (100,−50) to every row of the A11 dataset. Compare centered singular values and principal-subspace projectors before and after; compare uncentered singular values as well. Explain why signs of individual returned axes are the wrong invariant.

## 15. Derivations to own

1. Construct the full SVD from the spectral theorem, including all zero-gain and rectangular cases.
2. Recover the four subspaces and their orthogonal projectors from the full factors.
3. Derive spectral and Frobenius norm formulas, and the tail errors of a truncation.
4. Prove both rank-k approximation lower bounds, distinguishing existence from uniqueness.
5. Derive PCA's captured-variation/reconstruction equivalence and why an optimal affine subspace passes through the mean.
6. Derive the sample-covariance spectrum, explained-variance ratios, and the whitening identity with its divisor.

## 16. Exercises · cumulative

**M1 · Core · paper — a projector's SVD.** For the orthogonal projector P onto span((1,1)), give its singular values, spectral norm, squared Frobenius norm, and best rank-zero squared error. Why do eigenvalues and singular values coincide here?

**M2 · Core · paper — determinant forgets the shape.** For A=diag(4,1/4), give the product of singular values, determinant, largest gain, and smallest gain. Explain why unit area scaling does not imply length preservation.

**M3 · Core · paper — least squares with a left null direction.** For A=[[2,0],[0,1],[0,0]] and b=(4,3,5), use the singular channels to give the least-squares solution, residual b−Ax, squared error, and uniqueness verdict.

**M4 · Stretch · paper — a spectrum with no preferred axis.** For the centered rows (1,0),(−1,0),(0,1),(0,−1), compute the sample covariance and its eigenvalues. Show every line through the origin has the same squared reconstruction error and give that error.

**M5 · Core · paper — storage is a separate claim.** For a 100×80 matrix and k=5, compute dense storage, three-factor SVD storage, and two-factor storage after absorbing singular values. State what these counts do not establish about downstream prediction quality.

**M6 · Stretch · mixed — rank survives an invertible change, PCA need not.** Multiply the second feature of the A11 centered dataset by 3. Give its new descending singular values and leading feature axis. Compare its rank with the original, and explain why invertible feature scaling preserves rank but changes the PCA objective.

## 17. Exercises · checkpoint

**K1 · Foundation · gate — name both spaces.** For A=[[4,0,0],[0,1,0]], give singular values and bases for all four fundamental subspaces. State full factor shapes and explain why its smallest listed singular value is not its minimum amplification on unit inputs.

**K2 · Core · gate — justify universal existence.** Prove the SVD for an arbitrary real m×n matrix, including rank deficiency. Name the theorem that provides the right singular vectors and explain how the remaining left vectors are chosen.

**K3 · Core · gate — choose a defensible budget.** A matrix has gains (8,4,2,1). What smallest k retains at least 95% of squared energy? Give that truncation's spectral error, squared Frobenius error, and retained fraction. State the optimization claim those errors certify.

**K4 · Core · gate — rebuild the PCA calculation.** For X=[[8,1],[12,1],[10,0],[10,2]], give the mean, both sample covariance eigenvalues, the best affine line, and its squared reconstruction error. Give the error of the 45° line through the mean and explain the gap.

**K5 · Stretch · gate — audit three overclaims.** Refute each claim with a concrete example: positive listed singular values imply no null space; 99% retained matrix energy guarantees small relative output error on every input; an SVD always identifies unique signed principal directions.

**K6 · Stretch · gate — distinguish absence from smallness.** A centered dataset has N=4 rows and d=6 features. Give the largest possible rank and smallest possible feature-nullity. Explain how zero variance differs from tiny positive variance for explained-variance ratios, whitening, and numerical-rank reporting. Specify what happens to the ratios if every observation is identical.

## Mastery check

Given a rectangular matrix or a small dataset, identify the input and output spaces, reconstruct a map from paired directions, explain its null directions, choose and defend an approximation norm, and derive the corresponding error. For PCA, state the centering, feature scaling, covariance divisor, and reconstruction convention. A low-rank theorem is strongest when its scope is explicit.

**What to bring to Module 9:** singular values quantify both useful amplification and lost directions; a tiny positive value differs from an exact zero; forming a Gram matrix can hide that distinction; and a small residual under one metric need not answer the question your application asks.
