"""Shared styling, narration timing and geometry helpers for the LA01 v3 video."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

from manim import *  # noqa: F401,F403

ROOT = Path(__file__).resolve().parent            # scene code (in the repo)
REPO = ROOT.parents[2]
OUT = REPO / "outputs" / "la01v3"                  # generated media (git-ignored)
TTS_MODELS = REPO / "outputs" / "tts"              # kokoro-v1.0.onnx, voices-v1.0.bin, esd/
AUDIO = OUT / "audio"
DURATIONS = AUDIO / "durations.json"
CUES = OUT / "cues"

VOICE = "af_heart"
SPEED = 0.95

config.background_color = "#0e1116"

SANS = "Helvetica Neue"
SERIF = "STIX Two Text"

# palette
C_U = "#58C4DD"      # first vector (blue)
C_V = "#F4C152"      # second vector (gold)
C_W = "#83C167"      # result / target (green)
C_X = "#FF8A65"      # warning / off-span (orange)
C_P = "#B39DDB"      # span / subspace fill (purple)
C_DIM = "#8A93A3"    # muted text
C_GRID = "#2A3140"


# ---------------------------------------------------------------- narration

SLOW_SPEED = 0.82   # technical beats: equations, derivations, precise statements
SLOW = "SLOW|"      # prefix a beat with this to narrate it at SLOW_SPEED


def beat_parts(beat: str) -> tuple[str, float]:
    """A beat is plain text (conversational speed) or 'SLOW|text' (technical speed)."""
    if beat.startswith(SLOW):
        return beat[len(SLOW):], SLOW_SPEED
    return beat, SPEED


def audio_key(beat: str) -> str:
    text, speed = beat_parts(beat)
    return hashlib.sha1(f"{VOICE}|{speed}|{text}".encode()).hexdigest()[:16]


def audio_file(text: str) -> Path:
    return AUDIO / f"{audio_key(text)}.wav"


def audio_duration(text: str) -> float:
    f = audio_file(text)
    if f.exists():
        import soundfile
        return soundfile.info(str(f)).duration
    return max(2.0, len(text.split()) / 2.6)


class NarrationMixin:
    """Each scene lists its narration in BEATS; call self.say() to start the next beat.

    say() first waits for the previous beat's audio to finish, then starts the new
    clip and returns its duration so animations can be sized to it. done() waits
    out the final clip.
    """

    BEATS: list[str] = []

    def _narr_init(self):
        if not hasattr(self, "_beat_i"):
            self._beat_i = 0
            self._beat_end = 0.0

    def say(self, gap: float = 0.3) -> float:
        self._narr_init()
        text = self.BEATS[self._beat_i]
        self._beat_i += 1
        remaining = self._beat_end + gap - self.time
        if remaining > 0.02:
            self.wait(remaining)
        d = audio_duration(text)
        f = audio_file(text)
        if f.exists():
            self.add_sound(str(f))
        if not hasattr(self, "_cues"):
            self._cues = []
        self._cues.append({"start": self.time, "end": self.time + d, "text": beat_parts(text)[0]})
        self._beat_end = self.time + d
        return d

    def until_end(self, pad: float = 0.0):
        """Wait until the current beat's audio has finished."""
        self._narr_init()
        remaining = self._beat_end + pad - self.time
        if remaining > 0.02:
            self.wait(remaining)

    def done(self, pad: float = 0.8):
        assert self._beat_i == len(self.BEATS), (
            f"{type(self).__name__}: used {self._beat_i} of {len(self.BEATS)} beats")
        self.until_end(pad)
        # caption cues for this scene (scene-relative seconds)
        CUES.mkdir(exist_ok=True)
        tmp = CUES / f".{type(self).__name__}.{os.getpid()}.json"
        tmp.write_text(json.dumps(getattr(self, "_cues", []), indent=1))
        os.replace(tmp, CUES / f"{type(self).__name__}.json")

    def clear_all(self, run_time=0.6):
        mobs = [m for m in self.mobjects]
        if mobs:
            self.play(*[FadeOut(m) for m in mobs], run_time=run_time)


class NScene(NarrationMixin, Scene):
    pass


class N3DScene(NarrationMixin, ThreeDScene):
    pass


# ---------------------------------------------------------------- text

