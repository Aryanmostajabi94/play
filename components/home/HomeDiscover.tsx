"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DiscoverVenue, VenueCategory } from "../../types/database";
import VenueDetailModal from "../venue/VenueDetailModal";

const CATEGORY_META: { id: "all" | VenueCategory; label: string; emoji: string; lock?: boolean }[] = [
  { id: "all", label: "All", emoji: "⚡" },
  { id: "events", label: "Events", emoji: "🎪" },
  { id: "restaurants", label: "Dining", emoji: "🍽" },
  { id: "beach", label: "Beach", emoji: "🏖" },
  { id: "finedining", label: "Fine Dining", emoji: "✦" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "brunch", label: "Brunch", emoji: "🥂" },
  { id: "exclusive", label: "Members", emoji: "🔒", lock: true },
];

const TIER_ORDER = { free: 0, insider: 1, elite: 2 } as const;
const VIEWER_TIER: "free" | "insider" | "elite" = "free";
type SortMode = "rating" | "reviews";

export default function HomeDiscover({ venues }: { venues: DiscoverVenue[] }) {
  const [category, setCategory] = useState<"all" | VenueCategory>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("rating");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [favs, setFavs] = useState<string[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [selected, setSelected] = useState<DiscoverVenue | null>(null);

  const areas = useMemo(
    () => Array.from(new Set(venues.map((v) => v.area))).sort(),
    [venues],
  );
  const [area, setArea] = useState("All Areas");
  const heroes = useMemo(() => venues.slice(0, 4), [venues]);

  useEffect(() => {
    if (heroes.length < 2) return;
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % heroes.length), 5000);
    return () => clearInterval(t);
  }, [heroes.length]);

  const filtered = venues
    .filter((v) => {
      const catOk = category === "all" || v.category === category;
      const areaOk = area === "All Areas" || v.area === area;
      const q = search.trim().toLowerCase();
      const searchOk = !q || v.name.toLowerCase().includes(q) || v.area.toLowerCase().includes(q);
      return catOk && areaOk && searchOk;
    })
    .sort((a, b) =>
      sort === "rating" ? (b.rating ?? 0) - (a.rating ?? 0) : (b.review_count ?? 0) - (a.review_count ?? 0),
    );

  const canView = (v: DiscoverVenue) => TIER_ORDER[VIEWER_TIER] >= TIER_ORDER[v.access_tier];
  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };
  const hero = heroes[heroIdx];

  return (
    <div>
      {hero && (
        <section style={{ margin: "20px 0 0", position: "relative", height: 380, borderRadius: 20, overflow: "hidden" }}>
          {hero.cover_image ? (
            <img key={hero.id} src={hero.cover_image} alt={hero.name}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))" }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(5,5,10,0.82) 0%, rgba(5,5,10,0.4) 55%, rgba(5,5,10,0.15) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,10,0.75) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: 40, left: 40, right: 40 }}>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "rgba(245,240,255,0.6)", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>
              {hero.play_tags?.[0] ?? "Featured This Week"}
            </div>
            <div className="heading" style={{ fontSize: 46, lineHeight: 1.1, marginBottom: 10, maxWidth: 520 }}>{hero.name}</div>
            <div style={{ fontSize: 14, color: "rgba(245,240,255,0.6)", marginBottom: 28 }}>
              {hero.area}{hero.price_display ? ` · ${hero.price_display}` : ""}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href={canView(hero) ? `/book/${hero.slug}` : "/upgrade/checkout"} className="btn"
                style={{ textDecoration: "none", background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))", border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", fontSize: 14, fontWeight: 700 }}>
                {canView(hero) ? "Reserve →" : "👑 Unlock →"}
              </Link>
              <Link href="/map" className="btn"
                style={{ textDecoration: "none", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "12px 20px", color: "var(--text-primary)", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                🗺 View Map
              </Link>
            </div>
          </div>
          {heroes.length > 1 && (
            <div style={{ position: "absolute", bottom: 22, right: 24, display: "flex", gap: 7 }}>
              {heroes.map((_, i) => (
                <div key={i} onClick={() => setHeroIdx(i)}
                  style={{ width: i === heroIdx ? 22 : 6, height: 6, borderRadius: 3, background: i === heroIdx ? "var(--accent-pink)" : "rgba(255,255,255,0.25)", transition: "all 0.3s", cursor: "pointer" }} />
              ))}
            </div>
          )}
        </section>
      )}

      <div style={{ margin: "16px 0 0", position: "relative", maxWidth: 480 }}>
        <input className="input-el" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search venues, areas, events..." style={{ width: "100%", padding: "11px 16px" }} />
      </div>

      <Link href="/upgrade" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 0", background: "linear-gradient(135deg, rgba(255,45,120,0.1), rgba(255,107,53,0.07))", border: "1px solid rgba(255,45,120,0.18)", borderRadius: 14, padding: "16px 22px", textDecoration: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 38, flexShrink: 0, background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👑</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Unlock Members-Only Dubai</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>VIP entry, exclusive events, priority tables</div>
          </div>
        </div>
        <div style={{ color: "var(--accent-pink)", fontSize: 20, flexShrink: 0 }}>→</div>
      </Link>

      <div style={{ overflowX: "auto", marginTop: 20, marginBottom: 8 }}>
        <div style={{ display: "flex", gap: 8, paddingBottom: 4 }}>
          {CATEGORY_META.map((c) => {
            const active = category === c.id;
            return (
              <button key={c.id} onClick={() => setCategory(c.id)} className="btn"
                style={{ background: active ? "rgba(255,45,120,0.15)" : "rgba(255,255,255,0.045)", color: active ? "var(--accent-pink)" : "var(--text-muted)", border: `1px solid ${active ? "rgba(255,45,120,0.45)" : "rgba(255,255,255,0.08)"}`, borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 7 }}>
                <span>{c.emoji}</span> {c.label}
                {c.lock && <span style={{ background: "rgba(255,184,0,0.15)", color: "var(--accent-gold)", borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>✦</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {areas.length > 1 && (
          <div style={{ overflowX: "auto", flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", gap: 7, paddingBottom: 4 }}>
              {["All Areas", ...areas].map((a) => {
                const active = area === a;
                return (
                  <button key={a} onClick={() => setArea(a)} className="btn"
                    style={{ background: active ? "rgba(255,45,120,0.12)" : "transparent", border: `1px solid ${active ? "rgba(255,45,120,0.4)" : "rgba(255,255,255,0.07)"}`, color: active ? "var(--accent-pink)" : "var(--text-muted)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {a}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "7px 12px", color: "var(--text-muted)", fontSize: 12, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
            <option value="rating">Top Rated</option>
            <option value="reviews">Most Reviewed</option>
          </select>
          <button onClick={() => setView((v) => (v === "grid" ? "list" : "grid"))} className="btn"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "7px 12px", color: "var(--text-muted)", fontSize: 12 }}>
            {view === "grid" ? "☰ List" : "▦ Grid"}
          </button>
          <Link href="/claim" className="btn"
            style={{ textDecoration: "none", background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))", border: "none", borderRadius: 10, padding: "7px 14px", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
            + List Venue
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "22px 0 16px" }}>
        <span className="heading" style={{ fontSize: 28 }}>
          {category === "all" ? "Discover Dubai" : CATEGORY_META.find((c) => c.id === category)?.label}
        </span>
        {area !== "All Areas" && <span style={{ fontSize: 16, color: "var(--accent-pink)", fontWeight: 700 }}>in {area}</span>}
        <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: "auto" }}>{filtered.length} venue{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18 }}>
          No venues match yet — try a different filter.
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {filtered.map((v) => {
            const locked = !canView(v);
            const faved = favs.includes(v.id);
            return (
              <div key={v.id} className="card-hover" style={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 20, overflow: "hidden" }}>
                <div role="button" tabIndex={0} onClick={() => setSelected(v)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(v); }} style={{ display: "block", color: "inherit", cursor: "pointer" }}>
                  <div style={{ position: "relative", height: 190 }}>
                    {v.cover_image && <img src={v.cover_image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: locked ? "blur(5px) brightness(0.4)" : "none" }} />}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,10,0.85) 0%, transparent 55%)" }} />
                    {locked && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <div style={{ fontSize: 30 }}>👑</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--accent-gold)" }}>{v.access_tier === "elite" ? "Elite Only" : "Insider Only"}</div>
                      </div>
                    )}
                    {v.play_tags?.[0] && (
                      <div style={{ position: "absolute", top: 12, left: 12 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, background: `${v.accent_color}22`, color: v.accent_color, border: `1px solid ${v.accent_color}44` }}>{v.play_tags[0]}</span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: 12, right: 12 }}>
                      <div onClick={(e) => toggleFav(v.id, e)} style={{ width: 32, height: 32, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 15 }}>
                        {faved ? "❤️" : "🤍"}
                      </div>
                    </div>
                    {v.rating && (
                      <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.7)", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "var(--accent-gold)" }}>★ {v.rating}</div>
                    )}
                  </div>
                  <div style={{ padding: "14px 16px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginLeft: 8, marginTop: 2 }}>{v.area}</div>
                    </div>
                    {v.description && <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.55 }}>{v.description.slice(0, 80)}{v.description.length > 80 ? "..." : ""}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      {v.price_display && <span style={{ fontSize: 13, color: v.accent_color, fontWeight: 700 }}>{v.price_display}</span>}
                    </div>
                    {v.amenities?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                        {v.amenities.slice(0, 3).map((a) => <span key={a} style={{ fontSize: 10, color: "var(--text-muted)", background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "3px 9px", border: "1px solid rgba(255,255,255,0.06)" }}>{a}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "0 16px 16px" }}>
                    <Link href={locked ? "/upgrade/checkout" : `/book/${v.slug}`} onClick={(e) => e.stopPropagation()} className="btn"
                      style={{ display: "block", width: "100%", background: locked ? "rgba(255,184,0,0.1)" : "linear-gradient(135deg, #22c55e, #16a34a)", border: locked ? "1px solid rgba(255,184,0,0.3)" : "none", color: "#fff", borderRadius: 12, padding: "10px", fontSize: 12, fontWeight: 700, textAlign: "center", textDecoration: "none" }}>
                      {locked ? "👑 Unlock to Book" : "💬 WhatsApp to Book"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((v) => {
            const locked = !canView(v);
            return (
              <div key={v.id} className="card-hover" onClick={() => setSelected(v)} role="button" tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelected(v); }}
                style={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 14, overflow: "hidden", display: "flex", height: 110, cursor: "pointer" }}>
                <div style={{ width: 120, flexShrink: 0, position: "relative" }}>
                  {v.cover_image && <img src={v.cover_image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: locked ? "blur(5px) brightness(0.4)" : "none" }} />}
                </div>
                <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 16, fontWeight: 800 }}>{v.name}</span>
                      {v.rating && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--accent-gold)" }}>★ {v.rating}</div>}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>{v.area}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {v.price_display && <span style={{ fontSize: 13, color: v.accent_color, fontWeight: 700 }}>{v.price_display}</span>}
                    <Link href={locked ? "/upgrade/checkout" : `/book/${v.slug}`} onClick={(e) => e.stopPropagation()} className="btn"
                      style={{ background: locked ? "rgba(255,184,0,0.12)" : "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))", border: "none", borderRadius: 8, padding: "6px 14px", color: locked ? "var(--accent-gold)" : "#fff", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>
                      {locked ? "👑 Unlock" : "View →"}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <VenueDetailModal venue={selected} locked={!canView(selected)} onClose={() => setSelected(null)} />}
    </div>
  );
}
