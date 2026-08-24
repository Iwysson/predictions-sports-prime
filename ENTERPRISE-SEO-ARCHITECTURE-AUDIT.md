# Enterprise SEO and Architecture Audit

Audit date: 2026-08-24  
Domain: https://predictions-sports-prime.com

## Architecture map

| Responsibility | Canonical implementation | Primary consumers |
|---|---|---|
| Editorial fixtures/predictions | `src/data/predictions/**` and `src/data/matches.ts` | Match, league, Home, sitemap, audits |
| Fixture normalization | `src/lib/openfootball.ts` | Snapshot sync, live round, standings |
| Upcoming preparation | `src/lib/upcoming-fixtures.ts` | Upcoming audit, editorial queue |
| Editorial queue | `buildEditorialQueue()` and `scripts/report-editorial-queue.mjs` | Internal report only |
| Published selection | `buildPublishedMatches()` in `src/lib/editorial.ts` | Public surfaces |
| Match time | `src/lib/match-time.ts` | Cards, fixture metadata, audits |
| Lifecycle | `src/lib/fixture-status.ts` and `src/lib/match-lifecycle.ts` | History, current round, temporal buckets |
| Today/Tomorrow/Upcoming | `resolveHomeTemporalBucket()` in `src/lib/match-feed.ts` | Home and Search Intent |
| Current Round | `getCurrentRound()` in `src/lib/match-lifecycle.ts` | Live league round |
| Prediction History | `buildPredictionHistoryState()` in `src/lib/results.ts` | Home/results archive |
| Standings | `src/lib/live-standings.ts` plus validated fallback in `src/data/standings.ts` | League sidebar |
| Results | fixture status/scores plus `src/lib/prediction-results.ts` | History and result audits |
| Search Intent SEO | `src/lib/match-search-intent.ts` | Metadata, visible intro/H1, drafts, audit |
| Search terminology research | `src/lib/search-intent-research.ts` | Search Intent engine and multilingual audit |
| Market intent | `src/lib/match-market.ts` | Search Intent and mismatch audit |
| Match SEO/schema/canonical | `src/lib/seo.ts` | Match route and JSON-LD |
| League SEO | `src/lib/league-seo.ts` | League route and CollectionPage |
| Hreflang readiness | `src/lib/hreflang.ts` | No output until real localized routes exist |
| Sitemap | `src/app/sitemap.ts` | Published matches, leagues, static pages |
| Internal discovery | Home buckets, league round, `src/lib/related-predictions.ts` | Crawl paths to every match |
| Render/hydration | Static Next.js export plus signature-guarded live components | Initial HTML and optional refresh |
| Production gate | `validate:production` and individual audit scripts | Deployment validation |

## Duplicate responsibility decisions

| Responsibility | Canonical | Duplicate found | Action |
|---|---|---|---|
| Match descriptions | `buildMatchSearchIntentCopy()` | `matchSeoDescription()` rebuilt four separate patterns and discarded temporal copy | MERGE: metadata now consumes the central output |
| Pick-market classification | `src/lib/match-market.ts` | Private market classifier in `seo.ts` | REFACTOR: one factual classifier |
| Temporal state | `resolveHomeTemporalBucket()` | SEO fallback labelled unresolved past matches as upcoming | MERGE: SEO consumes Home bucket and emits no unsupported temporal term |
| Locale terminology | `src/lib/search-intent-research.ts` | Long nested conditional expressions and temporal maps in the generator | REFACTOR: one typed registry with confidence/source |
| Draft Search Intent | One `buildMatchSearchIntent()` call | Draft builder called the engine twice | DELETE duplicate invocation |
| Home derived arrays | Pure centralized filters | Immutable state plus five memo wrappers | DELETE unnecessary state/memos |
| Hreflang future branch | Registry in `hreflang.ts` | Placeholder entries with empty href | DELETE invalid placeholder; keep zero output |
| Duplicate audit categories | Pair-based similarity audit | Page-count arithmetic mixed pages and pairs | REFACTOR: exact, near, template and acceptable pairs are separate |

No safe evidence supported deleting the live standings/round requests, badge artwork effects, comments storage effect or CSS rules. They remain in place.

## SEO baseline and result

| Metric | Before | After |
|---|---:|---:|
| Indexable pages | 108 | 108 |
| Published match pages | 87 | 87 |
| Exact duplicate titles | 0 | 0 |
| Exact duplicate descriptions | 0 | 0 |
| Near duplicate titles | 0 | 0 |
| Near duplicate descriptions | 0 | 0 |
| Template-similar title pairs | 7 | 8 |
| Template-similar description pairs | 5 | 7 |
| Titles over 70 decoded characters | 37 raw baseline measurement | 0 |
| Descriptions over 160 characters | 20 raw baseline measurement | 0 |
| Orphan published matches | 0 | 0 |
| Broken internal links | 0 | 0 |
| Match pages with 2+ discovery paths | 87 | 87 |
| Sitemap URLs | 108 | 108 |

Template similarity is informational and acceptable when distinct teams/competitions disambiguate the page. No artificial prose was added to force it to zero.

## Search Intent health

- Coverage: 87/87 analyzed published matches.
- Published future states: 48 (6 today, 10 tomorrow, 32 upcoming).
- Historical state: 2 factual completed matches.
- Past unresolved state: 37. These are excluded from active Home buckets and receive no false upcoming/historical wording until fixture evidence resolves them.
- Temporal overlap: 0.
- Incorrect today/tomorrow metadata: 0.
- Market-intent mismatches: 0.
- Unsupported factual intent: 0.
- Locales represented: 14; Korean remains experimental/needs more data.

