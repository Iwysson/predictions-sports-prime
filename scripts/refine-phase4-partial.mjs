import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const files = execFileSync("git", ["ls-files", "src/data/predictions/**/*.ts"], { encoding: "utf8" })
  .split(/\r?\n/).filter(Boolean).filter((file) => !file.endsWith("/index.ts"));
const generated = [
  /The source review for .* verified the relevant final competition table/i,
  /For this .* analysis, the final table is used only/i,
  /The recorded selection remains .* because a published pick/i,
  /The historical .* price converts mathematically/i,
  /No stored price is available for/i,
  /retains the published selection, .* as part of its pre-match record/i,
  /is preserved as part of the pre-match record/i,
  /must produce three goals for/i,
  /needs two total goals for/i,
  /gives .* two independent tests/i,
  /gives .* draw protection/i,
  /depends on winning margin rather than simple favouritism/i,
  /requires .* to win; a draw is a full loss/i,
  /The bet is defeated by a clean sheet/i,
  /has one retained evidence boundary/i,
  /is retained for the teams' prior-season competition context/i,
  /The evidence available for .* is a final competition table/i,
  /supports only broad season-record context/i,
  /Three goals are required/i,
  /This combination has two independent tests/i,
  /Two total goals are needed/i,
  /Over 2\.5 goals needs three total goals/i,
  /A controlled 1-0, 0-1 or 1-1 outcome/i,
];

function mechanics(pick, home, away) {
  if (/Both Teams to Score/i.test(pick)) return `${home}-${away} loses ${pick} if either side keeps a clean sheet; that two-sided dependency is the central risk, and the available table cannot turn it into a verified probability.`;
  if (/Over 2\.5/i.test(pick)) return `${home}-${away} must produce three goals for ${pick}; low-event scorelines such as 1-0 and 1-1 lose, and the retained table does not prove how often this matchup should cross the line.`;
  if (/Over 1\.5/i.test(pick) && /Draw|or/i.test(pick)) return `${pick} gives ${home}-${away} two independent tests: the protected result and at least two goals; no unsupported venue percentage is used to claim that both legs are likely.`;
  if (/Over 1\.5/i.test(pick)) return `${home}-${away} needs two total goals for ${pick}; 0-0 and 1-0 lose, and the cited table is insufficient for a fixture-level goals probability.`;
  if (/Handicap| -\d/i.test(pick)) return `${pick} depends on winning margin rather than simple favouritism. A narrow ${home} win may not cover the line, which is why the page does not infer handicap value from league position alone.`;
  if (/or Draw|\(1X\)|\(X2\)/i.test(pick)) return `${pick} gives ${home}-${away} draw protection, narrowing the losing routes without removing them. The source establishes no match-specific probability, so this remains an editorial view rather than a sourced certainty.`;
  const selected = pick.replace(/\s+to Win.*$/i, "");
  return `${pick} requires ${selected || "the selected side"} to win; a draw is a full loss. Season-level evidence can frame the matchup, but it cannot establish the outcome of one fixture.`;
}

function limitation(home, away, sourceName, index) {
  const options = [
    `${sourceName} is retained only for ${home} and ${away}'s prior-season competition context; it documents no pre-match lineup, injury list, tactical plan or bookmaker price for this fixture.`,
    `${home}-${away} uses ${sourceName} as a final-table reference; xG, personnel, detailed head-to-head and venue-percentage claims were removed because that source does not verify them.`,
    `For ${home}-${away}, ${sourceName} supports only broad season-record context and is not stretched into evidence about transfers, availability or either team's match plan.`,
    `${home}-${away} has one retained evidence boundary: ${sourceName} records the completed competition but cannot substantiate the old granular statistical and team-news claims, which are omitted rather than reconstructed.`,
  ];
  return options[index % options.length];
}

for (const [index, file] of files.entries()) {
  let current = readFileSync(file, "utf8");
  if (!/sourceStatus:\s*"partial"/.test(current)) continue;
  const home = current.match(/^\s*homeTeam:\s*"([^"]+)"/m)?.[1];
  const away = current.match(/^\s*awayTeam:\s*"([^"]+)"/m)?.[1];
  const pick = current.match(/^\s*main:\s*"([^"]+)"/m)?.[1];
  const sourceName = current.match(/name:\s*"([^"]+)"/)?.[1] ?? "the cited final table";
  if (!home || !away || !pick) throw new Error(`${file}: required metadata missing`);
  const block = current.match(/analysis:\s*\[([\s\S]*?)\],\s*\n\s*picks:/)?.[1] ?? "";
  const existing = [...block.matchAll(/"((?:\\.|[^"\\])*)"/g)]
    .map((match) => JSON.parse(`"${match[1]}"`))
    .filter((paragraph) => !generated.some((pattern) => pattern.test(paragraph)))
    .filter((paragraph) => paragraph.length >= 55);
  const boundary = limitation(home, away, sourceName, index);
  const market = mechanics(pick, home, away);
  const record = `${home} versus ${away} retains the published selection, ${pick}, as part of its pre-match record; this migration uses no eventual result and does not claim that the available evidence independently proves the pick.`;
  const paragraphs = index % 3 === 0 ? [boundary, ...existing.slice(0, 2), market, record]
    : index % 3 === 1 ? [...existing.slice(0, 2), boundary, record, market]
      : [market, boundary, ...existing.slice(0, 2), record];
  const replacement = `analysis: [\n${paragraphs.map((p) => `  ${JSON.stringify(p)}`).join(",\n\n")}\n],\n\npicks:`;
  current = current.replace(/analysis:\s*\[[\s\S]*?\],\s*\n\s*picks:/, replacement);
  writeFileSync(file, current, "utf8");
}
