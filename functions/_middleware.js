const LEGACY_HOSTNAME = "predictions-sports-prime.pages.dev";
const CANONICAL_ORIGIN = "https://predictions-sports-prime.com";

// The pt-br hubs (home, leagues, NFL) are retired and permanently redirect to their English
// equivalents. Only the frozen historical /pt-br/match/<slug>/ pages are still served.
function ptBrHubRedirect(pathname) {
  if (pathname === "/pt-br" || pathname === "/pt-br/") return "/";
  const league = pathname.match(/^\/pt-br\/league\/([^/]+)\/?$/);
  if (league) return `/league/${league[1]}/`;
  if (/^\/pt-br\/nfl\/?$/.test(pathname)) return "/nfl/";
  return null;
}

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  if (requestUrl.hostname === LEGACY_HOSTNAME) {
    return Response.redirect(
      `${CANONICAL_ORIGIN}${requestUrl.pathname}${requestUrl.search}`,
      308,
    );
  }

  const ptBrRedirect = ptBrHubRedirect(requestUrl.pathname);
  if (ptBrRedirect) {
    return Response.redirect(`${requestUrl.origin}${ptBrRedirect}${requestUrl.search}`, 301);
  }

  const response = await context.next();
  const headers = new Headers(response.headers);

  if (requestUrl.pathname.startsWith("/_next/static/")) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(requestUrl.pathname)) {
    headers.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
