"""The average you'll never roll (docs/PS00_VIDEO_SCRIPT.md, section 10).

Expectation as a balance point: masses sit on a beam and the pivot slides to where it levels. One die balances at
3.5, two dice at 7. Then linearity, the indicator (a 1/0 function on the dice grid), the expected number of shared
birthdays among 23 people (253 pair lines, one glowing) and the three-person triangle showing the dependence.
"""
from kit import *  # noqa: F401,F403

RX = 3.35
BAR_H = 7.2            # bar height per unit probability (1/6 -> 1.2)


class Beam(VGroup):
    """Purple bars of mass sitting on a thin beam; value labels under the beam; a triangular pivot underneath.

    The beam tilts about the pivot until the pivot reaches the balance point. Built level, then rotated, so it can
    be redrawn from (pivot value, tilt) by an updater.
    """

    def __init__(self, masses: dict, x_of, y, bar_w, pivot_v, tilt=0.0, mass_labels=None, label_size=26):
        super().__init__()
        self.masses, self.x_of, self.y, self.bar_w = masses, x_of, y, bar_w
        vals = sorted(masses)
        x_lo, x_hi = x_of(vals[0]) - bar_w * 0.9, x_of(vals[-1]) + bar_w * 0.9
        self.plank = Rectangle(width=x_hi - x_lo, height=0.07, stroke_width=0).set_fill("#C9CED8", 1)
        self.plank.move_to([(x_lo + x_hi) / 2, y, 0])
        self.bars = VGroup()
        for v in vals:
            h = BAR_H * masses[v]
            r = Rectangle(width=bar_w, height=h, stroke_color="#0e1116", stroke_width=1.5).set_fill(C_MASS, 0.85)
            r.move_to([x_of(v), y + 0.035 + h / 2, 0])
            self.bars.add(r)
        self.vlabels = VGroup(*[M(str(v), label_size, C_DIM).move_to([x_of(v), y - 0.72, 0]) for v in vals])
        self.mlabels = VGroup()
        if mass_labels:
            for v, b in zip(vals, self.bars):
                if v in mass_labels:
                    self.mlabels.add(M(mass_labels[v], 26, C_MASS).next_to(b, UP, buff=0.1))
        self.body = VGroup(self.plank, self.bars, self.vlabels, self.mlabels)
        tri = Triangle(stroke_color="#C9CED8", stroke_width=2).set_fill("#2A3140", 1)
        tri.stretch_to_fit_width(0.5).stretch_to_fit_height(0.42)
        self.pivot = tri
        self.add(self.body, self.pivot)
        self.place(pivot_v, tilt)

    def place(self, pivot_v, tilt):
        px = self.x_of(pivot_v)
        top = np.array([px, self.y - 0.035, 0])
        self.pivot.move_to(top + DOWN * 0.21)
        self.body.rotate(tilt, about_point=top)
        self.tilt = tilt
        return self


def balance_tilt(v, centre, span):
    """A beam supported away from its balance point tips towards the heavy side."""
    return float(np.clip(-0.28 * (centre - v) / span, -0.2, 0.2))


def person(color="#C9CED8", s=1.0):
    head = Circle(radius=0.085 * s, stroke_width=0).set_fill(color, 1)
    body = Sector(radius=0.14 * s, angle=PI, start_angle=0, stroke_width=0).set_fill(color, 1)
    body.move_to(ORIGIN).shift(DOWN * 0.07 * s)
    head.next_to(body, UP, buff=0.025 * s)
    return VGroup(head, body)


