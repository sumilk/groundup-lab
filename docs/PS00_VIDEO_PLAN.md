# PS00 video: plan for review (v2)

**Lesson:** `content/05-probability-statistics/00-probability-foundations.md`, *Probability foundations from finite events*.
**Status:** proposal, revised after the [plan review](PS00_VIDEO_PLAN_REVIEW.md); not started. **Format:** one concept-first video for the lesson, 60–90 min, covering every concept in the lesson. Exercises, the lab and the checkpoint stay in the chapter. **Voice:** Kokoro (af_heart, speed 0.95, V2 punctuation, one synthesis per paragraph, authored pauses only), treated as a candidate until it passes the listening gates in §4.

**Changes in v2:** the detector is paid off around minute 28 instead of 35+, with counting moved after Bayes; the three-door puzzle is treated properly, as weighted conditioning; the mathematical shortcuts are corrected (area versus mass, the definition of independence, disjoint events, simulation error, best of 20, the expectation title); there are no more "guess and get it wrong" openings or "most people say" claims; the Bayes picture is a frequency tree with bars; redundant examples are cut, while every concept stays; and a continuous 10–15-minute listening gate is added.

## 0. The acceptance criterion

> **Does this feel like someone guiding me through the mathematics?**
> **…and is it intuitive for someone new to the material?**

These are unchanged from LA02 ([voice plan](LA02_VIDEO_VOICE_PLAN.md) §0). Everything in §2 A, C and D of that plan applies as written: teaching units (question, prediction, worked example, explanation, what it changes) used as a checklist, not a template; one picture developed on screen; no title cards, fades, typed sentences or decorative motion; every pause authored with a purpose; and a **HIDDEN UNTIL AFTER ⏸** line before every prediction.

**Viewer.** Knows school arithmetic, fractions and basic set notation, as the lesson's diagnostic assumes. No linear algebra, no calculus.

**Pace.** The aim is the reasoning time of a good lecture, not topic density. When the spoken script runs long, simplify examples and transitions; never rush a concept or reduce it to a formula mentioned in passing.

## 0.1 The model: Stat 110, and a person talking

The reference for the feel is Joe Blitzstein's Harvard Stat 110: a person at a board, working problems small enough to check by hand, giving the viewer time to reason. We take its **teaching moves**, not its material or its phrases.

**Teaching moves, varied rather than repeated.** No single move opens every section; the script review flags any run of sections that share a shape.
- **Predict:** a question the viewer can answer from the picture. Some predictions turn out right, and the narration shows *why* they're right.
- **Enumerate together:** list the outcomes or cross out squares with the viewer, slowly enough to follow.
- **Ask which denominator:** "Out of what?" is the question behind conditioning, Bayes and every ML example.
- **Inspect a counterexample:** the copied bit, the three coins, disjoint events.
- **A plausible argument, then where it breaks:** instead of claiming what "most people" think, give a specific reasonable-sounding line of reasoning ("the detector is right 95% of the time, so…", "two doors left, so it's fifty-fifty") and find the step that fails.
- **Story before algebra:** n choose k is "pick the team, then forget the order"; inclusion–exclusion is "the overlap got counted twice"; linearity is "add up the chances one at a time". The formula goes on screen after the story, as a record of it.
- **Check-in:** before leaving each major idea, one small question with changed numbers or a changed event, so the viewer applies the idea once on their own (listed per section in §3).

**Conditioning is the main thread.** It returns in Bayes, the three doors, independence ("conditioning changes nothing") and every ML connection. **A random variable is a function**, said and drawn as one.

**Writing that sounds like a person.** The main test is whether each sentence answers the learner's likely next question and whether the picture supports it. A short strike-list helps, but it comes second, and ordinary connecting words are fine:
- vary the length and shape of sentences; claims short, reasoning longer;
- no stock openers or filler ("Let's dive in", "Here's the thing"), no paragraph-by-paragraph summaries, no hype;
- don't narrate the screen ("as you can see"); say what it means;
- no invented feelings, biography or claims about what viewers think;
- numbers as a teacher says them at a board: "three out of eighteen, which is a sixth".

**Not imitating a human.** No fake hesitations, random pauses, handwriting effects or decorative motion. The narration should sound like a person because the explanation is shaped like one.

## 1. The picture

| | |
|---|---|
| **Mass map** | The sample space drawn as a region in which **area is probability**, one unit in total. Events are regions; conditioning keeps a region and rescales it to one; expectation is a balance point. |
| **Fair dice** | The 6 × 6 grid of equal squares, with the assumption said aloud: the dice are fair and independent, so each of the 36 squares holds 1/36. |
| **Unequal weights** | Area must keep meaning probability. A loaded die is drawn with **columns of unequal width** (area preserved), with each weight labelled. Equal-sized squares never carry unequal masses. |
| **Two panels** | Only where two spaces really exist: the **random variable** (outcomes on the left, number line on the right, joined by X) and **model versus data** (model masses on the left, simulated frequencies on the right). |
| **Bayes** | A labelled **frequency tree** (10,000 → contaminated / clean → flagged / not flagged), then **two bars** holding the flagged groups, 190 and 392, with the population totals kept visible so the change of denominator can be traced. Colour plus labels; colour alone never carries a distinction. |

