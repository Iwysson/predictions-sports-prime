import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdSenseScript } from "@/components/ads";
import { ConsentIntegration } from "@/components/consent/ConsentIntegration";
import { I18nProvider } from "@/i18n/I18nProvider";
import { JsonLd } from "@/components/JsonLd";
import {
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import {
  absoluteUrl,
  siteConfig,
} from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  applicationName: siteConfig.name,

  keywords: [
    "football predictions",
    "football tips",
    "match predictions",
    "Premier League predictions",
    "La Liga predictions",
    "Bundesliga predictions",
    "Serie A predictions",
    "football match analysis",
  ],

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type: "website",
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: absoluteUrl("/og-default.png"),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },

  twitter: {
    card: siteConfig.twitterCard,
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    images: [absoluteUrl("/og-default.png")],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "sports",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071019",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdSenseScript />
        <ConsentIntegration />
        <JsonLd data={websiteJsonLd()} />
        <JsonLd data={organizationJsonLd()} />

        <I18nProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
