"""Regression cases for how the build and CLI treat labs/registry.json.

Each case copies the repository's inputs into a temporary directory, changes
the copy, and runs the real browser build and the real python -m labs.checks
there. The repository itself is never modified.

    learner helpers      Functions learners add to exercises.py are not labs and
                         need no registry entry, even if a helper shares its name
                         with another topic's starter (the original build accepted
                         both).
    missing labs         A lab without a registry entry, or a registered lab whose
                         starter is missing from its topic, is reported, never
                         dropped or replaced.
    name collisions      A learner helper that reuses a starter's name in another
                         topic never changes which starter the CLI tests, whichever
                         topic is imported first.
    new topics           A new topic package made by following the README reaches
                         the CLI, the build and the browser runner. A misnamed or
                         incomplete topic package is reported, with the same
                         message, by both.
    adding a lab         The README's add-a-lab steps, end to end: three functions,
                         one registry entry and one lesson link reach the CLI, the
                         reader checks, the reference harness and the browser
                         runner. A learner's own implementation passes in the
                         runner without the reference's private helpers.

Expectations come from the registry and lessons as they are, never from a fixed
list of today's labs, so adding a valid lab anywhere keeps these cases passing.
The names the cases inject are checked up front to be unused by real labs.
"""
import ast
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]

LEARNER_HELPERS = '''

def learner_average(values):
    values = list(values)
    return sum(values) / len(values)


def _learner_scratch(x):
    return x
'''

# Learner helpers that share a name with another topic's starter. Horvitz-Thompson
# lives in probability_inference, imported before probability_modern_tools; softmax
# lives in ml_systems, imported after it. This covers both import orders.
LEARNER_HORVITZ_THOMPSON = '''

def horvitz_thompson(values, probabilities):
    return sum(v / p for v, p in zip(values, probabilities))
'''

# This helper is a working softmax, so testing it by mistake would pass.
LEARNER_SOFTMAX = '''

def stable_softmax(logits):
    import math
    top = max(logits)
    weights = [math.exp(x - top) for x in logits]
    return [w / sum(weights) for w in weights]
'''


def scratch_copy(directory, full=False):
    """Copy what the build needs; full=True adds what the reader and harness checks read."""
    ignore = shutil.ignore_patterns("__pycache__")
    shutil.copytree(ROOT / "labs", directory / "labs", ignore=ignore)
    shutil.copytree(ROOT / "content", directory / "content")
    if full:
        shutil.copytree(ROOT / "scripts", directory / "scripts", ignore=ignore)
        shutil.copytree(ROOT / "public", directory / "public")
    else:
        (directory / "scripts").mkdir()
        shutil.copy2(ROOT / "scripts" / "build-theory.mjs", directory / "scripts" / "build-theory.mjs")


def run(directory, *command):
    result = subprocess.run(command, cwd=directory, capture_output=True, text=True)
    return result.returncode, result.stdout + result.stderr


def build(directory):
    return run(directory, "node", "scripts/build-theory.mjs")


def cli(directory, *args):
    return run(directory, sys.executable, "-m", "labs.checks", *args)


def append(path, text):
    with open(path, "a", encoding="utf-8") as handle:
        handle.write(text)


def remove_function(path, name):
    source = path.read_text(encoding="utf-8")
    start = source.index(f"\ndef {name}(")
    end = source.find("\ndef ", start + 1)
    path.write_text(source[:start] + ("" if end < 0 else source[end:]), encoding="utf-8")


def reference_source(name, topic):
    source = (ROOT / "labs" / topic / "reference.py").read_text(encoding="utf-8")
    node = next(node for node in ast.parse(source).body if getattr(node, "name", None) == name)
    return "\n".join(source.splitlines()[node.lineno - 1:node.end_lineno]) + "\n"


