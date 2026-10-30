// Pure validation for the /results/ History list, shared by scripts/audit-seo.mjs and its test
// (scripts/test-results-history-audit.mts). Kept separate from the Results page/components: it only
// reads what they already render, never changes their layout, results, odds or settlement logic.
//
// The settled-results archive (src/data/football-results.snapshot.json) only ever grows - a FINAL and
// settled match keeps its result forever - while the number of currently-published /match/[slug]/ pages
// shrinks every time one of those matches retires its page (src/lib/match-page-lifecycle.ts). Validating
// History against "page count" was therefore guaranteed to start failing once the archive outgrew the
// live page count, with no actual SEO defect involved. History must instead be validated against the
// archive itself: how many of its records the page renders, and whether what it renders is consistent
// (no fabricated/stale slug, no duplicate).

// Records per page of the /results/ list (src/components/PredictionResultsArchive.tsx). The whole archive still
// reaches the page: every settled record is in its serialized payload, and the other pages render from there.
export const RESULTS_HISTORY_VISIBLE_LIMIT = 50;

export type ResultsHistoryCheckInput = {
  /** The rendered /results/ page HTML (or any fragment containing its data-result-slug attributes). */
  historyHtml: string;
  /** One slug per settled record in the canonical archive; duplicates across leagues are expected. */
  settledSlugs: readonly string[];
  /** Defaults to RESULTS_HISTORY_VISIBLE_LIMIT. */
  visibleLimit?: number;
  /** The real page must carry the entire archive in its payload; unit fixtures render only cards. */
  requireFullPayload?: boolean;
};

/** Returns plain-English integrity errors (empty when History is consistent with the archive). */
export function checkResultsHistoryIntegrity({
  historyHtml,
  settledSlugs,
  visibleLimit = RESULTS_HISTORY_VISIBLE_LIMIT,
  requireFullPayload = false,
}: ResultsHistoryCheckInput): string[] {
  const errors: string[] = [];
  const renderedSlugs = [...historyHtml.matchAll(/data-result-slug="([^"]*)"/g)].map((match) => match[1]);
  const historyEntries = renderedSlugs.length;
  // The first page can legitimately hold pending records too (data-pending-slug), so it renders at most a page.
  const pendingEntries = [...historyHtml.matchAll(/data-pending-slug="([^"]*)"/g)].length;
  const expectedHistoryEntries = Math.min(settledSlugs.length, visibleLimit - Math.min(pendingEntries, visibleLimit));

  if (historyEntries !== expectedHistoryEntries) {
    errors.push(
      `renders ${historyEntries} History entries, expected ${expectedHistoryEntries} from the ` +
        `settled-results archive (${settledSlugs.length} records, ${pendingEntries} pending, page size ${visibleLimit})`
    );
  }

  // No record may be unreachable: all of them must be in the page payload, not only the first page.
  if (requireFullPayload) {
    const absent = [...new Set(settledSlugs)].filter((slug) => !historyHtml.includes(slug));
    if (absent.length > 0) errors.push(`settled records missing from the page payload (${absent.join(", ")})`);
  }

  const duplicateRendered = [...new Set(renderedSlugs.filter((slug, index) => renderedSlugs.indexOf(slug) !== index))];
  if (duplicateRendered.length > 0) {
    errors.push(`duplicate History entries rendered (${duplicateRendered.join(", ")})`);
  }

  const settledSlugSet = new Set(settledSlugs);
  const unknownRendered = renderedSlugs.filter((slug) => !settledSlugSet.has(slug));
  if (unknownRendered.length > 0) {
    errors.push(`History renders a slug absent from the settled-results archive (${unknownRendered.join(", ")})`);
  }

  return errors;
}
