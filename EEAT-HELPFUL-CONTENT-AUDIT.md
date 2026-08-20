# EEAT / Helpful Content Audit — Predictions Sports Prime

**Audit date:** 2026-08-20  
**Scope:** repository and static production output, including all 52 published predictions  
**Mode:** audit only; no recommendation was implemented  
**Named future author supplied by the owner:** Iwysson Nascimento  
**Future public contact supplied by the owner:** iwysson.wesklley1995@gmail.com

## Basis and limitations

This report evaluates repository evidence and the generated static output against Google's current guidance on [helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [scaled content abuse](https://developers.google.com/search/docs/essentials/spam-policies), [Article structured data and author markup](https://developers.google.com/search/docs/appearance/structured-data/article), [general structured-data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), and [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

The statuses below are an evidence-based editorial/technical assessment, not a Google score. E-E-A-T is not treated here as a single direct ranking factor. Correct structured data does not guarantee rich results, and a sitemap is only a discovery signal. No ranking outcome is promised.

External factual accuracy was not re-researched claim by claim because this phase expressly forbids inventing or retrofitting sources. “Unsupported” means “not traceable from the page or repository,” not necessarily “false.” Visual findings are based on source CSS and generated HTML, not lab Core Web Vitals or testing on physical devices.

## 1. Executive Summary

Predictions Sports Prime has a sound static technical foundation: 52 published match routes, eight league hubs, unique canonicals/titles/descriptions/editorial bodies, valid publication timestamps, no draft leakage, working robots/sitemap generation, BreadcrumbList markup, internal related links, responsible-gambling language, and automated editorial checks. The project has a clear football-prediction focus and generally avoids guarantees.

The principal weakness is trust, not crawlability. A visitor cannot identify the human responsible for an analysis, inspect an author profile, see a meaningful methodology, trace any statistical source, identify the origin/time of displayed odds, or review a durable full win-and-loss record. Article JSON-LD likewise has no `author`. The Contact page renders “Contact details will be available soon” in the audited build. These omissions leave **Who** as FAIL, **How** as FAIL, and Trust as FAIL despite useful analysis depth on many pages.

Content depth varies dramatically: 180–1,572 words, average 847. There are no exact duplicate paragraphs and all 52 bodies are unique, but repeated framing is conspicuous: “our preferred selection” occurs in 41 pages, “our final prediction is” in 17, and implied-probability language in 19. Eleven exact sentences recur, largely odds formulas and generic risk phrasing. The long pages frequently repeat the same evidence in many short paragraphs, which increases length without equivalent added value. The shortest Premier League pages are materially thinner than the later batches.

All 52 analyses make factual or statistical claims but none has a source field, citation URL, or visible source list. Current fixture feeds can corroborate limited fixture/status information; they do not create traceability for prior-season records, xG, transfers, injuries, tactical claims, squad-value statements, supplied match statistics, or odds. Those claims require a source migration before the corpus can be considered reliably verifiable.

There is no evidence of literal bulk duplication or incoherent auto-generated pages, so this audit does **not** conclude that the site violates Google's scaled-content policy. There are, however, warning signals requiring remediation: high-volume repeated structures, deterministic three-variant meta copy, extremely repetitive conclusions, and a templated Portuguese/Spanish “search intent” block rendered on every English match page without localized URLs or hreflang.

Recommended order: establish identity and contact; define a truthful methodology and source model; build an immutable full results ledger; then remediate the 52 articles in evidence-led batches before enhancing schema. Do not add schema claims until equivalent visible facts exist.

## 2. Current Compliance Matrix

| Area | Status | Repository evidence |
|---|---|---|
| Who | **FAIL** | No byline, author field, author page, visible author identity, `Person`, or `Article.author`. |
| How | **FAIL** | About has one broad paragraph; no methodology page, per-article sources, data provenance, selection process, review process, corrections policy, or automation disclosure. |
| Why | **PARTIAL** | Football prediction purpose and informational limitation are clear, but the homepage does not explain audience/value; multilingual search-intent boilerplate looks acquisition-led. |
| Experience | **PARTIAL** | Analyses show market reasoning and risks, but no demonstrable first-hand process, observation record, or author evidence. |
| Expertise | **PARTIAL** | Many articles show statistical fluency; the creator and source trail are absent, so readers cannot validate expertise. |
| Authoritativeness | **FAIL** | No named author entity, profile, citations, editorial policy, corrections record, or external recognition evidenced in the repository. |
| Trust | **FAIL** | Missing author/contact/sources/methodology/full results; positive legal and responsible-gambling safeguards are insufficient to offset these gaps. |
| Originality | **PARTIAL** | 52/52 unique bodies and zero exact duplicate paragraphs; repeated sentence/formula/template patterns and no source trail prevent a stronger conclusion. |
| Sources | **FAIL** | Zero URLs or source objects in all 52 published prediction files. |
| Transparency | **PARTIAL** | Publication dates, picks, odds, risks, and legal limitations are visible; authorship, odds provenance, methodology, corrections, and complete results are missing. |
| People-first content | **PARTIAL** | Clear niche and often useful reasoning; uneven depth, repetitive long-form structure, tiny body text, and SEO-language blocks reduce satisfaction. |
| Structured data | **PARTIAL** | WebSite, Organization, Article, BreadcrumbList and league CollectionPage/ItemList exist; Article lacks author and image, and Person/ProfilePage is absent. |
| Page experience | **PARTIAL** | Responsive layouts, hierarchy, reserved ad space, related content and legal footer exist; 12px analysis copy and many 9px labels are too small, with three ad positions on match pages. |
| Technical SEO | **PARTIAL** | Canonicals, robots, sitemap, SSG, no draft leakage and unique metadata pass; one match has weak discovery, no true localization/hreflang, and the site URL depends on environment configuration. |

## 3. Critical Findings

### C1 — No human authorship on any analysis

