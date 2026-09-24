/* Authored probability solutions and offline checks. */
GU.answers("ps-05-limit-theorems-monte-carlo", {
A1: {
  "statement": "**A1 · Foundation · paper — Average mechanics.** Let iid observations have mean 12 and variance 25. Find the mean, variance, and standard error of \\(\\bar X_{100}\\). Recompute for \\(\\bar X_{400}\\).",
  "plain": "The mean remains 12. Variance is \\(25/n\\), giving \\(0.25\\) and \\(0.0625\\); standard errors are \\(0.5\\) and \\(0.25\\). Four times the data halves the standard error.",
  "solution": "<p>The mean remains 12. Variance is \\(25/n\\), giving \\(0.25\\) and \\(0.0625\\); standard errors are \\(0.5\\) and \\(0.25\\). Four times the data halves the standard error.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Standard errors at n=100 and n=400",
      "type": "vec",
      "ans": [
        0.5,
        0.25
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Convergence language.** For iid fair-coin flips with running proportion \\(\\hat p_n\\), translate the weak law and the strong law into plain language. Then show that neither law guarantees \\(|\\hat p_{1000}-0.5|\\le0.01\\) by computing the CLT approximation, with continuity correction, to \\(P(490\\le S_{1000}\\le510)\\).",
  "plain": "Weak law: for each fixed tolerance, the probability that \\(\\hat p_n\\) misses 0.5 by more than that tolerance goes to zero as \\(n\\) grows. Strong law: with probability one, the whole running-proportion path eventually stays inside any band around 0.5. Neither law gives a finite-\\(n\\) guarantee. \\(S_{1000}\\) has mean 500 and SD \\(\\sqrt{250}\\approx15.81\\), so \\(P(489.5\\le S\\le510.5)\\approx2\\Phi(10.5/15.81)-1\\approx0.493\\); the exact binomial value is also \\(0.493\\). Roughly half of all 1,000-flip experiments miss by more than 0.01.",
  "solution": "<p>Weak law: for each fixed tolerance, the probability that \\(\\hat p_n\\) misses 0.5 by more than that tolerance goes to zero as \\(n\\) grows. Strong law: with probability one, the whole running-proportion path eventually stays inside any band around 0.5.</p><p>Neither law gives a finite-\\(n\\) guarantee. \\(S_{1000}\\) has mean 500 and SD \\(\\sqrt{250}\\approx15.81\\), so \\(P(489.5\\le S\\le510.5)\\approx2\\Phi(10.5/15.81)-1\\approx0.493\\); the exact binomial value is also \\(0.493\\). Roughly half of all 1,000-flip experiments miss by more than 0.01.</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — Bernoulli sampling.** For \\(p=0.4,n=250\\), compute the mean and standard deviation of the success count and the sample proportion.",
  "plain": "The count has mean \\(100\\) and variance \\(60\\), hence standard deviation \\(\\sqrt{60}\\). The proportion has mean \\(0.4\\) and standard deviation \\(\\sqrt{0.4(0.6)/250}\\).",
  "solution": "<p>The count has mean \\(100\\) and variance \\(60\\), hence standard deviation \\(\\sqrt{60}\\). The proportion has mean \\(0.4\\) and standard deviation \\(\\sqrt{0.4(0.6)/250}\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Count mean and variance",
      "type": "vec",
      "ans": [
        100,
        60
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A4: {
  "statement": "**A4 · Foundation · paper — Markov and Chebyshev.** If \\(Y\\ge0\\) and \\(E[Y]=10\\), bound \\(P(Y\\ge25)\\) with Markov's inequality. If \\(E[Z]=0\\) and \\(\\operatorname{Var}(Z)=9\\), bound \\(P(|Z|\\ge6)\\) with Chebyshev's inequality. State why neither calculation identifies the true probability.",
  "plain": "Markov gives \\(P(Y\\ge25)\\le10/25=0.4\\). Chebyshev gives \\(P(|Z|\\ge6)\\le9/36=0.25\\). These are distribution-free ceilings under their moment assumptions; many different distributions share those moments and have different actual tail probabilities.",
  "solution": "<p>Markov gives \\(P(Y\\ge25)\\le10/25=0.4\\). Chebyshev gives \\(P(|Z|\\ge6)\\le9/36=0.25\\). These are distribution-free ceilings under their moment assumptions; many different distributions share those moments and have different actual tail probabilities.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Weak-law proof.** Prove convergence in probability for independent variables sharing mean \\(\\mu\\) whose variances are all at most \\(V\\).",
  "plain": "The average has expectation \\(\\mu\\) and variance at most \\(V/n\\) because independence removes covariance terms. Chebyshev bounds the deviation probability by \\(V/(n\\varepsilon^2)\\), which vanishes.",
  "solution": "<p>The average has expectation \\(\\mu\\) and variance at most \\(V/n\\) because independence removes covariance terms. Chebyshev bounds the deviation probability by \\(V/(n\\varepsilon^2)\\), which vanishes.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Continuity correction.** Approximate \\(P(S\\ge65)\\) for \\(S\\sim\\operatorname{Binomial}(100,0.5)\\) with and without a continuity correction; compare with an exact computation.",
  "plain": "\\(S\\) has mean 50 and SD 5. Without correction, \\(P(S\\ge65)\\approx1-\\Phi(3)=0.00135\\). With continuity correction the boundary is \\(64.5\\), so \\(1-\\Phi(2.9)=0.00187\\). The exact binomial tail \\(\\sum_{k\\ge65}\\binom{100}k2^{-100}\\) is \\(0.00176\\). The corrected approximation is within about 6%; the uncorrected one is 23% too small.",
  "solution": "<p>\\(S\\) has mean 50 and SD 5. Without correction, \\(P(S\\ge65)\\approx1-\\Phi(3)=0.00135\\). With continuity correction the boundary is \\(64.5\\), so \\(1-\\Phi(2.9)=0.00187\\).</p><p>The exact binomial tail \\(\\sum_{k\\ge65}\\binom{100}k2^{-100}\\) is \\(0.00176\\). The corrected approximation is within about 6%; the uncorrected one is 23% too small.</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Monte Carlo planning.** Derive a conservative draw count for estimating any Bernoulli probability with approximate 95% half-width at most \\(0.002\\).",
  "plain": "With multiplier \\(1.96\\) and worst-case variance \\(1/4\\), require \\(1.96\\sqrt{1/(4n)}\\le0.002\\), or \\(n\\ge1.96^2/(4\\cdot0.002^2)\\), approximately 240,100 independent draws.",
  "solution": "<p>With multiplier \\(1.96\\) and worst-case variance \\(1/4\\), require \\(1.96\\sqrt{1/(4n)}\\le0.002\\), or \\(n\\ge1.96^2/(4\\cdot0.002^2)\\), approximately 240,100 independent draws.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Concentration choice.** For \\(n=500\\) independent losses in \\([0,4]\\), bound \\(P(|\\bar X-E[X]|\\ge0.3)\\) using (a) Chebyshev with the largest variance permitted by the range and (b) two-sided Hoeffding. List the assumptions used by each.",
  "plain": "A variable in an interval of width four has variance at most \\(4\\). Therefore Chebyshev gives \\(4/[500(0.3)^2]\\approx0.0889\\). Two-sided Hoeffding gives \\(2\\exp[-2(500)(0.3)^2/4^2]\\approx0.00721\\). Chebyshev needs finite variance and independence or zero covariance to obtain the \\(1/n\\) mean variance; Hoeffding needs independent bounded observations but no variance value.",
  "solution": "<p>A variable in an interval of width four has variance at most \\(4\\). Therefore Chebyshev gives \\(4/[500(0.3)^2]\\approx0.0889\\). Two-sided Hoeffding gives \\(2\\exp[-2(500)(0.3)^2/4^2]\\approx0.00721\\). Chebyshev needs finite variance and independence or zero covariance to obtain the \\(1/n\\) mean variance; Hoeffding needs independent bounded observations but no variance value.</p>"
},
A9: {
  "statement": "**A9 · Core · paper — Paired evaluation.** On eight prompts, model A correctness is \\((1,1,0,1,0,1,1,0)\\) and B correctness is \\((1,0,0,1,1,0,1,0)\\). Compute the paired mean difference and standard error. Then compute the standard error obtained by incorrectly treating the two accuracy estimates as independent.",
  "plain": "Differences are \\((0,1,0,0,-1,1,0,0)\\), with mean \\(0.125\\), sample variance \\(2.875/7\\approx0.4107\\), and paired standard error \\(\\sqrt{0.4107/8}\\approx0.2266\\). The separate sample variances are about \\(0.2679\\) and \\(0.2857\\), giving an independence standard error \\(\\sqrt{(0.2679+0.2857)/8}\\approx0.2631\\). Treating paired scores as independent discards their positive prompt-level covariance.",
  "solution": "<p>Differences are \\((0,1,0,0,-1,1,0,0)\\), with mean \\(0.125\\), sample variance \\(2.875/7\\approx0.4107\\), and paired standard error \\(\\sqrt{0.4107/8}\\approx0.2266\\). The separate sample variances are about \\(0.2679\\) and \\(0.2857\\), giving an independence standard error \\(\\sqrt{(0.2679+0.2857)/8}\\approx0.2631\\). Treating paired scores as independent discards their positive prompt-level covariance.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Rare events.** Requests fail independently with probability \\(p=0.002\\), and \\(n=1000\\) requests are observed. Compute \\(P(S\\ge5)\\) exactly (binomial), with the Poisson\\((2)\\) approximation, with the continuity-corrected Gaussian approximation, and bound it with one-sided Hoeffding and Bernstein applied to \\(\\bar X\\ge0.005\\). Explain which numbers are approximations, exact probabilities, or guaranteed ceilings.",
  "plain": "Exact binomial: \\(P(S\\ge5)=0.0525\\). Poisson\\((2)\\): \\(0.0527\\), an excellent approximation because \\(np=2\\) with small \\(p\\). Gaussian with continuity correction: \\(1-\\Phi((4.5-2)/\\sqrt{1.996})=0.0384\\), about 27% too small, because the count is skewed. The ceilings, with \\(t=0.003\\): Hoeffding gives \\(\\exp(-2nt^2)=0.982\\), which is nearly vacuous because it uses only the range \\([0,1]\\). Bernstein gives \\(\\exp\\bigl(-nt^2/(2\\sigma^2+\\tfrac23t)\\bigr)=0.223\\) with \\(\\sigma^2=0.001996\\): valid and much better, but still four times the truth. Only the binomial number is the exact probability under the iid model. Poisson and Gaussian are approximations with no guarantee, and Hoeffding and Bernstein are guaranteed upper bounds that need not be close.",
  "solution": "<p>Exact binomial: \\(P(S\\ge5)=0.0525\\). Poisson\\((2)\\): \\(0.0527\\), an excellent approximation because \\(np=2\\) with small \\(p\\). Gaussian with continuity correction: \\(1-\\Phi((4.5-2)/\\sqrt{1.996})=0.0384\\), about 27% too small, because the count is skewed.</p><p>The ceilings, with \\(t=0.003\\): Hoeffding gives \\(\\exp(-2nt^2)=0.982\\), which is nearly vacuous because it uses only the range \\([0,1]\\). Bernstein gives \\(\\exp\\bigl(-nt^2/(2\\sigma^2+\\tfrac23t)\\bigr)=0.223\\) with \\(\\sigma^2=0.001996\\): valid and much better, but still four times the truth.</p><p>Only the binomial number is the exact probability under the iid model. Poisson and Gaussian are approximations with no guarantee, and Hoeffding and Bernstein are guaranteed upper bounds that need not be close.</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Heavy tails.** With NumPy `default_rng(0)`, simulate 500 datasets of size \\(n=100,1000,10000\\) from a Pareto distribution with \\(x_m=1\\), \\(\\alpha=1.5\\) (mean 3, infinite variance). For each \\(n\\), report the 5th, 50th and 95th percentiles across datasets of the sample mean, the 10% trimmed mean (trimming each tail), the median, and median-of-means with 10 groups, and state which population quantity each estimator targets.",
  "plain": "Targets: the mean targets 3; the 10% trimmed mean targets the population trimmed mean, about \\(1.880\\); the median targets \\(2^{1/1.5}\\approx1.587\\); median-of-means with a fixed 10 groups targets the median of the law of a group mean, which moves toward 3 as groups grow. 5th/50th/95th percentiles: at \\(n=100\\) the mean gives \\(2.12/2.70/4.65\\), the trimmed mean \\(1.67/1.89/2.15\\), the median \\(1.43/1.58/1.79\\), and MoM \\(1.93/2.31/2.92\\). At \\(n=1000\\): mean \\(2.54/2.86/3.68\\), trimmed \\(1.80/1.88/1.96\\), median \\(1.54/1.58/1.65\\), MoM \\(2.44/2.69/3.12\\). At \\(n=10000\\): mean \\(2.78/2.93/3.23\\), trimmed \\(1.86/1.88/1.90\\), median \\(1.57/1.59/1.61\\), MoM \\(2.73/2.86/3.04\\). The sample mean is unbiased for 3 but its typical value sits below 3, with a long right tail, and it narrows slowly (slower than \\(1/\\sqrt n\\)). The robust summaries are tight but estimate different quantities, so they are not substitutes when the mean is the decision-relevant target. Median-of-means sits in between, with a bias toward the typical group mean that shrinks as \\(n/10\\) grows.",
  "solution": "<p>Targets: the mean targets 3; the 10% trimmed mean targets the population trimmed mean, about \\(1.880\\); the median targets \\(2^{1/1.5}\\approx1.587\\); median-of-means with a fixed 10 groups targets the median of the law of a group mean, which moves toward 3 as groups grow.</p><p>5th/50th/95th percentiles: at \\(n=100\\) the mean gives \\(2.12/2.70/4.65\\), the trimmed mean \\(1.67/1.89/2.15\\), the median \\(1.43/1.58/1.79\\), and MoM \\(1.93/2.31/2.92\\). At \\(n=1000\\): mean \\(2.54/2.86/3.68\\), trimmed \\(1.80/1.88/1.96\\), median \\(1.54/1.58/1.65\\), MoM \\(2.44/2.69/3.12\\). At \\(n=10000\\): mean \\(2.78/2.93/3.23\\), trimmed \\(1.86/1.88/1.90\\), median \\(1.57/1.59/1.61\\), MoM \\(2.73/2.86/3.04\\).</p><p>The sample mean is unbiased for 3 but its typical value sits below 3, with a long right tail, and it narrows slowly (slower than \\(1/\\sqrt n\\)). The robust summaries are tight but estimate different quantities, so they are not substitutes when the mean is the decision-relevant target. Median-of-means sits in between, with a bias toward the typical group mean that shrinks as \\(n/10\\) grows.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Dependence.** With NumPy `default_rng(0)`, generate 2,000 stationary AR(1) sequences \\(x_t=\\phi x_{t-1}+\\varepsilon_t\\), \\(\\varepsilon_t\\sim N(0,1)\\), of length \\(n=1000\\) for each \\(\\phi\\in\\{0,0.5,0.9\\}\\). For each \\(\\phi\\), compare the empirical variance of the 2,000 sequence means with the average iid prediction \\(s^2/n\\), the average batch-means prediction (20 batches of 50), and the theoretical long-run value \\(1/((1-\\phi)^2n)\\).",
  "plain": "\\(\\phi=0\\): empirical \\(0.00102\\), iid \\(0.00100\\), batch means \\(0.00100\\), theory \\(0.00100\\); all agree. \\(\\phi=0.5\\): empirical \\(0.00398\\), iid \\(0.00133\\) (too small by a factor of 3), batch means \\(0.00388\\), theory \\(0.00400\\). \\(\\phi=0.9\\): empirical \\(0.0982\\), iid \\(0.0052\\) (too small by a factor of about 19), batch means \\(0.0797\\), theory \\(0.100\\). Batches of 50 are no longer long compared with the correlation time \\(1/(1-\\phi)=10\\), so batch means still under-cover somewhat; longer batches reduce this bias but leave fewer batches, so the variance estimate itself gets noisier.",
  "solution": "<p>\\(\\phi=0\\): empirical \\(0.00102\\), iid \\(0.00100\\), batch means \\(0.00100\\), theory \\(0.00100\\); all agree.</p><p>\\(\\phi=0.5\\): empirical \\(0.00398\\), iid \\(0.00133\\) (too small by a factor of 3), batch means \\(0.00388\\), theory \\(0.00400\\).</p><p>\\(\\phi=0.9\\): empirical \\(0.0982\\), iid \\(0.0052\\) (too small by a factor of about 19), batch means \\(0.0797\\), theory \\(0.100\\). Batches of 50 are no longer long compared with the correlation time \\(1/(1-\\phi)=10\\), so batch means still under-cover somewhat; longer batches reduce this bias but leave fewer batches, so the variance estimate itself gets noisier.</p>"
},
A13: {
  "statement": "**A13 · Stretch · paper — Hierarchical benchmark.** A benchmark has 4 domains × 10 tasks per domain × 20 prompts per task, and each prompt is run 3 times. A variance-components fit gives domain variance 0.004, task variance 0.01, prompt variance 0.04 and run-noise variance 0.02 for the per-run score. Write the grand-mean estimator, and compute its standard error when generalizing to (a) new domains, (b) new tasks in these domains, (c) new prompts in these tasks, and (d) new runs on these prompts only. State the population each conclusion covers.",
  "plain": "The estimator is the average of all \\(4\\times10\\times20\\times3=2400\\) runs. Its variance adds one term per sampled level: \\(0.004/4+0.01/40+0.04/800+0.02/2400\\). (a) All four terms: SE \\(\\approx0.0362\\); this generalizes to new domains, tasks, prompts and runs. (b) Treat domains as fixed and drop \\(0.004/4\\): SE \\(\\approx0.0176\\), for new tasks drawn from these four domains. (c) Treat tasks as fixed too: SE \\(\\approx0.0076\\), for new prompts within these 40 tasks. (d) Only run noise remains: SE \\(\\approx0.0029\\), for rerunning these exact 800 prompts. Reporting (d) as if it were (a) understates uncertainty by a factor of 12. Keep the pairing across models at each level, and resample or aggregate at the level named in the claim.",
  "solution": "<p>The estimator is the average of all \\(4\\times10\\times20\\times3=2400\\) runs. Its variance adds one term per sampled level: \\(0.004/4+0.01/40+0.04/800+0.02/2400\\).</p><p>(a) All four terms: SE \\(\\approx0.0362\\); this generalizes to new domains, tasks, prompts and runs. (b) Treat domains as fixed and drop \\(0.004/4\\): SE \\(\\approx0.0176\\), for new tasks drawn from these four domains. (c) Treat tasks as fixed too: SE \\(\\approx0.0076\\), for new prompts within these 40 tasks. (d) Only run noise remains: SE \\(\\approx0.0029\\), for rerunning these exact 800 prompts.</p><p>Reporting (d) as if it were (a) understates uncertainty by a factor of 12. Keep the pairing across models at each level, and resample or aggregate at the level named in the claim.</p>"
},
A14: {
  "statement": "**A14 · Stretch · paper — Research critique.** A paper reports token-level accuracy \\(0.832\\) over \\(2{,}000{,}000\\) tokens with the row-iid standard error \\(\\sqrt{0.832\\cdot0.168/n}\\), but the tokens come from only 50 documents whose per-document accuracies have standard deviation 0.06. Compute the naive and document-level standard errors, the design effect and the effective sample size, and rewrite the claim conservatively.",
  "plain": "Naive SE: \\(\\sqrt{0.832\\times0.168/2\\times10^6}\\approx0.00026\\). Treating documents as the independent units (equal document weights), the SE is \\(0.06/\\sqrt{50}\\approx0.0085\\), about 32 times larger. The design effect is \\((0.0085/0.00026)^2\\approx1030\\), so 2 million tokens carry roughly the information of \\(2\\times10^6/1030\\approx1900\\) independent tokens. Conservative claim: “Across 50 documents, mean accuracy is 0.832 (document-level SE 0.0085, so a 95% interval of roughly 0.815–0.849). The result describes documents like these 50; token count does not add independent evidence beyond the documents.”",
  "solution": "<p>Naive SE: \\(\\sqrt{0.832\\times0.168/2\\times10^6}\\approx0.00026\\). Treating documents as the independent units (equal document weights), the SE is \\(0.06/\\sqrt{50}\\approx0.0085\\), about 32 times larger.</p><p>The design effect is \\((0.0085/0.00026)^2\\approx1030\\), so 2 million tokens carry roughly the information of \\(2\\times10^6/1030\\approx1900\\) independent tokens.</p><p>Conservative claim: “Across 50 documents, mean accuracy is 0.832 (document-level SE 0.0085, so a 95% interval of roughly 0.815–0.849). The result describes documents like these 50; token count does not add independent evidence beyond the documents.”</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** What does the central limit theorem approximate?",
  "plain": "Under its assumptions it approximates the distribution of a centered, scaled sample mean, not the distribution of individual observations or a deterministic finite-sample error bound.",
  "solution": "<p>Under its assumptions it approximates the distribution of a centered, scaled sample mean, not the distribution of individual observations or a deterministic finite-sample error bound.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the variance of the average of n identically distributed variables with variance v and common pairwise correlation rho.",
  "plain": "Expand the covariance sum to obtain v[1+(n−1)rho]/n.",
  "solution": "<p>Expand the covariance sum to obtain v[1+(n−1)rho]/n.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** For 100 independent Bernoulli(0.5) observations, find the standard error of the mean.",
  "plain": "sqrt(0.25/100)=0.05.",
  "solution": "<p>sqrt(0.25/100)=0.05.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.05
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-limits experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does multiplying a correlated dataset’s row count by ten necessarily reduce its standard error by sqrt(10)?",
  "plain": "No. The covariance sum, or effective number of independent units, governs uncertainty. Shared randomness can leave a nonzero variance floor.",
  "solution": "<p>No. The covariance sum, or effective number of independent units, governs uncertainty. Shared randomness can leave a nonzero variance floor.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Compare two Monte Carlo estimators for a fixed compute budget.",
  "plain": "Use independent replicate runs, analytic targets when available, measured bias and variance, and runtime. Record sampling assumptions and failure under heavy tails or dependence.",
  "solution": "<p>Use independent replicate runs, analytic targets when available, measured bias and variance, and runtime. Record sampling assumptions and failure under heavy tails or dependence.</p>"
}
});
