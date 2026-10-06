import { laLigaPredictions } from "./la-liga";
import { brasileiraoSerieAPredictions } from "./brasileirao-serie-a";
import { ligaPortugalPredictions } from "./liga-portugal";
import { ligue1Predictions } from "./ligue-1";
import { applyWave08EditorialDebtRemediation } from "./editorial-debt-remediation";

export const editorialPredictionsRaw = [
  ...laLigaPredictions,
  ...brasileiraoSerieAPredictions,
  ...ligaPortugalPredictions,
  ...ligue1Predictions,
];

export const editorialPredictions = editorialPredictionsRaw.map(applyWave08EditorialDebtRemediation);
