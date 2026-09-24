---
id: math.probability.foundations
title: Probability foundations from finite events
prerequisites: [foundations.mathematical-language]
answers: ps-00-foundations
estimated_hours: 24
---

# Probability foundations from finite events

Probability is not a synonym for uncertainty, randomness, confidence, or frequency. It is a mathematical model that assigns numbers to events while obeying rules that prevent contradiction. Statistics begins one level later: it uses observed data to reason about an unknown part of such a model.

This unit starts with finite sample spaces, where every object can be written down and checked. Continuous distributions and measure-theoretic refinements come later. By the end, you should be able to construct a finite probability model, condition it correctly, distinguish mutual from pairwise independence, derive Bayes' rule, and verify calculations by simulation.

## 0. Prerequisite diagnostic

Before continuing, make sure you can:

- interpret set union, intersection, complement, and subset notation;
- expand a finite sum and product;
- distinguish an implication from an equivalence;
- write a short Python function using loops, dictionaries, and a seeded random-number generator.

If any item is unfamiliar, review [mathematical language](../00-foundations/00-mathematical-language.md). No calculus is required in this unit.

## 1. Outcomes, sample spaces, and events

An **outcome** is one complete result at the resolution chosen by the model. The **sample space** \(\Omega\) is the set of all allowed outcomes. An **event** is a subset of \(\Omega\).

For two coin flips, an ordered model is

$$
\Omega=\{HH,HT,TH,TT\}.
$$

The event "exactly one head" is \(A=\{HT,TH\}\). It is an event, not an additional outcome. The event "the first flip is a head" is \(B=\{HH,HT\}\).

![A probability tree for two sequential binary outcomes. Multiply conditional probabilities along a path and add probabilities across disjoint leaves.](../assets/probability-tree.svg)

The tree preserves sequence information that a count alone discards. For fair independent flips, every edge has probability \(1/2\), so each leaf has probability \((1/2)(1/2)=1/4\). The event “exactly one head” contains two disjoint leaves, giving \(1/4+1/4=1/2\).

The sample space is a modelling choice. If order matters, \(HT\) and \(TH\) are different outcomes. Replacing them by a single outcome called "one head" changes the model and requires a different probability assignment. Many incorrect probability calculations begin by silently changing the resolution of \(\Omega\).

### Event operations

For events \(A,B\subseteq\Omega\):

- \(A\cap B\): both occur;
- \(A\cup B\): at least one occurs;
- \(A^c=\Omega\setminus A\): \(A\) does not occur;
- \(A\setminus B\): \(A\) occurs and \(B\) does not;
- \(A\subseteq B\): occurrence of \(A\) implies occurrence of \(B\).

The empty event \(\varnothing\) never occurs. The whole sample space \(\Omega\) always occurs. De Morgan's laws are

$$
(A\cup B)^c=A^c\cap B^c,
\qquad
(A\cap B)^c=A^c\cup B^c.
$$

> **Stop and predict.** For two coin flips, list \(A\cap B\), \(A\cup B\), and \(A^c\) for the events above before calculating any probabilities.

> **Practice — Foundation:** A coin is tossed and a six-sided die is rolled. Write the sample space and the event “heads or an even roll.”
>
> **Hint:** Use ordered pairs (coin, die); the union includes either condition.
>
> **Practice — Core:** Let \(A\) be “heads” and \(B\) be “roll at least 5.” Write \(A\cap B\), \(A\cup B\), and \(A^c\) as sets of outcomes.
>
> **Hint:** An intersection requires both conditions; the complement changes only the coin condition.
>
> **Practice — Stretch:** Model two fair dice once with the 36 ordered pairs and once with only the 11 possible sums. Compute \(P(\text{sum}=7)\) in both models, then show that \(P(\text{first die}=6)\) can be computed in the pair model but is not an event of the sum model.
>
> **Hint:** In the sum model, the outcome 7 lumps together six ordered pairs, so it must carry mass 6/36; no set of sums corresponds to “first die shows 6” because the sum 7 contains both (6,1) and (1,6).

