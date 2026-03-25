"use client";

import React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import type { SiteLocale } from "@/lib/site-locale";
import type { TestimonialSetting } from "@/lib/site-settings";

export default function TestimonialsSectionClient({
  testimonials,
  locale,
}: {
  testimonials: TestimonialSetting[];
  locale: SiteLocale;
}) {
  const autoplay = React.useRef(
    Autoplay({
      delay: 5200,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  const isEnglish = locale === "en";

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);
  const [selected, setSelected] = React.useState(0);
  const [snaps, setSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">
              {isEnglish ? "What clients say about us" : "Khách hàng nói gì về chúng tôi"}
            </h2>
            <p className="mt-2 max-w-2xl text-white/70">
              {isEnglish
                ? "Real feedback from clients who have worked with our team."
                : "Cảm nhận thực tế từ những khách hàng đã đồng hành cùng chúng tôi."}
            </p>
          </div>
        </div>

        <div
          ref={emblaRef}
          className="overflow-hidden"
          onTouchStart={() => autoplay.current?.stop()}
          onTouchEnd={() => autoplay.current?.play()}
        >
          <div className="-ml-6 flex">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="shrink-0 basis-[92%] pl-6 sm:basis-1/2 lg:basis-1/3">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
                  <p className="leading-relaxed text-white/85">&ldquo;{testimonial.content}&rdquo;</p>

                  <div className="mt-6 flex items-center gap-4">
                    <button
                      type="button"
                      className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20"
                      aria-label={
                        isEnglish
                          ? `View avatar ${testimonial.name}`
                          : `Xem avatar ${testimonial.name}`
                      }
                    >
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </button>

                    <div>
                      <div className="font-medium leading-tight">{testimonial.name}</div>
                      <div className="text-sm text-white/60">
                        {testimonial.role}
                        {testimonial.role && testimonial.company ? " - " : ""}
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {snaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === selected ? "bg-yellow-400" : "bg-white/20 hover:bg-white/35"
              }`}
              aria-label={
                isEnglish ? `Choose testimonial ${index + 1}` : `Chọn đánh giá ${index + 1}`
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
