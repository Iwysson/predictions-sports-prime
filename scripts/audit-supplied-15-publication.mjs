import { readFileSync } from "node:fs";
import { join } from "node:path";

const records = [
  ["eredivisie/round-05/willem-ii-vs-excelsior.ts", "eredivisie", "Willem II", "Excelsior", "2026-09-05", "Over 2.5 Goals", 1.7, 1750],
  ["eredivisie/round-05/ajax-vs-psv-eindhoven.ts", "eredivisie", "Ajax Amsterdam", "PSV Eindhoven", "2026-09-05", "Over 3.5 Goals", 1.9, 1650],
  ["eredivisie/round-05/fc-utrecht-vs-go-ahead-eagles.ts", "eredivisie", "Utrecht", "Go Ahead Eagles", "2026-09-05", "Over 2.5 Goals", 1.52, 1600],
  ["eredivisie/round-05/nec-nijmegen-vs-feyenoord.ts", "eredivisie", "NEC Nijmegen", "Feyenoord Rotterdam", "2026-09-05", "NEC Nijmegen or Draw (1X)", 1.72, 1700],
  ["la-liga/round-04/elche-vs-real-sociedad.ts", "la-liga", "Elche", "Real Sociedad", "2026-09-07", "Over 1.5 Goals + Over 7.5 Corners", 1.87, 2200],
  ["la-liga/round-04/espanyol-vs-sevilla.ts", "la-liga", "Espanyol", "Sevilla", "2026-09-06", "Espanyol or Draw (1X) + Over 1.5 Goals", 2.07, 2300],
  ["ligue-1/round-03/angers-vs-rennes.ts", "ligue-1", "Angers", "Stade Rennais", "2026-09-06", "Rennes or Draw (X2) + Over 1.5 Goals", 1.6, 1200],
  ["ligue-1/round-03/troyes-vs-strasbourg.ts", "ligue-1", "Troyes", "Strasbourg", "2026-09-06", "Over 2.5 Goals", 1.9, 1100],
  ["la-liga/round-04/malaga-vs-levante.ts", "la-liga", "Málaga", "Levante", "2026-09-06", "Over 2.5 Goals", 2, 1050],
  ["premier-league/round-03/everton-vs-manchester-united.ts", "premier-league", "Everton", "Manchester United", "2026-09-06", "Manchester United or Draw (X2) + Over 1.5 Goals", 1.72, 1900],
  ["la-liga/round-04/athletic-club-vs-atletico-madrid.ts", "la-liga", "Athletic Club", "Atlético Madrid", "2026-09-05", "Atletico Madrid or Draw (X2) + Over 7.5 Corners", 1.88, 1950],
  ["la-liga/round-04/rayo-vallecano-vs-racing-santander.ts", "la-liga", "Rayo Vallecano", "Racing Santander", "2026-09-05", "Rayo Vallecano or Draw (1X) + Over 1.5 Goals", 1.8, 1700],
  ["la-liga/round-04/villarreal-vs-deportivo-la-coruna.ts", "la-liga", "Villarreal", "Deportivo", "2026-09-05", "Over 2.5 Goals", 1.88, 2250],
  ["la-liga/round-04/valencia-vs-barcelona.ts", "la-liga", "Valencia", "Barcelona", "2026-09-06", "Valencia +3 Asian Handicap + Over 1.5 Goals", 1.53, 2100],
  ["la-liga/round-04/deportivo-alaves-vs-osasuna.ts", "la-liga", "Alavés", "Osasuna", "2026-09-06", "Over 1.5 Goals + Over 7.5 Corners", 2.02, 1700],
];

const snapshot = JSON.parse(readFileSync(join(process.cwd(), "src/data/fixtures.snapshot.json"), "utf8"));
let failures = 0;
function check(condition, label) {
  if (!condition) {
    failures += 1;
    console.error(`  [FAIL] ${label}`);
  }
}

for (const [relativePath, league, fixtureHome, fixtureAway, date, prediction, odds, minimumWords] of records) {
  const source = readFileSync(join(process.cwd(), "src/data/predictions", relativePath), "utf8");
  const literal = source.match(/analysis: \[("(?:[^"\\]|\\.)*")\],\n  analysisFormat:/s)?.[1];
  const analysis = literal ? JSON.parse(literal) : "";
  const lines = analysis.trimEnd().split("\n");
  const fixture = snapshot.leagues[league].flatMap((round) => round.games)
    .find((game) => game.homeTeam === fixtureHome && game.awayTeam === fixtureAway && game.date === date);
  const tableStart = lines.findIndex((line) => line.startsWith("|"));
  const tableEnd = lines.findIndex((line, index) => index > tableStart && !line.startsWith("|"));
  const table = tableStart >= 0 ? lines.slice(tableStart, tableEnd < 0 ? lines.length : tableEnd).join("\n") : "";
  const paragraphs = analysis.split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  const normalizedParagraphs = paragraphs.map((value) => value.replace(/\s+/g, " ").toLowerCase());
  const wordCount = analysis.split(/\s+/).filter(Boolean).length;

  console.log(`Auditing ${fixtureHome} vs ${fixtureAway} (${wordCount} words)`);
  check(Boolean(fixture), "fixture correto");
  check((analysis.match(/^# /gm) ?? []).length === 1, "exatamente 1 H1");
  check((analysis.match(/^### Statistical Core\s*$/gm) ?? []).length === 1, "exatamente 1 Statistical Core");
  check((analysis.match(/^#{2,6} /gm) ?? []).length === 1, "sem headings adicionais");
  check((analysis.match(/^\|\s*:?-{3,}/gm) ?? []).length === 1, "exatamente 1 tabela Markdown");
  check(/\|[^\n]*xG[^\n]*\|/i.test(table), "tabela contém xG");
  check(/\|[^\n]*xGA[^\n]*\|/i.test(table), "tabela contém xGA");
  check(/\*\*Escalações prováveis:\*\*/i.test(analysis), "Escalações prováveis presentes");
  check(/\*\*Conflict Detector\.\*\*/.test(analysis), "Conflict Detector presente");
  check((analysis.match(/🎯 \*\*Prediction:/g) ?? []).length === 2, "Prediction no topo e no final");
  check((analysis.match(/💰 \*\*Odds:/g) ?? []).length === 2, "Odds no topo e no final");
  check(lines[1] === `🎯 **Prediction: ${prediction}**`, "Prediction superior correta");
  check(lines[2] === `💰 **Odds: ${odds.toFixed(2)}**`, "Odds superior correta");
  check(lines.at(-2) === `🎯 **Prediction: ${prediction}**`, "Prediction final correta");
  check(lines.at(-1) === `💰 **Odds: ${odds.toFixed(2)}**`, "Odds final correta");
  check(source.includes(`main: ${JSON.stringify(prediction)}`), "prediction estruturada correta");
  check(source.includes(`publishedOdds: ${odds}`), "odd estruturada correta");
  check(wordCount >= minimumWords, `densidade preservada (${wordCount}/${minimumWords}+ palavras)`);
  check(new Set(normalizedParagraphs).size === normalizedParagraphs.length, "sem parágrafos duplicados");
  check(!/\n{4,}/.test(analysis), "sem grandes blocos vazios");
  check(!/\bTBD\b|placeholder|See analysis/i.test(analysis), "sem placeholders");
}

if (failures) {
  console.error(`\n15-analysis editorial audit: FAIL (${failures} checks failed)`);
  process.exit(1);
}
console.log("\n15-analysis editorial audit: 15/15 PASS");
