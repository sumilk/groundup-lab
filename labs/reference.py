"""Reference implementations. Attempt exercises.py before reading."""
import math
import random


def streaming_moments(values):
    count, mean, m2 = 0, 0.0, 0.0
    for value in values:
        if not math.isfinite(value):
            raise ValueError("finite observations required")
        count += 1
        delta = value - mean
        mean += delta / count
        m2 += delta * (value - mean)
    if count < 2:
        raise ValueError("at least two observations required")
    return count, mean, m2 / (count - 1)


def conditional_probability(weights, event, given):
    if not weights:
        raise ValueError("nonempty sample space required")
    if any(not math.isfinite(weight) or weight < 0 for weight in weights.values()):
        raise ValueError("finite nonnegative weights required")
    total = sum(weights.values())
    if total <= 0:
        raise ValueError("positive total weight required")
    event, given = set(event), set(given)
    outcomes = set(weights)
    if not event <= outcomes or not given <= outcomes:
        raise ValueError("events must contain known outcomes")
    given_mass = sum(weights[outcome] for outcome in given)
    if given_mass <= 0:
        raise ValueError("conditioning event must have positive probability")
    joint_mass = sum(weights[outcome] for outcome in event & given)
    return joint_mass / given_mass


def sample_categorical(weights, draws, seed):
    if not weights:
        raise ValueError("nonempty weights required")
    if any(not math.isfinite(weight) or weight < 0 for weight in weights):
        raise ValueError("finite nonnegative weights required")
    total = math.fsum(weights)
    if total <= 0:
        raise ValueError("positive total weight required")
    if isinstance(draws, bool) or not isinstance(draws, int) or draws < 0:
        raise ValueError("draws must be a nonnegative integer")
    if isinstance(seed, bool) or not isinstance(seed, int):
        raise ValueError("seed must be an integer")

    cumulative = []
    running = 0.0
    last_positive = None
    for index, weight in enumerate(weights):
        running += weight
        cumulative.append(running)
        if weight > 0:
            last_positive = index

    generator = random.Random(seed)
    samples = []
    for _ in range(draws):
        threshold = generator.random() * total
        for index, boundary in enumerate(cumulative):
            if threshold < boundary:
                samples.append(index)
                break
        else:
            # Protect against a final-boundary rounding discrepancy.
            samples.append(last_positive)
    return samples


def joint_marginals_covariance(weights):
    if not weights:
        raise ValueError("nonempty joint distribution required")

    for pair, weight in weights.items():
        if not isinstance(pair, tuple) or len(pair) != 2:
            raise ValueError("joint outcomes must be (x, y) pairs")
        x, y = pair
        if (isinstance(x, bool) or isinstance(y, bool)
                or not isinstance(x, (int, float)) or not isinstance(y, (int, float))
                or not math.isfinite(x) or not math.isfinite(y)):
            raise ValueError("joint coordinates must be finite numbers")
        if not isinstance(weight, (int, float)) or not math.isfinite(weight) or weight < 0:
            raise ValueError("joint weights must be finite and nonnegative")

    total = math.fsum(weights.values())
    if total <= 0:
        raise ValueError("positive total joint weight required")

    marginal_x, marginal_y = {}, {}
    for (x, y), weight in weights.items():
        probability = weight / total
        marginal_x[x] = marginal_x.get(x, 0.0) + probability
        marginal_y[y] = marginal_y.get(y, 0.0) + probability

    mean_x = math.fsum(x * probability for x, probability in marginal_x.items())
    mean_y = math.fsum(y * probability for y, probability in marginal_y.items())
    covariance = math.fsum(
        (x - mean_x) * (y - mean_y) * weight / total
        for (x, y), weight in weights.items()
    )
    return marginal_x, marginal_y, covariance


