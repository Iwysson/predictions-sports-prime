"use client";

import Link from "@/components/DocumentLink";
import { supabase } from "@/lib/supabase";
import { type FormEvent, useEffect, useState } from "react";
import { AuthCard } from "./AuthCard";

type Stage = "checking" | "ready" | "expired" | "success";

// Supabase's recovery link puts the session in the URL (detectSessionInUrl: true on the client
// picks it up automatically). A PASSWORD_RECOVERY auth event, or an already-present session,
// both mean the link was valid; anything else after the check settles means it was missing,
// already used or expired, and the form must not be shown (fail closed, never a blank form that
// silently fails on submit).
export function ResetPasswordForm() {
  const [stage, setStage] = useState<Stage>("checking");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        settled = true;
        setStage("ready");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (settled) return;
      settled = true;
      setStage(data.session ? "ready" : "expired");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setStage("success");
  }

  if (stage === "checking") {
    return (
      <AuthCard title="Reset password" intro="Checking your reset link…">
        <p className="auth-message" role="status">
          One moment.
        </p>
      </AuthCard>
    );
  }

  if (stage === "expired") {
    return (
      <AuthCard
        title="Reset link expired"
        intro="This password reset link is invalid or has expired."
      >
        <p className="auth-switch">
          <Link href="/forgot-password/">Request a new link</Link>
        </p>
      </AuthCard>
    );
  }

  if (stage === "success") {
    return (
      <AuthCard title="Password updated" intro="Your password has been changed successfully.">
        <p className="auth-switch">
          <Link href="/account/">Go to My Account</Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Reset password" intro="Choose a new password for your account.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="reset-password">New password</label>
        <input
          autoComplete="new-password"
          id="reset-password"
          minLength={8}
          name="password"
          required
          type="password"
        />

        <label htmlFor="reset-confirm-password">Confirm new password</label>
        <input
          autoComplete="new-password"
          id="reset-confirm-password"
          minLength={8}
          name="confirmPassword"
          required
          type="password"
        />

        {error ? (
          <p className="auth-message auth-message--error" role="alert">
            {error}
          </p>
        ) : null}

        <button className="button" disabled={submitting} type="submit">
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
