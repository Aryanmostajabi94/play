"use client";

import { useState } from "react";
import Link from "next/link";
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
  padding: "13px",
  borderRadius: 12,
  background: "var(--surface)",
  border: "1px solid var(--border-strong)",
  color: "var(--text-primary)",
  fontWeight: 700,
  fontSize: 14,
  marginBottom: 10,
};

// A3 — Sign Up. Plan selection (A5) used to be folded into this same
// screen as a second column, but it now happens after account creation
// instead — signUpAction always creates the row as 'free' and the new
// /onboarding/plan step (reached via /onboarding/profile) is the single
// place tier gets chosen, for both email/password and OAuth signups.
// That keeps this screen to one job: create the account.
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
    // Otherwise signUpAction already redirected (to /onboarding/profile).
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
              border: "1px solid var(--border-strong)",
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

      {/* Two columns: OAuth on the left, email/password on the right —
          same split as SignInForm. flex-wrap with a min-width on each
          column means this still stacks to one column on narrow/mobile
          viewports without needing a separate media query. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        <div style={{ flex: "1 1 220px", minWidth: 0 }}>
          {notConfiguredLabel && (
            <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 12 }}>
              {notConfiguredLabel} sign-up isn't enabled yet — use the form on the right for now.
            </div>
          )}

          {/* OAuth path is the fastest way in for most people. Same
              actions as SignInForm — Supabase OAuth has no separate
              "sign up" step, signInWithOAuth creates the account the
              first time it sees that provider identity. OAuth accounts
              start on the free tier and choose a plan afterward via
              /onboarding/plan, same as anyone signing up with email.
              Siblings of the email form, not nested inside it, for the
              same HTML-parser reason as SignInForm. */}
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
        </div>

        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            Sign up with email
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
      </div>
    </div>
  );
}
