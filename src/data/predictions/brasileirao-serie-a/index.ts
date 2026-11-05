import { predictions as nov05Predictions } from './round-2026-11-05';
import { predictions as nov04Predictions } from './round-2026-11-04';
import { predictions as oct30Predictions } from './round-2026-10-30';
import { predictions as oct23Predictions } from './round-2026-10-23';
import { predictions as oct29Predictions } from './round-2026-10-29';
import { brasileiraoRound29Predictions } from "./round-29";
import { brasileiraoRound30 } from "./round-30";
import { brasileiraoSerieARound2026_10_16 } from "./round-2026-10-16";
import { brasileiraoSerieARound2026_10_17 } from "./round-2026-10-17";

export const brasileiraoSerieAPredictions = [
  ...nov05Predictions,
  ...nov04Predictions,
  ...oct30Predictions,
  ...oct29Predictions, ...oct23Predictions,...brasileiraoRound29Predictions, ...brasileiraoRound30, ...brasileiraoSerieARound2026_10_16, ...brasileiraoSerieARound2026_10_17];
