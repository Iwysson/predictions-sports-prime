import { TeamVisual } from "@/types";

export const teamVisuals: Record<string, TeamVisual> = {
  Arsenal: {
    code: "ARS",
    primary: "#d71920",
    secondary: "#ffffff",
  },
  Chelsea: {
    code: "CHE",
    primary: "#034694",
    secondary: "#ffffff",
  },
  Liverpool: {
    code: "LIV",
    primary: "#c8102e",
    secondary: "#ffffff",
  },
  Everton: {
    code: "EVE",
    primary: "#003399",
    secondary: "#ffffff",
  },
  Barcelona: {
    code: "BAR",
    primary: "#a50044",
    secondary: "#004d98",
  },
  Sevilla: {
    code: "SEV",
    primary: "#d71920",
    secondary: "#ffffff",
  },
  Bayern: {
    code: "FCB",
    primary: "#dc052d",
    secondary: "#ffffff",
  },
  Dortmund: {
    code: "BVB",
    primary: "#fdeb00",
    secondary: "#111111",
  },
};

export function getTeamVisual(team: string): TeamVisual {
  return (
    teamVisuals[team] ?? {
      code: team.slice(0, 3).toUpperCase(),
      primary: "#1f6f54",
      secondary: "#ffffff",
    }
  );
}
