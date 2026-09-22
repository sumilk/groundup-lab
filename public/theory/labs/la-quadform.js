/* A linked contour, directional meter, and constructive PD test. */
GU.lab("la-quadform", function(root) {
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">One matrix, three ways to read it</span><span class="lab-hint">predict · move the probe · reveal the axes</span></div>'+
    '<div class="lab-body"><div class="quadform-views"><div class="stage"><canvas data-landscape aria-label="Quadratic level sets and draggable unit probe"></canvas></div>'+
    '<p class="quadform-caption">Solid: q = +1 · dashed: q = −1 · dotted: q = 0.<br>Gray circle: unit inputs. Curves outside the window are clipped.</p>'+
    '<div class="stage quadform-trace"><canvas data-trace aria-label="Rayleigh quotient by probe angle, from 0 to 360 degrees"></canvas></div>'+
    '<p class="quadform-caption">Horizontal: probe angle 0° to 360°. Vertical: R, from −4 to 4.<br>The moving dot links this trace to the unit probe above.</p></div>'+
    '<div class="panel"><div class="btnrow"><button data-bowl>Bowl</button><button data-flat>Flat valley</button><button data-saddle>Saddle</button><button data-isotropic>Isotropic</button><button data-negative>Negative bowl</button><button data-zero>Zero</button></div>'+
    '<label>Eigenvalue λ₁ <input data-first type="range" min="-4" max="4" step="0.05" value="1"></label>'+
    '<label>Eigenvalue λ₂ <input data-second type="range" min="-4" max="4" step="0.05" value="3"></label>'+
    '<label>Axis angle θ <input data-axis type="range" min="0" max="180" step="1" value="30"></label>'+
    '<label>Probe angle φ <input data-probe type="range" min="0" max="360" step="1" value="75"></label>'+
    '<label><input data-reveal type="checkbox"> Reveal principal axes</label>'+
    '<div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div>'+
    '<details><summary>Read the Cholesky test</summary><p data-pivots></p><p>Computed pivots use the displayed matrix before rounding. Geometry uses the controlled eigenvalues. At a zero boundary, roundoff is not an exact definiteness test.</p></details></div></div>';
  var get=function(n){return root.querySelector('[data-'+n+']');};
  var first=get('first'),second=get('second'),axis=get('axis'),probe=get('probe'),reveal=get('reveal'),landscape,trace;
  first.value='1';second.value='3';axis.value='30';probe.value='75';reveal.checked=false;
  function radians(x){return Number(x)*Math.PI/180;}
  function state(){
    var l=Number(first.value),m=Number(second.value),t=radians(axis.value),v=radians(probe.value),c=Math.cos(t),s=Math.sin(t),d=v-t;
    var a=l*c*c+m*s*s,b=(l-m)*c*s,e=l*s*s+m*c*c;
    return {l:l,m:m,c:c,s:s,a:a,b:b,e:e,r:l*Math.cos(d)**2+m*Math.sin(d)**2,
      residual:Math.abs((m-l)*Math.sin(d)*Math.cos(d)),v:[Math.cos(v),Math.sin(v)]};
  }
  function rotate(x,y,s){return [s.c*x-s.s*y,s.s*x+s.c*y];}
  function fmt(x){return x!==0&&Math.abs(x)<1e-4?x.toExponential(2):K.f(x,3);}
  function refresh(){
    var s=state(),kind,meaning;
    if(s.l===0&&s.m===0){kind='Zero form';meaning='The zero set is the entire plane. Both +1 and −1 level sets are empty. Every direction is an eigenvector.';}
    else if(s.l*s.m<0){kind='Indefinite';meaning='Hyperbolas at nonzero levels. The zero set is two crossing lines, but the null space is only the origin. A zero reading can conceal a nonzero image.';}
    else if(s.l>0&&s.m>0){kind='Positive definite';meaning='The +1 level is an ellipse; the −1 level is empty. Its long radius follows the smaller eigenvalue. Zero set: origin only.';}
    else if(s.l<0&&s.m<0){kind='Negative definite';meaning='The −1 level is an ellipse; the +1 level is empty. Zero set: origin only.';}
    else {kind=s.l+s.m>0?'Positive semidefinite, singular':'Negative semidefinite, singular';meaning='A flat axis is the null space and the zero set. The nonempty nonzero level is two parallel lines; the opposite-sign level is empty.';}
    if(s.l===s.m&&s.l!==0)meaning+=' Equal eigenvalues: every direction is an eigenvector; no unique preferred axes.';
    get('out').innerHTML='λ₁ = '+fmt(s.l)+' · λ₂ = '+fmt(s.m)+'<br>θ = '+axis.value+'° · φ = '+K.f(Number(probe.value),0)+'°<br>A = [ '+fmt(s.a)+', '+fmt(s.b)+' ; '+fmt(s.b)+', '+fmt(s.e)+' ]<br>R = '+fmt(s.r)+' · residual norm = '+fmt(s.residual)+'<br>Rayleigh bounds: ['+fmt(Math.min(s.l,s.m))+', '+fmt(Math.max(s.l,s.m))+']';
    get('verdict').textContent=kind+'. '+meaning;
    var secondPivot=s.a>0?s.e-s.b*s.b/s.a:null;
    get('pivots').textContent='First pivot = '+fmt(s.a)+'. '+(secondPivot===null?'Stop: first pivot is not positive.':'Second pivot = '+fmt(secondPivot)+'. '+(secondPivot>0?'Both computed pivots are positive.':'Stop: second pivot is not positive.'));
    if(landscape)landscape.render();if(trace)trace.render();
  }
  // Parameterize each conic directly, including the exact zero-eigenvalue cases.
  function contour(p,s,level){
    var l=s.l,m=s.m,color=K.css(level>0?'--u':'--v'),dash=level>0?[]:[6,4];
    function segment(x,y){p.line(rotate(x[0],x[1],s),rotate(y[0],y[1],s),color,dash,2);}
    if(l===0&&m===0)return;
    if(l===0||m===0){var value=l||m;if(level/value<=0)return;var r=Math.sqrt(level/value);
      [-1,1].forEach(function(sign){if(l===0)segment([-8,sign*r],[8,sign*r]);else segment([sign*r,-8],[sign*r,8]);});return;}
    if(l*m>0){if(level/l<0)return;var a=Math.sqrt(level/l),b=Math.sqrt(level/m),previous=[a,0];
      for(var i=1;i<=240;i++){var t=i*2*Math.PI/240,next=[a*Math.cos(t),b*Math.sin(t)];segment(previous,next);previous=next;}return;}
    var alongFirst=level/l>0,a=Math.sqrt(Math.abs(level/l)),b=Math.sqrt(Math.abs(level/m));
    [-1,1].forEach(function(sign){var previous;
      for(var i=0;i<=240;i++){var t=-4+8*i/240,next=alongFirst?[sign*a*Math.cosh(t),b*Math.sinh(t)]:[a*Math.sinh(t),sign*b*Math.cosh(t)];
        if(previous)segment(previous,next);previous=next;}
    });
  }
  landscape=K.plot(get('landscape'),{span:3.2,handles:function(){return [{v:state().v,set:function(v){if(Math.hypot(...v)>0){probe.value=String(Math.round((Math.atan2(v[1],v[0])*180/Math.PI+360)%360));refresh();}}}];},draw:function(p){
    var s=state();p.grid();contour(p,s,1);contour(p,s,-1);
    function zeroLine(v){var n=Math.hypot(...v);p.line(rotate(-8*v[0]/n,-8*v[1]/n,s),rotate(8*v[0]/n,8*v[1]/n,s),K.css('--w'),[2,5]);}
    if(s.l*s.m<0){zeroLine([Math.sqrt(Math.abs(s.m)),Math.sqrt(Math.abs(s.l))]);zeroLine([Math.sqrt(Math.abs(s.m)),-Math.sqrt(Math.abs(s.l))]);}
    else if(s.l===0&&s.m!==0)zeroLine([1,0]);else if(s.m===0&&s.l!==0)zeroLine([0,1]);
    else if(s.l!==0&&s.m!==0)p.dot(0,0,K.css('--w'),3);
    var circle=[];for(var i=0;i<120;i++)circle.push([Math.cos(i*Math.PI/60),Math.sin(i*Math.PI/60)]);
    p.poly(circle,null,K.css('--ink-3'));
    if(reveal.checked){p.arrow(rotate(2.2,0,s),K.css('--u'),'q₁',{dash:[4,3]});p.arrow(rotate(0,2.2,s),K.css('--v'),'q₂',{dash:[4,3]});}
    p.arrow(s.v,K.css('--ink'),'x');p.dot(s.v[0],s.v[1],K.css('--accent'),7);
  }});
  trace=K.plot(get('trace'),{span:4.8,handles:function(){return [];},draw:function(p){
    var s=state(),previous;
    p.line([-3.8,0],[3.8,0],K.css('--axis'));p.line([-3.6,-4.2],[-3.6,4.2],K.css('--axis'));
    [-4,-2,0,2,4].forEach(function(v){p.line([-3.6,v],[3.6,v],K.css('--grid'),[2,4]);});
    for(var i=0;i<=360;i++){var d=radians(i)-radians(axis.value),next=[(i-180)/50,s.l*Math.cos(d)**2+s.m*Math.sin(d)**2];
      if(previous)p.line(previous,next,K.css('--accent'),[],2);previous=next;}
    p.dot((Number(probe.value)-180)/50,s.r,K.css('--ink'),6);
    if(p.ctx){var c=p.ctx;c.save();c.fillStyle=K.css('--ink-2');c.font='11px sans-serif';c.textAlign='center';
      [0,90,180,270,360].forEach(function(v){c.fillText(v+'°',p.x2p((v-180)/50),p.y2p(-4.5));});
      c.textAlign='right';[-4,-2,0,2,4].forEach(function(v){c.fillText(String(v),p.x2p(-3.8),p.y2p(v)+4);});c.restore();}
  }});
  var presets={bowl:[1,3],flat:[1,0],saddle:[1,-1],isotropic:[2,2],negative:[-1,-3],zero:[0,0]};
  Object.keys(presets).forEach(function(name){get(name).onclick=function(){first.value=String(presets[name][0]);second.value=String(presets[name][1]);axis.value='30';probe.value='75';reveal.checked=false;refresh();};});
  [first,second,axis,probe].forEach(function(control){control.addEventListener('input',refresh);});reveal.addEventListener('change',refresh);
  [get('landscape'),get('trace')].forEach(function(canvas){canvas.addEventListener('gu-theme',refresh);});refresh();
});
