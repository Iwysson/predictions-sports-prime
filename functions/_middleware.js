const LEGACY_HOSTNAME = "predictions-sports-prime.pages.dev";
const CANONICAL_ORIGIN = "https://predictions-sports-prime.com";

export function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  if (requestUrl.hostname !== LEGACY_HOSTNAME) {
    return context.next();
  }

  return Response.redirect(
    `${CANONICAL_ORIGIN}${requestUrl.pathname}${requestUrl.search}`,
    308,
  );
}
