# EEAT Phase 2 — Implementation

## Scope

Phase 2 adds the public HOW layer for Predictions Sports Prime: methodology, editorial policy, source architecture and editorial trust links. It does not rewrite or migrate existing predictions.

## Public pages and discovery

- `/methodology/` documents the actual individual editorial assessment, possible evidence inputs, uncertainty, odds handling, operational automation and limitations.
- `/editorial-policy/` documents accuracy, verification, corrections, significant updates, timestamp integrity, historical preservation and responsible language.
- Every match page links to the methodology beside its editorial metadata and byline, with localized labels for the main supported interface languages and English fallback.
- The author page links to Methodology, Editorial Policy and Contact.
- About links the publication's who, how and purpose without duplicating the full policies.
- Footer and sitemap expose both trust pages.

## Source architecture

`EditorialSource` requires a source name and HTTPS URL, with optional description and access timestamp. Runtime validation rejects empty or placeholder identification, invalid or non-HTTPS URLs, example domains, duplicate URLs and invalid timestamps.

The policy cutoff is `2026-08-20T23:59:59-03:00`. The 52 previously published analyses are programmatically identifiable as legacy records pending source migration. Their files remain unchanged and no source was invented. A later published record must include a reliable publication timestamp, `sourceStatus: "verified"` and source coverage. This explicit editorial verification requirement complements URL validation so an arbitrary link is not treated as sufficient evidence.

The existing optional numeric `picks.odds` field is preserved. `oddsProvenance` adds the actual source, capture timestamp and optional market for new records. Post-policy published odds require this provenance; legacy odds were not backfilled.

## Files changed in Phase 2

- Public routes: `src/app/methodology/page.tsx`, `src/app/editorial-policy/page.tsx`.
- Trust discovery: match page, author page, About, Footer, sitemap and the localized `MethodologyLink` component.
- Data rules: `src/types/index.ts`, `src/lib/editorial.ts` and `scripts/audit-editorial-sources.mjs`.
- Audit and workflow: `scripts/audit-seo.mjs`, `package.json`, `EDITORIAL-GUIDE.md` and `SEO-PUBLISHING-WORKFLOW.md`.

## Audit coverage

- `audit:seo` checks both public trust pages, canonical/indexability, sitemap membership, author trust links and the methodology link on every match page.
- `audit:sources` classifies legacy and post-policy content and rejects missing future coverage, missing odds provenance, invalid protocols and placeholder domains.
- Existing baseline and fixture audits remain unchanged and mandatory.

## Validation result

- TypeScript: PASS
- Production build: PASS, 75 static pages generated
- SEO audit: PASS, 52 match pages, 0 orphans, 0 broken links
- Fixture/history audit: PASS
- Editorial source audit: PASS, 52 legacy pending migration, 0 post-policy publications
- Editorial baseline: PASS, 52/52 records and 52/52 analysis hashes preserved
- Generated HTML inspection: methodology, editorial policy, author trust links, match methodology link and sitemap entries confirmed

No commit, push or deployment was performed.

## Limits and later phases

This phase intentionally leaves the 52 legacy source migrations for Phase 4. It does not create a results archive, performance metrics or profit claims, and it does not change the existing search-intent block or typography. Those items remain available for the later phases defined by the main audit.
