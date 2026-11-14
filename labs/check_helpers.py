"""Assertion helpers shared by the topic check modules in labs/*/checks.py."""
import math


def close(actual, expected, tol=1e-8):
    assert math.isclose(actual, expected, rel_tol=tol, abs_tol=tol), (actual, expected)


def _projection_rejects(fn, *args):
    try:
        fn(*args)
    except ValueError:
        return
    raise AssertionError("invalid or numerically rejected input must raise ValueError")
