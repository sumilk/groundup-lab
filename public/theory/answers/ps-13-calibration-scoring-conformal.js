/* Authored probability solutions and offline checks. */
GU.answers("ps-13-calibration-scoring-conformal", {
A1: {
  "statement": "**A1 · Foundation · paper — Cumulative problem 1.** A weather model says \\(0.7\\) on 200 days and it rains on 130. Is this consistent with calibration? Give a rough check.",
  "plain": "The observed rate is \\(130/200=0.65\\) against a claim of \\(0.70\\). The standard error is \\(\\sqrt{0.7\\times0.3/200}\\approx0.032\\), so the deviation is about \\(1.5\\) standard errors — consistent with calibration on this evidence alone.",
  "solution": "<p>The observed rate is \\(130/200=0.65\\) against a claim of \\(0.70\\). The standard error is \\(\\sqrt{0.7\\times0.3/200}\\approx0.032\\), so the deviation is about \\(1.5\\) standard errors — consistent with calibration on this evidence alone.</p>"
},
A2: {
  "statement": "**A2 · Foundation · paper — Cumulative problem 2.** Compute the Brier and log scores for \\(q=0.02\\) when \\(y=1\\). Which rule punishes more, and by how much?",
  "plain": "Brier \\(=(0.02-1)^2=0.9604\\); log score \\(=-\\log(0.02)\\approx3.91\\). The log score is unbounded and punishes the confident error far more; Brier cannot exceed 1.",
  "solution": "<p>Brier \\(=(0.02-1)^2=0.9604\\); log score \\(=-\\log(0.02)\\approx3.91\\). The log score is unbounded and punishes the confident error far more; Brier cannot exceed 1.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Brier loss; negative log score",
      "type": "vec",
      "ans": [
        0.9604,
        3.912023005428146
      ]
    }
  ],
  "hints": {"value":"Brier is (q − 1)² when y = 1; the log score is −ln q. Enter the Brier loss first."}
},
A3: {
  "statement": "**A3 · Foundation · paper — Cumulative problem 3.** For \\(n=200\\) and \\(\\alpha=0.1\\), give the conformal rank \\(k\\).",
  "plain": "\\(k=\\lceil201\\times0.9\\rceil=\\lceil180.9\\rceil=181\\).",
  "solution": "<p>\\(k=\\lceil201\\times0.9\\rceil=\\lceil180.9\\rceil=181\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Conformal rank",
      "type": "num",
      "ans": 181
    }
  ],
  "hints": {"value":"Compute (n + 1)(1 − α) = 201 × 0.9 and round up."}
},
A4: {
  "statement": "**A4 · Core · paper — Cumulative problem 4.** Decompose the Brier score for a model with base rate \\(0.4\\) that predicts \\(0.2\\) on half the data (true rate \\(0.25\\)) and \\(0.6\\) on the other half (true rate \\(0.55\\)). Report all three terms.",
  "plain": "Uncertainty \\(=0.4\\times0.6=0.24\\). Reliability \\(=\\tfrac12(0.2-0.25)^2+\\tfrac12(0.6-0.55)^2=0.0025\\). Resolution \\(=\\tfrac12(0.25-0.4)^2+\\tfrac12(0.55-0.4)^2=0.0225\\). \\(\\mathrm{BS}=0.0025-0.0225+0.24=0.22\\).",
  "solution": "<p>Uncertainty \\(=0.4\\times0.6=0.24\\). Reliability \\(=\\tfrac12(0.2-0.25)^2+\\tfrac12(0.6-0.55)^2=0.0025\\). Resolution \\(=\\tfrac12(0.25-0.4)^2+\\tfrac12(0.55-0.4)^2=0.0225\\). \\(\\mathrm{BS}=0.0025-0.0225+0.24=0.22\\).</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Cumulative problem 5.** Show that temperature scaling is a monotone reparameterization of the logits and therefore cannot change any argmax-based metric. Then say precisely which metrics it can change.",
  "plain": "Dividing by \\(T>0\\) preserves the order of logits, so the argmax is fixed: accuracy, top-\\(k\\), and exact match are unchanged. It can change probability-dependent quantities, although equality or unchanged decisions can occur: log loss, Brier, ECE, entropy, abstention rates at a fixed threshold, and any expected-cost decision.",
  "solution": "<p>Dividing by \\(T&gt;0\\) preserves the order of logits, so the argmax is fixed: accuracy, top-\\(k\\), and exact match are unchanged. It can change probability-dependent quantities, although equality or unchanged decisions can occur: log loss, Brier, ECE, entropy, abstention rates at a fixed threshold, and any expected-cost decision.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Cumulative problem 6.** A model reports ECE \\(=0.035\\) with \\(K=20\\) bins on \\(n=4000\\) points. Assuming equal bin counts and conditional Bernoulli variances approximately 0.25, estimate the null noise scale. State why bin counts and scores are needed for a defensible null calculation.",
  "plain": "Under the stated approximation, \\(n_k=200\\) gives \\(0.798\\sqrt{0.25/200}\\approx0.0282\\). This is an expected null noise scale, not a deterministic floor or a significance threshold. Simulate the full statistic conditional on actual scores/counts and a justified dependence model before interpreting 0.035.",
  "solution": "<p>Under the stated approximation, \\(n_k=200\\) gives \\(0.798\\sqrt{0.25/200}\\approx0.0282\\). This is an expected null noise scale, not a deterministic floor or a significance threshold. Simulate the full statistic conditional on actual scores/counts and a justified dependence model before interpreting 0.035.</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Cumulative problem 7.** Prove that conformal coverage is at least \\(1-\\alpha\\) using only the uniformity of the rank of \\(s_{n+1}\\).",
  "plain": "For distinct exchangeable scores the randomized rank is uniform, so coverage is \\(k/(n+1)\\) for \\(k\\le n\\). Ties make the inclusive deterministic rule conservative. At \\(k=n+1\\), take an infinite threshold. This is marginal coverage conditional on a fixed training fit, not conditional coverage among selected answers.",
  "solution": "<p>For distinct exchangeable scores the randomized rank is uniform, so coverage is \\(k/(n+1)\\) for \\(k\\le n\\). Ties make the inclusive deterministic rule conservative. At \\(k=n+1\\), take an infinite threshold. This is marginal coverage conditional on a fixed training fit, not conditional coverage among selected answers.</p>"
},
A8: {
  "statement": "**A8 · Stretch · paper — Cumulative problem 8.** An escalation system escalates when \\(q>0.2\\) (a missed failure costs 4, an unnecessary escalation costs 1). Group G1 has 600 tickets with raw score 0.30 and true failure rate 0.22; group G2 has 400 tickets with raw score 0.10 and true failure rate 0.02. Temperature scaling with \\(T=0.56\\) is applied to the logits. (a) Compute the new scores for both groups. (b) Compute ECE (with the two groups as bins), mean log loss, and Brier score before and after. (c) Compute the total expected decision loss before and after. (d) Explain how ECE and proper scores can improve while downstream performance falls, name the quantity that moved in the wrong direction, and design a held-out experiment that confirms it.",
  "plain": "**(a)** \\(\\operatorname{logit}(0.30)=-0.847\\) and \\(\\operatorname{logit}(0.10)=-2.197\\). Dividing by 0.56 gives \\(-1.513\\) and \\(-3.924\\), that is, new scores \\(0.180\\) for G1 and \\(0.019\\) for G2.\n\n**(b)** Using group rates \\(0.22\\) and \\(0.02\\):\n\n- ECE: before \\(0.6|0.30-0.22|+0.4|0.10-0.02|=0.080\\); after \\(0.6|0.180-0.22|+0.4|0.019-0.02|\\approx0.024\\).\n- Mean log loss: \\(0.3856\\to0.3584\\).\n- Brier score: \\(0.1172\\to0.1117\\).\n\nAll three improve.\n\n**(c)** Before, G1 (0.30) is escalated, with expected loss \\(1-0.22=0.78\\) per ticket, and G2 (0.10) is not, with loss \\(4\\times0.02=0.08\\). The total is \\(600(0.78)+400(0.08)=500\\). After, G1's score of 0.180 falls below 0.2, so it is no longer escalated and its loss is \\(4\\times0.22=0.88\\) per ticket. The total becomes \\(600(0.88)+400(0.08)=560\\), which is 12% worse.\n\n**(d)** ECE and proper scores average over all scores, but the decision depends only on which side of 0.2 each group falls. G1's true risk 0.22 is just above the threshold. The raw score overpredicted it on the correct side; the recalibrated score underpredicts it on the wrong side. The absolute gap shrank from 0.08 to 0.04, yet the sign of the error at the decision boundary flipped. The quantity that moved in the wrong direction is decision-relevant calibration: calibration near the action threshold, which is equivalently expected cost at the deployed threshold. Temperature scaling did not reduce resolution here, because the monotone map keeps the groups distinct.\n\nConfirming experiment: on an untouched test split, report per-group observed rates with intervals next to raw and scaled scores; report expected and realized cost at the fixed threshold 0.2 and at a threshold re-tuned on the calibration split; and plot cost against threshold for both score versions. Also show that fitting a per-group or Platt recalibration restores G1 above 0.2. A single global ECE cannot identify this mechanism.",
  "solution": "<p><strong>(a)</strong> \\(\\operatorname{logit}(0.30)=-0.847\\) and \\(\\operatorname{logit}(0.10)=-2.197\\). Dividing by 0.56 gives \\(-1.513\\) and \\(-3.924\\), that is, new scores \\(0.180\\) for G1 and \\(0.019\\) for G2.</p>\n<p><strong>(b)</strong> Using group rates \\(0.22\\) and \\(0.02\\):</p>\n<ul>\n<li>ECE: before \\(0.6|0.30-0.22|+0.4|0.10-0.02|=0.080\\); after \\(0.6|0.180-0.22|+0.4|0.019-0.02|\\approx0.024\\).</li>\n<li>Mean log loss: \\(0.3856\\to0.3584\\).</li>\n<li>Brier score: \\(0.1172\\to0.1117\\).</li>\n</ul>\n<p>All three improve.</p>\n<p><strong>(c)</strong> Before, G1 (0.30) is escalated, with expected loss \\(1-0.22=0.78\\) per ticket, and G2 (0.10) is not, with loss \\(4\\times0.02=0.08\\). The total is \\(600(0.78)+400(0.08)=500\\). After, G1's score of 0.180 falls below 0.2, so it is no longer escalated and its loss is \\(4\\times0.22=0.88\\) per ticket. The total becomes \\(600(0.88)+400(0.08)=560\\), which is 12% worse.</p>\n<p><strong>(d)</strong> ECE and proper scores average over all scores, but the decision depends only on which side of 0.2 each group falls. G1's true risk 0.22 is just above the threshold. The raw score overpredicted it on the correct side; the recalibrated score underpredicts it on the wrong side. The absolute gap shrank from 0.08 to 0.04, yet the sign of the error at the decision boundary flipped. The quantity that moved in the wrong direction is decision-relevant calibration: calibration near the action threshold, which is equivalently expected cost at the deployed threshold. Temperature scaling did not reduce resolution here, because the monotone map keeps the groups distinct.</p>\n<p>Confirming experiment: on an untouched test split, report per-group observed rates with intervals next to raw and scaled scores; report expected and realized cost at the fixed threshold 0.2 and at a threshold re-tuned on the calibration split; and plot cost against threshold for both score versions. Also show that fitting a per-group or Platt recalibration restores G1 above 0.2. A single global ECE cannot identify this mechanism.</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Cumulative problem 9.** An LLM abstention system calibrates split conformal at \\(\\alpha=0.1\\) on a static benchmark where each prompt comes from a distinct user and nonconformity scores are \\(|\\varepsilon|\\) with \\(\\varepsilon\\sim\\mathcal N(0,1)\\), giving threshold \\(z_{0.95}\\approx1.645\\). Live prompts arrive in bursts of 10 from the same user, with \\(\\varepsilon=u+e\\), a user effect \\(u\\sim\\mathcal N(0,0.25)\\), and \\(e\\sim\\mathcal N(0,0.75)\\), so each prompt's marginal score law is unchanged. (a) Compute the coverage for a user with \\(u=0\\) and a user with \\(u=1\\). (b) Compute live marginal coverage if the user-effect variance is instead 0.5 (with \\(e\\) variance still 0.75), and if it is 0 with \\(e\\) variance 0.5, giving undercoverage and overcoverage examples. (c) Explain why bursty collection can violate calibration/test exchangeability even in the unchanged-marginal case, state the assumptions needed for a group-level method, and say whether resampling alone restores a finite-sample guarantee.",
  "plain": "**(a)** Given \\(u\\), the score is \\(|u+e|\\) with \\(e\\sim\\mathcal N(0,0.75)\\), where \\(\\operatorname{sd}=0.866\\). For \\(u=0\\), coverage is \\(P(|e|\\le1.645)=2\\Phi(1.645/0.866)-1\\approx0.942\\). For \\(u=1\\), it is \\(\\Phi((1.645-1)/0.866)-\\Phi((-1.645-1)/0.866)\\approx0.772-0.001=0.771\\). Heavy users with a large effect are covered far below 90%, and those with \\(u\\approx0\\) above it.\n\n**(b)** With user variance 0.5, the total variance is 1.25, and coverage is \\(2\\Phi(1.645/\\sqrt{1.25})-1\\approx0.859\\): undercoverage. With no user effect and variance 0.5, coverage is \\(2\\Phi(1.645/\\sqrt{0.5})-1\\approx0.980\\): overcoverage. A violation determines neither the sign nor the size of the coverage error.\n\n**(c)** Even when the marginal law matches, prompts in a burst share \\(u\\). The test prompt is therefore not exchangeable with independently sampled calibration prompts: conditional on what came earlier in its burst, its score distribution differs. Realized coverage over a window also fluctuates more than under independence. In a simulation of 2,000 windows of 100 users by 10 prompts (NumPy seed 0), window coverage had mean 0.900 but SD 0.011, against 0.0095 for 1,000 independent prompts. Per-user coverage ranges from about 0.94 down to below 0.8.\n\nA group-level method must treat users (or sessions) as the exchangeable sampling unit, with calibration users drawn from the same user population as deployment. It must define a user-level score and target, such as the maximum score over a user's prompts, to cover all of a user's prompts simultaneously, or it must accept a user-marginal target. Row-level resampling of the calibration set cannot manufacture exchangeability or transfer a user-level guarantee to a prompt-level claim. A finite-sample guarantee requires the design assumption, not a bootstrap.",
  "solution": "<p><strong>(a)</strong> Given \\(u\\), the score is \\(|u+e|\\) with \\(e\\sim\\mathcal N(0,0.75)\\), where \\(\\operatorname{sd}=0.866\\). For \\(u=0\\), coverage is \\(P(|e|\\le1.645)=2\\Phi(1.645/0.866)-1\\approx0.942\\). For \\(u=1\\), it is \\(\\Phi((1.645-1)/0.866)-\\Phi((-1.645-1)/0.866)\\approx0.772-0.001=0.771\\). Heavy users with a large effect are covered far below 90%, and those with \\(u\\approx0\\) above it.</p>\n<p><strong>(b)</strong> With user variance 0.5, the total variance is 1.25, and coverage is \\(2\\Phi(1.645/\\sqrt{1.25})-1\\approx0.859\\): undercoverage. With no user effect and variance 0.5, coverage is \\(2\\Phi(1.645/\\sqrt{0.5})-1\\approx0.980\\): overcoverage. A violation determines neither the sign nor the size of the coverage error.</p>\n<p><strong>(c)</strong> Even when the marginal law matches, prompts in a burst share \\(u\\). The test prompt is therefore not exchangeable with independently sampled calibration prompts: conditional on what came earlier in its burst, its score distribution differs. Realized coverage over a window also fluctuates more than under independence. In a simulation of 2,000 windows of 100 users by 10 prompts (NumPy seed 0), window coverage had mean 0.900 but SD 0.011, against 0.0095 for 1,000 independent prompts. Per-user coverage ranges from about 0.94 down to below 0.8.</p>\n<p>A group-level method must treat users (or sessions) as the exchangeable sampling unit, with calibration users drawn from the same user population as deployment. It must define a user-level score and target, such as the maximum score over a user's prompts, to cover all of a user's prompts simultaneously, or it must accept a user-marginal target. Row-level resampling of the calibration set cannot manufacture exchangeability or transfer a user-level guarantee to a prompt-level claim. A finite-sample guarantee requires the design assumption, not a bootstrap.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Cumulative problem 10.** For the Brier score, derive the Bayes risk of an uninformative honest forecast at prevalence p. Compare p=0.5 and p=0.01. Explain why raw scores across these populations cannot be read as a pure comparison of forecast skill, and define a same-population baseline comparison instead.",
  "plain": "The honest constant Brier risk is \\(p(1-p)\\): 0.25 at p=0.5 and 0.0099 at p=0.01. Brier remains bounded and strictly proper. Compare forecasts and a declared base-rate baseline on the same target population; report both scores and prevalence. This calculation is not a universal impossibility theorem about every definition of base-rate invariance.",
  "solution": "<p>The honest constant Brier risk is \\(p(1-p)\\): 0.25 at p=0.5 and 0.0099 at p=0.01. Brier remains bounded and strictly proper. Compare forecasts and a declared base-rate baseline on the same target population; report both scores and prevalence. This calculation is not a universal impossibility theorem about every definition of base-rate invariance.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** Distinguish calibration, resolution, and marginal conformal coverage.",
  "plain": "Calibration compares forecast probabilities with conditional outcome frequencies. Resolution measures predictive information. Marginal conformal coverage averages over calibration/test draws and need not hold within every subgroup.",
  "solution": "<p>Calibration compares forecast probabilities with conditional outcome frequencies. Resolution measures predictive information. Marginal conformal coverage averages over calibration/test draws and need not hold within every subgroup.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Explain why split conformal uses ceil((n+1)(1−alpha)).",
  "plain": "Exchangeability makes the test-score rank uniform when scores are distinct. The rounded rank gives at least 1−alpha marginal coverage; ties can be handled conservatively, and rank n+1 uses an infinite threshold.",
  "solution": "<p>Exchangeability makes the test-score rank uniform when scores are distinct. The rounded rank gives at least 1−alpha marginal coverage; ties can be handled conservatively, and rank n+1 uses an infinite threshold.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** Two equally likely scores are 0.2 and 0.8, with true event rates 0.4 and 0.6. Find the population absolute calibration error before binning.",
  "plain": "Each score has absolute error 0.2, so the population error is 0.2. One pooled bin would hide it entirely.",
  "solution": "<p>Each score has absolute error 0.2, so the population error is 0.2. One pooled bin would hide it entirely.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.2
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-calibration experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does binned empirical ECE always overestimate the full population calibration error?",
  "plain": "No. Binning can cancel opposing conditional errors; finite-sample noise introduces a separate effect. Specify the calibration functional, bins, counts and sampling design.",
  "solution": "<p>No. Binning can cancel opposing conditional errors; finite-sample noise introduces a separate effect. Specify the calibration functional, bins, counts and sampling design.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Design a held-out calibration and conformal evaluation.",
  "plain": "Separate fitting, recalibration, conformal calibration and final testing as required; state the score and exchangeability assumptions; report proper scores, coverage, set size and subgroup diagnostics without converting marginal validity into a conditional claim.",
  "solution": "<p>Separate fitting, recalibration, conformal calibration and final testing as required; state the score and exchangeability assumptions; report proper scores, coverage, set size and subgroup diagnostics without converting marginal validity into a conditional claim.</p>"
}
});
