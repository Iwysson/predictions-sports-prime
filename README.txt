SCOTTISH PREMIERSHIP ROUND 6 — MANUAL FIX

Replace/copy the included src/ tree over the project src/ tree.

Functional change:
- src/lib/competition-rounds.ts now falls back to the existing guarded editorial
  current-round resolver when the factual fixture snapshot contains rounds but
  resolveCompetitionRounds() returns zero current and zero next active fixtures.

Preserved:
- match-lifecycle.ts unchanged.
- fixture-state.ts unchanged.
- Scottish Premiership league/current-round/round-06 indexes unchanged from the
  files supplied by the user.
- Six Round 6 prediction files are the already validator-safe versions.

No fixtures.snapshot.json data is fabricated or edited.
