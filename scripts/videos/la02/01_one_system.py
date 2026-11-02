"""One system, two pictures: the approved passage (sample.py), then a second recipe, the two questions,
and the 768 x 3072 matrix. Script: docs/LA02_VIDEO_SCRIPT.md, section "One system, two pictures".
"""
from sample import *  # noqa: F401,F403
from sample import Sample, LEFT_C, RIGHT_C, TOP_Y, UNIT, C_L1, C_L2

GOLD = C_V
COLS = [((2, 1), C_U), ((-1, 1), C_Q), ((1, 2), GOLD)]

# input box for three amounts: oblique projection, x1 right, x2 up, x3 toward the viewer
BOX_O = np.array([-4.25, -2.05, 0])
EX, EY, EZ = np.array([0.6, 0, 0]), np.array([0, 0.6, 0]), np.array([-0.32, -0.26, 0])


def b3(x1, x2, x3):
    return BOX_O + x1 * EX + x2 * EY + x3 * EZ


def recipe_eq(amounts, rhs="?", size=30):
    """a (2, 1) + b (−1, 1) [+ c (1, 2)] = rhs, each column in its colour."""
    parts = []
    for k, amt in enumerate(amounts):
        (cx, cy), c = COLS[k]
        if k:
            parts.append(M("+", size))
        parts += [M(str(amt), size), M(f"({cx}, {cy})".replace("-", "−"), size, c)]
    parts += [M("=", size), M(rhs, size, C_W if rhs != "?" else WHITE)]
    g = VGroup(*parts).arrange(RIGHT, buff=0.12)
    if g.width > 6.4:
        g.scale_to_fit_width(6.4)
    return g.move_to(np.array([3.4, TOP_Y + 0.25, 0]))


def walk(p, amounts, order=None):
    """Tip-to-tail arrows for a recipe: one arrow per unit of each column (negative amounts reversed)."""
    order = order or [k for k, a in enumerate(amounts) for _ in range(abs(a))]
    pos, arrows = (0, 0), VGroup()
    for k in order:
        (cx, cy), c = COLS[k]
        s = 1 if amounts[k] > 0 else -1
        nxt = (pos[0] + s * cx, pos[1] + s * cy)
        arrows.add(vec_between(p, pos, nxt, c, width=5))
        pos = nxt
    return arrows


