import Link from "next/link";
import { listBookingsAdmin } from "../../../../lib/admin";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "declined", "expired", "cancelled_by_user", "cancelled_by_venue"];

// H4 — Booking Overview. Per Tasks Tracker: "All bookings across all
// venues. Filter by status, date, venue." Filters are plain query params
// (?status=&date=) so this stays a server component, same pattern as the
// rest of the admin panel which doesn't need client interactivity beyond
// the action buttons in H2/H3.
export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; date?: string }>;
}) {
  const { status, date } = await searchParams;
  const bookings = await listBookingsAdmin({ status, date });

  return (
    <div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 24 }}>
        Bookings ({bookings.length})
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Link
          href="/admin/bookings"
          style={{ fontSize: 12, color: !status ? "var(--accent-pink)" : "var(--text-muted)", textDecoration: "none" }}
        >
          All
        </Link>
        {STATUS_OPTIONS.map((s) => (
          <Link
            key={s}
            href={`/admin/bookings?status=${s}`}
            style={{ fontSize: 12, color: status === s ? "var(--accent-pink)" : "var(--text-muted)", textDecoration: "none" }}
          >
            {s}
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 0.8fr", gap: 8, padding: "0 14px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        <div>Venue</div>
        <div>Guest</div>
        <div>Date / time</div>
        <div>Status</div>
        <div>Party</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 0.8fr",
              gap: 8,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 700 }}>{b.venue_name}</div>
            <div>{b.guest_name}</div>
            <div style={{ color: "var(--text-muted)" }}>
              {b.date} · {b.time_slot}
            </div>
            <div>{b.status}</div>
            <div>{b.party_size}</div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-muted)", padding: 14 }}>No bookings match these filters.</div>
        )}
      </div>
    </div>
  );
}
