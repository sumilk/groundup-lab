# PS00 video: script and storyboard

**Probability foundations from finite events: one flagged model, and what "given" really means.**

| | |
|---|---|
| Format | One video for the lesson, about 43–46 min projected (see "Length check"); 12 sections, which become the YouTube chapters |
| Voice | Kokoro af_heart, speed 0.95, V2 punctuation: one synthesis per paragraph, authored pauses only |
| Standard | [Plan](PS00_VIDEO_PLAN.md) §0 and §0.1. Two questions judge every unit: *does this feel like someone guiding me through the mathematics?* and *is it intuitive for someone new to the material?* |
| Viewer | School arithmetic, fractions, basic set notation. Nothing else |
| Source | `content/05-probability-statistics/00-probability-foundations.md` §1–§10 |

## Reading this script

- **VISUAL** is what is on screen. Narration paragraphs are the `>` blocks, already in spoken form. Each sentence is one beat; a new `>` block is a new paragraph (a new Kokoro call). Kokoro doesn't pause at colons, so narration never uses them.
- **⏸ n: purpose** is an authored silence of n seconds after the sentence before it.
- **HIDDEN UNTIL AFTER ⏸** lists what must not be on screen until that pause has ended.
- **TERM ▸ x** marks the moment a term is named; only then may it appear on screen, as a label on the thing it names.
- **SCREEN:** gives the precise maths shown, in standard notation, built in step with the narration.
- No title cards, no section headers on screen, no typed sentences, no decorative motion. A change of picture is a teaching event.

## Cast

Colours never change meaning.

| Character | Colour / form |
|---|---|
| Event A (the event asked about) | blue `#58C4DD` fill, 45% opacity |
| Event B (the information / condition) | gold `#F4C152` fill, 45% opacity |
| Both (A and B) | green `#83C167` |
| Crossed out / discarded | squares dim to `#2A3140`, with a thin grey diagonal stroke |
| Dice grid | 6 × 6 squares, first die across (1–6 left to right), second die down (1–6 top to bottom), small grey axis numbers |
| Coin outcomes | white letters H/T in rounded tiles |
| Loaded die | six columns of unequal width (faces 1–5 width 3, face 6 width 5, in twentieths), labelled with weights |
| Bag | red `#E57373` and blue `#58C4DD` balls in a simple outline bag |
| Contaminated | orange `#FF8A65`; **clean**: teal `#4DD0B0`; **flagged**: a white flag icon / label "flagged" |
| Doors | three tall rounded rectangles, numbered 1–3; prize: gold star |
| Probability mass (bars, PMF) | purple `#B39DDB` |
| Random variable X | white curved arrows from outcomes (left panel) to the number line (right panel) |

---

## 1. Ninety-five percent sure?

VISUAL: empty screen. A single card shape labelled "benchmark" appears centre-left; beside it a small model icon (a rounded square labelled "model").

> A model is contaminated when the questions from a benchmark leaked into its training data. Its score on that benchmark then says more about what it memorised than about what it can do.

VISUAL: three numbers appear as named, each with a short label: **2%** "contaminated", **95%** "of contaminated models are flagged", **4%** "of clean models are flagged".

> Take these numbers as assumptions for this example. Two percent of the models submitted to a benchmark are contaminated. A detector flags a contaminated model ninety-five times out of a hundred. It also flags a clean model, by mistake, four times out of a hundred.

VISUAL: the model icon gets a white "flagged" tag. A large "?" next to it.

> One model gets flagged. How likely is it that it's really contaminated?

HIDDEN UNTIL AFTER ⏸: any count, tree, or answer.
⏸ 4: commit to a guess

> Hold on to your number. Answering properly takes one precise idea, what the words "given that it was flagged" do to a probability. To build it we'll start smaller, with coins and dice, and come back to the detector as soon as the idea is ready.

VISUAL: the three numbers shrink and slide to the top-right corner as a small reminder, then fade at the end of the section.

---

## 2. What could happen

VISUAL: a two-level tree grows from the left: root → H / T → H / T, ending in four leaves labelled HH, HT, TH, TT.

> Flip a coin twice. Before asking how likely anything is, write down everything that can happen.
> The first flip is heads or tails. For each of those, the second flip is heads or tails. That gives four ends. Heads heads, heads tails, tails heads, and tails tails.

VISUAL: the four leaves lift into a row of four tiles inside a rounded outline. TERM ▸ **outcome** labels one tile; TERM ▸ **sample space Ω** labels the outline.
SCREEN: Ω = {HH, HT, TH, TT}

> Each of these four is an outcome, one complete result of the experiment, recorded at the level of detail we chose. The set of all of them is called the sample space. It's usually written with the Greek letter omega.

> Now a question of a different kind. Exactly one head. Is that a fifth outcome, or something else?

HIDDEN UNTIL AFTER ⏸: the highlight of HT and TH.
⏸ 3: predict

VISUAL: HT and TH turn blue; a blue loop encloses them. TERM ▸ **event** labels the loop.
SCREEN: A = {HT, TH}

> It isn't a new outcome. It's a description that two of the outcomes fit, heads tails and tails heads. A set of outcomes like this is called an event. The event happens when the outcome that actually occurs is one of its members.

VISUAL: a gold loop encloses HH and HT. SCREEN: B = {HH, HT}.

> The first flip is heads is another event. It holds heads heads and heads tails.
> Every yes-or-no question you can ask about the two flips picks out some set of the four outcomes. That's why the list matters. Probabilities will be attached to these sets.

VISUAL: the coin picture slides left and fades; the 6 × 6 dice grid builds in its place, columns first. Axis numbers 1–6 across ("first die") and down ("second die").

> Two dice give more outcomes, so lay them out as a grid. The first die runs across, and the second runs down. Thirty-six squares, and each square is one outcome, a pair like four then five.

VISUAL: square (4, 5) pulses once (Indicate) as it's named.

VISUAL: columns 2, 4, 6 fill blue; label "first die even".

> Events are now regions of the grid. The first die is even is three whole columns.

VISUAL: the six squares with sum ≥ 10 fill gold (bottom-right triangle): (4,6), (5,5), (5,6), (6,4), (6,5), (6,6). Label "sum at least 10".

> The sum is at least ten is a small triangle in the corner, six squares.

VISUAL: the four squares in both turn green; label "A and B", SCREEN: A ∩ B.

> Where both happen, the first die is even and the sum is at least ten, is where the two regions overlap. Four squares.

VISUAL: all squares in either region get a white outline; label "A or B", SCREEN: A ∪ B. Then everything outside the blue columns gets a faint grey wash; label "not A", SCREEN: Aᶜ.

> Where at least one happens is everything shaded at least once. And "the first die is not even" is everything outside the blue columns.

VISUAL: the union outline stays; everything outside it gets a grey wash. Then the wash is redrawn as the overlap of two separate washes, "first die not even" (columns 1, 3, 5) and "sum below 10", and the two shadings coincide exactly.
SCREEN: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ

> Two of these fit together in a way worth checking. Look at the squares outside the union, where neither event happens. Now take the squares where the first die is not even, and keep only those where the sum is also below ten. It's the same set of squares. Neither A nor B happens exactly when A doesn't happen and B doesn't happen.

