"""LA10 B1 reference: rank conventions of pinv, matrix_rank and lstsq at their defaults."""
import numpy as np
print("numpy", np.__version__)
A = np.diag([1.0, 1e-10, 1e-15, 1e-17])
s = np.linalg.svd(A, compute_uv=False)
eps = np.finfo(float).eps
P = np.linalg.pinv(A)
print("pinv rank (nonzero singular values of pinv):", int(np.sum(np.linalg.svd(P, compute_uv=False) > 0)))
print("matrix_rank default:", np.linalg.matrix_rank(A), " threshold", s.max() * max(A.shape) * eps)
print("lstsq rank default:", np.linalg.lstsq(A, np.ones(4), rcond=None)[2], " threshold", eps * max(A.shape) * s.max())
print("absolute tolerance 1e-8 rank:", int(np.sum(s > 1e-8)))
