import { bundesligaPredictions } from "./bundesliga";
import { laLigaPredictions } from "./la-liga";
import { premierLeaguePredictions } from "./premier-league";
import { serieAPredictions } from "./serie-a";
import { ligaPortugalPredictions } from "./liga-portugal";
import { ligue1Predictions } from "./ligue-1";

export const editorialPredictions = [
  ...premierLeaguePredictions,
  ...laLigaPredictions,
  ...bundesligaPredictions,
  ...serieAPredictions,
  ...ligaPortugalPredictions,
  ...ligue1Predictions,
];
