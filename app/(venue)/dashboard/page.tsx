import Link from "next/link";
import { getDashboardSummary } from "../../../lib/venueBookings";
import SummaryCard from "../../../components/venue/SummaryCard";

// F1 — Venue Dashboard Home (Screen Inventory v1.0):
// "Overview of today's bookings, pending requests, week summary, quick
// actions."
export default async function VenueDashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Dashboard
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
        <SummaryCard label="Today's bookings" value={summary.todayBookings.length} />
        <SummaryCard
          label="Pending requests"
          value={summary.pendingRequestCount}
          accent={summary.pendingRequestCount > 0 ? "var(--accent-pink)" : undefined}
        />
        <SummaryCard label="Confirmed (next 7 days)" value={summary.weekConfirmedCount} />
        <SummaryCard label="Pending (next 7 days)" value={summary.weekPendingCount} />
      </div>

      {summary.pendingRequestCount > 0 && (
        <Link
          href="/dashboard/requests"
          className="btn"
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
            color: "#fff",
            borderRadius: 12,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
            marginBottom: 32,
          }}
        >
          Review {summary.pendingRequestCount} pending request
          {summary.pendingRequestCount === 1 ? "" : "s"} →
        </Link>
      )}

      <div className="heading" style={{ fontSize: 18, marginBottom: 14 }}>
        Today's bookings
      </div>

      {summary.todayBookings.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          Nothing booked for today yet.
        </div>
      ) : (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {summary.todayBookings.map((b) => (
            <div
              key={b.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 12,
                padding: "14px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontSize: 14,
              }}
            >
              <div style={{ fontWeight: 700 }}>{b.guest_name}</div>
              <div>{b.time_slot}</div>
              <div>{b.party_size} guests</div>
              <div style={{ color: "var(--text-muted)" }}>
                {b.status === "confirmed" ? "Confirmed ✓" : "Awaiting confirmation"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
