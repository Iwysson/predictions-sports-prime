export function NhlLeagueMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`nhl-league-mark${compact ? " nhl-league-mark--compact" : ""}`}>
      <img src="/nhl/nhl-logo.svg" alt="" width={compact ? 24 : 34} height={compact ? 24 : 34} />
      <span>NHL</span>
    </span>
  );
}
