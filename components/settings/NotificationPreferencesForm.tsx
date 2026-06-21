"use client";

import { useState } from "react";
import { saveNotificationPreferences } from "../../app/actions/notificationPreferences";
import {
  REMINDER_HOUR_OPTIONS,
  type NotificationPreferences,
} from "../../types/database";

type ToggleKey =
  | "in_app_enabled"
  | "email_enabled"
  | "whatsapp_enabled"
  | "weekly_picks_enabled"
  | "elite_drop_enabled";

const CHANNEL_TOGGLES: { key: ToggleKey; label: string; helper: string }[] = [
  { key: "in_app_enabled", label: "In-app", helper: "Notifications inside Play" },
  { key: "email_enabled", label: "Email", helper: "Booking confirmations and updates" },
  { key: "whatsapp_enabled", label: "WhatsApp", helper: "Reminders and venue messages" },
];

const DIGEST_TOGGLES: { key: ToggleKey; label: string; helper: string }[] = [
  { key: "weekly_picks_enabled", label: "Weekly picks", helper: "Curated venue picks each week" },
  { key: "elite_drop_enabled", label: "Elite drops", helper: "New Elite-tier venue releases" },
];

export default function NotificationPreferencesForm({
  preferences,
}: {
  preferences: NotificationPreferences;
}) {
  const [prefs, setPrefs] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(key: ToggleKey) {
    setPrefs((cur) => ({ ...cur, [key]: !cur[key] }));
    setSaved(false);
  }

  function setReminderHours(hours: number) {
    setPrefs((cur) => ({ ...cur, reminder_hours_before: hours }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await saveNotificationPreferences({
      in_app_enabled: prefs.in_app_enabled,
      email_enabled: prefs.email_enabled,
      whatsapp_enabled: prefs.whatsapp_enabled,
      reminder_hours_before: prefs.reminder_hours_before,
      weekly_picks_enabled: prefs.weekly_picks_enabled,
      elite_drop_enabled: prefs.elite_drop_enabled,
    });

    setSaving(false);

    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }

    setSaved(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <Section title="Notify me via">
        {CHANNEL_TOGGLES.map((t) => (
          <ToggleRow
            key={t.key}
            label={t.label}
            helper={t.helper}
            active={prefs[t.key]}
            onClick={() => toggle(t.key)}
          />
        ))}
      </Section>

      <Section title="Booking reminders">
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
          Remind me before my reservation
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {REMINDER_HOUR_OPTIONS.map((h) => {
            const active = prefs.reminder_hours_before === h;
            return (
              <div
                key={h}
                onClick={() => setReminderHours(h)}
                className="btn"
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  border: `1px solid ${active ? "var(--accent-pink)" : "rgba(255,255,255,0.08)"}`,
                  background: active ? "rgba(255,255,255,0.06)" : "transparent",
                  color: active ? "var(--text-primary)" : "var(--text-muted)",
                }}
              >
                {h}h before
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Discovery digests">
        {DIGEST_TOGGLES.map((t) => (
          <ToggleRow
            key={t.key}
            label={t.label}
            helper={t.helper}
            active={prefs[t.key]}
            onClick={() => toggle(t.key)}
          />
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
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save preferences"}
      </button>
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

function ToggleRow({
  label,
  helper,
  active,
  onClick,
}: {
  label: string;
  helper: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{helper}</div>
      </div>
      <div
        onClick={onClick}
        className="btn"
        role="switch"
        aria-checked={active}
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          background: active ? "var(--accent-pink)" : "rgba(255,255,255,0.12)",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: active ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            transition: "left 0.15s",
          }}
        />
      </div>
    </div>
  );
}
