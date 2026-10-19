// GET /api/mobile/football/feed[?league=premier-league]
// Serves the build-time precomputed Today/Tomorrow/Upcoming x FREE/BEST BET/PRIME VIP
// index (scripts/build-mobile-feed.mts). No protected analysis/odds/pick text here for
// BEST BET/PRIME VIP entries - unlocking one still goes through /api/match-content/:slug.
import feed from "../../../_data/mobile/football.json";
import { json } from "../../../_lib/mobile-feed.js";
import { localDateKeyInZone } from "../../../../src/lib/nhl-publication-policy.ts";

const byLeague = (list, league) => (league ? list.filter((m) => m.league === league) : list);

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    const league = url.searchParams.get("league");
    const today = localDateKeyInZone("America/Fortaleza", new Date());
    const releasedToday = (items) => byLeague(items, league).filter((item) => item.date === today);
    const all = (tier) => [...feed[tier].today, ...feed[tier].tomorrow, ...feed[tier].upcoming];

    return json({
      generatedAt: feed.generatedAt,
      sport: "football",
      league: league ?? null,
      leagues: feed.leagues,
      free: {
        today: releasedToday(all("free")),
        tomorrow: [],
        upcoming: [],
      },
      vip: {
        today: releasedToday(all("vip")),
        tomorrow: [],
        upcoming: [],
      },
    });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
