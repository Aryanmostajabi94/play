export type UserTier = "free" | "insider" | "elite";
export type BookingType = "instant" | "request" | "none";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "declined"
  | "expired"
  | "cancelled_by_user"
  | "cancelled_by_venue";
export type CancellationPolicy =
  | "flexible"
  | "24hr"
  | "48hr"
  | "non_refundable"
  | "custom";
export type NotificationChannel = "in_app" | "email" | "whatsapp";

export interface Venue {
  id: string;
  name: string;
  slug: string;
  area: string;
  description: string | null;
  price_display: string | null;
  accent_color: string;
  cover_image: string | null;
  rating: number | null;
  booking_type: BookingType;
  confirmation_window_hrs: number;
  cancellation_policy: CancellationPolicy;
  cancellation_fee_per_person: number;
  requires_card: boolean;
  min_party_size: number;
  max_party_size: number;
}

export interface Booking {
  id: string;
  user_id: string;
  venue_id: string;
  status: BookingStatus;
  booking_type: BookingType;
  date: string; // YYYY-MM-DD
  time_slot: string; // HH:MM
  party_size: number;
  occasion: string | null;
  special_requests: string | null;
  notification_channels: NotificationChannel[];
  cancellation_policy: CancellationPolicy;
  cancellation_window_hrs: number | null;
  confirmation_deadline: string | null; // set only for booking_type "request"
  confirmed_at: string | null;
  declined_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  cancelled_by: "user" | "venue" | null;
  user_tier_at_booking: UserTier;
  created_at: string;
}

// Display fields needed by the booking-status screens (Instant Confirm /
// Request Sent), joined in from the parent venue.
export interface BookingVenueSummary {
  name: string;
  area: string;
  price_display: string | null;
  accent_color: string;
  cover_image: string | null;
}

export interface BookingWithVenue extends Booking {
  venue: BookingVenueSummary;
}

// ============================================================
// Venue Dashboard (Section F — Screen Inventory v1.0)
// ============================================================

// F2 Pending Requests: one row per incoming request-based booking,
// joined with the guest's name for display. Per Booking Engine Spec v1.0
// section 5: "Each row: guest name, date, time, party size, occasion,
// special requests, time remaining."
export interface VenueBookingRow {
  id: string;
  date: string;
  time_slot: string;
  party_size: number;
  occasion: string | null;
  special_requests: string | null;
  status: BookingStatus;
  confirmation_deadline: string | null;
  user_tier_at_booking: UserTier;
  guest_name: string;
}

// F1 Venue Dashboard Home: "Overview of today's bookings, pending
// requests, week summary, quick actions."
export interface VenueDashboardSummary {
  venueName: string;
  todayBookings: VenueBookingRow[];
  pendingRequestCount: number;
  weekConfirmedCount: number;
  weekPendingCount: number;
}

// Large-group threshold per Booking Engine Spec v1.0:
// party sizes of 20+ trigger large-group / request-only handling.
export const LARGE_GROUP_THRESHOLD = 20;

export const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Business",
  "Date Night",
  "Other",
] as const;

// ============================================================
// E1 — Notification Preferences (Screen Inventory v1.0)
// ============================================================

export interface NotificationPreferences {
  user_id: string;
  in_app_enabled: boolean;
  email_enabled: boolean;
  whatsapp_enabled: boolean;
  reminder_hours_before: number;
  weekly_picks_enabled: boolean;
  elite_drop_enabled: boolean;
  updated_at: string;
}

export const REMINDER_HOUR_OPTIONS = [1, 2, 3, 6, 12, 24] as const;

// ============================================================
// F5 — Listing Editor (Screen Inventory v1.0)
// ============================================================

export type VenueCategory =
  | "beach"
  | "finedining"
  | "restaurants"
  | "nightlife"
  | "brunch"
  | "events"
  | "exclusive";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

// Fields a venue owner/manager can edit from F5. Scoped to columns that
// live on the `venues` table itself — weekly open/closed hours and
// blackout dates are a separate `availability` concept owned by F6
// (Availability Manager), not part of this row, so they're intentionally
// excluded here.
export interface VenueListingDetail {
  id: string;
  name: string;
  category: VenueCategory;
  area: string;
  address: string | null;
  description: string | null;
  price_range: PriceRange | null;
  price_display: string | null;
  phone: string | null;
  website: string | null;
  instagram_handle: string | null;
  whatsapp_number: string | null;
  amenities: string[];
  cover_image: string | null;
  images: string[];
  booking_type: BookingType;
  confirmation_window_hrs: number;
  cancellation_policy: CancellationPolicy;
  cancellation_window_hrs: number | null;
  cancellation_fee_per_person: number;
  requires_card: boolean;
  min_party_size: number;
  max_party_size: number;
}

export const VENUE_CATEGORIES: { value: VenueCategory; label: string }[] = [
  { value: "beach", label: "Beach Club" },
  { value: "finedining", label: "Fine Dining" },
  { value: "restaurants", label: "Restaurant" },
  { value: "nightlife", label: "Nightlife" },
  { value: "brunch", label: "Brunch" },
  { value: "events", label: "Events" },
  { value: "exclusive", label: "Exclusive" },
];

export const PRICE_RANGES: PriceRange[] = ["$", "$$", "$$$", "$$$$"];

// ============================================================
// D1/D2 — Checkout & Subscription Success (Screen Inventory v1.0)
// ============================================================

export type PaidTier = "insider" | "elite";
export type BillingCycle = "monthly" | "annual";

export interface PlanOption {
  tier: PaidTier;
  name: string;
  monthlyPrice: number; // AED
  annualPrice: number; // AED, billed yearly
  perks: string[];
}

export const PLAN_OPTIONS: PlanOption[] = [
  {
    tier: "insider",
    name: "Insider",
    monthlyPrice: 149,
    annualPrice: 1490,
    perks: ["Unlock Insider-tier venues", "Priority booking windows", "Weekly curated picks"],
  },
  {
    tier: "elite",
    name: "Elite",
    monthlyPrice: 399,
    annualPrice: 3990,
    perks: [
      "Everything in Insider",
      "Unlock Elite-tier venues",
      "Elite drop early access",
      "Dedicated concierge",
    ],
  },
];