**Fact:** The match template displays title and editorial dates but no byline (`src/app/match/[slug]/page.tsx`). `articleJsonLd()` has no `author` (`src/lib/seo.ts`). About describes the site but not the person creating content (`src/app/about/page.tsx`). There is no `/author/` route or `Person` schema.

**Impact:** Visitors and search systems cannot answer “Who created this?” This is especially material for betting-related opinions containing financial-risk implications.

**Recommendation:** Later establish `/author/iwysson-nascimento/`, a visible byline on every match article, and `Article.author` as a `Person` whose `url` points to that profile. Use only verifiable biographical statements. Do not add credentials, job titles, performance claims, `sameAs`, awards, or experience duration unless evidenced and approved.

### C2 — No traceable sources across 52 factual analyses

**Fact:** All 52 published files contain statistics/factual assertions; zero contains a URL or source object. The editorial type has no `sources` property. One article says “According to the supplied statistical data” without naming the supplier (`fortuna-sittard-vs-az.ts`).

**Impact:** Readers cannot reproduce or validate standings, scorelines, xG, shots, transfers, injuries, managers, squad strength, or odds. Trust is therefore weak even when claims may be accurate.

**Recommendation:** Introduce structured source records and migrate every factual cluster to a real source. If a claim cannot be verified, remove or qualify it in the later remediation phase; never invent a citation.

### C3 — Contact identity is unavailable in the rendered site

**Fact:** Contact uses `NEXT_PUBLIC_CONTACT_EMAIL`; `.env.example` is blank and the audited build renders “Contact details will be available soon” (`src/app/contact/page.tsx`, `.env.example`).

**Impact:** Editorial corrections, privacy requests, and ownership verification lack a usable public channel.

**Recommendation:** Later configure the supplied address only on Contact, link to Contact from author/About/legal contexts, and avoid repeating the email on all match pages.

### C4 — No trustworthy complete historical performance record

**Fact:** The homepage shows at most ten completed predictions. There is no `/results/` or `/prediction-history/`. The data model can store result state/final score, but source odds lack provider and capture time; only currently resolved fixtures can be evaluated.

**Impact:** A selective ten-item view cannot demonstrate that wins and losses remain visible or permit complete performance verification.

**Recommendation:** Create an immutable, paginated `/results/` ledger containing every published pick—won, lost, push, half-win, half-loss, void, and pending—with publication timestamp and stable published odds. Never delete losses. Do not advertise performance percentages until the denominator, settlement rules, and complete dataset are trustworthy.

## 4. High Priority Findings

### H1 — “How” is too vague

About only says editorial work “may consider” history, home/away form, squad context, statistics, and competition context. Repository evidence shows actual use of seasonal/recent form, venue splits, goals for/against, H2H, squad/personnel, tactical interpretation, odds/implied probability, market construction, xG/xGA in 14 pages, and explicit downside scenarios. It does not document selection thresholds, source hierarchy, freshness, lineup/injury cutoffs, odds capture, fact-checking, review, corrections, automation, or result settlement.

Create `/methodology/` using only the demonstrated process. Include what is and is not modeled, how odds are recorded, evidence weighting, limitations of H2H/small samples, risk treatment, update/corrections rules, and result settlement. A small “Our methodology” link near the byline or prediction card is appropriate.

### H2 — Mixed-language templated blocks appear search-first

`MatchSearchIntent` deterministically injects one of only three Portuguese and Spanish text pairs into every English match page. The document remains `lang="en"`; there are no localized routes or hreflang annotations. These blocks repeat the query idea “analysis / prediction / odds” without substantive new information.

This does not prove a spam violation, but it is the clearest scaled-content risk. Remove it later or replace it with genuinely useful content in the page's actual language. Do not create locale variants unless the full main content, metadata, navigation, canonical/hreflang and editorial maintenance are localized.

### H3 — Uneven depth and overlong repetition

The corpus average is 847 words and 24.8 paragraphs, but ranges from 180/6 to 1,572/46. The ten shortest Premier League articles are 180–394 words, whereas several later pages exceed 1,400 words and restate the same facts in many one-sentence paragraphs. Google has no preferred word count; completeness and added value matter more than length.

Prioritize thin pages for substantiation and long pages for consolidation. Preserve unique reasoning, risks, and market logic; remove repetition rather than targeting a uniform word count.

### H4 — No corrections/update policy

All 52 items have legitimate recovered `publishedAt`; none has `updatedAt`. The timestamp scripts correctly require an explicit significant update, but visitors do not know what qualifies as an update or how factual corrections are handled.

Publish a concise corrections/update policy linked from methodology/About. Preserve `publishedAt`; set `updatedAt` only for significant editorial changes, never merely for freshness.

### H5 — Odds provenance is absent

Odds are presented as published odds but have no bookmaker/exchange/source, market timestamp, jurisdiction, or “available at” provenance. Odds claims are time-sensitive.

Extend the model with `odds.source`, `odds.capturedAt`, and optional market/line metadata. If naming a provider is not appropriate, state the truthful aggregation/capture method. Do not backfill unknown provenance.

## 5. Medium Priority Findings

### M1 — Article structured data is incomplete

Article includes headline, description, URL/mainEntityOfPage, truthful dates when available, publisher, WebSite relationship and league topic. It lacks author and image. Add these only after visible author/profile and a representative image exist. `publisher` is present but the Organization has only name, URL, and logo; do not fabricate contact or identity fields.

### M2 — Page copy is unusually small

The final CSS sets analysis body to 12px and numerous metadata/labels/results to 9px (`src/app/globals.css`). This can impair mobile readability and perceived quality. Recommend testing 16px-equivalent body copy, accessible zoom, contrast, tap targets, and actual devices. This is a recommendation, not a measured Core Web Vitals failure.

### M3 — Advertising density risk

Match pages reserve top, in-content, and bottom ad slots plus a sticky desktop prediction sidebar. Reserved dimensions are positive for layout stability, but three placements around long editorial content can become intrusive when AdSense fills them. Validate real production rendering, mobile sequencing, CLS and accidental-click spacing.

### M4 — One weakly discovered match route

