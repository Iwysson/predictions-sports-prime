// Football match-page lifecycle: a /match/[slug] page exists until the match is FINAL and
// settled in the permanent results dataset. No network, no build.
import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { hasMatchPage, isSettledPrediction, predictionResultKey, settledResultKeys } from "../src/lib/match-page-lifecycle.ts";
import { matches } from "../src/data/matches.ts";
import { buildLeagueSitemap, buildUpcomingMatchesSitemap } from "../src/lib/sitemap-data.ts";
import { buildContentIndex, matchSlug } from "../src/lib/match-access.ts";
import { sortedResults, latestResults, summarizeResults, type FootballResultsDataset } from "../src/lib/football-results.ts";
import { onRequest } from "../functions/_middleware.js";
import type { EditorialPrediction } from "../src/types/index.ts";

let failures = 0;
const check = (name: string, ok: boolean) => { console.log(`${ok ? "PASS" : "FAIL"} ${name}`); if (!ok) failures += 1; };

const base = (slug: string, date: string, time: string): EditorialPrediction => ({
  league: "brasileirao-serie-a", homeTeam: "Aaa", awayTeam: "Bbb", slug, analysis: ["x"],
  picks: { main: "Aaa to Win", publishedOdds: 1.8 }, matchInfo: { date, time }, published: true,
} as EditorialPrediction);
const upcoming = base("upcoming-game", "2999-01-01", "20:00");
const live = base("live-game", "2000-01-01", "20:00"); // kickoff long past, no settlement yet: LIVE or awaiting final
const finalUnsettled = base("final-unsettled-game", "2000-01-02", "20:00");
const finalSettled = base("final-settled-game", "2000-01-03", "20:00");
const noKickoff = { ...base("no-kickoff", "2999-01-01", "20:00"), matchInfo: {} } as EditorialPrediction;
const settled = new Set([predictionResultKey(finalSettled)]);

check("UPCOMING -> match page exists", hasMatchPage(upcoming, settled));
check("LIVE -> match page exists", hasMatchPage(live, settled));
check("FINAL without settlement -> match page still exists", hasMatchPage(finalUnsettled, settled));
check("FINAL + settled -> match page no longer generated", !hasMatchPage(finalSettled, settled) && isSettledPrediction(finalSettled, settled));
check("no recorded kickoff -> never published (unresolved quarantine)", !hasMatchPage(noKickoff, settled));

const preds = editorialPredictions as EditorialPrediction[];
const dataset = JSON.parse(readFileSync("src/data/football-results.snapshot.json", "utf8")) as FootballResultsDataset;
const records = Object.values(dataset.records);

// Every settled record leaves the generated set; every other published prediction with a kickoff stays.
const withPage = preds.filter((p) => hasMatchPage(p));
check("no generated page for any settled record", withPage.every((p) => !settledResultKeys.has(predictionResultKey(p))));
check("every published prediction with a kickoff and no settlement keeps its page", preds.filter((p) => p.published === true && p.matchInfo?.date && p.matchInfo?.time && !settledResultKeys.has(predictionResultKey(p))).length === withPage.length);

// History safety: every settled record is complete and still derives from a published prediction.
const complete = records.every((r) => r.slug && r.league && r.homeTeam && r.awayTeam && r.date && r.prediction && r.odds !== undefined && r.finalScore && Number.isInteger(r.finalScore.home) && Number.isInteger(r.finalScore.away) && r.result && r.settledAt && r.predictionAccess);
check(`results dataset: ${records.length} settled records carry slug, teams, date, pick, odds, access, score, outcome, settledAt`, complete && records.length > 0);
check("results dataset: publishedAt preserved for every record whose prediction has one", records.every((r) => { const p = preds.find((x) => predictionResultKey(x) === r.key); return !p?.publishedAt || r.publishedAt === p.publishedAt; }));

// Results and the homepage read only the dataset: they work with every match page removed.
const sorted = sortedResults(dataset);
check("/results/ + homepage source (dataset) lists every settled record without any match page", sorted.length === records.length && latestResults(dataset, 6).length === Math.min(6, records.length));
const cruzeiro = dataset.records["brasileirao-serie-a:cruzeiro-vs-sao-paulo"];
check("original pick/odds/score/outcome preserved (Cruzeiro vs São Paulo)", Boolean(cruzeiro) && cruzeiro.prediction === "Cruzeiro or Draw (1X) + Over 1.5 Goals" && cruzeiro.odds === 1.67 && cruzeiro.finalScore.home === 2 && cruzeiro.finalScore.away === 0 && cruzeiro.result === "green");
check("track record counts the removed pages' results", summarizeResults(records).settled === records.length);

// Listings, sitemaps and the protected index never reference a removed page.
const settledSlugs = new Set(records.map((r) => r.slug));
check("listings (matches) exclude settled matches", matches.every((m) => !settledSlugs.has(m.slug)));
const urls = [...buildLeagueSitemap("brasileirao-serie-a"), ...buildUpcomingMatchesSitemap()].map((e) => e.url);
check("sitemaps omit every removed match URL", urls.every((u) => ![...settledSlugs].some((s) => u.includes(`/match/${s}/`))));
const index = buildContentIndex(preds, new Date());
check("protected content index drops settled matches (no premium analysis kept)", index.every((e) => !settledSlugs.has(e.slug) || !preds.some((p) => matchSlug(p) === e.slug && settledResultKeys.has(predictionResultKey(p)))));

// A removed URL answers 410; an unknown URL stays 404; an existing page is untouched.
const ctx = (path: string, status: number) => ({ request: new Request("https://predictions-sports-prime.com" + path), next: async () => new Response("page", { status }) });
const some = [...settledSlugs][0];
check("removed settled URL -> 410 Gone", (await onRequest(ctx(`/match/${some}/`, 404))).status === 410);
check("removed settled URL in a locale path -> 410 Gone", (await onRequest(ctx(`/fr/match/${some}/`, 404))).status === 410);
check("unknown match URL -> 404", (await onRequest(ctx("/match/never-existed/", 404))).status === 404);
check("existing page -> 200 untouched", (await onRequest(ctx(`/match/${some}/`, 200))).status === 200);

console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
process.exit(failures ? 1 : 0);
