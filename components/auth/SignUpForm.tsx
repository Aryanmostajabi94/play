"use client";

import { useState } from "react";
import Link from "next/link";
import { signUpAction } from "../../app/actions/auth";

const PLANS = [
  { id: "free", label: "Explorer", price: "Free", desc: "Browse + book open venues" },
  { id: "insider", label: "Insider", price: "from $19/mo", desc: "Unlock Insider-only venues" },
  { id: "elite", label: "Elite", price: "from $49/mo", desc: "Full access, priority requests" },
] as const;

// A3 — Sign Up, with A5 (Choose Plan) folded in as a single step rather
// than a separate screen-to-screen hop, since the only thing A5 needs is
// which tier to hand off to D1 checkout with. Free stays in-app; Insider
// / Elite redirect into the existing /upgrade/checkout flow right after
// account creation.
export default function SignUpForm() {
  const [plan, setPlan] = useState<"free" | "insider" | "elite">("free");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setPending(true);
    formData.set("tier", plan);
    const res = await signUpAction(formData);
    setPending(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
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
        Check your email to confirm your account before signing in.
      </div>
    );
  }

  return (
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

      <div style={{ marginTop: 18, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/sign-in" style={{ color: "var(--accent-pink)", textDecoration: "none" }}>
          Sign in
        </Link>
      </div>
    </form>
  );
}
