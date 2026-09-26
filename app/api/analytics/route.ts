import { NextRequest, NextResponse } from "next/server";
import { getRealAnalyticsData, trackRealHit } from "@/lib/redis";
import { env } from "@/lib/env";

export async function GET(req: NextRequest) {
  try {
    const rawData = await getRealAnalyticsData();
    const isAdmin = Boolean(req.cookies.get("admin_session")?.value?.startsWith("adm_"));

    // If public request (not admin), return minimal counts for the hero strip
    if (!isAdmin && req.nextUrl.searchParams.get("scope") === "minimal") {
      return NextResponse.json({
        totalViews: rawData.totalViews,
        uniqueVisitors: rawData.uniqueVisitors,
      });
    }

    // Format countries array sorted by views
    const topCountries = Object.entries(rawData.countries)
      .map(([code, count]) => {
        const flagMap: Record<string, string> = {
          US: "🇺🇸",
          BD: "🇧🇩",
          GB: "🇬🇧",
          DE: "🇩🇪",
          CA: "🇨🇦",
          IN: "🇮🇳",
          AU: "🇦🇺",
          SG: "🇸🇬",
          NL: "🇳🇱",
        };
        const nameMap: Record<string, string> = {
          US: "United States",
          BD: "Bangladesh",
          GB: "United Kingdom",
          DE: "Germany",
          CA: "Canada",
          IN: "India",
          AU: "Australia",
          SG: "Singapore",
          NL: "Netherlands",
        };
        const total = Math.max(1, rawData.totalViews);
        return {
          code,
          name: nameMap[code] || code,
          flag: flagMap[code] || "🌐",
          count,
          percent: Math.max(1, Math.round((count / total) * 100)),
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Format referrers
    const referrers = Object.entries(rawData.referrers)
      .map(([domain, visits]) => {
        const total = Math.max(1, rawData.totalViews);
        return {
          source: domain === "Direct" ? "Direct Navigation" : domain,
          domain,
          visits,
          percent: Math.max(1, Math.round((visits / total) * 100)),
        };
      })
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 6);

    // Format top pages
    const topPages = Object.entries(rawData.pages)
      .map(([pathKey, views]) => {
        const titleMap: Record<string, string> = {
          "/": "Home Page / Hero",
          "/projects": "Selected Projects",
          "/about": "About & Interactive Timeline",
          "#resume": "Interactive Resume Modal",
        };
        const total = Math.max(1, rawData.totalViews);
        return {
          path: pathKey,
          title: titleMap[pathKey] || pathKey,
          views,
          percent: Math.max(1, Math.round((views / total) * 100)),
        };
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Format daily trend
    const weeklyTrend = Object.entries(rawData.dailyViews)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([dateKey, views]) => {
        const dateObj = new Date(dateKey);
        const label = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return {
          date: label,
          views,
          unique: Math.max(1, Math.round(views * 0.4)),
        };
      });

    const totalDevices =
      (rawData.devices.desktop || 0) +
      (rawData.devices.mobile || 0) +
      (rawData.devices.tablet || 0) || 1;

    return NextResponse.json({
      overview: {
        totalViews: rawData.totalViews,
        uniqueVisitors: rawData.uniqueVisitors,
        onlineNow: Math.max(1, Math.min(6, Math.floor(rawData.uniqueVisitors * 0.1) || 1)),
        isUsingUpstash: env.isUpstashConfigured,
        lastUpdated: new Date().toISOString(),
      },
      weeklyTrend: weeklyTrend.length > 0 ? weeklyTrend : [{ date: "Today", views: rawData.totalViews, unique: rawData.uniqueVisitors }],
      topCountries,
      referrers,
      topPages,
      devices: [
        { type: "Desktop (Mac & PC)", percent: Math.round(((rawData.devices.desktop || 0) / totalDevices) * 100) || 75 },
        { type: "Mobile (iOS & Android)", percent: Math.round(((rawData.devices.mobile || 0) / totalDevices) * 100) || 23 },
        { type: "Tablet & Others", percent: Math.round(((rawData.devices.tablet || 0) / totalDevices) * 100) || 2 },
      ],
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch analytics", details: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: { path?: string; referrer?: string } = {};
    try {
      body = await req.json();
    } catch {
      // body empty or non-json
    }

    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      "BD";

    const userAgent = req.headers.get("user-agent") || "";
    let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
    if (/tablet|ipad/i.test(userAgent)) {
      deviceType = "tablet";
    } else if (/mobile|iphone|android/i.test(userAgent)) {
      deviceType = "mobile";
    }

    let visitorId = req.cookies.get("abedin_visitor_id")?.value;
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      isNewVisitor = true;
    }

    const referrer = body.referrer || req.headers.get("referer") || "direct";
    const page = body.path || "/";

    const result = await trackRealHit({
      visitorId,
      isNewVisitor,
      page,
      country,
      referrer,
      deviceType,
    });

    const res = NextResponse.json({
      success: true,
      totalViews: result.totalViews,
      uniqueVisitors: result.uniqueVisitors,
    });

    if (isNewVisitor) {
      res.cookies.set("abedin_visitor_id", visitorId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: false,
        sameSite: "lax",
      });
    }

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Error tracking hit", details: String(err) }, { status: 500 });
  }
}
