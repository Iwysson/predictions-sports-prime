// GET /api/nhl/history
// Automatic NHL prediction history. For every published NHL day within the lookback window,
// fetches that day's final scores from the NHL Web API and settles every published prediction
// against them. A VIP/BEST BET pick is included only once its game is actually FINAL/OFF (see the
// leak guard in src/lib/nhl-results.ts) — this endpoint never reveals a protected pick pre-kickoff.
// Never predictions by hand, never a WIN/LOSS typed in manually: the result is derived every time
// this endpoint is called, so it grows on its own as days complete, with no new build required.

import { normalizeFinalScores } from "../../../src/lib/nhl-live.ts";
import { buildNhlHistoryDay } from "../../../src/lib/nhl-results.ts";
import { allNhlDayKeys } from "../../../src/data/nhl/slates.ts";
import { getNhlTodayKey } from "../../../src/lib/nhl-day.ts";

const PROVIDER_URL = "https://api-web.nhle.com/v1/score/";
const TIMEOUT_MS = 4000;
const HISTORY_WINDOW_DAYS = 30;

async function fetchDayScores(fetchImpl, dayKey) {
  try {
    const res = await fetchImpl(`${PROVIDER_URL}${dayKey}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const games = normalizeFinalScores(await res.json());
    return games ?? [];
  } catch {
    return [];
  }
}

const respond = (body, sMaxAge) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${sMaxAge}`,
    },
  });

export function createNhlHistoryHandler(fetchImpl = fetch, now = () => new Date()) {
  return async function handle() {
    const todayKey = getNhlTodayKey(now());
    const cutoff = new Date(now().getTime() - HISTORY_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    const cutoffKey = getNhlTodayKey(cutoff);
    const dayKeys = allNhlDayKeys().filter((key) => key <= todayKey && key >= cutoffKey);

    const days = [];
    for (const dayKey of dayKeys) {
      const scores = await fetchDayScores(fetchImpl, dayKey);
      days.push(buildNhlHistoryDay(dayKey, scores));
    }
    days.sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1));

    const settledRows = days.flatMap((d) => d.rows).filter((r) => r.result === "win" || r.result === "loss");
    const wins = settledRows.filter((r) => r.result === "win").length;
    const losses = settledRows.length - wins;

    // Today's slate still has live/upcoming games, so its settlement can change within minutes;
    // a fully elapsed past day never changes, so it can be cached much longer.
    const includesToday = dayKeys.includes(todayKey);
    return respond({ state: "ok", days, wins, losses }, includesToday ? 60 : 1800);
  };
}

export const onRequestGet = () => createNhlHistoryHandler()();
