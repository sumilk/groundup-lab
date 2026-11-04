"""YouTube thumbnail, matching LA01/LA02's: .venv/bin/manim -s --resolution 1280,720 thumbnail.py Thumbnail"""
from kit import *  # noqa: F401,F403

LOGO = Path(__file__).resolve().parents[3] / "public" / "favicon.svg"


class Thumbnail(Scene):
    def construct(self):
        T_ = lambda s, size, c=WHITE: Text(s, font=SANS, weight=BOLD, font_size=size, color=c)  # noqa: E731
        kicker = T_("PROBABILITY · 0", 40, C_U)
        l1 = VGroup(T_("95%", 92, C_CONT), T_("sure?", 92)).arrange(RIGHT, buff=0.3, aligned_edge=DOWN)
        l2 = VGroup(T_("It's", 64, C_DIM), T_("33%.", 64, C_W)).arrange(RIGHT, buff=0.25, aligned_edge=DOWN)
        sub = Text("conditioning · Bayes · expectation", font=SANS, font_size=28, color=C_DIM)
        left = VGroup(kicker, l1, l2, sub).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        left.to_corner(UL, buff=0.55).shift(DOWN * 0.3)
        handle = Text("@grounduplab-ai", font=SANS, font_size=28, color=C_DIM).to_corner(DL, buff=0.5)

        bar = Line([1.25, 4, 0], [1.25, -4, 0], color=C_U, stroke_width=6)

        # the lesson's picture: condition on "first die ≥ 4", keep 18 squares, 3 of them sum to nine
        g = DiceGrid(size=0.6, center=[4.25, 0.35, 0], axis=False)
        for c in g.sq:
            i, j = c.ij
            if i < 4:
                c.set_fill(C_OFF, opacity=0.9).set_stroke("#3A4252")
            elif i + j == 9:
                c.set_fill(C_BOTH, opacity=0.8)
            else:
                c.set_fill(C_MASS, opacity=0.35)
        frame = SurroundingRectangle(VGroup(*g.where(lambda i, j: i >= 4)), color=C_B, buff=0.03, stroke_width=5)
        marks = g.cross_marks(g.where(lambda i, j: i < 4))
        tag = Text("given", font=SANS, weight=BOLD, font_size=34, color=C_B).next_to(frame, UP, buff=0.15)

        logo = SVGMobject(str(LOGO)).set_height(0.85)
        brand = VGroup(logo, Text("GroundUp Lab", font=SANS, weight=BOLD, font_size=34, color=C_DIM))
        brand.arrange(RIGHT, buff=0.22).to_corner(DR, buff=0.45)

        self.add(bar, g, marks, frame, tag, left, handle, brand)
