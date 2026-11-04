// The November 4 football wave: 14 FREE, 0 VIP, original picks and odds, four analysis paragraphs, one Core per
// analysis, and the New York midnight gate on the page, the API and the sitemap. Run: npm run test:nov04-release
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { parsePredictionMarket } from "../src/lib/prediction-results.ts";
import { localDateTimeToUtc } from "../src/lib/match-time.ts";
import { createMiddlewareHandler } from "../functions/_middleware.js";
import { createMatchContentHandler } from "../functions/api/match-content/[slug].js";

// Kick-offs from the ESPN fixture listing, in UTC.
const expected: Record<string, { league: string; pick: string; odds: number; kickoffUtc: string; zone: string }> = {
  "athletico-pr-vs-vasco": { league: "brasileirao-serie-a", pick: "Athletico-PR or Draw (1X) + Over 1.5 Goals", odds: 1.72, kickoffUtc: "2026-11-04T22:30:00Z", zone: "America/Sao_Paulo" },
  "flamengo-vs-gremio": { league: "brasileirao-serie-a", pick: "Flamengo -1.5 Goals (handicap)", odds: 1.5, kickoffUtc: "2026-11-04T22:30:00Z", zone: "America/Sao_Paulo" },
  "sao-paulo-vs-corinthians": { league: "brasileirao-serie-a", pick: "São Paulo or Draw (1X) + Over 1.5 Goals", odds: 2.0, kickoffUtc: "2026-11-05T00:30:00Z", zone: "America/Sao_Paulo" },
  "botafogo-vs-atletico-mg": { league: "brasileirao-serie-a", pick: "Botafogo to Win", odds: 1.73, kickoffUtc: "2026-11-05T00:30:00Z", zone: "America/Sao_Paulo" },
  "aek-athens-vs-real-madrid": { league: "champions-league", pick: "Real Madrid -1.5 Goals (handicap)", odds: 1.61, kickoffUtc: "2026-11-04T17:45:00Z", zone: "Europe/Athens" },
  "fenerbahce-vs-liverpool": { league: "champions-league", pick: "Fenerbahçe +1.5 Goals (handicap)", odds: 1.74, kickoffUtc: "2026-11-04T17:45:00Z", zone: "Europe/Istanbul" },
  "slavia-prague-vs-arsenal": { league: "champions-league", pick: "Arsenal -1.5 Goals (handicap)", odds: 1.74, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Prague" },
  "psv-eindhoven-vs-club-brugge": { league: "champions-league", pick: "PSV Eindhoven or Draw (1X) + Over 2.5 Goals", odds: 1.88, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Amsterdam" },
  "borussia-dortmund-vs-real-betis": { league: "champions-league", pick: "Over 2.5 Goals", odds: 1.6, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Berlin" },
  "viking-vs-sabah": { league: "champions-league", pick: "Viking to Win + Over 2.5 Goals", odds: 1.7, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Oslo" },
  "fc-porto-vs-napoli": { league: "champions-league", pick: "Over 2.5 Goals", odds: 1.71, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Lisbon" },
  "rb-leipzig-vs-manchester-city": { league: "champions-league", pick: "Over 3.5 Goals", odds: 1.86, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Berlin" },
  "lens-vs-como": { league: "champions-league", pick: "Lens or Draw (1X)", odds: 1.85, kickoffUtc: "2026-11-04T20:00:00Z", zone: "Europe/Paris" },
  "rennes-vs-olympiacos": { league: "uefa-europa-league", pick: "Rennes or Draw (1X) + Over 1.5 Goals", odds: 1.74, kickoffUtc: "2026-11-04T15:30:00Z", zone: "Europe/Paris" },
};

const wave = editorialPredictions.filter((prediction) => prediction.matchInfo?.date === "2026-11-04");
assert.equal(wave.length, 14);
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
  const kickoff = localDateTimeToUtc(prediction.matchInfo!.date, prediction.matchInfo!.time!, want.zone);
  assert.equal(kickoff && new Date(kickoff).toISOString(), new Date(want.kickoffUtc).toISOString(), `${prediction.slug}: kick-off`);
  assert.deepEqual(parsePredictionMarket(prediction.picks.main).unsupportedLegs, [], `${prediction.slug}: pick must be settleable`);
  const text = prediction.analysis.join("\n");
  assert.ok(!/BEST BET|PRIME VIP/i.test(text), `${prediction.slug}: VIP label`);
  assert.equal((text.match(/### Statistical Core Predictions-Sports-Prime/g) ?? []).length, 1, `${prediction.slug}: one Core`);
  assert.equal((text.match(/\| Metric \|/g) ?? []).length, 1, `${prediction.slug}: one table`);
  assert.equal(text.split("\n").filter((line) => /^\| (?!Metric|---)/.test(line)).length, 23, `${prediction.slug}: 23 Core rows`);
  const body = text.slice(text.indexOf("## Match Analysis") + 17, text.indexOf("### Statistical Core"));
  assert.deepEqual([...body.matchAll(/^### (.+)$/gm)].map((match) => match[1]), ["Match Context", "Statistical Analysis", "Tactical Analysis", "Betting Analysis"], `${prediction.slug}: section order`);
  const paragraphs = body.split(/\n\n+/).map((part) => part.trim()).filter((part) => part && !part.startsWith("#"));
  assert.equal(paragraphs.length, 4, `${prediction.slug}: four analysis paragraphs`);
  for (const paragraph of paragraphs) assert.ok(paragraph.length > 250, `${prediction.slug}: paragraph too thin`);
  assert.ok(!/\b(?:codex|zip|checksum|repository|script|our dataset|provided pick|supplied|internal model|package)\b/i.test(text), `${prediction.slug}: internal wording in public text`);
  const lineups = text.slice(text.indexOf("## Probable Starting XIs"), text.indexOf("## Match Analysis"));
  assert.equal((lineups.match(/^\*\*.+\((?:home|away)\):\*\*/gm) ?? []).length, 2, `${prediction.slug}: both XIs`);
  for (const metric of ["Expected goals xG / match", "Expected goals allowed xGA / match", "Goals scored / match", "Shots taken / match", "Average possession", "Corners taken / match", "Big chances created / match", "Matches in venue sample"]) {
    assert.ok(text.includes(metric), `${prediction.slug}: ${metric}`);
  }
  assert.ok(text.trimEnd().endsWith(`**Prediction:** **${want.pick}**\n**Odds:** **${want.odds.toFixed(2)}**`), `${prediction.slug}: closing pick`);
  const rawImplied = `${(100 / want.odds).toFixed(2)}%`;
  assert.ok(text.includes(rawImplied), `${prediction.slug}: implied probability ${rawImplied}`);
}

// The gate: 00:00 in New York on the match date (05:00 UTC, EST), never earlier.
const before = new Date("2026-11-04T04:59:59Z");
const at = new Date("2026-11-04T05:00:00Z");
const release = new Map(Object.keys(expected).map((slug) => [slug, { date: "2026-11-04", timezone: "America/New_York" }]));
const middleware = (now: Date) => createMiddlewareHandler({ settledSlugs: new Set(), releaseDateBySlug: release, gatedSitemapEntries: new Map(), now: () => now });
const content = JSON.parse(readFileSync("functions/_data/match-content.json", "utf8")) as Array<{ slug: string; activeFromKey?: string; releaseTimeZone?: string; analysisAccess: string; predictionAccess: string; prediction: { main: string; odds: number } }>;
for (const slug of Object.keys(expected)) {
  const page = (now: Date) => middleware(now)({ request: new Request(`https://predictions-sports-prime.com/match/${slug}/`), next: async () => new Response("page") } as never);
  const hidden = await page(before);
  assert.equal(hidden.status, 307, `${slug}: hidden page`);
  assert.equal(hidden.headers.get("location"), "https://predictions-sports-prime.com/");
  assert.equal(hidden.headers.get("cache-control"), "no-store");
  assert.equal((await page(at)).status, 200, `${slug}: released page`);

  const entries = content.filter((item) => item.slug === slug);
  assert.equal(entries.length, 1, `${slug}: one protected entry`);
  const entry = entries[0];
  assert.equal(entry.activeFromKey, "2026-11-04");
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
  assert.equal(entry?.date, "2026-11-04", `${slug}: manifest date`);
  assert.equal(entry?.timezone, "America/New_York", `${slug}: manifest zone`);
}

console.log("November 4 release tests passed (14 FREE, 0 VIP)");
