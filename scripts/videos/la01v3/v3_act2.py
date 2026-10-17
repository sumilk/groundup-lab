"""LA01 v3 — Act 2: Reachable territory (span, collapse, spans in space, three facts)."""
from common import *
from v3_act1 import Slider, craft, dimmed, fmt

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
LAZY = np.array([4.0, 2.0])
TGT = np.array([4.0, 5.0])
A3 = np.array([1.0, 0.0, 1.0])
B3 = np.array([0.0, 1.0, 1.0])
C_RED = "#F25F5C"
XR, YR = (-3, 7), (-2, 6)
PX = 3.5          # centre of the right panel


# ---------------------------------------------------------------- helpers (also used by Act 3)

def act_plane(unit=0.6):
    return plane(XR, YR, unit=unit).to_edge(LEFT, buff=0.5).shift(DOWN * 0.3)


def clip_poly(pts, xr=XR, yr=YR):
    """Sutherland–Hodgman clip of a polygon (plane coordinates) to the plane's rectangle."""
    def clip(poly, inside, cut):
        out = []
        for i in range(len(poly)):
            cur, prev = poly[i], poly[i - 1]
            if inside(cur):
                if not inside(prev):
                    out.append(cut(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cut(prev, cur))
        return out

    def cx(x0):
        return lambda p, q: p + (q - p) * ((x0 - p[0]) / (q[0] - p[0]))

    def cy(y0):
        return lambda p, q: p + (q - p) * ((y0 - p[1]) / (q[1] - p[1]))

    poly = [np.array(p, dtype=float) for p in pts]
    for inside, cut in [(lambda p: p[0] >= xr[0], cx(xr[0])), (lambda p: p[0] <= xr[1], cx(xr[1])),
                        (lambda p: p[1] >= yr[0], cy(yr[0])), (lambda p: p[1] <= yr[1], cy(yr[1]))]:
        if not poly:
            break
        poly = clip(poly, inside, cut)
    return poly


def patch(p, u, v, R, color=C_P, op=0.3):
    """The reachable region {a u + b v : |a|, |b| <= R}, clipped to the plane."""
    u, v = np.array(u), np.array(v)
    pts = clip_poly([-R * u - R * v, R * u - R * v, R * u + R * v, -R * u + R * v])
    if len(pts) < 3:
        return VMobject()
    return Polygon(*[p.c2p(*q) for q in pts], stroke_width=2, stroke_color=color).set_fill(color, op)


def segment_line(p, d, color=C_P, width=4):
    """The full line through home along d, clipped to the plane."""
    d = np.array(d, dtype=float)
    pts = clip_poly([-60 * d, 60 * d, 60 * d + 1e-6 * np.array([-d[1], d[0]])])
    pts = sorted(pts, key=lambda q: q @ d)
    return Line(p.c2p(*pts[0]), p.c2p(*pts[-1]), color=color, stroke_width=width)


AZ, EL = -2.0, 0.32


class View3:
    """Oblique projection of 3-D space onto the left of the frame, with a slow camera (az, el)."""

    def __init__(self, origin=(-4.07, -1.99), scale=0.9, az=AZ, el=EL):
        self.o = np.array([origin[0], origin[1], 0.0])
        self.s = scale
        self.az = ValueTracker(az)
        self.el = ValueTracker(el)

    def p(self, x, y=None, z=None):
        if y is None:
            x, y, z = x
        a, e = self.az.get_value(), self.el.get_value()
        x1 = x * np.cos(a) - y * np.sin(a)
        y1 = x * np.sin(a) + y * np.cos(a)
        return self.o + self.s * np.array([x1, z * np.cos(e) + y1 * np.sin(e), 0.0])

    def arrow(self, a, b, color, width=6, tip=0.22):
        return Arrow(self.p(*a), self.p(*b), buff=0, color=color, stroke_width=width, tip_length=tip,
                     max_tip_length_to_length_ratio=0.3)

    def axes(self, L=(4, 4, 5), neg=1.2):
        g = VGroup()
        for k, (n, lab) in enumerate(zip(L, "xyz")):
            e = np.zeros(3)
            e[k] = 1
            g.add(Line(self.p(*(-neg * e)), self.p(*(0 * e)), color="#5B6475", stroke_width=2, stroke_opacity=0.6))
            g.add(Line(self.p(*(0 * e)), self.p(*(n * e)), color="#7D879A", stroke_width=2.5))
            g.add(M(f"<i>{lab}</i>", 24, C_DIM).move_to(self.p(*((n + 0.45) * e))))
        return g

    def floor(self, lo=-1, hi=4):
        g = VGroup()
        for k in range(lo, hi + 1):
            g.add(Line(self.p(k, lo, 0), self.p(k, hi, 0), color=C_GRID, stroke_width=1.2))
            g.add(Line(self.p(lo, k, 0), self.p(hi, k, 0), color=C_GRID, stroke_width=1.2))
        return g

    def sheet(self, a, b, lo=-1.0, hi=3.3, color=C_P, op=0.22, lines=True, offset=(0, 0, 0)):
        a, b, o = np.array(a), np.array(b), np.array(offset, dtype=float)
        c = [o + lo * a + lo * b, o + hi * a + lo * b, o + hi * a + hi * b, o + lo * a + hi * b]
        poly = Polygon(*[self.p(*q) for q in c], stroke_width=1.5, stroke_color=color).set_fill(color, op)
        g = VGroup(poly)
        if lines and hi - lo > 0.6:
            for k in np.arange(np.ceil(lo), np.floor(hi) + 1):
                g.add(Line(self.p(*(o + k * a + lo * b)), self.p(*(o + k * a + hi * b)), color=color,
                           stroke_width=1, stroke_opacity=0.45))
                g.add(Line(self.p(*(o + lo * a + k * b)), self.p(*(o + hi * a + k * b)), color=color,
                           stroke_width=1, stroke_opacity=0.45))
        return g


def drone():
    arms = VGroup(Line(UL * 0.17, DR * 0.17), Line(UR * 0.17, DL * 0.17)).set_stroke("#D9DEE7", 2.5)
    rotors = VGroup(*[Circle(radius=0.075, stroke_color=WHITE, stroke_width=1.5).set_fill("#D9DEE7", 0.35)
                      .move_to(d * 0.17) for d in (UL, UR, DL, DR)])
    body = Square(0.11, stroke_width=0).set_fill(C_V, 1)
    return VGroup(arms, rotors, body)


def stamp(text, color=C_RED, size=30):
    t = T(text, size, color, weight=BOLD)
    return boxed(t, color=color, buff=0.18, fill=0.12)


def fit(mob, w=6.4, x=PX):
    """Scale to fit the right panel width, then position (scale first, then place)."""
    if mob.width > w:
        mob.scale_to_fit_width(w)
    mob.set_x(x)
    return mob


class V3Act2(NScene):
    BEATS = [
        # 0
        "Act two. Reachable territory.",
        # 1
        "Finding one recipe is satisfying. But here's the bigger question: which places can you reach at all?",
        # 2
        "Try a few other targets. Each one has a recipe.",
        # 3
        "Now, instead of picking targets, let both controls range over small amounts, between minus one and "
        "one. The places you can reach form a small parallelogram around home.",
        # 4
        "Allow bigger amounts and the patch grows. There's no limit on the amounts, so there's no limit on the "
        "patch. With these two moves you can reach every single point in the plane.",
        # 5
        "The set of everywhere you can reach is called the span. The span of the blue and gold moves is the "
        "entire plane.",
        # 6
        "SLOW|Written precisely, the span of v one to v k is the set of all their linear combinations, with "
        "every coefficient free to be any real number.",
        # 7
        "SLOW|All recipes, so all reachable points.",
        # 8
        "And one edge case worth knowing: a list with no moves at all can only stay home, so its span is just "
        "the zero vector.",
        # 9
        "Now watch what happens if I change the gold move, so that it points along the same line as blue. "
        "Keep your eye on the reachable patch.",
        # 10
        "It flattens. This gold move is just two blue moves glued together. Anything gold can do, blue could "
        "already do.",
        # 11
        "So however you mix them, forwards, backwards, huge amounts or tiny ones, you never leave this line.",
        # 12
        "And the green target? No recipe exists. This isn't a failure to search hard enough. The target is "
        "simply outside the territory these two moves can reach.",
        # 13
        "Two controls, but only one direction. The span has collapsed from a plane to a line.",
        # 14
        "SLOW|The algebra says the same thing. Any recipe, a times blue plus b times the lazy gold, which is two "
        "blue, equals a plus two b, times blue.",
        # 15
        "SLOW|Whatever a and b you choose, you get some multiple of blue. And can a multiple of blue, t times "
        "two, one, ever equal four, five?",
        # 16
        "SLOW|The first entry demands t equals two. The second demands t equals five.",
        # 17
        "SLOW|A single number can't be both. That's a proof the target is unreachable, not just a failed search.",
        # 18
        "Something else changed too, more quietly. Pick a point that is on the line, like six, three.",
        # 19
        "Now there are many recipes for it. Three blues.",
        # 20
        "Or one blue and one gold.",
        # 21
        "Or minus one blue and two golds.",
        # 22
        "Losing a direction did two things at once: some places became impossible, and the places you can "
        "still reach picked up lots of different recipes. Hold onto that pairing. It's the key to the next act.",
        # 23
        "Let's go up a dimension. Give a drone two moves in three-dimensional space.",
        # 24
        "Mix them in every possible amount and you don't fill the room; you fill a flat, tilted sheet through "
        "home. It's a plane.",
        # 25
        "Two independent directions give you a plane, whether that plane is the whole floor or tilted in space.",
        # 26
        "So some points in the room are reachable, like two, three, five, which sits right on the sheet.",
        # 27
        "And some aren't, like one, one, one, which hangs just below it.",
        # 28
        "Reaching every point in the room would take a third move pointing off the sheet.",
        # 29
        "SLOW|Here's how you know exactly which sheet it is. A general recipe gives s, t, s plus t.",
        # 30
        "SLOW|The third entry is always the sum of the first two. So the span is precisely the plane z equals "
        "x plus y.",
        # 31
        "SLOW|To test two, three, five: the first two entries force s equals two and t equals three, and then "
        "the third entry must be five. It is.",
        # 32
        "SLOW|For one, one, one, they force s and t to be one, so the third entry would have to be two, not one.",
        # 33
        "SLOW|Two free numbers, s and t, means it's a plane, even though each point has three coordinates.",
        # 34
        "Three facts about spans you can now see for yourself.",
        # 35
        "A span always contains home: just use zero of everything.",
        # 36
        "A span is always flat: a point, a line, a plane, or a higher-dimensional version of a plane, never a "
        "curve and never a blob with an edge.",
        # 37
        "And if you can reach two places, you can reach their sum, and any scaled version of them.",
        # 38
        "Remember that third fact. It comes back later with a name of its own.",
        # 39
        "SLOW|That third fact is one line of algebra. Add two recipes and you just add their amounts, which is "
        "another recipe.",
        # 40
        "SLOW|Scale a recipe and you scale its amounts, which is another recipe.",
        # 41
        "SLOW|So sums and scalings of reachable points are always reachable.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 2", "Reachable territory",
                                        "Which places can two moves reach?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)

        # ------------------------------------------------ 2.1 from one target to all of them
        p = act_plane()
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        home_l = T("home", 18, C_DIM).next_to(home, DL, buff=0.06)
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        tgt_l = M("(4, 5)", 24, C_W).next_to(tgt, RIGHT, buff=0.12)
        a = ValueTracker(1.0)
        b = ValueTracker(2.0)
        gv = ValueTracker(0.0)   # 0: gold = (1, 2); 1: gold = (4, 2)

        def gold():
            t = gv.get_value()
            ang = interpolate(np.arctan2(2, 1), np.arctan2(2, 4), t)
            r = interpolate(np.sqrt(5), np.sqrt(20), t)
            return np.array([r * np.cos(ang), r * np.sin(ang)])

        def pos():
            return p.c2p(*(a.get_value() * U + b.get_value() * gold()))

        ship = craft()
        ship.add_updater(lambda m: m.move_to(pos()))
        uarr = vec(p, *U, C_U, width=6)
        varr = always_redraw(lambda: vec(p, *gold(), C_V, width=6))
        sa = Slider("blue", C_U, a)
        sb = Slider("gold", C_V, b)
        panel = VGroup(sa, sb).arrange(DOWN, buff=0.7).move_to(RIGHT * PX + UP * 1.5)

        # 1 — the bigger question
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), FadeIn(home_l), run_time=1.2)
        self.play(FadeIn(tgt), FadeIn(tgt_l), GrowArrow(uarr), FadeIn(varr), FadeIn(ship), FadeIn(panel),
                  run_time=1.0)
        q = T("Which places can you reach at all?", 28, C_U, slant=ITALIC).move_to(RIGHT * PX + DOWN * 0.6)
        fit(q)
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.8)
        self.until_end(0.5)

        # 2 — other targets, each with a recipe
        self.say()
        self.play(FadeOut(q), run_time=0.4)
        recipe = always_redraw(lambda: M(f"{fmt(a.get_value())}·<i>u</i> {'−' if round(b.get_value(), 1) < 0 else '+'} "
                                         f"{fmt(abs(b.get_value()))}·<i>v</i>", 30)
                               .move_to(RIGHT * PX + DOWN * 0.4))
        self.add(recipe)
        trails = VGroup()
        tdots = VGroup()
        for (x, y) in [(3, 0), (-1, 1), (5, 4), (0, 3)]:
            ca, cb = (2 * x - y) / 3, (2 * y - x) / 3
            d = Dot(p.c2p(x, y), radius=0.09, color=C_W)
            tdots.add(d)
            start = pos()
            self.play(FadeIn(d, scale=2), run_time=0.35)
            self.play(a.animate.set_value(ca), b.animate.set_value(cb), run_time=1.2)
            tr = Line(start, pos(), color=WHITE, stroke_width=2, stroke_opacity=0.5)
            trails.add(tr)
            self.add(tr)
        self.until_end()

        # 3 — amounts between -1 and 1: a small parallelogram
        self.say()
        self.play(FadeOut(trails), FadeOut(tdots), FadeOut(recipe), a.animate.set_value(0), b.animate.set_value(0),
                  run_time=0.8)
        R = ValueTracker(0.02)

        def rbar(s):
            return always_redraw(lambda: Line(
                s.track.point_from_proportion((-min(R.get_value(), 3) + 3) / 6),
                s.track.point_from_proportion((min(R.get_value(), 3) + 3) / 6),
                color=s[3].get_color(), stroke_width=10, stroke_opacity=0.45))

        bars = VGroup(rbar(sa), rbar(sb))
        region = always_redraw(lambda: patch(p, U, gold(), R.get_value()))
        self.add(region, bars)
        self.bring_to_front(uarr, varr, ship, home)
        rng = T("amounts between −1 and 1", 26, WHITE).move_to(RIGHT * PX + DOWN * 0.5)
        self.play(R.animate.set_value(1), FadeIn(rng), run_time=1.6)
        for ca, cb in [(1, 1), (1, -1), (-1, -1), (-1, 1), (0, 0)]:
            self.play(a.animate.set_value(ca), b.animate.set_value(cb), run_time=0.7)
        self.until_end()

        # 4 — the patch grows without limit
        self.say()
        for r, txt in [(2, "amounts between −2 and 2"), (6, "amounts between −6 and 6")]:
            nt = T(txt, 26, WHITE).move_to(rng)
            self.play(R.animate.set_value(r), FadeOut(rng, run_time=0.5), FadeIn(nt), run_time=1.6)
            rng = nt
            self.wait(0.6)
        nt = T("any amounts  →  every point", 26, C_W).move_to(rng)
        self.play(R.animate.set_value(60), FadeOut(rng), FadeIn(nt), run_time=1.6)
        rng = nt
        self.until_end()

        # 5 — span
        self.say()
        self.play(FadeOut(VGroup(panel, bars, rng)), run_time=0.5)
        st_t = VGroup(T("span(u, v)", 26, WHITE, weight=BOLD), T("= the whole plane ℝ²", 26, WHITE, weight=BOLD)).arrange(DOWN, buff=0.12)
        st = boxed(st_t, color=C_P, buff=0.18, fill=0.6).move_to(p.c2p(-0.1, 4.7))
        self.play(FadeIn(st, scale=1.15), run_time=0.9)
        term = T("span", 44, C_P, weight=BOLD).move_to(RIGHT * PX + UP * 2.3)
        term_s = T("everywhere a set of moves can reach", 24, C_DIM).next_to(term, DOWN, buff=0.18)
        self.play(Write(term), FadeIn(term_s), run_time=1.0)
        self.until_end()

        # 6 — precise definition
        self.say()
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        d1 = M("span(<i>v</i><sub>1</sub>, …, <i>v<sub>k</sub></i>)  =", 32)
        d2 = M("{ <i>c</i><sub>1</sub><i>v</i><sub>1</sub> + ⋯ + <i>c<sub>k</sub></i><i>v<sub>k</sub></i>  :  "
               "every <i>c<sub>i</sub></i> ∈ ℝ }", 32)
        defn = VGroup(d1, d2).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        fit(defn).set_y(0.35)
        tagp.next_to(defn, UP, buff=0.2).align_to(defn, LEFT)
        self.play(FadeIn(tagp), Write(d1), run_time=1.2)
        self.play(Write(d2), run_time=1.8)
        self.until_end(1.2)

        # 7 — all recipes <-> all reachable points
        self.say()
        lab_r = T("all recipes", 24, C_V)
        lab_p = T("=  all reachable points", 24, C_P)
        labs = VGroup(lab_r, lab_p).arrange(RIGHT, buff=0.25).next_to(d2, DOWN, buff=0.35)
        fit(labs)
        ptr = Arrow(labs.get_left() + LEFT * 0.05, p.c2p(6.0, 2.6), buff=0.1, color=C_P, stroke_width=4,
                    tip_length=0.2)
        self.play(FadeIn(lab_r, shift=UP * 0.15), Indicate(d2, color=C_V, scale_factor=1.04), run_time=1.0)
        self.play(FadeIn(lab_p), GrowArrow(ptr), run_time=1.0)
        self.until_end(1.2)

        # 8 — span of the empty list
        self.say()
        self.play(FadeOut(ptr), run_time=0.3)
        box = RoundedRectangle(width=1.7, height=1.0, corner_radius=0.1, stroke_color=C_DIM, stroke_width=2)
        none = T("no controls", 18, C_DIM).move_to(box.get_top() + DOWN * 0.22)
        hdot = Dot(box.get_center() + DOWN * 0.15, radius=0.08, color=WHITE)
        inset = VGroup(box, none, hdot)
        emp = M("span( ) = { 0 }", 32, WHITE)
        row = VGroup(inset, emp).arrange(RIGHT, buff=0.5)
        fit(row).set_y(-2.4)
        self.play(Create(box), FadeIn(none), run_time=0.8)
        self.play(FadeIn(hdot, scale=2), Write(emp), run_time=1.2)
        self.until_end(1.0)

        # ------------------------------------------------ 2.2 the collapse
        # 9 — turn gold onto blue's line; watch the patch
        self.say()
        self.play(FadeOut(VGroup(st, term, term_s, tagp, defn, lab_r, lab_p, row)), run_time=0.6)
        self.play(R.animate.set_value(1.5), run_time=1.2)
        greadout = always_redraw(lambda: M(
            f"gold = ({fmt(gold()[0])}, {fmt(gold()[1])})", 30, C_V).move_to(RIGHT * PX + UP * 2.2))
        self.play(FadeIn(greadout), run_time=0.5)
        self.until_end()
        self.play(gv.animate.set_value(1), run_time=4.0, rate_func=smooth)   # the 3 s pause, watching
        self.wait(0.5)

        # 10 — it flattens: gold = 2u
        self.say()
        line = segment_line(p, U, C_P, 4)
        self.play(FadeIn(line), run_time=0.6)
        self.remove(region)
        g2 = M("gold = (4, 2) = 2<i>u</i>", 30, C_V).move_to(greadout)
        self.remove(greadout)
        self.add(g2)
        two = VGroup(vec(p, *U, C_U, start=(0, 0), width=4).shift(DOWN * 0.18 + RIGHT * 0.09),
                     vec(p, *U, C_U, start=(2, 1), width=4).shift(DOWN * 0.18 + RIGHT * 0.09))
        self.play(LaggedStart(GrowArrow(two[0]), GrowArrow(two[1]), lag_ratio=0.6), run_time=1.4)
        self.until_end()

        # 11 — never leave the line
        self.say()
        self.play(FadeOut(two), run_time=0.4)
        for ca, cb in [(3, 0.4), (-1, -0.3), (0.5, 0.8), (-2.5, 0.5), (1, -0.6), (2, 0.2), (0, 0)]:
            self.play(a.animate.set_value(ca), b.animate.set_value(cb), run_time=0.55, rate_func=smooth)
        self.until_end()

        # 12 — the target is outside
        self.say()
        cross = VGroup(Line(UL, DR), Line(UR, DL)).set_stroke(C_RED, 6).scale(0.2).move_to(tgt.get_center())
        unr = T("no recipe", 22, C_RED).next_to(tgt, LEFT, buff=0.25)
        self.play(FadeIn(cross, scale=1.6), FadeIn(unr), run_time=0.8)
        self.until_end()

        # 13 — span = a line
        self.say()
        sl = stamp("span = a line", C_P, 32).move_to(RIGHT * PX + UP * 1.2)
        deg = T("the span collapsed (degenerate)", 22, C_DIM).next_to(sl, DOWN, buff=0.25)
        self.play(FadeIn(sl, scale=1.15), Indicate(line, color=C_P), run_time=1.0)
        self.play(FadeIn(deg), run_time=0.6)
        self.until_end()

        # 14 — the algebra of the collapse
        self.say()
        self.play(FadeOut(VGroup(sl, deg)), g2.animate.set_y(2.5), run_time=0.5)
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        al = M("<i>a</i>·<i>u</i> + <i>b</i>·(2<i>u</i>)  =  "
               "<span foreground='#83C167'>(<i>a</i> + 2<i>b</i>)</span>·<i>u</i>", 32)
        fit(al).set_y(1.6)
        tagp.next_to(al, UP, buff=0.15).align_to(al, LEFT)
        self.play(FadeIn(tagp), Write(al), run_time=2.0)
        self.until_end(1.2)

        # 15 — can a multiple of blue reach (4, 5)?
        self.say()
        mult = T("always a multiple of u", 22, C_DIM).next_to(al, DOWN, buff=0.2)
        self.play(FadeIn(mult), run_time=0.6)
        tq = M("<i>t</i>·(2, 1) = (4, 5) ?", 32).next_to(mult, DOWN, buff=0.45)
        self.play(Write(tq), run_time=1.4)
        self.until_end(1.2)

        # 16 — the two demands
        self.say()
        dm1 = M("first entry:   2<i>t</i> = 4   ⇒   <i>t</i> = 2", 30)
        dm2 = M("second entry:   <i>t</i> = 5", 30)
        dms = VGroup(dm1, dm2).arrange(DOWN, buff=0.3, aligned_edge=LEFT).next_to(tq, DOWN, buff=0.45)
        fit(dms)
        self.play(FadeIn(dm1, shift=DOWN * 0.15), run_time=0.9)
        self.wait(0.8)
        self.play(FadeIn(dm2, shift=DOWN * 0.15), run_time=0.9)
        self.play(dm1.animate.set_color(C_RED), dm2.animate.set_color(C_RED), run_time=0.6)
        self.until_end(1.0)

        # 17 — a proof, not a failed search
        self.say()
        pf = stamp("t can't be 2 and 5  ⇒  no recipe exists", C_RED, 24).next_to(dms, DOWN, buff=0.4)
        fit(pf)
        self.play(FadeIn(pf, scale=1.1), run_time=0.9)
        self.until_end()
        self.wait(2)

        # 18 — a point on the line
        self.say()
        self.play(FadeOut(VGroup(tagp, al, mult, tq, dms, pf, cross, unr, tgt, tgt_l)), run_time=0.6)
        on = Dot(p.c2p(6, 3), radius=0.12, color=WHITE)
        on_l = M("(6, 3)", 24, WHITE).next_to(on, UP, buff=0.15)
        self.play(FadeIn(on, scale=2), FadeIn(on_l), Flash(on, color=WHITE), run_time=1.0)
        self.until_end()

        # 19–21 — three recipes for (6, 3)
        perp = np.array([-1, 2]) / np.sqrt(5)
        cards = VGroup()
        paths = VGroup()
        specs = [(3, 0, "3 blue + 0 gold"), (1, 1, "1 blue + 1 gold"), (-1, 2, "−1 blue + 2 gold")]
        for k, (ca, cb, txt) in enumerate(specs):
            self.say()
            off = p.c2p(*(perp * 0.32 * (k - 1))) - p.c2p(0, 0)
            mid = ca * U
            seg = VGroup(Line(p.c2p(0, 0), p.c2p(*mid), color=C_U, stroke_width=5),
                         Line(p.c2p(*mid), p.c2p(6, 3), color=C_V, stroke_width=5)).shift(off)
            if cb == 0:
                seg = VGroup(seg[0])
            card = stamp(txt, [C_U, C_W, C_V][k], 26)
            card.move_to(RIGHT * PX + UP * (1.2 - 0.95 * k))
            self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.5)
            for sgm in seg:
                self.play(Create(sgm), run_time=0.8)
            self.play(a.animate.set_value(ca), b.animate.set_value(cb),
                      run_time=0.9)
            self.play(a.animate.set_value(0), b.animate.set_value(0), run_time=0.5)
            cards.add(card)
            paths.add(seg)
            self.until_end()

        # 22 — the pairing
        self.say()
        mr = VGroup(T("reachable places: many recipes", 24, C_W),
                    T("(multiple representations)", 22, C_W)).arrange(DOWN, buff=0.08, aligned_edge=LEFT)
        im = T("some places: impossible", 24, C_RED)
        pair = VGroup(im, mr).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(RIGHT * PX + DOWN * 2.0)
        fit(pair)
        self.play(FadeIn(im), run_time=0.7)
        self.play(FadeIn(mr), run_time=0.7)
        self.until_end(0.8)
        ship.clear_updaters()
        self.play(FadeOut(VGroup(p, home, home_l, uarr, varr, ship, line, g2, on, on_l, cards, paths, pair)),
                  run_time=0.8)

        # ------------------------------------------------ 2.3 spans in space
        vw = View3(az=0.0, el=PI / 2)
        flr = always_redraw(lambda: vw.floor())
        axs = always_redraw(lambda: vw.axes())

        # 23 — up a dimension
        self.say()
        self.play(FadeIn(flr), FadeIn(axs), run_time=0.8)
        self.play(vw.az.animate.set_value(AZ), vw.el.animate.set_value(EL), run_time=4.0)
        flr.clear_updaters()
        axs.clear_updaters()
        aar = vw.arrow((0, 0, 0), A3, C_U)
        bar_ = vw.arrow((0, 0, 0), B3, C_V)
        dr = drone().move_to(vw.p(0, 0, 0))
        al3 = M("<i>a</i> = (1, 0, 1)", 30, C_U)
        bl3 = M("<i>b</i> = (0, 1, 1)", 30, C_V)
        ab = VGroup(al3, bl3).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(RIGHT * PX + UP * 2.2)
        self.play(FadeIn(dr, scale=0.5), GrowArrow(aar), FadeIn(al3), run_time=0.9)
        self.play(GrowArrow(bar_), FadeIn(bl3), run_time=0.9)
        self.until_end()

        # 24 — mixing fills a tilted sheet
        self.say()
        S = ValueTracker(0.01)
        sh = always_redraw(lambda: vw.sheet(A3, B3, -S.get_value() * 1.0, S.get_value() * 3.3,
                                            lines=False))
        self.add(sh)
        self.bring_to_front(aar, bar_, dr)
        ph = ValueTracker(0.0)

        def dpos():
            s_ = S.get_value()
            t = ph.get_value()
            return vw.p(*((1 + 2.3 * s_ * np.sin(t)) * A3 + (1 + 2.3 * s_ * np.sin(1.7 * t + 1)) * B3))

        dr.add_updater(lambda m: m.move_to(dpos()))
        dtrail = TracedPath(dr.get_center, stroke_color=WHITE, stroke_width=2, stroke_opacity=0.5,
                            dissipating_time=1.2)
        self.add(dtrail)
        self.play(S.animate.set_value(1), ph.animate.set_value(9), run_time=5.0, rate_func=linear)
        sheet = vw.sheet(A3, B3)
        self.remove(sh)
        self.add(sheet)
        self.bring_to_front(aar, bar_, dr)
        pl = T("a plane through home", 26, C_P).next_to(ab, DOWN, buff=0.4).set_x(PX)
        self.play(FadeIn(pl), run_time=0.6)
        self.until_end()
        dr.clear_updaters()
        self.remove(dtrail)

        # 25 — floor or tilted, two directions give a plane
        self.say()
        fl = vw.sheet((1, 0, 0), (0, 1, 0), -1, 4, color=C_DIM, op=0.15, lines=False)
        self.play(FadeIn(fl), run_time=0.8)
        self.wait(0.8)
        self.play(FadeOut(fl), FadeOut(dr), Indicate(sheet, color=C_P, scale_factor=1.02), run_time=1.0)
        pl2 = T("two independent directions → a plane", 24, C_DIM).next_to(pl, DOWN, buff=0.2).set_x(PX)
        fit(pl2)
        self.play(FadeIn(pl2), run_time=0.6)
        self.until_end()

        # 26 — (2, 3, 5) is on the sheet
        self.say()
        t1 = Dot(vw.p(2, 3, 5), radius=0.1, color=C_W)
        t1l = M("(2, 3, 5)", 24, C_W).next_to(t1, UP, buff=0.12)
        walk = VGroup(DashedLine(vw.p(0, 0, 0), vw.p(*(2 * A3)), color=C_U, stroke_width=3),
                      DashedLine(vw.p(*(2 * A3)), vw.p(2, 3, 5), color=C_V, stroke_width=3))
        self.play(FadeIn(t1, scale=2), FadeIn(t1l), run_time=0.7)
        self.play(Create(walk[0]), run_time=0.7)
        self.play(Create(walk[1]), run_time=0.9)
        self.until_end()

        # 27 — (1, 1, 1) hangs below
        self.say()
        t2 = Dot(vw.p(1, 1, 1), radius=0.1, color=C_X)
        t2l = M("(1, 1, 1)", 24, C_X).next_to(t2, DR, buff=0.12).shift(RIGHT * 0.15 + DOWN * 0.1)
        hit = Dot(vw.p(1, 1, 2), radius=0.06, color=C_P)
        hitl = M("(1, 1, 2)", 22, WHITE).next_to(hit, RIGHT, buff=0.15)
        drop = DashedLine(vw.p(1, 1, 1), vw.p(1, 1, 2), color=C_X, stroke_width=3, dash_length=0.08)
        self.play(FadeIn(t2, scale=2), FadeIn(t2l), run_time=0.7)
        self.play(Create(drop), FadeIn(hit), FadeIn(hitl), run_time=0.9)
        self.until_end()

        # 28 — a third move would have to point off the sheet
        self.say()
        off = DashedLine(vw.p(0, 0, 0), vw.p(0, 0, 2.2), color=WHITE, stroke_width=3, dash_length=0.1)
        off.add_tip(tip_length=0.2, tip_width=0.18)
        offl = T("a third move, pointing off the sheet?", 24, WHITE).next_to(pl2, DOWN, buff=0.4).set_x(PX)
        self.play(Create(off), FadeIn(offl), run_time=1.0)
        self.until_end(0.5)
        self.play(FadeOut(VGroup(off, offl, pl, pl2)), run_time=0.5)

        # 29 — general recipe (s, t, s + t)
        self.say()
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        g1 = M("<i>s</i>·(1, 0, 1) + <i>t</i>·(0, 1, 1)", 30)
        g2_ = M("= (<i>s</i>, <i>t</i>, <span foreground='#B39DDB'><i>s</i> + <i>t</i></span>)", 30)
        gg = VGroup(g1, g2_).arrange(DOWN, buff=0.22, aligned_edge=LEFT)
        self.play(FadeOut(ab), run_time=0.4)
        fit(gg).set_y(2.05)
        tagp.next_to(gg, UP, buff=0.12).align_to(gg, LEFT)
        self.play(FadeIn(tagp), Write(g1), run_time=1.4)
        self.play(Write(g2_), run_time=1.2)
        self.until_end(1.0)

        # 30 — third = first + second: the plane z = x + y
        self.say()
        cap = T("third entry = first + second, always", 22, C_P).next_to(gg, DOWN, buff=0.2)
        fit(cap)
        self.play(FadeIn(cap), Indicate(g2_, color=C_P, scale_factor=1.05), run_time=1.0)
        pe = boxed(M("span(<i>a</i>, <i>b</i>):   <i>z</i> = <i>x</i> + <i>y</i>", 32, WHITE), color=C_P)
        pe.next_to(cap, DOWN, buff=0.3)
        fit(pe)
        self.play(FadeIn(pe, scale=1.1), run_time=0.9)
        self.until_end(1.2)

        # 31 — test (2, 3, 5)
        self.say()
        k1 = M("(2, 3, 5):   <i>s</i> = 2,  <i>t</i> = 3", 28, C_W)
        k1b = M("2 + 3 = 5   ✓", 28, C_W)
        k1g = VGroup(k1, k1b).arrange(DOWN, buff=0.15, aligned_edge=LEFT).next_to(pe, DOWN, buff=0.35)
        fit(k1g)
        self.play(FadeIn(k1, shift=DOWN * 0.1), Indicate(t1, color=C_W), run_time=1.0)
        self.wait(1.2)
        self.play(FadeIn(k1b, shift=DOWN * 0.1), run_time=0.8)
        self.until_end(1.0)

        # 32 — test (1, 1, 1)
        self.say()
        k2 = M("(1, 1, 1):   <i>s</i> = 1,  <i>t</i> = 1", 28, C_X)
        k2b = M("1 + 1 = 2 ≠ 1   ✗", 28, C_X)
        k2g = VGroup(k2, k2b).arrange(DOWN, buff=0.15, aligned_edge=LEFT).next_to(k1g, DOWN, buff=0.3)
        fit(k2g)
        k2g.align_to(k1g, LEFT)
        self.play(k1g.animate.set_opacity(0.45), FadeIn(k2, shift=DOWN * 0.1), Indicate(t2, color=C_X),
                  run_time=1.0)
        self.wait(1.2)
        self.play(FadeIn(k2b, shift=DOWN * 0.1), Indicate(hit, color=C_P), run_time=0.8)
        self.until_end(1.0)

        # 33 — two free numbers → a plane
        self.say()
        self.play(k2g.animate.set_opacity(0.45), run_time=0.3)
        fr = T("2 free numbers (s, t)  →  a plane in ℝ³", 24, C_P).next_to(k2g, DOWN, buff=0.3)
        fit(fr)
        self.play(FadeIn(fr), Indicate(g1, color=WHITE, scale_factor=1.04), run_time=1.2)
        self.until_end(1.2)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not header], run_time=0.8)

        # ------------------------------------------------ 2.4 three facts
        # 34 — three tiles
        self.say()
        tiles = VGroup(*[RoundedRectangle(width=4.1, height=3.0, corner_radius=0.15, stroke_color=C_DIM,
                                          stroke_width=2) for _ in range(3)]).arrange(RIGHT, buff=0.3)
        tiles.move_to(UP * 0.9)
        heads = VGroup(T("1 · contains home", 24, C_U), T("2 · always flat", 24, C_U),
                       T("3 · closed under + and ×", 24, C_U))
        for h, t in zip(heads, tiles):
            h.next_to(t, UP, buff=0.15)
            h.set_y(tiles.get_top()[1] + 0.3)
        self.play(LaggedStart(*[Create(t) for t in tiles], lag_ratio=0.3), run_time=1.2)
        self.until_end()

        # 35 — tile 1: home is in every span
        self.say()
        c1 = tiles[0].get_center() + DOWN * 0.1
        h1 = Dot(c1, radius=0.09, color=WHITE)
        ln1 = Line(c1 + np.array([-1.6, -0.8, 0]), c1 + np.array([1.6, 0.8, 0]), color=C_P, stroke_width=4)
        pg1 = Polygon(c1 + np.array([-1.5, -0.3, 0]), c1 + np.array([0.6, -1.1, 0]),
                      c1 + np.array([1.5, 0.4, 0]), c1 + np.array([-0.6, 1.1, 0]),
                      stroke_width=0).set_fill(C_P, 0.2)
        z1 = M("0·<i>u</i> + 0·<i>v</i> = 0", 24).next_to(tiles[0].get_bottom(), UP, buff=0.15)
        self.play(FadeIn(heads[0]), FadeIn(pg1), Create(ln1), run_time=1.0)
        self.play(FadeIn(h1, scale=2), Flash(h1, color=WHITE), FadeIn(z1), run_time=1.0)
        self.until_end()

        # 36 — tile 2: flat, never curved or bounded
        self.say()
        c2 = tiles[1].get_center()
        ok = VGroup(Dot(radius=0.08, color=C_P),
                    Line(LEFT * 0.45, RIGHT * 0.45, color=C_P, stroke_width=4).rotate(0.5),
                    Polygon(LEFT * 0.5 + DOWN * 0.25, RIGHT * 0.2 + DOWN * 0.35, RIGHT * 0.5 + UP * 0.25,
                            LEFT * 0.2 + UP * 0.35, stroke_width=1.5, stroke_color=C_P).set_fill(C_P, 0.3))
        ok.arrange(RIGHT, buff=0.35).move_to(c2 + UP * 0.55)
        okl = T("point · line · plane  ✓", 20, C_P).next_to(ok, DOWN, buff=0.12)
        bad = VGroup(Arc(radius=0.5, start_angle=0.3, angle=2.2, color=C_RED, stroke_width=4),
                     Circle(radius=0.3, stroke_color=C_RED, stroke_width=2).set_fill(C_RED, 0.3))
        bad.arrange(RIGHT, buff=0.6).move_to(c2 + DOWN * 0.55)
        badl = T("curve · blob  ✗", 20, C_RED).next_to(bad, DOWN, buff=0.1)
        self.play(FadeIn(heads[1]), LaggedStart(*[FadeIn(m, scale=0.6) for m in ok], lag_ratio=0.4),
                  FadeIn(okl), run_time=1.6)
        self.play(FadeIn(bad), FadeIn(badl), run_time=0.8)
        self.until_end()

        # 37 — tile 3: sums and scalings stay inside
        self.say()
        c3 = tiles[2].get_center() + DOWN * 0.1
        d3 = np.array([0.9, 0.36, 0])
        ln3 = Line(c3 - 1.9 * d3, c3 + 1.9 * d3, color=C_P, stroke_width=3, stroke_opacity=0.6)
        o3 = c3 - 1.2 * d3
        nrm = np.array([-0.36, 0.9, 0]) / np.linalg.norm([-0.36, 0.9])
        P1 = Arrow(o3, o3 + 0.8 * d3, buff=0, color=C_U, stroke_width=5, tip_length=0.15)
        P2 = Arrow(o3 + 0.8 * d3, o3 + 2.1 * d3, buff=0, color=C_V, stroke_width=5, tip_length=0.15)
        S3 = Arrow(o3, o3 + 2.1 * d3, buff=0, color=C_W, stroke_width=5, tip_length=0.15).shift(-0.22 * nrm)
        h3 = Dot(o3, radius=0.07, color=WHITE)
        s3l = T("sum and scalings stay on it", 20, C_W).next_to(tiles[2].get_bottom(), UP, buff=0.15)
        self.play(FadeIn(heads[2]), Create(ln3), FadeIn(h3), GrowArrow(P1), GrowArrow(P2), run_time=1.0)
        self.play(GrowArrow(S3), run_time=0.8)
        self.play(FadeOut(P2), S3.animate.set_opacity(0.35), run_time=0.4)
        self.play(P1.animate.put_start_and_end_on(o3, o3 + 2.6 * d3), run_time=0.8)
        self.play(P1.animate.put_start_and_end_on(o3, o3 - 0.5 * d3), FadeIn(s3l), run_time=0.8)
        self.until_end()

        # 38 — remember it
        self.say()
        self.play(Circumscribe(VGroup(tiles[2], heads[2]), color=C_W), run_time=1.4)
        self.until_end()

        # 39 — sums of recipes
        self.say()
        tagp = T("PRECISE", 18, C_V, weight=BOLD)
        id1 = M("Σ <i>c<sub>i</sub></i><i>v<sub>i</sub></i> + Σ <i>d<sub>i</sub></i><i>v<sub>i</sub></i>  =  "
                "Σ <span foreground='#83C167'>(<i>c<sub>i</sub></i> + <i>d<sub>i</sub></i>)</span><i>v<sub>i</sub></i>",
                34)
        id2 = M("<i>a</i> · Σ <i>c<sub>i</sub></i><i>v<sub>i</sub></i>  =  "
                "Σ <span foreground='#83C167'>(<i>a c<sub>i</sub></i>)</span><i>v<sub>i</sub></i>", 34)
        ids = VGroup(id1, id2).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to(DOWN * 2.35)
        tagp.next_to(ids, UP, buff=0.12).align_to(ids, LEFT)
        self.play(FadeIn(tagp), Write(id1), run_time=2.0)
        self.until_end(1.2)

        # 40 — scalings of recipes
        self.say()
        self.play(Write(id2), run_time=1.6)
        self.until_end(1.2)

        # 41 — closed
        self.say()
        self.play(Circumscribe(ids, color=C_W), run_time=1.4)
        self.done(1.2)
        self.clear_all()
