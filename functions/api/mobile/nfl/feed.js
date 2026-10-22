// GET /api/mobile/nfl/feed
// Serves the build-time precomputed current-week index (scripts/build-mobile-feed.mts).
// No Today/Tomorrow/Upcoming split, same as the website: only one week is published at
// a time today, so there is nothing to bucket.
import { json } from "../../../_lib/mobile-feed.js";
import { buildMobileNflIndex } from "../../../../src/lib/mobile-feed-build-nhl-nfl.ts";

export async function onRequestGet() {
  try {
    const feed = buildMobileNflIndex();
    return json({ generatedAt: feed.generatedAt, sport: "nfl", free: feed.free, vip: feed.vip });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
