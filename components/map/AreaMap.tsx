"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { DiscoverVenue } from "../../types/database";

// Map view — ported from Play_V11.jsx's MapCanvas (area-heat blobs + glowing
// venue pins on a stylized grid). V11 hardcoded Dubai lat/lng for a fixed
// list of 9 areas; this app's `venues` table has no lat/lng column (and
// area is a free-text field set per venue, not a fixed list), so rather than
// fabricate coordinates, areas are laid out on a deterministic spiral and
// sized by how many *real* venues are in them — same "heatmap" visual
// language, honestly driven by real data instead of invented geo positions.
const PALETTE = ["#FF2D78", "#FF6B35", "#FFB800", "#00D4FF"];

const TIER_ORDER = { free: 0, insider: 1, elite: 2 } as const;
// Matches HomeDiscover.tsx — no real auth-tier wiring yet, so every visitor
// is treated as "free" until Supabase Auth carries a real tier.
const VIEWER_TIER: "free" | "insider" | "elite" = "free";

interface AreaPoint {
  name: string;
  x: number;
  y: number;
  heat: number;
  color: string;
  venues: DiscoverVenue[];
}

// Golden-angle spiral so any number of areas spread out without overlap,
// without needing hardcoded per-area coordinates.
function layoutAreas(areaNames: string[]): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  areaNames.forEach((name, i) => {
    const angle = i * 2.4; // golden angle in radians
    const radius = 0.1 + 0.075 * Math.sqrt(i + 1);
    const x = Math.min(0.86, Math.max(0.14, 0.5 + radius * Math.cos(angle)));
    const y = Math.min(0.84, Math.max(0.16, 0.5 + radius * Math.sin(angle) * 0.8));
    positions.set(name, { x, y });
  });
  return positions;
}

// Stable per-venue offset within its area's blob, derived from the venue id
// so pins don't jump around on re-render but also aren't claiming a real
// coordinate.
function venueOffset(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const a = (hash % 1000) / 1000;
  const b = ((hash >> 10) % 1000) / 1000;
  const angle = a * Math.PI * 2;
  const r = 0.02 + b * 0.035;
  return { dx: Math.cos(angle) * r, dy: Math.sin(angle) * r };
}

