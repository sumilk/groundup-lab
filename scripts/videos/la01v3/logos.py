"""Logo concepts for GroundUp Lab.  manim -s --resolution 800,800 logos.py LogoA (… LogoD)"""
from common import *

BG = "#0e1116"
INK = "#E9EDF2"


class _Square(Scene):
    def setup(self):
        self.camera.frame_width = self.camera.frame_height = 8
        self.camera.background_color = BG


def gu_mark():
    g = Text("G", font=SANS, weight=BOLD, font_size=300, color=INK)
    u = Text("U", font=SANS, weight=BOLD, font_size=300, color=C_U)
    gu = VGroup(g, u).arrange(RIGHT, buff=0.06)
    # the U's right stem (Helvetica Neue Bold: stem ≈ 0.25 of the glyph width)
    right = u.get_right()[0]
    stem_w = 0.25 * u.width
    stem_x = right - stem_w / 2
    top = u.get_top()[1]
    rise = 1.0
    shaft = Rectangle(width=stem_w, height=rise, stroke_width=0, fill_color=C_U, fill_opacity=1)
    shaft.move_to([stem_x, top + rise / 2 - 0.06, 0])
    head = Triangle(stroke_width=0, fill_color=C_U, fill_opacity=1)
    head.stretch_to_fit_width(stem_w * 2.3).stretch_to_fit_height(stem_w * 1.7)
    head.move_to([stem_x, shaft.get_top()[1] + head.height / 2 - 0.01, 0])
    # a filled bar (not a stroked line) so it scales with the mark
    gh = 0.075 * gu.height
    ground = RoundedRectangle(width=gu.width + 0.3, height=gh, corner_radius=gh / 2, stroke_width=0,
                              fill_color=C_V, fill_opacity=1)
    ground.next_to(gu, DOWN, buff=0.22 * gh / 0.2)
    return VGroup(gu, shaft, head, ground)


class LogoA(_Square):
    """Monogram: G and U on a ground line; the U's right stem rises into an arrow."""
    def construct(self):
        m = gu_mark()
        m.scale_to_fit_width(5.6).move_to(ORIGIN)
        self.add(m)


class LogoB(_Square):
    """Rising blocks from a ground line: built up, layer by layer."""
    def construct(self):
        cols = [C_U, C_U, C_W, C_V]
        blocks = VGroup()
        for i, h in enumerate([1, 2, 3, 4]):
            stack = VGroup(*[RoundedRectangle(width=0.95, height=0.72, corner_radius=0.12, stroke_width=0,
                                              fill_color=cols[i], fill_opacity=1)
                             for _ in range(h)]).arrange(UP, buff=0.12)
            blocks.add(stack)
        blocks.arrange(RIGHT, buff=0.18, aligned_edge=DOWN)
        ground = Line(blocks.get_corner(DL) + DOWN * 0.22 + LEFT * 0.3, blocks.get_corner(DR) + DOWN * 0.22 + RIGHT * 0.3,
                      color=INK, stroke_width=20)
        self.add(VGroup(blocks, ground).move_to(ORIGIN))


class LogoC(_Square):
    """Lab flask whose liquid is a rising bar chart / upward arrow."""
    def construct(self):
        pts = [[-0.55, 2.4, 0], [0.55, 2.4, 0], [0.55, 0.9, 0], [2.1, -1.9, 0], [-2.1, -1.9, 0], [-0.55, 0.9, 0]]
        flask = Polygon(*pts, color=INK, stroke_width=22, joint_type=LineJointType.ROUND)
        lip = Line([-0.85, 2.4, 0], [0.85, 2.4, 0], color=INK, stroke_width=22)
        bars = VGroup()
        for i, (x, h, c) in enumerate([(-1.2, 0.6, C_U), (-0.4, 1.2, C_W), (0.4, 1.8, C_V)]):
            bars.add(RoundedRectangle(width=0.62, height=h, corner_radius=0.1, stroke_width=0, fill_color=c,
                                      fill_opacity=1).move_to([x, -1.62 + h / 2, 0]))
        arrow = Arrow([-1.5, -1.2, 0], [1.25, 0.65, 0], buff=0, color=INK, stroke_width=18, tip_length=0.45,
                      max_tip_length_to_length_ratio=0.3, max_stroke_width_to_length_ratio=30)
        self.add(VGroup(flask, lip, bars, arrow).scale(1.08).move_to(ORIGIN))


class LogoD(_Square):
    """A sprouting network: nodes grow upward from a ground line (ML from the ground up)."""
    def construct(self):
        ground = Line([-2.6, -2.2, 0], [2.6, -2.2, 0], color=INK, stroke_width=20)
        layers = [[(0, -2.2)], [(-1.1, -0.6), (1.1, -0.6)], [(-1.9, 1.0), (0, 1.0), (1.9, 1.0)], [(0, 2.5)]]
        edges = VGroup()
        for a, b in zip(layers[:-1], layers[1:]):
            for p in a:
                for q in b:
                    edges.add(Line([*p, 0], [*q, 0], color=C_DIM, stroke_width=9))
        cols = [INK, C_U, C_W, C_V]
        nodes = VGroup(*[Dot([*p, 0], radius=0.36 if i else 0.28, color=cols[i]) for i, l in enumerate(layers) for p in l])
        self.add(VGroup(ground, edges, nodes).move_to(ORIGIN))


class Watermark(Scene):
    """Transparent mark for YouTube's video watermark (render with -t)."""
    def setup(self):
        self.camera.frame_width = self.camera.frame_height = 8

    def construct(self):
        self.add(gu_mark().scale_to_fit_width(7.2).move_to(ORIGIN))
