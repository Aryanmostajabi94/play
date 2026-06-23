"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { searchVenuesAction } from "../../app/actions/venueClaimSearch";
import type { GhostVenue } from "../../lib/venueClaim";

// G2 — Find Your Listing.
export default function ClaimFindForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GhostVenue[] | null>(null);
  const [searching, setSearching] = useState(false);

  async function handleSearch() {
    setSearching(true);
    const res = await searchVenuesAction(query);
    setResults(res);
    setSearching(false);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Venue name"
          className="input-el"
          style={{ flex: 1 }}
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="btn"
          style={{
            padding: "0 18px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            color: "var(--text-primary)",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {searching ? "…" : "Search"}
        </button>
      </div>

      {results !== null && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          {results.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
              No unclaimed listings matched. If your venue isn't on Play yet, reach out to us to
              get added.
            </div>
          ) : (
            results.map((v) => (
              <div
                key={v.id}
                onClick={() => router.push(`/claim/account?venue=${v.id}`)}
                className="btn"
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {v.area} · {v.address}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
