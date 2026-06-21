"use client";

import { useState } from "react";
import { saveVenueListing } from "../../app/actions/venueListing";
import {
  PRICE_RANGES,
  VENUE_CATEGORIES,
  type VenueListingDetail,
} from "../../types/database";
import type { CancellationPolicy, BookingType } from "../../types/database";

const BOOKING_TYPES: { value: BookingType; label: string }[] = [
  { value: "instant", label: "Instant confirm" },
  { value: "request", label: "Request-based" },
  { value: "none", label: "Not bookable" },
];

const CANCELLATION_POLICIES: { value: CancellationPolicy; label: string }[] = [
  { value: "flexible", label: "Flexible" },
  { value: "24hr", label: "24hr notice" },
  { value: "48hr", label: "48hr notice" },
  { value: "non_refundable", label: "Non-refundable" },
  { value: "custom", label: "Custom" },
];

// Comma-separated text in, string[] out — simplest input for list fields
// (amenities, gallery images) without pulling in a tag-input library or an
// upload pipeline this dashboard doesn't have yet.
function listToText(list: string[]): string {
  return list.join(", ");
}
function textToList(text: string): string[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ListingEditorForm({
  listing,
}: {
  listing: VenueListingDetail;
}) {
  const [form, setForm] = useState(listing);
  const [amenitiesText, setAmenitiesText] = useState(listToText(listing.amenities));
  const [imagesText, setImagesText] = useState(listToText(listing.images));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof VenueListingDetail>(
    key: K,
    value: VenueListingDetail[K],
  ) {
    setForm((cur) => ({ ...cur, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await saveVenueListing({
      name: form.name,
      category: form.category,
      area: form.area,
      address: form.address,
      description: form.description,
      price_range: form.price_range,
      price_display: form.price_display,
      phone: form.phone,
      website: form.website,
      instagram_handle: form.instagram_handle,
      whatsapp_number: form.whatsapp_number,
      amenities: textToList(amenitiesText),
      cover_image: form.cover_image,
      images: textToList(imagesText),
      booking_type: form.booking_type,
      confirmation_window_hrs: form.confirmation_window_hrs,
      cancellation_policy: form.cancellation_policy,
      cancellation_window_hrs: form.cancellation_window_hrs,
      cancellation_fee_per_person: form.cancellation_fee_per_person,
      requires_card: form.requires_card,
      min_party_size: form.min_party_size,
      max_party_size: form.max_party_size,
    });

    setSaving(false);

    if (!res.success) {
      setError(res.error ?? "Something went wrong.");
      return;
    }

    setSaved(true);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 720 }}>
      <Section title="Basics">
        <Field label="Venue name">
          <input
            className="input-el"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </Field>
        <Row>
          <Field label="Category">
            <select
              className="input-el"
              value={form.category}
              onChange={(e) => update("category", e.target.value as VenueListingDetail["category"])}
            >
              {VENUE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Area">
            <input
              className="input-el"
              value={form.area}
              onChange={(e) => update("area", e.target.value)}
            />
          </Field>
        </Row>
        <Field label="Address">
          <input
            className="input-el"
            value={form.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </Field>
        <Field label="Description">
          <textarea
            className="input-el"
            rows={4}
            style={{ resize: "none" }}
            value={form.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Photos">
        <Field label="Cover image URL">
          <input
            className="input-el"
            value={form.cover_image ?? ""}
            onChange={(e) => update("cover_image", e.target.value)}
          />
        </Field>
        <Field label="Gallery image URLs (comma-separated)">
          <textarea
            className="input-el"
            rows={3}
            style={{ resize: "none" }}
            value={imagesText}
            onChange={(e) => setImagesText(e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Amenities">
        <Field label="Amenities (comma-separated)">
          <textarea
            className="input-el"
            rows={2}
            style={{ resize: "none" }}
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            placeholder="Pool, Beach access, Valet parking"
          />
        </Field>
      </Section>

      <Section title="Pricing">
        <Row>
          <Field label="Price range">
            <select
              className="input-el"
              value={form.price_range ?? ""}
              onChange={(e) =>
                update("price_range", (e.target.value || null) as VenueListingDetail["price_range"])
              }
            >
              <option value="">Not set</option>
              {PRICE_RANGES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price display text">
            <input
              className="input-el"
              value={form.price_display ?? ""}
              onChange={(e) => update("price_display", e.target.value)}
              placeholder="From AED 500 / person"
            />
          </Field>
        </Row>
      </Section>

      <Section title="Contact">
        <Row>
          <Field label="Phone">
            <input
              className="input-el"
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Website">
            <input
              className="input-el"
              value={form.website ?? ""}
              onChange={(e) => update("website", e.target.value)}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Instagram handle">
            <input
              className="input-el"
              value={form.instagram_handle ?? ""}
              onChange={(e) => update("instagram_handle", e.target.value)}
            />
          </Field>
          <Field label="WhatsApp number">
            <input
              className="input-el"
              value={form.whatsapp_number ?? ""}
              onChange={(e) => update("whatsapp_number", e.target.value)}
            />
          </Field>
        </Row>
      </Section>

      <Section title="Booking settings">
        <Row>
          <Field label="Booking type">
            <select
              className="input-el"
              value={form.booking_type}
              onChange={(e) => update("booking_type", e.target.value as BookingType)}
            >
              {BOOKING_TYPES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Confirmation window (hrs)">
            <input
              type="number"
              min={0}
              className="input-el"
              value={form.confirmation_window_hrs}
              onChange={(e) => update("confirmation_window_hrs", Number(e.target.value))}
            />
          </Field>
        </Row>
        <Row>
          <Field label="Cancellation policy">
            <select
              className="input-el"
              value={form.cancellation_policy}
              onChange={(e) => update("cancellation_policy", e.target.value as CancellationPolicy)}
            >
              {CANCELLATION_POLICIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Cancellation window (hrs)">
            <input
              type="number"
              min={0}
              className="input-el"
              value={form.cancellation_window_hrs ?? ""}
              onChange={(e) =>
                update(
                  "cancellation_window_hrs",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            />
          </Field>
        </Row>
        <Row>
          <Field label="Cancellation fee per person">
            <input
              type="number"
              min={0}
              className="input-el"
              value={form.cancellation_fee_per_person}
              onChange={(e) => update("cancellation_fee_per_person", Number(e.target.value))}
            />
          </Field>
          <Field label="">
            <div
              onClick={() => update("requires_card", !form.requires_card)}
              className="btn"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                textAlign: "center",
                border: `1px solid ${form.requires_card ? "var(--accent-gold)" : "rgba(255,255,255,0.08)"}`,
                background: form.requires_card ? "rgba(255,184,0,0.1)" : "transparent",
                color: form.requires_card ? "var(--accent-gold)" : "var(--text-muted)",
              }}
            >
              {form.requires_card ? "Card required at booking" : "Card not required"}
            </div>
          </Field>
        </Row>
        <Row>
          <Field label="Min party size">
            <input
              type="number"
              min={1}
              className="input-el"
              value={form.min_party_size}
              onChange={(e) => update("min_party_size", Number(e.target.value))}
            />
          </Field>
          <Field label="Max party size">
            <input
              type="number"
              min={1}
              className="input-el"
              value={form.max_party_size}
              onChange={(e) => update("max_party_size", Number(e.target.value))}
            />
          </Field>
        </Row>
      </Section>

      {error && <div style={{ color: "var(--accent-pink)", fontSize: 13 }}>{error}</div>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn"
        style={{
          width: "100%",
          background: `linear-gradient(135deg, var(--accent-pink), var(--accent-orange))`,
          color: "#fff",
          border: "none",
          borderRadius: 14,
          padding: 15,
          fontSize: 15,
          fontWeight: 800,
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "var(--text-muted)",
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 14 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1 }}>
      {label && (
        <label
          style={{
            fontSize: 10,
            color: "var(--text-muted)",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginBottom: 6,
            display: "block",
            fontWeight: 700,
          }}
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
