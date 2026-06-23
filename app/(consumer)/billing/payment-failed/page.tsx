import Link from "next/link";
import { getUserBillingProfile } from "../../../../lib/users";
import { requireUserId } from "../../../../lib/auth";
import { PLAN_OPTIONS } from "../../../../types/database";

// D4 — Payment Failed Screen.
// Per Tasks Tracker: "Shown when a subscription payment fails. Prompts
// user to update card." Reached when `users.subscription_status ===
// "past_due"` (set by the Stripe webhook in real life — see
// subscription_status enum in Database Schema v1.0). "Update card" can't
// actually open a real Stripe card-update form without Stripe keys
// configured, so it links to the Billing Portal (D3) for now — same demo
// boundary as D1/D2/D3.
export default async function PaymentFailedPage() {
  const userId = await requireUserId("/sign-in?next=/billing/payment-failed");
  const profile = await getUserBillingProfile(userId);
  const plan = profile ? PLAN_OPTIONS.find((p) => p.tier === profile.tier) : undefined;

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 8 }}>
        Payment failed
      </div>
      <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, lineHeight: 1.6 }}>
        We couldn't charge your card for your {plan?.name ?? "subscription"} renewal. Update your
        payment method to keep your {plan?.name ?? "paid"} access — we'll retry automatically once
        it's updated.
      </div>

      <div
        style={{
          background: "rgba(255,184,0,0.08)",
          border: "1px solid rgba(255,184,0,0.25)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 28,
          textAlign: "left",
          fontSize: 13,
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        If payment isn't updated within a few days, your account will drop to Explorer (Free) and
        you'll lose access to {plan?.tier === "elite" ? "Elite" : "Insider"}-tier venues.
      </div>

      <Link
        href="/billing"
        className="btn"
        style={{
          display: "block",
          background: `linear-gradient(135deg, var(--accent-pink), var(--accent-orange))`,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 800,
          textDecoration: "none",
          marginBottom: 14,
        }}
      >
        Update payment method
      </Link>

      <Link href="/" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
        Remind me later
      </Link>
    </main>
  );
}
