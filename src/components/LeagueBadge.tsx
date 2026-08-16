"use client";

import { useEffect, useState } from "react";
import { fetchLeagueBadge } from "@/lib/artwork";

export function LeagueBadge({
  slug,
  short,
  size = "md",
}: {
  slug: string;
  short: string;
  size?: "sm" | "md";
}) {
  const [badge, setBadge] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchLeagueBadge(slug).then((url) => {
      if (!cancelled) {
        setBadge(url);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (badge) {
    return (
      <span className={`league-logo league-logo--${size}`}>
        <img
          src={badge}
          alt={`${short} logo`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setBadge(null)}
        />
      </span>
    );
  }

  return (
    <span className={`mini-league-badge mini-league-badge--${size}`}>
      {short}
    </span>
  );
}
