import { bundesligaPredictions } from "./bundesliga";
import { laLigaPredictions } from "./la-liga";
import { premierLeaguePredictions } from "./premier-league";
import { serieAPredictions } from "./serie-a";
import { ligaPortugalPredictions } from "./liga-portugal";
import { ligue1Predictions } from "./ligue-1";
import { eredivisiePredictions } from "./eredivisie";
import { brasileiraoSerieAPredictions } from "./brasileirao-serie-a";
import { copaDoBrasilPredictions } from "./copa-do-brasil";
import { eflCupPredictions } from "./efl-cup";

export const editorialPredictions = [
  ...premierLeaguePredictions,
  ...laLigaPredictions,
  ...bundesligaPredictions,
  ...serieAPredictions,
  ...ligaPortugalPredictions,
  ...ligue1Predictions,
  ...eredivisiePredictions,
  ...brasileiraoSerieAPredictions,
  ...copaDoBrasilPredictions,
  ...eflCupPredictions,
];
