import Image from "next/image";
import { NFL_TEAM_BY_NAME } from "@/data/nfl/teams";

// NFL crests use the league's own per-team logo convention (public/nfl/team-logos/<id>.png),
// not the shared cross-league team-badge map used by soccer and NHL.
export function NflTeamBadge({ team, size = "md" }: { team: string; size?: "sm" | "md" }) {
  const info = NFL_TEAM_BY_NAME[team];
  const px = size === "sm" ? 32 : 45;
  if (!info) return null;
  return (
    <span className={`team-logo team-logo--${size}`}>
      <Image src={info.logo} alt={team} width={px} height={px} />
    </span>
  );
}
