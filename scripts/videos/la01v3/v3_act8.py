"""LA01 v3 — Act 8: Machines made of arrows (matrix, matrix–vector product, column space, rank,
null space preview, invertible / inverse, change of basis as a matrix, low-rank update ΔW = LR)."""
from common import *
from v3_act1 import Slider, craft, dimmed, fmt

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
W3 = np.array([3.0, 3.0])
Q1 = np.array([2.0, 1.0])
Q2 = np.array([-1.0, 1.0])
TGT = np.array([4.0, 5.0])
C_T = "#4DB6AC"      # teal grid (the second basis Q)
PX = 3.5             # centre of the right-hand panel


def fit(m, w=6.4):
    """Scale to width first, then the caller positions it."""
    if m.width > w:
        m.scale_to_fit_width(w)
    return m


def at(m, x=PX, y=0.0, w=6.4):
    return fit(m, w).move_to(np.array([x, y, 0]))


def stack(lines, top, left=0.35, buff=0.3, w=6.4):
    g = VGroup(*lines).arrange(DOWN, buff=buff, aligned_edge=LEFT)
    fit(g, w)
    g.move_to(np.array([left + g.width / 2, top - g.height / 2, 0]))
    return g


def row(*mobs, buff=0.18):
    return VGroup(*mobs).arrange(RIGHT, buff=buff)


def mm(rows, size=32, cols=None):
    ec = {("col", j): c for j, c in enumerate(cols)} if cols else None
    return matrix_mob(rows, size=size, entry_colors=ec)


def col_box(mat, j, color, buff=0.1):
    ents = VGroup(*[mat.entries[i][j] for i in range(len(mat.entries))])
    return SurroundingRectangle(ents, color=color, buff=buff, corner_radius=0.06, stroke_width=2.5)


def row_box(mat, i, color=WHITE, buff=0.1):
    ents = VGroup(*mat.entries[i])
    return SurroundingRectangle(ents, color=color, buff=buff, corner_radius=0.06, stroke_width=2.5)


def precise_tag(mob):
    return T("PRECISE", 18, C_V, weight=BOLD).next_to(mob, UP, buff=0.15).align_to(mob, LEFT)


class Fader(VGroup):
    """A vertical mixing-desk fader driven by a ValueTracker (0 … hi)."""

    def __init__(self, title, color, tracker, hi=3, height=2.0):
        super().__init__()
        self.tracker, self.hi = tracker, hi
        track = Line(DOWN * height / 2, UP * height / 2, color=C_DIM, stroke_width=4)
        ticks = VGroup(*[Line(LEFT * 0.08, RIGHT * 0.08, color=C_DIM, stroke_width=2)
                         .move_to(track.point_from_proportion(k / hi)) for k in range(hi + 1)])
        self.track = track
        knob = always_redraw(lambda: RoundedRectangle(width=0.44, height=0.2, corner_radius=0.05, stroke_width=0)
                             .set_fill(color, 1).move_to(self.pos()))
        val = always_redraw(lambda: M(fmt(tracker.get_value()), 24, color).next_to(track, DOWN, buff=0.18))
        self.add(track, ticks, knob, val)
        if title is not None:
            title.next_to(track, UP, buff=0.22)
            self.add(title)

    def pos(self):
        t = np.clip(self.tracker.get_value(), 0, self.hi) / self.hi
        return self.track.point_from_proportion(t)


def clipped_line(p, point, direction, xr, yr, color, width=1.5, opacity=0.5):
    """Line through `point` along `direction`, clipped to the plane rectangle xr × yr (plane coords)."""
    pt = np.array(point, float)
    d = np.array(direction, float)
    ts = []
    for k, (lo, hi) in enumerate((xr, yr)):
        if abs(d[k]) > 1e-9:
            ts += [(lo - pt[k]) / d[k], (hi - pt[k]) / d[k]]
    ts.sort()
    good = []
    for t in ts:
        q = pt + t * d
        if xr[0] - 1e-6 <= q[0] <= xr[1] + 1e-6 and yr[0] - 1e-6 <= q[1] <= yr[1] + 1e-6:
            good.append(q)
    if len(good) < 2:
        return None
    return Line(p.c2p(*good[0]), p.c2p(*good[-1]), color=color, stroke_width=width, stroke_opacity=opacity)


def skew_grid(p, b1, b2, xr, yr, color, n=12, width=1.5, opacity=0.45):
    g = VGroup()
    for k in range(-n, n + 1):
        for base, d in ((np.array(b1) * k, b2), (np.array(b2) * k, b1)):
            ln = clipped_line(p, base, d, xr, yr, color, width, opacity)
            if ln is not None:
                g.add(ln)
    return g


