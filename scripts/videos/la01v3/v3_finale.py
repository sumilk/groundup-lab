"""LA01 v3 — Finale: See the whole machine (three replays, three questions, the montage relabelled, end card)."""
from common import *
from logos import gu_mark
from v3_act1 import craft

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
W = U + V
TGT = np.array([4.0, 5.0])
Q1 = np.array([2.0, 1.0])
Q2 = np.array([-1.0, 1.0])
C_T = "#2EC4B6"      # teal grid
C_R = "#FC6255"      # fragile / near-parallel (red)
BOX = (-2.0, 6.0, -1.0, 6.0)   # plane extent


def clip_seg(p0, p1, box=BOX):
    """Clip the segment p0→p1 to the plane's box (Liang–Barsky). Returns None if outside."""
    x0, x1, y0, y1 = box
    p0, p1 = np.array(p0, float), np.array(p1, float)
    d = p1 - p0
    t0, t1 = 0.0, 1.0
    for pk, qk in ((-d[0], p0[0] - x0), (d[0], x1 - p0[0]), (-d[1], p0[1] - y0), (d[1], y1 - p0[1])):
        if abs(pk) < 1e-12:
            if qk < 0:
                return None
            continue
        r = qk / pk
        if pk < 0:
            t0 = max(t0, r)
        else:
            t1 = min(t1, r)
    if t0 > t1:
        return None
    return p0 + t0 * d, p0 + t1 * d


def fmt1(x):
    return f"{x:.1f}".replace("-", "−")


