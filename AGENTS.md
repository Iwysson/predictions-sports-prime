<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Predictions-Sports-Prime — mandatory editorial standard

## Historical Freeze Policy — highest priority

A match whose kickoff has already occurred is FROZEN HISTORY.

Historical predictions are a logical archive used by Prediction History. Do NOT physically move or rename their source files unless the user explicitly asks, because existing canonical routes/imports/history references must remain stable.

For a historical/frozen match NEVER:
- rewrite, expand, shorten or translate the editorial analysis;
- add, remove or rebuild Statistical Core;
- retrofit `editorialStandard: "psp-v1"`;
- change the original prediction or published odds;
- change historical lineups, team news, injuries or suspensions;
- change H1, SEO wording, canonical/slug or editorial structure merely to satisfy a current audit;
- replace old placeholders with newly researched/post-match data;
- use post-match information to reconstruct pre-match evidence.

The existing result lifecycle may still record/finalize objective outcome fields needed by History (fixture status, final score and GREEN/RED/push result). That is result bookkeeping, not editorial migration. Once finalized, those historical outcome fields must not be rewritten without an explicit correction request.

PSP migration and strict editorial requirements apply ONLY to fixtures that are still future/pre-match. A same-day fixture whose reliable kickoff time has already passed is historical/frozen. If date/time is insufficient to prove whether kickoff has passed, place the record in UNRESOLVED QUARANTINE. Do not migrate, rewrite, enrich or mark it `psp-v1` until fixture metadata resolves the lifecycle. Never guess that an unresolved match is future or historical.

## Future/pre-match single source of truth

- Edit prediction files only under `src/data/predictions/<league>/<round>/`.
- Every NEW future prediction and every future prediction materially updated under the current policy MUST set `editorialStandard: "psp-v1"`.
- Future legacy predictions are migration candidates; historical legacy predictions are not.
- Unresolved/quarantined predictions are not migration candidates until date/time is verified.
- Never fabricate statistics, lineups, injuries, suspensions, H2H, venue data, bookmaker names, odds, sources or live state.
- Never use a fabricated zero, invented placeholder or unsupported factual claim to make a future prediction pass.
- Missing editorial data does NOT automatically block publication.
- Future matches may be published as `DATA_READY` or `DATA_PUBLISHABLE_WITH_GAPS`.
- `DATA_BLOCKED` is reserved for genuine integrity failures such as wrong teams, nonexistent fixtures, irreconcilable fixture identity, fabricated evidence or corrupted source identity.
- When preferred data is unavailable, search additional legitimate sources. Secondary sources may be used when their identity and URL are retained and the uncertainty is disclosed.
- If a field remains unavailable after a reasonable source search, mark the field as unavailable/partial/projected/secondary-source as appropriate and publish the match if fixture identity and the prediction itself remain credible.
- The current pending inventory of 31 future matches is explicitly authorized for publication under this policy.

## Mandatory future editorial order

1. H1: `[HOME] vs [AWAY] Prediction, Odds and Betting Tips`.
2. Main prediction and immutable published odds.
3. Match information: competition, date, kick-off, round, venue and location when available from the verified fixture pipeline/source.
4. Team news / availability when reliably available. If unavailable after source checks, disclose that limitation; absence of team news must not block publication.
5. Probable/projected lineups for both teams when a credible source exists. Always label them PROJECTED unless officially confirmed. If unavailable, disclose that and continue publication.
6. Injuries, suspensions and doubts when supported by current sources. State explicitly when a verified check found none; never infer absences.
7. Robust independent match analysis. Evaluate the match first; do not write backwards merely to justify the pick.
8. Prefer HOME-only data for the host versus AWAY-only data for the visitor; use declared fallbacks when the preferred split is unavailable.
9. Advanced data such as xG, xGA, shots, shots on target, possession, goals and corners when genuinely available from sourced data. Missing advanced metrics must be disclosed rather than fabricated.
10. H2H only when real, relevant and source-backed. Omit it rather than inventing it.
11. Tactical analysis / expected game state.
12. At most one source Statistical Core section titled `### Statistical Core Predictions-Sports-Prime`. It may be partial when the complete target metric set is unavailable.
13. Integrated risk assessment: identify data conflicts, sample-size limitations and risks against the selection naturally within the statistical analysis, tactical analysis, market assessment or conclusion. Do not use a `Conflict Detector` heading for new content.
14. Published odds and raw implied probability (`1 / decimal odds`).
15. Value assessment: distinguish market price, historical frequency and editorial judgment.
16. Conclusion.
17. Repeat the final prediction and published odds at the end.

## Statistical Core Predictions-Sports-Prime — future only

A complete 22-metric Statistical Core remains the preferred editorial TARGET for future `psp-v1` predictions, but 22/22 completeness is NOT a publication gate.

Target rows:

