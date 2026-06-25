"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { DiscoverVenue, VenueCategory } from "../../types/database";
import VenueDetailModal from "../venue/VenueDetailModal";

// B1 — Home / Discover.
// Per Screen Inventory v1.0: "hero carousel, AI search bar, category
// filters, venue grid." Ported from the old MVP prototype (Play_V11.jsx)
// and rebuilt against the real Supabase `venues` table instead of the
// prototype's hardcoded VENUES array. The prototype's "Ask AI" search
// called the Anthropic API directly from the browser with a hardcoded
// key — that can't ship (no key belongs client-side), so this version is
// a plain client-side filter over name/area/category for now. Swapping in
// a real AI search just means replacing handleSearch's body with a call to
// a server action that hits the API server-side.
const CATEGORY_META: { id: "all" | VenueCategory; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "⚡" },
  { id: "events", label: "Events", emoji: "🎪" },
  { id: "restaurants", label: "Dining", emoji: "🍽" },
  { id: "beach", label: "Beach", emoji: "🏖" },
  { id: "finedining", label: "Fine Dining", emoji: "✦" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "brunch", label: "Brunch", emoji: "🥂" },
  { id: "exclusive", label: "Members", emoji: "👑" },
];

const TIER_ORDER = { free: 0, insider: 1, elite: 2 } as const;

// No real auth yet — treat every visitor as "free" tier so tier-gated
// venues correctly show the locked state. Once Supabase Auth lands, swap
// this for the signed-in user's actual tier.
const VIEWER_TIER: "free" | "insider" | "elite" = "free";

