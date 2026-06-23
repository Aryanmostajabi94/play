"use client";

import { useState } from "react";
import { resubmitVerificationAction } from "../../app/actions/venueClaim";

// G11 — resubmit, sends the owner back to G4 (trade license) with the
// same submission id so they can fix whatever caused the rejection.
export default function ClaimResubmitButton({ submissionId }: { submissionId: string }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    setSubmitting(true);
    await resubmitVerificationAction(submissionId);
  }

  return (
    <button
      onClick={handleClick}
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
      {submitting ? "Starting…" : "Resubmit for review"}
    </button>
  );
}