## 2. The probability axioms

A probability function \(P\) assigns a number to each event and satisfies:

1. **Nonnegativity:** \(P(A)\ge 0\).
2. **Normalization:** \(P(\Omega)=1\).
3. **Additivity:** if \(A_1,A_2,\ldots\) are pairwise disjoint, then

$$
P\!\left(\bigcup_i A_i\right)=\sum_iP(A_i).
$$

For a finite sample space, it is enough to assign nonnegative masses \(p(\omega)\) to outcomes so that \(\sum_{\omega\in\Omega}p(\omega)=1\). Then

$$
P(A)=\sum_{\omega\in A}p(\omega).
$$

Do not assume outcomes are equally likely unless the model says so. A loaded die still has sample space \(\{1,2,3,4,5,6\}\), but its six outcome masses need not be \(1/6\).

### Consequences you should derive

The axioms imply

$$
P(\varnothing)=0,
\qquad
P(A^c)=1-P(A),
$$

and

$$
P(A\cup B)=P(A)+P(B)-P(A\cap B).
$$

The subtraction prevents double-counting the intersection. If \(A\subseteq B\), then \(B=A\cup(B\setminus A)\) is a disjoint union, so \(P(A)\le P(B)\).

The **union bound** follows without independence:

$$
P\!\left(\bigcup_{i=1}^n A_i\right)\le\sum_{i=1}^nP(A_i).
$$

This apparently loose inequality is fundamental in learning theory: it converts guarantees about individual bad events into a simultaneous guarantee over many choices.

<details><summary>Checkpoint: which rule applies?</summary>

If \(P(A)=0.4\), \(P(B)=0.5\), and \(P(A\cap B)=0.2\), then \(P(A\cup B)=0.4+0.5-0.2=0.7\). Adding only \(0.4+0.5\) double-counts the overlap. The union bound says merely that \(P(A\cup B)\le0.9\); it is valid but does not use the known intersection.

</details>

> **Practice — Foundation:** If \(P(A)=0.37\), compute \(P(A^c)\). Name the axiom or consequence you used.
>
> **Hint:** Partition the whole space into A and its complement.
>
> **Practice — Core:** Suppose \(P(A)=0.55\), \(P(B)=0.40\), and \(P(A\cap B)=0.20\). Compute \(P(A\cup B)\) and the probability that exactly one event occurs.
>
> **Hint:** Subtract the intersection once for the union, twice for exactly one.
>
> **Practice — Stretch:** Starting only from the axioms, prove that \(A\subseteq B\) implies \(P(A)\le P(B)\), then use that fact to justify the two-event union bound.
>
> **Hint:** Write B as the disjoint union of A and the part outside A.

## 3. Counting only when outcomes are equally likely

If a finite sample space contains equally likely outcomes, then

$$
P(A)=\frac{|A|}{|\Omega|}.
$$

This formula is a consequence of symmetry plus the axioms, not the definition of probability.

**Worked example — two dice from first principles.** Two fair dice create 36 equally likely **ordered** outcomes \((i,j)\). For a sum of nine, the favorable outcomes are \((3,6),(4,5),(5,4),(6,3)\), so the probability is \(4/36=1/9\). A tempting mistake is to treat the possible sums \(2,3,\ldots,12\) as eleven equally likely outcomes. They are not: a sum of seven has six generating pairs while a sum of two has one.

### Sum and product rules

If one choice can be made in \(m\) ways and a disjoint alternative in \(n\) ways, there are \(m+n\) possibilities. If a first choice has \(m\) possibilities and each permits \(n\) second choices, there are \(mn\) ordered pairs.

For \(n\) distinct objects:

$$
n!=n(n-1)\cdots1
$$

orders all objects. The number of ordered selections of \(k\) without replacement is \(n!/(n-k)!\); the number of unordered selections is

