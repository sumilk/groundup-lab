"""Fill these functions from the lessons. No GPU or API key is required.

The starters live in topic modules, one per course part (see labs/README.md
for which lessons each covers). Edit the function in its topic module:

    labs/programming/exercises.py
    labs/linalg_structure/exercises.py
    labs/linalg_geometry/exercises.py
    labs/linalg_decomposition/exercises.py
    labs/probability_models/exercises.py
    labs/probability_inference/exercises.py
    labs/probability_modern_tools/exercises.py
    labs/deep_learning_core/exercises.py
    labs/ml_systems/exercises.py

This module gathers them so python -m labs.checks can test every task. Each lab's
starter is always the one in its own topic (where its reference solution lives),
so a helper you write in another topic never replaces it.
"""
from labs.programming.exercises import *  # noqa: F401,F403
from labs.linalg_structure.exercises import *  # noqa: F401,F403
from labs.linalg_geometry.exercises import *  # noqa: F401,F403
from labs.linalg_decomposition.exercises import *  # noqa: F401,F403
from labs.probability_models.exercises import *  # noqa: F401,F403
from labs.probability_inference.exercises import *  # noqa: F401,F403
from labs.probability_modern_tools.exercises import *  # noqa: F401,F403
from labs.deep_learning_core.exercises import *  # noqa: F401,F403
from labs.ml_systems.exercises import *  # noqa: F401,F403

# The wildcard imports above let a later topic's function shadow an earlier one.
# Rebind each registered starter from its own topic, whatever the import order.
from labs import registry as _registry

_registry.bind_starters(globals())
