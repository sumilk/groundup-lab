---
id: math.probability.high-dimensional
title: High-dimensional probability, random vectors, and projections
prerequisites: [math.probability.limit-theorems-monte-carlo, math.linear-algebra.svd-pca]
estimated_hours: 30
---

# High-dimensional probability, random vectors, and projections

Every intuition you own about probability was built in one, two, or three dimensions. Embeddings live in 768. Hidden states live in 4096. Parameter vectors live in \(10^{11}\). The claim of this unit is not that high dimensions are *harder*; it is that they are **different in kind**, and that the differences are precise, provable, and directly responsible for facts you already use — why attention divides by \(\sqrt{d_k}\), why initialization scales as \(1/\sqrt{\text{fan\_in}}\), why cosine similarity behaves the way it does, and why a covariance estimated from a few thousand samples is badly wrong in a way that is not obvious from the average.

The unifying phenomenon is **concentration of measure**: as dimension grows, well-behaved functions of a random vector stop being random. Averages concentrate — that was the law of large numbers in [repeated samples and limit theorems](05-limit-theorems-monte-carlo.md). Here, *geometry itself* concentrates.

## 0. Prerequisite check

You should be able to state the weak law and Chebyshev's inequality, compute the mean and variance of a sum of independent variables, recognize \(\chi^2\) as a sum of squared standard normals, and read \(\lVert\cdot\rVert\) and eigenvalues of a symmetric matrix. If the last item is uncertain, revisit [eigenvalues and invariant subspaces](../02-linear-algebra/04-eigenvalues-invariant-subspaces.md) first.

### Learning route: scalar variance to research judgment

Read this chapter in three passes.

1. **Build the geometry.** Sections 1–4 use only sums, variances, and symmetry. After them, predict the scale of a norm, dot product, or cosine before calculating it.
2. **Turn geometry into guarantees.** Sections 5–6 explain what random projection preserves and why covariance estimation fails when \(d/n\) is not small. Track whether each statement is an exact moment calculation, a high-probability bound, or an asymptotic approximation.
3. **Audit an ML claim.** Sections 7–8 ask whether an observed effect concerns predictions, distances, eigenvectors, or parameters. Those claims require different stability checks.

A useful habit is to write the scalar random sum first. The high-dimensional phenomena in this chapter are ordinary one-dimensional concentration applied to the right sum.

## 1. Two dimensions lie to you

Draw \(x\sim\mathcal N(0,I_d)\): each coordinate is an independent standard normal. Ask a simple question — *where is this vector?*

In \(d=1\), the density peaks at the origin, so the typical point is near zero. That intuition is correct in \(d=1\), survives in \(d=2\), and is **false** in \(d=100\).

The density is still maximal at the origin. But the *volume* available at radius \(r\) grows like \(r^{d-1}\), and the product of a shrinking density with an exploding volume concentrates sharply away from zero. The mass is not where the density is highest. This is the first and most important correction to low-dimensional intuition: **in high dimensions, typical and most-likely are different places.**

Three consequences follow, and the next three sections prove each one.

1. Almost every sample has nearly the same norm, \(\lVert x\rVert\approx\sqrt d\).
2. Almost every pair of samples is nearly orthogonal.
3. Almost all the mass sits in a thin shell, not in the interior and not in any corner.

## 2. The norm concentrates: \(\lVert x\rVert\approx\sqrt d\)

Let \(x\sim\mathcal N(0,I_d)\). Then \(\lVert x\rVert^2=\sum_{i=1}^dx_i^2\) is a sum of \(d\) independent terms, each with

$$
E[x_i^2]=1,
\qquad
\operatorname{Var}(x_i^2)=E[x_i^4]-1=3-1=2 .
$$

So by linearity and independence,

$$
E\bigl[\lVert x\rVert^2\bigr]=d,
\qquad
\operatorname{Var}\bigl(\lVert x\rVert^2\bigr)=2d .
$$

