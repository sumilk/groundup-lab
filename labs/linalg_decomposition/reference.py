"""Reference implementations for Linear algebra, Part III · Decomposition and conditioning (LA08–LA10).

Attempt labs/linalg_decomposition/exercises.py before reading.
"""
import math

from labs.linalg_structure.reference import _validated_matrix


def _validated_singular_values(singular_values):
    """Finite, nonnegative, descending nonempty gains; zero total is permitted."""
    try:
        values = list(singular_values)
    except TypeError as error:
        raise ValueError("singular values must be a sequence") from error
    if not values or any(isinstance(v, bool) or not isinstance(v, (int, float))
                         or not math.isfinite(v) or v < 0 for v in values):
        raise ValueError("nonempty finite nonnegative real gains required")
    if any(a < b for a, b in zip(values, values[1:])):
        raise ValueError("singular values must be in descending order")
    return [float(v) for v in values]


def _validated_svd_factors(left, singular_values, right_t):
    """Reduced factors with approximate orthonormality, absolute tolerance 1e-9."""
    u = _validated_matrix(left, 1e-12)
    s = _validated_singular_values(singular_values)
    vt = _validated_matrix(right_t, 1e-12)
    m, p, n = len(u), len(s), len(vt[0])
    if p != min(m, n) or len(u[0]) != p or len(vt) != p:
        raise ValueError("require reduced shapes m by p, p gains, p by n; p=min(m,n)")
    for i in range(p):
        for j in range(p):
            try:
                a = math.fsum(row[i] * row[j] for row in u)
                b = math.fsum(x * y for x, y in zip(vt[i], vt[j]))
            except OverflowError as error:
                raise ValueError("factor validation overflowed") from error
            target = 1.0 if i == j else 0.0
            if not all(math.isfinite(v) and abs(v-target) <= 1e-9 for v in (a,b)):
                raise ValueError("left columns and right rows must be orthonormal")
    return u, s, vt


def svd_2x2(matrix):
    """Scaled Gram geometry and a determinant shortcut; small teaching SVD only."""
    rows = _validated_matrix(matrix, 1e-12, square=True)
    if len(rows) != 2:
        raise ValueError("exactly 2 by 2 input required")
    scale = max(abs(x) for row in rows for x in row)
    if scale == 0:
        return [[1.0,0.0],[0.0,1.0]], [0.0,0.0], [[1.0,0.0],[0.0,1.0]]
    (a,b),(c,d) = [[x/scale for x in row] for row in rows]
    g, h, j = a*a+c*c, a*b+c*d, b*b+d*d
    theta = 0.0 if h == 0 and g == j else math.atan2(2*h,g-j)/2
    co, si = math.cos(theta), math.sin(theta)
    image = [a*co+b*si,c*co+d*si]
    first = math.hypot(*image)
    u = [x/first for x in image]
    determinant = a*d-b*c
    sign = -1.0 if determinant < 0 else 1.0
    left = [[u[0],-sign*u[1]],[u[1],sign*u[0]]]
    gains = [first*scale,abs(determinant)/first*scale]
    right_t = [[co,si],[-si,co]]
    if not all(math.isfinite(v) for v in gains):
        raise ValueError("reported singular value overflowed")
    # Near a tie, roundoff can reverse the two computed gains; swap paired axes.
    if gains[1] > gains[0]:
        gains.reverse()
        right_t.reverse()
        left = [list(reversed(row)) for row in left]
    return left, gains, right_t


def truncate_rank(left, singular_values, right_t, k):
    """Sum the first k supplied reduced-SVD channels, without changing inputs."""
    u, s, vt = _validated_svd_factors(left, singular_values, right_t)
    if isinstance(k, bool) or not isinstance(k, int) or not 0 <= k <= len(s):
        raise ValueError("k must be an integer from zero through the number of gains")
    try:
        result = [[math.fsum(u[i][a] * s[a] * vt[a][j] for a in range(k))
                   for j in range(len(vt[0]))] for i in range(len(u))]
    except OverflowError as error:
        raise ValueError("truncation arithmetic overflowed") from error
    if not all(math.isfinite(v) for row in result for v in row):
        raise ValueError("truncation produced non-finite arithmetic")
    return result


def explained_variance(singular_values):
    """Squared-gain fractions and their prefix sums; undefined for zero total."""
    values = _validated_singular_values(singular_values)
    if values[0] == 0:
        raise ValueError("explained variance is undefined for zero total variation")
    weights = [(v/values[0])**2 for v in values]
    total = math.fsum(weights)
    ratios = [v/total for v in weights]
    cumulative = [math.fsum(ratios[:i+1]) for i in range(len(ratios))]
    return ratios, cumulative


