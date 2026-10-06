import { absoluteUrl } from "@/lib/site-config";

// Analyses are signed by the editorial team, not an individual. The path is kept so existing URLs stay stable.
export const editorialAuthor = {
  name: "Predictions Sports Prime Team",
  slug: "iwysson-nascimento",
  path: "/author/iwysson-nascimento/",
} as const;

// Official site contact, used by /contact/, /privacy/ and SiteContactLine.
export const publicContactEmail = "predictionssportsprime@gmail.com";
export const siteContactEmail = publicContactEmail;

export const siteResponsibleName = "Iwysson Wesklley Francisco do Nascimento";

export function editorialAuthorUrl() {
  return absoluteUrl(editorialAuthor.path);
}

export function editorialAuthorId() {
  return `${editorialAuthorUrl()}#person`;
}

export function editorialAuthorPersonJsonLd() {
  return {
    "@type": "Organization",
    name: "Predictions Sports Prime",
    url: absoluteUrl("/"),
    "@id": editorialAuthorId(),
    description: "Editorial team behind the Predictions Sports Prime football analyses.",
  };
}

export function editorialAuthorProfileJsonLd() {
  const url = editorialAuthorUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#webpage`,
    name: `${editorialAuthor.name} — Author`,
    url,
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: editorialAuthorPersonJsonLd(),
  };
}
