"""Run: python -m labs.checks [--reference] [task].
Checks verify behavior, not mastery. Student functions start unimplemented.
"""
import argparse
import importlib
import itertools
import math
import random


def close(actual, expected, tol=1e-8):
    assert math.isclose(actual, expected, rel_tol=tol, abs_tol=tol), (actual, expected)


def moments(m):
    n, mean, variance = m.streaming_moments(iter([1e9, 1e9+1, 1e9+2]))
    assert n == 3
    close(mean, 1e9+1)
    close(variance, 1)
    close(m.streaming_moments(iter([7, 7, 7]))[2], 0)
    for values in ([], [1], [1, float("nan")]):
        try:
            m.streaming_moments(iter(values))
        except ValueError:
            continue
        raise AssertionError("invalid observations should be rejected")


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


def monte_carlo(m):
    values = [1., 3., 5., 7.]
    before = values[:]
    estimate, standard_error = m.batch_means_standard_error(values, 2)
    assert values == before
    close(estimate, 4.)
    close(standard_error, 2.)

    estimate, standard_error = m.batch_means_standard_error(values, 1)
    close(estimate, 4.)
    close(standard_error, math.sqrt(20 / 3) / 2)

    shifted = [1e12 + value for value in [1., 3., 5., 7.]]
    estimate, standard_error = m.batch_means_standard_error(shifted, 2)
    close(estimate, 1e12 + 4., tol=1e-12)
    close(standard_error, 2.)

    estimate, standard_error = m.batch_means_standard_error(
        (3 * value - 8 for value in values), 2
    )
    close(estimate, 4.)
    close(standard_error, 6.)
    close(m.batch_means_standard_error([9.] * 12, 3)[1], 0.)

    invalid = [
        ([], 1),
        ([1.], 1),
        ([1., 2., 3.], 2),
        ([1., 2.], 0),
        ([1., 2.], -1),
        ([1., 2.], 1.5),
        ([1., 2.], True),
        ([1., float("nan")], 1),
        ([1., float("inf")], 1),
        ([1., True], 1),
        ([1., "2"], 1),
    ]
    for observations, batch_size in invalid:
        try:
            m.batch_means_standard_error(observations, batch_size)
        except ValueError:
            continue
        raise AssertionError("invalid batch-means input should be rejected")


def bernoulli_mle(m):
    outcomes = [1, 0, 1, 1]
    before = outcomes[:]
    estimate, log_likelihood, standard_error = m.bernoulli_mle(outcomes)
    assert outcomes == before
    close(estimate, 0.75)
    close(log_likelihood, 3 * math.log(0.75) + math.log(0.25))
    close(standard_error, math.sqrt(0.75 * 0.25 / 4))

    generated = m.bernoulli_mle(value for value in outcomes)
    for actual, expected in zip(generated, (estimate, log_likelihood, standard_error)):
        close(actual, expected)

    replicated = m.bernoulli_mle(outcomes * 5)
    close(replicated[0], estimate)
    close(replicated[1], 5 * log_likelihood)
    close(replicated[2], standard_error / math.sqrt(5))

    assert m.bernoulli_mle([0, 0, 0]) == (0.0, 0.0, 0.0)
    assert m.bernoulli_mle([1, 1, 1]) == (1.0, 0.0, 0.0)

    invalid = [
        [],
        [True, 0],
        [False, 1],
        [0.0, 1.0],
        [0, 2],
        [0, -1],
        [0, "1"],
        [0, float("nan")],
    ]
    for observations in invalid:
        try:
            m.bernoulli_mle(observations)
        except ValueError:
            continue
        raise AssertionError("invalid Bernoulli observations should be rejected")


def binomial_test(m):
    estimate, p_value, interval = m.exact_binomial_test(9, 10, 0.5)
    close(estimate, 0.9)
    close(p_value, 22 / 1024)
    assert interval[0] < estimate < interval[1]

    _, greater, _ = m.exact_binomial_test(9, 10, 0.5, alternative="greater")
    _, less, _ = m.exact_binomial_test(9, 10, 0.5, alternative="less")
    close(greater, 11 / 1024)
    close(less, 1023 / 1024)

    zero = m.exact_binomial_test(0, 20, 0.5)
    assert zero[2][0] == 0.0
    close(zero[2][1], 1 - 0.025 ** (1 / 20))
    all_success = m.exact_binomial_test(20, 20, 0.5)
    close(all_success[2][0], 0.025 ** (1 / 20))
    assert all_success[2][1] == 1.0

    lower_a, upper_a = m.exact_binomial_test(3, 12, 0.4)[2]
    lower_b, upper_b = m.exact_binomial_test(9, 12, 0.6)[2]
    close(lower_a, 1 - upper_b)
    close(upper_a, 1 - lower_b)

    _, _, ninety = m.exact_binomial_test(4, 8, 0.5, confidence_level=0.90)
    _, _, ninety_five = m.exact_binomial_test(4, 8, 0.5, confidence_level=0.95)
    assert ninety_five[0] < ninety[0] < ninety[1] < ninety_five[1]

    invalid = [
        (True, 10, 0.5, 0.95, "two-sided"),
        (2.0, 10, 0.5, 0.95, "two-sided"),
        (-1, 10, 0.5, 0.95, "two-sided"),
        (11, 10, 0.5, 0.95, "two-sided"),
        (1, 0, 0.5, 0.95, "two-sided"),
        (1, True, 0.5, 0.95, "two-sided"),
        (1, 10, -0.1, 0.95, "two-sided"),
        (1, 10, 1.1, 0.95, "two-sided"),
        (1, 10, float("nan"), 0.95, "two-sided"),
        (1, 10, 0.5, 0.0, "two-sided"),
        (1, 10, 0.5, 1.0, "two-sided"),
        (1, 10, 0.5, 0.95, "up"),
    ]
    for arguments in invalid:
        try:
            m.exact_binomial_test(*arguments)
        except ValueError:
            continue
        raise AssertionError("invalid exact-binomial input should be rejected")


def bh_fdr(m):
    p_values = [0.20, 0.004, 0.03, 0.011]
    before = p_values[:]
    rejected, adjusted = m.benjamini_hochberg(p_values, 0.05)
    assert p_values == before
    assert rejected == [False, True, True, True]
    for actual, expected in zip(adjusted, [0.20, 0.016, 0.04, 0.022]):
        close(actual, expected)

    generated = m.benjamini_hochberg((value for value in p_values), 0.05)
    assert generated[0] == rejected
    for actual, expected in zip(generated[1], adjusted):
        close(actual, expected)

    assert m.benjamini_hochberg([0.20, 0.50, 0.90], 0.05)[0] == [False] * 3
    tied_rejected, tied_adjusted = m.benjamini_hochberg([0.01, 0.20, 0.01], 0.05)
    assert tied_rejected == [True, False, True]
    for actual, expected in zip(tied_adjusted, [0.015, 0.20, 0.015]):
        close(actual, expected)

    ordered_p = [0.001, 0.01, 0.03, 0.08, 0.4]
    _, ordered_adjusted = m.benjamini_hochberg(ordered_p, 0.10)
    assert all(
        left <= right
        for left, right in zip(ordered_adjusted, ordered_adjusted[1:])
    )
    assert all(p_value <= adjusted_value <= 1 for p_value, adjusted_value in zip(
        ordered_p, ordered_adjusted
    ))

    invalid = [
        ([], 0.05),
        ([0.1, True], 0.05),
        ([0.1, -0.01], 0.05),
        ([0.1, 1.01], 0.05),
        ([0.1, float("nan")], 0.05),
        ([0.1], 0.0),
        ([0.1], 1.1),
        ([0.1], True),
    ]
    for probabilities, target in invalid:
        try:
            m.benjamini_hochberg(probabilities, target)
        except ValueError:
            continue
        raise AssertionError("invalid BH input should be rejected")


def bootstrap(m):
    values = [1.0, 2.0, 3.0, 4.0]
    before = values[:]
    estimate, standard_error, interval = m.bootstrap_mean_interval(
        values, 1000, 0.95, 17
    )
    assert values == before
    close(estimate, 2.5)
    close(standard_error, 0.567177829865282)
    close(interval[0], 1.5)
    close(interval[1], 3.50625)
    assert m.bootstrap_mean_interval(values, 1000, 0.95, 17) == (
        estimate, standard_error, interval
    )

    generated = m.bootstrap_mean_interval(
        (value for value in values), 1000, 0.95, 17
    )
    assert generated == (estimate, standard_error, interval)
    narrower = m.bootstrap_mean_interval(values, 1000, 0.80, 17)[2]
    assert interval[0] <= narrower[0] <= narrower[1] <= interval[1]

    constant = m.bootstrap_mean_interval([7.0] * 8, 100, 0.95, 3)
    assert constant == (7.0, 0.0, (7.0, 7.0))
    shifted = m.bootstrap_mean_interval(
        [1e12 + value for value in values], 1000, 0.95, 17
    )
    close(shifted[0], 1e12 + estimate, tol=1e-12)
    close(shifted[1], standard_error)
    close(shifted[2][0], 1e12 + interval[0], tol=1e-12)
    close(shifted[2][1], 1e12 + interval[1], tol=1e-12)

    random.seed(90210)
    expected_global = random.random()
    random.seed(90210)
    m.bootstrap_mean_interval(values, 20, 0.90, 4)
    close(random.random(), expected_global)

    invalid = [
        ([], 100, 0.95, 1),
        ([1.0], 100, 0.95, 1),
        ([1.0, True], 100, 0.95, 1),
        ([1.0, "2"], 100, 0.95, 1),
        ([1.0, float("nan")], 100, 0.95, 1),
        ([1.0, float("inf")], 100, 0.95, 1),
        ([1.0, 2.0], 1, 0.95, 1),
        ([1.0, 2.0], True, 0.95, 1),
        ([1.0, 2.0], 100, 0.0, 1),
        ([1.0, 2.0], 100, 1.0, 1),
        ([1.0, 2.0], 100, float("nan"), 1),
        ([1.0, 2.0], 100, 0.95, True),
        ([1.0, 2.0], 100, 0.95, 1.5),
    ]
    for arguments in invalid:
        try:
            m.bootstrap_mean_interval(*arguments)
        except ValueError:
            continue
        raise AssertionError("invalid bootstrap input should be rejected")