The automated SEO audit reports `/match/casa-pia-vs-benfica/` has fewer than two discovery paths; 51/52 have at least two. There are no fully orphaned published routes and no broken internal links. Ensure the future results archive and/or related-link rules provide a second durable path.

### M5 — Homepage purpose is implicit rather than explanatory

The homepage moves directly into Today/Upcoming/History and league cards. Brand metadata/footer says “independent” and “manually written,” but there is no concise visible statement of intended audience, editorial purpose, limitations, author, methodology or source approach.

### M6 — Responsible-gambling support is generic

The page correctly discourages chasing losses, essential-money betting and income expectations, but provides no named support resources by geography. A later improvement may link to authoritative help organizations while avoiding false universal coverage.

### M7 — Privacy/Cookies text may not match production configuration indefinitely

The pages say ad units remain disabled until configured, while global AdSense account/script hooks exist. Verify final deployed behavior and consent mechanism against the visible policy whenever advertising is activated. This audit does not make a legal-compliance determination.

## 6. Low Priority Findings

### L1 — Generic OG image

All match pages reuse `og-default.png`. This is valid but offers little article-specific identity. Only add unique images if genuinely produced and maintained; schema must match visible/representative assets.

### L2 — Root keywords are inherited globally

The root supplies a fixed keywords meta list. This is not a substitute for helpful content and offers no material trust benefit. It is not keyword stuffing in visible copy by itself.

### L3 — Metadata descriptions use three deterministic templates

Descriptions are unique because team/league names vary, but the prose comes from only three variants. Improve later only where descriptions fail to accurately summarize unique page value; do not manufacture uniqueness for its own sake.

### L4 — Legal-page social metadata inherits generic Twitter fields

Legal pages set Open Graph but inherit site-wide Twitter title/description/image. This is minor and does not affect their canonical/indexability.

### L5 — Local personal comments are clearly private but low-value to trust

The comments feature is a browser-local note tool, not public discussion. The UI discloses this, which is good; it should not be presented later as community evidence.

## 7. Audit of All 52 Published Predictions

### Corpus metrics

| Metric | Result |
|---|---:|
| Published predictions | 52 |
| Draft prediction files | 72 |
| Unique editorial bodies | 52 |
| Exact duplicate paragraphs | 0 |
| Exact recurring sentences | 11 distinct sentences |
| Total words / average | 44,027 / 847 |
| Shortest / longest | 180 / 1,572 words |
| Average paragraphs | 24.8 |
| PublishedAt present | 52/52 |
| UpdatedAt present | 0/52 |
| Source URLs/objects | 0/52 |
| Explicit author/byline | 0/52 |

“Evidence” below describes evidence types used in the prose; it does **not** mean cited evidence. `Unsupported` means factual/statistical claims lack a traceable page-level source. Priority is relative remediation priority.

