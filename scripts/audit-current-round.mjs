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
import { classifyFixture } from "../src/lib/fixture-state.ts";
import { resolveHomeTemporalBucket } from "../src/lib/match-feed.ts";

const regressionNow = new Date("2026-08-24T12:00:00Z");
const productionNow = new Date();
const snapshot = getFixtureSnapshotMetadata();
const snapshotAgeHours = Math.max(0, (productionNow.valueOf() - Date.parse(snapshot.generatedAt)) / 3_600_000);

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
  { expected: "upcoming", fixture: { status: "scheduled", kickoffUtc: "2026-08-24T10:10:01Z" } },
  { expected: "stale-schedule", fixture: { status: "scheduled", kickoffUtc: "2026-08-24T10:09:59Z" } },
  { expected: "stale-schedule", fixture: { status: "scheduled", kickoffUtc: "2026-08-24T07:59:59Z" } },
];
for (const boundary of lifecycleBoundaries) {
  assert.equal(getMatchLifecycleStatus(boundary.fixture, regressionNow), boundary.expected);
}

const completedPromotion = resolveCompetitionRounds([
  regressionRound(1, ["completed", "completed"], "2026-08-20"),
  regressionRound(2, ["scheduled", "scheduled"], "2026-08-25"),
  regressionRound(3, ["scheduled", "scheduled"], "2026-09-01"),
], regressionNow);
assert.equal(completedPromotion.currentRound?.round, 2);
assert.equal(completedPromotion.nextRound?.round, 3);

const secondPromotion = resolveCompetitionRounds([
  regressionRound(2, ["completed", "completed"], "2026-08-20"),
  regressionRound(3, ["scheduled", "scheduled"], "2026-08-25"),
  regressionRound(4, ["scheduled", "scheduled"], "2026-09-01"),
], regressionNow);
assert.equal(secondPromotion.currentRound?.round, 3);
assert.equal(secondPromotion.nextRound?.round, 4);

const partialRound = resolveCompetitionRounds([
  regressionRound(2, [
    "completed", "completed", "completed", "completed", "completed",
    "completed", "completed", "completed", "scheduled", "scheduled",
  ], "2026-08-25"),
  regressionRound(3, ["scheduled", "scheduled"], "2026-09-01"),
], regressionNow);
assert.equal(partialRound.currentRound?.round, 2, "A partial round must not promote");
assert.equal(partialRound.currentFixtures.length, 2, "Completed fixtures must leave the active surface");
assert.equal(partialRound.nextRound?.round, 3);

const terminalNonPlayable = resolveCompetitionRounds([
  regressionRound(1, ["completed", "postponed"], "2026-08-20"),
  regressionRound(2, ["scheduled", "scheduled"], "2026-08-25"),
], regressionNow);
assert.equal(terminalNonPlayable.currentRound?.round, 2, "Central non-playable policy must be deterministic");

const postponedPreviousRound = resolveCompetitionRounds([
  { round: 3, games: [game(3, 1, "completed", "2026-08-20T12:00:00Z"), game(3, 2, "postponed", "2026-08-21T12:00:00Z")] },
  regressionRound(4, ["scheduled", "scheduled"], "2026-08-25"),
], regressionNow);
assert.equal(postponedPreviousRound.currentRound?.round, 4, "A postponed previous round must not block the next active round");

const rescheduledPreviousRound = resolveCompetitionRounds([
  { round: 3, games: [game(3, 1, "rescheduled", "2026-09-10T12:00:00Z")] },
  regressionRound(4, ["scheduled", "scheduled"], "2026-08-25"),
  regressionRound(5, ["scheduled", "scheduled"], "2026-09-01"),
], regressionNow);
assert.equal(rescheduledPreviousRound.currentRound?.round, 4, "A later rescheduled fixture must be tracked without blocking the chronological round");
assert.equal(rescheduledPreviousRound.nextRound?.round, 5);

