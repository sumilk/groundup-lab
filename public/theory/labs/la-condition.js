/* Analytic perturbed diagonal solve: sensitivity, not a rounding simulator. */
GU.lab("la-condition", function(root) {
  var K = GU.labkit;
  root.innerHTML = '<div class="lab-head"><span class="lab-title">Can a tiny residual hide a wrong answer?</span><span class="lab-hint">predict the solution error before revealing</span></div>' +
    '<div class="lsq-views"><div><p class="lab-caption">Solution coordinates (auto-fit): arrows labeled x (exact) and x̂ (candidate).</p><div class="stage"><canvas data-solution aria-label="Original and perturbed solution coordinates"></canvas></div></div><div><p class="lab-caption">Revealed: log₁₀ relative forward error by direction; gray worst-case ceiling; dot marks current probe.</p><div class="stage"><canvas data-curve aria-label="Log relative error versus perturbation angle"></canvas></div></div></div>' +
    '<div class="panel"><div class="btnrow"><button data-danger>Small residual / large error</button><button data-benign>Benign direction</button><button data-scaled>Same equation ×10⁶</button><button data-singular>Singular</button></div>' +
    '<label>Weak gain ε <select data-epsilon><option value="1">1</option><option value="0.01">10⁻²</option><option value="0.000001">10⁻⁶</option><option value="0.0000000001">10⁻¹⁰</option><option value="0">0 · singular</option></select></label>' +
    '<label>Relative input change δ <select data-delta><option value="0.01">10⁻²</option><option value="0.000001">10⁻⁶</option><option value="0.0000000001">10⁻¹⁰</option></select></label>' +
    '<label>Common scale c <select data-scale><option value="0.000001">10⁻⁶</option><option value="1">1</option><option value="1000000">10⁶</option></select></label>' +
    '<label>Perturbation angle θ (degrees) <input data-angle type="range" min="0" max="90" step="1" value="90"></label>' +
    '<label><input data-reveal type="checkbox"> Reveal error and solution</label><div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div>';
  var get = function(name) { return root.querySelector('[data-'+name+']'); };
  var epsilon = get('epsilon'), delta = get('delta'), scale = get('scale'), angle = get('angle'), reveal = get('reveal'), solution, curve;
  epsilon.value = '0.000001'; delta.value = '0.000001'; scale.value = '1'; angle.value = '90'; reveal.checked = false;
  function f(v) { return v === 0 ? '0' : Math.abs(v)<1e-4 || Math.abs(v)>=1e5 ? v.toExponential(4) : K.f(v,6); }
  function state() {
    var e = Number(epsilon.value), d = Number(delta.value), c = Number(scale.value), t = Number(angle.value)*Math.PI/180;
    // Exact axis presets avoid manufacturing a tiny off-axis component from cos(pi/2).
    var cos = Number(angle.value) === 90 ? 0 : Math.cos(t), sin = Number(angle.value) === 0 ? 0 : Math.sin(t);
    if (e === 0) return {e:e,d:d,c:c};
    var dx = [d*cos,d*sin/e], xhat = [1+dx[0],dx[1]];
    return {e:e,d:d,c:c,dx:dx,xhat:xhat,error:Math.hypot(...dx),eta:d/(Math.hypot(...xhat)+1)};
  }
  function refresh() {
    var s = state();
    get('out').innerHTML = 'A = c·diag(1, ε), b = c·(1, 0)<br>ε = '+f(s.e)+' · δ = '+f(s.d)+' · c = '+f(s.c)+' · θ = '+angle.value+'°';
    if (!reveal.checked) {
      get('out').innerHTML += '<br>Predict the residual and solution error, then reveal.';
      get('verdict').textContent = 'The candidate solves the deliberately perturbed data exactly. Predict its error against the original data.';
    } else if (s.e === 0) {
      get('out').innerHTML += '<br>κ₂ = ∞ · unique-solution error and η₂ for a selected candidate are not reported.';
      get('verdict').textContent = Number(angle.value) === 0 ? 'Singular: infinitely many solutions. No unique solution oracle.' : 'Singular: perturbed second equation is inconsistent. No unique solution oracle.';
    } else {
      get('out').innerHTML += '<br>x̂ = ('+s.xhat.map(f).join(', ')+')<br>κ₂ = '+f(1/s.e)+'<br>Absolute residual ‖r‖₂ = '+f(s.c*s.d)+
        '<br>Relative residual = '+f(s.d)+'<br>Relative forward error = '+f(s.error)+'<br>Normwise backward error η₂ = '+f(s.eta)+'<br>Worst-case ceiling κ₂δ = '+f(s.d/s.e);
      get('verdict').textContent = 'Direction controls the realized error. Common scaling changes the absolute residual but leaves these relative diagnostics unchanged. This is an analytic sensitivity experiment, not a solver-stability measurement.';
    }
    if (solution) solution.render(); if (curve) curve.render();
  }
  function changed() { reveal.checked = false; refresh(); }
  solution = K.plot(get('solution'),{span:2,handles:function() { return []; },draw:function(p) {
    var s = state(); p.span = reveal.checked && s.e>0 ? Math.max(2,1.3*Math.hypot(...s.xhat)) : 2;
    if (p.W && p.H) p.unit = Math.min(p.W,p.H)/(2*p.span);
    p.grid();
    if (reveal.checked && s.e>0) { p.arrow([1,0],K.css('--u'),'x'); p.arrow(s.xhat,K.css('--v'),'x̂'); p.line([1,0],s.xhat,K.css('--accent'),[4,4]); }
  }});
  curve = K.chart(get('curve'),function() {
    var s = state(), lo = Math.log10(s.d)-.5, hi = Math.log10(s.d/(s.e || 1))+.5;
    var spec = {x:[0,90],y:[lo,hi],xLabel:'perturbation angle θ (degrees)',yLabel:'log₁₀ relative forward error',series:[]};
    if (!reveal.checked || s.e === 0) return spec;
    var points = [];
    for (var i=0;i<=90;i++) { var t=i*Math.PI/180; points.push([i,Math.log10(s.d*Math.hypot(Math.cos(t),Math.sin(t)/s.e))]); }
    spec.series = [{points:points,color:K.css('--accent')},{points:[[0,Math.log10(s.d/s.e)],[90,Math.log10(s.d/s.e)]],color:K.css('--ink-3')}];
    spec.dots = [[Number(angle.value),Math.log10(s.error)]]; return spec;
  });
  [epsilon,delta,scale].forEach(function(control) { control.addEventListener('change',changed); });
  angle.addEventListener('input',changed); reveal.addEventListener('change',refresh);
  var presets = {danger:['0.000001','1','90'],benign:['0.000001','1','0'],scaled:['0.000001','1000000','90'],singular:['0','1','90']};
  Object.keys(presets).forEach(function(name) { get(name).onclick = function() { epsilon.value=presets[name][0];scale.value=presets[name][1];angle.value=presets[name][2];delta.value='0.000001';changed(); }; });
  get('solution').addEventListener('gu-theme',refresh); refresh();
});
