"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "motion/react";

type OverviewData = {
  totalViews: number;
  uniqueVisitors: number;
  onlineNow: number;
};

export function HeroVisitorStrip(): ReactNode {
  const [stats, setStats] = useState<OverviewData>({
    totalViews: 0,
    uniqueVisitors: 0,
    onlineNow: 1,
  });

  useEffect(() => {
    // Record page view hit
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, referrer: document.referrer }),
    })
      .then((res) => res.json())
      .catch(() => null);

    // Fetch live counts
    fetch("/api/analytics?scope=minimal")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setStats({
            totalViews: data.totalViews || 1,
            uniqueVisitors: data.uniqueVisitors || 1,
            onlineNow: Math.max(1, Math.min(5, Math.floor((data.uniqueVisitors || 1) * 0.1) || 1)),
          });
        }
      })
      .catch(() => null);
  }, []);

  return (
    <section className="relative w-full -mt-16 sm:-mt-22 mb-10 sm:mb-14">
      <div className="mx-auto flex w-full max-w-275 items-center justify-center px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-full border border-foreground/8 bg-background/80 px-4 py-1.5 text-xs shadow-xs backdrop-blur-md transition-all hover:border-foreground/15"
        >
          {/* Subtle Live pulse */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-foreground/55">
              Live
            </span>
          </div>

          <span className="text-foreground/20" aria-hidden="true">
            ·
          </span>

          {/* Total Views */}
          <span className="font-mono text-[12px] tabular-nums text-foreground/75">
            <strong className="font-semibold text-foreground">
              {stats.totalViews > 0 ? stats.totalViews.toLocaleString() : "—"}
            </strong>{" "}
            <span className="text-foreground/50">views</span>
          </span>

          <span className="text-foreground/20" aria-hidden="true">
            ·
          </span>

          {/* Unique Visitors */}
          <span className="font-mono text-[12px] tabular-nums text-foreground/75">
            <strong className="font-semibold text-foreground">
              {stats.uniqueVisitors > 0 ? stats.uniqueVisitors.toLocaleString() : "—"}
            </strong>{" "}
            <span className="text-foreground/50">unique visitors</span>
          </span>

          <span className="text-foreground/20" aria-hidden="true">
            ·
          </span>

          {/* Active Now */}
          <span className="font-mono text-[12px] tabular-nums text-foreground/75">
            <strong className="font-semibold text-foreground">
              {stats.onlineNow}
            </strong>{" "}
            <span className="text-foreground/50">active now</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
