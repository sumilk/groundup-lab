"""NN01 video: a perceptron draws a line.

A single threshold unit fires on one side of the line w·x+b=0. Shifting the bias
turns AND into OR; no line separates XOR; two lines plus an AND unit do.

Render with narration (Manim Community ≥0.18, macOS `say`, no LaTeX needed):
    python scripts/videos/narration.py scripts/videos/nn01_perceptron_line.py PerceptronLine
"""
import sys
from pathlib import Path

from manim import *

sys.path.insert(0, str(Path(__file__).parent))
from narration import NarratedScene  # noqa: E402

# Palette shared with scripts/figures/svgkit.mjs so the video matches the lesson figures.
BG, GRID, AXIS, INK = "#08111f", "#173641", "#31445e", "#e8eef7"
MUTED, TEAL, ORANGE, BLUE, PINK, DIM = "#91a4bb", "#50d2c2", "#ffb86b", "#7aa2f7", "#ff7a90", "#476073"

LO, HI = -0.5, 1.5
CORNERS = [(0, 0), (0, 1), (1, 0), (1, 1)]
AND = {(0, 0): 0, (0, 1): 0, (1, 0): 0, (1, 1): 1}
OR = {(0, 0): 0, (0, 1): 1, (1, 0): 1, (1, 1): 1}
XOR = {(0, 0): 0, (0, 1): 1, (1, 0): 1, (1, 1): 0}


def T(s, size=28, color=INK, **kw):
    return Text(s, font_size=size, color=color, **kw)


def clip(poly, a, b, c):
    """Keep the part of a convex polygon where a·x + b·y + c ≥ 0 (Sutherland–Hodgman, one edge)."""
    out = []
    for i, p in enumerate(poly):
        q = poly[(i + 1) % len(poly)]
        fp, fq = a * p[0] + b * p[1] + c, a * q[0] + b * q[1] + c
        if fp >= 0:
            out.append(p)
        if (fp >= 0) != (fq >= 0):
            t = fp / (fp - fq)
            out.append((p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])))
    return out


BOX = [(LO, LO), (HI, LO), (HI, HI), (LO, HI)]


