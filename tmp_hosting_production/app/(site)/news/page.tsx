import type { Metadata } from "next";

import { localizeNews } from "@/lib/content-localize";
import { getNews } from "@/lib/content-store";
import { getCurrentLocale } from "@/lib/site-locale";

import NewsCard from "../components/NewsCard";

export const metadata: Metadata = {
  title: "Tin tức & kiến thức sự kiện",
  description:
    "Cập nhật xu hướng tổ chức sự kiện, checklist vận hành, case study và kinh nghiệm triển khai thực tế từ TRỌNG THÁI EVENT.",
  alternates: {
    canonical: "/news",
  },
};

export default async function NewsPage() {
  const locale = await getCurrentLocale();
  const news = await getNews();
  const isEnglish = locale === "en";

  return (
    <section className="bg-neutral-50 pb-24 pt-[110px] md:pt-[140px]">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_20%_10%,rgba(250,204,21,0.18),transparent_60%),radial-gradient(60%_60%_at_90%_20%,rgba(0,0,0,0.06),transparent_55%)]" />
          <div className="relative px-7 py-10 md:px-12 md:py-14">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold tracking-[0.22em] text-black/60">
                INSIGHTS • EVENT PRODUCTION • BRAND EXPERIENCE
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
                {isEnglish ? "News & Event Knowledge" : "Tin tức & kiến thức sự kiện"}
              </h1>
              <p className="mt-4 max-w-2xl text-black/70">
                {isEnglish
                  ? "Stay updated with trends, operational checklists, case studies, and event production insights."
                  : "Cập nhật xu hướng, checklist vận hành, case study và giải pháp tổ chức sự kiện chuyên nghiệp."}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(isEnglish
                  ? ["Trends", "Checklist", "Case Study", "Stage Production"]
                  : ["Xu hướng", "Checklist", "Case study", "Kỹ thuật sân khấu"]
                ).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
        </div>

        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.slug} locale={locale} item={localizeNews(item, locale)} />
          ))}
        </div>
      </div>
    </section>
  );
}
