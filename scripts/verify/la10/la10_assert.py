"""Assert the LA10 plan's worked-example values (§1–5, §7.2, Lab C). Stdlib only; exits non-zero on mismatch."""
from fractions import Fraction as F
import math

def mm(A, B): return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]
def T(A): return [list(r) for r in zip(*A)]
def mv(A, x): return [sum(a * b for a, b in zip(r, x)) for r in A]
def fr(rows, d=1): return [[F(v, d) for v in r] for r in rows]

# §1 opening: (1,2)+t(2,-1), norm^2 = 5+5t^2
assert all(1 * (1 + 2 * t) + 2 * (2 - t) == 5 for t in range(-3, 4))
# §1 2x3 by perpendicularity: t=5/3
t = F(5, 3); x = [2 - t, 3 - t, t]
assert x == [F(1, 3), F(4, 3), F(5, 3)] and sum(v * v for v in x) == F(14, 3)
assert -(2 - t) - (3 - t) + t == 0 and sum(v * v for v in [2, 3, 0]) == 13
# §2 duplicate columns -> (1/10,1/10); projection-only case
A = fr([[1, 2], [2, 4], [0, 0]]); b = [F(1)] * 3; xs = [F(3, 25), F(6, 25)]
assert mv(A, xs) == [F(3, 5), F(6, 5), 0]
r = [bi - ai for bi, ai in zip(b, mv(A, xs))]; assert r == [F(2, 5), F(-1, 5), 1] and mv(T(A), r) == [0, 0]
# §3 channel-by-channel
U = fr([[1, 2, 2], [2, 1, -2], [2, -2, 1]], 3); V = fr([[2, -1, 2], [2, 2, -1], [-1, 2, 2]], 3); s = [6, 3, 0]
u = T(U); v = T(V)
c = [sum(a * bb for a, bb in zip(u[i], b)) for i in range(3)]
assert c == [F(5, 3), F(1, 3), F(1, 3)]
xd = [c[0] / 6 * v[0][j] + c[1] / 3 * v[1][j] for j in range(3)]
assert [c[0] / 6, c[1] / 3] == [F(5, 18), F(1, 9)] and xd == [F(4, 27), F(7, 27), F(-1, 54)]
assert [c[2] * u[2][j] for j in range(3)] == [F(2, 9), F(-2, 9), F(1, 9)]
A = mm(mm(U, [[6, 0, 0], [0, 3, 0], [0, 0, 0]]), T(V)); assert A == fr([[2, 8, 2], [7, 10, -2], [10, 4, -8]], 3)
Ap = mm(mm(V, [[F(1, 6), 0, 0], [0, F(1, 3), 0], [0, 0, 0]]), T(U)); assert Ap == fr([[-2, 2, 8], [10, 8, -4], [7, 2, -10]], 54)
P, Q = mm(A, Ap), mm(Ap, A)
assert mm(P, A) == A and mm(Ap, P) == Ap and P == T(P) and Q == T(Q)
# §5 RHS bound proof check on near-collinear fit is numeric; check sigmas and f-values (§7.2)
X = [[1, 1], [2, 2.01], [3, 2.99]]; G = mm(T(X), X); tr = G[0][0] + G[1][1]; det = G[0][0] * G[1][1] - G[0][1] ** 2
l1 = (tr + math.sqrt(tr * tr - 4 * det)) / 2; l2 = det / l1
assert abs(math.sqrt(l2) - 0.0098233) < 5e-7 and abs(l2 - 0.0000964971) < 5e-10
assert abs(l1 / (l1 + 0.01) - 0.99964) < 5e-6 and abs(l2 / (l2 + 0.01) - 0.00956) < 5e-5
# §5.2 bound holds on the hook perturbation (exact fit: cos(theta)=1)
dx = math.hypot(-4 + 3, 6 - 5); xn = math.hypot(-3, 5); db = math.hypot(0.01, 0.01); bn = math.sqrt(4 + 4.05 ** 2 + 5.95 ** 2)
assert dx / xn <= math.sqrt(l1 / l2) * db / bn
# §6 amplified noise -10, recovered -9.9
assert F(-1, 10**3) / F(1, 10**4) == -10 and (F(1, 10**5) - F(1, 10**3)) / F(1, 10**4) == F(-99, 10)
# Lab C counterexample: diag(1,0.001), b=(0,1), tol=0.01 -> x=0, residual (0,1), not orthogonal to range = R^2
x = [0.0 if sv <= 0.01 else bb / sv for sv, bb in zip([1, 0.001], [0, 1])]
assert x == [0, 0] and [0 - 0, 1 - 0] == [0, 1]
# §10 GD: sigma1^2 = 3 for [[1,0,1],[0,1,1]]
AA = mm([[1, 0, 1], [0, 1, 1]], T([[1, 0, 1], [0, 1, 1]])); assert AA == [[2, 1], [1, 2]]  # eigenvalues 3, 1
print("LA10 plan assertions: all passed")

