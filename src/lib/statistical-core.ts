import type { Match } from "@/types";

export type StatisticalCoreRow = { label: string; home: string; away: string };

export function extractStatisticalCoreRows(match: Match): StatisticalCoreRow[] {
  const markdown = match.analysis.join("\n");
  return markdown.split("\n").flatMap((line) => {
    if (!line.trim().startsWith("|")) return [];
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 3 || /^(?:metric|---)/i.test(cells[0])) return [];
    return [{ label: cells[0], home: cells[1], away: cells[2] }];
  });
}