$$
{n\choose k}=\frac{n!}{k!(n-k)!}.
$$

**Worked example — collisions.** Suppose three independently generated IDs are uniform over \(N\) possibilities. Directly counting every collision pattern is awkward. The complement "all distinct" has probability

$$
\frac{N}{N}\frac{N-1}{N}\frac{N-2}{N}.
$$

Therefore

$$
P(\text{at least one collision})
=1-\frac{N(N-1)(N-2)}{N^3}.
$$

The complement is often easier because "at least one" contains overlapping cases.

> **Practice — Foundation:** How many five-person teams can be chosen from twelve people? State why order does or does not matter.
>
> **Hint:** Count ordered choices first, then divide by permutations within a team.
>
> **Practice — Core:** Derive the probability that at least two people share a birthday in a group of 25 under the usual simplifying assumptions. Compute it through the complement.
>
> **Hint:** Multiply successive probabilities of avoiding earlier birthdays, then take the complement.
>
> **Practice — Stretch:** A generator emits labels a, b, c with probabilities \(0.8,0.15,0.05\). Compute \(P(\text{label}\ne a)\) by naively counting labels as equally likely and then with the stated weights, and write the correct weighted sample space.
>
> **Hint:** Counting gives 2 of 3 labels, i.e. 2/3; the weighted model adds the masses of b and c, giving 0.20.

## 4. Conditional probability changes the reference population

For \(P(B)>0\), define

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)}.
$$

Conditioning discards outcomes outside \(B\) and renormalizes the remaining mass.

![Conditioning restricts the sample space to event B and renormalizes the overlap with A.](../assets/conditional-renormalization.svg)

Conditioning does not reverse the direction of a condition:

$$
P(A\mid B)\ne P(B\mid A)
$$

in general.

Rearranging the definition gives the multiplication rule

$$
P(A\cap B)=P(A\mid B)P(B)=P(B\mid A)P(A).
$$

For a sequence of events,

$$
P(A_1\cap\cdots\cap A_n)
=P(A_1)P(A_2\mid A_1)\cdots
P(A_n\mid A_1\cap\cdots\cap A_{n-1}).
$$

This **chain rule** is always valid when the conditional probabilities are defined. Multiplying marginal probabilities instead would assume independence.

**Worked example — sampling without replacement.** A bag contains three red and two blue balls. The probability that two sequential draws are both red is

$$
P(R_1\cap R_2)=P(R_1)P(R_2\mid R_1)=\frac35\frac24=\frac3{10}.
$$

The second factor changes because the first draw changes the bag.

<details><summary>Checkpoint: with replacement or without?</summary>

If the first ball were replaced, the second red probability would remain \(3/5\), giving \(9/25\). Without replacement it is \(2/4\), giving \(3/10\). The numerical difference comes from a different experiment, not from two competing calculation rules.

</details>

> **Practice — Foundation:** In a dataset, 120 of 300 examples are positive and 90 of those positives pass a filter. Compute the probability of passing given positive.
>
> **Hint:** Use the positive examples as the denominator.
>
> **Practice — Core:** Among 200 examples, 30 are in \(A\cap B\), 10 in \(A^c\cap B\), 50 in \(A\cap B^c\), and 110 in \(A^c\cap B^c\). Verify \(P(A\mid B)=0.75\), compute \(P(B\mid A)\), and explain why the two conditionals differ.
>
> **Hint:** P(A|B) divides the 30 shared examples by the 40 examples in B; P(B|A) divides the same 30 by the 80 examples in A.
>
> **Practice — Stretch:** A benchmark has 1,000 prompts; a judge model marks 400 as “answerable.” Model A solves 360 answerable and 150 other prompts; model B solves 340 answerable and 300 other prompts. Compute both models' accuracy on the filtered set and on all 1,000 prompts, and name the conditioning event that reverses the comparison.
>
> **Hint:** Filtered accuracy divides by 400 (A 0.90, B 0.85); full accuracy adds the unanswerable successes and divides by 1,000.

