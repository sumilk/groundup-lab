"""LA01 v3 — Act 7: Worlds inside worlds (subspace, closure, intersection, sum, dimension of a sum, direct sum,
affine set, affine / convex combination, affine span, convex hull, bias and centring)."""
from common import *
from v3_act1 import Slider, fmt

RX = 6.75
A3 = np.array([1.0, 0.0, 1.0])     # drone move a (blue)
B3 = np.array([0.0, 1.0, 1.0])     # drone move b (gold)


def at_left(mob, x, y):
    return mob.move_to(np.array([x, y, 0]), aligned_edge=LEFT)


def fit(mob, width, edge=LEFT):
    """Shrink to a width, keeping the left edge where at_left() put it (edge=None: about the centre)."""
    if mob.width > width:
        if edge is None:
            mob.scale_to_fit_width(width)
        else:
            mob.scale_to_fit_width(width, about_edge=edge)
    return mob


def hl(mob, color=WHITE, buff=0.08):
    return SurroundingRectangle(mob, color=color, buff=buff, corner_radius=0.06, stroke_width=2.5)


def f1(x):
    """One-decimal number with a true minus sign, trailing .0 dropped."""
    s = fmt(x)
    return s[:-2] if s.endswith(".0") else s


class Proj:
    """Fixed orthographic view of 3-D space drawn inside an ordinary 2-D scene."""

    def __init__(self, origin, unit, th=32, ph=24):
        self.o = np.array([origin[0], origin[1], 0.0])
        self.u = unit
        t, p = np.radians(th), np.radians(ph)
        self.ex = np.array([-np.sin(t), -np.cos(t) * np.sin(p), 0])
        self.ey = np.array([np.cos(t), -np.sin(t) * np.sin(p), 0])
        self.ez = np.array([0, np.cos(p), 0])

    def __call__(self, *P):
        if len(P) == 1:
            P = P[0]
        x, y, z = P
        return self.o + self.u * (x * self.ex + y * self.ey + z * self.ez)

    def arrow(self, a, b=None, color=WHITE, width=5, tip=0.2):
        if b is None:
            a, b = (0, 0, 0), a
        return Arrow(self(a), self(b), buff=0, color=color, stroke_width=width, tip_length=tip,
                     max_tip_length_to_length_ratio=0.25)

    def dashed(self, a, b, color=WHITE, width=3):
        return DashedLine(self(a), self(b), color=color, stroke_width=width, dash_length=0.08)

    def patch(self, o, d1, d2, r1, r2, color, op=0.2, stroke=1.5):
        o, d1, d2 = map(np.array, (o, d1, d2))
        pts = [o + r1[i] * d1 + r2[j] * d2 for i, j in ((0, 0), (1, 0), (1, 1), (0, 1))]
        return Polygon(*[self(q) for q in pts], stroke_color=color, stroke_width=stroke,
                       stroke_opacity=0.8).set_fill(color, op)

    def axes(self, L=2.5, neg=1.0):
        g = VGroup()
        for d, n in ((np.array([1, 0, 0]), "x"), (np.array([0, 1, 0]), "y"), (np.array([0, 0, 1]), "z")):
            g.add(Line(self(-neg * d), self(L * d), color="#5B6475", stroke_width=2))
            g.add(M(f"<i>{n}</i>", 22, C_DIM).move_to(self((L + 0.35) * d)))
        return g

    def line(self, d, t0, t1, color, width=4):
        d = np.array(d, dtype=float)
        return Line(self(t0 * d), self(t1 * d), color=color, stroke_width=width)


