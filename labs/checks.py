"""Run: python -m labs.checks [--reference] [task].
Checks verify behavior, not mastery. Student functions start unimplemented.

Each topic package keeps its checks in labs/<topic>/checks.py, and shared assertion
helpers live in labs/check_helpers.py. CHECKS is built from labs/registry.json, the
same list the browser build uses, and runs in registry order.

Everything the single-file checks.py exposed stays importable, including its
helpers and stdlib modules; scripts/check_lab_exports.py enforces this.
"""
import argparse
import importlib
import itertools  # noqa: F401
import math  # noqa: F401
import random  # noqa: F401

from labs import registry as _registry

# Helpers, importable as before the split (from labs.checks import close).
from labs.check_helpers import (  # noqa: F401
    _projection_rejects,
    close,
)
from labs.linalg_structure.checks import (  # noqa: F401
    combine,
    matvec,
)
from labs.linalg_geometry.checks import (  # noqa: F401
    _check_qr_factors,
    _det_permutations,
    _spectral_invalid,
)
from labs.linalg_decomposition.checks import (  # noqa: F401
    _la10_fixtures,
    _la10_matrix,
    _la10_rejects,
    _mm,
)
from labs.deep_learning_core.checks import (  # noqa: F401
    _fires,
    _rows_of,
    _run_net,
)


try:
    CHECKS = _registry.load_checks()
except _registry.RegistryError as error:
    if __name__ == "__main__":
        raise SystemExit(str(error))
    raise

# Every check is also a module attribute, as in the single-file checks.py.
globals().update({check.__name__: check for check in CHECKS.values()})


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
