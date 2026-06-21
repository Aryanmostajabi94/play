import type { BookingStatus } from "../../types/database";

// Shared status pill used by C7 Booking History and C8 Booking Detail.
const STATUS_STYLES: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: "Awaiting confirmation", color: "var(--accent-gold)" },
  confirmed: { label: "Confirmed", color: "var(--accent-pink)" },
  completed: { label: "Completed", color: "var(--text-muted)" },
  declined: { label: "Declined", color: "var(--text-muted)" },
  expired: { label: "Expired", color: "var(--text-muted)" },
  cancelled_by_user: { label: "Cancelled by you", color: "var(--text-muted)" },
  cancelled_by_venue: { label: "Cancelled by venue", color: "var(--text-muted)" },
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, color } = STATUS_STYLES[status];
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color,
        border: `1px solid ${color}`,
        borderRadius: 8,
        padding: "3px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
