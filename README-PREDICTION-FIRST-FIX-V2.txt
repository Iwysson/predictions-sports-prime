PSP Prediction-First Search Intent — Fix V2 (02/09/2026)

This patch addresses the validation failures reported after the first implementation.

Fixes:
1. Context-only metadata false positives
   - Removed the bare French token "stade" from the global forbidden-pattern audit.
   - Reason: legitimate club names such as Stade Brestois / Stade Rennais were being counted as SEO leaks.

2. Prediction-First description coverage
   - Generic English future-match description variants now always contain an explicit niche signal:
     "match analysis" and/or betting context.
   - Fixes the four reported failures:
     Everton vs Manchester United
     TSG 1899 Hoffenheim vs Borussia Dortmund
     Bayer 04 Leverkusen vs 1. FC Union Berlin
     Sparta Rotterdam vs PEC Zwolle

3. Historical/legacy hreflang reciprocity
   - English match metadata now links only to localized match pages that actually have complete localized editorial content.
   - The previous all-locales condition was too strict and could suppress English hreflangs for valid historical clusters.

4. Localized legacy hreflangs
   - Localized pages no longer advertise rollout locales such as nl/tr unless that exact localized page is complete and indexable.
   - This removes hreflang links to missing/noindex pages and restores reciprocity/x-default behavior.

Files in this patch:
- src/lib/prediction-first-search-intent.ts
- src/lib/match-search-intent.ts
- src/lib/seo.ts
- src/app/[locale]/match/[slug]/page.tsx
- plus the original Prediction-First implementation files/scripts/package.json

Validation to run:
npm run typecheck
npm run build
npm run audit:search-intent-seo
npm run audit:restricted-search-intent
npm run audit:prediction-first-search-intent
npm run audit:international-seo
npm run audit:psp-editorial-standard
