PSP — REBASE FIX: fixtures.snapshot.json

Correção aplicada:
- removidos os marcadores <<<<<<< / ======= / >>>>>>>;
- mantido generatedAt = 2026-09-02T23:30:00.000Z;
- preservado o conteúdo combinado do snapshot;
- Eliteserien preservada com 8 jogos da rodada 20;
- JSON validado com sucesso;
- total confirmado: 931 fixtures.

Substitua:
src/data/fixtures.snapshot.json

Depois rode:
git add src/data/fixtures.snapshot.json
git status
git rebase --continue

Após concluir o rebase:
npm run fixtures:validate
npm run audit:psp-editorial-standard
npm run typecheck
npm run build
git push origin main
