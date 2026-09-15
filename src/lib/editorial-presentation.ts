/**
 * Public editorial presentation helpers.
 *
 * Historical source records remain immutable. These helpers only remove exact
 * repeated substantive blocks from the rendered presentation so a preserved
 * article cannot expose the same analytical paragraph twice because of an
 * older import/template artifact.
 */

function normalizeBlock(value: string) {
  return value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
}

function isDuplicateCandidate(value: string) {
  const normalized = normalizeBlock(value);
  if (normalized.length < 80) return false;
  if (normalized.startsWith("|")) return false;
  // Repeating the final pick/price label is part of the historical editorial
  // record and is not treated as analytical duplication.
  if (/^\*\*(?:final )?prediction:\*\*/i.test(normalized)) return false;
  if (/^\*\*(?:published )?odds:\*\*/i.test(normalized)) return false;
  if (/^\*\*prediction:\*\* [^*]+ \*\*odds:\*\* \d+(?:\.\d+)?$/i.test(normalized)) return false;
  return true;
}

export function dedupeEditorialBlocks<T extends string>(blocks: readonly T[]): T[] {
  const seen = new Set<string>();
  const output: T[] = [];
  for (const block of blocks) {
    if (!isDuplicateCandidate(block)) {
      output.push(block);
      continue;
    }
    const key = normalizeBlock(block);
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(block);
  }
  return output;
}

export function dedupeEditorialMarkdown(markdown: string) {
  const blocks = markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  return dedupeEditorialBlocks(blocks).join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

const repeatedMatchMetaLabel =
  /^(?:competition|phase|round|date|kick-?off|time|venue|location|fixture|season|matchday|status|home|away)$/i;

function isRepeatedMatchMetaLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return false;

  const labels = [...trimmed.matchAll(/\*\*([^*:]+):?\*\*/g)].map((match) => match[1].trim());
  return labels.length > 0 && labels.every((label) => repeatedMatchMetaLabel.test(label));
}

/**
 * The match header is the single public source for competition, round, date,
 * kickoff and venue. Older editorial records can retain those facts in their
 * source markdown, while this presentation-only pass prevents a second
 * "Match Information" card/table from being rendered below the header.
 */
export function stripRepeatedMatchMetadata(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^#{1,6}\s+match information\s*$/i.test(trimmed)) continue;

    if (/^\|\s*match information\s*\|/i.test(trimmed)) {
      while (index + 1 < lines.length && /^\s*\|/.test(lines[index + 1])) index += 1;
      continue;
    }

    if (isRepeatedMatchMetaLine(line)) continue;
    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function editorialPresentationText(analysis: readonly string[], format?: "markdown") {
  return format === "markdown"
    ? stripRepeatedMatchMetadata(dedupeEditorialMarkdown(analysis.join("\n\n")))
    : dedupeEditorialBlocks(analysis).join("\n\n");
}
