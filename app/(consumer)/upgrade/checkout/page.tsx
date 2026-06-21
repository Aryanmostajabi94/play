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
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 30, marginBottom: 6 }}>
        Upgrade your membership
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28 }}>
        Unlock more of Dubai's best venues.
      </div>

      <CheckoutForm initialTier={initialTier} />
    </main>
  );
}