export default function HomeDiscover({ venues }: { venues: DiscoverVenue[] }) {
  const [category, setCategory] = useState<"all" | VenueCategory>("all");
  const [search, setSearch] = useState("");
  // B4 — Venue Detail Modal. Clicking a card's image/info area opens the
  // full detail view; the card's own "Book now" pill stays a direct link
  // into the booking engine for users who want to skip straight there.
  const [selected, setSelected] = useState<DiscoverVenue | null>(null);

  const areas = useMemo(
    () => Array.from(new Set(venues.map((v) => v.area))).sort(),
    [venues],
  );
  const [area, setArea] = useState("All Areas");

  const filtered = venues.filter((v) => {
    const catOk = category === "all" || v.category === category;
    const areaOk = area === "All Areas" || v.area === area;
    const q = search.trim().toLowerCase();
    const searchOk =
      !q || v.name.toLowerCase().includes(q) || v.area.toLowerCase().includes(q);
    return catOk && areaOk && searchOk;
  });

  const canView = (v: DiscoverVenue) => TIER_ORDER[VIEWER_TIER] >= TIER_ORDER[v.access_tier];

  const hero = venues.find((v) => v.is_featured) ?? venues[0];

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          margin: "20px 0 28px",
          position: "relative",
          minHeight: 420,
          borderRadius: 24,
          overflow: "hidden",
        }}
      >
        {hero?.cover_image ? (
          <img
            src={hero.cover_image}
            alt={hero.name}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,5,10,0.75) 0%, rgba(5,5,10,0.6) 50%, rgba(5,5,10,0.9) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "44px 24px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-pink)" }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: "var(--accent-pink)",
                textTransform: "uppercase",
              }}
            >
              Live in Dubai
            </span>
          </div>

          <div className="heading" style={{ fontSize: 56, lineHeight: 0.95, marginBottom: 14 }}>
            <span style={{ color: "var(--text-primary)" }}>YOUR CITY.</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange), var(--accent-gold))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              YOUR NIGHT.
            </span>
          </div>
          <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 26, maxWidth: 420, lineHeight: 1.6 }}>
            Browse Dubai's best beach clubs, restaurants and nightlife — book in seconds.
          </div>

          <div style={{ width: "100%", maxWidth: 560 }}>
            <input
              className="input-el"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venues or areas..."
              style={{ textAlign: "center", padding: "16px 18px" }}
            />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <div style={{ overflowX: "auto", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
          {CATEGORY_META.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className="btn"
                style={{
                  background: active
                    ? "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))"
                    : "rgba(255,255,255,0.05)",
                  color: active ? "#fff" : "var(--text-muted)",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  padding: "9px 18px",
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{c.emoji}</span> {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area pills */}
      {areas.length > 1 && (
        <div style={{ overflowX: "auto", marginBottom: 26 }}>
          <div style={{ display: "flex", gap: 7, paddingBottom: 4 }}>
            {["All Areas", ...areas].map((a) => {
              const active = area === a;
              return (
                <button
                  key={a}
                  onClick={() => setArea(a)}
                  className="btn"
                  style={{
                    background: active ? "rgba(255,45,120,0.15)" : "transparent",
                    color: active ? "var(--accent-pink)" : "var(--text-muted)",
                    border: `1px solid ${active ? "rgba(255,45,120,0.4)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: 20,
                    padding: "6px 16px",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  {a}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Results header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
        <span className="heading" style={{ fontSize: 28 }}>
          {category === "all" ? "All Venues" : CATEGORY_META.find((c) => c.id === category)?.label}
        </span>
        {area !== "All Areas" && (
          <span style={{ fontSize: 16, color: "var(--accent-pink)", fontWeight: 700 }}>in {area}</span>
        )}
        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>
          {filtered.length} place{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            color: "var(--text-muted)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18,
          }}
        >
          No venues match yet — try a different filter.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map((v) => {
            const locked = !canView(v);
            return (
              <div
                key={v.id}
                className="card-hover"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(v)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(v);
                  }}
                  style={{ display: "block", textDecoration: "none", color: "inherit", cursor: "pointer" }}
                >
                  <div style={{ position: "relative", height: 190 }}>
                    {v.cover_image && (
                      <img
                        src={v.cover_image}
                        alt={v.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: locked ? "blur(5px) brightness(0.4)" : "none",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(5,5,10,0.85) 0%, transparent 55%)",
                      }}
                    />
                    {locked && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        <div style={{ fontSize: 30 }}>👑</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-gold)" }}>
                          {v.access_tier === "elite" ? "Elite Only" : "Insider Only"}
                        </div>
                      </div>
                    )}
                    {v.play_tags?.[0] && (
                      <div style={{ position: "absolute", top: 12, left: 12 }}>
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: `${v.accent_color}22`,
                            color: v.accent_color,
                            border: `1px solid ${v.accent_color}44`,
                          }}
                        >
                          {v.play_tags[0]}
                        </span>
                      </div>
                    )}
                    {v.rating && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 10,
                          right: 12,
                          background: "rgba(0,0,0,0.7)",
                          borderRadius: 8,
                          padding: "3px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--accent-gold)",
                        }}
                      >
                        ★ {v.rating}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 8, marginTop: 2 }}>{v.area}</div>
                    </div>
                    {v.description && (
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.55 }}>
                        {v.description.slice(0, 80)}
                        {v.description.length > 80 ? "..." : ""}
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      {v.price_display && (
                        <span style={{ fontSize: 13, color: v.accent_color, fontWeight: 700 }}>{v.price_display}</span>
                      )}
                    </div>
                    {v.amenities?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                        {v.amenities.slice(0, 3).map((a) => (
                          <span
                            key={a}
                            style={{
                              fontSize: 10,
                              color: "var(--text-muted)",
                              background: "rgba(255,255,255,0.04)",
                              borderRadius: 6,
                              padding: "3px 9px",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "0 16px 16px" }}>
                    <Link
                      href={locked ? "/upgrade/checkout" : `/book/${v.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="btn"
                      style={{
                        display: "block",
                        width: "100%",
                        background: locked
                          ? "rgba(255,184,0,0.1)"
                          : "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
                        border: locked ? "1px solid rgba(255,184,0,0.3)" : "none",
                        color: "#fff",
                        borderRadius: 12,
                        padding: "10px",
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      {locked ? "👑 Unlock to Book" : "Book now →"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <VenueDetailModal
          venue={selected}
          locked={!canView(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