def permutation(m):
    observed, p_value = m.paired_permutation_test([2.0, -1.0, 3.0])
    close(observed, 4 / 3)
    close(p_value, 0.5)
    close(m.paired_permutation_test([1.0, 1.0])[1], 0.5)
    assert m.paired_permutation_test([1.0, -1.0]) == (0.0, 1.0)
    assert m.paired_permutation_test([0.0, 0.0]) == (0.0, 1.0)
    assert m.paired_permutation_test([5.0]) == (5.0, 1.0)

    generated = m.paired_permutation_test(
        value for value in [2.0, -1.0, 3.0]
    )
    close(generated[0], observed)
    close(generated[1], p_value)
    negated = m.paired_permutation_test([-2.0, 1.0, -3.0])
    scaled = m.paired_permutation_test([20.0, -10.0, 30.0])
    close(negated[0], -observed)
    close(negated[1], p_value)
    close(scaled[0], 10 * observed)
    close(scaled[1], p_value)

    invalid = [
        [],
        [0.0] * 21,
        [1.0, True],
        [1.0, "2"],
        [1.0, float("nan")],
        [1.0, float("inf")],
    ]
    for differences in invalid:
        try:
            m.paired_permutation_test(differences)
        except ValueError:
            continue
        raise AssertionError("invalid paired-permutation input should be rejected")


def e_process(m):
    outcomes = [1, 0, 1]
    before = outcomes[:]
    e_values, anytime_p_value = m.bernoulli_e_process(outcomes, 0.5, 0.75)
    assert outcomes == before
    for actual, expected in zip(e_values, [1.5, 0.75, 1.125]):
        close(actual, expected)
    close(anytime_p_value, 2 / 3)

    increasing, p_value = m.bernoulli_e_process([1, 1, 1], 0.5, 0.75)
    for actual, expected in zip(increasing, [1.5, 2.25, 3.375]):
        close(actual, expected)
    close(p_value, 1 / 3.375)
    decreasing, p_value = m.bernoulli_e_process([0, 0], 0.5, 0.75)
    for actual, expected in zip(decreasing, [0.5, 0.25]):
        close(actual, expected)
    close(p_value, 1.0)

    neutral, p_value = m.bernoulli_e_process([1, 0, 1, 1], 0.4, 0.4)
    assert neutral == [1.0] * 4
    assert p_value == 1.0
    generated = m.bernoulli_e_process((value for value in outcomes), 0.5, 0.75)
    assert generated == (e_values, anytime_p_value)

    overwhelming, tiny_p = m.bernoulli_e_process([1] * 1000, 0.01, 0.99)
    assert overwhelming[-1] == float("inf")
    assert tiny_p == 0.0

    invalid = [
        ([], 0.5, 0.75),
        ([True], 0.5, 0.75),
        ([0.0, 1.0], 0.5, 0.75),
        ([0, 2], 0.5, 0.75),
        ([0, "1"], 0.5, 0.75),
        ([1], 0.0, 0.75),
        ([1], 1.0, 0.75),
        ([1], 0.5, 0.0),
        ([1], 0.5, 1.0),
        ([1], float("nan"), 0.75),
        ([1], 0.5, True),
    ]
    for observations, null_probability, alternative_probability in invalid:
        try:
            m.bernoulli_e_process(
                observations, null_probability, alternative_probability
            )
        except ValueError:
            continue
        raise AssertionError("invalid Bernoulli e-process input should be rejected")


def beta_update(m):
    outcomes = [1, 0, 1, 1]
    before = outcomes[:]
    result = m.beta_bernoulli_update(outcomes, 2.0, 3.0)
    assert outcomes == before
    expected = (5.0, 4.0, 5 / 9, 20 / (81 * 10), 5 / 9)
    for actual, target in zip(result, expected):
        close(actual, target)

    generated = m.beta_bernoulli_update((value for value in outcomes), 2.0, 3.0)
    for actual, target in zip(generated, expected):
        close(actual, target)
    assert m.beta_bernoulli_update([0, 0], 1.0, 1.0)[:2] == (1.0, 3.0)
    assert m.beta_bernoulli_update([1, 1], 1.0, 1.0)[:2] == (3.0, 1.0)

    first = m.beta_bernoulli_update(outcomes[:2], 2.0, 3.0)
    second = m.beta_bernoulli_update(outcomes[2:], first[0], first[1])
    for actual, target in zip(second, result):
        close(actual, target)
    fractional = m.beta_bernoulli_update([1, 0], 0.5, 1.5)
    for actual, target in zip(fractional, (1.5, 2.5, 0.375, 0.046875, 0.375)):
        close(actual, target)

    invalid = [
        ([], 1.0, 1.0),
        ([True], 1.0, 1.0),
        ([0.0, 1.0], 1.0, 1.0),
        ([0, 2], 1.0, 1.0),
        ([0, "1"], 1.0, 1.0),
        ([1], 0.0, 1.0),
        ([1], -1.0, 1.0),
        ([1], 1.0, 0.0),
        ([1], float("nan"), 1.0),
        ([1], 1.0, float("inf")),
        ([1], True, 1.0),
    ]
    for observations, alpha, beta in invalid:
        try:
            m.beta_bernoulli_update(observations, alpha, beta)
        except ValueError:
            continue
        raise AssertionError("invalid Beta-Bernoulli input should be rejected")


def importance(m):
    values = [10.0, 20.0, 30.0]
    log_weights = [0.0, math.log(2.0), math.log(3.0)]
    before_values, before_weights = values[:], log_weights[:]
    estimate, normalized, effective_sample_size = m.self_normalized_importance(
        values, log_weights
    )
    assert values == before_values and log_weights == before_weights
    close(estimate, 140 / 6)
    for actual, target in zip(normalized, [1 / 6, 2 / 6, 3 / 6]):
        close(actual, target)
    close(effective_sample_size, 18 / 7)
    close(sum(normalized), 1.0)

    shifted = m.self_normalized_importance(
        values, [weight + 10000 for weight in log_weights]
    )
    close(shifted[0], estimate)
    close(shifted[2], effective_sample_size)
    for actual, target in zip(shifted[1], normalized):
        close(actual, target)

    equal = m.self_normalized_importance([1.0, 2.0, 10.0], [5.0] * 3)
    close(equal[0], 13 / 3)
    assert equal[1] == [1 / 3] * 3
    close(equal[2], 3.0)
    extreme = m.self_normalized_importance(
        [1.0, 2.0, 10.0], [-1000.0, -1000.0, 0.0]
    )
    assert extreme == (10.0, [0.0, 0.0, 1.0], 1.0)

    generated = m.self_normalized_importance(
        (value for value in values), (weight for weight in log_weights)
    )
    close(generated[0], estimate)
    close(generated[2], effective_sample_size)

    invalid = [
        ([], []),
        ([1.0], []),
        ([1.0], [0.0, 1.0]),
        ([True], [0.0]),
        (["1"], [0.0]),
        ([float("nan")], [0.0]),
        ([float("inf")], [0.0]),
        ([1.0], [True]),
        ([1.0], [float("nan")]),
        ([1.0], [float("inf")]),
        ([1.0], [float("-inf")]),
    ]
    for observations, weights in invalid:
        try:
            m.self_normalized_importance(observations, weights)
        except ValueError:
            continue
        raise AssertionError("invalid importance-sampling input should be rejected")


