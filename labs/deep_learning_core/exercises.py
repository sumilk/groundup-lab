"""Starters for Deep learning core, Part I · What networks represent and how they learn (NN01–NN02).

Fill these functions from the lessons; run one with python -m labs.checks <task>.
"""


def threshold_gate(weights, bias, inputs):
    """Return 1 if fsum(w_i * x_i) + bias >= 0, else 0; preserve inputs.

    weights and inputs are nonempty lists or tuples of the same length holding
    finite reals (bools rejected); bias is a finite real. Supplied
    _finite_real_vector validates one sequence. Use math.fsum so cancelling
    large terms cannot flip the decision; a non-finite sum raises ValueError.
    The boundary z = 0 fires.
    """
    raise NotImplementedError("Weigh the evidence, then compare with the threshold")


def compose_halfspaces(halfspaces, k, point):
    """Return (count, fires): how many half-space units fire, and count >= k.

    halfspaces is a nonempty list of (weights, bias) pairs, each a threshold
    unit over the point. k is an int (not bool) with 0 <= k <= len(halfspaces):
    k = len(halfspaces) is AND, k = 1 is OR, and intermediate k is a vote.
    Validate with the supplied _finite_real_vector and preserve inputs; invalid
    data or a non-finite unit sum raise ValueError.
    """
    raise NotImplementedError("Count the fences the point is inside, then vote")


def hebbian_update(samples, w0, eta, rule):
    """Run one pass of Hebb ("hebb") or Oja ("oja") updates; return new weights.

    For each sample x in order: y = fsum(w_i x_i); Hebb sets w <- w + eta*y*x,
    Oja sets w <- w + eta*y*(x - y*w). samples is a nonempty list of vectors of
    len(w0); eta is a finite real > 0. Validate with the supplied
    _finite_real_vector, never mutate w0 or the samples, and raise ValueError
    as soon as y or a weight becomes non-finite (the rule diverged); math.fsum
    raises OverflowError on overflow, which must also become ValueError.
    """
    raise NotImplementedError("Strengthen what fires together, then add forgetting")


def perceptron_train(samples, labels, eta, max_epochs):
    """Train a perceptron with the sequential error-correction rule.

    Start from zero weights and bias. Visit samples in order; y = 1 when
    fsum(w*x) + b >= 0. On a mistake, w <- w + eta*(d - y)*x, b <- b + eta*(d - y).
    Stop after an epoch with no mistakes or after max_epochs epochs. Return
    (weights, bias, epochs_run, converged). samples: nonempty list of equal-length
    finite real vectors (validate with supplied _finite_real_vector); labels: ints
    0 or 1 (bools rejected), one per sample; eta finite > 0; max_epochs int >= 1.
    Never mutate the inputs; invalid data raise ValueError.
    """
    raise NotImplementedError("Correct the unit only when it is wrong")


def dnf_network(truth):
    """Build a one-hidden-layer threshold network from a truth table.

    truth lists f(x) for all 2**n inputs in binary order: index i encodes the
    input bits with the first input as the most significant bit. Entries are
    ints 0 or 1 (bools rejected) and the length is a power of two, at least 2.
    Return (hidden, output). hidden has one (weights, bias) unit per input
    pattern p with f(p) = 1, firing exactly on p: weight +1 where p has a 1,
    -1 where it has a 0, and bias = -(number of ones in p). output is
    (weights, bias) for an OR over the hidden units; with no hidden units it is
    ([], -1), which never fires. Invalid tables raise ValueError.
    """
    raise NotImplementedError("One AND unit per true row, then an OR")


def staircase_weights(heights, edges):
    """Rewrite K pulses as K+1 shared-edge threshold units.

    Pulse k has height heights[k] on [edges[k], edges[k+1]). Return the list of
    (coefficient, threshold) pairs, one per edge, so that
    sum(c * step(x - T)) equals the sum of pulses for every x, where
    step(z) = 1 for z >= 0. Coefficients are h_k - h_{k-1} with h_0 = h_{K+1} = 0.
    heights: nonempty list of finite reals; edges: finite reals, strictly
    increasing, with len(heights) + 1 entries. Invalid data raise ValueError.
    """
    raise NotImplementedError("Telescope neighbouring pulses into shared edges")


def heat_cold_sensations(heat, cold):
    """Simulate the McCulloch-Pitts heat/cold net; return (felt_heat, felt_cold).

    heat and cold are equal-length nonempty lists of ints 0 or 1 (bools rejected)
    giving the receptor at t = 0, 1, .... Values before t = 0 count as 0. Return
    two lists of the same length with
    H(t) = h(t-1) or (c(t-3) and not c(t-2)),  C(t) = c(t-2) and c(t-1).
    Build it from the units: a(t) = c(t-1); b(t) = a(t-1) and not c(t-1);
    H(t) = h(t-1) or b(t-1); C(t) = a(t-1) and c(t-1). Invalid data raise ValueError.
    """
    raise NotImplementedError("Delay, veto, then OR and AND")


