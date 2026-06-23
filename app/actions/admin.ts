"use server";

import { revalidatePath } from "next/cache";
import {
  updateVenueStatusAdmin as updateVenueStatusAdminImpl,
  approveVerification as approveVerificationImpl,
  rejectVerification as rejectVerificationImpl,
} from "../../lib/admin";

// H2 — Venue Management.
export async function updateVenueStatusAdmin(
  venueId: string,
  status: "draft" | "live" | "suspended" | "removed",
): Promise<{ success: boolean; error?: string }> {
  const result = await updateVenueStatusAdminImpl(venueId, status);
  if (result.success) revalidatePath("/admin/venues");
  return result;
}

// H3 — Verification Queue.
export async function approveVerification(
  submissionId: string,
  notes: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await approveVerificationImpl(submissionId, notes);
  if (result.success) revalidatePath("/admin/verification");
  return result;
}

export async function rejectVerification(
  submissionId: string,
  reason: string,
  notes: string,
): Promise<{ success: boolean; error?: string }> {
  const result = await rejectVerificationImpl(submissionId, reason, notes);
  if (result.success) revalidatePath("/admin/verification");
  return result;
}
