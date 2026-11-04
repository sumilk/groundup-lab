from fractions import Fraction as F
import math
s=[F(1),F(1,10),F(1,10**4)]; c=[F(1),F(1,2),F(1,10)]
eta=[F(1,10**3),F(-1,10**3),F(-1,10**3)]
beta=[si*ci+ei for si,ci,ei in zip(s,c,eta)]
print("beta",[str(b) for b in beta],"beta/s",[str(b/si) for b,si in zip(beta,s)])
for k in (1,2,3):
    xc=[beta[i]/s[i] if i<k else F(0) for i in range(3)]
    e2=sum((xc[i]-c[i])**2 for i in range(3)); print("k",k,[str(v) for v in xc],"err^2",e2,"err %.5f"%math.sqrt(e2), "res^2", sum(beta[i]**2 for i in range(k,3)))
fs=[float(v) for v in s]; fb=[float(v) for v in beta]; fc=[float(v) for v in c]
res=lambda l: math.sqrt(sum((l/(a*a+l)*b)**2 for a,b in zip(fs,fb)))
xl=lambda l:[a/(a*a+l)*b for a,b in zip(fs,fb)]
err=lambda l: math.sqrt(sum((p-q)**2 for p,q in zip(xl(l),fc)))
delta=math.sqrt(3)*1e-3; tau=1.1; tgt=tau*delta; print("delta",delta,"target",tgt,"||b||",math.sqrt(sum(b*b for b in fb)))
lo,hi=1e-8,1e-1; print("bracket",res(lo),res(hi))
for i in range(4):
    mid=math.sqrt(lo*hi); r=res(mid); print(" step",i,"mid %.3e res %.4e"%(mid,r)); 
    if r<tgt: lo=mid
    else: hi=mid
for i in range(200):
    mid=math.sqrt(lo*hi)
    if res(mid)<tgt: lo=mid
    else: hi=mid
print("lam*",mid,"x",xl(mid),"err",err(mid))
best=min((err(10**(e/40)),10**(e/40)) for e in range(-480,0)); print("best",best)
for l in [1e-8,1e-6,1e-5,1e-4,3.3e-4,1e-3,1e-2]: print(" lam %g res %.3e err %.4f"%(l,res(l),err(l)))

# ---- larger L-curve problem in SVD coords
n=32
sig=[10**(-8*i/(n-1)) for i in range(n)]
cc=[sig[i]**0.5 for i in range(n)]   # true coeffs; Picard: beta=sigma^1.5
import random; rng=random.Random(10)
d=1e-4
noise=[rng.gauss(0,d/math.sqrt(n)) for _ in range(n)]
bb=[sig[i]*cc[i]+noise[i] for i in range(n)]
dn=math.sqrt(sum(v*v for v in noise))
R=lambda l: math.sqrt(sum((l/(a*a+l)*b)**2 for a,b in zip(sig,bb)))
X=lambda l: math.sqrt(sum((a/(a*a+l)*b)**2 for a,b in zip(sig,bb)))
E=lambda l: math.sqrt(sum((a/(a*a+l)*b-q)**2 for a,b,q in zip(sig,bb,cc)))
ls=[10**(e/10) for e in range(-180,1)]
pts=[(math.log10(R(l)),math.log10(X(l))) for l in ls]
# curvature of discrete curve
best_k=None
for i in range(2,len(ls)-2):
    (x0,y0),(x1,y1),(x2,y2)=pts[i-2],pts[i],pts[i+2]
    dx1,dy1=x1-x0,y1-y0; dx2,dy2=x2-x1,y2-y1
    k=(dx1*dy2-dy1*dx2)/(((dx1**2+dy1**2)*(dx2**2+dy2**2)*((x2-x0)**2+(y2-y0)**2))**0.5+1e-300)
    if best_k is None or k>best_k[0]: best_k=(k,ls[i])
print("noise norm",dn)
lc=best_k[1]; print("L-corner lam %.3e err %.4f res %.3e"%(lc,E(lc),R(lc)))
lo,hi=1e-18,1.0
for i in range(300):
    mid=math.sqrt(lo*hi)
    if R(mid)<1.1*dn: lo=mid
    else: hi=mid
print("discrepancy lam %.3e err %.4f"%(mid,E(mid)))
bo=min((E(l),l) for l in ls); print("oracle lam %.3e err %.4f"%(bo[1],bo[0]), "||c||",math.sqrt(sum(v*v for v in cc)))
tse=lambda k: math.sqrt(sum((((bb[i]/sig[i]) if i<k else 0)-cc[i])**2 for i in range(n)))
print("tsvd errs", [(k, round(tse(k),4)) for k in range(0,n+1,4)], "best k", min((tse(k),k) for k in range(n+1)))
# plateau check: where |beta| hits noise floor
print("index where sigma^1.5 < d/sqrt(n):", next(i for i in range(n) if sig[i]**1.5< d/math.sqrt(n)))
for l in [1e-16,1e-12,1e-10,1e-8,1e-6,1e-4,1e-2]: print(" L lam %g logR %.2f logX %.2f"%(l,math.log10(R(l)),math.log10(X(l))))
