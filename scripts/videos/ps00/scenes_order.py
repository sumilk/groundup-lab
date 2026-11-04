# (module, scene class) in playback order; TITLES become the YouTube chapters (titles only, no numbers)
SCENES = [
    ("01_ninety_five", "NinetyFive"),
    ("02_what_could_happen", "WhatCouldHappen"),
    ("03_unit_of_mass", "UnitOfMass"),
    ("04_shrinks_world", "ShrinksWorld"),
    ("05_turning_around", "TurningAround"),
    ("06_stick_or_switch", "StickOrSwitch"),
    ("07_counting", "Counting"),
    ("08_independence", "Independence"),
    ("09_random_variables", "RandomVariables"),
    ("10_expectation", "Expectation"),
    ("11_model_and_coin", "ModelAndCoin"),
    ("12_machine_learning", "MachineLearning"),
]
MODULES = [m for m, _ in SCENES]
TITLES = {
    "01_ninety_five": "Ninety-five percent sure?",
    "02_what_could_happen": "What could happen",
    "03_unit_of_mass": "One unit of mass",
    "04_shrinks_world": "Knowing something shrinks the world",
    "05_turning_around": "Turning the question around",
    "06_stick_or_switch": "Stick or switch?",
    "07_counting": "Counting, when it's fair",
    "08_independence": "When knowing tells you nothing",
    "09_random_variables": "Outcomes become numbers",
    "10_expectation": "The average you'll never roll",
    "11_model_and_coin": "The model and the coin",
    "12_machine_learning": "Where this shows up in machine learning",
}
