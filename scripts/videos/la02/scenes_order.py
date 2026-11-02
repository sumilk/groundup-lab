# (module, scene class) in playback order; TITLES become the YouTube chapters (titles only, no numbers)
SCENES = [
    ("01_one_system", "OneSystem"),
    ("02_what_ax_computes", "WhatAxComputes"),
    ("03_matrix_as_map", "MatrixAsMap"),
    ("04_one_map_after_another", "OneMapAfterAnother"),
    ("05_transpose_inverse", "TransposeInverse"),
    ("06_elimination", "Elimination"),
    ("07_no_pivot", "NoPivot"),
    ("08_rank", "Rank"),
    ("09_every_solution", "EverySolution"),
    ("10_four_subspaces", "FourSubspaces"),
    ("11_elimination_as_multiplication", "EliminationAsMultiplication"),
    ("12_lu", "LU"),
    ("13_real_machine", "RealMachine"),
    ("14_close", "Close"),
]
MODULES = [m for m, _ in SCENES]
TITLES = {
    "01_one_system": "One system, two pictures",
    "02_what_ax_computes": "What A x computes",
    "03_matrix_as_map": "The matrix as a map",
    "04_one_map_after_another": "One map after another",
    "05_transpose_inverse": "Turning rows into columns, and running a map backwards",
    "06_elimination": "Elimination",
    "07_no_pivot": "When a column has no pivot",
    "08_rank": "Rank",
    "09_every_solution": "Every solution at once",
    "10_four_subspaces": "Four subspaces from one elimination",
    "11_elimination_as_multiplication": "Elimination as multiplication",
    "12_lu": "LU: elimination, remembered",
    "13_real_machine": "Elimination on a real machine",
    "14_close": "The matrix with 3072 columns",
}
