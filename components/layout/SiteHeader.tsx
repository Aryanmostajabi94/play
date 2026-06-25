import Link from "next/link";
import { getCurrentUser } from "../../lib/auth";
import { signOutAction } from "../../app/actions/auth";

// Shared top nav for the consumer app — previously only Home (app/page.tsx)
// had a header at all, hand-rolled inline; every other consumer page
// (profile, bookings, settings, billing, notifications) had none, so
// there was no way back to Home or between sections without the browser
// back button. This is that same header, pulled out into one component
// and mounted in app/(consumer)/layout.tsx plus Home itself, so it's on
// every consumer page consistently. Deliberately NOT used by (venue) or
// (admin) — those are separate product surfaces with their own nav
// (VenueNav / AdminNav), and (auth)/(claim) keep their own minimal
// "back to Play" shells.
export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        // Translucent + blurred rather than a flat fill — matches
        // Play_V11.jsx's header (rgba bg-primary + backdrop-filter blur),
        // so content scrolling underneath shows through softly instead of
        // the header reading as a separate solid bar.
        background:
          "color-mix(in srgb, var(--bg-primary) 92%, transparent)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border-soft)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 20px",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <Link
          href="/"
          className="heading"
          style={{
            fontSize: 26,
            textDecoration: "none",
            // Gradient-clipped text instead of a flat color — matches the
            // PLAY wordmark treatment in Play_V11.jsx (and the gradient
            // already used on Sign up's CTA button), so the logo reads as
            // the same brand mark across the prototype and this app.
            background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange), var(--accent-gold))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          PLAY
        </Link>
        <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
        {user ? (
          <>
            <Link
              href="/notifications"
              style={{ fontSize: 20, textDecoration: "none" }}
              aria-label="Notifications"
            >
              🔔
            </Link>
            <Link
              href="/bookings"
              style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
            >
              My bookings
            </Link>
            <Link
              href="/profile"
              style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
            >
              Profile
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="btn"
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/sign-in"
              style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
              }}
            >
              Sign up
            </Link>
          </>
        )}
          <Link
            href="/claim"
            style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
          >
            List your venue
          </Link>
        </nav>
      </div>
    </header>
  );
}