# ---- Lesson §0–5 prose values (added when authoring sections 1–5) ----
# §1: other free-variable choice (0,1,2); practice answers
assert mv([[1, 0, 1], [0, 1, 1]], [0, 1, 2]) == [2, 3]
assert [F(1, 3), F(4, 3)] == mv([[F(2, 3), F(-1, 3)], [F(-1, 3), F(2, 3)]], [2, 3])  # z=(AA^T)^-1 b
assert 3 * 3 - (-1) == 10 and sum(v * v for v in [3, -1]) == 10
assert sum(v * v for v in [2, 2, 2]) == 12 and sum([2 - 2, 2 - 2]) == 0
assert sum(v * v for v in [1, 1, 1]) == 3 and sum(v * v for v in [2, 1, 0]) == 5
# §2 LA03 example and practice
assert F(16, 25) + F(4, 25) == F(4, 5) and F(1, 100) * 2 == F(1, 50)
A = [[1, -1], [-1, 1]]; assert mv(A, [F(1, 2), F(-1, 2)]) == [1, -1] and [2 - 1, 0 - (-1)] == [1, 1]
# §3 row checks of A x† = (7/9, 11/9, 8/9)
A3 = fr([[2, 8, 2], [7, 10, -2], [10, 4, -8]], 3); assert mv(A3, [F(4, 27), F(7, 27), F(-1, 54)]) == [F(7, 9), F(11, 9), F(8, 9)]
assert mv(A3, [F(1, 3), F(1, 3), F(-1, 6)]) == [1, 2, 2]
# §4 projector identities, oblique G, (AB)+ counterexample, Frobenius claim
u3 = [F(2, 3), F(-2, 3), F(1, 3)]; v3 = [F(2, 3), F(-1, 3), F(2, 3)]
I3 = [[F(int(i == j)) for j in range(3)] for i in range(3)]
assert P == [[I3[i][j] - u3[i] * u3[j] for j in range(3)] for i in range(3)]
assert Q == [[I3[i][j] - v3[i] * v3[j] for j in range(3)] for i in range(3)]
A2 = fr([[1, 1], [2, 2]]); Gm = [[F(1, 5), F(2, 5)], [0, 0]]
assert mm(mm(A2, Gm), A2) == A2 and mm(mm(Gm, A2), Gm) == Gm and mm(A2, Gm) == T(mm(A2, Gm)) and mm(Gm, A2) != T(mm(Gm, A2))
w = [F(1, 2), F(9, 10)]; assert mv(mm(Gm, A2), w) == [F(7, 5), 0]
assert math.isclose(math.hypot(0.7, 0.7), 0.99, abs_tol=0.005)
assert F(1, 2) != 1  # B+A+ = 1/2 vs (AB)+ = 1
# §5.1 channel story
X = [[1, 1], [2, 2.01], [3, 2.99]]
assert all(abs(a - b) < 1e-12 for a, b in zip(mv(X, [-4, 4]), [0, 0.04, -0.04]))
assert all(abs(a - b) < 1e-12 for a, b in zip(mv(X, [-1, 1]), [0, 0.01, -0.01]))
s1, s2 = math.sqrt(l1), math.sqrt(l2)
a, bq, c = G[0][0], G[0][1], G[1][1]
v2 = [bq, l2 - a]; nv = math.hypot(*v2); v2 = [v2[0] / nv, v2[1] / nv]
u2 = [sum(X[k][j] * v2[j] for j in range(2)) / s2 for k in range(3)]
d4 = [0, 0.04, -0.04]; c4 = sum(p * q for p, q in zip(u2, d4))
assert abs(abs(c4) - 0.0556) < 5e-5 and abs(math.hypot(*d4) - 0.0566) < 5e-5 and abs(abs(c4 / s2) - 5.66) < 0.01
d1 = [0, 0.01, -0.01]; c1 = sum(p * q for p, q in zip(u2, d1))
assert abs(abs(c1) - 0.0139) < 5e-5 and abs(abs(c1) / math.hypot(*d1) - 0.98) < 0.005
assert abs(1 / s2 - 101.8) < 0.05 and abs(math.hypot(2, 4.05, 5.95) - 7.470) < 5e-4 and abs(math.sqrt(34) - 5.831) < 5e-4
assert abs(538 * 0.00189 - 1.02) < 0.005 and abs((math.sqrt(2) / math.sqrt(34)) / (math.hypot(*d1) / math.hypot(2, 4.05, 5.95)) - 128) < 0.5
# §5 practice
assert abs(10**4 * math.sqrt(3) - 17320) < 1 and 1 / 0.02 == 50
print("LA10 lesson §0–5 assertions: all passed")

