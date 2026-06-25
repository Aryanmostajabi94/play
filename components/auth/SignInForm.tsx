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
  background: "var(--surface)",
  border: "1px solid var(--border-strong)",
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
//
// Layout mirrors SignUpForm — OAuth options first (fastest path in for
// most people), divider, then email/password. Both forms also share the
// same theme-aware tokens (--surface/--border-soft/--border-strong) so
// they render correctly in both the dark "night" theme and the light
// "day" theme — they used to hardcode white-rgba overlays, which were
// nearly invisible on the light background.
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
    <div>
      {notConfiguredLabel && (
        <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 12 }}>
          {notConfiguredLabel} sign-in isn't enabled yet — use email + password for now.
        </div>
      )}

      {/* Siblings of the email/password form below, not nested inside
          it — a nested <form> tag gets silently dropped by the HTML
          parser, so the button would otherwise attach to (and try to
          submit) the email/password form instead of its own action. */}
      <form action={signInWithGoogleAction}>
        <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}>
          <span aria-hidden style={{ marginRight: 8 }}>G</span>Continue with Google
        </button>
      </form>

      <form action={signInWithAppleAction}>
        <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}>
          <span aria-hidden style={{ marginRight: 8 }}></span>Continue with Apple
        </button>
      </form>

      <form action={signInWithFacebookAction}>
        <button type="submit" className="btn oauth-btn" style={{ ...oauthButtonStyle, marginBottom: 0 }}>
          <span aria-hidden style={{ marginRight: 8 }}>f</span>Continue with Facebook
        </button>
      </form>

      <div style={{ margin: "22px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-soft)" }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or sign in with email</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-soft)" }} />
      </div>

      <form action={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required className="input-el" style={{ marginBottom: 10 }} />
        <input name="password" type="password" placeholder="Password" required className="input-el" style={{ marginBottom: 18 }} />

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
          }}
        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
        New to Play?{" "}
        <Link href="/sign-up" style={{ color: "var(--accent-pink)", textDecoration: "none" }}>
          Create an account
        </Link>
      </div>
    </div>
  );
}