export default function AreaMap({ venues }: { venues: DiscoverVenue[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredVenue, setHoveredVenue] = useState<DiscoverVenue | null>(null);
  const [hoveredArea, setHoveredArea] = useState<AreaPoint | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const tickRef = useRef(0);
  const animRef = useRef<number | undefined>(undefined);

  const canView = (v: DiscoverVenue) => TIER_ORDER[VIEWER_TIER] >= TIER_ORDER[v.access_tier];

  const areas: AreaPoint[] = useMemo(() => {
    const grouped = new Map<string, DiscoverVenue[]>();
    venues.forEach((v) => {
      grouped.set(v.area, [...(grouped.get(v.area) ?? []), v]);
    });
    const names = Array.from(grouped.keys()).sort();
    const positions = layoutAreas(names);
    const maxCount = Math.max(1, ...Array.from(grouped.values()).map((vs) => vs.length));
    return names.map((name, i) => {
      const list = grouped.get(name) ?? [];
      const pos = positions.get(name)!;
      return {
        name,
        x: pos.x,
        y: pos.y,
        heat: list.length / maxCount,
        color: PALETTE[i % PALETTE.length],
        venues: list,
      };
    });
  }, [venues]);

  const venuePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number; color: string }>();
    areas.forEach((area) => {
      area.venues.forEach((v) => {
        const { dx, dy } = venueOffset(v.id);
        map.set(v.id, { x: area.x + dx, y: area.y + dy, color: area.color });
      });
    });
    return map;
  }, [areas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      tickRef.current += 0.02;
      const t = tickRef.current;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "#080812";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(255,45,120,0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 48) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }
      for (let i = 0; i < H; i += 48) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(W, i);
        ctx.stroke();
      }

      areas.forEach((area) => {
        const pulse = 1 + 0.08 * Math.sin(t * 1.2 + area.x * 10);
        const ax = area.x * W;
        const ay = area.y * H;
        const r = Math.max(50, 90 * area.heat * pulse);
        const alpha = 0.1 + 0.04 * Math.sin(t + area.y * 5);
        const gc = hexToRgb(area.color);
        const grad = ctx.createRadialGradient(ax, ay, 0, ax, ay, r);
        grad.addColorStop(0, `rgba(${gc},${alpha * 3})`);
        grad.addColorStop(0.35, `rgba(${gc},${alpha})`);
        grad.addColorStop(1, `rgba(${gc},0)`);
        ctx.beginPath();
        ctx.arc(ax, ay, r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.font = "600 9px DM Sans, sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.textAlign = "center";
        ctx.fillText(area.name.toUpperCase(), ax, ay + r * 0.5 + 16);
      });

      venues.forEach((v) => {
        const pos = venuePositions.get(v.id);
        if (!pos) return;
        const px = pos.x * W;
        const py = pos.y * H;
        const isHov = hoveredVenue?.id === v.id;
        const pulse2 = 1 + 0.15 * Math.sin(t * 2 + px);
        const pinR = isHov ? 10 : 7;
        const glowR = (isHov ? 22 : 15) * pulse2;
        const gc = hexToRgb(pos.color);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        glow.addColorStop(0, `rgba(${gc},0.45)`);
        glow.addColorStop(1, `rgba(${gc},0)`);
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, pinR, 0, Math.PI * 2);
        ctx.fillStyle = v.access_tier !== "free" ? "#FFB800" : pos.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, pinR * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.fill();
        if (v.access_tier !== "free") {
          ctx.font = "9px sans-serif";
          ctx.fillText("\u{1F451}", px - 5, py - 13);
        }
      });
    };
    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [areas, venues, venuePositions, hoveredVenue]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    let foundVenue: DiscoverVenue | null = null;
    venues.forEach((v) => {
      const pos = venuePositions.get(v.id);
      if (!pos) return;
      if (Math.sqrt((pos.x - mx) ** 2 + (pos.y - my) ** 2) < 0.025) foundVenue = v;
    });
    setHoveredVenue(foundVenue);

    let foundArea: AreaPoint | null = null;
    if (!foundVenue) {
      areas.forEach((a) => {
        if (Math.sqrt((a.x - mx) ** 2 + (a.y - my) ** 2) < 0.1) foundArea = a;
      });
    }
    setHoveredArea(foundArea);
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          borderRadius: 22,
          overflow: "hidden",
          border: "1px solid var(--border-soft)",
          height: 480,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", cursor: hoveredVenue || hoveredArea ? "pointer" : "default" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            setHoveredVenue(null);
            setHoveredArea(null);
          }}
          onClick={() => {
            if (hoveredVenue) {
              window.location.href = canView(hoveredVenue) ? `/book/${hoveredVenue.slug}` : "/upgrade/checkout";
            } else if (hoveredArea) {
              setActiveArea(hoveredArea.name);
            }
          }}
        />
        {hoveredVenue && (
          <div
            style={{
              position: "absolute",
              left: Math.min(mousePos.x + 14, 480),
              top: Math.max(mousePos.y - 90, 8),
              background: "rgba(8,8,18,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border-strong)",
              borderRadius: 14,
              padding: "13px 16px",
              pointerEvents: "none",
              minWidth: 200,
              boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "#F5F0FF", marginBottom: 4 }}>{hoveredVenue.name}</div>
            <div style={{ fontSize: 11, color: "rgba(245,240,255,0.45)", marginBottom: 3 }}>📍 {hoveredVenue.area}</div>
            {hoveredVenue.price_display && (
              <div style={{ fontSize: 13, color: hoveredVenue.accent_color, fontWeight: 700 }}>{hoveredVenue.price_display}</div>
            )}
            <div style={{ fontSize: 11, color: "rgba(245,240,255,0.3)", marginTop: 4 }}>
              {hoveredVenue.access_tier !== "free" ? "👑 Members only · " : ""}Click to view
            </div>
          </div>
        )}
        {hoveredArea && !hoveredVenue && (
          <div
            style={{
              position: "absolute",
              left: Math.min(mousePos.x + 14, 480),
              top: Math.max(mousePos.y - 70, 8),
              background: "rgba(8,8,18,0.97)",
              backdropFilter: "blur(20px)",
              border: "1px solid var(--border-strong)",
              borderRadius: 14,
              padding: "12px 16px",
              pointerEvents: "none",
              minWidth: 160,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "#F5F0FF", marginBottom: 6 }}>{hoveredArea.name}</div>
            <div style={{ fontSize: 11, color: "rgba(245,240,255,0.4)" }}>{hoveredArea.venues.length} venue{hoveredArea.venues.length === 1 ? "" : "s"} · click to view</div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(8,8,18,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,45,120,0.3)",
            borderRadius: 20,
            padding: "6px 14px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF2D78" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#FF2D78", letterSpacing: 1 }}>LIVE</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(8,8,18,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 11,
            color: "rgba(245,240,255,0.4)",
          }}
        >
          Dubai, UAE
        </div>
      </div>

      {/* Area list — same data the canvas renders, kept as plain links so the
          map is fully usable on touch devices / without hover, and so
          screen readers get real content instead of just a canvas. */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
        {areas.map((area) => (
          <button
            key={area.name}
            onClick={() => setActiveArea(activeArea === area.name ? null : area.name)}
            className="btn"
            style={{
              background: activeArea === area.name ? `${area.color}22` : "var(--surface)",
              border: `1px solid ${activeArea === area.name ? `${area.color}66` : "var(--border-soft)"}`,
              borderRadius: 20,
              padding: "7px 14px",
              fontSize: 12,
              fontWeight: 700,
              color: activeArea === area.name ? area.color : "var(--text-muted)",
            }}
          >
            {area.name} · {area.venues.length}
          </button>
        ))}
      </div>

      {activeArea && (
        <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {areas
            .find((a) => a.name === activeArea)
            ?.venues.map((v) => {
              const locked = !canView(v);
              return (
                <Link
                  key={v.id}
                  href={locked ? "/upgrade/checkout" : `/book/${v.slug}`}
                  className="card-hover"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    background: "var(--surface)",
                    border: "1px solid var(--border-soft)",
                    borderRadius: 16,
                    padding: 14,
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                    {locked ? "👑 " : ""}
                    {v.name}
                  </div>
                  {v.price_display && (
                    <div style={{ fontSize: 12, color: v.accent_color, fontWeight: 700 }}>{v.price_display}</div>
                  )}
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
