"""Turning the question around (docs/PS00_VIDEO_SCRIPT.md, section 5).

The picture: a labelled frequency tree of 10,000 submissions (contaminated / clean, then flagged / not flagged)
on the left. After the prediction pause the two flagged leaves lift out into one strip on the right, drawn to
scale (190 orange beside 392 teal) under a brace for all 582 flags, while the tree keeps the population totals
in view so the change of denominator can be traced. Names then attach to the parts of the tree, Bayes' rule and
the odds form are built beside it, and the check-in morphs the same tree to a 20% base rate.
"""
from kit import *  # noqa: F401,F403

RX = 3.85            # centre x of the right-hand maths column (the tree is wider than the dice grid)
C_ROOT = "#C8CED8"
C_EDGE = "#7A8394"
C_LBL = "#C8CED8"    # branch percentages


def span(s, c):
    return f"<span foreground='{c}'>{s}</span>"


CC, FF, NC = span("C", C_CONT), span("F", C_B), span("not C", C_CLEAN)


class Node(VGroup):
    """A tree box: a word over a count."""

    def __init__(self, word, num, color, w, h=0.95, fill=0.22, word_color=None, num_color=WHITE):
        super().__init__()
        self.box = RoundedRectangle(width=w, height=h, corner_radius=0.12, stroke_color=color, stroke_width=2.5)
        self.box.set_fill(color, opacity=fill)
        self.word = P(word, 22, word_color or color)
        self.num = M(num, 28, num_color)
        VGroup(self.word, self.num).arrange(DOWN, buff=0.06).move_to(self.box)
        self.add(self.box, self.word, self.num)

    def renum(self, new, color=WHITE):
        return Transform(self.num, M(new, 28, color).move_to(self.num))


class FreqTree(VGroup):
    def __init__(self):
        super().__init__()
        self.root = Node("submissions", "10,000", C_ROOT, 2.6, fill=0.10)
        self.cont = Node("contaminated", "200", C_CONT, 2.2)
        self.clean = Node("clean", "9,800", C_CLEAN, 2.9)
        LW = 1.75
        self.cf = Node("flagged", "190", C_CONT, LW, fill=0.5, word_color=WHITE)
        self.cn = Node("not flagged", "10", C_CONT, LW, fill=0.08, word_color=C_DIM, num_color=C_DIM)
        self.kf = Node("flagged", "392", C_CLEAN, LW, fill=0.5, word_color=WHITE)
        self.kn = Node("not flagged", "9,408", C_CLEAN, LW, fill=0.08, word_color=C_DIM, num_color=C_DIM)
        self.root.move_to([-3.15, 3.25, 0])
        self.cont.move_to([-5.05, 1.05, 0])
        self.clean.move_to([-1.25, 1.05, 0])
        for n, x in ((self.cf, -5.97), (self.cn, -4.13), (self.kf, -2.17), (self.kn, -0.33)):
            n.move_to([x, -1.25, 0])
        self.e, self.p = {}, {}
        spec = [("root", "cont", "2%", UL), ("root", "clean", "98%", UR),
                ("cont", "cf", "95%", LEFT), ("cont", "cn", "5%", RIGHT),
                ("clean", "kf", "4%", LEFT), ("clean", "kn", "96%", RIGHT)]
        for a, b, lab, side in spec:
            A, B = getattr(self, a), getattr(self, b)
            ln = Line(A.box.get_bottom() + DOWN * 0.04, B.box.get_top() + UP * 0.04, stroke_color=C_EDGE,
                      stroke_width=2.5)
            t = M(lab, 26, C_LBL).next_to(ln.get_center(), side, buff=0.18)
            self.e[b], self.p[b] = ln, t
        self.add(*self.e.values(), *self.p.values(), self.root, self.cont, self.clean,
                 self.cf, self.cn, self.kf, self.kn)