**Spoken notation.** "P of A given B"; fractions as "three out of eighteen" with the fraction on screen; "A and B", "A or B", "not A" once the symbols are introduced. Pronunciation is checked in the sample.

## 2. The through-line

**Hook.** A model is *contaminated* when its training data included the benchmark's test questions. In this example (the percentages are assumptions of the example, not facts about real benchmarks), 2% of submitted models are contaminated; a detector flags 95% of contaminated models and 4% of clean ones. A model is flagged. How likely is it to be contaminated? The viewer commits to a guess. The opening stays under two minutes.

**Intermediate payoff.** When conditioning appears, the narration connects it back: "For the detector, the group we compare against is the flagged models." Right after the two reversed dice questions, the video returns to the detector.

**Payoff, around minute 28.** Of 10,000 submissions, 190 contaminated and 392 clean ones are flagged. Of the 582 flagged, 190 are contaminated: **about 32.6%**. These are expected counts for an illustrative population, not a promise about any particular batch. The number arrives within the first 3–5 minutes of the Bayes section, before the terminology and the extensions.

**Recurring cast** (colours fixed once chosen):

| Character | Used in | Notes |
|---|---|---|
| Two coins, Ω = {HH, HT, TH, TT} | Outcomes, the tree, pairwise vs mutual independence, the random variable | |
| **Two dice, the 6 × 6 grid** | Events, mass, conditioning, counting, independence, expectation | Fair and independent, stated |
| Loaded die: P(6) = 1/4, each other face 3/20 | Mass with unequal weights; weighted conditioning | P(6 \| even) = 0.25 / 0.55 = 5/11, not the 1/3 you get by counting faces |
| Bag of 3 red and 2 blue balls | Multiplication and chain rules, with versus without replacement | |
| Contamination detector, 10,000 submissions | Hook, Bayes, ML connections | 200 contaminated (190 flagged), 9,800 clean (392 flagged) |
| Three doors | Weighted conditioning with a stated host policy | |
| 23 people's birthdays | Counting through the complement; the one indicator example | P(a shared birthday) ≈ 0.5073; expected shared pairs 253/365 ≈ 0.69 |

## 3. Sections

Titles are the YouTube chapters and the only names used for sections; nothing appears on screen for them. Minutes are provisional budgets to check against the spoken script, not targets to force it into.

