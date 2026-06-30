"use client";

import { useState } from "react";
import Link from "next/link";
import AppleIcon from "./AppleIcon";
import {
  signUpAction,
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

export default function SignUpForm({ providerError }: { providerError?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    const res = await signUpAction(formData);
    setPending(false);
    if (!res.success) {
      if (res.error?.toLowerCase().includes("already registered")) {
        setShowDuplicateModal(true);
      } else {
        setError(res.error ?? "Something went wrong.");
      }
      return;
    }
    if (res.needsEmailConfirmation) {
      setAwaitingConfirmation(true);
    }
  }

  if (awaitingConfirmation) {
    return (
      <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
        Check your email to confirm your account, then sign in.
      </div>
    );
  }

  const notConfiguredLabel = providerError ? PROVIDER_LABEL[providerError] : undefined;

  return (
    <div>
      {showDuplicateModal && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}
          onClick={() => setShowDuplicateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--bg-primary)", border: "1px solid var(--border-strong)", borderRadius: 16, padding: 28, maxWidth: 360, width: "100%", textAlign: "center" }}
          >
            <div className="heading" style={{ fontSize: 20, marginBottom: 10 }}>Account already exists</div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 22, lineHeight: 1.5 }}>
              There's already an account with this email. Sign in instead to continue.
            </div>
            <Link href="/sign-in" className="btn" style={{ display: "block", width: "100%", padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none", marginBottom: 10 }}>
              Go to sign in
            </Link>
            <button type="button" onClick={() => setShowDuplicateModal(false)} className="btn" style={{ width: "100%", padding: "10px", borderRadius: 12, background: "transparent", border: "none", color: "var(--text-muted)", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {notConfiguredLabel && (
        <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 14 }}>
          {notConfiguredLabel} sign-up isn't enabled yet — use the form below for now.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        <form action={signInWithGoogleAction}>
          <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}>
            <span aria-hidden>G</span>Continue with Google
          </button>
        </form>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <form action={signInWithAppleAction}>
            <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}><AppleIcon />Apple</button>
          </form>
          <form action={signInWithFacebookAction}>
            <button type="submit" className="btn oauth-btn" style={oauthButtonStyle}><span aria-hidden>f</span>Facebook</button>
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
          <label style={labelStyle}>Full Name</label>
          <input name="name" placeholder="Your name" required className="input-el" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Email</label>
          <input name="email" type="email" placeholder="you@email.com" required className="input-el" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Password</label>
          <input name="password" type="password" placeholder="Min. 8 characters" required minLength={8} className="input-el" />
        </div>

        {error && <div style={{ color: "var(--accent-pink)", fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <button type="submit" disabled={pending} className="btn" style={{ width: "100%", padding: "14px", borderRadius: 13, background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))", color: "#fff", fontWeight: 800, fontSize: 14, border: "none", letterSpacing: 0.5, opacity: pending ? 0.6 : 1, marginBottom: 18 }}>
          {pending ? "Creating account..." : "Create account →"}
        </button>
      </form>

      <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
        Already a member?{" "}
        <Link href="/sign-in" style={{ color: "var(--accent-pink)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
      </div>
    </div>
  );
}
