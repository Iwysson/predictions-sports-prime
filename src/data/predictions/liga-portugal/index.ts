import { predictions as oct30Predictions } from './round-2026-10-30';
import { predictions as oct23Predictions } from './round-2026-10-23';
import { ligaPortugalRound2026_10_10 } from "./round-2026-10-10";
import { ligaPortugalRound02 } from "./round-02";
import { ligaPortugalRound03 } from "./round-03";
import { ligaPortugalRound2026_10_09 } from "./round-2026-10-09";
import { ligaPortugalRound2026_10_11 } from "./round-2026-10-11";
import { ligaPortugalRound2026_10_12 } from "./round-2026-10-12";
import { predictions as oct19 } from "./round-2026-10-19";

export const ligaPortugalPredictions = [
  ...oct30Predictions,
  ...oct23Predictions,
  ...ligaPortugalRound02,
  ...ligaPortugalRound03,
  ...ligaPortugalRound2026_10_09,
  ...ligaPortugalRound2026_10_10,
  ...ligaPortugalRound2026_10_11,
  ...ligaPortugalRound2026_10_12,
  ...oct19,
];
