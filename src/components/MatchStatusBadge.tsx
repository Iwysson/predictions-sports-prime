// Live state only, kept apart from the access badge. `text` comes from liveBadgeText(), so it is
// null unless the provider confirmed the game is live. The word LIVE is always present; the dot is decorative.
export function MatchStatusBadge({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <span className="match-status-badge" role="status" aria-label="Match live">
      <span className="match-status-badge__dot" aria-hidden="true" />
      {text}
    </span>
  );
}
