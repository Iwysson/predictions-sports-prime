import type { Match } from "@/types";

export type StatisticalCoreRow = { label: string; home: string; away: string };

// These are the already-published HOME/AWAY Statistical Core rows whose
// editorial prose was localized separately. Keeping them here lets every
// locale render one structured table without copying the table into the body.
const publishedCoreTables: Record<string, string> = {
  "lincoln-city-vs-blackburn-rovers": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-0-1 | 0-1-0 |
| Points/game | 0.00 | 1.00 |
| GF/game | 1.00 | 2.00 |
| GA/game | 3.00 | 2.00 |
| xG/game | 2.29 | 0.82 |
| xGA/game | 1.15 | 2.04 |
| Shots/game | 15.00 | 10.00 |
| SOT/game | 5.00 | 5.00 |
| Shots allowed/game | 13.00 | 18.00 |
| SOT allowed/game | 7.00 | 3.00 |
| Possession | 39% | 45% |
| Corners for/game | 8.00 | 5.00 |
| Corners against/game | 3.00 | 5.00 |
| Total corners/game | 11.00 | 10.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 100% | 100% |
| First to score | 0% | 0% |
| First to concede | 100% | 100% |
| Scored in 1st half | 100% | 100% |
| Conceded in 1st half | 100% | 100% |
| Over 1.5 goals | 100% | 100% |
| Over 2.5 goals | 100% | 100% |
| Over 3.5 goals | 100% | 100% |
| BTTS | 100% | 100% |
| Clean sheets | 0% | 0% |
| Failed to score | 0% | 0% |`,
  "portsmouth-vs-derby-county": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-0-1 | 0-0-1 |
| Points/game | 0.00 | 0.00 |
| GF/game | 1.00 | 1.00 |
| GA/game | 3.00 | 2.00 |
| xG/game | 2.00 | 1.01 |
| xGA/game | 2.04 | 1.07 |
| Shots/game | 16.00 | 15.00 |
| SOT/game | 6.00 | 4.00 |
| Shots allowed/game | 13.00 | 13.00 |
| SOT allowed/game | 6.00 | 4.00 |
| Possession | 54% | 55% |
| Corners for/game | 7.00 | 4.00 |
| Corners against/game | 3.00 | 5.00 |
| Total corners/game | 10.00 | 9.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 100% | 0% |
| First to score | 100% | 100% |
| First to concede | 0% | 0% |
| Scored in 1st half | 100% | 100% |
| Conceded in 1st half | 100% | 0% |
| Over 1.5 goals | 100% | 100% |
| Over 2.5 goals | 100% | 100% |
| Over 3.5 goals | 100% | 0% |
| BTTS | 100% | 100% |
| Clean sheets | 0% | 0% |
| Failed to score | 0% | 0% |`,
  "preston-north-end-vs-bristol-city": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-0-1 | 0-1-0 |
| Points/game | 0.00 | 1.00 |
| GF/game | 1.00 | 2.00 |
| GA/game | 3.00 | 2.00 |
| xG/game | 0.66 | 1.43 |
| xGA/game | 1.54 | 1.98 |
| Shots/game | 13.00 | 14.00 |
| SOT/game | 2.00 | 6.00 |
| Shots allowed/game | 16.00 | 8.00 |
| SOT allowed/game | 5.00 | 2.00 |
| Possession | 45% | 35% |
| Corners for/game | 5.00 | 3.00 |
| Corners against/game | 4.00 | 7.00 |
| Total corners/game | 9.00 | 10.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 0% | 100% |
| First to score | 0% | 100% |
| First to concede | 100% | 0% |
| Scored in 1st half | 0% | 100% |
| Conceded in 1st half | 100% | 100% |
| Over 1.5 goals | 100% | 100% |
| Over 2.5 goals | 100% | 100% |
| Over 3.5 goals | 100% | 100% |
| BTTS | 100% | 100% |
| Clean sheets | 0% | 0% |
| Failed to score | 0% | 0% |`,
  "sheffield-united-vs-bolton-wanderers": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-1-0 | 0-1-0 |
| Points/game | 1.00 | 1.00 |
| GF/game | 0.00 | 0.00 |
| GA/game | 0.00 | 0.00 |
| xG/game | 0.36 | 0.13 |
| xGA/game | 0.65 | 1.94 |
| Shots/game | 3.00 | 2.00 |
| SOT/game | 1.00 | 0.00 |
| Shots allowed/game | 10.00 | 17.00 |
| SOT allowed/game | 2.00 | 9.00 |
| Possession | 45% | 45% |
| Corners for/game | 2.00 | 2.00 |
| Corners against/game | 8.00 | 9.00 |
| Total corners/game | 10.00 | 11.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 100% | 100% |
| First to score | 0% | 0% |
| First to concede | 0% | 0% |
| Scored in 1st half | 0% | 0% |
| Conceded in 1st half | 0% | 0% |
| Over 1.5 goals | 0% | 0% |
| Over 2.5 goals | 0% | 0% |
| Over 3.5 goals | 0% | 0% |
| BTTS | 0% | 0% |
| Clean sheets | 100% | 100% |
| Failed to score | 100% | 100% |`,
  "west-ham-united-vs-wolverhampton-wanderers": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-0-1 | 1-0-0 |
| Points/game | 0.00 | 3.00 |
| GF/game | 1.00 | 3.00 |
| GA/game | 2.00 | 1.00 |
| xG/game | 2.96 | 1.54 |
| xGA/game | 0.57 | 0.66 |
| Shots/game | 25.00 | 16.00 |
| SOT/game | 9.00 | 5.00 |
| Shots allowed/game | 7.00 | 13.00 |
| SOT allowed/game | 5.00 | 2.00 |
| Possession | 78% | 55% |
| Corners for/game | 7.00 | 4.00 |
| Corners against/game | 4.00 | 5.00 |
| Total corners/game | 11.00 | 9.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 100% | 0% |
| First to score | 0% | 100% |
| First to concede | 100% | 0% |
| Scored in 1st half | 0% | 100% |
| Conceded in 1st half | 100% | 0% |
| Over 1.5 goals | 100% | 100% |
| Over 2.5 goals | 100% | 100% |
| Over 3.5 goals | 0% | 100% |
| BTTS | 100% | 100% |
| Clean sheets | 0% | 0% |
| Failed to score | 0% | 0% |`,
  "birmingham-city-vs-southampton": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-1-0 | 0-0-1 |
| Points/game | 1.00 | 0.00 |
| GF/game | 2.00 | 1.00 |
| GA/game | 2.00 | 2.00 |
| xG/game | 1.98 | 1.65 |
| xGA/game | 1.43 | 0.83 |
| Shots/game | 8.00 | 17.00 |
| SOT/game | 2.00 | 3.00 |
| Shots allowed/game | 14.00 | 16.00 |
| SOT allowed/game | 6.00 | 4.00 |
| Possession | 65% | 66% |
| Corners for/game | 7.00 | 8.00 |
| Corners against/game | 3.00 | 4.00 |
| Total corners/game | 10.00 | 12.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 100% | 100% |
| First to score | 0% | 0% |
| First to concede | 100% | 100% |
| Scored in 1st half | 100% | 0% |
| Conceded in 1st half | 100% | 100% |
| Over 1.5 goals | 100% | 100% |
| Over 2.5 goals | 100% | 100% |
| Over 3.5 goals | 100% | 0% |
| BTTS | 100% | 100% |
| Clean sheets | 0% | 0% |
| Failed to score | 0% | 0% |`,
  "stoke-city-vs-norwich-city": `
| Matches (N) | 1 | 1 |
| W-D-L | 0-0-1 | 0-0-1 |
| Points/game | 0.00 | 0.00 |
| GF/game | 1.00 | 0.00 |
| GA/game | 2.00 | 3.00 |
| xG/game | 0.63 | 1.12 |
| xGA/game | 0.61 | 2.61 |
| Shots/game | 6.00 | 8.00 |
| SOT/game | 2.00 | 2.00 |
| Shots allowed/game | 7.00 | 19.00 |
| SOT allowed/game | 3.00 | 7.00 |
| Possession | 41% | 48% |
| Corners for/game | 4.00 | 3.00 |
| Corners against/game | 5.00 | 8.00 |
| Total corners/game | 9.00 | 11.00 |
| Over 7.5 corners | 100% | 100% |
| Over 8.5 corners | 100% | 100% |
| Over 9.5 corners | 0% | 100% |
| First to score | 100% | 0% |
| First to concede | 0% | 100% |
| Scored in 1st half | 100% | 0% |
| Conceded in 1st half | 100% | 100% |
| Over 1.5 goals | 100% | 100% |
| Over 2.5 goals | 100% | 100% |
| Over 3.5 goals | 0% | 0% |
| BTTS | 100% | 0% |
| Clean sheets | 0% | 0% |
| Failed to score | 0% | 100% |`,
  "atletico-mineiro-vs-cruzeiro": `
| Matches (N) | 3 | 3 |
| W-D-L | 2-1-0 | 0-2-1 |
| Points/game | 2.33 | 0.67 |
| GF/game | 1.33 | 1.00 |
| GA/game | 0.67 | 1.67 |
| xG/game | — | — |
| xGA/game | — | — |
| Shots/game | 18.67 | 13.67 |
| SOT/game | 8.00 | 4.67 |
| Shots allowed/game | 10.00 | 16.67 |
| SOT allowed/game | 2.33 | 5.33 |
| Possession | 59.3% | 55.3% |
| Corners for/game | 7.67 | 4.33 |
| Corners against/game | 1.67 | 6.67 |
| Total corners/game | 9.33 | 11.00 |
| Over 7.5 corners | 100% | 67% |
| Over 8.5 corners | 33% | 67% |
| Over 9.5 corners | 33% | 67% |
| First to score | 67% | 0% |
| First to concede | 0% | 67% |
| Scored in 1st half | 67% | 33% |
| Conceded in 1st half | 0% | 67% |
| Over 1.5 goals | 67% | 67% |
| Over 2.5 goals | 67% | 67% |
| Over 3.5 goals | 0% | 67% |
| BTTS | 67% | 67% |
| Clean sheets | 33% | 33% |
| Failed to score | 33% | 33% |`,
};

function parseRows(markdown: string): StatisticalCoreRow[] {
  return markdown.split("\n").flatMap((line) => {
    if (!line.trim().startsWith("|")) return [];
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 3 || /^(?:metric|---)/i.test(cells[0])) return [];
    return [{ label: cells[0], home: cells[1], away: cells[2] }];
  });
}

export function extractStatisticalCoreRows(match: Match): StatisticalCoreRow[] {
  const markdown = match.analysis.join("\n\n");
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const tableLines: string[] = [];
  let inSection = false;

  for (const line of lines) {
    if (/^#{0,3}\s*Statistical Core\b/i.test(line.trim())) {
      inSection = true;
      continue;
    }

    if (!inSection) continue;
    if (line.trim().startsWith("|")) {
      tableLines.push(line);
      continue;
    }
    if (tableLines.length > 0) break;
  }

  if (tableLines.length) return parseRows(tableLines.join("\n"));
  const publishedRows = parseRows(publishedCoreTables[match.slug] ?? "");
  if (publishedRows.length) return publishedRows;
  return (match.matchSeo?.statistics?.rows ?? []).map(({ label, home, away }) => ({ label, home, away }));
}
