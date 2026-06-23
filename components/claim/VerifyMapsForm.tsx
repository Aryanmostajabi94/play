"use client";

import { useState } from "react";
import { confirmGoogleMapsMatchAction } from "../../app/actions/venueClaim";

// G6 — Google Maps Match. No Google Places API key is configured, so
// this can't compute a real similarity score against Google's listing.
// Shows the address already on file and asks the owner to confirm it,
// rather than faking a third-party verdict.
export default function VerifyMapsForm({
  submissionId,
  address,
}: {
  submissionId: string;
  address: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await confirmGoogleMapsMatchAction(submissionId);
    setSubmitting(false);
    if (res && !res.success) setError(res.error ?? "Something went wrong.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          fontSize: 14,
          padding: "12px 14px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
        }}
      >
        {address}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        No Google Places integration is configured yet to auto-match this against Google Maps —
        confirm this is the right address for now.
      </div>
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="btn"
        style={{
          padding: "14px 20px",
          borderRadius: 14,
          background: "var(--accent-pink)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          opacity: submitting ? 0.5 : 1,
        }}
      >
        {submitting ? "Confirming…" : "Yes, that's us"}
      </button>
    </div>
  );
}
