import Image from "next/image";
import Link from "next/link";

import type { SiteLocale } from "@/lib/site-locale";

import Reveal from "./Reveal";

const projects = [
  {
    title: "Lễ ra mắt thương hiệu",
    titleEn: "Brand Launch Event",
    brand: "Doanh nghiệp A",
    brandEn: "Business A",
    image: "/projects/sukienaction/1.jpg",
  },
  {
    title: "Year End Party 2024",
    titleEn: "Year End Party 2024",
    brand: "Tập đoàn B",
    brandEn: "Corporation B",
    image: "/projects/tieccuoi122024/1.jpg",
  },
  {
    title: "Hội nghị khách hàng",
    titleEn: "Customer Conference",
    brand: "Ngân hàng C",
    brandEn: "Bank C",
    image: "/projects/VIECOMBANK2024/1.jpg",
  },
];

export default function HomeProjects({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";

  return (
    <section className="relative bg-gradient-to-b from-[#ffffff] via-[#f7f5f1] to-[#f2efe9] py-16 md:py-20">
      <div className="lx-container">
        <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold tracking-[0.28em] text-zinc-600">
              {isEnglish ? "FEATURED PROJECTS" : "DỰ ÁN TIÊU BIỂU"}
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-zinc-900 md:text-4xl">
              {isEnglish ? "Completed Projects" : "Những dự án đã thực hiện"}
            </h2>
          </div>

          <Link
            href="/projects"
            className="rounded-full border border-black/15 bg-black/[0.02] px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-black/[0.05]"
          >
            {isEnglish ? "View all projects" : "Xem tất cả dự án"}
          </Link>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.title} delay={index * 0.08}>
              <Link
                href="/projects"
                className="group relative block min-h-[320px] overflow-hidden rounded-3xl border-[2px] border-[#d6b46a]/80 bg-black shadow-[0_22px_60px_rgba(0,0,0,0.25)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_rgba(0,0,0,0.28)] sm:min-h-[360px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,211,138,0.18),transparent_35%)] opacity-0 transition duration-500 group-hover:opacity-100" />
                <Image
                  src={project.image}
                  alt={isEnglish ? project.titleEn : project.title}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

                <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10">
                  <div className="inline-flex rounded-full border border-[#d6b46a]/40 bg-black/50 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#f2d38a]">
                    CASE STUDY
                  </div>

                  <h3 className="mt-2 text-base font-extrabold uppercase tracking-wide text-[#f2d38a]">
                    {isEnglish ? project.titleEn : project.title}
                  </h3>

                  <p className="mt-1 text-sm text-white/85">
                    {isEnglish ? project.brandEn : project.brand}
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-[#f2d38a]/0 transition-all duration-500 group-hover:ring-[#f2d38a]/35" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
