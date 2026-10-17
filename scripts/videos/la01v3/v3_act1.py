"""LA01 v3 — Act 1: Moves and recipes (vector, ℝⁿ, addition, scalar multiplication, linear combination)."""
from common import *

U = np.array([2.0, 1.0])
V = np.array([1.0, 2.0])
TGT = np.array([4.0, 5.0])


def fmt(x):
    s = f"{x:.1f}"
    return s.replace("-", "−")


def craft(color=WHITE):
    body = Circle(radius=0.16, stroke_width=0).set_fill("#D9DEE7", 1)
    nose = Triangle(stroke_width=0).set_fill(C_V, 1).scale(0.09).rotate(-PI / 2).move_to(RIGHT * 0.2)
    ring = Circle(radius=0.22, stroke_color=WHITE, stroke_width=1.5, stroke_opacity=0.5)
    return VGroup(ring, body, nose)


class Slider(VGroup):
    """Horizontal control slider driven by a ValueTracker."""

    def __init__(self, label, color, tracker, lo=-3, hi=3, length=3.4):
        super().__init__()
        self.tracker, self.lo, self.hi = tracker, lo, hi
        track = Line(LEFT * length / 2, RIGHT * length / 2, color=C_DIM, stroke_width=4)
        ticks = VGroup(*[Line(UP * 0.07, DOWN * 0.07, color=C_DIM, stroke_width=2).move_to(
            track.point_from_proportion((k - lo) / (hi - lo))) for k in range(lo, hi + 1)])
        zero = M("0", 18, C_DIM).next_to(track.point_from_proportion(-lo / (hi - lo)), DOWN, buff=0.12)
        name = T(label, 24, color, weight=BOLD).next_to(track, LEFT, buff=0.3)
        self.track = track
        knob = always_redraw(lambda: Dot(self.pos(), radius=0.12, color=color))
        val = always_redraw(lambda: M(fmt(tracker.get_value()), 26, color).next_to(track, RIGHT, buff=0.3))
        self.add(track, ticks, zero, name, knob, val)

    def pos(self):
        t = (np.clip(self.tracker.get_value(), self.lo, self.hi) - self.lo) / (self.hi - self.lo)
        return self.track.point_from_proportion(t)


def dimmed(box, on):
    """Dim/undim a boxed() card without making its translucent fill opaque."""
    o = 1.0 if on else 0.3
    box[1].set_opacity(o)
    box[0].set_stroke(opacity=o).set_fill(opacity=0.08 if on else 0.03)
    return box