def metropolis(m):
    constant = lambda value: 0.0
    states, acceptance = m.random_walk_metropolis(constant, 0.0, 1.0, 5, 7)
    expected_states = [
        -0.2558802884476004,
        0.25555122406891356,
        -0.6744669662538538,
        -0.8877689136750575,
        0.14911016521460896,
    ]
    for actual, target in zip(states, expected_states):
        close(actual, target)
    close(acceptance, 1.0)
    assert m.random_walk_metropolis(constant, 0.0, 1.0, 5, 7) == (
        states, acceptance
    )

    stuck = m.random_walk_metropolis(
        lambda value: 0.0 if value == 0.0 else float("-inf"),
        0.0, 1.0, 8, 3
    )
    assert stuck == ([0.0] * 8, 0.0)

    gaussian_states, gaussian_acceptance = m.random_walk_metropolis(
        lambda value: -0.5 * value * value, 8.0, 1.0, 10000, 19
    )
    retained = gaussian_states[1000:]
    mean = math.fsum(retained) / len(retained)
    variance = math.fsum((value - mean) ** 2 for value in retained) / len(retained)
    assert abs(mean) < 0.12
    assert 0.8 < variance < 1.2
    assert 0.5 < gaussian_acceptance < 0.9

    random.seed(4815)
    expected_global = random.random()
    random.seed(4815)
    m.random_walk_metropolis(constant, 0.0, 1.0, 5, 7)
    close(random.random(), expected_global)

    invalid = [
        (None, 0.0, 1.0, 10, 1),
        (constant, True, 1.0, 10, 1),
        (constant, float("nan"), 1.0, 10, 1),
        (constant, 0.0, 0.0, 10, 1),
        (constant, 0.0, float("inf"), 10, 1),
        (constant, 0.0, 1.0, 0, 1),
        (constant, 0.0, 1.0, True, 1),
        (constant, 0.0, 1.0, 10, True),
        (lambda value: float("nan"), 0.0, 1.0, 10, 1),
        (lambda value: float("-inf"), 0.0, 1.0, 10, 1),
        (lambda value: "bad", 0.0, 1.0, 10, 1),
        (
            lambda value: 0.0 if value == 0.0 else float("inf"),
            0.0, 1.0, 10, 1
        ),
    ]
    for arguments in invalid:
        try:
            m.random_walk_metropolis(*arguments)
        except ValueError:
            continue
        raise AssertionError("invalid Metropolis input should be rejected")


def stratified(m):
    samples = {"small": [1.0, 3.0], "large": [8.0, 10.0, 12.0]}
    populations = {"small": 10, "large": 30}
    before_samples = {name: values[:] for name, values in samples.items()}
    before_populations = populations.copy()
    estimate, standard_error = m.stratified_mean_standard_error(
        samples, populations
    )
    assert samples == before_samples and populations == before_populations
    close(estimate, 8.0)
    close(standard_error, math.sqrt(0.725))

    generated = m.stratified_mean_standard_error(
        {
            "small": (value for value in [1.0, 3.0]),
            "large": (value for value in [8.0, 10.0, 12.0]),
        },
        populations,
    )
    close(generated[0], estimate)
    close(generated[1], standard_error)

    census = m.stratified_mean_standard_error(
        samples, {"small": 2, "large": 3}
    )
    close(census[0], 6.8)
    close(census[1], 0.0)
    constant = m.stratified_mean_standard_error(
        {"a": [5.0, 5.0], "b": [5.0, 5.0, 5.0]},
        {"a": 20, "b": 80},
    )
    assert constant == (5.0, 0.0)

    invalid = [
        ({}, {}),
        ([], {}),
        ({"a": [1.0, 2.0]}, {}),
        ({"a": [1.0]}, {"a": 10}),
        ({"a": [1.0, True]}, {"a": 10}),
        ({"a": [1.0, "2"]}, {"a": 10}),
        ({"a": [1.0, float("nan")]}, {"a": 10}),
        ({"a": [1.0, 2.0]}, {"a": 1}),
        ({"a": [1.0, 2.0]}, {"a": True}),
        ({"a": [1.0, 2.0]}, {"a": 2.5}),
    ]
    for stratum_samples, stratum_populations in invalid:
        try:
            m.stratified_mean_standard_error(
                stratum_samples, stratum_populations
            )
        except ValueError:
            continue
        raise AssertionError("invalid stratified-sampling design should be rejected")


def horvitz_thompson(m):
    values = [4.0, 7.0, 2.0]
    probabilities = [0.8, 0.5, 0.1]
    before_values, before_probabilities = values[:], probabilities[:]
    total, mean = m.horvitz_thompson(values, probabilities, 10)
    assert values == before_values and probabilities == before_probabilities
    close(total, 39.0)
    close(mean, 3.9)

    equal = m.horvitz_thompson([2.0, 4.0], [0.5, 0.5], 4)
    close(equal[0], 12.0)
    close(equal[1], 3.0)
    census = m.horvitz_thompson([1.0, 2.0, 3.0], [1.0] * 3, 3)
    assert census == (6.0, 2.0)
    scaled = m.horvitz_thompson(
        [10 * value for value in values], probabilities, 10
    )
    close(scaled[0], 10 * total)
    close(scaled[1], 10 * mean)
    generated = m.horvitz_thompson(
        (value for value in values), (value for value in probabilities), 10
    )
    close(generated[0], total)
    close(generated[1], mean)

    invalid = [
        ([], [], 1),
        ([1.0], [], 1),
        ([1.0], [0.5, 0.5], 2),
        ([True], [0.5], 1),
        (["1"], [0.5], 1),
        ([float("nan")], [0.5], 1),
        ([1.0], [0.0], 1),
        ([1.0], [-0.1], 1),
        ([1.0], [1.1], 1),
        ([1.0], [True], 1),
        ([1.0], [float("nan")], 1),
        ([1.0, 2.0], [0.5, 0.5], 1),
        ([1.0], [0.5], True),
        ([1.0], [0.5], 1.5),
    ]
    for observations, inclusion, population_size in invalid:
        try:
            m.horvitz_thompson(observations, inclusion, population_size)
        except ValueError:
            continue
        raise AssertionError("invalid Horvitz-Thompson input should be rejected")


def rejection(m):
    accepted, attempts, rate = m.rejection_sample(
        lambda generator: 5.0, lambda value: 1.0, 6, 9, 6
    )
    assert accepted == [5.0] * 6 and attempts == 6 and rate == 1.0

    proposal = lambda generator: generator.uniform(-1.0, 1.0)
    probability = lambda value: (value + 1.0) / 2.0
    first = m.rejection_sample(proposal, probability, 10, 7, 100)
    second = m.rejection_sample(proposal, probability, 10, 7, 100)
    assert first == second
    expected = [
        -0.35233447033367526,
        0.3018689460797075,
        0.0717640086133784,
        0.15420589723499734,
        0.9525102111858401,
        0.716936918097359,
        -0.7114898332851249,
        0.2778269378523681,
        0.09548893141911563,
        0.3607999463635718,
    ]
    for actual, target in zip(first[0], expected):
        close(actual, target)
    assert first[1] == 19
    close(first[2], 10 / 19)

    many, many_attempts, many_rate = m.rejection_sample(
        proposal, probability, 3000, 71, 10000
    )
    many_mean = math.fsum(many) / len(many)
    assert 0.29 < many_mean < 0.38
    assert 5000 < many_attempts < 7000
    close(many_rate, 3000 / many_attempts)

    random.seed(7727)
    expected_global = random.random()
    random.seed(7727)
    m.rejection_sample(proposal, probability, 10, 7, 100)
    close(random.random(), expected_global)

    try:
        m.rejection_sample(lambda generator: 0.0, lambda value: 0.0, 2, 1, 5)
    except RuntimeError:
        pass
    else:
        raise AssertionError("exhausted rejection sampler should raise RuntimeError")

    invalid = [
        (None, lambda value: 1.0, 1, 1, 2),
        (lambda generator: 0.0, None, 1, 1, 2),
        (lambda generator: 0.0, lambda value: 1.0, 0, 1, 2),
        (lambda generator: 0.0, lambda value: 1.0, True, 1, 2),
        (lambda generator: 0.0, lambda value: 1.0, 1, True, 2),
        (lambda generator: 0.0, lambda value: 1.0, 2, 1, 1),
        (lambda generator: True, lambda value: 1.0, 1, 1, 2),
        (lambda generator: float("nan"), lambda value: 1.0, 1, 1, 2),
        (lambda generator: 0.0, lambda value: True, 1, 1, 2),
        (lambda generator: 0.0, lambda value: -0.1, 1, 1, 2),
        (lambda generator: 0.0, lambda value: 1.1, 1, 1, 2),
        (lambda generator: 0.0, lambda value: float("nan"), 1, 1, 2),
    ]
    for arguments in invalid:
        try:
            m.rejection_sample(*arguments)
        except ValueError:
            continue
        raise AssertionError("invalid rejection-sampling input should be rejected")


def simple_ols(m):
    predictors = [0.0, 1.0, 2.0, 3.0]
    outcomes = [1.0, 3.0, 2.0, 6.0]
    before_predictors, before_outcomes = predictors[:], outcomes[:]
    intercept, slope, residual_se, slope_se = m.simple_ols(predictors, outcomes)
    assert predictors == before_predictors and outcomes == before_outcomes
    close(intercept, 0.9)
    close(slope, 1.4)
    close(residual_se, math.sqrt(2.1))
    close(slope_se, math.sqrt(0.42))

    exact = m.simple_ols([-2.0, 0.0, 4.0], [-3.0, 1.0, 9.0])
    close(exact[0], 1.0)
    close(exact[1], 2.0)
    close(exact[2], 0.0)
    close(exact[3], 0.0)
    generated = m.simple_ols(
        (value for value in predictors), (value for value in outcomes)
    )
    for actual, expected in zip(generated, (intercept, slope, residual_se, slope_se)):
        close(actual, expected)

    shifted_x = m.simple_ols([value + 10 for value in predictors], outcomes)
    close(shifted_x[0], intercept - 10 * slope)
    close(shifted_x[1], slope)
    close(shifted_x[2], residual_se)
    close(shifted_x[3], slope_se)
    shifted_y = m.simple_ols(predictors, [value + 5 for value in outcomes])
    close(shifted_y[0], intercept + 5)
    close(shifted_y[1], slope)
    close(shifted_y[2], residual_se)
    scaled_x = m.simple_ols([2 * value for value in predictors], outcomes)
    close(scaled_x[1], slope / 2)
    close(scaled_x[3], slope_se / 2)

    invalid = [
        ([], []),
        ([1.0, 2.0], [1.0, 2.0]),
        ([1.0, 2.0, 3.0], [1.0, 2.0]),
        ([1.0, 1.0, 1.0], [1.0, 2.0, 3.0]),
        ([1.0, True, 3.0], [1.0, 2.0, 3.0]),
        ([1.0, "2", 3.0], [1.0, 2.0, 3.0]),
        ([1.0, 2.0, float("nan")], [1.0, 2.0, 3.0]),
        ([1.0, 2.0, 3.0], [1.0, float("inf"), 3.0]),
    ]
    for x_values, y_values in invalid:
        try:
            m.simple_ols(x_values, y_values)
        except ValueError:
            continue
        raise AssertionError("invalid simple-OLS input should be rejected")


