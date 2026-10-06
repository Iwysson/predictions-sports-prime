"use client";

import { useAuth } from "@/auth/AuthProvider";
import Link from "@/components/DocumentLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "./AuthCard";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";

export function AccountPanel() {
  const router = useRouter();
  const {
    user,
    profile,
    isAuthenticated,
    isVip,
    loading,
    profileError,
    signOut,
  } = useAuth();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError(null);

    try {
      await signOut();
      router.push("/login/");
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to log out."
      );
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <AuthCard title="My Account" intro="Loading your account…">
        <p className="auth-message" role="status">
          Checking your session and profile.
        </p>
      </AuthCard>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <AuthCard
        title="My Account"
        intro="You need to log in to view your account."
      >
        <Link className="button auth-primary-action" href="/login/">
          Login
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="My Account"
      intro="Your account and subscription information."
    >
      <dl className="account-details">
        <div>
          <dt>Email</dt>
          <dd>{user.email ?? "Unavailable"}</dd>
        </div>
        <div>
          <dt>Plan</dt>
          <dd>{isVip ? "vip" : "free"}</dd>
        </div>
        <div>
          <dt>Subscription status</dt>
          <dd>{profile?.subscription_status ?? "Unavailable"}</dd>
        </div>
      </dl>

      {profileError ? (
        <p className="auth-message auth-message--warning" role="status">
          The profile could not be fully loaded: {profileError}
        </p>
      ) : null}

      {logoutError ? (
        <p className="auth-message auth-message--error" role="alert">
          {logoutError}
        </p>
      ) : null}

      <VipCheckoutButton />

      <button
        className="button auth-logout-button"
        disabled={loggingOut}
        onClick={handleLogout}
        type="button"
      >
        {loggingOut ? "Logging out…" : "Logout"}
      </button>
    </AuthCard>
  );
}
