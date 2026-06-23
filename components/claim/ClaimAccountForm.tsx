"use client";

import { useState } from "react";
import { createVenueAccountAction } from "../../app/actions/venueClaim";

// G3 — Create Venue Account. No password field — there's no Supabase
// Auth wiring for venue accounts yet (same caveat noted on the consumer
// A3/A4 sign up/in screens), so this just creates the venue_users
// "owner" row by name + email and moves straight into verification.
export default function ClaimAccountForm({ venueId, venueName }: { venueId: string; venueName: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await createVenueAccountAction(venueId, name, email);
    setSubmitting(false);
    if (res && !res.success) {
      setError(res.error ?? "Something went wrong.");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          padding: "10px 14px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
        }}
      >
        Claiming <strong style={{ color: "var(--text-primary)" }}>{venueName}</strong>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="input-el"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Business email"
        className="input-el"
      />
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={submitting || !name.trim() || !email.trim()}
        className="btn"
        style={{
          padding: "14px 20px",
          borderRadius: 14,
          background: "var(--accent-pink)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          opacity: submitting || !name.trim() || !email.trim() ? 0.5 : 1,
        }}
      >
        {submitting ? "Creating…" : "Continue to verification"}
      </button>
    </div>
  );
}
