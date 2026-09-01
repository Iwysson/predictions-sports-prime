import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const archive = process.argv[2];
if (!archive) throw new Error("Usage: node scripts/import-brasileirao-round26-package.mjs <archive.zip>");

const publishedAt = "2026-09-01T19:00:00-03:00";
const source = {
  name: "Author-supplied Brasileirão Round 26 editorial package",
  url: "https://predictions-sports-prime.com/editorial-policy/",
  description: "Editorial package supplied on September 1, 2026 with the analysis, probable lineups, availability notes, selected market and odds.",
  accessedAt: publishedAt,
};

const fixtures = {
  "01_RB-Bragantino_vs_Bahia.txt": ["Red Bull Bragantino", "Bahia", "2026-09-05", "18:00"],
  "02_S-o-Paulo_vs_Atl-tico-MG.txt": ["São Paulo", "Atlético-MG", "2026-09-05", "18:30"],
  "03_Fluminense_vs_Vasco.txt": ["Fluminense", "Vasco da Gama", "2026-09-05", "21:00"],
  "04_Coritiba_vs_Mirassol.txt": ["Coritiba", "Mirassol", "2026-09-06", "11:00"],
  "05_Remo_vs_Flamengo.txt": ["Remo", "Flamengo", "2026-09-06", "16:00"],
  "06_Internacional_vs_Santos.txt": ["Internacional", "Santos", "2026-09-06", "16:00"],
  "07_Cruzeiro_vs_Athletico-PR.txt": ["Cruzeiro", "Athletico-PR", "2026-09-06", "16:00"],
  "08_Botafogo_vs_Palmeiras.txt": ["Botafogo", "Palmeiras", "2026-09-06", "18:30"],
  "09_Corinthians_vs_Chapecoense.txt": ["Corinthians", "Chapecoense", "2026-09-06", "19:30"],
  "10_Vit-ria_vs_Gr-mio.txt": ["Vitória", "Grêmio", "2026-09-07", "20:00"],
};

function slug(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function identifier(homeTeam, awayTeam) {
  const camel = (value) => slug(value).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  const away = camel(awayTeam);
  return `${camel(homeTeam)}Vs${away[0].toUpperCase()}${away.slice(1)}`;
}

const entries = execFileSync("tar", ["-tf", archive], { encoding: "utf8" })
  .trim().split(/\r?\n/).filter((file) => fixtures[basename(file)]);
if (entries.length !== 10) throw new Error(`Expected 10 analysis files, found ${entries.length}`);

const directory = join(process.cwd(), "src", "data", "predictions", "brasileirao-serie-a", "round-26");
mkdirSync(directory, { recursive: true });
const records = [];

for (const entry of entries) {
  const [homeTeam, awayTeam, date, time] = fixtures[basename(entry)];
  const analysis = execFileSync("tar", ["-xOf", archive, entry], { encoding: "utf8" }).replace(/\r/g, "").trim();
  const prediction = analysis.match(/^\*\*Prediction:\*\*\s*(.+)$/m)?.[1]?.trim();
  const publishedOdds = Number(analysis.match(/^\*\*Odds:\*\*\s*([0-9.]+)$/m)?.[1]);
  if (!prediction || !Number.isFinite(publishedOdds)) throw new Error(`Prediction or odds missing in ${entry}`);

  const id = identifier(homeTeam, awayTeam);
  const matchSlug = `${slug(homeTeam)}-vs-${slug(awayTeam)}`;
  const record = {
    league: "brasileirao-serie-a", homeTeam, awayTeam, slug: matchSlug,
    analysis: [analysis], analysisFormat: "markdown",
    picks: { main: prediction, publishedOdds, oddsProvenance: { source: "Author-supplied September 1 editorial package", provenance: "author_attested", market: prediction } },
    published: true, publishedAt, sourceStatus: "verified", sources: [source],
    matchInfo: { date, time, round: "Matchday 26" },
  };
  const code = `import type { EditorialPrediction } from "@/types";\n\nexport const ${id}: EditorialPrediction = ${JSON.stringify(record, null, 2)};\n`;
  writeFileSync(join(directory, `${matchSlug}.ts`), code, "utf8");
  records.push({ id, matchSlug, homeTeam, awayTeam, date, time });
}

const index = `${records.map(({ id, matchSlug }) => `import { ${id} } from "./${matchSlug}";`).join("\n")}\n\nexport const brasileiraoSerieARound26 = [\n${records.map(({ id }) => `  ${id},`).join("\n")}\n];\n`;
writeFileSync(join(directory, "index.ts"), index, "utf8");

const snapshotPath = join(process.cwd(), "src", "data", "fixtures.snapshot.json");
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
snapshot.leagues["brasileirao-serie-a"] = snapshot.leagues["brasileirao-serie-a"].filter(({ round }) => round !== 26);
snapshot.leagues["brasileirao-serie-a"].push({
  round: 26,
  games: records.map(({ homeTeam, awayTeam, matchSlug, date, time }) => ({
    round: 26, date, time, homeTeam, awayTeam, homeScore: null, awayScore: null,
    status: "scheduled", dataSource: "editorial-package", id: `editorial:brasileirao-serie-a:${matchSlug}:${date}`,
    sourceAgreement: false, timeConfirmed: false, kickoffUtc: new Date(`${date}T${time}:00-03:00`).toISOString(),
  })),
});
for (const { matchSlug, date } of records) snapshot.predictionIds[`brasileirao-serie-a:${matchSlug}`] = `editorial:brasileirao-serie-a:${matchSlug}:${date}`;
snapshot.leagueUpdatedAt["brasileirao-serie-a"] = publishedAt;
writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`Imported ${records.length} Brasileirão Matchday 26 analyses.`);
