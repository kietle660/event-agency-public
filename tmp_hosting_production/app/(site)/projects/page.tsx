import type { Metadata } from "next";
import Link from "next/link";

import { localizeProject } from "@/lib/content-localize";
import { getProjects } from "@/lib/content-store";
import { getCurrentLocale } from "@/lib/site-locale";

import ProjectsGridClient from "../components/ProjectsGridClient";

export const metadata: Metadata = {
  title: "Dự án tiêu biểu",
  description:
    "Danh sách các dự án TRỌNG THÁI EVENT đã triển khai cho hội nghị, khai trương, tiệc cưới và sự kiện doanh nghiệp.",
  alternates: {
    canonical: "/projects",
  },
};

export default async function ProjectsPage() {
  const locale = await getCurrentLocale();
  const projects = await getProjects();
  const isEnglish = locale === "en";

  return (
    <main className="bg-white">
      <section className="pb-10 pt-[110px] md:pt-[140px]">
        <div className="container mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.22em] text-black/60">
            PORTFOLIO • CASE STUDY
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-black md:text-5xl">
                {isEnglish ? "Selected Projects" : "Những dự án đã thực hiện"}
              </h1>
              <p className="mt-3 max-w-2xl leading-relaxed text-black/70">
                {isEnglish
                  ? "Explore project highlights and swipe through image galleries in each case."
                  : "Xem nhanh nội dung và kéo slider ảnh ngay trong từng dự án."}
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-sm font-semibold text-black hover:bg-black/5"
            >
              {isEnglish ? "Get a Quote" : "Nhận báo giá"}
            </Link>
          </div>
        </div>
      </section>

      <ProjectsGridClient
        locale={locale}
        projects={projects.map((project) => localizeProject(project, locale))}
      />
    </main>
  );
}
