"use client";

import { FOCUS_ITEMS, type FocusItem } from "./data";

type FocusGridProps = {
  revealed: readonly boolean[];
  activeIndex: number;
  highlight: boolean;
  registerIcon: (index: number, node: SVGSVGElement | null) => void;
};

function FocusChip({
  item,
  index,
  revealed,
  active,
  registerIcon,
}: {
  item: FocusItem;
  index: number;
  revealed: boolean;
  active: boolean;
  registerIcon: (index: number, node: SVGSVGElement | null) => void;
}): React.JSX.Element {
  const { Icon, accent, label } = item;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-500 ease-out sm:h-20 sm:w-20 ${
          revealed ? (active ? "scale-[1.08]" : "scale-100") : "scale-90"
        }`}
        style={{
          backgroundColor: revealed
            ? `${accent}${active ? "33" : "1A"}`
            : "transparent",
          ...(active ? { boxShadow: `0 0 0 3px ${accent}55` } : {}),
        }}
      >
        <Icon
          ref={(node) => registerIcon(index, node)}
          size={38}
          strokeWidth={1.7}
          color={accent}
        />
      </div>
      <span
        className="text-xs font-semibold transition-opacity duration-500 sm:text-sm"
        style={{
          color: `color-mix(in srgb, ${accent} 82%, #1c1c1c)`,
          opacity: revealed ? 1 : 0.35,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** Row of focus icons — each one draws itself in once, then highlights on a cycling basis. */
export function FocusGrid({
  revealed,
  activeIndex,
  highlight,
  registerIcon,
}: FocusGridProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
      {FOCUS_ITEMS.map((item, i) => (
        <FocusChip
          key={item.id}
          item={item}
          index={i}
          revealed={revealed[i] ?? false}
          active={highlight && i === activeIndex}
          registerIcon={registerIcon}
        />
      ))}
    </div>
  );
}
