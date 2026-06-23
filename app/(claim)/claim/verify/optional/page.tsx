import { notFound } from "next/navigation";
import ClaimShell, { VerifyStepper } from "../../../../../components/claim/ClaimShell";
import VerifyOptionalForm from "../../../../../components/claim/VerifyOptionalForm";
import { getVerificationSubmission } from "../../../../../lib/venueClaim";

// G8 — Optional Check (last verify step — submits for review on completion).
export default async function VerifyOptionalPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  return (
    <ClaimShell title="One more check" subtitle="Pick one extra way to confirm you're the real owner.">
      <VerifyStepper current="optional" />
      <VerifyOptionalForm submissionId={sid} />
    </ClaimShell>
  );
}
