"use client";

import { useState } from "react";
import { submitLivePhotoAction } from "../../app/actions/venueClaim";

// G7 — Live Photo. No camera/upload pipeline exists in this sandbox, so
// this takes a pasted image URL, same stand-in pattern as G4.
export default function VerifyPhotoForm({ submissionId }: { submissionId: string }) {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await submitLivePhotoAction(submissionId, url);
    setSubmitting(false);
    if (res && !res.success) setError(res.error ?? "Something went wrong.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Link to a live exterior photo"
        className="input-el"
      />
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        In-app camera capture isn't wired up yet — paste a link to a fresh exterior photo for
        now.
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
