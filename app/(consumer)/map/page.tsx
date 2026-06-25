// Map nav item now lives in the header (see components/layout/HeaderNav.tsx)
// alongside Discover/Saved/Membership. The interactive map (canvas pins,
// area heatmap) from Play_V11.jsx hasn't been ported into this Next.js app
// yet — this is a placeholder landing spot so the nav link resolves to a
// real page instead of a 404 in the meantime.
export default function MapPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>🗺</div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 10 }}>
        Map view is on its way
      </div>
      <div style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
        We're building an interactive map of venues by area. For now, browse
        and filter by area from Discover.
      </div>
    </main>
  );
}
