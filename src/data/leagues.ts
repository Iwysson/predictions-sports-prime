import { LeagueSlug } from "@/types";

export const leagues: {
  slug: LeagueSlug;
  name: string;
  country: string;
  short: string;
}[] = [
  {
    slug: "premier-league",
    name: "Premier League",
    country: "England",
    short: "PL",
  },
  {
    slug: "la-liga",
    name: "La Liga",
    country: "Spain",
    short: "LL",
  },
  {
    slug: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    short: "BL",
  },
  {
    slug: "serie-a",
    name: "Serie A",
    country: "Italy",
    short: "SA",
  },
  {
    slug: "other-leagues",
    name: "Other Leagues",
    country: "Selected matches",
    short: "+",
  },
];
