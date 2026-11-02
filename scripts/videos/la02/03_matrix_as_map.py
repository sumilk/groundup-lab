"""The matrix as a map. Script: docs/LA02_VIDEO_SCRIPT.md, section "The matrix as a map"."""
from sample import *  # noqa: F401,F403
import importlib

_m02 = importlib.import_module("02_what_ax_computes")
MM, pick, bg = _m02.MM, _m02.pick, _m02.bg

GREY = "#B8C2D0"


def clip_line(p, x0, d, xr=XR, yr=YR):
    """The part of the line x0 + t d that lies inside the panel window, as a Line (or None)."""
    lo, hi = -1e9, 1e9
    for k, (a, b) in enumerate((xr, yr)):
        if abs(d[k]) < 1e-9:
            if not a <= x0[k] <= b:
                return None
            continue
        t1, t2 = (a - x0[k]) / d[k], (b - x0[k]) / d[k]
        lo, hi = max(lo, min(t1, t2)), min(hi, max(t1, t2))
    if hi - lo < 1e-6:
        return None
    return Line(p.c2p(x0[0] + lo * d[0], x0[1] + lo * d[1]), p.c2p(x0[0] + hi * d[0], x0[1] + hi * d[1]))


def map_arrow(label_mobs, y=0.35):
    arc = CurvedArrow(np.array([-1.3, y, 0]), np.array([1.3, y, 0]), angle=-PI / 3, color=WHITE,
                      stroke_width=4, tip_length=0.22)
    lab = VGroup(*label_mobs).arrange(DOWN, buff=0.08)
    lab.next_to(arc, UP, buff=0.12)
    return arc, lab


def panel_r(center, title, xr=XR, yr=YR):
    p = plane(xr, yr, unit=UNIT).move_to(center)
    t = P(title, 22, C_DIM).next_to(p, UP, buff=0.15)
    return p, t


def sub(s):
    """A subscript inside sans prose that sits closer to the baseline than P's default."""
    return f"<span size='smaller' rise='-1500'>{s}</span>"


def oblique(O, ex, ey, ez):
    O = np.array([O[0], O[1], 0], float)
    return lambda x, y, z: O + x * np.array([ex, 0, 0]) + y * np.array([0, ey, 0]) + z * np.array([ez[0], ez[1], 0])


