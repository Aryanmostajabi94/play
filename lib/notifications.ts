import { getSupabaseServerClient } from "./supabaseServer";

// C5 — Booking Confirmed Notification.
// Per Tasks Tracker: "In-app notification fired when venue confirms a
// pending request." There's no push infrastructure or a dedicated
// `notifications` table in the schema (Realtime is only enabled on
// `bookings`), so this derives a notification feed directly from booking
// status transitions rather than inventing new infra. Each notification
// maps 1:1 to a booking whose status changed in a way the user needs to
// know about *after* the fact (i.e. not at creation time, which is
// already handled by the Instant Confirm / Request Sent screens at
// /booking/[id]?new=1).
export type NotificationType = "confirmed" | "declined" | "expired" | "cancelled_by_venue";

export interface NotificationItem {
  bookingId: string;
  type: NotificationType;
  venueName: string;
  venueAccentColor: string;
  date: string;
  timeSlot: string;
  occurredAt: string;
}

const NOTIFICATIONS_SELECT = `
  id, status, booking_type, date, time_slot, confirmed_at, declined_at, cancelled_at,
  cancelled_by, created_at,
  venue:venues ( name, accent_color )
`;

export async function getNotificationsForUser(userId: string): Promise<NotificationItem[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select(NOTIFICATIONS_SELECT)
    .eq("user_id", userId)
    .in("status", ["confirmed", "declined", "expired", "cancelled_by_venue"]);

  if (error || !data) {
    console.error("getNotificationsForUser error:", error?.message);
    return [];
  }

  const items: NotificationItem[] = [];

  for (const row of data as unknown as {
    id: string;
    status: string;
    booking_type: string;
    date: string;
    time_slot: string;
    confirmed_at: string | null;
    declined_at: string | null;
    cancelled_at: string | null;
    cancelled_by: string | null;
    created_at: string;
    venue: { name: string; accent_color: string };
  }[]) {
    // Instant-confirm bookings are already confirmed at the moment of
    // creation — the user saw that on the Instant Confirm screen, so it's
    // not a "the venue just confirmed" event worth re-surfacing here.
    // Only request-based bookings that later flipped to `confirmed`
    // represent a genuine "venue confirmed" notification.
    if (row.status === "confirmed") {
      if (row.booking_type !== "request" || !row.confirmed_at) continue;
      items.push({
        bookingId: row.id,
        type: "confirmed",
        venueName: row.venue.name,
        venueAccentColor: row.venue.accent_color,
        date: row.date,
        timeSlot: row.time_slot,
        occurredAt: row.confirmed_at,
      });
    } else if (row.status === "declined") {
      items.push({
        bookingId: row.id,
        type: "declined",
        venueName: row.venue.name,
        venueAccentColor: row.venue.accent_color,
        date: row.date,
        timeSlot: row.time_slot,
        occurredAt: row.declined_at ?? row.created_at,
      });
    } else if (row.status === "expired") {
      items.push({
        bookingId: row.id,
        type: "expired",
        venueName: row.venue.name,
        venueAccentColor: row.venue.accent_color,
        date: row.date,
        timeSlot: row.time_slot,
        occurredAt: row.created_at,
      });
    } else if (row.status === "cancelled_by_venue") {
      items.push({
        bookingId: row.id,
        type: "cancelled_by_venue",
        venueName: row.venue.name,
        venueAccentColor: row.venue.accent_color,
        date: row.date,
        timeSlot: row.time_slot,
        occurredAt: row.cancelled_at ?? row.created_at,
      });
    }
  }

  items.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  return items.slice(0, 30);
}