class OneSystem(Sample):
    PARAS = Sample.PARAS + [
        ["Can the columns reach the target?",
         "A second question comes straight after it.",
         "If they can, is two and three the only way?"],
        ["For these two arrows the left panel answers at once.",
         "Two lines that cross, cross at a single point.",
         "There is one place on the left, so there is one recipe on the right."],
        ["Give the target more ways to be reached.",
         "Add a third column, gold.",
         "Gold goes one right and two up, which is exactly blue followed by teal.",
         "The input now needs three amounts, so the left panel needs three directions.",
         "Two blue, three teal, no gold still works.",
         "In the box, that recipe is the point two, three, zero."],
        ["Try one blue, two teal, and one gold.",
         "Before adding it up... does it land on the target?"],
        ["Across, two, minus two, plus one, is one.",
         "Up, one plus two plus two, is five.",
         "The same target, from a different recipe."],
        ["The reason is in the gold arrow.",
         "Gold is blue plus teal.",
         "Handing back one blue and one teal, and taking one gold instead, changes the route but not the destination.",
         "You can make that trade as many times as you like, or run it backwards."],
        ["Every one of those trades is a point on this line in the input box.",
         "Every point on it is a recipe for the same target.",
         "One extra recipe has turned into a whole line of them.",
         "That line comes back later, with a name."],
        ["Both questions are ones you met in chapter one.",
         "Whether a target can be reached is whether it lies in the span of the columns.",
         "It's a question about the output side.",
         "Whether the recipe is unique is whether the columns are independent, because a dependence, like gold "
         "equals blue plus teal, is exactly a trade that changes the recipe and keeps the target.",
         "It's a question about the input side."],
        ["In chapter one you were given arrows and asked what they could reach.",
         "Here the target is fixed first, and you ask for the recipe."],
        ["One procedure, called elimination, fills in the last column of this table for any system, of any size.",
         "Most of this video is about what elimination does, and what it tells you."],
        ["To make that concrete, take a matrix with seven hundred and sixty-eight rows and three thousand and "
         "seventy-two columns, a shape you'll find inside language models.",
         "Can its columns reach every target?",
         "And when they reach one, is the recipe ever unique?",
         "By the end, both questions have answers you can give from the shape and one count, the rank."],
    ]

    def construct(self):
        n = self.passage()
        self.pause(0.8)
        self.second_recipe(n)
        self.two_questions(n)
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def second_recipe(self, n):
        pin, pout, tin, tout = n.pin, n.pout, n.tin, n.tout
        left_2d = VGroup(pin, n.l1, n.l2, n.sol, n.sol_lab)

        # ---- is two and three the only recipe?
        d = self.say()                                   # can the columns reach the target?
        self.play(VGroup(pin, tin, n.l1, n.l2, n.sol, n.sol_lab, n.e1, n.e2).animate.set_opacity(1),
                  FadeOut(n.path), FadeOut(n.q[1:]), FadeOut(n.two), FadeOut(n.three), FadeOut(n.ans),
                  FadeOut(n.calc), run_time=min(1.2, d))
        self.play(Indicate(n.tgt, color=C_W, scale_factor=1.5), run_time=min(0.8, max(0.3, d - 1.2)))
        d = self.say()                                   # a second question
        self.wait(max(0, d - 0.1))
        qm = M("?", 34).next_to(n.sol_lab, UP, buff=0.12)
        d = self.say()                                   # is two and three the only way?
        self.play(FadeIn(qm, shift=UP * 0.1), run_time=min(0.8, d))
        d = self.say()                                   # the left panel answers at once
        self.play(Indicate(VGroup(n.l1, n.l2), color=WHITE, scale_factor=1.0), run_time=min(1.2, d))
        d = self.say()                                   # lines that cross, cross once
        ring = Circle(radius=0.2, color=WHITE, stroke_width=3).move_to(n.sol)
        self.play(Create(ring), run_time=min(0.8, d))
        self.play(FadeOut(ring), FadeOut(qm), run_time=0.5)
        arc = CurvedArrow(n.sol.get_center() + UP * 0.12 + RIGHT * 0.06, n.tgt.get_center() + LEFT * 0.2,
                          angle=-PI / 3, color=WHITE, stroke_width=4, tip_length=0.22)
        d = self.say()                                   # one place, one recipe
        self.play(Create(arc), run_time=min(1.4, d))
        self.pause(0.6)

        # ---- a third column
        gold = vec(pout, 1, 2, GOLD, width=6)
        gold_lab = M("(1, 2)", 26, GOLD).next_to(gold.get_end(), RIGHT, buff=0.1)
        d = self.say()                                   # more ways to be reached
        self.play(FadeOut(arc), run_time=min(0.8, d))
        d = self.say()                                   # add a third column, gold
        A3 = matrix_mob([["2", "−1", "1"], ["1", "1", "2"]], size=34,
                        entry_colors={("col", 0): C_U, ("col", 1): C_Q, ("col", 2): GOLD})
        A3_grp = VGroup(n.A_name.copy(), A3).arrange(RIGHT, buff=0.2).scale(0.78).move_to(n.A_grp).shift(RIGHT * 0.15)
        self.play(GrowArrow(gold), FadeIn(gold_lab), ReplacementTransform(n.A_grp, A3_grp), run_time=min(1.6, d))
        d = self.say()                                   # gold = blue followed by teal
        ghost = VGroup(vec_between(pout, (0, 0), (2, 1), C_U, width=4),
                       vec_between(pout, (2, 1), (1, 2), C_Q, width=4))
        self.play(GrowArrow(ghost[0]), run_time=d * 0.3)
        self.play(GrowArrow(ghost[1]), run_time=d * 0.3)
        self.play(FadeOut(ghost), Indicate(gold, color=GOLD), run_time=min(1.0, d * 0.3))

        # input space now needs three directions: the plane becomes a box
        ax = VGroup(Arrow(b3(0, 0, 0), b3(4.3, 0, 0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15),
                    Arrow(b3(0, 0, 0), b3(0, 5.2, 0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15),
                    Arrow(b3(0, 0, -1.2), b3(0, 0, 3.2), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15))
        floor = VGroup(*[Line(b3(i, 0, -1), b3(i, 0, 3), color=C_GRID, stroke_width=1) for i in range(5)],
                       *[Line(b3(0, 0, k), b3(4, 0, k), color=C_GRID, stroke_width=1) for k in range(-1, 4)])
        ax_lab = VGroup(M("<i>x</i><sub>1</sub>", 24, C_U).next_to(ax[0].get_end(), RIGHT, buff=0.08),
                        M("<i>x</i><sub>2</sub>", 24, C_Q).next_to(ax[1].get_end(), UP, buff=0.08),
                        M("<i>x</i><sub>3</sub>", 24, GOLD).next_to(ax[2].get_end(), DL, buff=0.05))
        tin3 = P("input: the amounts (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, <i>x</i><sub>3</sub>)",
                 22, C_DIM).move_to(tin)
        box = VGroup(floor, ax, ax_lab)
        d = self.say()                                   # three amounts, three directions
        self.play(FadeOut(left_2d), FadeOut(VGroup(n.e1, n.e2)), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(box), ReplacementTransform(tin, tin3), run_time=min(1.4, d * 0.5))

        def pt(x1, x2, x3, label=True):
            dt = Dot(b3(x1, x2, x3), radius=0.08, color=WHITE)
            drop = DashedLine(b3(x1, x2, x3), b3(x1, 0, x3), color=C_DIM, stroke_width=2, dash_length=0.06)
            g = VGroup(drop, dt)
            if label:
                lab = M(f"({x1}, {x2}, {x3})".replace("-", "−"), 22).next_to(dt, RIGHT, buff=0.12)
                lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.04)
                g.add(lab)
            return g

        eq0 = recipe_eq([2, 3, 0], "(1, 5)")
        path0 = walk(pout, [2, 3, 0])
        d = self.say()                                   # two blue, three teal, no gold
        self.play(FadeIn(eq0), run_time=min(0.8, d * 0.3))
        self.play(LaggedStart(*[GrowArrow(a) for a in path0], lag_ratio=0.6), run_time=min(2.0, d * 0.6))
        p230 = pt(2, 3, 0)
        d = self.say()                                   # in the box: (2, 3, 0)
        self.play(FadeIn(p230), run_time=min(1.0, d))
        self.pause(0.4)

        # ---- a second recipe: predict first
        eq1 = recipe_eq([1, 2, 1])
        d = self.say()                                   # try one blue, two teal, one gold
        self.play(FadeOut(path0), ReplacementTransform(eq0, eq1), run_time=min(1.2, d))
        self.say()                                       # does it land on the target?
        self.pause(3.0)                                  # ⏸ predict (path, calculation, second dot hidden)

        path1 = walk(pout, [1, 2, 1])
        across = M("(2 − 2 + 1,", 30)
        up = M("1 + 2 + 2)", 30)
        calc = VGroup(M("=", 30), across, up).arrange(RIGHT, buff=0.14)
        calc.next_to(eq1, DOWN, buff=0.25).align_to(eq1, LEFT)
        hx = Line(pout.c2p(0, 0), pout.c2p(1, 0), color=WHITE, stroke_width=6)
        hy = Line(pout.c2p(1, 0), pout.c2p(1, 5), color=WHITE, stroke_width=6)
        d = self.say()                                   # across: 2 − 2 + 1 = 1
        self.play(LaggedStart(*[GrowArrow(a) for a in path1], lag_ratio=0.6), run_time=min(2.0, d * 0.5))
        self.play(FadeIn(calc[:2]), Create(hx), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # up: 1 + 2 + 2 = 5
        self.play(FadeIn(calc[2]), Create(hy), run_time=min(1.0, d * 0.6))
        ans = M("(1, 5)", 30, C_W).move_to(eq1[-1]).align_to(eq1[-1], LEFT)
        p121 = pt(1, 2, 1)
        d = self.say()                                   # same target, different recipe
        self.play(ReplacementTransform(eq1[-1], ans), FadeOut(hx), FadeOut(hy), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(p121), run_time=min(0.8, d * 0.4))
        self.pause(1.5)                                  # ⏸ read the finished calculation

        # ---- why: the trade
        d = self.say()                                   # the reason is in the gold arrow
        self.play(FadeOut(calc), Indicate(gold, color=GOLD, scale_factor=1.15), run_time=min(1.2, d))
        d = self.say()                                   # gold is blue plus teal
        ghost = VGroup(vec_between(pout, (0, 0), (2, 1), C_U, width=4),
                       vec_between(pout, (2, 1), (1, 2), C_Q, width=4))
        self.play(GrowArrow(ghost[0]), GrowArrow(ghost[1]), run_time=min(1.0, d))
        d = self.say()                                   # handing back one blue and one teal
        path_t = walk(pout, [2, 3, 0])
        self.play(FadeOut(ghost), ReplacementTransform(path1, path_t), run_time=min(1.6, d * 0.45))
        path_back = walk(pout, [1, 2, 1])
        self.play(ReplacementTransform(path_t, path_back), Indicate(n.tgt, color=C_W), run_time=min(1.6, d * 0.45))
        d = self.say()                                   # as many times as you like, or backwards
        self.wait(max(0, d - 0.1))

        # ---- the line of recipes
        line = DashedLine(b3(3.5, 4.5, -1.5), b3(-0.5, 0.5, 2.5), color=WHITE, stroke_width=3, dash_length=0.1)
        d = self.say()                                   # every trade is a point on this line
        self.play(Create(line), run_time=min(1.6, d))
        d = self.say()                                   # every point on it is a recipe for the target
        mover = Dot(b3(1, 2, 1), radius=0.09, color=WHITE)
        self.add(mover)
        for amounts, order in (([0, 1, 2], [1, 2, 2]), ([3, 4, -1], [1, 0, 1, 0, 1, 0, 2, 1])):
            new_path = walk(pout, amounts, order)
            self.play(mover.animate.move_to(b3(*amounts)), ReplacementTransform(path_back, new_path),
                      run_time=min(1.4, d * 0.45))
            mark = pt(*amounts)
            self.add(mark)
            path_back = new_path
            if amounts[0] == 0:
                p012 = mark
            else:
                p341 = mark
        d = self.say()                                   # a whole line of them
        self.play(FadeOut(mover), line.animate.set_stroke(width=5), run_time=min(1.0, d))
        d = self.say()                                   # that line comes back later
        self.play(line.animate.set_stroke(width=3), run_time=min(0.8, d))
        self.pause(0.8)

        self.left3 = VGroup(box, line, p230, p121, p012, p341)
        self.tin3, self.gold, self.gold_lab, self.A3_grp, self.eq1, self.ans, self.path_back = (
            tin3, gold, gold_lab, A3_grp, eq1, ans, path_back)

    # ------------------------------------------------------------------------------------------------
    def two_questions(self, n):
        pin, pout = n.pin, n.pout
        left_2d = VGroup(pin, n.l1, n.l2, n.sol, n.sol_lab)
        tin2 = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).move_to(self.tin3)
        A2 = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A2_grp = VGroup(n.A_name.copy(), A2).arrange(RIGHT, buff=0.2).move_to(self.A3_grp)

        d = self.say()                                   # both questions are from chapter one
        self.play(FadeOut(self.left3), FadeOut(self.gold), FadeOut(self.gold_lab), FadeOut(self.path_back),
                  FadeOut(VGroup(*self.eq1[:-1], self.ans)), run_time=min(1.0, d * 0.5))
        self.play(FadeIn(left_2d), ReplacementTransform(self.tin3, tin2),
                  ReplacementTransform(self.A3_grp, A2_grp), FadeIn(VGroup(n.e1, n.e2)), run_time=min(1.0, d * 0.5))

        ex_lab = P("existence: is <b>b</b> in the span?", 24, C_W).next_to(pout, DOWN, buff=0.18)
        un_lab = P("uniqueness: independent columns?", 24, WHITE).next_to(pin, DOWN, buff=0.18)
        span = Polygon(pout.c2p(-1, -1), pout.c2p(5, -1), pout.c2p(5, 6), pout.c2p(-1, 6),
                       stroke_width=0, fill_color=C_U, fill_opacity=0.10)
        d = self.say()                                   # reachable = in the span of the columns
        self.play(FadeIn(span), Indicate(VGroup(n.a1, n.a2), scale_factor=1.05), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # a question about the output side
        self.play(FadeIn(ex_lab), run_time=min(1.0, d))
        d = self.say()                                   # unique = independent
        self.play(FadeOut(span), Indicate(VGroup(n.sol, n.sol_lab), color=WHITE), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # a question about the input side
        self.play(FadeIn(un_lab), run_time=min(1.0, d))

        d = self.say()                                   # chapter one: arrows first, what can they reach
        self.play(Indicate(VGroup(n.a1, n.a2), scale_factor=1.1), run_time=min(1.4, d))
        d = self.say()                                   # here: target first, find the recipe
        self.play(Indicate(n.tgt, color=C_W, scale_factor=1.6), run_time=min(0.9, d * 0.45))
        self.play(Indicate(VGroup(n.sol, n.sol_lab), color=WHITE), run_time=min(0.9, d * 0.45))
        self.pause(0.6)

        # ---- the table: panels move to the top corners, the two labels become its rows
        left_all = VGroup(pin, tin2, n.l1, n.l2, n.sol, n.sol_lab, n.e1, n.e2)
        right_all = VGroup(pout, n.tout, n.a1, n.a2, n.tgt, n.tgt_lab, n.steps[0].copy().set_opacity(0))
        heads = ["Question about <i>A</i><b>x</b> = <b>b</b>", "The idea it really is", "read off from elimination as"]
        rows = [["Existence: is there any solution?", "Is <b>b</b> in the span of the columns of <i>A</i>?"],
                ["Uniqueness: is there only one?", "Are the columns of <i>A</i> independent?"]]
        colx = [-4.3, 0.15, 4.45]
        widths = [4.2, 4.6, 3.6]
        top = 0.2
        head_m = VGroup(*[P(h, 21, C_DIM).move_to(np.array([colx[k], top, 0])) for k, h in enumerate(heads)])
        cell_m = VGroup(*[P(c, 21, C_W if i == 0 and k == 1 else WHITE).move_to(np.array([colx[k], top - 0.85 * (i + 1), 0]))
                          for i, r in enumerate(rows) for k, c in enumerate(r)])
        for m, k in zip(cell_m, [0, 1, 0, 1]):
            if m.width > widths[k] - 0.2:
                m.scale_to_fit_width(widths[k] - 0.2)
        x0, x3 = colx[0] - widths[0] / 2, colx[2] + widths[2] / 2
        rules = VGroup(Line([x0, top - 0.42, 0], [x3, top - 0.42, 0], color=C_DIM, stroke_width=1.5),
                       Line([x0, top - 1.27, 0], [x3, top - 1.27, 0], color=C_GRID, stroke_width=1.5),
                       *[Line([colx[k] + widths[k] / 2, top + 0.35, 0], [colx[k] + widths[k] / 2, top - 2.15, 0],
                              color=C_GRID, stroke_width=1.5) for k in (0, 1)])
        empty = VGroup(*[DashedLine([colx[2] - 1.4, top - 0.85 * (i + 1) - 0.18, 0],
                                    [colx[2] + 1.4, top - 0.85 * (i + 1) - 0.18, 0],
                                    color=C_DIM, stroke_width=1.5, dash_length=0.08) for i in range(2)])
        self.play(left_all.animate.scale(0.42).to_corner(UL, buff=0.3),
                  VGroup(right_all, A2_grp).animate.scale(0.42).to_corner(UR, buff=0.3),
                  FadeIn(VGroup(head_m[:2], rules[:3])),
                  ReplacementTransform(ex_lab, cell_m[1]), ReplacementTransform(un_lab, cell_m[3]),
                  run_time=1.4)
        self.play(FadeIn(cell_m[0]), FadeIn(cell_m[2]), run_time=0.6)
        d = self.say()                                   # elimination fills in the last column
        self.play(FadeIn(head_m[2]), Create(rules[3]), Create(empty), run_time=min(1.4, d * 0.5))
        d = self.say()                                   # most of this video
        self.wait(max(0, d - 0.1))
        self.pause(0.6)

        # ---- the 768 x 3072 matrix
        table = VGroup(head_m, cell_m, rules, empty)
        Ablk = Rectangle(width=5.6, height=1.4, stroke_color=C_DIM, stroke_width=2, fill_color="#3A4150",
                         fill_opacity=0.8)
        xcol = Rectangle(width=0.32, height=4.6, stroke_color=C_DIM, stroke_width=2, fill_color="#3A4150",
                         fill_opacity=0.8)
        bcol = Rectangle(width=0.32, height=1.4, stroke_color=C_W, stroke_width=2, fill_color=C_W,
                         fill_opacity=0.25)
        eq_sign = M("=", 40)
        row = VGroup(Ablk, xcol, eq_sign, bcol).arrange(RIGHT, buff=0.35).move_to(np.array([0, -1.2, 0]))
        Ablk_lab = M("<i>A</i>: 768 × 3072", 28).next_to(Ablk, DOWN, buff=0.2)
        x_lab = M("<b>x</b> ∈ ℝ<sup>3072</sup>", 26).next_to(xcol, LEFT, buff=0.15).align_to(xcol, UP)
        b_lab = M("<b>b</b> ∈ ℝ<sup>768</sup>", 26, C_W).next_to(bcol, RIGHT, buff=0.15)
        d = self.say()                                   # 768 rows, 3072 columns
        self.play(FadeOut(table), run_time=0.6)
        self.play(FadeIn(Ablk), FadeIn(Ablk_lab), run_time=min(1.2, d * 0.3))
        self.play(FadeIn(xcol), FadeIn(x_lab), FadeIn(eq_sign), FadeIn(bcol), FadeIn(b_lab),
                  run_time=min(1.2, d * 0.3))
        d = self.say()                                   # can its columns reach every target?
        self.play(Indicate(VGroup(bcol, b_lab), color=C_W, scale_factor=1.08), run_time=min(1.2, d))
        d = self.say()                                   # is the recipe ever unique?
        self.play(Indicate(VGroup(xcol, x_lab), color=WHITE, scale_factor=1.04), run_time=min(1.2, d))
        d = self.say()                                   # answers from the shape and one count, the rank
        rank = P("rank", 26, C_DIM).next_to(Ablk, UP, buff=0.2)
        self.play(Indicate(Ablk, color=WHITE, scale_factor=1.03), run_time=min(1.0, d * 0.4))
        self.play(FadeIn(rank), run_time=min(0.8, d * 0.3))
