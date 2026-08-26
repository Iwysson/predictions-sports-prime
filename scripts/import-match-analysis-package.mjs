import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const archive = process.argv[2];
if (!archive) throw new Error("Usage: node scripts/import-match-analysis-package.mjs <archive.zip>");

const publishedAt = "2026-08-26T11:54:38.899Z";
const accessedAt = "2026-08-26T08:54:38-03:00";
const tffUrl = "https://www.tff.org/default.aspx?pageID=198";
const spflUrl = "https://spfl.co.uk/match-day";

const fixtures = {
  "Aberdeen_vs_Rangers.txt": ["scottish-premiership", "Aberdeen", "Rangers", "2026-08-30", "12:00", "Matchday 4"],
  "Celtic_vs_Falkirk.txt": ["scottish-premiership", "Celtic", "Falkirk", "2026-08-29", "15:00", "Matchday 4"],
  "Hearts_vs_St_Johnstone.txt": ["scottish-premiership", "Hearts", "St Johnstone", "2026-08-29", "15:00", "Matchday 4"],
  "Dundee_vs_Hibernian.txt": ["scottish-premiership", "Dundee", "Hibernian", "2026-08-30", "15:00", "Matchday 4"],
  "St_Mirren_vs_Motherwell.txt": ["scottish-premiership", "St Mirren", "Motherwell", "2026-08-30", "15:00", "Matchday 4"],
  "Celtic_vs_Aberdeen.txt": ["scottish-premiership", "Celtic", "Aberdeen", "2026-09-02", "19:45", "Matchday 5"],
  "Falkirk_vs_Rangers.txt": ["scottish-premiership", "Falkirk", "Rangers", "2026-09-02", "20:00", "Matchday 5"],
  "Dundee_vs_St_Johnstone.txt": ["scottish-premiership", "Dundee", "St Johnstone", "2026-09-02", "19:45", "Matchday 5"],
  "Kilmarnock_vs_St_Mirren.txt": ["scottish-premiership", "Kilmarnock", "St Mirren", "2026-09-02", "19:45", "Matchday 5"],
  "Motherwell_vs_Dundee_United.txt": ["scottish-premiership", "Motherwell", "Dundee United", "2026-09-02", "19:45", "Matchday 5"],
  "Hibernian_vs_Hearts.txt": ["scottish-premiership", "Hibernian", "Hearts", "2026-09-03", "19:45", "Matchday 5"],
  "Genclerbirligi_vs_Erzurumspor.txt": ["super-lig", "Gençlerbirliği", "Erzurumspor", "2026-08-28", "21:30", "Matchday 3"],
  "Konyaspor_vs_Kocaelispor.txt": ["super-lig", "Konyaspor", "Kocaelispor", "2026-08-29", "19:00", "Matchday 3"],
  "Gaziantep_vs_Rizespor.txt": ["super-lig", "Gaziantep FK", "Çaykur Rizespor", "2026-08-29", "21:30", "Matchday 3"],
  "Galatasaray_vs_Goztepe.txt": ["super-lig", "Galatasaray", "Göztepe", "2026-08-29", "21:30", "Matchday 3"],
  "Eyupspor_vs_Alanyaspor.txt": ["super-lig", "Eyüpspor", "Alanyaspor", "2026-08-30", "19:00", "Matchday 3"],
  "Basaksehir_vs_Kasimpasa.txt": ["super-lig", "İstanbul Başakşehir", "Kasımpaşa", "2026-08-30", "21:30", "Matchday 3"],
  "Samsunspor_vs_Fenerbahce.txt": ["super-lig", "Samsunspor", "Fenerbahçe", "2026-08-30", "21:30", "Matchday 3"],
  "Amedspor_vs_Trabzonspor.txt": ["super-lig", "Amedspor", "Trabzonspor", "2026-08-31", "21:30", "Matchday 3"],
  "Besiktas_vs_Corum.txt": ["super-lig", "Beşiktaş", "Çorum FK", "2026-08-31", "21:30", "Matchday 3"],
};

