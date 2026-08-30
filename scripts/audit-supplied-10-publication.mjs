import { readFileSync } from "node:fs";
import { join } from "node:path";

const records = [
  ["ligue-1/round-03/toulouse-vs-lille.ts", "ligue-1", "Toulouse", "Lille", "2026-09-03", "Lille or Draw (X2) + Over 1.5 Goals", 1.83, 6534],
  ["premier-league/round-03/ipswich-town-vs-liverpool.ts", "premier-league", "Ipswich Town", "Liverpool", "2026-09-04", "Over 8.5 Corners + Over 1.5 Goals", 1.83, 6664],
  ["la-liga/round-04/real-betis-vs-real-madrid.ts", "la-liga", "Real Betis", "Real Madrid", "2026-09-04", "Real Madrid or Draw (X2) + Over 8.5 Corners", 1.8, 5105],
  ["ligue-1/round-03/lyon-vs-auxerre.ts", "ligue-1", "Lyon", "AJ Auxerre", "2026-09-04", "Lyon to Win + Over 1.5 Goals", 1.8, 4475],
  ["eredivisie/round-05/sparta-rotterdam-vs-pec-zwolle.ts", "eredivisie", "Sparta Rotterdam", "PEC Zwolle", "2026-09-04", "Sparta Rotterdam or Draw (1X) + Over 2.5 Goals", 1.93, 4033],
  ["ligue-1/round-03/lens-vs-lorient.ts", "ligue-1", "Lens", "Lorient", "2026-09-05", "Lens to Win + Over 1.5 Goals", 1.72, 3974],
  ["ligue-1/round-03/nice-vs-le-mans.ts", "ligue-1", "Nice", "Le Mans", "2026-09-05", "Nice to Win", 1.78, 4814],
  ["ligue-1/round-03/le-havre-vs-brest.ts", "ligue-1", "Le Havre AC", "Brest", "2026-09-05", "Over 1.5 Goals + Over 7.5 Corners", 1.83, 4501],
  ["serie-a/round-03/fiorentina-vs-torino.ts", "serie-a", "Fiorentina", "Torino", "2026-09-05", "Fiorentina or Draw (1X) + Over 1.5 Goals", 1.7, 4653],
  ["serie-a/round-03/inter-vs-napoli.ts", "serie-a", "Internazionale", "Napoli", "2026-09-05", "Inter to Win", 1.75, 4654],
];

const snapshot = JSON.parse(readFileSync(join(process.cwd(), "src/data/fixtures.snapshot.json"), "utf8"));
let failures = 0;

function check(condition, label) {
  if (!condition) {
    failures += 1;
    console.error(`  [FAIL] ${label}`);
  }
}

for (const [relativePath, league, fixtureHome, fixtureAway, date, prediction, odds, expectedCharacters] of records) {
  const source = readFileSync(join(process.cwd(), "src/data/predictions", relativePath), "utf8");
  const analysisLiteral = source.match(/analysis: \[("(?:[^"\\]|\\.)*")\],\n  analysisFormat:/s)?.[1];
  const analysis = analysisLiteral ? JSON.parse(analysisLiteral) : "";
  const fixture = snapshot.leagues[league]
    .flatMap((round) => round.games)
    .find((game) => game.homeTeam === fixtureHome && game.awayTeam === fixtureAway && game.date === date);
  console.log(`Auditing ${fixtureHome} vs ${fixtureAway}`);
  check(Boolean(fixture), "fixture correto");
  check(Boolean(analysis), "análise presente");
  const characterCount = Array.from(analysis).length;
  check(characterCount === expectedCharacters, `conteúdo completo (${characterCount}/${expectedCharacters} caracteres)`);
  check(source.includes(`main: ${JSON.stringify(prediction)}`), "prediction correta");
  check(source.includes(`publishedOdds: ${odds}`), "odds correta");
  check((analysis.match(/^### Statistical Core\s*$/gm) ?? []).length === 1, "exatamente 1 Statistical Core");
  check(/\*\*Conflict Detector\.?\*\*/.test(analysis), "Conflict Detector presente");
  check(/chronolog|current through|current sequence|latest league result|latest result|opened with|opening matches/i.test(analysis), "contexto cronológico presente");
  check(/Probable (?:lineup|.*XI)|latest relevant competitive starting XI|latest competitive XI/i.test(analysis), "probable lineup/lineup note presente");
  check(/Availability|suspend|injur|doubt|return/i.test(analysis), "availability presente");
  check(/H2H|Head-to-Head/i.test(analysis), "H2H ou explicação presente");
  check(!/See analysis|TODO|TBD analysis|placeholder/i.test(analysis), "sem placeholders editoriais");
}

if (failures) {
  console.error(`\nEditorial audit: FAIL (${failures} checks failed)`);
  process.exit(1);
}

console.log("\nEditorial audit: 10/10 PASS");
