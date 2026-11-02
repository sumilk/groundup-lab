"""LU: elimination, remembered. Script: docs/LA02_VIDEO_SCRIPT.md, section "LU: elimination, remembered".

One worked thread: the cast's one-multiplier LU, the 3 x 3 system from Elimination (L built from its multipliers,
forward substitution, the operation count), partial pivoting on the same matrix (PA = LU), and LDU.
"""
from sample import *  # noqa: F401,F403
from sample import C_L1, C_L2

C_R3 = "#D7C49E"            # third equation of the 3 x 3 system (sand), as in 06_elimination
ROWC = [C_L1, C_L2, C_R3]   # the 3 x 3 system's equations / rows of A
A3 = [["2", "1", "1"], ["4", "1", "0"], ["−2", "2", "1"]]

MS = 30                     # matrix / equation size


def eqrow(*items, size=MS, buff=0.16):
    """Mixed row: strings become M(), mobjects are kept."""
    return VGroup(*[M(i, size) if isinstance(i, str) else i for i in items]).arrange(RIGHT, buff=buff)


def mat(rows, size=MS, colors=None, **kw):
    return matrix_mob(rows, size=size, entry_colors=colors, **kw)


def aug(rows, size=MS, colors=None):
    """Augmented matrix: a bar before the last column."""
    m = matrix_mob(rows, size=size, entry_colors=colors)
    e = m.entries
    x = (e[0][-2].get_right()[0] + e[0][-1].get_left()[0]) / 2
    m.add(Line([x, m.get_top()[1] - 0.08, 0], [x, m.get_bottom()[1] + 0.08, 0], stroke_width=2, color=C_DIM))
    return m


def under(m, s, size=26, color=C_DIM, buff=0.15):
    return M(s, size, color).next_to(m, DOWN, buff=buff)


def bg(m, buff=0.05):
    m.add_background_rectangle(color=config.background_color, opacity=0.9, buff=buff)
    return m


def ring(m, color=WHITE, buff=0.08):
    return SurroundingRectangle(m, color=color, buff=buff, corner_radius=0.08, stroke_width=3)


def dimmed(rows, keep):
    """entry colours: everything C_DIM except the positions in keep (dict pos -> colour)."""
    c = {(i, j): C_DIM for i in range(len(rows)) for j in range(len(rows[0]))}
    c.update(keep)
    return c