VISUAL: the wash clears; the four green overlap squares are outlined; everything outside them washes grey, then splits into "not A" and "not B" pieces whose union is the same wash.
SCREEN: (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ. TERM ▸ **De Morgan's laws** labels both lines.

> It works the other way round too. Outside the overlap, where it isn't true that both happen, is exactly where at least one of them fails. "Not both" is the same event as "not A, or not B". These two facts are called De Morgan's laws.

⏸ 1.5: read the two finished identities

VISUAL: the washes clear. The blue squares outside the gold triangle stay blue; the four green squares dim. SCREEN: A ∖ B, 18 − 4 = 14 squares. Then the gold triangle returns with (6, 6) outlined white inside it. SCREEN: {(6, 6)} ⊆ B. TERM ▸ **subset**.

> Two more relations come up all the time. The part of A that isn't in B, where the first die is even but the sum is below ten, is written A minus B. Here it's fourteen squares.
> And when every outcome of one event also belongs to another, the first is called a subset of the second. A sum of twelve is one square, six and six, and it sits inside the region where the sum is at least ten. Whenever the first event happens, the second must.

> Try one yourself. Where on the grid is the event that both dice show the same number?

HIDDEN UNTIL AFTER ⏸: the diagonal highlight.
⏸ 3: find it

VISUAL: blue/gold clear; the diagonal (1,1)…(6,6) lights up.

> Along the diagonal. Six squares, one and one up to six and six.

VISUAL: the grid's 36 squares stay; on the right, a second, narrow column of 11 boxes labelled 2 to 12 appears, titled "sums only". Arrows from the six squares of the sum-7 diagonal all converge on box "7".

> There's a choice hidden in this grid. We kept track of which die is which, so four then five is a different square from five then four. We could have recorded only the sum, with eleven possible outcomes from two to twelve. That's a legitimate sample space too, but a coarser one.

VISUAL: column 6 of the grid flashes gold; in the sums column nothing can light up for it; the "7" box shows both (6,1) and (1,6) feeding into it.

> In the sums-only model, "the first die shows six" isn't even an event, because a sum of seven could have come from six and one, or from one and six. Choosing the outcomes is the first decision in any probability model. Plenty of wrong answers begin by changing that choice without noticing.

---

## 3. One unit of mass

VISUAL: the dice grid alone, empty. A purple "mass" fill pours in and spreads evenly so every square holds the same faint purple. A label "total mass = 1".

> Now attach numbers. Think of probability as one unit of mass, a fixed amount of sand spread over the outcomes. Each outcome gets some share, and nothing is left over.
> Each die is fair, and the two rolls are independent, which here means that knowing one result leaves the other's chances unchanged. Under those two assumptions the sand spreads evenly. Each square gets one thirty-sixth. That evenness comes from the assumptions. It isn't a rule of probability.

VISUAL: columns 2, 4, 6 fill blue. SCREEN: P(first die even) = 18/36 = 1/2.

> The probability of an event is the mass sitting in its region. The first die is even holds eighteen squares, so eighteen out of thirty-six. One half.

VISUAL: three short rules appear one at a time at the right, in words with notation beneath each. TERM ▸ **axioms** titles them after the third.
SCREEN:
1. P(A) ≥ 0
2. P(Ω) = 1
3. A, B don't overlap ⇒ P(A ∪ B) = P(A) + P(B)

> Every probability model, for dice or for anything else, follows three rules. No region holds negative mass. The whole sample space holds all of it, exactly one. And if two regions don't overlap, the mass in both together is the sum of their masses. Those three rules are called the axioms of probability. Everything else in this video is built on them.

VISUAL: the grid slides left and shrinks; a single loaded die appears as six adjacent columns, faces 1–5 of width 3 and face 6 of width 5, total width 20. Labels under each: 3/20 … 3/20, 1/4.

> Here's why the evenness was an assumption. Take a single die that's been loaded. Six comes up a quarter of the time, and each of the other faces comes up three twentieths of the time.
> Check the total. Five faces at three twentieths make fifteen twentieths. A quarter is five twentieths more. Together, exactly one.

VISUAL: brief pulse of the wide six column only as "wider column" is said.

> In the picture, the six gets a wider column, so that area still means probability. The outcomes are the same six faces as an ordinary die. Only the masses moved. So never assume outcomes are equally likely unless the model says they are.

VISUAL: the five non-six columns fill grey-blue; the six column stays. SCREEN: P(not 6) = 1 − 1/4 = 3/4. TERM ▸ **complement** labels the grey-blue region.

> One consequence of the axioms comes almost for free. An event and its opposite don't overlap, and together they cover everything. So their masses add to one. The chance of not rolling a six on this die is one minus a quarter. Three quarters. The opposite event is called the complement.

VISUAL: loaded die fades; the dice grid returns with the gold sum ≥ 10 triangle and the single square (6, 6) outlined white inside it. The triangle splits into (6, 6) and the five other squares, which are labelled "B ∖ A". SCREEN: P(B) = P(A) + P(B ∖ A) ≥ P(A); A ⊆ B ⇒ P(A) ≤ P(B).

> Another consequence follows from the third rule. Suppose A is a subset of B. Then B is made of two pieces that don't overlap, A itself and the part of B outside A. So the mass of B is the mass of A, plus a mass that can't be negative. A subset can never be more likely than the event that contains it. A sum of twelve has one thirty-sixth, and the sum being at least ten has six thirty-sixths.

VISUAL: the triangle clears; the grid stays.

> Now a place where adding goes wrong. What's the chance that at least one of the two dice shows a six?

VISUAL: column 6 fills blue ("first die is 6"), row 6 fills gold ("second die is 6"). SCREEN: 6/36 + 6/36 = 12/36 ?

> The first die is six in one column, six squares. The second die is six in one row, another six squares. Six thirty-sixths plus six thirty-sixths makes twelve thirty-sixths.
> Before trusting that, look at the picture. Did any square get counted twice?

HIDDEN UNTIL AFTER ⏸: the green (6,6) square; the corrected 11/36.
⏸ 3: inspect the picture

VISUAL: square (6, 6) turns green and briefly shows "×2". SCREEN updates: 6/36 + 6/36 − 1/36 = 11/36.

> One square. Six and six sits in the column and in the row, so it was counted twice. Take it out once, and the answer is eleven thirty-sixths.
> In general, the probability of A or B is the probability of A, plus the probability of B, minus the probability of both. The subtraction removes the extra copy of the overlap.

SCREEN: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). TERM ▸ **inclusion–exclusion**.

> That rule is called inclusion exclusion.

⏸ 1.5: read the finished formula

VISUAL: the "− 1/36" fades to grey. SCREEN: P(A ∪ B) ≤ P(A) + P(B). TERM ▸ **union bound**.

> Sometimes you don't know the overlap. Then you can drop the subtraction and still say something true. A or B can't be more likely than A plus B. Twelve thirty-sixths is too big here, but it can never be too small. That inequality is called the union bound.
> It looks loose, but it matters a great deal in machine learning. It bounds the chance that any one of many things goes wrong, without knowing how they're related. It comes back at the end.

VISUAL: the grid clears. Columns 2, 4, 6 blue; rows 2, 4, 6 gold.

> Try one. The first die is even, or the second die is even. Each region holds eighteen squares. How many squares are in both?

HIDDEN UNTIL AFTER ⏸: the green overlap and 27/36.
⏸ 4: count the overlap and finish the sum

VISUAL: the nine overlap squares turn green. SCREEN: 18/36 + 18/36 − 9/36 = 27/36 = 3/4.

> Nine. Both even means three choices across and three choices down. Eighteen plus eighteen, minus nine, is twenty-seven. Twenty-seven out of thirty-six, which is three quarters.

---

## 4. Knowing something shrinks the world

**This section is the reference scene.** Its pacing, layout and the cross-out-and-rescale motion set the style for the others.

VISUAL: the 6 × 6 grid, clean.

> Roll two fair dice again. Every square carries the same share, one out of thirty-six.

VISUAL: the four sum-9 squares (3,6), (4,5), (5,4), (6,3) fill blue. SCREEN: P(sum 9) = 4/36 = 1/9.

> A sum of nine happens in four squares. Four out of thirty-six, which is one in nine.

VISUAL: a gold outline marks columns 4–6 ("first die ≥ 4").

> Now someone glances at the first die and tells you one thing. It's at least four. Does a sum of nine become more likely, or less?