def T(s: str, size: float = 30, color=WHITE, weight=NORMAL, **kw) -> Text:
    """Prose text."""
    return Text(s, font=SANS, font_size=size, color=color, weight=weight, **kw)


_MATH_GLYPHS = "∉⊄⊈∌"   # STIX Two Text draws these with a faint, broken slash (∉ reads as ∈)


def _math_glyphs(markup: str) -> str:
    for g in _MATH_GLYPHS:
        markup = markup.replace(g, f"<span font_family='STIX Two Math'>{g}</span>")
    return markup


def M(markup: str, size: float = 34, color=WHITE, **kw) -> MarkupText:
    """Math text with Pango markup: <i>v</i>, v<sub>1</sub>, x<sup>2</sup>."""
    return MarkupText(_math_glyphs(markup), font=SERIF, font_size=size, color=color, **kw)


def _sans_subs(markup: str) -> str:
    # Pango's <sub> shrinks to near-invisible dots in Helvetica Neue; use an explicit lowered span.
    return markup.replace("<sub>", "<span size='smaller' rise='-3500'>").replace("</sub>", "</span>")


def P(markup: str, size: float = 28, color=WHITE, **kw) -> MarkupText:
    """Prose with markup (bold, colour spans)."""
    return MarkupText(_sans_subs(markup), font=SANS, font_size=size, color=color, **kw)


def col(*mobs, buff=0.28, aligned=LEFT) -> VGroup:
    g = VGroup(*mobs)
    g.arrange(DOWN, buff=buff, aligned_edge=aligned)
    return g


def section_card(scene: Scene, number: str, title: str, question: str | None = None,
                 hold: float = 0.0):
    """Animated section title. Returns the small header left at the top."""
    num = T(number, 30, C_DIM)
    ttl = T(title, 54, WHITE, weight=BOLD)
    grp = col(num, ttl, buff=0.25, aligned=LEFT)
    if question:
        q = T(question, 30, C_U, slant=ITALIC)
        q.next_to(grp, DOWN, buff=0.45, aligned_edge=LEFT)
        grp.add(q)
    if grp.width > 12.6:
        grp.scale_to_fit_width(12.6)
    grp.move_to(ORIGIN)
    bar = Line(grp.get_corner(UL) + LEFT * 0.35, grp.get_corner(DL) + LEFT * 0.35,
               color=C_U, stroke_width=6)
    scene.play(GrowFromEdge(bar, UP), FadeIn(grp, shift=RIGHT * 0.3), run_time=1.0)
    if hold:
        scene.wait(hold)
    header = T(f"{number}  ·  {title}", 22, C_DIM).to_corner(UL, buff=0.35)
    if header.width > 9.5:
        header.scale_to_fit_width(9.5).to_corner(UL, buff=0.35)
    return grp, bar, header


def to_header(scene: Scene, grp, bar, header):
    scene.play(FadeOut(bar), ReplacementTransform(grp, header), run_time=0.8)
    return header


def bullet_list(items: list[str], size=28, color=WHITE, width=None, markup=True,
                bullet="•", buff=0.3) -> VGroup:
    rows = []
    for it in items:
        b = T(bullet, size, C_U)
        t = P(it, size, color) if markup else T(it, size, color)
        if width and t.width > width:
            t.scale_to_fit_width(width)
        rows.append(VGroup(b, t).arrange(RIGHT, buff=0.2, aligned_edge=UP))
    return col(*rows, buff=buff)


def boxed(mob, color=C_U, buff=0.25, fill=0.08, corner=0.12):
    r = SurroundingRectangle(mob, color=color, buff=buff, corner_radius=corner,
                             stroke_width=2)
    r.set_fill(color, opacity=fill)
    return VGroup(r, mob)


def theorem_box(title: str, body: str, color=C_U, width=11.5, size=28, title_size=26):
    head = T(title, title_size, color, weight=BOLD)
    b = P(body, size)
    if b.width > width:
        b.scale_to_fit_width(width)
    g = col(head, b, buff=0.22)
    return boxed(g, color=color, buff=0.3)


# ---------------------------------------------------------------- geometry

