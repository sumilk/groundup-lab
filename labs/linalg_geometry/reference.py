"""Reference implementations for Linear algebra, Part II · Geometry (LA03–LA07).

Attempt labs/linalg_geometry/exercises.py before reading.
"""
import math

from labs.linalg_structure.reference import _validated_matrix


def _validated_vector(vector, size):
    try:
        values = list(vector)
    except TypeError as error:
        raise ValueError("a vector is required") from error
    if len(values) != size or any(
        isinstance(x, bool) or not isinstance(x, (int, float)) or not math.isfinite(x)
        for x in values
    ):
        raise ValueError("vector must have matching length and finite real entries")
    return [float(x) for x in values]


def _solve_square(matrix, rhs, tol=1e-9):
    """Small partial-pivot solve; rejects pivots at or below absolute tol."""
    rows = _validated_matrix(matrix, tol, square=True)
    goal = _validated_vector(rhs, len(rows))
    n = len(rows)
    rows = [row + [value] for row, value in zip(rows, goal)]
    for k in range(n):
        best = max(range(k, n), key=lambda i: abs(rows[i][k]))
        rows[k], rows[best] = rows[best], rows[k]
        pivot = rows[k][k]
        if not math.isfinite(pivot) or abs(pivot) <= tol:
            raise ValueError("system rejected at the supplied pivot tolerance")
        for i in range(k + 1, n):
            factor = rows[i][k] / pivot
            for j in range(k + 1, n + 1):
                rows[i][j] -= factor * rows[k][j]
            rows[i][k] = 0.0
    result = [0.0] * n
    for i in range(n - 1, -1, -1):
        result[i] = (rows[i][n] - math.fsum(rows[i][j] * result[j] for j in range(i + 1, n))) / rows[i][i]
    if not all(math.isfinite(x) for x in result):
        raise ValueError("solve produced non-finite values")
    return result


def project_onto(basis, vector, tol=1e-9):
    columns = _validated_matrix(basis, tol)
    size, count = len(columns[0]), len(columns)
    target = _validated_vector(vector, size)
    if count > size:
        raise ValueError("a basis cannot have more columns than ambient dimensions")
    gram = [[math.fsum(a * b for a, b in zip(u, v)) for v in columns] for u in columns]
    coefficients = [_solve_square(gram, [u[j] for u in columns], tol) for j in range(size)]
    projector = [[math.fsum(columns[k][i] * coefficients[j][k] for k in range(count))
                  for j in range(size)] for i in range(size)]
    projected = [math.fsum(a * b for a, b in zip(row, target)) for row in projector]
    return projector, projected, [a - b for a, b in zip(target, projected)]


def normal_equations(matrix, target, tol=1e-9):
    rows = _validated_matrix(matrix, tol)
    goal = _validated_vector(target, len(rows))
    width = len(rows[0])
    if width > len(rows):
        raise ValueError("full column rank is required")
    gram = [[math.fsum(row[i] * row[j] for row in rows) for j in range(width)] for i in range(width)]
    rhs = [math.fsum(row[i] * value for row, value in zip(rows, goal)) for i in range(width)]
    coefficients = _solve_square(gram, rhs, tol)
    residual = [value - math.fsum(a * b for a, b in zip(row, coefficients))
                for row, value in zip(rows, goal)]
    return coefficients, residual, math.fsum(x * x for x in residual)


def gram_metric(metric, u, v, tol=1e-9):
    matrix = _validated_matrix(metric, tol, square=True)
    n = len(matrix)
    left, right = _validated_vector(u, n), _validated_vector(v, n)
    if any(matrix[i][j] != matrix[j][i] for i in range(n) for j in range(i)):
        raise ValueError("metric must be symmetric")
    reduced = [row[:] for row in matrix]
    for k in range(n):
        pivot = reduced[k][k]
        if not math.isfinite(pivot) or pivot <= tol:
            raise ValueError("metric is not positive definite at the supplied tolerance")
        for i in range(k + 1, n):
            for j in range(i, n):
                value = reduced[i][j] - reduced[i][k] * reduced[k][j] / pivot
                reduced[i][j] = reduced[j][i] = value
    value = math.fsum(left[i] * matrix[i][j] * right[j] for i in range(n) for j in range(n))
    if not math.isfinite(value):
        raise ValueError("inner product produced a non-finite value")
    return value


