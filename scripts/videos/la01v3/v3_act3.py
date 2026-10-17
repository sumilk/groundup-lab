"""LA01 v3 — Act 3: Dead weight (trivial combination, linear (in)dependence, dependency relation,
equivalent forms of dependence, linear dependence lemma, 2-D area test, a trap)."""
from common import *
from v3_act1 import Slider, craft, dimmed, fmt
from v3_act2 import (A3, B3, C_RED, PX, U, V, LAZY, TGT, View3, act_plane, fit, patch, segment_line,
                     stamp)

W = U + V                       # purple shortcut (3, 3)
C3 = np.array([1.0, 1.0, 2.0])  # dependent third move
D3 = np.array([2.0, 2.0, 3.0])  # independent third move
C_SPAN = "#5B6475"              # neutral fill for "reachable" (purple is w's colour in this act)


def sgn(x):
    """'+ 2' / '− 2' for a coefficient after the first term."""
    return ("− " if round(x, 1) < 0 else "+ ") + fmt(abs(x))


class V3Act3(NScene):
    BEATS = [
        # 0
        "Act three. Dead weight.",
        # 1
        "Back to our two good moves, which reach the whole plane. Now I'm going to add a third control, purple.",
        # 2
        "It points in a new direction, different from both blue and gold. Here's the question: does the craft "
        "gain any new places it can reach?",
        # 3
        "It doesn't. Purple is exactly one blue move followed by one gold move.",
        # 4
        "Anything purple can do, blue and gold can already do together. It looks new, but it brings no new "
        "territory. It's dead weight.",
        # 5
        "In two dimensions you can spot the dead weight by eye. But a language model's arrows live in hundreds "
        "of dimensions, where you can't draw anything. So we need a test that doesn't use pictures.",
        # 6
        "Here's the clue, and it's the one I asked you to hold onto. When there's dead weight, the same "
        "destination has more than one recipe.",
        # 7
        "One blue and two golds reaches the target.",
        # 8
        "So does one gold and one purple.",
        # 9
        "Now do something sneaky. Follow the first recipe out to the target, then follow the second recipe "
        "backwards. You end up exactly where you started.",
        # 10
        "SLOW|Subtracting the two recipes gives you a round trip: one blue, plus one gold, minus one purple, "
        "brings you back home, even though you really moved.",
        # 11
        "That's the test. Doing nothing at all, zero of every control, obviously keeps you at home. "
        "Mathematicians call that the trivial combination.",
        # 12
        "Dead weight is exactly what lets you get home in some other way: a round trip that really uses the "
        "controls.",
        # 13
        "SLOW|So here are the official names. A list of vectors is linearly independent if the only way to get "
        "back home is to do nothing: every coefficient zero.",
        # 14
        "SLOW|If there's a genuine round trip, some recipe with a non-zero amount that still lands at home, the "
        "list is linearly dependent, and that round trip is called a dependency relation.",
        # 15
        "Let's use the test as if we couldn't see anything. Give the drone a third move, one, one, two.",
        # 16
        "SLOW|Is there a round trip? Write x times a, plus y times b, plus z times c, equals zero, one "
        "coordinate at a time. That's three equations.",
        # 17
        "SLOW|The first says x is minus z. The second says y is minus z.",
        # 18
        "SLOW|Put both into the third and everything cancels: it's true whatever z is. That freedom is the "
        "round trip.",
        # 19
        "SLOW|Choose z equals one, and minus a, minus b, plus c is zero. Rearranged, c is just a plus b.",
        # 20
        "The third move was dead weight, and the picture confirms it: c lies flat in the drone's sheet.",
        # 21
        "SLOW|Now change the third move to two, two, three, and run the same hunt.",
        # 22
        "SLOW|This time the last equation forces z to be zero, and then x and y are zero too.",
        # 23
        "Only doing nothing brings you home, so these three moves are independent.",
        # 24
        "And the picture agrees: the new arrow sticks out of the sheet, and with it the drone can reach the "
        "entire room. Independent moves are the ones that keep adding new directions.",
        # 25
        "Why define it through getting home, instead of just saying \"one move can be built from the others\"? "
        "Because they're the same thing, and the round-trip version is easier to check.",
        # 26
        "If you have a round trip, pick any control that's actually used and solve for it: that control can be "
        "built from the rest.",
        # 27
        "And if a control can be built from the rest, removing it can't lose you any territory. Three "
        "descriptions of one idea.",
        # 28
        "SLOW|Here's the one step that makes it work. Start from a round trip, and choose a move whose amount "
        "isn't zero.",
        # 29
        "SLOW|Move everything else to the other side and divide by that amount. Now that move is written as a "
        "recipe of the others.",
        # 30
        "SLOW|The division is the whole point: you can only solve for a move that's actually used.",
        # 31
        "And this is called Theorem 1 in the chapter: dependent, built from the others, and removable without "
        "loss, all mean the same thing.",
        # 32
        "There's a sharper way to see it. Add your moves to the list one at a time, and watch the reachable "
        "territory.",
        # 33
        "For an independent list it grows at every step.",
        # 34
        "For a dependent list there's a first step where it doesn't grow, and that move is already reachable "
        "from the ones before it.",
        # 35
        "That's the linear dependence lemma.",
        # 36
        "Its partner says the reverse: if a new move is outside the current span, adding it keeps the list "
        "independent. We'll lean on both of these in a moment.",
        # 37
        "SLOW|In the plane, there's a neat shortcut. For two moves, compute u one v two minus u two v one.",
        # 38
        "SLOW|That number is, up to sign, the area of the parallelogram they make. For blue and gold it's three.",
        # 39
        "Turn gold onto blue's line and the parallelogram flattens, and the number hits zero.",
        # 40
        "Two moves in the plane are dependent exactly when that area is zero. You'll meet this number again as "
        "the determinant.",
        # 41
        "One trap catches almost everyone. Take these three moves.",
        # 42
        "No two of them point the same way, so every pair looks fine.",
        # 43
        "But one right plus one up minus one diagonal brings you home. They're dependent.",
        # 44
        "Independence is a property of the whole list, not of its pairs. You can't check it two at a time.",
        # 45
        "In high dimensions this is exactly why a model can store many feature directions that look unrelated "
        "in pairs, yet together they must contain dead weight.",
        # 46
        "SLOW|Two quick consequences of the definition. Any list containing the zero vector is dependent: one "
        "times zero is a round trip that uses a control.",
        # 47
        "SLOW|And any list that repeats a move is dependent: go forward along it, then back along its copy.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 3", "Dead weight",
                                        "When does an extra control add nothing?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)

        # ------------------------------------------------ 3.1 a third control
        p = act_plane()
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        home_l = T("home", 18, C_DIM).next_to(home, DL, buff=0.06)
        a = ValueTracker(0.0)
        b = ValueTracker(0.0)
        c = ValueTracker(0.0)

        def pos():
            return p.c2p(*(a.get_value() * U + b.get_value() * V + c.get_value() * W))

        ship = craft()
        ship.add_updater(lambda m: m.move_to(pos()))
        uarr = vec(p, *U, C_U, width=6)
        varr = vec(p, *V, C_V, width=6)
        warr = vec(p, *W, C_P, width=6)
        sa = Slider("blue", C_U, a)
        sb = Slider("gold", C_V, b)
        sc = Slider("purple", C_P, c)
        panel = VGroup(sa, sb, sc).arrange(DOWN, buff=0.5)
        for s_ in panel:  # align the tracks
            s_.shift(RIGHT * (sa.track.get_center()[0] - s_.track.get_center()[0]))
        panel.move_to(RIGHT * PX + UP * 1.6)
        fill = patch(p, U, V, 60, color=C_SPAN, op=0.22).set_stroke(width=0)
        whole = T("span(u, v) = the whole plane", 24, C_DIM).move_to(RIGHT * PX + DOWN * 0.3)

        # 1 — two good moves, then purple
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), FadeIn(home_l), run_time=1.0)
        self.play(FadeIn(fill), GrowArrow(uarr), GrowArrow(varr), FadeIn(ship), FadeIn(sa), FadeIn(sb),
                  FadeIn(whole), run_time=1.0)
        self.bring_to_front(uarr, varr, ship)
        self.wait(1.0)
        self.play(FadeIn(sc, shift=UP * 0.2), GrowArrow(warr), run_time=1.0)
        wl = M("<i>w</i> = (3, 3)", 26, C_P).next_to(warr.get_end(), RIGHT, buff=0.12)
        self.play(FadeIn(wl), run_time=0.5)
        self.until_end()

        # 2 — prediction: any new places?
        self.say()
        q = T("Does purple add any new places?", 28, C_P, slant=ITALIC).move_to(RIGHT * PX + DOWN * 1.1)
        fit(q)
        self.play(c.animate.set_value(1), run_time=1.4)
        self.play(c.animate.set_value(0), FadeIn(q), run_time=1.0)
        self.until_end()
        self.wait(5)

        # 3 — purple = blue then gold
        self.say()
        self.play(FadeOut(q), run_time=0.4)
        bu = vec(p, *U, C_U, width=5)
        gv = vec(p, *V, C_V, start=tuple(U), width=5)
        self.play(GrowArrow(bu), run_time=0.9)
        self.play(GrowArrow(gv), run_time=0.9)
        self.play(Indicate(warr, color=C_P, scale_factor=1.05), run_time=0.8)
        weq = M("<i>w</i> = <i>u</i> + <i>v</i>", 34, C_P).move_to(RIGHT * PX + DOWN * 1.1)
        self.play(Write(weq), run_time=0.8)
        self.until_end()

        # 4 — dead weight
        self.say()
        dw = stamp("dead weight", C_P, 32).next_to(weq, DOWN, buff=0.4)
        nt = T("no new territory", 22, C_DIM).next_to(dw, DOWN, buff=0.2)
        self.play(FadeIn(dw, scale=1.15), run_time=0.8)
        self.play(FadeIn(nt), Indicate(fill, color=C_SPAN, scale_factor=1.0), run_time=0.8)
        self.until_end()

        # ------------------------------------------------ 3.2 a test without pictures
        # 5 — hundreds of dimensions
        self.say()
        self.play(FadeOut(VGroup(bu, gv, whole, weq, dw, nt)), run_time=0.5)
        hd = VGroup(T("768 dimensions: nothing to draw", 26, WHITE),
                    T("→ we need a test without pictures", 26, C_W)).arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        fit(hd).set_y(-0.6)
        self.play(FadeIn(hd[0]), run_time=0.8)
        self.wait(1.5)
        self.play(FadeIn(hd[1]), run_time=0.8)
        self.until_end()

        # 6 — the clue
        self.say()
        clue = VGroup(T("the clue:", 24, C_DIM),
                      T("dead weight  ⇒  one destination,", 26, WHITE),
                      T("more than one recipe", 26, WHITE)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        fit(clue).set_y(-0.8)
        self.play(FadeOut(hd), FadeIn(clue), run_time=0.8)
        self.until_end()

        # 7 — recipe one
        self.say()
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        tgt_l = M("(4, 5)", 24, C_W).next_to(tgt, RIGHT, buff=0.12)
        self.play(FadeOut(clue), FadeIn(tgt, scale=2), FadeIn(tgt_l), run_time=0.6)
        r1 = stamp("1 blue + 2 gold + 0 purple", C_W, 24).move_to(RIGHT * PX + DOWN * 0.6)
        path1 = VGroup(Line(p.c2p(0, 0), p.c2p(*U), color=C_U, stroke_width=5),
                       Line(p.c2p(*U), p.c2p(*TGT), color=C_V, stroke_width=5))
        self.play(FadeIn(r1, shift=LEFT * 0.2), run_time=0.5)
        self.play(Create(path1[0]), a.animate.set_value(1), run_time=0.9)
        self.play(Create(path1[1]), b.animate.set_value(2), run_time=1.1)
        self.until_end()

        # 8 — recipe two
        self.say()
        self.play(a.animate.set_value(0), b.animate.set_value(0), run_time=0.6)
        r2 = stamp("0 blue + 1 gold + 1 purple", C_P, 24).next_to(r1, DOWN, buff=0.3)
        path2 = VGroup(Line(p.c2p(0, 0), p.c2p(*V), color=C_V, stroke_width=5),
                       Line(p.c2p(*V), p.c2p(*TGT), color=C_P, stroke_width=5))
        self.play(FadeIn(r2, shift=LEFT * 0.2), run_time=0.5)
        self.play(Create(path2[0]), b.animate.set_value(1), run_time=0.9)
        self.play(Create(path2[1]), c.animate.set_value(1), run_time=0.9)
        self.until_end()

        # 9 — out along one, back along the other
        self.say()
        self.play(a.animate.set_value(0), b.animate.set_value(0), c.animate.set_value(0),
                  path2.animate.set_opacity(0.35), run_time=0.7)
        self.play(a.animate.set_value(1), Indicate(r1, scale_factor=1.04), run_time=1.0)
        self.play(b.animate.set_value(2), run_time=1.2)
        back = VGroup(DashedLine(p.c2p(*TGT), p.c2p(*V), color=C_P, stroke_width=4),
                      DashedLine(p.c2p(*V), p.c2p(0, 0), color=C_V, stroke_width=4))
        self.play(Indicate(r2, scale_factor=1.04), run_time=0.6)
        self.play(c.animate.set_value(-1), Create(back[0]), run_time=1.2)
        self.play(b.animate.set_value(1), Create(back[1]), run_time=1.2)
        self.play(Flash(home, color=WHITE, line_length=0.25), run_time=0.7)
        self.until_end()

        # 10 — subtract: a round trip
        self.say()
        sub = M("(1, 2, 0) − (0, 1, 1) = (1, 1, −1)", 28).next_to(r2, DOWN, buff=0.4)
        fit(sub)
        self.play(Write(sub), run_time=1.4)
        rt = stamp("1 blue + 1 gold − 1 purple = home", WHITE, 24).next_to(sub, DOWN, buff=0.35)
        fit(rt)
        self.play(FadeIn(rt, scale=1.1), run_time=0.8)
        self.until_end()
        self.wait(3)

        # 11 — the trivial combination
        self.say()
        self.play(FadeOut(VGroup(path1, path2, back, r1, r2, sub)), rt.animate.move_to(RIGHT * PX + DOWN * 0.75),
                  run_time=0.7)
        self.play(a.animate.set_value(0), b.animate.set_value(0), c.animate.set_value(0), run_time=1.0)
        triv = stamp("0 blue + 0 gold + 0 purple = home", C_DIM, 24).next_to(rt, DOWN, buff=0.35)
        fit(triv)
        tl = T("trivial combination", 26, WHITE, weight=BOLD).next_to(triv, DOWN, buff=0.15)
        self.play(FadeIn(triv), run_time=0.7)
        self.wait(1.0)
        self.play(Write(tl), run_time=0.8)
        self.until_end()

        # 12 — a round trip that really uses the controls
        self.say()
        ntl = T("non-trivial: really uses the controls", 24, C_W).next_to(rt, UP, buff=0.2)
        fit(ntl)
        self.play(Circumscribe(rt, color=C_W), FadeIn(ntl), run_time=1.2)
        self.play(a.animate.set_value(1), run_time=0.7)
        self.play(b.animate.set_value(1), run_time=0.7)
        self.play(c.animate.set_value(-1), run_time=0.9)
        self.until_end()
        ship.clear_updaters()
        self.play(*[FadeOut(m) for m in self.mobjects if m is not header], run_time=0.7)

        # ------------------------------------------------ 3.3 the names
        # 13 — independent
        self.say()
        defl = M("<i>c</i><sub>1</sub><i>v</i><sub>1</sub> + <i>c</i><sub>2</sub><i>v</i><sub>2</sub> + ⋯ + "
                 "<i>c<sub>k</sub></i><i>v<sub>k</sub></i>", 42)
        defr = M("= 0", 42)
        dfe = VGroup(defl, defr).arrange(RIGHT, buff=0.25).move_to(UP * 2.0)
        capl = T("some recipe…", 24, C_DIM).next_to(defl, DOWN, buff=0.25)
        capr = T("…brings you home", 24, C_DIM).next_to(defr, DOWN, buff=0.25).shift(RIGHT * 0.4)
        tagp = T("PRECISE", 18, C_V, weight=BOLD).next_to(dfe, UP, buff=0.2).align_to(dfe, LEFT)
        self.play(FadeIn(tagp), Write(defl), run_time=1.6)
        self.play(FadeIn(capl), run_time=0.5)
        self.play(Write(defr), FadeIn(capr), run_time=0.9)
        ind = VGroup(P("only when every <i>c<sub>i</sub></i> = 0", 28), T("→", 30),
                     T("linearly independent", 30, C_W, weight=BOLD)).arrange(RIGHT, buff=0.3)
        ind_b = boxed(ind, color=C_W).move_to(UP * 0.0)
        self.play(FadeIn(ind_b, shift=UP * 0.2), run_time=1.0)
        self.until_end(1.0)

        # 14 — dependent, dependency relation
        self.say()
        dep = VGroup(P("some <i>c<sub>i</sub></i> ≠ 0", 28), T("→", 30),
                     T("linearly dependent", 30, C_RED, weight=BOLD)).arrange(RIGHT, buff=0.3)
        dep_b = boxed(dep, color=C_RED).next_to(ind_b, DOWN, buff=0.4)
        self.play(FadeIn(dep_b, shift=UP * 0.2), run_time=1.0)
        self.wait(1.5)
        rel = T("that round trip = a dependency relation", 28, WHITE).next_to(dep_b, DOWN, buff=0.45)
        self.play(FadeIn(rel), run_time=0.8)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(defl, defr, capl, capr, tagp, ind_b, dep_b, rel)), run_time=0.6)

        # 15 — the hunt in R^3: a, b, c
        self.say()
        vw = View3()
        flr = vw.floor()
        axs = vw.axes()
        aar = vw.arrow((0, 0, 0), A3, C_U)
        bar_ = vw.arrow((0, 0, 0), B3, C_V)
        car = vw.arrow((0, 0, 0), C3, C_P)
        names = VGroup(M("<i>a</i> = (1, 0, 1)", 28, C_U), M("<i>b</i> = (0, 1, 1)", 28, C_V),
                       M("<i>c</i> = (1, 1, 2)", 28, C_P)).arrange(RIGHT, buff=0.4)
        fit(names).set_y(2.75)
        self.play(FadeIn(flr), FadeIn(axs), run_time=0.8)
        self.play(GrowArrow(aar), GrowArrow(bar_), FadeIn(names[:2]), run_time=0.9)
        self.play(GrowArrow(car), FadeIn(names[2]), run_time=0.9)
        self.until_end()

        # 16 — three equations, row by row
        self.say()
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        cols = [column_vec(["1", "0", "1"], 24, C_U, v_buff=0.38),
                column_vec(["0", "1", "1"], 24, C_V, v_buff=0.38),
                column_vec(["1", "1", "2"], 24, C_P, v_buff=0.38)]
        zero = column_vec(["0", "0", "0"], 24, WHITE, v_buff=0.38)
        ve = VGroup(M("<i>x</i>", 28), cols[0], M("+ <i>y</i>", 28), cols[1], M("+ <i>z</i>", 28), cols[2],
                    M("=", 28), zero).arrange(RIGHT, buff=0.14)
        fit(ve).set_y(1.3)
        tagp.next_to(ve, UP, buff=0.1).align_to(ve, LEFT)
        self.play(FadeIn(tagp), FadeIn(ve), run_time=1.2)
        eqs = VGroup(M("<i>x</i> + <i>z</i> = 0", 28), M("<i>y</i> + <i>z</i> = 0", 28),
                     M("<i>x</i> + <i>y</i> + 2<i>z</i> = 0", 28)).arrange(DOWN, buff=0.14, aligned_edge=LEFT)
        eqs.next_to(ve, DOWN, buff=0.35).set_x(PX)
        for i in range(3):
            row = VGroup(*[cv.entries[i][0] for cv in cols], zero.entries[i][0])
            hl = SurroundingRectangle(row, color=WHITE, buff=0.06, stroke_width=1.5)
            self.play(Create(hl), run_time=0.4)
            self.play(TransformFromCopy(row, eqs[i]), run_time=0.9)
            self.play(FadeOut(hl), run_time=0.2)
        self.until_end(1.0)

        # 17 — x = −z, y = −z
        self.say()
        s1 = M("<i>x</i> = −<i>z</i>,    <i>y</i> = −<i>z</i>", 28, C_V)
        s1.next_to(eqs, DOWN, buff=0.3).align_to(eqs, LEFT)
        self.play(Indicate(eqs[0], color=C_V), run_time=0.8)
        self.play(Indicate(eqs[1], color=C_V), Write(s1), run_time=1.2)
        self.until_end(1.0)

        # 18 — into the third: true for every z
        self.say()
        s2 = M("−<i>z</i> − <i>z</i> + 2<i>z</i> = 0", 28, C_V).next_to(s1, DOWN, buff=0.2).align_to(s1, LEFT)
        s2c = T("true for every z  →  a round trip", 22, C_W).next_to(s2, RIGHT, buff=0.3)
        self.play(Indicate(eqs[2], color=C_V), run_time=0.8)
        self.play(TransformFromCopy(VGroup(eqs[2], s1), s2), run_time=1.2)
        if s2c.get_right()[0] > 6.8:
            s2c.next_to(s2, DOWN, buff=0.12).align_to(s2, LEFT)
        self.play(FadeIn(s2c), run_time=0.6)
        self.until_end(1.0)

        # 19 — z = 1
        self.say()
        s3 = M("<i>z</i> = 1:   −<i>a</i> − <i>b</i> + <i>c</i> = 0   ⇒   <i>c</i> = <i>a</i> + <i>b</i>", 28, C_P)
        s3.next_to(VGroup(s2, s2c), DOWN, buff=0.25)
        fit(s3)
        self.play(Write(s3), run_time=1.8)
        self.until_end(1.2)

        # 20 — the picture: c lies in the sheet
        self.say()
        sheet = vw.sheet(A3, B3)
        self.play(FadeIn(sheet), run_time=0.8)
        self.bring_to_front(aar, bar_, car)
        wa = vw.arrow((0, 0, 0), A3, C_U, width=4)
        wb = vw.arrow(A3, C3, C_V, width=4)
        self.play(GrowArrow(wa), run_time=0.7)
        self.play(GrowArrow(wb), run_time=0.7)
        self.play(Flash(car.get_end(), color=C_P, line_length=0.2), run_time=0.6)
        inl = T("the picture: c lies in the sheet", 24, C_P).move_to(RIGHT * PX + DOWN * 3.4)
        self.play(FadeIn(inl), run_time=0.5)
        self.until_end()

        # 21 — change c to (2, 2, 3)
        self.say()
        self.play(FadeOut(VGroup(wa, wb, inl, car, s1, s2, s2c, s3)), run_time=0.6)
        n2 = M("<i>c</i> = (2, 2, 3)", 28, C_X).move_to(names[2])
        cols2 = column_vec(["2", "2", "3"], 24, C_X, v_buff=0.38).move_to(cols[2])
        eqs2 = VGroup(M("<i>x</i> + 2<i>z</i> = 0", 28), M("<i>y</i> + 2<i>z</i> = 0", 28),
                      M("<i>x</i> + <i>y</i> + 3<i>z</i> = 0", 28)).arrange(DOWN, buff=0.14, aligned_edge=LEFT)
        eqs2.move_to(eqs).align_to(eqs, LEFT)
        self.play(Transform(names[2], n2), Transform(cols[2], cols2), run_time=1.0)
        self.play(FadeOut(eqs, shift=UP * 0.1), FadeIn(eqs2, shift=UP * 0.1), run_time=1.0)
        eqs = eqs2
        self.until_end(1.0)

        # 22 — z forced to 0
        self.say()
        t1 = M("<i>x</i> = −2<i>z</i>,    <i>y</i> = −2<i>z</i>", 28, C_V)
        t1.next_to(eqs, DOWN, buff=0.3).align_to(eqs, LEFT)
        t2 = M("−4<i>z</i> + 3<i>z</i> = 0   ⇒   <i>z</i> = 0", 28, C_V).next_to(t1, DOWN, buff=0.2).align_to(t1, LEFT)
        t3 = M("so  <i>x</i> = <i>y</i> = 0", 28, C_V).next_to(t2, DOWN, buff=0.2).align_to(t1, LEFT)
        self.play(Write(t1), run_time=1.0)
        self.play(Write(t2), run_time=1.2)
        self.play(Write(t3), run_time=0.8)
        self.until_end(1.0)

        # 23 — only the trivial recipe → independent
        self.say()
        ok = stamp("only the trivial recipe  →  independent", C_W, 24).next_to(t3, DOWN, buff=0.3)
        fit(ok)
        self.play(FadeIn(ok, scale=1.1), run_time=0.8)
        self.until_end()

        # 24 — it sticks out; the room fills
        self.say()
        dar = vw.arrow((0, 0, 0), D3, C_X)
        foot = DashedLine(vw.p(*D3), vw.p(2, 2, 4), color=C_X, stroke_width=3, dash_length=0.08)
        self.play(GrowArrow(dar), run_time=0.9)
        self.play(Create(foot), run_time=0.6)
        stack = VGroup(*[vw.sheet(A3, B3, lo=-0.6, hi=2.2, lines=False, op=0.08, offset=k * 0.32 * D3)
                         for k in (-2, -1, 1, 2)])
        self.play(LaggedStart(*[FadeIn(sht) for sht in stack], lag_ratio=0.35), run_time=2.4)
        room = stamp("span(a, b, c) = all of ℝ³", C_X, 24).move_to(ok)
        self.play(FadeOut(ok), FadeIn(room), run_time=0.6)
        self.until_end()
        self.play(*[FadeOut(m) for m in self.mobjects if m is not header], run_time=0.7)

        # 25 — three descriptions in a loop
        self.say()
        lp = [T("a round trip exists", 28, WHITE),
              VGroup(T("one move can be built", 28, WHITE), T("from the others", 28, WHITE)).arrange(DOWN, buff=0.1),
              VGroup(T("removing it loses", 28, WHITE), T("no territory", 28, WHITE)).arrange(DOWN, buff=0.1)]
        boxes = [boxed(lp[0], C_RED), boxed(lp[1], C_U), boxed(lp[2], C_V)]
        boxes[0].move_to(UP * 1.9)
        boxes[1].move_to(RIGHT * 3.6 + DOWN * 1.2)
        boxes[2].move_to(LEFT * 3.6 + DOWN * 1.2)
        self.play(LaggedStart(*[FadeIn(bx, scale=0.9) for bx in boxes], lag_ratio=0.5), run_time=2.0)
        self.until_end()

        # 26 — round trip → built from the rest
        self.say()
        ar1 = CurvedArrow(boxes[0].get_right() + RIGHT * 0.1, boxes[1].get_top() + UP * 0.1, angle=-PI / 3,
                          color=C_DIM, stroke_width=4)
        l1 = T("solve for a used control", 22, C_DIM).next_to(ar1, UR, buff=0.0).shift(LEFT * 0.4 + DOWN * 0.2)
        self.play(Create(ar1), run_time=1.0)
        self.play(FadeIn(l1), Indicate(boxes[1], scale_factor=1.04, color=C_U), run_time=0.9)
        self.until_end()

        # 27 — built → removable → (back to) round trip
        self.say()
        ar2 = CurvedArrow(boxes[1].get_bottom() + DOWN * 0.1, boxes[2].get_bottom() + DOWN * 0.1, angle=-PI / 3,
                          color=C_DIM, stroke_width=4)
        ar3 = CurvedArrow(boxes[2].get_top() + UP * 0.1, boxes[0].get_left() + LEFT * 0.1, angle=-PI / 3,
                          color=C_DIM, stroke_width=4)
        self.play(Create(ar2), Indicate(boxes[2], scale_factor=1.04, color=C_V), run_time=1.2)
        self.wait(1.0)
        self.play(Create(ar3), run_time=1.0)
        one = T("three descriptions of one idea", 26, C_W, weight=BOLD).move_to(DOWN * 0.1)
        self.play(FadeIn(one), run_time=0.7)
        self.until_end()
        self.play(FadeOut(VGroup(*boxes, ar1, ar2, ar3, l1, one)), run_time=0.6)

        # 28 — the key step: a round trip with c_j ≠ 0
        self.say()
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        k1a = M("<i>c</i><sub>1</sub><i>v</i><sub>1</sub> + ⋯ +", 36)
        k1b = M("<i>c<sub>j</sub></i>", 36, C_V)
        k1c = M("<i>v<sub>j</sub></i> + ⋯ + <i>c<sub>k</sub></i><i>v<sub>k</sub></i> = 0", 36)
        k1 = VGroup(k1a, k1b, k1c).arrange(RIGHT, buff=0.3, aligned_edge=DOWN).move_to(UP * 2.0)
        tagp.next_to(k1, UP, buff=0.18).align_to(k1, LEFT)
        self.play(FadeIn(tagp), Write(k1), run_time=1.6)
        circ = Circle(color=C_V, stroke_width=3).surround(k1b, buffer_factor=1.5)
        cnz = M("<i>c<sub>j</sub></i> ≠ 0", 30, C_V).next_to(circ, UP, buff=0.12)
        if cnz.get_top()[1] > 3.0:
            cnz.next_to(k1, RIGHT, buff=0.4)
        self.play(Create(circ), FadeIn(cnz), run_time=1.0)
        self.until_end(1.0)

        # 29 — move the rest across, divide
        self.say()
        k2 = M("<i>c<sub>j</sub></i> <i>v<sub>j</sub></i>  =  − Σ<sub><i>i</i>≠<i>j</i></sub> "
               "<i>c<sub>i</sub></i> <i>v<sub>i</sub></i>", 36).next_to(k1, DOWN, buff=0.7)
        k3a = M("<i>v<sub>j</sub></i>  =  Σ<sub><i>i</i>≠<i>j</i></sub> ( −<i>c<sub>i</sub></i>", 36)
        k3b = M("/ <i>c<sub>j</sub></i>", 36, C_V)
        k3c = M(") <i>v<sub>i</sub></i>", 36)
        k3 = VGroup(k3a, k3b, k3c).arrange(RIGHT, buff=0.1).next_to(k2, DOWN, buff=0.6)
        self.play(TransformFromCopy(k1, k2), run_time=1.4)
        self.wait(1.0)
        self.play(TransformFromCopy(k2, k3), run_time=1.4)
        rec = M("<i>v<sub>j</sub></i> = a recipe of the others", 28, C_DIM).next_to(k3, DOWN, buff=0.35)
        self.play(FadeIn(rec), run_time=0.6)
        self.until_end(1.2)

        # 30 — the division needs c_j ≠ 0
        self.say()
        warn = M("allowed only because <i>c<sub>j</sub></i> ≠ 0", 30, C_X)
        warn.next_to(k3, DOWN, buff=0.8).set_x(k3b.get_x() + 1.0)
        wptr = Arrow(warn.get_top(), k3b.get_bottom(), buff=0.1, color=C_X, stroke_width=3,
                     tip_length=0.16)
        self.play(FadeOut(rec), run_time=0.4)
        self.play(Indicate(k3b, color=C_X, scale_factor=1.3), run_time=0.8)
        self.play(FadeIn(warn), GrowArrow(wptr), run_time=0.9)
        self.until_end(1.2)

        # 31 — Theorem 1
        self.say()
        th = VGroup(T("Theorem 1", 26, C_U, weight=BOLD),
                    T("dependent  ⇔  some move is built from the others", 26, WHITE),
                    T("⇔  it can be removed without losing any span", 26, WHITE)).arrange(DOWN, buff=0.15,
                                                                                         aligned_edge=LEFT)
        thb = boxed(th, C_U).move_to(DOWN * 2.6)
        if thb.width > 12.6:
            thb.scale_to_fit_width(12.6).move_to(DOWN * 2.6)
        self.play(FadeOut(VGroup(warn, wptr)), FadeIn(thb, shift=UP * 0.2), run_time=1.0)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(tagp, k1, circ, cnz, k2, k3, thb)), run_time=0.6)

        # 32 — add moves one at a time
        self.say()
        p = act_plane()
        home = Dot(p.c2p(0, 0), radius=0.1, color=WHITE)
        self.play(Create(p, lag_ratio=0.02), run_time=1.0)
        self.play(FadeIn(home, scale=2), Flash(home, color=WHITE, line_length=0.2), run_time=0.8)
        log_t = T("list  →  span", 24, C_DIM).move_to(RIGHT * PX + UP * 2.5)

        def row(lst, sp, color=WHITE, mark=""):
            g = VGroup(M(lst, 28, color), T("→", 24, C_DIM), T(sp, 24, color))
            g.arrange(RIGHT, buff=0.25)
            if mark:
                g.add(T(mark, 22, C_W if mark == "grows" else C_RED, weight=BOLD))
                g.arrange(RIGHT, buff=0.25)
            return g

        rows = VGroup(row("( )", "a point (home)"))
        rows[0].next_to(log_t, DOWN, buff=0.3)
        rows[0].align_to(RIGHT * 0.9, LEFT)
        self.play(FadeIn(log_t), FadeIn(rows[0]), run_time=0.7)
        self.until_end()

        def add_row(r):
            r.next_to(rows[-1], DOWN, buff=0.22).align_to(rows[0], LEFT)
            rows.add(r)
            return r

        # 33 — independent: grows every step
        self.say()
        ln = segment_line(p, U, C_SPAN, 5)
        ua = vec(p, *U, C_U, width=6)
        r1 = add_row(row("(<i>u</i>)", "a line", WHITE, "grows"))
        self.play(GrowArrow(ua), Create(ln), FadeIn(r1), run_time=1.2)
        self.bring_to_front(ua, home)
        va = vec(p, *V, C_V, width=6)
        fl = patch(p, U, V, 60, color=C_SPAN, op=0.3).set_stroke(width=0)
        r2 = add_row(row("(<i>u</i>, <i>v</i>)", "the plane", WHITE, "grows"))
        self.play(GrowArrow(va), FadeIn(fl), FadeIn(r2), run_time=1.2)
        self.bring_to_front(ua, va, home)
        self.until_end()

        # 34 — dependent: a first step with no growth
        self.say()
        wa = vec(p, *W, C_P, width=6)
        r3 = add_row(row("(<i>u</i>, <i>v</i>, <i>w</i>)", "the plane", WHITE, "no growth"))
        self.play(GrowArrow(wa), FadeIn(r3), run_time=1.0)
        self.play(Indicate(fl, color=C_SPAN, scale_factor=1.0), run_time=0.8)
        fr = stamp("first redundant move: w = u + v", C_RED, 24).next_to(rows, DOWN, buff=0.35)
        fit(fr)
        self.play(FadeIn(fr, scale=1.1), Flash(wa.get_end(), color=C_RED), run_time=0.9)
        self.until_end()

        # 35 — the linear dependence lemma
        self.say()
        lem = VGroup(T("linear dependence lemma", 28, C_U, weight=BOLD),
                     VGroup(T("dependent list  ⇒", 24),
                            M("some <i>v<sub>j</sub></i> ∈ span(<i>v</i><sub>1</sub>, …, "
                              "<i>v</i><sub><i>j</i>−1</sub>)", 28)).arrange(RIGHT, buff=0.2)
                     ).arrange(DOWN, buff=0.15, aligned_edge=LEFT)
        lemb = boxed(lem, C_U)
        lemb.next_to(fr, DOWN, buff=0.4)
        fit(lemb)
        self.play(FadeIn(lemb, shift=UP * 0.2), run_time=1.0)
        self.until_end(1.0)

        # 36 — its partner
        self.say()
        self.play(FadeOut(VGroup(fr, rows[3])), lemb.animate.next_to(rows[2], DOWN, buff=0.35).set_x(PX),
                  FadeOut(wa), run_time=0.7)
        part = VGroup(T("partner", 26, C_V, weight=BOLD),
                      M("<i>v</i> ∉ span(current list),  list independent", 26),
                      P("⇒  adding <i>v</i> keeps it independent", 24)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        partb = boxed(part, C_V).next_to(lemb, DOWN, buff=0.3)
        fit(partb)
        self.play(FadeOut(fl), run_time=0.4)
        self.play(FadeIn(partb, shift=UP * 0.2), Indicate(va, color=C_V), Indicate(ln, color=C_U), run_time=1.2)
        self.play(FadeIn(fl), run_time=0.6)
        self.bring_to_front(ua, va, home)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(log_t, rows[:3], lemb, partb, fl, ln)), run_time=0.6)

        # 37 — the 2-D area test
        self.say()
        gt = ValueTracker(0.0)

        def gold():
            t = gt.get_value()
            ang = interpolate(np.arctan2(2, 1), np.arctan2(2, 4), t)
            r = interpolate(np.sqrt(5), np.sqrt(20), t)
            return np.array([r * np.cos(ang), r * np.sin(ang)])

        def gr():  # one rounding for every readout
            g = gold()
            return round(g[0], 1), round(g[1], 1)

        self.remove(va)
        va = always_redraw(lambda: vec(p, *gold(), C_V, width=6))
        para = always_redraw(lambda: Polygon(p.c2p(0, 0), p.c2p(*U), p.c2p(*(U + gold())), p.c2p(*gold()),
                                             stroke_width=2, stroke_color=C_P).set_fill(C_P, 0.35))
        self.add(para, va)
        self.bring_to_front(ua, home)
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        dform = M("<i>D</i> = <i>u</i><sub>1</sub><i>v</i><sub>2</sub> − <i>u</i><sub>2</sub><i>v</i><sub>1</sub>",
                  38).move_to(RIGHT * PX + UP * 2.0)
        tagp.next_to(dform, UP, buff=0.15).align_to(dform, LEFT)
        self.play(FadeIn(para), run_time=0.6)
        self.play(FadeIn(tagp), Write(dform), run_time=1.6)
        self.until_end(1.0)

        # 38 — area; blue and gold give 3
        self.say()
        live = always_redraw(lambda: M(
            f"= 2·{fmt(gr()[1])} − 1·{fmt(gr()[0])} = {fmt(2 * gr()[1] - gr()[0])}", 32, WHITE)
            .next_to(dform, DOWN, buff=0.35).align_to(dform, LEFT))
        area = T("|D| = area of the parallelogram", 24, C_P).next_to(dform, DOWN, buff=1.2).set_x(PX)
        self.play(FadeIn(area), Indicate(para, color=C_P, scale_factor=1.03), run_time=1.0)
        exact = M("= 2·2 − 1·1 = 3", 32, WHITE).next_to(dform, DOWN, buff=0.35).align_to(dform, LEFT)
        self.play(Write(exact), run_time=1.2)
        self.until_end(1.0)

        # 39 — rotate gold onto blue's line: D → 0
        self.say()
        self.remove(exact)
        self.add(live)
        self.play(gt.animate.set_value(1), run_time=4.0)
        self.remove(live)
        exact0 = M("= 2·2 − 1·4 = 0", 32, C_RED).next_to(dform, DOWN, buff=0.35).align_to(dform, LEFT)
        self.add(exact0)
        self.play(Indicate(exact0, color=C_RED), run_time=0.8)
        self.until_end()

        # 40 — dependent ⇔ D = 0; determinant
        self.say()
        crit = stamp("dependent  ⇔  D = 0", C_RED, 28).next_to(area, DOWN, buff=0.45).set_x(PX)
        det = T("this number: the determinant (preview)", 24, C_U).next_to(crit, DOWN, buff=0.35).set_x(PX)
        fit(det)
        self.play(FadeIn(crit, scale=1.1), run_time=0.8)
        self.wait(1.2)
        self.play(FadeIn(det), run_time=0.7)
        self.until_end(1.0)
        va.clear_updaters()
        para.clear_updaters()
        self.play(*[FadeOut(m) for m in self.mobjects if m is not header], run_time=0.7)

        # ------------------------------------------------ 3.4 a trap
        # 41 — three moves
        self.say()
        q2 = plane((-1, 3), (-1, 3), unit=1.15).to_edge(LEFT, buff=0.9).shift(DOWN * 0.3)
        e1 = vec(q2, 1, 0, C_U, width=6)
        e2 = vec(q2, 0, 1, C_V, width=6)
        e3 = vec(q2, 1, 1, C_P, width=6)
        l1_ = M("(1, 0)", 24, C_U).next_to(e1.get_end(), DOWN, buff=0.15)
        l2_ = M("(0, 1)", 24, C_V).next_to(e2.get_end(), LEFT, buff=0.15)
        l3_ = M("(1, 1)", 24, C_P).next_to(e3.get_end(), UR, buff=0.1)
        trio = VGroup(e1, e2, e3)
        self.play(Create(q2, lag_ratio=0.02), run_time=0.8)
        self.play(LaggedStart(*[GrowArrow(e) for e in trio], lag_ratio=0.4),
                  FadeIn(VGroup(l1_, l2_, l3_)), run_time=1.4)
        self.until_end()

        # 42 — every pair looks fine
        self.say()
        prs = [((0, 1), "(1, 0), (0, 1)"), ((0, 2), "(1, 0), (1, 1)"), ((1, 2), "(0, 1), (1, 1)")]
        prow = VGroup()
        for k, (ij, txt) in enumerate(prs):
            r = VGroup(M(txt, 26), T("✓ pair OK", 24, C_W)).arrange(RIGHT, buff=0.4)
            r.move_to(RIGHT * PX + UP * (2.4 - 0.55 * k))
            other = [m for m in range(3) if m not in ij][0]
            self.play(trio[other].animate.set_opacity(0.15), FadeIn(r), run_time=0.6)
            self.wait(0.3)
            self.play(trio[other].animate.set_opacity(1), run_time=0.3)
            prow.add(r)
        self.until_end()

        # 43 — a closed triangle: dependent
        self.say()
        tri = VGroup(vec(q2, 1, 0, C_U, width=4).shift(DOWN * 0.08),
                     vec(q2, 0, 1, C_V, start=(1, 0), width=4).shift(RIGHT * 0.08),
                     Arrow(q2.c2p(1, 1), q2.c2p(0, 0), buff=0, color=C_P, stroke_width=4, tip_length=0.2))
        for t_ in tri:
            self.play(GrowArrow(t_), run_time=0.6)
        teq = M("(1, 0) + (0, 1) − (1, 1) = (0, 0)", 28).move_to(RIGHT * PX + UP * 0.6)
        fit(teq)
        dst = stamp("dependent", C_RED, 30).next_to(teq, DOWN, buff=0.3)
        self.play(Write(teq), run_time=1.0)
        self.play(FadeIn(dst, scale=1.2), run_time=0.6)
        self.until_end()

        # 44 — a property of the whole list
        self.say()
        prop = boxed(VGroup(T("independence is a property", 26, WHITE),
                            T("of the whole list, not of its pairs", 26, WHITE)).arrange(DOWN, buff=0.1), C_U)
        prop.next_to(dst, DOWN, buff=0.45)
        fit(prop)
        self.play(FadeIn(prop, shift=UP * 0.2), run_time=0.9)
        self.until_end()

        # 45 — high dimensions
        self.say()
        hd2 = VGroup(T("in high dimensions: features can look", 22, C_DIM),
                     T("unrelated in pairs, yet together hold dead weight", 22, C_DIM)).arrange(DOWN, buff=0.08)
        hd2.next_to(prop, DOWN, buff=0.3)
        fit(hd2)
        self.play(FadeIn(hd2), run_time=0.8)
        self.until_end()

        # 46 — a list containing the zero vector
        self.say()
        self.play(FadeOut(VGroup(prow, hd2, teq, dst)), prop.animate.move_to(RIGHT * PX + UP * 2.2), run_time=0.7)
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        z1 = VGroup(T("contains 0:", 26, C_DIM), M("1·0 = 0", 30), T("→ dependent", 26, C_RED, weight=BOLD))
        z1.arrange(RIGHT, buff=0.3)
        fit(z1).set_y(0.4)
        tagp.next_to(z1, UP, buff=0.15).align_to(z1, LEFT)
        self.play(FadeIn(tagp), FadeIn(z1[0]), Write(z1[1]), run_time=1.2)
        self.play(FadeIn(z1[2]), run_time=0.6)
        self.until_end(1.2)

        # 47 — a repeated move
        self.say()
        z2 = VGroup(T("repeats v:", 26, C_DIM), M("1·<i>v</i> + (−1)·<i>v</i> = 0", 30),
                    T("→ dependent", 26, C_RED, weight=BOLD)).arrange(RIGHT, buff=0.3)
        fit(z2).set_y(-0.6)
        z2.align_to(z1, LEFT)
        fwd = vec(q2, 2, 1, C_U, width=5).shift(UP * 0.06)
        bk = Arrow(q2.c2p(2, 1), q2.c2p(0, 0), buff=0, color=C_U, stroke_width=5, tip_length=0.2).shift(DOWN * 0.1)
        self.play(FadeOut(VGroup(tri, trio, l1_, l2_, l3_)), run_time=0.5)
        self.play(FadeIn(z2[0]), Write(z2[1]), GrowArrow(fwd), run_time=1.2)
        self.play(GrowArrow(bk), FadeIn(z2[2]), run_time=0.9)
        self.done(1.2)
        self.clear_all()
