/* Authored probability solutions and offline checks. */
GU.answers("ps-01-random-variables-distributions", {
A1: {
  "statement": "**A1 · Foundation · paper — PMF and CDF.** Let \\(p_X(x)=cx\\) for \\(x\\in\\{1,2,3,4\\}\\). Find \\(c\\), write the complete CDF, and compute \\(P(1<X\\le3)\\).",
  "plain": "Normalization gives \\(c(1+2+3+4)=1\\), so \\(c=0.1\\). The CDF jumps to 0.1, 0.3, 0.6, and 1 at 1, 2, 3, and 4. The requested probability is \\(0.2+0.3=0.5\\).",
  "solution": "<p>Normalization gives \\(c(1+2+3+4)=1\\), so \\(c=0.1\\). The CDF jumps to 0.1, 0.3, 0.6, and 1 at 1, 2, 3, and 4. The requested probability is \\(0.2+0.3=0.5\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Normalizer c; requested interval probability",
      "type": "vec",
      "ans": [
        0.1,
        0.5
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Density versus probability.** Let \\(X\\sim\\operatorname{Uniform}(0,0.2)\\). Find \\(f_X(0.1)\\), \\(P(X=0.1)\\), and \\(P(0.08<X<0.12)\\). Explain why the three answers are different kinds of quantities.",
  "plain": "The density is 5, the point probability is 0, and the interval probability is \\(0.04/0.2=0.2\\). Density has inverse units, point mass is zero, and interval probability is area.",
  "solution": "<p>The density is 5, the point probability is 0, and the interval probability is \\(0.04/0.2=0.2\\). Density has inverse units, point mass is zero, and interval probability is area.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Density; point probability; interval probability",
      "type": "vec",
      "ans": [
        5,
        0,
        0.2
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — Moments.** Derive \\(\\operatorname{Var}(aX+b)=a^2\\operatorname{Var}(X)\\) directly from the definition.",
  "plain": "Since \\(E[aX+b]=a\\mu+b\\), subtracting the transformed mean gives \\(a(X-\\mu)\\); square and take expectation.",
  "solution": "<p>Since \\(E[aX+b]=a\\mu+b\\), subtracting the transformed mean gives \\(a(X-\\mu)\\); square and take expectation.</p>"
},
A4: {
  "statement": "**A4 · Core · paper — Binomial assumptions.** A moderation dataset contains 1,000 messages from 40 users, 25 messages each. Each user is independently high-risk (violation probability \\(0.38\\)) or low-risk (\\(0.02\\)) with probability \\(1/2\\), so the overall violation rate is \\(0.2\\). Compute the variance of the total violation count and compare it with the Binomial\\((1000,0.2)\\) variance. Explain why the count need not be binomial even though every row is binary.",
  "plain": "For one user, the law of total variance gives \\(\\operatorname{Var}=E[25p(1-p)]+\\operatorname{Var}(25p)=25(0.5\\cdot0.0196+0.5\\cdot0.2356)+625(0.0324)=3.19+20.25=23.44\\). Users are independent, so the total count has variance \\(40(23.44)=937.6\\), versus \\(1000(0.2)(0.8)=160\\) for a binomial — almost six times larger. The rows share user-level violation probabilities, so they are neither independent nor identically distributed; the same failure arises if messages from one user influence one another or if the selection of rows depends on user behavior.",
  "solution": "<p>For one user, the law of total variance gives \\(\\operatorname{Var}=E[25p(1-p)]+\\operatorname{Var}(25p)=25(0.5\\cdot0.0196+0.5\\cdot0.2356)+625(0.0324)=3.19+20.25=23.44\\). Users are independent, so the total count has variance \\(40(23.44)=937.6\\), versus \\(1000(0.2)(0.8)=160\\) for a binomial — almost six times larger. The rows share user-level violation probabilities, so they are neither independent nor identically distributed; the same failure arises if messages from one user influence one another or if the selection of rows depends on user behavior.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Overdispersion.** A per-minute request count has empirical mean 8 and variance 24. Compute its dispersion index, show that an equal mixture of Poisson\\((4)\\) and Poisson\\((12)\\) minutes reproduces both moments, and give a second process-level reason a single Poisson model may fail.",
  "plain": "The dispersion index is \\(24/8=3\\), while a Poisson model forces variance equal to the mean (index 1). For the equal mixture, the mean is \\((4+12)/2=8\\) and the variance is \\(E[\\operatorname{Var}]+\\operatorname{Var}(E)=8+\\tfrac12(4-8)^2+\\tfrac12(12-8)^2=8+16=24\\), so heterogeneous rates (for example quiet and busy minutes) explain both moments. A second reason is dependence: bursts of retries or shared incidents make arrivals cluster, which also inflates the variance above the mean.",
  "solution": "<p>The dispersion index is \\(24/8=3\\), while a Poisson model forces variance equal to the mean (index 1). For the equal mixture, the mean is \\((4+12)/2=8\\) and the variance is \\(E[\\operatorname{Var}]+\\operatorname{Var}(E)=8+\\tfrac12(4-8)^2+\\tfrac12(12-8)^2=8+16=24\\), so heterogeneous rates (for example quiet and busy minutes) explain both moments. A second reason is dependence: bursts of retries or shared incidents make arrivals cluster, which also inflates the variance above the mean.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Waiting times.** For \\(X\\sim\\operatorname{Exponential}(\\lambda)\\), find its median and compare it with its mean. Evaluate both for \\(\\lambda=0.5\\) per second.",
  "plain": "Solve \\(1-e^{-\\lambda m}=1/2\\) to get \\(m=(\\log2)/\\lambda\\), which is below the mean \\(1/\\lambda\\) because the long right tail pulls the mean up. For \\(\\lambda=0.5\\) per second, the median is \\(2\\log2\\approx1.386\\) s and the mean is \\(2\\) s.",
  "solution": "<p>Solve \\(1-e^{-\\lambda m}=1/2\\) to get \\(m=(\\log2)/\\lambda\\), which is below the mean \\(1/\\lambda\\) because the long right tail pulls the mean up. For \\(\\lambda=0.5\\) per second, the median is \\(2\\log2\\approx1.386\\) s and the mean is \\(2\\) s.</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Transformation.** If \\(X\\sim\\operatorname{Uniform}(0,1)\\) and \\(Y=X^2\\), derive \\(F_Y\\) and \\(f_Y\\). Identify where the density is largest.",
  "plain": "For \\(0\\le y\\le1\\), \\(F_Y(y)=P(X\\le\\sqrt y)=\\sqrt y\\), hence \\(f_Y(y)=1/(2\\sqrt y)\\). It diverges near zero while remaining integrable.",
  "solution": "<p>For \\(0\\le y\\le1\\), \\(F_Y(y)=P(X\\le\\sqrt y)=\\sqrt y\\), hence \\(f_Y(y)=1/(2\\sqrt y)\\). It diverges near zero while remaining integrable.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Categorical encoding.** Three classes occur with probabilities \\((0.5,0.3,0.2)\\). Compute the mean class ID under the labelling \\((0,1,2)\\) and under the relabelling \\((2,0,1)\\), explain why the numeric mean is representation-dependent, and give the one-hot mean instead.",
  "plain": "With labels \\((0,1,2)\\), \\(E[X]=0(0.5)+1(0.3)+2(0.2)=0.7\\). With labels \\((2,0,1)\\), \\(E[X]=2(0.5)+0(0.3)+1(0.2)=1.2\\). The same distribution gives different means because the numeric codes are arbitrary names. With one-hot encoding, the mean is the probability vector \\((0.5,0.3,0.2)\\), and relabelling only permutes its coordinates.",
  "solution": "<p>With labels \\((0,1,2)\\), \\(E[X]=0(0.5)+1(0.3)+2(0.2)=0.7\\). With labels \\((2,0,1)\\), \\(E[X]=2(0.5)+0(0.3)+1(0.2)=1.2\\). The same distribution gives different means because the numeric codes are arbitrary names. With one-hot encoding, the mean is the probability vector \\((0.5,0.3,0.2)\\), and relabelling only permutes its coordinates.</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Simulation.** Estimate \\(P(X\\ge8)\\) for \\(X\\sim\\operatorname{Binomial}(10,0.6)\\) using 50 independent batches of 10,000 draws from local RNG seeds 0 through 49. Compare the mean and standard deviation of the 50 estimates with the exact probability and its predicted Monte Carlo standard error.",
  "plain": "The exact probability is \\(\\sum_{k=8}^{10}{10\\choose k}0.6^k0.4^{10-k}\\approx0.16729\\). A 10,000-draw batch has predicted standard error \\(\\sqrt{p(1-p)/10000}\\approx0.00373\\). Across 50 independent batches, their sample mean should be near \\(0.16729\\) and their sample standard deviation near \\(0.00373\\); report Monte Carlo uncertainty rather than demanding exact agreement from the seeds.",
  "solution": "<p>The exact probability is \\(\\sum_{k=8}^{10}{10\\choose k}0.6^k0.4^{10-k}\\approx0.16729\\). A 10,000-draw batch has predicted standard error \\(\\sqrt{p(1-p)/10000}\\approx0.00373\\). Across 50 independent batches, their sample mean should be near \\(0.16729\\) and their sample standard deviation near \\(0.00373\\); report Monte Carlo uncertainty rather than demanding exact agreement from the seeds.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Model critique.** A team fits a Gaussian with mean 800 ms and standard deviation 150 ms to generation latency because its central histogram looks symmetric; in 10,000 logged requests, 37 exceeded 1,500 ms. Compute the Gaussian-implied \\(P(Y>1500)\\), compare it with the empirical rate, and list three checks needed before using any model to estimate a strict tail-latency service-level objective.",
  "plain": "The Gaussian gives \\(P(Y>1500)=P(Z>4.67)\\approx1.5\\times10^{-6}\\), so it predicts about 0.015 exceedances in 10,000 requests, while 37 (a rate of 0.0037) were observed — more than 2,000 times the prediction. Before estimating a tail SLO: (1) compare the fit in the tail with empirical quantiles or survival plots rather than only the center; (2) check support and censoring (latency is positive, and timeouts truncate the tail); (3) check for a mixture of request types, and for dependence or nonstationarity over time.",
  "solution": "<p>The Gaussian gives \\(P(Y&gt;1500)=P(Z&gt;4.67)\\approx1.5\\times10^{-6}\\), so it predicts about 0.015 exceedances in 10,000 requests, while 37 (a rate of 0.0037) were observed — more than 2,000 times the prediction. Before estimating a tail SLO: (1) compare the fit in the tail with empirical quantiles or survival plots rather than only the center; (2) check support and censoring (latency is positive, and timeouts truncate the tail); (3) check for a mixture of request types, and for dependence or nonstationarity over time.</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Numerics.** A sequence has 2,000 next-token probabilities, each equal to \\(0.6\\). Compute the base-10 exponent of their product and the natural-log likelihood, and explain why the product underflows in double precision while the log-likelihood remains usable.",
  "plain": "The product is \\(0.6^{2000}=10^{2000\\log_{10}0.6}\\approx10^{-443.7}\\), far below the smallest positive double (about \\(4.9\\times10^{-324}\\)), so floating-point multiplication returns 0. The log-likelihood is \\(2000\\ln0.6\\approx-1021.65\\), an ordinary finite number. Logs turn the product into a sum of moderate-sized terms, so comparisons and gradients remain usable.",
  "solution": "<p>The product is \\(0.6^{2000}=10^{2000\\log_{10}0.6}\\approx10^{-443.7}\\), far below the smallest positive double (about \\(4.9\\times10^{-324}\\)), so floating-point multiplication returns 0. The log-likelihood is \\(2000\\ln0.6\\approx-1021.65\\), an ordinary finite number. Logs turn the product into a sum of moderate-sized terms, so comparisons and gradients remain usable.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Transfer.** Match a distribution to each story and state one assumption whose failure invalidates it: (a) exactly one of five routing destinations is selected per request; (b) GPU faults are counted during a fixed 24-hour window under a constant independent rate; (c) independent attempts continue until the first schema-valid response; (d) waiting time to the next request under a homogeneous Poisson arrival process. Distinguish the geometric support convention you use.",
  "plain": "Use categorical for (a), Poisson for (b), geometric for (c), and exponential for (d). The choices respectively require one exclusive category with stable probabilities; a fixed exposure with approximately constant independent event rate; repeated comparable independent attempts with constant success probability; and a homogeneous Poisson arrival process. Changing routing probabilities, clustered faults, learning across attempts, or time-varying arrival intensity breaks the corresponding model.",
  "solution": "<p>Use categorical for (a), Poisson for (b), geometric for (c), and exponential for (d). The choices respectively require one exclusive category with stable probabilities; a fixed exposure with approximately constant independent event rate; repeated comparable independent attempts with constant success probability; and a homogeneous Poisson arrival process. Changing routing probabilities, clustered faults, learning across attempts, or time-varying arrival intensity breaks the corresponding model.</p>"
},
A13: {
  "statement": "**A13 · Stretch · paper — Distribution forensics.** Treat this as an unknown generator: with `random.Random(13)`, draw 10,000 values `floor(r.expovariate(1/3))`. Without using its definition, report the minimum and number of distinct values, the fraction of zeros, the sample mean and variance, and the lag-1 autocorrelation. Compare these with a Geometric model on \\(\\{0,1,\\ldots\\}\\) with success probability \\(1-e^{-1/3}\\), and explain why a good fit does not identify the mechanism.",
  "plain": "For this seed, the minimum is 0, there are 25 distinct integer values (maximum 28), the fraction of zeros is 0.2828, the mean is 2.5275, the variance is about 8.93, and the lag-1 autocorrelation is about \\(-0.007\\), well inside \\(\\pm2/\\sqrt{10000}=\\pm0.02\\). A Geometric model on \\(\\{0,1,\\ldots\\}\\) with \\(q=1-e^{-1/3}\\approx0.2835\\) predicts zero-mass 0.2835, mean \\((1-q)/q\\approx2.5277\\), and variance \\((1-q)/q^2\\approx8.917\\), all consistent. The evidence supports nonnegative integer support, a geometric tail, and no serial dependence, but many mechanisms (for example a genuine sequence of Bernoulli trials) produce the same law, so the fit does not identify how the values were generated.",
  "solution": "<p>For this seed, the minimum is 0, there are 25 distinct integer values (maximum 28), the fraction of zeros is 0.2828, the mean is 2.5275, the variance is about 8.93, and the lag-1 autocorrelation is about \\(-0.007\\), well inside \\(\\pm2/\\sqrt{10000}=\\pm0.02\\). A Geometric model on \\(\\{0,1,\\ldots\\}\\) with \\(q=1-e^{-1/3}\\approx0.2835\\) predicts zero-mass 0.2835, mean \\((1-q)/q\\approx2.5277\\), and variance \\((1-q)/q^2\\approx8.917\\), all consistent. The evidence supports nonnegative integer support, a geometric tail, and no serial dependence, but many mechanisms (for example a genuine sequence of Bernoulli trials) produce the same law, so the fit does not identify how the values were generated.</p>"
},
A14: {
  "statement": "**A14 · Stretch · paper — Sampler stress test.** A buggy categorical sampler rounds each cumulative probability to two decimals and divides by the last one before sampling. Compute its effective probabilities for weights \\((1,1,1)\\) and \\((996,2,2)\\), then design tests that reliably expose the defect in each case: give the number of draws needed and the expected size of the discrepancy in standard errors.",
  "plain": "For \\((1,1,1)\\), the cumulative values \\(1/3,2/3,1\\) round to \\(0.33,0.67,1.00\\), giving effective probabilities \\((0.33,0.34,0.33)\\). For \\((996,2,2)\\), all three cumulative values round to \\(1.00\\), giving \\((1,0,0)\\): the two rare classes are never sampled. In the skewed case, 100,000 draws should give about 200 of each rare class (standard error about 14), so observing 0 is decisive. In the balanced case, the middle class is off by \\(0.34-1/3\\approx0.0067\\). Its frequency has standard error \\(\\sqrt{(1/3)(2/3)/n}\\), which is 0.0015 at \\(n=10^5\\) (a 4.5-standard-error bias) and 0.00047 at \\(n=10^6\\) (about 14 standard errors), so a seeded per-class z-test or chi-square test with \\(10^6\\) draws exposes it reliably. Add exact deterministic tests: feed u values just below and above each true cumulative boundary, such as u = 0.332 (true label 0, buggy label 1) and u = 0.668 (true label 2, buggy label 1).",
  "solution": "<p>For \\((1,1,1)\\), the cumulative values \\(1/3,2/3,1\\) round to \\(0.33,0.67,1.00\\), giving effective probabilities \\((0.33,0.34,0.33)\\). For \\((996,2,2)\\), all three cumulative values round to \\(1.00\\), giving \\((1,0,0)\\): the two rare classes are never sampled. In the skewed case, 100,000 draws should give about 200 of each rare class (standard error about 14), so observing 0 is decisive. In the balanced case, the middle class is off by \\(0.34-1/3\\approx0.0067\\). Its frequency has standard error \\(\\sqrt{(1/3)(2/3)/n}\\), which is 0.0015 at \\(n=10^5\\) (a 4.5-standard-error bias) and 0.00047 at \\(n=10^6\\) (about 14 standard errors), so a seeded per-class z-test or chi-square test with \\(10^6\\) draws exposes it reliably. Add exact deterministic tests: feed u values just below and above each true cumulative boundary, such as u = 0.332 (true label 0, buggy label 1) and u = 0.668 (true label 2, buggy label 1).</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** How does a density differ from a point probability?",
  "plain": "A density integrates to event probabilities and may exceed one; a continuous point has probability zero. Atoms require probability masses.",
  "solution": "<p>A density integrates to event probabilities and may exceed one; a continuous point has probability zero. Atoms require probability masses.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the mean and variance of a binomial count using indicators.",
  "plain": "For n independent Bernoulli(p) indicators, linearity gives np. Summing variances with zero covariances gives np(1−p).",
  "solution": "<p>For n independent Bernoulli(p) indicators, linearity gives np. Summing variances with zero covariances gives np(1−p).</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** Find the variance of Binomial(20, 0.3).",
  "plain": "20×0.3×0.7=4.2.",
  "solution": "<p>20×0.3×0.7=4.2.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 4.2
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-distributions experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Must a sample average estimate a finite population mean for every named distribution?",
  "plain": "No. A Cauchy distribution has no finite mean; the usual finite-mean law of large numbers does not apply.",
  "solution": "<p>No. A Cauchy distribution has no finite mean; the usual finite-mean law of large numbers does not apply.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Specify a model for generation lengths with a hard token cap.",
  "plain": "Define whether observed length includes termination or censoring, distinguish a point mass at the cap from natural stopping, and compare empirical survival/tail probabilities with the model.",
  "solution": "<p>Define whether observed length includes termination or censoring, distinguish a point mass at the cap from natural stopping, and compare empirical survival/tail probabilities with the model.</p>"
}
});