def gram_schmidt(matrix, tol=1e-12):
    """Return ((Qc, Rc), (Qm, Rm)); matrices use rows, positive diagonals."""
    rows = _validated_matrix(matrix, tol)
    height, width = len(rows), len(rows[0])
    if width > height:
        raise ValueError("full column rank requires at least as many rows as columns")

    def factor(modified):
        columns, upper = [], [[0.0] * width for _ in range(width)]
        for j in range(width):
            original = [row[j] for row in rows]
            residual = original[:]
            for i, q in enumerate(columns):
                source = residual if modified else original
                upper[i][j] = sum(x * y for x, y in zip(q, source))
                if modified:
                    residual = [x - upper[i][j] * y for x, y in zip(residual, q)]
            if not modified:
                residual = [original[k] - sum(upper[i][j] * q[k]
                            for i, q in enumerate(columns)) for k in range(height)]
            norm = math.hypot(*residual)
            if not math.isfinite(norm) or norm <= tol:
                raise ValueError("column residual rejected at the supplied absolute tolerance")
            upper[j][j] = norm
            columns.append([x / norm for x in residual])
        return [list(row) for row in zip(*columns)], upper

    return factor(False), factor(True)


def qr_solve(matrix, target, tol=1e-12):
    """Least squares using two-pass MGS and back substitution, without a Gram matrix."""
    rows = _validated_matrix(matrix, tol)
    goal = _validated_vector(target, len(rows))
    height, width = len(rows), len(rows[0])
    if width > height:
        raise ValueError("full column rank requires at least as many rows as columns")
    columns, upper = [], [[0.0] * width for _ in range(width)]
    for j in range(width):
        residual = [row[j] for row in rows]
        for _ in range(2):
            for i, q in enumerate(columns):
                correction = math.fsum(x * y for x, y in zip(q, residual))
                upper[i][j] += correction
                residual = [x - correction * y for x, y in zip(residual, q)]
        norm = math.hypot(*residual)
        if not math.isfinite(norm) or norm <= tol:
            raise ValueError("column residual rejected at the supplied absolute tolerance")
        upper[j][j] = norm
        columns.append([x / norm for x in residual])
    rhs = [math.fsum(x * y for x, y in zip(q, goal)) for q in columns]
    coefficients = [0.0] * width
    for i in range(width - 1, -1, -1):
        coefficients[i] = (rhs[i] - math.fsum(upper[i][j] * coefficients[j]
                             for j in range(i + 1, width))) / upper[i][i]
    residual = [b - math.fsum(a * x for a, x in zip(row, coefficients))
                for row, b in zip(rows, goal)]
    error = math.fsum(x * x for x in residual)
    if not all(math.isfinite(x) for x in coefficients + residual + [error]):
        raise ValueError("solve produced non-finite values")
    return coefficients, residual, error


def orthogonality_defect(matrix):
    """Maximum absolute off-diagonal entry of Q^T Q; zero for one column.

    This deliberately does not test unit column lengths.
    """
    rows = _validated_matrix(matrix, 1e-12)
    width = len(rows[0])
    products = [abs(math.fsum(row[i] * row[j] for row in rows))
                for i in range(width) for j in range(i + 1, width)]
    if not all(math.isfinite(x) for x in products):
        raise ValueError("overlap produced non-finite values")
    return max(products, default=0.0)


def det_by_elimination(matrix):
    """Partial-pivoted determinant; computed zero pivots, no rank cutoff."""
    rows = _validated_matrix(matrix, 1e-12, square=True)
    size, sign = len(rows), 1
    for k in range(size):
        best = max(range(k, size), key=lambda i: abs(rows[i][k]))
        if rows[best][k] == 0:
            return 0.0
        if best != k:
            rows[k], rows[best] = rows[best], rows[k]
            sign = -sign
        for i in range(k + 1, size):
            factor = rows[i][k] / rows[k][k]
            rows[i][k] = 0.0
            for j in range(k + 1, size):
                rows[i][j] -= factor * rows[k][j]
                if not math.isfinite(rows[i][j]):
                    raise ValueError("elimination produced non-finite arithmetic")
    result = float(sign)
    for i in range(size):
        result *= rows[i][i]
        if not math.isfinite(result):
            raise ValueError("determinant product overflowed; use sign/log storage")
    return result


