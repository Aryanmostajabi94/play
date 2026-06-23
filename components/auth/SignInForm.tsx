"use client";

import { useState } from "react";
import Link from "next/link";
import {
  signInAction,
  signInWithGoogleAction,
  signInWithAppleAction,
  signInWithFacebookAction,
} from "../../app/actions/auth";

const PROVIDER_LABEL: Record<string, string> = {
  google_not_configured: "Google",
  apple_not_configured: "Apple",
  facebook_not_configured: "Facebook",
};

const oauthButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px",
  borderRadius: 12,
  background: "transparent",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "var(--text-primary)",
  fontWeight: 700,
  fontSize: 14,
  marginBottom: 10,
};

// A4 — Sign In. Email + password + Google/Apple/Facebook OAuth, per
// Screen Inventory. All three buttons are wired end-to-end on the code
// side; each only works once the matching provider is switched on in the
// Supabase dashboard (Authentication > Providers) with that provider's
// own OAuth credentials — see app/actions/auth.ts for the same caveat,
// structurally identical to the Stripe-test-keys situation on D1. None
// of the three are configured yet, so right now all three bounce back
// here with an error banner instead of actually signing in.
export default function SignInForm({ providerError }: { providerError?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const res = await signInAction(formData);
    setPending(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
    }
    // On success signInAction already redirected.
  }

  const notConfiguredLabel = providerError ? PROVIDER_LABEL[providerError] : undefined;

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required className="input-el" style={{ marginBottom: 10 }} />
      <input name="password" type="password" placeholder="Password" required className="input-el" style={{ marginBottom: 18 }} />

      {notConfiguredLabel && (
        <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 12 }}>
          {notConfiguredLabel} sign-in isn't enabled yet — use email + password for now.
        </div>
      )}
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13, marginBottom: 14 }}>{error}</div>}

      <button
        type="submit"
        disabled={pending}
        className="btn"
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 12,
          background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          border: "none",
          opacity: pending ? 0.6 : 1,
          marginBottom: 18,
        }}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <form action={signInWithGoogleAction}>
        <button type="submit" className="btn" style={oauthButtonStyle}>
          Continue with Google
        </button>
      </form>

      <form action={signInWithAppleAction}>
        <button type="submit" className="btn" style={oauthButtonStyle}>
          Continue with Apple
        </button>
      </form>

      <form action={signInWithFacebookAction}>
        <button type="submit" className="btn" style={{ ...oauthButtonStyle, marginBottom: 0 }}>
          Continue with Facebook
        </button>
      </form>

      <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
        New to Play?{" "}
        <Link href="/sign-up" style={{ color: "var(--accent-pink)", textDecoration: "none" }}>
          Create an account
        </Link>
      </div>
    </form>
  );
}
