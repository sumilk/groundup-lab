"""YouTube thumbnail, matching LA01's: .venv/bin/manim -s --resolution 1280,720 thumbnail.py Thumbnail"""
from sample import *  # noqa: F401,F403
from sample import C_L1, C_L2

LOGO = Path(__file__).resolve().parents[3] / "public" / "favicon.svg"


class Thumbnail(Scene):
    def construct(self):
        T_ = lambda s, size, c=WHITE: Text(s, font=SANS, weight=BOLD, font_size=size, color=c)
        kicker = T_("LINEAR ALGEBRA · 2", 40, C_U)
        l1 = T_("One system,", 76)
        l2 = VGroup(T_("two", 76, C_V), T_("pictures", 76)).arrange(RIGHT, buff=0.28, aligned_edge=DOWN)
        sub = Text("elimination · rank · four subspaces", font=SANS, font_size=30, color=C_DIM)
        left = VGroup(kicker, l1, l2, sub).arrange(DOWN, buff=0.28, aligned_edge=LEFT)
        sub.shift(DOWN * 0.15)
        left.to_corner(UL, buff=0.55).shift(DOWN * 0.35)
        handle = Text("@grounduplab-ai", font=SANS, font_size=28, color=C_DIM).to_corner(DL, buff=0.5)

        bar = Line([0.95, 4, 0], [0.95, -4, 0], color=C_U, stroke_width=6)

        # the lesson's picture: two spaces, joined by A
        pin = plane((-1, 5), (-1, 6), unit=0.4).move_to([2.75, 0.55, 0])
        pout = plane((-1, 5), (-1, 6), unit=0.4).move_to([5.75, 0.55, 0])
        l_1 = Line(pin.c2p(0, -1), pin.c2p(3.5, 6), color=C_L1, stroke_width=6)
        l_2 = Line(pin.c2p(-1, 6), pin.c2p(5, 0), color=C_L2, stroke_width=6)
        sol = Dot(pin.c2p(2, 3), radius=0.11, color=WHITE)
        pts = [(0, 0), (2, 1), (4, 2), (3, 3), (2, 4), (1, 5)]
        walk = VGroup(*[vec_between(pout, pts[k], pts[k + 1], C_U if k < 2 else C_Q, width=7)
                        for k in range(5)])
        tgt = Dot(pout.c2p(1, 5), radius=0.13, color=C_W)
        arc = CurvedArrow(sol.get_center() + UP * 0.1, tgt.get_center() + LEFT * 0.18, angle=-PI / 3,
                          color=WHITE, stroke_width=5, tip_length=0.25)
        A = M("<i>A</i>", 40).move_to(arc.point_from_proportion(0.5) + UP * 0.35)

        logo = SVGMobject(str(LOGO)).set_height(0.85)
        brand = VGroup(logo, Text("GroundUp Lab", font=SANS, weight=BOLD, font_size=34, color=C_DIM))
        brand.arrange(RIGHT, buff=0.22).to_corner(DR, buff=0.45)

        self.add(bar, pin, pout, l_1, l_2, walk, sol, tgt, arc, A, left, handle, brand)
