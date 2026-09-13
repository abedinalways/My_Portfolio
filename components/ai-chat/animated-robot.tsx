"use client";

import { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

type RobotProps = {
  size?: "sm" | "md" | "lg";
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
};

export function AnimatedRobotAvatar({
  size = "md",
  isListening = false,
  isSpeaking = false,
  className = "",
}: RobotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [blinkState, setBlinkState] = useState<"normal" | "blink" | "happy" | "surprised">("normal");

  // Mouse Cursor Tracking Sensitivity
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(mouseX, { stiffness: 200, damping: 18 });
  const eyeX = useSpring(mouseX, { stiffness: 250, damping: 14 });
  const eyeY = useSpring(mouseY, { stiffness: 250, damping: 14 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window === "undefined") return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 24;
      const y = (e.clientY / innerHeight - 0.5) * -24;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Periodic Eye Expressions & Blinking Cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState("blink");
      setTimeout(() => {
        if (isSpeaking) setBlinkState("happy");
        else if (isHovered) setBlinkState("happy");
        else setBlinkState("normal");
      }, 160);
    }, 2800);

    return () => clearInterval(interval);
  }, [isSpeaking, isHovered]);

  const handleRobotClick = () => {
    setIsClicked(true);
    setBlinkState("surprised");
    setTimeout(() => {
      setIsClicked(false);
      setBlinkState(isHovered ? "happy" : "normal");
    }, 600);
  };

  const scaleMap = {
    sm: "w-10 h-12",
    md: "w-20 h-24",
    lg: "w-32 h-36",
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleRobotClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      animate={{
        y: [0, -8, 0],
        scaleX: isClicked ? 1.18 : isHovered ? 1.05 : 1,
        scaleY: isClicked ? 0.82 : isHovered ? 1.05 : 1,
      }}
      whileTap={{ scaleY: 0.8, scaleX: 1.2 }}
      transition={{
        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        scaleX: { type: "spring", stiffness: 400, damping: 15 },
        scaleY: { type: "spring", stiffness: 400, damping: 15 },
      }}
      className={`relative flex items-center justify-center select-none cursor-pointer ${scaleMap[size]} ${className}`}
    >
      {/* Orbiting Energy Sparkles around Cloud Head */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 pointer-events-none"
      >
        <span className="absolute top-0 left-1 text-[10px] text-cyan-300 font-bold animate-pulse">✦</span>
        <span className="absolute bottom-2 right-1 text-[10px] text-purple-300 font-bold animate-pulse">✦</span>
      </motion.div>

      {/* Reactive Audio Equalizer Waveform Bars when Listening/Speaking */}
      {(isListening || isSpeaking) && (
        <div className="absolute -top-3 flex items-end justify-center gap-1 h-5 w-full pointer-events-none">
          {[1, 2, 3, 4, 5].map((bar) => (
            <motion.span
              key={bar}
              animate={{ height: ["4px", "18px", "4px"] }}
              transition={{
                duration: 0.4 + bar * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-purple-500 shadow-sm"
            />
          ))}
        </div>
      )}

      {/* Listening Glow Aura */}
      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute -inset-3 rounded-full bg-cyan-400/30 blur-lg"
        />
      )}

      {/* Ground Shadow */}
      <div className="absolute -bottom-2 h-3 w-16 rounded-full bg-black/40 blur-md" />

      {/* Pixel-Art Crisp Blue Cloud Robot Character SVG */}
      <svg
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Pixel Cloud Head Structure */}
        <path
          d="M25 45 C14 45, 8 33, 16 23 C14 12, 28 5, 42 9 C50 2, 64 2, 72 9 C84 5, 94 12, 90 25 C97 35, 90 48, 77 46 C77 57, 66 61, 50 61 C34 61, 25 57, 25 45 Z"
          fill="#4f75ff"
          stroke="#203387"
          strokeWidth="3"
        />

        {/* Specular Pixel Top Highlight */}
        <path
          d="M32 18 C42 9, 62 9, 70 16 C78 12, 84 18, 82 26"
          stroke="#7d9eff"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Dark Terminal Screen Frame */}
        <rect
          x="27"
          y="23"
          width="46"
          height="32"
          rx="9"
          fill="#0c1222"
          stroke="#203387"
          strokeWidth="2.5"
        />

        {/* Screen Glass Shimmer */}
        <path
          d="M30 26 L70 26 C64 31, 36 31, 30 26 Z"
          fill="rgba(255,255,255,0.25)"
        />

        {/* Interactive CLI Screen Eyes (`> _` / `^ _ ^` / `> O <`) */}
        <motion.g
          style={{ x: eyeX, y: eyeY }}
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {blinkState === "surprised" ? (
            /* Surprised Eyes `> O <` */
            <>
              <path d="M34 38 L38 34 L34 30" />
              <circle cx="50" cy="38" r="4" fill="#38bdf8" />
              <path d="M66 38 L62 34 L66 30" />
            </>
          ) : blinkState === "blink" ? (
            /* Blink Line `> -` */
            <>
              <path d="M34 34 L40 39 L34 44" />
              <path d="M48 42 L58 42" strokeWidth="2" />
            </>
          ) : isHovered || blinkState === "happy" ? (
            /* Happy Winking Eyes `^ _ ^` */
            <>
              <path d="M34 41 Q39 33 44 41" />
              <path d="M52 41 Q57 33 62 41" />
            </>
          ) : (
            /* Normal CLI Terminal Prompt Eyes `> _` */
            <>
              <path d="M34 34 L40 39 L34 44" />
              <path d="M48 42 L58 42" strokeWidth="3">
                <animate
                  attributeName="opacity"
                  values="1;0;1"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
            </>
          )}
        </motion.g>

        {/* Animated Mouth Equalizer when Speaking */}
        {isSpeaking && (
          <g fill="#38bdf8">
            <rect x="42" y="47" width="2" height="4">
              <animate attributeName="height" values="2;6;2" dur="0.3s" repeatCount="indefinite" />
            </rect>
            <rect x="46" y="46" width="2" height="6">
              <animate attributeName="height" values="6;2;6" dur="0.3s" repeatCount="indefinite" />
            </rect>
            <rect x="50" y="47" width="2" height="4">
              <animate attributeName="height" values="3;7;3" dur="0.3s" repeatCount="indefinite" />
            </rect>
            <rect x="54" y="46" width="2" height="6">
              <animate attributeName="height" values="5;2;5" dur="0.3s" repeatCount="indefinite" />
            </rect>
          </g>
        )}

        {/* Body Container */}
        <rect
          x="35"
          y="61"
          width="30"
          height="28"
          rx="8"
          fill="#4f75ff"
          stroke="#203387"
          strokeWidth="2.5"
        />

        {/* Body Terminal Emblem (`> -`) */}
        <g stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" opacity="0.95">
          <path d="M43 72 L47 75 L43 78" />
          <path d="M51 78 L57 78" />
        </g>

        {/* Left Arm (Waving animation on hover) */}
        <motion.path
          animate={{
            rotate: isHovered ? [-15, 20, -15] : 0,
          }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
          d="M35 67 C27 71, 25 80, 29 84"
          stroke="#4f75ff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M35 67 C27 71, 25 80, 29 84"
          stroke="#203387"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Right Arm (Waving animation on hover) */}
        <motion.path
          animate={{
            rotate: isHovered ? [15, -20, 15] : 0,
          }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
          d="M65 67 C73 71, 75 80, 71 84"
          stroke="#4f75ff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M65 67 C73 71, 75 80, 71 84"
          stroke="#203387"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Left Leg */}
        <rect x="39" y="88" width="7.5" height="13" rx="3.5" fill="#4f75ff" stroke="#203387" strokeWidth="2" />
        {/* Right Leg */}
        <rect x="53.5" y="88" width="7.5" height="13" rx="3.5" fill="#4f75ff" stroke="#203387" strokeWidth="2" />
      </svg>
    </motion.div>
  );
}
