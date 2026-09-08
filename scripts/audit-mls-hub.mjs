import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { matches } from "../src/data/matches.ts";
import { editorialPredictions } from "../src/data/predictions/index.ts";
import { getAdSenseIndexableSlugs } from "../src/lib/adsense-content-quality.ts";

const targetDate = "2026-09-09";
const registered = matches.filter((match) =>
  match.league === "mls" && match.date === targetDate && match.status === "published"
);
const indexable = new Set(getAdSenseIndexableSlugs(editorialPredictions));
const eligible = registered.filter((match) => indexable.has(match.slug));
const html = await readFile(".next/server/app/league/mls.html", "utf8");
const sectionStart = html.indexOf("league-upcoming-heading");
const sectionEnd = html.indexOf("</section>", sectionStart);
assert.ok(sectionStart >= 0 && sectionEnd > sectionStart, "MLS upcoming section was not rendered.");
const section = html.slice(sectionStart, sectionEnd);
const rendered = eligible.filter((match) => section.includes(`/match/${match.slug}/`));
const uniqueRendered = new Set(rendered.map((match) => match.slug));

console.log(`Registered: ${registered.length}`);
console.log(`Hub eligible: ${eligible.length}`);
console.log(`Hub rendered: ${rendered.length}`);
console.log(`Prediction available: ${uniqueRendered.size}`);
console.log(`Missing: ${eligible.filter((match) => !uniqueRendered.has(match.slug)).length}`);
console.log(`Duplicates: ${rendered.length - uniqueRendered.size}`);

assert.equal(registered.length, 14);
assert.equal(eligible.length, 14);
assert.equal(rendered.length, 14);
assert.equal(uniqueRendered.size, 14);
