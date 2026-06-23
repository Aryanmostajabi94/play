import Link from "next/link";
import StatusBadge from "./StatusBadge";
import type { BookingWithVenue } from "../../types/database";

// Screen C8 — Booking Detail.
// Full detail of a single booking (any status), reached from C7 Booking
// History or by revisiting a booking link. Links out to C9 Cancel Booking
// Screen (its own route at /booking/[id]/cancel) when the booking is
// still cancellable — the actual cancel confirmation + fee warning now
// lives there instead of inline here.
export default function BookingDetail({ booking }: { booking: BookingWithVenue }) {
  const eligibility = getCancelEligibility(booking);
  const status = booking.status;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${booking.venue.accent_color}33`,
        borderRadius: 20,
        padding: 28,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div className="heading" style={{ fontSize: 24 }}>
          {booking.venue.name}
        </div>
        <StatusBadge status={status} />
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 18 }}>
        {booking.venue.area}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
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
        {booking.special_requests && (
          <DetailRow label="Special requests" value={booking.special_requests} />
        )}
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 18 }}>
        Booking ID: {booking.id}
      </div>

      {(status === "pending" || status === "confirmed") && (
        <div style={{ marginBottom: 18 }}>
          {!eligibility.eligible ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 8 }}>
              {eligibility.reason}
            </div>
          ) : null}
          <Link
            href={`/booking/${booking.id}/cancel`}
            className="btn"
            style={{
              display: "inline-block",
              background: "transparent",
              color: "var(--accent-pink)",
              border: "1px solid var(--accent-pink)",
              borderRadius: 10,
              padding: "10px 18px",
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Cancel booking
          </Link>
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

// Free-cancellation eligibility per the venue's cancellation_policy /
// cancellation_window_hrs (Booking Engine Spec v1.0). Non-refundable
// bookings and bookings past their free-cancellation window must be
// cancelled by contacting the venue directly.
function getCancelEligibility(
  booking: BookingWithVenue,
): { eligible: boolean; reason: string } {
  if (booking.cancellation_policy === "non_refundable") {
    return {
      eligible: false,
      reason: "Non-refundable booking — contact the venue directly to cancel.",
    };
  }

  const bookingDateTime = new Date(`${booking.date}T${booking.time_slot}`);
  const windowHrs = booking.cancellation_window_hrs ?? 0;
  const deadline = new Date(bookingDateTime.getTime() - windowHrs * 60 * 60 * 1000);

  if (Date.now() > deadline.getTime()) {
    return {
      eligible: false,
      reason: "Free cancellation window has passed — contact the venue directly.",
    };
  }

  return { eligible: true, reason: "" };
}
