/* Small 2x2 teaching decomposition; no exact-rank claim for rounded inputs. */
(function(){
  var K=GU.labkit;
  K.svd2=function(A){
    var scale=Math.max(...A.flat().map(Math.abs));
    if(scale===0)return {U:[[1,0],[0,1]],s:[0,0],Vt:[[1,0],[0,1]]};
    var a=A[0][0]/scale,b=A[0][1]/scale,c=A[1][0]/scale,d=A[1][1]/scale;
    var g=a*a+c*c,h=a*b+c*d,j=b*b+d*d;
    var t=(h===0&&g===j)?0:Math.atan2(2*h,g-j)/2,co=Math.cos(t),si=Math.sin(t);
    var z=[a*co+b*si,c*co+d*si],s1=Math.hypot(...z),det=a*d-b*c;
    var u=z.map(function(v){return v/s1;}),sign=det<0?-1:1;
    var result={U:[[u[0],-sign*u[1]],[u[1],sign*u[0]]],s:[s1*scale,Math.abs(det)/s1*scale],Vt:[[co,si],[-si,co]]};
    if(result.s[1]>result.s[0]){result.s.reverse();result.Vt.reverse();result.U.forEach(function(row){row.reverse();});}
    return result;
  };
  K.truncate=function(U,s,Vt,k){return U.map(function(row){return Vt[0].map(function(_,j){var v=0;for(var i=0;i<k;i++)v+=row[i]*s[i]*Vt[i][j];return v;});});};
})();
