import { LegalPage } from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/legal-pages";
import { publicContactEmail, siteResponsibleName } from "@/lib/editorial-identity";

export const metadata = buildLegalMetadata(
  "Privacy Policy",
  "/privacy/",
  "Who is responsible for Predictions Sports Prime, how website and advertising data are handled, and how to exercise your privacy choices."
);

export default function PrivacyPage() {
  return (
    <LegalPage
      titleKey="privacy"
      intro="Last updated: 19 September 2026. This policy explains who is responsible for Predictions Sports Prime, what information is processed when you visit, and the choices available to you."
      sections={[
        {
          title: "Responsible person and privacy contact",
          content: <><p><strong>{siteResponsibleName}</strong> is responsible for Predictions Sports Prime and for the personal information handled by the site. He is an Electronic Engineering graduate of the Federal University of Pernambuco (UFPE), with postgraduate studies in progress in Software Architecture, Data Science and Cybersecurity.</p><p>For privacy questions or requests, email <a className="legal-link" href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>. You can also find this address on our <a className="legal-link" href="/contact/">Contact page</a>.</p></>,
        },
        {
          title: "Information collected and why",
          content: <><p>You do not need an account to read the site. Requests to our hosting and security infrastructure can include your IP address, browser and device information, requested URL, referring page and access time. These technical records support page delivery, troubleshooting, security and abuse prevention.</p><p>If you email us, we receive your email address, the contents of your message and any information you choose to include. We use these details to answer your enquiry, investigate corrections or handle your privacy request. Our contact mailbox uses Gmail, so Google processes the email as the email service provider. Please avoid sending passwords, payment details or unnecessary sensitive information.</p></>,
        },
        {
          title: "Browser storage and personal notes",
          content: <p>The site uses localStorage to remember your language selection and save personal notes you enter on match pages. These notes stay in that browser; the notes feature does not publish them or send them to a site account. Sports fixture data can also be cached locally to reduce repeated downloads. Language preferences and notes remain until you delete them or clear site data; fixture cache entries are refreshed when stale. You can delete individual notes using their Delete control. See our <a className="legal-link" href="/cookies/">Cookie Policy</a> for storage controls.</p>,
        },
        {
          title: "Hosting, sports data and development tools",
          content: <><p>Cloudflare provides hosting and delivery infrastructure and can process technical request data for delivery and security. Its practices are described in the <a className="legal-link" href="https://www.cloudflare.com/privacypolicy/">Cloudflare Privacy Policy</a>. The site uses football fixtures, results and statistical data from the sources identified in its content. Features that request sports data directly from an external provider, including ESPN, TheSportsDB or OpenFootball sources hosted on GitHub, disclose your IP address and normal request information to that provider as part of the connection.</p><p>ChatGPT is used as a support tool in work on the site. Development tools and sports statistics are distinct from visitor advertising data. The site does not embed a ChatGPT chat interface or automatically submit your personal notes to ChatGPT.</p></>,
        },
        {
          title: "Google advertising and other advertising providers",
          content: <><p>When Google AdSense advertising is active, Google and participating advertising providers may place or read cookies, use web beacons or pixels, and process IP addresses and browser or device identifiers. Ad requests can disclose the page URL, device and browser details, approximate location inferred from an IP address, and interactions with ads. Providers use this information to deliver and measure advertising, limit repeated ads, prevent fraud and, subject to consent and settings, personalize ads based on activity across sites.</p><p>These providers receive data through advertising requests and their own technologies. Disabling personalization does not necessarily stop all advertising-related processing: non-personalized ads can still involve measurement and fraud prevention. Consult the vendor information in the advertising consent interface for the providers and purposes presented to you.</p><p><strong><a className="legal-link" href="https://policies.google.com/technologies/partner-sites">How Google uses information from sites or apps that use its services</a></strong> explains Google’s collection and use of this data. Also see <a className="legal-link" href="https://policies.google.com/privacy">Google’s Privacy Policy</a> and <a className="legal-link" href="https://policies.google.com/technologies/ads">Google’s advertising technologies and retention information</a>.</p></>,
        },
        {
          title: "Advertising consent and your choices",
          content: <><p>Advertising consent starts denied. The site’s ad integration requires advertising to be enabled and a consent platform to report a valid consent choice before it loads Google ads. When the advertising consent interface is presented, use its controls to accept, reject or change the offered purposes and vendors, including withdrawing consent. Without the required consent signal, the site does not load its AdSense integration.</p><ul><li>Use <a className="legal-link" href="https://myadcenter.google.com/">Google My Ad Center</a> to manage Google ad personalization. This is separate from your consent choices on this site.</li><li>Use your browser’s privacy settings to block or delete cookies and clear site storage. Clearing site data also removes saved language preferences and personal notes.</li><li>Participating advertising companies offer additional controls through <a className="legal-link" href="https://www.aboutads.info/choices/">AdChoices</a> and <a className="legal-link" href="https://www.youronlinechoices.com/">Your Online Choices</a>.</li></ul><p>Privacy or incognito mode does not prevent a service from receiving your IP address when your browser connects to it.</p></>,
        },
        {
          title: "Retention, sharing and international processing",
          content: <p>Contact correspondence is retained as needed to handle the enquiry and related follow-up or legal obligations. Hosting, email and advertising providers apply their own retention periods to the information they process, as described in their policies. These services can process data outside your country. Information is shared as necessary to deliver the site, handle correspondence and provide the advertising described above, or when required by law. There is no single retention period covering every provider and storage technology.</p>,
        },
        {
          title: "Privacy requests and policy updates",
          content: <><p>Depending on the law applicable to you, you may request confirmation of processing, access, correction or deletion of personal information, information about sharing, or withdrawal of consent. Send requests to <a className="legal-link" href={`mailto:${publicContactEmail}`}>{publicContactEmail}</a>, describing the information or activity concerned. We may need proportionate information to verify the request. You may also raise concerns with the data protection authority responsible for your location.</p><p>Changes to our services or data practices will be reflected on this page with a revised update date. The date above identifies the current version.</p></>,
        },
      ]}
    />
  );
}
