/* Authored probability solutions and offline checks. */
GU.answers("ps-03-transformations-convolution-jacobians", {
A1: {
  "statement": "**A1 · Foundation · paper — Cumulative problem 1.** Let \\(P(X=-2,-1,0,1,2)=(0.1,0.2,0.4,0.2,0.1)\\) and \\(Y=X^2\\). Derive the complete PMF of \\(Y\\), state its support, and verify mass conservation.",
  "plain": "The support is \\(\\{0,1,4\\}\\). Its masses are \\(P(Y=0)=0.4\\), \\(P(Y=1)=0.2+0.2=0.4\\), and \\(P(Y=4)=0.1+0.1=0.2\\), which sum to one. The many-to-one map adds mass over every preimage rather than assigning one input representative to each output.",
  "solution": "<p>The support is \\(\\{0,1,4\\}\\). Its masses are \\(P(Y=0)=0.4\\), \\(P(Y=1)=0.2+0.2=0.4\\), and \\(P(Y=4)=0.1+0.1=0.2\\), which sum to one. The many-to-one map adds mass over every preimage rather than assigning one input representative to each output.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Masses at 0, 1, 4",
      "type": "vec",
      "ans": [
        0.4,
        0.4,
        0.2
      ]
    }
  ],
  "hints": {
    "value": "Use the quantities and assumptions in the question. Check each requested component separately before entering them in the labeled order."
  }
},
A2: {
  "statement": "**A2 · Foundation · paper — Cumulative problem 2.** If \\(X\\sim\\operatorname{Uniform}(0,1)\\), derive the density of \\(Y=-\\log X\\).",
  "plain": "For \\(y\\ge0\\), \\(P(-\\log X\\le y)=P(X\\ge e^{-y})=1-e^{-y}\\); the density is \\(e^{-y}\\).",
  "solution": "<p>For \\(y\\ge0\\), \\(P(-\\log X\\le y)=P(X\\ge e^{-y})=1-e^{-y}\\); the density is \\(e^{-y}\\).</p>"
},
A3: {
  "statement": "**A3 · Foundation · paper — Cumulative problem 3.** If \\(X\\) has density \\(2x\\) on \\([0,1]\\), derive the density of \\(Y=X^2\\).",
  "plain": "Since \\(F_X(x)=x^2\\), \\(F_Y(y)=P(X^2\\le y)=F_X(\\sqrt y)=y\\). Thus \\(Y\\) is uniform on \\([0,1]\\).",
  "solution": "<p>Since \\(F_X(x)=x^2\\), \\(F_Y(y)=P(X^2\\le y)=F_X(\\sqrt y)=y\\). Thus \\(Y\\) is uniform on \\([0,1]\\).</p>"
},
A4: {
  "statement": "**A4 · Core · paper — Cumulative problem 4.** Derive the distribution of \\(|X|\\) for a symmetric density \\(f_X\\). Apply it to the Laplace density \\(f_X(x)=\\tfrac12e^{-|x|}\\): name the distribution of \\(|X|\\) and compute \\(P(|X|>2)\\).",
  "plain": "For \\(y>0\\) the two branches are \\(x=y\\) and \\(x=-y\\), each with \\(|dx/dy|=1\\), so \\(f_{|X|}(y)=f_X(y)+f_X(-y)=2f_X(y)\\) under symmetry, and \\(f_{|X|}(y)=0\\) for \\(y<0\\). For the Laplace density, \\(f_{|X|}(y)=2\\cdot\\tfrac12e^{-y}=e^{-y}\\) on \\(y>0\\), so \\(|X|\\sim\\text{Exponential}(1)\\) and \\(P(|X|>2)=e^{-2}\\approx0.1353\\).",
  "solution": "<p>For \\(y&gt;0\\) the two branches are \\(x=y\\) and \\(x=-y\\), each with \\(|dx/dy|=1\\), so \\(f_{|X|}(y)=f_X(y)+f_X(-y)=2f_X(y)\\) under symmetry, and \\(f_{|X|}(y)=0\\) for \\(y&lt;0\\).</p><p>For the Laplace density, \\(f_{|X|}(y)=2\\cdot\\tfrac12e^{-y}=e^{-y}\\) on \\(y&gt;0\\), so \\(|X|\\sim\\text{Exponential}(1)\\) and \\(P(|X|&gt;2)=e^{-2}\\approx0.1353\\).</p>"
},
A5: {
  "statement": "**A5 · Core · paper — Cumulative problem 5.** Transform a uniform point in the unit square by \\(A=\\begin{bmatrix}3&1\\\\0&2\\end{bmatrix}\\); find its support area and density.",
  "plain": "The determinant is six, so the image parallelogram has area six and constant density \\(1/6\\).",
  "solution": "<p>The determinant is six, so the image parallelogram has area six and constant density \\(1/6\\).</p>"
},
A6: {
  "statement": "**A6 · Core · paper — Cumulative problem 6.** Derive a uniform-area sampler for the unit disk using two independent Uniform\\((0,1)\\) variables \\(U,V\\). Check your sampler by computing \\(P(R\\le 1/2)\\), which must equal the area fraction \\(1/4\\), and explain why \\(R=U\\) would fail this check.",
  "plain": "A uniform point on the unit disk has \\(P(R\\le r)=\\pi r^2/\\pi=r^2\\), so \\(f_R(r)=2r\\) on \\([0,1]\\) and the angle is Uniform\\([0,2\\pi)\\) independently. Inverting \\(F_R(r)=r^2\\) gives \\(R=\\sqrt U\\); set \\(\\Theta=2\\pi V\\) and return \\((R\\cos\\Theta,R\\sin\\Theta)\\). Check: \\(P(\\sqrt U\\le1/2)=P(U\\le1/4)=1/4\\), the area of the radius-\\(1/2\\) disk divided by \\(\\pi\\). With \\(R=U\\) the probability is \\(1/2\\): too many points near the centre, because the polar area element \\(r\\,dr\\,d\\theta\\) is ignored.",
  "solution": "<p>A uniform point on the unit disk has \\(P(R\\le r)=\\pi r^2/\\pi=r^2\\), so \\(f_R(r)=2r\\) on \\([0,1]\\) and the angle is Uniform\\([0,2\\pi)\\) independently. Inverting \\(F_R(r)=r^2\\) gives \\(R=\\sqrt U\\); set \\(\\Theta=2\\pi V\\) and return \\((R\\cos\\Theta,R\\sin\\Theta)\\).</p><p>Check: \\(P(\\sqrt U\\le1/2)=P(U\\le1/4)=1/4\\), the area of the radius-\\(1/2\\) disk divided by \\(\\pi\\). With \\(R=U\\) the probability is \\(1/2\\): too many points near the centre, because the polar area element \\(r\\,dr\\,d\\theta\\) is ignored.</p>"
},
A7: {
  "statement": "**A7 · Core · paper — Cumulative problem 7.** Let \\(X_1,X_2\\) be independent Bernoulli\\((p)\\). Convolve their PMFs to obtain the PMF of \\(X_1+X_2\\), identify it as the binomial PMF for two trials, and evaluate it at \\(p=0.3\\).",
  "plain": "\\(P(S=0)=(1-p)^2\\), \\(P(S=1)=p(1-p)+(1-p)p=2p(1-p)\\), \\(P(S=2)=p^2\\), which is \\(\\binom2k p^k(1-p)^{2-k}\\), the Binomial\\((2,p)\\) PMF. At \\(p=0.3\\): \\(P(S=0,1,2)=(0.49,\\,0.42,\\,0.09)\\), which sum to one.",
  "solution": "<p>\\(P(S=0)=(1-p)^2\\), \\(P(S=1)=p(1-p)+(1-p)p=2p(1-p)\\), \\(P(S=2)=p^2\\), which is \\(\\binom2k p^k(1-p)^{2-k}\\), the Binomial\\((2,p)\\) PMF.</p><p>At \\(p=0.3\\): \\(P(S=0,1,2)=(0.49,\\,0.42,\\,0.09)\\), which sum to one.</p>"
},
A8: {
  "statement": "**A8 · Core · paper — Cumulative problem 8.** Convolve two uniform \\([0,1]\\) densities and verify the result integrates to one.",
  "plain": "For \\(0\\le s\\le1\\), \\(f_S(s)=\\int_0^s1\\,dx=s\\); for \\(1<s\\le2\\), \\(f_S(s)=\\int_{s-1}^11\\,dx=2-s\\); otherwise \\(0\\). Then \\(\\int_0^1 s\\,ds+\\int_1^2(2-s)\\,ds=\\tfrac12+\\tfrac12=1\\): each half of the triangle has area one half.",
  "solution": "<p>For \\(0\\le s\\le1\\), \\(f_S(s)=\\int_0^s1\\,dx=s\\); for \\(1&lt;s\\le2\\), \\(f_S(s)=\\int_{s-1}^11\\,dx=2-s\\); otherwise \\(0\\).</p><p>Then \\(\\int_0^1 s\\,ds+\\int_1^2(2-s)\\,ds=\\tfrac12+\\tfrac12=1\\): each half of the triangle has area one half.</p>"
},
A9: {
  "statement": "**A9 · Stretch · paper — Cumulative problem 9.** Let \\(X\\sim\\text{Bernoulli}(1/2)\\). For each of \\(Y=X\\), \\(Y=1-X\\), and \\(Y\\) an independent Bernoulli\\((1/2)\\), give the PMF of \\(X+Y\\). All three pairs have the same marginals; show that the independent convolution formula is correct only for the last one.",
  "plain": "Independent convolution of two Bernoulli\\((1/2)\\) PMFs gives \\(P(S=0,1,2)=(1/4,1/2,1/4)\\), which is correct for the independent pair. With \\(Y=X\\), \\(S=2X\\) takes the values \\(0\\) and \\(2\\) with probability \\(1/2\\) each, and \\(P(S=1)=0\\). With \\(Y=1-X\\), \\(S=1\\) with certainty. Neither matches \\((1/4,1/2,1/4)\\), even though every marginal is Bernoulli\\((1/2)\\): the law of a sum depends on the joint law, and the product formula uses independence.",
  "solution": "<p>Independent convolution of two Bernoulli\\((1/2)\\) PMFs gives \\(P(S=0,1,2)=(1/4,1/2,1/4)\\), which is correct for the independent pair.</p><p>With \\(Y=X\\), \\(S=2X\\) takes the values \\(0\\) and \\(2\\) with probability \\(1/2\\) each, and \\(P(S=1)=0\\). With \\(Y=1-X\\), \\(S=1\\) with certainty. Neither matches \\((1/4,1/2,1/4)\\), even though every marginal is Bernoulli\\((1/2)\\): the law of a sum depends on the joint law, and the product formula uses independence.</p>"
},
A10: {
  "statement": "**A10 · Stretch · paper — Cumulative problem 10.** Let \\(x\\sim N(0,1)\\) and \\(y=g(x)=3x\\). Compute \\(\\log p_Y(3)\\) directly from \\(Y\\sim N(0,9)\\), then again as \\(\\log p_X(g^{-1}(y))-\\log|\\det J_g|\\). Use the agreement to explain the sign and placement of the log-determinant term.",
  "plain": "Directly, \\(\\log p_Y(3)=-\\tfrac12\\log(2\\pi\\cdot9)-\\tfrac{9}{18}=-0.9189-1.0986-0.5=-2.5176\\). Via change of variables, \\(g^{-1}(3)=1\\) and \\(|\\det J_g|=3\\), so \\(\\log\\varphi(1)-\\log3=-1.4189-1.0986=-2.5176\\). The two agree. The sign is negative because the forward map stretches each small interval by the factor 3. The same mass is spread over three times the length, so the density divides by \\(|\\det J_g|\\) and the log density subtracts \\(\\log|\\det J_g|\\). The term is evaluated at the base point \\(x=g^{-1}(y)\\), where the stretching happens; written with the inverse map, it becomes \\(+\\log|\\det J_{g^{-1}}(y)|\\).",
  "solution": "<p>Directly, \\(\\log p_Y(3)=-\\tfrac12\\log(2\\pi\\cdot9)-\\tfrac{9}{18}=-0.9189-1.0986-0.5=-2.5176\\).</p><p>Via change of variables, \\(g^{-1}(3)=1\\) and \\(|\\det J_g|=3\\), so \\(\\log\\varphi(1)-\\log3=-1.4189-1.0986=-2.5176\\). The two agree.</p><p>The sign is negative because the forward map stretches each small interval by the factor 3. The same mass is spread over three times the length, so the density divides by \\(|\\det J_g|\\) and the log density subtracts \\(\\log|\\det J_g|\\). The term is evaluated at the base point \\(x=g^{-1}(y)\\), where the stretching happens; written with the inverse map, it becomes \\(+\\log|\\det J_{g^{-1}}(y)|\\).</p>"
},
A11: {
  "statement": "**A11 · Stretch · paper — Cumulative problem 11.** Derive the density of the product \\(Z=XY\\) for independent uniform \\((0,1)\\) variables. Choose and justify either a CDF, conditioning, or multivariate-transformation route.",
  "plain": "For \\(0<z<1\\), conditioning on \\(X=x\\) gives \\(P(XY\\le z)=\\int_0^z1\\,dx+\\int_z^1(z/x)\\,dx=z-z\\log z\\). Differentiating yields \\(f_Z(z)=-\\log z\\).",
  "solution": "<p>For \\(0&lt;z&lt;1\\), conditioning on \\(X=x\\) gives \\(P(XY\\le z)=\\int_0^z1\\,dx+\\int_z^1(z/x)\\,dx=z-z\\log z\\). Differentiating yields \\(f_Z(z)=-\\log z\\).</p>"
},
A12: {
  "statement": "**A12 · Stretch · paper — Cumulative problem 12.** A learned transformation is locally linear with Jacobian \\(A=\\begin{bmatrix}1&1\\\\1&1+\\varepsilon\\end{bmatrix}\\), \\(\\varepsilon=10^{-6}\\): invertible in theory, with one singular value near zero. (a) Compute \\(\\det A\\), both singular values, and the condition number. (b) With NumPy seed 0, draw 1000 points \\(x\\sim N(0,I_2)\\), form \\(y=Ax\\), recover \\(\\hat x\\) with `np.linalg.solve` in float64 and in float32, and report the maximum round-trip error \\(\\max|\\hat x-x|\\) for each. (c) Compare \\(\\log|\\det A|\\) from `slogdet` in both precisions with the exact \\(\\log\\varepsilon\\). State which of these checks you would run on a real flow.",
  "plain": "(a) \\(\\det A=(1+\\varepsilon)-1=\\varepsilon=10^{-6}\\). The singular values are about \\(2.0000005\\) and \\(5.0\\times10^{-7}\\), and the condition number is about \\(4.0\\times10^6\\). (b) With seed 0 the float64 round-trip error is about \\(4\\times10^{-10}\\) (roughly the condition number times \\(10^{-16}\\)). In float32 it is about \\(0.27\\). Float32 stores \\(1+10^{-6}\\) as \\(1.00000095\\), so the tiny direction is resolved only to a few percent, and the condition number amplifies the rounding error in \\(y\\) to order \\(4\\times10^6\\times6\\times10^{-8}\\approx0.2\\). (c) The exact value is \\(\\log\\varepsilon=-13.8155\\). Float64 slogdet gives \\(-13.81551\\). Float32 gives \\(-13.8629=\\log(9.54\\times10^{-7})\\), an error of about \\(0.047\\) nats per point that feeds straight into the log-likelihood. For a real flow: monitor the minimum singular value or condition number of each layer Jacobian, measure round-trip error on training, held-out and adversarial inputs in the working precision, compare the analytic log-determinant with a float64 or autodiff-Jacobian reference, and check mass conservation by comparing the frequencies of transformed samples in fixed regions with the probabilities the model predicts.",
  "solution": "<p>(a) \\(\\det A=(1+\\varepsilon)-1=\\varepsilon=10^{-6}\\). The singular values are about \\(2.0000005\\) and \\(5.0\\times10^{-7}\\), and the condition number is about \\(4.0\\times10^6\\).</p><p>(b) With seed 0 the float64 round-trip error is about \\(4\\times10^{-10}\\) (roughly the condition number times \\(10^{-16}\\)). In float32 it is about \\(0.27\\). Float32 stores \\(1+10^{-6}\\) as \\(1.00000095\\), so the tiny direction is resolved only to a few percent, and the condition number amplifies the rounding error in \\(y\\) to order \\(4\\times10^6\\times6\\times10^{-8}\\approx0.2\\).</p><p>(c) The exact value is \\(\\log\\varepsilon=-13.8155\\). Float64 <code>slogdet</code> gives \\(-13.81551\\). Float32 gives \\(-13.8629=\\log(9.54\\times10^{-7})\\), an error of about \\(0.047\\) nats per point that feeds straight into the log-likelihood.</p><p>For a real flow: monitor the minimum singular value or condition number of each layer Jacobian, measure round-trip error on training, held-out and adversarial inputs in the working precision, compare the analytic log-determinant with a float64 or autodiff-Jacobian reference, and check mass conservation by comparing the frequencies of transformed samples in fixed regions with the probabilities the model predicts.</p>"
},
K1: {
  "statement": "**K1 · Foundation · gate — Concept.** Why is an absolute Jacobian determinant needed?",
  "plain": "It converts local volume without assigning negative probability to orientation reversal. The inverse map derivative appears in a transformed density.",
  "solution": "<p>It converts local volume without assigning negative probability to orientation reversal. The inverse map derivative appears in a transformed density.</p>"
},
K2: {
  "statement": "**K2 · Core · gate — Derivation.** Derive the density of Y=aX+b for nonzero a.",
  "plain": "Use x=(y−b)/a and |dx/dy|=1/|a| to obtain fY(y)=fX((y−b)/a)/|a| on the transformed support.",
  "solution": "<p>Use x=(y−b)/a and |dx/dy|=1/|a| to obtain fY(y)=fX((y−b)/a)/|a| on the transformed support.</p>"
},
K3: {
  "statement": "**K3 · Core · gate — Calculation.** For X uniform on [0,1], find the density height of Y=−4X+2 on its support.",
  "plain": "The support is [−2,2] with length four, so the density is 0.25.",
  "solution": "<p>The support is [−2,2] with length four, so the density is 0.25.</p>",
  "fields": [
    {
      "id": "value",
      "label": "Requested numerical value",
      "type": "num",
      "ans": 0.25
    }
  ],
  "hints": {
    "value": "Write the defining formula first, substitute the given numbers, and check the units and support."
  }
},
K4: {
  "statement": "**K4 · Core · gate — Implementation audit.** Reproduce two settings of the ps-transform experiment independently, including its failure preset. State a numerical invariant or analytic oracle and explain what the plot does not establish.",
  "plain": "Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.",
  "solution": "<p>Use the defining equations in this lesson rather than copying plotted values. Record both control settings and independently computed outputs; verify normalization, support or the relevant moment/identity. The failure case must expose the assumption or boundary described in the readout. A deterministic toy calculation does not establish validity for dependent real data.</p>"
},
K5: {
  "statement": "**K5 · Stretch · gate — Claim audit.** Can the invertible transformation formula be applied directly to Y=X² on the whole real line?",
  "plain": "No. Sum the contributions of both inverse branches, each with its own absolute derivative; account for support and the singular point separately.",
  "solution": "<p>No. Sum the contributions of both inverse branches, each with its own absolute derivative; account for support and the singular point separately.</p>"
},
K6: {
  "statement": "**K6 · Stretch · gate — RE/RS transfer.** Specify checks for a normalizing-flow log-density implementation.",
  "plain": "Test an affine map against its analytic density and log absolute determinant; verify the inverse, support, shape conventions and normalization on a tractable low-dimensional case.",
  "solution": "<p>Test an affine map against its analytic density and log absolute determinant; verify the inverse, support, shape conventions and normalization on a tractable low-dimensional case.</p>"
}
});
