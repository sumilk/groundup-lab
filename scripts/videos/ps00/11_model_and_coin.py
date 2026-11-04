"""The model and the coin (docs/PS00_VIDEO_SCRIPT.md, section 11).

Two panels, because two spaces really exist: the model on the left (the mass we decided on), the simulation
on the right (outcomes drawn and counted). Every simulated number on screen is generated here, with fixed
seeds: 100 tosses with random.Random(1) give 47 heads; the copied-coin and independent histograms are 500 real
runs each.
"""
import random
import statistics

from kit import *  # noqa: F401,F403

# ---- the simulations (all real, all seeded) ---------------------------------------------------------------
TOSS_SEED = 1                      # random.Random(1): the first 100 tosses give 47 heads
PATH_SEEDS = list(range(101, 125))  # faint running-frequency paths
COPY_SEED = 2                      # 500 runs of one coin copied 1,000 times
INDEP_SEED = 12                    # 500 runs of 1,000 independent flips
RUNS_SEED = 21                     # 199 more independent 100-flip runs (plus the first, 47 heads)
N_MAX = 10_000


def flips(seed, n):
    r = random.Random(seed)
    return [r.random() < 0.5 for _ in range(n)]


def running(seq, ns):
    out, h, k = [], 0, 0
    for n in ns:
        while k < n:
            h += seq[k]
            k += 1
        out.append(h / n)
    return out


NS = sorted(set(int(round(10 ** (1 + 3 * t / 160))) for t in range(161)))
FIRST = flips(TOSS_SEED, N_MAX)
HEADS100 = sum(FIRST[:100])
assert HEADS100 == 47
_r = random.Random(COPY_SEED)
COPIED = [1.0 if _r.random() < 0.5 else 0.0 for _ in range(500)]          # each run: one flip, copied
_r = random.Random(INDEP_SEED)
INDEP = [sum(_r.random() < 0.5 for _ in range(1000)) / 1000 for _ in range(500)]
INDEP_SD = statistics.pstdev(INDEP)                                          # ~0.016
COPIED_SD = statistics.pstdev(COPIED)                                        # ~0.5
_r = random.Random(RUNS_SEED)
RUNS = [HEADS100] + [sum(_r.random() < 0.5 for _ in range(100)) for _ in range(199)]   # heads per 100-flip run
RUNS_SD = statistics.pstdev([k / 100 for k in RUNS])                         # ~0.05

# ---- layout --------------------------------------------------------------------------------------------------
LCX = -4.7                          # left panel centre
DIV_X = -2.45                       # divider between the panels
X0, X1 = -0.75, 6.25                # right axes: log10 n = 1 .. 4
Y0, Y1 = -2.75, 2.55                # right axes: fraction 0 .. 1
C_SIM = "#C9D1DC"                   # simulated data: plain light grey


def nx(n):
    return X0 + (np.log10(n) - 1) / 3 * (X1 - X0)


def fy(f):
    return Y0 + f * (Y1 - Y0)


def pt(n, f):
    return np.array([nx(n), fy(f), 0])


