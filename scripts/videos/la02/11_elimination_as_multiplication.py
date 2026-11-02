"""Elimination as multiplication. Script: docs/LA02_VIDEO_SCRIPT.md, section of the same name."""
from sample import *  # noqa: F401,F403
from sample import panel, RIGHT_C
import importlib

_f = importlib.import_module("10_four_subspaces")
gmat, swap_row, two_by_two, para, bglab, C_COLW, C_NULL = (_f.gmat, _f.swap_row, _f.two_by_two, _f.para, _f.bglab,
                                                         _f.C_COLW, _f.C_NULL)
I3 = [["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]]


def edge_pt(m, toward, pad=0.08):
    """Point on m's bounding box (plus pad) in the direction of `toward`."""
    c = m.get_center()
    d = np.array(toward) - c
    w, h = m.width / 2 + pad, m.height / 2 + pad
    t = min(w / abs(d[0]) if abs(d[0]) > 1e-6 else 1e9, h / abs(d[1]) if abs(d[1]) > 1e-6 else 1e9)
    return c + t * d


def link(a, b, double=False, color=WHITE):
    p, q = edge_pt(a, b.get_center()), edge_pt(b, a.get_center())
    cls = DoubleArrow if double else Arrow
    return cls(p, q, buff=0, color=color, stroke_width=3, tip_length=0.16, max_tip_length_to_length_ratio=0.3)


def node(num, text, pos):
    t = M(text, 24) if isinstance(text, str) else VGroup(*[M(x, 24) for x in text]).arrange(DOWN, buff=0.08)
    n = M(num, 24, C_V)
    g = VGroup(n, t).arrange(RIGHT, buff=0.15)
    box = SurroundingRectangle(g, buff=0.1, corner_radius=0.08, stroke_color=C_DIM, stroke_width=1.5)
    box.set_fill(BLACK, 0)
    return VGroup(box, g).move_to(np.array([*pos, 0]))


class EliminationAsMultiplication(NScene):
    PARAS = [
        # ---- a row operation is a matrix
        ["When we first eliminated, the row operation on our system acted on the output panel as a shear, and "
         "shears are linear.",
         "Is every row operation a matrix?",
         "And if so, which matrix?"],
        ["A row operation acts on each column separately, the same way whatever the other columns hold, and it "
         "respects sums and multiples.",
         "On a single column it's a linear map from R m to R m. By Theorem one, its matrix has as columns the images of e one, e two, and so on, which is the operation "
         "done to I."],
        ["The matrix you get by doing one row operation to the identity is called an elementary matrix.",
         "Here are three.",
         "A swap of rows one and two.",
         "Row two times five.",
         "And row three minus four copies of row one."],
        ["Multiply the third one by any three-row matrix A. What does it do?"],
        ["Its first two rows are the first two rows of the identity, so rows one and two of A are left alone.",
         "Its third row is minus four, zero, one, so the new row three is minus four copies of row one plus row "
         "three.",
         "The operation itself.",
         "And it's undone by adding four copies back, so its inverse has plus four in the same place."],
        ["For the cast, the one operation was row two minus a half of row one.",
         "Put minus a half below the diagonal of the identity.",
         "Multiplying A by this matrix performs our row operation.",
         "The triangular system we reached by elimination."],
        ["Acting on vectors in the plane, the three kinds look like this.",
         "A swap reflects across the diagonal line.",
         "Scaling a row stretches along one axis.",
         "A replacement is a shear.",
         "None of them flattens the square.",
         "Each can be undone."],
        ["Elimination multiplies A on the left by one elementary matrix after another, until it reaches R. Their product is the record matrix E from the four subspaces, because doing the same operations to the "
         "identity builds exactly that product."],
        # ---- computing an inverse
        ["If elimination on a square matrix reaches the identity, what has it found?"],
        ["The operations multiply everything by E. If the left block becomes I, then E A equals I, and E, a product of invertible matrices, is invertible.",
         "So A is E inverse, and A inverse is E. The right block started as I and now holds E. Reduce A beside the identity, and when the left side becomes I, the right side is A inverse.",
         "This is Gauss–Jordan inversion."],
        ["Take the matrix on screen."],
        ["Two steps clear downwards and leave pivots one, one, one.",
         "Two more clear upwards.",
         "Watch the right block.",
         "It starts as I and collects every operation."],
        ["The left block is the identity, so the right block is A inverse.",
         "The check on screen multiplies A by the first column of the answer and gets one, zero, zero.",
         "Exactly e one."],
        ["And if the left block develops a row of zeros instead, A has fewer than n pivots.",
         "Is A then certainly not invertible?"],
        # ---- eleven ways of saying "no collapse"
        ["For a square matrix, how many different-sounding properties turn out to be one property?",
         "The screen lists eleven.",
         "One thread runs through all of them, and it's collapse."],
        ["Start with a matrix that can be undone, even if only from the left.",
         "Then nothing nonzero can be crushed to zero, because the left inverse would have to bring it back from "
         "zero, and every matrix sends zero to zero.",
         "A null space of just zero is the same thing as independent columns.",
         "Rank–nullity then makes the rank n. With n pivots in n columns, the reduced form is the identity.",
         "The row operations that got there, undone in reverse, rebuild A from elementary matrices, and each of "
         "those can be undone.",
         "So A is invertible, and the thread closes where it began."],
        ["The other statements hang off the same thread.",
         "A right inverse lets you reach every target, which is the columns spanning, which forces rank n again.",
         "And A transpose is invertible exactly when A is, by Theorem three."],
        ["And once they all hold, a one-sided inverse is the inverse, by the last line on screen."],
        ["That answers the question about a zero row.",
         "Fewer than n pivots breaks the thread at the rank, so A isn't invertible.",
         "It also settles a claim chapter one left open.",
         "A square matrix whose null space is just zero is invertible.",
         "And it explains why elimination worked on our first system.",
         "Three nonzero pivots in a three by three system is full rank, so that solution had to be unique.",
         "A twelfth equivalent condition, that the determinant isn't zero, is proved in chapter five."],
        ["In the picture, an invertible map never flattens space.",
         "The square goes to a genuine parallelogram.",
         "No nonzero input is crushed to zero, and every output is hit.",
         "The eleven statements are eleven ways of saying there's no collapse."],
        # ---- rectangular matrices
        ["Can a matrix that isn't square have an inverse on both sides?"],
        ["If B A equals I, the null space is zero, so the rank is n, and rank can't exceed m. If A C equals I, every b in R m is reachable, so the rank is m, which can't exceed n. Together, m equals n. Only square matrices have two-sided inverses.",
         "One-sided inverses of full-rank rectangular matrices do exist, and return in least squares, in Module "
         "three."],
    ]

    def construct(self):
        self.row_op_is_matrix()
        self.inverse()
        self.eleven()
        self.rectangular()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def row_op_is_matrix(self):
        # ---- the cast's one operation, and its shear
        aug = gmat([["2", "−1", "1"], ["1", "1", "5"]], size=32, pitch=0.9, vb=0.6, bar=2)
        aug.move_to(np.array([-3.6, 1.2, 0]))
        op = M("<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − ½<i>R</i><sub>1</sub>", 30).next_to(aug, DOWN, buff=0.4)
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        XR, YR = (-1, 5), (-1, 6)

        def sh(u, v):
            return (u, v - u / 2)

        grid0, grid1 = VGroup(), VGroup()
        for k in range(-1, 7):
            lo, hi = max(-1, 2 * (k - 6)), min(5, 2 * (k + 1))
            if hi - lo < 0.3:
                continue
            grid0.add(Line(pout.c2p(lo, k), pout.c2p(hi, k), color=C_DIM, stroke_width=1.5, stroke_opacity=0.6))
            grid1.add(Line(pout.c2p(*sh(lo, k)), pout.c2p(*sh(hi, k)), color=C_DIM, stroke_width=1.5,
                           stroke_opacity=0.6))
        a1, a2 = vec(pout, 2, 1, C_U, width=6), vec(pout, -1, 1, C_Q, width=6)
        tg = dot(pout, 1, 5, C_W, r=0.1)
        b1, b2 = vec(pout, 2, 0, C_U, width=6), vec(pout, -1, 1.5, C_Q, width=6)
        tg1 = dot(pout, 1, 4.5, C_W, r=0.1)
        lab = M("(<i>u</i>, <i>v</i>) ↦ (<i>u</i>, <i>v</i> − ½<i>u</i>)", 26).next_to(pout, LEFT, buff=0.4).shift(DOWN * 1.2)
        d = self.say()                                   # the row operation acted as a shear
        self.play(FadeIn(aug), Create(pout), FadeIn(tout), run_time=min(1.4, d * 0.2))
        self.play(FadeIn(grid0), GrowArrow(a1), GrowArrow(a2), FadeIn(tg), FadeIn(op), run_time=min(1.4, d * 0.2))
        new = swap_row(aug, 1, ["0", "3/2", "9/2"])
        self.play(*[Transform(aug.cells[1][j], new[j]) for j in range(3)],
                  Transform(grid0, grid1), Transform(a1, b1), Transform(a2, b2), Transform(tg, tg1),
                  FadeIn(lab), run_time=min(3.0, d * 0.45))
        d = self.say()                                   # is every row operation a matrix?
        self.play(Indicate(op), run_time=min(1.2, d * 0.6))
        q = M("<i>E</i> = ?", 32).next_to(op, DOWN, buff=0.45)
        d = self.say()                                   # which matrix?
        self.play(FadeIn(q), run_time=min(0.8, d * 0.5))
        self.pause(0.6)

        # ---- acts on each column; columns are images of e_k
        G = gmat([["1", "2", "1", "3"], ["2", "4", "4", "10"], ["1", "2", "−1", "−1"]], size=30, pitch=0.85)
        G.move_to(np.array([-3.2, 0.6, 0]))
        cb = VGroup(*[SurroundingRectangle(VGroup(*[G.cells[i][j] for i in range(3)]), color=C_V, buff=0.08,
                                           stroke_width=2) for j in range(4)])
        d = self.say()                                   # acts on each column separately
        self.play(FadeOut(VGroup(aug, op, q, pout, tout, grid0, a1, a2, tg, lab)), run_time=0.6)
        self.play(FadeIn(G), run_time=0.6)
        for b in cb:
            self.play(FadeIn(b), run_time=0.35)
            self.play(FadeOut(b), run_time=0.25)
        I = gmat(I3, size=30, pitch=0.85).move_to(np.array([2.6, 0.6, 0]))
        e_l = VGroup(*[M(f"<b>e</b><sub>{j + 1}</sub>", 26, C_V).next_to(I.cells[2][j], DOWN, buff=0.5)
                       for j in range(3)])
        I_l = M("<i>I</i> =", 30).next_to(I, LEFT, buff=0.2)
        d = self.say()                                   # linear map R^m -> R^m; columns: images of e_k = op done to I
        self.play(FadeOut(G), run_time=0.5)
        self.play(FadeIn(I), FadeIn(I_l), run_time=min(1.0, d * 0.1))
        self.wait(d * 0.3)
        self.play(LaggedStart(*[FadeIn(e) for e in e_l], lag_ratio=0.4), run_time=min(1.6, d * 0.2))
        self.pause(0.4)

        # ---- three elementary matrices
        xs = [-4.5, 0, 4.5]
        mats = [[["0", "1", "0"], ["1", "0", "0"], ["0", "0", "1"]],
                [["1", "0", "0"], ["0", "5", "0"], ["0", "0", "1"]],
                [["1", "0", "0"], ["0", "1", "0"], ["−4", "0", "1"]]]
        chg = [[(0, 0), (0, 1), (1, 0), (1, 1)], [(1, 1)], [(2, 0)]]
        ops = ["<i>R</i><sub>1</sub> ↔ <i>R</i><sub>2</sub>", "<i>R</i><sub>2</sub> ← 5<i>R</i><sub>2</sub>",
               "<i>R</i><sub>3</sub> ← <i>R</i><sub>3</sub> − 4<i>R</i><sub>1</sub>"]
        Es = [gmat(m, size=30, pitch=0.75).move_to(np.array([x, 0.0, 0])) for m, x in zip(mats, xs)]
        for E, c in zip(Es, chg):
            for (i, j) in c:
                E.cells[i][j].set_color(C_V)
        Ols = [M(o, 28).next_to(E, UP, buff=0.35) for o, E in zip(ops, Es)]
        term = VGroup(P("elementary matrix", 26, C_V), P(": one row operation, done to <i>I</i>", 26, C_DIM)) \
            .arrange(RIGHT, buff=0.05).move_to(np.array([0, 2.9, 0]))
        d = self.say()                                   # TERM elementary matrix
        self.play(FadeOut(e_l), FadeOut(I_l), I.animate.move_to(np.array([0, -2.4, 0])), run_time=min(1.0, d * 0.2))
        self.play(FadeIn(term), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # here are three
        self.wait(max(0, d - 0.1))
        for k in range(3):
            d = self.say()                               # swap / times five / minus four row one
            self.play(FadeIn(Ols[k]), TransformFromCopy(I, Es[k]), run_time=min(1.4, d * 0.7))
        self.pause(0.6)

        # ---- what E3 does to A
        E3 = Es[2]
        Arows = matrix_mob([["row 1"], ["row 2"], ["row 3"]], size=28, v_buff=0.6)
        dotm = M("·", 36)
        eq = M("=", 32)
        res = matrix_mob([["row 1"], ["row 2"], ["−4 · row 1 + row 3"]], size=28, v_buff=0.6)
        res.cells = res.entries
        line = VGroup(E3.copy(), dotm, Arows, eq).arrange(RIGHT, buff=0.35)
        line.move_to(np.array([-2.6, 0.6, 0]))
        res.next_to(line, RIGHT, buff=0.35)
        Alab = M("<i>A</i>", 26, C_DIM).next_to(Arows, DOWN, buff=0.2)
        qm = M("?", 34).next_to(line, RIGHT, buff=0.4)
        d = self.say()                                   # multiply the third by A; what does it do?
        self.play(FadeOut(VGroup(Es[0], Es[1], Ols[0], Ols[1], I, term)), run_time=0.6)
        self.play(ReplacementTransform(E3, line[0]), Ols[2].animate.next_to(line[0], UP, buff=0.35),
                  run_time=min(1.0, d * 0.3))
        self.play(FadeIn(VGroup(dotm, Arows, Alab, eq, qm)), run_time=min(1.0, d * 0.3))
        self.pause(3.0)                                  # ⏸ predict (theorem and inverse hidden)

        E3c = line[0]
        rb = [SurroundingRectangle(VGroup(*E3c.cells[i]), color=WHITE, buff=0.07, stroke_width=2) for i in range(3)]
        d = self.say()                                   # rows one and two left alone
        self.play(FadeOut(qm), FadeIn(res[0]), FadeIn(res[2]), Create(rb[0]), Create(rb[1]),
                  FadeIn(VGroup(res.cells[0][0], res.cells[1][0])), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # third row: -4 row 1 + row 3
        self.play(FadeOut(rb[0]), FadeOut(rb[1]), Create(rb[2]), run_time=min(0.8, d * 0.2))
        self.play(FadeIn(res.cells[2][0]), run_time=min(1.2, d * 0.3))
        d = self.say()                                   # the operation itself
        self.play(FadeOut(rb[2]), Indicate(Ols[2]), run_time=min(1.2, d * 0.7))
        inv = VGroup(gmat(mats[2], size=28, pitch=0.7), M("<sup>−1</sup>  =", 28),
                     gmat([["1", "0", "0"], ["0", "1", "0"], ["4", "0", "1"]], size=28, pitch=0.7))
        inv[1].shift(UP * 0.1)
        inv.arrange(RIGHT, buff=0.15).move_to(np.array([-2.0, -1.65, 0]))
        inv[0].cells[2][0].set_color(C_V)
        inv[2].cells[2][0].set_color(C_V)
        thm = VGroup(P("<b>Theorem 16.</b>  Doing a row operation to any <i>m</i>-row matrix <i>A</i> gives <i>EA</i>.", 24),
                     P("Every elementary matrix is invertible; its inverse is the matrix of the reverse operation.", 24))
        thm.arrange(DOWN, buff=0.12, aligned_edge=LEFT).move_to(np.array([0, -3.25, 0]))
        d = self.say()                                   # undone by adding four back
        self.play(FadeIn(inv), run_time=min(1.4, d * 0.35))
        self.play(FadeIn(thm), run_time=min(1.4, d * 0.35))
        self.pause(0.8)

        # ---- the cast
        cast_op = M("<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − ½<i>R</i><sub>1</sub>", 30).move_to(np.array([0, 2.4, 0]))
        Ec = gmat([["1", "0"], ["−½", "1"]], size=32, pitch=0.85, vb=0.6)
        Ec.cells[1][0].set_color(C_V)
        I2 = gmat([["1", "0"], ["0", "1"]], size=32, pitch=0.85, vb=0.6)
        Ac = gmat([["2", "−1"], ["1", "1"]], size=32, pitch=0.85, vb=0.6)
        for i in range(2):
            Ac.cells[i][0].set_color(C_U)
            Ac.cells[i][1].set_color(C_Q)
        EA = gmat([["2", "−1"], ["0", "3/2"]], size=32, pitch=0.85, vb=0.6)
        row = VGroup(Ec, M("·", 36), Ac, M("=", 32), EA).arrange(RIGHT, buff=0.35).move_to(np.array([0, 0.3, 0]))
        I2.move_to(Ec)
        labs = VGroup(M("<i>E</i>", 28, C_DIM).next_to(Ec, DOWN, buff=0.25),
                      M("<i>A</i>", 28, C_DIM).next_to(Ac, DOWN, buff=0.25),
                      M("<i>EA</i>", 28, C_DIM).next_to(EA, DOWN, buff=0.25))
        d = self.say()                                   # for the cast: R2 - 1/2 R1
        self.play(FadeOut(VGroup(line, Ols[2], res, Alab, inv, thm)), run_time=0.6)
        self.play(FadeIn(cast_op), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # put -1/2 below the diagonal
        self.play(FadeIn(I2), run_time=min(0.6, d * 0.2))
        self.play(ReplacementTransform(I2, Ec), FadeIn(labs[0]), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # multiplying A performs it
        self.play(FadeIn(VGroup(row[1], Ac, row[3], labs[1])), run_time=min(1.2, d * 0.3))
        self.play(FadeIn(EA), FadeIn(labs[2]), run_time=min(1.2, d * 0.3))
        d = self.say()                                   # the triangular system
        self.play(Indicate(EA.cells[1][0], color=WHITE, scale_factor=1.5), run_time=min(1.2, d * 0.5))
        self.pause(2.0)                                  # ⏸ read E and EA

        # ---- three kinds, as pictures
        U = 0.48
        pairs = []
        specs = [([[0, 1], [1, 0]], "<i>R</i><sub>1</sub> ↔ <i>R</i><sub>2</sub>"),
                 ([[1, 0], [0, 3]], "<i>R</i><sub>2</sub> ← 3<i>R</i><sub>2</sub>"),
                 ([[1, 0], [-2, 1]], "<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − 2<i>R</i><sub>1</sub>")]
        centers = [-4.6, 0, 4.6]
        for (Mx, oplab), cx in zip(specs, centers):
            pi = plane((-1, 2), (-2, 3), unit=U).move_to(np.array([cx - 1.05, 0.5, 0]))
            po = plane((-1, 2), (-2, 3), unit=U).move_to(np.array([cx + 1.05, 0.5, 0]))
            ti = P("input", 22, C_DIM).next_to(pi, UP, buff=0.1)
            to = P("output", 22, C_DIM).next_to(po, UP, buff=0.1)

            def sq(p, c1=(1, 0), c2=(0, 1)):
                return VGroup(Polygon(p.c2p(0, 0), p.c2p(*c1), p.c2p(c1[0] + c2[0], c1[1] + c2[1]), p.c2p(*c2),
                                      stroke_width=0, fill_color=WHITE, fill_opacity=0.18),
                              vec(p, *c1, C_U, width=4, tip=0.14), vec(p, *c2, C_Q, width=4, tip=0.14))
            c1 = (Mx[0][0], Mx[1][0])
            c2 = (Mx[0][1], Mx[1][1])
            s_in, s_out0, s_out = sq(pi), sq(po), sq(po, c1, c2)
            mm = matrix_mob([[str(v).replace("-", "−") for v in r] for r in Mx], size=26, h_buff=0.55, v_buff=0.42)
            ml = M(oplab, 24).next_to(mm, DOWN, buff=0.15)
            mg = VGroup(mm, ml).move_to(np.array([cx, -2.5, 0]))
            extra = DashedLine(po.c2p(-1, -1), po.c2p(2, 2), color=C_DIM, stroke_width=2) if cx < 0 else VGroup()
            pairs.append(SimpleNamespace(pi=pi, po=po, ti=ti, to=to, s_in=s_in, s_out0=s_out0, s_out=s_out, mg=mg,
                                         extra=extra))
        allp = VGroup(*[VGroup(p.pi, p.po, p.ti, p.to, p.s_in, p.mg) for p in pairs])
        d = self.say()                                   # the three kinds
        self.play(FadeOut(VGroup(row, labs, cast_op)), run_time=0.5)
        self.play(FadeIn(allp), *[FadeIn(p.s_out0) for p in pairs], run_time=min(1.6, d * 0.5))
        for k, p in enumerate(pairs):
            d = self.say()                               # swap / stretch / shear
            anims = [Transform(p.s_out0, p.s_out)]
            if k == 0:
                anims.append(Create(p.extra))
            self.play(*anims, run_time=min(1.6, d * 0.6))
        d = self.say()                                   # none flattens the square
        self.play(*[Indicate(p.s_out0[0], color=WHITE, scale_factor=1.05) for p in pairs], run_time=min(1.4, d * 0.8))
        d = self.say()                                   # each can be undone
        backs = [p.s_out0.copy() for p in pairs]
        self.play(*[Transform(p.s_out0, VGroup(*[m.copy() for m in self._unit(p.po)])) for p in pairs],
                  run_time=min(0.9, d * 0.4))
        self.play(*[Transform(p.s_out0, b) for p, b in zip(pairs, backs)], run_time=min(0.9, d * 0.4))
        self.pause(0.4)

        # ---- the product
        e1 = M("<i>E</i><sub><i>k</i></sub> ⋯ <i>E</i><sub>2</sub><i>E</i><sub>1</sub><i>A</i> = <i>R</i>", 34)
        e2 = M("<i>E</i> = <i>E</i><sub><i>k</i></sub> ⋯ <i>E</i><sub>1</sub> = <i>E</i><sub><i>k</i></sub> ⋯ "
               "<i>E</i><sub>1</sub><i>I</i>", 34)
        VGroup(e1, e2).arrange(DOWN, buff=0.6).move_to(np.array([0, 0.3, 0]))
        d = self.say()                                   # elimination multiplies...; product is E
        self.play(FadeOut(VGroup(allp, *[p.s_out0 for p in pairs], pairs[0].extra)), run_time=0.6)
        self.play(FadeIn(e1), run_time=min(1.6, d * 0.15))
        self.wait(d * 0.35)
        self.play(FadeIn(e2), run_time=min(1.6, d * 0.15))
        self.pause(0.8)
        self.e_prod = VGroup(e1, e2)

    def _unit(self, p):
        return VGroup(Polygon(p.c2p(0, 0), p.c2p(1, 0), p.c2p(1, 1), p.c2p(0, 1), stroke_width=0, fill_color=WHITE,
                              fill_opacity=0.18),
                      vec(p, 1, 0, C_U, width=4, tip=0.14), vec(p, 0, 1, C_Q, width=4, tip=0.14))

    # ------------------------------------------------------------------------------------------------
    def inverse(self):
        g1 = M("[<i>A</i> | <i>I</i>]", 34)
        g2 = M("→  [<i>EA</i> | <i>EI</i>]", 34)
        g3 = M("=  [<i>I</i> | <i>E</i>]", 34)
        top = VGroup(g1, g2, g3).arrange(RIGHT, buff=0.3).move_to(np.array([0, 1.6, 0]))
        qm = M("→  ?", 34).next_to(g1, RIGHT, buff=0.3)
        c1 = M("<i>EA</i> = <i>I</i>,   <i>E</i> invertible", 30)
        c2 = M("<i>A</i> = <i>E</i><sup>−1</sup>,   <i>A</i><sup>−1</sup> = <i>E</i>", 30)
        VGroup(c1, c2).arrange(DOWN, buff=0.35).move_to(np.array([0, -0.2, 0]))
        term = P("Gauss–Jordan inversion", 28, C_V).move_to(np.array([0, -1.9, 0]))
        d = self.say()                                   # reaches the identity: what has it found?
        self.play(FadeOut(self.e_prod), run_time=0.5)
        self.play(FadeIn(g1), FadeIn(qm), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # multiply by E; EA = I, E invertible
        self.play(ReplacementTransform(qm, g2), run_time=min(1.0, d * 0.15))
        self.wait(d * 0.2)
        self.play(FadeIn(g3), run_time=min(1.0, d * 0.15))
        self.play(FadeIn(c1), run_time=min(1.0, d * 0.15))
        d = self.say()                                   # A = E^-1, A^-1 = E; right block holds E
        self.play(FadeIn(c2), run_time=min(1.0, d * 0.15))
        self.wait(d * 0.2)
        self.play(Indicate(g3, color=C_V), run_time=min(1.2, d * 0.15))
        d = self.say()                                   # TERM Gauss-Jordan inversion
        self.play(FadeIn(term), run_time=min(1.0, d * 0.5))
        self.pause(0.6)

        # ---- the worked example
        rows = [["1", "1", "0", "1", "0", "0"], ["1", "2", "1", "0", "1", "0"], ["0", "1", "2", "0", "0", "1"]]
        G = gmat(rows, size=32, pitch=0.85, vb=0.62, bar=3).move_to(np.array([-1.6, 1.2, 0]))
        steps = [(1, "<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − <i>R</i><sub>1</sub>", ["0", "1", "1", "−1", "1", "0"]),
                 (2, "<i>R</i><sub>3</sub> ← <i>R</i><sub>3</sub> − <i>R</i><sub>2</sub>", ["0", "0", "1", "1", "−1", "1"]),
                 (1, "<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − <i>R</i><sub>3</sub>", ["0", "1", "0", "−2", "2", "−1"]),
                 (0, "<i>R</i><sub>1</sub> ← <i>R</i><sub>1</sub> − <i>R</i><sub>2</sub>", ["1", "0", "0", "3", "−2", "1"])]
        ops = VGroup(*[M(f"{k + 1}.  " + t, 28, C_DIM) for k, (_, t, _) in enumerate(steps)])
        ops.arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to(np.array([4.4, 1.2, 0]))
        blab = VGroup(M("<i>A</i>", 28, C_DIM).next_to(VGroup(*[G.cells[2][j] for j in range(3)]), DOWN, buff=0.35),
                      M("<i>I</i>", 28, C_DIM).next_to(VGroup(*[G.cells[2][j] for j in range(3, 6)]), DOWN, buff=0.35))
        d = self.say()                                   # take the matrix on screen
        self.play(FadeOut(VGroup(g1, g2, g3, c1, c2, term)), run_time=0.5)
        self.play(FadeIn(G), FadeIn(blab), run_time=min(1.2, d * 0.6))
        self.pause(0.4)

        def do(k, rt):
            i, _, new = steps[k]
            box = SurroundingRectangle(VGroup(*G.cells[i]), color=C_V, buff=0.08, stroke_width=2)
            nr = swap_row(G, i, new)
            self.play(ops[k].animate.set_color(WHITE), Create(box), run_time=rt * 0.3)
            self.play(*[Transform(G.cells[i][j], nr[j]) for j in range(6)], run_time=rt * 0.5)
            self.play(FadeOut(box), run_time=rt * 0.2)

        d = self.say()                                   # two steps down; pivots 1, 1, 1
        self.play(FadeIn(ops), run_time=0.4)
        do(0, max(1.0, (d - 0.6) / 2))
        do(1, max(1.0, (d - 0.6) / 2))
        d = self.say()                                   # two more up
        do(2, max(0.8, d / 2))
        do(3, max(0.8, d / 2))
        rblock = VGroup(*[G.cells[i][j] for i in range(3) for j in range(3, 6)])
        d = self.say()                                   # watch the right block
        self.play(rblock.animate.set_color(C_V), run_time=min(0.8, d * 0.6))
        d = self.say()                                   # starts as I, collects every operation
        self.play(Indicate(rblock, color=C_V, scale_factor=1.05), run_time=min(1.4, d * 0.5))
        self.pause(2.0)                                  # ⏸ follow the steps

        Ainv = VGroup(M("<i>A</i><sup>−1</sup> =", 30),
                      gmat([["3", "−2", "1"], ["−2", "2", "−1"], ["1", "−1", "1"]], size=30, pitch=0.8, vb=0.55,
                           color=C_V)).arrange(RIGHT, buff=0.25).move_to(np.array([-3.3, -1.95, 0]))
        chk = VGroup(M("<i>A</i> (3, −2, 1) = (3 − 2,  3 − 4 + 1,  −2 + 2)", 28),
                     M("= (1, 0, 0)", 28)).arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to(np.array([2.9, -1.95, 0]))
        IE = VGroup(M("<i>I</i>", 28, C_DIM).move_to(blab[0]), M("<i>A</i><sup>−1</sup>", 28, C_V).move_to(blab[1]))
        d = self.say()                                   # left block identity, right block A^-1
        self.play(ReplacementTransform(blab, IE), run_time=min(1.0, d * 0.3))
        self.play(TransformFromCopy(rblock, Ainv[1]), FadeIn(Ainv[0]), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # check: first column
        col1 = SurroundingRectangle(VGroup(*[Ainv[1].cells[i][0] for i in range(3)]), color=WHITE, buff=0.07,
                                    stroke_width=2)
        self.play(Create(col1), FadeIn(chk[0]), run_time=min(1.6, d * 0.4))
        self.play(FadeIn(chk[1]), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # exactly e one
        self.play(Indicate(chk[1], color=WHITE), run_time=min(1.0, d * 0.7))
        self.pause(2.0)                                  # ⏸ read the inverse and its check
        d = self.say()                                   # if a row of zeros instead...
        lblock = VGroup(*[G.cells[i][j] for i in range(3) for j in range(3)])
        self.play(Indicate(lblock, color=WHITE, scale_factor=1.05), run_time=min(1.4, d * 0.4))
        self.say()                                       # certainly not invertible?
        self.pause(0.6)
        self.play(FadeOut(VGroup(G, ops, IE, Ainv, chk, col1)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def eleven(self):
        N = {1: node("1", "<i>A</i> invertible", (-5.3, 1.0)),
             11: node("11", "<i>A</i>ᵀ invertible", (-5.3, 2.9)),
             9: node("9", "<i>BA</i> = <i>I</i> for some <i>B</i>", (-1.9, 2.9)),
             2: node("2", "<i>N</i>(<i>A</i>) = {<b>0</b>}", (1.75, 2.9)),
             3: node("3", "columns independent", (5.15, 2.9)),
             4: node("4", "rank <i>A</i> = <i>n</i>", (5.0, 0.4)),
             5: node("5", "RREF of <i>A</i> is <i>I</i>", (2.4, -1.1)),
             6: node("6", ["<i>A</i> is a product of", "elementary matrices"], (-2.9, -1.1)),
             10: node("10", "<i>AC</i> = <i>I</i> for some <i>C</i>", (-4.75, -2.65)),
             7: node("7", "<i>A</i><b>x</b> = <b>b</b> solvable for every <b>b</b>", (-0.5, -2.65)),
             8: node("8", "columns span ℝ<sup><i>n</i></sup>", (4.3, -2.65))}
        # keep everything on screen
        for n in N.values():
            if n.get_right()[0] > 6.85:
                n.shift(LEFT * (n.get_right()[0] - 6.85))
            if n.get_left()[0] < -6.85:
                n.shift(RIGHT * (-6.85 - n.get_left()[0]))
        centre = M("<i>A</i>:  <i>n</i> × <i>n</i>", 30).move_to(np.array([-0.4, 0.75, 0]))
        E = {}
        for a, b, dbl in [(1, 9, 0), (9, 2, 0), (2, 3, 1), (2, 4, 0), (4, 5, 0), (5, 6, 0), (6, 1, 0),
                          (1, 10, 0), (10, 7, 0), (7, 8, 1), (8, 4, 0), (1, 11, 1)]:
            E[(a, b)] = link(N[a], N[b], double=bool(dbl))
        reasons = {
            (9, 2): M("<b>x</b> = <i>BA</i><b>x</b> = <i>B</i><b>0</b> = <b>0</b>", 24, C_DIM),
            (2, 4): M("rank = <i>n</i> − 0", 24, C_DIM),
            (5, 6): M("<i>A</i> = <i>E</i><sub>1</sub><sup>−1</sup> ⋯ <i>E</i><sub><i>k</i></sub><sup>−1</sup>", 24, C_DIM),
            (6, 1): M("Theorem 3", 24, C_DIM)}
        reasons[(9, 2)].next_to(E[(9, 2)], DOWN, buff=0.15)
        reasons[(2, 4)].next_to(E[(2, 4)].get_center(), DL, buff=0.1)
        reasons[(5, 6)].next_to(E[(5, 6)], UP, buff=0.12)
        reasons[(6, 1)].next_to(E[(6, 1)].get_center(), UR, buff=0.08)
        for r in reasons.values():
            bglab(r)
        for n in N.values():
            n.set_opacity(0.3)
            n[0].set_fill(opacity=0)

        def lit(*ks):
            return [N[k].animate.set_opacity(1) for k in ks]

        def fix(*ks):
            for k in ks:
                N[k][0].set_fill(opacity=0)

        d = self.say()                                   # how many properties are one?
        self.play(FadeIn(centre), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # the screen lists eleven
        self.play(LaggedStart(*[FadeIn(N[k]) for k in range(1, 12)], lag_ratio=0.1), run_time=min(1.6, d * 0.9))
        d = self.say()                                   # one thread: collapse
        self.play(Indicate(centre), run_time=min(1.2, d * 0.4))
        self.pause(0.4)

        d = self.say()                                   # undone from the left: 1 => 9
        self.play(*lit(1), run_time=0.5)
        self.play(GrowArrow(E[(1, 9)]), *lit(9), run_time=min(1.4, d * 0.4))
        d = self.say()                                   # nothing crushed: 9 => 2
        self.play(GrowArrow(E[(9, 2)]), FadeIn(reasons[(9, 2)]), *lit(2), run_time=min(1.6, d * 0.3))
        d = self.say()                                   # 2 <=> 3
        self.play(GrowArrow(E[(2, 3)]), *lit(3), run_time=min(1.4, d * 0.5))
        d = self.say()                                   # rank n; RREF = I
        self.play(GrowArrow(E[(2, 4)]), FadeIn(reasons[(2, 4)]), *lit(4), run_time=min(1.4, d * 0.3))
        self.wait(max(0, d * 0.4 - 1.4))
        self.play(GrowArrow(E[(4, 5)]), *lit(5), run_time=min(1.4, d * 0.3))
        d = self.say()                                   # 5 => 6
        self.play(GrowArrow(E[(5, 6)]), FadeIn(reasons[(5, 6)]), *lit(6), run_time=min(1.6, d * 0.4))
        d = self.say()                                   # 6 => 1
        self.play(GrowArrow(E[(6, 1)]), FadeIn(reasons[(6, 1)]), run_time=min(1.4, d * 0.5))
        fix(*N.keys())
        self.pause(3.0)                                  # ⏸ trace the cycle

        d = self.say()                                   # other statements hang off the thread
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # right inverse: 1 => 10 => 7 <=> 8 => 4
        q = d / 4.5
        self.play(GrowArrow(E[(1, 10)]), *lit(10), run_time=q)
        self.play(GrowArrow(E[(10, 7)]), *lit(7), run_time=q)
        self.play(GrowArrow(E[(7, 8)]), *lit(8), run_time=q)
        self.play(GrowArrow(E[(8, 4)]), run_time=q)
        d = self.say()                                   # 1 <=> 11, Theorem 3
        self.play(GrowArrow(E[(1, 11)]), *lit(11), run_time=min(1.4, d * 0.5))
        fix(*N.keys())
        last = M("<i>BA</i> = <i>I</i>  ⇒  <i>B</i> = <i>B</i>(<i>AA</i><sup>−1</sup>) = (<i>BA</i>)<i>A</i><sup>−1</sup> = "
                 "<i>A</i><sup>−1</sup>;   likewise <i>AC</i> = <i>I</i>  ⇒  <i>C</i> = <i>A</i><sup>−1</sup>", 26)
        last.move_to(np.array([0, -3.55, 0]))
        if last.width > 13.4:
            last.scale_to_fit_width(13.4)
        d = self.say()                                   # one-sided inverse is the inverse
        self.play(FadeIn(last), run_time=min(1.6, d * 0.4))
        self.pause(2.0)                                  # ⏸ read the last line

        ring = lambda k: SurroundingRectangle(N[k], color=WHITE, buff=0.06, stroke_width=3)
        d = self.say()                                   # answers the zero-row question
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # fewer than n pivots breaks the thread at the rank
        r4 = ring(4)
        self.play(Create(r4), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # a claim chapter one left open
        self.play(FadeOut(r4), run_time=min(0.6, d * 0.3))
        d = self.say()                                   # null space zero => invertible
        r2, r1 = ring(2), ring(1)
        self.play(Create(r2), run_time=min(0.8, d * 0.3))
        self.play(Create(r1), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # why elimination worked on our first system
        self.play(FadeOut(r2), FadeOut(r1), run_time=min(0.6, d * 0.3))
        d = self.say()                                   # three pivots: full rank, unique
        r4, r2 = ring(4), ring(2)
        self.play(Create(r4), run_time=min(0.8, d * 0.3))
        self.play(Create(r2), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # determinant: chapter five
        self.play(FadeOut(r4), FadeOut(r2), run_time=min(0.6, d * 0.2))
        self.pause(0.6)

        # ---- the picture
        graph = VGroup(*N.values(), *E.values(), *reasons.values(), centre, last)
        pin, pout, tin, tout, arr, alab = two_by_two()
        sq = Polygon(pin.c2p(0, 0), pin.c2p(1, 0), pin.c2p(1, 1), pin.c2p(0, 1), stroke_color=WHITE,
                     stroke_width=2.5, fill_color=WHITE, fill_opacity=0.18)
        img = sq.copy().move_to(pout.c2p(0.5, 0.5))
        par = para(pout, (2, 1), (-1, 1))
        a1, a2 = vec(pout, 2, 1, C_U, width=5), vec(pout, -1, 1, C_Q, width=5)
        area = bglab(M("area 3", 26).move_to(pout.c2p(0.5, 1.5)), op=0.6)
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=30, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_grp = VGroup(M("<i>A</i> =", 30), A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.9, 0]))
        d = self.say()                                   # an invertible map never flattens space
        self.play(FadeOut(graph), run_time=0.6)
        self.play(Create(pin), Create(pout), FadeIn(VGroup(tin, tout, arr, alab, A_grp, sq)), run_time=min(1.6, d * 0.5))
        d = self.say()                                   # square -> genuine parallelogram
        self.play(TransformFromCopy(sq, img), run_time=min(0.8, d * 0.3))
        self.play(Transform(img, par), GrowArrow(a1), GrowArrow(a2), FadeIn(area), run_time=min(1.6, d * 0.5))
        whole = Polygon(pout.c2p(-2, -2), pout.c2p(4, -2), pout.c2p(4, 6), pout.c2p(-2, 6), stroke_width=0,
                        fill_color=C_COLW, fill_opacity=0.10)
        z = Dot(pin.c2p(0, 0), radius=0.08, color=C_NULL)
        d = self.say()                                   # nothing crushed, every output hit
        self.play(FadeIn(z), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(whole), run_time=min(1.0, d * 0.3))
        A2 = matrix_mob([["1", "2"], ["2", "4"]], size=30, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A2_grp = VGroup(M("<i>A</i> =", 30), A2).arrange(RIGHT, buff=0.2).move_to(A_grp)
        flat = para(pout, (1, 2), (2, 4))
        area0 = bglab(M("area 0", 26).next_to(pout.c2p(1.0, 2.0), LEFT, buff=0.25), op=0.85)
        d = self.say()                                   # eleven ways of saying no collapse
        self.play(Indicate(img, color=WHITE, scale_factor=1.04), run_time=min(1.0, d * 0.25))
        self.play(FadeOut(whole), FadeOut(area), ReplacementTransform(A_grp, A2_grp), run_time=min(0.8, d * 0.15))
        self.play(Transform(img, flat), Transform(a1, vec(pout, 1, 2, C_U, width=5)),
                  Transform(a2, vec(pout, 2, 4, C_Q, width=5)), FadeIn(area0), run_time=min(1.6, d * 0.35))
        self.pause(0.8)
        self.play(FadeOut(VGroup(pin, pout, tin, tout, arr, alab, A2_grp, sq, img, a1, a2, area0, z)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def rectangular(self):
        def blk(w, h, lab, color=C_DIM):
            r = Rectangle(width=w, height=h, stroke_color=color, stroke_width=2, fill_color="#3A4150", fill_opacity=0.8)
            return VGroup(r, M(lab, 28).move_to(r))
        Bt, At = blk(1.9, 1.0, "<i>B</i>"), blk(1.0, 1.9, "<i>A</i>")
        Aw, Cw = blk(1.9, 1.0, "<i>A</i>"), blk(1.0, 1.9, "<i>C</i>")
        L = VGroup(Bt, At, M("= <i>I</i><sub><i>n</i></sub> ?", 30)).arrange(RIGHT, buff=0.2).move_to(np.array([-3.5, 1.6, 0]))
        R = VGroup(Aw, Cw, M("= <i>I</i><sub><i>m</i></sub> ?", 30)).arrange(RIGHT, buff=0.2).move_to(np.array([3.5, 1.6, 0]))
        Ll = M("tall: <i>m</i> &gt; <i>n</i>", 26, C_DIM).next_to(L, UP, buff=0.3)
        Rl = M("wide: <i>m</i> &lt; <i>n</i>", 26, C_DIM).next_to(R, UP, buff=0.3)
        d = self.say()                                   # inverse on both sides?
        self.play(FadeIn(VGroup(L, R, Ll, Rl)), run_time=min(1.6, d * 0.5))
        self.pause(3.0)                                  # ⏸ predict (chains hidden)
        c1 = M("<i>BA</i> = <i>I</i><sub><i>n</i></sub>  ⇒  <i>N</i>(<i>A</i>) = {<b>0</b>}  ⇒  "
               "<i>n</i> = rank <i>A</i> ≤ <i>m</i>", 30)
        c2 = M("<i>AC</i> = <i>I</i><sub><i>m</i></sub>  ⇒  every <b>b</b> reachable  ⇒  "
               "<i>m</i> = rank <i>A</i> ≤ <i>n</i>", 30)
        c3 = M("both  ⇒  <i>m</i> = <i>n</i>", 32, C_V)
        VGroup(c1, c2, c3).arrange(DOWN, buff=0.35).move_to(np.array([0, -1.5, 0]))
        d = self.say()                                   # the chains, m = n, only square
        self.play(FadeIn(c1), run_time=min(1.4, d * 0.1))
        self.wait(d * 0.25)
        self.play(FadeIn(c2), run_time=min(1.4, d * 0.1))
        self.wait(d * 0.25)
        self.play(FadeIn(c3), run_time=min(1.0, d * 0.08))
        d = self.say()                                   # one-sided inverses return in least squares
        self.play(Indicate(VGroup(Ll, Rl), color=WHITE, scale_factor=1.05), run_time=min(1.4, d * 0.3))
