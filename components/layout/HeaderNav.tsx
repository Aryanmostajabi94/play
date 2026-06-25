"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Icon+label nav items matching the VENUE DXB-style header reference the
// user pointed at: Discover / Map / Saved / Membership stacked icon-over-
// label, with the current section highlighted. Pulled into its own client
// component (SiteHeader itself stays a server component fetching the
// signed-in user) since active-state highlighting needs the current
// pathname, which only usePathname can give us.
const NAV_ITEMS = [
  { href: "/", label: "Discover", icon: "✦", match: (p: string) => p === "/" },
  { href: "/map", label: "Map", icon: "🗺", match: (p: string) => p.startsWith("/map") },
  { href: "/saved", label: "Saved", icon: "♡", match: (p: string) => p.startsWith("/saved") },
  {
    href: "/upgrade/checkout",
    label: "Membership",
    icon: "👑",
    match: (p: string) => p.startsWith("/upgrade"),
  },
];

export default function HeaderNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
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
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
