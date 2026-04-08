import type { SiteLocale } from "@/lib/site-locale";

export default function ServicesCTA({ locale }: { locale: SiteLocale }) {
  const isEnglish = locale === "en";

  return (
    <section className="relative bg-black pb-16">
      <div className="lx-container">
        <div className="rounded-3xl border border-white/12 bg-white/[0.04] p-7 md:p-10">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-extrabold text-white">
                {isEnglish
                  ? "Need a quick quote for your upcoming event?"
                  : "Cần báo giá nhanh cho sự kiện sắp tới?"}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-white/70">
                {isEnglish
                  ? "Send us your brief and we will respond within 24 hours with a clear proposal and estimate."
                  : "Gửi brief, chúng tôi phản hồi trong 24h với proposal và dự toán rõ ràng."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <a
                href="/contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                {isEnglish ? "Get a Quote" : "Nhận báo giá"}
              </a>
              <a
                href="tel:0982815682"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {isEnglish ? "Call Hotline" : "Gọi hotline"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