class PerceptronLine(NarratedScene):
    NARRATION = {
        "title": "A perceptron draws a line. Let's see what that means, and why one line is not enough.",
        "unit": "A threshold unit takes two inputs, x one and x two. It multiplies each by a weight, "
                "adds a bias, and gets a single number, z.",
        "rule": "If z is zero or more, the unit fires and outputs one. Otherwise it outputs zero.",
        "boundary": "The points where z is exactly zero form a straight line. That line is the decision boundary.",
        "plane": "Here are the four Boolean inputs. Filled orange points should fire. Hollow blue points should not.",
        "and": "With weights one and one, and a bias of minus one and a half, "
               "only the corner one, one lands on the firing side. That's AND.",
        "arrow": "The weight vector points across the line, towards the side that fires.",
        "or": "Now raise the bias to minus a half. The weights don't change, so the line keeps its angle "
              "and simply slides. Three points now fire. That's OR.",
        "xor": "Now try XOR, which fires when the two inputs differ. The orange points sit on opposite corners.",
        "sweep": "Rotate the line. Slide it. Try anything. There is always at least one point on the wrong side.",
        "fail": "No single line separates XOR, so no single perceptron can compute it.",
        "or_line": "But two units can. The first is an OR unit. It draws the lower line.",
        "nand_line": "The second is a NAND unit. It draws the upper line.",
        "band": "A third unit takes the AND of the two, so it fires only in the band between the lines. Zero mistakes.",
        "moral": "One unit draws one line. A network of units combines lines, "
                 "and that is how networks compute any Boolean function.",
    }

    def construct(self):
        self.camera.background_color = BG

        # ── Title ────────────────────────────────────────────────────────────
        title = T("A perceptron draws a line", 52)
        sub = T("NN01 · §5–6", 26, MUTED).next_to(title, DOWN, buff=0.35)
        self.narrate("title")
        self.play(FadeIn(title, shift=UP * 0.2), FadeIn(sub))
        self.sync()
        self.play(FadeOut(title), FadeOut(sub))

        # ── The unit ─────────────────────────────────────────────────────────
        unit = self.unit_diagram()
        rule = VGroup(
            T("z = w₁x₁ + w₂x₂ + b", 30),
            T("y = 1  if  z ≥ 0,   else 0", 30),
        ).arrange(DOWN, buff=0.25).next_to(unit, DOWN, buff=0.6)
        self.narrate("unit")
        self.play(LaggedStart(*[Create(m) for m in unit], lag_ratio=0.08), run_time=3)
        self.play(Write(rule[0]), run_time=1.2)
        self.narrate("rule")
        self.play(Write(rule[1]), run_time=1.2)
        boundary = T("Where z = 0 is a straight line: the decision boundary", 28, TEAL).next_to(rule, DOWN, buff=0.45)
        self.narrate("boundary")
        self.play(FadeIn(boundary))
        self.sync()
        self.play(FadeOut(VGroup(unit, rule, boundary)))

        # ── The plane ────────────────────────────────────────────────────────
        ax = Axes(
            x_range=[LO, HI, 0.5], y_range=[LO, HI, 0.5], x_length=6.2, y_length=6.2,
            axis_config={"color": AXIS, "include_ticks": False},
        ).to_edge(RIGHT, buff=0.7)
        grid = VGroup(*[Line(ax.c2p(v, LO), ax.c2p(v, HI), color=GRID, stroke_width=1.5) for v in (1,)],
                      *[Line(ax.c2p(LO, v), ax.c2p(HI, v), color=GRID, stroke_width=1.5) for v in (1,)])
        xl = T("x₁", 26, MUTED).next_to(ax.c2p(HI, 0), DOWN, buff=0.15)
        yl = T("x₂", 26, MUTED).next_to(ax.c2p(0, HI), LEFT, buff=0.15)

        w1, w2, b = ValueTracker(1), ValueTracker(1), ValueTracker(-1.5)
        self.targets = dict(AND)

        def region():
            pts = clip(BOX, w1.get_value(), w2.get_value(), b.get_value())
            if len(pts) < 3:
                return VMobject()
            return Polygon(*[ax.c2p(*p) for p in pts], stroke_width=0, fill_color=TEAL, fill_opacity=0.16)

        def line():
            pts = clip(clip(BOX, w1.get_value(), w2.get_value(), b.get_value() + 1e-3),
                       -w1.get_value(), -w2.get_value(), -b.get_value() + 1e-3)
            if len(pts) < 2:
                return VMobject()
            # The strip between the two clips is the boundary; take its two farthest points.
            pts.sort(key=lambda p: (p[0], p[1]) if abs(w2.get_value()) > abs(w1.get_value()) else (p[1], p[0]))
            return Line(ax.c2p(*pts[0]), ax.c2p(*pts[-1]), color=TEAL, stroke_width=4)

        def normal():
            a, c, d = w1.get_value(), w2.get_value(), b.get_value()
            n2 = a * a + c * c
            # Foot of the perpendicular from the square's centre onto the line.
            k = -(a * 0.5 + c * 0.5 + d) / n2
            foot = np.array([0.5 + k * a, 0.5 + k * c])
            tip = foot + 0.35 * np.array([a, c]) / np.sqrt(n2)
            return Arrow(ax.c2p(*foot), ax.c2p(*tip), buff=0, color=ORANGE, stroke_width=5,
                         max_tip_length_to_length_ratio=0.3)

        def fires(p):
            return w1.get_value() * p[0] + w2.get_value() * p[1] + b.get_value() >= 0

        def dots():
            g = VGroup()
            for p in CORNERS:
                on = self.targets[p] == 1
                g.add(Dot(ax.c2p(*p), radius=0.13, color=ORANGE if on else BLUE,
                          fill_opacity=1 if on else 0, stroke_width=4))
                if fires(p) != on:
                    g.add(Circle(radius=0.26, color=PINK, stroke_width=4).move_to(ax.c2p(*p)))
            return g

        def mistakes():
            n = sum(fires(p) != (self.targets[p] == 1) for p in CORNERS)
            return T(f"wrong: {n}", 30, PINK if n else TEAL)

        reg, ln, arr, pts = (always_redraw(f) for f in (region, line, normal, dots))
        readout = always_redraw(lambda: T(
            f"w = ({w1.get_value():.1f}, {w2.get_value():.1f})    b = {b.get_value():.1f}".replace("-", "−"),
            28, INK).to_corner(UL, buff=0.7).shift(DOWN * 1.1))
        wrong = always_redraw(lambda: mistakes().next_to(readout, DOWN, aligned_edge=LEFT, buff=0.3))

        legend = VGroup(
            VGroup(Dot(radius=0.1, color=ORANGE), T("target 1", 22, MUTED)).arrange(RIGHT, buff=0.15),
            VGroup(Dot(radius=0.1, color=BLUE, fill_opacity=0, stroke_width=3), T("target 0", 22, MUTED)).arrange(RIGHT, buff=0.15),
            VGroup(Square(0.22, stroke_width=0, fill_color=TEAL, fill_opacity=0.35), T("unit fires", 22, MUTED)).arrange(RIGHT, buff=0.15),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.18).to_corner(DL, buff=0.7)

        heading = T("AND", 44, ORANGE).to_corner(UL, buff=0.7)
        self.narrate("plane")
        self.play(Create(ax), FadeIn(grid), FadeIn(xl), FadeIn(yl))
        self.play(FadeIn(pts), FadeIn(legend))
        self.narrate("and")
        self.play(FadeIn(reg), Create(ln), FadeIn(heading), FadeIn(readout), FadeIn(wrong))
        self.narrate("arrow")
        self.play(GrowArrow(arr))
        note = T("w points to the side that fires", 24, ORANGE).next_to(wrong, DOWN, aligned_edge=LEFT, buff=0.5)
        self.play(FadeIn(note))
        self.sync()

        # AND → OR by sliding the bias.
        self.narrate("or")
        self.play(FadeOut(note))
        note = T("Raise the bias: the line slides, the weights stay", 24, MUTED).next_to(wrong, DOWN, aligned_edge=LEFT, buff=0.5)
        self.play(FadeIn(note))
        self.targets = dict(OR)
        pts.update()
        self.play(Transform(heading, T("OR", 44, ORANGE).move_to(heading, aligned_edge=LEFT)))
        self.play(b.animate.set_value(-0.5), run_time=2.5)
        self.sync()

        # XOR: no line works.
        self.narrate("xor")
        self.play(FadeOut(note))
        self.targets = dict(XOR)
        self.play(Transform(heading, T("XOR", 44, PINK).move_to(heading, aligned_edge=LEFT)))
        note = T("Try every line…", 24, MUTED).next_to(wrong, DOWN, aligned_edge=LEFT, buff=0.5)
        self.play(FadeIn(note))
        self.narrate("sweep")
        phi = ValueTracker(PI / 4)
        offset = ValueTracker(-0.5)

        def follow(_):
            w1.set_value(np.cos(phi.get_value()) * 1.4)
            w2.set_value(np.sin(phi.get_value()) * 1.4)
            b.set_value(offset.get_value() * 1.4)

        driver = Mobject().add_updater(follow)
        self.add(driver)
        for target_phi, target_off in [(PI / 4, -1.2), (3 * PI / 4, 0.2), (5 * PI / 4, 1.0),
                                       (7 * PI / 4, -0.1), (2 * PI + PI / 4, -0.7)]:
            self.play(phi.animate.set_value(target_phi), offset.animate.set_value(target_off), run_time=1.6)
        driver.clear_updaters()
        self.remove(driver)
        self.narrate("fail")
        self.play(Transform(note, T("…every line gets at least one point wrong", 24, PINK).move_to(note, aligned_edge=LEFT)))
        self.sync()

        # Two lines + AND solve XOR.
        self.play(FadeOut(VGroup(reg, ln, arr, readout, wrong, note)))
        self.remove(reg, ln, arr, readout, wrong)
        self.targets = dict(XOR)

        def half_line(a, c, d, color):
            p = clip(clip(BOX, a, c, d + 1e-3), -a, -c, -d + 1e-3)
            p.sort()
            return Line(ax.c2p(*p[0]), ax.c2p(*p[-1]), color=color, stroke_width=4)

        l1 = half_line(1, 1, -0.5, TEAL)        # h₁ = OR:   x₁ + x₂ − 0.5 ≥ 0
        l2 = half_line(-1, -1, 1.5, ORANGE)     # h₂ = NAND: −x₁ − x₂ + 1.5 ≥ 0
        band = Polygon(*[ax.c2p(*p) for p in clip(clip(BOX, 1, 1, -0.5), -1, -1, 1.5)],
                       stroke_width=0, fill_color=TEAL, fill_opacity=0.2)
        # Point markers drawn statically now: the band fires exactly on the XOR targets.
        final_pts = VGroup(*[Dot(ax.c2p(*p), radius=0.13, color=ORANGE if XOR[p] else BLUE,
                                 fill_opacity=1 if XOR[p] else 0, stroke_width=4) for p in CORNERS])
        self.remove(pts)
        self.add(final_pts)

        recipe = VGroup(
            T("h₁ = OR(x₁, x₂)", 28, TEAL),
            T("h₂ = NAND(x₁, x₂)", 28, ORANGE),
            T("y = AND(h₁, h₂)", 28, INK),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.3).to_corner(UL, buff=0.7).shift(DOWN * 1.1)
        self.play(Transform(heading, T("XOR with two lines", 44, TEAL).move_to(heading, aligned_edge=LEFT)))
        self.narrate("or_line")
        self.play(Create(l1), FadeIn(recipe[0]))
        self.narrate("nand_line")
        self.play(Create(l2), FadeIn(recipe[1]))
        self.narrate("band")
        self.play(FadeIn(band), FadeIn(recipe[2]))
        ok = T("wrong: 0", 30, TEAL).next_to(recipe, DOWN, aligned_edge=LEFT, buff=0.4)
        self.play(FadeIn(ok))

        moral = Paragraph("One unit draws one line.", "A network combines lines.", font_size=26, color=INK, line_spacing=0.9).next_to(ok, DOWN, aligned_edge=LEFT, buff=0.6)
        self.narrate("moral")
        self.play(FadeIn(moral))
        self.sync()
        self.wait(0.8)
        self.play(*[FadeOut(m) for m in self.mobjects])

    def unit_diagram(self):
        """x₁, x₂ and a constant 1 feed Σ through w₁, w₂, b; Σ feeds the step θ; θ outputs y."""
        def node(label, color, r=0.42):
            c = Circle(radius=r, color=color, stroke_width=3)
            return VGroup(c, T(label, 28, color).move_to(c))

        x1, x2, one = node("x₁", INK), node("x₂", INK), node("1", MUTED)
        ins = VGroup(x1, x2, one).arrange(DOWN, buff=0.55).shift(LEFT * 4)
        s = node("Σ", TEAL, 0.55)
        th = VGroup(Square(1.0, color=ORANGE, stroke_width=3))
        th.add(VMobject(color=ORANGE, stroke_width=4).set_points_as_corners(
            [th[0].get_center() + v for v in (LEFT * 0.35 + DOWN * 0.25, DOWN * 0.25, UP * 0.25, RIGHT * 0.35 + UP * 0.25)]))
        th.next_to(s, RIGHT, buff=1.4)
        y = node("y", ORANGE).next_to(th, RIGHT, buff=1.4)
        edges = VGroup()
        for n, lab in [(x1, "w₁"), (x2, "w₂"), (one, "b")]:
            a = Arrow(n.get_right(), s.get_left(), buff=0.08, color=DIM, stroke_width=3)
            edges.add(a, T(lab, 24, MUTED).move_to(a.point_from_proportion(0.45) + UP * 0.28))
        edges.add(Arrow(s.get_right(), th.get_left(), buff=0.08, color=DIM, stroke_width=3),
                  T("z", 24, MUTED).next_to(VGroup(s, th), UP, buff=0.05).shift(LEFT * 0.0).move_to(
                      (s.get_right() + th.get_left()) / 2 + UP * 0.3),
                  Arrow(th.get_right(), y.get_left(), buff=0.08, color=DIM, stroke_width=3))
        return VGroup(ins, edges, s, th, y).move_to(UP * 0.8)
