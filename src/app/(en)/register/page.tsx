import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { BrazilAccessRestriction } from "@/components/BrazilAccessRestriction";
import { InternationalAudienceNotice } from "@/components/InternationalAudienceNotice";

// Account pages are functional, not search destinations: kept out of the index and sitemap.
export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Predictions Sports Prime account.",
  robots: { index: false, follow: false },
};

// Order: Brazil restriction, then the general International Audience notice, then the form.
// The general notice is rendered here only.
export default function RegisterPage() {
  return (
    <>
      <BrazilAccessRestriction variant="register" />
      <div className="register-notice">
        <InternationalAudienceNotice />
      </div>
      <RegisterForm />
    </>
  );
}