def logistic_gradient(m):
    design = [[1.0, 0.0], [1.0, 1.0], [1.0, 2.0]]
    outcomes = [0, 0, 1]
    coefficients = [0.0, 0.0]
    before_design = [row[:] for row in design]
    before_outcomes, before_coefficients = outcomes[:], coefficients[:]
    loss, gradient = m.logistic_loss_gradient(design, outcomes, coefficients)
    assert design == before_design
    assert outcomes == before_outcomes and coefficients == before_coefficients
    close(loss, math.log(2.0))
    close(gradient[0], 1 / 6)
    close(gradient[1], -1 / 6)

    extreme_loss, extreme_gradient = m.logistic_loss_gradient(
        [[1.0, 1000.0], [1.0, -1000.0]], [1, 0], [0.0, 1.0]
    )
    assert math.isfinite(extreme_loss)
    assert all(math.isfinite(value) for value in extreme_gradient)
    close(extreme_loss, 0.0)
    close(extreme_gradient[0], 0.0)
    close(extreme_gradient[1], 0.0)

    generated = m.logistic_loss_gradient(
        (iter(row) for row in design), (value for value in outcomes),
        (value for value in [0.2, -0.3])
    )
    ordinary = m.logistic_loss_gradient(design, outcomes, [0.2, -0.3])
    close(generated[0], ordinary[0])
    for actual, expected in zip(generated[1], ordinary[1]):
        close(actual, expected)

    point = [0.2, -0.3]
    epsilon = 1e-6
    _, analytic = m.logistic_loss_gradient(design, outcomes, point)
    for column in range(2):
        upper, lower = point[:], point[:]
        upper[column] += epsilon
        lower[column] -= epsilon
        upper_loss = m.logistic_loss_gradient(design, outcomes, upper)[0]
        lower_loss = m.logistic_loss_gradient(design, outcomes, lower)[0]
        close(analytic[column], (upper_loss - lower_loss) / (2 * epsilon), tol=1e-6)

    invalid = [
        ([], [], []),
        ([[1.0]], [], [0.0]),
        ([[1.0], [1.0, 2.0]], [0, 1], [0.0]),
        ([[1.0]], [0], []),
        ([[1.0, True]], [0], [0.0, 0.0]),
        ([[1.0, float("nan")]], [0], [0.0, 0.0]),
        ([[1.0]], [True], [0.0]),
        ([[1.0]], [2], [0.0]),
        ([[1.0]], [0.0], [0.0]),
        ([[1.0]], [0], [float("inf")]),
    ]
    for rows, labels, weights in invalid:
        try:
            m.logistic_loss_gradient(rows, labels, weights)
        except ValueError:
            continue
        raise AssertionError("invalid logistic-gradient input should be rejected")


def partial_pooling(m):
    means = [0.0, 10.0]
    sizes = [1, 4]
    before_means, before_sizes = means[:], sizes[:]
    pooled, weights = m.partial_pooling_means(means, sizes, 4.0, 5.0, 1.0)
    assert means == before_means and sizes == before_sizes
    for actual, expected in zip(weights, [0.2, 0.5]):
        close(actual, expected)
    for actual, expected in zip(pooled, [4.0, 7.5]):
        close(actual, expected)

    no_heterogeneity = m.partial_pooling_means(means, sizes, 4.0, 5.0, 0.0)
    assert no_heterogeneity == ([5.0, 5.0], [0.0, 0.0])
    noiseless = m.partial_pooling_means(means, sizes, 0.0, 5.0, 1.0)
    assert noiseless == (means, [1.0, 1.0])
    generated = m.partial_pooling_means(
        (value for value in means), (value for value in sizes), 4.0, 5.0, 1.0
    )
    assert generated == (pooled, weights)
    shifted = m.partial_pooling_means(
        [value + 100 for value in means], sizes, 4.0, 105.0, 1.0
    )
    for actual, expected in zip(shifted[0], [value + 100 for value in pooled]):
        close(actual, expected)
    assert shifted[1] == weights
    more_data = m.partial_pooling_means([10.0, 10.0], [1, 100], 4.0, 5.0, 1.0)
    assert more_data[1][1] > more_data[1][0]
    assert more_data[0][1] > more_data[0][0]

    invalid = [
        ([], [], 1.0, 0.0, 1.0),
        ([1.0], [], 1.0, 0.0, 1.0),
        ([True], [1], 1.0, 0.0, 1.0),
        ([float("nan")], [1], 1.0, 0.0, 1.0),
        ([1.0], [0], 1.0, 0.0, 1.0),
        ([1.0], [True], 1.0, 0.0, 1.0),
        ([1.0], [1.5], 1.0, 0.0, 1.0),
        ([1.0], [1], -1.0, 0.0, 1.0),
        ([1.0], [1], 1.0, 0.0, -1.0),
        ([1.0], [1], 0.0, 0.0, 0.0),
        ([1.0], [1], float("inf"), 0.0, 1.0),
        ([1.0], [1], 1.0, True, 1.0),
    ]
    for arguments in invalid:
        try:
            m.partial_pooling_means(*arguments)
        except ValueError:
            continue
        raise AssertionError("invalid partial-pooling input should be rejected")


def search(m):
    for n in range(7):
        for values in itertools.combinations_with_replacement([-1, 0, 1], n):
            for target in [-2, -1, 0, 1, 2]:
                expected = next((i for i, x in enumerate(values) if x >= target), n)
                assert m.lower_bound(values, target) == expected


def softmax(m):
    logits = [10000, 10001, 10002]
    before = logits[:]
    p = m.stable_softmax(logits)
    q = m.stable_softmax([0, 1, 2])
    assert logits == before and len(p) == 3
    close(sum(p), 1)
    for a, b in zip(p, q):
        close(a, b)
    assert p[0] < p[1] < p[2]
    for x in m.stable_softmax([0, 0, 0]):
        close(x, 1/3)


def bigram(m):
    p = {"a": {"a": .25, "b": .75}, "b": {"a": .5, "b": .5}}
    close(m.bigram_nll(p, ["a", "b", "a"]), -(math.log(.75)+math.log(.5))/2)
    close(m.bigram_nll(p, ["a", "a"]), -math.log(.25))


def attention(m):
    q, k, v = [[0], [0], [0]], [[1], [2], [3]], [[2], [4], [12]]
    output = m.causal_attention(q, k, v)
    for row, expected in zip(output, [2, 3, 6]):
        close(row[0], expected)
    q = [[1., 0.], [0., 1.], [1., 1.]]
    k = [[.1, .3], [.7, .2], [.8, -.2]]
    v = [[2., -1.], [3., 4.], [6., 1.]]
    output = m.causal_attention(q, k, v)
    changed = m.causal_attention(q, k[:2]+[[100., -100.]], v[:2]+[[100., 100.]])
    for old, new in zip(output[:2], changed[:2]):
        for a, b in zip(old, new):
            close(a, b)
    close(output[0][0], 2)
    close(output[0][1], -1)


def bellman(m):
    values = [0.]
    for _ in range(250):
        values = m.bellman_backup(values, [[1., 2.]], [[[1.], [1.]]], .9)
    close(values[0], 20)
    # Stochastic transition expectation, not max over next states.
    values = m.bellman_backup(
        [2., 10.], [[0.], [3.]], [[[.25, .75]], [[1., 0.]]], .5
    )
    close(values[0], 4)
    close(values[1], 4)


def projection(m):
    generator = random.Random(11)
    points = [[generator.gauss(0.0, 1.0) for _ in range(40)] for _ in range(6)]
    base = m.projection_distortion(points, 16, 5)
    assert base >= 0.0
    close(m.projection_distortion(points, 16, 5), base)
    scaled = [[3.5 * value for value in point] for point in points]
    close(m.projection_distortion(scaled, 16, 5), base)
    shifted = [[value + 2.0 for value in point] for point in points]
    close(m.projection_distortion(shifted, 16, 5), base)
    assert m.projection_distortion(points, 2048, 5) < base
    for bad in ([], [[1.0, 2.0]], [[1.0], [1.0, 2.0]], [[1.0, 0.0], [1.0, 0.0]]):
        try:
            m.projection_distortion(bad, 8, 1)
        except ValueError:
            continue
        raise AssertionError("invalid projection input should be rejected")
    for dim in (0, -3):
        try:
            m.projection_distortion(points, dim, 1)
        except ValueError:
            continue
        raise AssertionError("invalid projection dimension should be rejected")


