# PS00 script review

**Verdict: revise before sign-off.** The script has a coherent argument and mostly sound worked calculations, but it does not yet substantiate the promised beginner-friendly pace or complete concept coverage. The strongest passages are the reversed dice conditionals, loaded-die conditioning, and explicit host-policy calculation in Monty Hall. Preserve those.

Scope: reviewed `PS00_VIDEO_SCRIPT.md` against the chapter and revised plan; checked scene narration word counts and current cached-audio durations. I did not listen to the audio or watch the rendered video. Naturalness, visual legibility, and novice comprehension remain unverified.

## 1. High — the length check is wrong, and the current material is much shorter than advertised

**Script lines 7 and 780–782.** There are **5,462 narrated words**, not 8,600. The explicit script pauses total **90.5 seconds**, not about 2.5 minutes. At the stated 150 words/minute, this is 36.4 minutes of speech; even adding the claimed 12–15 minutes of separate visual time gives approximately 50–53 minutes.

The stronger evidence is the existing audio: all **539 clips** for the current scene narration are present, totaling **32.52 minutes**. Every scene's narration word count matches the corresponding script section. Cue files place the last narration at approximately 36.3 minutes in aggregate across the sections; these are not independently verified final-video durations, but they contradict the 75–80-minute description. Conditioning has about 3.8 minutes of speech, random variables 2.1, and expectation 2.3.

**Required change:** replace the estimate with measured speech, pauses, and scene timings. Expand the arguments where a beginner needs intermediate steps, rather than filling a target with silent builds or slowing all speech uniformly. Recheck the hook's actual timestamp after that revision; do not delay the answer just to reach minute 28–30. The current cue timings suggest it arrives much earlier.

## 2. High — the promised coverage is incomplete

**Script lines 99–130, 145–201, 455–464, and 338–355.** The revised plan retains every lesson concept and explicitly promises to show De Morgan's laws. The script illustrates union, intersection, and complement individually, but never develops either complement-of-union/intersection identity. Set difference and subset also lack an explanation; the chapter's monotonicity consequence is absent.

Counting explains 4! and ten choose three, but never gives the general ordered-selection rule `n!/(n-k)!` or general combination rule `n!/[k!(n-k)!]`. A viewer can repeat this particular team calculation without seeing exactly how to reuse it. Total probability uses contaminated versus clean correctly, but never explicitly states the partition requirement: exhaustive, nonoverlapping cases.

**Required change:** add brief, connected demonstrations rather than isolated formula cards. On the existing grid, compare “neither A nor B” with “not A and not B,” then the other De Morgan identity. Show A-without-B, and containment with the corresponding mass inequality. Generalize the ordered-slot/team argument after the numerical example. Explain that the detector branches cover every submission exactly once. These additions can be compact, but should be audible reasoning accompanied by the relevant picture.

## 3. High — parts of the Bayes narration blur the distinction being taught

**Script lines 329–332.** The proposed mistaken argument begins “The detector is right ninety-five percent of the time.” That is not one of the assumptions: 95% is sensitivity, not overall accuracy. The next line says this first half is about contaminated models, but the spoken sentence never supplied that restriction. The explanation risks introducing a second confusion while correcting the first.

**Replacement:** “Ninety-five out of a hundred contaminated models get flagged. It's tempting to turn that into ‘ninety-five out of a hundred flags mean contamination.’ But those hundreds come from different groups.”

**Script line 360.** “A flag is ... more likely to come from a contaminated model” sounds like a claim about the source of an observed flag—the posterior. The likelihood ratio instead compares the chance of a flag under each assumed model status.

**Replacement:** “A contaminated model is twenty-three point seven five times as likely to be flagged as a clean model.”

**Script lines 719 and 754.** The precision/sensitivity gap depends on the false-positive rate as well as prevalence. Replace “The gap between them is the base rate” with “With so many negatives, even a five-percent false-positive rate produces far more false flags.” At the close, say both probabilities describe the detector and population, with different conditioning groups; their difference is not literally just one word.

## 4. Medium — state independence assumptions where the calculations need them

**Script lines 139, 287, 468–481, and 548.** Fairness alone does not give equal masses for paired outcomes. “Don't affect each other” can suggest a causal definition, which differs from statistical independence. The birthday calculation specifies uniform birthdays but not independent birthdays; correlated uniform birthdays would not yield the product shown. The quarter-mass coin examples likewise need independent tosses.

