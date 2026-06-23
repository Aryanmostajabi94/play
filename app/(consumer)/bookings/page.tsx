import Link from "next/link";
import { getBookingsForUser } from "../../../lib/bookings";
import { requireUserId } from "../../../lib/auth";
import StatusBadge from "../../../components/booking/StatusBadge";

// Screen C7 — Booking History.
// Per Screen Inventory v1.0: "List of all past and upcoming bookings with
// status badges." Notes say it "lives inside User Profile" — the consumer
// Profile screen (B9) hasn't been ported into this Next.js app yet (still
// MVP-only), so this is a standalone route at /bookings for now and can be
// nested under /profile once that screen is built.
export default async function BookingHistoryPage() {
  const userId = await requireUserId("/sign-in?next=/bookings");
  const bookings = await getBookingsForUser(userId);

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 20px" }}>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Your bookings
      </div>

      {bookings.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          You haven't made any bookings yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/booking/${booking.id}`}
              style={{
                display: "block",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${booking.venue.accent_color}33`,
                borderRadius: 16,
                padding: 18,
                textDecoration: "none",
                color: "var(--text-primary)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{booking.venue.name}</div>
                <StatusBadge status={booking.status} />
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {booking.date} · {booking.time_slot} · {booking.party_size} guests
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
