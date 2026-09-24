/* Authored probability solutions and offline checks. */
GU.answers("ps-04-multivariate-gaussian-geometry", {
A1: {
  "statement": "**A1 · Foundation · paper — Cumulative problem 1.** Determine whether each matrix is a valid covariance matrix and whether it is positive definite or singular:",
  "plain": "\\(A\\) is positive definite because its leading minors are \\(4\\) and \\(8\\). \\(B\\) is invalid because its determinant is \\(-3\\), giving a negative eigenvalue. \\(C\\) is positive semidefinite but singular: its determinant is zero and direction \\((1,1)^T\\) has zero variance.",
  "solution": "<p>\\(A\\) is positive definite because its leading minors are \\(4\\) and \\(8\\). \\(B\\) is invalid because its determinant is \\(-3\\), giving a negative eigenvalue. \\(C\\) is positive semidefinite but singular: its determinant is zero and direction \\((1,1)^T\\) has zero variance.</p>"
},
A2: {
  "statement": "**A2 · Foundation · paper — Cumulative problem 2.** For covariance matrices \\(\\begin{pmatrix}4&1.5\\\\1.5&1\\end{pmatrix}\\), \\(\\begin{pmatrix}4&-1.5\\\\-1.5&1\\end{pmatrix}\\), and \\(\\operatorname{diag}(4,1)\\), identify the sign of correlation and sketch or describe the orientation and relative axis lengths of their ellipses.",
  "plain": "The first correlation is positive and tilts the long axis upward; the second is negative and tilts it downward. The diagonal matrix has zero correlation and axis-aligned ellipses. All three have greater spread roughly along the first coordinate because its marginal variance is four rather than one.",
  "solution": "<p>The first correlation is positive and tilts the long axis upward; the second is negative and tilts it downward. The diagonal matrix has zero correlation and axis-aligned ellipses. All three have greater spread roughly along the first coordinate because its marginal variance is four rather than one.</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — Cumulative problem 3.** For \\(\\Sigma=\\begin{pmatrix}4&1.5\\\\1.5&1\\end{pmatrix}\\), generate one array of 100,000 standard-normal pairs with NumPy `default_rng(2026)` and transform it once with the Cholesky factor \\(L\\) and once with the eigen factor \\(V\\Lambda^{1/2}\\). Report the maximum absolute covariance error for each and explain why the two realized samples need not be identical.",
  "plain": "Both factors satisfy \\(FF^T=\\Sigma\\): \\(L=\\begin{pmatrix}2&0\\\\0.75&0.6614\\end{pmatrix}\\), while \\(V\\Lambda^{1/2}\\) has columns \\(\\sqrt{\\lambda_i}v_i\\) with \\(\\lambda\\approx(0.3787,\\,4.6213)\\). With the stated seed the maximum absolute sample-covariance errors are about \\(0.0064\\) (Cholesky) and \\(0.0146\\) (eigen). Both are consistent with Monte Carlo error of order \\(\\Sigma_{11}\\sqrt{2/n}\\approx0.018\\). The two factors differ by an orthogonal matrix, \\(V\\Lambda^{1/2}=LQ\\). They send the same noise vector \\(z\\) to different points (individual points differ by up to about 13 units), but \\(Qz\\) is again standard normal, so both samples come from the same target law. Their errors differ only because they are different realized samples.",
  "solution": "<p>Both factors satisfy \\(FF^T=\\Sigma\\): \\(L=\\begin{pmatrix}2&amp;0\\\\0.75&amp;0.6614\\end{pmatrix}\\), while \\(V\\Lambda^{1/2}\\) has columns \\(\\sqrt{\\lambda_i}v_i\\) with \\(\\lambda\\approx(0.3787,\\,4.6213)\\).</p><p>With the stated seed the maximum absolute sample-covariance errors are about \\(0.0064\\) (Cholesky) and \\(0.0146\\) (eigen). Both are consistent with Monte Carlo error of order \\(\\Sigma_{11}\\sqrt{2/n}\\approx0.018\\).</p><p>The two factors differ by an orthogonal matrix, \\(V\\Lambda^{1/2}=LQ\\). They send the same noise vector \\(z\\) to different points (individual points differ by up to about 13 units), but \\(Qz\\) is again standard normal, so both samples come from the same target law. Their errors differ only because they are different realized samples.</p>"
},
A4: {
  "statement": "**A4 · Core · paper — Cumulative problem 4.** Let \\(X\\sim N(\\mu,\\Sigma)\\) with \\(\\mu=(1,0,2)\\) and \\(\\Sigma=\\begin{pmatrix}4&1&0\\\\1&2&1\\\\0&1&3\\end{pmatrix}\\). For the rectangular projection \\(Y=AX+b\\) with \\(A=\\begin{pmatrix}1&1&0\\\\0&1&-1\\end{pmatrix}\\) and \\(b=(0,1)\\), derive the general mean and covariance of \\(Y\\) and evaluate them.",
  "plain": "By linearity \\(E[Y]=A\\mu+b\\), and \\(\\operatorname{Cov}(Y)=E[A(X-\\mu)(X-\\mu)^TA^T]=A\\Sigma A^T\\). Both hold even when \\(A\\) reduces dimension, and \\(Y\\) is Gaussian because it is affine in \\(X\\). Here \\(A\\mu+b=(1+0,\\;0-2+1)=(1,-1)\\) and \\(A\\Sigma A^T=\\begin{pmatrix}8&2\\\\2&3\\end{pmatrix}\\). For example, \\(\\operatorname{Var}(X_1+X_2)=4+2+2\\cdot1=8\\) and \\(\\operatorname{Var}(X_2-X_3)=2+3-2\\cdot1=3\\). So \\(Y\\sim N\\bigl((1,-1),\\begin{pmatrix}8&2\\\\2&3\\end{pmatrix}\\bigr)\\).",
  "solution": "<p>By linearity \\(E[Y]=A\\mu+b\\), and \\(\\operatorname{Cov}(Y)=E[A(X-\\mu)(X-\\mu)^TA^T]=A\\Sigma A^T\\). Both hold even when \\(A\\) reduces dimension, and \\(Y\\) is Gaussian because it is affine in \\(X\\).</p><p>Here \\(A\\mu+b=(1+0,\\;0-2+1)=(1,-1)\\) and \\(A\\Sigma A^T=\\begin{pmatrix}8&amp;2\\\\2&amp;3\\end{pmatrix}\\). For example, \\(\\operatorname{Var}(X_1+X_2)=4+2+2\\cdot1=8\\) and \\(\\operatorname{Var}(X_2-X_3)=2+3-2\\cdot1=3\\). So \\(Y\\sim N\\bigl((1,-1),\\begin{pmatrix}8&amp;2\\\\2&amp;3\\end{pmatrix}\\bigr)\\).</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Cumulative problem 5.** For the same \\(\\mu=(1,0,2)\\) and \\(\\Sigma\\) as in problem 4, compute the marginal distribution of the block \\((X_2,X_3)\\) and its correlation.",
  "plain": "Marginalizing a Gaussian keeps the matching mean entries and the principal covariance block: \\((X_2,X_3)\\sim N\\bigl((0,2),\\begin{pmatrix}2&1\\\\1&3\\end{pmatrix}\\bigr)\\). The correlation is \\(1/\\sqrt{6}\\approx0.408\\).",
  "solution": "<p>Marginalizing a Gaussian keeps the matching mean entries and the principal covariance block: \\((X_2,X_3)\\sim N\\bigl((0,2),\\begin{pmatrix}2&amp;1\\\\1&amp;3\\end{pmatrix}\\bigr)\\).</p><p>The correlation is \\(1/\\sqrt{6}\\approx0.408\\).</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Cumulative problem 6.** Reproduce the numerical conditioning example and verify the implied correlation is valid.",
  "plain": "Correlation is \\(12/(4\\cdot5)=0.6\\). Conditional mean is 74.8 and variance is 10.24.",
  "solution": "<p>Correlation is \\(12/(4\\cdot5)=0.6\\). Conditional mean is 74.8 and variance is 10.24.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Correlation; conditional mean; conditional variance",
      "type": "vec",
      "ans": [
        0.6,
        74.8,
        10.24
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A7: {
  "statement": "**A7 · Core · paper — Cumulative problem 7.** Derive \\(X\\mid Y=y\\) for zero-mean unit-variance variables with correlation \\(\\rho\\).",
  "plain": "The conditional law is \\(\\mathcal N(\\rho y,1-\\rho^2)\\).",
  "solution": "<p>The conditional law is \\(\\mathcal N(\\rho y,1-\\rho^2)\\).</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Cumulative problem 8.** For zero-mean unit-variance jointly Gaussian \\(X,Y\\) with correlation \\(\\rho\\) and the observation \\(Y=1.5\\), compute \\(E[X\\mid Y=1.5]\\) and \\(\\operatorname{sd}(X\\mid Y=1.5)\\) for \\(\\rho=0,\\,0.9,\\,0.99,\\,-0.99\\). Explain the limits \\(\\rho=0\\) and \\(|\\rho|\\to1\\).",
  "plain": "With \\(X\\mid Y=y\\sim N(\\rho y,1-\\rho^2)\\): \\(\\rho=0\\) gives \\((0,\\,1)\\); \\(\\rho=0.9\\) gives \\((1.35,\\,0.436)\\); \\(\\rho=0.99\\) gives \\((1.485,\\,0.141)\\); \\(\\rho=-0.99\\) gives \\((-1.485,\\,0.141)\\). At \\(\\rho=0\\), observing \\(Y\\) changes nothing, so the conditional law equals the marginal. As \\(|\\rho|\\to1\\), the conditional standard deviation \\(\\sqrt{1-\\rho^2}\\to0\\) and \\(X\\) becomes a deterministic function \\(\\pm y\\) of the observation. The sign of \\(\\rho\\) decides whether the mean moves with or against \\(y\\).",
  "solution": "<p>With \\(X\\mid Y=y\\sim N(\\rho y,1-\\rho^2)\\): \\(\\rho=0\\) gives \\((0,\\,1)\\); \\(\\rho=0.9\\) gives \\((1.35,\\,0.436)\\); \\(\\rho=0.99\\) gives \\((1.485,\\,0.141)\\); \\(\\rho=-0.99\\) gives \\((-1.485,\\,0.141)\\).</p><p>At \\(\\rho=0\\), observing \\(Y\\) changes nothing, so the conditional law equals the marginal. As \\(|\\rho|\\to1\\), the conditional standard deviation \\(\\sqrt{1-\\rho^2}\\to0\\) and \\(X\\) becomes a deterministic function \\(\\pm y\\) of the observation. The sign of \\(\\rho\\) decides whether the mean moves with or against \\(y\\).</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Cumulative problem 9.** Let \\(Z\\sim N(0,1)\\), \\(X=Z\\), and \\(Y=(Z^2-1)/\\sqrt2\\). Show that \\((X,Y)\\) has mean zero and identity covariance, that \\(X\\) and \\(Y\\) are dependent, and that \\((X,Y)\\) is not a Gaussian vector.",
  "plain": "\\(E[Y]=(1-1)/\\sqrt2=0\\) and \\(\\operatorname{Var}Y=(E[Z^4]-2E[Z^2]+1)/2=(3-2+1)/2=1\\). \\(\\operatorname{Cov}(X,Y)=E[Z^3-Z]/\\sqrt2=0\\) by symmetry. So the covariance is \\(I_2\\). They are dependent: \\(Y\\) is a deterministic function of \\(X\\). For example, \\(P(Y>1)=P(|Z|>\\sqrt{1+\\sqrt2})>0\\), but \\(P(Y>1\\mid |X|<1)=0\\). The vector is not Gaussian: \\(Y\\ge-1/\\sqrt2\\) always, so \\(Y\\) itself is not normal. If it were jointly Gaussian, zero covariance would force independence.",
  "solution": "<p>\\(E[Y]=(1-1)/\\sqrt2=0\\) and \\(\\operatorname{Var}Y=(E[Z^4]-2E[Z^2]+1)/2=(3-2+1)/2=1\\). \\(\\operatorname{Cov}(X,Y)=E[Z^3-Z]/\\sqrt2=0\\) by symmetry. So the covariance is \\(I_2\\).</p><p>They are dependent: \\(Y\\) is a deterministic function of \\(X\\). For example, \\(P(Y&gt;1)=P(|Z|&gt;\\sqrt{1+\\sqrt2})&gt;0\\), but \\(P(Y&gt;1\\mid |X|&lt;1)=0\\).</p><p>The vector is not Gaussian: \\(Y\\ge-1/\\sqrt2\\) always, so \\(Y\\) itself is not normal. If it were jointly Gaussian, zero covariance would force independence.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Cumulative problem 10.** An empirical covariance for three features is \\(\\hat\\Sigma=\\operatorname{diag}(1,1,10^{-6})\\) because the third feature barely varied in training. Compute the Gaussian log density (mean 0) at \\(x=(0,0,0)\\) and at \\(x=(0,0,0.01)\\), then repeat after regularizing the third variance to \\(10^{-6}+10^{-3}=0.001001\\). Use the numbers to diagnose why a nearly singular covariance destabilizes a Gaussian likelihood.",
  "plain": "With \\(\\log p=-\\tfrac32\\log2\\pi-\\tfrac12\\log|\\hat\\Sigma|-\\tfrac12x^T\\hat\\Sigma^{-1}x\\), the unregularized model gives \\(\\log p(0,0,0)=4.151\\) and \\(\\log p(0,0,0.01)=4.151-\\tfrac12(0.01^2/10^{-6})=-45.849\\). With variance \\(0.001001\\) on the third coordinate these become \\(0.697\\) and \\(0.647\\). The tiny eigenvalue gives a huge \\(-\\tfrac12\\log\\) bonus to points exactly on the training subspace. It also gives a huge inverse eigenvalue, so a deviation of only \\(0.01\\) costs 50 nats. Likelihoods are then dominated by one poorly estimated direction and swing wildly with noise. Use factorized solves, inspect the eigenvalues, and add regularization only when noise of that size is scientifically plausible.",
  "solution": "<p>With \\(\\log p=-\\tfrac32\\log2\\pi-\\tfrac12\\log|\\hat\\Sigma|-\\tfrac12x^T\\hat\\Sigma^{-1}x\\), the unregularized model gives \\(\\log p(0,0,0)=4.151\\) and \\(\\log p(0,0,0.01)=4.151-\\tfrac12(0.01^2/10^{-6})=-45.849\\).</p><p>With variance \\(0.001001\\) on the third coordinate these become \\(0.697\\) and \\(0.647\\).</p><p>The tiny eigenvalue gives a huge \\(-\\tfrac12\\log\\) bonus to points exactly on the training subspace. It also gives a huge inverse eigenvalue, so a deviation of only \\(0.01\\) costs 50 nats. Likelihoods are then dominated by one poorly estimated direction and swing wildly with noise. Use factorized solves, inspect the eigenvalues, and add regularization only when noise of that size is scientifically plausible.</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Cumulative problem 11.** Let \\(X\\sim N(0,\\Sigma)\\) with \\(\\Sigma=\\begin{pmatrix}4&2&1&0\\\\2&3&0&1\\\\1&0&2&1\\\\0&1&1&2\\end{pmatrix}\\). Partition it into \\(a=(X_1,X_2)\\) and \\(b=(X_3,X_4)\\) and compute the distribution of \\(a\\mid b=(1,-1)\\) using linear solves against \\(\\Sigma_{bb}\\). Verify it by drawing \\(4\\times10^6\\) samples (NumPy `default_rng(0)`) and keeping those with \\(|X_3-1|<0.05\\) and \\(|X_4+1|<0.05\\).",
  "plain": "\\(\\Sigma\\) is positive definite (smallest eigenvalue about 0.20). Solving \\(\\Sigma_{bb}u=(1,-1)\\) with \\(\\Sigma_{bb}=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}\\) gives \\(u=(1,-1)\\), so the conditional mean is \\(\\Sigma_{ab}u=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}(1,-1)=(1,-1)\\). Solving \\(\\Sigma_{bb}V=\\Sigma_{ba}\\) gives the conditional covariance \\(\\Sigma_{aa}-\\Sigma_{ab}V=\\begin{pmatrix}10/3&7/3\\\\7/3&7/3\\end{pmatrix}\\), which is symmetric with eigenvalues about \\(0.45\\) and \\(5.22\\), hence positive definite. The narrow-band simulation keeps about 1,330 draws, with empirical mean about \\((1.01,-0.99)\\) and covariance about \\(\\begin{pmatrix}3.32&2.37\\\\2.37&2.35\\end{pmatrix}\\). This agrees within Monte Carlo error of order \\(\\sqrt{2/1330}\\) in relative terms; the band of half-width 0.05 adds only negligible bias.",
  "solution": "<p>\\(\\Sigma\\) is positive definite (smallest eigenvalue about 0.20). Solving \\(\\Sigma_{bb}u=(1,-1)\\) with \\(\\Sigma_{bb}=\\begin{pmatrix}2&amp;1\\\\1&amp;2\\end{pmatrix}\\) gives \\(u=(1,-1)\\), so the conditional mean is \\(\\Sigma_{ab}u=\\begin{pmatrix}1&amp;0\\\\0&amp;1\\end{pmatrix}(1,-1)=(1,-1)\\).</p><p>Solving \\(\\Sigma_{bb}V=\\Sigma_{ba}\\) gives the conditional covariance \\(\\Sigma_{aa}-\\Sigma_{ab}V=\\begin{pmatrix}10/3&amp;7/3\\\\7/3&amp;7/3\\end{pmatrix}\\), which is symmetric with eigenvalues about \\(0.45\\) and \\(5.22\\), hence positive definite.</p><p>The narrow-band simulation keeps about 1,330 draws, with empirical mean about \\((1.01,-0.99)\\) and covariance about \\(\\begin{pmatrix}3.32&amp;2.37\\\\2.37&amp;2.35\\end{pmatrix}\\). This agrees within Monte Carlo error of order \\(\\sqrt{2/1330}\\) in relative terms; the band of half-width 0.05 adds only negligible bias.</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Cumulative problem 12.** With NumPy `default_rng(0)`, generate 2,000 training and 2,000 test points in \\(\\mathbb R^2\\): with probability 0.95 a point comes from \\(0.5N((-3,0),I)+0.5N((3,0),I)\\), otherwise it is an outlier from \\(N(0,25I)\\). Fit (a) a single Gaussian by maximum likelihood, (b) a two-component Gaussian mixture by EM (initial means \\((\\pm1,0)\\)), and (c) a multivariate \\(t\\) with 3 degrees of freedom by EM. Report the mean held-out log-likelihood of each, and compare each model's probability of the central strip \\(|x_1|<1\\) and of the far region \\(\\|x\\|>8\\) with the test frequencies.",
  "plain": "Held-out mean log-likelihoods are about \\(-4.36\\) (single Gaussian), \\(-4.06\\) (mixture) and \\(-4.32\\) (\\(t_3\\)). The mixture wins overall, but the geometric diagnostics show what each model gets wrong. Central strip \\(|x_1|<1\\): the test frequency is 3.0%. The single Gaussian puts about 24% there and the \\(t_3\\) about 23%, because a single ellipse centred at the origin fills the empty valley between the clusters. The mixture gives about 5%. Far region \\(\\|x\\|>8\\): the test frequency is about 1.2%. The mixture gives about 0.01%, because its light-tailed components cannot explain the outliers. The single Gaussian gives about 1.8%, only by inflating its horizontal variance to about 10.8. The \\(t_3\\) gives about 8.5%, overstating the tails. So a single Gaussian misses multimodality and is distorted by outliers; a Gaussian mixture captures the clusters but has tails that are too light; a heavy-tailed ellipse handles radial extremes but not multimodality. Held-out log score alone ranks the models; region probabilities, projections and radial-distance checks explain why.",
  "solution": "<p>Held-out mean log-likelihoods are about \\(-4.36\\) (single Gaussian), \\(-4.06\\) (mixture) and \\(-4.32\\) (\\(t_3\\)). The mixture wins overall, but the geometric diagnostics show what each model gets wrong.</p><p>Central strip \\(|x_1|&lt;1\\): the test frequency is 3.0%. The single Gaussian puts about 24% there and the \\(t_3\\) about 23%, because a single ellipse centred at the origin fills the empty valley between the clusters. The mixture gives about 5%.</p><p>Far region \\(\\|x\\|&gt;8\\): the test frequency is about 1.2%. The mixture gives about 0.01%, because its light-tailed components cannot explain the outliers. The single Gaussian gives about 1.8%, only by inflating its horizontal variance to about 10.8. The \\(t_3\\) gives about 8.5%, overstating the tails.</p><p>So a single Gaussian misses multimodality and is distorted by outliers; a Gaussian mixture captures the clusters but has tails that are too light; a heavy-tailed ellipse handles radial extremes but not multimodality. Held-out log score alone ranks the models; region probabilities, projections and radial-distance checks explain why.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** When does an ordinary multivariate Gaussian density exist?",
  "plain": "The covariance must be positive definite. A singular covariance defines a valid Gaussian measure supported on a lower-dimensional affine subspace, but no full-dimensional Lebesgue density.",
  "solution": "<p>The covariance must be positive definite. A singular covariance defines a valid Gaussian measure supported on a lower-dimensional affine subspace, but no full-dimensional Lebesgue density.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the conditional variance for two standardized jointly Gaussian variables with correlation rho.",
  "plain": "Subtract rho X from Y. The residual has variance 1−rho² and zero covariance with X; joint Gaussianity makes the residual independent of X.",
  "solution": "<p>Subtract rho X from Y. The residual has variance 1−rho² and zero covariance with X; joint Gaussianity makes the residual independent of X.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** For standardized jointly Gaussian X,Y with correlation 0.6, find Var(Y|X).",
  "plain": "1−0.6²=0.64.",
  "solution": "<p>1−0.6²=0.64.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.64
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-gaussian experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Does a small empirical covariance eigenvalue prove a genuine low-variance population direction?",
  "plain": "No. Finite-sample error, high dimension, feature scaling and dependence may produce small sample eigenvalues. Separate the model assumption from its estimate.",
  "solution": "<p>No. Finite-sample error, high dimension, feature scaling and dependence may produce small sample eigenvalues. Separate the model assumption from its estimate.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Design a Gaussian conditioning implementation audit.",
  "plain": "Compare conditional means and covariances with a small analytic example, solve linear systems instead of forming inverses, and test nearly singular and exactly singular inputs with an explicit policy.",
  "solution": "<p>Compare conditional means and covariances with a small analytic example, solve linear systems instead of forming inverses, and test nearly singular and exactly singular inputs with an explicit policy.</p>"
}
});
