"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";

type TimePeriod = "morning" | "afternoon" | "evening" | "night";

function getTimePeriod(): TimePeriod {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

type WeatherData = {
  temperature: number;
  weatherCode: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const GREETINGS: Record<TimePeriod, string> = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
  night: "Good night",
};

const WEATHER_ICONS: Record<number, React.ComponentType<{ className?: string }>> = {
  0: Sun,
  1: Cloud,
  2: Cloud,
  3: Cloud,
  45: Cloud,
  48: Cloud,
  51: CloudRain,
  53: CloudRain,
  55: CloudRain,
  61: CloudRain,
  63: CloudRain,
  65: CloudRain,
  71: CloudSnow,
  73: CloudSnow,
  75: CloudSnow,
  80: CloudRain,
  81: CloudRain,
  82: CloudRain,
  95: Cloud,
  96: Cloud,
  99: Cloud,
};

function TimeDigit({ value }: { value: string }): ReactNode {
  const prevRef = useRef(value);
  const [display, setDisplay] = useState(value);
  const [direction, setDirection] = useState<number>(1);

  useEffect(() => {
    if (value !== prevRef.current) {
      const diff = Number(value) - Number(prevRef.current);
      setDirection(diff > 0 || (prevRef.current === "59" && value === "00") ? 1 : -1);
      prevRef.current = value;
      setDisplay(value);
    }
  }, [value]);

  const enterY = direction > 0 ? "100%" : "-100%";
  const exitY = direction > 0 ? "-100%" : "100%";

  return (
    <span className="relative inline-flex h-[1.1em] w-[0.65em] overflow-hidden align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={display}
          initial={{ y: enterY, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: exitY, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: EASE }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          {display}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Clock(): ReactNode {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");

  return (
    <span className="font-mono text-[13px] tracking-tight text-foreground/40 tabular-nums">
      {h.split("").map((d, i) => (
        <TimeDigit key={`h-${i}`} value={d} />
      ))}
      <span className="mx-[0.2em] animate-pulse text-foreground/25">:</span>
      {m.split("").map((d, i) => (
        <TimeDigit key={`m-${i}`} value={d} />
      ))}
      <span className="mx-[0.2em] animate-pulse text-foreground/25">:</span>
      {s.split("").map((d, i) => (
        <TimeDigit key={`s-${i}`} value={d} />
      ))}
    </span>
  );
}

export function TimeGreeting(): ReactNode {
  const [period, setPeriod] = useState<TimePeriod>(getTimePeriod());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(() =>
    typeof navigator !== "undefined" && !!navigator.geolocation
  );
  const [error, setError] = useState<boolean>(() =>
    typeof navigator === "undefined" || !navigator.geolocation
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPeriod(getTimePeriod());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          );
          if (!res.ok) throw new Error("Weather fetch failed");
          const data = await res.json();
          setWeather({
            temperature: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode,
          });
        } catch {
          setError(true);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(true);
        setLoading(false);
      }
    );
  }, []);

  const Icon = weather ? WEATHER_ICONS[weather.weatherCode] ?? Cloud : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="flex flex-wrap items-center gap-x-3 gap-y-1"
    >
      <div className="flex items-center gap-2 text-[20px] leading-tight font-medium tracking-tight text-foreground sm:text-[22px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={period}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex items-center"
          >
            {GREETINGS[period]}
            <span aria-hidden="true" className="ml-1.5">
              {period === "night" ? "🌙" : period === "morning" ? "☀️" : period === "afternoon" ? "🌤" : "🌅"}
            </span>
          </motion.p>
        </AnimatePresence>
      </div>

      <span className="hidden sm:inline-block text-foreground/15" aria-hidden="true">·</span>
      <span className="sm:hidden text-foreground/15" aria-hidden="true">·</span>

      <span className="inline-flex items-center gap-1.5 text-foreground/50">
        {!loading && !error && Icon && (
          <>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-mono text-[13px] tabular-nums">{weather?.temperature}°</span>
          </>
        )}
        {loading && (
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 animate-pulse rounded-full bg-foreground/10" />
            <span className="font-mono text-[13px] text-foreground/25">--°</span>
          </span>
        )}
        {error && !weather && (
          <span className="font-mono text-[13px] text-foreground/25">--°</span>
        )}
      </span>

      <span className="hidden sm:inline-block text-foreground/15" aria-hidden="true">·</span>
      <span className="sm:hidden text-foreground/15" aria-hidden="true">·</span>

      <Clock />
    </motion.div>
  );
}
