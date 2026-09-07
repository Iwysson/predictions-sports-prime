import { matches } from "../src/data/matches.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { resolveCanonicalMatches } from "../src/lib/canonical-match.ts";
import { getAdSenseIndexableSlugs } from "../src/lib/adsense-content-quality.ts";
import { buildMatchMetadataV2 } from "../src/lib/title-engine-v2.ts";
import { isMatchSearchIntentV2Eligible } from "../src/lib/search-intent-v2.ts";

const indexable = new Set(getAdSenseIndexableSlugs(editorialPredictions));
const rows = (await resolveCanonicalMatches(matches)).filter((match) => indexable.has(match.slug) && isMatchSearchIntentV2Eligible(match)).map((match) => ({ slug: match.slug, ...buildMatchMetadataV2(match) }));
const errors = [];
const titles = new Map();
for (const row of rows) {
  if (!row.title.trim() || row.title.length > 70) errors.push(`${row.slug}: invalid title length ${row.title.length}`);
  if (!/\bprediction\b/i.test(row.title)) errors.push(`${row.slug}: prediction missing`);
  if (/prediction.*prediction|betting tips.*odds.*tips/i.test(row.title)) errors.push(`${row.slug}: keyword-stuffed title`);
  if (/lineups?/i.test(row.title)) errors.push(`${row.slug}: lineup-dominant title`);
  if (!row.description.trim() || row.description.length > 160) errors.push(`${row.slug}: invalid description`);
  if (/WAIT|LIVE ENTRY|TBD|TODO|PLACEHOLDER|undefined|null/i.test(row.description)) errors.push(`${row.slug}: internal token in description`);
  const previous = titles.get(row.title.toLocaleLowerCase());
  if (previous) errors.push(`${row.slug}: duplicate title with ${previous}`);
  titles.set(row.title.toLocaleLowerCase(), row.slug);
}
console.log(`Title Engine v2: ${rows.length} pages, ${titles.size} unique titles.`);
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exitCode = 1; }
else console.log("Title Engine v2 audit: PASS");
