"""LA01 v3 — Act 6: Vectors that aren't arrows (vector space, axioms, zero vector, additive inverse,
functions as vectors, polynomials Pₘ, infinite-dimensional)."""
from common import *
from v3_act1 import fmt

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
RX = 6.75                      # right safe edge of the frame

AX_SYM = [
    "<i>u</i> + <i>v</i> = <i>v</i> + <i>u</i>",
    "(<i>u</i> + <i>v</i>) + <i>w</i> = <i>u</i> + (<i>v</i> + <i>w</i>)",
    "there is 0 with <i>v</i> + 0 = <i>v</i>",
    "each <i>v</i> has −<i>v</i> with <i>v</i> + (−<i>v</i>) = 0",
    "<i>a</i>(<i>bv</i>) = (<i>ab</i>)<i>v</i>",
    "1<i>v</i> = <i>v</i>",
    "<i>a</i>(<i>u</i> + <i>v</i>) = <i>au</i> + <i>av</i>",
    "(<i>a</i> + <i>b</i>)<i>v</i> = <i>av</i> + <i>bv</i>",
]
AX_GLOSS = [
    "order doesn't matter",
    "grouping doesn't matter",
    "there's a “do nothing” vector",
    "every move can be undone",
    "scaling twice is scaling by the product",
    "scaling by 1 changes nothing",
    "scale a sum = sum of the scaled",
    "scale by a sum = sum of the scalings",
]
SECTIONS = [("Adding behaves like adding", C_U), ("Scaling behaves like scaling", C_V), ("They cooperate", C_W)]
XL, XR = -6.5, 0.35            # left edges of the rulebook's two pages
SLOT = {0: (XL, 1.75), 1: (XL, 0.97), 2: (XL, 0.19), 3: (XL, -0.59),
        4: (XR, 1.75), 5: (XR, 0.97), 6: (XR, -0.45), 7: (XR, -1.2)}
HEADS = [(XL, 2.47), (XR, 2.47), (XR, 0.25)]


def rule_color(i):
    return C_U if i < 4 else (C_V if i < 6 else C_W)


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


def poly_bars(coeffs, x0, base_y, unit=0.42, width=0.62, gap=1.05, color=C_U, labels=None, show_vals=True,
              start=None):
    """Coefficient bars. start[i] lets a bar begin at another bar's top (for stacking)."""
    g = VGroup()
    for i, c in enumerate(coeffs):
        y0 = 0.0 if start is None else start[i]
        lo, hi = sorted((y0, y0 + c))
        h = max((hi - lo) * unit, 0.001)
        r = Rectangle(width=width, height=h, stroke_width=0).set_fill(color, 0.85)
        r.move_to(np.array([x0 + i * gap, base_y + (lo + hi) / 2 * unit, 0]))
        if show_vals:
            v = M(fmt(c).replace(".0", ""), 22, color)
            if c >= 0:
                v.next_to(r, UP, buff=0.08)
            else:
                v.next_to(r, DOWN, buff=0.08)
            g.add(VGroup(r, v))
        else:
            g.add(VGroup(r))
    return g


