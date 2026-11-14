"""Reference implementations. Attempt exercises.py before reading.

The implementations live in topic modules, one per course part:

    labs/programming/reference.py
    labs/linalg_structure/reference.py
    labs/linalg_geometry/reference.py
    labs/linalg_decomposition/reference.py
    labs/probability_models/reference.py
    labs/probability_inference/reference.py
    labs/probability_modern_tools/reference.py
    labs/deep_learning_core/reference.py
    labs/ml_systems/reference.py

This module gathers them so python -m labs.checks --reference can test every task.

Everything the single-file reference.py exposed stays importable, including its
private helpers and stdlib modules; scripts/check_lab_exports.py enforces this.
"""
import itertools  # noqa: F401
import math  # noqa: F401
import random  # noqa: F401

from labs.programming.reference import *  # noqa: F401,F403
from labs.linalg_structure.reference import *  # noqa: F401,F403
from labs.linalg_geometry.reference import *  # noqa: F401,F403
from labs.linalg_decomposition.reference import *  # noqa: F401,F403
from labs.probability_models.reference import *  # noqa: F401,F403
from labs.probability_inference.reference import *  # noqa: F401,F403
from labs.probability_modern_tools.reference import *  # noqa: F401,F403
from labs.deep_learning_core.reference import *  # noqa: F401,F403
from labs.ml_systems.reference import *  # noqa: F401,F403

# Private helpers, importable as before the split (from labs.reference import _reduce).
from labs.linalg_structure.reference import (  # noqa: F401
    _eliminate,
    _reduce,
    _validated_columns,
    _validated_matrix,
)
from labs.linalg_geometry.reference import (  # noqa: F401
    _solve_square,
    _validated_symmetric,
    _validated_vector,
)
from labs.linalg_decomposition.reference import (  # noqa: F401
    _conditioning_factor,
    _conditioning_solve,
    _validated_compact_svd,
    _validated_rhs,
    _validated_singular_values,
    _validated_svd_factors,
    _validated_tolerance,
)
from labs.deep_learning_core.reference import (  # noqa: F401
    _binary_list,
    _finite_real_vector,
    _truth_table,
    _xor_block,
)
