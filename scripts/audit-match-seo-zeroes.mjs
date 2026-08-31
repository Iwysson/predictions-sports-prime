import { editorialPredictions } from "../src/data/predictions/index";

// A zero token is a standalone numeric component (0, 0.00, 0%, 0/2 or 2-0-0).
// Scores are not inspected here: this audit is intentionally scoped to the
// editorial statistics module, where an unexplained zero can masquerade as data.
const ZERO_TOKEN = /(^|[^0-9])0(?:\.0+)?(?=$|[^0-9])/;
const failures = [];

for (const prediction of editorialPredictions) {
  for (const row of prediction.matchSeo?.statistics?.rows ?? []) {
    if ((ZERO_TOKEN.test(row.home) || ZERO_TOKEN.test(row.away)) && !row.zeroVerified) {
      failures.push(`${prediction.homeTeam} vs ${prediction.awayTeam}: ${row.label}`);
    }
  }
}

if (failures.length) {
  console.error("Unverified zero values in Match SEO statistics:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log("Match SEO zero audit passed: statistical zeroes are explicitly verified; match scores were excluded.");