| # | Prediction file | Words | ¶ | Evidence used | Audit outcome | Priority |
|---:|---|---:|---:|---|---|---|
| 1 | `premier-league/round-01/arsenal-vs-coventry.ts` | 180 | 6 | form, venue, goals, squad/tactics | Thinnest page; claims unsupported; little risk discussion | **HIGH** |
| 2 | `premier-league/round-01/hull-vs-man-united.ts` | 274 | 6 | form, venue, squad | Thin/general; unsupported squad/context claims | **HIGH** |
| 3 | `premier-league/round-01/brentford-vs-tottenham.ts` | 304 | 7 | form, venue, goals, H2H, squad, odds/risk | Some unique matchup logic; unsupported | **HIGH** |
| 4 | `la-liga/round-01/deportivo-la-coruna-vs-elche.ts` | 317 | 9 | form, venue, goals, tactics, live odds | Thin and includes live-entry advice; no source/capture method | **HIGH** |
| 5 | `premier-league/round-01/everton-vs-crystal-palace.ts` | 336 | 7 | form, venue, goals, H2H, squad | Thin; unsupported personnel and results | **HIGH** |
| 6 | `premier-league/round-01/ipswich-vs-sunderland.ts` | 337 | 7 | form, venue, goals, squad | Thin; unsupported historical/context claims | **HIGH** |
| 7 | `premier-league/round-01/man-city-vs-bournemouth.ts` | 341 | 7 | form, venue, tactics, odds/risk | Concise but unsupported; validate current context | **HIGH** |
| 8 | `premier-league/round-01/brighton-vs-aston-villa.ts` | 347 | 7 | form, venue, goals, H2H, squad, odds | Concise matchup case; all facts uncited | **HIGH** |
| 9 | `premier-league/round-01/nottingham-forest-vs-leeds.ts` | 365 | 7 | form, venue, goals, H2H, tactics, odds | Relevant H2H logic; unsupported | **HIGH** |
| 10 | `premier-league/round-01/newcastle-vs-liverpool.ts` | 376 | 8 | form, venue, H2H, squad, tactics/risk | Time-sensitive manager/player claims; high verification risk | **CRITICAL** |
| 11 | `premier-league/round-01/fulham-vs-chelsea.ts` | 394 | 8 | form, venue, squad, tactics, odds/risk | Time-sensitive departures/manager claims; uncited | **CRITICAL** |
| 12 | `liga-portugal/round-01/casa-pia-vs-benfica.ts` | 487 | 11 | form, venue, H2H, squad, tactics, odds/risk | Unsupported squad-value claim; only one discovery path | **HIGH** |
| 13 | `la-liga/round-02/rayo-vallecano-vs-deportivo-alaves.ts` | 519 | 10 | form, venue, goals, H2H, squad/tactics, odds/risk | Balanced but unsupported; stadium/context verification needed | **HIGH** |
| 14 | `la-liga/round-01/atletico-madrid-vs-malaga.ts` | 537 | 11 | form, venue, goals, xG, tactics, live odds/risk | xG/live-price and squad claims uncited; result now recorded | **HIGH** |
| 15 | `serie-a/round-01/frosinone-vs-juventus.ts` | 576 | 12 | form, venue, goals, H2H, squad, odds/risk | Promotion/context and statistics uncited | **HIGH** |
| 16 | `la-liga/round-02/athletic-club-vs-sevilla.ts` | 624 | 12 | form, venue, goals, H2H, xG, tactics, odds/risk | Substantive but xG/statistics untraceable | **HIGH** |
| 17 | `serie-a/round-01/genoa-vs-napoli.ts` | 628 | 12 | form, venue, H2H, squad/tactics, odds/risk | Limited numeric support versus conclusion; uncited | **HIGH** |
| 18 | `la-liga/round-02/real-betis-vs-real-sociedad.ts` | 675 | 13 | form, venue, H2H, xG, odds/risk | Good caveats; xG/records untraceable | **HIGH** |
| 19 | `la-liga/round-02/valencia-vs-rc-celta-de-vigo.ts` | 699 | 13 | form, venue, H2H, odds | Useful venue comparison; statistics uncited | **HIGH** |
| 20 | `ligue-1/round-01/toulouse-vs-lyon.ts` | 734 | 18 | form, venue, goals, H2H, odds/risk | Balanced uncertainty; recurring odds/risk wording | **MEDIUM** |
| 21 | `serie-a/round-01/parma-vs-cagliari.ts` | 740 | 14 | form, venue, goals, H2H, xG, tactics, odds/risk | Statistical depth; xGA unsupported | **HIGH** |
| 22 | `serie-a/round-01/roma-vs-fiorentina.ts` | 744 | 15 | form, venue, goals, H2H, tactics, odds/risk | Relevant reasoning but recurring odds formula; uncited | **MEDIUM** |
| 23 | `serie-a/round-01/bologna-vs-lazio.ts` | 750 | 17 | form, venue, goals, H2H, xG, tactics, odds/risk | Good market construction; xG/statistics unsupported | **HIGH** |
| 24 | `serie-a/round-01/inter-vs-monza.ts` | 774 | 15 | form, venue, goals, H2H, xG, tactics, odds/risk | Detailed champion/score claims; uncited | **HIGH** |
| 25 | `ligue-1/round-01/olympique-de-marseille-vs-strasbourg.ts` | 786 | 16 | form, venue, H2H, squad, xG/tactics, odds/risk | Multiple evidence types; no provenance | **HIGH** |
| 26 | `serie-a/round-01/venezia-vs-lecce.ts` | 800 | 16 | form, venue, goals, H2H, squad/tactics, odds/risk | Strong promotion caveat; many exact figures uncited | **HIGH** |
| 27 | `la-liga/round-02/rcd-espanyol-de-barcelona-vs-real-madrid.ts` | 807 | 16 | form, venue, goals, H2H, squad/tactics, odds/risk | Useful scenario analysis; unsupported | **MEDIUM** |
| 28 | `ligue-1/round-01/nice-vs-lorient.ts` | 807 | 19 | form, venue, goals, H2H, odds/risk | Explicit counterexample/risk; recurring formulas; uncited | **MEDIUM** |
| 29 | `serie-a/round-01/udinese-vs-como.ts` | 845 | 16 | form, venue, goals, H2H, squad, xG/tactics, odds/risk | Substantive but all evidence untraceable | **HIGH** |
| 30 | `ligue-1/round-01/lens-vs-auxerre.ts` | 857 | 19 | form, venue, squad/tactics, odds/risk | Good whole-season caveat; unsupported | **MEDIUM** |
| 31 | `serie-a/round-01/torino-vs-milan.ts` | 896 | 18 | form, venue, goals, H2H, xG/tactics, odds/risk | Explicit no-risk-free caveat; xG unsupported | **HIGH** |
| 32 | `serie-a/round-01/atalanta-vs-sassuolo.ts` | 899 | 18 | form, venue, goals, H2H, xG/tactics, odds/risk | Current cup/form claim and xG need sources | **HIGH** |
| 33 | `ligue-1/round-01/le-mans-vs-stade-brestois.ts` | 901 | 20 | form, venue, goals, xG/tactics, odds/risk | Promotion/intensity statements partly subjective; stats uncited | **HIGH** |
| 34 | `liga-portugal/round-03/maritimo-vs-academico-de-viseu.ts` | 989 | 32 | form, venue, goals, H2H, odds/risk | Repetition and duplicated odds/disclaimer formulas | **MEDIUM** |
| 35 | `liga-portugal/round-03/vitoria-guimaraes-vs-nacional.ts` | 1,082 | 48 | form, venue, goals, H2H, squad/tactics, odds/risk | Many one-sentence paragraphs; consolidate and source | **MEDIUM** |
| 36 | `liga-portugal/round-03/estoril-praia-vs-rio-ave.ts` | 1,097 | 36 | form, venue, goals, H2H, tactics, odds/risk | Detailed but repetitive; duplicated formula/disclaimer | **MEDIUM** |
| 37 | `liga-portugal/round-03/santa-clara-vs-famalicao.ts` | 1,104 | 47 | form, venue, goals, H2H, tactics, odds/risk | Thorough counterevidence; over-fragmented and uncited | **MEDIUM** |
| 38 | `eredivisie/round-03/sparta-rotterdam-vs-utrecht.ts` | 1,122 | 37 | form, venue, goals, H2H, tactics, odds/risk | Statistical depth; exact recurring sentences | **MEDIUM** |
| 39 | `ligue-1/round-01/angers-vs-lille.ts` | 1,193 | 33 | form, venue, goals, H2H, squad/tactics, odds/risk | Strong risk treatment; repetitive and unsupported | **MEDIUM** |
| 40 | `liga-portugal/round-03/gil-vicente-vs-casa-pia.ts` | 1,200 | 61 | form, venue, goals, H2H, tactics, odds/risk | Excessive fragmentation/repetition; uncited | **HIGH** |
| 41 | `liga-portugal/round-03/estrela-da-amadora-vs-braga.ts` | 1,229 | 61 | form, venue, goals, H2H, squad, xG/tactics, odds/risk | 61 paragraphs; xG and claims untraceable | **HIGH** |
| 42 | `liga-portugal/round-03/fc-porto-vs-arouca.ts` | 1,231 | 59 | form, venue, goals, H2H, tactics, odds/risk | Repeats same figures/conclusion extensively | **HIGH** |
| 43 | `liga-portugal/round-03/sporting-cp-vs-fc-alverca.ts` | 1,248 | 54 | form, venue, goals, H2H, squad/tactics, odds/risk | Strong opponent-specific logic; overlong/uncited | **MEDIUM** |
| 44 | `eredivisie/round-03/go-ahead-eagles-vs-ado-den-haag.ts` | 1,257 | 42 | form, venue, H2H, squad/tactics, odds/risk | Strong promotion counterargument; recurring formula | **MEDIUM** |
| 45 | `eredivisie/round-03/psv-vs-groningen.ts` | 1,304 | 52 | form, venue, goals, H2H, squad, xG/tactics, odds/risk | Deep but repetitive; current/squad/xG verification risk | **HIGH** |
| 46 | `eredivisie/round-03/heerenveen-vs-pec-zwolle.ts` | 1,349 | 44 | form, venue, goals, H2H, tactics, odds/risk | Deep statistical case; recurring formula; uncited | **MEDIUM** |
| 47 | `eredivisie/round-03/cambuur-vs-feyenoord.ts` | 1,409 | 52 | form, venue, goals, squad/tactics, odds/risk | No H2H detected; extensive repetition and uncited claims | **HIGH** |
| 48 | `ligue-1/round-01/le-havre-vs-monaco.ts` | 1,423 | 40 | form, venue, goals, H2H, squad, xG/tactics, odds/risk | Strong counterexample; overlong and unsupported | **HIGH** |
| 49 | `ligue-1/round-01/troyes-vs-paris-fc.ts` | 1,448 | 35 | form, venue, goals, H2H, squad/tactics, odds/risk | High depth; recurring odds formula; source migration needed | **MEDIUM** |
| 50 | `liga-portugal/round-03/moreirense-vs-benfica.ts` | 1,543 | 59 | form, venue, goals, H2H, tactics, odds/risk | Very repetitive; “full profit” wording needs responsible context | **HIGH** |
| 51 | `ligue-1/round-01/paris-saint-germain-vs-rennes.ts` | 1,566 | 44 | form, venue, goals, H2H, tactics, odds/risk | Deep matchup case but repeats dominant-score evidence | **HIGH** |
| 52 | `eredivisie/round-03/fortuna-sittard-vs-az.ts` | 1,572 | 46 | form, venue, goals, H2H, squad/tactics, odds/risk | Longest; unnamed “supplied statistical data”; highest source risk | **CRITICAL** |

