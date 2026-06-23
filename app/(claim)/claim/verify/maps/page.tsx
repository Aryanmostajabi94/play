import { notFound } from "next/navigation";
import ClaimShell, { VerifyStepper } from "../../../../../components/claim/ClaimShell";
import VerifyMapsForm from "../../../../../components/claim/VerifyMapsForm";
import { getVerificationSubmission, getGhostVenue } from "../../../../../lib/venueClaim";

// G6 — Google Maps Match.
export default async function VerifyMapsPage({
  searchParams,
}: {
  searchParams: Promise<{ sid?: string }>;
}) {
  const { sid } = await searchParams;
  if (!sid) notFound();
  const submission = await getVerificationSubmission(sid);
  if (!submission) notFound();
  const venue = await getGhostVenue(submission.venue_id);

  return (
    <ClaimShell title="Confirm your location" subtitle="Make sure this matches your venue on Google Maps.">
      <VerifyStepper current="maps" />
      <VerifyMapsForm submissionId={sid} address={venue?.address ?? "Address on file"} />
    </ClaimShell>
  );
}
