// Shared response helper for functions/api/mobile/*. All data these endpoints serve is
// already public on the website (no protected text). Today/Tomorrow/Upcoming bucketing
// and the free/vip split are computed at BUILD time (scripts/build-mobile-feed.mts), by
// calling the website's own shared logic - these Functions do no date math or tier logic
// of their own, so there is nothing here that could drift from the website's definitions.

export const json = (body, status = 200, cacheSeconds = 120) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": status === 200 ? `public, max-age=${cacheSeconds}` : "no-store",
      "Access-Control-Allow-Origin": "*",
    },
  });
