# LA10 experiment references

Reference runs for the NumPy (B1–B4) and PyTorch (C1–C3) exercises of
`content/02-linear-algebra/10-pseudoinverse-regularization.md`. The answer bank
`public/theory/answers/10-pseudoinverse.js` quotes their output.

Recorded with Python 3.9.6, NumPy 2.0.2 and PyTorch 2.8.0 (CPU, float64):

    python b1_tolerances.py
    python -W ignore b3_lcurve_discrepancy.py   # NumPy 2.0 + Apple Accelerate may print spurious matmul warnings

Other versions or BLAS builds can change the last digits of B4's normal-equations
difference and the step counts in C1–C3; the conclusions should not change.

The answer bank itself is built by `scripts/verify/la10/build_answer_bank.py`.
