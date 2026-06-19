import { getVenueBySlug } from "../../../../lib/venues";
import BookingForm from "../../../../components/booking/BookingForm";

export default async function BookPage({
  params,
}: {
  params: { slug: string };
}) {
  const venue = await getVenueBySlug(params.slug);

  if (!venue) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)" }}>
          Venue not found. Make sure you've run the seed script
          (supabase/seed/0001_seed_venue.sql) against your Supabase project.
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <BookingForm venue={venue} />
    </main>
  );
}
