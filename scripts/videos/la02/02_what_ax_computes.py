"""What A x computes. Script: docs/LA02_VIDEO_SCRIPT.md, section "What A x computes"."""
from sample import *  # noqa: F401,F403
import itertools
import re


def plain(s):
    return "".join(re.sub(r"<[^>]+>", "", s).split())


def MM(s, size=30, color=WHITE):
    """Math text that remembers its glyph string, so parts can be picked out by text."""
    t = M(s, size, color)
    t.plain = plain(s)
    assert len(t) == len(t.plain), (s, len(t), len(t.plain))
    return t


def pick(t, s, k=0):
    s = "".join(s.split())
    i = -1
    for _ in range(k + 1):
        i = t.plain.index(s, i + 1)
    return VGroup(*t[i:i + len(s)])


def bg(m):
    return m.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.05)


# oblique 3-D box for three unknowns (same projection idea as b3 in 01_one_system)
O3 = np.array([-4.95, -1.8, 0])
EX3, EY3, EZ3 = np.array([0.62, 0, 0]), np.array([0, 0.62, 0]), np.array([-0.3, -0.25, 0])
LO3, HI3 = (-0.5, 0, -2.5), (2.5, 4, 1.5)


def p3(x, y, z):
    return O3 + x * EX3 + y * EY3 + z * EZ3


def plane_poly(n, d, color, lo=LO3, hi=HI3):
    """The plane n.x = d, clipped to the box, as a translucent polygon."""
    n = np.array(n, float)
    corners = [np.array(c, float) for c in itertools.product(*zip(lo, hi))]
    pts = []
    for c0, c1 in itertools.combinations(corners, 2):
        if np.sum(c0 != c1) != 1:
            continue
        f0, f1 = n @ c0 - d, n @ c1 - d
        if abs(f0) < 1e-9:
            pts.append(c0)
        elif f0 * f1 < 0:
            pts.append(c0 + f0 / (f0 - f1) * (c1 - c0))
    uniq = []
    for p in pts:
        if all(np.linalg.norm(p - q) > 1e-6 for q in uniq):
            uniq.append(p)
    c = np.mean(uniq, axis=0)
    u = np.cross(n, [1, 0, 0]) if abs(n[0]) < 0.9 * np.linalg.norm(n) else np.cross(n, [0, 1, 0])
    v = np.cross(n, u)
    uniq.sort(key=lambda p: np.arctan2((p - c) @ v, (p - c) @ u))
    return Polygon(*[p3(*p) for p in uniq], color=color, stroke_width=2, fill_color=color, fill_opacity=0.22)



