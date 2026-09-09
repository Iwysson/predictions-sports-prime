import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { matches } from "../src/data/matches.ts";
import { toMatchPreview } from "../src/lib/editorial.ts";
import { hydratePredictions } from "../src/lib/live-predictions.ts";
import { isFutureFixture } from "../src/lib/fixture-state.ts";

const pages = [
  "index.html",
  "today-predictions/index.html",
  "league/mls/index.html",
  "league/premier-league/index.html",
  "football-predictions/index.html",
  "picks/index.html",
];
const genericAnchor = /^(?:view|view ›|read|read more|read full analysis|full analysis|prediction|match prediction)$/i;
const futureMatches = (await hydratePredictions(matches.map(toMatchPreview)))
  .filter((match) => match.status === "published" && isFutureFixture(match));
const futureBySlug = new Map(futureMatches.map((match) => [match.slug, match]));
const checkedSlugs = new Set();
let specificAnchors = 0;
let genericAnchors = 0;
let hrefMismatches = 0;
const genericDetails = [];

function visibleText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:rsaquo|gt);|&#x203a;/gi, "›")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

for (const page of pages) {
  const html = readFileSync(join(process.cwd(), "out", page), "utf8");
  const anchors = [...html.matchAll(/<a\b[^>]*href="([^"]*\/match\/([^/]+)\/?)"[^>]*>([\s\S]*?)<\/a>/gi)];
  for (const anchor of anchors) {
    const [, href, slug, body] = anchor;
    const match = futureBySlug.get(slug);
    if (!match) continue;
    const articleStart = html.lastIndexOf("<article", anchor.index);
    const renderedContext = articleStart >= 0 ? html.slice(articleStart, anchor.index) : "";
    if (/prediction-pill--live/.test(renderedContext)) continue;
    checkedSlugs.add(slug);
    const text = visibleText(body);
    if (genericAnchor.test(text)) {
      genericAnchors += 1;
      genericDetails.push(`${page}: ${slug} -> ${JSON.stringify(text)}`);
    }
    const hasHome = text.toLocaleLowerCase().includes(match.homeTeam.toLocaleLowerCase());
    const hasAway = text.toLocaleLowerCase().includes(match.awayTeam.toLocaleLowerCase());
    if (hasHome && hasAway) specificAnchors += 1;
    else hrefMismatches += 1;
    assert.match(href, new RegExp(`/match/${match.slug}/?$`), `${page}: href mismatch for ${match.slug}`);
  }
}

assert.ok(checkedSlugs.size >= 6, `Expected at least 6 future match cards, found ${checkedSlugs.size}`);
if (genericDetails.length) console.error(genericDetails.join("\n"));
assert.equal(genericAnchors, 0, `Generic future-match anchors remain: ${genericAnchors}`);
assert.equal(hrefMismatches, 0, `Future href/fixture mismatches: ${hrefMismatches}`);
assert.ok(specificAnchors > 0, "No match-specific future anchors found");

console.log(`Pages checked: ${pages.length}`);
console.log(`Future match links checked: ${specificAnchors}`);
console.log(`Future match slugs checked: ${checkedSlugs.size}`);
console.log("Generic primary anchors for future matches: 0");
console.log("Href/fixture mismatches: 0");
console.log("Match-specific internal linking audit: PASS");
