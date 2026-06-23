import { listVenuesAdmin } from "../../../../lib/admin";
import AdminVenuesTable from "../../../../components/admin/AdminVenuesTable";

// H2 — Venue Management.
export default async function AdminVenuesPage() {
  const venues = await listVenuesAdmin();

  return (
    <div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 24 }}>
        Venues ({venues.length})
      </div>
      <AdminVenuesTable venues={venues} />
    </div>
  );
}
