"""Elimination on a real machine. Script: docs/LA02_VIDEO_SCRIPT.md, section "Elimination on a real machine"."""
import importlib

from sample import *  # noqa: F401,F403
from sample import C_L1, C_L2

_lu = importlib.import_module("12_lu")
eqrow, mat, ring, under = _lu.eqrow, _lu.mat, _lu.ring, _lu.under
RED = "#E5534B"             # numerical danger (as in 06_elimination)
MS = 30
WX = -0.9                   # left edge of the working column on the right


class RealMachine(NScene):
    PARAS = [
        ["Everything so far used exact arithmetic.",
         "A real computer rounds every result.",
         "To see what that does, imagine a machine that keeps only three significant digits, and give it this pair.",
         "Ten to the minus four x, plus y, equals one.",
         "And x plus y equals two."],
        ["The exact solution has x just above one, at one point zero zero zero one and a little more, and y just "
         "below one, at nought point nine nine nine eight and a little more.",
         "To three digits, both are one."],
        ["Without pivoting, the pivot is ten to the minus four, and the multiplier is ten thousand.",
         "What happens to the second row?"],
        ["The new coefficient, one minus ten thousand, and the new right-hand side, two minus ten thousand, both "
         "round to minus ten thousand.",
         "Dividing, y is one.",
         "Then x is one minus one, divided by ten to the minus four.",
         "Zero.",
         "The machine answers zero, one.",
         "It has lost x completely."],
        ["The huge multiplier subtracted ten thousand copies of the first equation from the second, and rounding then "
         "threw away the second equation's own numbers as too small to keep.",
         "The stored factors multiply back to a matrix whose second row is one, zero.",
         "With the rounded right-hand side, the machine exactly solved a system whose second line is x equals zero, "
         "the dashed line.",
         "Its answer lies on the first line, but misses the second by one."],
        ["The two true lines cross at a healthy angle, so the problem itself isn't delicate.",
         "The failure belongs to the method."],
        ["With partial pivoting, the first column's candidates are ten to the minus four and one.",
         "Swap the rows, so the pivot is one.",
         "What's the multiplier now?"],
        ["Ten to the minus four.",
         "Now the new coefficient and the new right-hand side both round to one.",
         "Then y is one, and x is two minus one, one.",
         "Correct to all three digits."],
        ["Partial pivoting keeps every multiplier at size one or less.",
         "Does that keep every number in the elimination small?"],
        ["To measure it, take the largest entry, in absolute value, that appears anywhere during elimination, U "
         "included.",
         "Divide it by the largest entry of A. That ratio is called the growth factor, written rho.",
         "In the unpivoted three-digit example, the largest entry of A was one, and minus ten thousand appeared.",
         "Rho was ten thousand."],
        ["Take a matrix with ones on the diagonal and down the last column, and minus ones below the diagonal.",
         "In column one every candidate has size one.",
         "Keep the current row on a tie, so row one is the pivot row, and the multipliers are minus one.",
         "Watch the last column as you add row one to the rows below."],
        ["Column two ties again, with multiplier minus one, and the steps are on screen.",
         "The last column went one, two, four, though every multiplier stayed at minus one.",
         "The largest entry grew from one to four, so rho is four.",
         "The n by n version doubles the last column at every step, so its growth factor is two to the n minus one.",
         "This is Wilkinson's example."],
        ["How much does growth matter?",
         "The standard result says the computed answer, x hat, exactly solves a slightly different system, A plus "
         "delta A, times x hat, equals b, where delta A, relative to A, is of order rho times u. Here u is the unit roundoff, two to the minus fifty-three in double precision.",
         "Growth like two to the n minus one is possible but almost never seen, which is why partial pivoting is the "
         "default."],
        ["Exact rank is well defined for exact numbers.",
         "But rounding, or noise in measured data, almost always nudges a matrix to full rank.",
         "How, then, does a program decide the rank?"],
        ["It counts pivots, or better, the singular values of chapter eight, that lie above a chosen tolerance.",
         "Take the diagonal matrix with entries one and ten to the minus ten.",
         "Its exact rank is two.",
         "With a tolerance of ten to the minus eight, the second entry falls below the line, and the reported rank "
         "is one."],
        ["A numerical rank is a statement about a matrix, a method and a tolerance together.",
         "Report all three."],
        ["Pivoting repairs the method.",
         "Can it repair a problem like the nearly parallel lines we saw with rank?"],
        ["No.",
         "That sensitivity belongs to the problem.",
         "The condition number, kappa of A, which is the size of A times the size of A inverse, measures how much a "
         "small relative change in b, or in A, can be magnified in the exact solution.",
         "The sizes here are matrix norms, defined in chapter nine.",
         "Roughly, you lose about log base ten of kappa of the sixteen or so decimal digits that double precision "
         "carries."],
        ["Partial pivoting controls the multipliers, not the growth, so its guarantee is excellent in practice rather "
         "than unconditional.",
         "And a small residual, b minus A x hat, shows that x hat solves a nearby problem.",
         "It does not show that x hat is close to the true x, when kappa is large.",
         "Chapter nine treats norms, kappa and backward error in full."],
    ]

    def construct(self):
        self.three_digits()
        self.growth()
        self.numerical_rank()
        self.sensitive()
        self.done(1.5)
        self.clear_all()

    def wipe(self, run_time=0.6):
        mobs = list(self.mobjects)
        if mobs:
            self.play(*[FadeOut(m) for m in mobs], run_time=run_time)

    def put(self, mob, y):
        """Left-align a line in the working column at height y."""
        return mob.move_to(np.array([WX + mob.width / 2, y, 0]))

    # ------------------------------------------------------------------------------------------ 3 digits
    def three_digits(self):
        pin = plane((-1, 3), (-1, 3), unit=1.15).move_to(np.array([-4.25, -0.75, 0]))
        tin = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).next_to(pin, UP, buff=0.15)
        l1 = Line(pin.c2p(-1, 1 + 1e-4), pin.c2p(3, 1 - 3e-4), color=C_L1, stroke_width=4)
        l2 = Line(pin.c2p(-1, 3), pin.c2p(3, -1), color=C_L2, stroke_width=4)
        e1 = M("10<sup>−4</sup><i>x</i> + <i>y</i> = 1", MS, C_L1)
        e2 = M("<i>x</i> + <i>y</i> = 2", MS, C_L2)
        self.put(e1, 3.0)
        self.put(e2, 2.4)
        ctr = P("3 significant digits", 24, C_DIM).to_corner(UR, buff=0.35)
        d = self.say()                               # exact arithmetic so far
        self.play(Create(pin), FadeIn(tin), run_time=min(1.4, d))
        self.say()                                   # a real computer rounds
        d = self.say()                               # three significant digits
        self.play(FadeIn(ctr), run_time=min(1.0, d))
        d = self.say()                               # 10⁻⁴x + y = 1
        self.play(Write(e1), Create(l1), run_time=min(1.6, d))
        d = self.say()                               # x + y = 2
        self.play(Write(e2), Create(l2), run_time=min(1.6, d))

        ex = M("<i>x</i> = 1/(1 − 10<sup>−4</sup>) = 1.0001…", MS)
        ey = M("<i>y</i> = (1 − 2·10<sup>−4</sup>)/(1 − 10<sup>−4</sup>) = 0.9998…", MS)
        self.put(ex, 1.5)
        self.put(ey, 0.85)
        both = M("to 3 digits:  <i>x</i> = 1.00,  <i>y</i> = 1.00", MS)
        self.put(both, 0.2)
        sol = Dot(pin.c2p(1, 1), radius=0.09, color=WHITE)
        d = self.say()                               # the exact solution
        self.play(FadeIn(sol, scale=0.5), run_time=0.5)
        self.play(FadeIn(ex), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(ey), run_time=min(1.0, d * 0.3))
        d = self.say()                               # to three digits both are one
        self.play(FadeIn(both), run_time=min(1.0, d))
        self.pause(0.4)

        piv = ring(e1[0:5])
        lm = M("pivot 10<sup>−4</sup>,   ℓ = 1/10<sup>−4</sup> = 10<sup>4</sup>", MS)
        self.put(lm, 1.5)
        d = self.say()                               # pivot 10⁻⁴, multiplier 10⁴
        self.play(FadeOut(VGroup(ex, ey, both)), Create(piv), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(lm), run_time=min(1.0, d * 0.4))
        self.say()                                   # what happens to the second row?
        self.pause(3.0)                              # ⏸ predict (rounded values hidden)

        r1 = eqrow("1 − 10<sup>4</sup>·1 = −9999", "→", M("−1.00 × 10<sup>4</sup>", MS, RED), buff=0.2)
        r2 = eqrow("2 − 10<sup>4</sup>·1 = −9998", "→", M("−1.00 × 10<sup>4</sup>", MS, RED), buff=0.2)
        self.put(r1, 0.8)
        self.put(r2, 0.15)
        ym = M("<i>y</i> = 1.00", MS)
        self.put(ym, -0.6)
        xm = M("<i>x</i> = (1 − 1.00)/10<sup>−4</sup>", MS)
        self.put(xm, -1.3)
        x0 = M("= 0", MS).next_to(xm, RIGHT, buff=0.2)
        res = M("machine:  (0, 1)", MS, RED)
        self.put(res, -2.1)
        bad = Dot(pin.c2p(0, 1), radius=0.09, color=RED)
        d = self.say()                               # both round to −10⁴
        self.play(FadeOut(piv), FadeIn(r1[0]), run_time=min(1.0, d * 0.2))
        self.play(FadeIn(r1[1:]), run_time=min(0.8, d * 0.15))
        self.play(FadeIn(r2[0]), run_time=min(1.0, d * 0.2))
        self.play(FadeIn(r2[1:]), run_time=min(0.8, d * 0.15))
        d = self.say()                               # y is one
        self.play(FadeIn(ym), run_time=min(0.8, d))
        d = self.say()                               # x = (1 − 1)/10⁻⁴
        self.play(FadeIn(xm), run_time=min(1.0, d))
        d = self.say()                               # zero
        self.play(FadeIn(x0), run_time=min(0.6, d))
        d = self.say()                               # the machine answers (0, 1)
        self.play(FadeIn(res), FadeIn(bad, scale=0.5), run_time=min(1.0, d))
        d = self.say()                               # lost x completely
        self.play(Indicate(x0, color=RED, scale_factor=1.3), run_time=min(1.0, d))
        self.pause(2.0)                              # ⏸ compare (0, 1) with the true answer

        # ---- what the machine actually solved
        d = self.say()                               # huge multiplier swamped row 2
        self.play(Indicate(lm, color=WHITE, scale_factor=1.05), run_time=min(1.0, d * 0.3))
        self.play(Indicate(VGroup(r1[2], r2[2]), color=RED, scale_factor=1.1), run_time=min(1.0, d * 0.3))
        L = mat([["1", "0"], ["10<sup>4</sup>", "1"]], size=28)
        U = mat([["10<sup>−4</sup>", "1"], ["0", "−10<sup>4</sup>"]], size=28)
        LU = mat([["10<sup>−4</sup>", "1"], ["1", "0"]], size=28, colors={(1, 0): RED, (1, 1): RED})
        fac = eqrow("stored  <i>L</i> =", L, "  <i>U</i> =", U, buff=0.25)
        prod = eqrow("<i>LU</i> =", LU, buff=0.2)
        d = self.say()                               # stored factors multiply back to row (1, 0)
        self.play(FadeOut(VGroup(r1, r2, ym, xm, x0)), res.animate.move_to(
            np.array([WX + res.width / 2, 0.8, 0])), run_time=min(0.8, d * 0.2))
        self.put(fac, -0.4)
        self.put(prod, -1.75)
        self.play(FadeIn(fac), run_time=min(1.0, d * 0.35))
        self.play(FadeIn(prod), run_time=min(1.0, d * 0.35))
        dash = DashedLine(pin.c2p(0, -1), pin.c2p(0, 3), color=RED, stroke_width=3, dash_length=0.12)
        dl = M("<i>x</i> = 0", 26, RED).next_to(pin.c2p(0, -0.55), RIGHT, buff=0.12)
        d = self.say()                               # it exactly solved x = 0, the dashed line
        self.play(Indicate(VGroup(*LU.entries[1]), color=RED, scale_factor=1.3), run_time=min(1.0, d * 0.35))
        self.play(Create(dash), FadeIn(dl), run_time=min(1.2, d * 0.45))
        gap = Line(pin.c2p(0, 1), pin.c2p(0, 2), color=RED, stroke_width=7)
        rl = M("residual in eq. 2:  2 − (0 + 1) = 1", MS)
        self.put(rl, -2.95)
        d = self.say()                               # on the first line, misses the second by one
        self.play(Indicate(l1, color=C_L1, scale_factor=1.0), run_time=min(0.8, d * 0.3))
        self.play(Create(gap), FadeIn(rl), run_time=min(1.2, d * 0.5))
        self.pause(0.5)
        d = self.say()                               # the true lines cross at a healthy angle
        self.play(Indicate(VGroup(l1, l2), color=WHITE, scale_factor=1.0), Indicate(sol, color=WHITE,
                                                                                   scale_factor=1.8),
                  run_time=min(1.4, d))
        self.say()                                   # the failure belongs to the method
        self.pause(0.6)

        # ---- with partial pivoting
        cand = VGroup(ring(e1[0:5]), ring(e2[0]))
        d = self.say()                               # candidates 10⁻⁴ and 1
        self.play(FadeOut(VGroup(res, fac, prod, dash, dl, gap, rl, bad, lm)), run_time=min(0.8, d * 0.3))
        self.play(Create(cand), run_time=min(1.0, d * 0.4))
        d = self.say()                               # swap the rows
        self.play(FadeOut(cand), e1.animate.set_y(2.4), e2.animate.set_y(3.0), run_time=min(1.2, d))
        self.say()                                   # what's the multiplier now?
        self.pause(2.0)                              # ⏸ find the multiplier (hidden)

        m2 = M("ℓ = 10<sup>−4</sup>/1 = 10<sup>−4</sup>", MS)
        self.put(m2, 1.5)
        s1 = eqrow("1 − 10<sup>−4</sup> = 0.9999", "→", "1.00", buff=0.2)
        s2 = eqrow("1 − 2·10<sup>−4</sup> = 0.9998", "→", "1.00", buff=0.2)
        self.put(s1, 0.8)
        self.put(s2, 0.15)
        s3 = M("<i>y</i> = 1.00,   <i>x</i> = 2 − 1.00 = 1.00", MS)
        self.put(s3, -0.6)
        d = self.say()                               # ten to the minus four
        self.play(FadeIn(m2), run_time=min(1.0, d))
        d = self.say()                               # both round to one
        self.play(FadeIn(s1), run_time=min(1.0, d * 0.45))
        self.play(FadeIn(s2), run_time=min(1.0, d * 0.45))
        d = self.say()                               # y is one, x is one
        self.play(FadeIn(s3), run_time=min(1.2, d))
        d = self.say()                               # correct to all three digits
        self.play(Create(Circle(radius=0.2, color=WHITE, stroke_width=3).move_to(sol)), run_time=min(0.8, d))
        self.pause(0.6)
        self.wipe()

    # ------------------------------------------------------------------------------------------ growth
    def growth(self):
        top = M("partial pivoting:  every |ℓ| ≤ 1", MS).move_to(np.array([0, 3.3, 0]))
        d = self.say()                               # multipliers at most one
        self.play(FadeIn(top), run_time=min(1.0, d))
        self.say()                                   # does that keep every number small?
        num = M("largest |entry| during elimination, <i>U</i> included", 28)
        den = M("largest |entry| of <i>A</i>", 28)
        bar = Line(LEFT, RIGHT, color=WHITE, stroke_width=2).set_width(num.width + 0.2)
        frac = VGroup(num, bar, den).arrange(DOWN, buff=0.12)
        rho = M("ρ =", 32)
        rdef = VGroup(rho, frac).arrange(RIGHT, buff=0.25).move_to(np.array([0, 2.0, 0]))
        d = self.say()                               # take the largest entry anywhere
        self.play(FadeIn(num), run_time=min(1.2, d))
        d = self.say()                               # divide by largest of A; growth factor rho
        self.play(Create(bar), FadeIn(den), run_time=min(1.0, d * 0.4))
        term = P("growth factor", 24, C_DIM).next_to(rho, DOWN, buff=0.2)
        self.play(FadeIn(rho), FadeIn(term), run_time=min(1.0, d * 0.4))
        ex = M("unpivoted 3-digit example:  largest |entry| of <i>A</i> = 1,   then <span foreground='"
               + RED + "'>−10<sup>4</sup></span> appeared", 28).move_to(np.array([0, 0.75, 0]))
        d = self.say()                               # in the three-digit example
        self.play(FadeIn(ex), run_time=min(1.2, d))
        r4 = M("ρ = 10<sup>4</sup>", MS, RED).next_to(ex, DOWN, buff=0.25)
        d = self.say()                               # rho was ten thousand
        self.play(FadeIn(r4), run_time=min(0.8, d))
        self.pause(0.5)

        W0 = mat([["1", "0", "1"], ["−1", "1", "1"], ["−1", "−1", "1"]])
        W1 = mat([["1", "0", "1"], ["0", "1", "2"], ["0", "−1", "2"]])
        W2 = mat([["1", "0", "1"], ["0", "1", "2"], ["0", "0", "4"]])
        xs = [-3.4, 0.7, 4.85]
        y0 = -0.75
        for W, x in zip((W0, W1, W2), xs):
            W.move_to(np.array([x, y0, 0]))
        nW = M("<i>W</i><sub>3</sub> =", MS).next_to(W0, LEFT, buff=0.2)
        a1 = Arrow(W0.get_right(), W1.get_left(), buff=0.25, color=C_DIM, stroke_width=3, tip_length=0.18)
        a2 = Arrow(W1.get_right(), W2.get_left(), buff=0.25, color=C_DIM, stroke_width=3, tip_length=0.18)
        o1 = VGroup(M("<i>R</i><sub>2</sub> + <i>R</i><sub>1</sub>", 24, C_DIM),
                    M("<i>R</i><sub>3</sub> + <i>R</i><sub>1</sub>", 24, C_DIM)).arrange(DOWN, buff=0.08)
        o1.next_to(a1, UP, buff=0.12)
        o2 = M("<i>R</i><sub>3</sub> + <i>R</i><sub>2</sub>", 24, C_DIM).next_to(a2, UP, buff=0.12)
        d = self.say()                               # the matrix W3
        self.play(FadeOut(VGroup(ex, r4)), FadeIn(W0), FadeIn(nW), run_time=min(1.2, d * 0.5))
        c1 = SurroundingRectangle(VGroup(*[W0.entries[i][0] for i in range(3)]), color=WHITE, buff=0.1,
                                  corner_radius=0.08)
        d = self.say()                               # every candidate has size one
        self.play(Create(c1), run_time=min(1.0, d))
        lm = VGroup(*[M("ℓ = −1", 24, C_DIM).next_to(W0, LEFT, buff=0.3).set_y(W0.entries[i][0].get_y()) for i in (1, 2)])
        d = self.say()                               # keep the current row on a tie; multipliers −1
        self.play(Indicate(VGroup(*W0.entries[0]), color=WHITE), run_time=min(1.0, d * 0.4))
        self.play(FadeOut(nW), FadeIn(lm), run_time=min(1.0, d * 0.4))
        lc = SurroundingRectangle(VGroup(*[W0.entries[i][2] for i in range(3)]), color=WHITE, buff=0.1,
                                  corner_radius=0.08)
        d = self.say()                               # watch the last column
        self.play(FadeOut(c1), Create(lc), run_time=min(1.0, d))
        self.pause(3.0)                              # ⏸ predict the last column (new rows hidden)

        chain = M("last column:   1 → 2 → 4", MS).move_to(np.array([-2.6, -2.5, 0]))
        rr = M("ρ = 4/1 = 4", MS).move_to(np.array([2.9, -2.5, 0]))
        nn = M("<i>n</i> × <i>n</i>:   ρ = 2<sup><i>n</i>−1</sup>", MS).move_to(np.array([-2.6, -3.3, 0]))
        wk = P("Wilkinson's example", 24).move_to(np.array([2.9, -3.3, 0]))
        d = self.say()                               # the steps are on screen
        self.play(GrowArrow(a1), FadeIn(o1), TransformFromCopy(W0, W1), run_time=min(1.6, d * 0.45))
        self.play(GrowArrow(a2), FadeIn(o2), TransformFromCopy(W1, W2), run_time=min(1.6, d * 0.45))
        d = self.say()                               # one, two, four
        hl = [W0.entries[2][2], W1.entries[2][2], W2.entries[2][2]]
        self.play(FadeIn(chain), *[Indicate(h, color=WHITE, scale_factor=1.6) for h in hl], run_time=min(1.6, d))
        d = self.say()                               # rho is four
        self.play(FadeIn(rr), run_time=min(1.0, d))
        d = self.say()                               # n by n: 2^(n−1)
        self.play(FadeIn(nn), run_time=min(1.0, d))
        d = self.say()                               # Wilkinson's example
        self.play(FadeIn(wk), run_time=min(1.0, d))
        self.pause(0.5)

        be = M("(<i>A</i> + δ<i>A</i>) <i>x̂</i> = <i>b</i>,      ‖δ<i>A</i>‖ / ‖<i>A</i>‖ = <i>O</i>(ρ<i>u</i>)", 34)
        be.move_to(np.array([0, 1.4, 0]))
        bt = P("backward error", 24, C_DIM).next_to(be, DOWN, buff=0.25)
        uu = M("<i>u</i> = 2<sup>−53</sup>  in float64", 34).move_to(np.array([0, -0.4, 0]))
        ut = P("unit roundoff", 24, C_DIM).next_to(uu, DOWN, buff=0.25)
        cite = P("Trefethen &amp; Bau, Lecture 22", 22, C_DIM).move_to(np.array([0, -3.3, 0]))
        d = self.say()                               # how much does growth matter?
        self.play(FadeOut(VGroup(top, rdef, term, W0, W1, W2, a1, a2, o1, o2, lm, lc, chain, rr, nn, wk)),
                  run_time=min(0.8, d))
        d = self.say()                               # x hat solves a nearby system; u is the unit roundoff
        self.play(FadeIn(be), FadeIn(cite), run_time=min(1.4, d * 0.4))
        self.play(FadeIn(bt), run_time=min(0.8, d * 0.2))
        self.wait(max(0, d * 0.65 - 2.4))
        self.play(FadeIn(uu), FadeIn(ut), run_time=min(1.0, d * 0.2))
        d = self.say()                               # possible but almost never seen
        self.play(Indicate(be, color=WHITE, scale_factor=1.04), run_time=min(1.2, d))
        self.pause(0.5)
        self.wipe()

    # ------------------------------------------------------------------------------------------ numerical rank
    def numerical_rank(self):
        D = mat([["1", "0"], ["0", "10<sup>−10</sup>"]], size=34)
        Dg = VGroup(M("diag:", 30, C_DIM), D).arrange(RIGHT, buff=0.25).move_to(np.array([-4.3, 0.3, 0]))
        d = self.say()                               # exact rank is well defined
        self.play(FadeIn(Dg), run_time=min(1.2, d))
        self.say()                                   # rounding nudges to full rank
        self.say()                                   # how does a program decide?
        # log axis: 10^0 at the top, 10^-12 at the bottom
        x0, ytop, per = 0.6, 2.4, 0.4

        def yv(e):                                   # height of 10^e
            return ytop + e * per
        axis = Line([x0, yv(-12), 0], [x0, yv(0) + 0.2, 0], color="#5B6475", stroke_width=2)
        ticks = VGroup()
        for e in (0, -4, -8, -12):
            ticks.add(Line([x0 - 0.1, yv(e), 0], [x0 + 0.1, yv(e), 0], color="#5B6475", stroke_width=2))
            ticks.add(M("1" if e == 0 else f"10<sup>{e}</sup>".replace("-", "−"), 24, C_DIM)
                      .next_to([x0 - 0.1, yv(e), 0], LEFT, buff=0.12))
        tol = DashedLine([x0, yv(-8), 0], [x0 + 5.6, yv(-8), 0], color=WHITE, stroke_width=3, dash_length=0.12)
        tl = M("tolerance 10<sup>−8</sup>", 24).next_to(tol, UP, buff=0.08).align_to(tol, RIGHT)
        d = self.say()                               # pivots or singular values above a tolerance
        self.play(Create(axis), FadeIn(ticks), run_time=min(1.0, d * 0.4))
        self.play(Create(tol), FadeIn(tl), run_time=min(1.0, d * 0.4))
        b1 = Rectangle(width=0.8, height=yv(0) - yv(-12), stroke_width=0, fill_color=WHITE, fill_opacity=0.7)
        b1.move_to([x0 + 1.6, (yv(0) + yv(-12)) / 2, 0])
        b2 = Rectangle(width=0.8, height=yv(-10) - yv(-12), stroke_width=0, fill_color=WHITE, fill_opacity=0.7)
        b2.move_to([x0 + 3.6, (yv(-10) + yv(-12)) / 2, 0])
        bl = VGroup(M("1", 24).next_to(b1, UP, buff=0.1), M("10<sup>−10</sup>", 24).next_to(b2, UP, buff=0.1))
        d = self.say()                               # entries 1 and 10⁻¹⁰
        self.play(GrowFromEdge(b1, DOWN), GrowFromEdge(b2, DOWN), FadeIn(bl), run_time=min(1.4, d))
        ex = M("exact rank 2", MS).next_to(Dg, DOWN, buff=0.5)
        d = self.say()                               # exact rank two
        self.play(FadeIn(ex), run_time=min(1.0, d))
        rep = M("reported rank 1", MS).next_to(ex, DOWN, buff=0.3)
        nt = M("numerical rank, tolerance 10<sup>−8</sup>", 24, C_DIM).next_to(rep, DOWN, buff=0.15)
        d = self.say()                               # below the line: reported rank one
        self.play(b2.animate.set_fill(C_DIM, 0.7), Indicate(tol, color=WHITE), run_time=min(1.2, d * 0.45))
        self.play(FadeIn(rep), FadeIn(nt), run_time=min(1.0, d * 0.4))
        trio = M("numerical rank = (matrix, method, tolerance)", MS).move_to(np.array([0, -3.35, 0]))
        d = self.say()                               # a statement about all three
        self.play(FadeIn(trio), run_time=min(1.2, d))
        d = self.say()                               # report all three
        self.play(Indicate(trio, color=WHITE, scale_factor=1.04), run_time=min(1.0, d))
        self.pause(0.5)
        self.wipe()

    # ------------------------------------------------------------------------------------------ sensitivity
    def sensitive(self):
        # the nearly parallel lines from Rank (08_rank): y = x/4 + 1/2 and y = x/3 + c, crossing at (2, 1)
        pin = plane((-1, 12), (-1, 5), unit=0.6).move_to(np.array([0, 0.85, 0]))
        tin = P("input: the amounts (<i>x</i>, <i>y</i>)", 22, C_DIM).next_to(pin, UP, buff=0.15)
        c = ValueTracker(1 / 3)
        l1 = Line(pin.c2p(-1, 0.25), pin.c2p(12, 3.5), color=C_L1, stroke_width=4)

        def L2():
            k, cc = 1 / 3, c.get_value()
            x1 = min(12, (5 - cc) / k)
            return Line(pin.c2p(-1, -k + cc), pin.c2p(x1, k * x1 + cc), color=C_L2, stroke_width=4)

        def xpt():
            x = 12 * (0.5 - c.get_value())
            return pin.c2p(x, x / 4 + 0.5)
        l2 = always_redraw(L2)
        ghost = Dot(pin.c2p(2, 1), radius=0.08, color=C_DIM)
        cdot = always_redraw(lambda: Dot(xpt(), radius=0.09, color=WHITE))
        d = self.say()                               # pivoting repairs the method
        self.play(Create(pin), FadeIn(tin), Create(l1), run_time=min(1.4, d))
        self.add(l2)
        d = self.say()                               # nearly parallel lines?
        self.play(FadeIn(l2), FadeIn(cdot), run_time=min(1.0, d))
        self.say()                                   # no
        d = self.say()                               # the sensitivity belongs to the problem
        self.add(ghost)
        self.play(c.animate.set_value(0.18), run_time=min(2.0, d * 0.8))
        k = M("κ(<i>A</i>) = ‖<i>A</i>‖ ‖<i>A</i><sup>−1</sup>‖", 34).move_to(np.array([3.3, -2.25, 0]))
        kt = P("condition number", 24, C_DIM).next_to(k, DOWN, buff=0.2)
        d = self.say()                               # kappa: magnification
        self.play(FadeIn(k), FadeIn(kt), run_time=min(1.2, d * 0.4))
        self.play(c.animate.set_value(1 / 3), run_time=min(1.6, d * 0.4))
        d = self.say()                               # matrix norms, chapter nine
        self.play(Indicate(k, color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
        dg = M("digits lost ≈ log<sub>10</sub> κ   of ≈ 16", 32).move_to(np.array([-3.3, -2.25, 0]))
        d = self.say()                               # lose log10 kappa of sixteen digits
        self.play(FadeIn(dg), run_time=min(1.2, d))
        self.pause(0.6)
        r1 = M("small  <i>b</i> − <i>Ax̂</i>   ⇒   <i>x̂</i> solves a nearby problem", 30)
        r2 = M("⇏   <i>x̂</i> close to <i>x</i>,   when κ is large", 30)
        r1.move_to(np.array([0, -3.05, 0]))
        d = self.say()                               # controls multipliers, not growth
        self.play(FadeOut(kt), VGroup(k, dg).animate.shift(UP * 0.3), run_time=min(1.0, d * 0.5))
        r2.next_to(r1, DOWN, buff=0.2)
        d = self.say()                               # small residual: nearby problem
        self.play(FadeIn(r1), run_time=min(1.2, d))
        d = self.say()                               # not close when kappa is large
        self.play(FadeIn(r2), c.animate.set_value(0.18), run_time=min(1.6, d))
        d = self.say()                               # chapter nine
        self.play(Indicate(k, color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
