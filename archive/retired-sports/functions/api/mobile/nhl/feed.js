// GET /api/mobile/nhl/feed
// Resolves the active slate at request time through the same builder and resolveNhlSlate rule used
// by the website. This prevents a build made before midnight ET from pinning the app to yesterday.
import { buildMobileNhlIndex } from "../../../../src/lib/mobile-feed-build-nhl-nfl.ts";
import { json } from "../../../_lib/mobile-feed.js";

export function createMobileNhlFeedHandler(now = () => new Date()) {
  return async function onRequestGet() {
    try {
      const feed = buildMobileNhlIndex(now());
      return json({ generatedAt: feed.generatedAt, sport: "nhl", free: feed.free, vip: feed.vip }, 200, 0);
    } catch {
      return json({ error: "unavailable" }, 503);
    }
  };
}

export async function onRequestGet() {
  try {
    return createMobileNhlFeedHandler()();
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
