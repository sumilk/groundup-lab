"""Starters for ML systems: PyTorch (08), NLP (11), LLM systems (12) and RL (13).

Fill these functions from the lessons; run one with python -m labs.checks <task>.
"""


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
