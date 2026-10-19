import Link from "@/components/DocumentLink";
import { leagues, leaguesBySlug } from "@/data/leagues";
import { MARKET_FAMILY_ORDER, marketFamily, oddsExplainerRows, type MarketFamily } from "@/lib/betting-markets";
import { intentHubInventory, type IntentHubSlug } from "@/lib/intent-hubs";
import { formatScopeDate } from "@/lib/results-scope";
import { matchPredictionAnchor } from "@/lib/seo-locales";
import type { MatchPreview } from "@/types";

/**
 * Static, crawlable board for each prediction hub. It is the initial HTML, so it must not depend on JavaScript
 * and must not claim a "today" that the build cannot know: it lists upcoming fixtures by date. After hydration
 * the interactive feed (IntentHubContent) takes over with the live day boundary.
 *
 * Each hub gets a different structure on purpose (competition directory, date board, pick board, market guide,
 * MLS board) so the five hubs are not five copies of one list. Premium picks and odds are never rendered here:
 * only the tier is public, and the pick text appears only for fixtures whose prediction is free.
 */

const dateLabel = (date: string) => (date ? formatScopeDate(date) : "Date to be confirmed");

function FixtureLink({ match }: { match: MatchPreview }) {
  return <Link href={`/match/${match.slug}/`}>{matchPredictionAnchor(match.homeTeam, match.awayTeam)}</Link>;
}

const isFreePick = (match: MatchPreview) => match.predictionAccess === "free" && Boolean(match.mainPrediction);

function pickLine(match: MatchPreview) {
  return <>{match.mainPrediction}{match.odds != null ? <> @ <b>{match.odds.toFixed(2)}</b></> : null}</>;
}

function tierLabel(match: MatchPreview) {
  return match.bestAnalysis ? "BEST BET" : "PRIME VIP";
}

function byDate(items: MatchPreview[]) {
  const groups = new Map<string, MatchPreview[]>();
  for (const item of items) groups.set(item.date, [...(groups.get(item.date) ?? []), item]);
  return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right));
}

