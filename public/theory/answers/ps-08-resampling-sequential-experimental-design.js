/* Authored probability solutions and offline checks. */
GU.answers("ps-08-resampling-sequential-experimental-design", {
A1: {
  "statement": "**A1 · Foundation · paper — Bootstrap mechanics.** From \\(x=(1,2,4,9)\\), show that there are \\(4^4=256\\) equally likely ordered bootstrap index sequences. Write a program that groups them by bootstrap mean, reports each distinct mean and probability, and verifies the exact bootstrap mean and variance against the plug-in formulas.",
  "plain": "Each of four draws independently chooses one of four positions, producing 256 index sequences. The exact bootstrap expectation is the sample mean, \\(4\\). Conditional variance of a single empirical-distribution draw is \\(9.5\\), so the mean of four draws has variance \\(9.5/4=2.375\\); the grouped probabilities must sum to one and reproduce both moments.",
  "solution": "<p>Each of four draws independently chooses one of four positions, producing 256 index sequences. The exact bootstrap expectation is the sample mean, \\(4\\). Conditional variance of a single empirical-distribution draw is \\(9.5\\), so the mean of four draws has variance \\(9.5/4=2.375\\); the grouped probabilities must sum to one and reproduce both moments.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Bootstrap mean expectation; variance",
      "type": "vec",
      "ans": [
        4,
        2.375
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Interval construction.** The ordered bootstrap estimates are \\((1.1,1.3,1.4,1.8,2.0,2.1,2.4,2.8,3.0,3.6)\\), the original estimate is \\(2.0\\), and this exercise defines the 10% and 90% empirical quantiles as the first and ninth entries. Calculate the corresponding 80% percentile and basic intervals.",
  "plain": "The percentile interval is \\([1.1,3.0]\\). Reflecting endpoints around \\(2\\hat\\theta=4\\) gives the basic interval \\([4-3.0,4-1.1]=[1.0,2.9]\\).",
  "solution": "<p>The percentile interval is \\([1.1,3.0]\\). Reflecting endpoints around \\(2\\hat\\theta=4\\) gives the basic interval \\([4-3.0,4-1.1]=[1.0,2.9]\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Percentile endpoints; basic endpoints",
      "type": "vec",
      "ans": [
        1.1,
        3,
        1,
        2.9
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — Permutation space.** For four paired differences \\(d=(1,2,-1,3)\\), enumerate all \\(2^4\\) sign assignments and the resulting mean differences. Contrast this with a completely randomized experiment assigning two of four labeled units to treatment, which has \\(\\binom42\\) assignments.",
  "plain": "The 16 sign assignments give means \\(\\pm0.25\\) (three each), \\(\\pm0.75\\) (two each), \\(\\pm1.25\\) (two each), and \\(\\pm1.75\\) (one each): sorted, \\(-1.75,-1.25,-1.25,-0.75,-0.75,-0.25,-0.25,-0.25,0.25,0.25,0.25,0.75,0.75,1.25,1.25,1.75\\). The observed mean 1.25 is one of these. A completely randomized experiment with two of four labeled units treated has only \\(\\binom42=6\\) assignments, and it permutes units between arms rather than flipping signs within pairs. Enumerate only assignments the implemented design could have produced.",
  "solution": "<p>The 16 sign assignments give means \\(\\pm0.25\\) (three each), \\(\\pm0.75\\) (two each), \\(\\pm1.25\\) (two each), and \\(\\pm1.75\\) (one each): sorted, \\(-1.75,-1.25,-1.25,-0.75,-0.75,-0.25,-0.25,-0.25,0.25,0.25,0.25,0.75,0.75,1.25,1.25,1.75\\). The observed mean 1.25 is one of these. A completely randomized experiment with two of four labeled units treated has only \\(\\binom42=6\\) assignments, and it permutes units between arms rather than flipping signs within pairs. Enumerate only assignments the implemented design could have produced.</p>"
},
A4: {
  "statement": "**A4 · Foundation · paper — Sequential evidence.** For observations \\((1,0,1,1,0,1)\\), update the Bernoulli likelihood ratio for \\(H_1:p=0.7\\) against \\(H_0:p=0.5\\) after every observation. Report the running maximum e-value and anytime p-value \\(\\min(1,1/\\max_{s\\le t}E_s)\\).",
  "plain": "Multiply by \\(0.7/0.5=1.4\\) after a success and by \\(0.3/0.5=0.6\\) after a failure. The e-values are approximately \\((1.4,0.84,1.176,1.6464,0.98784,1.382976)\\); the final running maximum is 1.6464 and the final anytime p-value is about 0.6074. It never approaches 0.05.",
  "solution": "<p>Multiply by \\(0.7/0.5=1.4\\) after a success and by \\(0.3/0.5=0.6\\) after a failure. The e-values are approximately \\((1.4,0.84,1.176,1.6464,0.98784,1.382976)\\); the final running maximum is 1.6464 and the final anytime p-value is about 0.6074. It never approaches 0.05.</p>"
},
A5: {
  "statement": "**A5 · Foundation · paper — Design vocabulary.** An experiment compares two summarization models on 120 documents from 4 domains, with 6 annotators scoring outputs. Give one concrete implementation of each of randomization, pairing, blocking, blinding, replication, and stratification in this experiment, and say what each protects against.",
  "plain": "Randomization: a random coin decides which model's summary is shown first and which annotator sees each document, protecting against systematic assignment bias. Pairing: both models summarize every document, so the comparison is within document and removes document difficulty. Blocking: randomize display order and annotator assignment within each domain, so domain differences cannot confound the contrast. Blinding: annotators never see model names, protecting the measurement. Replication: many independent documents (and, if generalizing over runs, several model seeds) supply independent information; re-scoring the same output adds only rater information. Stratification: sample 30 documents per domain so the evaluated population has the intended domain composition.",
  "solution": "<p>Randomization: a random coin decides which model&#x27;s summary is shown first and which annotator sees each document, protecting against systematic assignment bias. Pairing: both models summarize every document, so the comparison is within document and removes document difficulty. Blocking: randomize display order and annotator assignment within each domain, so domain differences cannot confound the contrast. Blinding: annotators never see model names, protecting the measurement. Replication: many independent documents (and, if generalizing over runs, several model seeds) supply independent information; re-scoring the same output adds only rater information. Stratification: sample 30 documents per domain so the evaluated population has the intended domain composition.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Skewed estimator.** Generate \\(n=40\\) iid lognormal pairs with log-scale correlation 0.6 (seed 2026). Bootstrap the sample median of the first coordinate and the ratio of coordinate means using 10,000 paired resamples. Compare distribution shape, standard error, and percentile interval with a Gaussian approximation; repeat after breaking the pairing and explain the change.",
  "plain": "A numpy default_rng(2026) run (multivariate normal logs, then 10,000 paired resamples of row indices) gave: sample median of the first coordinate 1.142, bootstrap SE 0.107, bootstrap skewness \\(-0.82\\), percentile interval \\([1.066,1.453]\\) versus Gaussian \\([0.932,1.352]\\). The ratio of means was 0.776, bootstrap SE 0.129, skewness 0.50, percentile interval \\([0.566,1.070]\\) versus Gaussian \\([0.523,1.030]\\). Resampling the two coordinates independently raised the ratio's SE to 0.173 (percentile \\([0.509,1.181]\\)): positive correlation between numerator and denominator stabilizes the ratio, and breaking the pairing discards it. Your exact numbers will depend on the generator call order, but the direction of these differences should reproduce. Skewness and the discrete median make symmetric Gaussian intervals misleading.",
  "solution": "<p>A numpy default_rng(2026) run (multivariate normal logs, then 10,000 paired resamples of row indices) gave: sample median of the first coordinate 1.142, bootstrap SE 0.107, bootstrap skewness \\(-0.82\\), percentile interval \\([1.066,1.453]\\) versus Gaussian \\([0.932,1.352]\\). The ratio of means was 0.776, bootstrap SE 0.129, skewness 0.50, percentile interval \\([0.566,1.070]\\) versus Gaussian \\([0.523,1.030]\\). Resampling the two coordinates independently raised the ratio&#x27;s SE to 0.173 (percentile \\([0.509,1.181]\\)): positive correlation between numerator and denominator stabilizes the ratio, and breaking the pairing discards it. Your exact numbers will depend on the generator call order, but the direction of these differences should reproduce. Skewness and the discrete median make symmetric Gaussian intervals misleading.</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Cluster bootstrap.** Four users have (successes, interactions) \\((6,8),(0,2),(2,2),(1,4)\\). Compute the user-weighted mean of per-user rates and the interaction-weighted pooled rate, then implement a user-level bootstrap (10,000 resamples, seed 2026) and report the bootstrap SE of each estimand.",
  "plain": "User-weighted: the mean of \\((0.75,0,1,0.25)\\) is 0.5. Interaction-weighted: \\(9/16=0.5625\\). Resample 4 whole users with replacement and recompute each estimator. The exact bootstrap SE of the user-weighted mean is \\(\\sqrt{0.15625/4}\\approx0.198\\); a numpy default_rng(2026) run gave 0.197, with the interaction-weighted SE about 0.171. The estimands differ because unequal cluster sizes give the heavy user more weight in the pooled rate; either way, rows within a user must travel together.",
  "solution": "<p>User-weighted: the mean of \\((0.75,0,1,0.25)\\) is 0.5. Interaction-weighted: \\(9/16=0.5625\\). Resample 4 whole users with replacement and recompute each estimator. The exact bootstrap SE of the user-weighted mean is \\(\\sqrt{0.15625/4}\\approx0.198\\); a numpy default_rng(2026) run gave 0.197, with the interaction-weighted SE about 0.171. The estimands differ because unequal cluster sizes give the heavy user more weight in the pooled rate; either way, rows within a user must travel together.</p>",
  "fields": [
    {
      "id": "value",
      "label": "user-weighted mean; interaction-weighted rate",
      "type": "vec",
      "ans": [
        0.5,
        0.5625
      ]
    }
  ],
  "hints": {
    "value": "Average the four per-user success rates for one; divide total successes by total interactions for the other."
  }
},
A8: {
  "statement": "**A8 · Core · paper — Exact sign flips.** For \\(d=(1,2,-1,3)\\), calculate the exact two-sided paired permutation p-value using \\(|\\bar d|\\) and inclusive tail counting.",
  "plain": "The observed mean is \\(1.25\\), so the absolute signed sum threshold is 5. Enumerating the 16 sign patterns gives 6 sums with absolute value at least 5; the exact inclusive two-sided p-value is \\(6/16=0.375\\).",
  "solution": "<p>The observed mean is \\(1.25\\), so the absolute signed sum threshold is 5. Enumerating the 16 sign patterns gives 6 sums with absolute value at least 5; the exact inclusive two-sided p-value is \\(6/16=0.375\\).</p>"
},
A9: {
  "statement": "**A9 · Core · paper — Monte Carlo calibration.** For the same statistic, estimate the permutation p-value using \\(B=99,999,9{,}999\\), seed 2026, and \\((b+1)/(B+1)\\). Report conditional Monte Carlo standard error and decide which \\(B\\) can resolve a 0.05 decision reliably.",
  "plain": "The exact p-value is 0.375 (A8). With numpy default_rng(2026) drawing random sign vectors, one run gave \\(b=28,B=99\\): \\(\\hat p=0.29\\), MC SE \\(\\approx0.046\\); \\(b=381,B=999\\): \\(\\hat p=0.382\\), MC SE \\(\\approx0.015\\); \\(b=3770,B=9999\\): \\(\\hat p=0.377\\), MC SE \\(\\approx0.005\\). The MC SE is \\(\\sqrt{\\hat p(1-\\hat p)/B}\\), conditional on the data. Because the true p-value is far from 0.05, even \\(B=99\\) places \\(\\hat p\\) many MC standard errors above 0.05, so every \\(B\\) resolves this decision; \\(B\\) matters most when \\(p\\) is near the threshold.",
  "solution": "<p>The exact p-value is 0.375 (A8). With numpy default_rng(2026) drawing random sign vectors, one run gave \\(b=28,B=99\\): \\(\\hat p=0.29\\), MC SE \\(\\approx0.046\\); \\(b=381,B=999\\): \\(\\hat p=0.382\\), MC SE \\(\\approx0.015\\); \\(b=3770,B=9999\\): \\(\\hat p=0.377\\), MC SE \\(\\approx0.005\\). The MC SE is \\(\\sqrt{\\hat p(1-\\hat p)/B}\\), conditional on the data. Because the true p-value is far from 0.05, even \\(B=99\\) places \\(\\hat p\\) many MC standard errors above 0.05, so every \\(B\\) resolves this decision; \\(B\\) matters most when \\(p\\) is near the threshold.</p>"
},
A10: {
  "statement": "**A10 · Core · paper — Alpha spending.** Use five prespecified looks after 20, 40, 60, 80, and 100 Bernoulli observations with levels \\((0.005,0.005,0.01,0.01,0.02)\\), rejecting \\(H_0:p=0.5\\) at look \\(k\\) when the one-sided exact binomial p-value is at most \\(\\alpha_k\\). Verify the union-bound guarantee, then simulate the whole stopping rule under \\(p=0.5\\) and \\(p=0.65\\), 10,000 trials each, seed 2026. Compare rejection probability and expected stopping look.",
  "plain": "The levels sum to 0.05, so by the union bound \\(P(\\text{any rejection}\\mid H_0)\\le\\sum_k\\alpha_k=0.05\\). A numpy default_rng(2026) run gave rejection probability 0.024 under \\(p=0.5\\) (conservative, because of discreteness and overlap between looks) with mean stopping look 4.97, and 0.842 under \\(p=0.65\\) with mean stopping look 3.61. Simulating the entire stopping rule, not just the final look, is what verifies the error rate.",
  "solution": "<p>The levels sum to 0.05, so by the union bound \\(P(\\text{any rejection}\\mid H_0)\\le\\sum_k\\alpha_k=0.05\\). A numpy default_rng(2026) run gave rejection probability 0.024 under \\(p=0.5\\) (conservative, because of discreteness and overlap between looks) with mean stopping look 4.97, and 0.842 under \\(p=0.65\\) with mean stopping look 3.61. Simulating the entire stopping rule, not just the final look, is what verifies the error rate.</p>"
},
A11: {
  "statement": "**A11 · Core · paper — Blocked experiment.** In blocks A and B, outcomes under the observed assignment are treatment \\((8,9)\\), control \\((5,6)\\) and treatment \\((21,20)\\), control \\((19,18)\\), respectively. Estimate the equal-block average effect with and without block adjustment; state which target each weighting scheme estimates and why blocking can improve precision.",
  "plain": "Block A: treatment mean 8.5, control 5.5, effect 3. Block B: 20.5 versus 18.5, effect 2. The equal-block average is \\((3+2)/2=2.5\\). The unadjusted pooled contrast is \\(14.5-12=2.5\\) too, because allocation is balanced within blocks; with unequal allocation the pooled contrast would weight blocks by their sizes. Precision differs greatly: the block-adjusted SE, from within-block variances (each 0.5), is \\(\\sqrt{(0.5/2+0.5/2)\\cdot2}/2=0.5\\), while the unadjusted SE, using pooled variances of about 48.3 per arm, is about \\(\\sqrt{48.3/4+48.3/4}\\approx4.9\\). Blocking removes the large between-block difference from the error term.",
  "solution": "<p>Block A: treatment mean 8.5, control 5.5, effect 3. Block B: 20.5 versus 18.5, effect 2. The equal-block average is \\((3+2)/2=2.5\\). The unadjusted pooled contrast is \\(14.5-12=2.5\\) too, because allocation is balanced within blocks; with unequal allocation the pooled contrast would weight blocks by their sizes. Precision differs greatly: the block-adjusted SE, from within-block variances (each 0.5), is \\(\\sqrt{(0.5/2+0.5/2)\\cdot2}/2=0.5\\), while the unadjusted SE, using pooled variances of about 48.3 per arm, is about \\(\\sqrt{48.3/4+48.3/4}\\approx4.9\\). Blocking removes the large between-block difference from the error term.</p>",
  "fields": [
    {
      "id": "value",
      "label": "block-adjusted effect; unadjusted effect; block-adjusted SE",
      "type": "vec",
      "ans": [
        2.5,
        2.5,
        0.5
      ]
    }
  ],
  "hints": {
    "value": "Take the treatment-minus-control mean within each block and average them; compare with the pooled contrast; the SE uses within-block variances."
  }
},
A12: {
  "statement": "**A12 · Stretch · paper — Rare-event bootstrap.** For 0 failures in 30 trials and for 1 failure in 30, compute the ordinary bootstrap 95% percentile interval for the failure rate (10,000 resamples, seed 0) and the exact Clopper–Pearson 95% interval. Explain the bootstrap collapse.",
  "plain": "With 0 failures, every resample has 0 failures, so the bootstrap interval is \\([0,0]\\), while Clopper–Pearson gives \\([0,0.116]\\). With 1 failure, the bootstrap percentile interval is \\([0,0.1]\\) (a resampled count ranging mostly over 0 to 3), while Clopper–Pearson gives \\([0.0008,0.172]\\). The bootstrap cannot put mass on outcomes absent from the sample and treats the empirical rate as the truth; more resamples do not add missing support. The exact binomial model expresses the remaining uncertainty.",
  "solution": "<p>With 0 failures, every resample has 0 failures, so the bootstrap interval is \\([0,0]\\), while Clopper–Pearson gives \\([0,0.116]\\). With 1 failure, the bootstrap percentile interval is \\([0,0.1]\\) (a resampled count ranging mostly over 0 to 3), while Clopper–Pearson gives \\([0.0008,0.172]\\). The bootstrap cannot put mass on outcomes absent from the sample and treats the empirical rate as the truth; more resamples do not add missing support. The exact binomial model expresses the remaining uncertainty.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Clopper–Pearson upper bound for 0/30; for 1/30",
      "type": "vec",
      "ans": [
        0.11570330822202778,
        0.17216945563341265
      ]
    }
  ],
  "hints": {
    "value": "Use Beta quantiles: the upper endpoint is the 0.975 quantile of Beta(s+1, n−s)."
  }
},
A13: {
  "statement": "**A13 · Stretch · paper — Time dependence.** Generate 1,000 AR(1) series of length 200 with \\(\\phi=0.7\\) and unit marginal variance (seed 2026). For each, estimate the SE of the series mean using a moving-block bootstrap with block lengths \\(L=1,5,10,20,50\\) (500 resamples). Compare the average bootstrap SE with the true SD of the mean across series.",
  "plain": "The true SD of the mean is about 0.167 (theory \\(\\sqrt{n^{-1}[1+2\\sum_k(1-k/n)\\phi^k]}\\)); a numpy default_rng(2026) run gave 0.165 across the 1,000 series. Average bootstrap SEs were 0.069 (\\(L=1\\), the row bootstrap), 0.120 (5), 0.137 (10), 0.143 (20), and 0.127 (50). Row resampling destroys autocorrelation and understates the SE by more than half. Longer blocks keep more dependence, but too-long blocks leave few effectively independent units and the estimate degrades again; all block bootstraps here remain somewhat low at \\(n=200\\).",
  "solution": "<p>The true SD of the mean is about 0.167 (theory \\(\\sqrt{n^{-1}[1+2\\sum_k(1-k/n)\\phi^k]}\\)); a numpy default_rng(2026) run gave 0.165 across the 1,000 series. Average bootstrap SEs were 0.069 (\\(L=1\\), the row bootstrap), 0.120 (5), 0.137 (10), 0.143 (20), and 0.127 (50). Row resampling destroys autocorrelation and understates the SE by more than half. Longer blocks keep more dependence, but too-long blocks leave few effectively independent units and the estimate degrades again; all block bootstraps here remain somewhat low at \\(n=200\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "theoretical SD of the mean",
      "type": "num",
      "ans": 0.16716591890826438
    }
  ],
  "hints": {
    "value": "Use Var(mean) = n⁻¹[1 + 2Σ(1−k/n)φᵏ] with φ=0.7, n=200."
  }
},
A14: {
  "statement": "**A14 · Stretch · paper — Selection replay.** Ten checkpoints each have true accuracy 0.70 and independent correctness on the same 500 items; the checkpoint with the best observed accuracy is reported. Over 1,000 datasets (seed 2026, 1,000 item-bootstrap resamples each), compare (i) the coverage of 0.70 by a naive 95% percentile interval for the selected checkpoint's accuracy, (ii) the actual mean optimism, and (iii) the bootstrap-estimated optimism from replaying the selection inside each resample.",
  "plain": "A numpy default_rng(2026) run gave actual mean optimism 0.032 (theory \\(1.54\\times0.0205\\approx0.032\\)) and naive coverage of only 0.72: conditioning on the winner ignores winner's-curse variation. Replaying selection in each resample estimated the optimism at about 0.013, and a basic interval built from the replayed maximum covered 0.70 about 80% of the time. Replaying the pipeline is necessary but not sufficient: the bootstrap underestimates optimism because the observed winner is already optimistic. A fresh held-out evaluation of the selected checkpoint is the clean fix.",
  "solution": "<p>A numpy default_rng(2026) run gave actual mean optimism 0.032 (theory \\(1.54\\times0.0205\\approx0.032\\)) and naive coverage of only 0.72: conditioning on the winner ignores winner&#x27;s-curse variation. Replaying selection in each resample estimated the optimism at about 0.013, and a basic interval built from the replayed maximum covered 0.70 about 80% of the time. Replaying the pipeline is necessary but not sufficient: the bootstrap underestimates optimism because the observed winner is already optimistic. A fresh held-out evaluation of the selected checkpoint is the clean fix.</p>"
},
A15: {
  "statement": "**A15 · Stretch · paper — Weak versus sharp null.** Eight units have \\(Y_i(0)=0\\) for all \\(i\\) and \\(Y_i(1)=4\\) for \\(i=1,\\ldots,4\\), \\(Y_i(1)=-4\\) for \\(i=5,\\ldots,8\\), and 4 units are randomized to treatment. Over all 70 assignments, compute the difference-in-means statistic and the randomization p-value for the sharp null using (a) the difference in means and (b) the difference in mean absolute outcomes. Explain the mismatch with the zero average effect.",
  "plain": "The average effect is 0, but the sharp null is false for every unit. (a) The difference in means equals the treated-group average of \\(\\pm4\\), which ranges over \\(\\{-4,-2,0,2,4\\}\\) with mean zero across assignments; rejecting it is rare, and its sharp-null p-value is at most \\(2/70\\approx0.029\\) only when all four treated units share the same sign (2 of 70 assignments). (b) The mean absolute outcome is 4 for treated and 0 for controls in every assignment, so this statistic is maximal under every realized assignment and the sharp null is rejected with \\(p=1/70\\) one-sided whichever assignment occurs. The rejection is correct about the sharp null but says nothing against a zero average effect: the sharp-null randomization distribution answers a stronger question.",
  "solution": "<p>The average effect is 0, but the sharp null is false for every unit. (a) The difference in means equals the treated-group average of \\(\\pm4\\), which ranges over \\(\\{-4,-2,0,2,4\\}\\) with mean zero across assignments; rejecting it is rare, and its sharp-null p-value is at most \\(2/70\\approx0.029\\) only when all four treated units share the same sign (2 of 70 assignments). (b) The mean absolute outcome is 4 for treated and 0 for controls in every assignment, so this statistic is maximal under every realized assignment and the sharp null is rejected with \\(p=1/70\\) one-sided whichever assignment occurs. The rejection is correct about the sharp null but says nothing against a zero average effect: the sharp-null randomization distribution answers a stronger question.</p>"
},
A16: {
  "statement": "**A16 · Stretch · paper — Adaptive evidence.** For Bernoulli data testing \\(H_0:p=0.5\\), compare the point-alternative e-process with \\(p_1=0.7\\) and the uniform Beta\\((1,1)\\) mixture e-process, rejecting when \\(E_t\\ge20\\) with at most 500 observations. For true \\(p\\in\\{0.5,0.55,0.6,0.7,0.8,0.9\\}\\) and 2,000 streams each (seed 2026), report rejection rate and median stopping time.",
  "plain": "A numpy default_rng(2026) run gave (point, mixture) rejection rates: \\(p=0.5\\): 0.040, 0.036 (both below 0.05, as Ville's inequality guarantees); 0.55: 0.20, 0.24; 0.6: 0.71, 0.92; 0.7: 1.0, 1.0; 0.8: 1.0, 1.0; 0.9: 1.0, 1.0. Median stopping times were 135 versus 208 at 0.6, 30 versus 45 at 0.7, 17 versus 19 at 0.8, and 12 versus 12 at 0.9 (500 when fewer than half the streams rejected). The point alternative is fastest near its chosen effect; the mixture pays a modest delay there but gains power at effects the point alternative misjudges, while remaining a valid e-process.",
  "solution": "<p>A numpy default_rng(2026) run gave (point, mixture) rejection rates: \\(p=0.5\\): 0.040, 0.036 (both below 0.05, as Ville&#x27;s inequality guarantees); 0.55: 0.20, 0.24; 0.6: 0.71, 0.92; 0.7: 1.0, 1.0; 0.8: 1.0, 1.0; 0.9: 1.0, 1.0. Median stopping times were 135 versus 208 at 0.6, 30 versus 45 at 0.7, 17 versus 19 at 0.8, and 12 versus 12 at 0.9 (500 when fewer than half the streams rejected). The point alternative is fastest near its chosen effect; the mixture pays a modest delay there but gains power at effects the point alternative misjudges, while remaining a valid e-process.</p>"
},
A17: {
  "statement": "**A17 · Stretch · paper — Interference.** Twenty groups of 10 users share an agent memory, with outcome \\(y=T_i+0.5\\bar T_g+\\varepsilon\\), \\(\\varepsilon\\sim\\mathcal N(0,1)\\), where \\(\\bar T_g\\) is the treated fraction in the user's group. Over 2,000 repetitions (seed 2026), compare the difference in means under individual randomization (5 of 10 treated in each group) and under cluster randomization (10 of 20 groups fully treated), relative to the total effect of treating everyone versus no one.",
  "plain": "The total effect is \\(1+0.5=1.5\\). Under individual randomization every group has \\(\\bar T_g=0.5\\), so the spillover adds equally to both arms and the difference in means estimates only the direct effect: a numpy default_rng(2026) run gave mean 1.00 (SD 0.14). Under cluster randomization, treated groups have \\(\\bar T_g=1\\) and controls 0, so the contrast captures direct plus spillover effects: mean 1.50 (SD 0.14). Cluster randomization aligns assignment with interference groups; its inference rests on 20 independent clusters, not 200 users.",
  "solution": "<p>The total effect is \\(1+0.5=1.5\\). Under individual randomization every group has \\(\\bar T_g=0.5\\), so the spillover adds equally to both arms and the difference in means estimates only the direct effect: a numpy default_rng(2026) run gave mean 1.00 (SD 0.14). Under cluster randomization, treated groups have \\(\\bar T_g=1\\) and controls 0, so the contrast captures direct plus spillover effects: mean 1.50 (SD 0.14). Cluster randomization aligns assignment with interference groups; its inference rests on 20 independent clusters, not 200 users.</p>"
},
A18: {
  "statement": "**A18 · Stretch · paper — Full protocol.** Design an experiment comparing two models on 12 tasks × 50 prompts with 3 training seeds per model, one primary metric and 3 secondary metrics, human raters, and interim looks after 200, 400, and 600 prompts. Specify randomization, blocking, the sampling hierarchy, a sequential stopping rule with explicit alpha levels, the resampling scheme, and multiplicity control, with total family-wise error 0.05.",
  "plain": "Population and hierarchy: tasks are random (generalize to new tasks), prompts nested in tasks, seeds random within model, outputs nested in prompt × seed, ratings nested in outputs. Pairing: both models answer every prompt. Randomization and blocking: prompt order is randomized within task blocks; left/right display order and rater assignment are randomized within each task; raters are blinded. Primary analysis: the mean paired difference on the primary metric, with uncertainty from a hierarchical bootstrap that resamples tasks, then prompts within task, and seeds within model, carrying paired outputs together. Stopping: primary looks at 200, 400, and 600 prompts with levels 0.005, 0.01, and 0.025 (sum 0.04 by the union bound), or an anytime-valid confidence sequence. Multiplicity: the remaining 0.01 is spent on the three secondary metrics with Holm at the final look only. Everything, including prompt sampling and exclusion rules, is frozen before data collection.",
  "solution": "<p>Population and hierarchy: tasks are random (generalize to new tasks), prompts nested in tasks, seeds random within model, outputs nested in prompt × seed, ratings nested in outputs. Pairing: both models answer every prompt. Randomization and blocking: prompt order is randomized within task blocks; left/right display order and rater assignment are randomized within each task; raters are blinded. Primary analysis: the mean paired difference on the primary metric, with uncertainty from a hierarchical bootstrap that resamples tasks, then prompts within task, and seeds within model, carrying paired outputs together. Stopping: primary looks at 200, 400, and 600 prompts with levels 0.005, 0.01, and 0.025 (sum 0.04 by the union bound), or an anytime-valid confidence sequence. Multiplicity: the remaining 0.01 is spent on the three secondary metrics with Holm at the final look only. Everything, including prompt sampling and exclusion rules, is frozen before data collection.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** What is the resampling unit in a clustered experiment?",
  "plain": "It should preserve the dependence and randomization structure: resample independent clusters, or use an explicitly justified alternative, rather than treating dependent rows as independent.",
  "solution": "<p>It should preserve the dependence and randomization structure: resample independent clusters, or use an explicitly justified alternative, rather than treating dependent rows as independent.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the equal-cluster design effect.",
  "plain": "For m observations per cluster with variance v and common correlation rho, the cluster-sum variance is mv[1+(m−1)rho]; relative to iid rows the multiplier is 1+(m−1)rho.",
  "solution": "<p>For m observations per cluster with variance v and common correlation rho, the cluster-sum variance is mv[1+(m−1)rho]; relative to iid rows the multiplier is 1+(m−1)rho.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** For cluster size 10 and intraclass correlation 0.2, compute the variance design effect.",
  "plain": "1+9×0.2=2.8.",
  "solution": "<p>1+9×0.2=2.8.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 2.8
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-design experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Is repeatedly checking an ordinary fixed-sample p-value until it crosses 0.05 a level-0.05 procedure?",
  "plain": "Generally no. Optional stopping changes the rejection event. Use a prespecified design or an anytime-valid method under its stated assumptions.",
  "solution": "<p>Generally no. Optional stopping changes the rejection event. Use a prespecified design or an anytime-valid method under its stated assumptions.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Design an evaluation with repeated users and sequential monitoring.",
  "plain": "Randomize and analyze at the appropriate independent unit, retain user dependence in resampling, and specify an anytime-valid monitoring rule or a fixed horizon before observing results.",
  "solution": "<p>Randomize and analyze at the appropriate independent unit, retain user dependence in resampling, and specify an anytime-valid monitoring rule or a fixed horizon before observing results.</p>"
}
});
