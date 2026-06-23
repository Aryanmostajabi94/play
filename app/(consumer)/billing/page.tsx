import { getUserBillingProfile, getSubscriptionEvents } from "../../../lib/users";
import { requireUserId } from "../../../lib/auth";
import BillingPortal from "../../../components/subscription/BillingPortal";

// D3 — Billing Portal.
export default async function BillingPage() {
  const userId = await requireUserId("/sign-in?next=/billing");
  const profile = await getUserBillingProfile(userId);
  const events = profile ? await getSubscriptionEvents(profile.id) : [];

  if (!profile) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>Couldn't load your billing info.</div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Billing
      </div>
      <BillingPortal profile={profile} events={events} />
    </main>
  );
}