HIDDEN UNTIL AFTER ⏸: crossed-out squares; 3/18.
⏸ 3: predict

> Which squares can we cross out?

⏸ 2: find them

VISUAL: columns 1–3 dim and get a diagonal stroke. Then the remaining 18 squares slide together and grow to fill the grid's footprint, and their purple mass deepens (each now 1/18). SCREEN: 3 blue squares remain highlighted; 3/18 = 1/6.

> Every square where the first die shows one, two or three. Eighteen are left, and they're the whole world now. Each one counts for one out of eighteen.
> Three of them still give a sum of nine. Three out of eighteen, which is one in six.
> So it went up, from one in nine to one in six. The small first rolls are gone, and those were the rolls that had the hardest time reaching nine.

VISUAL: the full grid returns (the 18 shrink back, columns 1–3 un-dim).

> Now turn the information around. This time you're told the sum is nine. Which squares are left?

⏸ 2: find them

VISUAL: everything except the four sum-9 squares dims and crosses out; the four grow. The three with first die ≥ 4 turn green. SCREEN: 3/4.

> Four. And in three of those four, the first die is at least four. Three out of four.

VISUAL: two small copies of the grid side by side, left: "given first ≥ 4" (18 kept, 3 green); right: "given sum 9" (4 kept, 3 green). The same three green squares in both.
SCREEN: left P(sum 9 | first ≥ 4) = 3/18; right P(first ≥ 4 | sum 9) = 3/4.

> It's the same three squares both times. What changed is what we compared them with. Eighteen squares the first time, four the second.

TERM ▸ **conditional probability**. SCREEN: P(A | B) = P(A ∩ B) / P(B), the bar read "given".

> That's all the word "given" does. The probability of A given B is the share of B that is also A. It's called a conditional probability. In symbols, the probability of A and B, divided by the probability of B.
> It only makes sense when B has some probability to begin with, because we divide by it.

⏸ 1.5: read the finished definition

VISUAL: the two mini-grids shrink to the left; the detector reminder (2%, 95%, 4%) reappears at the right, with "95%" boxed and its label "flagged, given contaminated", and below it "contaminated, given flagged = ?".

> This is exactly what's buried in the detector question. Ninety-five percent is the share of contaminated models that get flagged. The question asked for the share of flagged models that are contaminated. Same overlap, a different group to compare it with. For the detector, the group we need is the flagged models.

VISUAL: everything clears except a single loaded die (the unequal-width columns from *One unit of mass*), weights labelled.

> Counting squares worked because every square held the same mass. Go back to the loaded die, where six carries a quarter. You're told the roll was even. What's the chance it was a six?

HIDDEN UNTIL AFTER ⏸: the crossed-out odd faces; 5/11.
⏸ 5: predict, or work it out

VISUAL: faces 1, 3, 5 cross out. Faces 2, 4, 6 remain, widths 3, 3, 5. They slide together and stretch to fill the width. SCREEN: counting faces gives 1/3 (struck through); mass gives (5/20) / (11/20) = 5/11.

> Counting faces says one in three, since two, four and six are left. But those faces don't carry equal mass. Two and four hold three twentieths each, and six holds five twentieths. The even faces hold eleven twentieths in all, and the six is five of those. Five out of eleven.
> When you rescale, you rescale the mass that's left, not the number of outcomes left.

VISUAL: loaded die clears. SCREEN: P(A ∩ B) = P(B) · P(A | B). TERM ▸ **multiplication rule**.

> Multiply both sides of the definition by the probability of B, and the rule turns around. The probability of A and B is the probability of B, times the probability of A given B. To find the chance two things both happen, take the chance of the first, then the chance of the second once the first has happened. That's the multiplication rule.

VISUAL: a bag with 3 red and 2 blue balls. A tree grows to its right: first draw R (3/5) / B (2/5); from R, second draw R (2/4) / B (2/4). One red ball leaves the bag as the first branch is drawn.

> A bag holds three red balls and two blue. Draw one, keep it out, and draw another. What's the chance both are red?
> The first is red with probability three fifths. Now the bag has changed. Two red and two blue are left, so the second is red with probability two quarters. Three fifths times two quarters is three tenths.

SCREEN: P(R₁ ∩ R₂) = 3/5 · 2/4 = 3/10.

VISUAL: the red ball returns to the bag; the second branch relabels to 3/5. SCREEN: with replacement 3/5 · 3/5 = 9/25.

> Put the first ball back instead, and the second draw is three fifths again, giving nine twenty-fifths. That isn't a competing rule. It's a different experiment, and the bag shows exactly where they differ.

SCREEN: P(A₁ ∩ A₂ ∩ A₃) = P(A₁) · P(A₂ | A₁) · P(A₃ | A₁ ∩ A₂). TERM ▸ **chain rule**.

> The same step repeats for longer sequences. The chance of three things in a row is the first, times the second given the first, times the third given the first two. That's the chain rule, and it holds whenever those conditional probabilities are defined. Replacing each factor by a plain, unconditioned probability is a separate and much stronger claim, which we'll get to.

VISUAL: the bag refills as 2 red, 3 blue.

> Your turn. Two red and three blue, two draws without putting anything back. What's the chance both are red?

HIDDEN UNTIL AFTER ⏸: the tree numbers and 1/10.
⏸ 6: work it out

VISUAL: tree grows: 2/5, then 1/4. SCREEN: 2/5 · 1/4 = 1/10.

> Two fifths for the first. Then one red among four balls, a quarter. Together, one in ten.

---

## 5. Turning the question around

VISUAL: a single box labelled "10,000 submissions".

> Back to the detector. Picture ten thousand submissions.

VISUAL: the box splits into two boxes beneath, orange "contaminated 200" (narrow) and teal "clean 9,800" (wide), with the totals still visible above.

> Two percent are contaminated. That's two hundred. The other nine thousand eight hundred are clean.

VISUAL: each splits again: 200 → "flagged 190" / "not flagged 10"; 9,800 → "flagged 392" / "not flagged 9,408". Branch labels 95%, 5%, 4%, 96%.

> The detector catches ninety-five percent of the two hundred, which is one hundred and ninety. It also flags four percent of the nine thousand eight hundred, which is three hundred and ninety-two.

> Before adding anything up. Among the flagged models, are most of them contaminated, or most of them clean?

HIDDEN UNTIL AFTER ⏸: the two flagged bars; 582; 190/582.
⏸ 3: predict

VISUAL: the two "flagged" leaves lift out of the tree into two horizontal bars side by side, orange 190 and teal 392, drawn to scale and labelled with numbers and words ("contaminated", "clean"). A bracket spans both: "582 flagged".

> Most are clean. Three hundred and ninety-two clean models against one hundred and ninety contaminated ones. That makes five hundred and eighty-two flags in all, and one hundred and ninety of them are contaminated.

SCREEN: 190 / 582 ≈ 0.326

> About thirty-three percent.

VISUAL: two short lines appear one under the other: "95 of every 100 **contaminated** models → flagged" and "95 of every 100 **flagged** models → contaminated?". The two group words are boxed in different colours (orange, white flag), and the second line gets a grey "?".

> If your guess was closer to ninety-five, it helps to find the step that took you there. Ninety-five out of a hundred contaminated models get flagged. It's tempting to turn that into ninety-five out of a hundred flags meaning contamination.
> But those two hundreds come from different groups. The first is a hundred contaminated models. The second is a hundred flagged models, and the flagged group is mostly clean, because there were so many more clean models to begin with. Four percent of nine thousand eight hundred is more than ninety-five percent of two hundred.

⏸ 1.5: let the comparison land

VISUAL: the tree returns; labels attach to its parts as named.

> Each of these numbers has a name, and the names make the general rule easy to read.
> Two percent, the chance of contamination before any test, is called the prior.

TERM ▸ **prior** on the 2% branch.

