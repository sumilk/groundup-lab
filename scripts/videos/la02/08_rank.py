"""Rank. Script: docs/LA02_VIDEO_SCRIPT.md, section "Rank" (chapter §5).

The 3 x 4 system A = [[1, 2, 1, 3], [2, 4, 4, 10], [1, 2, -1, -1]], b = (4, 10, 2), its RREF R, the column space
as a tilted plane in a drawn R^3 output panel, the row space in an R^4 input box, the consistency test, the
three outcomes, full row / column rank, and the rank of a product.
Helpers here (oblique R^3 panels, the 3 x 4 matrices, the table from "One system, two pictures") are shared
with 09_every_solution.py.
"""
from sample import *  # noqa: F401,F403
from sample import panel, LEFT_C, RIGHT_C, TOP_Y, UNIT, C_L1, C_L2

C_ROW = "#FF8A65"          # row space (orange)
C_COL = "#58C4DD"          # column-space wash (blue-teal)
C_COLW = "#4FC9C6"         # wash fill, between C_U and C_Q
C_NULL = C_P               # null space (purple)
C_VEC = "#DDE3EA"          # plain column arrows
BG = config.background_color

A_ROWS = [["1", "2", "1", "3"], ["2", "4", "4", "10"], ["1", "2", "−1", "−1"]]
R_ROWS = [["1", "2", "0", "1"], ["0", "0", "1", "2"], ["0", "0", "0", "0"]]
A_COLS = [(1, 2, 1), (2, 4, 2), (1, 4, -1), (3, 10, -1)]
R_COLS = [(1, 0, 0), (2, 0, 0), (0, 1, 0), (1, 2, 0)]


def sup(s):
    """A superscript that stays visible in Helvetica Neue."""
    return f"<span size='smaller' rise='2600'>{s}</span>"


AT = "A" + sup("T")          # for P(); in M() use <i>A</i><sup>T</sup>


def bglab(m, op=0.85, buff=0.05):
    m.add_background_rectangle(color=BG, opacity=op, buff=buff)
    return m


# ------------------------------------------------------------------------------------------- R^3 panels
class Obl:
    """Oblique drawing of R^3: screen point = origin + x e1 + y e2 + z e3."""

    def __init__(self, origin, e1, e2, e3):
        self.o = np.array(origin, dtype=float)
        self.e = [np.array([*e, 0.0])[:3] if len(e) == 2 else np.array(e, dtype=float) for e in (e1, e2, e3)]

    def p(self, x, y, z):
        return self.o + x * self.e[0] + y * self.e[1] + z * self.e[2]

    def arrow(self, v, color=C_VEC, width=5, start=(0, 0, 0), tip=0.18):
        a, b = self.p(*start), self.p(*(np.array(start) + np.array(v)))
        return Arrow(a, b, buff=0, color=color, stroke_width=width, tip_length=tip,
                     max_tip_length_to_length_ratio=0.3, max_stroke_width_to_length_ratio=20)

    def axes(self, r1, r2, r3, color="#5B6475"):
        g = VGroup()
        for k, (lo, hi) in enumerate((r1, r2, r3)):
            v0, v1 = [0, 0, 0], [0, 0, 0]
            v0[k], v1[k] = lo, hi
            g.add(Arrow(self.p(*v0), self.p(*v1), buff=0, color=color, stroke_width=2, tip_length=0.13,
                        max_tip_length_to_length_ratio=0.1))
        return g

    def patch(self, base, u, v, su, sv, color=C_COLW, opacity=0.18, stroke=0.0):
        """Parallelogram {base + s u + t v : s in su, t in sv}."""
        b, u, v = np.array(base, float), np.array(u, float), np.array(v, float)
        corners = [b + su[0] * u + sv[0] * v, b + su[1] * u + sv[0] * v, b + su[1] * u + sv[1] * v,
                   b + su[0] * u + sv[1] * v]
        return Polygon(*[self.p(*c) for c in corners], stroke_width=stroke, stroke_color=color,
                       fill_color=color, fill_opacity=opacity)


def a_panel(center=(3.7, 0.55, 0)):
    """The output R^3 panel holding A's four columns in their tilted plane. Returns (obl, VGroup parts)."""
    c = np.array(center, float)
    o = Obl(c + np.array([-1.65, -1.05, 0]), (0.35, 0), (0.12, 0.14), (0, 0.35))
    ax = o.axes((0, 5), (0, 11.5), (-1.6, 3.6))
    plane_ = o.patch((0, 0, 0), A_COLS[0], A_COLS[2], (-0.6, 3.6), (-0.6, 2.5))
    cols = VGroup(*[o.arrow(v, C_VEC, 5) for v in A_COLS])
    cols[1].set_z_index(-1)
    labs = VGroup(
        M("<i>a</i><sub>1</sub>", 24).next_to(cols[0].get_end(), LEFT, buff=0.08),
        M("<i>a</i><sub>2</sub>", 24).next_to(cols[1].get_end(), UL, buff=0.04),
        M("<i>a</i><sub>3</sub>", 24).next_to(cols[2].get_end(), DR, buff=0.04),
        M("<i>a</i><sub>4</sub>", 24).next_to(cols[3].get_end(), DR, buff=0.04))
    for l in labs:
        bglab(l)
    vs = plane_.get_vertices()
    spot = vs[2] + 0.3 * (vs[0] - vs[2]) + 0.12 * (vs[3] - vs[2])
    return o, SimpleNamespace(ax=ax, plane=plane_, cols=cols, labs=labs, spot=spot)


def r_panel(center=(3.7, 0.55, 0)):
    """R's columns, all flat in the floor."""
    c = np.array(center, float)
    o = Obl(c + np.array([-1.3, -0.75, 0]), (0.85, 0), (0.42, 0.38), (0, 0.85))
    ax = o.axes((0, 2.8), (0, 2.8), (0, 1.8))
    floor = o.patch((0, 0, 0), (1, 0, 0), (0, 1, 0), (-0.4, 2.5), (-0.4, 2.5), color=C_DIM, opacity=0.16)
    cols = VGroup(*[o.arrow(v, C_VEC, 5) for v in R_COLS])
    cols[1].set_z_index(-1)
    labs = VGroup(
        M("(1, 0, 0)", 22).next_to(cols[0].get_end(), DOWN, buff=0.12),
        M("(2, 0, 0)", 22).next_to(cols[1].get_end(), RIGHT, buff=0.1),
        M("(0, 1, 0)", 22).next_to(cols[2].get_end(), LEFT, buff=0.1),
        M("(1, 2, 0)", 22).next_to(cols[3].get_end(), RIGHT, buff=0.1))
    for l in labs:
        bglab(l)
    return o, SimpleNamespace(ax=ax, plane=floor, cols=cols, labs=labs)


# ------------------------------------------------------------------------------------------- matrices
def mat(rows, size=28, aug=False, colors=None, h_buff=0.55, v_buff=0.48):
    """matrix_mob, optionally with an augmentation bar before the last column."""
    m = matrix_mob(rows, size=size, h_buff=h_buff, v_buff=v_buff, entry_colors=colors)
    if aug:
        e = m.entries
        x = (e[0][-2].get_right()[0] + e[0][-1].get_left()[0]) / 2
        top, bot = m[0].get_top()[1] - 0.05, m[0].get_bottom()[1] + 0.05
        bar = Line([x, top, 0], [x, bot, 0], color=C_DIM, stroke_width=2)
        m.add(bar)
        m.bar = bar
    return m


def col_box(m, j, color=C_COL, buff=0.1):
    e = m.entries
    return SurroundingRectangle(VGroup(*[e[i][j] for i in range(len(e))]), color=color, buff=buff,
                                corner_radius=0.06, stroke_width=3)


def row_box(m, i, color=C_ROW, buff=0.1, upto=None):
    e = m.entries
    row = e[i] if upto is None else e[i][:upto]
    return SurroundingRectangle(VGroup(*row), color=color, buff=buff, corner_radius=0.06, stroke_width=3)


def piv_boxes(m, cells, color=WHITE):
    return VGroup(*[SurroundingRectangle(m.entries[i][j], color=color, buff=0.08, stroke_width=2.5,
                                         corner_radius=0.04) for i, j in cells])


def free_shade(m, cols=(1, 3)):
    e = m.entries
    g = VGroup()
    for j in cols:
        grp = VGroup(*[e[i][j] for i in range(len(e))])
        r = SurroundingRectangle(grp, buff=0.1, stroke_width=0, fill_color=C_DIM, fill_opacity=0.22,
                                 corner_radius=0.05)
        r.set_z_index(-2)
        g.add(r)
    return g


# ------------------------------------------------------------------------------------------- R^4 box
def box4(center, w=5.4, h=3.5, title="input: the amounts (<i>x</i><sub>1</sub>, <i>x</i><sub>2</sub>, "
                                       "<i>x</i><sub>3</sub>, <i>x</i><sub>4</sub>)", space="ℝ<sup>4</sup>"):
    r = RoundedRectangle(width=w, height=h, corner_radius=0.18, stroke_color="#5B6475", stroke_width=2)
    r.move_to(center)
    t = P(title, 22, C_DIM).next_to(r, UP, buff=0.15)
    s = M(space, 26, C_DIM).next_to(r.get_corner(UL), DR, buff=0.15)
    return SimpleNamespace(rect=r, title=t, space=s, all=VGroup(r, t, s))


