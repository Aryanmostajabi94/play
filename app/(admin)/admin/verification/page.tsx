import { listVerificationQueue } from "../../../../lib/admin";
import AdminVerificationQueue from "../../../../components/admin/AdminVerificationQueue";

// H3 — Verification Queue.
export default async function AdminVerificationPage() {
  const submissions = await listVerificationQueue();

  return (
    <div>
      <div className="heading" style={{ fontSize: 28, marginBottom: 24 }}>
        Verification queue ({submissions.length})
      </div>
      <AdminVerificationQueue submissions={submissions} />
    </div>
  );
}
