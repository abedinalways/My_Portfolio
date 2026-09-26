import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import { env } from "@/lib/env";

// Initialize Upstash Redis if credentials exist
export const redis = env.isUpstashConfigured
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Local persistent fallback file path
const LOCAL_STORE_PATH = path.join(process.cwd(), ".analytics-data.json");

export type RealAnalyticsRecord = {
  totalViews: number;
  uniqueVisitors: number;
  visitors: string[]; // Set of hashed/unique visitor IDs
  countries: Record<string, number>; // { US: 12, BD: 34 }
  referrers: Record<string, number>; // { "linkedin.com": 5, "github.com": 3 }
  pages: Record<string, number>; // { "/": 20, "/projects": 8 }
  devices: { desktop: number; mobile: number; tablet: number };
  dailyViews: Record<string, number>; // { "2026-09-26": 14 }
};

const DEFAULT_RECORD: RealAnalyticsRecord = {
  totalViews: 0,
  uniqueVisitors: 0,
  visitors: [],
  countries: {},
  referrers: {},
  pages: {},
  devices: { desktop: 0, mobile: 0, tablet: 0 },
  dailyViews: {},
};

// In-memory fallback if file system is read-only
let memoryRecord: RealAnalyticsRecord = { ...DEFAULT_RECORD };

function readLocalStore(): RealAnalyticsRecord {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const content = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch {
    // fallback to memory
  }
  return memoryRecord;
}

function writeLocalStore(data: RealAnalyticsRecord): void {
  memoryRecord = data;
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // in read-only environments (e.g. some serverless instances), memoryRecord serves as fallback
  }
}

/**
 * Record a real visitor hit into Upstash Redis or local persistent store
 */
export async function trackRealHit(params: {
  visitorId: string;
  isNewVisitor: boolean;
  page: string;
  country: string;
  referrer: string;
  deviceType: "desktop" | "mobile" | "tablet";
}): Promise<{ totalViews: number; uniqueVisitors: number }> {
  const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  if (redis) {
    try {
      // 1. Increment total views
      const totalViews = await redis.incr("analytics:total_views");

      // 2. Track unique visitor
      if (params.isNewVisitor) {
        await redis.sadd("analytics:unique_visitors", params.visitorId);
      }
      const uniqueVisitors = await redis.scard("analytics:unique_visitors");

      // 3. Track daily views
      await redis.hincrby("analytics:daily_views", todayKey, 1);

      // 4. Track country
      const countryCode = params.country || "Unknown";
      await redis.hincrby("analytics:countries", countryCode, 1);

      // 5. Track page
      const pageKey = params.page || "/";
      await redis.hincrby("analytics:pages", pageKey, 1);

      // 6. Track referrer
      let refDomain = "Direct";
      if (params.referrer && params.referrer !== "direct") {
        try {
          refDomain = new URL(params.referrer).hostname.replace(/^www\./, "");
        } catch {
          refDomain = params.referrer;
        }
      }
      await redis.hincrby("analytics:referrers", refDomain, 1);

      // 7. Track device
      await redis.hincrby("analytics:devices", params.deviceType, 1);

      return { totalViews, uniqueVisitors };
    } catch (err) {
      console.error("Upstash Redis error, falling back to local store:", err);
    }
  }

  // Local persistent fallback
  const store = readLocalStore();
  store.totalViews += 1;

  if (params.isNewVisitor && !store.visitors.includes(params.visitorId)) {
    store.visitors.push(params.visitorId);
    store.uniqueVisitors = store.visitors.length;
  }

  // Daily views
  store.dailyViews[todayKey] = (store.dailyViews[todayKey] || 0) + 1;

  // Country
  const countryCode = params.country || "BD";
  store.countries[countryCode] = (store.countries[countryCode] || 0) + 1;

  // Page
  const pageKey = params.page || "/";
  store.pages[pageKey] = (store.pages[pageKey] || 0) + 1;

  // Referrer
  let refDomain = "Direct";
  if (params.referrer && params.referrer !== "direct") {
    try {
      refDomain = new URL(params.referrer).hostname.replace(/^www\./, "");
    } catch {
      refDomain = params.referrer;
    }
  }
  store.referrers[refDomain] = (store.referrers[refDomain] || 0) + 1;

  // Device
  store.devices[params.deviceType] = (store.devices[params.deviceType] || 0) + 1;

  writeLocalStore(store);

  return { totalViews: store.totalViews, uniqueVisitors: store.uniqueVisitors };
}

/**
 * Get real analytics data from Upstash Redis or local store
 */
export async function getRealAnalyticsData(): Promise<RealAnalyticsRecord> {
  if (redis) {
    try {
      const [
        totalViewsRaw,
        uniqueVisitorsRaw,
        dailyViewsRaw,
        countriesRaw,
        referrersRaw,
        pagesRaw,
        devicesRaw,
      ] = await Promise.all([
        redis.get<number>("analytics:total_views"),
        redis.scard("analytics:unique_visitors"),
        redis.hgetall<Record<string, number>>("analytics:daily_views"),
        redis.hgetall<Record<string, number>>("analytics:countries"),
        redis.hgetall<Record<string, number>>("analytics:referrers"),
        redis.hgetall<Record<string, number>>("analytics:pages"),
        redis.hgetall<Record<string, number>>("analytics:devices"),
      ]);

      const totalViews = Number(totalViewsRaw) || 0;
      const uniqueVisitors = Number(uniqueVisitorsRaw) || 0;

      return {
        totalViews,
        uniqueVisitors,
        visitors: [],
        dailyViews: dailyViewsRaw || {},
        countries: countriesRaw || {},
        referrers: referrersRaw || {},
        pages: pagesRaw || {},
        devices: {
          desktop: Number(devicesRaw?.desktop) || 0,
          mobile: Number(devicesRaw?.mobile) || 0,
          tablet: Number(devicesRaw?.tablet) || 0,
        },
      };
    } catch (err) {
      console.error("Upstash Redis fetch error, using local store:", err);
    }
  }

  return readLocalStore();
}
