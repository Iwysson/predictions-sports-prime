import assert from "node:assert/strict";
import { leaguesBySlug } from "../src/data/leagues.ts";
import { buildEditorialQueue, buildUpcomingFixtureDrafts } from "../src/lib/upcoming-fixtures.ts";

const now = new Date();
const queue = buildEditorialQueue(now);
const drafts = buildUpcomingFixtureDrafts(now);
const byLeague = new Map();
const errors = [];
const seen = new Set();
const draftIndex = new Set(
  drafts.map((draft) => `${draft.league}:${draft.date}:${draft.kickoff}:${draft.homeTeam}:${draft.awayTeam}`)
);
const leagueNameToSlug = new Map(
  Object.values(leaguesBySlug).map((league) => [league.name, league.slug])
);

function prettyDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  }).format(date);
}

for (const item of queue) {
  byLeague.set(item.league, (byLeague.get(item.league) ?? 0) + 1);

  const key = `${item.league}:${item.slug}`;
  if (seen.has(key)) {
    errors.push(`Duplicate queue item: ${key}`);
  }
  seen.add(key);

  if (!item.kickoff) {
    errors.push(`Draft without kickoff: ${key}`);
  }

  const kickoffDate = new Date(`${item.date}T${item.kickoff}:00Z`);
  if (Number.isNaN(kickoffDate.valueOf())) {
    errors.push(`Invalid kickoff: ${key}`);
  } else if (kickoffDate.valueOf() < now.valueOf()) {
    errors.push(`Draft kickoff in the past: ${key}`);
  }
}

const draftLookup = new Set(drafts.map((draft) => `${draft.league}:${draft.slug}`));
for (const item of queue) {
  const leagueSlug = leagueNameToSlug.get(item.league);
  const key = `${item.league}:${item.slug}`;
  const identity = leagueSlug
    ? `${leagueSlug}:${item.date}:${item.kickoff}:${item.homeTeam}:${item.awayTeam}`
    : null;

  if (!identity || !draftIndex.has(identity)) {
    errors.push(`Queue item missing draft backing: ${key}`);
  }
}

assert.equal(queue.filter((item) => item.editorialStatus === "ready_for_analysis").length, queue.length);

console.log("Editorial Queue");

for (const urgency of ["URGENT", "HIGH", "NORMAL", "EARLY"]) {
  const items = queue.filter((item) => item.urgency === urgency);
  console.log("");
  console.log(`${urgency} (${items.length})`);
  if (items.length === 0) {
    console.log("- none");
    continue;
  }

  let currentDate = "";
  for (const item of items) {
    if (item.date !== currentDate) {
      currentDate = item.date;
      console.log(prettyDate(item.date));
    }
    console.log(`- ${item.homeTeam} vs ${item.awayTeam} — ${item.league} — ${item.kickoff}`);
  }
}

console.log("");
console.log("By league");
for (const [league, count] of [...byLeague.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`${league}: ${count}`);
}

console.log("");
console.log(`Prepared drafts: ${drafts.length}`);
console.log(`Editorial queue items: ${queue.length}`);
console.log(`URGENT: ${queue.filter((item) => item.urgency === "URGENT").length}`);
console.log(`HIGH: ${queue.filter((item) => item.urgency === "HIGH").length}`);
console.log(`NORMAL: ${queue.filter((item) => item.urgency === "NORMAL").length}`);
console.log(`EARLY: ${queue.filter((item) => item.urgency === "EARLY").length}`);
console.log(`Queue errors: ${errors.length}`);

console.log("");
console.log("First 20");
for (const item of queue.slice(0, 20)) {
  console.log(`${item.urgency} | ${item.date} | ${item.homeTeam} vs ${item.awayTeam} | ${item.league} | ${item.kickoff}`);
}

for (const error of errors) {
  console.error(`ERROR: ${error}`);
}

if (errors.length > 0) {
  process.exitCode = 1;
}

console.log(errors.length === 0 ? "Editorial queue report: PASS" : "Editorial queue report: FAIL");
