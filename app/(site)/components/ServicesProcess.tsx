import {
  FileBarChart2,
  Factory,
  HardHat,
  Lightbulb,
  MessageSquareText,
} from "lucide-react";

import type { SiteLocale } from "@/lib/site-locale";

import Reveal from "./Reveal";

const stepData = {
  vi: [
    { step: "01", title: "Tư vấn và nhận brief", desc: "Mục tiêu, đối tượng, ngân sách và timeline.", icon: MessageSquareText },
    { step: "02", title: "Concept và proposal", desc: "Ý tưởng, mood, kịch bản và hạng mục triển khai.", icon: Lightbulb },
    { step: "03", title: "Sản xuất và chuẩn bị", desc: "Thiết kế, thi công, nhân sự và kỹ thuật.", icon: Factory },
    { step: "04", title: "Vận hành hiện trường", desc: "Checklist, chạy chương trình và xử lý rủi ro.", icon: HardHat },
    { step: "05", title: "Hậu kỳ và báo cáo", desc: "Media, ảnh video, tổng kết và nghiệm thu.", icon: FileBarChart2 },
  ],
  en: [
    { step: "01", title: "Consultation & Brief", desc: "Objectives, audience, budget, and timeline.", icon: MessageSquareText },
    { step: "02", title: "Concept & Proposal", desc: "Creative direction, mood, script, and execution scope.", icon: Lightbulb },
    { step: "03", title: "Production & Preparation", desc: "Design, fabrication, manpower, and technical setup.", icon: Factory },
    { step: "04", title: "On-site Execution", desc: "Checklist control, show calling, and risk handling.", icon: HardHat },
    { step: "05", title: "Post-event & Reporting", desc: "Media delivery, recap, summary, and final handover.", icon: FileBarChart2 },
  ],
};

export default function ServicesProcess({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";
  const steps = stepData[locale];

  return (
    <section className="relative bg-black py-14 md:py-18">
      <div className="lx-container">
        <div className="mb-10">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">
              {isEnglish ? "Execution Process" : "Quy trình triển khai"}
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-2 text-[15px] leading-7 text-white/70">
              {isEnglish
                ? "A transparent workflow to keep timeline and quality under control."
                : "Rõ ràng từng bước để đảm bảo đúng tiến độ và kiểm soát chất lượng."}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.step} delay={idx * 0.08}>
                <div className="group rounded-3xl border border-white/12 bg-white/[0.03] p-6 backdrop-blur transition-all duration-300 will-change-transform hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-bold tracking-[0.25em] text-white/40">
                      {item.step}
                    </span>

                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 transition group-hover:bg-yellow-400/20">
                      <Icon className="h-5 w-5 text-white/80 group-hover:text-yellow-400" />
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-extrabold text-white">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-white/70">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
