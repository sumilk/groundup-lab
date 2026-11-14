"""Reference implementations for Programming foundations: Python (01) and DSA (04).

Attempt labs/programming/exercises.py before reading.
"""
import math


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


def lower_bound(values, target):
    lo, hi = 0, len(values)
    while lo < hi:
        mid = (lo + hi) // 2
        if values[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo
