// Unit + integration tests for the public release gate (src/lib/match-release.ts and the
// Cloudflare Pages edge redirect in functions/_middleware.js). Needs `npm run match-content:build`
// first (already part of `npm run prebuild`) so functions/_data/match-release.json exists.
// Run: npx tsx scripts/test-match-release-gate.mts   (npm run test:match-release-gate)
import { isDateReleased, isPredictionReleased } from "../src/lib/match-release.ts";
import { createMiddlewareHandler } from "../functions/_middleware.js";

const assert = (ok: unknown, label: string) => {
  if (!ok) throw new Error(`FAIL ${label}`);
  console.log(`PASS ${label}`);
};

const NOW = new Date("2026-10-18T12:00:00Z"); // midday UTC = still 18 Oct in America/Fortaleza (UTC-3)

// --- isDateReleased / isPredictionReleased -------------------------------------------------------

assert(isDateReleased("2026-10-18", NOW) === true, "today's date is released");
assert(isDateReleased("2026-10-17", NOW) === true, "a past date stays released");
assert(isDateReleased("2026-10-19", NOW) === false, "tomorrow's date is not released yet");
assert(isDateReleased("2099-01-01", NOW) === false, "a far-future date is not released");
assert(isDateReleased(null, NOW) === false, "a missing date fails closed (never released)");
assert(isDateReleased(undefined, NOW) === false, "an undefined date fails closed");
assert(isDateReleased("", NOW) === false, "an empty date fails closed");
assert(isDateReleased("not-a-date", NOW) === false, "a malformed date fails closed");
assert(isPredictionReleased({ matchInfo: { date: "2026-10-18" } }, NOW) === true, "a prediction dated today is released");
assert(isPredictionReleased({ matchInfo: { date: "2026-10-20" } }, NOW) === false, "a prediction dated in the future is hidden");
assert(isPredictionReleased({}, NOW) === false, "a prediction with no matchInfo is hidden");

// Timezone boundary: 2026-10-19 00:10 UTC is still 2026-10-18 in America/Fortaleza (UTC-3, no DST),
// so a match dated 2026-10-19 must not release purely because UTC has already rolled over.
const justAfterUtcMidnight = new Date("2026-10-19T00:10:00Z");
assert(isDateReleased("2026-10-19", justAfterUtcMidnight) === false, "release follows the site zone, not UTC's calendar day");
assert(isDateReleased("2026-10-18", justAfterUtcMidnight) === true, "today's match (site zone) stays released across the UTC rollover");

// --- functions/_middleware.js release redirect ---------------------------------------------------

type FakeContext = { request: Request; next: () => Promise<Response> };

function makeContext(url: string, nextResponse: Response): { context: FakeContext; nextCalls: number[] } {
  const nextCalls: number[] = [];
  const context: FakeContext = {
    request: new Request(url),
    next: async () => {
      nextCalls.push(1);
      return nextResponse;
    },
  };
  return { context, nextCalls };
}

const releaseDateBySlug = new Map([
  ["future-game", "2099-01-01"],
  ["todays-game", "2026-10-18"],
]);

{
  const handler = createMiddlewareHandler({ releaseDateBySlug, now: () => NOW });
  const { context, nextCalls } = makeContext("https://predictions-sports-prime.com/match/future-game/", new Response("<html>full page</html>", { status: 200 }));
  const response = await handler(context);
  assert(response.status === 307, "a future match answers 307, not 404/200/301");
  assert(response.headers.get("location") === "https://predictions-sports-prime.com/", "the redirect target is the site root");
  assert(response.headers.get("cache-control") === "no-store", "the redirect is never cached");
  assert(nextCalls.length === 0, "the static asset is never fetched for a locked future match");
}

{
  // Same slug, localized path: still redirects to the unlocalized site root, never a locale home.
  const handler = createMiddlewareHandler({ releaseDateBySlug, now: () => NOW });
  const { context, nextCalls } = makeContext("https://predictions-sports-prime.com/es/match/future-game/", new Response("<html>full page</html>", { status: 200 }));
  const response = await handler(context);
  assert(response.status === 307, "a localized future match path is also redirected");
  assert(response.headers.get("location") === "https://predictions-sports-prime.com/", "the localized redirect still targets the site root");
  assert(nextCalls.length === 0, "the localized static asset is never fetched either");
}

{
  // A released match (today or earlier) is served normally: next() runs, response passes through untouched.
  const handler = createMiddlewareHandler({ releaseDateBySlug, now: () => NOW });
  const { context, nextCalls } = makeContext("https://predictions-sports-prime.com/match/todays-game/", new Response("<html>full page</html>", { status: 200 }));
  const response = await handler(context);
  assert(response.status === 200, "a released match page is served normally");
  assert(nextCalls.length === 1, "a released match page is fetched exactly once");
}

{
  // A slug absent from the manifest (unknown URL, or already-generated non-match path) is unaffected.
  const handler = createMiddlewareHandler({ releaseDateBySlug, now: () => NOW });
  const { context, nextCalls } = makeContext("https://predictions-sports-prime.com/match/not-in-manifest/", new Response(null, { status: 404 }));
  const response = await handler(context);
  assert(response.status === 404, "an unknown slug falls through to the normal 404");
  assert(nextCalls.length === 1, "an unknown slug still asks the static handler");
}

{
  // Settled-match 410 behaviour (pre-existing) still works after the refactor into a factory.
  const handler = createMiddlewareHandler({
    settledSlugs: new Set(["old-settled-game"]),
    releaseDateBySlug: new Map(),
    now: () => NOW,
  });
  const { context } = makeContext("https://predictions-sports-prime.com/match/old-settled-game/", new Response(null, { status: 404 }));
  const response = await handler(context);
  assert(response.status === 410, "a settled match whose page was removed still answers 410 Gone");
}

{
  // Legacy hostname and pt-br hub redirects (pre-existing) are untouched by the refactor.
  const handler = createMiddlewareHandler({ now: () => NOW });
  const legacy = await handler(makeContext("https://predictions-sports-prime.pages.dev/results/", new Response(null, { status: 200 })).context);
  assert(legacy.status === 308 && legacy.headers.get("location") === "https://predictions-sports-prime.com/results/", "the legacy pages.dev hostname still redirects 308");

  const ptBr = await handler(makeContext("https://predictions-sports-prime.com/pt-br/", new Response(null, { status: 200 })).context);
  assert(ptBr.status === 301 && ptBr.headers.get("location") === "https://predictions-sports-prime.com/", "the retired pt-br home still redirects 301");
}

console.log("All match-release-gate tests passed.");
