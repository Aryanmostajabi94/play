import Link from "next/link";
import { getAdminOverview } from "../../../lib/admin";

// H1 — Admin Home. Per Tasks Tracker: "Overview dashboard — total
// venues, bookings, subscribers, pending verifications."
export default async function AdminHomePage() {
  const overview = await getAdminOverview();

  const cards = [
    { label: "Total venues", value: overview.totalVenues, sub: `${overview.liveVenues} live · ${overview.ghostVenues} ghost`, href: "/admin/venues" },
    { label: "Total bookings", value: overview.totalBookings, sub: `${overview.pendingBookings} pending`, href: "/admin/bookings" },
    { label: "Subscribers", value: overview.totalSubscribers, sub: "Insider + Elite", href: "/admin/users" },
    { label: "Pending verifications", value: overview.pendingVerifications, sub: "Needs review", href: "/admin/verification" },
  ];

  return (
    <div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 24 }}>
        Overview
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            style={{
              display: "block",
              padding: 20,
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
              color: "var(--text-primary)",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{c.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
