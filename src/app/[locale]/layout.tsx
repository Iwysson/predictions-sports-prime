import type { Metadata, Viewport } from "next";
import "../globals.css";
import { notFound } from "next/navigation";
import { AdSenseScript } from "@/components/ads";
import { ConsentIntegration } from "@/components/consent/ConsentIntegration";
import { JsonLd } from "@/components/JsonLd";
import { I18nProvider } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/dictionaries";
import { LocalizedFooter, LocalizedHeader } from "@/components/LocalizedSiteChrome";
import { organizationJsonLd } from "@/lib/seo";
import { localizedWebsiteJsonLd } from "@/lib/international-seo";
import { isSeoLocale, seoLocaleSlugs, seoLocales } from "@/lib/seo-locales";
import { siteConfig } from "@/lib/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return seoLocaleSlugs.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  robots: { index: true, follow: true },
  other: { "google-adsense-account": "ca-pub-2602332152030838" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, themeColor: "#071019", colorScheme: "dark",
};

function dictionaryLocale(locale: string): Locale {
  return (locale === "pt-br" ? "pt-BR" : locale) as Locale;
}

export default async function LocalizedRootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isSeoLocale(locale)) notFound();
  const copy = seoLocales[locale];
  return (
    <html lang={copy.htmlLang} suppressHydrationWarning>
      <head><AdSenseScript /></head>
      <body>
        <ConsentIntegration />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={localizedWebsiteJsonLd(locale)} />
        <I18nProvider initialLocale={dictionaryLocale(locale)}>
          <LocalizedHeader locale={locale} />
          <main>{children}</main>
          <LocalizedFooter locale={locale} />
        </I18nProvider>
      </body>
    </html>
  );
}
