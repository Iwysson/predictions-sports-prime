import { readFileSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";
import { nhlMatches } from "../src/lib/nhl.ts";
import { SLATES } from "../src/data/nhl/slates.ts";
import { NFL_WEEK5_2026 } from "../src/data/nfl/week5-2026-public.ts";

const nhlProtectedFiles = ["src/data/nhl/protected-2026-10-07.json", "src/data/nhl/protected-2026-10-08.json", "src/data/nhl/protected-2026-10-09.json"];
const nhlProtectedRecords = nhlProtectedFiles.flatMap((file) => {
  const parsed = JSON.parse(readFileSync(file, "utf8"));
  return parsed.entries.map((entry) => ({
    label: `nhl-protected/${entry.slug}`,
    teamNames: [],
    text: [entry.pick, ...entry.analysis].join("\n"),
  }));
});

const nflProtected = JSON.parse(readFileSync("src/data/nfl/week5-2026-protected.json", "utf8"));
const nflProtectedRecords = nflProtected.entries.map((entry) => ({
  label: `nfl-protected/${entry.slug}`,
  teamNames: [],
  text: [entry.pick, ...entry.analysis].join("\n"),
}));

const nhlSlateRecords = SLATES.flatMap((slate) => [
  ...slate.matches.map((match) => ({
    label: `nhl-slate/${match.slug}`,
    teamNames: [match.homeTeam, match.awayTeam],
    text: [match.title, match.teaser, match.pick, ...(match.analysis ?? []), ...(match.sources ?? []).map((s) => s.name)].filter(Boolean).join("\n"),
  })),
  ...slate.multiples.map((multiple, index) => ({
    label: `nhl-slate/${slate.dayKey}/multiple-${index}`,
    teamNames: [],
    text: [multiple.title, multiple.badge, multiple.comment, ...multiple.legs.flatMap((leg) => [leg.fixture, leg.pick])].filter(Boolean).join("\n"),
  })),
]);

const nflPublicRecords = NFL_WEEK5_2026.map((game) => ({
  label: `nfl-public/${game.slug}`,
  teamNames: [game.homeTeam, game.awayTeam],
  text: [game.title, game.teaser, game.pick, ...(game.analysis ?? []), ...(game.sources ?? []).map((s) => s.name)].filter(Boolean).join("\n"),
}));

const portuguesePatterns = [
  /\banálise(?:s)?\b/i, /\bjogos?\b/i, /\bgols?\b/i, /\bvence(?:r)?\b/i,
  /\bequipes?\b/i, /\btemporada\b/i, /\bnão\b/i, /\btambém\b/i,
  /\bmais de\b/i, /\bmenos de\b/i, /\bcasa\b/i, /\bfora\b/i,
  /\bpalpite\b/i, /\bprognóstico\b/i, /\bescanteios\b/i, /\bempate\b/i,
  /\bvitórias?\b/i, /\bderrotas?\b/i, /\bpartidas?\b/i, /\bmandante\b/i,
  /\bvisitante\b/i, /\bsofre(?:u|r)?\b/i, /\bmarcou\b/i, /\bpressão\b/i,
];

const activeEditorial = editorialPredictions.filter((prediction) =>
  prediction.published === true && classifyPspEditorialLifecycle(prediction) !== "historical-frozen"
);
const records = [
  ...activeEditorial.map((prediction) => ({
    label: `${prediction.league}/${prediction.slug ?? `${prediction.homeTeam}-vs-${prediction.awayTeam}`}`,
    teamNames: [prediction.homeTeam, prediction.awayTeam],
    text: [prediction.seoTitle, prediction.title, prediction.teaser, prediction.trend, prediction.picks.main, ...prediction.analysis, ...(prediction.sources ?? []).map((source) => source.name)].filter(Boolean).join("\n"),
  })),
  ...nhlMatches().map((match) => ({
    label: `nhl/${match.slug}`,
    teamNames: [match.homeTeam, match.awayTeam],
    text: [match.title, match.pick, match.teaser, ...match.analysis, ...match.sources.map((source) => source.name)].join("\n"),
  })),
  ...nhlSlateRecords,
  ...nhlProtectedRecords,
  ...nflPublicRecords,
  ...nflProtectedRecords,
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Club names that contain a Portuguese word but are proper nouns in English text.
const properNouns = ["Vitória de Guimarães", "Casa Pia"];
const failures = records.flatMap(({ label, teamNames, text }) => {
  const editorialText = [...teamNames, ...properNouns].reduce(
    (value, teamName) => value.replace(new RegExp(escapeRegExp(teamName), "gi"), ""),
    text,
  );
  return portuguesePatterns.filter((pattern) => pattern.test(editorialText)).map((pattern) => `${label}: ${pattern}`);
}
);

console.log(`English editorial language check: ${records.length} active records, ${failures.length} Portuguese matches`);
for (const failure of failures) console.error(`ERROR: ${failure}`);
if (failures.length) process.exitCode = 1;