class LU(NScene):
    PARAS = [
        ["Suppose you have to solve A x equals b for twenty different right-hand sides, all with the same A. The row operations depend only on A. Which entries get cleared, which multipliers, which pivots.",
         "Only the right-hand column is different each time.",
         "Repeating the whole elimination twenty times redoes almost all of that work.",
         "How can you record the elimination once, and reuse it?"],
        ["Start with the cast.",
         "One operation, row two minus a half of row one, turned A into the triangular matrix U. Undo it, and you're back to A.",
         "A is the undo matrix times U. Undoing means adding back a half of row one, so the undo matrix has plus a half where the operation had "
         "minus a half.",
         "It is the multiplier itself, sitting in row two, column one."],
        ["Half of U's top row, plus all of its bottom row, gives one, one.",
         "Row two of A."],
        ["Back to the three by three system we eliminated earlier.",
         "It needed three operations, with multipliers two, minus one and minus three.",
         "Each is an elementary matrix, with minus the multiplier in the position it cleared.",
         "Multiplying A by all three, in the order they were done, gives the triangular U."],
        ["To get A back, multiply U by the inverses, in reverse order.",
         "Each inverse just flips the sign of its one off-diagonal entry.",
         "What do you expect their product to look like?"],
        ["The multipliers, each in the place where it was used, with no arithmetic at all.",
         "Two in row two, column one.",
         "Minus one in row three, column one.",
         "Minus three in row three, column two.",
         "Ones on the diagonal, zeros above.",
         "A matrix of that shape is called unit lower triangular."],
        ["Check one row on screen.",
         "Row three of L says how much of each row of U to take, and that combination lands exactly on row three "
         "of A."],
        ["The forward product isn't so tidy.",
         "Watch its bottom-left entry.",
         "It's minus five, which isn't any multiplier.",
         "Row three got row one directly once, and again through row two, which already held some of row one, and "
         "the two contributions combined.",
         "In L, each multiplier acts on a row of U, a finished row that nothing else changes afterwards, so nothing "
         "combines.",
         "That's why L, and not the forward product, is the record to keep."],
        ["In general, all the operations clearing column k form one matrix, the identity minus a column of "
         "multipliers below the diagonal in column k. Its inverse adds them instead.",
         "When the inverses multiply in order, each cross term would pair a multiplier column with a position above "
         "it, where that column is zero.",
         "Nothing mixes, and the product is the identity with every multiplier in its own place."],
        ["With A equal to L U, the equation A x equals b becomes L times U x equals b.",
         "Call U x by a name, c. Solve L c equals b first, then U x equals c. Both are triangular, so each is quick."],
        ["L is lower triangular, so its top row involves only c one.",
         "Solve from the top down.",
         "That's called forward substitution.",
         "Take b equal to three, six, one."],
        ["The top row gives c one equals three.",
         "Each row below adds one new unknown, so c two is zero and c three is four.",
         "That's exactly the right-hand column elimination produced earlier.",
         "Forward substitution replays the elimination on b alone.",
         "Back substitution on U x equals c then returns one, two, minus one, as before."],
        ["How much work does the record save?",
         "Count one flop for each addition, subtraction, multiplication or division."],
        ["Clearing column k affects the n minus k rows below the pivot.",
         "Each one needs a division for its multiplier.",
         "Then, for each of its n minus k remaining entries, one multiplication and one subtraction.",
         "Column k costs n minus k, plus two times n minus k squared."],
        ["Add up over the columns, and the full count is on screen.",
         "What matters is how it grows.",
         "The factorisation grows like n cubed, about two thirds n cubed.",
         "Each solve after that grows only like n squared, about two n squared for the two substitutions."],
        ["For n equal to a thousand, one factorisation is about six hundred and seventy million flops.",
         "One pair of substitutions is about two million.",
         "So once the factors exist, each extra right-hand side is more than three hundred times cheaper.",
         "Forming A inverse instead costs about two n cubed flops, three times the factorisation, and is rarely "
         "worth it.",
         "Solve with the factors."],
        ["No row swaps have been needed yet.",
         "When a zero, or on a computer a very small number, lands in the pivot position, elimination swaps rows.",
         "A permutation matrix is the identity with its rows reordered.",
         "Multiplying by it reorders the rows of A the same way."],
        ["The usual rule is called partial pivoting.",
         "In each column, swap up the entry with the largest absolute value, from the pivot position down.",
         "Then every multiplier is an entry divided by something at least as large, so its size is at most one."],
        ["Run it on the same matrix.",
         "In column one, the candidates are two, four and minus two.",
         "Which row supplies the pivot?"],
        ["Four, in row two, so swap it to the top.",
         "Both multipliers have size one half, and column one clears.",
         "In column two, five halves beats a half, so swap again, carrying the stored multipliers along.",
         "The last multiplier is a fifth, and the last pivot is four fifths."],
        ["The rows of A were used in the order two, three, one.",
         "With that reordering, A factors as L U again, and every multiplier in L has size at most one, where the "
         "unpivoted elimination used minus three.",
         "The check of row three is on screen."],
        ["That works for every square matrix.",
         "A later swap only exchanges rows below the columns already cleared, so it can be slid to the front, at the "
         "cost of swapping a few stored multipliers.",
         "All the swaps collect into one P, and the multipliers form L as before, still of size at most one.",
         "If a column has no nonzero candidate, that step is skipped, leaving a zero on U's diagonal."],
        ["And the diagonal of U tells you whether A is invertible, since P and L always are.",
         "If every diagonal entry is nonzero, back substitution on U x equals zero forces every unknown to zero, "
         "from the bottom up.",
         "If the entry in column k is zero, the first k columns of U live in the first k minus one coordinates, so "
         "they're dependent, and U is singular."],
        ["To solve with P A equals L U, multiply A x equals b by P first.",
         "That just reorders b, in the same order, rows two, three, one.",
         "Three, six, one becomes six, one, three.",
         "Undoing P is easy too.",
         "Its columns are different standard basis vectors, so P transpose times P is the identity, and P inverse "
         "is P transpose."],
        ["Forward substitution on six, one, three, then back substitution, gives one, two, minus one.",
         "The same answer as before."],
        ["One more refinement.",
         "Divide each row of U by its pivot, and U becomes a diagonal matrix D of pivots, times a unit upper "
         "triangular matrix.",
         "For the unpivoted example, D holds two, minus one and minus four.",
         "A is then L D U prime, with ones on the diagonals of both triangular factors."],
        ["When A is invertible and needs no swaps, those three factors are unique.",
         "If two such products are equal, rearranging puts a lower triangular matrix on one side and an upper "
         "triangular one on the other.",
         "A matrix that's both is diagonal, and the unit diagonals then force the factors to match.",
         "For a symmetric A, the upper factor is the transpose of the lower one, and A equals L D L transpose.",
         "Chapter seven builds the Cholesky factorisation from that form."],
    ]

    def construct(self):
        self.twenty()
        self.cast_lu()
        self.three_by_three()
        self.theorem18()
        self.solving()
        self.flops()
        self.permutation()
        self.pivoting()
        self.theorem19()
        self.swapped_solve()
        self.ldu()
        self.done(1.5)
        self.clear_all()

    def wipe(self, run_time=0.6):
        mobs = list(self.mobjects)
        if mobs:
            self.play(*[FadeOut(m) for m in mobs], run_time=run_time)

    # ------------------------------------------------------------------------------------------ twenty b's
    def twenty(self):
        A = mat([["2", "−1"], ["1", "1"]], size=34, colors={("col", 0): C_U, ("col", 1): C_Q})
        x = M("<i>x</i>", 34)
        eq = M("=", 34)
        head = VGroup(A, x, eq).arrange(RIGHT, buff=0.2).move_to(np.array([-4.9, 0.2, 0]))
        cols = VGroup(*[Rectangle(width=0.24, height=1.0, stroke_color=C_W, stroke_width=2,
                                  fill_color=C_W, fill_opacity=0.25) for _ in range(20)])
        cols.arrange(RIGHT, buff=0.21).next_to(eq, RIGHT, buff=0.35)
        labs = VGroup(M("<i>b</i><sub>1</sub>", 24, C_W).next_to(cols[0], DOWN, buff=0.15),
                      M("<i>b</i><sub>2</sub>", 24, C_W).next_to(cols[1], DOWN, buff=0.15),
                      M("…", 24, C_W).next_to(cols[10], DOWN, buff=0.15),
                      M("<i>b</i><sub>20</sub>", 24, C_W).next_to(cols[19], DOWN, buff=0.15))
        d = self.say()                               # twenty right-hand sides ... depend only on A ... pivots
        self.play(FadeIn(head), run_time=0.8)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.1) for c in cols], lag_ratio=0.15), FadeIn(labs),
                  run_time=min(2.0, d * 0.3))
        self.play(Indicate(A, color=WHITE, scale_factor=1.08), run_time=min(1.2, d * 0.2))
        piv = ring(A.entries[0][0])
        clr = ring(A.entries[1][0], color=C_DIM)
        self.play(Create(piv), Create(clr), run_time=min(1.0, max(0.4, d - 4.2)))
        d = self.say()                               # only the right-hand column differs
        self.play(LaggedStart(*[Indicate(c, color=C_W, scale_factor=1.15) for c in cols], lag_ratio=0.1),
                  run_time=min(2.0, d))
        ghosts = VGroup(*[A.copy().set_opacity(0.35).scale(0.2).next_to(c, UP, buff=0.15) for c in cols])
        d = self.say()                               # repeating it twenty times
        self.play(LaggedStart(*[TransformFromCopy(A, g) for g in ghosts], lag_ratio=0.12), run_time=min(3.0, d))
        self.say()                                   # how can you record it once?
        self.pause(0.6)
        self.tw = SimpleNamespace(A=A, x=x, eq=eq, cols=cols, labs=labs, ghosts=ghosts, piv=piv, clr=clr)

    # ------------------------------------------------------------------------------------------ the cast
    def cast_lu(self):
        t = self.tw
        cc = {("col", 0): C_U, ("col", 1): C_Q}
        E = mat([["1", "0"], ["−½", "1"]], colors=dimmed([[0, 0], [0, 0]], {(1, 0): WHITE}))
        A1 = mat([["2", "−1"], ["1", "1"]], colors=cc)
        U1 = mat([["2", "−1"], ["0", "3/2"]])
        line1 = eqrow(E, A1, "=", U1, buff=0.2).move_to(np.array([0, 2.1, 0]))
        op1 = P("<i>R</i><sub>2</sub> − ½<i>R</i><sub>1</sub>", 24, C_DIM).next_to(E, UP, buff=0.15)
        n1 = VGroup(under(E, "<i>E</i>"), under(A1, "<i>A</i>"), under(U1, "<i>U</i>"))

        d = self.say()                               # start with the cast
        self.play(FadeOut(VGroup(t.cols, t.labs, t.ghosts, t.x, t.eq, t.piv, t.clr)),
                  ReplacementTransform(t.A, A1), run_time=min(1.2, d))
        d = self.say()                               # one operation turned A into U; undo it, back to A
        self.play(FadeIn(E), FadeIn(op1), FadeIn(n1[:2]), run_time=min(1.2, d * 0.3))
        self.play(FadeIn(line1[2]), TransformFromCopy(A1, U1), FadeIn(n1[2]), run_time=min(1.4, d * 0.3))
        undo = CurvedArrow(U1.get_bottom() + DOWN * 0.55, A1.get_bottom() + DOWN * 0.55, angle=-PI / 3,
                           color=WHITE, stroke_width=3, tip_length=0.2)
        undo_l = P("undo", 22, C_DIM).next_to(undo, DOWN, buff=0.08)
        self.play(Create(undo), FadeIn(undo_l), run_time=min(1.2, max(0.4, d * 0.3)))

        Ei = mat([["1", "0"], ["½", "1"]], colors=dimmed([[0, 0], [0, 0]], {(1, 0): WHITE}))
        A2 = mat([["2", "−1"], ["1", "1"]], colors=cc)
        U2 = mat([["2", "−1"], ["0", "3/2"]])
        line2 = eqrow(A2, "=", Ei, U2, buff=0.2).move_to(np.array([0, -0.6, 0]))
        op2 = P("<i>R</i><sub>2</sub> + ½<i>R</i><sub>1</sub>", 24, C_DIM).next_to(Ei, UP, buff=0.15)
        n2 = VGroup(under(A2, "<i>A</i>"), under(Ei, "<i>E</i><sup>−1</sup>"), under(U2, "<i>U</i>"))
        d = self.say()                               # A is the undo matrix times U; adding back a half
        self.play(FadeOut(undo), FadeOut(undo_l), TransformFromCopy(A1, A2), FadeIn(line2[1]),
                  TransformFromCopy(U1, U2), FadeIn(n2[0]), FadeIn(n2[2]), run_time=min(1.4, d * 0.25))
        self.play(FadeIn(Ei), FadeIn(op2), FadeIn(n2[1]), run_time=min(1.0, d * 0.2))
        self.play(Indicate(E.entries[1][0], color=WHITE, scale_factor=1.5), run_time=min(1.0, d * 0.2))
        self.play(Indicate(Ei.entries[1][0], color=WHITE, scale_factor=1.5), run_time=min(1.0, d * 0.2))
        d = self.say()                               # the multiplier itself, row 2 col 1
        r = ring(Ei.entries[1][0])
        nL = under(Ei, "<i>L</i>", color=WHITE)
        lu = M("= <i>LU</i>", MS).next_to(U2, RIGHT, buff=0.25)
        self.play(Create(r), run_time=min(0.8, d * 0.4))
        self.play(ReplacementTransform(n2[1], nL), FadeIn(lu), run_time=min(1.0, d * 0.4))
        self.pause(2.0)                              # ⏸ multiply out the bottom row of LU

        chk = eqrow("½ · (2, −1)", "+", "1 · (0, 3/2)", "=", "(1, 1)").move_to(np.array([0, -2.9, 0]))
        d = self.say()                               # half of U's top row plus its bottom row
        self.play(FadeOut(r), Indicate(VGroup(*Ei.entries[1]), color=WHITE), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(chk[:3]), Indicate(VGroup(*U2.entries[0], *U2.entries[1]), color=WHITE),
                  run_time=min(1.4, d * 0.35))
        self.play(FadeIn(chk[3:]), run_time=min(0.8, d * 0.25))
        d = self.say()                               # row two of A
        self.play(Indicate(VGroup(*A2.entries[1]), color=WHITE, scale_factor=1.3),
                  Indicate(chk[4], color=WHITE), run_time=min(1.2, d))
        self.pause(0.5)
        self.wipe()

    # ------------------------------------------------------------------------------------------ 3 x 3
    def three_by_three(self):
        rc = {(i, j): ROWC[i] for i in range(3) for j in range(3)}
        A = mat(A3, colors=rc)
        xs = [-4.4, 0, 4.4]
        ops = [("<i>R</i><sub>2</sub> − 2<i>R</i><sub>1</sub>", "ℓ<sub>21</sub> =", "2"),
               ("<i>R</i><sub>3</sub> + <i>R</i><sub>1</sub>", "ℓ<sub>31</sub> =", "−1"),
               ("<i>R</i><sub>3</sub> + 3<i>R</i><sub>2</sub>", "ℓ<sub>32</sub> =", "−3")]
        opm, vals = VGroup(), []
        for k, (o, l, v) in enumerate(ops):
            vm = M(v, 28)
            g = VGroup(P(o, 24), M(l, 28), vm).arrange(RIGHT, buff=0.14)
            g[0].shift(LEFT * 0.25)
            g.move_to(np.array([xs[k], 3.35, 0]))
            opm.add(g)
            vals.append(vm)
        pos = [(1, 0), (2, 0), (2, 1)]
        ent = ["−2", "1", "3"]
        inv = ["2", "−1", "−3"]
        names = ["21", "31", "32"]

        def emat(k, txt):
            rows = [["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]]
            i, j = pos[k]
            rows[i][j] = txt
            return mat(rows, size=28, colors=dimmed(rows, {(i, j): WHITE}))

        Es = VGroup(*[emat(k, ent[k]).move_to(np.array([xs[k] + 0.45, 1.85, 0])) for k in range(3)])
        Enames = VGroup(*[M(f"<i>E</i><sub>{names[k]}</sub> =", 28).next_to(Es[k], LEFT, buff=0.15)
                          for k in range(3)])
        U = mat([["2", "1", "1"], ["0", "−1", "−2"], ["0", "0", "−4"]])
        prod = eqrow("<i>E</i><sub>32</sub><i>E</i><sub>31</sub><i>E</i><sub>21</sub>", A, "=", U, buff=0.22)
        prod.move_to(np.array([-1.0, -0.3, 0]))
        nU = under(U, "<i>U</i>")
        nA = under(A, "<i>A</i>")

        d = self.say()                               # back to the 3 x 3 system
        A.move_to(prod[1])
        self.play(FadeIn(A), FadeIn(nA), run_time=min(1.2, d))
        d = self.say()                               # three operations, multipliers 2, −1, −3
        self.play(LaggedStart(*[FadeIn(g) for g in opm], lag_ratio=0.5), run_time=min(2.4, d))
        d = self.say()                               # each is an elementary matrix
        self.play(LaggedStart(*[FadeIn(VGroup(Enames[k], Es[k])) for k in range(3)], lag_ratio=0.4),
                  run_time=min(2.4, d))
        d = self.say()                               # multiplying A by all three gives U
        self.play(FadeIn(prod[0]), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(prod[2]), TransformFromCopy(A, U), FadeIn(nU), run_time=min(1.4, d * 0.45))

        # ---- the inverses, in reverse order
        invline = eqrow("<i>A</i> =", "<i>E</i><sub>21</sub><sup>−1</sup><i>E</i><sub>31</sub><sup>−1</sup>"
                        "<i>E</i><sub>32</sub><sup>−1</sup><i>U</i>", buff=0.18)
        invline.move_to(np.array([-2.6, -2.45, 0]))
        d = self.say()                               # multiply U by the inverses, in reverse order
        self.play(FadeIn(invline), run_time=min(1.4, d))
        d = self.say()                               # each inverse flips one sign
        newE = VGroup(*[emat(k, inv[k]).move_to(Es[k]) for k in range(3)])
        newN = VGroup(*[M(f"<i>E</i><sub>{names[k]}</sub><sup>−1</sup> =", 28).next_to(newE[k], LEFT, buff=0.15)
                        for k in range(3)])
        self.play(*[Transform(Es[k].entries[pos[k][0]][pos[k][1]],
                              newE[k].entries[pos[k][0]][pos[k][1]]) for k in range(3)],
                  *[ReplacementTransform(Enames[k], newN[k]) for k in range(3)], run_time=min(1.6, d))
        self.say()                                   # what do you expect their product to look like?
        self.pause(3.0)                              # ⏸ predict the product (L hidden)

        rowsL = [["1", "0", "0"], ["2", "1", "0"], ["−1", "−3", "1"]]
        L = mat(rowsL, colors=dimmed(rowsL, {p: WHITE for p in pos}))
        Lgrp = eqrow("=", L, "<i>U</i>", buff=0.18).next_to(invline, RIGHT, buff=0.2)
        nL = under(L, "<i>L</i>")
        d = self.say()                               # the multipliers, each in its place
        self.play(FadeIn(Lgrp[0]), FadeIn(VGroup(L[0], L[2])), FadeIn(Lgrp[2]), run_time=min(1.0, d))
        for k in range(3):
            d = self.say()                           # 2 / −1 / −3 into place
            self.play(TransformFromCopy(vals[k], L.entries[pos[k][0]][pos[k][1]], path_arc=-0.6),
                      run_time=min(1.5, d))
        d = self.say()                               # ones on the diagonal, zeros above
        rest = [L.entries[i][j] for i in range(3) for j in range(3) if (i, j) not in pos]
        self.play(LaggedStart(*[FadeIn(e) for e in rest], lag_ratio=0.15), run_time=min(1.4, d))
        d = self.say()                               # TERM unit lower triangular
        term = P("unit lower triangular", 24).next_to(L, DOWN, buff=0.15)
        self.play(FadeIn(term), run_time=min(1.0, d))
        self.pause(0.5)

        # ---- check row 3:  L U = A
        L2 = mat(rowsL, colors=dimmed(rowsL, {(2, 0): WHITE, (2, 1): WHITE, (2, 2): WHITE}))
        U2 = mat([["2", "1", "1"], ["0", "−1", "−2"], ["0", "0", "−4"]])
        A2 = mat(A3, colors=rc)
        top = eqrow(L2, U2, "=", A2, buff=0.25).move_to(np.array([0, 1.4, 0]))
        names2 = VGroup(under(L2, "<i>L</i>"), under(U2, "<i>U</i>"), under(A2, "<i>A</i>"))
        chk = eqrow("−1 · (2, 1, 1)", "− 3 · (0, −1, −2)", "+ 1 · (0, 0, −4)", "=", M("(−2, 2, 1)", MS, C_R3),
                    buff=0.18).move_to(np.array([0, -1.2, 0]))
        d = self.say()                               # check one row on screen
        self.play(FadeOut(VGroup(opm, Es, newN, prod[0], prod[2], nA, nU, invline, Lgrp[0], Lgrp[2], term)),
                  *[FadeOut(Es[k].entries[pos[k][0]][pos[k][1]]) for k in range(3)],
                  ReplacementTransform(L, L2), ReplacementTransform(U, U2), ReplacementTransform(A, A2),
                  run_time=min(1.4, d))
        self.play(FadeIn(top[2]), FadeIn(names2), run_time=0.5)
        d = self.say()                               # row three of L ... lands on row three of A
        self.play(Indicate(VGroup(*L2.entries[2]), color=WHITE), run_time=min(1.0, d * 0.2))
        for k in range(3):
            self.play(FadeIn(chk[k]), Indicate(VGroup(*U2.entries[k]), color=WHITE), run_time=min(1.0, d * 0.18))
        self.play(FadeIn(chk[3:]), Indicate(VGroup(*A2.entries[2]), color=C_R3, scale_factor=1.3),
                  run_time=min(1.0, d * 0.2))
        self.pause(2.0)                              # ⏸ read the check

        # ---- the forward product
        L3 = mat(rowsL, colors=dimmed(rowsL, {p: WHITE for p in pos}))
        Lg = VGroup(M("<i>L</i> =", MS), L3).arrange(RIGHT, buff=0.2).move_to(np.array([-3.4, 0.9, 0]))
        rowsF = [["1", "0", "0"], ["−2", "1", "0"], ["−5", "3", "1"]]
        F = mat(rowsF, colors=dimmed(rowsF, {(1, 0): WHITE, (2, 0): WHITE, (2, 1): WHITE}))
        Fg = VGroup(M("<i>E</i><sub>32</sub><i>E</i><sub>31</sub><i>E</i><sub>21</sub> =", MS), F)
        Fg.arrange(RIGHT, buff=0.2).move_to(np.array([3.0, 0.9, 0]))
        d = self.say()                               # the forward product isn't so tidy
        self.play(FadeOut(VGroup(chk, top[2], names2, U2, A2)), ReplacementTransform(L2, L3), FadeIn(Lg[0]),
                  run_time=min(1.0, d * 0.5))
        self.play(FadeIn(Fg), run_time=min(1.0, d * 0.45))
        d = self.say()                               # watch its bottom-left entry
        self.play(Indicate(F.entries[2][0], color=WHITE, scale_factor=1.5), run_time=min(1.2, d))
        d = self.say()                               # minus five, not a multiplier
        r5 = ring(F.entries[2][0])
        self.play(Create(r5), run_time=min(0.8, d))
        why = eqrow("−5", "=", "1", "+", "3 · (−2)", buff=0.16).move_to(np.array([3.0, -1.6, 0]))
        tags = VGroup(P("row 1 directly", 22, C_DIM).next_to(why[2], DOWN, buff=0.25),
                      P("row 1 through row 2", 22, C_DIM).next_to(why[4], DOWN, buff=0.25))
        tags[0].shift(LEFT * 0.5)
        tags[1].next_to(why[4], DOWN, buff=0.7).shift(RIGHT * 0.4)
        d = self.say()                               # row 3 got row 1 directly, and through row 2
        self.play(TransformFromCopy(F.entries[2][0], why[0]), FadeIn(why[1]), run_time=min(0.8, d * 0.15))
        self.play(FadeIn(why[2]), FadeIn(tags[0]), run_time=min(1.0, d * 0.25))
        self.play(FadeIn(why[3:]), FadeIn(tags[1]), run_time=min(1.0, d * 0.25))
        d = self.say()                               # in L, each multiplier acts on a finished row of U
        self.play(Indicate(VGroup(*[L3.entries[i][j] for i, j in pos]), color=WHITE, scale_factor=1.3),
                  run_time=min(1.4, d))
        d = self.say()                               # L is the record to keep
        self.play(FadeOut(VGroup(Fg, r5, why, tags)), run_time=min(0.8, d * 0.4))
        self.play(VGroup(Lg[0], L3).animate.move_to(ORIGIN), run_time=min(1.0, d * 0.4))
        self.pause(0.5)
        self.wipe()

    # ------------------------------------------------------------------------------------------ Theorem 18
    def theorem18(self):
        rows = [["1", "0", "0", "0"], ["0", "1", "0", "0"], ["0", "−ℓ<sub>32</sub>", "1", "0"],
                ["0", "−ℓ<sub>42</sub>", "0", "1"]]
        Lk = mat(rows, size=26, colors=dimmed(rows, {(2, 1): WHITE, (3, 1): WHITE}))
        Lk.move_to(np.array([-5.0, 1.5, 0]))
        nLk = M("<i>L</i><sub>2</sub>, <i>n</i> = 4", 24, C_DIM).next_to(Lk, DOWN, buff=0.2)
        s = "<sub><i>k</i></sub>"
        l1 = M(f"<i>L</i>{s} = <i>I</i> − ℓ{s}<i>e</i>{s}<sup>T</sup>,   ℓ{s} zero in positions 1, …, <i>k</i>", 28)
        l2 = M(f"<i>L</i>{s}<sup>−1</sup> = <i>I</i> + ℓ{s}<i>e</i>{s}<sup>T</sup>,   since "
               f"<i>e</i>{s}<sup>T</sup>ℓ{s} = 0", 28)
        l3 = M("(<i>I</i> + ℓ<sub>1</sub><i>e</i><sub>1</sub><sup>T</sup>)(<i>I</i> + ℓ<sub>2</sub>"
               "<i>e</i><sub>2</sub><sup>T</sup>) ⋯ :  every cross term contains", 28)
        l4 = M("<i>e</i><sub><i>j</i></sub><sup>T</sup>ℓ<sub><i>k</i></sub> = 0  (<i>j</i> &lt; <i>k</i>)", 28)
        l5 = M("product = <i>I</i> + ℓ<sub>1</sub><i>e</i><sub>1</sub><sup>T</sup> + ⋯ + "
               "ℓ<sub><i>n</i>−1</sub><i>e</i><sub><i>n</i>−1</sub><sup>T</sup>", 28)
        lines = VGroup(l1, l2, l3, l4, l5).arrange(DOWN, buff=0.28, aligned_edge=LEFT)
        lines.move_to(np.array([1.45, 1.4, 0]))
        thm = VGroup(P("<b>Theorem 18.</b>  If elimination on a square <i>A</i> meets a nonzero pivot in every "
                       "column", 24),
                     P("without swaps, then <i>A</i> = <i>LU</i>, with <i>U</i> the upper triangular result and "
                       "<i>L</i> unit lower", 24),
                     P("triangular holding ℓ<sub>ij</sub> in position (<i>i</i>, <i>j</i>).", 24))
        thm.arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        thm = boxed(thm, color=C_DIM, buff=0.22, fill=0.05).move_to(np.array([0, -2.8, 0]))

        d = self.say()                               # clearing column k is one matrix; its inverse adds them
        self.play(FadeIn(Lk), FadeIn(nLk), run_time=min(1.0, d * 0.2))
        self.play(FadeIn(l1), run_time=min(1.2, d * 0.25))
        self.wait(max(0, d * 0.55 - 2.2))
        flip = [M("ℓ<sub>32</sub>", 26).move_to(Lk.entries[2][1]), M("ℓ<sub>42</sub>", 26).move_to(Lk.entries[3][1])]
        self.play(FadeIn(l2), Transform(Lk.entries[2][1], flip[0]), Transform(Lk.entries[3][1], flip[1]),
                  run_time=min(1.4, d * 0.3))
        d = self.say()                               # cross terms pair a multiplier column with a position above it
        self.play(FadeIn(l3), run_time=min(1.2, d * 0.35))
        self.play(FadeIn(l4), run_time=min(1.0, d * 0.3))
        d = self.say()                               # nothing mixes
        self.play(FadeIn(l5), run_time=min(1.0, d * 0.4))
        self.play(FadeIn(thm), run_time=min(1.2, d * 0.5))
        self.pause(2.0)                              # ⏸ read the theorem
        self.wipe()

    # ------------------------------------------------------------------------------------------ Lc = b
    def solving(self):
        top = eqrow("<i>Ax</i> = <i>b</i>", "⇒", "<i>L</i>(<i>Ux</i>) = <i>b</i>", buff=0.3)
        top.move_to(np.array([-2.2, 3.2, 0]))
        brace = Brace(top[2][2:6], DOWN, buff=0.08, color=C_DIM)
        bl = M("<i>c</i>", 26, C_DIM).next_to(brace, DOWN, buff=0.05)
        steps = eqrow("first  <i>Lc</i> = <i>b</i>,", "then  <i>Ux</i> = <i>c</i>", buff=0.4)
        steps.next_to(top, RIGHT, buff=0.7)
        d = self.say()                               # Ax = b becomes L(Ux) = b
        self.play(FadeIn(top[0]), run_time=min(0.8, d * 0.3))
        self.play(FadeIn(top[1:]), run_time=min(1.0, d * 0.4))
        d = self.say()                               # call Ux c; Lc = b then Ux = c; both triangular
        self.play(GrowFromCenter(brace), FadeIn(bl), run_time=min(0.8, d * 0.2))
        self.play(FadeIn(steps[0]), run_time=min(0.8, d * 0.25))
        self.play(FadeIn(steps[1]), run_time=min(0.8, d * 0.25))

        rowsL = [["1", "0", "0"], ["2", "1", "0"], ["−1", "−3", "1"]]
        L = mat(rowsL)
        c = column_vec(["<i>c</i><sub>1</sub>", "<i>c</i><sub>2</sub>", "<i>c</i><sub>3</sub>"], size=MS)
        b = column_vec(["<i>b</i><sub>1</sub>", "<i>b</i><sub>2</sub>", "<i>b</i><sub>3</sub>"], size=MS, color=C_W)
        sysm = eqrow(L, c, "=", b, buff=0.22).move_to(np.array([-3.6, 0.6, 0]))
        nL = under(L, "<i>L</i>")
        d = self.say()                               # top row involves only c1
        self.play(FadeOut(VGroup(brace, bl)), FadeIn(sysm), FadeIn(nL), run_time=min(1.2, d * 0.4))
        hl1 = SurroundingRectangle(VGroup(*L.entries[0]), color=WHITE, buff=0.08, corner_radius=0.08)
        self.play(Create(hl1), Indicate(c.entries[0][0], color=WHITE), run_time=min(1.0, d * 0.4))
        arr = Arrow(L.get_left() + LEFT * 0.35 + UP * 0.6, L.get_left() + LEFT * 0.35 + DOWN * 0.6, buff=0,
                    color=WHITE, stroke_width=4, tip_length=0.2)
        d = self.say()                               # solve from the top down
        self.play(FadeOut(hl1), GrowArrow(arr), run_time=min(1.0, d))
        term = P("forward substitution", 24).next_to(sysm, DOWN, buff=0.45)
        d = self.say()                               # TERM forward substitution
        self.play(FadeIn(term), run_time=min(1.0, d))
        b2 = column_vec(["3", "6", "1"], size=MS, color=C_W).move_to(b)
        d = self.say()                               # take b = (3, 6, 1)
        self.play(ReplacementTransform(b, b2), run_time=min(1.0, d))
        self.pause(3.0)                              # ⏸ solve Lc = (3, 6, 1) (c values hidden)

        sol = VGroup(M("<i>c</i><sub>1</sub> = 3", MS),
                     M("2<i>c</i><sub>1</sub> + <i>c</i><sub>2</sub> = 6  ⇒  <i>c</i><sub>2</sub> = 0", MS),
                     M("−<i>c</i><sub>1</sub> − 3<i>c</i><sub>2</sub> + <i>c</i><sub>3</sub> = 1  ⇒  "
                       "<i>c</i><sub>3</sub> = 4", MS),
                     M("<i>c</i> = (3, 0, 4)", MS)).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        sol.move_to(np.array([3.2, 0.7, 0]))
        d = self.say()                               # c1 = 3
        self.play(FadeIn(sol[0]), run_time=min(1.0, d))
        d = self.say()                               # c2 = 0, c3 = 4
        self.play(FadeIn(sol[1]), run_time=min(1.0, d * 0.35))
        self.play(FadeIn(sol[2]), run_time=min(1.0, d * 0.35))
        self.play(FadeIn(sol[3]), run_time=min(0.8, d * 0.25))
        ub = aug([["2", "1", "1", "3"], ["0", "−1", "−2", "0"], ["0", "0", "−4", "4"]],
                 colors={(i, 3): WHITE for i in range(3)} | {(i, j): C_DIM for i in range(3) for j in range(3)})
        ubl = P("after elimination", 22, C_DIM).next_to(ub, LEFT, buff=0.3)
        VGroup(ubl, ub).move_to(np.array([-2.6, -2.55, 0]))
        rr = SurroundingRectangle(VGroup(*[ub.entries[i][3] for i in range(3)]), color=WHITE, buff=0.1,
                                  corner_radius=0.08)
        d = self.say()                               # exactly elimination's right-hand column
        self.play(FadeIn(ub), FadeIn(ubl), run_time=min(1.0, d * 0.5))
        self.play(Create(rr), run_time=min(0.8, d * 0.4))
        d = self.say()                               # replays the elimination on b alone
        self.play(Indicate(sol[3], color=WHITE), Indicate(rr, color=WHITE), run_time=min(1.4, d))
        back = M("<i>Ux</i> = <i>c</i>  ⇒  <i>x</i> = (1, 2, −1)", MS).move_to(np.array([3.4, -2.55, 0]))
        d = self.say()                               # back substitution returns (1, 2, −1)
        self.play(FadeIn(back), run_time=min(1.2, d))
        self.pause(1.5)                              # ⏸ compare c with the right-hand column
        self.wipe()

    # ------------------------------------------------------------------------------------------ flops
    def flops(self):
        n, k, cs = 6, 2, 0.5
        o = np.array([-5.6, 1.4, 0])                 # top-left corner of the grid

        def cell(i, j):                              # 1-based row, column
            return Square(cs, stroke_color=C_GRID, stroke_width=2).move_to(o + np.array([(j - 0.5) * cs,
                                                                                        -(i - 0.5) * cs, 0]))
        grid = VGroup(*[cell(i, j) for i in range(1, n + 1) for j in range(1, n + 1)])
        d = self.say()                               # how much work does the record save?
        self.play(Create(grid), run_time=min(1.2, d))
        flop = P("flop: one +, −, × or ÷", 26).move_to(np.array([2.6, 3.3, 0]))
        d = self.say()                               # TERM flop
        self.play(FadeIn(flop), run_time=min(1.0, d))

        piv = cell(k, k).set_stroke(WHITE, 3)
        below = VGroup(*[cell(i, j) for i in range(k + 1, n + 1) for j in range(1, n + 1)])
        rows_box = SurroundingRectangle(below, color=WHITE, buff=0.03, stroke_width=2)
        rl = Brace(below, LEFT, buff=0.08, color=C_DIM)
        rlt = M("<i>n</i> − <i>k</i> rows", 24, C_DIM).next_to(rl, LEFT, buff=0.08)
        rlt.rotate(PI / 2).next_to(rl, LEFT, buff=0.08)
        colk = M("column <i>k</i>", 24, C_DIM).next_to(cell(1, k), UP, buff=0.12)
        d = self.say()                               # n − k rows below the pivot
        self.play(Create(piv), FadeIn(colk), run_time=min(0.8, d * 0.35))
        self.play(Create(rows_box), GrowFromCenter(rl), FadeIn(rlt), run_time=min(1.0, d * 0.45))
        mult = VGroup(*[cell(i, k) for i in range(k + 1, n + 1)]).set_fill(WHITE, 0.45)
        ml = P("÷ once per row: the multiplier", 22).move_to(np.array([2.6, 1.0, 0]))
        d = self.say()                               # a division for its multiplier
        self.play(FadeIn(mult), FadeIn(ml), run_time=min(1.0, d))
        blk = VGroup(*[cell(i, j) for i in range(k + 1, n + 1) for j in range(k + 1, n + 1)]).set_fill(C_DIM, 0.45)
        tb = Brace(VGroup(*[cell(k + 1, j) for j in range(k + 1, n + 1)]), UP, buff=0.04, color=C_DIM)
        tbt = M("<i>n</i> − <i>k</i>", 22, C_DIM).next_to(cell(1, n), RIGHT, buff=0.15)
        bl = P("× and − for each remaining entry", 22).move_to(np.array([2.6, 0.3, 0]))
        d = self.say()                               # one multiplication and one subtraction each
        self.play(FadeOut(colk), FadeIn(blk), GrowFromCenter(tb), FadeIn(tbt), FadeIn(bl), run_time=min(1.2, d))
        cost = M("column <i>k</i>:  (<i>n</i> − <i>k</i>) + 2(<i>n</i> − <i>k</i>)<sup>2</sup>", MS)
        cost.move_to(np.array([2.6, -0.8, 0]))
        d = self.say()                               # column k costs ...
        self.play(FadeIn(cost), run_time=min(1.2, d))
        self.pause(0.5)

        s1 = M("<i>j</i> = <i>n</i> − <i>k</i>:   Σ<sub><i>j</i>=1</sub><sup><i>n</i>−1</sup> (<i>j</i> + 2<i>j</i>"
               "<sup>2</sup>)  =  (<i>n</i>−1)<i>n</i>/2 + 2·(<i>n</i>−1)<i>n</i>(2<i>n</i>−1)/6", MS)
        s2 = M("= ⅔<i>n</i><sup>3</sup> − ½<i>n</i><sup>2</sup> − ⅙<i>n</i>  ≈  ⅔<i>n</i><sup>3</sup>", MS)
        s3 = M("forward substitution, unit <i>L</i>:  <i>n</i><sup>2</sup> − <i>n</i>     back substitution:  "
               "<i>n</i><sup>2</sup>", 28)
        s1.move_to(np.array([0, 1.9, 0]))
        s2.next_to(s1, DOWN, buff=0.3).align_to(s1, LEFT).shift(RIGHT * 1.6)
        s3.next_to(s2, DOWN, buff=0.45).set_x(0)
        d = self.say()                               # add up over the columns
        self.play(FadeOut(VGroup(grid, piv, rows_box, rl, rlt, mult, ml, blk, tb, tbt, bl)),
                  cost.animate.move_to(np.array([-2.6, 3.3, 0])), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(s1), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(s2), run_time=min(1.0, d * 0.3))
        d = self.say()                               # what matters is how it grows
        self.play(Indicate(s2, color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
        fac = M("factor  ≈ ⅔<i>n</i><sup>3</sup>", MS).move_to(np.array([-3.2, -0.6, 0]))
        d = self.say()                               # grows like n cubed
        self.play(FadeIn(fac), run_time=min(1.0, d))
        d = self.say()                               # each solve: about 2n²
        s3.move_to(np.array([0, -1.4, 0]))
        slv = M("each solve  ≈ 2<i>n</i><sup>2</sup>", MS).move_to(np.array([3.2, -0.6, 0]))
        self.play(FadeIn(s3), run_time=min(1.0, d * 0.45))
        self.play(FadeIn(slv), run_time=min(1.0, d * 0.4))
        self.pause(2.0)                              # ⏸ read the total

        n1 = M("<i>n</i> = 1000:", MS).move_to(np.array([-5.4, -2.4, 0]))
        f1 = M("factor ≈ 6.7 × 10<sup>8</sup>", MS).next_to(n1, RIGHT, buff=0.4)
        f2 = M("forward + back ≈ 2 × 10<sup>6</sup>", MS).next_to(f1, RIGHT, buff=0.5)
        f3 = M("ratio &gt; 300", MS).move_to(np.array([-1.0, -3.3, 0]))
        f4 = M("<i>A</i><sup>−1</sup>:  ≈ 2<i>n</i><sup>3</sup> = 3 × factor", MS).next_to(f3, RIGHT, buff=0.8)
        d = self.say()                               # 670 million
        self.play(FadeIn(n1), FadeIn(f1), run_time=min(1.2, d))
        d = self.say()                               # two million
        self.play(FadeIn(f2), run_time=min(1.0, d))
        d = self.say()                               # 300 times cheaper
        self.play(FadeIn(f3), run_time=min(1.0, d))
        d = self.say()                               # forming A inverse
        self.play(FadeIn(f4), run_time=min(1.0, d))
        d = self.say()                               # solve with the factors
        self.play(Indicate(VGroup(f1, f2), color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
        self.pause(0.5)
        self.wipe()

    # ------------------------------------------------------------------------------------------ P
    def permutation(self):
        I = mat([["1", "0", "0"], ["0", "1", "0"], ["0", "0", "1"]])
        I.move_to(np.array([-4.2, 0.8, 0]))
        nI = under(I, "<i>I</i>")
        d = self.say()                               # no swaps needed yet
        self.play(FadeIn(I), FadeIn(nI), run_time=min(1.0, d))
        self.say()                                   # when a zero lands in the pivot position
        rows = [VGroup(*I.entries[i]) for i in range(3)]
        ys = [r.get_y() for r in rows]
        d = self.say()                               # the identity with its rows reordered
        nP = under(I, "<i>P</i>", color=WHITE)
        self.play(rows[1].animate.set_y(ys[0]), rows[2].animate.set_y(ys[1]), rows[0].animate.set_y(ys[2]),
                  ReplacementTransform(nI, nP), run_time=min(1.6, d * 0.6))
        term = P("permutation matrix", 24).next_to(nP, DOWN, buff=0.15)
        self.play(FadeIn(term), run_time=min(0.8, d * 0.3))
        rc = {(i, j): ROWC[i] for i in range(3) for j in range(3)}
        A = mat(A3, colors=rc)
        PA = mat([A3[1], A3[2], A3[0]], colors={(i, j): ROWC[[1, 2, 0][i]] for i in range(3) for j in range(3)})
        grp = eqrow(A, "=", PA, buff=0.3).next_to(I, RIGHT, buff=0.3)
        nA = under(A, "<i>A</i>")
        nPA = under(PA, "<i>PA</i>")
        d = self.say()                               # multiplying by it reorders the rows of A
        self.play(FadeIn(A), FadeIn(nA), FadeIn(grp[1]), FadeIn(VGroup(PA[0], PA[2])), run_time=min(1.0, d * 0.35))
        self.play(*[TransformFromCopy(VGroup(*A.entries[[1, 2, 0][i]]), VGroup(*PA.entries[i])) for i in range(3)],
                  FadeIn(nPA), run_time=min(1.6, d * 0.55))
        pp = P("<b>partial pivoting</b>", 26).move_to(np.array([0, -2.2, 0]))
        ppl = P("pivot = largest |entry| at or below the pivot position  ⇒  |ℓ| ≤ 1", 24, C_DIM)
        ppl.next_to(pp, DOWN, buff=0.2)
        d = self.say()                               # TERM partial pivoting
        self.play(FadeIn(pp), FadeIn(ppl), run_time=min(1.2, d))
        d = self.say()                               # swap up the largest
        self.play(Indicate(ppl, color=WHITE, scale_factor=1.03), run_time=min(1.2, d))
        self.say()                                   # every multiplier at most one
        self.pause(0.5)
        self.play(FadeOut(VGroup(I, nP, term, A, nA, grp[1], PA, nPA, pp)),
                  ppl.animate.move_to(np.array([0, 3.45, 0])), run_time=0.8)
        self.ppl = ppl

    # ------------------------------------------------------------------------------------------ pivoting
    def pivoting(self):
        cx, xs, ys = 0.9, [-0.85, 0.15, 1.15], [2.3, 1.6, 0.9]
        sx = [-2.3, -1.5]                            # stored multiplier slots (columns 1, 2)
        tx = 2.95                                    # row tags (left edge)

        def at(i, j):
            return np.array([cx + xs[j], ys[i], 0])

        rows = [VGroup(*[M(A3[r][j], MS, ROWC[r]).move_to(at(r, j)) for j in range(3)]) for r in range(3)]
        tags = [P(f"row {r + 1} of <i>A</i>", 22, ROWC[r]) for r in range(3)]
        for r in range(3):
            tags[r].move_to(np.array([tx + tags[r].width / 2, ys[r], 0]))
        h = 2.0
        lb = VGroup(Line(UP * h / 2, DOWN * h / 2), Line(UP * h / 2, UP * h / 2 + RIGHT * 0.12),
                    Line(DOWN * h / 2, DOWN * h / 2 + RIGHT * 0.12)).set_stroke(WHITE, 2)
        rb = lb.copy().flip(UP)
        lb.move_to(np.array([cx + xs[0] - 0.6, ys[1], 0]))
        rb.move_to(np.array([cx + xs[2] + 0.6, ys[1], 0]))
        head = P("stored ℓ", 22, C_DIM).move_to(np.array([(sx[0] + sx[1]) / 2, ys[0] + 0.55, 0]))
        slots = VGroup(*[DashedLine(np.array([sx[0] - 0.35, y - 0.28, 0]), np.array([sx[1] + 0.35, y - 0.28, 0]),
                                    color=C_GRID, dash_length=0.06) for y in ys[1:]])
        pos = [0, 1, 2]                              # pos[r] = current position of original row r
        d = self.say()                               # run it on the same matrix
        self.play(FadeIn(VGroup(lb, rb, *rows, *tags, head, slots)), run_time=min(1.2, d))
        cand = SurroundingRectangle(VGroup(*[rows[r][0] for r in range(3)]), color=WHITE, buff=0.12,
                                    corner_radius=0.08)
        d = self.say()                               # candidates 2, 4, −2
        self.play(Create(cand), run_time=min(1.0, d))
        self.say()                                   # which row supplies the pivot?
        self.pause(3.0)                              # ⏸ pick the pivot (swap hidden)

        def move_rows(perm_pairs, extra=()):
            anims = []
            for r, p in perm_pairs:
                pos[r] = p
                anims += [rows[r].animate.set_y(ys[p]), tags[r].animate.set_y(ys[p])]
            return anims + list(extra)

        d = self.say()                               # four, in row two: swap to the top
        r4 = ring(rows[1][0])
        self.play(Create(r4), run_time=min(0.6, d * 0.3))
        self.play(FadeOut(cand), FadeOut(r4), *move_rows([(1, 0), (0, 1)]), run_time=min(1.4, d * 0.6))
        l21 = M("½", 28).move_to(np.array([sx[0], ys[1], 0]))
        l31 = M("−½", 28).move_to(np.array([sx[0], ys[2], 0]))
        d = self.say()                               # multipliers of size one half; column one clears
        self.play(FadeIn(l21), FadeIn(l31), run_time=min(0.8, d * 0.3))
        new0 = [("0", "½", "1"), None, ("0", "5/2", "1")]
        self.play(*[Transform(rows[r][j], M(new0[r][j], MS, C_DIM if j == 0 else ROWC[r]).move_to(rows[r][j]))
                    for r in (0, 2) for j in range(3)], run_time=min(1.2, d * 0.5))
        d = self.say()                               # column two: 5/2 beats 1/2, swap again, multipliers along
        cand2 = SurroundingRectangle(VGroup(rows[0][1], rows[2][1]), color=WHITE, buff=0.12, corner_radius=0.08)
        self.play(Create(cand2), run_time=min(0.8, d * 0.2))
        self.play(FadeOut(cand2), *move_rows([(0, 2), (2, 1)]), l21.animate.set_y(ys[2]), l31.animate.set_y(ys[1]),
                  run_time=min(1.6, d * 0.45))
        l32 = M("⅕", 28).move_to(np.array([sx[1], ys[2], 0]))
        d = self.say()                               # last multiplier a fifth, last pivot four fifths
        self.play(FadeIn(l32), run_time=min(0.8, d * 0.35))
        self.play(Transform(rows[0][1], M("0", MS, C_DIM).move_to(rows[0][1])),
                  Transform(rows[0][2], M("⅘", MS, ROWC[0]).move_to(rows[0][2])), run_time=min(1.0, d * 0.45))
        self.pause(2.0)                              # ⏸ read the two steps

        # ---- PA = LU
        d = self.say()                               # rows used in the order 2, 3, 1
        for r in (1, 2, 0):
            self.play(Indicate(tags[r], color=ROWC[r], scale_factor=1.15), run_time=min(0.8, d / 3.3))
        PA = mat([A3[1], A3[2], A3[0]], colors={(i, j): ROWC[[1, 2, 0][i]] for i in range(3) for j in range(3)})
        Lr = [["1", "0", "0"], ["−½", "1", "0"], ["½", "⅕", "1"]]
        L = mat(Lr, colors=dimmed(Lr, {(1, 0): WHITE, (2, 0): WHITE, (2, 1): WHITE}))
        U = mat([["4", "1", "0"], ["0", "5/2", "1"], ["0", "0", "⅘"]])
        fl = eqrow("<i>PA</i> =", PA, "=", L, U, buff=0.22).move_to(np.array([0, -1.0, 0]))
        nl = VGroup(under(L, "<i>L</i>,  every |ℓ| ≤ 1"), under(U, "<i>U</i>"))
        d = self.say()                               # A factors as LU again, every |ℓ| ≤ 1
        self.play(FadeIn(fl[:3]), run_time=min(1.0, d * 0.25))
        self.play(TransformFromCopy(VGroup(l31, l21, l32), VGroup(L.entries[1][0], L.entries[2][0],
                                                                   L.entries[2][1])),
                  FadeIn(VGroup(L[0], L[2], *[L.entries[i][j] for i in range(3) for j in range(3)
                                              if (i, j) not in ((1, 0), (2, 0), (2, 1))])),
                  run_time=min(1.4, d * 0.3))
        self.play(FadeIn(U), FadeIn(nl), run_time=min(1.0, d * 0.25))
        chk = M("½ · (4, 1, 0) + ⅕ · (0, 5/2, 1) + (0, 0, ⅘) = <span foreground='" + C_L1 + "'>(2, 1, 1)</span>",
                MS).move_to(np.array([0, -3.1, 0]))
        d = self.say()                               # the check of row three
        self.play(FadeIn(chk), Indicate(VGroup(*L.entries[2]), color=WHITE), run_time=min(1.4, d))
        self.pause(2.0)                              # ⏸ read the factorisation and the check
        self.wipe()

    # ------------------------------------------------------------------------------------------ Theorem 19
    def theorem19(self):
        ls = VGroup(P("<b>Theorem 19.</b>  For every <i>n</i> × <i>n</i> matrix <i>A</i> there are a permutation "
                      "<i>P</i>, a unit lower", 24),
                    P("triangular <i>L</i> and an upper triangular <i>U</i> with <i>PA</i> = <i>LU</i>.", 24),
                    P("With partial pivoting, every entry of <i>L</i> has absolute value at most 1.", 24),
                    P("<i>U</i> has a zero on its diagonal exactly when <i>A</i> is singular.", 24))
        ls.arrange(DOWN, buff=0.18, aligned_edge=LEFT)
        box = boxed(ls, color=C_DIM, buff=0.25, fill=0.05).move_to(np.array([0, 2.55, 0]))
        self.ppl_out = self.ppl
        d = self.say()                               # works for every square matrix
        self.play(FadeOut(self.ppl), FadeIn(box), run_time=min(1.4, d))
        d = self.say()                               # a later swap can be slid to the front
        self.play(Indicate(VGroup(ls[0], ls[1]), color=WHITE, scale_factor=1.02), run_time=min(1.4, d))
        d = self.say()                               # all swaps in one P, |ℓ| ≤ 1
        self.play(Indicate(ls[2], color=WHITE, scale_factor=1.02), run_time=min(1.4, d))
        d = self.say()                               # no candidate: zero on U's diagonal
        self.play(Indicate(ls[3], color=WHITE, scale_factor=1.02), run_time=min(1.4, d))

        rows = [["•", "•", "•", "•"], ["0", "•", "•", "•"], ["0", "0", "•", "•"], ["0", "0", "0", "•"]]
        U = mat(rows, size=30, colors={(i, j): C_DIM for i in range(4) for j in range(4) if i > j})
        U.move_to(np.array([-3.8, -1.55, 0]))
        nU = under(U, "<i>U</i>")
        d = self.say()                               # diagonal of U decides invertibility
        self.play(FadeIn(U), FadeIn(nU), run_time=min(1.0, d * 0.5))
        self.play(Indicate(VGroup(*[U.entries[i][i] for i in range(4)]), color=WHITE, scale_factor=1.4),
                  run_time=min(1.0, d * 0.4))
        bu = VGroup(M("<i>Ux</i> = 0  ⇒", MS), M("<i>x</i><sub>4</sub> = 0,", MS), M("<i>x</i><sub>3</sub> = 0,", MS),
                    M("<i>x</i><sub>2</sub> = 0,", MS), M("<i>x</i><sub>1</sub> = 0", MS)).arrange(RIGHT, buff=0.2)
        bu.move_to(np.array([2.4, -0.7, 0]))
        arr = Arrow(U.get_corner(DR) + RIGHT * 0.3, U.get_corner(UR) + RIGHT * 0.3, buff=0, color=WHITE,
                    stroke_width=4, tip_length=0.2)
        d = self.say()                               # every diagonal entry nonzero: bottom up
        self.play(GrowArrow(arr), FadeIn(bu[0]), run_time=min(1.0, d * 0.3))
        self.play(LaggedStart(*[FadeIn(m) for m in bu[1:]], lag_ratio=0.5), run_time=min(2.0, d * 0.6))
        d = self.say()                               # zero in column k: first k columns dependent
        z = M("0", 30).move_to(U.entries[2][2])
        self.play(FadeOut(arr), FadeOut(bu), Transform(U.entries[2][2], z), run_time=min(0.8, d * 0.2))
        hl = SurroundingRectangle(VGroup(*[U.entries[i][j] for i in range(2) for j in range(3)]), color=WHITE,
                                  buff=0.12, corner_radius=0.08)
        lab = VGroup(P("<i>k</i> = 3: columns 1–3 live in", 24), P("the first 2 coordinates ⇒ dependent", 24))
        lab.arrange(DOWN, buff=0.12, aligned_edge=LEFT).move_to(np.array([1.6, -1.55, 0]))
        if lab.get_right()[0] > 6.8:
            lab.shift(LEFT * (lab.get_right()[0] - 6.8))
        self.play(Create(hl), FadeIn(lab), run_time=min(1.4, d * 0.4))
        self.pause(2.0)                              # ⏸ read the theorem
        self.wipe()

    # ------------------------------------------------------------------------------------------ Pb
    def swapped_solve(self):
        top = M("<i>Ax</i> = <i>b</i>  ⇒  <i>PAx</i> = <i>Pb</i>  ⇒  <i>LUx</i> = <i>Pb</i>", MS)
        top.move_to(np.array([0, 3.25, 0]))
        d = self.say()                               # multiply by P first
        self.play(FadeIn(top), run_time=min(1.4, d))
        b = column_vec(["3", "6", "1"], size=MS, color=C_W).move_to(np.array([-4.8, 0.9, 0]))
        nb = under(b, "<i>b</i>")
        tg = VGroup(*[P(f"row {i + 1}", 22, C_DIM).next_to(b.entries[i][0], LEFT, buff=0.55) for i in range(3)])
        pb = column_vec(["6", "1", "3"], size=MS, color=C_W).move_to(np.array([-1.9, 0.9, 0]))
        npb = under(pb, "<i>Pb</i>")
        ar = Arrow(b.get_right(), pb.get_left(), buff=0.25, color=C_DIM, stroke_width=3, tip_length=0.18)
        d = self.say()                               # reorders b: rows two, three, one
        self.play(FadeIn(b), FadeIn(nb), FadeIn(tg), run_time=min(1.0, d * 0.4))
        self.play(GrowArrow(ar), FadeIn(VGroup(pb[0], pb[2])), FadeIn(npb), run_time=min(0.8, d * 0.3))
        d = self.say()                               # 3, 6, 1 becomes 6, 1, 3
        self.play(*[TransformFromCopy(b.entries[[1, 2, 0][i]][0], pb.entries[i][0], path_arc=-0.5) for i in range(3)],
                  run_time=min(1.6, d))
        Pm = mat([["0", "1", "0"], ["0", "0", "1"], ["1", "0", "0"]])
        Pg = VGroup(M("<i>P</i> =", MS), Pm).arrange(RIGHT, buff=0.2).move_to(np.array([1.6, 0.9, 0]))
        d = self.say()                               # undoing P is easy too
        self.play(FadeIn(Pg), run_time=min(1.0, d))
        pt = M("<i>P</i><sup>T</sup><i>P</i> = <i>I</i>  ⇒  <i>P</i><sup>−1</sup> = <i>P</i><sup>T</sup>", MS)
        pt.next_to(Pg, RIGHT, buff=0.5)
        if pt.get_right()[0] > 6.8:
            VGroup(Pg, pt).shift(LEFT * (pt.get_right()[0] - 6.8))
        d = self.say()                               # columns are distinct basis vectors
        self.play(LaggedStart(*[Indicate(VGroup(*[Pm.entries[i][j] for i in range(3)]), color=WHITE)
                                for j in range(3)], lag_ratio=0.4), run_time=min(1.8, d * 0.5))
        self.play(FadeIn(pt), run_time=min(1.0, d * 0.35))

        fw = VGroup(M("<i>c</i><sub>1</sub> = 6", MS),
                    M("<i>c</i><sub>2</sub> = 1 + ½ · 6 = 4", MS),
                    M("<i>c</i><sub>3</sub> = 3 − ½ · 6 − ⅕ · 4 = −⅘", MS)).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        bk = VGroup(M("⅘<i>x</i><sub>3</sub> = −⅘  ⇒  <i>x</i><sub>3</sub> = −1", MS),
                    M("(5/2)<i>x</i><sub>2</sub> + <i>x</i><sub>3</sub> = 4  ⇒  <i>x</i><sub>2</sub> = 2", MS),
                    M("4<i>x</i><sub>1</sub> + <i>x</i><sub>2</sub> = 6  ⇒  <i>x</i><sub>1</sub> = 1", MS))
        bk.arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        fw.move_to(np.array([-3.5, -1.85, 0]))
        bk.move_to(np.array([3.2, -1.85, 0]))
        hf = P("forward", 22, C_DIM).next_to(fw, UP, buff=0.2)
        hb = P("back", 22, C_DIM).next_to(bk, UP, buff=0.2)
        d = self.say()                               # forward then back gives 1, 2, −1
        self.play(FadeIn(hf), LaggedStart(*[FadeIn(m) for m in fw], lag_ratio=0.6), run_time=min(2.4, d * 0.5))
        self.play(FadeIn(hb), LaggedStart(*[FadeIn(m) for m in bk], lag_ratio=0.6), run_time=min(2.4, d * 0.45))
        res = M("<i>x</i> = (1, 2, −1)", 32).move_to(np.array([0, -3.45, 0]))
        d = self.say()                               # the same answer as before
        self.play(FadeIn(res), Create(ring(res)), run_time=min(1.0, d))
        self.pause(2.0)                              # ⏸ read the solution
        self.wipe()

    # ------------------------------------------------------------------------------------------ LDU
    def ldu(self):
        Ur = [["2", "1", "1"], ["0", "−1", "−2"], ["0", "0", "−4"]]
        U = mat(Ur)
        D = mat([["2", "0", "0"], ["0", "−1", "0"], ["0", "0", "−4"]],
                colors={(i, j): C_DIM for i in range(3) for j in range(3) if i != j})
        Up = mat([["1", "½", "½"], ["0", "1", "2"], ["0", "0", "1"]])
        line = eqrow(U, "=", D, Up, buff=0.25).move_to(np.array([0, 1.9, 0]))
        names = VGroup(under(U, "<i>U</i>"), under(D, "<i>D</i>"), under(Up, "<i>U</i>′"))
        d = self.say()                               # one more refinement
        self.play(FadeIn(U), FadeIn(names[0]), run_time=min(1.0, d))
        d = self.say()                               # divide each row by its pivot
        self.play(FadeIn(line[1]), FadeIn(VGroup(D[0], D[2], *[D.entries[i][j] for i in range(3) for j in range(3)
                                                               if i != j])), FadeIn(names[1]),
                  run_time=min(0.8, d * 0.2))
        self.play(*[TransformFromCopy(U.entries[i][i], D.entries[i][i]) for i in range(3)], run_time=min(1.2, d * 0.3))
        self.play(FadeIn(Up), FadeIn(names[2]), run_time=min(1.2, d * 0.35))
        d = self.say()                               # D holds 2, −1, −4
        self.play(Indicate(VGroup(*[D.entries[i][i] for i in range(3)]), color=WHITE, scale_factor=1.3),
                  run_time=min(1.2, d))
        ldu = M("<i>A</i> = <i>LDU</i>′", 32).move_to(np.array([0, -0.4, 0]))
        d = self.say()                               # A = LDU′, ones on both diagonals
        self.play(FadeIn(ldu), run_time=min(1.0, d * 0.4))
        self.play(Indicate(VGroup(*[Up.entries[i][i] for i in range(3)]), color=WHITE, scale_factor=1.3),
                  run_time=min(1.2, d * 0.45))
        self.pause(0.5)

        u1 = eqrow("<i>L</i><sub>1</sub><i>D</i><sub>1</sub><i>U</i><sub>1</sub> = <i>L</i><sub>2</sub><i>D</i><sub>2</sub>"
                   "<i>U</i><sub>2</sub>", "⇒", "<i>L</i><sub>2</sub><sup>−1</sup><i>L</i><sub>1</sub><i>D</i><sub>1</sub>",
                   "=", "<i>D</i><sub>2</sub><i>U</i><sub>2</sub><i>U</i><sub>1</sub><sup>−1</sup>", buff=0.25)
        u1.move_to(np.array([0, -1.45, 0]))
        lo = P("lower", 22, C_DIM).next_to(u1[2], DOWN, buff=0.12)
        up = P("upper", 22, C_DIM).next_to(u1[4], DOWN, buff=0.12)
        u2 = M("lower = upper ⇒ diagonal  ⇒  <i>L</i><sub>1</sub> = <i>L</i><sub>2</sub>,  <i>D</i><sub>1</sub> = "
               "<i>D</i><sub>2</sub>,  <i>U</i><sub>1</sub> = <i>U</i><sub>2</sub>", 28).move_to(np.array([0, -2.6, 0]))
        u3 = M("symmetric <i>A</i>:   <i>A</i> = <i>LDL</i><sup>T</sup>", 32).move_to(np.array([0, -3.45, 0]))
        d = self.say()                               # unique when invertible and no swaps
        self.play(Indicate(ldu, color=WHITE), run_time=min(1.2, d))
        d = self.say()                               # rearranging: lower on one side, upper on the other
        self.play(FadeIn(u1[0]), run_time=min(1.0, d * 0.3))
        self.play(FadeIn(u1[1:]), FadeIn(lo), FadeIn(up), run_time=min(1.4, d * 0.5))
        d = self.say()                               # both: diagonal; factors match
        self.play(FadeIn(u2), run_time=min(1.4, d))
        d = self.say()                               # symmetric: A = LDLᵀ
        self.play(FadeIn(u3), run_time=min(1.2, d))
        d = self.say()                               # Cholesky in chapter seven
        self.play(Indicate(u3, color=WHITE, scale_factor=1.05), run_time=min(1.2, d))