# ------------------------------------------------------------------------------------------- the table
def question_table(top=1.2):
    """The table from "One system, two pictures", rebuilt at readable size. Returns (VGroup, cells dict)."""
    heads = ["Question about <i>A</i><b>x</b> = <b>b</b>", "The idea it really is", "read off from elimination as"]
    rows = [["Existence: is there\nany solution?", "Is <b>b</b> in the span of\nthe columns of <i>A</i>?"],
            ["Uniqueness: is there\nonly one?", "Are the columns of <i>A</i>\nindependent?"]]
    colx = [-4.45, 0.0, 4.3]
    widths = [4.0, 4.3, 4.1]
    rh = 1.05
    head_m = VGroup(*[P(h, 22, C_DIM).move_to(np.array([colx[k], top, 0])) for k, h in enumerate(heads)])
    cell_m = VGroup()
    for i, r in enumerate(rows):
        for k, c in enumerate(r):
            m = P(c, 22, C_W if i == 0 and k == 1 else WHITE)
            m.move_to(np.array([colx[k], top - 0.2 - rh * (i + 0.5) - 0.2, 0]))
            cell_m.add(m)
    x0, x3 = colx[0] - widths[0] / 2, colx[2] + widths[2] / 2
    y_head = top - 0.32
    rules = VGroup(Line([x0, y_head, 0], [x3, y_head, 0], color=C_DIM, stroke_width=1.5),
                   Line([x0, y_head - rh, 0], [x3, y_head - rh, 0], color=C_GRID, stroke_width=1.5),
                   *[Line([colx[k] + widths[k] / 2, top + 0.32, 0], [colx[k] + widths[k] / 2, y_head - 2 * rh, 0],
                          color=C_GRID, stroke_width=1.5) for k in (0, 1)])
    slots = [np.array([colx[2], cell_m[2 * i].get_center()[1], 0]) for i in range(2)]
    empty = VGroup(*[DashedLine(s + LEFT * 1.4 + DOWN * 0.18, s + RIGHT * 1.4 + DOWN * 0.18,
                                color=C_DIM, stroke_width=1.5, dash_length=0.08) for s in slots])
    return VGroup(head_m, cell_m, rules, empty), SimpleNamespace(slots=slots, empty=empty)


def table_answer(text, slot):
    return P(text, 22, WHITE).move_to(slot)


def rt(x, lo=0.3):
    return max(lo, x)