class V3Finale(NScene):
    BEATS = [
        # 0
        "Finale. See the whole machine.",
        # 1
        "Let's go back to where we started. If I add a control built from the others, do I reach anywhere new?",
        # 2
        "No. I've gained another recipe, not another destination.",
        # 3
        "If I switch to a different grid, does the target move?",
        # 4
        "No. Only its address changes.",
        # 5
        "And if I squeeze two controls almost together, is the target out of reach?",
        # 6
        "Not yet. But its recipe has become wildly sensitive.",
        # 7
        "Those are the three questions to ask of any set of vectors you meet.",
        # 8
        "What can they reach? Is the description unique? And is it stable?",
        # 9
        "Span, independence and basis answer the first two. Conditioning answers the third.",
        # 10
        "And now the opening montage reads differently.",
        # 11
        "A word inside a model is a point in a space with hundreds of directions.",
        # 12
        "A weight matrix's reach is the span of its columns, and its rank can't exceed its smallest side.",
        # 13
        "A fine-tune that trains a sliver of a model is learning a small room of directions, and the moves "
        "inside it.",
        # 14
        "The written chapter has the full proofs, more examples, and labs where you'll build these tests "
        "yourself.",
        # 15
        "Next time, we'll take the round trips we found today and give them a home of their own: the null space.",
        # 16
        "Until then, when you see a set of arrows, ask where they can take you.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Finale", "See the whole machine",
                                        "What do the arrows tell us now?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)
        self.header = header
        self.replays()
        self.three_questions()
        self.montage()
        self.end_card()
        self.done(1.5)
        self.clear_all(run_time=1.0)

    # ------------------------------------------------------------------ replays
    def replays(self):
        p = plane((-2, 6), (-1, 6), unit=0.66).to_edge(LEFT, buff=0.5).shift(DOWN * 0.25)
        self.p = p
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        tgt_l = M("(4, 5)", 24, C_W).next_to(tgt, RIGHT, buff=0.12)
        ship = craft().move_to(p.c2p(0, 0))
        uarr = vec(p, *U, C_U, width=6)
        varr = vec(p, *V, C_V, width=6)
        X0 = 3.6

        # 1 — add purple: anywhere new?
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), FadeIn(ship), run_time=1.2)
        self.play(GrowArrow(uarr), GrowArrow(varr), FadeIn(tgt, scale=2), FadeIn(tgt_l), run_time=1.0)
        reach = Rectangle(width=p.width, height=p.height, stroke_width=0).set_fill(C_P, 0.10).move_to(p)
        reach_l = T("reachable with blue and gold: the whole plane", 20, C_P).next_to(p, DOWN, buff=0.12)
        self.play(FadeIn(reach), FadeIn(reach_l), run_time=0.8)
        warr = vec(p, *W, C_P, width=6)
        wl = M("<i>w</i> = <i>u</i> + <i>v</i>", 26, C_P).next_to(p.c2p(*W), RIGHT, buff=0.1)
        self.play(GrowArrow(warr), FadeIn(wl), run_time=0.9)
        q1 = T("Add w = u + v.\nAnywhere new?", 32, WHITE, weight=BOLD, line_spacing=0.9).move_to(RIGHT * X0 + UP * 1.6)
        self.play(FadeIn(q1, shift=UP * 0.15), run_time=0.7)
        self.until_end()
        self.wait(3)

        # 2 — no: a new recipe
        self.say()
        self.play(Indicate(reach, color=C_P, scale_factor=1.0), run_time=0.8)
        r1 = M("1·<i>u</i> + 2·<i>v</i> = (4, 5)", 30)
        r2 = M("1·<i>w</i> + 1·<i>v</i> = (4, 5)", 30, C_P)
        rr = VGroup(r1, r2).arrange(DOWN, buff=0.25).next_to(q1, DOWN, buff=0.5)
        self.play(FadeIn(r1), run_time=0.5)
        self.play(ship.animate.move_to(p.c2p(*W)), run_time=1.0)
        self.play(ship.animate.move_to(p.c2p(*TGT)), FadeIn(r2), run_time=1.0)
        a1 = boxed(P("New territory? <b>No</b> — a new recipe.", 26, C_W), color=C_W, buff=0.16)
        a1.next_to(rr, DOWN, buff=0.5)
        self.play(FadeIn(a1, shift=UP * 0.1), run_time=0.6)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(q1, rr, a1, warr, wl, reach, reach_l)), ship.animate.move_to(p.c2p(0, 0)),
                  run_time=0.6)

        # 3 — a different grid: does the target move?
        self.say()
        teal = VGroup()
        for k in range(-12, 13):
            for base, d in ((Q1, Q2), (Q2, Q1)):
                seg = clip_seg(k * base - 20 * d, k * base + 20 * d)
                if seg is not None:
                    teal.add(Line(p.c2p(*seg[0]), p.c2p(*seg[1]), color=C_T, stroke_width=1.5).set_opacity(0.55))
        q1a = vec(p, *Q1, C_T, width=6)
        q2a = vec(p, *Q2, C_T, width=6)
        self.play(FadeOut(uarr), FadeOut(varr), Create(teal, lag_ratio=0.01), run_time=1.4)
        self.play(GrowArrow(q1a), GrowArrow(q2a), run_time=0.7)
        q2 = T("Switch to the teal grid.\nDoes the target move?", 30, WHITE, weight=BOLD, line_spacing=0.9)
        q2.move_to(RIGHT * X0 + UP * 1.6)
        self.play(FadeIn(q2, shift=UP * 0.15), run_time=0.7)
        self.until_end()
        self.wait(3)

        # 4 — no: a new address
        self.say()
        self.play(Indicate(tgt, color=C_W, scale_factor=1.6), run_time=0.9)
        ad1 = M("blue/gold address  (1, 2)", 28, C_V)
        ad2 = M("teal address  (3, 2)", 28, C_T)
        ad = VGroup(ad1, ad2).arrange(DOWN, buff=0.25).next_to(q2, DOWN, buff=0.5)
        self.play(FadeIn(ad1), run_time=0.5)
        self.play(FadeIn(ad2), run_time=0.5)
        a2 = boxed(P("New place? <b>No</b> — a new address.", 26, C_W), color=C_W, buff=0.16)
        a2.next_to(ad, DOWN, buff=0.5)
        self.play(FadeIn(a2, shift=UP * 0.1), run_time=0.6)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(q2, ad, a2, teal, q1a, q2a)), FadeIn(uarr), FadeIn(varr), run_time=0.7)

        # 5 — squeeze gold toward blue: out of reach?
        self.say()
        t = ValueTracker(0.0)

        def G():
            return np.array([1 + t.get_value(), 2 - t.get_value()])

        garr = always_redraw(lambda: vec(p, *G(), C_V, width=6))
        self.remove(varr)
        self.add(garr)
        self.play(t.animate.set_value(0.9), run_time=2.4)
        q3 = T("Squeeze gold toward blue.\nOut of reach?", 30, WHITE, weight=BOLD, line_spacing=0.9)
        q3.move_to(RIGHT * X0 + UP * 1.6)
        self.play(FadeIn(q3, shift=UP * 0.15), run_time=0.7)
        self.until_end()
        self.wait(3)

        # 6 — not yet, but fragile: recipe (-17, 20)
        self.say()
        # exact at t = 0.9: gold = (1.9, 1.1); (4, 5) = −17·u + 20·gold
        far = 20 * np.array([1.9, 1.1])
        legs = VGroup()
        for a_, b_, c_ in ((np.zeros(2), far, C_V), (far, TGT, C_U)):
            seg = clip_seg(a_, b_)
            legs.add(Line(p.c2p(*seg[0]), p.c2p(*seg[1]), color=c_, stroke_width=3).set_opacity(0.8))
        rc0 = M("recipe:  1·<i>u</i> + 2·gold", 28)
        rc1 = M("recipe:  −17·<i>u</i> + 20·gold", 28, C_R)
        rc0.next_to(q3, DOWN, buff=0.5)
        rc1.move_to(rc0)
        offl = T("route runs far off the map and back", 20, C_DIM).next_to(rc0, DOWN, buff=0.2)
        self.play(FadeIn(rc0), run_time=0.4)
        self.play(Create(legs[0]), run_time=0.8)
        self.play(Create(legs[1]), ReplacementTransform(rc0, rc1), run_time=0.9)
        self.play(FadeIn(offl), run_time=0.4)
        a3 = boxed(P("Unreachable? <b>Not yet</b> — but fragile.", 26, C_R), color=C_R, buff=0.16)
        a3.next_to(offl, DOWN, buff=0.4)
        self.play(FadeIn(a3, shift=UP * 0.1), run_time=0.6)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(q3, rc1, offl, a3, legs)), t.animate.set_value(0), run_time=1.0)
        garr.clear_updaters()
        self.remove(garr)
        self.add(varr)
        self.board = VGroup(p, home, tgt, tgt_l, ship, uarr, varr)

    # ------------------------------------------------------------------ three questions
    def three_questions(self):
        # 7 — three words
        self.say()
        words = VGroup(*[T(w, 42, c, weight=BOLD) for w, c in
                         (("Reachable?", C_W), ("Unique?", C_V), ("Stable?", C_R))])
        words.arrange(DOWN, buff=0.95, aligned_edge=LEFT).move_to(UP * 0.5).align_to(RIGHT * 0.6, LEFT)
        for w in words:
            self.play(FadeIn(w, shift=LEFT * 0.2), run_time=0.6)
            self.wait(0.3)
        self.until_end()

        # 8 — each question in turn
        self.say()
        for w in words:
            self.play(Indicate(w, color=WHITE, scale_factor=1.1), run_time=1.0)
            self.wait(0.6)
        self.until_end()

        # 9 — what answers them
        self.say()
        ans = VGroup(T("span", 26, C_W), T("independence", 26, C_V), T("conditioning", 26, C_R))
        for a, w in zip(ans, words):
            a.next_to(w, DOWN, buff=0.12).align_to(w, LEFT).shift(RIGHT * 0.05)
        brace = Brace(VGroup(words[0], ans[1]), RIGHT, color=C_DIM).shift(RIGHT * 0.2)
        bl = T("basis", 28, C_U).next_to(brace, RIGHT, buff=0.15)
        self.play(FadeIn(ans[0]), FadeIn(ans[1]), run_time=0.7)
        self.play(GrowFromCenter(brace), FadeIn(bl), run_time=0.7)
        self.wait(1.0)
        self.play(FadeIn(ans[2]), run_time=0.7)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(self.board, words, ans, brace, bl)), run_time=0.8)

    # ------------------------------------------------------------------ montage, relabelled
    def montage(self):
        rng = np.random.default_rng(5)

        # 10 — reads differently
        self.say()
        line = T("The opening montage, read again", 34, WHITE).move_to(UP * 2.65)
        self.play(Write(line), run_time=1.4)
        self.until_end()

        # 11 — embeddings: a point in R^768
        self.say()
        groups = [("king", "queen", "prince"), ("cat", "dog", "puppy"), ("Paris", "Rome", "Berlin")]
        centres = [np.array([-3.2, 0.8, 0]), np.array([0.6, -1.2, 0]), np.array([3.4, 0.7, 0])]
        cols = [C_V, C_W, C_U]
        cloud = VGroup()
        offsets = [np.array([-0.55, -0.35, 0]), np.array([0.05, 0.45, 0]), np.array([0.6, -0.5, 0])]
        for words, cen, c in zip(groups, centres, cols):
            for w, off in zip(words, offsets):  # fixed offsets: labels never collide
                pos = cen + off
                d = Dot(pos, radius=0.07, color=c)
                lab = T(w, 20, c).next_to(d, UR, buff=0.05)
                cloud.add(VGroup(d, lab))
        self.play(LaggedStart(*[FadeIn(g, scale=0.6) for g in cloud], lag_ratio=0.06), run_time=1.6)
        pick = cloud[1][0]
        ring = Circle(radius=0.22, color=WHITE, stroke_width=3).move_to(pick)
        lab = boxed(M("a point in ℝ<sup>768</sup>", 32, C_W), color=C_W, buff=0.16).to_edge(DOWN, buff=0.55)
        self.play(Create(ring), FadeIn(lab, shift=UP * 0.15), run_time=1.0)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(cloud, ring, lab)), run_time=0.5)

        # 12 — weight matrix: columns span its reach; rank ≤ 768
        self.say()
        cells = VGroup()
        nr, nc = 10, 22
        for i in range(nr):
            for j in range(nc):
                v = rng.normal()
                r = Square(0.22, stroke_width=0.5, stroke_color="#0e1116")
                r.set_fill(interpolate_color(ManimColor(C_X), ManimColor(C_U), (np.tanh(v) + 1) / 2), 0.85)
                r.move_to([(j - nc / 2) * 0.22, (nr / 2 - i) * 0.22 + 0.5, 0])
                cells.add(r)
        wl = M("<i>W</i>", 36).next_to(cells, LEFT, buff=0.3)
        hl = M("768 rows", 22, C_DIM).next_to(cells, RIGHT, buff=0.25)
        wl2 = M("3072 columns", 22, C_DIM).next_to(cells, UP, buff=0.15)
        self.play(FadeIn(cells, lag_ratio=0.002), FadeIn(wl), FadeIn(hl), FadeIn(wl2), run_time=1.2)
        picks = [2, 7, 12, 17]
        colsel = VGroup(*[VGroup(*[cells[i * nc + j] for i in range(nr)]) for j in picks])
        boxes = VGroup(*[SurroundingRectangle(c, color=WHITE, buff=0.02, stroke_width=2) for c in colsel])
        self.play(Create(boxes), run_time=0.7)
        lab = boxed(M("columns span its reach;  rank ≤ 768", 32, C_W), color=C_W, buff=0.16)
        lab.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(lab, shift=UP * 0.15), run_time=0.8)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(cells, wl, hl, wl2, boxes, lab)), run_time=0.5)

        # 13 — LoRA: a learned small room of directions
        self.say()
        big = Square(3.0, stroke_color=C_DIM, stroke_width=2).set_fill(C_DIM, 0.15).shift(LEFT * 2.2 + UP * 0.35)
        bl = T("frozen W", 22, C_DIM).next_to(big, DOWN, buff=0.15)
        L = Rectangle(width=0.18, height=3.0, stroke_width=0).set_fill(C_V, 0.9).next_to(big, RIGHT, buff=0.7)
        R = Rectangle(width=3.0, height=0.18, stroke_width=0).set_fill(C_V, 0.9).next_to(L, RIGHT, buff=0.3).align_to(L, UP)
        Ll = T("L: the room (learned)", 20, C_V).next_to(L, DOWN, buff=0.15).align_to(L, LEFT)
        Rl = T("R: the moves inside it", 20, C_V).next_to(R, DOWN, buff=0.15).align_to(R, LEFT).shift(RIGHT * 0.4)
        self.play(FadeIn(big), FadeIn(bl), run_time=0.7)
        self.play(GrowFromEdge(L, UP), GrowFromEdge(R, LEFT), run_time=0.9)
        self.play(FadeIn(Ll), FadeIn(Rl), run_time=0.6)
        lab = boxed(M("Δ<i>W</i> = <i>LR</i>:  rank ≤ <i>r</i>", 32, C_W), color=C_W, buff=0.16)
        lab.to_edge(DOWN, buff=0.55)
        self.play(FadeIn(lab, shift=UP * 0.15), run_time=0.8)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(big, bl, L, R, Ll, Rl, lab, line)), run_time=0.6)

    # ------------------------------------------------------------------ end card
    def end_card(self):
        # 14 — logo, chapter, labs
        self.say()
        self.play(FadeOut(self.header), run_time=0.4)
        mark = gu_mark().scale_to_fit_height(1.9).move_to(UP * 1.75)
        gu, shaft, head, ground = mark
        self.play(GrowFromEdge(ground, LEFT), run_time=0.5)
        self.play(FadeIn(gu, shift=UP * 0.3), run_time=0.7)
        self.play(GrowFromEdge(shaft, DOWN), run_time=0.35)
        self.play(FadeIn(head, shift=UP * 0.2), run_time=0.3)
        name = T("GroundUp Lab", 40, WHITE, weight=BOLD).next_to(mark, DOWN, buff=0.35)
        l1 = T("Read the chapter  ·  run the labs  ·  lab.groundup.workers.dev", 26, C_U)
        l2 = T("@grounduplab-ai", 26, C_V)
        info = VGroup(l1, l2).arrange(DOWN, buff=0.25).next_to(name, DOWN, buff=0.45)
        self.play(FadeIn(name, shift=UP * 0.2), run_time=0.6)
        self.play(FadeIn(l1, shift=UP * 0.15), run_time=0.6)
        self.play(FadeIn(l2, shift=UP * 0.15), run_time=0.6)
        self.until_end()

        # 15 — next time
        self.say()
        nxt = VGroup(T("Next", 22, C_DIM), T("the null space: a home for the round trips", 26, WHITE))
        nxt.arrange(DOWN, buff=0.12).next_to(info, DOWN, buff=0.55)
        nxt = boxed(nxt, color=C_P, buff=0.18)
        self.play(FadeIn(nxt, shift=UP * 0.15), run_time=0.8)
        self.until_end()

        # 16 — sign-off
        self.say()
        self.play(Indicate(head, color=C_W, scale_factor=1.2), run_time=1.2)