class ModelAndCoin(NScene):
    PARAS = [
        ["Everything so far has been about the model, the masses we decided on.",
         "A simulation does something different.",
         "It draws outcomes and counts them."],
        ["Flip a simulated fair coin a hundred times.",
         "The fraction of heads needn't be exactly a half.",
         "In this run it came out forty-seven out of a hundred.",
         "That fraction is the empirical frequency, and it's a different thing from the probability."],
        ["How far from a half should it be?",
         "Run the same hundred-flip experiment many times, each run independent of the others, and record the "
         "frequency each time.",
         "They cluster around a half, and most land within a tenth of it.",
         "How spread out they are has a name.",
         "A standard deviation is a measure of how widely values spread around their mean.",
         "The standard deviation of these frequencies is called the standard error.",
         "For a fair coin and a hundred flips, it's point oh five."],
        ["There's a formula for it, which a later chapter derives.",
         "Take p times one minus p, divide by n, and take the square root of that whole fraction.",
         "A quarter over a hundred, square-rooted, is point oh five."],
        ["The standard error is a scale for the fluctuation, not a bound.",
         "Some runs land further away, and adding flips doesn't shrink the error every single time.",
         "But on the whole it shrinks like one over the square root of n. "
         "A hundred times as many flips makes the standard error ten times smaller."],
        ["That formula depends on the flips being independent.",
         "Here's what happens when they aren't.",
         "Flip one fair coin, and copy its result into all thousand positions.",
         "Each position, on its own, is heads with probability a half, exactly as before."],
        ["Run that a few hundred times, and record the fraction of heads in each run.",
         "How spread out are those fractions?"],
        ["Completely.",
         "Every run gives either zero or one, and nothing in between.",
         "Measured the same way, the spread is as large as it can possibly be, about point five, instead of about point oh one six "
         "for independent flips.",
         "A thousand copies of one coin carry the information of a single flip."],
        ["So what can a simulation do?",
         "It can check your code against a model whose answer you already know.",
         "If the simulated birthday rooms had come out far from a half, we'd check both the calculation and the code, "
         "and try more runs.",
         "What it can't do is tell you the model matches the world.",
         "If real birthdays bunch up in some months, the simulation won't notice.",
         "It only knows the model you gave it."],
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
        self.hundred()
        self.error()
        self.copied()
        self.what_for()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def panels(self):
        # left: the model, one bar at height 1/2 (area/height is probability mass)
        h = 2.3
        base = 0.55
        ax = Line([LCX - 1.0, base, 0], [LCX - 1.0, base + h, 0], stroke_color="#5B6475", stroke_width=2)
        floor = Line([LCX - 1.0, base, 0], [LCX + 1.2, base, 0], stroke_color="#5B6475", stroke_width=2)
        ticks = VGroup(*[M(s, 24, C_DIM).next_to([LCX - 1.0, base + v * h, 0], LEFT, buff=0.14)
                         for s, v in (("0", 0), ("1/2", 0.5), ("1", 1))])
        bar = Rectangle(width=0.95, height=h / 2, stroke_color=C_MASS, stroke_width=2)
        bar.set_fill(C_MASS, opacity=0.55).move_to([LCX + 0.1, base + h / 4, 0])
        half = DashedLine([LCX - 1.0, base + h / 2, 0], [LCX + 1.2, base + h / 2, 0], dash_length=0.07,
                          stroke_color=C_DIM, stroke_width=1.5)
        heads = P("heads", 22, C_DIM).next_to(bar, DOWN, buff=0.14)
        plab = M("P(heads) = 1/2", 28).move_to([LCX + 0.45, base + h / 2 + 0.42, 0])
        mtitle = P("model", 26, C_DIM).move_to([LCX, 3.45, 0])
        self.model = VGroup(ax, floor, ticks, half, bar, heads, plab)
        self.mtitle = mtitle
        self.bar, self.plab = bar, plab

        # right: the simulation, fraction of heads against number of flips (log scale)
        rax = Line([X0 - 0.15, Y0, 0], [X0 - 0.15, Y1, 0], stroke_color="#5B6475", stroke_width=2)
        rfl = Line([X0 - 0.15, Y0, 0], [X1 + 0.3, Y0, 0], stroke_color="#5B6475", stroke_width=2)
        yt = VGroup(*[M(s, 24, C_DIM).next_to([X0 - 0.15, fy(v), 0], LEFT, buff=0.12)
                      for s, v in (("0", 0), ("1/2", 0.5), ("1", 1))])
        ytick = VGroup(*[Line([X0 - 0.22, fy(v), 0], [X0 - 0.08, fy(v), 0], stroke_color="#5B6475",
                              stroke_width=2) for v in (0, 0.5, 1)])
        xt = VGroup(*[T(s, 22, C_DIM).next_to([nx(n), Y0, 0], DOWN, buff=0.14)
                      for s, n in (("10", 10), ("100", 100), ("1,000", 1000), ("10,000", 10000))])
        xtick = VGroup(*[Line([nx(n), Y0 - 0.07, 0], [nx(n), Y0 + 0.07, 0], stroke_color="#5B6475",
                              stroke_width=2) for n in (10, 100, 1000, 10000)])
        ylab = P("fraction of heads", 22, C_DIM).rotate(PI / 2).move_to([X0 - 1.05, (Y0 + Y1) / 2, 0])
        xlab = P("number of flips", 22, C_DIM).move_to([(X0 + X1) / 2, Y0 - 0.85, 0])
        stitle = P("simulation", 26, C_DIM).move_to([(X0 + X1) / 2, 3.45, 0])
        self.raxes = VGroup(rax, rfl, yt, ytick, xt, xtick, ylab, xlab)
        self.stitle = stitle
        div = Line([DIV_X, 3.7, 0], [DIV_X, -3.7, 0], stroke_color="#3A4252", stroke_width=2)
        self.div = div

        self.beat(FadeIn(self.model), FadeIn(mtitle), rt=1.4)                 # the model, masses we decided
        self.beat(Create(div), FadeIn(self.raxes), FadeIn(stitle), rt=1.4)    # a simulation is different
        self.beat()                                                           # draws outcomes, counts them
        self.pause(0.4)

    # ------------------------------------------------------------------------------------------------
    def hundred(self):
        s, gap = 0.19, 0.05
        tiles = VGroup()
        for k in range(100):
            r, c = divmod(k, 10)
            t = RoundedRectangle(width=s, height=s, corner_radius=0.03, stroke_width=1.2)
            if FIRST[k]:
                t.set_stroke(WHITE).set_fill(WHITE, opacity=0.9)
            else:
                t.set_stroke(C_DIM).set_fill(opacity=0)
            t.move_to([c * (s + gap), -r * (s + gap), 0])
            tiles.add(t)
        tiles.move_to([2.6, 1.15, 0])
        lh = VGroup(RoundedRectangle(width=s, height=s, corner_radius=0.03, stroke_width=1.2, stroke_color=WHITE)
                    .set_fill(WHITE, opacity=0.9), P("heads", 22, C_DIM)).arrange(RIGHT, buff=0.15)
        lt = VGroup(RoundedRectangle(width=s, height=s, corner_radius=0.03, stroke_width=1.2, stroke_color=C_DIM),
                    P("tails", 22, C_DIM)).arrange(RIGHT, buff=0.15)
        legend = VGroup(lh, lt).arrange(DOWN, aligned_edge=LEFT, buff=0.2).next_to(tiles, RIGHT, buff=0.45)
        self.beat(LaggedStart(*[FadeIn(t, scale=0.6) for t in tiles], lag_ratio=0.03), FadeIn(legend), rt=2.4)

        half = DashedLine([X0 - 0.15, fy(0.5), 0], [X1 + 0.3, fy(0.5), 0], dash_length=0.1,
                          stroke_color=C_DIM, stroke_width=2)
        self.beat(Create(half))                                               # won't be exactly a half

        dot = Dot(pt(100, 0.47), radius=0.08, color=WHITE)
        phat = M("<i>p</i>̂ = 47/100", 30).move_to([nx(100) + 0.15, fy(0.47) - 0.75, 0])
        d = self.say()                                                        # forty-seven out of a hundred
        hs = VGroup(*[t for k, t in enumerate(tiles) if FIRST[k]])
        self.play(Indicate(hs, color=WHITE, scale_factor=1.15), run_time=min(0.9, d * 0.35))
        self.play(*[t.animate.move_to(dot.get_center()).scale(0.3).set_opacity(0) for t in tiles],
                  FadeOut(legend), FadeIn(dot), run_time=min(1.4, max(0.4, d * 0.45)))
        self.remove(tiles)
        self.play(FadeIn(phat), run_time=0.4)
        term = P("empirical frequency", 24, C_DIM).next_to(phat, DOWN, buff=0.14)
        self.beat(FadeIn(term), Indicate(self.plab, color=C_MASS, scale_factor=1.08))   # TERM, not the probability
        self.pause(0.6)
        self.half, self.dot, self.phat, self.term = half, dot, phat, term

    # ------------------------------------------------------------------------------------------------
    def error(self):
        self.beat(FadeOut(self.term), FadeOut(self.phat))                     # how far from a half?

        # 200 independent 100-flip runs pile into a sideways histogram at n = 100 (bins of 0.03 around 1/2)
        w, h = 0.05, 0.13
        x0 = nx(100) + 0.14
        fill = {}
        order = []
        for k in RUNS:
            b = round((k - 50) / 3)
            c = fill.get(b, 0)
            fill[b] = c + 1
            sq = Rectangle(width=w * 0.8, height=h, stroke_width=0).set_fill(C_SIM, 0.8)
            sq.move_to([x0 + (c + 0.5) * w, fy(0.5 + 0.03 * b), 0])
            sq.k = k
            order.append(sq)
        pile = VGroup(*order)
        first = order[0]
        # while the pile is up, the horizontal direction counts runs, not flips: swap the flips axis for a
        # bar-length key so the pile's width can't be read as more flips (full v2 review, 35:13)
        xt, xtick, xlab = self.raxes[4], self.raxes[5], self.raxes[7]
        key_arrow = Arrow([x0, Y0 - 0.32, 0], [x0 + 0.8, Y0 - 0.32, 0], buff=0, stroke_width=2.5,
                          color=C_SIM, max_tip_length_to_length_ratio=0.12)
        key1 = P("bar length = number of runs", 22, C_SIM).next_to(key_arrow, RIGHT, buff=0.15)
        key2 = P("200 runs, 100 flips each", 22, C_DIM).next_to(key1, DOWN, buff=0.2).align_to(key_arrow, LEFT)
        assert key1.get_right()[0] <= 6.6, key1.get_right()
        self.run_key = VGroup(key_arrow, key1, key2)
        self.flip_axis = VGroup(xt, xtick, xlab)
        d = self.say()                                                        # run it many times
        self.play(FadeOut(self.dot, target_position=first.get_center()), FadeIn(first),
                  FadeOut(self.flip_axis), FadeIn(self.run_key), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(sq, shift=LEFT * 0.4) for sq in order[1:]], lag_ratio=0.02),
                  run_time=min(4.0, max(1.0, d - 0.7)))
        tenth = Rectangle(width=x0 + 2.6 - (nx(100) - 0.05), height=fy(0.6) - fy(0.4), stroke_width=0)
        tenth.set_fill(C_SIM, 0.1).move_to([(nx(100) - 0.05 + x0 + 2.6) / 2, fy(0.5), 0])
        tl = VGroup(DashedLine(pt(100, 0.6) + LEFT * 0.05, [x0 + 2.6, fy(0.6), 0], dash_length=0.07,
                               stroke_color=C_DIM, stroke_width=1.5),
                    DashedLine(pt(100, 0.4) + LEFT * 0.05, [x0 + 2.6, fy(0.4), 0], dash_length=0.07,
                               stroke_color=C_DIM, stroke_width=1.5))
        inside = sum(abs(k - 50) <= 10 for k in RUNS)
        tlab = P(f"{inside} of 200 within 0.1", 22, C_DIM).next_to(tl[0], UP, buff=0.22).align_to(tl[0], RIGHT)
        self.beat(FadeIn(tenth), Create(tl), FadeIn(tlab))                    # cluster; most within a tenth

        sd1 = P("standard deviation", 24, C_DIM).move_to([LCX, -0.5, 0])
        sd2 = P("spread around the mean", 22, C_DIM).next_to(sd1, DOWN, buff=0.12)
        self.beat(FadeOut(tenth), FadeOut(tl), FadeOut(tlab))                 # it has a name
        self.beat(FadeIn(sd1), FadeIn(sd2))                                   # TERM standard deviation

        lo, hi = 0.45, 0.55
        bx = nx(100) - 0.08
        band = VGroup(
            Line([bx, fy(lo), 0], [bx, fy(hi), 0], stroke_color=WHITE, stroke_width=3),
            Line([bx, fy(lo), 0], [bx + 0.12, fy(lo), 0], stroke_color=WHITE, stroke_width=3),
            Line([bx, fy(hi), 0], [bx + 0.12, fy(hi), 0], stroke_color=WHITE, stroke_width=3))
        selab = P("standard error", 24).next_to(band, LEFT, buff=0.15).shift(UP * 0.2)
        self.beat(Create(band), FadeIn(selab))                                # TERM standard error
        pm = M("± 0.05", 26).next_to(band, LEFT, buff=0.15).shift(DOWN * 0.2)
        self.beat(FadeIn(pm))                                                 # 0.05
        self.pause(0.6)

        # the formula, built in step with the narration
        se = P("standard error", 24, C_DIM).move_to([LCX, -0.4, 0])
        f1 = M("= √(<i>p</i>(1 − <i>p</i>) / <i>n</i>)", 30).move_to([LCX, -1.05, 0])
        f2 = M("= √(0.25 / 100)", 30).move_to([LCX, -1.7, 0])
        f3 = M("= 0.05", 30).move_to([LCX, -2.35, 0])
        VGroup(f2, f3).align_to(f1, LEFT)
        note = P("derived in a later chapter", 22, C_DIM).move_to([LCX, -3.0, 0])
        self.beat(FadeOut(sd1), FadeOut(sd2), FadeIn(se), FadeIn(note))       # a formula, a later chapter
        self.beat(FadeIn(f1))                                                 # p(1-p), over n, square root
        self.beat(FadeIn(f2), FadeIn(f3), lag=0.4)                            # a quarter over a hundred: 0.05
        self.pause(2)                                                         # ⏸ read the finished formula

        outside = VGroup(*[sq for sq in order if abs(sq.k - 50) > 5])
        self.beat(Indicate(outside, color=WHITE, scale_factor=1.0), Indicate(band, color=WHITE))   # not a bound
        self.pm, self.band, self.pile, self.note = pm, band, pile, note
        self.selab = selab

        # many runs: faint running-frequency paths, and the funnel 1/2 +- 0.5/sqrt(n)
        paths = VGroup()
        for sd in PATH_SEEDS:
            ys = running(flips(sd, N_MAX), NS)
            p = VMobject(stroke_color=C_SIM, stroke_width=1.3, stroke_opacity=0.4)
            p.set_points_as_corners([pt(n, y) for n, y in zip(NS, ys)])
            paths.add(p)
        mine = VMobject(stroke_color=WHITE, stroke_width=2.4)
        mine.set_points_as_corners([pt(n, y) for n, y in zip(NS, running(FIRST, NS))])
        pm, band, selab = self.pm, self.band, self.selab
        pm_up = pm.copy().move_to([nx(100), fy(0.74), 0])
        lead = DashedLine(pm_up.get_bottom() + DOWN * 0.08, pt(100, 0.55) + UP * 0.05, dash_length=0.06,
                          stroke_color=C_SIM, stroke_width=1.5)
        self.beat(LaggedStart(*[Create(p) for p in paths], lag_ratio=0.04), Create(mine),
                  Transform(pm, pm_up), FadeIn(lead), FadeOut(self.pile), FadeOut(selab), FadeOut(self.note),
                  FadeOut(self.run_key), FadeIn(self.flip_axis), rt=2.6)     # further away; flips axis back

        up = [pt(n, 0.5 + 0.5 / np.sqrt(n)) for n in NS]
        dn = [pt(n, 0.5 - 0.5 / np.sqrt(n)) for n in NS]
        funnel = Polygon(*up, *reversed(dn), stroke_width=0).set_fill(C_SIM, opacity=0.12)
        edges = VGroup(VMobject(stroke_color=C_SIM, stroke_width=2).set_points_as_corners(up),
                       VMobject(stroke_color=C_SIM, stroke_width=2).set_points_as_corners(dn))
        rate = M("shrinks like 1/√<i>n</i>", 28).move_to([LCX, -3.05, 0])
        d = self.say()                                                        # 1/sqrt(n); 100x flips, 10x smaller
        self.play(FadeIn(funnel), Create(edges), FadeIn(rate), run_time=1.6)
        self.wait(max(0.1, d * 0.5 - 1.6))

        band2 = VGroup(
            Line(pt(10000, 0.495), pt(10000, 0.505), stroke_color=WHITE, stroke_width=4),
            Line(pt(10000, 0.495) + LEFT * 0.1, pt(10000, 0.495) + RIGHT * 0.1, stroke_color=WHITE, stroke_width=3),
            Line(pt(10000, 0.505) + LEFT * 0.1, pt(10000, 0.505) + RIGHT * 0.1, stroke_color=WHITE, stroke_width=3))
        pm2 = M("± 0.005", 26, WHITE).move_to([nx(10000) - 0.35, fy(0.5) + 0.75, 0])
        self.play(Create(band2), FadeIn(pm2), Indicate(pm, color=WHITE), run_time=1.2)
        self.pause(0.8)
        self.err = VGroup(band, pm, lead, paths, mine, funnel, edges, band2, pm2, self.half)
        self.f = VGroup(se, f1, f2, f3, rate)
        self.se_f1 = f1

    # ------------------------------------------------------------------------------------------------
    def copied(self):
        indep = P("independent flips", 22, C_B).next_to(self.se_f1, DOWN, buff=0.0).move_to([LCX, -0.35, 0])
        self.beat(Circumscribe(self.se_f1, color=C_B), FadeIn(indep), FadeOut(self.f[0]))   # needs independence
        self.f.remove(self.f[0])
        self.f.add(indep)
        self.beat(FadeOut(self.err), FadeOut(self.raxes), FadeOut(self.f), rt=0.9)   # when they aren't

        r = random.Random(COPY_SEED)
        first_is_heads = r.random() < 0.5
        face = "H" if first_is_heads else "T"
        coin = VGroup(RoundedRectangle(width=0.8, height=0.8, corner_radius=0.14, stroke_color=WHITE,
                                       stroke_width=2.5), T(face, 36))
        coin.move_to([0.0, 1.6, 0])
        one = P("one fair coin", 22, C_DIM).next_to(coin, UP, buff=0.2)
        copies = VGroup()
        for k in range(30):
            rr, cc = divmod(k, 10)
            c = VGroup(RoundedRectangle(width=0.36, height=0.36, corner_radius=0.07, stroke_color=WHITE,
                                        stroke_width=1.5), T(face, 18))
            c.move_to([1.55 + cc * 0.46, 2.05 - rr * 0.46, 0])
            copies.add(c)
        dots = T("…", 30, C_DIM).next_to(copies, DOWN, buff=0.12)
        nlab = P("all 1,000 positions", 22, C_DIM).next_to(dots, DOWN, buff=0.1)
        arrows = VGroup(Arrow(coin.get_right(), copies.get_left() + LEFT * 0.05, buff=0.12, color=C_DIM,
                              stroke_width=3, max_tip_length_to_length_ratio=0.25))
        d = self.say()                                                        # one coin, copied 1,000 times
        self.play(FadeIn(coin), FadeIn(one), run_time=min(0.8, d * 0.3))
        self.play(GrowArrow(arrows[0]),
                  LaggedStart(*[TransformFromCopy(coin, c) for c in copies], lag_ratio=0.03),
                  FadeIn(dots), FadeIn(nlab), run_time=min(2.4, max(0.5, d * 0.6)))
        each = M("each position:  P(heads) = 1/2", 28).move_to([2.85, -0.6, 0])
        self.beat(FadeIn(each), Indicate(self.bar, color=C_MASS, scale_factor=1.06))  # each on its own, 1/2
        self.pause(0.4)
        self.copy_pic = VGroup(coin, one, copies, dots, nlab, arrows, each)

    # ------------------------------------------------------------------------------------------------
    def histogram(self):
        """Axes for 'fraction of heads in a run' (0..1) against number of runs (0..300)."""
        hx0, hx1 = -0.2, 5.9
        hy0, hy1 = -2.6, 2.35
        self.hx = lambda f: hx0 + f * (hx1 - hx0)                             # noqa: E731
        self.hy = lambda c: hy0 + c / 300 * (hy1 - hy0)                       # noqa: E731
        ax = Line([hx0 - 0.5, hy0, 0], [hx0 - 0.5, hy1, 0], stroke_color="#5B6475", stroke_width=2)
        fl = Line([hx0 - 0.5, hy0, 0], [hx1 + 0.5, hy0, 0], stroke_color="#5B6475", stroke_width=2)
        xt = VGroup(*[M(s, 24, C_DIM).next_to([self.hx(v), hy0, 0], DOWN, buff=0.14)
                      for s, v in (("0", 0), ("1/2", 0.5), ("1", 1))])
        xtick = VGroup(*[Line([self.hx(v), hy0 - 0.07, 0], [self.hx(v), hy0 + 0.07, 0], stroke_color="#5B6475",
                              stroke_width=2) for v in (0, 0.5, 1)])
        yt = VGroup(*[T(str(c), 20, C_DIM).next_to([hx0 - 0.5, self.hy(c), 0], LEFT, buff=0.12)
                      for c in (0, 100, 200, 300)])
        ytick = VGroup(*[Line([hx0 - 0.57, self.hy(c), 0], [hx0 - 0.43, self.hy(c), 0], stroke_color="#5B6475",
                              stroke_width=2) for c in (100, 200, 300)])
        ylab = P("runs", 22, C_DIM).rotate(PI / 2).move_to([hx0 - 1.3, (hy0 + hy1) / 2, 0])
        xlab = P("fraction of heads, across 500 runs", 22, C_DIM).move_to([(hx0 + hx1) / 2, hy0 - 0.85, 0])
        return VGroup(ax, fl, xt, xtick, yt, ytick, ylab, xlab)

    def what_for(self):
        hist_axes = self.histogram()
        self.beat(FadeOut(self.copy_pic), FadeIn(hist_axes), rt=1.4)          # run it a few hundred times
        self.beat()                                                           # how spread out?
        self.pause(3)                                                         # ⏸ predict (spikes hidden)

        n1 = int(sum(COPIED))
        n0 = len(COPIED) - n1
        w = 0.32
        s0 = Rectangle(width=w, height=self.hy(n0) - self.hy(0), stroke_color=C_MASS, stroke_width=2)
        s0.set_fill(C_MASS, opacity=0.7).move_to([self.hx(0), (self.hy(n0) + self.hy(0)) / 2, 0])
        s1 = Rectangle(width=w, height=self.hy(n1) - self.hy(0), stroke_color=C_MASS, stroke_width=2)
        s1.set_fill(C_MASS, opacity=0.7).move_to([self.hx(1), (self.hy(n1) + self.hy(0)) / 2, 0])
        self.beat(GrowFromEdge(s0, DOWN), GrowFromEdge(s1, DOWN), rt=1.0)     # completely
        c0 = T(f"{n0}", 24).next_to(s0, UP, buff=0.12)
        c1 = T(f"{n1}", 24).next_to(s1, UP, buff=0.12)
        self.beat(FadeIn(c0), FadeIn(c1))                                     # zero or one, nothing between

        # the independent comparison: 500 runs of 1,000 independent flips, bins of 0.01
        bins = {}
        for f in INDEP:
            b = int(np.floor(f * 100 + 1e-9))
            bins[b] = bins.get(b, 0) + 1
        bw = self.hx(0.01) - self.hx(0)
        hump = VGroup()
        for b, c in sorted(bins.items()):
            r = Rectangle(width=bw, height=self.hy(c) - self.hy(0), stroke_color=C_SIM, stroke_width=1,
                          stroke_opacity=0.5)
            r.set_fill(C_SIM, opacity=0.3).move_to([self.hx((b + 0.5) / 100), (self.hy(c) + self.hy(0)) / 2, 0])
            hump.add(r)
        top = max(bins.values())
        hl = P(f"independent flips, spread ≈ {INDEP_SD:.3f}", 22, C_SIM)
        hl.move_to([self.hx(0.5), self.hy(top) + 0.4, 0])
        cl = P(f"copied coin, spread ≈ {COPIED_SD:.1f}", 24, C_MASS).move_to([self.hx(0.5), self.hy(250) + 0.35, 0])
        self.beat(FadeIn(cl), LaggedStart(*[GrowFromEdge(r, DOWN) for r in hump], lag_ratio=0.05), FadeIn(hl),
                  rt=2.2)                                                     # 0.5 vs 0.016
        self.beat(Indicate(VGroup(s0, s1), color=C_MASS, scale_factor=1.08))  # one flip's information
        self.pause(0.6)

        # ---- what a simulation can and can't do
        floor = hist_axes[1]
        core = VGroup(floor, s0, s1, hump)
        globe = VGroup(Circle(radius=0.75, stroke_color=C_CLEAN, stroke_width=2.5),
                       Ellipse(width=0.6, height=1.5, stroke_color=C_CLEAN, stroke_width=1.5),
                       Line([-0.75, 0, 0], [0.75, 0, 0], stroke_color=C_CLEAN, stroke_width=1.5),
                       Ellipse(width=1.3, height=0.42, stroke_color=C_CLEAN, stroke_width=1.2).shift(UP * 0.38),
                       Ellipse(width=1.3, height=0.42, stroke_color=C_CLEAN, stroke_width=1.2).shift(DOWN * 0.38))
        globe.move_to([5.55, 0.45, 0])
        wl = P("the world", 24, C_CLEAN).move_to([globe.get_center()[0], -1.55, 0])
        d = self.say()                                                        # what can a simulation do?
        rest = VGroup(*[m for m in hist_axes if m is not floor], hl, cl, c0, c1)
        self.play(FadeOut(self.div), FadeOut(self.stitle), FadeOut(rest), FadeOut(self.mtitle),
                  core.animate.scale(0.45).move_to([1.35, 0.45, 0]),
                  self.model.animate.move_to([-5.05, 0.45, 0]),
                  run_time=min(1.6, max(0.5, d - 0.1)))
        sim = core
        stl = P("simulation", 24, C_DIM).move_to([sim.get_center()[0], wl.get_center()[1], 0])
        mtl = P("model", 24, C_DIM).move_to([self.model.get_center()[0], wl.get_center()[1], 0])
        self.play(FadeIn(stl), FadeIn(mtl), run_time=0.4)
        a1 = Arrow([self.model.get_right()[0] + 0.15, 0.45, 0], [sim.get_left()[0] - 0.15, 0.45, 0], buff=0,
                   color=WHITE, stroke_width=4, max_tip_length_to_length_ratio=0.15)
        a1l = P("checks the code", 24).next_to(a1, UP, buff=0.2)
        self.beat(GrowArrow(a1), FadeIn(a1l))                                 # check your code
        self.beat(Indicate(a1l, color=WHITE, scale_factor=1.08))              # birthday rooms
        a2 = Arrow([sim.get_right()[0] + 0.15, 0.45, 0], [globe.get_left()[0] - 0.15, 0.45, 0], buff=0,
                   color=C_DIM, stroke_width=4, max_tip_length_to_length_ratio=0.2)
        mid = a2.get_center()
        x = VGroup(Line(mid + UL * 0.22, mid + DR * 0.22), Line(mid + DL * 0.22, mid + UR * 0.22)).set_stroke(C_X, 5)
        self.beat(FadeIn(globe), FadeIn(wl), GrowArrow(a2), Create(x), rt=1.4)  # can't tell you the world
        self.beat(Indicate(globe, color=C_CLEAN, scale_factor=1.08))          # birthdays bunch up
        self.beat(Indicate(VGroup(self.model, mtl), color=WHITE, scale_factor=1.05))   # only the model it got
