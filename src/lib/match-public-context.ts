import type { EditorialPrediction } from "@/types";
import publicContextSections from "@/lib/public-context-sections.json";

/**
 * Public, pick-neutral context for pages whose analysis is PRIME VIP.
 *
 * The VIP analysis stays in the protected endpoint. This module only lifts the sections that carry
 * facts and data rather than the selection: team news / availability, the HOME/AWAY Statistical Core
 * table with its provenance sentence, and the sources. Everything else (match analysis, tactical
 * reading, market assessment, conclusion) is never read here.
 *
 * Fail closed: if an allowed section mentions the published pick, a price, a pick label or the BEST BET
 * tag, that section is dropped and nothing is rewritten.
 */

export type PublicMatchContext = {
  summary: string[];
  availability: { kind: "reported" | "unavailable"; markdown: string } | null;
  statisticalCore: { markdown: string } | null;
  sources: Array<{ name: string; url: string }>;
};

export const PUBLIC_CONTEXT_ALLOWED_HEADINGS: readonly string[] = publicContextSections.allowedHeadingPrefixes;

// Table rows that name a specific betting line (for example "Over 2.5 goals") can point at the selection, so only
// the neutral team metrics are published.
const MARKET_ROW = /^\s*(?:over|under)\b/i;
// BEST BET is a public tier badge, so the tag itself is not a leak; the pick and the price are.
const PICK_LABEL = /\*\*\s*(?:final\s+|published\s+)?(?:prediction|odds|pick)\s*:?\s*\*\*|\bour (?:pick|prediction|selection)\b|\bpublished (?:odds|price|selection)\b/i;
const UNAVAILABLE_TEAM_NEWS = /\bno (?:sufficiently reliable|verified|official|reliable|confirmed)\b|has been inferred|have been inferred|was not available|were not available|is not available|not available|unavailable|claim is made/i;

type Section = { level: number; heading: string; body: string; own: string };

function stripComments(markdown: string) {
  return markdown.replace(/<!--[\s\S]*?-->/g, "");
}

export function splitSections(markdown: string): Section[] {
  const lines = stripComments(markdown).replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      if (current) sections.push(current);
      current = { level: heading[1].length, heading: heading[2].replace(/\*\*/g, "").trim(), body: "", own: "" };
      continue;
    }
    if (current) {
      current.body += `${line}\n`;
      current.own += `${line}\n`;
    }
  }
  if (current) sections.push(current);
  // A section ends at the next heading of the same or a higher level: merge nested bodies back in.
  return sections.map((section, index) => {
    let body = section.body;
    for (let next = index + 1; next < sections.length && sections[next].level > section.level; next += 1) {
      body += `\n${sections[next].body}`;
    }
    return { ...section, body: body.trim(), own: section.own.trim() };
  });
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
}

/** True when the text names the published pick, its price or a pick label. */
export function textLeaksSelection(text: string, prediction: Pick<EditorialPrediction, "picks">) {
  const haystack = normalize(text);
  const pick = normalize(prediction.picks.main ?? "");
  if (pick && haystack.includes(pick)) return true;
  if (PICK_LABEL.test(text)) return true;
  const odds = [prediction.picks.publishedOdds, prediction.picks.odds]
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
    .flatMap((value) => [value.toFixed(2), String(value)]);
  // Numbers inside the metrics table (for example 1.58 goals per game) can coincide with a price, so
  // the price is only searched in prose lines.
  const prose = text.split("\n").filter((line) => !line.trim().startsWith("|")).join("\n");
  return odds.some((value) => new RegExp(`(?<![\\d.])${value.replace(".", "\\.")}(?![\\d])`).test(prose));
}

function filterCoreTable(body: string) {
  const lines = body.split("\n");
  const kept: string[] = [];
  let rows = 0;
  for (const line of lines) {
    if (line.trim().startsWith("|")) {
      const first = line.trim().replace(/^\|/, "").split("|")[0]?.replace(/\*\*/g, "") ?? "";
      if (MARKET_ROW.test(first)) continue;
      if (!/^\s*\|?\s*:?-{3,}/.test(line.trim()) && !/^metric$/i.test(first.trim())) rows += 1;
    }
    kept.push(line);
  }
  return { markdown: kept.join("\n").replace(/\n{3,}/g, "\n\n").trim(), rows };
}

export function buildPublicMatchContext(prediction: EditorialPrediction): PublicMatchContext | null {
  const markdown = (prediction.analysis ?? []).join("\n\n");
  if (!markdown) return null;
  const sections = splitSections(markdown);
  const allowed = (heading: string) => sections.find((section) => normalize(section.heading).startsWith(heading));

  let availability: PublicMatchContext["availability"] = null;
  const teamNews = allowed("team news");
  if (teamNews && teamNews.body.trim()) {
    if (UNAVAILABLE_TEAM_NEWS.test(teamNews.body) && teamNews.body.length < 700) {
      availability = { kind: "unavailable", markdown: "" };
    } else if (!textLeaksSelection(teamNews.body, prediction)) {
      availability = { kind: "reported", markdown: teamNews.body };
    }
  }

  let statisticalCore: PublicMatchContext["statisticalCore"] = null;
  const core = allowed("statistical core");
  if (core) {
    const filtered = filterCoreTable(core.body);
    // A Core with no metric rows is only a disclosure sentence; it adds nothing a reader can use.
    if (filtered.rows > 0 && !textLeaksSelection(filtered.markdown, prediction)) {
      statisticalCore = { markdown: filtered.markdown };
    }
  }

  const sources = (prediction.sources ?? [])
    .filter((source) => /^https:\/\//i.test(source.url))
    .map((source) => ({ name: source.name, url: source.url }));

  // Sources and a "no team news" disclosure alone are not context: without real data or reported news there is
  // nothing to add to the public page, and nothing is written to fill the space.
  const summary = (prediction.publicSummary ?? []).map((paragraph) => paragraph.trim()).filter((paragraph) => paragraph && !textLeaksSelection(paragraph, prediction));
  if (!statisticalCore && availability?.kind !== "reported" && summary.length === 0) return null;
  return { summary, availability, statisticalCore, sources };
}
