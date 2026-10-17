# Review of LA01 video v3 script

Reviewed `docs/LA01_VIDEO_V3_SCRIPT.md` on 17 October 2026. This is a script and storyboard review, not a review of a rendered video. The script has not been changed.

## Verdict

This is substantially closer to the intended lesson. It supplies fresh narration, a connected set of examples, definitions, worked calculations and several real proofs. The analogy leads into the mathematics, and the mathematics explains the picture. Keep that approach. Do not solve remaining pacing problems by removing technical depth indiscriminately.

Revise the mathematical points below before animation. After those revisions, the Opening and Act 1 are suitable for a low-resolution pilot. The full script should not go straight to a final render: Acts 5, 7, 9 and 10 need particular attention to how much thinking time the visuals require.

## Required corrections

### 1. Conditioning needs a relative-error explanation, not just a large inverse gain

Location: Act 10.1–10.2, script lines 963–980.

The algebra for the near-parallel basis is correct. However, changing the target from `(0, 1)` to `(0, 1.01)` changes the coefficient vector from `(-100, 100)` to `(-101, 101)` at epsilon 0.01. That is a 1% change in the target and a 1% change in the coefficients. It demonstrates large absolute sensitivity, but does not demonstrate the large relative amplification normally described by a matrix condition number.

Keep the vertical-target example to explain long, cancelling recipes. Then use target `(1, 0)`, whose recipe is `(1, 0)`, and perturb it to `(1, 0.01)`. With epsilon 0.01, its recipe becomes `(0, 1)`. A target perturbation of length 0.01 changes the recipe by length sqrt(2). This makes the relative instability visible.

Introduce the condition number precisely, for a square invertible matrix and a specified norm:

`kappa(B) = ||B|| ||B^-1||`

For a fixed B and nonzero target T, it bounds relative sensitivity to target perturbations:

`||delta c|| / ||c|| <= kappa(B) ||delta T|| / ||T||`.

Explain that this is a worst-case bound, not an amplification attained by every perturbation. Also change “a huge one means two of your moves are nearly doing the same job”: unequal column scales can cause a large condition number even with perpendicular columns, as the script itself notes later.

The displayed condition-number values check out if they are intended for epsilon values 1, 0.1, 0.01 and 0.0001. Label those values and specify the Euclidean/2-norm convention.

### 2. Separate residual tolerance, rank tolerance and pivot selection

Location: Act 10.3, script lines 993–1011.

The displayed rule `||Vc - w|| <= atol + rtol ||w||` tests reconstruction error for a particular recipe and target. It does not define numerical rank. The diagonal-matrix example concerns a threshold on singular values, which is a different test.

Keep both, but label their questions:

- Residual: “Does this recipe reconstruct this target accurately enough?”
- Numerical rank: “Which directions remain distinguishable at the chosen resolution?”

For the rank example, explicitly compare singular values with an absolute threshold of `10^-6`, then with a relative threshold of `10^-6 sigma_max`. The singular values of the diagonal examples are just their nonnegative diagonal entries, so no SVD derivation is needed here. NumPy's rank documentation explicitly describes its singular-value test and the role of tolerance: [official documentation](https://numpy.org/doc/stable/reference/generated/numpy.linalg.matrix_rank.html).

Also replace “A zero pivot is where a direction went missing.” An invertible matrix such as `[[0, 1], [1, 0]]` starts with a zero diagonal entry but can be handled by a row swap. Say: “A zero candidate pivot may require a row swap. When no pivot can be found in the remaining column, that column supplies no new pivot direction.” Keep the existing collapsed-panel calculation: its conclusion is correct.

### 3. Repair the general argument behind musical chairs

Location: Act 5.2, script lines 484–510.

“The one who stands up is always an original move, never an earlier guest, because the guests are independent” needs a more careful explanation. Independence of the guests guarantees that a suitable original move can be removed; it does not imply that every removable vector is an original.

The existing left-to-right scan works because all guests are placed first. Their independent prefix contains no redundant vector, so the first vector built from its predecessors must be an original. Explain that ordering explicitly before the numeric scan.

Suggested narration:

> Put all the guests first, then the remaining originals. The enlarged list has redundancy, because the row already reached everywhere before the new guest arrived. Now find the first move that can be built from the ones before it. It cannot be a guest: the guests are independent. So it is an original, and removing it preserves the span.

The numerical example is correct. Show it as one worked instance of that general argument. The fourth guest should appear as a proposed guest whose independence must fail, rather than a genuinely fourth independent vector in three-dimensional space.

### 4. Correct the LoRA interpretation: rank limits dimension, not distance

Location: Act 8.4, especially script lines 820 and 832; repeated in the finale.

The shapes, parameter counts and rank bound are correct. “The restriction is on how far you can move” is not: a rank-one update can have arbitrarily large magnitude.

