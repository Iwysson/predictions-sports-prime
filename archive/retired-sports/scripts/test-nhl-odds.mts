// Decimal-to-American odds conversion tests.
// Run: node --import tsx scripts/test-nhl-odds.mts
import assert from "node:assert/strict";
import { decimalToAmericanOdds, formatAmericanOdds, formatOddsPair } from "../src/lib/odds.ts";

let passed = 0;
const check = (name: string, fn: () => void) => {
  fn();
  passed += 1;
  console.log(`ok  ${name}`);
};

check("known decimal-to-American conversions match", () => {
  assert.equal(decimalToAmericanOdds(1.62), -161);
  assert.equal(decimalToAmericanOdds(1.65), -154);
  assert.equal(decimalToAmericanOdds(1.67), -149);
  assert.equal(decimalToAmericanOdds(1.87), -115);
  assert.equal(decimalToAmericanOdds(2.76), 176);
});

check("decimal exactly 2.00 is the even-money boundary (+100)", () => {
  assert.equal(decimalToAmericanOdds(2.0), 100);
});

check("positive American odds always show a leading +", () => {
  assert.equal(formatAmericanOdds(176), "+176");
  assert.equal(formatAmericanOdds(100), "+100");
  assert.equal(formatAmericanOdds(-154), "-154");
});

check("formatOddsPair renders decimal and American together", () => {
  assert.equal(formatOddsPair(1.65), "1.65 (-154)");
  assert.equal(formatOddsPair(2.76), "2.76 (+176)");
});

console.log(`\n${passed} odds-conversion checks passed`);