> Ninety-five percent, the chance of a flag if the model is contaminated, is the likelihood.

TERM ▸ **likelihood** on the 95% branch.

> Five hundred and eighty-two out of ten thousand, the overall chance of a flag, is called the evidence. We got it by adding the flags from both kinds of model, each weighted by how common that kind is.

VISUAL: the two middle boxes (200, 9,800) get a bracket "every submission, exactly once". TERM ▸ **partition**.

> That adding up only works because the two branches split the submissions cleanly. Every model is contaminated or clean, never both and never neither, so every flag is counted exactly once. Cases that don't overlap and together cover everything are called a partition. Splitting over a partition and adding up like that is the law of total probability.

TERM ▸ **evidence**, **total probability**. SCREEN: P(F) = P(F | C) P(C) + P(F | not C) P(not C) = 0.95 · 0.02 + 0.04 · 0.98 = 0.0582.

> And one hundred and ninety out of five hundred and eighty-two, the chance of contamination once you've seen the flag, is the posterior.

TERM ▸ **posterior**. SCREEN: P(C | F) = P(F | C) P(C) / P(F). TERM ▸ **Bayes' rule**.

> Written as a formula, the tree we just walked through is Bayes' rule. The posterior is the likelihood times the prior, divided by the evidence.

⏸ 2: read the finished formula against the tree

> Every symbol in it is a branch of the tree. If the formula ever feels slippery, draw the ten thousand.

VISUAL: tree shrinks left. SCREEN builds:
prior odds 2 : 98 → × (0.95 / 0.04 = 23.75) → 47.5 : 98 → 47.5 / 145.5 ≈ 0.326. TERM ▸ **likelihood ratio** on 23.75.

> There's a shorter way to carry the same calculation. Before the flag, the odds were two contaminated for every ninety-eight clean. A contaminated model is ninety-five over four times as likely to be flagged as a clean model. That ratio, twenty-three point seven five, is called the likelihood ratio.
> Multiply the odds by it. Two times twenty-three point seven five is forty-seven and a half, against ninety-eight. To turn odds back into a probability, divide the first number by the total. Forty-seven and a half out of one hundred and forty-five and a half is the same thirty-three percent.

⏸ 2: check the conversion on screen
> The odds form keeps the two ingredients apart. The detector supplies the ratio. The population supplies the starting odds.

VISUAL: the tree returns at full size, with the 2% box ready to change.

> Suppose instead that a fifth of all submissions were contaminated. Same detector. Would a flag now mean ninety-five percent?

HIDDEN UNTIL AFTER ⏸: the new tree numbers; 1,900/2,220.
⏸ 6: predict, or redo the tree

VISUAL: the tree's numbers morph: 2,000 / 8,000; flagged 1,900 / 320; bars resize. SCREEN: 1,900 / 2,220 ≈ 0.86.

> Two thousand contaminated, and one thousand nine hundred of them flagged. Eight thousand clean, and three hundred and twenty flagged. One thousand nine hundred out of two thousand two hundred and twenty, which is about eighty-six percent.
> Much higher than before, though still short of ninety-five. The detector didn't change at all. Only the base rate did. That's why a test's rates on known cases, on their own, can't tell you what a positive result means.

---

## 6. Stick or switch?

VISUAL: the tree clears. Three tall doors, numbered 1, 2, 3.

> The detector had a hidden ingredient, how common contamination was to begin with. The next puzzle hides a different one, the rule followed by whoever shows you the information.

VISUAL: the rules appear as short labels beside the doors as each is said (labels, not sentences: "prize: random door", "you pick 1", "host knows", "host opens an empty, unpicked door", "always offers switch", "both empty → fair coin").

> There are three doors, and a prize is behind one of them, equally likely to be behind each. You pick door one.
> The host knows where the prize is. The host will always open one of the other two doors, always one without the prize, and will always offer you the chance to switch. If both of the other doors are empty, the host chooses between them by tossing a fair coin.

VISUAL: door 3 swings open, empty.

> The host opens door three. It's empty. Should you stick with door one, switch to door two, or does it make no difference?

HIDDEN UNTIL AFTER ⏸: the weights 1/6, 1/3 and the result.
⏸ 5: decide

VISUAL: door 3 dims. Above doors 1 and 2, "1/2" and "1/2" appear in grey, then get struck through.

> Here's a reasonable-sounding argument. Two doors are left, the prize is behind one of them, so it's fifty-fifty.
> That's counting what's left. The loaded die already showed that you have to weigh what's left instead.

VISUAL: three columns of equal width, one per prize location, each labelled 1/3 ("prize behind 1", "behind 2", "behind 3").

> Start before the host does anything. Three cases, each with a third of the mass.

VISUAL: in the "behind 1" column, half the width lights ("host opens 3") and half dims ("host opens 2"). SCREEN: 1/3 · 1/2 = 1/6.

> If the prize is behind door one, the host could open door two or door three, and opens three half the time. So this case keeps a third times a half. One sixth.

VISUAL: the "behind 2" column stays fully lit ("host must open 3"). SCREEN: 1/3 · 1 = 1/3.

> If the prize is behind door two, the host can't open door two, and can't open your door. Door three is forced. This case keeps all of its third.

VISUAL: the "behind 3" column crosses out ("host would never open 3").

> If the prize were behind door three, the host would never have opened it. That case is gone.

VISUAL: the lit pieces, 1/6 and 1/3, slide together and stretch to fill the width: 1/3 and 2/3. SCREEN: (1/6) / (1/2) = 1/3; (1/3) / (1/2) = 2/3.

> So the two cases still standing carry a sixth and a third. They aren't equal. Rescale them to add to one, and door one has a third while door two has two thirds. Switch.

> That's the answer once you've seen this particular door opened. Separately, a player who always switches wins two games in every three over the long run, because switching loses only when the first pick was right. Here the two numbers agree, but they answer different questions.

VISUAL: rule label "host knows" is crossed and replaced with "host picks 2 or 3 at random".

> Change one thing. Suppose the host doesn't know where the prize is, opens door two or door three at random, and door three just happens to be empty. Now what?

HIDDEN UNTIL AFTER ⏸: the new weights.
⏸ 6: predict, or redo the weights

VISUAL: "behind 1": half lit (1/6). "behind 2": now only half lit (1/6). "behind 3": crossed. Rescaled: 1/2 and 1/2.

> If the prize is behind door one, door three is opened half the time. A third times a half. If it's behind door two, this host also opens door three only half the time. Another third times a half. Equal weights, so now it really is fifty-fifty.
> The doors didn't change. The host's rule did, and the host's rule is part of the model.

---

## 7. Counting, when it's fair

VISUAL: the dice grid returns.

> Several times now we've found probabilities by counting squares. That works only when every outcome carries the same mass. Then the probability of an event is the number of outcomes in it, divided by the total number of outcomes.

SCREEN: P(A) = |A| / |Ω|, with a small note "equally likely outcomes only".

> Which sum of two dice is most likely?

HIDDEN UNTIL AFTER ⏸: the diagonal bands; the bar chart.
⏸ 3: predict

VISUAL: the anti-diagonals light in turn, each a different shade of purple, and their counts (1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1) drop to a bar chart below/right, labelled 2–12.

> If you said seven, you're right, and the grid shows why. Each sum runs along a diagonal. Seven's diagonal is the longest, six squares. Two has a single square, one and one. So seven is six times as likely as two.
> If you'd recorded only the eleven sums and treated them as equally likely, you'd have given every sum the same chance, one in eleven. That's the price of hiding the pairs.

VISUAL: grid clears. Four runner tokens labelled A, B, C, D; four podium slots 1st–4th. The slots fill with counts 4, 3, 2, 1 as said. SCREEN: 4 · 3 · 2 · 1 = 4! = 24. TERM ▸ **factorial**.

