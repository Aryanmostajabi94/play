import { notFound, redirect } from "next/navigation";
import ClaimShell from "../../../../components/claim/ClaimShell";
import { getVerificationSubmission } from "../../../../lib/venueClaim";

// G9 — Pending Review. Shown when finalizeSubmission() lands the
// submission on manual_review (optional check was "manual", or some
// required check didn't pass) rather than auto-approving.
export default async function ClaimPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  if (submission.status === "approved") redirect(`/claim/approved?sid=${sid}`);
  if (submission.status === "rejected") redirect(`/claim/failed?sid=${sid}`);

  return (
    <ClaimShell title="You're in review" subtitle="We'll email you once a member of the Play team has checked your submission.">
      <div
        style={{
          padding: "16px 18px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        This usually takes 1–2 business days. No need to do anything else for now.
      </div>
    </ClaimShell>
  );
}
