/* Authored probability solutions and offline checks. */
GU.answers("ps-15-score-matching-diffusion-sampling", {
A1: {
  "statement": "**A1 · Foundation · paper — Cumulative problem 1.** Compute the score of \\(\\mathcal N(3,4)\\) at \\(x=1\\).",
  "plain": "\\(\\nabla\\log p=-(x-\\mu)/\\sigma^2=-(1-3)/4=0.5\\), pointing toward the mean.",
  "solution": "<p>\\(\\nabla\\log p=-(x-\\mu)/\\sigma^2=-(1-3)/4=0.5\\), pointing toward the mean.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Score",
      "type": "num",
      "ans": 0.5
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Cumulative problem 2.** For \\(\\beta=(0.1,0.2)\\), compute \\(\\bar\\alpha_1,\\bar\\alpha_2\\) and the noise coefficient at \\(t=2\\).",
  "plain": "\\(\\alpha=(0.9,0.8)\\), \\(\\bar\\alpha_1=0.9\\), \\(\\bar\\alpha_2=0.72\\); noise coefficient \\(\\sqrt{1-0.72}=\\sqrt{0.28}\\approx0.529\\).",
  "solution": "<p>\\(\\alpha=(0.9,0.8)\\), \\(\\bar\\alpha_1=0.9\\), \\(\\bar\\alpha_2=0.72\\); noise coefficient \\(\\sqrt{1-0.72}=\\sqrt{0.28}\\approx0.529\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "alpha-bar at step 2; noise standard deviation",
      "type": "vec",
      "ans": [
        0.72,
        0.5291502622129182
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A3: {
  "statement": "**A3 · Foundation · paper — Cumulative problem 3.** For logits \\((2,1,0)\\), give the distribution at \\(T=1\\) and the surviving set at \\(p=0.7\\).",
  "plain": "Denominator \\(e^2+e^1+e^0=7.389+2.718+1=11.107\\), giving \\((0.665,0.245,0.090)\\). At \\(p=0.7\\) the first token alone gives \\(0.665<0.7\\), so two tokens survive, renormalized to \\((0.731,0.269,0)\\).",
  "solution": "<p>Denominator \\(e^2+e^1+e^0=7.389+2.718+1=11.107\\), giving \\((0.665,0.245,0.090)\\). At \\(p=0.7\\) the first token alone gives \\(0.665&lt;0.7\\), so two tokens survive, renormalized to \\((0.731,0.269,0)\\).</p>"
},
A4: {
  "statement": "**A4 · Core · paper — Cumulative problem 4.** Derive Hyvärinen's identity in one dimension and state precisely which boundary condition you used.",
  "plain": "Expand the square, write \\(p\\,\\partial_x\\log p=\\partial_xp\\), integrate \\(-\\int s_\\theta\\partial_xp\\) by parts to get \\(\\int p\\,\\partial_xs_\\theta\\); the boundary term \\([s_\\theta p]_{-\\infty}^{\\infty}\\) must vanish, which holds when \\(p\\) decays faster than \\(s_\\theta\\) grows.",
  "solution": "<p>Expand the square, write \\(p\\,\\partial_x\\log p=\\partial_xp\\), integrate \\(-\\int s_\\theta\\partial_xp\\) by parts to get \\(\\int p\\,\\partial_xs_\\theta\\); the boundary term \\([s_\\theta p]_{-\\infty}^{\\infty}\\) must vanish, which holds when \\(p\\) decays faster than \\(s_\\theta\\) grows.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Cumulative problem 5.** Show that predicting \\(\\varepsilon\\) and predicting \\(x_0\\) are equivalent parameterizations, and write the conversion formula.",
  "plain": "From \\(x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\varepsilon\\), solve \\(\\hat x_0=(x_t-\\sqrt{1-\\bar\\alpha_t}\\hat\\varepsilon)/\\sqrt{\\bar\\alpha_t}\\). The two parameterizations are affine reparameterizations of each other at fixed \\(t\\), differing only in loss weighting.",
  "solution": "<p>From \\(x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\varepsilon\\), solve \\(\\hat x_0=(x_t-\\sqrt{1-\\bar\\alpha_t}\\hat\\varepsilon)/\\sqrt{\\bar\\alpha_t}\\). The two parameterizations are affine reparameterizations of each other at fixed \\(t\\), differing only in loss weighting.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Cumulative problem 6.** Let \\(p(x)=\\mathcal N(0,1)\\) and \\(p(c\\mid x)\\propto\\exp(-(x-1)^2/2)\\). Compute \\(p(x\\mid c)\\), show that classifier-free guidance with exact scores and \\(w=3\\) targets a density \\(\\propto p(x)p(c\\mid x)^3\\) rather than \\(p(x\\mid c)\\), and give the mean and variance of that target.",
  "plain": "Guided score: \\(\\nabla\\log p(x)+w\\nabla\\log p(c\\mid x)=-x-w(x-1)\\), the score of \\(p(x)p(c\\mid x)^w\\). With \\(w=1\\): precision 2, mean 1/2, so \\(p(x\\mid c)=\\mathcal N(0.5,0.5)\\). With \\(w=3\\): precision \\(1+3=4\\), mean \\(3/4\\), so the target is \\(\\mathcal N(0.75,0.25)\\): shifted further toward the condition and half as spread out as the true conditional.",
  "solution": "<p>With \\(s(x\\mid\\varnothing)=\\nabla\\log p(x)\\) and \\(s(x\\mid c)=\\nabla\\log p(x)+\\nabla\\log p(c\\mid x)\\), the guided score is \\(\\nabla\\log p(x)+w\\nabla\\log p(c\\mid x)=\\nabla\\log\\bigl[p(x)p(c\\mid x)^w\\bigr]\\).</p><p>Here \\(\\log p(x)+w\\log p(c\\mid x)=-\\tfrac12x^2-\\tfrac w2(x-1)^2+\\text{const}\\), a Gaussian with precision \\(1+w\\) and mean \\(w/(1+w)\\).</p><ul><li>\\(w=1\\): \\(p(x\\mid c)=\\mathcal N(0.5,0.5)\\).</li><li>\\(w=3\\): \\(\\mathcal N(0.75,0.25)\\).</li></ul><p>The guided sampler targets a sharpened, shifted law, not the model's conditional. (For diffusion, guidance is applied to noised scores at every level, so this is the idealized target; the realized sampler can differ further.)</p>",
  "fields": [
    {
      "id": "value",
      "label": "Mean; variance of the w = 3 target",
      "type": "vec",
      "ans": [
        0.75,
        0.25
      ]
    }
  ],
  "hints": {
    "value": "Add the precisions 1 and w, and weight the condition's mean 1 by w over the total precision."
  }
},
A7: {
  "statement": "**A7 · Core · paper — Cumulative problem 7.** A model's perplexity improves by 4% but human raters prefer the old model's generations at \\(T=0.8,p=0.95\\). Give three explanations consistent with both facts.",
  "plain": "Perplexity is measured on the untruncated distribution while generation uses truncation; the improvement may live entirely in the tail that decoding discards. Alternatively the gain is on a domain unlike the rating prompts, or the new model is better calibrated but less confident, which interacts badly with a fixed nucleus threshold.",
  "solution": "<p>Perplexity is measured on the untruncated distribution while generation uses truncation; the improvement may live entirely in the tail that decoding discards. Alternatively the gain is on a domain unlike the rating prompts, or the new model is better calibrated but less confident, which interacts badly with a fixed nucleus threshold.</p>"
},
A8: {
  "statement": "**A8 · Stretch · paper — Cumulative problem 8.** Prove that the probability-flow ODE permits exact likelihood computation, naming the theorem from the transformations lesson that makes it possible, and state the cost.",
  "plain": "The instantaneous change-of-variables formula: along a deterministic flow, \\(d\\log p/dt=-\\nabla\\cdot f\\), so the log-density change is the integrated divergence. That divergence is a Jacobian trace, estimated by Hutchinson, so the cost is an ODE solve with trace estimates at each step.",
  "solution": "<p>The instantaneous change-of-variables formula: along a deterministic flow, \\(d\\log p/dt=-\\nabla\\cdot f\\), so the log-density change is the integrated divergence. That divergence is a Jacobian trace, estimated by Hutchinson, so the cost is an ODE solve with trace estimates at each step.</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Cumulative problem 9.** A team reports, for guidance weights \\(w=1,3,5,7\\), FID \\(18.0,11.5,9.2,8.4\\), precision \\(0.61,0.74,0.81,0.85\\) and recall \\(0.63,0.52,0.41,0.30\\), and concludes the model has improved. Critique the claim, compute the relative drop in recall from \\(w=1\\) to \\(w=7\\), name the quantity that is silently degrading, and design the measurement that exposes it.",
  "plain": "The model (score network) is unchanged; only the sampler's target \\(p(x)p(c\\mid x)^w\\) changed, so FID improving says nothing about the model. Recall falls from 0.63 to 0.30, a relative drop of \\(0.33/0.63\\approx52.4\\%\\): diversity / coverage of the conditional is degrading while precision rises. Measure precision and recall (or coverage) together, per-prompt diversity among samples at fixed conditioning, and compare models at matched recall or across the whole \\(w\\) curve, always reporting \\(w\\).",
  "solution": "<p>Nothing about the trained model changed across these rows; guidance changes the sampler's target to \\(\\propto p(x)p(c\\mid x)^w\\). Lower FID therefore measures a different distribution, not a better model.</p><p>Recall drops from 0.63 to 0.30: relative drop \\(0.33/0.63=11/21\\approx52.4\\%\\). Precision rising while recall falls is the signature of sharpening: samples become prototypical and cover less of the conditional. FID mixes the two and can improve while coverage collapses.</p><p>Measurement: report precision and recall (or density/coverage) for every \\(w\\), and per-prompt diversity (for example mean pairwise feature distance among 16 samples for the same condition). Compare models along the full precision–recall curve or at matched recall. State \\(w\\) in every reported number.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Relative recall drop (fraction)",
      "type": "num",
      "ans": 0.5238095238095238
    }
  ],
  "hints": {
    "value": "Divide the decrease in recall by the recall at w = 1."
  }
},
A10: {
  "statement": "**A10 · Stretch · paper — Cumulative problem 10.** Data are \\(x=\\pm1\\) with probability \\(\\tfrac12\\) each, and denoising score matching is run at a single fixed \\(\\sigma=0.5\\) with infinite data and capacity. Argue whether it recovers the data score, write the function it does recover, and compute the variance of the distribution an exact sampler with that score produces, compared with the data variance.",
  "plain": "It cannot recover the data score (the data have no density); it recovers the score of \\(q_\\sigma=\\tfrac12\\mathcal N(-1,0.25)+\\tfrac12\\mathcal N(1,0.25)\\), namely \\(\\nabla\\log q_\\sigma(x)=(\\tanh(x/\\sigma^2)-x)/\\sigma^2=4(\\tanh4x-x)\\). An exact sampler with this score produces \\(q_\\sigma\\), with variance \\(1+0.25=1.25\\) versus the data variance 1: blurred samples. Hence a decreasing schedule of \\(\\sigma\\).",
  "solution": "<p>The DSM minimizer at fixed \\(\\sigma\\) is \\(\\nabla\\log q_\\sigma\\), where \\(q_\\sigma=p_{\\text{data}}*\\mathcal N(0,\\sigma^2)\\). Here \\(q_{0.5}=\\tfrac12\\mathcal N(-1,0.25)+\\tfrac12\\mathcal N(1,0.25)\\), and</p><p>\\(\\nabla\\log q_\\sigma(x)=\\dfrac{\\tanh(x/\\sigma^2)-x}{\\sigma^2}=4\\bigl(\\tanh(4x)-x\\bigr).\\)</p><p>The data score does not even exist (the data distribution has no density), so no amount of data or capacity recovers it at fixed \\(\\sigma\\). An exact sampler driven by this score draws from \\(q_\\sigma\\), whose variance is \\(E[x^2]+\\sigma^2=1+0.25=1.25\\), against the data variance 1. Samples are blurred by the noise level, which is why score models use a decreasing schedule of \\(\\sigma\\) and end at a small final level.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Variance of the sampled distribution",
      "type": "num",
      "ans": 1.25
    }
  ],
  "hints": {
    "value": "Adding independent N(0, sigma^2) noise adds sigma^2 to the data variance."
  }
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** What is a score function in score-based modeling?",
  "plain": "It is the spatial gradient of log density. It does not require the normalizing constant when that constant is independent of the spatial variable.",
  "solution": "<p>It is the spatial gradient of log density. It does not require the normalizing constant when that constant is independent of the spatial variable.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the score of a one-dimensional Gaussian with mean mu and variance v.",
  "plain": "Differentiate −(x−mu)²/(2v) plus the x-independent normalization to obtain −(x−mu)/v.",
  "solution": "<p>Differentiate −(x−mu)²/(2v) plus the x-independent normalization to obtain −(x−mu)/v.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** Find the score of N(0,4) at x=2.",
  "plain": "−2/4=−0.5.",
  "solution": "<p>−2/4=−0.5.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": -0.5
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-score experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does an exact continuous-time score make every discretized sampler exact?",
  "plain": "No. Discretization, terminal initialization and solver conventions still matter. Check the intended reverse-time direction, drift and diffusion and study step-size error.",
  "solution": "<p>No. Discretization, terminal initialization and solver conventions still matter. Check the intended reverse-time direction, drift and diffusion and study step-size error.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Validate a diffusion sampler before a large model run.",
  "plain": "Use an analytic Gaussian score and known marginal moments, check noise parameterization and reverse-time convention, sweep step size, and separate score approximation, discretization and guidance effects.",
  "solution": "<p>Use an analytic Gaussian score and known marginal moments, check noise parameterization and reverse-time convention, sweep step size, and separate score approximation, discretization and guidance effects.</p>"
}
});
