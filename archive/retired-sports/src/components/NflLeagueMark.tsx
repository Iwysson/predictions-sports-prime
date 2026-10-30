export function NflLeagueMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`nfl-league-mark${compact ? " nfl-league-mark--compact" : ""}`}>
      <img src="/nfl/nfl-logo.png" alt="" width={compact ? 24 : 34} height={compact ? 24 : 34} />
      <span>NFL</span>
    </span>
  );
}
