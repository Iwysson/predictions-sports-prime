// GET /api/mobile/football/feed[?league=premier-league]
// Serves the build-time precomputed Today/Tomorrow/Upcoming x FREE/BEST BET/PRIME VIP
// index (scripts/build-mobile-feed.mts). No protected analysis/odds/pick text here for
// BEST BET/PRIME VIP entries - unlocking one still goes through /api/match-content/:slug.
import feed from "../../../_data/mobile/football.json";
import { json } from "../../../_lib/mobile-feed.js";

const byLeague = (list, league) => (league ? list.filter((m) => m.league === league) : list);

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    const league = url.searchParams.get("league");

    return json({
      generatedAt: feed.generatedAt,
      sport: "football",
      league: league ?? null,
      leagues: feed.leagues,
      free: {
        today: byLeague(feed.free.today, league),
        tomorrow: byLeague(feed.free.tomorrow, league),
        upcoming: byLeague(feed.free.upcoming, league),
      },
      vip: {
        today: byLeague(feed.vip.today, league),
        tomorrow: byLeague(feed.vip.tomorrow, league),
        upcoming: byLeague(feed.vip.upcoming, league),
      },
    });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
