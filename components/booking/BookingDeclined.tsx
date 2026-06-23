import Link from "next/link";
import type { BookingWithVenue, DiscoverVenue } from "../../types/database";

// C6 — Booking Declined Screen.
// Per Tasks Tracker: "Shown when venue declines a request. Surfaces
// alternative venue suggestions." Rendered at /booking/[id] whenever
// status === "declined" — unlike C3/C4 this isn't gated on `?new=1`,
// since a decline always happens after the fact (the venue reviewed and
// said no), never at creation time.
export default function BookingDeclined({
  booking,
  alternatives,
}: {
  booking: BookingWithVenue;
  alternatives: DiscoverVenue[];
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${booking.venue.accent_color}33`,
        borderRadius: 20,
        padding: 28,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>😔</div>
        <div className="heading" style={{ fontSize: 26, marginBottom: 8 }}>
          Not available
        </div>
        <div style={{ fontSize: 14, marginBottom: 4 }}>{booking.venue.name}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          couldn't confirm your request for {booking.date} at {booking.time_slot}.
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <DetailRow label="Date" value={booking.date} />
        <DetailRow label="Time" value={booking.time_slot} />
        <DetailRow label="Party size" value={String(booking.party_size)} />
        <DetailRow label="Area" value={booking.venue.area} />
      </div>

      {alternatives.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-muted)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
              fontWeight: 700,
            }}
          >
            Try one of these instead
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alternatives.map((v) => (
              <Link
                key={v.id}
                href={`/book/${v.slug}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${v.accent_color}33`,
                  borderRadius: 14,
                  padding: 14,
                  textDecoration: "none",
                  color: "var(--text-primary)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{v.area}</div>
                </div>
                {v.price_display && (
                  <span style={{ fontSize: 13, color: v.accent_color, fontWeight: 700 }}>
                    {v.price_display}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/bookings" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>
        ← Back to bookings
      </Link>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "var(--text-muted)",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14 }}>{value}</div>
    </div>
  );
}
