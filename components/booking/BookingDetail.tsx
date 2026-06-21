"use client";

import { useState } from "react";
import Link from "next/link";
import { cancelBooking } from "../../app/actions/bookings";
import StatusBadge from "./StatusBadge";
import type { BookingWithVenue } from "../../types/database";

// Screen C8 — Booking Detail.
// Full detail of a single booking (any status), reached from C7 Booking
// History or by revisiting a booking link. Shows a Cancel button when the
// booking is still cancellable per the venue's cancellation policy.
export default function BookingDetail({ booking }: { booking: BookingWithVenue }) {
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const eligibility = getCancelEligibility(booking);

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    const res = await cancelBooking(booking.id);
    setCancelling(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setCancelled(true);
  }

  const status = cancelled ? "cancelled_by_user" : booking.status;

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

      {cancelled && (
        <div style={{ color: "var(--accent-pink)", fontSize: 13, marginBottom: 14 }}>
          Booking cancelled.
        </div>
      )}

      {!cancelled && (status === "pending" || status === "confirmed") && (
        <div style={{ marginBottom: 18 }}>
          {!eligibility.eligible ? (
            <div style={{ color: "var(--text-muted)", fontSize: 12 }}>{eligibility.reason}</div>
          ) : !showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn"
              style={{
                background: "transparent",
                color: "var(--accent-pink)",
                border: "1px solid var(--accent-pink)",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Cancel booking
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Cancel this booking? This can't be undone.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="btn"
                  style={{
                    background: "var(--accent-pink)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    opacity: cancelling ? 0.6 : 1,
                  }}
                >
                  {cancelling ? "Cancelling…" : "Confirm cancellation"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={cancelling}
                  className="btn"
                  style={{
                    background: "transparent",
                    color: "var(--text-muted)",
                    border: "none",
                    fontSize: 13,
                  }}
                >
                  Keep booking
                </button>
              </div>
            </div>
          )}
          {error && (
            <div style={{ color: "var(--accent-pink)", fontSize: 12, marginTop: 6 }}>{error}</div>
          )}
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