## 5. Total probability and Bayes' rule

Suppose \(H_1,\ldots,H_k\) form a **partition**: they are mutually disjoint and their union is \(\Omega\). Then every occurrence of \(D\) occurs through exactly one partition element, so

$$
P(D)=\sum_{j=1}^kP(D\mid H_j)P(H_j).
$$

Combining this with the multiplication rule yields Bayes' rule:

$$
P(H_i\mid D)
=\frac{P(D\mid H_i)P(H_i)}
{\sum_jP(D\mid H_j)P(H_j)}.
$$

Read the terms by role:

- \(P(H_i)\): prior probability or base rate;
- \(P(D\mid H_i)\): likelihood of the observed evidence under the hypothesis;
- \(P(D)\): evidence or normalizing constant;
- \(P(H_i\mid D)\): posterior probability after observing the evidence.

**Worked example — a benchmark alarm.** Only 2% of submitted models contain a particular contamination pattern. A detector flags 95% of contaminated models and 4% of clean models. Among 10,000 submissions, the expected counts are:

| | Flagged | Not flagged | Total |
|---|---:|---:|---:|
| Contaminated | 190 | 10 | 200 |
| Clean | 392 | 9,408 | 9,800 |
| Total | 582 | 9,418 | 10,000 |

Thus

$$
P(\text{contaminated}\mid\text{flagged})=\frac{190}{582}\approx0.326.
$$

The detector's 95% sensitivity is not a 95% posterior probability. The low base rate and false positives matter.

> **Practice — Foundation:** A detector has sensitivity \(0.90\), false-positive rate \(0.08\), and the condition prevalence is \(0.02\). Compute the probability of a positive detection by total probability.
>
> **Hint:** Partition positive detections by whether the condition is present.
>
> **Practice — Core:** For the same detector, compute the posterior probability of the condition after a positive result. Recompute it when prevalence rises to \(0.20\).
>
> **Hint:** The true-positive contribution is the numerator; total detections form the denominator.
>
> **Practice — Stretch:** Express Bayes' rule in posterior-odds form. For the detector with sensitivity \(0.90\) and false-positive rate \(0.08\), compute the likelihood ratio of a positive result and the posterior probability at prevalences \(0.02\) and \(0.20\), and explain why the ratio stays fixed while the posterior moves.
>
> **Hint:** The likelihood ratio is 0.90/0.08 = 11.25; multiply it by prior odds p/(1−p), then convert odds o back with o/(1+o).

## 6. Independence is a factorization statement

Events \(A\) and \(B\) are independent when

$$
P(A\cap B)=P(A)P(B).
$$

When \(P(B)>0\), this is equivalent to \(P(A\mid B)=P(A)\): learning that \(B\) occurred does not change the probability of \(A\).

Disjointness is different. Two nonempty disjoint events cannot be independent because their intersection has probability zero while the product of their probabilities is positive.

### Pairwise versus mutual independence

Events \(A_1,\ldots,A_n\) are mutually independent when every finite subcollection factors:

$$
P\!\left(\bigcap_{i\in S}A_i\right)=\prod_{i\in S}P(A_i)
\quad\text{for every nonempty }S.
$$

Pairwise independence checks only subsets of size two and is weaker.

**Counterexample.** Flip two independent fair coins. Let \(A\) mean the first is heads, \(B\) mean the second is heads, and \(C\) mean the flips agree. Every pair is independent, but knowing any two determines the third. Indeed,

$$
P(A\cap B\cap C)=\frac14\ne\frac18=P(A)P(B)P(C).
$$

<details><summary>Common wrong turn: “disjoint means independent”</summary>

If nonempty events \(A\) and \(B\) are disjoint, observing \(B\) makes \(A\) impossible: \(P(A\mid B)=0\). Before observing \(B\), \(P(A)>0\). The observation changed the probability, so the events are dependent.

</details>