def volume_ratio(matrix, basis):
    """Map a nondegenerate source cell and compare ordinary volumes."""
    rows = _validated_matrix(matrix, 1e-12, square=True)
    source = _validated_matrix(basis, 1e-12, square=True)
    if len(rows) != len(source):
        raise ValueError("map and basis must have matching square dimensions")
    before = abs(det_by_elimination(source))
    if before == 0:
        raise ValueError("source cell has computed zero volume")
    try:
        image = [[math.fsum(rows[i][k] * source[k][j] for k in range(len(rows)))
                  for j in range(len(rows))] for i in range(len(rows))]
    except (OverflowError, ValueError) as error:
        raise ValueError("image cell produced non-finite arithmetic") from error
    after = abs(det_by_elimination(image))
    result = after / before
    if not math.isfinite(result):
        raise ValueError("volume ratio produced non-finite arithmetic")
    return result


def cofactor_2x2(matrix):
    """Signed first-row contributions, including entries, and their sum."""
    rows = _validated_matrix(matrix, 1e-12, square=True)
    if len(rows) != 2:
        raise ValueError("exactly two rows and columns required")
    (a, b), (c, d) = rows
    terms = [a * d, -b * c]
    result = sum(terms)
    if not all(math.isfinite(x) for x in terms + [result]):
        raise ValueError("cofactor arithmetic produced non-finite values")
    return terms, result


def power_iteration(matrix, initial, max_iter=200, tol=1e-10):
    """Residual-tested eigenpair search; convergence does not certify dominance."""
    rows = _validated_matrix(matrix, tol, square=True)
    vector = _validated_vector(initial, len(rows))
    if isinstance(max_iter, bool) or not isinstance(max_iter, int) or max_iter < 0:
        raise ValueError("max_iter must be a nonnegative integer")
    size = max(abs(x) for x in vector)
    if size == 0:
        raise ValueError("initial vector must be nonzero")
    vector = [x / size for x in vector]
    norm = math.hypot(*vector)
    vector = [x / norm for x in vector]
    scale = max(abs(x) for row in rows for x in row)
    scaled = [[x / scale if scale else 0.0 for x in row] for row in rows]
    frobenius = math.hypot(*(x for row in scaled for x in row))
    for iteration in range(max_iter + 1):
        image = [math.fsum(a * x for a, x in zip(row, vector)) for row in scaled]
        estimate = math.fsum(x * y for x, y in zip(vector, image))
        residual = math.hypot(*(y - estimate * x for x, y in zip(vector, image)))
        converged = frobenius == 0 or residual / frobenius <= tol
        if converged or iteration == max_iter:
            eigenvalue, absolute_residual = estimate * scale, residual * scale
            if not all(math.isfinite(x) for x in (eigenvalue, absolute_residual)):
                raise ValueError("reported eigenvalue or residual overflowed")
            return {"vector": vector, "eigenvalue": eigenvalue,
                    "residual": absolute_residual, "iterations": iteration,
                    "converged": converged,
                    "reason": "residual" if converged else "max_iter"}
        norm = math.hypot(*image)
        # A computed zero image already has zero residual and returned above.
        vector = [x / norm for x in image]


def char_poly_2x2(matrix):
    """Descending coefficients of det(t I - A), not det(A - t I) in general n."""
    rows = _validated_matrix(matrix, 1e-12, square=True)
    if len(rows) != 2:
        raise ValueError("exactly two rows and columns required")
    (a, b), (c, d) = rows
    coefficients = [1.0, -(a + d), a * d - b * c]
    if not all(math.isfinite(x) for x in coefficients):
        raise ValueError("characteristic coefficients are non-finite")
    return coefficients


