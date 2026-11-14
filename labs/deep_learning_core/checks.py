"""Behavioral checks for Deep learning core, Part I · What networks represent and how they learn (NN01–NN02).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import itertools
import math
import random

from labs.check_helpers import close, _projection_rejects


def threshold_gate(m):
    gates = {"AND": ([1, 1], -2), "OR": ([1, 1], -1), "NAND": ([-1, -1], 1.5)}
    truth = {"AND": [0, 0, 0, 1], "OR": [0, 1, 1, 1], "NAND": [1, 1, 1, 0]}
    for name, (w, b) in gates.items():
        got = [m.threshold_gate(w, b, [a, c]) for a in (0, 1) for c in (0, 1)]
        assert got == truth[name], (name, got)
    assert m.threshold_gate([-1], 0, [0]) == 1 and m.threshold_gate([-1], 0, [1]) == 0, "NOT X"
    assert m.threshold_gate([2.0, -1.0], -1.0, [1.0, 1.0]) == 1, "the boundary z = 0 fires"
    w, x = [1e16, 1.0, -1e16], (1, 1, 1)
    assert m.threshold_gate(w, -0.5, x) == 1, "use math.fsum: the exact sum is +0.5"
    assert w == [1e16, 1.0, -1e16], "do not mutate the weights"
    for args in (([1, True], 0, [1, 1]), ([1], 0, [1, 1]), ([], 0, []), ([1], float("nan"), [1]),
                 ([float("inf")], 0, [1]), ("ab", 0, "ab"), ([1e308, 1e308], 0, [10, 10]), ([1], None, [1])):
        _projection_rejects(m.threshold_gate, *args)


def compose_halfspaces(m):
    square = [([1, 0], 1), ([-1, 0], 1), ([0, 1], 1), ([0, -1], 1)]   # |x1| <= 1 and |x2| <= 1
    assert m.compose_halfspaces(square, 4, [0.5, -0.25]) == (4, 1)
    assert m.compose_halfspaces(square, 4, [2, 0]) == (3, 0)
    assert m.compose_halfspaces(square, 3, [2, 0]) == (3, 1), "a vote, not only an AND"
    assert m.compose_halfspaces(square, 1, [5, 5]) == (2, 1), "k = 1 is OR"
    assert m.compose_halfspaces(square, 0, [9, 9])[1] == 1, "k = 0 always fires"
    n = 64
    poly = [([math.cos(2 * math.pi * i / n), math.sin(2 * math.pi * i / n)], -math.cos(math.pi / n)) for i in range(n)]
    poly = [([-a, -b], -c) for (a, b), c in poly]                     # fires when a.x <= cos(pi/n)
    far, _ = m.compose_halfspaces(poly, n, [1000.0, 0.0])
    assert abs(far / n - 0.5) < 0.05, "far from a cylinder about half the units fire"
    assert m.compose_halfspaces(poly, n, [0.0, 0.0]) == (n, 1)
    units = [([1, 0], 1)]
    m.compose_halfspaces(units, 1, [0, 0])
    assert units == [([1, 0], 1)], "do not mutate the units"
    for args in ((square, 5, [0, 0]), (square, True, [0, 0]), (square, -1, [0, 0]), ([], 0, [0, 0]),
                 (square, 2, [0, 0, 0]), ([([1, 0], float("nan"))], 1, [0, 0]), (square, 2, [float("inf"), 0])):
        _projection_rejects(m.compose_halfspaces, *args)


def hebbian_update(m):
    close(m.hebbian_update([[1, 1]], [1, 0], 0.1, "oja")[1], 0.1)
    close(m.hebbian_update([[1, 1]], [1, 0], 0.1, "hebb")[1], 0.1)
    rng = random.Random(7)
    data = []
    for _ in range(3000):
        z1, z2 = rng.gauss(0, 1), rng.gauss(0, 1)
        data.append([1.7320508 * z1, 0.8660254 * z1 + 0.5 * z2])      # covariance [[3, 1.5], [1.5, 1]]
    w0 = [0.3, 0.1]
    oja = m.hebbian_update(data, w0, 0.005, "oja")
    assert w0 == [0.3, 0.1], "do not mutate w0"
    norm = math.hypot(*oja)
    assert abs(norm - 1) < 0.08, ("Oja's rule should settle near unit length", norm)
    lam = (4 + math.sqrt(10)) / 2                                       # top eigenvalue of the covariance
    top = [1.5, lam - 3]
    cos = abs(oja[0] * top[0] + oja[1] * top[1]) / (norm * math.hypot(*top))
    assert cos > 0.99, ("Oja's rule should align with the top eigenvector", cos)
    hebb = m.hebbian_update(data[:200], w0, 0.005, "hebb")
    assert math.hypot(*hebb) > 10, "plain Hebb grows without bound"
    _projection_rejects(m.hebbian_update, data, w0, 0.5, "hebb")       # overflows: must be reported
    for args in ((data, w0, 0, "oja"), (data, w0, True, "oja"), (data, w0, 0.1, "sanger"), ([], w0, 0.1, "oja"),
                 ([[1, 2, 3]], w0, 0.1, "oja"), ([[1, float("nan")]], w0, 0.1, "oja")):
        _projection_rejects(m.hebbian_update, *args)


def _fires(units, x):
    return [1 if math.fsum([w * v for w, v in zip(weights, x)] + [bias]) >= 0 else 0 for weights, bias in units]


def perceptron_train(m):
    corners = [[0, 0], [0, 1], [1, 0], [1, 1]]
    w, b, epochs, ok = m.perceptron_train(corners, [0, 1, 1, 1], 1, 50)
    assert ok and epochs == 4 and w == [1, 1] and b == -1, ("the OR trace from the lesson", w, b, epochs, ok)
    for labels in ([0, 0, 0, 1], [1, 1, 1, 0], [1, 0, 0, 0]):
        w, b, _, ok = m.perceptron_train(corners, labels, 0.5, 100)
        assert ok and _fires([(w, b)], [0, 0]) is not None
        assert [_fires([(w, b)], x)[0] for x in corners] == labels, labels
    w, b, epochs, ok = m.perceptron_train(corners, [0, 1, 1, 0], 1, 37)
    assert not ok and epochs == 37, "XOR never converges; report it"
    cube = [[(i >> 2) & 1, (i >> 1) & 1, i & 1] for i in range(8)]
    major = [1 if sum(x) >= 2 else 0 for x in cube]
    w, b, _, ok = m.perceptron_train(cube, major, 1, 200)
    assert ok and [_fires([(w, b)], x)[0] for x in cube] == major
    data, lab = [[0.0, 1.0]], [1]
    m.perceptron_train(data, lab, 1, 5)
    assert data == [[0.0, 1.0]] and lab == [1], "do not mutate the inputs"
    for args in (([], [], 1, 5), (corners, [0, 1, 1], 1, 5), (corners, [0, 1, 1, 2], 1, 5), (corners, [0, 1, 1, True], 1, 5),
                 (corners, [0, 1, 1, 1], 0, 5), (corners, [0, 1, 1, 1], 1, 0), (corners, [0, 1, 1, 1], 1, 2.5),
                 ([[0, 0], [1]], [0, 1], 1, 5), ([[float("nan"), 0]], [1], 1, 5)):
        _projection_rejects(m.perceptron_train, *args)


def dnf_network(m):
    rng = random.Random(3)
    tables = [[(k >> i) & 1 for i in range(4)] for k in range(16)]
    tables += [[rng.randint(0, 1) for _ in range(16)] for _ in range(20)] + [[0] * 8, [1] * 8]
    for table in tables:
        n = len(table).bit_length() - 1
        hidden, (out_w, out_b) = m.dnf_network(table)
        assert len(hidden) == sum(table), "one hidden unit per true row"
        for index, expected in enumerate(table):
            x = [(index >> (n - 1 - j)) & 1 for j in range(n)]
            h = _fires(hidden, x)
            assert sum(h) == expected, ("each hidden unit fires on exactly its own row", table, x)
            got = 1 if math.fsum([w * v for w, v in zip(out_w, h)] + [out_b]) >= 0 else 0
            assert got == expected, (table, x)
    for bad in ([], [1], [0, 1, 1], [0, 2], [0, True], (0.0, 1.0), "01"):
        _projection_rejects(m.dnf_network, bad)


def staircase_weights(m):
    heights, edges = [0.5, -1.0, 2.0], [0.0, 1.0, 1.5, 4.0]
    units = m.staircase_weights(heights, edges)
    assert len(units) == 4
    def pulses(x):
        return math.fsum(h for h, a, b in zip(heights, edges, edges[1:]) if a <= x < b)
    for x in (-1, 0, 0.3, 1.0, 1.2, 1.5, 3.9, 4.0, 9):
        got = math.fsum(c * (1 if x - t >= 0 else 0) for c, t in units)
        close(got, pulses(x))
    for (c, t), (ec, et) in zip(units, [(0.5, 0.0), (-1.5, 1.0), (3.0, 1.5), (-2.0, 4.0)]):
        close(c, ec); close(t, et)
    h = [1.0]
    m.staircase_weights(h, [0, 1])
    assert h == [1.0], "do not mutate the heights"
    for args in (([], [0]), ([1], [0, 1, 2]), ([1, 2], [0, 2, 1]), ([1], [0, 0]), ([True], [0, 1]), ([float("inf")], [0, 1]), ([1e308, -1e308], [0, 1, 2])):
        _projection_rejects(m.staircase_weights, *args)


def heat_cold_sensations(m):
    def spec(h, c):
        g = lambda s, t: s[t] if t >= 0 else 0
        T = range(len(c))
        return ([1 if g(h, t - 1) or (g(c, t - 3) and not g(c, t - 2)) else 0 for t in T],
                [1 if g(c, t - 2) and g(c, t - 1) else 0 for t in T])
    zeros = [0] * 8
    brief = [0, 1, 0, 0, 0, 0, 0, 0]
    assert m.heat_cold_sensations(zeros, brief) == ([0, 0, 0, 0, 1, 0, 0, 0], zeros), "a brief cold touch feels hot"
    held = [0, 1, 1, 1, 0, 0, 0, 0]
    assert m.heat_cold_sensations(zeros, held) == spec(zeros, held)
    assert m.heat_cold_sensations(zeros, held)[1] == [0, 0, 0, 1, 1, 0, 0, 0], "sustained cold feels cold"
    rng = random.Random(11)
    for _ in range(200):
        h = [rng.randint(0, 1) for _ in range(10)]
        c = [rng.randint(0, 1) for _ in range(10)]
        assert m.heat_cold_sensations(h, c) == spec(h, c), (h, c)
    for args in (([], []), ([0, 1], [0]), ([0, 2], [0, 0]), ([True], [0]), ("01", "01")):
        _projection_rejects(m.heat_cold_sensations, *args)


def _rows_of(pattern):
    n = len(pattern)
    return [i for i in range(1 << n)
            if all(c == "-" or int(c) == (i >> (n - 1 - j)) & 1 for j, c in enumerate(pattern))]


def prime_implicants(m):
    worked = [1 if i in {0, 1, 2, 3, 5, 7, 8, 10, 13, 15} else 0 for i in range(16)]
    before = worked[:]
    assert m.prime_implicants(worked) == ["-0-0", "-1-1", "0--1", "00--"], "the worked example of Section 2"
    assert worked == before, "do not mutate the table"
    redundant = [1 if i in {0, 1, 5, 7, 8, 9, 13, 15} else 0 for i in range(16)]
    assert m.prime_implicants(redundant) == ["--01", "-00-", "-1-1"]
    for n in (2, 3, 4):
        parity = [bin(i).count("1") % 2 for i in range(1 << n)]
        got = m.prime_implicants(parity)
        assert len(got) == 1 << (n - 1) and all("-" not in p for p in got), "parity implicants are full rows"
    assert m.prime_implicants([0, 0, 0, 0]) == [] and m.prime_implicants([1] * 8) == ["---"]
    rng = random.Random(5)
    for _ in range(25):
        n = rng.randint(2, 5)
        table = [rng.randint(0, 1) for _ in range(1 << n)]
        got = m.prime_implicants(table)
        assert got == sorted(got), "return the patterns sorted"
        imp = {"".join(p) for p in itertools.product("01-", repeat=n) if all(table[i] for i in _rows_of("".join(p)))}
        want = sorted(p for p in imp if all(p[:j] + "-" + p[j + 1:] not in imp for j in range(n) if p[j] != "-"))
        assert got == want, table
        covered = set()
        for p in got:
            covered.update(_rows_of(p))
        assert covered == {i for i, v in enumerate(table) if v}, "prime implicants cover every true row"
    for bad in ([], [1], [0, 1, 1], [0, 2], [0, True], "0110", (0.0, 1.0)):
        _projection_rejects(m.prime_implicants, bad)


def _run_net(units, n, x):
    node = list(x)
    for sources, weights, bias in units:
        node.append(1 if math.fsum([w * node[s] for s, w in zip(sources, weights)] + [bias]) >= 0 else 0)
    return node[-1]


def parity_network(m):
    formulas = {"dnf": lambda n: (2 ** (n - 1) + 1, (n + 1) * 2 ** (n - 1)),
                "count": lambda n: (n + 1, n * n + n),
                "tree": lambda n: (3 * (n - 1), 6 * (n - 1))}
    for n in range(2, 9):
        for construction in ("dnf", "count", "tree", "layered-tree"):
            units = m.parity_network(n, construction)
            for x in itertools.product((0, 1), repeat=n):
                assert _run_net(units, n, x) == sum(x) % 2, (construction, n, x)
            if construction in formulas:
                count = len(units), sum(sum(1 for w in u[1] if w != 0) for u in units)
                assert count == formulas[construction](n), (construction, n, count)
    assert len(m.parity_network(6, "layered-tree")) == 17, "two copies for the value that waits"
    assert len(m.parity_network(5, "layered-tree")) == 16 and len(m.parity_network(10, "layered-tree")) == 31
    assert all(len(u[0]) == 2 for u in m.parity_network(7, "tree")), "XOR blocks read two nodes"
    for args in ((1, "dnf"), (17, "count"), (True, "tree"), (4.0, "dnf"), (4, "cnf"), (4, None)):
        _projection_rejects(m.parity_network, *args)


def network_stats(m):
    xor2 = [([0, 1], [1, 1], -2), ([0, 1, 2], [1, 1, -2], -1)]
    assert m.network_stats(xor2, 2) == {"units": 2, "connections": 5, "biases": 2, "parameters": 7,
                                        "depth": 2, "layered": False, "dense": None}, "the two-unit XOR of Section 1"
    copied = [([0, 1], [1, 0], -0.5), ([1], [1], -0.5), ([0, 1], [1, 1], -2), ([2, 3, 4], [1, 1, -2], -1)]
    before = [list(map(list, u[:2])) + [u[2]] for u in copied]
    got = m.network_stats(copied, 2)
    assert got["connections"] == 7, "a stored zero weight is not a connection"
    assert got["layered"] is True and got["dense"] == 13 and got["depth"] == 2 and got["parameters"] == 11
    assert [list(map(list, u[:2])) + [u[2]] for u in copied] == before, "do not mutate the units"
    # The n = 6 table of Section 3, built here so the check does not depend on parity_network.
    tree = []
    def block(a, b):
        base = 6 + len(tree)
        tree.extend([([a, b], [1, 1], -1), ([a, b], [-1, -1], 1), ([base, base + 1], [1, 1], -2)])
        return base + 2
    z1, z2, z3 = block(0, 1), block(2, 3), block(4, 5)
    z12 = block(z1, z2)
    block(z12, z3)
    stats = m.network_stats(tree, 6)
    assert (stats["units"], stats["connections"], stats["depth"], stats["layered"]) == (15, 30, 6, False)
    tree = []
    z1, z2, z3 = block(0, 1), block(2, 3), block(4, 5)
    z12 = block(z1, z2)
    tree.append(([z3], [1], -0.5)); tree.append(([6 + len(tree) - 1], [1], -0.5))
    block(z12, 6 + len(tree) - 1)
    stats = m.network_stats(tree, 6)
    assert (stats["units"], stats["connections"], stats["parameters"], stats["dense"]) == (17, 32, 49, 92), stats
    count = [(list(range(4)), [1] * 4, -k) for k in range(1, 5)] + [([4, 5, 6, 7], [1, -1, 1, -1], -1)]
    assert m.network_stats(count, 4)["dense"] == 25
    for args in (([], 2), (xor2, 0), ([([0, 2], [1, 1], 0)], 2), ([([0], [1, 1], 0)], 2), ([([0], [float("nan")], 0)], 2),
                 ([([0], [1], None)], 2), ([([True], [1], 0)], 2), ([([0], [1])], 2), (xor2, True)):
        _projection_rejects(m.network_stats, *args)


def polygon_indicator(m):
    square = [(-1, -1), (1, -1), (1, 1), (-1, 1)]
    hidden, (out_w, out_b) = m.polygon_indicator(square)
    assert len(hidden) == 4 and len(out_w) == 4
    def fires(x):
        h = _fires(hidden, x)
        return 1 if math.fsum([w * v for w, v in zip(out_w, h)] + [out_b]) >= 0 else 0
    for x, want in (((0, 0), 1), ((1, 0), 1), ((1, 1), 1), ((-1, 0.5), 1), ((1.0078125, 0), 0), ((0, -1.0078125), 0), ((2, 2), 0)):
        assert fires(x) == want, x
    hexagon = [(1, 0), (0.5, 1), (-0.5, 1), (-1, 0), (-0.5, -1), (0.5, -1)]
    hidden, (out_w, out_b) = m.polygon_indicator(hexagon)
    for i in range(-24, 25):
        for j in range(-24, 25):
            x = (i / 16, j / 16)
            assert fires(x) == (1 if abs(x[1]) <= 1 and 2 * abs(x[0]) + abs(x[1]) <= 2 else 0), x
    tri = [(0, 0), (4, 0), (0, 2)]
    copy = [list(v) for v in tri]
    hidden, (out_w, out_b) = m.polygon_indicator(tri)
    assert [list(v) for v in tri] == copy, "do not mutate the vertices"
    assert fires((1, 1)) == 1 and fires((2, 1)) == 1 and fires((2.125, 1)) == 0 and fires((0, 2)) == 1
    for bad in ([(0, 0), (1, 0)], list(reversed(square)), [(0, 0), (2, 0), (1, 1), (2, 2), (0, 2)],
                [(0, 0), (1, 0), (2, 0), (0, 1)], [(0, 0), (1, 0), (1, 0), (0, 1)], [(0, 0), (1, float("inf")), (0, 1)],
                [(0, 0), (1, 0, 0), (0, 1)], [(0, 0), (True, 0), (0, 1)], "abc"):
        _projection_rejects(m.polygon_indicator, bad)


def irreducible_error(m):
    def grid(xlines, ylines, size=4, g=8):
        codes, labels, weights = [], [], []
        for i in range(size * g):
            for j in range(size * g):
                x, y = (i + 0.5) / g, (j + 0.5) / g
                labels.append((sum(x >= t for t in (1, 2, 3)) + sum(y >= t for t in (1, 2, 3))) % 2)
                codes.append(tuple(int(x >= t) for t in xlines) + tuple(int(y >= t) for t in ylines))
                weights.append(1 / (g * g))
        return codes, labels, weights
    floor, labelling = m.irreducible_error(*grid((1, 2, 3), (1, 2, 3)))
    close(floor, 0); assert len(labelling) == 16
    floor, labelling = m.irreducible_error(*grid((1, 3), (1, 2, 3)))
    close(floor, 4); assert len(labelling) == 12, "the one-missing-line example of Section 6"
    floor, labelling = m.irreducible_error(*grid((1, 3), (1, 3)))
    close(floor, 6); assert len(labelling) == 9
    floor, _ = m.irreducible_error(*grid((1, 2.25, 3), (1, 2, 3)))
    close(floor, 1)
    coarse = m.irreducible_error(*grid((2,), (2,)))[0]
    fine = m.irreducible_error(*grid((2, 3), (2,)))[0]
    assert fine <= coarse + 1e-12, "refining the codes never raises the floor"
    floor, labelling = m.irreducible_error([(0,), (0,)], [0, 1], [1.0, 1.0])
    close(floor, 1); assert labelling == {(0,): 1}, "break ties by labelling 1"
    codes, labels, weights = [[0, 1], [0, 1]], [1, 0], [2.0, 0.5]
    m.irreducible_error(codes, labels, weights)
    assert codes == [[0, 1], [0, 1]] and weights == [2.0, 0.5], "do not mutate the inputs"
    for args in (([], [], []), ([(0,)], [2], [1]), ([(0,)], [1], [0]), ([(0,), (0, 1)], [1, 0], [1, 1]),
                 ([(0,)], [1], [float("nan")]), ([(2,)], [1], [1]), ([(0,)], [True], [1]), ([(0,)], [1, 0], [1])):
        _projection_rejects(m.irreducible_error, *args)


def relu_interpolant(m):
    relu = lambda z: z if z > 0 else 0.0
    def run(c0, units, t):
        return c0 + math.fsum(c * relu(t - k) for c, k in units)
    c0, units = m.relu_interpolant([0, 0.5, 1], [0, 1, 0])
    close(c0, 0); assert len(units) == 2
    for (c, k), (ec, ek) in zip(units, [(2, 0), (-4, 0.5)]):
        close(c, ec); close(k, ek)
    knots = [i / 4 for i in range(5)]
    tent = lambda x: 2 * min(x, 1 - x)
    c0, units = m.relu_interpolant(knots, [tent(tent(x)) for x in knots])
    for i in range(65):
        x = i / 64
        close(run(c0, units, x), tent(tent(x)))
    assert len(units) <= 4
    rng = random.Random(9)
    for _ in range(20):
        K = rng.randint(2, 12)
        ts = sorted(rng.sample(range(100), K))
        ts = [t / 10 for t in ts]
        vs = [rng.uniform(-3, 3) for _ in ts]
        c0, units = m.relu_interpolant(ts, vs)
        assert len(units) <= K - 1
        for t, v in zip(ts, vs):
            close(run(c0, units, t), v, 1e-7)
        mid = (ts[0] + ts[1]) / 2
        close(run(c0, units, mid), (vs[0] + vs[1]) / 2, 1e-7)
    assert m.relu_interpolant([0, 1, 2], [1, 2, 3])[1] == [(1.0, 0.0)], "omit zero slope changes"
    knots = [0, 1]
    m.relu_interpolant(knots, [0, 1])
    assert knots == [0, 1], "do not mutate the knots"
    for args in (([0], [1]), ([0, 1], [1]), ([1, 0], [0, 1]), ([0, 0], [1, 2]), ([0, True], [0, 1]),
                 ([0, 1], [0, float("inf")]), ([0, 1e-320], [0, 1e300])):
        _projection_rejects(m.relu_interpolant, *args)
