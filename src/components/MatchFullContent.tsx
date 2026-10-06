// Presentational only (no hooks). Renders on the server for public parts and inside the
// VIP gate for protected parts. Labels arrive already translated.
type Sources = Array<{ name: string; url: string }>;

export function MatchFullContent({
  analysis,
  sources,
  comment,
  prediction,
  labels,
}: {
  analysis: string[];
  sources: Sources;
  comment: string | null;
  prediction?: { main: string; odds: number | null } | null;
  labels: { prediction: string; odds: string };
}) {
  return (
    <section className="match-full-content compact-analysis-copy">
      {prediction ? (
        <p>
          <strong>{labels.prediction}:</strong> {prediction.main}
          {prediction.odds !== null ? (
            <>
              {" · "}
              <strong>{labels.odds}:</strong> {prediction.odds.toFixed(2)}
            </>
          ) : null}
        </p>
      ) : null}
      {analysis.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {comment ? <p className="match-note">{comment}</p> : null}
      {sources.length ? (
        <ul className="match-sources">
          {sources.map((source) => (
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
