import { predictions as oct30Predictions } from './round-2026-10-30';
import { eliteserienRound2026_10_10 } from "./round-2026-10-10";
import { eliteserienRound2026_10_09 } from "./round-2026-10-09";
import { eliteserienRound2026_10_11 } from "./round-2026-10-11";
import { eliteserienRound2026_10_17 } from "./round-2026-10-17";
import { predictions as eliteserienRound2026_11_09 } from "./round-2026-11-09";

export const eliteserienPredictions = [
  ...eliteserienRound2026_11_09,
  ...oct30Predictions,
  ...eliteserienRound2026_10_09,
  ...eliteserienRound2026_10_10,
  ...eliteserienRound2026_10_11,
  ...eliteserienRound2026_10_17,
];
