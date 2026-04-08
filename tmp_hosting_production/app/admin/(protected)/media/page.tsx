import Image from "next/image";

import AdminSectionHeader from "../components/AdminSectionHeader";
import { listMedia } from "@/lib/admin-media";

type MediaPageProps = {
  searchParams?: Promise<{ uploaded?: string; error?: string }>;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const files = await listMedia();
  const params = searchParams ? await searchParams : undefined;

  return (
    <main className="mx-auto max-w-7xl px-5 py-6 md:px-6 md:py-8">
      <AdminSectionHeader
        title="Thư viện media"
        description="Upload, quản lý và lấy đường dẫn ảnh để dùng cho dự án, tin tức và các module admin khác."
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Tải file lên</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            File sẽ được lưu vào `public/uploads` và có thể dùng ngay trên website.
          </p>

          {params?.uploaded === "1" ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              Tải file lên thành công.
            </div>
          ) : null}

          {params?.error === "1" ? (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Chưa chọn file hợp lệ.
            </div>
          ) : null}

          <form
            action="/api/admin/media"
            method="post"
            encType="multipart/form-data"
            className="mt-6 grid gap-4"
          >
            <input type="hidden" name="intent" value="upload" />

            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Chọn file</span>
              <input
                type="file"
                name="file"
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:font-semibold file:text-black"
              />
            </label>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Tải lên thư viện
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/60">
            Gợi ý: sau khi upload, copy path dạng `/uploads/ten-file.ext` và dán vào trường ảnh trong `Dự án` hoặc `Tin tức`.
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Tài nguyên đã tải lên</h2>
              <p className="mt-2 text-sm text-white/60">{files.length} file trong thư viện</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {files.map((file) => (
              <article key={file.name} className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
                <div className="relative aspect-[4/3] bg-black">
                  {file.isImage ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-white/45">
                      Không có bản xem trước cho file này
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div className="truncate text-sm font-medium text-white">{file.name}</div>
                  <div className="text-xs text-white/45">{file.url}</div>
                  <div className="text-xs text-white/45">{formatBytes(file.size)}</div>

                  <form action="/api/admin/media" method="post" className="pt-2">
                    <input type="hidden" name="intent" value="delete" />
                    <input type="hidden" name="fileName" value={file.name} />
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-red-400/30 px-4 text-sm text-red-200 transition hover:bg-red-500/10"
                    >
                      Xóa file
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
