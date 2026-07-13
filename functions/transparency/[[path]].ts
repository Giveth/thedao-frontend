// Reverse proxy: serves the TDSF public transparency page (its own Pages
// project, deployed from GeneralMagicio/tdsf-transparency) under
// thedao.fund/transparency. The page uses only relative paths, so it is
// subpath-safe as long as it is served under a trailing slash.

const DEFAULT_UPSTREAM = "https://tdsf-transparency.pages.dev";

interface Env {
  // Optional override, set in the Cloudflare dashboard if the upstream moves.
  TRANSPARENCY_UPSTREAM?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);

  // Relative asset paths (data.json, snapshots/…) resolve against the
  // directory, so /transparency must redirect to /transparency/.
  if (url.pathname === "/transparency") {
    return Response.redirect(`${url.origin}/transparency/${url.search}`, 301);
  }

  const upstream = new URL(
    context.env.TRANSPARENCY_UPSTREAM || DEFAULT_UPSTREAM,
  );
  upstream.pathname = url.pathname.slice("/transparency".length) || "/";
  upstream.search = url.search;

  const response = await fetch(upstream.toString(), {
    method: context.request.method,
    headers: context.request.headers,
    redirect: "manual",
  });

  // Keep any upstream redirects (e.g. /index.html → /) under the prefix.
  const location = response.headers.get("Location");
  if (location) {
    const target = new URL(location, upstream);
    const headers = new Headers(response.headers);
    headers.set("Location", `/transparency${target.pathname}${target.search}`);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  return response;
};