> For bigger problems we need to count without drawing every outcome. If a first choice has six options, and each of them allows six second choices, there are six times six pairs. That's the grid again, thirty-six.
> How many ways can four runners finish a race? Any of the four can come first. Then three are left for second, two for third, and one for last. Four times three times two times one, which is twenty-four. That product is written four factorial.

VISUAL: ten people tokens. Three slots fill: 10, 9, 8 → 720. Then the six orderings of one chosen trio (ABC, ACB, BAC, BCA, CAB, CBA) appear stacked and collapse into one team box. SCREEN: 720 / 3! = 120 = (10 choose 3) = 10! / (3! 7!). TERM ▸ **n choose k**.

> Now choose a team of three from ten people. Pick them in order first. Ten, then nine, then eight, which is seven hundred and twenty.
> But a team has no order. Each team was counted once for every way of lining up its three members, and there are three factorial of those, six. So divide. One hundred and twenty teams.
> Pick the team, then forget the order. That count is written ten choose three.

VISUAL: the numbers in the slot picture are replaced by symbols: n, n − 1, …, n − k + 1 over k slots; then "÷ k!". SCREEN builds: without replacement, 0 ≤ k ≤ n; ordered selections = n!/(n − k)!; teams = n!/(k!(n − k)!) = (n choose k), with (n − k)! highlighted as one grouped factor; a small grey note "0! = 1". With n = 10, k = 3 checked beside it: 10!/7! = 720, 720/3! = 120.

> The same two steps work for any sizes. Filling k ordered slots from n people gives n, times n minus one, and so on, one factor per slot. Nobody can be picked twice, so k can be anything from zero up to n. That product is n factorial, divided by the factorial of n minus k. Forgetting the order then divides by k factorial, the number of ways to line up the k chosen people. So the number of teams of k from n is n factorial, divided by k factorial times the factorial of n minus k. That's n choose k.

⏸ 2: read the finished formula and its check

VISUAL: grid of 23 small person icons.

> Here's a count worth guessing before you compute it. Twenty-three people are in a room. Assume each person's birthday is equally likely to be any of three hundred and sixty-five days, ignoring leap years, and that different people's birthdays are independent. Is it more likely or less likely than not that two of them share a birthday?

HIDDEN UNTIL AFTER ⏸: the product and 0.507.
⏸ 4: predict

> Counting the ways to share is messy. Two people could share, or three, or there could be several separate pairs. The opposite event is clean. Everybody has a different birthday.

VISUAL: a product builds left to right: 365/365 · 364/365 · 363/365 · … · 343/365, each factor appearing as a person icon lights.

> The first person can have any day. The second must avoid one day, so three hundred and sixty-four out of three hundred and sixty-five. The third must avoid two days. And so on, down to the twenty-third person, who must avoid twenty-two.

SCREEN: product ≈ 0.493; P(shared) = 1 − 0.493 ≈ 0.507.

> Multiply all twenty-three factors and you get about point four nine three. That's the chance that everyone differs. So the chance of a shared birthday is about point five oh seven. Just over a half.
> It's high because the question isn't about you, or about any one person. It's about any pair, and twenty-three people make two hundred and fifty-three pairs.

VISUAL: a tally of simulated rooms runs quickly to 10,000; count of rooms with a shared birthday: 5,039. SCREEN: 5,039 / 10,000 ≈ 0.504.

> A quick simulation agrees. Out of ten thousand random rooms of twenty-three, five thousand and thirty-nine had a shared birthday.
> When "at least one" is hard to count, count "none" and subtract from one.

VISUAL: the dice grid returns, briefly.

> One more on the grid. What's the chance of a sum of ten?

HIDDEN UNTIL AFTER ⏸: the three squares and 3/36.
⏸ 4: count

VISUAL: (4,6), (5,5), (6,4) light. SCREEN: 3/36 = 1/12.

> Four and six, five and five, six and four. Three out of thirty-six, one in twelve.

---

## 8. When knowing tells you nothing

VISUAL: the dice grid. Columns 2, 4, 6 blue ("first die even"); rows 1 and 2 gold ("second die is 1 or 2").

> Conditioning usually changes a probability. Sometimes it doesn't, and that case has a name.
> Take two events on the grid. The first die is even, which is three columns, half the mass. And the second die is one or two, which is two rows, a third of the mass.

> Now condition on the second event. Keep just those two rows. Within them, how much has an even first die?

HIDDEN UNTIL AFTER ⏸: crossed-out rows, the green six, 6/12.
⏸ 3: predict

VISUAL: rows 3–6 cross out; rows 1–2 stretch to fill. The six green squares inside them light. SCREEN: P(first even | second ≤ 2) = 6/12 = 1/2 = P(first even).

> Still half. Six of the twelve squares. Knowing the second die is one or two leaves the chance of an even first die unchanged.

TERM ▸ **independent**. SCREEN: P(A | B) = P(A), and below ⇔ P(A ∩ B) = P(A) P(B).

> Events like these are called independent. The probability of A given B is just the probability of A. Multiply through by the probability of B, and you get the usual definition. The probability of A and B equals the probability of A times the probability of B.

VISUAL: grid restores; the six green squares form a 3-column × 2-row pattern. SCREEN: 6/36 = 1/2 × 1/3.

> Here a half times a third is a sixth, and the overlap is six squares out of thirty-six, also a sixth.
> The overlap looks like a neat block, because one event is about the first die and the other about the second. That's a picture of these two events. It isn't the test. The test is the product, or equivalently, the share staying put when you condition.

VISUAL: blue becomes column 6 only ("first die is 6"); gold becomes the six-square sum ≥ 10 triangle.

> Now try a different pair. The first die is six, and the sum is at least ten. On its own, a six on the first die has probability one sixth.
> Given that the sum is at least ten, keep those six squares. Three of them have a six on the first die. So the chance jumps to a half. Knowing the sum told you a lot about the first die. These events are dependent.

SCREEN: P(first = 6) = 1/6, P(first = 6 | sum ≥ 10) = 3/6 = 1/2.

VISUAL: blue = column 1 ("first die is 1"), gold = column 6 ("first die is 6"). No overlap.

> One more pair. The first die is one, and the first die is six. They can't both happen. Each has probability a sixth. Are they independent?

HIDDEN UNTIL AFTER ⏸: the conditional 0 and the product check.
⏸ 3: predict

VISUAL: condition on column 1: everything else crosses out; column 6 is entirely gone. SCREEN: P(first = 6 | first = 1) = 0 ≠ 1/6; P(both) = 0 ≠ 1/36.

> No. If you learn the first die is one, the chance that it's six drops from a sixth to zero. Learning one changed the other completely. The product agrees. A sixth times a sixth is a thirty-sixth, but the overlap is empty.
> Two events that can't happen together, each with some positive chance, are always dependent. Being unable to happen together is a very strong connection.

VISUAL: grid clears. The four coin outcomes HH, HT, TH, TT as tiles, each 1/4. Three event rows under them with ticks: A "first is H": HH, HT. B "second is H": HH, TH. C "coins agree": HH, TT.

> With three events, independence needs more care. Flip two fair coins, independently. Let A be the first coin is heads, B the second coin is heads, and C the two coins agree. Each of these has probability a half.

VISUAL: three checks run in turn, each highlighting the shared tile(s): A and B → HH; A and C → HH; B and C → HH. SCREEN each: 1/4 = 1/2 · 1/2 ✓.

> Check A and B. Both happen only on heads heads, a quarter, which is a half times a half. A and C both happen only on heads heads too. A quarter again. And B and C, the same. Every pair passes.

> Are all three independent together?

HIDDEN UNTIL AFTER ⏸: the triple check and its ✗.
⏸ 3: predict

