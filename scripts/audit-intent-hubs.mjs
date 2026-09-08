import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { intentHubDefinitions, intentHubSlugs, selectIntentHubMatches } from "../src/lib/intent-hubs.ts";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { resolveHomeTemporalBucket, localTodayISO } from "../src/lib/match-feed.ts";

const root = process.cwd();
const definitions = intentHubSlugs.map((slug) => intentHubDefinitions[slug]);
assert.equal(definitions.length, 5, "exactly five authorized intent hubs are required");
for (const field of ["intent", "title", "h1", "description", "intro"]) {
  assert.equal(new Set(definitions.map((hub) => hub[field])).size, 5, `${field} must be unique`);
}
for (const hub of definitions) {
  const page = readFileSync(join(root, "src", "app", "(en)", hub.slug, "page.tsx"), "utf8");
  assert.match(page, new RegExp(`intentHubMetadata\\(\"${hub.slug}\"\\)`), `${hub.slug}: shared metadata missing`);
  assert.match(page, new RegExp(`slug=\"${hub.slug}\"`), `${hub.slug}: shared renderer missing`);
  assert.ok(hub.intro.length >= 150, `${hub.slug}: intent introduction is too thin`);
  assert.ok(hub.guide.join(" ").length >= 180, `${hub.slug}: editorial guidance is too thin`);
}

const normalized = (value) => value.toLowerCase().replace(/football|soccer/g, "sport").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
assert.notEqual(normalized(intentHubDefinitions["football-predictions"].intro), normalized(intentHubDefinitions["soccer-predictions"].intro), "football/soccer are lexical clones");
assert.notEqual(normalized(intentHubDefinitions["betting-tips"].intro), normalized(intentHubDefinitions.picks.intro), "betting tips/picks are lexical clones");

const previews = matches.map(toMatchPreview);
const now = new Date();
const today = localTodayISO(now);
const todayEntries = selectIntentHubMatches("today-predictions", previews, now);
assert.ok(todayEntries.every((match) => resolveHomeTemporalBucket(match, today, now) === "today"), "today hub contains a non-today fixture");
assert.ok(todayEntries.every((match) => match.status === "published"), "today hub contains a draft");
for (const slug of intentHubSlugs) {
  assert.ok(selectIntentHubMatches(slug, previews, now).every((match) => match.status === "published"), `${slug}: unpublished fixture leaked into inventory`);
}

const sitemap = readFileSync(join(root, "src", "app", "sitemap.ts"), "utf8");
assert.match(sitemap, /intentHubSlugs/, "sitemap does not consume the authorized hub registry");
const freezeDiff = process.env.WAVE4_FREEZE_DIFF ?? "";
assert.equal(freezeDiff, "", "Historical Freeze differs from its initial state");
console.log(`Intent hubs: ${definitions.length}`);
console.log(`Today entries checked: ${todayEntries.length}`);
console.log("Intent hub source and temporal audit: PASS");
