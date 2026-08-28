import Link from "next/link";
import { seoLocaleSlugs, seoLocales, type SeoLocaleSlug } from "@/lib/seo-locales";

export function LocalizedHeader({ locale }: { locale: SeoLocaleSlug }) {
  const copy = seoLocales[locale];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href={`/${locale}/`}>
          <span className="brand-mark">PSP</span>
          <span><strong>Predictions Sports Prime</strong><small>{copy.homeH1}</small></span>
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <Link href={`/${locale}/`}>{copy.today}</Link>
          <Link href={`/${locale}/league/premier-league/`}>{copy.leagues}</Link>
          <Link href={`/${locale}/nfl/`}>NFL</Link>
          <Link href="/methodology/" hrefLang="en">{copy.methodology}</Link>
          <Link href="/results/" hrefLang="en">{copy.results}</Link>
        </nav>
      </div>
    </header>
  );
}

export function LocalizedFooter({ locale }: { locale: SeoLocaleSlug }) {
  const copy = seoLocales[locale];
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div><strong>Predictions Sports Prime</strong><p>{copy.responsible}</p></div>
        <nav aria-label="Language versions">
          <Link href="/" hrefLang="en">English</Link>{" "}
          {seoLocaleSlugs.map((item) => (
            <Link key={item} href={`/${item}/`} hrefLang={seoLocales[item].htmlLang}>{seoLocales[item].displayName}{" "}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
