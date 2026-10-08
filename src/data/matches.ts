import { editorialPredictions } from "@/data/predictions";
import { buildPublishedMatches } from "@/lib/editorial";
import { isSettledPrediction } from "@/lib/match-page-lifecycle";

// Compatibilidade com o restante do site.
// NÃO edite este arquivo para publicar predictions.
// Edite somente os arquivos em: src/data/predictions/<liga>/<rodada>/
// FINAL + settled matches have no page any more: they live only in the permanent results
// dataset, so no listing, sitemap or schema built from `matches` can point at them.
export const matches = buildPublishedMatches(
  editorialPredictions.filter((prediction) => !isSettledPrediction(prediction))
);

export const matchesByLeague = new Map<string, (typeof matches)[number][]>();
for (const match of matches) {
  const leagueMatches = matchesByLeague.get(match.league) ?? [];
  leagueMatches.push(match);
  matchesByLeague.set(match.league, leagueMatches);
}
