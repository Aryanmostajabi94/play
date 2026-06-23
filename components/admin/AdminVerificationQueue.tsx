"use client";

import { useState } from "react";
import { approveVerification, rejectVerification } from "../../app/actions/admin";
import type { AdminVerificationRow } from "../../lib/admin";

const CHECK_LABELS: { key: keyof AdminVerificationRow; label: string }[] = [
  { key: "trade_license_verified", label: "Trade license" },
  { key: "phone_otp_verified", label: "Phone" },
  { key: "google_maps_verified", label: "Maps" },
  { key: "live_photo_verified", label: "Photo" },
];

// H3 — Verification Queue. Per Tasks Tracker: "List of pending manual
// verification submissions. Approve/reject with notes."
export default function AdminVerificationQueue({ submissions }: { submissions: AdminVerificationRow[] }) {
  const [rows, setRows] = useState(submissions);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [reasonById, setReasonById] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string>>({});

  async function handleApprove(id: string) {
    setBusyId(id);
    const res = await approveVerification(id, notesById[id] ?? "");
    setBusyId(null);
    if (res.success) {
      setRows((cur) => cur.filter((r) => r.id !== id));
    } else {
      setErrorById((cur) => ({ ...cur, [id]: res.error ?? "Could not approve." }));
    }
  }

  async function handleReject(id: string) {
    setBusyId(id);
    const res = await rejectVerification(id, reasonById[id] ?? "", notesById[id] ?? "");
    setBusyId(null);
    if (res.success) {
      setRows((cur) => cur.filter((r) => r.id !== id));
    } else {
      setErrorById((cur) => ({ ...cur, [id]: res.error ?? "Could not reject." }));
    }
  }

  if (rows.length === 0) {
    return <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Nothing waiting on review.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            padding: 16,
            borderRadius: 16,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{row.venue_name}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase" }}>{row.status}</div>
          </div>

          <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
            {CHECK_LABELS.map((c) => (
              <div key={c.key} style={{ fontSize: 12, color: row[c.key] ? "var(--accent-pink)" : "var(--text-muted)" }}>
                {row[c.key] ? "✓" : "✗"} {c.label}
              </div>
            ))}
            <div style={{ fontSize: 12, color: row.optional_check_verified ? "var(--accent-pink)" : "var(--text-muted)" }}>
              {row.optional_check_verified ? "✓" : "✗"} {row.optional_check_used ?? "no optional check"}
            </div>
          </div>

          <textarea
            placeholder="Internal notes (optional)"
            value={notesById[row.id] ?? ""}
            onChange={(e) => setNotesById((cur) => ({ ...cur, [row.id]: e.target.value }))}
            className="input-el"
            style={{ width: "100%", minHeight: 50, marginBottom: 8, resize: "vertical" }}
          />
          <input
            placeholder="Rejection reason (required to reject)"
            value={reasonById[row.id] ?? ""}
            onChange={(e) => setReasonById((cur) => ({ ...cur, [row.id]: e.target.value }))}
            className="input-el"
            style={{ width: "100%", marginBottom: 10 }}
          />

          {errorById[row.id] && (
            <div style={{ color: "var(--accent-pink)", fontSize: 13, marginBottom: 8 }}>{errorById[row.id]}</div>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleApprove(row.id)}
              disabled={busyId === row.id}
              className="btn"
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                background: "var(--accent-pink)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                opacity: busyId === row.id ? 0.5 : 1,
              }}
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(row.id)}
              disabled={busyId === row.id}
              className="btn"
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: 13,
                opacity: busyId === row.id ? 0.5 : 1,
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