VISUAL: HH glows; SCREEN: P(A ∩ B ∩ C) = 1/4 ≠ 1/8 = 1/2 · 1/2 · 1/2 ✗. TERM ▸ **pairwise** / **mutual independence**.

> Look at what any two tell you about the third. If both coins are heads, they certainly agree. The chance of all three is a quarter, but the product of the three probabilities is an eighth.
> So every pair passing, which is called pairwise independence, is weaker than mutual independence, where every group of the events factors, including all three together.

VISUAL: the dice grid returns. Blue: column 3 ("first die is 3"). Gold: the sum-7 anti-diagonal.

> Try one. The first die is three, and the sum is seven. Independent?

HIDDEN UNTIL AFTER ⏸: the green (3,4) square and the check.
⏸ 5: check it

VISUAL: (3, 4) turns green. SCREEN: 1/36 = 1/6 · 1/6 ✓.

> The first die is three with probability a sixth. The sum is seven in six squares, also a sixth. Both happen only at three then four, one square, which is a thirty-sixth. That's exactly a sixth times a sixth. Independent, even though the sum involves the first die.
> Independence is a fact about the masses. It isn't about whether two events look related.

---

## 9. Outcomes become numbers

VISUAL: left panel "outcomes" with the four coin tiles stacked vertically; right panel "values", a number line 0 to 2. Nothing joins them yet.

> So far every event has been a yes-or-no question. Often we want a number instead. How many heads? What's the total? How large is the error on this example?

VISUAL: curved white arrows: HH → 2, HT → 1, TH → 1, TT → 0. A label "X" sits on the bundle of arrows, between the panels.

> Go back to two coins, and count the heads. Heads heads gives two. Heads tails and tails heads give one each. Tails tails gives zero.

TERM ▸ **random variable**. SCREEN: X : Ω → ℝ; X(HT) = 1.

> That counting rule is called a random variable. Despite the name, there's nothing random inside it. It's a function. It takes an outcome and returns a number. All the randomness is in which outcome happens.
> We'll call this one X. X of heads tails is one.

VISUAL: each tile shows its mass, 1/4.

> Now carry the mass across the arrows. The two fair tosses are independent, so each outcome holds a quarter. Before it moves, which value of X will collect the most?

HIDDEN UNTIL AFTER ⏸: the stacked bars.
⏸ 3: predict

VISUAL: the quarters travel along the arrows and stack as purple bars over 0, 1, 2: 1/4, 1/2, 1/4. TERM ▸ **PMF**. SCREEN: p_X(x) = P(X = x); p_X(1) = 1/2.

> One. Two outcomes land there, so a half stacks up. Zero and two get a quarter each.
> That list of values with their masses is the probability mass function of X. The probability that X equals one is a half.

VISUAL: a vertical threshold line appears at 0 on the value axis; the mass at or left of it glows, and the running total is plotted: the graph is drawn at 0 below 0, then a closed dot at (0, 1/4). The threshold moves to 1: the segment from 0 up to (but not including) 1 is drawn at 1/4 with an open dot at its right end, then a closed dot at (1, 3/4). The threshold **holds at 1**; nothing is drawn to its right. SCREEN: F_X(x) = P(X ≤ x).

> Sometimes it's more useful to add up from the left, and ask for the probability that X is at most some value. At most zero means only tails tails, a quarter. At most one adds the two one-head outcomes, three quarters.
> What about at most one and a half?

HIDDEN UNTIL AFTER ⏸: anything drawn to the right of x = 1 (the segment through 1.5, the value at 1.5, the jump at 2).
⏸ 3: predict

VISUAL: the threshold moves to 1.5; the horizontal segment extends from (1, 3/4) through 1.5 and is labelled 3/4 there. Then the threshold moves to 2: the segment ends with an open dot, a closed dot appears at (2, 1), and the graph continues flat at 1 to the right.

> Still three quarters. X can't land between one and two, so nothing new is added until two, where the total reaches one.

TERM ▸ **CDF** labels the finished staircase.

> The result is a staircase that only climbs. It's flat between the possible values and jumps at each one. It's called the cumulative distribution function, and the next chapter does much more with it.

⏸ 1.5: inspect the staircase

VISUAL: staircase fades. A second bundle of arrows, labelled "W", drawn in grey: HH → 0, HT → 1, TH → 1, TT → 2. Its bars come out identical: 1/4, 1/2, 1/4.

> Now count tails instead, and call that W. W has exactly the same masses as X. A quarter at zero, a half at one, a quarter at two.

VISUAL: rows HH and TT highlight; beside them "X = 2, W = 0" and "X = 0, W = 2".

> Yet X and W disagree on heads heads, and on tails tails. Two random variables can have the same distribution and still be different functions. Saying that two variables have the same distribution is a statement about their masses, not about the variables themselves.

VISUAL: W clears. A new value line 0, 1, 4 labelled "Y = X²".

> Let Y be X squared. What's its mass function?

HIDDEN UNTIL AFTER ⏸: the Y bars.
⏸ 6: work it out

VISUAL: arrows from the outcomes now land on 0, 1, 4; bars 1/4, 1/2, 1/4.

> Zero still goes to zero, and one still goes to one, but two goes to four. So a quarter at zero, a half at one, and a quarter at four. Push the mass through the function, outcome by outcome, rather than guessing from the values.

---

## 10. The average you'll never roll

VISUAL: a number line 1–6 with six equal purple bars of height 1/6, sitting on a thin beam; a triangular pivot below the beam, initially at 1.

> Roll one fair die many times. What does the average settle near? Picture the six equal masses sitting on a beam. Where would it balance?

HIDDEN UNTIL AFTER ⏸: the pivot at 3.5.
⏸ 3: predict

VISUAL: the pivot slides to 3.5 and the beam levels. TERM ▸ **expected value**. SCREEN: E[X] = Σ x · p(x) = (1 + 2 + 3 + 4 + 5 + 6)/6 = 21/6 = 3.5.

> At three and a half. The masses are symmetric around it. That balance point is called the expected value. Take each value times its probability, and add. A sixth of one, plus a sixth of two, and so on up to six. Twenty-one sixths, which is three and a half.
> No single roll ever shows three and a half. The expected value is a weighted average, not a value you should expect to see.

VISUAL: a small table of three rolls appears row by row: (4, 2), (6, 5), (1, 3). A "total" column fills (6, 11, 4) and sums to 21. Then the first-die column sums to 11 and the second-die column to 10, and 11 + 10 = 21 lands next to the first 21.

> Now two dice. Before using any rule, try three rolls. Four and two, then six and five, then one and three. The totals are six, eleven and four, which add to twenty-one.
> Or add the first dice on their own, four, six and one, which is eleven. Then the second dice, two, five and three, which is ten. Eleven plus ten is twenty-one again.
> Adding the totals is the same as adding each die's numbers separately, and dividing by the number of rolls doesn't change that. That's intuition from one short list, not yet the expected value. But the same regrouping works when we weight each possible pair of rolls by its probability, and that's why the expected value of a sum is the sum of the expected values.

VISUAL: the table slides aside; a second beam: sums 2–12 with triangle-shaped masses (1…6…1)/36; pivot settles at 7. SCREEN: E[X₁ + X₂] = E[X₁] + E[X₂] = 3.5 + 3.5 = 7. TERM ▸ **linearity**.

> For two dice that's three and a half plus three and a half, which is seven. And seven, unlike three and a half, is a total you can actually roll.
> That rule is called linearity of expectation, and it needs nothing about how the two numbers are related. It holds even when they depend on each other. Take one die and add it to itself. The total is always even, and the two parts are completely dependent. Its average is still three and a half plus three and a half.

VISUAL: one event region (a blue square region of the grid), with the indicator's two values: 1 inside, 0 outside. TERM ▸ **indicator**. SCREEN: 1_A(ω) = 1 if ω ∈ A, 0 otherwise; E[1_A] = P(A).

