PSP — Manual fix for matches on 02/09/2026 and 03/09/2026

Corrections included:
- Match header time: removes double timezone conversion and displays the already-normalized league-local match.date/match.time.
- Flamengo vs Mirassol: named probable XIs and fresher availability (De la Cruz doubtful; Bruno Henrique available).
- Vitória vs Vasco: removes suspended Cauan Barros from the projected XI; adds latest probable lineups and Vitória suspensions.
- Santos vs Palmeiras: Neymar expected to start; Gustavo Henrique removed because he is out; latest Palmeiras doubts/absences reflected.
- Grêmio vs Internacional: generic lineup guidance replaced by named probable XIs; structured lineup/availability data added.

No changes were made to picks or published odds.
No change was required for Toulouse vs Lille or Real Sociedad vs Celta Vigo: the uploaded current files already contain populated HOME/AWAY Statistical Cores.

After replacing the files:
npm run typecheck
npm run build
npm run audit:psp-editorial-standard