def calibration(m):
    error, bins = m.expected_calibration_error([0.1, 0.2, 0.6, 0.9], [0, 0, 1, 1], 2)
    close(error, 0.2)
    assert len(bins) == 2
    close(bins[0][0], 2); close(bins[0][1], 0.15); close(bins[0][2], 0.0)
    close(bins[1][0], 2); close(bins[1][1], 0.75); close(bins[1][2], 1.0)
    edge, edge_bins = m.expected_calibration_error([1.0], [1], 4)
    close(edge, 0.0)
    assert len(edge_bins) == 1 and edge_bins[0][0] == 1
    perfect, _ = m.expected_calibration_error([0.25, 0.75], [0, 1], 2)
    close(perfect, 0.5 * 0.25 + 0.5 * 0.25)
    bad = ([], [], 2), ([0.5], [], 2), ([1.5], [1], 2), ([0.5], [2], 2), ([0.5], [1], 0)
    for probabilities, outcomes, count in bad:
        try:
            m.expected_calibration_error(probabilities, outcomes, count)
        except ValueError:
            continue
        raise AssertionError("invalid calibration input should be rejected")


def conformal(m):
    scores = [5.0, 1.0, 4.0, 2.0, 3.0]
    close(m.conformal_threshold(scores, 0.5), 3.0)
    close(m.conformal_threshold(scores, 0.2), 5.0)
    close(m.conformal_threshold([7.0], 0.5), 7.0)
    for alpha in (0.1, 0.0, 1.0, -0.2):
        try:
            m.conformal_threshold(scores, alpha)
        except ValueError:
            continue
        raise AssertionError("infeasible or invalid alpha should be rejected")
    for bad in ([], [float("nan")], [float("inf")]):
        try:
            m.conformal_threshold(bad, 0.5)
        except ValueError:
            continue
        raise AssertionError("invalid conformal scores should be rejected")


def elbo_terms(m):
    divergence, bound = m.gaussian_elbo_terms(-12.0, [0.0, 0.0], [0.0, 0.0])
    close(divergence, 0.0)
    close(bound, -12.0)
    divergence, bound = m.gaussian_elbo_terms(-3.0, [2.0], [math.log(0.25)])
    close(divergence, 0.5 * (0.25 + 4.0 - 1.0 - math.log(0.25)))
    close(bound, -3.0 - divergence)
    paired, _ = m.gaussian_elbo_terms(0.0, [1.0, 1.0], [0.0, 0.0])
    single, _ = m.gaussian_elbo_terms(0.0, [1.0], [0.0])
    close(paired, 2.0 * single)
    bad = (-1.0, [], []), (-1.0, [0.0], [0.0, 0.0]), (float("nan"), [0.0], [0.0]), (-1.0, [float("inf")], [0.0])
    for reconstruction, means, log_variances in bad:
        try:
            m.gaussian_elbo_terms(reconstruction, means, log_variances)
        except ValueError:
            continue
        raise AssertionError("invalid ELBO input should be rejected")


def gumbel(m):
    assert m.gumbel_max_sample([0.0, 1.0, 2.0], 7) == m.gumbel_max_sample([0.0, 1.0, 2.0], 7)
    shifted = m.gumbel_max_sample([10.0, 11.0, 12.0], 7)
    assert m.gumbel_max_sample([0.0, 1.0, 2.0], 7) == shifted
    for seed in range(20):
        assert m.gumbel_max_sample([0.0, 100.0], seed) == 1
    assert m.gumbel_max_sample([5.0], 3) == 0
    hits = sum(m.gumbel_max_sample([0.0, 1.0], seed) for seed in range(4000))
    target = math.exp(1.0) / (1.0 + math.exp(1.0))
    assert abs(hits / 4000 - target) < 0.04, hits / 4000
    for bad in ([], [float("nan")], [0.0, float("inf")]):
        try:
            m.gumbel_max_sample(bad, 1)
        except ValueError:
            continue
        raise AssertionError("invalid Gumbel input should be rejected")


def decoding(m):
    uniform = m.decode_distribution([0.0, 0.0, 0.0, 0.0], 1.0, 0.5)
    close(uniform[0], 0.5); close(uniform[1], 0.5)
    close(uniform[2], 0.0); close(uniform[3], 0.0)
    full = m.decode_distribution([0.0, math.log(3.0)], 1.0, 1.0)
    close(full[0], 0.25); close(full[1], 0.75)
    warm = m.decode_distribution([0.0, math.log(3.0)], 2.0, 1.0)
    root = math.sqrt(3.0)
    close(warm[0], 1.0 / (1.0 + root)); close(warm[1], root / (1.0 + root))
    shifted = m.decode_distribution([10.0, 10.0 + math.log(3.0)], 1.0, 1.0)
    close(shifted[0], 0.25); close(shifted[1], 0.75)
    close(sum(m.decode_distribution([3.0, 1.0, 0.5], 0.7, 0.9)), 1.0)
    bad = ([], 1.0, 0.5), ([float("nan")], 1.0, 0.5), ([0.0], 0.0, 0.5), ([0.0], 1.0, 0.0), ([0.0], 1.0, 1.5)
    for values, temperature, nucleus in bad:
        try:
            m.decode_distribution(values, temperature, nucleus)
        except ValueError:
            continue
        raise AssertionError("invalid decoding input should be rejected")


def diffusion(m):
    coefficients = m.forward_diffusion_coefficients([0.5, 0.5])
    assert len(coefficients) == 2
    close(coefficients[0][0], 0.5)
    close(coefficients[0][1], math.sqrt(0.5))
    close(coefficients[0][2], math.sqrt(0.5))
    close(coefficients[1][0], 0.25)
    close(coefficients[1][1], 0.5)
    close(coefficients[1][2], math.sqrt(0.75))
    for alpha_bar, signal, noise in m.forward_diffusion_coefficients([0.1, 0.2, 0.3]):
        close(signal * signal + noise * noise, 1.0)
    decreasing = [step[0] for step in m.forward_diffusion_coefficients([0.05] * 5)]
    assert all(later < earlier for earlier, later in zip(decreasing, decreasing[1:]))
    for bad in ([], [0.0], [1.0], [-0.2], [float("nan")]):
        try:
            m.forward_diffusion_coefficients(bad)
        except ValueError:
            continue
        raise AssertionError("invalid beta schedule should be rejected")


def backdoor(m):
    balanced = [(10, 1.0, 10, 0.0), (10, 3.0, 10, 1.0)]
    crude, adjusted = m.backdoor_adjustment(balanced)
    close(crude, 1.5)
    close(adjusted, 1.5)
    simpson = [(10, 0.90, 90, 0.86), (90, 0.62, 10, 0.55)]
    before = list(simpson)
    crude, adjusted = m.backdoor_adjustment(simpson)
    close(crude, -0.181)
    close(adjusted, 0.055)
    assert crude < 0 < adjusted
    assert simpson == before
    close(m.backdoor_adjustment([(5, 2.0, 7, 1.0)])[0], 1.0)
    close(m.backdoor_adjustment([(5, 2.0, 7, 1.0)])[1], 1.0)
    close(m.backdoor_adjustment(iter(simpson))[1], 0.055)
    bad = (
        [],
        [(0, 1.0, 5, 0.0)],
        [(5, 1.0, 5)],
        [(5, float("nan"), 5, 0.0)],
        [(5.0, 1.0, 5, 0.0)],
    )
    for strata in bad:
        try:
            m.backdoor_adjustment(strata)
        except ValueError:
            continue
        raise AssertionError("invalid strata should be rejected")


def ipw(m):
    treatments = [1, 1, 0, 0]
    outcomes = [4.0, 6.0, 1.0, 3.0]
    horvitz_thompson, hajek, effective = m.ipw_ate(treatments, outcomes, [0.5] * 4)
    close(horvitz_thompson, 3.0)
    close(hajek, 3.0)
    close(effective, 4.0)

    scores = [0.25, 0.5, 0.5, 0.8]
    before = list(outcomes)
    horvitz_thompson, hajek, effective = m.ipw_ate(treatments, outcomes, scores)
    close(horvitz_thompson, 2.75)
    close(hajek, 28 / 6 - 17 / 7)
    close(effective, 169 / 49)
    assert outcomes == before
    shifted = [value + 10.0 for value in outcomes]
    shifted_horvitz, shifted_hajek, _ = m.ipw_ate(treatments, shifted, scores)
    close(shifted_hajek, hajek)
    assert abs(shifted_horvitz - horvitz_thompson) > 1.0

    confounded = [1] * 8 + [0] * 2 + [1] * 2 + [0] * 8
    logged = [2.0] * 8 + [0.0] * 2 + [12.0] * 2 + [10.0] * 8
    propensities = [0.8] * 10 + [0.2] * 10
    horvitz_thompson, hajek, effective = m.ipw_ate(
        iter(confounded), iter(logged), iter(propensities)
    )
    close(horvitz_thompson, 2.0)
    close(hajek, 2.0)
    close(effective, 12.8)

    bad = (
        ([1, 0], [1.0, 2.0], [0.5]),
        ([1, 1], [1.0, 2.0], [0.5, 0.5]),
        ([1, 2], [1.0, 2.0], [0.5, 0.5]),
        ([1, 0], [1.0, float("inf")], [0.5, 0.5]),
        ([1, 0], [1.0, 2.0], [0.0, 0.5]),
        ([1, 0], [1.0, 2.0], [0.5, 1.0]),
        ([], [], []),
    )
    for assignments, values, weights in bad:
        try:
            m.ipw_ate(assignments, values, weights)
        except ValueError:
            continue
        raise AssertionError("invalid weighting inputs should be rejected")


