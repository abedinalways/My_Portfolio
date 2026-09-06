import {
  BookOpen,
  Code2,
  Compass,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type FocusItem = {
  id: string;
  Icon: LucideIcon;
  label: string;
  /** Marker color used for the icon, its accent, and the description ink. */
  accent: string;
  description: string;
  hasImage?: boolean;
};

export type DrawableGroup =
  | { kind: "zigzag"; svg: SVGSVGElement }
  | { kind: "icon"; svg: SVGSVGElement; index: number };

export type DrawableElement = {
  el: SVGGeometryElement;
  len: number;
  group: DrawableGroup;
  isLastOfGroup: boolean;
};

export const FOCUS_ITEMS: FocusItem[] = [
  {
    id: "build",
    Icon: Code2,
    label: "Building",
    accent: "#8b5cf6",
    description: "Shipping an AI design-system generator",
    hasImage: true,
  },
  {
    id: "learn",
    Icon: BookOpen,
    label: "Learning",
    accent: "#4dabf7",
    description: "Learning three.js, GLSL & motion",
  },
  {
    id: "explore",
    Icon: Compass,
    label: "Exploring",
    accent: "#f0a63f",
    description: "Exploring creative experiments & ideas",
  },
  {
    id: "design",
    Icon: Palette,
    label: "Designing",
    accent: "#f472b6",
    description: "Designing micro-interactions & systems",
  },
];

/** Red scribble that draws once at the top of the board. */
export const ZIGZAG_PATH =
  "M8,42 L40,10 L70,55 L100,15 L130,50 L160,20 L192,45 L216,26";

/** Slower, smoother pacing so the handwriting feels natural rather than rushed. */
export const TIMING = {
  drawMs: 560, // per SVG shape
  gapMs: 200, // gap between shapes
  iconDoneGapMs: 360, // pause after each finished icon
  msPerChar: 78, // handwriting pace scales with sentence length
  minWriteMs: 1000,
  maxWriteMs: 4600,
  holdMs: 2600, // time the line stays on the board before erasing
  eraseMs: 600,
  descGapMs: 420,
} as const;

export const DRAWABLE_SELECTOR =
  "path, line, polyline, polygon, circle, ellipse, rect";
