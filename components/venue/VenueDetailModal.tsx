"use client";

import Link from "next/link";
import type { DiscoverVenue } from "../../types/database";

// B4 — Venue Detail Modal.
// Per Screen Inventory v1.0: "Full venue info. Description, amenities,
// rating, price, booking CTA." This screen never existed anywhere in the
// v1 codebase — the Discover grid (B1) linked straight from the card to
// /book/[slug], with no intermediate detail view at all. The "WhatsApp
// CTA needs replacing with booking engine" note in the Tasks Tracker
// referred to the old MVP prototype, which isn't present in this repo
// (see the AskUserQuestion scope correction earlier in this build) — so
// there was no WhatsApp link to swap out. Built from scratch here: the
// CTA is a direct Link into the real booking engine (/book/[slug], C1),
// never an external deep link.
export default function VenueDetailModal({
  venue,
  locked,
  onClose,
}: {
  venue: DiscoverVenue;
  locked: boolean;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={venue.name}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 520,
          maxHeight: "88vh",
          overflowY: "auto",
          background: "var(--bg-primary)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px 20px 0 0",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 2,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 16,
          }}
        >
          ✕
        </button>

        <div style={{ position: "relative", height: 220 }}>
          {venue.cover_image ? (
            <img
              src={venue.cover_image}
              alt={venue.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, var(--bg-primary), transparent 60%)",
            }}
          />
        </div>

        <div style={{ padding: "0 22px 26px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <span className="heading" style={{ fontSize: 26 }}>{venue.name}</span>
            {venue.rating && (
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent-gold)", whiteSpace: "nowrap" }}>
                ★ {venue.rating} {venue.review_count ? `(${venue.review_count})` : ""}
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{venue.area}</span>
            {venue.price_display && (
              <span style={{ fontSize: 12, color: venue.accent_color, fontWeight: 700 }}>{venue.price_display}</span>
            )}
            {venue.play_tags?.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: `${venue.accent_color}22`,
                  color: venue.accent_color,
                  border: `1px solid ${venue.accent_color}44`,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {venue.description && (
            <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.7, marginBottom: 18 }}>
              {venue.description}
            </div>
          )}

          {venue.amenities?.length > 0 && (
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "var(--text-muted)" }}>
                Amenities
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {venue.amenities.map((a) => (
                  <span
                    key={a}
                    style={{
                      fontSize: 11,
                      color: "var(--text-primary)",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 8,
                      padding: "5px 11px",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            href={locked ? "/upgrade/checkout" : `/book/${venue.slug}`}
            className="btn"
            style={{
              display: "block",
              textAlign: "center",
              width: "100%",
              padding: 15,
              borderRadius: "var(--radius-md)",
              border: "none",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 15,
              color: "#fff",
              background: locked
                ? "linear-gradient(135deg, var(--accent-gold), var(--accent-orange))"
                : "linear-gradient(135deg, var(--accent-pink), var(--accent-orange))",
            }}
          >
            {locked ? `👑 Unlock to book ${venue.name}` : "Reserve a table →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
