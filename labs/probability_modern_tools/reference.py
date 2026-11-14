"""Reference implementations for Probability and statistics, Part III · Modern statistical tools (PS12–PS18).

Attempt labs/probability_modern_tools/exercises.py before reading.
"""
import math
import random


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
