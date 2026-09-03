import Link from "next/link";
import { SiteHeader } from "@/components/Header";
import { ResponsibleGamblingNoticeContent } from "@/components/ResponsibleGamblingNoticeContent";
import { responsibleCopyForSeoLocale } from "@/lib/responsible-gambling-copy";
import {
  localePath,
  seoLocaleSlugs,
  seoLocales,
  type SeoLocaleSlug,
} from "@/lib/seo-locales";

export function LocalizedHeader({ locale }: { locale: SeoLocaleSlug }) {
  const copy = seoLocales[locale];
  const homeHref = localePath(locale);
  const leaguesHref = localePath(locale, "/league/premier-league/");
  const nflHref = localePath(locale, "/nfl/");

  return (
    <SiteHeader
      localized
      brandName="Predictions Sports Prime"
      brandTagline={copy.homeH1}
      homeHref={homeHref}
      currentLocale={locale}
      navigationLabel="Primary navigation"
      mobileNavigationLabel="Mobile navigation"
      navItems={[
        { href: homeHref, label: copy.today },
        { href: leaguesHref, label: copy.leagues },
        { href: nflHref, label: "NFL" },
        { href: "/results/", label: copy.results, hrefLang: "en" },
        { href: "/methodology/", label: copy.methodology, hrefLang: "en" },
      ]}
    />
  );
}

export function LocalizedFooter({ locale }: { locale: SeoLocaleSlug }) {
  const copy = seoLocales[locale];

  return (
    <footer className="site-footer">
      <div className="container">
        <ResponsibleGamblingNoticeContent
          copy={responsibleCopyForSeoLocale(locale)}
        />
      </div>

      <div className="container footer-inner">
        <div>
          <strong>Predictions Sports Prime</strong>
          <p>{copy.responsible}</p>
        </div>

        <nav aria-label="Language versions">
          <Link href="/" hrefLang="en">
            English
          </Link>{" "}
          {seoLocaleSlugs.map((item) => (
            <Link
              key={item}
              href={localePath(item)}
              hrefLang={seoLocales[item].htmlLang}
            >
              {seoLocales[item].displayName}{" "}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
