"use client";

import { useMemo, useState } from "react";
import { createBooking } from "../app/actions/bookings";
import {
  LARGE_GROUP_THRESHOLD,
  OCCASIONS,
  type NotificationChannel,
  type Venue,
} from "../types/database";

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

export default function BookingForm({ venue }: { venue: Venue }) {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [occasion, setOccasion] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [channels, setChannels] = useState<NotificationChannel[]>(["in_app"]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ bookingId: string; status: string } | null>(
    null,
  );

  const timeSlots = useMemo(buildTimeSlots, []);
  const isLargeGroup = partySize >= LARGE_GROUP_THRESHOLD;
  const todayStr = new Date().toISOString().slice(0, 10);

  function toggleChannel(id: NotificationChannel) {
    setChannels((cur) =>
      cur.includes(id) ? cur.filter((c) => c !== id) : [...cur, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await createBooking({
      venueId: venue.id,
      date,
      timeSlot,
      partySize,
      occasion: occasion || undefined,
      specialRequests: specialRequests || undefined,
      notificationChannels: channels,
    });

    setSubmitting(false);

    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }

    setResult({ bookingId: res.bookingId!, status: res.status! });
  }

  if (result) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 10 }}>
          {result.status === "confirmed" ? "✅" : "📨"}
        </div>
        <div className="heading" style={{ fontSize: 28, marginBottom: 8 }}>
          {result.status === "confirmed" ? "Booking confirmed" : "Request sent"}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 4 }}>
          Booking ID: {result.bookingId}
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
          Status: {result.status}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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

      {error && (
        <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>
      )}

      <button
        type="submit"
        disabled={submitting}
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
          opacity: submitting ? 0.6 : 1,
        }}
      >
        {submitting ? "Booking…" : "Reserve table"}
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
