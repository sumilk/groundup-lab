/* Authored probability solutions and offline checks. */
GU.answers("ps-14-latent-variables-elbo-gradient-estimators", {
A1: {
  "statement": "**A1 · Foundation · paper — Cumulative problem 1.** Compute \\(\\operatorname{KL}(\\mathcal N(2,0.25)\\Vert\\mathcal N(0,1))\\).",
  "plain": "\\(\\tfrac12(0.25+4-1-\\log0.25)=\\tfrac12(3.25+1.386)\\approx2.32\\).",
  "solution": "<p>\\(\\tfrac12(0.25+4-1-\\log0.25)=\\tfrac12(3.25+1.386)\\approx2.32\\).</p>",
  "fields": [
    {
      "id": "value",
      "label": "Gaussian KL divergence (nats)",
      "type": "num",
      "ans": 2.3181471805599454
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Cumulative problem 2.** State the reparameterization for \\(\\mathcal N(\\mu,\\sigma^2)\\) and say why \\(\\varepsilon\\) must not depend on \\(\\phi\\).",
  "plain": "\\(z=\\mu+\\sigma\\varepsilon\\), \\(\\varepsilon\\sim\\mathcal N(0,1)\\). If \\(\\varepsilon\\) depended on \\(\\phi\\) the expectation would again be over a parameter-dependent measure and the gradient could not pass inside.",
  "solution": "<p>\\(z=\\mu+\\sigma\\varepsilon\\), \\(\\varepsilon\\sim\\mathcal N(0,1)\\). If \\(\\varepsilon\\) depended on \\(\\phi\\) the expectation would again be over a parameter-dependent measure and the gradient could not pass inside.</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — Cumulative problem 3.** Given \\(\\log w=(0,1,2)\\), compute \\(\\operatorname{softmax}(\\log w)\\).",
  "plain": "Denominators \\(e^0+e^1+e^2=1+2.718+7.389=11.107\\), giving \\((0.090,0.245,0.665)\\).",
  "solution": "<p>Denominators \\(e^0+e^1+e^2=1+2.718+7.389=11.107\\), giving \\((0.090,0.245,0.665)\\).</p>"
},
A4: {
  "statement": "**A4 · Core · paper — Cumulative problem 4.** Prove \\(E_{q_\\phi}[\\nabla_\\phi\\log q_\\phi(z)]=0\\) and explain precisely why this makes baselines unbiased.",
  "plain": "\\(E[\\nabla\\log q]=\\int q\\nabla\\log q=\\int\\nabla q=\\nabla\\int q=\\nabla1=0\\). Hence \\(E[b\\nabla\\log q]=0\\) for constant \\(b\\), so subtracting it changes no expectation while it can change variance.",
  "solution": "<p>\\(E[\\nabla\\log q]=\\int q\\nabla\\log q=\\int\\nabla q=\\nabla\\int q=\\nabla1=0\\). Hence \\(E[b\\nabla\\log q]=0\\) for constant \\(b\\), so subtracting it changes no expectation while it can change variance.</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Cumulative problem 5.** Derive the ELBO gap as a KL divergence, and use it to explain why maximizing the ELBO over \\(q\\) performs posterior inference.",
  "plain": "Substitute \\(p(x,z)=p(z\\mid x)p(x)\\) into \\(E_q[\\log p(x,z)-\\log q]\\); the \\(\\log p(x)\\) term is constant in \\(z\\) and factors out, leaving \\(-\\operatorname{KL}(q\\Vert p(z\\mid x))\\). Since \\(\\log p(x)\\) does not depend on \\(q\\), maximizing \\(\\mathcal L\\) over \\(q\\) minimizes that KL.",
  "solution": "<p>Substitute \\(p(x,z)=p(z\\mid x)p(x)\\) into \\(E_q[\\log p(x,z)-\\log q]\\); the \\(\\log p(x)\\) term is constant in \\(z\\) and factors out, leaving \\(-\\operatorname{KL}(q\\Vert p(z\\mid x))\\). Since \\(\\log p(x)\\) does not depend on \\(q\\), maximizing \\(\\mathcal L\\) over \\(q\\) minimizes that KL.</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Cumulative problem 6.** Let \\(q_\\mu=\\mathcal N(\\mu,1)\\) and \\(f(z)=\\mathbf 1\\{z>0\\}\\), so the target is \\(\\tfrac{d}{d\\mu}P(z>0)=\\tfrac{d}{d\\mu}\\Phi(\\mu)=\\varphi(\\mu)\\). Show that the score-function estimator \\(f(z)(z-\\mu)\\) has expectation \\(\\varphi(\\mu)\\) and evaluate it at \\(\\mu=0\\). Then show the pathwise estimator \\(\\partial_\\mu f(\\mu+\\varepsilon)\\) is 0 almost surely, and explain why it is wrong here.",
  "plain": "Write \\(z=\\mu+\\varepsilon\\). Then \\(E[\\mathbf 1\\{\\varepsilon>-\\mu\\}\\varepsilon]=\\int_{-\\mu}^\\infty\\varepsilon\\varphi(\\varepsilon)d\\varepsilon=\\varphi(-\\mu)=\\varphi(\\mu)\\); at \\(\\mu=0\\) this is \\(1/\\sqrt{2\\pi}\\approx0.3989\\). The score estimator only multiplies the value of \\(f\\) by the score, so it needs no derivative of \\(f\\). The pathwise estimator differentiates \\(\\mathbf 1\\{\\mu+\\varepsilon>0\\}\\) in \\(\\mu\\), which is 0 except on the null set \\(\\varepsilon=-\\mu\\), so its mean is 0, not \\(\\varphi(\\mu)\\): exchanging derivative and expectation fails because \\(f\\) has a jump, whose contribution is a point mass the sampled derivative never sees.",
  "solution": "<p>Write \\(z=\\mu+\\varepsilon\\), \\(\\varepsilon\\sim\\mathcal N(0,1)\\). The score is \\(z-\\mu=\\varepsilon\\), so</p><p>\\(E[f(z)(z-\\mu)]=E[\\mathbf 1\\{\\varepsilon>-\\mu\\}\\varepsilon]=\\int_{-\\mu}^{\\infty}\\varepsilon\\varphi(\\varepsilon)\\,d\\varepsilon=\\bigl[-\\varphi(\\varepsilon)\\bigr]_{-\\mu}^{\\infty}=\\varphi(\\mu)\\),</p><p>using \\(\\varphi'(\\varepsilon)=-\\varepsilon\\varphi(\\varepsilon)\\). At \\(\\mu=0\\) the value is \\(1/\\sqrt{2\\pi}\\approx0.3989\\). Only the value of \\(f\\) and the score appear, so discontinuity of \\(f\\) is harmless.</p><p>Pathwise: \\(\\partial_\\mu\\mathbf 1\\{\\mu+\\varepsilon>0\\}=0\\) for every \\(\\varepsilon\\ne-\\mu\\), a probability-one event, so the estimator is identically 0 and its expectation 0 differs from \\(\\varphi(\\mu)\\). The interchange \\(\\partial_\\mu E=E\\partial_\\mu\\) requires \\(f\\) (almost everywhere differentiable and) absolutely continuous along the path; the jump contributes a point mass \\(\\varphi(\\mu)\\) that no sampled derivative can detect.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Expected score-function estimate at mu = 0",
      "type": "num",
      "ans": 0.3989422804014327
    }
  ],
  "hints": {
    "value": "Integrate epsilon times the standard normal density from -mu to infinity; at mu = 0 you get 1/sqrt(2*pi)."
  }
},
A7: {
  "statement": "**A7 · Core · paper — Cumulative problem 7.** A VAE team reports held-out numbers (nats per example): at epoch 10, reconstruction \\(E_q[\\log p(x\\mid z)]=-92.0\\) and \\(\\operatorname{KL}(q\\Vert p(z))=12.0\\); at epoch 20, reconstruction \\(-95.5\\) and KL \\(6.0\\). Compute the ELBO at both epochs and explain, using the two terms, how the ELBO improved while reconstruction worsened.",
  "plain": "ELBO = reconstruction − KL: epoch 10 gives \\(-92.0-12.0=-104.0\\), epoch 20 gives \\(-95.5-6.0=-101.5\\). The ELBO rose by 2.5 nats because the KL fell by 6.0 while reconstruction fell by only 3.5: the encoder moved \\(q(z\\mid x)\\) toward the prior (less information in \\(z\\)), a trade the objective rewards. Report both terms separately, and per-dimension KL.",
  "solution": "<p>\\(\\mathcal L=E_q[\\log p(x\\mid z)]-\\operatorname{KL}(q\\Vert p(z))\\).</p><ul><li>Epoch 10: \\(-92.0-12.0=-104.0\\).</li><li>Epoch 20: \\(-95.5-6.0=-101.5\\).</li></ul><p>The bound improved by 2.5 nats although reconstruction degraded by 3.5 nats, because the KL term dropped by 6.0. The encoder is pushing \\(q(z\\mid x)\\) toward the prior, carrying less information about \\(x\\) in \\(z\\); the objective rewards that trade whenever the KL saving exceeds the reconstruction loss. This is the early signature of posterior collapse, so report the two terms separately (and per-dimension KL) rather than only their sum.</p>",
  "fields": [
    {
      "id": "value",
      "label": "ELBO at epoch 10; ELBO at epoch 20",
      "type": "vec",
      "ans": [
        -104.0,
        -101.5
      ]
    }
  ],
  "hints": {
    "value": "Subtract the KL from the reconstruction term at each epoch."
  }
},
A8: {
  "statement": "**A8 · Stretch · paper — Cumulative problem 8.** A text VAE with an autoregressive decoder and 32 latent dimensions reaches, after 2,000 steps, total KL 0.04 nats (every dimension below 0.003 nats) and reconstruction \\(-61.2\\) nats per sentence, and its samples look fluent. (a) Name the failure. (b) Decoding each sentence with the latent code of a different sentence changes reconstruction by only 0.1 nats, whereas a healthy reference VAE changes by 38 nats; what does this establish that the total KL alone does not? (c) You add free bits with \\(\\lambda=0.25\\) nats per dimension: below what total KL does the modified objective stop penalizing, and what cost must be reported?",
  "plain": "(a) Posterior collapse: the autoregressive decoder models text without \\(z\\), so \\(q(z\\mid x)\\to p(z)\\). (b) Low KL says \\(q\\) ignores \\(x\\); the swap test shows the decoder also ignores \\(z\\) (0.1 versus 38 nats), so the latent is unused rather than merely compressed. Per-dimension KL confirms no dimension is active. (c) Free bits stops penalizing KL below \\(32\\times0.25=8\\) nats in total. The cost: the objective is no longer the ELBO, so both it and the true ELBO must be reported, and reconstruction may trade off against the forced KL.",
  "solution": "<p><b>(a)</b> Posterior collapse. A powerful autoregressive decoder can model the text without \\(z\\), so the optimum drives \\(q(z\\mid x)\\) to the prior and the KL to zero; fluent samples come from the decoder alone.</p><p><b>(b)</b> A near-zero KL shows the encoder output does not depend on \\(x\\). It does not by itself show the decoder ignores \\(z\\). The swap test does: replacing the code changes reconstruction by 0.1 nats against 38 nats for a healthy model, so decoding does not depend on \\(z\\). Together with per-dimension KL (all 32 below 0.003, none active), this separates collapse from a latent that encodes a small amount of genuinely shared information.</p><p><b>(c)</b> Free bits replaces each \\(\\operatorname{KL}_j\\) with \\(\\max(0.25,\\operatorname{KL}_j)\\), so there is no pressure to reduce KL below \\(32\\times0.25=8\\) nats in total. The cost is that the trained objective is not the ELBO: report both the modified objective and the true ELBO, and check that reconstruction and held-out bound do not degrade.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Total free-bits KL floor (nats)",
      "type": "num",
      "ans": 8
    }
  ],
  "hints": {
    "value": "Multiply the per-dimension floor by the number of latent dimensions."
  }
},
A9: {
  "statement": "**A9 · Stretch · paper — Cumulative problem 9.** A routing layer chooses one of 64 experts per token. On a probe batch whose exact router gradient can be enumerated, you measure per-token relative variance \\(\\operatorname{tr}\\operatorname{Cov}(\\hat g)/\\lVert g\\rVert^2\\): REINFORCE with a mean baseline gives 24 and is unbiased; Gumbel-softmax at \\(\\tau=0.5\\) gives 0.6, and its mean gradient has cosine similarity 0.95 with the exact gradient. (a) How many tokens per batch does REINFORCE need to match the Gumbel-softmax variance at a batch of 512 tokens? (b) Which estimator's error shrinks to zero as batch size grows, and which does not? (c) Explain how a differentiable load-balancing penalty on the router probabilities interacts with each estimator, and recommend one with the evidence you would still collect.",
  "plain": "(a) Variance scales as 1/batch, so REINFORCE needs \\(512\\times24/0.6=20480\\) tokens. (b) REINFORCE is unbiased, so its error vanishes with batch size; Gumbel-softmax keeps a bias (cosine 0.95) that more samples cannot remove, only lower \\(\\tau\\). (c) A load-balancing penalty on router probabilities is differentiable and can be added exactly in both cases; with REINFORCE it adds a low-variance deterministic term beside the noisy one, while with Gumbel-softmax it interacts with the relaxed samples. At typical batch sizes Gumbel-softmax (or straight-through) is the practical choice; collect bias versus \\(\\tau\\), variance at matched batch, and downstream loss at matched compute.",
  "solution": "<p><b>(a)</b> For averages of independent per-token estimates, variance scales as \\(1/B\\). Matching \\(24/B=0.6/512\\) gives \\(B=512\\times24/0.6=20480\\) tokens, a 40-fold larger batch.</p><p><b>(b)</b> REINFORCE with a constant baseline is unbiased, so its error goes to zero as \\(B\\to\\infty\\). Gumbel-softmax at fixed \\(\\tau\\) has a bias (mean direction off by \\(\\arccos0.95\\approx18^\\circ\\)) that no batch size removes; only lowering \\(\\tau\\), at the cost of higher variance, shrinks it.</p><p><b>(c)</b> A load-balancing penalty written on router probabilities is a deterministic differentiable function of the logits, so its exact gradient can be added in either case. With REINFORCE it contributes a low-variance term that may dominate the noisy task gradient; with Gumbel-softmax the task gradient is also low variance, so the two are balanced more predictably. Recommendation: Gumbel-softmax (or straight-through) at realistic batch sizes, since REINFORCE would need 40 times more tokens; keep the probe batch to track bias against the exact gradient as \\(\\tau\\) is annealed, report gradient variance at matched batch, and compare downstream loss at matched compute.</p>",
  "fields": [
    {
      "id": "value",
      "label": "REINFORCE batch size to match variance",
      "type": "num",
      "ans": 20480
    }
  ],
  "hints": {
    "value": "Per-token variance divided by batch size must be equal for the two estimators."
  }
},
A10: {
  "statement": "**A10 · Stretch · paper — Cumulative problem 10.** Prove \\(\\mathcal L_K\\le\\mathcal L_{K+1}\\) for the importance-weighted bound, and explain why larger \\(K\\) reduces the bound gap but not necessarily the gradient variance.",
  "plain": "Let \\(\\hat Y_{K+1}\\) be the mean of \\(K+1\\) iid weights. It equals the average over the \\(K+1\\) choices of which index to drop of the resulting \\(K\\)-sample means. By concavity, \\(\\log\\hat Y_{K+1}\\ge\\) the average of the \\(K+1\\) logs; taking expectations, each term has mean \\(\\mathcal L_K\\), so \\(\\mathcal L_{K+1}\\ge\\mathcal L_K\\). The gap shrinks because \\(\\hat Y_K\\) concentrates around \\(p(x)\\). Gradient noise need not fall: for the encoder, the true gradient of \\(\\mathcal L_K\\) shrinks toward 0 as the bound tightens faster than the estimator's standard deviation, so the signal-to-noise ratio of the inference-network gradient can decrease (roughly like \\(1/\\sqrt K\\)).",
  "solution": "<p>Let \\(w_1,\\ldots,w_{K+1}\\) be iid importance weights and \\(\\hat Y_{K+1}=\\frac1{K+1}\\sum_i w_i\\). For each \\(j\\), let \\(\\hat Y^{(-j)}\\) be the mean of the \\(K\\) weights excluding \\(j\\). Then \\(\\hat Y_{K+1}=\\frac1{K+1}\\sum_j\\hat Y^{(-j)}\\), and concavity of \\(\\log\\) gives \\(\\log\\hat Y_{K+1}\\ge\\frac1{K+1}\\sum_j\\log\\hat Y^{(-j)}\\). Each \\(\\hat Y^{(-j)}\\) is a \\(K\\)-sample mean, so taking expectations gives \\(\\mathcal L_{K+1}\\ge\\mathcal L_K\\).</p><p>The gap \\(\\log p(x)-\\mathcal L_K\\) shrinks because \\(\\hat Y_K\\) concentrates around \\(p(x)\\), shrinking the Jensen gap. Gradient variance is a separate question. For the decoder, larger \\(K\\) helps. For the encoder, the expected gradient of \\(\\mathcal L_K\\) with respect to \\(\\phi\\) tends to 0 as the bound becomes insensitive to \\(q\\), faster than the estimator's noise, so its signal-to-noise ratio can fall, roughly like \\(1/\\sqrt K\\) (Rainforth et al., 2018). Also, the log of an average does not decompose into per-sample terms, so the \\(K\\) samples do not act like an independent batch.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** What is the gap between log evidence and the ELBO?",
  "plain": "It is KL(q(z|x) || p(z|x)), provided the densities and expectations are well defined. The gap vanishes when q equals the posterior almost everywhere.",
  "solution": "<p>It is KL(q(z|x) || p(z|x)), provided the densities and expectations are well defined. The gap vanishes when q equals the posterior almost everywhere.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the score-function identity with its conditions.",
  "plain": "For parameter-independent support and justified differentiation under the integral, differentiate ∫q_phi(z)f(z)dz to get E[f(z)∇log q_phi(z)] when f has no explicit phi dependence; add E[∇f] otherwise.",
  "solution": "<p>For parameter-independent support and justified differentiation under the integral, differentiate ∫q_phi(z)f(z)dz to get E[f(z)∇log q_phi(z)] when f has no explicit phi dependence; add E[∇f] otherwise.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** The exact binary posterior and variational distribution both assign probability 0.3 to state one. What is their ELBO gap?",
  "plain": "KL between identical distributions is zero.",
  "solution": "<p>KL between identical distributions is zero.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-gradient experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Is an importance-weighted evidence estimate a self-normalized posterior expectation?",
  "plain": "No. Evidence uses an ordinary average of unnormalized importance weights. Self-normalized weights estimate posterior expectations; confusing them changes the estimand.",
  "solution": "<p>No. Evidence uses an ordinary average of unnormalized importance weights. Self-normalized weights estimate posterior expectations; confusing them changes the estimand.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Compare a pathwise and score-function gradient implementation.",
  "plain": "Use a tractable distribution with an analytic gradient, independent repeated estimates, a baseline whose treatment preserves unbiasedness, and finite-difference checks. Compare bias, variance and cost; do not assume pathwise always dominates.",
  "solution": "<p>Use a tractable distribution with an analytic gradient, independent repeated estimates, a baseline whose treatment preserves unbiasedness, and finite-difference checks. Compare bias, variance and cost; do not assume pathwise always dominates.</p>"
}
});
