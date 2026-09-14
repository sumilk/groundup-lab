"""Run: python -m labs.checks [--reference] [task].
Checks verify behavior, not mastery. Student functions start unimplemented.
"""
import argparse
import importlib
import itertools
import math


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


CHECKS = {"moments": moments, "search": search, "softmax": softmax,
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
