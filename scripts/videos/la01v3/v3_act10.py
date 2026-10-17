"""LA01 v3 — Act 10: Fragile addresses (near-dependence, conditioning, Hadamard ratio, elimination,
pivots, tolerance, numerical rank)."""
from common import *
from v3_act1 import craft, dimmed

C_R = "#FC6255"      # fragile / near-parallel (red)


def fg(x, sig=3):
    """Compact number, at most `sig` significant figures, Unicode minus."""
    s = f"{x:.{sig}g}"
    if "e" in s:
        s = f"{x:.0f}"
    return s.replace("-", "−")


def fe(x):
    """ε rounded once to two significant figures (every ε-derived readout uses this value)."""
    return float(f"{x:.2g}")


def glyph_box(mob, color, buff=0.06):
    return SurroundingRectangle(mob, color=color, buff=buff, stroke_width=3, corner_radius=0.05)


class V3Act10(NScene):
    BEATS = [
        # 0
        "Act ten. Fragile addresses.",
        # 1 — 10.1
        "Let's end with a twist. Two moves that are independent still form a perfectly good basis, right? Every "
        "place has exactly one address. True. But watch what happens when two moves are almost parallel.",
        # 2
        "To go one step straight up, the craft has to fly far out along red, and almost all the way back along "
        "blue.",
        # 3
        "As the two moves get closer together, the trip gets longer and longer. When they're a hundredth apart, "
        "you're flying a hundred steps out and a hundred steps back, just to move one step up.",
        # 4
        "And it's worse than inefficient. Take an easy target, one step to the right. Its recipe is one blue "
        "step, and nothing else.",
        # 5
        "Now nudge it up by one hundredth. The recipe flips completely: no blue at all, one full red step.",
        # 6
        "SLOW|The target moved by a hundredth; the recipe moved by about one point four. Relative to their sizes, "
        "that's more than a hundred times larger.",
        # 7
        "The address is technically unique, but it's fragile. A little noise in the place means a wild change "
        "in the description.",
        # 8 — precise
        "SLOW|The algebra makes it exact. The second equation says epsilon times c two equals one,",
        # 9
        "SLOW|so c two is one over epsilon, and c one is minus that.",
        # 10
        "SLOW|As epsilon shrinks, one over epsilon explodes.",
        # 11
        "SLOW|And if the target moves by a small amount delta, the recipe moves by delta over epsilon.",
        # 12
        "Dividing by a tiny number magnifies everything, including errors.",
        # 13 — 10.2
        "The worst-case amount by which relative changes can be magnified has a name: the condition number.",
        # 14
        "SLOW|For a square invertible matrix, it's the size of the matrix times the size of its inverse: kappa "
        "equals the norm of B, times the norm of B inverse.",
        # 15
        "SLOW|And it bounds the damage: the relative change in the recipe is at most kappa times the relative "
        "change in the target.",
        # 16
        "That's a worst case; not every nudge is amplified that much.",
        # 17
        "A small condition number means addresses are stable. A huge one means the system is ill-conditioned.",
        # 18
        "Two nearly parallel moves are one cause; wildly unequal lengths are another, even when the moves are "
        "perpendicular.",
        # 19
        "When the moves become exactly parallel, the matrix is singular, and the condition number is infinite.",
        # 20
        "There's also a simple angle-only gauge, called the Hadamard ratio. Divide the area of the parallelogram "
        "by the product of the two lengths.",
        # 21
        "SLOW|Since area is base times height, that ratio is exactly the sine of the angle between the moves:",
        # 22
        "one when they're perpendicular, sliding to zero as they close up.",
        # 23
        "SLOW|For blue and gold, the area is three, and the lengths multiply to five, so the gauge reads point "
        "six.",
        # 24
        "It measures angle only; the condition number also accounts for lengths that are wildly unequal, which "
        "is why both exist.",
        # 25 — 10.3
        "This matters because computers never compute exactly.",
        # 26
        "When a program solves for a recipe, it uses a step-by-step method called elimination, and at each step "
        "it divides by a number called a pivot.",
        # 27
        "If that number is tiny, is it really small, or is it zero plus a bit of rounding error? The program has "
        "to decide with a threshold: a tolerance.",
        # 28
        "Here's the catch: a fixed threshold can change its mind if you simply rescale your data. A threshold "
        "that's relative to the size of the data doesn't.",
        # 29
        "So when a library reports how many independent directions a matrix has, its numerical rank, that answer "
        "depends on the tolerance it chose. Exact maths and computer maths can disagree, and now you know why.",
        # 30
        "SLOW|Elimination is just the recipe-solving from Act one, done systematically: subtract a multiple of one "
        "equation from another, which never changes the answers, because you could add it back.",
        # 31
        "SLOW|On our collapsed panel, subtract half of the first equation from the second.",
        # 32
        "SLOW|For six, three, the second equation becomes zero equals zero: no restriction, so there are "
        "infinitely many recipes.",
        # 33
        "SLOW|For four, five, it becomes zero equals three: impossible.",
        # 34
        "SLOW|The number you divide by at each step is the pivot.",
        # 35
        "SLOW|A zero candidate pivot may just need a row swap. But when no pivot can be found anywhere in the "
        "remaining column, that column supplies no new direction.",
        # 36
        "On a computer, zero has to be decided, and there are two different questions to keep apart.",
        # 37
        "SLOW|The first is about a residual: does this recipe rebuild this target accurately enough? There, a "
        "tolerance usually combines an absolute part with a part relative to the size of the target.",
        # 38
        "SLOW|The second is numerical rank: which directions are still distinguishable at the resolution you care "
        "about? That's decided by comparing the matrix's stretch factors, its singular values, with a threshold.",
        # 39
        "SLOW|For a diagonal matrix, they're just the sizes of the diagonal entries. This one stretches one "
        "direction by one, and the other by a hundred millionth.",
        # 40
        "SLOW|An absolute threshold of one millionth says one usable direction.",
        # 41
        "SLOW|Multiply the whole matrix by a hundred million, which changes nothing about its directions, and the "
        "same absolute threshold now says two.",
        # 42
        "SLOW|A threshold relative to the largest stretch says one, both times.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 10", "Fragile addresses",
                                        "What if every place has an address, but only just?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)
        self.near_parallel()
        self.precise_algebra()
        self.condition_number()
        self.hadamard()
        self.computer()
        self.elimination()
        self.two_questions()
        self.done(1.0)
        self.clear_all()

    # ------------------------------------------------------------------ 10.1
    def near_parallel(self):
        p = plane((-1, 12), (-1, 2), unit=0.95).move_to(UP * 1.3)
        self.p = p
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        le = ValueTracker(0.0)                                  # log10 ε

        def ed():
            return fe(10 ** le.get_value())

        blue = vec(p, 1, 0, C_U, width=8)
        red = always_redraw(lambda: vec(p, 1, ed(), C_R, width=5))
        bl = M("(1, 0)", 24, C_U).next_to(p.c2p(0.55, 0), DOWN, buff=0.12)
        rl = always_redraw(lambda: M("(1, ε)", 24, C_R).next_to(p.c2p(1, ed()), UL, buff=0.08))
        ship = craft().move_to(p.c2p(0, 0))

        # 1 — two near-parallel thrusters
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), run_time=1.2)
        self.play(GrowArrow(blue), FadeIn(bl), run_time=0.7)
        self.add(red)
        self.play(FadeIn(rl), FadeIn(ship), run_time=0.7)
        eps_l = always_redraw(lambda: M(f"ε = {fg(ed())}", 34, C_R).move_to(DOWN * 0.9).align_to(LEFT * 6.3, LEFT))
        self.play(FadeIn(eps_l), run_time=0.5)
        self.wait(3.0)
        self.play(le.animate.set_value(np.log10(0.5)), run_time=2.0)
        self.until_end()

        # 2 — the long trip up
        self.say()
        XMAX = 11.6
        tgt = Dot(p.c2p(0, 1), radius=0.12, color=C_W)
        tgt_l = M("(0, 1)", 24, C_W).next_to(tgt, LEFT, buff=0.15)

        def route():
            e = ed()
            out = 1 / e
            g = VGroup()
            if out <= XMAX:
                g.add(Arrow(p.c2p(0, 0), p.c2p(out, 1), buff=0, color=C_R, stroke_width=3, tip_length=0.16,
                            max_tip_length_to_length_ratio=0.15).set_opacity(0.8))
                g.add(Arrow(p.c2p(out, 1), p.c2p(0, 1), buff=0, color=C_U, stroke_width=3, tip_length=0.16,
                            max_tip_length_to_length_ratio=0.15).set_opacity(0.8))
            else:
                g.add(Line(p.c2p(0, 0), p.c2p(XMAX, XMAX * e), color=C_R, stroke_width=3).set_opacity(0.8))
                g.add(Arrow(p.c2p(XMAX, 1), p.c2p(0, 1), buff=0, color=C_U, stroke_width=3, tip_length=0.16,
                            max_tip_length_to_length_ratio=0.15).set_opacity(0.8))
                g.add(M(f"→ out to x = {fg(out)}", 22, C_R).next_to(p.c2p(XMAX, 1), UP, buff=0.15)
                      .align_to(p.c2p(XMAX, 1), RIGHT))
            return g

        rec_h = T("recipe for the target (0, 1)", 22, C_DIM).move_to(LEFT * 4.2 + DOWN * 1.75)
        rec_h.align_to(LEFT * 6.3, LEFT)
        rec_l = always_redraw(lambda: M(f"(−1/ε, 1/ε) = ({fg(-1 / ed())}, {fg(1 / ed())})", 30)
                              .next_to(rec_h, DOWN, buff=0.25).align_to(rec_h, LEFT))
        trip = always_redraw(lambda: VGroup(
            M(f"red × {fg(1 / ed())}   (out)", 28, C_R),
            M(f"blue × {fg(-1 / ed())}   (back)", 28, C_U)).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
            .move_to(RIGHT * 3.4 + DOWN * 2.0).align_to(RIGHT * 1.6, LEFT))
        self.play(FadeIn(tgt, scale=2), FadeIn(tgt_l), run_time=0.6)
        rt = always_redraw(route)
        self.play(ship.animate.move_to(p.c2p(2, 1)), run_time=1.6)
        self.play(ship.animate.move_to(p.c2p(0, 1)), run_time=1.4)
        self.play(FadeIn(rt), FadeIn(rec_h), FadeIn(rec_l), FadeIn(trip), run_time=0.8)
        self.until_end()

        # 3 — closer together: longer trip
        self.say()
        ship.move_to(p.c2p(0, 0))
        self.play(le.animate.set_value(-1), run_time=2.2)
        self.play(ship.animate.move_to(p.c2p(10, 1)), run_time=1.8)
        self.play(ship.animate.move_to(p.c2p(0, 1)), run_time=1.6)
        self.wait(0.6)
        self.play(le.animate.set_value(-2), run_time=2.4)
        self.play(Indicate(trip, color=WHITE, scale_factor=1.08), run_time=1.0)
        self.until_end(1.0)
        for m in (rt, rec_l, trip):
            m.clear_updaters()
        self.play(FadeOut(VGroup(rt, rec_h, rec_l, trip, tgt, tgt_l)), ship.animate.move_to(p.c2p(0, 0)),
                  run_time=0.6)

        # 4 — an easy target, recipe (1, 0)
        self.say()
        t1 = Dot(p.c2p(1, 0), radius=0.12, color=C_W)
        t1_l = M("target (1, 0)", 24, C_W).next_to(p.c2p(1, 0), DR, buff=0.18).shift(RIGHT * 0.3)
        self.play(FadeOut(bl), FadeIn(t1, scale=2), FadeIn(t1_l), run_time=0.7)
        self.play(ship.animate.move_to(p.c2p(1, 0)), run_time=1.2)
        row1 = VGroup(M("target (1, 0)", 28, C_W), M("→", 28, C_DIM), M("recipe (1, 0)", 28),
                      T("one blue step", 22, C_U)).arrange(RIGHT, buff=0.25)
        row1.move_to(DOWN * 1.8).align_to(LEFT * 6.3, LEFT)
        self.play(FadeIn(row1, shift=UP * 0.15), run_time=0.8)
        self.until_end()

        # 5 — nudge it: recipe flips
        self.say()
        self.play(ship.animate.move_to(p.c2p(0, 0)), run_time=0.5)
        t2_l = M("target (1, 0.01)", 24, C_W).move_to(t1_l).align_to(t1_l, LEFT)
        self.play(t1.animate.move_to(p.c2p(1, 0.01)), Transform(t1_l, t2_l), run_time=1.0)
        row2 = VGroup(M("target (1, 0.01)", 28, C_W), M("→", 28, C_DIM), M("recipe (0, 1)", 28),
                      T("one red step", 22, C_R)).arrange(RIGHT, buff=0.25)
        row2.next_to(row1, DOWN, buff=0.35).align_to(row1, LEFT)
        self.play(FadeIn(row2, shift=UP * 0.15), blue.animate.set_opacity(0.3), run_time=0.8)
        self.play(ship.animate.move_to(p.c2p(1, 0.01)), Indicate(red, color=WHITE), run_time=1.4)
        tiny = T("moved 0.01: too small to see", 20, C_DIM).next_to(t1_l, DOWN, buff=0.1).align_to(t1_l, LEFT)
        self.play(FadeIn(tiny), run_time=0.5)
        self.until_end()
        self.play(blue.animate.set_opacity(1), FadeOut(tiny), run_time=0.4)

        # 6 — relative sizes
        self.say()
        x0 = RIGHT * 1.0
        c1 = M("target moved:  ‖δ<i>T</i>‖ = 0.01,   ‖<i>T</i>‖ = 1", 26)
        c2 = M("recipe moved:  ‖(−1, 1)‖ = √2 ≈ 1.41,   ‖<i>c</i>‖ = 1", 26)
        c3 = M("relative:  1.41 ÷ 0.01 ≈ 141 times larger", 28, C_X)
        calc = VGroup(c1, c2, c3).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        self.play(row1.animate.scale(0.82).align_to(LEFT * 6.3, LEFT).set_y(-0.7),
                  row2.animate.scale(0.82).align_to(LEFT * 6.3, LEFT).set_y(-1.2),
                  FadeOut(eps_l), run_time=0.6)
        calc.next_to(row2, DOWN, buff=0.35).align_to(LEFT * 6.3, LEFT)
        for ln in calc:
            self.play(FadeIn(ln, shift=UP * 0.1), run_time=0.8)
            self.wait(1.0)
        self.until_end(1.2)

        # 7 — fragile: sensitivity, ill-conditioned
        self.say()
        terms = VGroup(
            boxed(VGroup(T("sensitivity", 26, C_X, weight=BOLD),
                         T("how far the recipe moves\nwhen the target is nudged", 21, C_DIM))
                  .arrange(DOWN, buff=0.12, aligned_edge=LEFT), color=C_X, buff=0.18),
            boxed(VGroup(T("ill-conditioned", 26, C_R, weight=BOLD),
                         T("tiny nudges in the place,\nwild changes in the address", 21, C_DIM))
                  .arrange(DOWN, buff=0.12, aligned_edge=LEFT), color=C_R, buff=0.18),
        ).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        terms.move_to(RIGHT * 4.6 + DOWN * 2.25)
        uniq = T("unique, but fragile", 30, C_R, weight=BOLD).next_to(terms, UP, buff=0.25)
        self.play(FadeIn(uniq), run_time=0.7)
        self.play(FadeIn(terms[0], shift=LEFT * 0.2), run_time=0.7)
        self.wait(1.2)
        self.play(FadeIn(terms[1], shift=LEFT * 0.2), run_time=0.7)
        self.until_end(1.0)
        red.clear_updaters()
        rl.clear_updaters()
        self.play(FadeOut(VGroup(p, home, blue, red, rl, ship, t1, t1_l, row1, row2, calc, terms, uniq)),
                  run_time=0.7)

    # ------------------------------------------------------------------ 10.1 precise
    def precise_algebra(self):
        # 8 — the system
        self.say()
        B = matrix_mob([["1", "1"], ["0", "ε"]], size=32, entry_colors={("col", 0): C_U, ("col", 1): C_R})
        cv = column_vec(["<i>c</i><sub>1</sub>", "<i>c</i><sub>2</sub>"], size=32)
        tv = column_vec(["0", "1"], size=32, color=C_W)
        sys_ = VGroup(M("<i>B</i><sub>ε</sub> =", 32), B, M("·", 32), cv, M("=", 32), tv).arrange(RIGHT, buff=0.2)
        sys_.move_to(LEFT * 3.4 + UP * 1.7)
        tagp = T("PRECISE", 18, C_V, weight=BOLD).next_to(sys_, UP, buff=0.25).align_to(sys_, LEFT)
        e1 = M("<i>c</i><sub>1</sub> + <i>c</i><sub>2</sub> = 0", 32)
        e2 = M("ε <i>c</i><sub>2</sub> = 1", 32)
        eqs = VGroup(e1, e2).arrange(DOWN, buff=0.3, aligned_edge=LEFT).next_to(sys_, DOWN, buff=0.55)
        eqs.align_to(sys_, LEFT).shift(RIGHT * 0.3)
        self.play(FadeIn(tagp), FadeIn(sys_), run_time=1.0)
        self.play(FadeIn(e1, shift=DOWN * 0.1), run_time=0.6)
        self.play(FadeIn(e2, shift=DOWN * 0.1), run_time=0.6)
        hl = SurroundingRectangle(e2, color=C_V, buff=0.12, stroke_width=2)
        self.play(Create(hl), run_time=0.6)
        self.until_end(1.0)

        # 9 — solve
        self.say()
        s1 = M("<i>c</i><sub>2</sub> = 1/ε", 32, C_R)
        s2 = M("<i>c</i><sub>1</sub> = −1/ε", 32, C_U)
        sol = VGroup(s1, s2).arrange(DOWN, buff=0.3, aligned_edge=LEFT).next_to(eqs, DOWN, buff=0.55)
        sol.align_to(eqs, LEFT)
        self.play(TransformFromCopy(e2, s1), run_time=1.2)
        self.wait(0.6)
        self.play(hl.animate.become(SurroundingRectangle(e1, color=C_V, buff=0.12, stroke_width=2)), run_time=0.5)
        self.play(TransformFromCopy(VGroup(e1, s1), s2), run_time=1.2)
        self.until_end(1.2)
        self.play(FadeOut(hl), run_time=0.3)

        # 10 — table: 1/ε explodes
        self.say()
        rows = [("ε", "recipe (<i>c</i><sub>1</sub>, <i>c</i><sub>2</sub>)")] + [
            (fg(e), f"({fg(-1 / e)}, {fg(1 / e)})") for e in (0.5, 0.1, 0.01)]
        tbl = VGroup()
        for i, (a, b) in enumerate(rows):
            col_ = C_DIM if i == 0 else WHITE
            r = VGroup(M(a, 30, C_R if i else C_DIM), M(b, 30, col_))
            tbl.add(r)
        for r in tbl:
            r[0].move_to(RIGHT * 2.0, aligned_edge=LEFT)
            r[1].move_to(RIGHT * 3.6, aligned_edge=LEFT)
        for i, r in enumerate(tbl):
            r.set_y(2.2 - i * 0.6)
        rule = Line(RIGHT * 1.9, RIGHT * 6.6, color=C_DIM, stroke_width=1.5).set_y(1.9)
        self.play(FadeIn(tbl[0]), Create(rule), run_time=0.5)
        for r in tbl[1:]:
            self.play(FadeIn(r, shift=UP * 0.1), run_time=0.6)
            self.wait(0.3)
        self.play(Circumscribe(tbl[3], color=C_X), run_time=1.0)
        self.until_end(1.2)

        # 11 — perturbation: δ/ε
        self.say()
        p1 = M("target (0, 1 + δ):", 28, C_W)
        p2 = M("recipe changes by (−δ/ε, δ/ε)", 28)
        p3 = M("ε = δ = 0.01:  change (−1, 1)", 28, C_X)
        p4 = T("for a 0.01 move of the target", 22, C_DIM)
        pert = VGroup(p1, p2, p3, p4).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        pert.next_to(tbl, DOWN, buff=0.7).align_to(tbl, LEFT)
        for ln in pert[:2]:
            self.play(FadeIn(ln, shift=UP * 0.1), run_time=0.7)
            self.wait(0.5)
        self.play(FadeIn(p3, shift=UP * 0.1), FadeIn(p4), run_time=0.8)
        self.until_end(1.2)

        # 12 — dividing by a tiny number
        self.say()
        moral = T("÷ tiny number  →  everything magnified, errors included", 26, C_X)
        moral.to_edge(DOWN, buff=0.45)
        if moral.width > 12.8:
            moral.scale_to_fit_width(12.8)
        self.play(FadeIn(moral, shift=UP * 0.15), Indicate(s1, color=WHITE), run_time=1.0)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(tagp, sys_, eqs, sol, tbl, rule, pert, moral)), run_time=0.6)

    # ------------------------------------------------------------------ 10.2
    def condition_number(self):
        G = np.array([-3.7, 0.0, 0])
        R = 2.0
        cols = [ManimColor(C_W), ManimColor(C_V), ManimColor(C_R)]

        def ccol(f):
            return interpolate_color(cols[0], cols[1], f * 2) if f < 0.5 else interpolate_color(cols[1], cols[2], f * 2 - 1)

        n = 60
        arc = VGroup(*[Arc(radius=R, start_angle=PI * (1 - i / n), angle=-PI / n, arc_center=G,
                           stroke_width=14, color=ccol(i / n)) for i in range(n)])
        ticks = VGroup()
        tlabs = VGroup()
        for k, s in enumerate(["1", "10", "100", "10³", "10⁴", "10⁵"]):
            th = PI * (1 - k / 5)
            d = np.array([np.cos(th), np.sin(th), 0])
            ticks.add(Line(G + d * (R - 0.2), G + d * (R + 0.15), color=WHITE, stroke_width=2))
            tlabs.add(M(s, 22, C_DIM).move_to(G + d * (R + 0.45)))
        title = T("condition number κ₂  (2-norm)", 26, WHITE, weight=BOLD).move_to(G + UP * (R + 1.0))
        z1 = T("stable", 20, C_W).next_to(tlabs[1], LEFT, buff=0.2)
        z2 = T("ill-conditioned", 20, C_R).next_to(tlabs[4], RIGHT, buff=0.2)
        lk = ValueTracker(0.0)

        def needle():
            th = PI * (1 - lk.get_value() / 5)
            d = np.array([np.cos(th), np.sin(th), 0])
            return VGroup(Line(G, G + d * (R - 0.3), color=WHITE, stroke_width=6), Dot(G, radius=0.1, color=WHITE))

        ndl = always_redraw(needle)
        gauge = VGroup(arc, ticks, tlabs, title, z1, z2)

        # 13 — the name
        self.say()
        name = T("condition number", 34, C_X, weight=BOLD).move_to(RIGHT * 3.6 + UP * 2.5)
        gloss = T("worst-case magnification of relative changes", 22, C_DIM).next_to(name, DOWN, buff=0.2)
        self.play(FadeIn(gauge), FadeIn(ndl), run_time=1.2)
        self.play(Write(name), FadeIn(gloss), run_time=1.0)
        self.until_end()

        # 14 — definition
        self.say()
        dfn = M("κ(<i>B</i>) = ‖<i>B</i>‖ ‖<i>B</i><sup>−1</sup>‖", 40).move_to(RIGHT * 3.6 + UP * 1.2)
        note = T("B square and invertible · ‖·‖ is the 2-norm", 20, C_DIM).next_to(dfn, DOWN, buff=0.22)
        self.play(Write(dfn), run_time=1.6)
        self.play(FadeIn(note), run_time=0.6)
        self.until_end(1.2)

        # 15 — the bound
        self.say()
        bound = M("‖δ<i>c</i>‖ / ‖<i>c</i>‖  ≤  κ(<i>B</i>) · ‖δ<i>T</i>‖ / ‖<i>T</i>‖", 32)
        bound.next_to(note, DOWN, buff=0.55)
        if bound.width > 6.4:
            bound.scale_to_fit_width(6.4)
        bound.set_x(3.6)
        b_l = T("relative change in recipe", 18, C_DIM)
        b_r = T("relative change in target", 18, C_DIM)
        b_l.next_to(bound, DOWN, buff=0.15).align_to(bound, LEFT)
        b_r.next_to(b_l, DOWN, buff=0.08).align_to(bound, RIGHT)
        self.play(Write(bound), run_time=1.8)
        self.play(FadeIn(b_l), FadeIn(b_r), run_time=0.6)
        self.until_end(1.2)

        # 16 — worst case
        self.say()
        wc = boxed(T("worst case, not every perturbation", 22, C_V), color=C_V, buff=0.14)
        wc.next_to(VGroup(b_l, b_r), DOWN, buff=0.3).set_x(3.6)
        self.play(FadeIn(wc, shift=UP * 0.1), run_time=0.7)
        self.until_end(0.6)

        # 17 — readings: stable to ill-conditioned
        self.say()
        readings = [("1", 2.618, "2.6"), ("0.1", 20.05, "20"), ("0.01", 200.0, "200"), ("0.0001", 20000.0, "20 000")]
        rtab = VGroup()
        for e, k, s in readings:
            r = VGroup(M(f"ε = {e}", 24, C_R), M(f"κ₂ ≈ {s}", 24))
            rtab.add(r)
        x_e, x_k = G[0] - 2.3, G[0] + 0.5
        for i, r in enumerate(rtab):
            r[0].move_to([x_e, 0, 0], aligned_edge=LEFT)
            r[1].move_to([x_k, 0, 0], aligned_edge=LEFT)
            r.set_y(-0.85 - i * 0.48)
        for (e, k, s), r in zip(readings, rtab):
            self.play(lk.animate.set_value(np.log10(k)), run_time=1.0)
            self.play(FadeIn(r, shift=UP * 0.1), run_time=0.35)
            self.wait(0.25)
        self.until_end()

        # 18 — two causes
        self.say()
        self.play(FadeOut(VGroup(gloss, note, b_l, b_r)), run_time=0.4)
        o1 = RIGHT * 1.0 + DOWN * 2.35
        ic1 = VGroup(Arrow(o1, o1 + RIGHT * 1.4, buff=0, color=C_U, stroke_width=5, tip_length=0.16),
                     Arrow(o1, o1 + RIGHT * 1.4 + UP * 0.22, buff=0, color=C_R, stroke_width=5, tip_length=0.16))
        cap1 = T("nearly parallel", 20, C_DIM).next_to(ic1, DOWN, buff=0.15)
        o2 = RIGHT * 3.9 + DOWN * 2.6
        ic2 = VGroup(Arrow(o2, o2 + RIGHT * 1.9, buff=0, color=C_U, stroke_width=5, tip_length=0.16),
                     Arrow(o2, o2 + UP * 0.3, buff=0, color=C_R, stroke_width=5, tip_length=0.12,
                           max_tip_length_to_length_ratio=0.5))
        cap2 = T("perpendicular, very\nunequal lengths", 20, C_DIM).next_to(ic2, DOWN, buff=0.15).set_x(o2[0] + 0.95)
        both = T("both give a large κ", 22, C_X).move_to(RIGHT * 1.7 + DOWN * 3.45)
        g1 = VGroup(ic1, cap1)
        g2 = VGroup(ic2, cap2)
        self.play(FadeIn(g1, shift=UP * 0.15), run_time=0.7)
        self.wait(1.5)
        self.play(FadeIn(g2, shift=UP * 0.15), run_time=0.7)
        self.play(FadeIn(both), run_time=0.5)
        self.until_end()

        # 19 — singular
        self.say()
        self.play(lk.animate.set_value(5.35), run_time=1.6)
        inf = M("∞", 34, C_R).move_to(G + (R + 0.45) * np.array([np.cos(-0.07 * PI), np.sin(-0.07 * PI), 0]))
        r5 = VGroup(M("ε = 0", 24, C_R), M("κ₂ = ∞:  singular", 24, C_R))
        r5[0].move_to([x_e, 0, 0], aligned_edge=LEFT)
        r5[1].move_to([x_k, 0, 0], aligned_edge=LEFT)
        r5.set_y(-0.85 - 4 * 0.48)
        self.play(FadeIn(inf), FadeIn(r5, shift=UP * 0.1), run_time=0.7)
        self.until_end(1.0)
        ndl.clear_updaters()
        self.play(FadeOut(VGroup(gauge, ndl, inf, rtab, r5, name, dfn, bound, wc, g1, g2, both)), run_time=0.7)

    # ------------------------------------------------------------------ 10.2 Hadamard
    def hadamard(self):
        p = plane((-2, 4), (-1, 4), unit=0.85).to_edge(LEFT, buff=0.6).shift(DOWN * 0.3)
        U = np.array([2.0, 1.0])
        r = np.sqrt(5)
        a_u = np.arctan2(1, 2)
        phi = ValueTracker(np.arctan2(2, 1))         # direction of the second move (gold)

        def V():
            return r * np.array([np.cos(phi.get_value()), np.sin(phi.get_value())])

        def h():
            return abs(np.sin(phi.get_value() - a_u))

        uarr = vec(p, *U, C_U, width=6)
        varr = always_redraw(lambda: vec(p, *V(), C_V, width=6))
        para = always_redraw(lambda: Polygon(p.c2p(0, 0), p.c2p(*U), p.c2p(*(U + V())), p.c2p(*V()),
                                             stroke_width=0).set_fill(C_P, 0.3))

        def height():
            v = V()
            uh = U / np.linalg.norm(U)
            foot = uh * np.dot(v, uh)
            return VGroup(DashedLine(p.c2p(*v), p.c2p(*foot), color=WHITE, dash_length=0.08, stroke_width=3),
                          DashedLine(p.c2p(*(-0.6 * uh)), p.c2p(*(2.4 * uh)), color=C_U, dash_length=0.06,
                                     stroke_width=1.5).set_opacity(0.5))

        ul = M("<i>b</i><sub>1</sub>", 28, C_U).next_to(p.c2p(*U), DR, buff=0.06)
        vl = always_redraw(lambda: M("<i>b</i><sub>2</sub>", 28, C_V).next_to(p.c2p(*V()), UL, buff=0.06))
        X0 = 3.6

        # 20 — the ratio
        self.say()
        self.play(Create(p, lag_ratio=0.02), run_time=1.0)
        self.add(para)
        self.play(GrowArrow(uarr), FadeIn(varr), FadeIn(ul), FadeIn(vl), FadeIn(para), run_time=1.0)
        nm = T("Hadamard ratio", 34, C_P, weight=BOLD).move_to(RIGHT * X0 + UP * 2.5)
        hd = M("<i>h</i>(<i>B</i>) = |det <i>B</i>| / (‖<i>b</i><sub>1</sub>‖ ‖<i>b</i><sub>2</sub>‖)", 34)
        hd.next_to(nm, DOWN, buff=0.35)
        hg = T("area  ÷  product of the lengths", 22, C_DIM).next_to(hd, DOWN, buff=0.2)
        self.play(Write(nm), run_time=0.8)
        self.play(Write(hd), run_time=1.4)
        self.play(FadeIn(hg), Indicate(para, color=C_P, scale_factor=1.03), run_time=0.9)
        self.until_end(1.0)

        # 21 — base × height
        self.say()
        hgt = always_redraw(height)
        th_arc = always_redraw(lambda: Arc(radius=0.55, start_angle=a_u, angle=phi.get_value() - a_u,
                                           arc_center=p.c2p(0, 0), color=WHITE, stroke_width=2))
        th_l = always_redraw(lambda: M("θ", 24).move_to(p.c2p(0, 0) + 0.85 * np.array(
            [np.cos((a_u + phi.get_value()) / 2), np.sin((a_u + phi.get_value()) / 2), 0])))
        self.play(FadeIn(hgt), FadeIn(th_arc), FadeIn(th_l), run_time=0.8)
        d1 = M("area = base × height", 28, C_DIM)
        d2 = M("|det <i>B</i>| = ‖<i>b</i><sub>1</sub>‖ · ‖<i>b</i><sub>2</sub>‖ |sin θ|", 30)
        d3 = M("<i>h</i> = |sin θ|", 36, C_P)
        der = VGroup(d1, d2, d3).arrange(DOWN, buff=0.3).next_to(hg, DOWN, buff=0.45).set_x(X0)
        self.play(FadeIn(d1), run_time=0.6)
        self.wait(0.8)
        self.play(Write(d2), run_time=1.4)
        self.wait(0.6)
        self.play(Write(d3), run_time=1.0)
        self.until_end(1.2)

        # 22 — perpendicular to closed
        self.say()
        live = always_redraw(lambda: M(f"<i>h</i> = {h():.2f}", 32, C_P).move_to(RIGHT * X0 + DOWN * 2.6))
        self.play(FadeIn(live), run_time=0.4)
        self.play(phi.animate.set_value(a_u + PI / 2), run_time=1.8)
        pl = T("perpendicular: h = 1", 22, C_W).next_to(live, DOWN, buff=0.15)
        self.play(FadeIn(pl), run_time=0.4)
        self.wait(0.6)
        self.play(phi.animate.set_value(a_u + 0.06), FadeOut(pl), run_time=2.6)
        cl = T("closing up: h → 0", 22, C_R).next_to(live, DOWN, buff=0.15)
        self.play(FadeIn(cl), run_time=0.4)
        self.until_end()
        self.play(phi.animate.set_value(np.arctan2(2, 1)), FadeOut(cl), run_time=1.4)

        # 23 — blue and gold: 3 / 5 = 0.6
        self.say()
        self.play(FadeOut(VGroup(d1, d2, live)), run_time=0.4)
        n1 = M("|det| = |2·2 − 1·1| = 3", 30)
        n2 = M("‖<i>u</i>‖ ‖<i>v</i>‖ = √5 · √5 = 5", 30)
        n3 = M("<i>h</i> = 3 / 5 = 0.6", 34, C_P)
        nums = VGroup(n1, n2, n3).arrange(DOWN, buff=0.3).next_to(d3, DOWN, buff=0.35).set_x(X0)
        self.play(d3.animate.scale(0.8), run_time=0.3)
        for ln in nums:
            self.play(Write(ln), run_time=1.0)
            self.wait(0.6)
        self.play(Circumscribe(n3, color=C_P), run_time=1.0)
        self.until_end(1.2)

        # 24 — angle only vs κ
        self.say()
        self.play(FadeOut(VGroup(hg, d3, nums)), run_time=0.4)
        cmp_ = VGroup(
            boxed(VGroup(T("Hadamard ratio", 24, C_P, weight=BOLD), T("angle only", 22, C_DIM))
                  .arrange(DOWN, buff=0.12), color=C_P, buff=0.18),
            boxed(VGroup(T("condition number", 24, C_X, weight=BOLD), T("angle and unequal lengths", 22, C_DIM))
                  .arrange(DOWN, buff=0.12), color=C_X, buff=0.18),
        ).arrange(DOWN, buff=0.35).next_to(hd, DOWN, buff=0.6).set_x(X0)
        self.play(FadeIn(cmp_[0], shift=UP * 0.1), run_time=0.6)
        self.wait(1.4)
        self.play(FadeIn(cmp_[1], shift=UP * 0.1), run_time=0.6)
        self.until_end(0.8)
        for m in (varr, para, vl, hgt, th_arc, th_l):
            m.clear_updaters()
        self.play(FadeOut(VGroup(p, uarr, varr, para, ul, vl, hgt, th_arc, th_l, nm, hd, cmp_)), run_time=0.6)

    # ------------------------------------------------------------------ 10.3
    def computer(self):
        # 25 — floating point
        self.say()
        body = Square(1.5, color=C_DIM, stroke_width=3).set_fill("#1B2130", 1)
        core = Square(0.7, color=C_U, stroke_width=2).set_fill(C_U, 0.15)
        pins = VGroup()
        for k in range(5):
            o = -0.6 + 0.3 * k
            for d in (UP, DOWN, LEFT, RIGHT):
                side = d * 0.75
                along = np.array([-d[1], d[0], 0]) * o
                pins.add(Line(side + along, side + along + d * 0.22, color=C_DIM, stroke_width=3))
        chip = VGroup(pins, body, core, M("≈", 30, C_U)).move_to(LEFT * 4.4 + UP * 1.2)
        fp = T("floating point: every step is rounded", 22, C_DIM).next_to(chip, DOWN, buff=0.35)
        ex = M("1/3 → 0.3333333333333333", 26).next_to(fp, DOWN, buff=0.2)
        self.play(FadeIn(chip, scale=0.8), run_time=0.8)
        self.play(FadeIn(fp), FadeIn(ex), run_time=0.7)
        self.until_end()

        # 26 — elimination divides by pivots
        self.say()
        self.play(FadeOut(ex), run_time=0.3)
        el = VGroup(T("elimination", 28, C_U, weight=BOLD), T("step by step, divide by a pivot", 22, C_DIM))
        el.arrange(DOWN, buff=0.12).next_to(fp, DOWN, buff=0.35)
        piv = M("pivot = 0.000000001", 30, C_V).next_to(el, DOWN, buff=0.35)
        self.play(FadeIn(el), run_time=0.7)
        self.wait(1.0)
        self.play(FadeIn(piv, shift=UP * 0.1), run_time=0.7)
        self.until_end()

        # 27 — small or zero? tolerance
        self.say()
        q = T("really small, or zero plus rounding?", 22, C_X).next_to(piv, DOWN, buff=0.25)
        self.play(FadeIn(q), Indicate(piv, color=WHITE), run_time=1.0)
        tol = boxed(T("tolerance: a threshold for \"zero\"", 24, C_V), color=C_V, buff=0.14)
        tol.move_to(RIGHT * 3.4 + UP * 2.5)
        self.play(FadeIn(tol, shift=DOWN * 0.1), run_time=0.7)
        self.until_end()

        # 28 — two judges, then rescale
        self.say()

        def judge(title, rule, col):
            return VGroup(T(title, 24, col, weight=BOLD), M(rule, 24)).arrange(DOWN, buff=0.15, aligned_edge=LEFT)

        j1 = judge("absolute rule", "below 10⁻⁶ ?  call it zero", C_U)
        j2 = judge("relative rule", "below 10⁻⁶ × biggest value ?  zero", C_P)
        js = VGroup(j1, j2).arrange(DOWN, buff=1.0, aligned_edge=LEFT).move_to(RIGHT * 3.0 + UP * 0.35)
        js.align_to(RIGHT * 0.6, LEFT)
        v1 = M("verdict: zero", 26, C_X).next_to(j1, DOWN, buff=0.15).align_to(j1, LEFT)
        v2 = M("verdict: zero", 26, C_X).next_to(j2, DOWN, buff=0.15).align_to(j2, LEFT)
        data = M("biggest value 1,  pivot 10⁻⁹", 26).move_to(RIGHT * 3.4 + DOWN * 2.6)
        self.play(FadeIn(j1), FadeIn(j2), FadeIn(data), run_time=0.9)
        self.play(FadeIn(v1), FadeIn(v2), run_time=0.6)
        self.wait(1.4)
        data2 = M("× 10⁸:  biggest value 10⁸,  pivot 0.1", 26, C_W).move_to(data)
        v1b = M("verdict: not zero", 26, C_W).move_to(v1).align_to(v1, LEFT)
        self.play(Transform(data, data2), piv.animate.become(M("pivot = 0.1", 30, C_V).move_to(piv)), run_time=1.0)
        self.play(Transform(v1, v1b), run_time=0.7)
        self.play(Wiggle(v1), run_time=0.9)
        self.play(Indicate(v2, color=C_P), run_time=0.9)
        self.until_end()

        # 29 — numerical rank depends on tolerance
        self.say()
        nr = boxed(T("numerical rank: how many independent directions, at the chosen tolerance", 22, C_W),
                   color=C_W, buff=0.16)
        if nr.width > 12.8:
            nr.scale_to_fit_width(12.8)
        nr.to_edge(DOWN, buff=0.35)
        self.play(FadeOut(data), run_time=0.3)
        self.play(FadeIn(nr, shift=UP * 0.15), run_time=0.8)
        self.wait(2.0)
        ex2 = T("exact maths ≠ computer maths", 24, C_X).next_to(nr, UP, buff=0.3).set_x(3.6)
        self.play(FadeIn(ex2), run_time=0.6)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(chip, fp, el, piv, q, tol, j1, j2, v1, v2, nr, ex2)), run_time=0.6)

    # ------------------------------------------------------------------ 10.3 precise: elimination
    def elimination(self):
        # 30 — the move
        self.say()
        tagp = T("PRECISE", 18, C_V, weight=BOLD).move_to(LEFT * 6.0 + UP * 3.0).align_to(LEFT * 6.3, LEFT)
        rule = M("subtract a multiple of one equation from another", 30).move_to(UP * 2.55)
        why = T("same answers: you could add it back", 22, C_DIM).next_to(rule, DOWN, buff=0.15)
        self.play(FadeIn(tagp), Write(rule), run_time=1.4)
        self.play(FadeIn(why), run_time=0.6)
        self.until_end(1.0)

        # 31 — the collapsed panel, two targets
        self.say()
        self.play(FadeOut(why), rule.animate.scale(0.8).move_to(UP * 2.6), run_time=0.5)
        panel = M("blue (2, 1) and lazy gold (4, 2):   <i>a</i>·(2, 1) + <i>b</i>·(4, 2) = target", 24, C_DIM)
        panel.next_to(rule, DOWN, buff=0.2)
        XL, XR = -3.4, 3.4

        def system(t1, t2, xc, col):
            head = M(f"target ({t1}, {t2})", 28, col)
            r1 = M(f"2<i>a</i> + 4<i>b</i> = {t1}", 32)
            r2 = M(f"<i>a</i> + 2<i>b</i> = {t2}", 32)
            g = VGroup(head, r1, r2).arrange(DOWN, buff=0.28)
            r1.align_to(head, LEFT).shift(RIGHT * 0.2)
            r2.align_to(r1, LEFT)
            g.move_to([xc, 0.95, 0])
            return g

        sA = system(6, 3, XL, C_W)
        sB = system(4, 5, XR, C_X)
        op = M("row<sub>2</sub> − ½ row<sub>1</sub>", 28, C_V)
        opA = op.copy().next_to(sA, DOWN, buff=0.3).align_to(sA[1], LEFT)
        opB = op.copy().next_to(sB, DOWN, buff=0.3).align_to(sB[1], LEFT)
        self.play(FadeIn(panel), run_time=0.6)
        self.play(FadeIn(sA, shift=UP * 0.1), FadeIn(sB, shift=UP * 0.1), run_time=0.9)
        self.wait(0.8)
        self.play(FadeIn(opA), FadeIn(opB), Indicate(sA[2], color=C_V), Indicate(sB[2], color=C_V), run_time=1.0)
        self.until_end(1.0)

        # 32 — 0 = 0
        self.say()
        rA = M("0<i>a</i> + 0<i>b</i> = 0", 32).next_to(opA, DOWN, buff=0.3).align_to(sA[1], LEFT)
        rA2 = M("0 = 0", 32, C_W).next_to(rA, RIGHT, buff=0.5)
        vA = T("b is free: infinitely many recipes", 22, C_W).next_to(rA, DOWN, buff=0.3).align_to(rA, LEFT)
        self.play(TransformFromCopy(sA[2], rA), run_time=1.2)
        self.play(FadeIn(rA2), run_time=0.6)
        self.wait(0.6)
        self.play(FadeIn(vA), run_time=0.6)
        self.until_end(1.2)

        # 33 — 0 = 3
        self.say()
        rB = M("0<i>a</i> + 0<i>b</i> = 3", 32).next_to(opB, DOWN, buff=0.3).align_to(sB[1], LEFT)
        rB2 = M("0 = 3", 32, C_X).next_to(rB, RIGHT, buff=0.5)
        vB = T("impossible: (4, 5) unreachable", 22, C_X).next_to(rB, DOWN, buff=0.3).align_to(rB, LEFT)
        self.play(TransformFromCopy(sB[2], rB), run_time=1.2)
        self.play(FadeIn(rB2), run_time=0.6)
        self.wait(0.4)
        self.play(FadeIn(vB), Wiggle(rB2), run_time=0.9)
        self.until_end(1.2)

        # 34 — the pivot
        self.say()
        pA = glyph_box(sA[1][0], C_V)
        pB = glyph_box(sB[1][0], C_V)
        pl = T("pivot", 22, C_V, weight=BOLD).next_to(pA, LEFT, buff=0.2)
        self.play(Create(pA), Create(pB), FadeIn(pl), run_time=1.0)
        self.until_end(1.0)

        # 35 — zero candidate pivot: row swap, or no new direction
        self.say()
        sw1 = matrix_mob([["0", "1"], ["1", "0"]], size=26)
        sw2 = matrix_mob([["1", "0"], ["0", "1"]], size=26)
        swl = T("zero candidate pivot:", 22, C_DIM)
        swa = T("swap rows →", 22, C_V)
        swap = VGroup(swl, sw1, swa, sw2).arrange(RIGHT, buff=0.25).move_to(DOWN * 3.15)
        b0 = glyph_box(sw1.entries[0][0], C_X)
        b1 = glyph_box(sw2.entries[0][0], C_V)
        self.play(FadeIn(swap[:2]), Create(b0), run_time=0.8)
        self.play(FadeIn(swap[2:]), Create(b1), run_time=0.8)
        self.wait(1.8)
        zA = DashedVMobject(glyph_box(rA[3], C_X), num_dashes=12)
        zB = DashedVMobject(glyph_box(rB[3], C_X), num_dashes=12)
        nd = T("no pivot left in the b column: no new direction", 22, C_X)
        self.play(FadeOut(VGroup(swap, b0, b1)), run_time=0.4)
        nd.move_to(DOWN * 3.15)
        self.play(Create(zA), Create(zB), FadeIn(nd), run_time=1.0)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(tagp, rule, panel, sA, sB, opA, opB, rA, rA2, vA, rB, rB2, vB, pA, pB, pl,
                                 zA, zB, nd)), run_time=0.6)

    # ------------------------------------------------------------------ 10.3 precise: two questions
    def two_questions(self):
        # 36 — two questions
        self.say()
        ttl = T("deciding \"zero\": two different questions", 28, WHITE, weight=BOLD).move_to(UP * 2.75)
        self.play(FadeIn(ttl), run_time=0.7)

        def card(title, q, col):
            return VGroup(T(title, 26, col, weight=BOLD), P(q, 21, C_DIM)).arrange(DOWN, buff=0.15, aligned_edge=LEFT)

        c1 = card("1 · Residual", "Does this recipe rebuild this\ntarget accurately enough?", C_U)
        c2 = card("2 · Numerical rank", "Which directions stay\ndistinguishable at this resolution?", C_P)
        k1, k2 = boxed(c1, C_U, buff=0.2), boxed(c2, C_P, buff=0.2)
        for k in (k1, k2):
            k[0].stretch_to_fit_width(5.9).align_to(k[1], LEFT).shift(LEFT * 0.2)
        k1.move_to(UP * 1.6).align_to(LEFT * 6.3, LEFT)
        k2.move_to(UP * 0.05).align_to(LEFT * 6.3, LEFT)
        self.play(FadeIn(k1[0]), FadeIn(k2[0]), FadeIn(c1[0]), FadeIn(c2[0]), run_time=0.8)
        self.until_end()

        # 37 — residual tolerance
        self.say()
        self.play(FadeIn(c1[1]), run_time=0.7)
        self.wait(1.4)
        res = M("‖<i>Bc</i> − <i>T</i>‖ ≤ atol + rtol · ‖<i>T</i>‖", 30, C_U)
        res.move_to([0, k1.get_y() + 0.15, 0]).align_to(RIGHT * 0.4, LEFT)
        res_l = T("absolute part + part relative to the target", 20, C_DIM).next_to(res, DOWN, buff=0.15).align_to(res, LEFT)
        self.play(Write(res), run_time=1.4)
        self.play(FadeIn(res_l), run_time=0.6)
        self.until_end(1.2)

        # 38 — numerical rank: singular values vs a threshold
        self.say()
        self.play(k1.animate.become(dimmed(k1.copy(), False)), res.animate.set_opacity(0.3), res_l.animate.set_opacity(0.3), run_time=0.5)
        self.play(FadeIn(c2[1]), run_time=0.7)
        self.wait(1.8)
        nrr = M("count singular values σ<sub><i>i</i></sub> above a threshold", 26, C_P)
        nrr.move_to([0, k2.get_y() + 0.15, 0]).align_to(RIGHT * 0.4, LEFT)
        nrl = T("singular values = stretch factors", 20, C_DIM).next_to(nrr, DOWN, buff=0.15).align_to(nrr, LEFT)
        self.play(Write(nrr), run_time=1.4)
        self.play(FadeIn(nrl), run_time=0.6)
        self.until_end(1.0)

        # table geometry
        xs = [-6.2, -2.4, 0.6, 3.6]
        y0 = -1.2
        hdr = VGroup(T("matrix", 22, C_DIM), T("singular values", 22, C_DIM),
                     M("absolute: σ > 10⁻⁶", 22, C_DIM), M("relative: σ > 10⁻⁶ · σ<sub>max</sub>", 22, C_DIM))
        for x, m in zip(xs, hdr):
            m.move_to([x, y0, 0], aligned_edge=LEFT)
        rule = Line([-6.3, y0 - 0.28, 0], [6.7, y0 - 0.28, 0], color=C_DIM, stroke_width=1.5)

        def cell(s, x, y, col=WHITE, size=26):
            return M(s, size, col).move_to([x, y, 0], aligned_edge=LEFT)

        # 39 — diag(1, 1e-8)
        self.say()
        ya, yb = y0 - 0.75, y0 - 1.6
        m1 = cell("diag(1, 10⁻⁸)", xs[0], ya)
        s1 = cell("1,  10⁻⁸", xs[1], ya, C_P)
        self.play(FadeIn(hdr[:2]), Create(rule), run_time=0.6)
        self.play(FadeIn(m1), run_time=0.7)
        self.wait(1.0)
        self.play(FadeIn(s1), run_time=0.7)
        self.until_end(1.0)

        # 40 — absolute: one direction
        self.say()
        a1 = cell("1 direction", xs[2], ya, C_W)
        self.play(FadeIn(hdr[2]), run_time=0.5)
        self.play(FadeIn(a1), run_time=0.7)
        self.until_end(1.0)

        # 41 — multiply by 1e8: absolute says two
        self.say()
        m2 = VGroup(M("diag(10⁸, 1)", 26), M("= 10⁸ · diag(1, 10⁻⁸)", 20, C_DIM)).arrange(
            DOWN, buff=0.1, aligned_edge=LEFT).move_to([xs[0], yb - 0.12, 0], aligned_edge=LEFT)
        s2 = cell("10⁸,  1", xs[1], yb, C_P)
        a2 = cell("2 directions", xs[2], yb, C_X)
        self.play(FadeIn(m2), run_time=0.8)
        self.wait(0.6)
        self.play(FadeIn(s2), run_time=0.6)
        self.wait(0.6)
        self.play(FadeIn(a2), run_time=0.6)
        self.play(Circumscribe(VGroup(a1, a2), color=C_X), run_time=1.0)
        self.until_end(1.0)

        # 42 — relative: one, both times
        self.say()
        r1 = cell("1 direction", xs[3], ya, C_W)
        r2 = cell("1 direction", xs[3], yb, C_W)
        self.play(FadeIn(hdr[3]), run_time=0.5)
        self.play(FadeIn(r1), run_time=0.6)
        self.play(FadeIn(r2), run_time=0.6)
        self.play(Circumscribe(VGroup(r1, r2), color=C_W), run_time=1.0)
        self.until_end(1.5)
