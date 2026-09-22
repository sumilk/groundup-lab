/* Shared line/scatter chart with independent axis scales and optional log y. */
(function(){
  var K=GU.labkit;
  K.chart=function(canvas,specification){
    var ctx=canvas.getContext('2d');
    function render(){
      var spec=specification(),rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),dpr=Math.min(window.devicePixelRatio||1,2);
      canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      var left=48,right=w-18,top=20,bottom=h-42;
      var transform=spec.logY?Math.log10:function(x){return x;};
      var y0=transform(spec.y[0]),y1=transform(spec.y[1]);
      function x(v){return left+(v-spec.x[0])/(spec.x[1]-spec.x[0])*(right-left);}
      function y(v){return bottom-(transform(v)-y0)/(y1-y0)*(bottom-top);}
      ctx.font='11px sans-serif';ctx.lineWidth=1;
      for(var i=0;i<=4;i++){
        var yy=bottom-i*(bottom-top)/4;
        var yv=spec.logY?10**(y0+i*(y1-y0)/4):spec.y[0]+i*(spec.y[1]-spec.y[0])/4;
        ctx.strokeStyle=K.css('--grid');ctx.beginPath();ctx.moveTo(left,yy);ctx.lineTo(right,yy);ctx.stroke();
        ctx.fillStyle=K.css('--ink-2');ctx.textAlign='right';ctx.fillText(Number(yv.toPrecision(3)).toString(),left-7,yy+4);

      }
      ctx.textAlign='center';(spec.xTicks||Array.from({length:5},function(_,i){return spec.x[0]+i*(spec.x[1]-spec.x[0])/4;})).forEach(function(v){ctx.fillText(Number(v.toPrecision(3)).toString(),x(v),bottom+17);});
      ctx.strokeStyle=K.css('--axis');ctx.beginPath();ctx.moveTo(left,top);ctx.lineTo(left,bottom);ctx.lineTo(right,bottom);ctx.stroke();
      ctx.fillStyle=K.css('--ink-2');ctx.textAlign='center';ctx.fillText(spec.xLabel||'',(left+right)/2,h-5);ctx.textAlign='left';ctx.fillText(spec.yLabel||'',left,12);
      ctx.save();ctx.beginPath();ctx.rect(left,top,right-left,bottom-top);ctx.clip();
      (spec.series||[]).forEach(function(series){
        ctx.strokeStyle=series.color||K.css('--accent');ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2;ctx.beginPath();var started=false;
        series.points.forEach(function(point){if(!point.every(Number.isFinite)||(spec.logY&&point[1]<=0)){started=false;return;}
          if(series.scatter){ctx.moveTo(x(point[0])+3,y(point[1]));ctx.arc(x(point[0]),y(point[1]),3,0,Math.PI*2);}
          else {if(started)ctx.lineTo(x(point[0]),y(point[1]));else ctx.moveTo(x(point[0]),y(point[1]));started=true;}
        });if(series.scatter)ctx.fill();else ctx.stroke();
      });
      (spec.dots||[]).forEach(function(point){if(!point.every(Number.isFinite)||(spec.logY&&point[1]<=0))return;ctx.fillStyle=K.css('--ink');ctx.beginPath();ctx.arc(x(point[0]),y(point[1]),5,0,Math.PI*2);ctx.fill();});ctx.restore();
    }
    canvas.addEventListener('gu-theme',render);window.addEventListener('resize',render);
    if(window.ResizeObserver)new ResizeObserver(render).observe(canvas);
    render();return {render:render};
  };
})();
