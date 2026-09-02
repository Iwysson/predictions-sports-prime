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
- Never weaken a validator, remove a required metric, or add an exception merely to make a future prediction pass.
- Never fabricate statistics, lineups, injuries, suspensions, H2H, venue data or odds.
- If a mandatory factual field cannot be verified, do not publish the future prediction. Do not use `—`, `N/A`, `TBD`, `Pending`, `Unknown`, `null` or a fabricated zero as a substitute.

## Mandatory future editorial order

1. H1: `[HOME] vs [AWAY] Prediction, Odds and Betting Tips`.
2. Main prediction and immutable published odds.
3. Match information: competition, date, kick-off, round, venue and location when available from the verified fixture pipeline/source.
4. Team news / availability.
5. Probable lineups for both teams. Use the previous league XI as the base only when appropriate. Put genuine uncertainty in parentheses with the likely alternative.
6. Injuries, suspensions and doubts. State explicitly when a verified check found none.
7. Robust independent match analysis. Evaluate the match first; do not write backwards merely to justify the pick.
8. HOME-only data for the host versus AWAY-only data for the visitor.
9. Advanced data: xG, xGA, shots, shots on target, possession, goals and corners as required by the Statistical Core.
10. H2H only when real, relevant and source-backed. Omit it rather than inventing it.
11. Tactical analysis / expected game state.
12. Exactly one source Statistical Core section titled `### Statistical Core Predictions-Sports-Prime`.
13. Conflict Detector: identify data conflicts, sample-size limitations and risks against the selection.
14. Published odds and raw implied probability (`1 / decimal odds`).
15. Value assessment: distinguish market price, historical frequency and editorial judgment.
16. Conclusion.
17. Repeat the final prediction and published odds at the end.

## Statistical Core Predictions-Sports-Prime — future only

Every `psp-v1` future prediction MUST contain exactly one source table with at least these rows and both HOME/AWAY cells genuinely populated:

`Matches (N)`, `W-D-L`, `Points/game`, `GF/game`, `GA/game`, `xG/game`, `xGA/game`, `Shots/game`, `SOT/game`, `Shots allowed/game`, `SOT allowed/game`, `Possession`, `Corners for/game`, `Corners against/game`, `Total corners/game`, `First to score`, `First to concede`, `Scored in 1st half`, `Conceded in 1st half`, `BTTS`, `Clean sheets`, `Failed to score`.

Extra evidence-backed rows such as Over 7.5/8.5/9.5 corners and Over 1.5/2.5/3.5 goals are allowed.

The Core MUST use the host's HOME split and the visitor's AWAY split. Overall-form values must not silently replace the required split.

Do not add or repair a Core on a historical match. Historical pages keep the evidence that was actually published before kickoff.

## Bold emphasis

For future `psp-v1` analyses, use Markdown bold selectively for scanability. Bold the main pick, published odds, decisive HOME/AWAY records, material xG/xGA or volume values, important percentages, relevant absences and principal risk/conflict. Do not bold whole paragraphs and do not keyword-stuff.

Include at least two evidence-bearing bold fragments containing a number or percentage in addition to the Prediction/Odds labels.

## No duplicate Statistical Core on the rendered page

The future prediction source keeps one Core table so it can be validated and parsed. The UI renders that Core through the structured match module. `EditorialAnalysis` must not render a second copy of the same source table.

## Required checks for future work

Before commit involving a future/new/migrated prediction:
- `npm run audit:psp-editorial-standard`
- `npm run audit:editorial-quality`
- `npm run typecheck`
- `npm run build`

A failure belonging to a historical frozen prediction is a bug in the audit policy; do not "fix" the historical prediction to silence it.
