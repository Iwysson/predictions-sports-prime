// Match state from a real provider feed. Kickoff time alone never implies LIVE, and an unknown
// state is "scheduled". The project has no NHL live feed yet, so every NHL game is "scheduled"
// until a provider status is wired in through liveStatusFor.
export type MatchStatus = "scheduled" | "live" | "finished";

const LIVE_STATES = new Set(["live", "in_progress", "1st", "2nd", "3rd", "ot", "so", "intermission", "halftime", "second_half"]);
const FINISHED_STATES = new Set(["finished", "final", "ft", "off"]);

export function mapProviderStatus(raw: string | null | undefined): MatchStatus {
  const state = (raw ?? "").trim().toLowerCase();
  if (LIVE_STATES.has(state)) return "live";
  if (FINISHED_STATES.has(state)) return "finished";
  return "scheduled";
}

// Placeholder until an NHL provider is connected. Returns "scheduled" for every game.
export function liveStatusFor(_slug: string): MatchStatus {
  return "scheduled";
}
