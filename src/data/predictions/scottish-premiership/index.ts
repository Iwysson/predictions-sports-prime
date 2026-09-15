import { currentRoundPredictions } from "./current-round";
import { scottishWave27 } from "./round-07/wave-27";
import { scottishPremiershipRound03 } from "./round-03";
import { scottishPremiershipRound08 } from "./round-08";

export const scottishPremiershipPredictions = [
  ...scottishPremiershipRound03,
  ...currentRoundPredictions,
  ...scottishWave27,
  ...scottishPremiershipRound08,
];
