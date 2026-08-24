import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { leagues } from "../src/data/leagues.ts";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { loadLeagueSeason, getFixtureSnapshotMetadata, teamNamesMatch } from "../src/lib/openfootball.ts";
import {
  getMatchLifecycleStatus,
  isRoundCompleted,
  resolveCompetitionRounds,
} from "../src/lib/match-lifecycle.ts";
import { buildCompetitionRoundSurface, factualFixtureIdentity } from "../src/lib/competition-rounds.ts";
import { isCompletedFixture, isNonPlayableFixture } from "../src/lib/fixture-status.ts";
import { validateLeagueRounds } from "../src/lib/data-validation.ts";

const now = new Date("2026-08-24T12:00:00Z");
const snapshot = getFixtureSnapshotMetadata();
const snapshotAgeHours = Math.max(0, (now.valueOf() - Date.parse(snapshot.generatedAt)) / 3_600_000);

function game(round, index, status, kickoffUtc) {
  return {
    id: `regression-${round}-${index}`,
    round,
    date: kickoffUtc.slice(0, 10),
    time: kickoffUtc.slice(11, 16),
    kickoffUtc,
    homeTeam: `R${round} Home ${index}`,
    awayTeam: `R${round} Away ${index}`,
    homeScore: status === "completed" ? 1 : null,
    awayScore: status === "completed" ? 0 : null,
    status,
  };
}

function regressionRound(round, statuses, date) {
  return {
    round,
    games: statuses.map((status, index) =>
      game(round, index + 1, status, `${date}T${String(12 + index).padStart(2, "0")}:00:00Z`)
    ),
  };
}

const lifecycleBoundaries = [
  { expected: "upcoming", fixture: { status: "scheduled", kickoffUtc: "2026-08-24T12:00:01Z" } },
  { expected: "live", fixture: { status: "in-progress", kickoffUtc: "2026-08-24T12:00:00Z" } },
  { expected: "completed", fixture: { status: "completed", kickoffUtc: "2026-08-24T11:59:59Z" } },
  { expected: "postponed", fixture: { status: "postponed", kickoffUtc: "2026-08-24T12:00:01Z" } },
  { expected: "cancelled", fixture: { status: "canceled", kickoffUtc: "2026-08-24T12:00:01Z" } },
];
for (const boundary of lifecycleBoundaries) {
  assert.equal(getMatchLifecycleStatus(boundary.fixture, now), boundary.expected);
}

const completedPromotion = resolveCompetitionRounds([
  regressionRound(1, ["completed", "completed"], "2026-08-20"),
  regressionRound(2, ["scheduled", "scheduled"], "2026-08-25"),
  regressionRound(3, ["scheduled", "scheduled"], "2026-09-01"),
], now);
assert.equal(completedPromotion.currentRound?.round, 2);
assert.equal(completedPromotion.nextRound?.round, 3);

const secondPromotion = resolveCompetitionRounds([
  regressionRound(2, ["completed", "completed"], "2026-08-20"),
  regressionRound(3, ["scheduled", "scheduled"], "2026-08-25"),
  regressionRound(4, ["scheduled", "scheduled"], "2026-09-01"),
], now);
assert.equal(secondPromotion.currentRound?.round, 3);
assert.equal(secondPromotion.nextRound?.round, 4);

const partialRound = resolveCompetitionRounds([
  regressionRound(2, [
    "completed", "completed", "completed", "completed", "completed",
    "completed", "completed", "completed", "scheduled", "scheduled",
  ], "2026-08-25"),
  regressionRound(3, ["scheduled", "scheduled"], "2026-09-01"),
], now);
assert.equal(partialRound.currentRound?.round, 2, "A partial round must not promote");
assert.equal(partialRound.currentFixtures.length, 2, "Completed fixtures must leave the active surface");
assert.equal(partialRound.nextRound?.round, 3);

const terminalNonPlayable = resolveCompetitionRounds([
  regressionRound(1, ["completed", "postponed"], "2026-08-20"),
  regressionRound(2, ["scheduled", "scheduled"], "2026-08-25"),
], now);
assert.equal(terminalNonPlayable.currentRound?.round, 2, "Central non-playable policy must be deterministic");
console.log("Round promotion regressions: PASS");

