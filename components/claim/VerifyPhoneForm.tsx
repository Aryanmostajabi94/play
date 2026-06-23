"use client";

import { useState } from "react";
import { verifyPhoneOtpAction } from "../../app/actions/venueClaim";
import { DEMO_OTP_CODE } from "../../lib/venueClaim";

// G5 — Phone OTP. No SMS provider is configured, so the "sent" code is a
// fixed demo value rather than a real text message.
export default function VerifyPhoneForm({ submissionId }: { submissionId: string }) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await verifyPhoneOtpAction(submissionId, code);
    setSubmitting(false);
    if (res && !res.success) setError(res.error ?? "Something went wrong.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
        No SMS provider is configured yet, so we can't send a real text. Enter the demo code{" "}
        <strong style={{ color: "var(--text-primary)" }}>{DEMO_OTP_CODE}</strong> to continue.
      </div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6-digit code"
        className="input-el"
      />
      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={submitting || !code.trim()}
        className="btn"
        style={{
          padding: "14px 20px",
          borderRadius: 14,
          background: "var(--accent-pink)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          opacity: submitting || !code.trim() ? 0.5 : 1,
        }}
      >
        {submitting ? "Checking…" : "Verify"}
      </button>
    </div>
  );
}
