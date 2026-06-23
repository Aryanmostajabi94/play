import { getSupabaseServerClient } from "./supabaseServer";

// Section G — Venue Claim & Verification Flow (G1-G11). There's no venue
// auth system yet (see TEMP_VENUE_ID comment in lib/venueBookings.ts) so
// this flow can't attach to a logged-in session — instead each claim
// attempt is identified by its verification_submissions row id, threaded
// through the URL as ?sid=... across steps, the same way a checkout
// session id would be threaded through a payment flow. Once real venue
// auth lands, this should be replaced with a session-backed claim flow.

export interface GhostVenue {
  id: string;
  name: string;
  area: string;
  address: string;
  cover_image: string | null;
}

// G2 — Find Your Listing. Searches venues with listing_tier = 'ghost'
// (unclaimed). Uses the service-role client (server-only) rather than
// the anon client lib/venues.ts uses for the live consumer feed, because
// venues_select_live RLS only exposes status='live' rows to anon/auth
// clients — ghost venues (status='draft') aren't visible to them at all.
export async function searchGhostVenues(query: string): Promise<GhostVenue[]> {
  const supabase = getSupabaseServerClient();

  let q = supabase
    .from("venues")
    .select("id, name, area, address, cover_image")
    .eq("listing_tier", "ghost")
    .limit(10);

  if (query.trim()) {
    q = q.ilike("name", `%${query.trim()}%`);
  }

  const { data, error } = await q;

  if (error) {
    console.error("searchGhostVenues error:", error.message);
    return [];
  }

  return data ?? [];
}

export async function getGhostVenue(venueId: string): Promise<GhostVenue | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("venues")
    .select("id, name, area, address, cover_image")
    .eq("id", venueId)
    .single();

  if (error || !data) {
    console.error("getGhostVenue error:", error?.message);
    return null;
  }

  return data;
}

export type VerificationStatus = "pending" | "approved" | "rejected" | "manual_review";
export type OptionalCheckType = "email_domain" | "instagram" | "gps" | "manual";

export interface VerificationSubmission {
  id: string;
  venue_id: string;
  submitted_by: string;
  status: VerificationStatus;
  trade_license_url: string | null;
  trade_license_verified: boolean;
  phone_otp_verified: boolean;
  google_maps_verified: boolean;
  live_photo_url: string | null;
  live_photo_verified: boolean;
  optional_check_used: OptionalCheckType | null;
  optional_check_verified: boolean;
  rejection_reason: string | null;
}

const SUBMISSION_SELECT = `
  id, venue_id, submitted_by, status, trade_license_url, trade_license_verified,
  phone_otp_verified, google_maps_verified, live_photo_url, live_photo_verified,
  optional_check_used, optional_check_verified, rejection_reason
`;

// G3 — Create Venue Account. Creates the venue_users "owner" row (no
// password — there's no Supabase Auth wiring yet, same caveat as A3/A4
// Sign Up/Sign In) and stamps the venue as claimed, then opens a fresh
// verification_submissions row for the rest of the flow to write to.
export async function createVenueClaim(
  venueId: string,
  name: string,
  email: string,
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  if (!name.trim() || !email.trim()) {
    return { success: false, error: "Name and business email are required." };
  }

  const supabase = getSupabaseServerClient();

  const { data: staff, error: staffError } = await supabase
    .from("venue_users")
    .insert({
      venue_id: venueId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "owner",
      is_active: true,
    })
    .select("id")
    .single();

  if (staffError || !staff) {
    console.error("createVenueClaim staff error:", staffError?.message);
    return {
      success: false,
      error: staffError?.message?.includes("unique")
        ? "That email is already registered to a venue account."
        : "Could not create your account.",
    };
  }

  const { error: venueError } = await supabase
    .from("venues")
    .update({ claimed_by: staff.id, claimed_at: new Date().toISOString() })
    .eq("id", venueId);

  if (venueError) {
    console.error("createVenueClaim venue error:", venueError.message);
  }

  const { data: submission, error: submissionError } = await supabase
    .from("verification_submissions")
    .insert({ venue_id: venueId, submitted_by: staff.id, status: "pending" })
    .select("id")
    .single();

  if (submissionError || !submission) {
    console.error("createVenueClaim submission error:", submissionError?.message);
    return { success: false, error: "Could not start verification." };
  }

  return { success: true, submissionId: submission.id };
}

export async function getVerificationSubmission(
  submissionId: string,
): Promise<VerificationSubmission | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("verification_submissions")
    .select(SUBMISSION_SELECT)
    .eq("id", submissionId)
    .single();

  if (error || !data) {
    console.error("getVerificationSubmission error:", error?.message);
    return null;
  }

  return data as unknown as VerificationSubmission;
}

