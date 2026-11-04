"""Stick or switch? (docs/PS00_VIDEO_SCRIPT.md, section 6).

The picture: three doors on the left with the host's rules as short labels on the right. Under the doors sits
the mass picture: three equal columns, one per place the prize could be, each holding a third. The host's
action is conditioning, done the same way as the reference scene: the part of each column consistent with
"host opens 3" stays lit, the rest is crossed out, and the lit pieces slide together and stretch to fill the
same footprint. Widths are mass, so 1/6 and 1/3 become 1/3 and 2/3; with an ignorant host, 1/6 and 1/6 become
1/2 and 1/2.
"""
from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column
DX = [-5.3, -3.3, -1.3]                 # door / column centres
COLW, COLH, COLY = 2.0, 2.4, -1.75      # mass columns: width, height, centre y
LEFTX = DX[0] - COLW / 2
DOOR_FILL = "#3A4252"
LIT = 0.55


def door(k):
    body = RoundedRectangle(width=1.4, height=2.1, corner_radius=0.1, stroke_color="#9AA3B2", stroke_width=3)
    body.set_fill(DOOR_FILL, opacity=1)
    num = T(str(k), 34).move_to(body.get_center() + UP * 0.45)
    knob = Dot(radius=0.06, color="#9AA3B2").move_to(body.get_center() + RIGHT * 0.45 + DOWN * 0.15)
    g = VGroup(body, num, knob).move_to([DX[k - 1], 2.15, 0])
    g.body, g.num, g.knob = body, num, knob
    return g


def piece(x0, w, lit=True):
    r = Rectangle(width=w, height=COLH, stroke_color="#5B6475", stroke_width=1.5)
    r.set_fill(C_MASS, opacity=LIT if lit else 0.3)
    return r.move_to([x0 + w / 2, COLY, 0])


def cross(r):
    return Line(r.get_corner(UL) + DR * 0.12, r.get_corner(DR) + UL * 0.12, stroke_color="#6B7385", stroke_width=2)


def two(a, b, color=WHITE):
    """A two-line label, centred."""
    return VGroup(P(a, 22, color), P(b, 22, color)).arrange(DOWN, buff=0.08)


def off(r):
    return r.animate.set_fill(C_OFF, opacity=0.9).set_stroke("#3A4252")