`Matches (N)`, `W-D-L`, `Points/game`, `GF/game`, `GA/game`, `xG/game`, `xGA/game`, `Shots/game`, `SOT/game`, `Shots allowed/game`, `SOT allowed/game`, `Possession`, `Corners for/game`, `Corners against/game`, `Total corners/game`, `First to score`, `First to concede`, `Scored in 1st half`, `Conceded in 1st half`, `BTTS`, `Clean sheets`, `Failed to score`.

Extra evidence-backed rows such as Over 7.5/8.5/9.5 corners and Over 1.5/2.5/3.5 goals are allowed.

Prefer the host's HOME split and the visitor's AWAY split. Overall-form values must never silently replace a venue split.

Use this fallback order when the preferred same-competition sample is unavailable:

1. same competition + current season + correct venue split;
2. current-season official competitive matches + correct venue split;
3. previous-season same competition + correct venue split;
4. previous/current-season competitive venue form;
5. established secondary statistical source;
6. partial metric set;
7. unavailable metric explicitly marked.

Exclude friendlies from competitive-form fallback unless they are displayed separately and clearly labelled.

If overall data is the only available figure, it may be shown only when explicitly labelled as overall and must not be represented as HOME/AWAY.

New Statistical Cores and partial Statistical Cores must retain structured provenance for the data actually used, including sample type where applicable, source, source URL, season/scope and match count when available. Per-metric provenance is allowed.

Missing metrics must not be synthesized. A future prediction may publish with fewer than 22 metrics when the available data is genuine, sourced and limitations are disclosed.

Do not add or repair a Core on a historical match. Historical pages keep the evidence that was actually published before kickoff.


## Source confidence and publishable gaps — future only

For future content, classify sourced information with one of these confidence levels when the data pipeline supports it:

- `verified-primary`
- `established-secondary`
- `secondary`
- `low-confidence-secondary`

Use data-status labels where appropriate:

- `verified`
- `secondary-source`
- `projected`
- `partial`
- `unavailable`

Preferred source order:

1. official competition, league, federation or club sources;
2. established football/statistical providers;
3. reputable sports media and specialist football sources;
4. lower-confidence secondary sources used only with explicit disclosure.

Do not bypass paywalls, authentication or prohibited access controls.

A future page may be `DATA_PUBLISHABLE_WITH_GAPS` when some statistics, venue details, projected lineups or team-news fields remain unavailable, provided that:
- fixture identity is credible;
- the existing prediction, pick and odds are preserved;
- every factual value actually used has an identifiable source;
- missing information is disclosed;
- no unsupported factual content is invented.

For the current pending inventory, lack of Core 22/22, projected lineups, team news, venue or round is not by itself a publication blocker.

## Natural editorial quality — new future content only

Risks and contrary evidence are mandatory, but they must be integrated into reader-facing prose. New content must not use headings such as `Conflict Detector` or process language such as `counter-signal`, `mechanically`, `structured snapshot`, `published selection`, `the model sees`, `our model`, `this section`, `as shown above`, or a purely repetitive `the table indicates` construction.

Analytical body paragraphs must be substantive; one- or two-sentence fragments are not acceptable unless they are labels, lists, tables, lineups or source notes. Avoid filler, empty headings, repeated sentences, repeated metric phrases without new interpretation, and conclusions that merely repeat the introduction.

Tactical analysis must be match-specific and grounded in supported details such as named players, roles, formations, corridors, half-spaces, pressing, transitions, width, set pieces, build-up, individual duels or concrete creation/concession patterns. Generic possession-and-chance-creation boilerplate does not satisfy the contract.

## Bold emphasis

For future `psp-v1` analyses, use Markdown bold selectively for scanability. Bold the main pick, published odds, decisive HOME/AWAY records, material xG/xGA or volume values, important percentages, relevant absences and principal risk/conflict. Do not bold whole paragraphs and do not keyword-stuff.

Include at least two evidence-bearing bold fragments containing a number or percentage in addition to the Prediction/Odds labels.

## No duplicate Statistical Core on the rendered page

The future prediction source keeps one Core table so it can be validated and parsed. The UI renders that Core through the structured match module. `EditorialAnalysis` must not render a second copy of the same source table.

## Required checks for future work

Before commit involving a future/new/migrated prediction:
- `npm run audit:psp-editorial-standard`
- `npm run audit:editorial-quality`
- run the editorial-data readiness/publication audits applicable to the change;
- `npm run typecheck`
- `npm run build`

Editorial audits must validate integrity, provenance and disclosure rather than fail solely because optional/target data is incomplete. They must not report success merely because no pages were published; when a pending-publication wave declares an expected publication count, the audit must verify the actual generated/indexable pages.

A failure belonging to a historical frozen prediction is a bug in the audit policy; do not "fix" the historical prediction to silence it.
