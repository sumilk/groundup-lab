/* Authored probability solutions and offline checks. */
GU.answers("ps-06-estimation-likelihood-fisher", {
A1: {
  "statement": "**A1 · Foundation · paper — Language.** Make a six-column table—data, target population, estimand, estimator, realized estimate, and repeated-sampling distribution—for: (a) accuracy on a fixed 2,000-item benchmark, (b) mean latency for the next month estimated from 500 randomly sampled requests, and (c) mean benchmark accuracy over fresh training runs estimated from five independent seeds. State which apparent \"rows\" are and are not sampling units.",
  "plain": "In (a), the fixed benchmark is the target and there is no item-sampling uncertainty unless it represents a larger item population; the estimate is deterministic conditional on model and benchmark. In (b), requests are sampling units and the sampling distribution repeats the 500-request draw from next month's request population. In (c), training runs are units and the sampling distribution repeats five seeds; benchmark items are fixed unless the target also includes new items. In every case, the estimand is a population quantity, the estimator is a rule, and the estimate is its realized value.",
  "solution": "<p>In (a), the fixed benchmark is the target and there is no item-sampling uncertainty unless it represents a larger item population; the estimate is deterministic conditional on model and benchmark. In (b), requests are sampling units and the sampling distribution repeats the 500-request draw from next month&#x27;s request population. In (c), training runs are units and the sampling distribution repeats five seeds; benchmark items are fixed unless the target also includes new items. In every case, the estimand is a population quantity, the estimator is a rule, and the estimate is its realized value.</p>"
},
A2: {
  "statement": "**A2 · Foundation · paper — Bias and MSE.** For iid observations with \\(\\mu=8\\), \\(\\sigma^2=4\\), and \\(n=16\\), compute the bias, variance, and MSE of \\(0.9\\bar X+1\\) as an estimator of \\(\\mu\\), and compare its MSE with that of \\(\\bar X\\).",
  "plain": "\\(E[0.9\\bar X+1]=0.9(8)+1=8.2\\), so the bias is \\(0.2\\) (in general \\(1-0.1\\mu\\)). The variance is \\(0.81(4/16)=0.2025\\), so the MSE is \\(0.2025+0.04=0.2425\\), slightly below \\(\\operatorname{MSE}(\\bar X)=4/16=0.25\\). The advantage is local: \\((1-0.1\\mu)^2<0.25-0.2025=0.0475\\) holds only for \\(|\\mu-10|<2.18\\), i.e. \\(7.82<\\mu<12.18\\).",
  "solution": "<p>\\(E[0.9\\bar X+1]=0.9(8)+1=8.2\\), so the bias is \\(0.2\\) (in general \\(1-0.1\\mu\\)). The variance is \\(0.81(4/16)=0.2025\\), so the MSE is \\(0.2025+0.04=0.2425\\), slightly below \\(\\operatorname{MSE}(\\bar X)=4/16=0.25\\). The advantage is local: \\((1-0.1\\mu)^2&lt;0.25-0.2025=0.0475\\) holds only for \\(|\\mu-10|&lt;2.18\\), i.e. \\(7.82&lt;\\mu&lt;12.18\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "bias; variance; MSE",
      "type": "vec",
      "ans": [
        0.2,
        0.2025,
        0.2425
      ]
    }
  ],
  "hints": {
    "value": "Compute E[0.9X̄+1] at μ=8 first; the variance is 0.9² times σ²/n; MSE adds the squared bias."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — Bernoulli likelihood.** Derive and evaluate the likelihood, log-likelihood, score, MLE, and plug-in standard error for 24 successes in 40 trials.",
  "plain": "With \\(s=24,n=40\\), \\(\\hat p=0.6\\). The maximized log-likelihood is \\(24\\log0.6+16\\log0.4\\), the score vanishes at \\(0.6\\), and plug-in standard error is \\(\\sqrt{0.6(0.4)/40}\\).",
  "solution": "<p>With \\(s=24,n=40\\), \\(\\hat p=0.6\\). The maximized log-likelihood is \\(24\\log0.6+16\\log0.4\\), the score vanishes at \\(0.6\\), and plug-in standard error is \\(\\sqrt{0.6(0.4)/40}\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "MLE; plug-in standard error",
      "type": "vec",
      "ans": [
        0.6,
        0.07745966692414834
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A4: {
  "statement": "**A4 · Foundation · paper — Gaussian estimation.** For \\(x=(1,2,2,5)\\), compute the Gaussian mean MLE, variance MLE, and unbiased variance estimate. Explain why the two variance denominators differ even though both estimators use the same squared deviations.",
  "plain": "\\(\\hat\\mu=2.5\\) and the squared deviations sum to \\(9\\). Therefore \\(\\hat\\sigma^2_{\\mathrm{MLE}}=9/4=2.25\\), while \\(s^2=9/3=3\\). Estimating the mean consumes one residual degree of freedom; unbiasedness, not likelihood maximization, produces the \\(n-1\\) denominator.",
  "solution": "<p>\\(\\hat\\mu=2.5\\) and the squared deviations sum to \\(9\\). Therefore \\(\\hat\\sigma^2_{\\mathrm{MLE}}=9/4=2.25\\), while \\(s^2=9/3=3\\). Estimating the mean consumes one residual degree of freedom; unbiasedness, not likelihood maximization, produces the \\(n-1\\) denominator.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Competing estimators.** For iid observations with mean \\(\\mu\\) and variance \\(\\sigma^2\\), compare the MSE of \\(\\bar X_n\\) and \\(0.8\\bar X_n\\). Derive the exact region of \\(\\mu\\) where shrinkage improves MSE and interpret that region in standard-error units.",
  "plain": "The unshrunk MSE is \\(\\sigma^2/n\\). For \\(0.8\\bar X_n\\), it is \\(0.64\\sigma^2/n+0.04\\mu^2\\). Shrinkage wins exactly when \\(0.04\\mu^2<0.36\\sigma^2/n\\), or \\(|\\mu|<3\\sigma/\\sqrt n\\): the true mean lies within three standard errors of the shrinkage target zero.",
  "solution": "<p>The unshrunk MSE is \\(\\sigma^2/n\\). For \\(0.8\\bar X_n\\), it is \\(0.64\\sigma^2/n+0.04\\mu^2\\). Shrinkage wins exactly when \\(0.04\\mu^2&lt;0.36\\sigma^2/n\\), or \\(|\\mu|&lt;3\\sigma/\\sqrt n\\): the true mean lies within three standard errors of the shrinkage target zero.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Exponential rate.** For iid Exponential\\((\\lambda)\\) observations \\((0.5,1.5,2,4)\\), derive the MLE, score, and Fisher information in general, then evaluate \\(\\hat\\lambda\\), the Cramér–Rao bound \\(\\lambda^2/n\\) at \\(\\hat\\lambda\\), and the plug-in asymptotic standard error.",
  "plain": "The log-likelihood is \\(n\\log\\lambda-\\lambda\\sum x_i\\), the score is \\(n/\\lambda-\\sum x_i\\), and the one-observation information is \\(1/\\lambda^2\\), so \\(I_n=n/\\lambda^2\\) and the Cramér–Rao bound is \\(\\lambda^2/n\\). Here \\(\\sum x_i=8\\), \\(n=4\\), \\(\\bar x=2\\), so \\(\\hat\\lambda=0.5\\). The plug-in bound is \\(0.25/4=0.0625\\) and the standard error is \\(0.25\\). With only four observations this is a rough guide: \\(1/\\bar X\\) is biased upward in finite samples (\\(E[\\hat\\lambda]=n\\lambda/(n-1)\\)).",
  "solution": "<p>The log-likelihood is \\(n\\log\\lambda-\\lambda\\sum x_i\\), the score is \\(n/\\lambda-\\sum x_i\\), and the one-observation information is \\(1/\\lambda^2\\), so \\(I_n=n/\\lambda^2\\) and the Cramér–Rao bound is \\(\\lambda^2/n\\). Here \\(\\sum x_i=8\\), \\(n=4\\), \\(\\bar x=2\\), so \\(\\hat\\lambda=0.5\\). The plug-in bound is \\(0.25/4=0.0625\\) and the standard error is \\(0.25\\). With only four observations this is a rough guide: \\(1/\\bar X\\) is biased upward in finite samples (\\(E[\\hat\\lambda]=n\\lambda/(n-1)\\)).</p>",
  "fields": [
    {
      "id": "value",
      "label": "MLE; plug-in bound; standard error",
      "type": "vec",
      "ans": [
        0.5,
        0.0625,
        0.25
      ]
    }
  ],
  "hints": {
    "value": "Sum the observations and divide n by the sum; then plug λ̂ into λ²/n and take the square root."
  }
},
A7: {
  "statement": "**A7 · Core · paper — Sufficiency.** Factor the likelihood for (a) iid Bernoulli\\((p)\\), (b) iid Poisson\\((\\lambda)\\), and (c) iid Gaussian\\((\\mu,\\sigma^2)\\) with both parameters unknown. Identify a sufficient statistic in each case, then give one concrete change—time-varying success probabilities, exposure-varying Poisson rates, or an ordered autoregressive Gaussian model—for which that compression loses information.",
  "plain": "Factorization makes Bernoulli depend on \\(\\sum X_i\\), Poisson on \\(\\sum X_i\\), and Gaussian forms on sums and squared sums depending on which parameters are unknown. Time variation, dependence, or additional parameters can make order or other details informative.",
  "solution": "<p>Factorization makes Bernoulli depend on \\(\\sum X_i\\), Poisson on \\(\\sum X_i\\), and Gaussian forms on sums and squared sums depending on which parameters are unknown. Time variation, dependence, or additional parameters can make order or other details informative.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Consistency.** For iid data with mean \\(\\mu\\) and variance \\(\\sigma^2\\), let \\(\\tilde\\mu_n=n\\bar X_n/(n+1)\\). Derive its bias and variance, prove it is consistent by controlling them separately, and evaluate bias, variance, and MSE at \\(\\mu=3,\\sigma^2=4,n=49\\).",
  "plain": "\\(E[\\tilde\\mu_n]=n\\mu/(n+1)\\), so the bias is \\(-\\mu/(n+1)\\to0\\), and \\(\\operatorname{Var}(\\tilde\\mu_n)=n\\sigma^2/(n+1)^2\\to0\\). For any \\(\\varepsilon>0\\) and \\(n\\) large enough that \\(|\\mathrm{bias}|<\\varepsilon/2\\), the triangle inequality and Chebyshev give \\(P(|\\tilde\\mu_n-\\mu|>\\varepsilon)\\le P(|\\tilde\\mu_n-E\\tilde\\mu_n|>\\varepsilon/2)\\le4\\operatorname{Var}(\\tilde\\mu_n)/\\varepsilon^2\\to0\\). At \\(\\mu=3,\\sigma^2=4,n=49\\): bias \\(=-3/50=-0.06\\), variance \\(=196/2500=0.0784\\), MSE \\(=0.0784+0.0036=0.082\\).",
  "solution": "<p>\\(E[\\tilde\\mu_n]=n\\mu/(n+1)\\), so the bias is \\(-\\mu/(n+1)\\to0\\), and \\(\\operatorname{Var}(\\tilde\\mu_n)=n\\sigma^2/(n+1)^2\\to0\\). For any \\(\\varepsilon&gt;0\\) and \\(n\\) large enough that \\(|\\mathrm{bias}|&lt;\\varepsilon/2\\), the triangle inequality and Chebyshev give \\(P(|\\tilde\\mu_n-\\mu|&gt;\\varepsilon)\\le P(|\\tilde\\mu_n-E\\tilde\\mu_n|&gt;\\varepsilon/2)\\le4\\operatorname{Var}(\\tilde\\mu_n)/\\varepsilon^2\\to0\\). At \\(\\mu=3,\\sigma^2=4,n=49\\): bias \\(=-3/50=-0.06\\), variance \\(=196/2500=0.0784\\), MSE \\(=0.0784+0.0036=0.082\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "bias; variance; MSE",
      "type": "vec",
      "ans": [
        -0.06,
        0.0784,
        0.082
      ]
    }
  ],
  "hints": {
    "value": "The bias is −μ/(n+1) and the variance is nσ²/(n+1)²; MSE adds the squared bias."
  }
},
A9: {
  "statement": "**A9 · Core · paper — Delta method.** For \\(X_i\\sim\\operatorname{Exponential}(\\lambda)\\), use \\(\\hat\\lambda=1/\\bar X\\) to derive the asymptotic standard error of \\(\\log\\hat\\lambda\\). At \\(\\lambda=2,n=100\\), run 10,000 repetitions with seed 2026; compare empirical standard deviation with the approximation and report Monte Carlo error for the estimated standard deviation.",
  "plain": "Since \\(\\sqrt n(\\hat\\lambda-\\lambda)\\Rightarrow N(0,\\lambda^2)\\) and \\(g'(\\lambda)=1/\\lambda\\), \\(\\operatorname{SE}(\\log\\hat\\lambda)\\approx1/\\sqrt n=0.1\\), independent of \\(\\lambda\\). A run with numpy's default_rng(2026), drawing a 10,000×100 array of Exponential(scale 0.5) values, gave an empirical standard deviation of the 10,000 log estimates of about 0.1006. Its Monte Carlo standard error is approximately \\(s/\\sqrt{2(10{,}000-1)}\\approx0.00071\\), so the approximation 0.1 is within one Monte Carlo standard error.",
  "solution": "<p>Since \\(\\sqrt n(\\hat\\lambda-\\lambda)\\Rightarrow N(0,\\lambda^2)\\) and \\(g&#x27;(\\lambda)=1/\\lambda\\), \\(\\operatorname{SE}(\\log\\hat\\lambda)\\approx1/\\sqrt n=0.1\\), independent of \\(\\lambda\\). A run with numpy&#x27;s default_rng(2026), drawing a 10,000×100 array of Exponential(scale 0.5) values, gave an empirical standard deviation of the 10,000 log estimates of about 0.1006. Its Monte Carlo standard error is approximately \\(s/\\sqrt{2(10{,}000-1)}\\approx0.00071\\), so the approximation 0.1 is within one Monte Carlo standard error.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Non-identifiability.** Take \\(X_i\\sim\\mathcal N(\\theta^2,1)\\) with data \\((3.1,4.2,3.7,5.0)\\). Find every maximizer of the likelihood in \\(\\theta\\), show they give identical likelihood values, and distinguish prediction identifiability (the predictive law of a new \\(X\\)) from parameter identifiability.",
  "plain": "The log-likelihood is \\(-\\tfrac12\\sum_i(x_i-\\theta^2)^2\\) plus a constant, maximized when \\(\\theta^2=\\bar x=4.0\\), so at \\(\\theta=2\\) and \\(\\theta=-2\\). Because the model depends on \\(\\theta\\) only through \\(\\theta^2\\), the likelihood is exactly equal at both, and no sample size can separate them: \\(\\theta\\) is not identifiable. The observable law \\(\\mathcal N(\\theta^2,1)\\) is identified, though: both maxima give the same plug-in predictive \\(\\mathcal N(4,1)\\) for a new observation. Reparameterizing by \\(\\phi=\\theta^2\\ge0\\) restores identifiability; questions about the sign of \\(\\theta\\) cannot be answered from data.",
  "solution": "<p>The log-likelihood is \\(-\\tfrac12\\sum_i(x_i-\\theta^2)^2\\) plus a constant, maximized when \\(\\theta^2=\\bar x=4.0\\), so at \\(\\theta=2\\) and \\(\\theta=-2\\). Because the model depends on \\(\\theta\\) only through \\(\\theta^2\\), the likelihood is exactly equal at both, and no sample size can separate them: \\(\\theta\\) is not identifiable. The observable law \\(\\mathcal N(\\theta^2,1)\\) is identified, though: both maxima give the same plug-in predictive \\(\\mathcal N(4,1)\\) for a new observation. Reparameterizing by \\(\\phi=\\theta^2\\ge0\\) restores identifiability; questions about the sign of \\(\\theta\\) cannot be answered from data.</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Boundary behavior.** For Bernoulli\\((0.02)\\) with \\(n=20\\), simulate 10,000 datasets (seed 0). Report the fraction with \\(\\hat p=0\\) (compare with the exact \\(0.98^{20}\\)), the empirical standard deviation of \\(\\hat p\\) versus \\(\\sqrt{p(1-p)/n}\\), the average plug-in standard error, and the coverage of the Wald interval \\(\\hat p\\pm1.96\\,\\widehat{\\mathrm{SE}}\\). Explain the zero-standard-error pathology.",
  "plain": "Exactly, \\(P(\\hat p=0)=0.98^{20}\\approx0.668\\); a numpy default_rng(0) run gave 0.667. The empirical SD of \\(\\hat p\\) was about 0.0315, matching \\(\\sqrt{0.02(0.98)/20}\\approx0.0313\\), but the average plug-in SE was only about 0.0175 because two-thirds of datasets report SE 0. Wald coverage of \\(p=0.02\\) was about 0.33 (exactly 0.332): whenever \\(\\hat p=0\\) the interval collapses to \\(\\{0\\}\\) and misses. The Taylor/Gaussian approximation assumes an interior parameter and enough successes; at the boundary use an exact (Clopper–Pearson) or Wilson interval, which remains nondegenerate.",
  "solution": "<p>Exactly, \\(P(\\hat p=0)=0.98^{20}\\approx0.668\\); a numpy default_rng(0) run gave 0.667. The empirical SD of \\(\\hat p\\) was about 0.0315, matching \\(\\sqrt{0.02(0.98)/20}\\approx0.0313\\), but the average plug-in SE was only about 0.0175 because two-thirds of datasets report SE 0. Wald coverage of \\(p=0.02\\) was about 0.33 (exactly 0.332): whenever \\(\\hat p=0\\) the interval collapses to \\(\\{0\\}\\) and misses. The Taylor/Gaussian approximation assumes an interior parameter and enough successes; at the boundary use an exact (Clopper–Pearson) or Wilson interval, which remains nondegenerate.</p>",
  "fields": [
    {
      "id": "value",
      "label": "P(p̂=0) exact; Wald coverage (exact)",
      "type": "vec",
      "ans": [
        0.6676079717550942,
        0.33179234934865914
      ]
    }
  ],
  "hints": {
    "value": "P(p̂=0)=0.98^20. Wald covers 0.02 only for success counts whose interval contains 0.02; sum their binomial probabilities."
  }
},
A12: {
  "statement": "**A12 · Stretch · paper — Misspecified likelihood.** Generate \\(n=200\\) observations from \\(0.8N(0,1)+0.2N(5,1)\\), fit one Gaussian by maximum likelihood, and repeat 2,000 times (seed 2026). Report (i) the average model-based standard error \\(\\hat\\sigma/\\sqrt n\\) for the mean versus the empirical SD of the fitted means, (ii) the fitted versus true probabilities of \\((1.5,3.5)\\) and of \\(X>6\\), and (iii) the held-out average log density of the fitted Gaussian versus the true mixture.",
  "plain": "The mixture has mean 1 and variance \\(0.8+0.2\\cdot26-1=5\\), so the Gaussian MLE targets \\(\\mathcal N(1,5)\\) and the mean's standard error is \\(\\sqrt{5/200}\\approx0.158\\). In a numpy default_rng(2026) run, the average model-based SE was 0.158 and the empirical SD of fitted means was 0.161: for the mean alone, the misspecified Fisher SE is nearly right because the mean is still a well-estimated moment. The density is badly wrong: \\(\\mathcal N(1,5)\\) puts 0.280 on the trough \\((1.5,3.5)\\) where the mixture has 0.067, and 0.013 above 6 where the mixture has 0.032. Held-out average log density was about \\(-2.23\\) for the fitted Gaussian versus \\(-1.91\\) for the true mixture. Parameter curvature can look fine while predictive and tail claims fail.",
  "solution": "<p>The mixture has mean 1 and variance \\(0.8+0.2\\cdot26-1=5\\), so the Gaussian MLE targets \\(\\mathcal N(1,5)\\) and the mean&#x27;s standard error is \\(\\sqrt{5/200}\\approx0.158\\). In a numpy default_rng(2026) run, the average model-based SE was 0.158 and the empirical SD of fitted means was 0.161: for the mean alone, the misspecified Fisher SE is nearly right because the mean is still a well-estimated moment. The density is badly wrong: \\(\\mathcal N(1,5)\\) puts 0.280 on the trough \\((1.5,3.5)\\) where the mixture has 0.067, and 0.013 above 6 where the mixture has 0.032. Held-out average log density was about \\(-2.23\\) for the fitted Gaussian versus \\(-1.91\\) for the true mixture. Parameter curvature can look fine while predictive and tail claims fail.</p>"
},
A13: {
  "statement": "**A13 · Stretch · paper — Clustered estimation.** Simulate 40 tasks with 25 paired prompt scores per task, true mean difference zero, and intraclass correlation 0.2. Compare row-iid, task-cluster, and paired-task uncertainty calculations over 2,000 repetitions; name the population targeted by each.",
  "plain": "Row-iid formulas omit within-cluster covariance. Cluster-aware methods use independent clusters; pairing uses within-unit differences. The correct comparison depends on the intended population of new prompts, users, or tasks.",
  "solution": "<p>Row-iid formulas omit within-cluster covariance. Cluster-aware methods use independent clusters; pairing uses within-unit differences. The correct comparison depends on the intended population of new prompts, users, or tasks.</p>"
},
A14: {
  "statement": "**A14 · Stretch · paper — Post-selection estimation.** Simulate 5, 20, and 100 configurations that all have true accuracy 0.70, each evaluated on 200 validation items (score SE \\(\\sqrt{0.7\\cdot0.3/200}\\)), select the best validation score, and evaluate the selected configuration on 200 fresh test items. Over 5,000 repetitions (seed 2026), report mean validation optimism and mean test-set error for the selected configuration, then repeat with candidate-score correlations 0, 0.5, and 0.9.",
  "plain": "Using Gaussian score noise with SD 0.0324 and equicorrelation \\(\\rho\\), a numpy default_rng(2026) run gave mean validation optimism (best score minus 0.70) of: \\(\\rho=0\\): 0.038, 0.060, 0.082 for 5, 20, 100 candidates; \\(\\rho=0.5\\): 0.027, 0.043, 0.057; \\(\\rho=0.9\\): 0.012, 0.019, 0.027. These track \\(\\sqrt{1-\\rho}\\,\\sigma\\,E[\\max_K Z]\\) with \\(E[\\max Z]\\approx1.16,1.87,2.51\\). The fresh test score of the selected configuration averaged within 0.001 of 0.70 in every setting: an untouched test set removes the selection bias. More candidates raise optimism; correlation reduces the effective number of independent chances.",
  "solution": "<p>Using Gaussian score noise with SD 0.0324 and equicorrelation \\(\\rho\\), a numpy default_rng(2026) run gave mean validation optimism (best score minus 0.70) of: \\(\\rho=0\\): 0.038, 0.060, 0.082 for 5, 20, 100 candidates; \\(\\rho=0.5\\): 0.027, 0.043, 0.057; \\(\\rho=0.9\\): 0.012, 0.019, 0.027. These track \\(\\sqrt{1-\\rho}\\,\\sigma\\,E[\\max_K Z]\\) with \\(E[\\max Z]\\approx1.16,1.87,2.51\\). The fresh test score of the selected configuration averaged within 0.001 of 0.70 in every setting: an untouched test set removes the selection bias. More candidates raise optimism; correlation reduces the effective number of independent chances.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** How is likelihood different from a posterior density?",
  "plain": "Likelihood varies the parameter with observed data fixed; it need not integrate to one over parameters. A posterior additionally uses a prior and normalizes.",
  "solution": "<p>Likelihood varies the parameter with observed data fixed; it need not integrate to one over parameters. A posterior additionally uses a prior and normalizes.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the interior Bernoulli maximum-likelihood estimate.",
  "plain": "Differentiate s log p+(n−s) log(1−p), set s/p−(n−s)/(1−p)=0, and obtain p=s/n. Handle s=0,n as boundary optima.",
  "solution": "<p>Differentiate s log p+(n−s) log(1−p), set s/p−(n−s)/(1−p)=0, and obtain p=s/n. Handle s=0,n as boundary optima.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** There are 12 successes in 20 Bernoulli trials. Find the MLE.",
  "plain": "12/20=0.6.",
  "solution": "<p>12/20=0.6.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.6
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-likelihood experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does an all-success sample justify zero uncertainty because its plug-in standard error is zero?",
  "plain": "No. The plug-in normal approximation is degenerate at the boundary. An appropriate exact interval or explicitly chosen Bayesian model retains uncertainty.",
  "solution": "<p>No. The plug-in normal approximation is degenerate at the boundary. An appropriate exact interval or explicitly chosen Bayesian model retains uncertainty.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Audit a reported efficiency claim for a parameter estimator.",
  "plain": "State the model, parameter, regularity assumptions and finite-sample design; compare bias and variance with an oracle and distinguish an asymptotic information bound from a guarantee at the observed n.",
  "solution": "<p>State the model, parameter, regularity assumptions and finite-sample design; compare bias and variance with an oracle and distinguish an asymptotic information bound from a guarantee at the observed n.</p>"
}
});
