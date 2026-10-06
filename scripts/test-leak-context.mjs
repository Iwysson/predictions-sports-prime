// Context leak rules. Run: node scripts/test-leak-context.mjs
import assert from "node:assert/strict";
import { protectedPickLeaks, multipleWindows } from "./lib/leak-context.mjs";

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
check("the multiple window is bounded (does not cover the whole file)", () => {
  const text = `${multipleBlock("")}${"z".repeat(5000)}`;
  const [[start, end]] = multipleWindows(text);
  assert.equal(start, text.indexOf("NHL + FOOTBALL"));
  assert.ok(end < text.length);
});

console.log(`\n${passed} context checks passed`);
