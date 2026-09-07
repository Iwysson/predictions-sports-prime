# Wave 2.5 / 2.6 provider map

| Provider | Coverage | Fixture | HOME/AWAY Core | Lineup | Team news | Update/freshness | Reliability |
|---|---|---|---|---|---|---|---|
| Versioned fixture snapshot | Configured competitions | Yes, only when kickoff, venue, source URL and source agreement are present | No | No | No | Snapshot `generatedAt`; verified fields required | Primary local provider cache |
| FotMob fixture adapter | Matches with a date candidate in the versioned snapshot | Yes, when daily feed and match details resolve the same teams and expose round, kickoff and venue | No | No | No | Live opt-in request; 12s timeout; match-specific API URL retained | Secondary; fail-closed |
| Manual verified fixture | Any inventory competition | Yes | No | No | No | Maximum 30 days; HTTPS source and verification timestamp required | Manual verified |
| Manual verified Statistical Core | Any inventory competition | No | All 22, separately for HOME/AWAY | No | No | Every metric must be current within 7 days | Manual verified with per-metric provenance |
| Manual verified projected lineup | Any inventory competition | No | No | Exactly 11 players, always projected | Availability attached to lineup | Maximum 72 hours | Manual verified, dated HTTPS source |
| Manual verified team news | Any inventory competition | No | No | No | Team-specific unavailable, suspended, doubtful, returned and rotation notes | Maximum 72 hours | Manual verified, dated HTTPS source |

## Runtime validation tightened in manual review

- Statistical Core readiness now rejects stale metrics and any metric whose `metric`, `season`, `competition`, `sampleType` or `matches` metadata conflicts with its parent Core block.
- Fixture readiness verifies freshness, HTTPS provenance, kickoff validity, competition and exact home/away identity before accepting any provider result.
- Projected lineups and team news are revalidated centrally even if a provider already performs its own checks.
- Team news is now required separately for the home and away teams. A single match-level object can no longer satisfy both sides without team attribution.
- Coverage reporting now distinguishes HOME/AWAY lineup and team-news gaps instead of collapsing both sides into one cell.
- External network calls fail closed and use a bounded timeout. A FotMob detail payload is not promoted if the returned teams differ from the pending fixture.

## Existing project sources audited

- `src/lib/openfootball.ts` and league fixture URLs: season fixtures/results where configured; no complete 22-metric match-stat feed and no lineup/team-news feed.
- ESPN and TheSportsDB hydration in `scripts/sync-fixtures.mjs`: fixture IDs, kickoff state and results for mapped competitions; provider availability varies and does not guarantee venue, source URL, lineups or all Core metrics.
- FotMob hydration in `scripts/sync-fixtures.mjs`: fixture recovery, final scores and corner-result capture; not currently a normalized pre-match 22/22 venue-split adapter.
- Existing editorial `sources`, `matchSeo` and Statistical Core prose: publication-level evidence must not be silently promoted into a new fixture or current Core because dates, opponents and sample scopes may differ.
- Manual-only leagues: existing sync behavior can retain an editorial fixture, but readiness requires the stricter manual-verified record in `src/data/editorial-data/manual-verified.json`.

## Resolution behavior

Every resolver is fail-closed. Providers are tried in declared order and only centrally validated records are accepted. Missing values remain absent; zero is accepted only when it is an explicit sourced value.

`DATA_READY` requires a fresh verified fixture, complete and fresh HOME and AWAY Core blocks, two fresh projected XIs, and fresh team-specific news for both teams. `DATA_INCOMPLETE` means at least one valid block exists; `DATA_UNAVAILABLE` means no provider returned a publishable block. Neither incomplete state is published.

## Remaining provider gap

The current repository still does not contain a verified adapter that can produce the full 22/22 venue-split Core, fresh projected lineups, or team-specific news automatically. Those adapters must remain fail-closed until their upstream schemas and source coverage are verified. This review intentionally does not synthesize or infer missing statistics from overall aggregates.
