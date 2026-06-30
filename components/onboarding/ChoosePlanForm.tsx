"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
  { id: "free", label: "Explorer", price: "Free", desc: "Browse + book open venues" },
  { id: "insider", label: "Insider", price: "from $19/mo", desc: "Unlock Insider-only venues" },
  { id: "elite", label: "Elite", price: "from $49/mo", desc: "Full access, priority requests" },
] as const;

// A5 — Choose Plan, post-signup step. Lives at /onboarding/plan, reached
// from /onboarding/profile right after account creation (both
// email/password signup and first-time OAuth). The account already
// exists as 'free' by this point (signUpAction / auth/callback's
// upsert), so picking Explorer here just continues into the app —
// picking Insider/Elite is what actually triggers the tier change, via
// the existing D1 checkout flow.
export default function ChoosePlanForm() {
  const router = useRouter();
  const [plan, setPlan] = useState<"free" | "insider" | "elite">("free");
  const [pending, setPending] = useState(false);

  function handleContinue() {
    setPending(true);
    if (plan === "insider" || plan === "elite") {
      router.push(`/upgrade/checkout?tier=${plan}`);
      return;
    }
    router.push("/");
  }

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlan(p.id)}
            className="btn"
            style={{
              flex: "1 1 200px",
              textAlign: "left",
              padding: "16px 18px",
              borderRadius: 16,
              background: plan === p.id ? "rgba(255,45,120,0.12)" : "var(--surface)",
              border: `1px solid ${plan === p.id ? "var(--accent-pink)" : "var(--border-soft)"}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{p.label}</span>
              <span style={{ fontSize: 12, color: "var(--accent-gold)" }}>{p.price}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={pending}
        className="btn"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 800,
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending ? "Continuing…" : plan === "free" ? "Continue with Explorer" : `Continue to ${plan === "insider" ? "Insider" : "Elite"} checkout`}
      </button>

      <button
        onClick={() => router.push("/")}
        className="btn"
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          fontSize: 13,
          padding: 8,
          marginTop: 4,
        }}
      >
        Skip for now — stay on Explorer
      </button>
    </div>
  );
}
