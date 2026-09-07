import { matches } from "../src/data/matches.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { resolveCanonicalMatches } from "../src/lib/canonical-match.ts";
import { getAdSenseIndexableSlugs } from "../src/lib/adsense-content-quality.ts";
import { buildMatchMetadataV2 } from "../src/lib/title-engine-v2.ts";
import { isMatchSearchIntentV2Eligible } from "../src/lib/search-intent-v2.ts";

const indexable = new Set(getAdSenseIndexableSlugs(editorialPredictions));
const rows = (await resolveCanonicalMatches(matches)).filter((match) => indexable.has(match.slug) && isMatchSearchIntentV2Eligible(match)).map((match) => ({ match, copy: buildMatchMetadataV2(match) }));
const errors = [];
for (const { match, copy } of rows) {
  if (!/\bprediction\b/i.test(copy.title)) errors.push(`${match.slug}: prediction missing from title`);
  if (!/\bprediction\b/i.test(copy.h1)) errors.push(`${match.slug}: prediction missing from H1`);
  if (!/selection|prediction|pick/i.test(copy.intro)) errors.push(`${match.slug}: prediction absent from first block`);
  if (/lineups?|team news|injur|suspension/i.test(copy.title)) errors.push(`${match.slug}: supporting intent dominates title`);
  if (copy.intent.supportingIntents.length > 4) errors.push(`${match.slug}: excessive supporting intents`);
}
console.log(`Prediction First v2: ${rows.length} indexable match pages audited.`);
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exitCode = 1; }
else console.log("Prediction First v2 audit: PASS");