def iv_wald(m):
    intention, first_stage, late = m.wald_iv_estimate(
        [1, 1, 0, 0], [1, 1, 0, 0], [5.0, 7.0, 1.0, 3.0]
    )
    close(intention, 4.0)
    close(first_stage, 1.0)
    close(late, 4.0)

    instruments = [1, 1, 1, 1, 0, 0, 0, 0]
    uptake = [1, 1, 0, 0, 0, 0, 0, 0]
    outcomes = [6.0, 6.0, 2.0, 2.0, 2.0, 2.0, 2.0, 2.0]
    before = list(outcomes)
    intention, first_stage, late = m.wald_iv_estimate(instruments, uptake, outcomes)
    close(intention, 2.0)
    close(first_stage, 0.5)
    close(late, 4.0)
    assert outcomes == before

    weak_instruments = [1] * 10 + [0] * 10
    weak_uptake = [1] + [0] * 19
    weak_outcomes = [4.0] + [0.0] * 19
    intention, first_stage, late = m.wald_iv_estimate(
        iter(weak_instruments), iter(weak_uptake), iter(weak_outcomes)
    )
    close(intention, 0.4)
    close(first_stage, 0.1)
    close(late, 4.0)

    bad = (
        ([1, 1, 0, 0], [1, 0, 1, 0], [1.0, 2.0, 3.0, 4.0]),
        ([1, 1, 1, 1], [1, 1, 0, 0], [1.0, 2.0, 3.0, 4.0]),
        ([1, 0], [1, 0], [1.0]),
        ([1, 0], [2, 0], [1.0, 2.0]),
        ([1, 0], [1, 0], [float("nan"), 2.0]),
        ([], [], []),
    )
    for assigned, taken, values in bad:
        try:
            m.wald_iv_estimate(assigned, taken, values)
        except ValueError:
            continue
        raise AssertionError("invalid instrument inputs should be rejected")


def em_step(m):
    data = [0.0, 2.0, 4.0]
    before = list(data)
    log_likelihood, pis, mus, sigmas = m.em_step_gaussian_mixture(
        data, [0.5, 0.5], [2.0, 2.0], [1.0, 1.0]
    )
    close(
        log_likelihood,
        math.fsum(
            -0.5 * math.log(2.0 * math.pi) - 0.5 * (value - 2.0) ** 2 for value in data
        ),
    )
    close(pis[0], 0.5)
    close(pis[1], 0.5)
    close(mus[0], 2.0)
    close(mus[1], 2.0)
    close(sigmas[0], 8 / 3)
    close(sigmas[1], 8 / 3)
    assert data == before

    separated = [-10.0, -9.0, 9.0, 10.0]
    _, pis, mus, sigmas = m.em_step_gaussian_mixture(
        iter(separated), [0.5, 0.5], [-10.0, 10.0], [1.0, 1.0]
    )
    close(pis[0], 0.5)
    close(mus[0], -9.5)
    close(mus[1], 9.5)
    close(sigmas[0], 0.25)
    close(sigmas[1], 0.25)

    far, _, far_means, far_variances = m.em_step_gaussian_mixture(
        [0.0], [0.5, 0.5], [-300.0, 300.0], [1.0, 1.0]
    )
    close(far, -0.5 * math.log(2.0 * math.pi) - 45000.0)
    close(far_means[0], 0.0)
    close(far_variances[1], 0.0)

    sample = [0.0, 0.5, 1.0, 4.0, 4.5, 5.0]
    pis, mus, sigmas = [0.5, 0.5], [1.0, 4.0], [1.0, 1.0]
    previous = None
    for _ in range(5):
        log_likelihood, pis, mus, sigmas = m.em_step_gaussian_mixture(sample, pis, mus, sigmas)
        if previous is not None:
            assert log_likelihood >= previous - 1e-9, (log_likelihood, previous)
        previous = log_likelihood

    bad = (
        ([], [1.0], [0.0], [1.0]),
        ([0.0], [0.5, 0.5], [0.0], [1.0, 1.0]),
        ([0.0], [0.4, 0.4], [0.0, 1.0], [1.0, 1.0]),
        ([0.0], [0.5, 0.5], [0.0, 1.0], [1.0, 0.0]),
        ([0.0], [0.5, 0.5], [0.0, 1.0], [1.0, -1.0]),
        ([float("nan")], [1.0], [0.0], [1.0]),
        ([0.0, 0.0], [0.5, 0.5], [0.0, 1000.0], [1.0, 1.0]),
    )
    for observations, weights, means, variances in bad:
        try:
            m.em_step_gaussian_mixture(observations, weights, means, variances)
        except ValueError:
            continue
        raise AssertionError("invalid mixture step inputs should be rejected")


def hmm_forward(m):
    log_likelihood, filtered = m.hmm_forward([1.0], [[1.0]], [[0.5], [0.25]])
    close(log_likelihood, math.log(0.125))
    close(filtered[0], 1.0)

    emissions = [[0.6, 0.4], [0.2, 0.8]]
    before = [list(row) for row in emissions]
    log_likelihood, filtered = m.hmm_forward(
        [0.5, 0.5], [[0.5, 0.5], [0.5, 0.5]], emissions
    )
    close(log_likelihood, 2.0 * math.log(0.5))
    close(filtered[0], 0.2)
    close(filtered[1], 0.8)
    assert emissions == before

    log_likelihood, filtered = m.hmm_forward(
        [1.0, 0.0], [[0.0, 1.0], [1.0, 0.0]], iter([[0.5, 0.1], [0.3, 0.7]])
    )
    close(log_likelihood, math.log(0.35))
    close(filtered[0], 0.0)
    close(filtered[1], 1.0)

    long_run, filtered = m.hmm_forward([1.0], [[1.0]], [[0.5]] * 2000)
    close(long_run, 2000.0 * math.log(0.5))
    close(filtered[0], 1.0)

    bad = (
        ([1.0], [[1.0]], [[0.0]]),
        ([1.0, 0.0], [[1.0, 0.0], [0.0, 1.0]], [[0.5, 0.5], [0.0, 0.9]]),
        ([1.0], [[1.0]], []),
        ([], [], [[]]),
        ([0.5, 0.4], [[0.5, 0.5], [0.5, 0.5]], [[1.0, 1.0]]),
        ([0.5, 0.5], [[0.5, 0.4], [0.5, 0.5]], [[1.0, 1.0]]),
        ([0.5, 0.5], [[0.5, 0.5]], [[1.0, 1.0]]),
        ([0.5, 0.5], [[0.5, 0.5], [0.5, 0.5]], [[1.0]]),
        ([0.5, 0.5], [[0.5, 0.5], [0.5, 0.5]], [[1.0, -1.0]]),
    )
    for start, matrix, steps in bad:
        try:
            m.hmm_forward(start, matrix, steps)
        except ValueError:
            continue
        raise AssertionError("invalid hidden Markov inputs should be rejected")


def d_separation(m):
    chain = [("a", "b"), ("b", "c")]
    before = list(chain)
    assert not m.d_separated(chain, "a", "c", [])
    assert m.d_separated(chain, "a", "c", ["b"])
    assert chain == before

    fork = [("b", "a"), ("b", "c")]
    assert not m.d_separated(fork, "a", "c", [])
    assert m.d_separated(fork, "a", "c", ["b"])

    collider = [("a", "b"), ("c", "b")]
    assert m.d_separated(collider, "a", "c", [])
    assert not m.d_separated(collider, "a", "c", ["b"])

    descendant = [("a", "b"), ("c", "b"), ("b", "d")]
    assert m.d_separated(iter(descendant), "a", "c", [])
    assert not m.d_separated(descendant, "a", "c", ["d"])

    m_bias = [("u1", "t"), ("u1", "z"), ("u2", "z"), ("u2", "y")]
    assert m.d_separated(m_bias, "t", "y", [])
    assert not m.d_separated(m_bias, "t", "y", ["z"])

    two_paths = [("a", "b"), ("b", "c"), ("a", "d"), ("d", "c")]
    assert not m.d_separated(two_paths, "a", "c", ["b"])
    assert m.d_separated(two_paths, "a", "c", ["b", "d"])

    bad = (
        ([("a", "b"), ("b", "a")], "a", "b", []),
        ([("a", "b")], "a", "z", []),
        ([("a", "b")], "a", "a", []),
        ([("a", "b"), ("b", "c")], "a", "c", ["z"]),
        ([("a", "b"), ("b", "c")], "a", "c", ["a"]),
        ([("a", "a")], "a", "a", []),
        ([], "a", "b", []),
        ([("a", "b", "c")], "a", "b", []),
    )
    for graph, start, end, given in bad:
        try:
            m.d_separated(graph, start, end, given)
        except ValueError:
            continue
        raise AssertionError("invalid d-separation inputs should be rejected")


