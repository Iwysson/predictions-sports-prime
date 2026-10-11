import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";

export const metadata = buildLegalMetadata(
  "Cookie Policy",
  "/cookies/",
  "Cookie and local storage policy for Predictions Sports Prime."
);

export default function CookiesPage() {
  return (
    <LegalPage
      titleKey="cookies"
      intro="Last updated: 11 October 2026. This page explains browser storage, advertising cookies and the controls available to you."
      sections={[
        { title: "Language preference", content: <p>The site uses localStorage, rather than an account, to remember the language you select.</p> },
        { title: "Personal notes and fixture cache", content: <p>Personal match notes are saved only in your browser’s localStorage. Delete individual notes with their Delete control or clear site data to remove all notes and your language preference. Fixture data can also be cached in localStorage and refreshed when stale.</p> },
        { title: "Necessary technologies", content: <p>Hosting and security services may use necessary cookies or similar technologies to provide, secure and optimize delivery of the site.</p> },
        { title: "Analytics cookies", content: <><p>Google Analytics 4 measures site usage. The Google tag (gtag.js) can load when a page opens, before you make a choice in the analytics banner, and it is configured with Google Consent Mode. Analytics storage starts denied. While it is denied, the tag does not set persistent analytics cookies or store a visitor identifier in your browser, but it can still send cookieless measurement pings to Google. As with any request, a ping can carry standard technical details such as the page address, referrer, browser and device information and your IP address, and Google may use these signals for aggregated or modelled measurement.</p><p>Persistent analytics cookies are used only after you choose Accept analytics in the banner, which updates analytics storage to granted. Your choice is stored in your browser’s localStorage (psp-analytics-consent) and can be changed at any time with the Analytics preferences button. Choosing Decline, or withdrawing consent later, keeps analytics storage denied and stops new analytics cookies from being set; it does not prevent the cookieless pings described above. Advertising consent is managed separately.</p></> },
        { title: "Advertising cookies", content: <p>Advertising consent starts denied. The site loads its Google AdSense integration only when advertising is enabled and the consent platform reports the required consent. When ads are active, Google and participating providers may set or read cookies and use web beacons, IP addresses and other identifiers to deliver and measure ads, prevent fraud and personalize advertising subject to your choices. Read <a className="legal-link" href="https://policies.google.com/technologies/partner-sites">how Google uses data on partner sites</a>.</p> },
        { title: "Managing preferences", content: <p>Use the advertising consent interface, when presented, to reject or change the offered choices and withdraw consent. You can block or delete cookies and clear localStorage in your browser settings. <a className="legal-link" href="https://myadcenter.google.com/">Google My Ad Center</a> provides separate ad-personalization controls. Our <a className="legal-link" href="/privacy/">Privacy Policy</a> identifies the responsible person, privacy contact, providers and further options.</p> },
      ]}
    />
  );
}
