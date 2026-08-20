import type { EditorialSource } from "@/types";

export function ArticleSources({ sources }: { sources?: EditorialSource[] }) {
  if (!sources?.length) return null;

  return (
    <section className="article-sources" aria-labelledby="article-sources-heading">
      <h2 id="article-sources-heading">Sources &amp; Data</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.url}>
            <a href={source.url}>{source.name}</a>
            {source.description ? <span>{source.description}</span> : null}
            {source.accessedAt ? <small>Accessed {source.accessedAt.slice(0, 10)}</small> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