## 8. Unsupported / Unverifiable Claims Report

### A. Claims that already have a visible, traceable source

**None found in the 52 published analyses.** No source name is paired with a URL/citation. “According to the supplied statistical data” is not traceable.

### B. Claims whose source can be inferred from existing project data

- Fixture teams, dates, scheduled/completed status and final scores may be hydrated from configured OpenFootball/ESPN feeds (`src/data/leagues.ts`, `src/lib/openfootball.ts`).
- Current computed standings can be derived from completed feed fixtures (`src/lib/openfootball.ts`, `src/lib/live-standings.ts`).
- Publication timestamps can be traced to explicit editorial fields and the recovery documentation/scripts.
- Prediction, odds value, result status and final score can be traced to editorial data/model.

Inference is not a substitute for a visible citation. The repository does not establish that these feeds supplied the article's prior-season statistics or odds.

### C. Claims with no traceable source

This category appears in **all 52 pages** and includes:

- prior-season table positions, points, wins/draws/losses;
- home/away records and percentages;
- goals scored/conceded and over/BTTS frequencies;
- historical H2H scorelines/aggregates;
- xG/xGA and shot/corner figures;
- promotion/championship records;
- player transfers, manager changes, injuries and squad availability;
- “squad quality/value/depth” comparisons;
- tactical styles, pressing, defensive blocks and match-control assertions;
- unnamed current/preseason/cup results;
- published odds source and capture time.

### D. Subjective/editorial statements not normally requiring a factual citation

- why one market is preferred over another;
- scenario/risk explanations such as what scorelines win or lose a market;
- cautious weighting of H2H, preseason or small samples;
- the final editorial pick as opinion;
- explicit uncertainty and responsible-gambling warnings.

These statements may rely on underlying facts; those underlying facts still require traceability.

### E. Potentially risky or unverifiable claims

Highest-risk classes are current personnel/manager/injury/transfer claims, xG/xGA, squad valuations, exact “supplied data” event statistics, and unnamed odds. Specific priority examples include `newcastle-vs-liverpool.ts`, `fulham-vs-chelsea.ts`, `atletico-madrid-vs-malaga.ts`, `casa-pia-vs-benfica.ts`, `psv-vs-groningen.ts`, and `fortuna-sittard-vs-az.ts`.

No “guaranteed win,” “cannot lose,” “sure bet,” or guaranteed-profit promise was found. Several pages explicitly reject guarantees. `moreirense-vs-benfica.ts` uses mechanical settlement wording “full profit”; it is not a profit guarantee, but could be phrased more carefully in later remediation. `torino-vs-milan.ts` explicitly says the selection is not risk-free.

## 9. Duplicate / Templated Content Report

### Exact duplication

- Exact duplicate full bodies: **0**.
- Exact duplicate paragraphs: **0**.
- Distinct exact sentences occurring more than once: **11**.

Most frequent exact sentences:

- “At odds of 1.72, the market implies a probability of approximately 58.1%.” — 5 pages.
- Equivalent 1.70 / 58.8% formula — 4 pages.
- Equivalent 1.78 / 56.2% formula — 3 pages.
- “There is still meaningful risk.” — 3 pages.
- “There is still risk.” — 3 pages.
- “A 1-1 draw is enough.” — 3 pages.
- Equivalent 1.60 / 62.5% formula — 3 pages.
- “The live entry should not be based on the clock alone.” — 2 pages.
- “These percentages should not be treated as independent probabilities or multiplied together.” — 2 pages.