> **Practice — Foundation:** Roll one fair die and let \(A=\{1,2\}\) and \(B=\{5,6\}\). Compute \(P(A\cap B)\) and \(P(A)P(B)\), and conclude whether these disjoint events are independent.
>
> **Hint:** The events share no outcome, so the intersection has mass 0, while the product is (1/3)(1/3).
>
> **Practice — Core:** In 100 examples, 12 are in \(A\cap B\), 28 in \(A\cap B^c\), 18 in \(A^c\cap B\), and 42 in \(A^c\cap B^c\). Test independence using both \(P(A\cap B)=P(A)P(B)\) and \(P(A\mid B)=P(A)\).
>
> **Hint:** First get P(A)=40/100 and P(B)=30/100; then compare 12/100 with their product and 12/30 with P(A).
>
> **Practice — Stretch:** Construct three events that are pairwise independent but not mutually independent. Check every required factorization explicitly.
>
> **Hint:** Use two fair bits and their exclusive-or; list the four possible triples.

## 7. Random variables turn outcomes into numbers

A random variable is a function \(X:\Omega\to\mathbb R\), not an outcome that changes mysteriously. For two coin flips, let \(X\) count heads. Then

$$
X(HH)=2,\quad X(HT)=X(TH)=1,\quad X(TT)=0.
$$

Its probability mass function is

$$
p_X(x)=P(X=x).
$$

For fair independent flips, \(p_X(0)=1/4\), \(p_X(1)=1/2\), and \(p_X(2)=1/4\). Different outcomes can map to the same value, so the probability of a value is the sum of the masses of all outcomes mapped to it.

The cumulative distribution function

$$
F_X(x)=P(X\le x)
$$

is defined for discrete and continuous random variables. It is nondecreasing, right-continuous, approaches zero to the left and one to the right. The next unit develops PMFs, densities, CDFs, and common distribution families systematically.

> **Practice — Foundation:** For two fair coin tosses, define \(X\) as the number of heads and list \(X(\omega)\) for every outcome.
>
> **Hint:** List HH, HT, TH, TT before grouping by head count.
>
> **Practice — Core:** Let \(Y=X^2\). Derive the PMF of \(Y\) from the outcome map rather than guessing from its possible values.
>
> **Hint:** Sum masses of every outcome sent to the same squared value.
>
> **Practice — Stretch:** On the two-toss sample space \(\{HH,HT,TH,TT\}\), let \(X\) count heads and \(W\) count tails. Show that \(X\) and \(W\) have the same PMF, and list the outcomes on which \(X(\omega)\ne W(\omega)\).
>
> **Hint:** Tabulate both functions outcome by outcome; each takes values 0, 1, 2 with masses 1/4, 1/2, 1/4, but they disagree on HH and TT.

## 8. Expectation and the indicator method

For a finite-valued random variable,

$$
E[X]=\sum_xx\,p_X(x)
=\sum_{\omega\in\Omega}X(\omega)p(\omega).
$$

Expectation is a probability-weighted average, not necessarily a possible observed value. Linearity holds without independence:

$$
E[aX+bY]=aE[X]+bE[Y].
$$

For an event \(A\), define its indicator

$$
\mathbf1_A(\omega)=
\begin{cases}
1,&\omega\in A,\\
0,&\omega\notin A.
\end{cases}
$$

Then \(E[\mathbf1_A]=P(A)\). If \(X=\sum_i\mathbf1_{A_i}\) counts how many events occur, linearity gives

$$
E[X]=\sum_iP(A_i)
$$

even when the events are dependent.

**Worked example — expected collisions.** Hash \(m\) items independently and uniformly into \(N\) buckets. For each pair \(i<j\), let \(I_{ij}\) indicate a collision. Since \(P(I_{ij}=1)=1/N\), the expected number of colliding pairs is

$$
E\!\left[\sum_{i<j}I_{ij}\right]
=\sum_{i<j}\frac1N
=\frac{{m\choose2}}N.
$$

