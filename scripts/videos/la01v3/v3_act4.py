"""LA01 v3 — Act 4: Addresses (basis, coordinates, standard basis, [v]_B, change of basis, ordered basis)."""
from common import *
from v3_act1 import dimmed, fmt  # noqa: F401

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
TGT = np.array([4.0, 5.0])
Q1 = np.array([2.0, 1.0])
Q2 = np.array([-1.0, 1.0])
E1 = np.array([1.0, 0.0])
E2 = np.array([0.0, 1.0])
C_Q = "#4DD0B0"          # the teal grid Q
STREET = "#55607A"
BOX = (-2, 6, -1, 6)     # plane extent, in plane coordinates
PX = 3.5                 # right-panel centre x


def fit(m, w=6.4):
    if m.width > w:
        m.scale_to_fit_width(w)
    return m


def _clip(p0, d, box=BOX):
    """Clip the infinite line p0 + t d to the box; return its two end points or None."""
    x0, x1, y0, y1 = box
    t0, t1 = -1e9, 1e9
    for pi, di, lo, hi in ((p0[0], d[0], x0, x1), (p0[1], d[1], y0, y1)):
        if abs(di) < 1e-9:
            if pi < lo - 1e-9 or pi > hi + 1e-9:
                return None
        else:
            a, b = (lo - pi) / di, (hi - pi) / di
            t0, t1 = max(t0, min(a, b)), min(t1, max(a, b))
    if t1 - t0 < 1e-6:
        return None
    return p0 + t0 * d, p0 + t1 * d


def lattice(p, b1, b2, c1=STREET, c2=STREET, width=2.0, opacity=0.8, K=16, box=BOX):
    """The street grid of basis (b1, b2): lines along b1 (colour c1) and along b2 (colour c2), clipped to the plane."""
    b1 = np.asarray(b1, float)
    b2 = np.asarray(b2, float)
    g = VGroup()
    for k in range(-K, K + 1):
        for base, d, c in ((k * b2, b1, c1), (k * b1, b2, c2)):
            seg = _clip(base, d, box)
            if seg is None:
                continue
            g.add(Line(p.c2p(*seg[0]), p.c2p(*seg[1]), color=c, stroke_width=width * (1.7 if k == 0 else 1),
                       stroke_opacity=opacity))
    return g


GRIDS = [(E1, E2, "#8A93A3", "#8A93A3"), (U, V, C_U, C_V), (Q1, Q2, C_Q, C_Q)]


def grid_at(s):
    """Interpolated basis and colours: s = 0 square, 1 blue/gold, 2 teal."""
    s = float(np.clip(s, 0, 2))
    i = min(int(s), 1)
    f = s - i
    a, b = GRIDS[i], GRIDS[i + 1]
    b1 = a[0] * (1 - f) + b[0] * f
    b2 = a[1] * (1 - f) + b[1] * f
    c1 = interpolate_color(ManimColor(a[2]), ManimColor(b[2]), f)
    c2 = interpolate_color(ManimColor(a[3]), ManimColor(b[3]), f)
    return b1, b2, c1, c2


def chip(markup, color=WHITE, size=26, fill=0.12):
    t = M(markup, size, color)
    r = RoundedRectangle(width=t.width + 0.35, height=t.height + 0.3, corner_radius=0.1,
                         stroke_color=color, stroke_width=2).set_fill(color, fill)
    return VGroup(r, t.move_to(r))


def machine(name, color):
    """A small labelled box: the 'trim' or 'grow' machine."""
    body = RoundedRectangle(width=1.7, height=1.05, corner_radius=0.14, stroke_color=color,
                            stroke_width=3).set_fill(color, 0.12)
    t = T(name, 26, color, weight=BOLD).move_to(body)
    teeth = VGroup(*[Square(0.12, stroke_width=0).set_fill(color, 0.8).move_to(body.get_top() + RIGHT * x + DOWN * 0.0)
                     for x in (-0.5, -0.17, 0.17, 0.5)])
    return VGroup(body, teeth, t)


def bg(m, buff=0.06, opacity=0.85):
    m.add_background_rectangle(color="#0e1116", opacity=opacity, buff=buff)
    return m


def mix(a, b, ca=C_U, cb=C_V):
    return f"(<span foreground='{ca}'>{a}</span>, <span foreground='{cb}'>{b}</span>)"


