"""Behavioral checks for Linear algebra, Part III · Decomposition and conditioning (LA08–LA10).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import math
import random

from labs.check_helpers import close, _projection_rejects


def svd_2x2(m):
    fixtures = [([[3,0],[0,1]],[3,1]), ([[-3,0],[0,1]],[3,1]),
                ([[0,0],[0,0]],[0,0]), ([[1,2],[0,0]],[math.sqrt(5),0]),
                ([[1,2],[0,1]],[math.sqrt(2)+1,math.sqrt(2)-1]),
                ([[2,0],[0,2]],[2,2]), ([[0,-2],[2,0]],[2,2]),
                ([[1,0],[0,1e-10]],[1,1e-10]),
                ([[3e-200,0],[0,1e-200]],[3e-200,1e-200]),
                ([[3e200,0],[0,1e200]],[3e200,1e200])]
    rng = random.Random(808)
    for _ in range(30):
        a,b = rng.uniform(-3,3),rng.uniform(-3,3)
        u = [[math.cos(a),-math.sin(a)],[math.sin(a),math.cos(a)]]
        vt = [[math.cos(b),math.sin(b)],[-math.sin(b),math.cos(b)]]
        gains = sorted([rng.uniform(.1,4),rng.uniform(.1,4)],reverse=True)
        matrix = [[sum(u[i][k]*gains[k]*vt[k][j] for k in range(2))
                   for j in range(2)] for i in range(2)]
        fixtures.append((matrix,gains))
    for a,want in fixtures:
        before = [row[:] for row in a]
        u,s,vt = m.svd_2x2(a)
        assert len(s)==2 and s[0]>=s[1]>=0
        assert len(u)==len(vt)==2 and all(len(row)==2 for row in u+vt)
        for got,expected in zip(s,want):
            assert math.isclose(got,expected,rel_tol=1e-10,abs_tol=0 if expected else 1e-12)
        for i in range(2):
            for j in range(2):
                close(sum(u[k][i]*u[k][j] for k in range(2)),int(i==j))
                close(sum(vt[i][k]*vt[j][k] for k in range(2)),int(i==j))
        scale = max(abs(v) for row in a for v in row) or 1
        for i in range(2):
            for j in range(2):
                got = sum(u[i][k]*(s[k]/scale)*vt[k][j] for k in range(2))
                assert abs(got-a[i][j]/scale)<1e-10
        assert a==before
    for a in (None,[],[[1]],[[1,2,3],[4,5,6]],[[1,2],[3]],[[True,0],[0,1]],
              [[float('inf'),0],[0,1]],[[1,float('nan')],[0,1]],
              [[1.7e308,1.7e308],[1.7e308,1.7e308]]):
        _projection_rejects(m.svd_2x2,a)


def truncate_rank(m):
    # Known rectangular reduced decompositions, independent of the student's SVD.
    fixtures = [([[1,0],[0,1],[0,0]],[3,2],[[1,0],[0,1]]),
                ([[1,0],[0,1]],[3,2],[[1,0,0],[0,1,0]]),
                ([[.6,-.8],[.8,.6]],[5,1],[[0,1],[-1,0]]),
                ([[1,0],[0,1]],[0,0],[[1,0],[0,1]]), ([[1]],[7],[[1]])]
    for u,s,vt in fixtures:
        old = ([row[:] for row in u],s[:],[row[:] for row in vt])
        for k in range(len(s)+1):
            result=m.truncate_rank(u,s,vt,k)
            assert len(result)==len(u) and all(len(row)==len(vt[0]) for row in result)
            for i in range(len(u)):
                for j in range(len(vt[0])):
                    close(result[i][j],sum(u[i][a]*s[a]*vt[a][j] for a in range(k)))
        assert (u,s,vt)==old
    I=[[1,0],[0,1]]
    for k in (-1,3,True,1.0,None):
        _projection_rejects(m.truncate_rank,I,[3,1],I,k)
    for u,s,vt in [(None,[1],[[1]]), (I,[1],I), (I,[1,2],I), (I,[1,-1],I),
                    (I,[1,True],I), (I,[float('inf'),1],I),
                    ([[1,1],[0,1]],[2,1],I), (I,[2,1],[[1,0],[1,0]]),
                    ([[True,0],[0,1]],[2,1],I), (I,[2,1],[[1,0,0]]),
                    ([[1,0],[0,float('nan')]],[2,1],I)]:
        _projection_rejects(m.truncate_rank,u,s,vt,1)


def explained_variance(m):
    fixtures=[([6,3,1],[36/46,9/46,1/46]),([2,2],[.5,.5]),([5,0,0],[1,0,0]),
              ([7],[1]),([3e200,1e200],[.9,.1]),([3e-200,1e-200],[.9,.1])]
    for s,want in fixtures:
        old=s[:]
        ratios,cumulative=m.explained_variance(s)
        assert len(ratios)==len(cumulative)==len(s)
        for i in range(len(s)):
            close(ratios[i],want[i])
            close(cumulative[i],sum(want[:i+1]))
        assert s==old
    for s in (None,[],[0],[0,0],[1,2],[-1],[True],[float('inf')],[float('nan')],['1']):
        _projection_rejects(m.explained_variance,s)


def matrix_norms(m):
    fixtures = [([[1,-2,0],[3,0,4]], (4,7)), ([[0,0],[0,0]], (0,0)),
                ([[-5]], (5,5)), ([[1,-2,3]], (3,6)), ([[1],[-2],[3]], (6,3))]
    for a, expected in fixtures:
        for scale in (1.0, 1e-200, -1e200):
            matrix = [[value * scale for value in row] for row in a]
            before = [row[:] for row in matrix]
            result = m.matrix_norm_1_inf(matrix)
            assert len(result) == 2
            for got, want in zip(result, expected):
                assert math.isclose(got, want * abs(scale), rel_tol=1e-13, abs_tol=0)
            assert matrix == before, "norm task must preserve input"
    assert m.matrix_norm_1_inf(((1, -2), (3, 0))) == (4, 3)
    for a in (None, [], [[]], [[1],[2,3]], [[True]], [[float('nan')]],
              [[float('inf')]], [['1']], [[1e308,1e308]], [[1e308],[1e308]]):
        _projection_rejects(m.matrix_norm_1_inf, a)


def condition_estimate(m):
    # Analytic infinity-norm oracles, including matrices that require pivoting.
    fixtures = [([[1]], 1), ([[0,2],[1,3]], 10), ([[1,2],[3,4]], 21),
                ([[1,0],[0,1e-12]], 1e12),
                ([[0,0,2],[3,0,0],[0,4,0]], 2),
                ([[1,0,0],[0,2,0],[0,0,8]], 8)]
    for a, expected in fixtures:
        for scale in (1.0, 1e-200, -1e200):
            matrix = [[value * scale for value in row] for row in a]
            before = [row[:] for row in matrix]
            got = m.condition_estimate(matrix)
            assert math.isclose(got, expected, rel_tol=2e-12, abs_tol=0), (got, expected)
            assert matrix == before, "condition task must preserve input"
    # An exact 2x2 inverse formula supplies independent randomized expectations.
    generator = random.Random(907)
    for _ in range(25):
        a,b,c,d = [generator.randint(-9,9) for _ in range(4)]
        determinant = a*d-b*c
        if determinant:
            expected = max(abs(a)+abs(b), abs(c)+abs(d)) * max(
                abs(d)+abs(b), abs(c)+abs(a)) / abs(determinant)
            assert math.isclose(m.condition_estimate([[a,b],[c,d]]), expected, rel_tol=1e-12)
    for a in ([[0]], [[0,0],[0,0]], [[1,2],[2,4]]):
        before = [row[:] for row in a]
        assert m.condition_estimate(a) == math.inf
        assert a == before
    for a in (None, [], [[]], [[1,2]], [[1],[2]], [[True]], [['1']],
              [[float('inf')]], [[float('nan')]], [[1,0],[0,1e-309]]):
        _projection_rejects(m.condition_estimate, a)


def cancellation_demo(m):
    from decimal import Decimal, localcontext
    for t in (0.0, 2.0**-54, 1e-12, 0.25, 3.0, 1e200):
        direct, stable = m.cancellation_demo(t)
        assert direct == math.sqrt(1.0+t)-1.0, "retain the direct path for comparison"
        with localcontext() as context:
            context.prec = 100
            td = Decimal.from_float(t)
            oracle = float(td / ((1+td).sqrt()+1))
        assert math.isclose(stable, oracle, rel_tol=3e-15, abs_tol=0), (t, stable, oracle)
    direct, stable = m.cancellation_demo(2.0**-54)
    assert direct == 0 and stable > 0
    for t in (-1, -1e-20, True, None, '1', float('nan'), float('inf')):
        _projection_rejects(m.cancellation_demo, t)


def _la10_fixtures():
    """Compact SVDs with exact-rank and truncation cases (m, n, U, s, Vt)."""
    r5, r2 = math.sqrt(5), math.sqrt(2)
    third = lambda rows: [[v / 3 for v in row] for row in rows]
    U3 = third([[1, 2, 2], [2, 1, -2], [2, -2, 1]])
    V3 = third([[2, -1, 2], [2, 2, -1], [-1, 2, 2]])
    col = lambda M, j: [row[j] for row in M]
    return {
        # duplicate columns [[1,1],[2,2]]: one channel
        "duplicate": (2, 2, [[1 / r5], [2 / r5]], [math.sqrt(10)], [[1 / r2, 1 / r2]]),
        # the 3x3 lesson example with sigma = (6, 3): rank 2
        "lesson3": (3, 3, [[U3[i][0], U3[i][1]] for i in range(3)], [6, 3], [col(V3, 0), col(V3, 1)]),
        # well conditioned, full rank, three channels
        "full3": (3, 3, U3, [3, 2, 1], [col(V3, 0), col(V3, 1), col(V3, 2)]),
        # diag(1, 0.001): truncation at 0.01 drops the second channel
        "diag": (2, 2, [[1, 0], [0, 1]], [1, 0.001], [[1, 0], [0, 1]]),
        # repeated singular values, wide 2x3
        "repeated": (2, 3, [[1, 0], [0, 1]], [2, 2], [[1, 0, 0], [0, 0, 1]]),
        # rank zero, 2x3
        "zero": (2, 3, [[], []], [], []),
    }


def _la10_matrix(m, n, u, s, vt, tol=-1.0):
    return [[math.fsum(u[i][k] * s[k] * vt[k][j] for k in range(len(s)) if s[k] > tol) for j in range(n)] for i in range(m)]


def _mm(a, b):
    return [[math.fsum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]


def _la10_rejects(fn, base, extra):
    m, n, u, s, vt = base
    bad = [(0, n, u, s, vt), (True, n, u, s, vt), (m, 2.0, u, s, vt), (m, n, u, [s[0], -1.0][:len(s)] if len(s) > 1 else [-1.0], vt),
           (m, n, u, list(reversed(s)) if len(s) > 1 and s[0] != s[-1] else [float("nan")] * len(s), vt),
           (m, n, u[:-1], s, vt), (m, n, u, s, vt[:-1] if vt else [[1.0] * n]),
           (m, n, [[2 * v for v in row] for row in u], s, vt), (m, n, u, [True] * len(s) if s else [1.0], vt)]
    for args in bad:
        _projection_rejects(fn, *args, *extra)


def pinv_via_svd(m):
    F = _la10_fixtures()
    for name, (mm_, nn, u, s, vt) in F.items():
        for tol in (0.0, 0.01, 2.5):
            before = (repr(u), repr(s), repr(vt))
            G = m.pinv_via_svd(mm_, nn, u, s, vt, tol)
            assert len(G) == nn and all(len(row) == mm_ for row in G), "pseudoinverse is n by m"
            At = _la10_matrix(mm_, nn, u, s, vt, tol)
            if all(v == 0 for row in At for v in row):
                assert all(abs(v) == 0 for row in G for v in row), "nothing kept: zero matrix"
                continue
            AG, GA = _mm(At, G), _mm(G, At)
            for X, Y in ((_mm(AG, At), At), (_mm(GA, G), G)):
                for i in range(len(X)):
                    for j in range(len(X[0])):
                        close(X[i][j], Y[i][j], 1e-9)
            for P in (AG, GA):
                for i in range(len(P)):
                    for j in range(len(P)):
                        close(P[i][j], P[j][i], 1e-9)
            assert before == (repr(u), repr(s), repr(vt)), "pinv must preserve inputs"
    # exact rank with tol removing nothing: identities hold against the original A
    mm_, nn, u, s, vt = F["lesson3"]
    G = m.pinv_via_svd(mm_, nn, u, s, vt, 0.0)
    want = [[-2/54, 2/54, 8/54], [10/54, 8/54, -4/54], [7/54, 2/54, -10/54]]
    for i in range(3):
        for j in range(3):
            close(G[i][j], want[i][j], 1e-12)
    # truncation keeps sigma > tol: diag(1, 0.001) at tol 0.01 gives diag(1, 0)
    G = m.pinv_via_svd(*F["diag"], 0.01)
    assert G == [[1.0, 0.0], [0.0, 0.0]] or all(abs(G[i][j] - [[1, 0], [0, 0]][i][j]) < 1e-15 for i in range(2) for j in range(2))
    G = m.pinv_via_svd(*F["diag"], 0.001)
    assert abs(G[1][1]) == 0, "sigma equal to tol is discarded"
    for tol in (-1e-9, True, float("inf"), None, "0"):
        _projection_rejects(m.pinv_via_svd, *F["full3"], tol)
    _la10_rejects(m.pinv_via_svd, F["full3"], (0.0,))


def ridge_solve(m):
    F = _la10_fixtures()
    # independent normal-equations oracle on a well-conditioned case
    mm_, nn, u, s, vt = F["full3"]
    A = _la10_matrix(mm_, nn, u, s, vt)
    b = [1.0, -2.0, 0.5]
    for lam in (0.0, 0.3, 4.0):
        x = m.ridge_solve(mm_, nn, u, s, vt, b, lam)
        AtA = [[math.fsum(A[k][i] * A[k][j] for k in range(3)) + (lam if i == j else 0) for j in range(3)] for i in range(3)]
        lhs = [math.fsum(AtA[i][j] * x[j] for j in range(3)) for i in range(3)]
        rhs = [math.fsum(A[k][i] * b[k] for k in range(3)) for i in range(3)]
        for a, c in zip(lhs, rhs):
            close(a, c, 1e-10)
    # nonincreasing norm in lam
    norms = [math.hypot(*m.ridge_solve(mm_, nn, u, s, vt, b, lam)) for lam in (0.0, 0.01, 0.1, 1.0, 10.0, 1e6)]
    assert all(a >= c - 1e-15 for a, c in zip(norms, norms[1:])), "ridge norm must not increase with lam"
    # duplicate columns: x_lam = (c, c) with c = 1/(10+lam), limit (1/10, 1/10)
    for lam, c in ((1.0, 1 / 11), (0.01, 100 / 1001), (1e-6, 1 / (10 + 1e-6)), (0.0, 0.1)):
        x = m.ridge_solve(*F["duplicate"], [1.0, 0.0], lam)
        close(x[0], c, 1e-12); close(x[1], c, 1e-12)
    # the near-collinear opening fit: weak channel passed at f2 = sigma2^2/(sigma2^2+0.01)
    s2 = 0.0098233; f2 = s2 * s2 / (s2 * s2 + 0.01)
    x = m.ridge_solve(1, 1, [[1.0]], [s2], [[1.0]], [s2], 0.01)
    close(x[0], f2, 1e-12)
    assert abs(f2 - 0.00956) < 5e-5
    # tiny gains must not underflow to a division by zero
    x = m.ridge_solve(1, 1, [[1.0]], [1e-200], [[1.0]], [1e-200], 1.0)
    assert math.isfinite(x[0]) and abs(x[0]) <= 1e-300
    assert m.ridge_solve(*F["zero"], [1.0, 2.0], 0.0) == [0.0, 0.0, 0.0]
    for lam in (-0.1, True, float("nan"), None):
        _projection_rejects(m.ridge_solve, *F["full3"], b, lam)
    for bad_b in ([1.0, 2.0], [True, 0, 0], [float("inf"), 0, 0], None):
        _projection_rejects(m.ridge_solve, *F["full3"], bad_b, 0.1)
    _la10_rejects(m.ridge_solve, F["full3"], (b, 0.1))
    before = b[:]; m.ridge_solve(*F["full3"], b, 0.1); assert b == before


def min_norm_solution(m):
    F = _la10_fixtures()
    for name, (mm_, nn, u, s, vt) in F.items():
        b = [0.3 * (i + 1) - 0.5 for i in range(mm_)]
        for tol in (0.0, 0.01, 2.5):
            before = (repr(u), repr(s), repr(vt), b[:])
            x, k, rnorm = m.min_norm_solution(mm_, nn, u, s, vt, b, tol)
            kept = [i for i, sv in enumerate(s) if sv > tol]
            assert k == len(kept)
            # agreement with A_tol+ b
            G = [[math.fsum(vt[i][a] * u[c][i] / s[i] for i in kept) for c in range(mm_)] for a in range(nn)]
            for a in range(nn):
                close(x[a], math.fsum(G[a][c] * b[c] for c in range(mm_)), 1e-12)
            # x lies in the span of the kept right singular vectors
            resid_x = [x[j] - math.fsum(math.fsum(x[t] * vt[i][t] for t in range(nn)) * vt[i][j] for i in kept) for j in range(nn)]
            assert math.hypot(*resid_x) < 1e-12 if resid_x else True
            # residual against the full A, orthogonal to the kept left vectors
            A = _la10_matrix(mm_, nn, u, s, vt)
            r = [b[i] - math.fsum(A[i][j] * x[j] for j in range(nn)) for i in range(mm_)]
            close(rnorm, math.hypot(*r), 1e-12)
            for i in kept:
                assert abs(math.fsum(u[c][i] * r[c] for c in range(mm_))) < 1e-12
            assert before == (repr(u), repr(s), repr(vt), b), "inputs must be preserved"
    # counterexample: diag(1, 0.001), b = (0, 1), tol = 0.01 gives x = 0 and residual (0, 1),
    # which is not orthogonal to range(A) = R^2 although it is orthogonal to the kept u1
    x, k, rnorm = m.min_norm_solution(*F["diag"], [0.0, 1.0], 0.01)
    assert x == [0.0, 0.0] and k == 1 and rnorm == 1.0
    # borderline sigma == tol is discarded
    x, k, rnorm = m.min_norm_solution(*F["diag"], [0.0, 1.0], 0.001)
    assert k == 1 and x == [0.0, 0.0]
    x, k, rnorm = m.min_norm_solution(*F["diag"], [0.0, 1.0], 0.0)
    assert k == 2 and math.isclose(x[1], 1000.0, rel_tol=1e-12) and rnorm == 0
    assert m.min_norm_solution(*F["zero"], [3.0, 4.0], 0.0) == ([0.0, 0.0, 0.0], 0, 5.0)
    for tol in (-1.0, True, float("nan")):
        _projection_rejects(m.min_norm_solution, *F["full3"], [1.0, 0.0, 0.0], tol)
    _projection_rejects(m.min_norm_solution, *F["full3"], [1.0, 0.0], 0.0)
    _la10_rejects(m.min_norm_solution, F["full3"], ([1.0, 0.0, 0.0], 0.0))