This is already the whole story. The *mean* grows like \(d\) while the *standard deviation* grows only like \(\sqrt{2d}\), so the **relative** fluctuation is

$$
\frac{\operatorname{sd}(\lVert x\rVert^2)}{E[\lVert x\rVert^2]}
=\frac{\sqrt{2d}}d
=\sqrt{\frac2d}
\;\longrightarrow\;0 .
$$

Chebyshev's inequality converts this into a bound: for any \(t>0\),

$$
P\left(\left|\frac{\lVert x\rVert^2}d-1\right|\ge t\right)
\le\frac{2}{dt^2}.
$$

**Worked example — \(d=4096\).** The relative standard deviation of \(\lVert x\rVert^2\) is \(\sqrt{2/4096}\approx0.022\). Taking square roots, \(\lVert x\rVert\) sits within about \(1\%\) of \(\sqrt{4096}=64\) for the overwhelming majority of draws. A "random hidden state" is not a vector of unpredictable length. Its length is essentially deterministic; only its *direction* is random.

The Chebyshev bound is weak — it decays like \(1/d\). Because \(x_i^2\) is sub-exponential rather than bounded, Bernstein's inequality (developed in [the concentration section of the limit-theorems lesson](05-limit-theorems-monte-carlo.md)) sharpens it to an exponential ceiling,

$$
P\bigl(\bigl|\lVert x\rVert^2-d\bigr|\ge td\bigr)
\le2\exp\bigl(-c\,d\min(t,t^2)\bigr),
$$

for an absolute constant \(c\). Deviations of fixed relative size become exponentially unlikely **in the dimension**.

> **Practice — Foundation:** Compute \(E[\lVert x\rVert^2]\) and \(\operatorname{Var}(\lVert x\rVert^2)\) for \(x\sim\mathcal N(0,I_{100})\).
>
> **Practice — Core:** Use Chebyshev to bound \(P(\lVert x\rVert^2\ge1.2d)\) at \(d=1000\), then compare with the exponential form above at \(c=1/8\).
>
> **Practice — Stretch:** Repeat the mean/variance computation for \(x\) with iid coordinates of mean zero, variance \(\sigma^2\), and finite fourth moment \(\kappa\sigma^4\). Show the relative fluctuation is \(\sqrt{(\kappa-1)/d}\) and identify which distributions make concentration slower.

## 3. Random directions are nearly orthogonal

Let \(x,y\sim\mathcal N(0,I_d)\) be independent and let \(\theta\) be the angle between them:

$$
\cos\theta=\frac{x^Ty}{\lVert x\rVert\,\lVert y\rVert}.
$$

By rotational invariance of the standard Gaussian we may condition on \(y\) and rotate it to \(e_1\) without changing the distribution of \(\cos\theta\). Then

$$
\cos\theta=\frac{x_1}{\lVert x\rVert}.
$$

Symmetry across coordinates gives \(E[x_i^2/\lVert x\rVert^2]=1/d\) for every \(i\), since the \(d\) terms are exchangeable and sum to one. Therefore

$$
E[\cos\theta]=0,
\qquad
E[\cos^2\theta]=\frac1d,
\qquad
\operatorname{sd}(\cos\theta)=\frac1{\sqrt d}.
$$

**Worked example — \(d=768\).** The typical cosine similarity between two independent random directions is about \(1/\sqrt{768}\approx0.036\). Two random 768-dimensional vectors are, to a very good approximation, perpendicular.

This single fact underwrites a great deal of embedding practice. A cosine similarity of \(0.30\) sounds unimpressive on a \([-1,1]\) scale, but in \(d=768\) it is more than eight standard deviations from the random baseline. **Similarity scores must be read against the high-dimensional null, not against 1.0.** It also explains why very many nearly-orthogonal directions fit in a space of dimension \(d\): the number of unit vectors with pairwise \(|\cos|\le\varepsilon\) grows exponentially in \(d\), which is what allows a model to store far more distinguishable features than it has dimensions.

