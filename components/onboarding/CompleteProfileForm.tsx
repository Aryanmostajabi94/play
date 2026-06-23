"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

// Post-signup onboarding step. Per the new signup flow, account creation
// no longer blocks on email confirmation — instead it drops the user
// here to fill in the details the signup form didn't collect (phone,
// date of birth, avatar) before they land on the app. Email verification
// itself is deferred to the moment they try to book (see
// app/actions/bookings.ts) rather than gating this step.
//
// Distinct from components/settings/AccountSettingsForm.tsx (E2) even
// though the fields overlap — this one only asks for what's missing,
// has "Skip for now" framing instead of a persistent settings page, and
// redirects into the app on save instead of staying put.
export default function CompleteProfileForm({ profile }: { profile: AccountProfile }) {
  const router = useRouter();
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(profile.date_of_birth ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    setSaving(true);
    setError(null);

    const res = await updateAccount({
      name: profile.name,
      phone,
      city: profile.city,
      avatarUrl,
      dateOfBirth,
    });

    setSaving(false);
    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }
    router.push("/");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
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
        <label style={fieldLabel}>Phone number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+971 50 123 4567"
          className="input-el"
        />
      </div>

      <div>
        <label style={fieldLabel}>Date of birth</label>
        <input
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="input-el"
        />
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
          Some venues have an age minimum — you'll need this on file to book them.
        </div>
      </div>

      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}

      <button
        onClick={handleContinue}
        disabled={saving}
        className="btn"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 800,
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "Saving…" : "Save & continue"}
      </button>

      <button
        onClick={() => router.push("/")}
        className="btn"
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: "var(--text-muted)",
          fontSize: 13,
          padding: 8,
        }}
      >
        Skip for now
      </button>
    </div>
  );
}
