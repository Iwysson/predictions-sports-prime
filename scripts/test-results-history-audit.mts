// Unit tests for the /results/ History integrity check used by scripts/audit-seo.mjs
// (src/lib/results-history-audit.ts). Guards the exact regression this replaces: the settled-results
// archive growing past the currently-published match-page count must never raise a false SEO error.
// Run: npx tsx scripts/test-results-history-audit.mts   (npm run test:results-history-audit)
import { readFileSync } from "node:fs";
import { checkResultsHistoryIntegrity, RESULTS_HISTORY_VISIBLE_LIMIT } from "../src/lib/results-history-audit.ts";

const assert = (ok: unknown, label: string) => {
  if (!ok) throw new Error(`FAIL ${label}`);
  console.log(`PASS ${label}`);
};

const slugHtml = (slug: string) => `<article data-result-slug="${slug}"></article>`;

// --- The exact regression: the archive growing past the published match-page count ----------------
// (the old check compared historyEntries against matchRoutes.length, which only ever shrinks as
// matches settle and retire their pages, while the archive only ever grows).
{
  const settledSlugs = Array.from({ length: 50 }, (_, i) => `settled-match-${i}`);
  // A realistic "currently published match pages" count far below the archive size - this alone must
  // never be treated as an error now.
  const currentlyPublishedMatchPages = 12;
  void currentlyPublishedMatchPages;
  const historyHtml = settledSlugs.map(slugHtml).join("");
  const errors = checkResultsHistoryIntegrity({ historyHtml, settledSlugs });
  assert(errors.length === 0, "an archive far larger than the live match-page count raises no false error");
}

// --- The cap: only the first RESULTS_HISTORY_VISIBLE_LIMIT records are expected to render -----------
{
  const total = RESULTS_HISTORY_VISIBLE_LIMIT + 75;
  const settledSlugs = Array.from({ length: total }, (_, i) => `settled-match-${i}`);
  const rendered = settledSlugs.slice(0, RESULTS_HISTORY_VISIBLE_LIMIT);
  const historyHtml = rendered.map(slugHtml).join("");
  const errors = checkResultsHistoryIntegrity({ historyHtml, settledSlugs });
  assert(errors.length === 0, `an archive of ${total} records with only the capped ${RESULTS_HISTORY_VISIBLE_LIMIT} rendered raises no error`);
}

// --- Genuine integrity failures must still be caught -------------------------------------------------
{
  // Fewer entries rendered than the archive (and under the cap): a real under-render bug.
  const settledSlugs = ["a", "b", "c"];
  const historyHtml = [slugHtml("a"), slugHtml("b")].join("");
  const errors = checkResultsHistoryIntegrity({ historyHtml, settledSlugs });
  assert(errors.some((e) => e.includes("renders 2 History entries, expected 3")), "an under-render is still flagged");
}
{
  // More entries rendered than the archive (and under the cap): a real over-render bug.
  const settledSlugs = ["a", "b"];
  const historyHtml = [slugHtml("a"), slugHtml("b"), slugHtml("c")].join("");
  const errors = checkResultsHistoryIntegrity({ historyHtml, settledSlugs });
  assert(errors.some((e) => e.includes("renders 3 History entries, expected 2")), "an over-render is still flagged");
}
{
  // A duplicate rendered slug (same match rendered twice) is still a real integrity defect.
  const settledSlugs = ["a", "b"];
  const historyHtml = [slugHtml("a"), slugHtml("a")].join("");
  const errors = checkResultsHistoryIntegrity({ historyHtml, settledSlugs });
  assert(errors.some((e) => e.includes("duplicate History entries rendered (a)")), "a duplicate rendered slug is still flagged");
}
{
  // A rendered slug that does not exist in the canonical archive (fabricated/stale) is still flagged.
  const settledSlugs = ["a", "b"];
  const historyHtml = [slugHtml("a"), slugHtml("ghost-match")].join("");
  const errors = checkResultsHistoryIntegrity({ historyHtml, settledSlugs });
  assert(errors.some((e) => e.includes("History renders a slug absent from the settled-results archive (ghost-match)")), "an unknown rendered slug is still flagged");
}
{
  // An empty archive with an empty render is consistent (checked separately from "History is empty" in
  // the audit script, which only fires when the VIP archive link is also missing).
  const errors = checkResultsHistoryIntegrity({ historyHtml: "", settledSlugs: [] });
  assert(errors.length === 0, "an empty archive with no rendered entries is consistent");
}

// --- The cap constant must stay in sync with PredictionResultsArchive.RESULTS_VISIBLE_LIMIT ----------
{
  const componentSource = readFileSync("src/components/PredictionResultsArchive.tsx", "utf8");
  const match = componentSource.match(/RESULTS_VISIBLE_LIMIT\s*=\s*(\d+)/);
  assert(match !== null, "PredictionResultsArchive.tsx still exports a numeric RESULTS_VISIBLE_LIMIT");
  assert(Number(match?.[1]) === RESULTS_HISTORY_VISIBLE_LIMIT, "RESULTS_HISTORY_VISIBLE_LIMIT matches the component's RESULTS_VISIBLE_LIMIT");
}

console.log("All results-history-audit tests passed.");
