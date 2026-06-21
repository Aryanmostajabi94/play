// Stat card used on F1 Venue Dashboard Home.
export default function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "20px 22px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 8,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        className="heading"
        style={{ fontSize: 34, color: accent ?? "var(--text-primary)" }}
      >
        {value}
      </div>
    </div>
  );
}
