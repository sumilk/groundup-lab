"""LA01 v3 — Act 5: Seats (exchange lemma, dimension, finite-dimensional, dimension results, rank)."""
from common import *
from v3_act1 import fmt  # noqa: F401
from v3_act4 import C_Q, GRIDS, PX, bg, chip, fit, lattice, machine

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
W = np.array([3.0, 3.0])
CHAIR = "#6B7385"
C_ORIG = "#C9CED8"     # the original (spanning) moves


def sub(name, i):
    return f"<i>{name}</i><sub>{i}</sub>"


def chair(color=CHAIR, s=1.0):
    seat = Line(LEFT * 0.42, RIGHT * 0.42, stroke_width=6)
    back = Line(seat.get_left(), seat.get_left() + UP * 0.8, stroke_width=6)
    l1 = Line(seat.get_left() + RIGHT * 0.04, seat.get_left() + RIGHT * 0.04 + DOWN * 0.45, stroke_width=5)
    l2 = Line(seat.get_right() + LEFT * 0.04, seat.get_right() + LEFT * 0.04 + DOWN * 0.45, stroke_width=5)
    g = VGroup(back, seat, l1, l2).set_color(color)
    g.scale(s)
    return g


def card(markup, color=C_ORIG, size=30, w=0.7, h=0.62, dashed=False):
    r = RoundedRectangle(width=w, height=h, corner_radius=0.1, stroke_color=color, stroke_width=3)
    r.set_fill(color, 0.2)
    if dashed:
        r = DashedVMobject(r, num_dashes=24)
    t = M(markup, size, color).move_to(r)
    return VGroup(r, t)


def on_seat(c, ch):
    """Position a card so it sits on chair ch."""
    return c.move_to(ch[1].get_center() + UP * (c.height / 2 + 0.03) + RIGHT * 0.06)


