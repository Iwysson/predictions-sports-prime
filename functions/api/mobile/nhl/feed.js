// GET /api/mobile/nhl/feed
// Serves the build-time precomputed active-slate index (scripts/build-mobile-feed.mts,
// which calls src/data/nhl/slates.ts's own resolveNhlSlate - the exact rule the website
// uses to decide which single NHL day is "current"). No Today/Tomorrow/Upcoming split,
// same as the website: NHL shows one active day at a time.
import feed from "../../../_data/mobile/nhl.json";
import { json } from "../../../_lib/mobile-feed.js";

export async function onRequestGet() {
  try {
    return json({ generatedAt: feed.generatedAt, sport: "nhl", free: feed.free, vip: feed.vip });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
