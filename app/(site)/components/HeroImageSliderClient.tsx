"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { HeroSlideSetting } from "@/lib/site-settings";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HeroImageSliderClient({
  slides,
  hotline,
}: {
  slides: HeroSlideSetting[];
  hotline: string;
}) {
  return (
    <section className="relative h-[78vh] min-h-[480px] w-full overflow-hidden sm:h-[88vh] sm:min-h-[560px]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop
        autoplay={{ delay: 6500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="heroFade h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={`${slide.image}-${slide.title}`}>
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 scale-[1.04] bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />
              <div className="absolute inset-0 bg-black/10" />
              <div className="pointer-events-none absolute -left-20 top-20 h-52 w-52 rounded-full bg-orange-500/20 blur-3xl" />
              <div className="pointer-events-none absolute bottom-14 right-16 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

              <div className="relative z-10 flex h-full items-center">
                <div className="lx-container">
                  <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-3xl text-white"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.65, delay: 0.08 }}
                      className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.32em] text-orange-400 backdrop-blur-sm"
                    >
                      {slide.kicker}
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.12 }}
                      className="mt-5 text-3xl font-extrabold leading-[1.15] md:text-5xl"
                    >
                      {slide.title}
                    </motion.h1>

                    {slide.desc ? (
                      <motion.p
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.18 }}
                        className="mt-4 max-w-2xl text-base leading-7 text-white/80 md:text-lg"
                      >
                        {slide.desc}
                      </motion.p>
                    ) : null}

                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.24 }}
                      className="mt-7 flex flex-wrap gap-3"
                    >
                      <Link
                        href={slide.ctaHref}
                        className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black shadow-[0_12px_35px_rgba(249,115,22,0.28)] transition hover:-translate-y-0.5 hover:bg-orange-400"
                      >
                        {slide.ctaLabel}
                      </Link>

                      <a
                        href={`tel:${hotline.replace(/\s+/g, "")}`}
                        className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                      >
                        Hotline: {hotline}
                      </a>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
