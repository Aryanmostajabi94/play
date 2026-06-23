"use client";

import { useState } from "react";
import Link from "next/link";
import { signInAction, signInWithGoogleAction } from "../../app/actions/auth";

// A4 — Sign In. Email + password + Google OAuth, per Screen Inventory.
// The Google button is wired end-to-end on the code side; it only works
// once the Google provider is switched on in the Supabase dashboard
// (Authentication > Providers) — see app/actions/auth.ts for the same
// caveat, structurally identical to the Stripe-test-keys situation on D1.
export default function SignInForm({ googleNotConfigured }: { googleNotConfigured?: boolean }) {
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

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required className="input-el" style={{ marginBottom: 10 }} />
      <input name="password" type="password" placeholder="Password" required className="input-el" style={{ marginBottom: 18 }} />

      {googleNotConfigured && (
        <div style={{ color: "var(--accent-gold)", fontSize: 12, marginBottom: 12 }}>
          Google sign-in isn't enabled yet — use email + password for now.
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
          marginBottom: 10,
        }}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>

      <form action={signInWithGoogleAction}>
        <button
          type="submit"
          className="btn"
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 12,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Continue with Google
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
