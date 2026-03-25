"use client";

import { useState } from "react";

type GalleryUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string[];
  helpText?: string;
};

function normalizeLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function GalleryUploadField({
  name,
  label,
  defaultValue = [],
  helpText,
}: GalleryUploadFieldProps) {
  const [value, setValue] = useState(defaultValue.join("\n"));
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setError("");
    setIsUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("intent", "upload");
        formData.append("file", file);

        const response = await fetch("/api/admin/media?mode=json", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("upload_failed");
        }

        const data = (await response.json()) as { url?: string };
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      const merged = [...normalizeLines(value), ...uploadedUrls];
      setValue(Array.from(new Set(merged)).join("\n"));
    } catch {
      setError("Tải gallery thất bại. Bạn thử lại giúp mình.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <label className="block">
        <span className="mb-2 block text-sm text-white/70">{label}</span>
        <textarea
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-white/10 px-5 text-sm font-medium text-white transition hover:border-yellow-400/40 hover:bg-white/5">
          {isUploading ? "Đang tải gallery..." : "Tải nhiều ảnh gallery"}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <span className="text-xs text-white/45">
          Chọn nhiều ảnh một lần, hệ thống sẽ tự chèn đường dẫn vào ô gallery.
        </span>
      </div>

      {helpText ? <div className="text-xs text-white/45">{helpText}</div> : null}
      {error ? <div className="text-sm text-red-300">{error}</div> : null}

      {normalizeLines(value).length ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm text-white/60">Đã thêm {normalizeLines(value).length} ảnh vào gallery</div>
          <div className="mt-3 space-y-2 text-xs text-white/45">
            {normalizeLines(value).map((item) => (
              <div key={item} className="break-all">
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
