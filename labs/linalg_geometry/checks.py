"""Behavioral checks for Linear algebra, Part II · Geometry (LA03–LA07).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import itertools
import math
import random

from labs.check_helpers import close, _projection_rejects
from labs.linalg_structure.checks import matvec


def project_onto(m):
    columns = [[1., 0., 1.], [0., 1., 1.]]
    goal = [1., 1., 0.]
    before = [row[:] for row in columns], goal[:]
    p, point, residual = m.project_onto(columns, goal)
    for a, b in zip(point, [1/3, 1/3, 2/3]):
        close(a, b)
    for i in range(3):
        close(point[i] + residual[i], goal[i])
        for j in range(3):
            close(p[i][j], p[j][i])
            close(sum(p[i][k] * p[k][j] for k in range(3)), p[i][j])
    for column in columns:
        close(sum(a * b for a, b in zip(column, residual)), 0.)
        for a, b in zip(matvec(p, column), column):
            close(a, b)
    assert (columns, goal) == before
    changed = [[1., 0., 1.], [1., 2., 3.]]
    other, _, _ = m.project_onto(changed, goal)
    for row, expected in zip(other, p):
        for a, b in zip(row, expected):
            close(a, b)
    _, line, rest = m.project_onto([[1., 1.]], [2., 0.])
    assert all(abs(a-b) < 1e-8 for a,b in zip(line, [1.,1.]))
    assert all(abs(a-b) < 1e-8 for a,b in zip(rest, [1.,-1.]))
    _, zero, rest = m.project_onto(columns, [0.,0.,0.])
    assert zero == [0.,0.,0.] and rest == [0.,0.,0.]
    for basis, target, tol in [(None, [1.], 1e-9), ([], [], 1e-9), ([[1.,2.],[2.,4.]], [1.,0.], 1e-9),
        ([[1.,0.],[1.,1e-8]], [1.,0.], 1e-9), ([[1.,2.],[3.]], [1.,0.], 1e-9),
        ([[1.,2.]], [1.], 1e-9), ([[True,0.]], [0.,0.], 1e-9),
        ([[1.,0.]], [float('nan'),0.], 1e-9), ([[1.,0.]], [0.,0.], 0.)]:
        _projection_rejects(m.project_onto, basis, target, tol)


def normal_equations(m):
    rows, target = [[1.,0.],[1.,1.],[1.,2.]], [1.,2.,2.]
    before = [r[:] for r in rows], target[:]
    w, residual, error = m.normal_equations(rows, target)
    close(w[0], 7/6); close(w[1], .5); close(error, 1/6)
    for actual, expected in zip(residual, [-1/6,1/3,-1/6]):
        close(actual, expected)
    for j in range(2):
        close(sum(row[j]*r for row,r in zip(rows,residual)), 0.)
    assert (rows,target) == before
    for a, b, expected in [([[1.],[1.]], [0.,2.], [1.]),
                           ([[1.,0.],[0.,2.]], [3.,4.], [3.,2.]),
                           (rows, [1.,3.,5.], [1.,2.])]:
        w, residual, error = m.normal_equations(a,b)
        for x,y in zip(w,expected): close(x,y)
        close(error, sum(r*r for r in residual))
        for row,value,r in zip(a,b,residual): close(sum(x*y for x,y in zip(row,w))+r,value)
    for a,b,tol in [([[1.,1.],[2.,2.]], [1.,0.], 1e-9),
        ([[1.,1.],[0.,1e-8]], [1.,0.], 1e-9), ([[1.,2.]], [1.], 1e-9),
        ([[1.],[2.]], [1.], 1e-9), ([[1.],[float('inf')]], [1.,2.], 1e-9),
        ([[1.]], [True], 1e-9), ([[1.]], [1.], float('nan'))]:
        _projection_rejects(m.normal_equations,a,b,tol)


def gram_metric(m):
    g,u,v = [[2.,1.],[1.,2.]], [1.,2.], [3.,-1.]
    before = [r[:] for r in g],u[:],v[:]
    close(m.gram_metric(g,u,v),7.)
    close(m.gram_metric(g,v,u),7.)
    close(m.gram_metric(g,[u[0]+v[0],u[1]+v[1]],v),
          m.gram_metric(g,u,v)+m.gram_metric(g,v,v))
    close(m.gram_metric(g,[2*x for x in u],v),14.)
    close(m.gram_metric(g,[0.,0.],v),0.)
    close(m.gram_metric([[1.,0.],[0.,4.]],[1.,1.],[1.,-1.]),-3.)
    assert (g,u,v) == before
    for bad in [[[1.,2.],[2.,1.]], [[-1.,0.],[0.,-1.]], [[1.,0.],[0.,0.]],
                [[1.,0.],[1.,1.]], [[1.,0.],[0.,1e-12]], [[1.,float('nan')],[0.,1.]]]:
        _projection_rejects(m.gram_metric,bad,[1.,0.],[1.,0.])
    close(m.gram_metric([[1.,0.],[0.,1e-12]],[0.,1.],[0.,1.],1e-15),1e-12)
    _projection_rejects(m.gram_metric,g,[1.],v)
    _projection_rejects(m.gram_metric,g,u,[True,1.])
    _projection_rejects(m.gram_metric,g,u,v,-1.)
    _projection_rejects(m.gram_metric,[],[],[])


def _check_qr_factors(rows, q, r, tol=1e-8):
    height, width = len(rows), len(rows[0])
    assert len(q) == height and all(len(row) == width for row in q)
    assert len(r) == width and all(len(row) == width for row in r)
    assert all(r[i][i] > 0 for i in range(width))
    for i in range(width):
        for j in range(width):
            close(sum(row[i]*row[j] for row in q), float(i == j), tol)
            if i > j: close(r[i][j], 0., tol)
    for i in range(height):
        for j in range(width):
            close(sum(q[i][k]*r[k][j] for k in range(width)), rows[i][j], tol)


def gram_schmidt(m):
    fixtures = [[[1.,1.],[1.,0.],[0.,1.]], [[3.,1.],[0.,2.],[0.,0.]],
                [[2.]], [[-3.],[4.]], [[1.,0.,0.],[0.,2.,0.],[0.,0.,3.]],
                [[1.,2.,0.],[0.,1.,1.],[1.,0.,2.],[2.,1.,1.]]]
    for rows in fixtures:
        before = [row[:] for row in rows]
        classical, modified = m.gram_schmidt(rows)
        for q,r in (classical,modified): _check_qr_factors(rows,q,r)
        assert rows == before
    # A deterministic float64 case distinguishes the two requested algorithms.
    eps = 1e-8
    rows = [[1.,1.,1.],[eps,eps,0.],[eps,0.,eps]]
    (qc,rc),(qm,rm) = m.gram_schmidt(rows)
    def overlap(q):
        return max(abs(sum(row[i]*row[j] for row in q))
                   for i in range(3) for j in range(i+1,3))
    assert overlap(qc) > .1, "return actual classical GS, not two copies of MGS"
    assert overlap(qm) < 1e-6, "modified GS must project the updated residual"
    for q,r in ((qc,rc),(qm,rm)):
        for i in range(3):
            for j in range(3): close(sum(q[i][k]*r[k][j] for k in range(3)),rows[i][j])
    for rows in [[], [[]], [[1.],[2.,3.]], [[1.,2.]], [[0.],[0.]],
                 [[1.,2.],[0.,0.]], [[True]], [[float('nan')]], None]:
        _projection_rejects(m.gram_schmidt,rows)
    for tol in [0., -1., float('inf'), float('nan'), True]:
        _projection_rejects(m.gram_schmidt,[[1.]],tol)
    _projection_rejects(m.gram_schmidt,[[1.,0.],[0.,1e-13]])
    for q,r in m.gram_schmidt([[1.,0.],[0.,1e-13]],1e-15):
        _check_qr_factors([[1.,0.],[0.,1e-13]],q,r)


def qr_solve(m):
    for rows,b,expected in [([[1.,0.],[1.,1.],[1.,2.]],[1.,2.,2.],[7/6,.5]),
                            ([[1.],[1.],[1.]],[1.,2.,3.],[2.]),
                            ([[2.,1.],[0.,3.]],[5.,3.],[2.,1.]),
                            ([[1.,1.],[0.,1e-8]],[2.,1e-8],[1.,1.]),
                            ([[1.,1.,1.],[1e-8,1e-8,0.],[1e-8,0.,1e-8]],
                             [6.,3e-8,4e-8],[1.,2.,3.]),
                            ([[1.,0.],[0.,1.],[1.,1.]],[0.,0.,0.],[0.,0.]),
                            ([[1.,0.],[1.,1.],[1.,2.]],[1.,3.,5.],[1.,2.])]:
        before = [row[:] for row in rows], b[:]
        x,r,sse = m.qr_solve(rows,b)
        assert len(x) == len(expected) and len(r) == len(b)
        for actual,want in zip(x,expected): close(actual,want)
        close(sse,sum(z*z for z in r))
        for row,y,err in zip(rows,b,r): close(sum(a*c for a,c in zip(row,x))+err,y)
        for j in range(len(x)): close(sum(row[j]*err for row,err in zip(rows,r)),0.)
        assert (rows,b) == before
    for rows,b in [([[1.,1.],[2.,2.]],[1.,2.]), ([[1.,2.]],[1.]),
                   ([[1.]],[1.,2.]), ([[1.]],[True]), ([[float('inf')]],[1.]),
                   ([[1.]],None), ([],[]), ([[1.,0.],[0.,1e-13]],[1.,1.])]:
        _projection_rejects(m.qr_solve,rows,b)
    for tol in [0.,-1.,float('nan'),float('inf'),True]:
        _projection_rejects(m.qr_solve,[[1.]],[1.],tol)
    x,r,error=m.qr_solve([[1.,0.],[0.,1e-13]],[1.,1e-13],1e-15)
    for z in x: close(z,1.)


def orthogonality_defect(m):
    for rows,expected in [([[1.,0.],[0.,1.]],0.), ([[2.,0.],[0.,3.]],0.),
                          ([[0.,0.]],0.), ([[3.],[4.]],0.),
                          ([[1.,1.],[0.,1.]],1.), ([[1.,2.,-3.]],6.),
                          ([[1.,1.],[1.,-1.]],0.), ([[1.,-.5],[0.,1.]],.5)]:
        before = [row[:] for row in rows]
        close(m.orthogonality_defect(rows),expected)
        assert rows == before
    for bad in [[], [[]], [[1.],[1.,2.]], [[True]], [[float('inf')]],
                [[float('nan')]], None]:
        _projection_rejects(m.orthogonality_defect,bad)


def _det_permutations(rows):
    """Independent small-matrix oracle: exact for integer fixtures."""
    n = len(rows)
    result = 0
    for p in itertools.permutations(range(n)):
        inversions = sum(p[i] > p[j] for i in range(n) for j in range(i + 1, n))
        result += (-1) ** inversions * math.prod(rows[i][p[i]] for i in range(n))
    return result


def det_by_elimination(m):
    fixtures = [([[7]], 7), ([[-2]], -2), ([[0]], 0),
                ([[0, 1], [1, 0]], -1), ([[2, 1], [1, 3]], 5),
                ([[1, 2], [2, 4]], 0), ([[0, 2, 1], [1, 1, 0], [2, 0, 1]], -4),
                ([[0, 1, 0], [0, 0, 2], [3, 0, 0]], 6),
                ([[0, 1, 2], [0, 2, 3], [0, 0, 1]], 0)]
    for rows, expected in fixtures:
        before = [row[:] for row in rows]
        close(m.det_by_elimination(rows), expected)
        assert rows == before, "determinant must preserve the input"
    # Absolute-tolerance comparisons would falsely accept zero here.
    small = m.det_by_elimination([[1e-10, 0], [0, 1e-10]])
    assert small != 0 and math.isclose(small, 1e-20, rel_tol=1e-12, abs_tol=0)
    close(m.det_by_elimination([[1e6, 0], [0, 1e-6]]), 1)
    rng = random.Random(504)
    for n in range(2, 5):
        for _ in range(8):
            rows = [[rng.randint(-3, 3) for _ in range(n)] for _ in range(n)]
            expected = _det_permutations(rows)
            close(m.det_by_elimination(rows), expected)
            transposed = [list(row) for row in zip(*rows)]
            close(m.det_by_elimination(transposed), expected)
    for bad in [[], [[]], [[1, 2]], [[1], [2]], [[1, 2], [3]], [[True]],
                [[float('nan')]], [[float('inf')]], [['2']], None]:
        _projection_rejects(m.det_by_elimination, bad)
    _projection_rejects(m.det_by_elimination, [[1e308, 0], [0, 1e308]])
    _projection_rejects(m.det_by_elimination, [[1e308, 1e308], [-1e308, 1e308]])


def volume_ratio(m):
    a = [[2, 1], [0, -3]]
    fixtures = [(a, [[1, 0], [0, 1]], 6), (a, [[1, 1], [0, 2]], 6),
                (a, [[1, 1], [2, 0]], 6), ([[1, 2], [2, 4]], [[2, 1], [1, 1]], 0),
                ([[0, 0], [0, 0]], [[1, 0], [0, 1]], 0), ([[-3]], [[2]], 3),
                ([[0, 1, 0], [0, 0, 2], [3, 0, 0]],
                 [[1, 1, 0], [0, 2, 1], [0, 0, 3]], 6)]
    for rows, basis, expected in fixtures:
        before = [row[:] for row in rows], [row[:] for row in basis]
        close(m.volume_ratio(rows, basis), expected)
        assert (rows, basis) == before, "volume ratio must preserve both inputs"
    # A small source is still a valid source, and a small image is not zero.
    close(m.volume_ratio(a, [[1e-8, 0], [0, 1e-8]]), 6)
    small = m.volume_ratio([[1e-10, 0], [0, 1e-10]], [[1, 0], [0, 1]])
    assert small != 0 and math.isclose(small, 1e-20, rel_tol=1e-12, abs_tol=0)
    for rows, basis in [(a, [[1, 2], [2, 4]]), (a, [[1]]), ([], []),
                        ([[True]], [[1]]), ([[1]], [[float('nan')]]),
                        ([[1, 2]], [[1, 0], [0, 1]]), (a, [[1], [2]]),
                        (None, [[1]]), ([[1]], None), ([[1]], [['2']]),
                        ([[1e308]], [[2]])]:
        _projection_rejects(m.volume_ratio, rows, basis)


def cofactor_2x2(m):
    for rows, expected in [([[2, 1], [1, 3]], [6, -1]),
                           ([[1, 1], [1, 1]], [1, -1]),
                           ([[0, 1], [1, 0]], [0, -1]),
                           ([[1, -2], [3, 4]], [4, 6]),
                           ([[0, 0], [0, 0]], [0, 0])]:
        before = [row[:] for row in rows]
        terms, total = m.cofactor_2x2(rows)
        assert len(terms) == 2
        for actual, want in zip(terms, expected): close(actual, want)
        close(total, sum(expected))
        assert rows == before
    for bad in [[], [[1]], [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
                [[1, 2], [3]], [[True, 0], [0, 1]], [[1, float('inf')], [0, 1]],
                [[1, float('nan')], [0, 1]], [[1, '2'], [3, 4]], None,
                [[1e308, 0], [0, 1e308]]]:
        _projection_rejects(m.cofactor_2x2, bad)


def power_iteration(m):
    def audit(rows, start, **kwargs):
        before = [r[:] for r in rows], start[:]
        report = m.power_iteration(rows, start, **kwargs)
        assert (rows, start) == before, "preserve inputs"
        assert set(report) == {"vector", "eigenvalue", "residual", "iterations", "converged", "reason"}
        v = report["vector"]
        assert len(v) == len(rows)
        close(math.hypot(*v), 1)
        av = [sum(a*x for a,x in zip(row,v)) for row in rows]
        lam = sum(x*y for x,y in zip(v,av))
        close(report["eigenvalue"], lam)
        close(report["residual"], math.hypot(*(y-lam*x for x,y in zip(v,av))))
        assert isinstance(report["converged"], bool)
        assert isinstance(report["iterations"], int) and 0 <= report["iterations"] <= kwargs.get("max_iter",200)
        assert report["reason"] == ("residual" if report["converged"] else "max_iter")
        return report
    for dominant in (2, -2):
        r = audit([[dominant,0],[0,1]], [1,1])
        assert r['converged'] and abs(r['eigenvalue']-dominant)<1e-8
        assert r['iterations'] > 0
    for rows,start,value in [([[2,0],[0,1]],[0,1],1), ([[0,0],[0,0]],[3,4],0),
                             ([[2,0],[0,0]],[0,1],0), ([[3]],[2],3),
                             ([[2,1],[0,1]],[-1,1],1)]:
        r=audit(rows,start)
        assert r['converged'] and r['iterations']==0
        close(r['eigenvalue'],value)
    for rows in ([[0,-1],[1,0]], [[1,0],[0,-1]]):
        r=audit(rows,[1,1],max_iter=17)
        assert not r['converged'] and r['iterations']==17
    r=audit([[2,0],[0,1]],[1,1],max_iter=0)
    assert not r['converged'] and r['iterations']==0
    r=audit([[1,0],[0,.98]],[1,1],max_iter=20,tol=1e-10)
    assert not r['converged']
    # Rescaling a matrix must not change the relative-residual stopping decision.
    baseline=m.power_iteration([[2,0],[0,1]],[1,1])
    for scale in (1e-200,1e200):
        r=m.power_iteration([[2*scale,0],[0,scale]],[1e308,1e308])
        assert r['converged'] and r['iterations']==baseline['iterations']
        assert math.isclose(r['eigenvalue']/scale,2,rel_tol=1e-8)
    for rows,start in [(None,[1]), ([],[]), ([[1,2]],[1]), ([[1],[2]],[1,2]),
                        ([[1,2],[3]],[1,1]), ([[True]],[1]), ([[float('nan')]],[1]),
                        ([[float('inf')]],[1]), ([[1]],[False]), ([[1]],[0]),
                        ([[1]],None), ([[1]],[1,2]), ([[1]],[float('inf')])]:
        _projection_rejects(m.power_iteration,rows,start)
    for budget in (-1,1.5,True):
        _projection_rejects(m.power_iteration,[[1]],[1],budget)
    for tol in (0,-1,True,float('nan'),float('inf')):
        _projection_rejects(m.power_iteration,[[1]],[1],10,tol)
    _projection_rejects(m.power_iteration,[[1e308,1e308],[1e308,1e308]],[1,1])


def char_poly_2x2(m):
    fixtures=[([[2,1],[0,1]],[1,-3,2]), ([[0,-1],[1,0]],[1,0,1]),
              ([[1,1],[0,1]],[1,-2,1]), ([[0,0],[0,0]],[1,0,0]),
              ([[3,2],[0,-1]],[1,-2,-3]), ([[1,2],[2,4]],[1,-5,0])]
    rng=random.Random(606)
    for _ in range(20):
        rows=[[rng.randint(-5,5) for _ in range(2)] for _ in range(2)]
        a,b=rows[0];c,d=rows[1]
        fixtures.append((rows,[1,-a-d,a*d-b*c]))
    for rows,want in fixtures:
        before=[r[:] for r in rows]
        got=m.char_poly_2x2(rows)
        assert len(got)==3
        for x,y in zip(got,want):close(x,y)
        assert rows==before
    for bad in (None,[],[[1]],[[1,2]],[[1,2],[3]],[[True,0],[0,1]],
                [[float('inf'),0],[0,1]],[[float('nan'),0],[0,1]],
                [[1e308,0],[0,1e308]]):
        _projection_rejects(m.char_poly_2x2,bad)


def is_diagonalizable_2x2(m):
    huge=10**400
    fixtures=[([[2,1],[0,1]],True), ([[1,1],[0,1]],False), ([[0,-1],[1,0]],False),
              ([[1,0],[0,1]],True), ([[0,0],[0,0]],True), ([[0,1],[0,0]],False),
              ([[huge,1],[0,huge+1]],True), ([[huge,1],[0,huge]],False),
              ([[1,1],[1,1]],True), ([[3,2],[-2,-1]],False)]
    for rows,want in fixtures:
        before=[r[:] for r in rows]
        assert m.is_diagonalizable_2x2(rows) is want
        assert rows==before
    for bad in (None,[],[[1]],[[1,2]],[[1,2],[3]],[[1.,0],[0,1]],
                [[True,0],[0,1]],[[float('nan'),0],[0,1]],[[1,'0'],[0,1]]):
        _projection_rejects(m.is_diagonalizable_2x2,bad)


def rayleigh_quotient(m):
    fixtures = [([[2,1],[1,2]], [2,0], 2), ([[1,0],[0,3]], [1,2], 2.6),
                ([[1,0],[0,-1]], [1,1], 0), ([[0,0],[0,0]], [3,4], 0),
                ([[1,4],[0,1]], [1,-1], -1), ([[7]], [-3], 7),
                ([[1e300,0],[0,3e300]], [1e300,2e300], 2.6e300),
                ([[1,0],[0,3]], [1e-300,2e-300], 2.6)]
    rng = random.Random(707)
    for _ in range(20):
        a = [[rng.uniform(-3,3) for _ in range(3)] for _ in range(3)]
        v = [rng.uniform(-2,2) for _ in range(3)]
        want = sum(v[i]*a[i][j]*v[j] for i in range(3) for j in range(3))/sum(x*x for x in v)
        fixtures.append((a,v,want))
    for a,v,want in fixtures:
        before, old = [r[:] for r in a], v[:]
        got = m.rayleigh_quotient(a,v)
        assert math.isclose(got,want,rel_tol=1e-12,abs_tol=1e-12)
        assert math.isclose(m.rayleigh_quotient(a,[-2*x for x in v]),want,rel_tol=1e-12,abs_tol=1e-12)
        assert a==before and v==old
    for a,v in [(None,[1]), ([],[]), ([[1,2]],[1]), ([[1],[2,3]],[1,1]),
                ([[True]],[1]), ([[1]],[True]), ([[1]],[0]), ([[1]],[]),
                ([[float('nan')]],[1]), ([[1]],[float('inf')]),
                ([[1.7e308,1.7e308],[1.7e308,1.7e308]],[1,1])]:
        _projection_rejects(m.rayleigh_quotient,a,v)


def _spectral_invalid(function):
    for a in (None, [], [[1,2]], [[1],[2,3]], [[True]], [[float('inf')]],
              [[float('nan')]], [[1,'0'],['0',1]], [[1,1],[0,1]],
              [[1,1e-15],[0,1]]):
        _projection_rejects(function,a)
    for tol in (0,-1,True,float('nan'),float('inf'),'small'):
        _projection_rejects(function,[[1]],tol)
    # Distinguish invalid/nonfinite arithmetic from an ordinary rejected pivot.
    _projection_rejects(function,[[1e308]],1e308)
    _projection_rejects(function,[[1,1e200],[1e200,1]],1e-310)


def cholesky(m):
    fixtures = [[[4,2],[2,3]], [[9,3],[3,2]], [[2]],
                [[1e-14,0],[0,1e-14]], [[1,0],[0,1e-10]]]
    rng = random.Random(708)
    for n in (2,3,4):
        lower = [[(rng.uniform(1,3) if i==j else rng.uniform(-1,1)) if j<=i else 0
                  for j in range(n)] for i in range(n)]
        fixtures.append([[sum(lower[i][k]*lower[j][k] for k in range(n))
                          for j in range(n)] for i in range(n)])
    for a in fixtures:
        before = [row[:] for row in a]
        lower = m.cholesky(a)
        n = len(a)
        assert len(lower)==n and all(len(row)==n for row in lower)
        assert all(lower[i][i]>0 for i in range(n))
        assert all(lower[i][j]==0 for i in range(n) for j in range(i+1,n))
        scale = max(abs(x) for row in a for x in row)
        for i in range(n):
            for j in range(n):
                got = sum(lower[i][k]*lower[j][k] for k in range(n))
                assert abs(got-a[i][j]) <= 1e-12*scale
        assert a==before
    for a in ([[0]], [[1,1],[1,1]], [[1,2],[2,1]], [[-1,0],[0,-1]],
              [[1,0],[0,1e-14]], [[1,2,2],[2,1,2],[2,2,1]]):
        old = [row[:] for row in a]
        _projection_rejects(m.cholesky,a)
        assert a==old
    assert m.cholesky([[1,0],[0,1e-14]],1e-16)[1][1]>0
    _spectral_invalid(m.cholesky)


def is_pd(m):
    fixtures = [([[4,2],[2,3]], True), ([[1e-14,0],[0,1e-14]], True),
                ([[1,0],[0,1e-14]], False), ([[0]],False), ([[1,1],[1,1]],False),
                ([[1,2],[2,1]],False), ([[-1,0],[0,-1]],False),
                ([[1,2,2],[2,1,2],[2,2,1]],False), ([[0,0],[0,-1]],False)]
    for a,want in fixtures:
        before = [row[:] for row in a]
        assert m.is_pd(a) is want
        assert a==before
    assert m.is_pd([[1,0],[0,1e-14]],1e-16) is True
    _spectral_invalid(m.is_pd)