class StickOrSwitch(NScene):
    PARAS = [
        ["The detector had a hidden ingredient, how common contamination was to begin with.",
         "The next puzzle hides a different one, the rule followed by whoever shows you the information."],
        ["There are three doors, and a prize is behind one of them, equally likely to be behind each.",
         "You pick door one.",
         "The host knows where the prize is.",
         "The host will always open one of the other two doors, always one without the prize, and will always "
         "offer you the chance to switch.",
         "If both of the other doors are empty, the host chooses between them by tossing a fair coin."],
        ["The host opens door three.",
         "It's empty.",
         "Should you stick with door one, switch to door two, or does it make no difference?"],
        ["Here's a reasonable-sounding argument.",
         "Two doors are left, the prize is behind one of them, so it's fifty-fifty.",
         "That's counting what's left.",
         "The loaded die already showed that you have to weigh what's left instead."],
        ["Start before the host does anything.",
         "Three cases, each with a third of the mass."],
        ["If the prize is behind door one, the host could open door two or door three, and opens three half the "
         "time.",
         "So this case keeps a third times a half.",
         "One sixth."],
        ["If the prize is behind door two, the host can't open door two, and can't open your door.",
         "Door three is forced.",
         "This case keeps all of its third."],
        ["If the prize were behind door three, the host would never have opened it.",
         "That case is gone."],
        ["So the two cases still standing carry a sixth and a third.",
         "They aren't equal.",
         "Rescale them to add to one, and door one has a third while door two has two thirds.",
         "Switch."],
        ["That's the answer once you've seen this particular door opened.",
         "Separately, a player who always switches wins two games in every three over the long run, because "
         "switching loses only when the first pick was right.",
         "Here the two numbers agree, but they answer different questions."],
        ["Change one thing.",
         "Suppose the host doesn't know where the prize is, opens door two or door three at random, and door three "
         "just happens to be empty.",
         "Now what?"],
        ["If the prize is behind door one, door three is opened half the time.",
         "A third times a half.",
         "If it's behind door two, this host also opens door three only half the time.",
         "Another third times a half.",
         "Equal weights, so now it really is fifty-fifty.",
         "The doors didn't change.",
         "The host's rule did, and the host's rule is part of the model."],
    ]

    # ------------------------------------------------------------------------------------------------
    def beat(self, *anims, rt=1.2, lag=None, pre=None):
        """Start the next beat and play anims inside it (never longer than the beat)."""
        d = self.say()
        if pre:
            pre()
        if anims:
            t = min(rt, max(0.3, d - 0.15))
            if lag is not None:
                self.play(LaggedStart(*anims, lag_ratio=lag), run_time=t)
            else:
                self.play(*anims, run_time=t)
        return d

    def construct(self):
        self.setup_game()
        self.fifty_fifty()
        self.weigh()
        self.ignorant_host()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def setup_game(self):
        doors = self.doors = [door(k) for k in (1, 2, 3)]
        self.beat(LaggedStart(*[FadeIn(d, shift=UP * 0.15) for d in doors], lag_ratio=0.2), rt=1.4)  # hidden ingredient
        self.beat()                                                    # a different one: the host's rule

        texts = ["prize: random door", "you pick 1", "host knows", "host opens an empty, unpicked door",
                 "always offers switch", "both empty → fair coin"]
        rules = self.rules = VGroup(*[P(s, 24) for s in texts]).arrange(DOWN, buff=0.24, aligned_edge=LEFT)
        rules.move_to([RX, 2.05, 0]).align_to(np.array([0.75, 0, 0]), LEFT)
        you = self.you = P("you", 22, C_DIM).next_to(doors[0], DOWN, buff=0.15)
        ring = self.ring = SurroundingRectangle(doors[0].body, color=WHITE, buff=0.06, corner_radius=0.14,
                                                stroke_width=3)
        self.beat(FadeIn(rules[0]))                                    # prize at random
        self.beat(FadeIn(rules[1]), Create(ring), FadeIn(you))         # you pick door one
        self.beat(FadeIn(rules[2]))                                    # host knows
        self.beat(FadeIn(rules[3]), FadeIn(rules[4]), lag=0.6, rt=2.0)  # always opens an empty door, offers switch
        self.beat(FadeIn(rules[5]))                                    # both empty: fair coin

        d3 = doors[2]
        frame = self.frame3 = RoundedRectangle(width=1.4, height=2.1, corner_radius=0.1, stroke_color="#9AA3B2",
                                               stroke_width=3).set_fill("#07090c", opacity=1).move_to(d3)
        panel = d3.body.copy().stretch_to_fit_width(0.2).align_to(d3.body, LEFT)
        empty = self.empty = P("empty", 22, C_DIM).move_to(frame.get_center() + RIGHT * 0.1 + DOWN * 0.2)
        d = self.say()                                                 # host opens door three
        self.add(frame)
        self.bring_to_back(frame)
        self.play(Transform(d3.body, panel), d3.num.animate.move_to(frame.get_center() + UP * 0.45 + RIGHT * 0.1),
                  FadeOut(d3.knob), run_time=min(1.0, max(0.4, d - 0.2)))
        d3.remove(d3.knob)
        self.beat(FadeIn(empty))                                       # it's empty
        self.beat()                                                    # stick, switch, no difference?
        self.pause(5)                                                  # ⏸ decide

    # ------------------------------------------------------------------------------------------------
    def fifty_fifty(self):
        d3 = self.doors[2]
        self.open3 = VGroup(self.frame3, d3, self.empty)
        self.beat(self.open3.animate.set_opacity(0.4))                 # a reasonable-sounding argument
        halves = VGroup(*[M("1/2", 32, C_DIM).next_to(self.doors[k], UP, buff=0.15) for k in (0, 1)])
        self.beat(FadeIn(halves, lag_ratio=0.4))                       # two doors left: fifty-fifty
        strikes = VGroup(*[Line(h.get_corner(DL) + LEFT * 0.08, h.get_corner(UR) + RIGHT * 0.08, color=C_X,
                                stroke_width=4) for h in halves])
        self.beat(Create(strikes))                                     # counting what's left
        self.beat()                                                    # weigh what's left
        self.play(FadeOut(halves), FadeOut(strikes), run_time=0.5)
        self.pause(0.3)

    # ------------------------------------------------------------------------------------------------
    def columns(self):
        cols = VGroup(*[piece(LEFTX + k * COLW, COLW, lit=False) for k in range(3)])
        thirds = VGroup(*[M("1/3", 30).move_to(c.get_top() + DOWN * 0.4) for c in cols])
        names = VGroup(*[P(s, 22, C_DIM).next_to(c, DOWN, buff=0.18)
                         for s, c in zip(("prize behind 1", "behind 2", "behind 3"), cols)])
        return cols, thirds, names

    def split(self, k):
        """Column k (0-based) as a lit left half (host opens 3) and a right half (host opens 2)."""
        x0 = LEFTX + k * COLW
        a, b = piece(x0, COLW / 2, lit=False), piece(x0 + COLW / 2, COLW / 2, lit=False)
        la = two("opens", "3").move_to(a.get_center() + DOWN * 0.3)
        lb = two("opens", "2", C_DIM).move_to(b.get_center() + DOWN * 0.3)
        return a, b, la, lb

    def row(self, label, maths, y):
        g = VGroup(P(label, 22, C_DIM), M(maths, 30)).arrange(RIGHT, buff=0.3)
        return g.move_to([RX, y, 0]).align_to(np.array([0.75, 0, 0]), LEFT)

    def weigh(self):
        cols, thirds, names = self.columns()
        self.beat(FadeIn(cols, lag_ratio=0.2), FadeIn(names, lag_ratio=0.2), rt=1.4)   # before the host acts
        self.beat(FadeIn(thirds, lag_ratio=0.3))                       # three cases, a third each

        # ---- prize behind 1: the host tosses the coin
        a, b, la, lb = self.split(0)
        swap1 = lambda: (self.add(a, b), self.remove(cols[0]), self.add(thirds[0]))   # noqa: E731
        self.beat(a.animate.set_fill(C_MASS, opacity=LIT), FadeIn(la), FadeIn(lb),
                  thirds[0].animate.move_to(a.get_top() + DOWN * 0.4), rt=1.4, pre=swap1)  # opens three half the time
        xb = cross(b)
        r1 = self.row("behind 1", "1/3 · 1/2", -0.05)
        self.beat(off(b), Create(xb), lb.animate.set_opacity(0.5), FadeIn(r1))             # a third times a half
        sixth = M("1/6", 30).move_to(thirds[0])
        eq1 = M("= 1/6", 30).next_to(r1, RIGHT, buff=0.14)
        self.beat(FadeIn(eq1), ReplacementTransform(thirds[0], sixth))                      # one sixth

        # ---- prize behind 2: door 3 is forced
        self.beat(Indicate(self.doors[1], color=C_X, scale_factor=1.05),
                  Indicate(self.doors[0], color=C_X, scale_factor=1.05))                  # can't open 2, nor yours
        l2 = two("opens", "3").move_to(cols[1].get_center() + DOWN * 0.3)
        self.beat(cols[1].animate.set_fill(C_MASS, opacity=LIT), FadeIn(l2))               # door three is forced
        r2 = self.row("behind 2", "1/3 · 1 = 1/3", -0.6)
        self.beat(FadeIn(r2))                                                               # keeps all its third

        # ---- prize behind 3: impossible
        l3 = two("never", "opens 3", C_DIM).move_to(cols[2].get_center() + DOWN * 0.3)
        x3 = cross(cols[2])
        self.beat(off(cols[2]), Create(x3), FadeIn(l3), thirds[2].animate.set_opacity(0.4))  # never opened it
        self.beat()                                                                         # that case is gone
        self.pause(0.4)

        # ---- rescale
        self.beat(Indicate(VGroup(a, sixth), color=C_MASS, scale_factor=1.05),
                  Indicate(VGroup(cols[1], thirds[1]), color=C_MASS, scale_factor=1.05))  # a sixth and a third
        self.beat()                                                                         # they aren't equal
        W = 3 * COLW
        ta = piece(LEFTX, W / 3)
        tb = piece(LEFTX + W / 3, 2 * W / 3)
        n1 = M("1/3", 30).move_to(ta.get_top() + DOWN * 0.4)
        n2 = M("2/3", 30).move_to(tb.get_top() + DOWN * 0.4)
        q1 = self.row("door 1", "(1/6) / (1/2) = 1/3", -1.45)
        q2 = self.row("door 2", "(1/3) / (1/2) = 2/3", -2.0)
        d = self.say()                                                 # rescale: a third and two thirds
        self.play(FadeOut(VGroup(b, xb, lb, cols[2], x3, l3, thirds[2], names[2], la, l2)), run_time=0.5)
        self.play(Transform(a, ta), Transform(cols[1], tb), ReplacementTransform(sixth, n1),
                  ReplacementTransform(thirds[1], n2), names[1].animate.next_to(tb, DOWN, buff=0.18),
                  names[0].animate.next_to(ta, DOWN, buff=0.18), run_time=min(1.8, max(0.5, d * 0.5)))
        self.play(FadeIn(q1), FadeIn(q2), run_time=min(0.8, max(0.3, d * 0.5 - 0.6)))
        self.beat(Indicate(self.doors[1], color=C_BOTH, scale_factor=1.08), Indicate(n2, color=C_BOTH))   # switch
        self.pause(1.5)                                                # inspection hold on the finished rescale

        # ---- this game versus the long run
        given = P("having seen door 3 opened", 22, C_B).next_to(q2, DOWN, buff=0.28).align_to(q2, LEFT)
        self.beat(FadeIn(given))                                       # this particular door opened
        longrun = VGroup(P("always switching, long run", 22, C_DIM), P("wins 2 games in 3", 26))
        longrun.arrange(DOWN, buff=0.12, aligned_edge=LEFT).next_to(given, DOWN, buff=0.4).align_to(given, LEFT)
        self.beat(FadeIn(longrun), rt=1.0)                             # always switches: 2 in 3
        self.beat(Indicate(VGroup(q2, given), color=WHITE, scale_factor=1.04),
                  Indicate(longrun, color=WHITE, scale_factor=1.04), rt=1.4)   # agree, different questions
        self.pause(0.6)
        self.mass = VGroup(a, cols[1], n1, n2, names[0], names[1])
        self.maths = VGroup(r1, eq1, r2, q1, q2, given, longrun)

    # ------------------------------------------------------------------------------------------------
    def ignorant_host(self):
        rules = self.rules
        knows = rules[2]
        strike = Line(knows.get_left() + LEFT * 0.06, knows.get_right() + RIGHT * 0.06, color=C_X, stroke_width=4)
        cols, thirds, names = self.columns()
        d = self.say()                                                 # change one thing
        self.play(FadeOut(self.maths), FadeOut(self.mass), FadeIn(cols), FadeIn(thirds), FadeIn(names),
                  Create(strike), run_time=min(1.4, max(0.5, d - 0.1)))
        new = P("host picks 2 or 3 at random", 24, C_B).move_to(knows, aligned_edge=LEFT)
        self.beat(FadeOut(strike), ReplacementTransform(knows, new),
                  rules[3].animate.set_opacity(0.3), rules[5].animate.set_opacity(0.3), rt=1.4)   # doesn't know
        self.beat()                                                    # now what?
        self.pause(6)                                                  # ⏸ predict, or redo the weights

        a, b, la, lb = self.split(0)
        swap1 = lambda: (self.add(a, b), self.remove(cols[0]), self.add(thirds[0]))   # noqa: E731
        xb = cross(b)
        self.beat(a.animate.set_fill(C_MASS, opacity=LIT), off(b), Create(xb), FadeIn(la),
                  FadeIn(lb), thirds[0].animate.move_to(a.get_top() + DOWN * 0.4), rt=1.4, pre=swap1)   # behind 1: half the time
        r1 = self.row("behind 1", "1/3 · 1/2 = 1/6", -0.05)
        s1 = M("1/6", 30).move_to(thirds[0])
        self.beat(FadeIn(r1), ReplacementTransform(thirds[0], s1))     # a third times a half
        c, e, lc, le = self.split(1)
        swap2 = lambda: (self.add(c, e), self.remove(cols[1]), self.add(thirds[1]))   # noqa: E731
        xe = cross(e)
        self.beat(c.animate.set_fill(C_MASS, opacity=LIT), off(e), Create(xe), FadeIn(lc), FadeIn(le),
                  thirds[1].animate.move_to(c.get_top() + DOWN * 0.4), rt=1.4, pre=swap2)   # behind 2: half the time
        r2 = self.row("behind 2", "1/3 · 1/2 = 1/6", -0.6)
        s2 = M("1/6", 30).move_to(thirds[1])
        l3 = two("prize", "would show", C_DIM).move_to(cols[2].get_center() + DOWN * 0.3)
        x3 = cross(cols[2])
        self.beat(FadeIn(r2), ReplacementTransform(thirds[1], s2), off(cols[2]), Create(x3), FadeIn(l3),
                  thirds[2].animate.set_opacity(0.4), rt=1.4)          # another third times a half

        W = 3 * COLW
        ta, tb = piece(LEFTX, W / 2), piece(LEFTX + W / 2, W / 2)
        n1 = M("1/2", 30).move_to(ta.get_top() + DOWN * 0.4)
        n2 = M("1/2", 30).move_to(tb.get_top() + DOWN * 0.4)
        q1 = self.row("door 1", "(1/6) / (1/3) = 1/2", -1.45)
        q2 = self.row("door 2", "(1/6) / (1/3) = 1/2", -2.0)
        d = self.say()                                                 # equal weights: fifty-fifty
        self.play(FadeOut(VGroup(b, xb, lb, e, xe, le, cols[2], x3, l3, thirds[2], names[2], la, lc)),
                  run_time=0.5)
        self.play(Transform(a, ta), Transform(c, tb), ReplacementTransform(s1, n1), ReplacementTransform(s2, n2),
                  names[0].animate.next_to(ta, DOWN, buff=0.18), names[1].animate.next_to(tb, DOWN, buff=0.18),
                  FadeIn(q1), FadeIn(q2), run_time=min(1.8, max(0.5, d - 0.7)))
        self.beat(*[Indicate(dr, color=WHITE, scale_factor=1.05) for dr in self.doors[:2]],
                  Indicate(self.open3, color=WHITE, scale_factor=1.05))   # the doors didn't change
        self.beat(Circumscribe(new, color=C_B, buff=0.1))              # the host's rule is part of the model
