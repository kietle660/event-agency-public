import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { localizeProject } from "@/lib/content-localize";
import { getProjectBySlug } from "@/lib/content-store";
import { getCurrentLocale } from "@/lib/site-locale";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: locale === "en" ? "Project not found" : "Dự án không tồn tại",
    };
  }

  const localizedProject = localizeProject(project, locale);

  return {
    title: localizedProject.title,
    description:
      locale === "en"
        ? `${localizedProject.desc} Client: ${localizedProject.client}. Location: ${localizedProject.location}.`
        : `${localizedProject.desc} Khách hàng: ${localizedProject.client}. Địa điểm: ${localizedProject.location}.`,
    keywords: [
      localizedProject.title,
      localizedProject.client,
      localizedProject.location,
      ...(localizedProject.tags || []),
      ...(locale === "en"
        ? ["event project", "event production"]
        : ["dự án sự kiện", "tổ chức sự kiện"]),
    ],
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title: localizedProject.title,
      description: localizedProject.desc,
      type: "article",
      url: `/projects/${slug}`,
      images: [{ url: localizedProject.image, alt: localizedProject.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: localizedProject.title,
      description: localizedProject.desc,
      images: [localizedProject.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const project = await getProjectBySlug(slug);

  if (!project) return notFound();

  const localizedProject = localizeProject(project, locale);
  const isEnglish = locale === "en";
  const images = localizedProject.gallery.length ? localizedProject.gallery : [localizedProject.image];

  return (
    <main className="bg-white">
      <section className="pb-10 pt-[110px] md:pt-[140px]">
        <div className="container mx-auto px-6">
          <p className="text-xs font-semibold tracking-[0.22em] text-black/60">
            PROJECT • CASE DETAIL
          </p>

          <h1 className="mt-3 text-2xl font-semibold leading-tight text-black md:text-4xl">
            {localizedProject.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-2 text-sm text-black/70">
            <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1">
              {localizedProject.client}
            </span>
            <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1">
              {localizedProject.location}
            </span>
            <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1">
              {localizedProject.date}
            </span>
          </div>

          <p className="mt-4 max-w-3xl leading-relaxed text-black/70">{localizedProject.desc}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black hover:bg-orange-500/90"
            >
              {isEnglish ? "Get a Quote" : "Nhận báo giá"}
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-sm font-semibold text-black hover:bg-black/5"
            >
              {isEnglish ? "← Back to projects" : "← Quay lại dự án"}
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-10">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 md:grid-cols-2">
            {images.map((src, i) => (
              <div key={src + i} className="relative overflow-hidden rounded-3xl border border-black/10 bg-black/5">
                <div className="relative h-[260px] sm:h-[320px] lg:h-[380px]">
                  <Image
                    src={src}
                    alt={`${localizedProject.title} ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:p-8 lg:col-span-2">
              <h2 className="text-xl font-semibold text-black md:text-2xl">
                {isEnglish ? "Project Information" : "Thông tin dự án"}
              </h2>

              <div className="mt-4 space-y-3 text-[15px] leading-7 text-black/70">
                <p>
                  <span className="font-semibold text-black">
                    {isEnglish ? "Client:" : "Khách hàng:"}
                  </span>{" "}
                  {localizedProject.client}
                </p>
                <p>
                  <span className="font-semibold text-black">
                    {isEnglish ? "Location:" : "Địa điểm:"}
                  </span>{" "}
                  {localizedProject.location}
                </p>
                <p>
                  <span className="font-semibold text-black">
                    {isEnglish ? "Time:" : "Thời gian:"}
                  </span>{" "}
                  {localizedProject.date}
                </p>
                <p>
                  <span className="font-semibold text-black">
                    {isEnglish ? "Description:" : "Mô tả:"}
                  </span>{" "}
                  {localizedProject.desc}
                </p>
              </div>

              {!!localizedProject.tags?.length && (
                <>
                  <div className="mt-6 h-px w-full bg-black/10" />
                  <div className="mt-5 flex flex-wrap gap-2">
                    {localizedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-semibold text-black/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-3xl border border-black/10 bg-neutral-50 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-black">
                {isEnglish ? "Planning a similar event?" : "Bạn muốn tổ chức sự kiện tương tự?"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/70">
                {isEnglish
                  ? "Send your brief and we will respond within 24 hours with concept ideas, execution scope, and a suitable quotation."
                  : "Gửi brief nhanh, chúng tôi phản hồi trong 24h với concept, hạng mục triển khai và báo giá phù hợp."}
              </p>

              <Link
                href="/contact"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-black hover:bg-orange-500/90"
              >
                {isEnglish ? "Send Brief / Get a Quote" : "Gửi brief / Nhận báo giá"}
              </Link>

              <Link
                href="/services"
                className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-black hover:bg-black/5"
              >
                {isEnglish ? "View Services" : "Xem dịch vụ"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
