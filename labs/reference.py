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


def projection_distortion(points, projection_dim, seed):
    rows = [list(point) for point in points]
    if len(rows) < 2:
        raise ValueError("at least two points required")
    width = len(rows[0])
    if width == 0 or any(len(point) != width for point in rows):
        raise ValueError("points must be nonempty and equally long")
    for point in rows:
        for value in point:
            if isinstance(value, bool) or not isinstance(value, (int, float)):
                raise ValueError("coordinates must be real numbers")
            if not math.isfinite(value):
                raise ValueError("coordinates must be finite")
    if isinstance(projection_dim, bool) or not isinstance(projection_dim, int):
        raise ValueError("projection_dim must be an integer")
    if projection_dim <= 0:
        raise ValueError("projection_dim must be positive")
    generator = random.Random(seed)
    scale = 1.0 / math.sqrt(projection_dim)
    matrix = [
        [generator.gauss(0.0, 1.0) * scale for _ in range(width)]
        for _ in range(projection_dim)
    ]
    worst = 0.0
    for first in range(len(rows) - 1):
        for second in range(first + 1, len(rows)):
            difference = [a - b for a, b in zip(rows[first], rows[second])]
            original = sum(value * value for value in difference)
            if original == 0.0:
                raise ValueError("points must be distinct")
            projected = 0.0
            for row in matrix:
                component = sum(a * b for a, b in zip(row, difference))
                projected += component * component
            worst = max(worst, abs(projected / original - 1.0))
    return worst


def expected_calibration_error(probabilities, outcomes, bin_count):
    predictions = list(probabilities)
    labels = list(outcomes)
    if not predictions or len(predictions) != len(labels):
        raise ValueError("probabilities and outcomes must be nonempty and equally long")
    if isinstance(bin_count, bool) or not isinstance(bin_count, int) or bin_count <= 0:
        raise ValueError("bin_count must be a positive integer")
    for value in predictions:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("probabilities must be real numbers")
        if not math.isfinite(value) or value < 0.0 or value > 1.0:
            raise ValueError("probabilities must lie in [0, 1]")
    for value in labels:
        if isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1):
            raise ValueError("outcomes must be integer zeros and ones")
    totals = [0] * bin_count
    prediction_sums = [0.0] * bin_count
    label_sums = [0] * bin_count
    for value, label in zip(predictions, labels):
        index = min(int(value * bin_count), bin_count - 1)
        totals[index] += 1
        prediction_sums[index] += value
        label_sums[index] += label
    total = len(predictions)
    error = 0.0
    bins = []
    for index in range(bin_count):
        count = totals[index]
        if count == 0:
            continue
        mean_probability = prediction_sums[index] / count
        observed_rate = label_sums[index] / count
        error += (count / total) * abs(mean_probability - observed_rate)
        bins.append((count, mean_probability, observed_rate))
    return error, bins


def conformal_threshold(scores, alpha):
    values = list(scores)
    if not values:
        raise ValueError("at least one calibration score required")
    for value in values:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("scores must be real numbers")
        if not math.isfinite(value):
            raise ValueError("scores must be finite")
    if isinstance(alpha, bool) or not isinstance(alpha, (int, float)):
        raise ValueError("alpha must be a real number")
    if not math.isfinite(alpha) or alpha <= 0.0 or alpha >= 1.0:
        raise ValueError("alpha must lie strictly inside (0, 1)")
    count = len(values)
    rank = math.ceil((count + 1) * (1.0 - alpha))
    if rank > count:
        raise ValueError("too few calibration scores for the requested coverage")
    return sorted(values)[rank - 1]


def gaussian_elbo_terms(reconstruction_log_likelihood, means, log_variances):
    location = list(means)
    log_scale = list(log_variances)
    if not location or len(location) != len(log_scale):
        raise ValueError("means and log_variances must be nonempty and equally long")
    for value in (reconstruction_log_likelihood, *location, *log_scale):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("inputs must be real numbers")
        if not math.isfinite(value):
            raise ValueError("inputs must be finite")
    divergence = 0.0
    for mean, log_variance in zip(location, log_scale):
        divergence += math.exp(log_variance) + mean * mean - 1.0 - log_variance
    divergence *= 0.5
    return divergence, reconstruction_log_likelihood - divergence


