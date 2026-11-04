"""Shared pictures for the PS00 video: the dice grid (the main stage), the loaded die, the bag and a probability tree.

Conventions (docs/PS00_VIDEO_SCRIPT.md, "Cast"):
- Area is probability. Every square of the fair-dice grid has the same area because each holds 1/36.
- The first die runs across (1..6, left to right); the second die runs down (1..6, top to bottom).
- Event A is blue, the information B is gold, both is green, crossed-out squares go dark with a thin stroke.
- Conditioning = cross out, then the kept cells move together and stretch to fill the same footprint.
"""
from __future__ import annotations

from common import *  # noqa: F401,F403

FRAC = lambda a, b: f"{a}/{b}"          # noqa: E731  fractions are written a/b on screen


def frac(a, b, size=34, color=WHITE):
    return M(FRAC(a, b), size, color)


def eq(*parts, size=34, buff=0.14, colors=None):
    """A one-line equation from separate pieces (so pieces can be coloured or transformed)."""
    colors = colors or {}
    g = VGroup(*[M(p, size, colors.get(k, WHITE)) for k, p in enumerate(parts)])
    return g.arrange(RIGHT, buff=buff)


# ---------------------------------------------------------------- dice grid

class DiceGrid(VGroup):
    """36 squares. cell(i, j): first die i (column), second die j (row from the top), both 1..6."""

    def __init__(self, size=0.72, center=LEFT * 3.2 + DOWN * 0.25, axis=True, mass=True, **kw):
        super().__init__(**kw)
        self.s = size
        self.cells = {}
        self.sq = VGroup()
        for j in range(1, 7):
            for i in range(1, 7):
                r = Square(side_length=size, stroke_color="#5B6475", stroke_width=1.5)
                r.set_fill(C_MASS, opacity=0.16 if mass else 0)
                r.move_to(np.array([(i - 3.5) * size, (3.5 - j) * size, 0]))
                r.ij = (i, j)
                self.cells[(i, j)] = r
                self.sq.add(r)
        self.add(self.sq)
        self.axes = VGroup()
        if axis:
            for k in range(1, 7):
                self.axes.add(T(str(k), 20, C_DIM).move_to(np.array([(k - 3.5) * size, 3 * size + 0.28, 0])))
                self.axes.add(T(str(k), 20, C_DIM).move_to(np.array([-3 * size - 0.28, (3.5 - k) * size, 0])))
            self.ax_first = T("first die", 20, C_DIM).move_to(np.array([0, 3 * size + 0.62, 0]))
            self.ax_second = T("second die", 20, C_DIM).rotate(PI / 2).move_to(np.array([-3 * size - 0.62, 0, 0]))
            self.axes.add(self.ax_first, self.ax_second)
            self.add(self.axes)
        self.move_to(center)
        self.home = {ij: c.copy() for ij, c in self.cells.items()}

    # selection -----------------------------------------------------------------------------------
    def where(self, pred) -> list:
        """Cells whose (first, second) satisfy pred, in reading order."""
        return [self.cells[(i, j)] for j in range(1, 7) for i in range(1, 7) if pred(i, j)]

    def group(self, pred) -> VGroup:
        return VGroup(*self.where(pred))

    # styling (return animations) -----------------------------------------------------------------
    def paint(self, cells, color, opacity=0.55):
        return [c.animate.set_fill(color, opacity=opacity) for c in cells]

    def unpaint(self, cells=None, opacity=0.16):
        cells = cells if cells is not None else list(self.cells.values())
        return [c.animate.set_fill(C_MASS, opacity=opacity) for c in cells]

    def outline(self, cells, color, width=4, buff=0.0):
        """A single outline around a set of cells (union of their squares)."""
        pieces = VGroup(*[c.copy().set_fill(opacity=0).set_stroke(color, width) for c in cells])
        return pieces

    def cross_marks(self, cells):
        """Thin diagonal strokes for crossed-out squares."""
        return VGroup(*[Line(c.get_corner(UL) + (DR * 0.12), c.get_corner(DR) + (UL * 0.12),
                             stroke_color="#6B7385", stroke_width=1.6) for c in cells])

    def darken(self, cells):
        return [c.animate.set_fill(C_OFF, opacity=0.9).set_stroke("#3A4252") for c in cells]

    # conditioning --------------------------------------------------------------------------------
    def footprint(self):
        return self.sq.get_center(), 6 * self.s, 6 * self.s

    def rescale_targets(self, kept, cols=None, rows=None):
        """Target squares for the kept cells after rescaling to fill the grid's footprint.

        If the kept cells are a product of whole columns and whole rows, pass cols/rows (sorted lists): they
        stretch in place to a len(cols) x len(rows) grid. Otherwise they are laid out in one compact block.
        """
        c0, W, H = self.footprint()
        tl = c0 + LEFT * W / 2 + UP * H / 2
        targets = []
        if cols is not None and rows is not None:
            w, h = W / len(cols), H / len(rows)
            for c in kept:
                i, j = c.ij
                x, y = cols.index(i), rows.index(j)
                targets.append(Rectangle(width=w, height=h).move_to(tl + RIGHT * (x + 0.5) * w + DOWN * (y + 0.5) * h))
        else:
            n = len(kept)
            ncol = int(np.ceil(np.sqrt(n)))
            nrow = int(np.ceil(n / ncol))
            w, h = W / ncol, H / nrow
            for k, c in enumerate(kept):
                x, y = k % ncol, k // ncol
                targets.append(Rectangle(width=w, height=h).move_to(tl + RIGHT * (x + 0.5) * w + DOWN * (y + 0.5) * h))
        return targets

    def rescale(self, kept, cols=None, rows=None, mass_opacity=None):
        """Animations moving each kept cell onto its rescaled rectangle (keeps fill colour unless mass_opacity)."""
        anims = []
        for c, t in zip(kept, self.rescale_targets(kept, cols, rows)):
            tgt = t.match_style(c)
            if mass_opacity is not None and np.allclose(color_to_rgb(c.get_fill_color()), color_to_rgb(C_MASS)):
                tgt.set_fill(C_MASS, opacity=mass_opacity)
            anims.append(Transform(c, tgt))
        return anims

    def restore(self):
        """Animations returning every cell to its home square and the default mass fill."""
        anims = []
        for ij, c in self.cells.items():
            h = self.home[ij].copy()
            anims.append(Transform(c, h))
        return anims


