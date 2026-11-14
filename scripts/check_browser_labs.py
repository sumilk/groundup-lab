"""Validate generated browser-lab payloads with the reference implementations."""
import inspect
import json
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import labs.checks as checks
import labs.reference as reference
from labs.registry import load_entries


RUNTIME_PATH = ROOT / "public" / "theory" / "lab-runtime.json"


def code_names(code):
    names = set(code.co_names)
    for const in code.co_consts:
        if isinstance(const, types.CodeType):
            names |= code_names(const)
    return names


def private_helpers(function, provided):
    """Private functions of the defining module that function needs, transitively."""
    home = vars(sys.modules[function.__module__])
    found, stack = {}, [function]
    while stack:
        for name in sorted(code_names(stack.pop().__code__)):
            value = home.get(name)
            if (name.startswith("_") and isinstance(value, types.FunctionType)
                    and name not in found and name not in provided):
                found[name] = value
                stack.append(value)
    return list(found.values())


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
    bundled = {"__name__": "browser_checks"}
    exec(runtime["checks"], bundled)
    assert list(bundled["CHECKS"]) == list(checks.CHECKS), (
        "browser checks bundle is stale or registers different tasks; rerun scripts/build-theory.mjs"
    )
    support_by_task = {entry["task"]: set(entry.get("supportFunctions", ())) for entry in load_entries()}
    for lab in runtime["labs"]:
        # Some references call private helpers that the lab's support code does
        # not provide; learners may write their own. Bundle those helpers with the
        # reference submitted to the same runner, without exposing them in starters.
        function = getattr(reference, lab["function"])
        support = support_by_task[lab["task"]]
        implementation = (
            "import math\nimport random\nimport itertools\n\n"
            + "\n\n".join(
                inspect.getsource(helper) for helper in private_helpers(function, support)
            )
            + "\n\n"
            + inspect.getsource(function)
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
