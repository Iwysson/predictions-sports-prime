import { TeamBadge } from "@/components/TeamBadge";

export function NhlLeagueMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`nhl-league-mark${compact ? " nhl-league-mark--compact" : ""}`}>
      <img src="/nhl/nhl-logo.svg" alt="" width={compact ? 24 : 34} height={compact ? 24 : 34} />
      <span>NHL</span>
    </span>
  );
}

export function NhlBestMultiple({ headingId = "nhl-best-multiple-title" }: { headingId?: string }) {
  return (
    <article className="home-best-multiple">
      <div className="home-best-multiple__head">
        <div>
          <NhlLeagueMark />
          <h2 id={headingId}>NHL BEST MULTIPLE TODAY</h2>
        </div>
        <span className="psp-badge psp-badge--free">FREE MULTIPLE</span>
      </div>
      <div className="home-best-multiple__legs">
        <div>
          <span className="home-best-multiple__fixture">
            <TeamBadge team="New Jersey Devils" size="sm" />
            <span>New Jersey Devils vs Utah Mammoth</span>
            <TeamBadge team="Utah Mammoth" size="sm" />
          </span>
          <strong>New Jersey Devils to win</strong>
        </div>
        <b aria-hidden="true">+</b>
        <div>
          <span className="home-best-multiple__fixture">
            <TeamBadge team="Detroit Red Wings" size="sm" />
            <span>Detroit Red Wings vs Ottawa Senators</span>
            <TeamBadge team="Ottawa Senators" size="sm" />
          </span>
          <strong>Over 5.5 Goals</strong>
        </div>
      </div>
      <p>
        This editorial multiple is FREE and does not change either game&apos;s individual access level. No combined
        official odds are stated.
      </p>
    </article>
  );
}
