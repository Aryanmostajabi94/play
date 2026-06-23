import { getSupabaseServerClient } from "./supabaseServer";
import { TEMP_VENUE_ID } from "./venueBookings";

export interface DayAvailability {
  day_of_week: number; // 0 = Sunday .. 6 = Saturday
  is_closed: boolean;
  open_time: string | null; // "HH:MM"
  close_time: string | null;
  slot_duration_mins: number;
}

export interface BlackoutDate {
  id: string;
  date: string;
  reason: string | null;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export { DAY_NAMES };

// F6 — Availability Manager. Returns one row per day of the week (0-6),
// filling in sensible defaults for any day that doesn't have a
// venue_availability row yet (e.g. a brand-new venue before its first save).
export async function getWeeklyAvailability(
  venueId: string = TEMP_VENUE_ID,
): Promise<DayAvailability[]> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("venue_availability")
    .select("day_of_week, is_closed, open_time, close_time, slot_duration_mins")
    .eq("venue_id", venueId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("getWeeklyAvailability error:", error.message);
  }

  const byDay = new Map<number, DayAvailability>();
  (data ?? []).forEach((row) => {
    byDay.set(row.day_of_week, {
      day_of_week: row.day_of_week,
      is_closed: row.is_closed ?? false,
      open_time: row.open_time?.slice(0, 5) ?? null,
      close_time: row.close_time?.slice(0, 5) ?? null,
      slot_duration_mins: row.slot_duration_mins ?? 30,
    });
  });

  return Array.from({ length: 7 }, (_, day) =>
    byDay.get(day) ?? {
      day_of_week: day,
      is_closed: false,
      open_time: "10:00",
      close_time: "23:00",
      slot_duration_mins: 30,
    },
  );
}

// Upcoming blackout dates only (past ones aren't actionable from this screen).
export async function getBlackoutDates(
  venueId: string = TEMP_VENUE_ID,
): Promise<BlackoutDate[]> {
  const supabase = getSupabaseServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("blackout_dates")
    .select("id, date, reason")
    .eq("venue_id", venueId)
    .gte("date", today)
    .order("date", { ascending: true });

  if (error) {
    console.error("getBlackoutDates error:", error.message);
    return [];
  }

  return data ?? [];
}

// Upserts all 7 days in one go — simpler for the form than diffing which
// days actually changed, and venue_availability has no unique constraint
// to upsert against by default, so we delete-then-insert per venue.
export async function saveWeeklyAvailability(
  venueId: string,
  days: DayAvailability[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();

  const { error: deleteError } = await supabase
    .from("venue_availability")
    .delete()
    .eq("venue_id", venueId);

  if (deleteError) {
    console.error("saveWeeklyAvailability delete error:", deleteError.message);
    return { success: false, error: "Could not save availability." };
  }

  const { error: insertError } = await supabase.from("venue_availability").insert(
    days.map((d) => ({
      venue_id: venueId,
      day_of_week: d.day_of_week,
      is_closed: d.is_closed,
      open_time: d.is_closed ? null : d.open_time,
      close_time: d.is_closed ? null : d.close_time,
      slot_duration_mins: d.slot_duration_mins,
    })),
  );

  if (insertError) {
    console.error("saveWeeklyAvailability insert error:", insertError.message);
    return { success: false, error: "Could not save availability." };
  }

  return { success: true };
}

export async function addBlackoutDate(
  venueId: string,
  date: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  if (!date) {
    return { success: false, error: "Pick a date." };
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("blackout_dates")
    .insert({ venue_id: venueId, date, reason: reason.trim() || null });

  if (error) {
    console.error("addBlackoutDate error:", error.message);
    return { success: false, error: "Could not add blackout date." };
  }

  return { success: true };
}

export async function removeBlackoutDate(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("blackout_dates").delete().eq("id", id);

  if (error) {
    console.error("removeBlackoutDate error:", error.message);
    return { success: false, error: "Could not remove blackout date." };
  }

  return { success: true };
}
