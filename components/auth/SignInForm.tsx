"use client";

import { useState } from "react";
import Link from "next/link";
import AppleIcon from "./AppleIcon";
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "12px 14px",
  borderRadius: 12,
  background: "var(--surface)",
  border: "1px solid var(--border-soft)",
  color: "var(--text-primary)",
  fontWeight: 600,
  fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 8,
};

// A4 — Sign In. Single-column layout (Google, then Apple/Facebook side by
// side, then a divider, then email/password) matching the card design the
// user supplied (AuthPages.jsx) — replaces the previous two-column
// OAuth/email split. Submit handlers still call the real Supabase server
// actions below; only the markup/styling changed.
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
        <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 14 }}>
          {notConfiguredLabel} sign-in isn't enabled yet — use email + password below.
        </div>
      )}

      {/* OAuth path — siblings of the email/password form, not nested inside
          it, to avoid the HTML parser dropping nested <form> tags. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        <form action={signInWithGoogleAction}>
          <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}>
            <span aria-hidden>G</span>Continue with Google
          </button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <form action={signInWithAppleAction}>
            <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}>
              <AppleIcon />
              Apple
            </button>
          </form>
          <form action={signInWithFacebookAction}>
            <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}>
              <span aria-hidden>f</span>Facebook
            </button>
          </form>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-soft)" }} />
        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1 }}>or</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-soft)" }} />
      </div>

      <form action={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input name="email" type="email" placeholder="you@email.com" required className="input-el" />
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={labelStyle}>Password</label>
          <input name="password" type="password" placeholder="••••••••" required className="input-el" />
        </div>

        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: "var(--accent-pink)", cursor: "pointer", fontWeight: 600 }}>
            Forgot password?
          </span>
        </div>

        {error && <div style={{ color: "var(--accent-pink)", fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <button
          type="submit"
          disabled={pending}
          className="btn"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 13,
            background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            border: "none",
            letterSpacing: 0.5,
            opacity: pending ? 0.6 : 1,
            marginBottom: 18,
          }}
        >
          {pending ? "Signing in..." : "Sign In →"}
        </button>
      </form>

      <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
        Not a member?{" "}
        <Link href="/sign-up" style={{ color: "var(--accent-pink)", fontWeight: 700, textDecoration: "none" }}>
          Create account
        </Link>
      </div>
    </div>
  );
}
