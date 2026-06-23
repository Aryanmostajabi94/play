import AdminNav from "../../components/admin/AdminNav";

// Shared layout for the internal admin panel (Section H). A third
// product surface alongside the consumer app and venue dashboard.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <AdminNav />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 60px" }}>
        {children}
      </div>
    </div>
  );
}
