"use client";

import { useEffect } from "react";

// Decides day vs night the same way the inline boot script in
// app/layout.tsx does, so both stay in sync: 6am-6pm local device time
// is "day", everything else is "night". No location/API lookup — just
// the visitor's own clock, per the scope decided for this feature.
function isDaytime(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

function applyTheme() {
  document.documentElement.dataset.theme = isDaytime() ? "day" : "night";
}

// The boot script (app/layout.tsx) sets the right theme before first
// paint so there's no flash. This component just keeps it correct for
// anyone who leaves the tab open across a 6am/6pm boundary — checking
// once a minute is cheap and frequent enough that nobody will notice a
// delay, and re-checking on tab focus catches laptops waking from sleep.
export default function AutoTheme() {
  useEffect(() => {
    applyTheme();
    const interval = setInterval(applyTheme, 60_000);
    document.addEventListener("visibilitychange", applyTheme);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", applyTheme);
    };
  }, []);

  return null;
}
