/* Authored probability solutions and offline checks. */
GU.answers("ps-02-joint-conditioning-covariance", {
A1: {
  "statement": "**A1 · Foundation · paper — Cumulative problem 1.** For the joint table \\(p(0,0)=0.30,p(0,1)=0.20,p(1,0)=0.10,p(1,1)=0.40\\), compute both marginals, \\(P(Y=\\cdot\\mid X=0)\\), \\(P(Y=\\cdot\\mid X=1)\\), \\(P(X=\\cdot\\mid Y=0)\\), and \\(P(X=\\cdot\\mid Y=1)\\).",
  "plain": "The row marginals are \\(P(X=0)=P(X=1)=0.5\\); column marginals are \\(P(Y=0)=0.4,P(Y=1)=0.6\\). Given \\(X=0\\), the \\(Y\\) probabilities are \\((0.6,0.4)\\); given \\(X=1\\), they are \\((0.2,0.8)\\). Given \\(Y=0\\), the \\(X\\) probabilities are \\((0.75,0.25)\\); given \\(Y=1\\), they are \\((1/3,2/3)\\).",
  "solution": "<p>The row marginals are \\(P(X=0)=P(X=1)=0.5\\); column marginals are \\(P(Y=0)=0.4,P(Y=1)=0.6\\). Given \\(X=0\\), the \\(Y\\) probabilities are \\((0.6,0.4)\\); given \\(X=1\\), they are \\((0.2,0.8)\\). Given \\(Y=0\\), the \\(X\\) probabilities are \\((0.75,0.25)\\); given \\(Y=1\\), they are \\((1/3,2/3)\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "P(Y=0 | X=0); P(X=0 | Y=0)",
      "type": "vec",
      "ans": [
        0.6,
        0.75
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Cumulative problem 2.** Construct the joint PMF of two fair dice conditioned on their sum being at most five.",
  "plain": "The allowed ordered pairs are \\((1,1),(1,2),(1,3),(1,4),(2,1),(2,2),(2,3),(3,1),(3,2),(4,1)\\): 10 of the 36. Conditioning makes each of them equally likely with mass \\(1/10\\). The first-die marginal is \\(P(1)=0.4,P(2)=0.3,P(3)=0.2,P(4)=0.1\\), and by symmetry the second die has the same marginal. The conditional joint does not factorize, for example \\(p(4,4)=0\\ne0.1\\cdot0.1\\).",
  "solution": "<p>The allowed ordered pairs are \\((1,1),(1,2),(1,3),(1,4),(2,1),(2,2),(2,3),(3,1),(3,2),(4,1)\\): 10 of the 36. Conditioning makes each of them equally likely with mass \\(1/10\\). The first-die marginal is \\(P(1)=0.4,P(2)=0.3,P(3)=0.2,P(4)=0.1\\), and by symmetry the second die has the same marginal. The conditional joint does not factorize, for example \\(p(4,4)=0\\ne0.1\\cdot0.1\\).</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — Cumulative problem 3.** Verify total expectation for the request-type example.",
  "plain": "Weighting \\(50,200,800\\) by \\(0.5,0.3,0.2\\) gives \\(245\\), matching direct averaging over a population with those proportions.",
  "solution": "<p>Weighting \\(50,200,800\\) by \\(0.5,0.3,0.2\\) gives \\(245\\), matching direct averaging over a population with those proportions.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Unconditional mean",
      "type": "num",
      "ans": 245
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A4: {
  "statement": "**A4 · Core · paper — Cumulative problem 4.** Recompute total variance when the two latency types occur with probabilities 0.8 and 0.2.",
  "plain": "The overall mean becomes \\(180\\). The within term remains 400. The between term is \\(0.8(100-180)^2+0.2(500-180)^2=25{,}600\\), so total variance is 26,000.",
  "solution": "<p>The overall mean becomes \\(180\\). The within term remains 400. The between term is \\(0.8(100-180)^2+0.2(500-180)^2=25{,}600\\), so total variance is 26,000.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Cumulative problem 5.** Show directly that the zero-covariance \\(Y=X^2\\) example does not factorize.",
  "plain": "At \\((0,0)\\), joint mass is \\(1/3\\), while the product of marginals is \\((1/3)(1/3)=1/9\\).",
  "solution": "<p>At \\((0,0)\\), joint mass is \\(1/3\\), while the product of marginals is \\((1/3)(1/3)=1/9\\).</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Cumulative problem 6.** Give a symmetric matrix with positive diagonal entries that is not positive semidefinite.",
  "plain": "\\(\\begin{bmatrix}1&2\\\\2&1\\end{bmatrix}\\) fails because direction \\((1,-1)^T\\) gives quadratic form \\(-2\\).",
  "solution": "<p>\\(\\begin{bmatrix}1&amp;2\\\\2&amp;1\\end{bmatrix}\\) fails because direction \\((1,-1)^T\\) gives quadratic form \\(-2\\).</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Cumulative problem 7.** Derive the variance of \\(a^TZ\\) from the covariance matrix.",
  "plain": "Center \\(a^TZ\\), expand its squared deviation, and obtain \\(a^TE[(Z-\\mu)(Z-\\mu)^T]a=a^T\\Sigma a\\).",
  "solution": "<p>Center \\(a^TZ\\), expand its squared deviation, and obtain \\(a^TE[(Z-\\mu)(Z-\\mu)^T]a=a^T\\Sigma a\\).</p>"
},
A8: {
  "statement": "**A8 · Stretch · paper — Cumulative problem 8.** Model A scores \\(90/100\\) on easy prompts and \\(30/100\\) on hard prompts. Model B scores \\(171/200\\) on easy prompts and \\(14/50\\) on hard prompts. Verify which model wins within each difficulty group and which wins overall; then recompute both overall accuracies under a common 50–50 difficulty mixture.",
  "plain": "A wins easy prompts \\(0.90>0.855\\) and hard prompts \\(0.30>0.28\\), but A's overall accuracy is \\(120/200=0.60\\), below B's \\(185/250=0.74\\). Under a common 50–50 difficulty mixture, A scores \\(0.5(0.90)+0.5(0.30)=0.60\\) and B scores \\(0.5(0.855)+0.5(0.28)=0.5675\\), restoring A's within-group advantage. Different difficulty weights, not contradictory arithmetic, produced the reversal.",
  "solution": "<p>A wins easy prompts \\(0.90&gt;0.855\\) and hard prompts \\(0.30&gt;0.28\\), but A&#x27;s overall accuracy is \\(120/200=0.60\\), below B&#x27;s \\(185/250=0.74\\). Under a common 50–50 difficulty mixture, A scores \\(0.5(0.90)+0.5(0.30)=0.60\\) and B scores \\(0.5(0.855)+0.5(0.28)=0.5675\\), restoring A&#x27;s within-group advantage. Different difficulty weights, not contradictory arithmetic, produced the reversal.</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Cumulative problem 9.** An evaluation has 20,000 turns from 200 conversations (100 turns each) with turn accuracy 0.8 and within-conversation correlation \\(\\rho=0.05\\). Compute the iid standard error, the design effect \\(1+(m-1)\\rho\\), the corrected standard error, and the effective sample size, and explain why the iid standard error is too small.",
  "plain": "The iid standard error is \\(\\sqrt{0.8(0.2)/20000}\\approx0.00283\\). The design effect is \\(1+99(0.05)=5.95\\), so the corrected standard error is \\(0.00283\\sqrt{5.95}\\approx0.0069\\), about 2.4 times larger, and the effective sample size is \\(20000/5.95\\approx3{,}361\\) turns. Turns within a conversation share history, so the rows carry less independent information than their count suggests. Resample or cluster at the conversation level, or the user level if users repeat.",
  "solution": "<p>The iid standard error is \\(\\sqrt{0.8(0.2)/20000}\\approx0.00283\\). The design effect is \\(1+99(0.05)=5.95\\), so the corrected standard error is \\(0.00283\\sqrt{5.95}\\approx0.0069\\), about 2.4 times larger, and the effective sample size is \\(20000/5.95\\approx3{,}361\\) turns. Turns within a conversation share history, so the rows carry less independent information than their count suggests. Resample or cluster at the conversation level, or the user level if users repeat.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Cumulative problem 10.** A request is long (\\(Z=1\\)) with probability 0.3. Given \\(Z\\), slow latency \\(X\\) and long output \\(Y\\) are independent binary variables with \\(P(X=1\\mid Z=0)=0.1\\), \\(P(Y=1\\mid Z=0)=0.2\\), \\(P(X=1\\mid Z=1)=0.7\\), and \\(P(Y=1\\mid Z=1)=0.9\\). Compute \\(P(X=1)\\), \\(P(Y=1)\\), \\(P(X=1,Y=1)\\), and \\(\\operatorname{Cov}(X,Y)\\) to show that \\(X\\) and \\(Y\\) are conditionally independent given \\(Z\\) but marginally dependent.",
  "plain": "\\(P(X=1)=0.7(0.1)+0.3(0.7)=0.28\\) and \\(P(Y=1)=0.7(0.2)+0.3(0.9)=0.41\\). By conditional independence, \\(P(X=1,Y=1)=0.7(0.1)(0.2)+0.3(0.7)(0.9)=0.014+0.189=0.203\\). The product of marginals is \\(0.28(0.41)=0.1148\\), so \\(\\operatorname{Cov}(X,Y)=0.203-0.1148=0.0882>0\\). Within each type the pair factorizes, but because both conditional means rise with \\(Z\\), the variables are dependent marginally.",
  "solution": "<p>\\(P(X=1)=0.7(0.1)+0.3(0.7)=0.28\\) and \\(P(Y=1)=0.7(0.2)+0.3(0.9)=0.41\\). By conditional independence, \\(P(X=1,Y=1)=0.7(0.1)(0.2)+0.3(0.7)(0.9)=0.014+0.189=0.203\\). The product of marginals is \\(0.28(0.41)=0.1148\\), so \\(\\operatorname{Cov}(X,Y)=0.203-0.1148=0.0882&gt;0\\). Within each type the pair factorizes, but because both conditional means rise with \\(Z\\), the variables are dependent marginally.</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Cumulative problem 11.** Create a three-variable binary joint PMF for which \\(X\\) and \\(Y\\) are independent marginally but dependent after conditioning on \\(Z=1\\). Verify all claims from the table.",
  "plain": "A collider construction works: draw independent fair bits \\(X,Y\\), and let \\(Z\\) indicate whether at least one is one. Marginally the inputs factorize; given \\(Z=1\\), the pair \\((0,0)\\) is removed and the remaining three pairs each have mass \\(1/3\\), which does not factorize.",
  "solution": "<p>A collider construction works: draw independent fair bits \\(X,Y\\), and let \\(Z\\) indicate whether at least one is one. Marginally the inputs factorize; given \\(Z=1\\), the pair \\((0,0)\\) is removed and the remaining three pairs each have mass \\(1/3\\), which does not factorize.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Cumulative problem 12.** Models A and B are scored on tasks T1, T2, T3 with 800, 150, and 50 rows. Per-task accuracies are A: \\((0.70,0.90,0.90)\\) and B: \\((0.75,0.80,0.80)\\); A's two seeds have overall scores 0.73 and 0.75, and B's have 0.75 and 0.77. Compute the row-weighted and task-equal accuracies of each model, the per-task winners, and compare the seed spread with the gap. State which checks reveal that the row-weighted leaderboard order is misleading for a task-balanced target.",
  "plain": "Row-weighted: A has \\((0.70\\cdot800+0.90\\cdot150+0.90\\cdot50)/1000=0.74\\) and B has \\(0.76\\), so B leads the leaderboard. Task-equal: A has \\((0.70+0.90+0.90)/3\\approx0.833\\) and B has \\(0.783\\), so A leads. B wins only T1, which dominates the rows; A wins T2 and T3. Each model's seed spread (0.02) equals the row-weighted gap (0.02), so that ranking is not stable across seeds. The checks that expose this are: per-task conditional accuracies, a comparison of row versus task weighting, paired per-task differences, and seed variation. Report the target weighting explicitly.",
  "solution": "<p>Row-weighted: A has \\((0.70\\cdot800+0.90\\cdot150+0.90\\cdot50)/1000=0.74\\) and B has \\(0.76\\), so B leads the leaderboard. Task-equal: A has \\((0.70+0.90+0.90)/3\\approx0.833\\) and B has \\(0.783\\), so A leads. B wins only T1, which dominates the rows; A wins T2 and T3. Each model&#x27;s seed spread (0.02) equals the row-weighted gap (0.02), so that ranking is not stable across seeds. The checks that expose this are: per-task conditional accuracies, a comparison of row versus task weighting, paired per-task differences, and seed variation. Report the target weighting explicitly.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** Does zero covariance imply independence?",
  "plain": "Only under additional assumptions, for example a jointly Gaussian pair. If X is symmetric about zero and Y=X², covariance can be zero despite dependence.",
  "solution": "<p>Only under additional assumptions, for example a jointly Gaussian pair. If X is symmetric about zero and Y=X², covariance can be zero despite dependence.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive total variance by adding and subtracting the conditional mean.",
  "plain": "Write Y−E[Y]=(Y−E[Y|X])+(E[Y|X]−E[Y]); the cross term vanishes after conditioning. Thus Var(Y)=E Var(Y|X)+Var E[Y|X].",
  "solution": "<p>Write Y−E[Y]=(Y−E[Y|X])+(E[Y|X]−E[Y]); the cross term vanishes after conditioning. Thus Var(Y)=E Var(Y|X)+Var E[Y|X].</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** For Bernoulli marginals P(X=1)=0.6 and P(Y=1)=0.7, find the largest possible covariance.",
  "plain": "Maximum joint mass is min(0.6,0.7)=0.6; subtract 0.42 to obtain 0.18.",
  "solution": "<p>Maximum joint mass is min(0.6,0.7)=0.6; subtract 0.42 to obtain 0.18.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.18
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-joint experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Can you identify a joint law from its two marginals?",
  "plain": "No. The dependence structure remains unspecified; for Bernoulli variables the joint success mass can range from max(0,p+q−1) to min(p,q).",
  "solution": "<p>No. The dependence structure remains unspecified; for Bernoulli variables the joint success mass can range from max(0,p+q−1) to min(p,q).</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Audit uncertainty for two model scores on the same tasks.",
  "plain": "Use paired differences and their variance, retaining within-task covariance. Report the target task distribution and cluster repeated measurements appropriately.",
  "solution": "<p>Use paired differences and their variance, retaining within-task covariance. Report the target task distribution and cluster repeated measurements appropriately.</p>"
}
});
