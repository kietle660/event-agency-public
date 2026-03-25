import { getCurrentLocale } from "@/lib/site-locale";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Footer() {
  const settings = await getSiteSettings();
  const locale = await getCurrentLocale();
  const isEnglish = locale === "en";
  const facebookPageUrl = settings.facebookUrl?.trim();
  const facebookEmbedUrl = facebookPageUrl
    ? `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
        facebookPageUrl,
      )}&tabs=timeline&width=340&height=180&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`
    : null;

  const socialLinks = [
    { label: "Facebook", href: settings.facebookUrl },
    { label: "Instagram", href: settings.instagramUrl },
    { label: "TikTok", href: settings.tiktokUrl },
    { label: "YouTube", href: settings.youtubeUrl },
  ].filter((item) => item.href);

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[140px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/90" />

      <div className="relative container mx-auto px-6 pb-16 pt-24">
        <div className="mb-20 max-w-3xl">
          <h3 className="text-3xl font-semibold leading-tight md:text-4xl">
            {isEnglish ? "We do more than organize events." : "Chúng tôi không chỉ tổ chức sự kiện."}
            <br />
            <span className="text-yellow-400">
              {isEnglish ? "We create memorable experiences." : "Chúng tôi tạo ra trải nghiệm đáng nhớ."}
            </span>
          </h3>

          <p className="mt-6 text-lg text-white/70">
            {isEnglish
              ? `${settings.siteName} is a trusted partner for brands in important moments, from conferences to large-scale launch events.`
              : `${settings.siteName} là đối tác đồng hành cùng thương hiệu trong những khoảnh khắc quan trọng, từ hội nghị đến lễ ra mắt dự án quy mô lớn.`}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="text-2xl font-semibold tracking-wide">{settings.siteName}</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {isEnglish
                ? "A professional, creative, and effective event agency. We help brands turn ideas into reality."
                : "Event agency chuyên nghiệp, sáng tạo và hiệu quả. Đồng hành cùng thương hiệu từ ý tưởng đến hiện thực."}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-medium">{isEnglish ? "Contact" : "Liên hệ"}</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>{settings.hotline}</li>
              <li>{settings.contactEmail}</li>
              <li>{settings.address}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium">{isEnglish ? "Social" : "Mạng xã hội"}</h4>
            {facebookEmbedUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <iframe
                  title="Fanpage Facebook"
                  src={facebookEmbedUrl}
                  width="340"
                  height="180"
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="block min-h-[180px] w-full rounded-xl border-0 bg-white"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/60">
                {isEnglish
                  ? "Manage Facebook, Instagram, TikTok, and YouTube links directly in Website Settings."
                  : "Quản lý link Facebook, Instagram, TikTok và YouTube trực tiếp trong phần Cài đặt website."}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-white/40 md:flex-row">
          <div>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</div>
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-yellow-400/60"
                aria-label={item.label}
              >
                <span className="text-white/70 transition group-hover:text-yellow-400">
                  {item.label[0]}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
