import { readFileSync, writeFileSync } from "node:fs";

const accessedAt = "2026-08-20T12:45:00.000-03:00";
const batch = process.argv[2];
const batches = {
  "3": [
    ["src/data/predictions/ligue-1/round-01/troyes-vs-paris-fc.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
    ["src/data/predictions/liga-portugal/round-03/fc-porto-vs-arouca.ts", "https://www.rsssf.org/tablesp/port2026.html", "Portugal 2025/26 final tables"],
    ["src/data/predictions/liga-portugal/round-03/maritimo-vs-academico-de-viseu.ts", "https://www.rsssf.org/tablesp/port2026.html", "Portugal 2025/26 final tables"],
    ["src/data/predictions/liga-portugal/round-03/santa-clara-vs-famalicao.ts", "https://www.rsssf.org/tablesp/port2026.html", "Portugal 2025/26 final tables"],
    ["src/data/predictions/liga-portugal/round-03/vitoria-guimaraes-vs-nacional.ts", "https://www.rsssf.org/tablesp/port2026.html", "Portugal 2025/26 final tables"],
    ["src/data/predictions/ligue-1/round-01/angers-vs-lille.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
    ["src/data/predictions/eredivisie/round-03/sparta-rotterdam-vs-utrecht.ts", "https://www.rsssf.org/tablesn/ned2026.html", "Netherlands 2025/26 final tables"],
    ["src/data/predictions/ligue-1/round-01/nice-vs-lorient.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
    ["src/data/predictions/ligue-1/round-01/lens-vs-auxerre.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
    ["src/data/predictions/ligue-1/round-01/toulouse-vs-lyon.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/atalanta-vs-sassuolo.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/torino-vs-milan.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
  ],
  "4": [
    ["src/data/predictions/la-liga/round-01/deportivo-la-coruna-vs-elche.ts", "https://www.rsssf.org/tabless/span2026.html", "Spain 2025/26 final tables"],
    ["src/data/predictions/la-liga/round-02/athletic-club-vs-sevilla.ts", "https://www.rsssf.org/tabless/span2026.html", "Spain 2025/26 final tables"],
    ["src/data/predictions/la-liga/round-02/rayo-vallecano-vs-deportivo-alaves.ts", "https://www.rsssf.org/tabless/span2026.html", "Spain 2025/26 final tables"],
    ["src/data/predictions/la-liga/round-02/rcd-espanyol-de-barcelona-vs-real-madrid.ts", "https://www.rsssf.org/tabless/span2026.html", "Spain 2025/26 final tables"],
    ["src/data/predictions/la-liga/round-02/real-betis-vs-real-sociedad.ts", "https://www.rsssf.org/tabless/span2026.html", "Spain 2025/26 final tables"],
    ["src/data/predictions/la-liga/round-02/valencia-vs-rc-celta-de-vigo.ts", "https://www.rsssf.org/tabless/span2026.html", "Spain 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/arsenal-vs-coventry.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/brentford-vs-tottenham.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/brighton-vs-aston-villa.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/everton-vs-crystal-palace.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/hull-vs-man-united.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/ipswich-vs-sunderland.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
  ],
  "5": [
    ["src/data/predictions/premier-league/round-01/man-city-vs-bournemouth.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/premier-league/round-01/nottingham-forest-vs-leeds.ts", "https://www.rsssf.org/tablese/eng2026.html", "England 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/bologna-vs-lazio.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/frosinone-vs-juventus.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/genoa-vs-napoli.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/inter-vs-monza.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/parma-vs-cagliari.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/roma-vs-fiorentina.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/udinese-vs-como.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/serie-a/round-01/venezia-vs-lecce.ts", "https://www.rsssf.org/tablesi/ital2026.html", "Italy 2025/26 final tables"],
    ["src/data/predictions/ligue-1/round-01/le-mans-vs-stade-brestois.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
    ["src/data/predictions/ligue-1/round-01/olympique-de-marseille-vs-strasbourg.ts", "https://www.rsssf.org/tablesf/fran2026.html", "France 2025/26 final tables"],
  ],
};

function marketExplanation(pick, home, away) {
  if (/Both Teams to Score/i.test(pick)) return `The recorded market needs both ${home} and ${away} to score. A clean sheet for either team loses the selection, so general season strength cannot substitute for verified scoring evidence from both sides.`;
  if (/Over 2\.5/i.test(pick)) return "The recorded market requires at least three total goals. A 1-1 draw or any result with fewer than three goals loses, so a league table alone cannot verify the old over percentages or venue-specific rates.";
  if (/Over 1\.5/i.test(pick)) return "The recorded market requires at least two total goals. Although the threshold is lower than Over 2.5, a 0-0 or 1-0 result still loses and unsupported scoring percentages cannot be retained.";
  if (/ -\d|Handicap/i.test(pick)) return `The handicap requires the selected side to win by the stated margin; ordinary favouritism is insufficient. That distinction is why unsupported claims about large wins were removed rather than inferred from ${pick}.`;
  if (/or Draw|\(1X\)|\(X2\)/i.test(pick)) return "The double-chance element protects against one draw outcome, but every additional goals condition must also land. The combination is therefore not described as automatically conservative.";
  return `The moneyline requires the named team to win; a draw is a losing outcome. Final-table context can inform the editorial view, but it cannot establish the probability of this individual fixture.`;
}

for (const [file, url, sourceName] of batches[batch] ?? []) {
  let source = readFileSync(file, "utf8");
  const home = source.match(/^\s*homeTeam:\s*"([^"]+)"/m)?.[1];
  const away = source.match(/^\s*awayTeam:\s*"([^"]+)"/m)?.[1];
  const pick = source.match(/^\s*main:\s*"([^"]+)"/m)?.[1];
  const odds = Number(source.match(/^\s*odds:\s*([0-9.]+)/m)?.[1]);
  if (!home || !away || !pick) throw new Error(`${file}: protected metadata could not be read`);
  const implied = Number.isFinite(odds) ? `${(100 / odds).toFixed(1)}% (1 ÷ ${odds.toFixed(2)})` : null;
  const paragraphs = [
    `${home} against ${away} was originally published with ${pick} as the recorded selection. During source migration, the final 2025/26 competition table was verified, but it did not substantiate all of the old venue splits, goal percentages, xG, H2H or personnel assertions; those unsupported factual details have therefore been removed.`,
    `The retained source establishes the teams' final competition records, points and goals for the relevant prior season. It is useful historical context, not a model of this single match and not evidence for injuries, transfers, tactical plans or lineups. No post-match information from this fixture has been used.`,
    marketExplanation(pick, home, away),
    `The editorial reason for preserving ${pick} is historical integrity: picks cannot be rewritten after publication. The revised page now separates that recorded opinion from what the available evidence can actually verify, and it explicitly treats the unverified parts of the original rationale as an evidence gap rather than replacing them with vague equivalents.`,
    implied ? `The stored odd implies ${implied}; this is only a mathematical conversion of the historical value. Its original bookmaker and capture provenance were not recovered. Because claim-specific coverage remains incomplete, this analysis requires manual editorial review and is classified as a partial source migration.` : "No historical odd is recorded for this pick. Because claim-specific coverage remains incomplete, this analysis requires manual editorial review and is classified as a partial source migration."
  ];
  const analysis = `analysis: [\n${paragraphs.map((p) => `  ${JSON.stringify(p)}`).join(",\n\n")}\n],\n\npicks:`;
  source = source.replace(/analysis:\s*\[[\s\S]*?\],\s*\n\s*picks:/, analysis);
  source = source.replace(/\n\s*published:\s*true/, `\n\nsourceStatus: "partial",\nsources: [\n  {\n    name: ${JSON.stringify(sourceName)},\n    url: ${JSON.stringify(url)},\n    description: "Final 2025/26 competition table used only for season record, points and goal context.",\n    accessedAt: "${accessedAt}",\n  },\n],\n\npublished: true`);
  writeFileSync(file, source, "utf8");
}