def gumbel_max_sample(log_weights, seed):
    weights = list(log_weights)
    if not weights:
        raise ValueError("at least one log weight required")
    for value in weights:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("log weights must be real numbers")
        if not math.isfinite(value):
            raise ValueError("log weights must be finite")
    generator = random.Random(seed)
    best_index = 0
    best_score = None
    for index, weight in enumerate(weights):
        uniform = 0.0
        while uniform <= 0.0:
            uniform = generator.random()
        score = weight - math.log(-math.log(uniform))
        if best_score is None or score > best_score:
            best_index = index
            best_score = score
    return best_index


def decode_distribution(logits, temperature, nucleus):
    scores = list(logits)
    if not scores:
        raise ValueError("at least one logit required")
    for value in scores:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("logits must be real numbers")
        if not math.isfinite(value):
            raise ValueError("logits must be finite")
    if isinstance(temperature, bool) or not isinstance(temperature, (int, float)):
        raise ValueError("temperature must be a real number")
    if not math.isfinite(temperature) or temperature <= 0.0:
        raise ValueError("temperature must be positive")
    if isinstance(nucleus, bool) or not isinstance(nucleus, (int, float)):
        raise ValueError("nucleus must be a real number")
    if not math.isfinite(nucleus) or nucleus <= 0.0 or nucleus > 1.0:
        raise ValueError("nucleus must lie inside (0, 1]")
    tempered = [value / temperature for value in scores]
    largest = max(tempered)
    weights = [math.exp(value - largest) for value in tempered]
    total = sum(weights)
    probabilities = [weight / total for weight in weights]
    order = sorted(range(len(probabilities)), key=lambda i: (-probabilities[i], i))
    kept = []
    cumulative = 0.0
    for index in order:
        kept.append(index)
        cumulative += probabilities[index]
        if cumulative >= nucleus:
            break
    filtered = [0.0] * len(probabilities)
    for index in kept:
        filtered[index] = probabilities[index] / cumulative
    return filtered


def forward_diffusion_coefficients(betas):
    schedule = list(betas)
    if not schedule:
        raise ValueError("at least one beta required")
    for value in schedule:
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError("betas must be real numbers")
        if not math.isfinite(value) or value <= 0.0 or value >= 1.0:
            raise ValueError("betas must lie strictly inside (0, 1)")
    coefficients = []
    running = 1.0
    for value in schedule:
        running *= 1.0 - value
        coefficients.append((running, math.sqrt(running), math.sqrt(1.0 - running)))
    return coefficients


def backdoor_adjustment(strata):
    cells = [tuple(stratum) for stratum in strata]
    if not cells:
        raise ValueError("at least one stratum required")
    if any(len(cell) != 4 for cell in cells):
        raise ValueError("each stratum needs treated count, treated mean, control count, control mean")
    counts = [value for cell in cells for value in (cell[0], cell[2])]
    means = [value for cell in cells for value in (cell[1], cell[3])]
    if any(
        isinstance(value, bool) or not isinstance(value, int) or value <= 0
        for value in counts
    ):
        raise ValueError("stratum counts must be positive integers")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in means
    ):
        raise ValueError("stratum means must be finite numbers")

    treated_total = sum(cell[0] for cell in cells)
    control_total = sum(cell[2] for cell in cells)
    crude = (
        math.fsum(cell[0] * cell[1] for cell in cells) / treated_total
        - math.fsum(cell[2] * cell[3] for cell in cells) / control_total
    )
    population = sum(cell[0] + cell[2] for cell in cells)
    adjusted = math.fsum(
        (cell[0] + cell[2]) * (cell[1] - cell[3]) for cell in cells
    ) / population
    return crude, adjusted


