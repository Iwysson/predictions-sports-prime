// Writes public, non-secret mobile feed indexes consumed by functions/api/mobile/*.
// Runs in prebuild, alongside match-content:build. Output lives under functions/_data
// so it ships only with the Pages Functions, never with client bundles (though every
// field here is already public on the website itself - no protected text is included).
import { writeFileSync, mkdirSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { buildPublicMatchView, hasMatchPage } from "../src/lib/match-access.ts";
import { accessBadgeKind } from "../src/lib/match-access.ts";
import { SLATES } from "../src/data/nhl/slates.ts";
import { NFL_WEEK5_2026 } from "../src/data/nfl/week5-2026-public.ts";

mkdirSync("functions/_data/mobile", { recursive: true });

// ---- Football: flat list of public match previews across every league ----
const football = editorialPredictions
  .filter((p: any) => p.published !== false && hasMatchPage(p))
  .map((p: any) => {
    const view = buildPublicMatchView(p);
    return {
      ...view,
      badge: accessBadgeKind({
        analysisAccess: view.analysisAccess,
        predictionAccess: view.predictionAccess,
        bestAnalysis: p.bestAnalysis,
      }),
    };
  });

writeFileSync(
  "functions/_data/mobile/football.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), matches: football }, null, 2) + "\n",
);

// ---- NHL: slates grouped by NHL day key (America/New_York), as already modeled on the site ----
const nhl = SLATES.map((slate) => ({
  dayKey: slate.dayKey,
  matches: slate.matches.map((m) => ({
    slug: m.slug,
    title: m.title,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    badge: m.access,
    teaser: m.teaser,
    // FREE pick/odds/analysis are already public on the site; everything else stays out.
    pick: m.access === "free" ? m.pick : undefined,
    odds: m.access === "free" ? m.odds : undefined,
  })),
}));

writeFileSync(
  "functions/_data/mobile/nhl.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), slates: nhl }, null, 2) + "\n",
);

// ---- NFL: current public week ----
const nfl = NFL_WEEK5_2026.map((g: any) => ({
  slug: g.slug,
  title: g.title,
  homeTeam: g.homeTeam,
  awayTeam: g.awayTeam,
  badge: g.access,
  teaser: g.teaser,
  date: g.date,
  kickoff: g.kickoff,
  timezone: g.timezone,
  stadium: g.stadium,
  city: g.city,
  state: g.state,
  pick: g.access === "free" ? g.pick : undefined,
  odds: g.access === "free" ? g.odds : undefined,
}));

writeFileSync(
  "functions/_data/mobile/nfl.json",
  JSON.stringify({ generatedAt: new Date().toISOString(), games: nfl }, null, 2) + "\n",
);

console.log(
  `mobile feed index: football=${football.length} nhl-slates=${nhl.length} nfl=${nfl.length}`,
);
