"""When a column has no pivot. Script: docs/LA02_VIDEO_SCRIPT.md, section "When a column has no pivot" (§4)."""
import importlib
from types import SimpleNamespace

from common import *  # noqa: F401,F403

_e = importlib.import_module("06_elimination")
_r = importlib.import_module("08_rank")
aug, put, ring, hl, row_y, col_x = _e.aug, _e.put, _e.ring, _e.hl, _e.row_y, _e.col_x
a_panel, r_panel, mat, piv_boxes, free_shade, col_box, bglab = (_r.a_panel, _r.r_panel, _r.mat, _r.piv_boxes,
                                                               _r.free_shade, _r.col_box, _r.bglab)
A_ROWS, R_ROWS, C_COLW = _r.A_ROWS, _r.R_ROWS, _r.C_COLW
C_REL = "#C9D1D9"      # column-relation outlines


class NoPivot(NScene):
    PARAS = [
        # ---- a system with more unknowns than it can pin down
        ["Both systems we've eliminated so far had exactly one solution.",
         "This one has three equations and four unknowns, x one to x four.",
         "Four unknowns means the input space is R four.",
         "Three equations means the output space is R three.",
         "Run elimination on it, the same way as before, and watch what's different."],
        ["Column one.",
         "The pivot is one, so the multipliers are just the entries below it, two and one."],
        ["Row two loses two copies of row one, and row three loses one copy.",
         "The new rows are on screen."],
        ["Column two is next.",
         "The pivot has to come from row two or below.",
         "Which entry should it be?"],
        ["There isn't one.",
         "Both candidates are zero, and no swap can bring a nonzero entry up, because there isn't one below.",
         "So column two gets no pivot.",
         "Elimination leaves it and moves on to column three, staying on row two."],
        ["In column three, row two has a two.",
         "Make it the pivot, and add row two to row three.",
         "Row three becomes zeros all the way across.",
         "Column four has nothing left below row two, so it gets no pivot either."],
        ["The nonzero entries now form a staircase.",
         "Each row starts further right than the row above, and the empty rows sit at the bottom.",
         "That shape is called row echelon form.",
         "The first nonzero entry of each row is its pivot.",
         "A column with a pivot is a pivot column.",
         "Every other column is a free column, and the unknown that goes with it is a free variable."],
        # ---- finishing the job
        ["You could back-substitute from here.",
         "But the cleanest form comes from two more kinds of step.",
         "Scale each pivot to one, and clear the entries above each pivot as well as below."],
        ["Halve row two, so its pivot becomes one.",
         "Then subtract it from row one, to clear the entry above that pivot."],
        ["Now every pivot is one, and every other entry in a pivot column is zero.",
         "This form is called reduced row echelon form, R R E F for short."],
        ["Read the rows back as equations, as on screen.",
         "The last row says zero equals zero.",
         "It asks nothing, and in particular it isn't zero equals something nonzero, which would be a "
         "contradiction.",
         "So this system has solutions.",
         "In the two remaining equations, which unknowns are pinned down, and which are left free?"],
        ["Each equation contains exactly one pivot variable, x one in the first and x three in the second.",
         "The free variables, x two and x four, can be anything.",
         "Everything in the next three parts is read off this one reduction."],
        # ---- would someone else get the same answer?
        ["There were choices along the way.",
         "Someone else might swap rows first, or scale earlier, or clear in a different order.",
         "Would they end up with the same R R E F?"],
        ["To answer that, you need something row operations can't change.",
         "Look at the columns of A."],
        ["Column two, two, four, two, is exactly twice column one.",
         "Column four, three, ten, minus one, is column one plus two copies of column three."],
        ["Now the columns of R.",
         "Do the same two relations hold there?"],
        ["They do.",
         "The columns moved, but the relations among them stayed exactly the same."],
        ["Why?",
         "A relation among the columns, amounts c making c one a one, up to c four a four, equal zero, is the "
         "statement A c equals zero.",
         "In other terms, c solves A x equals zero.",
         "Row operations keep that system's column of zeros zero, turning it into R x equals zero, and by "
         "Theorem four the two systems have the same solutions."],
        ["What the row operations did change is the span.",
         "Every column of R has third entry zero, so all of R's columns lie in the floor.",
         "Column one of A, one, two, one, doesn't.",
         "The relations survive.",
         "The spans don't need to."],
        # ---- the reduced form is the same for everyone
        ["Look at how any R R E F is built.",
         "A pivot column has a one in its pivot row and zeros elsewhere, so the pivot columns are e one, e two, "
         "and so on, in order.",
         "Here, columns one and three are e one and e two."],
        ["A free column only has entries in the rows of the pivots to its left.",
         "Column two is two, zero, zero, which is two copies of e one.",
         "Column four is one, two, zero, which is one copy of e one plus two copies of e two.",
         "Its entries are exactly the amounts of the earlier pivot columns that build it."],
        ["That gives two facts.",
         "First, a column is a pivot column exactly when it is not a combination of the columns before it.",
         "A free column is a combination of earlier ones.",
         "A pivot column, e k, isn't, because every column before it has zero in row k. "
         "Second, the numbers in a free column are the unique amounts that build it from the pivot columns "
         "before it."],
        ["Both facts are statements about relations among columns.",
         "Suppose two people reduce A and get two R R E Fs.",
         "By Lemma five, both satisfy exactly the same column relations as A. "
         "By the first fact, they have the same pivot columns, which are e one, e two and so on, in the same "
         "places.",
         "By the second fact, every free column holds the same numbers.",
         "And the rows below are zero in both.",
         "So the two are the same matrix."],
        ["A small case shows it.",
         "In two, four, one, two, column two is twice column one.",
         "Whatever anyone does, that relation survives.",
         "So column two can never become a pivot column, and its entry in the R R E F has to be the amount, two.",
         "Every route ends at one, two, zero, zero.",
         "There's nothing left to choose."],
        ["Anything read off the reduced form, which columns are pivot columns, how many there are, which "
         "variables are free, belongs to the matrix itself, and not to the route taken."],
    ]

    def construct(self):
        self.no_pivot()
        self.finish()
        self.same_answer()
        self.unique()
        self.done(1.2)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def no_pivot(self):
        A = aug([["1", "2", "1", "3", "4"], ["2", "4", "4", "10", "10"], ["1", "2", "−1", "−1", "2"]],
                size=34, h_buff=1.0).move_to([-3.0, 1.95, 0])
        E = A.entries
        xl = VGroup(*[M(f"<i>x</i><sub>{j + 1}</sub>", 28, C_DIM).move_to([col_x(A, j), A.get_top()[1] + 0.32, 0])
                      for j in range(4)])
        rl = VGroup(*[M(f"R<sub>{i + 1}</sub>", 26, C_DIM).move_to([A.get_left()[0] - 0.4, row_y(A, i), 0])
                      for i in range(3)])
        bxs = []
        for cx, name in ((1.75, "input ℝ<sup>4</sup>"), (5.45, "output ℝ<sup>3</sup>")):
            r = RoundedRectangle(width=2.2, height=2.5, corner_radius=0.18, stroke_color="#5B6475",
                                 stroke_width=2).move_to([cx, 1.85, 0])
            bxs.append(VGroup(r, M(name, 26, C_DIM).next_to(r, UP, buff=0.12)))
        xin = column_vec(["<i>x</i><sub>1</sub>", "<i>x</i><sub>2</sub>", "<i>x</i><sub>3</sub>",
                          "<i>x</i><sub>4</sub>"], size=26, v_buff=0.42).move_to(bxs[0][0])
        bout = column_vec(["4", "10", "2"], size=26, color=C_W, v_buff=0.45).move_to(bxs[1][0])
        amap = Arrow(bxs[0][0].get_right(), bxs[1][0].get_left(), buff=0.1, color=WHITE, stroke_width=3,
                     tip_length=0.18)
        alab = M("<i>A</i>", 30).next_to(amap, UP, buff=0.08)
        LX = -6.4

        def line(markup, y, size=28):
            return M(markup, size).move_to([0, y, 0]).align_to([LX, 0, 0], LEFT)

        d = self.say()                                   # so far exactly one solution
        self.play(FadeIn(VGroup(A[0], A[2], A.bar)), *[FadeIn(e) for r in E for e in r], run_time=min(1.2, d))
        d = self.say()                                   # three equations, four unknowns
        self.play(FadeIn(xl, lag_ratio=0.2), FadeIn(rl), run_time=min(1.4, d))
        d = self.say()                                   # input space R4
        self.play(FadeIn(bxs[0]), TransformFromCopy(xl, xin), run_time=min(1.4, d))
        d = self.say()                                   # output space R3
        self.play(GrowArrow(amap), FadeIn(alab), FadeIn(bxs[1]), FadeIn(bout), run_time=min(1.4, d))
        d = self.say()                                   # run elimination
        self.play(Indicate(VGroup(*[e for r in E for e in r[:4]]), color=WHITE, scale_factor=1.03),
                  run_time=min(1.2, d))
        self.pause(0.5)

        r1 = ring(E[0][0])
        d = self.say()                                   # column one
        self.play(Create(r1), run_time=min(0.8, d))
        h = hl(E[1][0], E[2][0])
        d = self.say()                                   # multipliers two and one
        self.play(FadeIn(h), run_time=min(0.8, d * 0.5))
        L1 = line("R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub>:   (2 − 2, 4 − 4, 4 − 2, 10 − 6 | 10 − 8) = "
                  "(0, 0, 2, 4 | 2)", -0.3)
        L2 = line("R<sub>3</sub> ← R<sub>3</sub> − R<sub>1</sub>:   (1 − 1, 2 − 2, −1 − 1, −1 − 3 | 2 − 4) = "
                  "(0, 0, −2, −4 | −2)", -0.95)
        d = self.say()                                   # row two loses two copies, row three one
        self.play(FadeIn(L1), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(L2), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # the new rows
        self.play(FadeOut(h), *[put(A, 1, j, t) for j, t in enumerate(["0", "0", "2", "4", "2"])],
                  *[put(A, 2, j, t) for j, t in enumerate(["0", "0", "−2", "−4", "−2"])], run_time=min(1.4, d))
        self.pause(1.5)                                  # ⏸ read the two new rows

        h2 = hl(E[1][1], E[2][1])
        d = self.say()                                   # column two is next
        self.play(FadeOut(VGroup(L1, L2)), FadeIn(h2), run_time=min(1.0, d))
        d = self.say()                                   # from row two or below
        self.play(Indicate(VGroup(E[1][1], E[2][1]), color=WHITE, scale_factor=1.3), run_time=min(1.0, d))
        self.say()                                       # which entry?
        self.pause(3.0)                                  # ⏸ grey shading and ring on col 3 hidden

        d = self.say()                                   # there isn't one
        self.wait(max(0.1, d - 0.1))
        d = self.say()                                   # both zero, no swap helps
        self.play(Indicate(VGroup(E[1][1], E[2][1]), color=WHITE, scale_factor=1.3), run_time=min(1.2, d))
        sh = free_shade(A, cols=(1, 3))
        d = self.say()                                   # column two gets no pivot
        self.play(FadeOut(h2), FadeIn(sh[0]), run_time=min(1.0, d))
        r2 = ring(E[1][2])
        d = self.say()                                   # moves on to column three, row two
        self.play(Create(r2), run_time=min(1.0, d))

        d = self.say()                                   # row two has a two
        self.play(Indicate(E[1][2], color=WHITE, scale_factor=1.4), run_time=min(1.0, d))
        L3 = line("R<sub>3</sub> ← R<sub>3</sub> + R<sub>2</sub>:   (0, 0, −2 + 2, −4 + 4 | −2 + 2) = "
                  "(0, 0, 0, 0 | 0)", -0.3)
        d = self.say()                                   # add row two to row three
        self.play(FadeIn(L3), run_time=min(1.0, d))
        d = self.say()                                   # row three: zeros
        self.play(*[put(A, 2, j, "0") for j in range(5)], run_time=min(1.2, d))
        d = self.say()                                   # column four: no pivot either
        self.play(FadeIn(sh[1]), run_time=min(1.0, d))
        self.pause(1.5)                                  # ⏸ read the staircase

        def edge(j, side):
            return col_x(A, j) + side * 0.5

        yb1 = (row_y(A, 0) + row_y(A, 1)) / 2
        yb2 = (row_y(A, 1) + row_y(A, 2)) / 2
        stair = VMobject(color=WHITE, stroke_width=3).set_points_as_corners([
            [edge(0, -1), row_y(A, 0) + 0.3, 0], [edge(0, -1), yb1, 0], [edge(2, -1), yb1, 0],
            [edge(2, -1), yb2, 0], [A.get_right()[0] - 0.1, yb2, 0]])
        top_lab_y = A.get_bottom()[1] - 0.3
        clabs = VGroup(*[P("pivot" if j in (0, 2) else "free", 22, WHITE if j in (0, 2) else C_DIM)
                         .move_to([col_x(A, j), top_lab_y, 0]) for j in range(4)])
        ref = P("row echelon form", 24, WHITE).move_to([col_x(A, 2) - 0.5, -0.35, 0])
        fv = VGroup(M("<i>x</i><sub>2</sub>, <i>x</i><sub>4</sub>", 28, C_DIM), P("free variables", 24, C_DIM))
        fv.arrange(RIGHT, buff=0.25).next_to(ref, DOWN, buff=0.3)
        d = self.say()                                   # a staircase
        self.play(FadeOut(L3), Create(stair), run_time=min(1.6, d))
        d = self.say()                                   # each row starts further right
        self.play(Indicate(VGroup(E[0][0], E[1][2]), color=WHITE, scale_factor=1.3), run_time=min(1.0, d * 0.5))
        self.play(Indicate(VGroup(*E[2]), color=WHITE, scale_factor=1.15), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # row echelon form
        self.play(FadeIn(ref), run_time=min(1.0, d))
        d = self.say()                                   # first nonzero entry is its pivot
        self.play(Indicate(VGroup(r1, r2), color=WHITE), run_time=min(1.0, d))
        d = self.say()                                   # pivot column
        self.play(FadeIn(clabs[0]), FadeIn(clabs[2]), run_time=min(1.0, d))
        d = self.say()                                   # free column, free variable
        self.play(FadeIn(clabs[1]), FadeIn(clabs[3]), run_time=min(1.0, d * 0.4))
        self.play(Indicate(VGroup(xl[1], xl[3]), color=WHITE, scale_factor=1.3), FadeIn(fv),
                  run_time=min(1.2, d * 0.5))
        self.pause(0.6)
        self.n = SimpleNamespace(A=A, E=E, xl=xl, rl=rl, boxes=VGroup(*bxs, xin, bout, amap, alab), sh=sh,
                                 rings=VGroup(r1, r2), stair=stair, clabs=clabs, ref=ref, fv=fv, line=line)

    # ------------------------------------------------------------------------------------------------
    def finish(self):
        n = self.n
        A, E, line = n.A, n.E, n.line
        d = self.say()                                   # you could back-substitute
        self.play(FadeOut(VGroup(n.ref, n.fv)), run_time=min(0.8, d))
        d = self.say()                                   # two more kinds of step
        self.wait(max(0.1, d - 0.1))
        d = self.say()                                   # scale pivots to one, clear above
        self.play(Indicate(n.rings, color=WHITE), run_time=min(1.0, d * 0.5))
        self.play(Indicate(E[0][2], color=WHITE, scale_factor=1.4), run_time=min(1.0, d * 0.4))

        L1 = line("R<sub>2</sub> ← ½R<sub>2</sub>:   (0, 0, 1, 2 | 1)", -0.3)
        L2 = line("R<sub>1</sub> ← R<sub>1</sub> − R<sub>2</sub>:   (1, 2, 1 − 1, 3 − 2 | 4 − 1) = (1, 2, 0, 1 | 3)",
                  -0.95)
        d = self.say()                                   # halve row two
        self.play(FadeIn(L1), run_time=min(0.8, d * 0.4))
        self.play(put(A, 1, 2, "1"), put(A, 1, 3, "2"), put(A, 1, 4, "1"), run_time=min(1.0, d * 0.5))
        r2n = ring(E[1][2])
        self.remove(n.rings[1])
        self.add(r2n)
        d = self.say()                                   # subtract it from row one
        self.play(FadeIn(L2), run_time=min(0.8, d * 0.4))
        self.play(put(A, 0, 2, "0"), put(A, 0, 3, "1"), put(A, 0, 4, "3"), run_time=min(1.0, d * 0.4))
        pb = piv_boxes(A, [(0, 0), (1, 2)])
        self.play(ReplacementTransform(VGroup(n.rings[0], r2n), pb), FadeOut(n.stair), run_time=0.6)
        self.pause(1.5)                                  # ⏸ read the finished matrix

        rref = P("reduced row echelon form (RREF)", 24, WHITE).move_to([col_x(A, 2) - 0.5, -1.75, 0])
        d = self.say()                                   # every pivot one, zeros elsewhere in pivot columns
        self.play(Indicate(pb, color=WHITE), run_time=min(1.0, d * 0.45))
        self.play(Indicate(VGroup(E[0][2], E[2][2], E[2][0], E[1][0]), color=WHITE, scale_factor=1.3),
                  run_time=min(1.0, d * 0.45))
        d = self.say()                                   # RREF
        self.play(FadeIn(rref), run_time=min(1.0, d))
        self.pause(0.6)

        # ---- read it back as equations
        def piece(*parts):
            g = VGroup(*[M(t, 30) for t in parts]).arrange(RIGHT, buff=0.14)
            for k, t in enumerate(parts):                # a coefficient sits right up against its variable
                if t == "+ 2":
                    g[k + 1:].shift(LEFT * 0.1)
            return g

        q1 = piece("<i>x</i><sub>1</sub>", "+ 2", "<i>x</i><sub>2</sub>", "+", "<i>x</i><sub>4</sub>", "= 3")
        q2 = piece("<i>x</i><sub>3</sub>", "+ 2", "<i>x</i><sub>4</sub>", "= 1")
        q3 = piece("0 = 0")
        for i, q in enumerate((q1, q2, q3)):
            q.move_to([0, row_y(A, i), 0]).align_to([0.9, 0, 0], LEFT)
        d = self.say()                                   # read the rows back as equations
        self.play(FadeOut(VGroup(n.boxes, L1, L2, rref, n.clabs, n.sh, pb)), run_time=min(0.8, d * 0.3))
        self.play(*[TransformFromCopy(VGroup(*E[i]), q) for i, q in enumerate((q1, q2))], run_time=min(1.4, d * 0.6))
        d = self.say()                                   # zero equals zero
        self.play(TransformFromCopy(VGroup(*E[2]), q3), run_time=min(1.0, d))
        d = self.say()                                   # asks nothing
        self.play(Indicate(q3, color=WHITE, scale_factor=1.2), run_time=min(1.0, d))
        d = self.say()                                   # has solutions
        self.wait(max(0.1, d - 0.1))
        self.say()                                       # which pinned, which free?
        self.pause(2.0)                                  # ⏸ labels and highlights hidden

        pv = VGroup(*[SurroundingRectangle(m, color=WHITE, buff=0.07, stroke_width=2.5, corner_radius=0.04)
                      for m in (q1[0], q2[0])])
        fr = VGroup(*[SurroundingRectangle(m, buff=0.07, stroke_width=0, fill_color=C_DIM, fill_opacity=0.3,
                                           corner_radius=0.04).set_z_index(-2) for m in (q1[2], q1[4], q2[2])])
        d = self.say()                                   # one pivot variable per equation
        self.play(Create(pv), FadeIn(pb), FadeIn(n.clabs[0]), FadeIn(n.clabs[2]), run_time=min(1.4, d))
        d = self.say()                                   # x2 and x4 free
        self.play(FadeIn(fr), FadeIn(n.sh), FadeIn(n.clabs[1]), FadeIn(n.clabs[3]), run_time=min(1.4, d))
        d = self.say()                                   # everything read off this reduction
        self.play(Indicate(VGroup(A, *[e for r in E for e in r]), color=WHITE, scale_factor=1.02), run_time=min(1.2, d))
        self.pause(0.8)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def same_answer(self):
        Am = mat(A_ROWS, size=28).move_to([-3.6, 3.0, 0])
        Rm = mat(R_ROWS, size=28).move_to([3.6, 3.0, 0])
        An = M("<i>A</i> =", 28).next_to(Am, LEFT, buff=0.15)
        Rn = M("<i>R</i> =", 28).next_to(Rm, LEFT, buff=0.15)
        top_arr = Arrow(Am.get_right() + RIGHT * 0.3, Rn.get_left() + LEFT * 0.3, buff=0, color=WHITE,
                        stroke_width=3, tip_length=0.18)
        top_lab = P("row operations", 22, C_DIM).next_to(top_arr, UP, buff=0.08)
        alt0 = CurvedArrow(Am.get_bottom() + DOWN * 0.1 + RIGHT * 0.5, Rm.get_bottom() + DOWN * 0.1 + LEFT * 0.5,
                           angle=PI / 5, color=C_DIM, stroke_width=3)
        altq = M("?", 34, WHITE).move_to(alt0.point_from_proportion(0.5) + DOWN * 0.3)
        alt = DashedVMobject(alt0, num_dashes=30)
        d = self.say()                                   # choices along the way
        self.play(FadeIn(VGroup(Am, An)), GrowArrow(top_arr), FadeIn(top_lab), FadeIn(VGroup(Rm, Rn)),
                  run_time=min(1.6, d))
        d = self.say()                                   # someone else, another route
        self.play(Create(alt), run_time=min(1.6, d))
        d = self.say()                                   # same RREF?
        self.play(FadeIn(altq), run_time=min(0.8, d))
        self.pause(0.5)

        o, ap = a_panel(center=(-3.6, -0.7, 0))
        ttl_a = P("columns of <i>A</i>  (in ℝ<sup>3</sup>)", 22, C_DIM).move_to([-3.6, 1.35, 0])
        d = self.say()                                   # something row operations can't change
        self.play(FadeOut(VGroup(alt, altq)), run_time=min(0.8, d))
        d = self.say()                                   # look at the columns of A
        self.play(FadeIn(ttl_a), Create(ap.ax), FadeIn(ap.plane), run_time=min(1.0, d * 0.4))
        self.play(LaggedStart(*[GrowArrow(c) for c in ap.cols], lag_ratio=0.3), FadeIn(ap.labs),
                  run_time=min(1.4, d * 0.5))

        rel_a1 = M("(2, 4, 2) = 2·(1, 2, 1)", 26).move_to([-3.6, -2.85, 0])
        rel_a2 = M("(3, 10, −1) = (1, 2, 1) + 2·(1, 4, −1)", 26).move_to([-3.6, -3.45, 0])
        d = self.say()                                   # column two is twice column one
        cb = VGroup(col_box(Am, 0, WHITE), col_box(Am, 1, WHITE))
        self.play(Create(cb), Indicate(VGroup(ap.cols[0], ap.cols[1]), color=WHITE), run_time=min(1.2, d * 0.5))
        self.play(FadeIn(rel_a1), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # column four = column one + 2 column three
        cb2 = VGroup(col_box(Am, 0, WHITE), col_box(Am, 2, WHITE), col_box(Am, 3, WHITE))
        self.play(ReplacementTransform(cb, cb2), Indicate(VGroup(ap.cols[3]), color=WHITE), run_time=min(1.2, d * 0.5))
        self.play(FadeIn(rel_a2), run_time=min(0.8, d * 0.4))
        self.pause(0.5)

        o2, rp = r_panel(center=(3.4, -0.8, 0))
        ttl_r = P("columns of <i>R</i>  (in ℝ<sup>3</sup>)", 22, C_DIM).move_to([3.6, 1.35, 0])
        mid_arr = Arrow([-1.3, -0.5, 0], [1.6, -0.5, 0], buff=0, color=WHITE, stroke_width=3, tip_length=0.18)
        mid_lab = P("row operations", 22, C_DIM).next_to(mid_arr, UP, buff=0.08)
        d = self.say()                                   # now the columns of R
        self.play(FadeOut(cb2), ReplacementTransform(top_arr, mid_arr), ReplacementTransform(top_lab, mid_lab),
                  run_time=min(1.0, d * 0.4))
        self.play(FadeIn(ttl_r), Create(rp.ax), FadeIn(rp.plane), LaggedStart(*[GrowArrow(c) for c in rp.cols],
                  lag_ratio=0.3), FadeIn(rp.labs), run_time=min(1.4, d * 0.55))
        self.say()                                       # do the relations hold?
        self.pause(3.0)                                  # ⏸ R relations hidden

        rel_r1 = M("(2, 0, 0) = 2·(1, 0, 0)", 26).move_to([3.6, -2.85, 0])
        rel_r2 = M("(1, 2, 0) = (1, 0, 0) + 2·(0, 1, 0)", 26).move_to([3.6, -3.45, 0])
        d = self.say()                                   # they do
        self.play(FadeIn(rel_r1), FadeIn(rel_r2), run_time=min(1.0, d))
        d = self.say()                                   # columns moved, relations stayed
        self.play(Indicate(VGroup(rel_a1, rel_r1), color=WHITE, scale_factor=1.05), run_time=min(1.2, d * 0.45))
        self.play(Indicate(VGroup(rel_a2, rel_r2), color=WHITE, scale_factor=1.05), run_time=min(1.2, d * 0.45))

        relc = M("<i>c</i><sub>1</sub><i>a</i><sub>1</sub> + <i>c</i><sub>2</sub><i>a</i><sub>2</sub> + "
                 "<i>c</i><sub>3</sub><i>a</i><sub>3</sub> + <i>c</i><sub>4</sub><i>a</i><sub>4</sub> = <b>0</b>"
                 "   ⇔   <i>A</i><b>c</b> = <b>0</b>", 28).move_to([0, 3.2, 0])
        lem = VGroup(P("<b>Lemma 5.</b>  If <i>R</i> comes from <i>A</i> by row operations, then for every "
                       "<b>c</b>,  <i>A</i><b>c</b> = <b>0</b>  ⇔  <i>R</i><b>c</b> = <b>0</b>.", 24),
                     P("[<i>A</i> | <b>0</b>] → [<i>R</i> | <b>0</b>] by the same operations; Theorem 4.", 22, C_DIM))
        lem.arrange(DOWN, buff=0.18).move_to([0, 2.35, 0])
        d = self.say()                                   # why?
        self.play(FadeOut(VGroup(Am, An, Rm, Rn)), run_time=min(0.8, d))
        d = self.say()                                   # a relation is A c = 0
        self.play(FadeIn(relc), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # c solves Ax = 0
        self.play(Indicate(relc, color=WHITE, scale_factor=1.04), run_time=min(1.0, d))
        d = self.say()                                   # row operations, R x = 0, Theorem 4
        self.play(relc.animate.shift(UP * 0.35).set_opacity(0.0), FadeIn(lem[0]), run_time=min(1.2, d * 0.4))
        self.remove(relc)
        self.play(FadeIn(lem[1]), run_time=min(1.0, d * 0.35))
        self.pause(2.0)                                  # ⏸ read the lemma

        floorA = o.patch((0, 0, 0), (1, 0, 0), (0, 1, 0), (-0.3, 4.5), (-0.3, 11), color=C_DIM, opacity=0.12)
        drop = DashedLine(o.p(1, 2, 1), o.p(1, 2, 0), color=WHITE, stroke_width=2.5, dash_length=0.06)
        foot = Dot(o.p(1, 2, 0), radius=0.05, color=WHITE)
        d = self.say()                                   # the span changed
        self.play(FadeOut(lem), Indicate(ap.plane, color=C_COLW), Indicate(rp.plane, color=WHITE), run_time=min(1.4, d))
        d = self.say()                                   # R's columns lie in the floor
        self.play(Indicate(rp.plane, color=WHITE, scale_factor=1.03), Indicate(rp.cols, color=WHITE),
                  run_time=min(1.4, d))
        d = self.say()                                   # column one of A doesn't
        self.play(FadeIn(floorA), run_time=min(0.6, d * 0.3))
        self.play(Create(drop), FadeIn(foot), Indicate(ap.cols[0], color=WHITE), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # relations survive
        self.play(Indicate(VGroup(rel_a1, rel_a2, rel_r1, rel_r2), color=WHITE, scale_factor=1.03), run_time=min(1.0, d))
        d = self.say()                                   # spans don't need to
        self.play(Indicate(VGroup(ap.plane, rp.plane), color=WHITE, scale_factor=1.0), run_time=min(1.0, d))
        self.pause(0.8)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def unique(self):
        R = mat(R_ROWS, size=36, h_buff=1.1, v_buff=0.62).move_to([-3.6, 2.35, 0])
        E = R.entries
        Rn = M("<i>R</i> =", 34).next_to(R, LEFT, buff=0.2)
        pb = piv_boxes(R, [(0, 0), (1, 2)])
        sh = free_shade(R, cols=(1, 3))
        ly = R.get_bottom()[1] - 0.35
        lab = {j: M(t, 28, C_DIM if j in (1, 3) else WHITE).move_to([col_x(R, j), ly, 0])
               for j, t in ((0, "<i>e</i><sub>1</sub>"), (2, "<i>e</i><sub>2</sub>"), (1, "2<i>e</i><sub>1</sub>"),
                            (3, "<i>e</i><sub>1</sub> + 2<i>e</i><sub>2</sub>"))}
        lab[3].align_to(lab[1], DOWN).set_x(col_x(R, 3) + 0.2)
        d = self.say()                                   # how any RREF is built
        self.play(FadeIn(VGroup(Rn, R)), FadeIn(pb), FadeIn(sh), run_time=min(1.2, d))
        ob = VGroup(col_box(R, 0, WHITE), col_box(R, 2, WHITE))
        d = self.say()                                   # pivot columns are e1, e2
        self.play(Create(ob), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # here columns one and three
        self.play(FadeIn(lab[0]), FadeIn(lab[2]), run_time=min(1.0, d))

        d = self.say()                                   # free column, rows of pivots to its left
        self.play(Indicate(VGroup(*[E[i][1] for i in range(3)], *[E[i][3] for i in range(3)]), color=WHITE),
                  run_time=min(1.2, d))
        d = self.say()                                   # column two is two e1
        self.play(FadeIn(lab[1]), run_time=min(1.0, d))
        d = self.say()                                   # column four is e1 + 2 e2
        self.play(FadeIn(lab[3]), run_time=min(1.0, d))
        d = self.say()                                   # entries are the amounts
        self.play(Indicate(VGroup(E[0][3], E[1][3]), color=WHITE, scale_factor=1.3), Indicate(lab[3], color=WHITE),
                  run_time=min(1.2, d))

        f1 = P("(i)  Column <i>j</i> of <i>R</i> is a pivot column exactly\n"
               "      when it is <b>not</b> a combination of the\n"
               "      columns before it.", 24)
        f2 = P("(ii)  The entries of a free column are the\n"
               "       coefficients that express it through the\n"
               "       pivot columns before it, and they are unique,\n"
               "       because <i>e</i><sub>1</sub>, …, <i>e</i><sub>k</sub> are independent.", 24)
        facts = VGroup(f1, f2).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        facts.align_to([-0.7, 0, 0], LEFT).align_to([0, 3.6, 0], UP)
        d = self.say()                                   # two facts
        self.wait(max(0.1, d - 0.1))
        d = self.say()                                   # first fact
        self.play(FadeIn(f1), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # a free column is a combination of earlier ones
        self.play(Indicate(VGroup(lab[1], lab[3]), color=WHITE, scale_factor=1.2), run_time=min(1.2, d))
        z = hl(E[1][0], E[1][1])
        d = self.say()                                   # pivot column e_k isn't (zeros in row k) ... second fact
        self.play(FadeIn(z), Indicate(E[1][2], color=WHITE, scale_factor=1.4), run_time=min(1.4, d * 0.3))
        self.play(FadeOut(z), run_time=0.4)
        self.wait(max(0.1, d * 0.3))
        self.play(FadeIn(f2), run_time=min(1.2, d * 0.3))

        thm = boxed(P("<b>Theorem 6.</b>  Every matrix has exactly one RREF,\n"
                      "whatever sequence of row operations is used.", 24), color=WHITE, buff=0.22, fill=0.04).move_to([2.9, -0.7, 0])
        d = self.say()                                   # statements about relations
        self.play(Indicate(facts, color=WHITE, scale_factor=1.02), run_time=min(1.2, d))
        d = self.say()                                   # two people, two RREFs
        self.wait(max(0.1, d - 0.1))
        d = self.say()                                   # Lemma 5, then the first fact
        self.play(Indicate(f1, color=WHITE, scale_factor=1.03), Indicate(ob, color=WHITE), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # second fact
        self.play(Indicate(f2, color=WHITE, scale_factor=1.03), Indicate(sh, color=WHITE), run_time=min(1.4, d))
        d = self.say()                                   # rows below zero
        self.play(Indicate(VGroup(*E[2]), color=WHITE, scale_factor=1.3), run_time=min(1.0, d))
        d = self.say()                                   # same matrix
        self.play(FadeIn(thm), run_time=min(1.0, d))
        self.pause(2.0)                                  # ⏸ read the theorem

        # ---- a small case
        def mini(rows):
            return mat(rows, size=28, h_buff=0.6, v_buff=0.5)

        S = mini([["2", "4"], ["1", "2"]]).move_to([-5.6, -0.6, 0])
        mids = [mini(r) for r in ([["1", "2"], ["2", "4"]], [["1", "2"], ["1", "2"]], [["0", "0"], ["1", "2"]])]
        ys = (1.45, -0.6, -2.65)
        for m_, y in zip(mids, ys):
            m_.move_to([-1.0, y, 0])
        F = mini([["1", "2"], ["0", "0"]]).move_to([4.9, -0.6, 0])
        ops1 = ["swap", "R<sub>1</sub> ← ½R<sub>1</sub>", "R<sub>1</sub> ← R<sub>1</sub> − 2R<sub>2</sub>"]
        ops2 = ["R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub>", "R<sub>2</sub> ← R<sub>2</sub> − R<sub>1</sub>", "swap"]

        def arrows(srcs, dsts):
            return VGroup(*[Arrow(a_.get_right(), b_.get_left(), buff=0.15, color=C_DIM, stroke_width=2.5,
                                  tip_length=0.15) for a_, b_ in zip(srcs, dsts)])

        def labels(arrs, texts):
            g = VGroup()
            for a_, t in zip(arrs, texts):
                v = a_.get_end() - a_.get_start()
                nrm = np.array([-v[1], v[0], 0]) / np.linalg.norm(v)
                if nrm[1] < 0:
                    nrm = -nrm
                g.add(bglab(M(t, 24, C_DIM).move_to(a_.get_center() + nrm * 0.3)))
            return g

        a1 = arrows([S] * 3, mids)
        l1 = labels(a1, ops1)
        a2 = arrows(mids, [F] * 3)
        l2 = labels(a2, ops2)
        c2 = col_box(S, 1, C_REL)
        rel = VGroup(M("column 2", 24, C_REL), M("= 2 × column 1", 24, C_REL)).arrange(DOWN, buff=0.1)
        rel.next_to(S, DOWN, buff=0.3)
        d = self.say()                                   # a small case
        self.play(FadeOut(VGroup(R, Rn, pb, sh, ob, facts, *lab.values())), thm.animate.move_to([0, 3.15, 0]),
                  run_time=min(1.0, d * 0.5))
        self.play(FadeIn(S), run_time=min(0.6, d * 0.4))
        d = self.say()                                   # column two is twice column one
        self.play(Create(c2), FadeIn(rel), run_time=min(1.2, d))
        d = self.say()                                   # whatever anyone does
        self.play(LaggedStart(*[AnimationGroup(GrowArrow(a), FadeIn(l), FadeIn(m_)) for a, l, m_ in zip(a1, l1, mids)],
                              lag_ratio=0.5), run_time=min(2.4, d * 0.8))
        d = self.say()                                   # column two never a pivot; its entry is two
        cbs = VGroup(*[col_box(m_, 1, C_REL) for m_ in mids])
        self.play(Create(cbs), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # every route ends at (1, 2, 0, 0)
        self.play(LaggedStart(*[AnimationGroup(GrowArrow(a), FadeIn(l)) for a, l in zip(a2, l2)], lag_ratio=0.4),
                  FadeIn(F), run_time=min(2.0, d * 0.8))
        fb = VGroup(piv_boxes(F, [(0, 0)]), col_box(F, 1, C_REL))
        d = self.say()                                   # nothing left to choose
        self.play(Create(fb), run_time=min(1.0, d))
        d = self.say()                                   # belongs to the matrix itself
        self.play(Indicate(VGroup(F, fb), color=WHITE, scale_factor=1.1), run_time=min(1.2, d * 0.4))
        self.play(Indicate(thm, color=WHITE, scale_factor=1.03), run_time=min(1.2, d * 0.4))
