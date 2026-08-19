# SEO Publishing Workflow

## Publishing a prediction

1. Add or update the prediction in `src/data/predictions/<league>/<round>/`.
2. Set `published: true` only after the analysis, main pick and optional odds are ready.
3. Run `npm.cmd run editorial:timestamp -- publish <prediction-file>` in the same editorial change. It records `publishedAt` once and refuses to overwrite an existing value or timestamp a prediction already published in `HEAD`.
4. Run `npx.cmd tsc --noEmit` and `npm.cmd run build`.
5. Run `npm.cmd run audit:seo` against the generated `out/` directory. The audit also refreshes the internal `SEO-INDEXING-QUEUE.md` report.
6. Deploy only after both commands pass. Normal discovery then occurs through internal links, league hubs, Home/Related placement and the sitemap.

A published prediction is automatically converted into a static match route with unique metadata, canonical URL, index/follow directives, league relationship, contextual links and valid structured data. It is included in the sitemap and indexing queue without manually editing `sitemap.ts`.

Drafts marked `published: false` do not receive a match route, sitemap entry, league-hub link or related-prediction link.

## Editorial fields and validation

Mandatory for every record:

- `league`, `homeTeam` and `awayTeam`;
- `analysis` as an array;
- `picks.main`;
- explicit `published: true` or `published: false`.

Additional requirements for `published: true`:

- non-placeholder analysis with at least 300 meaningful characters;
- non-empty main prediction;
- unique canonical slug;
- no duplicated editorial body;
- no duplicate teams on the same canonical date.

Optional fields:

- `picks.odds`, which must be a finite number greater than 1 when supplied;
- `matchInfo.date` in `YYYY-MM-DD` format;
- `matchInfo.time` in 24-hour `HH:mm` format;
- `matchInfo.round` and `matchInfo.venue`;
- reliable `publishedAt` and `updatedAt` ISO timestamps;
- `title`;
- `slug` override for a legitimate rematch that would otherwise reuse an existing route.

Use `npm.cmd run editorial:timestamp -- update <prediction-file>` only after a significant editorial revision. It records or replaces `updatedAt` as an explicit editorial action and rejects values earlier than `publishedAt`. Normal builds never execute either timestamp command. An optional ISO timestamp argument is accepted when a trustworthy external editorial time must be recorded; otherwise the script records the time of the explicit publication/update action.

For a rematch, use a stable descriptive slug such as `home-vs-away-2027-04-17`. Never change the slug after publication unless a redirect and canonical migration are deliberately planned.

The only manual registration required is importing the new source into its round index. A new round must also be imported once by its league index. Home classification, match generation, league inclusion, sitemap, Related Predictions and the indexing queue are derived automatically.

## SEO Publication Priority

Prefer matches scheduled approximately 24–96 hours ahead. When several credible fixtures are available, prioritize:

1. clubs with stronger search demand;
2. major leagues;
3. leagues already developing useful prediction clusters;
4. complete, credible and original editorial analysis;
5. fixtures with a reliable canonical date and kickoff time.

Quality takes priority over volume. Never publish incomplete, duplicated, weak or artificially expanded analysis merely to increase the page count.

After setting `published: true`, use the existing build and SEO audit to verify the match page, league-hub inclusion, Home Today/Latest classification when applicable, Related Predictions eligibility, sitemap inclusion, internal discovery, self-referencing canonical and `index, follow`. Date, kickoff time, editorial structure, duplicate protection and explicit publication state are enforced by the Phase 4 validation pipeline.

Normal Google discovery follows this path:

```text
published prediction
  → internal links
  → league hub
  → Home when current or upcoming
  → Related Predictions
  → sitemap
```

Manual Search Console URL inspection or submission is optional and should be reserved for testing or selected important URLs. It is not a normal publication requirement.

## Adding a league

Add the league once to the registry in `src/data/leagues.ts`, including its data-source and display configuration. The shared league route then provides the hub title, description, canonical, introduction, breadcrumbs, structured data, current round, standings and published prediction links. No league-specific page component is required.

Also add the league slug to the `LeagueSlug` type and register its prediction collection. Standings and fixture source configuration must correspond to the real competition; do not create a generic standings page for aggregators such as Other Leagues.

## Automatic internal-link lifecycle

```text
published: true
  → static match route
  → sitemap entry
  → league hub link
  → deterministic related links
  → match-to-league backlink
```

Historical published pages remain available. Related selection prioritizes published matches from the same league and round, then temporal proximity, with published matches from other leagues used only when needed to fill the compact list.

## Automatic SEO lifecycle

```text
published: true
  → static match page
  → unique title and description
  → canonical and index/follow
  → sitemap and league hub
  → Home Today/Latest when current or upcoming
  → Related Predictions
  → Article and Breadcrumb structured data
  → SEO indexing queue
```

## Search Console review

Use `SEO-INDEXING-QUEUE.md` to identify published canonical URLs that are indexable, present in the sitemap and internally linked. Submission or inspection remains a manual Google Search Console action; the project does not call unofficial indexing services.

`lastModified` is emitted only when the prediction has a reliable editorial `updatedAt` or `publishedAt`. Never add a date merely to populate the sitemap or Article schema.

## Scaling checkpoints

- Home remains bounded to Today plus the next 10 predictions.
- Related Predictions remains bounded to four links and is deterministic. Reassess its per-page sorting cost around 1,000 published predictions and pre-index by league/date before approaching 10,000.
- The current league view is intentionally round-focused. Before any league exceeds 25 published analyses, design static path-based archive pages; do not use query-string pagination.
- A single sitemap is appropriate below Google's 50,000-URL and 50 MB limits. Plan a sitemap index before approximately 45,000 URLs to retain operational headroom.
- Do not create team hubs until a team has at least five useful published analyses. A team name alone is not sufficient unique content.
