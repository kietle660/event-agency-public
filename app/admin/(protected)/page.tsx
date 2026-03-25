import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  ImageIcon,
  Mail,
  Newspaper,
  Settings,
  TrendingUp,
} from "lucide-react";

import { getAdminUsername } from "@/lib/admin-auth";
import { getAnalyticsRangeSummary } from "@/lib/analytics-store";
import { getNews, getProjects } from "@/lib/content-store";
import { getLeadStats } from "@/lib/lead-store";

const modules = [
  {
    title: "Quản lý dự án",
    description: "Tạo, sửa, xóa danh sách dự án, gallery, tag và slug hiển thị trên website.",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Quản lý tin tức",
    description: "Quản lý bài viết, trích đoạn, nội dung HTML và hình ảnh hiển thị trên website.",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Thư viện media",
    description: "Tải ảnh lên, quản lý file trong public/uploads và dùng lại cho các module khác.",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    title: "Khách liên hệ",
    description: "Theo dõi lead thực, số lượng khách nhắn tin và trạng thái tiếp nhận từ form liên hệ.",
    href: "/admin/contacts",
    icon: Mail,
  },
  {
    title: "Cài đặt hệ thống",
    description: "Kiểm tra env, đăng nhập admin, canonical, robots và trạng thái cấu hình chung.",
    href: "/admin/settings",
    icon: Settings,
  },
];

type DashboardSearchParams = Promise<{
  view?: string;
  day?: string;
  month?: string;
  year?: string;
  start?: string;
  end?: string;
}>;

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function getMonthRange(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    startDate: toDateKey(start),
    endDate: toDateKey(end),
  };
}

function getYearRange(yearValue: string) {
  const year = Number(yearValue);
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  return {
    startDate: toDateKey(start),
    endDate: toDateKey(end),
  };
}