def drop_registry_entry(directory, task):
    path = directory / "labs" / "registry.json"
    entries = json.loads(path.read_text(encoding="utf-8"))
    kept = [entry for entry in entries if entry["task"] != task]
    assert len(kept) == len(entries) - 1, f"registry has no task {task!r}"
    path.write_text(json.dumps(kept, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def expect(condition, message, output):
    if not condition:
        raise AssertionError(f"{message}\n--- output ---\n{output.strip()}")


def learner_helpers_are_accepted(directory):
    append(directory / "labs" / "programming" / "exercises.py", LEARNER_HELPERS)
    append(directory / "labs" / "probability_modern_tools" / "exercises.py", LEARNER_SOFTMAX)
    code, output = build(directory)
    expect(code == 0, "the build must accept helper functions in exercises.py", output)
    runtime = json.loads((directory / "public" / "theory" / "lab-runtime.json").read_text(encoding="utf-8"))
    registry = json.loads((directory / "labs" / "registry.json").read_text(encoding="utf-8"))
    expect(len(runtime["labs"]) == len(registry), "every registered lab must still be built", output)
    search = next(lab for lab in runtime["labs"] if lab["task"] == "search")
    expect("learner_average" not in search["starter"], "a helper must not leak into another starter", search["starter"])
    softmax = next(lab for lab in runtime["labs"] if lab["task"] == "softmax")
    expect("NotImplementedError" in softmax["starter"] and "top = max" not in softmax["starter"],
           "the softmax starter must come from its own topic, not a same-named helper", softmax["starter"])
    code, output = cli(directory, "--reference")
    expect(code == 0, "python -m labs.checks --reference must still pass", output)
    code, output = cli(directory, "search")
    expect(code == 1 and "FAIL search NotImplementedError" in output,
           "the CLI must still test the starter, unaffected by the helper", output)


def missing_entry_is_reported(directory):
    drop_registry_entry(directory, "search")
    code, output = build(directory)
    expect(code != 0 and "check 'search'" in output and "not registered" in output,
           "the build must report the lab whose entry is missing", output)
    code, output = cli(directory, "--reference")
    expect(code != 0 and "check 'search'" in output and "not registered" in output,
           "the CLI must report the check whose entry is missing", output)


def missing_entry_before_the_check_exists_is_reported(directory):
    append(directory / "labs" / "programming" / "exercises.py",
           '\n\ndef sample_clamp(value, low, high):\n    raise NotImplementedError("Compare against both bounds")\n')
    append(directory / "labs" / "programming" / "reference.py",
           "\n\ndef sample_clamp(value, low, high):\n    return min(max(value, low), high)\n")
    code, output = build(directory)
    expect(code != 0 and "starter 'sample_clamp'" in output and "no registry entry" in output,
           "the build must report a starter that has a reference solution but no entry", output)


def missing_starter_is_reported_despite_a_same_named_helper(directory):
    remove_function(directory / "labs" / "ml_systems" / "exercises.py", "stable_softmax")
    append(directory / "labs" / "probability_modern_tools" / "exercises.py", LEARNER_SOFTMAX)
    code, output = build(directory)
    expect(code != 0 and "labs/ml_systems/exercises.py has no starter 'stable_softmax'" in output,
           "a starter missing from its own topic must be reported, not replaced by a helper", output)
    code, output = cli(directory, "softmax")
    expect(code == 1 and "FAIL softmax AttributeError" in output and "stable_softmax" in output,
           "the CLI must fail a missing starter, not pass by testing a same-named helper", output)


def same_named_helper_never_replaces_the_starter_in_the_cli(directory):
    inference = directory / "labs" / "probability_inference" / "exercises.py"
    remove_function(inference, "horvitz_thompson")
    # Implement the starter as a learner would, including the import it needs.
    append(inference, "\n\nimport math\n\n\n" + reference_source("horvitz_thompson", "probability_inference"))
    modern = directory / "labs" / "probability_modern_tools" / "exercises.py"
    append(modern, LEARNER_HORVITZ_THOMPSON)
    append(modern, LEARNER_SOFTMAX)
    code, output = cli(directory, "horvitz-thompson")
    expect(code == 0 and "PASS horvitz-thompson" in output,
           "the CLI must test the implemented starter, not the helper in a later topic", output)
    code, output = cli(directory, "softmax")
    expect(code == 1 and "FAIL softmax NotImplementedError Normalize shifted exponentials" in output,
           "the CLI must test the softmax starter, not the helper in an earlier topic", output)
    code, output = run(directory, sys.executable, "-c", (
        "from labs.exercises import *\n"
        "print(horvitz_thompson.__module__, stable_softmax.__module__)"))
    expect(code == 0 and output.split() == ["labs.probability_inference.exercises", "labs.ml_systems.exercises"],
           "wildcard imports must bind each starter from its own topic", output)


SAMPLE_TOPIC = "programming"
EXERCISE_LINK = "](../../labs/exercises.py)"

# The sample lab for the end-to-end case. The reference reaches its validation
# through a chain of two private helpers, which learners never receive.
RUNNING_TOTALS_STARTER = '''

def sample_running_totals(values):
    """Return the running sums of finite numbers as a list; reject anything else."""
    raise NotImplementedError("Accumulate one value at a time")
'''

RUNNING_TOTALS_REFERENCE = '''

def _sample_finite_number(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError("finite numbers required")
    return value


def _sample_validated_numbers(values):
    return [_sample_finite_number(value) for value in values]


def sample_running_totals(values):
    totals, total = [], 0
    for value in _sample_validated_numbers(values):
        total += value
        totals.append(total)
    return totals
'''

RUNNING_TOTALS_CHECK = '''

def sample_running_totals(m):
    values = [1, 2.5, -3]
    totals = m.sample_running_totals(values)
    assert values == [1, 2.5, -3], "do not mutate the input"
    assert len(totals) == 3
    for actual, expected in zip(totals, [1, 3.5, 0.5]):
        close(actual, expected)
    assert m.sample_running_totals([]) == []
    assert m.sample_running_totals(iter([4, 4])) == [4, 8], "accept any iterable"
    for bad in ([1, "2"], [True], [float("nan")], [1, float("inf")]):
        try:
            m.sample_running_totals(bad)
        except ValueError:
            continue
        raise AssertionError("invalid values should be rejected")
'''

RUNNING_TOTALS_ENTRY = {
    "task": "sample-running-totals",
    "lesson": "01-python/01-python-memory-iteration.md",
    "title": "Sample running totals",
    "function": "sample_running_totals",
    "check": "sample_running_totals",
}

# What a learner writes: self-contained, with no access to the private helpers.
LEARNER_RUNNING_TOTALS = '''def sample_running_totals(values):
    totals, total = [], 0
    for value in values:
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
            raise ValueError("running totals need finite numbers")
        total += value
        totals.append(total)
    return totals
'''

# A common mistake: it forgets that bool is an int subclass and that floats can be non-finite.
LEARNER_RUNNING_TOTALS_TOO_LENIENT = '''def sample_running_totals(values):
    totals, total = [], 0
    for value in values:
        if not isinstance(value, (int, float)):
            raise ValueError("running totals need numbers")
        total += value
        totals.append(total)
    return totals
'''


def run_in_browser_runner(runtime, lab, code):
    """Execute code exactly as the reader's worker does: support, learner code, bundled checks."""
    namespace = {
        "__lab_code": code,
        "__lab_checks": runtime["checks"],
        "__lab_task": lab["task"],
        "__lab_mode": "test",
        "__lab_support": lab["support"],
    }
    exec(runtime["runner"], namespace)
    return namespace["passed"], namespace["buffer"].getvalue()


def adding_a_lab_end_to_end(directory):
    labs = directory / "labs"
    topic = labs / SAMPLE_TOPIC
    lesson = directory / "content" / RUNNING_TOTALS_ENTRY["lesson"]
    expect(topic.is_dir() and lesson.is_file(),
           f"the sample lab needs topic labs/{SAMPLE_TOPIC} and lesson content/{RUNNING_TOTALS_ENTRY['lesson']}; "
           "point SAMPLE_TOPIC and RUNNING_TOTALS_ENTRY at ones that exist", "")
    registry_path = labs / "registry.json"
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    total = len(registry) + 1
    # Whatever labs the lesson already has, the sample becomes its last entry and last link.
    lesson_before = [entry["task"] for entry in registry if entry["lesson"] == RUNNING_TOTALS_ENTRY["lesson"]]
    links_before = lesson.read_text(encoding="utf-8").count(EXERCISE_LINK)
    expect(links_before == len(lesson_before),
           "before the sample is added, the lesson's exercise links must match its registry entries",
           f"{lesson_before}, {links_before} links")

    # The README's steps: three functions, one registry entry, one lesson link.
    append(topic / "exercises.py", RUNNING_TOTALS_STARTER)
    append(topic / "reference.py", RUNNING_TOTALS_REFERENCE)
    append(topic / "checks.py", RUNNING_TOTALS_CHECK)
    registry.append(RUNNING_TOTALS_ENTRY)
    registry_path.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    append(lesson, "\n\nImplement sample_running_totals in [exercises.py]" + EXERCISE_LINK[1:] + "\n")

    code, output = cli(directory, "--reference", "sample-running-totals")
    expect(code == 0 and "PASS sample-running-totals" in output, "the reference must pass through the CLI", output)
    code, output = cli(directory, "sample-running-totals")
    expect(code == 1 and "FAIL sample-running-totals NotImplementedError Accumulate one value at a time" in output,
           "the CLI must test the new starter", output)
    code, output = cli(directory, "--reference")
    expect(code == 0 and output.count("PASS ") == total, f"the full suite must run all {total} tasks", output)

    code, output = build(directory)
    expect(code == 0 and f"{total} browser labs" in output, f"the build must include all {total} labs", output)
    runtime = json.loads((directory / "public" / "theory" / "lab-runtime.json").read_text(encoding="utf-8"))
    lab = next(lab for lab in runtime["labs"] if lab["task"] == "sample-running-totals")
    expect("def sample_running_totals(" in lab["starter"] and "NotImplementedError" in lab["starter"]
           and "_sample_validated_numbers" not in lab["starter"] and lab["support"] == "",
           "the browser starter must be the stub, without the reference's private helpers", json.dumps(lab, indent=1))
    in_lesson = [entry["task"] for entry in runtime["labs"] if entry["lesson"] == RUNNING_TOTALS_ENTRY["lesson"]]
    expected = lesson_before + [RUNNING_TOTALS_ENTRY["task"]]
    links = lesson.read_text(encoding="utf-8").count(EXERCISE_LINK)
    expect(in_lesson == expected and links == len(expected),
           f"the lesson's last exercise link (number {len(expected)}) must open the new lab, after its existing labs",
           f"expected {expected} and {len(expected)} links; got {in_lesson} and {links} links")

    code, output = run(directory, "node", "scripts/check-theory.mjs")
    expect(code == 0, "the reader checks must accept the new lab and its lesson link", output)
    code, output = run(directory, sys.executable, "scripts/check_browser_labs.py")
    expect(code == 0 and f"passed {total} reference" in output,
           "the reference harness must pass for every lab, including the new one and its private helper chain", output)

    header = lab["starter"].split("def sample_running_totals(")[0]
    passed, output = run_in_browser_runner(runtime, lab, header + LEARNER_RUNNING_TOTALS)
    expect(passed and "PASS sample-running-totals" in output,
           "a learner's own implementation must pass in the browser runner", output)
    passed, output = run_in_browser_runner(runtime, lab, header + LEARNER_RUNNING_TOTALS_TOO_LENIENT)
    expect(not passed and "invalid values should be rejected" in output,
           "the browser runner must report a learner implementation that fails the check", output)
    bare_reference = RUNNING_TOTALS_REFERENCE.split("def sample_running_totals(")[1]
    passed, output = run_in_browser_runner(runtime, lab, header + "def sample_running_totals(" + bare_reference)
    expect(not passed and "NameError" in output and "_sample_validated_numbers" in output,
           "learners must not receive the reference's private helpers in the browser", output)

    exercises = labs / "programming" / "exercises.py"
    remove_function(exercises, "sample_running_totals")
    append(exercises, "\n\nimport math\n\n\n" + LEARNER_RUNNING_TOTALS)
    code, output = cli(directory, "sample-running-totals")
    expect(code == 0 and "PASS sample-running-totals" in output,
           "the same learner implementation must pass through the CLI", output)


SAMPLE_NEW_TOPIC = "sample_topic"
SAMPLE_TOPIC_FILES = {
    "__init__.py": '''"""A sample topic package made by scripts/check_lab_registry.py."""
''',
    "exercises.py": '''"""Starters for the sample topic."""


def sample_scaled_sum(values, factor):
    """Return factor * sum(values) for finite numbers; reject anything else."""
    raise NotImplementedError("Add the values, then scale the total")
''',
    "reference.py": '''"""Reference implementations for the sample topic."""
import math


def _sample_finite(value):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError("finite numbers required")
    return value


def sample_scaled_sum(values, factor):
    return _sample_finite(factor) * math.fsum(_sample_finite(value) for value in values)
''',
    "checks.py": '''"""Behavioral checks for the sample topic."""
from labs.check_helpers import _projection_rejects, close


def sample_scaled_sum(m):
    close(m.sample_scaled_sum([1, 2.5, -0.5], 2), 6)
    close(m.sample_scaled_sum([], 3), 0)
    for args in (([1, "2"], 1), ([True], 1), ([1], float("nan"))):
        _projection_rejects(m.sample_scaled_sum, *args)
''',
}
SAMPLE_TOPIC_ENTRY = {
    "task": "sample-scaled-sum",
    "lesson": "03-optimization/01-calculus-gradients-optimization.md",
    "title": "Sample scaled sum",
    "function": "sample_scaled_sum",
    "check": "sample_scaled_sum",
}
LEARNER_SCALED_SUM = '''def sample_scaled_sum(values, factor):
    total = 0.0
    for value in list(values) + [factor]:
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
            raise ValueError("scaled sums need finite numbers")
    for value in values:
        total += value
    return factor * total
'''


def make_topic(directory, name, files=SAMPLE_TOPIC_FILES):
    topic = directory / "labs" / name
    topic.mkdir()
    for filename, text in files.items():
        (topic / filename).write_text(text, encoding="utf-8")
    return topic


def add_to_gathering_modules(directory, name):
    for role in ("exercises", "reference"):
        append(directory / "labs" / f"{role}.py", f"from labs.{name}.{role} import *  # noqa: F401,F403\n")


def new_topic_package_reaches_the_cli_build_and_runner(directory):
    # The README's new-topic steps: a package with __init__.py and all three modules,
    # one line in each gathering module, and one registry entry.
    make_topic(directory, SAMPLE_NEW_TOPIC)
    add_to_gathering_modules(directory, SAMPLE_NEW_TOPIC)
    registry_path = directory / "labs" / "registry.json"
    registry = json.loads(registry_path.read_text(encoding="utf-8"))
    registry.append(SAMPLE_TOPIC_ENTRY)
    registry_path.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    code, output = cli(directory, "--reference", "sample-scaled-sum")
    expect(code == 0 and "PASS sample-scaled-sum" in output, "the new topic's reference must pass through the CLI", output)
    code, output = cli(directory, "sample-scaled-sum")
    expect(code == 1 and "FAIL sample-scaled-sum NotImplementedError Add the values" in output,
           "the CLI must test the new topic's starter", output)
    code, output = build(directory)
    expect(code == 0 and f"{len(registry)} browser labs" in output, "the build must include the new topic's lab", output)
    runtime = json.loads((directory / "public" / "theory" / "lab-runtime.json").read_text(encoding="utf-8"))
    lab = next(lab for lab in runtime["labs"] if lab["task"] == "sample-scaled-sum")
    expect("NotImplementedError" in lab["starter"] and "_sample_finite" not in lab["starter"]
           and "def sample_scaled_sum(m):" in runtime["checks"],
           "the browser must get the stub starter and the new topic's check", json.dumps(lab, indent=1))
    header = lab["starter"].split("def sample_scaled_sum(")[0]
    passed, output = run_in_browser_runner(runtime, lab, header + LEARNER_SCALED_SUM)
    expect(passed and "PASS sample-scaled-sum" in output,
           "a learner's own implementation must pass in the browser runner", output)
    exercises = directory / "labs" / SAMPLE_NEW_TOPIC / "exercises.py"
    remove_function(exercises, "sample_scaled_sum")
    append(exercises, "\n\nimport math\n\n\n" + LEARNER_SCALED_SUM)
    code, output = cli(directory, "sample-scaled-sum")
    expect(code == 0 and "PASS sample-scaled-sum" in output,
           "the same learner implementation must pass through the CLI", output)


def malformed_topic_packages_are_reported(directory):
    pristine = directory / "pristine"
    shutil.copytree(directory, pristine, ignore=shutil.ignore_patterns("pristine"))
    without_init = {name: text for name, text in SAMPLE_TOPIC_FILES.items() if name != "__init__.py"}
    without_checks = {name: text for name, text in SAMPLE_TOPIC_FILES.items() if name != "checks.py"}
    variants = [
        ("sample-topic", SAMPLE_TOPIC_FILES,
         "labs/sample-topic: a topic name must be a Python identifier that is not a keyword, e.g. sample_topic"),
        ("reference", SAMPLE_TOPIC_FILES, "labs/reference clashes with labs/reference.py; choose another topic name"),
        (SAMPLE_NEW_TOPIC, without_init,
         f"labs/{SAMPLE_NEW_TOPIC} has exercises.py, reference.py, checks.py but no __init__.py"),
        (SAMPLE_NEW_TOPIC, without_checks, f"labs/{SAMPLE_NEW_TOPIC} is missing checks.py"),
    ]
    for name, files, message in variants:
        variant = directory / "variant"
        if variant.exists():
            shutil.rmtree(variant)
        shutil.copytree(pristine, variant)
        make_topic(variant, name, files)
        code, output = cli(variant, "--reference", "moments")
        expect(code != 0 and message in output, f"the CLI must report: {message}", output)
        code, output = build(variant)
        expect(code != 0 and message in output, f"the build must report: {message}", output)


CASES = [
    ("learner helpers in exercises.py are accepted", learner_helpers_are_accepted),
    ("a lab whose registry entry is missing is reported", missing_entry_is_reported),
    ("a starter with a reference but no entry is reported before its check exists",
     missing_entry_before_the_check_exists_is_reported),
    ("a starter missing from its own topic is reported, not replaced by a same-named helper",
     missing_starter_is_reported_despite_a_same_named_helper),
    ("a same-named helper in another topic never replaces the starter the CLI tests",
     same_named_helper_never_replaces_the_starter_in_the_cli),
    ("adding a lab end to end reaches the CLI, reader checks, harness and browser runner",
     adding_a_lab_end_to_end),
    ("a new topic package reaches the CLI, the build and the browser runner",
     new_topic_package_reaches_the_cli_build_and_runner),
    ("a misnamed or incomplete topic package is reported by both the CLI and the build",
     malformed_topic_packages_are_reported),
]


def sample_name_collisions():
    """Names this script injects must be unused, so a real lab can never clash with a sample."""
    functions = {
        "learner_average", "_learner_scratch", "sample_clamp",
        "sample_running_totals", "_sample_finite_number", "_sample_validated_numbers",
        "sample_scaled_sum", "_sample_finite",
    }
    tasks = {RUNNING_TOTALS_ENTRY["task"], SAMPLE_TOPIC_ENTRY["task"]}
    problems = [f"labs/{name} already exists" for name in (SAMPLE_NEW_TOPIC, "sample-topic")
                if (ROOT / "labs" / name).exists()]
    for path in sorted((ROOT / "labs").rglob("*.py")):
        if "__pycache__" in path.parts:
            continue
        for node in ast.parse(path.read_text(encoding="utf-8")).body:
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name in functions:
                problems.append(f"{node.name} is already defined in {path.relative_to(ROOT)}")
    for entry in json.loads((ROOT / "labs" / "registry.json").read_text(encoding="utf-8")):
        if entry.get("task") in tasks:
            problems.append(f"task {entry['task']!r} is already in labs/registry.json")
        for field in ("function", "check"):
            if entry.get(field) in functions:
                problems.append(f"{field} {entry[field]!r} is already in labs/registry.json")
    return problems


def main():
    if shutil.which("node") is None:
        raise SystemExit("check_lab_registry.py needs node on PATH to run the browser build")
    clashes = sample_name_collisions()
    if clashes:
        raise SystemExit("check_lab_registry.py injects sample code whose names now clash with real labs; "
                         "rename the samples in this script:\n  - " + "\n  - ".join(clashes))
    failures = 0
    for name, case in CASES:
        with tempfile.TemporaryDirectory(prefix="lab-registry-") as directory:
            directory = Path(directory)
            scratch_copy(directory, full=case is adding_a_lab_end_to_end)
            try:
                case(directory)
                print("ok  ", name)
            except AssertionError as error:
                failures += 1
                print("FAIL", name)
                print("    " + str(error).replace("\n", "\n    "))
    if failures:
        raise SystemExit(f"{failures} of {len(CASES)} lab registry case(s) failed")
    print(f"Lab registry regression cases passed ({len(CASES)}).")


if __name__ == "__main__":
    main()