def discrete_convolution(left, right):
    def validate(weights):
        if not weights:
            raise ValueError("nonempty distribution required")
        for value, weight in weights.items():
            if (isinstance(value, bool) or not isinstance(value, (int, float))
                    or not math.isfinite(value)):
                raise ValueError("support values must be finite numbers")
            if (isinstance(weight, bool) or not isinstance(weight, (int, float))
                    or not math.isfinite(weight) or weight < 0):
                raise ValueError("weights must be finite and nonnegative")
        total = math.fsum(weights.values())
        if total <= 0:
            raise ValueError("positive total weight required")
        return total

    total_left, total_right = validate(left), validate(right)
    result = {}
    for value_left, weight_left in left.items():
        for value_right, weight_right in right.items():
            mass = weight_left * weight_right
            if mass > 0:
                summed = value_left + value_right
                result[summed] = result.get(summed, 0.0) + mass
    normalizer = total_left * total_right
    return {value: mass / normalizer for value, mass in result.items()}


def condition_bivariate_gaussian(
    mean_x, mean_y, variance_x, variance_y, covariance, observed_y
):
    values = (mean_x, mean_y, variance_x, variance_y, covariance, observed_y)
    if any(isinstance(value, bool) or not isinstance(value, (int, float))
           or not math.isfinite(value) for value in values):
        raise ValueError("finite numeric Gaussian parameters required")
    if variance_x <= 0 or variance_y <= 0:
        raise ValueError("positive marginal variances required")
    if variance_x * variance_y - covariance * covariance <= 0:
        raise ValueError("positive-definite covariance matrix required")
    conditional_mean = mean_x + covariance / variance_y * (observed_y - mean_y)
    conditional_variance = variance_x - covariance * covariance / variance_y
    return conditional_mean, conditional_variance


def batch_means_standard_error(values, batch_size):
    if isinstance(batch_size, bool) or not isinstance(batch_size, int) or batch_size <= 0:
        raise ValueError("batch size must be a positive integer")

    observations = list(values)
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in observations
    ):
        raise ValueError("finite numeric observations required")
    if len(observations) % batch_size != 0:
        raise ValueError("batch size must divide the observation count")

    batch_count = len(observations) // batch_size
    if batch_count < 2:
        raise ValueError("at least two complete batches required")

    batch_means = [
        math.fsum(observations[start:start + batch_size]) / batch_size
        for start in range(0, len(observations), batch_size)
    ]
    estimate = math.fsum(batch_means) / batch_count
    batch_variance = math.fsum(
        (batch_mean - estimate) ** 2 for batch_mean in batch_means
    ) / (batch_count - 1)
    standard_error = math.sqrt(batch_variance / batch_count)
    return estimate, standard_error


def bernoulli_mle(outcomes):
    observations = list(outcomes)
    if not observations:
        raise ValueError("at least one Bernoulli observation required")
    if any(
        isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1)
        for value in observations
    ):
        raise ValueError("Bernoulli observations must be integer zeros and ones")

    count = len(observations)
    successes = sum(observations)
    failures = count - successes
    estimate = successes / count

    log_likelihood = 0.0
    if successes:
        log_likelihood += successes * math.log(estimate)
    if failures:
        log_likelihood += failures * math.log1p(-estimate)

    standard_error = math.sqrt(estimate * (1.0 - estimate) / count)
    return estimate, log_likelihood, standard_error


