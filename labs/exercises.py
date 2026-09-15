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


def batch_means_standard_error(values, batch_size):
    """Return (mean, standard error) estimated from contiguous batch means.

    Require finite numeric observations and a positive integer batch size that
    divides the sequence into at least two complete batches.
    """
    raise NotImplementedError("Estimate uncertainty from variation among batch means")


def bernoulli_mle(outcomes):
    """Return (MLE, maximized log likelihood, plug-in standard error).

    Require a nonempty iterable containing integer zeros and ones. At an
    all-zero or all-one boundary, use the convention 0 * log(0) = 0.
    """
    raise NotImplementedError("Maximize the Bernoulli likelihood and quantify curvature")


def exact_binomial_test(
    successes, trials, null_probability, confidence_level=0.95,
    alternative="two-sided"
):
    """Return (estimate, exact p-value, equal-tailed exact interval).

    alternative must be "less", "greater", or "two-sided". The two-sided
    p-value doubles the smaller inclusive tail and caps the result at one.
    """
    raise NotImplementedError("Sum exact binomial tails and invert them by bisection")


def benjamini_hochberg(p_values, false_discovery_rate):
    """Return (rejection decisions, BH-adjusted p-values) in input order.

    Require a nonempty iterable of finite probabilities and a target rate in
    (0, 1]. Inputs must not be mutated.
    """
    raise NotImplementedError("Sort by p-value, step up, then map results back")


def bootstrap_mean_interval(
    values, resamples, confidence_level=0.95, seed=0
):
    """Return (mean, bootstrap standard error, percentile interval).

    Use same-size resamples with replacement and a local seeded generator.
    Quantiles use linear interpolation at index (resamples - 1) * probability.
    """
    raise NotImplementedError("Resample indices, summarize means, and take quantiles")


def paired_permutation_test(differences):
    """Return (observed mean, exact inclusive two-sided sign-flip p-value).

    Require one to twenty finite paired differences and enumerate all sign
    assignments under the paired sharp null.
    """
    raise NotImplementedError("Flip every combination of paired-difference signs")


def bernoulli_e_process(outcomes, null_probability, alternative_probability):
    """Return (running likelihood-ratio e-values, anytime p-value).

    Probabilities must lie strictly inside (0, 1). Outcomes must be a nonempty
    iterable containing integer zeros and ones. Compute cumulative evidence
    stably enough to represent overwhelming evidence as infinity.
    """
    raise NotImplementedError("Accumulate Bernoulli log likelihood ratios over time")


def beta_bernoulli_update(outcomes, prior_alpha, prior_beta):
    """Return posterior alpha, beta, mean, variance, and predictive success.

    Require a nonempty iterable containing integer zeros and ones and finite,
    strictly positive prior shape parameters.
    """
    raise NotImplementedError("Add sufficient counts to the Beta prior shapes")


def self_normalized_importance(values, log_weights):
    """Return (weighted estimate, normalized weights, importance ESS).

    Values and log weights must be equally sized, nonempty finite iterables.
    Preserve order and stabilize exponentiation by subtracting the largest
    log weight.
    """
    raise NotImplementedError("Normalize log weights and compute a weighted mean")


def random_walk_metropolis(log_density, initial, proposal_scale, steps, seed):
    """Return (states after each proposal, acceptance rate).

    Use a local Gaussian random-walk proposal and the log acceptance rule.
    The initial log density must be finite. Proposed log densities may be
    finite or negative infinity, with negative infinity forcing rejection.
    """
    raise NotImplementedError("Propose locally and accept using a log-density ratio")


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
