// Writes the protected match-content index used by functions/api/match-content.
// Runs in prebuild. The output lives under functions/ so it is bundled into the
// Pages Function only and never copied into the static export or client bundles.
import { writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { buildContentIndex, type ProtectedContentEntry } from "../src/lib/match-access.ts";
import { readFileSync } from "node:fs";
import { nhlMatches } from "../src/lib/nhl.ts";

const nhlEntries: ProtectedContentEntry[] = nhlMatches().map((m) => ({
  slug: m.slug,
  analysisAccess: m.access,
  predictionAccess: m.access,
  full: { analysis: m.analysis, sources: m.sources, comment: null, picks: { main: m.pick, odds: m.odds } },
  prediction: { main: m.pick, odds: m.odds },
}));

type LaterEntryFile = {
  activeFromKey: string;
  // IANA zone whose local midnight on activeFromKey opens the entries. Absent = America/New_York (the NHL day).
  releaseTimeZone?: string;
  entries: Array<{ slug: string; analysisAccess: "free" | "vip"; predictionAccess: "free" | "vip"; pick: string; odds: number; analysis: string[]; analysisFormat?: "markdown"; sources?: Array<{ name: string; url: string }> }>;
};

// NHL protected entries for later days. They stay "not-found" in the endpoint until 00:00 of
// activeFromKey in the file's releaseTimeZone (default America/New_York, the NHL day). Add a new file here for each later NHL day.
// Every protected-<day>.json is picked up automatically (sorted by day), so a published NHL day can no longer be left out.
const nhlLaterFiles = readdirSync("src/data/nhl").filter((name) => /^protected-\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort().map((name) => `src/data/nhl/${name}`);
for (const file of nhlLaterFiles) {
  const later = JSON.parse(readFileSync(file, "utf8")) as LaterEntryFile;
  for (const e of later.entries) {
    nhlEntries.push({
      slug: e.slug,
      analysisAccess: e.analysisAccess,
      predictionAccess: e.predictionAccess,
      full: { analysis: e.analysis, analysisFormat: e.analysisFormat, sources: e.sources ?? [], comment: null, picks: { main: e.pick, odds: e.odds } },
      prediction: { main: e.pick, odds: e.odds },
      activeFromKey: later.activeFromKey,
      ...(later.releaseTimeZone ? { releaseTimeZone: later.releaseTimeZone } : {}),
    });
  }
}

// NFL protected entries (BEST BET / PRIME VIP games). Published immediately, no activeFromKey.
// One file per published week - add a new file here for each later NFL week, same pattern as
// nhlLaterFiles above.
type NflEntryFile = {
  entries: Array<{ slug: string; analysisAccess: "free" | "vip"; predictionAccess: "free" | "vip"; pick: string; odds: number; analysis: string[]; analysisFormat?: "markdown"; sources?: Array<{ name: string; url: string }> }>;
};
const nflWeekFiles = ["src/data/nfl/week5-2026-protected.json", "src/data/nfl/week6-2026-protected.json"];
const nflEntries: ProtectedContentEntry[] = nflWeekFiles.flatMap((file) => {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as NflEntryFile;
  return parsed.entries.map((e) => ({
    slug: e.slug,
    analysisAccess: e.analysisAccess,
    predictionAccess: e.predictionAccess,
    full: { analysis: e.analysis, analysisFormat: e.analysisFormat, sources: e.sources ?? [], comment: null, picks: { main: e.pick, odds: e.odds } },
    prediction: { main: e.pick, odds: e.odds },
  }));
});

const index = buildContentIndex(editorialPredictions as any[], new Date(), [...nhlEntries, ...nflEntries]);
mkdirSync("functions/_data", { recursive: true });
writeFileSync("functions/_data/match-content.json", JSON.stringify(index, null, 2) + "\n");
const count = (fn: (e: ProtectedContentEntry) => boolean) => index.filter(fn).length;
console.log(
  `match content index: ${index.length} entries (analysis vip: ${count((e) => e.analysisAccess === "vip")}, ` +
    `analysis free: ${count((e) => e.analysisAccess === "free")}, prediction free: ${count((e) => e.predictionAccess === "free")})`,
);
