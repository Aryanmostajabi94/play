"use client";

import { useState } from "react";
import { submitOptionalCheckAction } from "../../app/actions/venueClaim";
import type { OptionalCheckType } from "../../lib/venueClaim";

const OPTIONS: { value: OptionalCheckType; label: string; helper: string }[] = [
  { value: "email_domain", label: "Business email domain", helper: "Your email matches the venue's website domain" },
  { value: "instagram", label: "Instagram", helper: "Link your venue's Instagram account" },
  { value: "gps", label: "GPS check-in", helper: "Confirm you're at the venue right now" },
  { value: "manual", label: "Manual review", helper: "A Play team member will review your submission by hand" },
];

// G8 — Optional Check. None of email-domain matching, Instagram lookup,
// or GPS confirmation have a real backing service in this build, so
// picking any of the first three auto-passes; "manual review" always
// routes to a human (manual_review status) since that's honest rather
// than simulated.
export default function VerifyOptionalForm({ submissionId }: { submissionId: string }) {
  const [selected, setSelected] = useState<OptionalCheckType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    const res = await submitOptionalCheckAction(submissionId, selected);
    setSubmitting(false);
    if (res && !res.success) setError(res.error ?? "Something went wrong.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {OPTIONS.map((opt) => (
        <div
          key={opt.value}
          onClick={() => setSelected(opt.value)}
          className="btn"
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: `1px solid ${selected === opt.value ? "var(--accent-pink)" : "rgba(255,255,255,0.08)"}`,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14 }}>{opt.label}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{opt.helper}</div>
        </div>
      ))}
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={submitting || !selected}
        className="btn"
        style={{
          padding: "14px 20px",
          borderRadius: 14,
          background: "var(--accent-pink)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          opacity: submitting || !selected ? 0.5 : 1,
        }}
      >
        {submitting ? "Submitting…" : "Submit for review"}
      </button>
    </div>
  );
}
