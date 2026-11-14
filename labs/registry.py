"""Load labs/registry.json, the one list of labs.

Each entry names a task once. python -m labs.checks builds CHECKS from it here,
and scripts/build-theory.mjs builds the browser labs from the same file, so the
CLI and the browser cannot drift apart. Both sides apply the same structural
rules and report every problem they find instead of skipping an entry.

Entry fields:
    task              CLI and browser task name, e.g. "solve-complete"
    lesson            lesson path under content/
    title             browser tab title
    function          starter in labs/<topic>/exercises.py, same name in reference.py
    check             check function in labs/<topic>/checks.py, taking one argument m
    supportFunctions  optional reference functions preloaded for browser learners

Entry order is the order in which python -m labs.checks runs the suite. Within
one lesson it is also the order of the lesson's exercise links.
"""
import ast
import importlib
import inspect
import json
import keyword
from pathlib import Path
import re
import types

LABS_DIR = Path(__file__).resolve().parent
REGISTRY_PATH = LABS_DIR / "registry.json"
REQUIRED_FIELDS = ("task", "lesson", "title", "function", "check")
OPTIONAL_FIELDS = ("supportFunctions",)
UNIQUE_FIELDS = ("task", "function", "check")
TOPIC_MODULES = ("exercises", "reference", "checks")


class RegistryError(ValueError):
    """labs/registry.json or a topic package under labs/ is malformed, or they disagree."""


def _fail(problems, source="labs/registry.json"):
    listing = "\n".join("  - " + problem for problem in problems)
    raise RegistryError(f"{source} has {len(problems)} problem(s):\n{listing}")


def topic_packages():
    """Names of the topic packages: subdirectories of labs/ with an __init__.py.

    The browser build applies the same rules. A topic needs all three modules, a
    name Python can import, and a name that no module in labs/ already uses. A
    directory holding lab modules but no __init__.py is reported, not ignored.
    """
    taken = {path.stem for path in LABS_DIR.glob("*.py")}
    topics, problems = [], []
    for path in sorted(LABS_DIR.iterdir()):
        if not path.is_dir() or path.name == "__pycache__" or path.name.startswith("."):
            continue
        present = [name for name in TOPIC_MODULES if (path / f"{name}.py").is_file()]
        where = f"labs/{path.name}"
        if not (path / "__init__.py").is_file():
            if present:
                files = ", ".join(name + ".py" for name in present)
                problems.append(f"{where} has {files} but no __init__.py, so it is not a topic package; add one")
            continue
        if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", path.name) or keyword.iskeyword(path.name):
            suggestion = re.sub(r"[^A-Za-z0-9_]", "_", path.name).lstrip("0123456789_")
            valid = suggestion and not keyword.iskeyword(suggestion)
            problems.append(f"{where}: a topic name must be a Python identifier that is not a keyword"
                            + (f", e.g. {suggestion}" if valid else ""))
        elif path.name in taken:
            problems.append(f"{where} clashes with labs/{path.name}.py; choose another topic name")
        missing = [name + ".py" for name in TOPIC_MODULES if name not in present]
        if missing:
            problems.append(f"{where} is missing {', '.join(missing)}")
        topics.append(path.name)
    if problems:
        _fail(problems, source="labs/")
    return topics


