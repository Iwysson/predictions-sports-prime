import { leagueSitemapEntries, serializeSitemapIndex } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export async function GET() {
  const xml = serializeSitemapIndex([
    "/sitemap.xml",
    "/sitemaps/upcoming-matches/sitemap.xml",
    ...leagueSitemapEntries(),
  ]);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
