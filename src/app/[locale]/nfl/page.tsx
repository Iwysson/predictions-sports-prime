import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NFLPage } from "@/components/NFLPage";
import { getNFLCopy } from "@/lib/nfl-i18n";
import { localizedAlternates } from "@/lib/international-seo";
import { absoluteUrl } from "@/lib/site-config";
import { isSeoLocale, localePath, seoLocaleSlugs, seoLocales } from "@/lib/seo-locales";

export const dynamicParams = false;
export function generateStaticParams() { return seoLocaleSlugs.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isSeoLocale(locale)) return { robots: { index: false, follow: false } };
  const copy = getNFLCopy(locale); const url = absoluteUrl(localePath(locale, "/nfl/"));
  return { title: { absolute: copy.title }, description: copy.description, alternates: localizedAlternates(locale, "/nfl/"), robots: { index: true, follow: true }, openGraph: { type: "website", title: copy.title, description: copy.description, url, siteName: "Predictions Sports Prime", locale: seoLocales[locale].htmlLang, images: [{ url: absoluteUrl("/nfl/nfl-logo.png"), width: 500, height: 500, alt: "NFL" }] }, twitter: { card: "summary", title: copy.title, description: copy.description, images: [absoluteUrl("/nfl/nfl-logo.png")] } };
}

export default async function LocalizedNFL({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; if (!isSeoLocale(locale)) notFound(); return <NFLPage locale={locale} />;
}