class V3Act8(NScene):
    BEATS = [
        # 0
        "Act eight. Machines made of arrows.",
        # ---- 8.1
        # 1
        "We've been using matrices this whole time without writing one down. Take the moves and stand them side "
        "by side as columns. That grid of numbers is a matrix.",
        # 2
        "Write the recipe, the amounts, as a short column too.",
        # 3
        "SLOW|Then multiplying the matrix by the recipe means exactly one thing: scale each column by its amount "
        "and add them up.",
        # 4
        "If you like, think of a mixing desk. Each column is a channel. The recipe is the fader positions. And "
        "the output is the mix.",
        # 5
        "That's all a matrix does to a vector: it mixes its own columns.",
        # 6
        "SLOW|With our cast: the matrix with columns blue and gold, times the recipe one, two, is one blue plus "
        "two gold, which is four, five. The green target, as a matrix product.",
        # 7
        "SLOW|In general, a matrix with n rows and k columns takes in k amounts, one per column, and puts out a "
        "vector with n entries.",
        # 8
        "SLOW|There's a second way to compute the same thing, row by row: each output entry is a row of the "
        "matrix multiplied entry by entry with the recipe and added.",
        # 9
        "SLOW|Row one gives two plus two, four; row two gives one plus four, five. Same answer.",
        # 10
        "The column picture tells you what it means; the row picture is how you'd compute it by hand.",
        # ---- 8.2
        # 11
        "Now every question from this video fits in one line.",
        # 12
        "Can I reach the target? That asks whether some recipe makes the matrix output the target.",
        # 13
        "Everywhere the matrix can reach is the span of its columns, called its column space.",
        # 14
        "Is there dead weight? That asks whether some non-zero recipe outputs zero: a round trip.",
        # 15
        "And the number of genuinely independent directions among the columns, the dimension of the column "
        "space, is called the rank.",
        # 16
        "Those round-trip recipes, all the inputs that the machine sends to zero, form their own subspace.",
        # 17
        "It's called the null space, and it's the star of the next chapter.",
        # 18
        "SLOW|Here's how the two ideas fit together. With the three-control panel, every recipe for the target "
        "is one particular recipe, one, two, zero,",
        # 19
        "SLOW|plus any amount of the round trip, minus one, minus one, one.",
        # 20
        "Slide that amount and the craft takes a different route every time, but always lands on the target.",
        # 21
        "SLOW|Every solution is one solution plus something from the null space. That sentence will run through "
        "the whole next chapter.",
        # ---- 8.3
        # 22
        "Remember changing address? It's two machine steps.",
        # 23
        "First, build the actual place from its old address: multiply by the old basis.",
        # 24
        "Then ask for its address in the new grid, which means undoing the new basis machine.",
        # 25
        "A machine you can undo is called invertible, and the undo machine is its inverse. So changing address "
        "is: build with B, then undo Q.",
        # 26
        "SLOW|In symbols: the place equals B times its B-address,",
        # 27
        "SLOW|and it also equals Q times its Q-address.",
        # 28
        "SLOW|Set those equal and undo Q, and the Q-address is Q inverse times B times the B-address.",
        # 29
        "Read it right to left: build, then translate.",
        # 30
        "SLOW|With our numbers, building from one, two in the blue-gold grid gives four, five,",
        # 31
        "SLOW|and translating into the teal grid gives three, two, exactly the address we found by hand.",
        # 32
        "In practice you never compute the inverse explicitly; you solve the equation, which is faster and "
        "more accurate.",
        # ---- 8.4
        # 33
        "Now the trick from the opening. To fine-tune a giant matrix, low-rank adapters don't train the whole "
        "thing.",
        # 34
        "They train a small update, written as a tall thin matrix L times a short wide one R.",
        # 35
        "Here's what you can now see. Each column of the update is L times some recipe: a mix of L's columns.",
        # 36
        "So every column of the update lives inside the span of just L's few columns.",
        # 37
        "If L has eight columns, the update has rank at most eight, however big the original matrix is.",
        # 38
        "That's why it's called low-rank, and why it's so cheap: you're only choosing directions inside a small "
        "room.",
        # 39
        "SLOW|Here's the argument in full. Column j of the update is L times column j of R, which is a recipe "
        "over L's eight columns.",
        # 40
        "SLOW|So every column of the update lies in the span of those eight columns, and the rank is at most "
        "eight.",
        # 41
        "SLOW|And look at the counts: L and R together have about sixty-five thousand numbers to train, instead "
        "of almost seventeen million.",
        # 42
        "That's the whole trick, and it's just span and rank.",
        # 43
        "SLOW|One careful note: it's the update that has rank at most eight, not the resulting weight matrix, "
        "which can still have full rank.",
        # 44
        "SLOW|And rank limits the number of independent directions the update can produce, not its size: a "
        "rank-one update can still be huge.",
        # 45
        "Training learns both the small room, through L, and the recipes inside it, through R.",
    ]

    # ------------------------------------------------------------------ helpers
    def new_plane(self):
        p = plane((-3, 6), (-2, 6), unit=0.6).to_edge(LEFT, buff=0.5).shift(DOWN * 0.35)
        return p

    def construct(self):
        grp, bar, header = section_card(self, "Act 8", "Machines made of arrows",
                                        "What is a matrix really doing?")
        self.say()
        self.until_end(0.8)
        self.header = to_header(self, grp, bar, header)
        self.act81()
        self.act82()
        self.act83()
        self.act84()
        self.done(1.0)
        self.clear_all()

    # ------------------------------------------------------------------ 8.1
    def act81(self):
        p = self.new_plane()
        self.p = p
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        tgt_l = M("(4, 5)", 24, C_W).next_to(tgt, RIGHT, buff=0.12)
        uarr = vec(p, *U, C_U, width=6)
        varr = vec(p, *V, C_V, width=6)
        a = ValueTracker(0.0)
        b = ValueTracker(0.0)
        ship = craft()
        ship.add_updater(lambda m: m.move_to(p.c2p(*(a.get_value() * U + b.get_value() * V))))

        # 1 — stand the moves up as columns: a matrix
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), run_time=1.0)
        self.play(GrowArrow(uarr), GrowArrow(varr), FadeIn(tgt), FadeIn(tgt_l), FadeIn(ship), run_time=1.0)
        cu = column_vec(["2", "1"], size=40, color=C_U).move_to(np.array([1.3, 1.9, 0]))
        cv = column_vec(["1", "2"], size=40, color=C_V).next_to(cu, RIGHT, buff=0.3)
        self.play(TransformFromCopy(uarr, cu), run_time=1.3)
        self.play(TransformFromCopy(varr, cv), run_time=1.3)
        Vm = mm([["2", "1"], ["1", "2"]], size=40, cols=[C_U, C_V])
        vlab = M("<i>V</i> =", 40)
        Vrow = row(vlab, Vm, buff=0.2).move_to(np.array([1.6, 1.9, 0]))
        self.play(ReplacementTransform(VGroup(cu, cv), Vm), FadeIn(vlab), run_time=1.0)
        mtag = T("matrix", 28, WHITE, weight=BOLD).next_to(Vm, DOWN, buff=0.3)
        self.play(Write(mtag), run_time=0.8)
        self.until_end()

        # 2 — the recipe as a column
        self.say()
        cvec = column_vec(["1", "2"], size=40, color=WHITE).next_to(Vm, RIGHT, buff=0.3)
        ctag = T("recipe c", 24, C_DIM).next_to(cvec, DOWN, buff=0.3)
        self.play(FadeIn(cvec, shift=LEFT * 0.2), FadeOut(mtag), FadeIn(ctag), run_time=0.9)
        self.until_end()

        # 3 — multiply = scale each column and add
        self.say()
        eqs = M("=", 40).next_to(cvec, RIGHT, buff=0.3)
        out = column_vec(["4", "5"], size=40, color=C_W).next_to(eqs, RIGHT, buff=0.3)
        b0, b1 = col_box(Vm, 0, C_U), col_box(Vm, 1, C_V)
        e0 = SurroundingRectangle(cvec.entries[0][0], color=C_U, buff=0.08, stroke_width=2.5)
        e1 = SurroundingRectangle(cvec.entries[1][0], color=C_V, buff=0.08, stroke_width=2.5)
        self.play(Create(b0), Create(e0), a.animate.set_value(1), run_time=1.4)
        self.play(Create(b1), Create(e1), b.animate.set_value(2), run_time=1.6)
        self.play(FadeIn(eqs), FadeIn(out, shift=LEFT * 0.2), Flash(tgt, color=C_W, line_length=0.25), run_time=1.0)
        cap = T("matrix × recipe = destination", 26, C_W).move_to(np.array([PX, 0.45, 0]))
        self.play(FadeOut(ctag), FadeIn(cap), run_time=0.7)
        self.until_end()
        self.prod = VGroup(vlab, Vm, cvec, eqs, out)
        self.Vm, self.cvec, self.out = Vm, cvec, out

        # 4 — mixing desk
        self.say()
        self.play(FadeOut(VGroup(b0, b1, e0, e1)), a.animate.set_value(0), b.animate.set_value(0), run_time=0.8)
        desk_bg = RoundedRectangle(width=6.2, height=3.55, corner_radius=0.15, stroke_color=C_DIM, stroke_width=1.5)
        desk_bg.set_fill("#161b24", 1).move_to(np.array([PX, -1.65, 0]))
        f1 = Fader(M("(2, 1)", 24, C_U), C_U, a, hi=3, height=1.9)
        f2 = Fader(M("(1, 2)", 24, C_V), C_V, b, hi=3, height=1.9)
        ch1 = VGroup(T("channel 1", 20, C_DIM), f1).arrange(DOWN, buff=0.12)
        ch2 = VGroup(T("channel 2", 20, C_DIM), f2).arrange(DOWN, buff=0.12)

        def meter():
            ov = a.get_value() * U + b.get_value() * V
            bars = VGroup()
            for k, val in enumerate(ov):
                h = max(0.02, 1.9 * val / 6)
                bar_ = Rectangle(width=0.36, height=h, stroke_width=0).set_fill(C_W, 0.85)
                bar_.move_to(np.array([PX + 2.05 + k * 0.62, -2.55 + h / 2, 0]))
                num = M(fmt(val), 22, C_W).next_to(np.array([PX + 2.05 + k * 0.62, -2.55, 0]), DOWN, buff=0.15)
                bars.add(bar_, num)
            return bars

        frame = Rectangle(width=1.35, height=2.0, stroke_color=C_DIM, stroke_width=1.2).move_to(
            np.array([PX + 2.36, -1.55, 0]))
        mixl = T("output (mix)", 20, C_DIM).next_to(frame, UP, buff=0.12)
        ch1.move_to(np.array([PX - 2.0, -1.62, 0]))
        ch2.move_to(np.array([PX - 0.4, -1.62, 0]))
        mtr = always_redraw(meter)
        self.play(FadeIn(desk_bg), run_time=0.5)
        self.play(FadeIn(ch1), FadeIn(ch2), run_time=0.8)
        self.play(FadeIn(frame), FadeIn(mixl), FadeIn(mtr), run_time=0.6)
        self.play(a.animate.set_value(1), run_time=1.4)
        self.play(b.animate.set_value(2), run_time=1.8)
        self.until_end()

        # 5 — it mixes its own columns
        self.say()
        self.play(Indicate(ch1, color=WHITE, scale_factor=1.04), run_time=0.8)
        self.play(Indicate(ch2, color=WHITE, scale_factor=1.04), run_time=0.8)
        self.play(Indicate(VGroup(frame, mixl), color=C_W, scale_factor=1.04), Flash(tgt, color=C_W, line_length=0.25),
                  run_time=1.0)
        self.until_end(0.5)
        mtr.clear_updaters()
        self.play(FadeOut(VGroup(desk_bg, ch1, ch2, frame, mixl, mtr, cap)), run_time=0.6)

        # 6 — precise column picture
        self.say()
        b0, b1 = col_box(Vm, 0, C_U), col_box(Vm, 1, C_V)
        vuv = M("<i>V</i> = [ <i>u</i>  <i>v</i> ],   <i>c</i> = (1, 2)", 30).move_to(np.array([PX, 0.6, 0]))
        l1 = M("<i>Vc</i> = 1·(2, 1) + 2·(1, 2)", 32)
        l2 = M("= (2, 1) + (2, 4) = (4, 5)", 32, C_W)
        cl = stack([l1, l2], top=-0.05, left=0.6, buff=0.25)
        l2.shift(RIGHT * 0.62)
        tg = precise_tag(vuv)
        self.play(Create(b0), Create(b1), FadeIn(tg), FadeIn(vuv), run_time=1.0)
        self.play(Write(l1), run_time=1.6)
        self.wait(0.6)
        self.play(Write(l2), run_time=1.4)
        self.play(Circumscribe(out, color=C_W), Indicate(tgt, color=C_W), run_time=1.0)
        self.until_end(1.2)

        # 7 — general form, shapes
        self.say()
        self.play(FadeOut(VGroup(vuv, l1, l2, tg)), run_time=0.5)
        g1 = M("<i>Vc</i> = [ <i>v</i><sub>1</sub> ⋯ <i>v<sub>k</sub></i> ] (<i>c</i><sub>1</sub>, …, <i>c<sub>k</sub></i>)", 30)
        g2 = M("= <i>c</i><sub>1</sub><i>v</i><sub>1</sub> + ⋯ + <i>c<sub>k</sub></i><i>v<sub>k</sub></i>", 30)
        gen = stack([g1, g2], top=0.65, left=0.6, buff=0.28)
        g2.shift(RIGHT * 0.62)
        tg = precise_tag(gen)
        shape = M("<i>V</i> is <i>n</i> × <i>k</i>:  <i>k</i> amounts in,  <i>n</i> coordinates out", 28, C_V)
        at(shape, y=-1.25)
        term = T("n × k matrix: k in, n out", 24, WHITE, weight=BOLD)
        at(term, y=-2.0)
        self.play(FadeIn(tg), Write(g1), run_time=1.6)
        self.play(Write(g2), run_time=1.2)
        self.wait(0.6)
        self.play(FadeIn(shape, shift=UP * 0.15), run_time=0.8)
        self.play(FadeIn(term), run_time=0.6)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(gen, tg, shape, term)), run_time=0.5)

        # 8 — row picture
        self.say()
        rb = row_box(Vm, 0, WHITE)
        cb = SurroundingRectangle(cvec, color=WHITE, buff=0.06, stroke_width=2.5)
        rp = col(T("each output entry = (row of V) · (recipe):", 22, C_DIM),
                 T("multiply entry by entry, then add", 22, C_DIM), buff=0.1)
        at(rp, y=0.55)
        self.play(FadeOut(b0), FadeOut(b1), run_time=0.3)
        self.play(Create(rb), Create(cb), run_time=0.9)
        self.play(FadeIn(rp), run_time=0.6)
        self.until_end(0.6)

        # 9 — row numbers
        self.say()
        r1 = M("row 1 · <i>c</i> = 2·1 + 1·2 = 4", 32)
        r2 = M("row 2 · <i>c</i> = 1·1 + 2·2 = 5", 32)
        rr = stack([r1, r2], top=-0.2, left=0.8, buff=0.3)
        o0 = SurroundingRectangle(out.entries[0][0], color=C_W, buff=0.08, stroke_width=2.5)
        o1 = SurroundingRectangle(out.entries[1][0], color=C_W, buff=0.08, stroke_width=2.5)
        self.play(Write(r1), Create(o0), run_time=1.4)
        self.wait(0.8)
        rb2 = row_box(Vm, 1, WHITE)
        self.play(ReplacementTransform(rb, rb2), ReplacementTransform(o0, o1), run_time=0.7)
        self.play(Write(r2), run_time=1.4)
        same = T("same answer ✓", 24, C_W).next_to(rr, DOWN, buff=0.3).align_to(rr, LEFT)
        self.play(FadeIn(same), run_time=0.5)
        self.until_end(1.2)

        # 10 — what it means vs how to compute
        self.say()
        self.play(FadeOut(VGroup(rb2, o1, cb, rp, rr, same)), run_time=0.5)
        k1 = P("<b>column picture</b>: what it <i>means</i>", 26, C_W)
        k2 = P("<b>row picture</b>: how to <i>compute</i> by hand", 26, C_DIM)
        kk = stack([k1, k2], top=0.4, left=0.8, buff=0.3)
        self.play(FadeIn(k1, shift=UP * 0.1), run_time=0.7)
        self.play(FadeIn(k2, shift=UP * 0.1), run_time=0.7)
        self.until_end(0.8)
        ship.clear_updaters()
        self.play(FadeOut(VGroup(kk, self.prod, p, home, tgt, tgt_l, uarr, varr, ship)), run_time=0.7)

    # ------------------------------------------------------------------ 8.2
    def act82(self):
        # 11 — every question in one line
        self.say()

        def mini_arrow(d, color, start=(0, 0), s=0.22):
            return Arrow(np.array([start[0] * s, start[1] * s, 0]),
                         np.array([(start[0] + d[0]) * s, (start[1] + d[1]) * s, 0]), buff=0, color=color,
                         stroke_width=4, tip_length=0.12, max_tip_length_to_length_ratio=0.3)

        ic1 = VGroup(mini_arrow(U, C_U), mini_arrow(2 * V, C_V, start=U),
                     Dot(np.array([4 * 0.22, 5 * 0.22, 0]), radius=0.07, color=C_W))
        patch = Polygon(*[np.array([x, y, 0]) for x, y in [(-0.2, -0.2), (1.1, -0.2), (1.1, 1.1), (-0.2, 1.1)]],
                        stroke_width=0).set_fill(C_P, 0.35)
        ic2 = VGroup(patch, mini_arrow(U, C_U), mini_arrow(V, C_V))
        ic3 = VGroup(mini_arrow(U, C_U), mini_arrow(V, C_V, start=U), mini_arrow(-W3, C_P, start=W3))
        ic4 = VGroup(mini_arrow(U, C_U), mini_arrow(V, C_V), mini_arrow(W3, C_P).set_opacity(0.45))
        icons = [ic1, ic2, ic3, ic4]
        qs = ["Can I reach the target?", "Everywhere I can reach", "Is there dead weight?",
              "How many directions really?"]
        fs = ["is there a recipe <i>c</i> with <i>Vc</i> = <i>T</i> ?",
              "the <b>column space</b> = span of the columns",
              "is there a <i>c</i> ≠ 0 with <i>Vc</i> = 0 ?",
              "<b>rank</b> = dim(column space)"]
        cards = VGroup()
        for k in range(4):
            ic = icons[k].copy()
            ic.scale_to_fit_height(0.85)
            qt = T(qs[k], 24, WHITE)
            ar = T("→", 26, C_DIM)
            ft = M(fs[k], 26, C_W if k else WHITE)
            ic.move_to(np.array([-5.6, 0, 0]))
            qt.move_to(np.array([-4.95 + qt.width / 2, 0, 0]))
            ar.move_to(np.array([-0.55, 0, 0]))
            ft.move_to(np.array([-0.1 + ft.width / 2, 0, 0]))
            g = VGroup(ic, qt, ar, ft)
            bx = RoundedRectangle(width=12.9, height=1.12, corner_radius=0.12, stroke_color=C_DIM,
                                  stroke_width=1.5).set_fill("#161b24", 1)
            bx.move_to(np.array([0.05, 0, 0]))
            card = VGroup(bx, g)
            card.move_to(np.array([0.05, 2.25 - 1.3 * k, 0]))
            cards.add(card)
        self.play(FadeIn(cards[0][0]), FadeIn(cards[0][1][0]), run_time=0.7)
        self.until_end()

        # 12–15 — one card per beat
        for k in range(4):
            if k:
                self.say()
                self.play(FadeIn(cards[k][0]), FadeIn(cards[k][1][0]), run_time=0.6)
            else:
                self.say()
            self.play(FadeIn(cards[k][1][1]), run_time=0.6)
            self.wait(1.0)
            self.play(GrowFromCenter(cards[k][1][2]), FadeIn(cards[k][1][3], shift=LEFT * 0.2), run_time=0.9)
            if k == 3:
                rk = M("rank(<i>V</i>) = dim(column space) ≤ min(<i>n</i>, <i>k</i>)", 30, C_W)
                at(rk, x=0.0, y=-2.85, w=12)
                tg = precise_tag(rk)
                self.play(FadeIn(tg), Write(rk), run_time=1.4)
            self.until_end(0.6)
        self.until_end(0.8)

        # reading hold: the three-column panel (PRECISE, shown in silence)
        self.play(FadeOut(cards), VGroup(rk, tg).animate.move_to(np.array([0, 2.3, 0])), run_time=0.8)
        M3 = mm([["2", "1", "3"], ["1", "2", "3"]], size=38, cols=[C_U, C_V, C_P])
        lab3 = M("[ <i>u</i>  <i>v</i>  <i>w</i> ] =", 34)
        r3 = row(lab3, M3, buff=0.25).move_to(np.array([-1.6, 0.8, 0]))
        facts = col(M("column space = ℝ<sup>2</sup>", 30, C_W), M("rank 2", 30, C_W),
                    T("though there are 3 columns", 24, C_DIM), buff=0.2).next_to(r3, RIGHT, buff=0.8)
        self.play(FadeIn(r3), run_time=0.8)
        self.play(FadeIn(facts, lag_ratio=0.3), run_time=1.2)
        self.wait(3.5)

        # 16 — round trip in, zero out; all multiples
        self.say()
        self.play(FadeOut(VGroup(facts, rk, tg)), r3.animate.move_to(np.array([0.6, 1.9, 0])), run_time=0.8)
        rt = column_vec(["1", "1", "−1"], size=34, color=WHITE).next_to(r3, RIGHT, buff=0.25)
        eq0 = M("=", 36).next_to(rt, RIGHT, buff=0.25)
        z0 = column_vec(["0", "0"], size=38, color=C_X).next_to(eq0, RIGHT, buff=0.25)
        rtl = M("<i>u</i> + <i>v</i> − <i>w</i> = 0", 28, C_DIM).next_to(VGroup(r3, z0), DOWN, buff=0.35)
        self.play(FadeIn(rt, shift=LEFT * 0.3), run_time=0.8)
        self.play(FadeIn(eq0), FadeIn(z0, scale=1.3), run_time=0.7)
        self.play(FadeIn(rtl), run_time=0.5)
        # recipe space (oblique 3-D sketch) with the line of silent recipes
        O = np.array([-3.0, -1.7, 0])
        s = 0.62
        X, Y, Z = np.array([1.0, 0, 0]), np.array([0.5, 0.42, 0]), np.array([0, 1.0, 0])

        def P3(x, y, z):
            return O + s * (x * X + y * Y + z * Z)

        axes = VGroup(*[Arrow(P3(*(-1.8 * e)), P3(*(1.8 * e)), buff=0, color="#5B6475", stroke_width=2,
                              tip_length=0.12) for e in np.eye(3)])
        axl = VGroup(M("<i>x</i>", 22, C_DIM).next_to(P3(1.8, 0, 0), RIGHT, buff=0.08),
                     M("<i>y</i>", 22, C_DIM).next_to(P3(0, 1.8, 0), UR, buff=0.04),
                     M("<i>z</i>", 22, C_DIM).next_to(P3(0, 0, 1.8), UP, buff=0.06))
        rsl = T("recipe space (x, y, z)", 20, C_DIM).move_to(O + np.array([0, 1.6, 0]))
        d = np.array([1.0, 1.0, -1.0])
        nline = Line(P3(*(-1.5 * d)), P3(*(1.5 * d)), color=C_X, stroke_width=4)
        ndots = VGroup(*[Dot(P3(*(t * d)), radius=0.06, color=C_X) for t in np.arange(-1.5, 1.51, 0.5)])
        rdot = Dot(P3(*d), radius=0.1, color=WHITE)
        rdl = M("(1, 1, −1)", 22).next_to(rdot, DL, buff=0.06)
        self.play(FadeIn(axes), FadeIn(axl), FadeIn(rsl), run_time=0.7)
        self.play(FadeIn(rdot, scale=1.5), FadeIn(rdl), run_time=0.5)
        self.play(Create(nline), LaggedStart(*[FadeIn(dd, scale=1.6) for dd in ndots], lag_ratio=0.15), run_time=1.5)
        sil = T("all multiples: silent recipes", 22, C_X).move_to(O + np.array([0, -1.55, 0]))
        self.play(FadeIn(sil), run_time=0.5)
        self.until_end()

        # 17 — null space (preview)
        self.say()
        ns = T("null space", 34, C_X, weight=BOLD).move_to(np.array([3.3, -1.2, 0]))
        nx = T("— next chapter", 24, C_DIM).next_to(ns, DOWN, buff=0.15)
        self.play(Write(ns), Indicate(nline, color=WHITE), run_time=1.0)
        self.play(FadeIn(nx), run_time=0.5)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(axes, axl, rsl, nline, ndots, rdot, rdl, sil, ns, nx, rt, eq0, z0, rtl, r3)),
                  run_time=0.7)

        # 18 — the family of recipes for the target
        p = self.new_plane()
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        tgt_l = M("(4, 5)", 24, C_W).next_to(tgt, RIGHT, buff=0.12)
        uarr, varr, warr = vec(p, *U, C_U, width=6), vec(p, *V, C_V, width=6), vec(p, *W3, C_P, width=6)
        self.say()
        self.play(FadeIn(p), FadeIn(home), FadeIn(tgt), FadeIn(tgt_l), GrowArrow(uarr), GrowArrow(varr),
                  GrowArrow(warr), run_time=1.0)
        d1 = M("<i>x</i>(2, 1) + <i>y</i>(1, 2) + <i>z</i>(3, 3) = (4, 5)", 28)
        d2 = M("2<i>x</i> + <i>y</i> + 3<i>z</i> = 4,   <i>x</i> + 2<i>y</i> + 3<i>z</i> = 5", 28)
        d3 = M("⇒  <i>x</i> = 1 − <i>z</i>,   <i>y</i> = 2 − <i>z</i>,   <i>z</i> free", 28, C_V)
        fam_a = M("(<i>x</i>, <i>y</i>, <i>z</i>) = (1, 2, 0)", 32, C_W)
        fam_b = M("+ <i>z</i>·(−1, −1, 1)", 32, C_X)
        famr = row(fam_a, fam_b, buff=0.18)
        der = stack([d1, d2, d3, famr], top=2.6, left=0.3, buff=0.32)
        tg = precise_tag(der).shift(DOWN * 0.02)
        fam_b.set_opacity(0)
        self.play(FadeIn(tg), Write(d1), run_time=1.3)
        self.play(FadeIn(d2, shift=DOWN * 0.1), run_time=0.9)
        self.wait(0.8)
        self.play(FadeIn(d3, shift=DOWN * 0.1), run_time=0.9)
        self.wait(0.6)
        self.play(Write(fam_a), run_time=1.0)
        pl = T("one particular recipe", 20, C_W).next_to(fam_a, DOWN, buff=0.15).align_to(fam_a, RIGHT)
        self.play(FadeIn(pl), run_time=0.5)
        self.until_end(0.6)

        # 19 — plus any amount of the round trip
        self.say()
        self.play(fam_b.animate.set_opacity(1), run_time=1.0)
        nl = T("a null-space recipe", 20, C_X).next_to(fam_b, DOWN, buff=0.15).align_to(fam_b, RIGHT)
        self.play(FadeIn(nl), run_time=0.5)
        self.until_end(1.2)

        # 20 — slide z: different routes, same destination
        self.say()
        zt = ValueTracker(0.0)

        def zr():
            return round(zt.get_value(), 1)

        def route():
            z = zt.get_value()
            x, y = 1 - z, 2 - z
            pts = [np.zeros(2), x * U, x * U + y * V, x * U + y * V + z * W3]
            cols = [C_U, C_V, C_P]
            g = VGroup()
            for k in range(3):
                if np.linalg.norm(pts[k + 1] - pts[k]) > 0.08:
                    g.add(vec_between(p, tuple(pts[k]), tuple(pts[k + 1]), color=cols[k], width=5))
            return g

        rte = always_redraw(route)
        fg = VGroup(famr, pl, nl)
        self.play(FadeOut(VGroup(d1, d2, d3, tg)), FadeOut(VGroup(uarr, varr, warr)),
                  fg.animate.move_to(np.array([fg.get_center()[0], 2.6 - fg.height / 2, 0])), run_time=0.8)
        zs = Slider("z", C_X, zt, lo=0, hi=2, length=3.0).move_to(np.array([PX + 0.2, 0.9, 0]))
        live = always_redraw(lambda: M(f"recipe ({fmt(1 - zr())}, {fmt(2 - zr())}, {fmt(zr())})  →  (4, 5)", 28)
                             .move_to(np.array([PX, 0.0, 0])))
        ship = craft().move_to(p.c2p(*TGT))
        self.add(rte)
        self.play(FadeIn(zs), FadeIn(live), FadeIn(ship), run_time=0.7)
        self.play(zt.animate.set_value(1), run_time=2.0)
        self.wait(0.4)
        self.play(zt.animate.set_value(2), run_time=2.0)
        self.wait(0.4)
        self.play(zt.animate.set_value(0.5), run_time=2.0)
        self.until_end()

        # 21 — every solution = one solution + null space
        self.say()
        bx = boxed(col(T("every solution =", 26, WHITE),
                       T("one solution + something from the null space", 24, C_X), buff=0.15), color=C_X)
        at(bx, y=-1.35)
        note = T("adding (−1, −1, 1) changes the route, not the destination", 20, C_DIM)
        at(note, y=-2.5)
        self.play(FadeIn(bx, shift=UP * 0.2), run_time=0.9)
        self.play(FadeIn(note), Circumscribe(fam_b, color=C_X), run_time=1.0)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(bx, note, zs, live, rte, ship, famr, pl, nl)), run_time=0.6)
        self.p, self.home, self.tgt, self.tgt_l = p, home, tgt, tgt_l

    # ------------------------------------------------------------------ 8.3
    def act83(self):
        p, tgt = self.p, self.tgt
        xr, yr = (-3, 6), (-2, 6)
        # 22 — two addresses for the same place
        self.say()
        gB = skew_grid(p, U, V, xr, yr, C_U, opacity=0.18)
        r1 = vec(p, *U, C_U, width=5)
        r2 = vec(p, *(2 * V), C_V, start=tuple(U), width=5)
        q1 = vec(p, *(3 * Q1), C_T, width=5)
        q2 = vec(p, *(2 * Q2), C_T, start=tuple(3 * Q1), width=5)
        la = M("[<i>T</i>]<sub><i>B</i></sub> = (1, 2)", 24, C_V).next_to(p.c2p(0.5, 2.6), LEFT, buff=0.05)
        lq = M("[<i>T</i>]<sub><i>Q</i></sub> = (3, 2)", 24, C_T).move_to(p.c2p(4.4, 0.9))
        self.play(FadeIn(gB), GrowArrow(r1), run_time=0.7)
        self.play(GrowArrow(r2), FadeIn(la), run_time=0.7)
        self.play(GrowArrow(q1), run_time=0.6)
        self.play(GrowArrow(q2), FadeIn(lq), run_time=0.6)
        bq = VGroup(M("<i>B</i> = [ <i>u</i>  <i>v</i> ]", 24, C_V), M("<i>Q</i> = [ (2, 1)  (−1, 1) ]", 24, C_T)).arrange(
            RIGHT, buff=0.6)
        at(bq, x=-3.9, y=-3.25, w=5.6)
        self.play(FadeIn(bq), run_time=0.5)
        # flow nodes
        n1 = boxed(M("(1, 2)", 28, C_V), color=C_V, buff=0.15)
        n2 = boxed(M("(4, 5)", 28, C_W), color=C_W, buff=0.15)
        n3 = boxed(M("(3, 2)", 28, C_T), color=C_T, buff=0.15)
        nodes = VGroup(n1, n2, n3).arrange(RIGHT, buff=1.3).move_to(np.array([PX, 2.15, 0]))
        cap1 = T("old address", 20, C_DIM).next_to(n1, DOWN, buff=0.12)
        cap2 = T("the place", 20, C_DIM).next_to(n2, DOWN, buff=0.12)
        cap3 = T("new address", 20, C_DIM).next_to(n3, DOWN, buff=0.12)
        self.play(FadeIn(n1), FadeIn(cap1), FadeIn(n3), FadeIn(cap3), run_time=0.7)
        self.until_end()

        # 23 — build: multiply by B
        self.say()
        a1 = Arrow(n1.get_right(), n2.get_left(), buff=0.1, color=WHITE, stroke_width=4, tip_length=0.18)
        a1l = M("× <i>B</i>", 24, C_V).next_to(a1, UP, buff=0.08)
        a1t = T("build", 20, C_DIM).next_to(a1, DOWN, buff=0.08)
        self.play(GrowArrow(a1), FadeIn(a1l), FadeIn(a1t), run_time=0.9)
        self.play(FadeIn(n2), FadeIn(cap2), Indicate(tgt, color=C_W), run_time=0.8)
        self.until_end()

        # 24 — read the new address: undo Q
        self.say()
        a2 = Arrow(n2.get_right(), n3.get_left(), buff=0.1, color=WHITE, stroke_width=4, tip_length=0.18)
        a2l = M("undo <i>Q</i>", 24, C_T).next_to(a2, UP, buff=0.08)
        a2t = T("read", 20, C_DIM).next_to(a2, DOWN, buff=0.08)
        self.play(GrowArrow(a2), FadeIn(a2l), FadeIn(a2t), run_time=0.9)
        self.play(Indicate(n3, color=C_T), run_time=0.8)
        self.until_end()

        # 25 — invertible / inverse; composite
        self.say()
        inv = VGroup(T("invertible", 26, WHITE, weight=BOLD), T("= a machine you can undo", 22, C_DIM)).arrange(
            RIGHT, buff=0.2)
        inv2 = VGroup(M("<i>Q</i><sup>−1</sup>", 28, C_T), T("= its inverse, the undo machine", 22, C_DIM)).arrange(
            RIGHT, buff=0.2)
        terms = stack([inv, inv2], top=0.9, left=0.4, buff=0.2)
        self.play(FadeIn(inv), run_time=0.7)
        a2l2 = M("<i>Q</i><sup>−1</sup>", 26, C_T).move_to(a2l)
        self.play(FadeIn(inv2), ReplacementTransform(a2l, a2l2), run_time=0.8)
        comp = M("[<i>T</i>]<sub><i>Q</i></sub> = <i>Q</i><sup>−1</sup> <i>B</i> [<i>T</i>]<sub><i>B</i></sub>", 34, C_W)
        at(comp, y=-0.45)
        self.play(Write(comp), run_time=1.2)
        self.until_end(1.2)

        # 26–28 — derivation, one line per beat
        self.play(FadeOut(VGroup(terms, comp)), run_time=0.5)
        D = [M("<i>v</i> = <i>B</i>[<i>v</i>]<sub><i>B</i></sub>", 32),
             M("<i>v</i> = <i>Q</i>[<i>v</i>]<sub><i>Q</i></sub>", 32),
             M("so  <i>Q</i>[<i>v</i>]<sub><i>Q</i></sub> = <i>B</i>[<i>v</i>]<sub><i>B</i></sub>", 32),
             M("so  [<i>v</i>]<sub><i>Q</i></sub> = <i>Q</i><sup>−1</sup> <i>B</i> [<i>v</i>]<sub><i>B</i></sub>", 34, C_W)]
        notes = [T("build from the B-address", 20, C_DIM), T("build from the Q-address", 20, C_DIM)]
        der = stack(D, top=0.85, left=0.5, buff=0.32)
        for k in range(2):
            notes[k].next_to(D[k], RIGHT, buff=0.5)
        tg = precise_tag(der)
        self.say()
        self.play(FadeIn(tg), Write(D[0]), run_time=1.0)
        self.play(FadeIn(notes[0]), run_time=0.5)
        self.until_end(0.8)
        self.say()
        self.play(Write(D[1]), FadeIn(notes[1]), run_time=1.0)
        self.until_end(0.8)
        self.say()
        self.play(TransformFromCopy(VGroup(D[0], D[1]), D[2]), run_time=1.2)
        self.wait(0.8)
        self.play(TransformFromCopy(D[2], D[3]), run_time=1.2)
        self.until_end(1.2)

        # 29 — right to left: build, then translate
        self.say()
        last = D[3]
        b_part = VGroup(*last[-5:])  # "B [v]_B"
        q_part = VGroup(*last[-8:-5])  # "Q^-1"
        ub = Line(b_part.get_corner(DL), b_part.get_corner(DR), color=C_V, stroke_width=3).shift(DOWN * 0.12)
        uq = Line(q_part.get_corner(DL), q_part.get_corner(DR), color=C_T, stroke_width=3).shift(DOWN * 0.12)
        bl = T("1 · build", 18, C_V).next_to(ub, DOWN, buff=0.1)
        ql = T("2 · translate", 18, C_T).next_to(uq, DOWN, buff=0.1)
        if ql.get_right()[0] > bl.get_left()[0] - 0.1:
            ql.next_to(bl, LEFT, buff=0.2)
        self.play(Create(ub), FadeIn(bl), run_time=0.8)
        self.play(Create(uq), FadeIn(ql), run_time=0.8)
        self.until_end(0.8)

        # 30 — numbers: build
        self.say()
        self.play(FadeOut(VGroup(D[0], D[1], D[2], notes[0], notes[1], ub, uq, bl, ql, tg)),
                  D[3].animate.scale(0.85).move_to(np.array([PX, 1.0, 0])), run_time=0.7)
        Bm = mm([["2", "1"], ["1", "2"]], size=28, cols=[C_U, C_V])
        nb = row(M("<i>B</i>[<i>T</i>]<sub><i>B</i></sub> =", 28), Bm, column_vec(["1", "2"], size=28),
                 M("=", 28), column_vec(["4", "5"], size=28, color=C_W), buff=0.18)
        at(nb, y=-0.1)
        self.play(FadeIn(nb[:3]), run_time=0.9)
        self.wait(0.6)
        self.play(FadeIn(nb[3:], shift=LEFT * 0.2), run_time=0.8)
        self.until_end(1.0)

        # 31 — translate: solve Q d = (4, 5)
        self.say()
        Qm = mm([["2", "−1"], ["1", "1"]], size=28, cols=[C_T, C_T])
        nq = row(M("solve", 26, C_DIM), Qm, M("<i>d</i> =", 28), column_vec(["4", "5"], size=28, color=C_W), buff=0.18)
        at(nq, y=-1.35)
        sq = M("2<i>d</i><sub>1</sub> − <i>d</i><sub>2</sub> = 4,  <i>d</i><sub>1</sub> + <i>d</i><sub>2</sub> = 5"
               "  ⇒  <i>d</i> = (3, 2) ✓", 26, C_T)
        at(sq, y=-2.35)
        self.play(FadeIn(nq), run_time=0.9)
        self.wait(0.6)
        self.play(Write(sq), run_time=1.4)
        self.play(Indicate(n3, color=C_T), Indicate(lq, color=C_T), run_time=0.9)
        self.until_end(1.2)

        # 32 — solve, don't invert
        self.say()
        note = boxed(M("in code: solve <i>Q d</i> = <i>B c</i>;  don't form <i>Q</i><sup>−1</sup>", 24, C_V), color=C_V,
                     buff=0.15)
        at(note, y=-3.25)
        self.play(FadeIn(note, shift=UP * 0.15), run_time=0.8)
        self.until_end(1.0)
        self.play(FadeOut(Group(*[m for m in self.mobjects if m is not self.header])), run_time=0.7)

    # ------------------------------------------------------------------ 8.4
    def act84(self):
        # 33 — the giant frozen matrix
        self.say()
        Wsq = Square(2.7, stroke_color=C_DIM, stroke_width=2).set_fill("#3a404c", 0.9)
        cells = VGroup(*[Line(Wsq.get_corner(UL) + RIGHT * x, Wsq.get_corner(DL) + RIGHT * x, stroke_width=0.6,
                              color="#4c5361") for x in np.linspace(0.15, 2.55, 17)])
        Wg = VGroup(Wsq, cells).move_to(np.array([-4.7, 0.6, 0]))
        Wl = T("W  (frozen)", 24, C_DIM).next_to(Wg, UP, buff=0.2)
        Ws = M("4096 × 4096", 24, C_DIM).next_to(Wg, DOWN, buff=0.18)
        self.play(FadeIn(Wg, scale=0.9), FadeIn(Wl), FadeIn(Ws), run_time=1.0)
        self.until_end()

        # 34 — the update ΔW = L R
        self.say()
        plus = M("+", 44).move_to(np.array([-2.85, 0.6, 0]))
        Lr = Rectangle(width=0.32, height=2.7, stroke_color=C_P, stroke_width=2.5).set_fill(C_P, 0.35)
        Rr = Rectangle(width=2.7, height=0.32, stroke_color=WHITE, stroke_width=2.5).set_fill(WHITE, 0.15)
        Lr.move_to(np.array([-2.15, 0.6, 0]))
        Rr.move_to(np.array([-0.15, 0.6 + 1.35 - 0.16, 0]))
        Ll = M("<i>L</i>", 28, C_P).next_to(Lr, UP, buff=0.15)
        Ls = M("4096 × 8", 22, C_P).next_to(Lr, DOWN, buff=0.18)
        Rl = M("<i>R</i>", 28, WHITE).next_to(Rr, UP, buff=0.15)
        Rs = M("8 × 4096", 22, WHITE).next_to(Rr, DOWN, buff=0.15)
        eq = M("=", 44).move_to(np.array([1.65, 0.6, 0]))
        dW = Square(2.7, stroke_color=C_W, stroke_width=2.5).set_fill(C_W, 0.12).move_to(np.array([3.4 + 0.15, 0.6, 0]))
        dWl = M("Δ<i>W</i> = <i>LR</i>", 28, C_W).next_to(dW, UP, buff=0.15)
        dWs = M("4096 × 4096", 22, C_W).next_to(dW, DOWN, buff=0.18)
        self.play(FadeIn(plus), FadeIn(Lr, shift=UP * 0.2), FadeIn(Ll), FadeIn(Ls), run_time=0.9)
        self.play(FadeIn(Rr, shift=LEFT * 0.2), FadeIn(Rl), FadeIn(Rs), run_time=0.9)
        self.play(FadeIn(eq), FadeIn(dW), FadeIn(dWl), FadeIn(dWs), run_time=0.9)
        self.until_end(0.6)

        # 35 — each column of ΔW is L times a recipe
        self.say()
        shapes = VGroup(Wg, Wl, Ws, plus, Lr, Ll, Ls, Rr, Rl, Rs, eq, dW, dWl, dWs)
        small = VGroup(Wg, plus, Lr, Rr, eq, dW)
        olds = VGroup(Wl, Ws, Ll, Ls, Rl, Rs, dWl, dWs)
        self.play(FadeOut(olds), run_time=0.3)
        self.play(small.animate.scale(0.62).move_to(np.array([0, 1.9, 0])), run_time=0.9)
        Wl = T("W (frozen)", 20, C_DIM).next_to(Wg, UP, buff=0.1)
        Ws = M("4096 × 4096", 20, C_DIM).next_to(Wg, DOWN, buff=0.1)
        Ll = M("<i>L</i>", 22, C_P).next_to(Lr, UP, buff=0.1)
        Ls = M("4096 × 8", 20, C_P).next_to(Lr, DOWN, buff=0.1)
        Rl = M("<i>R</i>", 22, WHITE).next_to(Rr, UP, buff=0.1)
        Rs = M("8 × 4096", 20, WHITE).next_to(Rr, DOWN, buff=0.1)
        dWl = M("Δ<i>W</i> = <i>LR</i>", 22, C_W).next_to(dW, UP, buff=0.1)
        dWs = M("4096 × 4096", 20, C_W).next_to(dW, DOWN, buff=0.1)
        self.play(FadeIn(VGroup(Wl, Ws, Ll, Ls, Rl, Rs, dWl, dWs)), run_time=0.5)
        jx = 0.6
        colR = Rectangle(width=0.08, height=Rr.height, stroke_width=0).set_fill(C_V, 1)
        colR.move_to(np.array([Rr.get_left()[0] + jx * Rr.width, Rr.get_center()[1], 0]))
        colW = Rectangle(width=0.08, height=dW.height, stroke_width=0).set_fill(C_V, 1)
        colW.move_to(np.array([dW.get_left()[0] + jx * dW.width, dW.get_center()[1], 0]))
        self.play(FadeIn(colW), run_time=0.6)
        self.play(FadeIn(colR), Indicate(Lr, color=WHITE), run_time=0.9)
        c1 = M("column <i>j</i> of Δ<i>W</i> = <i>L</i> × (column <i>j</i> of <i>R</i>)", 26)
        c2 = T("= a mix of L's columns", 24, C_P)
        cc = stack([c1, c2], top=0.2, left=0.4, buff=0.22)
        self.play(FadeIn(c1), run_time=0.8)
        self.play(FadeIn(c2), run_time=0.6)
        self.until_end()

        # 36 — the small room
        self.say()
        O = np.array([-3.6, -2.0, 0])
        ea, eb = np.array([1.4, -0.25, 0]), np.array([0.65, 0.6, 0])
        room = Polygon(O - 1.25 * ea - 1.25 * eb, O + 1.25 * ea - 1.25 * eb, O + 1.25 * ea + 1.25 * eb,
                       O - 1.25 * ea + 1.25 * eb, stroke_color=C_P, stroke_width=1.5).set_fill(C_P, 0.14)
        up_ax = DashedLine(O + DOWN * 1.2, O + UP * 2.1, color=C_DIM, stroke_width=1.5, dash_length=0.08)
        roomlab = T("span of L's columns: the room (8-dim, drawn as a plane)", 20, C_P)
        fit(roomlab, 6.0).move_to(np.array([-3.6, -3.55, 0]))
        Lc = VGroup(*[Arrow(O, O + v_, buff=0, color=C_P, stroke_width=5, tip_length=0.16)
                      for v_ in (0.95 * ea, 0.95 * eb, 0.55 * ea - 0.9 * eb)])
        rng = np.random.default_rng(7)
        dcols = VGroup()
        for _ in range(22):
            s1, s2 = rng.uniform(-1.15, 1.15, 2)
            dcols.add(Arrow(O, O + s1 * ea + s2 * eb, buff=0, color=C_W, stroke_width=2, tip_length=0.1,
                            max_tip_length_to_length_ratio=0.2).set_opacity(0.8))
        dlab = T("columns of ΔW", 20, C_W).move_to(O + np.array([2.75, 1.2, 0]))
        self.play(FadeIn(room), Create(up_ax), FadeIn(roomlab), run_time=0.8)
        self.play(LaggedStart(*[GrowArrow(a) for a in Lc], lag_ratio=0.2), run_time=0.9)
        self.play(LaggedStart(*[GrowArrow(a) for a in dcols], lag_ratio=0.06), FadeIn(dlab), run_time=2.0)
        self.until_end()

        # 37 — rank at most eight
        self.say()
        rk = M("rank(Δ<i>W</i>) ≤ 8", 36, C_W)
        at(rk, y=-1.3)
        rk2 = T("however big W is", 22, C_DIM).next_to(rk, DOWN, buff=0.18)
        self.play(Write(rk), run_time=1.0)
        self.play(FadeIn(rk2), run_time=0.5)
        self.until_end()

        # 38 — low-rank update
        self.say()
        lr = boxed(T("low-rank update  ΔW = LR", 28, C_W, weight=BOLD), color=C_W, buff=0.18)
        at(lr, y=-2.85)
        self.play(FadeIn(lr, shift=UP * 0.15), run_time=0.8)
        self.play(Indicate(room, color=C_P, scale_factor=1.03), run_time=1.0)
        self.until_end(0.8)

        # 39 — the argument in full
        self.say()
        self.play(FadeOut(VGroup(cc, rk, rk2, lr)), run_time=0.5)
        p1 = M("<i>L</i>: 4096 × 8,   <i>R</i>: 8 × 4096,   Δ<i>W</i>: 4096 × 4096", 24, C_DIM)
        p2 = M("Δ<i>W</i>[:, <i>j</i>] = <i>L</i> · <i>R</i>[:, <i>j</i>]", 28)
        p3 = M("= Σ<sub><i>k</i></sub> <i>R</i>[<i>k</i>, <i>j</i>] · <i>L</i>[:, <i>k</i>]", 28)
        p3n = T("a recipe over L's 8 columns", 20, C_P)
        pr = stack([p1, p2, p3], top=0.35, left=0.3, buff=0.25)
        p3.shift(RIGHT * 0.95)
        p3n.next_to(p3, DOWN, buff=0.1).align_to(p3, LEFT)
        tg = precise_tag(pr)
        self.play(FadeIn(tg), FadeIn(p1), run_time=0.7)
        self.play(Write(p2), run_time=1.1)
        self.wait(0.5)
        self.play(Write(p3), run_time=1.1)
        self.play(FadeIn(p3n), run_time=0.5)
        self.until_end(1.2)

        # 40 — column space inside the room, rank ≤ 8
        self.say()
        p4 = M("column space(Δ<i>W</i>) ⊆ span(columns of <i>L</i>)", 26)
        p5 = M("⇒  rank(Δ<i>W</i>) ≤ 8", 30, C_W)
        q = stack([p4, p5], top=-1.7, left=0.3, buff=0.22)
        self.play(Write(p4), Indicate(room, color=C_P, scale_factor=1.03), run_time=1.3)
        self.play(Write(p5), run_time=0.9)
        self.until_end(1.2)

        # 41 — the counts
        self.say()
        self.play(FadeOut(VGroup(p2, p3, p3n, p4, p5)), run_time=0.5)
        k1 = M("2 × 4096 × 8 = 65,536 to train", 30, C_W)
        k2 = M("vs  4096<sup>2</sup> ≈ 16.8 million", 30, C_DIM)
        kk = stack([k1, k2], top=-0.4, left=0.5, buff=0.3)
        self.play(Write(k1), Indicate(VGroup(Lr, Rr), color=WHITE), run_time=1.3)
        self.wait(0.6)
        self.play(Write(k2), Indicate(Wg, color=WHITE), run_time=1.3)
        self.until_end(1.2)

        # 42 — span and rank
        self.say()
        sr = T("just span and rank", 28, C_P, weight=BOLD)
        at(sr, y=-2.6)
        self.play(FadeIn(sr, shift=UP * 0.15), run_time=0.7)
        self.until_end(0.8)

        # 43 — the update is low-rank, not W + ΔW
        self.say()
        self.play(FadeOut(VGroup(p1, kk, sr, tg)), run_time=0.5)
        n1 = M("rank(Δ<i>W</i>) ≤ 8", 28, C_W)
        n2 = M("<i>W</i> + Δ<i>W</i> need not be low-rank", 28, WHITE)
        n2b = T("(it can still have full rank)", 20, C_DIM)
        nn = stack([n1, n2, n2b], top=0.3, left=0.4, buff=0.2)
        self.play(FadeIn(n1), Indicate(dW, color=C_W), run_time=0.8)
        self.play(FadeIn(n2), FadeIn(n2b), run_time=0.9)
        self.until_end(1.0)

        # 44 — directions, not size
        self.say()
        n3 = P("rank limits <b>directions</b>, not <b>size</b>", 28, C_V)
        n3.next_to(nn, DOWN, buff=0.4).align_to(nn, LEFT)
        self.play(FadeIn(n3), run_time=0.8)
        big = dcols[0].copy().set_opacity(1).set_stroke(width=5)
        end = big.get_end()
        dir_ = (end - O) / np.linalg.norm(end - O)
        huge = Arrow(O, O + dir_ * 3.6, buff=0, color=C_V, stroke_width=6, tip_length=0.2)
        hl = T("rank one, still huge", 20, C_V).next_to(huge.get_end(), UP, buff=0.1)
        if hl.get_right()[0] > -0.2:
            hl.shift(LEFT * (hl.get_right()[0] + 0.2))
        self.play(FadeIn(big), run_time=0.3)
        self.play(ReplacementTransform(big, huge), dcols.animate.set_opacity(0.25), FadeOut(dlab), run_time=1.4)
        self.play(FadeIn(hl), run_time=0.5)
        self.until_end(1.0)

        # 45 — both factors are trained
        self.say()
        self.play(FadeOut(VGroup(huge, hl)), dcols.animate.set_opacity(0.8), run_time=0.5)
        t1 = M("<i>L</i>  trained: learns the room", 26, C_P)
        t2 = M("<i>R</i>  trained: learns the recipes in it", 26, WHITE)
        tt = stack([t1, t2], top=-2.05, left=0.4, buff=0.2)
        self.play(FadeIn(t1), Indicate(Lr, color=C_P), Indicate(room, color=C_P, scale_factor=1.03), run_time=1.0)
        self.play(FadeIn(t2), Indicate(Rr, color=WHITE), run_time=1.0)
        cap = T("rank(ΔW) ≤ 8 limits directions, not size  ·  W + ΔW need not be low-rank  ·  L and R are both trained",
                20, C_DIM)
        cap.scale_to_fit_width(min(cap.width, 13.2)).move_to(np.array([0, -3.55, 0]))
        self.play(FadeOut(roomlab), FadeIn(cap), run_time=0.6)
