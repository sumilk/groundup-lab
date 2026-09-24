/* Authored probability solutions and offline checks. */
GU.answers("ps-07-hypothesis-testing-confidence-power", {
A1: {
  "statement": "**A1 · Foundation · paper — Testing language.** A new model and baseline are scored on the same 200 prompts using a prespecified binary success rubric; the claim is that the new model improves success probability by more than 3 percentage points on fresh prompts from the deployment distribution. Identify the population, sampling unit, estimand, null, alternative, statistic, rejection rule, and possible decisions. State what changes if the 200 prompts are the complete target rather than a sample.",
  "plain": "Let \\(D_i=Y_{i,\\mathrm{new}}-Y_{i,\\mathrm{base}}\\). For fresh deployment prompts, \\(\\Delta=E[D_i]\\), with \\(H_0:\\Delta\\le0.03\\) versus \\(H_1:\\Delta>0.03\\); the prompt is the paired sampling unit. A statistic such as \\(\\bar D\\) and a prespecified level-\\(\\alpha\\) paired rule produce reject/do-not-reject decisions. If these 200 prompts are the whole target, \\(\\bar D\\) is the finite-population effect and prompt-sampling inference is unnecessary, though model-run or rater randomness may remain.",
  "solution": "<p>Let \\(D_i=Y_{i,\\mathrm{new}}-Y_{i,\\mathrm{base}}\\). For fresh deployment prompts, \\(\\Delta=E[D_i]\\), with \\(H_0:\\Delta\\le0.03\\) versus \\(H_1:\\Delta&gt;0.03\\); the prompt is the paired sampling unit. A statistic such as \\(\\bar D\\) and a prespecified level-\\(\\alpha\\) paired rule produce reject/do-not-reject decisions. If these 200 prompts are the whole target, \\(\\bar D\\) is the finite-population effect and prompt-sampling inference is unnecessary, though model-run or rater randomness may remain.</p>"
},
A2: {
  "statement": "**A2 · Foundation · paper — Exact tail.** For \\(S=7\\) successes in \\(n=8\\) trials under \\(H_0:p=0.5\\), enumerate \\(P(S=k)\\) for \\(k=0,\\ldots,8\\). Compute left-tail, right-tail, and doubled-smaller-tail p-values and note why \"two-sided\" needs a convention.",
  "plain": "List \\(P_{p_0}(S=k)=\\binom nkp_0^k(1-p_0)^{n-k}\\). Sum the outcomes selected by each tail rule. State the exact definition used for “two-sided.”",
  "solution": "<p>List \\(P_{p_0}(S=k)=\\binom nkp_0^k(1-p_0)^{n-k}\\). Sum the outcomes selected by each tail rule. State the exact definition used for “two-sided.”</p>",
  "fields": [
    {
      "id": "value",
      "label": "Left-tail; right-tail; doubled-smaller-tail p-values",
      "type": "vec",
      "ans": [
        0.99609375,
        0.03515625,
        0.0703125
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — Error table.** A one-sided \\(z\\) test of \\(H_0:\\delta=0\\) has \\(\\alpha=0.05\\) and power 0.80 at \\(\\delta=0.5\\). Fill the four cells formed by truth (\\(\\delta=0\\) or \\(\\delta=0.5\\)) and decision (reject or not), give each cell's conditional probability, and label Type I error, Type II error, power, and correct non-rejection.",
  "plain": "Under \\(\\delta=0\\): reject with probability 0.05 (Type I error) and do not reject with probability 0.95 (correct non-rejection). Under \\(\\delta=0.5\\): reject with probability 0.80 (power, a correct rejection) and do not reject with probability 0.20 (Type II error). Each row sums to 1 because the probabilities condition on the truth; they are not probabilities that the null is true given the decision.",
  "solution": "<p>Under \\(\\delta=0\\): reject with probability 0.05 (Type I error) and do not reject with probability 0.95 (correct non-rejection). Under \\(\\delta=0.5\\): reject with probability 0.80 (power, a correct rejection) and do not reject with probability 0.20 (Type II error). Each row sums to 1 because the probabilities condition on the truth; they are not probabilities that the null is true given the decision.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Type I error; correct non-rejection; power; Type II error",
      "type": "vec",
      "ans": [
        0.05,
        0.95,
        0.8,
        0.2
      ]
    }
  ],
  "hints": {
    "value": "Condition on the truth: each row of the table sums to 1."
  }
},
A4: {
  "statement": "**A4 · Foundation · paper — Interval interpretation.** From 400 prompts, a model's accuracy has 95% confidence interval \\([0.62,0.70]\\). Correct each claim: (a) there is a 95% probability the true accuracy is in \\([0.62,0.70]\\); (b) 95% of prompts have accuracy between 0.62 and 0.70; (c) a repeat study would give an estimate in this interval with probability 0.95; (d) values just outside, like 0.71, are ruled out; (e) the interval also covers the model's accuracy on a different deployment domain.",
  "plain": "(a) The realized interval either contains the fixed accuracy or not; 95% describes the procedure over repeated samples. (b) The interval is for the mean accuracy, not for individual prompts, which are 0 or 1. (c) A replicate estimate falls in the original interval with probability below 0.95 (about 83% for two independent equal-precision studies), because both estimates vary. (d) 0.71 is merely rejected at the 5% level; values near the boundary are only slightly less compatible than 0.70. (e) Coverage applies to the sampled prompt population only; another domain was never sampled.",
  "solution": "<p>(a) The realized interval either contains the fixed accuracy or not; 95% describes the procedure over repeated samples. (b) The interval is for the mean accuracy, not for individual prompts, which are 0 or 1. (c) A replicate estimate falls in the original interval with probability below 0.95 (about 83% for two independent equal-precision studies), because both estimates vary. (d) 0.71 is merely rejected at the 5% level; values near the boundary are only slightly less compatible than 0.70. (e) Coverage applies to the sampled prompt population only; another domain was never sampled.</p>"
},
A5: {
  "statement": "**A5 · Foundation · paper — Multiplicity arithmetic.** At family level \\(\\alpha=0.05\\), compute Bonferroni thresholds and, under independent true nulls with unadjusted per-test level 0.05, the probability of at least one false rejection for \\(m=5,20,100\\).",
  "plain": "Bonferroni cutoffs are 0.01, 0.0025, and 0.0005. Unadjusted independent-family false-rejection probabilities are \\(1-0.95^m\\): approximately 0.226, 0.642, and 0.994 for \\(m=5,20,100\\).",
  "solution": "<p>Bonferroni cutoffs are 0.01, 0.0025, and 0.0005. Unadjusted independent-family false-rejection probabilities are \\(1-0.95^m\\): approximately 0.226, 0.642, and 0.994 for \\(m=5,20,100\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Bonferroni cutoffs for m=5,20,100",
      "type": "vec",
      "ans": [
        0.01,
        0.0025,
        0.0005
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A6: {
  "statement": "**A6 · Core · paper — Test inversion.** For \\(s=14,n=20\\), construct a 95% equal-tailed exact binomial interval numerically by finding parameter values whose tail tests just cease to reject. Compare it with the Wald interval and check coverage by simulation at \\(p=0.1,0.5,0.9\\).",
  "plain": "The equal-tailed exact (Clopper–Pearson) interval for \\(s=14,n=20\\) solves \\(P_p(S\\ge14)=0.025\\) and \\(P_p(S\\le14)=0.025\\), giving \\([0.457,0.881]\\) (the Beta\\((14,7)\\) 0.025 quantile and Beta\\((15,6)\\) 0.975 quantile). The Wald interval is \\(0.7\\pm1.96\\sqrt{0.21/20}=[0.499,0.901]\\): shorter on the left and symmetric. Exact coverage at \\(n=20\\) (sum of binomial probabilities of counts whose interval contains \\(p\\)) is: Wald 0.876, 0.959, 0.876 and Clopper–Pearson 0.989, 0.959, 0.989 at \\(p=0.1,0.5,0.9\\). A simulation should reproduce these to Monte Carlo error. Wald undercovers near the boundaries; the exact interval is conservative.",
  "solution": "<p>The equal-tailed exact (Clopper–Pearson) interval for \\(s=14,n=20\\) solves \\(P_p(S\\ge14)=0.025\\) and \\(P_p(S\\le14)=0.025\\), giving \\([0.457,0.881]\\) (the Beta\\((14,7)\\) 0.025 quantile and Beta\\((15,6)\\) 0.975 quantile). The Wald interval is \\(0.7\\pm1.96\\sqrt{0.21/20}=[0.499,0.901]\\): shorter on the left and symmetric. Exact coverage at \\(n=20\\) (sum of binomial probabilities of counts whose interval contains \\(p\\)) is: Wald 0.876, 0.959, 0.876 and Clopper–Pearson 0.989, 0.959, 0.989 at \\(p=0.1,0.5,0.9\\). A simulation should reproduce these to Monte Carlo error. Wald undercovers near the boundaries; the exact interval is conservative.</p>",
  "fields": [
    {
      "id": "value",
      "label": "exact lower; exact upper endpoint",
      "type": "vec",
      "ans": [
        0.45721081772371086,
        0.8810684095942722
      ]
    }
  ],
  "hints": {
    "value": "Bisect on p for each tail probability equal to 0.025, or use Beta quantiles: Beta(s, n−s+1) at 0.025 and Beta(s+1, n−s) at 0.975."
  }
},
A7: {
  "statement": "**A7 · Core · paper — Paired comparison.** For paired score differences \\(d=(1,2,-1,0,3,1,-2,2)\\), calculate the mean, standard error, t statistic, 95% t interval, and interpretation. Then incorrectly treat the two systems as independent and explain what covariance information was discarded.",
  "plain": "Here \\(\\bar d=0.75\\), \\(s_d^2=19.5/7\\approx2.786\\), \\(\\operatorname{SE}\\approx0.590\\), and \\(t\\approx1.27\\) on 7 degrees of freedom. With \\(t_{.975,7}\\approx2.365\\), the interval is about \\([-0.645,2.145]\\): inconclusive about the population mean difference. An independent analysis discards the within-prompt covariance that pairing was designed to exploit.",
  "solution": "<p>Here \\(\\bar d=0.75\\), \\(s_d^2=19.5/7\\approx2.786\\), \\(\\operatorname{SE}\\approx0.590\\), and \\(t\\approx1.27\\) on 7 degrees of freedom. With \\(t_{.975,7}\\approx2.365\\), the interval is about \\([-0.645,2.145]\\): inconclusive about the population mean difference. An independent analysis discards the within-prompt covariance that pairing was designed to exploit.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Effect and decision.** A measured accuracy gain is 0.018 with 95% interval \\([0.004,0.032]\\). Evaluate both \\(H_0:\\Delta=0\\) and a deployment requirement \\(\\Delta\\ge0.03\\). State separately what the data establish statistically and operationally.",
  "plain": "The interval excludes zero, so a conventional two-sided zero-effect test rejects at 5%. But it includes effects far below 0.03 and is not wholly above the deployment threshold; the evidence does not establish that the gain is large enough to deploy.",
  "solution": "<p>The interval excludes zero, so a conventional two-sided zero-effect test rejects at 5%. But it includes effects far below 0.03 and is not wholly above the deployment threshold; the evidence does not establish that the gain is large enough to deploy.</p>"
},
A9: {
  "statement": "**A9 · Core · paper — Power curve.** For \\(S\\sim\\operatorname{Binomial}(20,p)\\), fix the rejection region \\(S\\ge15\\), chosen before seeing data. Calculate power at \\(p=0.5,0.6,0.7,0.8\\) and explain its shape.",
  "plain": "Power is \\(P_p(S\\ge15)=\\sum_{k=15}^{20}\\binom{20}{k}p^k(1-p)^{20-k}\\): 0.021 at \\(p=0.5\\) (the size), 0.126 at 0.6, 0.416 at 0.7, and 0.804 at 0.8. The curve is increasing and S-shaped: near the null the region is hard to reach, the steepest rise is where the expected count \\(20p\\) crosses the cutoff 15, and it approaches 1 as \\(p\\to1\\).",
  "solution": "<p>Power is \\(P_p(S\\ge15)=\\sum_{k=15}^{20}\\binom{20}{k}p^k(1-p)^{20-k}\\): 0.021 at \\(p=0.5\\) (the size), 0.126 at 0.6, 0.416 at 0.7, and 0.804 at 0.8. The curve is increasing and S-shaped: near the null the region is hard to reach, the steepest rise is where the expected count \\(20p\\) crosses the cutoff 15, and it approaches 1 as \\(p\\to1\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "power at p=0.5, 0.6, 0.7, 0.8",
      "type": "vec",
      "ans": [
        0.020694732666015625,
        0.12559897272303744,
        0.41637082944748116,
        0.8042077854595495
      ]
    }
  ],
  "hints": {
    "value": "Sum the binomial probabilities for S=15,...,20 at each p."
  }
},
A10: {
  "statement": "**A10 · Core · paper — Likelihood ratio.** For \\(s=14,n=20\\), compare \\(H_0:p=0.5\\) with unrestricted \\(p\\). Calculate both fitted log-likelihoods, derive \\(-2\\log\\Lambda\\), and compare asymptotic and exact-binomial calibrations.",
  "plain": "Unrestricted: \\(\\hat p=0.7\\), \\(\\ell(0.7)=14\\log0.7+6\\log0.3\\approx-12.217\\). Restricted: \\(\\ell(0.5)=20\\log0.5\\approx-13.863\\). So \\(-2\\log\\Lambda=2(1.646)\\approx3.29\\). Against \\(\\chi^2_1\\) the p-value is about 0.070. The exact doubled-tail binomial p-value, \\(2P(S\\ge14)\\approx0.115\\), is larger: the asymptotic approximation is somewhat anti-conservative at \\(n=20\\), and the exact calculation is available in this finite model.",
  "solution": "<p>Unrestricted: \\(\\hat p=0.7\\), \\(\\ell(0.7)=14\\log0.7+6\\log0.3\\approx-12.217\\). Restricted: \\(\\ell(0.5)=20\\log0.5\\approx-13.863\\). So \\(-2\\log\\Lambda=2(1.646)\\approx3.29\\). Against \\(\\chi^2_1\\) the p-value is about 0.070. The exact doubled-tail binomial p-value, \\(2P(S\\ge14)\\approx0.115\\), is larger: the asymptotic approximation is somewhat anti-conservative at \\(n=20\\), and the exact calculation is available in this finite model.</p>",
  "fields": [
    {
      "id": "value",
      "label": "−2 log Λ; chi-square p-value",
      "type": "vec",
      "ans": [
        3.2913151402020695,
        0.06964721587082164
      ]
    }
  ],
  "hints": {
    "value": "Evaluate 14 log p + 6 log(1−p) at p=0.7 and p=0.5, double the difference, then use the chi-square(1) upper tail."
  }
},
A11: {
  "statement": "**A11 · Core · paper — Stepwise correction.** At level \\(0.05\\), apply Bonferroni, Holm, and BH to \\((0.003,0.012,0.018,0.041,0.20)\\). Give each rejection set and name the error criterion targeted.",
  "plain": "Bonferroni's 0.01 cutoff rejects only 0.003. Holm compares with 0.01, 0.0125, 0.0167, ... and rejects 0.003 and 0.012 before stopping. BH has rank cutoffs 0.01, 0.02, 0.03, 0.04, 0.05; the largest passing rank is 3, so it rejects 0.003, 0.012, and 0.018. Bonferroni and Holm control FWER; BH controls FDR under its stated dependence conditions.",
  "solution": "<p>Bonferroni&#x27;s 0.01 cutoff rejects only 0.003. Holm compares with 0.01, 0.0125, 0.0167, ... and rejects 0.003 and 0.012 before stopping. BH has rank cutoffs 0.01, 0.02, 0.03, 0.04, 0.05; the largest passing rank is 3, so it rejects 0.003, 0.012, and 0.018. Bonferroni and Holm control FWER; BH controls FDR under its stated dependence conditions.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Discrete calibration.** For the one-sided exact test of \\(H_0:p=0.5\\) that rejects for large \\(S\\sim\\operatorname{Binomial}(n,0.5)\\), find for each \\(n=10,11,\\ldots,20\\) the smallest cutoff \\(c\\) with \\(P(S\\ge c)\\le0.05\\) and the exact size. Explain why attainable sizes jump.",
  "plain": "Cutoffs and exact sizes: \\(n=10\\): \\(c=9\\), 0.0107; 11: 9, 0.0327; 12: 10, 0.0193; 13: 10, 0.0461; 14: 11, 0.0287; 15: 12, 0.0176; 16: 12, 0.0384; 17: 13, 0.0245; 18: 13, 0.0481; 19: 14, 0.0318; 20: 15, 0.0207. The statistic takes only \\(n+1\\) values, so the attainable sizes form a finite set; moving the cutoff by one count changes the size by a whole point mass. The size is not monotone in \\(n\\) (for example it drops from 0.0461 at \\(n=13\\) to 0.0287 at \\(n=14\\)). Only a randomized test attains exactly 0.05.",
  "solution": "<p>Cutoffs and exact sizes: \\(n=10\\): \\(c=9\\), 0.0107; 11: 9, 0.0327; 12: 10, 0.0193; 13: 10, 0.0461; 14: 11, 0.0287; 15: 12, 0.0176; 16: 12, 0.0384; 17: 13, 0.0245; 18: 13, 0.0481; 19: 14, 0.0318; 20: 15, 0.0207. The statistic takes only \\(n+1\\) values, so the attainable sizes form a finite set; moving the cutoff by one count changes the size by a whole point mass. The size is not monotone in \\(n\\) (for example it drops from 0.0461 at \\(n=13\\) to 0.0287 at \\(n=14\\)). Only a randomized test attains exactly 0.05.</p>",
  "fields": [
    {
      "id": "value",
      "label": "exact size at n=10, 13, 20",
      "type": "vec",
      "ans": [
        0.0107421875,
        0.046142578125,
        0.020694732666015625
      ]
    }
  ],
  "hints": {
    "value": "For each n, add upper-tail binomial probabilities until the next one would push the total above 0.05."
  }
},
A13: {
  "statement": "**A13 · Stretch · paper — Clustered benchmark.** Simulate 30 tasks with 20 prompts each, score \\(y=u_{\\text{task}}+e\\) with total variance 1, true mean 0, and within-task correlation \\(\\rho\\in\\{0,0.1,0.3\\}\\). Over 2,000 repetitions (seed 2026), report the coverage of the row-iid 95% interval and of the task-level \\(t\\) interval on the 30 task means, and compare the SE ratio with \\(\\sqrt{1+(m-1)\\rho}\\).",
  "plain": "A numpy default_rng(2026) run gave row-iid coverage 0.957, 0.759, 0.547 and task-level coverage 0.955, 0.947, 0.956 for \\(\\rho=0,0.1,0.3\\). The average ratio of task-level to row-iid SE was 0.99, 1.69, 2.57, matching \\(\\sqrt{1+19\\rho}=1,1.70,2.59\\). Positive within-task correlation makes 600 rows carry roughly the information of \\(600/(1+19\\rho)\\) independent ones; row-iid intervals become too narrow while the task-level interval reflects the 30 independent tasks.",
  "solution": "<p>A numpy default_rng(2026) run gave row-iid coverage 0.957, 0.759, 0.547 and task-level coverage 0.955, 0.947, 0.956 for \\(\\rho=0,0.1,0.3\\). The average ratio of task-level to row-iid SE was 0.99, 1.69, 2.57, matching \\(\\sqrt{1+19\\rho}=1,1.70,2.59\\). Positive within-task correlation makes 600 rows carry roughly the information of \\(600/(1+19\\rho)\\) independent ones; row-iid intervals become too narrow while the task-level interval reflects the 30 independent tasks.</p>",
  "fields": [
    {
      "id": "value",
      "label": "design-effect SE factor at ρ=0.1, 0.3",
      "type": "vec",
      "ans": [
        1.7029386365926402,
        2.588435821108957
      ]
    }
  ],
  "hints": {
    "value": "Compute sqrt(1+(m−1)ρ) with m=20."
  }
},
A14: {
  "statement": "**A14 · Stretch · paper — Seeds and items.** A model is trained with \\(S=5\\) seeds and each run is scored on the same \\(I=200\\) items, with \\(y_{si}=\\mu+a_s+b_i+e_{si}\\), \\(\\operatorname{sd}(a)=0.03\\), \\(\\operatorname{sd}(b)=0.2\\), \\(\\operatorname{sd}(e)=0.1\\). State two estimands (new items with these five seeds fixed; new seeds and new items) and compute the standard error of the grand mean for each.",
  "plain": "Estimand A conditions on the five trained runs and generalizes over items: \\(\\operatorname{Var}=\\sigma_b^2/I+\\sigma_e^2/(SI)=0.04/200+0.01/1000=0.00021\\), SE \\(\\approx0.0145\\). Estimand B generalizes over training reruns and items: add \\(\\sigma_a^2/S=0.0009/5=0.00018\\), so \\(\\operatorname{Var}=0.00039\\), SE \\(\\approx0.0197\\). Flattening all 1,000 cells into iid rows would give about \\(\\sqrt{0.0509/1000}\\approx0.0071\\), too small for both, because it ignores that items and seeds are each shared across many cells.",
  "solution": "<p>Estimand A conditions on the five trained runs and generalizes over items: \\(\\operatorname{Var}=\\sigma_b^2/I+\\sigma_e^2/(SI)=0.04/200+0.01/1000=0.00021\\), SE \\(\\approx0.0145\\). Estimand B generalizes over training reruns and items: add \\(\\sigma_a^2/S=0.0009/5=0.00018\\), so \\(\\operatorname{Var}=0.00039\\), SE \\(\\approx0.0197\\). Flattening all 1,000 cells into iid rows would give about \\(\\sqrt{0.0509/1000}\\approx0.0071\\), too small for both, because it ignores that items and seeds are each shared across many cells.</p>",
  "fields": [
    {
      "id": "value",
      "label": "SE for fixed seeds; SE for new seeds and items",
      "type": "vec",
      "ans": [
        0.014491376746189439,
        0.019748417658131498
      ]
    }
  ],
  "hints": {
    "value": "Each random factor contributes its variance divided by its number of levels; the fixed-seed estimand omits the seed term."
  }
},
A15: {
  "statement": "**A15 · Stretch · paper — Optional stopping.** Under a true null, draw standard-normal observations and look after every 10, rejecting at the first look with \\(|z|>1.96\\). With a maximum of \\(K\\in\\{1,2,5,10,20\\}\\) looks and 10,000 repetitions (seed 0), report the false-rejection probability for each \\(K\\).",
  "plain": "A numpy default_rng(0) run gave false-rejection probabilities 0.051, 0.081, 0.141, 0.194, and 0.247 for \\(K=1,2,5,10,20\\). Each look is another chance to cross the fixed boundary, and by the law of the iterated logarithm the probability approaches 1 as looks continue indefinitely. Group-sequential or always-valid boundaries budget the error across looks instead.",
  "solution": "<p>A numpy default_rng(0) run gave false-rejection probabilities 0.051, 0.081, 0.141, 0.194, and 0.247 for \\(K=1,2,5,10,20\\). Each look is another chance to cross the fixed boundary, and by the law of the iterated logarithm the probability approaches 1 as looks continue indefinitely. Group-sequential or always-valid boundaries budget the error across looks instead.</p>"
},
A16: {
  "statement": "**A16 · Stretch · paper — Hidden multiplicity.** A workflow computes 60 null \\(z\\) statistics (4 metrics × 5 checkpoints × 3 subgroups) and reports the most significant as a single test at 5%. With 20,000 repetitions (seed 0), estimate the workflow's actual false-rejection probability when the statistics are independent and when they are equicorrelated with \\(\\rho=0.3\\), and compare with the advertised 0.05.",
  "plain": "Independent: exactly \\(1-0.95^{60}\\approx0.954\\); a numpy default_rng(0) run gave 0.955. Equicorrelated at 0.3: about 0.846. Correlation reduces the effective number of independent chances but the error is still far above the advertised 0.05. Valid calibration must resimulate the whole selection (for example, the null distribution of \\(\\max|z|\\)) or apply a family-wise correction.",
  "solution": "<p>Independent: exactly \\(1-0.95^{60}\\approx0.954\\); a numpy default_rng(0) run gave 0.955. Equicorrelated at 0.3: about 0.846. Correlation reduces the effective number of independent chances but the error is still far above the advertised 0.05. Valid calibration must resimulate the whole selection (for example, the null distribution of \\(\\max|z|\\)) or apply a family-wise correction.</p>",
  "fields": [
    {
      "id": "value",
      "label": "exact false-rejection probability, independent case",
      "type": "num",
      "ans": 0.953930201013048
    }
  ],
  "hints": {
    "value": "The chance that none of 60 independent null tests rejects is 0.95^60."
  }
},
A17: {
  "statement": "**A17 · Stretch · paper — Research audit.** A report says: “Model B beats model A at coding: 71.3% vs 68.9% on 1,200 prompts from 40 tasks (\\(p=0.01\\), two-proportion \\(z\\) test); B's checkpoint was chosen on this test set; this was the best of 6 metrics.” Assume within-task ICC 0.1. Reconstruct the population, sampling units, selection path, test family, practical threshold, and unsupported extrapolations, and recompute the evidence after a design-effect and Bonferroni adjustment.",
  "plain": "The sampled population is prompts from these 40 tasks; the independent units are closer to tasks than prompts, and the comparison is paired (same prompts), which the two-proportion test ignores. With 30 prompts per task and ICC 0.1, the design effect is \\(1+29(0.1)=3.9\\), so \\(z\\approx2.58\\) shrinks to about \\(2.58/\\sqrt{3.9}\\approx1.30\\) (two-sided \\(p\\approx0.19\\)). Choosing the metric from 6 multiplies the evidence requirement: even the original \\(p=0.01\\) becomes 0.06 after Bonferroni. Choosing the checkpoint on the test set makes 71.3% optimistic. No practical threshold is stated for a 2.4-point gain, and “better at coding” extrapolates beyond the 40 tasks. The claim needs a fresh test set, a task-clustered paired analysis, and a single prespecified metric.",
  "solution": "<p>The sampled population is prompts from these 40 tasks; the independent units are closer to tasks than prompts, and the comparison is paired (same prompts), which the two-proportion test ignores. With 30 prompts per task and ICC 0.1, the design effect is \\(1+29(0.1)=3.9\\), so \\(z\\approx2.58\\) shrinks to about \\(2.58/\\sqrt{3.9}\\approx1.30\\) (two-sided \\(p\\approx0.19\\)). Choosing the metric from 6 multiplies the evidence requirement: even the original \\(p=0.01\\) becomes 0.06 after Bonferroni. Choosing the checkpoint on the test set makes 71.3% optimistic. No practical threshold is stated for a 2.4-point gain, and “better at coding” extrapolates beyond the 40 tasks. The claim needs a fresh test set, a task-clustered paired analysis, and a single prespecified metric.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** Is a p-value the probability that the null hypothesis is true?",
  "plain": "No. It is a null-calibrated tail probability or more general super-uniform test statistic. A posterior hypothesis probability requires additional modeling and priors.",
  "solution": "<p>No. It is a null-calibrated tail probability or more general super-uniform test statistic. A posterior hypothesis probability requires additional modeling and priors.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Explain test inversion for a confidence set.",
  "plain": "Include each parameter value whose level-alpha test is not rejected. Under the test’s assumptions, the probability that the true value is excluded is at most alpha.",
  "solution": "<p>Include each parameter value whose level-alpha test is not rejected. Under the test’s assumptions, the probability that the true value is excluded is at most alpha.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** An exact one-sided test of p≤0.5 with five Bernoulli trials rejects only for five successes. Find its null size.",
  "plain": "The largest rejection probability under the null occurs at p=0.5: (0.5)^5=0.03125.",
  "solution": "<p>The largest rejection probability under the null occurs at p=0.5: (0.5)^5=0.03125.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.03125
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-testing experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Can a nonsignificant result establish equivalence?",
  "plain": "No. Low power can also produce nonsignificance. Equivalence requires a prespecified practical margin and an appropriate interval or pair of one-sided tests.",
  "solution": "<p>No. Low power can also produce nonsignificance. Equivalence requires a prespecified practical margin and an appropriate interval or pair of one-sided tests.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Specify a comparison of two AI systems on shared tasks.",
  "plain": "Prespecify the effect and practical threshold, use paired or clustered uncertainty, plan sample size, account for multiple comparisons, and freeze the stopping and selection rules.",
  "solution": "<p>Prespecify the effect and practical threshold, use paired or clustered uncertainty, plan sample size, account for multiple comparisons, and freeze the stopping and selection rules.</p>"
}
});