def exact_binomial_test(
    successes, trials, null_probability, confidence_level=0.95,
    alternative="two-sided"
):
    if isinstance(successes, bool) or not isinstance(successes, int):
        raise ValueError("successes must be an integer")
    if isinstance(trials, bool) or not isinstance(trials, int) or trials <= 0:
        raise ValueError("trials must be a positive integer")
    if successes < 0 or successes > trials:
        raise ValueError("successes must lie between zero and trials")
    if (
        isinstance(null_probability, bool)
        or not isinstance(null_probability, (int, float))
        or not math.isfinite(null_probability)
        or not 0 <= null_probability <= 1
    ):
        raise ValueError("null probability must lie in [0, 1]")
    if (
        isinstance(confidence_level, bool)
        or not isinstance(confidence_level, (int, float))
        or not math.isfinite(confidence_level)
        or not 0 < confidence_level < 1
    ):
        raise ValueError("confidence level must lie in (0, 1)")
    if alternative not in ("less", "greater", "two-sided"):
        raise ValueError("alternative must be less, greater, or two-sided")

    def binomial_mass(count, probability):
        if probability == 0:
            return 1.0 if count == 0 else 0.0
        if probability == 1:
            return 1.0 if count == trials else 0.0
        log_mass = (
            math.lgamma(trials + 1)
            - math.lgamma(count + 1)
            - math.lgamma(trials - count + 1)
            + count * math.log(probability)
            + (trials - count) * math.log1p(-probability)
        )
        return math.exp(log_mass)

    def left_tail(count, probability):
        return min(1.0, math.fsum(
            probability_mass
            for probability_mass in (
                binomial_mass(value, probability) for value in range(count + 1)
            )
        ))

    def right_tail(count, probability):
        return min(1.0, math.fsum(
            probability_mass
            for probability_mass in (
                binomial_mass(value, probability)
                for value in range(count, trials + 1)
            )
        ))

    left = left_tail(successes, null_probability)
    right = right_tail(successes, null_probability)
    if alternative == "less":
        p_value = left
    elif alternative == "greater":
        p_value = right
    else:
        p_value = min(1.0, 2.0 * min(left, right))

    alpha_tail = (1.0 - confidence_level) / 2.0
    estimate = successes / trials
    if successes == 0:
        lower = 0.0
    else:
        low, high = 0.0, estimate
        for _ in range(70):
            midpoint = (low + high) / 2.0
            if right_tail(successes, midpoint) < alpha_tail:
                low = midpoint
            else:
                high = midpoint
        lower = (low + high) / 2.0

    if successes == trials:
        upper = 1.0
    else:
        low, high = estimate, 1.0
        for _ in range(70):
            midpoint = (low + high) / 2.0
            if left_tail(successes, midpoint) > alpha_tail:
                low = midpoint
            else:
                high = midpoint
        upper = (low + high) / 2.0

    return estimate, p_value, (lower, upper)


def benjamini_hochberg(p_values, false_discovery_rate):
    probabilities = list(p_values)
    if not probabilities:
        raise ValueError("at least one p-value required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        or not 0 <= value <= 1
        for value in probabilities
    ):
        raise ValueError("p-values must be finite probabilities")
    if (
        isinstance(false_discovery_rate, bool)
        or not isinstance(false_discovery_rate, (int, float))
        or not math.isfinite(false_discovery_rate)
        or not 0 < false_discovery_rate <= 1
    ):
        raise ValueError("false discovery rate must lie in (0, 1]")

    ordered = sorted(enumerate(probabilities), key=lambda item: (item[1], item[0]))
    count = len(ordered)
    cutoff_rank = 0
    for rank, (_, p_value) in enumerate(ordered, start=1):
        if p_value <= rank * false_discovery_rate / count:
            cutoff_rank = rank

    rejected = [False] * count
    for original_index, _ in ordered[:cutoff_rank]:
        rejected[original_index] = True

    adjusted = [0.0] * count
    running_minimum = 1.0
    for rank in range(count, 0, -1):
        original_index, p_value = ordered[rank - 1]
        running_minimum = min(running_minimum, count * p_value / rank)
        adjusted[original_index] = running_minimum

    return rejected, adjusted


def bootstrap_mean_interval(
    values, resamples, confidence_level=0.95, seed=0
):
    observations = list(values)
    if len(observations) < 2:
        raise ValueError("at least two observations required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in observations
    ):
        raise ValueError("finite numeric observations required")
    if (
        isinstance(resamples, bool)
        or not isinstance(resamples, int)
        or resamples < 2
    ):
        raise ValueError("resamples must be an integer of at least two")
    if (
        isinstance(confidence_level, bool)
        or not isinstance(confidence_level, (int, float))
        or not math.isfinite(confidence_level)
        or not 0 < confidence_level < 1
    ):
        raise ValueError("confidence level must lie in (0, 1)")
    if isinstance(seed, bool) or not isinstance(seed, int):
        raise ValueError("seed must be an integer")

    count = len(observations)
    estimate = math.fsum(observations) / count
    generator = random.Random(seed)
    bootstrap_estimates = []
    for _ in range(resamples):
        total = math.fsum(
            observations[generator.randrange(count)] for _ in range(count)
        )
        bootstrap_estimates.append(total / count)

    bootstrap_center = math.fsum(bootstrap_estimates) / resamples
    bootstrap_variance = math.fsum(
        (value - bootstrap_center) ** 2 for value in bootstrap_estimates
    ) / (resamples - 1)
    standard_error = math.sqrt(bootstrap_variance)
    ordered = sorted(bootstrap_estimates)

    def quantile(probability):
        position = (resamples - 1) * probability
        lower_index = math.floor(position)
        upper_index = math.ceil(position)
        fraction = position - lower_index
        return (
            ordered[lower_index] * (1.0 - fraction)
            + ordered[upper_index] * fraction
        )

    alpha = 1.0 - confidence_level
    interval = (quantile(alpha / 2.0), quantile(1.0 - alpha / 2.0))
    return estimate, standard_error, interval


