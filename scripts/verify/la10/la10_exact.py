from fractions import Fraction as F
def mm(A,B): return [[sum(A[i][k]*B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]
def T(A): return [list(r) for r in zip(*A)]
def mv(A,x): return [sum(a*b for a,b in zip(r,x)) for r in A]
def inv2(M):
    a,b=M[0];c,d=M[1];det=a*d-b*c; return [[d/det,-b/det],[-c/det,a/det]]
def show(n,M): print(n, [[str(x) for x in r] for r in M] if isinstance(M[0],list) else [str(x) for x in M])
# E2
A=[[F(1),F(0),F(1)],[F(0),F(1),F(1)]]; b=[F(2),F(3)]
x=mv(T(A),mv(inv2(mm(A,T(A))),b)); show("E2 x",x); show("E2 Ax",mv(A,x)); print("norm2",sum(v*v for v in x))
# E4 from factors
U=[[F(v,3) for v in r] for r in [[1,2,2],[2,1,-2],[2,-2,1]]]
V=[[F(v,3) for v in r] for r in [[2,-1,2],[2,2,-1],[-1,2,2]]]
show("UtU",mm(T(U),U)); show("VtV",mm(T(V),V))
S=[[F(6),0,0],[0,F(3),0],[0,0,F(0)]]
A=mm(mm(U,S),T(V)); show("E4 A",A)
Sp=[[F(1,6),0,0],[0,F(1,3),0],[0,0,F(0)]]
Ap=mm(mm(V,Sp),T(U)); show("A+",Ap)
for name,M,N in [("AA+A=A",mm(mm(A,Ap),A),A),("A+AA+=A+",mm(mm(Ap,A),Ap),Ap)]: print(name, M==N)
P=mm(A,Ap); print("AA+ sym", P==T(P)); show("AA+",P); Q=mm(Ap,A); print("A+A sym",Q==T(Q)); show("A+A",Q)
b=[F(1),F(1),F(1)]; x=mv(Ap,b); show("x=A+b",x); show("res",[bi-ai for bi,ai in zip(b,mv(A,x))])
# ridge on near-collinear data, exact
X=[[F(1),F(1)],[F(2),F(201,100)],[F(3),F(299,100)]]; y=[F(2),F(405,100),F(595,100)]
G=mm(T(X),X); g=mv(T(X),y)
for lam in [F(0),F(1,100),F(1,10)]:
    w=mv(inv2([[G[0][0]+lam,G[0][1]],[G[1][0],G[1][1]+lam]]),g); print("lam",lam,"w",[float(v) for v in w],"pred",[float(v) for v in mv(X,w)])
y2=[F(2),F(406,100),F(594,100)]; g2=mv(T(X),y2)
for lam in [F(0),F(1,100)]:
    w=mv(inv2([[G[0][0]+lam,G[0][1]],[G[1][0],G[1][1]+lam]]),g2); print("pert lam",lam,"w",[float(v) for v in w],"pred",[float(v) for v in mv(X,w)])
import math
tr=G[0][0]+G[1][1]; det=G[0][0]*G[1][1]-G[0][1]**2
l1=(tr+math.sqrt(tr*tr-4*det))/2; l2=(tr-math.sqrt(tr*tr-4*det))/2; print("sigmas",math.sqrt(l1),math.sqrt(l2),"kappa",math.sqrt(l1/l2))
# GD implicit bias floats
A=[[1,0,1],[0,1,1.]]; b=[2,3.]
def gd(x,eta=0.3,n=3000):
    for _ in range(n):
        r=[sum(a*v for a,v in zip(row,x))-bb for row,bb in zip(A,b)]
        g=[sum(A[i][j]*r[i] for i in range(2)) for j in range(3)]
        x=[v-eta*gg for v,gg in zip(x,g)]
    return x
print("GD0",gd([0,0,0.])); print("GD111",gd([1,1,1.]))
# kernel of A: (1,1,-1)/sqrt3 ; P_ker (1,1,1) = ((1+1-1)/3)(1,1,-1)
print("pred", [1/3+1/3,4/3+1/3,5/3-1/3])
# lambda->0 limit of rank-deficient duplicate cols
A=[[F(1),F(1)],[F(2),F(2)]]; yv=[F(1),F(0)]; G=mm(T(A),A); g=mv(T(A),yv)
for lam in [F(1),F(1,100),F(1,10**6)]:
    w=mv(inv2([[G[0][0]+lam,G[0][1]],[G[1][0],G[1][1]+lam]]),g); print("dup lam",lam,[str(v) for v in w])
