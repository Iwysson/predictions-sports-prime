import { matches } from "../src/data/matches.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { resolveCanonicalMatches } from "../src/lib/canonical-match.ts";
import { getAdSenseIndexableSlugs } from "../src/lib/adsense-content-quality.ts";
import { getMatchSearchIntent, intentOwnership } from "../src/lib/search-intent-v2.ts";

const indexable = new Set(getAdSenseIndexableSlugs(editorialPredictions));
const ownership = new Map();
const errors = [];
for (const match of (await resolveCanonicalMatches(matches)).filter((item) => indexable.has(item.slug))) {
  const intent = getMatchSearchIntent(match);
  const previous = ownership.get(intent.primaryIntent);
  if (previous && previous !== intent.ownerUrl) errors.push(`${intent.primaryIntent}: ${previous} conflicts with ${intent.ownerUrl}`);
  ownership.set(intent.primaryIntent, intent.ownerUrl);
  if (/lineups?|team news|injur|kickoff|venue/i.test(intent.primaryIntent)) errors.push(`${match.slug}: contextual intent owns match page`);
}
const fixedOwners = new Map([
  ["football predictions", "/"],
  ["football prediction results", "/results/"],
]);
for (const [intent, url] of fixedOwners) if (ownership.has(intent) && ownership.get(intent) !== url) errors.push(`${intent}: fixed owner conflict`);
console.log(`Intent ownership: ${ownership.size} match intents plus ${fixedOwners.size} fixed owners.`);
console.log(`Ownership contract: ${JSON.stringify(intentOwnership)}`);
if (errors.length) { errors.forEach((error) => console.error(`ERROR: ${error}`)); process.exitCode = 1; }
else console.log("Intent ownership audit: PASS");
