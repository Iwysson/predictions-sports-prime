import { nflWeek3BySlug, nflWeek3Games } from "@/data/predictions/nfl/week-03";
import { nflWeek4BySlug, nflWeek4Games } from "@/data/predictions/nfl/week-04";

export { nflWeek3Games, nflWeek4Games };

export const nflGames = [...nflWeek3Games, ...nflWeek4Games];
export const nflGamesBySlug = { ...nflWeek3BySlug, ...nflWeek4BySlug };
