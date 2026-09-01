"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

function CharReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }): ReactNode {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
}

export function IntroLine(): ReactNode {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-foreground text-[20px] leading-tight font-medium tracking-tight sm:text-[22px]"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-flex">
          <motion.span
            animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
            transition={{
              duration: 2.2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3.5,
              delay: 0.6,
            }}
            className="inline-block origin-bottom-right"
            aria-hidden="true"
          >
            👋
          </motion.span>
        </span>
        <span className="inline-flex flex-wrap">
          {"Hey, I'm Abedin.".split("").map((char, i) => (
            <CharReveal key={i} delay={0.35 + i * 0.025}>
              {char === " " ? "\u00A0" : char}
            </CharReveal>
          ))}
        </span>
      </span>
    </motion.p>
  );
}
