import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Allow up to 120s — Anthropic call for 50 venues takes ~30-60s
export const maxDuration = 120;

const ADMIN_PASSWORD = process.env.ADMIN_POPULATE_PASSWORD ?? "Playadmin";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

const SYSTEM_PROMPT = `You are a data generator for Play, a premium Dubai venue discovery and booking app.

Generate exactly 50 real, well-known Dubai venues spread across these categories:
- beach (8): beach clubs like Zero Gravity, Nikki Beach, WHITE Beach, Drai's Beach Club, Nasimi Beach, Cove Beach
- finedining (8): Nobu, Zuma, Nusr-Et, Ossiano, Tresind Studio, Hakkasan, La Petite Maison, Hoseki
- restaurants (10): popular Dubai restaurants across DIFC, JBR, Downtown, Dubai Marina
- nightlife (8): White Dubai, Drai's Nightclub, Cé La Vi, Armani/Prive, BASE Dubai, 1OAK Dubai
- brunch (8): Friday brunch institutions across hotels and standalone venues
- events (5): rooftop event spaces, concept venues, social clubs
- exclusive (3-5): high-end members-only or VIP-access experiences (access_tier: "elite")

For each venue return a JSON object with EXACTLY these fields:
{
  "name": "string",
  "slug": "string (unique lowercase-kebab-case)",
  "category": "beach|finedining|restaurants|nightlife|brunch|events|exclusive",
  "area": "string (e.g. JBR, DIFC, Downtown Dubai, Palm Jumeirah, Dubai Marina, Business Bay, La Mer, City Walk, Bluewaters Island)",
  "address": "string",
  "description": "string (2 sentences, Play's premium concise brand voice — evocative, not generic)",
  "price_range": "$|$$|$$$|$$$$",
  "price_display": "string (e.g. 'From AED 350pp' or 'AED 250 entry')",
  "cover_image": "string (real Unsplash photo URL: https://images.unsplash.com/photo-{photo_id}?w=800&auto=format — use photos relevant to the category: beach, dining, nightlife, cocktails, etc.)",
  "rating": "number between 4.1 and 4.9",
  "review_count": "integer between 80 and 1800",
  "access_tier": "free|insider|elite",
  "play_tags": ["array of 3-5 short tags e.g. Sunset Views, Signature Cocktails, Celebrity Chef"],
  "amenities": ["array of 3-6 amenities e.g. Valet Parking, Pool Access, Private Cabanas"],
  "accent_color": "string (hex color that fits the venue vibe)",
  "booking_type": "instant|request|none",
  "is_featured": "boolean (true for the top 8 most iconic venues)",
  "status": "live",
  "listing_tier": "ghost",
  "confirmation_window_hrs": 24,
  "cancellation_policy": "flexible|24hr|48hr|non_refundable",
  "cancellation_window_hrs": "number or null",
  "cancellation_fee_per_person": "number (0 for flexible, 50-200 for stricter policies)",
  "requires_card": "boolean",
  "min_party_size": 2,
  "max_party_size": "integer between 10 and 60",
  "lat": "number (realistic Dubai latitude, range 25.05 to 25.28)",
  "lng": "number (realistic Dubai longitude, range 55.10 to 55.40)"
}

Rules:
- access_tier "elite" for exclusive/VIP venues, "insider" for premium venues, "free" for general public
- is_featured true for exactly 8 venues (your most iconic picks)
- Every slug must be unique
- Unsplash photo IDs must be real — use IDs like: 1414235077428-338989a2e8c0 (food), 1566073771259-2e6fa5b9ffde (pool/beach), 1507003211169-0a1dd7228f2d (cocktails), 1470337458703-6125e18a4afc (nightclub), 1414235077428-338989a2e8c0 (restaurant)
- Descriptions must sound premium and specific, not generic tourist-guide prose
- Coordinates must be accurate to the actual venue location in Dubai

Return ONLY a valid JSON array. No markdown. No code blocks. No explanation. Just the raw JSON array starting with [ and ending with ].
`;

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set in environment" }, { status: 500 });
  }

  // Call Anthropic API
  let venueJson: string;
  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-4-8",
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: "Generate the 50 Dubai venues now. Return only the JSON array.",
          },
        ],
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      return NextResponse.json({ error: `Anthropic API error: ${err}` }, { status: 500 });
    }

    const anthropicData = await anthropicRes.json();
    venueJson = anthropicData.content?.[0]?.text ?? "";
  } catch (e) {
    return NextResponse.json({ error: `Failed to call Anthropic: ${e}` }, { status: 500 });
  }

  // Parse the JSON
  let venues: Record<string, unknown>[];
  try {
    // Strip markdown code blocks if Claude wrapped it anyway
    const cleaned = venueJson.replace(/^```json\n?/, "").replace(/```$/, "").trim();
    venues = JSON.parse(cleaned);
    if (!Array.isArray(venues)) throw new Error("Response is not a JSON array");
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to parse Claude response as JSON: ${e}`, raw: venueJson.slice(0, 500) },
      { status: 500 },
    );
  }

  // Insert into Supabase using service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const { data, error } = await supabase.from("venues").insert(venues).select("id");

  if (error) {
    return NextResponse.json({ error: `Supabase insert error: ${error.message}` }, { status: 500 });
  }

  return NextResponse.json({ inserted: data?.length ?? 0 });
}
