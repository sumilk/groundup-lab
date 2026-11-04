"""LA10 B3 reference: L-curve corner versus the discrepancy principle on a Gaussian blur."""
import numpy as np
n = 64; j = np.arange(n)
A = np.exp(-(j[:, None] - j[None, :]) ** 2 / (2 * 3.0 ** 2)); A /= A.sum(axis=1, keepdims=True)
x = np.exp(-((j - 20) / 6.0) ** 2) + 0.6 * np.exp(-((j - 44) / 4.0) ** 2)
rng = np.random.default_rng(1)
e = rng.standard_normal(n); delta = 1e-3; e *= delta / np.linalg.norm(e)
b = A @ x + e
U, s, Vt = np.linalg.svd(A); beta = U.T @ b
xl = lambda l: Vt.T @ (s / (s ** 2 + l) * beta)
res = lambda l: np.linalg.norm(A @ xl(l) - b)
err = lambda l: np.linalg.norm(xl(l) - x)
def corner(per):
    ls = 10.0 ** np.arange(-14, 0 + 1e-9, 1 / per)
    P = np.array([[np.log10(res(l)), np.log10(np.linalg.norm(xl(l)))] for l in ls])
    best = None
    for i in range(2, len(ls) - 2):
        (x0, y0), (x1, y1), (x2, y2) = P[i - 2], P[i], P[i + 2]
        k = ((x1 - x0) * (y2 - y1) - (y1 - y0) * (x2 - x1)) / (np.sqrt(((x1-x0)**2+(y1-y0)**2)*((x2-x1)**2+(y2-y1)**2)*((x2-x0)**2+(y2-y0)**2)) + 1e-300)
        if best is None or k > best[0]: best = (k, ls[i])
    return best[1]
lo, hi = 1e-14, 1.0
assert res(lo) < 1.1 * delta < res(hi)
for _ in range(200):
    mid = np.sqrt(lo * hi); lo, hi = (mid, hi) if res(mid) < 1.1 * delta else (lo, mid)
ls = 10.0 ** np.arange(-14, 0.001, 0.05); lbest = ls[np.argmin([err(l) for l in ls])]
assert np.all(np.isfinite(b)) and np.all(np.isfinite(beta))  # NumPy 2.0 with Apple Accelerate can raise spurious matmul warnings
print("sigma range", f"{s[0]:.2e} {s[-1]:.2e}", "||x||", f"{np.linalg.norm(x):.3f}")
for per in (10, 20):
    c = corner(per); print(f"L-curve corner ({per}/decade): lambda {c:.2e} error {err(c):.4f}")
print(f"discrepancy: lambda {mid:.2e} error {err(mid):.4f}")
print(f"best in hindsight: lambda {lbest:.2e} error {err(lbest):.4f}")