def plane(x_range=(-5, 5), y_range=(-4, 4), unit=0.7, faint=False, **kw) -> NumberPlane:
    p = NumberPlane(
        x_range=(x_range[0], x_range[1], 1),
        y_range=(y_range[0], y_range[1], 1),
        x_length=(x_range[1] - x_range[0]) * unit,
        y_length=(y_range[1] - y_range[0]) * unit,
        background_line_style={"stroke_color": C_GRID, "stroke_width": 1.2,
                               "stroke_opacity": 0.6 if faint else 1},
        axis_config={"stroke_color": "#5B6475", "stroke_width": 2},
        faded_line_ratio=1,
        **kw,
    )
    return p


def vec(p: NumberPlane, x, y, color=C_U, start=(0, 0), width=5, tip=0.22, **kw) -> Arrow:
    a = Arrow(p.c2p(*start), p.c2p(start[0] + x, start[1] + y), buff=0, color=color,
              stroke_width=width, max_tip_length_to_length_ratio=0.25,
              tip_length=tip, **kw)
    return a


def vec_between(p, a, b, color=C_U, width=5, **kw):
    return Arrow(p.c2p(*a), p.c2p(*b), buff=0, color=color, stroke_width=width,
                 max_tip_length_to_length_ratio=0.25, tip_length=0.22, **kw)


def label(mob_or_point, markup: str, direction=UR, size=30, color=WHITE, buff=0.12):
    l = M(markup, size, color)
    if isinstance(mob_or_point, Mobject):
        if isinstance(mob_or_point, Arrow):
            l.next_to(mob_or_point.get_end(), direction, buff=buff)
        else:
            l.next_to(mob_or_point, direction, buff=buff)
    else:
        l.next_to(mob_or_point, direction, buff=buff)
    return l


def dot(p, x, y, color=WHITE, r=0.07):
    return Dot(p.c2p(x, y), radius=r, color=color)


def dashed_vec(p, start, delta, color=C_V, **kw):
    a = DashedLine(p.c2p(*start), p.c2p(start[0] + delta[0], start[1] + delta[1]),
                   color=color, dash_length=0.12, stroke_width=4, **kw)
    a.add_tip(tip_length=0.2, tip_width=0.18)
    return a


def line_through(p, direction, color=C_P, span=20, width=3, offset=(0, 0)):
    dx, dy = direction
    return Line(p.c2p(offset[0] - span * dx, offset[1] - span * dy),
                p.c2p(offset[0] + span * dx, offset[1] + span * dy),
                color=color, stroke_width=width)


def clip_to(mob, p: NumberPlane):
    """Return the plane's bounding rectangle for use as a visual frame."""
    return Rectangle(width=p.width, height=p.height).move_to(p)


def matrix_mob(rows, size=32, color=WHITE, h_buff=0.6, v_buff=0.5, entry_colors=None):
    """A simple bracketed matrix without LaTeX."""
    ents = VGroup()
    grid = []
    for i, r in enumerate(rows):
        row = []
        for j, e in enumerate(r):
            c = color
            if entry_colors and entry_colors.get((i, j)):
                c = entry_colors[(i, j)]
            elif entry_colors and entry_colors.get(("col", j)):
                c = entry_colors[("col", j)]
            m = M(str(e), size, c)
            row.append(m)
            ents.add(m)
        grid.append(row)
    nr, nc = len(rows), len(rows[0])
    # column pitch: never let entries overlap, whatever h_buff says
    colw = [max(grid[i][j].width for i in range(nr)) for j in range(nc)]
    xs = [0.0]
    for j in range(1, nc):
        xs.append(xs[-1] + max(h_buff, (colw[j - 1] + colw[j]) / 2 + 0.35))
    for i in range(nr):
        for j in range(nc):
            grid[i][j].move_to(np.array([xs[j], -i * v_buff, 0]))
    ents.move_to(ORIGIN)
    h = ents.height + 0.3
    lb = VGroup(Line(UP * h / 2, DOWN * h / 2), Line(UP * h / 2, UP * h / 2 + RIGHT * 0.12),
                Line(DOWN * h / 2, DOWN * h / 2 + RIGHT * 0.12)).set_stroke(color, 2)
    rb = lb.copy().flip(UP)
    lb.next_to(ents, LEFT, buff=0.15)
    rb.next_to(ents, RIGHT, buff=0.15)
    g = VGroup(lb, ents, rb)
    g.entries = grid
    return g


def column_vec(entries, size=32, color=WHITE, v_buff=0.5):
    return matrix_mob([[e] for e in entries], size=size, color=color, v_buff=v_buff)