No independence between the indicators was required for this expectation.

> **Practice — Foundation:** For \(P(X=0)=0.2\), \(P(X=1)=0.5\), and \(P(X=3)=0.3\), compute \(E[X]\).
>
> **Hint:** Multiply each value by its mass and add.
>
> **Practice — Core:** A uniformly random permutation of \(n\) items is generated. Introduce indicator variables and derive the expected number of fixed points without enumerating permutations; then check your answer for \(n=3\) by listing all six permutations.
>
> **Hint:** Each position is fixed with probability 1/n, so the n indicators sum to expectation 1; for n = 3 the fixed-point counts are 3, 1, 1, 1, 0, 0.
>
> **Practice — Stretch:** Let \(P(X=k)=\frac{6}{\pi^2k^2}\) for \(k=1,2,\ldots\). Verify that the masses sum to one and show that \(E[X]\) is infinite by identifying which series diverges.
>
> **Hint:** Use \(\sum 1/k^2=\pi^2/6\) for normalization; the first-moment series becomes \((6/\pi^2)\sum 1/k\), the harmonic series.

## 9. Model probability is not empirical frequency

The model supplies \(P(A)\). A simulation produces the empirical frequency

$$
\widehat P_n(A)=\frac1n\sum_{i=1}^n\mathbf1\{\omega_i\in A\}.
$$

Under independent sampling from the stated model, this frequency tends to \(P(A)\) as \(n\) grows. At finite \(n\), disagreement is expected. A simulation can reveal a calculation or implementation error; it cannot prove that the model matches reality.

Research code should make the random mechanism inspectable:

1. state the sample space and probability assignment;
2. distinguish independent draws from sampling without replacement;
3. seed a local random-number generator for reproducibility;
4. report the number of trials and variability, not only one estimate;
5. test the simulator on cases with an exact answer.

> **Practice — Foundation:** In Python, create `r = random.Random(1)` and count heads among 100 tosses coded as `r.random() < 0.5`. Report the empirical frequency and its distance from \(0.5\) in units of the standard error \(0.05\).
>
> **Hint:** The standard error is sqrt(0.5·0.5/100) = 0.05; this seed gives 47 heads, a distance of 0.6 standard errors.
>
> **Practice — Core:** With `random.Random(1)`, generate 500 independent samples of fair tosses at each size \(n=100,1{,}000,10{,}000\). Tabulate the mean absolute error \(|\hat p-0.5|\) for each \(n\) and compare it with \(0.5\sqrt{2/(\pi n)}\).
>
> **Hint:** Repeat whole samples, not one running path; the predicted values are about 0.040, 0.0126 and 0.0040, shrinking by √10 per tenfold increase.
>
> **Practice — Stretch:** With `random.Random(2)`, create 500 sequences of length 1,000 in two ways: independent fair bits, and one fair bit copied to all 1,000 positions. Both have marginal success probability \(0.5\). Report the standard deviation of the 500 empirical frequencies in each case and explain the difference.
>
> **Hint:** Independent bits give about sqrt(0.25/1000) ≈ 0.016; the copied bit makes every frequency exactly 0 or 1, so its standard deviation is about 0.5.

## 10. ML connections and common failure modes

- **Class imbalance:** sensitivity \(P(\widehat Y=1\mid Y=1)\) does not determine precision \(P(Y=1\mid\widehat Y=1)\); the class base rate is required.
- **Dataset filtering:** performance conditional on examples that passed a filter is not automatically performance on the original population.
- **Token generation:** the chain rule factors a joint sequence probability into conditional next-token probabilities. This factorization does not claim tokens are independent.
- **Train/test leakage:** treating related samples as independent can place nearly identical information in both splits and invalidate the intended estimate.
- **Conditional versus causal:** \(P(Y\mid X)\) describes an observational distribution. It does not by itself describe what happens when an intervention changes \(X\).
- **Union over many choices:** repeatedly selecting the best-looking model or prompt increases the chance that at least one result looks good by noise. Later units turn this observation into multiple-testing corrections and uniform generalization bounds.

