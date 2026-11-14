"""Reference implementations for Deep learning core, Part I · What networks represent and how they learn (NN01–NN02).

Attempt labs/deep_learning_core/exercises.py before reading.
"""
import itertools
import math


def _finite_real_vector(values, name="vector"):
    """Validate a nonempty list/tuple of finite reals (no bools); return a float list."""
    if not isinstance(values, (list, tuple)) or not values:
        raise ValueError(name + " must be a nonempty list or tuple")
    out = []
    for value in values:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(name + " entries must be real numbers")
        value = float(value)
        if not math.isfinite(value):
            raise ValueError(name + " entries must be finite")
        out.append(value)
    return out


def threshold_gate(weights, bias, inputs):
    """Fire (1) when fsum(w*x) + bias >= 0."""
    w = _finite_real_vector(weights, "weights")
    x = _finite_real_vector(inputs, "inputs")
    if len(w) != len(x):
        raise ValueError("weights and inputs must have the same length")
    if isinstance(bias, bool) or not isinstance(bias, (int, float)) or not math.isfinite(bias):
        raise ValueError("bias must be a finite real number")
    terms = [wi * xi for wi, xi in zip(w, x)] + [float(bias)]
    if not all(math.isfinite(t) for t in terms):
        raise ValueError("a weighted input overflowed")
    z = math.fsum(terms)
    if not math.isfinite(z):
        raise ValueError("the weighted sum overflowed")
    return 1 if z >= 0 else 0


def compose_halfspaces(halfspaces, k, point):
    """Count firing half-space units and vote: fire when at least k fire."""
    if not isinstance(halfspaces, (list, tuple)) or not halfspaces:
        raise ValueError("halfspaces must be a nonempty list")
    if isinstance(k, bool) or not isinstance(k, int) or not 0 <= k <= len(halfspaces):
        raise ValueError("k must be an int between 0 and the number of units")
    x = _finite_real_vector(point, "point")
    count = 0
    for unit in halfspaces:
        if not isinstance(unit, (list, tuple)) or len(unit) != 2:
            raise ValueError("each unit is a (weights, bias) pair")
        weights, bias = unit
        w = _finite_real_vector(weights, "weights")
        if len(w) != len(x):
            raise ValueError("unit weights must match the point's dimension")
        if isinstance(bias, bool) or not isinstance(bias, (int, float)) or not math.isfinite(bias):
            raise ValueError("bias must be a finite real number")
        terms = [wi * xi for wi, xi in zip(w, x)] + [float(bias)]
        z = math.fsum(terms)
        if not all(math.isfinite(t) for t in terms) or not math.isfinite(z):
            raise ValueError("a unit's weighted sum overflowed")
        count += 1 if z >= 0 else 0
    return count, 1 if count >= k else 0


def hebbian_update(samples, w0, eta, rule):
    """One sequential pass of Hebb or Oja updates, rejecting divergence."""
    if rule not in ("hebb", "oja"):
        raise ValueError('rule must be "hebb" or "oja"')
    if isinstance(eta, bool) or not isinstance(eta, (int, float)) or not math.isfinite(eta) or eta <= 0:
        raise ValueError("eta must be a finite positive real")
    w = _finite_real_vector(w0, "w0")
    if not isinstance(samples, (list, tuple)) or not samples:
        raise ValueError("samples must be a nonempty list")
    data = [_finite_real_vector(x, "sample") for x in samples]
    if any(len(x) != len(w) for x in data):
        raise ValueError("every sample must match the weight dimension")
    for x in data:
        terms = [wi * xi for wi, xi in zip(w, x)]
        try:
            y = math.fsum(terms)
        except OverflowError:
            raise ValueError("the weights diverged") from None
        if not math.isfinite(y):
            raise ValueError("the weights diverged")
        if rule == "hebb":
            w = [wi + eta * y * xi for wi, xi in zip(w, x)]
        else:
            w = [wi + eta * y * (xi - y * wi) for wi, xi in zip(w, x)]
        if not all(math.isfinite(wi) for wi in w):
            raise ValueError("the weights diverged")
    return w


