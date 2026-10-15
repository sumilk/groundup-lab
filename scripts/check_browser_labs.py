"""Validate generated browser-lab payloads with the reference implementations."""
import inspect
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import labs.reference as reference


RUNTIME_PATH = ROOT / "public" / "theory" / "lab-runtime.json"


def execute(runtime, lab, code):
    namespace = {
        "__lab_code": code,
        "__lab_checks": runtime["checks"],
        "__lab_task": lab["task"],
        "__lab_mode": "test",
        "__lab_support": lab["support"],
    }
    exec(runtime["runner"], namespace)
    return namespace["passed"], namespace["buffer"].getvalue()


def main():
    runtime = json.loads(RUNTIME_PATH.read_text(encoding="utf-8"))
    for lab in runtime["labs"]:
        # Some references share implementation helpers; learners may
        # write their own. Bundle them with the reference submitted to the same
        # runner without exposing reference implementation details in starters.
        helpers = {
            "row_echelon": ("_validated_matrix", "_reduce"),
            "solve_complete": ("_validated_matrix", "_reduce"),
            "lu_factor": ("_validated_matrix",),
            "prime_implicants": ("_truth_table",),
            "parity_network": ("_xor_block",),
        }.get(lab["function"], ())
        implementation = (
            "import math\nimport random\nimport itertools\n\n"
            + "\n\n".join(inspect.getsource(getattr(reference, name)) for name in helpers)
            + "\n\n"
            + inspect.getsource(getattr(reference, lab["function"]))
        )
        passed, output = execute(runtime, lab, implementation)
        assert passed and f"PASS {lab['task']}" in output, (lab["task"], output)

    for lab in runtime["labs"]:
        starter_passed, starter_output = execute(runtime, lab, lab["starter"])
        assert not starter_passed and "NotImplementedError" in starter_output, (
            lab["task"], starter_output
        )
    print(
        "Browser-lab harness passed "
        f"{len(runtime['labs'])} reference implementations and failure capture."
    )


if __name__ == "__main__":
    main()