## Technical performance

| Metric | Before | After | Interpretation |
|---|---:|---:|---|
| Production build wall time | about 6.9s | about 6.7s on final run | No material regression; local timing is noisy |
| Static chunk bytes | 996,884 | 996,716 | 168-byte reduction |
| `useEffect` calls | 7 | 7 | No effect removed without evidence |
| `useMemo` calls | 8 | 3 | Five immutable Home memos removed |
| Source `fetch()` calls | 6 | 6 | Existing server/live data requests retained |
| Runtime fetches removed | 0 | 0 | None were proven unnecessary in this pass |
| Dead CSS rules removed | 0 | 0 | No reliable CSS coverage evidence was available |

## Indexation, canonical and schema

- One canonical URL remains per match.
- No route, query-string canonical, pages.dev origin or locale variant was created.
- Drafts remain absent from public routes and sitemap.
- Article/SportsEvent structured data remains factual and contains no search-query arrays, ratings or unsupported gambling schema.
- Home has one H1 and semantic H2 sections for Tomorrow, Upcoming and History; published cards use normal crawlable links.
- Match pages link to league, methodology, author, results and up to four related predictions.

## Change counts for this pass

| Change area | Count |
|---|---:|
| Search Intent architecture changes | 8 |
| Locale research profiles added/centralized | 14 |
| Real market groups supported | 8 |
| Match metadata rules changed | 4 |
| Match titles changed by deterministic length/identity rules | 86 |
| Match descriptions moved to the central engine | 87 |
| League titles changed | 2 |
| League descriptions changed | 10 |
| Home semantic/link changes | 0 (already compliant) |
| Internal-link changes | 0 (already 87/87 with 2+ paths) |
| Dead SEO helpers removed | 3 |
| Duplicate SEO responsibilities removed | 2 |
| Files created in this pass | 5 |
| Files deleted in this pass | 0 |
| `useEffect` calls removed | 0 |
| Runtime fetches removed | 0 |
| Dead CSS rules removed | 0 |

The high title-change count is caused by deterministic length control: match identity remains first, then prediction intent, then brand when it fits. One same-team fixture pair is competition-qualified to prevent an exact collision.

## Final health snapshot

| Area | Check | Result |
|---|---|---:|
| Data | Invalid kickoff | 0 |
| Data | Cross-surface mismatch | 0 |
| Data | Completed still active | 0 |
| Data | Future in History | 0 |
| Data | Draft public exposure | 0 |
| SEO | Missing titles/descriptions | 0 / 0 |
| SEO | Exact duplicate titles/descriptions | 0 / 0 |
| SEO | Canonical mismatch | 0 |
| SEO | pages.dev leak | 0 |
| Search Intent | Coverage | 87/87 |
| Search Intent | Temporal conflicts | 0 |
| Search Intent | Market mismatch | 0 |
| Search Intent | Unsupported factual intent | 0 |
| Structured data | Invalid SportsEvent | 0 |
| Structured data | Ratings/reviews/fake data added | 0 |
| Render | Stale-first regression | 0 |
| Render | Hydration mismatch regression | 0 |

## Remaining risks

1. Search Console query/country data is absent, so CTR and positions 4-15 opportunities cannot yet be ranked from first-party evidence.
2. Google Trends exact comparison exports are absent, so no relative-interest winner is claimed.
3. Thirty-seven past pages have unresolved fixture status. The system safely avoids false temporal labels, but fixture completion coverage should be improved at the data source.
4. Client-side locale selection is not multilingual indexation. Real localized routes require translated editorial content, localized canonicals and reciprocal hreflang.
5. Build-time temporal metadata changes only when a new static build is deployed; daily rebuild cadence remains operationally important.

## Next growth opportunities

| Rank | Horizon | Opportunity | SEO impact | CTR impact | Risk | Effort |
|---:|---|---|---|---|---|---|
| 1 | Quick win | Import a real Search Console query/page/country export into the prepared performance model | High | High | Low | Low |
| 2 | Quick win | Export controlled Google Trends comparisons for each priority country and attach date/range/category | Medium | Medium | Low | Low |
| 3 | Quick win | Resolve the 37 past fixtures with unknown completion state from a reliable source | High | Medium | Low | Medium |
| 4 | Quick win | Guarantee a daily static rebuild so today/tomorrow metadata transitions on schedule | High | High | Low | Low |
| 5 | Medium-term | Run deterministic title/description CTR cohorts only on high-impression pages | Medium | High | Medium | Medium |
| 6 | Medium-term | Add evidence-based demand/CTR inputs to editorial queue priority without auto-publishing | High | Medium | Medium | Medium |
| 7 | Medium-term | Add static league archive pagination before any league exceeds the documented 25-analysis threshold | Medium | Low | Medium | Medium |
| 8 | Medium-term | Expand factual fixture data coverage for H2H/form/statistics where editorial sources support it | High | Medium | Medium | High |
| 9 | Large project | Build genuinely translated, indexable localized match routes based on proven country/query demand | High | High | High | High |
| 10 | Large project | Add an authenticated Search Console ingestion workflow with pre-kickoff T-7/T-3/T-1 reporting | High | High | Medium | High |
