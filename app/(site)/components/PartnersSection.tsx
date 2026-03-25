import Image from "next/image";

import { getCurrentLocale } from "@/lib/site-locale";
import { getSiteSettings } from "@/lib/site-settings";

export default async function PartnersSection() {
  const settings = await getSiteSettings();
  const locale = await getCurrentLocale();
  const isEnglish = locale === "en";
  const partners = settings.partnerItems.filter((item) => item.logo && item.name);
  const loop = [...partners, ...partners];

  return (
    <section className="bg-[#f7f4ee] py-20 text-zinc-950">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold md:text-4xl">
            {isEnglish ? "Partners" : "Đối tác"}
          </h2>
          <p className="mt-2 max-w-2xl text-zinc-600">
            {isEnglish
              ? "Brands that have trusted us along the journey."
              : "Những thương hiệu đã đồng hành cùng chúng tôi."}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />

          <div className="py-7">
            <div className="flex w-max animate-partners gap-10 px-10 md:gap-12">
              {loop.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className={[
                    "relative flex h-16 items-center justify-center md:h-20",
                    partner.size === "lg"
                      ? "w-[220px] md:w-[250px]"
                      : partner.size === "sm"
                        ? "w-[150px] md:w-[180px]"
                        : "w-[180px] md:w-[210px]",
                  ].join(" ")}
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes={partner.size === "lg" ? "250px" : "210px"}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes partners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partners { animation: partners 22s linear infinite; }
        .animate-partners:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}
