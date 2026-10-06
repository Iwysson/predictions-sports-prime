import type { FullMatchView } from "@/lib/match-access";

// Presentational only (no hooks). Renders on the server for FREE content and inside
// the VIP gate for protected content. Labels arrive already translated.
export function MatchFullContent({ full, labels }: { full: FullMatchView; labels: { prediction: string; odds: string } }) {
  return (
    <section className="match-full-content">
      <p>
        <strong>{labels.prediction}:</strong> {full.picks.main}
        {full.picks.odds !== null ? (
          <>
            {" · "}
            <strong>{labels.odds}:</strong> {full.picks.odds.toFixed(2)}
          </>
        ) : null}
      </p>
      {full.analysis.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {full.comment ? <p className="match-note">{full.comment}</p> : null}
      {full.sources.length ? (
        <ul className="match-sources">
          {full.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} rel="nofollow noopener" target="_blank">
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