def load_entries(path=REGISTRY_PATH):
    """Return the registry entries after checking their structure."""
    try:
        entries = json.loads(Path(path).read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        _fail([f"not valid JSON: {error}"])
    if not isinstance(entries, list) or not entries:
        _fail(["the top level must be a non-empty JSON array of lab entries"])

    problems = []
    first_seen = {field: {} for field in UNIQUE_FIELDS}
    for number, entry in enumerate(entries, start=1):
        if not isinstance(entry, dict):
            problems.append(f"entry {number} is not a JSON object")
            continue
        label = f"entry {number}" + (f" ({entry['task']!r})" if isinstance(entry.get("task"), str) else "")
        for field in REQUIRED_FIELDS:
            value = entry.get(field)
            if not isinstance(value, str) or not value.strip():
                problems.append(f"{label} needs a non-empty string {field!r}")
        unknown = sorted(set(entry) - set(REQUIRED_FIELDS) - set(OPTIONAL_FIELDS))
        if unknown:
            problems.append(f"{label} has unknown field(s): {', '.join(unknown)}")
        support = entry.get("supportFunctions", [])
        if not isinstance(support, list) or not all(isinstance(name, str) and name for name in support):
            problems.append(f"{label} 'supportFunctions' must be a list of function names")
        for field in UNIQUE_FIELDS:
            value = entry.get(field)
            if isinstance(value, str) and value:
                if value in first_seen[field]:
                    problems.append(
                        f"duplicate {field} {value!r} in entries {first_seen[field][value]} and {number}"
                    )
                else:
                    first_seen[field][value] = number
    if problems:
        _fail(problems)
    return entries


def home_topics(path=REGISTRY_PATH):
    """Map each registered function to the topic whose reference.py defines it.

    This is the lab's own topic; the browser build uses the same rule. The
    reference files are parsed, not imported, so exercise mode never runs
    solution code. Functions without exactly one reference are left out.
    """
    defined = {}
    for topic in topic_packages():
        tree = ast.parse((LABS_DIR / topic / "reference.py").read_text(encoding="utf-8"))
        for node in tree.body:
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                defined.setdefault(node.name, []).append(topic)
    homes = {}
    for entry in load_entries(path):
        topics = defined.get(entry["function"], [])
        if len(topics) == 1:
            homes[entry["function"]] = topics[0]
    return homes


def bind_starters(namespace, path=REGISTRY_PATH):
    """Bind every registered starter in namespace from its own topic's exercises.py.

    labs/exercises.py gathers the topics with wildcard imports, so a learner
    helper that reuses a starter's name in another topic could otherwise replace
    the starter, depending on import order. If a starter is missing from its
    own topic, the name is removed rather than bound to such a helper, so its
    check fails instead of silently testing the wrong function.
    """
    for function, topic in home_topics(path).items():
        module = importlib.import_module(f"labs.{topic}.exercises")
        if function in vars(module):
            namespace[function] = vars(module)[function]
        else:
            namespace.pop(function, None)


def is_check_function(value):
    """Checks are public functions taking a single parameter named m."""
    return (
        isinstance(value, types.FunctionType)
        and not value.__name__.startswith("_")
        and list(inspect.signature(value).parameters) == ["m"]
    )


def load_checks(path=REGISTRY_PATH):
    """Return {task: check function} in registry order.

    Fails if an entry names a check that no topic defines, if two topics define
    the same check name, or if a topic defines a check that no entry registers.
    """
    entries = load_entries(path)
    problems = []
    defined = {}
    for topic in topic_packages():
        module = importlib.import_module(f"labs.{topic}.checks")
        for name, value in vars(module).items():
            if not (isinstance(value, types.FunctionType) and value.__module__ == module.__name__):
                continue
            if name in defined:
                problems.append(
                    f"check function {name!r} is defined in both {defined[name].__module__} and {module.__name__}"
                )
            defined[name] = value

    for entry in entries:
        if entry["check"] not in defined:
            problems.append(
                f"task {entry['task']!r}: no labs/<topic>/checks.py defines check {entry['check']!r}"
            )
        elif not is_check_function(defined[entry["check"]]):
            problems.append(
                f"task {entry['task']!r}: {entry['check']!r} must be a public function taking one argument m"
            )
    registered = {entry["check"] for entry in entries}
    for name, value in defined.items():
        if is_check_function(value) and name not in registered:
            problems.append(
                f"check {name!r} in {value.__module__} is not registered; add an entry for it"
            )
    if problems:
        _fail(problems)
    return {entry["task"]: defined[entry["check"]] for entry in entries}
