# PSP Editorial Standard Patch v3

## Purpose

Fix the lifecycle boundary found after the v2 audit. Records with missing/unreliable date or same-day kickoff time are no longer treated as future migration candidates.

## Policy

- `historical-frozen`: kickoff already occurred or final result exists. Never migrate editorial content.
- `future-pre-match`: date/time proves kickoff is still ahead. PSP v1 applies.
- `unresolved-quarantine`: lifecycle cannot be proven from available date/time. Do not rewrite or migrate until fixture metadata resolves it.

This prevents an old match with incomplete metadata from being accidentally rewritten as if it were future.

## Expected audit output

The strict audit now reports `Historical frozen`, `Future/pre-match eligible`, and `Unresolved/quarantined date-time` separately. Only proven future/pre-match fixtures can fail the migration gate.