def _binary_list(values, name="values"):
    """Validate a nonempty list/tuple of ints 0 or 1 (no bools); return a list."""
    if not isinstance(values, (list, tuple)) or not values:
        raise ValueError(name + " must be a nonempty list or tuple")
    for value in values:
        if isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1):
            raise ValueError(name + " entries must be the ints 0 or 1")
    return list(values)


def perceptron_train(samples, labels, eta, max_epochs):
    """Sequential perceptron error correction from zero weights."""
    if not isinstance(samples, (list, tuple)) or not samples:
        raise ValueError("samples must be a nonempty list")
    data = [_finite_real_vector(x, "sample") for x in samples]
    if any(len(x) != len(data[0]) for x in data):
        raise ValueError("samples must share one dimension")
    targets = _binary_list(labels, "labels")
    if len(targets) != len(data):
        raise ValueError("one label per sample")
    if isinstance(eta, bool) or not isinstance(eta, (int, float)) or not math.isfinite(eta) or eta <= 0:
        raise ValueError("eta must be a finite positive real")
    if isinstance(max_epochs, bool) or not isinstance(max_epochs, int) or max_epochs < 1:
        raise ValueError("max_epochs must be an int >= 1")
    w, b = [0.0] * len(data[0]), 0.0
    for epoch in range(1, max_epochs + 1):
        mistakes = 0
        for x, d in zip(data, targets):
            z = math.fsum([wi * xi for wi, xi in zip(w, x)] + [b])
            err = d - (1 if z >= 0 else 0)
            if err:
                mistakes += 1
                w = [wi + eta * err * xi for wi, xi in zip(w, x)]
                b += eta * err
        if not all(math.isfinite(v) for v in w + [b]):
            raise ValueError("the weights overflowed")
        if mistakes == 0:
            return w, b, epoch, True
    return w, b, max_epochs, False


def dnf_network(truth):
    """One AND unit per true row of the table, then an OR."""
    table = _binary_list(truth, "truth")
    n = len(table).bit_length() - 1
    if len(table) < 2 or len(table) != 1 << n:
        raise ValueError("the table length must be a power of two, at least 2")
    hidden = []
    for index, value in enumerate(table):
        if value:
            bits = [(index >> (n - 1 - j)) & 1 for j in range(n)]
            hidden.append(([1 if bit else -1 for bit in bits], -sum(bits)))
    output = ([1] * len(hidden), -1)
    return hidden, output


def staircase_weights(heights, edges):
    """Coefficients h_k - h_{k-1} on each shared edge."""
    h = _finite_real_vector(heights, "heights")
    t = _finite_real_vector(edges, "edges")
    if len(t) != len(h) + 1:
        raise ValueError("need one more edge than heights")
    if any(b <= a for a, b in zip(t, t[1:])):
        raise ValueError("edges must be strictly increasing")
    padded = [0.0] + h + [0.0]
    units = [(padded[k + 1] - padded[k], t[k]) for k in range(len(t))]
    if not all(math.isfinite(c) for c, _ in units):
        raise ValueError("a coefficient overflowed")
    return units


def heat_cold_sensations(heat, cold):
    """McCulloch and Pitts's heat/cold illusion, one step of delay per unit."""
    h, c = _binary_list(heat, "heat"), _binary_list(cold, "cold")
    if len(h) != len(c):
        raise ValueError("heat and cold must have the same length")
    at = lambda seq, t: seq[t] if t >= 0 else 0
    a = [at(c, t - 1) for t in range(len(c))]
    b = [1 if at(a, t - 1) and not at(c, t - 1) else 0 for t in range(len(c))]
    felt_heat = [1 if at(h, t - 1) or at(b, t - 1) else 0 for t in range(len(c))]
    felt_cold = [1 if at(a, t - 1) and at(c, t - 1) else 0 for t in range(len(c))]
    return felt_heat, felt_cold