![In high dimensions almost all the Gaussian mass lies in a thin shell of radius sqrt(d), and independent directions are nearly perpendicular.](../assets/high-dimensional-shell.svg)

> **Practice — Foundation:** Compute the typical \(|\cos\theta|\) between random directions at \(d=64\), \(d=768\), and \(d=4096\).
>
> **Practice — Core:** A retrieval system reports a cosine similarity of \(0.12\) at \(d=1536\). Express this as a number of standard deviations from the random baseline, and say what further evidence you would want before calling it a match.
>
> **Practice — Stretch:** Embeddings are not isotropic in practice: trained representations often have a dominant common direction. Explain how that inflates raw cosine similarities and design a centering correction, stating what the correction assumes.

## 4. The thin shell, and why "corners" are empty

Combining the previous two sections: the norm is essentially \(\sqrt d\) and the direction is uniform. So the Gaussian in high dimensions is, for practical purposes, the **uniform distribution on a sphere of radius \(\sqrt d\)**, smeared over a shell of thickness \(O(1)\).

The same effect shows in the cube. For \(u\) uniform on \([-1,1]^d\),

$$
E[\lVert u\rVert^2]=d\cdot E[u_1^2]=\frac d3,
$$

so \(\lVert u\rVert\approx\sqrt{d/3}\approx0.577\sqrt d\), while the corner \((\pm1,\ldots,\pm1)\) has norm \(\sqrt d\). The corners are a vanishing fraction of the volume; the inscribed ball is also a vanishing fraction. Almost all the volume of a high-dimensional cube is neither near the center nor near the corners.

The practical reading: **uniform sampling in a high-dimensional box does not explore the box.** Random hyperparameter search, random perturbation baselines, and naive "sample a random point in the region" procedures all inherit this. If you need to cover a region, cover it deliberately — see the sampling designs in [sampling design and ML evaluation](10-sampling-design-ml-evaluation.md).

> **Practice — Foundation:** Compute \(E[\lVert u\rVert]\) approximately for \(u\) uniform on \([-1,1]^{300}\).
>
> **Practice — Core:** Estimate the fraction of the volume of \([-1,1]^d\) lying inside the inscribed unit ball at \(d=20\), and explain why rejection sampling with a cube proposal fails in high dimensions.
>
> **Practice — Stretch:** A perturbation study samples uniformly from a norm ball to test robustness. Explain what part of the ball is actually being tested and propose a sampling scheme that probes the interior as well as the shell.

## 5. Johnson–Lindenstrauss: distances survive random projection

If high dimensions are so strange, can we shrink them? Remarkably, yes, and the amount of shrinkage needed does **not** depend on the original dimension.

Let \(A\in\mathbb R^{m\times d}\) have iid \(\mathcal N(0,1/m)\) entries. For a fixed vector \(v\),

$$
E\bigl[\lVert Av\rVert^2\bigr]=\lVert v\rVert^2 ,
$$

because each row \(a_j\) satisfies \(E[(a_j^Tv)^2]=\lVert v\rVert^2/m\). So a random projection preserves squared length *in expectation*, for any \(v\), with no assumptions at all.

Concentration turns "in expectation" into "almost surely". Writing \(\lVert Av\rVert^2/\lVert v\rVert^2\) as an average of \(m\) independent squared standard normals — exactly the object of section 2, with \(m\) in place of \(d\) — gives

$$
P\left(\left|\frac{\lVert Av\rVert^2}{\lVert v\rVert^2}-1\right|>\varepsilon\right)
\le2\exp\left(-\frac{m(\varepsilon^2-\varepsilon^3)}4\right).
$$

