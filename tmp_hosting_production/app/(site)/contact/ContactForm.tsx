"use client";

import React from "react";

import type { SiteLocale } from "@/lib/site-locale";

type FormState = {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  date: string;
  location: string;
  guests: string;
  budget: string;
  message: string;
};

const initial: FormState = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  date: "",
  location: "",
  guests: "",
  budget: "",
  message: "",
};

export default function ContactForm({ locale = "vi" }: { locale?: SiteLocale }) {
  const [data, setData] = React.useState<FormState>(initial);
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const isEnglish = locale === "en";

  const onChange =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      setData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = () => {
    if (!data.name.trim()) {
      return isEnglish ? "Please enter your full name." : "Vui lòng nhập họ tên.";
    }
    if (!data.phone.trim()) {
      return isEnglish ? "Please enter your phone number." : "Vui lòng nhập số điện thoại.";
    }
    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      return isEnglish ? "Invalid email format." : "Email chưa đúng định dạng.";
    }
    if (!data.eventType.trim()) {
      return isEnglish ? "Please select event type." : "Vui lòng chọn loại sự kiện.";
    }
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDone(null);
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          eventType: data.eventType,
          date: data.date,
          location: data.location,
          guests: data.guests,
          budget: data.budget,
          message: data.message,
        }),
      });

      const json = await res
        .json()
        .catch(() => ({} as { ok?: boolean; error?: string }));

      if (!res.ok || !json.ok) {
        throw new Error(
          json.error ||
            (isEnglish ? "Submit failed. Please try again." : "Gửi thất bại. Vui lòng thử lại."),
        );
      }

      setDone(
        isEnglish
          ? "Request sent successfully. Our team will contact you within 24 hours."
          : "Đã gửi yêu cầu. Team sẽ liên hệ lại trong 24h.",
      );
      setData(initial);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : isEnglish
            ? "Something went wrong. Please try again."
            : "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-100">
          {error}
        </div>
      )}
      {done && (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-sm text-emerald-100">
          {done}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label={isEnglish ? "Full name *" : "Họ và tên *"}>
          <input
            value={data.name}
            onChange={onChange("name")}
            className={inputCls}
            placeholder={isEnglish ? "John Doe" : "Nguyễn Văn A"}
          />
        </Field>

        <Field label={isEnglish ? "Phone number *" : "Số điện thoại *"}>
          <input
            value={data.phone}
            onChange={onChange("phone")}
            className={inputCls}
            placeholder="090xxxxxxx"
          />
        </Field>

        <Field label={isEnglish ? "Email (optional)" : "Email (tuỳ chọn)"}>
          <input
            value={data.email}
            onChange={onChange("email")}
            className={inputCls}
            placeholder="email@domain.com"
          />
        </Field>

        <Field label={isEnglish ? "Event type *" : "Loại sự kiện *"}>
          <select value={data.eventType} onChange={onChange("eventType")} className={inputCls}>
            <option value="">
              {isEnglish ? "Select event type" : "Chọn loại sự kiện"}
            </option>
            <option>{isEnglish ? "Conference • Seminar" : "Hội nghị • Hội thảo"}</option>
            <option>{isEnglish ? "Grand Opening • Inauguration" : "Khai trương • Khánh thành"}</option>
            <option>Team Building</option>
            <option>Year End Party</option>
            <option>{isEnglish ? "Wedding" : "Tiệc cưới"}</option>
            <option>{isEnglish ? "Other" : "Khác"}</option>
          </select>
        </Field>

        <Field label={isEnglish ? "Preferred schedule" : "Thời gian dự kiến"}>
          <input
            value={data.date}
            onChange={onChange("date")}
            className={inputCls}
            placeholder={isEnglish ? "Example: 10/2026" : "VD: 10/2026"}
          />
        </Field>

        <Field label={isEnglish ? "Location" : "Địa điểm"}>
          <input
            value={data.location}
            onChange={onChange("location")}
            className={inputCls}
            placeholder={isEnglish ? "Example: Dong Nai / HCMC" : "VD: Đồng Nai / TP.HCM"}
          />
        </Field>

        <Field label={isEnglish ? "Number of guests" : "Số lượng khách"}>
          <input
            value={data.guests}
            onChange={onChange("guests")}
            className={inputCls}
            placeholder="200"
          />
        </Field>

        <Field label={isEnglish ? "Estimated budget" : "Ngân sách dự kiến"}>
          <input
            value={data.budget}
            onChange={onChange("budget")}
            className={inputCls}
            placeholder={isEnglish ? "Example: 200-300 million VND" : "VD: 200-300 triệu"}
          />
        </Field>
      </div>

      <Field label={isEnglish ? "Project brief" : "Yêu cầu chi tiết"}>
        <textarea
          value={data.message}
          onChange={onChange("message")}
          className={`${inputCls} min-h-[120px] resize-y`}
          placeholder={
            isEnglish
              ? "Describe event goals, required services, equipment, manpower, or anything else we should know..."
              : "Mô tả mục tiêu sự kiện, hạng mục cần triển khai, yêu cầu thiết bị hoặc nhân sự..."
          }
        />
      </Field>

      <button
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-yellow-500/45 bg-yellow-500/12 px-6 transition hover:bg-yellow-500/18 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {loading
          ? isEnglish
            ? "Sending..."
            : "Đang gửi..."
          : isEnglish
            ? "Send Request"
            : "Gửi yêu cầu"}
      </button>

      <div className="text-xs text-white/50">
        {isEnglish ? "Or contact us directly:" : "Hoặc nhắn trực tiếp:"}{" "}
        <a className="text-yellow-300 hover:text-yellow-200" href="tel:0909844303">
          090 984 43 03
        </a>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-sm font-medium text-white/80">{label}</div>
      {children}
    </label>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border border-white/10 bg-black/30 px-4 text-white/90 outline-none transition placeholder:text-white/35 focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/15";
