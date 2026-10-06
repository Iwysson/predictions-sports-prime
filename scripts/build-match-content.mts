// Writes the protected match-content index used by functions/api/match-content.
// Runs in prebuild. The output lives under functions/ so it is bundled into the
// Pages Function only and never copied into the static export or client bundles.
import { writeFileSync, mkdirSync } from "node:fs";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { buildContentIndex } from "../src/lib/match-access.ts";

const index = buildContentIndex(editorialPredictions as any[]);
mkdirSync("functions/_data", { recursive: true });
writeFileSync("functions/_data/match-content.json", JSON.stringify(index, null, 2) + "\n");
console.log(`match content index: ${index.length} publishable future predictions (vip: ${index.filter((e) => e.access === "vip").length}, free: ${index.filter((e) => e.access === "free").length})`);
