import { siteContactEmail } from "@/lib/editorial-identity";

// Discreet contact line placed under the H1 or intro of a page. Not a banner.
export function SiteContactLine({ className }: { className?: string }) {
  return (
    <p className={`site-contact-line${className ? ` ${className}` : ""}`}>
      Contact:{" "}
      <a href={`mailto:${siteContactEmail}`}>{siteContactEmail}</a>
    </p>
  );
}