def dkw_band(m):
    samples = [1.0, 2.0, 3.0, 4.0]
    before = list(samples)
    width = math.sqrt(math.log(40.0) / 8.0)
    band = m.ecdf_dkw_band(samples, 0.05, [0.5, 1.0, 2.5, 4.0, 9.0])
    assert len(band) == 5
    for triple, expected in zip(band, [0.0, 0.25, 0.5, 1.0, 1.0]):
        close(triple[0], expected)
        close(triple[1], min(1.0, max(0.0, expected - width)))
        close(triple[2], min(1.0, max(0.0, expected + width)))
    assert samples == before

    wide = [float(value) for value in range(1, 101)]
    narrow = math.sqrt(math.log(40.0) / 200.0)
    estimate, lower, upper = m.ecdf_dkw_band(iter(wide), 0.05, iter([50.0]))[0]
    close(estimate, 0.5)
    close(lower, 0.5 - narrow)
    close(upper, 0.5 + narrow)
    close(upper - lower, 2.0 * narrow)

    ordered = m.ecdf_dkw_band(wide, 0.2, [10.0, 20.0, 30.0, 90.0])
    assert all(
        earlier[0] <= later[0] for earlier, later in zip(ordered, ordered[1:])
    )
    assert m.ecdf_dkw_band(samples, 0.5, []) == []

    bad = (
        ([], 0.05, [0.0]),
        ([1.0], 0.0, [0.0]),
        ([1.0], 1.0, [0.0]),
        ([1.0], -0.2, [0.0]),
        ([1.0], float("nan"), [0.0]),
        ([float("inf")], 0.05, [0.0]),
        ([1.0], 0.05, [float("nan")]),
    )
    for values, level, queries in bad:
        try:
            m.ecdf_dkw_band(values, level, queries)
        except ValueError:
            continue
        raise AssertionError("invalid band inputs should be rejected")


def mann_whitney(m):
    first = [4.0, 5.0, 6.0]
    second = [1.0, 2.0, 3.0]
    before = list(first)
    statistic, theta, z_score = m.mann_whitney_u(first, second)
    close(statistic, 9.0)
    close(theta, 1.0)
    close(z_score, 4.5 / math.sqrt(5.25))
    assert first == before

    reversed_statistic, reversed_theta, reversed_z = m.mann_whitney_u(second, first)
    close(reversed_statistic, 0.0)
    close(reversed_theta, 0.0)
    close(reversed_z, -4.5 / math.sqrt(5.25))
    close(statistic + reversed_statistic, 9.0)

    tied_statistic, tied_theta, tied_z = m.mann_whitney_u([2.0, 2.0], [2.0, 2.0])
    close(tied_statistic, 2.0)
    close(tied_theta, 0.5)
    close(tied_z, 0.0)

    statistic, theta, z_score = m.mann_whitney_u(iter([1.0, 2.0, 2.0]), iter([2.0, 3.0]))
    close(statistic, 1.0)
    close(theta, 1 / 6)
    close(z_score, -2.0 / math.sqrt(0.5 * (6.0 - 24.0 / 20.0)))

    shifted = m.mann_whitney_u([3.0, 9.0, 27.0], [1.0, 81.0])
    logged = m.mann_whitney_u(
        [math.log(3.0), math.log(9.0), math.log(27.0)], [math.log(1.0), math.log(81.0)]
    )
    close(shifted[0], logged[0])
    close(shifted[1], logged[1])
    close(shifted[2], logged[2])

    bad = (
        ([], [1.0]),
        ([1.0], []),
        ([float("nan")], [1.0]),
        ([1.0], [float("inf")]),
    )
    for left, right in bad:
        try:
            m.mann_whitney_u(left, right)
        except ValueError:
            continue
        raise AssertionError("invalid rank-sum inputs should be rejected")


def kde(m):
    samples = [0.0]
    before = list(samples)
    estimates = m.gaussian_kde(samples, 1.0, [0.0, 1.0])
    close(estimates[0], 1.0 / math.sqrt(2.0 * math.pi))
    close(estimates[1], math.exp(-0.5) / math.sqrt(2.0 * math.pi))
    assert samples == before

    close(
        m.gaussian_kde([-1.0, 1.0], 1.0, [0.0])[0],
        math.exp(-0.5) / math.sqrt(2.0 * math.pi),
    )

    base = m.gaussian_kde([-1.0, 0.0, 2.0], 0.7, [-0.5, 0.0, 1.5])
    shifted = m.gaussian_kde([9.0, 10.0, 12.0], 0.7, [9.5, 10.0, 11.5])
    for plain, moved in zip(base, shifted):
        close(plain, moved)
    scaled = m.gaussian_kde([-3.0, 0.0, 6.0], 2.1, [-1.5, 0.0, 4.5])
    for plain, stretched in zip(base, scaled):
        close(plain, 3.0 * stretched)

    step = 0.005
    grid = [-10.0 + step * index for index in range(4001)]
    mass = math.fsum(m.gaussian_kde(iter([-1.0, 0.0, 2.0]), 0.5, iter(grid))) * step
    close(mass, 1.0, tol=1e-6)
    assert m.gaussian_kde([0.0], 1.0, [40.0])[0] < 1e-300
    assert m.gaussian_kde([0.0], 1.0, []) == []

    bad = (
        ([], 1.0, [0.0]),
        ([0.0], 0.0, [0.0]),
        ([0.0], -1.0, [0.0]),
        ([0.0], float("inf"), [0.0]),
        ([float("nan")], 1.0, [0.0]),
        ([0.0], 1.0, [float("inf")]),
    )
    for values, width, queries in bad:
        try:
            m.gaussian_kde(values, width, queries)
        except ValueError:
            continue
        raise AssertionError("invalid density inputs should be rejected")


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


def _projection_rejects(fn, *args):
    try:
        fn(*args)
    except ValueError:
        return
    raise AssertionError("invalid or numerically rejected input must raise ValueError")


def project_onto(m):
    columns = [[1., 0., 1.], [0., 1., 1.]]
    goal = [1., 1., 0.]
    before = [row[:] for row in columns], goal[:]
    p, point, residual = m.project_onto(columns, goal)
    for a, b in zip(point, [1/3, 1/3, 2/3]):
        close(a, b)
    for i in range(3):
        close(point[i] + residual[i], goal[i])
        for j in range(3):
            close(p[i][j], p[j][i])
            close(sum(p[i][k] * p[k][j] for k in range(3)), p[i][j])
    for column in columns:
        close(sum(a * b for a, b in zip(column, residual)), 0.)
        for a, b in zip(matvec(p, column), column):
            close(a, b)
    assert (columns, goal) == before
    changed = [[1., 0., 1.], [1., 2., 3.]]
    other, _, _ = m.project_onto(changed, goal)
    for row, expected in zip(other, p):
        for a, b in zip(row, expected):
            close(a, b)
    _, line, rest = m.project_onto([[1., 1.]], [2., 0.])
    assert all(abs(a-b) < 1e-8 for a,b in zip(line, [1.,1.]))
    assert all(abs(a-b) < 1e-8 for a,b in zip(rest, [1.,-1.]))
    _, zero, rest = m.project_onto(columns, [0.,0.,0.])
    assert zero == [0.,0.,0.] and rest == [0.,0.,0.]
    for basis, target, tol in [(None, [1.], 1e-9), ([], [], 1e-9), ([[1.,2.],[2.,4.]], [1.,0.], 1e-9),
        ([[1.,0.],[1.,1e-8]], [1.,0.], 1e-9), ([[1.,2.],[3.]], [1.,0.], 1e-9),
        ([[1.,2.]], [1.], 1e-9), ([[True,0.]], [0.,0.], 1e-9),
        ([[1.,0.]], [float('nan'),0.], 1e-9), ([[1.,0.]], [0.,0.], 0.)]:
        _projection_rejects(m.project_onto, basis, target, tol)


def normal_equations(m):
    rows, target = [[1.,0.],[1.,1.],[1.,2.]], [1.,2.,2.]
    before = [r[:] for r in rows], target[:]
    w, residual, error = m.normal_equations(rows, target)
    close(w[0], 7/6); close(w[1], .5); close(error, 1/6)
    for actual, expected in zip(residual, [-1/6,1/3,-1/6]):
        close(actual, expected)
    for j in range(2):
        close(sum(row[j]*r for row,r in zip(rows,residual)), 0.)
    assert (rows,target) == before
    for a, b, expected in [([[1.],[1.]], [0.,2.], [1.]),
                           ([[1.,0.],[0.,2.]], [3.,4.], [3.,2.]),
                           (rows, [1.,3.,5.], [1.,2.])]:
        w, residual, error = m.normal_equations(a,b)
        for x,y in zip(w,expected): close(x,y)
        close(error, sum(r*r for r in residual))
        for row,value,r in zip(a,b,residual): close(sum(x*y for x,y in zip(row,w))+r,value)
    for a,b,tol in [([[1.,1.],[2.,2.]], [1.,0.], 1e-9),
        ([[1.,1.],[0.,1e-8]], [1.,0.], 1e-9), ([[1.,2.]], [1.], 1e-9),
        ([[1.],[2.]], [1.], 1e-9), ([[1.],[float('inf')]], [1.,2.], 1e-9),
        ([[1.]], [True], 1e-9), ([[1.]], [1.], float('nan'))]:
        _projection_rejects(m.normal_equations,a,b,tol)