class V3Act5(NScene):
    BEATS = [
        # 0
        "Act five. Seats.",
        # 1  (5.1)
        "Every basis we've drawn in the plane has had two moves. Is that a coincidence?",
        # 2
        "Could you find a clever basis of the plane with three moves, or with one?",
        # 3
        "One is clearly too few: one move only ever reaches a line.",
        # 4
        "Three is more interesting. Could three moves reach the plane with no dead weight at all?",
        # 5  (5.2)
        "Here's a game that answers it. Imagine the moves that reach everywhere sitting in a row of chairs.",
        # 6
        "Now independent moves arrive as guests, one at a time.",
        # 7
        "Each time a guest sits down, one of the original moves gives up its seat, and here's the remarkable "
        "part: the row can still reach everywhere.",
        # 8
        "The guest can do the job of the move it replaced.",
        # 9
        "Why does someone always have to stand up, and why is it never a guest? Here's the careful version.",
        # 10
        "SLOW|Put all the guests first, then the remaining originals.",
        # 11
        "SLOW|The enlarged list has dead weight, because the row already reached everywhere before the new guest "
        "arrived.",
        # 12
        "SLOW|Now scan from the left for the first move that can be built from the ones before it.",
        # 13
        "SLOW|It can't be a guest: the guests are independent, so none of them is built from earlier guests.",
        # 14
        "SLOW|So it's an original, and removing it keeps the row reaching everywhere.",
        # 15
        "So follow the game to the end. Every guest takes the seat of an original move.",
        # 16
        "If there are three chairs, at most three independent guests can ever be seated.",
        # 17
        "A proposed fourth guest would need an original move to stand up, and there are none left.",
        # 18
        "So a fourth move can't be independent of the other three.",
        # 19
        "That's the exchange lemma. If some list of independent moves sits inside a space that n moves can "
        "reach, then there are at most n of them.",
        # 20
        "You can never pack more independent directions into a space than the number of moves it takes to "
        "reach it.",
        # 21
        "Let's play it with real moves. The seats start with the three standard moves.",
        # 22
        "SLOW|The first guest is one, one, zero. Put it at the front and scan along the row for the first move we "
        "could already build from the ones before it.",
        # 23
        "SLOW|It's e two: one, one, zero minus one, zero, zero is exactly zero, one, zero. So e two stands up.",
        # 24
        "SLOW|The second guest is zero, one, one. Scan again.",
        # 25
        "SLOW|Can we build e one from the two guests? We'd need a, a plus b, b to equal one, zero, zero, which "
        "forces a equals one and b equals zero, and then the middle entry is one, not zero. So no.",
        # 26
        "SLOW|Can we build e three? Yes: minus the first guest, plus the second, plus e one gives zero, zero, one. "
        "So e three stands up.",
        # 27
        "At every step the row still reaches all of space, and its length never changes.",
        # 28
        "SLOW|In symbols: if m moves are independent in a space that n moves can span, then m is at most n. The "
        "proof is exactly this game, played in general.",
        # 29  (5.3)
        "Now apply the game twice. Take any two bases of the same space.",
        # 30
        "The first is independent and the second reaches everything, so the first can't be longer.",
        # 31
        "Swap their roles, and the second can't be longer either.",
        # 32
        "So every basis of a space has exactly the same number of moves.",
        # 33
        "That number belongs to the space itself, not to any particular choice of grid. It's called the "
        "dimension.",
        # 34
        "The plane has dimension two. Space has dimension three. And R n, the lists of n numbers, has dimension "
        "n, because the standard basis has n moves.",
        # 35
        "A space that some finite list of moves can reach is called finite-dimensional.",
        # 36
        "Everything in this chapter lives in finite-dimensional spaces, though you'll soon meet one that isn't.",
        # 37
        "The game gives us four results almost for free.",
        # 38
        "SLOW|First, in R n, more than n vectors are always dependent, and fewer than n can never span.",
        # 39
        "SLOW|Second, every basis of a space has the same length, so dimension is well defined.",
        # 40
        "SLOW|Third, a shortcut: in an n-dimensional space, a list of exactly n vectors only needs to pass one of "
        "the two tests.",
        # 41
        "Watch why. Feed n independent moves into the grow machine from Act four: it would extend them to a "
        "basis, but every basis has exactly n moves, so there's nothing to add. They already span.",
        # 42
        "Feed n spanning moves into the trim machine: every basis has n moves, so there's nothing to remove. "
        "They're already independent.",
        # 43
        "That saves a lot of work when you're checking a basis.",
        # 44
        "SLOW|And fourth, a space inside another can't have more dimensions than the one it sits in, and if it "
        "has the same number, it's the whole thing.",
        # 45  (5.4)
        "Here's the promise from the start of the video.",
        # 46
        "A weight matrix with seven hundred sixty-eight rows and three thousand seventy-two columns has three "
        "thousand seventy-two column arrows, and each one is a move in a space of dimension seven hundred "
        "sixty-eight.",
        # 47
        "By the exchange lemma, at most seven hundred sixty-eight of them can be independent.",
        # 48
        "The other columns must be built from those.",
        # 49
        "It doesn't matter how the model was trained, how clever the optimiser was, or how many hours it ran. "
        "That's a fact about counting, not about learning.",
        # 50
        "And the same count says that if someone claims a model stores ten thousand separate feature "
        "directions in a seven hundred sixty-eight dimensional space, those directions can't be independent.",
        # 51
        "Whether they still work well is another question entirely, and we'll come back to it when we add "
        "geometry.",
        # 52
        "SLOW|The largest number of independent columns a matrix has is called its rank.",
        # 53
        "SLOW|For this matrix, the rank can be at most seven hundred sixty-eight, the smaller of its two sides.",
        # 54
        "We'll see in Act eight why rank is the single most useful number you can know about a matrix.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 5", "Seats", "Can bases have different sizes?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)

        # ------------------------------------------------------------ 5.1 can bases have different sizes?
        p = plane((-2, 6), (-1, 6), unit=0.66).to_edge(LEFT, buff=0.5).shift(DOWN * 0.25)
        p.background_lines.set_stroke(opacity=0.0)
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)

        self.say()  # 1
        self.play(FadeIn(p), FadeIn(home), run_time=0.6)
        names = ["square grid", "blue/gold grid", "teal grid"]
        cols = [WHITE, C_V, C_Q]
        rows = VGroup()
        cur = VGroup()
        for k, (b1, b2, c1, c2) in enumerate(GRIDS):
            g = lattice(p, b1, b2, c1, c2, width=2, opacity=0.6)
            a1 = vec(p, *b1, c1 if k else WHITE, width=6)
            a2 = vec(p, *b2, c2 if k else WHITE, width=6)
            new = VGroup(g, a1, a2)
            r = VGroup(T(names[k], 26, cols[k]), T("2 moves", 26)).arrange(RIGHT, buff=0.4)
            rows.add(r)
            if k == 0:
                r.move_to([PX, 1.9, 0])
            else:
                r.next_to(rows[k - 1], DOWN, buff=0.3).align_to(rows[0], LEFT)
            if len(cur):
                self.play(FadeOut(cur), FadeIn(new), FadeIn(r), run_time=0.8)
            else:
                self.play(FadeIn(new), FadeIn(r), run_time=0.8)
            cur = new
            self.wait(0.6)
        self.until_end()

        self.say()  # 2
        qq = VGroup(T("could some basis have", 28), T("3 moves?   or 1?", 34, C_X, weight=BOLD)) \
            .arrange(DOWN, buff=0.15).move_to([PX, -0.5, 0])
        self.play(FadeIn(qq, shift=UP * 0.2), run_time=0.8)
        self.until_end()

        self.say()  # 3
        uarr = vec(p, *U, C_U, width=6)
        ln = line_through(p, (2, 1), C_U, span=3.5, width=3).set_opacity(0.5)
        self.play(FadeOut(cur), FadeOut(rows), run_time=0.5)
        self.play(GrowArrow(uarr), run_time=0.6)
        self.play(Create(ln), run_time=1.0)
        one = VGroup(T("1 move", 28, C_U, weight=BOLD), T("reaches only a line: too few", 26)) \
            .arrange(RIGHT, buff=0.3).move_to([PX, 1.9, 0])
        fit(one)
        self.play(FadeIn(one), run_time=0.6)
        self.until_end()

        self.say()  # 4
        varr = vec(p, *V, C_V, width=6)
        warr = vec(p, *W, C_P, width=6)
        self.play(FadeOut(ln), GrowArrow(varr), run_time=0.6)
        self.play(GrowArrow(warr), run_time=0.6)
        three = VGroup(T("3 moves", 28, C_P, weight=BOLD), T("the whole plane, no dead weight?", 26)) \
            .arrange(RIGHT, buff=0.3)
        fit(three).next_to(one, DOWN, buff=0.4).align_to(one, LEFT)
        self.play(FadeIn(three), run_time=0.6)
        self.until_end()
        self.wait(4)
        self.play(FadeOut(VGroup(p, home, uarr, varr, warr, one, three, qq)), run_time=0.6)

        # ------------------------------------------------------------ 5.2 musical chairs
        CY = 1.15      # seat height
        xs = [-2.3, 0.0, 2.3]
        chairs = VGroup(*[chair().move_to([x, CY, 0]) for x in xs])
        for ch in chairs:
            ch.shift(UP * (CY - ch[1].get_y()))
        ws = [on_seat(card(sub("w", i + 1)), chairs[i]) for i in range(3)]
        span_l = T("these reach all of 3-D space", 24, C_DIM).move_to([0, 2.75, 0])

        self.say()  # 5
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in chairs], lag_ratio=0.2), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(w, shift=DOWN * 0.3) for w in ws], lag_ratio=0.2), run_time=1.0)
        self.play(FadeIn(span_l), run_time=0.5)
        self.until_end()

        self.say()  # 6
        guests = [card(sub("u", i + 1), C_U) for i in range(3)]
        queue_pos = [np.array([-5.6, 1.6 - 0.8 * i, 0]) for i in range(3)]
        for g, q in zip(guests[:2], queue_pos):
            g.move_to(q)
        gl = T("independent guests", 22, C_U).move_to([-5.6, 2.4, 0])
        self.play(FadeIn(gl), LaggedStart(FadeIn(guests[0], shift=RIGHT * 0.3), FadeIn(guests[1], shift=RIGHT * 0.3),
                                          lag_ratio=0.4), run_time=1.0)
        self.until_end()

        gone = VGroup()

        def swap(guest, i, run=1.0):
            w = ws[i]
            ws[i] = guest
            self.play(w.animate.shift(UP * 0.9 + RIGHT * 0.3).set_opacity(0.0), run_time=run * 0.8)
            self.remove(w)
            self.play(guest.animate.move_to(on_seat(guest.copy(), chairs[i]).get_center()), run_time=run)

        still = T("still reaches everywhere  ✓", 24, C_W).move_to([0, -0.15, 0])

        self.say()  # 7
        self.play(guests[0].animate.shift(RIGHT * 1.0), run_time=0.5)
        swap(guests[0], 1)
        self.play(FadeIn(still), run_time=0.5)
        self.until_end()

        self.say()  # 8
        swap(guests[1], 2)
        self.play(Indicate(still, color=C_W), run_time=0.8)
        self.until_end()
        self.play(FadeOut(still), run_time=0.3)

        # close-up of the first swap, with numbers
        self.say()  # 9
        cu_t = T("close-up of the first swap", 22, C_DIM).move_to([0, -0.35, 0])
        cu1 = M(f"seats:  {sub('w', 1)} = (1, 0, 0),  {sub('w', 2)} = (0, 1, 0),  {sub('w', 3)} = (0, 0, 1)", 26)
        cu2 = M(f"guest:  <span foreground='{C_U}'>{sub('u', 1)} = (1, 1, 0)</span>", 26)
        cu3 = M(f"{sub('w', 2)} = <span foreground='{C_U}'>{sub('u', 1)}</span> − {sub('w', 1)}  "
                f"= (1, 1, 0) − (1, 0, 0)  = (0, 1, 0)", 26)
        cu4 = T("so w₂ stands up — the guest can do its job", 24, C_W)
        cu = VGroup(cu1, cu2, cu3, cu4).arrange(DOWN, buff=0.22).next_to(cu_t, DOWN, buff=0.3)
        for m in cu:
            fit(m, 12.4)
        self.play(FadeIn(cu_t), FadeIn(cu1), run_time=0.7)
        self.play(FadeIn(cu2), run_time=0.6)
        self.play(Write(cu3), run_time=1.4)
        self.play(FadeIn(cu4), run_time=0.6)
        self.until_end()
        self.play(FadeOut(VGroup(cu_t, cu)), run_time=0.4)

        # general argument on a symbolic list
        self.say()  # 10
        lst = [card(sub("u", 1), C_U), card(sub("u", 2), C_U), card(sub("u", 3), C_U),
               card(sub("w", 2)), card(sub("w", 4)), card(sub("w", 5))]
        lrow = VGroup(*lst).arrange(RIGHT, buff=0.25)
        div = Line(UP * 0.4, DOWN * 0.4, color=WHITE, stroke_width=3)
        lrow_all = VGroup(*lst[:3], div, *lst[3:]).arrange(RIGHT, buff=0.25).move_to([0, -1.25, 0])
        gtag = T("all the guests", 22, C_U).next_to(VGroup(*lst[:3]), UP, buff=0.2)
        otag = T("then the remaining originals", 22, C_ORIG).next_to(VGroup(*lst[3:]), UP, buff=0.2)
        gen_t = T("in general: say five chairs, a third guest arriving", 20, C_DIM).move_to([0, 0.15, 0])
        self.play(FadeIn(gen_t), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in lst[:3]], lag_ratio=0.2), FadeIn(gtag),
                  run_time=1.0)
        self.play(Create(div), LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in lst[3:]], lag_ratio=0.2),
                  FadeIn(otag), run_time=1.0)
        self.until_end(1.0)

        self.say()  # 11
        dw1 = M(f"{sub('u', 1)}, {sub('u', 2)}, {sub('w', 2)}, {sub('w', 4)}, {sub('w', 5)} already reached "
                f"everywhere", 24)
        dw2 = M(f"so the new guest {sub('u', 3)} is built from them:  the list has dead weight", 24, C_X)
        dws = VGroup(dw1, dw2).arrange(DOWN, buff=0.15).next_to(lrow_all, DOWN, buff=0.45)
        for m in dws:
            fit(m, 12.4)
        self.play(FadeIn(dw1), run_time=0.8)
        self.play(FadeIn(dw2), Indicate(lst[2], color=C_X), run_time=1.0)
        self.until_end(1.0)

        self.say()  # 12
        self.play(FadeOut(dws), run_time=0.4)
        ptr = Triangle(stroke_width=0).set_fill(C_V, 1).scale(0.14).next_to(lst[0], DOWN, buff=0.15)
        ptr_l = T("built from the moves before it?", 22, C_V).move_to([0, -2.55, 0])
        self.play(FadeIn(ptr, shift=UP * 0.1), FadeIn(ptr_l), run_time=0.7)
        self.until_end()

        self.say()  # 13
        oks = VGroup()
        for i in range(3):
            self.play(ptr.animate.next_to(lst[i], DOWN, buff=0.15), run_time=0.5)
            ok = T("no", 22, C_U).next_to(ptr, DOWN, buff=0.08)
            oks.add(ok)
            self.play(FadeIn(ok), run_time=0.3)
        self.play(ptr_l.animate.set_opacity(0), run_time=0.3)
        gind = T("guests are independent: none is built from earlier guests", 22, C_U).move_to([0, -2.9, 0])
        self.play(FadeIn(gind), run_time=0.6)
        self.until_end()

        self.say()  # 14
        self.play(ptr.animate.next_to(lst[3], DOWN, buff=0.15), run_time=0.5)
        no4 = T("no", 22, C_ORIG).next_to(ptr, DOWN, buff=0.08)
        self.play(FadeIn(no4), run_time=0.3)
        self.play(ptr.animate.next_to(lst[4], DOWN, buff=0.15), run_time=0.5)
        yes = T("yes: first!", 22, C_X, weight=BOLD).next_to(ptr, DOWN, buff=0.08)
        self.play(FadeIn(yes), lst[4][0].animate.set_stroke(C_X), lst[4][1].animate.set_color(C_X), run_time=0.5)
        self.play(lst[4].animate.shift(UP * 0.45).set_opacity(0.0), run_time=0.8)
        orig = T("it's an original: remove it, the row still reaches everywhere", 22, C_W).move_to([0, -3.4, 0])
        fit(orig, 12.4)
        self.play(FadeIn(orig), run_time=0.6)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(gen_t, *lst, div, gtag, otag, ptr, ptr_l, oks, no4, yes, gind, orig)),
                  run_time=0.5)

        # follow the game to the end
        self.say()  # 15
        guests[2].move_to(queue_pos[0])
        self.play(FadeIn(guests[2], shift=RIGHT * 0.3), run_time=0.5)
        swap(guests[2], 0)
        every = T("every guest took an original's seat", 24, C_DIM).move_to([0, -0.15, 0])
        self.play(FadeIn(every), FadeOut(span_l), run_time=0.5)
        self.until_end()

        self.say()  # 16
        cap = T("3 chairs  →  at most 3 independent guests", 28, WHITE).move_to([0, -0.9, 0])
        self.play(FadeOut(every), FadeIn(cap), Indicate(VGroup(*guests), color=C_U, scale_factor=1.1), run_time=1.0)
        self.until_end()

        self.say()  # 17
        prop = card(sub("u", 4), C_U, dashed=True).move_to([-5.6, 1.6, 0])
        prop_l = T("proposed", 20, C_DIM).next_to(prop, DOWN, buff=0.12)
        self.play(FadeIn(prop, shift=RIGHT * 0.3), FadeIn(prop_l), FadeOut(gl), run_time=0.7)
        self.play(prop.animate.move_to([-4.3, 1.6, 0]), prop_l.animate.move_to([-4.3, 1.0, 0]), run_time=0.8)
        sign = boxed(T("no seat left", 26, C_X, weight=BOLD), color=C_X, buff=0.15).move_to([0, -1.9, 0])
        noorig = T("no original left to stand up", 22, C_DIM).next_to(sign, DOWN, buff=0.2)
        self.play(FadeIn(sign, scale=1.2), FadeIn(noorig), run_time=0.7)
        self.until_end()

        self.say()  # 18
        red = card(sub("u", 4), C_X, dashed=True).move_to(prop)
        self.play(Transform(prop, red), run_time=0.6)
        cant = T("can't be independent of the three", 26, C_X).next_to(noorig, DOWN, buff=0.3)
        self.play(FadeIn(cant), Wiggle(prop), run_time=1.0)
        self.until_end()
        self.play(FadeOut(VGroup(chairs, *guests, prop, prop_l, cap, sign, noorig, cant)), run_time=0.6)

        # exchange lemma card
        self.say()  # 19
        el_t = T("exchange lemma", 40, C_W, weight=BOLD).move_to([0, 1.6, 0])
        el = boxed(P("If <b>k</b> moves are independent and <b>n</b> moves reach everything, then  <b>k ≤ n</b>.",
                     30), color=C_W, buff=0.3).move_to([0, 0.3, 0])
        self.play(Write(el_t), run_time=0.8)
        self.play(FadeIn(el, scale=1.05), run_time=0.8)
        self.until_end()

        self.say()  # 20
        el2 = T("never more independent directions than the moves it takes to reach the space", 24, C_DIM)
        fit(el2, 12.4).next_to(el, DOWN, buff=0.5)
        self.play(FadeIn(el2), run_time=0.8)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(el_t, el, el2)), run_time=0.5)

        # ------------------------------------------------------------ PRECISE: the game in R^3
        self.say()  # 21
        tagp = T("PRECISE", 18, C_V, weight=BOLD).move_to([-5.9, 3.0, 0])
        hdr = M(f"seats:  {sub('e', 1)}, {sub('e', 2)}, {sub('e', 3)}   ·   guests:  "
                f"<span foreground='{C_U}'>{sub('u', 1)} = (1, 1, 0)</span>,  "
                f"<span foreground='{C_U}'>{sub('u', 2)} = (0, 1, 1)</span>", 26).move_to([0, 2.65, 0])
        fit(hdr, 12.6)
        self.play(FadeIn(tagp), FadeIn(hdr), run_time=0.8)
        self.until_end()

        def chiprow(items, y, x0=-4.4):
            """items: list of (markup, colour) or '|' for the guest/original divider."""
            g = VGroup()
            for it in items:
                if it == "|":
                    g.add(Line(UP * 0.3, DOWN * 0.3, color=WHITE, stroke_width=3))
                else:
                    g.add(card(it[0], it[1], size=26, w=0.66, h=0.54))
            g.arrange(RIGHT, buff=0.2)
            g.move_to([0, y, 0]).align_to([x0, 0, 0], LEFT)
            return g

        E = C_ORIG
        r1l = T("row 1", 24, C_DIM).move_to([-5.6, 1.75, 0])
        row1 = chiprow([(sub("u", 1), C_U), "|", (sub("e", 1), E), (sub("e", 2), E), (sub("e", 3), E)], 1.75)

        self.say()  # 22
        self.play(FadeIn(r1l), LaggedStart(*[FadeIn(m, shift=UP * 0.15) for m in row1], lag_ratio=0.15),
                  run_time=1.2)
        ptr = Triangle(stroke_width=0).set_fill(C_V, 1).scale(0.12).rotate(PI).next_to(row1[0], UP, buff=0.1)
        self.play(FadeIn(ptr), run_time=0.4)
        for k in (2, 3):
            self.play(ptr.animate.next_to(row1[k], UP, buff=0.1), run_time=0.6)
            self.wait(0.4)
        self.until_end()

        self.say()  # 23
        s1 = M(f"{sub('e', 2)} = {sub('u', 1)} − {sub('e', 1)} = (1, 1, 0) − (1, 0, 0) = (0, 1, 0)  ✓", 26)
        s1.move_to([0, 1.05, 0]).align_to([-4.4, 0, 0], LEFT)
        fit(s1, 10.8)
        self.play(Write(s1), run_time=1.6)
        self.play(row1[3][0].animate.set_stroke(C_X), row1[3][1].animate.set_color(C_X), run_time=0.4)
        self.play(row1[3].animate.shift(UP * 0.5).set_opacity(0), FadeOut(ptr), run_time=0.7)
        self.remove(row1[3])
        self.play(row1[4].animate.next_to(row1[2], RIGHT, buff=0.2), run_time=0.5)
        st1 = T("→  spans ℝ³, length 3", 22, C_W).next_to(row1[4], RIGHT, buff=0.4)
        self.play(FadeIn(st1), run_time=0.5)
        self.until_end(1.0)

        self.say()  # 24
        r2l = T("row 2", 24, C_DIM).move_to([-5.6, 0.2, 0])
        row2 = chiprow([(sub("u", 1), C_U), (sub("u", 2), C_U), "|", (sub("e", 1), E), (sub("e", 3), E)], 0.2)
        self.play(FadeIn(r2l), LaggedStart(*[FadeIn(m, shift=UP * 0.15) for m in row2], lag_ratio=0.15),
                  run_time=1.2)
        ptr = Triangle(stroke_width=0).set_fill(C_V, 1).scale(0.12).rotate(PI).next_to(row2[0], UP, buff=0.1)
        self.play(FadeIn(ptr), run_time=0.3)
        self.until_end()

        self.say()  # 25
        self.play(ptr.animate.next_to(row2[3], UP, buff=0.1), run_time=0.6)
        t1 = M(f"{sub('e', 1)} = <i>a</i>{sub('u', 1)} + <i>b</i>{sub('u', 2)} ?    "
               f"(<i>a</i>, <i>a</i> + <i>b</i>, <i>b</i>) = (1, 0, 0)", 26)
        t2 = M("⇒  <i>a</i> = 1, <i>b</i> = 0,  but then  <i>a</i> + <i>b</i> = 1 ≠ 0    ✗  no", 26, C_X)
        VGroup(t1, t2).arrange(DOWN, buff=0.18, aligned_edge=LEFT).move_to([0, -0.75, 0]).align_to([-4.4, 0, 0], LEFT)
        fit(t1, 10.8)
        fit(t2, 10.8)
        self.play(Write(t1), run_time=1.8)
        self.wait(1.2)
        self.play(FadeIn(t2, shift=UP * 0.1), run_time=1.0)
        self.until_end(1.0)

        self.say()  # 26
        self.play(ptr.animate.next_to(row2[4], UP, buff=0.1), run_time=0.6)
        t3 = M(f"{sub('e', 3)} = −{sub('u', 1)} + {sub('u', 2)} + {sub('e', 1)} = (−1 + 0 + 1, −1 + 1 + 0, 0 + 1 + 0)"
               f" = (0, 0, 1)  ✓", 26, C_W)
        t3.next_to(t2, DOWN, buff=0.3).align_to(t2, LEFT)
        fit(t3, 11.6)
        self.play(Write(t3), run_time=1.8)
        self.play(row2[4][0].animate.set_stroke(C_X), row2[4][1].animate.set_color(C_X), run_time=0.4)
        self.play(row2[4].animate.shift(UP * 0.5).set_opacity(0), FadeOut(ptr), run_time=0.7)
        self.remove(row2[4])
        st2 = T("→  spans ℝ³, length 3", 22, C_W).next_to(row2[3], RIGHT, buff=0.4)
        self.play(FadeIn(st2), run_time=0.5)
        self.until_end(1.0)

        self.say()  # 27
        inv = T("every row spans ℝ³  ·  the length never changes", 26, C_W).move_to([0, -2.85, 0])
        self.play(FadeIn(inv), Indicate(VGroup(st1, st2), color=C_W), run_time=1.0)
        self.until_end()

        self.say()  # 28
        thm = boxed(M(f"If {sub('u', 1)}, …, <i>u<sub>m</sub></i> are independent in <i>V</i> and "
                      f"{sub('w', 1)}, …, <i>w<sub>n</sub></i> span <i>V</i>, then  <i>m</i> ≤ <i>n</i>.", 28),
                    color=C_W, buff=0.22)
        fit(thm, 12.6).move_to([0, -2.85, 0])
        self.play(FadeOut(inv), FadeIn(thm, shift=UP * 0.15), run_time=1.0)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(tagp, hdr, r1l, row1[0], row1[1], row1[2], row1[4], s1, st1, r2l,
                                 row2[0], row2[1], row2[2], row2[3], t1, t2, t3, st2, thm)), run_time=0.6)

        # ------------------------------------------------------------ 5.3 dimension
        self.say()  # 29
        A = VGroup(*[card(sub("a", i), C_U, size=26, w=0.66, h=0.54) for i in (1, 2, 3)])
        B = VGroup(*[card(sub("b", i), C_V, size=26, w=0.66, h=0.54) for i in (1, 2, 3)])
        A.arrange(RIGHT, buff=0.15)
        B.arrange(RIGHT, buff=0.15)
        A_l = T("basis A  (k moves)", 24, C_U)
        B_l = T("basis B  (m moves)", 24, C_V)
        Ag = VGroup(A_l, A).arrange(RIGHT, buff=0.7)
        Bg = VGroup(B_l, B).arrange(RIGHT, buff=0.7)
        VGroup(Ag, Bg).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([-3.2, 1.9, 0])
        self.play(FadeIn(Ag, shift=RIGHT * 0.2), run_time=0.7)
        self.play(FadeIn(Bg, shift=RIGHT * 0.2), run_time=0.7)
        self.until_end()

        self.say()  # 30
        d1 = M("A independent, B spans  ⇒  <i>k</i> ≤ <i>m</i>", 28)
        d2 = M("B independent, A spans  ⇒  <i>m</i> ≤ <i>k</i>", 28)
        d3 = M("<b>k = m</b>", 32, C_W)
        VGroup(d1, d2, d3).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([3.4, 1.9, 0])
        ar1 = CurvedArrow(A.get_right() + RIGHT * 0.15, B.get_right() + RIGHT * 0.15, angle=-PI / 2, color=C_U,
                          stroke_width=3, tip_length=0.15)
        self.play(Create(ar1), run_time=0.8)
        self.play(FadeIn(d1), run_time=0.7)
        self.until_end()

        self.say()  # 31
        ar2 = CurvedArrow(B.get_left() + LEFT * 0.15, A.get_left() + LEFT * 0.15, angle=-PI / 2, color=C_V,
                          stroke_width=3, tip_length=0.15)
        self.play(Create(ar2), run_time=0.8)
        self.play(FadeIn(d2), run_time=0.7)
        self.until_end()

        self.say()  # 32
        self.play(FadeIn(d3, scale=1.3), run_time=0.7)
        same = T("every basis has the same number of moves", 24, C_W).next_to(VGroup(Ag, Bg), DOWN, buff=0.45) \
            .align_to(Ag, LEFT)
        self.play(FadeIn(same), run_time=0.6)
        self.until_end()

        self.say()  # 33
        dimt = VGroup(T("dimension", 40, C_W, weight=BOLD),
                      T("the number of moves in any basis: a property of the space, not of the grid", 22, C_DIM)) \
            .arrange(DOWN, buff=0.15).move_to([0, -0.55, 0])
        fit(dimt[1], 12.4)
        self.play(Write(dimt[0]), run_time=0.9)
        self.play(FadeIn(dimt[1]), run_time=0.6)
        self.until_end()

        self.say()  # 34
        dims = VGroup(M("dim ℝ<sup>2</sup> = 2", 30), M("dim ℝ<sup>3</sup> = 3", 30),
                      M(f"dim ℝ<sup><i>n</i></sup> = <i>n</i>   ({sub('e', 1)}, …, <i>e<sub>n</sub></i>)", 30))
        dims.arrange(RIGHT, buff=0.8).move_to([0, -1.75, 0])
        fit(dims, 12.4)
        for m in dims:
            self.play(FadeIn(m, shift=UP * 0.15), run_time=0.6)
            self.wait(0.8)
        self.until_end()

        self.say()  # 35
        fd = VGroup(T("finite-dimensional", 30, C_V, weight=BOLD),
                    T("some finite list of moves reaches everywhere", 22, C_DIM)).arrange(RIGHT, buff=0.4)
        fit(fd, 12.4).move_to([0, -2.75, 0])
        self.play(Write(fd[0]), run_time=0.8)
        self.play(FadeIn(fd[1]), run_time=0.5)
        self.until_end()

        self.say()  # 36
        fd2 = T("this chapter: always finite-dimensional  ·  coming up: a space that isn't", 22, C_DIM)
        fit(fd2, 12.4).move_to([0, -3.45, 0])
        self.play(FadeIn(fd2), run_time=0.7)
        self.until_end(0.6)
        self.play(FadeOut(VGroup(Ag, Bg, ar1, ar2, d1, d2, d3, same, dimt, dims, fd, fd2)), run_time=0.6)

        # ------------------------------------------------------------ four results
        CW, CH = 6.6, 2.95
        centers = [np.array([-3.4, 1.35, 0]), np.array([3.4, 1.35, 0]),
                   np.array([-3.4, -1.95, 0]), np.array([3.4, -1.95, 0])]

        def mini_row(n, fill=None, col=C_U, s=0.45, extra=None):
            g = VGroup()
            for i in range(n):
                ch = chair(s=s)
                g.add(ch)
            g.arrange(RIGHT, buff=0.12)
            occ = VGroup()
            if fill:
                for i, ch in enumerate(g):
                    c = card("", col, w=0.26, h=0.26)
                    c.move_to(ch[1].get_center() + UP * 0.16 + RIGHT * 0.03)
                    occ.add(c)
            return VGroup(g, occ)

        def result_card(k, title, lines, illus, color=C_U):
            head = T(f"{k} · {title}", 24, color, weight=BOLD)
            body = VGroup(*[P(l, 21) for l in lines]).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
            for m in body:
                fit(m, CW - 0.5)
            fit(head, CW - 0.5)
            txt = VGroup(head, body).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
            frame = RoundedRectangle(width=CW, height=CH, corner_radius=0.14, stroke_color=color, stroke_width=2)
            frame.set_fill(color, 0.06).move_to(centers[k - 1])
            txt.move_to(frame.get_corner(UL) + np.array([0.25, -0.2, 0]), aligned_edge=UL)
            illus.move_to(frame.get_bottom() + UP * 0.6)
            return VGroup(frame, txt, illus)

        # illustrations
        il1 = mini_row(3, fill=True)
        extra = card("", C_X, w=0.26, h=0.26).next_to(il1, RIGHT, buff=0.35).shift(UP * 0.05)
        il1 = VGroup(il1, extra, T("n + 1: turned away", 18, C_X).next_to(extra, RIGHT, buff=0.12))
        ra = mini_row(3, fill=True, col=C_U)
        rb = mini_row(3, fill=True, col=C_V)
        il2 = VGroup(ra, M("⇄", 28, C_DIM), rb).arrange(RIGHT, buff=0.3)
        il3 = VGroup(mini_row(3, fill=True, col=C_W), T("nothing to add, nothing to remove", 18, C_W)) \
            .arrange(RIGHT, buff=0.3)
        box3 = VGroup(Square(0.7, stroke_color=C_DIM, stroke_width=1.5),
                      Square(0.7, stroke_color=C_DIM, stroke_width=1.5).shift(UR * 0.22))
        box3.add(*[Line(box3[0].get_vertices()[i], box3[1].get_vertices()[i], color=C_DIM, stroke_width=1.5)
                   for i in range(4)])
        plane_in = Polygon(LEFT * 0.3 + DOWN * 0.15, RIGHT * 0.25 + DOWN * 0.15, RIGHT * 0.42 + UP * 0.15,
                           LEFT * 0.13 + UP * 0.15, stroke_color=C_P, stroke_width=2).set_fill(C_P, 0.5)
        plane_in.move_to(box3.get_center())
        il4 = VGroup(VGroup(box3, plane_in), M("2 ≤ 3", 24, C_P)).arrange(RIGHT, buff=0.3)

        c1 = result_card(1, "Dimension bound",
                         ["In ℝ<sup>n</sup>, any <i>k</i> &gt; <i>n</i> vectors are dependent,",
                          "and any spanning list has at least <i>n</i> vectors."], il1)
        c2 = result_card(2, "Dimension is well defined",
                         ["Any two bases of <i>V</i> have the same length."], il2)
        c3 = result_card(3, "The right length is enough",
                         ["If dim <i>V</i> = <i>n</i>: <i>n</i> independent vectors already span,",
                          "and <i>n</i> spanning vectors are already independent."], il3, color=C_W)
        c4 = result_card(4, "Subspaces are no bigger",
                         ["<i>V</i> finite-dimensional, <i>U</i> ⊆ <i>V</i>:  dim <i>U</i> ≤ dim <i>V</i>,",
                          "with equality only when <i>U</i> = <i>V</i>."], il4, color=C_P)

        self.say()  # 37
        frames = VGroup(*[RoundedRectangle(width=CW, height=CH, corner_radius=0.14, stroke_color=C_DIM,
                                           stroke_width=1.5).move_to(c) for c in centers])
        nums = VGroup(*[T(str(i + 1), 40, C_DIM).move_to(c) for i, c in enumerate(centers)])
        self.play(LaggedStart(*[FadeIn(VGroup(f, n)) for f, n in zip(frames, nums)], lag_ratio=0.2), run_time=1.2)
        self.until_end()

        for i, c in enumerate([c1, c2, c3]):
            self.say()  # 38, 39, 40
            self.play(FadeOut(VGroup(frames[i], nums[i])), FadeIn(c[0]), FadeIn(c[1][0]), run_time=0.6)
            self.play(FadeIn(c[1][1], shift=UP * 0.1), run_time=0.9)
            self.play(FadeIn(c[2]), run_time=0.7)
            self.until_end(1.0)

        # deduction for result 3
        self.say()  # 41
        self.play(FadeOut(VGroup(c1, c2, frames[3], nums[3])), c3.animate.move_to([0, 2.25, 0]), run_time=0.8)
        gm = machine("GROW", C_W).move_to([0, -0.5, 0])
        gin = VGroup(*[card(sub("x", i) if i != "n" else "<i>x<sub>n</sub></i>", C_W, size=24, w=0.6, h=0.5)
                       for i in (1, 2)], M("⋯", 26, C_W),
                     card("<i>x<sub>n</sub></i>", C_W, size=24, w=0.6, h=0.5)).arrange(RIGHT, buff=0.12)
        gin.move_to([-4.3, -0.5, 0])
        gin_l = T("n independent", 22, C_W).next_to(gin, UP, buff=0.15)
        a_in = Arrow(gin.get_right(), gm.get_left(), buff=0.15, color=C_DIM, stroke_width=3, tip_length=0.15)
        gout = gin.copy().move_to([3.6, -0.5, 0])
        a_out = Arrow(gm.get_right(), gout.get_left(), buff=0.15, color=C_DIM, stroke_width=3, tip_length=0.15)
        gnote = T("every basis has exactly n moves", 22, C_DIM).next_to(gm, UP, buff=0.12)
        gres = T("nothing to add  ⇒  already spans  ✓", 22, C_W, weight=BOLD).next_to(gout, DOWN, buff=0.18)
        self.play(FadeIn(gin), FadeIn(gin_l), run_time=0.7)
        self.play(GrowArrow(a_in), FadeIn(gm), run_time=0.7)
        self.play(TransformFromCopy(gin, gout), GrowArrow(a_out), gm[0].animate.set_fill(C_W, 0.3), run_time=1.4)
        self.play(FadeIn(gnote), gm[0].animate.set_fill(C_W, 0.12), run_time=0.7)
        self.play(FadeIn(gres), run_time=0.6)
        self.until_end()

        self.say()  # 42
        tm = machine("TRIM", C_U).move_to([0, -2.55, 0])
        tin = gin.copy().set_color(C_U)
        for c in tin:
            if isinstance(c, VGroup) and len(c) == 2:
                c[0].set_fill(C_U, 0.2)
        tin.move_to([-4.3, -2.55, 0])
        tin_l = T("n spanning", 22, C_U).next_to(tin, UP, buff=0.15)
        b_in = Arrow(tin.get_right(), tm.get_left(), buff=0.15, color=C_DIM, stroke_width=3, tip_length=0.15)
        tout = tin.copy().move_to([3.6, -2.55, 0])
        b_out = Arrow(tm.get_right(), tout.get_left(), buff=0.15, color=C_DIM, stroke_width=3, tip_length=0.15)
        tnote = T("every basis has exactly n moves", 22, C_DIM).next_to(tm, UP, buff=0.12)
        tres = T("nothing to remove  ⇒  independent  ✓", 22, C_U, weight=BOLD).next_to(tout, DOWN, buff=0.18)
        for m in (gres, tres):
            m.shift(RIGHT * (6.7 - m.get_right()[0]))
        self.play(FadeIn(tin), FadeIn(tin_l), run_time=0.7)
        self.play(GrowArrow(b_in), FadeIn(tm), run_time=0.7)
        self.play(TransformFromCopy(tin, tout), GrowArrow(b_out), tm[0].animate.set_fill(C_U, 0.3), run_time=1.4)
        self.play(FadeIn(tnote), tm[0].animate.set_fill(C_U, 0.12), run_time=0.7)
        self.play(FadeIn(tres), run_time=0.6)
        self.until_end()

        self.say()  # 43
        save = T("check one test, get the other for free", 26, C_W).move_to([0, -3.55, 0])
        self.play(FadeIn(save, shift=UP * 0.1), run_time=0.7)
        self.until_end(0.6)
        self.play(FadeOut(VGroup(gm, gin, gin_l, a_in, gout, a_out, gnote, gres,
                                 tm, tin, tin_l, b_in, tout, b_out, tnote, tres, save)), run_time=0.6)

        self.say()  # 44
        self.play(c3.animate.move_to(centers[2]), FadeIn(c1), FadeIn(c2), run_time=0.9)
        self.play(FadeIn(c4[0]), FadeIn(c4[1][0]), run_time=0.6)
        self.play(FadeIn(c4[1][1], shift=UP * 0.1), run_time=0.9)
        self.play(FadeIn(c4[2]), run_time=0.7)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(c1, c2, c3, c4)), run_time=0.6)

        # ------------------------------------------------------------ 5.4 the payoff
        self.say()  # 45
        mat = Rectangle(width=4.2, height=1.1, color=C_U, stroke_width=2).set_fill(C_U, 0.08)
        mat.move_to([-3.6, 2.4, 0])
        ml = M("768 × 3072", 30, C_U).move_to(mat)
        self.play(Create(mat), FadeIn(ml), run_time=1.0)
        self.play(Circumscribe(mat, color=C_V), run_time=1.0)
        self.until_end()

        self.say()  # 46
        room = RoundedRectangle(width=7.2, height=4.2, corner_radius=0.2, stroke_color=C_DIM, stroke_width=2)
        room.move_to([-3.0, -1.3, 0])
        room_l = T("a space of dimension 768", 22, C_DIM).next_to(room, DOWN, buff=0.1).align_to(room, LEFT)
        stripes = VGroup(*[Line(mat.get_top() + RIGHT * x + DOWN * 0.05, mat.get_bottom() + RIGHT * x + UP * 0.05,
                                color=C_U, stroke_width=2, stroke_opacity=0.6)
                           for x in np.linspace(-1.95, 1.95, 28)])
        rng = np.random.default_rng(7)
        org = room.get_center() + DOWN * 0.55
        arrows = VGroup()
        for i in range(28):
            ang = rng.uniform(0, TAU)
            ln_ = rng.uniform(0.5, 1.05)
            arrows.add(Arrow(org, org + ln_ * np.array([np.cos(ang), np.sin(ang), 0]), buff=0, color=C_U,
                             stroke_width=3, tip_length=0.12))
        cnt = VGroup(T("3072 column arrows", 24, C_U), T("each one a move in a space of dimension 768", 22, C_DIM)) \
            .arrange(DOWN, buff=0.12, aligned_edge=LEFT).move_to([3.6, 2.4, 0])
        fit(cnt, 6.2)
        self.play(FadeIn(stripes, lag_ratio=0.05), run_time=0.8)
        self.play(Create(room), FadeIn(room_l), run_time=0.6)
        self.play(*[TransformFromCopy(s_, a_) for s_, a_ in zip(stripes, arrows)], run_time=1.8)
        self.play(FadeIn(cnt), run_time=0.6)
        self.until_end()

        self.say()  # 47
        seats = VGroup(*[chair(s=0.42) for _ in range(12)]).arrange(RIGHT, buff=0.12)
        dots = M("⋯", 30, C_DIM)
        seatrow = VGroup(*seats[:6], dots, *seats[6:]).arrange(RIGHT, buff=0.12)
        seatrow.move_to(room.get_top() + DOWN * 0.75)
        seat_l = T("768 seats", 22, WHITE).next_to(seatrow, DOWN, buff=0.12)
        self.play(FadeIn(seatrow), FadeIn(seat_l), run_time=0.7)
        sat = VGroup()
        movers = []
        for i, ch in enumerate(seats):
            a_ = arrows[i]
            tgt = Arrow(ch[1].get_center() + UP * 0.05 + LEFT * 0.08, ch[1].get_center() + UP * 0.38 + RIGHT * 0.1,
                        buff=0, color=C_U, stroke_width=3, tip_length=0.1)
            movers.append(Transform(a_, tgt))
            sat.add(a_)
        self.play(LaggedStart(*movers, lag_ratio=0.08), run_time=1.6)
        mx = T("at most 768 independent", 24, C_U, weight=BOLD).move_to([3.6, 1.0, 0])
        self.play(FadeIn(mx), run_time=0.5)
        self.until_end()

        self.say()  # 48
        rest = arrows[12:]
        qpos = [np.array([1.4 + 0.42 * (i % 12), -0.4 - 0.75 * (i // 12), 0]) for i in range(len(rest))]
        qmoves = []
        for a_, q in zip(rest, qpos):
            qa = Arrow(q + DOWN * 0.2, q + UP * 0.25, buff=0, color=C_U, stroke_width=3, tip_length=0.1)
            qa.set_opacity(0.35)
            qmoves.append(Transform(a_, qa))
        self.play(LaggedStart(*qmoves, lag_ratio=0.04), run_time=1.6)
        rest_l = VGroup(T("2304 more", 24, C_DIM, weight=BOLD), T("built from the seated ones", 22, C_DIM)) \
            .arrange(DOWN, buff=0.1).move_to([3.95, -2.3, 0])
        self.play(FadeIn(rest_l), run_time=0.6)
        self.until_end()

        self.say()  # 49
        ct = boxed(T("a fact about counting, not about learning", 24, C_W), color=C_W, buff=0.15)
        fit(ct, 5.6).move_to([3.85, -3.35, 0])
        self.play(FadeIn(ct), run_time=0.7)
        self.until_end()

        self.say()  # 50
        self.play(FadeOut(VGroup(seatrow, seat_l, sat, rest, rest_l, mx, ct, cnt)), run_time=0.6)
        cloud = VGroup()
        for i in range(110):
            ang = rng.uniform(0, TAU)
            ln_ = rng.uniform(0.5, 1.8)
            d_ = np.array([np.cos(ang) * 1.7, np.sin(ang), 0]) * ln_ / 1.2
            cloud.add(Line(org, org + d_, color=interpolate_color(ManimColor(C_U), ManimColor(C_V), rng.uniform()),
                           stroke_width=1.5, stroke_opacity=0.7))
        f_l = T("10,000 features", 26, C_V, weight=BOLD).move_to([3.6, 1.0, 0])
        self.play(LaggedStart(*[Create(l_) for l_ in cloud], lag_ratio=0.01), run_time=1.6)
        self.play(FadeIn(f_l), run_time=0.5)
        dep = T("10,000 > 768  ⇒  dependent", 26, C_X).next_to(f_l, DOWN, buff=0.3)
        self.play(FadeIn(dep), run_time=0.6)
        self.until_end()

        self.say()  # 51
        sep = VGroup(T("but how much they interfere", 22, C_DIM), T("is a separate question (Act 9)", 22, C_DIM)) \
            .arrange(DOWN, buff=0.1).next_to(dep, DOWN, buff=0.35)
        self.play(FadeIn(sep), run_time=0.7)
        self.until_end()

        self.say()  # 52
        self.play(FadeOut(VGroup(cloud, f_l, dep, sep, room, room_l)), run_time=0.6)
        tagp = T("PRECISE", 18, C_V, weight=BOLD).move_to([-5.9, 1.35, 0])
        rk1 = M("rank(<i>W</i>)  =  the largest number of independent columns", 32)
        rk1.next_to(tagp, DOWN, buff=0.15).align_to(tagp, LEFT)
        fit(rk1, 12.4)
        self.play(FadeIn(tagp), Write(rk1), run_time=1.8)
        rterm = T("rank", 40, C_W, weight=BOLD).next_to(mat, RIGHT, buff=0.8)
        self.play(FadeIn(rterm), run_time=0.6)
        self.until_end(1.2)

        self.say()  # 53
        rk2 = M("≤  min(768, 3072)  =  768", 34, C_W).next_to(rk1, DOWN, buff=0.4).align_to(rk1, LEFT).shift(
            RIGHT * 2.2)
        self.play(Write(rk2), run_time=1.4)
        sides = T("the smaller of the two sides", 22, C_DIM).next_to(rk2, DOWN, buff=0.2).align_to(rk2, LEFT)
        self.play(FadeIn(sides), run_time=0.6)
        self.until_end(1.2)

        self.say()  # 54
        a8 = T("returns in Act 8", 24, C_DIM).next_to(rterm, RIGHT, buff=0.4)
        self.play(FadeIn(a8), Circumscribe(VGroup(rk1, rk2), color=C_W), run_time=1.4)
        self.done(1.0)
        self.clear_all()
