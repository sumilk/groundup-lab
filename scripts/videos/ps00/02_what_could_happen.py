"""What could happen (docs/PS00_VIDEO_SCRIPT.md, section 2).

Two coins as a tree, then as a list (outcomes, the sample space, events). Then the fair-dice grid, where events
are regions: "and" is the overlap, "or" is everything shaded at least once, "not" is the rest of the grid.
Last, the choice of outcomes: ordered pairs against sums only.
"""
from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column
EVEN1 = lambda i, j: i % 2 == 0           # noqa: E731
SUM10 = lambda i, j: i + j >= 10          # noqa: E731


def region_outline(g, cells, color=WHITE, width=4):
    """The true boundary of a set of grid cells: every cell edge whose neighbour is outside the set."""
    ids = {c.ij for c in cells}
    s = g.s
    segs = VGroup()
    for c in cells:
        i, j = c.ij
        ctr = c.get_center()
        for di, dj, a, b in ((-1, 0, UL, DL), (1, 0, UR, DR), (0, -1, UL, UR), (0, 1, DL, DR)):
            if (i + di, j + dj) not in ids:
                segs.add(Line(ctr + a * s / 2, ctr + b * s / 2, stroke_color=color, stroke_width=width))
    return segs


def tile(txt):
    box = RoundedRectangle(width=1.05, height=0.78, corner_radius=0.14, stroke_color="#9AA3B2", stroke_width=2)
    box.set_fill("#1A2030", opacity=1)
    return VGroup(box, M(txt, 32).move_to(box))


