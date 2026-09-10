import { currentRoundPredictions } from "./current-round";
import { superLigRound04 } from "./round-04";
import { superLigRound05 } from "./round-05";

export const superLigPredictions = [...currentRoundPredictions, ...superLigRound04, ...superLigRound05];
