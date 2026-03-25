import type { SiteLocale } from "@/lib/site-locale";

export default function ServicesHero({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";

  return (
    <section className="lux-bg relative overflow-hidden bg-black pt-24 md:pt-32">
      <div className="lx-container relative z-10 pb-12 md:pb-16">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-[0.28em] text-white/60">
            TRONGTHAIEVENT • SERVICES
          </div>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-white md:text-6xl">
            {isEnglish ? "Our Services" : "Dịch vụ của chúng tôi"}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/80 md:text-lg">
            {isEnglish
              ? "Turnkey event solutions from design and production to execution, optimizing guest experience and communication impact for brands."
              : "Giải pháp tổ chức sự kiện trọn gói, thiết kế, sản xuất và vận hành, tối ưu trải nghiệm và hiệu quả truyền thông cho doanh nghiệp."}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              {isEnglish ? "Get a Quote" : "Nhận báo giá"}
            </a>
            <a
              href="#services"
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {isEnglish ? "View Services" : "Xem dịch vụ"}
            </a>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-white/10" />
    </section>
  );
}
