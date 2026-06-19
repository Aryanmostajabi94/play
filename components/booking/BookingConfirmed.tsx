import Link from "next/link";
import type { BookingWithVenue } from "../../types/database";

// Screen C3 — Instant Confirm.
// Shown at /booking/[id] when booking.status === "confirmed".
export default function BookingConfirmed({ booking }: { booking: BookingWithVenue }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${booking.venue.accent_color}33`,
        borderRadius: 20,
        padding: 28,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 8 }}>
        Booking confirmed
      </div>
      <div style={{ fontSize: 15, marginBottom: 18 }}>{booking.venue.name}</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          textAlign: "left",
          background: "rgba(255,255,255,0.03)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <DetailRow label="Date" value={booking.date} />
        <DetailRow label="Time" value={booking.time_slot} />
        <DetailRow label="Party size" value={String(booking.party_size)} />
        <DetailRow label="Area" value={booking.venue.area} />
        {booking.occasion && <DetailRow label="Occasion" value={booking.occasion} />}
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 18 }}>
        Booking ID: {booking.id}
      </div>

      <Link
        href="/"
        className="btn"
        style={{
          display: "inline-block",
          background: `linear-gradient(135deg, var(--accent-pink), var(--accent-orange))`,
          color: "#fff",
          borderRadius: 14,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 800,
          textDecoration: "none",
        }}
      >
        Done
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