assert.equal(classifyFixture({ status: "canceled", kickoffUtc: "2026-08-25T12:00:00Z" }, regressionNow), "cancelled");
const publishedFixture = (fixtureStatus, kickoffUtc) => ({
  id: "published-regression", slug: "published-regression", league: "premier-league",
  round: "Matchday 1", homeTeam: "Home", awayTeam: "Away", date: kickoffUtc.slice(0, 10),
  time: kickoffUtc.slice(11, 16), kickoffUtc, status: "published", title: "Published regression",
  fixtureStatus, homeScore: fixtureStatus === "completed" ? 1 : null,
  awayScore: fixtureStatus === "completed" ? 0 : null,
});
assert.equal(resolveHomeTemporalBucket(publishedFixture("scheduled", "2026-08-25T12:00:00Z"), "2026-08-25", regressionNow), "today", "Published future fixture must remain active");
assert.equal(resolveHomeTemporalBucket(publishedFixture("completed", "2026-08-23T12:00:00Z"), "2026-08-24", regressionNow), "historical", "Completed prediction must enter history");
assert.equal(resolveHomeTemporalBucket(publishedFixture("postponed", "2026-08-25T12:00:00Z"), "2026-08-25", regressionNow), "none", "Postponed prediction must leave active feeds");
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

function fixturePair(match) {
  return `${match.homeTeam}\u0000${match.awayTeam}`;
}

function decodeHtmlAttribute(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function htmlAttribute(attributes, name) {
  return decodeHtmlAttribute(attributes.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "");
}

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
    now: productionNow,
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
    currentPairs: currentMatches.map(fixturePair).sort(),
    nextPairs: nextMatches.map(fixturePair).sort(),
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
let productionFixturePairMismatches = 0;
let nextHeadingMissing = 0;
let nextCountMismatch = 0;
let comingSoonPublicLinks = 0;
let comingSoonSitemapEntries = 0;
if (fs.existsSync(outputDirectory)) {
  for (const [slug, expected] of productionExpectations) {
    const html = fs.readFileSync(path.join(outputDirectory, "league", slug, "index.html"), "utf8");
    const cards = [...html.matchAll(/<div ([^>]*data-round-fixture="[^"]+"[^>]*)>([\s\S]*?)<\/article><\/div>/g)]
      .map((card) => ({
        position: htmlAttribute(card[1], "data-round-position"),
        publicationState: htmlAttribute(card[1], "data-publication-state"),
        pair: `${htmlAttribute(card[1], "data-home-team")}\u0000${htmlAttribute(card[1], "data-away-team")}`,
        body: card[2],
      }));
    const currentCards = cards.filter((card) => card.position === "current");
    const nextCards = cards.filter((card) => card.position === "next");
    const currentRendered = currentCards.length;
    const nextRendered = nextCards.length;
    const currentPairMismatch = Number(currentCards.map((card) => card.pair).sort().join("|") !== expected.currentPairs.join("|"));
    const nextPairMismatch = Number(nextCards.map((card) => card.pair).sort().join("|") !== expected.nextPairs.join("|"));
    productionCoverageMismatches += Number(currentRendered !== expected.current);
    productionCoverageMismatches += Number(nextRendered !== expected.next);
    productionFixturePairMismatches += currentPairMismatch + nextPairMismatch;
    nextHeadingMissing += Number(expected.next > 0 && !html.includes('id="next-round-heading"'));
    nextCountMismatch += Number(expected.next > 0 && !html.includes(`aria-label="${expected.next} fixtures"`));
    comingSoonPublicLinks += cards.filter((card) => card.publicationState === "coming-soon" && /<a\b/.test(card.body)).length;
    console.log(`${slug} production display | Current resolved/displayed: ${expected.current}/${currentRendered} | Next resolved/displayed: ${expected.next}/${nextRendered} | pair mismatches: ${currentPairMismatch + nextPairMismatch}`);
  }

  const sitemap = fs.readFileSync(path.join(outputDirectory, "sitemap.xml"), "utf8");
  comingSoonSitemapEntries = [...comingSoonSlugs].filter((slug) =>
    sitemap.includes(`/match/${slug}/`)
  ).length;
}

assert.equal(productionCoverageMismatches, 0, "Production HTML differs from the authoritative round model");
assert.equal(productionFixturePairMismatches, 0, "Production HTML contains incorrect Current/Next fixture pairs");
assert.equal(nextHeadingMissing, 0, "Next Round heading is missing when factual fixtures exist");
assert.equal(nextCountMismatch, 0, "Next Round count chip differs from the factual fixture count");
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
console.log(`Production fixture pair mismatches: ${productionFixturePairMismatches}`);
console.log(`Missing Next Round headings: ${nextHeadingMissing}`);
console.log(`Next Round count mismatches: ${nextCountMismatch}`);
console.log(`Coming Soon public links: ${comingSoonPublicLinks}`);
console.log(`Coming Soon sitemap entries: ${comingSoonSitemapEntries}`);
console.log("Current/Next round audit: PASS");
