"use client";

import type { SiteSettings } from "@/lib/site-settings";

import ImageUploadField from "./ImageUploadField";

type WebsiteSettingsFormProps = {
  settings: SiteSettings;
  activeSection: SectionId;
};

const sections = [
  { id: "basic", label: "Cơ bản" },
  { id: "slider", label: "Slider" },
  { id: "partners", label: "Đối tác" },
  { id: "testimonials", label: "Đánh giá" },
] as const;

type SectionId = (typeof sections)[number]["id"] | "accounts";

function sectionClass(activeSection: SectionId, sectionId: SectionId) {
  return activeSection === sectionId ? "block" : "hidden";
}

export default function WebsiteSettingsForm({
  settings,
  activeSection,
}: WebsiteSettingsFormProps) {
  return (
    <form
      action="/api/admin/settings"
      method="post"
      className="rounded-[28px] border border-white/10 bg-white/5 p-6"
    >
      <div className="border-b border-white/10 pb-5">
        <h2 className="text-xl font-semibold">Thông tin website</h2>
        <p className="mt-2 text-sm text-white/60">
          Chọn mục con dưới menu Cài đặt ở sidebar để chỉnh từng nhóm nội dung gọn hơn.
        </p>
      </div>

      <div className={`mt-6 ${sectionClass(activeSection, "basic")}`}>
        <h3 className="text-lg font-semibold">Cài đặt cơ bản</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tên website</span>
            <input
              name="siteName"
              defaultValue={settings.siteName}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Tên miền chính</span>
            <input
              name="siteUrl"
              defaultValue={settings.siteUrl}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <div className="mt-4">
          <ImageUploadField
            label="Logo website"
            name="logoUrl"
            defaultValue={settings.logoUrl}
            required
            helpText="Logo này sẽ được dùng cho header và các khu vực nhận diện thương hiệu."
          />
        </div>

        <div className="mt-4">
          <ImageUploadField
            label="Logo bảng báo giá"
            name="quoteLogoUrl"
            defaultValue={settings.quoteLogoUrl || settings.logoUrl}
            required
            helpText="Logo này chỉ dùng cho báo giá và file PDF, không thay đổi logo website."
          />
        </div>

        <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
          <h4 className="text-base font-semibold text-white">Thông tin công ty cho báo giá</h4>
          <p className="mt-2 text-sm text-white/55">
            Nhóm này chỉ áp dụng cho module báo giá và file PDF.
          </p>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-white/70">Tên công ty trên báo giá</span>
            <input
              name="quoteCompanyName"
              defaultValue={settings.quoteCompanyName || settings.siteName}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Mã số thuế</span>
              <input
                name="quoteTaxCode"
                defaultValue={settings.quoteTaxCode || ""}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-white/70">Hotline báo giá</span>
              <input
                name="quoteHotline"
                defaultValue={settings.quoteHotline || settings.hotline}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-white/70">Email báo giá</span>
            <input
              name="quoteEmail"
              defaultValue={settings.quoteEmail || settings.contactEmail}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-white/70">Địa chỉ báo giá</span>
            <textarea
              name="quoteAddress"
              defaultValue={settings.quoteAddress || settings.address}
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Tiêu đề SEO mặc định</span>
          <input
            name="defaultTitle"
            defaultValue={settings.defaultTitle}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Mô tả SEO mặc định</span>
          <textarea
            name="defaultDescription"
            defaultValue={settings.defaultDescription}
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Mã Google Analytics (GA4)</span>
          <input
            name="googleAnalyticsId"
            defaultValue={settings.googleAnalyticsId || ""}
            placeholder="Ví dụ: G-JZ55K9763Z"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Hotline</span>
            <input
              name="hotline"
              defaultValue={settings.hotline}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Email nhận lead</span>
            <input
              name="contactEmail"
              defaultValue={settings.contactEmail}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-white/70">Địa chỉ</span>
          <textarea
            name="address"
            defaultValue={settings.address}
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
          />
        </label>

        <h3 className="mt-6 text-lg font-semibold">Mạng xã hội</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Facebook</span>
            <input
              name="facebookUrl"
              defaultValue={settings.facebookUrl}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Instagram</span>
            <input
              name="instagramUrl"
              defaultValue={settings.instagramUrl}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">TikTok</span>
            <input
              name="tiktokUrl"
              defaultValue={settings.tiktokUrl}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">YouTube</span>
            <input
              name="youtubeUrl"
              defaultValue={settings.youtubeUrl}
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
            />
          </label>
        </div>
      </div>

      <div className={`mt-6 ${sectionClass(activeSection, "slider")}`}>
        <h3 className="text-lg font-semibold">Slider trang chủ</h3>
        <div className="mt-4 space-y-6">
          {settings.heroSlides.map((slide, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-white/10 bg-black/20 p-5"
            >
              <div className="text-sm font-semibold text-white">Slide {index + 1}</div>

              <div className="mt-4">
                <ImageUploadField
                  label="Ảnh slide"
                  name={`heroSlide${index + 1}Image`}
                  defaultValue={slide.image}
                  required
                  helpText="Nên dùng ảnh ngang chất lượng cao để hiển thị đẹp trên hero slider."
                />
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Kicker tiếng Việt</span>
                  <input
                    name={`heroSlide${index + 1}Kicker`}
                    defaultValue={slide.kicker}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Kicker tiếng Anh</span>
                  <input
                    name={`heroSlide${index + 1}KickerEn`}
                    defaultValue={slide.kickerEn || ""}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/70">Tiêu đề slide tiếng Việt</span>
                <textarea
                  name={`heroSlide${index + 1}Title`}
                  defaultValue={slide.title}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/70">Tiêu đề slide tiếng Anh</span>
                <textarea
                  name={`heroSlide${index + 1}TitleEn`}
                  defaultValue={slide.titleEn || ""}
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </label>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Mô tả tiếng Việt</span>
                  <input
                    name={`heroSlide${index + 1}Desc`}
                    defaultValue={slide.desc}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Mô tả tiếng Anh</span>
                  <input
                    name={`heroSlide${index + 1}DescEn`}
                    defaultValue={slide.descEn || ""}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">CTA label tiếng Việt</span>
                  <input
                    name={`heroSlide${index + 1}CtaLabel`}
                    defaultValue={slide.ctaLabel}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">CTA label tiếng Anh</span>
                  <input
                    name={`heroSlide${index + 1}CtaLabelEn`}
                    defaultValue={slide.ctaLabelEn || ""}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/70">CTA link</span>
                <input
                  name={`heroSlide${index + 1}CtaHref`}
                  defaultValue={slide.ctaHref}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 ${sectionClass(activeSection, "partners")}`}>
        <h3 className="text-lg font-semibold">Logo đối tác</h3>
        <div className="mt-4 space-y-6">
          {settings.partnerItems.map((partner, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-white/10 bg-black/20 p-5"
            >
              <div className="text-sm font-semibold text-white">Đối tác {index + 1}</div>
              <div className="mt-4">
                <ImageUploadField
                  label="Logo đối tác"
                  name={`partner${index + 1}Logo`}
                  defaultValue={partner.logo}
                  required
                  helpText="Tải logo hoặc dán đường dẫn có sẵn."
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Tên đối tác</span>
                  <input
                    name={`partner${index + 1}Name`}
                    defaultValue={partner.name}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Link đối tác</span>
                  <input
                    name={`partner${index + 1}Href`}
                    defaultValue={partner.href || ""}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/70">Kích thước logo</span>
                <select
                  name={`partner${index + 1}Size`}
                  defaultValue={partner.size || "md"}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                >
                  <option value="sm">Nhỏ</option>
                  <option value="md">Vừa</option>
                  <option value="lg">Lớn</option>
                </select>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={`mt-6 ${sectionClass(activeSection, "testimonials")}`}>
        <h3 className="text-lg font-semibold">Cảm nhận khách hàng</h3>
        <div className="mt-4 space-y-6">
          {settings.testimonialItems.map((item, index) => (
            <div
              key={index}
              className="rounded-[24px] border border-white/10 bg-black/20 p-5"
            >
              <div className="text-sm font-semibold text-white">Đánh giá {index + 1}</div>
              <div className="mt-4">
                <ImageUploadField
                  label="Avatar khách hàng"
                  name={`testimonial${index + 1}Avatar`}
                  defaultValue={item.avatar}
                  required
                  helpText="Ảnh đại diện hiển thị trong slider đánh giá."
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Tên khách hàng</span>
                  <input
                    name={`testimonial${index + 1}Name`}
                    defaultValue={item.name}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm text-white/70">Chức vụ</span>
                  <input
                    name={`testimonial${index + 1}Role`}
                    defaultValue={item.role}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/70">Công ty</span>
                <input
                  name={`testimonial${index + 1}Company`}
                  defaultValue={item.company}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </label>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm text-white/70">Nội dung đánh giá</span>
                <textarea
                  name={`testimonial${index + 1}Content`}
                  defaultValue={item.content}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-400"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-full bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          Lưu cài đặt website
        </button>
        <div className="text-sm text-white/50">
          Đang chỉnh mục: {sections.find((item) => item.id === activeSection)?.label}
        </div>
      </div>
    </form>
  );
}
