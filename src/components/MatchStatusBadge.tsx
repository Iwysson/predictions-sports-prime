import type { MatchStatus } from "@/lib/nhl-live";

// Live state only, kept apart from the access badge. Renders nothing unless a provider confirms
// the match is live. The text LIVE is always present; the red dot is decorative.
export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  if (status !== "live") return null;
  return (
    <span className="match-status-badge" role="status" aria-label="Match live">
      <span className="match-status-badge__dot" aria-hidden="true" />
      LIVE
    </span>
  );
}
