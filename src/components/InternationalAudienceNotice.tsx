import Link from "@/components/DocumentLink";

export const internationalNoticePath = "/international-audience-regulatory-notice/";

export function InternationalAudienceNotice() {
  return (
    <aside className="intl-notice" aria-label="International audience notice">
      <div className="container">
        <p>
          <strong>Important Notice:</strong> Predictions Sports Prime is an independent sports
          analysis and predictions website intended for an international audience. Our editorial
          content is not specifically directed at the Brazilian market. The website does not
          operate a betting platform, accept wagers or process betting transactions. Readers are
          responsible for complying with the laws and regulations applicable in their own
          jurisdiction.{" "}
          <Link href={internationalNoticePath} hrefLang="en">
            International Audience &amp; Regulatory Notice
          </Link>
        </p>
      </div>
    </aside>
  );
}