let currentMissingTotal = 0;
let nextMissingTotal = 0;
let currentDuplicateTotal = 0;
let nextDuplicateTotal = 0;
let publishedAsComingSoon = 0;
let completedStillActive = 0;
let prematurePromotions = 0;
let completedRoundsStuck = 0;
const productionExpectations = new Map();
const comingSoonSlugs = new Set();

console.log("");
console.log("Competition Round Coverage");
console.log(`Snapshot generated: ${snapshot.generatedAt}`);
console.log(`Snapshot age: ${snapshotAgeHours.toFixed(1)} hours`);

for (const league of leagues) {
  const rounds = await loadLeagueSeason(league.slug);
  const publishedMatches = matches
    .filter((match) => match.league === league.slug)
    .map(toMatchPreview);
  const surface = buildCompetitionRoundSurface({
    league: league.slug,
    rounds,
    publishedMatches,
    now,
  });

  let validationState = "SOURCE_NOT_CONFIGURED";
  if (rounds.length) {
    const validation = validateLeagueRounds(rounds, { ...league, source: league.sources.fixtures });
    assert.ok(validation.valid, `${league.name}: fixture validation failed: ${validation.errors.join(" | ")}`);
    validationState = surface.next ? "PASS" : "SOURCE_HORIZON_LIMITED";
  }

  const currentFixtures = surface.current?.factualFixtures ?? [];
  const currentMatches = surface.current?.matches ?? [];
  const nextFixtures = surface.next?.factualFixtures ?? [];
  const nextMatches = surface.next?.matches ?? [];
  const currentIdentities = currentFixtures.map((fixture) => factualFixtureIdentity(league.slug, fixture));
  const nextIdentities = nextFixtures.map((fixture) => factualFixtureIdentity(league.slug, fixture));
  const currentDuplicates = currentIdentities.length - new Set(currentIdentities).size;
  const nextDuplicates = nextIdentities.length - new Set(nextIdentities).size;
  const currentMissing = surface.sourceState === "validated"
    ? Math.max(0, currentFixtures.length - currentMatches.length)
    : 0;
  const nextMissing = surface.sourceState === "validated"
    ? Math.max(0, nextFixtures.length - nextMatches.length)
    : 0;
  const currentPublished = currentMatches.filter((match) => match.status === "published").length;
  const nextPublished = nextMatches.filter((match) => match.status === "published").length;
  const currentComingSoon = currentMatches.filter((match) => match.status === "coming-soon").length;
  const nextComingSoon = nextMatches.filter((match) => match.status === "coming-soon").length;
  const latestFutureFixture = rounds
    .flatMap((round) => round.games)
    .filter((fixture) => !isCompletedFixture(fixture.status) && !isNonPlayableFixture(fixture.status))
    .map((fixture) => fixture.kickoffUtc ?? `${fixture.date}T${fixture.time === "TBD" ? "23:59" : fixture.time}:00Z`)
    .sort()
    .at(-1) ?? "not available";

  publishedAsComingSoon += [...currentMatches, ...nextMatches].filter((match) =>
    match.status === "coming-soon" &&
    publishedMatches.some((published) =>
      teamNamesMatch(published.homeTeam, match.homeTeam) && teamNamesMatch(published.awayTeam, match.awayTeam)
    )
  ).length;
  completedStillActive += [...currentMatches, ...nextMatches].filter((match) =>
    isCompletedFixture(match.fixtureStatus) || isNonPlayableFixture(match.fixtureStatus)
  ).length;
  if (surface.current && rounds.length) {
    const rawCurrent = rounds.find((round) => round.round === surface.current.round);
    if (rawCurrent && isRoundCompleted(rawCurrent.games)) completedRoundsStuck += 1;
  }

  currentMissingTotal += currentMissing;
  nextMissingTotal += nextMissing;
  currentDuplicateTotal += currentDuplicates;
  nextDuplicateTotal += nextDuplicates;
  productionExpectations.set(league.slug, {
    current: currentMatches.length,
    next: nextMatches.length,
  });
  [...currentMatches, ...nextMatches]
    .filter((match) => match.status === "coming-soon")
    .forEach((match) => comingSoonSlugs.add(match.slug));

  const currentFactualLabel = surface.sourceState === "validated"
    ? currentFixtures.length
    : `0 (editorial fallback cards: ${currentMatches.length})`;
  const nextFactualLabel = surface.sourceState === "validated"
    ? nextFixtures.length
    : `0 (editorial fallback cards: ${nextMatches.length})`;

  console.log("");
  console.log(`Competition: ${league.name}`);
  console.log(`Source: ${surface.sourceState} | ${validationState}`);
  console.log(`Snapshot age: ${snapshotAgeHours.toFixed(1)} hours | latest future fixture: ${latestFutureFixture}`);
  console.log(`Current Round: ${surface.current?.round ?? "not available"} | factual fixtures: ${currentFactualLabel} | published: ${currentPublished} | Coming Soon: ${currentComingSoon} | missing: ${currentMissing} | duplicates: ${currentDuplicates}`);
  console.log(`Next Round: ${surface.next?.round ?? "NEXT_ROUND_SOURCE_NOT_AVAILABLE"} | factual fixtures: ${nextFactualLabel} | published: ${nextPublished} | Coming Soon: ${nextComingSoon} | missing: ${nextMissing} | duplicates: ${nextDuplicates}`);
  console.log(`Following Round factual availability: ${surface.followingRound !== null ? `YES (${surface.followingRound})` : "NO"}`);

  assert.equal(currentMissing, 0, `${league.name}: factual Current Round fixture missing`);
  assert.equal(nextMissing, 0, `${league.name}: factual Next Round fixture missing`);
  assert.equal(currentDuplicates, 0, `${league.name}: duplicate Current Round fixture`);
  assert.equal(nextDuplicates, 0, `${league.name}: duplicate Next Round fixture`);
}

