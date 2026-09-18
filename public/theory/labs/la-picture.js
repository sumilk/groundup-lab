/* Lab: one 2x2 system, drawn twice — rows as lines, columns as arrows. */
GU.lab("la-picture", function (root) {
  var K = GU.labkit, css = K.css, f = K.f, sw = K.sw;

  var s = K.shell(root, {
    title: "Row picture, column picture",
    hint: "drag the ● handles · switch pictures to see the same system twice"
  });

  s.panel.innerHTML =
    '<div class="readout" data-out></div>' +
    '<div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-row>row picture</button>' +
    '<button type="button" data-col>column picture</button></div>' +
    '<div class="btnrow"><button type="button" data-sing>make singular</button>' +
    '<button type="button" data-fit>put b in the span</button>' +
    '<button type="button" data-reset>reset</button></div>';

  var q = function (sel) { return s.panel.querySelector(sel); };
  var out = q("[data-out]"), verd = q("[data-verdict]");

  var M = [[2, 1], [1, -1]], b = [3, 0], mode = "row";
  function columns() { return [[M[0][0], M[1][0]], [M[0][1], M[1][1]]]; }
  function cross(u, v) { return u[0] * v[1] - u[1] * v[0]; }

  var P = K.plot(s.canvas, {
    span: 4.6,
    handles: function () {
      if (mode === "row") {
        return [
          { v: M[0], set: function (p) { M[0] = p; } },
          { v: M[1], set: function (p) { M[1] = p; } },
          { v: b, set: function (p) { b = p; } }
        ];
      }
      var col = columns();
      return [
        { v: col[0], set: function (p) { M[0][0] = p[0]; M[1][0] = p[1]; } },
        { v: col[1], set: function (p) { M[0][1] = p[0]; M[1][1] = p[1]; } },
        { v: b, set: function (p) { b = p; } }
      ];
    },
    draw: function (P) {
      var det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
      var singular = det === 0;
      var near = !singular && Math.abs(det) < 0.03 * (M[0][0] ** 2 + M[0][1] ** 2 + M[1][0] ** 2 + M[1][1] ** 2);
      var col = columns();
      P.grid();

      if (mode === "row") {
        [[M[0], b[0], css("--u")], [M[1], b[1], css("--v")]].forEach(function (spec) {
          var n = spec[0], rhs = spec[1], colour = spec[2];
          var norm2 = n[0] * n[0] + n[1] * n[1];
          if (norm2 === 0) return;
          var p0 = [n[0] * rhs / norm2, n[1] * rhs / norm2], d = [-n[1], n[0]];
          P.line([p0[0] - 9 * d[0], p0[1] - 9 * d[1]], [p0[0] + 9 * d[0], p0[1] + 9 * d[1]], colour, null, 2.4);
          P.arrow(n, colour, null, { w: 1.4, dash: [4, 4] });
        });
        if (!singular) {
          P.dot((M[1][1] * b[0] - M[0][1] * b[1]) / det,
                (-M[1][0] * b[0] + M[0][0] * b[1]) / det, css("--w"), 7, "diamond");
        }
        P.dot(M[0][0], M[0][1], css("--u"), 4.5);
        P.dot(M[1][0], M[1][1], css("--v"), 4.5);
      } else {
        P.arrow(col[0], css("--u"), "a₁");
        P.arrow(col[1], css("--v"), "a₂");
        P.dot(col[0][0], col[0][1], css("--u"), 4.5);
        P.dot(col[1][0], col[1][1], css("--v"), 4.5);
        if (!singular) {
          var c1 = (M[1][1] * b[0] - M[0][1] * b[1]) / det;
          P.line([0, 0], [c1 * col[0][0], c1 * col[0][1]], css("--u"), [5, 4], 1.8);
          P.line([c1 * col[0][0], c1 * col[0][1]], b, css("--v"), [5, 4], 1.8);
        } else {
          var base = Math.hypot(col[0][0], col[0][1]) !== 0 ? col[0] : col[1];
          if (Math.hypot(base[0], base[1]) !== 0) {
            P.line([-9 * base[0], -9 * base[1]], [9 * base[0], 9 * base[1]], css("--warn"), null, 3);
          }
        }
        P.dot(b[0], b[1], css("--w"), 7, "diamond");
      }

      out.innerHTML =
        '<span class="k">A   </span>= [' + f(M[0][0]) + " " + f(M[0][1]) + " ; " + f(M[1][0]) + " " + f(M[1][1]) + "]<br>" +
        sw(css("--w")) + '<span class="k">b   </span>= (' + f(b[0]) + ", " + f(b[1]) + ")<br>" +
        '<span class="k">det </span>= ' + f(det, 3) + "<br>" +
        '<span class="k">view</span>= ' + (mode === "row" ? "rows as lines" : "columns as arrows");

      if (!singular) {
        var s1 = (M[1][1] * b[0] - M[0][1] * b[1]) / det;
        var s2 = (-M[1][0] * b[0] + M[0][0] * b[1]) / det;
        verd.className = "verdict";
        verd.innerHTML = "<strong>Exactly one solution:</strong> x = (" + f(s1) + ", " + f(s2) + "). " +
          (mode === "row" ? "The two lines cross once."
                          : "a₁ and a₂ are independent, so every b has exactly one recipe.") +
          (near ? " <em>Near-singular: the unique solution can be sensitive. Values are computed in floating point.</em>" : "");
      } else {
        var base2 = Math.hypot(col[0][0], col[0][1]) !== 0 ? col[0] : col[1];
        var zero = Math.hypot(base2[0], base2[1]) === 0;
        var consistent = zero ? b[0] === 0 && b[1] === 0 : cross(base2, b) === 0;
        verd.className = "verdict bad";
        verd.innerHTML = zero
          ? (consistent ? "<strong>Infinitely many solutions.</strong> A and b are zero: every input in ℝ² solves the system."
                        : "<strong>No solution.</strong> A is zero but b is not: a row requires 0 = nonzero.")
          : consistent
          ? "<strong>Infinitely many solutions.</strong> The columns are dependent, so the column space is only a line — and b lies on it. Solutions differ by the null space, so the solution set is a whole line of inputs."
          : "<strong>No solution.</strong> b is outside the column line. The row equations are incompatible (parallel distinct lines, or a zero row with a nonzero right-hand side).";
      }
    }
  });

  q("[data-row]").onclick = function () { mode = "row"; P.render(); };
  q("[data-col]").onclick = function () { mode = "col"; P.render(); };
  q("[data-sing]").onclick = function () { M = [[2, 1], [4, 2]]; P.render(); };
  q("[data-fit]").onclick = function () {
    var col = columns();
    b = [col[0][0] + 0.5 * col[1][0], col[0][1] + 0.5 * col[1][1]];
    P.render();
  };
  q("[data-reset]").onclick = function () { M = [[2, 1], [1, -1]]; b = [3, 0]; P.render(); };
});
