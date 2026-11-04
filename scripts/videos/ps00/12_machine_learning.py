"""Where this shows up in machine learning (docs/PS00_VIDEO_SCRIPT.md, section 12).

Six short connections, each reusing a picture from earlier in the video (local versions are drawn here):
the frequency tree with bars (precision), the dice grid conditioned on a filter, the chain rule under a token
sequence, the copied coin next to a leaky train/test split, a conditional versus an intervention, and twenty
prompt scores (a seeded simulation of Binomial(200, 0.7)/200). It closes on the flagged model, 95% vs 33%.
"""
import random
import statistics

from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column

# ---- best of twenty: real, seeded simulations ------------------------------------------------------------------
PROMPT_SEED = 4      # the twenty bars on screen
AVG_SEED = 3         # 300 repetitions of "best of twenty" -> average best ~0.76


def scores(r, k=20, n=200, p=0.7):
    return [sum(r.random() < p for _ in range(n)) / n for _ in range(k)]


SCORES = scores(random.Random(PROMPT_SEED))
_r = random.Random(AVG_SEED)
AVG_BEST = statistics.mean(max(scores(_r)) for _ in range(300))
assert abs(AVG_BEST - 0.76) < 0.005

# ---- the classifier numbers -----------------------------------------------------------------------------------
N, NPOS = 10_000, 100
NNEG = N - NPOS
TP = 90              # 90% of 100
FP = 495             # 5% of 9,900
assert TP == round(0.9 * NPOS) and FP == round(0.05 * NNEG)


def box(lines, color, size=24, fill=0.25, min_w=1.2):
    """A rounded box holding one or two short lines (a node of the frequency tree)."""
    t = VGroup(*[P(s, size, WHITE if k else color) if False else P(s, size, WHITE) for k, s in enumerate(lines)])
    t.arrange(DOWN, buff=0.08)
    r = RoundedRectangle(width=max(min_w, t.width + 0.35), height=t.height + 0.3, corner_radius=0.1,
                         stroke_color=color, stroke_width=2.5).set_fill(color, opacity=fill)
    r.move_to(t)
    return VGroup(r, t)


def link(a, b, lab, side):
    ln = Line(a.get_bottom() + DOWN * 0.05, b.get_top() + UP * 0.05, stroke_color="#7A8394", stroke_width=2.5)
    l = M(lab, 24, C_DIM).next_to(ln.get_center(), side, buff=0.2)
    return VGroup(ln, l)


