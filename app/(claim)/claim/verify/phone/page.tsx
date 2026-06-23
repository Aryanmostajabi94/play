import { notFound } from "next/navigation";
import ClaimShell, { VerifyStepper } from "../../../../../components/claim/ClaimShell";
import VerifyPhoneForm from "../../../../../components/claim/VerifyPhoneForm";
import { getVerificationSubmission } from "../../../../../lib/venueClaim";

// G5 — Phone OTP.
export default async function VerifyPhonePage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  return (
    <ClaimShell title="Verify your phone" subtitle="We sent a code to your registered number.">
      <VerifyStepper current="phone" />
      <VerifyPhoneForm submissionId={sid} />
    </ClaimShell>
  );
}
