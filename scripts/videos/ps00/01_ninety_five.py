"""Ninety-five percent sure? (docs/PS00_VIDEO_SCRIPT.md, section 1).

The hook, kept calm: a benchmark, a model, the three assumed numbers, one flagged model and the question.
No count, tree or answer appears anywhere in this section; the answer comes in section 5.
"""
from kit import *  # noqa: F401,F403

RX = 3.35            # centre x of the right-hand maths column


def benchmark_card():
    body = RoundedRectangle(width=2.0, height=2.5, corner_radius=0.15, stroke_color="#9AA3B2", stroke_width=3)
    body.set_fill("#1A2030", opacity=1)
    lines = VGroup(*[Line(LEFT * 0.65, RIGHT * (0.65 - 0.25 * (k % 2)), stroke_color="#5B6475", stroke_width=3)
                     for k in range(5)]).arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to(body).shift(DOWN * 0.1)
    name = P("benchmark", 24, C_DIM).next_to(body, DOWN, buff=0.2)
    return VGroup(body, lines, name), lines


def model_icon():
    box = RoundedRectangle(width=1.7, height=1.7, corner_radius=0.35, stroke_color=WHITE, stroke_width=3)
    box.set_fill("#1A2030", opacity=1)
    name = P("model", 26).move_to(box)
    return VGroup(box, name)


def flag_tag():
    pole = Line(DOWN * 0.42, UP * 0.42, stroke_color=WHITE, stroke_width=3)
    cloth = Polygon(pole.get_top(), pole.get_top() + RIGHT * 0.5 + DOWN * 0.14, pole.get_top() + DOWN * 0.28,
                    stroke_color=WHITE, stroke_width=2).set_fill(WHITE, opacity=1)
    lab = P("flagged", 24).next_to(pole, RIGHT, buff=0.62).align_to(pole, UP).shift(DOWN * 0.02)
    return VGroup(pole, cloth, lab)


class NinetyFive(NScene):
    PARAS = [
        ["A model is contaminated when the questions from a benchmark leaked into its training data.",
         "Its score on that benchmark then says more about what it memorised than about what it can do."],
        ["Take these numbers as assumptions for this example.",
         "Two percent of the models submitted to a benchmark are contaminated.",
         "A detector flags a contaminated model ninety-five times out of a hundred.",
         "It also flags a clean model, by mistake, four times out of a hundred."],
        ["One model gets flagged.",
         "How likely is it that it's really contaminated?"],
        ["Hold on to your number.",
         "Answering properly takes one precise idea, what the words \"given that it was flagged\" do to a "
         "probability.",
         "To build it we'll start smaller, with coins and dice, and come back to the detector as soon as the idea "
         "is ready."],
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
        card, qlines = benchmark_card()
        card.move_to([-5.7, 0.3, 0])
        model = model_icon().move_to([-3.2, 0.5, 0])

        # ---- the setting: questions leak from the benchmark into the model's training data
        leak = VGroup(*[l.copy() for l in qlines[:3]])
        self.beat(FadeIn(card), FadeIn(model), rt=1.0)                       # contaminated: questions leaked
        self.play(LaggedStart(*[l.animate.scale(0.5).move_to(model[0].get_center() + UP * (0.25 - 0.25 * k))
                                .set_opacity(0) for k, l in enumerate(leak)], lag_ratio=0.25), run_time=1.6)
        self.remove(leak)
        score = P("score", 22, C_DIM).next_to(model, UP, buff=0.25)
        self.beat(Indicate(model[0], color=C_CONT, scale_factor=1.06), FadeIn(score))   # score says memorised
        self.pause(0.6)

        # ---- the three assumed numbers
        rows = [("2%", "contaminated", C_CONT), ("95%", "of contaminated models are flagged", WHITE),
                ("4%", "of clean models are flagged", WHITE)]
        nums = VGroup()
        for v, txt, c in rows:
            nums.add(VGroup(M(v, 40, c), P(txt, 26, C_DIM)).arrange(RIGHT, buff=0.25))
        nums.arrange(DOWN, aligned_edge=LEFT, buff=0.42)
        # line up the labels in one column
        vx = max(r[0].width for r in nums)
        for r in nums:
            r[1].next_to(r[0], RIGHT, buff=0.25 + vx - r[0].width)
        nums.move_to([3.1, 0.4, 0])
        assumed = P("assumed for this example", 24, C_DIM).next_to(nums, UP, buff=0.5).align_to(nums, LEFT)
        self.beat(FadeOut(score), FadeIn(assumed))                           # assumptions for this example
        self.beat(FadeIn(nums[0], shift=RIGHT * 0.15))                       # two percent
        self.beat(FadeIn(nums[1], shift=RIGHT * 0.15))                       # ninety-five out of a hundred
        self.beat(FadeIn(nums[2], shift=RIGHT * 0.15))                       # four out of a hundred
        self.pause(0.6)

        # ---- one flagged model, and the question
        tag = flag_tag().next_to(model, DOWN, buff=0.35)
        q = T("?", 96).next_to(model, RIGHT, buff=0.45)
        self.beat(FadeIn(tag, shift=DOWN * 0.1))                             # one model gets flagged
        self.beat(FadeIn(q, scale=0.8))                                      # how likely really contaminated?
        self.pause(4)                                                        # ⏸ commit to a guess

        # ---- hold on to it: the numbers become a small reminder in the corner
        rem = detector_card(22).to_corner(UR, buff=0.35)
        self.beat(FadeOut(assumed), ReplacementTransform(nums, rem), rt=1.4)  # hold on to your number
        self.beat()                                                          # one precise idea: "given"
        self.beat()                                                          # coins and dice, then back
        self.done(1.5)
        self.clear_all()
