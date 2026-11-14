"""Behavioral checks for Linear algebra, Part I · Structure (LA01–LA02).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import math
import random

from labs.check_helpers import close


def combine(columns, coefficients):
    height = len(columns[0])
    return [
        math.fsum(columns[j][i] * coefficients[j] for j in range(len(columns)))
        for i in range(height)
    ]


def span(m):
    standard = [[1., 0.], [0., 1.]]
    recovered = m.span_coordinates(standard, [3., -1.])
    close(recovered[0], 3.)
    close(recovered[1], -1.)

    dependent = [[1., 2.], [2., 4.]]
    coefficients = m.span_coordinates(dependent, [3., 6.])
    assert coefficients is not None and len(coefficients) == 2
    for actual, expected in zip(combine(dependent, coefficients), [3., 6.]):
        close(actual, expected)
    assert m.span_coordinates(dependent, [4., 5.]) is None

    assert m.span_coordinates([], [0., 0.]) == []
    assert m.span_coordinates([], [1., 0.]) is None

    plane = [[1., 0., 0.], [0., 1., 0.]]
    inside = m.span_coordinates(plane, [2., -3., 0.])
    close(inside[0], 2.)
    close(inside[1], -3.)
    assert m.span_coordinates(plane, [2., -3., 1e-3]) is None

    wide = [[1., 0.], [0., 1.], [1., 1.]]
    spread = m.span_coordinates(wide, [5., 4.])
    assert spread is not None and len(spread) == 3
    for actual, expected in zip(combine(wide, spread), [5., 4.]):
        close(actual, expected)

    near = [[1., 1.]]
    assert m.span_coordinates(near, [1., 1. + 1e-6]) is None
    loose = m.span_coordinates(near, [1., 1. + 1e-6], 1e-3)
    assert loose is not None
    close(loose[0], 1., 1e-3)

    generators = [[1., 0.], [0., 1.]]
    goal = [3., -1.]
    before = [column[:] for column in generators], goal[:]
    m.span_coordinates(generators, goal)
    assert ([column[:] for column in generators], goal[:]) == before

    invalid_cases = [
        ([[1., 0.], [0.]], [1., 1.], 1e-9),
        ([[1., 0.], [0., float("nan")]], [1., 1.], 1e-9),
        ([[1., 0.], [0., 1.]], [1., float("inf")], 1e-9),
        ([[1., 0.], [0., 1.]], [1., 1., 1.], 1e-9),
        ([[1., 0.], [0., 1.]], [1., 1.], 0.),
        ([[1., 0.], [0., 1.]], [1., 1.], -1e-9),
    ]
    for columns, goal, tol in invalid_cases:
        try:
            m.span_coordinates(columns, goal, tol)
        except ValueError:
            continue
        raise AssertionError("invalid span query should be rejected")


def dependence(m):
    assert m.dependency_relation([[1., 0.], [0., 1.]]) is None
    assert m.dependency_relation([[1., 0., 1.], [0., 1., 1.]]) is None
    assert m.dependency_relation([]) is None

    for columns in (
        [[1., 2.], [1., 2.]],
        [[1., 2.], [0., 0.]],
        [[1., 0., 0.], [0., 1., 0.], [1., 1., 0.]],
        [[1., 2.], [3., 7.], [4., 5.]],
    ):
        relation = m.dependency_relation(columns)
        assert relation is not None and len(relation) == len(columns)
        close(max(abs(value) for value in relation), 1.)
        for entry in combine(columns, relation):
            close(entry, 0.)

    random.seed(11235)
    for _ in range(5):
        columns = [[random.gauss(0., 1.) for _ in range(5)] for _ in range(6)]
        relation = m.dependency_relation(columns)
        assert relation is not None, "k > n must always admit a relation"
        close(max(abs(value) for value in relation), 1.)
        for entry in combine(columns, relation):
            close(entry, 0., 1e-7)

    columns = [[1., 2.], [2., 4.]]
    before = [column[:] for column in columns]
    m.dependency_relation(columns)
    assert [column[:] for column in columns] == before

    invalid_cases = [
        ([[1., 0.], [0.]], 1e-9),
        ([[1., 0.], [0., float("nan")]], 1e-9),
        ([[], []], 1e-9),
        ([[1., 0.], [0., 1.]], 0.),
    ]
    for columns, tol in invalid_cases:
        try:
            m.dependency_relation(columns, tol)
        except ValueError:
            continue
        raise AssertionError("invalid generator set should be rejected")


def coordinates(m):
    plain, ratio = m.basis_coordinates([[1., 0.], [0., 1.]], [3., -1.])
    close(plain[0], 3.)
    close(plain[1], -1.)
    close(ratio, 1.)

    skewed, skew_ratio = m.basis_coordinates([[1., 0.], [1., 1.]], [3., 2.])
    close(skewed[0], 1.)
    close(skewed[1], 2.)
    close(skew_ratio, 1. / math.sqrt(2.))

    angle = 1.0
    rotated = [[math.cos(angle), math.sin(angle)], [-math.sin(angle), math.cos(angle)]]
    turned, turned_ratio = m.basis_coordinates(rotated, [2., 3.])
    close(turned_ratio, 1.)
    for actual, expected in zip(combine(rotated, turned), [2., 3.]):
        close(actual, expected)

    random.seed(271828)
    for _ in range(5):
        columns = [[random.gauss(0., 1.) for _ in range(4)] for _ in range(4)]
        point = [random.gauss(0., 1.) for _ in range(4)]
        found, measure = m.basis_coordinates(columns, point)
        for actual, expected in zip(combine(columns, found), point):
            close(actual, expected, 1e-7)
        assert 0. < measure <= 1. + 1e-9

    previous = 1.1
    for theta in (1.2, 0.8, 0.4, 0.2, 0.05):
        closing = [[1., 0.], [math.cos(theta), math.sin(theta)]]
        _, measure = m.basis_coordinates(closing, [1., 1.])
        close(measure, math.sin(theta))
        assert measure < previous, "degeneracy measure must fall as the basis closes"
        previous = measure

    columns = [[1., 0.], [1., 1.]]
    point = [3., 2.]
    before = [column[:] for column in columns], point[:]
    m.basis_coordinates(columns, point)
    assert ([column[:] for column in columns], point[:]) == before

    invalid_cases = [
        ([[1., 0.], [2., 0.]], [1., 1.], 1e-9),
        ([[1., 0., 0.], [0., 1., 0.]], [1., 1., 1.], 1e-9),
        ([[1., 0.], [0., 1.]], [1., 1., 1.], 1e-9),
        ([[1., 0.], [0., float("inf")]], [1., 1.], 1e-9),
        ([], [1.], 1e-9),
        ([[1., 0.], [0., 1.]], [1., 1.], 0.),
    ]
    for columns, point, tol in invalid_cases:
        try:
            m.basis_coordinates(columns, point, tol)
        except ValueError:
            continue
        raise AssertionError("invalid basis query should be rejected")


def matvec(matrix, vector):
    return [math.fsum(a * b for a, b in zip(row, vector)) for row in matrix]


def echelon(m):
    form, pivots = m.row_echelon([[1., 2., 1.], [2., 3., -1.], [3., 5., 0.]])
    assert pivots == [0, 1]
    for row, expected in zip(form, [[1., 0., -5.], [0., 1., 3.], [0., 0., 0.]]):
        for actual, want in zip(row, expected):
            close(actual, want, 1e-7)

    identity, pivots = m.row_echelon([[2., 0.], [0., -3.]])
    assert pivots == [0, 1]
    for row, expected in zip(identity, [[1., 0.], [0., 1.]]):
        for actual, want in zip(row, expected):
            close(actual, want)

    wide, pivots = m.row_echelon([[0., 1., 2.], [0., 2., 4.]])
    assert pivots == [1], pivots
    for actual, want in zip(wide[0], [0., 1., 2.]):
        close(actual, want)
    for entry in wide[1]:
        close(entry, 0.)

    zero, pivots = m.row_echelon([[0., 0.], [0., 0.]])
    assert pivots == []
    assert all(abs(entry) < 1e-12 for row in zero for entry in row)

    # reduced row echelon form is unique, so reducing twice changes nothing
    once, _ = m.row_echelon([[1., 2., 3.], [4., 5., 6.], [7., 8., 9.]])
    twice, _ = m.row_echelon(once)
    for row_a, row_b in zip(once, twice):
        for a, b in zip(row_a, row_b):
            close(a, b, 1e-7)

    # a pivot below the tolerance is treated as zero
    _, coarse = m.row_echelon([[1., 0.], [0., 1e-12]], 1e-9)
    assert coarse == [0]

    # A tiny elimination factor times a large entry must still be subtracted.
    scaled, pivots = m.row_echelon([[1., 1e10], [1e-10, 2.]])
    assert pivots == [0, 1]
    for row, expected in zip(scaled, [[1., 0.], [0., 1.]]):
        for actual, want in zip(row, expected):
            close(actual, want)

    original = [[1., 2.], [3., 4.]]
    before = [row[:] for row in original]
    m.row_echelon(original)
    assert [row[:] for row in original] == before

    invalid_cases = [
        ([[1., 2.], [3.]], 1e-9),
        ([], 1e-9),
        ([[]], 1e-9),
        ([[1., float("nan")]], 1e-9),
        ([[1., 2.]], 0.),
        ([[1., 2.]], -1.),
    ]
    for rows, tol in invalid_cases:
        try:
            m.row_echelon(rows, tol)
        except ValueError:
            continue
        raise AssertionError("invalid matrix should be rejected")


def solve_complete(m):
    matrix = [[1., 2., 1.], [2., 3., -1.], [3., 5., 0.]]
    particular, basis = m.solve_complete(matrix, [4., 3., 7.])
    assert len(basis) == 1, "rank 2 with 3 columns leaves one free variable"
    for actual, want in zip(matvec(matrix, particular), [4., 3., 7.]):
        close(actual, want, 1e-7)
    for entry in matvec(matrix, basis[0]):
        close(entry, 0., 1e-7)
    assert any(abs(value) > 1e-9 for value in basis[0]), "a null-space basis vector must be nonzero"

    assert m.solve_complete(matrix, [4., 3., 9.]) is None

    unique, empty = m.solve_complete([[1., 0.], [0., 2.]], [3., 8.])
    close(unique[0], 3.)
    close(unique[1], 4.)
    assert empty == []

    # This exactly representable fixture exposes skipped small factors without
    # confusing the regression with rounding in the right-hand side.
    large = float(2 ** 40)
    point, kernel = m.solve_complete([[1., large], [1 / large, 2.]], [large, 2.])
    close(point[0], 0.)
    close(point[1], 1.)
    assert kernel == []

    # rank + nullity = number of columns, on a wide system
    wide = [[1., 1., 1., 1.], [1., 2., 3., 4.]]
    point, kernel = m.solve_complete(wide, [2., 5.])
    assert len(kernel) == 2
    for actual, want in zip(matvec(wide, point), [2., 5.]):
        close(actual, want, 1e-7)
    for vector in kernel:
        for entry in matvec(wide, vector):
            close(entry, 0., 1e-7)
    combined = [
        [vector[i] for vector in kernel] for i in range(4)
    ]
    assert any(abs(combined[i][0] * combined[j][1] - combined[i][1] * combined[j][0]) > 1e-9
               for i in range(4) for j in range(4)), "null-space basis vectors must be independent"

    zero_rhs = m.solve_complete([[1., 1.]], [0.])
    assert zero_rhs is not None
    for entry in zero_rhs[0]:
        close(entry, 0.)

    matrix_before = [row[:] for row in matrix]
    rhs = [4., 3., 7.]
    rhs_before = rhs[:]
    m.solve_complete(matrix, rhs)
    assert [row[:] for row in matrix] == matrix_before and rhs == rhs_before

    invalid_cases = [
        ([[1., 2.], [3., 4.]], [1.], 1e-9),
        ([[1., 2.], [3.]], [1., 2.], 1e-9),
        ([[1., 2.], [3., 4.]], [1., float("inf")], 1e-9),
        ([[1., 2.], [3., 4.]], [1., 2.], 0.),
    ]
    for rows, goal, tol in invalid_cases:
        try:
            m.solve_complete(rows, goal, tol)
        except ValueError:
            continue
        raise AssertionError("invalid system should be rejected")


def lu(m):
    def check_factors(matrix):
        perm, lower, upper = m.lu_factor(matrix)
        size = len(matrix)
        assert sorted(perm) == list(range(size)), "perm must be a permutation of the row indices"
        for i in range(size):
            close(lower[i][i], 1.)
            for j in range(size):
                if j > i:
                    close(lower[i][j], 0.)
                    continue
                if j < i:
                    assert abs(lower[i][j]) <= 1. + 1e-9, "partial pivoting keeps multipliers at most 1"
                if i > j:
                    close(upper[i][j], 0.)
        for i in range(size):
            for j in range(size):
                product = math.fsum(lower[i][k] * upper[k][j] for k in range(size))
                close(product, float(matrix[perm[i]][j]), 1e-7)

    check_factors([[0., 1.], [2., 3.]])
    check_factors([[2., 1., 1.], [4., -6., 0.], [-2., 7., 2.]])
    check_factors([[1e-12, 1.], [1., 1.]])
    check_factors([[1., 2.], [2., 4.]])

    perm, lower, upper = m.lu_factor([[1., 0.], [0., 1.]])
    assert perm == [0, 1]
    close(upper[0][0], 1.)
    close(lower[1][0], 0.)

    original = [[4., 3.], [6., 3.]]
    before = [row[:] for row in original]
    m.lu_factor(original)
    assert [row[:] for row in original] == before

    invalid_cases = [
        ([[1., 2., 3.], [4., 5., 6.]], 1e-9),
        ([[1., 2.], [3.]], 1e-9),
        ([], 1e-9),
        ([[1., float("nan")], [0., 1.]], 1e-9),
        ([[1., 0.], [0., 1.]], 0.),
    ]
    for rows, tol in invalid_cases:
        try:
            m.lu_factor(rows, tol)
        except ValueError:
            continue
        raise AssertionError("invalid matrix should be rejected")
