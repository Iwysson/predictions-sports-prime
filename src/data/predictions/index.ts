import { laLigaPredictions } from "./la-liga";
import { brasileiraoSerieAPredictions } from "./brasileirao-serie-a";
import { ligaPortugalPredictions } from "./liga-portugal";
import { ligue1Predictions } from "./ligue-1";
import { bundesligaPredictions } from "./bundesliga";
import { eredivisiePredictions } from "./eredivisie";
import { eliteserienPredictions } from "./eliteserien";
import { superLigPredictions } from "./super-lig";
import { championshipPredictions } from "./championship";
import { mlsPredictions } from "./mls";
import { scottishPremiershipPredictions } from "./scottish-premiership";
import { premierLeaguePredictions } from "./premier-league";
import { serieAPredictions } from "./serie-a";
import { championsLeaguePredictions } from "./champions-league";
import { copaLibertadoresPredictions } from "./copa-libertadores";
import { copaSudamericanaPredictions } from "./copa-sudamericana";
import { applyWave08EditorialDebtRemediation } from "./editorial-debt-remediation";

export const editorialPredictionsRaw = [
  ...laLigaPredictions,
  ...brasileiraoSerieAPredictions,
  ...championsLeaguePredictions,
  ...copaLibertadoresPredictions,
  ...copaSudamericanaPredictions,
  ...ligaPortugalPredictions,
  ...ligue1Predictions,
  ...bundesligaPredictions,
  ...eredivisiePredictions,
  ...eliteserienPredictions,
  ...superLigPredictions,
  ...championshipPredictions,
  ...mlsPredictions,
  ...scottishPremiershipPredictions,
  ...premierLeaguePredictions,
  ...serieAPredictions,
];

export const editorialPredictions = editorialPredictionsRaw.map(applyWave08EditorialDebtRemediation);
