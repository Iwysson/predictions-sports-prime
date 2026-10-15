// FREE-tier audit: every card with a FREE badge must expose BOTH the full prediction (pick + odds)
// and the full analysis to a visitor with no login, on the web page, the listing model, the public
// endpoint index and the mobile feed. Also checks that a non-FREE entry exposes neither.
// Run: npm run audit:free-access
import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { editorialToMatch } from "../src/lib/editorial.ts";
import { buildMatchPageModel } from "../src/lib/match-page-model.ts";
import { accessBadgeKind, buildContentIndex, hasMatchPage, matchSlug, resolveAccess } from "../src/lib/match-access.ts";
import { SLATES } from "../src/data/nhl/slates.ts";
import { NFL_WEEK5_2026 } from "../src/data/nfl/week5-2026-public.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";
import type { EditorialPrediction } from "../src/types/index.ts";

const problems: string[] = [];
const fail = (where: string, what: string) => problems.push(`${where}: ${what}`);
let freeCount = 0;
let vipCount = 0;

// Promotional copy on a FREE page must not say or hint that the analysis, pick or odds need PRIME VIP or a login.
// Only matches that have not started are checked: a started or finished match keeps the copy it was published with.
const MISLEADING_FREE_COPY = /remains? available with PRIME VIP|(?:analysis|reasoning|case|numbers)[^.]*PRIME VIP|(?:pick|odds)[^.]*in PRIME VIP|unlock|log ?in|login required|sign in to|members[- ]only|VIP members/i;
let futureFreeCopyIssues = 0;

const published = (editorialPredictions as EditorialPrediction[]).filter((p) => hasMatchPage(p));

for (const p of published) {
  const slug = matchSlug(p);
  const tiers = resolveAccess(p);
  const model = buildMatchPageModel(p, "en");
  if (!model) { fail(slug, "no match page model"); continue; }
  const listing = editorialToMatch(p);
  const badge = accessBadgeKind({ analysisAccess: listing.analysisAccess, predictionAccess: listing.predictionAccess, bestAnalysis: listing.bestAnalysis });

  if (tiers.analysis !== tiers.prediction) fail(slug, `analysis (${tiers.analysis}) and prediction (${tiers.prediction}) tiers differ`);

  if (tiers.prediction === "free" || tiers.analysis === "free") {
    freeCount += 1;
    if (badge !== "free") fail(slug, `FREE entry renders badge "${badge}"`);
    if (!model.publicPrediction) fail(slug, "FREE page has no public prediction");
    if (!model.staticAnalysis?.analysis.length) fail(slug, "FREE page has no public analysis");
    if (model.gate) fail(slug, "FREE page still renders a login/VIP gate");
    // The page renders model.publicPrediction as its own block above the analysis (every FREE page, PSP or not).
    if (model.publicPrediction && model.publicPrediction.main !== p.picks.main) fail(slug, "FREE page shows a different pick than the published one");
    if (!listing.predictions.length) fail(slug, "FREE listing item carries no prediction");
    if (!listing.analysis.length) fail(slug, "FREE listing item carries no analysis");
    if (classifyPspEditorialLifecycle(p) === "future-pre-match") {
      const copy: Record<string, string | undefined> = { teaser: p.teaser, trend: p.trend, comment: p.comment, publicSummary: p.publicSummary?.join(" ") };
      for (const [field, text] of Object.entries(copy)) {
        if (text && MISLEADING_FREE_COPY.test(text)) { futureFreeCopyIssues += 1; fail(slug, `future FREE ${field} says the analysis needs PRIME VIP or login: "${text.slice(0, 90)}"`); }
      }
    }
  } else {
    vipCount += 1;
    if (model.publicPrediction || model.staticAnalysis) fail(slug, "non-FREE page exposes prediction or analysis publicly");
    if (listing.predictions.length || listing.analysis.length) fail(slug, "non-FREE listing item exposes prediction or analysis");
  }
}

