"use client";

import { useState } from "react";
import {
  saveWeeklyAvailability,
  addBlackoutDate,
  removeBlackoutDate,
} from "../../app/actions/venueAvailability";
import {
  DAY_NAMES,
  type DayAvailability,
  type BlackoutDate,
} from "../../lib/venueAvailability";

// F6 — Availability Manager. Per Tasks Tracker: "Weekly calendar,
// open/closed toggles per day, blackout dates."
export default function AvailabilityManagerForm({
  initialDays,
  initialBlackouts,
}: {
  initialDays: DayAvailability[];
  initialBlackouts: BlackoutDate[];
}) {
  const [days, setDays] = useState(initialDays);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [blackouts, setBlackouts] = useState(initialBlackouts);
  const [newDate, setNewDate] = useState("");
  const [newReason, setNewReason] = useState("");
  const [addingBlackout, setAddingBlackout] = useState(false);
  const [blackoutError, setBlackoutError] = useState<string | null>(null);

  function updateDay(index: number, patch: Partial<DayAvailability>) {
    setDays((cur) => cur.map((d, i) => (i === index ? { ...d, ...patch } : d)));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await saveWeeklyAvailability(days);

    setSaving(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
  }

  async function handleAddBlackout() {
    setBlackoutError(null);
    setAddingBlackout(true);

    const res = await addBlackoutDate(newDate, newReason);

    setAddingBlackout(false);
    if (!res.success) {
      setBlackoutError(res.error ?? "Could not add blackout date.");
      return;
    }

    setBlackouts((cur) =>
      [...cur, { id: crypto.randomUUID(), date: newDate, reason: newReason.trim() || null }].sort(
        (a, b) => a.date.localeCompare(b.date),
      ),
    );
    setNewDate("");
    setNewReason("");
  }

  async function handleRemoveBlackout(id: string) {
    setBlackouts((cur) => cur.filter((b) => b.id !== id));
    await removeBlackoutDate(id);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <Section title="Weekly hours">
        {days.map((day, i) => (
          <div
            key={day.day_of_week}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "4px 0",
            }}
          >
            <div style={{ width: 100, fontSize: 14, fontWeight: 700 }}>
              {DAY_NAMES[day.day_of_week]}
            </div>

            <div
              onClick={() => updateDay(i, { is_closed: !day.is_closed })}
              className="btn"
              role="switch"
              aria-checked={!day.is_closed}
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                background: !day.is_closed ? "var(--accent-pink)" : "rgba(255,255,255,0.12)",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: !day.is_closed ? 21 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.15s",
                }}
              />
            </div>

            {day.is_closed ? (
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Closed</div>
            ) : (
              <>
                <input
                  type="time"
                  value={day.open_time ?? ""}
                  onChange={(e) => updateDay(i, { open_time: e.target.value })}
                  className="input-el"
                  style={{ width: 110 }}
                />
                <div style={{ color: "var(--text-muted)" }}>to</div>
                <input
                  type="time"
                  value={day.close_time ?? ""}
                  onChange={(e) => updateDay(i, { close_time: e.target.value })}
                  className="input-el"
                  style={{ width: 110 }}
                />
              </>
            )}
          </div>
        ))}
      </Section>

      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}

      <button
        onClick={handleSave}
        disabled={saving}
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
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save weekly hours"}
      </button>

      <Section title="Blackout dates">
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 4 }}>
          Days the venue is closed regardless of its usual hours — holidays, private events, etc.
        </div>

        {blackouts.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No upcoming blackout dates.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {blackouts.map((b) => (
              <div
                key={b.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{b.date}</div>
                  {b.reason && (
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{b.reason}</div>
                  )}
                </div>
                <div
                  onClick={() => handleRemoveBlackout(b.id)}
                  className="btn"
                  style={{ fontSize: 12, color: "var(--accent-pink)", fontWeight: 700 }}
                >
                  Remove
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="input-el"
            style={{ flex: 1 }}
          />
          <input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="Reason (optional)"
            className="input-el"
            style={{ flex: 2 }}
          />
          <button
            onClick={handleAddBlackout}
            disabled={addingBlackout || !newDate}
            className="btn"
            style={{
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: 13,
              opacity: addingBlackout || !newDate ? 0.5 : 1,
            }}
          >
            Add
          </button>
        </div>
        {blackoutError && (
          <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{blackoutError}</div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}
