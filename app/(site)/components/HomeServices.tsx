import Image from "next/image";
import Link from "next/link";

import type { SiteLocale } from "@/lib/site-locale";

const services = {
  vi: [
    {
      title: "Hội nghị • Hội thảo",
      desc: "Run-down chặt chẽ, check-in, điều phối, kỹ thuật & hậu kỳ.",
      items: ["Kịch bản & run-down", "Check-in & điều phối", "Âm thanh/ánh sáng", "Backdrop/sân khấu"],
      image: "/services/hoi-nghi.jpg",
    },
    {
      title: "Khai trương • Khánh thành",
      desc: "Concept, nghi thức, truyền thông onsite, set-up trọn gói.",
      items: ["Concept & thiết kế", "MC • Lễ cắt băng", "Múa lân/tiết mục", "Truyền thông sự kiện"],
      image: "/services/khai-truong.jpg",
    },
    {
      title: "Team Building",
      desc: "Kịch bản trò chơi, an toàn vận hành, chấm điểm KPI nhóm.",
      items: ["Kịch bản trò chơi", "Dụng cụ & nhân sự", "Chấm điểm KPI", "An toàn & vận hành"],
      image: "/services/team-building.png",
    },
    {
      title: "Year End Party",
      desc: "Ý tưởng chương trình, sản xuất tiết mục, quà tặng, hậu kỳ.",
      items: ["Ý tưởng chương trình", "Sản xuất tiết mục", "Quà tặng", "Photo/Video hậu kỳ"],
      image: "/services/year-end.jpg",
    },
    {
      title: "Nhân sự biểu diễn • Thiết bị",
      desc: "Cung cấp nhân sự và thiết bị sự kiện đồng bộ, đảm bảo chất lượng và an toàn vận hành.",
      items: ["Nghệ sĩ biểu diễn", "Vũ đoàn, MC, PG, PB, lễ tân", "Âm thanh • ánh sáng • màn hình LED, sân khấu", "Thiết bị sự kiện"],
      image: "/services/nhan-su.jpg",
    },
    {
      title: "Tiệc cưới",
      desc: "Tổ chức tiệc cưới trọn gói, cá nhân hóa concept, chỉn chu từng khoảnh khắc đáng nhớ.",
      items: ["Concept & trang trí tiệc cưới", "Nghi thức lễ cưới • kịch bản chương trình", "Âm thanh • ánh sáng • sân khấu", "Điều phối & vận hành ngày cưới"],
      image: "/services/tiec-cuoi.jpg",
    },
  ],
  en: [
    {
      title: "Conference • Seminar",
      desc: "Structured run-down, check-in, coordination, technical setup, and post-production.",
      items: ["Script & run-down", "Check-in & coordination", "Audio/lighting", "Backdrop/stage"],
      image: "/services/hoi-nghi.jpg",
    },
    {
      title: "Grand Opening • Inauguration",
      desc: "Concept, ceremony flow, on-site media, and turnkey setup.",
      items: ["Concept & design", "MC • ribbon-cutting", "Lion dance/performance", "Event communications"],
      image: "/services/khai-truong.jpg",
    },
    {
      title: "Team Building",
      desc: "Game scenarios, safety operations, and team KPI scoring.",
      items: ["Game scenarios", "Props & manpower", "KPI scoring", "Safety & execution"],
      image: "/services/team-building.png",
    },
    {
      title: "Year End Party",
      desc: "Program ideas, performance production, gifts, and post-event content.",
      items: ["Program concept", "Performance production", "Gifts", "Photo/video post-production"],
      image: "/services/year-end.jpg",
    },
    {
      title: "Performers • Equipment",
      desc: "Unified event staffing and equipment solutions with reliable quality and safe operation.",
      items: ["Performing artists", "Dance crew, MC, PG, PB, hostess", "Audio • lighting • LED screen • stage", "Event equipment"],
      image: "/services/nhan-su.jpg",
    },
    {
      title: "Wedding",
      desc: "Full-service wedding production with personalized concept and polished memorable moments.",
      items: ["Wedding concept & decoration", "Ceremony flow • show script", "Audio • lighting • stage", "Wedding day coordination"],
      image: "/services/tiec-cuoi.jpg",
    },
  ],
};

export default function HomeServices({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";
  const items = services[locale];

  return (
    <section className="bg-gradient-to-b from-[#f2efe9] via-[#f7f5f1] to-white py-16 md:py-20">
      <div className="lx-container">
        <div className="mb-12 text-center">
          <h2 className="mt-3 text-3xl font-extrabold text-zinc-900 md:text-4xl">
            {isEnglish ? "OUR SERVICES" : "DỊCH VỤ CỦA CHÚNG TÔI"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[20px] leading-7 text-zinc-600">
            {isEnglish
              ? "Turnkey event solutions with disciplined timeline execution, refined guest experience, and strong brand impact."
              : "Giải pháp sự kiện trọn gói — triển khai chuẩn timeline, tối ưu trải nghiệm và hiệu quả thương hiệu."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <Link
              key={s.title}
              href="/contact"
              className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_55px_rgba(0,0,0,0.10)] transition hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.14)] before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(120deg,transparent_35%,rgba(214,180,106,0.35),transparent_65%)] before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-full"
            >
              <div className="relative h-[220px]">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent opacity-80" />
                <div className="pointer-events-none absolute inset-0 ring-2 ring-[#d6b46a]/70" />
              </div>

              <div className="bg-[#faf9f7] p-6">
                <h3 className="text-lg font-extrabold text-zinc-900">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-zinc-600">{s.desc}</p>

                <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 rounded-full bg-[#d6b46a]" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-black/10 pt-4 text-sm font-semibold text-zinc-900">
                  {isEnglish ? "Get Consultation →" : "Nhận tư vấn →"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="rounded-full border border-black/15 bg-black/[0.02] px-10 py-3 text-sm font-semibold text-zinc-900 hover:bg-black/[0.06]"
          >
            {isEnglish ? "View All Services" : "Xem tất cả dịch vụ"}
          </Link>
        </div>
      </div>
    </section>
  );
}