def prime_implicants(truth):
    """Return the sorted prime implicants of a truth table as '0'/'1'/'-' strings.

    truth lists f(x) for all 2**n inputs in binary order: index i encodes the
    input bits with the first input as the most significant bit. Entries are
    ints 0 or 1 (bools rejected) and the length is a power of two, at least 2.
    A pattern fixes the inputs marked 0 or 1 and leaves '-' free. It is an
    implicant when f is 1 on every row it matches, and prime when freeing any
    fixed position matches a row where f is 0. Return [] for the zero function
    and ['-' * n] for the constant 1. Invalid tables raise ValueError.
    """
    raise NotImplementedError("Test every pattern, keep implicants, then keep the prime ones")


def parity_network(n, construction):
    """Build an n-bit parity network of threshold units; return its unit list.

    n is an int (not bool) with 2 <= n <= 16. construction is "dnf", "count",
    "tree" or "layered-tree". Nodes 0..n-1 are the inputs and node n+j is unit
    j. Each unit is (sources, weights, bias): it fires (1) when
    fsum(w * node) + bias >= 0, reading only earlier nodes. The last unit is
    the output. "dnf": one AND unit per odd row (weights +1/-1, bias minus the
    number of ones), then an OR. "count": units theta(sum(x) - k), k = 1..n,
    then an output with weights (-1)**(k+1) and bias -1. "tree": pair values
    in order, XOR each pair with OR (bias -1), NAND (bias 1) and AND
    (bias -2) units, carry an odd last value to the next round, and repeat.
    "layered-tree": the same, but each carried value passes through two copy
    units theta(v - 0.5) per round it waits. Invalid arguments raise ValueError.
    """
    raise NotImplementedError("Memorize, count, or run a knockout tournament")


def network_stats(units, n):
    """Measure a feedforward threshold network given as a parity_network unit list.

    Return a dict with keys "units", "connections" (nonzero weights),
    "biases" (one per unit), "parameters" (connections + biases), "depth"
    (the last unit's depth: inputs have depth 0, a unit has 1 + the largest
    depth among sources with nonzero weight), "layered" (True when every
    nonzero-weight arrow joins depth d-1 to depth d) and "dense" (for a
    layered network, sum over layers of width_prev * width + width, with
    width_0 = n; otherwise None). n is an int >= 1. Every unit must be a
    (sources, weights, bias) triple of equal-length sequences reading only
    earlier nodes, with finite real weights and bias. Do not mutate the input.
    Invalid data raise ValueError.
    """
    raise NotImplementedError("Count arrows, biases and the longest path separately")


def polygon_indicator(vertices):
    """Build an edge-AND network for a convex polygon; return (hidden, output).

    vertices is a list of at least three (x, y) pairs of finite reals in
    counter-clockwise order describing a strictly convex polygon (no repeated
    or collinear vertices). hidden has one (weights, bias) unit per side
    v_i -> v_(i+1), firing on the closed inner (left) side; output is
    (weights, bias) for an AND of the hidden units. Clockwise, non-convex or
    malformed input raises ValueError. Do not mutate the input.
    """
    raise NotImplementedError("One fence per side, then AND")


def irreducible_error(codes, labels, weights):
    """Return (floor, labelling): the best any later layers can do after a cut.

    codes[i] is sample i's code at the cut, a list or tuple of ints 0/1;
    labels[i] is its target, an int 0 or 1; weights[i] is a finite positive
    real area weight. All three have the same nonzero length and all codes the
    same length. floor is the smallest total weight of misclassified samples
    over every labelling of codes, computed with math.fsum; labelling maps each
    code tuple to its majority label, with ties labelled 1. Invalid data raise
    ValueError; inputs are not mutated.
    """
    raise NotImplementedError("Label each code by its majority")


def relu_interpolant(knots, values):
    """Represent the piecewise-linear interpolant with ReLU units.

    knots are strictly increasing finite reals (at least two), values finite
    reals of the same length. Return (c0, units), units a list of
    (coefficient, knot) pairs, so that c0 + sum(c * max(0, t - knot)) equals
    values[i] at knots[i] and is linear between neighbouring knots on
    [knots[0], knots[-1]]. Use slope differences; omit units whose coefficient
    is exactly zero, so K knots give at most K-1 units. Invalid data raise
    ValueError.
    """
    raise NotImplementedError("Start with the first slope, then add each change of slope")
