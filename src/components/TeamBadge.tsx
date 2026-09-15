import { getTeamBadgeAsset, getTeamVisual } from "@/data/teams";

export function TeamBadge({
  team,
  size = "md",
}: {
  team: string;
  size?: "sm" | "md";
}) {
  const visual = getTeamVisual(team);
  const localBadge = getTeamBadgeAsset(team);
  if (localBadge) {
    return (
      <span className={`team-logo team-logo--${size}`}>
        <img
          src={localBadge.src}
          alt={team}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span
      className={`team-badge team-badge--${size} team-badge--fallback`}
      style={{
        background: `linear-gradient(145deg, ${visual.primary}, ${visual.primary} 56%, ${visual.secondary} 57%, ${visual.secondary})`,
      }}
      aria-label={team}
    >
      <span>{visual.code}</span>
    </span>
  );
}
