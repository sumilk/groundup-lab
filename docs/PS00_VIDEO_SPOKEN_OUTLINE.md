# PS00 video: spoken outline, from the flag to the answer

Step 1 of the [plan](PS00_VIDEO_PLAN.md) §4. This is the line of argument through *Ninety-five percent sure?*, *Knowing something shrinks the world* and *Turning the question around*, written to be **read aloud**: about seven minutes at a teaching pace. It isn't the final script. The main line is written out in full; the other parts of each section are listed as beats in brackets.

**How to judge it:** read it aloud, or have it read to you, in one go. Does each sentence answer the question the last one raised? Is there a place where you'd stop following, or where it sounds like reading rather than explaining?

Notation: **⏸ n: purpose** is an authored pause. **[screen: …]** says what is shown at that moment. **HIDDEN UNTIL AFTER ⏸** lists what must not be on screen before that pause ends.

---

## Ninety-five percent sure?

[screen: a single benchmark card, then three numbers appearing as they're named: 2%, 95%, 4%]

A model is contaminated when the questions from a benchmark leaked into its training data. Its score on that benchmark then measures memory, not ability.

Take these numbers as the assumptions for this example. Two percent of the models submitted to a benchmark are contaminated. A detector flags a contaminated model ninety-five times out of a hundred. It also flags a clean model, by mistake, four times out of a hundred.

A model gets flagged. How likely is it that it's really contaminated?

HIDDEN UNTIL AFTER ⏸: any count, tree or answer.
⏸ 4: commit to a guess

Hold on to that number. To check it properly we need to be precise about what "given that it was flagged" does to a probability, and two dice are the clearest place to see it.

---

## Knowing something shrinks the world

[screen: the 6 × 6 grid; first die across, second die down]

Roll two fair dice. Every square here is one way the roll can come out. The dice are fair and don't affect each other, so every square carries the same share: one out of thirty-six.

[screen: the four squares with sum nine light up]

A sum of nine happens in four squares. Four out of thirty-six, which is one in nine.

Now someone glances at the first die and tells you one thing. It's at least four. Does a sum of nine become more likely, or less?

HIDDEN UNTIL AFTER ⏸: crossed-out squares, 3/18.
⏸ 3: predict

Which squares can we cross out?

⏸ 2: find them

[screen: the columns for first die 1, 2, 3 are crossed out; the remaining 18 squares grow to fill the grid]

Every square where the first die shows one, two or three. Eighteen are left, and they're the whole world now. Each one counts for one out of eighteen. Three of them still give a sum of nine. Three out of eighteen. One in six.

So it went up, from one in nine to one in six. The small first rolls are gone, and those were the ones that had the hardest time reaching nine.

[screen: the full grid returns]

Now turn the information around. This time you're told the sum is nine. Which squares are left?

⏸ 2: find them

[screen: only the four sum-nine squares remain]

Four. And in three of those four, the first die is at least four. Three out of four.

[screen: the two answers side by side, 3/18 and 3/4, with the same three squares highlighted in both]

It's the same three squares both times. What changed is what we compared them with: eighteen squares the first time, four the second. That's all "given" does. The probability of A given B is the share of B that is also A.

[screen: P(A | B) = P(A and B) / P(B), appearing as the words are said]

And it only makes sense when B has some probability to begin with, because we divide by it.

This is exactly what's buried in the detector question. Ninety-five percent is the share of *contaminated* models that get flagged. The question asked for the share of *flagged* models that are contaminated. Same overlap, different group to compare it with.

[Beats, not written out here:
- **Weighted conditioning.** A loaded die, drawn with unequal widths, where six carries a quarter of the mass and each other face three-twentieths. Given that the roll is even, counting faces says one in three; adding up the remaining mass and rescaling it says five out of eleven. Rescale the mass, don't count what's left.
- **Multiplication rule.** Rearranging the definition gives the probability of A and B as P(B) times P(A given B). The bag: three red and two blue, two draws without replacement, three-fifths times two-quarters is three-tenths. With replacement, nine twenty-fifths. These are different experiments, not competing rules. The chain rule extends it to longer sequences.
- **Check-in:** two red and three blue; the chance both draws are red is two-fifths times one-quarter, one in ten.]

---

## Turning the question around

[screen: one box labelled 10,000 submissions]

Back to the detector. Picture ten thousand submissions.

[screen: the box splits into 200 contaminated and 9,800 clean, labelled, with the totals kept visible]

Two percent are contaminated. That's two hundred. The other nine thousand eight hundred are clean.

[screen: each branch splits again into flagged / not flagged]

The detector catches ninety-five percent of the two hundred. One hundred and ninety. It also flags four percent of the nine thousand eight hundred. Three hundred and ninety-two.

Before adding anything up: among the flagged models, are most of them contaminated, or most of them clean?

HIDDEN UNTIL AFTER ⏸: the flagged bars, 582, 190/582.
⏸ 3: predict

[screen: the two flagged groups lift out of the tree into two labelled bars, 190 and 392]

Most are clean. Three hundred and ninety-two clean models against one hundred and ninety contaminated ones. That's five hundred and eighty-two flags in all, and one hundred and ninety of them are contaminated.

[screen: 190 / 582 ≈ 32.6%]

About thirty-three percent.

If your guess was closer to ninety-five, it helps to see which step took you there. The reasoning goes: the detector is right ninety-five percent of the time, so a flag is right ninety-five percent of the time. The first half is about contaminated models. The second half is about flagged models. Somewhere in the middle the group changed, and the flagged group is mostly clean models, because there were so many more clean models to start with. Four percent of nine thousand eight hundred is more than ninety-five percent of two hundred.

[Beats, not written out here:
- **The names, after the number.** Two percent is the prior: what we believed before the flag. Ninety-five percent is the likelihood: how probable the flag is if the model is contaminated. The five hundred and eighty-two out of ten thousand is the evidence: the total chance of a flag, added up over both kinds of model. That adding up is total probability. One hundred and ninety out of five hundred and eighty-two is the posterior. Bayes' rule goes on screen as a record of the tree just walked through.
- **Odds.** Prior odds of two to ninety-eight, multiplied by the likelihood ratio, ninety-five over four, which is twenty-three point seven five. The same answer.
- **Check-in.** Suppose a fifth of submissions were contaminated. Does the answer pass ninety-five percent? Two thousand contaminated, one thousand nine hundred flagged; eight thousand clean, three hundred and twenty flagged. One thousand nine hundred out of two thousand two hundred and twenty, about eighty-six percent. It rose a long way and the detector didn't change. Only the base rate did.]

The detector question had a hidden ingredient: how common contamination was to begin with. The next puzzle has a hidden ingredient too, and it's the rule someone else follows when they show you information.

[→ *Stick or switch?*]

---

## Notes for the read-aloud

- **Where the outline deliberately varies its moves:** the hook asks for a guess; the dice section has the viewer find squares (enumerating, not guessing); the reversal is a "which group?" question; the Bayes section predicts a comparison (more clean or more contaminated?) before any arithmetic; the wrong guess is examined as a plausible argument, not a mistake "everyone" makes.
- **A prediction that can come out right:** many viewers will say "more likely" for the dice prediction, and they're right. The narration explains why rather than staging a surprise.
- **Spoken numbers to listen for:** "three out of eighteen", "nine thousand eight hundred", "five hundred and eighty-two". If any is hard to follow by ear, the screen should carry it and the sentence should be shortened.
- **Delivery note for the script stage:** Kokoro doesn't pause at colons, so the final narration uses full stops where a breath is wanted (as in LA02).