Also make clear that the small room is learned. Both factors are trainable in standard LoRA; the column span of L need not remain fixed during training. The original [LoRA paper](https://arxiv.org/abs/2106.09685) describes freezing the base weights and training the rank-decomposition matrices.

Suggested replacement:

> It is the update that has rank at most eight, not the resulting weight matrix. That limits the number of independent output directions the update can produce; it does not bound its size. Training learns both the small room, through L, and the recipes inside it, through R.

### 5. Put boundaries on the rubber-sheet and image analogies

Location: Act 6.1 and 6.3, script lines 560–566 and 613–616.

An arbitrary rubber-sheet deformation does not preserve addition, straight lines or spans. Animate a uniform invertible linear stretch or shear, keeping the origin fixed, and say so. The visual currently promises that parallelograms survive, which an arbitrary deformation would violate.

Images and sounds work as vector examples when represented by unrestricted real-valued arrays or functions. Displayable pixel values clipped to a bounded range do not form a real vector space. One sentence is enough: “We mean the underlying numerical signals, before clipping them to what a screen or speaker can reproduce.”

### 6. Correct the polynomial-space application and the centring generalisation

Location: script lines 630 and 740.

All polynomials form an infinite-dimensional vector space. It is misleading to identify that particular space as where Fourier analysis and kernel methods live. Replace with: “Other function spaces, including infinite-dimensional ones, appear in Fourier analysis and kernel methods.”

“Almost every method starts by centring the data” is too broad. Ground the claim in a particular use: “For PCA, centring lets us study variation around the mean rather than the cloud's offset from the origin.” Also avoid saying a general centred cloud fans out in every direction: centring does not make it full-dimensional.

## Teaching and pacing revisions

### The introduction is smoother, but could still start with something to notice

The 179-word opening now provides context and a promise, so it addresses the abruptness of the published version. However, it spends over a minute on AI, matrices and fine-tuning before the viewer encounters the concrete question. Those are applications the newcomer cannot yet interpret.

Consider a brief concrete observation after the welcome: two sliders, two visible movements, one target. Then use the AI montage to connect that question to the larger motivation. Return to the craft to develop it carefully. Keep the introduction short; do not add another long preamble.

Change “only arithmetic needed” to “we build from basic arithmetic and algebra.” The video uses substitution, symbolic sums, square roots and inequalities; the reassuring promise should accurately describe the support viewers will receive.

### Preserve the technical content, but give important deductions time to land

Acts 1–4 have a clear progression: move, recipe, territory, redundancy, address. They include worthwhile calculations and arguments. Keep them.

The pressure points are later:

- Act 5.3 introduces four substantial results in one short sequence. Give at least the “n vectors: one test is enough” result its own visual deduction from growing/trimming a basis. Label the subspace result with its finite-dimensional assumption.
- Act 7.3 moves from intersections to sums, the dimension formula, direct sums, a proof and a three-equation split. Let the same floor/wall example show the shared direction, multiple decompositions and dimension count before moving to the direct-sum case. The current worked calculation is correct; the concern is time to interpret it.
- Act 9.2 should show completing the square or an equivalent explicit step to locate the parabola's minimum. “Pick its lowest point, simplify” skips the step a beginner is least likely to supply. Include the zero-vector case separately for Cauchy–Schwarz, and state that cosine similarity requires two nonzero vectors.
- Act 9.4 should retain the Gram-matrix identity and the changed-coordinate geometry. They are strong technical payoffs. Give each its own question and pause instead of treating the geometry correction as a final warning.

In Act 9.4, “make the overlaps small, and the cross-talk is small” needs a qualification: the total also depends on the number and magnitudes of active features. The existing formula shows why; many small contributions can accumulate.

### Tighten a few definitions without adding long detours

- At 1.2, qualify “vector = list”: here we begin with coordinate vectors in R^n; later a list can describe a more general vector relative to a basis. At 4.4, “a list of numbers is not the vector” is too categorical, since tuples themselves are vectors in R^n. Say “these coordinates describe the vector relative to the chosen basis.”
- The scalar-multiplication ratio display must handle c = 0: both entries vanish and their numerical ratio is undefined. Keep the proportionality statement rather than showing 0/0 as 2:1.
- At 9.1, the projection readout is a signed component, not always a nonnegative shadow length. Label it “signed component along u.”
- At 9.3, say “mutually orthogonal nonzero vectors are independent” in narration as well as in the proof.
- At 7.4, an affine set is a translated subspace; it may pass through the origin. Say it “need not pass through home,” rather than implying every affine set misses it.
- Mark the microphone encoding/readout as a simplified model of superposition. It illustrates the algebra; it is not a universal account of how neural features are decoded.

### The runtime is plausible, not established

An independent extraction found about 9,200 narration words, close to the script's 9,231-word table; different treatment of symbols accounts for some variation. Explicit pauses total 37 seconds. Written expressions will expand when converted into speech.

At 130–150 words per minute, narration alone is about 61–71 minutes. The final runtime also needs silence for reading equations, watching transformations and answering predictions. Some of that can overlap narration. A 60–90 minute result is plausible, but the 62–71 minute estimate is provisional until synthesized audio and a timed storyboard exist. Do not speed up technical explanations to preserve that narrower estimate.

## What to retain

- The target `(4, 5)` and its blue/gold and teal coordinates; the arithmetic checks out.
- The 3-D plane and reachable/unreachable target test.
- The round-trip derivation of dependence and the proof of unique coordinates.
- The polynomial coordinates, direct-sum numerical split and teal-coordinate dot-product example; the arithmetic checks out.
- The matrix column interpretation and the affine family of recipes for a target.
- The Cauchy–Schwarz and Gram-matrix arguments, with the qualifications above.
- The closing questions: reachable, unique, stable.

Recommended next step: revise the required corrections, then render only the Opening and Act 1 at low resolution. Review its actual narration, equation-reading time and slider behaviour before committing to the whole production.
