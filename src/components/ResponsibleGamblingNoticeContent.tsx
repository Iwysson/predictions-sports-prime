import Link from "next/link";
import type { ResponsibleGamblingCopy } from "@/lib/responsible-gambling-copy";

export function ResponsibleGamblingNoticeContent({ copy }: { copy: ResponsibleGamblingCopy }) {
  return (
    <aside className="responsible-gambling-notice" aria-labelledby="responsible-gambling-title">
      <div className="responsible-gambling-age" aria-hidden="true">18+</div>
      <div className="responsible-gambling-copy">
        <h2 id="responsible-gambling-title">{copy.title}</h2>
        <p>{copy.first}</p>
        <p>{copy.second}</p>
        <strong>{copy.closing}</strong>
      </div>
      <Link className="responsible-gambling-link" href="/responsible-gambling/" hrefLang="en">
        {copy.link} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
