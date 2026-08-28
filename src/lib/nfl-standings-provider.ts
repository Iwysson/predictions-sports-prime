import snapshotJson from "@/data/nfl/standings.snapshot.json";
import { NFL_DIVISIONS, NFL_TEAM_BY_ID, NFL_TEAMS } from "@/data/nfl/teams";
import type { NFLConference, NFLDivision, NFLStanding, NFLStandingsSnapshot } from "@/types/nfl";

const snapshot = snapshotJson as NFLStandingsSnapshot;
const playoffStatuses = new Set(["clinched-division", "clinched-playoff", "wild-card", "in-playoff-position", "in-the-hunt", "eliminated", "none"]);

export function validateNFLStandings(input: NFLStandingsSnapshot): string[] {
  const errors: string[] = [];
  if (input.standings.length !== 32) errors.push(`Expected 32 teams, received ${input.standings.length}`);
  const ids = new Set(input.standings.map((row) => row.teamId));
  if (ids.size !== input.standings.length) errors.push("Duplicate team IDs");
  for (const configured of NFL_TEAMS) if (!ids.has(configured.id)) errors.push(`Missing ${configured.id}`);
  for (const row of input.standings) {
    if (!NFL_TEAM_BY_ID[row.teamId]) errors.push(`Unknown team ${row.teamId}`);
    if (![row.wins, row.losses, row.ties].every((value) => Number.isInteger(value) && value >= 0)) errors.push(`${row.teamId}: invalid W-L-T`);
    if (!playoffStatuses.has(row.playoffStatus)) errors.push(`${row.teamId}: invalid playoff status`);
  }
  for (const conference of ["AFC", "NFC"] as const) {
    const conferenceIds = NFL_TEAMS.filter((team) => team.conference === conference).map((team) => team.id);
    if (conferenceIds.filter((id) => ids.has(id)).length !== 16) errors.push(`${conference}: expected 16 teams`);
    for (const division of NFL_DIVISIONS[conference]) if (NFL_TEAMS.filter((team) => team.division === division && ids.has(team.id)).length !== 4) errors.push(`${division}: expected 4 teams`);
  }
  return errors;
}

export function getNFLStandings(season = 2026): NFLStanding[] {
  if (season !== snapshot.season) return [];
  const errors = validateNFLStandings(snapshot);
  if (errors.length) throw new Error(`Invalid NFL standings snapshot: ${errors.join("; ")}`);
  return snapshot.standings.map(({ teamId, ...record }) => ({ ...NFL_TEAM_BY_ID[teamId], ...record }));
}

export function getNFLStandingsMetadata() { return { season: snapshot.season, generatedAt: snapshot.generatedAt, source: snapshot.source, seasonPhase: snapshot.seasonPhase }; }
export function getNFLDivisionStandings(division: NFLDivision) { return getNFLStandings().filter((row) => row.division === division).sort((a, b) => (a.divisionRank ?? 99) - (b.divisionRank ?? 99) || a.name.localeCompare(b.name)); }
export function getNFLConferenceStandings(conference: NFLConference) { return getNFLStandings().filter((row) => row.conference === conference).sort((a, b) => (a.conferenceRank ?? 99) - (b.conferenceRank ?? 99) || a.name.localeCompare(b.name)); }
