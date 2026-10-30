// The October 30 football wave: 9 FREE, 0 VIP, original picks and odds, one Core per analysis, and the New York
// midnight gate on the page, the API and the sitemap. Run: npm run test:oct30-release
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { parsePredictionMarket } from "../src/lib/prediction-results.ts";
import { createMiddlewareHandler } from "../functions/_middleware.js";
import { createMatchContentHandler } from "../functions/api/match-content/[slug].js";

const expected: Record<string, { league: string; pick: string; odds: number; kickoffUtc: string }> = {
  "corinthians-vs-mirassol": { league: "brasileirao-serie-a", pick: "Corinthians or Draw (1X) + Over 1.5 Goals", odds: 1.65, kickoffUtc: "2026-10-30T23:00:00Z" },
  "villarreal-vs-espanyol": { league: "la-liga", pick: "Espanyol +1.5 Goals (handicap)", odds: 1.75, kickoffUtc: "2026-10-30T20:00:00Z" },
  "sv-elversberg-vs-mainz-05": { league: "bundesliga", pick: "Elversberg or Draw (1X)", odds: 1.72, kickoffUtc: "2026-10-30T19:30:00Z" },
  "le-havre-vs-psg": { league: "ligue-1", pick: "Paris Saint-Germain -1.5 Goals (handicap)", odds: 1.85, kickoffUtc: "2026-10-30T18:00:00Z" },
  "nice-vs-rennes": { league: "ligue-1", pick: "Over 2.5 Goals", odds: 1.67, kickoffUtc: "2026-10-30T18:00:00Z" },
  "lille-vs-lens": { league: "ligue-1", pick: "Over 1.5 Goals + Over 7.5 Total Corners", odds: 1.65, kickoffUtc: "2026-10-30T20:05:00Z" },
  "casa-pia-vs-sporting-cp": { league: "liga-portugal", pick: "Sporting CP to Win + Over 2.5 Goals", odds: 1.76, kickoffUtc: "2026-10-30T20:15:00Z" },
  "konyaspor-vs-galatasaray": { league: "super-lig", pick: "Galatasaray to Win", odds: 1.62, kickoffUtc: "2026-10-30T17:00:00Z" },
  "bodo-glimt-vs-viking": { league: "eliteserien", pick: "Over 3.5 Goals", odds: 1.75, kickoffUtc: "2026-10-30T18:00:00Z" },
};

