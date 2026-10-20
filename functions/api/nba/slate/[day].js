// GET /api/nba/slate/:day
// Public listing (teams, titles, tier badges, teasers - never a pick, odds or analysis) of a DEFERRED
// NBA slate: one whose listing is withheld from the client bundle until its publication gate opens
// (src/data/nba/slates.ts `deferred: true`). Before the gate, and for any day that is not a deferred
// slate, the answer is the same "not-found", so nothing about a future day leaks. The gate is
// re-evaluated on every request with the slate's own IANA time zone
// (src/lib/nba-publication-policy.ts) - never cached, never a fixed UTC offset. Mirrors
// functions/api/nhl/slate/[day].js without changing it.
import { NBA_SLATES } from "../../../../src/data/nba/slates.ts";
import { expandDeferredNbaSlate } from "../../../../src/data/nba/deferred-slates.ts";
import { isNbaSlateReleased, NBA_PUBLICATION_TIME_ZONE } from "../../../../src/lib/nba-publication-policy.ts";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "private, no-store" },
  });

export function createNbaSlateHandler(now = () => new Date()) {
  return async function handle({ params }) {
    try {
      const dayKey = String(params?.day ?? "");
      const slate = NBA_SLATES.find((entry) => entry.dayKey === dayKey && entry.deferred);
      const at = now();
      const release = slate && { date: slate.dayKey, timezone: slate.publicationTimezone ?? NBA_PUBLICATION_TIME_ZONE };
      if (!slate || !release || !isNbaSlateReleased(release, at)) return json({ error: "not-found" }, 404);
      const expanded = expandDeferredNbaSlate(slate, at);
      return json({ dayKey: slate.dayKey, matches: expanded?.matches ?? [] });
    } catch {
      return json({ error: "unavailable" }, 503);
    }
  };
}

export async function onRequestGet(context) {
  return createNbaSlateHandler()(context);
}
