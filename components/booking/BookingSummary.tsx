"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "../../app/actions/bookings";
import {
  LARGE_GROUP_THRESHOLD,
  type CancellationPolicy,
  type NotificationChannel,
  type Venue,
} from "../../types/database";

// C2 — Booking Summary.
// Per Screen Inventory v1.0: "Review screen before confirming. Shows
// venue, date, time, party, confirmation type, cancellation policy." This
// is the step between filling out the form (C1) and the booking actually
// being created — nothing here has hit the database yet; "Confirm" is
// what calls createBooking.
export interface PendingBooking {
  date: string;
  timeSlot: string;
  partySize: number;
  occasion: string;
  specialRequests: string;
  channels: NotificationChannel[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatCancellationPolicy(policy: CancellationPolicy, feePerPerson: number): string {
  switch (policy) {
    case "flexible":
      return "Free cancellation any time before your reservation.";
    case "24hr":
      return feePerPerson > 0
        ? `Free cancellation up to 24 hours before. After that, AED ${feePerPerson} per person.`
        : "Free cancellation up to 24 hours before your reservation.";
    case "48hr":
      return feePerPerson > 0
        ? `Free cancellation up to 48 hours before. After that, AED ${feePerPerson} per person.`
        : "Free cancellation up to 48 hours before your reservation.";
    case "non_refundable":
      return "This booking is non-refundable.";
    case "custom":
    default:
      return "This venue has a custom cancellation policy — contact them directly with questions.";
  }
}

const NOTIFICATION_LABELS: Record<NotificationChannel, string> = {
  in_app: "In-app",
  email: "Email",
  whatsapp: "WhatsApp",
};

export default function BookingSummary({
  venue,
  pending,
  onBack,
}: {
  venue: Venue;
  pending: PendingBooking;
  onBack: () => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLargeGroup = pending.partySize >= LARGE_GROUP_THRESHOLD;
  const confirmationType = isLargeGroup ? "request" : venue.booking_type;

  async function handleConfirm() {
    setError(null);
    setSubmitting(true);

    const res = await createBooking({
      venueId: venue.id,
      date: pending.date,
      timeSlot: pending.timeSlot,
      partySize: pending.partySize,
      occasion: pending.occasion || undefined,
      specialRequests: pending.specialRequests || undefined,
      notificationChannels: pending.channels,
    });

    setSubmitting(false);

    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }

    router.push(`/booking/${res.bookingId}?new=1`);
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${venue.accent_color}33`,
        borderRadius: 20,
        padding: 26,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div>
        <div className="heading" style={{ fontSize: 26, marginBottom: 2 }}>
          Review your booking
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {venue.name} · {venue.area}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <SummaryRow label="Date" value={formatDate(pending.date)} />
        <SummaryRow label="Time" value={pending.timeSlot} />
        <SummaryRow
          label="Party size"
          value={`${pending.partySize} ${pending.partySize === 1 ? "guest" : "guests"}`}
        />
        {pending.occasion && <SummaryRow label="Occasion" value={pending.occasion} />}
        {pending.specialRequests && (
          <SummaryRow label="Special requests" value={pending.specialRequests} />
        )}
        <SummaryRow
          label="Notify via"
          value={pending.channels.map((c) => NOTIFICATION_LABELS[c]).join(", ")}
        />
      </div>

      <div
        style={{
          background:
            confirmationType === "instant" ? "rgba(255,45,120,0.08)" : "rgba(255,184,0,0.08)",
          border: `1px solid ${confirmationType === "instant" ? "rgba(255,45,120,0.25)" : "rgba(255,184,0,0.25)"}`,
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: confirmationType === "instant" ? "var(--accent-pink)" : "var(--accent-gold)",
            marginBottom: 4,
          }}
        >
          {confirmationType === "instant" ? "Instant confirmation" : "Request — venue will confirm"}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
          {confirmationType === "instant"
            ? "Your table is reserved the moment you confirm — no waiting."
            : isLargeGroup
              ? `Groups of ${LARGE_GROUP_THRESHOLD}+ are handled as a request — the venue will confirm manually, usually within ${venue.confirmation_window_hrs} hours.`
              : `The venue will confirm manually, usually within ${venue.confirmation_window_hrs} hours.`}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          Cancellation policy
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
          {formatCancellationPolicy(venue.cancellation_policy, venue.cancellation_fee_per_person)}
        </div>
      </div>

      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
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
          Back
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting}
          className="btn"
          style={{
            flex: 2,
            background: `linear-gradient(135deg, var(--accent-pink), var(--accent-orange))`,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            padding: 15,
            fontSize: 15,
            fontWeight: 800,
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? "Confirming…" : "Confirm booking"}
        </button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}