def paired_permutation_test(differences):
    observations = list(differences)
    if not 1 <= len(observations) <= 20:
        raise ValueError("one to twenty paired differences required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in observations
    ):
        raise ValueError("finite numeric paired differences required")

    count = len(observations)
    observed_total = math.fsum(observations)
    threshold = abs(observed_total)
    assignments = 1 << count
    extreme = 0
    for mask in range(assignments):
        permuted_total = math.fsum(
            value if mask & (1 << index) else -value
            for index, value in enumerate(observations)
        )
        if (
            abs(permuted_total) > threshold
            or math.isclose(
                abs(permuted_total), threshold, rel_tol=1e-12, abs_tol=1e-12
            )
        ):
            extreme += 1
    return observed_total / count, extreme / assignments


def bernoulli_e_process(outcomes, null_probability, alternative_probability):
    observations = list(outcomes)
    if not observations:
        raise ValueError("at least one Bernoulli observation required")
    if any(
        isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1)
        for value in observations
    ):
        raise ValueError("outcomes must be integer zeros and ones")
    for name, probability in (
        ("null", null_probability), ("alternative", alternative_probability)
    ):
        if (
            isinstance(probability, bool)
            or not isinstance(probability, (int, float))
            or not math.isfinite(probability)
            or not 0 < probability < 1
        ):
            raise ValueError(name + " probability must lie strictly in (0, 1)")

    success_increment = math.log(alternative_probability) - math.log(null_probability)
    failure_increment = (
        math.log1p(-alternative_probability) - math.log1p(-null_probability)
    )
    largest_finite_log = math.log(float.fromhex("0x1.fffffffffffffp+1023"))
    log_e_value = 0.0
    maximum_log_e_value = 0.0
    e_values = []
    for outcome in observations:
        log_e_value += success_increment if outcome else failure_increment
        if log_e_value > largest_finite_log:
            e_values.append(float("inf"))
        else:
            e_values.append(math.exp(log_e_value))
        maximum_log_e_value = max(maximum_log_e_value, log_e_value)

    anytime_p_value = (
        0.0
        if maximum_log_e_value > largest_finite_log
        else math.exp(-maximum_log_e_value)
    )
    return e_values, min(1.0, anytime_p_value)


def beta_bernoulli_update(outcomes, prior_alpha, prior_beta):
    observations = list(outcomes)
    if not observations:
        raise ValueError("at least one Bernoulli observation required")
    if any(
        isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1)
        for value in observations
    ):
        raise ValueError("outcomes must be integer zeros and ones")
    for name, shape in (("alpha", prior_alpha), ("beta", prior_beta)):
        if (
            isinstance(shape, bool)
            or not isinstance(shape, (int, float))
            or not math.isfinite(shape)
            or shape <= 0
        ):
            raise ValueError("prior " + name + " must be finite and positive")

    successes = sum(observations)
    failures = len(observations) - successes
    posterior_alpha = prior_alpha + successes
    posterior_beta = prior_beta + failures
    total = posterior_alpha + posterior_beta
    posterior_mean = posterior_alpha / total
    posterior_variance = (
        posterior_alpha * posterior_beta / (total * total * (total + 1.0))
    )
    predictive_success = posterior_mean
    return (
        posterior_alpha,
        posterior_beta,
        posterior_mean,
        posterior_variance,
        predictive_success,
    )


