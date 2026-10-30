# Retired sports (NBA, NHL, NFL)

Predictions Sports Prime became football-only on 2026-10-30. This folder keeps the original NBA, NHL and NFL records and the code that served them, for audit and integrity. Paths inside it mirror where each file used to live.

Nothing here is built, bundled, served or type-checked: `tsconfig.json` excludes `archive`, and no file outside this folder imports from it. Public URLs for these sports answer HTTP 410 from `functions/_middleware.js`.
