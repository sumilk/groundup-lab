# (module, scene class) in playback order; TITLES become the YouTube chapters
SCENES = [
    ("v3_opening", "V3Opening"),
    ("v3_act1", "V3Act1"),
    ("v3_act2", "V3Act2"),
    ("v3_act3", "V3Act3"),
    ("v3_act4", "V3Act4"),
    ("v3_act5", "V3Act5"),
    ("v3_act6", "V3Act6"),
    ("v3_act7", "V3Act7"),
    ("v3_act8", "V3Act8"),
    ("v3_act9", "V3Act9"),
    ("v3_act10", "V3Act10"),
    ("v3_finale", "V3Finale"),
]
MODULES = [m for m, _ in SCENES]
TITLES = {
    "v3_opening": "Where can you get to?",
    "v3_act1": "Act 1 · Moves and recipes",
    "v3_act2": "Act 2 · Reachable territory (span)",
    "v3_act3": "Act 3 · Dead weight (independence)",
    "v3_act4": "Act 4 · Addresses (basis and coordinates)",
    "v3_act5": "Act 5 · Seats (the exchange lemma and dimension)",
    "v3_act6": "Act 6 · Vectors that aren't arrows",
    "v3_act7": "Act 7 · Worlds inside worlds (subspaces, sums, affine sets)",
    "v3_act8": "Act 8 · Machines made of arrows (matrices)",
    "v3_act9": "Act 9 · Adding geometry (inner products)",
    "v3_act10": "Act 10 · Fragile addresses (conditioning)",
    "v3_finale": "Reachable? Unique? Stable?",
}
