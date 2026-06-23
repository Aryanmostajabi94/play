import { getVenueAnalytics } from "../../../../lib/venueAnalytics";
import SummaryCard from "../../../../components/venue/SummaryCard";

const TIER_LABELS: Record<string, string> = {
  free: "Explorer",
  insider: "Insider",
  elite: "Elite",
};

// F7 — Venue Analytics (Screen Inventory v1.0): "Views, saves, booking
// conversion, member tier breakdown, peak times." Partner tier only.
export default async function VenueAnalyticsPage() {
  const analytics = await getVenueAnalytics();

  if (analytics.listingTier !== "partner") {
    return (
      <div>
        <div className="heading" style={{ fontSize: 30, marginBottom: 16 }}>
          Analytics
        </div>
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 28,
            color: "var(--text-muted)",
            fontSize: 14,
            maxWidth: 480,
          }}
        >
          Analytics is a Partner-tier feature. Upgrade your venue's listing tier to see views,
          saves, booking conversion, and guest insights.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="heading" style={{ fontSize: 30, marginBottom: 24 }}>
        Analytics
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
        <SummaryCard label="Saves" value={analytics.totalSaves} />
        <SummaryCard label="Total bookings" value={analytics.totalBookings} />
        <SummaryCard
          label="Bookings per save"
          value={
            analytics.conversionRate === null
              ? "—"
              : `${(analytics.conversionRate * 100).toFixed(0)}%`
          }
        />
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 32, maxWidth: 480 }}>
        Page-view tracking isn't wired up yet — conversion is shown as bookings per save, the
        closest signal available today.
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="heading" style={{ fontSize: 16, marginBottom: 12 }}>
            Member tier breakdown
          </div>
          {analytics.tierBreakdown.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No bookings yet.</div>
          ) : (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {analytics.tierBreakdown.map((row) => (
                <div
                  key={row.tier}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{TIER_LABELS[row.tier] ?? row.tier}</div>
                  <div style={{ color: "var(--text-muted)" }}>{row.count} bookings</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 280 }}>
          <div className="heading" style={{ fontSize: 16, marginBottom: 12 }}>
            Peak times
          </div>
          {analytics.peakTimes.length === 0 ? (
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>No bookings yet.</div>
          ) : (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              {analytics.peakTimes.map((row) => (
                <div
                  key={row.time_slot}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 18px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 14,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{row.time_slot}</div>
                  <div style={{ color: "var(--text-muted)" }}>{row.count} bookings</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
