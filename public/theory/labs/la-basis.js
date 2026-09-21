/* Lab: coordinates in a skewed basis — and what ill-conditioning looks like. */
GU.lab("la-basis", function (root) {
  var K = GU.labkit, css = K.css, f = K.f, sw = K.sw;

  var s = K.shell(root, {
    title: "Coordinates in a skewed basis",
    hint: "drag b₁, b₂ and the ◆ point"
  });

  s.panel.innerHTML =
    '<div class="readout" data-out></div>' +
    '<div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-std>standard basis</button>' +
    '<button type="button" data-skew>skew it</button>' +
    '<button type="button" data-deg>degenerate</button></div>' +
    '<label class="togg"><input type="checkbox" data-grid checked> show B-grid</label>';

  var q = function (sel) { return s.panel.querySelector(sel); };
  var gridEl = q("[data-grid]"), out = q("[data-out]"), verd = q("[data-verdict]");

  var b1 = [2, 0.4], b2 = [0.6, 1.8], p = [2.6, 2.2];

  var P = K.plot(s.canvas, {
    span: 4.6,
    handles: function () {
      return [
        { v: b1, set: function (x) { b1 = x; } },
        { v: b2, set: function (x) { b2 = x; } },
        { v: p, set: function (x) { p = x; } }
      ];
    },
    draw: function (P) {
      var det = b1[0] * b2[1] - b1[1] * b2[0];
      var deg = det === 0;
      var zero = b1[0] === 0 && b1[1] === 0 && b2[0] === 0 && b2[1] === 0;
      var near = !deg && Math.abs(det) < 0.03 * (b1[0] ** 2 + b1[1] ** 2 + b2[0] ** 2 + b2[1] ** 2);
      P.grid();

      if (gridEl.checked && !deg) {
        var N = 6, faint = K.mix(css("--ink-3"), 38);
        for (var i = -N; i <= N; i++) {
          P.line([i * b1[0] - N * b2[0], i * b1[1] - N * b2[1]],
                 [i * b1[0] + N * b2[0], i * b1[1] + N * b2[1]], faint, null, 1);
          P.line([i * b2[0] - N * b1[0], i * b2[1] - N * b1[1]],
                 [i * b2[0] + N * b1[0], i * b2[1] + N * b1[1]], faint, null, 1);
        }
      }

      var c1 = 0, c2 = 0;
      if (!deg) {
        c1 = (b2[1] * p[0] - b2[0] * p[1]) / det;
        c2 = (-b1[1] * p[0] + b1[0] * p[1]) / det;
        P.line([0, 0], [c1 * b1[0], c1 * b1[1]], css("--u"), [5, 4], 1.8);
        P.line([c1 * b1[0], c1 * b1[1]], p, css("--v"), [5, 4], 1.8);
      } else {
        var base = Math.hypot(b1[0], b1[1]) !== 0 ? b1 : b2;
        P.line([-9 * base[0], -9 * base[1]], [9 * base[0], 9 * base[1]], css("--warn"), null, 3);
      }

      P.arrow(b1, css("--u"), "b₁");
      P.arrow(b2, css("--v"), "b₂");
      P.dot(b1[0], b1[1], css("--u"), 4.5);
      P.dot(b2[0], b2[1], css("--v"), 4.5);
      P.dot(p[0], p[1], css("--ink"), 7, "diamond");

      out.innerHTML =
        sw(css("--u")) + '<span class="k">b₁    </span>= (' + f(b1[0]) + ", " + f(b1[1]) + ")<br>" +
        sw(css("--v")) + '<span class="k">b₂    </span>= (' + f(b2[0]) + ", " + f(b2[1]) + ")<br>" +
        '<span class="k">p     </span>= (' + f(p[0]) + ", " + f(p[1]) + ')  <span class="k">std</span><br>' +
        '<span class="k">[p]_B </span>= ' + (deg ? "—" : "(" + f(c1) + ", " + f(c2) + ")") + "<br>" +
        '<span class="k">det   </span>= ' + f(det, 3);

      if (deg) {
        verd.className = "verdict bad";
        verd.innerHTML = zero
          ? "<strong>Not a basis.</strong> Both generators are zero. Only the origin is reachable, with infinitely many coefficient pairs."
          : "<strong>Not a basis.</strong> The generators span a line. Points off it have <em>no</em> representation; points on it have <em>infinitely many</em>.";
      } else {
        verd.className = "verdict";
        verd.innerHTML = "<strong>Valid basis.</strong> p = " + f(c1) + "·b₁ + " + f(c2) +
          "·b₂, and this is the only such pair." +
          (near ? " <em>Near-singular: some target perturbations cause large coordinate changes. This target need not have large coordinates. Values are computed in floating point.</em>" : "");
      }
    }
  });

  gridEl.addEventListener("change", P.render);
  q("[data-std]").onclick = function () { b1 = [1, 0]; b2 = [0, 1]; P.render(); };
  q("[data-skew]").onclick = function () { b1 = [2, 0.4]; b2 = [1.6, 1.0]; P.render(); };
  q("[data-deg]").onclick = function () { b1 = [2, 0.4]; b2 = [-2, -0.4]; P.render(); };
});
