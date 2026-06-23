import { notFound, redirect } from "next/navigation";
import ClaimShell from "../../../../components/claim/ClaimShell";
import { getVerificationSubmission } from "../../../../lib/venueClaim";
import ClaimResubmitButton from "../../../../components/claim/ClaimResubmitButton";

// G11 — Verification Failed. Reached when an admin (see H1-H5 Admin
// Panel) rejects a submission that landed on manual_review — the claim
// flow itself never sets status to 'rejected' on its own.
export default async function ClaimFailedPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  if (submission.status !== "rejected") redirect(`/claim/pending?sid=${sid}`);

  return (
    <ClaimShell title="We couldn't verify this listing" subtitle="A member of the Play team reviewed your submission and couldn't confirm ownership.">
      {submission.rejection_reason && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {submission.rejection_reason}
        </div>
      )}
      <ClaimResubmitButton submissionId={sid} />
    </ClaimShell>
  );
}