> **Practice — Foundation:** A classifier has sensitivity \(0.90\) and false-positive rate \(0.05\) on a class with base rate \(0.01\). Compute its precision \(P(Y=1\mid\widehat Y=1)\) and name which failure mode above the gap between 0.90 and your answer illustrates.
>
> **Hint:** Precision is 0.009/(0.009+0.0495); the missing ingredient in reading 0.90 as precision is the class base rate.
>
> **Practice — Core:** A log has 1,000 users, each with daily records from January to December. Design train, validation, and test splits (give user counts and date ranges) for predicting next-month behavior of new users, and state which dependence and leakage risks each choice prevents.
>
> **Hint:** Assign each user to exactly one split (for example 700/150/150) and train only on records dated before the evaluation window, so neither the same user nor future information crosses splits.
>
> **Practice — Stretch:** Twenty prompt variants all have true accuracy \(0.70\) and are scored on the same 200 validation examples; only the best score is reported. Simulate 300 repetitions with `random.Random(3)`, report the average best score, name the hidden conditioning event, and propose an evaluation protocol that removes the bias.
>
> **Hint:** Each score has standard error about sqrt(0.21/200) ≈ 0.032, and the maximum of 20 such scores averages about 0.76; rescoring only the selected prompt on fresh data removes the selection.

## 11. Runnable lab: exact conditional probability

Implement `conditional_probability` in [labs/exercises.py](../../labs/exercises.py). It receives a mapping from finite outcomes to nonnegative weights, an event, and a conditioning event. Return

$$
\frac{\sum_{\omega\in A\cap B}w_\omega}
{\sum_{\omega\in B}w_\omega}.
$$

The weights need not already sum to one because the common normalizer cancels. Reject an empty model, negative or nonfinite weights, unknown outcomes in either event, zero total mass, and a conditioning event with zero mass. Do not mutate the inputs.

Run:

```text
python -m labs.checks conditional
```

After it passes, write a seeded simulation for the loaded model

$$
w=\{1:1,2:1,3:1,4:1,5:1,6:5\}
$$

and compare empirical with exact \(P(X=6\mid X\text{ is even})\) over increasing trial counts. Do not change the exact function into a simulator.

## 12. Derivations to own

Derive each result from the axioms or the definition of conditional probability:

1. \(P(A^c)=1-P(A)\).
2. The two-event inclusion–exclusion formula.
3. The union bound for \(n\) events by induction.
4. The probability chain rule for three events.
5. The law of total probability from a partition.
6. Bayes' rule from two expressions for \(P(A\cap B)\).
7. Linearity of expectation for two finite random variables.

## Prediction experiment

Predict both the baseline and failure-preset results before revealing the calculation. Record the assumptions, change one control at a time, and explain the boundary case. This small deterministic model isolates a mechanism; it is not an empirical validation of a trained system.

```lab
lab: ps-events
```

## 13. End-of-unit practice (graded)

Work each problem before opening its authored solution. Written proofs and design answers require self-review against the rubric; numeric fields check only the stated quantities.


### Foundation — problems 1–3. Build accurate finite models and execute direct calculations.

**A1 · Foundation · paper — Routine.** Two fair dice are rolled. Compute the probability that their sum is at least ten.

**A2 · Foundation · paper — Complement.** Derive the probability of at least one shared birthday among \(m\) people under a uniform 365-day model, then evaluate it for \(m=23\).

**A3 · Foundation · paper — Conditioning.** Two cards are drawn without replacement from a standard deck. Given that at least one is an ace, compute the probability both are aces. State whether the observation reveals which draw was an ace.

### Core — problems 4–7. Combine conditioning, factorization, and indicator arguments.

**A4 · Core · paper — Bayes.** Recompute the contamination example if the base rate falls from 2% to 0.2%, holding detector behavior fixed. Explain the direction of change before calculating.

