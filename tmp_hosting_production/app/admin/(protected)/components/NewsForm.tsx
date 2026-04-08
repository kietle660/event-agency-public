"use client";

import { useState } from "react";

import type { NewsItem } from "@/lib/content-types";

import ImageUploadField from "./ImageUploadField";

type NewsFormProps = {
  action: string;
  submitLabel: string;
  initialValue?: NewsItem;
  slug?: string;
};

function getSeoStatus(length: number, min: number, max: number) {
  if (length >= min && length <= max) return "text-emerald-300";
  if (length === 0) return "text-white/45";
  return "text-amber-300";
}

export default function NewsForm({ action, submitLabel, initialValue, slug }: NewsFormProps) {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [titleEn, setTitleEn] = useState(initialValue?.titleEn || "");
  const [newsSlug, setNewsSlug] = useState(initialValue?.slug || "");
  const [excerpt, setExcerpt] = useState(initialValue?.excerpt || "");
  const [excerptEn, setExcerptEn] = useState(initialValue?.excerptEn || "");

  return (
    <form action={action} method="post" className="grid gap-6">
      <input type="hidden" name="intent" value={slug ? "update" : "create"} />
      {slug ? <input type="hidden" name="slug" value={slug} /> : null}

      <div className="rounded-[24px] border border-yellow-400/20 bg-yellow-400/5 p-5">
        <h3 className="text-lg font-semibold text-white">Gợi ý viết bài chuẩn SEO</h3>
        <div className="mt-3 grid gap-2 text-sm leading-6 text-white/70">
          <p>Tiêu đề nên rõ chủ đề chính, có từ khóa và địa phương nếu cần, dài khoảng 50 đến 60 ký tự.</p>
          <p>Mô tả ngắn nên dài khoảng 120 đến 160 ký tự vì đây là phần hay được dùng làm meta description.</p>
          <p>Nội dung nên có các heading như h2, h3, đoạn ngắn dễ đọc và chèn từ khóa tự nhiên.</p>
          <p>Ảnh đại diện nên đúng chủ đề bài viết, đủ chất lượng để chia sẻ social.</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">Nội dung tiếng Việt</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tiêu đề SEO</span>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
            <span className={`mt-2 block text-xs ${getSeoStatus(title.trim().length, 50, 60)}`}>
              {title.trim().length}/60 ký tự
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Slug URL</span>
            <input
              name="newsSlug"
              value={newsSlug}
              onChange={(event) => setNewsSlug(event.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Ngày đăng</span>
            <input
              name="date"
              defaultValue={initialValue?.date || ""}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>

          <ImageUploadField
            label="Ảnh bài viết"
            name="image"
            defaultValue={initialValue?.image || ""}
            required
            helpText="Ảnh này được dùng ở danh sách bài viết, trang chi tiết và khi chia sẻ link."
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Mô tả ngắn / meta description</span>
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={4}
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
          <span className={`mt-2 block text-xs ${getSeoStatus(excerpt.trim().length, 120, 160)}`}>
            {excerpt.trim().length}/160 ký tự
          </span>
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Nội dung HTML</span>
          <textarea
            name="content"
            defaultValue={initialValue?.content || ""}
            rows={14}
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm outline-none focus:border-yellow-400"
          />
        </label>
      </div>

      <div className="rounded-[24px] border border-sky-400/20 bg-sky-400/5 p-5">
        <h3 className="text-lg font-semibold text-white">English Version</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">SEO title</span>
            <input
              name="titleEn"
              value={titleEn}
              onChange={(event) => setTitleEn(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-sky-400"
            />
            <span className={`mt-2 block text-xs ${getSeoStatus(titleEn.trim().length, 50, 60)}`}>
              {titleEn.trim().length}/60 characters
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Meta description</span>
            <textarea
              name="excerptEn"
              value={excerptEn}
              onChange={(event) => setExcerptEn(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-sky-400"
            />
            <span className={`mt-2 block text-xs ${getSeoStatus(excerptEn.trim().length, 120, 160)}`}>
              {excerptEn.trim().length}/160 characters
            </span>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">English HTML content</span>
          <textarea
            name="contentEn"
            defaultValue={initialValue?.contentEn || ""}
            rows={14}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm outline-none focus:border-sky-400"
          />
        </label>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/55">Preview SEO</div>
        <div className="mt-4 max-w-3xl">
          <div className="text-lg font-medium text-sky-300">{title || "Tiêu đề bài viết"}</div>
          <div className="mt-1 text-sm text-emerald-300">
            https://trongthaievent.com/news/{newsSlug || "slug-bai-viet"}
          </div>
          <div className="mt-2 text-sm leading-6 text-white/70">
            {excerpt || "Mô tả ngắn của bài viết sẽ xuất hiện ở đây để bạn xem trước cách hiển thị trên Google."}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
      >
        {submitLabel}
      </button>
    </form>
  );
}
