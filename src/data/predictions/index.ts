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
import { championshipPredictions } from "./championship";
import { superLigPredictions } from "./super-lig";
import { scottishPremiershipPredictions } from "./scottish-premiership";
import { eliteserienPredictions } from "./eliteserien";
import { mlsPredictions } from "./mls";
import { championsLeaguePredictions } from "./champions-league";
import { copaLibertadoresPredictions } from "./copa-libertadores";
import { copaSudamericanaPredictions } from "./copa-sudamericana";
import { applyWave08EditorialDebtRemediation } from "./editorial-debt-remediation";

export const editorialPredictionsRaw = [
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
  ...championshipPredictions,
  ...superLigPredictions,
  ...scottishPremiershipPredictions,
  ...eliteserienPredictions,
  ...mlsPredictions,
  ...championsLeaguePredictions,
  ...copaLibertadoresPredictions,
  ...copaSudamericanaPredictions,
];

export const editorialPredictions = editorialPredictionsRaw.map(applyWave08EditorialDebtRemediation);