def self_normalized_importance(values, log_weights):
    observations = list(values)
    logarithms = list(log_weights)
    if not observations or len(observations) != len(logarithms):
        raise ValueError("equally sized nonempty values and log weights required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in observations
    ):
        raise ValueError("values must be finite numbers")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in logarithms
    ):
        raise ValueError("log weights must be finite numbers")

    maximum = max(logarithms)
    relative_weights = [math.exp(value - maximum) for value in logarithms]
    total = math.fsum(relative_weights)
    normalized = [weight / total for weight in relative_weights]
    estimate = math.fsum(
        weight * value for weight, value in zip(normalized, observations)
    )
    effective_sample_size = 1.0 / math.fsum(
        weight * weight for weight in normalized
    )
    return estimate, normalized, effective_sample_size


def random_walk_metropolis(log_density, initial, proposal_scale, steps, seed):
    if not callable(log_density):
        raise ValueError("log density must be callable")
    if (
        isinstance(initial, bool)
        or not isinstance(initial, (int, float))
        or not math.isfinite(initial)
    ):
        raise ValueError("initial state must be a finite number")
    if (
        isinstance(proposal_scale, bool)
        or not isinstance(proposal_scale, (int, float))
        or not math.isfinite(proposal_scale)
        or proposal_scale <= 0
    ):
        raise ValueError("proposal scale must be finite and positive")
    if isinstance(steps, bool) or not isinstance(steps, int) or steps <= 0:
        raise ValueError("steps must be a positive integer")
    if isinstance(seed, bool) or not isinstance(seed, int):
        raise ValueError("seed must be an integer")

    def checked_log_density(state, allow_negative_infinity):
        value = log_density(state)
        if (
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or math.isnan(value)
            or value == float("inf")
            or (value == float("-inf") and not allow_negative_infinity)
        ):
            raise ValueError("log density returned an invalid value")
        return value

    current = float(initial)
    current_log_density = checked_log_density(current, False)
    generator = random.Random(seed)
    states = []
    accepted = 0
    for _ in range(steps):
        proposal = current + generator.gauss(0.0, proposal_scale)
        proposal_log_density = checked_log_density(proposal, True)
        log_ratio = proposal_log_density - current_log_density
        uniform = generator.random()
        log_uniform = math.log(uniform) if uniform > 0 else float("-inf")
        if log_uniform < min(0.0, log_ratio):
            current = proposal
            current_log_density = proposal_log_density
            accepted += 1
        states.append(current)
    return states, accepted / steps


def stratified_mean_standard_error(samples_by_stratum, population_sizes):
    if (
        not isinstance(samples_by_stratum, dict)
        or not isinstance(population_sizes, dict)
        or not samples_by_stratum
        or set(samples_by_stratum) != set(population_sizes)
    ):
        raise ValueError("matching nonempty stratum mappings required")

    samples = {}
    for name, values in samples_by_stratum.items():
        observations = list(values)
        if len(observations) < 2:
            raise ValueError("each stratum needs at least two observations")
        if any(
            isinstance(value, bool)
            or not isinstance(value, (int, float))
            or not math.isfinite(value)
            for value in observations
        ):
            raise ValueError("stratum observations must be finite numbers")
        population_size = population_sizes[name]
        if (
            isinstance(population_size, bool)
            or not isinstance(population_size, int)
            or population_size < len(observations)
        ):
            raise ValueError("population sizes must cover their stratum samples")
        samples[name] = observations

    total_population = sum(population_sizes.values())
    estimate = 0.0
    variance = 0.0
    for name, observations in samples.items():
        population_size = population_sizes[name]
        sample_size = len(observations)
        weight = population_size / total_population
        mean = math.fsum(observations) / sample_size
        sample_variance = math.fsum(
            (value - mean) ** 2 for value in observations
        ) / (sample_size - 1)
        estimate += weight * mean
        variance += (
            weight * weight
            * (1.0 - sample_size / population_size)
            * sample_variance / sample_size
        )
    return estimate, math.sqrt(max(0.0, variance))


