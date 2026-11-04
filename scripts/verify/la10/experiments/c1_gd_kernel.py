"""LA10 C1 reference: autograd gradient descent from zero and from a random start."""
import torch
torch.manual_seed(0)
A = torch.randn(20, 100, dtype=torch.float64); b = torch.randn(20, dtype=torch.float64)
s1 = torch.linalg.matrix_norm(A, 2); eta = 1.0 / s1 ** 2          # inside 0 < eta <= 1/sigma1^2
pinv_sol = torch.linalg.pinv(A) @ b
def run(x0):
    x = x0.clone().requires_grad_(True)
    for t in range(20000):
        loss = 0.5 * torch.sum((A @ x - b) ** 2)
        g, = torch.autograd.grad(loss, x)
        with torch.no_grad(): x -= eta * g
        if g.norm() < 1e-12: break
    return x.detach(), t + 1
x0 = torch.randn(100, dtype=torch.float64)
kernel_part = x0 - torch.linalg.pinv(A) @ (A @ x0)
print("torch", torch.__version__, "eta", f"{eta.item():.3e}")
for name, start, expect in (("zero", torch.zeros(100, dtype=torch.float64), pinv_sol), ("random", x0, pinv_sol + kernel_part)):
    x, steps = run(start)
    print(f"{name}: steps {steps}, residual {torch.norm(A @ x - b).item():.2e}, "
          f"distance to prediction {torch.norm(x - expect).item():.2e}, distance to pinv solution {torch.norm(x - pinv_sol).item():.2e}")
print(f"norm of kernel part of x0 {kernel_part.norm().item():.3f}")
