import assert from "node:assert/strict";
import pending from "../src/data/editorial-data/pending-matches.json" with { type: "json" };
import manual from "../src/data/editorial-data/manual-verified.json" with { type: "json" };
import { evaluateEditorialDataReadiness } from "../src/lib/editorial-data/index.ts";
import { providerCapabilities } from "../src/lib/editorial-data/providers.ts";
import { EDITORIAL_DATA_FRESHNESS } from "../src/lib/editorial-data/policy.ts";
import { CORE_METRICS } from "../src/lib/editorial-data/types.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { getAdSenseContentQualityDecision } from "../src/lib/adsense-content-quality.ts";

const scope = process.argv[2] ?? "readiness";
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
const validHttps = (value) => { try { return new URL(value).protocol === "https:"; } catch { return false; } };

assert.equal(pending.length, 31, "pending inventory must contain 31 matches");
assert.equal(new Set(pending.map((item) => item.slug)).size, 31, "pending slugs must be unique");

if (scope === "coverage") {
  assert(providerCapabilities.some((item) => item.kind === "fixture"));
  assert(providerCapabilities.some((item) => item.kind === "statistics" && item.homeAway));
  assert(providerCapabilities.some((item) => item.kind === "lineup"));
  assert(providerCapabilities.some((item) => item.kind === "team-news"));
} else if (scope === "core") {
  assert.equal(CORE_METRICS.length, 22);
  for (const core of manual.statisticalCores) {
    assert(Number.isInteger(core.matches) && core.matches > 0, `${core.team}: invalid matches`);
    for (const metric of Object.keys(core.metrics)) {
      assert(CORE_METRICS.includes(metric), `${core.team}: unknown metric ${metric}`);
      const value = core.metrics[metric];
      assert.equal(value.metric, metric, `${core.team}: metric key/name mismatch for ${metric}`);
      assert.equal(value.sampleType, core.sampleType);
      assert.equal(value.matches, core.matches);
      assert.equal(value.competition, core.competition);
      assert.equal(value.season, core.season);
      assert(validHttps(value.sourceUrl), `${core.team}: invalid source URL for ${metric}`);
      assert(Number.isFinite(Date.parse(value.fetchedAt)), `${core.team}: invalid fetchedAt for ${metric}`);
      assert.notEqual(value.value, null);
      assert.notEqual(value.value, undefined);
      assert.notEqual(value.value, "");
    }
  }
} else if (scope === "fixture") {
  for (const fixture of manual.fixtures) {
    for (const field of ["home", "away", "competition", "date", "kickoffUtc", "timezone", "source", "sourceUrl", "fetchedAt", "verifiedAt"]) {
      assert(fixture[field], `${fixture.slug}: missing ${field}`);
    }
    assert(validHttps(fixture.sourceUrl), `${fixture.slug}: invalid source URL`);
    assert(Number.isFinite(Date.parse(fixture.kickoffUtc)), `${fixture.slug}: invalid kickoffUtc`);
  }
} else if (scope === "lineup") {
  assert.equal(EDITORIAL_DATA_FRESHNESS.projectedLineupMaximumAgeHours, 72);
  for (const lineup of manual.lineups) {
    const match = pending.find((item) => item.slug === lineup.slug);
    assert(match, `${lineup.slug}: lineup references unknown pending match`);
    assert([normalize(match.home), normalize(match.away)].includes(normalize(lineup.team)), `${lineup.slug}: lineup team does not belong to fixture`);
    assert.equal(lineup.players.length, 11);
    assert(lineup.players.every(Boolean));
    assert.equal(lineup.status, "projected");
    assert(lineup.formation);
    assert(validHttps(lineup.sourceUrl), `${lineup.slug}: invalid lineup source URL`);
    assert(Number.isFinite(Date.parse(lineup.sourceDate)), `${lineup.slug}: invalid sourceDate`);
    assert(Number.isFinite(Date.parse(lineup.fetchedAt)), `${lineup.slug}: invalid fetchedAt`);
  }
} else if (scope === "team-news") {
  assert.equal(EDITORIAL_DATA_FRESHNESS.teamNewsMaximumAgeHours, 72);
  for (const news of manual.teamNews) {
    const match = pending.find((item) => item.slug === news.slug);
    assert(match, `${news.slug}: team news references unknown pending match`);
    assert(news.team, `${news.slug}: team news must identify a team`);
    assert([normalize(match.home), normalize(match.away)].includes(normalize(news.team)), `${news.slug}: team news team does not belong to fixture`);
    assert(validHttps(news.sourceUrl), `${news.slug}: invalid team-news source URL`);
    assert(Number.isFinite(Date.parse(news.sourceDate)), `${news.slug}: invalid sourceDate`);
    assert(Number.isFinite(Date.parse(news.fetchedAt)), `${news.slug}: invalid fetchedAt`);
  }
} else if (scope === "readiness") {
  const results = await Promise.all(pending.map((item) => evaluateEditorialDataReadiness(item)));
  assert.equal(results.length, 31);
  for (const result of results) {
    assert(["DATA_READY", "DATA_PUBLISHABLE_WITH_GAPS", "DATA_BLOCKED"].includes(result.state));
    if (result.state === "DATA_READY") {
      assert(result.fixture && result.homeCore && result.awayCore && result.homeLineup && result.awayLineup && result.homeTeamNews && result.awayTeamNews, `${result.slug}: DATA_READY must include every required block`);
    }
  }
  const bySlug = new Map(editorialPredictions.map((item) => [item.slug, item]));
  const actual = pending.map((item) => bySlug.get(item.slug));
  assert(actual.every((item) => item?.published === true), "all 31 pending records must be genuinely published");
  assert(actual.every((item) => getAdSenseContentQualityDecision(item).indexable), "all 31 pending records must be indexable through the runtime quality gate");
}

console.log(`Editorial data ${scope} audit: PASS`);