def make_strip(a, b, ta, tb, total, W=5.0, H=0.75, center=(RX, 2.45, 0)):
    """The flagged models as one strip drawn to scale: contaminated (orange) beside clean (teal)."""
    c = np.array(center, dtype=float)
    wa = W * a / (a + b)
    ro = Rectangle(width=wa, height=H).set_fill(C_CONT, 0.55).set_stroke(C_CONT, 2.5)
    rt = Rectangle(width=W - wa, height=H).set_fill(C_CLEAN, 0.55).set_stroke(C_CLEAN, 2.5)
    ro.move_to(c + LEFT * (W / 2 - wa / 2))
    rt.move_to(c + RIGHT * (wa / 2))
    na, nb = M(ta, 28).move_to(ro), M(tb, 28).move_to(rt)
    la = P("contaminated", 22, C_CONT).next_to(ro, UP, buff=0.12)
    lb = P("clean", 22, C_CLEAN).next_to(rt, UP, buff=0.12)
    br = Brace(VGroup(ro, rt), DOWN, color=C_DIM, buff=0.08)
    bl = P(total, 24, WHITE).next_to(br, DOWN, buff=0.1)
    g = VGroup(ro, rt, na, nb, la, lb, br, bl)
    g.ro, g.rt, g.na, g.nb, g.la, g.lb, g.br, g.bl = ro, rt, na, nb, la, lb, br, bl
    return g


