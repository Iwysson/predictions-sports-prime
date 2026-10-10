"use client";

import { useAuth } from "@/auth/AuthProvider";
import Link from "@/components/DocumentLink";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "./AuthCard";
import { VipCheckoutButton } from "@/components/VipCheckoutButton";
import { supabase } from "@/lib/supabase";

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
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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

  // Required so there is a reachable web URL for account deletion requests (Google Play
  // Data Safety policy), in addition to the Android app's own Delete Account screen.
  // Does not cancel a Google Play or Whop subscription - billing continues at the store
  // until the user cancels it there.
  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError(null);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Your session has expired. Please log in again.");
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unable to delete your account right now.");
      await signOut();
      router.push("/");
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Unable to delete your account right now.");
      setDeleting(false);
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

      {deleteError ? (
        <p className="auth-message auth-message--error" role="alert">
          {deleteError}
        </p>
      ) : null}

      {confirmingDelete ? (
        <>
          <p className="auth-message auth-message--warning" role="alert">
            This permanently deletes your account and data and cannot be undone. It does
            not cancel a Google Play or Whop subscription - cancel that separately at the
            store if you do not want to keep being billed.
          </p>
          <button
            className="button auth-logout-button"
            disabled={deleting}
            onClick={handleDeleteAccount}
            type="button"
          >
            {deleting ? "Deleting…" : "Confirm account deletion"}
          </button>
          <button
            className="button auth-logout-button"
            disabled={deleting}
            onClick={() => setConfirmingDelete(false)}
            type="button"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          className="button auth-logout-button"
          onClick={() => setConfirmingDelete(true)}
          type="button"
        >
          Delete Account
        </button>
      )}
    </AuthCard>
  );
}
