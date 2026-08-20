# EEAT Phase 1 — Identity / Who / Authorship

**Implemented:** 2026-08-20  
**Status:** PASS  
**Prerequisite:** `EEAT-PHASE-0-BASELINE.md` passed before Phase 1 began.

## Baseline used

The implementation was compared against `editorial-baseline.json`, containing 52 published predictions and 72 drafts. Its protected fields and 52 analysis SHA-256 hashes were unchanged before and after Phase 1.

## Identity implemented

The central identity module is `src/lib/editorial-identity.ts`:

- Author: **Iwysson Nascimento**
- Profile: `/author/iwysson-nascimento/`
- Public contact: `iwysson.wesklley1995@gmail.com`

No credentials, titles, employment, experience claims, awards, performance statistics, social profiles, `sameAs`, affiliation, company registration, address, telephone or legal-entity claims were added.

## Visible authorship

`src/components/ArticleByline.tsx` provides one shared byline for all match pages. It renders **Analysis by Iwysson Nascimento**, with the name linked to the canonical author path and `rel="author"`. The label follows the current client locale for English, Portuguese, Spanish, French, German and Italian, with a safe English fallback; the name is never translated.

The byline is placed with Published/Updated metadata in `src/app/match/[slug]/page.tsx`. No prediction data file was edited to add authorship.

## Author page

Created `src/app/author/iwysson-nascimento/page.tsx` with:

- factual visible identity;
- conservative description of pre-match analysis/predictions;
- explicit statement that results are not guaranteed;
- links to all 52 authored analyses;
- unique title and description;
- canonical `/author/iwysson-nascimento/`;
- `index, follow` inherited from the existing factual legal-page metadata helper.

The page is not orphaned: every published match links to it, About links to it, and it links back to all 52 analyses.

## About

`src/app/about/page.tsx` now answers:

- **What:** an independent publication for pre-match football analysis and predictions.
- **Who:** Iwysson Nascimento is responsible for the published analyses.
- **Why:** provide readers with useful fixture/market context and the considerations behind editorial selections.

It also states that the site is not a bookmaker, results are not guaranteed, and odds may change. Detailed methodology was deliberately left for Phase 2.

## Contact

`src/app/contact/page.tsx` now shows the authorized public address as a usable link:

```text
mailto:iwysson.wesklley1995@gmail.com
```

The email is not rendered on match pages, in bylines or in Article JSON-LD.

## Structured data

### Article

`src/lib/seo.ts` now adds the same identity shown in the visible byline:

```json
{
  "@type": "Person",
  "name": "Iwysson Nascimento",
  "url": "<SITE_URL>/author/iwysson-nascimento/"
}
```

The existing headline, description, URL/mainEntityOfPage, truthful dates, publisher, WebSite and league topic were preserved. No unsupported image, job title, credential, award, affiliation or `sameAs` was added.

### ProfilePage / Person

The author page contains a `ProfilePage` whose `mainEntity` is a minimal `Person` with only visible, supported properties: type, name and canonical URL. Absolute URLs continue to use the existing `absoluteUrl()`/site configuration.

### Organization / WebSite

They were audited and left unchanged because no identity inconsistency required alteration. Predictions Sports Prime remains represented as the publication/project; no legal-company facts were invented.

## Sitemap

`src/app/sitemap.ts` explicitly includes `/author/iwysson-nascimento/`, following the existing static-page architecture. No other sitemap behavior was changed.

## Automated audits added/extended

### Editorial baseline

- `scripts/editorial-baseline-lib.mjs`
- `scripts/create-editorial-baseline.mjs`
- `scripts/audit-editorial-baseline.mjs`
- `npm.cmd run baseline:create`
- `npm.cmd run audit:baseline`

### SEO identity checks

`scripts/audit-seo.mjs` now checks structurally:

- 52 generated match pages remain;
- visible author byline on every match;
- author link and `rel="author"`;
- Article author type/name/absolute URL;
- author page existence, canonical and indexability;
- visible author identity and ProfilePage/Person data;
- Contact email and usable mailto;
- absence of the email on every match page;
- author sitemap entry;
- existing draft leakage, sitemap, canonical, link and page-count guarantees.

The author bibliography also gave `casa-pia-vs-benfica` a second natural discovery path, so all 52 match pages now have at least two discovery sources.

## Files created

- `editorial-baseline.json`
- `scripts/editorial-baseline-lib.mjs`
- `scripts/create-editorial-baseline.mjs`
- `scripts/audit-editorial-baseline.mjs`
- `EEAT-PHASE-0-BASELINE.md`
- `src/lib/editorial-identity.ts`
- `src/components/ArticleByline.tsx`
- `src/app/author/iwysson-nascimento/page.tsx`
- `EEAT-PHASE-1-IMPLEMENTATION.md`

## Files modified

- `package.json`
- `src/components/LegalPage.tsx`
- `src/app/match/[slug]/page.tsx`
- `src/lib/seo.ts`
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/sitemap.ts`
- `src/app/globals.css`
- `scripts/audit-seo.mjs`

`SEO-INDEXING-QUEUE.md` is refreshed mechanically by the existing SEO audit. No prediction analysis file was changed during Phase 1.

## Post-implementation baseline comparison

```text
Editorial baseline audit: PASS (52/52 entries; all protected fields preserved).
Analysis hashes preserved: 52/52.
```

Confirmed unchanged:

- 52/52 published predictions;
- 52/52 slugs and leagues;
- 52/52 main picks;
- 51/51 existing odds (the one prediction without odds remains without odds);
- 52/52 `publishedAt`;
- 0 unauthorized `updatedAt` changes;
- the existing result status/source;
- the existing final score;
- 52/52 analysis bodies/hashes.

## Validation results

- TypeScript: PASS
- Production build: PASS (73 generated pages; author route present)
- SEO audit: PASS (71 audited static HTML pages, 52 matches, 8 league hubs)
- Fixture audit: PASS
- Editorial baseline audit: PASS
- Match byline: 52/52
- Article author: 52/52
- Match pages containing public email: 0/52
- Author canonical/indexability/ProfilePage: PASS
- Contact visible email/mailto: PASS
- Sitemap author URL: PASS

## Limitations and Phase 2+ items

Deliberately not implemented:

- detailed Methodology;
- source model or citations;
- Results/Prediction History;
- odds provenance;
- analysis rewriting or length remediation;
- MatchSearchIntent/hreflang changes;
- typography redesign;
- performance statistics, win rate, ROI or profit claims;
- Article-specific image;
- corrections policy and source workflow.

No commit, push or deployment was performed.
