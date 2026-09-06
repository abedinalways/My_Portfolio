/**
 * Lightweight CSS-only aurora — a few dim accent glows drifting slowly behind
 * the board. Only `transform` is animated, so each blob lives on its own
 * compositor layer: no canvas, no JS loop, virtually zero cost (this replaced
 * an earlier WebGL layer that felt heavy). Colors match the four focus items.
 */
export function AuroraBackground({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      className={
        className ?? "pointer-events-none absolute inset-0 overflow-hidden"
      }
    >
      <span className="wb-aurora wb-aurora--purple" />
      <span className="wb-aurora wb-aurora--blue" />
      <span className="wb-aurora wb-aurora--amber" />
      <span className="wb-aurora wb-aurora--pink" />
    </div>
  );
}