class V3Act4(NScene):
    BEATS = [
        # 0
        "Act four. Addresses.",
        # 1  (4.1)
        "Let's step back and ask what makes a set of controls genuinely good. Two things.",
        # 2
        "First, it should reach everywhere: its span is the whole space.",
        # 3
        "Second, it shouldn't carry dead weight: it's independent.",
        # 4
        "A set of moves with both properties is called a basis.",
        # 5
        "SLOW|Precisely: a list is a basis of a space if it spans the space and it's linearly independent.",
        # 6
        "SLOW|Spanning means enough arrows. Independence means not one too many.",
        # 7  (4.2)
        "Here's why that pair of properties matters so much. Think about how you give someone directions in a "
        "city with a street grid.",
        # 8
        "Three blocks east, two blocks north. Those two numbers are an address.",
        # 9
        "They work because the grid gives you two directions of streets, and a fixed block length along each.",
        # 10
        "A basis is exactly that: a street grid for your space.",
        # 11
        "Reaching everywhere means every place has an address.",
        # 12
        "No dead weight means no place has two different addresses.",
        # 13
        "Now make our blue and gold moves the streets. The city's grid tilts, because the streets aren't at "
        "right angles anymore. That's fine.",
        # 14
        "To reach the green target, walk one block along blue and two blocks along gold. So in this city, the "
        "target's address is one, two.",
        # 15  (4.3)
        "Why must the address be unique? Suppose some place had two different addresses.",
        # 16
        "Walk out using the first and back using the second, and you've made a round trip that really used "
        "the streets.",
        # 17
        "But that would be dead weight, and a basis has none. So two addresses for the same place can't happen.",
        # 18
        "Uniqueness falls straight out of independence, using the same round-trip trick from the last act.",
        # 19
        "SLOW|In symbols: subtract the two addresses.",
        # 20
        "SLOW|The difference of the amounts is a recipe for zero, and independence says every one of those "
        "differences must be zero. So the addresses were the same all along.",
        # 21
        "SLOW|It works backwards too. If every place has exactly one address, then in particular home has only "
        "the address all zeros, which is exactly what independence means.",
        # 22
        "So is a basis, and gives every point exactly one address, are the same statement. The chapter calls "
        "this Theorem eight.",
        # 23  (4.4)
        "When we wrote the target as four, five, we were secretly using an address system too: the ordinary "
        "square grid, with one street going east and one going north.",
        # 24
        "Those two moves are called the standard basis.",
        # 25
        "Now here's the idea I most want you to take from this act. Keep the place fixed and change the grid.",
        # 26
        "In the square grid, the address is four, five.",
        # 27
        "In the blue-and-gold grid, it's one, two.",
        # 28
        "In this third grid, it's three, two.",
        # 29
        "The place never moved. Only its description changed.",
        # 30
        "So these numbers describe the vector relative to a chosen basis. In R n the list four, five is itself "
        "a vector, but as an address it only means something together with the grid it was read from.",
        # 31
        "SLOW|The chapter writes this as v, in square brackets, with a little B underneath: the coordinates of v "
        "in basis B.",
        # 32
        "And translating one address into another, for the same place, is called a change of basis.",
        # 33
        "SLOW|Finding an address is solving for a recipe, exactly as in Act one. For the teal grid: two c one "
        "minus c two equals four, and c one plus c two equals five.",
        # 34
        "SLOW|Add the two equations and c two disappears: three c one equals nine,",
        # 35
        "SLOW|so c one is three, and then c two is two.",
        # 36
        "SLOW|Rebuild it to check: three of the first street and two of the second land on four, five.",
        # 37
        "So the same point has three different addresses: four, five in the standard grid, one, two in blue "
        "and gold, and three, two in teal.",
        # 38
        "One small detail. If you swap the order of the streets, the address swaps too. One, two becomes two, "
        "one.",
        # 39
        "So we always list the basis in a fixed order, and call it an ordered basis.",
        # 40  (4.5)
        "Where do bases come from? Two ways, and both use the dependence lemma from the last act.",
        # 41
        "If you have a list that reaches everything but has dead weight, walk along it and throw away every "
        "move you could already make from the ones you've kept.",
        # 42
        "What's left still reaches everything, and has no dead weight, so it's a basis.",
        # 43
        "Here, one, one stays.",
        # 44
        "Two, two is just twice that, so it goes.",
        # 45
        "One, zero is new, so it stays.",
        # 46
        "And zero, one is one, one minus one, zero, so it goes.",
        # 47
        "Every list that spans contains a basis.",
        # 48
        "And the reverse: if you have an independent list that doesn't reach everything yet, keep adding moves "
        "from the standard basis, skipping any that are already reachable.",
        # 49
        "Each new one adds a direction, and you stop when nothing is left out.",
        # 50
        "Every independent list can be extended to a basis.",
        # 51  (4.6)
        "This is not just bookkeeping.",
        # 52
        "When researchers say a model's features are a rotated copy of another model's features, or that a "
        "different basis reveals what a neuron means, they're talking about exactly this: the same arrows, "
        "described with different addresses.",
        # 53
        "Keeping the arrows separate from the numbers that describe them is what lets you even ask that question.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 4", "Addresses",
                                        "What makes a set of controls genuinely good?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)

        # ------------------------------------------------------------ 4.1 what we want
        self.say()  # 1
        XL, XR = -3.3, 3.3
        # icon 1: a filled plane reached by two arrows
        sq = Square(1.25, stroke_color=C_P, stroke_width=2).set_fill(C_P, 0.35)
        o = sq.get_corner(DL) + RIGHT * 0.15 + UP * 0.15
        ic1 = VGroup(sq, Arrow(o, o + RIGHT * 0.6 + UP * 0.3, buff=0, color=C_U, stroke_width=4, tip_length=0.12),
                     Arrow(o, o + RIGHT * 0.3 + UP * 0.6, buff=0, color=C_V, stroke_width=4, tip_length=0.12))
        # icon 2: a round trip, crossed out
        loop = Arc(radius=0.48, start_angle=PI * 0.6, angle=TAU * 0.8, color=C_DIM, stroke_width=4)
        loop.add_tip(tip_length=0.15, tip_width=0.15)
        cross = Line(UL * 0.55, DR * 0.55, color=C_X, stroke_width=6)
        ic2 = VGroup(loop, cross)
        h1 = VGroup(ic1, VGroup(T("reach everywhere", 30, WHITE, weight=BOLD),
                                T("its span is the whole space", 22, C_DIM)).arrange(DOWN, buff=0.15,
                                                                                     aligned_edge=LEFT))
        h1.arrange(RIGHT, buff=0.35)
        h2 = VGroup(ic2, VGroup(T("no dead weight", 30, WHITE, weight=BOLD),
                                T("it's independent", 22, C_DIM)).arrange(DOWN, buff=0.15, aligned_edge=LEFT))
        h2.arrange(RIGHT, buff=0.35)
        h1.move_to([XL, 1.9, 0])
        h2.move_to([XR, 1.9, 0])
        tick1 = T("✓", 44, C_W).next_to(h1, RIGHT, buff=0.25)
        tick2 = T("✓", 44, C_W).next_to(h2, RIGHT, buff=0.25)
        slots = VGroup(*[VGroup(Circle(0.55, stroke_color=C_DIM, stroke_width=2), T(n, 34, C_DIM))
                         for n in ("1", "2")])
        slots[0].move_to(ic1)
        slots[1].move_to(ic2)
        self.play(LaggedStart(*[FadeIn(sl, scale=0.8) for sl in slots], lag_ratio=0.4), run_time=1.0)
        self.until_end()

        self.say()  # 2
        self.play(FadeOut(slots[0]), FadeIn(h1[0], scale=0.8), run_time=0.7)
        self.play(FadeIn(h1[1], shift=RIGHT * 0.2), run_time=0.7)
        self.play(FadeIn(tick1, scale=1.6), run_time=0.5)
        self.until_end()

        self.say()  # 3
        self.play(FadeOut(slots[1]), Create(loop), run_time=0.8)
        self.play(Create(cross), FadeIn(h2[1], shift=RIGHT * 0.2), run_time=0.7)
        self.play(FadeIn(tick2, scale=1.6), run_time=0.5)
        self.until_end()

        self.say()  # 4
        badge = boxed(T("basis", 44, C_W, weight=BOLD), color=C_W, buff=0.22)
        badge.move_to([0, 0.35, 0])
        bsub = T("reaches everything, with no dead weight", 24, C_DIM).next_to(badge, RIGHT, buff=0.35)
        VGroup(badge, bsub).move_to([0, 0.35, 0])
        self.play(FadeIn(badge, scale=1.4), run_time=0.8)
        self.play(FadeIn(bsub), run_time=0.6)
        self.until_end()

        self.say()  # 5
        d0 = M("A list <i>B</i> = (<i>b</i><sub>1</sub>, …, <i>b<sub>n</sub></i>) is a <b>basis</b> of <i>V</i> if",
               30).move_to([0, -0.75, 0])
        d1 = M("(i)  span(<i>b</i><sub>1</sub>, …, <i>b<sub>n</sub></i>) = <i>V</i>", 30).move_to([XL, -1.6, 0])
        d2 = M("(ii)  <i>b</i><sub>1</sub>, …, <i>b<sub>n</sub></i> are linearly independent", 30)
        fit(d2, 6.4).move_to([XR, -1.6, 0])
        tagp = T("PRECISE", 18, C_V, weight=BOLD).next_to(d0, UP, buff=0.12).align_to(d0, LEFT)
        self.play(FadeIn(tagp), Write(d0), run_time=1.4)
        self.play(FadeIn(d1, shift=UP * 0.15), Indicate(h1[1][0], color=C_U), run_time=1.0)
        self.play(FadeIn(d2, shift=UP * 0.15), Indicate(h2[1][0], color=C_U), run_time=1.0)
        self.until_end(1.2)

        self.say()  # 6
        g1 = T("enough arrows", 26, C_U).next_to(d1, DOWN, buff=0.35)
        g2 = T("not one too many", 26, C_U).next_to(d2, DOWN, buff=0.35)
        self.play(FadeIn(g1, shift=UP * 0.1), Circumscribe(d1, color=C_U), run_time=1.0)
        self.wait(0.6)
        self.play(FadeIn(g2, shift=UP * 0.1), Circumscribe(d2, color=C_U), run_time=1.0)
        self.until_end(1.2)
        self.play(FadeOut(VGroup(h1, h2, tick1, tick2, badge, bsub, d0, d1, d2, g1, g2, tagp)), run_time=0.6)

        # ------------------------------------------------------------ 4.2 a city
        p = plane((-2, 6), (-1, 6), unit=0.66).to_edge(LEFT, buff=0.5).shift(DOWN * 0.25)
        p.background_lines.set_stroke(opacity=0.0)
        u = 0.66
        s = ValueTracker(0.0)
        streets = always_redraw(lambda: lattice(p, *grid_at(s.get_value()), width=3, opacity=0.85))
        rng = np.random.default_rng(4)
        blocks = VGroup()
        for i in range(-2, 6):
            for j in range(-1, 6):
                b = Square(u * 0.72, stroke_width=0).set_fill("#1A2130", 1).move_to(p.c2p(i + 0.5, j + 0.5))
                wins = VGroup(*[Square(0.05, stroke_width=0).set_fill("#F4D27A", rng.uniform(0.35, 0.9)).move_to(
                    b.get_center() + np.array([rng.uniform(-0.15, 0.15), rng.uniform(-0.15, 0.15), 0]))
                    for _ in range(int(rng.integers(1, 4)))])
                blocks.add(VGroup(b, wins))
        friend = VGroup(Circle(0.07, stroke_width=0).set_fill(WHITE, 1).shift(UP * 0.13),
                        RoundedRectangle(width=0.18, height=0.16, corner_radius=0.06, stroke_width=0)
                        .set_fill(WHITE, 1)).move_to(p.c2p(0, 0) + UP * 0.12)
        home_l = T("home", 20, C_DIM).next_to(p.c2p(0, 0), DL, buff=0.1)
        cafe_pt = p.c2p(3, 2)
        pin = VGroup(Triangle(stroke_width=0).set_fill(C_X, 1).rotate(PI).scale(0.12).move_to(cafe_pt + UP * 0.12),
                     Circle(0.14, stroke_width=0).set_fill(C_X, 1).move_to(cafe_pt + UP * 0.3),
                     Circle(0.05, stroke_width=0).set_fill("#0e1116", 1).move_to(cafe_pt + UP * 0.3))
        cafe_l = T("café", 20, C_X).next_to(pin, UR, buff=0.04)

        self.say()  # 7
        self.add(streets)
        self.play(FadeIn(p), FadeIn(streets), run_time=0.8)
        self.play(FadeIn(blocks, lag_ratio=0.01), run_time=1.2)
        self.play(FadeIn(friend, scale=0.6), FadeIn(home_l), run_time=0.6)
        self.play(FadeIn(pin, shift=DOWN * 0.3), FadeIn(cafe_l), run_time=0.7)
        self.until_end()

        self.say()  # 8
        bub_t = T("“3 blocks east, 2 blocks north”", 26)
        bub = RoundedRectangle(width=bub_t.width + 0.5, height=bub_t.height + 0.5, corner_radius=0.2,
                               stroke_color=WHITE, stroke_width=2).set_fill("#1A2130", 1)
        tail = Polygon(ORIGIN, RIGHT * 0.3, LEFT * 0.25 + DOWN * 0.35, stroke_color=WHITE, stroke_width=2) \
            .set_fill("#1A2130", 1)
        bubble = VGroup(tail, bub, bub_t)
        bub.move_to([PX, 2.0, 0])
        bub_t.move_to(bub)
        tail.next_to(bub, DOWN, buff=-0.05).align_to(bub, LEFT).shift(RIGHT * 0.4)
        self.play(FadeIn(bubble, shift=UP * 0.2), run_time=0.7)
        walker = Dot(p.c2p(0, 0), radius=0.09, color=C_X)
        wtrail = TracedPath(walker.get_center, stroke_color=C_X, stroke_width=5)
        self.add(wtrail, walker)
        self.play(walker.animate.move_to(p.c2p(3, 0)), run_time=1.5, rate_func=linear)
        self.play(walker.animate.move_to(p.c2p(3, 2)), run_time=1.0, rate_func=linear)
        addr = VGroup(T("address:", 26, C_DIM), M("(3, 2)", 34, C_X)).arrange(RIGHT, buff=0.25)
        addr.move_to([PX, 0.9, 0])
        self.play(FadeIn(addr, shift=UP * 0.15), run_time=0.6)
        self.until_end()

        self.say()  # 9
        ew = Line(p.c2p(-2, 0), p.c2p(6, 0), color=WHITE, stroke_width=6)
        ns = Line(p.c2p(0, -1), p.c2p(0, 6), color=WHITE, stroke_width=6)
        self.play(Create(ew), run_time=0.8)
        self.play(Create(ns), run_time=0.8)
        blk = VGroup(Line(p.c2p(4, 0), p.c2p(5, 0), color=C_V, stroke_width=9),
                     Line(p.c2p(4, -0.2), p.c2p(4, 0.2), color=C_V, stroke_width=4),
                     Line(p.c2p(5, -0.2), p.c2p(5, 0.2), color=C_V, stroke_width=4))
        blk_l = bg(T("1 block", 20, C_V)).next_to(blk, DOWN, buff=0.12)
        why = VGroup(T("two directions of streets", 26), T("+ a fixed block length along each", 26, C_V)) \
            .arrange(DOWN, buff=0.18, aligned_edge=LEFT).move_to([PX, -0.4, 0])
        self.play(FadeIn(why[0]), run_time=0.5)
        self.play(FadeIn(blk), FadeIn(blk_l), FadeIn(why[1]), run_time=0.8)
        self.until_end()
        self.play(FadeOut(VGroup(ew, ns, blk, blk_l)), run_time=0.4)

        self.say()  # 10
        self.play(FadeOut(VGroup(bubble, addr, why)), run_time=0.5)
        bt = T("a basis = a street grid", 32, C_W, weight=BOLD).move_to([PX, 1.9, 0])
        self.play(Write(bt), run_time=1.0)
        self.until_end()

        self.say()  # 11
        r1 = VGroup(T("reach everywhere", 26, WHITE, weight=BOLD), T("→  every place has an address", 26)) \
            .arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        r2 = VGroup(T("no dead weight", 26, WHITE, weight=BOLD), T("→  no place has two addresses", 26)) \
            .arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        VGroup(r1, r2).arrange(DOWN, buff=0.45, aligned_edge=LEFT).next_to(bt, DOWN, buff=0.6).set_x(PX)
        self.play(FadeIn(r1, shift=UP * 0.15), run_time=0.7)
        self.play(Flash(pin, color=C_X, line_length=0.2), run_time=0.7)
        self.until_end()

        self.say()  # 12
        self.play(FadeIn(r2, shift=UP * 0.15), run_time=0.7)
        self.until_end()

        self.say()  # 13
        self.play(FadeOut(VGroup(blocks, pin, cafe_l, friend, walker, r1, r2, bt)), run_time=0.7)
        self.remove(wtrail)
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        uarr = vec(p, *U, C_U, width=6)
        varr = vec(p, *V, C_V, width=6)
        ul = M("<i>u</i>", 28, C_U).next_to(uarr.get_end(), DR, buff=0.05)
        vl = M("<i>v</i>", 28, C_V).next_to(varr.get_end(), UL, buff=0.05)
        self.play(GrowArrow(uarr), GrowArrow(varr), FadeIn(ul), FadeIn(vl), FadeIn(home), run_time=1.0)
        self.play(s.animate.set_value(1), run_time=3.0)
        tilt = VGroup(T("streets along", 26), M("<i>u</i>", 30, C_U), T("and", 26), M("<i>v</i>", 30, C_V)) \
            .arrange(RIGHT, buff=0.15).move_to([PX, 1.9, 0])
        tilt2 = T("the grid tilts — that's fine", 24, C_DIM).next_to(tilt, DOWN, buff=0.2)
        self.play(FadeIn(tilt), FadeIn(tilt2), FadeIn(tgt, scale=2), run_time=0.8)
        self.until_end()

        self.say()  # 14
        leg1 = vec(p, *U, C_W, width=6)
        leg2 = vec(p, *(2 * V), C_W, start=tuple(U), width=6)
        l1 = T("1 block along blue", 24, C_U)
        l2 = T("2 blocks along gold", 24, C_V)
        VGroup(l1, l2).arrange(DOWN, buff=0.15, aligned_edge=LEFT).next_to(tilt2, DOWN, buff=0.4).set_x(PX)
        self.play(GrowArrow(leg1), FadeIn(l1), run_time=1.2)
        self.play(GrowArrow(leg2), FadeIn(l2), run_time=1.4)
        taddr = bg(M(mix(1, 2), 30)).next_to(tgt, RIGHT, buff=0.15)
        self.play(FadeIn(taddr, scale=1.3), run_time=0.6)
        term = VGroup(T("coordinates", 32, C_W, weight=BOLD),
                      T("the address: how many blocks", 22, C_DIM),
                      T("along each basis direction", 22, C_DIM)).arrange(DOWN, buff=0.12)
        term.move_to([PX, -1.0, 0])
        self.play(Write(term[0]), run_time=0.8)
        self.play(FadeIn(term[1:]), run_time=0.6)
        self.until_end()

        # ------------------------------------------------------------ 4.3 uniqueness
        self.say()  # 15
        self.play(FadeOut(VGroup(tilt, tilt2, term, l1, l2)), run_time=0.5)
        a1 = VGroup(T("address 1:", 26, C_DIM), M(mix(1, 2), 32)).arrange(RIGHT, buff=0.25)
        a2 = VGroup(T("address 2:", 26, C_DIM), M("(<i>x</i>, <i>y</i>)  ?", 32, C_X)).arrange(RIGHT, buff=0.25)
        VGroup(a1, a2).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([PX, 2.0, 0])
        self.play(FadeIn(a1), run_time=0.6)
        self.play(FadeIn(a2), run_time=0.6)
        self.until_end()

        self.say()  # 16
        back = ArcBetweenPoints(p.c2p(*TGT) + LEFT * 0.12, p.c2p(0, 0) + UP * 0.12, angle=PI / 2.6)
        back = DashedVMobject(back.set_stroke(C_X, 4), num_dashes=22)
        btip = Triangle(stroke_width=0).set_fill(C_X, 1).scale(0.1)
        btip.move_to(p.c2p(0, 0) + UP * 0.2).rotate(PI)
        back_l = bg(T("back by (x, y)?", 20, C_X)).move_to(p.c2p(-0.6, 4.6))
        self.play(Indicate(VGroup(leg1, leg2), color=WHITE), run_time=1.0)
        self.play(Create(back), FadeIn(btip), FadeIn(back_l), run_time=1.6)
        rt = M("round trip:  (1 − <i>x</i>)<i>u</i> + (2 − <i>y</i>)<i>v</i> = 0", 28).move_to([PX, 0.6, 0])
        fit(rt)
        self.play(Write(rt), run_time=1.4)
        self.until_end()

        self.say()  # 17
        dw = T("a basis has no dead weight", 24, C_DIM).next_to(rt, DOWN, buff=0.35)
        z = M("1 − <i>x</i> = 0,   2 − <i>y</i> = 0", 30).next_to(dw, DOWN, buff=0.25)
        same = M("so (<i>x</i>, <i>y</i>) = (1, 2): one address", 30, C_W).next_to(z, DOWN, buff=0.3)
        self.play(FadeIn(dw), run_time=0.5)
        self.play(Write(z), run_time=1.0)
        self.play(FadeIn(same, shift=UP * 0.1), FadeOut(VGroup(back, btip, back_l)), run_time=0.8)
        self.until_end()

        self.say()  # 18
        uq = boxed(T("uniqueness  ⇐  independence", 26, C_W), color=C_W, buff=0.18).next_to(same, DOWN, buff=0.4)
        uq.set_x(PX)
        uq2 = T("the round-trip trick from Act 3", 20, C_DIM).next_to(uq, DOWN, buff=0.15)
        self.play(FadeIn(uq, scale=1.1), FadeIn(uq2), run_time=0.8)
        self.until_end()

        # theorem, full width
        plane_grp = VGroup(p, home, home_l, tgt, uarr, varr, ul, vl, leg1, leg2, taddr)
        self.play(FadeOut(VGroup(a1, a2, rt, dw, z, same, uq, uq2)), FadeOut(plane_grp), FadeOut(streets), run_time=0.6)
        self.remove(streets)

        self.say()  # 19
        thm_h = T("Theorem 8", 24, C_V, weight=BOLD)
        thm_b = M("<i>B</i> is a basis   ⇔   every <i>v</i> ∈ <i>V</i> has <b>exactly one</b> representation  "
                  "<i>v</i> = <i>c</i><sub>1</sub><i>b</i><sub>1</sub> + ⋯ + <i>c<sub>n</sub></i><i>b<sub>n</sub></i>", 28)
        fit(thm_b, 12.6)
        thm = VGroup(thm_h, thm_b).arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to([0, 2.45, 0])
        div = Line([0, 1.55, 0], [0, -3.4, 0], color=C_DIM, stroke_width=1.5)
        LX, RX = -6.5, 0.4

        def ln(markup, size=26, color=WHITE):
            return M(markup, size, color)

        lh = T("⇒  (a basis gives one address)", 24, C_U, weight=BOLD)
        l_ex = ln("<i>existence:</i>  <i>B</i> spans, so some <i>c<sub>i</sub></i> work")
        l_u1 = ln("<i>uniqueness:</i>  Σ <i>c<sub>i</sub></i><i>b<sub>i</sub></i> = Σ <i>d<sub>i</sub></i><i>b<sub>i</sub></i>")
        l_u2 = ln("⇒  Σ (<i>c<sub>i</sub></i> − <i>d<sub>i</sub></i>) <i>b<sub>i</sub></i> = 0")
        l_u3 = ln("⇒  every <i>c<sub>i</sub></i> − <i>d<sub>i</sub></i> = 0   (independence)")
        l_u4 = ln("⇒  <i>c<sub>i</sub></i> = <i>d<sub>i</sub></i>", 28, C_W)
        left = VGroup(lh, l_ex, l_u1, l_u2, l_u3, l_u4).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        for m in left:
            fit(m, 6.0)
        left.move_to([0, 0, 0]).align_to([LX, 1.3, 0], UL)
        rh = T("⇐  (one address gives a basis)", 24, C_U, weight=BOLD)
        r_sp = ln("<i>spans:</i>  every <i>v</i> has a representation")
        r_i1 = ln("<i>independent:</i>  Σ <i>c<sub>i</sub></i><i>b<sub>i</sub></i> = 0 = Σ 0·<i>b<sub>i</sub></i>")
        r_i2 = ln("uniqueness at <i>v</i> = 0")
        r_i3 = ln("⇒  all <i>c<sub>i</sub></i> = 0", 28, C_W)
        right = VGroup(rh, r_sp, r_i1, r_i2, r_i3).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        for m in right:
            fit(m, 6.0)
        right.align_to([RX, 1.3, 0], UL)
        self.play(FadeIn(thm_h), Write(thm_b), run_time=2.0)
        self.play(Create(div), FadeIn(lh), run_time=0.6)
        self.play(FadeIn(l_ex, shift=UP * 0.1), run_time=0.7)
        self.play(FadeIn(l_u1, shift=UP * 0.1), run_time=0.8)
        self.play(TransformFromCopy(l_u1, l_u2), run_time=1.0)
        self.until_end(1.0)

        self.say()  # 20
        hl = SurroundingRectangle(l_u2, color=C_V, buff=0.08, stroke_width=2)
        self.play(Create(hl), run_time=0.6)
        self.play(FadeIn(l_u3, shift=UP * 0.1), hl.animate.become(SurroundingRectangle(l_u3, color=C_V, buff=0.08,
                                                                                      stroke_width=2)), run_time=1.0)
        self.wait(1.0)
        self.play(FadeIn(l_u4, shift=UP * 0.1), hl.animate.become(SurroundingRectangle(l_u4, color=C_V, buff=0.08,
                                                                                      stroke_width=2)), run_time=1.0)
        self.until_end(1.2)

        self.say()  # 21
        self.play(FadeIn(rh), FadeOut(hl), run_time=0.6)
        self.play(FadeIn(r_sp, shift=UP * 0.1), run_time=0.8)
        self.play(FadeIn(r_i1, shift=UP * 0.1), run_time=1.0)
        self.play(FadeIn(r_i2, shift=UP * 0.1), run_time=0.8)
        self.play(FadeIn(r_i3, shift=UP * 0.1), run_time=0.8)
        self.until_end(1.2)

        self.say()  # 22
        self.play(Circumscribe(thm_b, color=C_W), run_time=1.4)
        th8 = T("is a basis  =  every point has exactly one address", 26, C_W).move_to([0, -3.55, 0])
        self.play(FadeIn(th8, shift=UP * 0.1), run_time=0.7)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(thm, div, left, right, th8)), run_time=0.6)

        # ------------------------------------------------------------ 4.4 the standard grid is a choice
        s.set_value(1.0)
        streets = always_redraw(lambda: lattice(p, *grid_at(s.get_value()), width=2.2, opacity=0.75))
        self.say()  # 23
        self.add(streets)
        self.play(FadeIn(p), FadeIn(streets), FadeIn(home), FadeIn(home_l), FadeIn(uarr), FadeIn(varr), FadeIn(ul), FadeIn(vl),
                  FadeIn(tgt), run_time=0.8)
        e1a = vec(p, *E1, WHITE, width=6)
        e2a = vec(p, *E2, WHITE, width=6)
        e1l = M("<i>e</i><sub>1</sub>", 28).next_to(e1a.get_end(), DR, buff=0.05)
        e2l = M("<i>e</i><sub>2</sub>", 28).next_to(e2a.get_end(), UL, buff=0.05)
        self.play(s.animate.set_value(0), ReplacementTransform(uarr, e1a), ReplacementTransform(varr, e2a),
                  ReplacementTransform(ul, e1l), ReplacementTransform(vl, e2l), run_time=2.4)
        walkE = VGroup(DashedLine(p.c2p(0, 0), p.c2p(4, 0), color=WHITE, stroke_width=3, dash_length=0.1),
                       DashedLine(p.c2p(4, 0), p.c2p(4, 5), color=WHITE, stroke_width=3, dash_length=0.1))
        self.play(Create(walkE[0]), run_time=0.9)
        self.play(Create(walkE[1]), run_time=0.9)
        addrE = bg(M("(4, 5)", 30)).next_to(tgt, RIGHT, buff=0.15)
        sE = VGroup(T("4 blocks east, 5 north", 24)).move_to([PX, 2.1, 0])
        self.play(FadeIn(addrE), FadeIn(sE), run_time=0.6)
        self.until_end()

        self.say()  # 24
        sb = VGroup(T("standard basis", 32, C_W, weight=BOLD),
                    M("<i>e</i><sub>1</sub> = (1, 0),   <i>e</i><sub>2</sub> = (0, 1)", 30),
                    M("in ℝ<sup><i>n</i></sup>:  <i>e</i><sub>1</sub>, <i>e</i><sub>2</sub>, …, <i>e<sub>n</sub></i>",
                      26, C_DIM)).arrange(DOWN, buff=0.22).move_to([PX, 0.6, 0])
        self.play(Write(sb[0]), run_time=0.8)
        self.play(FadeIn(sb[1:]), Indicate(VGroup(e1a, e2a), color=C_W), run_time=1.0)
        self.until_end()

        self.say()  # 25
        self.play(FadeOut(VGroup(sb, sE, walkE)), run_time=0.5)
        fx = T("keep the place fixed · change the grid", 28, C_W).move_to([PX, 2.3, 0])
        fit(fx)
        self.play(FadeIn(fx), Flash(tgt, color=C_W, line_length=0.25), run_time=1.0)
        self.until_end()

        rows = VGroup()

        def addr_row(name, val_markup, color):
            r = VGroup(T(name, 26, color), M(val_markup, 32)).arrange(RIGHT, buff=0.3)
            return r

        self.say()  # 26
        rE = addr_row("square grid", "(4, 5)", WHITE)
        rE.move_to([PX, 1.2, 0])
        self.play(FadeIn(rE), Indicate(addrE, color=WHITE), run_time=0.8)
        self.until_end()

        self.say()  # 27
        addrB = bg(M(mix(1, 2), 30)).next_to(tgt, RIGHT, buff=0.15)
        uarr2 = vec(p, *U, C_U, width=6)
        varr2 = vec(p, *V, C_V, width=6)
        self.play(s.animate.set_value(1), FadeOut(addrE), ReplacementTransform(e1a, uarr2),
                  ReplacementTransform(e2a, varr2), FadeOut(VGroup(e1l, e2l)), run_time=1.5)
        walkB = VGroup(DashedLine(p.c2p(0, 0), p.c2p(*U), color=WHITE, stroke_width=3, dash_length=0.1),
                       DashedLine(p.c2p(*U), p.c2p(*TGT), color=WHITE, stroke_width=3, dash_length=0.1))
        rB = addr_row("blue/gold grid", mix(1, 2), C_V).next_to(rE, DOWN, buff=0.35)
        rB.align_to(rE, LEFT)
        self.play(Create(walkB), FadeIn(addrB), FadeIn(rB), run_time=0.8)
        self.until_end()

        self.say()  # 28
        q1a = vec(p, *Q1, C_Q, width=6)
        q2a = vec(p, *Q2, C_Q, width=6)
        addrQ = bg(M("(3, 2)", 30, C_Q)).next_to(tgt, RIGHT, buff=0.15)
        self.play(s.animate.set_value(2), FadeOut(addrB), FadeOut(walkB), ReplacementTransform(uarr2, q1a),
                  ReplacementTransform(varr2, q2a), run_time=1.5)
        walkQ = VGroup(DashedLine(p.c2p(0, 0), p.c2p(*(3 * Q1)), color=WHITE, stroke_width=3, dash_length=0.1),
                       DashedLine(p.c2p(*(3 * Q1)), p.c2p(*TGT), color=WHITE, stroke_width=3, dash_length=0.1))
        rQ = addr_row("teal grid", "<span foreground='%s'>(3, 2)</span>" % C_Q, C_Q).next_to(rB, DOWN, buff=0.35)
        rQ.align_to(rE, LEFT)
        self.play(Create(walkQ), FadeIn(addrQ), FadeIn(rQ), run_time=0.8)
        self.until_end()

        self.say()  # 29
        self.play(FadeOut(walkQ), run_time=0.4)
        nm = T("same place · three descriptions", 26, C_W).next_to(rQ, DOWN, buff=0.5).set_x(PX)
        self.play(Indicate(tgt, color=C_W, scale_factor=1.8), FadeIn(nm), run_time=1.2)
        self.until_end()
        self.wait(3)

        self.say()  # 30
        self.play(FadeOut(VGroup(fx, rE, rB, rQ, nm)), run_time=0.5)
        rel = VGroup(T("coordinates describe the vector", 26),
                     T("relative to a chosen basis", 26, C_V)).arrange(DOWN, buff=0.12).move_to([PX, 2.2, 0])
        self.play(FadeIn(rel), run_time=0.8)
        rn = VGroup(T("in ℝⁿ, (4, 5) is itself a vector —", 24, C_DIM),
                    T("as an address, it needs its grid", 24, C_DIM)).arrange(DOWN, buff=0.1)
        rn.next_to(rel, DOWN, buff=0.35)
        self.wait(1.5)
        self.play(FadeIn(rn), run_time=0.8)
        self.until_end()

        self.say()  # 31
        vb = M("[<i>v</i>]<sub><i>B</i></sub>", 54, C_W).move_to([PX - 1.6, -0.1, 0])
        vbt = VGroup(T("coordinate vector", 28, C_W, weight=BOLD),
                     T("the coordinates of v in basis B", 22, C_DIM)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        vbt.next_to(vb, RIGHT, buff=0.4)
        self.play(Write(vb), run_time=1.2)
        self.play(FadeIn(vbt), run_time=0.7)
        self.until_end()

        self.say()  # 32
        cob = VGroup(M("(4, 5)", 30), M("→", 30, C_DIM), M(mix(1, 2), 30), M("→", 30, C_DIM),
                     M("(3, 2)", 30, C_Q)).arrange(RIGHT, buff=0.25)
        cobt = T("change of basis", 30, C_W, weight=BOLD)
        cobs = T("same place, translated address", 22, C_DIM)
        cg = VGroup(cobt, cob, cobs).arrange(DOWN, buff=0.2).move_to([PX, -1.95, 0])
        self.play(Write(cobt), run_time=0.7)
        self.play(LaggedStart(*[FadeIn(m, shift=RIGHT * 0.15) for m in cob], lag_ratio=0.3), run_time=1.4)
        self.play(FadeIn(cobs), run_time=0.5)
        self.until_end()

        self.say()  # 33
        self.play(FadeOut(VGroup(rel, rn, vb, vbt, cg)), run_time=0.5)
        c1 = "<i>c</i><sub>1</sub>"
        c2 = "<i>c</i><sub>2</sub>"
        ve = M(f"{c1}(2, 1) + {c2}(−1, 1) = (4, 5)", 30).move_to([PX, 2.3, 0])
        eA = M(f"2{c1} − {c2} = 4", 30, C_Q)
        eB = M(f"{c1} + {c2} = 5", 30, C_Q)
        es = VGroup(eA, eB).arrange(DOWN, buff=0.22, aligned_edge=LEFT).next_to(ve, DOWN, buff=0.4)
        tagp = T("PRECISE", 18, C_V, weight=BOLD).next_to(ve, UP, buff=0.12).align_to(ve, LEFT)
        self.play(FadeIn(tagp), Write(ve), run_time=1.4)
        self.play(FadeIn(eA, shift=DOWN * 0.1), run_time=0.8)
        self.wait(0.6)
        self.play(FadeIn(eB, shift=DOWN * 0.1), run_time=0.8)
        self.until_end(1.2)

        self.say()  # 34
        add = M(f"add:  3{c1} = 9", 30).next_to(es, DOWN, buff=0.35).align_to(es, LEFT)
        hl = SurroundingRectangle(es, color=C_V, buff=0.1, stroke_width=2)
        self.play(Create(hl), run_time=0.6)
        self.play(TransformFromCopy(es, add), run_time=1.2)
        self.until_end(1.0)

        self.say()  # 35
        res = M(f"{c1} = 3,   {c2} = 2", 32, C_W).next_to(add, DOWN, buff=0.3).align_to(es, LEFT)
        self.play(FadeOut(hl), Write(res), run_time=1.2)
        self.until_end(1.2)

        self.say()  # 36
        k1 = M("3(2, 1) + 2(−1, 1)", 30)
        k2 = M("= (6 − 2, 3 + 2)", 30)
        k3 = M("= (4, 5)  ✓", 30, C_W)
        chk = VGroup(k1, k2, k3).arrange(DOWN, buff=0.18, aligned_edge=LEFT).next_to(res, DOWN, buff=0.4)
        chk.align_to(es, LEFT)
        rebuild = VGroup(vec(p, *(3 * Q1), C_Q, width=5), vec(p, *(2 * Q2), C_Q, start=tuple(3 * Q1), width=5))
        self.play(Write(k1), GrowArrow(rebuild[0]), run_time=1.2)
        self.play(Write(k2), GrowArrow(rebuild[1]), run_time=1.2)
        self.play(Write(k3), run_time=0.9)
        self.until_end(1.2)

        self.say()  # 37
        self.play(FadeOut(VGroup(eA, eB, add, chk, rebuild)), res.animate.next_to(ve, DOWN, buff=0.35).set_x(PX),
                  run_time=0.6)
        sm = VGroup(M("[<i>T</i>]<sub><i>E</i></sub> = (4, 5)", 32),
                    M(f"[<i>T</i>]<sub><i>B</i></sub> = {mix(1, 2)}", 32),
                    M("[<i>T</i>]<sub><i>Q</i></sub> = <span foreground='%s'>(3, 2)</span>" % C_Q, 32))
        sm.arrange(DOWN, buff=0.28, aligned_edge=LEFT).next_to(res, DOWN, buff=0.55).set_x(PX)
        smt = VGroup(T("standard", 22, C_DIM), T("blue/gold", 22, C_DIM), T("teal", 22, C_DIM))
        for t, m in zip(smt, sm):
            t.next_to(m, RIGHT, buff=0.4)
        self.play(FadeIn(sm[2]), FadeIn(smt[2]), run_time=0.6)
        self.play(FadeIn(sm[0]), FadeIn(smt[0]), FadeIn(sm[1]), FadeIn(smt[1]), run_time=0.8)
        self.play(Circumscribe(sm, color=C_W), run_time=1.2)
        self.until_end()

        self.say()  # 38
        self.play(FadeOut(VGroup(ve, res, tagp, sm, smt, addrQ)), run_time=0.5)
        uarr3 = vec(p, *U, C_U, width=6)
        varr3 = vec(p, *V, C_V, width=6)
        self.play(s.animate.set_value(1), ReplacementTransform(q1a, uarr3), ReplacementTransform(q2a, varr3),
                  run_time=1.6)
        sw1 = VGroup(M(f"(<span foreground='{C_U}'><i>u</i></span>, <span foreground='{C_V}'><i>v</i></span>)",
                       32), M("→", 30, C_DIM), M("(1, 2)", 32)).arrange(RIGHT, buff=0.3)
        sw2 = VGroup(M(f"(<span foreground='{C_V}'><i>v</i></span>, <span foreground='{C_U}'><i>u</i></span>)",
                       32), M("→", 30, C_DIM), M("(2, 1)", 32)).arrange(RIGHT, buff=0.3)
        sws = VGroup(boxed(sw1, color=C_DIM, buff=0.2), boxed(sw2, color=C_X, buff=0.2)).arrange(DOWN, buff=0.4)
        sws.move_to([PX, 1.2, 0])
        om = T("order matters", 26, C_X).next_to(sws, UP, buff=0.3)
        self.play(FadeIn(om), FadeIn(sws[0]), run_time=0.8)
        self.wait(0.8)
        self.play(TransformFromCopy(sws[0], sws[1]), run_time=1.2)
        self.until_end()

        self.say()  # 39
        ob = VGroup(T("ordered basis", 32, C_W, weight=BOLD),
                    T("a basis listed in a fixed order", 22, C_DIM)).arrange(DOWN, buff=0.15)
        ob.next_to(sws, DOWN, buff=0.6)
        self.play(Write(ob[0]), run_time=0.8)
        self.play(FadeIn(ob[1]), run_time=0.5)
        self.until_end(0.8)
        self.play(FadeOut(VGroup(om, sws, ob, p, home, home_l, tgt, uarr3, varr3)), FadeOut(streets), run_time=0.7)
        self.remove(streets)

        # ------------------------------------------------------------ 4.5 trim and grow
        self.say()  # 40
        trim = machine("TRIM", C_U).move_to([0, 1.55, 0])
        grow = machine("GROW", C_W).move_to([0, -1.75, 0])
        trim_t = T("a spanning list  →  a basis", 24, C_U).next_to(trim, UP, buff=0.25)
        grow_t = T("an independent list  →  a basis", 24, C_W).next_to(grow, UP, buff=0.25)
        lem = T("both use the dependence lemma (Act 3)", 22, C_DIM).to_corner(UR, buff=0.4)
        self.play(FadeIn(trim), FadeIn(trim_t), run_time=0.7)
        self.play(FadeIn(grow), FadeIn(grow_t), run_time=0.7)
        self.play(FadeIn(lem), run_time=0.5)
        self.until_end()

        self.say()  # 41
        ins = [chip("(1, 1)"), chip("(2, 2)"), chip("(1, 0)"), chip("(0, 1)")]
        inrow = VGroup(*ins).arrange(RIGHT, buff=0.2).move_to([-4.6, 1.55, 0])
        kept_l = T("kept:", 22, C_DIM).move_to([2.1, 1.55, 0])
        rule = T("throw away any move you can already make from the kept ones", 22, C_DIM)
        rule.move_to([0, 0.55, 0])
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.2) for c in ins], lag_ratio=0.2), run_time=1.2)
        self.play(FadeIn(kept_l), FadeIn(rule), run_time=0.7)
        self.until_end()

        self.say()  # 42
        left_t = T("what's left: still spans, no dead weight", 22, C_U).next_to(rule, DOWN, buff=0.12)
        self.play(FadeIn(left_t), run_time=0.7)
        self.until_end()
        self.play(FadeOut(VGroup(rule, left_t)), run_time=0.4)

        kept = VGroup()
        verdict = None
        steps = [("new direction  →  keep", True),
                 ("= 2·(1, 1)  →  discard", False),
                 ("new direction  →  keep", True),
                 ("= (1, 1) − (1, 0)  →  discard", False)]
        for i, (txt, keep) in enumerate(steps):
            self.say()  # 43..46
            c = ins[i]
            self.play(c.animate.move_to(trim.get_left() + LEFT * 1.05), trim[0].animate.set_fill(
                C_U, 0.3), run_time=0.7)
            v = M(txt, 26, C_W if keep else C_X).move_to([0, 0.55, 0])
            if verdict is not None:
                self.play(FadeOut(verdict), run_time=0.2)
            self.play(FadeIn(v), run_time=0.5)
            verdict = v
            if keep:
                anchor = kept[-1] if len(kept) else kept_l
                kept.add(c)
                dest = c.copy().next_to(anchor, RIGHT, buff=0.25)
                self.play(c.animate.move_to(dest), trim[0].animate.set_fill(C_U, 0.12), run_time=0.8)
            else:
                self.play(c[0].animate.set_stroke(C_X).set_fill(C_X, 0.2), c[1].animate.set_color(C_X), run_time=0.4)
                self.play(c.animate.shift(DOWN * 0.9).fade(1), trim[0].animate.set_fill(C_U, 0.12),
                          run_time=0.8)
                self.remove(c)
            self.until_end()

        self.say()  # 47
        res_b = M("basis:  (1, 1), (1, 0)", 28, C_U).move_to([0, 0.55, 0])
        self.play(FadeOut(verdict), run_time=0.2)
        self.play(FadeIn(res_b), Circumscribe(kept, color=C_U), run_time=1.0)
        t1 = T("every spanning list contains a basis", 24, C_W)
        t2 = T("every independent list extends to one", 24, C_W)
        tl = VGroup(t1, T("·", 24, C_DIM), t2).arrange(RIGHT, buff=0.25).move_to([0, -3.45, 0])
        fit(tl, 13.0)
        self.play(FadeIn(t1), run_time=0.6)
        self.until_end()

        self.say()  # 48
        gk_l = T("kept:", 22, C_DIM).move_to([2.1, -1.75, 0])
        g0 = chip("(0, 1, 1)", C_W)
        g0.next_to(gk_l, RIGHT, buff=0.3)
        cands = [chip("<i>e</i><sub>1</sub> = (1, 0, 0)", size=22), chip("<i>e</i><sub>2</sub> = (0, 1, 0)", size=22),
                 chip("<i>e</i><sub>3</sub> = (0, 0, 1)", size=22)]
        crow = VGroup(*cands).arrange(DOWN, buff=0.12).move_to([-5.0, -1.75, 0])
        self.play(FadeIn(gk_l), FadeIn(g0, shift=LEFT * 0.2), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.2) for c in cands], lag_ratio=0.25), run_time=1.2)
        gr = T("add standard moves, skipping any already reachable", 22, C_DIM).move_to([0, -2.9, 0])
        self.play(FadeIn(gr), run_time=0.6)
        self.until_end()

        self.say()  # 49
        self.play(FadeOut(gr), run_time=0.3)
        gkept = VGroup(g0)
        gsteps = [("new direction  →  append", True), ("new direction  →  append", True),
                  ("(0, 0, 1) = (0, 1, 1) − e₂  →  skip", False)]
        gv = None
        for i, (txt, keep) in enumerate(gsteps):
            c = cands[i]
            self.play(c.animate.next_to(grow, LEFT, buff=0.3), grow[0].animate.set_fill(C_W, 0.3), run_time=0.5)
            v = M(txt, 24, C_W if keep else C_X).move_to([0, -2.9, 0])
            if gv is not None:
                self.play(FadeOut(gv), run_time=0.15)
            self.play(FadeIn(v), run_time=0.35)
            gv = v
            if keep:
                small = chip(["<i>e</i><sub>1</sub>", "<i>e</i><sub>2</sub>"][i], C_W)
                small.next_to(gkept, RIGHT, buff=0.2)
                self.play(ReplacementTransform(c, small), grow[0].animate.set_fill(C_W, 0.12), run_time=0.6)
                gkept.add(small)
            else:
                self.play(c[0].animate.set_stroke(C_X).set_fill(C_X, 0.2), c[1].animate.set_color(C_X), run_time=0.3)
                self.play(c.animate.shift(DOWN * 0.6).fade(1), grow[0].animate.set_fill(C_W, 0.12), run_time=0.6)
                self.remove(c)
        self.until_end()

        self.say()  # 50
        self.play(FadeOut(gv), run_time=0.2)
        gres = M("basis:  (0, 1, 1), <i>e</i><sub>1</sub>, <i>e</i><sub>2</sub>", 28, C_W).move_to([0, -2.9, 0])
        self.play(FadeIn(gres), Circumscribe(gkept, color=C_W), run_time=1.0)
        self.play(FadeIn(tl[1]), FadeIn(t2), run_time=0.6)
        self.until_end(1.0)
        self.play(FadeOut(VGroup(trim, grow, trim_t, grow_t, lem, kept, kept_l, res_b, gk_l, gkept, gres, tl)),
                  run_time=0.6)

        # ------------------------------------------------------------ 4.6 why it matters
        self.say()  # 51
        rngx = np.random.default_rng(11)
        x6 = rngx.normal(0, 1, 6)
        th = ValueTracker(0.0)

        def rotated():
            t = th.get_value()
            c_, s_ = np.cos(t), np.sin(t)
            y = x6.copy()
            for k in (0, 2, 4):
                a_, b_ = x6[k], x6[k + 1]
                y[k], y[k + 1] = c_ * a_ + s_ * b_, -s_ * a_ + c_ * b_
            return [round(v, 2) for v in y]

        def row():
            vals = rotated()
            cells = VGroup()
            for v in vals:
                txt = f"{v:.2f}".replace("-", "−")
                cells.add(M(txt, 22, C_U))
            cells.add(M("…", 22, C_DIM))
            cells.arrange(RIGHT, buff=0.3)
            br = VGroup(M("(", 30), cells, M(")", 30)).arrange(RIGHT, buff=0.1)
            return fit(br, 6.4).move_to([PX, 1.6, 0])

        emb = always_redraw(row)
        emb_t = T("a word's embedding: 768 numbers", 24, C_DIM).move_to([PX, 2.35, 0])
        self.play(FadeIn(emb_t), FadeIn(emb), run_time=1.0)
        self.until_end()

        self.say()  # 52
        p2 = plane((-2, 6), (-1, 6), unit=0.66).to_edge(LEFT, buff=0.5).shift(DOWN * 0.25)
        p2.background_lines.set_stroke(opacity=0.0)
        rgrid = always_redraw(lambda: lattice(
            p2, (np.cos(th.get_value()), np.sin(th.get_value())), (-np.sin(th.get_value()), np.cos(th.get_value())),
            C_DIM, C_DIM, width=1.6, opacity=0.6))
        pts = VGroup(*[Dot(p2.c2p(*xy), radius=0.06, color=C_DIM) for xy in
                       rngx.uniform([0, 0.5], [5, 5.5], (14, 2))])
        A = Dot(p2.c2p(3.0, 3.6), radius=0.1, color=C_V)
        B = Dot(p2.c2p(3.45, 3.25), radius=0.1, color=C_V)
        near = T("nearby", 20, C_V).next_to(VGroup(A, B), UR, buff=0.08)
        self.add(rgrid)
        self.play(FadeIn(p2), FadeIn(rgrid), FadeIn(pts), FadeIn(A), FadeIn(B), FadeIn(near), run_time=1.0)
        rot = Arc(radius=0.3, start_angle=0, angle=TAU * 0.8, color=WHITE, stroke_width=3).add_tip(tip_length=0.12,
                                                                                                    tip_width=0.12)
        rot_t = T("rotate the grid", 24)
        rg = VGroup(rot, rot_t).arrange(RIGHT, buff=0.25).move_to([PX, 0.6, 0])
        self.play(FadeIn(rg), run_time=0.5)
        self.play(th.animate.set_value(0.55), Rotate(rot, -TAU / 3), run_time=3.5)
        same = VGroup(T("every number changed", 24, C_U), T("the points did not move", 24, C_V),
                      T("same arrows, different addresses", 26, C_W, weight=BOLD)).arrange(DOWN, buff=0.18)
        same.move_to([PX, -1.3, 0])
        self.play(FadeIn(same[0]), run_time=0.5)
        self.play(FadeIn(same[1]), Indicate(VGroup(A, B), color=C_V), run_time=0.9)
        self.play(th.animate.set_value(-0.35), run_time=3.0)
        self.play(FadeIn(same[2]), run_time=0.6)
        self.until_end()

        self.say()  # 53
        self.play(Circumscribe(same[2], color=C_W), run_time=1.2)
        self.done(1.0)
        self.clear_all()
