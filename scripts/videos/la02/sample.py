"""Two-minute audiovisual sample (step 3 of docs/LA02_VIDEO_VOICE_PLAN.md): LA02 §1, one system, two pictures.

Narration: docs/LA02_VIDEO_TEST_PASSAGE.md with the punctuation chosen in step 2 (voice_test.PASSAGE_V2).
Two spaces, never merged: the input panel holds the amounts (x, y) and the row lines; the output panel holds
the columns and the target. They are linked only by A.
"""
from types import SimpleNamespace

from common import *  # noqa: F401,F403

C_L1 = "#E58FB5"     # line of the first equation
C_L2 = C_P           # line of the second equation
UNIT = 0.68
LEFT_C, RIGHT_C = np.array([-3.5, -0.9, 0]), np.array([3.5, -0.9, 0])
TOP_Y = 2.85
XR, YR = (-1, 5), (-1, 6)


def panel(center, title):
    p = plane(XR, YR, unit=UNIT).move_to(center)
    t = P(title, 22, C_DIM).next_to(p, UP, buff=0.15)
    return p, t


def eq_cells(cells, colors=None):
    """One equation as separate, individually colourable pieces on fixed column positions."""
    xs = [0.12, 0.42, 0.9, 1.3, 1.58, 2.08, 2.5]
    row = VGroup()
    for k, c in enumerate(cells):
        m = M(c, 38, (colors or {}).get(k, WHITE))
        m.move_to(RIGHT * xs[k])
        row.add(m)
    for k in (0, 3):                          # coefficients sit right up against their variable
        row[k].next_to(row[k + 1], LEFT, buff=0.04)
    return row


