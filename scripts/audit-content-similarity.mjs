import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const root = process.cwd();
const base = join(root, "src", "data", "predictions");
const files = [];
const walk = (directory) => readdirSync(directory).forEach((name) => {
  const path = join(directory, name);
  if (statSync(path).isDirectory()) walk(path);
  else if (path.endsWith(".ts") && !path.endsWith(`${sep}index.ts`)) files.push(path);
});
walk(base);
const owners = new Map();
for (const file of files) {
  const source = readFileSync(file, "utf8");
  if (!/\bpublished:\s*true/.test(source)) continue;
  const analysis = source.slice(source.indexOf("analysis:"), source.indexOf("picks:"));
  for (const match of analysis.matchAll(/"((?:\\.|[^"\\])*)"/g)) {
    const paragraph = JSON.parse(`"${match[1]}"`).toLowerCase().replace(/\s+/g, " ").trim();
    if (paragraph.length < 80) continue;
    owners.set(paragraph, [...(owners.get(paragraph) ?? []), relative(root, file).split(sep).join("/")]);
  }
}
const duplicates = [...owners].filter(([, paths]) => paths.length > 1);
console.log(`Content similarity: ${owners.size} substantive paragraphs / ${duplicates.length} exact duplicate groups`);
duplicates.forEach(([paragraph, paths]) => console.log(`WARNING: ${paths.join(", ")}: ${paragraph.slice(0, 120)}…`));

