"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cancelSubscription } from "../../app/actions/subscription";
import { PLAN_OPTIONS } from "../../types/database";
import type { UserBillingProfile, SubscriptionEventRow } from "../../lib/users";

// D3 — Billing Portal.
// Per Tasks Tracker: "Stripe-hosted billing portal: upgrade, downgrade,
// cancel, view receipts." With no Stripe keys configured yet, "Manage on
// Stripe" can't actually redirect anywhere real — this renders the same
// information a Stripe-hosted portal would (current plan, status,
// renewal date, event history) directly from the `users` +
// `subscription_events` tables, with cancel wired to a real (if
// simplified) server action. Swap in stripe.billingPortal.sessions.create
// once keys land — see manageBilling in app/actions/subscription.ts.
export default function BillingPortal({
  profile,
  events,
}: {
  profile: UserBillingProfile;
  events: SubscriptionEventRow[];
}) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const plan = PLAN_OPTIONS.find((p) => p.tier === profile.tier);
  const isPaid = profile.tier !== "free";

  async function handleCancel() {
    setCancelling(true);
    await cancelSubscription(profile.id);
    setCancelling(false);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              Current plan
            </div>
            <div className="heading" style={{ fontSize: 26 }}>{plan?.name ?? "Explorer (Free)"}</div>
          </div>
          <StatusPill status={profile.subscription_status} />
        </div>

        {isPaid && profile.subscription_expires_at && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {profile.subscription_status === "cancelled"
              ? `Access ends ${new Date(profile.subscription_expires_at).toLocaleDateString()}`
              : `Renews ${new Date(profile.subscription_expires_at).toLocaleDateString()}`}
          </div>
        )}
      </div>

      {isPaid ? (
        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/upgrade/checkout"
            className="btn"
            style={{
              flex: 1,
              textAlign: "center",
              background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
              color: "#fff",
              borderRadius: 14,
              padding: 14,
              fontSize: 13,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Change plan
          </Link>
          {profile.subscription_status !== "cancelled" && !showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn"
              style={{
                flex: 1,
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: 14,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Cancel subscription
            </button>
          )}
        </div>
      ) : (
        <Link
          href="/upgrade/checkout"
          className="btn"
          style={{
            display: "block",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
            color: "#fff",
            borderRadius: 14,
            padding: 14,
            fontSize: 13,
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Upgrade
        </Link>
      )}

      {showConfirm && (
        <div
          style={{
            background: "rgba(255,184,0,0.08)",
            border: "1px solid rgba(255,184,0,0.25)",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
            You'll keep {plan?.name} access until the end of your current billing period, then drop to
            Explorer (Free).
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="btn"
              style={{
                background: "var(--accent-pink)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
                opacity: cancelling ? 0.6 : 1,
              }}
            >
              {cancelling ? "Cancelling…" : "Confirm cancel"}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={cancelling}
              className="btn"
              style={{ background: "transparent", color: "var(--text-muted)", border: "none", fontSize: 13 }}
            >
              Keep subscription
            </button>
          </div>
        </div>
      )}

      <div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Billing history
        </div>
        {events.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No billing events yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {events.map((e) => (
              <div
                key={e.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12,
                }}
              >
                <span>{e.event_type}</span>
                <span style={{ color: "var(--text-muted)" }}>
                  {e.amount ? `AED ${e.amount} · ` : ""}
                  {new Date(e.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ fontSize: 11, color: "var(--accent-gold)" }}>
        Demo mode — billing actions update your record directly; Stripe isn't connected yet.
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: UserBillingProfile["subscription_status"] }) {
  const map: Record<string, { label: string; color: string }> = {
    inactive: { label: "Free", color: "var(--text-muted)" },
    active: { label: "Active", color: "var(--accent-pink)" },
    past_due: { label: "Payment failed", color: "var(--accent-gold)" },
    cancelled: { label: "Cancelled", color: "var(--text-muted)" },
  };
  const m = map[status];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: m.color, border: `1px solid ${m.color}`, borderRadius: 8, padding: "3px 9px" }}>
      {m.label}
    </span>
  );
}