def _truth_table(truth):
    """Validate a Boolean truth table in binary order; return (table, n)."""
    table = _binary_list(truth, "truth")
    n = len(table).bit_length() - 1
    if len(table) < 2 or len(table) != 1 << n:
        raise ValueError("the table length must be a power of two, at least 2")
    return table, n


def prime_implicants(truth):
    """All prime implicants, found by testing every 0/1/- pattern."""
    table, n = _truth_table(truth)

    def rows(pattern):
        out = []
        for index in range(1 << n):
            bits = [(index >> (n - 1 - j)) & 1 for j in range(n)]
            if all(c == "-" or int(c) == b for c, b in zip(pattern, bits)):
                out.append(index)
        return out

    implicants = set()
    for chars in itertools.product("01-", repeat=n):
        pattern = "".join(chars)
        if all(table[i] for i in rows(pattern)):
            implicants.add(pattern)
    primes = [p for p in implicants
              if all(p[:j] + "-" + p[j + 1:] not in implicants for j in range(n) if p[j] != "-")]
    return sorted(primes)


def _xor_block(units, a, b, n):
    """Append OR, NAND and AND units for a XOR b; return the output node."""
    base = n + len(units)
    units.append(([a, b], [1, 1], -1))
    units.append(([a, b], [-1, -1], 1))
    units.append(([base, base + 1], [1, 1], -2))
    return base + 2


def parity_network(n, construction):
    """n-bit parity by DNF, counting units, or a pairing tree of XOR blocks."""
    if isinstance(n, bool) or not isinstance(n, int) or not 2 <= n <= 16:
        raise ValueError("n must be an int between 2 and 16")
    if construction not in ("dnf", "count", "tree", "layered-tree"):
        raise ValueError('construction must be "dnf", "count", "tree" or "layered-tree"')
    units = []
    if construction == "dnf":
        for index in range(1 << n):
            bits = [(index >> (n - 1 - j)) & 1 for j in range(n)]
            if sum(bits) % 2:
                units.append((list(range(n)), [1 if b else -1 for b in bits], -sum(bits)))
        units.append((list(range(n, n + len(units))), [1] * len(units), -1))
        return units
    if construction == "count":
        for k in range(1, n + 1):
            units.append((list(range(n)), [1] * n, -k))
        units.append((list(range(n, 2 * n)), [(-1) ** (k + 1) for k in range(1, n + 1)], -1))
        return units
    values = list(range(n))
    while len(values) > 1:
        nxt = []
        for i in range(0, len(values) - 1, 2):
            nxt.append(_xor_block(units, values[i], values[i + 1], n))
        if len(values) % 2:
            carried = values[-1]
            if construction == "layered-tree":
                for _ in range(2):
                    units.append(([carried], [1], -0.5))
                    carried = n + len(units) - 1
            nxt.append(carried)
        values = nxt
    return units


def network_stats(units, n):
    """Units, nonzero connections, biases, parameters, depth, layering, dense count."""
    if isinstance(n, bool) or not isinstance(n, int) or n < 1:
        raise ValueError("n must be an int >= 1")
    if not isinstance(units, (list, tuple)) or not units:
        raise ValueError("units must be a nonempty list")
    depth = [0] * n
    connections, layered = 0, True
    for j, unit in enumerate(units):
        if not isinstance(unit, (list, tuple)) or len(unit) != 3:
            raise ValueError("each unit is a (sources, weights, bias) triple")
        sources, weights, bias = unit
        if not isinstance(sources, (list, tuple)) or not isinstance(weights, (list, tuple)) or len(sources) != len(weights):
            raise ValueError("sources and weights must be sequences of equal length")
        for s in sources:
            if isinstance(s, bool) or not isinstance(s, int) or not 0 <= s < n + j:
                raise ValueError("a unit may read only inputs and earlier units")
        if weights:
            _finite_real_vector(list(weights), "weights")
        if isinstance(bias, bool) or not isinstance(bias, (int, float)) or not math.isfinite(bias):
            raise ValueError("bias must be a finite real number")
        live = [s for s, w in zip(sources, weights) if w != 0]
        connections += len(live)
        d = 1 + max((depth[s] for s in live), default=0)
        if any(depth[s] != d - 1 for s in live):
            layered = False
        depth.append(d)
    unit_depths = depth[n:]
    dense = None
    if layered:
        widths = [n] + [unit_depths.count(d) for d in range(1, max(unit_depths) + 1)]
        if all(widths):
            dense = sum(widths[i - 1] * widths[i] + widths[i] for i in range(1, len(widths)))
        else:
            layered = False
    return {"units": len(units), "connections": connections, "biases": len(units),
            "parameters": connections + len(units), "depth": depth[-1],
            "layered": layered, "dense": dense}


