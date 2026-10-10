// GET /api/mobile/football/feed[?league=premier-league]
// Public feed for the Android app: Today/Tomorrow/Upcoming x FREE/BEST BET/PRIME VIP,
// plus the list of leagues present. No protected analysis/odds/pick text here - unlocking
// a VIP card still goes through the existing /api/match-content/:slug endpoint.
import feed from "../../../_data/mobile/football.json";
import { json, bucketByDate, splitTiers } from "../../../_lib/mobile-feed.js";

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    const league = url.searchParams.get("league");
    const matches = league ? feed.matches.filter((m) => m.league === league) : feed.matches;

    const buckets = bucketByDate(matches);
    const shape = (list) => splitTiers(list);

    const leagues = [...new Set(feed.matches.map((m) => m.league))].sort();

    return json({
      generatedAt: new Date().toISOString(),
      sport: "football",
      league: league ?? null,
      leagues,
      free: {
        today: shape(buckets.today).free,
        tomorrow: shape(buckets.tomorrow).free,
        upcoming: shape(buckets.upcoming).free,
      },
      vip: {
        today: shape(buckets.today).vip,
        tomorrow: shape(buckets.tomorrow).vip,
        upcoming: shape(buckets.upcoming).vip,
      },
    });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
