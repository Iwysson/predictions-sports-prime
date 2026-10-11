"use client";

import Link from "@/components/DocumentLink";
import { supabase } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/site-config";
import { type FormEvent, useState } from "react";
import { AuthCard } from "./AuthCard";

// Never reveals whether an email is registered: the same confirmation message is shown whether
// resetPasswordForEmail succeeds or fails, so this flow cannot be used to enumerate accounts.
const GENERIC_MESSAGE =
  "If an account exists for this email, a password reset link has been sent.";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: absoluteUrl("/reset-password/"),
      });
    } catch {
      // Intentionally ignored: the response is identical whether the request succeeded,
      // failed, or the email does not exist. Nothing about account existence is revealed.
    }

    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard title="Check your email" intro={GENERIC_MESSAGE}>
        <p className="auth-switch">
          <Link href="/login/">Back to Login</Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      intro="Enter the email linked to your account and we'll send you a reset link."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="forgot-email">Email</label>
        <input autoComplete="email" id="forgot-email" name="email" required type="email" />

        <button className="button" disabled={submitting} type="submit">
          {submitting ? "Sending…" : "Send reset link"}
        </button>
      </form>

      <p className="auth-switch">
        Remembered it? <Link href="/login/">Back to Login</Link>
      </p>
    </AuthCard>
  );
}
