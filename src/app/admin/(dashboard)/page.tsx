
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

const PERIODS: { label: string; value: Period }[] = [
  { label: "Last 7 days", value: "7daysAgo" },
  { label: "Last 30 days", value: "30daysAgo" },
  { label: "Last 90 days", value: "90daysAgo" },
];

const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDate(
  date: string,
  options?: Intl.DateTimeFormatOptions
) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
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
    users: "bg-blue-50 text-blue-600",
    eye: "bg-violet-50 text-violet-600",
    sessions: "bg-amber-50 text-amber-600",
    engagement: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="group rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
            {loading ? (
              <span className="inline-block h-9 w-24 animate-pulse rounded-md bg-gray-100" />
            ) : (
              value
            )}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyles[icon]}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">{description}</p>
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
        <h2 className="text-base font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      {action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        <Icon name="chart" className="h-6 w-6" />
      </div>

      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

function VisitorsChart({ items }: { items: DailyVisitor[] }) {
  const width = 900;
  const height = 320;

  const padding = {
    top: 25,
    right: 25,
    bottom: 48,
    left: 65,
  };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(
    ...items.map((item) => item.visitors),
    1
  );

  const magnitude = Math.pow(
    10,
    Math.floor(Math.log10(maxValue))
  );

  const step = Math.max(
    1,
    Math.ceil(maxValue / magnitude / 5) * magnitude / 5
  );

  const yMax = Math.ceil(maxValue / step) * step || 1;

  const yTicks = Array.from(
    { length: 6 },
    (_, index) => (yMax / 5) * index
  );

  const points = items.map((item, index) => {
    const x =
      padding.left +
      (items.length <= 1
        ? chartWidth / 2
        : (index / (items.length - 1)) * chartWidth);

    const y =
      padding.top +
      chartHeight -
      (item.visitors / yMax) * chartHeight;

    return { x, y, item };
  });

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";

  const labelCount = Math.min(6, items.length);

  const labelIndexes = new Set(
    Array.from({ length: labelCount }, (_, index) =>
      Math.round(
        (index * (items.length - 1)) / (labelCount - 1 || 1)
      )
    )
  );

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
            <linearGradient
              id="visitors-area-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#10b981"
                stopOpacity="0.20"
              />
              <stop
                offset="100%"
                stopColor="#10b981"
                stopOpacity="0.01"
              />
            </linearGradient>
          </defs>

          {/* Y Axis and Grid */}
          {yTicks.map((tick, index) => {
            const y =
              padding.top +
              chartHeight -
              (tick / yMax) * chartHeight;

            return (
              <g key={index}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray={index === 0 ? "0" : "4 5"}
                />

                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#9ca3af"
                >
                  {formatNumber(Math.round(tick))}
                </text>
              </g>
            );
          })}

          {/* Chart Area */}
          {points.length > 1 && (
            <path
              d={areaPath}
              fill="url(#visitors-area-gradient)"
            />
          )}

          {/* Chart Line */}
          {points.length > 1 && (
            <path
              d={linePath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((point) => (
            <g key={point.item.date} className="group">
              <title>
                {formatDate(point.item.date, {
                  year: "numeric",
                })}
                : {formatNumber(point.item.visitors)} visitors,{" "}
                {formatNumber(point.item.pageViews)} page views
              </title>

              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill="transparent"
              />

              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
                className="transition-all group-hover:fill-emerald-700"
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((point, index) =>
            labelIndexes.has(index) ? (
              <text
                key={point.item.date}
                x={point.x}
                y={height - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#9ca3af"
              >
                {formatDate(point.item.date)}
              </text>
            ) : null
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-400">
          Vertical axis: Active visitors
        </p>

        <p className="text-xs text-gray-400">
          Horizontal axis: Date
        </p>
      </div>

      {items.length > 0 && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Daily visitors total:{" "}
            {formatNumber(
              items.reduce(
                (total, item) => total + item.visitors,
                0
              )
            )}
          </span>

          <p className="mt-2 text-xs text-gray-400">
            Daily visitor counts are summed and may include the same
            visitor on multiple days.
          </p>
        </div>
      )}
    </div>
  );
}

function TrafficSourceRow({
  source,
  maxSessions,
}: {
  source: TrafficSource;
  maxSessions: number;
}) {
  const percentage =
    maxSessions > 0
      ? (source.sessions / maxSessions) * 100
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-gray-700">
          {source.source}
        </span>

        <span className="shrink-0 text-sm font-semibold text-gray-900">
          {formatNumber(source.sessions)}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatNumber(source.visitors)} visitors</span>
        <span>{percentage.toFixed(0)}% of top source</span>
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

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        startDate: period,
        endDate: "today",
      });

      const response = await fetch(
        `/api/admin/analytics?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (
          response.status === 401 ||
          response.status === 403
        ) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        throw new Error(
          "Unable to load analytics data. Please try again."
        );
      }

      const result: AnalyticsData = await response.json();

      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading analytics."
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const maxSessions = Math.max(
    ...(data?.trafficSources.map(
      (item) => item.sessions
    ) ?? [0]),
    1
  );

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 pb-10">

      {/* Page Header */}
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            WEBSITE ANALYTICS
          </div>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your website performance and visitor activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Icon
              name="calendar"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />

            <select
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value as Period)
              }
              disabled={loading}
              aria-label="Select analytics period"
              className="h-10 appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-8 text-sm font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
            >
              {PERIODS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon
              name="refresh"
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-sm font-semibold text-red-800">
              Analytics could not be loaded
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchAnalytics}
            className="w-fit rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-200"
          >
            Try again
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <section>
        <SectionHeader
          title="Key Metrics"
          description="A summary of your website activity during the selected period."
        />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Active Users"
            value={formatNumber(
              data?.overview.activeUsers ?? 0
            )}
            description="Unique active visitors"
            icon="users"
            loading={loading}
          />

          <StatCard
            title="Page Views"
            value={formatNumber(
              data?.overview.pageViews ?? 0
            )}
            description="Total pages viewed"
            icon="eye"
            loading={loading}
          />

          <StatCard
            title="Sessions"
            value={formatNumber(
              data?.overview.sessions ?? 0
            )}
            description="Total website sessions"
            icon="sessions"
            loading={loading}
          />

          <StatCard
            title="Engagement Rate"
            value={`${(
              (data?.overview.engagementRate ?? 0) * 100
            ).toFixed(1)}%`}
            description="Percentage of engaged sessions"
            icon="engagement"
            loading={loading}
          />
        </div>
      </section>

      {/* Visitor Activity */}
      <section className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeader
            title="Visitor Activity"
            description="Track daily visitor trends and compare activity over time."
          />

          <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Active Visitors
          </div>
        </div>

        <div className="mt-7">
          {loading ? (
            <EmptyState message="Loading visitor activity..." />
          ) : data?.dailyVisitors.length ? (
            <VisitorsChart items={data.dailyVisitors} />
          ) : (
            <EmptyState message="No visitor data available for this period." />
          )}
        </div>
      </section>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* Top Pages */}
        <section className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <SectionHeader
              title="Top Pages"
              description="The most visited pages on your website."
              action={
                <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-500">
                  Top 10
                </span>
              }
            />
          </div>

          {loading ? (
            <EmptyState message="Loading pages..." />
          ) : data?.topPages.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-xs text-gray-500">
                  <tr>
                    <th className="w-12 px-5 py-3 font-medium">
                      #
                    </th>

                    <th className="px-3 py-3 font-medium">
                      Page
                    </th>

                    <th className="px-3 py-3 text-right font-medium">
                      Views
                    </th>

                    <th className="px-5 py-3 text-right font-medium">
                      Visitors
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {data.topPages.map((page, index) => (
                    <tr
                      key={page.page}
                      className="transition-colors hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4 text-xs font-medium text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      <td className="max-w-52 px-3 py-4">
                        <p
                          className="truncate font-medium text-gray-700"
                          title={page.page}
                        >
                          {page.page}
                        </p>
                      </td>

                      <td className="px-3 py-4 text-right font-semibold text-gray-900">
                        {formatNumber(page.pageViews)}
                      </td>

                      <td className="px-5 py-4 text-right text-gray-500">
                        {formatNumber(page.visitors)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No page data available." />
          )}
        </section>

        {/* Traffic Sources */}
        <section className="rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <SectionHeader
              title="Traffic Sources"
              description="Where your website sessions originate."
            />
          </div>

          {loading ? (
            <EmptyState message="Loading traffic sources..." />
          ) : data?.trafficSources.length ? (
            <div className="space-y-6 p-5 sm:p-6">
              {data.trafficSources.map((source) => (
                <TrafficSourceRow
                  key={source.source}
                  source={source}
                  maxSessions={maxSessions}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="No traffic source data available." />
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Icon name="globe" className="h-4 w-4" />
          Data provided by Google Analytics 4
        </div>

        {lastUpdated && (
          <p className="text-xs text-gray-400">
            Last updated:{" "}
            {lastUpdated.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </footer>
    </div>
  );
}
