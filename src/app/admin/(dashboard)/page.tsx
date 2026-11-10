
"use client";

import { useCallback, useEffect, useState } from "react";

type Overview = {
  activeUsers: number;
  pageViews: number;
  sessions: number;
  engagementRate: number;
};

type DailyVisitor = {
  date: string;
  visitors: number;
  pageViews: number;
};

type TopPage = {
  page: string;
  pageViews: number;
  visitors: number;
};

type TrafficSource = {
  source: string;
  sessions: number;
  visitors: number;
};

type AnalyticsData = {
  overview: Overview;
  dailyVisitors: DailyVisitor[];
  topPages: TopPage[];
  trafficSources: TrafficSource[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
};

type Period = "7daysAgo" | "30daysAgo" | "90daysAgo";
type DashboardLocale = "en" | "ar";
type DashboardTheme = "light" | "dark";

const PERIODS: Record<DashboardLocale, { label: string; value: Period }[]> = {
  en: [
    { label: "Last 7 days", value: "7daysAgo" },
    { label: "Last 30 days", value: "30daysAgo" },
    { label: "Last 90 days", value: "90daysAgo" },
  ],
  ar: [
    { label: "آخر 7 أيام", value: "7daysAgo" },
    { label: "آخر 30 يومًا", value: "30daysAgo" },
    { label: "آخر 90 يومًا", value: "90daysAgo" },
  ],
};

const COPY: Record<DashboardLocale, {
  badge: string;
  pageTitle: string;
  pageDescription: string;
  periodLabel: string;
  refresh: string;
  errorTitle: string;
  retry: string;
  keyMetrics: string;
  keyMetricsDescription: string;
  activeUsers: string;
  activeUsersDesc: string;
  pageViews: string;
  pageViewsDesc: string;
  sessions: string;
  sessionsDesc: string;
  engagement: string;
  engagementDesc: string;
  visitorActivity: string;
  visitorActivityDesc: string;
  activeVisitors: string;
  loadingVisitors: string;
  noVisitors: string;
  topPages: string;
  topPagesDesc: string;
  topPagesBadge: string;
  pageTable: string;
  views: string;
  visitors: string;
  noPages: string;
  loadingPages: string;
  trafficSources: string;
  trafficSourcesDesc: string;
  loadingTraffic: string;
  noTraffic: string;
  dataSource: string;
  lastUpdated: string;
  dataNote: string;
  verticalAxis: string;
  horizontalAxis: string;
  dailyTotal: string;
  dailyNote: string;
  tryAgain: string;
}> = {
  en: {
    badge: "WEBSITE ANALYTICS",
    pageTitle: "Dashboard Overview",
    pageDescription: "Monitor your website performance and visitor activity.",
    periodLabel: "Select analytics period",
    refresh: "Refresh",
    errorTitle: "Analytics could not be loaded",
    retry: "Try again",
    keyMetrics: "Key Metrics",
    keyMetricsDescription: "A summary of your website activity during the selected period.",
    activeUsers: "Active Users",
    activeUsersDesc: "Unique active visitors",
    pageViews: "Page Views",
    pageViewsDesc: "Total pages viewed",
    sessions: "Sessions",
    sessionsDesc: "Total website sessions",
    engagement: "Engagement Rate",
    engagementDesc: "Percentage of engaged sessions",
    visitorActivity: "Visitor Activity",
    visitorActivityDesc: "Track daily visitor trends and compare activity over time.",
    activeVisitors: "Active Visitors",
    loadingVisitors: "Loading visitor activity...",
    noVisitors: "No visitor data available for this period.",
    topPages: "Top Pages",
    topPagesDesc: "The most visited pages on your website.",
    topPagesBadge: "Top 10",
    pageTable: "Page",
    views: "Views",
    visitors: "Visitors",
    noPages: "No page data available.",
    loadingPages: "Loading pages...",
    trafficSources: "Traffic Sources",
    trafficSourcesDesc: "Where your website sessions originate.",
    loadingTraffic: "Loading traffic sources...",
    noTraffic: "No traffic source data available.",
    dataSource: "Data provided by Google Analytics 4",
    lastUpdated: "Last updated",
    dataNote: "Daily visitor counts are summed and may include the same visitor on multiple days.",
    verticalAxis: "Vertical axis: Active visitors",
    horizontalAxis: "Horizontal axis: Date",
    dailyTotal: "Daily visitors total",
    dailyNote: "Daily visitor counts are summed and may include the same visitor on multiple days.",
    tryAgain: "Try again",
  },
  ar: {
    badge: "إحصاءات الموقع",
    pageTitle: "نظرة عامة على لوحة التحكم",
    pageDescription: "تابع أداء موقعك ونشاط الزوار في الوقت الفعلي.",
    periodLabel: "اختر الفترة الإحصائية",
    refresh: "تحديث",
    errorTitle: "تعذّر تحميل الإحصاءات",
    retry: "حاول مرة أخرى",
    keyMetrics: "المؤشرات الرئيسية",
    keyMetricsDescription: "ملخص لنشاط موقعك خلال الفترة المحددة.",
    activeUsers: "المستخدمون النشطون",
    activeUsersDesc: "زوار فريدون نشطون",
    pageViews: "مشاهدات الصفحة",
    pageViewsDesc: "إجمالي الصفحات المشاهدة",
    sessions: "الجلسات",
    sessionsDesc: "إجمالي جلسات الموقع",
    engagement: "معدل التفاعل",
    engagementDesc: "نسبة الجلسات المتفاعلة",
    visitorActivity: "نشاط الزوار",
    visitorActivityDesc: "تتبع اتجاهات الزوار اليومية ومقارنتها عبر الوقت.",
    activeVisitors: "الزوار النشطون",
    loadingVisitors: "جارٍ تحميل نشاط الزوار...",
    noVisitors: "لا توجد بيانات زوار لهذه الفترة.",
    topPages: "أكثر الصفحات زيارة",
    topPagesDesc: "الصفحات الأكثر زيارة على موقعك.",
    topPagesBadge: "أفضل 10",
    pageTable: "الصفحة",
    views: "المشاهدات",
    visitors: "الزوار",
    noPages: "لا توجد بيانات للصفحات.",
    loadingPages: "جارٍ تحميل الصفحات...",
    trafficSources: "مصادر الزيارات",
    trafficSourcesDesc: "أين تأتي جلسات موقعك.",
    loadingTraffic: "جارٍ تحميل مصادر الزيارات...",
    noTraffic: "لا توجد بيانات عن مصادر الزيارات.",
    dataSource: "البيانات مقدمة من Google Analytics 4",
    lastUpdated: "آخر تحديث",
    dataNote: "يتم جمع أعداد الزوار اليومية وقد تشمل نفس الزائر على أكثر من يوم.",
    verticalAxis: "المحور العمودي: الزوار النشطون",
    horizontalAxis: "المحور الأفقي: التاريخ",
    dailyTotal: "إجمالي الزوار اليومي",
    dailyNote: "يتم جمع أعداد الزوار اليومية وقد تشمل نفس الزائر على أكثر من يوم.",
    tryAgain: "حاول مرة أخرى",
  },
};

function formatNumber(value: number, locale: DashboardLocale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US").format(value);
}

function formatDate(
  date: string,
  locale: DashboardLocale,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", {
    month: "short",
    day: "numeric",
    ...options,
  }).format(new Date(`${date}T00:00:00`));
}

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name:
    | "users"
    | "eye"
    | "sessions"
    | "engagement"
    | "refresh"
    | "calendar"
    | "globe"
    | "chart";
  className?: string;
}) {
  const paths = {
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    sessions: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 4 3 6-7" />
      </>
    ),
    engagement: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    refresh: (
      <>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 4 3 6-7" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  loading,
}: {
  title: string;
  value: string;
  description: string;
  icon: "users" | "eye" | "sessions" | "engagement";
  loading: boolean;
}) {
  const iconStyles = {
    users: "bg-[var(--color-info-soft)] text-[var(--color-primary)]",
    eye: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    sessions: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    engagement: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  };

  return (
    <div className="group rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--color-foreground-muted)]">{title}</p>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {loading ? (
              <span className="inline-block h-9 w-24 animate-pulse rounded-lg bg-[var(--color-background-soft)]" />
            ) : (
              value
            )}
          </p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconStyles[icon]}`}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--color-foreground-muted)]">{description}</p>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-[var(--color-foreground)]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">{description}</p>
      </div>

      {action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-background-soft)] text-[var(--color-foreground-muted)]">
        <Icon name="chart" className="h-6 w-6" />
      </div>

      <p className="text-sm text-[var(--color-foreground-muted)]">{message}</p>
    </div>
  );
}

function VisitorsChart({ items, locale }: { items: DailyVisitor[]; locale: DashboardLocale }) {
  const width = 900;
  const height = 320;

  const padding = { top: 25, right: 25, bottom: 48, left: 65 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...items.map((item) => item.visitors), 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const step = Math.max(1, (Math.ceil(maxValue / magnitude / 5) * magnitude) / 5);
  const yMax = Math.ceil(maxValue / step) * step || 1;
  const yTicks = Array.from({ length: 6 }, (_, index) => (yMax / 5) * index);

  const points = items.map((item, index) => {
    const x =
      padding.left +
      (items.length <= 1 ? chartWidth / 2 : (index / (items.length - 1)) * chartWidth);
    const y = padding.top + chartHeight - (item.visitors / yMax) * chartHeight;
    return { x, y, item };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";

  const labelCount = Math.min(6, items.length);
  const labelIndexes = new Set(
    Array.from({ length: labelCount }, (_, index) =>
      Math.round((index * (items.length - 1)) / (labelCount - 1 || 1))
    )
  );
  const visitorsLabel = locale === "ar" ? "زوار" : "visitors";
  const pageViewsLabel = locale === "ar" ? "مشاهدات الصفحة" : "page views";

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto min-w-[600px] w-full overflow-visible"
          role="img"
          aria-label="Daily active visitors line chart with numeric vertical axis"
        >
          <defs>
            <linearGradient id="visitors-area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {yTicks.map((tick, index) => {
            const y = padding.top + chartHeight - (tick / yMax) * chartHeight;
            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeDasharray={index === 0 ? "0" : "4 5"}
                />

                <text x={padding.left - 12} y={y + 4} textAnchor="end" fontSize="12" fill="var(--color-foreground-muted)">
                  {formatNumber(Math.round(tick), locale)}
                </text>
              </g>
            );
          })}

          {points.length > 1 && <path d={areaPath} fill="url(#visitors-area-gradient)" />}
          {points.length > 1 && (
            <path d={linePath} fill="none" stroke="var(--color-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          )}

          {points.map((point) => (
            <g key={point.item.date} className="group">
              <title>
                {formatDate(point.item.date, locale, { year: "numeric" })}:{" "}
                {formatNumber(point.item.visitors, locale)} {visitorsLabel}, {formatNumber(point.item.pageViews, locale)} {pageViewsLabel}
              </title>

              <circle cx={point.x} cy={point.y} r="10" fill="transparent" />
              <circle cx={point.x} cy={point.y} r="4" fill="var(--color-success)" stroke="var(--color-surface)" strokeWidth="2" className="transition-all group-hover:fill-[var(--color-primary)]" />
            </g>
          ))}

          {points.map((point, index) =>
            labelIndexes.has(index) ? (
              <text key={point.item.date} x={point.x} y={height - 12} textAnchor="middle" fontSize="12" fill="var(--color-foreground-muted)">
                {formatDate(point.item.date, locale)}
              </text>
            ) : null
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-[var(--color-border)] pt-3">
        <p className="text-xs text-[var(--color-foreground-muted)]">{COPY[locale].verticalAxis}</p>
        <p className="text-xs text-[var(--color-foreground-muted)]">{COPY[locale].horizontalAxis}</p>
      </div>

      {items.length > 0 && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-success-soft)] px-3 py-2 text-xs font-medium text-[var(--color-success)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
            {COPY[locale].dailyTotal}: {formatNumber(items.reduce((total, item) => total + item.visitors, 0), locale)}
          </span>

          <p className="mt-2 text-xs text-[var(--color-foreground-muted)]">{COPY[locale].dailyNote}</p>
        </div>
      )}
    </div>
  );
}

function TrafficSourceRow({
  source,
  maxSessions,
  locale,
}: {
  source: TrafficSource;
  maxSessions: number;
  locale: DashboardLocale;
}) {
  const percentage = maxSessions > 0 ? (source.sessions / maxSessions) * 100 : 0;

  const visitorsLabel = locale === "ar" ? "زوار" : "visitors";
  const topSourceLabel = locale === "ar" ? "% من المصدر الأعلى" : "% of top source";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-[var(--color-foreground)]">{source.source}</span>
        <span className="shrink-0 text-sm font-semibold text-[var(--color-foreground)]">{formatNumber(source.sessions, locale)}</span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--color-background-soft)]">
        <div className="h-full rounded-full bg-[var(--color-success)] transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>

      <div className="flex justify-between gap-3 text-xs text-[var(--color-foreground-muted)]">
        <span>{formatNumber(source.visitors, locale)} {visitorsLabel}</span>
        <span>{percentage.toFixed(0)}{topSourceLabel}</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>("30daysAgo");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [locale, setLocale] = useState<DashboardLocale>("en");
  const [theme, setTheme] = useState<DashboardTheme>("light");

  const applySettings = useCallback((nextLocale: DashboardLocale, nextTheme: DashboardTheme) => {
    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("admin-dashboard-locale", nextLocale);
    localStorage.setItem("admin-dashboard-theme", nextTheme);
  }, []);

  const broadcastSettings = useCallback((nextLocale: DashboardLocale, nextTheme: DashboardTheme) => {
    applySettings(nextLocale, nextTheme);
    window.dispatchEvent(new CustomEvent("admin-dashboard-settings", { detail: { locale: nextLocale, theme: nextTheme } }));
  }, [applySettings]);

  useEffect(() => {
    const syncSettings = (event: Event) => {
      const detail = (event as CustomEvent).detail as { locale?: DashboardLocale; theme?: DashboardTheme } | undefined;
      const savedLocale = detail?.locale === "ar" ? "ar" : "en";
      const savedTheme = detail?.theme === "dark" ? "dark" : "light";
      setLocale(savedLocale);
      setTheme(savedTheme);
      applySettings(savedLocale, savedTheme);
    };

    const savedLocale = (localStorage.getItem("admin-dashboard-locale") as DashboardLocale | null) ?? "en";
    const savedTheme = (localStorage.getItem("admin-dashboard-theme") as DashboardTheme | null) ?? "light";
    const nextLocale = savedLocale === "ar" ? "ar" : "en";
    const nextTheme = savedTheme === "dark" ? "dark" : "light";

    setLocale(nextLocale);
    setTheme(nextTheme);
    applySettings(nextLocale, nextTheme);
    window.addEventListener("admin-dashboard-settings", syncSettings);

    return () => window.removeEventListener("admin-dashboard-settings", syncSettings);
  }, [applySettings]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ startDate: period, endDate: "today" });
      const response = await fetch(`/api/admin/analytics?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(locale === "ar" ? "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى." : "Your session has expired. Please sign in again.");
        }
        throw new Error(locale === "ar" ? "تعذّر تحميل بيانات التحليلات. يرجى المحاولة مرة أخرى." : "Unable to load analytics data. Please try again.");
      }

      const result: AnalyticsData = await response.json();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : locale === "ar" ? "حدث خطأ أثناء تحميل التحليلات." : "Something went wrong while loading analytics.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [locale, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const maxSessions = Math.max(...(data?.trafficSources.map((item) => item.sessions) ?? [0]), 1);
  const copy = COPY[locale];
  const isRtl = locale === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="mx-auto min-w-0 w-full max-w-[1600px] space-y-8 pb-10">
      <header className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-success)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
              {copy.badge}
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
              {copy.pageTitle}
            </h1>

            <p className="mt-1 text-sm text-[var(--color-foreground-muted)]">{copy.pageDescription}</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <div className="inline-flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background-soft)] p-1">
              <button
                type="button"
                onClick={() => broadcastSettings("en", theme)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${locale === "en" ? "bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm" : "text-[var(--color-foreground-muted)]"}`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => broadcastSettings("ar", theme)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${locale === "ar" ? "bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm" : "text-[var(--color-foreground-muted)]"}`}
                aria-label="التبديل إلى العربية"
              >
                AR
              </button>
            </div>

            <button
              type="button"
              onClick={() => broadcastSettings(locale, theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-background-soft)] px-3 py-2 text-xs font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-surface)]"
              aria-label={theme === "dark" ? "Switch to light mode" : "التبديل إلى الوضع الداكن"}
            >
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
              {theme === "dark" ? (locale === "ar" ? "فاتح" : "Light") : (locale === "ar" ? "داكن" : "Dark")}
            </button>

            <div className="relative">
              <Icon name="calendar" className={`pointer-events-none absolute ${isRtl ? "right-3" : "left-3"} top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-foreground-muted)]`} />
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value as Period)}
                disabled={loading}
                aria-label={copy.periodLabel}
                className={`h-10 appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2 ${isRtl ? "pr-9 pl-8" : "pl-9 pr-8"} text-sm font-medium text-[var(--color-foreground)] outline-none transition hover:border-[var(--color-border-dark)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-soft)] disabled:opacity-50`}
              >
                {PERIODS[locale].map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-border-dark)] hover:bg-[var(--color-background-soft)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="refresh" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {copy.refresh}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div role="alert" className="flex flex-col justify-between gap-3 rounded-2xl border border-[var(--color-error)]/35 bg-[var(--color-error-soft)] p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-[var(--color-error)]">{copy.errorTitle}</p>
            <p className="mt-1 text-sm text-[var(--color-error)]/80">{error}</p>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            className="w-fit rounded-lg bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-error)] transition hover:bg-[var(--color-background-soft)]"
          >
            {copy.retry}
          </button>
        </div>
      )}

      <section>
        <SectionHeader title={copy.keyMetrics} description={copy.keyMetricsDescription} />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title={copy.activeUsers} value={formatNumber(data?.overview.activeUsers ?? 0, locale)} description={copy.activeUsersDesc} icon="users" loading={loading} />
          <StatCard title={copy.pageViews} value={formatNumber(data?.overview.pageViews ?? 0, locale)} description={copy.pageViewsDesc} icon="eye" loading={loading} />
          <StatCard title={copy.sessions} value={formatNumber(data?.overview.sessions ?? 0, locale)} description={copy.sessionsDesc} icon="sessions" loading={loading} />
          <StatCard title={copy.engagement} value={`${((data?.overview.engagementRate ?? 0) * 100).toFixed(1)}%`} description={copy.engagementDesc} icon="engagement" loading={loading} />
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeader title={copy.visitorActivity} description={copy.visitorActivityDesc} />

          <div className="flex items-center gap-2 rounded-xl bg-[var(--color-success-soft)] px-3 py-2 text-xs font-medium text-[var(--color-success)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
            {copy.activeVisitors}
          </div>
        </div>

        <div className="mt-7">
          {loading ? (
            <EmptyState message={copy.loadingVisitors} />
          ) : data?.dailyVisitors.length ? (
            <VisitorsChart items={data.dailyVisitors} locale={locale} />
          ) : (
            <EmptyState message={copy.noVisitors} />
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--color-border)] p-5 sm:p-6">
            <SectionHeader
              title={copy.topPages}
              description={copy.topPagesDesc}
              action={<span className="rounded-lg bg-[var(--color-background-soft)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-foreground-muted)]">{copy.topPagesBadge}</span>}
            />
          </div>

          {loading ? (
            <EmptyState message={copy.loadingPages} />
          ) : data?.topPages.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir={isRtl ? "rtl" : "ltr"}>
                <thead className="bg-[var(--color-background-soft)] text-xs text-[var(--color-foreground-muted)]">
                  <tr>
                    <th className="w-12 px-5 py-3 font-medium">#</th>
                    <th className="px-3 py-3 text-start font-medium">{copy.pageTable}</th>
                    <th className="px-3 py-3 text-end font-medium">{copy.views}</th>
                    <th className="px-5 py-3 text-end font-medium">{copy.visitors}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[var(--color-border)]">
                  {data.topPages.map((page, index) => (
                    <tr key={page.page} className="transition-colors hover:bg-[var(--color-background-soft)]">
                      <td className="px-5 py-4 text-xs font-medium text-[var(--color-foreground-muted)]">{String(index + 1).padStart(2, "0")}</td>
                      <td className="max-w-52 px-3 py-4">
                        <p className="truncate font-medium text-[var(--color-foreground)]" title={page.page}>{page.page}</p>
                      </td>
                      <td className="px-3 py-4 text-end font-semibold text-[var(--color-foreground)]">{formatNumber(page.pageViews, locale)}</td>
                      <td className="px-5 py-4 text-end text-[var(--color-foreground-muted)]">{formatNumber(page.visitors, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message={copy.noPages} />
          )}
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--color-border)] p-5 sm:p-6">
            <SectionHeader title={copy.trafficSources} description={copy.trafficSourcesDesc} />
          </div>

          {loading ? (
            <EmptyState message={copy.loadingTraffic} />
          ) : data?.trafficSources.length ? (
            <div className="space-y-6 p-5 sm:p-6">
              {data.trafficSources.map((source) => (
                <TrafficSourceRow key={source.source} source={source} maxSessions={maxSessions} locale={locale} />
              ))}
            </div>
          ) : (
            <EmptyState message={copy.noTraffic} />
          )}
        </section>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5">
        <div className="flex items-center gap-2 text-xs text-[var(--color-foreground-muted)]">
          <Icon name="globe" className="h-4 w-4" />
          {copy.dataSource}
        </div>

        {lastUpdated && (
          <p className="text-xs text-[var(--color-foreground-muted)]">
            {copy.lastUpdated}: {lastUpdated.toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
      </footer>
    </div>
  );
}
