import { bundesligaPredictions } from "./bundesliga";
import { laLigaPredictions } from "./la-liga";
import { otherLeaguesPredictions } from "./other-leagues";
import { premierLeaguePredictions } from "./premier-league";
import { serieAPredictions } from "./serie-a";

export const editorialPredictions = [
  ...premierLeaguePredictions,
  ...laLigaPredictions,
  ...bundesligaPredictions,
  ...serieAPredictions,
  ...otherLeaguesPredictions,
];
