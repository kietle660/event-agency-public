import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isSupabaseConfigured, supabaseInsert, supabaseSelect, supabaseUpdate } from "./supabase-rest";

const dataDir = path.join(process.cwd(), "data");
const analyticsFile = path.join(dataDir, "analytics.json");

type DailyAnalytics = {
  date: string;
  pageviews: number;
  uniqueVisitors: number;
  leads: number;
  visitorIds: string[];
};

type AnalyticsState = {
  daily: DailyAnalytics[];
};

export type AnalyticsPoint = {
  date: string;
  pageviews: number;
  leads: number;
  uniqueVisitors: number;
};

export type AnalyticsRange = {
  startDate: string;
  endDate: string;
  groupBy?: "day" | "month";
};

type AnalyticsRow = {
  date: string;
  pageviews: number;
  unique_visitors: number;
  leads: number;
  visitor_ids: string[] | null;
};

const defaultState: AnalyticsState = {
  daily: [],
};

function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function ensureAnalyticsFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(analyticsFile, "utf8");
  } catch {
    await writeFile(analyticsFile, JSON.stringify(defaultState, null, 2), "utf8");
  }
}

async function readAnalytics(): Promise<AnalyticsState> {
  await ensureAnalyticsFile();
  const raw = await readFile(analyticsFile, "utf8");
  return JSON.parse(raw) as AnalyticsState;
}

async function writeAnalytics(state: AnalyticsState) {
  await ensureAnalyticsFile();
  await writeFile(analyticsFile, JSON.stringify(state, null, 2), "utf8");
}

function rowToDaily(row: AnalyticsRow): DailyAnalytics {
  return {
    date: row.date,
    pageviews: row.pageviews,
    uniqueVisitors: row.unique_visitors,
    leads: row.leads,
    visitorIds: row.visitor_ids || [],
  };
}

function pruneDaily(daily: DailyAnalytics[]) {
  return daily
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-90);
}

async function getAllDailyAnalytics() {
  if (isSupabaseConfigured()) {
    const rows = await supabaseSelect<AnalyticsRow>("daily_analytics", {
      select: "*",
      order: "date.asc",
    });
    return pruneDaily(rows.map(rowToDaily));
  }

  const state = await readAnalytics();
  return pruneDaily(state.daily);
}

function buildRangePoints(
  daily: DailyAnalytics[],
  range: AnalyticsRange
): AnalyticsPoint[] {
  const filtered = daily.filter(
    (entry) => entry.date >= range.startDate && entry.date <= range.endDate
  );

  if (range.groupBy === "month") {
    const grouped = new Map<string, AnalyticsPoint>();

    for (const entry of filtered) {
      const monthKey = entry.date.slice(0, 7);
      const current = grouped.get(monthKey) ?? {
        date: monthKey,
        pageviews: 0,
        leads: 0,
        uniqueVisitors: 0,
      };

      current.pageviews += entry.pageviews;
      current.leads += entry.leads;
      current.uniqueVisitors += entry.uniqueVisitors;
      grouped.set(monthKey, current);
    }

    return Array.from(grouped.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  return filtered.map((entry) => ({
    date: entry.date,
    pageviews: entry.pageviews,
    leads: entry.leads,
    uniqueVisitors: entry.uniqueVisitors,
  }));
}

export async function trackPageview(visitorId: string) {
  if (isSupabaseConfigured()) {
    const today = getDateKey();
    const rows = await supabaseSelect<AnalyticsRow>("daily_analytics", {
      select: "*",
      date: `eq.${today}`,
      limit: 1,
    });

    const current = rows[0] ? rowToDaily(rows[0]) : null;

    if (!current) {
      await supabaseInsert<AnalyticsRow>("daily_analytics", {
        date: today,
        pageviews: 1,
        unique_visitors: 1,
        leads: 0,
        visitor_ids: [visitorId],
      });
      return;
    }

    const visitorIds = current.visitorIds.includes(visitorId)
      ? current.visitorIds
      : [...current.visitorIds, visitorId];

    await supabaseUpdate<AnalyticsRow>(
      "daily_analytics",
      { date: `eq.${today}` },
      {
        pageviews: current.pageviews + 1,
        unique_visitors: visitorIds.length,
        visitor_ids: visitorIds,
      }
    );
    return;
  }

  const state = await readAnalytics();
  const today = getDateKey();
  const daily = [...state.daily];
  const current = daily.find((entry) => entry.date === today);

  if (current) {
    current.pageviews += 1;
    if (!current.visitorIds.includes(visitorId)) {
      current.visitorIds.push(visitorId);
      current.uniqueVisitors += 1;
    }
  } else {
    daily.push({
      date: today,
      pageviews: 1,
      uniqueVisitors: 1,
      leads: 0,
      visitorIds: [visitorId],
    });
  }

  state.daily = pruneDaily(daily);
  await writeAnalytics(state);
}

export async function trackLeadEvent() {
  if (isSupabaseConfigured()) {
    const today = getDateKey();
    const rows = await supabaseSelect<AnalyticsRow>("daily_analytics", {
      select: "*",
      date: `eq.${today}`,
      limit: 1,
    });

    const current = rows[0] ? rowToDaily(rows[0]) : null;

    if (!current) {
      await supabaseInsert<AnalyticsRow>("daily_analytics", {
        date: today,
        pageviews: 0,
        unique_visitors: 0,
        leads: 1,
        visitor_ids: [],
      });
      return;
    }

    await supabaseUpdate<AnalyticsRow>(
      "daily_analytics",
      { date: `eq.${today}` },
      { leads: current.leads + 1 }
    );
    return;
  }

  const state = await readAnalytics();
  const today = getDateKey();
  const daily = [...state.daily];
  const current = daily.find((entry) => entry.date === today);

  if (current) {
    current.leads += 1;
  } else {
    daily.push({
      date: today,
      pageviews: 0,
      uniqueVisitors: 0,
      leads: 1,
      visitorIds: [],
    });
  }

  state.daily = pruneDaily(daily);
  await writeAnalytics(state);
}

export async function getAnalyticsSummary(days = 14) {
  const daily = await getAllDailyAnalytics();
  const chart = daily.slice(-days).map((entry) => ({
    date: entry.date,
    pageviews: entry.pageviews,
    leads: entry.leads,
    uniqueVisitors: entry.uniqueVisitors,
  }));

  const totals = daily.reduce(
    (acc, entry) => {
      acc.pageviews += entry.pageviews;
      acc.leads += entry.leads;
      acc.uniqueVisitors += entry.uniqueVisitors;
      return acc;
    },
    { pageviews: 0, leads: 0, uniqueVisitors: 0 }
  );

  return {
    totals,
    chart,
  };
}

export async function getAnalyticsRangeSummary(range: AnalyticsRange) {
  const daily = await getAllDailyAnalytics();
  const chart = buildRangePoints(daily, range);

  const totals = chart.reduce(
    (acc, entry) => {
      acc.pageviews += entry.pageviews;
      acc.leads += entry.leads;
      acc.uniqueVisitors += entry.uniqueVisitors;
      return acc;
    },
    { pageviews: 0, leads: 0, uniqueVisitors: 0 }
  );

  return { totals, chart };
}
