GU.lab("la-svd",function(root){
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">Which channels carry the map?</span><span class="lab-hint">drag columns · read paired directions · delete a channel</span></div>'+
    '<div class="lab-body"><div class="svd-views"><p class="lab-caption">Input space: unit probe and right singular directions.</p><div class="stage"><canvas data-input aria-label="Input unit circle and singular directions"></canvas></div>'+
    '<p class="lab-caption">Output space (auto-fit): circle image, column handles, and probe image. Gray: unit circle. Dashed: rank-one image.</p><div class="stage"><canvas data-output aria-label="Output ellipse with draggable matrix columns"></canvas></div><p class="lab-caption">When revealed, warm/cool arrows are σ₁u₁ and σ₂u₂. The dashed arrow is A₁x; black is Ax. Read the gains to compare lengths across views.</p></div>'+
    '<div class="panel"><div class="btnrow"><button data-shear>Shear</button><button data-reflection>Reflection</button><button data-rankone>Rank one</button><button data-thin>Thin</button><button data-isotropic>Isotropic</button><button data-zero>Zero</button></div>'+
    '<label>Probe angle <input data-angle type="range" min="0" max="360" step="1" value="45"></label><label><input data-reveal type="checkbox"> Reveal singular directions</label><label><input data-truncate type="checkbox"> Show rank-one approximation</label>'+
    '<label>Numerical rank tolerance <select data-tolerance><option value="0">0 (computed positive gains)</option><option value="0.0000000001">10⁻¹⁰ relative</option><option value="0.000001">10⁻⁶ relative</option><option value="0.1">0.1 relative</option></select></label>'+
    '<details open><summary>Edit A, row by row</summary><div data-cells class="svd-cells"></div><p data-error role="status"></p></details><div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div></div>';
  var get=function(name){return root.querySelector('[data-'+name+']');},A=[[1,2],[0,1]],inputs=[],inputPlot,outputPlot;
  var angle=get('angle'),reveal=get('reveal'),truncate=get('truncate'),tolerance=get('tolerance');angle.value='45';reveal.checked=false;truncate.checked=false;tolerance.value='0.000001';
  function fmt(v){return v!==0&&Math.abs(v)<1e-4?v.toExponential(2):K.f(v,4);}
  function mul(M,v){return M.map(function(row){return row[0]*v[0]+row[1]*v[1];});}
  function probe(){var t=Number(angle.value)*Math.PI/180;return [Math.cos(t),Math.sin(t)];}
  function scale(v,s){return v.map(function(x){return x*s;});}
  function refresh(){
    inputs.forEach(function(input,k){if(document.activeElement!==input)input.value=String(A[Math.floor(k/2)][k%2]);});
    var d=K.svd2(A),v=probe(),w=mul(A,v),B=K.truncate(d.U,d.s,d.Vt,1),err=Math.hypot(...mul(A.map(function(row,i){return row.map(function(x,j){return x-B[i][j];});}),v));
    var rank=d.s.filter(function(s){return s>Number(tolerance.value)*d.s[0];}).length;
    get('out').innerHTML='σ = ('+d.s.map(fmt).join(', ')+')<br>‖Av‖ = '+fmt(Math.hypot(...w))+'<br>rank-one probe error = '+fmt(err)+'<br>worst unit-input truncation error = '+fmt(d.s[1])+'<br>numerical rank = '+rank+' at relative τ = '+tolerance.value;
    var message=d.s[0]===0?'Zero map: the circle collapses to a point. All input directions are null; no preferred singular axes.':d.s[1]===0?'Computed rank one: the circle maps to a line segment. The second input channel is killed.':Math.abs(d.s[0]-d.s[1])<=1e-12*d.s[0]?'Equal gains within display precision: axes are not uniquely identified; a circle stays a circle up to scaling.':'Two computed positive channels. Right vectors describe inputs; left vectors describe outputs.';
    if(d.s[1]>0&&rank<2)message+=' The tolerance discards a positive computed gain; it has not changed the map.';
    get('verdict').textContent=message+' Rounded arithmetic does not certify exact rank.';
    if(inputPlot)inputPlot.render();if(outputPlot)outputPlot.render();
  }
  for(var k=0;k<4;k++){
    var input=document.createElement('input');input.type='number';input.step='any';input.setAttribute('aria-label','A row '+(Math.floor(k/2)+1)+' column '+(k%2+1));
    (function(control,j){control.addEventListener('input',function(){var v=Number(control.value);if(control.value.trim()===''||!Number.isFinite(v)||Math.abs(v)>4){get('error').textContent='Enter a finite number between −4 and 4.';return;}get('error').textContent='';A[Math.floor(j/2)][j%2]=v;refresh();});})(input,k);get('cells').appendChild(input);inputs.push(input);
  }
  inputPlot=K.plot(get('input'),{span:1.7,handles:function(){return [{v:probe(),set:function(v){if(Math.hypot(...v)>0){angle.value=String(Math.round((Math.atan2(v[1],v[0])*180/Math.PI+360)%360));refresh();}}}];},draw:function(p){
    p.grid();var circle=[];for(var i=0;i<100;i++)circle.push([Math.cos(i*Math.PI/50),Math.sin(i*Math.PI/50)]);p.poly(circle,null,K.css('--ink-3'));
    if(reveal.checked){var d=K.svd2(A);d.Vt.forEach(function(v,i){p.arrow(v,K.css(i?'--v':'--u'),i?'v₂':'v₁');});}p.arrow(probe(),K.css('--ink'),'x');p.dot(...probe(),K.css('--accent'),6);
  }});
  outputPlot=K.plot(get('output'),{span:6,handles:function(){return [0,1].map(function(j){return {v:[A[0][j],A[1][j]],set:function(v){A[0][j]=Math.max(-4,Math.min(4,v[0]));A[1][j]=Math.max(-4,Math.min(4,v[1]));refresh();}};});},draw:function(p){
    var d=K.svd2(A),B=K.truncate(d.U,d.s,d.Vt,1),previous,previousB;
    p.span=Math.max(1.6,1.3*d.s[0]);if(p.W&&p.H)p.unit=Math.min(p.W,p.H)/(2*p.span);p.grid();
    var unitCircle=[];for(var j=0;j<100;j++)unitCircle.push([Math.cos(j*Math.PI/50),Math.sin(j*Math.PI/50)]);p.poly(unitCircle,null,K.css('--ink-3'));
    for(var i=0;i<=160;i++){var t=i*Math.PI/80,v=[Math.cos(t),Math.sin(t)],w=mul(A,v),b=mul(B,v);if(previous){p.line(previous,w,K.css('--accent'));if(truncate.checked)p.line(previousB,b,K.css('--w'),[4,4],2);}previous=w;previousB=b;}
    if(reveal.checked)d.s.forEach(function(s,i){p.arrow(scale([d.U[0][i],d.U[1][i]],s),K.css(i?'--v':'--u'),null,{w:3});});
    [0,1].forEach(function(j){p.dot(A[0][j],A[1][j],K.css(j?'--v':'--u'),6);});
    p.arrow(mul(A,probe()),K.css('--ink'),'Ax');if(truncate.checked)p.arrow(mul(B,probe()),K.css('--w'),null,{dash:[4,4]});if(d.s[0]===0)p.dot(0,0,K.css('--accent'),6);
  }});
  var presets={shear:[[1,2],[0,1]],reflection:[[-3,0],[0,1]],rankone:[[1,2],[0,0]],thin:[[1,0],[0,1e-8]],isotropic:[[2,0],[0,2]],zero:[[0,0],[0,0]]};
  Object.keys(presets).forEach(function(name){get(name).onclick=function(){A=presets[name].map(function(row){return row.slice();});get('error').textContent='';refresh();};});
  angle.addEventListener('input',refresh);reveal.addEventListener('change',refresh);truncate.addEventListener('change',refresh);tolerance.addEventListener('change',refresh);
  [get('input'),get('output')].forEach(function(canvas){canvas.addEventListener('gu-theme',refresh);});refresh();
});
