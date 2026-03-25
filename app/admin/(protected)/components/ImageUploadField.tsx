"use client";

import { useId, useState } from "react";
import Image from "next/image";

type ImageUploadFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  helpText?: string;
};

export default function ImageUploadField({
  label,
  name,
  defaultValue = "",
  required,
  helpText,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
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
      if (!data.url) {
        throw new Error("missing_url");
      }

      setValue(data.url);
    } catch {
      setError("Tải ảnh thất bại. Bạn thử lại giúp mình.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-3">
      <label className="block">
        <span className="mb-2 block text-sm text-white/70">{label}</span>
        <input
          id={inputId}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required={required}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={`${inputId}-file`}
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-white/10 px-5 text-sm font-medium text-white transition hover:border-yellow-400/40 hover:bg-white/5"
        >
          {isUploading ? "Đang tải ảnh..." : "Tải ảnh trực tiếp"}
        </label>
        <input
          id={`${inputId}-file`}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <span className="text-xs text-white/45">
          Có thể tải lên ngay trong form hoặc dán đường dẫn ảnh đã có.
        </span>
      </div>

      {helpText ? <div className="text-xs text-white/45">{helpText}</div> : null}
      {error ? <div className="text-sm text-red-300">{error}</div> : null}

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={value}
              alt={label}
              fill
              sizes="(min-width: 768px) 480px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="mt-3 break-all text-xs text-white/45">{value}</div>
        </div>
      ) : null}
    </div>
  );
}
