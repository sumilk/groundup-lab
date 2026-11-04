"""LA10 B4 reference: ridge by normal equations, stacked least squares, and the SVD filter."""
import numpy as np
rng = np.random.default_rng(2)
m, n = 200, 20
U, _ = np.linalg.qr(rng.standard_normal((m, n))); V, _ = np.linalg.qr(rng.standard_normal((n, n)))
s = np.logspace(0, -8, n)
A = U @ np.diag(s) @ V.T
xtrue = np.ones(n)
r = rng.standard_normal(m); r -= U @ (U.T @ r); r *= 1e-6 / np.linalg.norm(r)   # residual orthogonal to range(A)
b = A @ xtrue + r
assert np.all(np.isfinite(A)) and np.all(np.isfinite(b))  # NumPy 2.0 with Apple Accelerate can raise spurious matmul warnings
print("kappa2(A)", f"{s[0]/s[-1]:.2e}")
for lam in (1e-12, 1e-4):
    ref = V @ (s / (s ** 2 + lam) * (U.T @ b))            # filter formula from the known factors
    ne = np.linalg.solve(A.T @ A + lam * np.eye(n), A.T @ b)
    st = np.linalg.lstsq(np.vstack([A, np.sqrt(lam) * np.eye(n)]), np.concatenate([b, np.zeros(n)]), rcond=None)[0]
    kr = (s[0] ** 2 + lam) / (s[-1] ** 2 + lam)
    rel = lambda z: np.linalg.norm(z - ref) / np.linalg.norm(ref)
    print(f"lambda {lam:.0e}: kappa(AtA+lam I) {kr:.2e}, stacked {np.sqrt(kr):.2e}; "
          f"relative difference from filter: normal equations {rel(ne):.2e}, stacked lstsq {rel(st):.2e}")
