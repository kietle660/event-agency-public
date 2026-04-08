"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  {
    video: "/videos/slide-1.mp4",
    title: "COSMO ENTERTAINMENT",
    text: `GIẢI PHÁP SỰ KIỆN TỐI ƯU\nỨNG DỤNG CÔNG NGHỆ\nLAN TOẢ VĂN HOÁ & GIÁ TRỊ BỀN VỮNG`,
  },
  {
    video: "/videos/slide-2.mp4",
    title: "EVENTPRO",
    text: `TỔ CHỨC SỰ KIỆN DOANH NGHIỆP\nCHUẨN KỊCH BẢN\nĐÚNG TIMELINE`,
  },
];

export default function HeroVideoSlider() {
  const videos = useRef<HTMLVideoElement[]>([]);

  const playActive = (index: number) => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === index) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  };

  useEffect(() => {
    const onBlur = () => videos.current.forEach(v => v?.pause());
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 6500 }}
        onInit={(s) => playActive(s.realIndex)}
        onSlideChange={(s) => playActive(s.realIndex)}
        className="h-full w-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              {/* VIDEO */}
              <video
                ref={(el) => {
                  if (el) videos.current[i] = el;
                }}
                src={s.video}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* OVERLAY COSMO */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
              <div className="absolute inset-0 bg-black/20" />

              {/* TEXT */}
              <div className="relative z-10 flex h-full items-center">
                <div className="lx-container">
                  <div className="max-w-3xl text-white">
                    <h2 className="text-sm tracking-[0.3em] text-orange-400">
                      {s.title}
                    </h2>

                    <h1 className="mt-4 whitespace-pre-line text-3xl font-extrabold leading-[1.2] md:text-5xl">
                      {s.text}
                    </h1>

                    <div className="mt-6 flex gap-3">
                      <a
                        href="/contact"
                        className="rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-black hover:bg-orange-400"
                      >
                        Báo giá & tư vấn miễn phí
                      </a>
                      <a
                        href="tel:0982815682"
                        className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                      >
                        Hotline: 0982 815 682
                      </a>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
