"""Reference implementations for Linear algebra, Part I · Structure (LA01–LA02).

Attempt labs/linalg_structure/exercises.py before reading.
"""
import math


def _validated_columns(vectors, tol):
    columns = [list(column) for column in vectors]
    if (
        isinstance(tol, bool)
        or not isinstance(tol, (int, float))
        or not math.isfinite(tol)
        or tol <= 0.0
    ):
        raise ValueError("tolerance must be strictly positive and finite")
    if columns and len({len(column) for column in columns}) != 1:
        raise ValueError("generators must all have the same length")
    for column in columns:
        for entry in column:
            if (
                isinstance(entry, bool)
                or not isinstance(entry, (int, float))
                or not math.isfinite(entry)
            ):
                raise ValueError("coordinates must be finite numbers")
    return columns


def _eliminate(rows, width, tol):
    """Forward elimination with partial pivoting; returns pivot columns."""
    pivots, row = [], 0
    for column in range(width):
        best = max(range(row, len(rows)), key=lambda r: abs(rows[r][column]), default=None)
        if best is None or abs(rows[best][column]) <= tol:
            continue
        rows[row], rows[best] = rows[best], rows[row]
        for lower in range(row + 1, len(rows)):
            factor = rows[lower][column] / rows[row][column]
            if factor:
                for position in range(column, len(rows[lower])):
                    rows[lower][position] -= factor * rows[row][position]
        pivots.append(column)
        row += 1
        if row == len(rows):
            break
    return pivots


def span_coordinates(vectors, target, tol=1e-9):
    columns = _validated_columns(vectors, tol)
    goal = list(target)
    for entry in goal:
        if (
            isinstance(entry, bool)
            or not isinstance(entry, (int, float))
            or not math.isfinite(entry)
        ):
            raise ValueError("coordinates must be finite numbers")
    if not columns:
        return [] if all(abs(entry) <= tol for entry in goal) else None
    height = len(columns[0])
    if len(goal) != height:
        raise ValueError("target length must match the generator length")

    width = len(columns)
    rows = [[float(columns[j][i]) for j in range(width)] + [float(goal[i])] for i in range(height)]
    pivots = _eliminate(rows, width, tol)
    for index in range(len(pivots), height):
        if abs(rows[index][width]) > tol:
            return None

    coefficients = [0.0] * width
    for index in reversed(range(len(pivots))):
        column = pivots[index]
        total = rows[index][width] - math.fsum(
            rows[index][j] * coefficients[j] for j in range(column + 1, width)
        )
        coefficients[column] = total / rows[index][column]
    residual = max(
        abs(math.fsum(columns[j][i] * coefficients[j] for j in range(width)) - goal[i])
        for i in range(height)
    )
    return coefficients if residual <= tol else None


def dependency_relation(vectors, tol=1e-9):
    columns = _validated_columns(vectors, tol)
    if not columns:
        return None
    height, width = len(columns[0]), len(columns)
    if height == 0:
        raise ValueError("generators must have at least one coordinate")

    rows = [[float(columns[j][i]) for j in range(width)] for i in range(height)]
    pivots = _eliminate(rows, width, tol)
    free = [column for column in range(width) if column not in set(pivots)]
    if not free:
        return None

    target = free[0]
    relation = [0.0] * width
    relation[target] = 1.0
    for index in reversed(range(len(pivots))):
        column = pivots[index]
        if column > target:
            continue
        total = math.fsum(rows[index][j] * relation[j] for j in range(column + 1, width))
        relation[column] = -total / rows[index][column]
    scale = max(abs(value) for value in relation)
    return [value / scale + 0.0 for value in relation]


def basis_coordinates(basis, vector, tol=1e-9):
    columns = _validated_columns(basis, tol)
    point = list(vector)
    for entry in point:
        if (
            isinstance(entry, bool)
            or not isinstance(entry, (int, float))
            or not math.isfinite(entry)
        ):
            raise ValueError("coordinates must be finite numbers")
    width = len(columns)
    if not width or len(columns[0]) != width or len(point) != width:
        raise ValueError("basis must be square and match the vector length")

    rows = [[float(columns[j][i]) for j in range(width)] + [float(point[i])] for i in range(width)]
    pivots = _eliminate(rows, width, tol)
    if len(pivots) < width:
        raise ValueError("columns do not form a basis at this tolerance")

    determinant = 1.0
    for index in range(width):
        determinant *= rows[index][index]
    norms = [math.sqrt(math.fsum(entry * entry for entry in column)) for column in columns]
    ratio = abs(determinant)
    for norm in norms:
        ratio /= norm

    coordinates = [0.0] * width
    for index in reversed(range(width)):
        total = rows[index][width] - math.fsum(
            rows[index][j] * coordinates[j] for j in range(index + 1, width)
        )
        coordinates[index] = total / rows[index][index]
    return coordinates, ratio


