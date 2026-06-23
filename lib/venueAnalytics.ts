import { getSupabaseServerClient } from "./supabaseServer";
import { TEMP_VENUE_ID } from "./venueBookings";

export interface TierBreakdownRow {
  tier: string;
  count: number;
}

export interface PeakTimeRow {
  time_slot: string;
  count: number;
}

export interface VenueAnalytics {
  listingTier: string;
  totalSaves: number;
  totalBookings: number;
  // Bookings per save — the closest real conversion signal available.
  // There's no page-view/impression tracking anywhere in the schema yet
  // (no venue_views table, no counter column), so a true views→booking
  // funnel can't be computed. Surfaced honestly in the UI rather than
  // faked with a placeholder number.
  conversionRate: number | null;
  tierBreakdown: TierBreakdownRow[];
  peakTimes: PeakTimeRow[];
}

// F7 — Venue Analytics. Per Tasks Tracker: "Views, saves, booking
// conversion, member tier breakdown, peak times. Partner tier only."
// `listingTier` is returned so the page can gate access itself.
export async function getVenueAnalytics(
  venueId: string = TEMP_VENUE_ID,
): Promise<VenueAnalytics> {
  const supabase = getSupabaseServerClient();

  const [venueRes, savesRes, bookingsCountRes, bookingsRowsRes] = await Promise.all([
    supabase.from("venues").select("listing_tier").eq("id", venueId).single(),
    supabase
      .from("saved_venues")
      .select("id", { count: "exact", head: true })
      .eq("venue_id", venueId),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("venue_id", venueId),
    supabase
      .from("bookings")
      .select("user_tier_at_booking, time_slot")
      .eq("venue_id", venueId),
  ]);

  const totalSaves = savesRes.count ?? 0;
  const totalBookings = bookingsCountRes.count ?? 0;

  const tierCounts = new Map<string, number>();
  const timeCounts = new Map<string, number>();
  (bookingsRowsRes.data ?? []).forEach((row: any) => {
    const tier = row.user_tier_at_booking ?? "free";
    tierCounts.set(tier, (tierCounts.get(tier) ?? 0) + 1);
    timeCounts.set(row.time_slot, (timeCounts.get(row.time_slot) ?? 0) + 1);
  });

  const tierBreakdown = Array.from(tierCounts.entries())
    .map(([tier, count]) => ({ tier, count }))
    .sort((a, b) => b.count - a.count);

  const peakTimes = Array.from(timeCounts.entries())
    .map(([time_slot, count]) => ({ time_slot, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    listingTier: venueRes.data?.listing_tier ?? "ghost",
    totalSaves,
    totalBookings,
    conversionRate: totalSaves > 0 ? totalBookings / totalSaves : null,
    tierBreakdown,
    peakTimes,
  };
}
