import type { Metadata } from "next";
import Link from "next/link";
import {
  AudioLines,
  BarChart3,
  ClipboardCheck,
  Factory,
  FileText,
  HandHeart,
  HardHat,
  Lightbulb,
  Megaphone,
  PencilRuler,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { getCurrentLocale } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "TRỌNG THÁI EVENT là đơn vị tổ chức sự kiện và truyền thông thương hiệu với quy trình chuyên nghiệp, triển khai trọn gói A-Z và tối ưu trải nghiệm khách mời.",
  alternates: {
    canonical: "/about",
  },
};

const strengths = {
  vi: [
    {
      icon: ClipboardCheck,
      title: "Vận hành chuẩn run-down",
      desc: "Checklist rõ ràng theo từng hạng mục, timeline chặt chẽ, xử lý tình huống nhanh.",
    },
    {
      icon: PencilRuler,
      title: "Thiết kế và thi công đồng bộ",
      desc: "Backdrop, sân khấu, booth activation, POSM... đảm bảo nhận diện thương hiệu nhất quán.",
    },
    {
      icon: AudioLines,
      title: "Kỹ thuật sân khấu vững",
      desc: "Âm thanh, ánh sáng, LED, livestream được test kỹ trước giờ G để hạn chế rủi ro.",
    },
    {
      icon: Megaphone,
      title: "Truyền thông onsite hiệu quả",
      desc: "Kịch bản MC, photo video, recap nhanh, tối ưu nội dung cho social và PR.",
    },
  ],
  en: [
    {
      icon: ClipboardCheck,
      title: "Disciplined run-down execution",
      desc: "Clear checklists, tight timeline control, and quick issue handling on-site.",
    },
    {
      icon: PencilRuler,
      title: "Unified design and build",
      desc: "Backdrop, stage, activation booth, and POSM aligned with brand identity.",
    },
    {
      icon: AudioLines,
      title: "Reliable stage technology",
      desc: "Audio, lighting, LED, and livestream systems are tested thoroughly before showtime.",
    },
    {
      icon: Megaphone,
      title: "Effective on-site communication",
      desc: "MC script, photo/video, rapid recap, and optimized social-ready content.",
    },
  ],
};

const process = {
  vi: [
    { step: "01", icon: FileText, title: "Tiếp nhận brief", desc: "Mục tiêu, thông điệp, ngân sách, thời gian, địa điểm và chân dung khách mời." },
    { step: "02", icon: Lightbulb, title: "Đề xuất concept và kế hoạch", desc: "Moodboard, flow chương trình, nhân sự, hạng mục thi công và kỹ thuật." },
    { step: "03", icon: Factory, title: "Triển khai sản xuất", desc: "Thiết kế 2D/3D, đặt vật tư, sản xuất POSM, booking nhân sự và thiết bị." },
    { step: "04", icon: HardHat, title: "Set-up và vận hành", desc: "Tổng duyệt, test kỹ thuật, check-in, điều phối và kiểm soát chất lượng onsite." },
    { step: "05", icon: BarChart3, title: "Hậu kỳ và báo cáo", desc: "Recap video, hình ảnh, tổng hợp số liệu, nghiệm thu, bàn giao và rút kinh nghiệm." },
  ],
  en: [
    { step: "01", icon: FileText, title: "Receive the brief", desc: "Objectives, message, budget, timeline, venue, and guest profile." },
    { step: "02", icon: Lightbulb, title: "Concept and planning", desc: "Moodboard, show flow, manpower planning, fabrication, and technical scope." },
    { step: "03", icon: Factory, title: "Production phase", desc: "2D/3D design, material sourcing, POSM production, manpower and equipment booking." },
    { step: "04", icon: HardHat, title: "Setup and execution", desc: "Rehearsal, technical testing, check-in, on-site coordination, and quality control." },
    { step: "05", icon: BarChart3, title: "Post-event reporting", desc: "Recap video, photo delivery, data summary, acceptance, handover, and review." },
  ],
};

const values = {
  vi: [
    { icon: ShieldCheck, title: "Kỷ luật", desc: "Đúng timeline, đúng checklist và đúng tiêu chuẩn an toàn." },
    { icon: Sparkles, title: "Tinh tế", desc: "Trải nghiệm khách mời mượt mà, từng chi tiết được chăm chút cẩn thận." },
    { icon: TrendingUp, title: "Hiệu quả", desc: "Tối ưu nguồn lực, ngân sách và mục tiêu truyền thông cho từng chương trình." },
    { icon: HandHeart, title: "Trách nhiệm", desc: "Một đầu mối xuyên suốt, luôn chủ động báo cáo và xử lý vấn đề nhanh." },
  ],
  en: [
    { icon: ShieldCheck, title: "Discipline", desc: "On-time delivery, checklist-based execution, and safety-first standards." },
    { icon: Sparkles, title: "Refinement", desc: "Smooth guest experience and careful attention to every visible detail." },
    { icon: TrendingUp, title: "Effectiveness", desc: "Optimized resources, budget, and communication outcomes for every project." },
    { icon: HandHeart, title: "Ownership", desc: "A consistent point of contact with proactive updates and quick problem solving." },
  ],
};

