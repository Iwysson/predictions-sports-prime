import { predictions as oct30Predictions } from './round-2026-10-30';
import { predictions as oct23Predictions } from './round-2026-10-23';
import { ligue1Round2026_10_10 } from "./round-2026-10-10";
import { ligue1Round01 } from "./round-01";
import { ligue1Round2026_10_09 } from "./round-2026-10-09";
import { ligue1Round2026_10_11 } from "./round-2026-10-11";
import { ligue1Round2026_10_17 } from "./round-2026-10-17";
import { ligue1Round2026_10_18 } from "./round-2026-10-18";

export const ligue1Predictions = [
  ...oct30Predictions,
  ...oct23Predictions,
  ...ligue1Round01,
  ...ligue1Round2026_10_09,
  ...ligue1Round2026_10_10,
  ...ligue1Round2026_10_11,
  ...ligue1Round2026_10_17,
  ...ligue1Round2026_10_18,
];
