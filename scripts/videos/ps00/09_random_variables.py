"""Outcomes become numbers (docs/PS00_VIDEO_SCRIPT.md, section 9).

Two panels, because there are two spaces: the outcomes (four coin tiles) on the left, the values (a number line) on
the right, joined by curved arrows, the random variable. Mass travels along the arrows and stacks as purple bars,
the PMF. Then the CDF staircase, then W (count tails) with identical bars but different arrows, then Y = X squared.
"""
from kit import *  # noqa: F401,F403

OUTS = ["HH", "HT", "TH", "TT"]
TILE_X = -4.75
TILE_Y = {"HH": 1.35, "HT": 0.45, "TH": -0.45, "TT": -1.35}
LINE_Y = -0.7          # the value line, at the vertical middle of the right panel
LAB_Y = -1.08          # value labels under it
H = 2.8                # bar height per unit of probability
BW = 0.9               # bar width
X0, X1 = -0.2, 5.6     # value line extent
RX = 3.2               # centre of the maths row at the top


def curve_arrow(p0, x, color=WHITE, width=3.0, opacity=1.0, dx=0.0, dy=0.0):
    """One gentle curve from an outcome tile to just below a value's label, arriving from below-left.

    Farther values get a deeper, longer swing, so each arrow keeps its own shape and passes under nearer labels
    rather than through the bars. .curve is the path (for MoveAlongPath).
    """
    p0 = np.array(p0, dtype=float)
    p3 = np.array([x + dx, LAB_Y - 0.24, 0.0])
    reach = x - 0.6
    c1 = p0 + RIGHT * 1.65
    c2 = np.array([x + dx - (0.9 + 0.5 * reach), -(2.4 + 0.8 * reach) + dy, 0.0])
    curve = CubicBezier(p0, c1, c2, p3).set_fill(opacity=0).set_stroke(color, width, opacity)
    d = p3 - c2
    tip = Triangle(stroke_width=0).set_fill(color, opacity).scale(0.1).stretch(1.3, 1)
    tip.rotate(np.arctan2(d[1], d[0]) - PI / 2)
    tip.shift(p3 - tip.get_vertices()[0])
    g = VGroup(curve, tip)
    g.curve = curve
    return g


def fade_arrow(a, op):
    return AnimationGroup(a.curve.animate.set_stroke(opacity=op), a[1].animate.set_fill(opacity=op))


def tile(s):
    r = RoundedRectangle(width=0.95, height=0.66, corner_radius=0.12, stroke_color="#9AA3B2", stroke_width=2)
    r.set_fill("#1A2030", opacity=1)
    t = T(s, 30).move_to(r)
    g = VGroup(r, t).move_to([TILE_X, TILE_Y[s], 0])
    g.box = r
    return g


class ValueLine(VGroup):
    """A plain number line (no LaTeX): ticks at the given values, with labels."""

    def __init__(self, values, xpos, labelled=None, dim_values=()):
        super().__init__()
        self.xpos = dict(zip(values, xpos))
        self.base = Line([X0, LINE_Y, 0], [X1, LINE_Y, 0], stroke_color="#9AA3B2", stroke_width=2.5)
        self.ticks = VGroup()
        self.labels = VGroup()
        for v, x in self.xpos.items():
            self.ticks.add(Line([x, LINE_Y - 0.09, 0], [x, LINE_Y + 0.09, 0], stroke_color="#9AA3B2",
                                stroke_width=2.5))
            if labelled is None or v in labelled:
                self.labels.add(M(str(v), 30, C_DIM if v in dim_values else WHITE).move_to([x, LAB_Y, 0]))
        self.add(self.base, self.ticks, self.labels)

    def x(self, v):
        return self.xpos[v]

    def label(self, v):
        for m in self.labels:
            if abs(m.get_center()[0] - self.xpos[v]) < 1e-3:
                return m


def arrow_to(s, x, color=WHITE, opacity=1.0, dx=0.0, dy=0.0, width=3.0):
    return curve_arrow([TILE_X + 0.5, TILE_Y[s], 0], x, color, width, opacity, dx, dy)


# HT and TH land on the same value: arrive a little apart, at slightly different angles
SPLIT = {"HT": (-0.14, -0.5), "TH": (0.14, 0.3)}
def segment(x, k, n=1):
    """The k-th quarter (0-based) stacked over value position x; n quarters tall."""
    h = H / 4
    r = Rectangle(width=BW, height=h * n, stroke_color="#0e1116", stroke_width=2)
    r.set_fill(C_MASS, opacity=0.85)
    r.move_to([x, LINE_Y + h * k + h * n / 2, 0])
    return r


