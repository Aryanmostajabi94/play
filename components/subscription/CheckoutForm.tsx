"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startCheckout } from "../../app/actions/subscription";
import { PLAN_OPTIONS, type BillingCycle, type PaidTier } from "../../types/database";

export default function CheckoutForm({
  initialTier,
}: {
  initialTier?: PaidTier;
}) {
  const router = useRouter();
  const [tier, setTier] = useState<PaidTier>(initialTier ?? "insider");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [submitting, setSubmitting] = useState(false);

  const plan = PLAN_OPTIONS.find((p) => p.tier === tier)!;
  const price = cycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;

  async function handleContinue() {
    setSubmitting(true);
    const res = await startCheckout(tier, cycle);
    router.push(res.redirectUrl);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", gap: 12 }}>
        {/* Free/Explorer reference card — matches Play_V11.jsx's 3-tier
            comparison layout (Explorer/Insider/Elite) so paid plans show
            what's already included for free, instead of floating with no
            baseline. Display-only: clicking does nothing, same as V11's
            "Browse Free" card which just dismisses the upgrade flow. */}
        <div
          className="card-hover"
          style={{
            flex: 1,
            padding: 18,
            borderRadius: 16,
            border: "1px solid var(--border-soft)",
            background: "var(--surface)",
            opacity: 0.7,
            cursor: "default",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Explorer</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>Free</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--text-muted)" }}>
            <li>Browse all venues</li>
            <li>Standard listings</li>
          </ul>
        </div>
        {PLAN_OPTIONS.map((p) => {
          const active = p.tier === tier;
          return (
            <div
              key={p.tier}
              onClick={() => setTier(p.tier)}
              className="btn card-hover"
              style={{
                flex: 1,
                padding: 18,
                borderRadius: 16,
                border: `1px solid ${active ? "var(--accent-gold)" : "rgba(255,255,255,0.08)"}`,
                background: active ? "rgba(255,184,0,0.08)" : "rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
                AED {p.monthlyPrice}/mo
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--text-muted)" }}>
                {p.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div>
        <label
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 8,
            display: "block",
            fontWeight: 700,
          }}
        >
          Billing cycle
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          {(["monthly", "annual"] as BillingCycle[]).map((c) => {
            const active = cycle === c;
            return (
              <div
                key={c}
                onClick={() => setCycle(c)}
                className="btn"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid ${active ? "var(--accent-pink)" : "rgba(255,255,255,0.08)"}`,
                  background: active ? "rgba(255,45,120,0.1)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                  textTransform: "capitalize",
                }}
              >
                {c}
                {c === "annual" && (
                  <span style={{ color: "var(--accent-gold)", marginLeft: 4 }}>(save ~17%)</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {plan.name} · {cycle}
        </div>
        <div style={{ fontWeight: 800, fontSize: 18 }}>
          AED {price}
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>
            {cycle === "monthly" ? "/mo" : "/yr"}
          </span>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={submitting}
        className="btn"
        style={{
          width: "100%",
          background: `linear-gradient(135deg, var(--accent-pink), var(--accent-orange))`,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 800,
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Redirecting…" : "Continue to payment"}
      </button>

      <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
        You'll be taken to Stripe's secure checkout to complete payment.
      </div>
    </div>
  );
}