def ipw_ate(treatments, outcomes, propensities):
    assignments = list(treatments)
    values = list(outcomes)
    scores = list(propensities)
    if not assignments or len(assignments) != len(values) or len(assignments) != len(scores):
        raise ValueError("equally sized nonempty treatments, outcomes, and propensities required")
    if any(
        isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1)
        for value in assignments
    ):
        raise ValueError("treatments must be binary integers")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in values
    ):
        raise ValueError("outcomes must be finite numbers")
    if any(
        isinstance(score, bool)
        or not isinstance(score, (int, float))
        or not math.isfinite(score)
        or score <= 0.0
        or score >= 1.0
        for score in scores
    ):
        raise ValueError("propensities must lie strictly inside (0, 1)")
    if not any(assignments) or all(assignments):
        raise ValueError("both treatment arms must be occupied")

    weights = [
        1.0 / score if assignment else 1.0 / (1.0 - score)
        for assignment, score in zip(assignments, scores)
    ]
    treated = [
        index for index, assignment in enumerate(assignments) if assignment
    ]
    control = [
        index for index, assignment in enumerate(assignments) if not assignment
    ]
    horvitz_thompson = (
        math.fsum(weights[index] * values[index] for index in treated)
        - math.fsum(weights[index] * values[index] for index in control)
    ) / len(assignments)
    treated_weight = math.fsum(weights[index] for index in treated)
    control_weight = math.fsum(weights[index] for index in control)
    hajek = (
        math.fsum(weights[index] * values[index] for index in treated) / treated_weight
        - math.fsum(weights[index] * values[index] for index in control) / control_weight
    )
    total_weight = math.fsum(weights)
    effective = total_weight * total_weight / math.fsum(
        weight * weight for weight in weights
    )
    return horvitz_thompson, hajek, effective


def wald_iv_estimate(instruments, treatments, outcomes):
    assigned = list(instruments)
    taken = list(treatments)
    values = list(outcomes)
    if not assigned or len(assigned) != len(taken) or len(assigned) != len(values):
        raise ValueError("equally sized nonempty instruments, treatments, and outcomes required")
    if any(
        isinstance(value, bool) or not isinstance(value, int) or value not in (0, 1)
        for value in assigned + taken
    ):
        raise ValueError("instruments and treatments must be binary integers")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in values
    ):
        raise ValueError("outcomes must be finite numbers")
    if not any(assigned) or all(assigned):
        raise ValueError("both instrument arms must be occupied")

    encouraged = [index for index, value in enumerate(assigned) if value]
    baseline = [index for index, value in enumerate(assigned) if not value]

    def arm_mean(column, indices):
        return math.fsum(column[index] for index in indices) / len(indices)

    intention_to_treat = arm_mean(values, encouraged) - arm_mean(values, baseline)
    first_stage = arm_mean(taken, encouraged) - arm_mean(taken, baseline)
    if first_stage == 0.0:
        raise ValueError("instrument must move treatment uptake")
    return intention_to_treat, first_stage, intention_to_treat / first_stage


