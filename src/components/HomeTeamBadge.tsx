import { TeamBadge } from "@/components/TeamBadge";

export function HomeTeamBadge({ team }: { team: string }) {
  return <TeamBadge team={team} />;
}
