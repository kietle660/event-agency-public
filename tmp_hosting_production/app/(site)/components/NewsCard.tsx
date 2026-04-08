import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "@/lib/content-types";
import type { SiteLocale } from "@/lib/site-locale";

export default function NewsCard({
  item,
  locale,
}: {
  item: NewsItem;
  locale: SiteLocale;
}) {
  const isEnglish = locale === "en";

  return (
    <Link
      href={`/news/${item.slug}`}
      className={[
        "group block overflow-hidden rounded-2xl border border-black/10 bg-white",
        "shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)]",
        "transition",
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.06]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-70" />

        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black shadow-sm">
          {item.date}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-lg font-semibold leading-snug text-white drop-shadow">
            {item.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 text-sm text-black/70">{item.excerpt}</p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-black">
          {isEnglish ? "Read more" : "Đọc tiếp"}
          <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/35 to-transparent" />
    </Link>
  );
}