### Repeated editorial framing

| Phrase family | Pages |
|---|---:|
| “our preferred selection” | 41 |
| “the statistical…” | 23 |
| “implied probability” | 19 |
| “should not be treated” | 19 |
| “our final prediction is” | 17 |
| “considering…” | 14 |
| “for that reason” | 12 |
| “the principal risk” | 11 |

### Assessment

The corpus is not literally duplicated, but it exhibits a house template: opening pick/odds, season statistics, venue split, H2H, market comparison, implied-probability calculation, risk paragraph, and near-duplicate final recap. A consistent editorial framework is not inherently bad; the risk arises when formulaic repetition replaces match-specific insight or expands pages without new value.

The later Liga Portugal/Eredivisie/Ligue 1 batches are often over-fragmented (35–61 paragraphs). The early Premier League batch is comparatively thin. Remediation should be page-specific, not a global synonym replacement. Automated synonymization would worsen the scaled-content risk.

The multilingual `MatchSearchIntent` block is the most clearly templated site-wide element: three variants × two languages across 52 English pages, with minimal user value.

## 10. Current Structured-Data Report

| Schema | Current state | Accuracy/visibility assessment |
|---|---|---|
| `WebSite` | Global: name, URL, description, `inLanguage: en` | Matches site identity; language conflicts with mixed PT/ES boilerplate and client UI switching. |
| `Organization` | Global: name, URL, logo | Minimal but not fabricated. No owner/contact identity. |
| `Article` | Match pages: headline, description, URL, mainEntityOfPage, dates when present, publisher, isPartOf, league `about` | Missing author and image. Headline/description correspond to visible subject. Dates are backed by editorial data. |
| `BreadcrumbList` | Match and league pages | Corresponds to visible breadcrumbs/routes. |
| `CollectionPage` / `ItemList` | League pages | Appropriate for visible league collections; audit found no draft leakage. |
| `Person` | Absent | Appropriate to add only after visible author profile exists. |
| `ProfilePage` | Absent | Appropriate for the proposed author page if its visible main entity is Iwysson Nascimento. |

### Article property audit

- `headline`: **PASS**, descriptive and non-sensational.
- `description`: **PASS/PARTIAL**, accurate but drawn from three templates.
- `author`: **FAIL**, absent.
- `datePublished`: **PASS**, present for 52/52 and backed by editorial history.
- `dateModified`: **PASS as absent**, no significant updates are recorded; it should not be fabricated.
- `mainEntityOfPage`: **PASS**.
- `publisher`: **PASS/PARTIAL**, real site entity but minimally described.
- `image`: **FAIL/PARTIAL**, Article has no image property although OG uses a generic image.

Future `Article.author` should use `{"@type":"Person","name":"Iwysson Nascimento","url":".../author/iwysson-nascimento/"}` only when that same identity/byline/profile is visible. Structured data must not become the only place the author exists.

## 11. Current Trust Architecture

Existing positive elements:

- About page states independent, manual editorial selection and no AI-generated picks.
- Match pages show published dates and optional updated dates.
- Picks and odds are visible alongside analysis.
- Analyses frequently state risk and counterevidence.
- Terms explicitly reject guaranteed outcomes/profit.
- Responsible Gambling discourages essential-money betting, chasing losses, illegal/underage gambling, and treating betting as income.
- Privacy and Cookies explain localStorage, infrastructure, ads and consent at a high level.
- Contact route exists, even though its usable detail is absent.
- Footer links all existing trust/legal pages.
- Homepage has a recent history component including result state.
- Editorial validation blocks placeholders, duplicate bodies, missing picks and invalid timestamps.
- Timestamp tooling preserves initial publication separately from updates.
- Automated result settlement supports wins, losses, pushes, half-results and void.

## 12. Missing Trust Architecture

- Named human byline and author profile.
- Visible owner/editor identity on About.
- Working public contact detail.
- Methodology page and concise per-article methodology link.
- Per-article source list and claim/source mapping.
- Odds origin and captured-at time.
- Complete, immutable results archive showing losses equally.
- Editorial standards, fact-checking and source hierarchy.
- Corrections/update policy and visible correction notes when applicable.
- Truthful automation disclosure covering fixture/result hydration versus manual editorial content.
- Named responsible-gambling resources where appropriate.
- Author-level structured data backed by visible content.
- Clear homepage summary of audience, purpose and non-promises.

## 13. Proposed Site Architecture

```text
/
├── about/
├── author/
│   └── iwysson-nascimento/
├── methodology/
├── results/                 # preferred concise name
├── editorial-policy/        # may include sourcing + corrections
├── contact/
├── responsible-gambling/
├── privacy/
├── cookies/
├── terms/
├── league/[slug]/
└── match/[slug]/
```

### `/author/iwysson-nascimento/`

Visible name, truthful role in producing analyses, topics covered, explanation/link to methodology, corrections contact route, and list of recent articles. Do not invent credentials or experience. Use `ProfilePage` with `mainEntity: Person` only after visible content exists.

### `/methodology/`

Explain only demonstrated inputs: form/season context, venue splits, goals for/against, H2H with small-sample caution, squad/competition context when verified, tactical interpretation, odds/implied probability, market selection, downside scenarios, and result settlement. Explicitly distinguish manual analysis/picks from automated fixture/status/result hydration.

### `/results/`

Preferred over `/prediction-history/` for brevity. Include every published prediction and persistent status. Filters may support league/date/result but must not default to wins only. Explain settlement rules. Avoid ROI, yield, hit-rate or profit claims until odds provenance, complete history and methodology are reliable.

### Source display without UX damage

Use a compact “Sources and data checked” section after the analysis, with source name, direct URL, what it supports, and access/capture date where time-sensitive. Optionally use numbered inline references for dense statistical paragraphs. Do not hide all citations behind inaccessible UI, and do not cite a home page when a direct match/table page exists.

