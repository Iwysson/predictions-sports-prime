import { leagueSitemapPaths, serializeSitemapIndex } from "@/lib/sitemap-data";

export const dynamic = "force-static";

export async function GET() {
  const xml = serializeSitemapIndex([
    "/sitemap.xml",
    ...leagueSitemapPaths(),
  ]);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
