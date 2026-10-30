// GET /api/nhl/status
// Public NHL status for the current NHL day (America/New_York). Returns only game state, teams
// (official abbreviations), period and clock. Never predictions, odds or VIP content.
// Any provider failure (timeout, HTTP error, invalid JSON, wrong shape) returns state "unavailable"
// with no games, so the page never shows a false LIVE.

import { normalizeScore } from "../../../src/lib/nhl-live.ts";
import { getNhlTodayKey } from "../../../src/lib/nhl-day.ts";

const PROVIDER_URL = "https://api-web.nhle.com/v1/score/";
const TIMEOUT_MS = 4000;

// Edge cache is short: 15s while any game is live, 45s otherwise. Failures are cached for 10s only.
const respond = (body, sMaxAge) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${sMaxAge}`,
    },
  });

export function createNhlStatusHandler(fetchImpl = fetch, now = () => new Date()) {
  return async function handle() {
    const date = getNhlTodayKey(now());
    const unavailable = () => respond({ date, state: "unavailable", games: [] }, 10);
    try {
      const res = await fetchImpl(`${PROVIDER_URL}${date}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) return unavailable();
      const games = normalizeScore(await res.json());
      if (!games) return unavailable();
      const anyLive = games.some((g) => g.state === "live");
      return respond({ date, state: "ok", games }, anyLive ? 15 : 45);
    } catch {
      return unavailable();
    }
  };
}

export const onRequestGet = () => createNhlStatusHandler()();
