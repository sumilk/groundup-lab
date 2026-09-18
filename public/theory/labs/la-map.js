/* Lab: a 2x2 matrix as a map — its image, its rank, and the line it crushes. */
GU.lab("la-map", function (root) {
  var K = GU.labkit, css = K.css, f = K.f, sw = K.sw;

  var s = K.shell(root, {
    title: "The map, its rank, and its null space",
    hint: "drag the columns a₁, a₂ and the input ◆ x"
  });

  s.panel.innerHTML =
    '<div class="readout" data-out></div>' +
    '<div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-id>identity</button>' +
    '<button type="button" data-shear>shear</button>' +
    '<button type="button" data-rank1>rank 1</button>' +
    '<button type="button" data-zero>rank 0</button></div>' +
    '<label class="togg"><input type="checkbox" data-img checked> show image of the unit square</label>';

  var q = function (sel) { return s.panel.querySelector(sel); };
  var out = q("[data-out]"), verd = q("[data-verdict]"), img = q("[data-img]");

  var a1 = [2, 0.5], a2 = [-0.5, 1.8], x = [1.5, 1.5];

  var P = K.plot(s.canvas, {
    span: 4.6,
    handles: function () {
      return [
        { v: a1, set: function (p) { a1 = p; } },
        { v: a2, set: function (p) { a2 = p; } },
        { v: x, set: function (p) { x = p; } }
      ];
    },
    draw: function (P) {
      var det = a1[0] * a2[1] - a1[1] * a2[0];
      var n1 = Math.hypot(a1[0], a1[1]), n2 = Math.hypot(a2[0], a2[1]);
      var rank = Math.abs(det) > 0.05 ? 2 : ((n1 > 1e-3 || n2 > 1e-3) ? 1 : 0);
      var Ax = [x[0] * a1[0] + x[1] * a2[0], x[0] * a1[1] + x[1] * a2[1]];
      P.grid();

      P.poly([[0, 0], [1, 0], [1, 1], [0, 1]], null, K.mix(css("--ink-3"), 45));

      if (img.checked && rank === 2) {
        P.poly([[0, 0], a1, [a1[0] + a2[0], a1[1] + a2[1]], a2],
               K.mix(css("--accent"), 13), K.mix(css("--accent"), 45));
      }

      if (rank === 1) {
        var base = n1 > 1e-3 ? a1 : a2;
        P.line([-9 * base[0], -9 * base[1]], [9 * base[0], 9 * base[1]], css("--accent"), null, 3);
        var nul;
        if (n1 > 1e-3) { var t = (a1[0] * a2[0] + a1[1] * a2[1]) / (n1 * n1); nul = [-t, 1]; }
        else nul = [1, 0];
        P.line([-9 * nul[0], -9 * nul[1]], [9 * nul[0], 9 * nul[1]], css("--warn"), [6, 5], 2.2);
      }

      P.arrow(a1, css("--u"), "a₁");
      P.arrow(a2, css("--v"), "a₂");
      P.dot(a1[0], a1[1], css("--u"), 4.5);
      P.dot(a2[0], a2[1], css("--v"), 4.5);
      P.line(x, Ax, css("--w"), [4, 4], 1.4);
      P.dot(x[0], x[1], css("--ink"), 7, "diamond");
      P.dot(Ax[0], Ax[1], css("--w"), 7);

      out.innerHTML =
        sw(css("--u")) + '<span class="k">a₁  </span>= (' + f(a1[0]) + ", " + f(a1[1]) + ")<br>" +
        sw(css("--v")) + '<span class="k">a₂  </span>= (' + f(a2[0]) + ", " + f(a2[1]) + ")<br>" +
        '<span class="k">x   </span>= (' + f(x[0]) + ", " + f(x[1]) + ")<br>" +
        sw(css("--w")) + '<span class="k">Ax  </span>= (' + f(Ax[0]) + ", " + f(Ax[1]) + ")<br>" +
        '<span class="k">det </span>= ' + f(det, 3) + "<br>" +
        '<span class="k">rank</span>= ' + rank + "   <span class=\"k\">dim N(A)</span> = " + (2 - rank);

      if (rank === 2) {
        verd.className = "verdict";
        verd.innerHTML = "<strong>Full rank.</strong> The unit square maps to a parallelogram of area |det| = " +
          f(Math.abs(det)) + ". C(A) is all of ℝ², N(A) = {0}, and 2 + 0 = 2 is rank–nullity." +
          (Math.abs(det) < 0.4 ? " <em>Nearly flat — ill-conditioning, one step before rank deficiency.</em>" : "");
      } else if (rank === 1) {
        verd.className = "verdict bad";
        verd.innerHTML = "<strong>Rank 1.</strong> The square is crushed onto the solid line, which is C(A). " +
          "The dashed line is N(A): every input on it maps to the origin, and 1 + 1 = 2 is rank–nullity. " +
          "A solution exists only for b on the solid line, and then there are infinitely many.";
      } else {
        verd.className = "verdict bad";
        verd.innerHTML = "<strong>Rank 0.</strong> Both columns are zero, so everything maps to the origin. " +
          "N(A) is the whole plane and 0 + 2 = 2 still holds.";
      }
    }
  });

  img.addEventListener("change", P.render);
  q("[data-id]").onclick = function () { a1 = [1, 0]; a2 = [0, 1]; P.render(); };
  q("[data-shear]").onclick = function () { a1 = [1, 0]; a2 = [1.5, 1]; P.render(); };
  q("[data-rank1]").onclick = function () { a1 = [2, 1]; a2 = [-1, -0.5]; P.render(); };
  q("[data-zero]").onclick = function () { a1 = [0, 0]; a2 = [0, 0]; P.render(); };
});
