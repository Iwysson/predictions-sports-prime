// Presentational only (no hooks). Renders on the server for public parts and inside the
// VIP gate for protected parts. Labels arrive already translated.
type Sources = Array<{ name: string; url: string }>;

export function MatchFullContent({
  analysis,
  sources,
  comment,
  prediction,
  labels,
  heading,
}: {
  analysis: string[];
  sources: Sources;
  comment: string | null;
  prediction?: { main: string; odds: number | null } | null;
  labels: { prediction: string; odds: string; analysis?: string; sources?: string };
  heading?: string;
}) {
  return (
    <div className="psp-analysis-block">
      {prediction ? (
        <div className="psp-pick">
          <div>
            <div className="psp-pick__label">{labels.prediction}</div>
            <div className="psp-pick__value">{prediction.main}</div>
          </div>
          {prediction.odds !== null ? (
            <div className="psp-pick__odds">
              <span className="psp-pick__label">{labels.odds}</span>
              <strong>{prediction.odds.toFixed(2)}</strong>
            </div>
          ) : null}
        </div>
      ) : null}
      {analysis.length ? (
        <section className="psp-analysis compact-analysis-copy match-full-content">
          <h3>{heading ?? labels.analysis ?? "Analysis"}</h3>
          {analysis.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          {comment ? <p className="match-note">{comment}</p> : null}
        </section>
      ) : null}
      {sources.length ? (
        <section className="psp-sources-block">
          <h3 className="psp-analysis-heading">{labels.sources ?? "Sources"}</h3>
          <ul className="psp-sources">
            {sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} rel="nofollow noopener" target="_blank">
                  {source.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
