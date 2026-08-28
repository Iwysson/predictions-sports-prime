"use client";

import { useState } from "react";
import { NFL_DIVISIONS } from "@/data/nfl/teams";
import { nflStandingsCopies, playoffStatusLabel } from "@/lib/nfl-standings-i18n";
import type { SeoLocale } from "@/lib/seo-locales";
import type { NFLConference, NFLDivision, NFLStanding } from "@/types/nfl";

function pct(value = 0) { return value.toFixed(3).replace(/^0/, ""); }
function diff(value = 0) { return value > 0 ? `+${value}` : String(value); }

export function NFLPlayoffLegend({ locale }: { locale: SeoLocale }) {
  const copy = nflStandingsCopies[locale];
  return <div className="nfl-playoff-legend" aria-label="Playoff status legend">
    <span className="status-clinched">● {copy.divisionLeader}</span><span className="status-playoff">● {copy.wildCard}</span><span className="status-hunt">● {copy.inTheHunt}</span><span className="status-eliminated">● {copy.eliminated}</span>
  </div>;
}

export function NFLDivisionStandings({ division, rows, locale }: { division: NFLDivision; rows: NFLStanding[]; locale: SeoLocale }) {
  const copy = nflStandingsCopies[locale];
  return <section className="nfl-division"><h3>{division} Standings</h3><div className="nfl-standings-table" role="table" aria-label={`${division} Standings`}>
    <div className="nfl-standing-row nfl-standing-row--head" role="row"><span role="columnheader">#</span><span role="columnheader">{copy.team}</span><abbr title={copy.wins}>W</abbr><abbr title={copy.losses}>L</abbr><abbr title={copy.ties}>T</abbr><abbr title={copy.winPct}>PCT</abbr><abbr title={copy.pointsFor}>PF</abbr><abbr title={copy.pointsAgainst}>PA</abbr><abbr title={copy.differential}>DIFF</abbr><abbr title={copy.streak}>STRK</abbr></div>
    {rows.map((row) => <div className={`nfl-standing-row status-${row.playoffStatus}`} role="row" key={row.id}>
      <span className="nfl-standing-rank" role="cell">{row.divisionRank ?? "—"}</span><span className="nfl-standing-team" role="cell"><img src={row.logo} width="30" height="30" alt="" loading="lazy" /><span><strong>{row.name}</strong>{row.playoffStatus !== "none" ? <small>{playoffStatusLabel(row.playoffStatus, copy)}</small> : null}<small className="nfl-standing-mobile-stats">PF {row.pointsFor ?? "—"} · PA {row.pointsAgainst ?? "—"} · {diff(row.pointDifferential)}</small></span></span>
      <span role="cell" data-label="W">{row.wins}</span><span role="cell" data-label="L">{row.losses}</span><span role="cell" data-label="T">{row.ties}</span><span role="cell" data-label="PCT">{pct(row.winPct)}</span><span role="cell" data-label="PF">{row.pointsFor ?? "—"}</span><span role="cell" data-label="PA">{row.pointsAgainst ?? "—"}</span><span role="cell" data-label="DIFF">{diff(row.pointDifferential)}</span><span role="cell" data-label="STRK">{row.streak ?? "—"}</span>
    </div>)}
  </div></section>;
}

export function NFLConferenceStandings({ conference, standings, locale }: { conference: NFLConference; standings: NFLStanding[]; locale: SeoLocale }) {
  return <div className="nfl-conference"><h2 className="sr-only">{conference} Standings</h2>{NFL_DIVISIONS[conference].map((division) => <NFLDivisionStandings key={division} division={division} rows={standings.filter((row) => row.division === division).sort((a, b) => (a.divisionRank ?? 99) - (b.divisionRank ?? 99) || a.name.localeCompare(b.name))} locale={locale} />)}</div>;
}

export function NFLPlayoffPicture({ standings, locale }: { standings: NFLStanding[]; locale: SeoLocale }) {
  const copy = nflStandingsCopies[locale];
  if (!standings.some((row) => row.conferenceRank && row.wins + row.losses + row.ties >= 8)) return null;
  return <section className="nfl-playoff-picture"><h2>{copy.playoffPicture}</h2><div>{(["AFC", "NFC"] as const).map((conference) => <section key={conference}><h3>{conference}</h3><ol>{standings.filter((row) => row.conference === conference && row.conferenceRank && row.conferenceRank <= 10).sort((a, b) => a.conferenceRank! - b.conferenceRank!).map((row) => <li key={row.id}><img src={row.logo} width="24" height="24" alt="" /><span>{row.name}</span><small>{playoffStatusLabel(row.playoffStatus, copy)}</small></li>)}</ol></section>)}</div></section>;
}

export function NFLStandings({ standings, generatedAt, seasonPhase, locale }: { standings: NFLStanding[]; generatedAt: string; seasonPhase: string; locale: SeoLocale }) {
  const [conference, setConference] = useState<NFLConference>("AFC"); const copy = nflStandingsCopies[locale];
  const updated = new Intl.DateTimeFormat(locale === "en" ? "en-US" : locale, { dateStyle: "medium", timeStyle: "short", timeZone: "America/Fortaleza" }).format(new Date(generatedAt));
  return <section className="nfl-standings" aria-labelledby="nfl-standings-title"><div className="nfl-standings__heading"><div><h2 id="nfl-standings-title">{copy.title}</h2><p>{copy.intro}</p></div><p className="nfl-standings__updated"><strong>{copy.lastUpdated}</strong><time dateTime={generatedAt}>{updated}</time></p></div>
    {seasonPhase === "preseason" ? <p className="nfl-standings__notice">{copy.preseason}</p> : <NFLPlayoffLegend locale={locale} />}
    <div className="nfl-conference-tabs" role="tablist" aria-label={copy.conference}>{(["AFC", "NFC"] as const).map((item) => <button role="tab" aria-selected={conference === item} aria-controls={`nfl-${item.toLowerCase()}-standings`} id={`nfl-${item.toLowerCase()}-tab`} onClick={() => setConference(item)} key={item}>{item}</button>)}</div>
    {(["AFC", "NFC"] as const).map((item) => <div role="tabpanel" id={`nfl-${item.toLowerCase()}-standings`} aria-labelledby={`nfl-${item.toLowerCase()}-tab`} hidden={conference !== item} key={item}><NFLConferenceStandings conference={item} standings={standings} locale={locale} /></div>)}
    <NFLPlayoffPicture standings={standings} locale={locale} />
  </section>;
}
