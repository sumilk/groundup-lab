"""One unit of mass (docs/PS00_VIDEO_SCRIPT.md, section 3).

Probability as one unit of mass spread over the outcomes. On the fair-dice grid it spreads evenly (an assumption
about the dice); the loaded die shows unequal masses as unequal widths, so area still means probability. Then the
axioms, the complement, the overlap counted twice (inclusion-exclusion) and the union bound.
"""
from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column


def mobject_outline(g, cells, color=WHITE, width=4):
    """The true boundary of a set of grid cells (every cell edge whose neighbour is outside the set)."""
    ids = {c.ij for c in cells}
    s = g.s
    segs = VGroup()
    for c in cells:
        i, j = c.ij
        ctr = c.get_center()
        for di, dj, a, b in ((-1, 0, UL, DL), (1, 0, UR, DR), (0, -1, UL, UR), (0, 1, DL, DR)):
            if (i + di, j + dj) not in ids:
                segs.add(Line(ctr + a * s / 2, ctr + b * s / 2, stroke_color=color, stroke_width=width))
    return segs.set_z_index(3)
C_COMP = "#6E8BA8"   # the complement region on the loaded die (grey-blue)


class UnitOfMass(NScene):
    PARAS = [
        ["Now attach numbers.",
         "Think of probability as one unit of mass, a fixed amount of sand spread over the outcomes.",
         "Each outcome gets some share, and nothing is left over.",
         "Each die is fair, and the two rolls are independent, which here means that knowing one result leaves "
         "the other's chances unchanged.",
         "Under those two assumptions the sand spreads evenly.",
         "Each square gets one thirty-sixth.",
         "That evenness comes from the assumptions.",
         "It isn't a rule of probability."],
        ["The probability of an event is the mass sitting in its region.",
         "The first die is even holds eighteen squares, so eighteen out of thirty-six.",
         "One half."],
        ["Every probability model, for dice or for anything else, follows three rules.",
         "No region holds negative mass.",
         "The whole sample space holds all of it, exactly one.",
         "And if two regions don't overlap, the mass in both together is the sum of their masses.",
         "Those three rules are called the axioms of probability.",
         "Everything else in this video is built on them."],
        ["Here's why the evenness was an assumption.",
         "Take a single die that's been loaded.",
         "Six comes up a quarter of the time, and each of the other faces comes up three twentieths of the time.",
         "Check the total.",
         "Five faces at three twentieths make fifteen twentieths.",
         "A quarter is five twentieths more.",
         "Together, exactly one."],
        ["In the picture, the six gets a wider column, so that area still means probability.",
         "The outcomes are the same six faces as an ordinary die.",
         "Only the masses moved.",
         "So never assume outcomes are equally likely unless the model says they are."],
        ["One consequence of the axioms comes almost for free.",
         "An event and its opposite don't overlap, and together they cover everything.",
         "So their masses add to one.",
         "The chance of not rolling a six on this die is one minus a quarter.",
         "Three quarters.",
         "The opposite event is called the complement."],
        ["Another consequence follows from the third rule.",
         "Suppose A is a subset of B. "
         "Then B is made of two pieces that don't overlap, A itself and the part of B outside A.",
         "So the mass of B is the mass of A, plus a mass that can't be negative.",
         "A subset can never be more likely than the event that contains it.",
         "A sum of twelve has one thirty-sixth, and the sum being at least ten has six thirty-sixths."],
        ["Now a place where adding goes wrong.",
         "What's the chance that at least one of the two dice shows a six?"],
        ["The first die is six in one column, six squares.",
         "The second die is six in one row, another six squares.",
         "Six thirty-sixths plus six thirty-sixths makes twelve thirty-sixths.",
         "Before trusting that, look at the picture.",
         "Did any square get counted twice?"],
        ["One square.",
         "Six and six sits in the column and in the row, so it was counted twice.",
         "Take it out once, and the answer is eleven thirty-sixths.",
         "In general, the probability of A or B is the probability of A, plus the probability of B, minus the "
         "probability of both.",
         "The subtraction removes the extra copy of the overlap."],
        ["That rule is called inclusion exclusion."],
        ["Sometimes you don't know the overlap.",
         "Then you can drop the subtraction and still say something true.",
         "A or B can't be more likely than A plus B.",
         "Twelve thirty-sixths is too big here, but it can never be too small.",
         "That inequality is called the union bound.",
         "It looks loose, but it matters a great deal in machine learning.",
         "It bounds the chance that any one of many things goes wrong, without knowing how they're related.",
         "It comes back at the end."],
        ["Try one.",
         "The first die is even, or the second die is even.",
         "Each region holds eighteen squares.",
         "How many squares are in both?"],
        ["Nine.",
         "Both even means three choices across and three choices down.",
         "Eighteen plus eighteen, minus nine, is twenty-seven.",
         "Twenty-seven out of thirty-six, which is three quarters."],
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
        self.mass()
        self.axioms()
        self.loaded()
        self.overlap()
        self.checkin()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def reset_cells(self, cells=None):
        cells = cells if cells is not None else list(self.g.sq)
        return [c.animate.set_fill(C_MASS, opacity=0.16).set_stroke("#5B6475", 1.5) for c in cells]

    def mass(self):
        g = self.g = DiceGrid(mass=False)
        self.beat(FadeIn(g.sq), FadeIn(g.axes))                                 # attach numbers
        total = M("total mass = 1", 30, C_MASS).move_to([RX, 2.9, 0])
        order = sorted(g.sq, key=lambda c: c.ij[0] + c.ij[1])
        self.beat(LaggedStart(*[c.animate.set_fill(C_MASS, opacity=0.16) for c in order], lag_ratio=0.04),
                  FadeIn(total), rt=2.2)                                         # one unit of mass, sand
        self.beat()                                                              # nothing left over
        assume = P("assumed: each die fair,\nthe two rolls independent", 22, C_DIM).move_to([RX, 1.35, 0])
        self.beat(FadeIn(assume))                                                # fair and independent
        self.beat(*[Indicate(c, color=C_MASS, scale_factor=1.06) for c in g.sq], rt=1.0)   # spreads evenly
        each = M("each square  1/36", 30, C_DIM).move_to([RX, 2.2, 0])
        self.beat(FadeIn(each))                                                  # one thirty-sixth
        self.beat(Indicate(assume, color=WHITE, scale_factor=1.05))              # comes from the assumptions
        self.beat()                                                              # not a rule of probability
        self.pause(0.6)

        A = g.where(lambda i, j: i % 2 == 0)
        pe = eq("P(first die even)", "=", "18/36", "=", "1/2", size=30)
        pe[0][2:16].set_color(C_A)
        pe.move_to([RX, 0.1, 0])
        self.beat(*g.paint(A, C_A, 0.45))                                        # mass in its region
        self.beat(FadeIn(pe[:3]))                                                # 18 out of 36
        self.beat(FadeIn(pe[3:]))                                                # one half
        self.pause(0.6)
        self.top = VGroup(total, each, assume, pe)
        self.A = A

    # ------------------------------------------------------------------------------------------------
    def axioms(self):
        g = self.g
        rules = [("no region holds negative mass", "P(A) ≥ 0"),
                 ("the whole sample space holds exactly 1", "P(Ω) = 1"),
                 ("A and B don't overlap  ⇒", "P(A ∪ B) = P(A) + P(B)")]
        rows = VGroup()
        for k, (w, m) in enumerate(rules, start=1):
            n = M(f"{k}.", 30, C_DIM)
            body = VGroup(P(w, 24, C_DIM), M(m, 32)).arrange(DOWN, aligned_edge=LEFT, buff=0.16)
            rows.add(VGroup(n, body).arrange(RIGHT, aligned_edge=UP, buff=0.25))
        rows.arrange(DOWN, aligned_edge=LEFT, buff=0.45).move_to([RX - 0.2, -0.2, 0])
        self.beat(FadeOut(self.top), *self.reset_cells(self.A))                 # three rules
        self.beat(FadeIn(rows[0]))                                               # no negative mass
        foot = SurroundingRectangle(g.sq, color=C_MASS, buff=0.04, stroke_width=4)
        self.beat(FadeIn(rows[1]), Create(foot))                                 # all of it, exactly one
        c1 = g.where(lambda i, j: i == 1)
        c2 = g.where(lambda i, j: i == 2)
        self.beat(FadeIn(rows[2]), FadeOut(foot), *g.paint(c1, C_A, 0.45), *g.paint(c2, C_B, 0.45))  # no overlap
        title = P("the axioms of probability", 26).next_to(rows, UP, buff=0.5).align_to(rows, LEFT)
        self.beat(FadeIn(title))                                                 # TERM ▸ axioms
        self.beat()                                                              # everything built on them
        self.pause(0.6)
        self.ax = VGroup(rows, title)
        self.c12 = c1 + c2

    # ------------------------------------------------------------------------------------------------
    def loaded(self):
        g = self.g
        self.sq_home = g.sq.get_center()
        d = self.say()                                                           # why evenness was assumed
        self.play(FadeOut(self.ax), FadeOut(g.axes), *self.reset_cells(self.c12), run_time=0.6)
        self.play(g.sq.animate.scale(0.38).move_to([-5.75, 2.75, 0]), run_time=min(1.2, max(0.4, d - 0.7)))

        die = self.die = LoadedDie(width=6.0, height=2.5, center=[-2.45, -0.35, 0])
        name = P("loaded die", 26, C_DIM).next_to(die.cols, UP, buff=0.3)
        self.beat(FadeIn(die), FadeIn(name))                                     # a die that's been loaded
        self.beat(Indicate(die.wlabels[5], color=WHITE, scale_factor=1.3),
                  *[Indicate(w, color=WHITE, scale_factor=1.2) for w in die.wlabels[:5]], rt=1.6)   # 1/4, 3/20s
        self.beat()                                                              # check the total
        t1 = eq("5 × 3/20", "=", "15/20", size=32)
        t2 = eq("1/4", "=", "5/20", size=32)
        t3 = eq("15/20 + 5/20", "=", "1", size=32)
        tot = VGroup(t1, t2, t3).arrange(DOWN, aligned_edge=LEFT, buff=0.4).move_to([RX + 0.2, 0.6, 0])
        five = VGroup(*[die.col(k) for k in range(1, 6)])
        br5 = Brace(five, UP, color=C_DIM, buff=0.08)
        self.beat(FadeIn(t1), FadeOut(name), GrowFromCenter(br5))               # 15/20
        self.beat(FadeIn(t2), Indicate(die.col(6), color=WHITE, scale_factor=1.04))   # 5/20 more
        self.beat(FadeIn(t3), FadeOut(br5))                                      # exactly one
        self.pause(0.6)

        self.beat(Indicate(die.col(6), color=C_MASS, scale_factor=1.08))        # wider column: area = probability
        self.beat(LaggedStart(*[Indicate(f, color=WHITE, scale_factor=1.3) for f in die.faces], lag_ratio=0.12),
                  rt=1.8)                                                        # same six faces
        self.beat(*[Indicate(w, color=WHITE, scale_factor=1.2) for w in die.wlabels])   # only the masses moved
        self.beat()                                                              # never assume equally likely
        self.pause(0.6)

        # ---- the complement
        self.beat(FadeOut(tot))                                                  # comes almost for free
        self.beat(*[die.col(k).animate.set_fill(C_COMP, opacity=0.6) for k in range(1, 6)])   # opposite events
        s1 = eq("P(6) + P(not 6)", "=", "1", size=32)
        s2 = eq("P(not 6)", "=", "1 − 1/4", size=32)
        s3 = eq("=", "3/4", size=32)
        s1.move_to([RX + 0.2, 1.2, 0])
        s2.next_to(s1, DOWN, buff=0.45, aligned_edge=LEFT)
        s3.next_to(s2[1], DOWN, buff=0.4, aligned_edge=LEFT)
        self.beat(FadeIn(s1))                                                    # masses add to one
        self.beat(FadeIn(s2))                                                    # one minus a quarter
        self.beat(FadeIn(s3))                                                    # three quarters
        br = Brace(five, UP, color=C_COMP, buff=0.08)
        comp = P("complement of “6”", 26, C_COMP).next_to(br, UP, buff=0.12)
        self.beat(GrowFromCenter(br), FadeIn(comp))                              # TERM ▸ complement
        self.pause(0.8)
        self.comp = VGroup(s1, s2, s3, br, comp)
        self.subset()

    # ------------------------------------------------------------------------------------------------
    def subset(self):
        g = self.g
        tri = g.where(lambda i, j: i + j >= 10)
        c66 = g.cells[(6, 6)]
        rest = [c for c in tri if c is not c66]
        for c in tri:
            c.set_fill(C_B, opacity=0.45)
        box66 = Square(side_length=g.s * 0.38).set_stroke(WHITE, 4).set_fill(opacity=0).set_z_index(3)
        la = VGroup(M("A", 32, C_A), P("sum is 12", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        lb = VGroup(M("B", 32, C_B), P("sum at least 10", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        VGroup(la, lb).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([RX, 2.6, 0])
        d = self.say()                                                           # another consequence
        self.play(FadeOut(self.die), FadeOut(self.comp), run_time=0.6)
        self.play(g.sq.animate.scale(1 / 0.38).move_to(self.sq_home), run_time=1.0)
        box66.become(Square(side_length=g.s).move_to(c66).set_stroke(WHITE, 4).set_fill(opacity=0)).set_z_index(3)
        self.play(FadeIn(g.axes), Create(box66), FadeIn(lb), run_time=min(1.0, max(0.4, d - 1.7)))
        sub = M("A ⊆ B", 32).move_to([RX, 1.5, 0])
        sub[0].set_color(C_A)
        sub[-1].set_color(C_B)
        restline = mobject_outline(g, rest, C_B)
        bminus = M("B ∖ A", 28, C_B).next_to(VGroup(*rest), DOWN, buff=0.15)
        d = self.say()                                # A ⊆ B; then two pieces (one beat: no pause between)
        self.play(c66.animate.set_fill(C_A, opacity=0.6), FadeIn(la), FadeIn(sub), run_time=1.0)
        self.wait(max(0.1, d * 0.3 - 1.0))
        self.play(Create(restline), FadeIn(bminus), run_time=1.2)
        e1 = eq("P(B)", "=", "P(A)", "+", "P(B ∖ A)", size=32)
        e1[0][2].set_color(C_B)
        e1[2][2].set_color(C_A)
        e1.move_to([RX, 0.45, 0])
        ge = eq("≥", "P(A)", size=32).next_to(e1[1], DOWN, buff=0.35, aligned_edge=LEFT)
        ge[1][2].set_color(C_A)
        self.beat(FadeIn(e1), FadeIn(ge), lag=0.6)                               # mass of A plus non-negative
        imp = eq("A ⊆ B", "⇒", "P(A) ≤ P(B)", size=32).move_to([RX, -1.2, 0])
        imp[0][0].set_color(C_A)
        imp[0][-1].set_color(C_B)
        self.beat(FadeIn(imp))                                                   # never more likely
        num = eq("1/36", "≤", "6/36", size=32, colors={0: C_A, 2: C_B}).next_to(imp, DOWN, buff=0.45)
        self.beat(FadeIn(num))                                                   # 1/36 against 6/36
        self.pause(0.8)
        self.subpic = VGroup(la, lb, sub, bminus, e1, ge, imp, num, box66, restline)
        self.tri = tri

    # ------------------------------------------------------------------------------------------------
    def overlap(self):
        g = self.g
        self.beat(FadeOut(self.subpic), *self.reset_cells(self.tri))             # adding goes wrong
        q = P("at least one six", 28).move_to([RX, 2.9, 0])
        self.beat(FadeIn(q))                                                     # at least one six?

        col6 = g.where(lambda i, j: i == 6)
        row6 = g.where(lambda i, j: j == 6)
        c66 = g.cells[(6, 6)]
        la = VGroup(M("A", 32, C_A), P("first die is 6", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        lb = VGroup(M("B", 32, C_B), P("second die is 6", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        VGroup(la, lb).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([RX, 1.85, 0])
        self.beat(*g.paint(col6, C_A, 0.45), FadeIn(la))                         # first die six: a column
        c66.set_z_index(1)
        self.beat(*g.paint([c for c in row6 if c is not c66], C_B, 0.45),
                  c66.animate.set_stroke(C_B, 3.5), FadeIn(lb))                  # second die six: a row
        e1 = eq("6/36", "+", "6/36", "=", "12/36", "?", size=32).move_to([RX, 0.65, 0])
        e1[0].set_color(C_A)
        e1[2].set_color(C_B)
        self.beat(FadeIn(e1, lag_ratio=0.15))                                    # 12/36
        self.beat()                                                              # look at the picture
        self.beat()                                                              # counted twice?
        self.pause(3)                                                            # ⏸ inspect the picture

        x2 = T("×2", 22).move_to(c66).set_z_index(2)
        self.beat(c66.animate.set_fill(C_BOTH, opacity=0.75).set_stroke(C_BOTH, 3), FadeIn(x2))   # one square
        self.beat(Indicate(c66, color=C_BOTH, scale_factor=1.25))               # in the column and the row
        e2 = eq("6/36", "+", "6/36", "−", "1/36", "=", "11/36", size=32).move_to(e1)
        e2[0].set_color(C_A)
        e2[2].set_color(C_B)
        e2[4].set_color(C_BOTH)
        self.beat(FadeOut(x2), TransformMatchingShapes(e1, e2))                 # 11/36
        ie1 = eq("P(A ∪ B)", "=", "P(A) + P(B)", size=32)
        ie2 = eq("−", "P(A ∩ B)", size=32)
        ie1[2][2].set_color(C_A)
        ie1[2][7].set_color(C_B)
        ie2[1][2:5].set_color(C_BOTH)
        ie1.move_to([RX, -0.45, 0])
        ie2.next_to(ie1[2], DOWN, buff=0.25, aligned_edge=LEFT)
        self.beat(FadeIn(ie1), FadeIn(ie2))                                      # in general
        self.beat(Indicate(ie2, color=C_BOTH))                                   # puts back the overlap
        term = P("inclusion–exclusion", 24, C_DIM).next_to(ie2, DOWN, buff=0.3).align_to(ie1, LEFT)
        self.beat(FadeIn(term))                                                  # TERM ▸ inclusion exclusion
        self.pause(1.5)                                                          # ⏸ read the finished formula

        # ---- the union bound
        self.beat()                                                              # don't know the overlap
        self.beat(VGroup(e2[3], e2[4]).animate.set_color("#4A5263"), ie2.animate.set_color("#4A5263"))   # drop it
        ub = eq("P(A ∪ B)", "≤", "P(A) + P(B)", size=32)
        ub[2][2].set_color(C_A)
        ub[2][7].set_color(C_B)
        ub.next_to(term, DOWN, buff=0.45).align_to(ie1, LEFT)
        self.beat(FadeIn(ub))                                                    # can't be more than A plus B
        uterm = P("union bound", 24, C_DIM).next_to(ub, DOWN, buff=0.3).align_to(ub, LEFT)
        e3 = eq("11/36", "≤", "12/36", size=28, colors={0: C_DIM})
        e3.next_to(ub, DOWN, buff=0.25).align_to(ub, RIGHT)
        self.beat(FadeIn(e3))                                                    # too big, never too small
        self.beat(FadeIn(uterm))                                                 # TERM ▸ union bound
        self.beat()                                                              # matters in ML
        self.beat()                                                              # any of many things
        self.beat()                                                              # comes back at the end
        self.pause(0.8)
        self.over = VGroup(q, la, lb, e2, ie1, ie2, term, ub, e3, uterm)

    # ------------------------------------------------------------------------------------------------
    def checkin(self):
        g = self.g
        self.beat(FadeOut(self.over), *self.reset_cells())                       # try one
        A = g.where(lambda i, j: i % 2 == 0)
        B = g.where(lambda i, j: j % 2 == 0)
        both = [c for c in A if c in B]
        for c in both:
            c.set_z_index(1)
        la = VGroup(M("A", 32, C_A), P("first die even", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        lb = VGroup(M("B", 32, C_B), P("second die even", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        VGroup(la, lb).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([RX - 0.7, 2.4, 0])
        self.beat(*g.paint([c for c in A if c not in both], C_A, 0.45),
                  *g.paint([c for c in B if c not in A], C_B, 0.45),
                  *[c.animate.set_fill(C_A, opacity=0.45).set_stroke(C_B, 3.5) for c in both],
                  FadeIn(la), FadeIn(lb), rt=1.4)                                # A or B
        nx = max(la.get_right()[0], lb.get_right()[0]) + 0.45
        n18a = P("18 squares", 24, C_A).next_to(la, RIGHT).set_x(nx, LEFT)
        n18b = P("18 squares", 24, C_B).next_to(lb, RIGHT).set_x(nx, LEFT)
        self.beat(FadeIn(n18a), FadeIn(n18b))                                    # eighteen squares each
        self.beat()                                                              # how many in both?
        self.pause(4)                                                            # ⏸ count the overlap, finish

        self.beat(*[c.animate.set_fill(C_BOTH, opacity=0.75).set_stroke(C_BOTH, 3) for c in both])   # nine
        across = VGroup(*[m for m in g.axes[0:12:2]][1::2])
        down = VGroup(*[m for m in g.axes[1:12:2]][1::2])
        self.beat(Indicate(across, color=WHITE, scale_factor=1.5), Indicate(down, color=WHITE, scale_factor=1.5))
        r1 = eq("18/36", "+", "18/36", "−", "9/36", size=32)
        r1[0].set_color(C_A)
        r1[2].set_color(C_B)
        r1[4].set_color(C_BOTH)
        r2 = eq("=", "27/36", size=32)
        r3 = eq("=", "3/4", size=32)
        r1.move_to([RX, 0.6, 0])
        r2.next_to(r1, DOWN, buff=0.35).align_to(r1, LEFT).shift(RIGHT * 0.4)
        r3.next_to(r2, DOWN, buff=0.35).align_to(r2, LEFT)
        self.beat(FadeIn(r1), FadeIn(r2), lag=0.4)                               # 18 + 18 - 9 = 27
        self.beat(FadeIn(r3))                                                    # 27/36 = 3/4
