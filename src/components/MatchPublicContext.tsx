import { EditorialAnalysis } from "@/components/EditorialAnalysis";
import { HideForVip } from "@/components/HideForVip";
import type { PublicMatchContext } from "@/lib/match-public-context";

// Public, pick-neutral facts for a page whose analysis is PRIME VIP. Server-rendered; never contains
// the selection, the odds or the premium analysis (see src/lib/match-public-context.ts).
export function MatchPublicContext({ context, homeTeam, awayTeam }: { context: PublicMatchContext; homeTeam: string; awayTeam: string }) {
  const { summary, availability, statisticalCore, sources } = context;
  return (
    <HideForVip>
      <section className="psp-public-context compact-analysis-copy" aria-labelledby="psp-public-context-title" data-public-match-context="true">
        <h2 id="psp-public-context-title">{homeTeam} vs {awayTeam}: match context</h2>
        <p className="psp-public-context__note">Facts and data published for every reader. The prediction, the odds and the full analysis are reserved for PRIME VIP.</p>
        {summary.length ? (
          <>
            <h3>Matchup overview</h3>
            {summary.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </>
        ) : null}
        {availability ? (
          <>
            <h3>Team news and availability</h3>
            {availability.kind === "reported" ? (
              <EditorialAnalysis analysis={[availability.markdown]} format="markdown" stripStatisticalCore={false} />
            ) : (
              <p>No sufficiently reliable team-news report or projected lineup was available for either side when this page was published. Absences and starters are not assumed; the official teamsheets remain the authority near kick-off.</p>
            )}
          </>
        ) : null}
        {statisticalCore ? (
          <>
            <h3>Statistical Core Predictions-Sports-Prime</h3>
            <EditorialAnalysis analysis={[statisticalCore.markdown]} format="markdown" stripStatisticalCore={false} />
          </>
        ) : null}
        {sources.length ? (
          <>
            <h3>Sources</h3>
            <ul className="psp-sources">
              {sources.map((source) => (
                <li key={source.url}><a href={source.url} rel="nofollow noopener" target="_blank">{source.name}</a></li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </HideForVip>
  );
}
