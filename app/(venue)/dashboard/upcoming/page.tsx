import { getUpcomingBookings } from "../../../../lib/venueBookings";

// F3 — Upcoming Bookings (Screen Inventory v1.0): all confirmed bookings
// for the next 14 days, guest details, tier badge, special requests.
export default async function UpcomingBookingsPage() {
  const bookings = await getUpcomingBookings();

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Upcoming Bookings
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
        Confirmed bookings over the next 14 days.
      </div>

      {bookings.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 14 }}>
          No confirmed bookings in the next 14 days.
        </div>
      ) : (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 0.8fr 1.8fr",
              gap: 16,
              padding: "12px 20px",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontWeight: 700,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>Guest</div>
            <div>Date / Time</div>
            <div>Party</div>
            <div>Special requests</div>
          </div>

          {bookings.map((booking) => {
            const isElite = booking.user_tier_at_booking === "elite";
            return (
              <div
                key={booking.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr 0.8fr 1.8fr",
                  gap: 16,
                  alignItems: "center",
                  padding: "16px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 14,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    {booking.guest_name}
                    {isElite && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: "var(--accent-gold)",
                          border: "1px solid var(--accent-gold)",
                          borderRadius: 6,
                          padding: "1px 5px",
                        }}
                      >
                        ELITE
                      </span>
                    )}
                  </div>
                  {booking.occasion && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {booking.occasion}
                    </div>
                  )}
                </div>
                <div>
                  {booking.date} <span style={{ color: "var(--text-muted)" }}>·</span>{" "}
                  {booking.time_slot}
                </div>
                <div>{booking.party_size} guests</div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {booking.special_requests || "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