Now apply this to the \(\binom n2\) difference vectors \(x_i-x_j\) of an \(n\)-point set and take a union bound. The failure probability is at most \(n^2\exp(-m(\varepsilon^2-\varepsilon^3)/4)\), which is below \(1\) as soon as

$$
m\;\gtrsim\;\frac{8\log n}{\varepsilon^2}.
$$

**The Johnson–Lindenstrauss lemma.** Any \(n\) points in \(\mathbb R^d\) can be mapped into \(\mathbb R^m\) with \(m=O(\varepsilon^{-2}\log n)\) so that all pairwise distances are preserved within a factor \(1\pm\varepsilon\).

Read the bound carefully. \(m\) depends on the **number of points** and the accuracy, and **not on \(d\)**. One million points at \(\varepsilon=0.1\) need roughly \(8\log(10^6)/0.01\approx11{,}000\) dimensions regardless of whether they started in \(10^3\) or \(10^6\).

Two honest caveats. The \(\log n\) is unavoidable, so \(\varepsilon=0.01\) costs a hundred times more dimensions than \(\varepsilon=0.1\) — high accuracy is expensive. And JL preserves *distances*, not every downstream quantity: inner products survive via polarization, but rankings near ties, small-margin decisions, and anything depending on low-variance directions can still flip.

> **Practice — Foundation:** Compute the JL target dimension for \(n=10^4\) points at \(\varepsilon=0.2\) and at \(\varepsilon=0.05\).
>
> **Practice — Core:** Show \(E[\lVert Av\rVert^2]=\lVert v\rVert^2\) directly from the entry distribution of \(A\), and identify where independence is used.
>
> **Practice — Stretch:** Distances are preserved, but a nearest-neighbour ranking is a comparison of distances. Construct a configuration where a \(1\pm\varepsilon\) distance guarantee still permits the top-1 neighbour to change, and state the margin condition that prevents it.

## 6. Estimated covariance is not the covariance

Sections 2 through 5 concerned a *single* random vector. Now take \(n\) samples and estimate the covariance:

$$
\hat\Sigma=\frac1n\sum_{i=1}^nx_ix_i^T .
$$

Every entry of \(\hat\Sigma\) is an average of \(n\) terms, so each entry is individually accurate to \(O(1/\sqrt n)\). But \(\hat\Sigma\) has \(d^2\) entries, and the *matrix* error in operator norm behaves like

$$
\lVert\hat\Sigma-\Sigma\rVert_{\text{op}}
\;\lesssim\;
\lVert\Sigma\rVert\left(\sqrt{\frac dn}+\frac dn\right),
$$

for sub-Gaussian data. The governing quantity is the **aspect ratio** \(d/n\), not \(n\) alone. Accurate covariance estimation requires \(n\gg d\), not merely \(n\) large.

**Marchenko–Pastur.** Make the truth as simple as possible: let \(\Sigma=I_d\) and let \(\gamma=d/n\) be fixed as both grow. The eigenvalues of \(\hat\Sigma\) do **not** converge to \(1\). They spread across

$$
\bigl[(1-\sqrt\gamma)^2,\;(1+\sqrt\gamma)^2\bigr].
$$

**Worked example — \(d=100\), \(n=400\).** Here \(\gamma=1/4\), so the sample eigenvalues fill \([(1-0.5)^2,(1+0.5)^2]=[0.25,\,2.25]\). The true spectrum is a single point at \(1\). With four times as many samples as dimensions, the estimated spectrum spans a factor of nine. The largest sample eigenvalue is biased **up**, the smallest biased **down**, and the "top principal component" of pure isotropic noise looks convincingly dominant.

Three consequences that matter in practice:

- **PCA on modest sample sizes overstates structure.** A scree plot with a visible leading eigenvalue is not evidence of signal until you compare against the Marchenko–Pastur edge for your \(\gamma\).
- **Whitening amplifies noise.** Whitening divides by \(\sqrt{\hat\lambda_i}\); the smallest eigenvalues are precisely the most underestimated, so whitening inflates the noisiest directions. This is the ill-conditioning argument of [SVD and PCA](../02-linear-algebra/05-svd-pca.md) with a statistical cause.
- **Shrinkage is not optional decoration.** Ledoit–Wolf-style estimators pull \(\hat\Sigma\) toward a scaled identity precisely to undo the spreading above.