def matrix_norm_1_inf(matrix):
    """Induced absolute column/row sums; preserve input and reject overflow."""
    rows = _validated_matrix(matrix, 1e-12)
    try:
        one = max(math.fsum(abs(row[j]) for row in rows)
                  for j in range(len(rows[0])))
        infinity = max(math.fsum(abs(value) for value in row) for row in rows)
    except OverflowError as error:
        raise ValueError("norm outside finite range") from error
    if not math.isfinite(one) or not math.isfinite(infinity):
        raise ValueError("norm outside finite range")
    return one, infinity


def _conditioning_factor(matrix):
    """Supplied small scaled partial-pivot LU; no numerical rank threshold."""
    lu = _validated_matrix(matrix, 1e-12, square=True)
    n = len(lu)
    scale = max(abs(value) for row in lu for value in row)
    if scale == 0:
        return None
    lu = [[value / scale for value in row] for row in lu]
    norm_inf = max(math.fsum(abs(value) for value in row) for row in lu)
    permutation = list(range(n))
    for k in range(n):
        pivot = max(range(k, n), key=lambda i: abs(lu[i][k]))
        if lu[pivot][k] == 0:
            return None
        lu[k], lu[pivot] = lu[pivot], lu[k]
        permutation[k], permutation[pivot] = permutation[pivot], permutation[k]
        for i in range(k + 1, n):
            lu[i][k] /= lu[k][k]
            for j in range(k + 1, n):
                lu[i][j] -= lu[i][k] * lu[k][j]
                if not math.isfinite(lu[i][j]):
                    raise ValueError("factor arithmetic outside finite range")
    return lu, permutation, norm_inf


def _conditioning_solve(lu, permutation, rhs):
    """Supplied solve for the scaled matrix; factors and rhs are preserved."""
    n = len(lu)
    result = [rhs[permutation[i]] for i in range(n)]
    try:
        for i in range(n):
            result[i] -= math.fsum(lu[i][j] * result[j] for j in range(i))
        for i in range(n - 1, -1, -1):
            result[i] = (result[i] - math.fsum(
                lu[i][j] * result[j] for j in range(i + 1, n))) / lu[i][i]
            if not math.isfinite(result[i]):
                raise ValueError("solve arithmetic outside finite range")
    except OverflowError as error:
        raise ValueError("solve arithmetic outside finite range") from error
    return result


def condition_estimate(matrix):
    """Estimate kappa-infinity with n scaled solves; inf for a zero pivot."""
    factors = _conditioning_factor(matrix)
    if factors is None:
        return math.inf
    lu, permutation, norm_inf = factors
    n = len(lu)
    row_sums = [0.0] * n
    for j in range(n):
        rhs = [float(i == j) for i in range(n)]
        column = _conditioning_solve(lu, permutation, rhs)
        for i in range(n):
            row_sums[i] += abs(column[i])
    estimate = norm_inf * max(row_sums)
    if not math.isfinite(estimate):
        raise ValueError("condition estimate outside finite range")
    return estimate


def cancellation_demo(t):
    """Return direct and rationalized sqrt(1+t)-1 for finite t >= 0."""
    if (isinstance(t, bool) or not isinstance(t, (int, float))
            or not math.isfinite(t) or t < 0):
        raise ValueError("t must be a finite nonnegative real number")
    root = math.sqrt(1.0 + t)
    return root - 1.0, t / (root + 1.0)


def _validated_compact_svd(m, n, left, singular_values, right_t):
    """Compact SVD (m, n, U, s, Vt): U is m by r, Vt is r by n, s strictly positive
    and descending, r <= min(m, n). r = 0 is allowed (U rows empty, Vt = []).
    Orthonormality of U's columns and Vt's rows is checked to 1e-9. Returns copies."""
    for name, value in (("m", m), ("n", n)):
        if isinstance(value, bool) or not isinstance(value, int) or value < 1:
            raise ValueError(name + " must be a positive integer")
    def real(v):
        return not isinstance(v, bool) and isinstance(v, (int, float)) and math.isfinite(v)
    if not isinstance(singular_values, (list, tuple)):
        raise ValueError("singular values must be a list or tuple")
    s = list(singular_values)
    if not all(real(v) and v > 0 for v in s):
        raise ValueError("singular values must be finite and strictly positive")
    if any(a < b for a, b in zip(s, s[1:])):
        raise ValueError("singular values must be in descending order")
    r = len(s)
    if r > min(m, n):
        raise ValueError("more singular values than min(m, n)")
    if not isinstance(left, (list, tuple)) or len(left) != m:
        raise ValueError("U must have m rows")
    if not isinstance(right_t, (list, tuple)) or len(right_t) != r:
        raise ValueError("Vt must have r rows")
    u = []
    for row in left:
        if not isinstance(row, (list, tuple)) or len(row) != r or not all(real(v) for v in row):
            raise ValueError("U must be m by r with finite real entries")
        u.append([float(v) for v in row])
    vt = []
    for row in right_t:
        if not isinstance(row, (list, tuple)) or len(row) != n or not all(real(v) for v in row):
            raise ValueError("Vt must be r by n with finite real entries")
        vt.append([float(v) for v in row])
    for i in range(r):
        for j in range(r):
            a = math.fsum(row[i] * row[j] for row in u)
            b = math.fsum(x * y for x, y in zip(vt[i], vt[j]))
            target = 1.0 if i == j else 0.0
            if not (abs(a - target) <= 1e-9 and abs(b - target) <= 1e-9):
                raise ValueError("U columns and Vt rows must be orthonormal")
    return u, [float(v) for v in s], vt


