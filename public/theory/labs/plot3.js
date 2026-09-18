/* Shared orthographic 3D view. Handles move in the screen-parallel plane;
   dragging empty canvas rotates the camera without changing any vector. */
(function () {
  var K = GU.labkit;
  K.plot3 = function (canvas, opts) {
    var initialAzimuth = opts.azimuth === undefined ? 0.6 : opts.azimuth;
    var initialElevation = opts.elevation === undefined ? 0.55 : opts.elevation;
    var azimuth = initialAzimuth, elevation = initialElevation, cameraDrag = null, surface;
    function axes() {
      var c = Math.cos(azimuth), s = Math.sin(azimuth);
      var ce = Math.cos(elevation), se = Math.sin(elevation);
      return [[c, s, 0], [-s * se, c * se, ce]];
    }
    function dot(a, b) { return a.reduce(function (sum, v, i) { return sum + v * b[i]; }, 0); }
    function project(v) { var a = axes(); return [dot(v, a[0]), dot(v, a[1])]; }
    function handles() {
      return (opts.handles ? opts.handles() : []).map(function (h) {
        return {v: project(h.v), set: function (p) {
          var a = axes(), old = project(h.v);
          h.set(h.v.map(function (v, i) { return v + (p[0] - old[0]) * a[0][i] + (p[1] - old[1]) * a[1][i]; }));
        }};
      });
    }
    surface = K.plot(canvas, {
      span: opts.span || 5,
      handles: handles,
      draw: function (p) {
        var view = {
          project: project,
          line: function (a, b, color, dash, width) { p.line(project(a), project(b), color, dash, width); },
          poly: function (points, fill, stroke) { p.poly(points.map(project), fill, stroke); },
          arrow: function (v, color, label) { p.arrow(project(v), color, label); },
          dot: function (v, color, size, shape) { var q = project(v); p.dot(q[0], q[1], color, size, shape); },
          axes: function () {
            var size = opts.span || 5;
            for (var i = 0; i < 3; i++) {
              var a = [0, 0, 0], b = [0, 0, 0]; a[i] = -size; b[i] = size;
              view.line(a, b, K.css('--grid'), null, 1);
              b[i] = size * 0.7;
              view.arrow(b, K.css('--ink-3'), ['x₁', 'x₂', 'x₃'][i]);
            }
          }
        };
        opts.draw(view);
      }
    });
    function position(e) { var box = canvas.getBoundingClientRect(); return [e.clientX - box.left, e.clientY - box.top]; }
    canvas.addEventListener('pointerdown', function (e) {
      var p = position(e);
      var near = handles().some(function (h) { return Math.hypot(p[0] - surface.x2p(h.v[0]), p[1] - surface.y2p(h.v[1])) < 22; });
      if (!near) { cameraDrag = {p: p, az: azimuth, el: elevation}; canvas.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!cameraDrag) return;
      var p = position(e);
      azimuth = cameraDrag.az + (p[0] - cameraDrag.p[0]) * .008;
      elevation = Math.max(-1.4, Math.min(1.4, cameraDrag.el + (p[1] - cameraDrag.p[1]) * .008));
      surface.render();
    });
    function release() { cameraDrag = null; }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('gu-theme', surface.render);
    return {render: surface.render, project: project, resetCamera: function () { azimuth = initialAzimuth; elevation = initialElevation; surface.render(); }};
  };
})();
