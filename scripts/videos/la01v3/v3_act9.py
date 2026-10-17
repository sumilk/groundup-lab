"""LA01 v3 — Act 9: Adding geometry (inner product, dot product, norm, unit vector, angle, cosine similarity,
Cauchy–Schwarz, triangle inequality, distance, orthogonal, cross-talk, Gram matrix, positive definite)."""
from common import *
from v3_act1 import craft, dimmed, fmt
from v3_act8 import C_T, PX, at, fit, precise_tag, row, skew_grid, stack, mm

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
R5 = np.sqrt(5)
PHI_U = np.arctan2(1, 2)
PHI_V = np.arctan2(2, 1)
C_F3 = "#F48FB1"     # third feature direction (Act 9.4 only)


def sgn(x):
    s = fmt(x + 0.0)
    return s if s.startswith("−") or s == "0.0" else "+" + s


def person(color):
    head = Circle(radius=0.17, stroke_width=0).set_fill(color, 1)
    body = Sector(radius=0.3, angle=PI, stroke_width=0).set_fill(color, 1).next_to(head, DOWN, buff=0.04)
    return VGroup(head, body)


def mic():
    cap = RoundedRectangle(width=0.16, height=0.3, corner_radius=0.08, stroke_width=0).set_fill("#D9DEE7", 1)
    handle = Line(cap.get_bottom(), cap.get_bottom() + DOWN * 0.3, color="#8A93A3", stroke_width=4)
    g = VGroup(cap, handle)
    g.pivot = cap
    return g


def aim(m, pos, target):
    """Place a mic at pos, capsule pointing at target."""
    m2 = m.copy()
    d = np.array(target) - np.array(pos)
    ang = np.arctan2(d[1], d[0]) - PI / 2
    m2.rotate(ang, about_point=m2[0].get_center())
    m2.shift(np.array(pos) - m2[0].get_center())
    return m2


