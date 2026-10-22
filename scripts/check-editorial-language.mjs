import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";
import { nhlMatches } from "../src/lib/nhl.ts";
import { SLATES } from "../src/data/nhl/slates.ts";
import { NFL_WEEKS } from "../src/data/nfl/weeks.ts";
import { findPortuguesePatterns, sourceLabelsForCheck } from "./lib/editorial-language.mjs";

const nhlProtectedFiles = ["src/data/nhl/protected-2026-10-07.json", "src/data/nhl/protected-2026-10-08.json", "src/data/nhl/protected-2026-10-09.json"];
const nhlProtectedRecords = nhlProtectedFiles.flatMap((file) => {
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  return parsed.entries.map((entry) => ({
    label: `nhl-protected/${entry.slug}`,
    teamNames: [],
    text: [entry.pick, ...entry.analysis].join("\n"),
  }));
});

const nflProtectedFiles = ["src/data/nfl/week5-2026-protected.json", "src/data/nfl/week6-2026-protected.json"];
const nflProtectedRecords = nflProtectedFiles.flatMap((file) => {
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  return parsed.entries.map((entry) => ({
    label: `nfl-protected/${entry.slug}`,
    teamNames: [],
    text: [entry.pick, ...entry.analysis].join("\n"),
  }));
});

const nhlSlateRecords = SLATES.flatMap((slate) => [
  ...slate.matches.map((match) => ({
    label: `nhl-slate/${match.slug}`,
    teamNames: [match.homeTeam, match.awayTeam],
    text: [match.title, match.teaser, match.pick, ...(match.analysis ?? []), ...sourceLabelsForCheck(match.sources)].filter(Boolean).join("\n"),
  })),
  ...slate.multiples.map((multiple, index) => ({
    label: `nhl-slate/${slate.dayKey}/multiple-${index}`,
    teamNames: [],
    text: [multiple.title, multiple.badge, multiple.comment, ...multiple.legs.flatMap((leg) => [leg.fixture, leg.pick])].filter(Boolean).join("\n"),
  })),
]);

const nflPublicRecords = NFL_WEEKS.flatMap((week) => week.games).map((game) => ({
  label: `nfl-public/${game.slug}`,
  teamNames: [game.homeTeam, game.awayTeam],
  text: [game.title, game.teaser, game.pick, ...(game.analysis ?? []), ...sourceLabelsForCheck(game.sources)].filter(Boolean).join("\n"),
}));

const activeEditorial = editorialPredictions.filter((prediction) =>
  prediction.published === true && classifyPspEditorialLifecycle(prediction) !== "historical-frozen"
);
const records = [
  ...activeEditorial.map((prediction) => ({
    label: `${prediction.league}/${prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`}`,
    teamNames: [prediction.homeTeam, prediction.awayTeam],
    text: [prediction.seoTitle, prediction.title, prediction.teaser, prediction.trend, prediction.picks.main, ...prediction.analysis, ...sourceLabelsForCheck(prediction.sources)].filter(Boolean).join("\n"),
  })),
  ...nhlMatches().map((match) => ({
    label: `nhl/${match.slug}`,
    teamNames: [match.homeTeam, match.awayTeam],
    text: [match.title, match.pick, match.teaser, ...match.analysis, ...sourceLabelsForCheck(match.sources)].join("\n"),
  })),
  ...nhlSlateRecords,
  ...nhlProtectedRecords,
  ...nflPublicRecords,
  ...nflProtectedRecords,
];

const failures = records.flatMap(({ label, teamNames, text }) =>
  findPortuguesePatterns({ teamNames, text }).map((pattern) => `${label}: ${pattern}`),
);

console.log(`English editorial language check: ${records.length} active records, ${failures.length} Portuguese matches`);
for (const failure of failures) console.error(`ERROR: ${failure}`);
if (failures.length) process.exitCode = 1;
