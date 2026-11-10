
import "server-only";

import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ?.replace(/^["']|["']$/g, "")
  .replace(/\\n/g, "\n")
  .trim();

function getAnalyticsClient() {
  if (!propertyId || !clientEmail || !privateKey) {
    throw new Error(
      "Google Analytics environment variables are not configured."
    );
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });
}

/**
 * Safely reads a metric value from a GA4 report row.
 * metricValues can be null according to the Google Analytics types.
 */
function getMetricValue(
  row:
    | {
        metricValues?: { value?: string | null }[] | null;
      }
    | undefined,
  index = 0
): number {
  return Number(row?.metricValues?.[index]?.value ?? 0);
}

/**
 * Converts GA4 date format (YYYYMMDD) to YYYY-MM-DD.
 */
function formatAnalyticsDate(date: string): string {
  if (date.length !== 8) return date;

  return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
}

/**
 * Returns the main website analytics metrics.
 */
async function getAnalyticsOverview(
  startDate: string,
  endDate: string
) {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    metrics: [
      { name: "activeUsers" },
      { name: "screenPageViews" },
      { name: "sessions" },
      { name: "engagementRate" },
    ],
  });

  const row = response.rows?.[0];

  return {
    activeUsers: getMetricValue(row, 0),
    pageViews: getMetricValue(row, 1),
    sessions: getMetricValue(row, 2),
    engagementRate: getMetricValue(row, 3),
  };
}

/**
 * Returns daily visitor activity.
 */
async function getDailyVisitors(
  startDate: string,
  endDate: string
) {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "activeUsers" },
      { name: "screenPageViews" },
    ],
    orderBys: [
      {
        dimension: {
          dimensionName: "date",
        },
      },
    ],
  });

  return (response.rows ?? []).map((row) => ({
    date: formatAnalyticsDate(
      row.dimensionValues?.[0]?.value ?? ""
    ),
    visitors: getMetricValue(row, 0),
    pageViews: getMetricValue(row, 1),
  }));
}

/**
 * Returns the most visited website pages.
 */
async function getTopPages(
  startDate: string,
  endDate: string
) {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
    ],
    orderBys: [
      {
        metric: {
          metricName: "screenPageViews",
        },
        desc: true,
      },
    ],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => ({
    page: row.dimensionValues?.[0]?.value ?? "/",
    pageViews: getMetricValue(row, 0),
    visitors: getMetricValue(row, 1),
  }));
}

/**
 * Returns website traffic sources.
 */
async function getTrafficSources(
  startDate: string,
  endDate: string
) {
  const client = getAnalyticsClient();

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: "sessionDefaultChannelGroup",
      },
    ],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
    ],
    orderBys: [
      {
        metric: {
          metricName: "sessions",
        },
        desc: true,
      },
    ],
    limit: 10,
  });

  return (response.rows ?? []).map((row) => ({
    source: row.dimensionValues?.[0]?.value ?? "Unknown",
    sessions: getMetricValue(row, 0),
    visitors: getMetricValue(row, 1),
  }));
}

/**
 * Fetches all website analytics data.
 */
export async function getWebsiteAnalytics(
  startDate: string,
  endDate: string
) {
  const [
    overview,
    dailyVisitors,
    topPages,
    trafficSources,
  ] = await Promise.all([
    getAnalyticsOverview(startDate, endDate),
    getDailyVisitors(startDate, endDate),
    getTopPages(startDate, endDate),
    getTrafficSources(startDate, endDate),
  ]);

  return {
    overview,
    dailyVisitors,
    topPages,
    trafficSources,
    dateRange: {
      startDate,
      endDate,
    },
  };
}
