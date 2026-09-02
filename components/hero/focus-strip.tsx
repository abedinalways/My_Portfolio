"use client";

import { useState } from "react";

import { FOCUS_DATA } from "./focus-data";
import { FocusHeader } from "./focus-header";
import { FocusShowcase } from "./focus-showcase";
import { FocusTab } from "./focus-tab";

export function FocusStrip() {
  const [activeId, setActiveId] = useState(FOCUS_DATA[0]!.id);

  const activeIndex = Math.max(
    0,
    FOCUS_DATA.findIndex((item) => item.id === activeId)
  );
  const activeItem = FOCUS_DATA[activeIndex] ?? FOCUS_DATA[0]!;

  return (
    <section className="mx-auto w-full max-w-275 px-6 py-16 antialiased sm:px-10 lg:py-24">
      <FocusHeader activeIndex={activeIndex} total={FOCUS_DATA.length} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start lg:gap-12">
        <div className="flex flex-col gap-3">
          {FOCUS_DATA.map((item, index) => (
            <FocusTab
              key={item.id}
              item={item}
              index={index}
              isActive={item.id === activeId}
              onClick={() => setActiveId(item.id)}
            />
          ))}
        </div>

        <FocusShowcase item={activeItem} index={activeIndex} />
      </div>
    </section>
  );
}

export default FocusStrip;
