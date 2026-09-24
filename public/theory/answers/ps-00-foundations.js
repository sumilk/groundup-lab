/* Authored probability solutions and offline checks. */
GU.answers("ps-00-foundations", {
A1: {
  "statement": "**A1 · Foundation · paper — Routine.** Two fair dice are rolled. Compute the probability that their sum is at least ten.",
  "plain": "There are six favorable ordered pairs: \\((4,6),(5,5),(6,4),(5,6),(6,5),(6,6)\\), so the answer is \\(6/36=1/6\\).",
  "solution": "<p>There are six favorable ordered pairs: \\((4,6),(5,5),(6,4),(5,6),(6,5),(6,6)\\), so the answer is \\(6/36=1/6\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Probability",
      "type": "num",
      "ans": 0.16666666666666666
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Complement.** Derive the probability of at least one shared birthday among \\(m\\) people under a uniform 365-day model, then evaluate it for \\(m=23\\).",
  "plain": "The complement (all birthdays distinct) has probability \\(\\prod_{j=0}^{m-1}(365-j)/365\\) for \\(m\\le365\\), so the collision probability is one minus this product; for \\(m>365\\) it is one. For \\(m=23\\), the product is about \\(0.4927\\), so \\(P(\\text{shared})\\approx0.5073\\).",
  "solution": "<p>The complement (all birthdays distinct) has probability \\(\\prod_{j=0}^{m-1}(365-j)/365\\) for \\(m\\le365\\), so the collision probability is one minus this product; for \\(m&gt;365\\) it is one. For \\(m=23\\), the product is about \\(0.4927\\), so \\(P(\\text{shared})\\approx0.5073\\).</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — Conditioning.** Two cards are drawn without replacement from a standard deck. Given that at least one is an ace, compute the probability both are aces. State whether the observation reveals which draw was an ace.",
  "plain": "Of \\({52\\choose2}\\) unordered pairs, those with at least one ace number \\({52\\choose2}-{48\\choose2}=198\\). The six two-ace pairs are favorable, giving \\(6/198=1/33\\). Observing a specified draw to be an ace would define a different conditioning event.",
  "solution": "<p>Of \\({52\\choose2}\\) unordered pairs, those with at least one ace number \\({52\\choose2}-{48\\choose2}=198\\). The six two-ace pairs are favorable, giving \\(6/198=1/33\\). Observing a specified draw to be an ace would define a different conditioning event.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Conditional probability",
      "type": "num",
      "ans": 0.030303030303030304
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A4: {
  "statement": "**A4 · Core · paper — Bayes.** Recompute the contamination example if the base rate falls from 2% to 0.2%, holding detector behavior fixed. Explain the direction of change before calculating.",
  "plain": "In 100,000 cases, expect 200 contaminated, 190 true flags, and \\(0.04(99{,}800)=3{,}992\\) false flags. The posterior is \\(190/4{,}182\\approx0.0454\\); reducing the prior reduces the posterior.",
  "solution": "<p>In 100,000 cases, expect 200 contaminated, 190 true flags, and \\(0.04(99{,}800)=3{,}992\\) false flags. The posterior is \\(190/4{,}182\\approx0.0454\\); reducing the prior reduces the posterior.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Independence.** Prove that if \\(A\\) and \\(B\\) are independent, then \\(A^c\\) and \\(B\\) are independent.",
  "plain": "Write \\(P(A^c\\cap B)=P(B)-P(A\\cap B)=P(B)-P(A)P(B)=P(A^c)P(B)\\).",
  "solution": "<p>Write \\(P(A^c\\cap B)=P(B)-P(A\\cap B)=P(B)-P(A)P(B)=P(A^c)P(B)\\).</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Indicators.** Derive the expected number of empty buckets after hashing \\(m\\) items independently into \\(N\\) uniform buckets.",
  "plain": "Let \\(I_j\\) indicate that bucket \\(j\\) is empty. Each item avoids it with probability \\((N-1)/N\\), so \\(E[I_j]=(1-1/N)^m\\). Summing gives \\(N(1-1/N)^m\\).",
  "solution": "<p>Let \\(I_j\\) indicate that bucket \\(j\\) is empty. Each item avoids it with probability \\((N-1)/N\\), so \\(E[I_j]=(1-1/N)^m\\). Summing gives \\(N(1-1/N)^m\\).</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Counterexample.** Roll a fair four-sided die with faces \\(1,2,3,4\\) and let \\(A=\\{1,2\\}\\), \\(B=\\{1,3\\}\\), \\(C=\\{1,4\\}\\). Verify that the three events are pairwise independent but not mutually independent.",
  "plain": "Each event has probability \\(2/4=1/2\\). Every pairwise intersection is \\(\\{1\\}\\), with probability \\(1/4=(1/2)(1/2)\\), so each pair is independent. But \\(A\\cap B\\cap C=\\{1\\}\\) also has probability \\(1/4\\), not \\((1/2)^3=1/8\\), so the three events are not mutually independent.",
  "solution": "<p>Each event has probability \\(2/4=1/2\\). Every pairwise intersection is \\(\\{1\\}\\), with probability \\(1/4=(1/2)(1/2)\\), so each pair is independent. But \\(A\\cap B\\cap C=\\{1\\}\\) also has probability \\(1/4\\), not \\((1/2)^3=1/8\\), so the three events are not mutually independent.</p>"
},
A8: {
  "statement": "**A8 · Stretch · paper — Research critique.** A benchmark reports the best of 40 prompt variants on the same 300 examples. Suppose every variant has true accuracy \\(0.60\\). Compute the standard error of one variant's score, simulate the reported best score over 200 repetitions (seed 4), identify the event union being ignored, and specify what additional data split would support an honest final estimate.",
  "plain": "One variant's score has standard error \\(\\sqrt{0.6(0.4)/300}\\approx0.028\\). A seeded simulation (Python random.Random(4), 200 repetitions of 40 binomial scores) gives an average best score of about \\(0.66\\), roughly two standard errors above the true 0.60, although no variant is better. Each variant has an event that its score is high by noise; reporting the maximum concerns the union of those 40 events. Choose the variant on a development set and report its accuracy once on a separate, previously untouched test set.",
  "solution": "<p>One variant&#x27;s score has standard error \\(\\sqrt{0.6(0.4)/300}\\approx0.028\\). A seeded simulation (Python random.Random(4), 200 repetitions of 40 binomial scores) gives an average best score of about \\(0.66\\), roughly two standard errors above the true 0.60, although no variant is better. Each variant has an event that its score is high by noise; reporting the maximum concerns the union of those 40 events. Choose the variant on a development set and report its accuracy once on a separate, previously untouched test set.</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Implementation.** A bag contains three red and two blue balls. Estimate the probability of two red draws (a) with replacement and (b) without replacement using 100,000 trials from a local RNG seeded with 2026. Compare with both exact answers and attach a Monte Carlo standard error to each estimate.",
  "plain": "The exact probabilities are \\((3/5)^2=0.36\\) with replacement and \\((3/5)(2/4)=0.30\\) without replacement. For an indicator estimate \\(\\hat p\\), report \\(\\sqrt{\\hat p(1-\\hat p)/100000}\\), about \\(0.0015\\) in either experiment. A correct seeded run should land within a few such standard errors of each target; using \\(0.36\\) for the second design ignores depletion.",
  "solution": "<p>The exact probabilities are \\((3/5)^2=0.36\\) with replacement and \\((3/5)(2/4)=0.30\\) without replacement. For an indicator estimate \\(\\hat p\\), report \\(\\sqrt{\\hat p(1-\\hat p)/100000}\\), about \\(0.0015\\) in either experiment. A correct seeded run should land within a few such standard errors of each target; using \\(0.36\\) for the second design ignores depletion.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Transfer.** For two-token sequences over \\(\\{a,b\\}\\), let \\(P(x_1=a)=0.6\\), \\(P(x_2=a\\mid x_1=a)=0.9\\), and \\(P(x_2=a\\mid x_1=b)=0.2\\). Compute \\(P(aa)\\) by the chain rule and by the product of marginals \\(P(x_1=a)P(x_2=a)\\), and explain why next-token factorization is an application of the chain rule and not an independence assumption.",
  "plain": "By the chain rule, \\(P(aa)=P(x_1=a)P(x_2=a\\mid x_1=a)=0.6(0.9)=0.54\\). The marginal is \\(P(x_2=a)=0.6(0.9)+0.4(0.2)=0.62\\), so the independence product is \\(0.6(0.62)=0.372\\ne0.54\\). Multiplying \\(P(x_t\\mid x_{<t})\\) is always exact (the chain rule). Independence would replace these history-dependent conditionals with marginals \\(P(x_t)\\), a much stronger claim that is false here.",
  "solution": "<p>By the chain rule, \\(P(aa)=P(x_1=a)P(x_2=a\\mid x_1=a)=0.6(0.9)=0.54\\). The marginal is \\(P(x_2=a)=0.6(0.9)+0.4(0.2)=0.62\\), so the independence product is \\(0.6(0.62)=0.372\\ne0.54\\). Multiplying \\(P(x_t\\mid x_{&lt;t})\\) is always exact (the chain rule). Independence would replace these history-dependent conditionals with marginals \\(P(x_t)\\), a much stronger claim that is false here.</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Adversarial conditioning.** On easy prompts, model A gets \\(81/87\\) correct and B gets \\(234/270\\); on hard prompts, A gets \\(192/263\\) and B gets \\(55/80\\). Verify that A wins within both difficulty groups while B wins after aggregation. Identify the conditioning variable and explain exactly which unequal weights create the reversal.",
  "plain": "Within easy prompts, A has \\(81/87\\approx0.931\\) against B's \\(234/270\\approx0.867\\). Within hard prompts, A has \\(192/263\\approx0.730\\) against B's \\(55/80=0.6875\\). Overall, A has \\(273/350=0.780\\), while B has \\(289/350\\approx0.826\\). Difficulty is the conditioning variable. A was evaluated mostly on hard prompts and B mostly on easy prompts, so the marginal rates use different difficulty mixtures.",
  "solution": "<p>Within easy prompts, A has \\(81/87\\approx0.931\\) against B&#x27;s \\(234/270\\approx0.867\\). Within hard prompts, A has \\(192/263\\approx0.730\\) against B&#x27;s \\(55/80=0.6875\\). Overall, A has \\(273/350=0.780\\), while B has \\(289/350\\approx0.826\\). Difficulty is the conditioning variable. A was evaluated mostly on hard prompts and B mostly on easy prompts, so the marginal rates use different difficulty mixtures.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Model audit.** An augmentation pipeline flips each image horizontally with probability \\(0.5\\) and independently chooses one of 4 crop offsets uniformly. Write its sample space and probability law, compute \\(P(\\text{flipped and offset }0)\\) and the mean and standard deviation of the number of flipped images in a batch of 256, and name three concrete implementation behaviors that would make this model disagree with the real pipeline.",
  "plain": "The sample space is \\(\\{\\text{flip},\\text{no flip}\\}\\times\\{0,1,2,3\\}\\), with 8 outcomes of mass \\(0.5\\times0.25=1/8\\) each, so \\(P(\\text{flipped and offset }0)=1/8\\). If flips are independent across images, the number flipped in 256 images is Binomial(256, 0.5), with mean 128 and standard deviation 8. The model could disagree with the implementation if (1) data-loader workers share one seed and repeat the same flip pattern, (2) the crop offset is drawn from the same random number as the flip, so the two choices are dependent, or (3) the logs record an intended flip that a later transform undoes. Each can be checked from logged outcome frequencies.",
  "solution": "<p>The sample space is \\(\\{\\text{flip},\\text{no flip}\\}\\times\\{0,1,2,3\\}\\), with 8 outcomes of mass \\(0.5\\times0.25=1/8\\) each, so \\(P(\\text{flipped and offset }0)=1/8\\). If flips are independent across images, the number flipped in 256 images is Binomial(256, 0.5), with mean 128 and standard deviation 8. The model could disagree with the implementation if (1) data-loader workers share one seed and repeat the same flip pattern, (2) the crop offset is drawn from the same random number as the flip, so the two choices are dependent, or (3) the logs record an intended flip that a later transform undoes. Each can be checked from logged outcome frequencies.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** Distinguish an outcome, event, and conditioning event.",
  "plain": "An outcome is an atom of the chosen sample space; an event is a subset; conditioning restricts and renormalizes onto an event with positive mass.",
  "solution": "<p>An outcome is an atom of the chosen sample space; an event is a subset; conditioning restricts and renormalizes onto an event with positive mass.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive Bayes’ rule from the definition of conditional probability.",
  "plain": "Write P(A∩B)=P(A|B)P(B)=P(B|A)P(A), then divide by P(B)>0.",
  "solution": "<p>Write P(A∩B)=P(A|B)P(B)=P(B|A)P(A), then divide by P(B)&gt;0.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** A detector has sensitivity 0.9, false-positive rate 0.1 and prevalence 0.1. Find P(positive case | positive detector).",
  "plain": "The positive mass is 0.09+0.09=0.18, so the posterior is 0.5.",
  "solution": "<p>The positive mass is 0.09+0.09=0.18, so the posterior is 0.5.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.5
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-events experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does pairwise independence justify multiplying the probabilities of three events?",
  "plain": "No. For fair independent bits U,V, the events U=0, V=0 and U XOR V=0 are pairwise independent, but their intersection has probability 1/4 rather than 1/8.",
  "solution": "<p>No. For fair independent bits U,V, the events U=0, V=0 and U XOR V=0 are pairwise independent, but their intersection has probability 1/4 rather than 1/8.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Design a final evaluation after choosing among 30 prompts.",
  "plain": "Use development data to choose the prompt and freeze it before an untouched final evaluation; define the target population and sampling unit. Reusing the selection data conditions on favorable noise.",
  "solution": "<p>Use development data to choose the prompt and freeze it before an untouched final evaluation; define the target population and sampling unit. Reusing the selection data conditions on favorable noise.</p>"
}
});
