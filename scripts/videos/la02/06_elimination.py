"""Elimination. Script: docs/LA02_VIDEO_SCRIPT.md, section "Elimination" (chapter §3)."""
from types import SimpleNamespace

from sample import *  # noqa: F401,F403
from sample import LEFT_C, RIGHT_C, TOP_Y, UNIT, C_L1, C_L2, XR, YR, panel, eq_cells

C_R3 = "#D7C49E"     # third equation / plane of the 3 x 3 system (sand)
C_C3 = "#D0D6E0"     # third column of the 3 x 3 system (light grey)
RED = "#E5534B"      # numerical danger
BG = config.background_color


# ---------------------------------------------------------------- helpers (also used by 07_no_pivot)

def aug(rows, size=36, h_buff=1.0, v_buff=0.62, colors=None):
    """Augmented matrix [A | b]: matrix_mob plus a bar before the last column. colors: {row: colour}."""
    ec = {}
    for i, c in (colors or {}).items():
        for j in range(len(rows[0])):
            ec[(i, j)] = c
    m = matrix_mob(rows, size=size, h_buff=h_buff, v_buff=v_buff, entry_colors=ec or None)
    E = m.entries
    x = (E[0][-2].get_center()[0] + E[0][-1].get_center()[0]) / 2
    bar = Line([x, m[0].get_top()[1] - 0.05, 0], [x, m[0].get_bottom()[1] + 0.05, 0], stroke_width=2)
    m.add(bar)
    m.bar, m.size = bar, size
    return m


def put(m, i, j, text, color=None):
    """Replace entry (i, j) of a matrix in place; returns the animation."""
    old = m.entries[i][j]
    new = M(text, m.size, color or old.get_color()).move_to(old)
    return Transform(old, new)          # the entry keeps its identity, so groups holding it stay valid


def ring(mob, color=WHITE, pad=0.14, width=3):
    if mob.width > 1.3 * mob.height:
        return Ellipse(width=mob.width + 2 * pad + 0.06, height=mob.height + 2 * pad + 0.06, color=color,
                       stroke_width=width).move_to(mob)
    return Circle(radius=max(mob.width, mob.height) / 2 + pad, color=color, stroke_width=width).move_to(mob)


def allm(m):
    """A matrix together with every entry put() has swapped in (those live outside the group)."""
    return VGroup(m, *[e for row in m.entries for e in row])


def hl(*mobs, color=WHITE, buff=0.1):
    r = SurroundingRectangle(VGroup(*mobs), color=C_DIM, buff=buff, corner_radius=0.08, stroke_width=2)
    return r.set_fill(color, 0.14)


def row_y(m, i):
    return m.entries[i][0].get_center()[1]


def col_x(m, j):
    return m.entries[0][j].get_center()[0]


def clip(p0, d, x0, x1, y0, y1):
    """Segment of the line p0 + t d inside the rectangle, or None."""
    p0, d = np.asarray(p0, float), np.asarray(d, float)
    lo, hi = -1e9, 1e9
    for k, (a, b) in enumerate(((x0, x1), (y0, y1))):
        if abs(d[k]) < 1e-9:
            if not a <= p0[k] <= b:
                return None
        else:
            t1, t2 = (a - p0[k]) / d[k], (b - p0[k]) / d[k]
            lo, hi = max(lo, min(t1, t2)), min(hi, max(t1, t2))
    if hi - lo < 1e-6:
        return None
    return p0 + lo * d, p0 + hi * d


