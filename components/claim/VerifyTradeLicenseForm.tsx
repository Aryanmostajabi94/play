"use client";

import { useState } from "react";
import { submitTradeLicenseAction } from "../../app/actions/venueClaim";

// G4 — Trade License. No document storage bucket or OCR service is wired
// up, so this takes a pasted image/PDF link rather than a real upload +
// text-extraction check (flagged in the helper text below).
export default function VerifyTradeLicenseForm({ submissionId }: { submissionId: string }) {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await submitTradeLicenseAction(submissionId, url);
    setSubmitting(false);
    if (res && !res.success) setError(res.error ?? "Something went wrong.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Link to trade license (image or PDF)"
        className="input-el"
      />
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        Document upload and automatic text verification aren't wired up yet — paste a link for
        now. A real upload + OCR check will replace this.
      </div>
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={submitting || !url.trim()}
        className="btn"
        style={{
          padding: "14px 20px",
          borderRadius: 14,
          background: "var(--accent-pink)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          opacity: submitting || !url.trim() ? 0.5 : 1,
        }}
      >
        {submitting ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}
