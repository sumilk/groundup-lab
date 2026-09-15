"""Fill these functions from the lessons. No GPU or API key is required."""


def streaming_moments(values):
    """One pass: (count, mean, sample variance). >=2 finite values required."""
    raise NotImplementedError("Implement the streaming recurrence")


def conditional_probability(weights, event, given):
    """Exact P(event | given) for a finite weighted sample space.

    weights maps outcomes to finite nonnegative masses. event and given are
    iterables of outcomes from that sample space. Inputs must not be mutated.
    """
    raise NotImplementedError("Restrict to the conditioning event and renormalize")


def sample_categorical(weights, draws, seed):
    """Sample zero-based categories from nonnegative, unnormalized weights.

    draws is a nonnegative integer and seed is an integer. Use local random
    state, preserve the input, and return a list containing draws indices.
    """
    raise NotImplementedError("Build cumulative weights and invert uniform draws")


def joint_marginals_covariance(weights):
    """Return (P_X, P_Y, Cov(X,Y)) for finite weighted numeric pairs.

    weights maps (x, y) pairs to finite nonnegative, possibly unnormalized
    masses. Returned marginals are dictionaries of normalized probabilities.
    """
    raise NotImplementedError("Normalize, marginalize both axes, and center jointly")


def discrete_convolution(left, right):
    """Return the normalized PMF of X + Y for independent finite PMFs.

    Each input maps a finite numeric value to a finite nonnegative, possibly
    unnormalized weight. Inputs must not be mutated.
    """
    raise NotImplementedError("Combine every pair of support values and normalize")


def condition_bivariate_gaussian(
    mean_x, mean_y, variance_x, variance_y, covariance, observed_y
):
    """Return mean and variance of X | Y=observed_y for a valid Gaussian."""
    raise NotImplementedError("Apply the Gaussian conditional update")


def lower_bound(values, target):
    """First index >= target in sorted values; len(values) if absent."""
    raise NotImplementedError("Use a half-open interval and a partition invariant")


def stable_softmax(logits):
    """Finite nonempty scalar list -> probabilities. Preserve input."""
    raise NotImplementedError("Normalize shifted exponentials")


def bigram_nll(probabilities, tokens):
    """Mean natural-log loss over adjacent tokens. Require >=2 tokens.
    probabilities[previous][next] must exist and be in (0, 1].
    """
    raise NotImplementedError("Score next-token transitions, not token identity")


def causal_attention(q, k, v):
    """One unbatched head. Lists of rows: Q,K=(T,D); V=(T,Dv).
    Return (T,Dv); query i may attend only to keys j <= i.
    """
    raise NotImplementedError("Scale, mask, normalize, aggregate")


def bellman_backup(values, rewards, transitions, gamma):
    """Optimality backup. V=(S), rewards=(S,A), transitions=(S,A,S).
    Valid finite tabular MDP, 0 <= gamma < 1. Return updated values.
    """
    raise NotImplementedError("Take expectations over next states, maximize actions")