def is_diagonalizable_2x2(matrix):
    """Exact classification over R for 2x2 Python integer matrices only."""
    try:
        rows = [list(row) for row in matrix]
    except TypeError as error:
        raise ValueError("matrix must contain two integer rows") from error
    if len(rows) != 2 or any(len(row) != 2 for row in rows):
        raise ValueError("exactly two rows and columns required")
    if any(isinstance(x, bool) or not isinstance(x, int) for row in rows for x in row):
        raise ValueError("exact Python integers required")
    (a, b), (c, d) = rows
    discriminant = (a - d) ** 2 + 4 * b * c
    return discriminant > 0 or (discriminant == 0 and a == d and b == c == 0)


def _validated_symmetric(matrix, tol):
    """Copy finite real square data; require exact symmetry of converted entries."""
    rows = _validated_matrix(matrix, tol, square=True)
    if any(rows[i][j] != rows[j][i]
           for i in range(len(rows)) for j in range(i)):
        raise ValueError("matrix must be symmetric; no triangle is silently discarded")
    return rows


def rayleigh_quotient(matrix, vector):
    """Directional quadratic value, scaled to avoid squaring original lengths."""
    rows = _validated_matrix(matrix, 1e-12, square=True)
    values = _validated_vector(vector, len(rows))
    size = max(abs(x) for x in values)
    if size == 0:
        raise ValueError("Rayleigh quotient requires a nonzero vector")
    values = [x / size for x in values]
    norm = math.hypot(*values)
    values = [x / norm for x in values]
    scale = max(abs(x) for row in rows for x in row)
    if scale == 0:
        return 0.0
    image = [math.fsum((a / scale) * x for a, x in zip(row, values)) for row in rows]
    result = math.fsum(x * y for x, y in zip(values, image)) * scale
    if not math.isfinite(result):
        raise ValueError("Rayleigh quotient produced non-finite arithmetic")
    return result


def cholesky(matrix, tol=1e-12):
    """Positive-diagonal factor with a scale-relative computed-pivot cutoff."""
    rows = _validated_symmetric(matrix, tol)
    n = len(rows)
    cutoff = tol * max(abs(x) for row in rows for x in row)
    if not math.isfinite(cutoff):
        raise ValueError("pivot cutoff overflowed")
    lower = [[0.0] * n for _ in rows]
    try:
        for j in range(n):
            pivot = rows[j][j] - math.fsum(lower[j][k] ** 2 for k in range(j))
            if not math.isfinite(pivot):
                raise ValueError("non-finite pivot arithmetic")
            if pivot <= cutoff:
                raise ValueError("matrix not accepted at supplied relative pivot tolerance")
            lower[j][j] = math.sqrt(pivot)
            for i in range(j + 1, n):
                lower[i][j] = (rows[i][j] - math.fsum(
                    lower[i][k] * lower[j][k] for k in range(j))) / lower[j][j]
                if not math.isfinite(lower[i][j]):
                    raise ValueError("non-finite factor arithmetic")
    except OverflowError as error:
        raise ValueError("factor arithmetic overflowed") from error
    return lower


def is_pd(matrix, tol=1e-12):
    """Numerical acceptance, distinct from malformed input or arithmetic failure."""
    rows = _validated_symmetric(matrix, tol)
    n = len(rows)
    cutoff = tol * max(abs(x) for row in rows for x in row)
    if not math.isfinite(cutoff):
        raise ValueError("pivot cutoff overflowed")
    lower = [[0.0] * n for _ in rows]
    try:
        for j in range(n):
            pivot = rows[j][j] - math.fsum(lower[j][k] ** 2 for k in range(j))
            if not math.isfinite(pivot):
                raise ValueError("non-finite pivot arithmetic")
            if pivot <= cutoff:
                return False
            lower[j][j] = math.sqrt(pivot)
            for i in range(j + 1, n):
                lower[i][j] = (rows[i][j] - math.fsum(
                    lower[i][k] * lower[j][k] for k in range(j))) / lower[j][j]
                if not math.isfinite(lower[i][j]):
                    raise ValueError("non-finite factor arithmetic")
    except OverflowError as error:
        raise ValueError("factor arithmetic overflowed") from error
    return True
