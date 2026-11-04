/* LA10 ridge experiment: what observation noise moves, with and without damping.
   Fixed 3×2 design X, fixed true coefficients w*, fifty noise draws per seed.
   Every estimate is computed from the 2×2 eigen-decomposition of XᵀX, so the
   exact-collinearity case at λ = 0 returns the minimum-norm least-squares solution. */
GU.lab("la-ridge", function(root) {
  var K = GU.labkit;
  root.innerHTML = '<div class="lab-head"><span class="lab-title">What does the noise move?</span><span class="lab-hint">predict the two spreads before revealing</span></div>' +
    '<div class="lsq-views">' +
    '<div><p class="lab-caption">Coefficients (w₁, w₂) from 50 noise draws; diamond marks w*. w₁ is in y per unit of x₁, w₂ in y per unit of x₂.</p><div class="stage"><canvas data-params aria-label="Cloud of fitted coefficient vectors"></canvas></div></div>' +
    '<div><p class="lab-caption">Predictions at observed inputs 1–3 and at the query input (4), one dot per draw. Units of y.</p><div class="stage"><canvas data-fits aria-label="Spread of predictions at each input"></canvas></div></div>' +
    '<div><p class="lab-caption">Filter factor f = σ²/(σ²+λ) against log₁₀ σ; dots mark σ₁ and σ₂ of X.</p><div class="stage"><canvas data-filter aria-label="Ridge filter factor and the two singular values"></canvas></div></div>' +
    '</div>' +
    '<div class="panel"><div class="btnrow"><button data-near>Near collinear</button><button data-exact>Exact collinearity</button><button data-units>Changed units</button><button data-huge>Huge λ</button><button data-offpattern>Off-pattern query</button><button data-resample>New noise draws</button></div>' +
    '<label>Difference between the features, h <select data-gap><option value="0.1">0.1</option><option value="0.01">0.01</option><option value="0.001">0.001</option><option value="0">0 · exactly collinear</option></select></label>' +
    '<label>Noise standard deviation s <select data-noise><option value="0">0</option><option value="0.005">0.005</option><option value="0.01">0.01</option><option value="0.05">0.05</option></select></label>' +
    '<label>log₁₀ λ (leftmost: λ = 0) <input data-lambda type="range" min="-9" max="3" step="0.25" value="-9"></label>' +
    '<label>Units of x₂ <select data-scale><option value="1">original</option><option value="10">x₂ × 10</option></select></label>' +
    '<label>Query input <select data-query><option value="pattern">(1, 1): follows the pattern</option><option value="off">(1, 0): off the pattern</option></select></label>' +
    '<label><input data-reveal type="checkbox"> Reveal the spreads</label><label><input data-zoom type="checkbox"> Fit axes to the data</label><div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div>';
  var get = function(name) { return root.querySelector('[data-' + name + ']'); };
  var gap = get('gap'), noise = get('noise'), lambda = get('lambda'), scale = get('scale'), query = get('query'), reveal = get('reveal'), zoom = get('zoom');
  var seed = 1, views = [];
  gap.value = '0.01'; noise.value = '0.01'; lambda.value = '-9'; scale.value = '1'; query.value = 'pattern'; reveal.checked = false; zoom.checked = false;

  function rng(a) { return function() { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function gauss(r) { var u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function num(v) { return v === 0 ? '0' : Math.abs(v) < 1e-3 || Math.abs(v) >= 1e4 ? v.toExponential(3) : Number(v.toPrecision(4)).toString(); }
  function lam() { var e = Number(lambda.value); return e <= -9 ? 0 : Math.pow(10, e); }

  /* Design, singular data, and the ridge (or minimum-norm) solve for one right-hand side. */
  function design() {
    var h = Number(gap.value), c = Number(scale.value);
    var X = [[1, c * 1], [2, c * (2 + h)], [3, c * (3 - h)]];
    var a = 0, b = 0, d = 0;
    X.forEach(function(r) { a += r[0] * r[0]; b += r[0] * r[1]; d += r[1] * r[1]; });
    var disc = Math.sqrt((a - d) * (a - d) + 4 * b * b), m1 = (a + d + disc) / 2, m2 = Math.max(0, (a + d - disc) / 2);
    var v1 = Math.abs(b) > 1e-300 ? [b, m1 - a] : (a >= d ? [1, 0] : [0, 1]), n1 = Math.hypot(v1[0], v1[1]);
    v1 = [v1[0] / n1, v1[1] / n1];
    var v2 = [-v1[1], v1[0]];
    if (m2 <= 1e-12 * m1) m2 = 0;   // exact collinearity: the second channel is absent
    return {X: X, c: c, wstar: [1, 1 / c], mu: [m1, m2], v: [v1, v2], q: query.value === 'off' ? [1, 0] : [1, c * 1]};
  }
  function solve(D, y, l) {
    var g = [0, 0];
    D.X.forEach(function(r, i) { g[0] += r[0] * y[i]; g[1] += r[1] * y[i]; });
    var w = [0, 0];
    for (var i = 0; i < 2; i++) {
      if (D.mu[i] === 0) continue;   // also at λ = 0: skip the absent channel (minimum norm)
      var t = (D.v[i][0] * g[0] + D.v[i][1] * g[1]) / (D.mu[i] + l);
      w[0] += t * D.v[i][0]; w[1] += t * D.v[i][1];
    }
    return w;
  }
  function experiment() {
    var D = design(), l = lam(), s = Number(noise.value), r = rng(seed * 7919), draws = [];
    var clean = D.X.map(function(row) { return row[0] * D.wstar[0] + row[1] * D.wstar[1]; });
    var off = [1, 0];   // a fixed physical query: x₂ = 0 in any units
    for (var k = 0; k < 50; k++) {
      var y = clean.map(function(v) { return v + s * gauss(r); });
      var w = solve(D, y, l);
      draws.push({w: w, fit: D.X.map(function(row) { return row[0] * w[0] + row[1] * w[1]; }),
        pred: D.q[0] * w[0] + D.q[1] * w[1], off: off[0] * w[0] + off[1] * w[1]});
    }
    function sd(values) { var m = values.reduce(function(a, b) { return a + b; }, 0) / values.length; return Math.sqrt(values.reduce(function(a, v) { return a + (v - m) * (v - m); }, 0) / (values.length - 1)); }
    // The estimator is linear in y, so its expectation is the noiseless estimate: the bias is exact, not sampled.
    var expected = solve(D, clean, l);
    var expectedFit = D.X.map(function(row) { return row[0] * expected[0] + row[1] * expected[1]; });
    var bias = Math.hypot.apply(null, expectedFit.map(function(v, i) { return v - clean[i]; }));
    var preds = [];
    draws.forEach(function(d) { d.fit.forEach(function(v) { preds.push(v); }); preds.push(d.pred); });
    var sig = D.mu.map(Math.sqrt), f = D.mu.map(function(m) { return m === 0 ? 0 : m / (m + l); });
    return {D: D, l: l, s: s, draws: draws, expected: expected, bias: bias, signal: Math.hypot.apply(null, clean), sig: sig, f: f,
      sd1: sd(draws.map(function(d) { return d.w[0]; })), sd2: sd(draws.map(function(d) { return d.w[1]; })),
      fitSpread: Math.max.apply(null, [0, 1, 2].map(function(i) { return sd(draws.map(function(d) { return d.fit[i]; })); })),
      predSpread: sd(draws.map(function(d) { return d.pred; })), offSpread: sd(draws.map(function(d) { return d.off; })),
      predRange: [Math.min.apply(null, preds), Math.max.apply(null, preds)],
      coefOutside: draws.filter(function(d) { return Math.max(Math.abs(d.w[0]), Math.abs(d.w[1])) > 7; }).length,
      predOutside: preds.filter(function(v) { return v < -8 || v > 10; }).length};
  }

  function refresh() {
    var E = experiment(), D = E.D, out = get('out'), verdict = get('verdict');
    var u2 = D.c === 1 ? 'x₂' : 'x₂ in the new units';
    var head = 'X = [x₁, x₂] with x₁ = (1, 2, 3), x₂ = ' + (D.c === 1 ? '' : D.c + '×') + '(1, 2 + h, 3 − h) · w* = (' + num(D.wstar[0]) + ', ' + num(D.wstar[1]) + ')' +
      '<br>σ₁ = ' + num(E.sig[0]) + ' · σ₂ = ' + num(E.sig[1]) + ' · λ = ' + num(E.l) + ' · s = ' + num(E.s) +
      '<br>filter factors f₁ = ' + num(E.f[0]) + ', f₂ = ' + (D.mu[1] === 0 ? 'none (no second channel)' : num(E.f[1])) +
      ' · query x = (' + D.q.map(num).join(', ') + ')';
    var noiseless = '<br>Noiseless estimate (' + E.expected.map(num).join(', ') + ') · shrinkage bias in fitted values = ' + num(E.bias) + ' (‖Xw*‖ = ' + num(E.signal) + ')';
    if (!reveal.checked) {
      out.innerHTML = head + '<br>Predict: across the 50 draws, do the coefficients move a lot? Do the fitted values at the observed inputs move comparably? Then reveal.';
      verdict.textContent = 'The design X and w* stay fixed; only the noise in y changes from draw to draw.';
    } else if (E.s === 0) {
      out.innerHTML = head + '<br>No noise: every draw gives the same estimate, so all spreads are zero.' + noiseless;
      verdict.textContent = 'No noise: zero spread. A distance from w* now has two possible sources: shrinkage by the penalty, measured by the fitted-value bias above, and, when the features are exactly collinear, the choice of one coefficient vector from a line of equally good fits. The second changes coefficients without changing fitted values.';
    } else {
      out.innerHTML = head + '<br>Coefficient spreads: sd(w₁) = ' + num(E.sd1) + ' (y per unit of x₁) · sd(w₂) = ' + num(E.sd2) + ' (y per unit of ' + u2 + ')' +
        '<br>Largest fitted-value spread at the observed inputs (y) = ' + num(E.fitSpread) +
        '<br>Prediction spread at the query input (y) = ' + num(E.predSpread) +
        '<br>Prediction spread at the off-pattern input (1, 0) (y) = ' + num(E.offSpread) + noiseless +
        '<br>Observed prediction range [' + num(E.predRange[0]) + ', ' + num(E.predRange[1]) + ']' +
        (zoom.checked ? ' · axes fitted to the data' : ' · fixed axes: ' + E.predOutside + ' of 200 predictions and ' + E.coefOutside + ' of 50 estimates lie outside the view (tick “Fit axes” to see them)');
      var text;
      if (D.mu[1] === 0 && E.l === 0) text = 'Exact collinearity at λ = 0: a whole line of coefficients fits equally well, and the solve returns the minimum-norm one, the pseudoinverse solution. Raise λ and the estimates change continuously.';
      else if (E.l >= 10) text = 'Huge λ: coefficients and their spread shrink towards zero, while the shrinkage bias grows towards ‖Xw*‖, the error of predicting zero.';
      else if (D.c !== 1) text = 'Changed units: the same penalty λ‖w‖² now treats the two coefficients differently, so the shrinkage falls differently. The two coefficient spreads are in different units and cannot be added. Choose units, or standardize, for a stated modelling reason.';
      // Compare like with like: predictions in units of y at the observed inputs and at the fixed input (1, 0).
      else if (E.offSpread > 10 * E.fitSpread) text = 'The coefficients spread along the weak direction v₂ while the fitted values at the observed inputs stay tight. A prediction at (1, 0), which has a large component along v₂, spreads ' + num(E.offSpread / E.fitSpread) + ' times as much as the worst fitted value.' +
        (query.value === 'off' ? '' : ' Try the off-pattern query before trusting predictions elsewhere.');
      else text = 'Damping the weak channel has brought the off-pattern prediction spread to within a factor of 10 of the fitted-value spread, at the price of some shrinkage bias.';
      verdict.textContent = text;
    }
    views.forEach(function(v) { v.render(); });
  }
  function changed() { reveal.checked = false; refresh(); }

  views.push(K.plot(get('params'), {span: 7, handles: function() { return []; }, draw: function(p) {
    var E = experiment(), reach = 2;
    if (zoom.checked && reveal.checked) E.draws.concat([{w: E.D.wstar}]).forEach(function(d) { reach = Math.max(reach, Math.abs(d.w[0]), Math.abs(d.w[1])); });
    p.span = zoom.checked && reveal.checked ? 1.15 * reach : 7;
    if (p.W && p.H) p.unit = Math.min(p.W, p.H) / (2 * p.span);
    p.grid();
    p.dot(E.D.wstar[0], E.D.wstar[1], K.css('--ink'), 8, 'diamond');
    if (!reveal.checked) return;
    var v2 = E.D.v[1], L = 2 * p.span;
    p.line([E.D.wstar[0] - L * v2[0], E.D.wstar[1] - L * v2[1]], [E.D.wstar[0] + L * v2[0], E.D.wstar[1] + L * v2[1]], K.css('--ink-3'), [4, 4]);
    E.draws.forEach(function(d) { if (d.w.every(Number.isFinite)) p.dot(d.w[0], d.w[1], K.css('--accent'), 3); });
  }}));
  views.push(K.chart(get('fits'), function() {
    var E = experiment(), lo = -8, hi = 10;
    if (zoom.checked && reveal.checked) { var pad = Math.max(0.5, 0.08 * (E.predRange[1] - E.predRange[0])); lo = E.predRange[0] - pad; hi = E.predRange[1] + pad; }
    var spec = {x: [0.5, 4.5], y: [lo, hi], xTicks: [1, 2, 3, 4], xLabel: 'input (4 = query)', yLabel: 'prediction (y)', series: []};
    if (!reveal.checked) return spec;
    var pts = [];
    E.draws.forEach(function(d, k) {
      var jitter = (k / 49 - 0.5) * 0.3;
      d.fit.concat([d.pred]).forEach(function(v, i) { if (v >= lo && v <= hi) pts.push([i + 1 + jitter, v]); });   // never clamp: out-of-view values are counted in the readout
    });
    if (pts.length) spec.series = [{points: pts, scatter: true, color: K.css('--accent')}];
    return spec;
  }));
  views.push(K.chart(get('filter'), function() {
    var E = experiment(), l = E.l, pts = [], logs = E.sig.filter(function(s) { return s > 0; }).map(Math.log10);
    var a = Math.min(-4, Math.floor(Math.min.apply(null, logs)) - 1), b = Math.max(1, Math.ceil(Math.max.apply(null, logs)) + 1);
    for (var i = 0; i <= 120; i++) { var e = a + (b - a) * i / 120, s2 = Math.pow(10, 2 * e); pts.push([e, l === 0 ? 1 : s2 / (s2 + l)]); }
    var spec = {x: [a, b], y: [0, 1], xLabel: 'log₁₀ σ', yLabel: 'filter factor', series: [{points: pts, color: K.css('--accent')}], dots: []};
    E.sig.forEach(function(s, i) { if (s > 0) spec.dots.push([Math.log10(s), E.f[i]]); });
    return spec;
  }));

  [gap, noise, scale, query].forEach(function(control) { control.addEventListener('change', changed); });
  lambda.addEventListener('input', changed); reveal.addEventListener('change', refresh); zoom.addEventListener('change', refresh);
  var presets = {near: ['0.01', '0.01', '-9', '1', 'pattern'], exact: ['0', '0.01', '-9', '1', 'pattern'], units: ['0.01', '0.01', '-2', '10', 'pattern'],
    huge: ['0.01', '0.01', '3', '1', 'pattern'], offpattern: ['0.01', '0.01', '-9', '1', 'off']};
  Object.keys(presets).forEach(function(name) { get(name).onclick = function() {
    var p = presets[name]; gap.value = p[0]; noise.value = p[1]; lambda.value = p[2]; scale.value = p[3]; query.value = p[4]; changed(); }; });
  get('resample').onclick = function() { seed += 1; refresh(); };
  get('params').addEventListener('gu-theme', refresh); refresh();
});
