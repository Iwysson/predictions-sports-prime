// Writes the protected match-content index used by functions/api/match-content.
// Runs in prebuild. The output lives under functions/ so it is bundled into the
// Pages Function only and never copied into the static export or client bundles.
import { writeFileSync, mkdirSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { buildContentIndex, type ProtectedContentEntry } from "../src/lib/match-access.ts";
import { matches as publishedMatches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { gatedSitemapEntries } from "../src/lib/sitemap-data.ts";

const index = buildContentIndex(editorialPredictions as any[], new Date());
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
const releaseManifest = footballReleaseManifest;
writeFileSync("functions/_data/match-release.json", JSON.stringify(releaseManifest, null, 2) + "\n");
console.log(`match release manifest: ${releaseManifest.length} slugs`);

// Sitemap entries withheld from the static sitemaps because their release gate is still closed at build time
// (src/lib/sitemap-data.ts). functions/_middleware.js appends each one to its sitemap the moment the gate that
// guards the page itself opens, so the sitemap follows page availability with no redeploy.
const gatedSitemap = gatedSitemapEntries();
writeFileSync("functions/_data/sitemap-gated.json", JSON.stringify(gatedSitemap, null, 2) + "\n");
console.log(`gated sitemap entries: ${gatedSitemap.length}`);