# ---------------------------------------------------------------- loaded die

LOADED = [3, 3, 3, 3, 3, 5]              # in twentieths


class LoadedDie(VGroup):
    """Six columns whose widths are proportional to their mass (faces 1..5: 3/20, face 6: 1/4)."""

    def __init__(self, width=6.0, height=2.6, center=ORIGIN, weights=LOADED, labels=True):
        super().__init__()
        self.cols = VGroup()
        self.faces = VGroup()
        self.wlabels = VGroup()
        unit = width / sum(weights)
        x = -width / 2
        for k, wt in enumerate(weights, start=1):
            r = Rectangle(width=wt * unit, height=height, stroke_color="#5B6475", stroke_width=1.5)
            r.set_fill(C_MASS, opacity=0.28)
            r.move_to(np.array([x + wt * unit / 2, 0, 0]))
            r.face = k
            x += wt * unit
            self.cols.add(r)
            self.faces.add(T(str(k), 28).move_to(r))
            if labels:
                lab = M("1/4" if wt == 5 else f"{wt}/20", 26, C_DIM).next_to(r, DOWN, buff=0.16)
                self.wlabels.add(lab)
        self.add(self.cols, self.faces, self.wlabels)
        self.move_to(center)
        self.w, self.h, self.weights = width, height, weights

    def col(self, face):
        return self.cols[face - 1]

    def rescale(self, kept_faces):
        """Animations: kept columns slide together and stretch (in proportion to their mass) to fill the width."""
        tot = sum(self.weights[f - 1] for f in kept_faces)
        left = self.cols.get_left()[0]
        cy = self.cols.get_center()[1]
        x, anims = left, []
        for f in kept_faces:
            w = self.w * self.weights[f - 1] / tot
            r = self.col(f)
            tgt = r.copy().stretch_to_fit_width(w).move_to(np.array([x + w / 2, cy, 0]))
            anims.append(Transform(r, tgt))
            anims.append(self.faces[f - 1].animate.move_to(np.array([x + w / 2, cy, 0])))
            x += w
        return anims


# ---------------------------------------------------------------- bag and tree

def ball(color, r=0.17):
    return Circle(radius=r, stroke_color=WHITE, stroke_width=1.5).set_fill(color, opacity=1)


def bag(n_red=3, n_blue=2, center=ORIGIN):
    """A simple bag outline with balls inside. Returns (group, outline, balls)."""
    body = RoundedRectangle(width=2.0, height=1.7, corner_radius=0.45, stroke_color="#9AA3B2", stroke_width=3)
    neck = Line(LEFT * 0.55, RIGHT * 0.55, stroke_color="#9AA3B2", stroke_width=3).next_to(body, UP, buff=-0.02)
    balls = VGroup(*[ball(C_RED) for _ in range(n_red)], *[ball(C_A) for _ in range(n_blue)])
    balls.arrange_in_grid(rows=2, buff=0.12).move_to(body).shift(DOWN * 0.1)
    g = VGroup(body, neck, balls).move_to(center)
    return g, VGroup(body, neck), balls


class Tree(VGroup):
    """A left-to-right probability tree. nodes: {name: (pos, label_markup, color)}; edges: [(a, b, prob_markup)]."""

    def __init__(self, nodes: dict, edges: list, size=28):
        super().__init__()
        self.node = {}
        self.edge = {}
        self.plab = {}
        for name, (pos, lab, color) in nodes.items():
            t = M(lab, size, color) if lab else Dot(radius=0.06, color=C_DIM)
            t.move_to(pos)
            self.node[name] = t
        for a, b, p in edges:
            na, nb = self.node[a], self.node[b]
            ln = Line(na.get_right() + RIGHT * 0.08, nb.get_left() + LEFT * 0.08, stroke_color="#7A8394", stroke_width=2.5)
            self.edge[(a, b)] = ln
            if p:
                lab = M(p, size - 4, C_DIM)
                n = ln.copy().rotate(PI / 2).get_unit_vector()
                lab.move_to(ln.get_center() + (UP if ln.get_end()[1] >= ln.get_start()[1] else DOWN) * 0.0)
                lab.next_to(ln.get_center(), UP if ln.get_end()[1] >= ln.get_start()[1] else DOWN, buff=0.08)
                self.plab[(a, b)] = lab
        self.add(*self.edge.values(), *self.plab.values(), *self.node.values())


# ---------------------------------------------------------------- reminder card (the detector numbers)

def detector_card(size=24):
    rows = [("2%", "contaminated"), ("95%", "of contaminated are flagged"), ("4%", "of clean are flagged")]
    g = VGroup()
    for v, txt in rows:
        g.add(VGroup(M(v, size + 4, C_CONT if v == "2%" else WHITE), P(txt, size, C_DIM)).arrange(RIGHT, buff=0.2))
    g.arrange(DOWN, aligned_edge=LEFT, buff=0.16)
    return g