def chip(s):
    c = RoundedRectangle(width=0.62, height=0.44, corner_radius=0.08, stroke_width=0).set_fill(C_MASS, 0.9)
    c.move_to([TILE_X + 0.95, TILE_Y[s], 0])
    return c


class RandomVariables(NScene):
    PARAS = [
        ["So far every event has been a yes-or-no question.",
         "Often we want a number instead.",
         "How many heads?",
         "What's the total?",
         "How large is the error on this example?"],
        ["Go back to two coins, and count the heads.",
         "Heads heads gives two.",
         "Heads tails and tails heads give one each.",
         "Tails tails gives zero."],
        ["That counting rule is called a random variable.",
         "Despite the name, there's nothing random inside it.",
         "It's a function.",
         "It takes an outcome and returns a number.",
         "All the randomness is in which outcome happens.",
         "We'll call this one X. X of heads tails is one."],
        ["Now carry the mass across the arrows.",
         "The two fair tosses are independent, so each outcome holds a quarter.",
         "Before it moves, which value of X will collect the most?"],
        ["One.",
         "Two outcomes land there, so a half stacks up.",
         "Zero and two get a quarter each. That list of values with their masses is the probability mass function "
         "of X. The probability that X equals one is a half."],
        ["Sometimes it's more useful to add up from the left, and ask for the probability that X is at most "
         "some value.",
         "At most zero means only tails tails, a quarter.",
         "At most one adds the two one-head outcomes, three quarters.",
         "What about at most one and a half?"],
        ["Still three quarters.",
         "X can't land between one and two, so nothing new is added until two, where the total reaches one."],
        ["The result is a staircase that only climbs.",
         "It's flat between the possible values and jumps at each one.",
         "It's called the cumulative distribution function, and the next chapter does much more with it."],
        ["Now count tails instead, and call that W. W has exactly the same masses as X. A quarter at zero, a half "
         "at one, a quarter at two."],
        ["Yet X and W disagree on heads heads, and on tails tails.",
         "Two random variables can have the same distribution and still be different functions.",
         "Saying that two variables have the same distribution is a statement about their masses, not about the "
         "variables themselves."],
        ["Let Y be X squared.",
         "What's its mass function?"],
        ["Zero still goes to zero, and one still goes to one, but two goes to four.",
         "So a quarter at zero, a half at one, and a quarter at four.",
         "Push the mass through the function, outcome by outcome, rather than guessing from the values."],
    ]

    # ------------------------------------------------------------------------------------------------
    def beat(self, *anims, rt=1.2, lag=None):
        """Start the next beat and play anims inside it (never longer than the beat)."""
        d = self.say()
        if anims:
            t = min(rt, max(0.3, d - 0.15))
            if lag is not None:
                self.play(LaggedStart(*anims, lag_ratio=lag), run_time=t)
            else:
                self.play(*anims, run_time=t)
        return d

    def construct(self):
        self.panels()
        self.counting()
        self.pmf()
        self.cdf()
        self.tails()
        self.squared()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def panels(self):
        self.tiles = {s: tile(s) for s in OUTS}
        left = RoundedRectangle(width=3.4, height=4.8, corner_radius=0.2, stroke_color="#3A4252", stroke_width=2)
        left.move_to([TILE_X, 0.35, 0])
        lt = P("outcomes", 24, C_DIM).next_to(left, UP, buff=0.15)
        right = RoundedRectangle(width=X1 - X0 + 0.9, height=6.5, corner_radius=0.2, stroke_color="#3A4252",
                                 stroke_width=2)
        right.move_to([(X0 + X1) / 2, -0.5, 0])
        rt_ = P("values", 24, C_DIM).next_to(right, UP, buff=0.15).align_to(right, LEFT).shift(RIGHT * 0.15)
        self.vl = ValueLine([0, 1, 2], [0.6, 2.7, 4.8])
        self.boxes = VGroup(left, lt, right, rt_)
        self.beat(FadeIn(left), FadeIn(lt), *[FadeIn(t, shift=RIGHT * 0.1) for t in self.tiles.values()],
                  rt=1.4)                                                   # yes-or-no questions
        self.beat(FadeIn(right), FadeIn(rt_), Create(self.vl.base), FadeIn(self.vl.ticks),
                  FadeIn(self.vl.labels))                                   # a number instead
        self.beat()                                                         # how many heads?
        self.beat()                                                         # the total?
        self.beat()                                                         # the error?
        self.pause(0.5)

    # ------------------------------------------------------------------------------------------------
    def counting(self):
        vl = self.vl
        heads = {"HH": 2, "HT": 1, "TH": 1, "TT": 0}
        self.ax = {s: arrow_to(s, vl.x(v), dx=SPLIT.get(s, (0, 0))[0], dy=SPLIT.get(s, (0, 0))[1]) for s, v in heads.items()}
        self.beat(*[Indicate(t, color=WHITE, scale_factor=1.08) for t in self.tiles.values()], lag=0.15)
        self.beat(Create(self.ax["HH"]), rt=1.0)                            # HH -> 2
        self.beat(Create(self.ax["HT"]), Create(self.ax["TH"]), rt=1.2)     # HT, TH -> 1
        self.beat(Create(self.ax["TT"]), rt=1.0)                            # TT -> 0

        bundle = VGroup(*self.ax.values())
        term = P("random\nvariable", 24, C_DIM, line_spacing=0.8).move_to([-1.85, 1.95, 0])
        self.beat(FadeIn(term))                                             # TERM: random variable
        self.beat()                                                         # nothing random inside
        self.beat(Circumscribe(bundle, color=WHITE, fade_out=True), rt=1.0)  # it's a function
        flash = self.ax["HT"].curve.copy().set_stroke(C_B, 6)
        self.beat(Indicate(self.tiles["HT"], color=C_B), ShowPassingFlash(flash, time_width=0.5),
                  Indicate(vl.label(1), color=C_B), rt=1.6)                 # outcome in, number out
        self.beat(*[Indicate(t, color=WHITE, scale_factor=1.08) for t in self.tiles.values()], lag=0.15)
        self.xlab = M("<i>X</i>", 44).move_to([-1.85, 1.75, 0])
        fx = eq("<i>X</i> : Ω → ℝ", size=32).move_to([RX - 1.0, 3.45, 0])
        xht = eq("<i>X</i>(HT)", "=", "1", size=32).move_to([RX + 2.0, 3.45, 0])
        flash = self.ax["HT"].curve.copy().set_stroke(C_B, 6)
        self.say()                                                          # call this one X. X(HT) = 1
        self.play(FadeIn(self.xlab), FadeIn(fx), FadeOut(term), run_time=1.0)
        self.wait(0.3)
        self.play(FadeIn(xht), ShowPassingFlash(flash, time_width=0.5), run_time=1.2)
        self.pause(0.5)
        self.fx, self.xht = fx, xht

    # ------------------------------------------------------------------------------------------------
    def pmf(self):
        vl = self.vl
        heads = {"HH": 2, "HT": 1, "TH": 1, "TT": 0}
        self.chips = {s: chip(s) for s in OUTS}
        self.qlab = {s: M("1/4", 26, WHITE).move_to(self.chips[s]) for s in OUTS}
        self.beat(FadeOut(self.fx), FadeOut(self.xht))                      # carry the mass across
        self.beat(*[FadeIn(VGroup(self.chips[s], self.qlab[s])) for s in OUTS], lag=0.15)   # a quarter each
        self.beat()                                                         # which value collects most?
        self.pause(3)                                                       # ⏸ predict

        self.beat(Indicate(vl.label(1), color=C_MASS, scale_factor=1.4))    # one.
        segs = {}

        def travel(s, k):
            c = self.chips[s]
            seg = segment(vl.x(heads[s]), k)
            segs[s] = seg
            return Succession(AnimationGroup(MoveAlongPath(c, self.ax[s].curve), FadeOut(self.qlab[s])),
                              Transform(c, seg))

        d = self.say()                                                      # two outcomes: a half
        self.play(travel("HT", 0), travel("TH", 1), run_time=min(2.4, d - 0.6))
        half = M("1/2", 28, C_MASS).next_to(segment(vl.x(1), 0, 2), UP, buff=0.12)
        self.play(FadeIn(half), run_time=0.4)
        self.say()                                       # zero and two: a quarter. PMF. P(X = 1) = 1/2
        self.play(travel("HH", 0), travel("TT", 0), run_time=1.6)
        q0 = M("1/4", 28, C_MASS).next_to(segment(vl.x(0), 0), UP, buff=0.12)
        q2 = M("1/4", 28, C_MASS).next_to(segment(vl.x(2), 0), UP, buff=0.12)
        self.play(FadeIn(q0), FadeIn(q2), run_time=0.4)
        self.bars = VGroup(*self.chips.values())
        self.barlabs = VGroup(q0, half, q2)

        pm = eq("<i>p<sub>X</sub></i>(<i>x</i>)", "=", "P(<i>X</i> = <i>x</i>)", size=32).move_to([RX - 0.75, 3.45, 0])
        term = P("probability mass function (PMF)", 24, C_DIM).move_to([1.9, 2.0, 0])
        self.wait(0.3)
        self.play(FadeIn(pm), FadeIn(term), run_time=1.0)                   # TERM: PMF
        self.wait(4.0)
        p1 = eq("<i>p<sub>X</sub></i>(1)", "=", "1/2", size=32).move_to([RX + 2.3, 3.45, 0])
        self.play(FadeIn(p1), Indicate(half, color=WHITE, scale_factor=1.3), run_time=1.2)   # P(X = 1) = 1/2
        self.pause(0.6)
        self.pm, self.p1, self.pmf_term = pm, p1, term

    # ------------------------------------------------------------------------------------------------
    def cdf(self):
        """The CDF as a threshold walk: slide a threshold right and plot the mass at or left of it."""
        vl = self.vl
        x0, x1, x2 = vl.x(0), vl.x(1), vl.x(2)
        xh = (x1 + x2) / 2                                                  # where 1.5 sits on the line
        fy = lambda v: LINE_Y + H * v                                       # noqa: E731
        W = WHITE

        def seg(a, b, v):
            return Line([a, fy(v), 0], [b, fy(v), 0], stroke_color=W, stroke_width=4)

        def closed(x, v):
            return Dot([x, fy(v), 0], radius=0.075, color=W)

        def open_(x, v):
            return Circle(radius=0.075, stroke_color=W, stroke_width=2.5).set_fill("#0e1116", 1).move_to([x, fy(v), 0])

        def riser(x, v, w):
            return DashedLine([x, fy(v), 0], [x, fy(w), 0], stroke_color=C_DIM, stroke_width=2, dash_length=0.08)

        def thresh(x):
            return DashedLine([x, LINE_Y - 0.15, 0], [x, fy(1) + 0.2, 0], stroke_color=C_B, stroke_width=3,
                              dash_length=0.12)

        bars = {0: [self.chips["TT"]], 1: [self.chips["HT"], self.chips["TH"]], 2: [self.chips["HH"]]}
        F = eq("<i>F<sub>X</sub></i>(<i>x</i>)", "=", "P(<i>X</i> ≤ <i>x</i>)", size=32).move_to([RX + 0.3, 3.45, 0])
        self.beat(FadeOut(self.pm), FadeOut(self.p1), FadeOut(self.pmf_term), FadeIn(F),
                  self.bars.animate.set_fill(opacity=0.25), self.barlabs.animate.set_opacity(0.0))   # at most

        # threshold at 0: only TT
        th = thresh(x0)
        s0, o0, d0 = seg(X0, x0, 0), open_(x0, 0), closed(x0, 0.25)
        r0 = riser(x0, 0, 0.25)
        l14 = M("1/4", 28).next_to(d0, UP, buff=0.14).shift(RIGHT * 0.45)
        self.beat(Create(th), *[b.animate.set_fill(opacity=0.9) for b in bars[0]], Create(s0), Create(r0),
                  FadeIn(o0), FadeIn(d0), FadeIn(l14), rt=1.6)                          # at most zero: a quarter
        # threshold at 1: the two one-head outcomes join
        s1, o1, d1 = seg(x0, x1, 0.25), open_(x1, 0.25), closed(x1, 0.75)
        r1 = riser(x1, 0.25, 0.75)
        l34 = M("3/4", 28).next_to(d1, UP, buff=0.14).shift(RIGHT * 0.45)
        self.beat(th.animate.move_to([x1, th.get_center()[1], 0]), *[b.animate.set_fill(opacity=0.9) for b in bars[1]],
                  Create(s1), l14.animate.move_to([(x0 + x1) / 2, fy(0.25) + 0.3, 0]), rt=1.4)  # at most one: 3/4
        self.play(FadeIn(o1), Create(r1), FadeIn(d1), FadeIn(l34), run_time=0.8)
        self.beat()                                                         # at most one and a half?
        self.pause(3)                                                       # ⏸ predict (nothing right of 1)

        # threshold at 1.5: nothing new
        s15 = seg(x1, xh, 0.75)
        tick15 = VGroup(Line([xh, LINE_Y - 0.07, 0], [xh, LINE_Y + 0.07, 0], stroke_color=C_DIM, stroke_width=2),
                        M("1.5", 26, C_DIM).move_to([xh, LAB_Y, 0]))
        self.beat(th.animate.move_to([xh, th.get_center()[1], 0]), Create(s15), FadeIn(tick15),
                  l34.animate.move_to([xh + 0.35, fy(0.75) + 0.3, 0]), rt=1.5)     # still three quarters
        # threshold at 2: the jump to 1
        s2, o2, d2 = seg(xh, x2, 0.75), open_(x2, 0.75), closed(x2, 1.0)
        r2 = riser(x2, 0.75, 1.0)
        s3 = seg(x2, X1, 1.0)
        l1 = M("1", 28).next_to(s3, UP, buff=0.14)
        d = self.say()                                                      # nothing new until two
        self.play(th.animate.move_to([x2, th.get_center()[1], 0]), Create(s2), FadeOut(tick15),
                  run_time=min(2.4, d * 0.5))
        self.play(*[b.animate.set_fill(opacity=0.9) for b in bars[2]], FadeIn(o2), Create(r2), FadeIn(d2),
                  Create(s3), FadeIn(l1), run_time=1.2)
        self.play(FadeOut(th), run_time=0.5)
        stair = VGroup(s0, o0, d0, r0, l14, s1, o1, d1, r1, l34, s15, s2, o2, d2, r2, s3, l1)
        path = VMobject().set_points_as_corners([s0.get_start(), s0.get_end(), d0.get_center(), s1.get_end(),
                                                 d1.get_center(), s2.get_end(), d2.get_center(), s3.get_end()])
        self.beat(ShowPassingFlash(path.set_stroke(C_B, 7), time_width=0.6), rt=1.8)   # only climbs
        self.beat(*[Indicate(m, color=C_B, scale_factor=1.8) for m in (d0, d1, d2)], lag=0.3, rt=2.2)  # jumps
        term = P("cumulative distribution\nfunction (CDF)", 24, C_DIM, line_spacing=0.8).move_to([1.35, 2.2, 0])
        self.beat(FadeIn(term))                                             # TERM: CDF
        self.pause(1.5)                                                     # ⏸ inspect the staircase
        self.play(FadeOut(stair), FadeOut(term), FadeOut(F), self.bars.animate.set_fill(opacity=0.85),
                  self.barlabs.animate.set_opacity(1), run_time=0.8)

    # ------------------------------------------------------------------------------------------------
    def tails(self):
        vl = self.vl
        tails = {"HH": 0, "HT": 1, "TH": 1, "TT": 2}
        self.aw = {s: arrow_to(s, vl.x(v), color=C_DIM, dx=0.22 + SPLIT.get(s, (0, 0))[0],
                               dy=-0.35 + SPLIT.get(s, (0, 0))[1]) for s, v in tails.items()}
        wlab = M("<i>W</i>", 44, C_DIM).move_to([-2.55, -3.3, 0])
        self.say()                                       # count tails: W. Same masses. 1/4, 1/2, 1/4
        self.play(*[fade_arrow(a, 0.35) for a in self.ax.values()], self.xlab.animate.set_opacity(0.5),
                  *[Create(a) for a in self.aw.values()], FadeIn(wlab), run_time=2.2)
        tops = {"HH": 0, "HT": 0, "TH": 1, "TT": 0}
        wchips = {s: chip(s) for s in OUTS}
        wsegs = {s: segment(vl.x(tails[s]), tops[s]).stretch(1.18, 0).set_fill(opacity=0).set_stroke("#B8BFCC", 3.5)
                 for s in OUTS}
        self.wait(0.3)
        self.add(*wchips.values())
        self.play(*[Succession(MoveAlongPath(wchips[s], self.aw[s].curve), Transform(wchips[s], wsegs[s]))
                    for s in OUTS], run_time=2.4)
        self.wbars = VGroup(*wchips.values())
        self.wait(0.2)
        self.play(LaggedStart(*[Indicate(m, color=WHITE, scale_factor=1.3) for m in self.barlabs], lag_ratio=0.5),
                  run_time=3.0)
        self.pause(0.4)

        # ---- the disagreement
        hl = {s: SurroundingRectangle(self.tiles[s], color=C_B, buff=0.07, corner_radius=0.12) for s in ("HH", "TT")}
        ro = {}
        for s, (xv, wv) in (("HH", (2, 0)), ("TT", (0, 2))):
            r = VGroup(M(f"<i>X</i> = {xv}", 26), M(f"<i>W</i> = {wv}", 26, C_DIM)).arrange(DOWN, buff=0.06,
                                                                                           aligned_edge=LEFT)
            r.next_to(self.tiles[s], LEFT, buff=0.2)
            ro[s] = r
        self.beat(*[Create(h) for h in hl.values()], *[FadeIn(r) for r in ro.values()],
                  *[fade_arrow(self.ax[s], 1) for s in ("HH", "TT")], rt=1.4)
        self.beat(Indicate(self.ax["HH"], color=WHITE, scale_factor=1.0),
                  Indicate(self.aw["HH"], color=WHITE, scale_factor=1.0), rt=1.4)   # different functions
        self.beat(Indicate(self.bars, color=WHITE, scale_factor=1.04), rt=1.4)       # about masses
        self.pause(0.6)
        self.wall = VGroup(*self.aw.values(), wlab, self.wbars, *hl.values(), *ro.values())

    # ------------------------------------------------------------------------------------------------
    def squared(self):
        old = self.vl
        nv = ValueLine([0, 1, 2, 3, 4], [0.4, 1.55, 2.7, 3.85, 5.0], dim_values=(2, 3))
        yeq = eq("<i>Y</i>", "=", "<i>X</i><sup>2</sup>", size=34).move_to([RX + 0.3, 3.45, 0])
        d = self.say()                                                      # let Y be X squared
        self.play(FadeOut(self.wall), FadeOut(VGroup(*self.ax.values())), FadeOut(self.xlab),
                  FadeOut(self.bars), FadeOut(self.barlabs), run_time=0.7)
        self.play(ReplacementTransform(old.ticks, nv.ticks[:3]), FadeIn(nv.ticks[3:]),
                  ReplacementTransform(old.labels, nv.labels[:3]), FadeIn(nv.labels[3:]),
                  FadeIn(yeq), run_time=min(1.2, max(0.4, d - 0.85)))
        self.vl = nv
        self.add(nv)
        self.beat()                                                         # what's its mass function?
        self.pause(6)                                                       # ⏸ work it out

        ysq = {"HH": 4, "HT": 1, "TH": 1, "TT": 0}
        ay = {s: arrow_to(s, nv.x(v), dx=SPLIT.get(s, (0, 0))[0], dy=SPLIT.get(s, (0, 0))[1]) for s, v in ysq.items()}
        ylab = M("<i>Y</i>", 44).move_to([-1.85, 1.75, 0])
        self.beat(Create(ay["TT"]), Create(ay["HT"]), Create(ay["TH"]), Create(ay["HH"]), FadeIn(ylab),
                  lag=0.35, rt=2.6)                                         # 0->0, 1->1, 2->4
        chips = {s: chip(s) for s in OUTS}
        tops = {"HH": 0, "HT": 0, "TH": 1, "TT": 0}
        d = self.say()                                                      # 1/4 at 0, 1/2 at 1, 1/4 at 4
        self.add(*chips.values())
        self.play(*[Succession(MoveAlongPath(chips[s], ay[s].curve), Transform(chips[s], segment(nv.x(ysq[s]),
                                                                                                tops[s])))
                    for s in OUTS], run_time=min(2.4, max(0.6, d - 0.7)))
        labs = VGroup(M("1/4", 28, C_MASS).next_to(segment(nv.x(0), 0), UP, buff=0.12),
                      M("1/2", 28, C_MASS).next_to(segment(nv.x(1), 0, 2), UP, buff=0.12),
                      M("1/4", 28, C_MASS).next_to(segment(nv.x(4), 0), UP, buff=0.12))
        self.play(FadeIn(labs), run_time=0.4)
        flash = [ay[s].curve.copy().set_stroke(C_B, 6) for s in OUTS]
        self.beat(*[ShowPassingFlash(f, time_width=0.5) for f in flash], lag=0.3, rt=2.4)   # push the mass through