class V3Act1(NScene):
    BEATS = [
        # 0
        "Act one. Moves and recipes.",
        # 1
        "Here's a little craft sitting at home, and a green target it would like to reach. The craft has two "
        "controls. The blue control pushes it along the blue arrow. The gold control pushes it along the gold "
        "arrow. You can set each control to any amount you like: a little, a lot, or even backwards.",
        # 2
        "Set blue to one, and the craft moves two steps right and one step up. That's the blue move. Set gold "
        "to one, and it moves one step right and two up. That's the gold move.",
        # 3a
        "Each move is what mathematicians call a vector.",
        # 3b
        "You can think of a vector in two ways that turn out to be the same thing. First, it's a list of "
        "numbers: here, two and one.",
        # 3c
        "SLOW|Second, it's an arrow: an instruction. The first number says how far to go across: two steps right. "
        "The second says how far to go up: one step. Put them together, and you get the arrow.",
        # 3d
        "For now, our vectors are exactly these lists of numbers. Later we'll meet vectors that aren't lists, "
        "which a list can still describe once we pick a basis.",
        # 4
        "Notice something about that instruction. It doesn't care where you start. Two right and one up means "
        "the same thing whether you're at home or across town. So I can slide this arrow anywhere I like, and "
        "it's still the same vector.",
        # 5
        "Sometimes we'll use a vector to mean a place rather than a move: the point where an arrow from home "
        "lands. Both uses are fine, as long as you know which one you mean.",
        # 6
        "Here's a quick way to feel the difference. Two directions, like three blocks east and two blocks "
        "north, add up sensibly. Two addresses don't. There's no sensible answer to the town hall plus the "
        "train station.",
        # 7
        "Our moves have two numbers because our world is flat. A list of three numbers is a move in space. And "
        "a list of seven hundred sixty-eight numbers is a move in a space with seven hundred sixty-eight "
        "directions, which is exactly what a word becomes inside a language model. We write R two, R three, "
        "and in general R n, for all the lists of n real numbers.",
        # 8
        "There are exactly two things you can do with moves, and everything in this chapter is built from them.",
        # 9
        "The first: do one move, then another. Blue, then gold. Two right and one up, then one right and two "
        "up, lands you three right and three up. Do them the other way round and you land in exactly the same "
        "place. The two routes trace the two sides of a parallelogram. That's vector addition: add the lists "
        "entry by entry.",
        # 10
        "SLOW|In symbols: add the first entries to get the first entry, and add the second entries to get the "
        "second. In R n it's the same rule, entry by entry, n times.",
        # 11
        "SLOW|And here's why the two routes always meet at the same corner. Each entry is just a sum of ordinary "
        "numbers, and ordinary addition doesn't care about order. u plus v equals v plus u. That one fact is "
        "why the picture is a parallelogram, and not a zig-zag.",
        # 12
        "The second thing you can do: use more or less of a move. Turn the dial up to two, and the arrow "
        "doubles. Turn it down to a half, and it shrinks. At zero, it vanishes: you don't move at all. Push "
        "past zero, and it comes out the other side, pointing backwards.",
        # 13
        "Notice what the dial can never do. It can stretch, shrink and flip, but it can never turn the arrow "
        "sideways. Watch the trail: every amount of one move lands on a single line through home.",
        # 14
        "The number on the dial is called a scalar, because it scales. This is scalar multiplication: multiply "
        "every entry by the same number.",
        # 15
        "SLOW|In symbols, c times a vector multiplies every entry by c. At c equals two and a half, blue becomes "
        "five, two and a half. At minus one and a half, it becomes minus three, minus one and a half. The first "
        "entry is always exactly twice the second, because both are c times the original entries. That's the "
        "algebra behind never turning sideways.",
        # 16
        "Now put the two operations together. Choose an amount of blue and an amount of gold, scale each, and "
        "add. I like to call that a recipe: the moves are the ingredients, and the amounts say how much of each "
        "to use.",
        # 17
        "Can you find a recipe that reaches the green target? Before I move anything, have a guess.",
        # 18
        "One blue, then two gold. Two right and one up, then two lots of one right and two up. That's four right "
        "and five up. We're there.",
        # 19
        "A recipe like this, some amount of one vector plus some amount of another, is called a linear "
        "combination. The amounts are its coefficients. That's the whole vocabulary of this act: vectors are "
        "moves, coefficients are amounts, and a linear combination is a recipe.",
        # 20
        "SLOW|And when you can't guess a recipe, you can solve for it. A vector equation is really one equation per "
        "coordinate. The first entries give two a plus b equals four. The second entries give a plus two b "
        "equals five.",
        # 21a
        "SLOW|From the first equation, b is four minus two a.",
        # 21b
        "SLOW|Put that into the second equation: a, plus two times four minus two a, equals five.",
        # 21c
        "SLOW|Multiply out and collect: a plus eight minus four a is eight minus three a. So eight minus three a "
        "equals five.",
        # 21d
        "SLOW|So three a equals three, and a is one. Then b is four minus two, which is two.",
        # 22
        "SLOW|And always check by rebuilding. One times two, one, is two, one. Two times one, two, is two, four. "
        "Add them, and you get four, five. It checks.",
        # 23
        "SLOW|In general, with any number of vectors, v one up to v k, a linear combination is c one v one, plus c "
        "two v two, and so on, up to c k v k. Every question in this chapter is a question about expressions "
        "of exactly this shape.",
    ]

    def construct(self):
        grp, bar, header = section_card(self, "Act 1", "Moves and recipes",
                                        "What can a craft with two controls do?")
        self.say()
        self.until_end(0.8)
        to_header(self, grp, bar, header)

        p = plane((-2, 6), (-1, 6), unit=0.66).to_edge(LEFT, buff=0.5).shift(DOWN * 0.25)
        home = Dot(p.c2p(0, 0), radius=0.06, color=WHITE)
        home_l = T("home", 18, C_DIM).next_to(home, DL, buff=0.08)
        tgt = Dot(p.c2p(*TGT), radius=0.12, color=C_W)
        tgt_l = M("(4, 5)", 24, C_W).next_to(tgt, RIGHT, buff=0.12)
        a = ValueTracker(0.0)
        b = ValueTracker(0.0)

        def pos():
            return p.c2p(*(a.get_value() * U + b.get_value() * V))

        ship = craft()
        ship.add_updater(lambda m: m.move_to(pos()))
        uarr = vec(p, *U, C_U, width=6)
        varr = vec(p, *V, C_V, width=6)
        sa = Slider("blue", C_U, a)
        sb = Slider("gold", C_V, b)
        panel = VGroup(sa, sb).arrange(DOWN, buff=0.7).to_edge(RIGHT, buff=0.9).shift(UP * 0.6)
        ptitle = T("controls", 22, C_DIM).next_to(panel, UP, buff=0.4)

        # 1 — craft, target, controls
        self.say()
        self.play(Create(p, lag_ratio=0.02), FadeIn(home), FadeIn(home_l), run_time=1.2)
        self.play(FadeIn(ship, scale=0.5), run_time=0.6)
        self.play(FadeIn(tgt, scale=2), FadeIn(tgt_l), run_time=0.7)
        self.play(FadeIn(ptitle), FadeIn(panel), run_time=0.8)
        self.play(GrowArrow(uarr), run_time=0.7)
        self.play(GrowArrow(varr), run_time=0.7)
        self.play(a.animate.set_value(-1.2), run_time=1.0)
        self.play(a.animate.set_value(0), run_time=0.8)
        self.until_end()

        # 2 — the two moves
        self.say()
        trail = TracedPath(ship.get_center, stroke_color=C_U, stroke_width=3, stroke_opacity=0.7)
        self.add(trail)
        self.play(a.animate.set_value(1), run_time=1.6)
        steps_u = M("2 right, 1 up", 26, C_U).next_to(p.c2p(*U), DR, buff=0.1)
        self.play(FadeIn(steps_u), run_time=0.5)
        self.wait(1.2)
        self.play(a.animate.set_value(0), FadeOut(steps_u), run_time=1.0)
        trail.clear_points()
        trail.set_stroke(C_V)
        self.play(b.animate.set_value(1), run_time=1.6)
        steps_v = M("1 right, 2 up", 26, C_V).next_to(p.c2p(*V), UL, buff=0.1)
        self.play(FadeIn(steps_v), run_time=0.5)
        self.until_end()
        self.play(b.animate.set_value(0), FadeOut(steps_v), run_time=0.8)
        self.remove(trail)

        # 3a — name
        self.say()
        self.play(FadeOut(VGroup(panel, ptitle)), FadeOut(tgt), FadeOut(tgt_l), run_time=0.6)
        tag = T("vector", 40, C_U, weight=BOLD).move_to(RIGHT * 3.3 + UP * 2.3)
        self.play(Write(tag), Indicate(uarr, color=WHITE), run_time=1.2)
        self.until_end()

        # 3b — a list
        self.say()
        lst = column_vec(["2", "1"], size=44, color=C_U).move_to(RIGHT * 3.3 + UP * 0.9)
        self.play(FadeIn(lst, shift=DOWN * 0.2), run_time=0.9)
        lbl = T("a list of numbers", 24, C_DIM).next_to(lst, DOWN, buff=0.3)
        self.play(FadeIn(lbl), run_time=0.5)
        self.until_end()

        # 3c — an arrow: across, then up (each entry lights up with its leg)
        self.say()
        e_top, e_bot = lst.entries[0][0], lst.entries[1][0]
        leg_x = DashedLine(p.c2p(0, 0), p.c2p(2, 0), color=C_U, dash_length=0.1, stroke_width=4)
        leg_y = DashedLine(p.c2p(2, 0), p.c2p(2, 1), color=C_U, dash_length=0.1, stroke_width=4)
        self.play(uarr.animate.set_opacity(0.25), run_time=0.4)
        self.play(e_top.animate.scale(1.35).set_color(WHITE), Create(leg_x), run_time=1.6)
        self.wait(1.0)
        self.play(e_top.animate.scale(1 / 1.35).set_color(C_U), e_bot.animate.scale(1.35).set_color(WHITE),
                  Create(leg_y), run_time=1.6)
        self.wait(0.8)
        self.play(e_bot.animate.scale(1 / 1.35).set_color(C_U), uarr.animate.set_opacity(1), run_time=0.9)
        self.play(Indicate(uarr, color=WHITE), run_time=0.9)
        lbl2 = T("an arrow: 2 across, 1 up", 24, C_DIM).next_to(lbl, DOWN, buff=0.15)
        self.play(FadeIn(lbl2), run_time=0.5)
        self.until_end()
        self.play(FadeOut(VGroup(leg_x, leg_y)), run_time=0.4)

        # 3d — for now, vectors are lists
        self.say()
        desc = T("for now: vectors = lists in ℝⁿ", 24, C_U).next_to(lbl2, DOWN, buff=0.35)
        later = T("later: vectors that aren't lists", 22, C_DIM).next_to(desc, DOWN, buff=0.15)
        self.play(FadeIn(desc), run_time=0.6)
        self.wait(2.0)
        self.play(FadeIn(later), run_time=0.6)
        self.until_end()
        self.play(FadeOut(VGroup(later, lbl2)), run_time=0.4)
        mini = VGroup()
        eq = VGroup()

        # 4 — slide the arrow: same vector anywhere
        self.say()
        ghost = uarr.copy().set_opacity(0.25)
        self.add(ghost)
        start = ValueTracker(0.0)

        def tail():
            t = start.get_value()
            path = [(0, 0), (-1.5, 3), (2.5, 3.5), (3, 0.5)]
            k = min(int(t), len(path) - 2)
            f = t - k
            x0 = np.array(path[k]); x1 = np.array(path[k + 1])
            return x0 + (x1 - x0) * f

        moving = always_redraw(lambda: vec(p, *U, C_U, start=tuple(tail()), width=6))
        rd = always_redraw(lambda: M(f"tail ({fmt(tail()[0])}, {fmt(tail()[1])})  →  tip ({fmt(tail()[0] + 2)}, "
                                     f"{fmt(tail()[1] + 1)})", 22, WHITE).next_to(desc, DOWN, buff=0.35))
        rd2 = M("tip − tail = (2, 1)", 26, C_U).next_to(rd, DOWN, buff=0.2)
        self.remove(uarr)
        self.add(moving, rd)
        self.play(FadeIn(rd2), run_time=0.4)
        self.play(start.animate.set_value(1), run_time=2.2)
        self.play(start.animate.set_value(2), run_time=2.0)
        self.play(start.animate.set_value(3), run_time=2.0)
        self.until_end()
        moving.clear_updaters()
        self.play(FadeOut(VGroup(moving, rd, rd2)), ghost.animate.set_opacity(1), run_time=0.6)
        uarr = ghost

        # 5 — point vs move
        self.say()
        tipdot = Dot(p.c2p(*U), radius=0.11, color=C_U)
        self.play(FadeOut(VGroup(mini, eq, lst, tag, desc, lbl)), run_time=0.5)
        self.play(FadeIn(tipdot, scale=2), uarr.animate.set_opacity(0.2), run_time=0.8)
        pv = VGroup(
            VGroup(Arrow(ORIGIN, RIGHT * 1.1 + UP * 0.55, buff=0, color=C_U, stroke_width=6), T("a move", 24, C_U)).arrange(DOWN, buff=0.2),
            VGroup(Dot(radius=0.11, color=C_U), T("a place", 24, C_U)).arrange(DOWN, buff=0.35),
        ).arrange(RIGHT, buff=1.2).move_to(RIGHT * 3.4 + UP * 1.0)
        self.play(FadeIn(pv[0]), run_time=0.6)
        self.play(FadeIn(pv[1]), run_time=0.6)
        self.until_end()

        # 6 — directions add, addresses don't
        self.say()
        o = RIGHT * 2.3 + DOWN * 0.75
        sc_ = 0.38
        e_arr = Arrow(o, o + RIGHT * 3 * sc_, buff=0, color=C_W, stroke_width=5, tip_length=0.14)
        n_arr = Arrow(o + RIGHT * 3 * sc_, o + RIGHT * 3 * sc_ + UP * 2 * sc_, buff=0, color=C_W, stroke_width=5,
                      tip_length=0.14)
        d_arr = Arrow(o, o + RIGHT * 3 * sc_ + UP * 2 * sc_, buff=0, color=WHITE, stroke_width=5, tip_length=0.16)
        el = T("3 east", 18, C_W).next_to(e_arr, DOWN, buff=0.08)
        nl = T("2 north", 18, C_W).next_to(n_arr, RIGHT, buff=0.08)
        d1 = T("3 blocks east + 2 blocks north = one move (3, 2)  ✓", 22, C_W)
        d2 = T("town hall + train station = ?  ✗", 22, C_X)
        d1.move_to(RIGHT * 3.3 + DOWN * 1.35)
        if d1.width > 6.4:
            d1.scale_to_fit_width(6.4)
        self.play(GrowArrow(e_arr), FadeIn(el), run_time=0.8)
        self.play(GrowArrow(n_arr), FadeIn(nl), run_time=0.8)
        self.play(GrowArrow(d_arr), FadeIn(d1), run_time=0.9)
        self.wait(1.5)
        d2.next_to(d1, DOWN, buff=0.35).set_x(3.3)
        self.play(FadeIn(d2, shift=UP * 0.2), run_time=0.7)
        self.play(Wiggle(d2), run_time=1)
        dd = VGroup(e_arr, n_arr, d_arr, el, nl, d1, d2)
        self.until_end()
        self.play(FadeOut(VGroup(pv, dd, tipdot)), uarr.animate.set_opacity(1), run_time=0.6)

        # 7 — R^n
        self.say()
        row2 = column_vec(["2", "1"], size=30, color=C_U)
        row3 = column_vec(["1", "0", "1"], size=30, color=C_V)
        cells = VGroup(*[Rectangle(width=0.1, height=0.42, stroke_width=0.3, stroke_color="#0e1116")
                         .set_fill(interpolate_color(ManimColor(C_X), ManimColor(C_U), float(t)), 0.9)
                         for t in np.random.default_rng(3).uniform(0, 1, 40)]).arrange(RIGHT, buff=0)
        dots = M("…", 30, C_DIM)
        long = VGroup(cells, dots).arrange(RIGHT, buff=0.1)
        lab = VGroup(VGroup(row2, M("ℝ<sup>2</sup>", 30)).arrange(DOWN, buff=0.2),
                     VGroup(row3, M("ℝ<sup>3</sup>", 30)).arrange(DOWN, buff=0.2),
                     VGroup(long, M("ℝ<sup>768</sup>  (a word in a language model)", 24)).arrange(DOWN, buff=0.25))
        lab.arrange(RIGHT, buff=0.6, aligned_edge=DOWN).move_to(RIGHT * 3.0 + UP * 0.6)
        if lab.get_right()[0] > 6.8:
            lab.scale_to_fit_width(6.8 - lab.get_left()[0])
        for g in lab:
            self.play(FadeIn(g, shift=UP * 0.2), run_time=0.7)
            self.wait(1.4)
        rn = M("ℝ<sup><i>n</i></sup> = all lists of <i>n</i> real numbers", 32, C_W).next_to(lab, DOWN, buff=0.6)
        self.play(Write(rn), run_time=1.2)
        self.until_end()
        self.play(FadeOut(VGroup(lab, rn)), run_time=0.5)

        # 8 — two operations
        self.say()
        ops = VGroup(boxed(T("1 · do one move, then another", 26, C_U), color=C_U),
                     boxed(T("2 · use more or less of a move", 26, C_V), color=C_V)).arrange(DOWN, buff=0.4)
        ops.move_to(RIGHT * 3.2 + UP * 1.0)
        self.play(LaggedStart(*[FadeIn(o, shift=LEFT * 0.2) for o in ops], lag_ratio=0.5), run_time=1.4)
        self.until_end()

        # 9 — addition tip to tail
        self.say()
        self.play(ops[1].animate.become(dimmed(ops[1].copy(), False)), run_time=0.4)
        v_at_u = vec(p, *V, C_V, start=tuple(U), width=6)
        u_at_v = dashed_vec(p, tuple(V), tuple(U), color=C_U)
        self.play(TransformFromCopy(varr, v_at_u), run_time=1.4)
        s = vec(p, 3, 3, C_W, width=6)
        sl = M("(3, 3)", 26, C_W).next_to(s.get_end(), UR, buff=0.08)
        self.play(GrowArrow(s), FadeIn(sl), run_time=1.0)
        self.wait(1.5)
        self.play(Create(u_at_v), run_time=1.4)
        para = Polygon(p.c2p(0, 0), p.c2p(*U), p.c2p(3, 3), p.c2p(*V), stroke_width=0).set_fill(C_P, 0.25)
        self.play(FadeIn(para), run_time=0.8)
        addeq = M("(2, 1) + (1, 2) = (3, 3)", 32, WHITE).move_to(RIGHT * 3.2 + DOWN * 0.6)
        self.play(Write(addeq), run_time=1.2)
        self.until_end()

        # 10 — precise addition
        self.say()
        g2 = M("(<i>a</i><sub>1</sub>, <i>a</i><sub>2</sub>) + (<i>b</i><sub>1</sub>, <i>b</i><sub>2</sub>) = "
               "(<i>a</i><sub>1</sub> + <i>b</i><sub>1</sub>, <i>a</i><sub>2</sub> + <i>b</i><sub>2</sub>)", 28)
        gn = M("(<i>a</i><sub>1</sub>, …, <i>a<sub>n</sub></i>) + (<i>b</i><sub>1</sub>, …, <i>b<sub>n</sub></i>) = "
               "(<i>a</i><sub>1</sub> + <i>b</i><sub>1</sub>, …, <i>a<sub>n</sub></i> + <i>b<sub>n</sub></i>)", 24, C_DIM)
        prec = VGroup(g2, gn).arrange(DOWN, buff=0.3).next_to(addeq, DOWN, buff=0.5).set_x(3.2)
        if prec.width > 6.6:
            prec.scale_to_fit_width(6.6)
        tagp = T("PRECISE", 18, C_V, weight=BOLD).next_to(prec, UP, buff=0.15).align_to(prec, LEFT)
        self.play(FadeIn(tagp), Write(g2), run_time=1.6)
        self.play(FadeIn(gn, shift=UP * 0.1), run_time=1.0)
        self.until_end(1.5)

        # 11 — why it's a parallelogram
        self.say()
        comm = M("<i>u</i> + <i>v</i> = <i>v</i> + <i>u</i>", 36, C_W).move_to(addeq)
        self.play(FadeOut(VGroup(prec, tagp)), ReplacementTransform(addeq, comm), run_time=1.0)
        ent = M("2 + 1 = 1 + 2,   1 + 2 = 2 + 1", 26, C_DIM).next_to(comm, DOWN, buff=0.4)
        self.play(FadeIn(ent), run_time=0.8)
        self.play(Indicate(para, color=C_P, scale_factor=1.05), run_time=1.2)
        self.until_end()
        self.play(FadeOut(VGroup(v_at_u, u_at_v, s, sl, para, comm, ent)), ops[1].animate.become(dimmed(ops[1].copy(), True)),
                  ops[0].animate.become(dimmed(ops[0].copy(), False)), run_time=0.7)

        # 12 — scaling dial
        self.say()
        c = ValueTracker(1.0)
        varr.set_opacity(0.15)
        uarr.set_opacity(0.0)
        scaled = always_redraw(lambda: vec(p, *(c.get_value() * U), C_U, width=6)
                               if abs(c.get_value()) > 0.06 else Dot(p.c2p(0, 0), radius=0.08, color=C_U))
        dial = Slider("c", C_U, c, lo=-2, hi=3, length=3.0).move_to(RIGHT * 3.4 + DOWN * 0.6)
        self.add(scaled)
        self.play(FadeIn(dial), run_time=0.5)
        self.play(c.animate.set_value(2), run_time=1.4)
        self.wait(0.6)
        self.play(c.animate.set_value(0.5), run_time=1.4)
        self.wait(0.6)
        self.play(c.animate.set_value(0), run_time=1.2)
        self.wait(0.6)
        self.play(c.animate.set_value(-1), run_time=1.4)
        self.until_end()

        # 13 — never sideways; the trail is a line
        self.say()
        tip = Dot(p.c2p(*(c.get_value() * U)), radius=0.05, color=C_U)
        tip.add_updater(lambda m: m.move_to(p.c2p(*(c.get_value() * U))))
        ctrail = TracedPath(tip.get_center, stroke_color=C_U, stroke_width=3, stroke_opacity=0.8)
        self.add(tip, ctrail)
        self.play(c.animate.set_value(3), run_time=2.4)
        self.play(c.animate.set_value(-0.9), run_time=2.4)
        line = line_through(p, (2, 1), C_U, span=1.6, width=2).set_opacity(0.4)
        self.play(FadeIn(line), run_time=0.6)
        self.until_end()

        # 14 — scalar (heading, then dial below it: one vertical column)
        self.say()
        sc = T("scalar  ·  scalar multiplication", 30, C_U, weight=BOLD).move_to(RIGHT * 3.3 + UP * 2.4)
        self.play(FadeOut(ops), Write(sc), dial.animate.move_to(RIGHT * 3.3 + UP * 1.5), run_time=1.0)
        self.until_end()

        # 15 — precise scaling: rule, live vector, invariant, exact holds
        self.say()
        rule = M("<i>c</i> · (<i>a</i><sub>1</sub>, <i>a</i><sub>2</sub>) = (<i>c a</i><sub>1</sub>, <i>c a</i><sub>2</sub>)", 30)
        rule.move_to(RIGHT * 3.3 + UP * 0.55)

        def cr():  # one rounding, used for every readout, so 2·(second) is exactly the first
            return round(c.get_value(), 1)

        live = always_redraw(lambda: M(f"<i>c</i> = {fmt(cr())}:   <i>c</i><i>u</i> = ({fmt(2 * cr())}, {fmt(cr())})",
                                       28, C_U).move_to(RIGHT * 3.3 + DOWN * 0.25))
        inv = T("first entry = 2 × second, for every c", 22, C_DIM).move_to(RIGHT * 3.3 + DOWN * 0.95)
        self.play(Write(rule), run_time=1.4)
        self.wait(1.2)
        self.add(live)
        self.play(c.animate.set_value(2.5), run_time=1.8)
        self.wait(1.6)
        self.play(c.animate.set_value(-1.5), run_time=2.0)
        self.wait(1.6)
        self.play(FadeIn(inv), run_time=0.6)
        self.until_end()
        self.play(c.animate.set_value(1), run_time=1.2)
        tip.clear_updaters()
        self.play(FadeOut(VGroup(sc, rule, live, inv, dial, line, ctrail, tip, scaled)), run_time=0.6)
        uarr.set_opacity(1)
        varr.set_opacity(1)
        self.add(uarr, varr)

        # 16 — recipes
        self.say()
        a.set_value(0)
        b.set_value(0)
        self.play(FadeIn(tgt), FadeIn(tgt_l), FadeIn(ptitle), FadeIn(panel), run_time=0.8)
        card = VGroup(T("recipe", 24, C_DIM), M("blue × ?   gold × ?", 30)).arrange(DOWN, buff=0.15)
        card.next_to(panel, DOWN, buff=0.7)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        ingred = T("moves = ingredients · amounts = how much", 22, C_DIM).next_to(card, DOWN, buff=0.3)
        self.play(FadeIn(ingred), run_time=0.6)
        self.until_end()

        # 17 — prediction
        self.say()
        self.play(Indicate(tgt, color=C_W, scale_factor=1.6), run_time=1.2)
        self.until_end()
        self.wait(4)

        # 18 — reach it
        self.say()
        tr = TracedPath(ship.get_center, stroke_color=WHITE, stroke_width=3, stroke_opacity=0.6)
        self.add(tr)
        card2 = M("blue × 1   gold × ?", 30).move_to(card[1])
        self.play(a.animate.set_value(1), Transform(card[1], card2), run_time=1.8)
        card3 = M("blue × 1   gold × 2", 30).move_to(card[1])
        self.play(b.animate.set_value(2), Transform(card[1], card3), run_time=2.4)
        self.play(Flash(tgt, color=C_W, line_length=0.3, num_lines=12), run_time=0.8)
        self.until_end()

        # 19 — linear combination, coefficients
        self.say()
        lc = M("<span foreground='#F4C152'>1</span>·<i>u</i> + <span foreground='#F4C152'>2</span>·<i>v</i> = (4, 5)", 38)
        lc.move_to(card).shift(DOWN * 0.1)
        self.play(FadeOut(ingred), ReplacementTransform(card, lc), run_time=1.0)
        n1 = T("linear combination", 28, C_W, weight=BOLD).next_to(lc, DOWN, buff=0.45)
        n2 = T("coefficients = the amounts", 24, C_V).next_to(n1, DOWN, buff=0.2)
        self.play(Write(n1), run_time=0.9)
        self.play(FadeIn(n2), run_time=0.6)
        self.until_end()

        # 20 — one equation per coordinate
        self.say()
        self.play(FadeOut(VGroup(n1, n2, panel, ptitle)), run_time=0.5)
        ve = M("<i>a</i>·(2, 1) + <i>b</i>·(1, 2) = (4, 5)", 32).move_to(RIGHT * 3.2 + UP * 2.2)
        e1 = M("2<i>a</i> + <i>b</i> = 4", 32, C_U)
        e2 = M("<i>a</i> + 2<i>b</i> = 5", 32, C_V)
        es = VGroup(e1, e2).arrange(DOWN, buff=0.25, aligned_edge=LEFT).next_to(ve, DOWN, buff=0.45)
        self.play(ReplacementTransform(lc, ve), run_time=1.0)
        self.play(FadeIn(e1, shift=DOWN * 0.15), run_time=0.8)
        self.wait(0.8)
        self.play(FadeIn(e2, shift=DOWN * 0.15), run_time=0.8)
        self.until_end(1.5)

        # 21 — solve, one line per beat, with reading holds
        lines = [M("<i>b</i> = 4 − 2<i>a</i>", 30),
                 M("<i>a</i> + 2(4 − 2<i>a</i>) = 5", 30),
                 M("8 − 3<i>a</i> = 5", 30),
                 M("<i>a</i> = 1,   <i>b</i> = 2", 32, C_W)]
        sol = VGroup(*lines).arrange(DOWN, buff=0.22, aligned_edge=LEFT).next_to(es, DOWN, buff=0.45).align_to(es, LEFT)
        tagp = T("PRECISE", 18, C_V, weight=BOLD).next_to(es, UP, buff=0.12).align_to(es, LEFT)
        self.play(FadeIn(tagp), run_time=0.3)
        for i, ln in enumerate(lines):
            self.say()
            if i == 0:
                self.play(Indicate(e1, color=WHITE), run_time=0.8)
                self.play(Write(ln), run_time=1.0)
            elif i == 1:
                self.play(Indicate(e2, color=WHITE), run_time=0.8)
                self.play(TransformFromCopy(VGroup(e2, lines[0]), ln), run_time=1.4)
            elif i == 2:
                self.play(TransformFromCopy(lines[1], ln), run_time=1.2)
            else:
                self.play(TransformFromCopy(lines[2], ln), run_time=1.2)
                self.play(Circumscribe(ln, color=C_W), run_time=1.0)
            self.until_end(1.2)

        # 22 — check, three short lines inside the right panel
        self.say()
        self.play(FadeOut(VGroup(lines[0], lines[1], lines[2])), lines[3].animate.next_to(es, DOWN, buff=0.45).align_to(es, LEFT),
                  run_time=0.6)
        c1 = M("1·(2, 1) + 2·(1, 2)", 30)
        c2 = M("= (2, 1) + (2, 4)", 30)
        c3 = M("= (4, 5)  ✓", 30, C_W)
        chk = VGroup(c1, c2, c3).arrange(DOWN, buff=0.2, aligned_edge=LEFT).next_to(lines[3], DOWN, buff=0.45)
        chk.align_to(es, LEFT)
        for ln in chk:
            self.play(Write(ln), run_time=1.0)
            self.wait(0.7)
        self.until_end(1.2)
        sol = VGroup(lines[3])

        # 23 — general form
        self.say()
        self.play(FadeOut(VGroup(ve, es, sol, chk, tagp)), run_time=0.6)
        gen = M("<i>c</i><sub>1</sub><i>v</i><sub>1</sub> + <i>c</i><sub>2</sub><i>v</i><sub>2</sub> + ⋯ + "
                "<i>c<sub>k</sub></i><i>v<sub>k</sub></i>", 40, WHITE).move_to(RIGHT * 3.2 + UP * 1.2)
        brace_c = T("amounts (coefficients)", 22, C_V).next_to(gen, DOWN, buff=0.35)
        brace_v = T("moves (vectors)", 22, C_U).next_to(brace_c, DOWN, buff=0.15)
        self.play(Write(gen), run_time=1.8)
        self.play(FadeIn(brace_c), FadeIn(brace_v), run_time=0.8)
        self.play(Circumscribe(gen, color=C_W), run_time=1.4)
        self.done(1.0)
        ship.clear_updaters()
        self.clear_all()
