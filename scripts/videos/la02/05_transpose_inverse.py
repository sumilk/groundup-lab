"""Turning rows into columns, and running a map backwards.
Script: docs/LA02_VIDEO_SCRIPT.md, section "Turning rows into columns, and running a map backwards".
"""
import importlib

from sample import *  # noqa: F401,F403
from sample import panel, LEFT_C, RIGHT_C, TOP_Y, UNIT, C_L1, C_L2

_m4 = importlib.import_module("04_one_map_after_another")
mat2, col_box, row_box, eqrow = _m4.mat2, _m4.col_box, _m4.row_box, _m4.eqrow

C_PROOF = "#B8BFCC"


def T_(s):
    return f"{s}<sup>T</sup>"


INV = "<sup>−1</sup>"


class TransposeInverse(NScene):
    PARAS = [
        # ---- the transpose
        ["When we first read A x row by row, the rows did half the work.",
         "To use the same tools on rows that you use on columns, you need a way to turn rows into columns.",
         "Tip each row over, so that row one becomes column one, and row two becomes column two.",
         "The result is the transpose, written A with a small T."],
        ["The entry in row i, column j of A transpose is the entry in row j, column i of A. "
         "A two by three matrix has a three by two transpose.",
         "A matrix that equals its own transpose is called symmetric."],
        ["The dot product is a product of this kind.",
         "Tip x over into a row, one by n, and multiply it by y, n by one.",
         "The result is one by one, a single number, and it's the dot product."],
        ["What is the transpose of a product?",
         "A guess would be A transpose times B transpose.",
         "Check the shapes before the entries.",
         "If A is m by n and B is n by p, then A transpose is n by m and B transpose is p by n."],
        ["A transpose times B transpose needs m to equal p, which it usually doesn't.",
         "The other order, B transpose times A transpose, always fits, and it's the right one."],
        ["Follow one entry.",
         "The i j entry of the transpose is the j i entry of A B, row j of A against column i of B. "
         "Read the other way round, it's a row of B transpose against a column of A transpose.",
         "So the transpose of A B is B transpose times A transpose."],
        ["With the pair A and B from before, both sides come out the same.",
         "The order reverses, the way it does when you undo a sequence of steps.",
         "You put on socks, then shoes.",
         "To take them off, you remove the shoes first."],
        # ---- running the map backwards
        ["Our A carries the recipe two, three to the target one, five.",
         "Is there a map that runs the other way, taking the target back to the recipe?"],
        ["If there were, call it B, then doing A and then B would return every input to where it started.",
         "And doing B then A would return every output.",
         "Both B A and A B would be the identity."],
        ["A square matrix with such a partner is called invertible.",
         "One with no such partner is called singular."],
        ["For two by two matrices there's a formula you can check by multiplying out.",
         "Swap the two diagonal entries, change the sign of the other two, and divide everything by p s minus "
         "q r.",
         "It works whenever that number isn't zero."],
        ["For our A, p s minus q r is three.",
         "Swap the diagonal entries, change the signs off it, and divide by three.",
         "Now send the target one, five back through it."],
        ["One plus five is six, minus one plus ten is nine, and a third of that is two, three.",
         "The target goes back to the crossing point."],
        ["One more, from the written chapter.",
         "For two, one, five, three, p s minus q r is one, so the inverse is three, minus one, minus five, two.",
         "The check on screen multiplies out the first column of the product and gets one, zero, the first "
         "column of the identity."],
        # ---- what inverses obey
        ["Four facts follow almost at once.",
         "First, there can only be one inverse.",
         "If B and C both undo A, then B equals B times A C, which is B A times C, which is C."],
        ["Second, the inverse of a product is the product of the inverses, in reverse order.",
         "Shoes and socks again."],
        ["Third, the inverse of A transpose is the transpose of A inverse.",
         "Transpose the equation A times A inverse equals I, and use the rule you just saw."],
        ["And fourth, when A is invertible, A x equals b has exactly one solution, A inverse b.",
         "It works, because A undoes A inverse.",
         "And it's the only one, because any solution x equals A inverse times A x, which is A inverse b."],
        # ---- a matrix nothing can undo
        ["Not every square matrix can be undone.",
         "Take the columns one, two and two, four.",
         "The second is twice the first, so both lie on one line.",
         "The whole input plane lands on that line."],
        ["Two copies of the first column, minus one copy of the second, gets you nowhere.",
         "Two, minus one is sent to zero, zero.",
         "And so is the zero vector, as it is under every matrix.",
         "Could any map undo this?"],
        ["To undo it, a map would have to send zero, zero back to two, minus one, and also back to zero.",
         "A map can't send one input to two places.",
         "So this matrix is singular.",
         "Later, that observation becomes a complete test for invertibility."],
    ]


    def construct(self):
        self.transpose()
        self.backwards()
        self.theorem()
        self.singular()
        self.done()
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def transpose(self):
        A = matrix_mob([["1", "0", "2"], ["−1", "3", "1"]], size=36)
        A.move_to(np.array([-2.6, 1.6, 0]))
        An = M("<i>A</i> =", 34).next_to(A, LEFT, buff=0.2)
        AT = matrix_mob([["1", "−1"], ["0", "3"], ["2", "1"]], size=36,
                        entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        AT.move_to(np.array([3.2, 1.6, 0]))
        ATn = M("<i>A</i><sup>T</sup> =", 34).next_to(AT, LEFT, buff=0.2)
        rows = VGroup(row_box(A, 0), row_box(A, 1))
        d = self.say()                                   # read row by row, rows did half the work
        self.play(FadeIn(A), FadeIn(An), run_time=min(1.0, d * 0.4))
        self.play(Create(rows), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # turn rows into columns
        self.play(Indicate(rows[0], color=WHITE), run_time=min(0.8, d * 0.4))
        self.play(Indicate(rows[1], color=WHITE), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # tip each row over
        self.play(FadeIn(VGroup(AT[0], AT[2])), run_time=0.4)
        self.play(*[TransformFromCopy(A.entries[0][j], AT.entries[j][0], path_arc=-PI / 2) for j in range(3)],
                  run_time=min(1.4, d * 0.4))
        self.play(*[TransformFromCopy(A.entries[1][j], AT.entries[j][1], path_arc=-PI / 2) for j in range(3)],
                  run_time=min(1.4, d * 0.4))
        term = P("transpose", 24, C_DIM).next_to(AT, UP, buff=0.25)
        d = self.say()                                   # the transpose, A with a small T
        self.play(FadeOut(rows), FadeIn(ATn), FadeIn(term), run_time=min(1.2, d * 0.6))

        rule = M("(<i>A</i><sup>T</sup>)<sub><i>ij</i></sub> = <i>A</i><sub><i>ji</i></sub>", 34)
        rule.move_to(np.array([0, -0.6, 0]))
        bx1 = SurroundingRectangle(A.entries[0][2], color=WHITE, buff=0.1, corner_radius=0.06)
        bx2 = SurroundingRectangle(AT.entries[2][0], color=WHITE, buff=0.1, corner_radius=0.06)
        sA = M("2 × 3", 28, C_DIM).next_to(A, DOWN, buff=0.3)
        sT = M("3 × 2", 28, C_DIM).next_to(AT, DOWN, buff=0.3)
        gen = M("<i>m</i> × <i>n</i>  →  <i>n</i> × <i>m</i>", 28, C_DIM).next_to(rule, DOWN, buff=0.4)
        d = self.say()                                   # (A^T)ij = Aji; 2 × 3 has a 3 × 2 transpose
        self.play(FadeIn(rule), run_time=min(1.0, d * 0.2))
        self.play(Create(bx1), Create(bx2), run_time=min(1.0, d * 0.2))
        self.wait(d * 0.25)
        self.play(FadeOut(bx1), FadeOut(bx2), FadeIn(sA), FadeIn(sT), FadeIn(gen), run_time=min(1.0, d * 0.2))
        sym = VGroup(P("symmetric", 26, C_DIM), M("<i>A</i><sup>T</sup> = <i>A</i>", 32)).arrange(RIGHT, buff=0.35)
        sym.move_to(np.array([0, -2.6, 0]))
        d = self.say()                                   # symmetric
        self.play(FadeIn(sym), run_time=min(1.0, d * 0.6))
        self.pause(0.6)

        # ---- the dot product as x^T y
        xc = matrix_mob([["<i>x</i><sub>1</sub>"], ["⋮"], ["<i>x</i><sub><i>n</i></sub>"]], size=32)
        yc = matrix_mob([["<i>y</i><sub>1</sub>"], ["⋮"], ["<i>y</i><sub><i>n</i></sub>"]], size=32)
        xr = matrix_mob([["<i>x</i><sub>1</sub>", "⋯", "<i>x</i><sub><i>n</i></sub>"]], size=32)
        xc.move_to(np.array([-4.2, 0.6, 0]))
        yc.move_to(np.array([-0.4, 0.6, 0]))
        xr.next_to(yc, LEFT, buff=0.25)
        xl = M("<b>x</b>", 30).next_to(xc, UP, buff=0.2)
        yl = M("<b>y</b>", 30).next_to(yc, UP, buff=0.2)
        xrl = M("<b>x</b><sup>T</sup>", 30).next_to(xr, UP, buff=0.2).align_to(yl, DOWN)
        s1 = M("1 × <i>n</i>", 26, C_DIM).next_to(xr, DOWN, buff=0.75)
        s2 = M("<i>n</i> × 1", 26, C_DIM).next_to(yc, DOWN, buff=0.25).align_to(s1, DOWN)
        res = M("= <i>x</i><sub>1</sub><i>y</i><sub>1</sub> + ⋯ + <i>x</i><sub><i>n</i></sub><i>y</i><sub><i>n</i></sub>",
                32).next_to(yc, RIGHT, buff=0.3)
        s3 = M("1 × 1", 26, C_DIM).next_to(res, DOWN, buff=0.25).align_to(s1, DOWN)
        dotf = M("<b>x</b> · <b>y</b> = <b>x</b><sup>T</sup><b>y</b>", 34).move_to(np.array([0, -2.4, 0]))
        d = self.say()                                   # the dot product is a product of this kind
        self.play(FadeOut(VGroup(A, An, AT, ATn, term, rule, sA, sT, gen, sym)), run_time=0.6)
        self.play(FadeIn(VGroup(xc, xl, yc, yl)), run_time=min(1.0, max(0.4, d - 0.7)))
        d = self.say()                                   # tip x over: 1 × n times n × 1
        self.play(ReplacementTransform(xc, xr), ReplacementTransform(xl, xrl), run_time=min(1.4, d * 0.4))
        self.play(FadeIn(s1), FadeIn(s2), run_time=min(0.8, d * 0.3))
        d = self.say()                                   # 1 × 1: a single number, the dot product
        self.play(FadeIn(res), FadeIn(s3), run_time=min(1.2, d * 0.4))
        self.play(FadeIn(dotf), run_time=min(1.0, d * 0.4))
        self.pause(0.6)

        # ---- the transpose of a product
        q = M("(<i>AB</i>)<sup>T</sup> = ?", 34).move_to(np.array([-3.6, 3.2, 0]))
        guess = VGroup(P("a guess:", 24, C_DIM), M("<i>A</i><sup>T</sup><i>B</i><sup>T</sup>", 34)).arrange(RIGHT, buff=0.25)
        guess.move_to(np.array([2.6, 3.2, 0]))
        d = self.say()                                   # what is the transpose of a product?
        self.play(FadeOut(VGroup(xr, xrl, yc, yl, s1, s2, res, s3, dotf)), run_time=0.5)
        self.play(FadeIn(q), run_time=min(1.0, max(0.4, d - 0.6)))
        d = self.say()                                   # a guess: A^T B^T
        self.play(FadeIn(guess), run_time=min(1.0, d * 0.6))
        d = self.say()                                   # check the shapes first
        self.wait(max(0, d - 0.1))
        sh = VGroup(
            VGroup(M("<i>A</i>: <i>m</i> × <i>n</i>", 30), M("<i>B</i>: <i>n</i> × <i>p</i>", 30)),
            VGroup(M("<i>A</i><sup>T</sup>: <i>n</i> × <i>m</i>", 30), M("<i>B</i><sup>T</sup>: <i>p</i> × <i>n</i>", 30)))
        for k, r in enumerate(sh):
            r[0].move_to(np.array([-2.2, 2.0 - 0.7 * k, 0]), aligned_edge=LEFT)
            r[1].move_to(np.array([1.4, 2.0 - 0.7 * k, 0]), aligned_edge=LEFT)
        d = self.say()                                   # A is m × n, B is n × p; transposes
        self.play(FadeIn(sh[0]), run_time=min(1.0, d * 0.35))
        self.play(FadeIn(sh[1]), run_time=min(1.0, d * 0.35))
        self.pause(3.0)                                  # ⏸ which order fits? (B^T A^T and the proof hidden)

        bad = eqrow("<i>A</i><sup>T</sup><i>B</i><sup>T</sup>:", "(<i>n</i> ×", "<i>m</i>", ")(", "<i>p</i>",
                    "× <i>n</i>)", size=30, buff=0.16)
        bad.move_to(np.array([-2.2, 0.0, 0]), aligned_edge=LEFT)
        bad_note = M("needs <i>m</i> = <i>p</i>", 28, C_DIM).next_to(bad, RIGHT, buff=0.5)
        good = eqrow("<i>B</i><sup>T</sup><i>A</i><sup>T</sup>:", "(<i>p</i> ×", "<i>n</i>", ")(", "<i>n</i>",
                     "× <i>m</i>)", "= <i>p</i> × <i>m</i>", size=30, buff=0.16)
        good.move_to(np.array([-2.2, -0.75, 0]), aligned_edge=LEFT)
        d = self.say()                                   # A^T B^T needs m = p
        rb = VGroup(*[Circle(radius=0.19, color=C_DIM, stroke_width=2.5).move_to(bad[k]) for k in (2, 4)])
        self.play(FadeIn(bad), run_time=min(1.0, d * 0.35))
        self.play(Create(rb), FadeIn(bad_note), run_time=min(1.0, d * 0.35))
        d = self.say()                                   # B^T A^T always fits
        rg = VGroup(*[Circle(radius=0.19, color=WHITE, stroke_width=2.5).move_to(good[k]) for k in (2, 4)])
        self.play(FadeIn(good), run_time=min(1.0, d * 0.4))
        self.play(Create(rg), run_time=min(0.8, d * 0.3))
        self.pause(0.6)

        # ---- the entry-by-entry proof
        pf1 = M("((<i>AB</i>)<sup>T</sup>)<sub><i>ij</i></sub>", 32)
        pf2 = M("= (<i>AB</i>)<sub><i>ji</i></sub> = Σ<sub><i>k</i></sub> <i>A</i><sub><i>jk</i></sub><i>B</i><sub><i>ki</i></sub>", 32)
        pf3 = M("= Σ<sub><i>k</i></sub> (<i>B</i><sup>T</sup>)<sub><i>ik</i></sub>(<i>A</i><sup>T</sup>)<sub><i>kj</i></sub>"
                " = (<i>B</i><sup>T</sup><i>A</i><sup>T</sup>)<sub><i>ij</i></sub>", 32)
        VGroup(pf1, pf2).arrange(RIGHT, buff=0.15).move_to(np.array([-0.3, 1.7, 0]))
        pf3.next_to(pf2, DOWN, buff=0.35).align_to(pf2, LEFT)
        d = self.say()                                   # follow one entry
        self.play(FadeOut(VGroup(sh, bad, bad_note, rb, good, rg)), run_time=0.5)
        self.play(FadeIn(pf1), run_time=min(0.8, max(0.3, d - 0.6)))
        d = self.say()                                   # ji entry of AB; read the other way round
        self.play(FadeIn(pf2), run_time=min(1.4, d * 0.35))
        self.wait(d * 0.2)
        self.play(FadeIn(pf3), run_time=min(1.4, d * 0.3))
        ans = M("(<i>AB</i>)<sup>T</sup> = <i>B</i><sup>T</sup><i>A</i><sup>T</sup>", 34).move_to(q, aligned_edge=LEFT)
        th2 = P("Theorem 2", 24, C_DIM).next_to(ans, RIGHT, buff=0.4)
        d = self.say()                                   # so (AB)^T = B^T A^T
        self.play(FadeOut(guess), ReplacementTransform(q, ans), FadeIn(th2), run_time=min(1.2, d * 0.5))
        self.pause(2.0)                                  # ⏸ follow the index swap

        # ---- check with the pair from "One map after another"
        ABT = mat2([["3", "2"], ["1", "2"]], col_colors=False)
        BT = mat2([["2", "1"], ["0", "1"]], col_colors=False)
        AT2 = mat2([["1", "0"], ["1", "2"]], col_colors=False)
        R = mat2([["3", "2"], ["1", "2"]], col_colors=False)
        lhs = VGroup(M("(<i>AB</i>)<sup>T</sup> =", 30), ABT).arrange(RIGHT, buff=0.2)
        rhs = VGroup(M("<i>B</i><sup>T</sup><i>A</i><sup>T</sup> =", 30), BT, AT2, M("=", 30), R).arrange(RIGHT, buff=0.2)
        VGroup(lhs, rhs).arrange(RIGHT, buff=1.0).move_to(np.array([0, -1.6, 0]))
        chk = VGroup(*lhs, VMobject(), *rhs)
        d = self.say()                                   # both sides come out the same
        self.play(FadeIn(chk[:2]), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(chk[3:6]), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(chk[6:]), run_time=min(0.8, d * 0.25))
        d = self.say()                                   # the order reverses
        self.play(Indicate(ans, color=WHITE), run_time=min(1.0, d * 0.6))
        d = self.say()                                   # socks, then shoes
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # shoes first
        self.wait(max(0, d - 0.1))
        self.pause(0.6)
        self.tp = VGroup(ans, th2, pf1, pf2, pf3, chk)

    # ------------------------------------------------------------------------------------------------
    def backwards(self):
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        l1 = Line(pin.c2p(0, -1), pin.c2p(3.5, 6), color=C_L1, stroke_width=4)
        l2 = Line(pin.c2p(-1, 6), pin.c2p(5, 0), color=C_L2, stroke_width=4)
        sol = dot(pin, 2, 3, WHITE, r=0.09)
        sol_lab = M("(2, 3)", 26).next_to(sol, LEFT, buff=0.25)
        sol_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.06)
        a1 = vec(pout, 2, 1, C_U, width=6).set_opacity(0.25)
        a2 = vec(pout, -1, 1, C_Q, width=6).set_opacity(0.25)
        pts = [(0, 0), (2, 1), (4, 2), (3, 3), (2, 4), (1, 5)]
        path = VGroup(*[vec_between(pout, pts[k], pts[k + 1], C_U if k < 2 else C_Q, width=5) for k in range(5)])
        tgt = dot(pout, 1, 5, C_W, r=0.1)
        tgt_lab = M("(1, 5)", 26, C_W).next_to(tgt, RIGHT, buff=0.12)
        arc = CurvedArrow(sol.get_center() + UP * 0.12 + RIGHT * 0.06, tgt.get_center() + LEFT * 0.2,
                          angle=-PI / 3, color=WHITE, stroke_width=4, tip_length=0.22)
        arc_lab = M("<i>A</i>", 34).move_to(arc.point_from_proportion(0.5) + UP * 0.3)
        arc_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.05)
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_grp = VGroup(M("<i>A</i> =", 34), A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))
        back = CurvedArrow(tgt.get_center() + DOWN * 0.15 + LEFT * 0.1, sol.get_center() + RIGHT * 0.15 + DOWN * 0.1,
                           angle=-PI / 3, color=WHITE, stroke_width=4, tip_length=0.22)
        back_line = ArcBetweenPoints(back.get_start(), back.get_end(), angle=-PI / 3)
        stub = back_line.copy().pointwise_become_partial(back_line, 0, 0.42)
        stub.set_stroke(WHITE, 4, opacity=0.7)
        cast = VGroup(pin, tin, l1, l2, sol, sol_lab, pout, tout, a1, a2, path, tgt, tgt_lab, arc, arc_lab, A_grp)

        d = self.say()                                   # A carries (2, 3) to (1, 5)
        self.play(FadeOut(self.tp), run_time=0.5)
        self.play(FadeIn(VGroup(pin, tin, pout, tout, l1, l2, a1, a2, A_grp)), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(sol), FadeIn(sol_lab), Create(path), FadeIn(tgt), FadeIn(tgt_lab), run_time=min(1.4, d * 0.35))
        self.play(Create(arc), FadeIn(arc_lab), run_time=min(1.0, d * 0.25))
        d = self.say()                                   # a map that runs the other way?
        self.wait(d * 0.4)
        self.play(Create(stub), run_time=min(1.2, d * 0.4))
        self.pause(0.4)

        # ---- the partner B
        eBA = M("<i>BA</i> = <i>I</i>", 32)
        eAB = M("<i>AB</i> = <i>I</i>", 32)
        VGroup(eBA, eAB).arrange(RIGHT, buff=1.0).move_to(np.array([-0.8, 3.3, 0]))
        both = M("<i>AB</i> = <i>BA</i> = <i>I</i>", 32).move_to(np.array([-0.8, 3.3, 0]))
        d = self.say()                                   # A then B returns every input
        self.play(FadeIn(eBA), run_time=min(1.0, d * 0.4))
        d = self.say()                                   # B then A returns every output
        self.play(FadeIn(eAB), run_time=min(1.0, d * 0.5))
        d = self.say()                                   # both are the identity
        self.play(ReplacementTransform(VGroup(eBA, eAB), both), run_time=min(1.2, d * 0.6))
        inv = P("invertible", 24).next_to(both, RIGHT, buff=0.8)
        sing = P("singular: no partner", 22, C_DIM).next_to(inv, DOWN, buff=0.15, aligned_edge=LEFT)
        d = self.say()                                   # invertible
        self.play(FadeIn(inv), run_time=min(0.8, d * 0.5))
        d = self.say()                                   # singular
        self.play(FadeIn(sing), run_time=min(0.8, d * 0.5))
        self.pause(0.6)

        # ---- the 2 × 2 formula
        G = matrix_mob([["<i>p</i>", "<i>q</i>"], ["<i>r</i>", "<i>s</i>"]], size=30)
        H = matrix_mob([["<i>s</i>", "−<i>q</i>"], ["−<i>r</i>", "<i>p</i>"]], size=30)
        frm = VGroup(G, M(INV + " =", 30), M("1 / (<i>ps</i> − <i>qr</i>)  ·", 30), H).arrange(RIGHT, buff=0.15)
        frm[1].align_to(G, UP).shift(DOWN * 0.02)
        frm.move_to(np.array([-0.6, 2.75, 0]))
        cond = M("when <i>ps</i> − <i>qr</i> ≠ 0", 26, C_DIM).next_to(frm, RIGHT, buff=0.5)
        d = self.say()                                   # a formula for 2 × 2
        self.play(FadeOut(VGroup(both, inv, sing)), run_time=0.4)
        self.play(FadeIn(VGroup(G, frm[1])), run_time=min(0.8, max(0.3, d - 0.6)))
        d = self.say()                                   # swap, change signs, divide
        self.play(FadeIn(VGroup(H[0], H[2])), TransformFromCopy(G.entries[1][1], H.entries[0][0], path_arc=PI / 2),
                  TransformFromCopy(G.entries[0][0], H.entries[1][1], path_arc=PI / 2), run_time=min(1.2, d * 0.3))
        self.play(TransformFromCopy(G.entries[0][1], H.entries[0][1]), TransformFromCopy(G.entries[1][0], H.entries[1][0]),
                  run_time=min(1.0, d * 0.25))
        self.play(FadeIn(frm[2]), run_time=min(0.8, d * 0.25))
        d = self.say()                                   # whenever that number isn't zero
        self.play(FadeIn(cond), run_time=min(0.8, d * 0.6))
        self.pause(0.6)

        # ---- the cast
        det = M("<i>ps</i> − <i>qr</i> = 2·1 − (−1)·1 = 3", 30).move_to(np.array([0, 3.5, 0]))
        Ai = matrix_mob([["1", "1"], ["−1", "2"]], size=28, v_buff=0.45)
        Ai_grp = VGroup(M("<i>A</i>" + INV + " = ⅓", 30), Ai).arrange(RIGHT, buff=0.15).move_to(np.array([-3.3, 2.7, 0]))
        q = M("<i>A</i>" + INV + "(1, 5) = ?", 30).move_to(np.array([3.0, 2.7, 0]))
        d = self.say()                                   # for our A, ps − qr = 3
        self.play(FadeOut(VGroup(frm, cond)), run_time=0.4)
        self.play(FadeIn(det), run_time=min(1.0, max(0.4, d - 0.6)))
        d = self.say()                                   # swap, change signs, divide by three
        self.play(FadeIn(Ai_grp), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # send the target back through it
        self.play(FadeIn(q), Indicate(tgt, color=C_W, scale_factor=1.6), run_time=min(1.2, d * 0.6))
        self.pause(3.0)                                  # ⏸ predict where A^-1 sends the target

        calc = M("<i>A</i>" + INV + "(1, 5) = ⅓ (1 + 5, −1 + 10) = ⅓ (6, 9) = (2, 3)", 30).move_to(det)
        back_lab = M("<i>A</i>" + INV, 32).move_to(back.point_from_proportion(0.5) + DOWN * 0.35)
        back_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.05)
        rider = tgt.copy()
        d = self.say()                                   # 6, 9, a third: (2, 3)
        self.play(FadeOut(det), ReplacementTransform(q, calc), run_time=min(1.6, d * 0.45))
        self.play(ReplacementTransform(stub, back), FadeIn(back_lab), run_time=min(1.0, d * 0.25))
        self.play(MoveAlongPath(rider, back), run_time=min(1.2, d * 0.25))
        d = self.say()                                   # back to the crossing point
        self.play(FadeOut(rider), Indicate(VGroup(sol, sol_lab), color=WHITE), run_time=min(1.0, d * 0.7))
        self.pause(1.5)                                  # ⏸ read the finished calculation

        # ---- the chapter's example
        cast_all = VGroup(cast, back, back_lab, calc, Ai_grp)
        E = matrix_mob([["2", "1"], ["5", "3"]], size=32)
        Ei = matrix_mob([["3", "−1"], ["−5", "2"]], size=32)
        ex1 = VGroup(E, M(INV + " =", 32), Ei).arrange(RIGHT, buff=0.15)
        ex1[1].align_to(E, UP).shift(DOWN * 0.02)
        ex1.move_to(np.array([2.6, 2.1, 0]))
        Ei.set_opacity(0)
        ex2 = M("<i>ps</i> − <i>qr</i> = 6 − 5 = 1", 30).move_to(np.array([2.6, 0.6, 0]))
        ex3 = M("3·(2, 5) − 5·(1, 3) = (1, 0)", 30).move_to(np.array([2.6, -0.5, 0]))
        d = self.say()                                   # one more, from the chapter
        self.play(cast_all.animate.scale(0.42).to_corner(DL, buff=0.35).fade(0.7), run_time=min(1.2, d * 0.5))
        self.play(FadeIn(VGroup(E, ex1[1])), run_time=min(0.8, d * 0.4))
        d = self.say()                                   # ps − qr = 1; the inverse
        self.play(FadeIn(ex2), run_time=min(1.0, d * 0.35))
        self.play(Ei.animate.set_opacity(1), run_time=min(1.0, d * 0.35))
        d = self.say()                                   # the check: first column of the product
        cE = col_box(Ei, 0)
        self.play(Create(cE), run_time=min(0.6, d * 0.2))
        self.play(FadeIn(ex3), run_time=min(1.4, d * 0.4))
        self.pause(1.5)                                  # ⏸ read the check
        self.bk = VGroup(cast_all, ex1, ex2, ex3, cE)

    # ------------------------------------------------------------------------------------------------
    def theorem(self):
        x0 = -6.4
        head = P("Theorem 3", 26, C_DIM).move_to(np.array([x0, 3.45, 0]), aligned_edge=LEFT)
        s1 = M("(i)  An inverse, when it exists, is unique; it is written <i>A</i>" + INV + ".", 28)
        p1 = M("<i>B</i> = <i>BI</i> = <i>B</i>(<i>AC</i>) = (<i>BA</i>)<i>C</i> = <i>IC</i> = <i>C</i>", 26, C_PROOF)
        s2 = M("(ii)  (<i>AB</i>)" + INV + " = <i>B</i>" + INV + "<i>A</i>" + INV, 28)
        p2 = M("(<i>AB</i>)(<i>B</i>" + INV + "<i>A</i>" + INV + ") = <i>A</i>(<i>BB</i>" + INV + ")<i>A</i>" + INV +
               " = <i>AA</i>" + INV + " = <i>I</i>, and likewise the other way round", 26, C_PROOF)
        s3 = M("(iii)  (<i>A</i><sup>T</sup>)" + INV + " = (<i>A</i>" + INV + ")<sup>T</sup>", 28)
        p3 = M("transpose <i>AA</i>" + INV + " = <i>I</i> and <i>A</i>" + INV + "<i>A</i> = <i>I</i>:  "
               "(<i>A</i>" + INV + ")<sup>T</sup><i>A</i><sup>T</sup> = <i>I</i>,  "
               "<i>A</i><sup>T</sup>(<i>A</i>" + INV + ")<sup>T</sup> = <i>I</i>   (Theorem 2)", 26, C_PROOF)
        s4 = M("(iv)  <i>A</i><b>x</b> = <b>b</b> has exactly one solution, <b>x</b> = <i>A</i>" + INV + "<b>b</b>", 28)
        p4a = M("<i>A</i>(<i>A</i>" + INV + "<b>b</b>) = <b>b</b>,", 26, C_PROOF)
        p4b = M("and any solution has <b>x</b> = <i>A</i>" + INV + "(<i>A</i><b>x</b>) = <i>A</i>" + INV + "<b>b</b>",
                26, C_PROOF)
        ys = [2.7, 2.2, 1.3, 0.8, -0.1, -0.6, -1.5, -2.0]
        for m, y, ind in zip([s1, p1, s2, p2, s3, p3, s4, p4a], ys, [0, 1, 0, 1, 0, 1, 0, 1]):
            m.move_to(np.array([x0 + 0.55 * ind, y, 0]), aligned_edge=LEFT)
        p4b.next_to(p4a, RIGHT, buff=0.2)
        d = self.say()                                   # four facts
        self.play(FadeOut(self.bk), run_time=0.6)
        self.play(FadeIn(head), run_time=min(0.8, max(0.3, d - 0.7)))
        d = self.say()                                   # (i) only one inverse
        self.play(FadeIn(s1), run_time=min(1.2, d * 0.6))
        d = self.say()                                   # B = B(AC) = (BA)C = C
        self.play(FadeIn(p1), run_time=min(1.6, d * 0.5))
        d = self.say()                                   # (ii)
        self.play(FadeIn(s2), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # shoes and socks again
        self.play(FadeIn(p2), run_time=min(1.4, d * 0.8))
        d = self.say()                                   # (iii)
        self.play(FadeIn(s3), run_time=min(1.2, d * 0.5))
        d = self.say()                                   # transpose A A^-1 = I
        self.play(FadeIn(p3), run_time=min(1.6, d * 0.6))
        d = self.say()                                   # (iv)
        self.play(FadeIn(s4), run_time=min(1.4, d * 0.5))
        d = self.say()                                   # it works
        self.play(FadeIn(p4a), run_time=min(1.0, d * 0.6))
        d = self.say()                                   # it's the only one
        self.play(FadeIn(p4b), run_time=min(1.4, d * 0.5))
        self.pause(2.0)                                  # ⏸ read the four statements
        self.th = VGroup(head, s1, p1, s2, p2, s3, p3, s4, p4a, p4b)

    # ------------------------------------------------------------------------------------------------
    def singular(self):
        XR2, YR2 = (-2, 4), (-2, 5)

        def pnl(c, title):
            p = plane(XR2, YR2, unit=UNIT).move_to(c)
            return p, P(title, 22, C_DIM).next_to(p, UP, buff=0.15)

        pin, tin = pnl(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = pnl(RIGHT_C, "output: where the amounts land")
        S = matrix_mob([["1", "2"], ["2", "4"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        S.move_to(np.array([0, 2.75, 0]))
        c2 = vec(pout, 2, 4, C_Q, width=6)
        c1 = vec(pout, 1, 2, C_U, width=7)
        c1l = M("(1, 2)", 24, C_U).next_to(c1.get_end(), RIGHT, buff=0.12)
        c2l = M("(2, 4)", 24, C_Q).next_to(c2.get_end(), RIGHT, buff=0.12)
        ln = Line(pout.c2p(-1, -2), pout.c2p(2.5, 5), color=WHITE, stroke_width=3).set_opacity(0.6)
        d = self.say()                                   # not every square matrix can be undone
        self.play(FadeOut(self.th), run_time=0.6)
        self.play(Create(VGroup(pin, pout)), FadeIn(VGroup(tin, tout)), FadeIn(S), run_time=min(1.4, max(0.5, d - 0.7)))
        d = self.say()                                   # columns (1, 2) and (2, 4)
        self.play(GrowArrow(c2), FadeIn(c2l), GrowArrow(c1), FadeIn(c1l), run_time=min(1.4, d * 0.6))
        d = self.say()                                   # one line
        self.play(Create(ln), run_time=min(1.2, d * 0.5))
        grid = VGroup(*[Line(pin.c2p(x, YR2[0]), pin.c2p(x, YR2[1])) for x in range(XR2[0], XR2[1] + 1)],
                      *[Line(pin.c2p(XR2[0], y), pin.c2p(XR2[1], y)) for y in range(YR2[0], YR2[1] + 1)])
        grid.set_stroke("#6B7488", 2)
        d = self.say()                                   # the whole input plane lands on that line
        moved = grid.copy()
        self.play(moved.animate.shift(RIGHT_C - LEFT_C), run_time=min(1.2, d * 0.4))
        self.play(*[Transform(m, ln.copy().set_stroke(WHITE, 3, opacity=0.6)) for m in moved],
                  run_time=min(1.4, d * 0.45))
        self.remove(moved)
        self.play(ln.animate.set_stroke(width=5, opacity=0.8), run_time=0.4)

        p = dot(pin, 2, -1, WHITE, r=0.09)
        pl = M("(2, −1)", 24).next_to(p, LEFT, buff=0.15)
        pl.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.04)
        walk = VGroup(vec_between(pout, (0, 0), (1, 2), C_U, width=5), vec_between(pout, (1, 2), (2, 4), C_U, width=5),
                      vec_between(pout, (2, 4), (0, 0), C_Q, width=5))
        d = self.say()                                   # two of the first, minus one of the second
        self.play(FadeIn(p), FadeIn(pl), c1.animate.set_opacity(0.25), c2.animate.set_opacity(0.25),
                  FadeOut(c1l), FadeOut(c2l), run_time=min(0.8, d * 0.2))
        self.play(GrowArrow(walk[0]), run_time=min(0.7, d * 0.18))
        self.play(GrowArrow(walk[1]), run_time=min(0.7, d * 0.18))
        self.play(GrowArrow(walk[2]), run_time=min(0.9, d * 0.22))
        o_out = dot(pout, 0, 0, WHITE, r=0.09)
        o_lab = M("(0, 0)", 24).next_to(o_out, DR, buff=0.1)
        o_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.04)
        f1 = CurvedArrow(p.get_center() + RIGHT * 0.1, o_out.get_center() + LEFT * 0.12, angle=-PI / 4,
                         color=WHITE, stroke_width=4, tip_length=0.2)
        d = self.say()                                   # (2, −1) is sent to (0, 0)
        self.play(FadeOut(walk), FadeIn(o_out), FadeIn(o_lab), Create(f1), run_time=min(1.4, d * 0.7))
        o_in = dot(pin, 0, 0, WHITE, r=0.09)
        f2 = CurvedArrow(o_in.get_center() + UP * 0.1, o_out.get_center() + UP * 0.1 + LEFT * 0.08, angle=-PI / 5,
                         color=WHITE, stroke_width=4, tip_length=0.2)
        d = self.say()                                   # and so is the zero vector
        self.play(FadeIn(o_in), Create(f2), run_time=min(1.4, d * 0.6))
        self.say()                                       # could any map undo this?
        self.pause(3.0)                                  # ⏸ decide (no "singular", no back arrow)

        g1 = CurvedArrow(o_out.get_center() + DOWN * 0.12, p.get_center() + DOWN * 0.12 + RIGHT * 0.05,
                         angle=-PI / 4, color=C_DIM, stroke_width=3, tip_length=0.2)
        g2 = CurvedArrow(o_out.get_center() + UP * 0.12 + LEFT * 0.1, o_in.get_center() + UP * 0.12,
                         angle=PI / 3, color=C_DIM, stroke_width=3, tip_length=0.2)
        qs = VGroup(M("?", 30).move_to(g1.point_from_proportion(0.5) + DOWN * 0.25),
                    M("?", 30).move_to(g2.point_from_proportion(0.5) + UP * 0.25))
        d = self.say()                                   # back to (2, −1), and also back to zero
        self.play(Create(g1), FadeIn(qs[0]), run_time=min(1.2, d * 0.4))
        self.play(Create(g2), FadeIn(qs[1]), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # one input, two places
        self.play(Indicate(o_out, color=WHITE, scale_factor=1.8), run_time=min(1.0, d * 0.6))
        sg = P("singular", 26).next_to(S, RIGHT, buff=0.4)
        d = self.say()                                   # so this matrix is singular
        self.play(FadeIn(sg), run_time=min(0.8, d * 0.6))
        d = self.say()                                   # later: a complete test
        self.wait(max(0, d - 0.1))
