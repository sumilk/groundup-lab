"""Knowing something shrinks the world. THE REFERENCE SCENE for PS00 (docs/PS00_VIDEO_SCRIPT.md, section 4).

The picture: the fair-dice grid on the left, where area is probability. Conditioning is shown, never just stated:
cross out what the information rules out, then the kept squares slide together and stretch to fill the same
footprint (the same total mass, one). Maths sits on the right and builds in step with the narration.
"""
from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column
SUM9 = lambda i, j: i + j == 9            # noqa: E731
GE4 = lambda i, j: i >= 4                 # noqa: E731


class ShrinksWorld(NScene):
    PARAS = [
        ["Roll two fair dice again.",
         "Every square carries the same share, one out of thirty-six."],
        ["A sum of nine happens in four squares.",
         "Four out of thirty-six, which is one in nine."],
        ["Now someone glances at the first die and tells you one thing.",
         "It's at least four.",
         "Does a sum of nine become more likely, or less?"],
        ["Which squares can we cross out?"],
        ["Every square where the first die shows one, two or three.",
         "Eighteen are left, and they're the whole world now.",
         "Each one counts for one out of eighteen.",
         "Three of them still give a sum of nine.",
         "Three out of eighteen, which is one in six.",
         "So it went up, from one in nine to one in six.",
         "The small first rolls are gone, and those were the rolls that had the hardest time reaching nine."],
        ["Now turn the information around.",
         "This time you're told the sum is nine.",
         "Which squares are left?"],
        ["Four.",
         "And in three of those four, the first die is at least four.",
         "Three out of four."],
        ["It's the same three squares both times.",
         "What changed is what we compared them with.",
         "Eighteen squares the first time, four the second."],
        ["That's all the word \"given\" does.",
         "The probability of A given B is the share of B that is also A.",
         "It's called a conditional probability.",
         "In symbols, the probability of A and B, divided by the probability of B.",
         "It only makes sense when B has some probability to begin with, because we divide by it."],
        ["This is exactly what's buried in the detector question.",
         "Ninety-five percent is the share of contaminated models that get flagged.",
         "The question asked for the share of flagged models that are contaminated.",
         "Same overlap, a different group to compare it with.",
         "For the detector, the group we need is the flagged models."],
        ["Counting squares worked because every square held the same mass.",
         "Go back to the loaded die, where six carries a quarter.",
         "You're told the roll was even.",
         "What's the chance it was a six?"],
        ["Counting faces says one in three, since two, four and six are left.",
         "But those faces don't carry equal mass.",
         "Two and four hold three twentieths each, and six holds five twentieths.",
         "The even faces hold eleven twentieths in all, and the six is five of those.",
         "Five out of eleven.",
         "When you rescale, you rescale the mass that's left, not the number of outcomes left."],
        ["Multiply both sides of the definition by the probability of B, and the rule turns around.",
         "The probability of A and B is the probability of B, times the probability of A given B.",
         "To find the chance two things both happen, take the chance of the first, then the chance of the second "
         "once the first has happened.",
         "That's the multiplication rule."],
        ["A bag holds three red balls and two blue.",
         "Draw one, keep it out, and draw another.",
         "What's the chance both are red?",
         "The first is red with probability three fifths.",
         "Now the bag has changed.",
         "Two red and two blue are left, so the second is red with probability two quarters.",
         "Three fifths times two quarters is three tenths."],
        ["Put the first ball back instead, and the second draw is three fifths again, giving nine twenty-fifths.",
         "That isn't a competing rule.",
         "It's a different experiment, and the bag shows exactly where they differ."],
        ["The same step repeats for longer sequences.",
         "The chance of three things in a row is the first, times the second given the first, times the third "
         "given the first two.",
         "That's the chain rule, and it holds whenever those conditional probabilities are defined.",
         "Replacing each factor by a plain, unconditioned probability is a separate and much stronger claim, "
         "which we'll get to."],
        ["Your turn.",
         "Two red and three blue, two draws without putting anything back.",
         "What's the chance both are red?"],
        ["Two fifths for the first.",
         "Then one red among four balls, a quarter.",
         "Together, one in ten."],
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
        self.dice()
        self.reverse()
        self.definition()
        self.loaded()
        self.multiplication()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def dice(self):
        g = self.g = DiceGrid()
        each = M("each square  1/36", 30, C_DIM).move_to([RX, 2.9, 0])
        self.say()                                                     # roll two fair dice again
        self.play(LaggedStart(*[FadeIn(c, scale=0.9) for c in g.sq], lag_ratio=0.02),
                  FadeIn(g.axes), run_time=1.6)
        self.beat(FadeIn(each))                                        # same share, 1/36

        nine = g.where(SUM9)
        p9 = eq("P(sum 9)", "=", "4/36", "=", "1/9", colors={0: C_A}).move_to([RX, 1.9, 0])
        self.beat(*g.paint(nine, C_A))                                 # sum of nine: four squares
        self.beat(FadeIn(p9[:3]), FadeIn(p9[3:]), lag=0.5)             # 4/36 = 1/9

        ge4 = g.where(GE4)
        frame = SurroundingRectangle(VGroup(*ge4), color=C_B, buff=0.03, stroke_width=4)
        tag = P("first die ≥ 4", 28, C_B).next_to(g.sq, DOWN, buff=0.22).align_to(frame, RIGHT)
        self.beat()                                                    # someone glances at the first die
        self.beat(Create(frame), FadeIn(tag))                          # at least four
        self.beat()                                                    # more likely, or less?
        self.pause(3)                                                  # ⏸ predict
        self.beat()                                                    # which squares can we cross out?
        self.pause(2)                                                  # ⏸ find them

        out = g.where(lambda i, j: i < 4)
        marks = g.cross_marks(out)
        self.beat(*g.darken(out), Create(marks), rt=1.4)                  # one, two or three
        self.wait(0.3)
        col_nums = VGroup(*[g.axes[k] for k in range(0, 12, 2)])      # 1..6 across; row numbers stay
        d = self.say()                                                 # eighteen left, the whole world now
        foot = Square(side_length=6 * g.s).move_to(g.sq.get_center())
        self.play(FadeOut(VGroup(*out)), FadeOut(marks), FadeOut(col_nums),
                  *g.rescale(ge4, cols=[4, 5, 6], rows=[1, 2, 3, 4, 5, 6], mass_opacity=0.32),
                  frame.animate.become(SurroundingRectangle(foot, color=C_B, buff=0.03, stroke_width=4)),
                  tag.animate.next_to(foot, DOWN, buff=0.22),
                  run_time=min(2.2, max(0.5, d - 0.1)))
        w3 = 6 * g.s / 3
        new_cols = VGroup(*[T(str(k), 20, C_DIM).move_to(np.array([foot.get_left()[0] + (n + 0.5) * w3,
                                                                    col_nums[0].get_center()[1], 0]))
                            for n, k in enumerate((4, 5, 6))])
        self.play(FadeIn(new_cols), run_time=0.4)
        each18 = M("each square  1/18", 30, C_DIM).move_to(each)
        self.beat(ReplacementTransform(each, each18))                  # 1/18 each
        kept9 = [c for c in nine if c.ij[0] >= 4]
        self.beat(*[Indicate(c, color=C_A, scale_factor=1.12) for c in kept9])   # three still give nine
        given = eq("sum 9, given first ≥ 4", "=", "3/18", "=", "1/6", size=30).move_to([RX, 0.9, 0])
        given[0][:4].set_color(C_A)
        given[0][-7:].set_color(C_B)
        self.beat(FadeIn(given, shift=UP * 0.1))                       # 3/18 = 1/6
        up = Arrow(p9[4].get_bottom(), given[4].get_top(), buff=0.08, color=C_DIM, stroke_width=3,
                   max_tip_length_to_length_ratio=0.2)
        self.beat(GrowArrow(up))                                       # it went up, 1/9 to 1/6
        self.beat()                                                    # small first rolls are gone
        self.pause(0.6)
        self.first = VGroup(given)
        self.p9, self.up, self.each18, self.frame, self.tag, self.col_nums = p9, up, each18, frame, tag, col_nums
        self.new_cols = new_cols

    # ------------------------------------------------------------------------------------------------
    def reverse(self):
        g = self.g
        d = self.say()                                                 # turn the information around
        self.play(*g.restore(), FadeOut(self.frame), FadeOut(self.tag), FadeOut(self.p9), FadeOut(self.up),
                  FadeOut(self.each18), FadeOut(self.new_cols), FadeIn(self.col_nums),
                  FadeOut(self.first), run_time=min(1.6, max(0.5, d - 0.1)))
        nine = g.where(SUM9)
        self.play(*g.paint(nine, C_A), run_time=0.4)
        tag9 = P("sum is 9", 28, C_B)
        self.beat()                                                    # told the sum is nine
        self.beat()                                                    # which squares are left?
        self.pause(2)                                                  # ⏸ find them

        out = [c for c in g.sq if c.ij[0] + c.ij[1] != 9]
        marks = g.cross_marks(out)
        d = self.say()                                                 # four.
        self.play(*g.darken(out), Create(marks), run_time=min(1.0, max(0.4, d)))
        self.play(FadeOut(VGroup(*out)), FadeOut(marks), FadeOut(g.axes),
                  *g.rescale(sorted(nine, key=lambda c: c.ij)), run_time=1.4)
        foot = Square(side_length=6 * g.s).move_to(g.sq.get_center())
        frame = SurroundingRectangle(foot, color=C_B, buff=0.03, stroke_width=4)
        tag9.next_to(frame, DOWN, buff=0.22)
        nums = VGroup(*[T(f"{c.ij[0]}, {c.ij[1]}", 30).move_to(c) for c in nine])
        self.play(Create(frame), FadeIn(tag9), FadeIn(nums), run_time=0.8)
        green = [c for c in nine if c.ij[0] >= 4]
        self.beat(*g.paint(green, C_BOTH, 0.7))                        # three of those four
        second = eq("first ≥ 4, given sum 9", "=", "3/4", size=30).move_to([RX, 1.9, 0])
        second[0][:7].set_color(C_A)
        second[0][-4:].set_color(C_B)
        self.beat(FadeIn(second, shift=UP * 0.1))                      # three out of four
        self.pause(0.6)

        # ---- side by side: the same three squares, two different groups
        a = DiceGrid(size=0.46, center=[-4.7, -0.1, 0], axis=False)
        b = DiceGrid(size=0.46, center=[-1.55, -0.1, 0], axis=False)
        for G, keep in ((a, GE4), (b, SUM9)):
            for c in G.sq:
                i, j = c.ij
                if not keep(i, j):
                    c.set_fill(C_OFF, opacity=0.9).set_stroke("#3A4252")
                elif i + j == 9 and i >= 4:
                    c.set_fill(C_BOTH, opacity=0.75)
                else:
                    c.set_fill(C_MASS, opacity=0.32)
        la = P("given first ≥ 4", 24, C_B).next_to(a, UP, buff=0.2)
        lb = P("given sum 9", 24, C_B).next_to(b, UP, buff=0.2)
        fa = M("3/18", 34).next_to(a, DOWN, buff=0.25)
        fb = M("3/4", 34).next_to(b, DOWN, buff=0.25)
        d = self.say()                                                 # same three squares both times
        self.play(FadeOut(VGroup(*nine)), FadeOut(frame), FadeOut(tag9), FadeOut(nums),
                  FadeOut(second), run_time=0.6)
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=min(1.2, max(0.4, d - 0.7)))
        self.play(*[Indicate(G.cells[ij], color=C_BOTH, scale_factor=1.3)
                    for G in (a, b) for ij in ((4, 5), (5, 4), (6, 3))], run_time=0.9)
        self.beat(FadeIn(fa), FadeIn(fb))                              # what we compared them with
        d18 = SurroundingRectangle(fa[-2:], color=C_B, buff=0.06)
        d4 = SurroundingRectangle(fb[-1:], color=C_B, buff=0.06)
        self.beat(Create(d18), Create(d4))                             # eighteen, then four
        self.pause(0.8)
        self.mini = VGroup(a, b, la, lb, fa, fb, d18, d4)

    # ------------------------------------------------------------------------------------------------
    def definition(self):
        f = eq("P(A | B)", "=", "P(A ∩ B)", "/", "P(B)", size=40).move_to([RX, 1.6, 0])
        f[0][2].set_color(C_A)
        f[0][4].set_color(C_B)
        f[2][2:5].set_color(C_BOTH)
        f[4][2].set_color(C_B)
        bar_note = P("“given”", 24, C_DIM).next_to(f[0][3], DOWN, buff=0.35)
        self.beat(FadeIn(f[0]), FadeIn(bar_note))                      # all "given" does
        share = P("the share of <span foreground='%s'>B</span> that is also <span foreground='%s'>A</span>"
                  % (C_B, C_A), 28).move_to([RX, 0.15, 0])
        self.beat(FadeIn(share))                                       # share of B that is also A
        term = P("conditional probability", 26, C_DIM).next_to(f, UP, buff=0.35)
        self.beat(FadeIn(term))                                        # TERM ▸ conditional probability
        self.beat(FadeIn(f[1:], lag_ratio=0.3), FadeOut(bar_note))     # P(A ∩ B) / P(B)
        need = M("P(B) > 0", 30, C_B).next_to(f, DOWN, buff=0.35)
        box = SurroundingRectangle(f[4], color=C_B, buff=0.08)
        self.beat(Create(box), FadeIn(need), FadeOut(share))           # only if P(B) > 0
        self.pause(1.5)                                                # ⏸ read the finished definition

        # ---- the detector, read with the new word
        card = detector_card(24).move_to([RX, -1.35, 0])
        self.beat(self.mini.animate.shift(DOWN * 0.15), FadeOut(need), FadeOut(box),
                  VGroup(f, term).animate.scale(0.8).move_to([RX, 3.0, 0]))   # buried in the detector question
        self.play(FadeIn(card), run_time=0.8)
        have = eq("P(flagged | contaminated)", "=", "0.95", size=28).move_to([RX, -0.05, 0])
        have[0][2:9].set_color(C_A)
        have[0][10:-1].set_color(C_B)
        want = eq("P(contaminated | flagged)", "=", "?", size=28).move_to([RX, -2.85, 0])
        want[0][2:14].set_color(C_A)
        want[0][15:-1].set_color(C_B)
        self.beat(FadeIn(have))                                        # 95% = share of contaminated flagged
        self.beat(FadeIn(want))                                        # asked: share of flagged contaminated
        self.beat(Indicate(have[0][10:-1], color=C_B), Indicate(want[0][15:-1], color=C_B))  # different group
        self.beat(Circumscribe(want[0][15:-1], color=C_B))             # the group we need: flagged
        self.pause(1.0)
        self.play(FadeOut(VGroup(self.mini, card, have, want)), run_time=0.7)
        self.f = VGroup(f, term)

    # ------------------------------------------------------------------------------------------------
    def loaded(self):
        die = LoadedDie(width=5.4, height=2.6, center=[-3.55, 0.2, 0])
        name = P("loaded die", 26, C_DIM).next_to(die, UP, buff=0.3)
        self.beat(FadeOut(self.f))                                     # counting worked: equal mass
        self.beat(FadeIn(die), FadeIn(name))                           # six carries a quarter
        even = P("given: the roll is even", 28, C_B).move_to([RX + 0.3, 2.3, 0])
        self.beat(FadeIn(even))                                        # told the roll was even
        self.beat()                                                    # chance it was a six?
        self.pause(5)                                                  # ⏸ predict, or work it out

        odd = [die.col(k) for k in (1, 3, 5)]
        marks = VGroup(*[Line(c.get_corner(UL) + DR * 0.1, c.get_corner(DR) + UL * 0.1,
                              stroke_color="#6B7385", stroke_width=2) for c in odd])
        naive = eq("counting faces", "1/3", size=32, buff=0.3).move_to([RX + 0.3, 1.3, 0])
        naive[0].set_color(C_DIM)
        self.beat(*[c.animate.set_fill(C_OFF, opacity=0.9) for c in odd], Create(marks), FadeIn(naive))
        self.beat()                                                    # faces don't carry equal mass
        wl = [die.wlabels[k - 1] for k in (2, 4, 6)]
        self.beat(*[Indicate(w, color=WHITE, scale_factor=1.25) for w in wl])   # 3/20, 3/20, 5/20
        d = self.say()                                                 # eleven twentieths in all
        self.play(FadeOut(VGroup(*odd)), FadeOut(marks), FadeOut(VGroup(*[die.faces[k - 1] for k in (1, 3, 5)])),
                  FadeOut(die.wlabels), *die.rescale([2, 4, 6]), run_time=min(1.8, max(0.5, d - 0.2)))
        die.col(6).set_fill(C_BOTH, opacity=0.55)
        brace = Brace(VGroup(*[die.col(k) for k in (2, 4, 6)]), DOWN, color=C_DIM)
        eleven = M("even  11/20", 28, C_B).next_to(brace, DOWN, buff=0.12)
        five = M("5/20", 28, WHITE).move_to(die.col(6).get_center() + DOWN * 0.6)
        self.play(GrowFromCenter(brace), FadeIn(eleven), FadeIn(five), run_time=0.8)
        res = eq("P(6 | even)", "=", "(5/20) / (11/20)", "=", "5/11", size=32,
                 colors={4: C_BOTH}).move_to([RX + 0.3, 0.2, 0])
        if res.width > 5.9:
            res.scale_to_fit_width(5.9).move_to([RX + 0.3, 0.2, 0])
        strike = Line(naive[1].get_left() + LEFT * 0.05, naive[1].get_right() + RIGHT * 0.05, color=C_X,
                      stroke_width=4)
        self.beat(FadeIn(res), Create(strike))                         # five out of eleven
        rule = P("rescale the <b>mass</b> that's left,\nnot the number of outcomes", 26, C_DIM)
        rule.move_to([RX + 0.3, -1.2, 0])
        self.beat(FadeIn(rule))
        self.pause(0.8)
        self.play(FadeOut(VGroup(die, name, even, naive, strike, brace, eleven, five, res, rule)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def multiplication(self):
        mr = eq("P(A ∩ B)", "=", "P(B)", "·", "P(A | B)", size=38).move_to([0, 3.0, 0])
        mr[0][2:5].set_color(C_BOTH)
        mr[2][2].set_color(C_B)
        mr[4][2].set_color(C_A)
        mr[4][4].set_color(C_B)
        self.beat(FadeIn(mr[0]), FadeIn(mr[1]))                        # multiply both sides
        self.beat(FadeIn(mr[2:], lag_ratio=0.3))                       # P(B) times P(A|B)
        self.beat(Indicate(mr[2], color=C_B), Indicate(mr[4], color=C_A))   # first, then second given first
        term = P("multiplication rule", 26, C_DIM).next_to(mr, DOWN, buff=0.2)
        self.beat(FadeIn(term))

        # ---- the bag
        bg, body, balls = bag(3, 2, center=[-5.3, -0.5, 0])
        bg.scale(1.3)
        self.beat(FadeIn(bg))                                          # three red, two blue
        drawn = balls[0]
        aside = np.array([-5.3, -2.75, 0])
        home = drawn.get_center()
        self.beat(drawn.animate.move_to(aside))                        # draw one, keep it out
        self.beat()                                                    # both red?
        nodes = {
            "o": ([-3.6, -0.5, 0], "", None),
            "R": ([-1.3, 0.75, 0], "R", C_RED), "B": ([-1.3, -1.75, 0], "B", C_A),
            "RR": ([1.2, 1.65, 0], "R", C_RED), "RB": ([1.2, -0.05, 0], "B", C_A),
        }
        tr = Tree(nodes, [("o", "R", "3/5"), ("o", "B", "2/5"), ("R", "RR", "2/4"), ("R", "RB", "2/4")], size=32)
        first = VGroup(tr.edge[("o", "R")], tr.plab[("o", "R")], tr.node["o"], tr.node["R"])
        firstb = VGroup(tr.edge[("o", "B")], tr.plab[("o", "B")], tr.node["B"]).set_opacity(0.45)
        self.beat(Create(first), FadeIn(firstb))                       # first red 3/5
        self.beat(Indicate(body, color=WHITE, scale_factor=1.04))      # the bag has changed
        second = VGroup(tr.edge[("R", "RR")], tr.plab[("R", "RR")], tr.node["RR"])
        secondb = VGroup(tr.edge[("R", "RB")], tr.plab[("R", "RB")], tr.node["RB"]).set_opacity(0.45)
        self.beat(Create(second), FadeIn(secondb))                     # 2/4
        p_l1 = eq("P(R₁ ∩ R₂)", size=32)
        p_l1[0][2:4].set_color(C_RED)
        p_l1[0][5:7].set_color(C_RED)
        p_l2 = eq("=", "3/5 · 2/4", "=", "3/10", size=32)
        prod = VGroup(p_l1, p_l2).arrange(DOWN, aligned_edge=LEFT, buff=0.18)
        prod.move_to([4.5, 1.0, 0])
        if prod.get_right()[0] > 6.6:
            prod.shift(LEFT * (prod.get_right()[0] - 6.6))
        path = VGroup(tr.edge[("o", "R")], tr.edge[("R", "RR")])
        self.beat(FadeIn(prod), path.animate.set_stroke(C_RED, 5))     # 3/10
        self.pause(0.8)

        # ---- with replacement
        d = self.say()                                                 # put it back: 9/25
        lab2 = M("3/5", 28, C_DIM).move_to(tr.plab[("R", "RR")])
        rep = eq("put back", "3/5 · 3/5", "=", "9/25", size=32)
        rep.next_to(prod, DOWN, buff=0.55, aligned_edge=LEFT)
        if rep.get_right()[0] > 6.6:
            rep.shift(LEFT * (rep.get_right()[0] - 6.6))
        rep[0].set_color(C_DIM)
        self.play(drawn.animate.move_to(home),
                  Transform(tr.plab[("R", "RR")], lab2),
                  Transform(tr.plab[("R", "RB")], M("2/5", 28, C_DIM).move_to(tr.plab[("R", "RB")]).set_opacity(0.45)),
                  FadeIn(rep), run_time=min(1.2, max(0.4, d - 0.7)))
        self.beat()                                                    # not a competing rule
        self.beat(Indicate(body, color=WHITE, scale_factor=1.04))      # a different experiment
        self.pause(0.8)

        # ---- chain rule
        self.play(FadeOut(VGroup(bg, tr, prod, rep)), run_time=0.6)
        chain = eq("P(A₁ ∩ A₂ ∩ A₃)", "=", "P(A₁)", "·", "P(A₂ | A₁)", "·", "P(A₃ | A₁ ∩ A₂)", size=32)
        chain.move_to([0, 0.6, 0])
        self.beat(FadeIn(chain[0]))                                    # longer sequences
        self.beat(LaggedStart(*[FadeIn(p) for p in chain[1:]], lag_ratio=0.35), rt=3.5)   # first, second|first...
        cterm = P("chain rule  ·  whenever the conditionals are defined", 26, C_DIM).next_to(chain, DOWN, buff=0.35)
        self.beat(FadeIn(cterm))
        indep = eq("P(A₁)", "·", "P(A₂)", "·", "P(A₃)", size=30, colors={0: C_DIM, 1: C_DIM, 2: C_DIM,
                                                                          3: C_DIM, 4: C_DIM})
        indep.next_to(cterm, DOWN, buff=0.45)
        note = P("a separate, stronger claim", 24, C_X).next_to(indep, DOWN, buff=0.2)
        self.beat(FadeIn(indep), FadeIn(note))
        self.pause(0.8)

        # ---- check-in
        self.play(FadeOut(VGroup(chain, cterm, indep, note)), run_time=0.6)
        bg2, body2, balls2 = bag(2, 3, center=[-5.3, -0.5, 0])
        bg2.scale(1.3)
        self.beat(FadeIn(bg2))                                         # your turn
        self.beat(Indicate(balls2[:2], color=C_RED, scale_factor=1.2))   # two red, three blue
        self.beat()                                                    # both red?
        self.pause(6)                                                  # ⏸ work it out

        tr2 = Tree(nodes, [("o", "R", "2/5"), ("o", "B", "3/5"), ("R", "RR", "1/4"), ("R", "RB", "3/4")], size=32)
        for k in (("o", "B"), ("R", "RB")):
            VGroup(tr2.edge[k], tr2.plab[k]).set_opacity(0.45)
        tr2.node["B"].set_opacity(0.45)
        tr2.node["RB"].set_opacity(0.45)
        self.beat(Create(VGroup(tr2.edge[("o", "R")], tr2.node["o"], tr2.node["R"])), FadeIn(tr2.plab[("o", "R")]),
                  FadeIn(VGroup(tr2.edge[("o", "B")], tr2.plab[("o", "B")], tr2.node["B"])))
        self.beat(Create(tr2.edge[("R", "RR")]), FadeIn(tr2.plab[("R", "RR")]), FadeIn(tr2.node["RR"]),
                  FadeIn(VGroup(tr2.edge[("R", "RB")], tr2.plab[("R", "RB")], tr2.node["RB"])))
        ans = eq("2/5 · 1/4", "=", "1/10", size=36).move_to([4.55, 0.75, 0])
        self.beat(FadeIn(ans), VGroup(tr2.edge[("o", "R")], tr2.edge[("R", "RR")]).animate.set_stroke(C_RED, 5))
        self.mr = VGroup(mr, term)
