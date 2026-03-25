import type { SiteLocale } from "@/lib/site-locale";

export default function CTASection({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full bg-yellow-500/20 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-[420px] w-[420px] rounded-full bg-yellow-400/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-6 py-24">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-widest text-yellow-400">
            {isEnglish ? "Ready for your next event?" : "Sẵn sàng cho sự kiện tiếp theo?"}
          </p>

          <h2 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            {isEnglish ? "Turn your idea into " : "Biến ý tưởng của bạn "}
            <br className="hidden md:block" />
            <span className="text-yellow-400">
              {isEnglish ? "a memorable event" : "thành một sự kiện đáng nhớ"}
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg text-white/70">
            {isEnglish
              ? "We support you from concept and production to on-site execution, ensuring a polished and effective event experience."
              : "Chúng tôi đồng hành từ concept, sản xuất đến vận hành, đảm bảo sự kiện diễn ra chỉn chu và hiệu quả."}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="/contact"
              className="group inline-flex h-14 items-center gap-3 rounded-xl bg-yellow-500 px-8 text-lg font-medium text-black transition hover:bg-yellow-400"
            >
              {isEnglish ? "Get a Quote" : "Nhận báo giá"}
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