This section is also the probabilistic half of a claim made in [nonconvex landscapes](../03-optimization/05-nonconvex-landscapes-training-dynamics.md): random symmetric matrices have spread-out, repelling spectra, which is why a randomly encountered critical point in a large model is overwhelmingly a saddle.

> **Practice — Foundation:** Compute the Marchenko–Pastur support for \(\gamma=0.01\), \(\gamma=0.25\), and \(\gamma=1\).
>
> **Practice — Core:** You have \(n=2000\) samples in \(d=512\) dimensions. Give the MP edges and state the smallest eigenvalue you could observe from pure noise. What does this imply about the rank you would select?
>
> **Practice — Stretch:** Design a permutation-based null for a scree plot: shuffle each feature independently across samples, recompute the spectrum, and compare. Explain precisely which null hypothesis this tests and how it differs from the MP prediction.

## 7. Where this already appears in your models

- **Attention scaling.** For \(q,k\) with iid zero-mean, unit-variance entries, \(q^Tk\) is a sum of \(d_k\) independent terms, so \(\operatorname{Var}(q^Tk)=d_k\) and the logits have standard deviation \(\sqrt{d_k}\). Without the \(1/\sqrt{d_k}\) divisor, softmax inputs grow with head dimension and saturate. This is section 2 applied to an inner product — see [causal transformers](../11-llm-systems/01-causal-transformers-training-systems.md).
- **Initialization.** For \(y=Wx\) with \(W\) entries of variance \(\sigma^2\) and \(x\in\mathbb R^{d}\), \(\operatorname{Var}(y_j)=d\sigma^2\operatorname{Var}(x)\). Holding activation scale constant across layers forces \(\sigma^2\propto1/\text{fan\_in}\). Every initialization scheme is a variance-of-a-sum calculation.
- **Embedding similarity.** Cosine baselines are \(1/\sqrt d\), not \(0\), and anisotropy shifts them further.
- **Random projections and hashing.** JL is the guarantee behind random-projection LSH, sketching, and dimensionality reduction before nearest-neighbour search.
- **Covariance-based methods.** Whitening, PCA, Mahalanobis distances, natural-gradient preconditioners and linear probes all estimate a covariance and all inherit section 6's aspect-ratio problem.
- **Noise injection.** A Gaussian perturbation of standard deviation \(\sigma\) per coordinate has total norm \(\approx\sigma\sqrt d\). Reporting "we added noise of size 0.01" is meaningless without the dimension.

## 8. Failure modes

- **Quoting per-coordinate scale as if it were vector scale.** Always convert: per-coordinate \(\sigma\) means norm \(\sigma\sqrt d\).
- **Comparing cosine similarities across different dimensions** without renormalizing by the \(1/\sqrt d\) baseline.
- **Reading a scree plot without a null.** Structure must be judged against the MP edge or a permutation null.
- **Whitening with an ill-conditioned \(\hat\Sigma\)** when \(n\) is not \(\gg d\).
- **Assuming random search explores a box.** It samples the shell.
- **Treating JL as lossless.** Distances are preserved within \(1\pm\varepsilon\); ties, margins, and rankings are not guaranteed.
- **Applying Gaussian intuition to heavy-tailed coordinates.** Concentration slows as the fourth moment grows, and fails entirely without one.

### Worked research audit: one transformer block

Suppose a head uses \(d_k=64\), a residual stream has width 4096, and a linear probe uses \(n=2000\) examples.

**Attention scale.** If query and key coordinates are independent with mean zero and variance one, then

