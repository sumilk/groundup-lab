"""Counting, when it's fair. PS00 section 7 (docs/PS00_VIDEO_SCRIPT.md).

Counting squares is probability only when every outcome holds the same mass. The dice grid shows why seven is the
likeliest sum; then the multiplication principle, factorials, n choose k ("pick the team, then forget the order"),
the birthday complement with a real simulated tally (random.Random(1)), and a sum-of-ten check-in.
"""
import random

from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column
DIM_ICON = "#5B6475"


def shade(s):
    """A different purple for each anti-diagonal: a steady gradient from deep (sum 2) to pale (sum 12), so the
    diagonals read as bands rather than a checkerboard."""
    return interpolate_color(ManimColor("#4A2A9A"), ManimColor("#E6DCF8"), (s - 2) / 10)


def shared_tally(n=10000, people=23):
    """Cumulative count of simulated rooms with a shared birthday (random.Random(1)); ends at 5,039."""
    r = random.Random(1)
    out, s = [], 0
    for _ in range(n):
        s += len({r.randrange(365) for _ in range(people)}) < people
        out.append(s)
    return out


def token(letter, r=0.3, size=24, color=WHITE):
    c = Circle(radius=r, stroke_color=color, stroke_width=2.5).set_fill(color, opacity=0.08)
    return VGroup(c, T(letter, size, color).move_to(c))


def person(color=DIM_ICON, s=1.0):
    head = Circle(radius=0.11 * s, stroke_width=0).set_fill(color, opacity=1)
    body = Arc(radius=0.2 * s, start_angle=0, angle=PI, stroke_width=0).set_fill(color, opacity=1)
    body.next_to(head, DOWN, buff=0.04 * s)
    return VGroup(head, body)


def binom(n, k, size=34, color=WHITE):
    top, bot = M(str(n), size, color), M(str(k), size, color)
    stack = VGroup(top, bot).arrange(DOWN, buff=0.12)
    lp = M("(", size, color).stretch_to_fit_height(stack.height + 0.2)
    rp = M(")", size, color).stretch_to_fit_height(stack.height + 0.2)
    return VGroup(lp, stack, rp).arrange(RIGHT, buff=0.06)


