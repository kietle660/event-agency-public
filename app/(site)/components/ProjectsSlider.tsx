"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import type { SiteLocale } from "@/lib/site-locale";

type Project = {
  title: string;
  client: string;
  location: string;
  date: string;
  desc: string;
  image: string;
  href: string;
  tags?: string[];
};

export default function ProjectsSlider({
  projects,
  locale,
}: {
  projects: Project[];
  locale: SiteLocale;
}) {
  const autoplay = React.useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
    }),
  );
  const isEnglish = locale === "en";

  const [progress, setProgress] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      const total = emblaApi.scrollSnapList().length;
      const index = emblaApi.selectedScrollSnap();
      setProgress(total <= 1 ? 1 : index / (total - 1));
    };
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const scrollPrev = () => {
    autoplay.current?.reset();
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    autoplay.current?.reset();
    emblaApi?.scrollNext();
  };

  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-semibold">
              {isEnglish ? "Featured Projects" : "Dự án đã thực hiện"}
            </h2>
            <p className="mt-2 max-w-2xl text-white/70">
              {isEnglish
                ? "A selection of standout projects. Swipe to explore or use the navigation buttons."
                : "Một vài dự án tiêu biểu, kéo ngang để xem thêm hoặc bấm nút điều hướng."}
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={scrollPrev}
              className="h-11 border border-yellow-500/40 px-4 transition hover:border-yellow-400 hover:bg-yellow-500/10"
              aria-label={isEnglish ? "Previous" : "Trước"}
            >
              ←
            </button>
            <button
              onClick={scrollNext}
              className="h-11 border border-yellow-500/40 px-4 transition hover:border-yellow-400 hover:bg-yellow-500/10"
              aria-label={isEnglish ? "Next" : "Sau"}
            >
              →
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-6 flex">
            {projects.map((project, index) => (
              <div key={index} className="shrink-0 basis-[92%] pl-6 sm:basis-1/2 lg:basis-1/3">
                <article className="group relative overflow-hidden rounded-2xl border border-yellow-500/25 bg-white/[0.03]">
                  <div className="relative h-[260px] sm:h-[280px] lg:h-[300px]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 92vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-black/0" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/15 bg-black/45 px-2 py-1 text-xs">
                        {project.client}
                      </span>
                      <span className="rounded-full border border-white/15 bg-black/45 px-2 py-1 text-xs">
                        {project.location}
                      </span>
                      <span className="rounded-full border border-white/15 bg-black/45 px-2 py-1 text-xs">
                        {project.date}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-semibold leading-snug text-white">{project.title}</h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
                      {project.desc}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Link
                        href={project.href}
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-yellow-500/55 bg-yellow-500/10 px-5 transition hover:bg-yellow-500/15"
                      >
                        {isEnglish ? "View more" : "Xem thêm"}
                      </Link>

                      <div className="flex items-center gap-2">
                        {(project.tags ?? []).slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/85"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full bg-yellow-500/70 transition-[width] duration-300"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
          <button
            onClick={scrollPrev}
            className="h-11 border border-yellow-500/40 px-5 transition hover:bg-yellow-500/10"
          >
            {isEnglish ? "← Previous" : "← Trước"}
          </button>
          <button
            onClick={scrollNext}
            className="h-11 border border-yellow-500/40 px-5 transition hover:bg-yellow-500/10"
          >
            {isEnglish ? "Next →" : "Sau →"}
          </button>
        </div>
      </div>
    </section>
  );
}
