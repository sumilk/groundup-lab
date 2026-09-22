GU.lab("la-pca",function(root){
  var K=GU.labkit;
  root.innerHTML='<div class="lab-head"><span class="lab-title">Find the line that loses the least</span><span class="lab-hint">drag observations · compare a candidate · reveal the optimum</span></div>'+
    '<div class="lab-body"><div><div class="stage"><canvas data-cloud aria-label="Draggable observations, candidate projections, and fitted PCA line"></canvas></div><p class="lab-caption">Dots: observations. Cross: mean. Solid line: your candidate. Dashed line: optimal line when revealed. Segments: orthogonal residuals to your candidate.</p>'+
    '<div class="chart-stage"><canvas data-errorcurve aria-label="Reconstruction error by candidate line angle"></canvas></div></div>'+
    '<div class="panel"><div class="btnrow"><button data-offset>Offset cloud</button><button data-line>Line</button><button data-isotropic>Isotropic</button><button data-identical>Identical points</button></div>'+
    '<label><input data-center type="checkbox" checked> Center before fitting</label><label>Candidate angle <input data-angle type="range" min="0" max="180" step="1" value="0"></label><label><input data-reveal type="checkbox"> Reveal the optimal line</label>'+
    '<details><summary>Edit observations (x, y)</summary><div data-cells class="svd-cells"></div><p data-error role="status"></p></details><div class="readout" data-out aria-live="polite"></div><div class="verdict" data-verdict></div></div></div>';
  var get=function(name){return root.querySelector('[data-'+name+']');},center=get('center'),angle=get('angle'),reveal=get('reveal'),plot,chart,inputs=[];
  var points=[[2.8,-2],[3.2,-1],[2.9,-.4],[3.1,.4],[2.8,1],[3.2,2]];center.checked=true;angle.value='0';reveal.checked=false;
  function state(){
    var mean=[0,0];points.forEach(function(v){mean[0]+=v[0]-points[0][0];mean[1]+=v[1]-points[0][1];});
    mean=mean.map(function(v,i){return points[0][i]+v/points.length;});
    var origin=center.checked?mean:[0,0],rows=points.map(function(v){return [v[0]-origin[0],v[1]-origin[1]];});
    var a=0,b=0,d=0;rows.forEach(function(v){a+=v[0]*v[0];b+=v[0]*v[1];d+=v[1]*v[1];});
    var theta=(b===0&&a===d)?0:Math.atan2(2*b,a-d)/2,v=[Math.cos(theta),Math.sin(theta)],w=[-v[1],v[0]];
    // Sum squared projected coordinates, avoiding subtracting nearly equal eigenvalues.
    var top=0,bottom=0;rows.forEach(function(x){top+=(x[0]*v[0]+x[1]*v[1])**2;bottom+=(x[0]*w[0]+x[1]*w[1])**2;});
    var t=Number(angle.value)*Math.PI/180,q=[Math.cos(t),Math.sin(t)];
    function error(deg){var t=deg*Math.PI/180,n=[-Math.sin(t),Math.cos(t)];return rows.reduce(function(sum,x){return sum+(x[0]*n[0]+x[1]*n[1])**2;},0);}
    return {mean:mean,origin:origin,rows:rows,top:top,bottom:bottom,v:v,q:q,total:a+d,error:error};
  }
  function refresh(){
    inputs.forEach(function(input,k){if(document.activeElement!==input)input.value=String(points[Math.floor(k/2)][k%2]);});
    var s=state(),fraction=s.total?s.top/s.total:null;
    get('out').innerHTML='mean = ('+s.mean.map(function(v){return K.f(v,3);}).join(', ')+')<br>candidate error² = '+K.f(s.error(Number(angle.value)),4)+'<br>optimal error² = '+K.f(s.bottom,4)+'<br>excess error² = '+K.f(Math.max(0,s.error(Number(angle.value))-s.bottom),4)+'<br>'+(center.checked?'sample covariance eigenvalues':'raw second-moment eigenvalues')+' = ('+[s.top,s.bottom].map(function(v){return K.f(v/(center.checked?points.length-1:points.length),4);}).join(', ')+')<br>'+(center.checked?'leading explained variance':'leading raw energy fraction')+' = '+(fraction===null?'undefined (zero total)':K.f(100*fraction,2)+'%');
    get('verdict').textContent=s.total===0?'No variation about the fitted origin: every candidate line is exact, and fractions are undefined. No unique principal direction.':Math.abs(s.top-s.bottom)<=1e-12*s.total?'Isotropic second moments: every line through the fitted origin has the same error. The displayed optimal axis is one choice.':center.checked?'Centered PCA fits an affine line through the mean. Scores are coordinates along a feature direction; residuals are perpendicular to it.':'Centering is off: fitting a line through the origin to raw data. These energy fractions are not centered explained variance.';
    if(plot)plot.render();if(chart)chart.render();
  }
  for(var k=0;k<12;k++){
    var input=document.createElement('input');input.type='number';input.step='any';input.setAttribute('aria-label','Observation '+(Math.floor(k/2)+1)+' coordinate '+(k%2===0?'x':'y'));
    (function(control,j){control.addEventListener('input',function(){var value=Number(control.value);if(control.value.trim()===''||!Number.isFinite(value)||Math.abs(value)>4){get('error').textContent='Enter a finite coordinate between −4 and 4.';return;}get('error').textContent='';points[Math.floor(j/2)][j%2]=value;refresh();});})(input,k);get('cells').appendChild(input);inputs.push(input);
  }
  plot=K.plot(get('cloud'),{span:5,handles:function(){return points.map(function(v,i){return {v:v,set:function(p){points[i]=p.map(function(x){return Math.max(-4,Math.min(4,x));});refresh();}};});},draw:function(p){
    p.grid();var s=state();function line(v,color,dash){p.line([s.origin[0]-10*v[0],s.origin[1]-10*v[1]],[s.origin[0]+10*v[0],s.origin[1]+10*v[1]],color,dash,2);}
    line(s.q,K.css('--u'));if(reveal.checked)line(s.v,K.css('--v'),[5,4]);
    points.forEach(function(v,i){var c=s.rows[i][0]*s.q[0]+s.rows[i][1]*s.q[1],projection=[s.origin[0]+c*s.q[0],s.origin[1]+c*s.q[1]];p.line(v,projection,K.css('--ink-3'),[2,3]);p.dot(...projection,K.css('--u'),3);p.dot(...v,K.css('--accent'),6);});
    var m=s.mean;p.line([m[0]-.12,m[1]-.12],[m[0]+.12,m[1]+.12],K.css('--ink'),[],3);p.line([m[0]-.12,m[1]+.12],[m[0]+.12,m[1]-.12],K.css('--ink'),[],3);
  }});
  chart=K.chart(get('errorcurve'),function(){var s=state();return {x:[0,180],y:[0,Math.max(1,s.total*1.05)],xLabel:'candidate angle (degrees)',yLabel:'squared reconstruction error',series:[{points:Array.from({length:181},function(_,i){return [i,s.error(i)];})}],dots:[[Number(angle.value),s.error(Number(angle.value))]]};});
  var presets={offset:[[2.8,-2],[3.2,-1],[2.9,-.4],[3.1,.4],[2.8,1],[3.2,2]],line:[[-2,-1],[-1,-.5],[0,0],[1,.5],[2,1],[3,1.5]],isotropic:[[1,0],[-1,0],[0,1],[0,-1],[0,0],[0,0]],identical:[[2,1],[2,1],[2,1],[2,1],[2,1],[2,1]]};
  Object.keys(presets).forEach(function(name){get(name).onclick=function(){points=presets[name].map(function(p){return p.slice();});get('error').textContent='';refresh();};});center.addEventListener('change',refresh);angle.addEventListener('input',refresh);reveal.addEventListener('change',refresh);get('cloud').addEventListener('gu-theme',refresh);refresh();
});
