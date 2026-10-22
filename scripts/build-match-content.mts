// Writes the protected match-content index used by functions/api/match-content.
// Runs in prebuild. The output lives under functions/ so it is bundled into the
// Pages Function only and never copied into the static export or client bundles.
import { writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { buildContentIndex, type ProtectedContentEntry } from "../src/lib/match-access.ts";
import { readFileSync } from "node:fs";
import { nhlMatches } from "../src/lib/nhl.ts";
import { allNbaMatches } from "../src/lib/nba-match.ts";
import { matches as publishedMatches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { gatedSitemapEntries } from "../src/lib/sitemap-data.ts";

const nhlEntries: ProtectedContentEntry[] = nhlMatches().map((m) => ({
  slug: m.slug,
  analysisAccess: m.access,
  predictionAccess: m.access,
  full: { analysis: m.analysis, sources: m.sources, comment: null, picks: { main: m.pick, odds: m.odds } },
  prediction: { main: m.pick, odds: m.odds },
}));

type LaterEntryFile = {
  activeFromKey: string;
  // IANA zone whose local midnight on activeFromKey opens the entries. Absent = America/New_York (the NHL day).
  releaseTimeZone?: string;
  entries: Array<{ slug: string; analysisAccess: "free" | "vip"; predictionAccess: "free" | "vip"; pick: string; odds: number; analysis: string[]; analysisFormat?: "markdown"; sources?: Array<{ name: string; url: string }> }>;
};

// NHL protected entries for later days. They stay "not-found" in the endpoint until 00:00 of
// activeFromKey in the file's releaseTimeZone (default America/New_York, the NHL day). Add a new file here for each later NHL day.
// Every protected-<day>.json is picked up automatically (sorted by day), so a published NHL day can no longer be left out.
const nhlLaterFiles = readdirSync("src/data/nhl").filter((name) => /^protected-\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort().map((name) => `src/data/nhl/${name}`);
for (const file of nhlLaterFiles) {
  const later = JSON.parse(readFileSync(file, "utf8")) as LaterEntryFile;
  for (const e of later.entries) {
    nhlEntries.push({
      slug: e.slug,
      analysisAccess: e.analysisAccess,
      predictionAccess: e.predictionAccess,
      full: { analysis: e.analysis, analysisFormat: e.analysisFormat, sources: e.sources ?? [], comment: null, picks: { main: e.pick, odds: e.odds } },
      prediction: { main: e.pick, odds: e.odds },
      activeFromKey: later.activeFromKey,
      ...(later.releaseTimeZone ? { releaseTimeZone: later.releaseTimeZone } : {}),
    });
  }
}

// NFL protected entries (BEST BET / PRIME VIP games). Published immediately, no activeFromKey.
// One file per published week - add a new file here for each later NFL week, same pattern as
// nhlLaterFiles above.
type NflEntryFile = {
  entries: Array<{ slug: string; analysisAccess: "free" | "vip"; predictionAccess: "free" | "vip"; pick: string; odds: number; analysis: string[]; analysisFormat?: "markdown"; sources?: Array<{ name: string; url: string }> }>;
};
const nflWeekFiles = ["src/data/nfl/week5-2026-protected.json", "src/data/nfl/week6-2026-protected.json"];
const nflEntries: ProtectedContentEntry[] = nflWeekFiles.flatMap((file) => {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as NflEntryFile;
  return parsed.entries.map((e) => ({
    slug: e.slug,
    analysisAccess: e.analysisAccess,
    predictionAccess: e.predictionAccess,
    full: { analysis: e.analysis, analysisFormat: e.analysisFormat, sources: e.sources ?? [], comment: null, picks: { main: e.pick, odds: e.odds } },
    prediction: { main: e.pick, odds: e.odds },
  }));
});

// NBA protected entries (own slate/release-gate system mirroring NHL, src/data/nba/slates.ts -
// America/Sao_Paulo midnight - rather than the football editorialPredictions pipeline, since NBA's
// stat shape does not fit the football-specific psp-v1 Statistical Core). One day so far
// (2026-10-20); a later day only needs its own protected-<day>.json entries picked up by
// src/lib/nba-match.ts, same pattern as nhlLaterFiles above.
const nbaEntries: ProtectedContentEntry[] = allNbaMatches().map((m) => ({
  slug: m.slug,
  analysisAccess: m.analysisAccess,
  predictionAccess: m.predictionAccess,
  full: { analysis: m.analysis, analysisFormat: m.analysisFormat, sources: m.sources, comment: null, picks: { main: m.pick, odds: m.odds } },
  prediction: { main: m.pick, odds: m.odds },
  activeFromKey: m.matchInfo.date,
  releaseTimeZone: m.releaseTimeZone,
}));

const index = buildContentIndex(editorialPredictions as any[], new Date(), [...nhlEntries, ...nflEntries, ...nbaEntries]);
mkdirSync("functions/_data", { recursive: true });
writeFileSync("functions/_data/match-content.json", JSON.stringify(index, null, 2) + "\n");
const count = (fn: (e: ProtectedContentEntry) => boolean) => index.filter(fn).length;
console.log(
  `match content index: ${index.length} entries (analysis vip: ${count((e) => e.analysisAccess === "vip")}, ` +
    `analysis free: ${count((e) => e.analysisAccess === "free")}, prediction free: ${count((e) => e.predictionAccess === "free")})`,
);

// Public release manifest consumed by functions/_middleware.js: every football /match/[slug]/ route that is
// (or may become) statically generated, with the calendar date its page may start being served on. The
// middleware answers a redirect to Home for any of these slugs until that date arrives (src/lib/match-release.ts),
// re-evaluated per request so a page already built ahead of kickoff still opens automatically with no redeploy.
//
// The date here MUST be the same one the homepage's Today listing uses (src/app/(en)/page.tsx hydrates
// `matches` through hydratePredictions before computing Today), not the raw editorial `matchInfo.date` -
// a live fixture correction can move the real kickoff a calendar day from what was first declared, and the
// release gate must follow that correction exactly like every other "is this today" decision on the site.
const hydratedMatches = await hydratePredictions(publishedMatches.map(toMatchPreview));
const footballReleaseManifest = hydratedMatches
  .filter((m) => Boolean(m.date))
  .map((m) => ({ slug: m.slug, date: m.date, ...(m.releaseTimeZone ? { timezone: m.releaseTimeZone } : {}) }));
// NBA match pages (/nba/<slug>/) share this exact manifest and middleware gate (functions/_middleware.js
// matches both /match/ and /nba/ paths); release-gate semantics are identical (America/Fortaleza is the
// same fixed UTC-3 offset as America/Sao_Paulo for every date since Brazil abolished DST in 2019).
const nbaReleaseManifest = nbaEntries.map((entry) => ({ slug: entry.slug, date: entry.activeFromKey, timezone: entry.releaseTimeZone }));
const nhlReleaseManifest = nhlEntries.filter((entry) => entry.activeFromKey === "2026-10-21" || entry.activeFromKey === "2026-10-22").map((entry) => ({ slug: entry.slug, date: entry.activeFromKey, timezone: entry.releaseTimeZone ?? "America/New_York" }));
const releaseManifest = [...footballReleaseManifest, ...nbaReleaseManifest, ...nhlReleaseManifest];
writeFileSync("functions/_data/match-release.json", JSON.stringify(releaseManifest, null, 2) + "\n");
console.log(`match release manifest: ${releaseManifest.length} slugs`);

// Sitemap entries withheld from the static sitemaps because their release gate is still closed at build time
// (src/lib/sitemap-data.ts). functions/_middleware.js appends each one to its sitemap the moment the gate that
// guards the page itself opens, so the sitemap follows page availability with no redeploy.
const gatedSitemap = gatedSitemapEntries();
writeFileSync("functions/_data/sitemap-gated.json", JSON.stringify(gatedSitemap, null, 2) + "\n");
console.log(`gated sitemap entries: ${gatedSitemap.length}`);
