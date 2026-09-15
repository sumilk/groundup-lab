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