# =========================================================================================== the scene
class Rank(NScene):
    PARAS = [
        # ---- What the count of pivots measures
        ["Elimination on this matrix found two pivots.",
         "Because the reduced form is unique, that count belongs to A. "
         "It's called the rank of A, written rank A, or just r. What does it measure?"],
        ["All the outputs A x, that is, all combinations of the columns, form the span of the columns.",
         "That span is called the column space of A, written C of A.",
         "It lives in the output space, here R three."],
        ["The rows have a span too, the row space.",
         "A's rows are the columns of A transpose, so the row space is written C of A transpose.",
         "It lives in the input space, here R four."],
        # ---- Bases, read straight off the reduction
        ["The column space here is a plane through the origin, so a basis takes two columns.",
         "Which two?",
         "Columns one and three are the pivot columns.",
         "But should you take them from A, or from R?"],
        ["From A. "
         "R's columns lie in the floor, which isn't A's column space at all.",
         "What carries over is the relations.",
         "In R, the pivot columns are e one and e two, which are independent, and every free column is a "
         "combination of them.",
         "Lemma five says A has the same relations.",
         "So A's pivot columns are independent too, and every free column of A is built from them in the same way.",
         "They span C of A, and they're independent, so they're a basis."],
        ["For the rows it's the other way round.",
         "Take them from R. "
         "Row operations replace rows by combinations of rows, and can be reversed, so the row space never changes.",
         "The nonzero rows of R span it, and they're independent, because row k has a one in its pivot column "
         "where every other row has zero."],
        ["Here, the column space lives in R three and the row space in R four, yet both have dimension two.",
         "Both bases have one vector per pivot.",
         "The number of independent columns always equals the number of independent rows."],
        # ---- The consistency test
        ["Change the target.",
         "Keep A, and replace b by four, ten, three.",
         "Only the last entry changed.",
         "The same row operations are chosen by A alone, so they're the same steps.",
         "Track just the right-hand column.",
         "What ends up in the last row?"],
        ["Four stays four, ten becomes two, and three becomes minus one, then one.",
         "The last row now reads zeros on the left, and one on the right.",
         "Zero equals one."],
        ["This is the all-zero equation we met with hyperplanes.",
         "Once its coefficients are cleared, a row says either zero equals zero, which asks nothing, or zero "
         "equals something nonzero, which nothing satisfies.",
         "Every other row holds a pivot, so the right-hand entries of the zero rows decide everything.",
         "Here it's zero equals one, so by Theorem four the original system has no solutions.",
         "The right-hand column has received a pivot of its own.",
         "The augmented matrix has rank three, while A has rank two.",
         "And four, ten, three is not in the column space.",
         "It's off the tilted plane."],
        ["That's the consistency test.",
         "A x equals b has a solution, exactly when b is in the column space, exactly when adding b as an extra "
         "column doesn't raise the rank.",
         "The first two are the column reading of A x. "
         "For the third, reduce the augmented matrix.",
         "If its last column gets a pivot, some row reads zero equals one, and there's no solution.",
         "If it doesn't, set every free variable to zero and read each pivot variable from its row.",
         "The result is a solution."],
        # ---- One, none, or infinitely many
        ["Could a system have exactly two solutions?"],
        ["Suppose x and x prime are two different solutions.",
         "Then A times their difference is b minus b, zero.",
         "So you can add any multiple of that difference to x, and A still gives b. "
         "One extra solution forces a whole line of them.",
         "A linear system has no solution, exactly one, or infinitely many.",
         "Never two."],
        ["In the plane you can see all three.",
         "Keep the first equation, x plus two y equals four, and change the second."],
        ["With three x minus y equals five, elimination leaves minus seven y equals minus seven.",
         "One crossing, at two, one.",
         "With two x plus four y equals five, it leaves zero equals minus three.",
         "Parallel lines that never meet.",
         "With two x plus four y equals eight, it leaves zero equals zero.",
         "The second equation is the first one doubled, so the lines coincide, and every point on that line is "
         "a solution."],
        # ---- What the rank alone tells you
        ["Without solving anything, what can you say from m, n and r?"],
        ["Each pivot needs its own row and its own column.",
         "The rank can't be more than the number of rows, or the number of columns."],
        ["If every row has a pivot, r equals m, there are no zero rows, and no row can ever read zero equals one.",
         "So A x equals b has a solution for every b.",
         "That's called full row rank.",
         "It also works the other way.",
         "If some row lacks a pivot, then some b can't be reached.",
         "The four subspaces will show which ones."],
        ["If every column has a pivot, r equals n, and there are no free variables.",
         "Then a solution, when there is one, is unique.",
         "That's called full column rank.",
         "The last step of the argument comes when we look at every solution at once."],
        # ---- Rank can't be created by multiplying
        ["If you multiply two matrices, can the product have more rank than either factor?"],
        ["Each column of A B is A times a column of B, so it lies in the column space of A.",
         "The column space of A B sits inside that of A, and can't have larger dimension.",
         "On the other side, each row of A B is a combination of the rows of B, so the row space of A B sits "
         "inside that of B. "
         "By Theorem seven, row space and column space have the same dimension."],
        ["This is exactly why low-rank adaptation works.",
         "A fine-tuning update is written as a tall thin matrix times a short wide one, with inner width r.",
         "Every column of the update lies in the column space of the tall factor, so its rank is at most r. "
         "That limits how many independent directions the update can use.",
         "It doesn't limit how large the update is."],
        ["The same bound appears in attention.",
         "The score matrix, Q times K transpose, has inner width d head, so its rank is at most d head, however "
         "long the sequence.",
         "And two linear layers with nothing between them compose to one linear layer, whose rank is at most "
         "the narrower width."],
        ["One caution.",
         "Two nearly parallel lines still cross at exactly one point, so the algebra rightly reports one solution.",
         "But tilt either line slightly, and the crossing point moves a long way.",
         "The answer is exact, and still fragile.",
         "We'll come back to that when elimination runs on a real machine."],
    ]

    def construct(self):
        self.count_of_pivots()
        self.bases()
        self.consistency()
        self.one_none_many()
        self.rank_alone()
        self.product()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def count_of_pivots(self):
        A = mat(A_ROWS, 32)
        R = mat(R_ROWS, 32)
        A_g = VGroup(M("<i>A</i> =", 32), A).arrange(RIGHT, buff=0.2)
        R_g = VGroup(M("<i>R</i> =", 32), R).arrange(RIGHT, buff=0.2)
        VGroup(A_g, R_g).arrange(DOWN, buff=0.55, aligned_edge=RIGHT).move_to(np.array([-1.0, 0.6, 0]))
        arrow = Arrow(A_g.get_bottom() + DOWN * 0.02, R_g.get_top() + UP * 0.02, buff=0.05, color=C_DIM,
                      stroke_width=3, tip_length=0.15)
        arrow.next_to(R, UP, buff=0.04).set_x(A.get_x())
        piv = piv_boxes(R, [(0, 0), (1, 2)])
        counter = VGroup(P("pivots", 24, C_DIM), M("2", 44)).arrange(DOWN, buff=0.12).next_to(R, RIGHT, buff=0.7)

        d = self.say()                                   # elimination found two pivots
        self.play(FadeIn(A_g), run_time=0.8)
        self.play(TransformFromCopy(A, R), FadeIn(R_g[0]), run_time=rt(min(1.2, d * 0.35)))
        self.play(Create(piv), FadeIn(counter), run_time=rt(min(1.0, d - 2.2)))
        d = self.say()                                   # unique, so the count belongs to A; called the rank
        self.play(Indicate(A_g, color=WHITE, scale_factor=1.04), run_time=rt(min(1.4, d * 0.3)))
        self.wait(d * 0.15)
        term = P("rank:  <i>r</i> = number of pivots in the RREF", 26).next_to(VGroup(A_g, R_g), DOWN, buff=0.55)
        term.set_x(0)
        r2 = M("<i>r</i> = 2", 34).move_to(counter[1]).align_to(counter[1], LEFT)
        self.play(FadeIn(term), Transform(counter[1], r2), FadeOut(counter[0]), run_time=rt(min(1.4, d * 0.3)))
        self.pause(0.4)

        # ---- the column space
        A_s = VGroup(A_g.copy(), R_g.copy()).arrange(RIGHT, buff=0.9).scale(0.8).move_to(np.array([0, -3.05, 0]))
        o, ap = a_panel()
        out_t = P("output: where the amounts land", 22, C_DIM).move_to(np.array([3.7, 3.0, 0]))
        b4 = box4(np.array([-3.65, 0.75, 0]), w=5.6, h=3.6)
        mapA = CurvedArrow(np.array([-0.7, 2.2, 0]), np.array([1.2, 2.2, 0]), angle=-PI / 4, color=WHITE,
                           stroke_width=3, tip_length=0.18)
        mapA_l = M("<i>A</i>", 30).next_to(mapA, UP, buff=0.05)
        wash = ap.plane.copy().set_fill(C_COLW, opacity=0.32)
        CA = bglab(M("<i>C</i>(<i>A</i>)", 30, C_COL)).move_to(ap.spot)

        d = self.say()                                   # all outputs Ax: the span of the columns
        piv_s = piv_boxes(A_s[1][1], [(0, 0), (1, 2)])
        r_s = M("<i>r</i> = 2", 28).next_to(A_s, RIGHT, buff=0.5)
        self.play(FadeOut(term), ReplacementTransform(VGroup(A_g, R_g), A_s), FadeOut(arrow),
                  ReplacementTransform(piv, piv_s), ReplacementTransform(counter[1], r_s),
                  run_time=1.0)
        self.play(FadeIn(ap.ax), FadeIn(out_t), FadeIn(b4.all), Create(mapA), FadeIn(mapA_l), run_time=0.8)
        self.play(LaggedStart(*[GrowArrow(a) for a in ap.cols], lag_ratio=0.35), FadeIn(ap.labs),
                  run_time=rt(min(1.6, d - 2.0)))
        self.play(FadeIn(ap.plane), run_time=0.6)
        d = self.say()                                   # the column space, C of A
        self.play(Transform(ap.plane, wash), FadeIn(CA), run_time=rt(min(1.2, d)))
        term_c = bglab(P("column space", 22, C_COL)).next_to(CA, DOWN, buff=0.06)
        self.play(FadeIn(term_c), run_time=0.5)
        d = self.say()                                   # lives in the output space, R three
        r3 = M("ℝ<sup>3</sup>", 26, C_DIM).next_to(out_t, DOWN, buff=0.12).set_x(1.9)
        self.play(FadeIn(r3), Indicate(out_t, color=WHITE, scale_factor=1.05), run_time=rt(min(1.2, d)))
        self.pause(0.4)

        # ---- the row space
        Abot = A_s[0][1]
        rows_v = VGroup(*[column_vec(r, size=24, color=C_ROW, v_buff=0.38) for r in A_ROWS])
        rows_v.arrange(RIGHT, buff=0.45).move_to(b4.rect.get_center() + DOWN * 0.15 + LEFT * 0.4)
        rowsp = VGroup(M("<i>C</i>(<i>A</i><sup>T</sup>)", 30, C_ROW), P("row space", 22, C_ROW)) \
            .arrange(DOWN, buff=0.08).next_to(rows_v, RIGHT, buff=0.45)
        d = self.say()                                   # the rows have a span too
        rb = VGroup(*[row_box(Abot, i, C_ROW, buff=0.06) for i in range(3)])
        self.play(Create(rb), run_time=rt(min(1.2, d)))
        d = self.say()                                   # rows of A = columns of A transpose
        self.play(*[TransformFromCopy(VGroup(*Abot.entries[i]), rows_v[i]) for i in range(3)],
                  run_time=rt(min(1.6, d * 0.5)))
        self.play(FadeIn(rowsp[0]), run_time=rt(min(0.8, d * 0.3)))
        d = self.say()                                   # lives in the input space, R four
        self.play(FadeIn(rowsp[1]), Indicate(b4.space, color=WHITE, scale_factor=1.4), FadeOut(rb),
                  run_time=rt(min(1.2, d)))
        self.pause(0.6)
        self.s = SimpleNamespace(o=o, ap=ap, out_t=out_t, b4=b4, mapA=mapA, mapA_l=mapA_l, CA=CA, term_c=term_c,
                                 r3=r3, rows_v=rows_v, rowsp=rowsp, A_s=A_s, piv_s=piv_s, r_s=r_s)

    # ------------------------------------------------------------------------------------------------
    def bases(self):
        s = self.s
        Abot, Rbot = s.A_s[0][1], s.A_s[1][1]
        d = self.say()                                   # a plane: a basis takes two columns
        self.play(Indicate(s.ap.plane, color=C_COL, scale_factor=1.0), run_time=rt(min(1.2, d)))
        self.say()                                       # which two?
        self.say()                                       # columns one and three are the pivot columns
        self.say()                                       # from A, or from R?
        self.pause(3.0)                                  # ⏸ decide: A or R (no column highlights yet)

        # the two R^3 panels: A's tilted plane (left) and R's floor (right)
        shift = np.array([-7.35, 0, 0])
        oL = Obl(s.o.o + shift, *[e[:2] for e in s.o.e])
        _, rp = r_panel(center=(3.9, 0.55, 0))
        tA = P("columns of <i>A</i>", 22, C_DIM).move_to(np.array([-3.65, 3.0, 0]))
        tR = P("columns of <i>R</i>", 22, C_DIM).move_to(np.array([3.7, 3.0, 0]))
        ops = Arrow(np.array([-0.6, 1.3, 0]), np.array([1.4, 1.3, 0]), buff=0, color=C_DIM, stroke_width=3,
                    tip_length=0.18)
        ops_l = P("row operations", 22, C_DIM).next_to(ops, UP, buff=0.1)
        left_pic = VGroup(s.ap.ax, s.ap.plane, s.ap.cols, s.ap.labs, s.CA, s.term_c)
        d = self.say()                                   # from A
        self.play(FadeOut(VGroup(s.b4.all, s.rows_v, s.rowsp, s.mapA, s.mapA_l, s.r3)),
                  left_pic.animate.shift(shift), ReplacementTransform(s.out_t, tA), run_time=1.0)
        self.play(FadeIn(VGroup(rp.ax, rp.plane, tR, ops, ops_l)), run_time=0.6)
        self.play(LaggedStart(*[GrowArrow(a) for a in rp.cols], lag_ratio=0.3), FadeIn(rp.labs), run_time=0.9)
        d = 2.4                                          # (same beat) R's columns lie in the floor
        floor_l = P("the floor", 22, C_DIM).next_to(rp.plane, DOWN, buff=0.3).align_to(rp.plane, RIGHT)
        self.play(Indicate(rp.plane, color=WHITE, scale_factor=1.0), FadeIn(floor_l), run_time=rt(min(1.4, d * 0.5)))
        self.play(Indicate(s.ap.plane, color=C_COL, scale_factor=1.0), run_time=rt(min(1.2, d * 0.4)))
        d = self.say()                                   # what carries over is the relations
        rel = VGroup(M("<i>a</i><sub>2</sub> = 2<i>a</i><sub>1</sub>", 26),
                     M("<i>a</i><sub>4</sub> = <i>a</i><sub>1</sub> + 2<i>a</i><sub>3</sub>", 26)) \
            .arrange(RIGHT, buff=0.6).move_to(np.array([-3.65, -1.85, 0]))
        relR = VGroup(M("<i>r</i><sub>2</sub> = 2<i>r</i><sub>1</sub>", 26),
                      M("<i>r</i><sub>4</sub> = <i>r</i><sub>1</sub> + 2<i>r</i><sub>3</sub>", 26)) \
            .arrange(RIGHT, buff=0.6).move_to(np.array([3.7, -1.85, 0]))
        self.play(FadeIn(relR), FadeIn(rel), run_time=rt(min(1.2, d)))
        # highlight columns 1 and 3 in both panels and both matrices
        hiA = VGroup(col_box(Abot, 0), col_box(Abot, 2))
        hiR = VGroup(col_box(Rbot, 0), col_box(Rbot, 2))
        e12 = VGroup(bglab(M("<i>e</i><sub>1</sub>", 24, C_COL)).next_to(rp.cols[0].get_end(), UP, buff=0.12),
                     bglab(M("<i>e</i><sub>2</sub>", 24, C_COL)).next_to(rp.cols[2].get_end(), UP, buff=0.1))
        d = self.say()                                   # in R: pivot columns e1, e2; free columns built from them
        self.play(*[rp.cols[k].animate.set_color(C_COL) for k in (0, 2)],
                  *[rp.cols[k].animate.set_opacity(0.45) for k in (1, 3)],
                  Create(hiR), FadeIn(e12), run_time=rt(min(1.2, d * 0.4)))
        self.play(Indicate(relR, color=WHITE, scale_factor=1.06), run_time=rt(min(1.2, d * 0.4)))
        d = self.say()                                   # Lemma five: A has the same relations
        lem = P("Lemma 5:  same relations", 22, C_DIM).next_to(ops, DOWN, buff=0.15)
        self.play(FadeIn(lem), Indicate(rel, color=WHITE, scale_factor=1.06), run_time=rt(min(1.4, d)))
        d = self.say()                                   # A's pivot columns are independent too
        self.play(*[s.ap.cols[k].animate.set_color(C_COL) for k in (0, 2)],
                  *[s.ap.cols[k].animate.set_opacity(0.45) for k in (1, 3)],
                  Create(hiA), run_time=rt(min(1.4, d * 0.5)))
        d = self.say()                                   # they span C(A), independent: a basis
        self.play(Indicate(VGroup(s.ap.cols[0], s.ap.cols[2]), color=C_COL, scale_factor=1.08),
                  run_time=rt(min(1.4, d)))
        self.pause(0.4)

        # ---- Theorem 7, beside A's plane
        T = lambda t, c=WHITE: P(t, 22, c)
        th = VGroup(
            T("<b>Theorem 7.</b>  Let <i>R</i> be the RREF of <i>A</i>."),
            T("1. The pivot columns <i>of A</i> form a basis of <i>C</i>(<i>A</i>)."),
            T("     here (1, 2, 1) and (1, 4, −1)", C_COL),
            T("2. The nonzero rows <i>of R</i> form a basis"),
            T("     of the row space of <i>A</i>."),
            T("     here (1, 2, 0, 1) and (0, 0, 1, 2)", C_ROW),
            T(f"3. dim <i>C</i>(<i>A</i>) = dim <i>C</i>(<i>{AT}</i>) = <i>r</i>:  row rank equals"),
            T(f"     column rank, and rank <i>{AT}</i> = rank <i>A</i>."),
        ).arrange(DOWN, buff=0.17, aligned_edge=LEFT)
        th.move_to(np.array([3.3, 0.85, 0])).align_to(np.array([0.25, 0, 0]), LEFT)
        self.play(FadeOut(VGroup(rp.ax, rp.plane, rp.cols, rp.labs, tR, ops, ops_l, floor_l, e12, lem, relR, rel)),
                  run_time=0.6)
        self.play(FadeIn(th[:3]), run_time=0.8)

        # rows: from R
        Rrows = VGroup(row_box(Rbot, 0, C_ROW, 0.06), row_box(Rbot, 1, C_ROW, 0.06))
        d = self.say()                                   # rows: the other way round
        self.play(FadeOut(hiA), run_time=rt(min(0.6, d)))
        d = self.say()                                   # take them from R; row ops keep the row space
        self.play(Create(Rrows), FadeOut(hiR), run_time=rt(min(1.0, d * 0.2)))
        self.play(FadeIn(th[3:5]), run_time=rt(min(1.0, d * 0.3)))
        d = self.say()                                   # nonzero rows of R: span, independent
        ones = VGroup(*[Circle(radius=0.2, color=WHITE, stroke_width=2.5).move_to(Rbot.entries[i][j])
                        for i, j in ((0, 0), (1, 2))])
        self.play(FadeIn(th[5]), run_time=rt(min(1.0, d * 0.3)))
        self.play(Create(ones), run_time=rt(min(1.0, d * 0.3)))
        self.play(FadeOut(ones), run_time=0.4)
        self.pause(2.0)                                  # ⏸ read the two bases

        d = self.say()                                   # R three and R four, both dimension two
        self.play(FadeIn(th[6:]), run_time=rt(min(1.4, d)))
        d = self.say()                                   # one vector per pivot
        self.play(Indicate(s.piv_s, color=WHITE, scale_factor=1.15), Indicate(s.r_s, color=WHITE),
                  run_time=rt(min(1.4, d)))
        d = self.say()                                   # independent columns = independent rows
        self.play(Indicate(th[6:], color=WHITE, scale_factor=1.03), run_time=rt(min(1.6, d)))
        self.pause(0.6)
        self.s.oL, self.s.left_pic, self.s.tA, self.s.th, self.s.Rrows = oL, left_pic, tA, th, Rrows

    # ------------------------------------------------------------------------------------------------
    def consistency(self):
        s = self.s
        M0 = mat([["1", "2", "1", "3", "4"], ["2", "4", "4", "10", "10"], ["1", "2", "−1", "−1", "2"]], 26, aug=True,
                 h_buff=0.5, v_buff=0.44)
        M1 = mat([["1", "2", "1", "3", "4"], ["0", "0", "2", "4", "2"], ["0", "0", "−2", "−4", "−2"]], 26, aug=True,
                 h_buff=0.5, v_buff=0.44)
        M2 = mat([["1", "2", "1", "3", "4"], ["0", "0", "2", "4", "2"], ["0", "0", "0", "0", "0"]], 26, aug=True,
                 h_buff=0.5, v_buff=0.44)
        a1 = Arrow(ORIGIN, RIGHT * 1.15, buff=0, color=C_DIM, stroke_width=3, tip_length=0.15)
        a2 = a1.copy()
        row = VGroup(M0, a1, M1, a2, M2).arrange(RIGHT, buff=0.25).move_to(np.array([0, 2.75, 0]))
        op1 = VGroup(M("<i>R</i><sub>2</sub> − 2<i>R</i><sub>1</sub>", 24, C_DIM),
                     M("<i>R</i><sub>3</sub> − <i>R</i><sub>1</sub>", 24, C_DIM)).arrange(DOWN, buff=0.08)
        op1.next_to(a1, DOWN, buff=0.12)
        op2 = M("<i>R</i><sub>3</sub> + <i>R</i><sub>2</sub>", 24, C_DIM).next_to(a2, DOWN, buff=0.12)
        for m in (M0, M1, M2):
            for i in range(3):
                m.entries[i][4].set_color(C_W)

        # the picture changes: matrices row at the top, A's plane stays for later
        self.play(FadeOut(VGroup(s.left_pic, s.tA, s.th, s.Rrows, s.piv_s, s.r_s, s.A_s[1])),
                  ReplacementTransform(s.A_s[0][1], M0), FadeOut(s.A_s[0][0]), run_time=1.0)
        self.play(FadeIn(VGroup(a1, op1, M1, a2, op2, M2)), run_time=1.0)
        zrow = row_box(M2, 2, WHITE, 0.06)
        self.play(Create(zrow), run_time=0.6)
        self.play(FadeOut(zrow), run_time=0.4)

        d = self.say()                                   # change the target
        self.play(Indicate(VGroup(*[M0.entries[i][4] for i in range(3)]), color=C_W), run_time=rt(min(1.0, d)))
        new3 = M("3", 26, C_W).move_to(M0.entries[2][4])
        qs = VGroup(*[M("?", 26, C_DIM).move_to(m.entries[i][4]) for m in (M1, M2) for i in range(3)])
        old_rhs = VGroup(*[m.entries[i][4] for m in (M1, M2) for i in range(3)])
        d = self.say()                                   # replace b by 4, 10, 3
        self.play(Transform(M0.entries[2][4], new3), FadeOut(old_rhs), FadeIn(qs), run_time=rt(min(1.2, d)))
        d = self.say()                                   # only the last entry changed
        ring = Circle(radius=0.22, color=C_W, stroke_width=3).move_to(M0.entries[2][4])
        self.play(Create(ring), run_time=rt(min(0.8, d)))
        d = self.say()                                   # same row operations, chosen by A alone
        self.play(FadeOut(ring), Indicate(VGroup(op1, op2), color=WHITE), run_time=rt(min(1.4, d)))
        d = self.say()                                   # track just the right-hand column
        rhsbox = SurroundingRectangle(VGroup(*[M0.entries[i][4] for i in range(3)]), color=C_W, buff=0.08,
                                      corner_radius=0.05, stroke_width=2.5)
        self.play(Create(rhsbox), run_time=rt(min(0.8, d)))
        self.say()                                       # what ends up in the last row?
        self.pause(3.0)                                  # ⏸ follow the right-hand column

        c1 = M("(4, 10, 3)  →  (4, 10 − 8, 3 − 4) = (4, 2, −1)", 28).move_to(np.array([0, 1.1, 0]))
        c2 = M("→  (4, 2, −1 + 2) = (4, 2, 1)", 28).next_to(c1, DOWN, buff=0.22).align_to(c1, RIGHT)
        fill1 = VGroup(*[M(v, 26, C_W).move_to(M1.entries[i][4]) for i, v in enumerate(["4", "2", "−1"])])
        fill2 = VGroup(*[M(v, 26, C_W).move_to(M2.entries[i][4]) for i, v in enumerate(["4", "2", "1"])])
        d = self.say()                                   # four stays four, ten becomes two, three: -1, then 1
        self.play(FadeOut(rhsbox), FadeIn(c1), ReplacementTransform(qs[:3], fill1), run_time=rt(min(1.8, d * 0.5)))
        self.play(FadeIn(c2), ReplacementTransform(qs[3:], fill2), run_time=rt(min(1.4, d * 0.4)))
        d = self.say()                                   # last row: zeros on the left, one on the right
        lastrow = row_box(M2, 2, WHITE, 0.07)
        self.play(Create(lastrow), run_time=rt(min(1.0, d)))
        d = self.say()                                   # zero equals one
        z1 = M("0 = 1", 30).next_to(lastrow, DOWN, buff=0.15)
        self.play(FadeIn(z1), run_time=rt(min(0.8, d)))
        self.pause(1.5)                                  # ⏸ read the impossible row

        d = self.say()                                   # the all-zero equation from hyperplanes
        self.play(Indicate(z1, color=WHITE), run_time=rt(min(1.2, d)))
        d = self.say()                                   # 0 = 0 asks nothing; 0 = nonzero, nothing satisfies
        cases = VGroup(M("0 = 0", 28), P("asks nothing", 22, C_DIM), M("0 = <i>c</i> ≠ 0", 28),
                       P("nothing satisfies it", 22, C_DIM))
        cases_g = VGroup(VGroup(cases[0], cases[1]).arrange(RIGHT, buff=0.3),
                         VGroup(cases[2], cases[3]).arrange(RIGHT, buff=0.3)).arrange(DOWN, buff=0.2,
                                                                                     aligned_edge=LEFT)
        cases_g.move_to(np.array([-3.4, -1.0, 0]))
        self.play(FadeIn(cases_g[0]), run_time=rt(min(1.0, d * 0.4)))
        self.play(FadeIn(cases_g[1]), run_time=rt(min(1.0, d * 0.4)))
        d = self.say()                                   # every other row holds a pivot
        pv = piv_boxes(M2, [(0, 0), (1, 2)])
        self.play(Create(pv), run_time=rt(min(1.0, d * 0.5)))
        self.play(Indicate(fill2[2], color=C_W, scale_factor=1.5), run_time=rt(min(1.0, d * 0.4)))
        d = self.say()                                   # here 0 = 1: no solutions (Theorem 4)
        nos = P("no solutions", 22, WHITE).next_to(z1, LEFT, buff=0.4)
        self.play(FadeIn(nos), Indicate(cases_g[1], color=WHITE, scale_factor=1.04), run_time=rt(min(1.2, d)))
        d = self.say()                                   # the right-hand column has a pivot of its own
        p3 = SurroundingRectangle(fill2[2], color=WHITE, buff=0.08, stroke_width=2.5, corner_radius=0.04)
        self.play(FadeOut(lastrow), Create(p3), run_time=rt(min(1.0, d)))
        d = self.say()                                   # rank 3 versus rank 2
        ranks = VGroup(M("rank [<i>A</i> | <b>b</b>] = 3", 28), M("rank <i>A</i> = 2", 28)).arrange(RIGHT, buff=0.8)
        ranks.arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to(np.array([-3.6, 0.35, 0]))
        self.play(FadeOut(VGroup(c1, c2, cases_g)), FadeIn(ranks), run_time=rt(min(1.4, d)))
        # the R^3 output panel returns: b on the plane, the new target above it
        o, ap = a_panel(center=(3.9, -1.75, 0))
        wash = ap.plane.set_fill(C_COLW, opacity=0.32)
        b_old = Dot(o.p(4, 10, 2), radius=0.08, color=C_W).set_opacity(0.55)
        b_new = Dot(o.p(4, 10, 3), radius=0.09, color=C_W)
        drop = DashedLine(o.p(4, 10, 3), o.p(4, 10, 2), color=C_W, stroke_width=2.5, dash_length=0.06)
        bl_old = bglab(M("(4, 10, 2)", 22, C_W)).next_to(b_old, RIGHT, buff=0.12)
        bl_new = bglab(M("(4, 10, 3)", 22, C_W)).next_to(b_new, RIGHT, buff=0.12)
        CA = bglab(M("<i>C</i>(<i>A</i>)", 26, C_COL)).move_to(ap.spot + np.array([0.3, -0.25, 0]))
        outt = P("output: where the amounts land", 22, C_DIM).next_to(VGroup(ap.ax, ap.plane), UP, buff=0.05) \
            .set_x(3.9)
        d = self.say()                                   # 4, 10, 3 is not in the column space
        self.play(FadeOut(VGroup(nos, cases_g)), FadeIn(VGroup(ap.ax, wash, ap.cols, outt, CA)),
                  run_time=rt(min(1.2, d * 0.5)))
        self.play(FadeIn(b_old), FadeIn(bl_old), run_time=rt(min(0.8, d * 0.4)))
        d = self.say()                                   # off the tilted plane
        self.play(FadeIn(b_new), Create(drop), FadeIn(bl_new), FadeOut(bl_old), run_time=rt(min(1.2, d)))

        # ---- Theorem 8
        th = VGroup(P("<b>Theorem 8.</b>  These are equivalent:", 22),
                    P("(a)  <i>A</i><b>x</b> = <b>b</b> has a solution", 22),
                    P("(b)  <b>b</b> ∈ <i>C</i>(<i>A</i>)", 22),
                    P("(c)  rank <i>A</i> = rank [<i>A</i> | <b>b</b>]", 22)).arrange(DOWN, buff=0.18, aligned_edge=LEFT)
        th.move_to(np.array([-3.6, -1.75, 0]))
        d = self.say()                                   # that's the consistency test
        self.play(FadeIn(th[0]), run_time=rt(min(1.0, d)))
        d = self.say()                                   # (a) <=> (b) <=> (c)
        self.play(FadeIn(th[1]), run_time=rt(d * 0.25))
        self.play(FadeIn(th[2]), run_time=rt(d * 0.25))
        self.play(FadeIn(th[3]), run_time=rt(d * 0.25))
        d = self.say()                                   # first two: the column reading of Ax
        self.play(Indicate(th[1:3], color=WHITE, scale_factor=1.04), Indicate(wash, color=C_COL, scale_factor=1.0),
                  run_time=rt(min(1.4, d * 0.4)))
        self.play(Indicate(th[3], color=WHITE, scale_factor=1.04), Indicate(M2, color=WHITE, scale_factor=1.03),
                  run_time=rt(min(1.4, d * 0.4)))
        d = self.say()                                   # last column gets a pivot: 0 = 1, no solution
        self.play(Indicate(VGroup(p3, fill2[2]), color=WHITE, scale_factor=1.3), Indicate(z1, color=WHITE),
                  run_time=rt(min(1.4, d)))
        d = self.say()                                   # if not: free variables zero, read pivot variables
        self.play(Indicate(pv, color=WHITE, scale_factor=1.2), run_time=rt(min(1.4, d)))
        self.say()                                       # the result is a solution
        self.pause(0.6)

        # ---- the table returns: its first row fills in
        tab, tk = question_table(top=1.6)
        ans1 = table_answer("no pivot in the\nright-hand column", tk.slots[0])
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)
        self.play(FadeIn(tab), run_time=0.8)
        self.play(ReplacementTransform(tk.empty[0], ans1), run_time=0.8)
        self.tab, self.tk = tab, tk
        self.tab.add(ans1)

    # ------------------------------------------------------------------------------------------------
    def one_none_many(self):
        self.say()                                       # could there be exactly two solutions?
        self.pause(3.0)                                  # ⏸ decide (no line, no equation on screen)

        pin, tin = panel(LEFT_C + UP * 0.1, "input: the amounts <b>x</b>")
        pout, tout = panel(RIGHT_C + UP * 0.1, "output: where the amounts land")
        b = dot(pout, 2, 4, C_W, r=0.1)
        bl = M("<b>b</b>", 30, C_W).next_to(b, RIGHT, buff=0.12)
        X, Xp = (1, 1.5), (2.5, 2.5)
        x = dot(pin, *X, WHITE, r=0.09)
        xp = dot(pin, *Xp, WHITE, r=0.09)
        xl = bglab(M("<b>x</b>", 28)).next_to(x, DR, buff=0.06)
        xpl = bglab(M("<b>x</b>′", 28)).next_to(xp, DR, buff=0.06)

        def arc_to_b(pt):
            return CurvedArrow(pt + UP * 0.1, b.get_center() + LEFT * 0.15, angle=-PI / 5, color=WHITE,
                               stroke_width=3, tip_length=0.18)

        arcs = VGroup(arc_to_b(x.get_center()), arc_to_b(xp.get_center()))
        Al = bglab(M("<i>A</i>", 30)).move_to(arcs[1].point_from_proportion(0.5) + UP * 0.32)
        d = self.say()                                   # suppose x and x' are two solutions
        self.play(FadeOut(self.tab), run_time=0.5)
        self.play(FadeIn(VGroup(pin, tin, pout, tout)), FadeIn(b), FadeIn(bl), run_time=0.7)
        self.play(FadeIn(x), FadeIn(xl), FadeIn(xp), FadeIn(xpl), run_time=0.5)
        self.play(Create(arcs), FadeIn(Al), run_time=rt(min(1.2, d - 1.7)))
        diff = Arrow(pin.c2p(*Xp), pin.c2p(*X), buff=0, color=WHITE, stroke_width=4, tip_length=0.18)
        eq1 = M("<i>A</i>(<b>x</b> − <b>x</b>′) = <b>b</b> − <b>b</b> = <b>0</b>", 32).move_to(np.array([0, 3.35, 0]))
        d = self.say()                                   # A(x - x') = b - b = 0
        self.play(GrowArrow(diff), run_time=rt(min(0.8, d * 0.4)))
        self.play(FadeIn(eq1), run_time=rt(min(1.0, d * 0.4)))
        eq2 = M("⇒  <i>A</i>(<b>x</b> + <i>t</i>(<b>x</b> − <b>x</b>′)) = <b>b</b>   for every real <i>t</i>", 32)
        eq2.next_to(eq1, DOWN, buff=0.2)
        dirv = np.array(X) - np.array(Xp)
        mover = Dot(pin.c2p(*X), radius=0.09, color=WHITE)
        mv_arc = always_redraw(lambda: arc_to_b(mover.get_center()))
        d = self.say()                                   # add any multiple of the difference
        self.play(FadeIn(eq2), run_time=rt(min(1.0, d * 0.3)))
        self.add(mover, mv_arc)
        self.play(mover.animate.move_to(pin.c2p(*(np.array(X) + 0.8 * dirv))), run_time=rt(d * 0.2))
        self.play(mover.animate.move_to(pin.c2p(*(np.array(X) - 1.6 * dirv))), run_time=rt(d * 0.2))
        line = Line(pin.c2p(*(np.array(X) + 0.95 * dirv)), pin.c2p(*(np.array(X) - 2.0 * dirv)), color=WHITE,
                    stroke_width=4)
        self.play(Create(line), FadeOut(mover), FadeOut(mv_arc), run_time=rt(min(1.2, d * 0.2)))

        # the three-row table
        heads = ["Reduced form of [<i>A</i> | <b>b</b>] shows", "Outcome", "Solution set"]
        rows = [["a pivot in the right-hand column", "no solution", "empty:  <b>b</b> ∉ <i>C</i>(<i>A</i>)"],
                ["no pivot there, no free columns", "exactly one", "a point"],
                ["no pivot there, <i>k</i> free columns", "infinitely many", "a <i>k</i>-dimensional affine set"]]
        cx = [-3.55, 0.85, 4.25]
        top = 3.45
        hm = VGroup(*[P(h, 22, C_DIM).move_to([cx[k], top, 0]) for k, h in enumerate(heads)])
        cm = VGroup(*[VGroup(*[P(c, 22).move_to([cx[k], top - 0.5 - 0.42 * i, 0]) for k, c in enumerate(r)])
                      for i, r in enumerate(rows)])
        rule = Line([-6.5, top - 0.25, 0], [6.6, top - 0.25, 0], color=C_DIM, stroke_width=1.5)
        tbl = VGroup(hm, rule, cm)
        d = self.say()                                   # none, one, or infinitely many
        self.play(FadeOut(VGroup(pin, tin, pout, tout, b, bl, x, xl, xp, xpl, arcs, Al, diff, line, eq1, eq2)),
                  run_time=0.6)
        self.play(FadeIn(VGroup(hm, rule)), run_time=0.4)
        for r in cm:
            self.play(FadeIn(r), run_time=rt((d - 1.2) / 3, 0.3))
        self.say()                                       # never two
        self.pause(0.4)

        # three small panels, same first line x + 2y = 4
        cxs = [-4.5, 0, 4.5]
        pans = []
        for k in range(3):
            p = plane((-1, 5), (-2, 3), unit=0.46).move_to(np.array([cxs[k], -0.95, 0]))
            pans.append(p)
        L1 = [Line(p.c2p(-1, 2.5), p.c2p(5, -0.5), color=C_L1, stroke_width=4) for p in pans]
        e1s = [M("<i>x</i> + 2<i>y</i> = 4", 26, C_L1) for _ in pans]
        e2s = [M("3<i>x</i> − <i>y</i> = 5", 26, C_L2), M("2<i>x</i> + 4<i>y</i> = 5", 26, C_L2),
               M("2<i>x</i> + 4<i>y</i> = 8", 26, C_L2)]
        heads_p = []
        for k, p in enumerate(pans):
            g = VGroup(e1s[k], e2s[k]).arrange(RIGHT, buff=0.4).next_to(p, UP, buff=0.12)
            heads_p.append(g)
        d = self.say()                                   # in the plane you can see all three
        self.play(*[Create(p) for p in pans], run_time=rt(min(1.2, d)))
        d = self.say()                                   # keep x + 2y = 4, change the second
        self.play(*[Create(l) for l in L1], *[FadeIn(e) for e in e1s], run_time=rt(min(1.4, d)))
        L2 = [Line(pans[0].c2p(0.5, -1.5), pans[0].c2p(2.6, 2.8), color=C_L2, stroke_width=4),
              Line(pans[1].c2p(-1, 1.75), pans[1].c2p(5, -1.25), color=C_L2, stroke_width=4),
              DashedLine(pans[2].c2p(-1, 2.5), pans[2].c2p(5, -0.5), color=C_L2, stroke_width=5, dash_length=0.14)]
        ops = [VGroup(M("<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − 3<i>R</i><sub>1</sub>:  −7<i>y</i> = −7", 24),
                      M("<i>y</i> = 1,  <i>x</i> = 2", 24)),
               VGroup(M("<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − 2<i>R</i><sub>1</sub>:  0 = −3", 24)),
               VGroup(M("<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − 2<i>R</i><sub>1</sub>:  0 = 0", 24),
                      M("<i>y</i> = <i>t</i>,  <i>x</i> = 4 − 2<i>t</i>", 24))]
        for k, g in enumerate(ops):
            g.arrange(DOWN, buff=0.1).next_to(pans[k], DOWN, buff=0.15)
        cross = Dot(pans[0].c2p(2, 1), radius=0.08, color=WHITE)
        crossl = bglab(M("(2, 1)", 22)).next_to(cross, RIGHT, buff=0.1)
        d = self.say()                                   # 3x - y = 5: -7y = -7
        self.play(FadeIn(e2s[0]), Create(L2[0]), run_time=rt(min(1.2, d * 0.4)))
        self.play(FadeIn(ops[0][0]), run_time=rt(min(1.0, d * 0.4)))
        d = self.say()                                   # one crossing at (2, 1)
        self.play(FadeIn(ops[0][1]), FadeIn(cross), FadeIn(crossl), run_time=rt(min(1.0, d)))
        d = self.say()                                   # 2x + 4y = 5: 0 = -3
        self.play(FadeIn(e2s[1]), Create(L2[1]), run_time=rt(min(1.2, d * 0.4)))
        self.play(FadeIn(ops[1]), run_time=rt(min(1.0, d * 0.4)))
        d = self.say()                                   # parallel, never meet
        self.play(Indicate(VGroup(L1[1], L2[1]), color=WHITE, scale_factor=1.0), run_time=rt(min(1.2, d)))
        d = self.say()                                   # 2x + 4y = 8: 0 = 0
        self.play(FadeIn(e2s[2]), Create(L2[2]), run_time=rt(min(1.2, d * 0.4)))
        self.play(FadeIn(ops[2][0]), run_time=rt(min(1.0, d * 0.4)))
        d = self.say()                                   # the lines coincide: every point is a solution
        self.play(FadeIn(ops[2][1]), run_time=rt(min(1.0, d * 0.3)))
        self.play(Indicate(VGroup(L1[2], L2[2]), color=WHITE, scale_factor=1.0), run_time=rt(min(1.4, d * 0.5)))
        self.pause(2.0)                                  # ⏸ match each panel to its row
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def rank_alone(self):
        def block(m, n, pivots, cell=0.5, center=ORIGIN):
            g = VGroup()
            for i in range(m):
                for j in range(n):
                    sq = Square(cell, stroke_color=C_GRID, stroke_width=1.5, fill_color="#3A4150",
                                fill_opacity=0.55).move_to(np.array([j * cell, -i * cell, 0]))
                    g.add(sq)
            outline = Rectangle(width=n * cell, height=m * cell, stroke_color=C_DIM, stroke_width=2).move_to(g)
            dots = VGroup(*[Dot(np.array([j * cell, -i * cell, 0]), radius=0.12, color=WHITE) for i, j in pivots])
            res = VGroup(g, outline, dots)
            res.move_to(center)
            res.cell = cell
            res.dots = dots
            res.cells = g
            res.mn = (m, n)
            return res

        def dims(blk, m, n):
            mm = M(m, 28, C_DIM).next_to(blk[1], LEFT, buff=0.15)
            nn = M(n, 28, C_DIM).next_to(blk[1], UP, buff=0.12)
            return VGroup(mm, nn)

        def row_shade(blk, i, color=C_DIM):
            m, n = blk.mn
            cells = VGroup(*[blk.cells[i * n + j] for j in range(n)])
            return SurroundingRectangle(cells, buff=0.0, stroke_color=color, stroke_width=3)

        gen = block(4, 6, [(0, 0), (1, 2), (2, 3)], center=np.array([-4.6, 1.4, 0]))
        gdim = dims(gen, "<i>m</i>", "<i>n</i>")
        d = self.say()                                   # without solving: what from m, n and r?
        self.play(FadeIn(gen[:2]), FadeIn(gdim), run_time=rt(min(1.0, d * 0.4)))
        self.play(LaggedStart(*[FadeIn(dt, scale=0.5) for dt in gen.dots], lag_ratio=0.4), run_time=rt(min(1.2, d * 0.4)))
        rlab = M("<i>r</i> = 3", 30).next_to(gen[1], DOWN, buff=0.3)
        self.play(FadeIn(rlab), run_time=0.5)
        # each pivot: its own row and column
        d = self.say()                                   # own row, own column
        guides = VGroup()
        for i, j in [(0, 0), (1, 2), (2, 3)]:
            c = gen.cell
            p0 = gen.dots[[(0, 0), (1, 2), (2, 3)].index((i, j))].get_center()
            guides.add(DashedLine(p0, np.array([gen[1].get_left()[0], p0[1], 0]), color=WHITE, stroke_width=2,
                                  dash_length=0.06),
                       DashedLine(p0, np.array([p0[0], gen[1].get_top()[1], 0]), color=WHITE, stroke_width=2,
                                  dash_length=0.06))
        self.play(Create(guides), run_time=rt(min(1.4, d)))
        d = self.say()                                   # r can't exceed rows or columns
        ineq = M("<i>r</i> ≤ min(<i>m</i>, <i>n</i>)", 30).next_to(rlab, DOWN, buff=0.25)
        self.play(FadeOut(guides), FadeIn(ineq), run_time=rt(min(1.2, d)))
        self.pause(0.4)

        wide = block(3, 6, [(0, 0), (1, 2), (2, 4)], center=np.array([0.0, 1.65, 0]))
        wdim = dims(wide, "<i>m</i>", "<i>n</i>")
        wl = VGroup(P("full row rank", 24, WHITE), M("<i>r</i> = <i>m</i>  ⇔  <i>A</i><b>x</b> = <b>b</b>", 26),
                    M("solvable for every <b>b</b>", 26)).arrange(DOWN, buff=0.12)
        wl.next_to(wide[1], DOWN, buff=0.3).set_y(-1.6)
        d = self.say()                                   # every row a pivot: no zero rows, no 0 = 1
        self.play(FadeIn(wide[:2]), FadeIn(wdim), run_time=rt(min(1.0, d * 0.3)))
        self.play(LaggedStart(*[FadeIn(dt, scale=0.5) for dt in wide.dots], lag_ratio=0.4),
                  run_time=rt(min(1.2, d * 0.3)))
        d = self.say()                                   # Ax = b solvable for every b
        self.play(FadeIn(wl[1:]), run_time=rt(min(1.2, d)))
        d = self.say()                                   # full row rank
        self.play(FadeIn(wl[0]), run_time=rt(min(0.8, d)))
        d = self.say()                                   # the other way
        self.wait(max(0, d - 0.1))
        zr = row_shade(gen, 3, WHITE)
        d = self.say()                                   # some row lacks a pivot: some b can't be reached
        self.play(Create(zr), run_time=rt(min(1.0, d * 0.5)))
        d = self.say()                                   # the four subspaces will show which
        self.play(FadeOut(zr), run_time=rt(min(0.6, d)))

        tall = block(5, 3, [(0, 0), (1, 1), (2, 2)], center=np.array([4.6, 1.4, 0]))
        tdim = dims(tall, "<i>m</i>", "<i>n</i>")
        tl = VGroup(P("full column rank", 24, WHITE), M("<i>r</i> = <i>n</i>  ⇔  no free columns", 26),
                    M("⇔  a solution, when it exists,", 26), M("is unique", 26)).arrange(DOWN, buff=0.12)
        tl.next_to(tall[1], DOWN, buff=0.3).set_y(-1.6)
        d = self.say()                                   # every column a pivot: r = n, no free variables
        self.play(FadeIn(tall[:2]), FadeIn(tdim), run_time=rt(min(1.0, d * 0.35)))
        self.play(LaggedStart(*[FadeIn(dt, scale=0.5) for dt in tall.dots], lag_ratio=0.4),
                  run_time=rt(min(1.2, d * 0.35)))
        self.play(FadeIn(tl[1]), run_time=rt(min(0.8, d * 0.2)))
        d = self.say()                                   # a solution is unique
        self.play(FadeIn(tl[2:]), run_time=rt(min(1.0, d)))
        d = self.say()                                   # full column rank
        self.play(FadeIn(tl[0]), run_time=rt(min(0.8, d)))
        d = self.say()                                   # last step: every solution at once
        self.play(FadeOut(VGroup(gen, gdim, rlab, ineq, wide, wdim, wl, tall, tdim, tl)), run_time=0.6)
        self.play(FadeIn(self.tab), run_time=0.7)
        ans2 = table_answer("no free columns", self.tk.slots[1])
        self.play(ReplacementTransform(self.tk.empty[1], ans2), run_time=rt(min(1.0, d - 1.4)))
        self.pause(1.2)
        self.play(FadeOut(self.tab), FadeOut(ans2), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def product(self):
        # three panels: input, middle, output; B then A
        def sbox(c, title, space):
            r = RoundedRectangle(width=2.5, height=2.6, corner_radius=0.18, stroke_color="#5B6475",
                                 stroke_width=2).move_to(c)
            t = P(title, 22, C_DIM).next_to(r, UP, buff=0.15)
            sp = M(space, 26, C_DIM).next_to(r.get_corner(UL), DR, buff=0.12)
            return VGroup(r, t, sp)

        bi = sbox(np.array([-5.45, 1.0, 0]), "input", "ℝ<sup><i>n</i></sup>")
        bm = sbox(np.array([-1.85, 1.0, 0]), "middle", "ℝ<sup><i>k</i></sup>")
        o, ap = a_panel(center=(3.75, 0.8, 0))
        outt = P("output", 22, C_DIM).move_to(np.array([3.75, 2.55, 0]))
        CA = bglab(M("<i>C</i>(<i>A</i>)", 28, C_COL)).move_to(ap.spot + np.array([0.3, -0.2, 0]))
        arB = Arrow(bi[0].get_right(), bm[0].get_left(), buff=0.1, color=WHITE, stroke_width=3, tip_length=0.18)
        arA = Arrow(bm[0].get_right(), np.array([1.35, 1.0, 0]), buff=0.1, color=WHITE, stroke_width=3,
                    tip_length=0.18)
        lB = M("<i>B</i>", 30).next_to(arB, UP, buff=0.08)
        lA = M("<i>A</i>", 30).next_to(arA, UP, buff=0.08)
        wash = ap.plane.set_fill(C_COLW, opacity=0.3)
        d = self.say()                                   # can the product have more rank?
        self.play(FadeIn(VGroup(bi, bm, arB, lB, arA, lA)), run_time=rt(min(1.2, d * 0.4)))
        self.play(FadeIn(VGroup(ap.ax, wash, outt, CA)), run_time=rt(min(1.2, d * 0.4)))
        self.pause(3.0)                                  # ⏸ predict (no AB columns, no C(AB))

        # columns of AB: e_j -> B e_j -> A B e_j, landing in the plane
        ci, cm = bi[0].get_center() + DOWN * 0.15, bm[0].get_center() + DOWN * 0.15
        ein = VGroup(*[Arrow(ci, ci + v, buff=0, color=WHITE, stroke_width=4, tip_length=0.14)
                       for v in (RIGHT * 0.8, UP * 0.8, np.array([-0.55, -0.45, 0]))])
        emid = VGroup(*[Arrow(cm, cm + v, buff=0, color=WHITE, stroke_width=4, tip_length=0.14)
                        for v in (np.array([0.7, 0.3, 0]), np.array([-0.3, 0.8, 0]), np.array([0.5, -0.6, 0]))])
        ab_vecs = [(1, 3, 0), (-0.5, -1.5, 0), (1.5, 4.5, 0)]
        ab = VGroup(*[o.arrow(v, C_U, 5) for v in ab_vecs])
        cab = Line(o.p(-1, -3, 0), o.p(2.3, 6.9, 0), color=C_U, stroke_width=3)
        cabl = bglab(M("<i>C</i>(<i>AB</i>)", 26, C_U)).next_to(o.p(2.3, 6.9, 0), UP, buff=0.08)
        d = self.say()                                   # each column of AB is A times a column of B
        self.play(FadeIn(ein), run_time=rt(d * 0.2))
        self.play(TransformFromCopy(ein, emid), run_time=rt(d * 0.3))
        self.play(TransformFromCopy(emid, ab), run_time=rt(d * 0.35))
        d = self.say()                                   # C(AB) inside C(A)
        self.play(Create(cab), FadeIn(cabl), run_time=rt(min(1.4, d * 0.6)))
        th = VGroup(M("<b>Theorem 9.</b>   rank(<i>AB</i>) ≤ min(rank <i>A</i>, rank <i>B</i>)", 30),
                    M("<i>C</i>(<i>AB</i>) ⊆ <i>C</i>(<i>A</i>)", 28),
                    M("row space of <i>AB</i> ⊆ row space of <i>B</i>", 28))
        th[1:].arrange(RIGHT, buff=1.0)
        th.arrange(DOWN, buff=0.25).move_to(np.array([0, -2.75, 0]))
        self.play(FadeIn(th[1]), run_time=rt(min(0.8, d * 0.3)))
        d = self.say()                                   # rows of AB: combinations of rows of B
        self.play(FadeIn(th[2]), Indicate(VGroup(bm, arB, lB), color=WHITE, scale_factor=1.03),
                  run_time=rt(min(1.4, d * 0.4)))
        self.wait(d * 0.3)
        self.play(FadeIn(th[0]), run_time=rt(min(1.2, d * 0.2)))
        self.pause(2.0)                                  # ⏸ read both containments
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)

        # ---- low-rank adaptation
        GREY = "#3A4150"
        W = Rectangle(width=2.6, height=2.6, stroke_color=C_DIM, stroke_width=2, fill_color=GREY, fill_opacity=0.9)
        Wl = M("<i>W</i>", 32)
        dW = Rectangle(width=2.6, height=2.6, stroke_color=C_DIM, stroke_width=2, fill_color=GREY, fill_opacity=0.5)
        Bt = Rectangle(width=0.5, height=2.6, stroke_color=C_U, stroke_width=2, fill_color=C_U, fill_opacity=0.35)
        Aw = Rectangle(width=2.6, height=0.5, stroke_color=C_DIM, stroke_width=2, fill_color=GREY, fill_opacity=0.9)
        plus, eq = M("+", 40), M("=", 40)
        row = VGroup(W, plus, dW, eq, Bt, Aw).arrange(RIGHT, buff=0.35)
        Aw.align_to(Bt, UP)
        row.move_to(np.array([0, 1.3, 0]))
        Wl.move_to(W)
        dWl = bglab(M("Δ<i>W</i> = <i>BA</i>", 30)).next_to(dW, DOWN, buff=0.2)
        Bl = M("<i>B</i>", 30, C_U).next_to(Bt, DOWN, buff=0.15)
        Al = M("<i>A</i>", 30).move_to(Aw)
        rB = M("<i>r</i>", 28, C_DIM).next_to(Bt, UP, buff=0.1)
        rA = M("<i>r</i>", 28, C_DIM).next_to(Aw, RIGHT, buff=0.12)
        stripes = VGroup(*[Rectangle(width=0.2, height=2.5, stroke_width=0, fill_color=C_U, fill_opacity=0.35)
                           .move_to(dW.get_left() + RIGHT * (0.2 + 0.3 * k)) for k in range(8)])
        d = self.say()                                   # why low-rank adaptation works
        self.play(FadeIn(W), FadeIn(Wl), run_time=rt(min(1.2, d)))
        d = self.say()                                   # tall thin times short wide, inner width r
        self.play(FadeIn(VGroup(plus, dW, dWl, eq)), run_time=rt(d * 0.3))
        self.play(FadeIn(VGroup(Bt, Bl, rB)), run_time=rt(d * 0.25))
        self.play(FadeIn(VGroup(Aw, Al, rA)), run_time=rt(d * 0.25))
        d = self.say()                                   # every column in C(B): rank at most r
        b1 = M("rank(Δ<i>W</i>) = rank(<i>BA</i>) ≤ <i>r</i>", 30).move_to(np.array([0, -1.75, 0]))
        colsl = bglab(P("every column in <i>C</i>(<i>B</i>)", 22, C_U)).next_to(dWl, DOWN, buff=0.12)
        self.play(LaggedStart(*[FadeIn(s_) for s_ in stripes], lag_ratio=0.15), FadeIn(colsl),
                  run_time=rt(min(1.6, d * 0.35)))
        self.play(FadeIn(b1), run_time=rt(min(1.0, d * 0.2)))
        self.wait(d * 0.15)
        self.play(Indicate(VGroup(rB, rA), color=WHITE, scale_factor=1.4), run_time=rt(min(1.2, d * 0.2)))
        d = self.say()                                   # not size
        self.play(dW.animate.set_fill(GREY, opacity=0.9), stripes.animate.set_fill(C_U, opacity=0.75),
                  run_time=rt(min(1.0, d * 0.5)))
        self.play(stripes.animate.set_fill(C_U, opacity=0.35), dW.animate.set_fill(GREY, opacity=0.5),
                  run_time=rt(min(1.0, d * 0.4)))

        # ---- attention, then two layers
        d = self.say()                                   # the same bound in attention
        Ql, Kl = M("<i>Q</i>", 30, C_U).move_to(Bl), M("<i>K</i><sup>T</sup>", 30).move_to(Al)
        dq1, dq2 = M("<i>d</i><sub>head</sub>", 26, C_DIM).move_to(rB), \
            M("<i>d</i><sub>head</sub>", 26, C_DIM).next_to(Aw, RIGHT, buff=0.12)
        sc = bglab(M("scores = <i>QK</i><sup>T</sup>", 30)).move_to(dWl)
        self.play(FadeOut(VGroup(W, Wl, plus, colsl)), Transform(Bl, Ql), Transform(Al, Kl),
                  Transform(rB, dq1), Transform(rA, dq2), Transform(dWl, sc), run_time=rt(min(1.4, d)))
        b2 = M("rank(<i>QK</i><sup>T</sup>) ≤ <i>d</i><sub>head</sub>", 30).next_to(b1, DOWN, buff=0.22)
        d = self.say()                                   # rank at most d_head, however long the sequence
        self.play(FadeIn(b2), run_time=rt(min(1.0, d * 0.3)))
        seq = VGroup(dW, stripes)
        self.play(Indicate(seq, color=WHITE, scale_factor=1.05), run_time=rt(min(1.4, d * 0.4)))
        d = self.say()                                   # two linear layers: rank at most the narrower width
        b3_ = M("rank(<i>W</i><sub>2</sub><i>W</i><sub>1</sub>) ≤ min(width of <i>W</i><sub>1</sub>, "
                "width of <i>W</i><sub>2</sub>)", 30).next_to(b2, DOWN, buff=0.22)
        W2l, W1l = M("<i>W</i><sub>2</sub>", 30, C_U).move_to(Bl), M("<i>W</i><sub>1</sub>", 30).move_to(Al)
        sc2 = bglab(M("<i>W</i><sub>2</sub><i>W</i><sub>1</sub>", 30)).move_to(dWl)
        self.play(Transform(Bl, W2l), Transform(Al, W1l), Transform(dWl, sc2),
                  FadeOut(rB), FadeOut(rA), run_time=rt(min(1.2, d * 0.4)))
        self.play(FadeIn(b3_), run_time=rt(min(1.2, d * 0.4)))
        self.pause(0.8)

        # ---- a caution: nearly parallel lines
        pin = plane((-1, 12), (-1, 5), unit=0.75).move_to(np.array([0, -0.35, 0]))
        tin = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).next_to(pin, UP, buff=0.15)
        m = ValueTracker(1 / 3)

        def L1():
            return Line(pin.c2p(-1, 0.25), pin.c2p(12, 3.5), color=C_L1, stroke_width=4)

        def L2():
            k = m.get_value()
            c = 1 / 3
            x0, x1 = -1, 12
            y0, y1 = k * x0 + c, k * x1 + c
            if y1 > 5:
                x1, y1 = (5 - c) / k, 5
            return Line(pin.c2p(x0, y0), pin.c2p(x1, y1), color=C_L2, stroke_width=4)

        def xpt():
            k = m.get_value()
            x = (0.5 - 1 / 3) / (k - 0.25)
            return pin.c2p(x, 0.25 * x + 0.5)

        l1 = L1()
        l2 = always_redraw(L2)
        cdot = always_redraw(lambda: Dot(xpt(), radius=0.09, color=WHITE))
        d = self.say()                                   # one caution
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)
        self.play(Create(pin), FadeIn(tin), run_time=rt(min(1.0, d - 0.6)))
        d = self.say()                                   # nearly parallel, still one crossing
        self.play(Create(l1), run_time=rt(d * 0.3))
        self.play(Create(l2.copy()), run_time=rt(d * 0.3))
        self.remove(*[mm for mm in self.mobjects if isinstance(mm, Line) and mm is not l1])
        self.add(l2)
        self.play(FadeIn(cdot, scale=0.5), run_time=rt(min(0.8, d * 0.3)))
        d = self.say()                                   # tilt slightly: the crossing moves a long way
        self.play(m.animate.set_value(0.27), run_time=rt(d * 0.45))
        self.play(m.animate.set_value(1 / 3), run_time=rt(d * 0.35))
        d = self.say()                                   # exact, and still fragile
        self.play(m.animate.set_value(0.28), run_time=rt(min(1.6, d * 0.6)))
        d = self.say()                                   # we'll come back on a real machine
        self.play(m.animate.set_value(1 / 3), run_time=rt(min(1.6, d * 0.6)))
