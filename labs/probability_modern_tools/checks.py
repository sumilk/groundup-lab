"""Behavioral checks for Probability and statistics, Part III · Modern statistical tools (PS12–PS18).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import math
import random

from labs.check_helpers import close


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
    # Extreme but finite inputs satisfy the contract and must not raise.
    assert m.gaussian_kde([1e200], 1.0, [0.0])[0] == 0.0
    assert m.gaussian_kde([0.0, 1e200], 1e-200, [0.0])[0] > 0.0

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