## 14. Exact Files That Would Need Modification

No files below were modified in this audit. Likely future changes:

- `src/types/index.ts` — author/source/odds provenance/correction fields.
- `src/lib/editorial.ts` — map and validate new fields.
- `src/data/predictions/**/*.ts` — source migration and later evidence-led content remediation for all 52; preserve picks/odds/timestamps unless independently authorized.
- `src/app/match/[slug]/page.tsx` — visible byline, methodology/source/correction/results links.
- `src/lib/seo.ts` — Article author/image and Person references once visible facts exist.
- `src/app/about/page.tsx` — owner/author/editorial identity and policy links.
- `src/app/contact/page.tsx` and production environment — supplied public email on Contact only.
- `src/app/page.tsx` / `src/components/HomePredictionFeed.tsx` — purpose/trust summary and archive link.
- `src/components/Header.tsx` / `src/components/Footer.tsx` — trust-navigation links.
- `src/components/MatchSearchIntent.tsx` — remove or redesign multilingual boilerplate.
- `src/app/layout.tsx` — only if global entity/schema/navigation/language behavior changes.
- `src/app/sitemap.ts` — include new canonical trust/archive/author pages.
- `src/lib/legal-pages.ts` — metadata support if new policy pages reuse it.
- `src/app/globals.css` — readable typography and new source/byline/results components.
- `src/i18n/dictionaries.ts` / `src/i18n/I18nProvider.tsx` — only for a truthful localization strategy.
- `src/lib/prediction-results.ts`, `src/lib/live-predictions.ts`, `src/lib/fixture-status.ts` — settlement/archive reliability extensions.
- `scripts/audit-seo.mjs` and `scripts/audit-fixture-pipeline.mjs` — new automated trust/source/result checks.
- `EDITORIAL-GUIDE.md`, `PREDICTIONS-STRUCTURE.md`, `SEO-PUBLISHING-WORKFLOW.md` — documented author/source/corrections workflow.

## 15. Exact New Files/Pages That Would Need Creation

Suggested paths, not implemented:

- `src/app/author/iwysson-nascimento/page.tsx`
- `src/app/methodology/page.tsx`
- `src/app/results/page.tsx`
- `src/app/editorial-policy/page.tsx` (or a clearly separated section in methodology/About)
- `src/data/authors.ts` (if more than one author or central reuse is expected)
- `src/components/ArticleByline.tsx`
- `src/components/ArticleSources.tsx`
- `src/components/PredictionResultsTable.tsx`
- `src/lib/authors.ts` / `src/lib/results.ts` as needed
- `scripts/audit-content-quality.mjs`
- `scripts/audit-editorial-trust.mjs`

Avoid creating empty/thin policy pages merely to add keywords. Combine policies when that gives users a clearer, substantive destination.

## 16. Proposed Data-Model Changes

Illustrative only:

```ts
type EditorialSource = {
  name: string;
  url: string;
  description?: string;    // what claim/data it supports
  accessedAt?: string;     // useful for mutable statistics
};

type EditorialAuthorRef = {
  id: "iwysson-nascimento";
};

type PublishedOdds = {
  value: number;
  source?: string;         // omit when genuinely unknown
  capturedAt?: string;
  market?: string;
};

type EditorialCorrection = {
  correctedAt: string;
  summary: string;
};

type EditorialPrediction = {
  // existing fields...
  author: EditorialAuthorRef;
  sources: EditorialSource[];
  corrections?: EditorialCorrection[];
  methodologyVersion?: string;
};
```

Migration rules:

1. Never populate unknown values with guesses.
2. Allow a temporary `sources: []` only for drafts or explicitly flagged legacy items; published legacy gaps must remain auditable.
3. Keep `publishedAt` immutable.
4. Set `updatedAt` only after a significant visible editorial change.
5. Separate odds provenance from result provenance.
6. Store results for every pick, not only successful picks.
7. Keep automatic/manual result source visible internally and explain settlement publicly.

## 17. Migration Risks

- Backfilling sources may reveal claims that cannot be reproduced; those require removal/qualification, not invented citations.
- Adding an author globally without reviewing actual authorship could misattribute legacy articles. Confirm Iwysson Nascimento's authorship/responsibility for all 52 before migration.
- Bulk text edits can accidentally alter picks, odds or timestamps.
- Adding source objects to 52 files can introduce malformed URLs or duplicate/low-quality citations.
- Results reconstructed after publication may be incomplete; label legacy limitations.
- Provider failures or team-name mismatches can settle incorrectly; preserve manual review/audit logs.
- New static routes require sitemap/internal-link updates and static export compatibility.
- Localization changes can create duplicate or incomplete language pages.

## 18. SEO Risks

- Missing authorship/source evidence weakens trust and people-first signals.
- Repetitive multilingual search-intent blocks could resemble search-engine-first scaled copy.
- Thin early pages may not provide substantial value versus competing previews.
- Overlong repetitive pages can obscure the useful conclusion and look production-scaled.
- Unverified factual errors would be more damaging than missing schema.
- Adding false Person/author/source/date properties would violate structured-data accuracy principles.
- Changing dates solely for freshness would conflict with Google guidance and existing timestamp integrity.
- Publishing locale pages without full translation/canonical/hreflang discipline could create duplication.
- The current sitemap/technical Search Console issue must not be attributed to content quality without evidence.

## 19. UX Risks

- 12px article body and 9px secondary text may be uncomfortable on mobile.
- 35–61 short paragraphs create scrolling fatigue and fragmented reasoning.
- Three possible ad placements can interrupt the analysis when filled.
- Sticky prediction/sidebar and sticky header should be tested for viewport obstruction.
- Sources can clutter pages if dumped as raw links; use a concise accessible component.
- Too many new policy links can overwhelm navigation; prioritize Author, Methodology and Results, retain legal pages in footer.
- A results table needs responsive cards/columns and accessible status text, not color alone.
- Private local comments may distract from higher-priority trust content.

