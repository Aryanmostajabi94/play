"use client";

import { useState } from "react";
import {
  updateStaffName,
  addVenueStaff,
  removeVenueStaff,
  saveVenueNotificationPrefs,
} from "../../app/actions/venueSettings";
import {
  MAX_VENUE_STAFF,
  type VenueStaffMember,
  type VenueNotificationPrefs,
  type VenueBillingInfo,
} from "../../lib/venueSettings";

const TIER_LABELS: Record<string, string> = {
  ghost: "Ghost (unclaimed)",
  claimed: "Claimed",
  partner: "Partner",
};

const PREF_TOGGLES: { key: keyof VenueNotificationPrefs; label: string; helper: string }[] = [
  { key: "new_request_email", label: "New booking requests (email)", helper: "Sent the moment a guest requests a table" },
  { key: "new_request_whatsapp", label: "New booking requests (WhatsApp)", helper: "Same alert, sent via WhatsApp" },
  { key: "cancellation_email", label: "Cancellations (email)", helper: "When a guest cancels a confirmed booking" },
  { key: "daily_summary_email", label: "Daily summary (email)", helper: "End-of-day recap of today's bookings" },
];

export default function VenueSettingsForm({
  owner,
  staff,
  initialPrefs,
  billing,
}: {
  owner: VenueStaffMember | null;
  staff: VenueStaffMember[];
  initialPrefs: VenueNotificationPrefs;
  billing: VenueBillingInfo;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 600 }}>
      <AccountSection owner={owner} />
      <StaffSection initialStaff={staff} />
      <NotificationSection initialPrefs={initialPrefs} />
      <BillingSection billing={billing} />
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

function AccountSection({ owner }: { owner: VenueStaffMember | null }) {
  const [name, setName] = useState(owner?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!owner) {
    return (
      <Section title="Account details">
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          No owner account found for this venue yet.
        </div>
      </Section>
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await updateStaffName(owner!.id, name);
    setSaving(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
  }

  return (
    <Section title="Account details">
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{owner.email} · Owner</div>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSaved(false);
        }}
        className="input-el"
      />
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn"
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "var(--text-primary)",
          borderRadius: 10,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save name"}
      </button>
    </Section>
  );
}

function StaffSection({ initialStaff }: { initialStaff: VenueStaffMember[] }) {
  const [staff, setStaff] = useState(initialStaff);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "host">("host");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const atLimit = staff.length >= MAX_VENUE_STAFF;

  async function handleAdd() {
    setError(null);
    setAdding(true);
    const res = await addVenueStaff(name, email, role);
    setAdding(false);

    if (!res.success) {
      setError(res.error ?? "Could not add staff member.");
      return;
    }

    setStaff((cur) => [
      ...cur,
      { id: crypto.randomUUID(), name: name.trim(), email: email.trim().toLowerCase(), role, is_active: true },
    ]);
    setName("");
    setEmail("");
  }

  async function handleRemove(id: string) {
    setStaff((cur) => cur.filter((s) => s.id !== id));
    await removeVenueStaff(id);
  }

  return (
    <Section title={`Staff (${staff.length}/${MAX_VENUE_STAFF})`}>
      {staff.length === 0 ? (
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No staff accounts yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {staff.map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>
                  {s.name}{" "}
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 400 }}>
                    {s.role}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.email}</div>
              </div>
              {s.role !== "owner" && (
                <div
                  onClick={() => handleRemove(s.id)}
                  className="btn"
                  style={{ fontSize: 12, color: "var(--accent-pink)", fontWeight: 700 }}
                >
                  Remove
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {atLimit ? (
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
          You've reached the {MAX_VENUE_STAFF}-staff limit. Remove someone to add a new account.
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="input-el"
            style={{ flex: 1, minWidth: 120 }}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-el"
            style={{ flex: 1, minWidth: 160 }}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "manager" | "host")}
            className="input-el"
            style={{ width: 110 }}
          >
            <option value="host">Host</option>
            <option value="manager">Manager</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={adding || !name.trim() || !email.trim()}
            className="btn"
            style={{
              padding: "0 16px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: 13,
              opacity: adding || !name.trim() || !email.trim() ? 0.5 : 1,
            }}
          >
            Add
          </button>
        </div>
      )}
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
    </Section>
  );
}

function NotificationSection({ initialPrefs }: { initialPrefs: VenueNotificationPrefs }) {
  const [prefs, setPrefs] = useState(initialPrefs);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(key: keyof VenueNotificationPrefs) {
    setPrefs((cur) => ({ ...cur, [key]: !cur[key] }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await saveVenueNotificationPrefs(prefs);
    setSaving(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
  }

  return (
    <Section title="Notification preferences">
      {PREF_TOGGLES.map((t) => (
        <div key={t.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.helper}</div>
          </div>
          <div
            onClick={() => toggle(t.key)}
            className="btn"
            role="switch"
            aria-checked={prefs[t.key]}
            style={{
              width: 44,
              height: 26,
              borderRadius: 13,
              background: prefs[t.key] ? "var(--accent-pink)" : "rgba(255,255,255,0.12)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: prefs[t.key] ? 21 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "left 0.15s",
              }}
            />
          </div>
        </div>
      ))}
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn"
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          color: "var(--text-primary)",
          borderRadius: 10,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save preferences"}
      </button>
    </Section>
  );
}

function BillingSection({ billing }: { billing: VenueBillingInfo }) {
  return (
    <Section title="Billing">
      <div style={{ fontSize: 14 }}>
        Listing tier: <strong>{TIER_LABELS[billing.listingTier]}</strong>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        Partner tier unlocks Analytics and priority placement. There's no self-serve upgrade
        flow yet — contact Play to discuss Partner pricing.
      </div>
    </Section>
  );
}