class MatrixAsMap(NScene):
    PARAS = [
        # ---- the whole grid at once
        ["Those two columns settle where every other input goes.",
         "Send the whole square grid of the input panel through A. "
         "One step right on the left becomes one blue step on the right.",
         "One step up becomes one teal step.",
         "The square grid arrives as a slanted grid, its rows along blue and its columns along teal."],
        ["The point two across and three up on the left lands two across and three up in the slanted grid.",
         "Which is the target.",
         "Solving A x equals b is finding the grid point on the left that lands on b on the right."],
        ["But why should the grid survive the trip at all?",
         "Why do straight, evenly spaced lines on the left arrive straight and evenly spaced on the right?"],
        # ---- combinations go to combinations
        ["Take two inputs, x and y, and form a combination, alpha copies of x plus beta copies of y.",
         "A uses each entry of the input as the amount of one column.",
         "The amount of column j in the combination is alpha x j plus beta y j. "
         "Split that, and you get alpha copies of the recipe x, plus beta copies of the recipe y."],
        ["A combination of inputs goes to the same combination of outputs.",
         "That's why the grid survives.",
         "Every grid point is a combination of the two steps, so its image is the same combination of blue "
         "and teal."],
        ["A function that takes vectors in R n to vectors in R m, and has this property for all inputs and all "
         "amounts, is called linear.",
         "The property itself is called superposition.",
         "The response to a combination is the same combination of the responses."],
        ["Three special cases are worth having by name.",
         "With both amounts one, sums go to sums.",
         "That's additivity.",
         "With beta zero, scaling goes to scaling.",
         "That's homogeneity.",
         "And with both amounts zero, the zero input goes to the zero output.",
         "A linear map always fixes the origin."],
        # ---- is every linear map a matrix?
        ["Every matrix gives a linear map.",
         "Does it work the other way?",
         "If someone hands you a linear map, with no matrix in sight, is there always a matrix doing the same "
         "job?"],
        ["Write any input as its amounts along the axes, x one copies of e one, plus x two copies of e two, "
         "and so on.",
         "Superposition says f of that is x one copies of f of e one, plus x two copies of f of e two.",
         "Now stand the arrows f of e one, up to f of e n, side by side as columns.",
         "That sum is exactly the column definition of the matrix times x."],
        ["Could a different matrix B also match f?",
         "Then B times e j would equal f of e j, which is A times e j.",
         "But A times e j is column j of A, and B times e j is column j of B.",
         "Every column agrees, so B is A."],
        ["A linear map is decided by where it sends the axes.",
         "A list of n columns pins down what happens to every point of the input space."],
        # ---- building matrices from what a map does
        ["Take a map described only in words.",
         "Turn the whole plane a quarter turn counterclockwise about the origin.",
         "Is that linear?",
         "Turn a parallelogram and you get a parallelogram, so sums go to sums.",
         "Turn a stretched arrow and you get the turned arrow, stretched by the same amount.",
         "It is.",
         "Then its matrix is decided by two things.",
         "Where does e one go, and where does e two go?"],
        ["e one, pointing right, ends up pointing up, at zero, one.",
         "e two, pointing up, ends up pointing left, at minus one, zero.",
         "Those are the columns."],
        ["Check it on three, one.",
         "Three copies of zero, one, plus one copy of minus one, zero, is minus one, three.",
         "And three, one, turned a quarter turn, does point to minus one, three."],
        ["The input and output don't have to be the same size.",
         "Take three measurements, and report two numbers.",
         "Their mean, and the last minus the first.",
         "Averages and differences respect sums and scaling, so this is linear.",
         "Its matrix needs three columns, one for each input axis."],
        ["e one, the measurements one, zero, zero, has mean one third, and last minus first is minus one.",
         "e two and e three give the other two columns the same way.",
         "The matrix is two by three.",
         "Two rows, because two numbers come out.",
         "Three columns, because three go in.",
         "On the measurements three, six, twelve, it reports a mean of seven, and a difference of nine."],
        ["One more map.",
         "Move every point one unit to the right.",
         "Is that linear?"],
        ["It sends zero to one, zero.",
         "A linear map has to send zero to zero, so this one isn't linear.",
         "A linear map followed by a shift is called affine.",
         "A neural-network layer that computes W times x, plus a bias c, is affine for the same reason whenever "
         "c isn't zero."],
        ["When a paper writes W times h, read it as a combination of W's columns, weighted by the entries of h.",
         "Anything said about what a layer without a bias can output is a statement about the span of those "
         "columns."],
    ]

    def construct(self):
        self.grid_at_once()
        self.combinations()
        self.every_linear_map()
        self.rotation()
        self.measurements()
        self.shift_and_layer()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def grid_at_once(self):
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_grp = VGroup(M("<i>A</i> =", 34), A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))
        arc, alab = map_arrow([M("<i>A</i>", 34)])
        hl = VGroup(*[Line(pin.c2p(XR[0], k), pin.c2p(XR[1], k)) for k in range(YR[0], YR[1] + 1)])
        vl = VGroup(*[Line(pin.c2p(k, YR[0]), pin.c2p(k, YR[1])) for k in range(XR[0], XR[1] + 1)])
        VGroup(hl, vl).set_stroke(WHITE, 1.6, opacity=0.45)
        h_img, h_src, v_img, v_src = VGroup(), VGroup(), VGroup(), VGroup()
        for k, ln in zip(range(YR[0], YR[1] + 1), hl):          # y = k  ->  (2t − k, t + k), along blue
            im = clip_line(pout, (-k, k), (2, 1))
            if im is not None:
                h_img.add(im.set_stroke(C_U, 2, opacity=0.6)); h_src.add(ln)
        for k, ln in zip(range(XR[0], XR[1] + 1), vl):          # x = k  ->  (2k − t, k + t), along teal
            im = clip_line(pout, (2 * k, k), (-1, 1))
            if im is not None:
                v_img.add(im.set_stroke(C_Q, 2, opacity=0.6)); v_src.add(ln)

        d = self.say()                                   # two columns settle every other input
        self.play(Create(pin), Create(pout), FadeIn(tin), FadeIn(tout), FadeIn(A_grp), run_time=min(1.6, d * 0.6))
        self.play(Indicate(VGroup(A.entries[0][0], A.entries[1][0]), color=C_U),
                  Indicate(VGroup(A.entries[0][1], A.entries[1][1]), color=C_Q), run_time=min(1.0, d * 0.35))
        s1 = vec(pin, 1, 0, WHITE, width=6)
        s2 = vec(pin, 0, 1, WHITE, width=6)
        a1 = vec(pout, 2, 1, C_U, width=6)
        a2 = vec(pout, -1, 1, C_Q, width=6)
        d = self.say()                                   # send the grid through A ... one step right: one blue step
        self.play(Create(hl), Create(vl), Create(arc), FadeIn(alab), run_time=d * 0.4)
        self.play(GrowArrow(s1), run_time=d * 0.2)
        self.play(TransformFromCopy(s1, a1), run_time=d * 0.3)
        d = self.say()                                   # one step up: one teal step
        self.play(GrowArrow(s2), run_time=d * 0.35)
        self.play(TransformFromCopy(s2, a2), run_time=d * 0.5)
        d = self.say()                                   # the square grid arrives slanted
        self.play(LaggedStart(*[TransformFromCopy(a, b) for a, b in zip(h_src, h_img)], lag_ratio=0.15),
                  run_time=d * 0.45)
        self.play(LaggedStart(*[TransformFromCopy(a, b) for a, b in zip(v_src, v_img)], lag_ratio=0.15),
                  run_time=d * 0.45)
        self.pause(0.5)

        # ---- the point (2, 3) and its image
        sol = dot(pin, 2, 3, WHITE, r=0.09)
        cnt_l = VGroup(*[vec_between(pin, (k, 0), (k + 1, 0), WHITE, width=4) for k in range(2)],
                       *[vec_between(pin, (2, k), (2, k + 1), WHITE, width=4) for k in range(3)])
        pts = [(0, 0), (2, 1), (4, 2), (3, 3), (2, 4), (1, 5)]
        cnt_r = VGroup(*[vec_between(pout, pts[k], pts[k + 1], C_U if k < 2 else C_Q, width=5) for k in range(5)])
        d = self.say()                                   # two across, three up, on both sides
        self.play(FadeOut(s1), FadeOut(s2), LaggedStart(*[GrowArrow(a) for a in cnt_l], lag_ratio=0.5),
                  run_time=d * 0.4)
        self.play(FadeIn(sol, scale=0.5), run_time=d * 0.1)
        self.play(LaggedStart(*[GrowArrow(a) for a in cnt_r], lag_ratio=0.5), run_time=d * 0.4)
        tgt = dot(pout, 1, 5, C_W, r=0.1)
        tgt_lab = bg(M("(1, 5)", 26, C_W)).next_to(tgt, RIGHT, buff=0.12)
        d = self.say()                                   # which is the target
        self.play(FadeIn(tgt, scale=0.5), FadeIn(tgt_lab), run_time=min(0.9, d))
        link = CurvedArrow(sol.get_center() + UP * 0.12 + RIGHT * 0.06, tgt.get_center() + LEFT * 0.2,
                           angle=-PI / 3, color=WHITE, stroke_width=4, tip_length=0.22)
        d = self.say()                                   # solving Ax = b: the grid point that lands on b
        self.play(Indicate(sol, color=WHITE, scale_factor=1.8), run_time=min(0.8, d * 0.3))
        self.play(FadeOut(arc), FadeOut(alab), Create(link), run_time=min(1.4, d * 0.4))
        self.pause(0.8)

        # ---- why does the grid survive?
        d = self.say()                                   # why should the grid survive?
        self.play(FadeOut(VGroup(cnt_l, cnt_r, link, sol, tgt, tgt_lab)), FadeIn(arc), FadeIn(alab),
                  run_time=min(0.8, d * 0.5))
        k2 = list(range(YR[0], YR[1] + 1)).index(2)
        d = self.say()                                   # straight, evenly spaced lines
        self.play(Indicate(h_src, color=WHITE, scale_factor=1.0), Indicate(h_img, color=C_U, scale_factor=1.0),
                  run_time=d * 0.45)
        self.play(Indicate(v_src, color=WHITE, scale_factor=1.0), Indicate(v_img, color=C_Q, scale_factor=1.0),
                  run_time=d * 0.45)
        self.pause(0.6)
        self.g = dict(pin=pin, tin=tin, pout=pout, tout=tout, A=A, A_grp=A_grp, arc=arc, alab=alab,
                      left_grid=VGroup(hl, vl), right_grid=VGroup(h_img, v_img), a1=a1, a2=a2)

    # ------------------------------------------------------------------------------------------------
    def combinations(self):
        g = self.g
        pin, pout = g["pin"], g["pout"]
        X, Y = (1, 1), (1, -1)
        xa = vec(pin, *X, WHITE, width=5)
        ya = vec(pin, *Y, GREY, width=5)
        xl = bg(M("<b>x</b>", 28)).next_to(xa.get_end(), UL, buff=0.05)
        yl = bg(M("<b>y</b>", 28, GREY)).next_to(ya.get_end(), RIGHT, buff=0.1)
        lpath = VGroup(vec_between(pin, (1, 1), (2, 2), WHITE, width=4), vec_between(pin, (2, 2), (3, 1), GREY, width=4))
        lend = dot(pin, 3, 1, WHITE, r=0.08)
        lend_l = bg(M("2<b>x</b> + <b>y</b>", 26)).next_to(lend, RIGHT, buff=0.12)
        AX, AY = (1, 2), (3, 0)
        xi = vec(pout, *AX, WHITE, width=5)
        yi = vec(pout, *AY, GREY, width=5)
        xil = bg(M("<i>A</i><b>x</b>", 26)).next_to(xi.get_end(), LEFT, buff=0.1)
        yil = bg(M("<i>A</i><b>y</b>", 26, GREY)).next_to(yi.get_end(), DOWN, buff=0.1)
        rpath = VGroup(vec_between(pout, (1, 2), (2, 4), WHITE, width=4), vec_between(pout, (2, 4), (5, 4), GREY, width=4))
        rend = dot(pout, 5, 4, WHITE, r=0.08)
        rend_l = bg(M("<i>A</i>(2<b>x</b> + <b>y</b>)", 26)).next_to(rend, UP, buff=0.12).shift(LEFT * 0.5)
        eqA = MM("<i>A</i>(α<b>x</b> + β<b>y</b>) = Σ<sub><i>j</i></sub> (α<i>x</i><sub><i>j</i></sub> + "
                 "β<i>y</i><sub><i>j</i></sub>) <b>a</b><sub><i>j</i></sub> = α Σ<sub><i>j</i></sub> <i>x</i><sub><i>j</i></sub>"
                 "<b>a</b><sub><i>j</i></sub> + β Σ<sub><i>j</i></sub> <i>y</i><sub><i>j</i></sub><b>a</b><sub><i>j</i></sub>"
                 " = α<i>A</i><b>x</b> + β<i>A</i><b>y</b>", 32).move_to([0, 3.3, 0])
        q1, q2, q3, q4 = (pick(eqA, "A(αx+βy)"), pick(eqA, "=Σj(αxj+βyj)aj"), pick(eqA, "=αΣjxjaj+βΣjyjaj"),
                          pick(eqA, "=αAx+βAy"))

        d = self.say()                                   # two inputs and a combination
        self.play(g["left_grid"].animate.set_stroke(opacity=0.15), g["right_grid"].animate.set_stroke(opacity=0.22),
                  g["a1"].animate.set_opacity(0.3), g["a2"].animate.set_opacity(0.3), run_time=min(0.6, d * 0.1))
        self.play(GrowArrow(xa), FadeIn(xl), GrowArrow(ya), FadeIn(yl), run_time=d * 0.3)
        self.play(GrowArrow(lpath[0]), run_time=d * 0.15)
        self.play(GrowArrow(lpath[1]), FadeIn(lend), FadeIn(lend_l), run_time=d * 0.15)
        self.play(FadeIn(q1), run_time=d * 0.15)
        d = self.say()                                   # each entry is the amount of one column
        self.play(TransformFromCopy(xa, xi), TransformFromCopy(ya, yi), FadeIn(xil), FadeIn(yil), run_time=d * 0.45)
        self.play(FadeIn(q2), run_time=d * 0.4)
        d = self.say()                                   # amount of column j ... split that
        self.play(Indicate(pick(eqA, "(αxj+βyj)"), color=WHITE), run_time=d * 0.15)
        self.play(TransformFromCopy(lend, rend), FadeIn(rend_l), run_time=d * 0.2)
        self.play(FadeIn(q3), run_time=d * 0.2)
        self.play(FadeIn(q4), GrowArrow(rpath[0]), run_time=d * 0.18)
        self.play(GrowArrow(rpath[1]), run_time=d * 0.15)
        self.pause(2.0)                                  # ⏸ read the three equal signs

        d = self.say()                                   # combination in, same combination out
        self.play(Indicate(VGroup(lend, lend_l), color=WHITE), Indicate(VGroup(rend, rend_l), color=WHITE),
                  run_time=min(1.4, d))
        d = self.say()                                   # that's why the grid survives
        self.play(FadeOut(VGroup(xa, ya, xl, yl, lpath, xi, yi, xil, yil, rpath)),
                  g["left_grid"].animate.set_stroke(opacity=0.45), g["right_grid"].animate.set_stroke(opacity=0.6),
                  run_time=min(1.2, d))
        st_l = VGroup(vec_between(pin, (0, 0), (0, 1), WHITE, width=4),
                      *[vec_between(pin, (k, 1), (k + 1, 1), WHITE, width=4) for k in range(3)])
        st_r = VGroup(vec_between(pout, (0, 0), (-1, 1), C_Q, width=5),
                      *[vec_between(pout, (2 * k - 1, k + 1), (2 * k + 1, k + 2), C_U, width=5) for k in range(3)])
        d = self.say()                                   # every grid point: same combination of blue and teal
        self.play(LaggedStart(*[GrowArrow(a) for a in st_l], lag_ratio=0.5), run_time=d * 0.4)
        self.play(LaggedStart(*[GrowArrow(a) for a in st_r], lag_ratio=0.5), run_time=d * 0.45)
        self.pause(0.5)

        # ---- linear: superposition
        eqF = MM("<i>f</i>(α<b>x</b> + β<b>y</b>) = α<i>f</i>(<b>x</b>) + β<i>f</i>(<b>y</b>)", 34).move_to([0, 3.3, 0])
        flab = M("<i>f</i>", 34).move_to(g["alab"])
        lin = VGroup(P("linear map", 24), M("<i>f</i> : ℝ<sup><i>n</i></sup> → ℝ<sup><i>m</i></sup>", 28))
        lin.arrange(DOWN, buff=0.12).move_to([0, -0.45, 0])
        sup = P("superposition", 24, C_DIM).next_to(eqF, DOWN, buff=0.2)
        d = self.say()                                   # called linear
        self.play(FadeOut(st_l), FadeOut(st_r), FadeOut(VGroup(lend, lend_l, rend, rend_l)), FadeTransform(eqA, eqF), ReplacementTransform(g["alab"], flab),
                  run_time=min(1.6, d * 0.4))
        self.play(FadeIn(lin), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # superposition
        self.play(FadeIn(sup), run_time=min(0.8, d))
        d = self.say()                                   # response to a combination
        self.play(Indicate(eqF, color=WHITE, scale_factor=1.05), run_time=min(1.4, d))
        self.pause(0.5)

        # ---- three special cases
        rows = [("α = β = 1:", "<i>f</i>(<b>x</b> + <b>y</b>) = <i>f</i>(<b>x</b>) + <i>f</i>(<b>y</b>)", "additivity"),
                ("β = 0:", "<i>f</i>(α<b>x</b>) = α<i>f</i>(<b>x</b>)", "homogeneity"),
                ("α = β = 0:", "<i>f</i>(<b>0</b>) = <b>0</b>", None)]
        cases = []
        for k, (c, f, t) in enumerate(rows):
            y = 1.4 - 1.05 * k
            cm = M(c, 30, C_DIM)
            cm.move_to([0, y, 0]).align_to(np.array([-2.3, 0, 0]), RIGHT)
            fm = M(f, 34).move_to([0, y, 0]).align_to(np.array([-1.8, 0, 0]), LEFT)
            tm = P(t, 26).move_to([0, y, 0]).align_to(np.array([3.3, 0, 0]), LEFT) if t else None
            cases.append((cm, fm, tm))
        keep = VGroup(eqF, sup)
        d = self.say()                                   # three special cases
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep], run_time=min(1.0, d))
        for k in range(3):
            d = self.say()                               # the case
            self.play(FadeIn(cases[k][0]), FadeIn(cases[k][1]), run_time=min(1.2, d * 0.8))
            d = self.say()                               # its name / fixes the origin
            if cases[k][2] is not None:
                self.play(FadeIn(cases[k][2]), run_time=min(0.8, d))
            else:
                self.play(Indicate(cases[k][1], color=WHITE, scale_factor=1.15), run_time=min(1.2, d))
        self.pause(0.6)
        self.cases = VGroup(*[m for c in cases for m in c if m is not None], eqF, sup)

    # ------------------------------------------------------------------------------------------------
    def every_linear_map(self):
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_grp = VGroup(M("<i>A</i> =", 34), A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))
        arc, alab = map_arrow([M("<i>A</i>", 34)])
        d = self.say()                                   # every matrix gives a linear map
        self.play(FadeOut(self.cases), run_time=min(0.8, d * 0.3))
        self.play(Create(pin), Create(pout), FadeIn(tin), FadeIn(tout), FadeIn(A_grp), Create(arc), FadeIn(alab),
                  run_time=min(1.6, d * 0.6))
        d = self.say()                                   # the other way?
        self.wait(max(0, d - 0.1))
        fbox = VGroup(RoundedRectangle(width=0.6, height=0.55, corner_radius=0.08, stroke_color=WHITE, stroke_width=3,
                                       fill_color=config.background_color, fill_opacity=1),
                      M("<i>f</i>", 34)).move_to(arc.point_from_proportion(0.5))
        fbox[1].move_to(fbox[0])
        d = self.say()                                   # no matrix in sight
        self.play(FadeOut(A_grp), run_time=min(0.8, d * 0.3))
        self.play(ReplacementTransform(alab, fbox), run_time=min(1.0, d * 0.4))

        e1 = vec_between(pin, (0, 0), (1, 0), WHITE, width=5)
        e2s = VGroup(vec_between(pin, (1, 0), (1, 1), WHITE, width=5), vec_between(pin, (1, 1), (1, 2), WHITE, width=5))
        e1l = bg(M("<b>e</b><sub>1</sub>", 26)).next_to(e1, DOWN, buff=0.08)
        e2l = bg(M("<b>e</b><sub>2</sub>", 26)).next_to(e2s[0], RIGHT, buff=0.08)
        xd = dot(pin, 1, 2, WHITE, r=0.08)
        xdl = bg(M("<b>x</b> = (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>)", 26)).next_to(xd, RIGHT, buff=0.12)
        fe1 = vec(pout, 3, 1, WHITE, width=5)
        fe2 = vec(pout, 1, 2, GREY, width=5)
        fe1l = bg(M("<i>f</i>(<b>e</b><sub>1</sub>)", 26)).next_to(fe1.get_end(), DR, buff=0.05)
        fe2l = bg(M("<i>f</i>(<b>e</b><sub>2</sub>)", 26, GREY)).next_to(fe2.get_end(), LEFT, buff=0.1)
        rp = VGroup(vec_between(pout, (3, 1), (4, 3), GREY, width=4), vec_between(pout, (4, 3), (5, 5), GREY, width=4))
        fx = dot(pout, 5, 5, WHITE, r=0.08)
        fxl = bg(M("<i>f</i>(<b>x</b>)", 26)).next_to(fx, LEFT, buff=0.12)
        L1 = MM("<b>x</b> = <i>x</i><sub>1</sub><b>e</b><sub>1</sub> + ⋯ + <i>x</i><sub><i>n</i></sub><b>e</b><sub><i>n</i></sub>"
                "  ⇒  <i>f</i>(<b>x</b>) = <i>x</i><sub>1</sub><i>f</i>(<b>e</b><sub>1</sub>) + ⋯ + <i>x</i><sub><i>n</i></sub>"
                "<i>f</i>(<b>e</b><sub><i>n</i></sub>) = <i>A</i><b>x</b>", 30).move_to([0, 3.55, 0])
        L2 = MM("<i>A</i> = [ <i>f</i>(<b>e</b><sub>1</sub>)  ⋯  <i>f</i>(<b>e</b><sub><i>n</i></sub>) ]", 30).move_to([0, 2.95, 0])
        L3 = MM("<i>B</i><b>x</b> = <i>f</i>(<b>x</b>) for all <b>x</b>  ⇒  <i>B</i><b>e</b><sub><i>j</i></sub> = "
                "<i>f</i>(<b>e</b><sub><i>j</i></sub>) = <i>A</i><b>e</b><sub><i>j</i></sub>  ⇒  column <i>j</i> of <i>B</i>"
                " = column <i>j</i> of <i>A</i>", 28).move_to([0, 2.35, 0])
        d = self.say()                                   # x one copies of e one, plus x two copies of e two
        self.play(GrowArrow(e1), FadeIn(e1l), run_time=d * 0.25)
        self.play(LaggedStart(*[GrowArrow(a) for a in e2s], lag_ratio=0.6), FadeIn(e2l), run_time=d * 0.3)
        self.play(FadeIn(xd), FadeIn(xdl), FadeIn(pick(L1, "x=x1e1+⋯+xnen")), run_time=d * 0.3)
        d = self.say()                                   # superposition: f of that
        self.play(GrowArrow(fe1), FadeIn(fe1l), GrowArrow(fe2), FadeIn(fe2l), run_time=d * 0.3)
        self.play(TransformFromCopy(fe2, rp[0]), run_time=d * 0.15)
        self.play(TransformFromCopy(fe2, rp[1]), FadeIn(fx), FadeIn(fxl), run_time=d * 0.15)
        self.play(FadeIn(pick(L1, "⇒f(x)=x1f(e1)+⋯+xnf(en)")), run_time=d * 0.3)
        d = self.say()                                   # stand them side by side as columns
        self.play(FadeIn(pick(L2, "A=[")), FadeIn(pick(L2, "⋯")), FadeIn(pick(L2, "]")),
                  TransformFromCopy(fe1l, pick(L2, "f(e1)")), TransformFromCopy(fe2l, pick(L2, "f(en)")),
                  run_time=min(1.6, d * 0.7))
        d = self.say()                                   # exactly the column definition
        self.play(FadeIn(pick(L1, "=Ax")), run_time=min(0.8, d * 0.5))
        self.play(Indicate(pick(L1, "=Ax"), color=WHITE), run_time=min(0.8, d * 0.4))

        d = self.say()                                   # a different B?
        self.play(FadeIn(pick(L3, "Bx=f(x)forallx")), run_time=min(1.2, d))
        d = self.say()                                   # B e j = f(e j) = A e j
        self.play(FadeIn(pick(L3, "⇒Bej=f(ej)=Aej")), run_time=min(1.2, d))
        d = self.say()                                   # column j of each
        self.play(FadeIn(pick(L3, "⇒columnjofB=columnjofA")), run_time=min(1.2, d))
        d = self.say()                                   # every column agrees
        self.play(Indicate(pick(L3, "columnjofB=columnjofA"), color=WHITE), run_time=min(1.2, d))
        th = VGroup(M("<b>Theorem 1</b>: every linear map ℝ<sup><i>n</i></sup> → ℝ<sup><i>m</i></sup> is "
                      "<b>x</b> ↦ <i>A</i><b>x</b> for exactly one <i>m</i> × <i>n</i> matrix <i>A</i>,", 28),
                    M("with columns <i>f</i>(<b>e</b><sub>1</sub>), …, <i>f</i>(<b>e</b><sub><i>n</i></sub>)", 28))
        th.arrange(DOWN, buff=0.18).move_to([0, 3.0, 0])
        self.until_end()
        self.play(FadeOut(VGroup(L1, L2, L3)), run_time=0.5)
        self.play(FadeIn(th), run_time=0.8)
        self.pause(2.0)                                  # ⏸ read the theorem against the picture
        d = self.say()                                   # decided by where it sends the axes
        self.play(Indicate(VGroup(e1, e2s, e1l, e2l), color=WHITE, scale_factor=1.05), run_time=d * 0.45)
        self.play(Indicate(VGroup(fe1, fe2, fe1l, fe2l), color=WHITE, scale_factor=1.05), run_time=d * 0.45)
        d = self.say()                                   # n columns pin down every point
        self.play(Indicate(th[1], color=WHITE, scale_factor=1.06), run_time=min(1.4, d * 0.5))
        self.pause(0.8)

    # ------------------------------------------------------------------------------------------------
    def rotation(self):
        XR2 = (-2, 4)
        d = self.say()                                   # a map described only in words
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.6)
        pin, tin = panel_r(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)", XR2)
        pout, tout = panel_r(RIGHT_C, "output: where the amounts land", XR2)
        arc, alab = map_arrow([P("rotate 90°", 22), P("counterclockwise", 22)], y=-0.2)
        sq = Polygon(*[pin.c2p(*p) for p in ((0, 0), (1, 0), (1, 1), (0, 1))], stroke_width=0,
                     fill_color=WHITE, fill_opacity=0.12)
        e1 = vec(pin, 1, 0, WHITE, width=5)
        e2 = vec(pin, 0, 1, GREY, width=5)
        e1l = bg(M("<b>e</b><sub>1</sub>", 26)).next_to(e1.get_end(), DOWN, buff=0.1)
        e2l = bg(M("<b>e</b><sub>2</sub>", 26, GREY)).next_to(e2.get_end(), LEFT, buff=0.1)
        self.play(Create(pin), Create(pout), FadeIn(tin), FadeIn(tout), run_time=min(1.2, max(0.6, d - 0.7)))
        d = self.say()                                   # a quarter turn counterclockwise
        self.play(FadeIn(sq), GrowArrow(e1), GrowArrow(e2), FadeIn(e1l), FadeIn(e2l), Create(arc), FadeIn(alab),
                  run_time=min(1.6, d))
        d = self.say()                                   # is that linear?
        self.play(Indicate(alab, color=WHITE), run_time=min(1.0, d))
        for _ in range(4):                               # parallelograms, stretched arrows: it is; two things
            d = self.say()
            self.wait(max(0, d - 0.1))
        d = self.say()                                   # where do e one and e two go?
        self.play(Indicate(VGroup(e1, e1l), color=WHITE), run_time=d * 0.45)
        self.play(Indicate(VGroup(e2, e2l), color=GREY), run_time=d * 0.45)
        self.pause(3.0)                                  # ⏸ predict (turned square, images, R hidden)

        sq_r = Polygon(*[pout.c2p(*p) for p in ((0, 0), (0, 1), (-1, 1), (-1, 0))], stroke_width=0,
                       fill_color=WHITE, fill_opacity=0.12)
        r1 = vec(pout, 0, 1, WHITE, width=5)
        r2 = vec(pout, -1, 0, GREY, width=5)
        r1l = bg(M("(0, 1)", 26)).next_to(r1.get_end(), RIGHT, buff=0.1)
        r2l = bg(M("(−1, 0)", 26, GREY)).next_to(r2.get_end(), DOWN, buff=0.12)
        d = self.say()                                   # e one ends up pointing up
        self.play(FadeIn(sq_r), TransformFromCopy(e1, r1), run_time=min(1.4, d * 0.6))
        self.play(FadeIn(r1l), run_time=min(0.6, d * 0.3))
        d = self.say()                                   # e two ends up pointing left
        self.play(TransformFromCopy(e2, r2), run_time=min(1.4, d * 0.6))
        self.play(FadeIn(r2l), run_time=min(0.6, d * 0.3))
        R = matrix_mob([["0", "−1"], ["1", "0"]], size=34)
        R_grp = VGroup(M("<i>R</i> =", 34), R).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))
        d = self.say()                                   # those are the columns
        self.play(FadeIn(R_grp[0]), FadeIn(VGroup(R[0], R[2])),
                  TransformFromCopy(r1l[1:], VGroup(R.entries[0][0], R.entries[1][0])),
                  TransformFromCopy(r2l[1:], VGroup(R.entries[0][1], R.entries[1][1])), run_time=min(1.6, d))

        v = vec(pin, 3, 1, WHITE, width=5)
        vl = bg(M("(3, 1)", 26)).next_to(v.get_end(), RIGHT, buff=0.1)
        chk = MM("<i>R</i>(3, 1) = 3·(0, 1) + 1·(−1, 0) = (−1, 3)", 30)
        chk.move_to([3.2, 2.6, 0])
        walk = VGroup(*[vec_between(pout, (0, k), (0, k + 1), WHITE, width=4) for k in range(3)],
                      vec_between(pout, (0, 3), (-1, 3), GREY, width=4))
        d = self.say()                                   # check it on three, one
        self.play(GrowArrow(v), FadeIn(vl), FadeIn(pick(chk, "R(3,1)")), run_time=min(1.2, d))
        d = self.say()                                   # three copies of (0, 1) plus one of (−1, 0)
        self.play(FadeIn(pick(chk, "=3·(0,1)+1·(−1,0)")), run_time=d * 0.3)
        self.play(LaggedStart(*[GrowArrow(a) for a in walk], lag_ratio=0.6), run_time=d * 0.4)
        self.play(FadeIn(pick(chk, "=(−1,3)")), run_time=d * 0.2)
        d = self.say()                                   # (3, 1) turned does point to (−1, 3)
        turned = v.copy()
        self.play(turned.animate.shift(pout.c2p(0, 0) - pin.c2p(0, 0)), run_time=d * 0.3)
        self.play(Rotate(turned, PI / 2, about_point=pout.c2p(0, 0)), run_time=d * 0.45)
        tl = bg(M("(−1, 3)", 26)).next_to(turned.get_end(), UP, buff=0.1)
        self.play(FadeIn(tl), run_time=min(0.5, d * 0.15))
        self.pause(1.5)                                  # ⏸ read the check

    # ------------------------------------------------------------------------------------------------
    def measurements(self):
        q = oblique((-4.6, -2.2), 1.0, 1.0, (-0.5, -0.4))
        axes = VGroup(*[Arrow(q(0, 0, 0), q(*e), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15)
                        for e in ((2.2, 0, 0), (0, 2.5, 0), (0, 0, 2.2))])
        axl = VGroup(M("<i>x</i><sub>1</sub>", 24, C_DIM).next_to(axes[0].get_end(), RIGHT, buff=0.06),
                     M("<i>x</i><sub>2</sub>", 24, C_DIM).next_to(axes[1].get_end(), UP, buff=0.06),
                     M("<i>x</i><sub>3</sub>", 24, C_DIM).next_to(axes[2].get_end(), DL, buff=0.04))
        floor = VGroup(*[Line(q(i, 0, 0), q(i, 0, 2), color=C_GRID, stroke_width=1.5) for i in range(3)],
                       *[Line(q(0, 0, k), q(2, 0, k), color=C_GRID, stroke_width=1.5) for k in range(3)])
        tin = P(f"input ℝ<sup>3</sup>: three measurements (<i>x</i>{sub(1)}, <i>x</i>{sub(2)}, <i>x</i>{sub(3)})",
                22, C_DIM).move_to([-3.6, 1.78, 0])
        pout, _ = panel_r(RIGHT_C + RIGHT * 0.2, "", (-2, 3), (-3, 4))
        tout = P("output ℝ<sup>2</sup>", 22, C_DIM).next_to(pout, UP, buff=0.15)
        arc, alab = map_arrow([P("mean,", 22), P("last − first", 22)], y=-0.2)
        F = matrix_mob([["⅓", "⅓", "⅓"], ["−1", "0", "1"]], size=32)
        F_grp = VGroup(M("<i>F</i> =", 32), F).arrange(RIGHT, buff=0.2).move_to(np.array([-0.1, -2.5, 0]))
        slots = VGroup(*[DashedVMobject(SurroundingRectangle(VGroup(F.entries[0][j], F.entries[1][j]), buff=0.08,
                                                             color=C_DIM, stroke_width=2), num_dashes=16)
                         for j in range(3)])
        d = self.say()                                   # different sizes
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.6)
        self.play(FadeIn(floor), FadeIn(axes), FadeIn(axl), FadeIn(tin), Create(pout), FadeIn(tout),
                  run_time=min(1.4, max(0.6, d - 0.7)))
        d = self.say()                                   # three measurements, two numbers
        self.play(Indicate(tin, color=WHITE, scale_factor=1.04), run_time=d * 0.45)
        self.play(Indicate(tout, color=WHITE, scale_factor=1.1), run_time=d * 0.45)
        d = self.say()                                   # mean, and last minus first
        self.play(Create(arc), FadeIn(alab), run_time=min(1.2, d))
        d = self.say()                                   # linear
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # three columns, one for each input axis
        self.play(FadeIn(F_grp[0]), FadeIn(VGroup(F[0], F[2])), Create(slots), run_time=min(1.4, d))

        E = [(1, 0, 0), (0, 1, 0), (0, 0, 1)]
        imgs = [(1 / 3, -1), (1 / 3, 0), (1 / 3, 1)]
        ein = VGroup(*[Arrow(q(0, 0, 0), q(*e), buff=0, color=WHITE, stroke_width=5, tip_length=0.18) for e in E])
        einl = VGroup(*[bg(M(f"<b>e</b><sub>{k + 1}</sub>", 24)) for k in range(3)])
        einl[0].next_to(ein[0].get_end(), DOWN, buff=0.08)
        einl[1].next_to(ein[1].get_end(), LEFT, buff=0.08)
        einl[2].next_to(ein[2].get_end(), DOWN, buff=0.08)
        fout = VGroup(*[Arrow(pout.c2p(0, 0), pout.c2p(*v), buff=0, color=WHITE, stroke_width=5, tip_length=0.15,
                              max_tip_length_to_length_ratio=0.4) for v in imgs])
        foutl = VGroup(*[bg(M(f"<i>f</i>(<b>e</b><sub>{k + 1}</sub>)", 24)).next_to(fout[k].get_end(), RIGHT, buff=0.1)
                         for k in range(3)])
        txt = MM("<i>f</i>(<b>e</b><sub>1</sub>) = (⅓, −1),   <i>f</i>(<b>e</b><sub>2</sub>) = (⅓, 0),   "
                 "<i>f</i>(<b>e</b><sub>3</sub>) = (⅓, 1)", 30).move_to([0, 3.4, 0])
        tparts = [pick(txt, "f(e1)=(⅓,−1),"), pick(txt, "f(e2)=(⅓,0),"), pick(txt, "f(e3)=(⅓,1)")]
        chk = MM("<i>F</i>(3, 6, 12) = (7, 9)", 30).move_to([0, 2.75, 0])
        dims = M("2 × 3", 28, C_DIM).next_to(F_grp, DOWN, buff=0.15)

        def column(k, rt):
            self.play(GrowArrow(ein[k]), FadeIn(einl[k]), run_time=rt * 0.3)
            self.play(TransformFromCopy(ein[k], fout[k]), FadeIn(foutl[k]), FadeIn(tparts[k]), run_time=rt * 0.35)
            self.play(FadeOut(slots[k]), FadeIn(VGroup(F.entries[0][k], F.entries[1][k])), run_time=rt * 0.25)

        d = self.say()                                   # e one: mean a third, difference minus one
        column(0, d)
        d = self.say()                                   # e two and e three the same way
        column(1, d * 0.5)
        column(2, d * 0.5)
        d = self.say()                                   # two by three
        self.play(FadeIn(dims), run_time=min(0.8, d))
        d = self.say()                                   # two rows: two numbers out
        self.play(Indicate(VGroup(*F.entries[0]), color=WHITE), Indicate(VGroup(*F.entries[1]), color=WHITE),
                  run_time=min(1.2, d))
        d = self.say()                                   # three columns: three in
        self.play(Indicate(ein, color=WHITE, scale_factor=1.1), run_time=min(1.2, d))
        d = self.say()                                   # three, six, twelve: seven and nine
        self.play(FadeIn(pick(chk, "F(3,6,12)")), run_time=d * 0.4)
        self.play(FadeIn(pick(chk, "=(7,9)")), run_time=d * 0.4)
        self.pause(1.5)                                  # ⏸ read the matrix and its check

    # ------------------------------------------------------------------------------------------------
    def shift_and_layer(self):
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        arc, alab = map_arrow([P("<i>g</i>: move every point", 22), P("one unit right", 22)])
        alab.set_x(0)
        o = dot(pin, 0, 0, WHITE, r=0.09)
        oring = Circle(radius=0.2, color=WHITE, stroke_width=3).move_to(o)
        d = self.say()                                   # one more map
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.6)
        self.play(Create(pin), Create(pout), FadeIn(tin), FadeIn(tout), run_time=min(1.2, max(0.5, d - 0.7)))
        d = self.say()                                   # move every point one unit right
        self.play(Create(arc), FadeIn(alab), run_time=min(1.2, d))
        d = self.say()                                   # is that linear?
        self.play(FadeIn(o), Create(oring), run_time=min(0.8, d))
        self.pause(2.0)                                  # ⏸ test it on the zero vector (image hidden)

        img = dot(pout, 1, 0, WHITE, r=0.09)
        imgl = bg(M("(1, 0)", 26)).next_to(img, UR, buff=0.08)
        d = self.say()                                   # zero goes to one, zero
        self.play(TransformFromCopy(o, img), run_time=min(1.2, d * 0.6))
        self.play(FadeIn(imgl), run_time=min(0.6, d * 0.3))
        zr = DashedVMobject(Circle(radius=0.2, color=C_DIM, stroke_width=3), num_dashes=12).move_to(pout.c2p(0, 0))
        d = self.say()                                   # must send zero to zero: not linear
        self.play(Create(zr), run_time=min(0.8, d * 0.4))
        self.play(Indicate(VGroup(img, imgl), color=WHITE, scale_factor=1.3), run_time=min(1.0, d * 0.4))
        aff = VGroup(P("<b>affine map</b>", 26), M("<b>x</b> ↦ <i>W</i><b>x</b> + <b>c</b>: linear, then shift", 32))
        aff.arrange(RIGHT, buff=0.35).move_to([0, 3.2, 0])
        d = self.say()                                   # called affine
        self.play(FadeIn(aff), run_time=min(1.0, d))
        d = self.say()                                   # a layer with a bias
        self.play(Indicate(aff, color=WHITE, scale_factor=1.05), run_time=min(1.4, d * 0.5))
        self.pause(0.6)

        # ---- W h: a combination of W's columns
        W = Rectangle(width=1.3, height=1.95, stroke_color=C_DIM, stroke_width=2, fill_color="#3A4150", fill_opacity=0.6)
        Wg = VGroup(W, Line(W.get_top(), W.get_bottom()).set_stroke("#5B6475", 1),
                    *[Line(W.get_left() + UP * (0.325 - 0.65 * k) * 1, W.get_right() + UP * (0.325 - 0.65 * k))
                      .set_stroke("#5B6475", 1) for k in range(2)])
        hcol = column_vec(["<i>h</i><sub>1</sub>", "<i>h</i><sub>2</sub>"], size=30, v_buff=0.6)
        blk = VGroup(Wg, hcol).arrange(RIGHT, buff=0.3).move_to([-4.3, -0.4, 0])
        Wl = M("<i>W</i>", 32).next_to(Wg, UP, buff=0.2)
        hl = M("<b>h</b>", 32).next_to(hcol, UP, buff=0.2)
        q = oblique((2.2, -2.3), 0.8, 0.8, (-0.45, -0.36))
        axes = VGroup(*[Arrow(q(0, 0, 0), q(*e), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15)
                        for e in ((4.2, 0, 0), (0, 3.6, 0), (0, 0, 3.0))])
        W1, W2 = (2, 0, 1), (0, 2, 1)
        w1 = Arrow(q(0, 0, 0), q(*W1), buff=0, color=WHITE, stroke_width=5, tip_length=0.2)
        w2 = Arrow(q(0, 0, 0), q(*W2), buff=0, color=GREY, stroke_width=5, tip_length=0.2)
        w1l = bg(M("<b>w</b><sub>1</sub>", 26)).next_to(w1.get_end(), DOWN, buff=0.1)
        w2l = bg(M("<b>w</b><sub>2</sub>", 26, GREY)).next_to(w2.get_end(), LEFT, buff=0.1)
        strips = VGroup(*[Rectangle(width=0.55, height=1.95, stroke_color=c, stroke_width=2.5, fill_color=c,
                                    fill_opacity=0.15) for c in (WHITE, GREY)])
        strips[0].move_to(W).shift(LEFT * 0.5)
        strips[1].move_to(W).shift(RIGHT * 0.5)
        comb = VGroup(Arrow(q(0, 0, 0), q(*W1), buff=0, color=WHITE, stroke_width=4, tip_length=0.18),
                      Arrow(q(*W1), q(2, 2, 2), buff=0, color=GREY, stroke_width=4, tip_length=0.18))
        cdot = Dot(q(2, 2, 2), radius=0.08, color=WHITE)
        expr = MM("<i>W</i><b>h</b> = <i>h</i><sub>1</sub><b>w</b><sub>1</sub> + <i>h</i><sub>2</sub><b>w</b><sub>2</sub>",
                  34).move_to([0, 3.0, 0])
        span = Polygon(*[q(*(s * np.array(W1) + t * np.array(W2))) for s, t in ((-0.4, -0.3), (1.6, -0.3), (1.6, 1.5),
                                                                                 (-0.4, 1.5))],
                       stroke_width=0, fill_color=C_U, fill_opacity=0.16)
        spl = P("span of the columns", 24, C_U).next_to(span, UP, buff=0.1).shift(RIGHT * 0.6)
        d = self.say()                                   # W times h: a combination of W's columns
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.6)
        self.play(FadeIn(Wg), FadeIn(hcol), FadeIn(Wl), FadeIn(hl), FadeIn(axes), run_time=d * 0.15)
        self.play(ReplacementTransform(Wg, strips), run_time=d * 0.15)
        self.play(TransformFromCopy(strips[0], w1), TransformFromCopy(strips[1], w2), FadeIn(w1l), FadeIn(w2l),
                  run_time=d * 0.2)
        self.play(FadeIn(pick(expr, "Wh=")), TransformFromCopy(hcol.entries[0][0], pick(expr, "h1")),
                  TransformFromCopy(hcol.entries[1][0], pick(expr, "h2")), FadeIn(pick(expr, "w1")),
                  FadeIn(pick(expr, "+")), FadeIn(pick(expr, "w2")), run_time=d * 0.2)
        self.play(GrowArrow(comb[0]), run_time=d * 0.1)
        self.play(GrowArrow(comb[1]), FadeIn(cdot), run_time=d * 0.1)
        d = self.say()                                   # a statement about the span of those columns
        self.play(FadeIn(span), FadeIn(spl), run_time=min(1.4, d * 0.4))
        self.play(Indicate(VGroup(w1, w2), color=WHITE, scale_factor=1.05), run_time=min(1.2, d * 0.35))
