import { notFound } from "next/navigation";
import ClaimShell, { VerifyStepper } from "../../../../../components/claim/ClaimShell";
import VerifyPhotoForm from "../../../../../components/claim/VerifyPhotoForm";
import { getVerificationSubmission } from "../../../../../lib/venueClaim";

// G7 — Live Photo.
export default async function VerifyPhotoPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();

  return (
    <ClaimShell title="Live photo" subtitle="A fresh photo of your venue's exterior, taken today.">
      <VerifyStepper current="photo" />
      <VerifyPhotoForm submissionId={sid} />
    </ClaimShell>
  );
}
