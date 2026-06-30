// Scrolling stat strip above the header — ported verbatim from
// Play_V11.jsx's ticker (same copy, same gradient bg, same animation
// shape: content repeated and slid by -50% via CSS, see
// .play-ticker-inner in globals.css). Static/server-rendered; nothing here
// needs real-time data, matching how V11 itself hardcoded the strings.
const TICKER_ITEMS =
  "WHITE Dubai is live tonight   ·   3 spots left on the Yacht Brunch   ·   Art Dubai opens Thursday   ·   Zuma terrace fully booked   ·   Insider table drop at Cavalli now open   ·   ";

export default function TickerBar() {
  return (
    <div
      className="play-ticker"
      style={{
        background: "linear-gradient(90deg, var(--accent-pink), var(--accent-orange))",
        padding: "5px 0",
        border: "none",
      }}
    >
      <span
        className="play-ticker-inner"
        style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#fff" }}
      >
        {Array(6).fill(TICKER_ITEMS).join("")}
      </span>
    </div>
  );
}
