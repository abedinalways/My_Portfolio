"use client";

import { FOCUS_ITEMS } from "./data";

/** Markers resting on the board tray — one color per focus item. */
export function MarkerTray(): React.JSX.Element {
  return (
    <div
      className="flex items-center justify-center gap-3"
      role="img"
      aria-label="Marker colors for my focus areas"
    >
      {FOCUS_ITEMS.map(({ accent, label }) => (
        <span
          key={label}
          title={label}
          className="h-2.5 w-7 rounded-full shadow-sm transition-transform duration-300 ease-out hover:-translate-y-0.5"
          style={{ backgroundColor: accent }}
        />
      ))}
      <span
        className="h-2.5 w-9 rounded-full bg-[#242424] shadow-sm"
        aria-hidden="true"
      />
    </div>
  );
}
