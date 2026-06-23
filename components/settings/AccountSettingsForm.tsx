"use client";

import { useState } from "react";
import { updateAccount } from "../../app/actions/accountSettings";
import type { AccountProfile } from "../../lib/account";

const fieldLabel: React.CSSProperties = {
  fontSize: 10,
  color: "var(--text-muted)",
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
  fontWeight: 700,
};

// E2 — Account Settings. Per Tasks Tracker: "Edit name, phone number,
// city, avatar."
export default function AccountSettingsForm({ profile }: { profile: AccountProfile }) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [city, setCity] = useState(profile.city);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await updateAccount({ name, phone, city, avatarUrl });

    setSaving(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    setSaved(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: avatarUrl
              ? `center/cover url(${avatarUrl})`
              : "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {!avatarUrl && (name.trim()[0]?.toUpperCase() ?? "?")}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{profile.email}</div>
      </div>

      <div>
        <label style={fieldLabel}>Avatar URL</label>
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
          className="input-el"
        />
      </div>

      <div>
        <label style={fieldLabel}>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-el" />
      </div>

      <div>
        <label style={fieldLabel}>Phone number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+971 50 123 4567"
          className="input-el"
        />
      </div>

      <div>
        <label style={fieldLabel}>City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} className="input-el" />
      </div>

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
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}