export default async function AboutPage() {
  const locale = await getCurrentLocale();
  const isEnglish = locale === "en";

  return (
    <main className="bg-white">
      <section className="bg-neutral-50 pb-12 pt-[110px] md:pt-[140px]">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(80%_80%_at_15%_10%,rgba(250,204,21,0.18),transparent_60%),radial-gradient(70%_70%_at_90%_30%,rgba(0,0,0,0.06),transparent_55%)]" />
            <div className="relative px-7 py-10 md:px-12 md:py-14">
              <p className="text-xs font-semibold tracking-[0.22em] text-black/60">
                ABOUT • EVENT PRODUCTION • BRAND EXPERIENCE
              </p>

              <h1 className="mt-3 text-3xl font-semibold leading-tight md:text-5xl">
                TRỌNG THÁI EVENT
                <span className="block text-black/70">
                  {isEnglish
                    ? "Your partner for event production and brand communication"
                    : "Đối tác tổ chức sự kiện và truyền thông thương hiệu"}
                </span>
              </h1>

              <p className="mt-4 max-w-2xl leading-relaxed text-black/70">
                {isEnglish
                  ? "We provide turnkey solutions for conferences, grand openings, activations, corporate internal events, and on-site communication campaigns with strong corporate discipline and memorable execution."
                  : "Chúng tôi cung cấp giải pháp trọn gói cho hội nghị, hội thảo, khai trương, khánh thành, activation, sự kiện nội bộ doanh nghiệp và các chiến dịch truyền thông onsite. Ưu tiên phong cách corporate: chỉn chu, đúng timeline, kiểm soát rủi ro tốt và tạo trải nghiệm đáng nhớ."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-black shadow-md hover:bg-orange-500/90"
                >
                  {isEnglish ? "Get a Quote" : "Nhận báo giá"}
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-black/5"
                >
                  {isEnglish ? "View our projects" : "Xem dự án đã làm"}
                </Link>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                {isEnglish ? "Strengths & Capabilities" : "Năng lực và điểm mạnh"}
              </h2>
              <p className="mt-2 max-w-2xl text-black/70">
                {isEnglish
                  ? "We focus on execution quality, visual refinement, and communication impact."
                  : "Tập trung vào chất lượng vận hành, tính thẩm mỹ và hiệu quả truyền thông."}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {strengths[locale].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-black/10 bg-neutral-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-yellow-400/20">
                      <Icon className="h-5 w-5 text-black/80" />
                    </div>
                    <div>
                      <div className="text-base font-semibold">{item.title}</div>
                      <p className="mt-2 text-sm leading-relaxed text-black/70">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold md:text-3xl">
            {isEnglish ? "Working Process" : "Quy trình làm việc"}
          </h2>
          <p className="mt-2 max-w-2xl text-black/70">
            {isEnglish
              ? "A transparent workflow with clear responsibility, visible progress, and quality control."
              : "Minh bạch từng bước, rõ trách nhiệm, dễ theo dõi tiến độ và kiểm soát chất lượng."}
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-5">
            {process[locale].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-3xl border border-black/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold tracking-[0.2em] text-black/50">
                      STEP {item.step}
                    </div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-yellow-400/15">
                      <Icon className="h-5 w-5 text-black/80" />
                    </div>
                  </div>

                  <div className="mt-3 font-semibold">{item.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-black/70">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                {isEnglish ? "Core Values" : "Giá trị cốt lõi"}
              </h2>
              <p className="mt-3 leading-relaxed text-black/70">
                {isEnglish
                  ? "We believe a good event should not only look beautiful, but also run smoothly, hit its objective, and leave a clear brand impression."
                  : "Chúng tôi tin rằng một sự kiện tốt không chỉ đẹp mà còn phải vận hành mượt, đúng mục tiêu và tạo được dấu ấn thương hiệu rõ ràng."}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {values[locale].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-black/10 bg-neutral-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_50px_rgba(0,0,0,0.10)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-yellow-400/20">
                        <Icon className="h-5 w-5 text-black/80" />
                      </div>
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <p className="mt-2 text-sm leading-relaxed text-black/70">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-16 text-white">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
            <h3 className="text-2xl font-semibold md:text-3xl">
              {isEnglish
                ? "Need a professional event team?"
                : "Bạn cần một đội ngũ tổ chức sự kiện chuyên nghiệp?"}
            </h3>
            <p className="mt-3 max-w-2xl text-white/70">
              {isEnglish
                ? "Send your brief and we will respond within 24 hours with concept direction, execution scope, and a suitable quotation."
                : "Gửi brief nhanh, chúng tôi sẽ phản hồi trong 24h với đề xuất concept, hạng mục triển khai và báo giá phù hợp."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-black hover:bg-orange-500/90"
              >
                {isEnglish ? "Get a Quote" : "Nhận báo giá"}
              </Link>
              <Link
                href="/projects"
                className="inline-flex rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {isEnglish ? "View Projects" : "Xem dự án"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