class Box3:
    """Oblique drawing of R^3: x right, y into the page (up and right), z up. Points are projected only."""

    def __init__(self, origin, scale, ey=(0.55, 0.48)):
        self.O = np.array([*origin, 0.0]) if len(origin) == 2 else np.array(origin, float)
        self.ex = np.array([1.0, 0, 0]) * scale
        self.ey = np.array([ey[0], ey[1], 0]) * scale
        self.ez = np.array([0, 1.0, 0]) * scale

    def p(self, x, y, z):
        return self.O + x * self.ex + y * self.ey + z * self.ez

    def axes(self, xr, yr, zr, names=None, size=24):
        A = VGroup(*[Arrow(self.p(*a), self.p(*b), buff=0, color=C_DIM, stroke_width=2, tip_length=0.14,
                           max_tip_length_to_length_ratio=0.1)
                     for a, b in (((xr[0], 0, 0), (xr[1], 0, 0)), ((0, yr[0], 0), (0, yr[1], 0)),
                                  ((0, 0, zr[0]), (0, 0, zr[1])))])
        if names:
            dirs = (RIGHT, UR, UP)
            A.add(*[M(n, size, C_DIM).next_to(A[k].get_end(), dirs[k], buff=0.06) for k, n in enumerate(names)])
        return A

    def floor(self, xr, yr, color=C_GRID):
        return VGroup(*[Line(self.p(i, yr[0], 0), self.p(i, yr[1], 0), color=color, stroke_width=1)
                        for i in range(xr[0], xr[1] + 1)],
                      *[Line(self.p(xr[0], k, 0), self.p(xr[1], k, 0), color=color, stroke_width=1)
                        for k in range(yr[0], yr[1] + 1)])

    def arrow(self, a, b, color, width=5):
        return Arrow(self.p(*a), self.p(*b), buff=0, color=color, stroke_width=width, tip_length=0.18,
                     max_tip_length_to_length_ratio=0.3)

    def patch(self, center, u, v, s, color, opacity=0.2):
        c, u, v = (np.array(t, float) for t in (center, u, v))
        pts = [self.p(*(c + a * s * u + b * s * v)) for a, b in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        return Polygon(*pts, color=color, stroke_width=1.5, fill_color=color, fill_opacity=opacity)


def plane_basis(n):
    n = np.array(n, float) / np.linalg.norm(n)
    a = np.array([0, 0, 1.0]) if abs(n[2]) < 0.9 else np.array([1.0, 0, 0])
    u = a - a.dot(n) * n
    u /= np.linalg.norm(u)
    return u, np.cross(n, u)


class Elimination(NScene):
    PARAS = [
        # ---- equations as rows of numbers
        ["In school you solved this pair by substitution.",
         "With two equations that's quick.",
         "With ten, every substitution makes the next equation longer, and the bookkeeping gets out of hand.",
         "Is there a way to simplify a system step by step, without ever losing a solution or gaining a false one?"],
        ["First, drop what doesn't change.",
         "The letters x and y sit in the same places in every equation.",
         "Keep only the numbers.",
         "Each row holds one equation, its coefficients, and then, after a bar, its right-hand side."],
        ["Three moves are allowed on the rows.",
         "Swap two rows, which just reorders the equations.",
         "Multiply a row by a number that isn't zero.",
         "And replace a row by itself minus some multiple of a different row.",
         "Row i is written R i."],
        # ---- one replacement, two pictures
        ["The plan is to clear the entry under the top-left two.",
         "That two is the pivot, the entry used to clear the others in its column.",
         "The entry below it is one.",
         "How many copies of row one do you subtract from row two to turn that one into zero?"],
        ["One half.",
         "One divided by two.",
         "That number, the entry to be cleared divided by the pivot, is called the multiplier."],
        ["Row two minus one half of row one.",
         "The first entry cancels, which was the point.",
         "The new row says three halves y equals nine halves."],
        ["What has that done to the picture on the left?",
         "The second equation has changed, so its line must have moved.",
         "Where does it go?"],
        ["It turns about the crossing point until it's flat.",
         "The line y equals three.",
         "The new equation is a combination of the old two, so any point that satisfies both old equations "
         "satisfies it too.",
         "Its line has to pass through the crossing.",
         "And x has disappeared from it, which is why it's flat.",
         "That's what eliminating x means."],
        ["From here the rest is easy.",
         "Three halves y equals nine halves, so y is three.",
         "Put that in the first equation.",
         "Two x minus three equals one, so x is two."],
        ["On the right, the same row operation moves the output panel.",
         "Every point slides vertically by minus a half of its horizontal position.",
         "Points to the right drop, points to the left rise, and points on the vertical axis stay put.",
         "That kind of sliding is called a shear.",
         "Blue drops to two, zero.",
         "Teal rises to minus one, three halves.",
         "The target drops to one, nine halves."],
        ["Blue, teal and the target all moved.",
         "Is two blues and three teals still the recipe?"],
        ["Across, four minus three, is one.",
         "Up, zero plus nine halves, is nine halves.",
         "It still lands on the target.",
         "The shear is linear, so it carries the whole recipe along with the arrows.",
         "And blue now lies flat along the horizontal axis.",
         "Elimination is a sequence of shears like this one, together with swaps, each one chosen to flatten "
         "one more column."],
        # ---- three equations, three unknowns
        ["The same moves work on bigger systems, in a fixed order.",
         "Here are three equations in three unknowns.",
         "Gaussian elimination works through the columns from left to right.",
         "In each column it picks a pivot, and uses it to clear every entry underneath."],
        ["Column one.",
         "The pivot is two.",
         "Below it are four and minus two.",
         "What are the two multipliers?"],
        ["Four over two is two, so take two copies of row one from row two.",
         "Minus two over two is minus one, and subtracting minus one copies means adding row one to row three.",
         "Watch column one empty out below the pivot.",
         "The rest of each new row is on screen."],
        ["Column two.",
         "The pivot is the minus one in row two, and the three beneath it gives the multiplier minus three.",
         "Adding three copies of row two clears it."],
        ["Now every entry below the diagonal is zero, and the pivots two, minus one and minus four sit on the "
         "diagonal.",
         "A square matrix like that is called upper triangular, and it's the shape elimination aims for."],
        ["Back substitution starts at the bottom.",
         "The last row alone gives z equals minus one.",
         "Put that into the row above, and y is two.",
         "Put both into the top row, and x is one.",
         "The check in the original three equations is on screen, and all three hold."],
        ["In the row picture, each equation is a plane, and the three meet at one point, one, two, minus one.",
         "In the column picture, the same numbers are a recipe that lands on three, six, one.",
         "The three pivots were all nonzero.",
         "Those nonzero pivots are the reason there is exactly one solution, and we'll see why once elimination "
         "is written as multiplication."],
        # ---- why the moves are safe
        ["Each row operation changed the equations.",
         "How do you know it didn't change the solutions?"],
        ["There are two things to check.",
         "Every old solution must still solve the new system.",
         "And every new solution must have solved the old one."],
        ["The first is about combinations.",
         "Each new equation is a combination of old ones.",
         "A swap reorders them, scaling multiplies one by c, and replacement forms R i minus ell R j.",
         "If a point satisfies the old equations, it satisfies any combination of them."],
        ["The second is about undoing.",
         "Each operation is reversed by one of the same kind.",
         "A swap is undone by the same swap.",
         "To undo scaling by c, divide by c. That's why c cannot be zero.",
         "To undo subtracting ell copies of row j, add them back. That needs row j to be a different row, "
         "still there unchanged.",
         "The reverse operation takes the new system back to the old one, so the first argument, applied in "
         "reverse, shows that new solutions solve the old system."],
        ["One step at a time, then, any sequence of row operations keeps exactly the same solutions.",
         "This is what makes elimination trustworthy."],
        ["In exact arithmetic, any nonzero entry can be a pivot.",
         "On a computer, which rounds every result, a tiny pivot means a huge multiplier, and that causes trouble.",
         "At the end, we'll see how much, and how practical programs choose their pivots."],
    ]

    def construct(self):
        self.rows_of_numbers()
        self.one_replacement()
        self.three_by_three()
        self.why_safe()
        self.done(1.2)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def rows_of_numbers(self):
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        l1 = Line(pin.c2p(0, -1), pin.c2p(3.5, 6), color=C_L1, stroke_width=4)
        l2 = Line(pin.c2p(-1, 6), pin.c2p(5, 0), color=C_L2, stroke_width=4)
        sol = dot(pin, 2, 3, WHITE, r=0.09)
        eq1 = M("2<i>x</i> − <i>y</i> = 1", 38, C_L1)
        eq2 = M("<i>x</i> + <i>y</i> = 5", 38, C_L2)
        eqs = VGroup(eq1, eq2).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to([-3.5, TOP_Y, 0])

        d = self.say()                                   # substitution
        self.play(Create(pin), FadeIn(tin), FadeIn(eqs), run_time=min(1.4, d * 0.5))
        self.play(Create(l1), Create(l2), FadeIn(sol), run_time=min(1.2, d * 0.4))
        for _ in range(3):
            self.say()
        self.pause(0.5)

        # ---- drop the letters
        e1 = eq_cells(["2", "<i>x</i>", "−", "1", "<i>y</i>", "=", "1"], {k: C_L1 for k in range(7)})
        e2 = eq_cells(["1", "<i>x</i>", "+", "1", "<i>y</i>", "=", "5"], {k: C_L2 for k in range(7)})
        e2.next_to(e1, DOWN, buff=0.3, aligned_edge=LEFT)
        VGroup(e1, e2).move_to(eqs)
        ones = VGroup(e1[3], e2[0], e2[3]).set_opacity(0)
        d = self.say()                                   # drop what doesn't change
        self.play(FadeTransform(eq1, VGroup(*[e1[k] for k in (0, 1, 2, 4, 5, 6)])),
                  FadeTransform(eq2, VGroup(*[e2[k] for k in (1, 2, 4, 5, 6)])), run_time=min(1.0, d))
        self.add(ones)
        self.play(ones.animate.set_opacity(1), run_time=0.5)
        letters = VGroup(e1[1], e2[1], e1[4], e2[4], e1[5], e2[5])
        d = self.say()                                   # letters in the same places
        self.play(Indicate(VGroup(e1[1], e2[1]), color=WHITE), run_time=min(1.0, d * 0.4))
        self.play(Indicate(VGroup(e1[4], e2[4]), color=WHITE), run_time=min(1.0, d * 0.4))
        A = aug([["2", "−1", "1"], ["1", "1", "5"]], size=38, h_buff=1.3, colors={0: C_L1, 1: C_L2})
        A.move_to([-3.5, TOP_Y, 0])
        E = A.entries
        d = self.say()                                   # keep only the numbers
        self.play(FadeOut(letters), run_time=min(0.6, d * 0.4))
        self.play(ReplacementTransform(e1[0], E[0][0]), ReplacementTransform(VGroup(e1[2], e1[3]), E[0][1]),
                  ReplacementTransform(e1[6], E[0][2]), ReplacementTransform(e2[0], E[1][0]),
                  ReplacementTransform(VGroup(e2[2], e2[3]), E[1][1]), ReplacementTransform(e2[6], E[1][2]),
                  run_time=min(1.0, d * 0.5))
        d = self.say()                                   # one equation per row, bar, right-hand side
        self.play(FadeIn(VGroup(A[0], A[2])), run_time=min(0.8, d * 0.4))
        self.play(Create(A.bar), run_time=min(0.8, d * 0.3))
        self.play(Indicate(VGroup(E[0][2], E[1][2]), color=C_W), run_time=min(0.9, d * 0.25))
        term = P("augmented matrix [<i>A</i> | <b>b</b>]", 24, C_DIM).next_to(A, UP, buff=0.08)
        self.play(FadeIn(term), run_time=0.5)
        self.pause(0.6)

        # ---- the three row operations
        def block(name, general, after, op):
            head = VGroup(P(name, 24, C_DIM), M(general, 28)).arrange(RIGHT, buff=0.3)
            b = aug([["2", "−1", "1"], ["1", "1", "5"]], size=24, h_buff=0.62, v_buff=0.42)
            a = aug(after, size=24, h_buff=0.62, v_buff=0.42)
            arr = Arrow(LEFT * 0.75, RIGHT * 0.75, buff=0, stroke_width=3, color=C_DIM, tip_length=0.15)
            lab = M(op, 24).next_to(arr, UP, buff=0.06)
            ex = VGroup(b, VGroup(arr, lab), a).arrange(RIGHT, buff=0.22)
            ex[1].shift(UP * (b.get_center()[1] - arr.get_center()[1]))
            g = VGroup(head, ex).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
            g.head = head
            return g

        blocks = VGroup(
            block("swap", "R<sub>i</sub> ↔ R<sub>j</sub>", [["1", "1", "5"], ["2", "−1", "1"]],
                  "R<sub>1</sub> ↔ R<sub>2</sub>"),
            block("scale", "R<sub>i</sub> ← <i>c</i>R<sub>i</sub>,  <i>c</i> ≠ 0",
                  [["6", "−3", "3"], ["1", "1", "5"]], "R<sub>1</sub> ← 3R<sub>1</sub>"),
            block("replace", "R<sub>i</sub> ← R<sub>i</sub> − ℓR<sub>j</sub>,  <i>j</i> ≠ <i>i</i>",
                  [["2", "−1", "1"], ["−3", "3", "3"]], "R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub>"))
        blocks.arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([3.7, 1.15, 0])
        rlab = VGroup(M("R<sub>1</sub>", 30, C_L1).move_to([E[0][0].get_x() - 0.95, row_y(A, 0), 0]),
                      M("R<sub>2</sub>", 30, C_L2).move_to([E[0][0].get_x() - 0.95, row_y(A, 1), 0]))
        d = self.say()                                   # three moves
        self.play(FadeOut(term), run_time=min(0.6, d))
        for k in range(3):
            d = self.say()
            self.play(FadeIn(blocks[k].head), run_time=min(0.6, d * 0.3))
            ex = blocks[k][1]
            self.play(FadeIn(ex[0]), run_time=min(0.4, d * 0.15))
            self.play(GrowArrow(ex[1][0]), FadeIn(ex[1][1]), TransformFromCopy(ex[0], ex[2]),
                      run_time=min(1.4, d * 0.4))
        d = self.say()                                   # row i is written R i
        self.play(FadeIn(rlab), run_time=min(0.8, d * 0.5))
        self.play(*[Indicate(b.head[1], color=WHITE, scale_factor=1.08) for b in blocks],
                  run_time=min(1.0, d * 0.4))
        self.pause(0.6)
        self.play(FadeOut(blocks), run_time=0.6)
        self.n1 = SimpleNamespace(pin=pin, tin=tin, l1=l1, l2=l2, sol=sol, A=A, rlab=rlab)

    # ------------------------------------------------------------------------------------------------
    def one_replacement(self):
        n = self.n1
        pin, A, E = n.pin, n.A, n.A.entries
        RX = 3.5
        d = self.say()                                   # clear the entry under the top-left two
        rg, h1 = ring(E[0][0]), hl(E[1][0])
        self.play(Create(rg), FadeIn(h1), run_time=min(1.0, d))
        piv = P("pivot", 22, WHITE).next_to(rg, UP, buff=0.04)
        d = self.say()                                   # that two is the pivot
        self.play(FadeIn(piv), Indicate(E[0][0], color=WHITE), run_time=min(1.0, d))
        d = self.say()                                   # the entry below it is one
        self.play(Indicate(E[1][0], color=WHITE, scale_factor=1.3), run_time=min(1.0, d))
        self.say()                                       # how many copies?
        self.pause(3.0)                                  # ⏸ ½ hidden

        half = M("½", 38).move_to([RX + 2.2, 3.35, 0])
        d = self.say()                                   # one half
        self.play(FadeIn(half), run_time=min(0.6, d))
        div = M("1 ÷ 2 =", 30).next_to(half, LEFT, buff=0.15)
        d = self.say()                                   # one divided by two
        self.play(TransformFromCopy(VGroup(E[1][0], E[0][0]), div), run_time=min(1.0, d))
        ell = VGroup(M("ℓ =", 30), P("entry to clear ÷ pivot", 24), M("= ½", 30)).arrange(RIGHT, buff=0.15)
        ell.move_to([RX, 3.35, 0])
        mterm = P("multiplier", 22, C_DIM).next_to(ell, DOWN, buff=0.1).align_to(ell, LEFT)
        d = self.say()                                   # called the multiplier
        self.play(ReplacementTransform(VGroup(div, half), ell), run_time=min(1.0, d * 0.5))
        self.play(FadeIn(mterm), run_time=min(0.6, d * 0.3))

        ca = M("R<sub>2</sub> ← R<sub>2</sub> − ½R<sub>1</sub>", 30, C_L2)
        cb = VGroup(M("(1 − 1,", 30), M("1 + ½", 30), M("|", 30), M("5 − ½)", 30)).arrange(RIGHT, buff=0.18)
        cc = M("= (0,  3/2  |  9/2)", 30, C_L2)
        calc = VGroup(ca, cb, cc).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([RX, 1.7, 0])
        d = self.say()                                   # row two minus one half of row one
        self.play(FadeOut(mterm), FadeIn(ca), run_time=min(1.0, d))
        d = self.say()                                   # the first entry cancels
        self.play(FadeIn(cb), run_time=min(0.8, d * 0.5))
        self.play(Indicate(cb[0], color=WHITE), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # three halves y equals nine halves
        self.play(FadeIn(cc), run_time=min(0.8, d * 0.4))
        self.play(put(A, 1, 0, "0"), put(A, 1, 1, "3/2"), put(A, 1, 2, "9/2"), FadeOut(h1),
                  run_time=min(1.0, d * 0.5))
        self.pause(1.5)                                  # ⏸ read the new row

        # ---- the left picture: the second line turns
        lab1 = M("2<i>x</i> − <i>y</i> = 1", 26, C_L1).move_to(pin.c2p(3.7, -0.45))
        lab2 = M("<i>x</i> + <i>y</i> = 5", 26, C_L2).move_to(pin.c2p(1.3, 5.6))
        new2 = VGroup(M("0<i>x</i>", 24, C_L2), M("+ (3/2)<i>y</i> = 9/2", 24, C_L2)).arrange(RIGHT, buff=0.1)
        new2.move_to(pin.c2p(1.15, 5.62))
        for m_ in (lab1, lab2, new2):
            m_.add_background_rectangle(color=BG, opacity=0.85, buff=0.04)
        d = self.say()                                   # what has that done to the left?
        self.play(FadeIn(lab1), FadeIn(lab2), Indicate(pin, color=WHITE, scale_factor=1.0),
                  run_time=min(1.2, d))
        d = self.say()                                   # the second equation changed
        self.play(ReplacementTransform(lab2, new2), run_time=min(1.2, d))
        self.say()                                       # where does it go?
        self.pause(3.0)                                  # ⏸ turning and y = 3 hidden

        th = ValueTracker(-PI / 4)
        x0, x1 = pin.c2p(XR[0], 0)[0], pin.c2p(XR[1], 0)[0]
        y0, y1 = pin.c2p(0, YR[0])[1], pin.c2p(0, YR[1])[1]
        c23 = pin.c2p(2, 3)

        def turning():
            s = clip(c23, [np.cos(th.get_value()), np.sin(th.get_value()), 0], x0, x1, y0, y1)
            return Line(s[0], s[1], color=C_L2, stroke_width=4)

        l2t = always_redraw(turning)
        self.remove(n.l2)
        self.add(l2t)
        self.bring_to_front(n.sol)
        d = self.say()                                   # it turns about the crossing until flat
        self.play(th.animate.set_value(0), run_time=max(1.2, d - 0.2))
        l2t.clear_updaters()
        y3 = M("<i>y</i> = 3", 26, C_L2).next_to(pin.c2p(-1, 3), UR, buff=0.08)
        y3.add_background_rectangle(color=BG, opacity=0.85, buff=0.04)
        d = self.say()                                   # the line y equals three
        self.play(FadeIn(y3), run_time=min(0.8, d))
        d = self.say()                                   # a combination of the old two
        self.play(Indicate(ca, color=WHITE, scale_factor=1.08), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # it has to pass through the crossing
        rr = ring(n.sol, pad=0.12)
        self.play(Create(rr), run_time=min(0.8, d * 0.5))
        self.play(FadeOut(rr), run_time=0.4)
        d = self.say()                                   # x has disappeared
        self.play(Indicate(new2[0], color=WHITE, scale_factor=1.3), Indicate(E[1][0], color=WHITE, scale_factor=1.3),
                  run_time=min(1.2, d))
        self.say()                                       # that's eliminating x
        self.pause(0.6)

        # ---- back substitution
        bt = P("back substitution", 24, C_DIM)
        b1 = M("(3/2)<i>y</i> = 9/2  ⇒  <i>y</i> = 3", 30)
        b2 = M("2<i>x</i> − 3 = 1  ⇒  <i>x</i> = 2", 30)
        bs = VGroup(bt, b1, b2).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to([RX, 2.6, 0])
        d = self.say()                                   # the rest is easy
        self.play(FadeOut(VGroup(ell, calc)), FadeOut(rg), FadeOut(piv), run_time=min(0.6, d * 0.4))
        self.play(FadeIn(bt), run_time=min(0.6, d * 0.4))
        d = self.say()                                   # y is three
        self.play(FadeIn(b1), Indicate(VGroup(*E[1]), color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
        d = self.say()                                   # put that in the first equation
        self.play(Indicate(VGroup(*E[0]), color=WHITE, scale_factor=1.08), run_time=min(1.2, d))
        d = self.say()                                   # x is two
        self.play(FadeIn(b2), run_time=min(1.0, d * 0.6))
        self.play(Indicate(n.sol, color=WHITE, scale_factor=1.6), run_time=min(0.8, d * 0.35))
        self.pause(0.8)

        # ---- the right picture: a shear
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        s = ValueTracker(0.0)
        ox0, ox1 = pout.c2p(XR[0], 0)[0], pout.c2p(XR[1], 0)[0]
        oy0, oy1 = pout.c2p(0, YR[0])[1], pout.c2p(0, YR[1])[1]

        def S(u, v):
            return (u, v - 0.5 * s.get_value() * u)

        def grid():
            g = VGroup()
            a1, a2 = np.array(S(2, 1)), np.array(S(-1, 1))
            for base, dirv in ((a1, a2), (a2, a1)):
                for k in range(-8, 9):
                    p0 = pout.c2p(*(k * base))
                    dv = pout.c2p(*dirv) - pout.c2p(0, 0)
                    seg = clip(p0, dv, ox0, ox1, oy0, oy1)
                    if seg is not None:
                        g.add(Line(seg[0], seg[1], color=C_Q, stroke_width=1.4, stroke_opacity=0.35))
            return g

        sg = always_redraw(grid)
        b_ = always_redraw(lambda: vec(pout, *S(2, 1), C_U, width=6))
        t_ = always_redraw(lambda: vec(pout, *S(-1, 1), C_Q, width=6))
        g_ = always_redraw(lambda: Dot(pout.c2p(*S(1, 5)), radius=0.1, color=C_W))
        la = M("(2, 1)", 26, C_U).next_to(pout.c2p(2, 1), RIGHT, buff=0.1)
        lt = M("(−1, 1)", 26, C_Q).next_to(pout.c2p(-1, 1), UP, buff=0.1)
        lg = M("(1, 5)", 26, C_W).next_to(pout.c2p(1, 5), RIGHT, buff=0.12)
        d = self.say()                                   # the same row operation moves the output panel
        self.play(FadeOut(bs), run_time=0.5)
        self.play(Create(pout), FadeIn(tout), run_time=min(1.2, d * 0.35))
        self.add(sg)
        self.play(FadeIn(sg), GrowArrow(b_), GrowArrow(t_), FadeIn(g_), FadeIn(VGroup(la, lt, lg)),
                  run_time=min(1.2, d * 0.35))
        disp = VGroup(*[Arrow(pout.c2p(u, 3.5), pout.c2p(u, 3.5 - u / 2), buff=0, color=WHITE, stroke_width=3,
                              tip_length=0.14, max_tip_length_to_length_ratio=0.5) for u in (-1, 2, 4)])
        still = Dot(pout.c2p(0, 3.5), radius=0.06, color=WHITE)
        d = self.say()                                   # slides vertically by minus half its horizontal position
        self.play(LaggedStart(*[GrowArrow(a) for a in disp], FadeIn(still), lag_ratio=0.3), run_time=min(1.6, d))
        d = self.say()                                   # right drop, left rise, axis stays
        self.play(Indicate(VGroup(disp[1], disp[2]), color=WHITE), run_time=d * 0.3)
        self.play(Indicate(disp[0], color=WHITE, scale_factor=1.4), run_time=d * 0.3)
        self.play(Indicate(still, color=WHITE, scale_factor=1.8), run_time=d * 0.3)
        sh = VGroup(P("shear", 24, C_DIM), M("(<i>u</i>, <i>v</i>) ↦ (<i>u</i>, <i>v</i> − ½<i>u</i>)", 30))
        sh.arrange(RIGHT, buff=0.3).move_to([RX, 3.4, 0])
        d = self.say()                                   # called a shear
        self.play(FadeOut(disp), FadeOut(still), FadeOut(VGroup(la, lt, lg)), FadeIn(sh), run_time=min(0.8, d * 0.3))
        self.play(s.animate.set_value(1), run_time=max(1.2, d * 0.65))
        for m_ in (sg, b_, t_, g_):
            m_.clear_updaters()
        la2 = M("(2, 0)", 26, C_U).next_to(pout.c2p(2, 0), DOWN, buff=0.12)
        lt2 = M("(−1, 3/2)", 26, C_Q).next_to(pout.c2p(-1, 1.5), UP, buff=0.1)
        lg2 = M("(1, 9/2)", 26, C_W).next_to(pout.c2p(1, 4.5), LEFT, buff=0.3)
        for lab, obj in ((la2, b_), (lt2, t_), (lg2, g_)):
            for m_ in (lab,):
                m_.add_background_rectangle(color=BG, opacity=0.85, buff=0.04)
            d = self.say()
            self.play(FadeIn(lab), Indicate(obj, color=obj.get_color()), run_time=min(1.0, d))
        self.pause(0.6)

        q = VGroup(M("2", 30), M("(2, 0)", 30, C_U), M("+ 3", 30), M("(−1, 3/2)", 30, C_Q), M("=", 30),
                   M("?", 30)).arrange(RIGHT, buff=0.12).move_to([RX, 3.35, 0])
        d = self.say()                                   # all moved
        self.play(FadeOut(sh), Indicate(VGroup(b_, t_, g_), color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
        d = self.say()                                   # still the recipe?
        self.play(FadeIn(q), run_time=min(1.0, d))
        self.pause(3.0)                                  # ⏸ path and = (1, 9/2) hidden

        pts = [(0, 0), (2, 0), (4, 0), (3, 1.5), (2, 3), (1, 4.5)]
        steps = VGroup(*[vec_between(pout, pts[k], pts[k + 1], C_U if k < 2 else C_Q, width=5) for k in range(5)])
        across, up = M("(4 − 3,", 30), M("0 + 9/2)", 30)
        calc = VGroup(M("=", 30), across, up).arrange(RIGHT, buff=0.14).next_to(q, DOWN, buff=0.25).align_to(q, LEFT)
        hx = Line(pout.c2p(0, 0), pout.c2p(1, 0), color=WHITE, stroke_width=6)
        hy = Line(pout.c2p(1, 0), pout.c2p(1, 4.5), color=WHITE, stroke_width=6)
        d = self.say()                                   # across: one
        self.play(b_.animate.set_opacity(0.25), t_.animate.set_opacity(0.25), FadeOut(VGroup(la2, lt2)),
                  run_time=0.4)
        self.play(LaggedStart(*[GrowArrow(a) for a in steps], lag_ratio=0.6), run_time=min(2.0, d * 0.5))
        self.play(FadeIn(calc[:2]), Create(hx), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # up: nine halves
        self.play(FadeIn(calc[2]), Create(hy), run_time=min(1.0, d * 0.6))
        ans = M("(1, 9/2)", 30, C_W).move_to(q[-1]).align_to(q[-1], LEFT)
        rg2 = Circle(radius=0.22, color=C_W, stroke_width=4).move_to(g_)
        d = self.say()                                   # still lands on the target
        self.play(ReplacementTransform(q[-1], ans), Create(rg2), FadeOut(hx), FadeOut(hy), run_time=min(1.0, d))
        d = self.say()                                   # the shear carries the recipe along
        self.play(Indicate(steps, color=WHITE, scale_factor=1.03), run_time=min(1.4, d))
        d = self.say()                                   # blue lies flat
        self.play(b_.animate.set_opacity(1), run_time=0.4)
        self.play(Indicate(b_, color=C_U, scale_factor=1.15), run_time=min(1.0, d * 0.6))
        d = self.say()                                   # each shear flattens one more column
        self.play(Indicate(E[1][0], color=WHITE, scale_factor=1.5), run_time=min(1.2, d * 0.4))
        self.pause(1.5)                                  # ⏸ read the finished calculation
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def three_by_three(self):
        cols = (C_L1, C_L2, C_R3)
        A = aug([["2", "1", "1", "3"], ["4", "1", "0", "6"], ["−2", "2", "1", "1"]], size=34, h_buff=1.0)
        A.move_to([0.9, 2.3, 0])
        E = A.entries
        eqs = VGroup(*[M(t, 32, cols[i]) for i, t in enumerate(
            ["2<i>x</i> + <i>y</i> + <i>z</i> = 3", "4<i>x</i> + <i>y</i> = 6",
             "−2<i>x</i> + 2<i>y</i> + <i>z</i> = 1"])])
        for i, e in enumerate(eqs):
            e.move_to([0, row_y(A, i), 0]).align_to([-2.4, 0, 0], RIGHT)
        rl = VGroup(*[M(f"R<sub>{i + 1}</sub>", 28, cols[i]).move_to([A.get_left()[0] - 0.4, row_y(A, i), 0])
                      for i in range(3)])
        LX = -6.3

        def line(markup, y, size=28):
            return M(markup, size).move_to([0, y, 0]).align_to([LX, 0, 0], LEFT)

        d = self.say()                                   # same moves, bigger systems
        self.play(FadeIn(eqs), run_time=min(1.2, d))
        d = self.say()                                   # three equations, three unknowns
        self.play(FadeIn(VGroup(A[0], A[2], A.bar, rl)),
                  *[TransformFromCopy(eqs[i], VGroup(*E[i])) for i in range(3)], run_time=min(1.6, d))
        lr = Arrow([col_x(A, 0) - 0.2, 3.62, 0], [col_x(A, 2) + 0.2, 3.62, 0], buff=0, color=C_DIM,
                   stroke_width=3, tip_length=0.15)
        ge = P("Gaussian elimination", 24, C_DIM).next_to(lr, RIGHT, buff=0.25)
        d = self.say()                                   # left to right
        self.play(FadeIn(ge), GrowArrow(lr), run_time=min(1.4, d))
        d = self.say()                                   # pick a pivot, clear underneath
        self.play(Indicate(VGroup(E[1][0], E[2][0]), color=WHITE), run_time=min(1.2, d))
        self.pause(0.5)

        d = self.say()                                   # column one
        self.play(FadeOut(VGroup(lr, ge)), eqs.animate.set_opacity(0.4), run_time=min(0.8, d))
        r1 = ring(E[0][0])
        d = self.say()                                   # pivot is two
        self.play(Create(r1), run_time=min(0.8, d))
        h = hl(E[1][0], E[2][0])
        d = self.say()                                   # four and minus two
        self.play(FadeIn(h), run_time=min(0.8, d))
        self.say()                                       # the two multipliers?
        self.pause(3.0)                                  # ⏸ multipliers hidden

        MX = A.get_right()[0] + 0.35
        m21 = M("ℓ<sub>21</sub> = 4/2 = 2", 28).move_to([0, row_y(A, 1), 0]).align_to([MX, 0, 0], LEFT)
        m31 = M("ℓ<sub>31</sub> = −2/2 = −1", 28).move_to([0, row_y(A, 2), 0]).align_to([MX, 0, 0], LEFT)
        L1 = line("R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub>:   (4 − 4, 1 − 2, 0 − 2 | 6 − 6) = "
                  "(0, −1, −2 | 0)", -0.55)
        L2 = line("R<sub>3</sub> ← R<sub>3</sub> + R<sub>1</sub>:   (−2 + 2, 2 + 1, 1 + 1 | 1 + 3) = "
                  "(0, 3, 2 | 4)", -1.2)
        d = self.say()                                   # four over two is two
        self.play(FadeIn(m21), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(L1), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # minus two over two is minus one
        self.play(FadeIn(m31), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(L2), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # column one empties
        self.play(FadeOut(h), put(A, 1, 0, "0"), put(A, 2, 0, "0"), run_time=min(1.2, d))
        d = self.say()                                   # the rest of each new row
        self.play(put(A, 1, 1, "−1"), put(A, 1, 2, "−2"), put(A, 1, 3, "0"),
                  put(A, 2, 1, "3"), put(A, 2, 2, "2"), put(A, 2, 3, "4"), run_time=min(1.4, d))
        self.pause(1.5)                                  # ⏸ read the two new rows

        r2, h2 = ring(E[1][1]), hl(E[2][1])
        m32 = M("ℓ<sub>32</sub> = 3/(−1) = −3", 28).move_to(m31).align_to(m31, LEFT)
        L3 = line("R<sub>3</sub> ← R<sub>3</sub> + 3R<sub>2</sub>:   (0, 3 − 3, 2 − 6 | 4 + 0) = (0, 0, −4 | 4)",
                  -1.85)
        d = self.say()                                   # column two
        self.play(FadeOut(VGroup(m21, m31)), Create(r2), FadeIn(h2), run_time=min(1.0, d))
        d = self.say()                                   # multiplier minus three
        self.play(FadeIn(m32), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(L3), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # adding three copies clears it
        self.play(FadeOut(h2), put(A, 2, 1, "0"), put(A, 2, 2, "−4"), put(A, 2, 3, "4"), run_time=min(1.2, d))

        r3 = ring(E[2][2])
        zeros = hl(E[1][0], E[2][0], E[2][1])
        ut = P("upper triangular", 24, C_DIM).move_to([col_x(A, 1), 3.65, 0])
        d = self.say()                                   # below the diagonal zero, pivots on diagonal
        self.play(FadeOut(m32), FadeIn(zeros), run_time=min(1.0, d * 0.4))
        self.play(Create(r3), Indicate(VGroup(r1, r2), color=WHITE), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # upper triangular
        self.play(FadeOut(zeros), FadeIn(ut), run_time=min(1.0, d))
        self.pause(1.5)                                  # ⏸ read the triangular system

        bt = P("back substitution", 24, C_DIM).move_to([0, -0.3, 0]).align_to([LX, 0, 0], LEFT)
        B1 = line("−4<i>z</i> = 4  ⇒  <i>z</i> = −1", -0.95)
        B2 = line("−<i>y</i> − 2<i>z</i> = 0  ⇒  −<i>y</i> + 2 = 0  ⇒  <i>y</i> = 2", -1.6)
        B3 = line("2<i>x</i> + <i>y</i> + <i>z</i> = 3  ⇒  2<i>x</i> + 2 − 1 = 3  ⇒  <i>x</i> = 1", -2.25)
        ck = VGroup(P("check", 24, C_DIM), M("2 + 2 − 1 = 3", 28, C_L1), M("4 + 2 = 6", 28, C_L2),
                    M("−2 + 4 − 1 = 1", 28, C_R3)).arrange(RIGHT, buff=0.55)
        ck.move_to([0, -3.15, 0]).align_to([LX, 0, 0], LEFT)
        d = self.say()                                   # back substitution starts at the bottom
        self.play(FadeOut(VGroup(L1, L2, L3, ut)), run_time=0.5)
        self.play(FadeIn(bt), Indicate(VGroup(*E[2]), color=WHITE, scale_factor=1.05), run_time=min(1.0, d * 0.6))
        for B, i in ((B1, 2), (B2, 1), (B3, 0)):
            d = self.say()
            self.play(FadeIn(B), Indicate(VGroup(*E[i]), color=WHITE, scale_factor=1.05), run_time=min(1.4, d))
        d = self.say()                                   # the check
        self.play(eqs.animate.set_opacity(1), FadeIn(ck), run_time=min(1.0, d * 0.5))
        self.play(Indicate(eqs, color=WHITE, scale_factor=1.04), run_time=min(1.0, d * 0.4))
        self.pause(2.0)                                  # ⏸ read the solution and the check

        # ---- two pictures in R^3
        U = aug([["2", "1", "1", "3"], ["0", "−1", "−2", "0"], ["0", "0", "−4", "4"]], size=24, h_buff=0.7,
                v_buff=0.44).move_to([0.0, -3.25, 0])
        Ur = VGroup(*[ring(U.entries[k][k], pad=0.1, width=2.5) for k in range(3)])
        bi = Box3((-6.1, -1.5), 0.9)
        tin = P("input: the amounts (<i>x</i>, <i>y</i>, <i>z</i>)", 22, C_DIM).move_to([-3.6, 2.0, 0])
        bo = Box3((1.3, -2.0), 0.55)
        tout = P("output: where the amounts land", 22, C_DIM).move_to([3.6, 2.0, 0])
        ax_i = bi.axes((0, 3), (0, 3.6), (-1.7, 1.7), names=["<i>x</i>", "<i>y</i>", "<i>z</i>"])
        fl_i = bi.floor((0, 3), (0, 3))
        P0 = (1, 2, -1)
        planes = VGroup()
        for nrm, c in (((2, 1, 1), C_L1), ((4, 1, 0), C_L2), ((-2, 2, 1), C_R3)):
            u, v = plane_basis(nrm)
            planes.add(bi.patch(P0, u, v, 1.25, c, 0.2))
        pdot = Dot(bi.p(*P0), radius=0.09, color=WHITE).set_z_index(3)
        plab = M("(1, 2, −1)", 24).next_to(pdot, LEFT, buff=0.2).shift(DOWN * 0.15).set_z_index(3)
        plab.add_background_rectangle(color=BG, opacity=0.85, buff=0.04)
        ax_o = bo.axes((0, 4.6), (0, 6.6), (-2.2, 2.6))
        fl_o = bo.floor((0, 4), (0, 6))
        cv = [((2, 4, -2), C_U), ((1, 1, 2), C_Q), ((1, 0, 1), C_C3)]
        carr = VGroup(*[bo.arrow((0, 0, 0), v, c, 5) for v, c in cv])
        tgt = Dot(bo.p(3, 6, 1), radius=0.1, color=C_W).set_z_index(3)
        tlab = M("(3, 6, 1)", 24, C_W).next_to(tgt, DR, buff=0.1)
        pts = [(0, 0, 0), (2, 4, -2), (3, 5, 0), (4, 6, 2), (3, 6, 1)]
        pcol = [C_U, C_Q, C_Q, C_C3]
        path = VGroup(*[bo.arrow(pts[k], pts[k + 1], pcol[k], 4) for k in range(4)])
        req = VGroup(M("1", 28), M("(2, 4, −2)", 28, C_U), M("+ 2", 28), M("(1, 1, 2)", 28, C_Q), M("− 1", 28),
                     M("(1, 0, 1)", 28, C_C3), M("=", 28), M("(3, 6, 1)", 28, C_W)).arrange(RIGHT, buff=0.12)
        req.move_to([2.7, 3.3, 0])
        d = self.say()                                   # row picture: three planes, one point
        self.play(FadeOut(VGroup(eqs, rl, bt, B1, B2, B3, ck, r1, r2, r3)), FadeOut(allm(A)), FadeIn(U),
                  run_time=min(1.0, d * 0.25))
        self.play(FadeIn(VGroup(tin, ax_i, fl_i)), run_time=min(0.8, d * 0.2))
        self.play(LaggedStart(*[FadeIn(p_) for p_ in planes], lag_ratio=0.5), run_time=min(1.6, d * 0.3))
        self.play(FadeIn(pdot, scale=0.5), FadeIn(plab), run_time=min(0.8, d * 0.15))
        d = self.say()                                   # column picture: a recipe landing on (3, 6, 1)
        self.play(FadeIn(VGroup(tout, ax_o, fl_o)), LaggedStart(*[GrowArrow(a) for a in carr], lag_ratio=0.3),
                  FadeIn(tgt), FadeIn(tlab), run_time=min(1.4, d * 0.3))
        self.play(FadeIn(req), carr.animate.set_opacity(0.3), run_time=min(0.8, d * 0.2))
        self.play(LaggedStart(*[GrowArrow(a) for a in path], lag_ratio=0.7), run_time=min(2.2, d * 0.4))
        d = self.say()                                   # three pivots nonzero
        self.play(Create(Ur), run_time=min(1.0, d))
        d = self.say()                                   # the reason for exactly one solution
        self.play(Indicate(pdot, color=WHITE, scale_factor=1.8), Indicate(Ur, color=WHITE), run_time=min(1.4, d * 0.4))
        self.pause(1.0)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def why_safe(self):
        def sysbox(title, lines, x):
            eqs = VGroup(*[M(t, 28) for t in lines]).arrange(DOWN, buff=0.22, aligned_edge=RIGHT)
            eqs.move_to([x, 2.15, 0])
            r = SurroundingRectangle(eqs, color=C_DIM, buff=0.25, corner_radius=0.12, stroke_width=2)
            t = P(title, 22, C_DIM).next_to(r, UP, buff=0.12)
            return VGroup(r, eqs, t)

        old = sysbox("old system", ["2<i>x</i> + <i>y</i> + <i>z</i> = 3", "4<i>x</i> + <i>y</i> = 6",
                                    "−2<i>x</i> + 2<i>y</i> + <i>z</i> = 1"], -4.0)
        new = sysbox("new system", ["2<i>x</i> + <i>y</i> + <i>z</i> = 3", "−<i>y</i> − 2<i>z</i> = 0",
                                    "−2<i>x</i> + 2<i>y</i> + <i>z</i> = 1"], 4.0)
        fwd = Arrow([old[0].get_right()[0], 2.55, 0], [new[0].get_left()[0], 2.55, 0], buff=0.1, color=WHITE,
                    stroke_width=3, tip_length=0.18)
        fwd_l = M("R<sub>2</sub> ← R<sub>2</sub> − 2R<sub>1</sub>", 26).next_to(fwd, UP, buff=0.08)
        bwd = Arrow([new[0].get_left()[0], 1.75, 0], [old[0].get_right()[0], 1.75, 0], buff=0.1, color=WHITE,
                    stroke_width=3, tip_length=0.18)
        bwd_l = M("R<sub>2</sub> ← R<sub>2</sub> + 2R<sub>1</sub>", 26).next_to(bwd, DOWN, buff=0.08)
        so = M("solutions of old", 24, C_DIM).move_to([-4.0, 0.25, 0])
        sn = M("solutions of new", 24, C_DIM).move_to([4.0, 0.25, 0])
        a1 = DashedLine([-2.2, 0.45, 0], [2.2, 0.45, 0], color=C_DIM, stroke_width=3, dash_length=0.12)
        a1.add_tip(tip_length=0.16, tip_width=0.16)
        a1l = M("old ⊆ new", 24, C_DIM).next_to(a1, UP, buff=0.06)
        a2 = DashedLine([2.2, 0.05, 0], [-2.2, 0.05, 0], color=C_DIM, stroke_width=3, dash_length=0.12)
        a2.add_tip(tip_length=0.16, tip_width=0.16)
        a2l = M("new ⊆ old", 24, C_DIM).next_to(a2, DOWN, buff=0.06)

        def solid(dl, lab, y0, y1):
            a = Arrow([y0, dl.get_center()[1], 0], [y1, dl.get_center()[1], 0], buff=0, color=WHITE,
                      stroke_width=3, tip_length=0.18)
            return a, lab.copy().set_color(WHITE)

        d = self.say()                                   # each row operation changed the equations
        self.play(FadeIn(old), run_time=min(0.8, d * 0.4))
        self.play(GrowArrow(fwd), FadeIn(fwd_l), FadeIn(new), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # did it change the solutions?
        self.play(FadeIn(so), FadeIn(sn), run_time=min(1.0, d))
        d = self.say()                                   # two things to check
        self.wait(max(0.1, d - 0.1))
        d = self.say()                                   # old solutions solve the new
        self.play(Create(a1), FadeIn(a1l), run_time=min(1.0, d))
        d = self.say()                                   # new solutions solved the old
        self.play(Create(a2), FadeIn(a2l), run_time=min(1.0, d))
        self.pause(0.5)

        d = self.say()                                   # combinations
        self.play(Indicate(VGroup(a1, a1l), color=WHITE), run_time=min(1.0, d))
        d = self.say()                                   # each new equation is a combination of old ones
        self.play(Indicate(new[1][1], color=WHITE), Indicate(fwd_l, color=WHITE), run_time=min(1.2, d))
        d = self.say()                                   # swap, scale, replace forms R i minus ell R j
        self.play(Indicate(fwd_l, color=WHITE, scale_factor=1.15), run_time=min(1.2, d))
        pt = M("(1, 2, −1)", 26).next_to(so, DOWN, buff=0.15)
        A1, A1l = solid(a1, a1l, -2.2, 2.2)
        d = self.say()                                   # satisfies any combination
        self.play(FadeIn(pt), run_time=min(0.6, d * 0.25))
        self.play(pt.animate.next_to(sn, DOWN, buff=0.15), run_time=min(1.2, d * 0.35))
        self.play(ReplacementTransform(a1, A1), ReplacementTransform(a1l, A1l), run_time=min(0.8, d * 0.3))

        thm = VGroup(
            P("<b>Theorem 4.</b>  A row operation does not change the solution set.", 24),
            M("swap<sup>−1</sup> = the same swap", 28),
            VGroup(M("(R<sub>i</sub> ← <i>c</i>R<sub>i</sub>)<sup>−1</sup> = (R<sub>i</sub> ← (1/<i>c</i>)R<sub>i</sub>),", 28),
                   M("needs <i>c</i> ≠ 0", 28)).arrange(RIGHT, buff=0.3),
            VGroup(M("(R<sub>i</sub> ← R<sub>i</sub> − ℓR<sub>j</sub>)<sup>−1</sup> = (R<sub>i</sub> ← R<sub>i</sub> + ℓR<sub>j</sub>),", 28),
                   M("needs <i>j</i> ≠ <i>i</i>", 28)).arrange(RIGHT, buff=0.3),
            P("Then any sequence of row operations preserves the solution set, one step at a time.", 24))
        thm.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([0, -2.25, 0])
        d = self.say()                                   # undoing
        self.play(FadeOut(pt), GrowArrow(bwd), FadeIn(bwd_l), run_time=min(1.2, d))
        d = self.say()                                   # reversed by one of the same kind
        self.play(Indicate(VGroup(fwd_l, bwd_l), color=WHITE), run_time=min(1.2, d))
        d = self.say()                                   # swap undone by the same swap
        self.play(FadeIn(thm[1]), run_time=min(1.0, d))
        d = self.say()                                   # divide by c; c cannot be zero
        self.play(FadeIn(thm[2][0]), run_time=min(1.0, d * 0.45))
        self.play(FadeIn(thm[2][1]), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # add them back; j different from i
        self.play(FadeIn(thm[3][0]), Indicate(bwd_l, color=WHITE), run_time=min(1.2, d * 0.5))
        self.play(FadeIn(thm[3][1]), run_time=min(0.8, d * 0.3))
        A2, A2l = solid(a2, a2l, 2.2, -2.2)
        d = self.say()                                   # the reverse takes new back to old
        self.play(Indicate(VGroup(bwd, bwd_l), color=WHITE), run_time=min(1.0, d * 0.3))
        self.play(ReplacementTransform(a2, A2), ReplacementTransform(a2l, A2l), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(thm[0]), run_time=min(0.8, d * 0.25))
        self.pause(2.0)                                  # ⏸ where c ≠ 0 and j ≠ i were used

        d = self.say()                                   # one step at a time
        self.play(FadeIn(thm[4]), run_time=min(1.0, d))
        d = self.say()                                   # trustworthy
        self.play(Indicate(thm[0], color=WHITE, scale_factor=1.04), run_time=min(1.0, d))
        self.pause(0.6)

        # ---- a tiny pivot
        T_ = aug([["0.0001", "1", "1"], ["1", "1", "2"]], size=38, h_buff=1.5).move_to([-2.2, 0.6, 0])
        tr = ring(T_.entries[0][0], pad=0.1)
        tp = P("pivot", 22).next_to(tr, UP, buff=0.05)
        big = M("ℓ = 1 ÷ 0.0001 = 10 000", 36, RED).next_to(T_, RIGHT, buff=0.8).align_to(T_, DOWN)
        d = self.say()                                   # any nonzero entry can be a pivot
        self.play(FadeOut(VGroup(old, new, fwd, fwd_l, bwd, bwd_l, so, sn, A1, A1l, A2, A2l, thm)), run_time=0.6)
        self.play(FadeIn(T_), run_time=min(0.8, d * 0.4))
        self.play(Create(tr), FadeIn(tp), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # tiny pivot, huge multiplier
        self.play(TransformFromCopy(VGroup(T_.entries[1][0], T_.entries[0][0]), big), run_time=min(1.4, d * 0.5))
        d = self.say()                                   # at the end
        self.play(Indicate(big, color=RED, scale_factor=1.08), run_time=min(1.0, d * 0.4))