def gram_metric(m):
    g,u,v = [[2.,1.],[1.,2.]], [1.,2.], [3.,-1.]
    before = [r[:] for r in g],u[:],v[:]
    close(m.gram_metric(g,u,v),7.)
    close(m.gram_metric(g,v,u),7.)
    close(m.gram_metric(g,[u[0]+v[0],u[1]+v[1]],v),
          m.gram_metric(g,u,v)+m.gram_metric(g,v,v))
    close(m.gram_metric(g,[2*x for x in u],v),14.)
    close(m.gram_metric(g,[0.,0.],v),0.)
    close(m.gram_metric([[1.,0.],[0.,4.]],[1.,1.],[1.,-1.]),-3.)
    assert (g,u,v) == before
    for bad in [[[1.,2.],[2.,1.]], [[-1.,0.],[0.,-1.]], [[1.,0.],[0.,0.]],
                [[1.,0.],[1.,1.]], [[1.,0.],[0.,1e-12]], [[1.,float('nan')],[0.,1.]]]:
        _projection_rejects(m.gram_metric,bad,[1.,0.],[1.,0.])
    close(m.gram_metric([[1.,0.],[0.,1e-12]],[0.,1.],[0.,1.],1e-15),1e-12)
    _projection_rejects(m.gram_metric,g,[1.],v)
    _projection_rejects(m.gram_metric,g,u,[True,1.])
    _projection_rejects(m.gram_metric,g,u,v,-1.)
    _projection_rejects(m.gram_metric,[],[],[])


def _check_qr_factors(rows, q, r, tol=1e-8):
    height, width = len(rows), len(rows[0])
    assert len(q) == height and all(len(row) == width for row in q)
    assert len(r) == width and all(len(row) == width for row in r)
    assert all(r[i][i] > 0 for i in range(width))
    for i in range(width):
        for j in range(width):
            close(sum(row[i]*row[j] for row in q), float(i == j), tol)
            if i > j: close(r[i][j], 0., tol)
    for i in range(height):
        for j in range(width):
            close(sum(q[i][k]*r[k][j] for k in range(width)), rows[i][j], tol)


def gram_schmidt(m):
    fixtures = [[[1.,1.],[1.,0.],[0.,1.]], [[3.,1.],[0.,2.],[0.,0.]],
                [[2.]], [[-3.],[4.]], [[1.,0.,0.],[0.,2.,0.],[0.,0.,3.]],
                [[1.,2.,0.],[0.,1.,1.],[1.,0.,2.],[2.,1.,1.]]]
    for rows in fixtures:
        before = [row[:] for row in rows]
        classical, modified = m.gram_schmidt(rows)
        for q,r in (classical,modified): _check_qr_factors(rows,q,r)
        assert rows == before
    # A deterministic float64 case distinguishes the two requested algorithms.
    eps = 1e-8
    rows = [[1.,1.,1.],[eps,eps,0.],[eps,0.,eps]]
    (qc,rc),(qm,rm) = m.gram_schmidt(rows)
    def overlap(q):
        return max(abs(sum(row[i]*row[j] for row in q))
                   for i in range(3) for j in range(i+1,3))
    assert overlap(qc) > .1, "return actual classical GS, not two copies of MGS"
    assert overlap(qm) < 1e-6, "modified GS must project the updated residual"
    for q,r in ((qc,rc),(qm,rm)):
        for i in range(3):
            for j in range(3): close(sum(q[i][k]*r[k][j] for k in range(3)),rows[i][j])
    for rows in [[], [[]], [[1.],[2.,3.]], [[1.,2.]], [[0.],[0.]],
                 [[1.,2.],[0.,0.]], [[True]], [[float('nan')]], None]:
        _projection_rejects(m.gram_schmidt,rows)
    for tol in [0., -1., float('inf'), float('nan'), True]:
        _projection_rejects(m.gram_schmidt,[[1.]],tol)
    _projection_rejects(m.gram_schmidt,[[1.,0.],[0.,1e-13]])
    for q,r in m.gram_schmidt([[1.,0.],[0.,1e-13]],1e-15):
        _check_qr_factors([[1.,0.],[0.,1e-13]],q,r)


def qr_solve(m):
    for rows,b,expected in [([[1.,0.],[1.,1.],[1.,2.]],[1.,2.,2.],[7/6,.5]),
                            ([[1.],[1.],[1.]],[1.,2.,3.],[2.]),
                            ([[2.,1.],[0.,3.]],[5.,3.],[2.,1.]),
                            ([[1.,1.],[0.,1e-8]],[2.,1e-8],[1.,1.]),
                            ([[1.,1.,1.],[1e-8,1e-8,0.],[1e-8,0.,1e-8]],
                             [6.,3e-8,4e-8],[1.,2.,3.]),
                            ([[1.,0.],[0.,1.],[1.,1.]],[0.,0.,0.],[0.,0.]),
                            ([[1.,0.],[1.,1.],[1.,2.]],[1.,3.,5.],[1.,2.])]:
        before = [row[:] for row in rows], b[:]
        x,r,sse = m.qr_solve(rows,b)
        assert len(x) == len(expected) and len(r) == len(b)
        for actual,want in zip(x,expected): close(actual,want)
        close(sse,sum(z*z for z in r))
        for row,y,err in zip(rows,b,r): close(sum(a*c for a,c in zip(row,x))+err,y)
        for j in range(len(x)): close(sum(row[j]*err for row,err in zip(rows,r)),0.)
        assert (rows,b) == before
    for rows,b in [([[1.,1.],[2.,2.]],[1.,2.]), ([[1.,2.]],[1.]),
                   ([[1.]],[1.,2.]), ([[1.]],[True]), ([[float('inf')]],[1.]),
                   ([[1.]],None), ([],[]), ([[1.,0.],[0.,1e-13]],[1.,1.])]:
        _projection_rejects(m.qr_solve,rows,b)
    for tol in [0.,-1.,float('nan'),float('inf'),True]:
        _projection_rejects(m.qr_solve,[[1.]],[1.],tol)
    x,r,error=m.qr_solve([[1.,0.],[0.,1e-13]],[1.,1e-13],1e-15)
    for z in x: close(z,1.)


def orthogonality_defect(m):
    for rows,expected in [([[1.,0.],[0.,1.]],0.), ([[2.,0.],[0.,3.]],0.),
                          ([[0.,0.]],0.), ([[3.],[4.]],0.),
                          ([[1.,1.],[0.,1.]],1.), ([[1.,2.,-3.]],6.),
                          ([[1.,1.],[1.,-1.]],0.), ([[1.,-.5],[0.,1.]],.5)]:
        before = [row[:] for row in rows]
        close(m.orthogonality_defect(rows),expected)
        assert rows == before
    for bad in [[], [[]], [[1.],[1.,2.]], [[True]], [[float('inf')]],
                [[float('nan')]], None]:
        _projection_rejects(m.orthogonality_defect,bad)


CHECKS = {"moments": moments, "conditional": conditional,
          "categorical": categorical, "joint": joint,
          "convolution": convolution, "gaussian": gaussian,
          "monte-carlo": monte_carlo,
          "bernoulli-mle": bernoulli_mle,
          "binomial-test": binomial_test,
          "bh-fdr": bh_fdr,
          "bootstrap": bootstrap,
          "permutation": permutation,
          "e-process": e_process,
          "beta-update": beta_update,
          "importance": importance,
          "metropolis": metropolis,
          "stratified": stratified,
          "horvitz-thompson": horvitz_thompson,
          "rejection": rejection,
          "simple-ols": simple_ols,
          "logistic-gradient": logistic_gradient,
          "partial-pooling": partial_pooling,
          "projection": projection,
          "calibration": calibration,
          "conformal": conformal,
          "elbo-terms": elbo_terms,
          "gumbel": gumbel,
          "decoding": decoding,
          "diffusion": diffusion,
          "backdoor": backdoor,
          "ipw": ipw,
          "iv-wald": iv_wald,
          "em-step": em_step,
          "hmm-forward": hmm_forward,
          "d-separation": d_separation,
          "dkw-band": dkw_band,
          "mann-whitney": mann_whitney,
          "kde": kde,
          "span": span, "dependence": dependence,
          "echelon": echelon, "solve-complete": solve_complete, "lu": lu,
          "coordinates": coordinates,
          "project-onto": project_onto, "normal-equations": normal_equations, "gram-metric": gram_metric,
          "gram-schmidt": gram_schmidt, "qr-solve": qr_solve, "orthogonality-defect": orthogonality_defect,
          "search": search, "softmax": softmax,
          "bigram": bigram, "attention": attention, "bellman": bellman}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("task", nargs="?", choices=CHECKS)
    parser.add_argument("--reference", action="store_true")
    args = parser.parse_args()
    module = importlib.import_module("labs.reference" if args.reference else "labs.exercises")
    selected = {args.task: CHECKS[args.task]} if args.task else CHECKS
    failures = []
    for name, check in selected.items():
        try:
            check(module)
            print("PASS", name)
        except Exception as error:
            failures.append(name)
            print("FAIL", name, type(error).__name__, str(error))
    raise SystemExit(bool(failures))


if __name__ == "__main__":
    main()
