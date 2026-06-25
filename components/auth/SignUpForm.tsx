"use client";

import { useState } from "react";
import Link from "next/link";
import {
  signUpAction,
  signInWithGoogleAction,
  signInWithAppleAction,
  signInWithFacebookAction,
} from "../../app/actions/auth";

const PLANS = [
  { id: "free", label: "Explorer", price: "Free", desc: "Browse + book open venues" },
  { id: "insider", label: "Insider", price: "from $19/mo", desc: "Unlock Insider-only venues" },
  { id: "elite", label: "Elite", price: "from $49/mo", desc: "Full access, priority requests" },
] as const;

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

// A3 — Sign Up, with A5 (Choose Plan) folded in as a single step rather
// than a separate screen-to-screen hop, since the only thing A5 needs is
// which tier to hand off to D1 checkout with. Free stays in-app; Insider
// / Elite redirect into the existing /upgrade/checkout flow right after
// account creation.
//
// Google/Apple/Facebook buttons mirror SignInForm — same actions
// (signInWithOAuth creates a new auth user the first time it sees that
// account, same as a plain sign-in), since there's no separate "sign up"
// vs "sign in" concept on Supabase's OAuth side. The forms here are
// siblings of the main one rather than nested inside it for the same
// reason as SignInForm: a nested <form> tag gets silently dropped by
// the HTML parser, so the button would otherwise attach to (and try to
// submit) the email/password form instead of its own action.
export default function SignUpForm({ providerError }: { providerError?: string }) {
  const [plan, setPlan] = useState<"free" | "insider" | "elite">("free");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  // signUpAction surfaces Supabase's own error text verbatim — for a
  // duplicate email that's "User already registered" — so this is a
  // string match rather than a separate flag on AuthActionResult. A
  // dedicated modal (instead of the usual inline red text) since the
  // useful next step here isn't "fix a typo and resubmit", it's "go sign
  // in instead", which deserves a more direct nudge.
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    formData.set("tier", plan);
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
    // Otherwise signUpAction already redirected.
  }

  if (awaitingConfirmation) {
    return (
      <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>
        Check your email to confirm your account, then sign in — you'll be able to
        finish your profile and start browsing right away. You only need to verify
        again later if you try to book a place.
      </div>
    );
  }

  const notConfiguredLabel = providerError ? PROVIDER_LABEL[providerError] : undefined;

  return (
    <div>
      {showDuplicateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowDuplicateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-primary)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 16,
              padding: 28,
              maxWidth: 360,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div className="heading" style={{ fontSize: 20, marginBottom: 10 }}>
              Account already exists
            </div>
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 22, lineHeight: 1.5 }}>
              There's already an account with this email. Sign in instead to continue.
            </div>
            <Link
              href="/sign-in"
              className="btn"
              style={{
                display: "block",
                width: "100%",
                padding: "12px",
                borderRadius: 12,
                background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              Go to sign in
            </Link>
            <button
              type="button"
              onClick={() => setShowDuplicateModal(false)}
              className="btn"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 12,
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Moved up top — the OAuth path is the fastest way in for most
          people, and burying it below a 3-input form + plan picker meant
          it was effectively invisible without scrolling. Same actions as
          SignInForm — Supabase OAuth has no separate "sign up" step,
          signInWithOAuth creates the account the first time it sees that
          provider identity. Plan selection below only applies to the
          email/password path; OAuth accounts start on the free tier and
          can upgrade afterward via /upgrade/checkout, same as anyone
          else. Siblings of the email form below, not nested inside it,
          for the same HTML-parser reason as SignInForm. */}
      {notConfiguredLabel && (
        <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 12 }}>
          {notConfiguredLabel} sign-up isn't enabled yet — use the form below for now.
        </div>
      )}

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
        <button type="submit" className="btn" style={oauthButtonStyle}>
          Continue with Facebook
        </button>
      </form>

      <div style={{ margin: "18px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or sign up with email</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
      </div>

      <form action={handleSubmit}>
        <input name="name" placeholder="Full name" required className="input-el" style={{ marginBottom: 10 }} />
        <input name="email" type="email" placeholder="Email" required className="input-el" style={{ marginBottom: 10 }} />
        <input
          name="password"
          type="password"
          placeholder="Password (min. 8 characters)"
          required
          minLength={8}
          className="input-el"
          style={{ marginBottom: 18 }}
        />

        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Choose your plan</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className="btn"
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: 14,
                background: plan === p.id ? "rgba(255,45,120,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${plan === p.id ? "var(--accent-pink)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{p.label}</span>
                <span style={{ fontSize: 12, color: "var(--accent-gold)" }}>{p.price}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.desc}</div>
            </button>
          ))}
        </div>

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
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/sign-in" style={{ color: "var(--accent-pink)", textDecoration: "none" }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
