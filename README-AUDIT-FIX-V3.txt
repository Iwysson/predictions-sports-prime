PSP Prediction-First Audit Fix V3

Reason:
The Prediction-First audit accepted:
- betting tip / betting tips
- odds
- match analysis

but did not accept the equally valid niche phrase:
- betting analysis

The four reported pages use "betting analysis" in their English descriptions,
so the audit was producing false negatives even though the Search Intent SEO audit
and the actual metadata policy were already correct.

Change:
scripts/audit-prediction-first-search-intent.mjs

Before:
en: /\b(?:betting tips?|odds|match analysis)\b/i,

After:
en: /\b(?:betting tips?|betting analysis|odds|match analysis)\b/i,

No production SEO, metadata, predictions, odds, lineups, hreflang or editorial
content is changed by this V3 patch.

After replacing the file run:
npm run audit:prediction-first-search-intent
npm run audit:search-intent-seo
npm run audit:restricted-search-intent
npm run audit:international-seo
npm run audit:psp-editorial-standard
