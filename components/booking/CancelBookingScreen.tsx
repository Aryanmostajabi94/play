"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cancelBooking } from "../../app/actions/bookings";
import type { BookingWithVenue } from "../../types/database";

// C9 — Cancel Booking Screen.
// Per Tasks Tracker: "Cancellation confirmation screen. Shows fee warning
// if outside free cancellation window (uses cancellation_fee_per_person
// field)." Reached from the "Cancel booking" link on C8 Booking Detail —
// pulled out into its own route (/booking/[id]/cancel) rather than the
// small inline toggle that used to live in BookingDetail, since the
// Tasks Tracker explicitly calls for a dedicated screen.
function getEligibility(booking: BookingWithVenue): { eligible: boolean; reason: string } {
  if (booking.cancellation_policy === "non_refundable") {
    return {
      eligible: false,
      reason: "This booking is non-refundable — cancelling now won't be free.",
    };
  }

  const bookingDateTime = new Date(`${booking.date}T${booking.time_slot}`);
  const windowHrs = booking.cancellation_window_hrs ?? 0;
  const deadline = new Date(bookingDateTime.getTime() - windowHrs * 60 * 60 * 1000);

  if (Date.now() > deadline.getTime()) {
    return {
      eligible: false,
      reason: "You're past the free cancellation window for this booking.",
    };
  }

  return { eligible: true, reason: "" };
}

export default function CancelBookingScreen({ booking }: { booking: BookingWithVenue }) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const { eligible, reason } = getEligibility(booking);
  const fee = booking.venue.cancellation_fee_per_person * booking.party_size;
  const hasFee = !eligible && fee > 0;

  async function handleConfirm() {
    setCancelling(true);
    setError(null);
    const res = await cancelBooking(booking.id);
    setCancelling(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setDone(true);
  }

  if (done) {
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
        <div style={{ fontSize: 40, marginBottom: 10 }}>✓</div>
        <div className="heading" style={{ fontSize: 24, marginBottom: 10 }}>
          Booking cancelled
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
          {booking.venue.name} · {booking.date} · {booking.time_slot}
        </div>
        <Link
          href={`/booking/${booking.id}`}
          className="btn"
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.06)",
            color: "var(--text-primary)",
            borderRadius: 14,
            padding: "12px 24px",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to booking
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${booking.venue.accent_color}33`,
        borderRadius: 20,
        padding: 28,
      }}
    >
      <div className="heading" style={{ fontSize: 24, marginBottom: 4 }}>
        Cancel booking?
      </div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
        {booking.venue.name} · {booking.date} · {booking.time_slot} · {booking.party_size} guests
      </div>

      <div
        style={{
          background: eligible ? "rgba(0,212,255,0.08)" : "rgba(255,184,0,0.08)",
          border: `1px solid ${eligible ? "rgba(0,212,255,0.25)" : "rgba(255,184,0,0.25)"}`,
          borderRadius: 14,
          padding: 14,
          marginBottom: 22,
        }}
      >
        {eligible ? (
          <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
            You're within the free cancellation window — no charge.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-gold)", marginBottom: 4 }}>
              {hasFee ? `Cancellation fee: AED ${fee}` : "Outside free cancellation"}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {reason}
              {hasFee &&
                ` AED ${booking.venue.cancellation_fee_per_person} per person × ${booking.party_size} guests = AED ${fee}.`}
            </div>
          </>
        )}
      </div>

      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13, marginBottom: 14 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={() => router.push(`/booking/${booking.id}`)}
          disabled={cancelling}
          className="btn"
          style={{
            flex: 1,
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: 15,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Keep booking
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={cancelling}
          className="btn"
          style={{
            flex: 2,
            background: "var(--accent-pink)",
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: 15,
            fontSize: 15,
            fontWeight: 800,
            opacity: cancelling ? 0.6 : 1,
          }}
        >
          {cancelling ? "Cancelling…" : hasFee ? `Cancel — pay AED ${fee}` : "Confirm cancellation"}
        </button>
      </div>
    </div>
  );
}
