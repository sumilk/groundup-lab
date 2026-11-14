"""Behavioral checks for Programming foundations: Python (01) and DSA (04).

Registered in labs/registry.json; run with python -m labs.checks <task>.
"""
import itertools

from labs.check_helpers import close


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
