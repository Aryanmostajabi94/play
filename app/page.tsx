import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div className="heading" style={{ fontSize: 48 }}>
        PLAY
      </div>
      <Link
        href="/book/cove-beach-bluewaters"
        className="btn"
        style={{
          background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
          color: "#fff",
          borderRadius: 14,
          padding: "14px 28px",
          fontSize: 14,
          fontWeight: 800,
          textDecoration: "none",
        }}
      >
        Book Cove Beach →
      </Link>
    </main>
  );
}
