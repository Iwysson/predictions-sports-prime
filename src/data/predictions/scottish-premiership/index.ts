import { currentRoundPredictions } from "./current-round";
import { scottishWave27 } from "./round-07/wave-27";
import { scottishPremiershipRound03 } from "./round-03";

export const scottishPremiershipPredictions = [
  ...scottishPremiershipRound03,
  ...currentRoundPredictions,
  ...scottishWave27,
];
