// GET /api/mobile/nfl/feed
// Public feed for the Android app: Today/Tomorrow/Upcoming x FREE/BEST BET/PRIME VIP.
import feed from "../../../_data/mobile/nfl.json";
import { json, bucketByDate, splitTiers } from "../../../_lib/mobile-feed.js";

export async function onRequestGet() {
  try {
    const buckets = bucketByDate(feed.games);
    return json({
      generatedAt: new Date().toISOString(),
      sport: "nfl",
      free: {
        today: splitTiers(buckets.today).free,
        tomorrow: splitTiers(buckets.tomorrow).free,
        upcoming: splitTiers(buckets.upcoming).free,
      },
      vip: {
        today: splitTiers(buckets.today).vip,
        tomorrow: splitTiers(buckets.tomorrow).vip,
        upcoming: splitTiers(buckets.upcoming).vip,
      },
    });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
