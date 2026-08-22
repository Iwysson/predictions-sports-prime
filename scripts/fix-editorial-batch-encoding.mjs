import fs from "fs";
import path from "path";

const roots = [
  "src/data/predictions/la-liga",
  "src/data/predictions/copa-do-brasil",
  "src/data/predictions/efl-cup",
];

const replacements = [
  [/Atl\?tico/g, "Atlético"],
  [/M\?laga/g, "Málaga"],
  [/Coru\?a/g, "Coruña"],
  [/Vit\?ria/g, "Vitória"],
  [/Gr\?mio/g, "Grêmio"],
  [/LALIGA \? Jornada 2 results/g, "LALIGA — Jornada 2 results"],
  [/CBF \? Copa do Brasil quarter-final table/g, "CBF — Copa do Brasil quarter-final table"],
  [/EFL \? Carabao Cup Round Two fixtures/g, "EFL — Carabao Cup Round Two fixtures"],
  [/FC Barcelona \? Next matches/g, "FC Barcelona — Next matches"],
  [/Celta \? Next matches/g, "Celta — Next matches"],
  [/Valencia CF \? Next matches/g, "Valencia CF — Next matches"],
  [/Real Madrid \? Next matches/g, "Real Madrid — Next matches"],
];

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...walk(full));
      continue;
    }
    if (entry.isFile() && full.endsWith(".ts")) {
      result.push(full);
    }
  }
  return result;
}

for (const root of roots) {
  for (const file of walk(path.join(process.cwd(), root))) {
    let text = fs.readFileSync(file, "utf8");
    const original = text;

    for (const [pattern, replacement] of replacements) {
      text = text.replace(pattern, replacement);
    }

    if (text !== original) {
      fs.writeFileSync(file, text, "utf8");
    }
  }
}
