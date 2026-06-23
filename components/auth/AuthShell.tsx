import Link from "next/link";

// Shared shell for A3 Sign Up / A4 Sign In — mirrors components/claim/ClaimShell.tsx's
// narrow centered-column pattern for visual consistency across the app's
// secondary (non-Discover-grid) flows.
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
    <main style={{ maxWidth: 420, margin: "0 auto", padding: "64px 20px 80px" }}>
      <Link
        href="/"
        style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
      >
        ← Back to Play
      </Link>
      <div className="heading" style={{ fontSize: 30, marginTop: 20 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.5 }}>
          {subtitle}
        </div>
      )}
      <div style={{ marginTop: 28 }}>{children}</div>
    </main>
  );
}
