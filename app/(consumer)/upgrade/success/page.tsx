import Link from "next/link";
import { PLAN_OPTIONS, type PaidTier } from "../../../../types/database";

// Screen D2 — Subscription Success.
// Per Screen Inventory v1.0: "'Welcome to Insider/Elite' confirmation
// screen after successful payment." Reads tier/cycle from query params for
// now — once D1 wires up real Stripe Checkout, this becomes the
// `success_url` Stripe redirects to, and `mock=1` (set only by the
// temporary stub in app/actions/subscription.ts) goes away.
export default function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: { tier?: string; cycle?: string; mock?: string };
}) {
  const tier: PaidTier = searchParams.tier === "elite" ? "elite" : "insider";
  const cycle = searchParams.cycle === "annual" ? "annual" : "monthly";
  const plan = PLAN_OPTIONS.find((p) => p.tier === tier)!;

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 8 }}>
        Welcome to {plan.name}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28 }}>
        Your {cycle} subscription is active. You now have access to{" "}
        {tier === "elite" ? "every venue on Play" : "Insider-tier venues"} and more.
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 18,
          textAlign: "left",
          marginBottom: 28,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "var(--text-muted)",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          What's included
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, display: "flex", flexDirection: "column", gap: 4 }}>
          {plan.perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      </div>

      {searchParams.mock === "1" && (
        <div style={{ fontSize: 11, color: "var(--accent-gold)", marginBottom: 16 }}>
          Demo mode — no payment was actually processed (Stripe isn't connected yet).
        </div>
      )}

      <Link
        href="/"
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
        }}
      >
        Start exploring
      </Link>
    </main>
  );
}
