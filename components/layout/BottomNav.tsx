"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Fixed bottom tab bar — Play_V11.jsx has both a top header nav AND this
// bottom icon bar at once (not a replacement for HeaderNav), so this adds
// the missing half rather than duplicating logic: same destinations as
// HeaderNav, just the mobile-app-style bottom placement V11 actually uses.
// Hidden above 720px since HeaderNav already covers desktop and a
// permanent bottom bar on a wide screen isn't part of V11's layout either
// (V11's own breakpoint behavior isn't recoverable from the file, so this
// picks the smallest reasonable cutoff that keeps desktop unchanged).
const NAV_ITEMS = [
  { href: "/", label: "Discover", icon: "⚡", match: (p: string) => p === "/" },
  { href: "/map", label: "Map", icon: "🗺", match: (p: string) => p.startsWith("/map") },
  { href: "/saved", label: "Saved", icon: "🤍", match: (p: string) => p.startsWith("/saved") },
  {
    href: "/upgrade/checkout",
    label: "Members",
    icon: "👑",
    match: (p: string) => p.startsWith("/upgrade"),
  },
];

export default function BottomNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      className="play-bottom-nav"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 8px",
        background: "color-mix(in srgb, var(--bg-primary) 94%, transparent)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--border-soft)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              textDecoration: "none",
              color: active ? "var(--accent-pink)" : "var(--text-muted)",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
