"""Reference implementations for ML systems: PyTorch (08), NLP (11), LLM systems (12) and RL (13).

Attempt labs/ml_systems/exercises.py before reading.
"""
import math


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
