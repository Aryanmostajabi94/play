import { notFound } from "next/navigation";
import ClaimShell, { VerifyStepper } from "../../../../../components/claim/ClaimShell";
import VerifyTradeLicenseForm from "../../../../../components/claim/VerifyTradeLicenseForm";
import { getVerificationSubmission } from "../../../../../lib/venueClaim";

// G4 — Trade License.
export default async function VerifyTradeLicensePage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  return (
    <ClaimShell title="Trade license" subtitle="Upload your trade license to confirm this is a real business.">
      <VerifyStepper current="trade-license" />
      <VerifyTradeLicenseForm submissionId={sid} />
    </ClaimShell>
  );
}