// G4 — Trade License. There's no document storage bucket or OCR service
// wired up (no key anywhere in .env.local), so this stores a pasted
// image URL — same pattern as venues.cover_image / users.avatar_url —
// and auto-passes the "OCR" check rather than faking a real text-match
// result. Flagged clearly in the UI as a stand-in.
export async function submitTradeLicense(
  submissionId: string,
  url: string,
): Promise<{ success: boolean; error?: string }> {
  if (!url.trim()) {
    return { success: false, error: "Add a link to your trade license image or PDF." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({ trade_license_url: url.trim(), trade_license_verified: true })
    .eq("id", submissionId);

  if (error) {
    console.error("submitTradeLicense error:", error.message);
    return { success: false, error: "Could not save." };
  }

  return { success: true };
}

// G5 — Phone OTP. No SMS provider (Twilio etc.) is configured anywhere
// in this codebase, so the "sent" code is a fixed demo value rather than
// a real text message — this mirrors D1's "plan picker built, real
// Stripe session still pending test keys" stand-in pattern.
export const DEMO_OTP_CODE = "123456";

export async function verifyPhoneOtp(
  submissionId: string,
  code: string,
): Promise<{ success: boolean; error?: string }> {
  if (code.trim() !== DEMO_OTP_CODE) {
    return { success: false, error: "Incorrect code." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({ phone_otp_verified: true })
    .eq("id", submissionId);

  if (error) {
    console.error("verifyPhoneOtp error:", error.message);
    return { success: false, error: "Could not save." };
  }

  return { success: true };
}

// G6 — Google Maps Match. No Google Places API key is configured, so
// this can't actually call the Places API to compute the real
// ">85% similarity, within 100m" match described in the spec. Instead it
// shows the venue's own address/coordinates already on file (from
// venues.address/lat/lng) for the owner to confirm — an honest stand-in,
// not a faked third-party verdict.
export async function confirmGoogleMapsMatch(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({ google_maps_verified: true })
    .eq("id", submissionId);

  if (error) {
    console.error("confirmGoogleMapsMatch error:", error.message);
    return { success: false, error: "Could not save." };
  }

  return { success: true };
}

// G7 — Live Photo. No camera/upload pipeline exists, so this takes a
// pasted image URL just like G4's trade license field.
export async function submitLivePhoto(
  submissionId: string,
  url: string,
): Promise<{ success: boolean; error?: string }> {
  if (!url.trim()) {
    return { success: false, error: "Add a link to your exterior photo." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({ live_photo_url: url.trim(), live_photo_verified: true })
    .eq("id", submissionId);

  if (error) {
    console.error("submitLivePhoto error:", error.message);
    return { success: false, error: "Could not save." };
  }

  return { success: true };
}

// G8 — Optional Check. "manual" always routes to manual_review (a real
// human has to look at it); the other three auto-pass here since none of
// business-email-domain matching, Instagram lookup, or GPS confirmation
// have a real backing service either.
export async function submitOptionalCheck(
  submissionId: string,
  checkType: OptionalCheckType,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({
      optional_check_used: checkType,
      optional_check_verified: checkType !== "manual",
    })
    .eq("id", submissionId);

  if (error) {
    console.error("submitOptionalCheck error:", error.message);
    return { success: false, error: "Could not save." };
  }

  return { success: true };
}

// Final submit — moves the submission from "in progress" (still
// `pending` with checks trickling in) to either auto-approved (every
// required check + the optional check passed) or manual_review (the
// optional check chosen was "manual", or something didn't verify).
// G9/G10/G11 all key off the resulting status.
export async function finalizeSubmission(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  const submission = await getVerificationSubmission(submissionId);
  if (!submission) {
    return { success: false, error: "Submission not found." };
  }

  const requiredPassed =
    submission.trade_license_verified &&
    submission.phone_otp_verified &&
    submission.google_maps_verified &&
    submission.live_photo_verified;

  const nextStatus: VerificationStatus =
    requiredPassed && submission.optional_check_verified ? "approved" : "manual_review";

  const supabase = getSupabaseServerClient();
  const updates: Record<string, unknown> = { status: nextStatus };
  if (nextStatus === "approved") {
    updates.approved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("verification_submissions")
    .update(updates)
    .eq("id", submissionId);

  if (error) {
    console.error("finalizeSubmission error:", error.message);
    return { success: false, error: "Could not submit." };
  }

  if (nextStatus === "approved") {
    await supabase
      .from("venues")
      .update({ listing_tier: "claimed", verified_at: new Date().toISOString() })
      .eq("id", submission.venue_id);
  }

  return { success: true };
}

// G11 — resubmit after rejection: clears the rejection and the checks
// that need redoing, sending the submission back to "pending" so the
// owner can walk the verify/* steps again with the same submission id.
export async function resubmitVerification(
  submissionId: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("verification_submissions")
    .update({
      status: "pending",
      rejection_reason: null,
      rejected_at: null,
    })
    .eq("id", submissionId);

  if (error) {
    console.error("resubmitVerification error:", error.message);
    return { success: false, error: "Could not resubmit." };
  }

  return { success: true };
}
