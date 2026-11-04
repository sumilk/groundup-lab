"""LA10 C2 reference: SGD weight decay, Adam's coupled L2 penalty, and AdamW's decoupled decay.
Objective: f(w) = ||Xw - y||^2 / (2N) + (lam/2) ||w||^2, minimized by (X^T X / N + lam I) w = X^T y / N."""
import torch
torch.manual_seed(1)
N, d, lam = 200, 5, 0.1
X = torch.randn(N, d, dtype=torch.float64) * torch.tensor([1, 2, 4, 0.5, 1], dtype=torch.float64)
y = X @ torch.tensor([1.0, -2.0, 0.5, 3.0, 0.0], dtype=torch.float64) + 0.1 * torch.randn(N, dtype=torch.float64)
ridge = torch.linalg.solve(X.T @ X / N + lam * torch.eye(d, dtype=torch.float64), X.T @ y / N)
def train(make, steps=40000):
    w = torch.zeros(d, dtype=torch.float64, requires_grad=True); opt = make([w])
    sched = torch.optim.lr_scheduler.LambdaLR(opt, lambda t: 1.0 if t < steps // 2 else 0.01)
    for _ in range(steps):
        opt.zero_grad(); loss = torch.sum((X @ w - y) ** 2) / (2 * N); loss.backward(); opt.step(); sched.step()
    return w.detach()
runs = {
    "SGD, weight_decay=lam (full batch)": train(lambda p: torch.optim.SGD(p, lr=0.02, weight_decay=lam)),
    "Adam, weight_decay=lam (coupled L2)": train(lambda p: torch.optim.Adam(p, lr=1e-2, weight_decay=lam, decoupled_weight_decay=False)),
    "AdamW, weight_decay=lam (decoupled)": train(lambda p: torch.optim.AdamW(p, lr=1e-2, weight_decay=lam)),
}
print("torch", torch.__version__, "ridge", [round(v, 4) for v in ridge.tolist()])
for name, w in runs.items():
    grad = X.T @ (X @ w - y) / N + lam * w
    print(f"{name}: distance to ridge {torch.norm(w - ridge).item():.2e}, ridge-objective gradient norm {grad.norm().item():.2e}")
