/* The same least-squares problem in the data plot and in observation space. */
GU.lab("la-lsq", function (root) {
  var K = GU.labkit, f = K.f;
  root.innerHTML = '<div class="lab-head"><span class="lab-title">One fit, two spaces</span><span class="lab-hint">drag observations on the left · rotate the camera on the right</span></div>' +
    '<div class="lsq-views"><div><div class="lab-view-caption">Data plot: input t and observed height y</div><div class="stage"><canvas data-data></canvas></div></div>' +
    '<div><div class="lab-view-caption">Observation space: three heights form one vector</div><div class="stage"><canvas data-observation></canvas></div></div></div>' +
    '<div class="panel"><label class="togg"><input type="checkbox" data-reveal> reveal fitted values and residual</label>' +
    '<div class="readout" data-out></div><div class="verdict" data-verdict></div>' +
    '<div class="btnrow"><button type="button" data-reset>worked example</button><button type="button" data-exact>exact fit</button><button type="button" data-outlier>large residual</button><button type="button" data-equal>equal inputs</button></div></div>';
  var q = function (name) { return root.querySelector('[data-' + name + ']'); };
  var show = q('reveal'), out = q('out'), verdict = q('verdict');
  var points = [[0,1],[1,2],[2,2]], right;
  function fmt(v) {return '('+v.map(function (x) {return f(x,3);}).join(', ')+')';}
  function fit() {
    var t = points.map(function (p) {return p[0];}), y = points.map(function (p) {return p[1];});
    var tm=(t[0]+t[1]+t[2])/3, ym=(y[0]+y[1]+y[2])/3;
    var variance=t.reduce(function (sum,z) {return sum+(z-tm)**2;},0);
    var covariance=t.reduce(function (sum,z,i) {return sum+(z-tm)*(y[i]-ym);},0);
    var slope=variance===0?0:covariance/variance;
    var values=t.map(function (z) {return ym+slope*(z-tm);});
    var residual=y.map(function (z,i) {return z-values[i];});
    return {t:t,y:y,values:values,residual:residual,slope:slope,intercept:ym-slope*tm,rank:variance===0?1:2,
      error:residual.reduce(function (sum,z) {return sum+z*z;},0), variance:variance};
  }
  var left=K.plot(q('data'),{
    span:3.8,
    handles:function () {return points.map(function (p,i) {return {v:p,set:function (v) {points[i]=v;}};});},
    onchange:function () {if(right)right.render();},
    draw:function (p) {
      var result=fit();p.grid();
      if(show.checked)p.line([-3.8,result.intercept-3.8*result.slope],[3.8,result.intercept+3.8*result.slope],K.css('--accent'),null,2);
      points.forEach(function (v,i) {
        if(show.checked){p.line(v,[v[0],result.values[i]],K.css('--warn'),[4,3],2);p.dot(v[0],result.values[i],K.css('--accent'),4);}
        p.dot(v[0],v[1],K.css('--w'),6);
      });
      out.innerHTML='t = '+fmt(result.t)+'<br>y = '+fmt(result.y);
      if(show.checked)out.innerHTML+='<br>(intercept, slope) = '+fmt([result.intercept,result.slope])+'<br>ŷ = '+fmt(result.values)+'<br>r = '+fmt(result.residual)+'<br>‖r‖² = '+f(result.error,5)+'<br>Σrᵢ = '+f(result.residual.reduce(function (a,b) {return a+b;},0),6)+'<br>Σtᵢrᵢ = '+f(result.t.reduce(function (sum,t,i) {return sum+t*result.residual[i];},0),6);
      verdict.className='verdict';
      verdict.textContent = !show.checked ? 'Predict the fitted heights. Which space should contain a right angle? Will the residual heights sum to zero?' :
        result.rank===1 ? 'Equal inputs: the design spans a line in observation space. Fitted heights are unique; intercept and slope are not. The horizontal line shown is one representative (slope zero).' :
        'The left segments are vertical errors. On the right, r is perpendicular to the plane spanned by the constant vector and t. Camera angles can hide that orthogonality; the two zero sums certify it.';
      if(show.checked && result.variance>0 && result.variance<.01)verdict.textContent+=' Nearly equal inputs: slope can be highly sensitive.';
    }
  });
  right=K.plot3(q('observation'),{
    span:4.2,azimuth:0.9,elevation:-0.5,handles:function () {return [];},
    draw:function (p) {
      var r=fit();p.axes();
      if(show.checked){
        if(r.rank===2){
          var constant=[1,1,1];
          p.poly([[0,0,0],constant.map(function (z) {return 2*z;}),r.t.map(function (z) {return 2+z;}),r.t],K.mix(K.css('--accent'),12),K.css('--accent'));
        } else p.line([-4,-4,-4],[4,4,4],K.css('--accent'),null,2);
        p.arrow(r.values,K.css('--accent'),'ŷ');
        p.line(r.values,r.y,K.css('--warn'),[5,3],2.5);
        p.arrow(r.residual,K.css('--warn'),'r');
      }
      p.arrow(r.y,K.css('--w'),'y');p.dot(r.y,K.css('--w'),6,'diamond');
    }
  });
  function render(){left.render();right.render();}
  show.addEventListener('input',render);
  q('reset').onclick=function () {points=[[0,1],[1,2],[2,2]];render();};
  q('exact').onclick=function () {points=[[-1,0],[0,1],[1,2]];show.checked=true;render();};
  q('outlier').onclick=function () {points=[[-1,2],[0,-1],[1,2]];show.checked=true;render();};
  q('equal').onclick=function () {points=[[1,1],[1,2],[1,2]];show.checked=true;render();};
  q('data').addEventListener('gu-theme',left.render);
});
