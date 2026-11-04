"""LA10 C3 reference: w = u*u - v*v from u0 = v0 = alpha*1, small-step gradient descent."""
import torch
torch.manual_seed(3)
m, n = 20, 60
A = torch.randn(m, n, dtype=torch.float64) / m ** 0.5
wstar = torch.zeros(n, dtype=torch.float64); wstar[[3, 17, 41]] = torch.tensor([1.5, -2.0, 1.0], dtype=torch.float64)
b = A @ wstar
l2 = torch.linalg.pinv(A) @ b
print("torch", torch.__version__, f"|w*|_1 {wstar.abs().sum():.3f}  min-l2 solution: |.|_1 {l2.abs().sum():.3f} |.|_2 {l2.norm():.3f}")
for alpha, eta in ((1e-3, 0.05), (1.0, 0.005)):
    u = torch.full((n,), alpha, dtype=torch.float64, requires_grad=True); v = torch.full((n,), alpha, dtype=torch.float64, requires_grad=True)
    for t in range(400000):
        w = u * u - v * v; loss = 0.5 * torch.sum((A @ w - b) ** 2)
        gu, gv = torch.autograd.grad(loss, (u, v))
        with torch.no_grad(): u -= eta * gu; v -= eta * gv
        if loss.item() < 1e-16: break
    w = (u * u - v * v).detach()
    print(f"alpha {alpha:g}, step {eta}, steps {t+1}, residual {torch.norm(A @ w - b).item():.1e}: "
          f"|w|_1 {w.abs().sum():.3f} |w|_2 {w.norm():.3f} distance to w* {torch.norm(w - wstar):.3f} distance to min-l2 {torch.norm(w - l2):.3f}")
