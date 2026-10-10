// GET /api/mobile/nfl/feed
// Serves the build-time precomputed current-week index (scripts/build-mobile-feed.mts).
// No Today/Tomorrow/Upcoming split, same as the website: only one week is published at
// a time today, so there is nothing to bucket.
import feed from "../../../_data/mobile/nfl.json";
import { json } from "../../../_lib/mobile-feed.js";

export async function onRequestGet() {
  try {
    return json({ generatedAt: feed.generatedAt, sport: "nfl", free: feed.free, vip: feed.vip });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
