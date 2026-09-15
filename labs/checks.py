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
