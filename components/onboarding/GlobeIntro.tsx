"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// A1 — Globe Intro.
// Per Screen Inventory v1.0: "Animated 3D globe. User selects their city
// before entering the app." This screen never existed anywhere in the v1
// codebase — the original "Safari bug with Three.js" note referred to an
// old MVP prototype (Play_V10/V11.jsx) that isn't present in this repo, so
// there was nothing to port or patch (see the AskUserQuestion scope
// correction earlier in this build).
//
// Built here as a CSS/SVG animation rather than pulling in Three.js +
// WebGL: Play only operates in one real city (Dubai — see `users.city
// default 'Dubai'` in the schema, and every seeded venue is Dubai-based),
// so a real WebGL globe would be a lot of new dependency weight to spin a
// sphere that ultimately resolves to a single selectable point. A CSS
// globe gets the same "this is a global, premium product" feeling without
// reintroducing the exact Safari/WebGL bug class this task was originally
// about fixing. Other cities are shown as locked "Coming soon" pins so the
// multi-city ambition in the PRD is visible without faking data for cities
// Play doesn't actually have venues in yet.
const CITIES = [
  { name: "Dubai", top: "46%", left: "62%", live: true },
  { name: "Riyadh", top: "44%", left: "58%", live: false },
  { name: "London", top: "30%", left: "46%", live: false },
  { name: "New York", top: "34%", left: "22%", live: false },
  { name: "Singapore", top: "62%", left: "78%", live: false },
];

export default function GlobeIntro() {
  const router = useRouter();
  const [zooming, setZooming] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  function selectDubai() {
    if (zooming) return;
    document.cookie = "play_seen_intro=1; path=/; max-age=31536000";
    setZooming(true);
    // A2 — City Zoom Animation: full-screen city name beat before landing
    // on Home, per Screen Inventory. Short enough to feel snappy, long
    // enough to read.
    setTimeout(() => router.push("/"), 1100);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "20px",
      }}
    >
      {zooming ? (
        <div
          className="heading"
          style={{
            fontSize: "clamp(48px, 12vw, 110px)",
            textAlign: "center",
            background: "linear-gradient(135deg, var(--accent-pink), var(--accent-gold))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: "play-city-zoom 1.1s ease-out forwards",
          }}
        >
          DUBAI
        </div>
      ) : (
        <>
          <div
            className="heading"
            style={{ fontSize: 22, letterSpacing: 2, marginBottom: 36, color: "var(--text-muted)" }}
          >
            PLAY
          </div>

          <div
            style={{
              position: "relative",
              width: "min(86vw, 360px)",
              height: "min(86vw, 360px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 32% 28%, rgba(0,212,255,0.22), rgba(5,5,10,0.95) 70%)",
              border: "1px solid rgba(0, 212, 255, 0.25)",
              boxShadow: "0 0 60px rgba(255, 45, 120, 0.18), inset 0 0 60px rgba(0,0,0,0.6)",
              animation: "play-globe-spin 18s linear infinite",
            }}
          >
            {/* latitude/longitude grid lines give the sphere illusion */}
            {[18, 36, 54, 72].map((pct) => (
              <div
                key={`lat-${pct}`}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${pct}%`,
                  height: 1,
                  background: "rgba(0, 212, 255, 0.12)",
                  borderRadius: "50%",
                }}
              />
            ))}
            {[20, 40, 60, 80].map((pct) => (
              <div
                key={`lon-${pct}`}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: `${pct}%`,
                  width: 1,
                  background: "rgba(0, 212, 255, 0.12)",
                  borderRadius: "50%",
                }}
              />
            ))}

            {CITIES.map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={city.live ? selectDubai : undefined}
                onMouseEnter={() => setHovered(city.name)}
                onMouseLeave={() => setHovered(null)}
                disabled={!city.live}
                className="btn"
                style={{
                  position: "absolute",
                  top: city.top,
                  left: city.left,
                  transform: "translate(-50%, -50%)",
                  width: city.live ? 16 : 10,
                  height: city.live ? 16 : 10,
                  borderRadius: "50%",
                  border: "none",
                  padding: 0,
                  background: city.live ? "var(--accent-pink)" : "rgba(245,240,255,0.25)",
                  boxShadow: city.live ? "0 0 16px var(--accent-pink)" : "none",
                  cursor: city.live ? "pointer" : "default",
                }}
                aria-label={city.live ? `Select ${city.name}` : `${city.name} — coming soon`}
              />
            ))}

            {hovered && (
              <div
                style={{
                  position: "absolute",
                  bottom: -34,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 12,
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {hovered}
                {!CITIES.find((c) => c.name === hovered)?.live && " — coming soon"}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={selectDubai}
            className="btn"
            style={{
              marginTop: 56,
              padding: "14px 36px",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            Enter Dubai
          </button>
          <div style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)" }}>
            More cities coming soon
          </div>
        </>
      )}
    </main>
  );
}
