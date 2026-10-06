import { absoluteUrl } from "@/lib/site-config";

export const editorialAuthor = {
  name: "Iwysson Nascimento",
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
    "@type": "Person",
    name: editorialAuthor.name,
    url: editorialAuthorUrl(),
    "@id": editorialAuthorId(),
    jobTitle: "Football analysis author",
    worksFor: { "@id": absoluteUrl("/#organization") },
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