def em_step_gaussian_mixture(observations, weights, means, variances):
    data = list(observations)
    mixing = list(weights)
    centers = list(means)
    spreads = list(variances)
    if not data:
        raise ValueError("at least one observation required")
    if not mixing or len(mixing) != len(centers) or len(mixing) != len(spreads):
        raise ValueError("equally sized nonempty weights, means, and variances required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in data + centers
    ):
        raise ValueError("observations and means must be finite numbers")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        or value <= 0.0
        for value in mixing
    ):
        raise ValueError("weights must be positive finite numbers")
    if not math.isclose(math.fsum(mixing), 1.0, rel_tol=0.0, abs_tol=1e-9):
        raise ValueError("weights must sum to one")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        or value <= 0.0
        for value in spreads
    ):
        raise ValueError("variances must be strictly positive finite numbers")

    order = range(len(mixing))
    log_mixing = [math.log(value) for value in mixing]
    log_likelihood = 0.0
    responsibilities = []
    for value in data:
        log_terms = [
            log_mixing[k]
            - 0.5 * math.log(2.0 * math.pi * spreads[k])
            - (value - centers[k]) ** 2 / (2.0 * spreads[k])
            for k in order
        ]
        peak = max(log_terms)
        shifted = [math.exp(term - peak) for term in log_terms]
        total = math.fsum(shifted)
        log_likelihood += peak + math.log(total)
        responsibilities.append([share / total for share in shifted])

    counts = [math.fsum(row[k] for row in responsibilities) for k in order]
    if any(count <= 0.0 for count in counts):
        raise ValueError("every component must retain some responsibility")
    new_weights = [count / len(data) for count in counts]
    new_means = [
        math.fsum(row[k] * value for row, value in zip(responsibilities, data)) / counts[k]
        for k in order
    ]
    new_variances = [
        math.fsum(
            row[k] * (value - new_means[k]) ** 2
            for row, value in zip(responsibilities, data)
        )
        / counts[k]
        for k in order
    ]
    return log_likelihood, new_weights, new_means, new_variances


def hmm_forward(initial, transition, emissions):
    start = list(initial)
    rows = [list(row) for row in transition]
    steps = [list(row) for row in emissions]
    states = len(start)
    if states == 0 or not steps:
        raise ValueError("nonempty initial distribution and emission sequence required")
    if len(rows) != states or any(len(row) != states for row in rows):
        raise ValueError("transition matrix must be square and match the state count")
    if any(len(row) != states for row in steps):
        raise ValueError("each emission row must match the state count")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        or value < 0.0
        for row in [start] + rows + steps
        for value in row
    ):
        raise ValueError("probabilities and emission likelihoods must be finite and nonnegative")
    if not math.isclose(math.fsum(start), 1.0, rel_tol=0.0, abs_tol=1e-9):
        raise ValueError("initial distribution must sum to one")
    if any(
        not math.isclose(math.fsum(row), 1.0, rel_tol=0.0, abs_tol=1e-9)
        for row in rows
    ):
        raise ValueError("transition rows must sum to one")

    order = range(states)
    forward = [start[k] * steps[0][k] for k in order]
    log_likelihood = 0.0
    for index, emission in enumerate(steps):
        if index:
            predicted = [
                math.fsum(forward[j] * rows[j][k] for j in order) for k in order
            ]
            forward = [predicted[k] * emission[k] for k in order]
        scale = math.fsum(forward)
        if scale <= 0.0:
            raise ValueError("observation sequence has probability zero")
        log_likelihood += math.log(scale)
        forward = [value / scale for value in forward]
    return log_likelihood, forward


def d_separated(edges, source, target, conditioned):
    pairs = []
    for edge in edges:
        pair = tuple(edge)
        if len(pair) != 2:
            raise ValueError("each edge must be a parent-child pair")
        if pair[0] == pair[1]:
            raise ValueError("self loops are not allowed")
        pairs.append(pair)
    if not pairs:
        raise ValueError("at least one edge required")

    nodes = set()
    children = {}
    parents = {}
    for parent, child in pairs:
        nodes.add(parent)
        nodes.add(child)
        children.setdefault(parent, set()).add(child)
        parents.setdefault(child, set()).add(parent)

    given = set(conditioned)
    if source not in nodes or target not in nodes:
        raise ValueError("source and target must appear in the graph")
    if source == target:
        raise ValueError("source and target must differ")
    if not given <= nodes:
        raise ValueError("conditioned nodes must appear in the graph")
    if source in given or target in given:
        raise ValueError("endpoints cannot be conditioned on")

    remaining = {node: len(parents.get(node, ())) for node in nodes}
    ready = [node for node in nodes if not remaining[node]]
    ordered = 0
    while ready:
        node = ready.pop()
        ordered += 1
        for child in children.get(node, ()):
            remaining[child] -= 1
            if not remaining[child]:
                ready.append(child)
    if ordered != len(nodes):
        raise ValueError("edges must form a directed acyclic graph")

    opened = {}
    for node in nodes:
        stack = [node]
        reached = set()
        while stack:
            current = stack.pop()
            if current in reached:
                continue
            reached.add(current)
            stack.extend(children.get(current, ()))
        opened[node] = bool(reached & given)

    neighbours = {node: set() for node in nodes}
    for parent, child in pairs:
        neighbours[parent].add(child)
        neighbours[child].add(parent)

    def blocked_from(path):
        node = path[-1]
        if node == target:
            return False
        for step in neighbours[node]:
            if step in path:
                continue
            if len(path) >= 2:
                previous = path[-2]
                incoming = parents.get(node, set())
                if previous in incoming and step in incoming:
                    if not opened[node]:
                        continue
                elif node in given:
                    continue
            if not blocked_from(path + [step]):
                return False
        return True

    return blocked_from([source])


