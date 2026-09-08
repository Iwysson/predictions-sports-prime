# Wave 2.9 — post-rollout metrics validation

## Outcome

**INSUFFICIENT_OBSERVATION_WINDOW**. No Search Console export or connection was available. Organic metrics remain unavailable rather than being represented as zero. This is a technical baseline, and no causal conclusion is made for Waves 2.7/2.8.

## KPIs

- Indexable URLs: **471**
- Indexed URLs / rate: **unavailable / unavailable**
- Clicks / impressions / CTR / average position: **unavailable / unavailable / unavailable / unavailable**
- Top 20 / Top 10: **unavailable / unavailable**
- Technical crawl/index waste: **0**

## By locale

| Locale | URLs | Clicks | Impressions |
|---|---:|---:|---:|
| de | 49 | unavailable | unavailable |
| en | 226 | unavailable | unavailable |
| es | 49 | unavailable | unavailable |
| fr | 49 | unavailable | unavailable |
| it | 49 | unavailable | unavailable |
| pt-br | 49 | unavailable | unavailable |

## By page type

| Type | URLs | Clicks | Impressions |
|---|---:|---:|---:|
| about | 1 | unavailable | unavailable |
| author | 1 | unavailable | unavailable |
| contact | 1 | unavailable | unavailable |
| cookies | 1 | unavailable | unavailable |
| editorial-policy | 1 | unavailable | unavailable |
| home | 6 | unavailable | unavailable |
| league-hub | 108 | unavailable | unavailable |
| match | 337 | unavailable | unavailable |
| methodology | 1 | unavailable | unavailable |
| nfl | 6 | unavailable | unavailable |
| nl | 2 | unavailable | unavailable |
| privacy | 1 | unavailable | unavailable |
| responsible-gambling | 1 | unavailable | unavailable |
| results | 1 | unavailable | unavailable |
| terms | 1 | unavailable | unavailable |
| tr | 2 | unavailable | unavailable |

## By league

| League | URLs | Clicks | Impressions |
|---|---:|---:|---:|
| brasileirao-serie-a | 17 | unavailable | unavailable |
| bundesliga | 15 | unavailable | unavailable |
| champions-league | 54 | unavailable | unavailable |
| championship | 66 | unavailable | unavailable |
| copa-do-brasil | 8 | unavailable | unavailable |
| copa-libertadores | 10 | unavailable | unavailable |
| copa-sudamericana | 10 | unavailable | unavailable |
| efl-cup | 11 | unavailable | unavailable |
| eliteserien | 14 | unavailable | unavailable |
| eredivisie | 8 | unavailable | unavailable |
| la-liga | 17 | unavailable | unavailable |
| liga-portugal | 16 | unavailable | unavailable |
| ligue-1 | 15 | unavailable | unavailable |
| mls | 105 | unavailable | unavailable |
| premier-league | 16 | unavailable | unavailable |
| scottish-premiership | 14 | unavailable | unavailable |
| serie-a | 15 | unavailable | unavailable |
| super-lig | 15 | unavailable | unavailable |
| unknown | 45 | unavailable | unavailable |

## Editorial readiness

| Status | URLs | Clicks | Impressions |
|---|---:|---:|---:|
| DATA_PUBLISHABLE_WITH_GAPS | 31 | unavailable | unavailable |
| DATA_PUBLISHABLE_WITH_GAPS_PROXY | 84 | unavailable | unavailable |
| DATA_READY_PROXY | 203 | unavailable | unavailable |
| unknown | 153 | unavailable | unavailable |

## Query intent

Query-level groupings (prediction, predictions, football predictions, soccer predictions, betting tips, picks, odds, league + predictions, team-v-team prediction and other) are implemented for imported data, but unavailable without a real query export. Page-level target intent is retained in the JSON inventory.

## Opportunities

- P1: **0**
- P2: **0**
- P3: **471**
- A/B/C/D/E cannot be performance-ranked without GSC; technically healthy URLs default to D/P3 (observation required), while technical errors alone produce E/P1.

## Crawl, index and international checks

- Sitemap/HTML/canonical/noindex/internal-access inconsistencies: **0**
- Today route in sitemap: **no (not an indexable route in the current build)**
- Blocking international/editorial similarity: **0**
- Index status is **unknown** until Search Console URL Inspection or an equivalent first-party export is supplied.

## Technical changes

No production SEO correction was necessary. This Wave adds reporting infrastructure and does not modify prediction files, picks, odds or historical content.

## Wave 3 recommendation

**NO-GO on organic-performance conclusions; technical gate remains eligible.** Collect an equivalent pre/post Search Console window before choosing Wave 3 optimizations.