$$
q^\top k=\sum_{j=1}^{64}q_jk_j,
\qquad E[q^\top k]=0,
\qquad \operatorname{Var}(q^\top k)=64.
$$

Unscaled logits have standard deviation 8. Dividing by \(\sqrt{64}=8\) restores order-one variation. This is a scale argument, not a claim that trained queries and keys remain independent Gaussians.

**Initialization scale.** A linear unit with 4096 independent, unit-variance inputs and weights of variance \(1/4096\) has output variance \(4096(1/4096)=1\). The \(1/\sqrt{\text{fan-in}}\) weight scale is the same variance-of-a-sum calculation.

**Probe geometry.** Here \(d/n=4096/2000\approx2.05\). The sample covariance is singular, with at least \(4096-2000\) zero eigenvalues before centering costs another degree of freedom. Stable held-out predictions can coexist with unstable weights: prediction stability concerns the fitted function, whereas coefficient stability asks whether feature directions are identified. Bootstrap both held-out performance and coefficient direction; do not use one as evidence for the other.

## 9. Runnable lab: random projection distortion

Implement `projection_distortion` in the [learner exercises file](../../labs/exercises.py). Given a list of points, a target dimension \(m\), and a seed, build \(A\in\mathbb R^{m\times d}\) with iid \(\mathcal N(0,1/m)\) entries and return the **largest** relative squared-distance distortion over all distinct pairs:

$$
\max_{i<j}\left|\frac{\lVert A(x_i-x_j)\rVert^2}{\lVert x_i-x_j\rVert^2}-1\right| .
$$

Requirements: reject an empty point list, points of differing length, a non-positive target dimension, and any pair of identical points (the distortion is undefined when the denominator is zero). Seed a local `random.Random(seed)` so results are reproducible without disturbing global state.

Then, outside the graded function, study the behaviour:

1. Fix \(n=60\) points in \(d=512\) and sweep \(m\in\{8,32,128,512\}\). Plot the maximum distortion against \(m\) and compare with the \(\varepsilon\approx\sqrt{8\log n/m}\) prediction.
2. Hold \(m\) fixed and increase \(d\) from \(64\) to \(4096\). Confirm the distortion does **not** grow with \(d\).
3. Increase \(n\) at fixed \(m\) and observe the \(\log n\) penalty appear as a slow rise.
4. Replace Gaussian entries with \(\pm1/\sqrt m\) signs. Verify the distortion is comparable and explain why the proof still works.

## 10. Derivations to own

1. \(E[\lVert x\rVert^2]=d\) and \(\operatorname{Var}(\lVert x\rVert^2)=2d\) for \(x\sim\mathcal N(0,I_d)\), including the \(E[x_i^4]=3\) step.
2. \(E[\cos^2\theta]=1/d\) by rotational invariance and exchangeability.
3. \(E[\lVert Av\rVert^2]=\lVert v\rVert^2\) for a \(1/m\)-variance Gaussian projection.
4. The union-bound step from a single-vector concentration bound to the JL lemma, including where \(\binom n2\) enters.
5. Why \(\operatorname{Var}(q^Tk)=d_k\) and therefore why attention divides by \(\sqrt{d_k}\).
6. The variance-propagation argument giving \(\sigma^2\propto1/\text{fan\_in}\).

## 11. End-of-unit practice (graded)

**Foundation**

1. For \(x\sim\mathcal N(0,I_{1024})\), give the mean and standard deviation of \(\lVert x\rVert^2\), and the approximate value of \(\lVert x\rVert\).
2. Give the typical cosine similarity between independent random directions at \(d=1536\).
3. State the Marchenko–Pastur support at \(\gamma=0.09\).

**Core**