# ---- Lesson §6–18 values (added when authoring sections 6–18) ----
s3 = [1.0, 0.1, 1e-4]; b3 = [1.001, 0.049, -0.00099]; c3 = [1.0, 0.5, 0.1]
err_k = lambda k: math.sqrt(sum((((b3[i] / s3[i]) if i < k else 0) - c3[i]) ** 2 for i in range(3)))
assert [round(err_k(k), 4) for k in (1, 2, 3)] == [0.5099, 0.1005, 10.0]
xl = lambda l: [a / (a * a + l) * bb for a, bb in zip(s3, b3)]
er = lambda l: math.sqrt(sum((p - q) ** 2 for p, q in zip(xl(l), c3)))
assert [round(er(l), 3) for l in (1e-8, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2)] == [5.05, 0.198, 0.11, 0.102, 0.114, 0.274]
rho = lambda l: math.sqrt(sum((l / (a * a + l) * bb) ** 2 for a, bb in zip(s3, b3)))
tgt = 1.1 * math.sqrt(3) * 1e-3; lo, hi = 1e-8, 1e-1; seen = []
for _ in range(6):
    mid = math.sqrt(lo * hi); seen.append((round(mid, 7), round(rho(mid), 6)))
    lo, hi = (mid, hi) if rho(mid) < tgt else (lo, mid)
assert [round(r, 5) for _, r in seen] == [0.001, 0.00767, 0.00153, 0.00321, 0.00214, 0.00178]
# §7.1 duplicate columns: c = 1/(10+λ); §7.3 conditioning numbers for the opening fit
assert abs((l1 + 0.01) / (l2 + 0.01) - 2772) < 2 and abs(math.sqrt((l1 + 0.01) / (l2 + 0.01)) - 52.65) < 0.05
# §10 GD worked case, preconditioned limit (−98,103,500)/201, step-size ratios
x = [0.0, 0.0, 0.0]
for _ in range(200):
    r_ = [x[0] + x[2] - 2, x[1] + x[2] - 3]; x = [x[0] - 0.3 * r_[0], x[1] - 0.3 * r_[1], x[2] - 0.3 * (r_[0] + r_[1])]
assert all(abs(a - b) < 1e-12 for a, b in zip(x, [1 / 3, 4 / 3, 5 / 3]))
t = F(-55, 67); assert [F(1, 3) + t, F(4, 3) + t, F(5, 3) - t] == [F(-98, 201), F(103, 201), F(500, 201)]
assert abs(1 - 0.6 * 3 + 0.8) < 1e-12 and abs(1 - 0.8 * 3 + 1.4) < 1e-12
# Exercises
u, v = [1, 2, 2], [3, 4]; assert [F(3 * k, 225) for k in u] == [F(1, 75), F(2, 75), F(2, 75)]
x = [F(2, 3), F(7, 6), F(1, 6)]; assert x[0] + 2 * x[1] == 3 and x[1] - x[2] == 1 and -2 * x[0] + x[1] + x[2] == 0
assert F(1, 6) - F(-1, 6) == F(1, 3)
r5 = lambda l: math.sqrt((l / (16 + l)) ** 2 * 16 + (l / (0.25 + l)) ** 2 * 0.01)
assert r5(1e-4) < 0.05 < r5(1) and r5(1e-2) < 0.05 and r5(1e-1) < 0.05
assert all(abs(1 - (-0.6) ** k - w) < 1e-12 for k, w in ((1, 1.6), (2, 0.64), (3, 1.216)))
assert F(2, 5) + F(8, 5) == 2 and 2 * F(2, 5) == F(8, 5) / 2
print("LA10 lesson §6–18 assertions: all passed")

# ---- §9.3 GCV (stable denominator, 100 per decade, full-precision seeded noise) ----
import random
n = 32; sg = [10 ** (-8 * i / (n - 1)) for i in range(n)]; cg = [v ** 0.5 for v in sg]
rg = random.Random(10); ng = [rg.gauss(0, 1e-4 / math.sqrt(n)) for _ in range(n)]
bg = [a * c + e for a, c, e in zip(sg, cg, ng)]
R2 = lambda l: sum((l / (a * a + l) * bb) ** 2 for a, bb in zip(sg, bg))
G = lambda l: R2(l) / sum(l / (a * a + l) for a in sg) ** 2
Eg = lambda l: math.sqrt(sum((a / (a * a + l) * bb - q) ** 2 for a, bb, q in zip(sg, bg, cg)))
Fg = lambda l: math.sqrt(sum((a * a / (a * a + l) * bb - a * q) ** 2 for a, bb, q in zip(sg, bg, cg)))
ls = [10 ** (-18 + i / 100) for i in range(1801)]; gv = [G(l) for l in ls]
mins = [ls[i] for i in range(1, len(ls) - 1) if gv[i] < gv[i - 1] and gv[i] < gv[i + 1]]
assert len(mins) == 2 and G(mins[0]) < G(mins[1])
assert abs(mins[0] - 7.08e-14) < 1e-15 and abs(Eg(mins[0]) - 67.21) < 0.01 and abs(Fg(mins[0]) - 9.02e-5) < 1e-7
assert abs(mins[1] - 2.24e-7) < 1e-9 and abs(Eg(mins[1]) - 0.0371) < 1e-4 and abs(Fg(mins[1]) - 5.82e-5) < 1e-7
print("LA10 §9.3 GCV assertions: all passed")
