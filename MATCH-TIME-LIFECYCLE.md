# Match Time and Lifecycle

This project uses one shared match-state model for kickoff time, lifecycle, surface eligibility and history movement.

## Time Semantics

- `kickoffUtc` is the authoritative instant used by business logic.
- UI displays are resolved through a single formatter that applies an explicit IANA timezone.
- Competition defaults are used only when a more specific venue or city timezone is not available.
- Brazil fixtures should prefer a factual venue or city timezone when the source data provides one.
- Daylight saving time is handled by `Intl.DateTimeFormat` with IANA zones.

## Timezone Priority

1. Explicit fixture or venue timezone
2. Venue city mapping
3. Venue country or location
4. Competition timezone
5. Home-team venue or location
6. Documented safe fallback
7. Unknown

## Lifecycle

- Fixture lifecycle is separate from prediction grade.
- Central lifecycle statuses: upcoming, live, completed, postponed, cancelled, unknown.
- Business rules always use normalized UTC time, not rendered strings.
- Temporal fallback is conservative and only used when explicit fixture state is unavailable.

## Surface Eligibility

- Today, Tomorrow, Upcoming and Prediction History are derived from the central lifecycle rules.
- Completed published matches move to History automatically.
- Postponed and cancelled fixtures remain outside normal active surfaces.

## Stale Render Prevention

- The static HTML and the first client render should use the same authoritative dataset.
- Runtime refreshes should only replace state when the fetched dataset is newer and valid.
- The project avoids delayed "old data first" replacement behavior on the main history surfaces.

## Legacy Cleanup

- Old time conversion paths should not coexist with the central formatter.
- Duplicate Today/History filters should be removed once the shared helpers cover the use case.
- Parallel lifecycle engines should not be introduced.
