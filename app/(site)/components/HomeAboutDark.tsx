"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import type { SiteLocale } from "@/lib/site-locale";

import { useCountUp } from "@/hooks/useCountUp";

import Reveal from "./Reveal";

export default function HomeAboutDark({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-110 contrast-105"
        style={{ backgroundImage: "url('/about-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/80" />
      <div className="snow-overlay" />
      <div className="pointer-events-none absolute -left-60 top-[-320px] h-[620px] w-[620px] rotate-12 rounded-[90px] bg-gradient-to-br from-zinc-800 via-black to-zinc-900 opacity-70" />

      <div className="lx-container relative z-10">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal className="relative flex items-center justify-center md:justify-start">
            <div className="rounded-3xl p-6 sm:p-8">
              <div className="grid grid-cols-2 place-items-center gap-10 sm:gap-12">
                <StatBubble end={10} suffix="+" label={isEnglish ? "Years Experience" : "Năm kinh nghiệm"} duration={1200} />
                <StatBubble end={300} suffix="+" label={isEnglish ? "Events" : "Sự kiện"} duration={3200} />
                <StatBubble end={80} suffix="+" label={isEnglish ? "Clients" : "Khách hàng"} duration={2500} />
                <StatBubble end={35} suffix="+" label={isEnglish ? "Team Members" : "Nhân viên"} duration={1800} />
              </div>
            </div>
          </Reveal>

          <Reveal className="relative" delay={0.08}>
            <div className="rounded-3xl bg-black/70 p-6 shadow-2xl ring-1 ring-white/15 backdrop-blur-md md:p-9">
              <div className="rounded-2xl border border-white/15 p-6 md:p-8">
                <h2 className="text-xl font-extrabold tracking-wide text-white md:text-2xl">
                  {isEnglish ? "ABOUT " : "GIỚI THIỆU "}
                  <span className="text-white/90">TRỌNG THÁI EVENT</span>
                </h2>

                <div className="mt-4 text-xs font-semibold tracking-[0.28em] text-white/60">
                  {isEnglish ? "OPEN LETTER" : "THƯ NGỎ"}
                </div>

                <div className="mt-4 space-y-3 text-[15px] leading-7 text-white/90">
                  {isEnglish ? (
                    <>
                      <p>Dear partners and clients,</p>
                      <p>
                        TRỌNG THÁI EVENT is an event production and brand communication team,
                        supporting businesses from <b>concept</b>, <b>script</b>, <b>design</b>, and{" "}
                        <b>production</b> to <b>on-site execution</b>.
                      </p>
                      <p>
                        We commit to <b>clear timeline control</b>, <b>transparent budgeting</b>,
                        strong risk management, and guest experience optimization to create a
                        memorable brand impression.
                      </p>
                      <p>
                        Every project is tailored to the communication objective, brand identity,
                        and emotion each business wants to leave behind.
                      </p>
                      <p className="pt-1">
                        Sincerely,
                        <br />
                        CEO Nguyen Trong Thai.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>Kính gửi Quý đối tác và khách hàng,</p>
                      <p>
                        TRỌNG THÁI EVENT là đơn vị tổ chức sự kiện và truyền thông thương hiệu, đồng
                        hành cùng doanh nghiệp từ <b>concept</b>, <b>kịch bản</b>, <b>thiết kế</b>,{" "}
                        <b>sản xuất</b> đến <b>vận hành hiện trường</b>.
                      </p>
                      <p>
                        Chúng tôi cam kết triển khai <b>đúng timeline</b>, <b>rõ ngân sách</b>,
                        kiểm soát rủi ro và tối ưu trải nghiệm khách mời để tạo dấu ấn thương hiệu
                        một cách chỉn chu, bền vững.
                      </p>
                      <p>
                        Mỗi dự án là một lần đo ni đóng giày theo mục tiêu truyền thông, nhận diện
                        và cảm xúc mà doanh nghiệp muốn để lại.
                      </p>
                      <p className="pt-1">
                        Trân trọng,
                        <br />
                        CEO Nguyễn Trọng Thái.
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/about"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
                  >
                    {isEnglish ? "Learn more" : "Xem thêm"}
                  </Link>

                  <Link
                    href="/contact"
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {isEnglish ? "Get a Quote" : "Nhận báo giá"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-white/5 blur-2xl" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StatBubble({
  end,
  suffix = "",
  label,
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}) {
  const { ref, value } = useCountUp(end, duration);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "relative overflow-hidden",
        "h-[140px] w-[140px] min-w-[140px] shrink-0 sm:h-[156px] sm:w-[156px] sm:min-w-[156px]",
        "flex flex-col items-center justify-center rounded-full bg-white/14 text-center backdrop-blur ring-1 ring-white/40",
        "shadow-[0_18px_45px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]",
        "before:absolute before:-left-6 before:-top-6 before:h-24 before:w-24 before:rounded-full before:bg-white/25 before:blur-2xl before:content-['']",
      ].join(" ")}
    >
      <div className="text-3xl font-extrabold text-white">
        {value}
        {suffix}
      </div>

      <div className="mt-1.5 text-[13px] font-semibold tracking-wider text-white/75">
        {label}
      </div>
    </motion.div>
  );
}
