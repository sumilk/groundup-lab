"""Every solution at once. Script: docs/LA02_VIDEO_SCRIPT.md, section "Every solution at once" (chapter §6).

The null space of the 3 x 4 system, x_p + N(A), reading x_p, s1, s2 off the reduced equations, a drawable
3-unknown version, the free-variable basis, rank-nullity, and the linear probe.
"""
import importlib

from sample import *  # noqa: F401,F403
from sample import panel, LEFT_C, RIGHT_C, TOP_Y, C_L1, C_L2

_r = importlib.import_module("08_rank")
Obl, box4, question_table, table_answer, bglab, rt, sup = (
    _r.Obl, _r.box4, _r.question_table, _r.table_answer, _r.bglab, _r.rt, _r.sup)
C_COL, C_NULL, C_ROW = _r.C_COL, _r.C_NULL, _r.C_ROW
BG = config.background_color
GOLD = C_V


def mx(s, size=28, color=WHITE):
    return M(s, size, color)


def lines(*items, buff=0.2):
    return VGroup(*items).arrange(DOWN, buff=buff, aligned_edge=LEFT)


XP = "<b>x</b><sub>p</sub>"


class EverySolution(NScene):
    PARAS = [
        # ---- The recipes that reach nothing
        ["The three by four system has infinitely many solutions.",
         "How do you write all of them down, and how many independent directions of freedom are there?"],
        ["Start with the target zero.",
         "Which inputs does A send to zero?",
         "Right at the start, gold was blue plus teal, and the trade \"one blue, one teal, minus one gold\" "
         "reached nothing.",
         "Inputs like that are what you're collecting."],
        ["All the inputs x with A x equal to zero form the null space of A, written N of A.",
         "It lives in the input space.",
         "A system with right-hand side zero is called homogeneous."],
        ["Is the null space a subspace?",
         "It contains zero.",
         "And if A x and A y are both zero, then any combination goes to the same combination of zeros, which "
         "is zero.",
         "The null space is a subspace, and its dimension is called the nullity of A."],
        # ---- One solution, plus the null space
        ["Suppose you have one solution, any one.",
         "Call it x p, a particular solution.",
         "Add something from the null space.",
         "Is the result still a solution?"],
        ["A of x p plus s is A x p plus A s, which is b plus zero.",
         "Still b.",
         "And it works the other way.",
         "If x is any solution at all, then A of x minus x p is b minus b, zero.",
         "So x minus x p is in the null space, and x is x p plus something from the null space."],
        ["So the solution set is the null space, slid over so that it passes through x p.",
         "That's an affine set, in the sense of chapter one.",
         "It's a single point exactly when the null space is only zero."],
        # ---- Reading it off the reduced form
        ["Back to the reduced equations.",
         "Solve each one for its pivot variable, as on screen.",
         "The free variables, x two and x four, can be anything you like."],
        ["The quickest particular solution sets both free variables to zero.",
         "What do you get?"],
        ["x one is three and x three is one, which makes x p three, zero, one, zero.",
         "Three copies of column one and one of column three give four, ten, two.",
         "Exactly b."],
        ["For the null space, use the same equations with zeros on the right, and turn on one free variable "
         "at a time."],
        ["With x two equal to one, the pivot variables come out as minus two and zero.",
         "Call that s one.",
         "With x four equal to one, they come out as minus one and minus two.",
         "Call that s two."],
        ["They are the column relations we found when a column had no pivot, written as recipes.",
         "s one says column two minus two copies of column one is zero.",
         "s two says column four, minus column one, minus two copies of column three, is zero."],
        ["So every solution is x p, plus any amount of s one, plus any amount of s two.",
         "Two free amounts, so the solutions form a flat, two-dimensional plane inside R four.",
         "It misses the origin, because zero doesn't solve a system whose target isn't zero."],
        # ---- A version you can see
        ["Four dimensions can't be drawn.",
         "Take a smaller system with the same structure.",
         "Two equations in three unknowns.",
         "x plus y plus z equals three.",
         "And x plus two y plus three z equals four.",
         "Two planes in space.",
         "What does the set of points on both look like?"],
        ["Elimination, on screen, leaves z free.",
         "Setting z to zero gives the particular point two, one, zero.",
         "Setting z to one, with zeros on the right, gives the null vector one, minus two, one."],
        ["The planes meet in a line, the solid one.",
         "The dashed line through the origin is the null space, every multiple of one, minus two, one.",
         "The solution set is that same line, shifted so it passes through two, one, zero.",
         "Pick a different particular point on it, like three, minus one, one, and you describe the same line."],
        # ---- How many directions of freedom?
        ["In the three by four example, two free variables gave two null vectors.",
         "Do those two always form a basis of the null space?",
         "Could some null vector be missing from their span?"],
        ["They're independent.",
         "Each one has a one in its own free coordinate and a zero in the other's.",
         "In any combination that adds up to zero, reading coordinate two forces the first amount to be zero, "
         "and coordinate four forces the second."],
        ["They span.",
         "Take any null vector x, and subtract x two copies of s one and x four copies of s two.",
         "What's left is still in the null space, and both its free coordinates are zero.",
         "The reduced equations then force its pivot coordinates to zero as well.",
         "It's the zero vector, and x was that combination of s one and s two all along."],
        ["The nullity is therefore the number of free columns.",
         "And every column is either a pivot column or a free column."],
        ["Rank plus nullity is the number of columns.",
         "Read it as a conservation law.",
         "The n directions of the input space split into the ones A keeps, the rank, and the ones it sends to "
         "zero, the nullity.",
         "Here, two and two make four."],
        ["It also finishes the claim we made about rank.",
         "Full column rank means nullity zero, so by Theorem ten a solution, when there is one, is a single point.",
         "The cast A has rank two in R two, so two, three was the only recipe.",
         "Add gold, and the three-column matrix still has rank two.",
         "Its nullity is one, and that direction is the line of recipes from the very beginning."],
        ["One place this matters.",
         "A fixed linear probe reads one number, w transpose h, from an activation h in R seven hundred and "
         "sixty-eight.",
         "With w nonzero it has rank one, so its null space has dimension seven hundred and sixty-seven, and "
         "changes inside it leave the probe's score exactly the same.",
         "The score, not the accuracy.",
         "Scores can move without changing predictions, so unchanged accuracy doesn't show that the activation, "
         "or even its component along w, stayed fixed."],
    ]

    def construct(self):
        self.reach_nothing()
        self.plus_null()
        self.read_off()
        self.visible()
        self.freedom()
        self.probe()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def reach_nothing(self):
        bi = box4(np.array([-3.6, 1.15, 0]), w=5.6, h=3.4)
        bo = box4(np.array([3.6, 1.15, 0]), w=5.6, h=3.4, title="output: where the amounts land",
                  space="ℝ<sup>3</sup>")
        arA = Arrow(bi.rect.get_right() + DOWN * 0.9, bo.rect.get_left() + DOWN * 0.9, buff=0.1, color=WHITE,
                    stroke_width=3, tip_length=0.18)
        lA = M("<i>A</i>", 30).next_to(arA, UP, buff=0.06)
        Am = _r.mat(_r.A_ROWS, 26, h_buff=0.5, v_buff=0.42)
        Ag = VGroup(M("<i>A</i> =", 26), Am).arrange(RIGHT, buff=0.15).move_to(np.array([0, -1.55, 0]))
        d = self.say()                                   # infinitely many solutions
        self.play(FadeIn(VGroup(bi.all, bo.all, arA, lA, Ag)), run_time=rt(min(1.4, d)))
        d = self.say()                                   # write them all down? how many directions?
        self.play(Indicate(bi.rect, color=WHITE, scale_factor=1.02), run_time=rt(min(1.4, d)))
        self.pause(0.4)

        zero = _r.column_vec(["0", "0", "0"], size=28).move_to(bo.rect.get_center() + DOWN * 0.1)
        d = self.say()                                   # start with the target zero
        self.play(FadeIn(zero), run_time=rt(min(1.0, d)))
        qm = M("?", 44).move_to(bi.rect.get_center() + DOWN * 0.1)
        d = self.say()                                   # which inputs go to zero?
        self.play(FadeIn(qm), run_time=rt(min(0.8, d)))
        # the gold trade from the beginning
        cols = [("(2, 1)", C_U), ("(−1, 1)", C_Q), ("(1, 2)", GOLD)]
        trade = VGroup(M("1", 28), M(cols[0][0], 28, C_U), M("+ 1", 28), M(cols[1][0], 28, C_Q), M("− 1", 28),
                       M(cols[2][0], 28, GOLD), M("= (0, 0)", 28)).arrange(RIGHT, buff=0.12)
        trade.move_to(np.array([0, -2.9, 0]))
        d = self.say()                                   # one blue, one teal, minus one gold: nothing
        self.play(FadeIn(trade), run_time=rt(min(1.4, d * 0.5)))
        d = self.say()                                   # inputs like that
        self.play(FadeOut(trade), run_time=rt(min(0.8, d)))
        self.pause(0.4)

        NA = VGroup(M("<i>N</i>(<i>A</i>)", 34, C_NULL), P("null space", 22, C_NULL)).arrange(DOWN, buff=0.08)
        NA.move_to(bi.rect.get_center() + DOWN * 0.1)
        defn = M("<i>N</i>(<i>A</i>) = {<b>x</b> ∈ ℝ<sup><i>n</i></sup> :  <i>A</i><b>x</b> = <b>0</b>}", 30) \
            .move_to(np.array([0, -2.9, 0]))
        d = self.say()                                   # null space N(A)
        self.play(ReplacementTransform(qm, NA), run_time=rt(min(1.0, d * 0.4)))
        self.play(FadeIn(defn), run_time=rt(min(1.0, d * 0.3)))
        d = self.say()                                   # lives in the input space
        self.play(Indicate(bi.space, color=C_NULL, scale_factor=1.4), Indicate(NA, color=C_NULL), run_time=rt(min(1.2, d)))
        hom = P("homogeneous:  right-hand side <b>0</b>", 22, C_DIM).next_to(zero, DOWN, buff=0.3)
        d = self.say()                                   # homogeneous
        self.play(FadeIn(hom), run_time=rt(min(1.0, d)))
        self.pause(0.4)

        d = self.say()                                   # is it a subspace?
        self.play(FadeOut(Ag), defn.animate.move_to(np.array([0, -1.15, 0])), run_time=rt(min(1.0, d)))
        l1 = M("<i>A</i><b>0</b> = <b>0</b>", 30).move_to(np.array([0, -1.85, 0]))
        d = self.say()                                   # it contains zero
        self.play(FadeIn(l1), run_time=rt(min(0.8, d)))
        l2 = M("<i>A</i><b>x</b> = <b>0</b>, <i>A</i><b>y</b> = <b>0</b>  ⇒  <i>A</i>(α<b>x</b> + β<b>y</b>) = "
               "α<i>A</i><b>x</b> + β<i>A</i><b>y</b> = <b>0</b>", 30).move_to(np.array([0, -2.55, 0]))
        d = self.say()                                   # any combination goes to zero
        self.play(FadeIn(l2), run_time=rt(min(1.4, d * 0.6)))
        nl = P("nullity = dim <i>N</i>(<i>A</i>)", 24, C_NULL).move_to(np.array([0, -3.3, 0]))
        d = self.say()                                   # a subspace; dimension = nullity
        self.play(FadeIn(nl), run_time=rt(min(1.0, d * 0.5)))
        self.pause(0.6)
        self.b = SimpleNamespace(bi=bi, bo=bo, arA=arA, lA=lA, zero=zero, NA=NA, hom=hom, txt=VGroup(defn, l1, l2, nl))

    # ------------------------------------------------------------------------------------------------
    def plus_null(self):
        b = self.b
        c = b.bi.rect.get_center()
        O = c + np.array([-2.0, -1.2, 0])
        dn = np.array([1.0, 0.32, 0])                    # schematic direction of N(A)
        vxp = np.array([0.6, 1.25, 0])
        vs = 1.5 * dn
        nline = Line(O - 0.6 * dn, O + 4.3 * dn, color=C_NULL, stroke_width=3)
        nlab = bglab(M("<i>N</i>(<i>A</i>)", 26, C_NULL)).next_to(nline.get_end(), DOWN, buff=0.1).shift(LEFT * 0.3)
        odot = Dot(O, radius=0.06, color=C_DIM)
        xp = Arrow(O, O + vxp, buff=0, color=WHITE, stroke_width=5, tip_length=0.18)
        xpl = bglab(M(XP, 28)).next_to(xp.get_end(), LEFT, buff=0.1)
        bdot = Dot(b.bo.rect.get_center() + np.array([0.4, -0.1, 0]), radius=0.1, color=C_W)
        blab = M("<b>b</b>", 30, C_W).next_to(bdot, RIGHT, buff=0.1)

        def arc(p):
            return CurvedArrow(p + RIGHT * 0.08, bdot.get_center() + LEFT * 0.15, angle=-PI / 12, color=WHITE,
                               stroke_width=3, tip_length=0.18)

        d = self.say()                                   # one solution, any one
        self.play(FadeOut(VGroup(b.txt, b.hom, b.zero, b.NA)), run_time=0.5)
        self.play(FadeIn(odot), GrowArrow(xp), FadeIn(bdot), FadeIn(blab), run_time=rt(min(1.0, d - 0.5)))
        a1 = arc(xp.get_end())
        d = self.say()                                   # call it x_p, a particular solution
        term = bglab(P("particular solution", 22)).next_to(xpl, UP, buff=0.08).shift(LEFT * 0.35)
        self.play(FadeIn(xpl), FadeIn(term), Create(a1), run_time=rt(min(1.2, d)))
        s = Arrow(O, O + vs, buff=0, color=C_NULL, stroke_width=5, tip_length=0.18)
        sl = bglab(M("<b>s</b>", 28, C_NULL)).next_to(s.get_end(), DOWN, buff=0.08)
        s2 = Arrow(O + vxp, O + vxp + vs, buff=0, color=C_NULL, stroke_width=5, tip_length=0.18)
        sumd = Dot(O + vxp + vs, radius=0.08, color=WHITE)
        suml = bglab(M(XP + " + <b>s</b>", 26)).next_to(sumd, UP, buff=0.12)
        d = self.say()                                   # add something from the null space
        self.play(Create(nline), FadeIn(nlab), run_time=rt(min(0.8, d * 0.35)))
        self.play(GrowArrow(s), FadeIn(sl), run_time=rt(min(0.8, d * 0.3)))
        self.play(TransformFromCopy(s, s2), FadeIn(sumd), FadeIn(suml), run_time=rt(min(0.8, d * 0.3)))
        self.say()                                       # still a solution?
        self.pause(2.0)                                  # ⏸ predict A(x_p + s) (no theorem, no arc yet)

        e1 = M("<i>A</i>(" + XP + " + <b>s</b>) = <i>A</i>" + XP + " + <i>A</i><b>s</b> = <b>b</b> + <b>0</b> = <b>b</b>",
               30).move_to(np.array([0, -1.4, 0]))
        d = self.say()                                   # A(x_p + s) = b + 0
        self.play(FadeIn(e1), run_time=rt(min(1.4, d * 0.6)))
        a2 = arc(sumd.get_center())
        d = self.say()                                   # still b
        self.play(Create(a2), run_time=rt(min(0.9, d)))
        d = self.say()                                   # the other way
        self.wait(max(0, d - 0.1))
        e2 = M("<i>A</i><b>x</b> = <b>b</b>  ⇒  <i>A</i>(<b>x</b> − " + XP + ") = <b>b</b> − <b>b</b> = <b>0</b>", 30) \
            .next_to(e1, DOWN, buff=0.25)
        d = self.say()                                   # any solution x: A(x - x_p) = 0
        self.play(FadeIn(e2), run_time=rt(min(1.4, d * 0.5)))
        th = VGroup(P("<b>Theorem 10.</b>  If <b>x</b><sub>p</sub> is one solution of <i>A</i><b>x</b> = <b>b</b>, "
                      "the set of all solutions is", 22),
                    M(XP + " + <i>N</i>(<i>A</i>) = {" + XP + " + <b>s</b> :  <b>s</b> ∈ <i>N</i>(<i>A</i>)}", 28)) \
            .arrange(DOWN, buff=0.15).move_to(np.array([0, -2.95, 0]))
        d = self.say()                                   # x = x_p + something from N(A)
        self.play(FadeIn(th), run_time=rt(min(1.4, d * 0.5)))
        self.pause(2.0)                                  # ⏸ read both directions

        sol = Line(O + vxp - 0.6 * dn, O + vxp + 3.6 * dn, color=WHITE, stroke_width=4)
        d = self.say()                                   # null space, slid over through x_p
        self.play(TransformFromCopy(nline, sol), FadeOut(VGroup(s2, s)), run_time=rt(min(1.6, d * 0.6)))
        aff = bglab(VGroup(P("affine set:", 22), M(XP + " + <i>N</i>(<i>A</i>)", 26)).arrange(RIGHT, buff=0.15)) \
            .next_to(b.bi.rect, DOWN, buff=0.15)
        d = self.say()                                   # an affine set
        self.play(FadeIn(aff), FadeOut(suml), run_time=rt(min(1.0, d)))
        d = self.say()                                   # a single point when N(A) = {0}
        self.play(Indicate(odot, color=C_NULL, scale_factor=2.0), Indicate(xp, color=WHITE), run_time=rt(min(1.4, d)))
        self.pause(0.6)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def read_off(self):
        X = lambda k: f"<i>x</i><sub>{k}</sub>"
        LX, RX = -6.4, 0.6
        eqA = M(f"{X(1)} + 2{X(2)} + {X(4)} = 3", 30)
        eqB = M(f"{X(3)} + 2{X(4)} = 1", 30)
        lines(eqA, eqB, buff=0.25).move_to(np.array([0, 3.0, 0])).align_to(np.array([LX, 0, 0]), LEFT)
        sA = M(f"{X(1)} = 3 − 2{X(2)} − {X(4)}", 30).move_to(eqA).align_to(eqA, LEFT)
        sB = M(f"{X(3)} = 1 − 2{X(4)}", 30).move_to(eqB).align_to(eqB, LEFT)
        d = self.say()                                   # back to the reduced equations
        self.play(FadeIn(eqA), FadeIn(eqB), run_time=rt(min(1.0, d)))
        d = self.say()                                   # solve for the pivot variable
        self.play(TransformMatchingShapes(eqA, sA), TransformMatchingShapes(eqB, sB), run_time=rt(min(1.4, d)))
        free = P("free:  <i>x</i><sub>2</sub>, <i>x</i><sub>4</sub>", 24, C_DIM).next_to(VGroup(sA, sB), RIGHT, buff=0.5)
        d = self.say()                                   # free variables can be anything
        self.play(FadeIn(free), run_time=rt(min(0.8, d)))
        self.pause(0.4)

        set0 = M(f"{X(2)} = {X(4)} = 0", 28).move_to(np.array([0, 1.75, 0])).align_to(np.array([LX, 0, 0]), LEFT)
        d = self.say()                                   # set the free variables to zero
        self.play(FadeIn(set0), run_time=rt(min(1.0, d)))
        self.say()                                       # what do you get?
        self.pause(3.0)                                  # ⏸ read off x1 and x3 (x_p and its check hidden)

        got = M(f":   {X(1)} = 3,  {X(3)} = 1", 28).next_to(set0, RIGHT, buff=0.1)
        xp = M(XP + " = (3, 0, 1, 0)", 30).next_to(set0, DOWN, buff=0.25).align_to(set0, LEFT)
        c1 = M("<i>A</i>" + XP + " = 3·(1, 2, 1) + 1·(1, 4, −1)", 28)
        c2 = M("= (3 + 1, 6 + 4, 3 − 1)", 28)
        c3 = M("= (4, 10, 2) = <b>b</b>", 28, WHITE)
        chk = lines(c1, c2, c3, buff=0.15).next_to(xp, DOWN, buff=0.3).align_to(xp, LEFT)
        c2.shift(RIGHT * 0.55)
        c3.shift(RIGHT * 0.55)
        d = self.say()                                   # x1 = 3, x3 = 1: x_p
        self.play(FadeIn(got), run_time=rt(min(1.0, d * 0.4)))
        self.play(FadeIn(xp), run_time=rt(min(1.0, d * 0.4)))
        d = self.say()                                   # three of column one, one of column three
        self.play(FadeIn(c1), run_time=rt(d * 0.4))
        self.play(FadeIn(c2), run_time=rt(d * 0.4))
        d = self.say()                                   # exactly b
        self.play(FadeIn(c3), run_time=rt(min(0.8, d)))
        self.pause(1.5)                                  # ⏸ read the check

        hA = M(f"{X(1)} = −2{X(2)} − {X(4)}", 30).move_to(np.array([0, sA.get_y(), 0])).align_to(np.array([RX + 0.3, 0, 0]), LEFT)
        hB = M(f"{X(3)} = −2{X(4)}", 30).move_to(np.array([0, sB.get_y(), 0])).align_to(hA, LEFT)
        hl = P("right-hand side 0", 22, C_NULL).next_to(hA, UP, buff=0.12).align_to(hA, LEFT)
        d = self.say()                                   # zeros on the right, one free variable at a time
        self.play(FadeOut(free), FadeOut(chk), TransformFromCopy(sA, hA), TransformFromCopy(sB, hB), FadeIn(hl),
                  run_time=rt(min(1.6, d * 0.5)))
        r1 = M(f"{X(2)} = 1, {X(4)} = 0:   {X(1)} = −2,  {X(3)} = 0", 28).move_to(np.array([0, 1.75, 0])) \
            .align_to(hA, LEFT)
        s1 = M("<b>s</b><sub>1</sub> = (−2, 1, 0, 0)", 30, C_NULL).next_to(r1, DOWN, buff=0.25).align_to(r1, LEFT)
        r2 = M(f"{X(2)} = 0, {X(4)} = 1:   {X(1)} = −1,  {X(3)} = −2", 28).next_to(s1, DOWN, buff=0.4).align_to(r1, LEFT)
        s2 = M("<b>s</b><sub>2</sub> = (−1, 0, −2, 1)", 30, C_NULL).next_to(r2, DOWN, buff=0.25).align_to(r1, LEFT)
        for m_ in (r1, r2):
            if m_.get_right()[0] > 6.8:
                m_.scale_to_fit_width(6.8 - m_.get_left()[0])
        d = self.say()                                   # x2 = 1: -2 and 0
        self.play(FadeIn(r1), run_time=rt(min(1.2, d)))
        d = self.say()                                   # call that s1
        self.play(FadeIn(s1), run_time=rt(min(0.8, d)))
        d = self.say()                                   # x4 = 1: -1 and -2
        self.play(FadeIn(r2), run_time=rt(min(1.2, d)))
        d = self.say()                                   # call that s2
        self.play(FadeIn(s2), run_time=rt(min(0.8, d)))
        self.pause(0.4)

        k1 = M("<i>A</i><b>s</b><sub>1</sub> = −2·(1, 2, 1) + (2, 4, 2) = <b>0</b>", 28)
        k2 = M("<i>A</i><b>s</b><sub>2</sub> = −(1, 2, 1) − 2·(1, 4, −1) + (3, 10, −1) = <b>0</b>", 28)
        ks = lines(k1, k2, buff=0.22).move_to(np.array([0, -1.25, 0]))
        rel1 = P("column 2 − 2 · column 1 = <b>0</b>", 22, C_DIM).next_to(k1, RIGHT, buff=0.4)
        d = self.say()                                   # the column relations, as recipes
        self.play(Indicate(VGroup(s1, s2), color=C_NULL, scale_factor=1.05), run_time=rt(min(1.4, d)))
        d = self.say()                                   # s1: column 2 - 2 column 1 = 0
        self.play(FadeIn(k1), run_time=rt(min(1.2, d)))
        d = self.say()                                   # s2: column 4 - column 1 - 2 column 3 = 0
        self.play(FadeIn(k2), run_time=rt(min(1.2, d)))
        self.pause(2.0)                                  # ⏸ match s1, s2 to the relations

        cv = lambda e, c=WHITE: _r.column_vec(e, size=26, color=c, v_buff=0.4)
        full = VGroup(M("<b>x</b> =", 30), cv(["3", "0", "1", "0"]), M("+ <i>x</i><sub>2</sub>", 30),
                      cv(["−2", "1", "0", "0"], C_NULL), M("+ <i>x</i><sub>4</sub>", 30),
                      cv(["−1", "0", "−2", "1"], C_NULL)).arrange(RIGHT, buff=0.2)
        full.move_to(np.array([-1.2, -2.35, 0]))
        anyx = M("<i>x</i><sub>2</sub>, <i>x</i><sub>4</sub> ∈ ℝ", 28).next_to(full, RIGHT, buff=0.5)
        d = self.say()                                   # every solution: x_p + any s1 + any s2
        self.play(FadeOut(ks), run_time=0.4)
        self.play(TransformFromCopy(xp, full[:2]), run_time=rt(d * 0.25))
        self.play(TransformFromCopy(s1, full[2:4]), run_time=rt(d * 0.25))
        self.play(TransformFromCopy(s2, full[4:]), FadeIn(anyx), run_time=rt(d * 0.25))
        plane2 = P("a flat 2-dimensional plane in ℝ" + sup("4"), 22, C_DIM).next_to(anyx, DOWN, buff=0.25) \
            .align_to(anyx, LEFT)
        d = self.say()                                   # two free amounts: a plane in R4
        self.play(FadeIn(plane2), Indicate(VGroup(full[2], full[4]), color=WHITE), run_time=rt(min(1.4, d)))
        miss = P("misses <b>0</b>:  <b>b</b> ≠ <b>0</b>", 22, C_DIM).next_to(plane2, DOWN, buff=0.15).align_to(plane2, LEFT)
        d = self.say()                                   # misses the origin
        self.play(FadeIn(miss), run_time=rt(min(1.0, d)))
        self.pause(2.0)                                  # ⏸ read the complete solution
        self.keep = SimpleNamespace(s1=s1, s2=s2)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def visible(self):
        o = Obl(np.array([-4.6, -1.15, 0]), (0.72, 0), (0, 0.72), (-0.36, -0.29))
        ax = o.axes((0, 4.8), (-0.4, 4.0), (0, 3.0))
        axl = VGroup(M("<i>x</i>", 24, C_DIM).next_to(ax[0].get_end(), RIGHT, buff=0.06),
                     M("<i>y</i>", 24, C_DIM).next_to(ax[1].get_end(), UP, buff=0.06),
                     M("<i>z</i>", 24, C_DIM).next_to(ax[2].get_end(), DL, buff=0.04))
        tin = P("input: the amounts (<i>x</i>, <i>y</i>, <i>z</i>)", 22, C_DIM).move_to(np.array([-3.4, 3.4, 0]))
        dvec = (1, -2, 1)
        p1 = o.patch((2, 1, 0), dvec, (1, 0, -1), (-1.2, 1.2), (-1.3, 1.3), color=C_L1, opacity=0.22, stroke=1.5)
        p2 = o.patch((2, 1, 0), dvec, (1, 1, -1), (-1.2, 1.2), (-1.2, 1.2), color=C_U, opacity=0.22, stroke=1.5)
        e1 = M("<i>x</i> + <i>y</i> + <i>z</i> = 3", 30, C_L1)
        e2 = M("<i>x</i> + 2<i>y</i> + 3<i>z</i> = 4", 30, C_U)
        lines(e1, e2, buff=0.25).move_to(np.array([3.4, 2.9, 0]))
        d = self.say()                                   # four dimensions can't be drawn
        self.play(FadeIn(VGroup(ax, axl, tin)), run_time=rt(min(1.2, d)))
        d = self.say()                                   # a smaller system, same structure
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # two equations, three unknowns
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # x + y + z = 3
        self.play(FadeIn(e1), FadeIn(p1), run_time=rt(min(1.2, d)))
        d = self.say()                                   # x + 2y + 3z = 4
        self.play(FadeIn(e2), FadeIn(p2), run_time=rt(min(1.2, d)))
        d = self.say()                                   # two planes in space
        self.play(Indicate(VGroup(p1, p2), color=WHITE, scale_factor=1.0), run_time=rt(min(1.2, d)))
        self.say()                                       # what does the set on both look like?
        self.pause(3.0)                                  # ⏸ predict (translucent planes, no line, no steps)

        st = VGroup(M("<i>R</i><sub>2</sub> ← <i>R</i><sub>2</sub> − <i>R</i><sub>1</sub>:   <i>y</i> + 2<i>z</i> = 1", 28),
                    M("<i>R</i><sub>1</sub> ← <i>R</i><sub>1</sub> − <i>R</i><sub>2</sub>:   <i>x</i> − <i>z</i> = 2", 28),
                    P("free variable  <i>z</i>", 22, C_DIM))
        lines(*st, buff=0.2).next_to(VGroup(e1, e2), DOWN, buff=0.4).align_to(e1, LEFT)
        xpl = M("<i>z</i> = 0:   " + XP + " = (2, 1, 0)", 28)
        nvl = M("<i>z</i> = 1, right side 0:   (1, −2, 1)", 28, C_NULL)
        lines(xpl, nvl, buff=0.2).next_to(st, DOWN, buff=0.35).align_to(e1, LEFT)
        for m_ in (*st, xpl, nvl):
            if m_.get_right()[0] > 6.8:
                m_.scale_to_fit_width(6.8 - m_.get_left()[0])
        P0 = Dot(o.p(2, 1, 0), radius=0.08, color=WHITE)
        P0l = bglab(M("(2, 1, 0)", 22)).next_to(P0, RIGHT, buff=0.12)
        d = self.say()                                   # elimination leaves z free
        self.play(FadeIn(st[0]), run_time=rt(d * 0.3))
        self.play(FadeIn(st[1]), run_time=rt(d * 0.3))
        self.play(FadeIn(st[2]), run_time=rt(d * 0.25))
        d = self.say()                                   # z = 0: (2, 1, 0)
        self.play(FadeIn(xpl), FadeIn(P0), FadeIn(P0l), run_time=rt(min(1.2, d)))
        d = self.say()                                   # z = 1: the null vector
        self.play(FadeIn(nvl), run_time=rt(min(1.2, d)))

        sol = Line(o.p(*(np.array([2, 1, 0]) - 1.3 * np.array(dvec))), o.p(*(np.array([2, 1, 0]) + 1.3 * np.array(dvec))),
                   color=WHITE, stroke_width=5)
        nul = DashedLine(o.p(-1.2, 2.4, -1.2), o.p(1.0, -2.0, 1.0), color=C_NULL, stroke_width=5, dash_length=0.1)
        nul.set_z_index(3)
        nlab = bglab(M("<i>N</i>(<i>A</i>)", 26, C_NULL)).next_to(nul.get_start(), LEFT, buff=0.1)
        d = self.say()                                   # the planes meet in a line
        self.play(Create(sol), run_time=rt(min(1.2, d)))
        d = self.say()                                   # dashed line through the origin: N(A)
        self.play(Create(nul), FadeIn(nlab), Indicate(nvl, color=C_NULL), run_time=rt(min(1.6, d)))
        d = self.say()                                   # same line, shifted through (2, 1, 0)
        ghost = nul.copy()
        self.play(ghost.animate.shift(o.p(2, 1, 0) - o.p(0, 0, 0)), run_time=rt(min(1.6, d * 0.6)))
        self.play(FadeOut(ghost), Indicate(P0, color=WHITE, scale_factor=1.8), run_time=rt(min(0.8, d * 0.3)))
        P1 = Dot(o.p(2, 1, 0), radius=0.08, color=WHITE)
        P1l = bglab(M("(3, −1, 1)", 22)).next_to(o.p(3, -1, 1), RIGHT, buff=0.12)
        d = self.say()                                   # another particular point, the same line
        self.add(P1)
        self.play(P1.animate.move_to(o.p(3, -1, 1)), run_time=rt(min(1.6, d * 0.5)))
        self.play(FadeIn(P1l), run_time=rt(min(0.6, d * 0.2)))
        self.pause(0.6)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def freedom(self):
        cv = lambda e: _r.column_vec(e, size=30, color=C_NULL, v_buff=0.5)
        v1, v2 = cv(["−2", "1", "0", "0"]), cv(["−1", "0", "−2", "1"])
        g = VGroup(VGroup(M("<b>s</b><sub>1</sub>", 30, C_NULL), v1).arrange(DOWN, buff=0.2),
                   VGroup(M("<b>s</b><sub>2</sub>", 30, C_NULL), v2).arrange(DOWN, buff=0.2)).arrange(RIGHT, buff=0.8)
        g.move_to(np.array([-4.6, 1.2, 0]))
        rowl = VGroup(*[M(str(k + 1), 22, C_DIM).next_to(v1, LEFT, buff=0.25).set_y(v1.entries[k][0].get_y())
                        for k in range(4)])
        d = self.say()                                   # two free variables, two null vectors
        self.play(FadeIn(g), FadeIn(rowl), run_time=rt(min(1.2, d)))
        d = self.say()                                   # always a basis?
        self.wait(max(0, d - 0.1))
        d = self.say()                                   # anything missing from their span?
        self.wait(max(0, d - 0.1))

        hl = VGroup(*[SurroundingRectangle(VGroup(v1.entries[k][0], v2.entries[k][0]), color=WHITE, buff=0.12,
                                           stroke_width=2.5, corner_radius=0.05) for k in (1, 3)])
        d = self.say()                                   # independent
        self.play(Create(hl), run_time=rt(min(1.0, d)))
        d = self.say()                                   # a one in its own free coordinate
        self.play(Indicate(VGroup(v1.entries[1][0], v2.entries[3][0]), color=WHITE, scale_factor=1.5),
                  run_time=rt(min(1.4, d)))
        RX = -1.6
        ind = VGroup(M("<i>c</i><sub>1</sub><b>s</b><sub>1</sub> + <i>c</i><sub>2</sub><b>s</b><sub>2</sub> = <b>0</b>", 28),
                     M("coordinate 2:  <i>c</i><sub>1</sub> = 0     coordinate 4:  <i>c</i><sub>2</sub> = 0", 28))
        lines(*ind, buff=0.2).move_to(np.array([0, 2.6, 0])).align_to(np.array([RX, 0, 0]), LEFT)
        d = self.say()                                   # coordinate two forces c1 = 0, four forces c2 = 0
        self.play(FadeIn(ind[0]), run_time=rt(d * 0.3))
        self.play(FadeIn(ind[1]), run_time=rt(d * 0.4))
        self.pause(0.4)

        X = lambda k: f"<i>x</i><sub>{k}</sub>"
        sp = VGroup(M(f"<b>y</b> = <b>x</b> − {X(2)}<b>s</b><sub>1</sub> − {X(4)}<b>s</b><sub>2</sub>", 28),
                    M("<b>y</b> ∈ <i>N</i>(<i>A</i>),   <i>y</i><sub>2</sub> = <i>y</i><sub>4</sub> = 0", 28),
                    M("<i>y</i><sub>1</sub> = −2<i>y</i><sub>2</sub> − <i>y</i><sub>4</sub> = 0,   "
                      "<i>y</i><sub>3</sub> = −2<i>y</i><sub>4</sub> = 0", 28),
                    M(f"<b>y</b> = <b>0</b>,  so  <b>x</b> = {X(2)}<b>s</b><sub>1</sub> + {X(4)}<b>s</b><sub>2</sub>", 28))
        lines(*sp, buff=0.2).next_to(ind, DOWN, buff=0.45).align_to(ind, LEFT)
        d = self.say()                                   # they span
        self.play(FadeOut(hl), run_time=rt(min(0.6, d)))
        d = self.say()                                   # subtract x2 s1 and x4 s2
        self.play(FadeIn(sp[0]), run_time=rt(min(1.2, d)))
        d = self.say()                                   # still in N(A), free coordinates zero
        self.play(FadeIn(sp[1]), run_time=rt(min(1.2, d)))
        d = self.say()                                   # the reduced equations force the pivot coordinates
        self.play(FadeIn(sp[2]), run_time=rt(min(1.2, d)))
        d = self.say()                                   # zero: x was that combination
        self.play(FadeIn(sp[3]), run_time=rt(min(1.2, d * 0.5)))
        th = VGroup(P("<b>Theorem 11.</b>  For free columns <i>f</i><sub>1</sub>, …, <i>f</i><sub>k</sub>, let <b>s</b><sub>j</sub> "
                      "solve <i>A</i><b>x</b> = <b>0</b> with <i>x</i><sub>f<sub>j</sub></sub> = 1,", 22),
                    P("the other free variables 0, and pivot variables read from <i>R</i>.  Then <b>s</b><sub>1</sub>, …, "
                      "<b>s</b><sub>k</sub> is a basis of <i>N</i>(<i>A</i>).", 22)).arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        th.move_to(np.array([0, -2.95, 0]))
        for m_ in th:
            if m_.width > 13.4:
                m_.scale_to_fit_width(13.4)
        self.play(FadeIn(th), run_time=rt(min(1.2, d * 0.4)))
        self.pause(2.0)                                  # ⏸ read the spanning step

        # rank-nullity
        rn = VGroup(P("<b>Theorem 12 (rank–nullity).</b>  For <i>A</i> ∈ ℝ" + sup("<i>m</i>×<i>n</i>") + ":", 24),
                    M("rank <i>A</i> + dim <i>N</i>(<i>A</i>) = <i>n</i>", 40),
                    M("2 + 2 = 4", 36)).arrange(DOWN, buff=0.3).move_to(np.array([0, 1.3, 0]))
        d = self.say()                                   # nullity = number of free columns
        self.play(FadeOut(VGroup(g, rowl, ind, sp, th)), run_time=0.6)
        self.play(FadeIn(rn[0]), run_time=rt(min(1.0, d - 0.6)))
        d = self.say()                                   # pivot or free
        self.play(FadeIn(rn[1]), run_time=rt(min(1.2, d * 0.5)))
        self.play(FadeIn(rn[2]), run_time=rt(min(0.8, d * 0.3)))
        term = P("rank–nullity", 24, C_DIM).next_to(rn[1], RIGHT, buff=0.4)
        self.pause(2.0)                                  # ⏸ read the identity and the example

        cells = VGroup(*[Square(1.0, stroke_color=C_DIM, stroke_width=2) for _ in range(4)]).arrange(RIGHT, buff=0.2)
        cells.move_to(np.array([0, -1.6, 0]))
        nums = VGroup(*[M(f"{k + 1}", 26, C_DIM).move_to(cells[k]) for k in range(4)])
        nums.add(P("columns", 22, C_DIM).next_to(cells, LEFT, buff=0.3))
        d = self.say()                                   # rank + nullity = number of columns
        self.play(FadeIn(cells), FadeIn(nums), run_time=rt(min(1.2, d)))
        d = self.say()                                   # a conservation law
        self.wait(max(0, d - 0.1))
        keep = P("kept: the rank", 22, C_COL).next_to(VGroup(cells[0], cells[2]), DOWN, buff=0.3).set_x(-2.2)
        lose = P("sent to zero: the nullity", 22, C_NULL).next_to(cells, DOWN, buff=0.3).set_x(2.4)
        d = self.say()                                   # kept vs sent to zero
        self.play(cells[0].animate.set_fill(C_COL, 0.45), cells[2].animate.set_fill(C_COL, 0.45), FadeIn(keep),
                  run_time=rt(d * 0.4))
        self.play(cells[1].animate.set_fill(C_NULL, 0.45), cells[3].animate.set_fill(C_NULL, 0.45), FadeIn(lose),
                  run_time=rt(d * 0.4))
        d = self.say()                                   # two and two make four
        self.play(Indicate(rn[2], color=WHITE), run_time=rt(min(1.2, d)))
        self.pause(0.6)

        # the table is complete; the cast matrices
        tab, tk = question_table(top=3.5)
        a1 = table_answer("no pivot in the\nright-hand column", tk.slots[0])
        a2 = table_answer("no free columns", tk.slots[1])
        d = self.say()                                   # finishes the claim about rank
        self.play(FadeOut(VGroup(rn, cells, nums, keep, lose)), run_time=0.6)
        self.play(FadeIn(VGroup(tab[:3], a1, a2)), run_time=rt(min(1.2, d - 0.6)))
        d = self.say()                                   # full column rank: nullity zero, a single point
        self.play(Indicate(a2, color=WHITE, scale_factor=1.15), run_time=rt(min(1.4, d)))
        A2 = _r.mat([["2", "−1"], ["1", "1"]], 30, colors={("col", 0): C_U, ("col", 1): C_Q})
        A3 = _r.mat([["2", "−1", "1"], ["1", "1", "2"]], 30, colors={("col", 0): C_U, ("col", 1): C_Q, ("col", 2): GOLD})
        g2 = VGroup(A2, M("rank 2,  nullity 0", 28)).arrange(DOWN, buff=0.25).move_to(np.array([-3.5, -1.9, 0]))
        g3 = VGroup(A3, M("rank 2,  nullity 1", 28)).arrange(DOWN, buff=0.25).move_to(np.array([3.0, -1.9, 0]))
        n3 = M("<i>N</i> = multiples of (1, 1, −1)", 28, C_NULL).next_to(g3, DOWN, buff=0.2)
        d = self.say()                                   # cast A: rank 2 in R2, (2, 3) unique
        self.play(FadeIn(g2), run_time=rt(min(1.2, d)))
        d = self.say()                                   # add gold: still rank 2
        self.play(FadeIn(g3), run_time=rt(min(1.2, d)))
        d = self.say()                                   # nullity one: the line of recipes
        self.play(FadeIn(n3), run_time=rt(min(1.2, d)))
        self.pause(0.6)
        self.play(FadeOut(Group(*self.mobjects)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def probe(self):
        n = 24
        hcells = VGroup(*[Square(0.4, stroke_color=C_DIM, stroke_width=1.5, fill_color="#3A4150", fill_opacity=0.9)
                          for _ in range(n)]).arrange(RIGHT, buff=0.05).move_to(np.array([0.3, 1.2, 0]))
        wcells = hcells.copy().set_fill(C_ROW, opacity=0.45).set_stroke(C_ROW).move_to(np.array([0.3, 2.4, 0]))
        hl = M("<b>h</b> ∈ ℝ<sup>768</sup>", 28).next_to(hcells, LEFT, buff=0.25)
        wl = M("<b>w</b>", 28, C_ROW).next_to(wcells, LEFT, buff=0.25)
        dots = M("…", 28, C_DIM).next_to(hcells, RIGHT, buff=0.12)
        d = self.say()                                   # one place this matters
        self.play(FadeIn(hcells), FadeIn(hl), FadeIn(dots), run_time=rt(min(1.2, d)))
        score = M("score = <b>w</b><sup>T</sup><b>h</b> = 1.70", 32).move_to(np.array([0, -0.3, 0]))
        d = self.say()                                   # the probe reads one number
        self.play(FadeIn(wcells), FadeIn(wl), run_time=rt(min(1.2, d * 0.4)))
        self.play(FadeIn(score), run_time=rt(min(1.0, d * 0.3)))
        pr = M("<b>h</b> ↦ <b>w</b><sup>T</sup><b>h</b>,   <b>w</b> ∈ ℝ<sup>768</sup>, <b>w</b> ≠ <b>0</b>:   rank 1,   "
               "dim <i>N</i> = 767", 30).move_to(np.array([0, -1.5, 0]))
        d = self.say()                                   # rank one, null space 767, score unchanged
        self.play(FadeIn(pr), run_time=rt(min(1.2, d * 0.3)))
        rng = np.random.default_rng(3)
        for _ in range(3):
            self.play(*[c.animate.set_fill(interpolate_color(ManimColor("#3A4150"), ManimColor(C_NULL), rng.uniform(0, 0.8)))
                        for c in hcells], run_time=rt(d * 0.18))
        self.play(Indicate(score, color=WHITE, scale_factor=1.05), run_time=rt(min(0.8, d * 0.1)))
        nacc = P("the score, not the accuracy", 24, C_DIM).move_to(np.array([0, -2.5, 0]))
        d = self.say()                                   # the score, not the accuracy
        self.play(FadeIn(nacc), run_time=rt(min(1.0, d)))
        d = self.say()                                   # unchanged accuracy proves little
        self.play(Indicate(hcells, color=WHITE, scale_factor=1.02), run_time=rt(min(1.6, d * 0.4)))