class V3Act7(NScene):
    BEATS = [
        # 0
        "Act seven. Worlds inside worlds.",
        # 1
        "Remember the tilted sheet the drone could reach? It has a lovely property.",
        # 2
        "Add any two points on it, and you stay on it.",
        # 3
        "Scale any point on it, and you stay on it.",
        # 4
        "It's a closed world: what happens on the sheet stays on the sheet.",
        # 5
        "A set like that, which contains home and is closed under adding and scaling, is called a subspace.",
        # 6
        "It's a vector space living inside a bigger one.",
        # 7
        "Here's how to test a set. Does it contain home? Is it closed under adding? Is it closed under scaling?",
        # 8
        "A line through home passes all three.",
        # 9
        "Slide that line up a little and it misses home, so it fails immediately.",
        # 10
        "A half-plane fails because you can't flip a move and stay inside.",
        # 11
        "And here's a sneaky one: the two axes together.",
        # 12
        "Each axis is fine on its own, but one step right plus one step up lands you off both axes.",
        # 13
        "Gluing two subspaces together doesn't give you a subspace.",
        # 14
        "SLOW|Let's run the test on a set described by an equation: all points where x plus two y minus z equals zero.",
        # 15
        "SLOW|Home satisfies it.",
        # 16
        "SLOW|If two points satisfy it, adding the two equations shows their sum does too.",
        # 17
        "SLOW|And multiplying the equation by any number shows every scaled point does too.",
        # 18
        "Three ticks: it's a subspace.",
        # 19
        "SLOW|And now we can see which one. Solve for z, and every point is x times one, zero, one, plus y times "
        "zero, one, two.",
        # 20
        "SLOW|So this subspace is the span of those two moves, a plane through home.",
        # 21
        "That's no accident: in finite dimensions, every subspace is the span of some list of moves.",
        # 22
        "Subspace emphasises the place; span emphasises the moves that build it.",
        # 23
        "So how do you combine two subspaces properly? Two ways.",
        # 24
        "Their overlap, the points in both, is always a subspace. That's the intersection.",
        # 25
        "And instead of gluing them, you can let yourself use moves from both: anything you get by taking a move "
        "from the first and a move from the second and adding them.",
        # 26
        "That's the sum of the two subspaces, and it's the smallest subspace that contains both.",
        # 27
        "How big is the sum? The floor has two directions, the wall has two, but they share one: the line where "
        "they meet.",
        # 28
        "Count naively and you get four.",
        # 29
        "But you counted the shared line twice, so subtract it once: three.",
        # 30
        "SLOW|That's the dimension formula for a sum, and it's exactly the same idea as counting people in two "
        "overlapping clubs.",
        # 31
        "Now compare two situations. The floor plus a vertical line: they share only home.",
        # 32
        "Every point in space splits in exactly one way, a floor part plus a vertical part.",
        # 33
        "But the floor plus the wall share a whole line, and now points can be split in many ways,",
        # 34
        "because you can slide a bit of the shared direction from one part to the other.",
        # 35
        "When two subspaces share only home, so every split is unique, we call their sum a direct sum, written "
        "with a plus inside a circle.",
        # 36
        "SLOW|In symbols, the sum of U and Y is everything of the form u plus w, with u from U and w from Y.",
        # 37
        "SLOW|And here's why sharing only home forces a unique split.",
        # 38
        "SLOW|Suppose some vector had two splits.",
        # 39
        "SLOW|Rearrange, and u minus u prime equals w prime minus w.",
        # 40
        "SLOW|The left side lives in U. The right side lives in Y.",
        # 41
        "SLOW|So that vector lives in both, and the only thing in both is home.",
        # 42
        "SLOW|So the two splits were the same.",
        # 43
        "The overlap is exactly the slack.",
        # 44
        "SLOW|With numbers: split three, four, five between a plane U and a line Y that meets it only at home.",
        # 45
        "SLOW|Write the unknown amounts, get three equations,",
        # 46
        "SLOW|and use a neat trick: add all three, and you get twice the total, so the total is six.",
        # 47
        "SLOW|Subtract each equation from that, and the amounts fall out: one, three and two.",
        # 48
        "SLOW|So the plane part is one, four, three, and the line part is two, zero, two.",
        # 49
        "They add up to three, four, five, and because U and Y share only home, that's the only split there is.",
        # 50
        "And here's a consequence you can now prove in your head. Two planes through home in three-dimensional "
        "space must share at least a line.",
        # 51
        "SLOW|Their sum can be at most three-dimensional, so the overlap must make up the difference.",
        # 52
        "Some flat worlds don't pass through home at all.",
        # 53
        "Think of a shelf on a wall, parallel to the floor but lifted off it.",
        # 54
        "The floor is a subspace. The shelf is that same subspace, shifted.",
        # 55
        "That's called an affine set: a translated subspace.",
        # 56
        "It need not pass through home, though it may, if the shift happens to lie inside the subspace.",
        # 57
        "Shelves have their own rules. Add two books on the shelf and you fall off: the sum is too high.",
        # 58
        "But average them, and you stay on the shelf.",
        # 59
        "In fact, any mix whose amounts add up to one stays on the shelf. That kind of mix is called an affine "
        "combination.",
        # 60
        "If the amounts are also never negative, you stay between the two books, and that's a convex combination.",
        # 61
        "The whole line through the books is their affine span. The stretch of shelf between them is their "
        "convex hull.",
        # 62
        "SLOW|Here's the precise version. The shelf, x plus y equals one, is the point one, zero, plus the line "
        "spanned by minus one, one.",
        # 63
        "SLOW|Every point on it is one minus t, t.",
        # 64
        "SLOW|Now take any mix of points on a shelf, each written as the anchor plus something in the floor.",
        # 65
        "SLOW|The mix equals the sum of the amounts, times the anchor, plus a mix of floor moves, which stays in "
        "the floor.",
        # 66
        "SLOW|So if the amounts add to one, you get exactly one copy of the anchor and you stay on the shelf.",
        # 67
        "SLOW|If they add to two, you land on a shelf twice as high.",
        # 68
        "SLOW|If they add to zero, you fall to the floor.",
        # 69
        "That's why averages are safe and sums aren't.",
        # 70
        "Two places you'll meet this in practice. A bias term in a network, W x plus b, shifts every output by "
        "the same vector b.",
        # 71
        "And when you subtract the mean of a dataset, you're moving the shelf back down to the floor.",
        # 72
        "Before centring, every data point is an arrow pointing roughly the same way, toward the cloud.",
        # 73
        "After centring, the arrows show how the data varies around its mean.",
        # 74
        "For a method like P C A, that's exactly the point: centring lets you study variation around the mean, "
        "rather than the cloud's offset from home.",
        # 75
        "It doesn't make the cloud spread into every direction; it just puts home at its centre.",
    ]

    def fade_all(self, keep=(), run_time=0.6):
        mobs = [m for m in self.mobjects if m not in keep]
        if mobs:
            self.play(*[FadeOut(m) for m in mobs], run_time=run_time)

    def construct(self):
        grp, bar, header = section_card(self, "Act 7", "Worlds inside worlds",
                                        "Which sets are worlds of their own?")
        self.say()
        self.until_end(0.6)
        to_header(self, grp, bar, header)
        keep = (header,)

        # ============================================================ 7.1 a closed world
        pj = Proj((-3.4, -0.45), 0.82)
        self.say()
        ax = pj.axes(L=2.6, neg=1.2)
        sheet = pj.patch((0, 0, 0), A3, B3, (-1.6, 1.6), (-1.6, 1.6), C_P, 0.22)
        home = Dot(pj(0, 0, 0), radius=0.06, color=WHITE)
        aa = pj.arrow(A3, color=C_U, width=6)
        bb = pj.arrow(B3, color=C_V, width=6)
        al = M("<i>a</i>", 26, C_U).next_to(aa.get_end(), DOWN, buff=0.1)
        bl = M("<i>b</i>", 26, C_V).next_to(bb.get_end(), RIGHT, buff=0.1)
        self.play(Create(ax), FadeIn(home), run_time=0.8)
        self.play(GrowArrow(aa), GrowArrow(bb), FadeIn(al), FadeIn(bl), run_time=0.8)
        self.play(FadeIn(sheet), run_time=1.0)
        self.until_end()

        # 2 — sums stay on the sheet
        self.say()
        P_ = 1.0 * A3 + 0.5 * B3
        Q_ = -0.5 * A3 + 1.0 * B3
        pa = pj.arrow(P_, color=WHITE, width=4)
        qa = pj.arrow(Q_, color=WHITE, width=4)
        qa2 = pj.arrow(P_, P_ + Q_, color=WHITE, width=3)
        sa = pj.arrow(P_ + Q_, color=C_W, width=5)
        sd = Dot(pj(P_ + Q_), radius=0.08, color=C_W)
        r1 = T("add two points: still on the sheet ✓", 24, C_W)
        at_left(r1, 0.6, 1.6)
        self.play(GrowArrow(pa), GrowArrow(qa), run_time=0.8)
        self.play(TransformFromCopy(qa, qa2), run_time=0.7)
        self.play(GrowArrow(sa), FadeIn(sd), FadeIn(r1), run_time=0.8)
        self.until_end()

        # 3 — scaling stays on the sheet
        self.say()
        self.play(FadeOut(VGroup(qa, qa2, sa, sd)), run_time=0.4)
        c = ValueTracker(1.0)
        sc = always_redraw(lambda: pj.arrow(c.get_value() * P_, color=WHITE, width=4)
                           if abs(c.get_value()) > 0.05 else Dot(pj(0, 0, 0), radius=0.06))
        trail = pj.line(P_, -1.0, 1.5, C_W, 3).set_opacity(0.7)
        r2 = T("scale a point: still on the sheet ✓", 24, C_W)
        at_left(r2, 0.6, 1.0)
        self.remove(pa)
        self.add(sc)
        self.play(c.animate.set_value(1.5), run_time=1.0)
        self.play(c.animate.set_value(-1.0), Create(trail), run_time=1.4)
        self.play(c.animate.set_value(1.0), FadeIn(r2), run_time=0.8)
        self.until_end()

        # 4 — closed
        self.say()
        closed = T("closed", 40, C_P, weight=BOLD).move_to(pj(1.4, 1.4, 2.8) + UP * 0.2)
        self.play(sheet.animate.set_fill(C_P, 0.45), FadeIn(closed, scale=1.3), run_time=0.9)
        self.play(sheet.animate.set_fill(C_P, 0.22), run_time=0.8)
        self.until_end()

        # 5 — subspace
        self.say()
        sub = T("subspace", 40, C_P, weight=BOLD)
        at_left(sub, 0.6, -0.1)
        subd = VGroup(T("• contains home", 26, WHITE), T("• closed under adding", 26, WHITE),
                      T("• closed under scaling", 26, WHITE)).arrange(DOWN, buff=0.15, aligned_edge=LEFT)
        at_left(subd, 0.75, -1.35)
        self.play(Write(sub), run_time=0.9)
        for r in subd:
            self.play(FadeIn(r, shift=RIGHT * 0.15), run_time=0.5)
            self.wait(0.3)
        self.play(Indicate(home, scale_factor=2), run_time=0.7)
        self.until_end()

        # 6 — a vector space inside a bigger one
        self.say()
        insd = T("a vector space living inside a bigger one", 24, C_DIM)
        at_left(insd, 0.6, -2.6)
        self.play(FadeIn(insd), run_time=0.7)
        self.until_end()
        sc.clear_updaters()
        self.fade_all(keep)

        # ============================================================ 7.2 three ways to fail
        tc = [np.array([-5.1, 1.1, 0]), np.array([-2.0, 1.1, 0]),
              np.array([-5.1, -1.85, 0]), np.array([-2.0, -1.85, 0])]
        tiles = [plane((-2, 2), (-2, 2), unit=0.52).move_to(t) for t in tc]

        def cap(i, s, color):
            t = P(s, 21, color)
            fit(t, 2.9)
            return t.next_to(tiles[i], DOWN, buff=0.12)

        def mark(i, ok):
            return T("✓" if ok else "✗", 30, C_W if ok else C_X, weight=BOLD).next_to(
                tiles[i].get_corner(UR), DL, buff=0.06)

        # 7 — the checklist
        self.say()
        chkt = T("Is it a subspace?", 28, WHITE, weight=BOLD)
        at_left(chkt, 0.6, 2.45)
        chk = VGroup(T("1 · contains home?", 26, C_U), T("2 · closed under adding?", 26, C_U),
                     T("3 · closed under scaling?", 26, C_U)).arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        at_left(chk, 0.75, 1.3)
        self.play(FadeIn(chkt), run_time=0.5)
        for r in chk:
            self.play(FadeIn(r, shift=RIGHT * 0.15), run_time=0.5)
            self.wait(0.7)
        self.until_end()

        # 8 — a line through home
        self.say()
        t0 = tiles[0]
        ln0 = Line(t0.c2p(-2 / 3, -2), t0.c2p(2 / 3, 2), color=C_P, stroke_width=4)
        self.play(Create(t0, lag_ratio=0.02), Create(ln0), run_time=0.8)
        p1 = Arrow(t0.c2p(0, 0), t0.c2p(0.3, 0.9), buff=0, color=C_U, stroke_width=4, tip_length=0.12)
        p2 = Arrow(t0.c2p(0.3, 0.9), t0.c2p(0.55, 1.65), buff=0, color=C_V, stroke_width=4, tip_length=0.12)
        p3 = Arrow(t0.c2p(0, 0), t0.c2p(-0.45, -1.35), buff=0, color=C_W, stroke_width=4, tip_length=0.12)
        self.play(GrowArrow(p1), run_time=0.4)
        self.play(GrowArrow(p2), run_time=0.4)
        self.play(GrowArrow(p3), run_time=0.4)
        c0 = cap(0, "line through home", C_W)
        m0 = mark(0, True)
        self.play(FadeIn(c0), FadeIn(m0), run_time=0.5)
        self.until_end()

        # 9 — shifted line
        self.say()
        t1 = tiles[1]
        ln1 = Line(t1.c2p(-1, -2), t1.c2p(1 / 3, 2), color=C_P, stroke_width=4)
        hm = Circle(radius=0.12, color=C_X, stroke_width=3).move_to(t1.c2p(0, 0))
        self.play(Create(t1, lag_ratio=0.02), run_time=0.6)
        self.play(TransformFromCopy(ln0, ln1), run_time=0.9)
        self.play(Create(hm), run_time=0.5)
        c1 = cap(1, "shifted up: no home", C_X)
        m1 = mark(1, False)
        self.play(FadeIn(c1), FadeIn(m1), Indicate(chk[0], color=C_X), run_time=0.7)
        self.until_end()

        # 10 — half-plane
        self.say()
        t2 = tiles[2]
        hp = Polygon(t2.c2p(0, -2), t2.c2p(2, -2), t2.c2p(2, 2), t2.c2p(0, 2), stroke_width=0).set_fill(C_P, 0.3)
        self.play(Create(t2, lag_ratio=0.02), FadeIn(hp), run_time=0.7)
        v2 = Arrow(t2.c2p(0, 0), t2.c2p(1.2, 0.9), buff=0, color=C_W, stroke_width=4, tip_length=0.12)
        mv2 = Arrow(t2.c2p(0, 0), t2.c2p(-1.2, -0.9), buff=0, color=C_X, stroke_width=4, tip_length=0.12)
        self.play(GrowArrow(v2), run_time=0.5)
        self.play(TransformFromCopy(v2, mv2), run_time=0.8)
        c2 = cap(2, "half-plane: can't flip", C_X)
        m2 = mark(2, False)
        self.play(FadeIn(c2), FadeIn(m2), Indicate(chk[2], color=C_X), run_time=0.7)
        self.until_end()

        # 11 — two axes
        self.say()
        t3 = tiles[3]
        axs = VGroup(Line(t3.c2p(-2, 0), t3.c2p(2, 0), color=C_P, stroke_width=5),
                     Line(t3.c2p(0, -2), t3.c2p(0, 2), color=C_P, stroke_width=5))
        self.play(Create(t3, lag_ratio=0.02), run_time=0.5)
        self.play(Create(axs), run_time=0.9)
        self.until_end()

        # 12 — sums escape
        self.say()
        e1 = Arrow(t3.c2p(0, 0), t3.c2p(1, 0), buff=0, color=C_U, stroke_width=4, tip_length=0.12)
        e2 = Arrow(t3.c2p(1, 0), t3.c2p(1, 1), buff=0, color=C_V, stroke_width=4, tip_length=0.12)
        esc = Dot(t3.c2p(1, 1), radius=0.08, color=C_X)
        self.play(GrowArrow(e1), run_time=0.6)
        self.play(GrowArrow(e2), run_time=0.6)
        self.play(FadeIn(esc, scale=2), run_time=0.4)
        c3 = cap(3, "two axes: sums escape", C_X)
        m3 = mark(3, False)
        self.play(FadeIn(c3), FadeIn(m3), Indicate(chk[1], color=C_X), run_time=0.7)
        self.until_end()

        # 13 — gluing fails
        self.say()
        glue = VGroup(T("gluing two subspaces together", 24, C_X),
                      T("doesn't give a subspace", 24, C_X)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        at_left(glue, 0.6, -0.6)
        self.play(FadeIn(glue), Circumscribe(VGroup(t3, c3), color=C_X), run_time=1.2)
        self.until_end()
        self.fade_all(keep + (chkt, chk))
        self.play(chkt.animate.scale(0.85).move_to(np.array([-6.5, 2.45, 0]), aligned_edge=LEFT),
                  chk.animate.scale(0.85).move_to(np.array([-6.4, 1.55, 0]), aligned_edge=LEFT), run_time=0.7)

        # 14 — Y = {x + 2y − z = 0}
        self.say()
        X0 = 0.4
        Ydef = M("<i>Y</i> = { (<i>x</i>, <i>y</i>, <i>z</i>) : <i>x</i> + 2<i>y</i> − <i>z</i> = 0 }", 30, WHITE)
        at_left(Ydef, X0, 2.45)
        tagp = T("PRECISE", 20, C_V, weight=BOLD).next_to(Ydef, UP, buff=0.12).align_to(Ydef, LEFT)
        self.play(FadeIn(tagp), Write(Ydef), run_time=1.4)
        self.until_end(0.8)

        def tick(i):
            t = T("✓", 26, C_W, weight=BOLD).next_to(chk[i], RIGHT, buff=0.2)
            return t

        # 15 — home
        self.say()
        L1 = M("1.  0 + 0 − 0 = 0  ✓", 28, WHITE)
        at_left(L1, X0, 1.65)
        self.play(Write(L1), run_time=1.0)
        tk0 = tick(0)
        self.play(FadeIn(tk0), chk[0].animate.set_color(WHITE), run_time=0.5)
        self.until_end(0.8)

        # 16 — sums
        self.say()
        L2a = M("2.  <i>x</i> + 2<i>y</i> − <i>z</i> = 0  and  <i>x</i>′ + 2<i>y</i>′ − <i>z</i>′ = 0", 26, WHITE)
        L2b = M("add:  (<i>x</i> + <i>x</i>′) + 2(<i>y</i> + <i>y</i>′) − (<i>z</i> + <i>z</i>′) = 0  ✓", 26, WHITE)
        at_left(L2a, X0, 0.95)
        at_left(L2b, X0 + 0.45, 0.4)
        fit(L2a, RX - X0)
        fit(L2b, RX - X0 - 0.45)
        self.play(Write(L2a), run_time=1.4)
        self.play(Write(L2b), run_time=1.5)
        tk1 = tick(1)
        self.play(FadeIn(tk1), chk[1].animate.set_color(WHITE), run_time=0.5)
        self.until_end(1.0)

        # 17 — scaling
        self.say()
        L3 = M("3.  <i>cx</i> + 2(<i>cy</i>) − <i>cz</i> = <i>c</i> · 0 = 0  ✓", 28, WHITE)
        at_left(L3, X0, -0.3)
        self.play(Write(L3), run_time=1.4)
        tk2 = tick(2)
        self.play(FadeIn(tk2), chk[2].animate.set_color(WHITE), run_time=0.5)
        self.until_end(1.0)

        # 18 — subspace
        self.say()
        ok = T("three ticks: Y is a subspace", 28, C_W, weight=BOLD)
        at_left(ok, X0, -1.05)
        self.play(FadeIn(ok, shift=UP * 0.1), run_time=0.7)
        self.until_end()

        # 19 — solve for z
        self.say()
        self.play(FadeOut(VGroup(L1, L2a, L2b, L3, ok, chkt, chk, tk0, tk1, tk2)), run_time=0.5)
        S1 = M("<i>z</i> = <i>x</i> + 2<i>y</i>", 30, WHITE)
        S2 = M("(<i>x</i>, <i>y</i>, <i>x</i> + 2<i>y</i>) = <i>x</i>(1, 0, 1) + <i>y</i>(0, 1, 2)", 30, WHITE)
        at_left(S1, X0, 1.6)
        at_left(S2, X0, 0.9)
        fit(S2, RX - X0)
        self.play(Write(S1), run_time=1.0)
        self.wait(0.5)
        self.play(Write(S2), run_time=1.8)
        self.until_end(1.0)

        # 20 — span: a plane through home
        self.say()
        S3 = boxed(M("<i>Y</i> = span{ (1, 0, 1), (0, 1, 2) }", 30, C_P), color=C_P)
        at_left(S3, X0, 0.05)
        pj2 = Proj((-3.5, -0.6), 0.72)
        D2 = np.array([0.0, 1.0, 2.0])
        ax2 = pj2.axes(L=2.4, neg=1.2)
        Yp = pj2.patch((0, 0, 0), A3, D2, (-1.3, 1.3), (-1.0, 1.0), C_P, 0.24)
        y1 = pj2.arrow(A3, color=C_U, width=6)
        y2 = pj2.arrow(D2, color=WHITE, width=6)
        y1l = M("(1, 0, 1)", 22, C_U).next_to(y1.get_end(), DL, buff=0.08)
        y2l = M("(0, 1, 2)", 22, WHITE).next_to(y2.get_end(), RIGHT, buff=0.1)
        self.play(FadeIn(S3, shift=UP * 0.1), Create(ax2), run_time=0.9)
        self.play(GrowArrow(y1), GrowArrow(y2), FadeIn(y1l), FadeIn(y2l), run_time=0.8)
        self.play(FadeIn(Yp), FadeIn(Dot(pj2(0, 0, 0), radius=0.06)), run_time=0.9)
        self.until_end(1.0)

        # 21 — every subspace is a span (finite dimensions)
        self.say()
        fin = VGroup(T("in finite dimensions:", 24, C_DIM),
                     T("every subspace is the span of some list of moves", 24, WHITE)).arrange(
            DOWN, buff=0.12, aligned_edge=LEFT)
        at_left(fin, X0, -1.0)
        fit(fin, RX - X0)
        self.play(FadeIn(fin), run_time=0.8)
        self.until_end()

        # 22 — place vs moves
        self.say()
        sp1 = VGroup(T("every span is a subspace —", 24, C_P),
                     T("the smallest one containing its moves", 24, C_P)).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        at_left(sp1, X0, -2.05)
        sp2 = P("<b>subspace</b>: the place      <b>span</b>: the moves that build it", 24, WHITE)
        at_left(sp2, X0, -2.95)
        fit(sp2, RX - X0)
        self.play(FadeIn(sp1), run_time=0.7)
        self.play(FadeIn(sp2), run_time=0.7)
        self.until_end()
        self.fade_all(keep)

        # ============================================================ 7.3 combining two worlds
        pf = Proj((-3.55, -0.95), 0.66)
        floor = pf.patch((0, 0, 0), (1, 0, 0), (0, 1, 0), (-1.5, 3.5), (-1.5, 4.5), C_U, 0.16)
        wall = pf.patch((0, 0, 0), (0, 1, 0), (0, 0, 1), (-1.5, 4.5), (-1.5, 5.5), C_V, 0.16)
        ax3 = pf.axes(L=4.0, neg=1.5)
        home3 = Dot(pf(0, 0, 0), radius=0.06, color=WHITE)
        fl = T("floor U  (z = 0)", 22, C_U).move_to(pf(3.3, -0.3, 0) + DOWN * 0.35)
        wl = T("wall Y  (x = 0)", 22, C_V).move_to(pf(0, -0.4, 5.4) + UP * 0.2)

        # 23 — two subspaces
        self.say()
        self.play(Create(ax3), FadeIn(home3), run_time=0.7)
        self.play(FadeIn(floor), FadeIn(fl), run_time=0.7)
        self.play(FadeIn(wall), FadeIn(wl), run_time=0.7)
        two = T("two ways to combine", 26, WHITE)
        at_left(two, 0.6, 2.45)
        self.play(FadeIn(two), run_time=0.5)
        self.until_end()

        # 24 — intersection
        self.say()
        meet = pf.line((0, 1, 0), -1.5, 4.5, C_W, 6)
        inter = P("<b>intersection</b>  U ∩ Y: the points in both", 26, C_W)
        at_left(inter, 0.6, 1.75)
        inter2 = T("here: the line where they meet", 22, C_DIM)
        at_left(inter2, 0.6, 1.3)
        fit(inter2, RX - 0.6)
        self.play(Create(meet), run_time=0.9)
        self.play(FadeIn(inter), run_time=0.6)
        self.play(FadeIn(inter2), run_time=0.6)
        self.until_end()

        # 25 — moves from both
        self.say()
        F1 = np.array([2.0, 1.0, 0.0])
        W1 = np.array([0.0, 1.0, 2.0])
        fa = pf.arrow(F1, color=C_U, width=5)
        wa = pf.arrow(W1, color=C_V, width=5)
        wa2 = pf.arrow(F1, F1 + W1, color=C_V, width=4)
        sa3 = pf.arrow(F1 + W1, color=C_W, width=5)
        sd3 = Dot(pf(F1 + W1), radius=0.08, color=C_W)
        mvs = M("(2, 1, 0) + (0, 1, 2) = (2, 2, 2)", 26, WHITE)
        at_left(mvs, 0.6, 0.55)
        mvl = T("a floor move + a wall move", 22, C_DIM)
        at_left(mvl, 0.6, 0.05)
        self.play(GrowArrow(fa), run_time=0.7)
        self.play(GrowArrow(wa), run_time=0.7)
        self.play(TransformFromCopy(wa, wa2), run_time=0.8)
        self.play(GrowArrow(sa3), FadeIn(sd3), Write(mvs), FadeIn(mvl), run_time=1.0)
        self.until_end()

        # 26 — the sum fills space
        self.say()
        sumt = P("<b>sum</b>  U + Y: every floor move + wall move", 26, C_P)
        at_left(sumt, 0.6, -0.75)
        fit(sumt, RX - 0.6)
        rng = np.random.default_rng(4)
        cloud = VGroup(*[Dot(pf(*rng.uniform([-1, -1, -1], [3, 4, 4.5])), radius=0.04, color=C_P)
                         for _ in range(70)])
        allsp = VGroup(T("the smallest subspace containing both", 22, C_DIM),
                       T("here: all of space", 22, C_DIM)).arrange(DOWN, buff=0.08, aligned_edge=LEFT)
        at_left(allsp, 0.6, -1.4)
        self.play(FadeIn(sumt), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(d, scale=0.5) for d in cloud], lag_ratio=0.02), run_time=1.6)
        self.play(FadeIn(allsp), run_time=0.6)
        self.until_end()
        self.play(FadeOut(VGroup(cloud, fa, wa, wa2, sa3, sd3, mvs, mvl, two, inter, inter2, sumt, allsp)), run_time=0.6)

        # 27 — counting directions: floor 2, wall 2, shared 1
        self.say()
        ex_ = pf.arrow((1.6, 0, 0), color=C_U, width=6)
        ey_ = pf.arrow((0, 1.6, 0), color=C_W, width=6)
        ez_ = pf.arrow((0, 0, 1.6), color=C_V, width=6)
        k1 = M("floor U:  2 directions", 26, C_U)
        k2 = M("wall Y:  2 directions", 26, C_V)
        k3 = M("shared line U ∩ Y:  1 direction", 26, C_W)
        ks = VGroup(k1, k2, k3).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        at_left(ks, 0.6, 1.85)
        self.play(GrowArrow(ex_), GrowArrow(ey_), FadeIn(k1), wall.animate.set_fill(C_V, 0.06),
                  run_time=0.8)
        self.wait(0.6)
        self.play(GrowArrow(ez_), Indicate(ey_, color=WHITE), FadeIn(k2), wall.animate.set_fill(C_V, 0.16),
                  floor.animate.set_fill(C_U, 0.06), run_time=0.8)
        self.wait(0.6)
        self.play(floor.animate.set_fill(C_U, 0.16), FadeIn(k3), Indicate(meet, color=WHITE), run_time=0.9)
        self.until_end()

        # 28 — naive count
        self.say()
        n1 = M("2 + 2 = 4 ?", 32, WHITE)
        at_left(n1, 0.6, 0.3)
        self.play(Write(n1), run_time=0.9)
        self.until_end(0.6)

        # 29 — subtract the double count
        self.say()
        dbl = M("×2", 24, C_X).next_to(ey_.get_end(), UR, buff=0.05)
        n2 = M("4 − 1 = 3  ✓", 32, C_W)
        at_left(n2, 0.6, -0.4)
        self.play(FadeIn(dbl), Indicate(k3, color=C_X), run_time=0.9)
        self.play(Write(n2), run_time=0.9)
        self.until_end(1.0)

        # 30 — the formula and the clubs
        self.say()
        frm = boxed(M("dim(U + Y) = dim U + dim Y − dim(U ∩ Y)", 28, WHITE), color=C_W)
        at_left(frm, 0.6, -1.3)
        fit(frm, RX - 0.6)
        ca = Circle(radius=0.55, color=C_U, stroke_width=3).move_to(np.array([2.0, -2.85, 0]))
        cb = Circle(radius=0.55, color=C_V, stroke_width=3).move_to(np.array([2.75, -2.85, 0]))
        clubs = VGroup(ca, cb, M("2", 22, C_U).move_to(np.array([1.72, -2.85, 0])),
                       M("2", 22, C_V).move_to(np.array([3.03, -2.85, 0])),
                       M("1", 22, C_W).move_to(np.array([2.375, -2.85, 0])))
        clt = T("two overlapping clubs:", 22, C_DIM).next_to(cb, RIGHT, buff=0.35).shift(UP * 0.2)
        clt2 = M("2 + 2 − 1 = 3 people", 22, C_DIM).next_to(clt, DOWN, buff=0.1).align_to(clt, LEFT)
        self.play(FadeIn(frm), run_time=0.9)
        self.wait(1.0)
        self.play(FadeIn(clubs), FadeIn(clt), FadeIn(clt2), run_time=0.9)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(ks, n1, n2, frm, clubs, clt, clt2, dbl, ex_, ey_, ez_)), run_time=0.6)

        # 31 — floor + vertical line: share only home
        self.say()
        X = np.array([3.0, 4.0, 5.0])
        vline = pf.line((0, 0, 1), -1.5, 5.6, C_V, 5)
        self.play(FadeOut(wall), FadeOut(wl), FadeOut(meet), run_time=0.6)
        self.play(Create(vline), run_time=0.8)
        vl_l = T("vertical line", 22, C_V).next_to(pf(0, 0, 5.6), RIGHT, buff=0.12)
        only = M("floor ∩ vertical line = {0}", 28, WHITE)
        at_left(only, 0.6, 2.2)
        self.play(FadeIn(vl_l), FadeIn(only), Indicate(home3, scale_factor=2.5), run_time=0.9)
        self.until_end()

        # 32 — unique split of (3, 4, 5)
        self.say()
        xd = Dot(pf(X), radius=0.09, color=C_W)
        xl = M("(3, 4, 5)", 24, C_W).next_to(xd, UP, buff=0.1)
        fpart = pf.arrow((3, 4, 0), color=C_U, width=5)
        vpart = pf.arrow((3, 4, 0), X, color=C_V, width=5)
        vghost = pf.arrow((0, 0, 5), color=C_V, width=3).set_opacity(0.6)
        sp_ = M("(3, 4, 5) = (3, 4, 0) + (0, 0, 5)", 28, WHITE)
        at_left(sp_, 0.6, 1.5)
        one = T("exactly one way", 24, C_W)
        at_left(one, 0.6, 0.95)
        self.play(FadeIn(xd, scale=2), FadeIn(xl), run_time=0.5)
        self.play(GrowArrow(fpart), run_time=0.7)
        self.play(GrowArrow(vpart), FadeIn(vghost), run_time=0.7)
        self.play(Write(sp_), run_time=1.1)
        self.play(FadeIn(one), run_time=0.5)
        self.until_end()

        # 33 — floor + wall: many splits
        self.say()
        s = ValueTracker(4.0)

        def sr():
            return round(s.get_value(), 1)

        def splits():
            v = sr()
            return VGroup(pf.arrow((3, v, 0), color=C_U, width=5),
                          pf.arrow((3, v, 0), X, color=C_V, width=5),
                          pf.arrow((0, 4 - v, 5), color=C_V, width=3).set_opacity(0.6))

        spl = always_redraw(splits)
        live = always_redraw(lambda: M(f"(3, 4, 5) = (3, {f1(sr())}, 0) + (0, {f1(4 - sr())}, 5)", 28, WHITE)
                             .move_to(np.array([0.6, -0.55, 0]), aligned_edge=LEFT))
        wt = M("floor ∩ wall = a whole line", 28, WHITE)
        at_left(wt, 0.6, 0.15)
        self.play(FadeOut(VGroup(vline, vl_l, fpart, vpart, vghost)), FadeIn(wall), FadeIn(wl), FadeIn(meet),
                  run_time=0.8)
        self.add(spl)
        self.play(FadeIn(wt), FadeIn(live), run_time=0.6)
        self.play(s.animate.set_value(2.0), run_time=2.0)
        self.wait(0.8)
        self.play(s.animate.set_value(0.0), run_time=2.0)
        self.until_end()

        # 34 — slide the shared direction
        self.say()
        slack = T("slide along the shared line: the slack", 24, C_W)
        at_left(slack, 0.6, -1.25)
        self.play(Indicate(meet, color=WHITE), FadeIn(slack), run_time=0.9)
        self.play(s.animate.set_value(3.0), run_time=2.2)
        self.play(s.animate.set_value(1.0), run_time=2.2)
        self.until_end()
        self.wait(1.5)     # thinking time on the floor/wall picture before the direct-sum case

        # 35 — direct sum
        self.say()
        ds = VGroup(T("share only home  ⇒  every split unique", 24, C_W),
                    P("⇒  <b>direct sum</b>", 26, C_W)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        at_left(ds, 0.6, -2.05)
        dsym = M("<i>U</i> <span size='x-large'>⊕</span> <i>Y</i>", 44, C_W)
        dsym.next_to(ds[1], RIGHT, buff=0.6)
        self.play(FadeIn(ds), run_time=0.8)
        self.play(Write(dsym), run_time=0.9)
        self.until_end()
        spl.clear_updaters()
        live.clear_updaters()
        self.fade_all(keep)

        # ============================================================ precise: sum, direct sum, theorem
        XP = -6.3
        self.say()
        tagp = T("PRECISE", 20, C_V, weight=BOLD)
        at_left(tagp, XP, 2.75)
        d1 = M("<i>U</i> + <i>Y</i> = { <i>u</i> + <i>w</i> :  <i>u</i> ∈ <i>U</i>,  <i>w</i> ∈ <i>Y</i> }", 30, WHITE)
        at_left(d1, XP, 2.25)
        d2 = M("direct, <i>U</i> <span size='large'>⊕</span> <i>Y</i>:  each vector of <i>U</i> + <i>Y</i> splits as <i>u</i> + <i>w</i> "
               "in exactly one way", 26, C_DIM)
        at_left(d2, XP, 1.65)
        fit(d2, RX - XP)
        self.play(FadeIn(tagp), Write(d1), run_time=1.6)
        self.play(FadeIn(d2), run_time=0.8)
        self.until_end(1.0)

        # 37 — theorem
        self.say()
        th = boxed(M("Theorem:   <i>U</i> + <i>Y</i> is direct   ⇔   <i>U</i> ∩ <i>Y</i> = {0}", 30, WHITE), color=C_W)
        at_left(th, XP, 0.85)
        pr = T("Why ⇐ :", 24, C_V, weight=BOLD)
        at_left(pr, XP, 0.05)
        self.play(FadeIn(th, shift=UP * 0.1), run_time=0.8)
        self.play(FadeIn(pr), run_time=0.5)
        self.until_end(0.8)

        # 38 — two splits
        self.say()
        q1 = M("<i>u</i> + <i>w</i> = <i>u</i>′ + <i>w</i>′", 32, WHITE)
        q1n = T("(u, u′ in U;  w, w′ in Y)", 22, C_DIM)
        at_left(q1, XP + 0.3, -0.65)
        q1n.next_to(q1, RIGHT, buff=0.5)
        self.play(Write(q1), run_time=1.0)
        self.play(FadeIn(q1n), run_time=0.5)
        self.until_end(0.8)

        # 39 — rearrange
        self.say()
        q2l = M("<i>u</i> − <i>u</i>′", 32, C_U)
        q2e = M("=", 32, WHITE)
        q2r = M("<i>w</i>′ − <i>w</i>", 32, C_V)
        q2 = VGroup(q2l, q2e, q2r).arrange(RIGHT, buff=0.25)
        at_left(q2, XP + 0.3, -1.45)
        self.play(TransformFromCopy(q1, q2), run_time=1.4)
        self.until_end(1.0)

        # 40 — left in U, right in Y
        self.say()
        inU = T("in U", 22, C_U).next_to(q2l, DOWN, buff=0.15)
        inY = T("in Y", 22, C_V).next_to(q2r, DOWN, buff=0.15)
        self.play(Indicate(q2l, color=C_U), FadeIn(inU), run_time=0.8)
        self.wait(0.4)
        self.play(Indicate(q2r, color=C_V), FadeIn(inY), run_time=0.8)
        self.until_end(0.6)

        # 41 — so it's in both: home
        self.say()
        q3 = M("so  <i>u</i> − <i>u</i>′ = <i>w</i>′ − <i>w</i>  ∈  <i>U</i> ∩ <i>Y</i> = {0}", 30, WHITE)
        at_left(q3, XP + 0.3, -2.45)
        self.play(Write(q3), run_time=1.6)
        self.until_end(1.0)

        # 42 — the splits were the same
        self.say()
        q4 = M("<i>u</i> = <i>u</i>′,   <i>w</i> = <i>w</i>′  ✓", 32, C_W)
        at_left(q4, XP + 0.3, -3.2)
        self.play(Write(q4), run_time=1.0)
        self.play(Circumscribe(q4, color=C_W), run_time=0.9)
        self.until_end(1.0)

        # 43 — the slack
        self.say()
        slk = T("the overlap is exactly the slack", 26, C_W, slant=ITALIC)
        slk.move_to(np.array([3.6, -3.2, 0]))
        self.play(FadeIn(slk), run_time=0.7)
        self.until_end()
        self.fade_all(keep)

        # ============================================================ worked split (3, 4, 5)
        pw = Proj((-4.2, -1.55), 0.78)
        U1, U2, Yd = np.array([1.0, 1.0, 0.0]), np.array([0.0, 1.0, 1.0]), np.array([1.0, 0.0, 1.0])
        X0 = 0.3
        self.say()
        axw = pw.axes(L=3.2, neg=1.0)
        Upl = pw.patch((0, 0, 0), U1, U2, (-0.6, 1.8), (-0.6, 3.6), C_U, 0.18)
        Yln = pw.line(Yd, -1.2, 3.0, C_V, 5)
        Xw = np.array([3.0, 4.0, 5.0])
        xdw = Dot(pw(Xw), radius=0.09, color=C_W)
        xlw = M("<i>x</i> = (3, 4, 5)", 24, C_W).next_to(xdw, UP, buff=0.1)
        Ul = T("plane U", 22, C_U).move_to(pw(1.8, 1.5, -0.3) + DOWN * 0.3)
        Yl = T("line Y", 22, C_V).next_to(pw(3.0 * Yd), DOWN, buff=0.15)
        w0 = M("<i>U</i> = span{ (1, 1, 0), (0, 1, 1) }", 28, C_U)
        w1 = M("<i>Y</i> = span{ (1, 0, 1) },    <i>x</i> = (3, 4, 5)", 28, C_V)
        at_left(w0, X0, 2.5)
        at_left(w1, X0, 1.95)
        fit(w1, RX - X0)
        self.play(Create(axw), FadeIn(Upl), FadeIn(Ul), FadeIn(Dot(pw(0, 0, 0), radius=0.06)), FadeIn(w0),
                  run_time=1.0)
        self.play(Create(Yln), FadeIn(Yl), FadeIn(w1), run_time=0.9)
        self.play(FadeIn(xdw, scale=2), FadeIn(xlw), run_time=0.6)
        self.until_end(0.8)

        # 45 — three equations
        self.say()
        w2 = M("<i>a</i>(1, 1, 0) + <i>b</i>(0, 1, 1) + <i>c</i>(1, 0, 1) = (3, 4, 5)", 26, WHITE)
        at_left(w2, X0, 1.3)
        fit(w2, RX - X0)
        eqs = VGroup(M("<i>a</i> + <i>c</i> = 3", 28), M("<i>a</i> + <i>b</i> = 4", 28),
                     M("<i>b</i> + <i>c</i> = 5", 28)).arrange(RIGHT, buff=0.6)
        at_left(eqs, X0 + 0.3, 0.65)
        self.play(Write(w2), run_time=1.4)
        self.play(LaggedStart(*[FadeIn(e, shift=DOWN * 0.1) for e in eqs], lag_ratio=0.4), run_time=1.2)
        self.until_end(1.0)

        # 46 — add all three
        self.say()
        w3 = M("add all three:   2(<i>a</i> + <i>b</i> + <i>c</i>) = 12", 28, WHITE)
        w4 = M("<i>a</i> + <i>b</i> + <i>c</i> = 6", 28, C_W)
        at_left(w3, X0, -0.05)
        at_left(w4, X0 + 2.6, -0.65)
        self.play(Indicate(eqs, color=WHITE, scale_factor=1.03), run_time=0.7)
        self.play(Write(w3), run_time=1.2)
        self.play(Write(w4), run_time=0.9)
        self.until_end(1.0)

        # 47 — subtract each equation
        self.say()
        w5 = M("<i>b</i> = 6 − 3 = 3,   <i>c</i> = 6 − 4 = 2,   <i>a</i> = 6 − 5 = 1", 28, WHITE)
        at_left(w5, X0, -1.3)
        fit(w5, RX - X0)
        self.play(Write(w5), run_time=1.8)
        self.until_end(1.0)

        # 48 — the two parts
        self.say()
        w6 = M("<i>u</i> = 1(1, 1, 0) + 3(0, 1, 1) = (1, 4, 3)", 28, C_U)
        w7 = M("<i>w</i> = 2(1, 0, 1) = (2, 0, 2)", 28, C_V)
        at_left(w6, X0, -1.95)
        at_left(w7, X0, -2.55)
        fit(w6, RX - X0)
        ua = pw.arrow((1, 4, 3), color=C_U, width=5)
        wa_ = pw.arrow((2, 0, 2), color=C_V, width=5)
        self.play(Write(w6), GrowArrow(ua), run_time=1.3)
        self.play(Write(w7), GrowArrow(wa_), run_time=1.1)
        self.until_end(1.0)

        # 49 — they add up; the only split
        self.say()
        par = Polygon(pw(0, 0, 0), pw(1, 4, 3), pw(Xw), pw(2, 0, 2), stroke_color=C_W, stroke_width=2,
                      stroke_opacity=0.7).set_fill(C_W, 0.12)
        w8 = M("<i>u</i> + <i>w</i> = (3, 4, 5)  ✓   the only split", 28, C_W)
        at_left(w8, X0, -3.2)
        fit(w8, RX - X0)
        self.play(FadeIn(par), run_time=0.8)
        self.play(Write(w8), run_time=1.2)
        self.until_end(1.0)
        self.fade_all(keep)

        # 50 — two planes must share a line
        self.say()
        pc = Proj((-3.6, -0.6), 0.8, ph=35)
        a1, a2 = np.array([1.0, 0.0, 0.25]), np.array([0.0, 1.0, 0.0])
        b1, b2 = np.array([1.0, -0.6, 0.0]), np.array([0.0, 0.3, 1.0])
        dline = np.cross(np.cross(a1, a2), np.cross(b1, b2))
        dline = dline / np.linalg.norm(dline)
        axc = pc.axes(L=2.4, neg=1.4)
        P1 = pc.patch((0, 0, 0), a1, a2, (-2, 2), (-2, 2), C_U, 0.2)
        P2 = pc.patch((0, 0, 0), b1, b2, (-2, 2), (-2, 2), C_V, 0.2)
        il = pc.line(dline, -2.6, 2.6, C_W, 6)
        self.play(Create(axc), FadeIn(P1), run_time=0.8)
        self.play(FadeIn(P2), run_time=0.8)
        self.play(Create(il), run_time=1.0)
        cons = VGroup(T("two planes through home in 3-D", 26, WHITE),
                      T("always share at least a line", 26, WHITE)).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        at_left(cons, 0.3, 2.25)
        self.play(FadeIn(cons), run_time=0.7)
        self.until_end()

        # 51 — 2 + 2 − 3 = 1
        self.say()
        c1 = M("dim(<i>U</i> ∩ <i>Y</i>) = dim <i>U</i> + dim <i>Y</i> − dim(<i>U</i> + <i>Y</i>)", 28, WHITE)
        c2 = M("dim(<i>U</i> + <i>Y</i>) ≤ 3", 28, C_DIM)
        c3 = M("so  dim(<i>U</i> ∩ <i>Y</i>) ≥ 2 + 2 − 3 = 1", 30, C_W)
        at_left(c1, 0.3, 1.2)
        fit(c1, RX - 0.3)
        at_left(c2, 0.3, 0.45)
        at_left(c3, 0.3, -0.35)
        self.play(Write(c1), run_time=1.6)
        self.play(FadeIn(c2), run_time=0.7)
        self.play(Write(c3), run_time=1.2)
        self.play(Indicate(il, color=WHITE), run_time=0.8)
        self.until_end(1.2)
        self.fade_all(keep)

        # ============================================================ 7.4 worlds that miss home
        # 52 — some flat worlds miss home
        self.say()
        miss = T("flat worlds that miss home", 30, WHITE)
        at_left(miss, 0.6, 2.4)
        self.play(FadeIn(miss), run_time=0.7)
        self.until_end()

        # 53 — the shelf on a wall
        self.say()
        wallr = Rectangle(width=5.6, height=4.6, stroke_width=0).set_fill("#1A2030", 1).move_to(np.array([-3.8, -0.4, 0]))
        fy, shy = -2.0, -0.2
        floorL = Line(np.array([-6.6, fy, 0]), np.array([-1.0, fy, 0]), color=C_U, stroke_width=6)
        shelf = Rectangle(width=5.0, height=0.14, stroke_width=0).set_fill("#A0784A", 1).move_to(
            np.array([-3.8, shy - 0.07, 0]))
        hm = Dot(np.array([-3.8, fy, 0]), radius=0.08, color=WHITE)
        hml = T("home", 20, C_DIM).next_to(hm, DOWN, buff=0.1)

        def book(x, h, color, name):
            r = Rectangle(width=0.32, height=h, stroke_width=0).set_fill(color, 1).move_to(
                np.array([x, shy + h / 2, 0]))
            return VGroup(r, M(f"<i>{name}</i>", 24, color).next_to(r, UP, buff=0.08))

        bp = book(-4.7, 0.8, C_U, "p")
        bq = book(-2.6, 0.65, C_V, "q")
        self.play(FadeIn(wallr), Create(floorL), FadeIn(hm), FadeIn(hml), run_time=0.8)
        self.play(FadeIn(shelf, shift=UP * 0.2), run_time=0.6)
        self.play(FadeIn(bp, shift=DOWN * 0.2), FadeIn(bq, shift=DOWN * 0.2), run_time=0.7)
        self.until_end()

        # 54 — floor: subspace; shelf: shifted
        self.say()
        fll = T("floor: subspace S", 22, C_U).next_to(floorL, UP, buff=0.1).align_to(floorL, LEFT).shift(RIGHT * 0.2)
        shift = Arrow(np.array([-4.7, fy, 0]), np.array([-4.7, shy, 0]), buff=0, color=C_V, stroke_width=4,
                      tip_length=0.18)
        sll = T("shelf: S shifted by p", 22, "#D9B48A").next_to(shelf, DOWN, buff=0.12).align_to(shelf, RIGHT)
        self.play(FadeIn(fll), run_time=0.6)
        self.wait(0.6)
        self.play(GrowArrow(shift), FadeIn(sll), run_time=0.9)
        self.until_end()

        # 55 — affine set
        self.say()
        aff = P("<b>affine set</b> = a translated subspace", 28, C_V)
        at_left(aff, 0.6, 1.5)
        affm = M("<i>p</i> + <i>S</i> = { <i>p</i> + <i>s</i> :  <i>s</i> ∈ <i>S</i> }", 28, WHITE)
        at_left(affm, 0.6, 0.85)
        self.play(Write(aff), run_time=1.0)
        self.play(FadeIn(affm), run_time=0.7)
        self.until_end()

        # 56 — need not contain home; may if the shift lies in S
        self.say()
        nn = T("need not pass through home…", 24, WHITE)
        at_left(nn, 0.6, 0.0)
        self.play(FadeIn(nn), Indicate(hm, scale_factor=2), run_time=0.8)
        inS = Arrow(np.array([-3.8, fy, 0]), np.array([-2.4, fy, 0]), buff=0, color=C_V, stroke_width=5,
                    tip_length=0.18)
        sameL = floorL.copy().set_color(C_V).set_stroke(width=3).shift(UP * 0.12)
        mm = VGroup(T("…but may: if the shift lies in S,", 24, WHITE),
                    T("the shifted set is S itself", 24, WHITE)).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        at_left(mm, 0.6, -0.9)
        self.play(GrowArrow(inS), run_time=0.7)
        self.play(TransformFromCopy(floorL, sameL), FadeIn(mm), run_time=1.0)
        self.until_end()
        self.fade_all(keep)

        # 57 — books p, q on x + y = 1; the sum falls off
        self.say()
        pa = plane((-2, 3), (-2, 3), unit=0.86).to_edge(LEFT, buff=0.5).shift(DOWN * 0.3)

        def seg_xy(cst):
            # endpoints of x + y = cst inside [-2, 3]²
            xs = [max(-2, cst - 3), min(3, cst + 2)]
            return pa.c2p(xs[0], cst - xs[0]), pa.c2p(xs[1], cst - xs[1])

        def lineC(cst, color, width=4, op=1.0):
            a_, b_ = seg_xy(cst)
            return Line(a_, b_, color=color, stroke_width=width, stroke_opacity=op)

        shelfL = lineC(1, "#D9B48A", 5)
        shl = M("<i>x</i> + <i>y</i> = 1", 24, "#D9B48A").next_to(pa.c2p(-1.6, 2.6), RIGHT, buff=0.1)
        pd = Dot(pa.c2p(1, 0), radius=0.1, color=C_U)
        qd = Dot(pa.c2p(0, 1), radius=0.1, color=C_V)
        pl_ = M("<i>p</i> = (1, 0)", 22, C_U).next_to(pd, DR, buff=0.06)
        ql_ = M("<i>q</i> = (0, 1)", 22, C_V).next_to(qd, LEFT, buff=0.12)
        self.play(Create(pa, lag_ratio=0.02), run_time=0.8)
        self.play(Create(shelfL), FadeIn(shl), run_time=0.7)
        self.play(FadeIn(pd, scale=2), FadeIn(qd, scale=2), FadeIn(pl_), FadeIn(ql_), run_time=0.7)
        sd = Dot(pa.c2p(1, 1), radius=0.1, color=C_X)
        sdl = M("<i>p</i> + <i>q</i> = (1, 1)  ✗", 22, C_X).next_to(sd, UR, buff=0.06)
        r_sum = M("<i>p</i> + <i>q</i> = (1, 1):  1 + 1 = 2 ≠ 1, off the shelf", 26, C_X)
        at_left(r_sum, 0.6, 2.2)
        fit(r_sum, RX - 0.6)
        self.play(FadeIn(sd, scale=2), FadeIn(sdl), FadeIn(r_sum), run_time=0.9)
        self.until_end()

        # 58 — the average stays
        self.say()
        md = Dot(pa.c2p(0.5, 0.5), radius=0.1, color=C_W)
        r_avg = M("½<i>p</i> + ½<i>q</i> = (½, ½):  on the shelf ✓", 26, C_W)
        at_left(r_avg, 0.6, 1.55)
        self.play(FadeIn(md, scale=2), FadeIn(r_avg), run_time=0.8)
        self.until_end()

        # 59 — affine combinations sweep the whole line
        self.say()
        t = ValueTracker(0.5)

        def tr():
            return round(t.get_value(), 1)

        mover = always_redraw(lambda: Dot(pa.c2p(1 - tr(), tr()), radius=0.12, color=WHITE))
        tread = always_redraw(lambda: M(f"<i>t</i> = {fmt(tr())}:   ({fmt(1 - tr())})<i>p</i> + ({fmt(tr())})<i>q</i>"
                                        f"   amounts add to 1", 24, WHITE)
                              .move_to(np.array([0.6, 0.85, 0]), aligned_edge=LEFT))
        self.add(mover, tread)
        self.play(FadeOut(md), t.animate.set_value(-1.0), run_time=1.8)
        self.play(t.animate.set_value(2.0), run_time=2.6)
        afc = VGroup(T("affine combination:", 26, C_V, weight=BOLD),
                     T("amounts add up to 1", 24, C_V)).arrange(DOWN, buff=0.08, aligned_edge=LEFT)
        at_left(afc, 0.6, 0.0)
        self.play(FadeIn(afc), t.animate.set_value(0.5), run_time=1.0)
        self.until_end()

        # 60 — convex: amounts never negative
        self.say()
        segPQ = Line(pa.c2p(1, 0), pa.c2p(0, 1), color=C_W, stroke_width=9)
        cvc = VGroup(T("convex combination:", 26, C_W, weight=BOLD),
                     T("amounts also never negative", 24, C_W)).arrange(DOWN, buff=0.08, aligned_edge=LEFT)
        at_left(cvc, 0.6, -0.95)
        self.play(Create(segPQ), run_time=0.7)
        self.play(t.animate.set_value(0.0), run_time=1.0)
        self.play(t.animate.set_value(1.0), FadeIn(cvc), run_time=1.6)
        self.play(t.animate.set_value(0.5), run_time=0.8)
        self.until_end()

        # 61 — affine span, convex hull
        self.say()
        asp = P("<b>affine span</b> of p, q: the whole line", 24, "#D9B48A")
        chl = P("<b>convex hull</b> of p, q: the segment between them", 24, C_W)
        at_left(asp, 0.6, -1.85)
        at_left(chl, 0.6, -2.35)
        fit(chl, RX - 0.6)
        self.play(Indicate(shelfL, color=WHITE), FadeIn(asp), run_time=0.9)
        self.play(Indicate(segPQ, color=WHITE), FadeIn(chl), run_time=0.9)
        self.until_end()
        mover.clear_updaters()
        tread.clear_updaters()
        self.play(FadeOut(VGroup(mover, tread, r_sum, r_avg, afc, cvc, asp, chl, sd, sdl, segPQ)), run_time=0.6)

        # 62 — the shelf as a shifted subspace
        self.say()
        Xq = 0.4
        tagp = T("PRECISE", 20, C_V, weight=BOLD)
        at_left(tagp, Xq, 2.75)
        e1_ = M("{ <i>x</i> + <i>y</i> = 1 } = (1, 0) + span{ (−1, 1) }", 28, WHITE)
        at_left(e1_, Xq, 2.25)
        fit(e1_, RX - Xq)
        floorS = lineC(0, C_P, 3, 0.9)
        fsl = M("floor <i>S</i>", 22, C_P).next_to(pa.c2p(2, -2), RIGHT, buff=0.1)
        anchor = vec(pa, 1, 0, C_U, width=5)
        dirv = vec(pa, -1, 1, C_P, start=(1, 0), width=4)
        self.play(FadeIn(tagp), Write(e1_), run_time=1.4)
        self.play(Create(floorS), FadeIn(fsl), GrowArrow(anchor), run_time=0.9)
        self.play(GrowArrow(dirv), run_time=0.7)
        self.until_end(1.0)

        # 63 — (1 − t, t)
        self.say()
        e2_ = M("every point:  (1 − <i>t</i>, <i>t</i>)", 28, WHITE)
        at_left(e2_, Xq, 1.6)
        self.play(Write(e2_), run_time=1.0)
        self.until_end(0.8)

        # 64 — a mix of anchored points
        self.say()
        e3_ = M("Σ <i>a<sub>i</sub></i> (<i>x</i><sub>0</sub> + <i>s<sub>i</sub></i>)", 32, WHITE)
        e3n = T("anchor x₀ on the shelf,  each sᵢ in the floor S", 22, C_DIM)
        at_left(e3_, Xq, 0.85)
        at_left(e3n, Xq, 0.3)
        fit(e3n, RX - Xq)
        self.play(Write(e3_), run_time=1.2)
        self.play(FadeIn(e3n), run_time=0.6)
        self.until_end(0.8)

        # 65 — the identity, anchor term boxed
        self.say()
        e4q = M("=", 32, WHITE)
        e4a = M("(Σ <i>a<sub>i</sub></i>) <i>x</i><sub>0</sub>", 32, C_V)
        e4b = M("+  Σ <i>a<sub>i</sub></i> <i>s<sub>i</sub></i>", 32, C_P)
        e4 = VGroup(e4q, e4a, e4b).arrange(RIGHT, buff=0.25)
        at_left(e4, Xq + 0.5, -0.35)
        bx = SurroundingRectangle(e4a, color=C_V, buff=0.1, corner_radius=0.06)
        inS_ = T("stays in the floor", 20, C_P).next_to(e4b, DOWN, buff=0.12)
        self.play(Write(e4q), Write(e4a), run_time=1.2)
        self.play(Create(bx), run_time=0.6)
        self.play(Write(e4b), run_time=1.0)
        self.play(FadeIn(inS_), run_time=0.5)
        self.until_end(1.2)

        # 66–68 — three cases
        cases = [("Σ <i>a<sub>i</sub></i> = 1   →   on the shelf  <i>x</i><sub>0</sub> + <i>S</i>", 1, "#D9B48A"),
                 ("Σ <i>a<sub>i</sub></i> = 2   →   a shelf twice as high  2<i>x</i><sub>0</sub> + <i>S</i>", 2, C_X),
                 ("Σ <i>a<sub>i</sub></i> = 0   →   the floor  <i>S</i>", 0, C_P)]
        ys = [-1.35, -1.95, -2.55]
        examples = [None, ((1, 1), "<i>p</i> + <i>q</i>"), ((1, -1), "<i>p</i> − <i>q</i>")]
        shown = []
        for i, (mk, cst, col_) in enumerate(cases):
            self.say()
            ln = M(mk, 26, col_)
            at_left(ln, Xq, ys[i])
            fit(ln, RX - Xq)
            self.play(Write(ln), run_time=1.3)
            if cst == 1:
                self.play(Indicate(shelfL, color=WHITE), run_time=0.9)
                extra = VGroup()
            else:
                L2 = lineC(cst, col_, 4)
                (ex, ey), nm = examples[i]
                dd = Dot(pa.c2p(ex, ey), radius=0.09, color=col_)
                dl = M(nm, 22, col_).next_to(dd, RIGHT, buff=0.1)
                if cst == 0:
                    self.play(Indicate(floorS, color=WHITE), FadeIn(dd, scale=2), FadeIn(dl), run_time=0.9)
                    extra = VGroup(dd, dl)
                else:
                    self.play(Create(L2), FadeIn(dd, scale=2), FadeIn(dl), run_time=0.9)
                    extra = VGroup(L2, dd, dl)
            shown += [ln, extra]
            self.until_end(1.0)

        # 69 — averages safe, sums aren't
        self.say()
        safe = T("averages are safe; sums aren't", 28, C_W, weight=BOLD)
        at_left(safe, Xq, -3.2)
        self.play(FadeIn(safe, shift=UP * 0.1), run_time=0.8)
        self.until_end()
        self.fade_all(keep)

        # ============================================================ bias and centring
        # 70 — bias term
        self.say()
        pb = plane((-3, 6), (-3, 6), unit=0.58).to_edge(LEFT, buff=0.5).shift(DOWN * 0.3)
        outs = [(-1.5, -1.0), (-0.5, -2.0), (0.5, -1.2), (-1.0, 0.0)]
        bvec = (3.5, 3.0)
        od = VGroup(*[Dot(pb.c2p(*o), radius=0.08, color=C_U) for o in outs])
        nd = VGroup(*[Dot(pb.c2p(o[0] + bvec[0], o[1] + bvec[1]), radius=0.08, color=C_W) for o in outs])
        barr = VGroup(*[vec(pb, *bvec, C_V, start=o, width=3) for o in outs])
        bt = M("<i>W</i><i>x</i> + <i>b</i>", 36, WHITE)
        at_left(bt, 0.6, 2.2)
        bt2 = T("every output shifted by the same vector b", 24, C_V)
        at_left(bt2, 0.6, 1.5)
        fit(bt2, RX - 0.6)
        self.play(Create(pb, lag_ratio=0.02), FadeIn(od), Write(bt), run_time=1.0)
        self.play(LaggedStart(*[GrowArrow(a) for a in barr], lag_ratio=0.15), FadeIn(bt2), run_time=1.2)
        self.play(TransformFromCopy(od, nd), run_time=0.8)
        self.until_end()
        self.play(FadeOut(VGroup(od, nd, barr, bt, bt2)), run_time=0.5)

        # 71 — subtracting the mean: shelf back to the floor
        self.say()
        rng = np.random.default_rng(11)
        dirc = np.array([1.0, 0.55]) / np.linalg.norm([1.0, 0.55])
        perp = np.array([-dirc[1], dirc[0]])
        mean = np.array([3.6, 3.2])
        pts = [mean + dirc * rng.normal(0, 1.1) + perp * rng.normal(0, 0.18) for _ in range(16)]
        mean = np.mean(pts, axis=0)
        sh = ValueTracker(0.0)

        def cur(q):
            return q - sh.get_value() * mean

        cloud = always_redraw(lambda: VGroup(*[Dot(pb.c2p(*cur(q)), radius=0.07, color=C_U) for q in pts]))
        mdot = always_redraw(lambda: Dot(pb.c2p(*cur(mean)), radius=0.1, color=C_W))
        ct = M("<i>x</i> − <i>x̄</i>", 36, WHITE)
        at_left(ct, 0.6, 2.2)
        ct2 = T("subtract the mean: shelf back down to the floor", 24, C_W)
        at_left(ct2, 0.6, 1.5)
        fit(ct2, RX - 0.6)
        self.add(cloud)
        self.play(FadeIn(cloud), run_time=0.7)
        self.add(mdot)
        self.play(FadeIn(mdot, scale=2), Write(ct), FadeIn(ct2), run_time=1.0)
        self.until_end()

        # 72 — before centring
        self.say()
        arrs = always_redraw(lambda: VGroup(*[Line(pb.c2p(0, 0), pb.c2p(*cur(q)), color=C_DIM, stroke_width=1.6,
                                                   stroke_opacity=0.8) for q in pts]))
        bef = T("before: every arrow points toward the cloud", 24, WHITE)
        at_left(bef, 0.6, 0.6)
        fit(bef, RX - 0.6)
        self.add(arrs, cloud, mdot)
        self.play(FadeIn(arrs), FadeIn(bef), run_time=1.0)
        self.until_end()

        # 73 — after centring
        self.say()
        aft = T("after: arrows show the variation around the mean", 24, C_W)
        at_left(aft, 0.6, -0.1)
        fit(aft, RX - 0.6)
        self.play(sh.animate.set_value(1.0), run_time=2.6)
        self.play(FadeIn(aft), run_time=0.6)
        self.until_end()

        # 74 — PCA
        self.say()
        pca = VGroup(P("<b>PCA</b>: study variation around the mean,", 24, C_V),
                     T("not the cloud's offset from home", 24, C_V)).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        at_left(pca, 0.6, -1.05)
        self.play(FadeIn(pca), run_time=0.8)
        self.until_end()

        # 75 — centring doesn't fill every direction
        self.say()
        axisL = DashedLine(pb.c2p(*(-2.6 * dirc)), pb.c2p(*(2.6 * dirc)), color=C_V, dash_length=0.1, stroke_width=3)
        thin = VGroup(T("still a thin cloud: centring doesn't add directions,", 22, C_DIM),
                      T("it just puts home at its centre", 22, C_DIM)).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        at_left(thin, 0.6, -2.2)
        fit(thin, RX - 0.6)
        self.play(Create(axisL), run_time=0.9)
        self.play(FadeIn(thin), run_time=0.7)
        self.done(1.0)
        for m in (cloud, mdot, arrs):
            m.clear_updaters()
        self.clear_all()
