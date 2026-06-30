import Link from "next/link";

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
  maxWidth?: number;
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
