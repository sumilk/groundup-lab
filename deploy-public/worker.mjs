// Public static educational reader only. No tutor API or private repository access.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") return Response.redirect(new URL("/theory/index.html", url), 302);
    if (!url.pathname.startsWith("/theory/")) return new Response("Not found", { status: 404 });
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return new Response(response.body, {status:response.status,statusText:response.statusText,headers});
  }
};
