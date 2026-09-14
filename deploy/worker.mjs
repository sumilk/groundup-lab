// Optional private theory-reader host. Does not migrate the existing Sites app.
async function secureEqual(a,b) {
  const encoder=new TextEncoder();
  const [left,right]=await Promise.all([a,b].map(x=>crypto.subtle.digest("SHA-256",encoder.encode(x))));
  const l=new Uint8Array(left),r=new Uint8Array(right);let diff=0;
  for(let i=0;i<l.length;i++)diff|=l[i]^r[i];
  return diff===0;
}
export default {
  async fetch(request,env) {
    if(!env.READER_USERNAME||!env.READER_PASSWORD)return new Response("Reader credentials not configured",{status:503});
    let username="",password="";
    const header=request.headers.get("authorization")||"";
    try{
      if(header.startsWith("Basic ")){
        const decoded=new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)),c=>c.charCodeAt(0)));
        const split=decoded.indexOf(":");
        if(split>=0){username=decoded.slice(0,split);password=decoded.slice(split+1);}
      }
    }catch{}
    const [userOK,passwordOK]=await Promise.all([secureEqual(username,env.READER_USERNAME),secureEqual(password,env.READER_PASSWORD)]);
    if(!userOK||!passwordOK)return new Response("Sign in to GroundUp Lab",{
      status:401,headers:{"WWW-Authenticate":'Basic realm="GroundUp Lab", charset="UTF-8"',"Cache-Control":"no-store"}
    });
    const url=new URL(request.url);
    if(url.pathname==="/")return Response.redirect(new URL("/theory/index.html",url),302);
    const response=await env.ASSETS.fetch(request);
    const headers=new Headers(response.headers);
    headers.set("Cache-Control","private, no-store");
    headers.set("X-Content-Type-Options","nosniff");
    headers.set("Referrer-Policy","no-referrer");
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
  }
};
