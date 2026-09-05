"use client";

import { useEffect, useRef, useState } from "react";

const FOCUS_ITEMS = [
  {
    id: "build",
    text: "Recently I'm focusing on building the SaaS Project",
    hasImage: true,
  },
  {
    id: "learn",
    text: "Learning Three.js, Anime.js, WebGL",
    hasImage: false,
  },
  {
    id: "explore",
    text: "Exploring new creative ideas and experiments",
    hasImage: false,
  },
  {
    id: "try",
    text: "Trying out different design approaches",
    hasImage: false,
  },
];

export default function WhiteboardFocusScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [writtenItems, setWrittenItems] = useState<boolean[]>(
    FOCUS_ITEMS.map(() => false)
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWrittenItems((prev) => {
        const next = [...prev];
        next[activeIndex] = true;
        return next;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    const nextTimer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % FOCUS_ITEMS.length);
    }, 3500);

    return () => clearTimeout(nextTimer);
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center p-8 bg-background"
    >
      {/* Whiteboard Frame */}
      <div className="relative w-full max-w-4xl aspect-[16/10] rounded-lg overflow-hidden bg-[#fdfdfb] shadow-[0_25px_60px_-25px_rgba(0,0,0,0.4)] ring-1 ring-black/10">
        
        {/* Village scene background - low opacity */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-500 to-gray-600" />
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Hills */}
            <path d="M0,380 Q200,280 400,350 Q600,280 800,380 L800,500 L0,500Z" fill="#666" />
            <path d="M0,420 Q250,340 500,400 Q650,340 800,420 L800,500 L0,500Z" fill="#777" />
            {/* Houses */}
            <rect x="100" y="320" width="60" height="50" fill="#888" />
            <polygon points="100,320 130,280 160,320" fill="#666" />
            <rect x="300" y="300" width="80" height="60" fill="#888" />
            <polygon points="300,300 340,250 380,300" fill="#666" />
            <rect x="550" y="310" width="70" height="55" fill="#888" />
            <polygon points="550,310 585,265 620,310" fill="#666" />
            {/* Trees */}
            <circle cx="220" cy="300" r="25" fill="#777" />
            <rect x="217" y="320" width="6" height="30" fill="#666" />
            <circle cx="480" cy="290" r="30" fill="#777" />
            <rect x="476" y="315" width="8" height="35" fill="#666" />
            {/* Sun */}
            <circle cx="700" cy="100" r="40" fill="#999" opacity="0.5" />
          </svg>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(253,253,251,0.5)_100%)]" />

        {/* Writing area */}
        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center">
          {/* Title */}
          <h2
            className="font-caveat text-2xl md:text-3xl text-[#23262b] mb-8"
            style={{ fontFamily: "'Kalam', cursive" }}
          >
            What I&apos;m focusing on...
          </h2>

          {/* Focus items - written one by one */}
          <div className="space-y-6">
            {FOCUS_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-start gap-4 transition-all duration-700 ${
                  writtenItems[index]
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-8"
                }`}
              >
                {/* Pencil bullet */}
                <span className="mt-2 w-3 h-3 flex-shrink-0">
                  <svg viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2,6 L5,10 L10,2"
                      stroke="#444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: writtenItems[index] ? "none" : "20",
                        strokeDashoffset: writtenItems[index] ? "0" : "20",
                        transition: "stroke-dashoffset 0.6s ease-out",
                      }}
                    />
                  </svg>
                </span>

                {/* Text with writing effect */}
                <div className="flex-1">
                  <p
                    className="text-lg md:text-xl text-[#23262b] leading-relaxed"
                    style={{ fontFamily: "'Kalam', cursive" }}
                  >
                    {writtenItems[index] ? (
                      <WritingText text={item.text} />
                    ) : null}
                  </p>

                  {/* Art image for build item */}
                  {item.hasImage && writtenItems[index] && (
                    <div className="mt-3 w-32 h-20 rounded bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                      SaaS Art
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pencil cursor */}
          <div className="absolute bottom-8 right-8 opacity-60">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M8,32 L12,20 L28,8 L32,12 L16,28 Z"
                fill="#444"
                stroke="#222"
                strokeWidth="1"
              />
              <path d="M28,8 L32,12 L30,14 L26,10 Z" fill="#fbbf24" />
              <path d="M8,32 L12,20 L14,22 L10,34 Z" fill="#666" />
            </svg>
          </div>
        </div>

        {/* Frame border effect */}
        <div className="absolute inset-0 pointer-events-none border-8 border-[#8b7355] rounded-lg opacity-30" />
        <div className="absolute inset-2 pointer-events-none border border-[#8b7355] rounded opacity-20" />
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {FOCUS_ITEMS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "bg-foreground/60 scale-125"
                : "bg-foreground/20 hover:bg-foreground/40"
            }`}
            aria-label={`View item ${i + 1}`}
          />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
      `}</style>
    </section>
  );
}

// Writing animation component
function WritingText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText("");
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayText}
      <span className="ml-0.5 inline-block w-0.5 h-5 bg-[#444] animate-pulse align-middle" />
    </span>
  );
}
