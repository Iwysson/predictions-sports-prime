import assert from "node:assert/strict";
import { matches } from "../src/data/matches.ts";
import { buildMatchMetadataV2 } from "../src/lib/title-engine-v2.ts";
import { getMatchSearchIntent, isMatchSearchIntentV2Eligible } from "../src/lib/search-intent-v2.ts";
import { selectRelatedPredictions } from "../src/lib/related-predictions.ts";
import { fixtureKickoffMillis } from "../src/lib/fixture-state.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { isAdSenseContentIndexable } from "../src/lib/adsense-content-quality.ts";

const published = matches.filter((match) => match.status === "published");
assert.equal(new Set(published.map((match) => match.slug)).size, published.length, "duplicate fixture slugs create multiple owners");
const future = published.filter((match) => isMatchSearchIntentV2Eligible(match) && isAdSenseContentIndexable(match.slug, editorialPredictions));
const titles = new Set();
const h1s = new Set();
for (const match of future) {
  const metadata = buildMatchMetadataV2(match);
  const intent = getMatchSearchIntent(match);
  const fixture = `${match.homeTeam} vs ${match.awayTeam}`;
  const pick = match.predictions.find((item) => item.label === "Main Prediction")?.value;
  const odds = match.predictions.find((item) => item.label === "Published Odds" || item.label === "Odds")?.value;
  assert.equal(intent.ownerUrl, `/match/${match.slug}/`, `${match.slug}: wrong canonical owner`);
  assert.ok(metadata.title.startsWith(fixture), `${match.slug}: title is not fixture-first`);
  assert.ok(metadata.h1.startsWith(fixture), `${match.slug}: H1 is not fixture-first`);
  assert.match(metadata.title.toLowerCase(), /prediction/, `${match.slug}: title is not Prediction First`);
  assert.ok(metadata.title.length <= 70, `${match.slug}: title exceeds 70 characters`);
  assert.ok(metadata.description.length <= 160, `${match.slug}: description exceeds 160 characters`);
  assert.ok(metadata.description.includes(match.homeTeam) && metadata.description.includes(match.awayTeam), `${match.slug}: fixture identity missing from description`);
  if (pick) assert.ok(metadata.description.includes(pick), `${match.slug}: real main pick missing from description`);
  if (odds) {
    assert.match(metadata.h1, /Odds/, `${match.slug}: available odds intent missing from H1`);
    assert.ok(metadata.title.includes("Odds") || metadata.reasons.includes("odds_omitted_for_length"), `${match.slug}: odds title decision is unexplained`);
  }
  assert.ok(!titles.has(metadata.title), `${match.slug}: duplicate title`);
  assert.ok(!h1s.has(metadata.h1), `${match.slug}: duplicate H1`);
  titles.add(metadata.title); h1s.add(metadata.h1);

  const related = selectRelatedPredictions(match, published, 4);
  assert.ok(related.length <= 4, `${match.slug}: too many related predictions`);
  assert.ok(related.every((item) => item.slug !== match.slug && item.status === "published"), `${match.slug}: invalid related prediction`);
  const nowMillis = Date.now();
  const sameLeagueAvailable = published.some((item) => {
    const kickoff = fixtureKickoffMillis(item);
    return item.slug !== match.slug && item.league === match.league && item.fixtureStatus !== "completed" && item.fixtureStatus !== "in-progress" && kickoff !== null && kickoff > nowMillis;
  });
  if (sameLeagueAvailable && related.length) assert.equal(related[0].league, match.league, `${match.slug}: same-league related prediction was not prioritized`);
}

const forbiddenDoorways = matches.filter((match) => /-(prediction|betting-tips|picks|odds)$/.test(match.slug));
assert.equal(forbiddenDoorways.length, 0, "keyword doorway fixture slug detected");
console.log(`Published fixture owners: ${published.length}`);
console.log(`Future Match SEO v3 pages: ${future.length}`);
console.log("Match acquisition source audit: PASS");