## 20. Recommended Implementation Phases

### Phase 0 — Evidence freeze and migration inventory

- Export a manifest of all 52 slugs, current hashes, picks, odds, `publishedAt`, `updatedAt`, and results.
- Confirm whether Iwysson Nascimento is responsible for all legacy articles.
- Inventory real sources used during creation; mark irrecoverable claims.
- Add tests preventing accidental pick/odds/timestamp changes during migration.

### Phase 1 — Identity / Who

- Create truthful author data/profile and visible match bylines.
- Add owner/author context to About.
- Configure supplied email on Contact only.
- Link byline → author and author → methodology/contact.

### Phase 2 — How / source architecture

- Create substantive methodology/editorial-policy content.
- Define source hierarchy, odds capture, fact-checking, update/corrections, and automation disclosure.
- Add source/author/odds provenance data types and validators.
- Add a low-clutter methodology/source block to match pages.

### Phase 3 — Trust / results

- Build immutable `/results/` with all statuses and settlement explanation.
- Retain wins and losses equally.
- Add durable archive links from homepage/footer/match pages.
- Resolve the Casa Pia discovery-path gap.

### Phase 4 — Existing content remediation

- Batch 1: critical current/personnel/unnamed-data pages.
- Batch 2: shortest pages; add verified unique evidence where useful.
- Batch 3: longest pages; consolidate repetition while preserving analysis.
- Batch 4: remaining pages; attach sources and verify every factual cluster.
- Record significant changes in `updatedAt`; never alter `publishedAt`.

### Phase 5 — Structured data

- Add visible-backed Person/ProfilePage and `Article.author.url`.
- Add Article image only if representative assets exist.
- Keep publisher/Organization factual and minimal.
- Validate schema against rendered content.

### Phase 6 — Site-wide UX and trust navigation

- Improve readable typography and result-table accessibility.
- Add concise purpose/author/methodology/results entry points.
- Remove/rework `MatchSearchIntent` multilingual boilerplate.
- Validate real ad rendering and consent-policy consistency.

### Phase 7 — Automated audit protections

- Require author and sources for new published predictions.
- Validate direct HTTPS source URLs and odds capture timestamps.
- Detect repeated sentences/phrases, extreme length and unsupported numeric claims.
- Require all published pages in complete results archive.
- Test byline/schema/profile agreement and source visibility.
- Preserve current canonical/draft/timestamp/result checks.

### Phase 8 — Final validation

- Human factual/source review of all 52 pages.
- Build/typecheck/audit.
- Rich Results Test and schema validation.
- Crawl static output; confirm canonicals, sitemap, indexability and discovery.
- Keyboard, screen-reader, mobile viewport, contrast, zoom, ad/CLS testing.
- Verify Contact, author, methodology, results and corrections flows.

## 21. Validation Plan

### Editorial integrity

- Compare pre/post manifests: slug, pick, odds, `published`, `publishedAt`, and results unchanged unless separately authorized.
- Confirm every factual cluster maps to at least one direct, credible source.
- Confirm sources actually support the adjacent claim and dates/seasons match.
- Confirm byline attribution with the owner; no invented credentials.
- Confirm all losses remain accessible.

### Automated content checks

- Count published pages and source coverage.
- Detect exact body/paragraph/sentence duplicates.
- Flag numeric sentences without nearby citation mapping.
- Flag prohibited certainty/profit language.
- Flag pages outside review thresholds without enforcing a Google “word count.”
- Flag missing author/methodology/result relationships.

### Structured data

- Article author equals visible byline and resolves to canonical profile.
- ProfilePage main entity equals visible Person.
- `datePublished` equals immutable `publishedAt`.
- `dateModified` exists only when `updatedAt` exists and is visible.
- `mainEntityOfPage`, publisher, image and breadcrumbs resolve correctly.
- Test representative and all generated templates; rich-result appearance is not guaranteed.

### Technical/indexability

- Run `npm run typecheck`, `npm run build`, `npm run audit:seo`, and `npm run audit:fixtures`.
- Require zero orphan/weak-discovery match pages and no broken internal links.
- Verify sitemap contains canonical, indexable published and trust pages only.
- Verify draft count/routes and no draft leakage.
- Verify production `NEXT_PUBLIC_SITE_URL` and Contact environment.
- Treat sitemap fetching/processing as a separate Search Console investigation.

### Page experience

- Test 320px–desktop layouts, 200% zoom, keyboard order, focus visibility, touch targets and screen-reader labels.
- Measure production Core Web Vitals with filled ads; source inspection alone is insufficient.
- Ensure result status is conveyed by text/icon as well as color.
- Ensure sources/methodology/byline appear before low-priority widgets without overwhelming the analysis.

## Audit evidence summary

Commands executed read-only for validation:

- `npm.cmd run audit:seo` — 70 static HTML pages, 52 matches, eight league hubs, zero broken links/orphans/draft leakage, 52 unique titles/descriptions/bodies; one weak-discovery error for Casa Pia.
- `npm.cmd run audit:fixtures` — fixture and final-score audits passed.
- `npm.cmd run typecheck` — passed.
- Repository corpus analysis — 52 published, 72 drafts, 44,027 words, zero source URLs, zero duplicate paragraphs, 11 recurring exact sentences.

No recommendation was implemented, no commit was created, and no push or deployment was performed.

---

```text
EEAT / HELPFUL CONTENT AUDIT
--------------------------------
Published predictions: 52
WHO: FAIL
HOW: FAIL
WHY: PARTIAL
Experience: PARTIAL
Expertise: PARTIAL
Authoritativeness: FAIL
Trust: FAIL
Sources: FAIL
Originality: PARTIAL
Structured data: PARTIAL
Technical SEO: PARTIAL
Critical findings: 4
High findings: 5
Medium findings: 7
Low findings: 5
Report: EEAT-HELPFUL-CONTENT-AUDIT.md
--------------------------------
```