class WhatAxComputes(NScene):
    PARAS = [
        # ---- any amounts, not just two and three
        ["Two and three was one input.",
         "What does A do to an input you haven't solved for, any amounts x and y?"],
        ["The rule from chapter one says, take x blues and y teals.",
         "x copies of the blue arrow, two, one, is two x, x. "
         "y copies of the teal arrow, minus one, one, is minus y, y."],
        ["Add them.",
         "The first entry is two x minus y. "
         "The second is x plus y."],
        ["Those are the left sides of the two equations, back again.",
         "So the column recipe and the row equations are not two methods that happen to agree.",
         "They're one sum, added up in a different order.",
         "Down the columns, you scale whole arrows and add them.",
         "Across the rows, you build the answer one entry at a time."],
        ["Across row one, that's two times x, plus minus one times y. "
         "Multiply matching entries and add.",
         "It is the dot product from chapter one, row one of A with the input.",
         "Every entry of the output is one row of A, dotted with the input."],
        # ---- any size
        ["Nothing here depends on there being two of anything.",
         "A matrix with m rows and n columns is called an m by n matrix.",
         "The number in row i and column j is written a, sub i j. "
         "Its columns are n arrows, a one up to a n, and each has m entries."],
        ["With more than two unknowns, we stop inventing letters and number them.",
         "x one, x two, up to x n, one amount for each column.",
         "That list is the input x.",
         "It lives in R n. "
         "The output, and the target b, have one entry per row, so they live in R m."],
        ["For our A, both are R two, and that's why the two panels look alike.",
         "They are still different places.",
         "The left holds amounts.",
         "The right holds where the amounts land."],
        ["That is the definition.",
         "A times x is x one copies of the first column, plus x two copies of the second, and so on to x n "
         "copies of the last.",
         "Read off entry i of that sum, and you get row i of A, dotted with x."],
        # ---- two ways to read A x = b
        ["A x equals b can be read two ways, then.",
         "Read by columns, it asks for a recipe.",
         "Which combination of the columns builds b?",
         "That's the column picture.",
         "Read by rows, it's a list of m equations, and the answer must satisfy all of them at once.",
         "That's the row picture."],
        ["With two unknowns, each equation is a line.",
         "With three, it's a plane, a flat sheet in space.",
         "With n unknowns it's the same kind of object, one dimension short of the whole space, called a "
         "hyperplane, provided at least one coefficient is nonzero.",
         "If every coefficient is zero, the equation says zero equals its right-hand side.",
         "That holds everywhere if the right-hand side is zero, and nowhere otherwise.",
         "Those two cases come back when we eliminate.",
         "In the row picture, a solution is a point on every hyperplane."],
        # ---- the simplest inputs
        ["Some inputs are easier than others.",
         "Put a one in the first slot and zero everywhere else.",
         "Where does A send that?"],
        ["One blue and no teal.",
         "It lands on blue itself, two, one.",
         "And zero, one lands on teal.",
         "These inputs, with a single one and zeros elsewhere, are the standard basis vectors from chapter one.",
         "In R n there are n of them, e one to e n."],
        ["A times e j picks out column j and nothing else.",
         "The columns of a matrix, then, are not just numbers in a grid.",
         "Each one says where one direction of the input space goes."],
    ]

    def construct(self):
        self.any_amounts()
        self.any_size()
        self.two_ways()
        self.simplest()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def make_A(self):
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_name = M("<i>A</i> =", 34)
        return A, VGroup(A_name, A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))

    def any_amounts(self):
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        A, A_grp = self.make_A()
        a1 = vec(pout, 2, 1, C_U, width=6).set_opacity(0.35)
        a2 = vec(pout, -1, 1, C_Q, width=6).set_opacity(0.35)
        tx, ty = ValueTracker(2), ValueTracker(3)

        def blue_f():
            x = tx.get_value()
            return vec_between(pout, (0, 0), (2 * x, x), C_U, width=5)

        def teal_f():
            x, y = tx.get_value(), ty.get_value()
            return vec_between(pout, (2 * x, x), (2 * x - y, x + y), C_Q, width=5)

        def end_f():
            x, y = tx.get_value(), ty.get_value()
            return Dot(pout.c2p(2 * x - y, x + y), radius=0.08, color=WHITE)

        din = Dot(pin.c2p(2, 3), radius=0.09, color=WHITE)
        lab = bg(M("(2, 3)", 26)).next_to(din, RIGHT, buff=0.15)

        # ---- two and three was one input
        d = self.say()
        self.play(Create(pin), Create(pout), FadeIn(tin), FadeIn(tout), FadeIn(A_grp), run_time=min(1.5, d * 0.6))
        b0, t0, e0 = blue_f(), teal_f(), end_f()
        self.play(FadeIn(a1), FadeIn(a2), FadeIn(din), FadeIn(lab), GrowArrow(b0), run_time=min(0.8, d * 0.2))
        self.play(GrowArrow(t0), FadeIn(e0), run_time=min(0.6, d * 0.2))
        self.remove(b0, t0, e0)
        bl, te, en = always_redraw(blue_f), always_redraw(teal_f), always_redraw(end_f)
        self.add(bl, te, en)
        din.add_updater(lambda m: m.move_to(pin.c2p(tx.get_value(), ty.get_value())))
        labxy = bg(M("(<i>x</i>, <i>y</i>)", 26)).next_to(din, RIGHT, buff=0.15)

        d = self.say()                                   # any amounts x and y
        self.play(ReplacementTransform(lab, labxy), run_time=0.6)
        labxy.add_updater(lambda m: m.next_to(din, RIGHT, buff=0.15))
        for x, y in ((2.5, 1.5), (1, 2), (1.5, 2.5)):
            self.play(tx.animate.set_value(x), ty.animate.set_value(y), run_time=max(0.8, (d - 0.6) * 0.31))
        din.clear_updaters()
        labxy.clear_updaters()
        self.remove(bl, te, en)
        blue_s, teal_s, end_s = blue_f(), teal_f(), end_f()
        self.add(blue_s, teal_s, end_s)

        # ---- the column recipe, term by term
        line1 = MM("<i>A</i>(<i>x</i>, <i>y</i>) = <i>x</i> (2, 1) + <i>y</i> (−1, 1)", 30)
        pick(line1, "(2,1)").set_color(C_U)
        pick(line1, "(−1,1)").set_color(C_Q)
        line1.move_to(np.array([0.4, 3.5, 0]), aligned_edge=LEFT)
        line2 = MM("= (2<i>x</i>, <i>x</i>) + (−<i>y</i>, <i>y</i>)", 30)
        pick(line2, "(2x,x)").set_color(C_U)
        pick(line2, "(−y,y)").set_color(C_Q)
        line3 = MM("= (2<i>x</i> − <i>y</i>, <i>x</i> + <i>y</i>)", 30)
        eq_x = pick(line1, "=").get_x()
        for k, (ln, y) in enumerate(((line2, 2.9), (line3, 2.3))):
            ln.move_to(np.array([0, y, 0]))
            ln.shift(RIGHT * (eq_x - pick(ln, "=")[0].get_x()))
        d = self.say()                                   # take x blues and y teals
        self.play(Write(line1), run_time=min(2.0, d * 0.8))
        d = self.say()                                   # x copies of blue ... y copies of teal
        self.play(FadeIn(pick(line2, "=(2x,x)")), Indicate(blue_s, color=C_U), run_time=d * 0.45)
        self.play(FadeIn(pick(line2, "+(−y,y)")), Indicate(teal_s, color=C_Q), run_time=d * 0.45)

        d = self.say()                                   # add them
        self.play(FadeIn(VGroup(pick(line3, "=("), pick(line3, ","), pick(line3, ")"))), run_time=min(0.8, d))
        r1, r2 = pick(line3, "2x−y"), pick(line3, "x+y")
        d = self.say()                                   # first entry ... second entry
        self.play(FadeIn(r1), run_time=d * 0.45)
        self.play(FadeIn(r2), run_time=d * 0.45)
        eq1 = MM("2<i>x</i> − <i>y</i> = 1", 34, C_L1)
        eq2 = MM("<i>x</i> + <i>y</i> = 5", 34, C_L2)
        eqs = VGroup(eq1, eq2).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to(np.array([-3.5, TOP_Y, 0]))
        self.until_end()
        self.play(FadeIn(eqs), run_time=0.8)
        self.pause(2.0)                                  # ⏸ compare the entries with the equations

        # ---- the same sum
        lhs1, lhs2 = pick(eq1, "2x−y"), pick(eq2, "x+y")
        d = self.say()                                   # the left sides, back again
        self.play(Indicate(lhs1, color=C_L1), Indicate(lhs2, color=C_L2), run_time=0.8)
        c1, c2 = lhs1.copy(), lhs2.copy()
        self.play(c1.animate.scale(30 / 34).move_to(r1), c2.animate.scale(30 / 34).move_to(r2),
                  r1.animate.set_color(C_L1), r2.animate.set_color(C_L2), run_time=min(1.4, max(0.6, d - 1.1)))
        self.remove(c1, c2)
        d = self.say()                                   # not two methods that happen to agree
        self.play(Indicate(line1, color=WHITE, scale_factor=1.04), run_time=d * 0.45)
        self.play(Indicate(eqs, color=WHITE, scale_factor=1.04), run_time=d * 0.45)
        d = self.say()                                   # one sum, different order
        self.play(Indicate(line3, color=WHITE, scale_factor=1.06), run_time=min(1.2, d))
        d = self.say()                                   # down the columns
        self.play(Indicate(VGroup(blue_s, pick(line1, "(2,1)")), color=C_U), run_time=d * 0.45)
        self.play(Indicate(VGroup(teal_s, pick(line1, "(−1,1)")), color=C_Q), run_time=d * 0.45)
        d = self.say()                                   # across the rows
        self.play(Indicate(VGroup(eq1, r1), color=C_L1, scale_factor=1.08), run_time=d * 0.45)
        self.play(Indicate(VGroup(eq2, r2), color=C_L2, scale_factor=1.08), run_time=d * 0.45)
        self.pause(0.5)

        # ---- row times input: the dot product
        dl1 = MM("(2, −1) · (<i>x</i>, <i>y</i>)", 32).move_to(np.array([-3.5, 3.4, 0]))
        dl2 = MM("= 2·<i>x</i> + (−1)·<i>y</i> = 2<i>x</i> − <i>y</i>", 32).move_to(np.array([-3.5, 2.7, 0]))
        pick(dl2, "2x−y").set_color(C_L1)
        n2, nm1 = pick(dl1, "2"), pick(dl1, "−1")
        d = self.say()                                   # across row one ... multiply matching entries and add
        self.play(FadeOut(eqs), FadeOut(line1), FadeOut(line2), run_time=0.5)
        self.play(TransformFromCopy(A.entries[0][0], n2), TransformFromCopy(A.entries[0][1], nm1),
                  FadeIn(VGroup(*[g for g in dl1 if g not in n2 and g not in nm1])), run_time=min(1.4, d * 0.2))
        self.play(Indicate(VGroup(n2, pick(dl1, "x"))), run_time=d * 0.13)
        self.play(Indicate(VGroup(nm1, pick(dl1, "y"))), run_time=d * 0.13)
        self.play(FadeIn(pick(dl2, "=2·x+(−1)·y")), run_time=d * 0.15)
        self.play(FadeIn(pick(dl2, "=2x−y")), Indicate(r1, color=C_L1), run_time=d * 0.15)
        d = self.say()                                   # the dot product from chapter one
        self.play(Indicate(dl1, color=WHITE, scale_factor=1.06), run_time=min(1.4, d))
        dl1b = MM("(1, 1) · (<i>x</i>, <i>y</i>)", 32).move_to(dl1)
        dl2b = MM("= 1·<i>x</i> + 1·<i>y</i> = <i>x</i> + <i>y</i>", 32).move_to(dl2).align_to(dl2, LEFT)
        pick(dl2b, "x+y").set_color(C_L2)
        d = self.say()                                   # every entry: one row of A, dotted with the input
        self.play(Indicate(VGroup(A.entries[1][0], A.entries[1][1]), color=WHITE),
                  ReplacementTransform(dl1, dl1b), run_time=d * 0.35)
        self.play(ReplacementTransform(dl2, dl2b), run_time=d * 0.3)
        self.play(Indicate(r2, color=C_L2), run_time=d * 0.25)
        self.pause(0.6)
        self.n_amounts = (pin, tin, pout, tout, A, A_grp, a1, a2, din, labxy, blue_s, teal_s, end_s,
                          dl1b, dl2b, line3)

    # ------------------------------------------------------------------------------------------------
    def any_size(self):
        pin, tin, pout, tout, A, A_grp, a1, a2, din, labxy, blue_s, teal_s, end_s, dl1b, dl2b, line3 = self.n_amounts
        rect = Rectangle(width=3.6, height=2.4, stroke_color=C_DIM, stroke_width=2, fill_color="#3A4150",
                         fill_opacity=0.6).move_to(np.array([0, -0.6, 0]))
        gl = VGroup(*[Line(rect.get_corner(DL) + RIGHT * 0.9 * k, rect.get_corner(UL) + RIGHT * 0.9 * k)
                      for k in (1, 2, 3)],
                    *[Line(rect.get_corner(DL) + UP * 0.6 * k, rect.get_corner(DR) + UP * 0.6 * k)
                      for k in (1, 2, 3)]).set_stroke("#5B6475", 1)
        blk = VGroup(rect, gl)
        d = self.say()                                   # nothing depends on two
        self.play(FadeOut(VGroup(pin, pout, din, labxy, blue_s, teal_s, end_s, a1, a2, dl1b, dl2b, line3)),
                  run_time=min(0.8, d * 0.3))
        self.play(ReplacementTransform(A_grp, blk), run_time=min(1.4, d * 0.5))

        br_m = Brace(rect, LEFT, buff=0.12)
        lab_m = P("<i>m</i> rows", 24).next_to(br_m, LEFT, buff=0.12)
        br_n = Brace(rect, DOWN, buff=0.12)
        lab_n = P("<i>n</i> columns", 24).next_to(br_n, DOWN, buff=0.1)
        term = P("<i>m</i> × <i>n</i> matrix", 26).next_to(rect, RIGHT, buff=0.35).align_to(rect, UP)
        d = self.say()                                   # m rows, n columns: m by n
        self.play(GrowFromCenter(br_m), FadeIn(lab_m), run_time=d * 0.25)
        self.play(GrowFromCenter(br_n), FadeIn(lab_n), run_time=d * 0.25)
        self.play(FadeIn(term), run_time=min(0.8, d * 0.3))

        cx, cy = rect.get_left()[0] + 0.9 * 2.5, rect.get_top()[1] - 0.6 * 1.5
        rowband = Rectangle(width=3.6, height=0.6, stroke_width=0, fill_color=WHITE, fill_opacity=0.08).move_to([0, cy, 0])
        colband = Rectangle(width=0.9, height=2.4, stroke_width=0, fill_color=WHITE, fill_opacity=0.08).move_to([cx, -0.6, 0])
        cell = Rectangle(width=0.9, height=0.6, stroke_color=WHITE, stroke_width=3).move_to([cx, cy, 0])
        aij = M("<i>a</i><sub><i>ij</i></sub>", 28).move_to(cell)
        lab_i = P("row <i>i</i>", 24, C_DIM).next_to(rect, RIGHT, buff=0.3).set_y(cy)
        lab_j = P("column <i>j</i>", 24, C_DIM).next_to(rect, UP, buff=0.15).set_x(cx)
        strips_x = [-2.1, -0.7, 0.7, 2.1]
        cols = [C_U, C_Q, C_DIM, WHITE]
        strips = VGroup()
        for k, (x, c) in enumerate(zip(strips_x, cols)):
            r = Rectangle(width=0.7, height=2.4, stroke_color=c, stroke_width=2.5, fill_color=c, fill_opacity=0.15)
            r.move_to([x, -0.6, 0])
            strips.add(DashedVMobject(r, num_dashes=30) if k == 2 else r)
        slabs = VGroup(M("<b>a</b><sub>1</sub>", 30, C_U), M("<b>a</b><sub>2</sub>", 30, C_Q), M("⋯", 30, C_DIM),
                       M("<b>a</b><sub><i>n</i></sub>", 30))
        for l, s in zip(slabs, strips):
            l.next_to(s, DOWN, buff=0.2)
        br_e = Brace(strips[0], LEFT, buff=0.1)
        lab_e = P("<i>m</i> entries", 24).next_to(br_e, LEFT, buff=0.1)
        d = self.say()                                   # a sub i j ... its columns are n arrows
        self.play(FadeIn(rowband), FadeIn(colband), FadeIn(lab_i), FadeIn(lab_j), run_time=d * 0.15)
        self.play(Create(cell), FadeIn(aij), run_time=d * 0.2)
        self.wait(d * 0.12)
        self.play(FadeOut(VGroup(rowband, colband, cell, aij, lab_i, lab_j, br_m, lab_m, br_n, lab_n, term)),
                  run_time=d * 0.1)
        self.play(ReplacementTransform(blk, strips), FadeIn(slabs), run_time=d * 0.2)
        self.play(GrowFromCenter(br_e), FadeIn(lab_e), run_time=d * 0.15)

        # ---- the amounts x1 ... xn
        amts = VGroup(M("<i>x</i><sub>1</sub>", 30), M("<i>x</i><sub>2</sub>", 30), M("⋯", 30, C_DIM),
                      M("<i>x</i><sub><i>n</i></sub>", 30))
        for a, s in zip(amts, strips):
            a.next_to(s, UP, buff=0.22)
        d = self.say()                                   # we number them
        self.play(FadeOut(br_e), FadeOut(lab_e), run_time=min(0.6, d))
        d = self.say()                                   # x one, x two, up to x n
        self.play(LaggedStart(*[FadeIn(a, shift=DOWN * 0.15) for a in amts], lag_ratio=0.5), run_time=d * 0.75)
        xcol = column_vec(["<i>x</i><sub>1</sub>", "<i>x</i><sub>2</sub>", "⋮", "<i>x</i><sub><i>n</i></sub>"],
                          size=30, v_buff=0.55)
        xname = M("<b>x</b> =", 32)
        xg = VGroup(xname, xcol).arrange(RIGHT, buff=0.2).move_to([-4.9, -0.6, 0])
        d = self.say()                                   # that list is the input x
        self.play(*[TransformFromCopy(amts[k], xcol.entries[k][0]) for k in range(4)],
                  FadeIn(xcol[0]), FadeIn(xcol[2]), FadeIn(xname), run_time=min(1.6, d))
        tin_n = P("input: the amounts (<i>x</i><span size='smaller' rise='-1500'>1</span>, …, <i>x</i>"
                  "<span size='smaller' rise='-1500'><i>n</i></span>), in ℝ<sup><i>n</i></sup>",
                  22, C_DIM).move_to(tin)
        tout_m = P("output: where the amounts land, in ℝ<sup><i>m</i></sup>", 22, C_DIM).move_to(tout)
        bcol = column_vec(["<b>b</b><sub>1</sub>", "<b>b</b><sub>2</sub>", "⋮", "<b>b</b><sub><i>m</i></sub>"],
                          size=30, color=C_W, v_buff=0.55)
        bname = M("<b>b</b> =", 32, C_W)
        bgp = VGroup(bname, bcol).arrange(RIGHT, buff=0.2).move_to([4.9, -0.6, 0])
        d = self.say()                                   # lives in R n ... output and b live in R m
        self.play(ReplacementTransform(tin, tin_n), Indicate(xg, color=WHITE, scale_factor=1.05),
                  run_time=max(0.8, d * 0.2))
        self.wait(d * 0.15)
        self.play(FadeIn(bgp), run_time=d * 0.25)
        self.play(ReplacementTransform(tout, tout_m), run_time=d * 0.25)

        # ---- back to our A: two panels that look alike
        A2, A2_grp = self.make_A()
        pin2, _ = panel(LEFT_C, "")
        pout2, _ = panel(RIGHT_C, "")
        d = self.say()                                   # for our A, both are R two
        self.play(FadeOut(xg), FadeOut(bgp), FadeOut(amts),
                  ReplacementTransform(VGroup(strips, slabs), A2_grp), run_time=min(1.4, d * 0.4))
        self.play(Create(pin2), Create(pout2), run_time=min(1.4, d * 0.45))
        d = self.say()                                   # still different places
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # the left holds amounts
        self.play(Indicate(VGroup(pin2, tin_n), color=WHITE, scale_factor=1.02), run_time=min(1.2, d))
        d = self.say()                                   # the right holds where they land
        self.play(Indicate(VGroup(pout2, tout_m), color=WHITE, scale_factor=1.02), run_time=min(1.2, d))
        self.pause(0.5)

        # ---- the definition
        def1 = MM("<i>A</i><b>x</b> = <i>x</i><sub>1</sub><b>a</b><sub>1</sub> + <i>x</i><sub>2</sub><b>a</b><sub>2</sub>"
                  " + ⋯ + <i>x</i><sub><i>n</i></sub><b>a</b><sub><i>n</i></sub> ∈ ℝ<sup><i>m</i></sup>", 32)
        pick(def1, "a1").set_color(C_U)
        pick(def1, "a2").set_color(C_Q)
        def2 = MM("(<i>A</i><b>x</b>)<sub><i>i</i></sub> = <i>a</i><sub><i>i</i>1</sub><i>x</i><sub>1</sub> + "
                  "<i>a</i><sub><i>i</i>2</sub><i>x</i><sub>2</sub> + ⋯ + <i>a</i><sub><i>in</i></sub><i>x</i>"
                  "<sub><i>n</i></sub> = (row <i>i</i> of <i>A</i>) · <b>x</b>", 32)
        def1.move_to([0, 3.45, 0]).to_edge(LEFT, buff=0.7)
        def2.move_to([0, 2.65, 0]).to_edge(LEFT, buff=0.7)
        dterm = P("matrix–vector product <i>A</i><b>x</b>", 24).next_to(def1, RIGHT, buff=0.6)
        d = self.say()                                   # that is the definition
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # x one copies of the first column ...
        self.play(Write(def1), run_time=min(3.0, d * 0.8))
        d = self.say()                                   # entry i: row i dotted with x
        self.play(Write(def2), run_time=min(3.0, d * 0.75))
        self.play(FadeIn(dterm), run_time=0.6)
        self.pause(2.0)                                  # ⏸ read both lines of the definition
        self.n_size = (pin2, pout2, tin_n, tout_m, A2, A2_grp, def1, def2, dterm)

    # ------------------------------------------------------------------------------------------------
    def two_ways(self):
        pin, pout, tin_n, tout_m, A, A_grp, def1, def2, dterm = self.n_size
        tin = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).move_to(tin_n)
        tout = P("output: where the amounts land", 22, C_DIM).move_to(tout_m)
        l1 = Line(pin.c2p(0, -1), pin.c2p(3.5, 6), color=C_L1, stroke_width=4)
        l2 = Line(pin.c2p(-1, 6), pin.c2p(5, 0), color=C_L2, stroke_width=4)
        sol = dot(pin, 2, 3, WHITE, r=0.09)
        sol_lab = bg(M("(2, 3)", 26)).next_to(sol, RIGHT, buff=0.3).shift(DOWN * 0.08)
        a1 = vec(pout, 2, 1, C_U, width=6).set_opacity(0.35)
        a2 = vec(pout, -1, 1, C_Q, width=6).set_opacity(0.35)
        pts = [(0, 0), (2, 1), (4, 2), (3, 3), (2, 4), (1, 5)]
        steps = VGroup(*[vec_between(pout, pts[k], pts[k + 1], C_U if k < 2 else C_Q, width=5) for k in range(5)])
        tgt = dot(pout, 1, 5, C_W, r=0.1)
        tgt_lab = M("(1, 5)", 26, C_W).next_to(tgt, RIGHT, buff=0.12)

        d = self.say()                                   # read two ways
        self.play(FadeOut(def1), FadeOut(def2), FadeOut(dterm), ReplacementTransform(tin_n, tin),
                  ReplacementTransform(tout_m, tout), run_time=0.8)
        self.play(Create(l1), Create(l2), FadeIn(sol), FadeIn(sol_lab), FadeIn(a1), FadeIn(a2),
                  LaggedStart(*[GrowArrow(s) for s in steps], lag_ratio=0.3), FadeIn(tgt), FadeIn(tgt_lab),
                  run_time=max(1.0, min(2.0, d - 0.9)))
        d = self.say()                                   # by columns: a recipe
        self.play(Indicate(steps, color=WHITE, scale_factor=1.04), run_time=min(1.4, d))
        d = self.say()                                   # which combination builds b?
        self.play(Indicate(VGroup(tgt, tgt_lab), color=C_W, scale_factor=1.4), run_time=min(1.2, d))
        col_lab = P("column picture", 24).next_to(pout, DOWN, buff=0.15)
        row_lab = P("row picture", 24).next_to(pin, DOWN, buff=0.15)
        d = self.say()                                   # the column picture
        self.play(FadeIn(col_lab), run_time=min(0.8, d))
        d = self.say()                                   # by rows: m equations at once
        self.play(Indicate(l1, color=C_L1, scale_factor=1.0), run_time=d * 0.4)
        self.play(Indicate(l2, color=C_L2, scale_factor=1.0), Indicate(sol, color=WHITE, scale_factor=1.6),
                  run_time=d * 0.45)
        d = self.say()                                   # the row picture
        self.play(FadeIn(row_lab), run_time=min(0.8, d))
        self.pause(0.5)

        # ---- three unknowns: planes in a box
        PC = ["#D8DEE9", "#A3B8CC", "#C9B08F"]
        d = self.say()                                   # two unknowns: each equation is a line
        self.play(l1.animate.set_stroke(width=7), l2.animate.set_stroke(width=7), run_time=min(0.8, d * 0.5))
        self.play(l1.animate.set_stroke(width=4), l2.animate.set_stroke(width=4), run_time=min(0.6, d * 0.4))

        edges = VGroup()
        cs = list(itertools.product(*zip(LO3, HI3)))
        for c0, c1 in itertools.combinations(cs, 2):
            if sum(a != b for a, b in zip(c0, c1)) == 1:
                edges.add(Line(p3(*c0), p3(*c1), color="#3A4356", stroke_width=1.5))
        axes = VGroup(Arrow(p3(0, 0, 0), p3(2.9, 0, 0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15),
                      Arrow(p3(0, 0, 0), p3(0, 4.5, 0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15),
                      Arrow(p3(0, 0, 0), p3(0, 0, 2.0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15))
        axl = VGroup(M("<i>x</i>", 24, C_DIM).next_to(axes[0].get_end(), RIGHT, buff=0.06),
                     M("<i>y</i>", 24, C_DIM).next_to(axes[1].get_end(), UP, buff=0.06),
                     M("<i>z</i>", 24, C_DIM).next_to(axes[2].get_end(), DL, buff=0.04))
        box = VGroup(edges, axes, axl)
        tin3 = P("input: the amounts (<i>x</i>, <i>y</i>, <i>z</i>)", 22, C_DIM).move_to(tin)
        planes = VGroup(plane_poly((2, 1, 1), 3, PC[0]), plane_poly((4, 1, 0), 6, PC[1]),
                        plane_poly((-2, 2, 1), 1, PC[2]))
        elabs = VGroup(MM("2<i>x</i> + <i>y</i> + <i>z</i> = 3", 30, PC[0]),
                       MM("4<i>x</i> + <i>y</i> = 6", 30, PC[1]),
                       MM("−2<i>x</i> + 2<i>y</i> + <i>z</i> = 1", 30, PC[2]))
        elabs.arrange(DOWN, buff=0.18, aligned_edge=RIGHT).move_to([-3.6, 2.95, 0])
        d = self.say()                                   # three unknowns: a plane
        self.play(FadeTransform(VGroup(pin, l1, l2, sol, sol_lab), box), ReplacementTransform(tin, tin3),
                  run_time=min(1.4, d * 0.45))
        self.play(FadeIn(planes[0]), FadeIn(elabs[0]), run_time=min(1.2, d * 0.45))
        hp = P("hyperplane", 26, PC[0]).move_to([-0.4, 0.95, 0])
        desc = P("the solutions of one linear\nequation in ℝ<sup>n</sup>, at least\none coefficient ≠ 0", 22,
                 C_DIM).next_to(hp, DOWN, buff=0.15)
        d = self.say()                                   # n unknowns: a hyperplane
        self.play(FadeIn(planes[1]), FadeIn(elabs[1]), run_time=d * 0.15)
        self.play(FadeIn(planes[2]), FadeIn(elabs[2]), run_time=d * 0.15)
        self.wait(d * 0.3)
        self.play(FadeIn(hp), Indicate(planes[0], color=PC[0], scale_factor=1.0), run_time=d * 0.12)
        self.play(FadeIn(desc), run_time=d * 0.15)
        for _ in range(3):                               # every coefficient zero: two cases (spoken only)
            d = self.say()
            self.wait(max(0, d - 0.1))
        sol3 = Dot(p3(1, 2, -1), radius=0.09, color=WHITE)
        sol3_lab = bg(M("(1, 2, −1)", 24)).next_to(sol3, LEFT, buff=0.15)
        d = self.say()                                   # a point on every hyperplane
        self.play(FadeIn(sol3, scale=0.5), FadeIn(sol3_lab), run_time=min(1.0, d * 0.4))
        self.play(Indicate(sol3, color=WHITE, scale_factor=1.8), run_time=min(1.0, d * 0.4))
        self.pause(0.6)
        self.n_ways = (pout, tin3, tout, A, A_grp, VGroup(box, planes, elabs, hp, desc, sol3, sol3_lab,
                                                          row_lab, col_lab, a1, a2, steps, tgt, tgt_lab))

    # ------------------------------------------------------------------------------------------------
    def simplest(self):
        pout, tin3, tout, A, A_grp, old = self.n_ways
        pin, _ = panel(LEFT_C, "")
        tin = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).move_to(tin3)
        din = Dot(pin.c2p(2, 3), radius=0.09, color=WHITE)
        lab = bg(M("(<i>x</i>, <i>y</i>)", 26)).next_to(din, RIGHT, buff=0.15)
        d = self.say()                                   # some inputs are easier
        self.play(FadeOut(old), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(pin), ReplacementTransform(tin3, tin), FadeIn(din), FadeIn(lab), run_time=min(1.0, d * 0.5))
        e1 = vec(pin, 1, 0, WHITE, width=5)
        e1_lab = bg(M("<b>e</b><sub>1</sub> = (1, 0)", 26)).next_to(pin.c2p(1, 0), DR, buff=0.1)
        d = self.say()                                   # a one in the first slot
        self.play(din.animate.move_to(pin.c2p(1, 0)), ReplacementTransform(lab, e1_lab), run_time=min(1.0, d * 0.5))
        self.play(GrowArrow(e1), FadeOut(din), run_time=min(0.6, d * 0.3))
        d = self.say()                                   # where does A send that?
        self.play(Indicate(VGroup(e1, e1_lab), color=WHITE, scale_factor=1.15), run_time=min(0.8, d))
        self.pause(2.0)                                  # ⏸ predict where (1, 0) lands (right panel empty)

        blue = vec(pout, 2, 1, C_U, width=6)
        blue_lab = M("(2, 1)", 26, C_U).next_to(blue.get_end(), RIGHT, buff=0.1)
        teal = vec(pout, -1, 1, C_Q, width=6)
        teal_lab = M("(−1, 1)", 26, C_Q).next_to(teal.get_end(), UP, buff=0.1)
        d = self.say()                                   # one blue and no teal
        self.play(Indicate(VGroup(A.entries[0][0], A.entries[1][0]), color=C_U), GrowArrow(blue),
                  run_time=min(1.4, d))
        d = self.say()                                   # blue itself, two, one
        self.play(FadeIn(blue_lab), run_time=min(0.8, d))
        e2 = vec(pin, 0, 1, WHITE, width=5)
        e2_lab = bg(M("<b>e</b><sub>2</sub> = (0, 1)", 26)).next_to(pin.c2p(0, 1), UR, buff=0.1)
        d = self.say()                                   # zero, one lands on teal
        self.play(GrowArrow(e2), FadeIn(e2_lab), run_time=min(1.0, d * 0.45))
        self.play(Indicate(VGroup(A.entries[0][1], A.entries[1][1]), color=C_Q), GrowArrow(teal), FadeIn(teal_lab),
                  run_time=min(1.2, d * 0.45))
        ej = P("<b>e</b><sub><i>j</i></sub>: 1 in slot <i>j</i>, 0 elsewhere", 26).move_to([-3.5, 2.55, 0])
        d = self.say()                                   # the standard basis vectors
        self.play(FadeIn(ej), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # n of them in R n
        self.play(Indicate(VGroup(e1_lab, e2_lab), color=WHITE, scale_factor=1.08), run_time=min(1.2, d))

        prec = MM("<i>A</i><b>e</b><sub><i>j</i></sub> = 0·<b>a</b><sub>1</sub> + ⋯ + 1·<b>a</b><sub><i>j</i></sub> + ⋯ + "
                  "0·<b>a</b><sub><i>n</i></sub> = <b>a</b><sub><i>j</i></sub>", 32)
        pcol = P("(column <i>j</i>)", 24, C_DIM)
        pg = VGroup(prec, pcol).arrange(RIGHT, buff=0.35).move_to([0, 3.4, 0])
        d = self.say()                                   # picks out column j
        self.play(Write(prec), run_time=min(2.4, d * 0.75))
        self.play(FadeIn(pcol), run_time=min(0.6, d * 0.2))
        d = self.say()                                   # not just numbers in a grid
        self.play(Indicate(A, color=WHITE, scale_factor=1.1), run_time=min(1.2, d))
        d = self.say()                                   # each says where one direction goes
        self.play(Indicate(VGroup(e1, e1_lab, blue, blue_lab), color=C_U, scale_factor=1.06), run_time=d * 0.45)
        self.play(Indicate(VGroup(e2, e2_lab, teal, teal_lab), color=C_Q, scale_factor=1.06), run_time=d * 0.45)