class Counting(NScene):
    PARAS = [
        ["Several times now we've found probabilities by counting squares.",
         "That works only when every outcome carries the same mass.",
         "Then the probability of an event is the number of outcomes in it, divided by the total number of "
         "outcomes."],
        ["Which sum of two dice is most likely?"],
        ["If you said seven, you're right, and the grid shows why.",
         "Each sum runs along a diagonal.",
         "Seven's diagonal is the longest, six squares.",
         "Two has a single square, one and one.",
         "So seven is six times as likely as two.",
         "If you'd recorded only the eleven sums and treated them as equally likely, you'd have given every sum "
         "the same chance, one in eleven.",
         "That's the price of hiding the pairs."],
        ["For bigger problems we need to count without drawing every outcome.",
         "If a first choice has six options, and each of them allows six second choices, there are six times six "
         "pairs.",
         "That's the grid again, thirty-six.",
         "How many ways can four runners finish a race?",
         "Any of the four can come first.",
         "Then three are left for second, two for third, and one for last.",
         "Four times three times two times one, which is twenty-four.",
         "That product is written four factorial."],
        ["Now choose a team of three from ten people.",
         "Pick them in order first.",
         "Ten, then nine, then eight, which is seven hundred and twenty.",
         "But a team has no order.",
         "Each team was counted once for every way of lining up its three members, and there are three factorial "
         "of those, six.",
         "So divide.",
         "One hundred and twenty teams.",
         "Pick the team, then forget the order.",
         "That count is written ten choose three."],
        ["The same two steps work for any sizes.",
         "Filling k ordered slots from n people gives n, times n minus one, and so on, one factor per slot.",
         "Nobody can be picked twice, so k can be anything from zero up to n. "
         "That product is n factorial, divided by the factorial of n minus k. "
         "Forgetting the order then divides by k factorial, the number of ways to line up the k chosen people.",
         "So the number of teams of k from n is n factorial, divided by k factorial times the factorial of n "
         "minus k.",
         "That's n choose k."],
        ["Here's a count worth guessing before you compute it.",
         "Twenty-three people are in a room.",
         "Assume each person's birthday is equally likely to be any of three hundred and sixty-five days, ignoring "
         "leap years, and that different people's birthdays are independent.",
         "Is it more likely or less likely than not that two of them share a birthday?"],
        ["Counting the ways to share is messy.",
         "Two people could share, or three, or there could be several separate pairs.",
         "The opposite event is clean.",
         "Everybody has a different birthday."],
        ["The first person can have any day.",
         "The second must avoid one day, so three hundred and sixty-four out of three hundred and sixty-five.",
         "The third must avoid two days.",
         "And so on, down to the twenty-third person, who must avoid twenty-two."],
        ["Multiply all twenty-three factors and you get about point four nine three.",
         "That's the chance that everyone differs.",
         "So the chance of a shared birthday is about point five oh seven.",
         "Just over a half.",
         "It's high because the question isn't about you, or about any one person.",
         "It's about any pair, and twenty-three people make two hundred and fifty-three pairs."],
        ["A quick simulation agrees.",
         "Out of ten thousand random rooms of twenty-three, five thousand and thirty-nine had a shared birthday.",
         "When \"at least one\" is hard to count, count \"none\" and subtract from one."],
        ["One more on the grid.",
         "What's the chance of a sum of ten?"],
        ["Four and six, five and five, six and four.",
         "Three out of thirty-six, one in twelve."],
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
        self.sums()
        self.rules()
        self.team()
        self.general()
        self.birthdays()
        self.check_in()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def sums(self):
        g = self.g = DiceGrid()
        self.say()                                                     # counting squares
        self.play(LaggedStart(*[FadeIn(c, scale=0.9) for c in g.sq], lag_ratio=0.02),
                  FadeIn(g.axes), run_time=1.6)
        self.beat(Indicate(g.sq, color=WHITE, scale_factor=1.02))      # same mass
        law = M("P(<span foreground='%s'>A</span>)  =  |<span foreground='%s'>A</span>| / |Ω|" % (C_A, C_A), 38)
        law.move_to([RX, 2.9, 0])
        note = P("equally likely outcomes only", 24, C_DIM).next_to(law, DOWN, buff=0.22)
        self.beat(FadeIn(law), FadeIn(note))                           # outcomes in it / total
        self.pause(0.5)
        self.beat()                                                    # which sum is most likely?
        self.pause(3)                                                  # ⏸ predict

        diag = {s: g.where(lambda i, j, s=s: i + j == s) for s in range(2, 13)}
        bs, gap, base = 0.3, 0.53, -2.5
        xs = {s: RX + (s - 7) * gap for s in range(2, 13)}
        self.beat()                                                    # you're right, grid shows why
        d = self.say()                                                 # each sum runs along a diagonal
        self.play(LaggedStart(*[AnimationGroup(*g.paint(diag[s], shade(s), 0.85)) for s in range(2, 13)],
                              lag_ratio=0.35), run_time=min(2.4, max(0.5, d - 0.1)))
        bars, counts, slabs = VGroup(), VGroup(), VGroup()
        moves = []
        for s in range(2, 13):
            col = VGroup()
            for k, c in enumerate(diag[s]):
                b = c.copy()
                tgt = Square(side_length=bs, stroke_color="#5B6475", stroke_width=1.2).set_fill(shade(s), 0.85)
                tgt.move_to([xs[s], base + bs * (k + 0.5), 0])
                moves.append(Transform(b, tgt))
                col.add(b)
            bars.add(col)
            counts.add(T(str(len(diag[s])), 22, C_DIM).move_to([xs[s], base + bs * len(diag[s]) + 0.2, 0]))
            slabs.add(T(str(s), 22, C_DIM).move_to([xs[s], base - 0.25, 0]))
        sum_tag = P("sum", 22, C_DIM).next_to(slabs, LEFT, buff=0.25)
        d = self.say()                                                 # seven's diagonal: six squares
        self.play(LaggedStart(*moves, lag_ratio=0.03), FadeIn(slabs), FadeIn(sum_tag), run_time=min(1.8, d * 0.6))
        self.play(FadeIn(counts), *[Indicate(c, color=WHITE, scale_factor=1.1) for c in diag[7]],
                  Indicate(bars[5], color=WHITE), run_time=min(1.0, max(0.3, d * 0.4 - 0.2)))
        self.beat(Indicate(diag[2][0], color=WHITE, scale_factor=1.3), Indicate(bars[0], color=WHITE))   # two: one
        ratio = VGroup(M("P(7)  =  6/36", 30), M("P(2)  =  1/36", 30)).arrange(RIGHT, buff=0.7)
        ratio.move_to([RX, 1.25, 0])
        self.beat(FadeIn(ratio))                                       # six times as likely
        flat = 36 / 11 * bs
        ghost = VGroup(*[DashedVMobject(Rectangle(width=bs, height=flat, stroke_color=WHITE, stroke_width=2)
                                        .move_to([xs[s], base + flat / 2, 0]), num_dashes=14)
                         for s in range(2, 13)])
        glab = M("1/11 each", 26, WHITE).move_to([RX, 0.35, 0])
        self.beat(FadeOut(counts), Create(ghost), FadeIn(glab), rt=1.6)                 # one in eleven
        self.beat(Indicate(g.sq, color=WHITE, scale_factor=1.02))      # price of hiding the pairs
        self.pause(0.6)
        self.sum_parts = VGroup(bars, counts, slabs, sum_tag, ratio, ghost, glab, law, note)

    # ------------------------------------------------------------------------------------------------
    def rules(self):
        g = self.g
        self.beat(FadeOut(self.sum_parts), *g.unpaint())               # count without drawing
        firsts = VGroup(*[m for m in g.axes[0:12:2]])
        seconds = VGroup(*[m for m in g.axes[1:12:2]])
        six = eq("6", "×", "6", size=40).move_to([RX - 0.5, 0.6, 0])
        d = self.say()                                                 # six times six pairs
        self.play(Indicate(firsts, color=C_A), FadeIn(six[0]), run_time=min(1.0, d / 3))
        self.play(Indicate(seconds, color=C_A), FadeIn(six[1:]), run_time=min(1.0, d / 3))
        res = M("=  36", 40).next_to(six, RIGHT, buff=0.2)
        self.beat(FadeIn(res), Indicate(g.sq, color=WHITE, scale_factor=1.02))   # thirty-six

        # ---- runners and podium
        runners = VGroup(*[token(c, r=0.36, size=28) for c in "ABCD"]).arrange(RIGHT, buff=0.55)
        runners.move_to([-3.4, 2.0, 0])
        slots, slabs = VGroup(), VGroup()
        for k, lab in enumerate(["1st", "2nd", "3rd", "4th"]):
            b = RoundedRectangle(width=1.05, height=1.05, corner_radius=0.12, stroke_color="#9AA3B2", stroke_width=2.5)
            b.move_to([-3.4 + (k - 1.5) * 1.35, -0.2, 0])
            slots.add(b)
            slabs.add(T(lab, 22, C_DIM).next_to(b, DOWN, buff=0.2))
        self.beat(FadeOut(VGroup(g, six, res)), FadeIn(runners), FadeIn(slots), FadeIn(slabs), rt=1.4)   # runners
        nums = VGroup(*[M(str(n), 40).move_to(slots[k]) for k, n in enumerate([4, 3, 2, 1])])
        self.beat(Indicate(runners, color=C_A), FadeIn(nums[0]))        # any of four first
        self.beat(*[FadeIn(n) for n in nums[1:]], lag=0.5, rt=2.4)      # three, two, one
        prod = eq("4 · 3 · 2 · 1", "=", "24", size=40).move_to([RX, 0.9, 0])
        self.beat(FadeIn(prod))                                        # twenty-four
        fact = eq("4!", "=", "24", size=40).move_to([RX, -0.3, 0]).align_to(prod, RIGHT)
        term = P("factorial", 26, C_DIM).next_to(fact, DOWN, buff=0.3)
        self.beat(FadeIn(fact), FadeIn(term))                          # TERM ▸ factorial
        self.pause(1.5)
        self.race = VGroup(runners, slots, slabs, nums, prod, fact, term)

    # ------------------------------------------------------------------------------------------------
    def team(self):
        people = VGroup(*[token(c, r=0.3, size=24) for c in "ABCDEFGHIJ"])
        people.arrange_in_grid(rows=2, buff=(0.42, 0.35)).move_to([-3.6, 2.3, 0])
        self.beat(FadeOut(self.race), FadeIn(people, lag_ratio=0.1), rt=1.5)   # team of three from ten
        slots, slabs = VGroup(), VGroup()
        for k, lab in enumerate(["1st pick", "2nd pick", "3rd pick"]):
            b = RoundedRectangle(width=1.05, height=1.05, corner_radius=0.12, stroke_color="#9AA3B2", stroke_width=2.5)
            b.move_to([-3.6 + (k - 1) * 1.6, 0.35, 0])
            slots.add(b)
            slabs.add(T(lab, 22, C_DIM).next_to(b, DOWN, buff=0.2))
        self.beat(FadeIn(slots), FadeIn(slabs))                        # pick in order first
        nums = VGroup(*[M(str(n), 40).move_to(slots[k]) for k, n in enumerate([10, 9, 8])])
        ordered = eq("10 · 9 · 8", "=", "720", size=38).move_to([RX, 2.4, 0])
        d = self.say()                                                 # ten, nine, eight: 720
        self.play(LaggedStart(*[FadeIn(n) for n in nums], lag_ratio=0.6), run_time=min(2.0, d * 0.6))
        self.play(FadeIn(ordered), run_time=min(0.8, max(0.3, d * 0.4 - 0.1)))
        trio = [people[k] for k in range(3)]
        self.beat(*[t.animate.set_color(C_A) for t in trio])          # a team has no order

        orders = ["A B C", "A C B", "B A C", "B C A", "C A B", "C B A"]
        stack = VGroup()
        for o in orders:
            box = RoundedRectangle(width=1.7, height=0.5, corner_radius=0.1, stroke_color=C_A, stroke_width=2)
            stack.add(VGroup(box, T(o, 24, WHITE).move_to(box)))
        stack.arrange(DOWN, buff=0.12).move_to([-3.6, -1.45, 0])
        six = M("3!  =  6", 32).next_to(stack, RIGHT, buff=0.5)
        d = self.say()                                                 # counted once per lining-up: six
        self.play(FadeOut(slots), FadeOut(slabs), FadeOut(nums), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(s, shift=DOWN * 0.1) for s in stack], lag_ratio=0.3),
                  run_time=min(2.4, max(0.5, d - 1.4)))
        self.play(FadeIn(six), run_time=0.5)
        team = VGroup(RoundedRectangle(width=2.2, height=0.75, corner_radius=0.15, stroke_color=C_A, stroke_width=3)
                      .set_fill(C_A, 0.12), T("A  B  C", 28))
        team[1].move_to(team[0])
        team.move_to([-3.6, -1.45, 0])
        divide = eq("720", "/", "3!", size=38).move_to([RX, 1.3, 0]).align_to(ordered, LEFT)
        self.beat(ReplacementTransform(stack, team), FadeOut(six), FadeIn(divide), rt=1.0)   # so divide
        teams = M("=  120", 38).next_to(divide, RIGHT, buff=0.2)
        self.beat(FadeIn(teams))                                       # 120 teams
        self.beat(Indicate(team, color=C_A, scale_factor=1.08))        # pick the team, forget the order
        bn = binom(10, 3, 38)
        rest = eq("=", "10! / (3! 7!)", "=", "120", size=34)
        line = VGroup(bn, rest).arrange(RIGHT, buff=0.2).move_to([RX, -0.3, 0])
        term = P("n choose k", 26, C_DIM).next_to(line, DOWN, buff=0.3).align_to(bn, LEFT)
        self.beat(FadeIn(line), FadeIn(term))                          # TERM ▸ n choose k
        self.pause(1.2)
        self.team_parts = VGroup(people, team, ordered, divide, teams, line, term)

    # ------------------------------------------------------------------------------------------------
    def general(self):
        """The same two steps for any n and k: n(n-1)...(n-k+1) = n!/(n-k)!, then divide by k!."""
        syms = ["n", "n − 1", "…", "n − k + 1"]
        slots, fills = VGroup(), VGroup()
        for k, sym in enumerate(syms):
            w = (1.45, 1.45, 0.8, 1.8)[k]
            slots.add(RoundedRectangle(width=w, height=1.0, corner_radius=0.12, stroke_color="#9AA3B2",
                                       stroke_width=2.5))
        slots.arrange(RIGHT, buff=0.2).move_to([0, 1.9, 0]).align_to(np.array([-6.55, 0, 0]), LEFT)
        for k, sym in enumerate(syms):
            fills.add(M(sym, 30 if k < 3 else 28).move_to(slots[k]))
        slots[2].set_stroke(opacity=0)
        brace = Brace(slots, DOWN, color=C_DIM, buff=0.15)
        blab = P("k slots", 24, C_DIM).next_to(brace, DOWN, buff=0.1)
        self.beat(FadeOut(self.team_parts), FadeIn(slots), rt=1.0)     # same two steps, any sizes
        self.beat(LaggedStart(*[FadeIn(f) for f in fills], lag_ratio=0.5), GrowFromCenter(brace), FadeIn(blab),
                  rt=3.0)                                              # n, n − 1, ... one per slot
        cond = M("without replacement:   0 ≤ k ≤ n", 28, C_DIM).move_to([RX, 3.0, 0])

        ordered = VGroup(P("ordered", 24, C_DIM), M("n! / (n − k)!", 34)).arrange(RIGHT, buff=0.35)
        ordered.move_to([RX, 1.9, 0])
        grp1 = SurroundingRectangle(ordered[1][-6:], color=C_B, buff=0.06, stroke_width=2.5)
        chk1 = M("10! / 7!  =  720", 28).move_to([-3.6, -0.9, 0])
        nk = P("n = 10,  k = 3", 24, C_DIM).next_to(chk1, UP, buff=0.3)
        divk = M("÷  k!", 34).next_to(slots, RIGHT, buff=0.3)
        # one beat, three sentences (a single beat because Kokoro leaves no pause between them):
        # nobody twice -> 0 ≤ k ≤ n; product = n!/(n − k)!; forgetting the order -> ÷ k!
        d = self.say()
        self.play(FadeIn(cond), run_time=0.8)
        self.wait(max(0.1, d * 0.33 - 0.8))
        self.play(FadeIn(ordered), Create(grp1), FadeIn(nk), FadeIn(chk1), run_time=1.0)
        self.wait(max(0.1, d * 0.30 - 1.0))
        self.play(FadeIn(divk), Indicate(fills, color=WHITE, scale_factor=1.08), run_time=1.0)

        teams = VGroup(P("teams", 24, C_DIM), M("n! / (k! (n − k)!)", 34)).arrange(RIGHT, buff=0.35)
        teams.move_to([RX, 0.6, 0]).align_to(ordered, LEFT)
        grp2 = SurroundingRectangle(teams[1][-7:-1], color=C_B, buff=0.06, stroke_width=2.5)
        chk2 = M("720 / 3!  =  120", 28).next_to(chk1, DOWN, buff=0.3)
        zero = M("0! = 1", 26, C_DIM).next_to(teams, DOWN, buff=0.25).align_to(teams, RIGHT)
        self.beat(FadeIn(teams), Create(grp2), FadeIn(chk2), FadeIn(zero), rt=1.4)   # n! / (k! (n − k)!)
        bn = binom("n", "k", 34)
        named = VGroup(M("=", 34), bn).arrange(RIGHT, buff=0.2).next_to(teams[1], DOWN, buff=0.75).align_to(teams[1], LEFT)
        nlab = P("n choose k", 24, C_DIM).next_to(named, RIGHT, buff=0.35)
        self.beat(FadeIn(named), FadeIn(nlab))                         # that's n choose k
        self.pause(2)                                                  # ⏸ read the formula and its check
        self.gen_parts = VGroup(slots, fills, brace, blab, cond, ordered, grp1, chk1, nk, divk, teams, grp2, chk2,
                                zero, named, nlab)

    # ------------------------------------------------------------------------------------------------
    def birthdays(self):
        icons = VGroup(*[person() for _ in range(23)])
        icons.arrange_in_grid(rows=4, cols=6, buff=(0.42, 0.4)).move_to([-3.6, 1.0, 0])
        self.icons = icons
        self.beat(FadeOut(self.gen_parts))                             # worth guessing
        self.beat(LaggedStart(*[FadeIn(p, scale=0.8) for p in icons], lag_ratio=0.08), rt=1.8)   # 23 people
        days = P("365 equally likely days\nbirthdays independent", 24, C_DIM).next_to(icons, DOWN, buff=0.4)
        self.beat(FadeIn(days))                                        # evenly over 365 days
        self.beat()                                                    # more or less likely than not?
        self.pause(4)                                                  # ⏸ predict

        def link(a, b):
            return Line(icons[a][0].get_center(), icons[b][0].get_center(), stroke_color=C_B, stroke_width=3)
        self.beat()                                                    # ways to share: messy
        shares = VGroup(link(0, 7), VGroup(link(3, 10), link(10, 15)), VGroup(link(13, 20), link(5, 17)))
        d = self.say()                                                 # two, three, several pairs
        self.play(LaggedStart(*[Create(s) for s in shares], lag_ratio=0.8), run_time=min(3.0, max(0.5, d - 0.2)))
        self.beat(FadeOut(shares))                                     # the opposite is clean
        title = M("P(all different)", 32).move_to([RX, 2.9, 0])
        self.beat(FadeIn(title))                                       # everybody differs
        self.pause(0.4)

        f1 = M("=  365/365", 30)
        f2 = M("·  364/365", 30)
        f3 = M("·  363/365", 30)
        row1 = VGroup(f1, f2, f3).arrange(RIGHT, buff=0.18).move_to([RX, 2.1, 0])
        f4 = M("·  …  ·  343/365", 30).next_to(row1, DOWN, buff=0.3).align_to(f2, LEFT)
        lit = lambda k: icons[k].animate.set_color(WHITE)               # noqa: E731
        self.beat(lit(0), FadeIn(f1))                                  # first: any day
        self.beat(lit(1), FadeIn(f2))                                  # second avoids one
        self.beat(lit(2), FadeIn(f3))                                  # third avoids two
        d = self.say()                                                 # down to the 23rd
        self.play(LaggedStart(*[lit(k) for k in range(3, 23)], lag_ratio=0.15), FadeIn(f4),
                  run_time=min(3.0, max(0.5, d - 0.2)))
        approx = M("≈  0.493", 32).next_to(f4, DOWN, buff=0.35).align_to(f1, LEFT)
        self.beat(FadeIn(approx))                                      # about 0.493
        self.beat(Indicate(VGroup(title, approx), color=WHITE, scale_factor=1.05))   # everyone differs
        shared = eq("P(shared)", "=", "1 − 0.493", "≈", "0.507", size=32)
        shared.move_to([RX, -0.5, 0])
        self.beat(FadeIn(shared))                                      # about 0.507
        self.beat(Circumscribe(shared[4], color=C_B))                  # just over a half
        you = VGroup(*[Line(icons[0][0].get_center(), icons[k][0].get_center(), stroke_color=C_DIM,
                            stroke_width=1.5) for k in range(1, 23)])
        self.beat(Create(you), rt=1.6)                                 # not about you
        pairs = VGroup(*[Line(icons[a][0].get_center(), icons[b][0].get_center(), stroke_color=C_B,
                              stroke_width=1.0, stroke_opacity=0.45)
                         for a in range(23) for b in range(a + 1, 23)])
        npairs = M("23 · 22 / 2  =  253 pairs", 30).move_to(days)
        self.beat(FadeOut(you), Create(pairs), FadeOut(days), FadeIn(npairs), rt=2.2)   # any pair: 253
        self.pause(1.5)

        # ---- the simulation, as its own panel under the model's answer
        model = VGroup(P("model", 24, C_DIM), M("P(shared) ≈ 0.507", 32)).arrange(RIGHT, buff=0.35)
        model.move_to([RX, 2.9, 0])
        divider = Line([RX - 2.9, 2.25, 0], [RX + 2.9, 2.25, 0], stroke_color="#3A4252", stroke_width=2)
        simlab = P("simulation", 24, C_DIM).move_to([RX - 1.9, 1.75, 0])
        tally = shared_tally()
        tr = ValueTracker(0)

        def readout():
            n = int(round(tr.get_value()))
            s = tally[n - 1] if n else 0
            rows = VGroup(
                VGroup(P("rooms", 26, C_DIM), T(f"{n:,}", 30)).arrange(RIGHT, buff=0.3),
                VGroup(P("shared", 26, C_B), T(f"{s:,}", 30)).arrange(RIGHT, buff=0.3),
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.25)
            for r in rows:
                r[1].move_to([RX + 1.0, r[1].get_y(), 0], aligned_edge=RIGHT)
            return rows.move_to([RX, 0.7, 0], coor_mask=[0, 1, 0]).align_to(simlab, LEFT)
        counter = always_redraw(readout)
        d = self.say()                                                 # a quick simulation agrees
        self.play(FadeOut(VGroup(title, row1, f4, approx, shared, pairs, npairs)), run_time=0.5)
        self.play(FadeIn(model), Create(divider), FadeIn(simlab), run_time=0.5)
        self.add(counter)
        self.play(tr.animate.set_value(10000), run_time=max(1.0, d - 1.1), rate_func=linear)
        counter.clear_updaters()
        sim = eq("5,039 / 10,000", "≈", "0.504", size=32).move_to([RX, -0.6, 0])
        self.beat(FadeIn(sim))                                         # 5,039 had a shared birthday
        rule = M("P(at least one)  =  1 − P(none)", 32).move_to([RX, -2.2, 0])
        self.beat(FadeIn(rule))                                        # count none, subtract
        self.pause(1.5)
        self.bday = VGroup(icons, model, divider, simlab, counter, sim, rule)

    # ------------------------------------------------------------------------------------------------
    def check_in(self):
        g = DiceGrid()
        d = self.say()                                                 # one more on the grid
        self.play(FadeOut(self.bday), run_time=0.5)
        self.play(FadeIn(g), run_time=min(1.0, max(0.4, d - 0.6)))
        self.beat()                                                    # sum of ten?
        self.pause(4)                                                  # ⏸ count
        ten = [g.cells[ij] for ij in ((4, 6), (5, 5), (6, 4))]
        labs = VGroup(*[T(f"{c.ij[0]}, {c.ij[1]}", 22).move_to(c) for c in ten])
        self.beat(*[AnimationGroup(c.animate.set_fill(C_A, 0.55), FadeIn(l)) for c, l in zip(ten, labs)],
                  lag=0.6, rt=2.2)                                     # 4,6  5,5  6,4
        res = eq("P(<span foreground='%s'>sum 10</span>)" % C_A, "=", "3/36", "=", "1/12", size=36)
        res.move_to([RX, 0.6, 0])
        self.beat(FadeIn(res))                                         # 3/36 = 1/12
