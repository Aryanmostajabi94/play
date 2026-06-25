import Link from "next/link";

// Shared shell for A3 Sign Up / A4 Sign In. Previously just a bare
// max-width column with no visual frame — content sat directly on
// --bg-primary, which combined with the (separately fixed) white-rgba
// input/border bug made the whole page read as floating unstyled text
// with nothing to anchor it, especially in the light "day" theme. Now
// wraps the form in an actual card (.card, see globals.css) so there's a
// visible boundary, and centers the whole thing vertically too instead
// of just pinning it to the top of a tall, mostly-empty page.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link
          href="/"
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: 20,
          }}
        >
          ← Back to Play
        </Link>

        <div className="card" style={{ padding: "36px 32px" }}>
          <div className="heading" style={{ fontSize: 28 }}>
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