def _validated_matrix(matrix, tol, square=False):
    try:
        rows = [list(row) for row in matrix]
    except TypeError as error:
        raise ValueError("matrix must be a sequence of rows") from error
    if (
        isinstance(tol, bool)
        or not isinstance(tol, (int, float))
        or not math.isfinite(tol)
        or tol <= 0.0
    ):
        raise ValueError("tolerance must be strictly positive and finite")
    if not rows or not rows[0]:
        raise ValueError("at least one row and one column required")
    if len({len(row) for row in rows}) != 1:
        raise ValueError("rows must all have the same length")
    for row in rows:
        for entry in row:
            if (
                isinstance(entry, bool)
                or not isinstance(entry, (int, float))
                or not math.isfinite(entry)
            ):
                raise ValueError("entries must be finite numbers")
    if square and len(rows) != len(rows[0]):
        raise ValueError("a square matrix is required")
    return [[float(entry) for entry in row] for row in rows]


def _reduce(rows, width, tol):
    """Reduced row echelon form in place; returns the pivot columns."""
    height = len(rows)
    pivots, row = [], 0
    for column in range(width):
        if row == height:
            break
        best = max(range(row, height), key=lambda r: abs(rows[r][column]))
        if abs(rows[best][column]) <= tol:
            continue
        rows[row], rows[best] = rows[best], rows[row]
        pivot = rows[row][column]
        rows[row] = [entry / pivot for entry in rows[row]]
        for other in range(height):
            if other == row:
                continue
            factor = rows[other][column]
            # A small factor can still multiply a large entry. The tolerance
            # decides whether to accept a pivot, not whether to perform a row operation.
            if factor:
                rows[other] = [
                    entry - factor * lead for entry, lead in zip(rows[other], rows[row])
                ]
            rows[other][column] = 0.0
        pivots.append(column)
        row += 1
    return pivots


def row_echelon(matrix, tol=1e-9):
    rows = _validated_matrix(matrix, tol)
    pivots = _reduce(rows, len(rows[0]), tol)
    cleaned = [[0.0 if abs(entry) <= tol else entry for entry in row] for row in rows]
    return cleaned, pivots


def solve_complete(matrix, rhs, tol=1e-9):
    rows = _validated_matrix(matrix, tol)
    goal = list(rhs)
    for entry in goal:
        if (
            isinstance(entry, bool)
            or not isinstance(entry, (int, float))
            or not math.isfinite(entry)
        ):
            raise ValueError("right-hand side must hold finite numbers")
    if len(goal) != len(rows):
        raise ValueError("right-hand side must match the number of rows")

    width = len(rows[0])
    augmented = [row + [float(value)] for row, value in zip(rows, goal)]
    pivots = _reduce(augmented, width, tol)
    for index in range(len(pivots), len(augmented)):
        if abs(augmented[index][width]) > tol:
            return None

    particular = [0.0] * width
    for index, column in enumerate(pivots):
        particular[column] = augmented[index][width]

    free = [column for column in range(width) if column not in set(pivots)]
    basis = []
    for column in free:
        vector = [0.0] * width
        vector[column] = 1.0
        for index, pivot in enumerate(pivots):
            vector[pivot] = -augmented[index][column]
        basis.append(vector)
    return particular, basis


def lu_factor(matrix, tol=1e-9):
    rows = _validated_matrix(matrix, tol, square=True)
    size = len(rows)
    perm = list(range(size))
    lower = [[0.0] * size for _ in range(size)]
    upper = [row[:] for row in rows]

    for column in range(size):
        best = max(range(column, size), key=lambda r: abs(upper[r][column]))
        if best != column:
            upper[column], upper[best] = upper[best], upper[column]
            lower[column], lower[best] = lower[best], lower[column]
            perm[column], perm[best] = perm[best], perm[column]
        pivot = upper[column][column]
        if abs(pivot) <= tol:
            continue
        for row in range(column + 1, size):
            factor = upper[row][column] / pivot
            lower[row][column] = factor
            if factor:
                for position in range(column, size):
                    upper[row][position] -= factor * upper[column][position]
            upper[row][column] = 0.0
    for index in range(size):
        lower[index][index] = 1.0
    return perm, lower, upper