| # | Section | The question | Picture and worked example | Prediction and check-in | ≈ min |
|---|---|---|---|---|---|
| 1 | **Ninety-five percent sure?** | A detector flags a model. How worried should we be? | The setting in one plain sentence, the three assumed percentages, nothing more. | Predict: "How likely is it that this model is contaminated?" (answered in section 5) | 2 |
| 2 | **What could happen** | What exactly are we assigning probabilities to? | Two coins as a list and as a tree; the dice grid. Outcome versus event. "And", "or" and "not" as overlap, union and the rest of the grid (De Morgan shown, not stated as a law). **The resolution is a choice:** ordered pairs versus sums. | Predict: "Is 'exactly one head' an outcome or an event?" Check-in: shade "first die even and sum at least ten". | 6 |
| 3 | **One unit of mass** | What rules must probabilities obey? | The axioms as rules for spreading one unit of mass; P(A) as the mass of its outcomes. The loaded die with unequal-width columns. Complement. The overlap counted twice: P(first is 6 or second is 6) = 11/36, not 12/36. The union bound, 12/36, as the honest upper limit when the overlap is unknown. | Predict: "Six thirty-sixths plus six thirty-sixths. What got counted twice?" Check-in: P(first even or second even) = 18 + 18 − 9 = 27 out of 36. | 7 |
| 4 | **Knowing something shrinks the world** | What does "given" do to a probability? | Keep "first die ≥ 4" (18 squares) and rescale: P(sum 9 \| first ≥ 4) = 3/18 = 1/6, up from 1/9. Reverse it: P(first ≥ 4 \| sum 9) = 3/4. Same overlap, different group to compare with. Requires P(B) > 0. **Weighted conditioning:** on the loaded die, P(6 \| even) = 5/11, because what's renormalised is the remaining mass, not the number of faces left. Multiplication rule and chain rule via the bag: 3/5 × 2/4 = 3/10, versus 9/25 with replacement. The detector line: "the denominator is the flagged group". | Predict: "Once we know the first die is at least four, does a sum of nine get more or less likely?" Check-in: a bag of 2 red and 3 blue, two draws without replacement: 2/5 × 1/4 = 1/10. | 10 |
| 5 | **Turning the question around** | How do we get from P(flag \| contaminated) to P(contaminated \| flag)? | Frequency tree, then the two flagged bars: **190 out of 582 ≈ 32.6%**, within the first few minutes. Then the names: total probability gives the 582; Bayes' rule, with each term named by its role (prior, likelihood, evidence, posterior). Odds form: prior odds 2 : 98 × likelihood ratio 0.95/0.04 = 23.75 gives the same answer. | Predict, before the arithmetic: "Among the flagged models, are most contaminated or most clean?" Check-in: at 20% prevalence, 1,900 out of 2,220 ≈ 86%. It rises a lot, but still not to 95%, and the likelihood ratio didn't change. | 10 |
| 6 | **Stick or switch?** | When the remaining possibilities aren't equally weighted, what does conditioning give? | Three doors. The rules, stated before anything else: the prize is placed uniformly; the player picks door 1; the host knows where the prize is, always opens an unchosen door with no prize, always offers a switch, and picks uniformly when both of the other doors are empty. Host opens door 3. Unnormalised weights: prize behind 1 → 1/3 × 1/2 = 1/6; prize behind 2 → 1/3 × 1 = 1/3; renormalise → **1/3 and 2/3**. The plausible argument "two doors left, so fifty-fifty" fails at exactly the step section 4 warned about: counting what's left instead of weighing it. Separately: always switching wins 2/3 of games overall, which is a different statement from this conditional one. | Predict: "Stick or switch, or doesn't it matter?" Check-in: what changes if the host opens a door at random and it just happens to be empty? (1/2 and 1/2, because the host's rule is part of the model.) | 4 |
| 7 | **Counting, when it's fair** | When is probability just counting? | Only when outcomes are equally likely. Sum of nine = 4/36. The eleven sums aren't equally likely: seven has six pairs, two has one. Ordered choices and permutations, then n choose k as "pick the team, then forget the order". Birthdays through the complement: 23 people, ≈ 0.507. A quick simulation confirms it. | Predict: "Which sum is most likely?" (the intuitive answer, seven, is right; show why). "Twenty-three people: better or worse than even odds of a shared birthday?" Check-in: P(sum is 10) = 3/36. | 8 |
| 8 | **When knowing tells you nothing** | When does one event carry no information about another? | Definition: P(A ∩ B) = P(A)P(B), equivalently the proportion doesn't change when you condition. Example: "first die even" and "second die ≤ 2", overlap 6/36 = 1/2 × 1/3; the rectangle is an *illustration* for these dice, not the test. Non-example: "first die is 6" and "sum ≥ 10", 1/6 becomes 1/2. **If both events have positive probability, disjoint means dependent.** Pairwise versus mutual: first coin heads, second coin heads, the coins agree. All three pairwise checks shown, then the triple fails: 1/4 ≠ 1/8. | Predict: "Two disjoint events, each possible. Independent?" "Every pair is independent. Are all three?" Check-in: is "first die is 3" independent of "sum is 7"? (1/6 · 1/6 = 1/36 = P(both): yes.) | 9 |
| 9 | **Outcomes become numbers** | What is a random variable, really? | **Two panels**, joined by X. X counts heads: HT and TH both land on 1, so their mass stacks there; the PMF is the mass carried across. The CDF as the running total, briefly (PS01 develops it). Two different functions with the same PMF: heads versus tails, which disagree on HH and TT. | Predict: "Which value collects the most mass?" Check-in: the PMF of Y = X². | 6 |
| 10 | **The average you'll never roll** | What is an expected value, and why is it easy to compute? | One die: the balance point is 3.5, a value no roll gives. Linearity: two dice average 3.5 + 3.5 = 7 (which *can* be rolled), and linearity needs no independence. Indicators: E[1_A] = P(A). **One worked indicator example:** expected shared-birthday pairs among 23 people = (23 choose 2)/365 = 253/365 ≈ 0.69, reusing the birthday picture, with no independence between the pairs needed. | Predict: "Where does the one-die histogram balance?" Check-in: expected number of sixes in ten rolls = 10/6. | 7 |
| 11 | **The model and the coin** | What does a simulation tell you, and what can't it tell you? | **Two panels:** model versus frequency. For independent fair-coin trials, the frequency fluctuates on a scale of √(p(1 − p)/n): 0.05 at n = 100. That's a typical size, not a guaranteed bound, and convergence isn't monotone. The copied bit: same 0.5 per position, but every run gives 0 or 1. A simulation can catch a bug in the code; it can't show the model matches the world. | Predict: "One bit copied a thousand times. How spread out are the frequencies?" | 5 |
| 12 | **Where this shows up in machine learning** | Where do these ideas decide real results? | All six chapter connections, each reusing an earlier picture: **precision versus sensitivity** (the detector tree: sensitivity 0.90, false-positive rate 0.05, base rate 0.01 → precision ≈ 0.15); **filtered benchmarks** (shrinking the world); **next-token probabilities** (the chain rule, not independence); **train/test leakage** (assumed independence that isn't there, like the copied bit); **conditional versus causal** (one sentence); **choosing the best of many** (the union bound, plus selection: if 20 prompts with true accuracy 0.70 are scored independently on 200 examples each, the best averages ≈ 0.76; if they make identical predictions, it's 0.70. The answer depends on the joint model, which is stated). Close on the hook. | Predict: "Twenty prompts, all truly 70% accurate, scored independently. Does the best one look better than 70%?" | 5 |
| | | | | | **≈ 79** |

**Coverage:**
- **Every concept in chapter §1–§10 is in.** Light: De Morgan (shown, not stated); the CDF (one picture).
- **Cut as redundant examples, not concepts:** expected fixed points of a shuffled deck (birthdays carry the one indicator example) and the hash-collision framing (the same calculation as birthday pairs).
- **Added beyond the chapter:** the three doors (approved); the loaded-die conditioning example (needed to show renormalising mass).
- **Stays in the chapter:** the lab, the practice problems, derivations to own, the cumulative set, the checkpoint, the mastery check, the infinite-mean example, and the train/test split design exercise.
- The ~10 minutes of headroom under 90 is for the spoken script to breathe, not for more topics.

## 4. Sequence and gates

| Step | Work | Gate |
|---|---|---|
| 1 | **Spoken outline** (about a page) connecting *Ninety-five percent sure?*, *Knowing something shrinks the world* and *Turning the question around*, written to be read aloud. | You read it aloud, or hear it read, and approve the line of the argument. |
| 2 | **Two-minute audiovisual sample** from *Knowing something shrinks the world*: cross out squares, 3 out of 18, reverse the question, 3 out of 4 (the reviewer's sample wording is the starting draft). Built in `scripts/videos/ps00/` from a copy of the LA02 pipeline; `scripts/videos/la02/` is not modified. | **Three separate judgements:** (a) you approve the visual style and the narration; (b) **blind listen:** someone not told how it was made says whether it sounds like a person explaining; (c) **newcomer:** after one viewing, they solve a *fresh* conditional question and explain which denominator they used and why. Voice and comprehension are judged separately. People only; if no one is available, the gate stays pending. |
| 3 | Full script: teaching units, authored pauses, HIDDEN lines, cast table and length check (layout of `LA02_VIDEO_SCRIPT.md`). | Maths review (every number in §3 recomputed), read-aloud gate, a check that section shapes vary, and the strike-list. **You review before any scene work.** |
| 4 | **Continuous 10–15-minute passage**: sections 1–3 rendered and heard in one sitting. | Problems logged by timestamp: wrong emphasis, a pause too short, an unclear picture, delivery getting tiring. This is where Kokoro is confirmed or replaced, before the longer first half. |
| 5 | Sections 4–6 (through *Stick or switch?*), then watched continuously from the start. | Fatigue and comprehension gate, by you and a newcomer. Spots where they got lost are rewritten before the rest is rendered. |
| 6 | Remaining sections, build, captions, chapters, thumbnail, description. | One complete continuous viewing before publishing, with problems logged by timestamp. |

## 5. Risks

- **The mass map becomes a slide of shaded squares.** It has to move: squares are crossed out and the rest rescaled in front of the viewer, and the rescaling *is* the explanation. The sample tests this.
- **Variety becomes a template of its own.** The review in step 3 checks that sections don't all share one shape.
- **Fractions by ear.** "Three out of eighteen" with the fraction on screen; checked in the sample.
- **Bayes is where viewers drop off.** It gets a readable tree and bars, the number early, and the names only after the number has been understood.
- **Kokoro's ceiling.** Confirmed or rejected at step 4, before most of the production.

## 6. Decisions and open questions

**Decided (2026-11-03):** the hook is the contamination detector; Kokoro stays for now; the three doors are in, as weighted conditioning with the host's rule stated; every lesson concept stays in the one video, with redundant examples cut; the plan review's corrections are adopted (see v2 changes above).

**Still open:**
1. Did watching the whole of LA02 continuously turn up anything about af_heart at 0.95?
2. Who is the newcomer reviewer? Anyone with school maths will do.

**Chapter fixes found by the review (separate from the video):** §6 says "nonempty" disjoint events can't be independent, where "positive probability" is needed; and the best-of-20 practice problem in §10 doesn't say the prompt scores are independent.