class V3Act6(NScene):
    BEATS = [
        # 0
        "Act six. Vectors that aren't arrows.",
        # 1
        "So far every vector has been an arrow. But look at what we actually used. We added moves, and we "
        "scaled them. That's all.",
        # 2
        "Lots of things can be added and scaled. Two sounds can be mixed, and a volume knob scales a sound.",
        # 3
        "Two images can be blended pixel by pixel, and brightness scales an image.",
        # 4
        "Two polynomials can be added term by term.",
        # 5
        "We mean the underlying numerical signals, before clipping them to what a screen or speaker can reproduce.",
        # 6
        "If something can be added and scaled in a well-behaved way, every idea in this video applies to it: "
        "span, independence, basis, dimension, all of it.",
        # 7
        "Think of chess. A knight can be carved wood, a bottle cap, or a coin.",
        # 8
        "What makes it a knight is not what it's made of, but how it's allowed to move.",
        # 9
        "Vectors are the same. A vector is anything that follows the rules of adding and scaling.",
        # 10
        "The rules are short. Adding behaves like ordinary adding: order and grouping don't matter, there's a "
        "do-nothing vector, and every move can be undone.",
        # 11
        "Scaling behaves like ordinary scaling.",
        # 12
        "And the two cooperate: scaling a sum is the same as summing the scaled pieces.",
        # 13
        "A collection of things that follows these eight rules is called a vector space, and the rules are its "
        "axioms.",
        # 14
        "The do-nothing vector is the zero vector, and the move that undoes v is its additive inverse, minus v.",
        # 15
        "SLOW|Here are the eight rules in the notation you'll see in every textbook.",
        # 16
        "SLOW|One and two: order and grouping don't matter when adding.",
        # 17
        "SLOW|Three: there's a zero vector. Four: every vector has a negative that cancels it.",
        # 18
        "SLOW|Five and six: scaling twice is scaling by the product, and scaling by one does nothing.",
        # 19
        "SLOW|And seven and eight are where adding and scaling meet. Seven says that scaling a sum is the sum of "
        "the scalings: enlarge the whole parallelogram, and its diagonal enlarges with it.",
        # 20
        "SLOW|Eight says that scaling by a sum of two numbers is the sum of the two scalings.",
        # 21
        "And from these eight rules alone, we can prove things that hold in every vector space at once.",
        # 22
        "Here's the first one: zero times any vector is the zero vector.",
        # 23
        "SLOW|Zero is zero plus zero, so by rule eight, zero times v is zero v plus zero v.",
        # 24
        "SLOW|Now cancel one copy of zero v from both sides, using rules four, two and three,",
        # 25
        "SLOW|and you're left with zero equals zero v.",
        # 26
        "The same style of argument shows that minus one times v is exactly minus v.",
        # 27
        "These look obvious for arrows. The point is that they're true for sounds, images and polynomials too, "
        "and we proved them once.",
        # 28
        "Why bother writing the rules down? Because pictures can mislead you, and rules can't.",
        # 29
        "Here's a scaling that ignores minus signs. It looks harmless, but with it, one move plus minus one move "
        "no longer brings you home.",
        # 30
        "One rule breaks, and half of what we've learned stops working.",
        # 31
        "SLOW|Concretely: define a new scaling that multiplies by the size of the number and throws away its sign.",
        # 32
        "SLOW|Take w equals two, one. One star w plus minus one star w is w plus w, which is four, two.",
        # 33
        "SLOW|But one plus minus one is zero, and zero star w is the origin.",
        # 34
        "SLOW|Rule eight fails.",
        # 35
        "And with it, the fact we just proved, that minus one times v is minus v, fails too.",
        # 36
        "Every theorem leans on the rules, so the rules are the thing to check.",
        # 37
        "Notice what's not in the rules: length and angle. Nothing in them says how long a move is, or whether "
        "two moves are perpendicular.",
        # 38
        "Everything we've done so far would survive if you drew it on a rubber sheet and stretched or sheared it "
        "evenly, keeping home fixed.",
        # 39
        "Not any wobbly deformation: bending would break straight lines. Just uniform stretches and shears.",
        # 40
        "Length and angle are extra structure, added on top, and we'll add them in Act nine.",
        # 41
        "Keep that in mind whenever someone measures similarity between vectors. It's a choice of geometry, not "
        "a fact the vectors carry around.",
        # 42
        "Polynomials make the point beautifully. A polynomial of degree at most two, like three plus two x minus "
        "x squared, is a recipe:",
        # 43
        "three of the move one, two of the move x, minus one of the move x squared.",
        # 44
        "Those three are a basis, so this space has dimension three. We call it P two.",
        # 45
        "SLOW|Adding polynomials adds their coefficients,",
        # 46
        "SLOW|and scaling multiplies them,",
        # 47
        "so P two behaves exactly like R three.",
        # 48
        "SLOW|In the basis one, x, x squared, our polynomial's address is three, two, minus one.",
        # 49
        "SLOW|And just like the city, a different basis gives a different address: in the basis one, one plus x, "
        "one plus x plus x squared, the same polynomial has address one, three, minus one.",
        # 50
        "SLOW|Rebuild it and check: you get three plus two x minus x squared again.",
        # 51
        "Same object, different coordinates, even with no arrows in sight.",
        # 52
        "But now consider all polynomials, of every degree.",
        # 53
        "Any finite list of them has some highest degree, so it can never reach x to the next power.",
        # 54
        "No finite list reaches everything. That space is infinite-dimensional.",
        # 55
        "Other function spaces, including infinite-dimensional ones, appear in Fourier analysis and kernel "
        "methods. Same rules, bigger world.",
    ]

    # ------------------------------------------------------------------ helpers
    def mini_rulebook(self):
        rows = VGroup()
        for i, s in enumerate(AX_SYM):
            r = M(f"<span foreground='{rule_color(i)}'>({i + 1})</span>  {s}", 20)
            at_left(r, -6.6, 2.15 - i * 0.47)
            rows.add(r)
        ttl = T("the eight rules", 20, C_DIM)
        at_left(ttl, -6.6, 2.72)
        return ttl, rows

    def construct(self):
        # ============================================================ 6.1 the same game
        grp, bar, header = section_card(self, "Act 6", "Vectors that aren't arrows",
                                        "What else can be added and scaled?")
        self.say()
        self.until_end(0.6)
        to_header(self, grp, bar, header)

        # 1 — what we actually used
        self.say()
        p = plane((-2, 6), (-1, 6), unit=0.66).to_edge(LEFT, buff=0.5).shift(DOWN * 0.25)
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        ua, va = vec(p, *U, C_U, width=6), vec(p, *V, C_V, width=6)
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), GrowArrow(ua), GrowArrow(va), run_time=1.2)
        cards = VGroup(boxed(T("1 · add moves", 28, C_U), color=C_U),
                       boxed(T("2 · scale moves", 28, C_V), color=C_V)).arrange(DOWN, buff=0.4)
        cards.move_to(RIGHT * 3.4 + UP * 1.2)
        v_at_u = vec(p, *V, C_V, start=tuple(U), width=5)
        s_arr = vec(p, 3, 3, C_W, width=6)
        self.play(FadeIn(cards[0], shift=LEFT * 0.2), TransformFromCopy(va, v_at_u), run_time=1.0)
        self.play(GrowArrow(s_arr), run_time=0.8)
        big = vec(p, 4, 2, C_U, width=4).set_opacity(0.55)
        self.play(FadeIn(cards[1], shift=LEFT * 0.2), TransformFromCopy(ua, big), run_time=1.2)
        thats = T("that's all", 28, WHITE, slant=ITALIC).next_to(cards, DOWN, buff=0.5)
        self.play(FadeIn(thats), run_time=0.6)
        self.until_end()
        self.play(FadeOut(VGroup(p, home, ua, va, v_at_u, s_arr, big, cards, thats)), run_time=0.6)

        # 2 — sounds
        self.say()
        pc = [-4.55, 0.0, 4.55]
        frames = VGroup(*[RoundedRectangle(width=4.2, height=4.9, corner_radius=0.15, stroke_color=C_GRID,
                                           stroke_width=2).move_to(np.array([x, -0.15, 0])) for x in pc])
        ttl = [T("sounds", 26, C_U, weight=BOLD), T("images", 26, C_V, weight=BOLD),
               T("polynomials", 26, C_W, weight=BOLD)]
        for t, x in zip(ttl, pc):
            t.move_to(np.array([x, 1.95, 0]))
        cx = pc[0]
        f1 = lambda t: 0.26 * np.sin(4.5 * t)
        f2 = lambda t: 0.2 * np.sin(7.3 * t + 1.0)

        def wave(f, y, color, amp=1.0, cx=pc[0]):
            return ParametricFunction(lambda t: np.array([cx + t, y + amp * f(t), 0]), t_range=[-1.7, 1.7, 0.02],
                                      color=color, stroke_width=3)

        w1 = wave(f1, 1.2, C_U)
        w2 = wave(f2, 0.4, C_V)
        plus = M("+", 26, C_DIM).move_to(np.array([cx - 1.9, 0.8, 0]))
        eqs = M("=", 26, C_DIM).move_to(np.array([cx - 1.9, -0.25, 0]))
        g = ValueTracker(1.0)
        mix = always_redraw(lambda: wave(lambda t: f1(t) + f2(t), -0.6, C_W, g.get_value()))
        kb = Circle(radius=0.27, color=C_DIM, stroke_width=3).move_to(np.array([cx - 0.7, -1.85, 0]))
        ptr = always_redraw(lambda: Line(kb.get_center(), kb.get_center() + 0.25 * np.array(
            [np.cos(PI * 1.25 - PI * 0.75 * g.get_value()), np.sin(PI * 1.25 - PI * 0.75 * g.get_value()), 0]),
            color=C_W, stroke_width=4))
        kread = always_redraw(lambda: T(f"volume × {fmt(g.get_value())}", 20, C_W).next_to(kb, RIGHT, buff=0.25))
        self.play(FadeIn(frames[0]), FadeIn(ttl[0]), run_time=0.6)
        self.play(Create(w1), run_time=0.9)
        self.play(FadeIn(plus), Create(w2), run_time=0.9)
        self.play(FadeIn(eqs), TransformFromCopy(VGroup(w1, w2), mix), run_time=1.2)
        self.add(mix)
        self.play(FadeIn(kb), FadeIn(ptr), FadeIn(kread), run_time=0.5)
        self.play(g.animate.set_value(0.4), run_time=1.2)
        self.play(g.animate.set_value(1.0), run_time=1.0)
        self.until_end()

        # 3 — images
        self.say()
        cx = pc[1]
        n = 5
        A = np.array([[(i + j) / 8 for j in range(n)] for i in range(n)])
        B = np.array([[1.0 if (i - 2) ** 2 + (j - 2) ** 2 <= 2 else 0.15 for j in range(n)] for i in range(n)])
        k = ValueTracker(1.0)

        def grid(vals, center, kk=1.0, cell=0.3):
            gg = VGroup()
            for i in range(n):
                for j in range(n):
                    v = float(np.clip(kk * vals[i, j], 0, 1))
                    sq = Square(cell, stroke_width=0.6, stroke_color="#0e1116").set_fill(
                        interpolate_color(ManimColor("#000000"), ManimColor("#F2F2F2"), v), 1)
                    sq.move_to(center + np.array([(j - 2) * cell, (2 - i) * cell, 0]))
                    gg.add(sq)
            return gg

        gA = grid(A, np.array([cx - 1.0, 0.85, 0]))
        gB = grid(B, np.array([cx + 1.0, 0.85, 0]))
        lA = T("image A", 20, C_DIM).next_to(gA, DOWN, buff=0.1)
        lB = T("image B", 20, C_DIM).next_to(gB, DOWN, buff=0.1)
        ip = M("+", 26, C_DIM).move_to(np.array([cx, 0.85, 0]))
        C = 0.5 * (A + B)
        rc = np.array([cx - 0.75, -1.15, 0])
        gC = always_redraw(lambda: grid(C, rc, k.get_value()))
        lC = M("½ A + ½ B", 22, C_V).move_to(np.array([cx + 1.05, -0.8, 0]))
        bread = always_redraw(lambda cx=cx: T(f"brightness × {fmt(k.get_value())}", 20, C_V)
                              .move_to(np.array([cx + 1.05, -1.4, 0])))
        self.play(FadeIn(frames[1]), FadeIn(ttl[1]), run_time=0.5)
        self.play(FadeIn(gA), FadeIn(lA), FadeIn(ip), FadeIn(gB), FadeIn(lB), run_time=0.8)
        self.add(gC)
        self.play(FadeIn(lC), run_time=0.5)
        px = [hl(gA[7], C_V, 0.02), hl(gB[7], C_V, 0.02)]
        pxc = Square(0.3, color=C_V, stroke_width=2.5).move_to(rc + np.array([0.0, 0.3, 0]))  # row 1, col 2
        self.play(Create(px[0]), Create(px[1]), Create(pxc), run_time=0.6)
        self.add(bread)
        self.play(k.animate.set_value(0.4), FadeOut(VGroup(*px, pxc)), run_time=1.2)
        self.play(k.animate.set_value(1.0), run_time=1.0)
        self.until_end()

        # 4 — polynomials, term by term
        self.say()
        cx = pc[2]
        xs = [cx - 1.6, cx - 1.0, cx - 0.05, cx + 1.05]
        rows_s = [["", "1", "+ 2<i>x</i>", "− <i>x</i><sup>2</sup>"],
                  ["+", "2", "− <i>x</i>", "+ 3<i>x</i><sup>2</sup>"],
                  ["=", "3", "+ <i>x</i>", "+ 2<i>x</i><sup>2</sup>"]]
        ys = [0.95, 0.25, -0.75]
        prow = VGroup()
        for r, y in zip(rows_s, ys):
            rr = VGroup(*[M(s, 28, C_W if y < 0 else WHITE).move_to(np.array([x, y, 0])) for s, x in zip(r, xs)])
            prow.add(rr)
        rule = Line(np.array([cx - 1.8, -0.25, 0]), np.array([cx + 1.7, -0.25, 0]), color=C_DIM, stroke_width=2)
        self.play(FadeIn(frames[2]), FadeIn(ttl[2]), run_time=0.5)
        self.play(FadeIn(prow[0]), run_time=0.5)
        self.play(FadeIn(prow[1]), Create(rule), run_time=0.5)
        boxes = []
        for c in (1, 2, 3):
            colg = VGroup(prow[0][c], prow[1][c])
            b = hl(colg, C_W, 0.08)
            self.play(Create(b), FadeIn(prow[2][c], shift=DOWN * 0.15), run_time=0.45)
            boxes.append(b)
        self.add(prow[2][0])
        self.play(FadeOut(VGroup(*boxes)), run_time=0.3)
        self.until_end()

        # 5 — before clipping
        self.say()
        cx = pc[0]
        lim = VGroup(*[DashedLine(np.array([cx - 1.75, -0.6 + s * 0.42, 0]), np.array([cx + 1.75, -0.6 + s * 0.42, 0]),
                                  color=C_X, stroke_width=2, dash_length=0.08) for s in (1, -1)])
        cap = P("we mean the <b>underlying numbers</b>, before clipping to what a speaker or screen can reproduce",
                22, C_DIM).move_to(DOWN * 3.15)
        fit(cap, 13.2, None)
        self.play(Create(lim), run_time=0.6)
        self.play(g.animate.set_value(1.7), run_time=1.4)
        self.play(FadeIn(cap), run_time=0.6)
        self.until_end()
        self.play(g.animate.set_value(1.0), FadeOut(lim), run_time=0.8)

        # 6 — every idea applies
        self.say()
        cap2 = P("added and scaled, well-behaved  ⇒  <span foreground='#58C4DD'>span</span> · "
                 "<span foreground='#F4C152'>independence</span> · <span foreground='#83C167'>basis</span> · "
                 "<span foreground='#B39DDB'>dimension</span> · all of it", 24).move_to(DOWN * 3.15)
        fit(cap2, 13.2, None)
        self.play(ReplacementTransform(cap, cap2), run_time=0.9)
        self.play(*[Indicate(f, color=WHITE, scale_factor=1.03) for f in frames], run_time=1.2)
        self.until_end()
        mix.clear_updaters()
        gC.clear_updaters()
        self.play(FadeOut(VGroup(frames, *ttl, w1, w2, plus, eqs, mix, kb, ptr, kread, gA, gB, lA, lB, ip, gC, lC,
                                 bread, prow, rule, cap2)), run_time=0.7)
        self.remove(ptr, kread, bread)

        # ============================================================ 6.2 the rules of the game
        # 7 — chess
        self.say()
        cs = 0.55
        bc = np.array([-3.4, -0.3, 0])

        def cell(c, r):
            return bc + np.array([(c - 2.5) * cs, (r - 2.5) * cs, 0])

        board = VGroup(*[Square(cs, stroke_width=0).set_fill("#3A4356" if (c + r) % 2 else "#232A36", 1)
                         .move_to(cell(c, r)) for c in range(6) for r in range(6)])
        knight = T("♞", 46, "#C8955A")
        cap_ = VGroup(Star(n=18, outer_radius=0.23, inner_radius=0.19, stroke_width=0).set_fill("#D9534F", 1),
                      Circle(radius=0.15, stroke_color="#F2B8B5", stroke_width=2))
        coin = VGroup(Circle(radius=0.21, stroke_width=0).set_fill("#E0B04A", 1),
                      Circle(radius=0.15, stroke_color="#8C6A1C", stroke_width=2))
        pieces = [knight, cap_, coin]
        names = ["carved wood", "a bottle cap", "a coin"]
        self.play(FadeIn(board, lag_ratio=0.01), run_time=0.8)
        legend = VGroup()
        for i, (pc_, nm) in enumerate(zip(pieces, names)):
            icon = pc_.copy().scale(0.9)
            row = VGroup(icon, T(nm, 26, WHITE)).arrange(RIGHT, buff=0.3)
            at_left(row, 0.8, 1.6 - i * 0.75)
            legend.add(row)
        for i, pc_ in enumerate(pieces):
            pc_.move_to(cell(1, 1))
            self.play(FadeIn(pc_, scale=0.6), FadeIn(legend[i], shift=LEFT * 0.2), run_time=0.5)
            self.play(pc_.animate.move_to(cell(1, 3)), run_time=0.5)
            self.play(pc_.animate.move_to(cell(2, 3)), run_time=0.35)
            self.play(FadeOut(pc_), run_time=0.3)
        self.until_end()

        # 8 — the move is what matters
        self.say()
        Lpath = VMobject(color=C_V, stroke_width=5).set_points_as_corners([cell(1, 1), cell(1, 3), cell(2, 3)])
        start_d = Dot(cell(1, 1), radius=0.08, color=C_V)
        end_d = Dot(cell(2, 3), radius=0.12, color=C_V)
        knight.move_to(cell(1, 1)).set_opacity(1)
        self.play(FadeIn(knight), Create(Lpath), FadeIn(start_d), run_time=1.0)
        self.play(FadeIn(end_d, scale=2), run_time=0.4)
        rule_cap = T("the piece doesn't matter; the rules do", 26, C_V)
        at_left(rule_cap, 0.8, -0.85)
        self.play(FadeIn(rule_cap, shift=UP * 0.2), run_time=0.7)
        self.until_end()

        # 9 — vectors are the same
        self.say()
        vdef = VGroup(T("vector = anything that follows", 26, C_U), T("the rules of adding and scaling", 26, C_U))
        vdef.arrange(DOWN, buff=0.15, aligned_edge=LEFT)
        at_left(vdef, 0.8, -2.0)
        self.play(FadeIn(vdef, shift=UP * 0.2), run_time=0.8)
        self.until_end()
        self.play(FadeOut(VGroup(board, knight, Lpath, start_d, end_d, legend, rule_cap, vdef)), run_time=0.6)

        # 10–14 — the rulebook (plain page)
        book = VGroup(RoundedRectangle(width=13.7, height=4.65, corner_radius=0.2, stroke_color=C_DIM,
                                       stroke_width=2).move_to(UP * 0.625),
                      Line(UP * 2.95, DOWN * 1.7, color=C_GRID, stroke_width=3))
        heads = VGroup()
        for (nm, col_), (x, y) in zip(SECTIONS, HEADS):
            heads.add(at_left(T(nm, 24, col_, weight=BOLD), x, y))
        plain = VGroup()
        for i, gl in enumerate(AX_GLOSS):
            r = VGroup(T(f"{i + 1}", 22, rule_color(i), weight=BOLD), T(gl, 22, WHITE)).arrange(RIGHT, buff=0.25)
            at_left(r, *SLOT[i])
            plain.add(r)

        self.say()
        self.play(Create(book[0]), Create(book[1]), run_time=0.8)
        self.play(FadeIn(heads[0], shift=DOWN * 0.1), run_time=0.5)
        self.wait(1.4)
        for i in range(4):
            self.play(FadeIn(plain[i], shift=RIGHT * 0.15), run_time=0.5)
            self.wait(0.9)
        self.until_end()

        self.say()
        self.play(FadeIn(heads[1], shift=DOWN * 0.1), run_time=0.4)
        self.play(FadeIn(plain[4], shift=RIGHT * 0.15), FadeIn(plain[5], shift=RIGHT * 0.15), run_time=0.6)
        self.until_end()

        self.say()
        self.play(FadeIn(heads[2], shift=DOWN * 0.1), run_time=0.5)
        self.play(FadeIn(plain[6], shift=RIGHT * 0.15), run_time=0.6)
        self.wait(0.8)
        self.play(FadeIn(plain[7], shift=RIGHT * 0.15), run_time=0.6)
        self.until_end()

        # 13 — vector space, axioms
        self.say()
        vs = P("<b>vector space</b>: a collection that follows these eight rules", 28, C_W)
        ax = P("<b>axioms</b>: the eight rules themselves", 26, WHITE)
        terms = VGroup(vs, ax).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        at_left(terms, -6.5, -2.5)
        self.play(Write(vs), run_time=1.2)
        self.play(FadeIn(ax), Indicate(book[0], color=C_W, scale_factor=1.01), run_time=0.9)
        self.until_end()

        # 14 — zero vector, additive inverse
        self.say()
        self.play(FadeOut(terms), run_time=0.4)
        zv = P("rule 3: the <b>zero vector</b>  <span font_family='STIX Two Text'>0</span>", 26, C_U)
        ai = P("rule 4: the <b>additive inverse</b>  <span font_family='STIX Two Text'>−<i>v</i></span>", 26, C_U)
        terms2 = VGroup(zv, ai).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        at_left(terms2, -6.5, -2.5)
        h3 = hl(plain[2], C_U)
        self.play(Create(h3), FadeIn(zv), run_time=0.8)
        self.wait(0.8)
        h4 = hl(plain[3], C_U)
        self.play(ReplacementTransform(h3, h4), FadeIn(ai), run_time=0.8)
        self.until_end()
        self.play(FadeOut(VGroup(h4, terms2)), run_time=0.4)

        # 15 — the symbolic page
        self.say()
        syms = VGroup()
        gloss = VGroup()
        for i in range(8):
            x, y = SLOT[i]
            s = M(f"<span foreground='{rule_color(i)}'>({i + 1})</span>  {AX_SYM[i]}", 26)
            at_left(s, x, y + 0.17)
            gl = T(AX_GLOSS[i], 20, C_DIM)
            at_left(gl, x + 0.55, y - 0.22)
            syms.add(s)
            gloss.add(gl)
        forall = M("for all <i>u</i>, <i>v</i>, <i>w</i> ∈ <i>V</i> and <i>a</i>, <i>b</i> ∈ ℝ", 28, WHITE)
        forall.move_to(DOWN * 2.2)
        self.play(*[ReplacementTransform(plain[i], gloss[i]) for i in range(8)], run_time=1.0)
        self.play(LaggedStart(*[FadeIn(s, shift=DOWN * 0.1) for s in syms], lag_ratio=0.12), run_time=1.6)
        self.play(FadeIn(forall), run_time=0.6)
        self.until_end(0.8)

        def focus(idx):
            anims = []
            for i in range(8):
                o = 1.0 if i in idx else 0.28
                anims += [syms[i].animate.set_opacity(o), gloss[i].animate.set_opacity(o)]
            return anims

        for idx in ([0, 1], [2, 3], [4, 5]):
            self.say()
            self.play(*focus(idx), run_time=0.6)
            for i in idx:
                self.play(Indicate(syms[i], color=WHITE, scale_factor=1.04), run_time=0.8)
                self.wait(0.5)
            self.until_end(0.6)

        # 19 — axiom 7: compress to a mini rulebook, scale the parallelogram
        self.say()
        mttl, mini = self.mini_rulebook()
        self.play(FadeOut(VGroup(book, heads, gloss, forall)),
                  *[ReplacementTransform(syms[i], mini[i]) for i in range(8)], FadeIn(mttl), run_time=1.0)
        for i in range(8):
            mini[i].set_opacity(1.0 if i == 6 else 0.35)
        h7 = hl(mini[6], C_W)
        self.play(Create(h7), run_time=0.4)
        pl = plane((-1, 7), (-1, 7), unit=0.5).move_to(np.array([-0.25, -0.75, 0]))
        sc = ValueTracker(1.0)

        def para():
            kk = sc.get_value()
            return VGroup(
                Polygon(pl.c2p(0, 0), pl.c2p(*(kk * U)), pl.c2p(*(kk * (U + V))), pl.c2p(*(kk * V)),
                        stroke_width=0).set_fill(C_P, 0.28),
                vec(pl, *(kk * U), C_U, width=5), vec(pl, *(kk * V), C_V, width=5),
                vec(pl, *(kk * (U + V)), C_W, width=5))

        pg = always_redraw(para)
        self.play(Create(pl, lag_ratio=0.02), run_time=0.8)
        self.add(pg)
        self.play(FadeIn(pg), run_time=0.6)
        ax7 = VGroup(M("<i>u</i> + <i>v</i>", 30, C_W),
                     M("2(<i>u</i> + <i>v</i>) = 2<i>u</i> + 2<i>v</i>", 30, WHITE))
        ax7.arrange(DOWN, buff=0.45, aligned_edge=LEFT)
        at_left(ax7, 2.4, 0.6)
        sread = always_redraw(lambda: M(f"scale × {fmt(sc.get_value())}", 26, C_DIM).next_to(ax7, DOWN, buff=0.5)
                              .align_to(ax7, LEFT))
        self.play(FadeIn(ax7[0]), FadeIn(sread), run_time=0.6)
        self.wait(1.0)
        self.play(sc.animate.set_value(2.0), run_time=3.0)
        self.play(Write(ax7[1]), run_time=1.2)
        self.until_end(1.0)

        # 20 — axiom 8: (2 + 1)u = 2u + 1u
        self.say()
        pg.clear_updaters()
        self.play(FadeOut(VGroup(pg, ax7, sread)), mini[6].animate.set_opacity(0.35), mini[7].animate.set_opacity(1),
                  ReplacementTransform(h7, h8 := hl(mini[7], C_W)), run_time=0.7)
        a2 = vec(pl, 4, 2, C_U, width=6)
        a1 = vec(pl, 2, 1, C_U, start=(4, 2), width=6)
        a3 = vec(pl, 6, 3, C_W, width=3)
        lab2 = M("2<i>u</i>", 26, C_U).next_to(pl.c2p(2, 1), DOWN + RIGHT * 0.3, buff=0.12)
        lab1 = M("1<i>u</i>", 26, C_U).next_to(pl.c2p(5, 2.5), DOWN + RIGHT * 0.3, buff=0.12)
        lab3 = M("(2 + 1)<i>u</i> = 3<i>u</i>", 26, C_W).next_to(pl.c2p(3, 1.5), UL, buff=0.2)
        self.play(GrowArrow(a2), FadeIn(lab2), run_time=0.8)
        self.play(GrowArrow(a1), FadeIn(lab1), run_time=0.8)
        self.play(GrowArrow(a3), FadeIn(lab3), run_time=0.9)
        ax8 = M("(2 + 1)<i>u</i> = 2<i>u</i> + 1<i>u</i>", 30, WHITE)
        at_left(ax8, 2.4, 0.6)
        self.play(Write(ax8), run_time=1.1)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(pl, a1, a2, a3, lab1, lab2, lab3, ax8, h8)),
                  *[mini[i].animate.set_opacity(1) for i in range(8)], run_time=0.6)

        # 21 — prove things once
        self.say()
        once = T("proved from the rules  ⇒  true in every vector space", 26, C_W)
        at_left(once, -1.6, 2.45)
        self.play(FadeIn(once, shift=DOWN * 0.15), run_time=0.8)
        self.until_end()

        # 22 — theorem 0v = 0
        self.say()
        thm = boxed(M("Theorem:   0<i>v</i> = 0", 32, WHITE), color=C_W)
        at_left(thm, -1.6, 1.55)
        self.play(FadeOut(once), FadeIn(thm, shift=UP * 0.15), run_time=0.8)
        self.until_end(0.6)

        def proof_line(markup, y, tag=None, size=28, color=WHITE):
            m = M(markup, size, color)
            at_left(m, -1.6, y)
            fit(m, 6.9 if tag is None else 6.0)
            out = VGroup(m)
            if tag:
                t = M(tag, 24, C_V)
                t.move_to(np.array([RX, y, 0]), aligned_edge=RIGHT)
                out.add(t)
            return out

        def light(idxs, color=C_V):
            return VGroup(*[hl(mini[i], color, 0.05) for i in idxs])

        # 23 — line 1, rule 8
        self.say()
        l1 = proof_line("0<i>v</i> = (0 + 0)<i>v</i> = 0<i>v</i> + 0<i>v</i>", 0.6, "(8)")
        self.play(Write(l1[0]), run_time=1.6)
        lit = light([7])
        self.play(FadeIn(l1[1]), Create(lit), run_time=0.7)
        self.until_end(1.0)

        # 24 — add −(0v) to both sides, rules 4, 2
        self.say()
        l2 = proof_line("add −(0<i>v</i>) to both sides:", -0.1, None, 24, C_DIM)
        l3 = proof_line("0<i>v</i> + (−0<i>v</i>) = (0<i>v</i> + 0<i>v</i>) + (−0<i>v</i>)", -0.75)
        l4 = proof_line("0 = 0<i>v</i> + (0<i>v</i> + (−0<i>v</i>))", -1.5, "(4), (2)")
        self.play(FadeOut(lit), FadeIn(l2), run_time=0.6)
        self.play(Write(l3), run_time=1.4)
        lit = light([3, 1])
        self.play(Write(l4[0]), run_time=1.2)
        self.play(FadeIn(l4[1]), Create(lit), run_time=0.6)
        self.until_end(1.0)

        # 25 — 0 = 0v, rules 4, 3
        self.say()
        l5 = proof_line("0 = 0<i>v</i> + 0 = 0<i>v</i>", -2.25, "(4), (3)", 30, C_W)
        self.play(FadeOut(lit), Write(l5[0]), run_time=1.2)
        lit = light([3, 2])
        self.play(FadeIn(l5[1]), Create(lit), run_time=0.6)
        self.play(Circumscribe(l5[0], color=C_W), run_time=1.0)
        self.until_end(1.2)

        # 26 — (−1)v = −v
        self.say()
        neg = proof_line("same style:   (−1)<i>v</i> = −<i>v</i>", -3.0, None, 28, C_U)
        self.play(FadeOut(lit), FadeIn(neg, shift=UP * 0.15), run_time=0.8)
        self.until_end()

        # 27 — true everywhere
        self.say()
        every = T("sounds ✓   images ✓   polynomials ✓   — proved once", 24, C_W)
        self.play(FadeOut(VGroup(l1, l2, l3, l4)), run_time=0.5)
        at_left(every, -1.6, 0.4)
        self.play(FadeIn(every, shift=UP * 0.15), run_time=0.8)
        self.until_end()
        self.play(FadeOut(VGroup(thm, l5, neg, every)), run_time=0.5)

        # 28 — pictures mislead
        self.say()
        mis = T("pictures can mislead; rules can't", 28, WHITE, slant=ITALIC)
        at_left(mis, -1.6, 2.45)
        self.play(FadeIn(mis), run_time=0.8)
        self.until_end()

        # 29 — the false scaling, in a picture
        self.say()
        qp = plane((-3, 5), (-2, 3), unit=0.5).move_to(np.array([0.05, 0.45, 0]))
        false = T("“scaling” that ignores the sign", 24, C_X)
        at_left(false, 2.25, 2.45)
        fit(false, RX - 2.25)
        w_ = vec(qp, 2, 1, C_U, width=6)
        wl = M("1⋆<i>w</i>", 24, C_U).next_to(qp.c2p(1.2, 0.6), DR, buff=0.12)
        self.play(FadeOut(mis), Create(qp, lag_ratio=0.02), FadeIn(false), run_time=0.9)
        self.play(GrowArrow(w_), FadeIn(wl), run_time=0.7)
        ghost = DashedLine(qp.c2p(2, 1), qp.c2p(0, 0), color=C_DIM, dash_length=0.08, stroke_width=3)
        gl_ = T("true −w: back home", 20, C_DIM).next_to(qp.c2p(-2.9, -1.4), RIGHT, buff=0.05)
        self.play(Create(ghost), FadeIn(gl_), run_time=0.7)
        w2_ = vec(qp, 2, 1, C_X, start=(2, 1), width=6)
        wl2 = M("(−1)⋆<i>w</i>", 24, C_X).next_to(qp.c2p(3, 1.5), DOWN + RIGHT * 0.4, buff=0.08)
        self.play(GrowArrow(w2_), FadeIn(wl2), run_time=0.9)
        land = Dot(qp.c2p(4, 2), radius=0.1, color=C_X)
        nh = T("not home ✗", 22, C_X).next_to(land, UP, buff=0.12)
        self.play(FadeIn(land, scale=2), FadeIn(nh), run_time=0.6)
        self.until_end()

        # 30 — one rule breaks
        self.say()
        r8 = hl(mini[7], C_X, 0.06)
        flag = T("✗", 26, C_X).next_to(r8, RIGHT, buff=0.12)
        self.play(Create(r8), FadeIn(flag), run_time=0.7)
        self.play(Indicate(mini[7], color=C_X), run_time=0.9)
        self.until_end()

        # 31 — the definition
        self.say()
        dfn = boxed(M("<i>a</i> ⋆ <i>v</i> = |<i>a</i>| <i>v</i>", 32, WHITE), color=C_X)
        dfn.move_to(np.array([4.5, 0.5, 0]))
        self.play(FadeIn(dfn, shift=UP * 0.15), run_time=0.8)
        self.until_end(1.0)

        # 32 — left side
        self.say()
        wdef = M("<i>w</i> = (2, 1)", 28, C_U).next_to(dfn, DOWN, buff=0.35)
        self.play(FadeIn(wdef), run_time=0.6)
        lx, rx_ = -1.6, 2.9
        L = VGroup(M("1⋆<i>w</i> + (−1)⋆<i>w</i>", 28), M("= <i>w</i> + <i>w</i>", 28), M("= (4, 2)", 28, C_X))
        L.arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        at_left(L, lx, -2.1)
        for ln in L:
            self.play(Write(ln), run_time=0.9)
            self.wait(0.3)
        self.until_end(1.0)

        # 33 — right side
        self.say()
        R = VGroup(M("(1 + (−1))⋆<i>w</i>", 28), M("= 0⋆<i>w</i>", 28), M("= (0, 0)", 28, C_W))
        R.arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        at_left(R, rx_, -2.1)
        for ln in R:
            self.play(Write(ln), run_time=0.9)
            self.wait(0.3)
        self.until_end(1.0)

        # 34 — rule 8 fails
        self.say()
        neq = M("≠", 48, C_X).move_to(np.array([(L.get_right()[0] + R.get_left()[0]) / 2, R[2].get_y(), 0]))
        self.play(FadeIn(neq, scale=1.6), Indicate(mini[7], color=C_X), run_time=0.9)
        self.until_end(0.8)

        # 35 — (−1)⋆w ≠ −w
        self.say()
        so = M("so  (−1)⋆<i>w</i> = (2, 1)  ≠  −<i>w</i> = (−2, −1)", 28, C_X)
        at_left(so, lx, -3.35)
        fit(so, RX - lx)
        self.play(FadeIn(so, shift=UP * 0.15), Indicate(wl2, color=C_X), run_time=1.0)
        self.until_end(0.8)

        # 36 — check the rules
        self.say()
        chk = T("every theorem leans on the rules", 24, C_W)
        at_left(chk, 2.25, 2.45)
        self.play(FadeOut(false), FadeIn(chk), run_time=0.7)
        self.until_end()
        self.play(*[FadeOut(m) for m in self.mobjects if m is not header], run_time=0.7)

        # ============================================================ 6.3 rubber sheet
        self.say()
        org = np.array([-4.3, -1.3, 0])
        un = 0.55
        mt = ValueTracker(0.0)
        keys = [np.eye(2), np.array([[1.5, 0.0], [0.0, 0.6]]), np.array([[1.0, -0.8], [0.0, 1.0]]), np.eye(2)]

        def Mat():
            t = mt.get_value()
            kk = min(int(t), len(keys) - 2)
            f = t - kk
            return (1 - f) * keys[kk] + f * keys[kk + 1]

        def sp(x, y):
            q = Mat() @ np.array([x, y])
            return org + un * np.array([q[0], q[1], 0])

        def sheet():
            gg = VGroup()
            for c in range(-1, 5):
                gg.add(Line(sp(c, -1), sp(c, 4), color="#3A4A66", stroke_width=1.6))
                gg.add(Line(sp(-1, c), sp(4, c), color="#3A4A66", stroke_width=1.6))
            gg.add(Line(sp(-1, 0), sp(4, 0), color="#5B6475", stroke_width=2.5),
                   Line(sp(0, -1), sp(0, 4), color="#5B6475", stroke_width=2.5))
            gg.add(Polygon(sp(0, 0), sp(*U), sp(*(U + V)), sp(*V), stroke_width=0).set_fill(C_P, 0.25))
            for vv, cc, w in ((U, C_U, 6), (V, C_V, 6), (U + V, C_W, 4)):
                gg.add(Arrow(sp(0, 0), sp(*vv), buff=0, color=cc, stroke_width=w, tip_length=0.2,
                             max_tip_length_to_length_ratio=0.25))
            gg.add(Dot(sp(*(U + V)), radius=0.07, color=C_W))
            return gg

        sh = always_redraw(sheet)

        def readings():
            Mm = Mat()
            mu, mv = Mm @ U, Mm @ V
            lu, lv = round(float(np.linalg.norm(mu)), 2), round(float(np.linalg.norm(mv)), 2)
            ang = round(float(np.degrees(np.arccos(np.clip(mu @ mv / (np.linalg.norm(mu) * np.linalg.norm(mv)),
                                                             -1, 1)))), 1)
            g_ = VGroup(M(f"length of <i>u</i>  ≈  {lu:.2f}", 26, C_U),
                        M(f"length of <i>v</i>  ≈  {lv:.2f}", 26, C_V),
                        M(f"angle between  ≈  {ang:.1f}°", 26, WHITE)).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
            return at_left(g_, 1.0, 1.15)

        rd = always_redraw(readings)
        notin = T("not in the rules: length, angle", 26, C_X)
        at_left(notin, 1.0, 2.5)
        self.play(FadeIn(sh), run_time=0.8)
        self.add(sh)
        self.play(FadeIn(notin), run_time=0.6)
        self.play(FadeIn(rd), run_time=0.6)
        self.until_end()

        # 38 — stretch and shear evenly
        self.say()
        corner = T("u + v still lands on the corner ✓", 24, C_W)
        unif = T("uniform stretch / shear, home fixed ✓", 24, C_W)
        VGroup(corner, unif).arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        at_left(corner, 1.0, -0.15)
        at_left(unif, 1.0, -0.6)
        self.play(mt.animate.set_value(1.0), run_time=2.6)
        self.play(FadeIn(corner), run_time=0.5)
        self.play(mt.animate.set_value(2.0), run_time=2.6)
        self.play(FadeIn(unif), run_time=0.5)
        self.until_end()

        # 39 — bending is not allowed
        self.say()
        bc2 = np.array([2.2, -2.45, 0])

        def bent(x, y):
            return bc2 + 0.32 * np.array([x + 0.35 * np.sin(1.3 * y), y + 0.35 * np.sin(1.3 * x), 0])

        bg = VGroup()
        for c in range(-2, 3):
            bg.add(ParametricFunction(lambda t, c=c: bent(c, t), t_range=[-2, 2, 0.05], color="#3A4A66", stroke_width=2))
            bg.add(ParametricFunction(lambda t, c=c: bent(t, c), t_range=[-2, 2, 0.05], color="#3A4A66", stroke_width=2))
        bcap = VGroup(T("bending ✗", 24, C_X), T("straight lines curve", 20, C_DIM)).arrange(DOWN, buff=0.1,
                                                                                         aligned_edge=LEFT)
        at_left(bcap, 3.4, -2.45)
        self.play(Create(bg), run_time=1.2)
        self.play(FadeIn(bcap), run_time=0.5)
        self.play(mt.animate.set_value(2.6), run_time=1.6)
        self.until_end()
        self.play(FadeOut(VGroup(bg, bcap)), run_time=0.5)

        # 40 — extra structure
        self.say()
        extra = VGroup(P("length and angle = <b>extra structure</b>,", 24, C_V),
                       T("added on top in Act 9", 24, C_V)).arrange(DOWN, buff=0.1, aligned_edge=LEFT)
        at_left(extra, 1.0, -1.45)
        self.play(FadeIn(extra, shift=UP * 0.15), run_time=0.8)
        self.play(mt.animate.set_value(3.0), run_time=2.0)
        self.until_end()

        # 41 — similarity is a choice
        self.say()
        simil = P("“similarity” = a <b>choice of geometry</b>,", 24, WHITE)
        simil2 = T("not a fact the vectors carry", 24, WHITE)
        at_left(simil, 1.0, -2.35)
        at_left(simil2, 1.0, -2.8)
        self.play(FadeIn(simil), FadeIn(simil2), run_time=0.8)
        self.play(mt.animate.set_value(1.6), run_time=2.0)
        self.until_end()
        sh.clear_updaters()
        rd.clear_updaters()
        self.play(FadeOut(VGroup(sh, rd, notin, corner, unif, extra, simil, simil2)), run_time=0.6)

        # ============================================================ 6.4 polynomials
        bx0, by = -5.2, -0.3
        base = Line(np.array([-6.0, by, 0]), np.array([-1.7, by, 0]), color=C_DIM, stroke_width=2)

        def blabels(names, x0=bx0, gap=1.05):
            return VGroup(*[M(nm, 26, C_DIM).move_to(np.array([x0 + i * gap, -2.35, 0])) for i, nm in enumerate(names)])

        names3 = ["1", "<i>x</i>", "<i>x</i><sup>2</sup>"]

        # 42 — a polynomial is a recipe
        self.say()
        poly = M("3 + 2<i>x</i> − <i>x</i><sup>2</sup>", 40, WHITE)
        at_left(poly, 0.6, 2.2)
        self.play(Write(poly), run_time=1.2)
        self.until_end()

        # 43 — three of "1", two of "x", minus one of "x²"
        self.say()
        bars = poly_bars([3, 2, -1], bx0, by)
        bl = blabels(names3)
        self.play(Create(base), FadeIn(bl), run_time=0.6)
        rec = VGroup(T("3 × move “1”", 24, C_U), T("2 × move “x”", 24, C_U), T("−1 × move “x²”", 24, C_U))
        rec.arrange(DOWN, buff=0.18, aligned_edge=LEFT)
        at_left(rec, 0.6, 1.0)
        for i in range(3):
            self.play(GrowFromEdge(bars[i][0], DOWN if i < 2 else UP), FadeIn(bars[i][1]), FadeIn(rec[i]),
                      run_time=0.8)
            self.wait(0.4)
        self.until_end()

        # 44 — basis, dimension 3, P2
        self.say()
        bas = P("basis  1, <i>x</i>, <i>x</i>²   ⇒   dimension 3", 26, WHITE)
        p2 = P("<b>P₂</b> = polynomials of degree ≤ 2", 28, C_W)
        pm = M("in general  P<sub><i>m</i></sub> = polynomials of degree ≤ <i>m</i>", 24, C_DIM)
        VGroup(bas, p2, pm)
        at_left(bas, 0.6, -0.4)
        at_left(p2, 0.6, -1.1)
        at_left(pm, 0.6, -1.65)
        self.play(FadeIn(bas), run_time=0.7)
        self.wait(0.8)
        self.play(Write(p2), run_time=1.0)
        self.play(FadeIn(pm), run_time=0.6)
        self.until_end()
        self.play(FadeOut(VGroup(rec, bas, pm, bars)), p2.animate.scale(0.8).to_corner(UR, buff=0.4).shift(DOWN * 0.1),
                  poly.animate.set_opacity(0), run_time=0.7)
        self.remove(poly)

        # 45 — adding adds coefficients (bars stack)
        self.say()
        pq = VGroup(M("<i>p</i> = 1 + 2<i>x</i> − <i>x</i><sup>2</sup>", 30, C_U),
                    M("<i>q</i> = 2 − <i>x</i> + 3<i>x</i><sup>2</sup>", 30, C_V),
                    M("<i>p</i> + <i>q</i> = 3 + <i>x</i> + 2<i>x</i><sup>2</sup>", 30, C_W))
        pq.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        at_left(pq, 0.6, 1.25)
        pb = poly_bars([1, 2, -1], bx0, by, color=C_U, show_vals=False)
        qb = poly_bars([2, -1, 3], bx0, by, color=C_V, show_vals=False, start=[1, 2, -1], width=0.36)
        sb = poly_bars([3, 1, 2], bx0, by, color=C_W)
        self.play(FadeIn(pq[0]), FadeIn(pb), run_time=0.7)
        self.play(FadeIn(pq[1]), FadeIn(qb, shift=UP * 0.2), run_time=0.7)
        self.play(FadeIn(pq[2]), ReplacementTransform(VGroup(pb, qb), sb), run_time=1.0)
        self.until_end(1.0)

        # 46 — scaling multiplies them
        self.say()
        twop = M("2<i>p</i> = 2 + 4<i>x</i> − 2<i>x</i><sup>2</sup>", 30, C_U)
        at_left(twop, 0.6, -0.35)
        pb1 = poly_bars([1, 2, -1], bx0, by, color=C_U)
        pb2 = poly_bars([2, 4, -2], bx0, by, color=C_U)
        self.play(FadeOut(sb), FadeIn(pb1), run_time=0.5)
        self.play(ReplacementTransform(pb1, pb2), FadeIn(twop), run_time=1.0)
        self.until_end(1.0)

        # 47 — P2 like R3
        self.say()
        like = M("P<sub>2</sub>  ↔  ℝ<sup>3</sup>:   <i>c</i><sub>0</sub> + <i>c</i><sub>1</sub><i>x</i> + "
                 "<i>c</i><sub>2</sub><i>x</i><sup>2</sup>  ↔  (<i>c</i><sub>0</sub>, <i>c</i><sub>1</sub>, "
                 "<i>c</i><sub>2</sub>)", 28, C_W)
        at_left(like, 0.6, -1.3)
        fit(like, RX - 0.6)
        self.play(Write(like), run_time=1.4)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(pq, twop, like, pb2)), run_time=0.5)

        # 48 — coordinates in 1, x, x²
        self.say()
        bars = poly_bars([3, 2, -1], bx0, by)
        poly = M("3 + 2<i>x</i> − <i>x</i><sup>2</sup>", 34, WHITE)
        at_left(poly, -6.0, 2.15)
        c1 = M("[3 + 2<i>x</i> − <i>x</i><sup>2</sup>]<sub>(1, <i>x</i>, <i>x</i>²)</sub>  =  (3, 2, −1)", 30, WHITE)
        at_left(c1, 0.6, 1.6)
        fit(c1, RX - 0.6)
        self.play(FadeIn(bars), FadeIn(poly), run_time=0.6)
        self.play(Write(c1), run_time=1.6)
        self.until_end(1.0)

        # 49 — a second basis, a second address
        self.say()
        b2 = M("basis  (1,  1 + <i>x</i>,  1 + <i>x</i> + <i>x</i><sup>2</sup>)", 28, C_V)
        at_left(b2, 0.6, 0.75)
        c2 = M("[3 + 2<i>x</i> − <i>x</i><sup>2</sup>]<sub>new basis</sub>  =  (1, 3, −1)", 30, C_V)
        at_left(c2, 0.6, 0.05)
        fit(c2, RX - 0.6)
        self.play(FadeIn(b2), run_time=0.8)
        self.wait(2.5)
        self.play(Write(c2), run_time=1.4)
        self.until_end(1.0)

        # 50 — rebuild and check
        self.say()
        k1 = M("1·1 + 3·(1 + <i>x</i>) − 1·(1 + <i>x</i> + <i>x</i><sup>2</sup>)", 28)
        k2 = M("= 1 + 3 + 3<i>x</i> − 1 − <i>x</i> − <i>x</i><sup>2</sup>", 28)
        k3 = M("= 3 + 2<i>x</i> − <i>x</i><sup>2</sup>  ✓", 28, C_W)
        kk_ = VGroup(k1, k2, k3).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
        at_left(kk_, 0.6, -1.55)
        for ln in kk_:
            fit(ln, RX - 0.6)
            self.play(Write(ln), run_time=1.0)
            self.wait(0.4)
        self.until_end(1.2)

        # 51 — same object, different coordinates
        self.say()
        same = T("same object, different coordinates", 26, C_W).next_to(base, DOWN, buff=0.15)
        same.move_to(np.array([-3.9, -3.1, 0]))
        self.play(FadeIn(same), Indicate(poly, color=C_W), run_time=0.9)
        self.until_end()
        self.play(FadeOut(VGroup(bars, poly, c1, b2, c2, kk_, same, base, bl, p2)), run_time=0.6)

        # 52 — all polynomials
        self.say()
        names = ["1", "<i>x</i>", "<i>x</i><sup>2</sup>", "<i>x</i><sup>3</sup>", "<i>x</i><sup>4</sup>",
                 "<i>x</i><sup>5</sup>", "<i>x</i><sup>6</sup>", "<i>x</i><sup>7</sup>"]
        tx0, gap = -5.6, 1.15
        base2 = Line(np.array([-6.3, -1.4, 0]), np.array([4.0, -1.4, 0]), color=C_DIM, stroke_width=2)
        tower = VGroup()
        tl = VGroup()
        for i, nm in enumerate(names):
            r = Rectangle(width=0.62, height=1.0 + 0.32 * i, stroke_width=0).set_fill(
                interpolate_color(ManimColor(C_U), ManimColor(C_P), i / 7), 0.85)
            r.move_to(np.array([tx0 + i * gap, -1.4 + r.height / 2, 0]))
            tower.add(r)
            tl.add(M(nm, 28, WHITE).next_to(r, DOWN, buff=0.15).set_y(-1.85))
        more = M("…", 44, C_DIM).move_to(np.array([tx0 + 8 * gap, -0.9, 0]))
        allp = T("all polynomials, every degree", 28, WHITE)
        at_left(allp, -6.3, 2.4)
        self.play(FadeIn(allp), Create(base2), run_time=0.6)
        self.play(LaggedStart(*[AnimationGroup(GrowFromEdge(tower[i], DOWN), FadeIn(tl[i])) for i in range(8)],
                              lag_ratio=0.25), run_time=2.6)
        self.play(FadeIn(more), run_time=0.4)
        self.until_end()

        # 53 — any finite list misses the next power
        self.say()
        sel = SurroundingRectangle(VGroup(tower[:4], tl[:4]), color=C_V, buff=0.12, corner_radius=0.1)
        sl = P("a finite list: highest degree 3", 24, C_V).next_to(sel, UP, buff=0.15).align_to(sel, LEFT)
        self.play(Create(sel), FadeIn(sl), *[tower[i].animate.set_opacity(0.25) for i in range(4, 8)], run_time=0.9)
        miss = hl(VGroup(tower[4], tl[4]), C_X, 0.1)
        ml = P("<i>x</i>⁴ is out of reach ✗", 24, C_X).next_to(miss, UP, buff=0.15)
        ml.align_to(miss, LEFT)
        self.play(tower[4].animate.set_opacity(0.9), Create(miss), FadeIn(ml), run_time=0.9)
        span3 = M("span(1, <i>x</i>, <i>x</i><sup>2</sup>, <i>x</i><sup>3</sup>) = P<sub>3</sub>  ∌  "
                  "<i>x</i><sup>4</sup>", 28, WHITE)
        span3.move_to(DOWN * 2.85)
        self.play(FadeIn(span3), run_time=0.7)
        self.until_end()

        # 54 — infinite-dimensional
        self.say()
        self.play(FadeOut(VGroup(sel, sl, miss, ml, span3)), *[tower[i].animate.set_opacity(0.85) for i in range(8)],
                  run_time=0.5)
        inf = T("infinite-dimensional", 34, C_P, weight=BOLD)
        infs = T("no finite list reaches everything", 24, C_DIM)
        VGroup(inf, infs).arrange(DOWN, buff=0.15, aligned_edge=LEFT)
        at_left(inf, -6.3, 1.55)
        at_left(infs, -6.3, 1.0)
        self.play(Write(inf), FadeIn(infs), Indicate(more, color=C_P, scale_factor=1.5), run_time=1.2)
        self.until_end()

        # 55 — bigger world
        self.say()
        fk = P("other function spaces, some infinite-dimensional:  Fourier analysis · kernel methods", 24, WHITE)
        fk.move_to(DOWN * 2.6)
        fit(fk, 13.0, None)
        bw = T("same rules, bigger world", 30, C_W, weight=BOLD).move_to(DOWN * 3.25)
        self.play(FadeIn(fk), run_time=0.8)
        self.play(Write(bw), run_time=0.9)
        self.done(1.0)
        self.clear_all()
