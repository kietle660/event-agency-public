import type { Metadata } from "next";
import Link from "next/link";

import { getCurrentLocale } from "@/lib/site-locale";
import { getSiteSettings } from "@/lib/site-settings";

import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Gửi yêu cầu báo giá và tư vấn tổ chức sự kiện cùng TRỌNG THÁI EVENT. Chúng tôi phản hồi trong vòng 24h.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const locale = await getCurrentLocale();
  const isEnglish = locale === "en";
  const phoneHref = `tel:${settings.hotline.replace(/\s+/g, "")}`;
  const emailHref = `mailto:${settings.contactEmail}`;
  const facebookPageUrl = settings.facebookUrl?.trim();
  const facebookEmbedUrl = facebookPageUrl
    ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
        facebookPageUrl,
      )}&tabs=timeline&width=500&height=220&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`
    : null;

  return (
    <main className="bg-neutral-950 text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[150px]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black to-black" />

        <section className="relative container mx-auto px-6 pb-10 pt-28">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold tracking-[0.28em] text-white/60">
              {isEnglish ? "CONTACT" : "LIÊN HỆ"}
            </div>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
              {isEnglish ? "Get event consultation and quote " : "Nhận tư vấn và báo giá "}
              <span className="text-yellow-400">{isEnglish ? "within 24 hours" : "trong 24h"}</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              {isEnglish
                ? "Tell us about your event type, preferred timing, location, and guest count. Our team will respond quickly with a suitable plan and quotation."
                : "Cho chúng tôi biết loại sự kiện, thời gian dự kiến, địa điểm và số lượng khách. Team sẽ phản hồi nhanh với phương án phù hợp ngân sách."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={phoneHref}
                className="inline-flex h-11 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/10 px-5 transition hover:bg-yellow-500/15"
              >
                {isEnglish ? "Call Hotline" : "Gọi hotline"}
              </Link>
              <Link
                href={emailHref}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 transition hover:bg-white/10"
              >
                {isEnglish ? "Send Email" : "Gửi email"}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="container mx-auto px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-8">
              <h2 className="text-2xl font-semibold">
                {isEnglish ? "Send your request" : "Gửi yêu cầu"}
              </h2>
              <p className="mt-2 text-white/70">
                {isEnglish
                  ? "Fill in the information below and we will get back to you as soon as possible."
                  : "Điền thông tin để chúng tôi liên hệ lại sớm nhất."}
              </p>

              <div className="mt-6">
                <ContactForm locale={locale} />
              </div>

              <p className="mt-4 text-xs text-white/50">
                {isEnglish
                  ? "By submitting this form, you agree to let TRỌNG THÁI EVENT contact you for consultation."
                  : "Bằng việc gửi form, bạn đồng ý để TRỌNG THÁI EVENT liên hệ tư vấn."}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <h3 className="text-xl font-semibold">
                {isEnglish ? "Contact information" : "Thông tin liên hệ"}
              </h3>

              <ul className="mt-5 space-y-4 text-white/80">
                <li className="flex gap-3">
                  <span className="text-yellow-400">Hotline</span>
                  <div>
                    <div className="text-sm text-white/60">
                      {isEnglish ? "Phone" : "Điện thoại"}
                    </div>
                    <a className="hover:text-white" href={phoneHref}>
                      {settings.hotline}
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="text-yellow-400">Email</span>
                  <div>
                    <div className="text-sm text-white/60">
                      {isEnglish ? "Mailbox" : "Hòm thư"}
                    </div>
                    <a className="break-all hover:text-white" href={emailHref}>
                      {settings.contactEmail}
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="text-yellow-400">
                    {isEnglish ? "Address" : "Địa chỉ"}
                  </span>
                  <div>
                    <div className="text-sm text-white/60">
                      {isEnglish ? "Office" : "Văn phòng"}
                    </div>
                    <div>{settings.address}</div>
                  </div>
                </li>
              </ul>

              <div className="mt-7 grid gap-3">
                <a
                  href="https://maps.app.goo.gl/DaKoAVV57GaxJfLF7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                >
                  {isEnglish ? "Open Google Maps" : "Mở Google Maps"}
                </a>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <iframe
                    title="TRỌNG THÁI EVENT Map"
                    src="https://www.google.com/maps?q=TR%E1%BB%8CNG%20TH%C3%81I%20EVENT%20Long%20Th%C3%A0nh%20%C4%90%E1%BB%93ng%20Nai&output=embed"
                    className="h-[240px] w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {facebookEmbedUrl ? (
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                    <iframe
                      title="Fanpage Facebook"
                      src={facebookEmbedUrl}
                      width="500"
                      height="220"
                      loading="lazy"
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      className="block min-h-[220px] w-full rounded-xl border-0 bg-white"
                    />
                  </div>
                ) : null}
              </div>

              <div className="mt-8 rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-5">
                <div className="font-semibold">
                  {isEnglish ? "Working hours" : "Giờ làm việc"}
                </div>
                <div className="mt-2 text-sm text-white/75">
                  {isEnglish ? "Mon - Sun: 08:00 - 20:00" : "Thứ 2 - CN: 08:00 - 20:00"}
                  <br />
                  {isEnglish
                    ? "Messages are answered within 24 hours."
                    : "Phản hồi tin nhắn trong vòng 24h."}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