// The route templates must render the public prediction unconditionally: an extra condition (for example
// skipping PSP pages) is how a FREE prediction ended up hidden while its analysis stayed visible.
for (const file of ["src/templates/match-routes/en/page.tsx", "src/templates/match-routes/locale/page.tsx", "src/app/(en)/match/[slug]/page.tsx"]) {
  let source = "";
  try { source = readFileSync(file, "utf8"); } catch { continue; }
  if (/model\.publicPrediction\s*&&/.test(source)) fail(file, "public prediction block is rendered conditionally; it must follow model.publicPrediction alone");
  if (!/\{model\.publicPrediction \? \(/.test(source)) fail(file, "public prediction block is missing from the page");
}

// Protected-content index served by /api/match-content/[slug]: the two tiers must agree per entry.
for (const entry of buildContentIndex(published)) {
  if (entry.analysisAccess !== entry.predictionAccess) fail(`content-index ${entry.slug}`, "analysis and prediction tiers differ");
}

// Generated files that ship to Cloudflare Functions and the Android app. They are rebuilt by `prebuild`;
// a stale copy would still hide a prediction behind login.
const generated = (path: string) => JSON.parse(readFileSync(path, "utf8"));
const contentIndex = generated("functions/_data/match-content.json");
const entries: Array<{ slug: string; analysisAccess: string; predictionAccess: string }> = Array.isArray(contentIndex) ? contentIndex : contentIndex.entries ?? Object.values(contentIndex);
for (const e of entries) {
  if (e.analysisAccess !== e.predictionAccess) fail(`match-content.json ${e.slug}`, `tiers differ (${e.analysisAccess}/${e.predictionAccess})`);
}
const expectedFree = new Set(published.filter((p) => resolveAccess(p).prediction === "free").map(matchSlug));
const generatedFree = new Set(entries.filter((e) => e.predictionAccess === "free").map((e) => e.slug));
for (const slug of expectedFree) if (!generatedFree.has(slug)) fail(`match-content.json ${slug}`, "FREE in source but protected in the generated index (run npm run match-content:build)");

const feed = generated("functions/_data/mobile/football.json");
for (const bucket of ["today", "tomorrow", "upcoming"] as const) {
  for (const m of feed.free?.[bucket] ?? []) {
    if (!m.pick) fail(`mobile football.json ${m.slug}`, "FREE card has no pick");
    if (m.analysisAccess !== "free" || m.predictionAccess !== "free") fail(`mobile football.json ${m.slug}`, "FREE card with a non-FREE tier");
  }
  for (const m of feed.vip?.[bucket] ?? []) {
    if (expectedFree.has(m.slug)) fail(`mobile football.json ${m.slug}`, "FREE match listed in the VIP bucket (run npm run mobile-feed:build)");
    if (m.pick) fail(`mobile football.json ${m.slug}`, "VIP card exposes a pick");
  }
}

// NHL and NFL public data: a FREE game carries pick, odds and analysis; the others carry none of them.
//
// Exception: a FREE NHL game whose slate day has not activated yet (its dayKey is for a day later
// than the currently active one - see src/lib/nhl-publication-policy.ts and src/data/nhl/slates.ts)
// is allowed to carry no inline pick/odds/analysis, because embedding them now would ship the full
// FREE prediction in the public client bundle before its publication gate opens. In that case this
// audit instead requires the deferred content to exist, correctly tagged FREE and activeFromKey-gated
// to that same day, in the generated protected index - so the gap is verified closed, not just skipped.
const todayKeyForAudit = new Date().toISOString().slice(0, 10);
const activeNhlDayKey = SLATES.reduce((latest: string | null, slate) => (slate.dayKey <= todayKeyForAudit ? slate.dayKey : latest), null as string | null);
const games = [
  ...SLATES.flatMap((slate) => slate.matches.map((m) => ({ id: `nhl ${slate.dayKey} ${m.slug}`, g: m as any, dayKey: slate.dayKey }))),
  ...NFL_WEEK5_2026.map((g) => ({ id: `nfl ${g.slug}`, g: g as any, dayKey: null as string | null })),
];
for (const { id, g, dayKey } of games) {
  if (g.access === "free") {
    freeCount += 1;
    const notYetActive = dayKey !== null && activeNhlDayKey !== null && dayKey > activeNhlDayKey;
    if (!g.pick && notYetActive) {
      const deferred = entries.find((e) => e.slug === g.slug) as (typeof entries)[number] & { activeFromKey?: string; prediction?: { main?: string; odds?: number | null } } | undefined;
      if (!deferred) fail(id, "FREE game not yet active has no deferred entry in match-content.json");
      else {
        if (deferred.analysisAccess !== "free" || deferred.predictionAccess !== "free") fail(id, "FREE game's deferred match-content.json entry is not tagged FREE");
        if (deferred.activeFromKey !== dayKey) fail(id, `FREE game's deferred entry activeFromKey ("${deferred.activeFromKey}") does not match its slate day ("${dayKey}")`);
        if (!deferred.prediction?.main || deferred.prediction?.odds == null) fail(id, "FREE game's deferred match-content.json entry has no pick/odds");
      }
      continue;
    }
    if (!g.pick) fail(id, "FREE game has no public pick");
    if (g.odds === undefined) fail(id, "FREE game has no public odds");
    if (!g.analysis?.length) fail(id, "FREE game has no public analysis");
  } else if (g.pick || g.odds !== undefined || g.analysis?.length) {
    fail(id, "non-FREE game exposes pick, odds or analysis in public data");
  }
}

if (problems.length) {
  console.error(`FREE access audit FAILED (${problems.length}):`);
  for (const line of problems) console.error(`  - ${line}`);
  process.exit(1);
}
console.log(`FREE access audit passed: ${freeCount} FREE entries show prediction and analysis without login; ${vipCount} football entries stay protected; future FREE misleading VIP copy = ${futureFreeCopyIssues}.`);
