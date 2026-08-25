import { absoluteUrl } from "@/lib/site-config";

export const editorialAuthor = {
  name: "Iwysson Nascimento",
  slug: "iwysson-nascimento",
  path: "/author/iwysson-nascimento/",
} as const;

export const publicContactEmail = "iwysson.wesklley1995@gmail.com";

export function editorialAuthorUrl() {
  return absoluteUrl(editorialAuthor.path);
}

export function editorialAuthorId() {
  return `${editorialAuthorUrl()}#person`;
}

export function editorialAuthorPersonJsonLd() {
  return {
    "@type": "Person",
    "@id": editorialAuthorId(),
    name: editorialAuthor.name,
    url: editorialAuthorUrl(),
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
