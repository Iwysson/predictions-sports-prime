"use client";

import { useEffect, useState } from "react";
import { getTeamBadgeAsset, getTeamVisual } from "@/data/teams";
import { fetchTeamBadge } from "@/lib/artwork";

export function TeamBadge({
  team,
  size = "md",
}: {
  team: string;
  size?: "sm" | "md";
}) {
  const visual = getTeamVisual(team);
  const localBadge = getTeamBadgeAsset(team);
  const [badge, setBadge] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (localBadge) {
      setLoaded(true);
      return;
    }

    let cancelled = false;

    fetchTeamBadge(team)
      .then((url) => {
        if (!cancelled) {
          setBadge(url);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [localBadge, team]);

  if (localBadge || badge) {
    return (
      <span className={`team-logo team-logo--${size}`}>
        <img
          src={localBadge?.src ?? badge!}
          alt={`${team} badge`}
          loading="lazy"
          {...(!localBadge ? {
            referrerPolicy: "no-referrer" as const,
            onError: () => setBadge(null),
          } : {})}
        />
      </span>
    );
  }

  return (
    <span
      className={`team-badge team-badge--${size} ${loaded ? "team-badge--fallback" : ""}`}
      style={{
        background: `linear-gradient(145deg, ${visual.primary}, ${visual.primary} 56%, ${visual.secondary} 57%, ${visual.secondary})`,
      }}
      aria-label={`${team} badge`}
    >
      <span>{visual.code}</span>
    </span>
  );
}