def horvitz_thompson(values, inclusion_probabilities, population_size):
    observations = list(values)
    probabilities = list(inclusion_probabilities)
    if not observations or len(observations) != len(probabilities):
        raise ValueError("equally sized nonempty values and probabilities required")
    if (
        isinstance(population_size, bool)
        or not isinstance(population_size, int)
        or population_size < len(observations)
    ):
        raise ValueError("population size must be an integer covering the sample")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in observations
    ):
        raise ValueError("observed values must be finite numbers")
    if any(
        isinstance(probability, bool)
        or not isinstance(probability, (int, float))
        or not math.isfinite(probability)
        or not 0 < probability <= 1
        for probability in probabilities
    ):
        raise ValueError("inclusion probabilities must lie in (0, 1]")

    total = math.fsum(
        value / probability
        for value, probability in zip(observations, probabilities)
    )
    return total, total / population_size


def rejection_sample(
    proposal, acceptance_probability, draws, seed, max_attempts
):
    if not callable(proposal) or not callable(acceptance_probability):
        raise ValueError("proposal and acceptance probability must be callable")
    if isinstance(draws, bool) or not isinstance(draws, int) or draws <= 0:
        raise ValueError("draws must be a positive integer")
    if isinstance(seed, bool) or not isinstance(seed, int):
        raise ValueError("seed must be an integer")
    if (
        isinstance(max_attempts, bool)
        or not isinstance(max_attempts, int)
        or max_attempts < draws
    ):
        raise ValueError("maximum attempts must be an integer at least as large as draws")

    generator = random.Random(seed)
    accepted = []
    attempts = 0
    while len(accepted) < draws and attempts < max_attempts:
        candidate = proposal(generator)
        if (
            isinstance(candidate, bool)
            or not isinstance(candidate, (int, float))
            or not math.isfinite(candidate)
        ):
            raise ValueError("proposal returned a non-finite numeric value")
        probability = acceptance_probability(candidate)
        if (
            isinstance(probability, bool)
            or not isinstance(probability, (int, float))
            or not math.isfinite(probability)
            or not 0 <= probability <= 1
        ):
            raise ValueError("acceptance probability must lie in [0, 1]")
        attempts += 1
        if generator.random() < probability:
            accepted.append(candidate)

    if len(accepted) < draws:
        raise RuntimeError("maximum attempts exhausted before collecting all draws")
    return accepted, attempts, draws / attempts


def simple_ols(predictors, outcomes):
    x_values = list(predictors)
    y_values = list(outcomes)
    if len(x_values) != len(y_values) or len(x_values) < 3:
        raise ValueError("at least three equally sized predictor-outcome pairs required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in x_values + y_values
    ):
        raise ValueError("predictors and outcomes must be finite numbers")

    count = len(x_values)
    x_mean = math.fsum(x_values) / count
    y_mean = math.fsum(y_values) / count
    centered_x = [value - x_mean for value in x_values]
    centered_y = [value - y_mean for value in y_values]
    sxx = math.fsum(value * value for value in centered_x)
    if sxx <= 0:
        raise ValueError("predictors must not be constant")
    slope = math.fsum(
        x_value * y_value
        for x_value, y_value in zip(centered_x, centered_y)
    ) / sxx
    intercept = y_mean - slope * x_mean
    residual_sum_squares = math.fsum(
        (y_value - (intercept + slope * x_value)) ** 2
        for x_value, y_value in zip(x_values, y_values)
    )
    residual_standard_error = math.sqrt(
        max(0.0, residual_sum_squares) / (count - 2)
    )
    slope_standard_error = residual_standard_error / math.sqrt(sxx)
    return intercept, slope, residual_standard_error, slope_standard_error