function Wrap({ title, intro, children, id }: { title: string; intro?: string; children: React.ReactNode; id: string }) {
  return (
    <section className="section section--compact intent-directory" aria-labelledby={id} data-intent-directory="true">
      <div className="container">
        <h2 id={id}>{title}</h2>
        {intro ? <p>{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

function CompetitionDirectory({ entries }: { entries: MatchPreview[] }) {
  const groups = leagues
    .map((league) => ({ league, items: entries.filter((match) => match.league === league.slug) }))
    .filter((group) => group.items.length > 0);
  return (
    <Wrap id="directory-title" title="Football predictions by competition" intro="Every competition below has published pre-match predictions. Open a competition for its rounds, table and full list, or a fixture for the analysis.">
      <div className="intent-directory__grid">
        {groups.map(({ league, items }) => (
          <div key={league.slug}>
            <h3>{league.name} predictions <small>({items.length})</small></h3>
            <ul>
              {items.slice(0, 5).map((match) => (
                <li key={match.slug}><time dateTime={match.date}>{dateLabel(match.date)}</time> · <FixtureLink match={match} /></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Wrap>
  );
}

function DateBoard({ entries }: { entries: MatchPreview[] }) {
  const days = byDate(entries).slice(0, 3);
  return (
    <Wrap id="directory-title" title="Upcoming fixtures by date" intro="The next days with published predictions, each fixture with its kick-off time in the competition's local time. The live view above narrows this to the current day.">
      {days.map(([date, items]) => (
        <div key={date}>
          <h3><time dateTime={date}>{dateLabel(date)}</time></h3>
          <ul>
            {[...items].sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99")).map((match) => (
              <li key={match.slug}>{match.time ? `${match.time} local time` : "Time to be confirmed"} · {leaguesBySlug[match.league]?.name ?? match.league} · <FixtureLink match={match} /></li>
            ))}
          </ul>
        </div>
      ))}
    </Wrap>
  );
}

function PickBoard({ entries }: { entries: MatchPreview[] }) {
  const free = entries.filter(isFreePick);
  const premium = entries.filter((match) => !isFreePick(match));
  return (
    <Wrap id="directory-title" title="Pick board" intro="Free picks show the market and the published odds. Premium fixtures show only their tier; the selection stays on the protected match page.">
      <h3>Free picks ({free.length})</h3>
      {free.length ? (
        <ul>{free.map((match) => <li key={match.slug}><FixtureLink match={match} /> · {pickLine(match)}</li>)}</ul>
      ) : <p>No free pick is published for the upcoming fixtures at the moment.</p>}
      <h3>PRIME VIP and BEST BET fixtures ({premium.length})</h3>
      <ul>{premium.map((match) => <li key={match.slug}><FixtureLink match={match} /> · <b>{tierLabel(match)}</b></li>)}</ul>
    </Wrap>
  );
}

function MarketGuide({ entries }: { entries: MatchPreview[] }) {
  const free = entries.filter(isFreePick);
  const premiumCount = entries.length - free.length;
  const grouped = MARKET_FAMILY_ORDER
    .map((family) => ({ family, items: free.filter((match) => marketFamily(match.mainPrediction as string) === family) }))
    .filter((group): group is { family: MarketFamily; items: MatchPreview[] } => group.items.length > 0);
  const rows = oddsExplainerRows();
  return (
    <Wrap id="directory-title" title="Free selections by market" intro="Each free selection is grouped by the market it belongs to, with the published decimal odds.">
      {grouped.length ? grouped.map(({ family, items }) => (
        <div key={family}>
          <h3>{family} ({items.length})</h3>
          <ul>{items.map((match) => <li key={match.slug}><FixtureLink match={match} /> · {pickLine(match)}</li>)}</ul>
        </div>
      )) : <p>No free selection is published for the upcoming fixtures at the moment.</p>}
      {premiumCount > 0 ? <p>{premiumCount} further {premiumCount === 1 ? "fixture has" : "fixtures have"} a PRIME VIP selection that is not detailed here.</p> : null}
      <h3>Decimal, American and implied probability</h3>
      <table>
        <thead><tr><th>Decimal odds</th><th>American odds</th><th>Raw implied probability</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.decimal}><td>{row.decimal}</td><td>{row.american}</td><td>{row.implied}</td></tr>)}</tbody>
      </table>
      <p>Raw implied probability is 1 divided by the decimal odds. It is the price the market asks, not a forecast of the result.</p>
    </Wrap>
  );
}

function SoccerBoard({ entries }: { entries: MatchPreview[] }) {
  const mls = entries.filter((match) => match.league === "mls");
  const others = entries.filter((match) => match.league !== "mls");
  return (
    <Wrap id="directory-title" title="MLS matches by date" intro="Upcoming Major League Soccer matches with published predictions, followed by other competitions.">
      {mls.length ? byDate(mls).map(([date, items]) => (
        <div key={date}>
          <h3><time dateTime={date}>{dateLabel(date)}</time></h3>
          <ul>{items.map((match) => <li key={match.slug}><FixtureLink match={match} /></li>)}</ul>
        </div>
      )) : <p>No MLS match with a published prediction is scheduled at the moment.</p>}
      {others.length ? (
        <>
          <h3>Other soccer competitions</h3>
          <ul>{others.slice(0, 10).map((match) => (
            <li key={match.slug}>{leaguesBySlug[match.league]?.name ?? match.league} · <FixtureLink match={match} /></li>
          ))}</ul>
        </>
      ) : null}
    </Wrap>
  );
}

export function IntentHubDirectory({ slug, matches, now = new Date() }: { slug: IntentHubSlug; matches: MatchPreview[]; now?: Date }) {
  const entries = intentHubInventory(matches, now);
  switch (slug) {
    case "football-predictions": return <CompetitionDirectory entries={entries} />;
    case "today-predictions": return <DateBoard entries={entries} />;
    case "picks": return <PickBoard entries={entries} />;
    case "betting-tips": return <MarketGuide entries={entries} />;
    case "soccer-predictions": return <SoccerBoard entries={entries} />;
  }
}
