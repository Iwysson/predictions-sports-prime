import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { createBaselineManifest } from "./editorial-baseline-lib.mjs";

const root = process.cwd();
const target = join(root, "editorial-baseline.json");
const manifest = createBaselineManifest(root);
writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Editorial baseline written: ${manifest.entries.length} published, ${manifest.draftCount} drafts.`);