def _validated_tolerance(value, name="tol"):
    """A finite real value >= 0, excluding bools."""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value < 0:
        raise ValueError(name + " must be a finite nonnegative real number")
    return float(value)


def _validated_rhs(b, m):
    """A list or tuple of m finite reals, excluding bools."""
    if not isinstance(b, (list, tuple)) or len(b) != m:
        raise ValueError("b must have m entries")
    if any(isinstance(v, bool) or not isinstance(v, (int, float)) or not math.isfinite(v) for v in b):
        raise ValueError("b entries must be finite real numbers")
    return [float(v) for v in b]


def pinv_via_svd(m, n, left, singular_values, right_t, tol):
    """n by m pseudoinverse of the truncation that keeps channels with sigma > tol."""
    u, s, vt = _validated_compact_svd(m, n, left, singular_values, right_t)
    tol = _validated_tolerance(tol)
    kept = [i for i, sigma in enumerate(s) if sigma > tol]
    try:
        result = [[math.fsum(vt[i][a] * u[b][i] / s[i] for i in kept) for b in range(m)] for a in range(n)]
    except OverflowError as error:
        raise ValueError("pseudoinverse arithmetic overflowed") from error
    if not all(math.isfinite(v) for row in result for v in row):
        raise ValueError("pseudoinverse entries are not finite")
    return result


def ridge_solve(m, n, left, singular_values, right_t, b, lam):
    """Ridge solution: sum of sigma/(sigma^2+lam) (u_i.b) v_i; lam = 0 gives A+ b."""
    u, s, vt = _validated_compact_svd(m, n, left, singular_values, right_t)
    y = _validated_rhs(b, m)
    lam = _validated_tolerance(lam, "lam")
    x = [0.0] * n
    try:
        weights = []
        for i, sigma in enumerate(s):
            beta = math.fsum(u[k][i] * y[k] for k in range(m))
            # Divide by sigma first so sigma**2 cannot underflow the factor away.
            gain = 1.0 / sigma if lam == 0 else 1.0 / (sigma + lam / sigma)
            weights.append(gain * beta)
        x = [math.fsum(weights[i] * vt[i][j] for i in range(len(s))) for j in range(n)]
    except (OverflowError, ZeroDivisionError) as error:
        raise ValueError("ridge arithmetic overflowed") from error
    if not all(math.isfinite(v) for v in x):
        raise ValueError("ridge solution is not finite")
    return x


def min_norm_solution(m, n, left, singular_values, right_t, b, tol):
    """(x, rank_used, residual_norm) for x = A_tol+ b, without forming a matrix.
    The residual b - A x is measured against the full supplied A."""
    u, s, vt = _validated_compact_svd(m, n, left, singular_values, right_t)
    y = _validated_rhs(b, m)
    tol = _validated_tolerance(tol)
    kept = [i for i, sigma in enumerate(s) if sigma > tol]
    try:
        beta = {i: math.fsum(u[k][i] * y[k] for k in range(m)) for i in kept}
        x = [math.fsum(beta[i] / s[i] * vt[i][j] for i in kept) for j in range(n)]
        # A x = sum over kept channels of (u_i.b) u_i, since A v_i = sigma_i u_i.
        residual = [y[k] - math.fsum(beta[i] * u[k][i] for i in kept) for k in range(m)]
        norm = math.hypot(*residual) if residual else 0.0
    except OverflowError as error:
        raise ValueError("solution arithmetic overflowed") from error
    if not all(math.isfinite(v) for v in x) or not math.isfinite(norm):
        raise ValueError("solution is not finite")
    return x, len(kept), norm
