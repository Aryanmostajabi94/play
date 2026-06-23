"use server";

import { redirect } from "next/navigation";
import {
  createVenueClaim,
  submitTradeLicense,
  verifyPhoneOtp,
  confirmGoogleMapsMatch,
  submitLivePhoto,
  submitOptionalCheck,
  finalizeSubmission,
  resubmitVerification,
  getVerificationSubmission,
  type OptionalCheckType,
} from "../../lib/venueClaim";

// G3 — Create Venue Account. Redirects straight into the verification
// stepper (G4) on success, carrying the submission id as ?sid=.
export async function createVenueAccountAction(
  venueId: string,
  name: string,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await createVenueClaim(venueId, name, email);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  redirect(`/claim/verify/trade-license?sid=${result.submissionId}`);
}

export async function submitTradeLicenseAction(
  submissionId: string,
  url: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await submitTradeLicense(submissionId, url);
  if (!result.success) return result;
  redirect(`/claim/verify/phone?sid=${submissionId}`);
}

export async function verifyPhoneOtpAction(
  submissionId: string,
  code: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await verifyPhoneOtp(submissionId, code);
  if (!result.success) return result;
  redirect(`/claim/verify/maps?sid=${submissionId}`);
}

export async function confirmGoogleMapsMatchAction(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await confirmGoogleMapsMatch(submissionId);
  if (!result.success) return result;
  redirect(`/claim/verify/photo?sid=${submissionId}`);
}

export async function submitLivePhotoAction(
  submissionId: string,
  url: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await submitLivePhoto(submissionId, url);
  if (!result.success) return result;
  redirect(`/claim/verify/optional?sid=${submissionId}`);
}

// G8 — last verify step. Saves the optional check, then immediately
// finalizes the submission and routes to G9 (pending review) or, if
// every check (required + optional) passed, straight to G10 (approved).
export async function submitOptionalCheckAction(
  submissionId: string,
  checkType: OptionalCheckType,
): Promise<{ success: boolean; error?: string }> {
  const saveResult = await submitOptionalCheck(submissionId, checkType);
  if (!saveResult.success) return saveResult;

  const finalizeResult = await finalizeSubmission(submissionId);
  if (!finalizeResult.success) return finalizeResult;

  const submission = await getVerificationSubmission(submissionId);
  if (submission?.status === "approved") {
    redirect(`/claim/approved?sid=${submissionId}`);
  }
  redirect(`/claim/pending?sid=${submissionId}`);
}

// G11 — Resubmit after rejection, back into the G4 trade-license step.
export async function resubmitVerificationAction(submissionId: string): Promise<void> {
  await resubmitVerification(submissionId);
  redirect(`/claim/verify/trade-license?sid=${submissionId}`);
}
