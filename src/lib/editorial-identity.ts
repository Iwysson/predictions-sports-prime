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

export function editorialAuthorPersonJsonLd() {
  return {
    "@type": "Person",
    name: editorialAuthor.name,
    url: editorialAuthorUrl(),
  };
}

export function editorialAuthorProfileJsonLd() {
  const url = editorialAuthorUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${editorialAuthor.name} — Author`,
    url,
    mainEntity: editorialAuthorPersonJsonLd(),
  };
}
