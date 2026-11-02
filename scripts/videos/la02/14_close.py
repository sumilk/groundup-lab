"""The matrix with 3072 columns (the close). Script: docs/LA02_VIDEO_SCRIPT.md, section "The matrix with 3072 columns"."""
import importlib

from sample import *  # noqa: F401,F403
from sample import LEFT_C, RIGHT_C, TOP_Y, C_L1, C_L2, panel

_one = importlib.import_module("01_one_system")
recipe_eq, walk = _one.recipe_eq, _one.walk
C_ROW = "#FF8A65"           # row space (orange)
C_ROSE = "#D4687A"          # left null space (rose)


class Close(NScene):
    PARAS = [
        ["Back to the matrix with seven hundred and sixty-eight rows and three thousand and seventy-two columns.",
         "Can its columns reach every target?",
         "And is a recipe ever unique?"],
        ["The rank is at most seven hundred and sixty-eight, the smaller side.",
         "If it reaches that, every row has a pivot, no row can read zero equals one, and every target can be "
         "reached.",
         "And the nullity is three thousand and seventy-two minus the rank, at least two thousand three hundred and "
         "four.",
         "So a target that is reached is reached by a whole affine set of recipes, never by just one."],
        ["It's the same reasoning as with two equations and a crossing point.",
         "Elimination finds the pivots, and the pivots give the rank.",
         "Rank and shape tell us whether every target is reachable, and whether a reachable target has one recipe or "
         "infinitely many.",
         "For a particular target, the augmented matrix tells us whether it can be reached."],
        ["The written chapter has the three labs, where you eliminate by hand and watch both pictures move, along "
         "with the exercises and the checkpoint."],
    ]

    def construct(self):
        # ---------------------------------------------------------------- the big matrix, the table, the diagram
        Ablk = Rectangle(width=3.4, height=0.85, stroke_color=C_DIM, stroke_width=2, fill_color="#3A4150",
                         fill_opacity=0.8)
        xcol = Rectangle(width=0.22, height=2.4, stroke_color=C_DIM, stroke_width=2, fill_color="#3A4150",
                         fill_opacity=0.8)
        bcol = Rectangle(width=0.22, height=0.85, stroke_color=C_W, stroke_width=2, fill_color=C_W,
                         fill_opacity=0.25)
        blk = VGroup(Ablk, xcol, M("=", 32), bcol).arrange(RIGHT, buff=0.25).move_to(np.array([-3.4, 2.35, 0]))
        a_lab = M("<i>A</i>: 768 × 3072", 26).next_to(Ablk, DOWN, buff=0.15)
        x_lab = M("<b>x</b> ∈ ℝ<sup>3072</sup>", 24).next_to(xcol, LEFT, buff=0.12).align_to(xcol, UP)
        x_lab.shift(LEFT * 0.0)
        b_lab = M("<b>b</b> ∈ ℝ<sup>768</sup>", 24, C_W).next_to(bcol, RIGHT, buff=0.12)
        big = VGroup(blk, a_lab, x_lab, b_lab)

        # four-subspace diagram in miniature (schematic)
        bw, bh = 2.5, 2.3
        lbox = Rectangle(width=bw, height=bh, stroke_color=C_DIM, stroke_width=2).move_to(np.array([2.15, 2.3, 0]))
        rbox = Rectangle(width=bw, height=bh, stroke_color=C_DIM, stroke_width=2).move_to(np.array([5.6, 2.3, 0]))
        o1, o2 = lbox.get_center() + np.array([-0.1, -0.05, 0]), rbox.get_center() + np.array([0.1, -0.05, 0])
        rs = Rectangle(width=1.0, height=0.8, stroke_width=0, fill_color=C_ROW, fill_opacity=0.55)
        rs.move_to(o1 + np.array([-0.5, 0.4, 0]))
        ns = Rectangle(width=0.9, height=0.7, stroke_width=0, fill_color=C_P, fill_opacity=0.55)
        ns.move_to(o1 + np.array([0.45, -0.35, 0]))
        cs = Rectangle(width=1.0, height=0.8, stroke_width=0, fill_color=C_U, fill_opacity=0.5)
        cs.set_fill(color=[C_U, C_Q], opacity=0.5).move_to(o2 + np.array([0.5, 0.4, 0]))
        ls = Rectangle(width=0.5, height=0.5, stroke_width=0, fill_color=C_ROSE, fill_opacity=0.6)
        ls.move_to(o2 + np.array([-0.25, -0.25, 0]))
        labs = VGroup(M("<i>C</i>(<i>A</i><sup>T</sup>)", 22, C_ROW).next_to(rs, UP, buff=0.06),
                      M("<i>N</i>(<i>A</i>)", 22, C_P).next_to(ns, DOWN, buff=0.06),
                      M("<i>C</i>(<i>A</i>)", 22, C_U).next_to(cs, UP, buff=0.06),
                      M("<i>N</i>(<i>A</i><sup>T</sup>)", 22, C_ROSE).next_to(ls, DOWN, buff=0.06))
        bl = VGroup(M("ℝ<sup>3072</sup>", 24, C_DIM).next_to(lbox, UP, buff=0.08),
                    M("ℝ<sup>768</sup>", 24, C_DIM).next_to(rbox, UP, buff=0.08))
        arr = Arrow(lbox.get_right(), rbox.get_left(), buff=0.08, color=WHITE, stroke_width=3, tip_length=0.16)
        al = M("<i>A</i>", 24).next_to(arr, UP, buff=0.05)
        diag = VGroup(lbox, rbox, rs, ns, cs, ls, labs, bl, arr, al)

        heads = ["Question about <i>A</i><b>x</b> = <b>b</b>", "The idea it really is", "read off from elimination as"]
        rows = [["Existence: is there\nany solution?", "Is <b>b</b> in the span of the\ncolumns of <i>A</i>?",
                 "no pivot in the\nright-hand column"],
                ["Uniqueness: is there\nonly one?", "Are the columns of <i>A</i>\nindependent?", "no free columns"]]
        colx, widths, top = [-4.45, 0.15, 4.6], [4.2, 4.8, 3.9], -0.25
        head_m = VGroup(*[P(h, 22, C_DIM).move_to(np.array([colx[k], top, 0])) for k, h in enumerate(heads)])
        cell_m = VGroup(*[P(c, 22, C_W if i == 0 and k == 1 else WHITE).move_to(
            np.array([colx[k], top - 1.0 * (i + 1) - 0.05, 0])) for i, r in enumerate(rows) for k, c in enumerate(r)])
        x0, x3 = colx[0] - widths[0] / 2, colx[2] + widths[2] / 2
        rules = VGroup(Line([x0, top - 0.35, 0], [x3, top - 0.35, 0], color=C_DIM, stroke_width=1.5),
                       Line([x0, top - 1.55, 0], [x3, top - 1.55, 0], color=C_GRID, stroke_width=1.5),
                       *[Line([colx[k] + widths[k] / 2, top + 0.3, 0], [colx[k] + widths[k] / 2, top - 2.6, 0],
                              color=C_GRID, stroke_width=1.5) for k in (0, 1)])
        table = VGroup(head_m, cell_m, rules)

        d = self.say()                                   # back to the 768 x 3072 matrix
        self.play(FadeIn(big), run_time=min(1.4, d * 0.3))
        self.play(FadeIn(diag), run_time=min(1.4, d * 0.3))
        self.play(FadeIn(table), run_time=min(1.4, d * 0.3))
        d = self.say()                                   # every target?
        self.play(Indicate(VGroup(bcol, b_lab), color=C_W, scale_factor=1.08), Indicate(table[1][0:3], color=WHITE,
                                                                                       scale_factor=1.03),
                  run_time=min(1.4, d))
        d = self.say()                                   # is a recipe ever unique?
        self.play(Indicate(VGroup(xcol, x_lab), color=WHITE, scale_factor=1.05), Indicate(table[1][3:6], color=WHITE,
                                                                                         scale_factor=1.03),
                  run_time=min(1.4, d))
        self.pause(4.0)                                  # ⏸ answer both from the shape (bounds hidden)

        l1 = M("<i>r</i> ≤ min(768, 3072) = 768", 30)
        l2 = M("<i>r</i> = 768 (full row rank):  no zero rows  ⇒  <i>A</i><b>x</b> = <b>b</b> solvable for every <b>b</b>", 28)
        l3 = M("always:  dim <i>N</i>(<i>A</i>) = 3072 − <i>r</i> ≥ 2304 &gt; 0", 30)
        l4 = M("⇒  a solution is never unique", 30)
        lines = VGroup(l1, l2, l3, l4).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to(np.array([0, -1.55, 0]))
        d = self.say()                                   # rank at most 768
        self.play(FadeOut(table), run_time=0.6)
        self.play(FadeIn(l1), run_time=min(1.2, max(0.4, d - 0.8)))
        d = self.say()                                   # full row rank: every target reached
        self.play(FadeIn(l2), run_time=min(1.4, d * 0.5))
        self.play(Indicate(VGroup(cs, labs[2]), color=C_U, scale_factor=1.15), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # nullity at least 2304
        self.play(FadeIn(l3), run_time=min(1.4, d * 0.5))
        self.play(Indicate(VGroup(ns, labs[1]), color=C_P, scale_factor=1.15), run_time=min(1.2, d * 0.4))
        d = self.say()                                   # a whole affine set of recipes
        self.play(FadeIn(l4), run_time=min(1.2, d))
        self.pause(0.8)

        # ---------------------------------------------------------------- the cast, as at the very start
        pin, tin = panel(LEFT_C, "input: the amounts (<i>x</i>, <i>y</i>)")
        pout, tout = panel(RIGHT_C, "output: where the amounts land")
        ln1 = Line(pin.c2p(0, -1), pin.c2p(3.5, 6), color=C_L1, stroke_width=4)
        ln2 = Line(pin.c2p(-1, 6), pin.c2p(5, 0), color=C_L2, stroke_width=4)
        e1 = M("2<i>x</i> − <i>y</i> = 1", 38, C_L1)
        e2 = M("<i>x</i> + <i>y</i> = 5", 38, C_L2)
        eqs = VGroup(e1, e2).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to(np.array([-3.5, TOP_Y, 0]))
        sol = dot(pin, 2, 3, WHITE, r=0.09)
        a1 = vec(pout, 2, 1, C_U, width=6).set_opacity(0.25)
        a2 = vec(pout, -1, 1, C_Q, width=6).set_opacity(0.25)
        path = walk(pout, [2, 3])
        tgt = dot(pout, 1, 5, C_W, r=0.1)
        tgt_lab = M("(1, 5)", 26, C_W).next_to(tgt, RIGHT, buff=0.12)
        req = recipe_eq([2, 3], "(1, 5)", size=32)
        A = matrix_mob([["2", "−1"], ["1", "1"]], size=34, entry_colors={("col", 0): C_U, ("col", 1): C_Q})
        A_grp = VGroup(M("<i>A</i> =", 34), A).arrange(RIGHT, buff=0.2).move_to(np.array([0, -2.4, 0]))
        arc = CurvedArrow(sol.get_center() + UP * 0.12 + RIGHT * 0.06, tgt.get_center() + LEFT * 0.2,
                          angle=-PI / 3, color=WHITE, stroke_width=4, tip_length=0.22)
        arc_lab = M("<i>A</i>", 34).move_to(arc.point_from_proportion(0.5) + UP * 0.3)
        arc_lab.add_background_rectangle(color=config.background_color, opacity=0.85, buff=0.05)
        cast = VGroup(pin, tin, pout, tout, ln1, ln2, eqs, sol, a1, a2, path, tgt, tgt_lab, req, A_grp, arc, arc_lab)
        d = self.say()                                   # same reasoning as two equations and a crossing
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=0.6)
        self.play(FadeIn(cast), run_time=min(1.6, max(0.5, d - 0.7)))
        rk = M("2 pivots  ⇒  rank 2", 28).next_to(A_grp, DOWN, buff=0.25)
        d = self.say()                                   # pivots give the rank
        self.play(FadeIn(rk), run_time=min(1.0, d))
        d = self.say()                                   # rank and shape: reachable? one recipe?
        self.play(Indicate(tgt, color=C_W, scale_factor=1.8), run_time=min(1.2, d * 0.45))
        self.play(Indicate(sol, color=WHITE, scale_factor=1.8), run_time=min(1.2, d * 0.45))
        Ab = matrix_mob([["2", "−1", "1"], ["1", "1", "5"]], size=34,
                        entry_colors={("col", 0): C_U, ("col", 1): C_Q, ("col", 2): C_W})
        E = Ab.entries
        xb = (E[0][1].get_center()[0] + E[0][2].get_center()[0]) / 2
        Ab.add(Line([xb, Ab.get_top()[1] - 0.08, 0], [xb, Ab.get_bottom()[1] + 0.08, 0], stroke_width=2))
        Ab.move_to(np.array([0, A.get_y(), 0]))
        Ab_lab = M("[<i>A</i> | <b>b</b>]", 28).next_to(Ab, DOWN, buff=0.15)
        Ab_grp = VGroup(Ab, Ab_lab)
        d = self.say()                                   # for a particular target: the augmented matrix
        self.play(ReplacementTransform(A_grp, Ab_grp), FadeOut(rk), run_time=min(1.4, d * 0.6))
        self.play(Indicate(tgt, color=C_W, scale_factor=1.6), run_time=min(1.0, d * 0.3))
        d = self.say()                                   # the written chapter
        self.wait(max(0, d - 0.1))
        self.done(2.0)
        self.clear_all()
