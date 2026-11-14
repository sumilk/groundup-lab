"""Behavioral checks for Probability and statistics, Part I · Probability models (PS00–PS04).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import random

from labs.check_helpers import close


def conditional(m):
    weights = {1: 1., 2: 1., 3: 1., 4: 1., 5: 1., 6: 5.}
    before = weights.copy()
    close(m.conditional_probability(weights, {6}, {2, 4, 6}), 5 / 7)
    close(m.conditional_probability(weights, {1, 3, 5}, set(weights)), 3 / 10)
    close(m.conditional_probability(weights, set(), {1}), 0)
    assert weights == before

    invalid_cases = [
        ({}, set(), set()),
        ({"a": -1., "b": 2.}, {"a"}, {"b"}),
        ({"a": float("nan")}, {"a"}, {"a"}),
        ({"a": 0.}, {"a"}, {"a"}),
        ({"a": 1.}, {"missing"}, {"a"}),
        ({"a": 1.}, {"a"}, {"missing"}),
        ({"a": 1., "b": 0.}, {"a"}, {"b"}),
    ]
    for model, event, given in invalid_cases:
        try:
            m.conditional_probability(model, event, given)
        except ValueError:
            continue
        raise AssertionError("invalid finite probability model should be rejected")


def categorical(m):
    weights = [1., 2., 7.]
    before = weights[:]
    first = m.sample_categorical(weights, 200, 314159)
    second = m.sample_categorical(weights, 200, 314159)
    scaled = m.sample_categorical([10., 20., 70.], 200, 314159)
    assert first == second == scaled
    assert weights == before
    assert len(first) == 200 and set(first) <= {0, 1, 2}
    assert first.count(2) > first.count(1) > first.count(0)
    assert m.sample_categorical([0., 5., 0.], 25, 7) == [1] * 25
    assert m.sample_categorical([1.], 0, 7) == []

    random.seed(2718)
    expected_next_global = random.random()
    random.seed(2718)
    m.sample_categorical(weights, 10, 99)
    assert random.random() == expected_next_global, "use local, not global, RNG state"

    invalid_cases = [
        ([], 1, 0),
        ([1., -1.], 1, 0),
        ([1., float("inf")], 1, 0),
        ([0., 0.], 1, 0),
        ([1.], -1, 0),
        ([1.], 1.5, 0),
        ([1.], True, 0),
        ([1.], 1, 2.5),
        ([1.], 1, False),
    ]
    for model, draws, seed in invalid_cases:
        try:
            m.sample_categorical(model, draws, seed)
        except ValueError:
            continue
        raise AssertionError("invalid categorical sampling input should be rejected")


def joint(m):
    weights = {(0, 0): 1., (0, 1): 1., (1, 0): 1., (1, 1): 3.}
    before = weights.copy()
    marginal_x, marginal_y, covariance = m.joint_marginals_covariance(weights)
    assert weights == before
    assert set(marginal_x) == {0, 1} and set(marginal_y) == {0, 1}
    close(marginal_x[0], 1 / 3)
    close(marginal_x[1], 2 / 3)
    close(marginal_y[0], 1 / 3)
    close(marginal_y[1], 2 / 3)
    close(covariance, 1 / 18)

    scaled = {pair: 10 * weight for pair, weight in weights.items()}
    scaled_x, scaled_y, scaled_covariance = m.joint_marginals_covariance(scaled)
    assert marginal_x == scaled_x and marginal_y == scaled_y
    close(covariance, scaled_covariance)

    nonlinear = {(-1., 1.): 1., (0., 0.): 1., (1., 1.): 1.}
    nonlinear_x, nonlinear_y, nonlinear_covariance = m.joint_marginals_covariance(nonlinear)
    close(nonlinear_covariance, 0)
    close(nonlinear_x[-1.], 1 / 3)
    close(nonlinear_y[1.], 2 / 3)

    sparse_x, sparse_y, _ = m.joint_marginals_covariance({(0., 0.): 0., (1., 2.): 4.})
    close(sparse_x[0.], 0)
    close(sparse_x[1.], 1)
    close(sparse_y[0.], 0)
    close(sparse_y[2.], 1)

    invalid_cases = [
        {},
        {(1.,): 1.},
        {(1., 2., 3.): 1.},
        {("x", 1.): 1.},
        {(True, 1.): 1.},
        {(float("inf"), 1.): 1.},
        {(1., 2.): -1.},
        {(1., 2.): float("nan")},
        {(1., 2.): 0.},
    ]
    for model in invalid_cases:
        try:
            m.joint_marginals_covariance(model)
        except ValueError:
            continue
        raise AssertionError("invalid finite joint distribution should be rejected")


def convolution(m):
    left = {1: 1., 2: 1., 3: 1., 4: 1., 5: 1., 6: 1.}
    right = left.copy()
    before_left, before_right = left.copy(), right.copy()
    result = m.discrete_convolution(left, right)
    assert left == before_left and right == before_right
    close(sum(result.values()), 1)
    close(result[2], 1 / 36)
    close(result[7], 1 / 6)
    close(result[12], 1 / 36)
    assert result == m.discrete_convolution(
        {value: weight * 10 for value, weight in left.items()},
        {value: weight * 0.5 for value, weight in right.items()},
    )

    sparse = m.discrete_convolution({0: 1., 2: 3.}, {-1: 2., 1: 2.})
    close(sparse[-1], 1 / 8)
    close(sparse[1], 1 / 2)
    close(sparse[3], 3 / 8)
    assert 10 not in m.discrete_convolution({0: 1., 10: 0.}, {0: 1.})

    invalid = [
        ({}, {0: 1.}),
        ({0: 1.}, {}),
        ({"x": 1.}, {0: 1.}),
        ({True: 1.}, {0: 1.}),
        ({float("inf"): 1.}, {0: 1.}),
        ({0: -1.}, {0: 1.}),
        ({0: float("nan")}, {0: 1.}),
        ({0: 0.}, {0: 1.}),
    ]
    for first, second in invalid:
        try:
            m.discrete_convolution(first, second)
        except ValueError:
            continue
        raise AssertionError("invalid convolution input should be rejected")


def gaussian(m):
    mean, variance = m.condition_bivariate_gaussian(70., 50., 16., 25., 12., 60.)
    close(mean, 74.8)
    close(variance, 10.24)

    mean, variance = m.condition_bivariate_gaussian(3., -2., 4., 9., 0., 100.)
    close(mean, 3.)
    close(variance, 4.)

    mean, variance = m.condition_bivariate_gaussian(0., 0., 1., 4., -1., 2.)
    close(mean, -0.5)
    close(variance, 0.75)

    invalid = [
        (0., 0., 0., 1., 0., 0.),
        (0., 0., 1., -1., 0., 0.),
        (0., 0., 1., 1., 1., 0.),
        (0., 0., 1., 1., 2., 0.),
        (0., 0., 1., 1., float("nan"), 0.),
        (True, 0., 1., 1., 0., 0.),
    ]
    for args in invalid:
        try:
            m.condition_bivariate_gaussian(*args)
        except ValueError:
            continue
        raise AssertionError("invalid Gaussian parameters should be rejected")