class V3Act9(NScene):
    BEATS = [
        # 0
        "Act nine. Adding geometry.",
        # ---- 9.1
        # 1
        "Remember, the rules said nothing about length or angle. Now we add them.",
        # 2
        "Start with a question: how much of the gold move points along the blue one?",
        # 3
        "Imagine a light shining straight down onto blue's line. Gold casts a shadow on it.",
        # 4
        "When gold points almost along blue, the shadow is long. When gold is perpendicular to blue, the shadow "
        "vanishes. Point gold backwards, and the shadow points backwards too.",
        # 5
        "SLOW|The number that measures this is the dot product: multiply matching entries and add. For blue and "
        "gold, that's two times one plus one times two, which is four.",
        # 6
        "SLOW|The dot product of a move with itself gives its squared length, so blue's length is the square root "
        "of five, which is just Pythagoras.",
        # 7
        "SLOW|In symbols, the dot product of u and v is the sum of u i times v i, also written u transpose v.",
        # 8
        "SLOW|The length, or norm, is the square root of a vector's dot product with itself.",
        # 9
        "SLOW|More generally, any rule for multiplying two vectors that is symmetric, linear in each input, and "
        "gives a positive number for any non-zero vector with itself, is called an inner product.",
        # 10
        "The dot product is the standard one, but not the only one, and that will matter in a moment.",
        # 11
        "SLOW|Strictly, the shadow is a signed component: positive along blue, negative when gold points away, "
        "and it equals the dot product divided by blue's length.",
        # 12
        "The two agree when blue has length one, which is why we often shrink moves to length one first. A move "
        "of length one is a unit vector.",
        # ---- 9.2
        # 13
        "SLOW|Divide the dot product by both lengths and you get a number between minus one and one. That's the "
        "cosine of the angle between the moves.",
        # 14
        "One means same direction, zero means perpendicular, minus one means opposite.",
        # 15
        "For blue and gold, it's four fifths: about thirty-seven degrees apart.",
        # 16
        "That's the cosine similarity that recommender systems and embedding search use everywhere.",
        # 17
        "It only makes sense for two non-zero vectors: the zero vector has no direction, and you'd be dividing "
        "by zero.",
        # 18
        "Why is it always between minus one and one? Slide along gold's line looking for the point closest to "
        "blue's tip.",
        # 19
        "The squared distance can never be negative, and writing that down gives exactly the bound.",
        # 20
        "It's called the Cauchy–Schwarz inequality, and its cousin, the triangle inequality, says a detour is "
        "never shorter than going straight.",
        # 21
        "SLOW|Here's that argument on the screen. If v is the zero vector, both sides are zero and there's "
        "nothing to prove.",
        # 22
        "SLOW|Otherwise, the squared length of u minus t v is a parabola in t, and it can never go below zero.",
        # 23
        "SLOW|Complete the square, and the parabola is the squared length of v times a perfect square, plus a "
        "constant.",
        # 24
        "SLOW|The perfect square vanishes at its lowest point, so that constant, the squared length of u minus "
        "the dot product squared over the squared length of v, must itself be at least zero.",
        # 25
        "SLOW|Rearranged, that says the square of the dot product is at most the product of the squared lengths.",
        # 26
        "SLOW|Take square roots, and that's the Cauchy–Schwarz inequality.",
        # 27
        "It's exactly what makes the cosine a number between minus one and one, so angles make sense.",
        # 28
        "SLOW|Equality holds exactly when u and v are linearly dependent: if v is zero that's automatic, and "
        "otherwise it's when the parabola touches zero, which means u is a multiple of v.",
        # 29
        "SLOW|And Cauchy–Schwarz gives the triangle inequality in one line. Expand the squared length of u plus "
        "v, and bound the middle term using Cauchy–Schwarz.",
        # 30
        "SLOW|For blue plus gold, the straight route has length about four point two four, and the detour along "
        "blue then gold has length about four point four seven.",
        # 31
        "Going straight is never longer.",
        # ---- 9.3
        # 32
        "Moves that are perpendicular to each other are called orthogonal,",
        # 33
        "and mutually orthogonal non-zero moves are automatically independent: none of them casts any shadow on "
        "the others, so there's no way to build one from the rest.",
        # 34
        "But the reverse isn't true. Blue and gold are independent, and they're not perpendicular at all.",
        # 35
        "SLOW|The proof is a single move. Take a supposed round trip, and dot both sides with one of the moves.",
        # 36
        "SLOW|Every other term vanishes, because the moves are perpendicular, leaving that move's amount times its "
        "squared length equals zero.",
        # 37
        "SLOW|Its length isn't zero, so its amount must be. Do that for every move, and the only round trip is "
        "doing nothing.",
        # ---- 9.4
        # 38
        "Here's where geometry meets the counting from Act five. This is a simplified model of what's called "
        "superposition: it illustrates the algebra, not a universal account of how networks decode features.",
        # 39
        "Suppose a model stores more feature directions than it has dimensions, so they can't all be "
        "perpendicular.",
        # 40
        "Picture three microphones at a crowded party. If each points only at its own speaker, it hears only "
        "them.",
        # 41
        "But if the mics are angled toward each other, each one picks up some of the neighbours.",
        # 42
        "Here are three feature directions squeezed into a flat plane.",
        # 43
        "Turn on features one and two.",
        # 44
        "When we read out feature one, we get a half, not one, and feature three, which is off, reads minus one.",
        # 45
        "That leakage is called cross-talk, or interference, and it's exactly the dot products between the "
        "feature directions.",
        # 46
        "SLOW|Here's the formula behind that. Encode the active features as x, the sum of each feature's amount "
        "times its direction.",
        # 47
        "SLOW|Reading out feature j with a dot product gives that feature's own amount, the signal, plus every "
        "other active feature's amount times its overlap with feature j. That second part is the cross-talk.",
        # 48
        "SLOW|Three directions a hundred and twenty degrees apart overlap by minus a half each, which is exactly "
        "where the half and the minus one come from.",
        # 49
        "Small overlaps help, even when the directions can't all be perpendicular. But the total also depends on "
        "how many features are active and how strongly: many small overlaps can add up. The formula shows "
        "exactly why.",
        # 50
        "If you collect every pairwise dot product of a set of moves into a table, you get the Gram matrix.",
        # 51
        "Its diagonal holds the squared lengths, and everything off the diagonal is an overlap, a potential "
        "source of cross-talk.",
        # 52
        "It also detects dead weight: the moves are dependent exactly when some non-zero recipe gives zero "
        "length.",
        # 53
        "SLOW|In symbols, the Gram matrix is V transpose V. For blue and gold it's five, four, four, five: "
        "squared lengths five on the diagonal, overlap four off it.",
        # 54
        "SLOW|And here's the useful identity: c transpose G c equals the squared length of V c.",
        # 55
        "SLOW|So if G sends some recipe to zero, the squared length of V c is zero, so V c is zero.",
        # 56
        "The Gram matrix sees exactly the same dead weight as the moves themselves.",
        # 57
        "One warning to finish. Dot products depend on geometry, not just addresses.",
        # 58
        "If you change to a skewed basis and take the dot product of the new addresses, you'll get the wrong "
        "answer.",
        # 59
        "Geometry is extra structure, and it has to be carried along when you change grids.",
        # 60
        "A matrix that defines a valid geometry this way is called positive definite, a word you'll meet "
        "properly in later chapters.",
        # 61
        "SLOW|Here's the exact fix. If x is B times c and y is B times d, then their true dot product is c "
        "transpose, B transpose B, d.",
        # 62
        "SLOW|That middle matrix carries the geometry into the new addresses. Leave it out and you get the wrong "
        "answer.",
        # 63
        "SLOW|Two perpendicular standard moves, written in the teal grid, have a plain dot product of minus one "
        "ninth instead of zero.",
        # 64
        "SLOW|And a matrix that can sit in the middle like this, symmetric with z transpose M z positive for every "
        "non-zero z, is exactly what positive definite means.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 9", "Adding geometry",
                                        "How much of one move points along another?")
        self.say()
        self.until_end(0.8)
        self.header = to_header(self, grp, bar, header)
        self.act91()
        self.act92()
        self.act93()
        self.act94()
        self.done(1.0)
        self.clear_all()

    def wipe(self, run_time=0.6):
        mobs = [m for m in self.mobjects if m is not self.header]
        if mobs:
            self.play(*[FadeOut(m) for m in mobs], run_time=run_time)

    # ------------------------------------------------------------------ 9.1
    def act91(self):
        p = plane((-3, 5), (-3, 5), unit=0.62).to_edge(LEFT, buff=0.5).shift(DOWN * 0.35)
        self.p = p
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        uarr = vec(p, *U, C_U, width=6)
        ul = M("<i>u</i>", 28, C_U).next_to(uarr.get_end(), UR, buff=0.05)
        phi = ValueTracker(PHI_V)
        self.phi = phi

        def vv():
            return R5 * np.array([np.cos(phi.get_value()), np.sin(phi.get_value())])

        varr = always_redraw(lambda: vec(p, *vv(), C_V, width=6))
        vl = always_redraw(lambda: M("<i>v</i>", 28, C_V).next_to(p.c2p(*(1.12 * vv())), ORIGIN))
        uhat = U / R5
        uline = Line(p.c2p(*(-2.6 * uhat)), p.c2p(*(5.3 * uhat)), color=C_U, stroke_width=2, stroke_opacity=0.5)

        # 1 — rules said nothing about length or angle
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), run_time=1.0)
        self.play(GrowArrow(uarr), FadeIn(ul), run_time=0.7)
        self.add(varr, vl)
        self.wait(0.6)
        rules = VGroup(T("the rules (Act 6):", 22, C_DIM), T("add · scale", 26, WHITE),
                       T("no length, no angle", 26, C_X)).arrange(DOWN, buff=0.2)
        at(rules, y=1.2)
        self.play(FadeIn(rules[:2]), run_time=0.6)
        self.play(FadeIn(rules[2]), run_time=0.6)
        self.until_end()

        # 2 — the question
        self.say()
        qn = T("How much of gold points along blue?", 28, C_V)
        at(qn, y=2.4)
        self.play(FadeOut(rules), FadeIn(qn), run_time=0.8)
        self.until_end()

        # 3 — lamp and shadow
        self.say()

        def foot():
            return np.dot(vv(), uhat) * uhat

        lamp_pt = 1.5 * uhat + 3.6 * np.array([-1, 2]) / R5
        lamp = VGroup(Dot(p.c2p(*lamp_pt), radius=0.13, color="#FFF2B3"),
                      Circle(radius=0.24, stroke_color="#FFF2B3", stroke_width=2, stroke_opacity=0.5).move_to(
                          p.c2p(*lamp_pt)))
        nrm = np.array([-1, 2]) / R5
        rays = VGroup(*[DashedLine(p.c2p(*(lamp_pt + s * uhat - 0.3 * nrm)), p.c2p(*(lamp_pt + s * uhat - 2.6 * nrm)),
                                   color="#FFF2B3", stroke_width=1.5, dash_length=0.08).set_opacity(0.45)
                        for s in (-0.8, 0, 0.8)])
        ray = always_redraw(lambda: DashedLine(p.c2p(*vv()), p.c2p(*foot()), color="#FFF2B3", stroke_width=2,
                                               dash_length=0.07))
        shadow = always_redraw(lambda: Line(p.c2p(0, 0), p.c2p(*foot()), color=C_V, stroke_width=10,
                                            stroke_opacity=0.55) if abs(np.dot(vv(), uhat)) > 0.03 else VGroup())
        self.play(Create(uline), FadeIn(lamp), FadeIn(rays), run_time=0.9)
        self.add(shadow, ray)
        self.play(FadeIn(shadow), run_time=0.6)
        sl = T("shadow", 20, C_V).next_to(p.c2p(*(0.5 * np.dot(vv(), uhat) * uhat)), DR, buff=0.12)
        self.play(FadeIn(sl), run_time=0.4)
        self.until_end()

        # 4 — rotate gold: long, vanishing, backwards (live signed number)
        self.say()
        self.play(FadeOut(sl), run_time=0.3)

        def comp_r():
            return round(np.dot(vv(), uhat), 1)

        live = always_redraw(lambda: M(f"shadow along blue (signed):  {sgn(comp_r())}", 26, C_V)
                             .move_to(np.array([PX, 1.5, 0])))
        self.add(live)
        self.play(phi.animate.set_value(PHI_U + 0.12), run_time=1.8)
        self.wait(0.4)
        self.play(phi.animate.set_value(PHI_U + PI / 2), run_time=2.0)
        self.wait(0.6)
        self.play(phi.animate.set_value(PHI_U + PI - 0.35), run_time=2.0)
        self.until_end()
        self.play(phi.animate.set_value(PHI_V), run_time=1.4)
        self.play(FadeOut(live), FadeOut(qn), run_time=0.4)

        # 5 — the dot product
        self.say()
        dp = M("<i>u</i> · <i>v</i> = 2·1 + 1·2 = 4", 34)
        at(dp, y=2.3)
        self.play(Write(dp), run_time=1.6)
        dpn = T("dot product: multiply matching entries, add", 22, C_DIM).next_to(dp, DOWN, buff=0.2)
        self.play(FadeIn(dpn), run_time=0.6)
        self.until_end(1.0)

        # 6 — squared length, Pythagoras
        self.say()
        lx = Line(p.c2p(0, 0), p.c2p(2, 0), color=WHITE, stroke_width=3)
        ly = Line(p.c2p(2, 0), p.c2p(2, 1), color=WHITE, stroke_width=3)
        l2 = M("2", 22).next_to(lx, DOWN, buff=0.08)
        l1 = M("1", 22).next_to(ly, RIGHT, buff=0.08)
        uu = M("<i>u</i> · <i>u</i> = 2·2 + 1·1 = 5 = ‖<i>u</i>‖<sup>2</sup>", 30)
        nu = M("‖<i>u</i>‖ = √(2<sup>2</sup> + 1<sup>2</sup>) = √5", 32, C_U)
        g = stack([uu, nu], top=1.0, left=0.6, buff=0.3)
        self.play(Write(uu), run_time=1.4)
        self.play(Create(lx), Create(ly), FadeIn(l2), FadeIn(l1), run_time=1.0)
        self.play(Write(nu), run_time=1.2)
        self.until_end(1.2)

        # 7–10 — precise: dot product, norm, inner product
        self.play(FadeOut(VGroup(dp, dpn, uu, nu, lx, ly, l2, l1)), run_time=0.5)
        self.say()
        e1 = M("<i>u</i> · <i>v</i> = <i>u</i><sup>T</sup><i>v</i> = Σ<sub><i>i</i></sub> <i>u<sub>i</sub></i> <i>v<sub>i</sub></i>", 34)
        at(e1, y=2.4)
        tg = precise_tag(e1)
        self.play(FadeIn(tg), Write(e1), run_time=1.6)
        self.until_end(1.0)
        self.say()
        e2 = M("‖<i>v</i>‖ = √(<i>v</i><sup>T</sup><i>v</i>)", 34)
        e2n = T("length = norm", 22, C_DIM)
        r2 = row(e2, e2n, buff=0.5)
        at(r2, y=1.45)
        self.play(Write(e2), run_time=1.2)
        self.play(FadeIn(e2n), run_time=0.5)
        self.until_end(1.0)
        self.say()
        ih = P("an <b>inner product</b> ⟨<i>u</i>, <i>v</i>⟩ is any rule that is", 24)
        i1 = M("symmetric:  ⟨<i>u</i>, <i>v</i>⟩ = ⟨<i>v</i>, <i>u</i>⟩", 26)
        i2 = M("linear in each slot", 26)
        i3 = M("positive:  ⟨<i>v</i>, <i>v</i>⟩ &gt; 0  for  <i>v</i> ≠ 0", 26)
        card = boxed(col(ih, i1, i2, i3, buff=0.2), color=C_U, buff=0.22)
        at(card, y=-0.55)
        self.play(FadeIn(card[0]), FadeIn(ih), run_time=0.7)
        for it in (i1, i2, i3):
            self.play(FadeIn(it, shift=RIGHT * 0.15), run_time=0.6)
            self.wait(0.9)
        self.until_end(1.0)
        self.say()
        std = T("the dot product is the standard one — not the only one", 22, C_V)
        at(std, y=-2.55)
        self.play(FadeIn(std), run_time=0.7)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(e1, e2, e2n, card, std, tg)), run_time=0.5)

        # 11 — signed component
        self.say()
        sc = M("(<i>u</i> · <i>v</i>) / ‖<i>u</i>‖ = 4 / √5 ≈ 1.79", 32, C_V)
        at(sc, y=2.3)
        scn = col(T("signed component along u", 24, WHITE), T("= dot product ÷ length of u", 22, WHITE),
                  buff=0.1, aligned=ORIGIN)
        at(scn, y=1.45)
        scn2 = T("negative when v points away from u", 20, C_DIM).next_to(scn, DOWN, buff=0.15)
        lab = M("4/√5 ≈ 1.79", 22, C_V).next_to(p.c2p(*(0.6 * np.dot(V, uhat) * uhat)), DR, buff=0.2)
        self.play(Write(sc), FadeIn(lab), run_time=1.4)
        self.play(FadeIn(scn), run_time=0.6)
        self.play(FadeIn(scn2), run_time=0.5)
        self.until_end(1.0)

        # 12 — unit vector
        self.say()
        uh = vec(p, *uhat, WHITE, width=7, tip=0.18)
        uhl = M("<i>u</i> / ‖<i>u</i>‖", 22, WHITE).next_to(uh.get_end(), DOWN, buff=0.25).shift(LEFT * 0.2)
        un = M("unit vector:  <i>u</i> / ‖<i>u</i>‖ = (2, 1)/√5,  length 1", 28)
        at(un, y=0.0)
        un2 = T("length 1 ⇒ component = dot product", 22, C_DIM).next_to(un, DOWN, buff=0.2)
        self.play(GrowArrow(uh), FadeIn(uhl), FadeOut(lab), run_time=0.9)
        self.play(FadeIn(un), run_time=0.7)
        self.play(FadeIn(un2), run_time=0.5)
        tu = T("unit vector", 28, WHITE, weight=BOLD).next_to(un2, DOWN, buff=0.35)
        self.play(Write(tu), run_time=0.7)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(sc, scn, scn2, lab, uh, uhl, un, un2, tu, shadow, ray, lamp, rays, uline)), run_time=0.6)
        self.uarr, self.ul, self.varr, self.vl, self.home = uarr, ul, varr, vl, home

    # ------------------------------------------------------------------ 9.2
    def act92(self):
        p, phi = self.p, self.phi

        def vv():
            return R5 * np.array([np.cos(phi.get_value()), np.sin(phi.get_value())])

        def cosr():
            return round(np.cos(phi.get_value() - PHI_U), 1) + 0.0

        arc = always_redraw(lambda: Arc(radius=0.55, start_angle=PHI_U, angle=phi.get_value() - PHI_U,
                                        arc_center=p.c2p(0, 0), color=WHITE, stroke_width=3))
        th = always_redraw(lambda: M("θ", 24).move_to(p.c2p(0, 0) + 0.85 * np.array(
            [np.cos((PHI_U + phi.get_value()) / 2), np.sin((PHI_U + phi.get_value()) / 2), 0])))

        # 13 — cosine
        self.say()
        self.add(arc)
        self.play(FadeIn(th), run_time=0.5)
        c1 = M("cos θ = <i>u</i> · <i>v</i> / (‖<i>u</i>‖ ‖<i>v</i>‖)", 32)
        c2 = M("= 4 / (√5 · √5) = 0.8", 32, C_W)
        cc = stack([c1, c2], top=2.75, left=0.5, buff=0.22)
        c2.shift(RIGHT * 1.1)
        self.play(Write(c1), run_time=1.4)
        self.play(Write(c2), run_time=1.2)
        rng = T("always between −1 and 1", 22, C_DIM).next_to(cc, DOWN, buff=0.2).align_to(cc, LEFT)
        self.play(FadeIn(rng), run_time=0.5)
        self.until_end(1.0)

        # 14 — dial from 1 to 0 to −1
        self.say()
        G0 = np.array([PX, -2.0, 0])
        R_ = 1.55
        dial_arc = Arc(radius=R_, start_angle=0, angle=PI, arc_center=G0, color=C_DIM, stroke_width=4)
        # cos = 1 on the right, −1 on the left
        ticks = VGroup()
        words = VGroup()
        for val, txt, w in ((1, "1", "same"), (0, "0", "perpendicular"), (-1, "−1", "opposite")):
            ang = np.arccos(val)          # 0 … π, needle angle measured from the right
            dirv = np.array([np.cos(ang), np.sin(ang), 0])
            ticks.add(Line(G0 + dirv * (R_ - 0.12), G0 + dirv * (R_ + 0.12), color=C_DIM, stroke_width=3))
            ticks.add(M(txt, 22, C_DIM).move_to(G0 + dirv * (R_ + 0.32)))
            wt = T(w, 20, C_DIM)
            if val == 0:
                wt.move_to(G0 + UP * (R_ + 0.68))
            else:
                wt.next_to(G0 + dirv * R_, DOWN, buff=0.15)
            words.add(wt)
        needle = always_redraw(lambda: Line(G0, G0 + 1.35 * np.array(
            [np.cos(np.clip(phi.get_value() - PHI_U, 0, PI)), np.sin(np.clip(phi.get_value() - PHI_U, 0, PI)), 0]),
                                            color=C_W, stroke_width=5))
        hub = Dot(G0, radius=0.07, color=C_W)
        rd = always_redraw(lambda: M(f"cos θ = {fmt(cosr())}", 26, C_W).next_to(G0, DOWN, buff=0.3))
        self.play(Create(dial_arc), FadeIn(ticks), FadeIn(words), FadeIn(hub), run_time=0.8)
        self.add(needle, rd)
        self.play(phi.animate.set_value(PHI_U + 0.001), run_time=1.4)
        self.wait(0.5)
        self.play(phi.animate.set_value(PHI_U + PI / 2), run_time=1.6)
        self.wait(0.5)
        self.play(phi.animate.set_value(PHI_U + PI - 0.001), run_time=1.6)
        self.until_end(0.4)

        # 15 — 4/5, about 37°
        self.say()
        self.play(phi.animate.set_value(PHI_V), run_time=1.6)
        deg = M("cos θ = 4/5  ⇒  θ ≈ 37°", 30, C_W).next_to(rng, DOWN, buff=0.3).align_to(rng, LEFT)
        self.play(FadeIn(deg), run_time=0.7)
        self.until_end(0.8)

        # 16 — cosine similarity
        self.say()
        self.play(FadeOut(VGroup(dial_arc, ticks, words, hub, needle, rd)), run_time=0.5)
        cs = T("cosine similarity", 30, C_W, weight=BOLD)
        at(cs, y=-0.7)
        csn = T("recommenders · embedding search", 22, C_DIM).next_to(cs, DOWN, buff=0.2)
        self.play(Write(cs), run_time=0.8)
        self.play(FadeIn(csn), run_time=0.5)
        self.until_end()

        # 17 — non-zero vectors only
        self.say()
        nz = M("needs <i>u</i> ≠ 0 and <i>v</i> ≠ 0", 28, C_X)
        at(nz, y=-2.1)
        nz2 = T("the zero vector has no direction (÷ 0)", 22, C_DIM).next_to(nz, DOWN, buff=0.2)
        self.play(FadeIn(nz), run_time=0.6)
        self.play(FadeIn(nz2), run_time=0.5)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(cc, rng, deg, cs, csn, nz, nz2, th)), FadeOut(arc), run_time=0.5)

        # 18 — closest point on gold's line
        self.say()
        vline = Line(p.c2p(*(-1.2 * V)), p.c2p(*(2.4 * V)), color=C_V, stroke_width=2, stroke_opacity=0.5)
        t = ValueTracker(-0.3)
        tp = always_redraw(lambda: Dot(p.c2p(*(t.get_value() * V)), radius=0.08, color=C_V))
        seg = always_redraw(lambda: DashedLine(p.c2p(*(t.get_value() * V)), p.c2p(*U), color=WHITE,
                                               stroke_width=3, dash_length=0.08))
        tpl = always_redraw(lambda: M("<i>t</i><i>v</i>", 22, C_V).next_to(p.c2p(*(t.get_value() * V)), LEFT, buff=0.12))
        self.play(Create(vline), FadeOut(self.vl), run_time=0.6)
        self.add(seg, tp, tpl)
        # parabola graph
        ax = Axes(x_range=[-0.5, 2.0, 0.5], y_range=[0, 9, 3], x_length=5.0, y_length=3.0, tips=False,
                  axis_config={"stroke_color": "#5B6475", "stroke_width": 2})
        ax.move_to(np.array([PX + 0.1, 0.3, 0]))
        f = lambda s: 5 - 8 * s + 5 * s * s
        curve = ax.plot(f, x_range=[-0.4, 2.0], color=WHITE, stroke_width=3)
        axl = VGroup(M("<i>t</i>", 22, C_DIM).next_to(ax.c2p(2.0, 0), RIGHT, buff=0.1),
                     M("‖<i>u</i> − <i>t</i><i>v</i>‖<sup>2</sup>", 22, C_DIM).next_to(ax.c2p(-0.5, 9), UP, buff=0.12),
                     M("0", 20, C_DIM).next_to(ax.c2p(-0.5, 0), LEFT, buff=0.1))
        gdot = always_redraw(lambda: Dot(ax.c2p(t.get_value(), f(t.get_value())), radius=0.08, color=C_V))
        live = always_redraw(lambda: M(
            f"<i>t</i> = {fmt(round(t.get_value(), 1))}:   ‖<i>u</i> − <i>t</i><i>v</i>‖<sup>2</sup> = "
            f"{fmt(f(round(t.get_value(), 1)))}", 26).move_to(np.array([PX, 2.6, 0])))
        self.play(Create(ax), FadeIn(axl), run_time=0.8)
        self.add(gdot, live)
        self.play(Create(curve), t.animate.set_value(2.0), run_time=3.0, rate_func=linear)
        self.play(t.animate.set_value(0.8), run_time=1.8)
        self.until_end()

        # 19 — never negative; the lazy gold parabola touches zero
        self.say()
        floor = Line(ax.c2p(-0.5, 0), ax.c2p(2.0, 0), color=C_X, stroke_width=3)
        nn = T("never below 0", 20, C_X).next_to(ax.c2p(2.0, 0), DOWN, buff=0.18).shift(LEFT * 0.8)
        self.play(Create(floor), FadeIn(nn), run_time=0.8)
        g = lambda s: 5 * (1 - 2 * s) ** 2
        lazy = ax.plot(g, x_range=[-0.15, 1.15], color=C_V, stroke_width=2.5)
        lazy = DashedVMobject(lazy, num_dashes=30)
        lz = M("gold = (4, 2) = 2<i>u</i>: touches 0", 20, C_V).next_to(ax.c2p(0.5, 0), DOWN, buff=0.5)
        self.play(Create(lazy), FadeIn(lz), run_time=1.2)
        self.until_end(0.8)

        # 20 — names: Cauchy–Schwarz, triangle inequality, distance
        self.say()
        n1 = T("Cauchy–Schwarz inequality", 26, C_W, weight=BOLD)
        n2 = T("triangle inequality: a detour is never shorter", 22, WHITE)
        n3 = M("distance(<i>u</i>, <i>v</i>) = ‖<i>u</i> − <i>v</i>‖", 24, C_DIM)
        nm = stack([n1, n2, n3], top=-2.3, left=0.4, buff=0.12)
        self.play(FadeIn(n1), run_time=0.6)
        self.play(FadeIn(n2), run_time=0.6)
        self.play(FadeIn(n3), run_time=0.6)
        self.until_end(0.8)

        # 21 — proof begins; graph moves left
        self.say()
        seg.clear_updaters(); tp.clear_updaters(); tpl.clear_updaters(); gdot.clear_updaters(); live.clear_updaters()
        self.play(FadeOut(VGroup(nm, nn, live, seg, tp, tpl, vline, p, self.home, self.uarr, self.ul, self.varr,
                                 self.vl, lz)), run_time=0.6)
        graph = VGroup(ax, axl, curve, lazy, floor, gdot)
        self.play(graph.animate.scale(0.95).move_to(np.array([-3.6, 0.2, 0])), run_time=0.9)
        cast = M("our cast:  ‖<i>u</i> − <i>t</i><i>v</i>‖<sup>2</sup> = 5 − 8<i>t</i> + 5<i>t</i><sup>2</sup>", 22, C_DIM)
        cast.next_to(ax, DOWN, buff=0.75)
        self.play(FadeIn(cast), run_time=0.5)
        L0 = M("if <i>v</i> = 0:  both sides are 0  ✓", 26, C_DIM)
        L1 = M("0 ≤ ‖<i>u</i> − <i>t</i><i>v</i>‖<sup>2</sup>", 26)
        L2 = M("= ‖<i>u</i>‖<sup>2</sup> − 2<i>t</i>(<i>u</i>·<i>v</i>) + <i>t</i><sup>2</sup>‖<i>v</i>‖<sup>2</sup>", 26)
        L3 = M("= ‖<i>v</i>‖<sup>2</sup> (<i>t</i> − <i>u</i>·<i>v</i> / ‖<i>v</i>‖<sup>2</sup>)<sup>2</sup>", 26)
        L4 = M("+ ‖<i>u</i>‖<sup>2</sup> − (<i>u</i>·<i>v</i>)<sup>2</sup> / ‖<i>v</i>‖<sup>2</sup>", 26)
        L5a = M("at <i>t</i> = <i>u</i>·<i>v</i> / ‖<i>v</i>‖<sup>2</sup> the square is 0:", 26, C_DIM)
        L5 = M("0 ≤ ‖<i>u</i>‖<sup>2</sup> − (<i>u</i>·<i>v</i>)<sup>2</sup> / ‖<i>v</i>‖<sup>2</sup>", 26)
        L6 = M("(<i>u</i>·<i>v</i>)<sup>2</sup> ≤ ‖<i>u</i>‖<sup>2</sup> ‖<i>v</i>‖<sup>2</sup>", 28)
        L7 = M("|<i>u</i>·<i>v</i>| ≤ ‖<i>u</i>‖ ‖<i>v</i>‖", 32, C_W)
        proof = stack([L0, L1, L2, L3, L4, L5a, L5, L6, L7], top=2.8, left=0.3, buff=0.2, w=6.5)
        for m_ in (L2, L3, L4):
            m_.shift(RIGHT * 0.5)
        L4.shift(RIGHT * 0.4)
        tg = precise_tag(proof)
        self.play(FadeIn(tg), Write(L0), run_time=1.2)
        self.until_end(0.8)

        # 22 — the parabola, never below zero
        self.say()
        self.play(Write(L1), run_time=0.9)
        self.play(Write(L2), run_time=1.4)
        self.play(Indicate(curve, color=WHITE), run_time=0.8)
        self.until_end(1.2)

        # 23 — complete the square
        self.say()
        self.play(Write(L3), run_time=1.4)
        self.play(Write(L4), run_time=1.3)
        k1 = T("(square ≥ 0)", 20, C_V).next_to(L3, RIGHT, buff=0.2)
        k2 = T("(constant)", 20, C_W).next_to(L4, RIGHT, buff=0.2)
        self.play(FadeIn(k1), FadeIn(k2), run_time=0.6)
        self.until_end(1.2)

        # 24 — at the lowest point the square vanishes
        self.say()
        mdot = Dot(ax.c2p(0.8, 1.8), radius=0.09, color=C_W)
        ml = M("lowest point: <i>t</i> = 4/5,  value 5 − 16/5 = 1.8 ≥ 0", 20, C_W).next_to(cast, DOWN, buff=0.2)
        gdot.set_opacity(0)
        self.play(FadeIn(mdot, scale=1.5), FadeIn(ml), run_time=0.9)
        self.play(FadeIn(L5a), run_time=0.7)
        self.play(Write(L5), run_time=1.4)
        self.until_end(1.2)

        # 25 — rearrange
        self.say()
        self.play(Write(L6), run_time=1.2)
        self.until_end(1.2)

        # 26 — square roots: Cauchy–Schwarz
        self.say()
        self.play(Write(L7), run_time=1.0)
        csb = SurroundingRectangle(L7, color=C_W, buff=0.12, corner_radius=0.08)
        csl = T("Cauchy–Schwarz", 20, C_W).next_to(csb, RIGHT, buff=0.2)
        self.play(Create(csb), FadeIn(csl), run_time=0.8)
        self.until_end(1.2)

        # 27 — what it buys: cosine in [−1, 1]
        self.say()
        self.play(FadeOut(VGroup(L0, L1, L2, L3, L4, L5a, L5, k1, k2, tg)), run_time=0.5)
        top = VGroup(L6, L7, csb, csl)
        self.play(top.animate.shift(UP * (2.6 - top.get_top()[1])), run_time=0.7)
        cs1 = M("⇒  −1 ≤ cos θ = <i>u</i>·<i>v</i> / (‖<i>u</i>‖ ‖<i>v</i>‖) ≤ 1", 28, WHITE)
        cs1.next_to(top, DOWN, buff=0.4).align_to(top, LEFT)
        fit(cs1)
        self.play(Write(cs1), run_time=1.3)
        self.until_end(1.0)

        # 28 — equality
        self.say()
        q1 = P("equality ⇔ <i>u</i>, <i>v</i> linearly dependent", 24, C_V)
        q2 = M("<i>v</i> = 0:  automatic", 24, C_DIM)
        q3 = M("<i>v</i> ≠ 0:  parabola touches 0  ⇔  <i>u</i> = <i>t</i><i>v</i>", 24, C_DIM)
        qq = stack([q1, q2, q3], top=cs1.get_bottom()[1] - 0.45, left=0.3, buff=0.18)
        self.play(FadeIn(q1), run_time=0.7)
        self.play(FadeIn(q2), run_time=0.6)
        self.play(FadeIn(q3), Indicate(lazy, color=C_V), run_time=0.9)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(graph, mdot, ml, cast, cs1, qq, L6)), VGroup(L7, csb, csl).animate.shift(UP * 0.0),
                  run_time=0.6)

        # 29 — triangle inequality
        self.say()
        p2 = plane((-1, 5), (-1, 5), unit=0.7).to_edge(LEFT, buff=0.7).shift(DOWN * 0.4)
        ua = vec(p2, *U, C_U, width=6)
        va = vec(p2, *V, C_V, start=tuple(U), width=6)
        wa = vec(p2, 3, 3, C_P, width=6)
        wl = M("<i>u</i> + <i>v</i>", 24, C_P).next_to(p2.c2p(1.5, 1.5), UL, buff=0.1)
        self.play(FadeIn(p2), GrowArrow(ua), run_time=0.7)
        self.play(GrowArrow(va), run_time=0.6)
        self.play(GrowArrow(wa), FadeIn(wl), run_time=0.6)
        self.play(VGroup(L7, csb, csl).animate.scale(0.8).move_to(np.array([PX, 2.6, 0])), run_time=0.6)
        t1 = M("‖<i>u</i> + <i>v</i>‖<sup>2</sup> = ‖<i>u</i>‖<sup>2</sup> + 2 <i>u</i>·<i>v</i> + ‖<i>v</i>‖<sup>2</sup>", 26)
        t2 = M("≤ ‖<i>u</i>‖<sup>2</sup> + 2‖<i>u</i>‖ ‖<i>v</i>‖ + ‖<i>v</i>‖<sup>2</sup>", 26)
        t3 = M("= (‖<i>u</i>‖ + ‖<i>v</i>‖)<sup>2</sup>", 26)
        t4 = M("⇒  ‖<i>u</i> + <i>v</i>‖ ≤ ‖<i>u</i>‖ + ‖<i>v</i>‖", 30, C_W)
        tri = stack([t1, t2, t3, t4], top=1.9, left=0.4, buff=0.22)
        t2.shift(RIGHT * 1.15)
        t3.shift(RIGHT * 1.15)
        self.play(Write(t1), run_time=1.4)
        self.wait(0.5)
        self.play(Write(t2), Indicate(VGroup(L7, csb), color=C_W), run_time=1.4)
        self.play(Write(t3), run_time=1.0)
        self.play(Write(t4), run_time=1.0)
        self.until_end(1.2)

        # 30 — numbers
        self.say()
        x1 = M("straight:  ‖(3, 3)‖ = 3√2 ≈ 4.24", 28, C_P)
        x2 = M("detour:  √5 + √5 ≈ 4.47", 28, WHITE)
        xx = stack([x1, x2], top=-1.55, left=0.4, buff=0.22)
        self.play(FadeIn(x1), Indicate(wa, color=C_P), run_time=1.0)
        self.wait(0.6)
        self.play(FadeIn(x2), Indicate(VGroup(ua, va), color=WHITE), run_time=1.0)
        self.until_end(1.0)

        # 31 — never longer
        self.say()
        x3 = M("4.24 ≤ 4.47", 30, C_W).next_to(xx, DOWN, buff=0.3).align_to(xx, LEFT)
        self.play(Write(x3), run_time=0.8)
        self.until_end(1.0)
        self.wipe()

    # ------------------------------------------------------------------ 9.3
    def act93(self):
        O = np.array([-3.6, -0.9, 0])
        s = 1.55
        X, Y, Z = np.array([1.0, -0.12, 0]), np.array([-0.55, -0.42, 0]), np.array([0, 1.0, 0])
        es = [X, Y, Z]
        cols = [WHITE, WHITE, WHITE]
        arrows = VGroup(*[Arrow(O, O + s * e, buff=0, color=c, stroke_width=6, tip_length=0.2)
                          for e, c in zip(es, cols)])
        labs = VGroup(M("<i>v</i><sub>1</sub>", 26).next_to(O + s * X, RIGHT, buff=0.1),
                      M("<i>v</i><sub>2</sub>", 26).next_to(O + s * Y, DL, buff=0.05),
                      M("<i>v</i><sub>3</sub>", 26).next_to(O + s * Z, UP, buff=0.1))
        a_ = 0.28
        marks = VGroup(*[VMobject(stroke_color=C_DIM, stroke_width=2).set_points_as_corners(
            [O + a_ * es[i], O + a_ * es[i] + a_ * es[j], O + a_ * es[j]]) for i, j in ((0, 1), (0, 2), (1, 2))])

        # 32 — orthogonal
        self.say()
        self.play(LaggedStart(*[GrowArrow(a) for a in arrows], lag_ratio=0.25), FadeIn(labs), run_time=1.3)
        self.play(Create(marks), run_time=0.6)
        o1 = T("orthogonal", 32, WHITE, weight=BOLD)
        o2 = M("<i>v<sub>i</sub></i> · <i>v<sub>j</sub></i> = 0", 30, C_DIM)
        oo = row(o1, o2, buff=0.5)
        at(oo, y=2.3)
        self.play(Write(o1), FadeIn(o2), run_time=0.9)
        self.until_end()

        # 33 — non-zero + mutually orthogonal ⇒ independent
        self.say()
        sh = VGroup(*[Dot(O, radius=0.09, color=C_V) for _ in range(1)])
        shl = T("each one's shadow on the others: 0", 22, C_V)
        at(shl, y=1.35)
        self.play(FadeIn(sh, scale=2), FadeIn(shl), Indicate(arrows, color=C_V), run_time=1.0)
        th = P("mutually orthogonal, <b>non-zero</b>  ⇒  independent", 26, C_W)
        at(th, y=0.55)
        self.play(FadeIn(th, shift=UP * 0.15), run_time=0.8)
        self.until_end()

        # 34 — the reverse fails: blue and gold
        self.say()
        self.play(FadeOut(VGroup(arrows, labs, marks, sh)), run_time=0.5)
        p = plane((-1, 3), (-1, 3), unit=0.75).move_to(np.array([-3.6, -0.6, 0]))
        ua, va = vec(p, *U, C_U, width=6), vec(p, *V, C_V, width=6)
        arc = Arc(radius=0.6, start_angle=PHI_U, angle=PHI_V - PHI_U, arc_center=p.c2p(0, 0), color=WHITE)
        al = M("≈ 37°", 22).move_to(p.c2p(0, 0) + 1.0 * np.array([np.cos(0.785), np.sin(0.785), 0]))
        self.play(FadeIn(p), GrowArrow(ua), GrowArrow(va), run_time=0.8)
        self.play(Create(arc), FadeIn(al), run_time=0.6)
        rv = VGroup(M("independent  ✓", 26, C_W), M("perpendicular  ✗   (<i>u</i>·<i>v</i> = 4)", 26, C_X)).arrange(
            DOWN, buff=0.2, aligned_edge=LEFT)
        at(rv, y=-0.6)
        self.play(FadeIn(rv[0]), run_time=0.6)
        self.play(FadeIn(rv[1]), run_time=0.6)
        self.until_end(0.8)

        # 35 — proof: dot both sides with v_j
        self.say()
        self.play(FadeOut(VGroup(p, ua, va, arc, al, rv, sh, shl, th)), oo.animate.scale(0.8).move_to(
            np.array([-3.4, 2.5, 0])), run_time=0.7)
        A1 = M("suppose  Σ<sub><i>i</i></sub> <i>c<sub>i</sub></i> <i>v<sub>i</sub></i> = 0", 30)
        A1n = T("(all vᵢ non-zero, mutually orthogonal)", 20, C_DIM)
        A2 = M("dot both sides with <i>v<sub>j</sub></i>:", 28, C_DIM)
        t_1 = M("<i>c</i><sub>1</sub>(<i>v</i><sub>1</sub>·<i>v<sub>j</sub></i>)", 28)
        t_d1 = M("+ ⋯ +", 28)
        t_j = M("<i>c<sub>j</sub></i>(<i>v<sub>j</sub></i>·<i>v<sub>j</sub></i>)", 28, C_W)
        t_d2 = M("+ ⋯ +", 28)
        t_k = M("<i>c<sub>k</sub></i>(<i>v<sub>k</sub></i>·<i>v<sub>j</sub></i>)", 28)
        t_e = M("= 0", 28)
        A3 = row(t_1, t_d1, t_j, t_d2, t_k, t_e, buff=0.15)
        A4 = M("<i>c<sub>j</sub></i> ‖<i>v<sub>j</sub></i>‖<sup>2</sup> = 0", 32, C_W)
        A5 = M("‖<i>v<sub>j</sub></i>‖ ≠ 0  ⇒  <i>c<sub>j</sub></i> = 0", 32, C_W)
        A6 = T("for every j: the only round trip is doing nothing", 24, C_V)
        pf = VGroup(A1, A1n, A2, A3, A4, A5, A6).arrange(DOWN, buff=0.32, aligned_edge=LEFT)
        fit(pf, 12.4)
        pf.move_to(np.array([-6.2 + pf.width / 2, 1.85 - pf.height / 2, 0]))
        A1n.shift(RIGHT * 0.4)
        tg = precise_tag(pf)
        tg.next_to(oo, RIGHT, buff=0.6)
        self.play(FadeIn(tg), Write(A1), FadeIn(A1n), run_time=1.4)
        self.wait(0.5)
        self.play(FadeIn(A2), run_time=0.6)
        self.play(FadeIn(A3, lag_ratio=0.15), run_time=1.4)
        self.until_end(1.0)

        # 36 — strike the cross terms
        self.say()
        strikes = VGroup()
        for term in (t_1, t_d1, t_d2, t_k):
            strikes.add(Line(term.get_corner(DL), term.get_corner(UR), color=C_X, stroke_width=4))
        zl = T("i ≠ j: vᵢ·vⱼ = 0", 20, C_X).next_to(A3, RIGHT, buff=0.4)
        self.play(LaggedStart(*[Create(s_) for s_ in strikes], lag_ratio=0.25), FadeIn(zl), run_time=1.4)
        self.play(TransformFromCopy(t_j, A4), run_time=1.2)
        self.until_end(1.2)

        # 37 — so every amount is zero
        self.say()
        self.play(Write(A5), run_time=1.2)
        self.wait(0.6)
        self.play(FadeIn(A6, shift=UP * 0.1), run_time=0.8)
        self.until_end(1.0)
        self.wipe()

    # ------------------------------------------------------------------ 9.4
    def act94(self):
        # 38 — a simplified model
        self.say()
        sm = boxed(col(T("a simplified model of superposition", 30, WHITE, weight=BOLD),
                       T("it illustrates the algebra — not a universal account of how networks decode features",
                         20, C_DIM), buff=0.2, aligned=ORIGIN), color=C_DIM, buff=0.25)
        fit(sm, 12.5).move_to(np.array([0, 2.4, 0]))
        a5 = T("Act 5: at most n independent directions in ℝⁿ", 22, C_DIM).move_to(np.array([0, 1.15, 0]))
        self.play(FadeIn(a5), run_time=0.6)
        self.play(FadeIn(sm, shift=DOWN * 0.15), run_time=0.9)
        self.until_end()

        # 39 — more features than dimensions
        self.say()
        mf = M("more feature directions than dimensions  ⇒  they can't all be perpendicular", 26, C_V)
        fit(mf, 12.5).move_to(np.array([0, 0.2, 0]))
        self.play(FadeIn(mf), run_time=0.8)
        self.until_end(0.8)
        chip = boxed(T("a simplified model of superposition", 20, C_DIM), color=C_DIM, buff=0.12).to_corner(UR, buff=0.3)
        self.play(FadeOut(VGroup(a5, mf)), ReplacementTransform(sm, chip), run_time=0.7)

        # 40 — the party: each mic at its own speaker
        self.say()
        C = np.array([-3.4, -0.6, 0])
        S = [C + 2.3 * np.array([np.cos(a), np.sin(a), 0]) for a in (PI / 2 + 0.6, PI / 2 - 0.6 + 0.0, -PI / 2)]
        S = [C + np.array([-2.2, 1.6, 0]), C + np.array([2.2, 1.6, 0]), C + np.array([0, -2.25, 0])]
        cols = [C_U, C_V, C_F3]
        people = VGroup(*[person(c).move_to(sp) for c, sp in zip(cols, S)])
        names = VGroup(*[T(f"speaker {k + 1}", 20, cols[k]).next_to(people[k], UP if k < 2 else DOWN, buff=0.1)
                         for k in range(3)])
        Mp = [C + 0.5 * (sp - C) for sp in S]
        base = mic()
        mics = VGroup(*[aim(base, Mp[k], S[k]) for k in range(3)])
        waves = VGroup(*[DashedLine(S[k], Mp[k], color=cols[k], stroke_width=3, dash_length=0.1, buff=0.35)
                         for k in range(3)])
        self.play(LaggedStart(*[FadeIn(pp, shift=UP * 0.1) for pp in people], lag_ratio=0.2), FadeIn(names),
                  run_time=1.0)
        self.play(FadeIn(mics), run_time=0.6)
        self.play(Create(waves), run_time=0.9)
        h1 = T("mic k hears: only speaker k", 22, WHITE)
        at(h1, y=1.0)
        self.play(FadeIn(h1), run_time=0.5)
        self.until_end()

        # 41 — angled mics pick up the neighbours
        self.say()
        mics2 = VGroup(*[aim(base, Mp[k], C + 0.15 * (S[k] - C) + 0.0) for k in range(3)])
        leak = VGroup()
        for k in range(3):
            for j in range(3):
                if j != k:
                    leak.add(DashedLine(S[j], Mp[k], color=cols[j], stroke_width=2, dash_length=0.08,
                                        buff=0.35).set_opacity(0.55))
        self.play(Transform(mics, mics2), run_time=1.2)
        self.play(Create(leak), run_time=1.2)
        h2 = T("each mic picks up some of the neighbours", 22, C_X)
        at(h2, y=0.2)
        self.play(FadeIn(h2), run_time=0.5)
        self.until_end(0.6)
        self.play(FadeOut(VGroup(people, names, mics, waves, leak, h1, h2)), run_time=0.6)

        # 42 — three feature directions in a plane
        self.say()
        p = plane((-2, 2), (-2, 2), unit=1.1).move_to(np.array([-3.7, -0.5, 0]))
        F = [np.array([1.0, 0.0]), np.array([-0.5, np.sqrt(3) / 2]), np.array([-0.5, -np.sqrt(3) / 2])]
        fa = VGroup(*[vec(p, *F[k], cols[k], width=6) for k in range(3)])
        fl = VGroup(M("<i>f</i><sub>1</sub>", 26, C_U).next_to(fa[0].get_end(), RIGHT, buff=0.08),
                    M("<i>f</i><sub>2</sub>", 26, C_V).next_to(fa[1].get_end(), UL, buff=0.05),
                    M("<i>f</i><sub>3</sub>", 26, C_F3).next_to(fa[2].get_end(), DL, buff=0.05))
        self.play(FadeIn(p), run_time=0.5)
        self.play(LaggedStart(*[GrowArrow(a) for a in fa], lag_ratio=0.25), FadeIn(fl), run_time=1.2)
        d120 = T("120° apart, in ℝ²", 22, C_DIM)
        at(d120, y=2.4)
        self.play(FadeIn(d120), run_time=0.5)
        self.until_end()

        # 43 — features 1 and 2 on
        self.say()
        X = F[0] + F[1]
        xa = vec(p, *X, WHITE, width=6)
        xl = M("<i>x</i> = <i>f</i><sub>1</sub> + <i>f</i><sub>2</sub>", 24).next_to(xa.get_end(), UR, buff=0.06)
        chips = VGroup(*[T(f"feature {k + 1}: {'on' if k < 2 else 'off'}", 22, cols[k] if k < 2 else C_DIM)
                         for k in range(3)]).arrange(RIGHT, buff=0.4)
        at(chips, y=1.6)
        self.play(FadeIn(chips), run_time=0.6)
        self.play(GrowArrow(xa), FadeIn(xl), run_time=0.9)
        self.until_end()

        # 44 — readouts ½, ½, −1
        self.say()
        Z0 = -2.35
        unit_h = 0.85
        bars, blabs, vals = VGroup(), VGroup(), VGroup()
        readings = [0.5, 0.5, -1.0]
        rtxt = ["½", "½", "−1"]
        for k in range(3):
            xk = 1.9 + 1.55 * k
            h = readings[k] * unit_h
            b_ = Rectangle(width=0.55, height=abs(h), stroke_width=0).set_fill(cols[k], 0.85)
            b_.move_to(np.array([xk, Z0 + h / 2, 0]))
            bars.add(b_)
            lb = M(f"<i>f</i><sub>{k + 1}</sub><sup>T</sup><i>x</i>", 22, cols[k])
            lb.move_to(np.array([xk, Z0 + (-0.35 if h > 0 else 0.35), 0]))
            blabs.add(lb)
            vl = M(rtxt[k], 26, WHITE).next_to(b_, UP if h > 0 else DOWN, buff=0.1)
            vals.add(vl)
        zero = Line(np.array([1.3, Z0, 0]), np.array([6.6, Z0, 0]), color=C_DIM, stroke_width=2)
        one = DashedLine(np.array([1.3, Z0 + unit_h, 0]), np.array([6.6, Z0 + unit_h, 0]), color=C_DIM,
                         stroke_width=1.5, dash_length=0.08)
        onel = M("1", 20, C_DIM).next_to(one, LEFT, buff=0.08)
        rdt = T("microphone readouts (dot products)", 20, C_DIM)
        at(rdt, y=0.75)
        self.play(FadeIn(zero), FadeIn(one), FadeIn(onel), FadeIn(rdt), FadeIn(blabs), run_time=0.6)
        self.play(GrowFromEdge(bars[0], DOWN), FadeIn(vals[0]), run_time=0.8)
        self.wait(0.4)
        self.play(GrowFromEdge(bars[1], DOWN), FadeIn(vals[1]), run_time=0.6)
        self.wait(0.3)
        self.play(GrowFromEdge(bars[2], UP), FadeIn(vals[2]), run_time=0.8)
        self.until_end(0.6)

        # 45 — cross-talk
        self.say()
        ct = T("cross-talk / interference", 28, C_X, weight=BOLD)
        at(ct, y=0.75)
        ct2 = T("= the dot products between feature directions", 20, C_DIM)
        self.play(FadeOut(rdt), Write(ct), run_time=0.8)
        ct2.next_to(ct, DOWN, buff=0.12)
        self.play(FadeIn(ct2), run_time=0.5)
        self.until_end(0.8)

        # 46 — formula: encoding
        self.say()
        self.play(FadeOut(VGroup(chips, ct, ct2, d120)), run_time=0.5)
        F1 = M("<i>x</i> = Σ<sub><i>i</i></sub> <i>a<sub>i</sub></i> <i>f<sub>i</sub></i>    (<i>f<sub>i</sub></i> unit vectors)", 28)
        at(F1, y=2.2)
        tg = precise_tag(F1)
        self.play(FadeIn(tg), Write(F1), run_time=1.4)
        self.until_end(1.0)

        # 47 — readout = signal + cross-talk
        self.say()
        f_a = M("<i>f<sub>j</sub></i><sup>T</sup><i>x</i> =", 30)
        f_b = M("<i>a<sub>j</sub></i>", 30, C_W)
        f_c = M("+ Σ<sub><i>i</i>≠<i>j</i></sub> <i>a<sub>i</sub></i> <i>f<sub>j</sub></i><sup>T</sup><i>f<sub>i</sub></i>", 30, C_X)
        F2 = row(f_a, f_b, f_c, buff=0.18)
        at(F2, y=1.35)
        lb1 = T("the signal", 20, C_W).next_to(f_b, DOWN, buff=0.12)
        lb2 = T("cross-talk", 20, C_X).next_to(f_c, DOWN, buff=0.12)
        self.play(Write(f_a), run_time=0.7)
        self.play(Write(f_b), FadeIn(lb1), run_time=0.8)
        self.wait(1.2)
        self.play(Write(f_c), FadeIn(lb2), run_time=1.3)
        self.until_end(1.2)

        # 48 — the numbers
        self.say()
        F3 = M("120°:  <i>f<sub>i</sub></i><sup>T</sup><i>f<sub>j</sub></i> = −½", 26, C_DIM)
        F4 = M("<i>f</i><sub>1</sub><sup>T</sup><i>x</i> = 1 − ½ = ½,    <i>f</i><sub>2</sub><sup>T</sup><i>x</i> = ½", 26)
        F5 = M("<i>f</i><sub>3</sub><sup>T</sup><i>x</i> = −½ − ½ = −1", 26)
        nums = stack([F3, F4, F5], top=0.6, left=0.6, buff=0.18)
        self.play(FadeIn(F3), run_time=0.6)
        self.play(Write(F4), Indicate(VGroup(bars[0], bars[1]), color=WHITE), run_time=1.3)
        self.play(Write(F5), Indicate(bars[2], color=WHITE), run_time=1.1)
        self.until_end(1.2)

        # 49 — small overlaps help, but they add up
        self.say()
        self.play(FadeOut(VGroup(F3, F4, F5)), run_time=0.4)
        w1 = T("small overlaps help", 24, C_W)
        w2 = T("but the total depends on how many features are on, and how strongly:", 20, C_DIM)
        w3 = T("many small overlaps can add up", 24, C_X)
        ww = stack([w1, w2, w3], top=0.6, left=0.4, buff=0.15)
        self.play(FadeIn(w1), run_time=0.6)
        self.wait(1.5)
        self.play(FadeIn(w2), run_time=0.6)
        self.play(FadeIn(w3), Indicate(f_c, color=C_X), run_time=0.9)
        self.until_end(1.0)
        self.wipe()

        # 50 — the Gram matrix as a table of overlaps
        self.say()
        cell = 1.05
        T0 = np.array([-4.3, 0.9, 0])
        hdr_c = VGroup(M("<i>u</i>", 28, C_U), M("<i>v</i>", 28, C_V))
        hdr_r = VGroup(M("<i>u</i>", 28, C_U), M("<i>v</i>", 28, C_V))
        vals_ = [["<i>u</i>·<i>u</i> = 5", "<i>u</i>·<i>v</i> = 4"], ["<i>v</i>·<i>u</i> = 4", "<i>v</i>·<i>v</i> = 5"]]
        boxes, ents = VGroup(), VGroup()
        for i in range(2):
            for j in range(2):
                ctr = T0 + np.array([(j + 0.5) * 2.0, -(i + 0.5) * cell, 0])
                boxes.add(Rectangle(width=2.0, height=cell, stroke_color=C_DIM, stroke_width=1.5).move_to(ctr))
                ents.add(M(vals_[i][j], 24).move_to(ctr))
        for j in range(2):
            hdr_c[j].move_to(T0 + np.array([(j + 0.5) * 2.0, 0.35, 0]))
            hdr_r[j].move_to(T0 + np.array([-0.35, -(j + 0.5) * cell, 0]))
        table = VGroup(boxes, ents, hdr_c, hdr_r)
        gm = T("Gram matrix", 30, WHITE, weight=BOLD).next_to(table, UP, buff=0.35)
        sub = T("every pairwise dot product", 20, C_DIM).next_to(gm, DOWN, buff=0.1)
        self.play(FadeIn(boxes), FadeIn(hdr_c), FadeIn(hdr_r), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(e) for e in ents], lag_ratio=0.25), run_time=1.2)
        self.play(Write(gm), run_time=0.7)
        sub.next_to(table, DOWN, buff=0.3)
        self.play(FadeIn(sub), run_time=0.4)
        self.until_end()

        # 51 — diagonal vs off-diagonal
        self.say()
        dg = VGroup(boxes[0].copy(), boxes[3].copy()).set_stroke(C_W, 4)
        od = VGroup(boxes[1].copy(), boxes[2].copy()).set_stroke(C_X, 4)
        dgl = T("diagonal: squared lengths", 22, C_W)
        odl = T("off-diagonal: the overlaps (cross-talk)", 22, C_X)
        dl = stack([dgl, odl], top=-2.0, left=-6.2, buff=0.15)
        self.play(Create(dg), FadeIn(dgl), run_time=0.9)
        self.wait(0.6)
        self.play(Create(od), FadeIn(odl), run_time=0.9)
        self.until_end(0.6)

        # 52 — detects dead weight
        self.say()
        dw = M("dependent  ⇔  some recipe <i>c</i> ≠ 0 gives ‖<i>Vc</i>‖ = 0", 26, C_V)
        at(dw, y=2.35)
        self.play(FadeIn(dw), run_time=0.8)
        self.until_end(0.8)

        # 53 — precise: G = VᵀV
        self.say()
        g1 = M("<i>G</i> = <i>V</i><sup>T</sup><i>V</i>,    <i>G<sub>ij</sub></i> = <i>v<sub>i</sub></i><sup>T</sup><i>v<sub>j</sub></i>", 30)
        at(g1, y=1.35)
        tg = precise_tag(g1)
        Gm = mm([["5", "4"], ["4", "5"]], size=32)
        Gm.entries[0][0].set_color(C_W); Gm.entries[1][1].set_color(C_W)
        Gm.entries[0][1].set_color(C_X); Gm.entries[1][0].set_color(C_X)
        g2 = row(M("<i>V</i> = [ <i>u</i>  <i>v</i> ]:   <i>G</i> =", 30), Gm, buff=0.2)
        at(g2, y=0.15)
        self.play(FadeIn(tg), Write(g1), run_time=1.4)
        self.wait(0.6)
        self.play(FadeIn(g2[0]), TransformFromCopy(ents, Gm), run_time=1.3)
        self.until_end(1.2)
        # question + pause
        qa = boxed(M("Question: what is <i>c</i><sup>T</sup><i>G</i><i>c</i>, in terms of the moves?", 26, C_V), color=C_V, buff=0.18)
        at(qa, y=-1.25)
        self.play(FadeIn(qa, shift=UP * 0.15), run_time=0.6)
        self.wait(3.5)

        # 54 — the identity
        self.say()
        self.play(FadeOut(VGroup(table, gm, sub, dg, od, dgl, odl, dw)), run_time=0.5)
        self.play(VGroup(g1, tg, g2).animate.shift(UP * 1.0), run_time=0.6)
        id1 = M("<i>c</i><sup>T</sup><i>G</i><i>c</i> = <i>c</i><sup>T</sup><i>V</i><sup>T</sup><i>V</i><i>c</i>"
                " = (<i>Vc</i>)<sup>T</sup>(<i>Vc</i>) = ‖<i>Vc</i>‖<sup>2</sup>", 32, C_W)
        at(id1, x=0, y=-0.6, w=12.5)
        self.play(FadeOut(qa), run_time=0.3)
        self.play(Write(id1), run_time=2.0)
        chk = M("check, <i>c</i> = (1, 2):   <i>c</i><sup>T</sup><i>G</i><i>c</i> = 5 + 8 + 8 + 20 = 41 = ‖(4, 5)‖<sup>2</sup>", 24, C_DIM)
        at(chk, x=0, y=-1.45, w=12.5)
        self.play(FadeIn(chk), run_time=0.8)
        self.until_end(1.2)

        # 55 — same dead weight: G c = 0 ⇔ V c = 0
        self.say()
        z1 = M("<i>Gc</i> = 0  ⇒  <i>c</i><sup>T</sup><i>G</i><i>c</i> = 0  ⇒  ‖<i>Vc</i>‖<sup>2</sup> = 0  ⇒  <i>Vc</i> = 0", 28)
        z2 = M("(and <i>Vc</i> = 0  ⇒  <i>Gc</i> = <i>V</i><sup>T</sup>(<i>Vc</i>) = 0)", 24, C_DIM)
        zz = VGroup(z1, z2).arrange(DOWN, buff=0.2)
        at(zz, x=0, y=-2.45, w=12.5)
        self.play(Write(z1), run_time=2.0)
        self.play(FadeIn(z2), run_time=0.7)
        self.until_end(1.0)

        # 56 — the theorem
        self.say()
        thm = boxed(M("<i>Gc</i> = 0  ⇔  <i>Vc</i> = 0", 32, C_W), color=C_W, buff=0.18)
        thl = T("same dead weight", 22, C_W)
        tr = row(thm, thl, buff=0.4)
        at(tr, x=0, y=-3.4, w=12.5)
        self.play(FadeIn(tr, shift=UP * 0.1), run_time=0.8)
        self.until_end(1.0)
        self.wipe()

        # question + pause before the changed-coordinate geometry
        q2 = boxed(M("Question: in a skewed grid, is the dot product of two <i>addresses</i>"
                     " the dot product of the <i>vectors</i>?", 26, C_V), color=C_V, buff=0.2)
        at(q2, x=0, y=0.3, w=12.5)
        self.play(FadeIn(q2, shift=UP * 0.15), run_time=0.7)
        self.wait(3.5)

        # 57 — dot products depend on geometry
        self.say()
        pt = plane((-2, 3), (-2, 3), unit=0.92).to_edge(LEFT, buff=0.6).shift(DOWN * 0.4)
        grid = skew_grid(pt, (2, 1), (-1, 1), (-2, 3), (-2, 3), C_T, opacity=0.45)
        e1a = vec(pt, 1, 0, WHITE, width=6)
        e2a = vec(pt, 0, 1, WHITE, width=6)
        e1l = M("<i>e</i><sub>1</sub>", 24).next_to(e1a.get_end(), DOWN, buff=0.12)
        e2l = M("<i>e</i><sub>2</sub>", 24).next_to(e2a.get_end(), LEFT, buff=0.12)
        rt = VMobject(stroke_color=WHITE, stroke_width=2).set_points_as_corners(
            [pt.c2p(0.18, 0), pt.c2p(0.18, 0.18), pt.c2p(0, 0.18)])
        self.play(FadeOut(q2), FadeIn(pt), run_time=0.6)
        self.play(FadeIn(grid), run_time=0.6)
        self.play(GrowArrow(e1a), GrowArrow(e2a), FadeIn(e1l), FadeIn(e2l), Create(rt), run_time=0.9)
        r1 = M("<i>e</i><sub>1</sub> · <i>e</i><sub>2</sub> = 0   (perpendicular)", 28)
        at(r1, y=2.4)
        self.play(FadeIn(r1), run_time=0.6)
        self.until_end()

        # 58 — addresses in the skewed (teal) grid
        self.say()
        q1a = vec(pt, 2, 1, C_T, width=4)
        q2a = vec(pt, -1, 1, C_T, width=4)
        p1 = VGroup(DashedLine(pt.c2p(0, 0), pt.c2p(2 / 3, 1 / 3), color=C_T, stroke_width=3, dash_length=0.06),
                    DashedLine(pt.c2p(2 / 3, 1 / 3), pt.c2p(1, 0), color=C_T, stroke_width=3, dash_length=0.06))
        p2 = VGroup(DashedLine(pt.c2p(0, 0), pt.c2p(2 / 3, 1 / 3), color=C_T, stroke_width=3, dash_length=0.06),
                    DashedLine(pt.c2p(2 / 3, 1 / 3), pt.c2p(0, 1), color=C_T, stroke_width=3, dash_length=0.06))
        ad1 = M("(⅓, −⅓)", 22, C_T).next_to(pt.c2p(1, 0), RIGHT, buff=0.35)
        ad2 = M("(⅓, ⅔)", 22, C_T).next_to(pt.c2p(0, 1), UP, buff=0.2)
        self.play(GrowArrow(q1a), GrowArrow(q2a), run_time=0.7)
        self.play(Create(p1), FadeIn(ad1), run_time=0.8)
        self.play(Create(p2), FadeIn(ad2), run_time=0.8)
        cap = boxed(col(T("the dot product of the addresses", 22, C_X), T("≠ the dot product of the vectors", 22, C_X),
                        buff=0.08, aligned=ORIGIN), color=C_X, buff=0.15)
        at(cap, y=1.45)
        self.play(FadeIn(cap), run_time=0.6)
        self.until_end(0.8)

        # 59 — carry the geometry along
        self.say()
        ge = col(T("geometry is extra structure:", 22, WHITE), T("carry it along when you change grids", 22, WHITE),
                 buff=0.08, aligned=ORIGIN)
        at(ge, y=0.3)
        self.play(FadeIn(ge), run_time=0.7)
        self.until_end(0.6)

        # 60 — positive definite (named)
        self.say()
        pd = VGroup(T("positive definite", 26, C_V, weight=BOLD), T("(met properly in later chapters)", 20, C_DIM)
                    ).arrange(RIGHT, buff=0.25)
        at(pd, y=-0.75)
        self.play(Write(pd[0]), run_time=0.8)
        self.play(FadeIn(pd[1]), run_time=0.5)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(r1, cap, ge, pd)), run_time=0.5)

        # 61 — the exact fix
        self.say()
        x1 = M("<i>x</i> = <i>B</i><i>c</i>,   <i>y</i> = <i>B</i><i>d</i>", 30)
        x2 = M("<i>x</i><sup>T</sup><i>y</i> = (<i>Bc</i>)<sup>T</sup>(<i>Bd</i>) = <i>c</i><sup>T</sup>(<i>B</i><sup>T</sup><i>B</i>)<i>d</i>", 30, C_W)
        xs = stack([x1, x2], top=2.75, left=0.4, buff=0.25)
        tg = precise_tag(xs)
        self.play(FadeIn(tg), Write(x1), run_time=1.0)
        self.wait(0.5)
        self.play(Write(x2), run_time=1.6)
        self.until_end(1.2)

        # 62 — leave it out and it's wrong
        self.say()
        x3 = M("plain <i>c</i><sup>T</sup><i>d</i> is wrong unless <i>B</i><sup>T</sup><i>B</i> = <i>I</i>", 26, C_X)
        x3.next_to(xs, DOWN, buff=0.3).align_to(xs, LEFT)
        mid = SurroundingRectangle(VGroup(*x2[-6:-1]), color=C_V, buff=0.06)
        self.play(Create(mid), run_time=0.6)
        self.play(FadeIn(x3), run_time=0.7)
        self.until_end(1.0)

        # 63 — the −1/9 example
        self.say()
        y1 = col(M("plain:  (⅓)(⅓) + (−⅓)(⅔)", 26, C_X), M("= 1/9 − 2/9 = −1/9   ✗", 26, C_X), buff=0.12)
        y1[1].shift(RIGHT * 0.9)
        QtQ = mm([["5", "−1"], ["−1", "2"]], size=24, cols=[C_T, C_T])
        y2 = row(M("with <i>Q</i><sup>T</sup><i>Q</i> =", 24, C_T), QtQ, M(":  <i>c</i><sup>T</sup>(<i>Q</i><sup>T</sup><i>Q</i>)<i>d</i> = 0  ✓", 24, C_W),
                 buff=0.15)
        y0 = M("true:  <i>e</i><sub>1</sub> · <i>e</i><sub>2</sub> = 0", 26, WHITE)
        ys = stack([y0, y1, y2], top=x3.get_bottom()[1] - 0.35, left=0.4, buff=0.25)
        self.play(FadeIn(y0), Indicate(rt, color=WHITE), run_time=0.8)
        self.play(Write(y1), Indicate(VGroup(ad1, ad2), color=C_T), run_time=1.6)
        self.wait(0.6)
        self.play(FadeIn(y2), run_time=0.9)
        self.until_end(1.2)

        # 64 — positive definite, defined
        self.say()
        pdd = boxed(col(T("positive definite:", 22, C_V, weight=BOLD),
                        M("<i>M</i><sup>T</sup> = <i>M</i>  and  <i>z</i><sup>T</sup><i>M</i><i>z</i> &gt; 0"
                          "  for every  <i>z</i> ≠ 0", 26, C_V), buff=0.1), color=C_V, buff=0.18)
        at(pdd, y=ys.get_bottom()[1] - 0.6)
        self.play(FadeIn(pdd, shift=UP * 0.1), run_time=0.9)
        self.until_end(1.0)