const wave = editorialPredictions.filter((prediction) => prediction.matchInfo?.date === "2026-10-30");
assert.equal(wave.length, 9);
assert.deepEqual(wave.map((prediction) => prediction.slug).sort(), Object.keys(expected).sort());
for (const prediction of wave) {
  const want = expected[prediction.slug!];
  assert.equal(prediction.league, want.league);
  assert.equal(prediction.picks.main, want.pick, `${prediction.slug}: pick changed`);
  assert.equal(prediction.picks.publishedOdds, want.odds, `${prediction.slug}: odds changed`);
  assert.equal(prediction.access, "free");
  assert.equal(prediction.analysisAccess, "free");
  assert.equal(prediction.predictionAccess, "free");
  assert.equal(prediction.published, true);
  assert.equal(prediction.editorialStandard, "psp-v1");
  assert.equal(prediction.matchInfo?.releaseTimeZone, "America/New_York");
  assert.deepEqual(parsePredictionMarket(prediction.picks.main).unsupportedLegs, [], `${prediction.slug}: pick must be settleable`);
  const text = prediction.analysis.join("\n");
  assert.equal((text.match(/### Statistical Core Predictions-Sports-Prime/g) ?? []).length, 1, `${prediction.slug}: one Core`);
  assert.equal((text.match(/\| Metric \|/g) ?? []).length, 1, `${prediction.slug}: one table`);
  const body = text.slice(text.indexOf("## Match Analysis") + 17, text.indexOf("### Statistical Core"));
  assert.deepEqual([...body.matchAll(/^### (.+)$/gm)].map((match) => match[1]), ["Match Context", "Statistical Analysis", "Betting Analysis"], `${prediction.slug}: section order`);
  const paragraphs = body.split(/\n\n+/).map((part) => part.trim()).filter((part) => part && !part.startsWith("#"));
  assert.equal(paragraphs.length, 3, `${prediction.slug}: three analysis paragraphs`);
  for (const paragraph of paragraphs) assert.ok(paragraph.length > 350, `${prediction.slug}: paragraph too thin`);
  assert.ok(!/\b(?:codex|zip|checksum|repository|script|our dataset|provided pick|author|supplied|internal model|package)\b/i.test(text), `${prediction.slug}: internal wording in public text`);
  assert.ok(text.indexOf("### Statistical Core") > text.indexOf("### Betting Analysis"), `${prediction.slug}: Core follows the analysis`);
  assert.ok(/\(.+\)/.test(text.slice(text.indexOf("## Probable Starting XIs"))), `${prediction.slug}: lineup alternatives kept`);
  for (const metric of ["xG per match", "xGA per match", "Goals scored per match", "Shots per match", "Possession", "Corners won per match", "Venue matches analysed", "Over 2.5 goals"]) {
    assert.ok(text.includes(metric), `${prediction.slug}: ${metric}`);
  }
}

// Every Core value must be recomputable from the stored match-level samples.
const samples = JSON.parse(readFileSync("src/data/predictions/editorial-tools/oct30-venue-samples.json", "utf8")) as Record<string, { home: { rows: Array<{ hg: number; ag: number; xg: number[]; corners: number[] }> }; away: { rows: Array<{ hg: number; ag: number; xg: number[]; corners: number[] }> } }>;
for (const prediction of wave) {
  const text = prediction.analysis.join("\n");
  const row = (label: string) => text.split("\n").find((line) => line.startsWith(`| ${label} |`))?.split("|").map((cell) => cell.trim()) ?? [];
  const sample = samples[prediction.slug!];
  const mean = (values: number[]) => (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2);
  assert.equal(row("Venue matches analysed")[2], String(sample.home.rows.length));
  assert.equal(row("Venue matches analysed")[3], String(sample.away.rows.length));
  assert.equal(row("Goals scored per match")[2], mean(sample.home.rows.map((match) => match.hg)), `${prediction.slug}: home goals`);
  assert.equal(row("Goals scored per match")[3], mean(sample.away.rows.map((match) => match.ag)), `${prediction.slug}: away goals`);
  assert.equal(row("Goals conceded per match")[2], mean(sample.home.rows.map((match) => match.ag)), `${prediction.slug}: home conceded`);
  assert.equal(row("xG per match")[2], mean(sample.home.rows.map((match) => match.xg[0])), `${prediction.slug}: home xG`);
  assert.equal(row("xG per match")[3], mean(sample.away.rows.map((match) => match.xg[1])), `${prediction.slug}: away xG`);
  assert.equal(row("Corners won per match")[2], mean(sample.home.rows.map((match) => match.corners[0])), `${prediction.slug}: home corners`);
  const over25 = sample.home.rows.filter((match) => match.hg + match.ag > 2).length;
  assert.ok(row("Over 2.5 goals")[2].endsWith(`(${over25}/${sample.home.rows.length})`), `${prediction.slug}: over 2.5`);
}

// The gate: 00:00 in New York on the match date (04:00 UTC, EDT), never earlier.
const before = new Date("2026-10-30T03:59:59Z");
const at = new Date("2026-10-30T04:00:00Z");
const release = new Map(Object.keys(expected).map((slug) => [slug, { date: "2026-10-30", timezone: "America/New_York" }]));
const middleware = (now: Date) => createMiddlewareHandler({ settledSlugs: new Set(), releaseDateBySlug: release, gatedSitemapEntries: new Map(), now: () => now });
const content = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8")) as Array<{ slug: string; activeFromKey?: string; releaseTimeZone?: string; analysisAccess: string; predictionAccess: string; prediction: { main: string; odds: number } }>;
for (const slug of Object.keys(expected)) {
  const page = (now: Date) => middleware(now)({ request: new Request(`https://predictions-sports-prime.com/match/${slug}/`), next: async () => new Response("page") } as never);
  const hidden = await page(before);
  assert.equal(hidden.status, 307, `${slug}: hidden page`);
  assert.equal(hidden.headers.get("location"), "https://predictions-sports-prime.com/");
  assert.equal(hidden.headers.get("cache-control"), "no-store");
  assert.equal((await page(at)).status, 200, `${slug}: released page`);

  const entry = content.find((item) => item.slug === slug);
  assert.ok(entry, `${slug}: no protected entry`);
  assert.equal(entry.activeFromKey, "2026-10-30");
  assert.equal(entry.releaseTimeZone, "America/New_York");
  assert.equal(entry.analysisAccess, "free");
  assert.equal(entry.predictionAccess, "free");
  assert.equal(entry.prediction.main, expected[slug].pick);
  assert.equal(entry.prediction.odds, expected[slug].odds);
  const api = (now: Date) => createMatchContentHandler(content, () => now)({ request: new Request(`https://predictions-sports-prime.com/api/match-content/${slug}`), params: { slug }, env: {} } as never);
  const closed = await api(before);
  assert.equal(closed.status, 404, `${slug}: API before release`);
  assert.match(closed.headers.get("cache-control") ?? "", /no-store/);
  assert.equal((await api(at)).status, 200, `${slug}: API after release`);
}

const manifest = JSON.parse(readFileSync("functions/_data/match-release.json", "utf8")) as Array<{ slug: string; date: string; timezone?: string }>;
for (const slug of Object.keys(expected)) {
  const entry = manifest.find((item) => item.slug === slug);
  assert.equal(entry?.date, "2026-10-30", `${slug}: manifest date`);
  assert.equal(entry?.timezone, "America/New_York", `${slug}: manifest zone`);
}

console.log("October 30 release tests passed (9 FREE, 0 VIP)");
