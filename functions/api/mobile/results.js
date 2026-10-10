// GET /api/mobile/results
// Public, unauthenticated - settled football results are public on the website
// regardless of a prediction's original tier (see src/lib/football-results.ts), so this
// stays public for the app too. This is NOT the same feature as the VIP-only
// /api/history-predictions (a separate, hand-curated editorial history dataset).
import feed from "../../_data/mobile/results.json";
import { json } from "../../_lib/mobile-feed.js";

export async function onRequestGet() {
  try {
    return json({ generatedAt: feed.generatedAt, records: feed.records });
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
