"""LA10 B2 reference: Picard plot and truncation sweep for the 12x12 Hilbert matrix."""
import numpy as np
n = 12
H = 1.0 / (np.arange(n)[:, None] + np.arange(n)[None, :] + 1.0)
x = np.ones(n)
rng = np.random.default_rng(0)
e = rng.standard_normal(n); e *= 1e-8 / np.linalg.norm(e)
b = H @ x + e
U, s, Vt = np.linalg.svd(H)
beta = U.T @ b
level = 1e-8 / np.sqrt(n)
for i in range(n):
    print(f"{i+1:2d} sigma {s[i]:.2e} |u.b| {abs(beta[i]):.2e} ratio {abs(beta[i])/s[i]:.2e}")
plateau = next(i for i in range(n) if abs(beta[i]) < 3 * level) + 1
errs = [np.linalg.norm(Vt[:k].T @ (beta[:k] / s[:k]) - x) for k in range(n + 1)]
kbest = int(np.argmin(errs))
print("noise level per channel", f"{level:.2e}", "first channel within 3x noise level:", plateau)
print("best k", kbest, "error", f"{errs[kbest]:.3e}", "error with all", f"{errs[n]:.3e}")