assert.equal(currentMissingTotal, 0);
assert.equal(nextMissingTotal, 0);
assert.equal(currentDuplicateTotal, 0);
assert.equal(nextDuplicateTotal, 0);
assert.equal(publishedAsComingSoon, 0, "Published prediction rendered as Coming Soon");
assert.equal(completedStillActive, 0, "Completed or non-playable fixture remains active");
assert.equal(prematurePromotions, 0, "Premature round promotion");
assert.equal(completedRoundsStuck, 0, "Completed round selected as Current");

const outputDirectory = path.join(process.cwd(), "out");
let productionCoverageMismatches = 0;
let comingSoonPublicLinks = 0;
let comingSoonSitemapEntries = 0;
if (fs.existsSync(outputDirectory)) {
  for (const [slug, expected] of productionExpectations) {
    const html = fs.readFileSync(path.join(outputDirectory, "league", slug, "index.html"), "utf8");
    const cards = [...html.matchAll(/<div data-round-fixture="[^"]+" data-round-position="(current|next)" data-publication-state="([^"]+)">([\s\S]*?)<\/article><\/div>/g)];
    const currentRendered = cards.filter((card) => card[1] === "current").length;
    const nextRendered = cards.filter((card) => card[1] === "next").length;
    productionCoverageMismatches += Number(currentRendered !== expected.current);
    productionCoverageMismatches += Number(nextRendered !== expected.next);
    comingSoonPublicLinks += cards.filter((card) => card[2] === "coming-soon" && /<a\b/.test(card[3])).length;
  }

  const sitemap = fs.readFileSync(path.join(outputDirectory, "sitemap.xml"), "utf8");
  comingSoonSitemapEntries = [...comingSoonSlugs].filter((slug) =>
    sitemap.includes(`/match/${slug}/`)
  ).length;
}

assert.equal(productionCoverageMismatches, 0, "Production HTML differs from the authoritative round model");
assert.equal(comingSoonPublicLinks, 0, "Coming Soon fixture exposes a public match link");
assert.equal(comingSoonSitemapEntries, 0, "Coming Soon fixture leaked into sitemap");

console.log("");
console.log(`Current missing: ${currentMissingTotal}`);
console.log(`Next missing: ${nextMissingTotal}`);
console.log(`Current duplicates: ${currentDuplicateTotal}`);
console.log(`Next duplicates: ${nextDuplicateTotal}`);
console.log(`Published rendered as Coming Soon: ${publishedAsComingSoon}`);
console.log(`Completed fixtures still active: ${completedStillActive}`);
console.log(`Premature promotions: ${prematurePromotions}`);
console.log(`Completed rounds stuck as Current: ${completedRoundsStuck}`);
console.log(`Production round coverage mismatches: ${productionCoverageMismatches}`);
console.log(`Coming Soon public links: ${comingSoonPublicLinks}`);
console.log(`Coming Soon sitemap entries: ${comingSoonSitemapEntries}`);
console.log("Current/Next round audit: PASS");
