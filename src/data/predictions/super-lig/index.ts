import { predictions as oct30Predictions } from './round-2026-10-30';
import { predictions as oct23Predictions } from './round-2026-10-23';
import { superLigRound2026_10_10 } from "./round-2026-10-10";
import { superLigRound2026_10_09 } from "./round-2026-10-09";
import { superLigRound2026_10_11 } from "./round-2026-10-11";
import { superLigRound2026_10_16 } from "./round-2026-10-16";
import { superLigRound2026_10_17 } from "./round-2026-10-17";

export const superLigPredictions = [
  ...oct30Predictions,
  ...oct23Predictions,
  ...superLigRound2026_10_09,
  ...superLigRound2026_10_10,
  ...superLigRound2026_10_11,
  ...superLigRound2026_10_16,
  ...superLigRound2026_10_17,
];
