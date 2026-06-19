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
  confirmation_deadline: string | null; // set only for booking_type "request"
  confirmed_at: string | null;
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