4. A team adds Gaussian noise with per-coordinate \(\sigma=0.02\) to a \(4096\)-dimensional activation and reports a "2% perturbation". Compute the actual relative norm change and correct the claim.
5. Derive the JL target dimension for \(n=5\times10^5\), \(\varepsilon=0.1\), and explain why the answer is unchanged if the points live in \(d=10^4\) or \(d=10^7\).
6. Using the aspect-ratio bound, state how many samples are needed to estimate a \(d=768\) covariance to \(10\%\) operator-norm accuracy, and comment on whether typical probing datasets meet it.
7. Show that the \(\pm1\) sign projection has the same first two moments as the Gaussian projection, and explain the practical advantage.

**Stretch**

8. A linear probe on \(d=4096\) features trained with \(n=2000\) examples reports 91% accuracy. Using section 6, explain why the probe's *weights* may be meaningless even if its *accuracy* is real, and design a check that separates the two claims.
9. Retrieval quality drops when embeddings are projected from 1536 to 256 dimensions, even though measured distance distortion is under 5%. Give three mechanisms consistent with both observations and one experiment that discriminates among them.
10. Construct a distribution on \(\mathbb R^d\) with iid coordinates for which the norm does **not** concentrate at the usual rate, state which moment assumption fails, and say what this implies for JL applied to such data.

<details><summary>Solution sketches</summary>

1. Mean \(1024\), standard deviation \(\sqrt{2048}\approx45.3\), so \(\lVert x\rVert\approx32\) within roughly \(0.7\%\).
2. \(1/\sqrt{1536}\approx0.0255\).
3. \(\sqrt\gamma=0.3\), so \([0.49,1.69]\).
4. The norm change is \(\sigma\sqrt d=0.02\times64=1.28\), while a typical activation norm is itself \(\approx\sqrt d\) times its per-coordinate scale; the relative change is \(\sigma\) divided by the per-coordinate activation scale, so the "2%" claim is only correct if the activations have unit per-coordinate scale. State the per-coordinate scale explicitly or report the ratio of norms.
5. \(m\approx8\log(5\times10^5)/0.01\approx10{,}500\). The bound involves only \(n\) and \(\varepsilon\); \(d\) never enters because the concentration statement is about the \(m\)-dimensional image, not the domain.
6. Requiring \(\sqrt{d/n}\approx0.1\) gives \(n\approx100d\approx76{,}800\). Probing sets of a few thousand examples are far short, so probe covariance structure is unreliable even when probe accuracy is not.
7. Each entry has mean zero and variance \(1/m\), and the concentration proof needs only sub-Gaussianity, which bounded entries satisfy. The advantage is cheaper generation, cheaper multiplication, and less memory.
8. Accuracy depends on the fitted function, which can be stable even when the parameterization is not. With \(d/n>1\) the feature covariance is singular, so the weight vector is not identified: many weight vectors give identical predictions. Check by refitting on bootstrap resamples and reporting the variability of weights versus the variability of accuracy.
9. Possibilities: low-variance but task-relevant directions were destroyed; the distance guarantee holds on average but fails on the small-margin pairs that determine top-\(k\) ranking; anisotropy means the projection interacts with a dominant common direction. Discriminate with a margin analysis of the affected queries, a per-pair distortion histogram restricted to true neighbours, and a centered-embedding rerun.
10. Coordinates with infinite fourth moment, for instance a Student-\(t\) with 3 degrees of freedom: the variance of \(\lVert x\rVert^2\) is infinite, the relative fluctuation does not shrink like \(\sqrt{2/d}\), and JL's exponential bound no longer applies, though weaker statements can survive.

</details>

## Mastery check

Derive the norm and angle concentration results without notes; convert freely between per-coordinate and whole-vector scales; state and justify the JL dimension for a given \(n\) and \(\varepsilon\), including its independence from \(d\); compute Marchenko–Pastur edges for a given aspect ratio and use them to judge whether an observed spectrum shows real structure; and explain, from variance of a sum, why attention divides by \(\sqrt{d_k}\) and why initialization scales as \(1/\sqrt{\text{fan\_in}}\).