> Linearity becomes powerful with one simple device. For any event, define a number that's one if the event happens and zero if it doesn't. It's called an indicator.
> Its expected value is one times the probability of the event, plus zero times the rest. That's just the probability of the event.

VISUAL: the 23 person icons return. One pair is linked by a line with a small "1 / 0" tag. SCREEN: E[1_pair] = 1/365.

> Back to the twenty-three people, with independent, equally likely birthdays. On average, how many pairs share a birthday?
> Start with one pair. Give it an indicator, one if those two people share a birthday and zero if they don't. They share with probability one in three hundred and sixty-five, so the indicator's expected value is one over three hundred and sixty-five.

VISUAL: three icons, labelled 1, 2, 3, linked in a triangle; edge 1–2 glows, then edge 2–3, then edge 1–3 glows by itself with "forced". SCREEN: P(1–3 shares | 1–2 shares) = 1/365; P(1–3 shares | 1–2 and 2–3 share) = 1.

> Now look at three people. Knowing that the first two share a birthday doesn't change the chance that the first and third do. It's still one in three hundred and sixty-five. Taken two at a time, these indicators behave independently.
> But if the first and second share, and the second and third share too, then the first and third certainly do. So all three together are tied. They're pairwise independent, but not mutually independent.
> Linearity needs neither kind of independence.

VISUAL: the three-person triangle clears; the 23 icons return. One pair line is drawn bright, then a few more, then the rest appear faint and grouped (never all at equal brightness), with the count "253 pairs". SCREEN: shared pairs = Σ over 253 pairs 1_pair; E[shared pairs] = 253 · 1/365 ≈ 0.69.

> Every one of the two hundred and fifty-three pairs gets its own indicator, and the number of sharing pairs is the sum of all of them.
> So its expected value is the sum of their expected values. Two hundred and fifty-three times one over three hundred and sixty-five, which is about point six nine.

⏸ 1.5: read the finished sum

> Ten rolls of a die. How many sixes do you expect?

HIDDEN UNTIL AFTER ⏸: 10/6.
⏸ 5: work it out

SCREEN: 10 · 1/6 = 10/6 ≈ 1.67.

> Ten indicators, one for each roll, each with expected value a sixth. Ten sixths. One and two thirds.

---

## 11. The model and the coin

VISUAL: two panels. Left "model": a single purple bar at height 0.5 labelled "P(heads) = 1/2". Right "simulation": empty axes, "fraction of heads" (0–1) against "number of flips".

> Everything so far has been about the model, the masses we decided on. A simulation does something different. It draws outcomes and counts them.

VISUAL: on the right, 100 tick marks appear quickly (heads/tails), and a dot lands at 0.47 for n = 100. TERM ▸ **empirical frequency**. SCREEN: p̂ = 47/100.

> Flip a simulated fair coin a hundred times. The fraction of heads needn't be exactly a half. In this run it came out forty-seven out of a hundred. That fraction is the empirical frequency, and it's a different thing from the probability.

VISUAL: on the right, the 100-flip experiment repeats: dots for 200 independent runs pile into a histogram of frequencies centred near 0.5, most between about 0.4 and 0.6. A bracket of ±0.05 is drawn around 0.5. TERM ▸ **standard error** labels the bracket.

> How far from a half should it be? Run the same hundred-flip experiment many times, each run independent of the others, and record the frequency each time. They cluster around a half, and most land within a tenth of it.
> How spread out they are has a name. A standard deviation is a measure of how widely values spread around their mean. The standard deviation of these frequencies is called the standard error. For a fair coin and a hundred flips, it's point oh five.

VISUAL: SCREEN builds: standard error = √( p(1 − p) / n ), then = √( 0.25 / 100 ) = 0.05, with a note "derived in a later chapter".

> There's a formula for it, which a later chapter derives. Take p times one minus p, divide by n, and take the square root of that whole fraction. A quarter over a hundred, square-rooted, is point oh five.

⏸ 2: read the finished formula

> The standard error is a scale for the fluctuation, not a bound. Some runs land further away, and adding flips doesn't shrink the error every single time. But on the whole it shrinks like one over the square root of n. A hundred times as many flips makes the standard error ten times smaller.

VISUAL: many faint running-frequency paths spread out to the right; the ±band narrows as n grows (log-scale n axis: 10, 100, 1,000, 10,000).

> That formula depends on the flips being independent. Here's what happens when they aren't.
> Flip one fair coin, and copy its result into all thousand positions. Each position, on its own, is heads with probability a half, exactly as before.

VISUAL: right panel resets: a histogram axis 0–1 for "fraction of heads across 500 runs".

> Run that a few hundred times, and record the fraction of heads in each run. How spread out are those fractions?

HIDDEN UNTIL AFTER ⏸: the two spikes.
⏸ 3: predict

VISUAL: the histogram forms two spikes, at 0 and 1, about 250 each. For comparison, a faint narrow hump around 0.5 labelled "independent flips, spread ≈ 0.016". SCREEN: spread ≈ 0.5.

> Completely. Every run gives either zero or one, and nothing in between. Measured the same way, the spread is as large as it can possibly be, about point five, instead of about point oh one six for independent flips.
> A thousand copies of one coin carry the information of a single flip.

VISUAL: left and right panels both return to view, with an arrow from model to simulation labelled "checks the code" and a crossed arrow from simulation to a small globe icon labelled "the world".

> So what can a simulation do? It can check your code against a model whose answer you already know. If the simulated birthday rooms had come out far from a half, we'd check both the calculation and the code, and try more runs.
> What it can't do is tell you the model matches the world. If real birthdays bunch up in some months, the simulation won't notice. It only knows the model you gave it.

---

## 12. Where this shows up in machine learning

VISUAL: the detector tree from *Turning the question around*, re-labelled: "10,000 examples" → "positive 100" / "negative 9,900" → flagged 90 / 495. Bars 90 vs 495.

> These ideas sit underneath a lot of machine learning, and the pictures you've already seen come straight back.
> A classifier catches ninety percent of real positives, and wrongly flags five percent of negatives. Positives are one percent of the data. Out of ten thousand examples, a hundred are positive and ninety of them are caught. Nine thousand nine hundred are negative, and four hundred and ninety-five of them are wrongly flagged.
> Of the five hundred and eighty-five flagged, ninety are real. About fifteen percent. The sensitivity is ninety percent, and the precision is fifteen. With so many negatives, even a five percent false-positive rate produces far more false flags than true ones, exactly as with the detector.

SCREEN: sensitivity P(flag | positive) = 0.90; precision P(positive | flag) = 90/585 ≈ 0.15.

VISUAL: a bar of 1,000 prompts, 400 marked "rated easy" in gold and 600 "rated hard". Two rows, model A and model B, each split into solved-easy and solved-hard segments (A 360 + 150, B 340 + 300). Then the 600 hard prompts cross out and the 400 stretch to fill the bar, as in *Knowing something shrinks the world*. SCREEN: filtered A 360/400 = 0.90, B 340/400 = 0.85; all prompts A 510/1,000 = 0.51, B 640/1,000 = 0.64.

> A benchmark has a thousand prompts, and a judge rates four hundred of them as easy and the rest as hard. Model A solves three hundred and sixty of the easy ones and a hundred and fifty of the hard ones. Model B solves three hundred and forty easy ones, and three hundred hard ones.
> Score only the easy prompts, and A gets ninety percent while B gets eighty-five. Score all thousand, and A gets fifty-one percent while B gets sixty-four.
> Conditioning on the filter reversed the comparison. It's the dice again. Keeping one region changes the denominator. A score on the easy prompts is a fair answer about the easy prompts. It just isn't an answer about all thousand.

VISUAL: a short token sequence "The cat sat ⟨end⟩" with the chain-rule factors under it, and a small grey note "token split for illustration". SCREEN: P(The, cat, sat, ⟨end⟩) = P(The) · P(cat | The) · P(sat | The, cat) · P(⟨end⟩ | The, cat, sat).

