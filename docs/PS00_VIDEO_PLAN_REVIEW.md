# PS00 video plan — reviewer assessment

Reviewed against `PS00_VIDEO_PLAN.md` and the source chapter. This is a plan review; no PS00 audio or video was assessed. The proposal is promising, but I recommend revising it before production.

The strongest decisions are the reusable dice grid, natural frequencies for Bayes, explicit prediction pauses, and treating a random variable as a function. Keep those. The main weakness is that the plan promises a beginner's pace while covering enough material to encourage a rapid sequence of polished explanations. That can feel generated even with good wording and a good voice.

## 1. Give the viewer time to reason

**High priority — §3, lines 78–85.** Eight minutes for counting includes unequal sums, ordered versus unordered choices, combinations, birthdays, and a simulation. Another eight minutes introduces expectation, linearity, indicators, fixed points, and expected birthday pairs. Six closing minutes add four ML applications. These budgets leave little room to develop an unfamiliar argument or recover from a wrong guess.

Stat 110 is a useful reference for depth rather than topic density. Its [published syllabus](https://projects.iq.harvard.edu/sites/projects.iq.harvard.edu/files/stat110/files/stat110harvarditunesusyllabus.pdf) spreads the early foundations across several lectures. Its [practice guidance](https://stat110.hsites.harvard.edu/strategic-practice-problems) explicitly emphasizes solving problems. My recommendation is to borrow that time spent reasoning, alongside the story proofs.

Keep every lesson concept in this one video. Reduce redundant examples instead: drop shuffled-deck fixed points and expected birthday pairs, retaining one worked indicator example. Keep Bayes odds, pairwise versus mutual independence, and a brief CDF explanation. Preserve the chapter's ML connections, reusing earlier pictures wherever possible. Concision must not turn a concept into a formula merely mentioned in passing.

Before leaving each major idea, ask one small question with changed numbers or a changed event. A viewer repeating the worked example is weaker evidence than a viewer applying it once independently.

## 2. Make the opening payoff arrive earlier

**High priority — §2 and §3, lines 57 and 75–80.** The hook is withheld for roughly 35 minutes. Coins, set operations, axioms, combinations, and birthdays intervene. Several of these are useful foundations, but they are not prerequisites for understanding the detector example. The promise that everything before the answer is necessary overstates the dependency.

Retain the detector, but define contamination in one plain sentence. State that the percentages are assumptions of this example. Keep the opening under two minutes. Give an intermediate payoff when conditioning appears: “We need the flagged group as our denominator.” Then return to the detector immediately after the two reversed dice questions. Move birthdays away from this path.

Use the same calculation throughout: of 10,000 submissions, 190 contaminated and 392 clean submissions are flagged. Among 582 flags, 190 are contaminated: about 32.6%. These are model counts for an illustrative population, not a promise about every observed batch.

## 3. Correct the visual and mathematical shortcuts

**High priority — §1, lines 48–53; §3, lines 79–85.**

- **Probability mass versus area:** equal-sized dice cells can contain unequal weights. If a die becomes loaded, unchanged geometric area cannot continue to mean probability. Use explicit weights or bars for that example, or resize regions to preserve the area convention. State that the initial 36 equal weights assume fair, independent dice.
- **Conditioning:** retaining a region and scaling it works when that region has positive probability. With unequal weights, renormalize the retained mass; counting retained cells alone fails. Include a tiny weighted example after the fair-dice example to make the distinction visible.
- **Independence:** a rectangular overlap illustrates the product rule for these independent dice. Rectangular shape is not a definition or general test of independence. Use `P(A ∩ B) = P(A)P(B)` and check whether the conditional proportion changes.
- **Disjoint events:** replace “the opposite of independent” with “if both events have positive probability, disjointness makes them dependent.” Zero-probability events are an exception. The source chapter also uses “nonempty” where “positive probability” is needed; avoid inheriting that wording.
- **Monty Hall:** retain the approved example with roughly four minutes, after the detector payoff. Specify a uniformly placed prize, the player's initial choice, and a host who knows the prize location, always opens an unchosen goat door, always offers a switch, and chooses uniformly when either goat door is available. For initial choice 1 and observed opening of door 3, prize locations 1 and 2 have unnormalized weights `(1/3)(1/2) = 1/6` and `(1/3)(1) = 1/3`. Normalize to get 1/3 and 2/3. This explains why counting the two remaining doors fails. Distinguish this calculation for a particular opening from the overall 2/3 success rate of always switching. Merely deleting the opened door is insufficient.
- **Simulation error:** specify independent Bernoulli trials. Their frequency has standard error `sqrt(p(1-p)/n)`, which is 0.05 for a fair coin at 100 trials. This is a scale of fluctuation, not a guaranteed error bound or monotonic convergence.
- **Best of 20:** the proposed 0.76 depends on sample size and dependence between prompt scores. Under 20 independent Binomial(200, 0.70) scores, the expected maximum is about 0.7595. Identical predictions on the same examples produce identical scores, with expected best score 0.70. State a joint model or remove the number; true accuracy alone does not determine the answer.
- **Expectation title:** “The average you'll never roll” needs a single die with mean 3.5. The sum of two dice has mean 7, which can be rolled. Start with one die if retaining that title.

The main dice conditionals, detector arithmetic, 23-person birthday probability (about 0.5073), and expected shared-pair count (253/365) check out.

## 4. Avoid making natural teaching another template

**High priority — §0.1, lines 21–40.** Opening most sections with a trap risks a repetitive rhythm: guess, get it wrong, receive the reveal. “Most people say ninety-five. They're wrong” also asserts audience behavior without evidence and can make participation feel like a test designed to catch the viewer out.

Use different teaching moves where they help: sometimes predict, sometimes enumerate together, sometimes ask which denominator is relevant, sometimes inspect a counterexample. Let some predictions be correct and show why. Replace declarations about what everyone thinks with a specific plausible argument and examine where it breaks.

The phrase blacklist is secondary. Ordinary connective language can sound natural. Judge whether the explanation responds to the learner's likely question and whether the picture supports the reasoning. Do not add fake hesitation, random pauses, handwriting effects, or decorative movement to imitate a human.

For example, the conditioning sample could say:

> The first die is at least four. Which squares can we cross out? [pause] Eighteen remain. Three give a sum of nine, so the chance is three out of eighteen. Now reverse the information: we know the sum is nine. Which squares remain this time? [pause] Four. Three have a first die of at least four. The overlap stayed the same; the group we're comparing it with changed.

Reveal each set only after its question. This is sample wording, not an assessed recording.

## 5. Use a readable Bayes picture

**Medium priority — §5, line 112.** A 100 × 100 dot grid shows scale, but viewers cannot usefully count 190 versus 392 dots in a video. Prefer a labelled frequency tree or a two-by-two table, followed by two bars containing the flagged groups. Keep the population totals visible so the denominator change is traceable. Use colour plus labels; colour alone should not carry the distinction.

## Suggested sequence

These are provisional budgets to validate against the spoken script, not timing targets to force the lesson into.

| Minutes | Focus |
|---|---|
| 2 | Detector question; define the setting |
| 6 | Outcomes and events through coins and dice |
| 7 | Mass, axioms, event operations, complement, overlap, union bound; explicit loaded-die weights |
| 10 | Conditioning, reversed questions, multiplication and chain rules, replacement |
| 10 | Detector: reach 190/582 around overall minute 28–30; then Bayes notation, odds, changed prevalence |
| 4 | Monty Hall as weighted conditioning, with the host policy explicit |
| 8 | Fair-outcome counting, permutations, combinations, birthdays |
| 9 | Independence, disjoint counterexample, pairwise versus mutual independence |
| 6 | Random variable, PMF, CDF, different variables with the same distribution |
| 7 | One-die expectation, linearity, indicators with one worked example |
| 5 | Model versus frequency, sampling assumptions, copied-bit counterexample |
| 5 | ML connections using earlier pictures and explicit simulation assumptions |
| **89** | **Total; all lesson concepts retained, redundant examples cut** |

The detector calculation starts after minute 25; the numerical answer must appear within its first three to five minutes, before the terminology and extensions. This corrects the earlier sequence, which placed counting before Bayes and contradicted the recommendation for an earlier payoff. The 89-minute budget is near the proposed upper limit: if the spoken script needs more room, simplify examples and transitions rather than racing through concepts. Ninety seconds for pairwise versus mutual independence is a candidate budget, conditional on showing all three pairwise checks and the failed triple check clearly.

## Production recommendation

First revise the scope and mathematical language. Then write a short spoken outline connecting the opening, conditioning, and Bayes before building the two-minute sample. Retain the sample approval and human newcomer checks already specified in the plan.

The [LA02 listening review](LA02_VIDEO_LISTENING_REVIEW.md) records af_heart as a recommended default with unscored variants; it does not establish that PS00 will sound natural. Treat it as a candidate. After the sample, assess a continuous 10–15-minute passage before producing the longer first half. Log timestamps where emphasis is wrong, a pause is too short, a picture becomes unclear, or delivery becomes tiring.

Ask the newcomer to solve a fresh conditional-probability question and explain the denominator. Ask separately whether the voice sounds like someone explaining. A pleasant voice and a comprehensible lesson are separate judgments. Both remain unverified until people see and hear the material.
