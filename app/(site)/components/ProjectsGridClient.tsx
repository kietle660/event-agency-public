"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import type { Project } from "@/lib/content-types";
import type { SiteLocale } from "@/lib/site-locale";

function ProjectGallery({ title, images, locale }: { title: string; images: string[]; locale: SiteLocale }) {
  const autoplay = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);
  const isEnglish = locale === "en";

  const prev = () => emblaApi?.scrollPrev();
  const next = () => emblaApi?.scrollNext();
  const safeImages = images?.length ? images : [];

  return (
    <div className="mt-5">
      <div className="relative">
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-2xl border border-black/10 bg-black/5"
        >
          <div className="flex">
            {safeImages.map((src, index) => (
              <div key={index} className="shrink-0 basis-full">
                <div className="relative h-[240px] sm:h-[260px] lg:h-[300px]">
                  <Image
                    src={src}
                    alt={`${title} ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-black/15 bg-white/85 text-black shadow-sm hover:bg-white"
              aria-label={isEnglish ? "Previous image" : "Ảnh trước"}
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full border border-black/15 bg-white/85 text-black shadow-sm hover:bg-white"
              aria-label={isEnglish ? "Next image" : "Ảnh tiếp theo"}
            >
              →
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <p className="mt-2 text-[11px] text-black/45">
          {isEnglish ? "Swipe to view more images" : "Kéo ngang để xem thêm ảnh"}
        </p>
      )}
    </div>
  );
}

export default function ProjectsGridClient({
  projects,
  locale,
}: {
  projects: Project[];
  locale: SiteLocale;
}) {
  const isEnglish = locale === "en";

  return (
    <section className="pb-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={index}
              className="rounded-3xl border border-black/15 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">{project.title}</h3>
                  <p className="mt-1 text-sm text-black/70">
                    {project.client} • {project.location} • {project.date}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black/70">{project.desc}</p>
                </div>

                <Link
                  href={project.href}
                  className="shrink-0 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-black/5"
                >
                  {isEnglish ? "View more" : "Xem thêm"}
                </Link>
              </div>

              <ProjectGallery
                locale={locale}
                title={project.title}
                images={project.gallery ?? [project.image]}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
