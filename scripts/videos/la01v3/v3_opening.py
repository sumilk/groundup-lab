"""LA01 v3 — Opening: why this matters, and the one question."""
from common import *
from logos import gu_mark
from v3_act1 import Slider, craft

U = (2, 1)
V = (1, 2)


class V3Opening(NScene):
    BEATS = [
        "Welcome to GroundUp Lab. Here's a little puzzle to keep in mind. This craft has two controls. Each one "
        "pushes it along its own arrow. Can some setting of the two controls bring it to that green point?",
        "Hold that thought. This is linear algebra, chapter one, and before any symbols, here's why that little "
        "puzzle matters. Modern AI systems are, at heart, enormous collections of arrows.",
        "Every word a language model reads becomes an arrow, in a space with hundreds of directions.",
        "The learned linear maps inside a network are grids of numbers, and each column of such a grid is an "
        "arrow.",
        "Even the trick that lets you fine-tune a huge model, by training only a tiny slice of it, is a "
        "statement about arrows.",
        "And every one of those stories comes back to one deceptively simple question.",
        "Given some arrows, where can you get to?",
        "That's what this hour is about. We'll build everything from basic arithmetic and algebra, and every "
        "idea gets a picture first, and a name second.",
        "By the end, you'll be able to look at a matrix with seven hundred sixty-eight rows and three thousand "
        "seventy-two columns, and say something true and non-obvious about it. Let's go back to the craft, "
        "and take that question slowly.",
    ]

    def construct(self):
        # -- logo + welcome
        self.say()
        mark = gu_mark().scale_to_fit_height(2.2).move_to(UP * 0.6)
        gu, shaft, head, ground = mark
        self.play(GrowFromEdge(ground, LEFT), run_time=0.6)
        self.play(FadeIn(gu, shift=UP * 0.3), run_time=0.8)
        self.play(GrowFromEdge(shaft, DOWN), run_time=0.4)
        self.play(FadeIn(head, shift=UP * 0.2), run_time=0.3)
        name = T("GroundUp Lab", 44, WHITE, weight=BOLD).next_to(mark, DOWN, buff=0.5)
        self.play(FadeIn(name, shift=UP * 0.2), run_time=0.6)
        self.play(FadeOut(VGroup(mark, name)), run_time=0.5)
        # the puzzle, before any context
        pp = plane((-2, 6), (-1, 6), unit=0.62).to_edge(LEFT, buff=0.7).shift(DOWN * 0.2)
        a = ValueTracker(0.0)
        b = ValueTracker(0.0)
        ship = craft()
        ship.add_updater(lambda m: m.move_to(pp.c2p(*(a.get_value() * np.array(U) + b.get_value() * np.array(V)))))
        tgt = Dot(pp.c2p(4, 5), radius=0.12, color=C_W)
        pu = vec(pp, *U, C_U, width=6)
        pv = vec(pp, *V, C_V, width=6)
        sa = Slider("blue", C_U, a)
        sb = Slider("gold", C_V, b)
        panel = VGroup(sa, sb).arrange(DOWN, buff=0.7).to_edge(RIGHT, buff=0.9).shift(UP * 0.4)
        self.play(Create(pp, lag_ratio=0.02), FadeIn(ship), run_time=1.0)
        self.play(FadeIn(tgt, scale=2), GrowArrow(pu), GrowArrow(pv), FadeIn(panel), run_time=1.0)
        self.play(a.animate.set_value(1), run_time=1.2)
        self.play(a.animate.set_value(0), b.animate.set_value(1), run_time=1.4)
        self.play(b.animate.set_value(0), run_time=0.8)
        qm = T("?", 60, C_W, weight=BOLD).next_to(tgt, UR, buff=0.1)
        self.play(FadeIn(qm, scale=0.5), Indicate(tgt, color=C_W, scale_factor=1.5), run_time=1.0)
        self.until_end()
        self.wait(2)

        # -- why it matters
        self.say()
        ship.clear_updaters()
        self.play(FadeOut(VGroup(pp, ship, tgt, pu, pv, panel, qm)), run_time=0.6)
        line = T("Modern AI = enormous collections of arrows", 34, WHITE).to_edge(UP, buff=0.6)
        self.play(Write(line), run_time=1.6)
        rng = np.random.default_rng(5)
        swarm = VGroup(*[Arrow(ORIGIN, 1.4 * np.array([np.cos(a), np.sin(a), 0]) * rng.uniform(0.5, 1.2),
                               buff=0, stroke_width=2.5, tip_length=0.12,
                               color=interpolate_color(ManimColor(C_U), ManimColor(C_V), rng.uniform()))
                         for a in rng.uniform(0, TAU, 36)]).shift(DOWN * 0.4)
        self.play(LaggedStart(*[GrowArrow(a) for a in swarm], lag_ratio=0.03), run_time=1.8)
        self.play(Rotate(swarm, PI / 6), run_time=1.5)
        self.until_end()
        self.play(FadeOut(swarm), run_time=0.5)

        # -- (a) embeddings
        self.say()
        cap = T("words → arrows in a space with hundreds of directions", 26, C_DIM).to_edge(DOWN, buff=0.5)
        groups = [("king", "queen", "prince"), ("cat", "dog", "puppy"), ("Paris", "Rome", "Berlin")]
        centres = [np.array([-3.2, 1.0, 0]), np.array([0.6, -1.4, 0]), np.array([3.4, 0.9, 0])]
        cols = [C_V, C_W, C_U]
        cloud = VGroup()
        origin = np.array([0, -0.2, 0])
        for words, cen, c in zip(groups, centres, cols):
            for w in words:
                pos = cen + np.array([*rng.normal(0, 0.45, 2), 0])
                d = Dot(pos, radius=0.07, color=c)
                lab = T(w, 20, c).next_to(d, UR, buff=0.05)
                cloud.add(VGroup(d, lab))
        self.play(FadeIn(cap), LaggedStart(*[FadeIn(g, scale=0.6) for g in cloud], lag_ratio=0.08), run_time=2)
        q_arrow = Arrow(origin, cloud[1][0].get_center(), buff=0, color=C_V, stroke_width=4, tip_length=0.18)
        self.play(GrowArrow(q_arrow), Indicate(cloud[1][1], color=WHITE), run_time=1.2)
        self.until_end()
        self.play(FadeOut(VGroup(cloud, q_arrow, cap)), run_time=0.5)

        # -- (b) a weight matrix whose columns are arrows
        self.say()
        cells = VGroup()
        nr, nc = 10, 22
        for i in range(nr):
            for j in range(nc):
                v = rng.normal()
                r = Square(0.22, stroke_width=0.5, stroke_color="#0e1116")
                r.set_fill(interpolate_color(ManimColor(C_X), ManimColor(C_U), (np.tanh(v) + 1) / 2), 0.85)
                r.move_to([(j - nc / 2) * 0.22, (nr / 2 - i) * 0.22 + 0.4, 0])
                cells.add(r)
        wl = M("<i>W</i>", 36).next_to(cells, LEFT, buff=0.3)
        cap = T("a learned linear map = a grid of numbers · each column is an arrow", 26, C_DIM).to_edge(DOWN, buff=0.5)
        self.play(FadeIn(cells, lag_ratio=0.002), FadeIn(wl), FadeIn(cap), run_time=1.4)
        picks = [2, 7, 12, 17]
        colsel = VGroup(*[VGroup(*[cells[i * nc + j] for i in range(nr)]) for j in picks])
        boxes = VGroup(*[SurroundingRectangle(c, color=WHITE, buff=0.02, stroke_width=2) for c in colsel])
        self.play(Create(boxes), run_time=0.8)
        fan = VGroup()
        for k, j in enumerate(picks):
            ang = 0.3 + k * 0.7
            fan.add(Arrow(DOWN * 2.0 + RIGHT * (k - 1.5) * 1.6,
                          DOWN * 2.0 + RIGHT * (k - 1.5) * 1.6 + 0.9 * np.array([np.cos(ang), np.sin(ang), 0]),
                          buff=0, color=[C_U, C_V, C_W, C_P][k], stroke_width=4, tip_length=0.15))
        self.play(cap.animate.set_opacity(0),
                  *[TransformFromCopy(colsel[k], fan[k]) for k in range(4)], run_time=1.6)
        self.until_end()
        self.play(FadeOut(VGroup(cells, wl, boxes, fan, cap)), run_time=0.5)

        # -- (c) low-rank fine-tune
        self.say()
        big = Square(3.2, stroke_color=C_DIM, stroke_width=2).set_fill(C_DIM, 0.15).shift(LEFT * 1.6 + UP * 0.2)
        bl = T("frozen weights · 16.8 million numbers", 22, C_DIM).next_to(big, DOWN, buff=0.2)
        L = Rectangle(width=0.18, height=3.2, stroke_width=0).set_fill(C_V, 0.9).next_to(big, RIGHT, buff=0.6)
        R = Rectangle(width=3.2, height=0.18, stroke_width=0).set_fill(C_V, 0.9).next_to(L, RIGHT, buff=0.3).align_to(L, UP)
        tl = T("train only these · 0.4%", 24, C_V).next_to(VGroup(L, R), DOWN, buff=0.3).shift(RIGHT * 0.6)
        self.play(FadeIn(big), FadeIn(bl), run_time=0.8)
        self.play(GrowFromEdge(L, UP), GrowFromEdge(R, LEFT), run_time=1.0)
        self.play(FadeIn(tl, shift=UP * 0.2), run_time=0.6)
        self.until_end()
        self.play(FadeOut(VGroup(big, bl, L, R, tl, line)), run_time=0.5)

        # -- everything becomes two arrows
        self.say()
        p = plane((-2, 6), (-1, 6), unit=0.62).move_to(DOWN * 0.3)
        many = VGroup(*[Arrow(p.c2p(0, 0), p.c2p(*(rng.uniform(-1.5, 4.5, 2))), buff=0, stroke_width=3,
                              tip_length=0.14, color=interpolate_color(ManimColor(C_U), ManimColor(C_V), rng.uniform()))
                        for _ in range(16)])
        self.play(FadeIn(many, lag_ratio=0.05), run_time=1.0)
        u = vec(p, *U, C_U, width=7)
        v = vec(p, *V, C_V, width=7)
        self.play(Create(p, lag_ratio=0.02),
                  ReplacementTransform(many[:8], u), ReplacementTransform(many[8:], v), run_time=1.8)
        self.until_end()

        self.say()
        q = T("Given some arrows,\nwhere can you get to?", 46, WHITE, weight=BOLD, line_spacing=0.9)
        q.to_edge(RIGHT, buff=0.7)
        self.play(VGroup(p, u, v).animate.shift(LEFT * 3), Write(q), run_time=2)
        self.until_end(1.5)

        self.say()
        cards = VGroup(*[boxed(T(s, 24), color=c, buff=0.16) for s, c in
                         [("about an hour", C_U), ("built from basic arithmetic and algebra", C_W),
                          ("every idea: picture first, name second", C_V)]])
        cards.arrange(RIGHT, buff=0.3)
        if cards.width > 13.2:
            cards.scale_to_fit_width(13.2)
        cards.to_edge(DOWN, buff=0.4)
        for c in cards:
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.5)
            self.wait(1.2)
        self.until_end()

        self.say()
        mat = Rectangle(width=4.2, height=1.1, color=C_U, stroke_width=2).set_fill(C_U, 0.08)
        mat.next_to(q, DOWN, buff=0.5)
        ml = M("768 × 3072", 30, C_U).move_to(mat)
        self.play(FadeOut(cards), Create(mat), FadeIn(ml), run_time=1.2)
        self.wait(3)
        self.play(Circumscribe(mat, color=C_V), run_time=1.2)
        self.done(0.6)
        self.clear_all()
