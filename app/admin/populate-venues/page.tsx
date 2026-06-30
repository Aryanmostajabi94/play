"use client";

import { useState } from "react";

export default function PopulateVenuesPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthed(true);
    setError(null);
  }

  async function populate() {
    setLoading(true);
    setStatus("Calling Claude AI to generate venues — this takes ~30s...");
    setError(null);
    try {
      const res = await fetch("/api/admin/populate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus(null);
      } else {
        setStatus(`✓ ${data.inserted} venues added to Supabase`);
      }
    } catch {
      setError("Network error — check console");
      setStatus(null);
    }
    setLoading(false);
  }

  async function clearAll() {
    if (!confirm("Delete ALL venues from the database? This cannot be undone.")) return;
    setLoading(true);
    setStatus("Clearing all venues...");
    setError(null);
    try {
      const res = await fetch("/api/admin/clear-venues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus(null);
      } else {
        setStatus(`✓ Cleared ${data.deleted} venues from the database`);
      }
    } catch {
      setError("Network error — check console");
      setStatus(null);
    }
    setLoading(false);
  }

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "32px",
  };

  const btn = (primary: boolean): React.CSSProperties => ({
    width: "100%",
    background: primary
      ? loading ? "rgba(255,45,120,0.3)" : "linear-gradient(135deg,#FF2D78,#FF6B35)"
      : "transparent",
    border: primary ? "none" : "1px solid rgba(255,80,60,0.4)",
    borderRadius: 12,
    padding: "14px",
    color: primary ? "#fff" : "rgba(255,100,80,0.85)",
    fontSize: 14,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    letterSpacing: 0.3,
    transition: "all 0.18s",
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#05050A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'DM Sans', sans-serif",
        color: "#F5F0FF",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 38,
              letterSpacing: 4,
              background: "linear-gradient(135deg,#FF2D78,#FF6B35,#FFB800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PLAY
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(245,240,255,0.25)",
              marginTop: 2,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </div>
        </div>

        <div style={card}>
          {!authed ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Venue Populator</div>
              <div style={{ fontSize: 13, color: "rgba(245,240,255,0.35)", marginBottom: 24, lineHeight: 1.6 }}>
                Enter the admin password to access venue management.
              </div>
              <form onSubmit={handleAuth}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 12,
                    padding: "13px 16px",
                    color: "#F5F0FF",
                    fontSize: 14,
                    outline: "none",
                    fontFamily: "inherit",
                    marginBottom: 12,
                    boxSizing: "border-box",
                  }}
                />
                <button type="submit" style={btn(true)}>
                  Unlock →
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Venue Populator</div>
              <div style={{ fontSize: 13, color: "rgba(245,240,255,0.35)", marginBottom: 28, lineHeight: 1.6 }}>
                Generate 50 real Dubai venues via Claude AI and insert them into Supabase. Use{" "}
                <span style={{ color: "rgba(255,80,60,0.8)" }}>Clear All</span> to reset before
                regenerating.
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button onClick={populate} disabled={loading} style={btn(true)}>
                  {loading && status?.includes("Claude") ? "⏳  Generating venues..." : "✦  Auto-populate Dubai Venues"}
                </button>
                <button onClick={clearAll} disabled={loading} style={btn(false)}>
                  🗑  Clear All Venues
                </button>
              </div>

              {status && (
                <div
                  style={{
                    marginTop: 20,
                    padding: "14px 16px",
                    background: status.startsWith("✓")
                      ? "rgba(74,222,128,0.06)"
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${status.startsWith("✓") ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius: 12,
                    fontSize: 13,
                    color: status.startsWith("✓") ? "#4ade80" : "rgba(245,240,255,0.55)",
                    lineHeight: 1.6,
                  }}
                >
                  {status}
                </div>
              )}

              {error && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "14px 16px",
                    background: "rgba(255,45,120,0.07)",
                    border: "1px solid rgba(255,45,120,0.2)",
                    borderRadius: 12,
                    fontSize: 13,
                    color: "#FF2D78",
                    lineHeight: 1.6,
                  }}
                >
                  {error}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "rgba(245,240,255,0.15)" }}>
          /admin/populate-venues · Play Internal Tools
        </div>
      </div>
    </main>
  );
}
