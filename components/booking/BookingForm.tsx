"use client";

import { useMemo, useState } from "react";
import BookingSummary, { type PendingBooking } from "./BookingSummary";
import {
  LARGE_GROUP_THRESHOLD,
  OCCASIONS,
  type NotificationChannel,
  type Venue,
} from "../../types/database";

const NOTIFICATION_OPTIONS: { id: NotificationChannel; label: string }[] = [
  { id: "in_app", label: "In-app" },
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
];

function buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 10; h <= 23; h++) {
    for (const m of [0, 30]) {
      if (h === 23 && m === 30) continue;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

// C1 Booking Form. Submitting no longer creates the booking directly —
// it hands the collected values to C2 Booking Summary (see
// components/booking/BookingSummary.tsx) for review first. The actual
// createBooking call now lives there, fired by "Confirm booking".
export default function BookingForm({ venue }: { venue: Venue }) {
  const [step, setStep] = useState<"form" | "summary">("form");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [occasion, setOccasion] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [channels, setChannels] = useState<NotificationChannel[]>(["in_app"]);

  const timeSlots = useMemo(buildTimeSlots, []);
  const isLargeGroup = partySize >= LARGE_GROUP_THRESHOLD;
  const todayStr = new Date().toISOString().slice(0, 10);

  function toggleChannel(id: NotificationChannel) {
    setChannels((cur) =>
      cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id],
    );
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!channels.length) return;
    setStep("summary");
  }

  if (step === "summary") {
    const pending: PendingBooking = {
      date,
      timeSlot,
      partySize,
      occasion,
      specialRequests,
      channels,
    };
    return <BookingSummary venue={venue} pending={pending} onBack={() => setStep("form")} />;
  }

  return (
    <form
      onSubmit={handleContinue}
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
          Reserve at {venue.name}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {venue.area} · {venue.price_display}
        </div>
      </div>

      {/*
        Date and Time are stacked, not side-by-side: iOS Safari renders the
        native <input type="date"> control's pill-shaped widget at its own
        intrinsic size, which ignores the column width and overflows into
        whatever sits next to it (a CSS grid/flex constraint can't fix
        this — it's the native control overflowing its own box). Full-width
        stacked fields sidestep the bug entirely.
      */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={fieldLabel}>Date</label>
          <input
            type="date"
            required
            min={todayStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-el"
          />
        </div>
        <div>
          <label style={fieldLabel}>Time</label>
          <select
            required
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="input-el"
          >
            <option value="" disabled>
              Select a time
            </option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={fieldLabel}>Party size</label>
        <input
          type="number"
          required
          min={venue.min_party_size}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
          className="input-el"
        />
        {isLargeGroup && (
          <div style={{ fontSize: 12, color: "var(--accent-gold)", marginTop: 6 }}>
            Groups of {LARGE_GROUP_THRESHOLD}+ are handled as a request — the venue
            will confirm manually.
          </div>
        )}
      </div>

      <div>
        <label style={fieldLabel}>Occasion (optional)</label>
        <select
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="input-el"
        >
          <option value="">None</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={fieldLabel}>Special requests (optional)</label>
        <textarea
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value.slice(0, 280))}
          maxLength={280}
          rows={3}
          className="input-el"
          style={{ resize: "none" }}
        />
        <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "right" }}>
          {specialRequests.length}/280
        </div>
      </div>

      <div>
        <label style={fieldLabel}>Notify me via</label>
        <div style={{ display: "flex", gap: 8 }}>
          {NOTIFICATION_OPTIONS.map((opt) => {
            const active = channels.includes(opt.id);
            return (
              <div
                key={opt.id}
                onClick={() => toggleChannel(opt.id)}
                className="btn"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px 8px",
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 700,
                  border: `1px solid ${active ? venue.accent_color : "rgba(255,255,255,0.08)"}`,
                  background: active ? `${venue.accent_color}1a` : "transparent",
                  color: active ? venue.accent_color : "var(--text-muted)",
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      </div>

      {channels.length === 0 && (
        <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>
          Pick at least one notification preference.
        </div>
      )}

      <button
        type="submit"
        disabled={channels.length === 0}
        className="btn"
        style={{
          width: "100%",
          background: `linear-gradient(135deg, var(--accent-pink), var(--accent-orange))`,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 800,
          opacity: channels.length === 0 ? 0.6 : 1,
        }}
      >
        Review booking
      </button>
    </form>
  );
}

const fieldLabel: React.CSSProperties = {
  fontSize: 10,
  color: "var(--text-muted)",
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
  fontWeight: 700,
};
