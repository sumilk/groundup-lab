# PS00 revised script review

**Verdict: the substantive revision is successful; make the local corrections below before final script sign-off.** No further structural rewrite or expansion to a target duration is needed. This reviews the revised written script, not the delivery or rendered visuals.

## Previous findings resolved

The script now explains De Morgan's laws, set difference, containment and monotonicity, the general counting formulas, and the partition requirement for total probability. Sensitivity and likelihood-ratio wording are corrected. Independence assumptions are explicit where needed; Monty Hall specifies a uniform prize and a host policy. The token example includes a stopping token. Standard error starts with repeated experiments, and the simulation-check claim no longer treats unusual random output as proof of a bug.

The CDF threshold question and the stepwise birthday-pair indicator argument improve the teaching. The latter correctly distinguishes pairwise from mutual independence. Keeping the copied-die example, birthday pairs, and ten-roll check-in is justified: they serve different purposes.

I independently count **6,400 narrated words and 125 seconds of authored pauses**, matching the revised table. At the previous measured rate, 38.3 minutes of speech is a sound projection. **42–45 minutes remains an estimate** until the revised recording and scenes exist. Do not add examples merely to reach 55–65 minutes. Change “Measured, not estimated” at line 869 to “Measured word and pause counts; projected v2 runtime.”

## Corrections before sign-off

### 1. Make the scope of “not” unambiguous

**Line 118:** “Not A or B” can naturally mean `(not A) or B`, which is a different event from `not (A or B)`. The displayed identity is correct, but this is the precise ambiguity the spoken explanation needs to remove.

Replace the final sentence with:

> Neither A nor B happens exactly when A doesn't happen and B doesn't happen.

Keep the two-step shading. The second identity at line 123 is clear as written.

### 2. Stage the CDF so the prediction remains unanswered

**Lines 646–654:** the first visual instruction builds the entire staircase, including the horizontal segment through 1.5, before the viewer is asked about 1.5. Hiding only its plotted point leaves the answer visible in the segment.

Specify that the cumulative calculation is developed only at thresholds 0 and 1 first. Hold the threshold at 1, with the graph to its right undrawn. Ask about 1.5, pause, then move the threshold and extend the horizontal segment. Finish the staircase at 2 afterward. Show closed/open endpoints correctly for `P(X ≤ x)`.

### 3. State the full sampling model behind 0.76

**Lines 820–825:** independence between twenty scores does not by itself determine their individual sampling distributions. The displayed 0.76 requires independent Bernoulli correctness trials across the 200 examples too; knowing true accuracy and sample size alone is insufficient.

Use a compact explicit assumption:

> For this toy model, treat every prompt's answer on every example as an independent trial with a seventy-percent chance of being correct. Score each prompt on two hundred examples.

Then ask the existing prediction. Add `independent Binomial(200, 0.70) scores` to the calculation notes or screen annotation. Preserve the identical-predictions counterexample and fresh-evaluation advice.

### 4. Remove the claim that exactly half heads cannot occur

**Line 750:** “The fraction of heads won't be exactly a half” is false as an unconditional statement. For 100 independent fair flips, exactly 50 heads has probability about 7.96%.

Replace with “The fraction of heads needn't be exactly a half. In this run…” The numerical example of 47 heads is fine.

## Small clarity improvements

- **Lines 799–803:** “answerable” versus “solves ... the rest” creates an unnecessary puzzle about how unanswerable questions were solved. Call the filter “rated easy by a judge,” with the remainder “rated hard.” All counts and the ranking reversal remain valid. Describe it as performance on a selected population, without implying that reporting that population is inherently improper.
- **Lines 503–505:** read `(n-k)!` as “the factorial of n minus k,” with the grouped expression highlighted. State that selection is without replacement and `0 ≤ k ≤ n`; include `0! = 1` unobtrusively if boundary cases are displayed.
- **Lines 697–701:** the three-roll regrouping is good intuition for linearity. Keep it framed as intuition; a finite sample average is not itself the model expectation. A brief bridge such as “The same regrouping works when we weight each possible pair by its probability” connects it directly to the definition just taught.
- **Lines 752–759:** the histogram makes spread visible, but “standard deviation” is new for this audience. A short gloss—“a measure of how widely the frequencies spread around their mean”—is enough here; no variance derivation is needed.
- **Lines 718–724:** keep the three-person triangle separate from the full 23-person picture. Showing all 253 connections at equal prominence could obscure the sum. Highlight one pair, then a few more, then show the count and summation, with the remaining connections faint or grouped.

## Production recommendation

After these local edits, proceed to the agreed continuous 10–15-minute teaching sample and newcomer check. Prioritize the expanded set-operations passage and the conditioning/Bayes transition when assessing cognitive load. Retain the separate check of the later birthday-indicator passage. The revised script gives a stronger basis for intuitive teaching; whether the voice and motion feel natural still requires listening and viewing.
