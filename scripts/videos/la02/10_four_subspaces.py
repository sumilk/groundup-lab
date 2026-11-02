"""Four subspaces from one elimination. Script: docs/LA02_VIDEO_SCRIPT.md, section of the same name."""
from sample import *  # noqa: F401,F403
import importlib

_r = importlib.import_module("08_rank")
Obl, a_panel, bglab, C_COLW, A_COLS = _r.Obl, _r.a_panel, _r.bglab, _r.C_COLW, _r.A_COLS

C_ROW = C_X          # row space (orange)
C_NULL = C_P         # null space (purple)
C_ROSE = "#F06292"   # left null space (output side only; never with the pink x + y line)
WASH = [C_U, C_Q]    # column space: blue-teal wash
BG = config.background_color

A_ROWS = [["1", "2", "1", "3"], ["2", "4", "4", "10"], ["1", "2", "−1", "−1"]]


def tup(v):
    return "(" + ", ".join(str(x).replace("-", "−") for x in v) + ")"


def name_lab(prose, math, color, size=22, msize=24):
    """A subspace name: prose in sans, symbol in serif, one colour (a list = gradient)."""
    a, b = P(prose, size), M(math, msize)
    g = VGroup(a, b).arrange(RIGHT, buff=0.12, aligned_edge=DOWN)
    b.shift(DOWN * 0.03)
    if isinstance(color, list):
        g.set_color_by_gradient(*color)
    else:
        g.set_color(color)
    return g


def sbox(center, w, h, title):
    """A box for a space that cannot be drawn (as in 08_rank.box4)."""
    r = RoundedRectangle(width=w, height=h, corner_radius=0.18, stroke_color="#5B6475", stroke_width=2)
    r.move_to(center)
    t = P(title, 22, C_DIM).next_to(r, UP, buff=0.12)
    return r, t


def gmat(rows, size=28, pitch=0.8, vb=0.55, bar=None, color=WHITE, bar_gap=0.3):
    """A bracketed matrix on a fixed grid (entries can be swapped in place); optional bar before column `bar`."""
    nr, nc = len(rows), len(rows[0])
    ents, cells = VGroup(), []
    for i in range(nr):
        row = []
        for j in range(nc):
            x = j * pitch + (bar_gap if bar is not None and j >= bar else 0)
            m = M(rows[i][j], size, color).move_to(np.array([x, -i * vb, 0]))
            row.append(m)
            ents.add(m)
        cells.append(row)
    w = (nc - 1) * pitch + (bar_gap if bar is not None else 0)
    h = (nr - 1) * vb + 0.55
    cx, cy = w / 2, -(nr - 1) * vb / 2
    lb = VGroup(Line(UP * h / 2, DOWN * h / 2), Line(UP * h / 2, UP * h / 2 + RIGHT * 0.12),
                Line(DOWN * h / 2, DOWN * h / 2 + RIGHT * 0.12)).set_stroke(color, 2)
    rb = lb.copy().flip(UP)
    lb.move_to(np.array([cx - w / 2 - pitch * 0.55, cy, 0]))
    rb.move_to(np.array([cx + w / 2 + pitch * 0.55, cy, 0]))
    g = VGroup(lb, ents, rb)
    if bar is not None:
        bx = (bar - 1) * pitch + (pitch + bar_gap) / 2
        g.add(Line(np.array([bx, cy + h / 2 - 0.05, 0]), np.array([bx, cy - h / 2 + 0.05, 0]),
                   color=C_DIM, stroke_width=2))
    g.cells = cells
    g.size_ = size
    return g


def swap_row(g, i, new, color=WHITE):
    """New mobjects for row i of a gmat, at the same positions."""
    return VGroup(*[M(t, g.size_, color).move_to(g.cells[i][j].get_center()) for j, t in enumerate(new)])


def colv(v, color, size=24, vb=0.38):
    return column_vec([str(x).replace("-", "−") for x in v], size=size, color=color, v_buff=vb)


def ddir(a):
    return np.array([np.cos(a * DEGREES), np.sin(a * DEGREES), 0])


def diamond(O, up, s, color, fill=0.22):
    a, b = (ddir(45), ddir(135)) if up else (ddir(-45), ddir(-135))
    poly = Polygon(O, O + s * a, O + s * (a + b), O + s * b, stroke_width=2.5)
    if isinstance(color, list):
        poly.set_stroke(color=color).set_fill(color=color, opacity=fill)
    else:
        poly.set_stroke(color).set_fill(color, opacity=fill)
    return poly


def right_mark(O, d1, d2, size=0.2, color=WHITE):
    return VMobject(stroke_color=color, stroke_width=2).set_points_as_corners(
        [O + size * d1, O + size * (d1 + d2), O + size * d2])


def two_by_two(scene_unit=0.55):
    """The two-panel picture for a 2 x 2 matrix: unit square on the left, its image on the right."""
    xr, yr = (-2, 4), (-2, 6)
    pin = plane(xr, yr, unit=scene_unit).move_to(np.array([-3.6, 0.15, 0]))
    pout = plane(xr, yr, unit=scene_unit).move_to(np.array([3.6, 0.15, 0]))
    tin = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).next_to(pin, UP, buff=0.12)
    tout = P("output: where the amounts land", 22, C_DIM).next_to(pout, UP, buff=0.12)
    arr = Arrow(pin.get_right() + RIGHT * 0.15 + UP * 0.9, pout.get_left() + LEFT * 0.15 + UP * 0.9, buff=0,
                color=WHITE, stroke_width=4, tip_length=0.22)
    alab = M("<i>A</i>", 32).next_to(arr, UP, buff=0.1)
    return pin, pout, tin, tout, arr, alab


def para(p, c1, c2):
    """Parallelogram spanned by columns c1, c2 in plane p."""
    return Polygon(p.c2p(0, 0), p.c2p(*c1), p.c2p(c1[0] + c2[0], c1[1] + c2[1]), p.c2p(*c2),
                   stroke_color=WHITE, stroke_width=2.5, fill_color=WHITE, fill_opacity=0.18)


