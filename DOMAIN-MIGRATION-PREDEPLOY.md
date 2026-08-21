# DOMAIN MIGRATION — PREDEPLOY

Old domain: https://predictions-sports-prime.pages.dev  
New domain: https://predictions-sports-prime.com  
Canonical host: predictions-sports-prime.com  

www: redirect planned  
pages.dev: 301 redirect planned  
Search Console: post-deploy  

Published predictions: 52  
Analysis hashes preserved: 52/52  

Active pages.dev references before: 55 (site config: 1; audit scripts: 2; generated operational indexing queue: 52)  
Active pages.dev references after: 0  

Canonical migration: PASS — all 71 indexable generated pages use the new non-www host.  
Sitemap migration: PASS — 71 unique URLs, all on the new host, with legitimate editorial `lastmod` values preserved.  
Robots migration: PASS — `User-Agent: *`, `Allow: /`, and the new sitemap URL.  
JSON-LD migration: PASS — 268 generated blocks parsed; generated absolute URLs use the new host.  
Open Graph migration: PASS — generated `og:url` values use the new host.  
Internal links migration: PASS — no active old-host references and no broken internal links.  

Sitemap URLs: 71  
Draft leakage: 0  
Orphan pages: 0  
Broken links: 0  

Phase 4 baseline: PASS (52/52) — `rayo-vallecano-vs-deportivo-alaves` is an audited legitimate automatic settlement recorded in commit `50172d0` after the Phase 4 checkpoint. The historical baseline remains unchanged, immutable editorial fields remain protected, and the audit explicitly reports the valid post-baseline settlement. See `PHASE4-RESULT-DIVERGENCE-RESOLUTION.md`.  
Phase 5 baseline: PASS (13/13); `site-trust-baseline-phase5.json` preserved byte-for-byte.  

TypeScript: PASS (`npx.cmd tsc --noEmit`)  
Build: PASS (`npm.cmd run build`)  
SEO: PASS  
Fixtures: PASS  
Results: PASS (52 archive entries)  
Sources: PASS  
Technical SEO: PASS  
Canonical audit: PASS (covered by SEO and technical SEO audits plus generated-output inspection)  
Sitemap audit: PASS (71 unique canonical URLs; no old host)  
Structured data: PASS (268 JSON-LD blocks parsed)  
git diff --check: PASS  

Historical/intentional old-domain references retained:

- `EEAT-PHASES-5-6-UNIFIED-REPORT.md`: 1 historical report reference.
- `sitemap-production.xml`: 67 historical sitemap snapshot references.
- `sitemap-googlebot-test.xml`: 67 historical test snapshot references.
- This migration document: old-domain record and redirect plan.

Baseline SHA-256 values remained unchanged:

- `editorial-baseline.json`: `6C38BFFE36992F161BA8772831FEE091462D7DA6DB3DDA81427BBBBCA5DBA6DC`
- `editorial-baseline-phase4.json`: `795ED9703B9EA619EE706E06B25F91ADE3E566068F889858037860399AF1F798`
- `site-trust-baseline-phase5.json`: `1A3A1C8445F2755E6BA7CCBD9C33480893DA83789F3037A55F84B893F96A2ED4`

Ready for domain migration deploy: YES. No commit, push, deploy, DNS, Cloudflare, www, or Search Console change was performed.

--------------------------------
