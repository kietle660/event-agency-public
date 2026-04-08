"use client";

import { useState } from "react";

import type { Project } from "@/lib/content-types";

import GalleryUploadField from "./GalleryUploadField";
import ImageUploadField from "./ImageUploadField";

type ProjectFormProps = {
  action: string;
  submitLabel: string;
  initialValue?: Project;
  slug?: string;
};

function getSeoStatus(length: number, min: number, max: number) {
  if (length >= min && length <= max) {
    return "text-emerald-300";
  }

  if (length === 0) {
    return "text-white/45";
  }

  return "text-amber-300";
}

export default function ProjectForm({
  action,
  submitLabel,
  initialValue,
  slug,
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialValue?.title || "");
  const [titleEn, setTitleEn] = useState(initialValue?.titleEn || "");
  const [projectSlug, setProjectSlug] = useState(
    initialValue ? initialValue.href.replace("/projects/", "") : "",
  );
  const [desc, setDesc] = useState(initialValue?.desc || "");
  const [descEn, setDescEn] = useState(initialValue?.descEn || "");

  return (
    <form action={action} method="post" className="grid gap-6">
      <input type="hidden" name="intent" value={slug ? "update" : "create"} />
      {slug ? <input type="hidden" name="slug" value={slug} /> : null}

      <div className="rounded-[24px] border border-yellow-400/20 bg-yellow-400/5 p-5">
        <h3 className="text-lg font-semibold text-white">Gợi ý tối ưu SEO cho dự án</h3>
        <div className="mt-3 grid gap-2 text-sm leading-6 text-white/70">
          <p>Tiêu đề nên mô tả rõ loại sự kiện, thương hiệu hoặc địa phương để tăng khả năng tìm thấy.</p>
          <p>Mô tả dự án nên nêu được quy mô, hạng mục triển khai và kết quả nổi bật trong khoảng 120 đến 160 ký tự.</p>
          <p>Slug ngắn gọn, dễ đọc, không dấu sẽ tốt hơn cho URL và khả năng chia sẻ.</p>
          <p>Ảnh đại diện nên là ảnh mạnh nhất của dự án vì sẽ được dùng cho Open Graph và trang chi tiết.</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">Nội dung tiếng Việt</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tiêu đề dự án</span>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
            <span className={`mt-2 block text-xs ${getSeoStatus(title.trim().length, 50, 70)}`}>
              {title.trim().length}/70 ký tự
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Khách hàng</span>
            <input
              name="client"
              defaultValue={initialValue?.client || ""}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Địa điểm</span>
            <input
              name="location"
              defaultValue={initialValue?.location || ""}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Thời gian</span>
            <input
              name="date"
              defaultValue={initialValue?.date || ""}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Slug dự án</span>
            <input
              name="projectSlug"
              value={projectSlug}
              onChange={(event) => setProjectSlug(event.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Mô tả ngắn chuẩn SEO</span>
          <textarea
            name="desc"
            value={desc}
            onChange={(event) => setDesc(event.target.value)}
            rows={4}
            required
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
          <span className={`mt-2 block text-xs ${getSeoStatus(desc.trim().length, 120, 160)}`}>
            {desc.trim().length}/160 ký tự
          </span>
        </label>
      </div>

      <div className="rounded-[24px] border border-sky-400/20 bg-sky-400/5 p-5">
        <h3 className="text-lg font-semibold text-white">English Version</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Project title</span>
            <input
              name="titleEn"
              value={titleEn}
              onChange={(event) => setTitleEn(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-sky-400"
            />
            <span className={`mt-2 block text-xs ${getSeoStatus(titleEn.trim().length, 50, 70)}`}>
              {titleEn.trim().length}/70 characters
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Client</span>
            <input
              name="clientEn"
              defaultValue={initialValue?.clientEn || ""}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-sky-400"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Location</span>
            <input
              name="locationEn"
              defaultValue={initialValue?.locationEn || ""}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">SEO description</span>
            <textarea
              name="descEn"
              value={descEn}
              onChange={(event) => setDescEn(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-sky-400"
            />
            <span className={`mt-2 block text-xs ${getSeoStatus(descEn.trim().length, 120, 160)}`}>
              {descEn.trim().length}/160 characters
            </span>
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ImageUploadField
          label="Ảnh đại diện"
          name="image"
          defaultValue={initialValue?.image || ""}
          required
          helpText="Ảnh này sẽ được dùng cho trang chi tiết dự án, danh sách dự án và chia sẻ mạng xã hội."
        />
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Tags / từ khóa liên quan</span>
          <input
            name="tags"
            defaultValue={initialValue?.tags?.join(", ") || ""}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>
      </div>

      <GalleryUploadField
        name="gallery"
        label="Gallery ảnh"
        defaultValue={initialValue?.gallery || []}
        helpText="Mỗi dòng là một đường dẫn ảnh. Bạn có thể tải trực tiếp nhiều ảnh ngay tại đây."
      />

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/55">Preview SEO</div>
        <div className="mt-4 max-w-3xl">
          <div className="text-lg font-medium text-sky-300">{title || "Tiêu đề dự án"}</div>
          <div className="mt-1 text-sm text-emerald-300">
            https://trongthaievent.com/projects/{projectSlug || "slug-du-an"}
          </div>
          <div className="mt-2 text-sm leading-6 text-white/70">
            {desc || "Mô tả ngắn của dự án sẽ hiển thị ở đây để bạn xem trước cách hiển thị trên tìm kiếm."}
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