def polygon_indicator(vertices):
    """Edge units on the closed inner side of each CCW edge, then an AND."""
    if not isinstance(vertices, (list, tuple)) or len(vertices) < 3:
        raise ValueError("need at least three vertices")
    pts = []
    for v in vertices:
        if not isinstance(v, (list, tuple)) or len(v) != 2:
            raise ValueError("each vertex is an (x, y) pair")
        pts.append(_finite_real_vector(list(v), "vertex"))
    m = len(pts)
    turning = 0.0
    for i in range(m):
        a, b, c = pts[i], pts[(i + 1) % m], pts[(i + 2) % m]
        u, v = (b[0] - a[0], b[1] - a[1]), (c[0] - b[0], c[1] - b[1])
        cross = u[0] * v[1] - u[1] * v[0]
        if (u[0] == 0 and u[1] == 0) or cross <= 0:
            raise ValueError("vertices must be distinct, counter-clockwise and strictly convex")
        turning += math.atan2(cross, u[0] * v[0] + u[1] * v[1])
    if abs(turning - 2 * math.pi) > 1e-9:
        raise ValueError("the polygon must wind once counter-clockwise")
    hidden = []
    for i in range(m):
        (ax, ay), (bx, by) = pts[i], pts[(i + 1) % m]
        hidden.append(([-(by - ay), bx - ax], (by - ay) * ax - (bx - ax) * ay))
    return hidden, ([1] * m, -m)


def irreducible_error(codes, labels, weights):
    """Majority label per code; the minority weight is unavoidable."""
    if not isinstance(codes, (list, tuple)) or not codes:
        raise ValueError("codes must be a nonempty list")
    targets = _binary_list(labels, "labels")
    area = _finite_real_vector(weights, "weights")
    if len(targets) != len(codes) or len(area) != len(codes):
        raise ValueError("codes, labels and weights must have the same length")
    if any(w <= 0 for w in area):
        raise ValueError("weights must be positive")
    keys = [tuple(_binary_list(c, "code")) for c in codes]
    if len({len(k) for k in keys}) != 1:
        raise ValueError("all codes must have the same length")
    mass = {}
    for key, y, w in zip(keys, targets, area):
        mass.setdefault(key, [[], []])[y].append(w)
    labelling, floor = {}, []
    for key, (zeros, ones) in mass.items():
        w0, w1 = math.fsum(zeros), math.fsum(ones)
        labelling[key] = 1 if w1 >= w0 else 0
        floor.append(w0 if labelling[key] else w1)
    return math.fsum(floor), labelling


def relu_interpolant(knots, values):
    """c0 plus slope changes at each knot, as ReLU(t - knot) terms."""
    t = _finite_real_vector(knots, "knots")
    v = _finite_real_vector(values, "values")
    if len(t) < 2 or len(t) != len(v):
        raise ValueError("need at least two knots, one value per knot")
    if any(b <= a for a, b in zip(t, t[1:])):
        raise ValueError("knots must be strictly increasing")
    slopes = [(v[i + 1] - v[i]) / (t[i + 1] - t[i]) for i in range(len(t) - 1)]
    coefs = [slopes[0]] + [slopes[i] - slopes[i - 1] for i in range(1, len(slopes))]
    if not all(math.isfinite(c) for c in coefs):
        raise ValueError("a slope overflowed")
    return v[0], [(c, t[i]) for i, c in enumerate(coefs) if c != 0]
