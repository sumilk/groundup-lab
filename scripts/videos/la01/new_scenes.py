"""New vector-native opening, bridges, and ending for LA01.

No stock imagery, slides of paragraphs, or LaTeX dependency. Signed controls,
routes, reachable regions and basis grids are animated mathematical objects.
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from manim import *
import numpy as np

config.background_color = '#0e1116'
BLUE, GOLD, GREEN, PURPLE = '#58C4DD', '#F4C152', '#83C167', '#B39DDB'
MUTED, ORANGE, GRID = '#8A93A3', '#FF8A65', '#2A3140'
OUT = Path(os.environ.get('LA01_OUTPUT', '.'))


def txt(text, size=28, color=WHITE, width=None):
    m = Text(text, font='Helvetica Neue', font_size=size, color=color)
    if width and m.width > width:
        m.scale_to_fit_width(width)
    return m


def math(text, size=31, color=WHITE, width=5):
    m = Text(text, font='STIX Two Text', font_size=size, color=color)
    if m.width > width:
        m.scale_to_fit_width(width)
    return m


class FreshReel(Scene):
    def arrow(self, xy, color, start=(0, 0)):
        return Arrow(self.p.c2p(*start), self.p.c2p(start[0]+xy[0], start[1]+xy[1]), color=color, buff=0, stroke_width=6, max_tip_length_to_length_ratio=.23)

    def note(self, heading, formula='', detail=''):
        rows = [txt(heading, 32, GREEN, 4.7)]
        if formula:
            rows.append(math(formula, 35, width=4.7))
        if detail:
            rows.append(txt(detail, 25, MUTED, 4.7))
        group = VGroup(*rows).arrange(DOWN, buff=.45).move_to([3.9, .9, 0])
        self.play(FadeIn(group, shift=UP*.12), run_time=.6)
        return group

    def setup_world(self, title):
        self.p = NumberPlane(x_range=[-4, 6, 1], y_range=[-3, 6, 1], x_length=6.5, y_length=5.85, background_line_style={'stroke_color':GRID,'stroke_opacity':.65,'stroke_width':1}, axis_config={'stroke_color':'#5B6475','stroke_width':2}).move_to([-2.65, -.15, 0])
        self.add(self.p)
        self.add(txt(title, 22, MUTED, 12).to_corner(UL, buff=.35))
        origin = Dot(self.p.c2p(0,0), radius=.045, color=MUTED)
        self.add(origin, txt('home', 19, MUTED).next_to(origin, DL, buff=.1))
        self.u = self.arrow((2,1), BLUE)
        self.v = self.arrow((1,2), GOLD)
        self.target = Dot(self.p.c2p(4,5), radius=.095, color=GREEN)
        self.target_label = math('(4, 5)', 25, GREEN).next_to(self.target, RIGHT, buff=.12)
        self.craft = Triangle(color=WHITE, fill_opacity=1, stroke_width=1).scale(.09).rotate(-PI/2).move_to(self.p.c2p(0,0))

    def controls(self, first=1, second=2):
        self.a, self.b = ValueTracker(first), ValueTracker(second)
        rows = VGroup()
        for name, tracker, color in [('blue',self.a,BLUE),('gold',self.b,GOLD)]:
            label = txt(name, 26, color)
            line = Line(LEFT*1.6, RIGHT*1.6, color=GRID, stroke_width=6)
            tick = Line(UP*.12, DOWN*.12, color=MUTED)
            knob = Dot([float(np.clip(tracker.get_value(),-3,3))/3*1.6,0,0], .09, color=color)
            row = VGroup(label, VGroup(line,tick,knob)).arrange(DOWN, buff=.24)
            knob.add_updater(lambda mob, tr=tracker, rail=line: mob.move_to(rail.get_center()+RIGHT*float(np.clip(tr.get_value(),-3,3))/3*1.6))
            rows.add(row)
        rows.arrange(DOWN, buff=.55).move_to([3.9,-1.9,0])
        self.add(rows)
        for row, tracker, color in zip(rows,[self.a,self.b],[BLUE,GOLD]):
            name = row[0]
            number = always_redraw(lambda tr=tracker,c=color,n=name: txt(f'{tr.get_value():.1f}',26,c).next_to(n,RIGHT,buff=.3))
            self.add(number)
        return rows

    def base(self, parallel=False, target=True, craft=False):
        self.add(self.u)
        if parallel:
            self.v = self.arrow((4,2), GOLD)
        self.add(self.v)
        self.ul = math('u',26,BLUE).next_to(self.u.get_end(),DOWN,buff=.1)
        self.vl = math('v',26,GOLD).next_to(self.v.get_end(),UP,buff=.1)
        self.ul.add_updater(lambda m:m.next_to(self.u.get_end(),DOWN,buff=.1))
        self.vl.add_updater(lambda m:m.next_to(self.v.get_end(),UP,buff=.1))
        self.add(self.ul,self.vl)
        if target:
            self.add(self.target, self.target_label)
        if craft:
            self.add(self.craft)

    def route(self, a, b, run_time=3):
        mid = np.array([2*a,a])
        end = mid + b*np.array([1,2])
        path = VGroup(Line(self.p.c2p(0,0),self.p.c2p(*mid),color=BLUE,stroke_width=3),Line(self.p.c2p(*mid),self.p.c2p(*end),color=GOLD,stroke_width=3))
        self.add(self.craft)
        self.craft.move_to(self.p.c2p(0,0))
        for name in ('a','b'):
            if hasattr(self,name):getattr(self,name).set_value(0)
        extra=[self.a.animate.set_value(a)] if hasattr(self,'a') else []
        self.play(Create(path[0]),self.craft.animate.move_to(self.p.c2p(*mid)),*extra,run_time=run_time*.4,rate_func=linear)
        extra=[self.b.animate.set_value(b)] if hasattr(self,'b') else []
        self.play(Create(path[1]),self.craft.animate.move_to(self.p.c2p(*end)),*extra,run_time=run_time*.6,rate_func=linear)
        return path

    def region(self):
        corners = [self.p.c2p(-4,-3),self.p.c2p(6,-3),self.p.c2p(6,6),self.p.c2p(-4,6)]
        return Polygon(*corners,stroke_width=0,fill_color=PURPLE,fill_opacity=.14)

    def draw_action(self, action, d):
        if action in ('parallel','try_blue','try_gold','unreachable'):
            self.base(parallel=True, craft=True)
            rail = Line(self.p.c2p(-4,-2),self.p.c2p(6,3), color=PURPLE,stroke_width=3)
            self.add(rail)
            self.note('Can you get there?', 'v = 2u', 'Two controls · one line')
            self.controls(0,0)
            if action == 'parallel':
                self.play(Flash(self.target,color=GREEN),run_time=1.2)
            elif action == 'try_blue':
                for point in [(4,2),(-2,-1),(0,0)]:
                    self.play(self.craft.animate.move_to(self.p.c2p(*point)),self.a.animate.set_value(point[0]/2),run_time=min(3,d/5))
            elif action == 'try_gold':
                trail = TracedPath(self.craft.get_center,stroke_color=WHITE,stroke_width=2)
                self.add(trail)
                for point in [(2,1),(6,3),(-3,-1.5),(0,0)]:
                    self.play(self.craft.animate.move_to(self.p.c2p(*point)),self.b.animate.set_value(point[0]/4),run_time=min(2,d/6))
                trail.clear_updaters()
            else:
                drop = DashedLine(self.target.get_center(), self.p.c2p(4,2), color=ORANGE)
                self.play(Create(drop), Indicate(rail,color=ORANGE),run_time=2)
        elif action == 'turn':
            self.base(parallel=True,craft=True)
            self.note('What changes?', 'v: (4, 2) → (1, 2)', 'Predict a route before we try')
            self.play(Transform(self.v,self.arrow((1,2),GOLD)),run_time=3)
        elif action in ('reach','controls','operations'):
            self.base(craft=True)
            self.note('One destination', 'u + 2v = (4, 5)', 'Scale moves · add them tip to tail')
            self.controls()
            self.route(1,2,run_time=min(7,d*.45))
            self.play(Flash(self.target,color=GREEN),run_time=1)
        elif action == 'fill':
            self.base(craft=True)
            self.note('All reachable destinations', 'au + bv', 'a, b can be any real numbers')
            rng = np.random.default_rng(12)
            points = VGroup(*[Dot(self.p.c2p(x,y),radius=.035,color=PURPLE) for x,y in rng.uniform([-4,-3],[6,6],(130,2))])
            self.play(LaggedStart(*[FadeIn(x) for x in points],lag_ratio=.01),run_time=4)
            self.play(FadeIn(self.region()),run_time=2)
        elif action in ('third','third_hold','zero','zero_family'):
            self.base(target=action not in ('zero','zero_family'))
            w = self.arrow((3,3),PURPLE)
            self.play(GrowArrow(w),run_time=1)
            self.add(math('w = u + v',25,PURPLE).next_to(w.get_end(),UP,buff=.15))
            if action.startswith('third'):
                self.note('A third direction', 'w = u + v', 'Does it open any new territory?')
                self.route(1,1,run_time=min(5,d*.4))
            else:
                self.note('Different recipes · same point', 'u + v − w = 0', 'Subtract the two representations')
                loop = VMobject().set_points_as_corners([self.p.c2p(0,0),self.p.c2p(2,1),self.p.c2p(3,3),self.p.c2p(0,0)]).set_stroke(WHITE,3)
                self.play(Create(loop),run_time=min(6,d*.4))
                if action == 'zero_family':
                    equation = math('(1−t)u + (2−t)v + tw',28,width=4.8).move_to([3.9,-1.6,0])
                    self.play(Write(equation),run_time=2)
                    self.add(txt('always reaches (4, 5)',24,GREEN,4.8).next_to(equation,DOWN,buff=.3))
        elif action == 'basis':
            self.base()
            self.note('Same place · different address', '(4, 5) = u + 2v', 'The grid gives numbers their meaning')
            grid = VGroup()
            for i in range(-3,4):
                grid.add(Line(self.p.c2p(2*i-3,i-6),self.p.c2p(2*i+3,i+6),color=PURPLE,stroke_opacity=.4))
            # Clip grid lines to the diagram panel: use bounded segments.
            grid = VGroup(*[Line(self.p.c2p(-3,y),self.p.c2p(5,y+4),color=PURPLE,stroke_opacity=.35) for y in [-3,-1,1]])
            self.play(Create(grid),run_time=2)
            self.route(1,2,min(6,d*.35))
        elif action in ('dimension','rank'):
            self.base()
            self.play(FadeIn(self.region()),run_time=1)
            self.note('Count independent directions', 'many columns ≠ many dimensions', 'A new setting can repeat an old move')
            arrows = VGroup(*[self.arrow(x,PURPLE) for x in [(3,3),(-1,1),(4,0)]])
            self.play(LaggedStart(*[GrowArrow(x) for x in arrows],lag_ratio=.35),run_time=3)
        elif action in ('subspace','sum'):
            self.note('Do combinations stay inside?' if action=='subspace' else 'Use both sets of moves', 'u + w ∈ U + Y', 'Closure connects the pictures')
            a = Line(self.p.c2p(-3,-1.5),self.p.c2p(6,3),color=BLUE,stroke_width=4)
            b = Line(self.p.c2p(-1.5,-3),self.p.c2p(3,6),color=GOLD,stroke_width=4)
            self.play(Create(a),Create(b),run_time=2)
            self.base()
            self.route(1,2,min(6,d*.4))
            if action=='sum':
                self.play(FadeIn(self.region()),run_time=2)
        elif action=='functions':
            self.remove(self.p)
            axes = Axes(x_range=[-3,3,1],y_range=[-2,4,1],x_length=6.5,y_length=4.5,axis_config={'include_tip':False,'color':MUTED}).move_to([-2.65,0,0])
            f = axes.plot(lambda x:.5*x,color=BLUE)
            g = axes.plot(lambda x:.15*x*x,color=GOLD)
            fg = axes.plot(lambda x:.5*x+.15*x*x,color=GREEN)
            self.add(axes)
            self.note('The same rules, new objects', '(f + g)(x) = f(x) + g(x)', 'Add heights · scale heights')
            self.play(Create(f),Create(g),run_time=2)
            self.play(Create(fg),run_time=3)
        elif action=='affine':
            self.note('Move home · keep the directions', 'x₀ + S', 'Differences cancel the anchor')
            line = Line(self.p.c2p(-2,2),self.p.c2p(3,-3),color=PURPLE,stroke_width=4)
            self.play(Create(line),run_time=1.5)
            shifted = Line(self.p.c2p(-2,3),self.p.c2p(4,-3),color=GREEN,stroke_width=4)
            self.play(Transform(line,shifted),run_time=3)
            self.add(self.arrow((1,0),BLUE))
        elif action=='matrix':
            self.base()
            self.note('A matrix combines its columns', 'Vc = c₁v₁ + c₂v₂', 'Columns: moves · input: amounts')
            self.controls()
            self.route(1,2,min(6,d*.4))
        elif action=='geometry':
            self.base(target=False)
            self.note('How much points along u?', 'u · v = ‖u‖ × signed shadow', 'Independence does not mean 90°')
            u=np.array([2,1]);v=np.array([1,2]); foot=np.dot(u,v)/np.dot(u,u)*u
            shadow=self.arrow(foot,GREEN)
            drop=DashedLine(self.p.c2p(*v),self.p.c2p(*foot),color=MUTED)
            self.play(Create(drop),GrowArrow(shadow),run_time=3)
        elif action=='sensitive':
            self.base(target=False)
            self.note('Still possible. Still easy?', 'b₁=(1,0), b₂=(1,ε)', 'Target (0, 1) · settings (−1/ε, 1/ε)')
            self.play(Transform(self.u,self.arrow((3,0),BLUE)),Transform(self.v,self.arrow((3,.2),GOLD)),run_time=5)
            point=Dot(self.p.c2p(0,1),radius=.09,color=GREEN)
            self.play(FadeIn(point),run_time=1)
        elif action in ('recap','final'):
            self.base(craft=True)
            self.note('Reachable? Unique? Stable?', 'These are different questions.', 'Look for the independent moves')
            self.route(1,2,min(7,d*.35))
            if action=='final':
                brand=txt('GROUNDUP LAB',25,BLUE).move_to([3.9,-2,0])
                self.play(FadeIn(brand),run_time=1)
        else:
            raise ValueError(action)

    def construct(self):
        plan=json.loads((OUT/'plan.json').read_text())
        shots=[s for s in plan if s['kind']=='fresh']
        if os.environ.get('LA01_PREVIEW')=='1':
            shots=[s for s in shots if s['chapter']=='reach']
        cues={}
        for s in shots:
            self.clear()
            for attr in ('a','b'):
                if hasattr(self,attr):delattr(self,attr)
            start=self.time
            self.setup_world(s['title'])
            self.draw_action(s['action'],s['duration'])
            remaining=s['duration']-(self.time-start)
            if remaining<-.04:
                raise ValueError(f'Animation overruns shot {s["id"]}: {-remaining:.2f}s')
            if remaining>0:
                self.wait(remaining)
            cues[s['id']]={'start':start,'end':self.time}
        (OUT/'fresh-cues.json').write_text(json.dumps(cues,indent=2))


class Thumbnail(Scene):
    def construct(self):
        self.add(txt('GROUNDUP LAB  /  LINEAR ALGEBRA 01',24,BLUE).to_corner(UL,buff=.5))
        title=Text('TWO ARROWS.\nA WHOLE WORLD.',font='Helvetica Neue',font_size=72,weight=BOLD,line_spacing=.8)
        title.scale_to_fit_width(7.0).to_edge(LEFT,buff=.55).shift(UP*.4)
        self.add(title)
        self.add(txt('Vectors • Span • Bases',30,MUTED).to_corner(DL,buff=.6))
        center=np.array([3.8,-.2,0])
        grid=NumberPlane(x_range=[-3,3,1],y_range=[-3,3,1],x_length=5.8,y_length=5.8,background_line_style={'stroke_color':PURPLE,'stroke_opacity':.32},axis_config={'stroke_opacity':.1}).move_to(center)
        self.add(grid)
        for end,color in [([2.2,.7,0],BLUE),([.5,2,0],GOLD)]:
            self.add(Arrow(center-np.array([1.2,1,0]),center-np.array([1.2,1,0])+np.array(end),buff=0,color=color,stroke_width=13,max_tip_length_to_length_ratio=.25))
        self.add(Dot(center+np.array([1.2,1.5,0]),radius=.13,color=GREEN))
        self.add(txt('WHERE CAN YOU REACH?',24,GREEN,5).next_to(grid,DOWN,buff=.2))
