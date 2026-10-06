import { editorialPredictions } from "../src/data/predictions/index.ts";
import { classifyPspEditorialLifecycle } from "../src/lib/editorial-standard.ts";
import { nhlMatches } from "../src/lib/nhl.ts";

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
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Club names that contain a Portuguese word but are proper nouns in English text.
const properNouns = ["Vitória de Guimarães"];
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
