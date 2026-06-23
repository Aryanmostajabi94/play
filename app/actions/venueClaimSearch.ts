"use server";

import { searchGhostVenues, type GhostVenue } from "../../lib/venueClaim";

// G2 — Find Your Listing search action, split from app/actions/venueClaim.ts
// because this one doesn't redirect (it just returns results to render).
export async function searchVenuesAction(query: string): Promise<GhostVenue[]> {
  return searchGhostVenues(query);
}
