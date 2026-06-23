"use client";

import { useState } from "react";
import { updateVenueStatusAdmin } from "../../app/actions/admin";
import type { AdminVenueRow } from "../../lib/admin";

const STATUS_OPTIONS: AdminVenueRow["status"][] = ["draft", "live", "suspended", "removed"];

const TIER_LABELS: Record<string, string> = { ghost: "Ghost", claimed: "Claimed", partner: "Partner" };

// H2 — Venue Management. Per Tasks Tracker: "List all venues. Filter by
// tier/status. Edit, publish, suspend." Listing editing itself lives in
// F5; this scopes to the admin-only status lever (publish/suspend/remove).
export default function AdminVenuesTable({ venues }: { venues: AdminVenueRow[] }) {
  const [rows, setRows] = useState(venues);
  const [tierFilter, setTierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = rows.filter(
    (v) => (!tierFilter || v.listing_tier === tierFilter) && (!statusFilter || v.status === statusFilter),
  );

  async function handleStatusChange(venueId: string, status: AdminVenueRow["status"]) {
    setRows((cur) => cur.map((v) => (v.id === venueId ? { ...v, status } : v)));
    await updateVenueStatusAdmin(venueId, status);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="input-el" style={{ width: 160 }}>
          <option value="">All tiers</option>
          <option value="ghost">Ghost</option>
          <option value="claimed">Claimed</option>
          <option value="partner">Partner</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-el" style={{ width: 160 }}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 8, padding: "0 14px", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 8 }}>
        <div>Venue</div>
        <div>Area</div>
        <div>Tier</div>
        <div>Status</div>
        <div>Change status</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((v) => (
          <div
            key={v.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
              gap: 8,
              alignItems: "center",
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 700 }}>{v.name}</div>
            <div style={{ color: "var(--text-muted)" }}>{v.area}</div>
            <div>{TIER_LABELS[v.listing_tier]}</div>
            <div>{v.status}</div>
            <select
              value={v.status}
              onChange={(e) => handleStatusChange(v.id, e.target.value as AdminVenueRow["status"])}
              className="input-el"
              style={{ fontSize: 12 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--text-muted)", padding: 14 }}>No venues match these filters.</div>
        )}
      </div>
    </div>
  );
}
