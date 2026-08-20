# EEAT Phase 3 — Trust / Results / Prediction History

## Results architecture

`/results/` is the canonical, indexable archive for every published prediction. It derives its entries from `src/data/matches.ts`, the same editorial collection used by match pages, rather than a manually curated results file. The server-generated page contains all 52 published records and the browser can refresh fixture data through the existing live pipeline.

`src/components/PredictionResultsArchive.tsx` renders responsive cards that preserve the match, competition, match date when available, publication date, original main pick, original odds, result status and final score when available. Every card links to its original match analysis. Mobile layouts use a compact grid and do not require horizontal table scrolling.

## Settlement reuse and states

The archive consumes `hydratePredictions`, which uses `resolvePredictionResult` and the existing eligibility rules in `fixture-status.ts`. No second settlement implementation was created. Automatic settlement requires a completed fixture and valid final score. Unsupported or unresolved cases remain pending.

The visible states map the internal model without reducing it to a binary result:

- `green` → WON
- `red` → LOST
- `push` → PUSH
- `half-green` → HALF WON
- `half-red` → HALF LOST
- `void` → VOID
- absent or unresolved → PENDING

Each state uses an icon and explicit text, with color only as supplemental presentation.

## Complete-history behavior and filters

ALL is the initial and selected default. The archive does not filter out losses, pending entries, pushes, half-results or voids. Optional status buttons only change the current client view; the server HTML and default view contain every published entry. No ROI, yield, units, profit or percentage performance metric is shown. Only auditable counts are displayed.

## Legacy limitation

The page states that history is derived from published prediction records and available final-score data, and that the complete archive was introduced after the earliest analyses. Unknown scores and settlements were not inferred, searched or invented. Current verified archive state is 52 entries: 51 pending and one won.

## Discovery and integration

- Home retains its compact recent-history section and adds “View all results”.
- Every match page links to the complete archive; a stored result is shown explicitly without rewriting the original analysis.
- Author, About, Methodology and Footer link naturally to Results.
- `/results/` is included in the sitemap without an artificial `lastmod`.
- The Results archive provides a durable inbound path to all 52 match pages.

## Audits

`scripts/audit-results.mjs` compares rendered rows with the current editorial state and protected baseline. It detects missing or duplicate rows, draft/unknown entries, invalid statuses, invalid match links, changed picks, odds or publication timestamps, and failure to preserve stored result/final-score data. It also requires ALL as the default and accessible status text.

`scripts/audit-seo.mjs` now verifies the Results route, canonical, indexability, complete row count, sitemap membership, links from Home/Author/About/Methodology and archive links from every match. Existing source, author, contact, email, draft and weak-discovery protections remain active.

## Baseline comparison

- Published predictions: 52/52 preserved
- Main picks: 52/52 preserved
- Existing odds: 51/51 preserved
- `publishedAt`: 52/52 preserved
- `updatedAt`: 52/52 preserved
- Analysis hashes: 52/52 preserved
- Existing result and final score: preserved

No prediction file, result, final score or editorial timestamp was changed in Phase 3.

## Limitations and Phase 4

Most legacy fixtures currently have no stored trusted final score, so they remain pending. Phase 3 does not reconstruct historical outcomes, publish financial metrics, migrate sources, remove `MatchSearchIntent`, change article typography or remediate analysis content. Source migration and existing-content remediation remain for Phase 4.

No commit, push or deployment was performed.