class Sample(NScene):
    PARAS = [
        ["Here are two equations of the kind you've solved in school.",
         "Two x minus y equals one.",
         "And x plus y equals five."],
        ["On its own, each equation is a line.",
         "Every point on it makes that equation true.",
         "A point on both lines makes both true.",
         "So the solution is... wherever they cross."],
        ["Two across, three up.",
         "x is two, and y is three."],
        ["Read the same equations down the columns, instead of across the rows.",
         "The numbers beside x are two, and one.",
         "The numbers beside y are minus one, and one.",
         "Each column is an arrow.",
         "Blue goes two right and one up.",
         "Teal goes one left and one up.",
         "And the numbers on the right, one and five, are a target."],
        ["Put the columns side by side and you have the matrix A.",
         "And the equations are asking the question from chapter one: how much blue, and how much teal, "
         "reaches the target?"],
        ["We've already found an answer on the left: two and three.",
         "So take two blue arrows, then three teal ones.",
         "Where do you think you'll end up?"],
        ["Two blues. That's four right, two up.",
         "Three teals. Three left, three up.",
         "Across, four minus three, is one.",
         "Up, two plus three, is five.",
         "One, five. Exactly the target."],
        ["So the same pair, two and three, has two jobs.",
         "On the left, it's a place. Where the lines cross.",
         "On the right, it's a recipe. The amounts that reach the target."],
        ["With two unknowns, you can draw the lines.",
         "With seven hundred and sixty-eight unknowns, you can't draw anything.",
         "But you can still ask whether these columns can reach the target."],
    ]

    def construct(self):
        self.passage()
        self.done(1.5)

    def passage(self):
        """The approved passage. Returns its mobjects so a longer scene can carry on from the final frame."""
        # ---------------------------------------------------------------- input panel, the equations
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        eq1 = M("2<i>x</i> − <i>y</i> = 1", 38)
        eq2 = M("<i>x</i> + <i>y</i> = 5", 38)
        eqs = VGroup(eq1, eq2).arrange(DOWN, buff=0.3, aligned_edge=RIGHT)
        eqs.move_to(np.array([-3.5, TOP_Y, 0]))

        d = self.say()
        self.play(Create(pin), FadeIn(tin), run_time=min(1.5, d))
        d = self.say()
        self.play(Write(eq1), run_time=min(1.4, d))
        d = self.say()
        self.play(Write(eq2), run_time=min(1.4, d))
        self.pause(0.2)

        # ---------------------------------------------------------------- lines
        l1 = Line(pin.c2p(0, -1), pin.c2p(3.5, 6), color=C_L1, stroke_width=4)
        l2 = Line(pin.c2p(-1, 6), pin.c2p(5, 0), color=C_L2, stroke_width=4)
        d = self.say()                                   # each equation is a line
        self.play(eq1.animate.set_color(C_L1), Create(l1), run_time=d * 0.45)
        self.play(eq2.animate.set_color(C_L2), Create(l2), run_time=d * 0.45)
        walker = Dot(pin.c2p(0.5, 0), radius=0.08, color=C_L1)
        d = self.say()                                   # every point on it makes it true
        self.play(FadeIn(walker, scale=0.5), run_time=0.3)
        self.play(MoveAlongPath(walker, Line(pin.c2p(0.5, 0), pin.c2p(3.2, 5.4))),
                  run_time=max(1.0, d - 0.5), rate_func=there_and_back)
        d = self.say()                                   # a point on both lines makes both true
        self.play(FadeOut(walker), l1.animate.set_stroke(width=6), l2.animate.set_stroke(width=6),
                  run_time=min(1.0, d))
        cross = Circle(radius=0.2, color=WHITE, stroke_width=3).move_to(pin.c2p(2, 3))
        d = self.say()                                   # wherever they cross
        self.wait(max(0, d - 1.0))
        self.play(Create(cross), l1.animate.set_stroke(width=4), l2.animate.set_stroke(width=4), run_time=0.8)
        self.pause(2.0)                                  # ⏸ read the crossing off the grid

        # ---------------------------------------------------------------- the point (2, 3)
        sol = dot(pin, 2, 3, WHITE, r=0.09)
        gx = DashedLine(pin.c2p(0, 0), pin.c2p(2, 0), color=WHITE, stroke_width=3, dash_length=0.1)
        gy = DashedLine(pin.c2p(2, 0), pin.c2p(2, 3), color=WHITE, stroke_width=3, dash_length=0.1)
        d = self.say()                                   # two across, three up
        self.play(Create(gx), run_time=d * 0.4)
        self.play(Create(gy), run_time=d * 0.4)
        sol_lab = M("<i>x</i> = 2, <i>y</i> = 3", 26).next_to(sol, RIGHT, buff=0.3).shift(DOWN * 0.08)
        sol_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.06)
        d = self.say()                                   # x is two, y is three
        self.play(ReplacementTransform(cross, sol), FadeIn(sol_lab), run_time=min(1.0, d))
        self.play(FadeOut(gx), FadeOut(gy), run_time=0.5)
        self.pause(1.0)

        # ---------------------------------------------------------------- read down the columns
        e1 = eq_cells(["2", "<i>x</i>", "−", "1", "<i>y</i>", "=", "1"])
        e2 = eq_cells(["1", "<i>x</i>", "+", "1", "<i>y</i>", "=", "5"])
        grid = VGroup(e1, e2)
        e2.next_to(e1, DOWN, buff=0.3, aligned_edge=LEFT)
        grid.move_to(eqs).align_to(eqs, RIGHT)
        for r, c in ((e1, C_L1), (e2, C_L2)):
            for k in (1, 2, 4, 5):
                r[k].set_color(c)
        hidden_ones = VGroup(e1[3], e2[0], e2[3]).set_opacity(0.0)

        d = self.say()                                   # read down the columns
        self.play(FadeTransform(eq1, VGroup(*[e1[k] for k in (0, 1, 2, 4, 5, 6)])),
                  FadeTransform(eq2, VGroup(*[e2[k] for k in (1, 2, 4, 5, 6)])), run_time=1.0)
        self.add(hidden_ones)
        self.play(hidden_ones.animate.set_opacity(1).set_color(C_DIM), run_time=max(0.6, d - 1.2))
        colx = VGroup(e1[0], e2[0])
        coly = VGroup(e1[2], e1[3], e2[3])
        colb = VGroup(e1[6], e2[6])
        d = self.say()                                   # numbers beside x: two and one
        bx = SurroundingRectangle(colx, color=C_U, buff=0.1, corner_radius=0.08)
        self.play(colx.animate.set_color(C_U), Create(bx), run_time=min(1.2, d))
        d = self.say()                                   # beside y: minus one and one
        by = SurroundingRectangle(coly, color=C_Q, buff=0.1, corner_radius=0.08)
        self.play(coly.animate.set_color(C_Q), Create(by), run_time=min(1.2, d))

        # ---------------------------------------------------------------- output panel
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        d = self.say()                                   # each column is an arrow
        self.play(Create(pout), FadeIn(tout), run_time=min(1.5, d))
        a1 = vec(pout, 2, 1, C_U, width=6)
        a2 = vec(pout, -1, 1, C_Q, width=6)
        a1_lab = M("(2, 1)", 26, C_U).next_to(a1.get_end(), RIGHT, buff=0.1)
        a2_lab = M("(−1, 1)", 26, C_Q).next_to(a2.get_end(), UP, buff=0.1)
        d = self.say()                                   # blue: two right, one up
        self.play(TransformFromCopy(colx, a1_lab), GrowArrow(a1), run_time=min(1.6, d))
        d = self.say()                                   # teal: one left, one up
        self.play(TransformFromCopy(coly, a2_lab), GrowArrow(a2), run_time=min(1.6, d))
        tgt = dot(pout, 1, 5, C_W, r=0.1)
        tgt_lab = M("(1, 5)", 26, C_W).next_to(tgt, RIGHT, buff=0.12)
        bb = SurroundingRectangle(colb, color=C_W, buff=0.1, corner_radius=0.08)
        d = self.say()                                   # one and five: a target
        self.play(colb.animate.set_color(C_W), Create(bb), run_time=min(1.0, d * 0.5))
        self.play(TransformFromCopy(colb, tgt_lab), FadeIn(tgt, scale=0.5), run_time=min(1.2, d * 0.4))
        self.pause(0.6)

        # ---------------------------------------------------------------- the matrix A
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_name = M("<i>A</i> =", 34)
        A_grp = VGroup(A_name, A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))
        d = self.say()                                   # columns side by side: the matrix A
        self.play(FadeIn(A_name),
                  FadeIn(VGroup(A[0], A[2])),
                  TransformFromCopy(e1[0], A.entries[0][0]), TransformFromCopy(e2[0], A.entries[1][0]),
                  TransformFromCopy(VGroup(e1[2], e1[3]), A.entries[0][1]),
                  TransformFromCopy(e2[3], A.entries[1][1]), run_time=min(1.8, d))
        q = VGroup(M("<i>x</i>", 32), M("(2, 1)", 32, C_U), M("+", 32), M("<i>y</i>", 32), M("(−1, 1)", 32, C_Q),
                   M("=", 32), M("(1, 5)", 32, C_W)).arrange(RIGHT, buff=0.14)
        q.move_to(np.array([3.4, TOP_Y + 0.25, 0]))
        d = self.say()                                   # how much blue, how much teal?
        self.play(FadeOut(bx), FadeOut(by), FadeOut(bb), run_time=0.4)
        self.play(FadeIn(q[:2]), run_time=d * 0.3)
        self.play(FadeIn(q[2:5]), run_time=d * 0.25)
        self.play(FadeIn(q[5:]), run_time=d * 0.2)
        self.pause(0.8)

        # ---------------------------------------------------------------- the prediction
        two, three = M("2", 32, WHITE).move_to(q[0]), M("3", 32, WHITE).move_to(q[3])
        d = self.say()                                   # already found: two and three
        self.play(Indicate(sol, color=WHITE, scale_factor=1.6), run_time=0.8)
        # the recipe is substituted, so the right-hand side is now the unknown: no answer on screen yet
        qmark = M("?", 32, WHITE).move_to(q[6]).align_to(q[6], LEFT)
        self.play(ReplacementTransform(q[0], two), ReplacementTransform(q[3], three),
                  ReplacementTransform(q[6], qmark), run_time=min(1.2, max(0.5, d - 0.8)))
        d = self.say()                                   # take two blue, then three teal
        self.play(Indicate(VGroup(two, q[1]), color=C_U, scale_factor=1.1), run_time=d * 0.45)
        self.play(Indicate(VGroup(three, q[4]), color=C_Q, scale_factor=1.1), run_time=d * 0.45)
        self.say()                                       # where will you end up?
        self.pause(3.0)                                  # ⏸ predict where two blue and three teal land

        # ---------------------------------------------------------------- the walk and the arithmetic
        pts = [(0, 0), (2, 1), (4, 2), (3, 3), (2, 4), (1, 5)]
        steps = [vec_between(pout, pts[k], pts[k + 1], C_U if k < 2 else C_Q, width=5) for k in range(5)]
        across, up = M("4 − 3", 32), M("2 + 3", 32)
        calc = VGroup(M("=", 32), M("(", 32), across, M(",", 32), up, M(")", 32)).arrange(RIGHT, buff=0.1)
        calc[3].shift(DOWN * 0.08)
        calc.next_to(q, DOWN, buff=0.25).align_to(q[0], LEFT)
        mid = M("(4, 2)", 24, C_U).next_to(pout.c2p(4, 2), DOWN, buff=0.12)
        d = self.say()                                   # two blues: four right, two up
        self.play(FadeOut(a1_lab), FadeOut(a2_lab), a1.animate.set_opacity(0.25), a2.animate.set_opacity(0.25),
                  run_time=0.4)
        self.play(GrowArrow(steps[0]), run_time=d * 0.3)
        self.play(GrowArrow(steps[1]), run_time=d * 0.3)
        self.play(FadeIn(mid), run_time=0.3)
        d = self.say()                                   # three teals: three left, three up
        for k in (2, 3, 4):
            self.play(GrowArrow(steps[k]), run_time=d * 0.27)
        d = self.say()                                   # across: four minus three is one
        hx = Line(pout.c2p(0, 0), pout.c2p(1, 0), color=WHITE, stroke_width=6)
        self.play(FadeIn(VGroup(calc[0], calc[1], across, calc[3])), run_time=min(0.8, d * 0.4))
        self.play(Indicate(across, color=WHITE), Create(hx), run_time=min(1.0, d * 0.45))
        d = self.say()                                   # up: two plus three is five
        hy = Line(pout.c2p(1, 0), pout.c2p(1, 5), color=WHITE, stroke_width=6)
        self.play(FadeIn(VGroup(up, calc[5])), run_time=min(0.8, d * 0.4))
        self.play(Indicate(up, color=WHITE), Create(hy), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # one, five: exactly the target
        ring = Circle(radius=0.22, color=C_W, stroke_width=4).move_to(tgt)
        ans = M("(1, 5)", 32, C_W).move_to(qmark).align_to(qmark, LEFT)
        self.play(ReplacementTransform(qmark, ans), run_time=min(0.8, d * 0.4))
        self.play(Create(ring), FadeOut(hx), FadeOut(hy), run_time=min(1.0, d * 0.5))
        self.pause(1.5)                                  # ⏸ read the finished calculation

        # ---------------------------------------------------------------- two jobs, one pair
        arc = CurvedArrow(sol.get_center() + UP * 0.12 + RIGHT * 0.06, tgt.get_center() + LEFT * 0.2,
                          angle=-PI / 3, color=WHITE, stroke_width=4, tip_length=0.22)
        arc_lab = M("<i>A</i>", 34).move_to(arc.point_from_proportion(0.5) + UP * 0.3)
        arc_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.05)
        d = self.say()                                   # same pair, two jobs
        self.play(FadeOut(mid), FadeOut(ring), Create(arc), FadeIn(arc_lab), run_time=min(1.6, d))
        d = self.say()                                   # left: a place
        place = VGroup(sol, sol_lab, l1, l2)
        self.play(Indicate(place, color=WHITE, scale_factor=1.05), run_time=min(1.4, d))
        d = self.say()                                   # right: a recipe
        path = VGroup(*steps)
        self.play(Indicate(VGroup(path, two, three), color=WHITE, scale_factor=1.05), run_time=min(1.6, d))
        self.pause(0.8)

        # ---------------------------------------------------------------- why the columns matter
        d = self.say()                                   # two unknowns: you can draw the lines
        self.play(l1.animate.set_stroke(width=6), l2.animate.set_stroke(width=6), run_time=min(1.0, d))
        d = self.say()                                   # 768 unknowns: you can't draw anything
        self.play(VGroup(pin, tin, l1, l2, sol, sol_lab, e1, e2).animate.set_opacity(0.12),
                  FadeOut(arc), FadeOut(arc_lab), run_time=max(1.5, d * 0.7))
        d = self.say()                                   # but you can still ask about the columns
        self.play(path.animate.set_opacity(0.3), a1.animate.set_opacity(1), a2.animate.set_opacity(1),
                  run_time=min(1.0, d * 0.4))
        self.play(Indicate(VGroup(A.entries[0][0], A.entries[1][0]), color=C_U),
                  Indicate(VGroup(A.entries[0][1], A.entries[1][1]), color=C_Q),
                  Indicate(tgt, color=C_W, scale_factor=1.6), run_time=min(1.4, d * 0.5))
        return SimpleNamespace(**{k: v for k, v in locals().items() if k != "self"})
