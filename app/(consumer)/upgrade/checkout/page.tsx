import CheckoutForm from "../../../../components/subscription/CheckoutForm";
import type { PaidTier } from "../../../../types/database";

// Screen D1 — Checkout / Payment.
// Per Screen Inventory v1.0: "Stripe Checkout for upgrading to Insider or
// Elite. Monthly or annual." Notes: "Stripe hosted page — minimal custom
// design needed" — this screen is the plan/cycle picker that hands off to
// Stripe's hosted checkout; see app/actions/subscription.ts for the
// TEMPORARY mock redirect pending Stripe test keys.
export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { tier?: string };
}) {
  const initialTier =
    searchParams.tier === "insider" || searchParams.tier === "elite"
      ? (searchParams.tier as PaidTier)
      : undefined;

  return (
    <main style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px" }}>
      {/* Hero treatment ported from Play_V11.jsx's Membership screen
          ("PLAY HARDER.") — purely visual, the plan/cycle/checkout logic
          below is untouched. */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div className="heading" style={{ fontSize: 44, lineHeight: 1, marginBottom: 10 }}>
          <span style={{ color: "var(--text-primary)" }}>PLAY</span>
          <span
            style={{
              background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange), var(--accent-gold))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            {" "}
            HARDER.
          </span>
        </div>
        <div style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 380, margin: "0 auto", lineHeight: 1.6 }}>
          Skip the queue. Get the table. Unlock Dubai's best venues.
        </div>
      </div>

      <CheckoutForm initialTier={initialTier} />
    </main>
  );
}
