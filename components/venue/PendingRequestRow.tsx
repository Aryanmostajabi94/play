"use client";

import { useEffect, useState } from "react";
import {
  confirmBookingRequest,
  declineBookingRequest,
} from "../../app/actions/venueBookings";
import type { VenueBookingRow } from "../../types/database";

const URGENCY_THRESHOLD_MS = 60 * 60 * 1000; // 1hr, per Booking Engine Spec v1.0 §5

function formatTimeRemaining(deadline: string | null): {
  label: string;
  isUrgent: boolean;
  isExpired: boolean;
} {
  if (!deadline) return { label: "—", isUrgent: false, isExpired: false };

  const msRemaining = new Date(deadline).getTime() - Date.now();
  if (msRemaining <= 0) return { label: "Overdue", isUrgent: true, isExpired: true };

  const hrs = Math.floor(msRemaining / (60 * 60 * 1000));
  const mins = Math.floor((msRemaining % (60 * 60 * 1000)) / (60 * 1000));
  const label = hrs > 0 ? `${hrs}h ${mins}m left` : `${mins}m left`;

  return { label, isUrgent: msRemaining < URGENCY_THRESHOLD_MS, isExpired: false };
}

export default function PendingRequestRow({ booking }: { booking: VenueBookingRow }) {
  const [remaining, setRemaining] = useState(() =>
    formatTimeRemaining(booking.confirmation_deadline),
  );
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatTimeRemaining(booking.confirmation_deadline));
    }, 30_000);
    return () => clearInterval(interval);
  }, [booking.confirmation_deadline]);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    const res = await confirmBookingRequest(booking.id);
    setPending(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setResolved(true);
  }

  async function handleDecline() {
    setPending(true);
    setError(null);
    const res = await declineBookingRequest(booking.id, declineReason || undefined);
    setPending(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setResolved(true);
  }

  if (resolved) {
    return null; // row drops off the pending list once actioned
  }

  const isElite = booking.user_tier_at_booking === "elite";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 0.8fr 1.6fr 1fr 1.4fr",
        gap: 16,
        alignItems: "center",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        borderLeft: remaining.isUrgent
          ? "3px solid var(--accent-pink)"
          : "3px solid transparent",
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
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{booking.occasion}</div>
        )}
      </div>

      <div style={{ fontSize: 14 }}>
        {booking.date} <span style={{ color: "var(--text-muted)" }}>·</span>{" "}
        {booking.time_slot}
      </div>

      <div style={{ fontSize: 14 }}>{booking.party_size} guests</div>

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

      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: remaining.isUrgent ? "var(--accent-pink)" : "var(--text-primary)",
        }}
      >
        {remaining.label}
      </div>

      <div>
        {!showDeclineReason ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleConfirm}
              disabled={pending}
              className="btn"
              style={{
                background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 700,
                opacity: pending ? 0.6 : 1,
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => setShowDeclineReason(true)}
              disabled={pending}
              className="btn"
              style={{
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              Decline
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <input
              type="text"
              placeholder="Reason (optional)"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              className="input-el"
              style={{ fontSize: 12, padding: "6px 10px" }}
            />
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={handleDecline}
                disabled={pending}
                className="btn"
                style={{
                  background: "var(--accent-pink)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Confirm decline
              </button>
              <button
                onClick={() => setShowDeclineReason(false)}
                disabled={pending}
                className="btn"
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "none",
                  fontSize: 12,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && (
          <div style={{ color: "var(--accent-pink)", fontSize: 11, marginTop: 4 }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
