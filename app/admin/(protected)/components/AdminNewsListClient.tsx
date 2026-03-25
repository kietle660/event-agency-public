"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { NewsItem } from "@/lib/content-types";

type AdminNewsListClientProps = {
  items: NewsItem[];
};

export default function AdminNewsListClient({
  items,
}: AdminNewsListClientProps) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    if (!normalized) {
      return items;
    }

    return items.filter((item) => {
      const haystack = [
        item.title,
        item.excerpt,
        item.slug,
        item.date,
        item.content,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [items, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function handleKeywordChange(value: string) {
    setKeyword(value);
    setPage(1);
  }

  return (
    <section className="mt-8 space-y-5">
      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Danh sách bài viết</h2>
            <p className="mt-1 text-sm text-white/55">
              Lọc nhanh theo tiêu đề, mô tả ngắn, slug hoặc nội dung bài viết.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            <input
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              placeholder="Tìm theo từ khóa..."
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-white/55 md:flex-row md:items-center md:justify-between">
          <div>
            Hiển thị {paginatedItems.length ? (currentPage - 1) * pageSize + 1 : 0}-
            {Math.min(currentPage * pageSize, filteredItems.length)} / {filteredItems.length} bài viết
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 px-4 text-xs text-white transition hover:border-yellow-400/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trang trước
            </button>

            <div className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 px-4 text-xs text-white/70">
              Trang {currentPage}/{totalPages}
            </div>

            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 px-4 text-xs text-white transition hover:border-yellow-400/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {paginatedItems.length ? (
          paginatedItems.map((item) => (
            <article
              key={item.slug}
              className="rounded-[22px] border border-white/10 bg-white/5 p-4 transition hover:border-yellow-400/20"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/45">
                    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1">
                      {item.date}
                    </span>
                    <span>/news/{item.slug}</span>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/65">
                    {item.excerpt}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3">
                  <Link
                    href={`/admin/news/${item.slug}/edit`}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-4 text-sm transition hover:border-yellow-400/40"
                  >
                    Sửa
                  </Link>

                  <form action="/api/admin/news" method="post">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="slug" value={item.slug} />
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-red-400/30 px-4 text-sm text-red-200 transition hover:bg-red-500/10"
                    >
                      Xóa
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-8 text-sm text-white/55">
            Không có bài viết nào khớp với từ khóa bạn đang tìm.
          </div>
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-4 text-sm transition ${
                  isActive
                    ? "border-yellow-400 bg-yellow-400 text-black"
                    : "border-white/10 text-white hover:border-yellow-400/40"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
