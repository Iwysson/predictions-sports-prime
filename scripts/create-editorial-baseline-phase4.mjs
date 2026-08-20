import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { createBaselineManifest } from "./editorial-baseline-lib.mjs";

const root = process.cwd();
const manifest = createBaselineManifest(root);
const names = execFileSync("git", ["ls-files", "src/data/predictions/**/*.ts"], { encoding: "utf8" })
  .split(/\r?\n/).filter((name) => name && !name.endsWith("/index.ts"));
const predictionFiles = names.map((name) => ({ name, source: readFileSync(join(root, name), "utf8") }));
for (const entry of manifest.entries) {
  const candidates = process.platform === "win32"
    ? requireFiles(entry.slug)
    : requireFiles(entry.slug);
  const file = candidates.find((item) => item.source.includes(`homeTeam:`) && item.source.includes(`awayTeam:`));
  if (!file) throw new Error(`${entry.slug}: prediction source not found`);
  entry.sourceCount = [...file.source.matchAll(/\burl:\s*["'][^"']+["']/g)].length;
  entry.editorialStatus = file.source.match(/sourceStatus:\s*["']([^"']+)["']/)?.[1] ?? "unclassified";
}
manifest.schemaVersion = 2;
manifest.purpose = "EEAT Phase 4 editorial checkpoint";
manifest.createdAt = "2026-08-20T23:59:00.000-03:00";
writeFileSync(join(root, "editorial-baseline-phase4.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Phase 4 baseline written: ${manifest.entries.length} published predictions.`);

function requireFiles(slug) {
  return predictionFiles.filter(({ source }) => {
    const explicit = source.match(/^\s*slug:\s*["']([^"']+)["']/m)?.[1];
    if (explicit) return explicit === slug;
    const home = source.match(/^\s*homeTeam:\s*["']([^"']+)["']/m)?.[1] ?? "";
    const away = source.match(/^\s*awayTeam:\s*["']([^"']+)["']/m)?.[1] ?? "";
    return `${slugify(home)}-vs-${slugify(away)}` === slug;
  });
}

function slugify(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
