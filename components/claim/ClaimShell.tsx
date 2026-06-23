import Link from "next/link";

// Shared shell for the G1-G11 claim & verification flow — a narrow,
// centered column (this flow is filled out by a venue owner at a desk,
// not browsed like the consumer Discover grid, but it still lives in the
// same (claim) route group as plain pages rather than a full app shell).
export default function ClaimShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "48px 20px 80px" }}>
      <Link
        href="/"
        style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}
      >
        ← Back to Play
      </Link>
      <div className="heading" style={{ fontSize: 26, marginTop: 20 }}>
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

const STEPS = [
  { key: "trade-license", label: "Trade license" },
  { key: "phone", label: "Phone" },
  { key: "maps", label: "Maps" },
  { key: "photo", label: "Photo" },
  { key: "optional", label: "Extra check" },
];

// G4-G8 — the 5-step verification stepper. Shows progress through the
// required checks (trade license, phone OTP, Google Maps match, live
// photo) plus the one optional check.
export function VerifyStepper({ current }: { current: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
      {STEPS.map((step, i) => (
        <div
          key={step.key}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background:
              i <= currentIndex ? "var(--accent-pink)" : "rgba(255,255,255,0.1)",
          }}
          title={step.label}
        />
      ))}
    </div>
  );
}
