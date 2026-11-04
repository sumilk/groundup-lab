"""When knowing tells you nothing. PS00 section 8 (docs/PS00_VIDEO_SCRIPT.md).

Independence as "conditioning changes nothing", shown on the dice grid with the same cross-out-then-rescale motion as
section 4; then the product rule, a dependent pair, a disjoint pair, two coins where every pair passes but the triple
fails, and a check-in (first die 3, sum 7).

Colours follow the Cast: blue = the event asked about, gold = the information (fill on its own cells plus a gold
edge on every one of its cells, so an overlap cell stays blue-with-gold-edge until the narration makes it green).
"""
from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column


def blue(s):
    return "<span foreground='%s'>%s</span>" % (C_A, s)


def gold(s):
    return "<span foreground='%s'>%s</span>" % (C_B, s)


class Independence(NScene):
    PARAS = [
        ["Conditioning usually changes a probability.",
         "Sometimes it doesn't, and that case has a name.",
         "Take two events on the grid.",
         "The first die is even, which is three columns, half the mass.",
         "And the second die is one or two, which is two rows, a third of the mass."],
        ["Now condition on the second event.",
         "Keep just those two rows.",
         "Within them, how much has an even first die?"],
        ["Still half.",
         "Six of the twelve squares.",
         "Knowing the second die is one or two leaves the chance of an even first die unchanged."],
        ["Events like these are called independent.",
         "The probability of A given B is just the probability of A. "
         "Multiply through by the probability of B, and you get the usual definition.",
         "The probability of A and B equals the probability of A times the probability of B."],
        ["Here a half times a third is a sixth, and the overlap is six squares out of thirty-six, also a sixth.",
         "The overlap looks like a neat block, because one event is about the first die and the other about the "
         "second.",
         "That's a picture of these two events.",
         "It isn't the test.",
         "The test is the product, or equivalently, the share staying put when you condition."],
        ["Now try a different pair.",
         "The first die is six, and the sum is at least ten.",
         "On its own, a six on the first die has probability one sixth.",
         "Given that the sum is at least ten, keep those six squares.",
         "Three of them have a six on the first die.",
         "So the chance jumps to a half.",
         "Knowing the sum told you a lot about the first die.",
         "These events are dependent."],
        ["One more pair.",
         "The first die is one, and the first die is six.",
         "They can't both happen.",
         "Each has probability a sixth.",
         "Are they independent?"],
        ["No.",
         "If you learn the first die is one, the chance that it's six drops from a sixth to zero.",
         "Learning one changed the other completely.",
         "The product agrees.",
         "A sixth times a sixth is a thirty-sixth, but the overlap is empty.",
         "Two events that can't happen together, each with some positive chance, are always dependent.",
         "Being unable to happen together is a very strong connection."],
        ["With three events, independence needs more care.",
         "Flip two fair coins, independently.",
         "Let A be the first coin is heads, B the second coin is heads, and C the two coins agree.",
         "Each of these has probability a half."],
        ["Check A and B. "
         "Both happen only on heads heads, a quarter, which is a half times a half.",
         "A and C both happen only on heads heads too.",
         "A quarter again.",
         "And B and C, the same.",
         "Every pair passes."],
        ["Are all three independent together?"],
        ["Look at what any two tell you about the third.",
         "If both coins are heads, they certainly agree.",
         "The chance of all three is a quarter, but the product of the three probabilities is an eighth.",
         "So every pair passing, which is called pairwise independence, is weaker than mutual independence, where "
         "every group of the events factors, including all three together."],
        ["Try one.",
         "The first die is three, and the sum is seven.",
         "Independent?"],
        ["The first die is three with probability a sixth.",
         "The sum is seven in six squares, also a sixth.",
         "Both happen only at three then four, one square, which is a thirty-sixth.",
         "That's exactly a sixth times a sixth.",
         "Independent, even though the sum involves the first die.",
         "Independence is a fact about the masses.",
         "It isn't about whether two events look related."],
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

    # grid colouring -------------------------------------------------------------------------------
    def paint_a(self, cells):
        return [c.animate.set_fill(C_A, opacity=0.55) for c in cells]

    def paint_b(self, cells, a_cells=()):
        """Gold edge on every B cell; gold fill only where B is not also A (the overlap is revealed later)."""
        self.bring_to_front(*cells)
        return [c.animate.set_stroke(C_B, 3.5).set_fill(C_A if c in a_cells else C_B, opacity=0.55)
                for c in cells]

    def construct(self):
        self.even_rows()
        self.definition()
        self.dependent()
        self.disjoint()
        self.coins()
        self.check_in()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def even_rows(self):
        g = self.g = DiceGrid()
        self.say()                                                     # conditioning usually changes
        self.play(LaggedStart(*[FadeIn(c, scale=0.9) for c in g.sq], lag_ratio=0.02),
                  FadeIn(g.axes), run_time=1.6)
        self.beat()                                                    # sometimes it doesn't
        self.beat()                                                    # two events on the grid
        A = g.where(lambda i, j: i % 2 == 0)
        B = g.where(lambda i, j: j <= 2)
        both = [c for c in A if c in B]
        pa = eq("P(%s)" % blue("first even"), "=", "18/36", "=", "1/2", size=30).move_to([RX, 2.9, 0])
        pb = eq("P(%s)" % gold("second ≤ 2"), "=", "12/36", "=", "1/3", size=30).move_to([RX, 2.25, 0])
        self.beat(*self.paint_a(A), FadeIn(pa))                        # first even: half
        self.beat(*self.paint_b(B, A), FadeIn(pb))                     # second 1 or 2: a third
        self.pause(0.4)
        rows = VGroup(*B)
        self.beat(Indicate(pb[0], color=C_B))                          # condition on the second
        self.beat(Circumscribe(rows, color=C_B, buff=0.04))            # keep those two rows
        self.beat()                                                    # how much is even?
        self.pause(3)                                                  # ⏸ predict

        out = g.where(lambda i, j: j > 2)
        marks = g.cross_marks(out)
        self.play(*g.darken(out), Create(marks), run_time=0.8)
        row_nums = VGroup(*[m for m in g.axes[1:12:2]], g.ax_second)
        d = self.say()                                                 # still half
        self.play(FadeOut(VGroup(*out)), FadeOut(marks), FadeOut(row_nums),
                  *g.rescale(B, cols=[1, 2, 3, 4, 5, 6], rows=[1, 2]), run_time=min(1.8, max(0.5, d - 0.4)))
        foot = Square(side_length=6 * g.s).move_to(g.sq.get_center())
        new_rows = VGroup(*[T(str(r), 20, C_DIM).move_to([foot.get_left()[0] - 0.28,
                                                          foot.get_top()[1] - (k + 0.5) * 3 * g.s, 0])
                            for k, r in enumerate((1, 2))])
        self.play(FadeIn(new_rows), run_time=0.3)
        c1 = M("P(%s | %s)" % (blue("first even"), gold("second ≤ 2")), 30).move_to([RX, 1.2, 0])
        c2 = eq("=", "6/12", "=", "1/2", size=30).next_to(c1, DOWN, buff=0.25).align_to(c1, LEFT)
        self.beat(*g.paint(both, C_BOTH, 0.7), FadeIn(c1), FadeIn(c2))  # six of twelve
        c3 = M("=  P(%s)" % blue("first even"), 30).next_to(c2, RIGHT, buff=0.2)
        self.beat(FadeIn(c3), Indicate(pa, color=WHITE, scale_factor=1.05))   # told you nothing
        self.pause(0.5)
        self.A, self.B, self.both, self.out, self.row_nums, self.new_rows = A, B, both, out, row_nums, new_rows
        self.pa, self.pb, self.cond = pa, pb, VGroup(c1, c2, c3)

    # ------------------------------------------------------------------------------------------------
    def definition(self):
        g = self.g
        term = P("independent", 26, C_DIM).move_to([RX, -0.35, 0])
        self.beat(FadeIn(term))                                        # TERM ▸ independent
        d1 = M("P(%s | %s)  =  P(%s)" % (blue("A"), gold("B"), blue("A")), 34).move_to([RX, -1.05, 0])
        d2 = M("⇔   P(%s ∩ %s)  =  P(%s) P(%s)" % (blue("A"), gold("B"), blue("A"), gold("B")), 34)
        d2.move_to([RX, -1.85, 0])
        d = self.say()                                                 # P(A|B) = P(A). multiply through by P(B)
        self.play(FadeIn(d1), run_time=0.8)
        self.wait(max(0.1, d * 0.5 - 0.8))
        self.play(FadeIn(d2), run_time=0.8)
        self.beat(Circumscribe(d2[1:], color=WHITE))                   # P(A and B) = P(A) P(B)
        self.pause(1.5)

        # ---- back to the full grid: the product check
        d = self.say()                                                 # half times a third; six of 36
        self.play(*g.restore(), FadeIn(self.row_nums), FadeOut(self.new_rows), FadeOut(self.cond), run_time=1.0)
        self.play(*self.paint_a([c for c in self.A if c not in self.both]),
                  *self.paint_b(self.B, self.A), run_time=0.5)
        self.play(*g.paint(self.both, C_BOTH, 0.7), run_time=0.4)
        prod = eq("6/36", "=", "1/2 × 1/3", size=32).move_to([RX, 1.2, 0])
        self.play(FadeIn(prod), run_time=min(0.8, max(0.3, d - 2.0)))
        block = SurroundingRectangle(VGroup(*self.both), color=C_BOTH, buff=0.04, stroke_width=4)
        self.beat(Create(block))                                       # neat block
        self.beat()                                                    # a picture of these two
        self.beat(FadeOut(block))                                      # not the test
        self.beat(Indicate(d2, color=WHITE, scale_factor=1.05), Indicate(d1, color=WHITE, scale_factor=1.05))
        self.pause(0.6)
        self.defn = VGroup(term, d1, d2)
        self.prod = prod

    # ------------------------------------------------------------------------------------------------
    def dependent(self):
        g = self.g
        self.beat(*g.restore(), FadeOut(VGroup(self.pa, self.pb, self.prod, self.defn)))   # a different pair
        A = g.where(lambda i, j: i == 6)
        B = g.where(lambda i, j: i + j >= 10)
        both = [c for c in A if c in B]
        d = self.say()                                                 # first six; sum ≥ 10
        self.play(*self.paint_a(A), run_time=min(0.8, d / 2))
        self.play(*self.paint_b(B, A), run_time=min(0.8, d / 2 - 0.1))
        pa = eq("P(%s)" % blue("first = 6"), "=", "1/6", size=30).move_to([RX, 2.9, 0])
        self.beat(FadeIn(pa))                                          # one sixth on its own

        out = [c for c in g.sq if c not in B]
        marks = g.cross_marks(out)
        kept = sorted(B, key=lambda c: (c.ij[1], c.ij[0]))
        d = self.say()                                                 # keep those six squares
        self.play(*g.darken(out), Create(marks), run_time=0.8)
        self.play(FadeOut(VGroup(*out)), FadeOut(marks), FadeOut(g.axes),
                  *g.rescale(kept), run_time=min(1.6, max(0.5, d - 0.9)))
        foot = Square(side_length=6 * g.s).move_to(g.sq.get_center())
        tag = P("sum ≥ 10", 26, C_B).next_to(foot, DOWN, buff=0.22)
        labs = VGroup()
        targets = g.rescale_targets(kept)
        for c, t in zip(kept, targets):
            labs.add(T(f"{c.ij[0]}, {c.ij[1]}", 30).move_to(t))
        self.add(labs)
        self.play(FadeIn(labs), FadeIn(tag), run_time=0.01)
        self.beat(*g.paint(both, C_BOTH, 0.7))                         # three have a six first
        c1 = M("P(%s | %s)" % (blue("first = 6"), gold("sum ≥ 10")), 30).move_to([RX, 1.9, 0])
        c2 = eq("=", "3/6", "=", "1/2", size=30).next_to(c1, DOWN, buff=0.25).align_to(c1, LEFT)
        self.beat(FadeIn(c1), FadeIn(c2))                              # jumps to a half
        self.beat(Indicate(tag, color=C_B, scale_factor=1.15), Circumscribe(c2[3], color=WHITE))   # told a lot
        term = P("dependent", 26, C_DIM).next_to(c2, DOWN, buff=0.35).align_to(c1, LEFT)
        self.beat(FadeIn(term))                                        # dependent
        self.pause(1.5)
        self.clear_dep = VGroup(pa, c1, c2, term, tag, labs)

    # ------------------------------------------------------------------------------------------------
    def disjoint(self):
        g = self.g
        d = self.say()                                                 # one more pair
        self.play(FadeOut(self.clear_dep), *g.restore(), FadeIn(g.axes), run_time=min(1.2, max(0.4, d)))
        # the information is "first is 1" (gold); the event asked about is "first is 6" (blue)
        A = g.where(lambda i, j: i == 6)
        B = g.where(lambda i, j: i == 1)
        self.beat(*self.paint_b(B), *self.paint_a(A))                  # first is one; first is six
        self.beat(Indicate(VGroup(*A), color=C_A, scale_factor=1.03),
                  Indicate(VGroup(*B), color=C_B, scale_factor=1.03))  # can't both happen
        p1 = eq("P(%s)" % gold("first = 1"), "=", "1/6", size=30).move_to([RX, 2.9, 0])
        p6 = eq("P(%s)" % blue("first = 6"), "=", "1/6", size=30).move_to([RX, 2.3, 0])
        self.beat(FadeIn(p1), FadeIn(p6))                              # each a sixth
        self.beat()                                                    # independent?
        self.pause(3)                                                  # ⏸ predict

        self.beat()                                                    # no.
        out = [c for c in g.sq if c not in B]
        marks = g.cross_marks(out)
        col_nums = VGroup(*[m for m in g.axes[0:12:2]], g.ax_first)
        d = self.say()                                                 # drops from a sixth to zero
        self.play(*g.darken(out), Create(marks), run_time=1.0)
        self.play(FadeOut(VGroup(*out)), FadeOut(marks), FadeOut(col_nums),
                  *g.rescale(B, cols=[1], rows=[1, 2, 3, 4, 5, 6]), run_time=1.4)
        one = T("1", 20, C_DIM).move_to([g.sq.get_center()[0], g.sq.get_top()[1] + 0.28, 0])
        self.add(one)
        c1 = M("P(%s | %s)" % (blue("first = 6"), gold("first = 1")), 30).move_to([RX, 1.3, 0])
        c2 = eq("=", "0", "≠", "1/6", size=30).next_to(c1, DOWN, buff=0.25).align_to(c1, LEFT)
        self.play(FadeIn(c1), FadeIn(c2), run_time=min(0.8, max(0.3, d - 2.5)))
        self.beat()                                                    # changed completely
        self.beat(*g.restore(), FadeIn(col_nums), FadeOut(one))        # the product agrees
        self.play(*self.paint_b(B), *self.paint_a(A), run_time=0.4)
        pb = M("P(both)  =  0", 30).move_to([RX, -0.2, 0]).align_to(c1, LEFT)
        pp = eq("≠", "1/6 · 1/6", "=", "1/36", size=30).next_to(pb, DOWN, buff=0.25).align_to(c1, LEFT)
        self.beat(FadeIn(pb), FadeIn(pp))                              # empty overlap
        rule = P("can't happen together, each > 0\n⇒  dependent", 26, C_DIM).move_to([RX, -2.4, 0])
        self.beat(FadeIn(rule))                                        # always dependent
        self.beat()                                                    # strong connection
        self.pause(1.2)
        self.disj = VGroup(p1, p6, c1, c2, pb, pp, rule)

    # ------------------------------------------------------------------------------------------------
    def coins(self):
        g = self.g
        self.beat(FadeOut(self.disj), FadeOut(g))                      # three events: more care
        xs = [-3.6, -2.5, -1.4, -0.3]
        outs = ["HH", "HT", "TH", "TT"]
        tiles, quarters = VGroup(), VGroup()
        for x, o in zip(xs, outs):
            box = RoundedRectangle(width=0.9, height=0.75, corner_radius=0.14, stroke_color="#9AA3B2",
                                   stroke_width=2.5).set_fill("#1B2130", 1).move_to([x, 2.3, 0])
            tiles.add(VGroup(box, T(o, 30).move_to(box)))
            quarters.add(M("1/4", 26, C_DIM).move_to([x, 1.6, 0]))
        self.beat(FadeIn(tiles, lag_ratio=0.2), FadeIn(quarters))      # two fair coins
        events = [("A", "first is H", C_A, ("HH", "HT")), ("B", "second is H", C_B, ("HH", "TH")),
                  ("C", "coins agree", WHITE, ("HH", "TT"))]
        rows, ticks, halves = VGroup(), {}, VGroup()
        for k, (name, desc, colr, hits) in enumerate(events):
            y = 0.65 - 0.8 * k
            lab = VGroup(T(name, 30, colr), P(desc, 24, C_DIM)).arrange(RIGHT, buff=0.25)
            lab.move_to([-6.55, y, 0], aligned_edge=LEFT)
            tk = VGroup(*[T("✓", 30, colr).move_to([xs[outs.index(h)], y, 0]) for h in hits])
            ticks[name] = tk
            rows.add(VGroup(lab, tk))
            halves.add(M("1/2", 28, colr).move_to([0.6, y, 0]))
        self.beat(*[FadeIn(r) for r in rows], lag=0.6, rt=3.0)         # A, B, C
        self.beat(FadeIn(halves))                                      # each a half
        self.pause(0.4)

        hh = SurroundingRectangle(VGroup(tiles[0], ticks["C"][0]), color=C_BOTH, buff=0.1, stroke_width=4)
        checks = VGroup()
        for k, (a, b) in enumerate((("A", "B"), ("A", "C"), ("B", "C"))):
            cl = {"A": C_A, "B": C_B, "C": WHITE}
            line = eq("P(<span foreground='%s'>%s</span> ∩ <span foreground='%s'>%s</span>)" % (cl[a], a, cl[b], b),
                      "=", "1/4", "=", "1/2 · 1/2", "✓", size=29)
            line[-1].set_color(C_BOTH)
            line.move_to([3.8, 2.3 - 0.72 * k, 0])
            checks.add(line)
        d = self.say()                                                 # check A and B. only HH: 1/4
        self.play(Indicate(rows[0][0], color=C_A), Indicate(rows[1][0], color=C_B), run_time=0.9)
        self.wait(max(0.1, d * 0.3 - 0.9))
        self.play(Create(hh), FadeIn(checks[0]), run_time=1.0)
        self.beat(Indicate(ticks["C"][0], color=WHITE, scale_factor=1.3), FadeIn(checks[1][:3]))   # A and C: HH
        self.beat(FadeIn(checks[1][3:]))                               # a quarter again
        self.beat(FadeIn(checks[2]))                                   # B and C, the same
        pbox = SurroundingRectangle(checks, color=C_DIM, buff=0.15, stroke_width=2)
        self.beat(Create(pbox))                                        # every pair passes
        self.beat()                                                    # all three together?
        self.pause(3)                                                  # ⏸ predict

        self.beat(Indicate(VGroup(ticks["A"][0], ticks["B"][0]), color=WHITE, scale_factor=1.3))   # any two → third
        self.beat(Indicate(ticks["C"][0], color=C_BOTH, scale_factor=1.4), hh.animate.set_stroke(width=7))
        t1 = eq("P(%s ∩ %s ∩ C)" % (blue("A"), gold("B")), "=", "1/4", size=30).move_to([3.8, -1.0, 0])
        t2 = eq("≠", "1/2 · 1/2 · 1/2", "=", "1/8", "✗", size=30)
        t2[-1].set_color(C_RED)
        t2.next_to(t1, DOWN, buff=0.25).align_to(t1, LEFT)
        self.beat(FadeIn(t1), FadeIn(t2), lag=0.5)                     # a quarter vs an eighth
        pw = P("pairwise independence", 24, C_DIM).next_to(pbox, UP, buff=0.12)
        mu = P("mutual independence", 24, C_DIM).next_to(t1, UP, buff=0.18).align_to(t1, LEFT)
        d = self.say()                                                 # pairwise vs mutual
        self.play(FadeIn(pw), run_time=0.6)
        self.wait(max(0.1, d * 0.45 - 0.6))
        self.play(FadeIn(mu), run_time=0.6)
        self.pause(1.5)
        self.coin_parts = VGroup(tiles, quarters, rows, halves, hh, checks, pbox, t1, t2, pw, mu)

    # ------------------------------------------------------------------------------------------------
    def check_in(self):
        g = DiceGrid()
        d = self.say()                                                 # try one
        self.play(FadeOut(self.coin_parts), run_time=0.5)
        self.play(FadeIn(g), run_time=min(1.0, max(0.4, d - 0.6)))
        A = g.where(lambda i, j: i == 3)
        B = g.where(lambda i, j: i + j == 7)
        self.say()                                                     # first three; sum seven
        self.play(*self.paint_a(A), run_time=0.6)
        self.play(*self.paint_b(B, A), run_time=0.6)
        self.beat()                                                    # independent?
        self.pause(5)                                                  # ⏸ check it

        pa = eq("P(%s)" % blue("first = 3"), "=", "1/6", size=30).move_to([RX, 2.6, 0])
        self.beat(FadeIn(pa))                                          # a sixth
        pb = eq("P(%s)" % gold("sum 7"), "=", "6/36", "=", "1/6", size=30).move_to([RX, 1.9, 0])
        self.beat(FadeIn(pb))                                          # also a sixth
        both = g.cells[(3, 4)]
        lab = T("3, 4", 22).move_to(both)
        pab = eq("P(both)", "=", "1/36", size=30).move_to([RX, 0.9, 0])
        self.beat(both.animate.set_fill(C_BOTH, 0.8), FadeIn(lab), FadeIn(pab))   # one square, 1/36
        chk = eq("=", "1/6 · 1/6", "✓", size=30).next_to(pab, RIGHT, buff=0.14)
        chk[-1].set_color(C_BOTH)
        pab_all = VGroup(pab, chk)
        self.beat(FadeIn(chk), pab_all.animate.move_to([RX, 0.9, 0]))  # exactly a sixth times a sixth
        self.beat(Indicate(VGroup(*B), color=C_B, scale_factor=1.03))  # sum involves the first die
        self.beat()                                                    # fact about masses
        self.beat()                                                    # not about looking related
