import Link from "next/link";

// Shared shell for A3 Sign Up / A4 Sign In. Previously just a bare
// max-width column with no visual frame — content sat directly on
// --bg-primary, which combined with the (separately fixed) white-rgba
// input/border bug made the whole page read as floating unstyled text
// with nothing to anchor it, especially in the light "day" theme. Now
// wraps the form in an actual card (.card, see globals.css) so there's a
// visible boundary.
//
// No "← Back to Play" link anymore — SiteHeader (mounted by
// app/(auth)/layout.tsx) is already on every auth page with a clickable
// PLAY logo, so that link was a redundant second way to do the same
// thing. Card sits near the top of the page (small top padding, no
// vertical centering) instead of being centered in the viewport, so it
// doesn't float awkwardly low/high depending on form height.
export default function AuthShell({
  title,
  subtitle,
  children,
  maxWidth = 440,
  activeTab,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  // Sign Up's two-column layout (OAuth + email form / plan picker) needs
  // more room than Sign In's single column — overridable per page
  // instead of hardcoding one width for both.
  maxWidth?: number;
  // Renders a Sign In / Create Account tab row above the title, per the
  // tabbed-card look the user asked to match. These are plain links
  // between the two real routes, not client-side tab state — /sign-in
  // and /sign-up stay separate Next.js pages; clicking the inactive tab
  // just navigates, same as the old "New to Play?" footer link did.
  activeTab?: "sign-in" | "sign-up";
}) {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 73px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 20px 40px",
      }}
    >
      <div style={{ width: "100%", maxWidth }}>
        <div className="card" style={{ padding: "36px 32px" }}>
          {activeTab && (
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--border-soft)",
                marginBottom: 26,
              }}
            >
              <Link
                href="/sign-in"
                style={{
                  flex: 1,
                  textAlign: "center",
                  paddingBottom: 14,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 15,
                  color: activeTab === "sign-in" ? "var(--text-primary)" : "var(--text-muted)",
                  borderBottom:
                    activeTab === "sign-in" ? "2px solid var(--accent-pink)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                style={{
                  flex: 1,
                  textAlign: "center",
                  paddingBottom: 14,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 15,
                  color: activeTab === "sign-up" ? "var(--text-primary)" : "var(--text-muted)",
                  borderBottom:
                    activeTab === "sign-up" ? "2px solid var(--accent-pink)" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                Create Account
              </Link>
            </div>
          )}

          <div className="heading" style={{ fontSize: 30 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
              {subtitle}
            </div>
          )}
          <div style={{ marginTop: 26 }}>{children}</div>
        </div>
      </div>
    </main>
  );
}