**A5 · Core · paper — Independence.** Prove that if \(A\) and \(B\) are independent, then \(A^c\) and \(B\) are independent.

**A6 · Core · paper — Indicators.** Derive the expected number of empty buckets after hashing \(m\) items independently into \(N\) uniform buckets.

**A7 · Core · paper — Counterexample.** Roll a fair four-sided die with faces \(1,2,3,4\) and let \(A=\{1,2\}\), \(B=\{1,3\}\), \(C=\{1,4\}\). Verify that the three events are pairwise independent but not mutually independent.

### Stretch — problems 8–12. Transfer the probability language to evaluation, algorithms, and model criticism.

**A8 · Stretch · paper — Research critique.** A benchmark reports the best of 40 prompt variants on the same 300 examples. Suppose every variant has true accuracy \(0.60\). Compute the standard error of one variant's score, simulate the reported best score over 200 repetitions (seed 4), identify the event union being ignored, and specify what additional data split would support an honest final estimate.

**A9 · Stretch · paper — Implementation.** A bag contains three red and two blue balls. Estimate the probability of two red draws (a) with replacement and (b) without replacement using 100,000 trials from a local RNG seeded with 2026. Compare with both exact answers and attach a Monte Carlo standard error to each estimate.

**A10 · Stretch · paper — Transfer.** For two-token sequences over \(\{a,b\}\), let \(P(x_1=a)=0.6\), \(P(x_2=a\mid x_1=a)=0.9\), and \(P(x_2=a\mid x_1=b)=0.2\). Compute \(P(aa)\) by the chain rule and by the product of marginals \(P(x_1=a)P(x_2=a)\), and explain why next-token factorization is an application of the chain rule and not an independence assumption.

**A11 · Stretch · paper — Adversarial conditioning.** On easy prompts, model A gets \(81/87\) correct and B gets \(234/270\); on hard prompts, A gets \(192/263\) and B gets \(55/80\). Verify that A wins within both difficulty groups while B wins after aggregation. Identify the conditioning variable and explain exactly which unequal weights create the reversal.

**A12 · Stretch · paper — Model audit.** An augmentation pipeline flips each image horizontally with probability \(0.5\) and independently chooses one of 4 crop offsets uniformly. Write its sample space and probability law, compute \(P(\text{flipped and offset }0)\) and the mean and standard deviation of the number of flipped images in a batch of 256, and name three concrete implementation behaviors that would make this model disagree with the real pipeline.


## Six-part checkpoint

Complete these without notes, then use the solutions to audit assumptions and reasoning. Passing a numeric check alone does not establish mastery. For implementation and transfer, retain the code/results or written protocol as evidence.

**K1 · Foundation · gate — Concept.** Distinguish an outcome, event, and conditioning event.

**K2 · Core · gate — Derivation.** Derive Bayes’ rule from the definition of conditional probability.

**K3 · Core · gate — Calculation.** A detector has sensitivity 0.9, false-positive rate 0.1 and prevalence 0.1. Find P(positive case | positive detector).

**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-events experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.

**K5 · Stretch · gate — Claim audit.** Does pairwise independence justify multiplying the probabilities of three events?

**K6 · Stretch · gate — RE/RS transfer.** Design a final evaluation after choosing among 30 prompts.

## Mastery check

Without notes, build a finite probability model for a new problem, name every outcome and event, derive a conditional probability two ways, and validate it with a seeded simulation. Then explain one way the model could fail to describe the real data-generating process.

Passing this unit means you can construct and audit finite models. It does not yet mean you can work fluently with continuous distributions or infer unknown parameters from data.

## Track roadmap

Next come random variables and distribution families; joint distributions and transformations; laws of large numbers, central limit behavior, and concentration; estimation; **hypothesis testing, power, effect sizes, and multiple comparisons**; bootstrap, permutation methods, and experimental design; Bayesian computation; and ML evaluation under dependence and distribution shift.