class FourSubspaces(NScene):
    PARAS = [
        # ---- two subspaces on each side
        ["Up to now, each matrix has given you three subspaces.",
         "In the input space, the row space and the null space.",
         "In the output space, the column space.",
         "The output side looks one short.",
         "Is there a natural fourth subspace living there?"],
        ["The null space came from asking which combinations of the columns give zero.",
         "Ask the same question of the rows.",
         "Which combinations of the rows of A give the zero row?"],
        ["Give each row an amount, y one, y two, y three, and ask for the weighted rows to add up to the zero row.",
         "Such a y lives in the output space, because it has one entry per row.",
         "In matrix form, y transpose times A is zero, which is the same as A transpose times y equals zero.",
         "The y multiplies A from the left, so the set of all such y is called the left null space, "
         "N of A transpose."],
        ["Three of the dimensions you already have.",
         "The column space and the row space both have dimension r. The null space has n minus r, by rank–nullity.",
         "For this three by four matrix of rank two, how big is the left null space?"],
        ["A transpose is a four by three matrix, with three columns, and the same rank, two.",
         "Rank–nullity for A transpose says two plus its nullity is three.",
         "The left null space has dimension one.",
         "In general, m minus r."],
        # ---- finding the left null space with a record
        ["Dimension one means a single vector y will span it.",
         "How do you find it?",
         "The zero row in R holds a clue.",
         "Row three became zero because some combination of A's rows cancelled out.",
         "Elimination did that combining, but didn't write down how."],
        ["Make it keep a record.",
         "Write the identity beside A, and run the same five row operations on the full width, still choosing "
         "pivots only from A's block.",
         "The identity starts as \"row one is one copy of row one\", and so on.",
         "Each operation updates that record along with A."],
        ["The left block is R. The right block is a matrix called E. Each row of E lists the amounts of A's rows that make the matching row of R.",
         "E times A equals R. Row three of E is minus three, one, one.",
         "Row three of R is zero.",
         "Minus three copies of row one of A, plus row two, plus row three, should give the zero row.",
         "Check it."],
        ["Column by column, the sums cancel, starting with minus three plus two plus one.",
         "The vector y equals minus three, one, one spans the left null space."],
        ["All four come from one elimination.",
         "In the input space, the row space from R's nonzero rows, and the null space from the free variables.",
         "In the output space, the column space from A's pivot columns, and the left null space from E's last row.",
         "The counts add up on each side.",
         "Two plus two is four, the input dimension.",
         "Two plus one is three, the output dimension."],
        # ---- which targets can be reached?
        ["Earlier, four, ten, two was reachable and four, ten, three wasn't.",
         "The left null space tells you which is which without running elimination again."],
        ["If A x equals b, then for any y in the left null space, y transpose b is y transpose A x. And y transpose A is zero.",
         "Then y transpose b has to be zero.",
         "For this matrix, that's one condition on the target.",
         "Minus three b one, plus b two, plus b three, must be zero."],
        ["Try it on both targets."],
        ["For four, ten, two, minus twelve plus ten plus two is zero.",
         "Reachable.",
         "For four, ten, three, it's one.",
         "And that's the same one that appeared in the bad row earlier.",
         "Reducing the augmented matrix applies E to b too, so the bad row's right-hand entry was y transpose b "
         "all along."],
        ["The converse holds as well.",
         "If y transpose b is zero for every y in the left null space, the system has a solution.",
         "Reducing the augmented matrix gives R, with E b on the right.",
         "The entries of E b beside the zero rows of R are exactly y transpose b, for the rows of E that sit "
         "beside those zero rows.",
         "If they're all zero, the right-hand column gets no pivot, and Theorem eight gives a solution."],
        ["Those rows of E are a basis.",
         "E comes from the identity by row operations, so its m rows span R m, and are therefore independent.",
         "The m minus r rows beside the zero rows of R are independent, they lie in the left null space, and that "
         "space has dimension m minus r.",
         "The right number of independent vectors makes a basis."],
        ["This also closes the promise we made about rank.",
         "If the rank is less than m, the left null space has some nonzero vector y. Use y itself as the target.",
         "Then y transpose b is y transpose y, the sum of the squares of y's entries, which isn't zero.",
         "So that target can't be reached.",
         "Full row rank is exactly what lets every target be reached."],
        # ---- how the pieces fit together
        ["In the diagram, each pair of subspaces in one box meets only at the origin.",
         "Is that true for every matrix?",
         "Can a nonzero input be in the row space and the null space at once?"],
        ["A x equals zero says that every row of A, dotted with x, gives zero.",
         "A null-space vector is at a right angle to every row, and so to every combination of rows.",
         "A vector in both would be at a right angle to itself.",
         "Its dot product with itself, the sum of the squares of its entries, would be zero.",
         "That only happens for the zero vector."],
        ["So the sum of the row space and the null space is direct, in the sense of chapter one.",
         "Its dimension is r plus n minus r, minus zero for the overlap, which is n. A subspace of R n with dimension n is all of R n. The same argument, applied to A transpose, splits the output space."],
        ["Every input splits, in one way only, into a row-space part and a null-space part.",
         "A sends the null-space part to zero, so the row space alone reaches the whole column space.",
         "And two row-space vectors can't land in the same place, because their difference would lie in both "
         "subspaces, so it would be zero.",
         "A carries the row space onto the column space without collapsing anything."],
        ["On the output side, b can be reached exactly when it has no component along the left null space.",
         "It is the right-angle picture of the test you just did."],
        ["One thing to keep straight.",
         "Rank, nullity, existence and uniqueness need no angles at all.",
         "Only the right angles in this diagram do, and they come from the dot product, which Module three "
         "develops."],
        # ---- the two by two case
        ["In two dimensions you can see collapse directly.",
         "The cast A turns the unit square into a parallelogram of area three, and nothing is flattened.",
         "Its column space is all of R two, its null space just zero.",
         "The singular matrix one, two, two, four flattens the square onto a line, its column space, and its null "
         "space is the line through two, minus one.",
         "The area, up to sign, is called the determinant, and zero area is exactly a loss of rank.",
         "Chapter five develops determinants.",
         "Here the area is only a picture of collapse."],
    ]

    # ================================================================================================
    def construct(self):
        self.two_on_each_side()
        self.record()
        self.diagram()
        self.reachable()
        self.fit_together()
        self.two_by_two_case()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def two_on_each_side(self):
        LB, RB = np.array([-3.7, 1.75, 0]), np.array([3.7, 1.75, 0])
        lrect, ltit = sbox(LB, 6.1, 2.9, "input: the amounts (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, "
                                          "<i>x</i><sub>3</sub>, <i>x</i><sub>4</sub>)")
        rrect, rtit = sbox(RB, 6.1, 2.9, "output: where the amounts land")
        lsp = M("ℝ<sup>4</sup>", 26, C_DIM).next_to(lrect.get_corner(DL), UR, buff=0.12)
        rsp = M("ℝ<sup>3</sup>", 26, C_DIM).next_to(rrect.get_corner(DR), UL, buff=0.12)
        amap = Arrow(np.array([-0.6, 1.75, 0]), np.array([0.6, 1.75, 0]), buff=0, color=WHITE, stroke_width=4,
                     tip_length=0.2)
        amap_l = M("<i>A</i>", 30).next_to(amap, UP, buff=0.08)
        A = gmat(A_ROWS, size=28, pitch=0.8, vb=0.5)
        A_name = M("<i>A</i> =", 30)
        A_grp = VGroup(A_name, A).arrange(RIGHT, buff=0.25).move_to(np.array([0, -1.2, 0]))

        def slot(x, lab, vecs, color):
            l = lab.move_to(np.array([x, 2.82, 0]))
            vs = VGroup(*[colv(v, color) for v in vecs]).arrange(RIGHT, buff=0.35).move_to(np.array([x, 1.45, 0]))
            return VGroup(l, vs)

        s_row = slot(-5.15, name_lab("row space", "<i>C</i>(<i>A</i>ᵀ)", C_ROW), [(1, 2, 0, 1), (0, 0, 1, 2)], C_ROW)
        s_null = slot(-2.2, name_lab("null space", "<i>N</i>(<i>A</i>)", C_NULL),
                      [(-2, 1, 0, 0), (-1, 0, -2, 1)], C_NULL)
        s_col = VGroup(name_lab("column space", "<i>C</i>(<i>A</i>)", WASH).move_to(np.array([2.05, 2.82, 0])),
                       VGroup(colv((1, 2, 1), C_U), colv((1, 4, -1), C_Q)).arrange(RIGHT, buff=0.35)
                       .move_to(np.array([2.05, 1.45, 0])))
        empty = DashedVMobject(RoundedRectangle(width=2.8, height=2.0, corner_radius=0.12, stroke_color=C_DIM,
                                                stroke_width=2), num_dashes=40).move_to(np.array([5.3, 1.4, 0]))
        qm = M("?", 40, C_DIM).move_to(empty)

        d = self.say()                                   # three subspaces so far
        self.play(Create(lrect), Create(rrect), FadeIn(VGroup(ltit, rtit, lsp, rsp)), GrowArrow(amap),
                  FadeIn(amap_l), FadeIn(A_grp), run_time=min(2.0, d * 0.6))
        d = self.say()                                   # input: row space, null space
        self.play(FadeIn(s_row), run_time=d * 0.4)
        self.play(FadeIn(s_null), run_time=d * 0.4)
        d = self.say()                                   # output: column space
        self.play(FadeIn(s_col), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # one short
        self.play(Create(empty), FadeIn(qm), run_time=min(1.2, d * 0.6))
        self.say()                                       # a natural fourth?
        self.pause(0.6)

        # ---- the rows, weighted
        d = self.say()                                   # null space: combinations of the columns give zero
        self.play(Indicate(s_null, color=C_NULL, scale_factor=1.05), run_time=min(1.4, d * 0.4))
        cboxes = VGroup(*[SurroundingRectangle(VGroup(*[A.cells[i][j] for i in range(3)]), color=C_NULL,
                                               buff=0.08, stroke_width=2) for j in range(4)])
        self.play(LaggedStart(*[Create(b) for b in cboxes], lag_ratio=0.3), run_time=min(1.6, d * 0.45))
        d = self.say()                                   # same question of the rows
        rboxes = VGroup(*[SurroundingRectangle(VGroup(*A.cells[i]), color=C_ROSE, buff=0.07, stroke_width=2)
                          for i in range(3)])
        self.play(ReplacementTransform(cboxes, rboxes), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # which combinations of rows give the zero row?
        self.play(A_grp.animate.shift(RIGHT * 0.5), FadeOut(rboxes), run_time=min(1.0, d * 0.4))
        self.pause(0.4)

        ys = VGroup(*[M(f"<i>y</i><sub>{i + 1}</sub> ×", 28, C_ROSE).next_to(A.cells[i][0], LEFT, buff=0.75)
                      for i in range(3)])
        rule = Line(A.get_corner(DL) + DOWN * 0.12 + LEFT * 0.0, A.get_corner(DR) + DOWN * 0.12, color=C_DIM,
                    stroke_width=2)
        zeros = VGroup(*[M("0", 28).move_to(np.array([A.cells[2][j].get_x(), rule.get_y() - 0.35, 0]))
                         for j in range(4)])
        zlab = P("added up", 22, C_DIM).next_to(zeros, LEFT, buff=0.45).align_to(ys, RIGHT)
        d = self.say()                                   # give each row an amount
        self.play(FadeOut(A_name), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(y, shift=RIGHT * 0.1) for y in ys], lag_ratio=0.4), run_time=d * 0.4)
        self.play(Create(rule), FadeIn(zlab), LaggedStart(*[FadeIn(z) for z in zeros], lag_ratio=0.2),
                  run_time=min(1.6, d * 0.35))
        ycol = column_vec(["<i>y</i><sub>1</sub>", "<i>y</i><sub>2</sub>", "<i>y</i><sub>3</sub>"], size=26,
                          color=C_ROSE, v_buff=0.45).move_to(empty)
        d = self.say()                                   # y lives in the output space
        self.play(FadeOut(qm), TransformFromCopy(VGroup(*[y[0] for y in ys]), ycol), run_time=min(1.6, d * 0.5))
        eqT = M("<b>y</b>ᵀ<i>A</i> = <b>0</b>ᵀ   ⇔   <i>A</i>ᵀ<b>y</b> = <b>0</b>", 28).move_to(np.array([0, -3.35, 0]))
        d = self.say()                                   # y^T A = 0, A^T y = 0
        self.play(FadeIn(eqT[:7]), run_time=d * 0.35)
        self.play(FadeIn(eqT[7:]), run_time=d * 0.35)
        defn = M("<i>N</i>(<i>A</i>ᵀ) = { <b>y</b> ∈ ℝ<sup><i>m</i></sup> : <i>A</i>ᵀ<b>y</b> = <b>0</b> }"
                 " = { <b>y</b> : <b>y</b>ᵀ<i>A</i> = <b>0</b>ᵀ }", 28, C_ROSE).move_to(eqT)
        full = RoundedRectangle(width=2.8, height=2.0, corner_radius=0.12, stroke_color=C_ROSE, stroke_width=2) \
            .move_to(empty)
        s_lnull_lab = name_lab("left null space", "<i>N</i>(<i>A</i>ᵀ)", C_ROSE).move_to(np.array([5.3, 2.82, 0]))
        d = self.say()                                   # TERM left null space
        self.wait(max(0, d - 2.2))
        self.play(ReplacementTransform(empty, full), FadeIn(s_lnull_lab), ReplacementTransform(eqT, defn),
                  run_time=1.6)
        self.pause(0.6)

        # ---- the table
        hy, ry = -0.35, [-0.95, -1.55, -2.15, -2.75]
        cx = [-4.9, -0.9, 2.1, 3.9]
        heads = VGroup(*[P(h, 22, C_DIM).move_to(np.array([cx[k], hy, 0]))
                         for k, h in enumerate(["Subspace", "Definition", "Lives in", "Dimension"])])
        names = [name_lab("column space", "<i>C</i>(<i>A</i>)", WASH),
                 name_lab("null space", "<i>N</i>(<i>A</i>)", C_NULL),
                 name_lab("row space", "<i>C</i>(<i>A</i>ᵀ)", C_ROW),
                 name_lab("left null space", "<i>N</i>(<i>A</i>ᵀ)", C_ROSE)]
        defs = ["all <i>A</i><b>x</b>; span of the columns", "all <b>x</b> with <i>A</i><b>x</b> = <b>0</b>",
                "span of the rows", "all <b>y</b> with <i>A</i>ᵀ<b>y</b> = <b>0</b>"]
        lives = ["ℝ<sup><i>m</i></sup>", "ℝ<sup><i>n</i></sup>", "ℝ<sup><i>n</i></sup>", "ℝ<sup><i>m</i></sup>"]
        rows = VGroup()
        for i in range(4):
            rows.add(VGroup(names[i].move_to(np.array([cx[0], ry[i], 0])),
                            M(defs[i], 26).move_to(np.array([cx[1], ry[i], 0])),
                            M(lives[i], 26).move_to(np.array([cx[2], ry[i], 0]))))
        hrule = Line(np.array([-6.7, hy - 0.3, 0]), np.array([4.9, hy - 0.3, 0]), color=C_DIM, stroke_width=1.5)
        dims = [M(t, 26).move_to(np.array([cx[3], ry[i], 0])) for i, t in
                enumerate(["<i>r</i>", "<i>n</i> − <i>r</i>", "<i>r</i>", "?"])]
        d = self.say()                                   # three of the dimensions you have
        self.play(FadeOut(VGroup(ys, rule, zeros, zlab, A, defn)), run_time=0.6)
        self.play(FadeIn(heads), Create(hrule), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(r) for r in rows], lag_ratio=0.5), run_time=max(1.0, d - 1.2))
        d = self.say()                                   # C(A), C(A^T): r ; N(A): n - r
        self.play(FadeIn(dims[0]), FadeIn(dims[2]), run_time=min(1.2, d * 0.3))
        self.wait(max(0, d * 0.5 - 1.2))
        self.play(FadeIn(dims[1]), run_time=min(1.2, d * 0.3))
        d = self.say()                                   # how big is the left null space?
        self.play(FadeIn(dims[3]), run_time=min(1.0, d * 0.4))
        self.pause(3.0)                                  # ⏸ predict dim N(A^T)

        calc = VGroup(M("<i>A</i>ᵀ: 4 × 3, rank 2", 24),
                      M("2 + nullity = 3", 24),
                      M("dim <i>N</i>(<i>A</i>ᵀ) = 1", 24, C_ROSE)).arrange(DOWN, buff=0.22).move_to(full)
        d = self.say()                                   # A^T is 4 x 3, rank 2
        self.play(FadeOut(ycol), FadeIn(calc[0]), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # 2 + nullity = 3
        self.play(FadeIn(calc[1]), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # dimension one
        self.play(FadeIn(calc[2]), run_time=min(1.0, d * 0.6))
        mr = M("<i>m</i> − <i>r</i>", 26).move_to(dims[3])
        thm = M("<b>Theorem 13.</b>  dimensions <i>r</i>, <i>n</i> − <i>r</i>, <i>r</i>, <i>m</i> − <i>r</i>."
                "   For this matrix: 2, 2, 2, 1.", 26).move_to(np.array([-0.9, -3.5, 0]))
        d = self.say()                                   # in general m - r
        self.play(ReplacementTransform(dims[3], mr), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(thm), run_time=min(1.0, d * 0.5))
        self.pause(1.5)                                  # ⏸ read the completed table

        self.n1 = SimpleNamespace(lrect=lrect, rrect=rrect, ltit=ltit, rtit=rtit, lsp=lsp, rsp=rsp, amap=amap,
                                  amap_l=amap_l, s_row=s_row, s_null=s_null, s_col=s_col, full=full,
                                  s_lnull_lab=s_lnull_lab, calc=calc,
                                  table=VGroup(heads, hrule, rows, dims[0], dims[1], dims[2], mr, thm))

    # ------------------------------------------------------------------------------------------------
    def record(self):
        n = self.n1
        dim1 = M("dim 1", 26, C_ROSE).move_to(n.full)
        d = self.say()                                   # a single vector y will span it
        self.play(FadeOut(n.table), ReplacementTransform(n.calc, dim1), run_time=min(1.2, d * 0.4))
        self.play(Indicate(VGroup(n.full, dim1), color=C_ROSE, scale_factor=1.05), run_time=min(1.2, d * 0.4))
        self.say()                                       # how do you find it?
        R_ROWS = [["1", "2", "0", "1"], ["0", "0", "1", "2"], ["0", "0", "0", "0"]]
        A = gmat(A_ROWS, 28, 0.8, 0.5)
        R = gmat(R_ROWS, 28, 0.8, 0.5)
        A_lab = M("<i>A</i>", 28)
        R_lab = M("<i>R</i>", 28)
        arr = Arrow(LEFT * 0.9, RIGHT * 0.9, buff=0, color=C_DIM, stroke_width=3, tip_length=0.18)
        arr_l = P("elimination", 22, C_DIM).next_to(arr, UP, buff=0.08)
        row = VGroup(A, arr, R).arrange(RIGHT, buff=0.45).move_to(np.array([0, -1.6, 0]))
        arr_l.next_to(arr, UP, buff=0.08)
        A_lab.next_to(A, DOWN, buff=0.22)
        R_lab.next_to(R, DOWN, buff=0.22)
        zbox = SurroundingRectangle(VGroup(*R.cells[2]), color=C_ROSE, buff=0.08, stroke_width=2)
        d = self.say()                                   # the zero row in R
        self.play(FadeIn(R), FadeIn(R_lab), run_time=min(1.0, d * 0.4))
        self.play(Create(zbox), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # some combination of A's rows cancelled
        self.play(FadeIn(A), FadeIn(A_lab), GrowArrow(arr), FadeIn(arr_l), run_time=min(1.4, d * 0.4))
        self.play(Indicate(VGroup(*[A.cells[i][j] for i in range(3) for j in range(4)]), color=C_ROSE,
                           scale_factor=1.05), run_time=min(1.4, d * 0.4))
        how = M("?", 34, C_DIM).next_to(arr, DOWN, buff=0.12)
        d = self.say()                                   # didn't write down how
        self.play(FadeIn(how), run_time=min(0.8, d * 0.4))
        self.pause(0.6)

        # ---- [A | I] keeps a record
        start = [r + i for r, i in zip(A_ROWS, [["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]])]
        AI = gmat(start, 28, 0.82, 0.55, bar=4).move_to(np.array([-1.6, -1.55, 0]))
        AI_lab = VGroup(M("<i>A</i>", 28).next_to(VGroup(*[AI.cells[2][j] for j in range(4)]), DOWN, buff=0.35),
                        M("<i>I</i>", 28).next_to(VGroup(*[AI.cells[2][j] for j in range(4, 7)]), DOWN, buff=0.35))
        ops_t = ["<i>R</i><sub>2</sub> − 2<i>R</i><sub>1</sub>", "<i>R</i><sub>3</sub> − <i>R</i><sub>1</sub>",
                 "<i>R</i><sub>3</sub> + <i>R</i><sub>2</sub>", "½<i>R</i><sub>2</sub>",
                 "<i>R</i><sub>1</sub> − <i>R</i><sub>2</sub>"]
        ops = VGroup(*[M(t, 26, C_DIM) for t in ops_t]).arrange(DOWN, buff=0.2, aligned_edge=LEFT)
        ops.move_to(np.array([4.9, -1.6, 0]))
        d = self.say()                                   # make it keep a record
        self.play(FadeOut(VGroup(R, R_lab, zbox, arr, arr_l, how)), run_time=min(0.8, d * 0.5))
        d = self.say()                                   # identity beside A, five operations
        A_cells = [A.cells[i][j] for i in range(3) for j in range(4)]
        AI_A = [AI.cells[i][j] for i in range(3) for j in range(4)]
        self.play(*[ReplacementTransform(a, b) for a, b in zip(A_cells, AI_A)],
                  ReplacementTransform(A[0], AI[0]), ReplacementTransform(A[2], AI[2]),
                  ReplacementTransform(A_lab, AI_lab[0]), run_time=min(1.2, d * 0.2))
        self.play(FadeIn(VGroup(*[AI.cells[i][j] for i in range(3) for j in range(4, 7)]), AI[3], AI_lab[1]),
                  run_time=min(1.2, d * 0.2))
        self.play(LaggedStart(*[FadeIn(o) for o in ops], lag_ratio=0.3), run_time=min(2.0, d * 0.4))
        d = self.say()                                   # row one is one copy of row one
        b1 = SurroundingRectangle(VGroup(*AI.cells[0][4:]), color=WHITE, buff=0.07, stroke_width=2)
        self.play(Create(b1), run_time=min(0.8, d * 0.3))
        self.wait(max(0, d * 0.6 - 0.8))
        self.play(FadeOut(b1), run_time=0.4)

        # the five operations on the full width
        seq = [(1, ["0", "0", "2", "4", "−2", "1", "0"]), (2, ["0", "0", "−2", "−4", "−1", "0", "1"]),
               (2, ["0", "0", "0", "0", "−3", "1", "1"]), (1, ["0", "0", "1", "2", "−1", "½", "0"]),
               (0, ["1", "2", "0", "1", "2", "−½", "0"])]
        d = self.say()                                   # each operation updates the record
        step = max(0.55, (d - 0.2) / 5)
        for k, (i, new) in enumerate(seq):
            nr = swap_row(AI, i, new)
            self.play(ops[k].animate.set_color(WHITE),
                      *[Transform(AI.cells[i][j], nr[j]) for j in range(7)], run_time=step)
            ops[k].set_color(C_DIM)
        RE_lab = VGroup(M("<i>R</i>", 28).move_to(AI_lab[0]), M("<i>E</i>", 28, C_ROSE).move_to(AI_lab[1]))
        self.play(ReplacementTransform(AI_lab, RE_lab),
                  VGroup(*[AI.cells[i][j] for i in range(3) for j in range(4, 7)]).animate.set_color(C_ROSE),
                  run_time=0.6)
        self.pause(2.0)                                  # ⏸ read E

        # ---- reading E
        d = self.say()                                   # left block R, right block E, rows of E = amounts
        self.play(Indicate(RE_lab[0]), run_time=min(0.8, d * 0.15))
        self.play(Indicate(RE_lab[1], color=C_ROSE), run_time=min(0.8, d * 0.15))
        eA = M("<i>E A</i> = <i>R</i>", 30).next_to(ops, UP, buff=0.35)
        d = self.say()                                   # E times A equals R; row three of E
        self.play(FadeIn(eA), run_time=min(0.8, d * 0.3))
        e3 = SurroundingRectangle(VGroup(*AI.cells[2][4:]), color=C_ROSE, buff=0.08, stroke_width=2)
        self.play(Create(e3), run_time=min(0.8, d * 0.3))
        r3 = SurroundingRectangle(VGroup(*AI.cells[2][:4]), color=WHITE, buff=0.08, stroke_width=2)
        d = self.say()                                   # row three of R is zero
        self.play(Create(r3), run_time=min(0.8, d * 0.5))
        chk = VGroup(M("−3 · (1, 2, 1, 3)", 26), M("+ (2, 4, 4, 10)", 26), M("+ (1, 2, −1, −1)", 26),
                     M("=", 26), M("?", 26))
        chk.arrange(RIGHT, buff=0.18).move_to(np.array([-0.3, -3.45, 0]))
        d = self.say()                                   # minus three copies of row one...
        self.play(FadeIn(chk[0]), run_time=d * 0.3)
        self.play(FadeIn(chk[1]), run_time=d * 0.25)
        self.play(FadeIn(chk[2:]), run_time=d * 0.25)
        self.say()                                       # check it
        self.pause(3.0)                                  # ⏸ check the sum (zeros and y label hidden)

        zero = M("(0, 0, 0, 0)", 26, C_ROSE).move_to(chk[4]).align_to(chk[4], LEFT)
        d = self.say()                                   # column by column the sums cancel
        self.play(ReplacementTransform(chk[4], zero), run_time=min(1.2, d * 0.4))
        self.play(Indicate(zero, color=C_ROSE), run_time=min(1.0, d * 0.3))
        y_vec = colv((-3, 1, 1), C_ROSE, size=26, vb=0.42)
        y_l = M("<b>y</b> =", 26, C_ROSE)
        y_grp = VGroup(y_l, y_vec).arrange(RIGHT, buff=0.15).move_to(n.full).shift(DOWN * 0.2)
        d = self.say()                                   # y = (-3, 1, 1) spans the left null space
        self.play(FadeOut(dim1), TransformFromCopy(VGroup(*AI.cells[2][4:]), y_vec), FadeIn(y_l),
                  run_time=min(1.6, d * 0.5))
        self.pause(0.6)
        self.n2 = SimpleNamespace(y_grp=y_grp, rec=VGroup(AI, RE_lab, ops, eA, e3, r3, chk[:4], zero))

    # ------------------------------------------------------------------------------------------------
    def diagram(self):
        n, n2 = self.n1, self.n2
        LB, RB = np.array([-3.7, 0.9, 0]), np.array([3.7, 0.9, 0])
        lrect, _ = sbox(LB, 6.1, 4.2, "")
        rrect, _ = sbox(RB, 6.1, 4.2, "")
        ltit = n.ltit.copy().next_to(lrect, UP, buff=0.12)
        rtit = n.rtit.copy().next_to(rrect, UP, buff=0.12)
        lsp = n.lsp.copy().next_to(lrect.get_corner(DL), UR, buff=0.12)
        rsp = n.rsp.copy().next_to(rrect.get_corner(DR), UL, buff=0.12)
        s = 1.15
        O, O2 = np.array([-1.6, 0.9, 0]), np.array([1.6, 0.9, 0])
        rowD = diamond(O, True, s, C_ROW)
        nulD = diamond(O, False, s, C_NULL)
        colD = diamond(O2, True, s, C_COLW)
        lnl = Line(O2, O2 + 1.7 * ddir(-45), color=C_ROSE, stroke_width=7)
        rmL = right_mark(O, ddir(135), ddir(225))
        rmR = right_mark(O2, ddir(45), ddir(-45))
        o_dots = VGroup(Dot(O, radius=0.06), Dot(O2, radius=0.06))

        def block(lab, vecs, color, anchor, edge):
            g = VGroup(lab, *[M(tup(v), 24, color) for v in vecs]).arrange(DOWN, buff=0.14, aligned_edge=edge)
            return g.move_to(anchor, aligned_edge=edge)

        L_row = block(name_lab("row space", "<i>C</i>(<i>A</i>ᵀ)", C_ROW), [(1, 2, 0, 1), (0, 0, 1, 2)], C_ROW,
                      np.array([-2.75, 2.15, 0]), RIGHT)
        L_null = block(name_lab("null space", "<i>N</i>(<i>A</i>)", C_NULL), [(-2, 1, 0, 0), (-1, 0, -2, 1)], C_NULL,
                       np.array([-2.75, -0.35, 0]), RIGHT)
        L_col = block(name_lab("column space", "<i>C</i>(<i>A</i>)", WASH), [(1, 2, 1), (1, 4, -1)], C_COLW,
                      np.array([2.75, 2.15, 0]), LEFT)
        L_col[1].set_color(C_U)
        L_col[2].set_color(C_Q)
        L_ln = block(name_lab("left null space", "<i>N</i>(<i>A</i>ᵀ)", C_ROSE), [(-3, 1, 1)], C_ROSE,
                     np.array([3.25, -0.45, 0]), LEFT)
        dims = VGroup(M("dim 2", 24, C_ROW).next_to(L_row, DOWN, buff=0.12, aligned_edge=RIGHT),
                      M("dim 2", 24, C_NULL).next_to(L_null, UP, buff=0.12, aligned_edge=RIGHT),
                      M("dim 2", 24, C_COLW).next_to(L_col, DOWN, buff=0.12, aligned_edge=LEFT),
                      M("dim 1", 24, C_ROSE).next_to(L_ln, DOWN, buff=0.08, aligned_edge=LEFT))
        xr = O + s * 0.5 * (ddir(45) + ddir(135)) + LEFT * 0.25 + UP * 0.1
        xn = O + s * 0.5 * (ddir(-45) + ddir(-135)) + LEFT * 0.25 + DOWN * 0.1
        yc = O2 + s * 0.5 * (ddir(45) + ddir(135)) + RIGHT * 0.25 + UP * 0.1
        pr, pn, pc = Dot(xr, radius=0.07, color=C_ROW), Dot(xn, radius=0.07, color=C_NULL), Dot(yc, radius=0.07)
        m1 = CurvedArrow(xr + RIGHT * 0.1, yc + LEFT * 0.1, angle=-PI / 5, color=WHITE, stroke_width=3,
                         tip_length=0.18)
        m2 = CurvedArrow(xn + RIGHT * 0.1, O2 + LEFT * 0.08 + DOWN * 0.05, angle=PI / 5, color=WHITE,
                         stroke_width=3, tip_length=0.18)
        zero_l = M("0", 24).next_to(O2, LEFT, buff=0.12).shift(UP * 0.18)
        bglab(zero_l)
        m_lab = M("<i>A</i>", 28).move_to(np.array([0, 2.25, 0]))
        cnt = VGroup(M("2 + 2 = 4", 28).next_to(lrect, DOWN, buff=0.25),
                     M("2 + 1 = 3", 28).next_to(rrect, DOWN, buff=0.25))
        shapes = VGroup(rowD, nulD, colD, lnl)
        d = self.say()                                   # all four from one elimination
        self.play(FadeOut(n2.rec), run_time=0.5)
        self.play(ReplacementTransform(n.lrect, lrect), ReplacementTransform(n.rrect, rrect),
                  ReplacementTransform(n.ltit, ltit), ReplacementTransform(n.rtit, rtit),
                  ReplacementTransform(n.lsp, lsp), ReplacementTransform(n.rsp, rsp),
                  FadeOut(VGroup(n.amap, n.amap_l)),
                  ReplacementTransform(n.s_row[0], L_row[0]), ReplacementTransform(n.s_row[1], VGroup(rowD, L_row[1:])),
                  ReplacementTransform(n.s_null[0], L_null[0]),
                  ReplacementTransform(n.s_null[1], VGroup(nulD, L_null[1:])),
                  ReplacementTransform(n.s_col[0], L_col[0]), ReplacementTransform(n.s_col[1], VGroup(colD, L_col[1:])),
                  ReplacementTransform(n.s_lnull_lab, L_ln[0]),
                  ReplacementTransform(VGroup(n.full, n2.y_grp), VGroup(lnl, L_ln[1:])),
                  run_time=max(1.5, d - 0.6))
        self.add(rmL, rmR, o_dots)
        d = self.say()                                   # input side
        self.play(FadeIn(dims[:2]), Create(rmL), Indicate(VGroup(L_row, L_null), scale_factor=1.04),
                  run_time=min(2.0, d * 0.5))
        self.play(FadeIn(pr), FadeIn(pn), run_time=0.5)
        d = self.say()                                   # output side
        self.play(FadeIn(dims[2:]), Create(rmR), Indicate(VGroup(L_col, L_ln), scale_factor=1.04),
                  run_time=min(2.0, d * 0.5))
        self.play(Create(m1), FadeIn(m_lab), FadeIn(pc), run_time=min(1.2, d * 0.25))
        self.play(Create(m2), FadeIn(zero_l), run_time=min(1.2, d * 0.2))
        d = self.say()                                   # the counts add up
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # 2 + 2 = 4
        self.play(FadeIn(cnt[0]), run_time=min(1.0, d * 0.5))
        d = self.say()                                   # 2 + 1 = 3
        self.play(FadeIn(cnt[1]), run_time=min(1.0, d * 0.5))
        self.pause(3.0)                                  # ⏸ inspect the diagram
        self.dg = SimpleNamespace(lrect=lrect, rrect=rrect, ltit=ltit, rtit=rtit, lsp=lsp, rsp=rsp, O=O, O2=O2,
                                  s=s, rowD=rowD, nulD=nulD, colD=colD, lnl=lnl, rmL=rmL, rmR=rmR, o_dots=o_dots,
                                  labs=VGroup(L_row, L_null, L_col, L_ln), dims=dims,
                                  maps=VGroup(m1, m2, m_lab, zero_l, pr, pn, pc), cnt=cnt)
        self.dg.all = VGroup(lrect, rrect, ltit, rtit, lsp, rsp, shapes, rmL, rmR, o_dots, self.dg.labs, dims,
                             self.dg.maps, cnt)

    # ------------------------------------------------------------------------------------------------
    def reachable(self):
        g = self.dg
        PC = np.array([3.8, 0.3, 0])
        o, ap = a_panel(center=tuple(PC))
        SC = 1.25
        for m in (ap.ax, ap.plane, ap.cols):
            m.scale(SC, about_point=PC)
        ap.spot = PC + SC * (ap.spot - PC)
        _p = o.p
        o.p = lambda x, y, z: PC + SC * (_p(x, y, z) - PC)
        ttl = P("output: where the amounts land", 22, C_DIM).move_to(np.array([3.75, 3.6, 0]))
        sp = M("ℝ<sup>3</sup>", 26, C_DIM).next_to(ttl, LEFT, buff=0.3)
        cols = VGroup(ap.cols[0].copy().set_color(C_U), ap.cols[2].copy().set_color(C_Q))
        y3 = (-3, 1, 1)
        ya = o.arrow(y3, C_ROSE, 6)
        ya_l = bglab(M("<b>y</b> = (−3, 1, 1)", 24, C_ROSE).next_to(ya.get_end(), UP, buff=0.1))
        b_ok = Dot(o.p(4, 10, 2), radius=0.09, color=C_W)
        b_no = Dot(o.p(4, 10, 3), radius=0.09, color=C_W)
        drop = DashedLine(o.p(4, 10, 3), o.p(4, 10, 2), color=C_W, stroke_width=2, dash_length=0.06)
        bok_l = bglab(M("(4, 10, 2)", 24, C_W).next_to(b_ok, RIGHT, buff=0.12).shift(DOWN * 0.12))
        bno_l = bglab(M("(4, 10, 3)", 24, C_W).next_to(b_no, RIGHT, buff=0.12).shift(UP * 0.12))
        cap = bglab(M("<i>C</i>(<i>A</i>)", 26, C_COLW).move_to(ap.spot))
        pic = VGroup(ap.ax, ap.plane, cols, cap, ya, ya_l, b_ok, b_no, drop, bok_l, bno_l)

        X0 = -6.6
        def L(markup, y, color=WHITE, size=28):
            return M(markup, size, color).move_to(np.array([0, y, 0]), aligned_edge=LEFT).set_x(X0, LEFT)

        d = self.say()                                   # earlier: (4,10,2) reachable, (4,10,3) not
        self.play(FadeOut(g.all), run_time=0.6)
        self.play(FadeIn(VGroup(ttl, sp, ap.ax)), FadeIn(ap.plane), FadeIn(cols), FadeIn(cap),
                  run_time=min(1.4, d * 0.3))
        self.play(FadeIn(b_ok), FadeIn(bok_l), FadeIn(b_no), FadeIn(bno_l), Create(drop),
                  run_time=min(1.4, d * 0.3))
        d = self.say()                                   # the left null space tells which
        self.play(GrowArrow(ya), FadeIn(ya_l), run_time=min(1.4, d * 0.4))

        e1 = L("<i>A</i><b>x</b> = <b>b</b>,   <b>y</b>ᵀ<i>A</i> = <b>0</b>ᵀ", 2.7)
        e2a = L("⇒  <b>y</b>ᵀ<b>b</b> = <b>y</b>ᵀ<i>A</i><b>x</b>", 1.95)
        e2b = M("= 0", 28).next_to(e2a, RIGHT, buff=0.15)
        e3 = L("test:  −3<i>b</i><sub>1</sub> + <i>b</i><sub>2</sub> + <i>b</i><sub>3</sub> = 0", 1.0)
        d = self.say()                                   # if Ax = b ... y^T b = y^T A x; y^T A = 0
        self.play(FadeIn(e1), run_time=min(1.2, d * 0.2))
        self.play(FadeIn(e2a), run_time=min(1.2, d * 0.25))
        self.wait(max(0, d * 0.7 - 2.4))
        self.play(Indicate(e1[-5:]), run_time=min(1.0, d * 0.15))
        d = self.say()                                   # then y^T b has to be zero
        self.play(FadeIn(e2b), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # one condition on the target
        self.play(Indicate(ya_l, color=C_ROSE), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # -3 b1 + b2 + b3 = 0
        self.play(FadeIn(e3), run_time=min(1.4, d * 0.5))
        t1 = L("<b>b</b> = (4, 10, 2):", 0.15, C_W, 26)
        t2 = L("<b>b</b> = (4, 10, 3):", -0.55, C_W, 26)
        d = self.say()                                   # try it on both
        self.play(FadeIn(t1), FadeIn(t2), run_time=min(1.0, d * 0.5))
        self.pause(3.0)                                  # ⏸ compute both (results and marks hidden)

        r1 = M("−12 + 10 + 2 = 0  ✓", 26).next_to(t1, RIGHT, buff=0.25)
        r1[-1].set_color(C_W)
        r2 = M("−12 + 10 + 3 = 1 ≠ 0  ✗", 26).next_to(t2, RIGHT, buff=0.25)
        r2[-1].set_color(WHITE)
        bad = M("earlier bad row:  (0, 0, 0, 0 | 1)", 24, C_DIM)
        bad.next_to(t2, DOWN, buff=0.35).align_to(t2, LEFT)
        d = self.say()                                   # (4,10,2): zero
        self.play(FadeIn(r1[:-1]), run_time=min(1.4, d * 0.5))
        d = self.say()                                   # reachable
        self.play(FadeIn(r1[-1]), Indicate(VGroup(b_ok, bok_l), color=C_W), run_time=min(1.0, d))
        d = self.say()                                   # (4,10,3): one
        self.play(FadeIn(r2), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # same one as the bad row
        self.play(FadeIn(bad), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # reducing applies E to b too
        self.play(Indicate(bad[-2:], color=WHITE), Indicate(r2[11:12], color=WHITE), run_time=min(1.4, d * 0.3))
        self.pause(0.6)

        # ---- Theorem 14
        th1 = VGroup(P("<b>Theorem 14.</b>  <i>A</i><b>x</b> = <b>b</b> has a solution exactly when", 24),
                     M("<b>y</b>ᵀ<b>b</b> = 0  for every  <b>y</b> ∈ <i>N</i>(<i>A</i>ᵀ).", 26))
        th1.arrange(DOWN, buff=0.15, aligned_edge=LEFT).move_to(np.array([0, 2.6, 0])).set_x(X0, LEFT)
        aug = M("[<i>A</i> | <b>b</b>]  →  [<i>R</i> | <i>E</i><b>b</b>]", 28).move_to(np.array([0, 1.35, 0])).set_x(X0, LEFT)
        rm = gmat([["1", "2", "0", "1", "2<i>b</i><sub>1</sub> − ½<i>b</i><sub>2</sub>"],
                   ["0", "0", "1", "2", "−<i>b</i><sub>1</sub> + ½<i>b</i><sub>2</sub>"],
                   ["0", "0", "0", "0", "−3<i>b</i><sub>1</sub> + <i>b</i><sub>2</sub> + <i>b</i><sub>3</sub>"]],
                  size=24, pitch=0.6, vb=0.48, bar=4, bar_gap=0.3)
        for i in range(3):
            rm.cells[i][4].shift(RIGHT * 0.95)
        rm[2].shift(RIGHT * 1.9)
        rm.move_to(np.array([0, -0.2, 0])).set_x(X0 + 0.1, LEFT)
        th2 = VGroup(P("The rows of <i>E</i> beside the zero rows of <i>R</i>", 24),
                     P("form a basis of <span font_family='STIX Two Text'><i>N</i>(<i>A</i>ᵀ)</span>.", 24))
        th2.arrange(DOWN, buff=0.12, aligned_edge=LEFT).move_to(np.array([0, -1.7, 0])).set_x(X0, LEFT)
        d = self.say()                                   # the converse
        self.play(FadeOut(VGroup(e1, e2a, e2b, e3, t1, t2, r1, r2, bad)), run_time=min(0.8, d * 0.5))
        d = self.say()                                   # y^T b = 0 for every y => solution
        self.play(FadeIn(th1), run_time=min(1.6, d * 0.4))
        d = self.say()                                   # [A|b] -> [R|Eb]
        self.play(FadeIn(aug), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(rm), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # entries beside zero rows are y^T b
        lastbox = SurroundingRectangle(VGroup(*rm.cells[2]), color=C_ROSE, buff=0.08, stroke_width=2)
        self.play(Create(lastbox), run_time=min(1.0, d * 0.25))
        self.play(Indicate(rm.cells[2][4], color=C_ROSE), run_time=min(1.2, d * 0.25))
        d = self.say()                                   # all zero => no pivot in the last column
        self.play(Indicate(VGroup(*[rm.cells[i][4] for i in range(3)]), color=WHITE, scale_factor=1.05),
                  run_time=min(1.4, d * 0.4))
        d = self.say()                                   # those rows of E are a basis
        self.play(FadeIn(th2), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # E's m rows are independent
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # m - r rows in a space of dim m - r
        self.play(Indicate(lastbox, color=C_ROSE), run_time=min(1.2, d * 0.3))
        self.say()                                       # right number of independent vectors
        self.pause(2.0)                                  # ⏸ read the theorem

        # ---- the promise about rank
        pr1 = L("<i>r</i> &lt; <i>m</i>  ⇒  some <b>y</b> ≠ <b>0</b> in <i>N</i>(<i>A</i>ᵀ)", 2.4)
        pr2 = L("<b>b</b> = <b>y</b>  gives  <b>y</b>ᵀ<b>b</b> = <b>y</b>ᵀ<b>y</b> &gt; 0", 1.5)
        pr3 = L("⇒  unreachable", 0.6)
        tgt = Dot(o.p(*y3), radius=0.1, color=C_W)
        tgt_l = bglab(M("<b>b</b> = <b>y</b>", 24, C_W).next_to(tgt, DOWN, buff=0.15))
        d = self.say()                                   # closes the promise about rank
        self.play(FadeOut(VGroup(th1, aug, rm, lastbox, th2)), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # rank < m: nonzero y; use it as the target
        self.play(FadeIn(pr1), run_time=min(1.2, d * 0.3))
        self.play(Indicate(VGroup(ya, ya_l), color=C_ROSE), run_time=min(1.0, d * 0.2))
        self.play(FadeIn(tgt, scale=0.5), FadeIn(tgt_l), run_time=min(1.0, d * 0.25))
        d = self.say()                                   # y^T b = y^T y, not zero
        self.play(FadeIn(pr2), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # can't be reached
        self.play(FadeIn(pr3), run_time=min(1.0, d * 0.5))
        d = self.say()                                   # full row rank
        self.play(Indicate(ap.plane, color=C_COLW, scale_factor=1.0), run_time=min(1.2, d * 0.5))
        self.pause(0.6)
        self.play(FadeOut(VGroup(pic, ttl, sp, tgt, tgt_l, pr1, pr2, pr3)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def fit_together(self):
        g = self.dg
        base = VGroup(g.lrect, g.rrect, g.ltit, g.rtit, g.lsp, g.rsp, g.rowD, g.nulD, g.colD, g.lnl, g.rmL, g.rmR,
                      g.o_dots, g.labs, g.dims)
        O, O2, s = g.O, g.O2, g.s
        d = self.say()                                   # each pair meets only at the origin
        self.play(FadeIn(base), run_time=min(1.4, d * 0.3))
        self.play(Indicate(g.o_dots, color=WHITE, scale_factor=2.0), run_time=min(1.2, d * 0.3))
        self.say()                                       # every matrix?
        self.say()                                       # in both at once?
        self.pause(3.0)                                  # ⏸ think (z^T z argument hidden)

        z1 = M("<b>z</b> ∈ <i>C</i>(<i>A</i>ᵀ) ∩ <i>N</i>(<i>A</i>):   <b>z</b> = <i>A</i>ᵀ<b>y</b>,   "
               "<i>A</i><b>z</b> = <b>0</b>", 28).move_to(np.array([0, -1.9, 0]))
        z2 = M("<b>z</b>ᵀ<b>z</b> = (<i>A</i>ᵀ<b>y</b>)ᵀ<b>z</b> = <b>y</b>ᵀ<i>A</i><b>z</b> = 0   ⇒   <b>z</b> = <b>0</b>",
               28).move_to(np.array([0, -2.6, 0]))
        d = self.say()                                   # every row dotted with x gives zero
        self.play(FadeIn(z1), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # right angle to every row
        self.play(Indicate(g.rmL, color=WHITE, scale_factor=1.8), run_time=min(1.4, d * 0.3))
        d = self.say()                                   # a vector in both: right angle to itself
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # z^T z = 0
        self.play(FadeIn(z2[:-6]), run_time=min(1.6, d * 0.5))
        d = self.say()                                   # only the zero vector
        self.play(FadeIn(z2[-6:]), run_time=min(1.0, d * 0.5))
        self.pause(0.4)

        t15a = M("<b>Theorem 15.</b>   ℝ<sup><i>n</i></sup> = <i>C</i>(<i>A</i>ᵀ) ⊕ <i>N</i>(<i>A</i>)", 28)
        t15b = M("ℝ<sup><i>m</i></sup> = <i>C</i>(<i>A</i>) ⊕ <i>N</i>(<i>A</i>ᵀ)", 28)
        t15 = VGroup(t15a, t15b).arrange(RIGHT, buff=0.8).move_to(np.array([0, -1.9, 0]))
        dimeq = M("dim = <i>r</i> + (<i>n</i> − <i>r</i>) − 0 = <i>n</i>", 28).move_to(np.array([0, -2.6, 0]))
        t15c = P("Moreover <i>A</i> maps the row space one-to-one onto the column space.", 24)
        t15c.move_to(np.array([0, -3.35, 0]))
        d = self.say()                                   # the sum is direct
        self.play(FadeOut(VGroup(z1, z2)), run_time=0.5)
        self.play(FadeIn(t15a), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # r + n - r - 0 = n; all of R^n; the same for A^T
        self.play(FadeIn(dimeq), run_time=min(1.2, d * 0.15))
        self.wait(d * 0.3)
        self.play(Indicate(g.lrect, color=WHITE, scale_factor=1.02), run_time=min(1.2, d * 0.1))
        self.wait(d * 0.25)
        self.play(FadeIn(t15b), run_time=min(1.2, d * 0.1))
        self.pause(0.6)

        # ---- the split of an input
        a, b = 0.85, 0.25
        xr = O + s * (a * ddir(135) + b * ddir(45))
        xn = O + s * (a * ddir(-135) + b * ddir(-45))
        x = xr + xn - O
        Ax = O2 + s * (0.55 * ddir(45) + 0.45 * ddir(135))
        ar_r = Arrow(O, xr, buff=0, color=C_ROW, stroke_width=5, tip_length=0.16)
        ar_n = Arrow(O, xn, buff=0, color=C_NULL, stroke_width=5, tip_length=0.16)
        ar_x = Arrow(O, x, buff=0, color=WHITE, stroke_width=5, tip_length=0.16)
        dsh = VGroup(DashedLine(xr, x, color=C_DIM, stroke_width=2), DashedLine(xn, x, color=C_DIM, stroke_width=2))
        lx = bglab(M("<b>x</b>", 26).next_to(x, LEFT, buff=0.1))
        lr = bglab(M("<b>x</b><sub>r</sub>", 26, C_ROW).next_to(xr, UP, buff=0.08))
        ln = bglab(M("<b>x</b><sub>null</sub>", 26, C_NULL).next_to(xn, DOWN, buff=0.08))
        to0 = CurvedArrow(xn + RIGHT * 0.05, O2 + DOWN * 0.08 + LEFT * 0.05, angle=PI / 4, color=C_NULL,
                          stroke_width=3, tip_length=0.16)
        toAx = CurvedArrow(xr + RIGHT * 0.05, Ax + LEFT * 0.08, angle=-PI / 4, color=C_ROW, stroke_width=3,
                           tip_length=0.16)
        dAx = Dot(Ax, radius=0.07)
        lAx = bglab(M("<i>A</i><b>x</b>", 26).next_to(Ax, UR, buff=0.06))
        g.labs.save_state()
        d = self.say()                                   # every input splits
        self.play(FadeOut(VGroup(t15a, t15b, dimeq)), g.labs.animate.set_opacity(0.25),
                  g.dims.animate.set_opacity(0.25), run_time=0.5)
        self.play(GrowArrow(ar_x), FadeIn(lx), run_time=min(1.0, d * 0.25))
        self.play(GrowArrow(ar_r), GrowArrow(ar_n), Create(dsh), FadeIn(lr), FadeIn(ln), run_time=min(1.6, d * 0.4))
        d = self.say()                                   # null part to zero; row space reaches C(A)
        self.play(Create(to0), run_time=min(1.2, d * 0.3))
        self.play(Create(toAx), FadeIn(dAx), FadeIn(lAx), run_time=min(1.2, d * 0.3))
        xr2 = O + s * (0.35 * ddir(135) + 0.65 * ddir(45))
        ar_r2 = Arrow(O, xr2, buff=0, color=C_ROW, stroke_width=4, tip_length=0.14)
        lr2 = bglab(M("<b>x</b><sub>r</sub>′", 26, C_ROW).next_to(xr2, RIGHT, buff=0.08))
        toAx2 = DashedVMobject(CurvedArrow(xr2 + RIGHT * 0.05, Ax + LEFT * 0.08 + DOWN * 0.04, angle=-PI / 6,
                                           color=C_ROW, stroke_width=3, tip_length=0.16), num_dashes=18)
        diff = Arrow(xr2, xr, buff=0, color=WHITE, stroke_width=4, tip_length=0.14)
        d = self.say()                                   # two row-space vectors, same image: difference zero
        self.play(FadeOut(VGroup(ar_x, lx, dsh, ar_n, ln, to0)), GrowArrow(ar_r2), FadeIn(lr2), run_time=min(1.2, d * 0.15))
        self.play(Create(toAx2), run_time=min(1.0, d * 0.12))
        self.play(GrowArrow(diff), run_time=min(0.8, d * 0.1))
        self.play(diff.animate.shift(O - xr2), run_time=min(1.0, d * 0.12))
        self.play(Indicate(VGroup(g.rowD, g.nulD), color=WHITE, scale_factor=1.03), run_time=min(1.2, d * 0.15))
        self.play(diff.animate.scale(0.02, about_point=O), run_time=min(1.0, d * 0.12))
        self.remove(diff)
        self.play(Transform(ar_r2, ar_r.copy()), lr2.animate.move_to(lr).set_opacity(0),
                  FadeOut(toAx2), run_time=min(0.8, d * 0.1))
        self.remove(lr2)
        d = self.say()                                   # onto, without collapsing
        self.play(FadeIn(t15c), Indicate(VGroup(g.rowD, g.colD), color=WHITE, scale_factor=1.03),
                  run_time=min(1.6, d * 0.5))
        self.pause(2.0)                                  # ⏸ follow x_r and x_null

        # ---- output side: no component along the left null space
        c = O2 + s * (0.3 * ddir(45) + 0.75 * ddir(135))
        bpt = c + 0.95 * ddir(-45)
        bd = Dot(bpt, radius=0.08, color=C_W)
        bl = bglab(M("<b>b</b>", 26, C_W).next_to(bd, RIGHT, buff=0.08))
        comp = VGroup(DashedLine(c, bpt, color=C_ROSE, stroke_width=3), Dot(c, radius=0.05, color=C_DIM))
        d = self.say()                                   # reachable iff no component along N(A^T)
        self.play(FadeOut(VGroup(ar_r, ar_r2, lr, toAx, dAx, lAx, t15c)), run_time=0.4)
        self.play(FadeIn(bd), FadeIn(bl), run_time=min(0.8, d * 0.15))
        self.play(Create(comp), run_time=min(1.0, d * 0.2))
        self.play(bd.animate.move_to(c), bl.animate.next_to(c, LEFT, buff=0.08), FadeOut(comp),
                  run_time=min(1.4, d * 0.25))
        d = self.say()                                   # right-angle picture of the test
        self.play(Indicate(g.rmR, color=WHITE, scale_factor=1.8), run_time=min(1.2, d * 0.4))
        self.pause(0.4)
        d = self.say()                                   # one thing to keep straight
        self.play(FadeOut(VGroup(bd, bl)), g.labs.animate.restore(), g.dims.animate.set_opacity(1),
                  run_time=min(0.8, d))
        d = self.say()                                   # rank, nullity... need no angles
        self.play(Indicate(g.dims, color=WHITE, scale_factor=1.08), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # only the right angles
        self.play(Indicate(VGroup(g.rmL, g.rmR), color=WHITE, scale_factor=1.8), run_time=min(1.4, d * 0.3))
        self.pause(0.6)
        self.play(FadeOut(base), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def two_by_two_case(self):
        pin, pout, tin, tout, arr, alab = two_by_two()
        sq = Polygon(pin.c2p(0, 0), pin.c2p(1, 0), pin.c2p(1, 1), pin.c2p(0, 1), stroke_color=WHITE,
                     stroke_width=2.5, fill_color=WHITE, fill_opacity=0.18)
        sq_out = Polygon(pout.c2p(0, 0), pout.c2p(1, 0), pout.c2p(1, 1), pout.c2p(0, 1), stroke_color=WHITE,
                         stroke_width=2.5, fill_color=WHITE, fill_opacity=0.18)
        par = para(pout, (2, 1), (-1, 1))
        a1, a2 = vec(pout, 2, 1, C_U, width=5), vec(pout, -1, 1, C_Q, width=5)
        area = bglab(M("area 3", 26).move_to(pout.c2p(0.5, 1.5)), op=0.6)
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=30, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_grp = VGroup(M("<i>A</i> =", 30), A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.9, 0]))
        d = self.say()                                   # in two dimensions you can see collapse
        self.play(Create(pin), Create(pout), FadeIn(VGroup(tin, tout)), GrowArrow(arr), FadeIn(alab),
                  FadeIn(A_grp), run_time=min(2.0, d * 0.6))
        self.play(FadeIn(sq), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # unit square -> parallelogram of area 3
        self.play(TransformFromCopy(sq, sq_out), run_time=min(1.0, d * 0.2))
        self.play(Transform(sq_out, par), GrowArrow(a1), GrowArrow(a2), run_time=min(1.6, d * 0.3))
        self.play(FadeIn(area), run_time=min(0.8, d * 0.2))
        whole = Polygon(pout.c2p(-2, -2), pout.c2p(4, -2), pout.c2p(4, 6), pout.c2p(-2, 6), stroke_width=0,
                        fill_color=C_COLW, fill_opacity=0.10)
        cA = bglab(M("<i>C</i>(<i>A</i>) = ℝ<sup>2</sup>", 26, C_COLW).move_to(pout.c2p(2.6, 4.9)))
        nA = bglab(M("<i>N</i>(<i>A</i>) = {<b>0</b>}", 26, C_NULL).move_to(pin.c2p(2.3, 4.9)))
        z = Dot(pin.c2p(0, 0), radius=0.08, color=C_NULL)
        d = self.say()                                   # column space all of R^2, null space zero
        self.play(FadeIn(whole), FadeIn(cA), run_time=min(1.2, d * 0.4))
        self.play(FadeIn(z), FadeIn(nA), run_time=min(1.2, d * 0.4))

        A2 = matrix_mob([["1", "2"], ["2", "4"]], size=30, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A2_grp = VGroup(M("<i>A</i> =", 30), A2).arrange(RIGHT, buff=0.2).move_to(A_grp)
        flat = para(pout, (1, 2), (2, 4))
        b1, b2 = vec(pout, 1, 2, C_U, width=5), vec(pout, 2, 4, C_Q, width=5)
        line_c = Line(pout.c2p(-1, -2), pout.c2p(3, 6), color=C_COLW, stroke_width=4)
        cA2 = bglab(M("<i>C</i>(<i>A</i>)", 26, C_COLW).next_to(pout.c2p(2.2, 4.4), RIGHT, buff=0.15))
        line_n = Line(pin.c2p(-2, 1), pin.c2p(4, -2), color=C_NULL, stroke_width=4)
        nA2 = bglab(M("<i>N</i>(<i>A</i>)", 26, C_NULL).next_to(pin.c2p(3.2, -1.6), UP, buff=0.12))
        area0 = bglab(M("area 0", 26).next_to(pout.c2p(1.0, 2.0), LEFT, buff=0.25), op=0.85)
        pts = [(-1, 0.5), (1, -0.5), (2, -1)]
        nd = VGroup(*[Dot(pin.c2p(*p), radius=0.07, color=C_NULL) for p in pts])
        d = self.say()                                   # the singular matrix flattens the square
        self.play(FadeOut(VGroup(whole, cA, nA, z, area)), ReplacementTransform(A_grp, A2_grp), run_time=min(1.0, d * 0.12))
        self.play(Transform(sq_out, flat), Transform(a1, b1), Transform(a2, b2), run_time=min(2.0, d * 0.2))
        self.play(FadeIn(area0), Create(line_c), FadeIn(cA2), run_time=min(1.2, d * 0.15))
        self.play(Create(line_n), FadeIn(nA2), FadeIn(nd), run_time=min(1.2, d * 0.15))
        self.play(*[dt.copy().animate.move_to(pout.c2p(0, 0)) for dt in nd], run_time=min(1.6, d * 0.2))
        det = P("|det <i>A</i>| = area of the image of the unit square", 22, C_DIM)
        det.next_to(A2_grp, RIGHT, buff=0.5)
        if det.get_right()[0] > 6.8:
            det.next_to(A2_grp, DOWN, buff=0.15)
        d = self.say()                                   # TERM determinant
        self.play(FadeIn(det), Indicate(area0), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # chapter five
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # only a picture of collapse
        self.play(Indicate(sq_out, color=WHITE, scale_factor=1.03), run_time=min(1.2, d * 0.5))
