import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { matches } from "../src/data/matches.ts";

const expected = {
  "newcastle-united-vs-bournemouth": [14050, "7be4103e759275917a8a567a9f9eb751b3fc87e6e3cff0617a0eb1073c2519ee", "Newcastle or Draw (1X) + Over 1.5 Goals", 1.67],
  "brighton-hove-albion-vs-leeds-united": [14743, "9d4b51e0f865a05fbe8629c59730fcdc4307b4c127981985a0a03d7b14449f31", "Brighton to Win", 1.88],
  "manchester-city-vs-coventry-city": [17071, "f164340795452c693b628262db32942a9ebc2c47bc7fb690ee4ceedf71e746c5", "Manchester City -1.5 Asian Handicap", 1.62],
  "nottingham-forest-vs-tottenham-hotspur": [15183, "73ed60b45fe2a37aa630fed115f8c9809491d804fc23f402753955bf84881026", "Over 2.5 Goals", 2.05],
  "fulham-vs-crystal-palace": [12364, "a947fe171aaf140e9a30b4b4a1b58949524ff828fb31744b16629416bdfe213b", "Fulham or Draw (1X) + Over 1.5 Goals", 1.75],
  "brentford-vs-sunderland": [12429, "aef78e48fbad859d8b5d360b3608cfeb43a2f0be776f156c1e67c1a57c6b9f61", "Over 2.5 Goals", 1.90],
  "atletico-mineiro-vs-cruzeiro": [19102, "abc47a9f6cb5e8262e32bf99fa5c4090adf27ea82593ebab5c29a54839252877", "Atlético Mineiro or Draw (1X) + Under 3.5 Goals", 1.72],
  "flamengo-vs-mirassol": [18523, "591ceda6c4e84fec733f2c25f9430082900aa068cd86bb873b58b9291ceb791b", "Flamengo -1.5 Asian Handicap", 1.82],
  "santos-vs-palmeiras": [16699, "826ddd08e153e4774eb2871bc6be71b6f135f337ed2343cfb8d18615b6b1d332", "Santos +2 Asian Handicap + Over 1.5 Goals", 1.75],
  "vitoria-vs-vasco-da-gama": [16095, "75ce41a490f9a17c860ebf5f419a324a106752e2d8b7886e94f591e7e7ed57ec", "Over 1.5 Goals — WAIT LIVE", 1.44],
  "gremio-vs-internacional": [12700, "8a553f165dac06bd32aa6d754666df3a5f540876336c21c3be3d27936edac5ee", "Grêmio or Draw (1X) + Under 3.5 Goals", 1.65],
  "vfb-stuttgart-vs-1-fc-koln": [9261, "310a7816fb0f9524ce72917d76e384493ff18371ae38e6a889c368fd062053d5", "Stuttgart to Win + Over 7.5 Corners", 1.70],
  "bayer-04-leverkusen-vs-1-fc-union-berlin": [9603, "6911c53e140e0cffa0dbc90defd5b570f8bc2973af3b6e6921e004051f455f33", "Bayer Leverkusen to Win + Over 1.5 Goals", 1.65],
  "tsg-1899-hoffenheim-vs-borussia-dortmund": [9924, "c0cd2eae3135c34e3b020e5b35617d64f19b29c1841f8507aad631c14ecd8a75", "Hoffenheim or Draw (1X) + Over 7.5 Corners", 2.02],
  "sv-werder-bremen-vs-rb-leipzig": [8916, "e786e3e5383b9d27ed641e7fe8c85075a0f9739fcda2c09bdc65187b762d9b27", "RB Leipzig or Draw (X2) + Over 1.5 Goals", 1.60],
  "borussia-monchengladbach-vs-sv-07-elversberg": [24791, "eef7fc28311a70c45bc3386ee994f14c64c75ff13eaa4fed880c4542b0ef22f4", "Borussia Mönchengladbach to Win", 1.62],
  "schalke-04-vs-bayern-munchen": [22778, "15e38f9de63dc60b405b277782c601b1e0ace1cd8a64986067bb870b8a637cca", "Bayern Munich -1 Asian Handicap", 1.78],
  "hamburger-sv-vs-1-fsv-mainz-05": [18527, "32d2ae34d933a438f4f05ffe72c2ee2abd424a29ed53f26cc8c1de8eb8fdd095", "Over 2.5 Goals", 1.67],
  "eintracht-frankfurt-vs-augsburg": [19958, "304f1fe5c1d0a9ea51bbf5b54d1c77ff64dcb48d64e83765f3bd5fa24ce8b11e", "Eintracht Frankfurt to Win", 1.93],
  "real-sociedad-vs-celta-vigo": [14779, "2c09fd5cc986f5fe95ab3655462591a99639bc4b544dd3aad8a29100ea9f1466", "Real Sociedad or Draw (1X) + Over 1.5 Goals", 1.70],
};

assert.equal(Object.keys(expected).length, 20);
const slugs = new Set(matches.map((match) => match.slug));
assert.equal(slugs.size, matches.length, "Duplicate canonical fixture pages detected");

for (const [slug, [length, hash, pick, odds]] of Object.entries(expected)) {
  const prediction = editorialPredictions.find((item) => (item.slug ?? "") === slug);
  assert.ok(prediction, `${slug}: editorial record missing`);
  assert.equal(prediction.published, true, `${slug}: not published`);
  assert.equal(prediction.analysisFormat, "markdown", `${slug}: rich editorial rendering not enabled`);
  assert.equal(prediction.analysis.length, 1, `${slug}: supplied article must remain one intact source string`);
  const markdown = prediction.analysis[0];
  assert.equal(markdown.length, length, `${slug}: article length changed`);
  assert.equal(createHash("sha256").update(markdown).digest("hex"), hash, `${slug}: supplied article content changed or was truncated`);
  assert.equal((markdown.match(/^\*\*Statistical Core\*\*$/gmu) ?? []).length, 1, `${slug}: Statistical Core heading count must be exactly one`);
  assert.equal((markdown.match(/^\|\s*Metric\s*\|/gmu) ?? []).length, 1, `${slug}: Statistical Core table count must be exactly one`);
  assert.equal(prediction.picks.main, pick, `${slug}: prediction differs from supplied package`);
  assert.equal(prediction.picks.publishedOdds, odds, `${slug}: odds differ from supplied package`);
  assert.equal(matches.filter((match) => match.slug === slug).length, 1, `${slug}: canonical page count must be one`);
}

console.log("Supplied publication audit: PASS (20/20 intact, Statistical Core 20/20, unique fixtures 20/20)");