> A language model scores text one token at a time. The chance that it begins with these three tokens is the first token's probability, times the second given the first, times the third given the first two. That's the chain rule. To score the complete sentence, it also multiplies in the chance of an end token after the last word.
> Nothing here assumes the tokens are independent. Every factor is conditioned on everything before it.

VISUAL: the copied-coin spikes, small; beside them a train/test split with near-duplicate examples on both sides joined by thin lines.

> Split data into training and test sets as if every example were independent, when many come from the same users, and near-copies can end up on both sides. Like the copied coin, the test set then carries less independent information than its size suggests. And because the model has effectively seen those users already, its score can look better than it would on genuinely new users.

VISUAL: two labels: "P(buy | clicked ad)" and "what happens if we show the ad?", with a "≠" between.

> A conditional probability describes what tends to occur together. It doesn't say what would happen if you changed something. Users who click an ad may buy more, but they may also be the users who were already planning to buy. Conditioning on the click picks out those users. It doesn't show what the ad itself does. Finding that out needs an experiment that decides who sees the ad, which a later chapter covers.

VISUAL: twenty small bars, each a prompt's score, scattered around 0.70; the tallest highlighted.

> Last, try twenty prompts on the same evaluation and report the best one. For this toy model, treat every prompt's answer on every example as an independent trial with a seventy percent chance of being correct. Score each prompt on two hundred examples. Does the best one look better than seventy percent?

HIDDEN UNTIL AFTER ⏸: the 0.76 line.
⏸ 3: predict

VISUAL: a dashed line at the true 0.70; a gold line at the average best ≈ 0.76. SCREEN: average best of 20 ≈ 0.76 (independent Binomial(200, 0.70) scores).

> It does. On average the best scores about seventy-six percent, and nothing about it is better. Picking the winner is conditioning on "this one won", and winners are the ones that got lucky.
> That number depends on the scores being independent. If the twenty prompts made identical predictions, they'd all score the same, and the best would average seventy percent. Either way, the honest fix doesn't change. Choose on one set of examples, then measure the chosen prompt once on fresh ones.
> The union bound is what lets you reason about this without knowing how the scores are related. The chance that any of the twenty looks good by luck is at most the sum of the chances for each one.

VISUAL: the flagged model icon from the opening returns, with "95%" and "33%" side by side; under 95% "flagged, given contaminated", under 33% "contaminated, given flagged".

> Go back to the flagged model. Ninety-five percent and thirty-three percent describe the same detector and the same population. What differs is the group each one conditions on. Ninety-five percent is the share of contaminated models that get flagged. Thirty-three percent is the share of flagged models that are contaminated.
> The chapter has the proofs, the exercises, and a lab where you build an exact conditional probability calculator yourself.

⏸ 2: end

---

## Notes for the maths review

All numbers were recomputed on 2026-11-03:
- Sum ≥ 10: 6 squares. First even ∧ sum ≥ 10: (4,6), (6,4), (6,5), (6,6) = 4. Union 18 + 6 − 4 = 20 (not narrated).
- P(first 6 or second 6) = 11/36. First even or second even: 18 + 18 − 9 = 27.
- P(sum 9) = 4/36; given first ≥ 4: 3/18; P(first ≥ 4 | sum 9) = 3/4.
- Loaded die: 5 × 3/20 + 1/4 = 1. P(6 | even) = (5/20)/(11/20) = 5/11.
- Bag: 3/5 · 2/4 = 3/10; with replacement 9/25; 2 red 3 blue: 2/5 · 1/4 = 1/10.
- Detector: 190 + 392 = 582; 190/582 = 0.3265. Odds 2/98 · 23.75 = 47.5/98 → 47.5/145.5 = 0.3265. 20% prevalence: 1,900/(1,900 + 320) = 0.8559.
- Monty Hall, host knows: 1/6 vs 1/3 → 1/3, 2/3. Ignorant host, door 3 opened empty: 1/6 vs 1/6 → 1/2, 1/2.
- Sums: 1,2,3,4,5,6,5,4,3,2,1. Sum 10: 3/36.
- 4! = 24; 10 · 9 · 8 = 720; 720/6 = 120.
- Birthdays (23): P(all distinct) = 0.4927; P(shared) = 0.5073. Simulation: `random.Random(1)`, 10,000 rooms → 5,039.
- Independence: 6/36 = 1/2 · 1/3. P(first 6 | sum ≥ 10) = 3/6. First 3 and sum 7: 1/36 = 1/6 · 1/6.
- Coins: P(A∩B∩C) = 1/4 vs 1/8.
- E[die] = 3.5; E[sum] = 7; 253/365 = 0.693; ten rolls 10/6.
- Simulation: `random.Random(1)`, 100 tosses → 47 heads. SE 0.05. Independent bits n = 1,000: SD ≈ 0.0158.
- ML: 90/585 = 0.1538. Best of 20 (independent Binomial(200, 0.7)/200): exact expectation 0.7595; `random.Random(3)`, 300 reps: 0.7595.

Added in v2 (2026-11-04, after `PS00_VIDEO_SCRIPT_REVIEW.md`):
- A ∖ B (first even, sum < 10) = 18 − 4 = 14 squares. Sum 12 ⊆ sum ≥ 10: 1/36 ≤ 6/36.
- Three-roll table: totals 6 + 11 + 4 = 21; first dice 4 + 6 + 1 = 11; second dice 2 + 5 + 3 = 10.
- Pair indicators for birthdays are pairwise independent (P(1–3 | 1–2) = 1/365) but not mutually independent (P(1–3 | 1–2, 2–3) = 1).
- Filtered benchmark (chapter §4 practice, relabelled easy/hard): A 360/400 = 0.90, B 340/400 = 0.85; all prompts A 510/1,000 = 0.51, B 640/1,000 = 0.64.
- Standard error at n = 100, p = 0.5 is 0.05 (an SD); the mean absolute error is ≈ 0.040. The script calls 0.05 the standard deviation of the frequencies, not a "typical distance".
- CDF at 1.5 = 3/4.
- 100 fair flips: P(exactly 50 heads) = C(100, 50)/2¹⁰⁰ ≈ 0.0796, so the narration says the fraction *needn't* be exactly a half.
- Best of 20 assumes independent Bernoulli(0.70) correctness on every prompt × example, i.e. independent Binomial(200, 0.70) scores.

## Length check

Measured word and pause counts; projected v2 runtime. The v1 estimate (8,600 words, 72–75 min) was wrong; v1 had 5,462 narrated words and rendered at **35.2 min**.

| | v1 (rendered) | v2 (this revision) |
|---|---|---|
| Narrated words | 5,462 | 6,492 |
| Speech at the measured 167 words/min (Kokoro af_heart, 0.95) | 32.5 min | ≈ 38.9 min |
| Authored pauses | 90.5 s | 125 s |
| Visual time beyond speech and pauses (v1 measured: 35.2 − 32.5 − 1.5) | ≈ 1.2 min | ≈ 2–4 min (more builds: De Morgan, the roll table, the CDF threshold, the frequency histogram, the filter bar) |
| **Video** | **35.2 min** | **≈ 43–46 min (projected)** |

v2 adds teaching steps only where the script review found a gap (coverage, wording, intuition before formula), plus authored inspection pauses for finished equations. It does not reach the provisional 55–65 min, and per the v2 review it shouldn't be padded to.

## Open for review

- **Length (decided in the v2 review, 2026-11-04):** no examples are added to reach a target. The length is whatever the teaching steps need; the projection is confirmed only by the re-rendered video.
- **Section 2 now carries De Morgan, set difference and subset**, which makes it one of the longer sections. The subset *inequality* is in *One unit of mass*.
