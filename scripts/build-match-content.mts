// Writes the protected match-content index used by functions/api/match-content.
// Runs in prebuild. The output lives under functions/ so it is bundled into the
// Pages Function only and never copied into the static export or client bundles.
import { writeFileSync, mkdirSync } from "node:fs";
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

// NHL protected entries for later days. They stay "not-found" in the endpoint until the NHL day
// (America/New_York) reaches activeFromKey.
const nhlLater = JSON.parse(readFileSync("src/data/nhl/protected-2026-10-07.json", "utf8")) as {
  activeFromKey: string;
  entries: Array<{ slug: string; analysisAccess: "free" | "vip"; predictionAccess: "free" | "vip"; pick: string; odds: number; analysis: string[] }>;
};
for (const e of nhlLater.entries) {
  nhlEntries.push({
    slug: e.slug,
    analysisAccess: e.analysisAccess,
    predictionAccess: e.predictionAccess,
    full: { analysis: e.analysis, sources: [], comment: null, picks: { main: e.pick, odds: e.odds } },
    prediction: { main: e.pick, odds: e.odds },
    activeFromKey: nhlLater.activeFromKey,
  });
}

const index = buildContentIndex(editorialPredictions as any[], new Date(), nhlEntries);
mkdirSync("functions/_data", { recursive: true });
writeFileSync("functions/_data/match-content.json", JSON.stringify(index, null, 2) + "\n");
const count = (fn: (e: ProtectedContentEntry) => boolean) => index.filter(fn).length;
console.log(
  `match content index: ${index.length} entries (analysis vip: ${count((e) => e.analysisAccess === "vip")}, ` +
    `analysis free: ${count((e) => e.analysisAccess === "free")}, prediction free: ${count((e) => e.predictionAccess === "free")})`,
);