def logistic_loss_gradient(design, outcomes, coefficients):
    rows = [list(row) for row in design]
    labels = list(outcomes)
    weights = list(coefficients)
    if not rows or len(rows) != len(labels) or not weights:
        raise ValueError("nonempty matching design, outcomes, and coefficients required")
    width = len(weights)
    if any(len(row) != width for row in rows):
        raise ValueError("design must be rectangular and match coefficients")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for row in rows
        for value in row
    ) or any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in weights
    ):
        raise ValueError("design and coefficients must contain finite numbers")
    if any(
        isinstance(label, bool)
        or not isinstance(label, int)
        or label not in (0, 1)
        for label in labels
    ):
        raise ValueError("outcomes must be binary integers")

    losses = []
    residuals = []
    for row, label in zip(rows, labels):
        logit = math.fsum(value * weight for value, weight in zip(row, weights))
        if not math.isfinite(logit):
            raise ValueError("linear predictors must be finite")
        losses.append(
            max(logit, 0.0)
            - label * logit
            + math.log1p(math.exp(-abs(logit)))
        )
        if logit >= 0:
            probability = 1.0 / (1.0 + math.exp(-logit))
        else:
            exponential = math.exp(logit)
            probability = exponential / (1.0 + exponential)
        residuals.append(probability - label)

    count = len(rows)
    gradient = [
        math.fsum(
            residual * row[column]
            for row, residual in zip(rows, residuals)
        ) / count
        for column in range(width)
    ]
    return math.fsum(losses) / count, gradient


def partial_pooling_means(
    group_means, group_sizes, within_variance, population_mean, between_variance
):
    means = list(group_means)
    sizes = list(group_sizes)
    if not means or len(means) != len(sizes):
        raise ValueError("equally sized nonempty group means and sizes required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in means
    ):
        raise ValueError("group means must be finite numbers")
    if any(
        isinstance(size, bool) or not isinstance(size, int) or size <= 0
        for size in sizes
    ):
        raise ValueError("group sizes must be positive integers")
    scalar_values = (within_variance, population_mean, between_variance)
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in scalar_values
    ):
        raise ValueError("variances and population mean must be finite numbers")
    if within_variance < 0 or between_variance < 0:
        raise ValueError("variances must be nonnegative")
    if within_variance == 0 and between_variance == 0:
        raise ValueError("within and between variance cannot both be zero")

    weights = [
        between_variance / (between_variance + within_variance / size)
        for size in sizes
    ]
    pooled = [
        weight * mean + (1.0 - weight) * population_mean
        for mean, weight in zip(means, weights)
    ]
    return pooled, weights


def lower_bound(values, target):
    lo, hi = 0, len(values)
    while lo < hi:
        mid = (lo + hi) // 2
        if values[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo


def stable_softmax(logits):
    if not logits or not all(math.isfinite(x) for x in logits):
        raise ValueError("finite nonempty logits required")
    maximum = max(logits)
    weights = [math.exp(x - maximum) for x in logits]
    total = sum(weights)
    return [x / total for x in weights]


def bigram_nll(probabilities, tokens):
    if len(tokens) < 2:
        raise ValueError("at least two tokens required")
    loss = 0.0
    for previous, current in zip(tokens, tokens[1:]):
        probability = probabilities[previous][current]
        if not 0.0 < probability <= 1.0:
            raise ValueError("probability must be in (0, 1]")
        loss -= math.log(probability)
    return loss / (len(tokens) - 1)


def causal_attention(q, k, v):
    if not q or len(q) != len(k) or len(q) != len(v):
        raise ValueError("nonempty matching sequence lengths required")
    width, output_width = len(q[0]), len(v[0])
    if width == 0 or output_width == 0:
        raise ValueError("nonempty feature dimensions required")
    if any(len(row) != width for row in q + k):
        raise ValueError("query and key widths must agree")
    if any(len(row) != output_width for row in v):
        raise ValueError("value widths must agree")
    if any(not math.isfinite(x) for row in q + k + v for x in row):
        raise ValueError("finite input required")
    outputs = []
    for i, query in enumerate(q):
        scores = [
            sum(a*b for a, b in zip(query, key)) / math.sqrt(width)
            for key in k[:i+1]
        ]
        weights = stable_softmax(scores)
        outputs.append([
            sum(weights[j] * v[j][d] for j in range(i+1))
            for d in range(output_width)
        ])
    return outputs


def bellman_backup(values, rewards, transitions, gamma):
    if not 0 <= gamma < 1:
        raise ValueError("discount must be in [0,1)")
    return [
        max(reward + gamma * sum(p * value for p, value in zip(next_probs, values))
            for reward, next_probs in zip(action_rewards, action_transitions))
        for action_rewards, action_transitions in zip(rewards, transitions)
    ]
