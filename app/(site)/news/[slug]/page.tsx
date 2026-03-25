import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { localizeNews } from "@/lib/content-localize";
import { getNewsBySlug } from "@/lib/content-store";
import { getCurrentLocale } from "@/lib/site-locale";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const item = await getNewsBySlug(slug);

  if (!item) {
    return {
      title: locale === "en" ? "Article not found" : "Tin tức không tồn tại",
    };
  }

  const localizedItem = localizeNews(item, locale);

  return {
    title: localizedItem.title,
    description: localizedItem.excerpt,
    keywords: [
      localizedItem.title,
      item.slug.replace(/-/g, " "),
      ...(locale === "en" ? ["event news", "event production"] : ["tin tức sự kiện", "tổ chức sự kiện"]),
    ],
    alternates: {
      canonical: `/news/${item.slug}`,
    },
    openGraph: {
      title: localizedItem.title,
      description: localizedItem.excerpt,
      type: "article",
      url: `/news/${item.slug}`,
      images: [{ url: item.image, alt: localizedItem.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: localizedItem.title,
      description: localizedItem.excerpt,
      images: [item.image],
    },
  };
}

export default async function NewsDetail({ params }: NewsDetailProps) {
  const { slug } = await params;
  const locale = await getCurrentLocale();
  const item = await getNewsBySlug(slug);

  if (!item) return notFound();

  const localizedItem = localizeNews(item, locale);

  return (
    <article className="pb-24 pt-[140px]">
      <div className="container mx-auto max-w-3xl px-6">
        <p className="mb-3 text-sm text-black/50">{localizedItem.date}</p>
        <h1 className="mb-8 text-4xl font-semibold leading-tight">{localizedItem.title}</h1>

        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={item.image}
            alt={localizedItem.title}
            fill
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: localizedItem.content }}
        />
      </div>
    </article>
  );
}
