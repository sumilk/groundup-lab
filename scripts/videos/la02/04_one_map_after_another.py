"""One map after another. Script: docs/LA02_VIDEO_SCRIPT.md, section "One map after another".

Three spaces, never merged: input, middle, output, joined by the maps B and A. The pair used here is the
chapter's own composition pair, B = [[2, 0], [1, 1]] and A = [[1, 1], [0, 2]], not the cast matrix.
"""
from sample import *  # noqa: F401,F403

from types import SimpleNamespace

U3 = 0.6                      # three panels need a smaller unit than the two-panel layout
R3 = (-1, 5)
R3W = (R3[1] - R3[0]) * U3
PX = [-4.9, 0.0, 4.9]
PY = -0.75
Y1, Y2, Y3 = 3.45, 2.8, 2.15  # equation lines above the panels


class OneMapAfterAnother(NScene):
    PARAS = [
        ["Apply one linear map, and then another.",
         "For this part, A and B are two new matrices.",
         "B has columns two, one and zero, one.",
         "A has columns one, zero and one, two.",
         "Our own A comes back when we start eliminating."],
        ["Is \"B, then A\" linear?",
         "A combination of inputs goes through B to the same combination of outputs, and through A to the same "
         "combination again.",
         "It is.",
         "And by Theorem one its matrix is decided by where e one and e two end up."],
        ["Follow e one.",
         "B sends it to B's first column, two, one.",
         "Where does A send two, one?"],
        ["Two copies of A's first column, one, zero, plus one copy of its second, one, two.",
         "The result is three, two.",
         "And e two goes to zero, one in the middle, which A sends to its second column, one, two."],
        ["The matrix of \"B, then A\" has columns three, two and one, two.",
         "It is written A B, with B on the right, because B acts first.",
         "The order is the same as in A of B of x."],
        ["In general, A times B is A applied to each column of B.",
         "If A is m by n and B is n by p, the product is m by p. "
         "The two inner sizes must agree, because A accepts inputs with n entries, so every column of B must "
         "have n entries."],
        ["In pictures, B turns the unit square into a parallelogram.",
         "A then acts on that parallelogram.",
         "The final shape has sides three, two and one, two, which are the columns of A B. "
         "Going straight there with A B gives the same shape."],
        # ---- four ways to compute the same product
        ["By hand, you rarely want to push whole columns through a map.",
         "Are there quicker ways to get the same numbers?"],
        ["Take one entry at a time.",
         "The entry in row i, column j of A B is row i of A, dotted with column j of B. "
         "Watch the top-left entry.",
         "Row one meets column one, one times two plus one times one, three.",
         "Every other entry is the same move, with a different row and column."],
        ["Or take one row at a time.",
         "Row i of A B is a combination of the rows of B, with the amounts taken from row i of A.",
         "Row one of A asks for one of each, so the first row of the product is B's two rows added together."],
        ["The column view is the definition you started with.",
         "Column j of A B is A times column j of B, a combination of the columns of A."],
        ["The fourth way splits the product into pieces.",
         "Pair column one of A with row one of B, and multiply every entry of the column by every entry of the "
         "row.",
         "The result is a whole matrix.",
         "Do the same with column two and row two, and add the two pieces."],
        ["It's the same product again.",
         "A column times a row like this is called an outer product.",
         "In each piece, every column is a multiple of the same arrow.",
         "In the second piece, both columns are multiples of one, two.",
         "Every matrix product is a sum of pieces as thin as that."],
        # ---- does the order matter?
        ["If you apply A first, and then B, do you land on the same parallelogram?"],
        ["A first makes a different parallelogram, and B carries it somewhere else again.",
         "The final shape misses the outline.",
         "So B A, with columns two, one and two, three, is not A B."],
        ["The order of matrices in a product is the order of the maps, read right to left.",
         "Change the order and, in general, you change the map."],
        # ---- blocks, and shapes that aren't square
        ["The columns-times-rows view says a product is a sum of contributions, one per column of the first "
         "factor.",
         "You can group the columns into blocks, then, as long as you cut the second factor at the same place.",
         "Cut this two by three matrix after its second column, and cut the input one, one, two after its "
         "second entry."],
        ["The first block gives three, one, and the second gives zero, six.",
         "Together they make three, seven, the same as A times b computed in one go.",
         "Splitting into blocks only brackets the same sum."],
        ["Products don't need square matrices.",
         "Take a two by three matrix times a three by two.",
         "The inner sizes are both three, so the product exists, and it is two by two."],
        ["Watch one entry.",
         "Row one against column one is two, plus zero, plus two, four.",
         "The other three entries are built the same way, row against column.",
         "The other order, three by two times two by three, is also allowed, and it's three by three.",
         "Not even the same size."],
        # ---- the rules that come free
        ["Because a product is a composition of maps, some rules need no calculation.",
         "A B, times C, and A times B C, both mean C, then B, then A. They're equal, and brackets can be dropped.",
         "And because each map is linear, products distribute over sums.",
         "Apply A to the sum of B and C. That gives A B plus A C."],
        ["The map that does nothing has columns e one to e n, because it sends each axis to itself.",
         "It is called the identity matrix, I n. Multiplying by it changes nothing, on either side.",
         "A diagonal matrix has numbers d one to d n down its diagonal and zeros elsewhere.",
         "It scales coordinate i by d i, and touches nothing else."],
    ]


    def construct(self):
        self.compose()
        self.four_ways()
        self.order()
        self.blocks_and_shapes()
        self.free_rules()
        self.done()
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def three_panels(self, mid_title):
        ps, ts = [], []
        for cx, title in zip(PX, ["input: the amounts (<i>x</i>, <i>y</i>)", mid_title,
                                  "output: where the amounts land"]):
            p = plane(R3, R3, unit=U3).move_to(np.array([cx, PY, 0]))
            ps.append(p)
            ts.append(P(title, 22, C_DIM).next_to(p, UP, buff=0.15))
        ts[1].match_y(ts[0])
        return ps, ts

    def compose(self):
        (pin, pmid, pout), (tin, tmid, tout) = self.three_panels("middle: after <i>B</i>")
        arB, labB = gap_arrow(0, "<i>B</i>")
        arA, labA = gap_arrow(1, "<i>A</i>")
        Bm = mat2([["2", "0"], ["1", "1"]]).next_to(arB, DOWN, buff=0.35)
        Am = mat2([["1", "1"], ["0", "2"]]).next_to(arA, DOWN, buff=0.35)
        sq = unit_poly(pin, (1, 0), (0, 1))
        e1 = vec(pin, 1, 0, C_U, width=6)
        e2 = vec(pin, 0, 1, C_Q, width=6)
        e1l = M("<i>e</i><sub>1</sub>", 26, C_U).next_to(e1.get_end(), DOWN, buff=0.1)
        e2l = M("<i>e</i><sub>2</sub>", 26, C_Q).next_to(e2.get_end(), LEFT, buff=0.1)

        # ---- what is the matrix of "B, then A"?
        d = self.say()                                   # one linear map, then another
        self.play(Create(VGroup(pin, pmid, pout)), FadeIn(VGroup(tin, tmid, tout)), run_time=min(1.6, d * 0.6))
        self.play(GrowArrow(arB), FadeIn(labB), run_time=min(0.6, d * 0.2))
        self.play(GrowArrow(arA), FadeIn(labA), run_time=min(0.6, d * 0.2))
        d = self.say()                                   # two new matrices
        self.play(FadeIn(sq), GrowArrow(e1), GrowArrow(e2), FadeIn(e1l), FadeIn(e2l), run_time=min(1.4, d))
        d = self.say()                                   # B's columns
        self.play(FadeIn(Bm), run_time=min(1.2, d))
        d = self.say()                                   # A's columns
        self.play(FadeIn(Am), run_time=min(1.2, d))
        d = self.say()                                   # our own A comes back later
        self.wait(max(0, d - 0.1))
        self.pause(0.4)

        d = self.say()                                   # is "B, then A" linear?
        self.play(Indicate(VGroup(arB, labB), color=WHITE), run_time=min(0.8, d * 0.45))
        self.play(Indicate(VGroup(arA, labA), color=WHITE), run_time=min(0.8, d * 0.45))
        d = self.say()                                   # combinations go through both maps
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # it is
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # decided by where e1 and e2 end up
        self.play(Indicate(VGroup(e1, e1l), color=C_U), Indicate(VGroup(e2, e2l), color=C_Q),
                  run_time=min(1.2, d * 0.6))
        self.pause(0.4)

        # ---- follow e1
        m1 = vec(pmid, 2, 1, C_U, width=6)
        m1l = M("(2, 1)", 24, C_U).next_to(m1.get_end(), RIGHT, buff=0.1)
        d = self.say()                                   # follow e one
        self.play(Indicate(VGroup(e1, e1l), color=C_U), run_time=min(1.0, d))
        d = self.say()                                   # B sends it to (2, 1)
        colB0 = col_box(Bm, 0, C_U)
        self.play(Create(colB0), run_time=min(0.6, d * 0.3))
        self.play(TransformFromCopy(e1, m1, path_arc=-PI / 4), run_time=min(1.2, d * 0.4))
        self.play(TransformFromCopy(Bm.entries[0][0], m1l), FadeOut(colB0), run_time=min(0.6, d * 0.25))
        self.say()                                       # where does A send (2, 1)?
        self.pause(3.0)                                  # ⏸ work out A(2, 1) from A's columns (path and AB hidden)

        # ---- the walk in the output panel: 2 (1, 0) + 1 (1, 2) = (3, 2)
        walk_ = VGroup(vec_between(pout, (0, 0), (1, 0), C_U, width=4),
                       vec_between(pout, (1, 0), (2, 0), C_U, width=4),
                       vec_between(pout, (2, 0), (3, 2), C_Q, width=4))
        line1 = eqrow("<i>A</i>(2, 1)", "=", "2·", ("(1, 0)", C_U), "+", "1·", ("(1, 2)", C_Q))
        res1 = eqrow("=", "(3, 2)")
        line1.move_to(np.array([0, Y1, 0])).to_edge(LEFT, buff=0.5)
        res1.next_to(line1, RIGHT, buff=0.12)
        o1 = vec(pout, 3, 2, C_U, width=6)
        o1l = M("(3, 2)", 24, C_U).next_to(o1.get_end(), RIGHT, buff=0.1)
        d = self.say()                                   # two copies of (1, 0), one of (1, 2)
        colA0, colA1 = col_box(Am, 0, C_U), col_box(Am, 1, C_Q)
        self.play(FadeIn(line1[:3]), Create(colA0), run_time=min(0.8, d * 0.2))
        self.play(FadeIn(line1[3]), GrowArrow(walk_[0]), run_time=min(0.8, d * 0.15))
        self.play(GrowArrow(walk_[1]), run_time=min(0.7, d * 0.12))
        self.play(FadeIn(line1[4:6]), Create(colA1), FadeOut(colA0), run_time=min(0.8, d * 0.15))
        self.play(FadeIn(line1[6]), GrowArrow(walk_[2]), run_time=min(0.9, d * 0.15))
        d = self.say()                                   # the result is (3, 2)
        self.play(FadeIn(res1), GrowArrow(o1), FadeIn(o1l), FadeOut(colA1), run_time=min(1.2, d))
        self.play(walk_.animate.set_opacity(0.0), run_time=0.4)
        self.remove(walk_)

        m2 = vec(pmid, 0, 1, C_Q, width=6)
        m2l = M("(0, 1)", 24, C_Q).next_to(m2.get_end(), RIGHT, buff=0.1)
        o2 = vec(pout, 1, 2, C_Q, width=6)
        o2l = M("(1, 2)", 24, C_Q).next_to(o2.get_end(), UP, buff=0.1)
        line2 = eqrow("<i>A</i>(0, 1)", "=", ("(1, 2)", C_Q))
        line2.next_to(line1, DOWN, buff=0.28).align_to(line1, LEFT)
        ABm = mat2([["3", "1"], ["2", "2"]])
        ABname = M("<i>AB</i> =", 32)
        AB = VGroup(ABname, ABm).arrange(RIGHT, buff=0.2).move_to(np.array([4.6, 2.75, 0]))
        so = M("so", 28, C_DIM).next_to(AB, LEFT, buff=0.3)
        d = self.say()                                   # e2: (0, 1) in the middle, then (1, 2)
        self.play(TransformFromCopy(e2, m2, path_arc=-PI / 4), FadeIn(m2l), run_time=min(1.2, d * 0.3))
        self.play(TransformFromCopy(m2, o2, path_arc=-PI / 4), FadeIn(o2l), FadeIn(line2),
                  run_time=min(1.4, d * 0.35))
        self.play(FadeIn(VGroup(so, ABname, ABm[0], ABm[2])),
                  TransformFromCopy(o1l, VGroup(ABm.entries[0][0], ABm.entries[1][0])),
                  TransformFromCopy(o2l, VGroup(ABm.entries[0][1], ABm.entries[1][1])), run_time=min(1.4, d * 0.3))
        self.pause(1.5)                                  # ⏸ read the two columns of the product

        # ---- naming the product
        d = self.say()                                   # columns (3, 2) and (1, 2)
        self.play(Indicate(VGroup(o1, o1l, ABm.entries[0][0], ABm.entries[1][0]), color=C_U),
                  run_time=min(1.0, d * 0.45))
        self.play(Indicate(VGroup(o2, o2l, ABm.entries[0][1], ABm.entries[1][1]), color=C_Q),
                  run_time=min(1.0, d * 0.45))
        term = P("matrix product", 22, C_DIM).next_to(AB, UP, buff=0.15)
        d = self.say()                                   # written AB, B on the right, B acts first
        self.play(FadeIn(term), FadeOut(so), Indicate(ABname, color=WHITE), run_time=min(1.2, d * 0.5))
        self.play(Indicate(VGroup(arB, labB), color=WHITE), run_time=min(0.8, d * 0.4))
        comp = M("(<i>AB</i>)<b>x</b> = <i>A</i>(<i>B</i><b>x</b>)", 30)
        comp.move_to(np.array([0, Y3, 0])).to_edge(LEFT, buff=0.5)
        d = self.say()                                   # A of B of x
        self.play(FadeIn(comp), run_time=min(1.0, d * 0.5))
        self.play(Indicate(VGroup(arB, labB), color=WHITE), run_time=min(0.6, d * 0.25))
        self.play(Indicate(VGroup(arA, labA), color=WHITE), run_time=min(0.6, d * 0.25))
        self.pause(0.5)

        # ---- the general form
        gen1 = M("<i>AB</i> = <i>A</i> [<b>u</b><sub>1</sub> ⋯ <b>u</b><sub><i>p</i></sub>] = "
                 "[<i>A</i><b>u</b><sub>1</sub> ⋯ <i>A</i><b>u</b><sub><i>p</i></sub>]", 30)
        gen1.move_to(np.array([0, Y1, 0])).to_edge(LEFT, buff=0.5)
        shp = eqrow("(<i>m</i> ×", "<i>n</i>", ")(", "<i>n</i>", "× <i>p</i>)", "=", "<i>m</i> × <i>p</i>",
                    buff=0.16)
        shp.move_to(np.array([0, Y2, 0])).to_edge(LEFT, buff=0.5)
        d = self.say()                                   # A applied to each column of B
        self.play(FadeOut(VGroup(line1, res1, line2)), run_time=0.4)
        self.play(FadeIn(gen1), run_time=min(1.2, d * 0.6))
        d = self.say()                                   # m by n times n by p is m by p
        self.play(FadeIn(shp), run_time=min(1.2, d * 0.25))
        rings = VGroup(*[Circle(radius=0.19, color=WHITE, stroke_width=2.5).move_to(shp[k]) for k in (1, 3)])
        self.wait(d * 0.3)
        self.play(Create(rings), run_time=min(1.0, d * 0.2))
        self.pause(0.6)

        # ---- the unit square, through B and then A
        para_mid = poly(pmid, (2, 1), (0, 1))
        para_out = poly(pout, (3, 2), (1, 2))
        d = self.say()                                   # B turns the square into a parallelogram
        self.play(FadeOut(VGroup(rings)), TransformFromCopy(sq, para_mid, path_arc=-PI / 6), run_time=min(1.6, d))
        d = self.say()                                   # A acts on the parallelogram
        self.play(TransformFromCopy(para_mid, para_out, path_arc=-PI / 6), run_time=min(1.6, d))
        d = self.say()                                   # sides (3, 2) and (1, 2): the columns of AB
        self.play(Indicate(VGroup(o1, o1l), color=C_U), Indicate(VGroup(ABm.entries[0][0], ABm.entries[1][0]),
                                                                 color=C_U), run_time=min(1.0, d * 0.45))
        self.play(Indicate(VGroup(o2, o2l), color=C_Q), Indicate(VGroup(ABm.entries[0][1], ABm.entries[1][1]),
                                                                 color=C_Q), run_time=min(1.0, d * 0.2))
        arc = CurvedArrow(np.array([PX[0] + 0.3, PY - 1.75 - 0.12, 0]), np.array([PX[2] - 0.3, PY - 1.75 - 0.12, 0]),
                          angle=PI / 5, color=WHITE, stroke_width=4, tip_length=0.22)
        arcl = M("<i>AB</i>", 30).next_to(arc, DOWN, buff=0.05)
        traveller = sq.copy()
        self.until_end(-d * 0.45)                        # straight there with AB: the same shape
        self.play(Create(arc), FadeIn(arcl), run_time=min(1.0, d * 0.15))
        self.play(MoveAlongPath(traveller, arc), run_time=min(1.4, d * 0.15))
        self.play(Transform(traveller, para_out.copy().set_stroke(WHITE, 4)), run_time=min(0.8, d * 0.1))
        self.pause(0.6)

        self.n = SimpleNamespace(pin=pin, pmid=pmid, pout=pout, tin=tin, tmid=tmid, tout=tout, arB=arB,
                                 labB=labB, arA=arA, labA=labA, Bm=Bm, Am=Am, AB=AB, ABm=ABm, ABname=ABname,
                                 term=term, comp=comp, gen1=gen1, shp=shp)
        self.left_over = VGroup(pin, pmid, pout, tin, tmid, tout, arB, labB, arA, labA, sq, e1, e2, e1l, e2l,
                                m1, m1l, m2, m2l, o1, o1l, o2, o2l, para_mid, para_out, arc, arcl, traveller,
                                term, comp, gen1, shp)

    # ------------------------------------------------------------------------------------------------
    def four_ways(self):
        n = self.n
        Am = mat2([["1", "1"], ["0", "2"]], size=36)
        Bm = mat2([["2", "0"], ["1", "1"]], size=36)
        ABm = mat2([["3", "1"], ["2", "2"]], size=36)
        row = VGroup(Am, Bm, M("=", 36), ABm).arrange(RIGHT, buff=0.35).move_to(np.array([0.6, 2.55, 0]))
        names = VGroup(M("<i>A</i>", 28, C_DIM).next_to(Am, UP, buff=0.12),
                       M("<i>B</i>", 28, C_DIM).next_to(Bm, UP, buff=0.12),
                       M("<i>AB</i>", 28, C_DIM).next_to(ABm, UP, buff=0.12))
        d = self.say()                                   # rarely push whole columns through by hand
        self.play(FadeOut(self.left_over), FadeOut(n.ABname), run_time=min(0.8, d * 0.3))
        self.play(ReplacementTransform(n.Am, Am), ReplacementTransform(n.Bm, Bm),
                  ReplacementTransform(n.ABm, ABm), FadeIn(row[2]), FadeIn(names), run_time=min(1.4, d * 0.5))
        d = self.say()                                   # quicker ways?
        self.wait(max(0, d - 0.1))
        self.pause(0.4)

        def view_label(s):
            return P(s, 24, C_DIM).move_to(np.array([-4.6, 2.55, 0]))

        # ---- entry view
        lab = view_label("entry view")
        f_entry = M("(<i>AB</i>)<sub><i>ij</i></sub> = Σ<sub><i>k</i></sub> "
                    "<i>A</i><sub><i>ik</i></sub><i>B</i><sub><i>kj</i></sub>", 32).move_to(np.array([0, 0.9, 0]))
        d = self.say()                                   # one entry at a time
        self.play(FadeIn(lab), run_time=min(0.8, d))
        d = self.say()                                   # row i of A dotted with column j of B
        self.play(FadeIn(f_entry), run_time=min(1.2, d * 0.3))
        rA = row_box(Am, 0)
        cB = col_box(Bm, 0, WHITE)
        eAB = SurroundingRectangle(ABm.entries[0][0], color=WHITE, buff=0.1, corner_radius=0.06)
        self.until_end(-1.3)                             # watch the top-left entry
        self.play(Create(rA), Create(cB), Create(eAB), run_time=1.0)
        l11 = M("(<i>AB</i>)<sub>11</sub> = (1, 1)·(2, 1) = 1·2 + 1·1 = 3", 30).move_to(np.array([0, -0.3, 0]))
        d = self.say()                                   # 1·2 + 1·1 = 3
        self.play(FadeIn(l11), run_time=min(1.6, d * 0.7))
        self.play(Indicate(ABm.entries[0][0], color=WHITE), run_time=min(0.6, d * 0.25))
        l21 = M("(<i>AB</i>)<sub>21</sub> = (0, 2)·(2, 1) = 2", 30).next_to(l11, DOWN, buff=0.35).align_to(l11, LEFT)
        d = self.say()                                   # every other entry: same move
        self.play(Transform(rA, row_box(Am, 1)),
                  Transform(eAB, SurroundingRectangle(ABm.entries[1][0], color=WHITE, buff=0.1, corner_radius=0.06)),
                  run_time=min(0.8, d * 0.3))
        self.play(FadeIn(l21), run_time=min(1.0, d * 0.4))
        self.pause(0.8)

        # ---- row view
        d = self.say()                                   # one row at a time
        lab2 = view_label("row view")
        self.play(FadeOut(VGroup(f_entry, l11, l21, rA, cB, eAB)), ReplacementTransform(lab, lab2),
                  run_time=min(1.0, d))
        strips = VGroup(strip("(2, 0)"), strip("(1, 1)")).arrange(RIGHT, buff=0.8).move_to(np.array([0.6, 0.8, 0]))
        rB = VGroup(row_box(Bm, 0), row_box(Bm, 1))
        rA = row_box(Am, 0)
        d = self.say()                                   # row i of AB: rows of B, amounts from row i of A
        self.play(Create(rB), run_time=min(0.8, d * 0.25))
        self.play(TransformFromCopy(rB[0], strips[0]), TransformFromCopy(rB[1], strips[1]),
                  run_time=min(1.2, d * 0.3))
        self.play(Create(rA), FadeOut(rB), run_time=min(0.8, d * 0.25))
        lrow = eqrow("row 1 of <i>AB</i>", "=", "1·", "(2, 0)", "+", "1·", "(1, 1)", "=", "(3, 1)", size=30)
        lrow[0].become(P("row 1 of <i>AB</i>", 26).move_to(lrow[0]))
        lrow.move_to(np.array([0.3, -0.6, 0]))
        rAB = row_box(ABm, 0)
        d = self.say()                                   # row one asks for one of each
        self.play(FadeIn(lrow[:2]), TransformFromCopy(Am.entries[0][0], lrow[2]),
                  TransformFromCopy(strips[0][1], lrow[3]), run_time=min(1.2, d * 0.3))
        self.play(FadeIn(lrow[4]), TransformFromCopy(Am.entries[0][1], lrow[5]),
                  TransformFromCopy(strips[1][1], lrow[6]), run_time=min(1.2, d * 0.3))
        self.play(FadeIn(lrow[7:]), run_time=min(0.8, d * 0.15))
        self.play(Create(rAB), Indicate(lrow[8], color=WHITE), run_time=min(0.8, d * 0.2))
        self.pause(0.8)

        # ---- column view
        d = self.say()                                   # the column view is the definition
        lab3 = view_label("column view")
        cB = col_box(Bm, 0, WHITE)
        cAB = col_box(ABm, 0, WHITE)
        self.play(FadeOut(VGroup(strips, lrow, rA, rAB)), ReplacementTransform(lab2, lab3), run_time=min(0.8, d * 0.5))
        self.play(Create(cB), Create(cAB), run_time=min(0.8, d * 0.4))
        lcol1 = P("column <i>j</i> of <i>AB</i>  =  <i>A</i> × (column <i>j</i> of <i>B</i>)", 26)
        lcol1.move_to(np.array([0, 0.8, 0]))
        lcol2 = eqrow("<i>A</i>(2, 1)", "=", "2·", ("(1, 0)", C_U), "+", "1·", ("(1, 2)", C_Q), "=", "(3, 2)")
        lcol2.next_to(lcol1, DOWN, buff=0.45)
        d = self.say()                                   # A times column j of B: a combination of A's columns
        self.play(FadeIn(lcol1), run_time=min(1.0, d * 0.35))
        self.play(FadeIn(lcol2), run_time=min(1.2, d * 0.4))
        self.pause(0.8)

        # ---- columns times rows
        d = self.say()                                   # the fourth way: pieces
        self.play(FadeOut(VGroup(lcol1, lcol2, cB, cAB, lab3)), run_time=min(0.8, d))
        a1 = column_vec(["1", "0"], size=32, color=C_U)
        a2 = column_vec(["1", "2"], size=32, color=C_Q)
        b1 = matrix_mob([["2", "0"]], size=32)
        b2 = matrix_mob([["1", "1"]], size=32)
        g1 = matrix_mob([["2", "0"], ["0", "0"]], size=32, color=C_U)
        g2 = matrix_mob([["1", "1"], ["2", "2"]], size=32, color=C_Q)
        for g in (g1, g2):
            VGroup(g[0], g[2]).set_color(WHITE)
        g1.move_to(np.array([-2.9, -0.9, 0]))
        g2.move_to(np.array([1.3, -0.9, 0]))
        for g, a, b in ((g1, a1, b1), (g2, a2, b2)):
            a.next_to(g, LEFT, buff=0.3)
            b.next_to(g, UP, buff=0.25)
        plus = M("+", 34).move_to((g1.get_right() + a2.get_left()) / 2)
        eq = M("=", 34).next_to(g2, RIGHT, buff=0.35)
        S = mat2([["3", "1"], ["2", "2"]], size=32).next_to(eq, RIGHT, buff=0.35)
        lab_g1 = M("<b>a</b><sub>1</sub><b>b</b><sub>1</sub><sup>T</sup>", 28, C_DIM).next_to(g1, DOWN, buff=0.25)
        lab_g2 = M("<b>a</b><sub>2</sub><b>b</b><sub>2</sub><sup>T</sup>", 28, C_DIM).next_to(g2, DOWN, buff=0.25)
        cA0, rB0 = col_box(Am, 0, C_U), row_box(Bm, 0)
        d = self.say()                                   # column one of A with row one of B
        self.play(Create(cA0), Create(rB0), run_time=min(0.6, d * 0.15))
        self.play(TransformFromCopy(VGroup(*[Am.entries[i][0] for i in range(2)]), VGroup(a1[1])),
                  FadeIn(VGroup(a1[0], a1[2])),
                  TransformFromCopy(VGroup(*Bm.entries[0]), VGroup(b1[1])), FadeIn(VGroup(b1[0], b1[2])),
                  run_time=min(1.2, d * 0.3))
        self.play(FadeIn(VGroup(g1[0], g1[2])), FadeOut(cA0), FadeOut(rB0), run_time=0.4)
        self.play(LaggedStart(*[FadeIn(g1.entries[i][j], scale=0.6) for i in range(2) for j in range(2)],
                              lag_ratio=0.5), run_time=min(1.6, d * 0.35))
        d = self.say()                                   # a whole matrix
        self.play(FadeIn(lab_g1), Indicate(g1, color=WHITE, scale_factor=1.06), run_time=min(1.0, d))
        d = self.say()                                   # column two and row two, and add
        cA1, rB1 = col_box(Am, 1, C_Q), row_box(Bm, 1)
        self.play(Create(cA1), Create(rB1), run_time=min(0.5, d * 0.1))
        self.play(TransformFromCopy(VGroup(*[Am.entries[i][1] for i in range(2)]), VGroup(a2[1])),
                  FadeIn(VGroup(a2[0], a2[2])),
                  TransformFromCopy(VGroup(*Bm.entries[1]), VGroup(b2[1])), FadeIn(VGroup(b2[0], b2[2])),
                  FadeOut(cA1), FadeOut(rB1), run_time=min(1.0, d * 0.2))
        self.play(FadeIn(VGroup(g2[0], g2[2])), run_time=0.3)
        self.play(LaggedStart(*[FadeIn(g2.entries[i][j], scale=0.6) for i in range(2) for j in range(2)],
                              lag_ratio=0.5), FadeIn(lab_g2), run_time=min(1.4, d * 0.25))
        self.play(FadeIn(plus), FadeIn(eq), run_time=0.4)
        self.play(TransformFromCopy(VGroup(g1, g2), S), run_time=min(1.2, d * 0.2))
        self.pause(2.0)                                  # ⏸ check the sum against the product above

        d = self.say()                                   # the same product again
        self.play(Indicate(S, color=WHITE), Indicate(ABm, color=WHITE), run_time=min(1.2, d))
        lab4 = P("columns times rows", 24, C_DIM).move_to(np.array([-4.6, 2.55, 0]))
        lab5 = P("outer product", 24, WHITE).next_to(VGroup(lab_g1, lab_g2), DOWN, buff=0.25)
        lab5.move_to(np.array([(g1.get_center()[0] + g2.get_center()[0]) / 2, lab5.get_center()[1], 0]))
        d = self.say()                                   # a column times a row: an outer product
        self.play(FadeIn(lab4), FadeIn(lab5), run_time=min(1.0, d * 0.5))
        d = self.say()                                   # every column a multiple of the same arrow
        self.play(Indicate(VGroup(*[g1.entries[i][0] for i in range(2)]), color=C_U),
                  Indicate(a1[1], color=C_U), run_time=min(1.0, d * 0.45))
        self.play(Indicate(VGroup(*[g1.entries[i][1] for i in range(2)]), color=C_U),
                  Indicate(a1[1], color=C_U), run_time=min(1.0, d * 0.45))
        d = self.say()                                   # second piece: multiples of (1, 2)
        ring = VGroup(col_box(g2, 0, C_Q), col_box(g2, 1, C_Q))
        self.play(Create(ring), Indicate(a2[1], color=C_Q), run_time=min(1.2, d * 0.6))
        gen = M("<i>AB</i> = <b>a</b><sub>1</sub><b>b</b><sub>1</sub><sup>T</sup> + ⋯ + "
                "<b>a</b><sub><i>n</i></sub><b>b</b><sub><i>n</i></sub><sup>T</sup>", 30)
        gen.move_to(np.array([0, -3.45, 0]))
        d = self.say()                                   # every product: a sum of thin pieces
        self.play(FadeOut(ring), FadeIn(gen), run_time=min(1.2, d * 0.5))
        self.pause(0.8)
        self.ways = VGroup(Am, Bm, ABm, row[2], names, a1, a2, b1, b2, g1, g2, plus, eq, S, lab_g1, lab_g2,
                           lab4, lab5, gen)

    # ------------------------------------------------------------------------------------------------
    def order(self):
        (pin, pmid, pout), (tin, tmid, tout) = self.three_panels("middle: after <i>A</i>")
        arA, labA = gap_arrow(0, "<i>A</i>")
        arB, labB = gap_arrow(1, "<i>B</i>")
        Am = mat2([["1", "1"], ["0", "2"]]).next_to(arA, DOWN, buff=0.35)
        Bm = mat2([["2", "0"], ["1", "1"]]).next_to(arB, DOWN, buff=0.35)
        sq = unit_poly(pin, (1, 0), (0, 1))
        e1 = vec(pin, 1, 0, C_U, width=6)
        e2 = vec(pin, 0, 1, C_Q, width=6)
        ghost = poly(pout, (3, 2), (1, 2)).set_fill(opacity=0).set_stroke(WHITE, 2, opacity=0.35)
        ghost_l = M("<i>AB</i>", 24, C_DIM).move_to(pout.c2p(4.05, 2.4))
        d = self.say()                                   # A first, then B: the same parallelogram?
        self.play(FadeOut(self.ways), run_time=0.6)
        self.play(Create(VGroup(pin, pmid, pout)), FadeIn(VGroup(tin, tmid, tout)),
                  GrowArrow(arA), FadeIn(labA), GrowArrow(arB), FadeIn(labB), FadeIn(Am), FadeIn(Bm),
                  run_time=min(1.6, d * 0.45))
        self.play(FadeIn(sq), GrowArrow(e1), GrowArrow(e2), Create(ghost), FadeIn(ghost_l), run_time=min(1.2, d * 0.4))
        self.pause(3.0)                                  # ⏸ predict (A-then-B shapes and BA hidden)

        mA = poly(pmid, (1, 0), (1, 2))
        mv = VGroup(vec(pmid, 1, 0, C_U, width=5), vec(pmid, 1, 2, C_Q, width=5))
        oB = poly(pout, (2, 1), (2, 3))
        ov = VGroup(vec(pout, 2, 1, C_U, width=5), vec(pout, 2, 3, C_Q, width=5))
        ovl = VGroup(M("(2, 1)", 24, C_U).next_to(ov[0].get_end(), RIGHT, buff=0.08),
                     M("(2, 3)", 24, C_Q).next_to(ov[1].get_end(), LEFT, buff=0.08))
        d = self.say()                                   # a different parallelogram, then somewhere else
        self.play(TransformFromCopy(sq, mA, path_arc=-PI / 6), TransformFromCopy(VGroup(e1, e2), mv, path_arc=-PI / 6),
                  run_time=min(1.6, d * 0.45))
        self.play(TransformFromCopy(mA, oB, path_arc=-PI / 6), TransformFromCopy(mv, ov, path_arc=-PI / 6),
                  run_time=min(1.6, d * 0.45))
        d = self.say()                                   # misses the outline
        self.play(FadeIn(ovl), ghost.animate.set_stroke(opacity=0.9), run_time=min(0.8, d * 0.5))
        self.play(ghost.animate.set_stroke(opacity=0.35), run_time=min(0.6, d * 0.4))
        BAm = mat2([["2", "2"], ["1", "3"]], col_colors=True)
        ABm = mat2([["3", "1"], ["2", "2"]], col_colors=True)
        neq = VGroup(M("<i>BA</i> =", 32), BAm, M("≠", 34), M("<i>AB</i> =", 32), ABm).arrange(RIGHT, buff=0.22)
        neq.move_to(np.array([0, 2.75, 0]))
        d = self.say()                                   # BA is not AB
        self.play(FadeIn(neq[:2]), run_time=min(1.0, d * 0.4))
        self.play(FadeIn(neq[2:]), run_time=min(1.0, d * 0.4))
        self.pause(0.6)
        d = self.say()                                   # order of the maps, read right to left
        self.play(Indicate(neq[0], color=WHITE), run_time=min(0.6, d * 0.2))
        self.play(Indicate(VGroup(arA, labA), color=WHITE), run_time=min(0.7, d * 0.3))
        self.play(Indicate(VGroup(arB, labB), color=WHITE), run_time=min(0.7, d * 0.3))
        d = self.say()                                   # change the order, change the map
        self.wait(max(0, d - 0.1))
        self.pause(0.6)
        self.order_mobs = VGroup(pin, pmid, pout, tin, tmid, tout, arA, labA, arB, labB, Am, Bm, sq, e1, e2,
                                 ghost, ghost_l, mA, mv, oB, ov, ovl, neq)

    # ------------------------------------------------------------------------------------------------
    def blocks_and_shapes(self):
        A = matrix_mob([["1", "2", "0"], ["0", "1", "3"]], size=36, h_buff=0.8)
        b = column_vec(["1", "1", "2"], size=36)
        grp = VGroup(A, b).arrange(RIGHT, buff=0.3).move_to(np.array([0, 1.9, 0]))
        nA = M("<i>A</i>", 28, C_DIM).next_to(A, LEFT, buff=0.25)
        nb = M("<b>b</b>", 28, C_DIM).next_to(b, RIGHT, buff=0.25)
        d = self.say()                                   # one contribution per column of the first factor
        self.play(FadeOut(self.order_mobs), run_time=0.6)
        self.play(FadeIn(grp), FadeIn(nA), FadeIn(nb), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # group columns into blocks; cut the second factor too
        self.play(*[Indicate(VGroup(A.entries[0][j], A.entries[1][j], b.entries[j][0]), color=WHITE)
                    for j in range(3)], run_time=min(1.4, d * 0.5))
        xc = (A.entries[0][1].get_right()[0] + A.entries[0][2].get_left()[0]) / 2
        vcut = DashedLine(np.array([xc, A.get_top()[1] + 0.05, 0]), np.array([xc, A.get_bottom()[1] - 0.05, 0]),
                          color=WHITE, stroke_width=3, dash_length=0.08)
        yc = (b.entries[1][0].get_bottom()[1] + b.entries[2][0].get_top()[1]) / 2
        hcut = DashedLine(np.array([b.get_left()[0] - 0.05, yc, 0]), np.array([b.get_right()[0] + 0.05, yc, 0]),
                          color=WHITE, stroke_width=3, dash_length=0.08)
        lA1 = M("<i>A</i><sub>1</sub>", 26, C_DIM).next_to(VGroup(A.entries[0][0], A.entries[0][1]), UP, buff=0.32)
        lA2 = M("<i>A</i><sub>2</sub>", 26, C_DIM).next_to(A.entries[0][2], UP, buff=0.32)
        d = self.say()                                   # cut after column two, after entry two
        self.play(Create(vcut), FadeIn(lA1), FadeIn(lA2), run_time=min(1.2, d * 0.45))
        self.play(Create(hcut), run_time=min(0.8, d * 0.3))

        blk = eqrow("<i>A</i><sub>1</sub>(1, 1)", "+", "<i>A</i><sub>2</sub>(2)", "=", "(3, 1)", "+", "(0, 6)",
                    "=", "(3, 7)")
        blk.move_to(np.array([0, -0.2, 0]))
        direct = eqrow("<i>A</i><b>b</b>", "=", "1·(1, 0) + 1·(2, 1) + 2·(0, 3)", "=", "(3, 7)")
        direct.next_to(blk, DOWN, buff=0.4)
        rule = VGroup(M("[<i>A</i><sub>1</sub>  <i>A</i><sub>2</sub>]", 30),
                      matrix_mob([["<i>B</i><sub>1</sub>"], ["<i>B</i><sub>2</sub>"]], size=28, v_buff=0.45),
                      M("= <i>A</i><sub>1</sub><i>B</i><sub>1</sub> + <i>A</i><sub>2</sub><i>B</i><sub>2</sub>", 30)
                      ).arrange(RIGHT, buff=0.15).move_to(np.array([0.9, -2.75, 0]))
        rule_term = P("block multiplication", 24, C_DIM).next_to(rule, LEFT, buff=0.5)
        d = self.say()                                   # first block (3, 1), second (0, 6)
        self.play(FadeIn(blk[:3]), run_time=min(1.0, d * 0.35))
        self.play(FadeIn(blk[3:7]), run_time=min(1.0, d * 0.35))
        d = self.say()                                   # together (3, 7), same as A b
        self.play(FadeIn(blk[7:]), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(direct), run_time=min(1.2, d * 0.45))
        d = self.say()                                   # blocks only bracket the same sum
        self.play(FadeIn(rule), FadeIn(rule_term), run_time=min(1.2, d * 0.7))
        self.pause(1.5)                                  # ⏸ compare the block result with the direct one

        # ---- shapes that aren't square
        X = matrix_mob([["1", "0", "2"], ["−1", "3", "1"]], size=34)
        Y = matrix_mob([["2", "1"], ["0", "−1"], ["1", "1"]], size=34)
        Z = matrix_mob([["4", "3"], ["−1", "−3"]], size=34)
        eqz = M("=", 34)
        row = VGroup(X, Y, eqz, Z).arrange(RIGHT, buff=0.35).move_to(np.array([0, 1.7, 0]))
        for i in range(2):
            for j in range(2):
                Z.entries[i][j].set_opacity(0)
        sX, sY = shape_lab(2, 3).next_to(X, DOWN, buff=0.3), shape_lab(3, 2).next_to(Y, DOWN, buff=0.3)
        sY.align_to(sX, DOWN)
        sZ = shape_lab(2, 2).next_to(Z, DOWN, buff=0.3).align_to(sX, DOWN)
        d = self.say()                                   # products don't need square matrices
        self.play(FadeOut(VGroup(grp, nA, nb, vcut, hcut, lA1, lA2, blk, direct, rule, rule_term)), run_time=0.6)
        self.play(FadeIn(X), FadeIn(Y), run_time=min(1.0, max(0.4, d - 0.7)))
        d = self.say()                                   # 2 × 3 times 3 × 2
        self.play(FadeIn(sX), run_time=min(0.8, d * 0.4))
        self.play(FadeIn(sY), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # inner sizes 3 and 3; product 2 × 2
        rings = VGroup(Circle(radius=0.19, color=WHITE, stroke_width=2.5).move_to(sX[2]),
                       Circle(radius=0.19, color=WHITE, stroke_width=2.5).move_to(sY[0]))
        self.play(Create(rings), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(eqz), FadeIn(VGroup(Z[0], Z[2])), FadeIn(sZ), run_time=min(1.0, d * 0.4))

        lines = [M("(1, 1):  2 + 0 + 2 = 4", 28), M("(1, 2):  1 + 0 + 2 = 3", 28),
                 M("(2, 1):  −2 + 0 + 1 = −1", 28), M("(2, 2):  −1 − 3 + 1 = −3", 28)]
        pos = [np.array([-2.9, -0.8, 0]), np.array([2.4, -0.8, 0]), np.array([-2.9, -1.55, 0]),
               np.array([2.4, -1.55, 0])]
        for m, p in zip(lines, pos):
            m.move_to(p).align_to(p, LEFT).shift(LEFT * 1.6)
        d = self.say()                                   # watch one entry
        rX, cY = row_box(X, 0), col_box(Y, 0, WHITE)
        self.play(FadeOut(rings), Create(rX), Create(cY), run_time=min(1.0, d))
        d = self.say()                                   # 2 + 0 + 2 = 4
        self.play(FadeIn(lines[0]), run_time=min(1.4, d * 0.6))
        self.play(Z.entries[0][0].animate.set_opacity(1), run_time=min(0.6, d * 0.3))
        d = self.say()                                   # the other three, row against column
        for k, (i, j) in enumerate(((0, 1), (1, 0), (1, 1)), start=1):
            self.play(Transform(rX, row_box(X, i)), Transform(cY, col_box(Y, j, WHITE)), run_time=min(0.4, d * 0.1))
            self.play(FadeIn(lines[k]), Z.entries[i][j].animate.set_opacity(1), run_time=min(0.7, d * 0.18))
        other = eqrow("(3 × 2)(2 × 3)", "=", "3 × 3", size=30).move_to(np.array([0, -3.0, 0]))
        d = self.say()                                   # the other order is 3 × 3
        self.play(FadeOut(rX), FadeOut(cY), FadeIn(other), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # not even the same size
        self.play(Indicate(other[2], color=WHITE), Indicate(sZ, color=WHITE), run_time=min(1.0, d))
        self.pause(1.5)                                  # ⏸ read the finished product
        self.shapes = VGroup(row, sX, sY, sZ, *lines, other)

    # ------------------------------------------------------------------------------------------------
    def free_rules(self):
        xs = [-5.3, -1.77, 1.77, 5.3]
        boxes = VGroup(*[RoundedRectangle(width=1.9, height=1.3, corner_radius=0.12, stroke_color=C_DIM,
                                          stroke_width=2).move_to(np.array([x, 1.7, 0])) for x in xs])
        caps = VGroup(P("input", 22, C_DIM).next_to(boxes[0], UP, buff=0.12),
                      P("output", 22, C_DIM).next_to(boxes[3], UP, buff=0.12))
        maps = VGroup()
        for k, name in enumerate(["<i>C</i>", "<i>B</i>", "<i>A</i>"]):
            a = Arrow(boxes[k].get_right() + RIGHT * 0.1, boxes[k + 1].get_left() + LEFT * 0.1, buff=0,
                      color=WHITE, stroke_width=4, max_tip_length_to_length_ratio=0.25, tip_length=0.2)
            maps.add(VGroup(a, M(name, 30).next_to(a, UP, buff=0.1)))
        brAB = Brace(VGroup(maps[1], maps[2]), UP, buff=0.12, color=C_DIM)
        brAB_l = M("<i>AB</i>", 28).next_to(brAB, UP, buff=0.08)
        brBC = Brace(VGroup(maps[0][0], maps[1][0]), DOWN, buff=0.75, color=C_DIM)
        brBC_l = M("<i>BC</i>", 28).next_to(brBC, DOWN, buff=0.08)
        d = self.say()                                   # products are compositions: rules for free
        self.play(FadeOut(self.shapes), run_time=0.6)
        self.play(Create(boxes), FadeIn(caps), *[GrowArrow(m[0]) for m in maps], *[FadeIn(m[1]) for m in maps],
                  run_time=min(1.6, d * 0.6))
        d = self.say()                                   # (AB)C and A(BC): C, then B, then A
        self.play(GrowFromCenter(brAB), FadeIn(brAB_l), run_time=min(0.8, d * 0.12))
        self.play(GrowFromCenter(brBC), FadeIn(brBC_l), run_time=min(0.8, d * 0.12))
        for m in maps:
            self.play(Indicate(m, color=WHITE), run_time=min(0.6, d * 0.1))
        r1 = M("(<i>AB</i>)<i>C</i> = <i>A</i>(<i>BC</i>)", 32)
        r2a = M("<i>A</i>(<i>B</i> + <i>C</i>)", 32)
        r2b = M("= <i>AB</i> + <i>AC</i>", 32)
        r3 = M("(<i>A</i> + <i>B</i>)<i>C</i> = <i>AC</i> + <i>BC</i>", 32)
        r1.move_to(np.array([0, -1.0, 0]))
        r2 = VGroup(r2a, r2b).arrange(RIGHT, buff=0.15)
        r2.next_to(r1, DOWN, buff=0.45)
        r3.next_to(r2, DOWN, buff=0.45)
        for r in (r2, r3):
            r.shift(RIGHT * (r1.get_center()[0] - r.get_center()[0]))
        self.play(FadeIn(r1), run_time=min(1.0, d * 0.2))      # equal; brackets dropped
        d = self.say()                                   # products distribute over sums
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # A applied to B + C
        self.play(FadeIn(r2a), run_time=min(1.0, d * 0.3))
        self.until_end(-d * 0.4)                         # gives AB + AC
        self.play(FadeIn(r2b), run_time=min(0.8, d * 0.2))
        self.play(FadeIn(r3), run_time=min(0.8, d * 0.2))
        self.pause(1.0)

        # ---- the identity and diagonal matrices
        I3 = matrix_mob([["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]], size=32,
                        entry_colors={("col", 0): C_U, ("col", 1): C_Q, ("col", 2): C_V})
        I3.move_to(np.array([-3.6, 1.7, 0]))
        outl = VGroup(*[col_box(I3, j, c) for j, c in enumerate((C_U, C_Q, C_V))])
        elabs = VGroup(*[M(f"<i>e</i><sub>{j + 1}</sub>", 26, c).next_to(outl[j], DOWN, buff=0.12)
                         for j, c in enumerate((C_U, C_Q, C_V))])
        Iname = M("<i>I</i><sub>3</sub> =", 32).next_to(I3, LEFT, buff=0.2)
        Iterm = P("identity matrix <i>I</i><sub>n</sub>", 24, C_DIM).next_to(I3, UP, buff=0.25)
        d = self.say()                                   # columns e1 to en: each axis to itself
        self.play(FadeOut(VGroup(boxes, caps, maps, brAB, brAB_l, brBC, brBC_l, r1, r2, r3)), run_time=0.6)
        self.play(FadeIn(I3), run_time=min(1.0, d * 0.3))
        self.play(Create(outl), FadeIn(elabs), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # the identity matrix, I n
        self.play(FadeIn(Iname), FadeIn(Iterm), run_time=min(1.0, d * 0.35))
        ids = VGroup(M("<i>I</i><sub><i>n</i></sub><b>x</b> = <b>x</b>", 30),
                     M("<i>AI</i><sub><i>n</i></sub> = <i>A</i>", 30),
                     M("<i>I</i><sub><i>m</i></sub><i>A</i> = <i>A</i>", 30)).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        ids.move_to(np.array([-3.9, -1.6, 0]))
        self.play(LaggedStart(*[FadeIn(m) for m in ids], lag_ratio=0.5), run_time=min(1.6, d * 0.45))
        D = matrix_mob([["<i>d</i><sub>1</sub>", "0", "0"], ["0", "<i>d</i><sub>2</sub>", "0"],
                        ["0", "0", "<i>d</i><sub>3</sub>"]], size=30)
        Dname = M("diag(<i>d</i><sub>1</sub>, <i>d</i><sub>2</sub>, <i>d</i><sub>3</sub>) =", 30)
        Dg = VGroup(Dname, D).arrange(RIGHT, buff=0.2).move_to(np.array([3.4, 1.7, 0]))
        Dterm = P("diagonal matrix", 24, C_DIM).next_to(D, UP, buff=0.25)
        d = self.say()                                   # numbers d1..dn down the diagonal
        self.play(FadeIn(Dg), FadeIn(Dterm), run_time=min(1.4, d * 0.5))
        self.play(*[Indicate(D.entries[i][i], color=WHITE) for i in range(3)], run_time=min(1.0, d * 0.35))

        # the input box, stretched along each axis
        O = np.array([2.7, -2.75, 0])
        EX_, EY_, EZ_ = np.array([1.0, 0, 0]), np.array([0, 1.0, 0]), np.array([-0.5, -0.38, 0])

        def P3(x, y, z):
            return O + x * EX_ + y * EY_ + z * EZ_

        def cuboid(sx, sy, sz):
            c = [(i, j, k) for i in (0, sx) for j in (0, sy) for k in (0, sz)]
            edges = VGroup()
            for p in c:
                for q in c:
                    if p < q and sum(a != b for a, b in zip(p, q)) == 1:
                        edges.add(Line(P3(*p), P3(*q), color=WHITE, stroke_width=2.5))
            return edges

        axes = VGroup(Arrow(P3(0, 0, 0), P3(2.6, 0, 0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15),
                      Arrow(P3(0, 0, 0), P3(0, 2.0, 0), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15),
                      Arrow(P3(0, 0, 0), P3(0, 0, 1.6), buff=0, color=C_DIM, stroke_width=2, tip_length=0.15))
        cube = cuboid(1, 1, 1)
        box_ = cuboid(2.0, 1.5, 0.5)
        stretch = VGroup(M("× <i>d</i><sub>1</sub>", 24, C_U).next_to(P3(2.6, 0, 0), RIGHT, buff=0.1),
                         M("× <i>d</i><sub>2</sub>", 24, C_Q).next_to(P3(0, 2.0, 0), UP, buff=0.08),
                         M("× <i>d</i><sub>3</sub>", 24, C_V).next_to(P3(0, 0, 1.6), LEFT, buff=0.08))
        d = self.say()                                   # scales coordinate i by d i
        self.play(Create(axes), Create(cube), run_time=min(1.0, d * 0.3))
        self.play(Transform(cube, box_), FadeIn(stretch), run_time=min(1.6, d * 0.5))
        self.pause(0.8)


# ---------------------------------------------------------------------------------------------------- helpers
def gap_arrow(k, name):
    """Straight arrow between panel k and panel k + 1, labelled above."""
    x0 = PX[k] + R3W / 2 + 0.12
    x1 = PX[k + 1] - R3W / 2 - 0.12
    y = PY + 0.75
    a = Arrow(np.array([x0, y, 0]), np.array([x1, y, 0]), buff=0, color=WHITE, stroke_width=4,
              max_tip_length_to_length_ratio=0.3, tip_length=0.2)
    return a, M(name, 32).next_to(a, UP, buff=0.1)


def mat2(rows, size=28, col_colors=True):
    return matrix_mob(rows, size=size, h_buff=0.55, v_buff=0.48,
                      entry_colors={("col", 0): C_U, ("col", 1): C_Q} if col_colors else None)


def poly(p, u, v):
    pts = [p.c2p(0, 0), p.c2p(*u), p.c2p(u[0] + v[0], u[1] + v[1]), p.c2p(*v)]
    return Polygon(*pts, stroke_color=WHITE, stroke_width=2, fill_color=WHITE, fill_opacity=0.12)


def unit_poly(p, u, v):
    return poly(p, u, v)


def col_box(m, j, color=WHITE):
    ents = VGroup(*[m.entries[i][j] for i in range(len(m.entries))])
    return SurroundingRectangle(ents, color=color, buff=0.1, corner_radius=0.06, stroke_width=2.5)


def row_box(m, i, color=WHITE):
    return SurroundingRectangle(VGroup(*m.entries[i]), color=color, buff=0.1, corner_radius=0.06, stroke_width=2.5)


def strip(text):
    t = M(text, 30)
    r = RoundedRectangle(width=t.width + 0.5, height=t.height + 0.3, corner_radius=0.08, stroke_color=WHITE,
                         stroke_width=2, fill_color=WHITE, fill_opacity=0.06).move_to(t)
    return VGroup(r, t)


def shape_lab(m, n):
    g = VGroup(M(str(m), 28, C_DIM), M("×", 28, C_DIM), M(str(n), 28, C_DIM)).arrange(RIGHT, buff=0.18)
    return g


def eqrow(*parts, size=30, buff=0.12):
    ms = []
    for p in parts:
        if isinstance(p, Mobject):
            ms.append(p)
        elif isinstance(p, tuple):
            ms.append(M(p[0], size, p[1]))
        else:
            ms.append(M(p, size))
    return VGroup(*ms).arrange(RIGHT, buff=buff)