**Required change:** establish that the two dice rolls and coin tosses are independent, explaining initially that knowing one result leaves the other's chances unchanged. State independent, uniform birthdays in the hypothetical room model. At line 287, qualify “always true” as “whenever these conditional probabilities are defined,” consistent with the source chapter and the earlier positive-denominator condition.

The Monty Hall arithmetic itself is correct under the stated host policy. Make “placed at random” explicitly mean equally likely behind each of the three doors. Keep the distinction between a particular observed opening and the long-run switching strategy.

## 5. Medium — standard error appears before its intuition, and the simulation claim is too absolute

**Script lines 684–687.** The first explanation of standard error immediately gives `sqrt(p(1-p)/n)`. A newcomer has not been taught variance or why this square root measures fluctuation. “Typical distance” is an acceptable informal scale only if it is not read as the average absolute error. At n = 100 for a fair coin, 0.05 is the standard deviation of the frequency; the mean absolute error is approximately 0.04.

**Required change:** first show frequencies from repeated independent 100-flip runs, with most clustered near one half. Name standard error as the standard deviation of those frequencies. Give 0.05 as the scale for this example, then display the general formula with its derivation deferred. Read its grouping clearly: “the square root of the whole fraction.” Preserve the distinction between typical fluctuation and a bound.

**Script line 708.** A simulation far from the calculated answer does not prove a coding bug; a correct random simulation can produce an unusual result. Replace with “A large discrepancy would make us check both the calculation and the code, and try more runs.”

## 6. Medium — the token example needs a stopping event to describe a whole sentence

**Script lines 727–729.** `P(The, cat, sat)` as written describes those first three tokens, including sequences that continue. Calling this the probability of the whole sentence implies that generation stops there.

**Required change:** either call it the probability that generation begins with those tokens, or include an end-of-sequence token and its conditional probability. Label the token segmentation as illustrative.

## 7. Medium — later sections become a sequence of conclusions rather than guided reasoning

**Script lines 605–607, 639–661, and 717–750.** The CDF receives one short paragraph, linearity is announced and immediately applied, and six ML connections arrive in approximately three minutes of recorded speech. These passages can sound polished while leaving a novice with no time to build the idea. The copied-die example is useful, but the indicator calculation for 253 birthday pairs adds substantial arithmetic and dependence reasoning immediately afterward.

**Required change:** keep every concept, but simplify the route through it. Build the CDF at several thresholds, including one between possible values; let the viewer answer one. For linearity, group a few example trial totals in two ways before giving the general rule. Use ten die rolls as the single worked indicator application, replacing the birthday-pairs derivation if it crowds the explanation. Keep each ML connection, with a concrete denominator or changed assumption and an explicit bridge to the earlier picture; avoid announcing a six-item tour.

Most existing prediction silences are just 3–4 seconds. That may suit spotting a diagonal; it should not automatically serve computing a conditional probability or deriving a transformed PMF. Author the duration for the task, allow viewers to pause for calculations, and validate it with a newcomer. Do not replace the current timings with another universal pause length.

## Smaller edits

- Line 181: “The subtraction puts back the overlap” reverses the operation. Say “The subtraction removes the extra copy of the overlap.”
- Lines 516 and 525: unchanged probability for one event establishes independence of those events, not in general that one entire variable reveals nothing about the other. Say “Knowing the second die is one or two leaves the chance of an even first die unchanged.”
- Line 661: say the birthday-pair indicators are **not mutually independent**. Under the stated model they are pairwise independent, so the distinction deserves care if this example remains.
- Line 733: dependence can reduce effective information; leakage can inflate measured performance. Neither shared users nor dependence alone guarantees optimistic bias. Say near-duplicates across splits **can** make performance look better than on genuinely new users.
- Line 748: “seventy-six” and “seventy” should be spoken as percentages, matching the displayed score scale.
- Newly finished equations need time to inspect. The script promises authored equation pauses, but often supplies none; the odds conversion, CDF, and standard-error formula deserve explicit inspection beats.

## Sign-off criteria

Correct the timing report, close the coverage gaps, and fix the probability wording before script approval. Preserve one video per lesson and the approved Monty Hall treatment. After revision, use a continuous 10–15-minute passage to test whether the teacher-like flow survives beyond the sample. A real newcomer should then solve a changed conditioning problem and explain its denominator. Audio metadata and a written review cannot establish that the finished lesson feels natural.
