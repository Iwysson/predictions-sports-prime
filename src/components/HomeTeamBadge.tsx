import { getTeamBadgeAsset, getTeamVisual } from "@/data/teams";

export function HomeTeamBadge({ team }: { team: string }) {
  const badge = getTeamBadgeAsset(team);
  const visual = getTeamVisual(team);

  if (badge) {
    return (
      <span className="team-logo team-logo--md">
        <img src={badge.src} alt={`${team} badge`} loading="lazy" width="48" height="48" />
      </span>
    );
  }

  return (
    <span
      className="team-badge team-badge--md team-badge--fallback"
      style={{
        background: `linear-gradient(145deg, ${visual.primary}, ${visual.primary} 56%, ${visual.secondary} 57%, ${visual.secondary})`,
      }}
      aria-label={`${team} badge`}
    >
      <span>{visual.code}</span>
    </span>
  );
}
