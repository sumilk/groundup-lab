/* An invariant line compares an input with its own image, not ellipse axes. */
GU.lab("la-eigen", function(root) {
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">Which lines survive the map?</span><span class="lab-hint">drag column tips · auto-fit · predict, then reveal</span></div><div class="lab-body"><div class="stage"><canvas aria-label="Unit circle, its image, and a probe vector"></canvas></div><div class="panel">'+
    '<div class="btnrow"><button data-two>two lines</button><button data-flip>flip</button><button data-shear>shear</button><button data-scalar>scalar</button><button data-rotation>rotation</button><button data-collapse>collapse</button></div>'+
    '<label>Probe angle <input data-angle type="range" min="0" max="360" step="1" value="45"></label><label><input data-reveal type="checkbox"> Reveal eigenvalues and invariant lines</label>'+
    '<details><summary>Edit matrix entries (rows of A)</summary><div data-cells style="display:grid;grid-template-columns:1fr 1fr;gap:6px"></div><div data-error role="status"></div></details>'+
    '<div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div></div>';
  var get=function(n){return root.querySelector('[data-'+n+']');};
  var a=[[2,1],[0,1]], angle=get('angle'), reveal=get('reveal'), out=get('out'), verdict=get('verdict'), inputs=[], plot;
  angle.value='45';reveal.checked=false;
  var mul=function(v){return [a[0][0]*v[0]+a[0][1]*v[1],a[1][0]*v[0]+a[1][1]*v[1]];};
  var times=function(v,s){return v.map(function(x){return x*s;});};
  function fmt(x){return x!==0&&Math.abs(x)<1e-4?x.toExponential(2):K.f(x,4);}
  function displayScale(){return Math.min(1,4.2/Math.max(1,Math.hypot(...a[0]),Math.hypot(...a[1])));}
  function probe(){var t=Number(angle.value)*Math.PI/180;return [Math.cos(t),Math.sin(t)];}
  function spectrum(){
    var trace=a[0][0]+a[1][1], delta=(a[0][0]-a[1][1])**2+4*a[0][1]*a[1][0];
    if(delta<0)return {values:[],lines:[],text:'Complex pair: '+fmt(trace/2)+' ± '+fmt(Math.sqrt(-delta)/2)+'i. No real invariant line; the real plane is invariant.'};
    var scalar=a[0][1]===0&&a[1][0]===0&&a[0][0]===a[1][1];
    if(scalar)return {values:[a[0][0]],lines:[],scalar:true,text:'Scalar matrix: every line is invariant. Eigenvalue '+fmt(a[0][0])+', eigenspace dimension 2.'};
    // Use the product of roots to avoid one avoidable quadratic cancellation.
    var q=(trace+(trace>=0?1:-1)*Math.sqrt(delta))/2;
    var det=a[0][0]*a[1][1]-a[0][1]*a[1][0];
    var values=delta===0?[trace/2]:[q,q===0?0:det/q];
    var lines=values.map(function(l){
      var r=[a[0][0]-l,a[0][1]],s=[a[1][0],a[1][1]-l];
      if(Math.hypot(...s)>Math.hypot(...r))r=s;
      var v=[-r[1],r[0]],n=Math.hypot(...v);return times(v,1/n);
    });
    return {values:values,lines:lines,text:delta===0?'Repeated real eigenvalue '+fmt(trace/2)+'; one eigenline. Defective in this computed classification.':'Two distinct real eigenvalues: '+values.map(fmt).join(', ')+'. Two independent lines; they need not be perpendicular.'};
  }
  function refresh(){
    inputs.forEach(function(input,k){if(document.activeElement!==input)input.value=String(a[Math.floor(k/2)][k%2]);});
    var v=probe(),w=mul(v),l=v[0]*w[0]+v[1]*w[1],r=Math.hypot(w[0]-l*v[0],w[1]-l*v[1]);
    out.innerHTML='A = [ '+a[0].map(fmt).join(', ')+' ; '+a[1].map(fmt).join(', ')+' ]<br>probe angle = '+angle.value+'°<br>λ̂ = '+fmt(l)+' · ‖Av − λ̂v‖ = '+fmt(r)+'<br>‖Av‖ = '+fmt(Math.hypot(...w));
    verdict.textContent=reveal.checked?spectrum().text+' Classification uses floating-point discriminant signs; rounded values do not certify exact multiplicity.':
      'Predict the number of invariant lines. Move the probe until its image lies on the same line, then reveal. Zero output still permits a zero eigenvalue.';
    if(plot)plot.render();
  }
  for(var k=0;k<4;k++){
    var input=document.createElement('input');input.type='number';input.step='any';input.style.minWidth='0';input.style.width='100%';input.setAttribute('aria-label','row '+(Math.floor(k/2)+1)+', column '+(k%2+1));
    (function(control,index){control.addEventListener('input',function(){var value=Number(control.value);
      if(control.value.trim()===''||!Number.isFinite(value)||Math.abs(value)>4){get('error').textContent='Enter a finite entry from −4 to 4.';return;}
      get('error').textContent='';a[Math.floor(index/2)][index%2]=value;refresh();
    });})(input,k);get('cells').appendChild(input);inputs.push(input);
  }
  plot=K.plot(root.querySelector('canvas'),{span:5,handles:function(){var scale=displayScale();return [0,1].map(function(j){return {v:times([a[0][j],a[1][j]],scale),set:function(v){a[0][j]=Math.max(-4,Math.min(4,v[0]/scale));a[1][j]=Math.max(-4,Math.min(4,v[1]/scale));refresh();}};});},draw:function(p){
    p.grid();var scale=displayScale(),circle=[],ellipse=[];
    for(var i=0;i<100;i++){var t=i*2*Math.PI/100,v=[Math.cos(t),Math.sin(t)];circle.push(times(v,scale));ellipse.push(times(mul(v),scale));}
    p.poly(circle,null,K.css('--ink-3'));p.poly(ellipse,K.mix(K.css('--accent'),9),K.css('--accent'));
    if(reveal.checked){var s=spectrum();var lines=s.scalar?Array.from({length:12},function(_,i){return [Math.cos(i*Math.PI/12),Math.sin(i*Math.PI/12)];}):s.lines;
      lines.forEach(function(v){p.line(times(v,-5),times(v,5),K.css('--w'),[5,4]);});}
    [0,1].forEach(function(j){var v=times([a[0][j],a[1][j]],scale),c=K.css(j?'--v':'--u');p.dot(v[0],v[1],c,6);p.arrow(v,c,'a'+(j+1),{dash:[3,3]});});
    var v=probe();p.arrow(times(v,scale),K.css('--ink'),'v');p.arrow(times(mul(v),scale),K.css('--accent'),'Av',{w:3});
  }});
  var presets={two:[[2,1],[0,1]],flip:[[-2,0],[0,1]],shear:[[1,1],[0,1]],scalar:[[1,0],[0,1]],rotation:[[0,-1],[1,0]],collapse:[[1,0],[0,0]]};
  Object.keys(presets).forEach(function(name){get(name).onclick=function(){a=presets[name].map(function(r){return r.slice();});reveal.checked=false;get('error').textContent='';refresh();};});
  angle.addEventListener('input',refresh);reveal.addEventListener('change',refresh);refresh();
});