class MachineLearning(NScene):
    PARAS = [
        ["These ideas sit underneath a lot of machine learning, and the pictures you've already seen come "
         "straight back.",
         "A classifier catches ninety percent of real positives, and wrongly flags five percent of negatives.",
         "Positives are one percent of the data.",
         "Out of ten thousand examples, a hundred are positive and ninety of them are caught.",
         "Nine thousand nine hundred are negative, and four hundred and ninety-five of them are wrongly flagged.",
         "Of the five hundred and eighty-five flagged, ninety are real.",
         "About fifteen percent.",
         "The sensitivity is ninety percent, and the precision is fifteen.",
         "With so many negatives, even a five percent false-positive rate produces far more false flags than "
         "true ones, exactly as with the detector."],
        ["A benchmark has a thousand prompts, and a judge rates four hundred of them as easy and the rest as hard.",
         "Model A solves three hundred and sixty of the easy ones and a hundred and fifty of the hard ones.",
         "Model B solves three hundred and forty easy ones, and three hundred hard ones.",
         "Score only the easy prompts, and A gets ninety percent while B gets eighty-five.",
         "Score all thousand, and A gets fifty-one percent while B gets sixty-four.",
         "Conditioning on the filter reversed the comparison.",
         "It's the dice again.",
         "Keeping one region changes the denominator.",
         "A score on the easy prompts is a fair answer about the easy prompts.",
         "It just isn't an answer about all thousand."],
        ["A language model scores text one token at a time.",
         "The chance that it begins with these three tokens is the first token's probability, times the second "
         "given the first, times the third given the first two.",
         "That's the chain rule.",
         "To score the complete sentence, it also multiplies in the chance of an end token after the last word.",
         "Nothing here assumes the tokens are independent.",
         "Every factor is conditioned on everything before it."],
        ["Split data into training and test sets as if every example were independent, when many come from the "
         "same users, and near-copies can end up on both sides.",
         "Like the copied coin, the test set then carries less independent information than its size suggests.",
         "And because the model has effectively seen those users already, its score can look better than it "
         "would on genuinely new users."],
        ["A conditional probability describes what tends to occur together.",
         "It doesn't say what would happen if you changed something.",
         "Users who click an ad may buy more, but they may also be the users who were already planning to buy.",
         "Conditioning on the click picks out those users.",
         "It doesn't show what the ad itself does.",
         "Finding that out needs an experiment that decides who sees the ad, which a later chapter covers."],
        ["Last, try twenty prompts on the same evaluation and report the best one.",
         "For this toy model, treat every prompt's answer on every example as an independent trial with a "
         "seventy percent chance of being correct.",
         "Score each prompt on two hundred examples.",
         "Does the best one look better than seventy percent?"],
        ["It does.",
         "On average the best scores about seventy-six percent, and nothing about it is better.",
         "Picking the winner is conditioning on \"this one won\", and winners are the ones that got lucky.",
         "That number depends on the scores being independent.",
         "If the twenty prompts made identical predictions, they'd all score the same, and the best would "
         "average seventy percent.",
         "Either way, the honest fix doesn't change.",
         "Choose on one set of examples, then measure the chosen prompt once on fresh ones.",
         "The union bound is what lets you reason about this without knowing how the scores are related.",
         "The chance that any of the twenty looks good by luck is at most the sum of the chances for each one."],
        ["Go back to the flagged model.",
         "Ninety-five percent and thirty-three percent describe the same detector and the same population.",
         "What differs is the group each one conditions on.",
         "Ninety-five percent is the share of contaminated models that get flagged.",
         "Thirty-three percent is the share of flagged models that are contaminated.",
         "The chapter has the proofs, the exercises, and a lab where you build an exact conditional probability "
         "calculator yourself."],
    ]

    # ------------------------------------------------------------------------------------------------
    def beat(self, *anims, rt=1.2, lag=None):
        """Start the next beat and play anims inside it (never longer than the beat)."""
        d = self.say()
        if anims:
            t = min(rt, max(0.3, d - 0.15))
            if lag is not None:
                self.play(LaggedStart(*anims, lag_ratio=lag), run_time=t)
            else:
                self.play(*anims, run_time=t)
        return d

    def construct(self):
        self.precision()
        self.filtered()
        self.chain()
        self.leak()
        self.causal()
        self.best_of_twenty()
        self.flagged()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def precision(self):
        root = box(["10,000 examples"], "#9AA3B2", fill=0.08).move_to([-3.3, 3.05, 0])
        pos = box(["positive", "100"], C_CONT).move_to([-5.25, 1.45, 0])
        neg = box(["negative", "9,900"], C_CLEAN, min_w=2.4).move_to([-1.55, 1.45, 0])
        pf = box(["flagged", "90"], C_CONT, fill=0.45).move_to([-6.0, -0.35, 0])
        pn = box(["not", "10"], C_CONT, fill=0.08).move_to([-4.5, -0.35, 0])
        nf = box(["flagged", "495"], C_CLEAN, fill=0.45).move_to([-2.45, -0.35, 0])
        nn = box(["not", "9,405"], C_CLEAN, fill=0.08).move_to([-0.7, -0.35, 0])
        e_p = link(root, pos, "1%", LEFT)
        e_n = link(root, neg, "99%", RIGHT)
        e_pf = link(pos, pf, "90%", LEFT)
        e_pn = link(pos, pn, "10%", RIGHT)
        e_nf = link(neg, nf, "5%", LEFT)
        e_nn = link(neg, nn, "95%", RIGHT)

        card = VGroup()
        for v, txt, c in (("1%", "positive", C_CONT), ("90%", "of positives are flagged", WHITE),
                          ("5%", "of negatives are flagged", WHITE)):
            card.add(VGroup(M(v, 28, c), P(txt, 24, C_DIM)).arrange(RIGHT, buff=0.2))
        card.arrange(DOWN, aligned_edge=LEFT, buff=0.16).move_to([RX + 0.2, 2.6, 0])
        for row in card:
            row[0].shift(LEFT * 0)

        self.beat(FadeIn(root))                                        # the pictures come straight back
        self.beat(FadeIn(card[1:], lag_ratio=0.4))                     # catches 90%, flags 5%
        self.beat(FadeIn(card[0]))                                     # positives are 1%
        self.beat(Create(e_p[0]), FadeIn(e_p[1]), FadeIn(pos), Create(e_pf[0]), FadeIn(e_pf[1]), FadeIn(pf),
                  Create(e_pn[0]), FadeIn(e_pn[1]), FadeIn(pn), lag=0.12, rt=2.2)   # 100 positive, 90 caught
        self.beat(Create(e_n[0]), FadeIn(e_n[1]), FadeIn(neg), Create(e_nf[0]), FadeIn(e_nf[1]), FadeIn(nf),
                  Create(e_nn[0]), FadeIn(e_nn[1]), FadeIn(nn), lag=0.12, rt=2.2)   # 9,900 negative, 495

        # the two flagged groups lift out into bars drawn to scale, end to end
        u = 5.6 / (TP + FP)
        y = -1.95
        x0 = -6.3
        b_tp = Rectangle(width=TP * u, height=0.5, stroke_color=C_CONT, stroke_width=2).set_fill(C_CONT, 0.6)
        b_fp = Rectangle(width=FP * u, height=0.5, stroke_color=C_CLEAN, stroke_width=2).set_fill(C_CLEAN, 0.6)
        b_tp.move_to([x0 + TP * u / 2, y, 0])
        b_fp.next_to(b_tp, RIGHT, buff=0)
        l_tp = T("90", 24).next_to(b_tp, UP, buff=0.1)
        l_fp = T("495", 24).next_to(b_fp, UP, buff=0.1)
        br = Brace(VGroup(b_tp, b_fp), DOWN, color=C_DIM, buff=0.1)
        l_all = P("585 flagged", 24).next_to(br, DOWN, buff=0.1)
        d = self.say()                                                 # of 585 flagged, 90 real
        self.play(TransformFromCopy(pf[0], b_tp), TransformFromCopy(nf[0], b_fp), run_time=min(1.3, d * 0.4))
        self.play(FadeIn(l_tp), FadeIn(l_fp), GrowFromCenter(br), FadeIn(l_all), run_time=min(0.9, d * 0.3))
        frac15 = M("90/585 ≈ 0.15", 32).move_to([RX + 0.2, 0.55, 0])
        self.beat(FadeIn(frac15), Indicate(b_tp, color=C_CONT, scale_factor=1.15))   # about 15%

        s_lab = P("sensitivity", 24, C_DIM).move_to([RX + 0.2, 0.25, 0])
        s_eq = M("P(flag | positive) = 0.90", 30).next_to(s_lab, DOWN, buff=0.14)
        p_lab = P("precision", 24, C_DIM).next_to(s_eq, DOWN, buff=0.35)
        p_eq = M("P(positive | flag) = 90/585 ≈ 0.15", 30).next_to(p_lab, DOWN, buff=0.14)
        for m in (s_eq, p_eq):
            if m.width > 5.8:
                m.scale_to_fit_width(5.8)
        self.beat(FadeIn(s_lab), FadeIn(s_eq), FadeIn(p_lab), ReplacementTransform(frac15, p_eq), lag=0.2, rt=2.0)
        self.beat(Indicate(card[2], color=C_CLEAN, scale_factor=1.08), Indicate(b_fp, color=C_CLEAN, scale_factor=1.05),
                  Indicate(l_fp, color=C_CLEAN), rt=1.6)                # 5% of many negatives: far more false flags
        self.pause(0.8)
        self.play(FadeOut(VGroup(root, pos, neg, pf, pn, nf, nn, e_p, e_n, e_pf, e_pn, e_nf, e_nn, card,
                                 b_tp, b_fp, l_tp, l_fp, br, l_all, s_lab, s_eq, p_lab, p_eq)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def filtered(self):
        XL, U = -4.6, 0.01                                             # 1 prompt = 0.01 units; 1,000 = 10 units
        ys = {"all": 2.45, "A": 1.15, "B": -0.15}
        H = {"all": 0.5, "A": 0.6, "B": 0.6}
        solved = {"A": (360, 150), "B": (340, 300)}

        def seg(a, b, y, h, color, op, stroke=None):
            r = Rectangle(width=(b - a) * U, height=h, stroke_color=stroke or color, stroke_width=1.5)
            return r.set_fill(color, op).move_to([XL + (a + b) / 2 * U, y, 0])

        easy_all = seg(0, 400, ys["all"], H["all"], C_B, 0.45)
        hard_all = seg(400, 1000, ys["all"], H["all"], "#5B6475", 0.15)
        l_easy = P("rated easy · 400", 24, C_B).next_to(easy_all, UP, buff=0.14)
        l_hard = P("rated hard · 600", 24, C_DIM).next_to(hard_all, UP, buff=0.14)
        n_all = P("1,000 prompts", 22, C_DIM).next_to(VGroup(easy_all, hard_all), LEFT, buff=0.2)
        n_all.scale_to_fit_width(min(n_all.width, 1.9)).next_to(VGroup(easy_all, hard_all), LEFT, buff=0.15)
        rows = {}
        for m in ("A", "B"):
            se, sh = solved[m]
            y, h = ys[m], H[m]
            r = {
                "te": seg(0, 400, y, h, C_B, 0.08, stroke="#5B6475"),
                "th": seg(400, 1000, y, h, "#5B6475", 0.05),
                "se": seg(0, se, y, h, C_A, 0.6),
                "sh": seg(400, 400 + sh, y, h, C_A, 0.6),
            }
            r["le"] = T(str(se), 22).move_to(r["se"])
            r["lh"] = T(str(sh), 22).move_to(r["sh"])
            r["name"] = P(f"model {m}", 24).next_to(r["te"], LEFT, buff=0.2)
            rows[m] = r
        legend = VGroup(Square(0.22, stroke_width=0).set_fill(C_A, 0.6), P("solved", 22, C_DIM)).arrange(RIGHT, buff=0.12)
        legend.next_to(rows["B"]["th"], DOWN, buff=0.18).align_to(rows["B"]["th"], RIGHT)

        def row_mobs(m):
            r = rows[m]
            return VGroup(r["te"], r["th"], r["se"], r["sh"], r["le"], r["lh"], r["name"])

        self.beat(FadeIn(VGroup(easy_all, hard_all, n_all)), FadeIn(l_easy), FadeIn(l_hard), lag=0.3, rt=1.8)
        self.beat(FadeIn(row_mobs("A")), FadeIn(legend), rt=1.4)        # A: 360 + 150
        self.beat(FadeIn(row_mobs("B")), rt=1.4)                       # B: 340 + 300

        # score table under the bars
        def score(txt, y, x):
            return M(txt, 28).move_to([x, y, 0])
        t_easy = P("easy only", 24, C_B).move_to([-5.3, -1.75, 0])
        e_a = score("A  360/400 = 0.90", -1.75, -1.6)
        e_b = score("B  340/400 = 0.85", -1.75, 2.9)
        t_all = P("all 1,000", 24, C_DIM).move_to([-5.3, -2.65, 0])
        a_a = score("A  510/1,000 = 0.51", -2.65, -1.6)
        a_b = score("B  640/1,000 = 0.64", -2.65, 2.9)

        hard = [hard_all, rows["A"]["th"], rows["A"]["sh"], rows["A"]["lh"], rows["B"]["th"], rows["B"]["sh"],
                rows["B"]["lh"]]
        easy = [easy_all, rows["A"]["te"], rows["A"]["se"], rows["B"]["te"], rows["B"]["se"]]
        easy_labels = [rows["A"]["le"], rows["B"]["le"]]

        def cross():
            boxes = [hard_all, rows["A"]["th"], rows["B"]["th"]]
            marks = VGroup()
            for bx in boxes:
                l, r_ = bx.get_left()[0], bx.get_right()[0]
                for k in range(6):
                    x = l + (k + 0.5) * (r_ - l) / 6
                    marks.add(Line([x - 0.25, bx.get_bottom()[1] + 0.06, 0], [x + 0.25, bx.get_top()[1] - 0.06, 0],
                                   stroke_color="#6B7385", stroke_width=1.6))
            dark = [m.animate.set_fill(C_OFF, 0.9).set_stroke("#3A4252") for m in boxes] + \
                   [m.animate.set_fill(C_OFF, 0.9).set_stroke("#3A4252") for m in (rows["A"]["sh"], rows["B"]["sh"])] + \
                   [FadeOut(m) for m in (rows["A"]["lh"], rows["B"]["lh"])]
            return marks, dark

        def stretch_anims():
            anims = []
            for m in easy:
                t = m.copy()
                t.stretch(2.5, 0, about_point=np.array([XL, m.get_center()[1], 0]))
                anims.append(Transform(m, t))
            for lab in easy_labels:
                anims.append(FadeOut(lab))
            anims.append(l_easy.animate.move_to([XL + 5.0, l_easy.get_center()[1], 0]))
            return anims

        def wide_labels():
            return VGroup(*[T(lab.text, 22).move_to([XL + (saved[id(m)].get_center()[0] - XL) * 2.5,
                                                     m.get_center()[1], 0])
                            for lab, m in zip(easy_labels, (rows["A"]["se"], rows["B"]["se"]))])

        saved = {id(m): m.copy() for m in easy + hard + easy_labels + [l_easy]}
        saved_list = easy + hard + easy_labels + [l_easy]

        # score only the easy prompts: cross out the hard 600, stretch the easy 400 to fill the bar
        marks, dark = cross()
        d = self.say()                                                 # easy only: A 90%, B 85%
        self.play(*dark, Create(marks), FadeOut(l_hard), run_time=min(1.0, d * 0.25))
        self.play(FadeOut(VGroup(*[m for m in hard if m not in (rows["A"]["lh"], rows["B"]["lh"])], marks)), *stretch_anims(), run_time=min(1.4, d * 0.3))
        wl = wide_labels()
        self.play(FadeIn(wl), FadeIn(t_easy), FadeIn(e_a), FadeIn(e_b), run_time=0.6)

        # score all thousand: restore the whole bar
        d = self.say()                                                 # all: A 51%, B 64%
        restore = []
        for m in saved_list:
            if m in (rows["A"]["lh"], rows["B"]["lh"], *easy_labels):
                m.become(saved[id(m)])
                continue
            tgt = saved[id(m)].copy()
            restore.append(Transform(m, tgt))
        self.play(*restore, FadeIn(l_hard), FadeIn(rows["A"]["lh"]), FadeIn(rows["B"]["lh"]), FadeOut(wl),
                  *[FadeIn(lab) for lab in easy_labels],
                  run_time=min(1.3, d * 0.35))
        self.play(FadeIn(t_all), FadeIn(a_a), FadeIn(a_b), run_time=0.6)
        win1 = SurroundingRectangle(e_a, color=WHITE, buff=0.08, corner_radius=0.06)
        win2 = SurroundingRectangle(a_b, color=WHITE, buff=0.08, corner_radius=0.06)
        self.beat(Create(win1), Create(win2), rt=1.0)                  # the comparison reversed
        self.pause(1.0)

        # the dice again: keep one region and the denominator changes
        marks, dark = cross()
        self.beat(*dark, Create(marks), FadeOut(l_hard), FadeOut(win1), FadeOut(win2))   # it's the dice again
        d = self.say()                                                 # one region changes the denominator
        self.play(FadeOut(VGroup(*[m for m in hard if m not in (rows["A"]["lh"], rows["B"]["lh"])], marks)), *stretch_anims(), run_time=min(1.4, max(0.5, d * 0.5)))
        d400 = VGroup(SurroundingRectangle(e_a[5:8], color=C_B, buff=0.05),
                      SurroundingRectangle(e_b[5:8], color=C_B, buff=0.05))
        d1000 = VGroup(SurroundingRectangle(a_a[5:10], color=C_DIM, buff=0.05),
                       SurroundingRectangle(a_b[5:10], color=C_DIM, buff=0.05))
        wl = wide_labels()
        self.play(FadeIn(wl), Create(d400), Create(d1000), run_time=0.6)
        self.beat(Indicate(VGroup(t_easy, e_a, e_b), color=C_B, scale_factor=1.05))   # fair about the easy ones
        self.beat(Indicate(VGroup(t_all, a_a, a_b), color=WHITE, scale_factor=1.05))  # not about all thousand
        self.pause(1.0)
        self.play(FadeOut(VGroup(*easy, wl, l_easy, n_all, rows["A"]["name"], rows["B"]["name"], legend,
                                 t_easy, e_a, e_b, t_all, a_a, a_b, d400, d1000)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def chain(self):
        xs = [-4.8, -1.6, 1.6, 4.8]
        words = ["The", "cat", "sat", "⟨end⟩"]
        toks = VGroup()
        for w, x in zip(words, xs):
            t = T(w, 34) if w != "⟨end⟩" else M(w, 34, C_DIM)
            r = RoundedRectangle(width=t.width + 0.5, height=0.75, corner_radius=0.14,
                                 stroke_color=WHITE if w != "⟨end⟩" else C_DIM, stroke_width=2)
            toks.add(VGroup(r, t).move_to([x, 1.4, 0]))
        split = P("token split for illustration", 22, C_DIM).move_to([0, 0.55, 0])
        self.beat(LaggedStart(*[FadeIn(t, shift=RIGHT * 0.2) for t in toks[:3]], lag_ratio=0.4), FadeIn(split),
                  rt=1.8)                                              # one token at a time

        lhs3 = M("P(The, cat, sat)  =", 32).move_to([0, -0.35, 0])
        f1 = M("P(The)  ·", 30)
        f2 = M("P(cat | The)  ·", 30)
        f3 = M("P(sat | The, cat)", 30)
        line = VGroup(f1, f2, f3).arrange(RIGHT, buff=0.25).move_to([0, -1.15, 0])
        f2[6:9].set_color(C_B)
        f3[6:13].set_color(C_B)
        d = self.say()                                                 # first, second given first, third ...
        self.play(FadeIn(lhs3), run_time=0.6)
        self.play(LaggedStart(*[AnimationGroup(FadeIn(f), Indicate(t, color=WHITE, scale_factor=1.08))
                                for f, t in zip((f1, f2, f3), toks)], lag_ratio=0.9),
                  run_time=min(d * 0.75, max(0.5, d - 1.0)))
        term = P("chain rule", 26, C_DIM).move_to([0, -2.95, 0])
        self.beat(FadeIn(term))                                        # TERM chain rule

        lhs4 = M("P(The, cat, sat, ⟨end⟩)  =", 32).move_to(lhs3)
        f4 = M("·  P(⟨end⟩ | The, cat, sat)", 30).move_to([0, -1.9, 0])
        f4[9:21].set_color(C_B)
        self.beat(FadeIn(toks[3], shift=RIGHT * 0.2), ReplacementTransform(lhs3, lhs4), FadeIn(f4), lag=0.3,
                  rt=1.8)                                              # the end token
        note = P("no independence assumed", 24, C_DIM).next_to(term, DOWN, buff=0.2)
        self.beat(FadeIn(note))                                        # nothing assumes independence

        # each factor conditioned on everything before it: gold links from earlier tokens
        links = VGroup()
        for k in (1, 2, 3):
            for j in range(k):
                st = toks[j].get_top() + UP * 0.08 + RIGHT * 0.1 * (k - 2)
                en = toks[k].get_top() + UP * 0.08 + LEFT * 0.12 * (k - 1 - j)
                links.add(CurvedArrow(st, en, angle=-0.5 - 0.15 * (3 - (k - j)), color=C_B, stroke_width=2,
                                      tip_length=0.14))
        self.beat(Create(links), Indicate(f2[6:9], color=C_B), Indicate(f3[6:13], color=C_B),
                  Indicate(f4[9:21], color=C_B), rt=1.8)               # conditioned on everything before
        self.pause(1.0)
        self.play(FadeOut(VGroup(toks, split, lhs4, line, f4, term, note, links)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def leak(self):
        train = RoundedRectangle(width=4.2, height=3.4, corner_radius=0.2, stroke_color="#9AA3B2", stroke_width=2.5)
        test = RoundedRectangle(width=2.6, height=3.4, corner_radius=0.2, stroke_color="#9AA3B2", stroke_width=2.5)
        train.move_to([-1.75, -0.2, 0])
        test.move_to([2.55, -0.2, 0])
        tl = P("training", 26, C_DIM).next_to(train, UP, buff=0.2)
        el = P("test", 26, C_DIM).next_to(test, UP, buff=0.2).align_to(tl, DOWN)
        r = random.Random(7)
        dots_tr, dots_te = VGroup(), VGroup()
        for box_, grp, ncol, nrow in ((train, dots_tr, 7, 5), (test, dots_te, 4, 5)):
            c0 = box_.get_center()
            for a in range(ncol):
                for b in range(nrow):
                    p = c0 + np.array([(a - (ncol - 1) / 2) * 0.52 + r.uniform(-0.1, 0.1),
                                       (b - (nrow - 1) / 2) * 0.55 + r.uniform(-0.1, 0.1), 0])
                    grp.add(Dot(p, radius=0.08, color="#7A8394"))
        # near-copies: one in training, its twin in test
        pairs = [(3, 0), (11, 6), (17, 12), (26, 3), (33, 18), (22, 9)]
        twins = VGroup()
        for i, j in pairs:
            a, b = dots_tr[i], dots_te[j]
            a.set_color(WHITE)
            b.set_color(WHITE)
            twins.add(Line(a.get_center(), b.get_center(), stroke_color=WHITE, stroke_width=1.6, stroke_opacity=0.7))
        nlab = P("near-copies", 24).next_to(test, RIGHT, buff=0.3).shift(UP * 0.6)
        d = self.say()                                                 # split as if independent ...
        self.play(Create(train), Create(test), FadeIn(tl), FadeIn(el), FadeIn(dots_tr), FadeIn(dots_te),
                  run_time=min(1.4, d * 0.3))
        self.wait(max(0.1, d * 0.45 - 1.4))
        self.play(LaggedStart(*[Create(l) for l in twins], lag_ratio=0.25), FadeIn(nlab), run_time=1.6)

        # the copied coin, small: two spikes
        ax = Line([-6.4, -1.4, 0], [-4.3, -1.4, 0], stroke_color="#5B6475", stroke_width=2)
        s0 = Rectangle(width=0.3, height=2.0, stroke_color=C_MASS, stroke_width=2).set_fill(C_MASS, 0.7)
        s1 = s0.copy()
        s0.next_to([-6.0, -1.4, 0], UP, buff=0)
        s1.next_to([-4.7, -1.4, 0], UP, buff=0)
        t0 = M("0", 24, C_DIM).next_to(s0, DOWN, buff=0.3)
        t1 = M("1", 24, C_DIM).next_to(s1, DOWN, buff=0.3)
        cc = P("copied coin", 24, C_DIM).next_to(VGroup(s0, s1), UP, buff=0.25)
        spikes = VGroup(ax, s0, s1, t0, t1, cc)
        self.beat(FadeIn(spikes), Indicate(twins, color=WHITE, scale_factor=1.0), rt=1.4)   # like the copied coin
        seen = P("users already seen", 24, C_X).next_to(test, DOWN, buff=0.25)
        tw = VGroup(*[dots_te[j] for _, j in pairs])
        self.beat(FadeIn(seen), Indicate(tw, color=C_X, scale_factor=1.6), rt=1.4)   # score looks better
        self.pause(0.8)
        self.play(FadeOut(VGroup(train, test, tl, el, dots_tr, dots_te, twins, nlab, spikes, seen)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def causal(self):
        c = M("P(buy | clicked ad)", 36).move_to([0, 2.85, 0])
        c[2:5].set_color(C_A)
        c[6:16].set_color(C_B)
        ne = M("≠", 44).move_to([0, 2.05, 0])
        w = P("what happens if we show the ad?", 30).move_to([0, 1.25, 0])
        self.beat(FadeIn(c))                                           # occurs together
        self.beat(FadeIn(ne), FadeIn(w), lag=0.3)                      # not what would happen

        # forty users; some were already planning to buy (blue)
        r = random.Random(5)
        users = VGroup()
        planners = set([0, 1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 21, 30])
        for k in range(40):
            row, col_ = divmod(k, 10)
            dt = Dot([-3.6 + col_ * 0.8, -0.35 - row * 0.62, 0], radius=0.13,
                     color=C_A if k in planners else "#7A8394")
            users.add(dt)
        plan = VGroup(Dot(radius=0.13, color=C_A), P("already planning to buy", 24, C_A)).arrange(RIGHT, buff=0.15)
        plan.next_to(users, DOWN, buff=0.35).align_to(users, LEFT)
        self.beat(FadeIn(users, lag_ratio=0.02), FadeIn(plan), rt=1.6)  # may be the planners
        clicked = [0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21]
        frame = VGroup(*[SurroundingRectangle(users[k], color=C_B, buff=0.07, stroke_width=3) for k in clicked])
        clab = P("clicked", 24, C_B).next_to(users, LEFT, buff=0.25).align_to(users, UP)
        self.beat(Create(frame), FadeIn(clab))                         # the click picks out those users
        self.beat(Indicate(ne, color=C_X, scale_factor=1.3))           # not what the ad does
        exp = P("experiment: we decide who sees the ad", 24, C_DIM).next_to(plan, RIGHT, buff=0.6)
        if exp.get_right()[0] > 6.6:
            exp.shift(LEFT * (exp.get_right()[0] - 6.6))
        self.beat(FadeIn(exp))                                         # an experiment, a later chapter
        self.pause(0.8)
        self.play(FadeOut(VGroup(c, ne, w, users, plan, frame, clab, exp)), run_time=0.6)

    # ------------------------------------------------------------------------------------------------
    def best_of_twenty(self):
        lo, hi = 0.60, 0.80
        Y0, Y1 = -2.6, 2.4
        X0 = -5.9
        slot = 0.3

        def yv(v):
            return Y0 + (v - lo) / (hi - lo) * (Y1 - Y0)

        ax = Line([X0 - 0.15, Y0, 0], [X0 - 0.15, Y1 + 0.1, 0], stroke_color="#5B6475", stroke_width=2)
        fl = Line([X0 - 0.15, Y0, 0], [X0 + 20 * slot + 0.1, Y0, 0], stroke_color="#5B6475", stroke_width=2)
        ticks = VGroup()
        for v in (0.60, 0.65, 0.70, 0.75, 0.80):
            ticks.add(Line([X0 - 0.22, yv(v), 0], [X0 - 0.08, yv(v), 0], stroke_color="#5B6475", stroke_width=2))
            ticks.add(M(f"{v:.2f}", 22, C_DIM).next_to([X0 - 0.15, yv(v), 0], LEFT, buff=0.14))
        xl = P("twenty prompts", 22, C_DIM).next_to(fl, DOWN, buff=0.25)
        yl = P("score", 22, C_DIM).next_to(ax, UP, buff=0.12)
        # HIDDEN until after the pause (coordinator's override of the script): any score above 0.70.
        # Before it, the twenty slots stand at a placeholder 0.70, outlined, with no highlight.
        bars, real = VGroup(), []
        for k, s in enumerate(SCORES):
            x = X0 + (k + 0.5) * slot
            b = Rectangle(width=0.24, height=yv(0.70) - Y0, stroke_color=C_MASS, stroke_width=1.5)
            b.set_fill(C_MASS, 0.12).move_to([x, (yv(0.70) + Y0) / 2, 0])
            bars.add(b)
            t = Rectangle(width=0.24, height=yv(s) - Y0, stroke_color=C_MASS, stroke_width=1.5)
            real.append(t.set_fill(C_MASS, 0.55).move_to([x, (yv(s) + Y0) / 2, 0]))
        best = int(np.argmax(SCORES))
        frame = VGroup(ax, fl, ticks, xl, yl)
        d = self.say()                                                 # twenty prompts, report the best
        self.play(FadeIn(frame), LaggedStart(*[GrowFromEdge(b, DOWN) for b in bars], lag_ratio=0.06),
                  run_time=min(2.2, d * 0.6))

        x_end = X0 + 20 * slot + 0.1
        true_line = DashedLine([X0 - 0.15, yv(0.70), 0], [x_end, yv(0.70), 0], dash_length=0.12,
                               stroke_color=WHITE, stroke_width=2.5)
        true_lab = M("true 0.70", 26).next_to(true_line, RIGHT, buff=0.15)
        self.beat(Create(true_line), FadeIn(true_lab))                 # truly 70% accurate
        n200 = P("200 examples each", 22, C_DIM).next_to(xl, RIGHT, buff=0.35)
        self.beat(FadeIn(n200))                                        # two hundred examples each
        self.beat()                                                    # better than seventy percent?
        self.pause(3)                                                  # ⏸ predict (0.76 line hidden)

        d = self.say()                                                 # it does: the real scores
        self.play(*[Transform(b, t) for b, t in zip(bars, real)], run_time=min(1.2, max(0.6, d)))
        self.play(bars[best].animate.set_fill(C_B, 0.8).set_stroke(C_B), run_time=0.4)
        avg_line = Line([X0 - 0.15, yv(AVG_BEST), 0], [x_end, yv(AVG_BEST), 0], stroke_color=C_B, stroke_width=3.5)
        avg_lab = M("≈ 0.76", 26, C_B).next_to(avg_line, RIGHT, buff=0.15)
        screen = VGroup(P("average best of 20  ≈ 0.76", 26, C_B),
                        M("independent Binomial(200, 0.70) scores", 24, C_DIM)).arrange(DOWN, buff=0.14)
        screen.move_to([RX + 0.6, 2.75, 0])
        self.beat(Create(avg_line), FadeIn(avg_lab), FadeIn(screen))   # about seventy-six
        won = P("this one won", 22, C_B).next_to(bars[best], UP, buff=0.15)
        if won.get_top()[1] > 3.85:
            won.shift(DOWN * (won.get_top()[1] - 3.85))
        self.beat(FadeIn(won))                                         # conditioning on "this one won"
        self.beat(Indicate(screen[1], color=WHITE, scale_factor=1.06))  # depends on independence

        flat = [b.copy().stretch_to_fit_height(yv(0.70) - Y0).move_to([b.get_center()[0], (yv(0.70) + Y0) / 2, 0])
                for b in bars]
        ident = P("identical predictions:  best = 0.70", 24).move_to([RX + 0.85, 1.0, 0])
        self.beat(*[Transform(b, f) for b, f in zip(bars, flat)], FadeOut(won), FadeIn(ident), rt=1.6)  # identical

        restore = []
        for k, (b, s) in enumerate(zip(bars, SCORES)):
            t = Rectangle(width=0.24, height=yv(s) - Y0, stroke_color=C_B if k == best else C_MASS, stroke_width=1.5)
            t.set_fill(C_B if k == best else C_MASS, 0.8 if k == best else 0.55)
            t.move_to([X0 + (k + 0.5) * slot, (yv(s) + Y0) / 2, 0])
            restore.append(Transform(b, t))
        self.beat(*restore, FadeOut(ident), rt=1.4)                    # either way, the fix is the same

        b1 = VGroup(RoundedRectangle(width=1.6, height=0.8, corner_radius=0.12, stroke_color="#9AA3B2",
                                     stroke_width=2), P("choose", 24))
        b2 = VGroup(RoundedRectangle(width=2.45, height=0.8, corner_radius=0.12, stroke_color="#9AA3B2",
                                     stroke_width=2), P("measure once", 24))
        b1.move_to([2.75, 0.85, 0])
        b2.move_to([5.5, 0.85, 0])
        arr = Arrow(b1.get_right(), b2.get_left(), buff=0.1, color=C_DIM, stroke_width=3,
                    max_tip_length_to_length_ratio=0.3)
        c1 = P("one set", 22, C_DIM).next_to(b1, DOWN, buff=0.15)
        c2 = P("fresh examples", 22, C_DIM).next_to(b2, DOWN, buff=0.15)
        self.beat(FadeIn(b1), FadeIn(c1), GrowArrow(arr), FadeIn(b2), FadeIn(c2), lag=0.3, rt=2.0)  # honest fix

        ub = P("union bound", 24, C_DIM).move_to([RX + 0.85, -0.7, 0])
        u1 = M("P(A<sub>1</sub> ∪ … ∪ A<sub>20</sub>)", 30).next_to(ub, DOWN, buff=0.2)
        u2 = M("≤ P(A<sub>1</sub>) + … + P(A<sub>20</sub>)", 30).next_to(u1, DOWN, buff=0.15)
        self.beat(FadeIn(ub), FadeIn(u1), FadeIn(u2), lag=0.3, rt=1.6)  # union bound
        ak = VGroup(M("A<sub>k</sub>:", 26, C_DIM), P("prompt k looks good by luck", 22, C_DIM)).arrange(RIGHT, buff=0.15)
        ak.next_to(u2, DOWN, buff=0.3)
        self.beat(FadeIn(ak), Indicate(u2, color=WHITE, scale_factor=1.05))  # at most the sum
        self.pause(0.8)
        self.play(FadeOut(VGroup(frame, n200, bars, true_line, true_lab, avg_line, avg_lab, screen, b1, b2, arr, c1, c2,
                                 ub, u1, u2, ak)), run_time=0.7)

    # ------------------------------------------------------------------------------------------------
    def flagged(self):
        icon = RoundedRectangle(width=1.5, height=1.5, corner_radius=0.25, stroke_color=WHITE, stroke_width=3)
        icon.set_fill("#1B2130", 1)
        mlab = P("model", 26).move_to(icon)
        tag = VGroup(RoundedRectangle(width=1.35, height=0.48, corner_radius=0.08, stroke_width=0)
                     .set_fill(WHITE, 1), P("flagged", 22, "#0e1116"))
        tag[1].move_to(tag[0])
        model = VGroup(icon, mlab).move_to([0, 2.2, 0])
        tag.next_to(icon, RIGHT, buff=-0.35).shift(UP * 0.62)
        self.beat(FadeIn(model), FadeIn(tag, shift=DOWN * 0.1))       # back to the flagged model

        n95 = M("95%", 64).move_to([-3.0, 0.0, 0])
        n33 = M("33%", 64).move_to([3.0, 0.0, 0])
        l95 = P(f"<span foreground='{C_A}'>flagged</span>, <b>given</b> <span foreground='{C_B}'>contaminated</span>",
                28).next_to(n95, DOWN, buff=0.35)
        l33 = P(f"<span foreground='{C_A}'>contaminated</span>, <b>given</b> <span foreground='{C_B}'>flagged</span>",
                28).next_to(n33, DOWN, buff=0.35)
        same = P("same detector, same population", 24, C_DIM).move_to([0, -1.75, 0])
        self.beat(FadeIn(n95), FadeIn(n33), FadeIn(l95), FadeIn(l33), FadeIn(same), lag=0.15, rt=1.8)  # same
        g95 = l95[8:13]
        g33 = l33[13:18]
        self.beat(Indicate(l95[13:], color=C_B), Indicate(l33[18:], color=C_B),
                  Indicate(g95, color=WHITE), Indicate(g33, color=WHITE), rt=1.6)   # the group each conditions on
        s95 = P("share of contaminated models\nthat get flagged", 22, C_DIM).next_to(l95, DOWN, buff=0.25)
        s33 = P("share of flagged models\nthat are contaminated", 22, C_DIM).next_to(l33, DOWN, buff=0.25)
        self.beat(FadeOut(same), FadeIn(s95), Circumscribe(VGroup(n95, l95), color=C_B))   # 95%: of contaminated
        self.beat(FadeIn(s33), Circumscribe(VGroup(n33, l33), color=C_B))   # 33%: of flagged
        self.beat()                                                    # the chapter has the proofs ...
        self.pause(2)                                                  # ⏸ end
