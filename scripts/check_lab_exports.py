"""Check that the compatibility modules still provide every pre-split import.

labs/exercises.py, labs/reference.py and labs/checks.py were once single files.
They now gather the topic packages, but code written against them must keep
working. That covers direct imports, including private helpers (for example,
from labs.reference import _reduce), and wildcard imports. The expected names
are recorded in scripts/lab_exports_baseline.json. Names added later are allowed.
"""
import importlib
import json
from pathlib import Path
import sys
import types

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

BASELINE_PATH = Path(__file__).with_name("lab_exports_baseline.json")


def kind(value):
    if isinstance(value, types.ModuleType):
        return "module"
    if isinstance(value, types.FunctionType):
        return "function"
    return type(value).__name__


def check_module(module_name, expected):
    problems = []
    importlib.import_module(module_name)
    for name, expected_kind in expected["names"].items():
        namespace = {}
        try:
            exec(f"from {module_name} import {name}", namespace)
        except ImportError as error:
            problems.append(f"from {module_name} import {name} fails: {error}")
            continue
        value = namespace[name]
        if kind(value) != expected_kind:
            problems.append(f"{module_name}.{name} is a {kind(value)}, expected a {expected_kind}")
        elif expected_kind in ("function", "module") and value.__name__ != name:
            problems.append(f"{module_name}.{name} is bound to {value.__name__!r}")

    namespace = {}
    exec(f"from {module_name} import *", namespace)
    missing = sorted(set(expected["wildcard"]) - set(namespace))
    if missing:
        problems.append(f"from {module_name} import * no longer provides: {', '.join(missing)}")

    if "tasks" in expected:
        tasks = sys.modules[module_name].CHECKS
        missing = [task for task in expected["tasks"] if task not in tasks]
        if missing:
            problems.append(f"{module_name}.CHECKS lost tasks: {', '.join(missing)}")
    return problems


def main():
    baseline = json.loads(BASELINE_PATH.read_text(encoding="utf-8"))
    modules = [name for name in baseline if not name.startswith("_")]
    problems = [problem for name in modules for problem in check_module(name, baseline[name])]
    if problems:
        print("Lab import compatibility check failed:")
        for problem in problems:
            print("  -", problem)
        raise SystemExit(1)
    counts = ", ".join(
        f"{name} ({len(baseline[name]['names'])} names, {len(baseline[name]['wildcard'])} via *)"
        for name in modules
    )
    print(f"Lab import compatibility passed: {counts}.")


if __name__ == "__main__":
    main()
