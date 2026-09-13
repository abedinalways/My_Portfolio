export type ConciseFocusItem = {
  id: string;
  tag: string;
  color: string;
  title: string;
  tech: string;
};

export const CONCISE_FOCUS_ITEMS: ConciseFocusItem[] = [
  {
    id: "building",
    tag: "BUILDING",
    color: "#a855f7", // Purple
    title: "AI Design System Generator",
    tech: "Next.js 16 • Tailwind v4 • AI API",
  },
  {
    id: "learning",
    tag: "LEARNING",
    color: "#06b6d4", // Cyan
    title: "WebGL Shaders & Raymarching",
    tech: "Three.js • GLSL • GPU 60fps",
  },
  {
    id: "exploring",
    tag: "EXPLORING",
    color: "#f59e0b", // Amber
    title: "Kinetic Physics & Audio Nodes",
    tech: "Matter.js • Canvas API",
  },
  {
    id: "designing",
    tag: "DESIGNING",
    color: "#ec4899", // Pink
    title: "Fluid Micro-Interactions & Motion",
    tech: "Motion React • 120Hz Spring",
  },
];