class Expectation(NScene):
    PARAS = [
        ["Roll one fair die many times.",
         "What does the average settle near?",
         "Picture the six equal masses sitting on a beam.",
         "Where would it balance?"],
        ["At three and a half.",
         "The masses are symmetric around it.",
         "That balance point is called the expected value.",
         "Take each value times its probability, and add.",
         "A sixth of one, plus a sixth of two, and so on up to six.",
         "Twenty-one sixths, which is three and a half.",
         "No single roll ever shows three and a half.",
         "The expected value is a weighted average, not a value you should expect to see."],
        ["Now two dice.",
         "Before using any rule, try three rolls.",
         "Four and two, then six and five, then one and three.",
         "The totals are six, eleven and four, which add to twenty-one.",
         "Or add the first dice on their own, four, six and one, which is eleven.",
         "Then the second dice, two, five and three, which is ten.",
         "Eleven plus ten is twenty-one again.",
         "Adding the totals is the same as adding each die's numbers separately, and dividing by the number of "
         "rolls doesn't change that.",
         "That's intuition from one short list, not yet the expected value.",
         "But the same regrouping works when we weight each possible pair of rolls by its probability, and that's "
         "why the expected value of a sum is the sum of the expected values."],
        ["For two dice that's three and a half plus three and a half, which is seven.",
         "And seven, unlike three and a half, is a total you can actually roll.",
         "That rule is called linearity of expectation, and it needs nothing about how the two numbers are related.",
         "It holds even when they depend on each other.",
         "Take one die and add it to itself.",
         "The total is always even, and the two parts are completely dependent.",
         "Its average is still three and a half plus three and a half."],
        ["Linearity becomes powerful with one simple device.",
         "For any event, define a number that's one if the event happens and zero if it doesn't.",
         "It's called an indicator.",
         "Its expected value is one times the probability of the event, plus zero times the rest.",
         "That's just the probability of the event."],
        ["Back to the twenty-three people, with independent, equally likely birthdays.",
         "On average, how many pairs share a birthday?",
         "Start with one pair.",
         "Give it an indicator, one if those two people share a birthday and zero if they don't.",
         "They share with probability one in three hundred and sixty-five, so the indicator's expected value is "
         "one over three hundred and sixty-five."],
        ["Now look at three people.",
         "Knowing that the first two share a birthday doesn't change the chance that the first and third do.",
         "It's still one in three hundred and sixty-five.",
         "Taken two at a time, these indicators behave independently.",
         "But if the first and second share, and the second and third share too, then the first and third "
         "certainly do.",
         "So all three together are tied.",
         "They're pairwise independent, but not mutually independent.",
         "Linearity needs neither kind of independence."],
        ["Every one of the two hundred and fifty-three pairs gets its own indicator, and the number of sharing "
         "pairs is the sum of all of them.",
         "So its expected value is the sum of their expected values.",
         "Two hundred and fifty-three times one over three hundred and sixty-five, which is about point six nine."],
        ["Ten rolls of a die.",
         "How many sixes do you expect?"],
        ["Ten indicators, one for each roll, each with expected value a sixth.",
         "Ten sixths.",
         "One and two thirds."],
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
        self.one_die()
        self.two_dice()
        self.indicator()
        self.birthdays()
        self.check_in()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    @staticmethod
    def slide(beam, v_to, tilt_to=None, centre=None, span=None):
        """Animation: the pivot slides under the beam to v_to while the beam tilts (towards level at the balance)."""
        level = beam.body.copy().rotate(-beam.tilt, about_point=beam.pivot.get_top())
        v_from, t_from = beam.pivot_v, beam.tilt

        def upd(m, a):
            v = v_from + (v_to - v_from) * a
            if tilt_to is None:
                t = balance_tilt(v, centre, span)
            else:
                t = t_from + (tilt_to - t_from) * a
            top = np.array([beam.x_of(v), beam.y - 0.035, 0])
            beam.body.become(level.copy().rotate(t, about_point=top))
            beam.pivot.move_to(top + DOWN * 0.21)
            beam.tilt = t

        beam.pivot_v = v_to
        return UpdateFromAlphaFunc(beam, upd)

    def one_die(self):
        x_of = lambda v: -5.5 + (v - 1) * 1.0          # noqa: E731
        b = Beam({v: 1 / 6 for v in range(1, 7)}, x_of, 1.0, 0.7, pivot_v=1,
                 mass_labels={v: "1/6" for v in range(1, 7)})
        b.pivot_v = 1
        self.b1 = b
        self.beat(FadeIn(b.bars, lag_ratio=0.1), FadeIn(b.vlabels), FadeIn(b.mlabels), rt=1.6)   # roll one die
        self.beat()                                                         # where does the average settle?
        self.beat(FadeIn(b.plank), FadeIn(b.pivot), rt=0.8)                 # six masses on a beam
        self.play(self.slide(b, 1, tilt_to=balance_tilt(1, 3.5, 2.5)), run_time=1.0, rate_func=rush_into)
        self.beat()                                                         # where would it balance?
        self.pause(3)                                                       # ⏸ predict

        self.beat(self.slide(b, 3.5, centre=3.5, span=2.5), rt=1.35)        # at three and a half
        pairs = [(0, 5), (1, 4), (2, 3)]
        self.beat(*[AnimationGroup(Indicate(b.bars[i], color=WHITE, scale_factor=1.08),
                                   Indicate(b.bars[j], color=WHITE, scale_factor=1.08)) for i, j in pairs],
                  lag=0.45, rt=2.0)                                         # symmetric around it
        ev = M("3.5", 30, C_B).move_to([x_of(3.5), -0.05, 0])
        term = P("expected value", 24, C_DIM).next_to(ev, DOWN, buff=0.15)
        self.beat(FadeIn(ev), FadeIn(term))                                 # TERM: expected value
        r1 = eq("E[<i>X</i>]", "=", "Σ <i>x</i> · <i>p</i>(<i>x</i>)", size=34).move_to([RX, 2.3, 0])
        r2 = eq("=", "(1 + 2 + 3 + 4 + 5 + 6)/6", size=32)
        r2.move_to([RX, 1.5, 0]).align_to(r1[1], LEFT)
        over = r2.get_right()[0] - 6.55
        if over > 0:
            r1.shift(LEFT * over)
            r2.shift(LEFT * over)
        self.beat(FadeIn(r1))                                               # value times probability, add
        self.beat(FadeIn(r2), *[Indicate(m, color=WHITE, scale_factor=1.3) for m in b.mlabels], lag=0.12, rt=2.6)
        r3 = eq("=", "21/6", "=", "3.5", size=34, colors={3: C_B})
        r3.move_to([RX, 0.7, 0]).align_to(r1[1], LEFT)
        self.beat(FadeIn(r3))                                               # 21/6 = 3.5
        gap = DashedLine([x_of(3.5), 1.1, 0], [x_of(3.5), 2.5, 0], color=C_B, dash_length=0.1, stroke_width=3)
        self.beat(Create(gap), Indicate(ev, color=C_B), rt=1.4)             # no roll shows 3.5
        self.beat(Circumscribe(r1, color=C_DIM), rt=1.6)                    # a weighted average
        self.pause(0.6)
        self.ev, self.ev_term, self.gap, self.rows1 = ev, term, gap, VGroup(r1, r2, r3)

    # ------------------------------------------------------------------------------------------------
    def two_dice(self):
        # ---- intuition first: three rolls, added two ways
        cx = {"a": 1.55, "b": 3.05, "t": 4.75}
        ys = [2.0, 1.35, 0.7]
        head = VGroup(P("first", 24, C_DIM).move_to([cx["a"], 2.7, 0]), P("second", 24, C_DIM).move_to([cx["b"], 2.7, 0]),
                      P("total", 24, C_DIM).move_to([cx["t"], 2.7, 0]))
        rolls = [(4, 2), (6, 5), (1, 3)]
        pairs = VGroup(*[VGroup(M(str(u), 32).move_to([cx["a"], y, 0]), M(str(v), 32).move_to([cx["b"], y, 0]))
                         for (u, v), y in zip(rolls, ys)])
        tots = VGroup(*[M(str(u + v), 32).move_to([cx["t"], y, 0]) for (u, v), y in zip(rolls, ys)])
        rule = Line([cx["a"] - 0.6, 0.3, 0], [cx["t"] + 0.6, 0.3, 0], stroke_color=C_DIM, stroke_width=2)
        s_t = M("21", 32, C_B).move_to([cx["t"], -0.1, 0])
        s_a = M("11", 32).move_to([cx["a"], -0.1, 0])
        s_b = M("10", 32).move_to([cx["b"], -0.1, 0])
        d = self.say()                                                      # now two dice
        self.play(FadeOut(self.rows1), FadeOut(self.ev_term), FadeOut(self.gap), run_time=0.6)
        self.play(FadeIn(head), run_time=min(0.6, max(0.3, d - 0.75)))
        self.beat()                                                         # try three rolls
        self.beat(*[FadeIn(r, shift=DOWN * 0.1) for r in pairs], lag=0.55, rt=2.6)   # (4,2), (6,5), (1,3)
        d = self.say()                                                      # totals 6, 11, 4 -> 21
        self.play(LaggedStart(*[FadeIn(t) for t in tots], lag_ratio=0.5), run_time=min(2.0, d * 0.55))
        self.play(Create(rule), FadeIn(s_t), run_time=0.7)
        col_a = SurroundingRectangle(VGroup(*[r[0] for r in pairs]), color=C_DIM, buff=0.15, corner_radius=0.1)
        self.beat(Create(col_a), FadeIn(s_a), rt=1.4)                       # first dice: 11
        col_b = SurroundingRectangle(VGroup(*[r[1] for r in pairs]), color=C_DIM, buff=0.15, corner_radius=0.1)
        self.beat(ReplacementTransform(col_a, col_b), FadeIn(s_b), rt=1.4)  # second dice: 10
        again = eq("11 + 10", "=", "21", size=32, colors={2: C_B}).move_to([cx["b"] + 0.3, -0.85, 0])
        self.beat(FadeOut(col_b), FadeIn(again), rt=1.0)                   # 11 + 10 = 21 again
        self.beat(Indicate(s_t, color=C_B, scale_factor=1.3), Indicate(again[2], color=C_B, scale_factor=1.3),
                  rt=1.4)                                                   # same as adding separately
        self.beat()                                                         # intuition, not yet E
        lin = eq("E[<i>X</i><sub>1</sub> + <i>X</i><sub>2</sub>]", "=", "E[<i>X</i><sub>1</sub>]", "+",
                 "E[<i>X</i><sub>2</sub>]", size=32).move_to([RX, -1.95, 0])
        d = self.say()                                                      # so E of sum = sum of E
        self.wait(max(0.1, d * 0.6))
        self.play(FadeIn(lin, lag_ratio=0.2), run_time=1.4)
        self.pause(0.8)
        table = VGroup(head, pairs, tots, rule, s_t, s_a, s_b, again)

        # ---- the second beam
        ways = {s: 6 - abs(s - 7) for s in range(2, 13)}
        x_of = lambda v: -5.5 + (v - 2) * 0.55          # noqa: E731
        b = Beam({s: w / 36 for s, w in ways.items()}, x_of, -2.35, 0.42, pivot_v=5,
                 mass_labels={2: "1/36", 7: "6/36", 12: "1/36"})
        b.mlabels[0].shift(LEFT * 0.12)
        b.mlabels[2].shift(RIGHT * 0.12)
        b.pivot_v = 5
        b.place(5, balance_tilt(5, 7, 5))
        self.b2 = b
        seven = eq("=", "3.5 + 3.5", "=", "7", size=32, colors={3: C_B})
        d = self.say()                                                      # 3.5 + 3.5 = 7
        self.play(FadeOut(table), lin.animate.move_to([RX, 2.4, 0]), FadeIn(b.body), FadeIn(b.pivot), run_time=0.9)
        seven.next_to(lin, DOWN, buff=0.3).align_to(lin[1], LEFT)
        self.play(FadeIn(seven), self.slide(b, 7, centre=7, span=5), run_time=min(2.4, max(0.6, d - 1.1)))
        self.beat(Indicate(b.bars[5], color=C_B, scale_factor=1.15), Indicate(b.vlabels[5], color=C_B,
                                                                                scale_factor=1.5), rt=1.4)
        term = P("linearity of expectation", 24, C_DIM).next_to(seven, DOWN, buff=0.35).align_to(lin, LEFT)
        self.beat(FadeIn(term))                                             # TERM: linearity
        self.beat()                                                         # holds when dependent

        even = {s: (1 / 6 if s % 2 == 0 else 0) for s in range(2, 13)}
        new_bars = VGroup()
        for s_, bar in zip(range(2, 13), b.bars):
            h = max(BAR_H * even[s_], 0.001)
            nb = Rectangle(width=0.42, height=h, stroke_color="#0e1116", stroke_width=1.5)
            nb.set_fill(C_MASS, 0.85 if even[s_] else 0)
            nb.move_to([x_of(s_), b.y + 0.035 + h / 2, 0])
            new_bars.add(nb)
        self_lab = M("<i>X</i> + <i>X</i>", 30).move_to([x_of(7), b.y + 1.75, 0])
        self.beat(*[Transform(bar, nb) for bar, nb in zip(b.bars, new_bars)], FadeOut(b.mlabels), FadeIn(self_lab),
                  rt=1.8)                                                   # one die plus itself
        evens = [b.vlabels[k] for k in range(0, 11, 2)]
        self.beat(*[Indicate(m, color=WHITE, scale_factor=1.5) for m in evens], lag=0.15, rt=2.0)   # always even
        same = eq("E[<i>X</i> + <i>X</i>]", "=", "3.5 + 3.5", "=", "7", size=32, colors={4: C_B})
        same.next_to(term, DOWN, buff=0.45).align_to(lin, LEFT)
        self.beat(FadeIn(same), Indicate(b.pivot, color=C_B), rt=1.6)       # still 3.5 + 3.5
        self.pause(1.5)
        self.play(FadeOut(VGroup(self.b1, self.ev, b, lin, seven, term, self_lab, same)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def indicator(self):
        g = DiceGrid(size=0.62, center=[-3.2, -0.25, 0])
        A = g.where(lambda i, j: i >= 4 and j >= 4)
        self.beat(FadeIn(g), rt=1.0)                                        # one simple device
        nums = VGroup(*[M("1" if c in A else "0", 26, WHITE if c in A else C_DIM).move_to(c) for c in g.sq])
        alab = M("A", 32, C_A).next_to(VGroup(*A), RIGHT, buff=0.2)
        d = self.say()                                                      # 1 if it happens, 0 if not
        self.play(*g.paint(A, C_A), FadeIn(alab), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(n) for n in nums], lag_ratio=0.03), run_time=min(2.6, d - 1.0))
        ind = eq("<b>1</b><sub>A</sub>(ω)", "=", "1  if  ω ∈ A", size=32).move_to([RX, 2.3, 0])
        ind[0][2].set_color(C_A)
        ind[2][-1].set_color(C_A)
        oth = M("0  otherwise", 32).next_to(ind[2], DOWN, buff=0.2).align_to(ind[2], LEFT)
        term = P("indicator", 24, C_DIM).next_to(ind, UP, buff=0.3).align_to(ind, LEFT)
        self.beat(FadeIn(ind), FadeIn(oth), FadeIn(term))                   # TERM: indicator
        e1 = eq("E[<b>1</b><sub>A</sub>]", "=", "1 · P(A)", "+", "0 · P(not A)", size=32).move_to([RX, 0.4, 0])
        e1[0][3].set_color(C_A)
        e1[2][-2].set_color(C_A)
        e1[4][-2].set_color(C_A)
        self.beat(FadeIn(e1, lag_ratio=0.2), rt=2.4)                        # 1 times P plus 0 times the rest
        e2 = eq("=", "P(A)", size=32).next_to(e1, DOWN, buff=0.3).align_to(e1[1], LEFT)
        e2[1][2].set_color(C_A)
        self.beat(FadeIn(e2), *[Indicate(n, color=C_A) for n in nums if n.text == "1"], rt=1.6)   # just P(A)
        self.pause(0.8)
        self.play(FadeOut(VGroup(g, nums, alab, oth, term, e1, e2, ind)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def birthdays(self):
        c0, R = np.array([-3.4, -0.2, 0]), 2.6
        pos = [c0 + R * np.array([np.cos(PI / 2 - TAU * k / 23), np.sin(PI / 2 - TAU * k / 23), 0])
               for k in range(23)]
        people = VGroup(*[person().move_to(p) for p in pos])
        self.beat(LaggedStart(*[FadeIn(m, scale=0.6) for m in people], lag_ratio=0.06), rt=2.0)   # 23 people
        self.beat()                                                         # how many pairs share?

        # ---- step 1: one pair, one indicator
        gi, gj = 3, 12
        one = Line(pos[gi], pos[gj], stroke_color=C_B, stroke_width=5)
        self.beat(Create(one), Indicate(people[gi], color=C_B, scale_factor=1.6),
                  Indicate(people[gj], color=C_B, scale_factor=1.6), rt=1.4)          # start with one pair
        self.add(people)
        tag = M("1 / 0", 28, C_B).move_to(one.get_center() + RIGHT * 0.55)
        tag_bg = BackgroundRectangle(tag, color="#0e1116", fill_opacity=0.9, buff=0.06)
        self.beat(FadeIn(tag_bg), FadeIn(tag))                              # 1 if they share, 0 if not
        e1 = eq("E[<b>1</b><sub>pair</sub>]", "=", "1/365", size=32, colors={2: C_B}).move_to([RX + 0.2, 2.75, 0])
        self.beat(FadeIn(e1), rt=1.2)                                       # 1/365
        self.pause(0.6)

        # ---- step 2: three people, pairwise but not mutually independent
        a, bb, c = 0, 8, 15
        others = VGroup(*[people[k] for k in range(23) if k not in (a, bb, c)])
        tri = {k: Line(pos[u], pos[v], stroke_color=C_DIM, stroke_width=2.5)
               for k, (u, v) in {"ab": (a, bb), "bc": (bb, c), "ac": (a, c)}.items()}
        nums = VGroup(*[T(str(n), 26, WHITE).move_to(c0 + (pos[k] - c0) * 1.15) for n, k in ((1, a), (2, bb), (3, c))])
        self.beat(FadeOut(one), FadeOut(tag), FadeOut(tag_bg), others.animate.set_opacity(0.15),
                  *[Create(l) for l in tri.values()], FadeIn(nums), rt=1.6)  # three people
        self.add(people)
        p1 = eq("P(1–3 shares | 1–2 shares)", "=", "1/365", size=28).move_to([RX + 0.2, 1.6, 0])
        d = self.say()                                                      # first two share: 1–3 unchanged
        self.play(tri["ab"].animate.set_stroke(C_B, 6), run_time=0.8)
        self.wait(max(0.1, d * 0.45 - 0.8))
        self.play(FadeIn(p1), Indicate(tri["ac"], color=WHITE), run_time=1.2)
        self.beat(Indicate(p1[2], color=C_B, scale_factor=1.3), rt=1.2)    # still 1/365
        self.beat()                                                         # pairwise independent
        p2 = M("P(1–3 shares | 1–2 and 2–3 share)", 28).next_to(p1, DOWN, buff=0.5).align_to(p1, LEFT)
        p2b = eq("=", "1", size=28, colors={1: C_B}).next_to(p2, DOWN, buff=0.18).align_to(p1[1], LEFT)
        forced = P("forced", 24, C_B).next_to(tri["ac"].get_center(), RIGHT, buff=0.15)
        d = self.say()                                                      # 1–2 and 2–3: 1–3 certainly
        self.play(tri["bc"].animate.set_stroke(C_B, 6), FadeIn(p2), run_time=1.0)
        self.wait(max(0.1, d * 0.62 - 1.0))
        self.play(tri["ac"].animate.set_stroke(C_B, 6), FadeIn(forced), FadeIn(p2b), run_time=1.0)
        self.beat(*[Indicate(l, color=C_B, scale_factor=1.0) for l in tri.values()], rt=1.2)   # all three tied
        self.beat()                                                         # pairwise, not mutually
        self.beat(Circumscribe(e1, color=C_DIM), rt=1.4)                    # linearity needs neither
        self.pause(0.8)

        # ---- step 3: all 253 indicators, summed
        pairs = [(i, j) for i in range(23) for j in range(i + 1, 23)]
        few = [(1, 17), (5, 20), (7, 11), (14, 22), (2, 9)]
        bright = Line(pos[gi], pos[gj], stroke_color=C_B, stroke_width=5)
        mids = VGroup(*[Line(pos[i], pos[j], stroke_color=WHITE, stroke_width=2.5, stroke_opacity=0.65) for i, j in few])
        rest = VGroup(*[Line(pos[i], pos[j], stroke_color=C_DIM, stroke_width=1, stroke_opacity=0.18)
                        for i, j in pairs if (i, j) not in few and (i, j) != (gi, gj)])
        count = P("253 pairs", 26, C_DIM).move_to([c0[0], -3.5, 0])
        self.play(FadeOut(VGroup(*tri.values(), nums, forced, p1, p2, p2b)), others.animate.set_opacity(1),
                  run_time=0.7)
        sumeq = eq("shared pairs", "=", "Σ<sub>253 pairs</sub> <b>1</b><sub>pair</sub>", size=30)
        sumeq.move_to([RX + 0.2, 1.6, 0])
        d = self.say()                                                      # every pair gets one; sum of all
        self.play(Create(bright), run_time=0.7)
        self.play(LaggedStart(*[Create(l) for l in mids], lag_ratio=0.3), run_time=1.2)
        self.play(LaggedStart(*[Create(l) for l in rest], lag_ratio=0.004), FadeIn(count), run_time=2.0)
        self.add(people)
        self.play(FadeIn(sumeq), run_time=0.8)
        r2h = M("E[shared pairs]", 30).next_to(sumeq, DOWN, buff=0.45).align_to(sumeq, LEFT)
        r2 = eq("=", "Σ E[<b>1</b><sub>pair</sub>]", size=30).next_to(r2h, DOWN, buff=0.22).align_to(r2h, LEFT)
        r2.shift(RIGHT * 0.4)
        self.beat(FadeIn(r2h), FadeIn(r2), rt=1.4)                          # sum of their expected values
        r3 = eq("=", "253 · 1/365", size=30).next_to(r2, DOWN, buff=0.22).align_to(r2, LEFT)
        r4 = eq("≈", "0.69", size=32, colors={1: C_B}).next_to(r3, DOWN, buff=0.22).align_to(r3, LEFT)
        d = self.say()                                                      # 253 · 1/365 ≈ 0.69
        self.play(FadeIn(r3), run_time=1.0)
        self.wait(max(0.1, d * 0.62 - 1.0))
        self.play(FadeIn(r4), run_time=0.8)
        self.pause(1.5)                                                     # ⏸ read the finished sum
        self.play(FadeOut(VGroup(people, bright, mids, rest, count, e1, sumeq, r2h, r2, r3, r4)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def check_in(self):
        rolls = VGroup(*[RoundedRectangle(width=0.8, height=0.8, corner_radius=0.12, stroke_color="#9AA3B2",
                                          stroke_width=2).set_fill("#1A2030", 1) for _ in range(10)])
        rolls.arrange(RIGHT, buff=0.3).move_to([0, 1.2, 0])
        q = VGroup(*[T("?", 28, C_DIM).move_to(r) for r in rolls])
        self.beat(LaggedStart(*[FadeIn(VGroup(r, t)) for r, t in zip(rolls, q)], lag_ratio=0.1), rt=1.5)
        self.beat()                                                         # how many sixes?
        self.pause(5)                                                       # ⏸ work it out

        sixths = VGroup(*[M("1/6", 28, C_MASS).next_to(r, DOWN, buff=0.25) for r in rolls])
        self.beat(LaggedStart(*[FadeIn(m, shift=DOWN * 0.1) for m in sixths], lag_ratio=0.15), rt=3.0)
        ans = eq("10 · 1/6", "=", "10/6", size=36).move_to([0, -0.9, 0])
        self.beat(FadeIn(ans))                                              # ten sixths
        ans2 = eq("≈", "1.67", size=36, colors={1: C_B}).next_to(ans, RIGHT, buff=0.2)
        self.beat(FadeIn(ans2))                                             # one and two thirds
