/* Authored probability solutions and offline checks. */
GU.answers("ps-16-causal-inference-missing-data", {
A1: {
  "statement": "**A1 · Foundation · paper — Estimands.** A new router can be deployed to all users, and \\(Y(1),Y(0)\\) are next-week resolution indicators. Write ATE, ATT, and \\(\\operatorname{CATE}(x)\\), then match them to: “effect for all eligible users,” “effect for users already routed,” and “effect for enterprise users with covariates \\(X=x\\).”",
  "plain": "\\(\\operatorname{ATE}=E[Y(1)-Y(0)]\\) targets all eligible users, \\(\\operatorname{ATT}=E[Y(1)-Y(0)\\mid A=1]\\) targets already-routed users, and \\(\\operatorname{CATE}(x)=E[Y(1)-Y(0)\\mid X=x]\\) targets the named enterprise covariate cell. The estimand is fixed by the population in the question, not by the available estimator.",
  "solution": "<p>\\(\\operatorname{ATE}=E[Y(1)-Y(0)]\\) targets all eligible users, \\(\\operatorname{ATT}=E[Y(1)-Y(0)\\mid A=1]\\) targets already-routed users, and \\(\\operatorname{CATE}(x)=E[Y(1)-Y(0)\\mid X=x]\\) targets the named enterprise covariate cell. The estimand is fixed by the population in the question, not by the available estimator.</p>"
},
A2: {
  "statement": "**A2 · Foundation · paper — Structures.** For the path \\(A-B-C\\), classify \\(A\\to B\\to C\\), \\(A\\leftarrow B\\leftarrow C\\), \\(A\\leftarrow B\\to C\\), and \\(A\\to B\\leftarrow C\\). State whether \\(A\\perp C\\) marginally and conditional on \\(B\\) in each.",
  "plain": "Under the DAG Markov assumptions, conditioning on the middle node blocks a chain or fork, while a collider blocks the path unless it or a descendant is conditioned on. An open path permits dependence; guaranteed dependence additionally needs faithfulness/nondegeneracy, and other open paths in a larger graph must also be considered.",
  "solution": "<p>Under the DAG Markov assumptions, conditioning on the middle node blocks a chain or fork, while a collider blocks the path unless it or a descendant is conditioned on. An open path permits dependence; guaranteed dependence additionally needs faithfulness/nondegeneracy, and other open paths in a larger graph must also be considered.</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — d-separation.** In the DAG \\(C\\to T,C\\to Y,T\\to M,M\\to Y,T\\to S,Y\\to S\\), decide whether each path from \\(T\\) to \\(Y\\) is open given \\(\\varnothing\\), \\(\\{C\\}\\), and \\(\\{C,M\\}\\). Then explain what conditioning on selection node \\(S\\) opens.",
  "plain": "There are three paths: \\(T\\leftarrow C\\to Y\\) (fork), \\(T\\to M\\to Y\\) (chain), \\(T\\to S\\leftarrow Y\\) (collider). Given \\(\\varnothing\\): fork open, chain open, collider blocked. Given \\(\\{C\\}\\): fork blocked, chain open, collider blocked. Given \\(\\{C,M\\}\\): all three blocked, so \\(T\\) and \\(Y\\) are d-separated. Conditioning on \\(S\\) opens \\(T\\to S\\leftarrow Y\\), creating a non-causal association between \\(T\\) and \\(Y\\).",
  "solution": "<p>Paths from \\(T\\) to \\(Y\\): (1) \\(T\\leftarrow C\\to Y\\), a fork at \\(C\\); (2) \\(T\\to M\\to Y\\), a chain through \\(M\\); (3) \\(T\\to S\\leftarrow Y\\), a collider at \\(S\\).</p><ul><li>\\(\\varnothing\\): (1) open, (2) open, (3) blocked.</li><li>\\(\\{C\\}\\): (1) blocked, (2) open, (3) blocked. Only the causal path remains.</li><li>\\(\\{C,M\\}\\): (1) blocked, (2) blocked, (3) blocked. \\(T\\) and \\(Y\\) are d-separated, but the mediated effect has been removed too.</li></ul><p>Conditioning on the selection node \\(S\\) opens path (3), a collider, so any analysis restricted to selected rows has a non-causal association between \\(T\\) and \\(Y\\) even after adjusting for \\(C\\).</p>"
},
A4: {
  "statement": "**A4 · Foundation · paper — Backdoor sets.** Add \\(Z\\to T,Z\\to Y\\) to the DAG in problem 3. Evaluate candidate sets \\(\\varnothing,\\{C\\},\\{Z\\},\\{C,Z\\},\\{C,Z,M\\},\\{C,Z,S\\}\\) for the total effect of \\(T\\) on \\(Y\\), rejecting each invalid set by a named open path or descendant.",
  "plain": "Backdoor paths are \\(T\\leftarrow C\\to Y\\) and \\(T\\leftarrow Z\\to Y\\). \\(\\varnothing\\): both open, invalid. \\(\\{C\\}\\): \\(T\\leftarrow Z\\to Y\\) open, invalid. \\(\\{Z\\}\\): \\(T\\leftarrow C\\to Y\\) open, invalid. \\(\\{C,Z\\}\\): valid. \\(\\{C,Z,M\\}\\): \\(M\\) is a descendant of \\(T\\) (a mediator), invalid. \\(\\{C,Z,S\\}\\): \\(S\\) is a descendant of \\(T\\) and a collider, which opens \\(T\\to S\\leftarrow Y\\), invalid.",
  "solution": "<p>The backdoor paths are \\(T\\leftarrow C\\to Y\\) and \\(T\\leftarrow Z\\to Y\\).</p><ul><li>\\(\\varnothing\\): both backdoor paths are open. Invalid.</li><li>\\(\\{C\\}\\): \\(T\\leftarrow Z\\to Y\\) stays open. Invalid.</li><li>\\(\\{Z\\}\\): \\(T\\leftarrow C\\to Y\\) stays open. Invalid.</li><li>\\(\\{C,Z\\}\\): blocks both and contains no descendant of \\(T\\). Valid.</li><li>\\(\\{C,Z,M\\}\\): \\(M\\) is a descendant of \\(T\\) (clause 2); conditioning on it blocks the causal path \\(T\\to M\\to Y\\). Invalid for the total effect.</li><li>\\(\\{C,Z,S\\}\\): \\(S\\) is a descendant of \\(T\\), and conditioning on it opens the collider path \\(T\\to S\\leftarrow Y\\). Invalid.</li></ul>"
},
A5: {
  "statement": "**A5 · Foundation · paper — Standardization.** In low-risk users, treated outcomes are 16/20 and controls 56/80; in high-risk users, treated outcomes are 32/80 and controls 6/20. Each stratum contains 100 users. Compute stratum effects, the standardized ATE, and the crude treated-minus-control difference; explain the sign reversal.",
  "plain": "Both stratum effects equal \\(0.1\\), so equal population weights give standardized ATE \\(0.1\\). Pooled treated risk is \\(48/100=0.48\\), while pooled control risk is \\(62/100=0.62\\), giving crude difference \\(-0.14\\). Treatment is concentrated in the high-risk stratum, creating the reversal.",
  "solution": "<p>Both stratum effects equal \\(0.1\\), so equal population weights give standardized ATE \\(0.1\\). Pooled treated risk is \\(48/100=0.48\\), while pooled control risk is \\(62/100=0.62\\), giving crude difference \\(-0.14\\). Treatment is concentrated in the high-risk stratum, creating the reversal.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Standardized ATE; crude difference",
      "type": "vec",
      "ans": [
        0.1,
        -0.14
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A6: {
  "statement": "**A6 · Foundation · paper — Weights.** For \\(A=(1,1,1,1,1,0,0,0,0,0)\\), observed \\(Y=(8,7,6,5,4,3,2,2,1,0)\\), and propensities \\(e=(.8,.7,.6,.4,.2,.8,.6,.5,.3,.2)\\), compute the Horvitz–Thompson and Hájek ATE estimates and \\((\\sum w_i)^2/\\sum w_i^2\\), where \\(w_i=A_i/e_i+(1-A_i)/(1-e_i)\\).",
  "plain": "Treated weighted outcome sum is 62.5 and control sum is about 25.429, so the Horvitz–Thompson ATE is \\((62.5-25.429)/10\\approx3.707\\). Weight sums are 11.845 and 12.179, giving Hájek difference \\(62.5/11.845-25.429/12.179\\approx3.188\\). The combined weight ESS is about 7.546, below 10 because propensities are uneven.",
  "solution": "<p>Treated weighted outcome sum is 62.5 and control sum is about 25.429, so the Horvitz–Thompson ATE is \\((62.5-25.429)/10\\approx3.707\\). Weight sums are 11.845 and 12.179, giving Hájek difference \\(62.5/11.845-25.429/12.179\\approx3.188\\). The combined weight ESS is about 7.546, below 10 because propensities are uneven.</p>"
},
A7: {
  "statement": "**A7 · Foundation · paper — Mechanisms.** Classify as MCAR, MAR given recorded variables, or MNAR: a random logging outage; response depending on recorded country; low ratings being less likely to be submitted; lab values ordered from recorded age and diagnosis; timeouts missing because latency exceeded an unrecorded threshold; and a random 10% audit sample. State the conditioning set or missing value driving each call.",
  "plain": "Random outage and random audit are MCAR. Country-dependent response and ordering by recorded age/diagnosis are MAR conditional on those recorded variables. Rating-dependent submission and threshold-caused missing timeout values are MNAR unless the rating or threshold-driving quantity is observed. Adding the relevant driver can change an MNAR description to MAR.",
  "solution": "<p>Random outage and random audit are MCAR. Country-dependent response and ordering by recorded age/diagnosis are MAR conditional on those recorded variables. Rating-dependent submission and threshold-caused missing timeout values are MNAR unless the rating or threshold-driving quantity is observed. Adding the relevant driver can change an MNAR description to MAR.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Simpson.** Stratum \\(S=0\\): treated 90/100 successes, control 400/500. Stratum \\(S=1\\): treated 250/500, control 40/100. Compute both stratum effects, the effect standardized to the pooled distribution of \\(S\\), and the pooled crude difference. Then give the three graphs under which the pooled, the stratified, and neither answer is the total effect of \\(T\\).",
  "plain": "Stratum effects: \\(0.9-0.8=0.1\\) and \\(0.5-0.4=0.1\\). \\(S\\) is split 600/600, so the standardized effect is 0.1. Pooled: treated \\(340/600\\approx0.567\\), control \\(440/600\\approx0.733\\), crude \\(-1/6\\approx-0.167\\). Confounder \\(T\\leftarrow S\\to Y\\): the stratified answer (+0.1). Mediator \\(T\\to S\\to Y\\): the pooled answer (\\(-0.167\\)). Collider \\(T\\to S\\leftarrow Y\\), or an unmeasured confounder of \\(T\\) and \\(Y\\): neither.",
  "solution": "<p><b>Numbers.</b> \\(S=0\\): \\(0.90-0.80=0.10\\). \\(S=1\\): \\(0.50-0.40=0.10\\). Each stratum holds 600 of the 1,200 units, so standardizing to \\(P(S)=(0.5,0.5)\\) gives \\(+0.10\\). Pooled: treated \\(340/600\\approx0.567\\), control \\(440/600\\approx0.733\\), crude difference \\(-1/6\\approx-0.167\\). The reversal occurs because treated units are concentrated in the low-success stratum \\(S=1\\).</p><p><b>Graphs.</b></p><ul><li>\\(T\\leftarrow S\\to Y\\) (confounder): the stratified/standardized \\(+0.10\\) is the total effect.</li><li>\\(T\\to S\\to Y\\) (mediator): the pooled \\(-0.167\\) is the total effect; stratifying removes the mediated part.</li><li>\\(T\\to S\\leftarrow Y\\) (collider), or any graph with an unmeasured \\(T\\leftarrow U\\to Y\\): neither number is the total effect. Stratifying on a collider creates bias, and unmeasured confounding biases both.</li></ul>",
  "fields": [
    {
      "id": "value",
      "label": "Effect in S=0; effect in S=1; pooled crude difference",
      "type": "vec",
      "ans": [
        0.1,
        0.1,
        -0.16666666666666666
      ]
    }
  ],
  "hints": {
    "value": "Divide successes by group sizes within each stratum, then pool the counts across strata before dividing."
  }
},
A9: {
  "statement": "**A9 · Core · paper — Collider damage.** A randomized model switch \\(T\\sim\\mathrm{Bernoulli}(0.5)\\) has no effect on correctness \\(Y\\sim\\mathrm{Bernoulli}(0.5)\\), but an output parses with probability \\(0.3+0.4T+0.3Y\\), and the evaluation keeps parsed outputs only. Compute exactly \\(E[Y\\mid T=1,\\text{parsed}]-E[Y\\mid T=0,\\text{parsed}]\\), then confirm it by simulating \\(n=100{,}000\\) units (seed 0), and state the sign and size of the induced bias.",
  "plain": "Given \\(T=1\\), parse probabilities are 1.0 (\\(Y=1\\)) and 0.7 (\\(Y=0\\)), so \\(P(Y=1\\mid T=1,\\text{parsed})=1/1.7=10/17\\approx0.588\\). Given \\(T=0\\) they are 0.6 and 0.3, so \\(P(Y=1\\mid T=0,\\text{parsed})=2/3\\). The filtered contrast is \\(10/17-2/3=-4/51\\approx-0.078\\), although the true effect is 0. A simulation of 100,000 units reproduces this within about \\(\\pm0.01\\). The bias is negative: the new model parses more outputs, including wrong ones, so its parsed set is less selected on correctness.",
  "solution": "<p>By Bayes' rule within each arm (with \\(P(Y=1)=0.5\\)):</p><ul><li>\\(T=1\\): \\(P(\\text{parse}\\mid Y=1)=1.0\\), \\(P(\\text{parse}\\mid Y=0)=0.7\\), so \\(P(Y=1\\mid T=1,\\text{parsed})=1/(1+0.7)=10/17\\approx0.588\\).</li><li>\\(T=0\\): \\(0.6\\) and \\(0.3\\), so \\(P(Y=1\\mid T=0,\\text{parsed})=0.6/0.9=2/3\\).</li></ul><p>The filtered contrast is \\(10/17-2/3=-4/51\\approx-0.078\\), against a true effect of 0. A simulation with 100,000 units (about 42,500 treated and 22,500 control outputs survive the filter) gives about \\(-0.074\\), within Monte Carlo error (standard error about 0.005). Parsing is a collider of \\(T\\) and \\(Y\\). The new model rescues wrong outputs into the parsed set, so it looks 7.8 points worse.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Filtered treated-minus-control difference",
      "type": "num",
      "ans": -0.0784313725490196
    }
  ],
  "hints": {
    "value": "Within each arm, apply Bayes' rule to P(Y = 1 | parsed) using the two parse probabilities."
  }
},
A10: {
  "statement": "**A10 · Core · paper — M-bias.** Let \\(U_1,U_2\\) be unobserved standard normals, \\(T=U_1+e_T\\), \\(Z=U_1+2U_2+e_Z\\), \\(Y=2T+U_2+e_Y\\) with independent standard-normal errors (true effect 2). Compute the population coefficient on \\(T\\) in the regressions of \\(Y\\) on \\(T\\) and of \\(Y\\) on \\((T,Z)\\), confirm with a simulation of \\(n=100{,}000\\) (seed 0), and locate the open path.",
  "plain": "Without \\(Z\\): \\(\\operatorname{Cov}(T,Y)/\\operatorname{Var}T=4/2=2\\), unbiased. With \\(Z\\): \\(\\operatorname{Var}(T,Z)=\\begin{pmatrix}2&1\\\\1&6\\end{pmatrix}\\) and \\(\\operatorname{Cov}((T,Z),Y)=(4,4)\\), so the coefficients are \\((20/11,4/11)\\approx(1.818,0.364)\\): bias \\(-2/11\\). The opened path is \\(T\\leftarrow U_1\\to Z\\leftarrow U_2\\to Y\\), where \\(Z\\) is a pretreatment collider.",
  "solution": "<p>Moments: \\(\\operatorname{Var}T=2\\), \\(\\operatorname{Var}Z=1+4+1=6\\), \\(\\operatorname{Cov}(T,Z)=1\\), \\(\\operatorname{Cov}(T,Y)=2\\operatorname{Var}T=4\\), \\(\\operatorname{Cov}(Z,Y)=2\\operatorname{Cov}(T,Z)+\\operatorname{Cov}(Z,U_2)=2+2=4\\).</p><p>Unadjusted: \\(4/2=2\\), unbiased because the only backdoor path is blocked at the collider \\(Z\\).</p><p>Adjusted: \\(\\begin{pmatrix}2&1\\\\1&6\\end{pmatrix}^{-1}\\begin{pmatrix}4\\\\4\\end{pmatrix}=\\tfrac1{11}\\begin{pmatrix}6&-1\\\\-1&2\\end{pmatrix}\\begin{pmatrix}4\\\\4\\end{pmatrix}=\\begin{pmatrix}20/11\\\\4/11\\end{pmatrix}\\), so the \\(T\\) coefficient is \\(\\approx1.818\\), a bias of \\(-2/11\\approx-0.182\\). A 100,000-unit simulation matches both to about \\(\\pm0.01\\). Conditioning on \\(Z\\) opens \\(T\\leftarrow U_1\\to Z\\leftarrow U_2\\to Y\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Z-adjusted coefficient on T",
      "type": "num",
      "ans": 1.8181818181818181
    }
  ],
  "hints": {
    "value": "Invert the 2-by-2 covariance matrix of (T, Z) and multiply by their covariances with Y."
  }
},
A11: {
  "statement": "**A11 · Core · paper — Balance.** Simulate \\(n=5000\\) (seed 0) with \\(X_1\\sim\\mathcal N(0,1)\\), \\(X_2\\sim\\mathrm{Bernoulli}(0.4)\\), and \\(T\\sim\\mathrm{Bernoulli}(\\operatorname{expit}(-0.5+0.8X_1+X_2))\\). Fit a logistic propensity model on \\((X_1,X_2)\\), form ATE weights, and report standardized mean differences before and after weighting, the per-arm ESS, and the largest weight; decide whether to proceed using the rule \\(|\\text{SMD}|<0.1\\). Repeat with a propensity model that omits \\(X_2\\).",
  "plain": "Expect fitted coefficients near \\((-0.5,0.8,1.0)\\), about 48% treated. Before weighting, SMD is about 0.67 for \\(X_1\\) and 0.41 for \\(X_2\\); after weighting both are below 0.01, ESS is about 1,900 of 2,380 treated and 2,160 of 2,620 controls, and the largest weight is about 16: proceed. Omitting \\(X_2\\) balances \\(X_1\\) but leaves SMD about 0.47 on \\(X_2\\): do not proceed.",
  "solution": "<p>One seed-0 run (numbers vary slightly by generator) gives:</p><ul><li>Logistic fit \\(\\approx(-0.49,0.75,0.96)\\), treated share 0.48.</li><li>SMD before weighting: \\(X_1\\) 0.67, \\(X_2\\) 0.41.</li><li>SMD after weighting: \\(X_1\\) 0.006, \\(X_2\\) 0.000.</li><li>ESS 1,897 of 2,382 treated and 2,159 of 2,618 controls; maximum weight 15.6.</li></ul><p>All \\(|\\text{SMD}|<0.1\\) with moderate weights, so proceed to estimation. That decision is conditional on \\(\\{X_1,X_2\\}\\) being a sufficient adjustment set, which balance cannot verify.</p><p>With \\(X_2\\) omitted, \\(X_1\\) balances (SMD about 0.01) but \\(X_2\\) keeps SMD about 0.47. Balance diagnostics catch the misspecification that a high AUC would not.</p>"
},
A12: {
  "statement": "**A12 · Core · paper — Positivity.** Let \\(X\\sim\\mathcal N(0,1)\\), \\(e(X)=\\operatorname{expit}(\\gamma X)\\), and \\(Y=1+X+T+\\varepsilon\\) (true ATE 1), with \\(n=10{,}000\\). For \\(\\gamma\\in\\{0.5,1,2,4\\}\\), using the true propensities and Hájek weighting, report the ESS, the largest weight, the largest single share of the treated weight, and the width of a plug-in 95% interval. Compare that width with \\(3.92\\) times the Monte Carlo standard deviation of the estimate over 100 replications.",
  "plain": "Approximate results: \\(\\gamma=0.5\\): ESS 9,400, max weight 6, width 0.12, MC SD 0.028. \\(\\gamma=1\\): ESS 7,600, max weight 20, width 0.14, MC SD 0.038. \\(\\gamma=2\\): ESS 3,500, max weight 106, width 0.22, MC SD 0.092. \\(\\gamma=4\\): ESS 390, max weight 530, one unit holds 5% of treated weight, width 0.68, MC SD 0.35. As \\(\\gamma\\) grows, ESS collapses, the interval widens, and the plug-in interval increasingly understates the true spread (\\(3.92\\times0.35\\approx1.37\\) against 0.68).",
  "solution": "<p>Seed-0 results (the pattern, not the digits, is what matters):</p><table><tr><th>\\(\\gamma\\)</th><th>ESS</th><th>max \\(w\\)</th><th>max treated share</th><th>plug-in width</th><th>MC SD</th></tr><tr><td>0.5</td><td>9,393</td><td>5.5</td><td>0.05%</td><td>0.118</td><td>0.028</td></tr><tr><td>1</td><td>7,616</td><td>19.8</td><td>0.2%</td><td>0.139</td><td>0.038</td></tr><tr><td>2</td><td>3,493</td><td>106</td><td>0.6%</td><td>0.219</td><td>0.092</td></tr><tr><td>4</td><td>391</td><td>531</td><td>5.1%</td><td>0.677</td><td>0.348</td></tr></table><p>Near-deterministic assignment shrinks the effective sample by a factor of 25 and concentrates weight in a few units. At \\(\\gamma\\le1\\) the plug-in width matches \\(3.92\\times\\)SD. At \\(\\gamma=4\\) the true spread is about twice what the interval claims, and the MC mean (about 1.11) is also off: the realized weights do not reveal their own instability. Report ESS and extreme weights, and change the estimand (trimming or overlap weights) rather than trusting the interval.</p>"
},
A13: {
  "statement": "**A13 · Core · paper — Doubly robust.** Simulate \\(X\\sim U(-2,2)\\), \\(T\\sim\\mathrm{Bernoulli}(\\operatorname{expit}(0.8X))\\), \\(Y=e^X+T(1+X^2)+\\varepsilon\\) (true ATE \\(7/3\\)), \\(n=2000\\), 100 replications, seed 0. The correct outcome model regresses \\(Y\\) on \\((1,X,e^X,X^2)\\) within each arm and the wrong one on \\((1,X)\\); the correct propensity model is logistic in \\(X\\) and the wrong one is a constant. Report the mean standardization, Hájek IPW, and AIPW estimates in all four combinations and confirm AIPW is consistent when exactly one model is wrong.",
  "plain": "Approximate means: both correct, all three near 2.34. Outcome wrong: standardization 2.11, Hájek 2.34, AIPW 2.33. Propensity wrong: standardization 2.34, Hájek 3.72, AIPW 2.34. Both wrong: AIPW 2.11. AIPW stays near \\(7/3\\approx2.333\\) whenever at least one nuisance model is right, and fails only when both are.",
  "solution": "<p>Mean over 100 replications (true ATE \\(7/3\\approx2.333\\)):</p><table><tr><th>Outcome model</th><th>Propensity</th><th>Standardization</th><th>Hájek IPW</th><th>AIPW</th></tr><tr><td>correct</td><td>correct</td><td>2.338</td><td>2.337</td><td>2.338</td></tr><tr><td>wrong</td><td>correct</td><td>2.113</td><td>2.337</td><td>2.332</td></tr><tr><td>correct</td><td>wrong</td><td>2.338</td><td>3.716</td><td>2.338</td></tr><tr><td>wrong</td><td>wrong</td><td>2.113</td><td>3.716</td><td>2.113</td></tr></table><p>Each single-model estimator inherits its model's bias. AIPW matches the correct one in both single-failure rows, which is the product-of-errors bias \\(E[(e/e^\\ast-1)(m_1-m_1^\\ast)]\\) vanishing when either factor is zero. When both are wrong, AIPW has no protection.</p>"
},
A14: {
  "statement": "**A14 · Core · paper — Cross-fitting.** Use the DGP of problem 13 with \\(n=1000\\) and 200 replications (seed 0). Estimate both outcome regressions and the propensity by \\(k\\)-nearest-neighbour averaging in \\(X\\) (propensities clipped to \\([0.02,0.98]\\)), and compute AIPW with influence-function 95% intervals either on the same sample or with 2-fold cross-fitting. Compare a well-behaved regime \\(k=40\\) with a deliberately overfit regime \\(k=1\\), reporting bias and coverage, and explain why cross-fitting need not remove all bias.",
  "plain": "Approximate results: \\(k=40\\): same-sample bias about 0 with coverage 0.95; cross-fitted bias about \\(-0.01\\) with coverage 0.96. \\(k=1\\): same-sample coverage falls to about 0.77 because each unit's own outcome and treatment enter its nuisance fits; cross-fitting restores coverage to about 0.93 but leaves a bias of about \\(+0.05\\), because 1-NN nuisances converge too slowly for the product-rate condition.",
  "solution": "<p>Seed-0 results over 200 replications:</p><table><tr><th>\\(k\\)</th><th>Fit</th><th>Bias</th><th>Coverage</th></tr><tr><td>40</td><td>same sample</td><td>\\(-0.001\\)</td><td>0.95</td></tr><tr><td>40</td><td>cross-fit</td><td>\\(-0.013\\)</td><td>0.96</td></tr><tr><td>1</td><td>same sample</td><td>\\(-0.002\\)</td><td>0.77</td></tr><tr><td>1</td><td>cross-fit</td><td>\\(+0.048\\)</td><td>0.93</td></tr></table><p>With \\(k=1\\) on the same sample, \\(\\hat m_T(X_i)=Y_i\\) and \\(\\hat e(X_i)\\) is driven by \\(T_i\\). The residual term collapses and the influence-function variance is underestimated, so coverage is poor. Cross-fitting removes this own-observation overfitting and restores approximate coverage. It cannot make noisy 1-NN nuisances satisfy \\(\\lVert\\hat e-e\\rVert\\,\\lVert\\hat m-m\\rVert=o_p(n^{-1/2})\\), so a remainder bias of a few hundredths persists. Clipping at 0.02 also adds its own bias.</p>"
},
A15: {
  "statement": "**A15 · Core · paper — Instruments.** A rollout randomizes 10,000 users to assignment and 10,000 to control. Uptake of the new model is 62% among assigned and 4% among control users, and mean weekly retention is 0.431 versus 0.402. Estimate the ITT, the first stage, and the LATE, and state the population the LATE describes and the assumptions it needs.",
  "plain": "ITT \\(=0.431-0.402=0.029\\); first stage \\(=0.62-0.04=0.58\\); LATE \\(=0.029/0.58=0.05\\). It is the effect for compliers, users who run the new model if and only if assigned (58% of users), under relevance, exclusion, independence (by randomization) and monotonicity (no defiers). It is not the ATE for always-takers or never-takers.",
  "solution": "<ul><li>ITT (reduced form): \\(0.431-0.402=0.029\\).</li><li>First stage: \\(0.62-0.04=0.58\\).</li><li>LATE (Wald): \\(0.029/0.58=0.050\\).</li></ul><p>Under relevance (0.58 is clearly nonzero), independence (assignment is randomized), exclusion (assignment affects retention only through running the model) and monotonicity (nobody refuses because they were assigned), 0.05 is the average effect for compliers, the 58% of users whose uptake follows assignment. Always-takers (4%) and never-takers (38%) are not represented. Transporting the estimate to them is an extra assumption.</p>",
  "fields": [
    {
      "id": "value",
      "label": "ITT; first stage; LATE",
      "type": "vec",
      "ans": [
        0.029,
        0.58,
        0.05
      ]
    }
  ],
  "hints": {
    "value": "Take the assigned-minus-control difference in outcome and in uptake, then divide."
  }
},
A16: {
  "statement": "**A16 · Core · paper — Multiple imputation.** Simulate \\(n=500\\), \\(X\\sim\\mathcal N(0,1)\\), \\(Y=1+2X+\\varepsilon\\), with \\(X\\) missing with probability \\(\\operatorname{expit}(-1+Y)\\) (MAR given the observed \\(Y\\)). Impute \\(X\\) \\(m=20\\) times from a Bayesian linear regression of \\(X\\) on \\(Y\\) with parameter draws (one-column chained equations), fit the slope of \\(Y\\) on \\(X\\) in each completed dataset, and pool with Rubin's rules. Over 200 replications (seed 0), compare the mean of \\(T\\) with the empirical variance of \\(\\bar Q\\), report interval coverage and the fraction of missing information, and compare with complete-case analysis.",
  "plain": "About half the \\(X\\) values are missing. Expected: mean \\(\\bar Q\\approx2.00\\); empirical variance of \\(\\bar Q\\approx0.0045\\) against mean \\(T\\approx0.0044\\) (Rubin's rules calibrated), mean \\(\\bar U\\approx0.0020\\) (it would understate the variance by half); coverage about 0.93–0.95; fraction of missing information about 0.53. Complete-case slope is about 1.76, biased, because missingness depends on the outcome.",
  "solution": "<p>Seed-0 results over 200 replications (49.9% of \\(X\\) missing on average):</p><ul><li>Pooled slope: mean \\(\\bar Q=1.998\\) (truth 2).</li><li>Empirical \\(\\operatorname{Var}(\\bar Q)=0.00454\\) against mean Rubin \\(T=0.00444\\), so the total variance is calibrated.</li><li>Mean \\(\\bar U=0.00202\\) and mean \\(B=0.00230\\). Using \\(\\bar U\\) alone would understate the variance by more than half.</li><li>95% interval coverage 0.935; mean fraction of missing information 0.53.</li><li>Complete-case slope: mean 1.76. Missingness depends on \\(Y\\), so complete cases select on the outcome.</li></ul><p>The imputation model must include \\(Y\\) (it is the only predictor of \\(X\\) here), and parameter draws are needed for proper imputation. Without them \\(B\\) is too small and coverage drops.</p>"
},
A17: {
  "statement": "**A17 · Stretch · paper — Unidentified estimand.** In the graph \\(T\\leftarrow U\\to Y\\), \\(T\\to M\\to Y\\) with \\(U\\) unobserved, (a) show no observed set satisfies the backdoor criterion; (b) prove the effect is not identified from \\(P(T,Y)\\) alone using the two models \\(T=U,Y=U\\) and \\(T=U,Y=T\\) with \\(U\\sim\\mathrm{Bernoulli}(1/2)\\); (c) with \\(P(T=1)=0.4\\), \\(P(M=1\\mid T=1)=0.9\\), \\(P(M=1\\mid T=0)=0.1\\) and \\(E[Y\\mid T,M]\\) equal to 0.8, 0.6, 0.4, 0.2 for \\((T,M)=(1,1),(0,1),(1,0),(0,0)\\), compute the effect by the front-door formula.",
  "plain": "(a) The only observed candidate is \\(M\\), a descendant of \\(T\\); \\(\\varnothing\\) leaves \\(T\\leftarrow U\\to Y\\) open. (b) Both models give \\(Y=T\\) with \\(P(T=1)=1/2\\), the same observed law, but the effects are 0 and 1. (c) Inner sums \\(\\sum_{t'}E[Y\\mid t',m]P(t')\\) are 0.68 (\\(m=1\\)) and 0.28 (\\(m=0\\)); \\(E[Y\\mid\\operatorname{do}(1)]=0.9(0.68)+0.1(0.28)=0.64\\), \\(E[Y\\mid\\operatorname{do}(0)]=0.1(0.68)+0.9(0.28)=0.32\\), effect 0.32.",
  "solution": "<p><b>(a)</b> The backdoor path \\(T\\leftarrow U\\to Y\\) runs through the unobserved \\(U\\). The only observed variable, \\(M\\), is a descendant of \\(T\\) (clause 2) and does not lie on that path. The empty set leaves the path open.</p><p><b>(b)</b> Model 1: \\(T=U\\), \\(Y=U\\), effect 0. Model 2: \\(T=U\\), \\(Y=T\\), effect 1. Both induce \\(Y=T\\) with \\(P(T=1)=1/2\\), so \\(P(T,Y)\\) is identical but the effects differ. The effect is not a functional of \\(P(T,Y)\\).</p><p><b>(c)</b> The front door requires that \\(M\\) intercept every directed path, that \\(T\\to M\\) be unconfounded, and that \\(T\\) block every backdoor path from \\(M\\) to \\(Y\\). Then \\(E[Y\\mid\\operatorname{do}(t)]=\\sum_mP(m\\mid t)\\sum_{t'}E[Y\\mid t',m]P(t')\\). Inner sums: \\(m=1\\): \\(0.4(0.8)+0.6(0.6)=0.68\\); \\(m=0\\): \\(0.4(0.4)+0.6(0.2)=0.28\\). So \\(E[Y\\mid\\operatorname{do}(1)]=0.64\\), \\(E[Y\\mid\\operatorname{do}(0)]=0.32\\), and the effect is 0.32.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Front-door effect",
      "type": "num",
      "ans": 0.32
    }
  ],
  "hints": {
    "value": "First average E[Y | t', m] over P(t') for each m, then average those over P(m | t) for t = 1 and t = 0."
  }
},
A18: {
  "statement": "**A18 · Stretch · paper — Weak instrument.** Simulate \\(n=1000\\), \\(Z\\sim\\mathrm{Bernoulli}(0.5)\\), \\(U\\sim\\mathcal N(0,1)\\), \\(T=\\pi Z+U+0.3V\\), \\(Y=U+0.3W\\) (true effect 0) for \\(\\pi\\in\\{0.5,0.2,0.1,0.05\\}\\), 1,000 replications each (seed 0). Report the mean first-stage \\(F\\), the median Wald estimate, and 95% coverage, and plot median bias against \\(1/F\\) together with the OLS bias \\(1/(0.25\\pi^2+1.09)\\). Then, at \\(\\pi=0.1\\), keep only replications with \\(F>10\\) and show that screening on a large observed \\(F\\) acts as a collider conditioning.",
  "plain": "Approximate: \\(\\pi=0.5\\): \\(F\\approx58\\), median 0.00, coverage 0.95. \\(\\pi=0.2\\): \\(F\\approx10\\), median 0.00, coverage 0.92. \\(\\pi=0.1\\): \\(F\\approx3.2\\), median 0.10, coverage 0.87. \\(\\pi=0.05\\): \\(F\\approx1.5\\), median 0.49, coverage 0.80. The median moves toward OLS (about 0.92) as \\(1/F\\) grows. At \\(\\pi=0.1\\) only about 5% of runs have \\(F>10\\), and their median estimate is about 0.53: selecting on \\(F\\) selects runs where the sample covariance of \\(Z\\) with the confounder \\(U\\) is large.",
  "solution": "<p>Seed-0 results (1,000 replications each; OLS bias \\(\\approx0.87\\)–\\(0.92\\)):</p><table><tr><th>\\(\\pi\\)</th><th>mean \\(F\\)</th><th>median \\(\\hat\\tau\\)</th><th>coverage</th></tr><tr><td>0.5</td><td>58.0</td><td>0.001</td><td>0.95</td></tr><tr><td>0.2</td><td>10.1</td><td>0.003</td><td>0.92</td></tr><tr><td>0.1</td><td>3.2</td><td>0.10</td><td>0.87</td></tr><tr><td>0.05</td><td>1.5</td><td>0.49</td><td>0.80</td></tr></table><p>As \\(1/F\\) rises, the central tendency drifts toward the confounded OLS value and coverage decays. The ratio is heavy-tailed, so medians are more stable than means.</p><p><b>Screening.</b> At \\(\\pi=0.1\\), 52 of 1,000 runs have \\(F>10\\), with median estimate 0.53, against 0.10 overall. The sample first stage \\(\\widehat{\\operatorname{Cov}}(Z,T)\\) is caused both by \\(\\pi\\) and by the chance covariance \\(\\widehat{\\operatorname{Cov}}(Z,U)\\), which also drives the numerator. Conditioning on a large \\(F\\) selects runs where the instrument happens to be correlated with the confounder: a collider on \\(\\pi\\to F\\leftarrow\\widehat{\\operatorname{Cov}}(Z,U)\\). Pre-specify the instrument and use Anderson–Rubin intervals regardless of \\(F\\).</p>"
},
A19: {
  "statement": "**A19 · Stretch · paper — Staggered adoption.** Unit E adopts in period 2 and unit L in period 4, over periods 1–4, with untreated outcomes 0 throughout. E's effects are 1, 3, 6 in periods 2, 3, 4, and L's effect is 1 in period 4. Fit \\(Y_{it}=\\alpha_i+\\gamma_t+\\tau D_{it}\\) by least squares and show \\(\\hat\\tau<0\\). Then compute the group-time effects that are identified with not-yet-treated controls, and say which cells are not identified.",
  "plain": "Outcomes: E \\((0,1,3,6)\\), L \\((0,0,0,1)\\). TWFE gives \\(\\hat\\tau=-0.5\\) although every effect is positive, because some implicit comparisons use the already-treated E as a control for L, subtracting E's growing effect. Group-time with L as the not-yet-treated control and period 1 as base: \\(\\text{ATT}(E,2)=1\\), \\(\\text{ATT}(E,3)=3\\). Period 4 has no untreated unit, so \\(\\text{ATT}(E,4)\\) and \\(\\text{ATT}(L,4)\\) are not identified without a never-treated group.",
  "solution": "<p>Outcome table: E \\((0,1,3,6)\\), L \\((0,0,0,1)\\), with \\(D\\) equal to 1 for E in periods 2–4 and for L in period 4. Least squares with unit and period effects gives \\(\\hat\\tau=-0.5\\).</p><p>Reason: TWFE averages all 2×2 comparisons. Some use E, already treated, as the control for L's change into period 4. E's effect grows from 3 to 6 over that window, so the comparison is \\(1-3=-2\\), and it receives substantial weight.</p><p>Group-time estimates with not-yet-treated controls (base period 1, control L): \\(\\text{ATT}(E,2)=(1-0)-(0-0)=1\\) and \\(\\text{ATT}(E,3)=(3-0)-(0-0)=3\\). In period 4 both units are treated, so \\(\\text{ATT}(E,4)\\) and \\(\\text{ATT}(L,4)\\) have no valid control and are not identified. Aggregate only the identified cells (mean 2), or add a never-treated group.</p>",
  "fields": [
    {
      "id": "value",
      "label": "TWFE coefficient",
      "type": "num",
      "ans": -0.5
    }
  ],
  "hints": {
    "value": "Build the 8-row design with unit dummies, period dummies and the treatment indicator, and solve the normal equations."
  }
},
A20: {
  "statement": "**A20 · Stretch · paper — Parallel trends on a scale.** Treated units average 100 before and 126 after a change; control units average 50 before and 60 after. Compute the difference-in-differences in levels and in logs. Assuming parallel trends holds in logs (the treated group would have grown 20%, like the control group), find the implied untreated counterfactual and level effect, explain why the levels DiD is then biased, and decide which scale a decision about absolute revenue requires.",
  "plain": "Levels: \\((126-100)-(60-50)=16\\). Logs: \\(\\log1.26-\\log1.2\\approx0.0488\\), a 5% effect. If trends are parallel in logs, the counterfactual is \\(100\\times1.2=120\\), so the level effect is \\(126-120=6\\). Levels DiD assumes the treated group would have grown by 10 like the controls, but under log-parallel trends it would grow by 20, so levels DiD overstates by 10. The scale is an assumption about untreated growth. A revenue decision needs the level effect, computed from the scale on which trends are credibly parallel (here \\(+6\\), not \\(+16\\)).",
  "solution": "<ul><li>Levels DiD: \\((126-100)-(60-50)=26-10=16\\).</li><li>Log DiD: \\(\\log(126/100)-\\log(60/50)=0.2311-0.1823=0.0488\\), a multiplicative effect of \\(126/120=1.05\\).</li></ul><p>If parallel trends holds in logs, the untreated treated-group outcome is \\(100\\times1.2=120\\), and the effect is \\(126-120=6\\) in levels, or 5%. Parallel trends in levels would require the treated group's untreated change to be \\(+10\\), which contradicts its \\(+20\\) under the log assumption. The two scales cannot both be parallel when baseline levels differ, and pre-period data must justify one. For absolute revenue, report the level effect implied by the credible scale: \\(+6\\), not \\(+16\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Levels DiD; log DiD",
      "type": "vec",
      "ans": [
        16,
        0.04879016416943205
      ]
    }
  ],
  "hints": {
    "value": "Subtract the control change from the treated change, once in raw units and once after taking natural logs."
  }
},
A21: {
  "statement": "**A21 · Stretch · paper — Sensitivity.** An observational analysis reports RR 1.8 (95% CI lower limit 1.3). The strongest measured covariate, plan tier, has RR 1.6 with treatment and 2.1 with the outcome. Compute the E-values for the point estimate and the lower limit, the bias factor \\(B=\\text{RR}_{TU}\\text{RR}_{UY}/(\\text{RR}_{TU}+\\text{RR}_{UY}-1)\\) of a confounder as strong as plan tier, and the lower limit divided by \\(B\\). Then state an unmeasured confounder strength that would overturn the claim.",
  "plain": "E-values: \\(1.8+\\sqrt{1.8\\times0.8}=3.0\\) and \\(1.3+\\sqrt{1.3\\times0.3}\\approx1.92\\). Plan-tier strength: \\(B=3.36/2.7\\approx1.244\\), lower limit \\(1.3/1.244\\approx1.045>1\\), so a confounder like plan tier would not move the interval across the null. A confounder with associations of about 2.0 with both treatment and outcome gives \\(B=4/3\\) and lower limit \\(\\approx0.975\\), which overturns significance. Anything at least 1.92 on both scales suffices.",
  "solution": "<p>\\(\\text{E}(1.8)=1.8+\\sqrt{1.44}=3.0\\) and \\(\\text{E}(1.3)=1.3+\\sqrt{0.39}\\approx1.92\\).</p><p>A confounder as strong as plan tier: \\(B=1.6\\times2.1/(1.6+2.1-1)=3.36/2.7\\approx1.244\\). The adjusted lower limit is \\(1.3/1.244\\approx1.045\\), still above 1. A confounder as strong as the benchmark does not explain away the interval, and explaining away the point estimate would need \\(B=1.8\\).</p><p>Overturning confounder: associations of 2.0 with both give \\(B=4/(4-1)=1.333\\) and lower limit \\(0.975<1\\). The E-value 1.92 is the minimal equal strength. The claim therefore rests on there being no unmeasured confounder somewhat stronger than plan tier on the treatment side.</p>",
  "fields": [
    {
      "id": "value",
      "label": "E-value for the estimate; E-value for the lower limit",
      "type": "vec",
      "ans": [
        3.0,
        1.9244997998398399
      ]
    }
  ],
  "hints": {
    "value": "Use RR + sqrt(RR(RR - 1)) for each."
  }
},
A22: {
  "statement": "**A22 · Stretch · paper — Two mechanisms.** Six units have \\((T,R,Y,e,r)\\) = \\((1,1,4,0.4,0.5)\\), \\((1,0,\\text{--},0.5,0.5)\\), \\((1,1,2,0.5,0.8)\\), \\((0,1,3,0.4,0.5)\\), \\((0,1,1,0.5,0.8)\\), \\((0,0,\\text{--},0.8,0.5)\\), where \\(e=P(T=1\\mid X)\\) and \\(r=P(R=1\\mid X,T)\\) is the probability that the outcome is observed. Derive the product-weighted estimator of \\(E[Y(t)]\\) under ignorability of \\(T\\) and MAR outcomes, compute the Hájek versions of \\(E[Y(1)]\\), \\(E[Y(0)]\\) and the ATE, and verify positivity for both factors.",
  "plain": "\\(E\\bigl[\\mathbf 1\\{T=t\\}RY/(P(T=t\\mid X)\\,r(X,t))\\bigr]=E[Y(t)]\\): condition on \\(X\\), use \\(R\\perp Y\\mid X,T\\) (MAR) to cancel \\(r\\), then consistency and ignorability to cancel the propensity. Weights: treated observed 5 and 2.5, giving \\((20+5)/7.5=10/3\\approx3.33\\); control observed \\(1/(0.6\\times0.5)=10/3\\) and \\(1/(0.5\\times0.8)=2.5\\), giving \\((10+2.5)/(35/6)=15/7\\approx2.14\\); ATE \\(\\approx1.19\\). All \\(e\\in(0,1)\\) and all \\(r>0\\), so positivity holds for both factors on these units.",
  "solution": "<p><b>Derivation.</b> \\(E\\!\\left[\\frac{\\mathbf 1\\{T=t\\}RY}{P(T=t\\mid X)r(X,t)}\\,\\middle|\\,X\\right]=\\frac{E[\\mathbf 1\\{T=t\\}\\,E(R\\mid X,T=t,Y)\\,Y\\mid X]}{P(T=t\\mid X)r(X,t)}\\). MAR gives \\(E(R\\mid X,T,Y)=r(X,T)\\), which cancels. Consistency and ignorability give \\(E[\\mathbf 1\\{T=t\\}Y(t)\\mid X]=P(T=t\\mid X)E[Y(t)\\mid X]\\), which cancels the propensity. Averaging over \\(X\\) gives \\(E[Y(t)]\\).</p><p><b>Numbers.</b> Treated with observed outcomes: weights \\(1/(0.4\\times0.5)=5\\) and \\(1/(0.5\\times0.8)=2.5\\), so \\(\\hat E[Y(1)]=(5\\cdot4+2.5\\cdot2)/7.5=10/3\\approx3.333\\). Controls with observed outcomes: weights \\(1/(0.6\\times0.5)=10/3\\) and \\(1/(0.5\\times0.8)=2.5\\), so \\(\\hat E[Y(0)]=(10+2.5)/(35/6)=15/7\\approx2.143\\). ATE \\(\\approx1.190\\).</p><p><b>Positivity.</b> Every \\(e\\) lies in \\((0,1)\\) and every \\(r\\) is positive, so each covariate pattern can be treated, untreated and observed. A pattern with \\(r=0\\) in one arm would make that arm's mean unidentified however good the propensity model is.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Hájek E[Y(1)]; Hájek E[Y(0)]",
      "type": "vec",
      "ans": [
        3.3333333333333335,
        2.142857142857143
      ]
    }
  ],
  "hints": {
    "value": "Each observed unit gets weight 1/(P(T = t | X) r); for controls use 1 - e."
  }
},
A23: {
  "statement": "**A23 · Stretch · paper — MNAR sensitivity.** Ratings are observed for 70% of items with mean 4.1. A pattern-mixture model sets the mean of the missing 30% to \\(4.1+\\delta\\), where \\(\\delta\\) is untestable. Write the overall mean as a function of \\(\\delta\\), report it for \\(\\delta\\in\\{-1.5,-1,-0.5,0\\}\\), and find the \\(\\delta\\) at which the conclusion \\\"mean rating at least 3.9\\\" flips.",
  "plain": "Overall mean \\(=0.7(4.1)+0.3(4.1+\\delta)=4.1+0.3\\delta\\): 3.65, 3.80, 3.95, 4.10 for \\(\\delta=-1.5,-1,-0.5,0\\). The conclusion flips at \\(4.1+0.3\\delta=3.9\\), i.e. \\(\\delta=-2/3\\approx-0.67\\). Report the range and the tipping point; the data cannot choose \\(\\delta\\).",
  "solution": "<p>\\(\\mu(\\delta)=0.7\\times4.1+0.3\\times(4.1+\\delta)=4.1+0.3\\delta\\).</p><ul><li>\\(\\delta=-1.5\\): 3.65</li><li>\\(\\delta=-1\\): 3.80</li><li>\\(\\delta=-0.5\\): 3.95</li><li>\\(\\delta=0\\) (MAR-like): 4.10</li></ul><p>The claim \\(\\mu\\ge3.9\\) holds iff \\(\\delta\\ge-2/3\\). If missing items are plausibly more than two-thirds of a star worse than observed ones (for example, abandoned because they were bad), the conclusion does not survive. Report this tipping point and the range 3.65–4.10 rather than a single number. Observed data carry no information about \\(\\delta\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Tipping-point delta",
      "type": "num",
      "ans": -0.6666666666666666
    }
  ],
  "hints": {
    "value": "Set 4.1 + 0.3 delta equal to 3.9 and solve."
  }
},
A24: {
  "statement": "**A24 · Stretch · paper — Complete observational study.** A logged comparison of a new ranking model covers 40,000 sessions (9,000 treated), routed by a rule using logged user tenure and device; engagement is the outcome, and 15% of engagement values are missing when the app crashed, which the new model makes more likely. After cross-fit AIPW on tenure and device: estimate \\(+0.04\\) (95% CI 0.01 to 0.07), all \\(|\\text{SMD}|<0.1\\), ESS 5,100, 3% of sessions with \\(\\hat e<0.02\\), RR-scale estimate 1.3 (lower limit 1.07), strongest measured confounder RR 1.2, and a placebo outcome (last week's engagement) estimated at \\(+0.03\\) (CI 0.00 to 0.06). Take this through all ten workflow steps, decide whether the claim stands, and write the paragraph a reviewer would need in order to disagree with you on the merits.",
  "plain": "Decision: roll out to all sessions; estimand ATE on engagement including crashes. Graph: tenure and device confound; crash is post-treatment, so missing engagement is MNAR given the log, or needs crash modelled as an outcome. Identification: backdoor on tenure and device. Positivity: trim the 3% with \\(\\hat e<0.02\\) and rename the estimand. Estimation and uncertainty: as reported, cluster by user. Missingness: complete cases condition on not crashing, a collider-like filter; count crashes explicitly or bound them. Sensitivity: E-values \\(1.3+\\sqrt{0.39}\\approx1.92\\) and \\(1.07+\\sqrt{0.0749}\\approx1.34\\) against a benchmark of 1.2, so thin. Falsification fails: the placebo effect of \\(+0.03\\) is nearly as large as the estimate, pointing to residual confounding. Verdict: the claim does not stand.",
  "solution": "<ol><li><b>Decision:</b> serve the new ranker to all sessions.</li><li><b>Estimand:</b> ATE on engagement over next month's sessions, with crashes counted as an outcome, not a missing value.</li><li><b>Graph:</b> tenure and device \\(\\to\\) routing and engagement; new model \\(\\to\\) crash \\(\\to\\) missing engagement.</li><li><b>Identification:</b> backdoor on \\(\\{\\text{tenure},\\text{device}\\}\\) if routing used nothing else.</li><li><b>Positivity:</b> 3% of sessions have \\(\\hat e<0.02\\). Trim them and call the result the effect on the overlap population.</li><li><b>Estimation:</b> cross-fit AIPW, with standardization and Hájek IPW alongside.</li><li><b>Uncertainty:</b> cluster by user. ESS 5,100 is the effective size.</li><li><b>Missingness:</b> dropping crashed sessions conditions on a consequence of treatment. Model crash explicitly (for example, engagement 0 on crash) or bound the effect.</li><li><b>Sensitivity:</b> E-value \\(\\approx1.92\\) for the estimate and \\(\\approx1.34\\) for the lower limit, against a measured benchmark of 1.2. Only modest margin.</li><li><b>Falsification:</b> the placebo outcome, which the ranker cannot affect, shows \\(+0.03\\), three-quarters of the headline effect. Residual confounding (for example, engaged users routed to the new model) is likely.</li></ol><p><b>Reviewer paragraph:</b> \\\"We adjust for tenure and device only. A negative-control outcome shows an effect of 0.03, so an unmeasured factor with risk-ratio associations near 1.3 with routing and engagement, for example prior engagement, could explain most of the estimate. Crashed sessions, more common under the new model, are excluded, which biases engagement upward. We therefore do not claim a causal improvement; a randomized rollout with crash-inclusive engagement is required.\\\" A reviewer can dispute the adjustment set, the crash coding, and the placebo's validity on those specific grounds.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** Which assumptions connect adjusted associations to an average treatment effect?",
  "plain": "Consistency, an appropriate no-interference specification, conditional exchangeability and positivity identify the effect through adjustment; these assumptions are not established merely by good predictive fit.",
  "solution": "<p>Consistency, an appropriate no-interference specification, conditional exchangeability and positivity identify the effect through adjustment; these assumptions are not established merely by good predictive fit.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Explain the double-robust cancellation for an AIPW mean under overlap.",
  "plain": "If the propensity is correct, weighting recovers the residual mean needed to correct outcome regression. If the outcome regression is correct, its conditional residual mean is zero even with a misspecified propensity. Integrability and suitable estimation conditions remain necessary.",
  "solution": "<p>If the propensity is correct, weighting recovers the residual mean needed to correct outcome regression. If the outcome regression is correct, its conditional residual mean is zero even with a misspecified propensity. Integrability and suitable estimation conditions remain necessary.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** Treatment success is 0.9/0.3 in easy/hard groups; control is 0.8/0.2. Under a common target mixture, find the standardized treatment effect.",
  "plain": "Each within-group effect is 0.1, so every common mixture gives 0.1.",
  "solution": "<p>Each within-group effect is 0.1, so every common mixture gives 0.1.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.1
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-causal experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does cross-fitting alone guarantee root-n inference for AIPW?",
  "plain": "No. In addition to identification, overlap and variance/moment conditions, a typical sufficient requirement is a product of nuisance L2 errors that is o_p(n^−1/2). Cross-fitting controls dependence but does not ensure those rates.",
  "solution": "<p>No. In addition to identification, overlap and variance/moment conditions, a typical sufficient requirement is a product of nuisance L2 errors that is o_p(n^−1/2). Cross-fitting controls dependence but does not ensure those rates.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Design a causal analysis of an AI intervention.",
  "plain": "Specify treatment, outcome, target effect and timing; draw the causal assumptions, avoid post-treatment adjustment, inspect overlap, and distinguish identification assumptions from empirical diagnostics. Prefer randomization when available.",
  "solution": "<p>Specify treatment, outcome, target effect and timing; draw the causal assumptions, avoid post-treatment adjustment, inspect overlap, and distinguish identification assumptions from empirical diagnostics. Prefer randomization when available.</p>"
}
});
