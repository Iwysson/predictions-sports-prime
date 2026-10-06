import Link from "@/components/DocumentLink";
import { internationalNoticePath } from "@/components/InternationalAudienceNotice";

// Access restriction shown above the account forms. Copy is limited to the regulatory
// risk wording approved for the site; no statute, article or penalty is cited.
export function BrazilAccessRestriction({ variant }: { variant: "login" | "register" }) {
  const isRegister = variant === "register";
  return (
    <aside className="brazil-access-restriction" aria-labelledby="brazil-access-restriction-title">
      <div className="container">
        <strong className="brazil-access-restriction__title" id="brazil-access-restriction-title">
          BRAZIL ACCESS RESTRICTION
        </strong>
        <p>
          Predictions Sports Prime is intended for an international audience and is not offered to users located in Brazil.
        </p>
        <p>
          {isRegister
            ? "If you are located in Brazil, do not create an account or subscribe to PRIME VIP."
            : "If you are located in Brazil, do not sign in, register or subscribe to PRIME VIP."}
        </p>
        <p>
          {isRegister
            ? "Attempting to register or use restricted services from Brazil may create regulatory and compliance risks for both you and Predictions Sports Prime."
            : "Use of the service from a restricted jurisdiction may create regulatory and compliance risks for both the user and Predictions Sports Prime."}
        </p>
        <p>
          Please {isRegister ? "use this service" : "access the service"} only where {isRegister ? "access to sports prediction and related content is" : "sports prediction and related content is"} legally permitted.
        </p>
        <p className="brazil-access-restriction__link">
          <Link href={internationalNoticePath} hrefLang="en">International Audience &amp; Regulatory Notice</Link>
        </p>
      </div>
    </aside>
  );
}