def ecdf_dkw_band(samples, alpha, queries):
    values = list(samples)
    points = list(queries)
    if not values:
        raise ValueError("at least one sample required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in values + points
    ):
        raise ValueError("samples and queries must be finite numbers")
    if (
        isinstance(alpha, bool)
        or not isinstance(alpha, (int, float))
        or not math.isfinite(alpha)
        or alpha <= 0.0
        or alpha >= 1.0
    ):
        raise ValueError("alpha must lie strictly inside (0, 1)")

    ordered = sorted(values)
    count = len(ordered)
    half_width = math.sqrt(math.log(2.0 / alpha) / (2.0 * count))
    band = []
    for point in points:
        below = sum(1 for value in ordered if value <= point)
        estimate = below / count
        band.append(
            (
                estimate,
                min(1.0, max(0.0, estimate - half_width)),
                min(1.0, max(0.0, estimate + half_width)),
            )
        )
    return band


def mann_whitney_u(first, second):
    left = list(first)
    right = list(second)
    if not left or not right:
        raise ValueError("both samples must be nonempty")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in left + right
    ):
        raise ValueError("samples must contain finite numbers")

    wins = 0.0
    for value in left:
        for other in right:
            if value > other:
                wins += 1.0
            elif value == other:
                wins += 0.5
    pairs = len(left) * len(right)
    theta = wins / pairs

    total = len(left) + len(right)
    groups = {}
    for value in left + right:
        groups[value] = groups.get(value, 0) + 1
    correction = math.fsum(size ** 3 - size for size in groups.values())
    variance = (
        pairs
        / 12.0
        * ((total + 1) - correction / (total * (total - 1)))
    )
    if variance <= 0.0:
        return wins, theta, 0.0
    return wins, theta, (wins - pairs / 2.0) / math.sqrt(variance)


def gaussian_kde(samples, bandwidth, queries):
    values = list(samples)
    points = list(queries)
    if not values:
        raise ValueError("at least one sample required")
    if any(
        isinstance(value, bool)
        or not isinstance(value, (int, float))
        or not math.isfinite(value)
        for value in values + points
    ):
        raise ValueError("samples and queries must be finite numbers")
    if (
        isinstance(bandwidth, bool)
        or not isinstance(bandwidth, (int, float))
        or not math.isfinite(bandwidth)
        or bandwidth <= 0.0
    ):
        raise ValueError("bandwidth must be strictly positive and finite")

    scale = 1.0 / (len(values) * bandwidth * math.sqrt(2.0 * math.pi))

    def bump(point, value):
        # Multiply rather than square with **: float ** overflows to
        # OverflowError on extreme but finite inputs, while multiplication
        # saturates to inf and exp(-inf) gives the correct 0.0.
        deviation = (point - value) / bandwidth
        return math.exp(-0.5 * deviation * deviation)

    estimates = []
    for point in points:
        estimates.append(math.fsum(bump(point, value) for value in values) * scale)
    return estimates


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