class TurningAround(NScene):
    PARAS = [
        ["Back to the detector.",
         "Picture ten thousand submissions."],
        ["Two percent are contaminated.",
         "That's two hundred.",
         "The other nine thousand eight hundred are clean."],
        ["The detector catches ninety-five percent of the two hundred, which is one hundred and ninety.",
         "It also flags four percent of the nine thousand eight hundred, which is three hundred and ninety-two."],
        ["Before adding anything up.",
         "Among the flagged models, are most of them contaminated, or most of them clean?"],
        ["Most are clean.",
         "Three hundred and ninety-two clean models against one hundred and ninety contaminated ones.",
         "That makes five hundred and eighty-two flags in all, and one hundred and ninety of them are contaminated."],
        ["About thirty-three percent."],
        ["If your guess was closer to ninety-five, it helps to find the step that took you there.",
         "Ninety-five out of a hundred contaminated models get flagged.",
         "It's tempting to turn that into ninety-five out of a hundred flags meaning contamination.",
         "But those two hundreds come from different groups.",
         "The first is a hundred contaminated models.",
         "The second is a hundred flagged models, and the flagged group is mostly clean, because there were so many "
         "more clean models to begin with.",
         "Four percent of nine thousand eight hundred is more than ninety-five percent of two hundred."],
        ["Each of these numbers has a name, and the names make the general rule easy to read.",
         "Two percent, the chance of contamination before any test, is called the prior."],
        ["Ninety-five percent, the chance of a flag if the model is contaminated, is the likelihood."],
        ["Five hundred and eighty-two out of ten thousand, the overall chance of a flag, is called the evidence.",
         "We got it by adding the flags from both kinds of model, each weighted by how common that kind is."],
        ["That adding up only works because the two branches split the submissions cleanly.",
         "Every model is contaminated or clean, never both and never neither, so every flag is counted exactly once.",
         "Cases that don't overlap and together cover everything are called a partition.",
         "Splitting over a partition and adding up like that is the law of total probability."],
        ["And one hundred and ninety out of five hundred and eighty-two, the chance of contamination once you've "
         "seen the flag, is the posterior."],
        ["Written as a formula, the tree we just walked through is Bayes' rule.",
         "The posterior is the likelihood times the prior, divided by the evidence."],
        ["Every symbol in it is a branch of the tree.",
         "If the formula ever feels slippery, draw the ten thousand."],
        ["There's a shorter way to carry the same calculation.",
         "Before the flag, the odds were two contaminated for every ninety-eight clean.",
         "A contaminated model is ninety-five over four times as likely to be flagged as a clean model.",
         "That ratio, twenty-three point seven five, is called the likelihood ratio.",
         "Multiply the odds by it.",
         "Two times twenty-three point seven five is forty-seven and a half, against ninety-eight.",
         "To turn odds back into a probability, divide the first number by the total.",
         "Forty-seven and a half out of one hundred and forty-five and a half is the same thirty-three percent."],
        ["The odds form keeps the two ingredients apart.",
         "The detector supplies the ratio.",
         "The population supplies the starting odds."],
        ["Suppose instead that a fifth of all submissions were contaminated.",
         "Same detector.",
         "Would a flag now mean ninety-five percent?"],
        ["Two thousand contaminated, and one thousand nine hundred of them flagged.",
         "Eight thousand clean, and three hundred and twenty flagged.",
         "One thousand nine hundred out of two thousand two hundred and twenty, which is about eighty-six percent.",
         "Much higher than before, though still short of ninety-five.",
         "The detector didn't change at all.",
         "Only the base rate did.",
         "That's why a test's rates on known cases, on their own, can't tell you what a positive result means."],
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
        self.build_tree()
        self.lift_out()
        self.wrong_step()
        self.names()
        self.odds()
        self.check_in()
        self.done(1.5)
        self.clear_all()

    # ------------------------------------------------------------------------------------------------
    def build_tree(self):
        t = self.t = FreqTree()
        self.beat()                                                    # back to the detector
        self.beat(FadeIn(t.root, shift=DOWN * 0.15))                   # ten thousand submissions
        self.beat(Create(t.e["cont"]), FadeIn(t.p["cont"]), FadeIn(t.cont))           # two percent contaminated
        self.beat(Indicate(t.cont.num, color=C_CONT, scale_factor=1.2))              # that's two hundred
        self.beat(Create(t.e["clean"]), FadeIn(t.p["clean"]), FadeIn(t.clean))       # 9,800 clean
        self.beat(Create(t.e["cf"]), FadeIn(t.p["cf"]), FadeIn(t.cf),
                  Create(t.e["cn"]), FadeIn(t.p["cn"]), FadeIn(t.cn), rt=1.6)        # catches 95%: 190
        self.beat(Create(t.e["kf"]), FadeIn(t.p["kf"]), FadeIn(t.kf),
                  Create(t.e["kn"]), FadeIn(t.p["kn"]), FadeIn(t.kn), rt=1.6)        # flags 4%: 392
        self.beat()                                                    # before adding anything up
        self.beat(Indicate(t.cf.box, color=WHITE, scale_factor=1.06),
                  Indicate(t.kf.box, color=WHITE, scale_factor=1.06))   # among the flagged models?
        self.pause(3)                                                  # ⏸ predict

    # ------------------------------------------------------------------------------------------------
    def lift_out(self):
        t = self.t
        s = self.s = make_strip(190, 392, "190", "392", "582 flagged")
        self.beat(TransformFromCopy(t.cf.box, s.ro), TransformFromCopy(t.kf.box, s.rt),
                  TransformFromCopy(t.cf.num, s.na), TransformFromCopy(t.kf.num, s.nb), rt=1.0)   # most are clean
        self.beat(FadeIn(s.lb), FadeIn(s.la), lag=0.5)                # 392 clean against 190 contaminated
        self.beat(GrowFromCenter(s.br), FadeIn(s.bl), Indicate(s.na, color=C_CONT, scale_factor=1.25),
                  rt=1.6)                                              # 582 in all, 190 contaminated
        fr = self.fr = M(f"{span('190', C_CONT)}/582  ≈  0.326", 34).move_to([RX, 0.75, 0])
        self.beat(FadeIn(fr, shift=UP * 0.1))                          # about thirty-three percent

    # ------------------------------------------------------------------------------------------------
    def wrong_step(self):
        t, s = self.t, self.s

        def line(words, group, tail):
            g = VGroup(P(words, 26), P(group, 26), P(tail, 26)).arrange(RIGHT, buff=0.16)
            return g
        l1 = line("95 of every 100", "contaminated", "models  →  flagged")
        l2 = line("95 of every 100", "flagged", "models  →  contaminated")
        q = P("?", 30, C_DIM)
        l2.add(q)
        q.next_to(l2[2], RIGHT, buff=0.1)
        VGroup(l1, l2).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([-0.2, -2.75, 0])
        b1 = SurroundingRectangle(l1[1], color=C_CONT, buff=0.07, corner_radius=0.08)
        b2 = SurroundingRectangle(l2[1], color=WHITE, buff=0.07, corner_radius=0.08)
        self.beat()                                                    # if your guess was closer to 95
        self.beat(FadeIn(l1[:2]), FadeIn(l1[2]), lag=0.4, rt=1.4)       # 95 of 100 contaminated get flagged
        self.beat(FadeIn(l2[:3]), FadeIn(q), lag=0.6, rt=1.6)          # tempting: 95 of 100 flags
        self.beat(Create(b1), Create(b2))                              # two hundreds, different groups
        self.beat(Indicate(VGroup(l1[1], b1), color=C_CONT, scale_factor=1.1),
                  Indicate(t.cont, color=C_CONT, scale_factor=1.08), rt=1.4)          # first: contaminated
        self.beat(Indicate(VGroup(l2[1], b2), color=WHITE, scale_factor=1.1),
                  Indicate(VGroup(s.br, s.bl), color=WHITE, scale_factor=1.08),
                  Indicate(s.rt, color=C_CLEAN, scale_factor=1.05), rt=1.6)           # second: flagged, mostly clean
        self.beat(Indicate(VGroup(t.p["kf"], t.kf), color=C_CLEAN, scale_factor=1.1),
                  Indicate(VGroup(t.p["cf"], t.cf), color=C_CONT, scale_factor=1.1), rt=1.4)  # 392 > 190
        self.pause(1.5)                                                # ⏸ let the comparison land
        self.right = VGroup(s, self.fr, l1, l2, b1, b2)

    # ------------------------------------------------------------------------------------------------
    def names(self):
        t = self.t
        self.beat(FadeOut(self.right))                                 # each of these numbers has a name
        prior = P("prior", 24, WHITE).next_to(t.p["cont"], LEFT, buff=0.2)
        self.beat(FadeIn(prior), Indicate(t.p["cont"], color=WHITE, scale_factor=1.3))        # TERM prior
        lik = P("likelihood", 24, WHITE).next_to(t.p["cf"], UP, buff=0.12)
        lik.set_x(-6.8 + lik.get_width() / 2)
        self.beat(FadeIn(lik), Indicate(t.p["cf"], color=WHITE, scale_factor=1.3))           # TERM likelihood

        # ---- evidence: both flagged leaves feed one number
        ev = M(f"evidence  {span('582', C_B)}/10,000", 28).move_to([-3.15, -2.6, 0])
        legs = VGroup(*[Line(n.box.get_bottom() + DOWN * 0.05, ev.get_top() + UP * 0.08 + RIGHT * dx,
                             stroke_color=C_B, stroke_width=2.5) for n, dx in ((t.cf, -0.6), (t.kf, 0.6))])
        rings = VGroup(*[SurroundingRectangle(n.box, color=C_B, buff=0.05, corner_radius=0.14) for n in (t.cf, t.kf)])
        self.beat(Create(rings), Create(legs), FadeIn(ev), rt=1.4)     # 582/10,000: the evidence
        key = P(f"{span('C', C_CONT)} contaminated   ·   {span('F', C_B)} flagged", 22, C_DIM)
        key.move_to([RX, 3.45, 0])
        r1 = M(f"P({FF}) = P({FF} | {CC}) P({CC})", 28)
        r2 = M(f"+ P({FF} | {NC}) P({NC})", 28)
        r3 = M("= 0.95 · 0.02 + 0.04 · 0.98", 28)
        r4 = M("= 0.0582", 28)
        blk = VGroup(r1, r2, r3, r4).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([RX, -1.3, 0])
        for r in (r2, r3, r4):
            r.shift(RIGHT * (r1[4].get_left()[0] - r[0].get_left()[0]))   # align on the first "="
        d = self.say()                                                 # adding flags, weighted
        self.play(FadeIn(key), FadeIn(r1), FadeIn(r2), run_time=min(1.2, d * 0.45))
        self.play(LaggedStart(FadeIn(r3), FadeIn(r4), lag_ratio=0.5), run_time=min(1.2, d * 0.4))
        self.pause(0.6)

        # ---- partition: the middle row covers every submission exactly once
        part = SurroundingRectangle(VGroup(t.cont.box, t.clean.box), color=C_B, buff=0.1, corner_radius=0.16)
        once = P("every submission, exactly once", 24, C_B).next_to(part, RIGHT, buff=0.3).shift(DOWN * 0.15)
        pterm = P("partition", 24, WHITE).next_to(once, UP, buff=0.15).align_to(once, LEFT)
        self.beat(Create(part), FadeIn(once))                          # split the submissions cleanly
        self.beat(Indicate(t.cont, color=C_CONT, scale_factor=1.05),
                  Indicate(t.clean, color=C_CLEAN, scale_factor=1.05), rt=1.6)   # contaminated or clean
        self.beat(FadeIn(pterm))                                       # TERM partition
        tp = P("law of total probability", 24, WHITE).next_to(blk, UP, buff=0.22).align_to(blk, LEFT)
        self.beat(FadeIn(tp))                                          # TERM law of total probability
        self.pause(0.6)

        post = M(f"posterior  {span('190', C_CONT)}/582  ≈  0.326", 28).move_to([-3.15, -3.4, 0])
        ring = SurroundingRectangle(t.cf.box, color=C_CONT, buff=0.12, corner_radius=0.16)
        self.beat(FadeIn(post), Create(ring), FadeOut(VGroup(part, once, pterm)))   # TERM posterior

        # ---- Bayes' rule (the finished total-probability working leaves first)
        b = eq(f"P({CC} | {FF})", "=", f"P({FF} | {CC})", f"P({CC})", "/", f"P({FF})", size=32)
        b.move_to([RX, 0.9, 0])
        bt = P("Bayes' rule", 24, WHITE).next_to(b, UP, buff=0.25)
        self.beat(FadeOut(VGroup(blk, tp)), FadeIn(b, lag_ratio=0.15), FadeIn(bt))   # TERM Bayes' rule
        names = VGroup(*[P(w, 22, C_DIM).next_to(b[k], DOWN, buff=0.18)
                         for k, w in ((0, "posterior"), (2, "likelihood"), (3, "prior"), (5, "evidence"))])
        self.beat(FadeIn(names, lag_ratio=0.3), rt=1.8)                # likelihood × prior / evidence
        self.pause(2)                                                  # ⏸ read the formula against the tree
        self.beat(Indicate(t.p["cf"], color=WHITE, scale_factor=1.3), Indicate(t.p["cont"], color=WHITE, scale_factor=1.3),
                  Indicate(VGroup(t.cf, t.kf), color=C_B, scale_factor=1.05), rt=1.4)   # every symbol is a branch
        self.beat(Indicate(t.root, color=WHITE, scale_factor=1.08))    # draw the ten thousand
        self.pause(0.8)
        self.named = VGroup(prior, lik, ev, legs, rings, post, ring, key, b, bt, names)

    # ------------------------------------------------------------------------------------------------
    def odds(self):
        t = self.t
        self.beat(FadeOut(self.named))                                 # a shorter way
        po_l = P("prior odds", 24, C_DIM)
        po = M(f"{span('2', C_CONT)} : {span('98', C_CLEAN)}", 34)
        row1 = VGroup(po_l, po).arrange(RIGHT, buff=0.4).move_to([RX, 3.0, 0])
        self.beat(FadeIn(row1), Indicate(t.p["cont"], color=C_CONT, scale_factor=1.3),
                  Indicate(t.p["clean"], color=C_CLEAN, scale_factor=1.3))      # 2 for every 98
        lr = eq("0.95 / 0.04", "=", "23.75", size=34).move_to([RX, 1.95, 0])
        self.beat(FadeIn(lr[0]), Indicate(t.p["cf"], color=WHITE, scale_factor=1.3),
                  Indicate(t.p["kf"], color=WHITE, scale_factor=1.3))           # 95 over 4 times as likely
        lrt = P("likelihood ratio", 24, WHITE).next_to(lr[2], DOWN, buff=0.18)
        self.beat(FadeIn(lr[1:]), FadeIn(lrt))                         # TERM likelihood ratio
        mul = M(f"{span('2', C_CONT)} · 23.75 : {span('98', C_CLEAN)}", 34)
        pso_l = P("posterior odds", 24, C_DIM)
        row3 = VGroup(pso_l, mul).arrange(RIGHT, buff=0.4).move_to([RX, 0.55, 0])
        self.beat(FadeIn(row3))                                        # multiply the odds by it
        res = M(f"{span('47.5', C_CONT)} : {span('98', C_CLEAN)}", 34).move_to(mul, aligned_edge=LEFT)
        self.beat(Transform(mul, res))                                 # 47.5 against 98
        conv = M(f"{span('47.5', C_CONT)} / ({span('47.5', C_CONT)} + {span('98', C_CLEAN)})", 34)
        conv.move_to([RX, -0.65, 0])
        self.beat(FadeIn(conv, shift=UP * 0.1))                        # divide the first number by the total
        fin = M(f"= {span('47.5', C_CONT)} / 145.5  ≈  0.326", 34).next_to(conv, DOWN, buff=0.3)
        fin.align_to(conv, LEFT)
        self.beat(FadeIn(fin, shift=UP * 0.1))                         # same thirty-three percent
        self.pause(2)                                                  # ⏸ check the conversion
        self.beat()                                                    # keeps the ingredients apart
        self.beat(Circumscribe(VGroup(lr, lrt), color=WHITE, buff=0.12),
                  Indicate(VGroup(t.p["cf"], t.p["kf"]), color=WHITE, scale_factor=1.3), rt=1.4)   # detector: ratio
        self.beat(Circumscribe(row1, color=WHITE, buff=0.12),
                  Indicate(VGroup(t.p["cont"], t.p["clean"]), color=WHITE, scale_factor=1.3), rt=1.4)  # population
        self.pause(0.8)
        self.odd = VGroup(row1, lr, lrt, row3, conv, fin)

    # ------------------------------------------------------------------------------------------------
    def check_in(self):
        t = self.t
        s = make_strip(190, 392, "190", "392", "582 flagged")
        fr = M(f"{span('190', C_CONT)}/582  ≈  0.326", 34).move_to([RX, 0.75, 0])
        box = SurroundingRectangle(t.p["cont"], color=C_B, buff=0.08)
        d = self.say()                                                 # a fifth contaminated
        self.play(FadeOut(self.odd), run_time=0.5)
        self.play(FadeIn(s), FadeIn(fr), Create(box), run_time=min(1.2, max(0.4, d - 0.7)))
        self.beat(Indicate(VGroup(t.p["cf"], t.p["cn"], t.p["kf"], t.p["kn"]), color=WHITE,
                           scale_factor=1.25))                         # same detector
        # the new base rate goes in; every count it changes becomes "?" so the tree never shows mixed numbers,
        # and the old strip is dimmed and labelled as the 2% case
        p20 = M("20%", 26, C_B).move_to(t.p["cont"]).align_to(t.p["cont"], RIGHT)
        was = P("with 2%", 22, C_DIM).move_to([RX, 3.5, 0])
        qs = [n.renum("?", C_DIM) for n in (t.cont, t.clean, t.cf, t.cn, t.kf, t.kn)]
        self.beat(Transform(t.p["cont"], p20), Transform(box, SurroundingRectangle(p20, color=C_B, buff=0.08)),
                  Transform(t.p["clean"], M("80%", 26, C_LBL).move_to(t.p["clean"]).align_to(t.p["clean"], LEFT)),
                  *qs, VGroup(s, fr).animate.set_opacity(0.25), FadeIn(was))   # would a flag mean 95%?
        self.pause(6)                                                  # ⏸ predict, or redo the tree

        self.beat(t.cont.renum("2,000"), t.cf.renum("1,900"), t.cn.renum("100", C_DIM), rt=1.0)  # 2,000; 1,900
        self.beat(t.clean.renum("8,000"), t.kf.renum("320"), t.kn.renum("7,680", C_DIM), rt=1.0)  # 8,000; 320
        s2 = make_strip(1900, 320, "1,900", "320", "2,220 flagged")
        fr2 = M(f"{span('1,900', C_CONT)}/2,220  ≈  0.86", 34).move_to([RX, 0.75, 0])
        old = M(f"with 2%   {span('190', C_CONT)}/582  ≈  0.326", 26, C_DIM).move_to([RX, -0.2, 0])
        self.beat(*[Transform(a, b) for a, b in zip(s, s2)], FadeOut(was),
                  ReplacementTransform(fr, old), FadeIn(fr2), rt=1.6)   # 1,900 / 2,220 ≈ 0.86
        self.beat(Indicate(fr2, color=WHITE, scale_factor=1.1))        # higher, still short of 95
        self.beat(Indicate(VGroup(t.p["cf"], t.p["cn"], t.p["kf"], t.p["kn"]), color=WHITE,
                           scale_factor=1.25))                         # detector didn't change
        self.beat(Circumscribe(t.p["cont"], color=C_B, buff=0.1))      # only the base rate did
        self.beat()                                                    # rates on known cases alone