class WhatCouldHappen(NScene):
    PARAS = [
        ["Flip a coin twice.",
         "Before asking how likely anything is, write down everything that can happen.",
         "The first flip is heads or tails.",
         "For each of those, the second flip is heads or tails.",
         "That gives four ends.",
         "Heads heads, heads tails, tails heads, and tails tails."],
        ["Each of these four is an outcome, one complete result of the experiment, recorded at the level of "
         "detail we chose.",
         "The set of all of them is called the sample space.",
         "It's usually written with the Greek letter omega."],
        ["Now a question of a different kind.",
         "Exactly one head.",
         "Is that a fifth outcome, or something else?"],
        ["It isn't a new outcome.",
         "It's a description that two of the outcomes fit, heads tails and tails heads.",
         "A set of outcomes like this is called an event.",
         "The event happens when the outcome that actually occurs is one of its members."],
        ["The first flip is heads is another event.",
         "It holds heads heads and heads tails.",
         "Every yes-or-no question you can ask about the two flips picks out some set of the four outcomes.",
         "That's why the list matters.",
         "Probabilities will be attached to these sets."],
        ["Two dice give more outcomes, so lay them out as a grid.",
         "The first die runs across, and the second runs down.",
         "Thirty-six squares, and each square is one outcome, a pair like four then five."],
        ["Events are now regions of the grid.",
         "The first die is even is three whole columns."],
        ["The sum is at least ten is a small triangle in the corner, six squares."],
        ["Where both happen, the first die is even and the sum is at least ten, is where the two regions overlap.",
         "Four squares."],
        ["Where at least one happens is everything shaded at least once.",
         "And \"the first die is not even\" is everything outside the blue columns."],
        ["Two of these fit together in a way worth checking.",
         "Look at the squares outside the union, where neither event happens.",
         "Now take the squares where the first die is not even, and keep only those where the sum is also below "
         "ten.",
         "It's the same set of squares.",
         "Neither A nor B happens exactly when A doesn't happen and B doesn't happen."],
        ["It works the other way round too.",
         "Outside the overlap, where it isn't true that both happen, is exactly where at least one of them fails.",
         "\"Not both\" is the same event as \"not A, or not B\".",
         "These two facts are called De Morgan's laws."],
        ["Two more relations come up all the time.",
         "The part of A that isn't in B, where the first die is even but the sum is below ten, is written A minus B. "
         "Here it's fourteen squares.",
         "And when every outcome of one event also belongs to another, the first is called a subset of the second.",
         "A sum of twelve is one square, six and six, and it sits inside the region where the sum is at least ten.",
         "Whenever the first event happens, the second must."],
        ["Try one yourself.",
         "Where on the grid is the event that both dice show the same number?"],
        ["Along the diagonal.",
         "Six squares, one and one up to six and six."],
        ["There's a choice hidden in this grid.",
         "We kept track of which die is which, so four then five is a different square from five then four.",
         "We could have recorded only the sum, with eleven possible outcomes from two to twelve.",
         "That's a legitimate sample space too, but a coarser one."],
        ["In the sums-only model, \"the first die shows six\" isn't even an event, because a sum of seven could "
         "have come from six and one, or from one and six.",
         "Choosing the outcomes is the first decision in any probability model.",
         "Plenty of wrong answers begin by changing that choice without noticing."],
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
        self.coins()
        self.grid()
        self.coarse()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def coins(self):
        nodes = {
            "o": ([-6.3, 0.2, 0], "", None),
            "H": ([-4.7, 1.5, 0], "H", WHITE), "T": ([-4.7, -1.1, 0], "T", WHITE),
            "HH": ([-3.0, 2.15, 0], "H", WHITE), "HT": ([-3.0, 0.85, 0], "T", WHITE),
            "TH": ([-3.0, -0.45, 0], "H", WHITE), "TT": ([-3.0, -1.75, 0], "T", WHITE),
        }
        edges = [("o", "H", ""), ("o", "T", ""), ("H", "HH", ""), ("H", "HT", ""), ("T", "TH", ""), ("T", "TT", "")]
        tr = Tree(nodes, edges, size=34)
        names = ["HH", "HT", "TH", "TT"]
        ends = {n: M(n, 32, WHITE).next_to(tr.node[n], RIGHT, buff=0.45) for n in names}

        self.beat(FadeIn(tr.node["o"], scale=0.5))                               # flip a coin twice
        self.beat()                                                              # write down everything
        self.beat(Create(tr.edge[("o", "H")]), Create(tr.edge[("o", "T")]),
                  FadeIn(tr.node["H"]), FadeIn(tr.node["T"]))                    # first flip H or T
        self.beat(*[Create(tr.edge[e[:2]]) for e in edges[2:]],
                  *[FadeIn(tr.node[n]) for n in names])                          # second flip H or T
        self.beat(*[Indicate(tr.node[n], color=WHITE, scale_factor=1.3) for n in names])   # four ends
        self.beat(*[FadeIn(ends[n], shift=RIGHT * 0.1) for n in names], lag=0.35, rt=2.4)  # HH, HT, TH, TT

        # ---- the ends lift into a row of tiles: outcomes, and the sample space
        tiles = VGroup(*[tile(n) for n in names]).arrange(RIGHT, buff=0.28).move_to([2.35, 1.2, 0])
        omega = RoundedRectangle(width=tiles.width + 0.95, height=tiles.height + 1.25, corner_radius=0.3,
                                 stroke_color=WHITE, stroke_width=3).move_to(tiles).shift(DOWN * 0.25)
        tree = VGroup(tr, *ends.values())
        out_lab = P("outcome", 24, C_DIM).move_to([6.15, 0.05, 0])
        out_ar = Arrow(out_lab.get_top() + LEFT * 0.2, tiles[3].get_right(), buff=0.06,
                       color=C_DIM, stroke_width=3, max_tip_length_to_length_ratio=0.3)
        d = self.say()                                                           # each is an outcome
        self.play(*[TransformFromCopy(ends[n], tiles[k]) for k, n in enumerate(names)],
                  tree.animate.set_opacity(0.35), run_time=1.4)
        self.play(FadeIn(out_lab), GrowArrow(out_ar), run_time=0.6)
        ss_lab = P("sample space", 26).next_to(omega, UP, buff=0.22)
        self.beat(Create(omega), FadeIn(ss_lab))                                 # the sample space
        om = M("Ω", 32).next_to(ss_lab, RIGHT, buff=0.15)
        om_eq = M("Ω = {HH, HT, TH, TT}", 32).move_to([2.35, -1.0, 0])
        self.beat(FadeIn(om), FadeIn(om_eq))                                     # Greek letter omega
        self.pause(0.6)

        # ---- a question of a different kind
        cap_x = 2.75
        q = P("exactly one head", 26).move_to([2.35, -1.85, 0])
        self.beat(FadeOut(out_lab), FadeOut(out_ar))                             # a question of a different kind
        self.beat(FadeIn(q))                                                     # exactly one head
        self.beat()                                                              # a fifth outcome?
        self.pause(3)                                                            # ⏸ predict

        self.beat()                                                              # it isn't a new outcome
        loopA = RoundedRectangle(width=tiles[1:3].width + 0.22, height=tiles.height + 0.22, corner_radius=0.2,
                                 stroke_color=C_A, stroke_width=4).move_to(tiles[1:3])
        self.beat(*[t[0].animate.set_fill(C_A, opacity=0.45) for t in tiles[1:3]], Create(loopA))   # HT and TH
        ev_lab = P("event", 24, C_A).next_to(loopA, DOWN, buff=0.1).set_x(tiles[2].get_x())
        a_eq = M("A = {HT, TH}", 32)
        a_eq[0].set_color(C_A)
        a_eq.move_to([0.0, -1.85, 0], aligned_edge=LEFT)
        a_eq.align_to(om_eq, LEFT)
        self.beat(FadeIn(ev_lab), FadeIn(a_eq), q.animate.scale(0.92).set_color(C_DIM)
                  .next_to(a_eq, RIGHT, buff=0.45))                              # called an event
        self.beat(*[Indicate(t, color=C_A, scale_factor=1.1) for t in tiles[1:3]])   # one of its members
        self.pause(0.4)

        # ---- a second event
        loopB = RoundedRectangle(width=tiles[0:2].width + 0.46, height=tiles.height + 0.46, corner_radius=0.26,
                                 stroke_color=C_B, stroke_width=4).move_to(tiles[0:2])
        b_eq = M("B = {HH, HT}", 32)
        b_eq[0].set_color(C_B)
        b_eq.next_to(a_eq, DOWN, buff=0.4, aligned_edge=LEFT)
        b_cap = P("first flip heads", 24, C_DIM).next_to(b_eq, RIGHT, buff=0.45)
        b_cap.align_to(q, LEFT)
        self.beat(Create(loopB), FadeIn(b_eq), FadeIn(b_cap))                   # first flip heads: an event
        self.beat(*[Indicate(t, color=C_B, scale_factor=1.1) for t in tiles[0:2]])   # holds HH and HT
        self.beat()                                                              # every yes-or-no question
        self.beat()                                                              # the list matters
        self.beat()                                                              # probabilities attach to sets
        self.pause(0.6)
        self.coin_pic = VGroup(tree, tiles, omega, ss_lab, om, om_eq, q, loopA, ev_lab, a_eq, loopB, b_eq, b_cap)

    # ------------------------------------------------------------------------------------------------
    def grid(self):
        g = self.g = DiceGrid(mass=False)
        cols = [VGroup(*[g.cells[(i, j)] for j in range(1, 7)]) for i in range(1, 7)]
        d = self.say()                                                           # two dice: a grid
        self.play(self.coin_pic.animate.shift(LEFT * 3).set_opacity(0), run_time=1.0)
        self.remove(self.coin_pic)
        self.play(LaggedStart(*[FadeIn(c, shift=DOWN * 0.15) for c in cols], lag_ratio=0.15),
                  FadeIn(g.axes), run_time=min(1.6, max(0.4, d - 1.1)))
        self.beat(Indicate(g.ax_first, color=WHITE, scale_factor=1.3),
                  Indicate(g.ax_second, color=WHITE, scale_factor=1.3))          # across, and down
        c45 = g.cells[(4, 5)]
        lab45 = T("4, 5", 20).move_to(c45)
        d = self.say()                                                           # 36 squares; four then five
        self.wait(max(0.1, d - 2.0))
        self.play(Indicate(c45, color=WHITE, scale_factor=1.25), FadeIn(lab45), run_time=1.0)
        self.pause(0.4)

        # ---- events are regions
        A = g.where(EVEN1)
        B = g.where(SUM10)
        both = [c for c in A if c in B]
        Bonly = [c for c in B if c not in A]

        def row(sym, sym_col, txt, txt_col=C_DIM):
            r = VGroup(M(sym, 32, sym_col), P(txt, 24, txt_col)).arrange(RIGHT, buff=0.3)
            return r

        rA = row("A", C_A, "first die even")
        rB = row("B", C_B, "sum at least 10")
        rAB = row("A ∩ B", C_BOTH, "A and B")
        rAuB = row("A ∪ B", WHITE, "A or B")
        rAc = row("Aᶜ", "#AEB6C4", "not A")
        rBc = row("Bᶜ", "#AEB6C4", "sum below 10")
        legend = VGroup(rA, rB, rAB, rAuB, rAc).arrange(DOWN, aligned_edge=LEFT, buff=0.3)
        LX = -0.3
        legend.move_to([LX, 2.95, 0], aligned_edge=UL)
        sx = max(r[0].width for r in legend)
        for r in (*legend, rBc):
            r[1].next_to(r[0], RIGHT, buff=0.3 + sx - r[0].width)
        self.beat(FadeOut(lab45))                                                # events are regions
        self.beat(*g.paint(A, C_A, 0.45), FadeIn(rA))                            # first die even: 3 columns
        bring = [c.animate.set_stroke(C_B, 3) for c in both]
        self.beat(*g.paint(Bonly, C_B, 0.45), *bring, FadeIn(rB))                # sum at least ten: triangle
        for c in both:
            c.set_z_index(1)
        self.beat(*g.paint(both, C_BOTH, 0.7), FadeIn(rAB))                     # where both happen
        self.beat(*[Indicate(c, color=C_BOTH, scale_factor=1.12) for c in both])  # four squares

        union = region_outline(g, A + Bonly, WHITE, 4).set_z_index(3)
        self.beat(Create(union), FadeIn(rAuB), rt=1.4)                           # at least one: shaded once
        notA = g.where(lambda i, j: i % 2 == 1)
        notB = g.where(lambda i, j: i + j < 10)
        GREY = "#AEB6C4"

        def wash(cells, op=0.3):
            return VGroup(*[Square(side_length=g.s).move_to(c).set_stroke(width=0).set_fill(GREY, opacity=op)
                            for c in cells]).set_z_index(2)

        washA = wash(notA)
        self.beat(FadeIn(washA), FadeIn(rAc))                                    # not even: outside the blue
        self.pause(0.8)

        # ---- De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ
        outU = [c for c in g.sq if c in notA and c in notB]
        rAc.generate_target()
        rAc.target.move_to(rAB, aligned_edge=LEFT)
        rBc.move_to(rAuB, aligned_edge=LEFT)
        self.beat(FadeOut(washA), FadeOut(rAB), FadeOut(rAuB), MoveToTarget(rAc))   # worth checking
        # while a wash is the region being compared, the event fills step back to 15%
        fills = [(c, C_A, 0.45) for c in A if c not in both] + [(c, C_B, 0.45) for c in Bonly] + \
                [(c, C_BOTH, 0.7) for c in both]
        fade = [c.animate.set_fill(col, opacity=0.15) for c, col, _ in fills]
        restore = lambda: [c.animate.set_fill(col, opacity=op) for c, col, op in fills]   # noqa: E731
        # (built lazily: .animate stores its target on the mobject, so a second builder made now would win)
        wlab1 = P("outside A ∪ B", 24, "#AEB6C4").next_to(g.sq, DOWN, buff=0.22)
        wlab2 = P("outside A ∩ B", 24, "#AEB6C4").move_to(wlab1)
        wU = wash(outU, 0.45)
        self.beat(FadeIn(wU), *fade, FadeIn(wlab1))                              # outside the union
        wA2, wB2 = wash(notA, 0.25), wash(notB, 0.25)
        d = self.say()                                                           # not even, and below ten
        self.play(FadeOut(wU), FadeIn(wA2), run_time=0.8)
        self.wait(max(0.1, d * 0.45 - 0.8))
        self.play(FadeIn(wB2), FadeIn(rBc), run_time=0.9)
        wU2 = wash(outU, 0.45)
        self.beat(FadeOut(wA2), FadeOut(wB2), FadeIn(wU2), rt=1.0)               # the same set
        dm1 = eq("(A ∪ B)ᶜ", "=", "Aᶜ ∩ Bᶜ", size=32).move_to([LX, 0.3, 0], aligned_edge=LEFT)
        self.beat(FadeIn(dm1))                                                   # neither A nor B
        self.pause(2.5)                                                          # ⏸ inspect the first identity

        # ---- De Morgan: (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ
        notboth = [c for c in g.sq if c not in both]
        inner = region_outline(g, both, WHITE, 4).set_z_index(3)
        self.beat(FadeOut(wU2), FadeOut(union), Create(inner))                   # the other way round
        wNB = wash(notboth, 0.4)
        self.beat(FadeIn(wNB), FadeOut(wlab1), FadeIn(wlab2))                   # outside the overlap
        wA3, wB3 = wash(notA, 0.25), wash(notB, 0.25)
        dm2 = eq("(A ∩ B)ᶜ", "=", "Aᶜ ∪ Bᶜ", size=32)
        dm2.next_to(dm1, DOWN, buff=0.35, aligned_edge=LEFT)
        d = self.say()                                                           # not both = not A or not B
        self.play(FadeOut(wNB), FadeIn(wA3), FadeIn(wB3), run_time=min(1.2, max(0.4, d * 0.5)))
        self.play(FadeIn(dm2), run_time=0.7)
        self.pause(2.5)                                                          # ⏸ inspect the second identity
        br = Brace(VGroup(dm1, dm2), RIGHT, color=C_DIM)
        dml = P("De Morgan's laws", 24, C_DIM).next_to(br, RIGHT, buff=0.15)
        self.beat(GrowFromCenter(br), FadeIn(dml))                               # TERM ▸ De Morgan's laws
        self.pause(1.5)                                                          # ⏸ read the identities

        # ---- set difference and subset
        Aonly = [c for c in A if c not in both]
        self.beat(FadeOut(wA3), FadeOut(wB3), FadeOut(inner), FadeOut(wlab2), *restore(),
                  FadeOut(VGroup(dm1, dm2, br, dml, rAc, rBc)))                  # two more relations
        dimB = [c.animate.set_fill(opacity=0.12) for c in both + Bonly]
        diff = VGroup(M("A ∖ B", 32, C_A), P("first die even, sum below 10", 24, C_DIM)).arrange(RIGHT, buff=0.3)
        diff.move_to([LX, 1.55, 0], aligned_edge=LEFT)
        n14 = M("18 − 4 = 14 squares", 28).next_to(diff, DOWN, buff=0.2, aligned_edge=LEFT).shift(RIGHT * 0.2)
        d = self.say()                                     # A minus B. Fourteen squares (one beat: no pause between)
        self.play(*dimB, FadeIn(diff), run_time=1.2)
        self.wait(max(0.1, d - 3.4))
        self.play(FadeIn(n14), LaggedStart(*[Indicate(c, color=C_A, scale_factor=1.08) for c in Aonly],
                                           lag_ratio=0.05), run_time=1.6)
        tri = [c.animate.set_fill(C_B, opacity=0.45).set_stroke(C_B, 1.5) for c in both + Bonly]
        c66 = g.cells[(6, 6)]
        box66 = Square(side_length=g.s).move_to(c66).set_stroke(WHITE, 4).set_fill(opacity=0).set_z_index(3)
        sub = M("{(6, 6)} ⊆ B", 32).move_to([LX, 1.55, 0], aligned_edge=LEFT)
        sub[-1].set_color(C_B)
        sub_t = P("subset", 24, C_DIM).next_to(sub, RIGHT, buff=0.4)
        self.beat(*tri, *[c.animate.set_fill(opacity=0.2) for c in Aonly], FadeIn(sub_t),
                  FadeOut(diff), FadeOut(n14))                                   # TERM ▸ subset
        self.beat(Create(box66), FadeIn(sub))                                    # sum of twelve inside sum ≥ 10
        self.beat(Indicate(c66, color=WHITE, scale_factor=1.15))                 # whenever first, second must
        self.pause(0.8)
        legend = VGroup(rA, rB, sub, sub_t, box66)

        # ---- try one: both dice the same
        clear = [c.animate.set_fill(opacity=0).set_stroke("#5B6475", 1.5) for c in g.sq]
        self.beat(*clear, FadeOut(legend))                        # try one yourself
        self.beat()                                                              # both dice the same?
        self.pause(3)                                                            # ⏸ find it

        diag = g.where(lambda i, j: i == j)
        same = P("both dice the same", 26, C_A).move_to([RX, 0.3, 0])
        self.beat(*g.paint(diag, C_A, 0.55), FadeIn(same))                       # along the diagonal
        self.beat(LaggedStart(*[Indicate(c, color=C_A, scale_factor=1.15) for c in diag], lag_ratio=0.25),
                  rt=2.2)                                                        # six squares
        self.pause(0.6)
        self.same, self.diag = same, diag

    # ------------------------------------------------------------------------------------------------
    def coarse(self):
        g = self.g
        self.beat(*g.paint(self.diag, C_A, 0), FadeOut(self.same))              # a choice hidden in this grid
        c45, c54 = g.cells[(4, 5)], g.cells[(5, 4)]
        l45 = T("4, 5", 20).move_to(c45)
        l54 = T("5, 4", 20).move_to(c54)
        self.beat(FadeIn(l45), FadeIn(l54), Indicate(c45, color=WHITE, scale_factor=1.2),
                  Indicate(c54, color=WHITE, scale_factor=1.2))                 # 4 then 5 differs from 5 then 4

        # the sums-only sample space: eleven boxes, 2..12
        boxes = VGroup()
        for k in range(2, 13):
            b = Rectangle(width=0.8, height=0.5, stroke_color="#9AA3B2", stroke_width=2)
            b.add(T(str(k), 22).move_to(b))
            boxes.add(b)
        boxes.arrange(DOWN, buff=0).move_to([2.6, -0.35, 0])
        title = P("sums only", 24, C_DIM).next_to(boxes, UP, buff=0.22)
        self.beat(FadeOut(l45), FadeOut(l54),
                  LaggedStart(*[FadeIn(b) for b in boxes], lag_ratio=0.08), FadeIn(title), rt=1.6)  # only the sum

        box7 = boxes[5]
        seven = g.where(lambda i, j: i + j == 7)
        arrows = VGroup(*[Line(c.get_center(), box7.get_left() + LEFT * 0.05, stroke_color="#C9CED8",
                               stroke_width=2.2, stroke_opacity=0.8).add_tip(tip_length=0.14, tip_width=0.12)
                          for c in seven])
        self.beat(*g.paint(seven, WHITE, 0.25), LaggedStart(*[Create(a) for a in arrows], lag_ratio=0.15),
                  box7.animate.set_stroke(WHITE, 3), rt=1.8)                     # legitimate, but coarser

        # ---- "first die shows six" has no region in the sums-only space
        col6 = g.where(lambda i, j: i == 6)
        a61 = arrows[[c.ij for c in seven].index((6, 1))]
        a16 = arrows[[c.ij for c in seven].index((1, 6))]
        rest = VGroup(*[a for a in arrows if a is not a61 and a is not a16])
        d = self.say()                                                           # sums only: 6 isn't an event
        self.play(*g.paint(col6, C_B, 0.5), run_time=0.8)
        self.play(rest.animate.set_opacity(0.2), a61.animate.set_color(C_B).set_stroke(width=3.5),
                  a16.animate.set_stroke(width=3.5),
                  Indicate(g.cells[(6, 1)], color=C_B, scale_factor=1.2),
                  Indicate(g.cells[(1, 6)], color=WHITE, scale_factor=1.2), run_time=min(1.6, max(0.4, d - 1.0)))
        self.beat()                                                              # first decision in any model
        self.beat()                                                              # wrong answers change it
