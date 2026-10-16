// Context leak rules. Run: node scripts/test-leak-context.mjs
import assert from "node:assert/strict";
import { protectedPickLeaks, multipleWindows, maskSettledResultRecords } from "./lib/leak-context.mjs";

const colorado = { pick: "Colorado Avalanche to Win", oddsText: "1.65" };
const multipleBlock = (inner) => `<article>NHL + FOOTBALL BEST MULTIPLE TODAY ${inner} Combined odds: 2.76</article>`;

let passed = 0;
const check = (name, fn) => {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
};

check("the pick inside the FREE multiple block is allowed", () => {
  const text = multipleBlock("Colorado Avalanche to Win @1.65");
  assert.deepEqual(protectedPickLeaks(text, colorado, "colorado"), []);
});
check("the same pick outside the multiple (individual card) is a leak", () => {
  // Push the stray card far past the multiple span so it is outside the allowed window.
  const far = `${multipleBlock("")}${"y".repeat(3000)}<section>Colorado Avalanche to Win</section>`;
  const leaks = protectedPickLeaks(far, colorado, "colorado");
  assert.equal(leaks.length, 1);
  assert.equal(leaks[0].kind, "pick-outside-context");
});
check("odds 1.65 next to the protected pick outside the multiple is a leak", () => {
  const text = `<section>Colorado Avalanche to Win</section><b>1.65</b>`;
  const kinds = protectedPickLeaks(text, colorado, "colorado").map((l) => l.kind);
  assert.ok(kinds.includes("odds-outside-context"));
});
check("a protected pick inside a multiple block is still a leak if it is not a multiple leg", () => {
  const text = multipleBlock("Edmonton Oilers to Win");
  const edmonton = { pick: "Edmonton Oilers to Win", oddsText: "1.87" };
  assert.equal(protectedPickLeaks(text, edmonton, "edmonton").length, 1);
});
check("text without the pick produces no leak", () => {
  assert.deepEqual(protectedPickLeaks("nothing to see", colorado, "colorado"), []);
});
check("Dundee pick does not match the longer public NHL pick", () => {
  const dundee = { pick: "Rangers to Win", oddsText: "1.35" };
  const nhl = '{slug:"vancouver-canucks-vs-new-york-rangers",access:"free",pick:"New York Rangers to Win (Including OT & Shootout)",odds:1.43}';
  assert.deepEqual(protectedPickLeaks(nhl, dundee, "dundee-vs-rangers"), []);
});
check("Dundee pick in its own serialized entry is still caught", () => {
  const dundee = { pick: "Rangers to Win", oddsText: "1.35" };
  const exposed = '{slug:"dundee-vs-rangers",pick:"Rangers to Win",odds:"1.35"}';
  const kinds = protectedPickLeaks(exposed, dundee, "dundee-vs-rangers").map((leak) => leak.kind);
  assert.ok(kinds.includes("pick-outside-context"));
  assert.ok(kinds.includes("odds-outside-context"));
});
check("Dundee pick in a rendered HTML element is still caught", () => {
  const dundee = { pick: "Rangers to Win", oddsText: "1.35" };
  const kinds = protectedPickLeaks('<div class="psp-pick__value">Rangers to Win</div><b>1.35</b>', dundee, "dundee-vs-rangers").map((leak) => leak.kind);
  assert.ok(kinds.includes("pick-outside-context"));
  assert.ok(kinds.includes("odds-outside-context"));
});
check("the multiple window is bounded (does not cover the whole file)", () => {
  const text = `${multipleBlock("")}${"z".repeat(5000)}`;
  const [[start, end]] = multipleWindows(text);
  assert.equal(start, text.indexOf("NHL + FOOTBALL"));
  assert.ok(end < text.length);
});


// A settled result card that the page streams as an RSC payload: the keyed article element and the separately
// streamed details element, at every escape depth Next.js produces (shapes copied from the built /results page).
// The /results page legitimately publishes the original pick of a FINAL, settled record; a protected entry that
// merely shares the same market text (here a VIP game with the same pick) must not be reported because of it.
const SETTLED_PICK = "Over 1.5 Goals + Over 7.5 Corners";
const SETTLED_KEY = "premier-league:crystal-palace-vs-nottingham-forest";
const settled = {
  [SETTLED_KEY]: {
    key: SETTLED_KEY,
    slug: "crystal-palace-vs-nottingham-forest",
    date: "2026-10-11",
    prediction: SETTLED_PICK,
    odds: 1.66,
    finalScore: { home: 3, away: 1 },
    result: "green",
  },
};
const el = (q, tag, props, children) => `[${q}$${q},${q}${tag}${q},${props},{${children}}]`;
const kv = (q, k, v) => `${q}${k}${q}:${typeof v === "number" ? v : `${q}${v}${q}`}`;
const rscArticle = (q) =>
  el(q, "article", `${q}${SETTLED_KEY}${q}`, `${kv(q, "data-pick", SETTLED_PICK)},${kv(q, "data-odds", 1.66)},${q}children${q}:[[${q}$${q},${q}h2${q},null,{${kv(q, "children", "Crystal Palace")}}]]`);
const rscDetails = (q, date = "2026-10-11", odds = 1.66) =>
  el(q, "dl", "null", `${kv(q, "className", "result-card__details")},${q}children${q}:[${kv(q, "children", date)},${kv(q, "children", SETTLED_PICK)},${kv(q, "children", odds)}]`);
const juventusProtected = { pick: SETTLED_PICK, oddsText: "1.60" };
for (const [label, q] of [["plain", '"'], ["escaped once", '\\"'], ["escaped twice", '\\\\\\"']]) {
  check(`settled RSC result card (${label}) is masked, so a same-text protected pick is not reported`, () => {
    const text = `x ${rscArticle(q)} y ${rscDetails(q)} z`;
    const masked = maskSettledResultRecords(text, settled);
    assert.equal(masked.includes(SETTLED_PICK), false);
    assert.deepEqual(protectedPickLeaks(masked, juventusProtected, "juventus-vs-lazio"), []);
  });
}
check("a same-text pick in an RSC details element with another date and odds is NOT masked (still a leak)", () => {
  const masked = maskSettledResultRecords(`a ${rscDetails('\\\\\\"', "2026-10-19", 1.6)} b`, settled);
  assert.ok(masked.includes(SETTLED_PICK));
  assert.ok(protectedPickLeaks(masked, juventusProtected, "juventus-vs-lazio").length > 0);
});
check("an unsettled record's RSC result card is never masked", () => {
  const unsettled = { [SETTLED_KEY]: { ...settled[SETTLED_KEY], result: undefined } };
  assert.ok(maskSettledResultRecords(rscArticle('\\"'), unsettled).includes(SETTLED_PICK));
});

console.log(`\n${passed} context checks passed`);