function slug(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toTypeScriptObject(value) {
  return JSON.stringify(value, null, 2).replace(/^(\s*)"([A-Za-z_$][\w$]*)":/gm, "$1$2:");
}

const excludedFiles = new Set(["Kilmarnock_vs_Dundee.txt"]);
const archiveFiles = execFileSync("tar", ["-tf", archive], { encoding: "utf8" }).trim().split(/\r?\n/);
const byLeague = new Map();

for (const file of archiveFiles) {
  if (excludedFiles.has(basename(file))) {
    console.warn(`Excluded ${file}: the package names Dundee, but the verified current fixture is Kilmarnock vs Dundee United.`);
    continue;
  }
  const fixture = fixtures[basename(file)];
  if (!fixture) throw new Error(`No verified fixture mapping for ${file}`);
  const [league, homeTeam, awayTeam, date, time, round] = fixture;
  const body = execFileSync("tar", ["-xOf", archive, file], { encoding: "utf8" }).replace(/\r/g, "").trim();
  const prediction = body.match(/^Prediction:\s*(.+)$/m)?.[1]?.trim();
  const odds = Number(body.match(/^Odds:\s*([0-9.]+)$/m)?.[1]);
  if (!prediction || !Number.isFinite(odds)) throw new Error(`Prediction or odds missing in ${file}`);
  const paragraphs = body.split(/\n\s*\n/).slice(2).filter((paragraph) => !paragraph.startsWith("Prediction:"));
  const sourceUrl = league === "super-lig" ? tffUrl : spflUrl;
  const sourceName = league === "super-lig" ? "Turkish Football Federation — 2026/27 Süper Lig fixtures and table" : "SPFL — 2026/27 Premiership fixtures and table";
  const sourceDescription = league === "super-lig"
    ? "Official competition page confirming the Matchday 3 pairing, kickoff and standings used for publication context."
    : "Official competition page confirming the scheduled pairing, kickoff and current standings used for publication context.";
  const record = { league, homeTeam, awayTeam, date, time, round, prediction, odds, paragraphs, sourceUrl, sourceName, sourceDescription };
  byLeague.set(league, [...(byLeague.get(league) ?? []), record]);
}

for (const [league, records] of byLeague) {
  const directory = join(process.cwd(), "src", "data", "predictions", league, "current-round");
  mkdirSync(directory, { recursive: true });
  const exports = [];
  for (const record of records) {
    const id = `${slug(record.homeTeam).replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Vs${slug(record.awayTeam).replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())}`;
    const filename = `${slug(record.homeTeam)}-vs-${slug(record.awayTeam)}.ts`;
    const code = `import type { EditorialPrediction } from "@/types";\n\nexport const ${id}: EditorialPrediction = ${toTypeScriptObject({
      league: record.league,
      homeTeam: record.homeTeam,
      awayTeam: record.awayTeam,
      analysis: record.paragraphs,
      comment: "Odds supplied in the editorial package and recorded before kickoff; bookmaker not identified in the source file.",
      picks: { main: record.prediction, odds: record.odds, oddsProvenance: { source: "Author-supplied editorial package", provenance: "author_attested", market: record.prediction } },
      sourceStatus: "verified",
      sources: [{ name: record.sourceName, url: record.sourceUrl, description: record.sourceDescription, accessedAt }],
      publishedAt,
      published: true,
      matchInfo: { date: record.date, time: record.time, round: record.round },
    })};\n`;
    writeFileSync(join(directory, filename), code, "utf8");
    exports.push({ id, filename: filename.replace(/\.ts$/, "") });
  }
  const index = `${exports.map(({ id, filename }) => `import { ${id} } from "./${filename}";`).join("\n")}\n\nexport const currentRoundPredictions = [\n${exports.map(({ id }) => `  ${id},`).join("\n")}\n];\n`;
  writeFileSync(join(directory, "index.ts"), index, "utf8");
  writeFileSync(join(directory, "..", "index.ts"), `import { currentRoundPredictions } from "./current-round";\n\nexport const ${league === "super-lig" ? "superLigPredictions" : "scottishPremiershipPredictions"} = [...currentRoundPredictions];\n`, "utf8");
}

const snapshotPath = join(process.cwd(), "src", "data", "fixtures.snapshot.json");
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
const officialFixtures = {
  "super-lig": [...byLeague.get("super-lig")],
  "scottish-premiership": [
    ...byLeague.get("scottish-premiership"),
    { homeTeam: "Kilmarnock", awayTeam: "Dundee United", date: "2026-08-29", time: "15:00", round: "Matchday 4" },
  ],
};
for (const [league, records] of Object.entries(officialFixtures)) {
  const timezoneOffset = league === "super-lig" ? "+03:00" : "+01:00";
  const grouped = Map.groupBy(records, (record) => Number(record.round.match(/\d+/)?.[0] ?? 1));
  snapshot.leagues[league] = [...grouped.entries()].sort(([left], [right]) => left - right).map(([round, games]) => ({
    round,
    games: games.sort((left, right) => `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`)).map((record) => {
      const fixtureSlug = `${slug(record.homeTeam)}-vs-${slug(record.awayTeam)}`;
      return {
        round, date: record.date, time: record.time, homeTeam: record.homeTeam, awayTeam: record.awayTeam,
        homeScore: null, awayScore: null, status: "scheduled", dataSource: "snapshot",
        id: `official:${league}:${fixtureSlug}:${record.date}`, sourceAgreement: true, timeConfirmed: true,
        kickoffUtc: new Date(`${record.date}T${record.time}:00${timezoneOffset}`).toISOString(),
      };
    }),
  }));
  for (const record of byLeague.get(league)) {
    const fixtureSlug = `${slug(record.homeTeam)}-vs-${slug(record.awayTeam)}`;
    snapshot.predictionIds[`${league}:${fixtureSlug}`] = `official:${league}:${fixtureSlug}:${record.date}`;
  }
  snapshot.leagueUpdatedAt[league] = publishedAt;
}
writeFileSync(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`Imported ${archiveFiles.length - excludedFiles.size} analyses from ${archive}`);
