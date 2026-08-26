import { leaguesBySlug } from "@/data/leagues";
import type { LeagueSlug } from "@/types";

export function LeagueBadge({
  slug,
  short,
  size = "md",
}: {
  slug: string;
  short: string;
  size?: "sm" | "md";
}) {
  const league = leaguesBySlug[slug as LeagueSlug];
  const asset = league?.asset ?? { kind: "text" as const, label: short, reason: "unknown competition" };

  if (asset.kind === "image") {
    return (
      <span className={`league-logo league-logo--${size}${asset.needsDarkBackground ? " league-logo--dark-surface" : ""}`}>
        <img
          src={asset.src}
          alt={`${league.name} competition badge`}
          loading="lazy"
        />
      </span>
    );
  }

  return (
    <span className={`mini-league-badge mini-league-badge--${size}`}>
      {asset.label}
    </span>
  );
}
