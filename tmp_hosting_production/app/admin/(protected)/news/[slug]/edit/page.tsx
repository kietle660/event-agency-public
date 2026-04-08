import Link from "next/link";
import { notFound } from "next/navigation";

import NewsForm from "../../../components/NewsForm";
import { getNewsBySlug } from "@/lib/content-store";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Sửa bài viết</h1>
            <p className="mt-2 text-sm text-white/60">{item.title}</p>
          </div>

          <Link href="/admin/news" className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm transition hover:border-yellow-400/40">
            Quay lại
          </Link>
        </div>

        <div className="mt-8">
          <NewsForm action="/api/admin/news" submitLabel="Lưu thay đổi" initialValue={item} slug={slug} />
        </div>
      </div>
    </main>
  );
}