function formatDateLabel(dateKey: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${dateKey}T00:00:00`));
}

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return `Th${String(month).padStart(2, "0")}/${year}`;
}

function getRangeConfig(params: Awaited<DashboardSearchParams>) {
  const now = new Date();
  const today = toDateKey(now);
  const defaultMonth = today.slice(0, 7);
  const defaultYear = String(now.getFullYear());
  const defaultStart = toDateKey(addDays(now, -29));
  const view = params.view === "day" || params.view === "year" || params.view === "custom" ? params.view : "month";

  if (view === "day") {
    const day = params.day || today;
    return {
      view,
      title: `Theo ngày ${formatDateLabel(day)}`,
      subtitle: "Dữ liệu được tổng hợp cho đúng ngày bạn chọn.",
      startDate: day,
      endDate: day,
      groupBy: "day" as const,
      selectedDay: day,
      selectedMonth: defaultMonth,
      selectedYear: defaultYear,
      selectedStart: day,
      selectedEnd: day,
    };
  }

  if (view === "year") {
    const year = params.year || defaultYear;
    const range = getYearRange(year);
    return {
      view,
      title: `Theo năm ${year}`,
      subtitle: "Biểu đồ đang gộp số liệu theo từng tháng trong năm đã chọn.",
      startDate: range.startDate,
      endDate: range.endDate,
      groupBy: "month" as const,
      selectedDay: today,
      selectedMonth: defaultMonth,
      selectedYear: year,
      selectedStart: range.startDate,
      selectedEnd: range.endDate,
    };
  }

  if (view === "custom") {
    const startDate = params.start || defaultStart;
    const endDate = params.end || today;
    return {
      view,
      title: `Tùy chọn ${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`,
      subtitle: "Bạn có thể chọn bất kỳ khoảng ngày nào để so sánh dữ liệu thực tế.",
      startDate,
      endDate,
      groupBy: "day" as const,
      selectedDay: today,
      selectedMonth: defaultMonth,
      selectedYear: defaultYear,
      selectedStart: startDate,
      selectedEnd: endDate,
    };
  }

  const month = params.month || defaultMonth;
  const range = getMonthRange(month);
  return {
    view: "month" as const,
    title: `Theo tháng ${month.slice(5)}/${month.slice(0, 4)}`,
    subtitle: "Biểu đồ đang hiển thị số liệu theo từng ngày trong tháng đã chọn.",
    startDate: range.startDate,
    endDate: range.endDate,
    groupBy: "day" as const,
    selectedDay: today,
    selectedMonth: month,
    selectedYear: defaultYear,
    selectedStart: range.startDate,
    selectedEnd: range.endDate,
  };
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams?: DashboardSearchParams;
}) {
  const params = searchParams ? await searchParams : {};
  const range = getRangeConfig(params);

  const [projects, news, leadStats, analytics] = await Promise.all([
    getProjects(),
    getNews(),
    getLeadStats({
      startDate: range.startDate,
      endDate: range.endDate,
    }),
    getAnalyticsRangeSummary({
      startDate: range.startDate,
      endDate: range.endDate,
      groupBy: range.groupBy,
    }),
  ]);

  const chartMax = Math.max(
    1,
    ...analytics.chart.map((item) => Math.max(item.pageviews, item.leads))
  );
  const latestPoint = analytics.chart.at(-1);
  const chartColumns = `repeat(${Math.max(analytics.chart.length, 1)}, minmax(42px, 1fr))`;

  const stats = [
    {
      label: "Lượt truy cập",
      value: analytics.totals.pageviews,
      hint: `Tổng pageview trong giai đoạn ${range.startDate} đến ${range.endDate}`,
    },
    {
      label: "Bài viết",
      value: news.length,
      hint: "Tổng bài viết đang public trên website",
    },
    {
      label: "Dự án",
      value: projects.length,
      hint: "Tổng dự án đang public trên website",
    },
    {
      label: "Khách nhắn tin",
      value: leadStats.total,
      hint: "Tổng lead trong khoảng thời gian đã chọn",
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_28%),linear-gradient(135deg,rgba(24,24,27,0.98),rgba(39,39,42,0.9))] p-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-yellow-400">Chào mừng quay lại</div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
              Xin chào {getAdminUsername()}, đây là bảng điều khiển tổng quan của website.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
              Dashboard đang đọc dữ liệu thật từ truy cập website, lead liên hệ, tổng bài viết và
              tổng dự án. Bạn có thể xem số liệu theo ngày, tháng, năm hoặc tự chọn khoảng thời gian.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin/projects/new"
                className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Tạo dự án mới
              </Link>
              <Link
                href="/admin/news/new"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:border-yellow-400/40 hover:bg-white/5"
              >
                Tạo bài viết mới
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <form
              className="rounded-[28px] border border-white/10 bg-black/20 p-5"
              method="get"
            >
              <div className="text-sm text-white/55">Bộ lọc thời gian</div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Kiểu xem</span>
                  <select
                    name="view"
                    defaultValue={range.view}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-400"
                  >
                    <option value="day">Theo ngày</option>
                    <option value="month">Theo tháng</option>
                    <option value="year">Theo năm</option>
                    <option value="custom">Tùy chọn</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Chọn ngày</span>
                  <input
                    type="date"
                    name="day"
                    defaultValue={range.selectedDay}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Chọn tháng</span>
                  <input
                    type="month"
                    name="month"
                    defaultValue={range.selectedMonth}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Chọn năm</span>
                  <input
                    type="number"
                    min="2020"
                    max="2100"
                    name="year"
                    defaultValue={range.selectedYear}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Từ ngày</span>
                  <input
                    type="date"
                    name="start"
                    defaultValue={range.selectedStart}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-white/65">Đến ngày</span>
                  <input
                    type="date"
                    name="end"
                    defaultValue={range.selectedEnd}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-yellow-400"
                  />
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
                >
                  Xem dữ liệu
                </button>
                <Link
                  href="/admin"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white transition hover:border-yellow-400/40"
                >
                  Đặt lại
                </Link>
              </div>
            </form>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-3 text-white">
                <TrendingUp className="h-5 w-5 text-yellow-300" />
                <div className="text-sm text-white/55">{range.title}</div>
              </div>
              <div className="mt-4 text-3xl font-semibold text-white">
                {analytics.totals.pageviews} lượt truy cập
              </div>
              <p className="mt-3 text-sm leading-6 text-white/60">
                {analytics.totals.leads} lead và {analytics.totals.uniqueVisitors} khách truy cập duy
                nhất trong giai đoạn đã chọn.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/45">{range.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">{item.label}</div>
            <div className="mt-3 text-4xl font-semibold text-yellow-400">{item.value}</div>
            <p className="mt-3 text-sm leading-6 text-white/60">{item.hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Biểu đồ theo thời gian</h2>
              <p className="mt-2 text-sm text-white/60">{range.subtitle}</p>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <div
              className="grid min-w-[520px] items-end gap-3"
              style={{ gridTemplateColumns: chartColumns }}
            >
              {analytics.chart.length ? (
                analytics.chart.map((item) => (
                  <div key={item.date} className="flex flex-col items-center gap-3">
                    <div className="flex h-56 items-end gap-2">
                      <div
                        className="w-4 rounded-t-full bg-yellow-400/90"
                        style={{ height: `${Math.max(12, (item.pageviews / chartMax) * 100)}%` }}
                        title={`${item.date}: ${item.pageviews} lượt truy cập`}
                      />
                      <div
                        className="w-4 rounded-t-full bg-sky-400/85"
                        style={{ height: `${Math.max(12, (item.leads / chartMax) * 100)}%` }}
                        title={`${item.date}: ${item.leads} khách nhắn tin`}
                      />
                    </div>
                    <div className="text-[11px] text-white/45">
                      {range.groupBy === "month"
                        ? formatMonthLabel(item.date)
                        : item.date.slice(5)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-2xl border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/55">
                  Chưa có dữ liệu trong khoảng thời gian đã chọn.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
            <div className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              Lượt truy cập
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-sky-400" />
              Khách nhắn tin
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Lead mới nhất</h2>
            <div className="mt-2 text-sm text-white/60">
              Danh sách đang lọc theo giai đoạn từ {formatDateLabel(range.startDate)} đến{" "}
              {formatDateLabel(range.endDate)}.
            </div>
            <div className="mt-5 space-y-3">
              {leadStats.recent.length ? (
                leadStats.recent.map((lead) => (
                  <div key={lead.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <div className="font-medium text-white">{lead.name}</div>
                    <div className="mt-2 text-sm text-white/55">
                      {lead.phone} • {lead.eventType}
                    </div>
                    <div className="mt-2 text-xs text-white/45">
                      {formatDateLabel(lead.createdAt.slice(0, 10))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/55">
                  Chưa có lead nào trong giai đoạn này.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Tóm tắt nhanh</h2>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-sm text-white/55">Mốc gần nhất trong biểu đồ</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {latestPoint
                    ? range.groupBy === "month"
                      ? formatMonthLabel(latestPoint.date)
                      : formatDateLabel(latestPoint.date)
                    : "Chưa có dữ liệu"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-sm text-white/55">Khách truy cập duy nhất</div>
                <div className="mt-2 text-lg font-semibold text-white">
                  {analytics.totals.uniqueVisitors} người
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Module điều khiển</h2>
            <div className="mt-5 grid gap-3">
              {modules.map((module) => {
                const Icon = module.icon;

                return (
                  <Link
                    key={module.href}
                    href={module.href}
                    className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-yellow-400/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-xl bg-yellow-400/15 p-2 text-yellow-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-white">{module.title}</div>
                        <div className="mt-1 text-sm leading-6 text-white/55">{module.description}</div>
                        <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-yellow-300">
                          Mở module
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
