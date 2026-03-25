import Image from "next/image";
import Link from "next/link";

import type { SiteLocale } from "@/lib/site-locale";

import Reveal from "./Reveal";

const serviceData = {
  vi: [
    {
      title: "Tổ chức sự kiện doanh nghiệp",
      desc: "Hội nghị • Khai trương • Year End Party • Team Building • Lễ kỷ niệm.",
      tags: ["Concept", "Kịch bản", "Vận hành"],
      image: "/services/to-chuc.jpg",
    },
    {
      title: "Sản xuất và thi công",
      desc: "Thiết kế 2D/3D • Thi công sân khấu • Booth • Backdrop • POSM.",
      tags: ["Thiết kế", "Thi công", "Timeline"],
      image: "/services/san-xuat.jpg",
    },
    {
      title: "Kỹ thuật sân khấu",
      desc: "Âm thanh • Ánh sáng • LED • Nhà giàn • Livestream • Truyền dẫn.",
      tags: ["AV", "LED", "Livestream"],
      image: "/services/ky-thuat.jpg",
    },
    {
      title: "Truyền thông và activation",
      desc: "Ra mắt sản phẩm • Roadshow • Activation • Seeding • Media coverage.",
      tags: ["PR", "Activation", "Report"],
      image: "/services/media.jpg",
    },
    {
      title: "Cho thuê thiết bị",
      desc: "LED • Âm thanh • Ánh sáng • Sân khấu • Nhà bạt • Bàn ghế.",
      tags: ["Rental", "Setup", "Support"],
      image: "/services/thiet-bi.jpg",
    },
    {
      title: "Nhân sự và biểu diễn",
      desc: "MC • PG/PB • Lễ tân • Vũ đoàn • Band • Nghệ sĩ • KOL/KOC.",
      tags: ["Talent", "Casting", "Training"],
      image: "/services/pg.jpg",
    },
  ],
  en: [
    {
      title: "Corporate Event Production",
      desc: "Conference • Grand Opening • Year End Party • Team Building • Anniversary Event.",
      tags: ["Concept", "Script", "Execution"],
      image: "/services/to-chuc.jpg",
    },
    {
      title: "Production & Fabrication",
      desc: "2D/3D design • Stage build • Booth • Backdrop • POSM.",
      tags: ["Design", "Build", "Timeline"],
      image: "/services/san-xuat.jpg",
    },
    {
      title: "Stage Technology",
      desc: "Audio • Lighting • LED • Truss • Livestream • Signal transmission.",
      tags: ["AV", "LED", "Livestream"],
      image: "/services/ky-thuat.jpg",
    },
    {
      title: "Media & Activation",
      desc: "Product launch • Roadshow • Activation • Seeding • Media coverage.",
      tags: ["PR", "Activation", "Report"],
      image: "/services/media.jpg",
    },
    {
      title: "Equipment Rental",
      desc: "LED • Audio • Lighting • Stage • Tent • Tables and chairs.",
      tags: ["Rental", "Setup", "Support"],
      image: "/services/thiet-bi.jpg",
    },
    {
      title: "Staffing & Performance",
      desc: "MC • PG/PB • Hostess • Dance crew • Band • Artist • KOL/KOC.",
      tags: ["Talent", "Casting", "Training"],
      image: "/services/pg.jpg",
    },
  ],
};

export default function ServicesGrid({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";
  const services = serviceData[locale];

  return (
    <section id="services" className="relative overflow-visible bg-black py-14 md:py-18">
      <div className="lx-container">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-white md:text-3xl">
              {isEnglish ? "Featured Services" : "Dịch vụ nổi bật"}
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-white/70">
              {isEnglish
                ? "Choose a suitable package or let us build a tailored solution for your objective."
                : "Chọn gói phù hợp hoặc để chúng tôi thiết kế giải pháp đo ni đóng giày."}
            </p>
          </div>
          <Link
            href="/contact"
            className="hidden rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 md:inline-flex"
          >
            {isEnglish ? "Quick Consultation" : "Tư vấn nhanh"}
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <Reveal key={service.title} delay={idx * 0.08}>
              <div className="group rounded-3xl border border-white/12 bg-white/[0.03] p-6 backdrop-blur transition-all duration-300 will-change-transform hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <div className="relative mb-5 h-[140px] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/55 to-black/90" />
                  <div className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 -translate-x-[30%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-[260%] group-hover:opacity-100" />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-extrabold text-white">{service.title}</h3>
                  <span className="h-10 w-10 rounded-full bg-white/10 ring-1 ring-white/15" />
                </div>

                <p className="mt-3 text-[15px] leading-7 text-white/70">{service.desc}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 h-px w-full bg-white/10" />
                <div className="mt-4 text-sm font-semibold text-white/80 group-hover:text-white">
                  {isEnglish ? "View details →" : "Xem chi tiết →"}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
