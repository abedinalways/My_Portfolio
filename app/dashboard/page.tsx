"use client";

import {
  Activity,
  ArrowLeft,
  BarChart3,
  Compass,
  Database,
  ExternalLink,
  Eye,
  Globe,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

type AnalyticsData = {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    onlineNow: number;
    isUsingUpstash: boolean;
    lastUpdated: string;
  };
  weeklyTrend: { date: string; views: number; unique: number }[];
  topCountries: { code: string; name: string; flag: string; percent: number; count: number }[];
  referrers: { source: string; domain: string; percent: number; visits: number }[];
  topPages: { path: string; title: string; views: number; percent: number }[];
  devices: { type: string; percent: number }[];
};

export default function DashboardPage(): ReactNode {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const fetchStats = () => {
    setLoading(true);
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const errorData = await res.json();
        setLoginError(errorData.error || "Invalid credentials");
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    setData(null);
  };

  // Initial loading state while verifying session
  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-24 pb-20">
        <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
          <span>Verifying admin security...</span>
        </div>
      </main>
    );
  }

  // Render Login Form if NOT Authenticated
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card/80 p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* Subtle glowing ambient orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 h-48 w-48 rounded-full bg-blue-500/15 blur-3xl"
          />

          <div className="relative z-10 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
              <Lock className="h-5 w-5" />
            </div>

            <h1 className="font-serif text-2xl font-bold tracking-tight text-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Private access for Sheikh Minhajul Abedin only.
            </p>
          </div>

          <form onSubmit={handleLogin} className="relative z-10 mt-6 space-y-4">
            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-600 dark:text-red-400"
                >
                  {loginError}
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Mail className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <KeyRound className="pointer-events-none absolute right-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Unlock Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Return to Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  const maxViews = data && data.weeklyTrend.length > 0
    ? Math.max(...data.weeklyTrend.map((d) => d.views), 1)
    : 10;

  // Render Full Protected Dashboard
  return (
    <main id="main-content" className="flex flex-1 flex-col pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        {/* Top Header Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Public Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>100% Real Tracking Active</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Title & Engine Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 mb-3">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Telemetry Portal • Sheikh Minhajul Abedin</span>
            </div>
            <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Live Visitor Telemetry
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Real-time hits, unique visitor cookies, geographic country routing, and device analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/80 px-3.5 py-2 text-xs">
              <Database className="h-4 w-4 text-blue-500" />
              <div className="text-left font-mono">
                <span className="block text-[10px] text-muted-foreground uppercase font-semibold">
                  Storage Engine
                </span>
                <span className="font-medium text-foreground">
                  {data?.overview.isUsingUpstash ? "Upstash Redis Cloud" : "Local Persistent Engine"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchStats}
              title="Refresh Data"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ── Real KPI Metrics ── */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: Total Real Views */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Total Real Views</span>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {data ? data.overview.totalViews.toLocaleString() : "0"}
              </span>
              <span className="text-xs font-mono text-emerald-500 font-semibold">Real Hits</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Actual page impressions recorded</p>
          </div>

          {/* Metric 2: Unique Visitors */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Unique Visitors</span>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {data ? data.overview.uniqueVisitors.toLocaleString() : "0"}
              </span>
              <span className="text-xs font-mono text-purple-500 font-semibold">Unique IDs</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Distinct devices &amp; browsers</p>
          </div>

          {/* Metric 3: Active Now */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Active Online</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {data ? `${data.overview.onlineNow} Online` : "1 Online"}
              </span>
              <span className="text-xs font-mono text-emerald-500 font-semibold">Live Session</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Current browsing session</p>
          </div>

          {/* Metric 4: Vercel Web Analytics */}
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium">Vercel Web Analytics</span>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground">
                Active &amp; Streaming
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">@vercel/analytics in layout</p>
          </div>
        </div>

        {/* ── Main Breakdown Grid ── */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Trend Chart */}
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-foreground">Recorded Daily Activity</h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Timeline</span>
            </div>

            {data && data.weeklyTrend.length > 0 ? (
              <div className="mt-6 flex h-48 items-end justify-between gap-3 pt-6">
                {data.weeklyTrend.map((day) => {
                  const heightPercent = Math.max(20, Math.round((day.views / maxViews) * 100));
                  return (
                    <div key={day.date} className="group relative flex flex-1 flex-col items-center h-full justify-end">
                      <div className="pointer-events-none absolute -top-10 z-20 hidden flex-col items-center rounded-lg bg-black px-2 py-1 text-[10px] text-white shadow-xl group-hover:flex">
                        <span className="font-bold">{day.views} visits</span>
                      </div>
                      <div
                        className="w-full max-w-12 rounded-t-lg bg-blue-600 dark:bg-blue-500 transition-all hover:opacity-80"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="mt-2 text-[10px] font-mono text-muted-foreground truncate w-full text-center">
                        {day.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
                No historical days recorded yet. Visits will plot here automatically.
              </div>
            )}
          </div>

          {/* Top Referrers */}
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-foreground">Real Referral Sources</h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Visits</span>
            </div>

            <div className="mt-5 space-y-3.5">
              {data && data.referrers.length > 0 ? (
                data.referrers.map((ref) => (
                  <div key={ref.domain} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground truncate">{ref.source}</span>
                      <span className="font-mono text-muted-foreground">{ref.visits}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${ref.percent}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  Direct visits recorded. Referral links will populate as visitors click through.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Second Row: Countries & Pages ── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Countries */}
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-foreground">Visitor Countries</h3>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">GeoIP</span>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data && data.topCountries.length > 0 ? (
                data.topCountries.map((c) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-card/80 p-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{c.flag}</span>
                      <span className="truncate text-xs font-medium text-foreground">{c.name}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-foreground">{c.count}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center text-xs text-muted-foreground py-6">
                  Country data extracted on deployment via Vercel Edge Headers.
                </div>
              )}
            </div>
          </div>

          {/* Top Pages */}
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-foreground">Top Viewed Routes</h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">Hits</span>
            </div>

            <div className="mt-5 space-y-2.5">
              {data && data.topPages.length > 0 ? (
                data.topPages.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-card/70 px-3.5 py-2.5"
                  >
                    <div className="min-w-0 pr-3">
                      <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                        {page.path}
                      </span>
                      <span className="truncate block text-xs text-muted-foreground">
                        {page.title}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-foreground">{page.views}</span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-muted-foreground py-6">
                  Page hit distribution will appear here.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upstash Setup Banner */}
        {!data?.overview.isUsingUpstash && (
          <div className="mt-8 rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-base font-semibold text-foreground flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  Connect Upstash Redis Cloud (Optional)
                </h4>
                <p className="mt-1 max-w-xl text-xs text-muted-foreground">
                  Your tracking is currently running on the local engine. To sync data across all Vercel edge instances, add <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">UPSTASH_REDIS_REST_URL</code> and <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">UPSTASH_REDIS_REST_TOKEN</code> to your <code className="font-mono">.env.local</code> and Vercel project settings.
                </p>
              </div>

              <a
                href="https://upstash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <span>Get Free Upstash DB</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
